---
name: implement
description: "Implement a piece of work described by a ticket, in this repository."
disable-model-invocation: true
---

<!--
SKETCH — written by `border-collie init` (v0.6.0-sketch). Yours from here on:
`init` will never overwrite it.

This is the one skill a border-collie Worker is dispatched with. It lives here,
in the repo, rather than in a marketplace plugin installed on the runner — a
Worker depends only on skills present in this repository. It is stack-aware
because it can be: it names this repo's actual verify commands.
-->

Implement the work described in the ticket.

Use `/tdd` where a seam makes it cheap. Do not chase coverage.

## Verifying

`WORKFLOW.md` names every command border-collie can gate on. Run them by name:

| When | Command |
| --- | --- |
| Constantly, while working | `npm run typecheck` |
| On the file you are changing | `npm test -- --run <path>` |
| Once, before committing | `npm test -- --run`, `npm run lint`, `npm run build` |
| When the change is user-visible | `npx playwright test` |

`npx playwright test` boots the app against a stubbed Strapi (`e2e/stub-strapi.mjs`).
If it logs `MISS` for a path your change depends on, record a fixture for it in
`e2e/fixtures/` rather than skipping the check.

## This repository

- Remix 1.14 + React 18 + Mantine 6, TypeScript strict, `~/*` path alias.
- `app/models/*.server.ts` are the only place Strapi is fetched. Loaders call
  models; components never fetch.
- Follow `AGENTS.md` for code style. It is the older document and it is still
  correct.

Once done, run `/code-review` over your own diff, then commit to the current
branch.
