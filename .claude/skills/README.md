# Custom skills for nertia.ai

This directory holds project-specific skills for the Zero-Point Website Generator. Each skill is a folder with a `SKILL.md` file.

## Policy

- Author skills from **real workflow pain**, not speculation. If a workflow is run only once, don't write a skill for it.
- When a workflow is run 3+ times and has a rhythm, encode it here.
- Skills here are automatically discovered by Claude Code when working in this repo.

## Current skills

| Skill | When to use |
|---|---|
| `build-direction` | Authoring a new visual direction in `src/directions/` — use this to keep directions consistent with the spec's slot model. |

## Future skills (candidates — author when the workflow appears)

- `generate-site-locally` — run the generator pipeline against a fixture brief without the web form (for testing).
- `evaluate-generation` — visual regression of a generated site against its golden screenshot.
- `publish-from-notepad` — move a draft from `~/notepad/drafts/` into `src/content/blog/`, fill frontmatter, commit.
- `new-blog-post` — scaffold a blank blog post with correct frontmatter.
- `promote-to-paid` — given a free-tier slug, seed a new branch + Claude session with the consult brief for the paid build.
- `zero-point-copy-check` — run any UI/marketing copy through the humanize-text rules and the nertia brand voice guide.
- `add-custom-domain` — walk through Porkbun + Vercel Domain API binding for a paid-tier site.

## Adding a skill

1. Create a folder: `.claude/skills/{skill-name}/`
2. Write `SKILL.md` with frontmatter `name` and `description`, followed by the skill body.
3. Reference the existing `superpowers:writing-skills` skill for structure.
4. Commit. Claude Code auto-loads it in subsequent sessions.
