import type { SectionWriteCopy } from "../types";
import { firstWord } from "../copyHelpers";

export const writeCopy: SectionWriteCopy = (ctx) => {
    return {
        wordmark: firstWord(ctx.purpose ?? "site") || "site",
        // link slots left empty — users add them later via the editor (future)
    };
};
