# Notepad admin + blog migration to RTDB — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move notepad drafts and published blog posts into Firebase Realtime Database under `notepad/posts/{id}`, ship a mobile-first admin at `/admin/notepad`, and retire the filesystem-based blog.

**Architecture:** Unified RTDB tree (`notepad/posts/{id}`) with a `status` field for lifecycle (`draft | ready | published | merged | archived`). Admin UI uses existing `AuthGuard` + `isAdminEmail()`; API routes verify Firebase ID tokens server-side. Public `/blog` renders from RTDB via SSR with 60s ISR revalidate. Spec: `docs/superpowers/specs/2026-04-22-notepad-admin-and-blog-rtdb-design.md`.

**Tech Stack:** Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Firebase Realtime Database (client + firebase-admin), Firebase Storage, Firebase Auth (Google OAuth), Anthropic SDK (`@anthropic-ai/sdk`), Vitest, @testing-library/react, jsdom, zod.

**Branch:** `feature/notepad-admin-rtdb` (off `main`, one PR at the end per branching policy).

---

## File structure

### New files
```
src/lib/
  notepad.ts                         # types, zod schemas, status transitions, pure functions (slug, merge logic)
  notepad-admin.ts                   # server-side RTDB helpers (firebase-admin wrappers)
  auth-admin.ts                      # verifyAdminToken(req) middleware for API routes
src/app/admin/notepad/
  page.tsx                           # list + chip filter + accordion
  merge/page.tsx                     # merge preview screen
  components/
    ChipFilter.tsx
    DraftRow.tsx
    ExpandedRow.tsx
    MergeBar.tsx
    PolishDiff.tsx
    HeroUpload.tsx
src/app/api/admin/notepad/
  list/route.ts                      # GET
  [id]/route.ts                      # GET, PATCH, DELETE
  [id]/polish/route.ts               # POST
  [id]/publish/route.ts              # POST
  merge/route.ts                     # POST
  media/upload/route.ts              # POST (multipart)
scripts/
  migrate-blog-to-rtdb.ts            # one-time import of existing posts + drafts
src/lib/__tests__/
  notepad.test.ts
  notepad-admin.test.ts
  auth-admin.test.ts
src/app/api/admin/notepad/__tests__/
  list.test.ts
  item.test.ts
  polish.test.ts
  publish.test.ts
  merge.test.ts
docs/
  firebase-rtdb-rules.md             # rules snippet for notepad/posts (must be applied in Firebase console)
```

### Modified files
```
src/lib/blog.ts                      # rewrite: read from RTDB instead of filesystem
src/app/blog/page.tsx                # consume new async getAllPosts(), add revalidate
src/app/blog/[slug]/page.tsx         # consume getPostBySlug(), drop generateStaticParams
~/.claude/skills/notepad/bin/notepad-sync  # push drafts to RTDB instead of writing blog-candidates
```

### Deleted files (after migration)
```
src/lib/blog-candidates.ts
src/app/admin/blog/page.tsx
src/app/admin/blog/[slug]/page.tsx
src/app/api/admin/blog/route.ts
src/app/api/admin/blog/[slug]/route.ts
src/content/blog/*.md
src/content/blog-candidates/*.md
```

---

## Phase 1 — Core library

### Task 1: Post types, zod schema, status constants

**Files:**
- Create: `src/lib/notepad.ts`
- Test: `src/lib/__tests__/notepad.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/__tests__/notepad.test.ts
import { describe, it, expect } from "vitest";
import { PostSchema, STATUSES, type Post } from "@/lib/notepad";

describe("PostSchema", () => {
  it("accepts a minimal valid draft", () => {
    const post = {
      id: "abc-123",
      title: "Hello",
      body: "body",
      excerpt: "",
      tags: [],
      date: "2026-04-22",
      status: "draft",
      source: "manual",
      authored: false,
      created_at: 1_000,
      updated_at: 1_000,
    };
    expect(() => PostSchema.parse(post)).not.toThrow();
  });

  it("rejects invalid status", () => {
    const bad = { status: "bogus" } as unknown as Post;
    expect(() => PostSchema.parse(bad)).toThrow();
  });

  it("exposes all status values", () => {
    expect(STATUSES).toEqual(["draft", "ready", "published", "merged", "archived"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/notepad.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

```ts
// src/lib/notepad.ts
import { z } from "zod";

export const STATUSES = ["draft", "ready", "published", "merged", "archived"] as const;
export type Status = (typeof STATUSES)[number];

export const SOURCES = ["notepad-session", "manual", "merge"] as const;
export type Source = (typeof SOURCES)[number];

export const PostSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  slug: z.string().nullable().optional(),
  body: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  hero: z.string().nullable().optional(),
  date: z.string(),
  status: z.enum(STATUSES),
  source: z.enum(SOURCES),
  source_session_id: z.string().nullable().optional(),
  authored: z.boolean(),
  merged_from: z.array(z.string()).nullable().optional(),
  merged_into: z.string().nullable().optional(),
  cwd: z.string().nullable().optional(),
  created_at: z.number(),
  updated_at: z.number(),
  published_at: z.number().nullable().optional(),
});

export type Post = z.infer<typeof PostSchema>;
```

- [ ] **Step 4: Run and verify pass**

Run: `npm test -- src/lib/__tests__/notepad.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/notepad.ts src/lib/__tests__/notepad.test.ts
git commit -m "feat(notepad): Post schema with zod + status/source enums"
```

---

### Task 2: Status transition validator

**Files:**
- Modify: `src/lib/notepad.ts` (add `canTransition`)
- Modify: `src/lib/__tests__/notepad.test.ts`

- [ ] **Step 1: Add failing test**

Append to `src/lib/__tests__/notepad.test.ts`:

```ts
import { canTransition } from "@/lib/notepad";

