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

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const snap = await withTimeout(
      getAdminDb().ref("notepad/posts").get(),
      FETCH_TIMEOUT_MS,
      "getAllPosts",
    );
    if (!snap.exists()) return [];
    const raw = snap.val() as Record<string, unknown>;
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
  } catch (err) {
    // RTDB unreachable / admin auth not configured / network — log and degrade
    // to an empty list so the blog index can still render its empty state.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[blog] getAllPosts failed:", err instanceof Error ? err.message : err);
    }
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
