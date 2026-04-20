import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import type { BrandContext, ThemeVariant } from "@/lib/brandContext";
import { getTemplate } from "@/templates";
import { putSite, putSiteBrand, slugIsTaken } from "@/lib/siteStore";
import { slugify, uniqueSlug } from "@/lib/slug";
import { humanize } from "@/lib/humanize";
import type { Site } from "@/templates/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HAS_API_KEY = !!process.env.ANTHROPIC_API_KEY;
const USE_DEMO_MODE = process.env.USE_DEMO_MODE === "true" || !HAS_API_KEY;

const BASE_DOMAIN = process.env.NEXT_PUBLIC_NERTIA_DOMAIN ?? "nertia.ai";

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
  templateId: z.string().default("precedent"),
  brandContext: z.object({
    purpose: z.string().optional(),
    audience: z.string().optional(),
    vibeWords: z.array(z.string()).optional(),
    adaptive: z.array(
      z.object({ question: z.string(), answer: z.string() }),
    ),
  }),
  finalVariant: ThemeVariantSchema,
  slug: z.string().optional(),
});

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

    const { templateId, brandContext, finalVariant } = parsed.data;
    const template = getTemplate(templateId);
    if (!template) {
      return NextResponse.json(
        { error: `template not found: ${templateId}` },
        { status: 400 },
      );
    }

    const copy = USE_DEMO_MODE
      ? demoCopy(brandContext, template.copySchema.map((f) => f.key))
      : await generateCopy(brandContext, finalVariant, template.copySchema);

    let slug: string;
    if (parsed.data.slug) {
      slug = slugify(parsed.data.slug);
      if (await slugIsTaken(slug)) {
        return NextResponse.json({ error: "slug taken" }, { status: 409 });
      }
    } else {
      slug = await uniqueSlug(templateId, slugIsTaken);
    }

    const site: Site = { slug, templateId, copy };
    await putSite(site);
    await putSiteBrand(slug, {
      brandContext,
      themeVariant: finalVariant,
    });

    return NextResponse.json({
      slug,
      url: `https://${slug}.${BASE_DOMAIN}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/intake/finalize] error:", message);
    return NextResponse.json(
      { error: "server error", detail: message },
      { status: 500 },
    );
  }
}

function demoCopy(
  ctx: BrandContext,
  keys: string[],
): Record<string, string> {
  const firstVibe = (ctx.vibeWords ?? ["focused"])[0];
  const map: Record<string, string> = {
    "hero.pill": "New",
    "hero.headline": ctx.purpose ?? "Something worth your attention.",
    "hero.sub":
      `For ${ctx.audience ?? "people who get it"}. Built to feel ${firstVibe}.`,
    "hero.primaryCtaLabel": "Begin",
    "hero.primaryCtaHref": "#start",
    "hero.secondaryCtaLabel": "Learn more",
    "hero.secondaryCtaHref": "#about",
  };
  const out: Record<string, string> = {};
  for (const key of keys) {
    if (map[key]) out[key] = map[key];
  }
  return out;
}

async function generateCopy(
  ctx: BrandContext,
  variant: ThemeVariant,
  schema: { key: string; label: string; required?: boolean; maxLength?: number }[],
): Promise<Record<string, string>> {
  const client = new Anthropic();
  const schemaDescription = schema
    .map(
      (f) =>
        `- ${f.key} (${f.label}${f.required ? ", required" : ""}${f.maxLength ? `, max ${f.maxLength} chars` : ""})`,
    )
    .join("\n");
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Write site copy for a new website.

Brand context:
- Purpose: ${ctx.purpose}
- Audience: ${ctx.audience}
- Vibe words: ${(ctx.vibeWords ?? []).join(", ")}
- Aesthetic direction: ${variant.label}
- Additional answers: ${ctx.adaptive.map((a) => `${a.question} → ${a.answer}`).join(" | ")}

Required copy fields:
${schemaDescription}

Rules:
- NO corporate jargon, NO em-dashes, NO "not just X but Y" tricolons
- Write like a specific human, not a marketer
- Keep each field tight and genuine
- Respect the maxLength constraints

Respond with JSON only: {"<key>": "<value>", ...} using the exact keys listed above.`,
      },
    ],
  });
  const text = msg.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { text: string }).text)
    .join("\n");
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return demoCopy(ctx, schema.map((f) => f.key));
  const raw = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const field of schema) {
    const val = raw[field.key];
    if (typeof val === "string") {
      out[field.key] =
        field.key === "hero.headline" || field.key === "hero.sub"
          ? humanize(val)
          : val;
    }
  }
  return out;
}
