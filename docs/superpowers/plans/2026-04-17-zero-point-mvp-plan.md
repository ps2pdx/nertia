# Zero-Point MVP — Implementation Plan

**Date:** 2026-04-17
**Status:** Draft — awaiting user review
**Supersedes:** nothing. Picks up where `2026-04-16-mvp-vertical-slice.md` left off.
**Spec:** `docs/superpowers/specs/2026-04-16-zero-point-generator-design.md`

---

## Context

The vertical-slice plan (`2026-04-16-mvp-vertical-slice.md`, 72KB) is executed. That work established:
- vitest setup, type definitions
- The `zero-point` flagship direction (`src/directions/zero-point/`)
- Humanize rules library (`src/lib/humanize.ts`)
- Firebase site store + admin (`src/lib/siteStore.ts`, `firebaseAdmin.ts`)
- Slug generator, moderation scaffold
- Full Haiku/Sonnet generation pipeline behind `/api/generate`
- Middleware subdomain routing
- `/_sites/[slug]` renderer

This plan takes the MVP from "one-direction vertical slice" to "full 4-direction shippable product with intake, landing, admin, and launch infra."

---

## Framing (standing direction)

**Nertia is a sleek sexy product, NOT a hire-me portfolio.** Every user-facing surface (landing, intake, admin, gallery) reads as standalone product voice (Linear / Vercel / Framer tone) — not founder résumé. No "built by Scott," no "available for," no consulting pitch anywhere on the public site. This is enforced in Phase C via an executable `voiceAudit.test.tsx` that asserts forbidden phrases are absent from rendered DOM.

---

## Phases

| Phase | Name | Task range | Parallelizable with |
|---|---|---|---|
| A | Directions — complete the library | 1–6 | — |
| B | Intake + streaming generation | 7–11 | C, E |
| C | Landing | 12–14 | B, D, E |
| D | Admin queue | 15–16 | C, E |
| E | Retirement of old thesis code | 17–18 | B, C, D |
| F | Infra + launch | 19–21 | — |

**Critical path:** 1 → 6 → 7 → 10 → 11 → 15 → 16 → 20 → 21 (9 tasks). Everything else slots around.

---

## Open questions — resolved with defaults

From spec §Open Questions. All carry defaults so nothing blocks; flag inline if a default turns out wrong during execution.

1. **Domain registrar** → deferred to V1. MVP has no custom-domain flow.
2. **Wildcard DNS** → Cloudflare `*.nertia.ai` CNAME to Vercel. Verified in Task 19.
3. **Anonymous vs login for free tier** → anonymous-first. No auth on `/generate`. Email collection is optional (unlocks "claim this site" for later upgrade).
4. **Site editor depth** → deferred to V1. MVP ships regenerate-only; no inline edits.
5. **Moderation threshold** → soft-flag only, never block. Banned-keyword list lives in `src/lib/moderation.ts`; flagged generations land in the admin queue with a badge, not a 4xx.

---

## Phase A — Directions (complete the library)

**Goal:** ship 4 directions. Zero-point exists; build 3 more. The direction picker is meaningful only once all four are registered.

**Parallelizable:** Tasks 2, 3, 4 can run concurrently (independent files under `src/directions/`).

### Task 1 — Scaffold direction structure as a shared helper

**Why:** DRY — the three new directions + future ones all need the same folder shape (README, direction.ts, motion.ts, Layout.tsx, sample.json, tests).

**Files:**
- `src/directions/_scaffold.md` — one-page checklist mirroring `build-direction` skill expectations
- Verify existing `zero-point` conforms; fix minor drift if any

**Acceptance:** scaffold doc linked from `src/directions/README.md`; zero-point passes the checklist.

**Est:** 0.5 hr.

---

### Task 2 — Editorial direction (Kinfolk / Cereal-ish)

**Why:** covers the "calm, magazine-grade, image-forward" aesthetic territory. Strong fit for restaurants, creators, weddings, editorial personal sites.

