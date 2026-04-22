# Handle-first intake — design

**Date:** 2026-04-21
**Status:** Approved, ready for implementation plan
**Supersedes:** The 5-question sequential intake (Q1-Q5 + 2-round emerge) shipped in Phase 6 of the composable-sections rework (see `2026-04-16-zero-point-generator-design.md` + commit `6fa238d`).

## Context

nertia.ai's current intake walks the user through five sequential questions (purpose, audience, three vibe words, two adaptive follow-ups), then two emerge rounds (palette variants, then accent-hue refinements). It's honest but heavy — too many screens for what should feel like pasting a URL and getting a site.

Scott's framing: **most users who want a free website already live online somewhere.** Their primary identity is a social handle, not a standalone website. The first piece of information we ask for should be where they already are.

But social platforms (Twitter, Instagram, LinkedIn, etc.) are hostile to scraping — login walls, anti-bot, API paywalls. Trying to pull bios and tone from them will fail silently on almost every submission. The honest framing: **social handles aren't a source of content, they're a piece of output content.** We capture the handle + platform, display them as clickable links on the generated site, and still collect purpose/vibe from the user directly because we can't steal those from the platform.

This design replaces the entire intake UX with a single structured form. Three fields. One emerge round. No scraping.

## UX

One screen, three fields. Only purpose is required.

```
┌──────────────────────────────────────────────────────┐
│  Tell me about this.                                 │
│                                                      │
│  Where are you online?  (optional)                   │
│  [ @handle or URL                       ] ✓ twitter  │
│  [ @handle or URL                       ] ✓ ig       │
│  + add another                                       │
│                                                      │
│  What's this site for?                               │
│  [ textarea                                        ] │
│                                                      │
│  How should it feel?  (pick 1–3)                     │
│  ◯warm  ●technical  ◯editorial  ●minimal             │
│  ◯moody  ◯playful  ◯cinematic  ◯clean                │
│  ◯grounded  ◯bold  ◯quiet  ◯weird                    │
│                                                      │
│                                  [ Emerge → ]        │
│                                                      │
│  ↯ imagine something to try                          │
└──────────────────────────────────────────────────────┘
```

Submit → `/api/intake/emerge` → three variants shown as cards → pick one → `/api/intake/finalize` → redirect to `/hosted/{slug}`. That's it. No round 2. No review step.

## Data model

### BrandContext (replaces current shape)

```ts
interface BrandContext {
  purpose?: string;
  vibes?: string[];  // from chip picker, 0–3 items, lowercase strings from a fixed vocabulary
  handles?: Handle[];
}

interface Handle {
  platform: Platform;  // "twitter" | "instagram" | "linkedin" | "youtube" | "tiktok" |
                       // "bluesky" | "github" | "substack" | "mastodon" | "site" | "link"
  handle: string;      // extracted handle text — e.g. "scottsuper"
  url: string;         // canonical URL — e.g. "https://twitter.com/scottsuper"
}
```

Retired fields: `audience`, `vibeWords` (replaced by `vibes`), `adaptive` (no more Q4/Q5).

### Vibe vocabulary (fixed)

12 chips: `warm, technical, editorial, minimal, moody, playful, cinematic, clean, grounded, bold, quiet, weird`.

These map 1:1 to tags already used in `src/lib/palette.ts` and `src/lib/fontPair.ts`. Each chip the user selects becomes a token in the pickers' scoring.

### Platform detection (pure regex, zero fetches)

At input-change time, each handle field runs through an ordered list of regexes. First match wins.

| Input shape | Platform | Handle extracted | Canonical URL |
|---|---|---|---|
| `@foo` or `foo` (bare, no dot) | twitter (default) | `foo` | `https://twitter.com/foo` |
| `twitter.com/@?foo` | twitter | `foo` | `https://twitter.com/foo` |
| `x.com/@?foo` | twitter | `foo` | `https://x.com/foo` |
| `instagram.com/foo` | instagram | `foo` | `https://instagram.com/foo` |
| `linkedin.com/in/foo` | linkedin | `foo` | `https://www.linkedin.com/in/foo` |
| `youtube.com/@foo` or `/channel/foo` | youtube | `foo` | `https://youtube.com/@foo` |
| `tiktok.com/@foo` | tiktok | `foo` | `https://tiktok.com/@foo` |
| `bsky.app/profile/foo` | bluesky | `foo` | `https://bsky.app/profile/foo` |
| `github.com/foo` | github | `foo` | `https://github.com/foo` |
| `foo.substack.com` or `substack.com/@foo` | substack | `foo` | `https://foo.substack.com` |
| `@foo@mastodon.social` or `mastodon.social/@foo` | mastodon | `foo@mastodon.social` | `https://mastodon.social/@foo` |
| `https?://domain.tld/...` (no match above) | site | `domain.tld` | as-typed |
| any other non-empty string | link | as-typed | as-typed |

