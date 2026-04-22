import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = (ctx) => {
    return {
        headline: "Field notes",
        description: ctx.purpose ?? "",
        // post slots start empty — users add real posts later
    };
};
