/**
 * Fixed pool of adaptive follow-up questions. The intake asks Q4 + Q5 from
 * this bank after Q1-Q3 (purpose/audience/vibe). Deterministic per-ctx pick.
 */
import type { BrandContext } from "./brandContext";
import { ctxTokens } from "./brandContext";

interface QuestionEntry {
    /** The question text shown to the user. */
    text: string;
    /** Tags to prefer when BrandContext tokens overlap these. */
    tags: string[];
}

export const questions: QuestionEntry[] = [
    {
        text: "Name three brands whose websites you respect, and why they work for you.",
        tags: ["editorial", "warm", "minimal", "architect", "designer", "creative"],
    },
    {
        text: "If a visitor leaves remembering one feeling, what should it be?",
        tags: ["warm", "personal", "bio", "portfolio", "writer"],
    },
    {
        text: "What should the homepage make an engineer feel in the first five seconds?",
        tags: ["technical", "developer", "saas", "product", "api", "platform"],
    },
    {
        text: "Who's the person you'd most want to read this and nod?",
        tags: ["writer", "editorial", "creator", "musician", "artist"],
    },
    {
        text: "Describe the room the site should feel like.",
        tags: ["cinematic", "atmospheric", "moody", "warm", "architect"],
    },
    {
        text: "What's the one-sentence version you'd tell someone in an elevator?",
        tags: ["saas", "product", "startup", "platform"],
    },
    {
        text: "What should someone at 2am feel landing here?",
        tags: ["warm", "personal", "wellness", "human"],
    },
    {
        text: "Which of your influences would you be embarrassed to list publicly?",
        tags: ["creative", "musician", "artist", "design"],
    },
    {
        text: "What existing product does this sit next to on someone's shortlist?",
        tags: ["saas", "product", "startup", "b2b"],
    },
    {
        text: "What should a reader trust you about without you having to prove it?",
        tags: ["editorial", "writer", "consultant", "technical", "credible"],
    },
];

/**
 * Deterministic pick of two questions from the bank. Scores each question's
 * tags against ctx tokens; returns the two highest-scoring, breaking ties
 * by list order. Never returns duplicates.
 */
export function pickQuestions(ctx: BrandContext): [string, string] {
    const tokens = ctxTokens(ctx);
    const scored = questions.map((q, i) => ({
        q,
        i,
        score: q.tags.filter((t) => tokens.has(t.toLowerCase())).length,
    }));
    scored.sort((a, b) => (b.score - a.score) || (a.i - b.i));
    const q1 = scored[0]?.q.text ?? questions[0].text;
    const q2 =
        scored.find((s) => s.q.text !== q1)?.q.text ??
        questions[1]?.text ??
        questions[0].text;
    return [q1, q2];
}