The UI shows the detected platform next to each valid input (small label + check). Invalid/empty fields are silently ignored at submit.

## Routes

### `POST /api/intake/emerge` (simplified)

**Before:** `{ brandContext, round, pickedVariantId?, previous? }` → round-1 or round-2 variants
**After:** `{ brandContext }` → three `EmergeVariant` cards, no rounds

Server does:
1. `compose(brandContext)` — runs `pickPalette`, `pickFontPair`, `pickComposition`. The **handle-count short-circuit** runs inside `pickComposition`: if `handles.length >= 3` and no `site` platform handle, force `linkinbio`.
2. `pickThreeForEmerge(brandContext)` — returns three distinct palettes.
3. Combines with one composition + one fontPair (shared across variants) + the writeCopy'd hero headline as the preview string.
4. Returns `{ variants: EmergeVariant[] }` (length 3).

### `POST /api/intake/finalize` (unchanged shape)

Same body as today: `{ brandContext, finalVariant, slug? }`. Same response: `{ slug, url }`.

The new BrandContext (with `handles` + `vibes`) just flows through — `writeCopy` is the only thing that cares.

### `POST /api/intake/imagine` (kept, updated presets)

Same endpoint, same response shape. The preset library in `src/lib/presetBrands.ts` gets rewritten: each preset now has `handles` + `vibes` (from the 12-chip vocabulary) and no `adaptive`.

### `POST /api/intake/next` — **deleted**

No more adaptive Q4/Q5. Delete the route file, delete `src/lib/questionBank.ts`, remove the `"next"` step from IntakeFlow.

## Composition biasing from handles

In `src/compositions/index.ts`, `pickComposition(ctx)` gets one new rule before the tag-scoring loop:

```ts
const handles = ctx.handles ?? [];
const hasSite = handles.some(h => h.platform === "site");
if (handles.length >= 3 && !hasSite) {
  return linkinbio;
}
```

Rationale: three-plus social handles with no standalone site is the canonical "link-in-bio" user.

Everything else falls through to the existing tag-scoring. Handle platforms are also added to `ctxTokens()`'s returned set (so a user with an instagram handle gets "instagram" as a token for scoring), which nudges compositions tagged `creator`/`musician`/`bio` upward without any explicit rule.

## writeCopy changes

### `link-stack` section

`writeCopy` takes the handles and maps the first 6 into `link{N}Label` / `link{N}Href`:

```ts
// pseudocode
export const writeCopy = (ctx) => {
  const out = { name: nameFromCtx(ctx), tagline: ..., bio: ..., avatarInitials: ... };
  (ctx.handles ?? []).slice(0, 6).forEach((h, i) => {
    out[`link${i + 1}Label`] = platformLabel(h.platform);  // "Twitter", "Instagram", etc.
    out[`link${i + 1}Href`] = h.url;
  });
  return out;
};
```

`platformLabel` is a small map: `twitter → "Twitter"`, `instagram → "Instagram"`, `site → "Website"`, `link → "Link"`, etc.

### `navbar` section

If `ctx.purpose` is empty but there's at least one handle, use the first handle's `handle` string as `wordmark`.

### `footer` section

Add optional slots `link{1..3}Label` / `link{1..3}Href` that `writeCopy` populates from `ctx.handles` — for compositions that don't use `link-stack` (marketing, portfolio, blog, docs), the user's socials still appear as a small link row in the footer.

## Client — IntakeFlow rewrite

The current `IntakeFlow.tsx` is a state machine with 8 steps (q1…q5, emerge1, emerge2, submitting). The new one is dramatically simpler:

```
State: "form" → "submitting" → (redirect)
               ↘ "emerge" → "submitting" → (redirect)
                           ↘ back-to-"form" on error
```

