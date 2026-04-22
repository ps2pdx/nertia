// scripts/migrate-blog-to-rtdb.ts
// Run once: `npx tsx scripts/migrate-blog-to-rtdb.ts [--dry-run]`
//
// Imports:
//   src/content/blog/*.md              → notepad/posts/{uuid} with status=published
//   ~/notepad/drafts/*.md              → notepad/posts/{uuid} with status=draft (or ready if blog_worthy)

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
import matter from "gray-matter";
import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const DRY = process.argv.includes("--dry-run");

/**
 * Parse a markdown file's frontmatter. Returns null if the YAML is malformed
 * so the caller can skip the file and continue the migration — one bad draft
 * shouldn't abort all N others.
 */
function safeParseMatter(filepath: string): { data: Record<string, unknown>; content: string } | null {
    const raw = fs.readFileSync(filepath, "utf-8");
    try {
        const parsed = matter(raw);
        return { data: parsed.data as Record<string, unknown>, content: parsed.content };
    } catch (err) {
        const msg = err instanceof Error ? err.message.split("\n")[0] : String(err);
        console.warn(`[skip] malformed frontmatter in ${filepath}: ${msg}`);
        return null;
    }
}

function initAdmin() {
  if (getApps().length > 0) return;
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!databaseURL) throw new Error("NEXT_PUBLIC_FIREBASE_DATABASE_URL required");
  const credB64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let creds;
  if (credB64) creds = cert(JSON.parse(Buffer.from(credB64, "base64").toString("utf-8")));
  else if (credJson) creds = cert(JSON.parse(credJson));
  else creds = applicationDefault();
  initializeApp({ credential: creds, databaseURL });
}

async function getExistingBySessionOrSlug() {
  const snap = await getDatabase().ref("notepad/posts").get();
  const bySession = new Set<string>();
  const bySlug = new Set<string>();
  if (!snap.exists()) return { bySession, bySlug };
  const raw = snap.val() as Record<string, { source_session_id?: string; slug?: string; status?: string }>;
  for (const p of Object.values(raw)) {
    if (p.source_session_id) bySession.add(p.source_session_id);
    if (p.slug && p.status === "published") bySlug.add(p.slug);
  }
  return { bySession, bySlug };
}

async function migrateBlog() {
  const dir = path.join(process.cwd(), "src/content/blog");
  if (!fs.existsSync(dir)) return;
  const { bySlug } = await getExistingBySessionOrSlug();
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const parsed = safeParseMatter(path.join(dir, file));
    if (!parsed) continue;
    const { data, content } = parsed;
    const slug = (data.slug as string) || file.replace(/\.md$/, "");
    if (bySlug.has(slug)) {
      console.log(`skip published (slug exists): ${slug}`);
      continue;
    }
    const id = randomUUID();
    const now = Date.now();
    const post = {
      id,
      title: (data.title as string) ?? slug,
      slug,
      body: content.trim(),
      excerpt: (data.excerpt as string) ?? "",
      tags: (data.tags as string[]) ?? [],
      hero: (data.hero as string) ?? null,
      date: (data.date as string) ?? new Date().toISOString().slice(0, 10),
      status: "published",
      source: "manual",
      source_session_id: null,
      authored: true,
      merged_from: null,
      merged_into: null,
      cwd: null,
      created_at: now,
      updated_at: now,
      published_at: now,
    };
    console.log(`${DRY ? "[dry] " : ""}publish ${slug} → ${id}`);
    if (!DRY) await getDatabase().ref(`notepad/posts/${id}`).set(post);
  }
}

async function migrateDrafts() {
  const dir = path.join(os.homedir(), "notepad", "drafts");
  if (!fs.existsSync(dir)) return;
  const { bySession } = await getExistingBySessionOrSlug();
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const parsed = safeParseMatter(path.join(dir, file));
    if (!parsed) continue;
    const { data, content } = parsed;
    const sessionId = (data.session_id as string) ?? file.replace(/\.md$/, "");
    if (bySession.has(sessionId)) {
      console.log(`skip draft (session exists): ${sessionId}`);
      continue;
    }
    const blogWorthy = String(data.blog_worthy ?? "false").toLowerCase() === "true";
    const authored = String(data.authored ?? "false").toLowerCase() === "true";
    const id = randomUUID();
    const now = Date.now();
    const post = {
      id,
      title: (data.title as string) ?? "(untitled)",
      slug: null,
      body: content.trim(),
      excerpt: "",
      tags: (data.tags as string[]) ?? [],
      hero: null,
      date: (data.date as string) ?? new Date().toISOString().slice(0, 10),
      status: blogWorthy ? "ready" : "draft",
      source: "notepad-session",
      source_session_id: sessionId,
      authored,
      merged_from: null,
      merged_into: null,
      cwd: (data.cwd as string) ?? null,
      created_at: now,
      updated_at: now,
      published_at: null,
    };
    console.log(`${DRY ? "[dry] " : ""}draft ${sessionId} (${post.status}) → ${id}`);
    if (!DRY) await getDatabase().ref(`notepad/posts/${id}`).set(post);
  }
}

async function main() {
  initAdmin();
  await migrateBlog();
  await migrateDrafts();
  console.log("done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
