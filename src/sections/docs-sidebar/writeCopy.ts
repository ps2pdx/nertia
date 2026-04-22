import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = (ctx) => {
    return {
        title: "Docs",
        navLabel1: "",
        navHref1: "",
        navLabel2: "",
        navHref2: "",
        navLabel3: "",
        navHref3: "",
        navLabel4: "",
        navHref4: "",
        navLabel5: "",
        navHref5: "",
        navLabel6: "",
        navHref6: "",
        contentHeading: "Getting started",
        contentBody: (ctx.purpose ?? "").trim() || "Welcome.",
    };
};