- **"form"**: the three-field screen. On submit, POST to `/api/intake/emerge` with the built BrandContext, move to `"emerge"`.
- **"emerge"**: render 3 `EmergeVariant` cards (same visual as today's cards). Click one → POST to `/api/intake/finalize` → move to `"submitting"` → on success, `router.push(data.url)`.

The existing `EmergeChoice` component (card grid with palette swatches + preview headline + composition label) is reusable verbatim.

The "↯ imagine something to try" button on the form submits a request to `/api/intake/imagine` and pre-fills the form with the returned BrandContext, still in the "form" state — the user can tweak before submitting to emerge.

## What survives, what changes, what goes

**Keep as-is:**
- Sections registry (`src/sections/`) — all 7 sections
- Compositions registry (`src/compositions/`) — all 5 compositions
- Pickers: `pickPalette`, `pickFontPair`, `pickThreeForEmerge`, `emergeNeighbors` (still used internally even if only one emerge round calls `pickThreeForEmerge`)
- `compose()` orchestrator
- Site shapes (`CompositionSite`, `LegacySite`)
- Renderers (`CompositionRenderer`, `LegacyTemplateRenderer`)
- `presetBrands.ts` structure (entries updated — see below)
- `ComingSoonBanner`, `EarlyAccessForm`, `/admin/zero-point`, `/zero-point` landing

**Modify:**
- `src/lib/brandContext.ts` — `BrandContext` type; add `Handle`, `Platform`; add platform tokens to `ctxTokens()`; drop `adaptive` handling
- `src/compositions/index.ts` — add handle-count short-circuit to `pickComposition`
- `src/sections/link-stack/writeCopy.ts` — consume `ctx.handles`
- `src/sections/navbar/writeCopy.ts` — handle fallback for wordmark
- `src/sections/footer/writeCopy.ts` — add link rows from `ctx.handles`
- `src/sections/footer/schema.ts` + `Component.tsx` — add link slots
- `src/app/intake/zero-point/IntakeFlow.tsx` — full rewrite to form → emerge → finalize
- `src/app/api/intake/emerge/route.ts` — drop round logic, single response
- `src/app/api/intake/imagine/route.ts` — updated preset shape
- `src/lib/presetBrands.ts` — rewrite all 10 entries to new BrandContext shape
- `src/lib/emerge.ts` — `EmergeVariant` unchanged; remove round-2-specific types

**Delete:**
- `src/app/api/intake/next/route.ts`
- `src/app/api/intake/next/__tests__/route.test.ts`
- `src/lib/questionBank.ts`
- Round-2 code in emerge route + emerge test
- Q4/Q5 and adaptive state in IntakeFlow

## Platform → label + icon (minimal)

For MVP, platform icons are just small text chips or Unicode symbols (e.g. "✕" for twitter, "IG" for instagram). A proper icon set can land post-MVP — the existing `IconSystem` in `/design-system` is SVG-per-icon; we'd add one per platform. Out of scope for this design; labels suffice.

## Verification

- `npm run lint` clean, `npm test` all green
- `npm run build` generates all routes; `/api/intake/next` is gone
- Dev smoke (`npm run dev`):
  - `/intake/zero-point` shows the new three-field form
  - Typing `@scottsuper` in a handle row shows "twitter" platform detected
  - Typing `instagram.com/scott` shows "instagram"
  - Typing a garbage string shows "link" (generic)
  - Clicking ↯ imagine populates all three fields with a preset
  - Submitting with purpose only → 3 emerge variants render
  - Picking a variant → finalize → redirect to `/hosted/{slug}` which renders a composition-shaped site
  - If user gave ≥3 non-site handles → generated site uses the `linkinbio` composition with the handles populating link slots
  - Legacy sites at `/hosted/precedent` etc. still render via `LegacyTemplateRenderer`

## Out of scope (explicit)

- URL scraping of user's own site (meta/OG extraction) — deferred to a follow-up phase
- Edit-site-post-generation UI
- Emerge round 2 / accent refinement (can return as optional polish step later)
- Multi-composition emerge ("pick portfolio vs blog vs linkinbio")
- Rate limiting / spam protection on the form
- Social OG data extraction (Twitter oembed, YouTube channel ID, etc.)
- Proper platform icon set — small chips are fine for MVP
- Phase 7 (shelve `src/templates/`, CLAUDE.md updates) and Phase 8 (admin dashboard site-shape column) from the earlier plan — still deferred

## Open questions (low-stakes; executor decides)

- Exact copy in the form (headings, placeholders, "↯ imagine" wording)
- Handle repeater: start with 2 fields visible, or 1 + "add another"?
- Platform detection display: text label vs small chip vs icon. Defaulting to text label ("twitter", lowercase) — least scope.
- Vibe chip visual style: pill buttons vs checkbox chips. Pill buttons from existing design-system component.
- Default vibes if none selected at submit time: `[]` (pickers fall back to purpose tokens alone) vs a sensible default like `["clean"]`. Defaulting to `[]`.
