import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    {
        key: "wordmark",
        label: "Wordmark",
        type: "text",
        placeholder: "your name",
        required: false,
        maxLength: 40,
    },
    {
        key: "tagline",
        label: "Tagline",
        type: "text",
        placeholder: "the short thing",
        required: false,
        maxLength: 80,
    },
    { key: "link1Label", label: "Link 1 label", type: "text", maxLength: 40 },
    { key: "link1Href", label: "Link 1 href", type: "text" },
    { key: "link2Label", label: "Link 2 label", type: "text", maxLength: 40 },
    { key: "link2Href", label: "Link 2 href", type: "text" },
    { key: "link3Label", label: "Link 3 label", type: "text", maxLength: 40 },
    { key: "link3Href", label: "Link 3 href", type: "text" },
];
