import { NextResponse } from "next/server";
import { z } from "zod";
import { getComposition } from "@/compositions";
import { putSite, putSiteBrand, slugIsTaken } from "@/lib/siteStore";
import { slugify, uniqueSlug } from "@/lib/slug";
import { writeCopy } from "@/lib/writeCopy";
import { EmergeVariantSchema } from "@/lib/emerge";
import type { CompositionSite } from "@/lib/siteShapes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_NERTIA_DOMAIN ?? "nertia.ai";

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
    finalVariant: EmergeVariantSchema,
    slug: z.string().optional(),
});

/**
 * Writes a composition-shaped site to Firebase. Zero LLM — composition +
 * tokens come from the picked emerge variant; copy comes from the
 * deterministic writeCopy pass over the brand context.
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

        const { brandContext, finalVariant } = parsed.data;
        const compDef = getComposition(finalVariant.compositionId);
        if (!compDef) {
            return NextResponse.json(
                { error: `unknown composition: ${finalVariant.compositionId}` },
                { status: 400 },
            );
        }

        let slug: string;
        if (parsed.data.slug) {
            slug = slugify(parsed.data.slug);
            if (await slugIsTaken(slug)) {
                return NextResponse.json({ error: "slug taken" }, { status: 409 });
            }
        } else {
            slug = await uniqueSlug(finalVariant.compositionId, slugIsTaken);
        }

        const site: CompositionSite = {
            slug,
            composition: {
                id: compDef.id,
                sections: compDef.sections.map((s) => ({
                    id: s.id,
                    instanceId: s.instanceId,
                })),
            },
            tokens: {
                palette: finalVariant.palette,
                fontPair: finalVariant.fontPair,
            },
            copy: writeCopy(brandContext, {
                id: compDef.id,
                sections: compDef.sections.map((s) => ({
                    id: s.id,
                    instanceId: s.instanceId,
                })),
            }),
        };

        await putSite(site);
        await putSiteBrand(slug, { brandContext, variant: finalVariant });

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
