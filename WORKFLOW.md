---
# Written by `border-collie init` (v0.6.0-sketch) on 2026-08-15.
# Owned by this repository from here on: `init` never overwrites it.
#
# Two tiers, and only two:
#   hooks:  Symphony's four workspace lifecycle hooks, verbatim. They give a
#           Worker its environment. border-collie runs them; it does not read
#           their output.
#   verify: named commands with meaningful exit codes. border-collie may gate
#           only on these. Nothing here is parsed — only its exit status.
tracker:
  kind: github
  repo: lyeyixian/acfirst-web

hooks:
  # Runs once, when a workspace directory is newly created (a git worktree on
  # the local path; a job checkout on the cloud path). Fatal on failure.
  after_create: |
    npm ci --no-audit --no-fund
    [ -f .env ] || cp .env.example .env
    npx playwright install --with-deps chromium

  # Runs before each Attempt, after workspace preparation. Fatal on failure.
  # Cheap on purpose: it must not re-resolve the lockfile on every retry.
  before_run: |
    npm ci --prefer-offline --no-audit --no-fund

  # Runs after each Attempt, whatever the outcome. Failure is logged, ignored.
  after_run: |
    pkill -f "remix dev" || true
    pkill -f "e2e/stub-strapi.mjs" || true

  # Runs before the workspace is deleted. Failure is logged, ignored.
  before_remove: |
    rm -rf .cache build public/build playwright-report test-results

  timeout_ms: 600000

verify:
  # `--run` is not optional: `npm test` is bare `vitest`, which watches unless
  # it detects CI. A gate command that never exits is worse than one that fails.
  test: npm test -- --run
  typecheck: npm run typecheck
  lint: npm run lint
  build: npm run build
  # Boots the app against a stubbed Strapi — see e2e/stub-strapi.mjs. Raw
  # command, not an npm script, because `init` will not edit package.json.
  e2e: npx playwright test
---

# WORKFLOW.md

How border-collie works this repository. Scaffolded once by `border-collie init`;
yours to edit from here on.

## What the front matter means

`hooks:` prepare and tear down the workspace a Worker runs in. They are shell
scripts run with the workspace as `cwd`; `after_create` and `before_run` are
fatal to their operation, `after_run` and `before_remove` are best-effort.

`verify:` names the commands that decide whether work is good. border-collie
runs them by name and reads their exit code, nothing else. **A check that is not
named here cannot gate anything** — border-collie will not read a Worker's prose
to decide whether the tests passed.

## Skills

A Worker is dispatched with `/implement issue #<n>`. That skill, and everything
it calls, lives in `.claude/skills/` in this repository — not in a marketplace
plugin installed on the runner. A Worker depends only on skills present here.

| Skill | Used for |
| --- | --- |
| `implement` | The entry point every Worker is given. |
| `tdd` | Red-green-refactor at the seams `implement` names. |
| `code-review` | The self-review `implement` runs before committing. |

## App boot

`npx playwright test` starts two processes (see `playwright.config.ts`):

1. `node e2e/stub-strapi.mjs` — a canned Strapi-shaped API on :1337, because
   this app has no data of its own. Every route reads from Strapi.
2. `npm run dev` — Remix on :3000, pointed at the stub.

This is the piece with real cost: the app cannot be booted, and therefore
cannot be verified end to end, without something answering as Strapi.

## Deploy

`.github/workflows/ci-cd.yml` deploys to Fly on every push to `main`. Merging an
agent PR therefore ships to production. That is a decision for the operator, not
for `init` — see `SKETCH.md`.
