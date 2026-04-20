import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import type { BrandContext, ThemeVariant } from "@/lib/brandContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HAS_API_KEY = !!process.env.ANTHROPIC_API_KEY;
const USE_DEMO_MODE = process.env.USE_DEMO_MODE === "true" || !HAS_API_KEY;

const ThemeVariantSchema = z.object({
  id: z.string(),
  label: z.string(),
  palette: z.object({
    bg: z.string(),
    fg: z.string(),
    muted: z.string(),
    accent: z.string(),
    headingStart: z.string(),
    headingEnd: z.string(),
  }),
  fontPair: z.object({ heading: z.string(), body: z.string() }),
});

const BodySchema = z.object({
  brandContext: z.object({
    purpose: z.string().optional(),
    audience: z.string().optional(),
    vibeWords: z.array(z.string()).optional(),
    adaptive: z.array(
      z.object({ question: z.string(), answer: z.string() }),
    ),
  }),
  round: z.union([z.literal(1), z.literal(2)]),
  pickedVariantId: z.string().optional(),
  previous: z.array(ThemeVariantSchema).optional(),
});

const DEMO_ROUND_1: ThemeVariant[] = [
  {
    id: "void-dark",
    label: "void / dark monospace",
    palette: {
      bg: "#0a0a0a",
      fg: "#f5f5f5",
      muted: "#9ca3af",
      accent: "#00d4ff",
      headingStart: "#ffffff",
      headingEnd: "#7dd3fc",
    },
    fontPair: {
      heading: "'JetBrains Mono', 'SF Mono', monospace",
      body: "'Inter', ui-sans-serif, system-ui",
    },
  },
  {
    id: "warm-editorial",
    label: "warm / editorial serif",
    palette: {
      bg: "#faf7f2",
      fg: "#1f1611",
      muted: "#6b5e53",
      accent: "#b04a2e",
      headingStart: "#1f1611",
      headingEnd: "#5c4030",
    },
    fontPair: {
      heading: "'Fraunces', 'Iowan Old Style', serif",
      body: "'Inter', ui-sans-serif, system-ui",
    },
  },
  {
    id: "clean-technical",
    label: "clean / technical grid",
    palette: {
      bg: "#ffffff",
      fg: "#0a0a0a",
      muted: "#6b7280",
      accent: "#2563eb",
      headingStart: "#0a0a0a",
      headingEnd: "#1e3a8a",
    },
    fontPair: {
      heading: "'Inter', ui-sans-serif, system-ui",
      body: "'Inter', ui-sans-serif, system-ui",
    },
  },
];

const DEMO_ROUND_2_NEIGHBORS: Record<string, ThemeVariant[]> = {
  "void-dark": [
    neighbor("void-dark", "void · cyan emission", { accent: "#00d4ff", headingEnd: "#7dd3fc" }),
    neighbor("void-dark", "void · amber emission", { accent: "#fbbf24", headingEnd: "#fde68a" }),
    neighbor("void-dark", "void · violet emission", { accent: "#a855f7", headingEnd: "#c084fc" }),
  ],
  "warm-editorial": [
    neighbor("warm-editorial", "warm · terracotta", { accent: "#b04a2e" }),
    neighbor("warm-editorial", "warm · olive", { accent: "#6f7e3b" }),
    neighbor("warm-editorial", "warm · indigo ink", { accent: "#2d3a7a" }),
  ],
  "clean-technical": [
    neighbor("clean-technical", "clean · royal blue", { accent: "#2563eb" }),
    neighbor("clean-technical", "clean · emerald", { accent: "#10b981" }),
    neighbor("clean-technical", "clean · coral", { accent: "#f97316" }),
  ],
};

function neighbor(
  baseId: string,
  label: string,
  paletteOverrides: Partial<ThemeVariant["palette"]>,
): ThemeVariant {
  const base = DEMO_ROUND_1.find((v) => v.id === baseId)!;
  return {
    ...base,
    id: `${baseId}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label,
    palette: { ...base.palette, ...paletteOverrides },
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as unknown;
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { round, pickedVariantId } = parsed.data;

    if (USE_DEMO_MODE) {
      if (round === 1) {
        return NextResponse.json({ variants: DEMO_ROUND_1 });
      }
      const neighbors = pickedVariantId
        ? DEMO_ROUND_2_NEIGHBORS[pickedVariantId] ?? DEMO_ROUND_2_NEIGHBORS["void-dark"]
        : DEMO_ROUND_2_NEIGHBORS["void-dark"];
      return NextResponse.json({ variants: neighbors });
    }

    const variants = await generateVariants(parsed.data);
    return NextResponse.json({ variants });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/intake/emerge] error:", message);
    return NextResponse.json(
      { error: "server error", detail: message },
      { status: 500 },
    );
  }
}

async function generateVariants(input: {
  brandContext: BrandContext;
  round: 1 | 2;
  pickedVariantId?: string;
  previous?: ThemeVariant[];
}): Promise<ThemeVariant[]> {
  const { brandContext: ctx, round, pickedVariantId, previous } = input;
  const pickedVariant = previous?.find((v) => v.id === pickedVariantId);

  const prompt =
    round === 1
      ? round1Prompt(ctx)
      : round2Prompt(ctx, pickedVariant ?? null);

  const client = new Anthropic();
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });
  const text = msg.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { text: string }).text)
    .join("\n");
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return round === 1 ? DEMO_ROUND_1 : DEMO_ROUND_2_NEIGHBORS["void-dark"];
  const parsed = JSON.parse(jsonMatch[0]) as { variants?: ThemeVariant[] };
  if (!Array.isArray(parsed.variants) || parsed.variants.length !== 3) {
    return round === 1 ? DEMO_ROUND_1 : DEMO_ROUND_2_NEIGHBORS["void-dark"];
  }
  return parsed.variants.slice(0, 3);
}

function round1Prompt(ctx: BrandContext): string {
  return `You are an art director helping crystallize a brand aesthetic.

Given this brand context:
- Purpose: ${ctx.purpose ?? "(unknown)"}
- Audience: ${ctx.audience ?? "(unknown)"}
- Vibe words: ${(ctx.vibeWords ?? []).join(", ")}
- Additional: ${ctx.adaptive.map((a) => `${a.question} → ${a.answer}`).join(" | ")}

Produce exactly 3 VISUALLY DIVERSE ThemeVariant options spanning the aesthetic space. They should feel like genuinely different directions, not minor variations.

Each variant must have:
- id: short kebab-case slug (e.g. "void-dark", "warm-editorial")
- label: 3–5 word human-readable description
- palette: { bg, fg, muted, accent, headingStart, headingEnd } (all 6 fields, hex colors)
- fontPair: { heading, body } — use Google Fonts or safe web stacks. Prefer distinctive pairings (Fraunces, IBM Plex, Space Mono, Inter, JetBrains Mono). Avoid generic "Arial" / "Helvetica".

Respond with JSON only: {"variants": [...]}`;
}

function round2Prompt(ctx: BrandContext, picked: ThemeVariant | null): string {
  return `You are narrowing a brand aesthetic. The user picked this direction in round 1:

${picked ? JSON.stringify(picked, null, 2) : "(no pick info — invent sensible neighbors)"}

Produce exactly 3 NEIGHBOR ThemeVariants — tighter refinements of the picked direction. Keep the same overall mood, but vary ONE dimension: accent color OR heading font OR heading gradient. Do not change mode (light vs dark) or body font unless necessary.

Brand context for reference:
- Vibe words: ${(ctx.vibeWords ?? []).join(", ")}

Respond with JSON only: {"variants": [...]}  (same schema as round 1)`;
}
