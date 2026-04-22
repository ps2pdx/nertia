/**
 * Ephemeral shapes passed between intake client + /api/intake/emerge.
 * Not persisted — emerge variants exist during the intake walk; the picked
 * one lands in a CompositionSite at finalize time (broken apart into
 * composition + tokens).
 */
import { z } from "zod";
import { PaletteSchema, FontPairSchema } from "./siteShapes";

export const EmergeVariantSchema = z.object({
    id: z.string(),
    label: z.string(),
    palette: PaletteSchema,
    fontPair: FontPairSchema,
    compositionId: z.string(),
    compositionLabel: z.string(),
    previewHeadline: z.string(),
});

export type EmergeVariant = z.infer<typeof EmergeVariantSchema>;
