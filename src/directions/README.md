# Directions — nertia's visual library

Each direction is a purpose-built React component tree with slots. The generator classifies a brief, picks a direction, parameterizes the palette + copy + motion, and renders.

This is the competitive moat. LLMs are bad at inventing layouts from scratch. Curated primitives + AI as art director beats pure-LLM generation at the same cost.

## Currently shipped

| Name | Status | Territory |
|---|---|---|
| [zero-point](./zero-point/) | stable | void / vacuum — tech / AI / research / high-concept brands |

MVP target: 4 directions (zero-point flagship + 3 more). See the implementation plan at `docs/superpowers/plans/2026-04-17-zero-point-mvp-plan.md`.

## Adding a direction

Read [`_scaffold.md`](./_scaffold.md) for the pattern + checklist. The canonical source is the `build-direction` skill at `.claude/skills/build-direction/SKILL.md` — `_scaffold.md` is the in-code mirror.

Before starting a new direction: check the aesthetic territory map above so the new one is not redundant with what's shipped.

## Structure

```
src/directions/
  _scaffold.md           pattern + checklist (this folder's contributor guide)
  README.md              you are here
  types.ts               shared types: Direction, SiteConfig, Palette, Copy, MotionConfig
  index.ts               registry + getDirection / listStableDirections
  __tests__/             cross-direction tests (registry validation, type conformance)
  {name}/                one folder per direction — see _scaffold.md
```

## Reference library

`~/code/nertia-template-reference/` holds 122 cataloged OSS templates as inspiration only. Nothing ships as-is — abstract the *principle* and build fresh. See `INDEX.md` in that repo for curated picks organized by category.
