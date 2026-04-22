import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    { key: "title", label: "Sidebar title", type: "text", placeholder: "Docs", maxLength: 40 },
    // Nav links (up to 6)
    { key: "navLabel1", label: "Nav label 1", type: "text", maxLength: 40 },
    { key: "navHref1", label: "Nav href 1", type: "text", maxLength: 200 },
    { key: "navLabel2", label: "Nav label 2", type: "text", maxLength: 40 },
    { key: "navHref2", label: "Nav href 2", type: "text", maxLength: 200 },
    { key: "navLabel3", label: "Nav label 3", type: "text", maxLength: 40 },
    { key: "navHref3", label: "Nav href 3", type: "text", maxLength: 200 },
    { key: "navLabel4", label: "Nav label 4", type: "text", maxLength: 40 },
    { key: "navHref4", label: "Nav href 4", type: "text", maxLength: 200 },
    { key: "navLabel5", label: "Nav label 5", type: "text", maxLength: 40 },
    { key: "navHref5", label: "Nav href 5", type: "text", maxLength: 200 },
    { key: "navLabel6", label: "Nav label 6", type: "text", maxLength: 40 },
    { key: "navHref6", label: "Nav href 6", type: "text", maxLength: 200 },
    // Content
    { key: "contentHeading", label: "Content heading", type: "text", maxLength: 80 },
    { key: "contentBody", label: "Content body", type: "textarea", maxLength: 1200 },
];
