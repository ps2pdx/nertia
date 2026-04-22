/**
 * Curated palette library + deterministic picker.
 *
 * Each entry is a Palette (6 hex colors) plus `tags` used to score against
 * BrandContext tokens. pickPalette returns the best match (ties broken by
 * list order). emergeNeighbors rotates the accent hue to produce three
 * variants sharing the same base + accent family.
 */
import type { BrandContext } from "./brandContext";
import { ctxTokens, scoreTags } from "./brandContext";
import { rotateHue } from "./color";
import type { Palette } from "./siteShapes";

interface PaletteEntry {
    id: string;
    label: string;
    tags: string[];
    palette: Palette;
}

/**
 * Tags use lowercase hyphenated tokens so they match `ctxTokens` output.
 * Vibes are favored (first in tag list) so they anchor the match.
 */
export const palettes: PaletteEntry[] = [
    {
        id: "void-dark",
        label: "void / dark monospace",
        tags: ["dark", "technical", "cyber", "developer", "saas", "code", "monospace"],
        palette: {
            bg: "#0a0a0a",
            fg: "#f5f5f5",
            muted: "#9ca3af",
            accent: "#00d4ff",
            headingStart: "#ffffff",
            headingEnd: "#7dd3fc",
        },
    },
    {
        id: "warm-editorial",
        label: "warm / editorial serif",
        tags: ["warm", "editorial", "serif", "writer", "newsletter", "magazine", "paper"],
        palette: {
            bg: "#faf7f2",
            fg: "#1f1611",
            muted: "#6b5e53",
            accent: "#b04a2e",
            headingStart: "#1f1611",
            headingEnd: "#5c4030",
        },
    },
    {
        id: "clean-technical",
        label: "clean / technical grid",
        tags: ["clean", "technical", "blue", "product", "saas", "startup", "platform"],
        palette: {
            bg: "#ffffff",
            fg: "#0a0a0a",
            muted: "#6b7280",
            accent: "#2563eb",
            headingStart: "#0a0a0a",
            headingEnd: "#1e3a8a",
        },
    },
    {
        id: "monochrome-dark",
        label: "monochrome / minimal dark",
        tags: ["minimal", "dark", "mono", "monochrome", "architect", "designer"],
        palette: {
            bg: "#0f0f0f",
            fg: "#ededed",
            muted: "#6b6b6b",
            accent: "#ededed",
            headingStart: "#ffffff",
            headingEnd: "#a3a3a3",
        },
    },
    {
        id: "coastal-light",
        label: "coastal / blue calm",
        tags: ["coastal", "calm", "blue", "ocean", "wellness", "quiet"],
        palette: {
            bg: "#f0f7fa",
            fg: "#0b2733",
            muted: "#5b7484",
            accent: "#0891b2",
            headingStart: "#0b2733",
            headingEnd: "#0e7490",
        },
    },
    {
        id: "emerald-tech",
        label: "emerald / tech dark",
        tags: ["dark", "green", "tech", "developer", "terminal", "linux", "open-source"],
        palette: {
            bg: "#0a0f0a",
            fg: "#e6f4ea",
            muted: "#7a8f7e",
            accent: "#22c55e",
            headingStart: "#ffffff",
            headingEnd: "#a7f3d0",
        },
    },
    {
        id: "amber-writer",
        label: "amber / writer paper",
        tags: ["warm", "writer", "writing", "essays", "journal", "cozy", "paper"],
        palette: {
            bg: "#faf5ec",
            fg: "#2a1f0f",
            muted: "#8a7a5c",
            accent: "#c2410c",
            headingStart: "#2a1f0f",
            headingEnd: "#7c2d12",
        },
    },
    {
        id: "violet-creative",
        label: "violet / creative dark",
        tags: ["dark", "creative", "purple", "violet", "design", "musician", "artist"],
        palette: {
            bg: "#120c1f",
            fg: "#f1e8ff",
            muted: "#8b7aa8",
            accent: "#a855f7",
            headingStart: "#ffffff",
            headingEnd: "#d8b4fe",
        },
    },
    {
        id: "rose-personal",
        label: "rose / personal warm",
        tags: ["warm", "personal", "friendly", "pink", "rose", "wellness", "human"],
        palette: {
            bg: "#fdf5f5",
            fg: "#3f1a24",
            muted: "#9a6a78",
            accent: "#e11d48",
            headingStart: "#3f1a24",
            headingEnd: "#881337",
        },
    },
    {
        id: "forest-natural",
        label: "forest / earthy dark",
        tags: ["dark", "green", "earthy", "nature", "organic", "outdoor", "sustainable"],
        palette: {
            bg: "#0d1510",
            fg: "#e8f1ea",
            muted: "#6e8571",
            accent: "#16a34a",
            headingStart: "#ffffff",
            headingEnd: "#86efac",
        },
    },
    {
        id: "bone-minimal",
        label: "bone / minimal light",
        tags: ["minimal", "warm", "neutral", "tan", "architect", "studio", "quiet"],
        palette: {
            bg: "#f5f1e8",
            fg: "#1a1a1a",
            muted: "#7a7368",
            accent: "#1a1a1a",
            headingStart: "#1a1a1a",
            headingEnd: "#3f3f3f",
        },
    },
    {
        id: "ink-newspaper",
        label: "ink / newspaper gray",
        tags: ["editorial", "gray", "newspaper", "classic", "journal", "neutral"],
        palette: {
            bg: "#f7f7f5",
            fg: "#0a0a0a",
            muted: "#5c5c5c",
            accent: "#18181b",
            headingStart: "#0a0a0a",
            headingEnd: "#27272a",
        },
    },
    {
        id: "carbon-saas",
        label: "carbon / saas dark",
        tags: ["dark", "saas", "platform", "enterprise", "b2b", "infrastructure", "api"],
        palette: {
            bg: "#0b1220",
            fg: "#e2e8f0",
            muted: "#64748b",
            accent: "#3b82f6",
            headingStart: "#ffffff",
            headingEnd: "#93c5fd",
        },
    },
    {
        id: "sunset-cinema",
        label: "sunset / cinematic dark",
        tags: ["dark", "cinematic", "film", "orange", "moody", "photography", "director"],
        palette: {
            bg: "#1a0f08",
            fg: "#f5e9dc",
            muted: "#a08974",
            accent: "#f97316",
            headingStart: "#fff7ed",
            headingEnd: "#fdba74",
        },
    },
    {
        id: "terracotta-warm",
        label: "terracotta / earthy light",
        tags: ["warm", "earthy", "terracotta", "natural", "ceramic", "crafts"],
        palette: {
            bg: "#fbf3ea",
            fg: "#3b1d10",
            muted: "#9a7558",
            accent: "#ea580c",
            headingStart: "#3b1d10",
            headingEnd: "#9a3412",
        },
    },
    {
        id: "slate-corporate",
        label: "slate / corporate light",
        tags: ["professional", "corporate", "slate", "gray", "law", "finance", "business"],
        palette: {
            bg: "#fafafa",
            fg: "#111827",
            muted: "#4b5563",
            accent: "#0f172a",
            headingStart: "#111827",
            headingEnd: "#374151",
        },
    },
    {
        id: "spring-fresh",
        label: "spring / fresh light",
        tags: ["fresh", "green", "spring", "clean", "startup", "optimistic"],
        palette: {
            bg: "#f6fdf8",
            fg: "#052e1a",
            muted: "#647c68",
            accent: "#10b981",
            headingStart: "#052e1a",
            headingEnd: "#065f46",
        },
    },
    {
        id: "dusk-moody",
        label: "dusk / moody dark",
        tags: ["dark", "moody", "atmospheric", "cinematic", "music", "nightlife"],
        palette: {
            bg: "#140e1f",
            fg: "#e9e0f0",
            muted: "#8c7ea6",
            accent: "#d946ef",
            headingStart: "#ffffff",
            headingEnd: "#f0abfc",
        },
    },
];

