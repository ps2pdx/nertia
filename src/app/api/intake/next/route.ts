import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import type { BrandContext } from "@/lib/brandContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HAS_API_KEY = !!process.env.ANTHROPIC_API_KEY;
const USE_DEMO_MODE = process.env.USE_DEMO_MODE === "true" || !HAS_API_KEY;

const BodySchema = z.object({
  brandContext: z.object({
    purpose: z.string().optional(),
    audience: z.string().optional(),
    vibeWords: z.array(z.string()).optional(),
    adaptive: z.array(
      z.object({ question: z.string(), answer: z.string() }),
    ),
  }),
});

const DEMO_QUESTIONS = [
  "Name three brands whose websites you respect, and why they work for you.",
  "If a visitor leaves your site remembering one feeling, what should it be?",
];

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as unknown;
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const questions = USE_DEMO_MODE
      ? DEMO_QUESTIONS
      : await adaptiveQuestions(parsed.data.brandContext);
    return NextResponse.json({ questions });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/intake/next] error:", message);
    return NextResponse.json(
      { error: "server error", detail: message },
      { status: 500 },
    );
  }
}

async function adaptiveQuestions(ctx: BrandContext): Promise<string[]> {
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `You are helping a user discover their brand for a website.

Based on what they've told us so far, produce exactly TWO short follow-up questions that will most sharpen our understanding of their brand direction — aesthetic, tone, or audience. Be specific, concrete, and slightly playful. Avoid generic questions.

What we know:
- Purpose: ${ctx.purpose ?? "(not yet stated)"}
- Audience: ${ctx.audience ?? "(not yet stated)"}
- Vibe words: ${(ctx.vibeWords ?? []).join(", ") || "(none)"}

Respond with JSON only: {"questions": ["question one", "question two"]}`,
      },
    ],
  });
  const text = msg.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { text: string }).text)
    .join("\n");
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return DEMO_QUESTIONS;
  const parsed = JSON.parse(jsonMatch[0]) as { questions?: string[] };
  if (!Array.isArray(parsed.questions) || parsed.questions.length < 2) {
    return DEMO_QUESTIONS;
  }
  return parsed.questions.slice(0, 2);
}
