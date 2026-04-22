import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    {
        key: "heading",
        label: "Heading",
        type: "text",
        placeholder: "Say hi.",
        required: false,
        maxLength: 60,
    },
    {
        key: "body",
        label: "Body",
        type: "textarea",
        placeholder: "One sentence about when to reach out.",
        required: false,
        maxLength: 220,
    },
    {
        key: "email",
        label: "Email",
        type: "text",
        placeholder: "hi@you.com",
        required: false,
    },
    {
        key: "ctaLabel",
        label: "CTA label",
        type: "text",
        placeholder: "Get in touch",
        required: false,
        maxLength: 40,
    },
    {
        key: "ctaHref",
        label: "CTA link (or mailto)",
        type: "text",
        required: false,
    },
];
