/**
 * High-level deterministic composer.
 *
 * Takes a BrandContext, returns the composition + brand color needed to
 * build a CompositionSite. No LLM calls. Copy comes from writeCopy;
 * dark/light mode + everything else cascades from globals.css.
 *
 *   compose(ctx) → { composition, brandColor }
 */
import type { BrandContext } from "./brandContext";
import type { CompositionInstance } from "./siteShapes";
import { pickComposition } from "@/compositions";

export interface ComposedSite {
    composition: CompositionInstance;
    brandColor: string;
}

const DEFAULT_BRAND_COLOR = "#22c55e"; // nertia green

export function compose(ctx: BrandContext): ComposedSite {
    const compDef = pickComposition(ctx);
    return {
        composition: {
            id: compDef.id,
            sections: compDef.sections.map((s) => ({
                id: s.id,
                instanceId: s.instanceId,
            })),
        },
        brandColor: ctx.brandColor ?? DEFAULT_BRAND_COLOR,
    };
}
