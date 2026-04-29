import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().max(254),
  message: z.string().trim().max(2000).optional(),
  package: z.enum(["observation", "particle", "wave", "entanglement"]).optional(),
});

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

    const { name, email, message, package: pkg } = parsed.data;
    const ref = getAdminDb().ref("inquiries").push();
    await ref.set({
      name,
      email: email.toLowerCase().trim(),
      message: message ?? "",
      package: pkg ?? "observation",
      createdAt: Date.now(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/book-inquiry] error:", message);
    return NextResponse.json(
      { error: "server error", detail: message },
      { status: 500 },
    );
  }
}
