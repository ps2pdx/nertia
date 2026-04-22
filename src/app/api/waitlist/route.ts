import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(64).optional(),
});

// Firebase RTDB keys forbid `.`, `$`, `#`, `/`, `[`, `]`. `@` is allowed
// but we swap it for readability in the admin view.
function emailToKey(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/@/g, "_at_")
    .replace(/[.$#[\]/]/g, "__");
}

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

    const email = parsed.data.email.toLowerCase().trim();
    const source = parsed.data.source ?? "unknown";
    const key = emailToKey(email);
    const ref = getAdminDb().ref(`waitlist/${key}`);
    const snap = await ref.get();
    if (snap.exists()) {
      return NextResponse.json({ ok: true, alreadyOnList: true });
    }
    await ref.set({ email, source, createdAt: Date.now() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/waitlist] error:", message);
    return NextResponse.json(
      { error: "server error", detail: message },
      { status: 500 },
    );
  }
}
