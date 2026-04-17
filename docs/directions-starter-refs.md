# MVP Direction — Starter References

Mapping of Vercel-template-reference picks to the 4 MVP visual directions. Reference only; nothing ships as-is (see `CLAUDE.md` asset boundary).

Clone locations: `~/code/nertia-template-reference/repos/{name}/`.

---

## 1. zero-point (flagship)

**Aesthetic:** Void / vacuum. Near-black canvas, one emergent accent color, minimalist scientific typography, single kinetic element. Coiled energy in emptiness.

**Forbidden:** gradients across the whole canvas, multi-color palettes, busy hero, any "tech-bro" visual cliché.

**References:**
- `chatbot` — clean dark Apache-2.0 starter with shadcn; good base for dark-mode structural tokens.
- `ai-sdk-reasoning-starter` — minimal dark reasoning-display UI; reference for "suggestive motion" in text.
- `motion-primitives` — pick one low-intensity primitive for the kinetic element (breath, pulse, orbit).
- `background-snippets` — scan for a subtle monochrome noise/grid pattern.

**Approach:** Start from `chatbot`'s base theme system, strip chat UI entirely, build a marketing-layout shell around it. The direction is defined by **restraint** — fewer elements, sharper type, more negative space than feels right.

---

## 2. editorial

**Aesthetic:** Kinfolk / Cereal / It's Nice That magazine. Serif headlines, generous leading (1.7+), image-forward, warm off-white background, slow fade transitions. Reads like a printed spread.

**Forbidden:** sans-serif display type, aggressive CTAs, dark mode.

**References:**
- `next-mdx-blog` (Lee Robinson) — canonical editorial feel. Unlicensed, so reference only — do not copy code.
- `sanity-template-nextjs-clean` — clean typographic blog layout.
- `vercel-examples-portfolio-blog` — MIT-licensed portfolio/blog starter, safe to cannibalize patterns.
- `vercel-nextjs-cloudinary-gallery` — image-forward grid patterns.

**Approach:** Start from `vercel-examples-portfolio-blog` (MIT), swap the type system to a serif pairing (e.g. Fraunces + Inter), widen the measure, introduce Cloudinary-style image blocks between sections.

---

## 3. brutalist

**Aesthetic:** Raw grid, unstyled-feeling, monospace accents, harsh type contrasts (huge display next to tiny body), single bold accent color on pure white or pure black. Reads like early Wired or a Werkstatt poster.

**Forbidden:** rounded corners, subtle animations, gradients of any kind.

**References:**
- Catalog has no explicitly brutalist template — this direction is mostly from-scratch.
- `taxonomy` (shadcn) — use as a typography + spacing *base* then invert stylistic assumptions.
- `next-mdx-blog` — reference the tight grid, not the softness.

**Approach:** Build from the Tailwind primitives directly. Use one display weight at 200pt+ against one monospace at 10pt. Grid lines visible. One color (e.g. cadmium red) as the only non-monochrome element. Allocate an extra half-day — this direction has the least reusable starter code.

---

## 4. organic

**Aesthetic:** Warm, friendly, approachable. Gradient blobs, hand-drawn-feel accents (SVG), fluid motion. Palettes lean peach / sage / terracotta. Rounded everything. Feels welcoming to a small-business or personal-brand user.

**Forbidden:** dark mode, hard geometric shapes, monospace anywhere.

**References:**
- `magicui` — animated components; several fluid/organic motion primitives to pick from.
- `precedent` (Steven Tey) — MIT, Framer Motion hero patterns with a warmer vibe.
- `background-snippets` — filter to gradient/blob patterns.
- `before-and-after` (Apache-2.0) — good for a "show transformation" section, natural fit for organic direction.

**Approach:** Start from `precedent` (MIT, Framer Motion ready), replace the cool palette with warm tones, swap the hero motion for a blob-morph primitive from `magicui`. Use Framer Motion's spring physics throughout.

---

## Order of build

Scott's cadence is 1–2 directions per day.

1. **zero-point** first — it's the flagship and also the easiest to nail (restraint is cheap).
2. **editorial** next — most reusable starter code, fastest to ship.
3. **organic** third — larger scope (motion + palette + illustration).
4. **brutalist** last — least starter code, most from-scratch, save for when the library system is fully debugged.

MVP lands when all four are in `src/directions/` with `status: "stable"`, passing golden screenshots, and their sample.json renders cleanly.
