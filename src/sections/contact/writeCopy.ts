import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = () => {
    // Vibes drive aesthetics, not copy. Body stays empty until the user adds
    // one — the Component renders a clean heading-only variant in that case.
    return {
        heading: "Say hi.",
        body: "",
    };
};
