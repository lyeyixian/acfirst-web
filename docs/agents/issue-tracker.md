<!-- SKETCH — written by `border-collie init` (v0.6.0-sketch). -->

# Issue tracker: GitHub

Issues for this repo live as GitHub issues. Use the `gh` CLI for all operations.

- **Read an issue**: `gh issue view <number> --comments`
- **Comment**: `gh issue comment <number> --body "..."`
- **Labels**: `gh issue edit <number> --add-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

## Labels border-collie writes

`init` creates these; the Orchestrator's first Claim fails without them.

| Label | Meaning |
| --- | --- |
| `ready-for-agent` | Dispatchable, once its blockers are closed. |
| `ready-for-human` | Escalated — attempts exhausted, a human decides next. |
| `claimed` | Held by a Worker right now. Agent-held, never a human claim. |
| `operator-steered` | On a PR: the automatic refinement loop skips it. |