describe("canTransition", () => {
  it("allows draft → ready", () => {
    expect(canTransition("draft", "ready")).toBe(true);
  });
  it("allows ready → published", () => {
    expect(canTransition("ready", "published")).toBe(true);
  });
  it("allows draft → published (skip ready)", () => {
    expect(canTransition("draft", "published")).toBe(true);
  });
  it("allows published → ready (unpublish)", () => {
    expect(canTransition("published", "ready")).toBe(true);
  });
  it("allows any → archived", () => {
    expect(canTransition("draft", "archived")).toBe(true);
    expect(canTransition("published", "archived")).toBe(true);
  });
  it("blocks merged → anything but archived", () => {
    expect(canTransition("merged", "draft")).toBe(false);
    expect(canTransition("merged", "archived")).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/lib/__tests__/notepad.test.ts`
Expected: FAIL (canTransition not exported).

- [ ] **Step 3: Implement**

Append to `src/lib/notepad.ts`:

```ts
export function canTransition(from: Status, to: Status): boolean {
  if (from === to) return true;
  if (to === "archived") return true;
  if (from === "merged") return false;
  const graph: Record<Status, Status[]> = {
    draft: ["ready", "published", "merged"],
    ready: ["draft", "published", "merged"],
    published: ["ready", "draft"],
    merged: [],
    archived: ["draft", "ready", "published"],
  };
  return graph[from]?.includes(to) ?? false;
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/lib/__tests__/notepad.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/notepad.ts src/lib/__tests__/notepad.test.ts
git commit -m "feat(notepad): canTransition with merged-is-terminal-except-archive rule"
```

---

### Task 3: Concat merge composer (pure function)

**Files:**
- Modify: `src/lib/notepad.ts`
- Modify: `src/lib/__tests__/notepad.test.ts`

- [ ] **Step 1: Add failing test**

```ts
import { concatCompose } from "@/lib/notepad";

describe("concatCompose", () => {
  it("joins bodies with h2 subheadings from source titles", () => {
    const sources = [
      { title: "First", body: "A body" },
      { title: "Second", body: "B body" },
    ];
    const out = concatCompose(sources);
    expect(out).toBe("## First\n\nA body\n\n## Second\n\nB body");
  });
  it("returns empty string for empty input", () => {
    expect(concatCompose([])).toBe("");
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/lib/__tests__/notepad.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

Append to `src/lib/notepad.ts`:

```ts
export function concatCompose(sources: Array<{ title: string; body: string }>): string {
  if (sources.length === 0) return "";
  return sources.map((s) => `## ${s.title}\n\n${s.body}`).join("\n\n");
}

export function mergeTags(sources: Array<{ tags: string[] }>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of sources) {
    for (const tag of s.tags) {
      const lower = tag.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        out.push(tag);
      }
    }
  }
  return out;
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/lib/__tests__/notepad.test.ts`
Expected: PASS.

- [ ] **Step 5: Add mergeTags test**

```ts
import { mergeTags } from "@/lib/notepad";

describe("mergeTags", () => {
  it("dedupes case-insensitively, preserves first-seen casing", () => {
    const sources = [{ tags: ["Nertia", "product"] }, { tags: ["nertia", "gtm"] }];
    expect(mergeTags(sources)).toEqual(["Nertia", "product", "gtm"]);
  });
});
```

Run: `npm test -- src/lib/__tests__/notepad.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/notepad.ts src/lib/__tests__/notepad.test.ts
git commit -m "feat(notepad): concatCompose + mergeTags pure functions"
```

---

## Phase 2 — Server-side helpers

### Task 4: Admin token verifier middleware

**Files:**
- Create: `src/lib/auth-admin.ts`
- Create: `src/lib/__tests__/auth-admin.test.ts`

Existing helpers to reuse: `isAdminEmail()` from `@/lib/admin`, `getAdminDb()` from `@/lib/firebaseAdmin`. This task adds an ID-token verifier.

- [ ] **Step 1: Failing test**

```ts
// src/lib/__tests__/auth-admin.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("firebase-admin/auth", () => ({
  getAuth: () => ({
    verifyIdToken: vi.fn(async (t: string) => {
      if (t === "valid-admin") return { email: "ps2pdx@gmail.com" };
      if (t === "valid-other") return { email: "stranger@example.com" };
      throw new Error("bad token");
    }),
  }),
}));

vi.mock("firebase-admin/app", () => ({
  getApps: () => [{}],
  initializeApp: vi.fn(),
}));

import { verifyAdminToken } from "@/lib/auth-admin";

function mockReq(auth?: string) {
  return { headers: { get: (k: string) => (k === "authorization" ? auth : null) } } as unknown as Request;
}

describe("verifyAdminToken", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns email on valid admin token", async () => {
    const r = await verifyAdminToken(mockReq("Bearer valid-admin"));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.email).toBe("ps2pdx@gmail.com");
  });

  it("returns 401 on missing header", async () => {
    const r = await verifyAdminToken(mockReq());
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(401);
  });

  it("returns 403 on non-admin email", async () => {
    const r = await verifyAdminToken(mockReq("Bearer valid-other"));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(403);
  });

  it("returns 401 on invalid token", async () => {
    const r = await verifyAdminToken(mockReq("Bearer nope"));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/lib/__tests__/auth-admin.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/auth-admin.ts
import { getAuth } from "firebase-admin/auth";
import { getApps, initializeApp } from "firebase-admin/app";
import { isAdminEmail } from "@/lib/admin";

function ensureApp() {
  if (getApps().length === 0) initializeApp();
}

export type VerifyResult =
  | { ok: true; email: string }
  | { ok: false; status: 401 | 403; message: string };

export async function verifyAdminToken(req: Request): Promise<VerifyResult> {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "missing bearer token" };
  }
  const token = header.slice("Bearer ".length);
  ensureApp();
  try {
    const decoded = await getAuth().verifyIdToken(token);
    const email = decoded.email ?? "";
    if (!isAdminEmail(email)) {
      return { ok: false, status: 403, message: "not an admin" };
    }
    return { ok: true, email };
  } catch {
    return { ok: false, status: 401, message: "invalid token" };
  }
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/lib/__tests__/auth-admin.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth-admin.ts src/lib/__tests__/auth-admin.test.ts
git commit -m "feat(auth): verifyAdminToken checks bearer ID token against admin allowlist"
```

---

### Task 5: Server-side post repository

**Files:**
- Create: `src/lib/notepad-admin.ts`
- Create: `src/lib/__tests__/notepad-admin.test.ts`

- [ ] **Step 1: Failing test**

```ts
// src/lib/__tests__/notepad-admin.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const refMock = {
  get: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
};
const dbMock = { ref: vi.fn(() => refMock) };

vi.mock("@/lib/firebaseAdmin", () => ({
  getAdminDb: () => dbMock,
}));

import { listPosts, getPost, putPost, patchPost } from "@/lib/notepad-admin";

describe("notepad-admin repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("listPosts returns sorted array by date desc", async () => {
    refMock.get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        a: { id: "a", title: "A", date: "2026-04-01", status: "draft", body: "", excerpt: "", tags: [], source: "manual", authored: false, created_at: 1, updated_at: 1 },
        b: { id: "b", title: "B", date: "2026-04-10", status: "draft", body: "", excerpt: "", tags: [], source: "manual", authored: false, created_at: 2, updated_at: 2 },
      }),
    });
    const out = await listPosts();
    expect(out.map((p) => p.id)).toEqual(["b", "a"]);
    expect(dbMock.ref).toHaveBeenCalledWith("notepad/posts");
  });

  it("getPost returns null when missing", async () => {
    refMock.get.mockResolvedValueOnce({ exists: () => false });
    expect(await getPost("nope")).toBeNull();
  });

  it("putPost writes to notepad/posts/{id}", async () => {
    const post = {
      id: "x", title: "X", body: "", excerpt: "", tags: [],
      date: "2026-04-22", status: "draft" as const,
      source: "manual" as const, authored: false,
      created_at: 1, updated_at: 1,
    };
    await putPost(post);
    expect(dbMock.ref).toHaveBeenCalledWith("notepad/posts/x");
    expect(refMock.set).toHaveBeenCalledWith(post);
  });

  it("patchPost bumps updated_at", async () => {
    const now = 123_456_789;
    vi.spyOn(Date, "now").mockReturnValue(now);
    await patchPost("x", { title: "New" });
    expect(refMock.update).toHaveBeenCalledWith({ title: "New", updated_at: now });
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/lib/__tests__/notepad-admin.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/notepad-admin.ts
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
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/lib/__tests__/notepad-admin.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/notepad-admin.ts src/lib/__tests__/notepad-admin.test.ts
git commit -m "feat(notepad): server-side repository (list/get/put/patch/delete)"
```

---

### Task 6: Document RTDB security rules

**Files:**
- Create: `docs/firebase-rtdb-rules.md`

- [ ] **Step 1: Write docs (no test — this is a reference artifact)**

```markdown
# Firebase Realtime Database rules for notepad

Apply these in the Firebase console (Realtime Database → Rules tab). The nertia repo does not currently track a `database.rules.json` file, so rules are configured via the console.

## Adds (merge into the existing rules object under the root)

\`\`\`json
{
  "rules": {
    "notepad": {
      "posts": {
        ".read": "auth != null && auth.token.email.toLowerCase() == 'ps2pdx@gmail.com'",
        ".write": "auth != null && auth.token.email.toLowerCase() == 'ps2pdx@gmail.com'",
        ".indexOn": ["status", "date"]
      }
    }
  }
}
\`\`\`

Public blog reads go through \`firebase-admin\` on the server (bypasses rules), so no anonymous-read rule is needed.

## Storage rules

For hero + inline media at \`gs://{bucket}/blog/{postId}/...\`:

\`\`\`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /blog/{postId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email.lower() == 'ps2pdx@gmail.com';
    }
  }
}
\`\`\`
```

- [ ] **Step 2: Commit**

```bash
git add docs/firebase-rtdb-rules.md
git commit -m "docs(firebase): RTDB + Storage rules for notepad/posts and blog media"
```

---

## Phase 3 — API routes

### Task 7: GET /api/admin/notepad/list

**Files:**
- Create: `src/app/api/admin/notepad/list/route.ts`
- Create: `src/app/api/admin/notepad/__tests__/list.test.ts`

- [ ] **Step 1: Failing test**

```ts
// src/app/api/admin/notepad/__tests__/list.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({
  verifyAdminToken: vi.fn(),
}));
vi.mock("@/lib/notepad-admin", () => ({
  listPosts: vi.fn(),
}));

import { GET } from "@/app/api/admin/notepad/list/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { listPosts } from "@/lib/notepad-admin";

const sampleDraft = { id: "a", title: "A", body: "", excerpt: "", tags: [], date: "2026-04-01", status: "draft", source: "manual", authored: false, created_at: 1, updated_at: 1 };
const samplePublished = { ...sampleDraft, id: "b", status: "published" };

function reqWith(auth = "Bearer tok", url = "http://x/api/admin/notepad/list") {
  return new Request(url, { headers: { authorization: auth } });
}

describe("GET /api/admin/notepad/list", () => {
  beforeEach(() => vi.clearAllMocks());

  it("401 without bearer token", async () => {
    vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: false, status: 401, message: "x" });
    const res = await GET(reqWith(""));
    expect(res.status).toBe(401);
  });

  it("returns all posts when no filter", async () => {
    vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });
    vi.mocked(listPosts).mockResolvedValueOnce([sampleDraft, samplePublished] as never);
    const res = await GET(reqWith());
    const body = await res.json();
    expect(body.posts).toHaveLength(2);
  });

  it("filters by ?status=draft", async () => {
    vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });
    vi.mocked(listPosts).mockResolvedValueOnce([sampleDraft, samplePublished] as never);
    const res = await GET(reqWith("Bearer tok", "http://x/api/admin/notepad/list?status=draft"));
    const body = await res.json();
    expect(body.posts.map((p: { id: string }) => p.id)).toEqual(["a"]);
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/app/api/admin/notepad/__tests__/list.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/app/api/admin/notepad/list/route.ts
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth-admin";
import { listPosts } from "@/lib/notepad-admin";
import { STATUSES, type Status } from "@/lib/notepad";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const all = await listPosts();

  const filtered =
    statusParam && (STATUSES as readonly string[]).includes(statusParam)
      ? all.filter((p) => p.status === (statusParam as Status))
      : all;

  return NextResponse.json({ posts: filtered });
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/app/api/admin/notepad/__tests__/list.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/notepad/list/route.ts src/app/api/admin/notepad/__tests__/list.test.ts
git commit -m "feat(api): GET /api/admin/notepad/list with optional status filter"
```

---

### Task 8: GET/PATCH/DELETE /api/admin/notepad/[id]

**Files:**
- Create: `src/app/api/admin/notepad/[id]/route.ts`
- Create: `src/app/api/admin/notepad/__tests__/item.test.ts`

- [ ] **Step 1: Failing test**

```ts
// src/app/api/admin/notepad/__tests__/item.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdminToken: vi.fn() }));
vi.mock("@/lib/notepad-admin", () => ({
  getPost: vi.fn(),
  patchPost: vi.fn(),
  deletePost: vi.fn(),
}));

import { GET, PATCH, DELETE } from "@/app/api/admin/notepad/[id]/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, patchPost, deletePost } from "@/lib/notepad-admin";

const ctx = { params: Promise.resolve({ id: "abc" }) };
const ok = () => vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });

describe("GET /api/admin/notepad/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("404 when missing", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce(null);
    const res = await GET(new Request("http://x"), ctx);
    expect(res.status).toBe(404);
  });

  it("returns post when found", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", title: "A" } as never);
    const res = await GET(new Request("http://x"), ctx);
    const body = await res.json();
    expect(body.post.id).toBe("abc");
  });
});

describe("PATCH /api/admin/notepad/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("422 when body has unknown fields", async () => {
    ok();
    const res = await PATCH(new Request("http://x", { method: "PATCH", body: JSON.stringify({ bogus: 1 }) }), ctx);
    expect(res.status).toBe(422);
  });

  it("422 when status transition is illegal (merged → draft)", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", status: "merged" } as never);
    const res = await PATCH(
      new Request("http://x", { method: "PATCH", body: JSON.stringify({ status: "draft" }) }),
      ctx,
    );
    expect(res.status).toBe(422);
  });

  it("patches allowed fields", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", status: "draft" } as never);
    const res = await PATCH(
      new Request("http://x", { method: "PATCH", body: JSON.stringify({ title: "New" }) }),
      ctx,
    );
    expect(res.status).toBe(200);
    expect(patchPost).toHaveBeenCalledWith("abc", expect.objectContaining({ title: "New" }));
  });
});

describe("DELETE /api/admin/notepad/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes", async () => {
    ok();
    const res = await DELETE(new Request("http://x"), ctx);
    expect(res.status).toBe(200);
    expect(deletePost).toHaveBeenCalledWith("abc");
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/app/api/admin/notepad/__tests__/item.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/app/api/admin/notepad/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, patchPost, deletePost } from "@/lib/notepad-admin";
import { canTransition, STATUSES } from "@/lib/notepad";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PatchSchema = z
  .object({
    title: z.string().optional(),
    body: z.string().optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    hero: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    status: z.enum(STATUSES).optional(),
    date: z.string().optional(),
  })
  .strict();

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { id } = await ctx.params;
  const raw = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", issues: parsed.error.issues }, { status: 422 });
  }
  if (parsed.data.status) {
    const current = await getPost(id);
    if (!current) return NextResponse.json({ error: "not found" }, { status: 404 });
    if (!canTransition(current.status, parsed.data.status)) {
      return NextResponse.json(
        { error: `illegal transition ${current.status} → ${parsed.data.status}` },
        { status: 422 },
      );
    }
  }
  await patchPost(id, parsed.data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { id } = await ctx.params;
  await deletePost(id);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/app/api/admin/notepad/__tests__/item.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/notepad/[id]/route.ts src/app/api/admin/notepad/__tests__/item.test.ts
git commit -m "feat(api): GET/PATCH/DELETE /api/admin/notepad/[id]"
```

---

### Task 9: POST /api/admin/notepad/[id]/publish

**Files:**
- Create: `src/app/api/admin/notepad/[id]/publish/route.ts`
- Create: `src/app/api/admin/notepad/__tests__/publish.test.ts`

- [ ] **Step 1: Failing test**

```ts
// src/app/api/admin/notepad/__tests__/publish.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdminToken: vi.fn() }));
vi.mock("@/lib/notepad-admin", () => ({
  getPost: vi.fn(),
  patchPost: vi.fn(),
  listPosts: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { POST } from "@/app/api/admin/notepad/[id]/publish/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, patchPost, listPosts } from "@/lib/notepad-admin";
import { revalidatePath } from "next/cache";

const ok = () => vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });
const ctx = { params: Promise.resolve({ id: "abc" }) };

describe("POST /api/admin/notepad/[id]/publish", () => {
  beforeEach(() => vi.clearAllMocks());

  it("422 when slug collides with another published post", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", title: "T", status: "ready" } as never);
    vi.mocked(listPosts).mockResolvedValueOnce([{ id: "other", slug: "foo", status: "published" }] as never);
    const res = await POST(
      new Request("http://x", { method: "POST", body: JSON.stringify({ slug: "foo" }) }),
      ctx,
    );
    expect(res.status).toBe(422);
  });

  it("publishes with slug + revalidates /blog", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", title: "T", status: "ready" } as never);
    vi.mocked(listPosts).mockResolvedValueOnce([]);
    const res = await POST(
      new Request("http://x", { method: "POST", body: JSON.stringify({ slug: "my-post" }) }),
      ctx,
    );
    expect(res.status).toBe(200);
    expect(patchPost).toHaveBeenCalledWith(
      "abc",
      expect.objectContaining({ status: "published", slug: "my-post" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
    expect(revalidatePath).toHaveBeenCalledWith("/blog/my-post");
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/app/api/admin/notepad/__tests__/publish.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/app/api/admin/notepad/[id]/publish/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, patchPost, listPosts } from "@/lib/notepad-admin";
import { canTransition } from "@/lib/notepad";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({ slug: z.string().min(1).max(60) }).strict();
type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await ctx.params;
  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 422 });

  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canTransition(post.status, "published")) {
    return NextResponse.json({ error: `cannot publish from ${post.status}` }, { status: 422 });
  }

  const all = await listPosts();
  if (all.some((p) => p.id !== id && p.status === "published" && p.slug === parsed.data.slug)) {
    return NextResponse.json({ error: "slug already in use" }, { status: 422 });
  }

  const now = Date.now();
  await patchPost(id, { status: "published", slug: parsed.data.slug, published_at: now });

  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/app/api/admin/notepad/__tests__/publish.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/notepad/[id]/publish/route.ts src/app/api/admin/notepad/__tests__/publish.test.ts
git commit -m "feat(api): POST /api/admin/notepad/[id]/publish with slug uniqueness + ISR revalidate"
```

---

### Task 10: POST /api/admin/notepad/[id]/polish

**Files:**
- Create: `src/app/api/admin/notepad/[id]/polish/route.ts`
- Create: `src/app/api/admin/notepad/__tests__/polish.test.ts`

- [ ] **Step 1: Failing test**

```ts
// src/app/api/admin/notepad/__tests__/polish.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdminToken: vi.fn() }));
vi.mock("@/lib/notepad-admin", () => ({ getPost: vi.fn() }));

const createMock = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = { create: createMock };
  },
}));

import { POST } from "@/app/api/admin/notepad/[id]/polish/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost } from "@/lib/notepad-admin";

const ok = () => vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });
const ctx = { params: Promise.resolve({ id: "abc" }) };

describe("POST /api/admin/notepad/[id]/polish", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns polished body from Anthropic response", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce({ id: "abc", body: "raw", title: "T" } as never);
    createMock.mockResolvedValueOnce({
      content: [{ type: "text", text: "polished body" }],
    });
    const res = await POST(new Request("http://x", { method: "POST", body: "{}" }), ctx);
    const body = await res.json();
    expect(body.polished).toBe("polished body");
  });

  it("404 when post missing", async () => {
    ok();
    vi.mocked(getPost).mockResolvedValueOnce(null);
    const res = await POST(new Request("http://x", { method: "POST", body: "{}" }), ctx);
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/app/api/admin/notepad/__tests__/polish.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/app/api/admin/notepad/[id]/polish/route.ts
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost } from "@/lib/notepad-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POLISH_SYSTEM = `You are polishing a session-captured draft into a blog post.
Rules:
- Preserve every concrete fact, specific name, and decision in the source.
- Tighten prose; remove filler.
- Keep the author's voice — first-person, direct, no corporate tone.
- Return only the polished markdown body. No preamble, no explanation.`;

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const result = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: POLISH_SYSTEM,
    messages: [{ role: "user", content: `Title: ${post.title}\n\nBody:\n${post.body}` }],
  });
  const block = result.content[0];
  const polished = block && block.type === "text" ? block.text : "";
  return NextResponse.json({ polished });
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/app/api/admin/notepad/__tests__/polish.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/notepad/[id]/polish/route.ts src/app/api/admin/notepad/__tests__/polish.test.ts
git commit -m "feat(api): POST /api/admin/notepad/[id]/polish returns Claude-rewritten body"
```

---

### Task 11: POST /api/admin/notepad/merge

**Files:**
- Create: `src/app/api/admin/notepad/merge/route.ts`
- Create: `src/app/api/admin/notepad/__tests__/merge.test.ts`

- [ ] **Step 1: Failing test**

```ts
// src/app/api/admin/notepad/__tests__/merge.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth-admin", () => ({ verifyAdminToken: vi.fn() }));
vi.mock("@/lib/notepad-admin", () => ({
  getPost: vi.fn(),
  putPost: vi.fn(),
  patchPost: vi.fn(),
}));
const createMock = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: class { messages = { create: createMock }; },
}));

import { POST } from "@/app/api/admin/notepad/merge/route";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, putPost, patchPost } from "@/lib/notepad-admin";

const ok = () => vi.mocked(verifyAdminToken).mockResolvedValueOnce({ ok: true, email: "ps2pdx@gmail.com" });

describe("POST /api/admin/notepad/merge", () => {
  beforeEach(() => vi.clearAllMocks());

  it("422 when fewer than 2 sources", async () => {
    ok();
    const res = await POST(
      new Request("http://x", { method: "POST", body: JSON.stringify({ sourceIds: ["a"], composeMethod: "concat" }) }),
    );
    expect(res.status).toBe(422);
  });

  it("concat path: creates new post + flips sources to merged", async () => {
    ok();
    const s1 = { id: "a", title: "A", body: "body a", tags: ["x"], status: "draft" };
    const s2 = { id: "b", title: "B", body: "body b", tags: ["y"], status: "draft" };
    vi.mocked(getPost).mockImplementation(async (id) => (id === "a" ? (s1 as never) : (s2 as never)));

    const res = await POST(
      new Request("http://x", {
        method: "POST",
        body: JSON.stringify({ sourceIds: ["a", "b"], composeMethod: "concat" }),
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.post.body).toContain("## A");
    expect(body.post.body).toContain("## B");
    expect(body.post.merged_from).toEqual(["a", "b"]);
    expect(patchPost).toHaveBeenCalledWith("a", expect.objectContaining({ status: "merged", merged_into: body.post.id }));
    expect(patchPost).toHaveBeenCalledWith("b", expect.objectContaining({ status: "merged", merged_into: body.post.id }));
    expect(putPost).toHaveBeenCalled();
  });

  it("ai path: uses Anthropic output for body", async () => {
    ok();
    vi.mocked(getPost).mockImplementation(async (id) => ({ id, title: id.toUpperCase(), body: `b${id}`, tags: [], status: "draft" } as never));
    createMock.mockResolvedValueOnce({ content: [{ type: "text", text: "woven body" }] });
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        body: JSON.stringify({ sourceIds: ["a", "b"], composeMethod: "ai" }),
      }),
    );
    const body = await res.json();
    expect(body.post.body).toBe("woven body");
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/app/api/admin/notepad/__tests__/merge.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/app/api/admin/notepad/merge/route.ts
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, putPost, patchPost } from "@/lib/notepad-admin";
import { concatCompose, mergeTags, type Post } from "@/lib/notepad";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z
  .object({
    sourceIds: z.array(z.string().min(1)).min(2),
    composeMethod: z.enum(["ai", "concat"]),
  })
  .strict();

const COMPOSE_SYSTEM = `You are weaving multiple session-captured drafts into a single cohesive blog post.
Rules:
- Preserve every concrete fact, name, and decision from each source.
- Organize into a natural narrative — use h2 subheadings where the sources shift topic.
- Keep the author's first-person voice, direct and unembellished.
- Return only the final markdown body. No preamble.`;

export async function POST(req: Request): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 422 });

  const sources = [] as Post[];
  for (const id of parsed.data.sourceIds) {
    const p = await getPost(id);
    if (!p) return NextResponse.json({ error: `source not found: ${id}` }, { status: 404 });
    sources.push(p);
  }

  let body: string;
  let title: string;
  if (parsed.data.composeMethod === "ai") {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const prompt = sources.map((s) => `# ${s.title}\n\n${s.body}`).join("\n\n---\n\n");
    const result = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      system: COMPOSE_SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });
    const block = result.content[0];
    body = block && block.type === "text" ? block.text : "";
    title = sources[0].title;
  } else {
    body = concatCompose(sources);
    title = sources[0].title;
  }

  const now = Date.now();
  const newId = randomUUID();
  const newPost: Post = {
    id: newId,
    title,
    slug: null,
    body,
    excerpt: sources[0].excerpt,
    tags: mergeTags(sources),
    hero: null,
    date: new Date().toISOString().slice(0, 10),
    status: "draft",
    source: "merge",
    source_session_id: null,
    authored: false,
    merged_from: parsed.data.sourceIds,
    merged_into: null,
    cwd: null,
    created_at: now,
    updated_at: now,
    published_at: null,
  };

  await putPost(newPost);
  for (const id of parsed.data.sourceIds) {
    await patchPost(id, { status: "merged", merged_into: newId });
  }

  return NextResponse.json({ post: newPost });
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/app/api/admin/notepad/__tests__/merge.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/notepad/merge/route.ts src/app/api/admin/notepad/__tests__/merge.test.ts
git commit -m "feat(api): POST /api/admin/notepad/merge (concat + ai compose paths)"
```

---

### Task 12: POST /api/admin/notepad/media/upload

**Files:**
- Create: `src/app/api/admin/notepad/media/upload/route.ts`

No unit test — multipart handling is integration-heavy; manual verification checklist covers it.

- [ ] **Step 1: Implement**

```ts
// src/app/api/admin/notepad/media/upload/route.ts
import { NextResponse } from "next/server";
import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { verifyAdminToken } from "@/lib/auth-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ensureApp() {
  if (getApps().length > 0) return;
  const credB64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  let creds;
  if (credB64) creds = cert(JSON.parse(Buffer.from(credB64, "base64").toString("utf-8")));
  else if (credJson) creds = cert(JSON.parse(credJson));
  else creds = applicationDefault();
  initializeApp({ credential: creds, storageBucket: bucket });
}

