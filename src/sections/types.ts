import type { ComponentType } from "react";
import type { BrandContext } from "@/lib/brandContext";

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
 * Sections style using nertia's design-system CSS vars (var(--foreground),
 * var(--background), var(--accent), etc.) — the hosted site wrapper injects
 * the user's brand color as --accent; dark/light mode cascades from globals.
 */
export interface SectionProps {
    copy: Record<string, string>;
}

/**
 * Pure function producing this section's copy from a BrandContext.
 * Keys are slot names (same as SectionCopySchemaField.key). No LLM.
 * Each section owns its voice — `lib/writeCopy.ts` orchestrates across a
 * composition by calling this per-instance and prefixing keys.
 */
export type SectionWriteCopy = (ctx: BrandContext) => Record<string, string>;

/** Everything a section exports. Registered by `src/sections/index.ts`. */
export interface Section {
    meta: SectionMeta;
    schema: SectionCopySchemaField[];
    Component: ComponentType<SectionProps>;
    writeCopy: SectionWriteCopy;
}