**Files:**
- `src/directions/editorial/README.md` — when to pick, aesthetic rules (serif headlines, generous leading, 8-col grid, limited palette)
- `src/directions/editorial/direction.ts` — metadata (name, tags, slots, palette constraints, type pairing)
- `src/directions/editorial/Layout.tsx` — component tree with slots (hero, sections, pullquote, footer)
- `src/directions/editorial/motion.ts` — motion presets (subtle parallax, fade-up, no kinetic element)
- `src/directions/editorial/sample.json` — reference config for QA
- `src/directions/editorial/__tests__/Layout.test.tsx` — renders all slots, palette constraints honored

**Acceptance:**
- Tests pass
- Rendered Layout with sample.json visually matches the brief (manual QA by Scott)
- Palette audit: only values from direction's allowed set

**Est:** 4–6 hr.

**Reference (use as inspiration only, not ship code):** `astro-erudite`, `guillermo-rauchg`, `brian-lovin-next`, `next-mdx-blog`, `brittanychiang-v4`.

---

### Task 3 — Brutalist direction

**Why:** covers the "raw grid, monospace accents, type-contrast-forward, unstyled-feeling" territory. Strong for agencies, devs, experimental brands, niche consumer.

**Files:**
- `src/directions/brutalist/{README, direction.ts, motion.ts, Layout.tsx, sample.json}`
- `src/directions/brutalist/__tests__/Layout.test.tsx`

**Acceptance:** same pattern as Task 2.

**Est:** 4–6 hr.

**Reference:** experimental sites from the reference library; monospace-heavy templates; raw CSS-grid patterns.

---

### Task 4 — Organic direction

**Why:** covers the "warm, soft-gradient, hand-drawn accents, friendly" territory. Strong for coaches, small-biz, wellness, family/personal sites.

**Files:** same pattern.

**Acceptance:** same pattern.

**Est:** 4–6 hr.

**Reference:** `precedent` (Framer-Motion hero patterns), warm-palette templates from the reference library.

---

### Task 5 — Direction registry

**Why:** pipeline needs a single import surface for "all directions available," not glob-discovery.

**Files:**
- `src/directions/index.ts` — exports `directions: Record<DirectionName, DirectionModule>`
- `src/directions/__tests__/registry.test.ts` — asserts all 4 directions registered and conform to `DirectionModule` shape

**Acceptance:** importing `directions` from anywhere gives typed access to all 4; bad direction shape fails at type-check time.

**Dependencies:** Tasks 2, 3, 4 complete.

**Est:** 1 hr.

---

### Task 6 — Direction picker (LLM classification step)

**Why:** step 1 of the generation pipeline — Haiku classifies the brief and picks which of the 4 directions suits best. Currently hardcoded to zero-point in the vertical slice.

**Files:**
- `src/lib/generator/pickDirection.ts` — takes brief, returns `DirectionName`
- `src/lib/generator/pickDirection.prompt.ts` — prompt template (includes direction manifest as cacheable system prompt)
- `src/lib/generator/__tests__/pickDirection.test.ts` — 8+ fixture briefs → expected direction mapping (editorial-ish briefs pick editorial, etc.)
- Update `/api/generate` route to call `pickDirection` instead of hardcoded zero-point

**Acceptance:**
- Fixtures pass ≥6/8 (direction classification is fuzzy; not 100%)
- Cached prompt size within budget (<5k tokens for the manifest)
- Integration test: full generation with each fixture direction renders without error

**Dependencies:** Task 5 (needs registry).

**Est:** 3–4 hr.

---

## Phase B — Intake + streaming generation

**Goal:** user can fill out the questionnaire and watch their site generate live. Replaces the API-only vertical slice with a real UI.

**Parallelizable:** Phase B tasks are mostly sequential; but C and E can run alongside.

### Task 7 — `/api/generate-stream` route (SSE)

**Why:** the intake form needs streamed status updates ("picking direction… mixing palette… writing copy…") to feel responsive and match the spec's §Generation pipeline stream labels.