export async function POST(req: Request): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const form = await req.formData();
  const file = form.get("file");
  const postId = String(form.get("postId") ?? "");
  const kind = String(form.get("kind") ?? "media");
  if (!(file instanceof File) || !postId) {
    return NextResponse.json({ error: "missing file or postId" }, { status: 422 });
  }

  ensureApp();
  const bucket = getStorage().bucket();
  const ext = file.name.split(".").pop() ?? "bin";
  const objectPath = kind === "hero" ? `blog/${postId}/hero.${ext}` : `blog/${postId}/media/${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const obj = bucket.file(objectPath);
  await obj.save(buffer, { contentType: file.type, public: true });
  const url = `https://storage.googleapis.com/${bucket.name}/${objectPath}`;

  return NextResponse.json({ url });
}
```

- [ ] **Step 2: Build check (no unit test)**

Run: `npm run build`
Expected: PASS (TypeScript + Next compile clean).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/notepad/media/upload/route.ts
git commit -m "feat(api): POST /api/admin/notepad/media/upload to Firebase Storage"
```

---

## Phase 4 — Admin UI

### Task 13: Client-side admin hook (useAdminToken)

**Files:**
- Create: `src/hooks/useAdminToken.ts`

- [ ] **Step 1: Implement**

```ts
// src/hooks/useAdminToken.ts
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export function useAdminToken(): string | null {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    if (!user) {
      setToken(null);
      return;
    }
    user.getIdToken().then((t) => {
      if (live) setToken(t);
    });
    return () => {
      live = false;
    };
  }, [user]);

  return token;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useAdminToken.ts
git commit -m "feat(hook): useAdminToken fetches Firebase ID token for admin API calls"
```

