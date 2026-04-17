import { z } from "zod";
import type { ComponentType } from "react";

/**
 * A Site is one user-generated site hosted at {slug}.nertia.ai.
 * Templates sourced from vercel — each template defines its own copy schema.
 */
export const SiteSchema = z.object({
  slug: z.string().min(1),
  templateId: z.string().min(1),
  copy: z.record(z.string(), z.string()),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});
export type Site = z.infer<typeof SiteSchema>;

/**
 * A Template is a renderable Vercel-sourced layout with a declared copy schema.
 */
export interface Template {
  id: string;
  displayName: string;
  description: string;
  sourceUrl: string;
  sourceAttribution: string;
  license: string;
  tags: string[];
  copySchema: CopySchemaField[];
  Layout: ComponentType<{ site: Site }>;
  previewImage?: string;
}

export interface CopySchemaField {
  key: string;
  label: string;
  type: "text" | "textarea" | "list";
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}
