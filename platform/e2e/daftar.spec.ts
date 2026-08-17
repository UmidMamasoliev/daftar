import { expect, test } from '@playwright/test'

// E2E: sahifa haqiqiy brauzerda ochiladimi va «Yangi yozuv» formasi koʻrinadimi (0040).
// Dev-serverni Playwright oʻzi koʻtaradi — `playwright.config.ts` dagi `webServer`.
//
// Chuqur oqim (yozuv qoʻshish, roʻyxat, oʻchirish) navigatsiya qoʻshilgach yoziladi;
// forma mezonlari Vitest da tekshiriladi (`src/ui/YozuvForma.test.tsx`).
test('sahifa ochiladi va «Yangi yozuv» formasi koʻrinadi', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Daftar')
  await expect(page.getByRole('heading', { name: 'Yangi yozuv' })).toBeVisible()
  // Tayyor kategoriyalar bazadan kelib chip boʻlib chiqadi (0028; mezon 15).
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await expect(page.getByRole('button', { name: 'oziq-ovqat' })).toBeVisible()
})