---

### Task 14: /admin/notepad page shell

**Files:**
- Create: `src/app/admin/notepad/page.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/admin/notepad/page.tsx
"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { isAdminEmail } from "@/lib/admin";
import { useAdminToken } from "@/hooks/useAdminToken";
import type { Post } from "@/lib/notepad";
import { ChipFilter, type FilterState } from "./components/ChipFilter";
import { DraftRow } from "./components/DraftRow";
import { MergeBar } from "./components/MergeBar";

export default function AdminNotepadPage() {
  return (
    <AuthGuard>
      <Inner />
    </AuthGuard>
  );
}

function Inner() {
  const { user } = useAuth();
  const token = useAdminToken();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({ statuses: ["ready"], projects: [], search: "" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/notepad/list", { headers: { authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => setPosts(data.posts))
      .catch((e) => setError(String(e)));
  }, [token]);

  if (!isAdminEmail(user?.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-muted">
          Signed in as <code>{user?.email}</code>. Not authorized.
        </p>
      </div>
    );
  }

  const visible = (posts ?? []).filter((p) => {
    if (filter.statuses.length && !filter.statuses.includes(p.status)) return false;
    if (filter.search && !p.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto">
      <header className="px-4 py-3 border-b border-[var(--card-border)] flex items-center gap-3 sticky top-0 bg-[var(--background)] z-10">
        <h1 className="text-base font-semibold">Notepad</h1>
        <span className="text-xs text-muted">{visible.length} / {posts?.length ?? 0}</span>
      </header>

      <ChipFilter filter={filter} onChange={setFilter} allPosts={posts ?? []} />

      {error && <div className="mx-4 my-3 text-sm text-red-500">{error}</div>}

      {posts === null ? (
        <p className="p-4 text-sm text-muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="p-4 text-sm text-muted">No drafts match this filter.</p>
      ) : (
        <ul>
          {visible.map((p) => (
            <DraftRow
              key={p.id}
              post={p}
              selected={selected.has(p.id)}
              expanded={expanded === p.id}
              onToggleSelect={() => toggleSelect(p.id)}
              onToggleExpand={() => toggleExpand(p.id)}
              onUpdate={(updated) =>
                setPosts((prev) => prev?.map((x) => (x.id === updated.id ? updated : x)) ?? null)
              }
            />
          ))}
        </ul>
      )}

      {selected.size >= 2 && (
        <MergeBar
          count={selected.size}
          sourceIds={Array.from(selected)}
          onCancel={() => setSelected(new Set())}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/notepad/page.tsx
git commit -m "feat(admin): /admin/notepad page shell with auth + data load"
```

