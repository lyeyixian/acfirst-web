# SKETCH: what `border-collie init` would write into this repo

**Throwaway.** This branch (`prototype/border-collie-init-sketch`) exists to
answer one question on border-collie's v2 roadmap map: *how large is the
foundation rung, really?* It is a prototype — a concrete artifact to react to,
not a proposal to merge. Nothing here is wired to anything; the version string
`0.6.0-sketch` names a release that does not exist.

Resolves [border-collie#129](https://github.com/lyeyixian/border-collie/issues/129).
Map: [border-collie#125](https://github.com/lyeyixian/border-collie/issues/125).

**This branch is the snapshot as built, not as decided.** The open questions
below were answered on the ticket, and four of them went the other way — read
[the resolution comment](https://github.com/lyeyixian/border-collie/issues/129#issuecomment-5302638690)
for what was actually settled. In short: `border-collie.json` is deleted rather
than written, the skills are the mattpocock defaults vendored via skills.sh
rather than the three hand-written ones here, `border-collie-gates.yml` should
not be scaffolded at all, and the file set as a whole is deferred until after
border-collie's own architecture change.

## The files

| File | What it is |
| --- | --- |
| `WORKFLOW.md` | The contract. Symphony's four hooks verbatim, plus five named `verify:` commands. |
| `border-collie.json` | Run config — caps, timeouts, working hours. |
| `.claude/skills/{implement,tdd,code-review}/SKILL.md` | Repo-owned Worker skills. No marketplace plugin on the runner. |
| `.github/workflows/border-collie-{tick,worker,gates}.yml` | CI wiring. |
| `playwright.config.ts`, `e2e/` | The e2e skeleton and the app-boot recipe. |
| `CLAUDE.md`, `CONTEXT.md`, `docs/adr/`, `docs/agents/` | Docs layout. |

## Cost, measured

Ran on this repo at `73cc9ac`, node 26 / npm 11 (CI pins 18.20.8):

| Step | Result |
| --- | --- |
| `npm ci` | exit 0, 11s, 1241 packages |
| `npm run typecheck` | exit 0 |
| `npm run lint` | exit 0 — 18 warnings, 0 errors |
| `npm test -- --run` | exit 0 — 48 files, 218 tests, 4s |
| `npm run build` | exit 0, 601ms |
| `npx playwright test` | **not run** — Playwright is not a dependency of this repo |

So the tally per component:

| Component | Cost here |
| --- | --- |
| Workspace hooks | ~zero. `npm ci` works, `.env.example` exists. |
| `verify:` — 4 of 5 commands | **~zero. They already exist and already pass.** Writing them down is five lines of YAML. |
| Skills in-repo | Small — three files. But see Q1. |
| CI wiring | Small, and *duplicative* — `ci-cd.yml` already runs four of the five on every PR. |
| Docs layout | Cheap to scaffold, expensive to fill. `init` can write the headings; only the operator can write what a Cart is. |
| **e2e + app boot** | **The entire cost.** Everything else rounds to zero next to it. |

## Why e2e is the whole cost on this stack

This app has no data. Every route loads from Strapi (`app/models/*.server.ts` →
`fetchApi` → `STRAPI_URL_BASE`). To boot it at all, something must answer on
:1337. Three options, none free:

1. **Stub it** (what this sketch does — `e2e/stub-strapi.mjs`). The home route
   walks `contentSection` and switches on `__component`, reaching through
   nested `data.attributes` envelopes down to media URLs. That is one hand-
   recorded fixture *per page slug*, and each goes stale whenever the CMS
   content model changes. The stub logs `MISS` for every unfixtured path — that
   log is the running cost.
2. **Run the real Strapi** — `acfirst-strapi`, a second repo, with a database
   and seed data. Now the harness spans two repos, and the one-instance-per-repo
   deployment decision starts to bite.
3. **Intercept at the `fetchApi` seam** (MSW or a vi.mock). Cheapest, but it is
   no longer end to end: it verifies the render, never the boot.

The existing unit tests already do (3) with `vi.mock`, at 218 tests' worth of
coverage. **Which raises the real question: does the foundation rung need e2e
on this repo at all, or does "the app boots and its named checks pass" suffice?**

## Open questions this sketch surfaced

1. **Skill closure.** `implement` calls `/tdd` and `/code-review`, so `init`
   must scaffold the transitive closure, and every scaffolded skill is a fork
   that will drift from the marketplace original. Does `init` own three skills
   forever, or one that inlines what it needs?
2. **Which of `verify:` gates a merge?** The two-tier decision says
   border-collie may only gate on `verify:` — it does not say all of it does.
   `lint` here has 18 warnings and exits 0; if `e2e` is flaky, is it a gate or
   just a command a Worker runs?
3. **`init` cannot edit `package.json`.** Write-once-never-overwrite means no
   `test:e2e` script, so `verify:` names raw commands (`npx playwright test`).
   Accept that, or does `init` get to patch a JSON file it did not write?
4. **`init` generates a gates workflow that duplicates `ci-cd.yml`.** Generate
   anyway, or detect existing CI and print a checklist instead?
5. **`CLAUDE.md` vs `AGENTS.md`.** This repo had `AGENTS.md`. The sketch writes
   a `CLAUDE.md` pointing at it. Pointer, or write nothing?
6. **Merging ships to production.** `ci-cd.yml` deploys to Fly on every push to
   `main`. An autonomous merge is an autonomous deploy — on a real storefront
   with a checkout flow. That is a rung-ordering fact, not a config detail.
7. **Two node versions in the Worker job** — 24 for the CLI, 18.20.8 for the
   repo. Does the toolchain belong to the hooks or to the scaffolded workflow?

## The finding, in one line

The prediction going in was that this stack sits at the expensive end of the
foundation rung. **Half wrong**: the lint/typecheck/test/build tier is already
there and costs nothing to declare. The rung's cost on this repo is one thing
only — booting an app whose every screen needs a CMS behind it.
