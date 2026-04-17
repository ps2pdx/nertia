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
    generator/, admin/generations/, admin/golden-examples/,
    brand-system/, butterfly-test/, design-system/
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

## Blog convention

Blog posts are markdown files in `src/content/blog/*.md`, loaded via `getAllPosts()` / `getPostBySlug()` in `src/lib/blog.ts`. Frontmatter: `title, description, date, hero, tags`. Hero images live in `public/blog/`. 4 posts published as of 2026-04-16.

Blog stays file-based. Do not migrate to a DB. The `/admin/blog` BTS route reviews notepad-pipeline drafts from `src/content/blog-candidates/` before promoting to `src/content/blog/`.

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

## Things to never do

- Introduce Supabase (we use Firebase).
- Recycle zen-holo / particles / blender assets into nertia templates.
- Ship raw free React templates from the reference library as-is.
- Migrate the blog to a database.
- Resurrect `/generator`, `/admin/golden-examples`, or "design tokens" product language in new work.
- Commit `.env*` files. `.env.local` stays uncommitted.
- Use `--no-verify` on git commits unless Scott explicitly asks.
