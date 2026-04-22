import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const vibes = ctx.vibes ?? [];
    return {
        heading: "Say hi.",
        body: vibes.length > 0 ? vibes.join(" · ") : "",
        // email + ctaLabel + ctaHref start empty; users fill them in
    };
};
