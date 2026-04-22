import { getAdminDb } from "@/lib/firebaseAdmin";
import { type Post, PostSchema } from "@/lib/notepad";

const ROOT = "notepad/posts";

export async function listPosts(): Promise<Post[]> {
  const snap = await getAdminDb().ref(ROOT).get();
  if (!snap.exists()) return [];
  const raw = snap.val() as Record<string, unknown>;
  const posts: Post[] = [];
  for (const [, value] of Object.entries(raw)) {
    const parsed = PostSchema.safeParse(value);
    if (parsed.success) posts.push(parsed.data);
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getPost(id: string): Promise<Post | null> {
  const snap = await getAdminDb().ref(`${ROOT}/${id}`).get();
  if (!snap.exists()) return null;
  const parsed = PostSchema.safeParse(snap.val());
  return parsed.success ? parsed.data : null;
}

export async function putPost(post: Post): Promise<void> {
  await getAdminDb().ref(`${ROOT}/${post.id}`).set(post);
}

export async function patchPost(id: string, patch: Partial<Post>): Promise<void> {
  await getAdminDb()
    .ref(`${ROOT}/${id}`)
    .update({ ...patch, updated_at: Date.now() });
}

export async function deletePost(id: string): Promise<void> {
  await getAdminDb().ref(`${ROOT}/${id}`).remove();
}
