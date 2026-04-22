import type { ComponentType } from "react";

/**
 * One copy slot in a section. Section schemas declare their slots using
 * just the slot key (e.g. "headline") — the full Site.copy key becomes
 * `{instanceId}.{slotKey}` once the section is instantiated in a composition.
 */
export interface SectionCopySchemaField {
    key: string;
    label: string;
    type: "text" | "textarea" | "list";
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
}

/**
 * Sections carry tags used by pickComposition and (future) compose-synthesis
 * to match against BrandContext keywords.
 */
export type SectionFamily = "hero" | "content" | "footer" | "navbar" | "links" | "posts" | "contact";

export interface SectionMeta {
    id: string;
    displayName: string;
    family: SectionFamily;
    tags: string[];
}

/**
 * Props every section component receives. `copy` already has the instance
 * prefix stripped — slots are keyed by their schema key.
 * Tokens are injected via CSS custom properties on a wrapper element by
 * the CompositionRenderer, so sections can style with `var(--token-*)`.
 */
export interface SectionProps {
    copy: Record<string, string>;
}

/** Everything a section exports. Registered by `src/sections/index.ts`. */
export interface Section {
    meta: SectionMeta;
    schema: SectionCopySchemaField[];
    Component: ComponentType<SectionProps>;
}
