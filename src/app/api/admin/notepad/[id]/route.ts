// src/app/api/admin/notepad/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, patchPost, deletePost } from "@/lib/notepad-admin";
import { canTransition, STATUSES } from "@/lib/notepad";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PatchSchema = z
  .object({
    title: z.string().optional(),
    body: z.string().optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    hero: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    status: z.enum(STATUSES).optional(),
    date: z.string().optional(),
  })
  .strict();

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { id } = await ctx.params;
  const raw = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", issues: parsed.error.issues }, { status: 422 });
  }
  if (parsed.data.status) {
    const current = await getPost(id);
    if (!current) return NextResponse.json({ error: "not found" }, { status: 404 });
    if (!canTransition(current.status, parsed.data.status)) {
      return NextResponse.json(
        { error: `illegal transition ${current.status} → ${parsed.data.status}` },
        { status: 422 },
      );
    }
  }
  await patchPost(id, parsed.data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { id } = await ctx.params;
  await deletePost(id);
  return NextResponse.json({ ok: true });
}
