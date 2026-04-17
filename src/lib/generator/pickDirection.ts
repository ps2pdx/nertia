import Anthropic from "@anthropic-ai/sdk";
import { directions } from "@/directions";
import { SYSTEM_PICK_DIRECTION, directionLibraryManifest } from "./prompts";

export type PickDirectionInput = { briefSummary: string; tone: string };
export type PickDirectionOutput = { direction: string; reason: string };

const FALLBACK: PickDirectionOutput = { direction: "zero-point", reason: "fallback" };

export async function pickDirection(input: PickDirectionInput): Promise<PickDirectionOutput> {
  const client = new Anthropic();
  const library = directionLibraryManifest();

  const res = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: [
      { type: "text", text: SYSTEM_PICK_DIRECTION, cache_control: { type: "ephemeral" } },
      { type: "text", text: `Library:\n${library}`, cache_control: { type: "ephemeral" } },
    ],
    messages: [
      { role: "user", content: `Brief summary: ${input.briefSummary}\nTone: ${input.tone}` },
    ],
  });

  const text = res.content.find((c) => c.type === "text")?.type === "text"
    ? (res.content.find((c) => c.type === "text") as { type: "text"; text: string }).text
    : "";

  try {
    const parsed = JSON.parse(text) as PickDirectionOutput;
    if (!directions[parsed.direction]) return FALLBACK;
    return parsed;
  } catch {
    return FALLBACK;
  }
}
