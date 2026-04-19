# Zero-Point Website Generator — Design Spec

**Date:** 2026-04-16
**Status:** Draft — pending user review
**Author:** Scott Campbell (with Claude)
**Supersedes:** `instructions/nertia-brand-generator-v3-instructions.md`, `SCHEMA_V2_INSTRUCTIONS.md`

---

## Thesis

Nertia.ai is a **Zero-Point Website Generator**: a free AI-generated website offered to anyone, hosted on a `{slug}.nertia.ai` subdomain at no cost. Monetization happens when users upgrade to a custom domain — they pay nertia for the domain (resold) and begin a paid relationship with Scott for the real build.

"Zero-point" is both the product's positioning language and one of its flagship visual directions. The metaphor comes from zero-point energy in physics: the vacuum state that's still full of latent potential. Every nertia site starts from that state — zero cost, zero time, zero assumptions — and emerges from the brief.

This supersedes the previous "Brand Systems Generator" thesis, which produced design tokens and was useful as a Claude-API stress test but was not a shippable product.

---

## Business Model

### Free tier — `{slug}.nertia.ai`

- Fully free. No fee, no domain cost, no time limit.
- Anyone completes an intake questionnaire → generator returns a live subdomain URL within minutes.
- Zero-cost floor: hosting is a row in Firebase + Vercel ISR. Only real cost is ~$0.02–0.05 of API per generation.
- Purpose: **this is the acquisition wedge.** The free site must be uniquely, visibly better than Durable / Framer / Wix-AI. If it's not, the funnel dies.

### Paid tier — custom domain + Scott-built

- User wants `clientbrand.com` instead of the subdomain.
- Flow: "upgrade to custom domain" CTA on the live free site → free 30-min consult with Scott (Cal.com or similar) → Scott locks creative direction + closes the client → domain purchased through nertia (registrar reseller) → Scott runs a bespoke build using the full Superpowers workflow → ongoing hosting relationship.
- Monetization layers:
  1. Domain resale (small markup per registration)
  2. Paid build (one-time fee for bespoke site)
  3. Hosting retainer (ongoing)
  4. Upsell to full brand / GTM / dev consulting (the real prize)

### Funnel

```
visitor → questionnaire → {slug}.nertia.ai live site (free)
                              │
                              ↓
                    "upgrade to custom domain" CTA
                              │
                              ↓
                    free 30-min consult (calendar)
                              │
                              ↓
                    Scott closes → paid build + domain + hosting
                              │
                              ↓
                    upsell: brand / GTM / dev consulting
```

---

## Competitive Positioning

Durable, Framer, Wix-AI all let an LLM invent layouts from scratch. Output is mid because LLMs are bad at visual composition. The differentiator for nertia is not more AI — it's **curated primitives + AI as art director**.

A visual-direction library (see below) encodes Scott's taste into reusable React component trees with slots. The LLM's job is to pick a direction, parameterize it, and write copy — not invent layouts. This gives nertia free sites quality a pure-LLM generator cannot match at the same cost.

Positioning language: "a zero-point website — emerges from your brief." Phenomenon, not SaaS.

---

## Architecture

One Next.js 15 app hosts everything: marketing site, intake form, generator API, and every generated site. No per-site deploys. Sites are Firebase documents rendered through the same codepath. This matches the "zero-point" metaphor architecturally — sites are configurations in a vacuum, not separate deployments.

```
                    ┌─────────────────────────────────────┐
                    │         nertia.ai (one app)         │
                    │  Next.js 15 · Vercel · Firebase     │
                    └──────────────┬──────────────────────┘
                                   │
          ┌────────────────────────┼─────────────────────────┐
          │                        │                         │
   apex: nertia.ai         *.nertia.ai subdomain       custom domain
   (marketing + intake)    (free-tier sites)           (paid-tier sites)
   /, /blog, /faq          rendered from DB config     same rendering path
   /generate (form)        via middleware lookup       different host binding
                           ↓
                    Firebase Realtime DB
                    ┌──────────────────────────┐
                    │  sites/{slug}            │
                    │   ├── direction: string  │
                    │   ├── palette: {...}     │
                    │   ├── copy: {...}        │
                    │   ├── motionConfig: {...}│
                    │   ├── owner: uid         │
                    │   └── tier: free | paid  │
                    └──────────────────────────┘
```

