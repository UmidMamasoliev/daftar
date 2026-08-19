import { expect, test } from '@playwright/test'

// E2E: bosh sahifaning toʻliq yoʻli haqiqiy brauzerda, haqiqiy IndexedDB bilan (0040).
//
// Spec: `specs/001-dashboard/spec.md`. Mezonlarning oʻzi Vitest da tekshiriladi
// (`src/ui/Dashboard.test.tsx`, `src/App.dashboard.test.tsx`); bu yerda hammasi birga
// ishlashi koʻriladi. Oflayn yoʻl (mezon 21) `e2e/oflayn.spec.ts` da — service worker
// faqat yigʻilgan ilovada bor.

test('bosh sahifa: parolsiz ochiladi, qoldiq va oy yozuvdan keyin darhol yangilanadi', async ({
  page,
}) => {
  await page.goto('/')

  // Mezon 1: parol/PIN soʻralmaydi — darhol bosh sahifa.
  await expect(page).toHaveTitle('Daftar')
  await expect(page.getByRole('heading', { name: 'Daftar', level: 1 })).toBeVisible()

  // Mezon 2: boʻsh daftarda qoldiq nol.
  const qoldiq = page.getByRole('region', { name: 'Qoldiq' })
  await expect(qoldiq.getByText('0 soʻm').first()).toBeVisible()

  // Mezon 15: hech qachon eksport qilinmagan daftarda eslatma turadi.
  await expect(
    page.getByText('Daftar hali zaxira qilinmagan — «Zaxira» boʻlimidan eksport qiling.'),
  ).toBeVisible()

  // Mezon 3, 19: «＋ Yozuv» formani ochadi; saqlangach qoldiq kamayadi.
  await page.getByRole('button', { name: '＋ Yozuv' }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByLabel('Summa').fill('45000')
  await page.getByRole('button', { name: 'oziq-ovqat' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()

  await expect(page.getByRole('heading', { name: 'Daftar', level: 1 })).toBeVisible()
  await expect(qoldiq.getByText('−45 000 soʻm').first()).toBeVisible()

  // Mezon 8, 10: joriy oy chiqimi va oxirgi yozuvlar roʻyxati darhol yangilanadi.
  const oy = page.getByRole('region', { name: 'Joriy oy' })
  await expect(oy.getByText('−45 000 soʻm')).toBeVisible()
  const oxirgilar = page.getByRole('region', { name: 'Oxirgi yozuvlar' })
  await expect(oxirgilar.getByText('oziq-ovqat')).toBeVisible()

  // Mezon 20: «Hammasi ›» toʻliq roʻyxatga olib boradi.
  await page.getByRole('button', { name: 'Hammasi ›' }).click()
  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()

  // Mezon 11 yoʻnalishi: bosh sahifada qarz raqami yoʻq — «Bosh» bandi orqali qaytiladi.
  await page.getByRole('button', { name: 'Bosh' }).click()
  await expect(page.getByRole('heading', { name: 'Daftar', level: 1 })).toBeVisible()
})
