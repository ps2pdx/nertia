# nertia.ai — Claude Code project guide

You are working on **nertia.ai**, the Zero-Point Website Generator. Read this file every time.

## What we're building

A free AI-generated website offered at `{slug}.nertia.ai` to anyone who wants one. Monetization happens when users upgrade to a custom domain — they buy it through nertia (resold) and begin a paid relationship with Scott for the bespoke build.

"Zero-point" is the positioning and one of the flagship visual directions. It comes from zero-point energy in physics: the vacuum state that's still full of latent potential. Zero cost, zero time, zero baseline — maximum emergent potential.

**This supersedes** the previous "Brand Systems Generator" thesis (old `/generator`, `/admin/golden-examples`, `SCHEMA_V2_INSTRUCTIONS.md`). That code is being retired.

**Canonical design spec:** `docs/superpowers/specs/2026-04-16-zero-point-generator-design.md`. Read it before proposing anything substantive.

## Stack (verify with `package.json`, don't assume)

- Next.js 15 with Turbopack (`npm run dev` / `npm run build` both pass `--turbopack`)
- React 19, TypeScript, Tailwind CSS v4 (CSS-first config)
- **Firebase** Realtime DB + Auth (Google OAuth). **NOT Supabase.** Don't introduce Supabase.
- Anthropic SDK (`@anthropic-ai/sdk`) + OpenAI SDK for generation
- Three.js for motion elements
- `gray-matter` for blog frontmatter
- Deployed to Vercel from `main`

## Repo map

```
src/
  app/                    Next.js App Router
    api/                  server routes (generator lives under /api/generate)
    _sites/[slug]/        subdomain site renderer (to be built)
    generate/             intake questionnaire (to be built)
    blog/, about/, faq/   keep as-is
    design-system/        keep — site's component catalogue (see Design-system components)
    generator/, admin/generations/, admin/golden-examples/,
    brand-system/, butterfly-test/
                          OLD THESIS — retire / delete during pivot
  components/             shared React
  content/blog/           file-based blog posts (gray-matter)
  directions/             visual-direction library (to be built — see spec)
  lib/                    Firebase clients, token utilities, humanize rules
  hooks/, types/, utils/
docs/superpowers/specs/   design specs (start here)
instructions/             OLD pre-pivot product specs (ignore)
SCHEMA_V2_INSTRUCTIONS.md OLD pre-pivot (ignore)
public/                   static assets
```

## Superpowers policy (project-level)

nertia is engineering work on a shipping product. All Superpowers skills are **on** by default:

- `brainstorming` — before any creative work (features, components, behavior)
- `writing-plans` — multi-step tasks before touching code
- `executing-plans` / `subagent-driven-development` — plan execution
- `test-driven-development` — implement code tests-first
- `verification-before-completion` — run checks before claiming work done
- `systematic-debugging` — for any bug, test failure, unexpected behavior
- `requesting-code-review` / `receiving-code-review` — before merging
- `dispatching-parallel-agents` — for 2+ independent tasks
- `using-git-worktrees` — when feature work needs isolation
- `writing-skills` — if you're creating a new skill
- `simplify` — code quality pass after changes

This is different from the Vantage repo (PMM content work, where engineering skills are opt-out). Do NOT apply Vantage's opt-out policy here.

## Asset boundary — important

nertia's visual-direction library must be purpose-built for this product. **Do not** pull from:

