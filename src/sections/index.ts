import type { Section } from "./types";
import { marketingHero } from "./marketing-hero";
import { about } from "./about";
import { footer } from "./footer";
import { navbar } from "./navbar";
import { linkStack } from "./link-stack";
import { postList } from "./post-list";
import { contact } from "./contact";

/**
 * Section registry. Each entry is a reusable page section — a React
 * component + declared copy schema + metadata (tags, family).
 *
 * To add a section:
 *   1. Create src/sections/{id}/ with Component.tsx, schema.ts, meta.ts, index.ts
 *   2. Import and add to `sections` below
 *   3. Reference it from one or more compositions in src/compositions/
 */
export const sections: Record<string, Section> = {
    [marketingHero.meta.id]: marketingHero,
    [about.meta.id]: about,
    [footer.meta.id]: footer,
    [navbar.meta.id]: navbar,
    [linkStack.meta.id]: linkStack,
    [postList.meta.id]: postList,
    [contact.meta.id]: contact,
};

export function getSection(id: string): Section | null {
    return sections[id] ?? null;
}

export function listSections(): Section[] {
    return Object.values(sections);
}

export type { Section, SectionMeta, SectionProps, SectionCopySchemaField, SectionFamily } from "./types";
