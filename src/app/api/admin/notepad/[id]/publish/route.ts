// src/app/api/admin/notepad/[id]/publish/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, patchPost, listPosts } from "@/lib/notepad-admin";
import { canTransition } from "@/lib/notepad";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({ slug: z.string().min(1).max(60) }).strict();
type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await ctx.params;
  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 422 });

  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canTransition(post.status, "published")) {
    return NextResponse.json({ error: `cannot publish from ${post.status}` }, { status: 422 });
  }

  const all = await listPosts();
  if (all.some((p) => p.id !== id && p.status === "published" && p.slug === parsed.data.slug)) {
    return NextResponse.json({ error: "slug already in use" }, { status: 422 });
  }

  const now = Date.now();
  await patchPost(id, { status: "published", slug: parsed.data.slug, published_at: now });

  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);

  return NextResponse.json({ ok: true });
}
