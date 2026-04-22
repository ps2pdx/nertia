// src/app/api/admin/notepad/batch/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, patchPost, deletePost, listPosts } from "@/lib/notepad-admin";
import { canTransition } from "@/lib/notepad";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  action: z.enum(["delete", "draft", "ready", "published"]),
}).strict();

type Failure = { id: string; error: string };

export async function POST(req: Request): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", issues: parsed.error.issues }, { status: 422 });
  }
  const { ids, action } = parsed.data;

  const failures: Failure[] = [];
  let succeeded = 0;

  if (action === "delete") {
    for (const id of ids) {
      try {
        await deletePost(id);
        succeeded++;
      } catch (e) {
        failures.push({ id, error: String((e as Error).message ?? e) });
      }
    }
    return NextResponse.json({ ok: failures.length === 0, succeeded, failed: failures });
  }

  if (action === "published") {
    const all = await listPosts();
    const takenSlugs = new Set(
      all.filter((p) => p.status === "published" && !ids.includes(p.id)).map((p) => p.slug).filter(Boolean) as string[],
    );
    const now = Date.now();
    const revalidates: string[] = [];
    for (const id of ids) {
      try {
        const post = await getPost(id);
        if (!post) throw new Error("not found");
        if (!canTransition(post.status, "published")) {
          throw new Error(`cannot publish from ${post.status}`);
        }
        let slug = post.slug && post.slug.length > 0 ? post.slug : slugify(post.title || id);
        if (takenSlugs.has(slug)) {
          const suffix = Math.random().toString(36).slice(2, 6);
          slug = `${slug}-${suffix}`.slice(0, 40);
        }
        takenSlugs.add(slug);
        await patchPost(id, { status: "published", slug, published_at: now });
        revalidates.push(`/blog/${slug}`);
        succeeded++;
      } catch (e) {
        failures.push({ id, error: String((e as Error).message ?? e) });
      }
    }
    revalidatePath("/blog");
    for (const p of revalidates) revalidatePath(p);
    return NextResponse.json({ ok: failures.length === 0, succeeded, failed: failures });
  }

  // draft | ready
  for (const id of ids) {
    try {
      const post = await getPost(id);
      if (!post) throw new Error("not found");
      if (!canTransition(post.status, action)) {
        throw new Error(`cannot transition ${post.status} → ${action}`);
      }
      await patchPost(id, { status: action });
      succeeded++;
    } catch (e) {
      failures.push({ id, error: String((e as Error).message ?? e) });
    }
  }
  return NextResponse.json({ ok: failures.length === 0, succeeded, failed: failures });
}