/**
 * Deterministically pick a palette from BrandContext. Returns the first
 * palette whose tags overlap most with the ctx tokens. Falls back to
 * palettes[0] (void-dark) when nothing matches.
 */
export function pickPalette(ctx: BrandContext): Palette {
    const tokens = ctxTokens(ctx);
    let best = palettes[0];
    let bestScore = -1;
    for (const entry of palettes) {
        const score = scoreTags(entry.tags, tokens);
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    }
    return best.palette;
}

/**
 * Return three deterministic neighbors of a picked palette — same base colors,
 * three accent-hue rotations. Used by intake's emerge-round-2 to offer "tighter
 * refinements of the same direction".
 */
export function emergeNeighbors(picked: Palette): Palette[] {
    return [
        { ...picked, accent: rotateHue(picked.accent, -30) },
        { ...picked }, // original
        { ...picked, accent: rotateHue(picked.accent, 30) },
    ];
}

/** For emerge round 1 — three distinct palettes spanning dark/light/accent. */
export function pickThreeForEmerge(ctx: BrandContext): Palette[] {
    const tokens = ctxTokens(ctx);
    // Score every palette; return the top 3 while forcing light/dark diversity.
    const scored = palettes
        .map((entry) => ({ entry, score: scoreTags(entry.tags, tokens) }))
        .sort((a, b) => b.score - a.score);

    const out: PaletteEntry[] = [];
    const seenDark = new Set<boolean>();
    for (const s of scored) {
        if (out.length >= 3) break;
        const isDark = s.entry.tags.includes("dark");
        // Include first two regardless; for the third, prefer opposite mode if possible
        if (out.length < 2) {
            out.push(s.entry);
            seenDark.add(isDark);
        } else if (!seenDark.has(!isDark ? true : false)) {
            // try to include the missing mode
            const wanted = !Array.from(seenDark).every((v) => v);
            if (isDark === wanted) {
                out.push(s.entry);
                seenDark.add(isDark);
            }
        } else {
            out.push(s.entry);
        }
    }
    // Fill to 3 if we were too picky
    for (const s of scored) {
        if (out.length >= 3) break;
        if (!out.includes(s.entry)) out.push(s.entry);
    }
    return out.slice(0, 3).map((e) => e.palette);
}