- zen-holo (Scott's ambient 3D YouTube channel)
- particles.casberry.in (Scott's WebGL particle platform)
- Blender / zen-holo production pipeline outputs

Those are Scott's standalone creative IP. Three.js *capability* carries over; specific compositions (butterfly ring, zen-holo loops, particle swarm presets) do not. Start each direction from a blank sheet tuned to nertia's brand.

## Visual direction library

Directions live in `src/directions/{name}/`. Each direction is a React component tree with slots + metadata (see spec §Components, §Visual Direction Library).

**Reference library:** `~/code/nertia-template-reference/` contains ~50 MIT-licensed Vercel templates for inspiration. `INDEX.md` there groups them by category. Use as reference only — nothing ships as-is.

**Cadence:** Scott builds 1–2 directions per day. MVP launches with 4 directions (zero-point flagship + 3 others).

## Design-system components

`/design-system` (`src/app/design-system/page.tsx`) is this site's canonical component catalogue — colors, typography, icons, buttons, cards, tags, alerts, banners, form elements, tables, motion, data viz, logo/grid/voice. It renders live instances of everything reusable.

**When building or polishing any page**, reach for components from `/design-system` first — don't rebuild UI primitives ad-hoc. If a page is introducing styling that mirrors something already in the catalogue, refactor to use the catalogued component.

**When introducing a new reusable component**, add a rendered instance to `/design-system` in the appropriate section so it stays discoverable. If a section doesn't exist for what you're adding, create one (and register it in the sidebar `sections` array at the top of the page).

This keeps the site's visual language coherent, prevents drift between pages, and gives anyone auditing the design language a single place to look.

## Blog convention

Blog posts and drafts both live in **Firebase RTDB** under `notepad/posts/{slug}` and `notepad/drafts/{id}` (as of 2026-04-21). The public `/blog` route renders from RTDB; drafts are managed via the phone-accessible admin at `/admin/notepad`. Frontmatter fields persist as RTDB columns: `title, description, date, slug, hero, tags, body, status, source, source_session_id, authored`.

File-based content (`src/content/blog/*.md`, `src/content/blog-candidates/*.md`) and the `/admin/blog` route are **being retired** during the migration. Existing markdown posts are one-time imported into RTDB. Hero images continue to live in `public/blog/` and are referenced by path.

The notepad pipeline (`~/.claude/skills/notepad/bin/notepad-sync`) pushes local session drafts directly to `notepad/drafts/*` in RTDB. Approval and publish happen from `/admin/notepad` on any device.

## Environment

Required env vars (document them in `.env.example`):
```
ANTHROPIC_API_KEY
OPENAI_API_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_DATABASE_URL
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
USE_DEMO_MODE              # bypasses real generation, useful in tests
```

## Session bootstrap

Run `/zp-init` to load current project state, check the active branch, and surface what's in flight. Define in `.claude/commands/zp-init.md` — keep it up to date as the project evolves.

## Branching + PR policy (binds agents)

**Agents never commit to `main` directly.** Every unit of work — a feature, a fix, a refactor, a docs change — lands on its own branch and ships via a pull request that Scott reviews and merges.

This matters because `main` deploys to Vercel automatically, multiple agent sessions may run concurrently in different tabs, and direct-to-main pushes have caused regressions + merge conflicts during this project's history. Branches + PRs keep agents out of each other's way and give Scott an approval gate.

**At session start, verify your branch:**
```
git rev-parse --abbrev-ref HEAD
```
If it reports `main`, branch immediately before any commit:
```
git checkout -b <type>/<kebab-topic>
```

**Branch naming** (lowercase, hyphenated):
- `feature/<topic>` — new capability
- `fix/<topic>` — bug or regression
- `refactor/<topic>` — internal change, no user-visible behavior delta
- `docs/<topic>` — docs-only (spec, plan, CLAUDE.md)
- `chore/<topic>` — dependency bumps, cleanup, tooling
- `spec/<topic>` + `plan/<topic>` — when the only artifact is a `docs/superpowers/specs/...` or `docs/superpowers/plans/...` file

**Multi-phase plans stay on one branch.** If an implementation plan has 5 phases, all 5 land as commits on the same branch, then one PR for the whole thing. Don't open a PR per phase.

**PRs open via `gh pr create`** using the format in this file's commit-message guidance. The body explains what changed and why; the title is scoped-prefix + one-line summary. Do not merge your own PRs — Scott merges.

**Concurrent agent sessions** (e.g. zero-point intake in one tab, notepad publishing in another): **each session must own its own git worktree**, not share the main checkout. Sharing the working tree across sessions caused HEAD to flip between branches mid-session twice during the 2026-04-21/22 work (one session's `git checkout` would silently move the other session's shell onto a different branch, leading to stale files, "banner still there" confusion, and near-destructive resets).

Create a worktree for new feature work:
```
# from the main checkout at ~/code/nertia
git checkout main && git pull
git worktree add .worktrees/<branch-name> -b <branch-name>
cd .worktrees/<branch-name>
# run your dev server / edits from here
```

Remove it after the PR merges:
```
cd ~/code/nertia                              # back to main checkout
git worktree remove .worktrees/<branch-name>
git branch -D <branch-name>                   # local branch cleanup
```

The `.worktrees/` directory is gitignored. Each worktree has its own `.next/` cache, so parallel dev servers don't corrupt each other's builds. Run each session's `npm run dev` from inside its worktree, and the dev server + file watches stay scoped to that branch.

Before editing a file in a shared area (e.g. `src/sections/`, `src/compositions/`, `CLAUDE.md`), still check `git log -1 --pretty=format:'%h %s' -- <path>` to see recent commits from other sessions' branches and coordinate via Scott.

**Exceptions — agents may push to `main` only when:**
- Scott explicitly says "push to main" or "skip the PR" for this task
- A prior PR merged, and the agent is pulling main into its own workspace (not committing to main)
- A merge conflict fix on an already-open PR requires a force-push to the PR branch (not main)

**Scott's own terminal commits to main remain his call** — this policy binds agents, not humans.

## Things to never do

- **Commit to `main` as an agent.** Always branch + PR (see Branching + PR policy above).
- Introduce Supabase (we use Firebase).
- Recycle zen-holo / particles / blender assets into nertia templates.
- Ship raw free React templates from the reference library as-is.
- Resurrect `/generator`, `/admin/golden-examples`, or "design tokens" product language in new work.
- Commit `.env*` files. `.env.local` stays uncommitted.
- Use `--no-verify` on git commits unless Scott explicitly asks.
