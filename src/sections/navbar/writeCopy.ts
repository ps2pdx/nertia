import type { SectionWriteCopy } from "../types";
import { firstWord } from "../copyHelpers";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const fromPurpose = firstWord(ctx.purpose ?? "");
    const fromHandle = ctx.handles?.[0]?.handle ?? "";
    return {
        wordmark: fromPurpose || fromHandle || "site",
    };
};
