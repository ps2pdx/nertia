import { getAdminDb } from "@/lib/firebaseAdmin";
import { SiteSchema, type Site } from "@/templates/types";

export async function getSite(slug: string): Promise<Site | null> {
  const snap = await getAdminDb().ref(`sites/${slug}`).get();
  if (!snap.exists()) return null;
  const raw = snap.val();
  return SiteSchema.parse(raw);
}

export async function putSite(site: Site): Promise<Site> {
  const now = Date.now();
  const next: Site = {
    ...site,
    createdAt: site.createdAt ?? now,
    updatedAt: now,
  };
  SiteSchema.parse(next);
  await getAdminDb().ref(`sites/${next.slug}`).set(next);
  return next;
}

export async function slugIsTaken(slug: string): Promise<boolean> {
  const snap = await getAdminDb().ref(`sites/${slug}`).get();
  return snap.exists();
}
