# Notepad admin + blog migration to RTDB — design spec

**Date:** 2026-04-22
**Status:** Draft → awaiting user review
**Branch:** `feature/notepad-admin-rtdb`

## Problem

Scott captures session journals via the notepad pipeline (`~/.claude/skills/notepad/bin/notepad-*`), which writes markdown drafts to `~/notepad/drafts/*.md` and syncs a subset into `src/content/blog-candidates/` for publishing. Current state has three frictions:

1. **No remote admin.** Reviewing, tagging, approving, and combining drafts requires being at the laptop. Scott wants to triage the queue from his phone, anywhere.
2. **No merge workflow.** Good posts often span multiple session captures. Today there's no way to combine drafts; Scott either cherry-picks one or manually concatenates in a text editor.
3. **No AI-assisted polish.** Drafts are raw capture — useful for memory, but rough for publishing. Scott wants one-tap rewrite passes (tighten for voice, combine, re-title) without leaving the admin.

The filesystem-based blog (`src/content/blog/*.md`) blocks phone publishing: you can't `git commit && push` from iOS. Moving the canonical store to Firebase RTDB (already wired in the nertia app) resolves all three frictions simultaneously.

## Goals

- Phone-accessible admin at `/admin/notepad` for viewing, editing, tagging, approving, and publishing drafts.
- Merge 2+ drafts into a new draft, with an optional Claude-composed body.
- Inline AI polish / rewrite on a single draft, with a diff-review UX before accepting.
- Media upload (hero + inline) to Firebase Storage.
- Public `/blog` renders from RTDB with URL structure unchanged.
- Retire the filesystem-based blog and the old `/admin/blog` route.

## Non-goals

- Multi-user admin. This is Scott's admin, locked to `ps2pdx@gmail.com`.
- Commenting, reactions, or any reader-side interaction with posts.
- Rich-text WYSIWYG. Body stays markdown; editor is a textarea with live preview at most.
- Custom theming per post. Posts inherit blog template.
- Media transcoding, CDN optimization, or image variants. Raw upload, direct reference.
- Project switcher / master admin shell. Deferred — `/admin/notepad` sits alongside existing admin routes without a shared layout for now.

## Architecture

### RTDB schema

Single tree, unified states:

```
notepad/
  posts/
    {id}/
      id: string                      # uuid; stable across status transitions
      title: string
      slug: string | null             # assigned on publish
      body: string                    # markdown
      excerpt: string                 # short summary, auto-extracted or Claude-suggested
      tags: string[]
      hero: string | null             # Storage URL
      date: string                    # ISO 8601; defaults to capture date
      status: "draft" | "ready" | "published" | "merged" | "archived"
      source: "notepad-session" | "manual" | "merge"
      source_session_id: string | null
      authored: boolean               # true = human-written; false = auto-captured
      merged_from: string[] | null    # set when status=merged OR when this draft was created via merge
      merged_into: string | null      # set when status=merged; points to the merge result
      cwd: string | null              # capture working directory, for provenance
      created_at: number              # epoch ms
      updated_at: number              # epoch ms
      published_at: number | null     # epoch ms
```

**Why unified tree with a `status` field**, not split trees (`drafts/` + `posts/`):
- Publishing is a field flip, not a cross-tree move — no id changes, no references to update.
- Merge transitions are the same: flip source statuses, insert new post.
- Queries are straightforward with an index on `status`.

**Indexing:** add `.indexOn: ["status", "date"]` to the `notepad/posts` node in the RTDB security rules.

### Firebase Storage layout

```
blog/
  {postId}/
    hero.{ext}              # one hero image per post
    media/
      {filename}            # inline body images, multiple allowed
```

Uploaded from `/admin/notepad` via multipart → `/api/admin/notepad/media/upload` → `firebase-admin` storage SDK. Returns a public download URL that gets embedded in the markdown body (inline) or set as `hero` (hero slot).

### Server-side vs client-side access

- **Client (admin UI)** reads/writes via Firebase client SDK using the authenticated user's ID token. Security rules restrict writes to `ps2pdx@gmail.com` (admin email allowlist, aligned with `isAdminEmail()`).
- **Public `/blog`** renders server-side via `firebase-admin` (no auth needed; admin SDK bypasses rules). SSR with ISR revalidate of 60s.
- **API routes** under `/api/admin/notepad/*` use `firebase-admin` and verify the request's ID token against the admin email allowlist before processing.

### Auth / authorization

Reuses existing nertia infrastructure:
- `AuthGuard` component wraps the admin UI.
- `isAdminEmail()` gates access.
- API routes verify Firebase ID tokens server-side via `firebase-admin.auth().verifyIdToken()` and check the email claim against the allowlist.

## UI design

### Mobile list view (`/admin/notepad`)

