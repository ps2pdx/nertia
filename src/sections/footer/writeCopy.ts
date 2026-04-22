import type { SectionWriteCopy } from "../types";
import type { Platform } from "@/lib/brandContext";
import { firstWord } from "../copyHelpers";

const PLATFORM_LABELS: Record<Platform, string> = {
    twitter: "Twitter",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    bluesky: "Bluesky",
    github: "GitHub",
    substack: "Substack",
    mastodon: "Mastodon",
    site: "Website",
    link: "Link",
};

export const writeCopy: SectionWriteCopy = (ctx) => {
    const out: Record<string, string> = {
        wordmark: firstWord(ctx.purpose ?? ""),
        tagline: "",
    };
    (ctx.handles ?? []).slice(0, 3).forEach((h, i) => {
        out[`link${i + 1}Label`] = PLATFORM_LABELS[h.platform] ?? "Link";
        out[`link${i + 1}Href`] = h.url;
    });
    return out;
};
