import type { SectionWriteCopy } from "../types";
import type { Platform } from "@/lib/brandContext";
import { firstSentence, initials, truncate } from "../copyHelpers";

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
    const nameSource =
        firstSentence(ctx.purpose ?? "") ||
        ctx.handles?.[0]?.handle ||
        "my links";
    const name = truncate(nameSource, 40);

    const out: Record<string, string> = {
        name,
        tagline: "",
        bio: truncate(ctx.purpose ?? "", 200),
        avatarInitials: initials(name),
    };

    (ctx.handles ?? []).slice(0, 6).forEach((h, i) => {
        out[`link${i + 1}Label`] = PLATFORM_LABELS[h.platform] ?? "Link";
        out[`link${i + 1}Href`] = h.url;
    });

    return out;
};
