/**
 * Curated library of BrandContext presets. Powers the "↯ imagine a brand to try"
 * button on the intake — the user can skip the form and drop into emerge with a
 * fully-populated example.
 *
 * No LLM, no randomness state that would make this non-deterministic across
 * restarts. The route picks one via Math.random per-request.
 */
import type { BrandContext } from "./brandContext";

export const presetBrands: BrandContext[] = [
    {
        purpose:
            "A film-wedding photographer's portfolio — book weddings in Oaxaca, Portugal, and Kyoto.",
        brandColor: "#f97316",
        handles: [
            {
                platform: "instagram",
                handle: "sofiafilmwedding",
                url: "https://instagram.com/sofiafilmwedding",
            },
            {
                platform: "site",
                handle: "sofiafilm.com",
                url: "https://sofiafilm.com",
            },
        ],
    },
    {
        purpose:
            "An indie dev tool — a debugger that shows causality, not stack traces, for distributed systems.",
        brandColor: "#3b82f6",
        handles: [
            {
                platform: "github",
                handle: "causalproj",
                url: "https://github.com/causalproj",
            },
            {
                platform: "twitter",
                handle: "causalproj",
                url: "https://twitter.com/causalproj",
            },
        ],
    },
    {
        purpose:
            "A solo coach's landing page — somatic coaching for people rebuilding pace after burnout.",
        brandColor: "#16a34a",
        handles: [
            {
                platform: "instagram",
                handle: "restedcoach",
                url: "https://instagram.com/restedcoach",
            },
            {
                platform: "substack",
                handle: "restedcoach",
                url: "https://restedcoach.substack.com",
            },
        ],
    },
    {
        purpose:
            "A 24-seat tasting-menu restaurant in Portland focused on fermented Pacific Northwest produce.",
        brandColor: "#b04a2e",
        handles: [
            {
                platform: "instagram",
                handle: "feralferments",
                url: "https://instagram.com/feralferments",
            },
        ],
    },
    {
        purpose:
            "A two-person experimental game studio making deliberately unmarketable short games.",
        brandColor: "#d946ef",
        handles: [
            {
                platform: "twitter",
                handle: "antgames",
                url: "https://twitter.com/antgames",
            },
            {
                platform: "site",
                handle: "antgames.itch.io",
                url: "https://antgames.itch.io",
            },
        ],
    },
    {
        purpose: "Field notes from a one-person newsletter about product craft and technical writing.",
        brandColor: "#c2410c",
        handles: [
            {
                platform: "substack",
                handle: "fieldnotes",
                url: "https://fieldnotes.substack.com",
            },
            {
                platform: "twitter",
                handle: "fieldnoteswrite",
                url: "https://twitter.com/fieldnoteswrite",
            },
        ],
    },
    {
        purpose: "Link-in-bio for an electronic musician about to drop a first EP.",
        brandColor: "#a855f7",
        handles: [
            {
                platform: "instagram",
                handle: "orbit.sounds",
                url: "https://instagram.com/orbit.sounds",
            },
            {
                platform: "tiktok",
                handle: "orbit.sounds",
                url: "https://tiktok.com/@orbit.sounds",
            },
            {
                platform: "youtube",
                handle: "orbitsounds",
                url: "https://youtube.com/@orbitsounds",
            },
            {
                platform: "link",
                handle: "open.spotify.com/artist/orbit",
                url: "https://open.spotify.com/artist/orbit",
            },
        ],
    },
    {
        purpose:
            "A small open-source sustainability API — measure embedded carbon from supply-chain metadata.",
        brandColor: "#10b981",
        handles: [
            {
                platform: "github",
                handle: "carbonapi",
                url: "https://github.com/carbonapi",
            },
            {
                platform: "site",
                handle: "carbonapi.dev",
                url: "https://carbonapi.dev",
            },
        ],
    },
    {
        purpose: "Portfolio for a technical product marketing consultant and brand systems designer.",
        brandColor: "#22c55e",
        handles: [
            {
                platform: "twitter",
                handle: "scottsuper",
                url: "https://twitter.com/scottsuper",
            },
            {
                platform: "linkedin",
                handle: "scottsuper",
                url: "https://www.linkedin.com/in/scottsuper",
            },
        ],
    },
    {
        purpose:
            "An architecture studio's portfolio — residential interiors in the Pacific Northwest.",
        brandColor: "#18181b",
        handles: [
            {
                platform: "instagram",
                handle: "stoneandgrain",
                url: "https://instagram.com/stoneandgrain",
            },
        ],
    },
];

export function randomPreset(): BrandContext {
    return presetBrands[Math.floor(Math.random() * presetBrands.length)];
}
