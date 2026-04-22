import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    {
        key: "avatarInitials",
        label: "Avatar initials",
        type: "text",
        placeholder: "SR",
        required: false,
        maxLength: 3,
    },
    {
        key: "name",
        label: "Display name",
        type: "text",
        placeholder: "Sam Rivera",
        required: true,
        maxLength: 40,
    },
    {
        key: "tagline",
        label: "Tagline",
        type: "text",
        placeholder: "designer / dev",
        required: false,
        maxLength: 80,
    },
    {
        key: "bio",
        label: "Bio (optional)",
        type: "textarea",
        required: false,
        maxLength: 200,
    },
    // 6 link slots
    { key: "link1Label", label: "Link 1 label", type: "text", maxLength: 40 },
    { key: "link1Href", label: "Link 1 href", type: "text" },
    { key: "link2Label", label: "Link 2 label", type: "text", maxLength: 40 },
    { key: "link2Href", label: "Link 2 href", type: "text" },
    { key: "link3Label", label: "Link 3 label", type: "text", maxLength: 40 },
    { key: "link3Href", label: "Link 3 href", type: "text" },
    { key: "link4Label", label: "Link 4 label", type: "text", maxLength: 40 },
    { key: "link4Href", label: "Link 4 href", type: "text" },
    { key: "link5Label", label: "Link 5 label", type: "text", maxLength: 40 },
    { key: "link5Href", label: "Link 5 href", type: "text" },
    { key: "link6Label", label: "Link 6 label", type: "text", maxLength: 40 },
    { key: "link6Href", label: "Link 6 href", type: "text" },
];
