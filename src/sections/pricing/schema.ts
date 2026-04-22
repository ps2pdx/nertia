import type { SectionCopySchemaField } from "../types";

export const schema: SectionCopySchemaField[] = [
    { key: "heading", label: "Heading", type: "text", placeholder: "Pricing", maxLength: 60 },
    // Tier 1
    { key: "tier1Label", label: "Tier 1 label", type: "text", maxLength: 40 },
    { key: "tier1Price", label: "Tier 1 price", type: "text", maxLength: 20 },
    { key: "tier1Desc", label: "Tier 1 description", type: "textarea", maxLength: 120 },
    { key: "tier1CtaLabel", label: "Tier 1 CTA label", type: "text", maxLength: 30 },
    // Tier 2
    { key: "tier2Label", label: "Tier 2 label", type: "text", maxLength: 40 },
    { key: "tier2Price", label: "Tier 2 price", type: "text", maxLength: 20 },
    { key: "tier2Desc", label: "Tier 2 description", type: "textarea", maxLength: 120 },
    { key: "tier2CtaLabel", label: "Tier 2 CTA label", type: "text", maxLength: 30 },
    // Tier 3
    { key: "tier3Label", label: "Tier 3 label", type: "text", maxLength: 40 },
    { key: "tier3Price", label: "Tier 3 price", type: "text", maxLength: 20 },
    { key: "tier3Desc", label: "Tier 3 description", type: "textarea", maxLength: 120 },
    { key: "tier3CtaLabel", label: "Tier 3 CTA label", type: "text", maxLength: 30 },
];
