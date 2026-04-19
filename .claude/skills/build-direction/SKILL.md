---
name: build-direction
description: Use when authoring a new visual direction in src/directions/ for the nertia.ai free-tier library. Enforces the slot model, palette constraints, and cadence rules from the design spec. Triggers when creating or modifying any folder under src/directions/.
---

# Build a nertia visual direction

A visual direction is a purpose-built React component tree with slots that the AI art-director fills per site. The library ships with 4 directions at MVP and grows to ~12+ over time (1–2 per day cadence).

## Before you start

1. **Read the spec.** `docs/superpowers/specs/2026-04-16-zero-point-generator-design.md` — section "Visual Direction Library" + "Components §4".
2. **Enforce the asset boundary.** Do NOT reuse zen-holo, particles.casberry.in, or Blender-pipeline compositions. Three.js capability is fair game; specific compositions are not.
3. **Pick a reference, not a template.** Browse `~/code/nertia-template-reference/INDEX.md` for inspiration. Do not copy. Abstract the *principle*.
4. **Confirm the aesthetic slot.** What territory is this direction claiming that the existing directions don't? (Check `src/directions/*/README.md` — each direction declares its territory.)

## Structure

Every direction lives at `src/directions/{name}/` and contains:

```
src/directions/{name}/
  README.md          aesthetic rules, when to pick this direction, forbidden patterns
  direction.ts       metadata: name, tags, palette constraints, slot schema
  Layout.tsx         React component tree — receives config, renders site
  motion.ts          motion presets (framer-motion variants, Three.js params if any)
  sample.json        example site config for local QA and golden screenshots
```

## direction.ts shape

```ts
import type { Direction } from "@/directions/types";

export const direction: Direction = {
  name: "zero-point",
  displayName: "Zero-Point",
  tags: ["minimal", "scientific", "dark", "kinetic"],
  paletteConstraints: {
    mode: "dark",
    accentCount: 1,
    backgroundBias: "near-black",
    saturation: "muted-to-vivid-accent"
  },
  slotSchema: {
    hero: { eyebrow: true, headline: true, sub: true, cta: true },
    sections: { min: 2, max: 5, types: ["feature", "quote", "cta"] }
  },
  motion: { variant: "breath", intensity: "low-to-medium" }
};
```

## Layout.tsx contract

- Accepts one prop: `site: SiteConfig` (typed from `src/lib/types.ts`).
- Renders the full page (no `<html>` / `<body>` — those live in the site renderer).
- No hardcoded copy. Every string comes from `site.copy`.
- No hardcoded colors except neutral structural tokens. Palette tokens come from `site.palette` and are applied as CSS variables at the root.
- No images unless `site.images.*` is provided (direction must degrade gracefully without).

## Cadence rule

One direction is a day of focused work. **Do not rush.** The competitive moat is taste; a rushed direction dilutes the library. If a direction feels half-baked, mark its `direction.ts` with `status: "draft"` and ship the other directions first.

## Checklist

- [ ] Read the spec sections above
- [ ] Picked a reference template (listed in a comment in `README.md`)
- [ ] Declared the aesthetic territory in `README.md`
- [ ] Built `direction.ts` with full metadata
- [ ] Built `Layout.tsx` with slot-based rendering only
- [ ] Wrote `sample.json` that covers edge cases (missing images, long copy, short copy, 2 sections, 5 sections)
- [ ] Ran local preview with the sample config and captured a screenshot
- [ ] Ran `humanize-text` rules against sample.copy to verify no banned phrases leaked in
- [ ] Added direction to `src/directions/index.ts` manifest
- [ ] Golden screenshot committed to `__goldens__/{name}/`
- [ ] Verified the direction renders without JS (SSR/ISR-safe)