---

### Task 15: ChipFilter component

**Files:**
- Create: `src/app/admin/notepad/components/ChipFilter.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/admin/notepad/components/ChipFilter.tsx
"use client";
import type { Post, Status } from "@/lib/notepad";

export type FilterState = {
  statuses: Status[];
  projects: string[];
  search: string;
};

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  allPosts: Post[];
}

const STATUSES_VISIBLE: Status[] = ["ready", "draft", "published"];

export function ChipFilter({ filter, onChange, allPosts }: Props) {
  const counts: Record<Status, number> = {
    draft: 0, ready: 0, published: 0, merged: 0, archived: 0,
  };
  for (const p of allPosts) counts[p.status]++;

  const projectCounts = new Map<string, number>();
  for (const p of allPosts) {
    const proj = p.cwd?.split("/").pop() ?? "unknown";
    projectCounts.set(proj, (projectCounts.get(proj) ?? 0) + 1);
  }

  function toggleStatus(s: Status) {
    const next = filter.statuses.includes(s)
      ? filter.statuses.filter((x) => x !== s)
      : [...filter.statuses, s];
    onChange({ ...filter, statuses: next });
  }

  return (
    <div className="sticky top-[49px] bg-[var(--background)] z-10 border-b border-[var(--card-border)]">
      <div className="px-4 py-2">
        <input
          type="search"
          value={filter.search}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
          placeholder="Search drafts..."
          className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md px-3 py-1.5 text-sm"
        />
      </div>
      <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
        {STATUSES_VISIBLE.map((s) => (
          <button
            key={s}
            onClick={() => toggleStatus(s)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border ${
              filter.statuses.includes(s)
                ? "bg-[var(--accent)] text-black border-[var(--accent)] font-semibold"
                : "border-[var(--card-border)] text-muted"
            }`}
          >
            {s} {counts[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/notepad/components/ChipFilter.tsx
git commit -m "feat(admin): ChipFilter with status chips + search"
```

---

### Task 16: DraftRow component (collapsed + checkbox + expansion mount)

**Files:**
- Create: `src/app/admin/notepad/components/DraftRow.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/admin/notepad/components/DraftRow.tsx
"use client";
import type { Post } from "@/lib/notepad";
import { ExpandedRow } from "./ExpandedRow";

interface Props {
  post: Post;
  selected: boolean;
  expanded: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onUpdate: (post: Post) => void;
}

const DOT: Record<string, string> = {
  draft: "#6b7280",
  ready: "#f59e0b",
  published: "#22c55e",
  merged: "#a78bfa",
  archived: "#444",
};

export function DraftRow({ post, selected, expanded, onToggleSelect, onToggleExpand, onUpdate }: Props) {
  return (
    <li className={`border-b border-[var(--card-border)] ${expanded ? "bg-[var(--card-bg)]" : ""}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4"
        />
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: DOT[post.status] }}
          aria-label={post.status}
        />
        <button
          onClick={onToggleExpand}
          className="flex-1 text-left text-sm truncate"
        >
          {post.title || "(untitled)"}
        </button>
        <span className="text-xs text-muted">{post.date}</span>
      </div>
      {expanded && <ExpandedRow post={post} onUpdate={onUpdate} />}
    </li>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/notepad/components/DraftRow.tsx
git commit -m "feat(admin): DraftRow with checkbox, status dot, and expansion slot"
```

---

### Task 17: ExpandedRow component (linear fields)

**Files:**
- Create: `src/app/admin/notepad/components/ExpandedRow.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/admin/notepad/components/ExpandedRow.tsx
"use client";
import { useState } from "react";
import type { Post } from "@/lib/notepad";
import { useAdminToken } from "@/hooks/useAdminToken";
import { PolishDiff } from "./PolishDiff";
import { HeroUpload } from "./HeroUpload";

interface Props {
  post: Post;
  onUpdate: (post: Post) => void;
}

export function ExpandedRow({ post, onUpdate }: Props) {
  const token = useAdminToken();
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [tags, setTags] = useState(post.tags.join(", "));
  const [polishSuggestion, setPolishSuggestion] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function savePatch(patch: Partial<Post>) {
    if (!token) return;
    const res = await fetch(`/api/admin/notepad/${post.id}`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) onUpdate({ ...post, ...patch } as Post);
  }

  async function publish() {
    const slug = window.prompt("Slug:", post.slug ?? slugify(post.title));
    if (!slug || !token) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/notepad/${post.id}/publish`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) onUpdate({ ...post, status: "published", slug, published_at: Date.now() });
      else alert(`Publish failed: ${(await res.json()).error}`);
    } finally {
      setBusy(false);
    }
  }

  async function requestPolish() {
    if (!token) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/notepad/${post.id}/polish`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: "{}",
      });
      if (res.ok) {
        const data = await res.json();
        setPolishSuggestion(data.polished);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-4 pb-4 space-y-3">
      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title !== post.title && savePatch({ title })}
          className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded px-2 py-1.5 text-sm"
        />
      </Field>

      <Field label="Tags">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          onBlur={() => {
            const arr = tags.split(",").map((t) => t.trim()).filter(Boolean);
            savePatch({ tags: arr });
          }}
          className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded px-2 py-1.5 text-sm"
          placeholder="comma, separated"
        />
      </Field>

      <Field label="Hero">
        <HeroUpload post={post} onUpdate={(url) => { savePatch({ hero: url }); onUpdate({ ...post, hero: url }); }} />
      </Field>

      <Field label="Body">
        {polishSuggestion ? (
          <PolishDiff
            original={body}
            suggestion={polishSuggestion}
            onAccept={() => {
              setBody(polishSuggestion);
              savePatch({ body: polishSuggestion });
              setPolishSuggestion(null);
            }}
            onReject={() => setPolishSuggestion(null)}
            onRegenerate={requestPolish}
          />
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onBlur={() => body !== post.body && savePatch({ body })}
            rows={12}
            className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded px-2 py-1.5 text-sm font-mono"
          />
        )}
      </Field>

      <div className="flex gap-2 flex-wrap pt-1">
        <button
          onClick={publish}
          disabled={busy}
          className="px-3 py-1.5 bg-[var(--accent)] text-black rounded text-sm font-semibold disabled:opacity-50"
        >
          Publish
        </button>
        <button
          onClick={requestPolish}
          disabled={busy}
          className="px-3 py-1.5 border border-[var(--card-border)] rounded text-sm disabled:opacity-50"
        >
          ✨ Polish
        </button>
        <button
          onClick={async () => {
            if (!confirm("Delete this draft?") || !token) return;
            const res = await fetch(`/api/admin/notepad/${post.id}`, {
              method: "DELETE",
              headers: { authorization: `Bearer ${token}` },
            });
            if (res.ok) onUpdate({ ...post, status: "archived" });
          }}
          className="px-3 py-1.5 border border-[var(--card-border)] rounded text-sm text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted mb-1">{label}</div>
      {children}
    </div>
  );
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/notepad/components/ExpandedRow.tsx
git commit -m "feat(admin): ExpandedRow with linear fields + inline save + polish + publish"
```

---

### Task 18: PolishDiff component

**Files:**
- Create: `src/app/admin/notepad/components/PolishDiff.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/admin/notepad/components/PolishDiff.tsx
"use client";

interface Props {
  original: string;
  suggestion: string;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate: () => void;
}

export function PolishDiff({ original, suggestion, onAccept, onReject, onRegenerate }: Props) {
  const originalLines = original.split(/\r?\n/);
  const suggestionLines = suggestion.split(/\r?\n/);
  const originalSet = new Set(originalLines);
  const suggestionSet = new Set(suggestionLines);

  return (
    <div className="border border-purple-500 bg-purple-950/10 rounded p-2 space-y-0.5 font-mono text-xs">
      {originalLines
        .filter((l) => !suggestionSet.has(l))
        .map((l, i) => (
          <div key={`o${i}`} className="line-through text-red-400/70">
            − {l}
          </div>
        ))}
      {suggestionLines
        .filter((l) => !originalSet.has(l))
        .map((l, i) => (
          <div key={`n${i}`} className="text-purple-300">
            + {l}
          </div>
        ))}
      <div className="flex gap-2 pt-3 border-t border-[var(--card-border)] mt-3">
        <button onClick={onReject} className="px-3 py-1 border border-[var(--card-border)] rounded text-[11px]">
          Revert
        </button>
        <button onClick={onRegenerate} className="px-3 py-1 border border-[var(--card-border)] rounded text-[11px]">
          Regenerate
        </button>
        <button onClick={onAccept} className="px-3 py-1 bg-purple-500 text-black rounded text-[11px] font-semibold">
          Keep changes
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/notepad/components/PolishDiff.tsx
git commit -m "feat(admin): PolishDiff shows line-level before/after with accept/reject/regenerate"
```

---

### Task 19: MergeBar component

**Files:**
- Create: `src/app/admin/notepad/components/MergeBar.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/admin/notepad/components/MergeBar.tsx
"use client";
import { useRouter } from "next/navigation";

interface Props {
  count: number;
  sourceIds: string[];
  onCancel: () => void;
}

export function MergeBar({ count, sourceIds, onCancel }: Props) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white px-4 py-3 flex items-center gap-3 z-20">
      <button onClick={onCancel} className="text-xl leading-none">✕</button>
      <span className="font-semibold">{count} selected</span>
      <button
        onClick={() => {
          const params = new URLSearchParams({ ids: sourceIds.join(",") });
          router.push(`/admin/notepad/merge?${params}`);
        }}
        className="ml-auto bg-white text-blue-500 px-4 py-1.5 rounded font-semibold text-sm"
      >
        Merge →
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/notepad/components/MergeBar.tsx
git commit -m "feat(admin): MergeBar fixed footer with selection count and navigate-to-merge"
```

---

### Task 20: /admin/notepad/merge preview page

**Files:**
- Create: `src/app/admin/notepad/merge/page.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/admin/notepad/merge/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAdminToken } from "@/hooks/useAdminToken";
import type { Post } from "@/lib/notepad";

export default function MergePage() {
  return (
    <AuthGuard>
      <Inner />
    </AuthGuard>
  );
}

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = useAdminToken();
  const ids = (params.get("ids") ?? "").split(",").filter(Boolean);
  const [sources, setSources] = useState<Post[]>([]);
  const [method, setMethod] = useState<"ai" | "concat">("ai");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || ids.length < 2) return;
    Promise.all(
      ids.map((id) =>
        fetch(`/api/admin/notepad/${id}`, { headers: { authorization: `Bearer ${token}` } })
          .then((r) => r.json())
          .then((d) => d.post as Post),
      ),
    ).then(setSources);
  }, [token, ids.join(",")]);

  async function createMerged() {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notepad/merge", {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ sourceIds: ids, composeMethod: method }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      router.push("/admin/notepad");
    } catch (e) {
      setError(String(e));
      setBusy(false);
    }
  }

  if (ids.length < 2) {
    return <div className="p-6 text-sm">Need 2+ source IDs.</div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <header className="flex items-center gap-3 pb-3 border-b border-[var(--card-border)]">
        <button onClick={() => router.back()} className="text-xl">✕</button>
        <h1 className="text-base font-semibold">Merge {ids.length} drafts</h1>
      </header>

      <section>
        <div className="text-[10px] uppercase tracking-wide text-muted mb-2">Sources</div>
        <ul className="space-y-1 text-sm">
          {sources.map((s) => (
            <li key={s.id} className="flex gap-2">
              <span className="text-muted">·</span>
              <span>{s.title}</span>
              <span className="ml-auto text-xs text-muted">{s.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex gap-2">
        <button
          onClick={() => setMethod("ai")}
          className={`flex-1 px-3 py-2 rounded border text-sm ${
            method === "ai" ? "bg-purple-500/10 border-purple-500 text-purple-300" : "border-[var(--card-border)] text-muted"
          }`}
        >
          ✨ Claude-compose
        </button>
        <button
          onClick={() => setMethod("concat")}
          className={`flex-1 px-3 py-2 rounded border text-sm ${
            method === "concat" ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]" : "border-[var(--card-border)] text-muted"
          }`}
        >
          Concatenate
        </button>
      </section>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="pt-3 flex gap-2">
        <button onClick={() => router.back()} className="flex-1 border border-[var(--card-border)] rounded py-2 text-sm">
          Cancel
        </button>
        <button
          onClick={createMerged}
          disabled={busy || sources.length < 2}
          className="flex-1 bg-[var(--accent)] text-black rounded py-2 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create draft"}
        </button>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/notepad/merge/page.tsx
git commit -m "feat(admin): /admin/notepad/merge preview screen with compose-method toggle"
```

---

### Task 21: HeroUpload component

**Files:**
- Create: `src/app/admin/notepad/components/HeroUpload.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/admin/notepad/components/HeroUpload.tsx
"use client";
import { useRef, useState } from "react";
import type { Post } from "@/lib/notepad";
import { useAdminToken } from "@/hooks/useAdminToken";

interface Props {
  post: Post;
  onUpdate: (url: string) => void;
}

export function HeroUpload({ post, onUpdate }: Props) {
  const token = useAdminToken();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    if (!token) return;
    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    form.append("postId", post.id);
    form.append("kind", "hero");
    try {
      const res = await fetch("/api/admin/notepad/media/upload", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        onUpdate(data.url);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {post.hero ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.hero} alt="hero" className="w-full max-h-40 object-cover rounded border border-[var(--card-border)]" />
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="w-full h-20 border border-dashed border-[var(--card-border)] rounded flex items-center justify-center text-xs text-muted disabled:opacity-50"
        >
          {busy ? "Uploading…" : "📷 Upload hero"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/notepad/components/HeroUpload.tsx
git commit -m "feat(admin): HeroUpload component posts multipart to media/upload"
```

---

## Phase 5 — Public blog migration

### Task 22: Rewrite src/lib/blog.ts to read from RTDB

**Files:**
- Modify: `src/lib/blog.ts`
- Create: `src/lib/__tests__/blog.test.ts`

- [ ] **Step 1: Failing test**

```ts
// src/lib/__tests__/blog.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const getMock = vi.fn();
vi.mock("@/lib/firebaseAdmin", () => ({
  getAdminDb: () => ({ ref: () => ({ get: getMock }) }),
}));

import { getAllPosts, getPostBySlug } from "@/lib/blog";

describe("getAllPosts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns only published posts, newest first", async () => {
    getMock.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        a: { id: "a", slug: "old", title: "Old", body: "", excerpt: "", tags: [], date: "2026-01-01", status: "published", source: "manual", authored: true, created_at: 1, updated_at: 1 },
        b: { id: "b", slug: "new", title: "New", body: "", excerpt: "", tags: [], date: "2026-03-01", status: "published", source: "manual", authored: true, created_at: 2, updated_at: 2 },
        c: { id: "c", slug: null, title: "Draft", body: "", excerpt: "", tags: [], date: "2026-02-01", status: "draft", source: "manual", authored: true, created_at: 3, updated_at: 3 },
      }),
    });
    const posts = await getAllPosts();
    expect(posts.map((p) => p.slug)).toEqual(["new", "old"]);
  });
});

describe("getPostBySlug", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when not found", async () => {
    getMock.mockResolvedValueOnce({ exists: () => false });
    expect(await getPostBySlug("nope")).toBeNull();
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npm test -- src/lib/__tests__/blog.test.ts`
Expected: FAIL (import errors because old blog.ts is sync and filesystem-backed).

- [ ] **Step 3: Replace `src/lib/blog.ts`**

```ts
// src/lib/blog.ts
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
```

- [ ] **Step 4: Run, expect pass**

Run: `npm test -- src/lib/__tests__/blog.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/blog.ts src/lib/__tests__/blog.test.ts
git commit -m "refactor(blog): getAllPosts/getPostBySlug read from RTDB notepad/posts"
```

---

### Task 23: Update blog pages for async + ISR

**Files:**
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Read existing shape**

Run: `cat src/app/blog/page.tsx src/app/blog/[slug]/page.tsx`

Expected output gives current structure to update.

- [ ] **Step 2: Update blog list page**

Replace `src/app/blog/page.tsx` (keep existing markup, just change the data fetch to async and add revalidate):

```tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-muted">No posts yet.</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <li key={p.slug} className="border border-[var(--card-border)] rounded-lg overflow-hidden">
              {p.hero && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.hero} alt={p.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <div className="text-xs text-muted">{p.date}</div>
                <Link href={`/blog/${p.slug}`} className="text-lg font-semibold hover:text-[var(--accent)]">
                  {p.title}
                </Link>
                {p.excerpt && <p className="text-sm text-muted mt-2 line-clamp-3">{p.excerpt}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Update blog detail page**

Replace `src/app/blog/[slug]/page.tsx` (drop `generateStaticParams`, keep markdown rendering):

```tsx
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug } from "@/lib/blog";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {post.hero && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.hero} alt={post.title} className="w-full rounded-lg mb-8" />
      )}
      <div className="text-xs text-muted mb-2">{post.date}</div>
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </main>
  );
}
```

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/blog/page.tsx src/app/blog/[slug]/page.tsx
git commit -m "refactor(blog): pages fetch from RTDB with 60s ISR revalidate"
```

