import type { SectionInstance } from "@/lib/siteShapes";

/**
 * A named recipe — the shape intake produces when composing a site
 * from brand context. Compositions are curated, ordered stacks of
 * sections tagged for keyword matching.
 */
export interface CompositionDef {
    id: string;
    displayName: string;
    /** Keywords used by pickComposition to match against BrandContext. */
    tags: string[];
    /** Ordered list of section instances rendered top-to-bottom. */
    sections: SectionInstance[];
}
