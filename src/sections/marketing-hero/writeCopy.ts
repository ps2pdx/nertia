import type { SectionWriteCopy } from "../types";
import { humanize } from "@/lib/humanize";
import { firstSentence } from "../copyHelpers";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const purpose = ctx.purpose ?? "";
    return {
        headline: purpose
            ? humanize(firstSentence(purpose))
            : "Something worth your attention.",
        sub: ctx.audience ? `For ${ctx.audience}.` : "",
        ctaLabel: "Begin",
        ctaHref: "#",
    };
};
