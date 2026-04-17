import { getAdminDb } from "@/lib/firebaseAdmin";
import { SiteConfigSchema, type SiteConfig } from "@/directions/types";

export async function getSite(slug: string): Promise<SiteConfig | null> {
  const snap = await getAdminDb().ref(`sites/${slug}`).get();
  if (!snap.exists()) return null;
  const raw = snap.val();
  return SiteConfigSchema.parse(raw);
}

export async function putSite(config: SiteConfig): Promise<SiteConfig> {
  const now = Date.now();
  const next: SiteConfig = {
    ...config,
    createdAt: config.createdAt ?? now,
    updatedAt: now,
  };
  SiteConfigSchema.parse(next);
  await getAdminDb().ref(`sites/${next.slug}`).set(next);
  return next;
}

export async function slugIsTaken(slug: string): Promise<boolean> {
  const snap = await getAdminDb().ref(`sites/${slug}`).get();
  return snap.exists();
}
