---
name: tdd
description: "Red-green-refactor in this repository, with Vitest."
disable-model-invocation: true
---

<!-- SKETCH — written by `border-collie init` (v0.6.0-sketch). -->

Write the failing test first, watch it fail, then make it pass.

- Tests live beside the code, in `__tests__/`, named `<subject>.test.ts(x)`.
- `npm test -- --run <path>` for one file. Never leave `vitest` in watch mode:
  a Worker session has no terminal to stop it from.
- Components: `@testing-library/react`, queried by role, not by test id.
- Models: mock `~/utils/api/fetchApi` with `vi.mock`, as the existing tests in
  `app/models/__tests__/` do. Do not hit a real Strapi from a unit test.