**Chrome:**
- Header: "Notepad" + ⚙ menu (new draft, settings).
- Search bar below header.
- Chip stack row: status chips (`Ready 8`, `Draft 29`, `Published 4`, `Merged`, `Archived`) + project chips (`nertia`, `vantage`, `zen-holo`, `zero-point`). All toggleable, all combinable.
- Sticky merge bar (hidden when 0–1 selected): `Merge N →` button, ✕ to cancel.

**Rows (collapsed):**
- Checkbox (left, always visible) · status dot · title (ellipsized) · date (right)
- Tap checkbox → toggles selection.
- Tap row body → expands inline (accordion).
- Only one row expanded at a time; tapping another collapses the current one.

**Rows (expanded):**
Linear stacked fields in order:
1. **Title** — tap to edit inline, single-line input.
2. **Tags** — chip editor, tap to add/remove, `+` chip for new tag.
3. **Hero** — thumbnail or "📷 Upload" dropzone (tap to pick from photo library or camera).
4. **Body** — markdown textarea with live character count and a "Preview" toggle below.
5. **Action row** — `Publish`, `Merge`, `✨ Polish`, `Delete` buttons (wrap on narrow screens).

**Status colors:**
- `draft` — grey (`#666`)
- `ready` — amber (`#f59e0b`)
- `published` — green (`#22c55e`)
- `merged` — purple (`#a78bfa`) — hidden from default filter
- `archived` — not shown by default

### AI Polish flow

Tap `✨ Polish` in the expanded row:

1. Body area flips to a "Polishing…" state.
2. `POST /api/admin/notepad/{id}/polish` with current body + prompt preset ("polish for blog voice").
3. On response, body area shows an **inline diff**: strikethrough red for removed text, purple highlight for added text.
4. Sticky bottom bar appears with `Revert` / `Regenerate` / `Keep changes`.
5. **Keep changes** → `PATCH /api/admin/notepad/{id}` with the new body. Diff view collapses to rendered body.
6. **Revert** → local state reverts, no API call.
7. **Regenerate** → calls polish API again, shows a new diff.

The polish API does not persist anything — it returns a suggestion. Persistence only happens on `Keep changes`.

### Merge flow

1. User checks 2+ rows. Sticky merge bar appears with `Merge N →`.
2. Tap `Merge N →` → navigates to merge preview screen.
3. **Preview screen**:
   - Sources list (the N checked drafts, read-only).
   - Toggle: `✨ Claude-compose` (default) vs `Concatenate`.
   - **Compose method**:
     - `✨ Claude-compose`: `POST /api/admin/notepad/merge` with `sourceIds` and `composeMethod: 'ai'`. Calls Anthropic with a prompt that weaves the source bodies into a single cohesive post, proposes a combined title, merges tags.
     - `Concatenate`: mechanical join of source bodies with `## {source title}` subheadings, deduped tag union, title = first source's title.
   - Editable fields: title, tags, body (all pre-filled from compose output).
4. `Cancel` → returns to list with selections preserved.
5. `Create draft` → `POST /api/admin/notepad/merge` writes the new post with `status: draft`, `merged_from: [sourceIds]`. Flips each source's `status: merged`, `merged_into: newId`. Returns to list; new draft appears at the top.

### Publish flow

Tap `Publish` in an expanded row:

1. Modal with auto-generated slug (from title via `slugify()`), editable.
2. Slug uniqueness check against `notepad/posts` where `status === 'published'`.
3. Confirm → `POST /api/admin/notepad/{id}/publish` with final slug. Server-side: flips `status: published`, sets `slug` and `published_at`.
4. Draft immediately available at `/blog/{slug}` (ISR revalidates on next fetch or via `revalidatePath`).

### Desktop layout (≥1024px)

Master-detail pattern:
- Left rail (~380px): the mobile list view (narrower chip bar, same rows).
- Right pane (fills remaining width): the expanded row contents, but stretched.
- No accordion on desktop; right pane always reflects the selected draft.
- Same components as mobile (no parallel implementation) — just responsive breakpoints.

## Public blog migration

### Rendering

- `src/lib/blog.ts` rewritten:
  - `getAllPosts()` → queries RTDB `notepad/posts` where `status === 'published'`, ordered by `date` desc.
  - `getPostBySlug(slug)` → queries `notepad/posts` where `slug === {slug}` and `status === 'published'`.
- `src/app/blog/page.tsx` and `src/app/blog/[slug]/page.tsx` unchanged in shape; just consume the new functions.
- ISR: `export const revalidate = 60` on both pages.
- `generateStaticParams()` replaced with dynamic rendering (RTDB is the source of truth; build-time enumeration would block publishing from phone). Revalidation handles cache freshness.

### Retirement

**Deleted in this PR:**
- `src/lib/blog-candidates.ts`
- `src/app/admin/blog/page.tsx`
- `src/app/admin/blog/[slug]/page.tsx`
- `src/app/api/admin/blog/route.ts`
- `src/app/api/admin/blog/[slug]/route.ts`
- `src/content/blog/*.md` (after migration)
- `src/content/blog-candidates/*.md` (after migration)