---

### Task 24: One-time migration script

**Files:**
- Create: `scripts/migrate-blog-to-rtdb.ts`

- [ ] **Step 1: Implement**

```ts
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
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
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
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
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
```

- [ ] **Step 2: Dry-run to verify**

Run: `npx tsx scripts/migrate-blog-to-rtdb.ts --dry-run`
Expected: prints list of 4 blog posts + 41 drafts, no writes.

- [ ] **Step 3: Actual run**

Run: `npx tsx scripts/migrate-blog-to-rtdb.ts`
Expected: writes to RTDB. Idempotent — rerun should skip all.

- [ ] **Step 4: Commit the script**

```bash
git add scripts/migrate-blog-to-rtdb.ts
git commit -m "chore(migrate): one-time import of filesystem blog + drafts into RTDB"
```

---

## Phase 6 — Retirement

### Task 25: Delete file-based blog admin + content

**Files:**
- Delete: `src/lib/blog-candidates.ts`
- Delete: `src/app/admin/blog/page.tsx`
- Delete: `src/app/admin/blog/[slug]/page.tsx`
- Delete: `src/app/api/admin/blog/route.ts`
- Delete: `src/app/api/admin/blog/[slug]/route.ts`
- Delete: `src/content/blog/*.md`
- Delete: `src/content/blog-candidates/*.md`

