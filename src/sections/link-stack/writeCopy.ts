import type { SectionWriteCopy } from "../types";
import { firstSentence, initials, truncate } from "../copyHelpers";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const nameSource =
        firstSentence(ctx.purpose ?? "") || ctx.audience || "my links";
    const name = truncate(nameSource, 40);
    return {
        name,
        tagline: (ctx.vibeWords ?? [])[0] ?? "",
        bio: truncate(ctx.purpose ?? "", 200),
        avatarInitials: initials(name),
        // link slots stay empty — users paste URLs after generation
    };
};
