import { pickDirection } from "./pickDirection";
import { generatePalette } from "./generatePalette";
import { writeCopy } from "./writeCopy";
import { paramMotion } from "./paramMotion";
import type { SiteConfig } from "@/directions/types";

export type BriefInput = {
  slug: string;
  businessName: string;
  oneLiner: string;
  audience: string;
  vibe: string;
  tone: string;
  tier: "free" | "paid";
  owner?: string | null;
};

export async function generate(input: BriefInput): Promise<SiteConfig> {
  const briefSummary = `${input.businessName} — ${input.oneLiner}. Audience: ${input.audience}. Vibe: ${input.vibe}.`;

  const pick = await pickDirection({ briefSummary, tone: input.tone });
  const palette = await generatePalette({ direction: pick.direction, briefSummary });
  const copy = await writeCopy({ direction: pick.direction, briefSummary, tone: input.tone });
  const motion = await paramMotion({ direction: pick.direction, accent: palette.accent });

  return {
    slug: input.slug,
    direction: pick.direction,
    palette,
    typography: { heading: "Inter Display", body: "Inter", scale: 1.3 },
    copy,
    motionConfig: motion,
    images: {},
    owner: input.owner ?? null,
    tier: input.tier,
  };
}
