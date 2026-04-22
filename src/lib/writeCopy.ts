/**
 * Orchestrates per-section writeCopy functions into a single Site.copy map.
 * Keys are `{instanceId}.{slotKey}` so multiple instances of the same
 * section type don't collide.
 */
import type { BrandContext } from "./brandContext";
import type { CompositionInstance } from "./siteShapes";
import { getSection } from "@/sections";

export function writeCopy(
    ctx: BrandContext,
    composition: CompositionInstance,
): Record<string, string> {
    const out: Record<string, string> = {};
    for (const inst of composition.sections) {
        const section = getSection(inst.id);
        if (!section) continue;
        const slots = section.writeCopy(ctx);
        for (const [slotKey, value] of Object.entries(slots)) {
            // skip empty strings so Site.copy stays tidy and schema fallbacks render
            if (value === "") continue;
            out[`${inst.instanceId}.${slotKey}`] = value;
        }
    }
    return out;
}
