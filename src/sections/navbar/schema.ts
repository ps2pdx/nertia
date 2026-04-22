import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    {
        key: "wordmark",
        label: "Wordmark",
        type: "text",
        placeholder: "your name",
        required: true,
        maxLength: 40,
    },
    {
        key: "link1Label",
        label: "Link 1 label",
        type: "text",
        required: false,
        maxLength: 24,
    },
    { key: "link1Href", label: "Link 1 href", type: "text", required: false },
    {
        key: "link2Label",
        label: "Link 2 label",
        type: "text",
        required: false,
        maxLength: 24,
    },
    { key: "link2Href", label: "Link 2 href", type: "text", required: false },
    {
        key: "link3Label",
        label: "Link 3 label",
        type: "text",
        required: false,
        maxLength: 24,
    },
    { key: "link3Href", label: "Link 3 href", type: "text", required: false },
];
