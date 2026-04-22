import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface WaitlistRow {
  key: string;
  email: string;
  source: string;
  createdAt: number;
}

interface SiteRow {
  slug: string;
  templateId: string;
  createdAt?: number;
  updatedAt?: number;
}

export async function GET(): Promise<Response> {
  try {
    const db = getAdminDb();
    const [waitlistSnap, sitesSnap] = await Promise.all([
      db.ref("waitlist").get(),
      db.ref("sites").get(),
    ]);

    const waitlistRaw = (waitlistSnap.exists() ? waitlistSnap.val() : {}) as Record<
      string,
      { email?: string; source?: string; createdAt?: number }
    >;
    const sitesRaw = (sitesSnap.exists() ? sitesSnap.val() : {}) as Record<
      string,
      { templateId?: string; createdAt?: number; updatedAt?: number }
    >;

    const waitlist: WaitlistRow[] = Object.entries(waitlistRaw)
      .map(([key, value]) => ({
        key,
        email: value.email ?? "",
        source: value.source ?? "unknown",
        createdAt: value.createdAt ?? 0,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    const sites: SiteRow[] = Object.entries(sitesRaw)
      .map(([slug, value]) => ({
        slug,
        templateId: value.templateId ?? "unknown",
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
      }))
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

    return NextResponse.json({
      waitlist,
      sites,
      counts: { waitlist: waitlist.length, sites: sites.length },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/admin/zero-point] error:", message);
    return NextResponse.json(
      { error: "server error", detail: message },
      { status: 500 },
    );
  }
}
