import type { SectionWriteCopy } from "../types";

export const writeCopy: SectionWriteCopy = () => {
    // Projects are empty by default — the user fills them in post-generation.
    return {
        heading: "Selected work",
        project1Title: "",
        project1Desc: "",
        project1ImageUrl: "",
        project2Title: "",
        project2Desc: "",
        project2ImageUrl: "",
        project3Title: "",
        project3Desc: "",
        project3ImageUrl: "",
        project4Title: "",
        project4Desc: "",
        project4ImageUrl: "",
    };
};
