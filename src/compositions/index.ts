import type { CompositionDef } from "./types";
import { marketing } from "./marketing";

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
};

export function getComposition(id: string): CompositionDef | null {
    return compositions[id] ?? null;
}

export function listCompositions(): CompositionDef[] {
    return Object.values(compositions);
}

export type { CompositionDef } from "./types";