### Subdomain routing (middleware)

`middleware.ts` inspects the `Host` header on every request:

- `nertia.ai` (apex) → serve marketing app normally
- `{slug}.nertia.ai` → rewrite to `/_sites/{slug}`
- Custom domain (e.g. `clientbrand.com`) → look up `domains/{host}` in Firebase → resolve to slug → rewrite to `/_sites/{slug}`

Implementation reference: Vercel's Platforms Starter Kit. We don't need a full port — we need just the middleware + `/_sites/[slug]` dynamic segment.

### Data model (Firebase Realtime DB)

```
sites/
  {slug}/
    direction: "zero-point" | "editorial" | "brutalist" | ...
    palette: { bg, fg, accent, muted }
    typography: { heading: "Inter Display", body: "Inter", scale: 1.25 }
    copy: { hero: { eyebrow, headline, sub, cta }, sections: [...] }
    motionConfig: { variant, intensity, accent }
    images: { hero: url | null, sections: [...] }
    owner: uid | null  // null for anonymous free-tier
    tier: "free" | "paid"
    createdAt: timestamp
    updatedAt: timestamp

domains/
  {host}/            // e.g. "clientbrand.com" → maps to a slug
    slug: string
    verified: boolean
    addedAt: timestamp

briefs/              // questionnaire answers kept separate from site config
  {slug}/
    form: { businessName, industry, goals, tone, ... }
    rawResponses: {...}

generations/         // audit log of every generation attempt
  {id}/
    slug, inputs, outputs, model, cost, createdAt

consults/            // booked paid-tier consults
  {id}/
    slug, name, email, scheduledAt, status, notes
```

### Rendering (ISR)

Subdomain sites use Next.js ISR: `export const revalidate = 60` on the `/_sites/[slug]` route, plus `revalidateTag('site:{slug}')` on config writes. Fast for visitors (edge cache hit), cheap for us (no DB hit per visit).

### Custom domains (Vercel Domain API)

Paid-tier flow:
1. User selects a domain in the upgrade step.
2. Backend calls Porkbun (or Cloudflare Registrar) API to check availability + register. Nertia pays cost, passes through with small markup.
3. Backend calls Vercel Domain API to add the domain to the nertia project. Returns required DNS records.
4. Nertia sets records (if Porkbun-owned; auto) or instructs user (if user-owned).
5. Write `domains/{host}` → slug. Custom domain now resolves.

### Generation pipeline (server-side)

`POST /api/generate` is the hot path. Executes server-side, writes Firebase, returns slug.

```
Questionnaire answers
  ↓
step 1  classify brief → pick direction        Haiku 4.5  (cached: library manifest)
step 2  generate palette + type pairing         Haiku 4.5  (cached: direction doc)
step 3  write copy (hero + sections)            Sonnet 4.6 (cached: direction + palette)
step 4  parameterize motion element             Haiku 4.5  (cached: direction)
  ↓
Write sites/{slug} + briefs/{slug} + generations/{id} to Firebase
Revalidate tag site:{slug}
  ↓
Return { slug, url: https://{slug}.nertia.ai } to client
```

**Cost envelope:** With prompt caching on the direction library manifest (~5k tokens) and per-direction docs (~2k tokens each), per-generation cost lands ~$0.02–0.05 using Haiku for most steps and Sonnet only for copy. Sustainable for unlimited free tier.

**Humanize pass:** After copy generation, run the output through a programmatic rules pass (banned phrases list, em-dash normalization, tricolon detection, rhythm checks) before writing to DB. Rules are the ones encoded in the `humanize-text` skill — we port them to a library function in `src/lib/humanize.ts` so they run server-side on every generation. Free-tier copy must not read as AI.

---

## Components

