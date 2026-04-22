import { NextResponse } from "next/server";
import { randomPreset } from "@/lib/presetBrands";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns a fully-populated preset BrandContext for the "↯ imagine a brand to try"
 * button. Zero LLM calls — just a pick from the curated presetBrands library.
 */
export async function POST(): Promise<Response> {
    try {
        const brandContext = randomPreset();
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
