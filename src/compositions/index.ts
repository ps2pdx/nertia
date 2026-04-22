import type { CompositionDef } from "./types";
import { marketing } from "./marketing";
import { portfolio } from "./portfolio";
import { linkinbio } from "./linkinbio";
import { blog } from "./blog";
import { docs } from "./docs";
import type { BrandContext } from "@/lib/brandContext";
import { ctxTokens, scoreTags } from "@/lib/brandContext";

/**
 * Composition registry. Each entry is a named, tagged recipe that
 * intake's deterministic picker can choose based on BrandContext.
 *
 * To add a composition:
 *   1. Create src/compositions/{id}.ts exporting a CompositionDef
 *   2. Add to `compositions` below
 */
export const compositions: Record<string, CompositionDef> = {
    [marketing.id]: marketing,
    [portfolio.id]: portfolio,
    [linkinbio.id]: linkinbio,
    [blog.id]: blog,
    [docs.id]: docs,
};

export function getComposition(id: string): CompositionDef | null {
    return compositions[id] ?? null;
}

export function listCompositions(): CompositionDef[] {
    return Object.values(compositions);
}

/**
 * Deterministically pick a composition from BrandContext. Returns the
 * first composition whose tags overlap most with the ctx tokens. Falls
 * back to marketing when nothing matches.
 */
export function pickComposition(ctx: BrandContext): CompositionDef {
    const handles = ctx.handles ?? [];
    const hasSite = handles.some((h) => h.platform === "site");
    if (handles.length >= 3 && !hasSite) {
        return linkinbio;
    }
    const tokens = ctxTokens(ctx);
    let best = marketing;
    let bestScore = -1;
    for (const entry of listCompositions()) {
        const score = scoreTags(entry.tags, tokens);
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    }
    return best;
}

export type { CompositionDef } from "./types";
