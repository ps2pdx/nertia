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

export async function getAllPosts(): Promise<BlogPost[]> {
  const snap = await getAdminDb().ref("notepad/posts").get();
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
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