### 1. Marketing shell (`src/app/`)

- `/` — new landing. Replace current butterfly-ring hero (which moves to its own page or gets retired) with zero-point positioning.
- `/generate` — the intake questionnaire form.
- `/pricing` — free tier vs. custom domain tier.
- `/blog` — **keep as-is**. File-based, 4 published posts, hero-image system works.
- `/faq`, `/about`, `/resume` — keep.
- **Retire:** `/generator`, `/generator/history`, `/admin/generations`, `/admin/golden-examples`, `/brand-system`, `/butterfly-test`, `/design-system`. These were for the old thesis.

### 2. Intake questionnaire (`src/app/generate/`)

Short, high-signal form. Every question must either drive art direction, drive copy, or qualify the user. No filler.

Tentative question set (iterate):
1. What's the site for? (business type / personal / portfolio / project)
2. Business / project name
3. One sentence about what you do
4. Who's it for? (audience)
5. Three words that describe the vibe
6. Favorite 2–3 sites (optional, URL inputs)
7. Contact email (optional, unlocks "claim this site" for paid upgrade)
8. Pick a slug or let us generate one

### 3. Generator API (`src/app/api/generate/route.ts`)

Server-side pipeline above. Streams status back to the form UI so the user sees "picking direction... writing copy... generating imagery..." with real content, not fake progress.

### 4. Direction library (`src/directions/`)

Each direction = a folder with:
```
src/directions/zero-point/
  README.md        — aesthetic rules, when to pick this direction
  direction.ts     — metadata: name, tags, slots, palette constraints
  Layout.tsx       — the React component tree with slots
  motion.ts        — motion presets for this direction
  sample.json      — example site config for QA
```

Directions start at ~4 (MVP) and grow to ~12+ over time. First build: **zero-point** (flagship), plus 3 others with different aesthetic territory (e.g. editorial, brutalist, organic). Use `~/code/nertia-template-reference/` as inspiration, NOT as ship-code.

### 5. Site renderer (`src/app/_sites/[slug]/`)

Given a slug, fetches `sites/{slug}` from Firebase, resolves the direction, renders the Layout component with config passed in. Uses Next.js ISR.

### 6. Admin / consult queue (`src/app/admin/`)

Retire old admin. New admin surfaces:
- **Queue** — new free-tier generations (moderation if needed), upgrade requests, booked consults.
- **Consult brief** view per site — questionnaire answers + generated site preview + Scott's notes field.
- **"Promote to paid build"** action — seeds a new Claude Code session/branch with the consult brief (link to skill `promote-to-paid` once authored).

### 7. Site editor (post-generation feedback)

After a user gets their free site, they land on a simple editor: regenerate any section, swap palette, change copy inline. Writes to `sites/{slug}`, triggers ISR revalidation. Keeps them engaged on the free site → higher upgrade conversion.

---

## Data Flow (free-tier happy path)

```
User on /generate
    ↓ submits form
POST /api/generate (stream)
    ↓ server
pick direction (Haiku)       ── stream "picking direction"
generate palette (Haiku)     ── stream "mixing palette"
write copy (Sonnet, humanize)── stream "writing your site"
param motion (Haiku)         ── stream "setting the scene"
    ↓
Firebase write: sites/{slug}, briefs/{slug}, generations/{id}
    ↓
Revalidate tag site:{slug}
    ↓
Return { slug, url } to client
    ↓
Client redirects to {slug}.nertia.ai (or previews inline first)
```

---

## Visual Direction Library — sourcing and cadence

**Source:** Scott builds directions 1–2 per day, using `~/code/nertia-template-reference/` (50 cloned Vercel templates) as inspiration. Templates are reference only — nothing ships as-is.

**NOT source material:** zen-holo, particles.casberry.in, blender/zen-holo production pipeline. Those are Scott's standalone creative IP; they don't bleed into client sites. Three.js *capability* carries over; specific compositions do not.

