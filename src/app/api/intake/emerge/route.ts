import { NextResponse } from "next/server";
import { z } from "zod";
import type { BrandContext } from "@/lib/brandContext";
import { pickThreeForEmerge } from "@/lib/palette";
import { pickFontPair } from "@/lib/fontPair";
import { pickComposition } from "@/compositions";
import { getSection } from "@/sections";
import type { CompositionDef } from "@/compositions";
import { type EmergeVariant } from "@/lib/emerge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HandleSchema = z.object({
    platform: z.string(),
    handle: z.string(),
    url: z.string(),
});

const BrandContextSchema = z.object({
    purpose: z.string().optional(),
    vibes: z.array(z.string()).optional(),
    handles: z.array(HandleSchema).optional(),
});

const BodySchema = z.object({
    brandContext: BrandContextSchema,
});

/**
 * Single-round emerge — zero LLM. Returns 3 visually distinct palette variants
 * all bound to the composition + font pair picked for the brand context.
 */
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
        const { brandContext } = parsed.data;

        const composition = pickComposition(brandContext as BrandContext);
        const fontPair = pickFontPair(brandContext as BrandContext);
        const previewHeadline = buildPreviewHeadline(brandContext as BrandContext, composition);
        const palettes = pickThreeForEmerge(brandContext as BrandContext);

        const variants: EmergeVariant[] = palettes.map((palette, i) => ({
            id: `emerge-${composition.id}-${i}`,
            label: `${composition.displayName} · variant ${i + 1}`,
            palette,
            fontPair,
            compositionId: composition.id,
            compositionLabel: composition.displayName,
            previewHeadline,
        }));

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

function buildPreviewHeadline(
    ctx: BrandContext,
    composition: CompositionDef,
): string {
    const heroInstance = composition.sections.find((s) => {
        const section = getSection(s.id);
        return section?.meta.family === "hero" || section?.meta.family === "links";
    });
    const target = heroInstance ?? composition.sections[0];
    if (!target) return "";
    const section = getSection(target.id);
    if (!section) return "";
    const copy = section.writeCopy(ctx);
    return copy.headline ?? copy.name ?? copy.heading ?? "";
}