**Prerequisite:** Task 24 migration has successfully run and published posts are reachable at `/blog/{slug}` (verify manually before deleting source of truth).

- [ ] **Step 1: Verify blog renders from RTDB**

Run: `npm run dev` then visit `http://localhost:3000/blog` and one `/blog/{slug}` page.
Expected: Posts render; hero images still load (via `public/blog/` paths).

- [ ] **Step 2: Delete files**

```bash
rm src/lib/blog-candidates.ts
rm src/app/admin/blog/page.tsx
rm src/app/admin/blog/[slug]/page.tsx
rm src/app/api/admin/blog/route.ts
rm src/app/api/admin/blog/[slug]/route.ts
rm -rf src/app/admin/blog
rm -rf src/app/api/admin/blog
rm src/content/blog/*.md
rm src/content/blog-candidates/*.md
rmdir src/content/blog-candidates
```

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: PASS (no orphaned imports).

- [ ] **Step 4: Commit**

```bash
git add -A src/lib/blog-candidates.ts src/app/admin/blog src/app/api/admin/blog src/content/blog src/content/blog-candidates
git commit -m "chore(blog): retire file-based blog admin and content (migrated to RTDB)"
```

---

### Task 26: notepad-sync rewrite (CLI tool in ~/.claude)

**Files:**
- Modify: `~/.claude/skills/notepad/bin/notepad-sync`

