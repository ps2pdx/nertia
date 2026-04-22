import type { SectionWriteCopy } from "../types";
import { humanize } from "@/lib/humanize";
import { firstSentence } from "../copyHelpers";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const purpose = ctx.purpose ?? "";
    const sentences = purpose.split(/(?<=[.!?])\s+/).filter(Boolean);
    return {
        headline: purpose
            ? humanize(firstSentence(purpose))
            : "Something worth your attention.",
        // Second sentence of purpose if one exists; vibes drive palette/font,
        // not copy.
        sub: sentences.length > 1 ? sentences.slice(1).join(" ") : "",
        ctaLabel: "Begin",
        ctaHref: "#",
    };
};
