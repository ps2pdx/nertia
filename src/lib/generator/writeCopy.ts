import Anthropic from "@anthropic-ai/sdk";
import { CopySchema, type Copy } from "@/directions/types";
import { humanize } from "@/lib/humanize";
import { SYSTEM_WRITE_COPY } from "./prompts";

export type WriteCopyInput = { direction: string; briefSummary: string; tone: string };

const FALLBACK: Copy = {
  hero: {
    eyebrow: "",
    headline: "Something worth building.",
    sub: "A quiet place for the idea.",
    cta: "Begin",
  },
  sections: [],
};

function humanizeCopy(c: Copy): Copy {
  const hero = {
    eyebrow: humanize(c.hero.eyebrow),
    headline: humanize(c.hero.headline),
    sub: humanize(c.hero.sub),
    cta: humanize(c.hero.cta),
  };
  const sections = c.sections.map((s) => ({
    ...s,
    headline: s.headline ? humanize(s.headline) : s.headline,
    body: s.body ? humanize(s.body) : s.body,
    cta: s.cta ? humanize(s.cta) : s.cta,
  }));
  return { hero, sections };
}

export async function writeCopy(input: WriteCopyInput): Promise<Copy> {
  const client = new Anthropic();
  try {
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: [
        { type: "text", text: SYSTEM_WRITE_COPY, cache_control: { type: "ephemeral" } },
        {
          type: "text",
          text: `Schema: { "hero": { "eyebrow": str, "headline": str, "sub": str, "cta": str }, "sections": [ { "type": "feature"|"quote"|"cta", "headline"?: str, "body"?: str, "cta"?: str } ] }`,
          cache_control: { type: "ephemeral" },
        },
        { type: "text", text: `Direction: ${input.direction}` },
      ],
      messages: [{ role: "user", content: `Brief: ${input.briefSummary}\nTone: ${input.tone}` }],
    });
    const text = res.content.find((c) => c.type === "text");
    if (!text || text.type !== "text") return FALLBACK;
    const parsed = CopySchema.parse(JSON.parse(text.text));
    return humanizeCopy(parsed);
  } catch {
    return humanizeCopy(FALLBACK);
  }
}