This lives OUTSIDE the nertia repo. The change is Python (existing language).

- [ ] **Step 1: Replace the script**

Back up first:

```bash
cp ~/.claude/skills/notepad/bin/notepad-sync ~/.claude/skills/notepad/bin/notepad-sync.bak
```

Replace contents with:

```python
#!/usr/bin/env python3
"""Push ~/notepad/drafts/*.md into Firebase RTDB under notepad/posts/{id}.

Reads firebase admin credentials the same way the nertia app does:
- FIREBASE_SERVICE_ACCOUNT_JSON_B64 (preferred on shared env)
- FIREBASE_SERVICE_ACCOUNT_JSON (raw JSON)
- Falls back to GOOGLE_APPLICATION_CREDENTIALS default

Idempotent: keyed by source_session_id (from draft frontmatter or filename).
"""
import argparse
import base64
import json
import os
import re
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

try:
    import firebase_admin
    from firebase_admin import credentials, db
except ImportError:
    print("firebase-admin is required: pip install firebase-admin", file=sys.stderr)
    sys.exit(1)

NOTEPAD = Path.home() / "notepad"


def parse_frontmatter(text: str):
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.DOTALL)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        v = v.strip()
        if v.startswith("[") and v.endswith("]"):
            v = [t.strip() for t in v[1:-1].split(",") if t.strip()]
        meta[k.strip()] = v
    return meta, m.group(2)


def init_admin():
    if firebase_admin._apps:
        return
    db_url = os.environ.get("NEXT_PUBLIC_FIREBASE_DATABASE_URL")
    if not db_url:
        raise SystemExit("NEXT_PUBLIC_FIREBASE_DATABASE_URL env required")
    b64 = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON_B64")
    raw = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
    cred_obj = None
    if b64:
        cred_obj = json.loads(base64.b64decode(b64).decode("utf-8"))
    elif raw:
        cred_obj = json.loads(raw)
    if cred_obj:
        cred = credentials.Certificate(cred_obj)
    else:
        cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred, {"databaseURL": db_url})


def sync_drafts(dry_run: bool = False) -> None:
    init_admin()
    existing_sessions = set()
    snap = db.reference("notepad/posts").get() or {}
    for p in snap.values():
        sid = p.get("source_session_id")
        if sid:
            existing_sessions.add(sid)

    drafts_dir = NOTEPAD / "drafts"
    if not drafts_dir.exists():
        print("no drafts dir")
        return
    for f in sorted(drafts_dir.glob("*.md")):
        text = f.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        session_id = meta.get("session_id") or f.stem
        if session_id in existing_sessions:
            continue
        blog_worthy = str(meta.get("blog_worthy", "false")).lower() == "true"
        authored = str(meta.get("authored", "false")).lower() == "true"
        post_id = str(uuid.uuid4())
        now = int(datetime.now(tz=timezone.utc).timestamp() * 1000)
        tags = meta.get("tags") or []
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.strip("[]").split(",") if t.strip()]
        post = {
            "id": post_id,
            "title": meta.get("title", "(untitled)"),
            "slug": None,
            "body": body.strip(),
            "excerpt": "",
            "tags": tags,
            "hero": None,
            "date": meta.get("date") or datetime.now().strftime("%Y-%m-%d"),
            "status": "ready" if blog_worthy else "draft",
            "source": "notepad-session",
            "source_session_id": session_id,
            "authored": authored,
            "merged_from": None,
            "merged_into": None,
            "cwd": meta.get("cwd"),
            "created_at": now,
            "updated_at": now,
            "published_at": None,
        }
        print(f"{'[dry] ' if dry_run else ''}{session_id} → {post_id} ({post['status']})")
        if not dry_run:
            db.reference(f"notepad/posts/{post_id}").set(post)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    sync_drafts(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Dry-run**

Run: `~/.claude/skills/notepad/bin/notepad-sync --dry-run`
Expected: prints only sessions not already in RTDB (empty after Task 24 migration).

- [ ] **Step 3: Note — no commit in nertia repo**

This file lives outside `~/code/nertia`. Not part of the PR. Back up remains at `notepad-sync.bak`. Note in PR description that this companion change ships alongside.

---

## Self-review

**Spec coverage:** Every spec section maps to tasks —
- Data model + RTDB schema → Tasks 1–5
- Security rules → Task 6
- API surface → Tasks 7–12
- Mobile list, chip filter, accordion → Tasks 14–17
- AI Polish UX → Task 18 (+ Task 17 integration)
- Merge flow + preview → Tasks 19, 20
- Media upload → Tasks 12, 21
- Public blog migration → Tasks 22–23
- One-time migration → Task 24
- Retirement → Task 25
- notepad-sync rewrite → Task 26

**Type consistency:** `Post`, `Status`, `Source` types consistent across tasks. API routes reuse `PostSchema.safeParse`. Component props type-aligned with repository return types.

**No placeholders:** All steps show exact code, paths, commands. No TBDs.

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-22-notepad-admin-and-blog-rtdb.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach?
