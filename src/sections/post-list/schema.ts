import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    {
        key: "headline",
        label: "Headline",
        type: "text",
        placeholder: "Field notes",
        required: true,
        maxLength: 40,
    },
    {
        key: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Short tagline under the headline.",
        required: false,
        maxLength: 240,
    },
    // 3 post slots
    { key: "post1Date", label: "Post 1 — date", type: "text" },
    { key: "post1Title", label: "Post 1 — title", type: "text", maxLength: 120 },
    {
        key: "post1Summary",
        label: "Post 1 — summary",
        type: "textarea",
        maxLength: 280,
    },
    { key: "post2Date", label: "Post 2 — date", type: "text" },
    { key: "post2Title", label: "Post 2 — title", type: "text", maxLength: 120 },
    {
        key: "post2Summary",
        label: "Post 2 — summary",
        type: "textarea",
        maxLength: 280,
    },
    { key: "post3Date", label: "Post 3 — date", type: "text" },
    { key: "post3Title", label: "Post 3 — title", type: "text", maxLength: 120 },
    {
        key: "post3Summary",
        label: "Post 3 — summary",
        type: "textarea",
        maxLength: 280,
    },
];
