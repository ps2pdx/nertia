import { getAdminDb } from "@/lib/firebaseAdmin";
import { SiteSchema, type Site } from "@/templates/types";

/**
 * Firebase Realtime DB forbids `.`, `#`, `$`, `/`, `[`, `]` in keys.
 * Our copy-slot keys use dots (e.g. "hero.headline") so we transform
 * at the storage boundary only.
 */
const DOT_ESCAPE = "__";

function encodeCopyKeys(copy: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(copy)) {
    out[k.replace(/\./g, DOT_ESCAPE)] = v;
  }
  return out;
}

function decodeCopyKeys(copy: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(copy)) {
    out[k.replace(new RegExp(DOT_ESCAPE, "g"), ".")] = v;
  }
  return out;
}

export async function getSite(slug: string): Promise<Site | null> {
  const snap = await getAdminDb().ref(`sites/${slug}`).get();
  if (!snap.exists()) return null;
  const raw = snap.val() as Site;
  const decoded: Site = { ...raw, copy: decodeCopyKeys(raw.copy ?? {}) };
  return SiteSchema.parse(decoded);
}

export async function putSite(site: Site): Promise<Site> {
  const now = Date.now();
  const next: Site = {
    ...site,
    createdAt: site.createdAt ?? now,
    updatedAt: now,
  };
  SiteSchema.parse(next);
  const storable = { ...next, copy: encodeCopyKeys(next.copy) };
  await getAdminDb().ref(`sites/${next.slug}`).set(storable);
  return next;
}

export async function slugIsTaken(slug: string): Promise<boolean> {
  const snap = await getAdminDb().ref(`sites/${slug}`).get();
  return snap.exists();
}

/**
 * Persist the brand context + theme variant alongside a site under
 * `siteBrands/{slug}`. Used by the Emerge intake to keep the derived
 * BrandSystem retrievable after site creation.
 */
export async function putSiteBrand(
  slug: string,
  data: unknown,
): Promise<void> {
  const now = Date.now();
  await getAdminDb()
    .ref(`siteBrands/${slug}`)
    .set({ ...(data as object), createdAt: now, updatedAt: now });
}