**Files:**
- `src/app/api/generate-stream/route.ts` — SSE endpoint, wraps the existing pipeline with progress events
- `src/lib/generator/streamEvents.ts` — typed event shape (`{stage, status, preview?}`)
- `src/app/api/generate-stream/__tests__/route.test.ts` — mocked pipeline → asserts event sequence

**Acceptance:**
- Streams events in order: `picking-direction`, `mixing-palette`, `writing-copy`, `setting-scene`, `finalizing`, `complete`
- Final event carries `{slug, url}`
- On failure: emits `error` event with user-safe message, NEVER leaks stack traces to client
- Test: event sequence matches spec

**Dependencies:** Task 6 (needs direction picker wired into pipeline).

**Est:** 2–3 hr.

---

### Task 8 — `putBrief` helper

**Why:** the spec's data model splits `sites/{slug}` (config) from `briefs/{slug}` (questionnaire raw answers). Vertical slice wrote only sites; this completes the model.

**Files:**
- Extend `src/lib/siteStore.ts` with `putBrief(slug, form, rawResponses)`
- `src/lib/__tests__/siteStore-brief.test.ts` — writes, reads, updates

**Acceptance:** brief stored under `briefs/{slug}`; admin queue can read it.

**Est:** 1 hr.

---

### Task 9 — Cost telemetry

**Why:** spec §Testing calls for a CI step that alerts if median cost exceeds $0.05 budget. Every generation needs a cost row.

**Files:**
- `src/lib/generator/costTelemetry.ts` — wraps API calls, records tokens + $ per step to `generations/{id}/cost`
- `src/lib/generator/__tests__/costTelemetry.test.ts`
- Extend pipeline in `/api/generate` to write cost row

**Acceptance:**
- Each generation writes a cost breakdown per step (direction/palette/copy/motion)
- Total cost visible in admin queue

**Est:** 2 hr.

---

### Task 10 — `/generate` intake form

**Why:** the only public entry point for free-tier site creation. UX is make-or-break: too long and we lose users, too short and we lose signal.

**Files:**
- `src/app/generate/page.tsx` — marketing wrapper
- `src/app/generate/IntakeForm.tsx` — client component, uses SSE from Task 7
- `src/app/generate/GenerationStream.tsx` — live stream display with stage labels
- `src/app/generate/__tests__/IntakeForm.test.tsx` — renders all questions, validates required, submits payload shape
- `src/app/generate/__tests__/GenerationStream.test.tsx` — SSE event → UI label mapping

**Form questions (from spec §Intake questionnaire):**
1. What's the site for? (business / personal / portfolio / project — radio)
2. Business / project name (text)
3. One sentence about what you do (textarea)
4. Who's it for? (text)
5. Three words that describe the vibe (text, comma-separated)
6. Favorite 2–3 sites (optional, URL inputs)
7. Contact email (optional)
8. Pick a slug or let us generate one (text, auto-suggest)

**Acceptance:**
- Form validates, submits, streams progress, redirects to `{slug}.nertia.ai` (or inline preview first)
- Mobile-responsive
- Accessible (labels, aria-live for stream)
- Golden visual test: form at each state (empty / filled / generating / done / error)

**Dependencies:** Task 7 (needs stream endpoint), Task 8 (needs brief storage).

**Est:** 6–8 hr.

---

### Task 11 — Moderation soft-flag

**Why:** spec §Error Handling calls for keyword + Anthropic moderation pass on brief before generation. Soft-flag only (default from Open Questions above) — flagged generations succeed but land in admin queue with a badge.

**Files:**
- `src/lib/moderation.ts` — `auditBrief(brief) → {flags: string[], severity: 'clean' | 'soft' | 'hard'}`
- `src/lib/__tests__/moderation.test.ts` — canonical clean/abuse fixtures
- Extend `/api/generate` to call `auditBrief`, write `generations/{id}/moderation`

