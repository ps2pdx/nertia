import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = (ctx) => {
    return {
        heading: "Say hi.",
        body: ctx.audience ? `For ${ctx.audience}.` : "",
        // email + ctaLabel + ctaHref start empty; users fill them in
    };
};
