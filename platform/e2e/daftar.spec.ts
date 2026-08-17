import { expect, test } from '@playwright/test'

// Skelet E2E testi: sahifa haqiqiy brauzerda ochiladimi va «Daftar» koʻrinadimi (0040).
// Dev-serverni Playwright oʻzi koʻtaradi — `playwright.config.ts` dagi `webServer`.
test('sahifa ochiladi va «Daftar» koʻrinadi', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Daftar')
  await expect(page.getByRole('heading', { name: 'Daftar' })).toBeVisible()
})
