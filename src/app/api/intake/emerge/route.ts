import { NextResponse } from "next/server";
import { z } from "zod";
import type { BrandContext } from "@/lib/brandContext";
import { pickThreeForEmerge, emergeNeighbors } from "@/lib/palette";
import { pickFontPair } from "@/lib/fontPair";
import { pickComposition } from "@/compositions";
import { getSection } from "@/sections";
import type { CompositionDef } from "@/compositions";
import { EmergeVariantSchema, type EmergeVariant } from "@/lib/emerge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BrandContextSchema = z.object({
    purpose: z.string().optional(),
    audience: z.string().optional(),
    vibeWords: z.array(z.string()).optional(),
    adaptive: z.array(
        z.object({ question: z.string(), answer: z.string() }),
    ),
});

const BodySchema = z.object({
    brandContext: BrandContextSchema,
    round: z.union([z.literal(1), z.literal(2)]),
    pickedVariantId: z.string().optional(),
    previous: z.array(EmergeVariantSchema).optional(),
});

/**
 * Deterministic emerge — zero LLM. Round 1 returns 3 visually distinct
 * palette variants all bound to the composition + font pair picked for the
 * brand context. Round 2 returns 3 accent-hue neighbors of whichever variant
 * the user selected in round 1.
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

        const { brandContext, round, pickedVariantId, previous } = parsed.data;

        if (round === 1) {
            const composition = pickComposition(brandContext);
            const fontPair = pickFontPair(brandContext);
            const previewHeadline = buildPreviewHeadline(brandContext, composition);
            const palettes = pickThreeForEmerge(brandContext);

            const variants: EmergeVariant[] = palettes.map((palette, i) => ({
                id: `r1-${composition.id}-${i}`,
                label: `${composition.displayName} · variant ${i + 1}`,
                palette,
                fontPair,
                compositionId: composition.id,
                compositionLabel: composition.displayName,
                previewHeadline,
            }));

            return NextResponse.json({ variants });
        }

        // round === 2 — neighbors of the picked variant
        const picked = previous?.find((v) => v.id === pickedVariantId);
        if (!picked) {
            return NextResponse.json(
                { error: "missing picked variant for round 2" },
                { status: 400 },
            );
        }

        const neighborPalettes = emergeNeighbors(picked.palette);
        const variants: EmergeVariant[] = neighborPalettes.map((palette, i) => ({
            id: `r2-${picked.compositionId}-${i}`,
            label: `${picked.compositionLabel} · refinement ${i + 1}`,
            palette,
            fontPair: picked.fontPair,
            compositionId: picked.compositionId,
            compositionLabel: picked.compositionLabel,
            previewHeadline: picked.previewHeadline,
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

/**
 * Preview headline = the hero section's composed headline (or the first
 * meaningful copy value from whatever section leads the composition).
 * Used purely for display in the emerge cards; the final site uses
 * the full writeCopy pass.
 */
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
