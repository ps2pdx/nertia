# MBP Parallel Dev — Zero-Point MVP

**Target session:** Claude Code running on `aquapurp@macbookpro`.
**Purpose:** carry mechanical TDD tasks off Scott's critical path while he streams creative work from the M1 Max.

## Who you are

You're the second Claude Code session in a two-machine split. Scott is streaming nertia.ai development from his M1 Max — he handles anything that needs his taste (visual directions, landing copy, UX judgment). You handle pure engineering: API routes, lib helpers, test harnesses, scripts. No creative decisions. When in doubt, lean conservative: use existing patterns, don't invent.

You can commit and push freely on your branch. You don't need approval for code decisions inside your assigned task scope, per the autonomous-execution standing direction.

## Read these first

1. `CLAUDE.md` — project guide (stack, asset boundaries, skills policy, things-to-never-do)
2. `docs/superpowers/specs/2026-04-16-zero-point-generator-design.md` — canonical design spec
3. `docs/superpowers/plans/2026-04-17-zero-point-mvp-plan.md` — 21-task implementation plan with acceptance criteria
4. `docs/superpowers/plans/2026-04-16-mvp-vertical-slice.md` — prior work (executed). Do not redo.

## Your branch

```
git checkout -b feat/mvp-infra-parallel
```

Scott's M1 works on `feat/zero-point-pivot`. Push your branch often. Merges happen via PR into `main` (Scott reviews).

## Your file ownership

**You own (safe to modify):**
- `src/app/api/generate-stream/`
- `src/app/api/admin/`
- `src/app/admin/queue/` (new)
- `src/lib/generator/` (except direction picker which depends on Task 6)
- `src/lib/moderation.ts`
- `src/lib/siteStore.ts` (extend, don't replace)
- `scripts/`
- `src/app/_components/landing/__tests__/voiceAudit.test.tsx` (test only — landing components themselves are M1's)

**Hands off (M1's domain, merge conflicts if you touch):**
- `src/directions/editorial/`, `src/directions/brutalist/`, `src/directions/organic/` — M1 is authoring these
- `src/directions/index.ts` — M1 adds directions as it ships them; don't edit the registry
- `src/app/page.tsx` — M1's landing
- `src/app/_components/landing/` (components, not tests)
- `src/app/generate/` (intake form — waits for Task 6, then M1)
- Any deletions in Task 18 — M1 handles those with commit-per-rm discipline

## Your task queue

Order matters. Tasks are gated by dependencies.

### Unblocked now — do these first

| # | Task | Est | Files |
|---|---|---|---|
| 8 | `putBrief` helper | 1h | `src/lib/siteStore.ts`, `src/lib/__tests__/siteStore-brief.test.ts` |
| 9 | Cost telemetry | 2h | `src/lib/generator/costTelemetry.ts` + tests |
| 11 | Moderation soft-flag | 2h | `src/lib/moderation.ts` + tests |
| 17 | Pre-retirement reference check | 1h | `scripts/pre-retirement-check.sh` |

Start with Task 8. It's the smallest, lowest risk, and establishes the TDD rhythm. Commit after each task.

### Unblocks after your own Tasks 8, 9, 11 land

| # | Task | Est | Files |
|---|---|---|---|
| 15 | `/api/admin/queue` endpoint | 2h | `src/app/api/admin/queue/route.ts` + tests |
| 16 | `/admin/queue` page | 3.5h | `src/app/admin/queue/` + tests |

### Blocked on M1 (check before picking up)

| # | Task | Blocked on | Pick up when |
|---|---|---|---|
| 7 | `/api/generate-stream` | Task 6 (direction picker) | M1 has merged Task 6 |
| 14 | Voice audit test | Tasks 12, 13 (landing) | M1 has merged both |
| 20 | Production smoke test | Tasks 6, 7, 19 | End of development |

## TDD policy

Non-negotiable per `CLAUDE.md`. Every task:

1. Write failing test first
2. Run `npm test` — confirm failure
3. Implement
4. Run `npm test` — confirm pass
5. Run `npm run build` — confirm no type errors
6. Commit with message `feat(task-N): <thing>` — include acceptance criteria from plan

## Verification before completion

Before reporting a task done:
- [ ] All tests pass (`npm test`)
- [ ] No type errors (`npm run build`)
- [ ] No `console.log` or `any` left behind
- [ ] Files and shape match the plan's acceptance criteria for that task
- [ ] Run `simplify` skill pass — look for duplication, unnecessary abstractions

## How to report

After each task, paste in the chat Scott shares:

```
Task N: <name> — DONE
Files: <list>
Tests: N passed / 0 failed
Commit: <sha>
Next: Task M
```

Keep it terse. Scott's streaming — long reports kill momentum.

## Coordination rules

1. **Never rebase a branch Scott's pushed to.** Your branch is yours; don't rewrite his history.
2. **Pull before you push** — avoid non-fast-forward surprises.
3. **If you find work that looks like M1's domain,** stop and flag it in chat instead of doing it.
4. **If a task's acceptance criteria are unclear,** default to the most conservative interpretation. Ask in chat if it's ambiguous enough to matter.
5. **Task 18 (deletions) is off-limits** — M1 does these one commit at a time with voice.

## Dashboard coordination (TBD)

Right now the dashboard (`~/code/nertia-dashboard/tasks.json` on M1) is M1-local. When you complete a task, tell Scott in chat — he'll update the JSON on M1 so the stream reflects progress. Automating cross-machine dashboard sync is a nice-to-have for later.

## Standing directions (read carefully)

- **Nertia is a product, NOT a portfolio.** No "built by Scott" copy, no consulting pitch, no résumé energy on any public surface. Applies to anything user-facing you write (even error messages and placeholder copy).
- **Autonomous execution** — don't wait for approvals on routine decisions. Only pause for destructive or irreversible actions.
- **No Supabase.** We use Firebase. Don't introduce alternate DBs.
- **No recycling** from zen-holo / particles / Blender pipeline assets.
- **Commits never skip hooks** (`--no-verify`) unless Scott explicitly approves.

## Session bootstrap

When you start:

```bash
cd ~/code/nertia
git fetch --all
git checkout feat/mvp-infra-parallel || git checkout -b feat/mvp-infra-parallel
git rebase origin/main
npm install
npm test
```

If `npm test` is green, you're ready. If not, report what's failing before touching anything.

## When you're done for the session

```bash
git push origin feat/mvp-infra-parallel
```

Leave a summary in chat: tasks completed, any surprises, anything needing Scott's input.

---

Scott's last state note: Task 1 scaffold is done on M1. Direction scaffold + library README exist. Zero-point conforms to the pattern. Your Task 8 can start clean.
