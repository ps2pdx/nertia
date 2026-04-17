# Direction scaffold

Quick reference for adding a new visual direction to `src/directions/`.

Canonical source: `.claude/skills/build-direction/SKILL.md`. This file is the in-code mirror so contributors don't have to leave the repo to find the pattern.

## What a direction is

A purpose-built React component tree with slots. The AI art-director fills the slots per site. Each direction claims an aesthetic territory (zero-point / editorial / brutalist / organic / etc.) and enforces palette + motion constraints appropriate to that territory.

## Required files

```
src/directions/{name}/
  README.md                 aesthetic rules, when to pick, forbidden patterns, reference starters
  direction.ts              typed metadata (name, tags, palette constraints, slot schema, motion, status)
  Layout.tsx                React component tree with slots — takes site: SiteConfig, renders page body
  motion.ts                 motion presets (framer-motion variants, Three.js params if any)
  sample.json               example SiteConfig for local QA + golden screenshots
  __tests__/Layout.test.tsx unit test: renders all slots, degrades gracefully
```

Plus registration:

```ts
// src/directions/index.ts
import { direction as myDirection } from "./{name}/direction";
// add to directions: Record<string, Direction>
```

## direction.ts contract

Typed as `Direction` from `./types.ts`. Required fields:

- `name` — kebab-case, matches folder
- `displayName` — human label
- `tags` — searchable facets (`["minimal", "dark", "editorial", ...]`)
- `paletteConstraints` — `{ mode, accentCount, backgroundBias, saturation }`
- `slotSchema` — what the hero + sections can contain
- `motion` — `{ variant, intensity }`
- `status` — `"draft"` while cooking, `"stable"` when shippable

Ship `status: "draft"` rather than rush. The picker only considers stable directions.

## Layout.tsx contract

- One prop: `site: SiteConfig` (from `src/directions/types.ts`).
- No `<html>` / `<body>` — those live in the site renderer.
- No hardcoded copy. Every string reads from `site.copy`.
- No hardcoded colors except neutral structural tokens. Palette values read from `site.palette` as CSS variables at root.
- No images unless `site.images.*` is provided. Must degrade gracefully without.
- SSR/ISR-safe. No client-only globals in the render path.

## sample.json contract

Covers edge cases, not just the golden path:

- Missing `images.hero`
- Long copy (200+ char headline, 500+ char body)
- Short copy (5-word headline, one-line body)
- `sections` at `min` and at `max` of `slotSchema.sections`
- Palette at both extremes of `paletteConstraints.saturation`

One `sample.json` per direction; it's the fixture for the golden screenshot and the humanize test.

## Checklist (mirrors build-direction skill)

- [ ] Read spec §Visual Direction Library + §Components §4
- [ ] Picked a reference template from `~/code/nertia-template-reference/INDEX.md`, noted in `README.md` as inspiration only
- [ ] Declared aesthetic territory + forbidden patterns in `README.md`
- [ ] Built `direction.ts` with full metadata + `status`
- [ ] Built `Layout.tsx` with slot-based rendering, no hardcoded copy/colors
- [ ] Wrote `sample.json` covering the edge cases above
- [ ] Added `__tests__/Layout.test.tsx` — renders all slots, no-image fallback, min/max sections
- [ ] Ran `humanize-text` rules against `sample.json.copy` — no banned phrases
- [ ] Registered in `src/directions/index.ts`
- [ ] Golden screenshot committed to `__goldens__/{name}/`
- [ ] Verified SSR/ISR render (no client-only globals)

## Asset boundary (repeat, because it matters)

Directions are purpose-built for nertia. **Do NOT** reuse:

- zen-holo compositions (YouTube channel)
- particles.casberry.in presets (WebGL platform)
- Blender / zen-holo pipeline outputs

Three.js *capability* carries over. Specific compositions do not. Start each direction from a blank sheet tuned to nertia's brand.

## Cadence

One direction ≈ one day of focused work. Taste is the moat; rushing dilutes the library. If it feels half-baked, mark `status: "draft"` and ship the stable ones first.
