import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const vibesText = (ctx.vibes ?? []).join(", ");
    const parts = [ctx.purpose, vibesText].filter(Boolean).join(" ").trim();
    return {
        heading: "About",
        body: parts || "More to come.",
    };
};
