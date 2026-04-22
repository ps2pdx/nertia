/**
 * Curated font-pair library + deterministic picker.
 *
 * Each entry is { heading, body } CSS font-family strings plus `tags` used
 * to score against BrandContext tokens. pickFontPair returns the best match.
 */
import type { BrandContext } from "./brandContext";
import { ctxTokens, scoreTags } from "./brandContext";
import type { FontPair } from "./siteShapes";

interface FontPairEntry {
    id: string;
    label: string;
    tags: string[];
    pair: FontPair;
}

/**
 * Only fonts already loaded by src/app/layout.tsx (Geist Sans, Space Mono) +
 * safe system families are used. No remote Google Fonts fetches at generate
 * time — we stick to whatever is globally preloaded.
 */
export const fontPairs: FontPairEntry[] = [
    {
        id: "neue-space",
        label: "Helvetica Neue / Space Mono",
        tags: ["clean", "technical", "neutral", "startup", "product", "saas"],
        pair: {
            heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            body: "var(--font-space-mono), 'SF Mono', ui-monospace, monospace",
        },
    },
    {
        id: "geist-geist",
        label: "Geist Sans / Geist Sans",
        tags: ["clean", "technical", "minimal", "saas", "platform", "developer"],
        pair: {
            heading: "var(--font-geist-sans), 'Inter', ui-sans-serif, system-ui",
            body: "var(--font-geist-sans), 'Inter', ui-sans-serif, system-ui",
        },
    },
    {
        id: "serif-sans",
        label: "serif headline / sans body",
        tags: ["editorial", "serif", "warm", "writer", "newsletter", "journal", "essays"],
        pair: {
            heading: "'Iowan Old Style', 'Georgia', serif",
            body: "var(--font-geist-sans), 'Inter', ui-sans-serif, system-ui",
        },
    },
    {
        id: "mono-sans",
        label: "mono headline / sans body",
        tags: ["technical", "developer", "terminal", "open-source", "cli", "saas"],
        pair: {
            heading: "var(--font-space-mono), 'SF Mono', ui-monospace, monospace",
            body: "var(--font-geist-sans), 'Inter', ui-sans-serif, system-ui",
        },
    },
    {
        id: "display-serif-sans",
        label: "display serif / sans body",
        tags: ["editorial", "magazine", "creative", "photographer", "studio", "cinematic"],
        pair: {
            heading: "'Iowan Old Style', 'Garamond', serif",
            body: "var(--font-geist-sans), 'Inter', ui-sans-serif, system-ui",
        },
    },
    {
        id: "sans-mono",
        label: "sans headline / mono body",
        tags: ["personal", "minimal", "archive", "docs", "reference"],
        pair: {
            heading: "var(--font-geist-sans), 'Inter', ui-sans-serif, system-ui",
            body: "var(--font-space-mono), 'SF Mono', ui-monospace, monospace",
        },
    },
    {
        id: "system-system",
        label: "system / system",
        tags: ["neutral", "startup", "minimal", "generic"],
        pair: {
            heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
    },
    {
        id: "georgia-system",
        label: "Georgia / system",
        tags: ["editorial", "writer", "traditional", "classic", "newspaper"],
        pair: {
            heading: "'Georgia', 'Iowan Old Style', serif",
            body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
    },
    {
        id: "mono-mono",
        label: "mono / mono",
        tags: ["developer", "terminal", "cli", "technical", "code", "monospace"],
        pair: {
            heading: "var(--font-space-mono), 'SF Mono', ui-monospace, monospace",
            body: "var(--font-space-mono), 'SF Mono', ui-monospace, monospace",
        },
    },
    {
        id: "helvetica-geist",
        label: "Helvetica Neue / Geist",
        tags: ["architect", "designer", "studio", "minimal", "modernist"],
        pair: {
            heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            body: "var(--font-geist-sans), 'Inter', ui-sans-serif, system-ui",
        },
    },
];

/** Deterministically pick a FontPair from BrandContext. */
export function pickFontPair(ctx: BrandContext): FontPair {
    const tokens = ctxTokens(ctx);
    let best = fontPairs[0];
    let bestScore = -1;
    for (const entry of fontPairs) {
        const score = scoreTags(entry.tags, tokens);
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    }
    return best.pair;
}
