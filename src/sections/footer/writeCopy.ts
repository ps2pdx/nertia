import type { SectionWriteCopy } from "../types";
import { firstWord } from "../copyHelpers";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const firstVibe = (ctx.vibeWords ?? [])[0] ?? "";
    return {
        wordmark: firstWord(ctx.purpose ?? ""),
        tagline: firstVibe,
    };
};
