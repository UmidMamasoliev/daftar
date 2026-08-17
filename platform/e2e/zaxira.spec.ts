import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

// E2E: zaxiraning toʻliq davrasi haqiqiy brauzerda — haqiqiy yuklab olish va haqiqiy
// fayl tanlash bilan (0040, 0041).
//
// Mezonlarning oʻzi Vitest da tekshiriladi (`src/ui/Zaxira.test.tsx`,
// `src/App.zaxira.test.tsx`); bu yerda brauzerdagi yoʻl koʻriladi: fayl haqiqatan
// yuklab olinadimi, qaytarib tanlanganda tasdiq oʻtadimi va daftar tiklanadimi.
//
// `exact: true` shart — Playwright nomni standart holda qism sifatida qidiradi.

test('eksport → maʼlumotni oʻzgartirish → import: eski holat tiklanadi', async ({ page }) => {
  await page.goto('/')

  // 45 000 soʻmlik chiqim — tiklanadigan holat shu.
  await page.getByRole('button', { name: 'Yozuv', exact: true }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByLabel('Summa').fill('45000')
  await page.getByRole('button', { name: 'oziq-ovqat' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()

  await page.getByRole('button', { name: 'Zaxira', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Zaxira', level: 1 })).toBeVisible()
  await expect(page.getByText('Hali zaxira olinmagan.')).toBeVisible()

  // Mezon 9: «Eksport» faylni haqiqatan yuklab olishga beradi.
  const eksportYuklandi = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Eksport' }).click()
  const eksportFayli = await eksportYuklandi
  expect(eksportFayli.suggestedFilename()).toMatch(
    /^daftar-zaxira-\d{4}-\d{2}-\d{2}-\d{4}\.json$/,
  )
  const eksportYoli = await eksportFayli.path()
  await expect(page.getByText('Oxirgi zaxira: Bugun')).toBeVisible()
  await expect(page.getByText(/Fayl yuklab olindi: daftar-zaxira-/)).toBeVisible()

  // Fayl haqiqiy JSON va bloklari joyida (mezon 1, 3).
  const mazmun = JSON.parse(readFileSync(eksportYoli, 'utf8')) as {
    versiya: number
    yozuvlar: unknown[]
  }
  expect(mazmun.versiya).toBe(1)
  expect(mazmun.yozuvlar).toHaveLength(1)

  // Eksportdan keyin daftar oʻzgaradi — import uni qaytarishi kerak (mezon 18).
  await page.getByRole('button', { name: 'Yozuv', exact: true }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByLabel('Summa').fill('90000')
  await page.getByRole('button', { name: 'transport' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByText('−90 000 soʻm')).toBeVisible()

  await page.getByRole('button', { name: 'Zaxira', exact: true }).click()

  // 1-qadam: tiklanadigan fayl tanlanadi. 2-qadam oʻzi boshlanadi va avtomatik zaxira
  // yuklab olinadi (0027; mezon 15).
  const zaxiraYuklandi = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Import' }).click()
  await page.getByLabel('Tiklanadigan fayl').setInputFiles(eksportYoli)

  const zaxiraFayli = await zaxiraYuklandi
  expect(zaxiraFayli.suggestedFilename()).toMatch(/^daftar-import-oldidan-/)
  const zaxiraYoli = await zaxiraFayli.path()

  await expect(page.getByText('Hozirgi maʼlumot faylga chiqarildi.')).toBeVisible()
  await expect(page.getByText(zaxiraFayli.suggestedFilename())).toBeVisible()

  // Mezon 17c: boshqa fayl tanlansa tasdiq oʻtmaydi va daftar oʻzgarmaydi.
  await page.getByLabel('Zaxira fayli').setInputFiles(eksportYoli)
  await expect(page.getByText('Bu fayl hozirgina chiqarilgan zaxira emas.')).toBeVisible()
  await expect(page.getByText('Daftardagi maʼlumot oʻzgarmadi.')).toBeVisible()

  // Mezon 17j: oʻsha ekranning oʻzida toʻgʻri fayl tanlanadi va import oxirigacha oʻtadi.
  await page.getByLabel('Zaxira fayli').setInputFiles(zaxiraYoli)
  await expect(page.getByText('Daftar fayldan tiklandi.')).toBeVisible()
  await expect(page.getByText('1 yozuv · 0 kontakt · 0 qarz · 0 toʻlov')).toBeVisible()

  // Mezon 13, 18: fayldagi holat qaytdi, keyin qoʻshilgan yozuv qolmadi.
  await page.getByRole('button', { name: 'Yozuvlarni koʻrish' }).click()
  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()
  await expect(page.getByText('−90 000 soʻm')).toBeHidden()

  // Mezon 26: ilova qayta ochilganda tiklangan maʼlumot joyida turadi.
  await page.reload()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()
  await expect(page.getByText('−90 000 soʻm')).toBeHidden()
})

test('buzilgan fayl import qilinmaydi va daftar oʻzgarmaydi (mezon 20)', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Yozuv', exact: true }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByLabel('Summa').fill('45000')
  await page.getByRole('button', { name: 'oziq-ovqat' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()

  await page.getByRole('button', { name: 'Zaxira', exact: true }).click()
  await page.getByRole('button', { name: 'Import' }).click()
  await page.getByLabel('Tiklanadigan fayl').setInputFiles({
    name: 'buzilgan.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"versiya":1,"yozuv'),
  })

  await expect(
    page.getByText('Fayl oʻqilmadi — u buzilgan yoki daftar zaxirasi emas.'),
  ).toBeVisible()
  await expect(page.getByText('Daftardagi maʼlumot oʻzgarmadi.')).toBeVisible()
  // Oqim boshlanmaydi: avtomatik zaxira bloki chiqmaydi.
  await expect(page.getByText('Hozirgi maʼlumot faylga chiqarildi.')).toBeHidden()

  await page.getByRole('button', { name: 'Yozuvlar', exact: true }).click()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()
})
