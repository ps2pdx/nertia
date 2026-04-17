import { z } from "zod";

const Hex = z.string().regex(/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/, "must be a #rrggbb or #rgb hex");

export const PaletteSchema = z.object({
  bg: Hex,
  fg: Hex,
  accent: Hex,
  muted: Hex,
});
export type Palette = z.infer<typeof PaletteSchema>;

export const TypographySchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  scale: z.number().min(1).max(2),
});
export type Typography = z.infer<typeof TypographySchema>;

export const HeroSchema = z.object({
  eyebrow: z.string(),
  headline: z.string().min(1),
  sub: z.string(),
  cta: z.string(),
});

export const SectionSchema = z.object({
  type: z.enum(["feature", "quote", "cta"]),
  headline: z.string().optional(),
  body: z.string().optional(),
  cta: z.string().optional(),
});

export const CopySchema = z.object({
  hero: HeroSchema,
  sections: z.array(SectionSchema),
});
export type Copy = z.infer<typeof CopySchema>;

export const MotionConfigSchema = z.object({
  variant: z.string(),
  intensity: z.enum(["low", "low-to-medium", "medium", "high"]),
  accent: Hex,
});
export type MotionConfig = z.infer<typeof MotionConfigSchema>;

export const ImagesSchema = z.object({
  hero: z.string().url().nullable().optional(),
  sections: z.array(z.string().url()).optional(),
});

export const SiteConfigSchema = z.object({
  slug: z.string().min(1),
  direction: z.string().min(1),
  palette: PaletteSchema,
  typography: TypographySchema,
  copy: CopySchema,
  motionConfig: MotionConfigSchema,
  images: ImagesSchema,
  owner: z.string().nullable().optional(),
  tier: z.enum(["free", "paid"]),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

export type Direction = {
  name: string;
  displayName: string;
  tags: string[];
  paletteConstraints: {
    mode: "dark" | "light" | "adaptive";
    accentCount: number;
    backgroundBias: "near-black" | "near-white" | "warm" | "cool";
    saturation: "muted" | "muted-to-vivid-accent" | "vivid";
  };
  slotSchema: {
    hero: { eyebrow: boolean; headline: boolean; sub: boolean; cta: boolean };
    sections: { min: number; max: number; types: Array<"feature" | "quote" | "cta"> };
  };
  motion: { variant: string; intensity: "low" | "low-to-medium" | "medium" | "high" };
  status: "draft" | "stable";
};