**Kept:**
- `public/blog/*` — hero images continue to be served as static assets, referenced by path in the migrated RTDB rows.
- `gray-matter` dependency — used by the one-time migration script; may be removed in a follow-up PR.

### One-time migration

Script at `scripts/migrate-blog-to-rtdb.ts`:

1. Read every `src/content/blog/*.md` → parse frontmatter + body → write to RTDB `notepad/posts/{uuid}` with `status: published`, slug from frontmatter or derived from filename, `authored: true`, `source: 'manual'`.
2. Read every `~/notepad/drafts/*.md` → parse frontmatter → write to RTDB `notepad/posts/{uuid}` with `status: draft` (or `ready` if frontmatter `blog_worthy: true`), `source: 'notepad-session'`, `source_session_id` from filename pattern.
3. Idempotent: skip if `notepad/posts/{id}` already exists (keyed by session id for drafts, by slug for published posts).
4. Dry-run flag for preview.

Run manually, once, then the files can be deleted.

## Notepad-sync integration

`~/.claude/skills/notepad/bin/notepad-sync` changes:
- Drops the `blog-candidates/` write path.
- Pushes drafts directly to RTDB via `firebase-admin` (Python library) using the local service account JSON at the path already referenced in nertia's `.env.local`.
- Idempotent: looks up by `source_session_id`, updates if exists.
- Still works as a batch command (`notepad-sync` pushes all local drafts not yet in RTDB).

**Future:** the SessionStop hook can call `notepad-sync` to auto-push each session's draft as it lands. Out of scope for this PR.

## API surface

All under `/api/admin/notepad/*`. All require admin email allowlist via verified Firebase ID token.

| Route | Method | Purpose |
|---|---|---|
| `/list` | GET | Returns all posts, optional `?status=` and `?project=` query filters |
| `/[id]` | GET | Full post |
| `/[id]` | PATCH | Update fields: title, body, tags, hero, slug, status |
| `/[id]` | DELETE | Hard delete (status=archived is preferred; DELETE is for mistakes) |
| `/[id]/polish` | POST | Body: `{ prompt?: string }`. Returns `{ polished: string }`. Does not persist. |
| `/merge` | POST | Body: `{ sourceIds: string[], composeMethod: 'ai' \| 'concat' }`. Returns new post; flips source statuses. |
| `/[id]/publish` | POST | Body: `{ slug: string }`. Flips status; assigns slug + published_at. |
| `/media/upload` | POST | Multipart. Returns `{ url: string }`. |

## Testing

### Unit tests

- `src/lib/notepad.ts` — schema validation, status transitions, merge logic (pure functions).
- `src/lib/blog.ts` — RTDB-backed post fetchers with mocked admin SDK.
- Slug uniqueness, title slugification edge cases.

### Integration tests

- API routes with mocked RTDB + auth: each route's success + unauthorized paths.
- Polish route with mocked Anthropic SDK.
- Merge route: compose + concat paths, status transitions verified.

### Manual verification checklist

- Open `/admin/notepad` on phone, see drafts.
- Tap a draft, edit title → reload → persisted.
- Check 2 drafts → merge bar appears → tap Merge → preview → Create → new draft in list, sources marked merged.
- Polish a draft → diff appears → Keep changes → body updated.
- Publish a draft → live at `/blog/{slug}` within 60s.
- Visit `/blog` in private mode → see published posts from RTDB.
- Delete a draft → disappears from default list.

## Implementation phases

All on one branch. Rough ordering:

1. **Schema + types** — `src/lib/notepad.ts` with types, validators, status transition rules.
2. **API routes** — `/api/admin/notepad/*` with firebase-admin.
3. **`/admin/notepad` page** — list, chip filter, expanded row (no AI yet).
4. **Merge flow** — multi-select, preview screen, concat compose.
5. **AI Polish + AI-compose** — Anthropic integration for polish and merge AI path.
6. **Media upload** — Storage integration, hero + inline.
7. **Blog migration** — rewrite `src/lib/blog.ts`, update routes, ISR.
8. **One-time migration script** — run locally once.
9. **Retire `/admin/blog`** — delete routes, files, components.
10. **notepad-sync rewrite** — push to RTDB.

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Accidental blog outage during migration | Feature-flag the blog render (`USE_RTDB_BLOG=true`). Ship migration code first, flip flag last. |
| RTDB rules misconfigured → drafts leak publicly | Unit test rules locally with the Firebase emulator before deploy. Default-deny with admin-only writes. |
| Anthropic polish returns garbage | Polish never persists without user confirm. Worst case is one wasted API call. |
| Merge deletes source drafts | Merge flips `status: merged`, does not delete. Sources recoverable via "Show merged" filter. |
| Slug collisions on publish | Pre-publish uniqueness check; modal surfaces conflict and suggests a variant. |
| ISR cache staleness after publish | `revalidatePath('/blog')` called server-side in publish route; `revalidate: 60` as backstop. |

## Open questions

None at spec time. (Project switcher UX deferred by user; desktop polish iterable after first ship.)
