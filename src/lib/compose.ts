/**
 * High-level deterministic composer.
 *
 * Takes a BrandContext, returns everything needed to build a CompositionSite
 * except the copy (writeCopy handles that in phase 5). No LLM calls.
 *
 *   compose(ctx) → { composition, tokens }
 *
 * Callers glue in copy via writeCopy and persist via putSite.
 */
import type { BrandContext } from "./brandContext";
import type { CompositionInstance, Tokens } from "./siteShapes";
import { pickComposition } from "@/compositions";
import { pickPalette } from "./palette";
import { pickFontPair } from "./fontPair";

export interface ComposedSite {
    composition: CompositionInstance;
    tokens: Tokens;
}

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
        tokens: {
            palette: pickPalette(ctx),
            fontPair: pickFontPair(ctx),
        },
    };
}
