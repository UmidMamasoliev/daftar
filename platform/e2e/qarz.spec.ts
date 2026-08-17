import { expect, test } from '@playwright/test'

// E2E: qarz daftarining toʻliq yoʻli haqiqiy brauzerda, haqiqiy IndexedDB bilan (0040).
//
// Mezonlarning oʻzi Vitest da tekshiriladi (`src/ui/`, `src/App.qarz.test.tsx`); bu yerda
// faqat hammasi birga ishlashi koʻriladi: kontakt → qarz → toʻlov → yopilish, keyin
// oʻchirish va «QAYTARISH».
//
// **Vaqtinchalik (0063):** «Qarz daftari» ga pastdagi navigatsiya panelidan kiriladi.
// `exact: true` shart — Playwright nomni standart holda qism sifatida qidiradi.

test('kontakt → qarz → toʻlov → qarz yopiladi', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Qarz daftari', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Qarz daftari', level: 1 })).toBeVisible()
  await expect(page.getByText('Hali bitta ham kontakt yoʻq.')).toBeVisible()

  // Kontakt qoʻshiladi: ism majburiy, telefon ixtiyoriy (0031; mezon 1).
  await page.getByRole('button', { name: '＋ Yangi kontakt' }).click()
  await page.getByLabel('Ism').fill('Akmal')
  await page.getByLabel('Telefon (ixtiyoriy)').fill('901234567')
  await page.getByRole('button', { name: 'Qoʻshish' }).click()
  await expect(page.getByText('901234567')).toBeVisible()

  // Kontakt sahifasi ochiladi (0063: faol boʻlim «Qarz daftari» boʻlib qoladi).
  await page.getByRole('button', { name: /Akmal/ }).click()
  await expect(page.getByRole('heading', { name: 'Akmal', level: 1 })).toBeVisible()
  await expect(page.getByText('Bu kontaktda hali qarz yoʻq.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Qarz daftari', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )

  // Mezon 3: «berdim» yoʻnalishida 1 000 000 soʻm qarz. Yoʻnalish standarti yoʻq (0062).
  await page.getByRole('button', { name: '＋ Yangi qarz' }).click()
  await expect(page.getByRole('heading', { name: 'Yangi qarz', level: 1 })).toBeVisible()
  // Forma ekranida navigatsiya paneli koʻrinmaydi (dizayn: «Qayerda koʻrinadi»).
  await expect(page.getByRole('navigation')).toBeHidden()
  await page.getByLabel('Summa').fill('1000000')
  await expect(page.getByLabel('Summa')).toHaveValue('1 000 000')
  await page.getByRole('button', { name: 'Berdim' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()

  await expect(page.getByRole('heading', { name: 'Akmal', level: 1 })).toBeVisible()
  await expect(page.getByText('olaman')).toBeVisible()
  await expect(page.getByText('+1 000 000 soʻm')).toHaveCount(2)
  await expect(page.getByText('Hali toʻlov yoʻq.')).toBeVisible()

  // Mezon 5: 300 000 soʻm toʻlov → qoldiq 700 000 soʻm.
  await page.getByRole('button', { name: '＋ Toʻlov' }).click()
  await expect(page.getByText('Qarz qoldigʻi: 1 000 000 soʻm')).toBeVisible()
  // Toʻlov qarz valyutasida — kurs soʻralmaydi (mezon 12).
  await expect(page.getByLabel('Kurs — 1 dollar necha soʻm')).toBeHidden()
  // Mezon 43: yordam qatori pul qaysi hisobga tushishini oldindan aytadi.
  await expect(page.getByText('Pul kartaga tushadi.')).toBeVisible()
  await page.getByLabel('Summa').fill('300000')
  await page.getByRole('button', { name: 'Saqlash' }).click()

  await expect(page.getByText('−300 000 soʻm')).toBeVisible()
  await expect(page.getByText('+700 000 soʻm')).toHaveCount(2)

  // Mezon 38: qoldiqdan chegaradan koʻp oshgan toʻlov rad etiladi.
  await page.getByRole('button', { name: '＋ Toʻlov' }).click()
  await page.getByLabel('Summa').fill('700101')
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByText('Toʻlov qarz qoldigʻidan katta.')).toBeVisible()

  // Mezon 6: qolganini toʻlasa qarz yopiladi va «＋ Toʻlov» yoʻqoladi (mezon 42).
  await page.getByLabel('Summa').fill('700000')
  await page.getByRole('button', { name: 'Saqlash' }).click()

  await expect(page.getByText('Yopilgan', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Yopilgan qarzlar', level: 2 })).toBeVisible()
  await expect(page.getByText('Ochiq qarz yoʻq.')).toBeVisible()
  await expect(page.getByRole('button', { name: '＋ Toʻlov' })).toBeHidden()

  // Mezon 17: ochiq qarzi qolmagan kontakt oʻchadi, panel roʻyxatda chiqadi (0030).
  await page.getByRole('button', { name: 'Kontaktni oʻchirish' }).click()
  await expect(page.getByRole('heading', { name: 'Qarz daftari', level: 1 })).toBeVisible()
  await expect(page.getByText('Kontakt oʻchirildi')).toBeVisible()

  // Mezon 18: «QAYTARISH» kontaktni butun qarz tarixi bilan qaytaradi.
  await page.getByRole('button', { name: 'QAYTARISH' }).click()
  await page.getByRole('button', { name: /Akmal/ }).click()
  await expect(page.getByRole('heading', { name: 'Yopilgan qarzlar', level: 2 })).toBeVisible()
  await expect(page.getByText('−300 000 soʻm')).toBeVisible()
  await expect(page.getByText('−700 000 soʻm')).toBeVisible()
})

test('dollardagi qarzga soʻmda toʻlov: kurs soʻraladi va yaxlitlash oldindan koʻrinadi', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Qarz daftari', exact: true }).click()
  await page.getByRole('button', { name: '＋ Yangi kontakt' }).click()
  await page.getByLabel('Ism').fill('Zafar')
  await page.getByRole('button', { name: 'Qoʻshish' }).click()
  await page.getByRole('button', { name: /Zafar/ }).click()

  // Mezon 47: qarz formasida dollar tanlansa ham kurs soʻralmaydi (0044).
  await page.getByRole('button', { name: '＋ Yangi qarz' }).click()
  await page.getByRole('button', { name: 'dollar' }).click()
  await expect(page.getByLabel('Kurs — 1 dollar necha soʻm')).toBeHidden()
  await page.getByLabel('Summa').fill('100,00')
  await page.getByRole('button', { name: 'Berdim' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()

  await expect(page.getByText('+100,00 $')).toHaveCount(2)

  // Mezon 10, 44: boshqa valyutadagi toʻlovda kurs soʻraladi va ayiriladigan summa
  // 0042 yaxlitlashi bilan oldindan koʻrinadi.
  await page.getByRole('button', { name: '＋ Toʻlov' }).click()
  await page.getByRole('button', { name: 'soʻm' }).click()
  await page.getByLabel('Summa').fill('625000')
  await page.getByLabel('Kurs — 1 dollar necha soʻm').fill('12500')
  await expect(page.getByText('Qarzdan ayiriladi: 50,00 $')).toBeVisible()
  await page.getByRole('button', { name: 'Saqlash' }).click()

  // Mezon 11: qoldiq dollarda koʻrsatiladi; toʻlov qatorida kiritilgani va kursi turadi.
  await expect(page.getByText('+50,00 $')).toHaveCount(2)
  await expect(page.getByText('Karta · 625 000 soʻm · 1 $ = 12 500 soʻm')).toBeVisible()
  await expect(page.getByText('−50,00 $')).toBeVisible()

  // Mezon 32: toʻlovi bor qarzda valyuta muzlatilgan (0059).
  await page.getByRole('button', { name: /Berdim/ }).click()
  await expect(page.getByRole('heading', { name: 'Qarzni tahrirlash', level: 1 })).toBeVisible()
  await expect(
    page.getByText('Toʻlovi bor qarzda valyuta oʻzgarmaydi — avval toʻlovlarni oʻchiring.'),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'soʻm' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'dollar' })).toBeDisabled()
})
