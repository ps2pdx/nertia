// src/app/api/admin/notepad/media/upload/route.ts
import { NextResponse } from "next/server";
import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { verifyAdminToken } from "@/lib/auth-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ensureApp() {
  if (getApps().length > 0) return;
  const credB64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  let creds;
  if (credB64) creds = cert(JSON.parse(Buffer.from(credB64, "base64").toString("utf-8")));
  else if (credJson) creds = cert(JSON.parse(credJson));
  else creds = applicationDefault();
  initializeApp({ credential: creds, storageBucket: bucket });
}

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

  ensureApp();
  const bucket = getStorage().bucket();
  const ext = file.name.split(".").pop() ?? "bin";
  const objectPath = kind === "hero" ? `blog/${postId}/hero.${ext}` : `blog/${postId}/media/${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const obj = bucket.file(objectPath);
  await obj.save(buffer, { contentType: file.type, public: true });
  const url = `https://storage.googleapis.com/${bucket.name}/${objectPath}`;

  return NextResponse.json({ url });
}
