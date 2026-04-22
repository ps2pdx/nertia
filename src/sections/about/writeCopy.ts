import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = (ctx) => {
    // Vibes drive aesthetics (palette, font) — they never appear as copy.
    return {
        heading: "About",
        body: (ctx.purpose ?? "").trim() || "More to come.",
    };
};
