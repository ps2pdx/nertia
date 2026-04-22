import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const adaptiveText = ctx.adaptive.map((a) => a.answer).join(" ");
    const parts = [ctx.purpose, adaptiveText].filter(Boolean).join(" ").trim();
    return {
        heading: "About",
        body: parts || "More to come.",
    };
};
