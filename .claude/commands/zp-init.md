---
description: Bootstrap a nertia.ai session — load the spec, show branch state, surface MVP progress
---

You are starting a session in the nertia.ai repo. Do these in order:

1. **Load context**
   - Read `CLAUDE.md` at the repo root.
   - Read the latest design spec in `docs/superpowers/specs/` (pick the newest filename).
   - Check auto-memory: `project_nertia_rebuild.md`, `project_nertia_zero_point_positioning.md`, `feedback_nertia_asset_boundary.md`.

2. **Show repo state**
   - Run `git status` and `git branch --show-current`.
   - Run `git log --oneline -10` on the current branch.
   - Flag if there are uncommitted changes or if current branch has diverged from `main`.

3. **Check MVP progress**
   - List which of these exist and are non-stub:
     - `src/app/generate/` (intake form)
     - `src/app/api/generate/` (generator API)
     - `src/app/_sites/[slug]/` (site renderer)
     - `src/directions/zero-point/` (flagship direction)
     - `src/lib/humanize.ts` (humanize-text rules)
     - `middleware.ts` (subdomain routing)
   - Note what still needs to be built toward MVP.

4. **Verify reference library** is present
   - `ls ~/code/nertia-template-reference/ | head`. Warn if empty or missing.

5. **Play start sound**
   - `afplay ~/Music/cs16/lets_move_out.wav &` (per Scott's preference).

6. **Summarize**
   - One short paragraph: where we are, what the spec says the next step is, what's blocking. Keep it under 150 words.
   - Do NOT start implementation. Wait for Scott to direct the session.
