import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "_nonexistent_";

  const databaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? null;
  const hasServiceAcctJson = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const hasServiceAcctB64 = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64);

  let saProjectId: string | null = null;
  let saClientEmail: string | null = null;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64) {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64, "base64").toString("utf-8");
      const obj = JSON.parse(decoded) as { project_id?: string; client_email?: string };
      saProjectId = obj.project_id ?? null;
      saClientEmail = obj.client_email ?? null;
    }
  } catch {
    saProjectId = "parse-failed";
  }

  let readResult: { exists: boolean; val?: unknown; error?: string } = { exists: false };
  try {
    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const snap = await getAdminDb().ref(`sites/${slug}`).get();
    readResult = { exists: snap.exists(), val: snap.val() };
  } catch (err) {
    readResult = { exists: false, error: err instanceof Error ? err.message : String(err) };
  }

  return NextResponse.json({
    env: {
      databaseUrl,
      hasServiceAcctJson,
      hasServiceAcctB64,
      saProjectId,
      saClientEmail,
    },
    query: { slug },
    readResult,
  });
}
