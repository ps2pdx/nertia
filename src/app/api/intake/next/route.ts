import { NextResponse } from "next/server";
import { z } from "zod";
import { pickQuestions } from "@/lib/questionBank";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

/**
 * Picks two adaptive follow-up questions from the static questionBank
 * based on BrandContext keywords. Zero LLM calls.
 */
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
        const [q1, q2] = pickQuestions(parsed.data.brandContext);
        return NextResponse.json({ questions: [q1, q2] });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[/api/intake/next] error:", message);
        return NextResponse.json(
            { error: "server error", detail: message },
            { status: 500 },
        );
    }
}
