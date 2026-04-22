// src/app/api/admin/notepad/list/route.ts
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth-admin";
import { listPosts } from "@/lib/notepad-admin";
import { STATUSES, type Status } from "@/lib/notepad";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const all = await listPosts();

  const filtered =
    statusParam && (STATUSES as readonly string[]).includes(statusParam)
      ? all.filter((p) => p.status === (statusParam as Status))
      : all;

  return NextResponse.json({ posts: filtered });
}