**Acceptance:**
- Clean briefs: severity `clean`, no flags
- Obvious abuse (hate, CSAM-adjacent, scam keywords): severity `soft`, flags listed
- NEVER returns `hard` in MVP (no blocking)
- Admin queue badge reads the severity

**Est:** 2 hr.

---

## Phase C — Landing (parallel with B / D / E)

**Goal:** replace butterfly-ring hero with zero-point positioning. This is the GTM front door.

**Framing enforcement:** `voiceAudit.test.tsx` asserts forbidden product-voice violations.

### Task 12 — Landing hero + positioning

**Files:**
- `src/app/page.tsx` — replace butterfly-ring with zero-point hero
- `src/app/_components/landing/Hero.tsx` — zero-point aesthetic (void canvas, single kinetic element, one emergent accent color, scientific typography)
- `src/app/_components/landing/Hero.test.tsx`

**Copy direction (product voice, not founder voice):**
- Headline: "A zero-point website — emerges from your brief."
- Sub: "Free. No time limit. Your site on `{slug}.nertia.ai` in under a minute."
- CTA: "Start →" (goes to `/generate`)

**Acceptance:**
- Renders correctly on mobile + desktop
- No references to Scott, consulting, "hire me," "built by," or founder-résumé language
- Kinetic element matches zero-point direction's motion signature
- `voiceAudit.test.tsx` passes (see Task 14)

**Est:** 3–4 hr.

**Reference aesthetic only (DO NOT recycle):** `astro-nano`, `magicui` hero patterns, zero-point direction Layout.

---

### Task 13 — CUT (scope correction 2026-04-17)

The "feature sections + pricing + FAQ link" breakdown assumed a standard SaaS marketing site. Nertia is **just a website generator** — the landing is the product, not a pitch. Hero (Task 12) + inline or adjacent `/generate` form does the entire job.

**If a secondary surface is needed later:**
- Gallery / library browser → its own page, not a landing section
- Pricing → lives at `/pricing` or inline on the upgrade CTA inside generated sites
- FAQ → separate `/faq` page (already exists)

**Est:** 0. Task removed.

---

### Task 14 — Voice audit test + landing integration

**Why:** an automated check that the "sleek product, not hire-me portfolio" rule holds as landing copy evolves. This is a regression guard — the rule lives in code, not just culture.

**Files:**
- `src/app/_components/landing/__tests__/voiceAudit.test.tsx`

**Audit:**
- Renders full landing page
- Extracts text content
- Asserts NO case-insensitive matches for: `"hire me"`, `"built by scott"`, `"available for"`, `"my portfolio"`, `"contact me for"`, `"freelance"`, `"consulting"` (scoped to hero/features — pricing page is allowed to mention consulting), `"resume"`, `"cv"`
- Asserts presence of product signals: `"zero-point"`, `"nertia"`

**Acceptance:** test passes on current landing; would fail if any banned phrase is introduced.

**Dependencies:** Tasks 12, 13 complete.

**Est:** 1 hr.

---

## Phase D — Admin queue

**Goal:** Scott can see new free-tier generations, flagged ones, and eventual upgrade requests. Replaces retired `/admin/generations`.

### Task 15 — `/api/admin/queue` endpoint

**Files:**
- `src/app/api/admin/queue/route.ts` — authed (existing admin guard), returns paginated generations with brief + moderation + cost joined
- `src/app/api/admin/queue/__tests__/route.test.ts`

**Acceptance:**
- Returns shape: `{items: Array<{slug, brief, siteConfig, moderation, cost, createdAt}>, cursor}`
- Auth required (401 without admin session)
- Pagination (cursor-based)

**Dependencies:** Tasks 8 (briefs), 9 (cost), 11 (moderation) — all must be writing to Firebase for the queue to read them.

**Est:** 2 hr.

---

### Task 16 — `/admin/queue` page

**Files:**
- `src/app/admin/queue/page.tsx` — list view
- `src/app/admin/queue/QueueList.tsx` — client component, reads endpoint
- `src/app/admin/queue/QueueItem.tsx` — row: slug, preview thumb, direction, cost, moderation badge, timestamp, "open" link to `{slug}.nertia.ai`
- `src/app/admin/queue/__tests__/*.test.tsx`

