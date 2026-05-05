import { getAdminDb } from "@/lib/firebaseAdmin";
import { PostSchema } from "@/lib/notepad";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  hero?: string;
  content: string;
}

const FETCH_TIMEOUT_MS = 5000;

/**
 * Race a promise against a timeout so a hung Firebase admin auth call
 * (common in local dev when no service account creds are set) doesn't
 * stall the whole request indefinitely.
 */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

function shapePosts(raw: Record<string, unknown>): BlogPost[] {
  const posts: BlogPost[] = [];
  for (const value of Object.values(raw)) {
    const parsed = PostSchema.safeParse(value);
    if (!parsed.success) continue;
    const p = parsed.data;
    if (p.status !== "published" || !p.slug) continue;
    posts.push({
      slug: p.slug,
      title: p.title,
      date: p.date,
      excerpt: p.excerpt,
      tags: p.tags,
      hero: p.hero ?? undefined,
      content: p.body,
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

/**
 * Try the public RTDB REST endpoint first. Works without any server-side
 * credentials when `notepad/posts` has `.read: true` rules — which is the
 * semantically correct rule since published posts are world-readable.
 * Returns null if the endpoint isn't open (401/403/network).
 */
async function fetchPostsViaRest(): Promise<BlogPost[] | null> {
  const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!dbUrl) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(`${dbUrl}/notepad/posts.json`, {
      signal: ctrl.signal,
      // Next caches GETs by default — re-fetch every revalidate window.
      next: { revalidate: 60 },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown> | null;
    if (!json) return [];
    return shapePosts(json);
  } catch {
    return null;
  }
}

/**
 * Fallback: server-side admin SDK. Requires FIREBASE_SERVICE_ACCOUNT_JSON_B64
 * (or applicationDefault creds on GCP). Wrapped in a timeout so a hung auth
 * call in local dev fails fast instead of stalling the request.
 */
async function fetchPostsViaAdmin(): Promise<BlogPost[]> {
  const snap = await withTimeout(
    getAdminDb().ref("notepad/posts").get(),
    FETCH_TIMEOUT_MS,
    "getAllPosts(admin)",
  );
  if (!snap.exists()) return [];
  return shapePosts(snap.val() as Record<string, unknown>);
}

export async function getAllPosts(): Promise<BlogPost[]> {
  // Public REST first — fastest path, no creds needed when rules are open.
  const viaRest = await fetchPostsViaRest();
  if (viaRest !== null) return viaRest;

  // Fallback to admin SDK. In prod this is the normal path; in dev it
  // requires FIREBASE_SERVICE_ACCOUNT_JSON_B64 in .env.local.
  try {
    return await fetchPostsViaAdmin();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[blog] both REST and admin reads failed:",
        err instanceof Error ? err.message : err,
        "\n        → loosen RTDB rule on /notepad/posts to .read: true,",
        "\n          OR add FIREBASE_SERVICE_ACCOUNT_JSON_B64 to .env.local.",
      );
    }
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
