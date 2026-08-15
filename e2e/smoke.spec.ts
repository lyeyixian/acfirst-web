// SKETCH — written by `border-collie init` (v0.6.0-sketch).
//
// The e2e skeleton is one smoke test, not a suite. border-collie scaffolds the
// skeleton so a Worker has somewhere to add the scenario its ticket needs; the
// suite itself is the repo's to grow.

import { test, expect } from '@playwright/test'

test('home page renders the hero from the CMS', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /AC First/i })).toBeVisible()
})

test('products page renders without a server error', async ({ page }) => {
  const response = await page.goto('/products')
  expect(response?.status()).toBeLessThan(500)
})