**Acceptance:**
- Paginated list, newest first
- Moderation badge visible for soft-flagged items
- Cost column sortable
- "Open" link opens the generated subdomain site

**Est:** 3–4 hr.

---

## Phase E — Retirement

**Goal:** delete old thesis code. Gated one-rm-per-commit with `rg` reference checks so deletions don't silently break imports.

### Task 17 — Retirement prerequisite check

**Files:**
- `scripts/pre-retirement-check.sh` — for each deletion candidate, run `rg` against `src/` to list inbound references. Outputs a report. Fail if any candidate has live references outside its own subtree.

**Acceptance:** produces a clean report listing each candidate + reference count.

**Est:** 1 hr.

---

### Task 18 — Delete old thesis code (18 sub-commits)

**Why:** the spec §Components §1 lists code to retire. Each deletion is a separate commit for reviewability.

**Order (each gated by re-run of pre-retirement-check):**
1. `src/app/brand-system/` and route
2. `src/app/butterfly-test/` and route
3. `src/app/design-system/` and route
4. `src/app/generator/` and route
5. `src/app/generator/history/` and route
6. `src/app/admin/generations/` and route
7. `src/app/admin/golden-examples/` and route
8. `src/app/api/generate-tokens/` and route (deprecated API)
9. `src/app/api/generations/` and route (deprecated API)
10. `src/app/api/discover-website/` and route (deprecated API)
11. `src/components/ButterflyRingParticles.tsx` (and subdir if any)
12. Token / brand / design-system React components
13. `instructions/` directory (old pre-pivot specs)
14. `SCHEMA_V2_INSTRUCTIONS.md`
15. Run full test suite after each — must stay green

**Acceptance:**
- All deletions committed with clear messages
- `npm run build` succeeds at every step
- No dead imports (ESLint passes)
- `src/app/page.tsx` no longer renders ButterflyRingParticles (handled in Task 12)

**Dependencies:** Task 17 (prereq check). Task 12 must land before step 11 (Butterfly deletion).

**Est:** 3–4 hr.

---

## Phase F — Infra + launch

**Goal:** production-ready DNS, smoke tests, launch checklist.

### Task 19 — Wildcard DNS + Vercel domain config

**Why:** `*.nertia.ai` must resolve to the nertia Vercel project so every generated slug's subdomain is live.

**Steps:**
1. In Cloudflare DNS (assumed provider — verify), add wildcard CNAME: `*` → `cname.vercel-dns.com`
2. In Vercel project settings, add `*.nertia.ai` as a domain
3. Smoke test: `curl https://smoke-test-123.nertia.ai` → expect 200 after seeding a `sites/smoke-test-123` Firebase doc
4. Document the process in `docs/deployment/wildcard-dns.md`

**Acceptance:**
- `{any-slug}.nertia.ai` resolves and hits the middleware rewrite
- TLS cert valid for wildcard

**Est:** 1–2 hr (mostly DNS propagation wait).

**Risk:** if DNS provider isn't Cloudflare, may need TXT verification dance with Vercel.

---

### Task 20 — Production smoke test suite

**Why:** before launch, full path must work end-to-end in production preview.

**Files:**
- `scripts/smoke/generate-and-fetch.ts` — posts to `/api/generate-stream`, waits for slug, curls `{slug}.nertia.ai`, asserts 200 + contains expected strings
- Add to CI on main branch deploys

**Acceptance:**
- Generates a site, fetches it, sees rendered HTML — all green in CI
- Cost per smoke run logged
- Teardown: delete smoke-test Firebase docs after run

**Dependencies:** Tasks 6, 7, 19.

**Est:** 2–3 hr.

---

### Task 21 — Launch checklist + announcement

**Why:** ship it.

