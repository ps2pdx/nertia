import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    { key: "heading", label: "Heading", type: "text", placeholder: "Selected work", maxLength: 60 },
    // Project 1
    { key: "project1Title", label: "Project 1 title", type: "text", maxLength: 60 },
    { key: "project1Desc", label: "Project 1 description", type: "textarea", maxLength: 160 },
    { key: "project1ImageUrl", label: "Project 1 image URL", type: "text", maxLength: 400 },
    // Project 2
    { key: "project2Title", label: "Project 2 title", type: "text", maxLength: 60 },
    { key: "project2Desc", label: "Project 2 description", type: "textarea", maxLength: 160 },
    { key: "project2ImageUrl", label: "Project 2 image URL", type: "text", maxLength: 400 },
    // Project 3
    { key: "project3Title", label: "Project 3 title", type: "text", maxLength: 60 },
    { key: "project3Desc", label: "Project 3 description", type: "textarea", maxLength: 160 },
    { key: "project3ImageUrl", label: "Project 3 image URL", type: "text", maxLength: 400 },
    // Project 4
    { key: "project4Title", label: "Project 4 title", type: "text", maxLength: 60 },
    { key: "project4Desc", label: "Project 4 description", type: "textarea", maxLength: 160 },
    { key: "project4ImageUrl", label: "Project 4 image URL", type: "text", maxLength: 400 },
];
