import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    {
        key: "headline",
        label: "Headline",
        type: "text",
        placeholder: "Building blocks for your next idea",
        required: true,
        maxLength: 120,
    },
    {
        key: "sub",
        label: "Sub copy",
        type: "textarea",
        placeholder: "One sentence that says what you do.",
        required: false,
        maxLength: 220,
    },
    {
        key: "ctaLabel",
        label: "CTA label",
        type: "text",
        placeholder: "Begin",
        required: false,
        maxLength: 30,
    },
    {
        key: "ctaHref",
        label: "CTA link",
        type: "text",
        placeholder: "#",
        required: false,
    },
];