**Steps:**
1. Final review: all tests green, all deletions merged, voiceAudit passing
2. Update `public/og.png` to zero-point aesthetic (replace current Nertia brand-systems OG if any)
3. Update `src/app/layout.tsx` metadata (title, description) to product voice
4. Sitemap: include `/`, `/generate`, `/pricing`, `/faq`, `/blog/*`
5. Deploy to production
6. Generate 5 seed sites across all 4 directions — manually inspect
7. Announcement post on `/blog/` — launch narrative (product voice; build-in-public framing OK, founder-résumé framing NOT OK)
8. (Optional, day-of) schedule a stream to walk through the product

**Acceptance:**
- Live at `nertia.ai`
- 5 live seed sites at `{slug}.nertia.ai`
- Launch post published

**Dependencies:** Tasks 1–20 complete.

**Est:** 3 hr (not counting announcement content).

---

## Parallelization summary

**After Task 6 lands:**
- Phase B (Tasks 7–11) on the critical path
- Phase C (Tasks 12–14) can run in parallel — independent files
- Phase E (Tasks 17–18) can run in parallel — except Task 18 step 11 waits for Task 12

**Streaming sessions shape:**
- Evening 1: Tasks 2, 3, 4 (directions — Scott-art-direction-heavy)
- Evening 2: Tasks 5, 6 (registry + picker — code-heavy, good stream content)
- Evening 3: Tasks 7, 8, 9 (stream endpoint + storage + cost)
- Evening 4: Task 10 (intake form — visible UI progress)
- Evening 5: Task 11 + Phase C (moderation + landing)
- Evening 6: Phase D + Phase E (admin + retirement)
- Evening 7: Phase F (infra + smoke + launch)

Roughly **7 evening streams from today to launch**, assuming 4–5 hr per stream. Call it 2 weeks with rest days.

---

## Test strategy — summary

- **Unit:** each new `.ts` lib gets `__tests__/` with vitest
- **Integration:** `/api/generate-stream` with mocked LLM responses, 5 fixture briefs → event sequence + final site shape
- **Golden visual:** Playwright screenshots of each direction rendered from sample.json (Task 2, 3, 4)
- **Voice audit:** executable test on landing (Task 14)
- **Smoke:** live production path (Task 20)

TDD applies to pipeline logic, moderation, cost telemetry, direction registry, intake form validation. For visual components (directions, landing), golden screenshots replace unit tests per spec §Testing.

---

## Risk flags

1. **Direction picker accuracy.** LLM classification is fuzzy. If Task 6 test fixtures fail too often, fallback is deterministic keyword match based on form answers (vibe words, site-for field) before LLM call.
2. **Wildcard DNS.** Propagation + cert issuance can take hours. Start Task 19 early in the phase, not the morning of launch.
3. **Cost drift.** If median generation exceeds $0.05 despite caching, Sonnet copy step is the likely culprit. Mitigation: shorter copy prompt, tighter cache hit, or try Haiku for copy with humanize catching the quality drop.
4. **Voice drift.** As landing copy evolves, product-voice discipline is the first thing to slip. `voiceAudit.test.tsx` is the guard — keep it strict, update the banned list as new failure modes emerge.
5. **Subdomain cert issue.** Vercel wildcard certs work but can fail under high subdomain churn. Unlikely at MVP scale; monitor.

---

## Next steps

1. User reviews this plan
2. On approval, begin Phase A Task 1
3. Each task gets its own branch (per CLAUDE.md: `using-git-worktrees` skill for feature isolation)
4. Each task decomposes into 5–10 TDD sub-steps at execution time via `superpowers:executing-plans` skill
5. After Phase A (Tasks 1–6), evaluate whether to start Phases C + E in parallel

---

## Related docs

- Spec: `docs/superpowers/specs/2026-04-16-zero-point-generator-design.md`
- Prior plan (executed): `docs/superpowers/plans/2026-04-16-mvp-vertical-slice.md`
- Project CLAUDE.md: `CLAUDE.md`
- Reference library: `~/code/nertia-template-reference/` (122 cataloged templates, inspiration only)
