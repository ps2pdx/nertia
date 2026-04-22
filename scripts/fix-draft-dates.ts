// scripts/fix-draft-dates.ts
// Backfill the correct session date onto RTDB notepad posts.
// Run: `set -a; source .env.local; set +a; npx tsx scripts/fix-draft-dates.ts [--dry-run]`
//
// Source of truth (in priority order):
//   1) source markdown filename prefix ~/notepad/drafts/YYYY-MM-DD-<hash>.md
//   2) `date:` field parsed from the file's frontmatter
//   3) created_at timestamp (unchanged fallback — last resort)
//
// We join RTDB posts to source files via source_session_id.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import matter from "gray-matter";
import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const DRY = process.argv.includes("--dry-run");

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

function dateFromFilename(filename: string): string | null {
  const m = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  return m ? m[1] : null;
}

function dateFromFrontmatter(filepath: string): string | null {
  try {
    const raw = fs.readFileSync(filepath, "utf-8");
    const parsed = matter(raw);
    const d = parsed.data.date;
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
    if (d instanceof Date && !isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch {
    // malformed frontmatter — ignore
  }
  return null;
}

async function main() {
  initAdmin();
  const db = getDatabase();
  const snap = await db.ref("notepad/posts").get();
  const posts = (snap.val() ?? {}) as Record<string, Record<string, unknown>>;

  const draftsDir = path.join(os.homedir(), "notepad", "drafts");
  const files = fs.existsSync(draftsDir) ? fs.readdirSync(draftsDir).filter((f) => f.endsWith(".md")) : [];

  // Build session_id → best-date index from local files.
  const sessionDateIndex = new Map<string, string>();
  for (const f of files) {
    const fromName = dateFromFilename(f);
    const fromFm = dateFromFrontmatter(path.join(draftsDir, f));
    const best = fromName ?? fromFm;
    if (!best) continue;
    // session_id is either in frontmatter or the hash portion of the filename
    const hash = f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
    sessionDateIndex.set(hash, best);
    try {
      const parsed = matter(fs.readFileSync(path.join(draftsDir, f), "utf-8"));
      const sid = parsed.data.session_id;
      if (typeof sid === "string") sessionDateIndex.set(sid, best);
    } catch {
      // skip malformed
    }
  }

  let patched = 0;
  let skipped = 0;
  const now = Date.now();

  for (const [id, p] of Object.entries(posts)) {
    const sid = (p.source_session_id as string | null | undefined) ?? null;
    if (!sid) {
      skipped++;
      continue;
    }
    const correctDate = sessionDateIndex.get(sid);
    if (!correctDate) {
      // Try matching by hash prefix in sid
      const hashOnly = sid.split("-")[0];
      const fallback = sessionDateIndex.get(hashOnly);
      if (!fallback) {
        skipped++;
        continue;
      }
    }
    const resolved = correctDate ?? sessionDateIndex.get(sid.split("-")[0]);
    if (!resolved) {
      skipped++;
      continue;
    }
    if (p.date === resolved) {
      continue; // already correct
    }
    console.log(`[patch] ${id} date ${p.date} → ${resolved} (sid=${sid})`);
    if (!DRY) {
      await db.ref(`notepad/posts/${id}`).update({ date: resolved, updated_at: now });
    }
    patched++;
  }

  console.log(`done. patched=${patched} skipped=${skipped} ${DRY ? "(dry-run)" : ""}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
