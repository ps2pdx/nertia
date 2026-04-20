import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { BrandContext } from "@/lib/brandContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HAS_API_KEY = !!process.env.ANTHROPIC_API_KEY;
const USE_DEMO_MODE = process.env.USE_DEMO_MODE === "true" || !HAS_API_KEY;

/**
 * Invents a coherent, varied brand concept for the user to try without
 * filling the form. Returns a full BrandContext (purpose, audience,
 * vibeWords, + 2 adaptive Q&A pairs) ready to drop into emerge round 1.
 */
const DEMO_BRANDS: BrandContext[] = [
  {
    purpose:
      "A film-wedding photographer's portfolio — book weddings in Oaxaca, Portugal, and Kyoto.",
    audience:
      "Couples planning intimate destination weddings, art directors scouting for editorial features.",
    vibeWords: ["warm", "unhurried", "cinematic"],
    adaptive: [
      {
        question: "Name three brands whose websites you respect, and why.",
        answer:
          "Kinfolk for the generous whitespace, Cereal for editorial trust, Craig Mod for the writing-forward quiet.",
      },
      {
        question: "If a visitor leaves your site remembering one feeling, what should it be?",
        answer: "That time slows down when they look at the images.",
      },
    ],
  },
  {
    purpose:
      "An indie dev tool: a debugger that shows causality, not stack traces, for distributed systems.",
    audience:
      "Senior backend engineers and SREs who are tired of grep-ing through observability dashboards.",
    vibeWords: ["rigorous", "quiet", "technical"],
    adaptive: [
      {
        question: "Name three products whose surface you respect.",
        answer: "Linear for the keyboard density, Warp for showing not telling, TigerBeetle docs for owning the deep end.",
      },
      {
        question: "What word should an engineer use to describe you after reading the homepage?",
        answer: "Credible.",
      },
    ],
  },
  {
    purpose:
      "A solo coach's landing page — somatic coaching for people rebuilding pace after burnout.",
    audience:
      "Newly-diagnosed ADHD adults, overworked managers quietly spiraling, people who have tried productivity and want something slower.",
    vibeWords: ["grounded", "gentle", "honest"],
    adaptive: [
      {
        question: "What's a brand whose voice you'd borrow a spoonful of?",
        answer: "Mitchyll — warm, personal, not trying to optimize you.",
      },
      {
        question: "If someone lands here at 2am, what do you want them to feel?",
        answer: "That they're allowed to put the phone down.",
      },
    ],
  },
  {
    purpose: "A 24-seat tasting-menu restaurant opening in Portland focused on fermented Pacific Northwest produce.",
    audience: "Food-obsessed diners, couples planning anniversary meals, writers at bon appétit and eater.",
    vibeWords: ["considered", "intimate", "crafted"],
    adaptive: [
      {
        question: "Name a restaurant whose site made you book a flight.",
        answer: "Noma — the typography alone made it feel like a museum visit.",
      },
      {
        question: "What should someone feel after reading the homepage?",
        answer: "That there will be a thought behind every plate.",
      },
    ],
  },
  {
    purpose: "A two-person experimental game studio making deliberately unmarketable short games.",
    audience: "Weird-game enthusiasts, itch.io scroll-browsers, festival jurors, IGF voters.",
    vibeWords: ["abrasive", "honest", "playful"],
    adaptive: [
      {
        question: "Three studios whose sites feel right.",
        answer: "MSCHF for audacity, increpare for zero-frills, itch.io for refusing to be a store.",
      },
      {
        question: "What do you want someone to feel after five seconds on the site?",
        answer: "Slightly suspicious — in a good way.",
      },
    ],
  },
];

export async function POST(): Promise<Response> {
  try {
    if (USE_DEMO_MODE) {
      const pick = DEMO_BRANDS[Math.floor(Math.random() * DEMO_BRANDS.length)];
      return NextResponse.json({ brandContext: pick });
    }
    const brandContext = await imagineBrand();
    return NextResponse.json({ brandContext });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/intake/imagine] error:", message);
    return NextResponse.json(
      { error: "server error", detail: message },
      { status: 500 },
    );
  }
}

async function imagineBrand(): Promise<BrandContext> {
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    messages: [
      {
        role: "user",
        content: `Invent a coherent, specific brand concept for someone testing a website generator. Pick from a varied set: indie product, creator/portfolio, restaurant, small-biz, coach, studio, newsletter, non-profit, etc. Avoid stereotypes; be specific.

Return a BrandContext JSON with:
- purpose: one sentence, specific, evocative (e.g. "A film-wedding photographer's portfolio — book weddings in Oaxaca, Portugal, and Kyoto.")
- audience: one sentence, specific (e.g. "Couples planning intimate destination weddings, art directors scouting for editorial features.")
- vibeWords: exactly 3 short words, e.g. ["warm", "unhurried", "cinematic"]
- adaptive: exactly 2 objects, each with "question" and "answer", covering: (a) brands the user respects, (b) the single feeling they want to leave

Write the answers in FIRST person — as if the user wrote them. Specific, not generic.

Respond with JSON only: {"brandContext": {...}}`,
      },
    ],
  });
  const text = msg.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { text: string }).text)
    .join("\n");
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return DEMO_BRANDS[0];
  const parsed = JSON.parse(jsonMatch[0]) as { brandContext?: BrandContext };
  if (!parsed.brandContext) return DEMO_BRANDS[0];
  return parsed.brandContext;
}
