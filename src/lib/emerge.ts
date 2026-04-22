/**
 * Ephemeral shapes passed between intake client + /api/intake/emerge.
 * Not persisted — emerge variants exist during the intake walk; the picked
 * one lands in a CompositionSite at finalize time.
 *
 * Emerge semantics: each round returns 3 composition-variants sharing a
 * single brandColor. The user picks a structure, not a palette.
 */
import { z } from "zod";

export const EmergeVariantSchema = z.object({
    id: z.string(),
    label: z.string(),
    compositionId: z.string(),
    compositionLabel: z.string(),
    brandColor: z.string(),
    previewHeadline: z.string(),
});

export type EmergeVariant = z.infer<typeof EmergeVariantSchema>;
