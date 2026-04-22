import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    {
        key: "heading",
        label: "Heading",
        type: "text",
        placeholder: "About",
        required: false,
        maxLength: 60,
    },
    {
        key: "body",
        label: "Body",
        type: "textarea",
        placeholder: "One or two paragraphs about the work.",
        required: true,
        maxLength: 800,
    },
];
