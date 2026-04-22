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
];
