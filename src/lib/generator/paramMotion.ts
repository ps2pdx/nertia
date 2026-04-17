import Anthropic from "@anthropic-ai/sdk";
import { MotionConfigSchema, type MotionConfig } from "@/directions/types";
import { getDirection } from "@/directions";
import { SYSTEM_PARAM_MOTION } from "./prompts";

export type ParamMotionInput = { direction: string; accent: string };

export async function paramMotion(input: ParamMotionInput): Promise<MotionConfig> {
  const client = new Anthropic();
  const dir = getDirection(input.direction);
  const fallback: MotionConfig = {
    variant: dir?.motion.variant ?? "breath",
    intensity: "low",
    accent: input.accent,
  };

  try {
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: [
        { type: "text", text: SYSTEM_PARAM_MOTION, cache_control: { type: "ephemeral" } },
      ],
      messages: [
        { role: "user", content: `Direction: ${input.direction}\nAccent: ${input.accent}` },
      ],
    });
    const text = res.content.find((c) => c.type === "text");
    if (!text || text.type !== "text") return fallback;
    return MotionConfigSchema.parse(JSON.parse(text.text));
  } catch {
    return fallback;
  }
}
