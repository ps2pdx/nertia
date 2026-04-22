import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  CompositionSiteSchema,
  LegacySiteSchema,
  isCompositionSite,
  type AnySite,
} from "@/lib/siteShapes";

/**
 * Firebase Realtime DB forbids `.`, `#`, `$`, `/`, `[`, `]` in keys.
 * Our copy-slot keys use dots (e.g. "hero.headline" or "hero-1.headline")
 * so we transform at the storage boundary only.
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

/**
 * Returns either a legacy template-keyed site or a composition-keyed site.
 * Callers should type-narrow with isCompositionSite / isLegacySite from
 * siteShapes.
 */
export async function getSite(slug: string): Promise<AnySite | null> {
  const snap = await getAdminDb().ref(`sites/${slug}`).get();
  if (!snap.exists()) return null;
  const raw = snap.val() as Record<string, unknown>;
  const rawCopy = (raw.copy as Record<string, string> | undefined) ?? {};
  const decoded = { ...raw, copy: decodeCopyKeys(rawCopy) };

  // Discriminate by presence of composition vs templateId
  if ("composition" in decoded && decoded.composition) {
    return CompositionSiteSchema.parse(decoded);
  }
  return LegacySiteSchema.parse(decoded);
}

export async function putSite(site: AnySite): Promise<AnySite> {
  const now = Date.now();
  const next: AnySite = {
    ...site,
    createdAt: site.createdAt ?? now,
    updatedAt: now,
  };
  if (isCompositionSite(next)) {
    CompositionSiteSchema.parse(next);
  } else {
    LegacySiteSchema.parse(next);
  }
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
