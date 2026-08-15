---
name: code-review
description: "Review a diff in this repository before it becomes a pull request."
disable-model-invocation: true
---

<!-- SKETCH — written by `border-collie init` (v0.6.0-sketch). -->

Review your own diff against two questions.

**Does it do what the ticket asked?** Re-read the ticket. Anything the diff does
beyond it is a finding.

**Does it follow this repository?** `AGENTS.md` has the style rules. In
particular: server fetching stays in `app/models/*.server.ts`; components stay
presentational; no `try/catch` where a null check would do.

Then confirm every command in `WORKFLOW.md`'s `verify:` block exits zero. A
review that ends with an unrun gate is not finished.