**MVP library (build in order):**
1. **zero-point** (flagship) — void / vacuum aesthetic, black canvas, one emergent accent color, minimalist scientific typography, single kinetic element. Showcases the product's own language.
2. **editorial** — Kinfolk / Cereal-ish. Serif headlines, generous leading, image-forward.
3. **brutalist** — raw grid, unstyled-feeling, brutal type contrasts, monospace accents.
4. **organic** — warm, hand-drawn-ish, gradient blobs, friendly for small-business / personal.

Each direction: 4–8 hours of Scott time. MVP library ships when 4 are done (~4 days).

**Growth loop:** Every paid build is a chance to abstract a new free-tier direction (with client's consent / after anonymization). Paid clients compound the free-tier library.

---

## Error Handling

- **Generation failure** (API error, timeout, malformed response). Retry once with a fallback model. If still failing, return a curated "starter site" using the requested direction with generic copy — user can edit. Never show a broken state.
- **Slug collision.** Append a short hash if collision. Hashes never exceed 6 chars.
- **Moderation.** Keyword + Anthropic moderation pass on brief before generation. Block obvious abuse (hate, CSAM-adjacent, scam). Non-blocking for edge cases — flag for review in admin.
- **Custom domain verification failure.** Clear error states; keep user in the upgrade flow without loss of progress.
- **Rate limits.** IP-based throttling on `/api/generate` (e.g. 3 generations per 15 min without email; 10 with verified email).

---

## Testing

- **Unit.** `tokensToCss`, slug generator, direction matcher, palette validator, humanize rules.
- **Integration.** Full generation against a fixture set of 10 briefs → assert shape of output (valid direction, valid palette, copy present, no banned phrases).
- **Golden (visual).** Playwright screenshots of rendered sites per direction against fixture configs. Commit screenshots. Flag regressions on PR.
- **Live.** Smoke test of `{slug}.nertia.ai` routing in staging (Vercel preview deploy).
- **Cost.** CI step that records generation cost per fixture; alert if median exceeds budget ($0.05).

TDD applies to the generator pipeline and direction renderer. For visual components, golden screenshots replace unit tests.

---

## Scope — MVP vs later

### MVP (first shippable version)
- Landing (`/`), `/generate` form, `/api/generate`, `/_sites/[slug]` renderer
- 4 directions (zero-point + 3 others)
- Firebase schema (sites, briefs, generations)
- Subdomain middleware + wildcard DNS for `*.nertia.ai`
- Basic admin queue view
- Blog stays as-is

### V1 (post-launch)
- Site editor (post-generation inline edits)
- Consult booking (Cal.com embed)
- Custom domain registrar + Vercel Domain API integration
- Paid-build workflow + `/admin/consult/{slug}` view
- Humanize pass as dedicated service
- Direction library expansion (2 per day)

### V2 (later)
- Paid-build automation assist (skills + agents that speed Scott's bespoke builds)
- Analytics per site
- User login + site management (currently anonymous-first)
- Template / direction marketplace (other designers contribute)

---

## Open Questions

1. Domain registrar API — Porkbun vs Cloudflare Registrar vs Namecheap. Resolve when building V1.
2. Wildcard DNS on `nertia.ai` — verify Vercel's `*.nertia.ai` handling with the current DNS provider. Likely Cloudflare.
3. Anonymous vs forced-login for free tier. Leaning anonymous-first (friction kills conversion), email-gated for save/edit.
4. Site editor depth — full block editor vs section-regenerate-only. MVP: regenerate-only. V1: inline text edits.
5. Moderation threshold — err on the side of generation (false positives lose leads).

---

## Related Memory

- `project_nertia_rebuild.md` — project context
- `project_nertia_zero_point_positioning.md` — positioning + flagship direction rules
- `feedback_nertia_asset_boundary.md` — don't reuse zen-holo / particles / blender IP

## Next Steps

1. User reviews this spec.
2. Generate implementation plan via `writing-plans` skill once approved.
3. Plan likely decomposes into: infra (wildcard DNS, middleware, Firebase schema), generator pipeline, first direction (zero-point), landing + intake, admin queue. Each gets its own sub-plan.
