// src/app/api/admin/notepad/media/upload/route.ts
import { NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { verifyAdminToken } from "@/lib/auth-admin";
import { initAdmin } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const form = await req.formData();
  const file = form.get("file");
  const postId = String(form.get("postId") ?? "");
  const kind = String(form.get("kind") ?? "media");
  if (!(file instanceof File) || !postId) {
    return NextResponse.json({ error: "missing file or postId" }, { status: 422 });
  }

  const app = initAdmin();
  const bucket = getStorage(app).bucket();
  const ext = file.name.split(".").pop() ?? "bin";
  const objectPath = kind === "hero" ? `blog/${postId}/hero.${ext}` : `blog/${postId}/media/${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const obj = bucket.file(objectPath);
  await obj.save(buffer, { contentType: file.type, public: true });
  const url = `https://storage.googleapis.com/${bucket.name}/${objectPath}?v=${Date.now()}`;

  return NextResponse.json({ url });
}
