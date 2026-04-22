import type { SectionWriteCopy } from "../types";
import { humanize } from "@/lib/humanize";
import { firstSentence } from "../copyHelpers";

export const writeCopy: SectionWriteCopy = (ctx) => {
    const purpose = ctx.purpose ?? "";
    const vibes = ctx.vibes ?? [];
    return {
        headline: purpose
            ? humanize(firstSentence(purpose))
            : "Something worth your attention.",
        sub: vibes.length > 0 ? vibes.join(" · ") : "",
        ctaLabel: "Begin",
        ctaHref: "#",
    };
};
