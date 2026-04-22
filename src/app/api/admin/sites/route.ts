import { NextResponse } from "next/server";
import { z } from "zod";
import { putSite } from "@/lib/siteStore";
import {
    CompositionSiteSchema,
    LegacySiteSchema,
    type AnySite,
} from "@/lib/siteShapes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only POST that writes an arbitrary Site (legacy or composition shape)
 * to Firebase. Used for seeding demo sites and for the Phase 8 legacy→composition
 * migration script. Validates with the appropriate zod schema before write.
 */
const BodySchema = z.union([CompositionSiteSchema, LegacySiteSchema]);

export async function POST(req: Request): Promise<Response> {
    try {
        const body = (await req.json()) as unknown;
        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "invalid site shape", details: parsed.error.flatten() },
                { status: 400 },
            );
        }
        const written = await putSite(parsed.data as AnySite);
        return NextResponse.json({ ok: true, slug: written.slug });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[/api/admin/sites] error:", message);
        return NextResponse.json(
            { error: "server error", detail: message },
            { status: 500 },
        );
    }
}
