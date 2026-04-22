import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = () => {
    // Pricing is empty by default — the user edits post-generation.
    // We return deterministic tier labels + blank prices/descriptions/CTAs.
    return {
        heading: "Pricing",
        tier1Label: "Starter",
        tier1Price: "",
        tier1Desc: "",
        tier1CtaLabel: "",
        tier2Label: "Pro",
        tier2Price: "",
        tier2Desc: "",
        tier2CtaLabel: "",
        tier3Label: "Enterprise",
        tier3Price: "",
        tier3Desc: "",
        tier3CtaLabel: "",
    };
};
