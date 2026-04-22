/**
 * Site shapes — both the legacy template-keyed shape and the new
 * composition-keyed shape. getSite returns a discriminated union;
 * renderers branch on it.
 *
 * See /docs/superpowers/specs and plan file for architecture rationale.
 */
import { z } from "zod";
import { SiteSchema, type Site as LegacySiteType } from "@/templates/types";

/**
 * One section rendered inside a composition.
 * `id` references the sections registry; `instanceId` is unique per
 * composition instance so multiple of the same section type can appear
 * with independently-keyed copy.
 */
export const SectionInstanceSchema = z.object({
    id: z.string().min(1),
    instanceId: z.string().min(1),
});
export type SectionInstance = z.infer<typeof SectionInstanceSchema>;

/**
 * An ordered list of section instances. `id` references the compositions
 * registry (marketing, portfolio, linkinbio, blog, docs, etc.).
 */
export const CompositionInstanceSchema = z.object({
    id: z.string().min(1),
    sections: z.array(SectionInstanceSchema).min(1),
});
export type CompositionInstance = z.infer<typeof CompositionInstanceSchema>;

/** Legacy template-keyed site — existing shape. Re-exported for convenience. */
export const LegacySiteSchema = SiteSchema;
export type LegacySite = LegacySiteType;

/**
 * New composition-keyed site. `copy` is keyed by `{instanceId}.{slotKey}`
 * so slot keys can collide across section instances (e.g. two "hero" sections).
 *
 * `brandColor` is the user's single aesthetic input — injected at the hosted
 * site wrapper as `--accent`. Dark/light mode and all other design tokens
 * cascade from nertia's globals.css.
 */
export const CompositionSiteSchema = z.object({
    slug: z.string().min(1),
    composition: CompositionInstanceSchema,
    brandColor: z.string(),
    copy: z.record(z.string(), z.string()),
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
});
export type CompositionSite = z.infer<typeof CompositionSiteSchema>;

/** Discriminated union. getSite returns this; renderers branch. */
export type AnySite = LegacySite | CompositionSite;

export function isCompositionSite(site: AnySite): site is CompositionSite {
    return "composition" in site && typeof (site as CompositionSite).composition === "object";
}

export function isLegacySite(site: AnySite): site is LegacySite {
    return "templateId" in site && typeof (site as LegacySite).templateId === "string";
}
