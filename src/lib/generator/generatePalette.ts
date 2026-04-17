import Anthropic from "@anthropic-ai/sdk";
import { PaletteSchema, type Palette } from "@/directions/types";
import { getDirection } from "@/directions";
import { SYSTEM_GENERATE_PALETTE } from "./prompts";

export type GeneratePaletteInput = { direction: string; briefSummary: string };

const FALLBACKS: Record<string, Palette> = {
  "zero-point": { bg: "#0a0a0a", fg: "#f5f5f5", accent: "#00d4ff", muted: "#6b6b6b" },
};
const DEFAULT_FALLBACK: Palette = FALLBACKS["zero-point"];

export async function generatePalette(input: GeneratePaletteInput): Promise<Palette> {
  const client = new Anthropic();
  const dir = getDirection(input.direction);
  const constraints = dir
    ? `Direction: ${dir.name}. Constraints: mode=${dir.paletteConstraints.mode}, background=${dir.paletteConstraints.backgroundBias}, accentCount=${dir.paletteConstraints.accentCount}`
    : `Direction: ${input.direction}`;

  try {
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: [
        { type: "text", text: SYSTEM_GENERATE_PALETTE, cache_control: { type: "ephemeral" } },
        { type: "text", text: constraints, cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: `Brief: ${input.briefSummary}` }],
    });
    const text = res.content.find((c) => c.type === "text");
    if (!text || text.type !== "text") return FALLBACKS[input.direction] ?? DEFAULT_FALLBACK;
    return PaletteSchema.parse(JSON.parse(text.text));
  } catch {
    return FALLBACKS[input.direction] ?? DEFAULT_FALLBACK;
  }
}
