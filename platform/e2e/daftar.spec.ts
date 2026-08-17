import { expect, test } from '@playwright/test'

// E2E: haqiqiy brauzerda haqiqiy IndexedDB bilan toʻliq yoʻl (0040).
// Dev-serverni Playwright oʻzi koʻtaradi — `playwright.config.ts` dagi `webServer`.
//
// Mezonlarning oʻzi Vitest da tekshiriladi (`src/ui/`, `src/App.test.tsx`); bu yerda
// faqat hammasi birga ishlashi koʻriladi: yozuv qoʻshiladi, roʻyxatda koʻrinadi,
// oʻchiriladi va «QAYTARISH» bilan qaytadi.
//
// **Vaqtinchalik (0063):** ilova «Yozuvlar» bilan ochiladi, formaga esa pastdagi
// navigatsiya panelining «Yozuv» boʻlagidan kiriladi. `exact: true` shart —
// Playwright nomni standart holda qism sifatida qidiradi va «Yozuv» «Yozuvlar» ga
// ham tushib ketardi.

test('yozuv qoʻshiladi, roʻyxatda koʻrinadi, oʻchiriladi va qaytariladi', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Daftar')
  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()

  await page.getByRole('button', { name: 'Yozuv', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Yangi yozuv' })).toBeVisible()

  // Tayyor kategoriyalar bazadan kelib chip boʻlib chiqadi (0028; mezon 15).
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByRole('button', { name: 'oziq-ovqat' }).click()
  await page.getByLabel('Summa').fill('45000')
  // Terish paytida mingliklar ajratiladi (uslub: «Maydonda terish paytidagi format»).
  await expect(page.getByLabel('Summa')).toHaveValue('45 000')
  await page.getByRole('button', { name: 'Saqlash' }).click()

  // Saqlangach roʻyxat ochiladi va yangi yozuv darhol koʻrinadi.
  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bugun', level: 2 })).toBeVisible()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()

  // Oʻchirish tasdiqsiz bajariladi, «QAYTARISH» paneli chiqadi (0029; mezon 11, 20).
  await page.getByRole('button', { name: /oziq-ovqat/ }).hover()
  await page.getByRole('button', { name: 'Oʻchirish' }).click()
  await expect(page.getByText('−45 000 soʻm')).toBeHidden()
  await expect(page.getByText('Yozuv oʻchirildi')).toBeVisible()

  await page.getByRole('button', { name: 'QAYTARISH' }).click()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()
  await expect(page.getByText('Yozuv oʻchirildi')).toBeHidden()

  // Qator bosilsa tahrirlash formasi toʻldirilgan holda ochiladi (mezon 18).
  await page.getByRole('button', { name: /oziq-ovqat/ }).click()
  await expect(page.getByRole('heading', { name: 'Yozuvni tahrirlash' })).toBeVisible()
  await expect(page.getByLabel('Summa')).toHaveValue('45 000')
})

test('kategoriya qoʻshiladi, yashiriladi va formadagi chiplar darhol oʻzgaradi', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Yozuv', exact: true }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await expect(page.getByRole('button', { name: 'kiyim' })).toBeVisible()

  // Kirish yoʻli bitta — formadagi «Boshqarish» havolasi.
  await page.getByRole('button', { name: 'Boshqarish' }).click()
  await expect(page.getByRole('heading', { name: 'Kategoriyalar', level: 1 })).toBeVisible()

  // Mezon 13: qoʻshilgan kategoriya formadagi chiplarda darhol paydo boʻladi.
  await page.getByRole('button', { name: '＋ Yangi kategoriya' }).click()
  await page.getByLabel('Kategoriya nomi').fill('dorixona')
  await page.getByRole('button', { name: 'Qoʻshish' }).click()
  await expect(page.getByLabel('Kategoriya nomi')).toBeHidden()

  // Mezon 14: yashirilgani yangi yozuv tanlovidan chiqadi.
  await page
    .getByRole('listitem')
    .filter({ hasText: 'kiyim' })
    .getByRole('button', { name: 'Yashirish' })
    .click()
  await expect(page.getByText('Yashirilgan')).toBeVisible()

  await page.getByRole('button', { name: '‹ Orqaga' }).click()
  await expect(page.getByRole('button', { name: 'dorixona' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'kiyim' })).toBeHidden()
  // Qaytilganda forma toʻldirilgan holicha turadi.
  await expect(page.getByRole('button', { name: 'Chiqim' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  // Mezon 14a/14b: yashirilgan nom bilan qoʻshish rad etiladi, yoʻnaltiruvchi matn chiqadi.
  await page.getByRole('button', { name: 'Boshqarish' }).click()
  await page.getByRole('button', { name: '＋ Yangi kategoriya' }).click()
  await page.getByLabel('Kategoriya nomi').fill('KIYIM')
  await page.getByRole('button', { name: 'Qoʻshish' }).click()
  await expect(
    page.getByText(
      'Bunday kategoriya yashirilgan — pastdagi Yashirilgan roʻyxatidan Koʻrsatish tugmasi bilan qaytaring.',
    ),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Koʻrsatish' })).toBeVisible()
})

test('«QAYTARISH» paneli 7 soniyadan keyin yoʻqoladi (0048; mezon 12)', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Yozuv', exact: true }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByRole('button', { name: 'transport' }).click()
  await page.getByLabel('Summa').fill('12000')
  await page.getByRole('button', { name: 'Saqlash' }).click()

  await page.getByRole('button', { name: /transport/ }).hover()
  await page.getByRole('button', { name: 'Oʻchirish' }).click()
  await expect(page.getByText('Yozuv oʻchirildi')).toBeVisible()

  // Muddat tugaydi — panel yoʻqoladi va oʻchirish yakuniy boʻladi.
  await expect(page.getByText('Yozuv oʻchirildi')).toBeHidden({ timeout: 9000 })
  await expect(page.getByText('Hali bitta ham yozuv yoʻq.')).toBeVisible()
})
