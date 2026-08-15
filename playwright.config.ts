// SKETCH — written by `border-collie init` (v0.6.0-sketch).
//
// The app-boot recipe, as executable config. `verify.e2e` in WORKFLOW.md runs
// `npx playwright test`, which starts both processes below and waits for them.
//
// Note what `init` did NOT do: add a `test:e2e` script to package.json. `init`
// writes files and never overwrites them, and package.json is the repo's, not
// border-collie's. So the verify contract names the raw command instead.

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  webServer: [
    {
      command: 'node e2e/stub-strapi.mjs',
      url: 'http://localhost:1337/api/global',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      env: {
        STRAPI_URL_BASE: 'http://localhost:1337',
        STRAPI_API_TOKEN: 'stub-token',
        SESSION_SECRET: 'stub-session-secret',
        SERP_API_KEY: 'stub-serp-key',
      },
    },
  ],
})
