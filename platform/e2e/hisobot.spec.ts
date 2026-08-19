import { expect, test } from '@playwright/test'

// E2E: hisobotning toʻliq yoʻli haqiqiy brauzerda, haqiqiy IndexedDB bilan (0040).
//
// Mezonlarning oʻzi Vitest da tekshiriladi (`src/ui/Hisobot.test.tsx`,
// `src/App.hisobot.test.tsx`); bu yerda hammasi birga ishlashi koʻriladi: yozuvlar va
// qarz kiritiladi, hisobot raqamlari oʻsha maʼlumotdan chiqadi.
//
// `exact: true` shart — Playwright nomni standart holda qism sifatida qidiradi.

test('yozuvlar va qarz kiritilgach hisobot raqamlari toʻgʻri chiqadi', async ({ page }) => {
  await page.goto('/')

  // 8 000 000 soʻm kirim.
  await page.getByRole('button', { name: '＋ Yozuv' }).click()
  await page.getByRole('button', { name: 'Kirim' }).click()
  await page.getByLabel('Summa').fill('8000000')
  await page.getByRole('button', { name: 'oylik' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByRole('heading', { name: 'Daftar', level: 1 })).toBeVisible()

  // 800 000 soʻm chiqim — oziq-ovqat.
  await page.getByRole('button', { name: '＋ Yozuv' }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByLabel('Summa').fill('800000')
  await page.getByRole('button', { name: 'oziq-ovqat' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByRole('heading', { name: 'Daftar', level: 1 })).toBeVisible()

  // 150 000 soʻm chiqim — transport.
  await page.getByRole('button', { name: '＋ Yozuv' }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByLabel('Summa').fill('150000')
  await page.getByRole('button', { name: 'transport' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByRole('heading', { name: 'Daftar', level: 1 })).toBeVisible()

  // Kontaktga 1 000 000 soʻm qarz berilib, 300 000 soʻm qaytariladi.
  await page.getByRole('button', { name: 'Qarz daftari', exact: true }).click()
  await page.getByRole('button', { name: '＋ Yangi kontakt' }).click()
  await page.getByLabel('Ism').fill('Akmal')
  await page.getByRole('button', { name: 'Qoʻshish' }).click()
  await page.getByRole('button', { name: /Akmal/ }).click()
  await page.getByRole('button', { name: '＋ Yangi qarz' }).click()
  await page.getByLabel('Summa').fill('1000000')
  await page.getByRole('button', { name: 'Berdim' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await page.getByRole('button', { name: '＋ Toʻlov' }).click()
  await page.getByLabel('Summa').fill('300000')
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByText('−300 000 soʻm')).toBeVisible()

  // Hisobot — bitta bosish, joriy oy bilan ochiladi (mezon 1).
  await page.getByRole('button', { name: 'Hisobot', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Hisobot', level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Keyingi oy' })).toBeDisabled()

  // Mezon 7, 8, 9: jami kirim, jami chiqim va farq.
  const kirim = page.getByRole('group', { name: 'Jami kirim' })
  const chiqim = page.getByRole('group', { name: 'Jami chiqim' })
  const farq = page.getByRole('group', { name: 'Farq' })
  await expect(kirim.getByText('+8 000 000 soʻm')).toBeVisible()
  await expect(chiqim.getByText('−950 000 soʻm')).toBeVisible()
  await expect(farq.getByText('+7 050 000 soʻm')).toBeVisible()

  // Mezon 10: ajratma summalari yigʻindisi jami chiqimga aynan teng (950 000).
  const ajratma = page.getByRole('region', { name: 'Chiqim — kategoriyalar boʻyicha' })
  await expect(ajratma.getByText('−800 000 soʻm')).toBeVisible()
  await expect(ajratma.getByText('−150 000 soʻm')).toBeVisible()
  // Bitta valyutada guruh sarlavhasi qoʻyilmaydi (0038).
  await expect(ajratma.getByRole('heading', { level: 3 })).toHaveCount(0)

  // Mezon 13, 14, 15, 16: qarz alohida blokda va jamiga qoʻshilmagan.
  const qarz = page.getByRole('region', { name: 'Qarz' })
  await expect(qarz.getByText('Qarzga berildi')).toBeVisible()
  await expect(qarz.getByText('−1 000 000 soʻm')).toBeVisible()
  await expect(qarz.getByText('Qarzdan qaytdi')).toBeVisible()
  await expect(qarz.getByText('+300 000 soʻm')).toBeVisible()
  await expect(
    qarz.getByText('Qarz summalari jami kirim va jami chiqimga qoʻshilmagan.'),
  ).toBeVisible()

  // Mezon 2: oldingi oyda raqamlar nolga tushadi va ekran xato bermaydi (mezon 17).
  await page.getByRole('button', { name: 'Oldingi oy' }).click()
  await expect(kirim.getByText('0 soʻm')).toBeVisible()
  await expect(chiqim.getByText('0 soʻm')).toBeVisible()
  await expect(page.getByText('Bu davrda chiqim yozuvi yoʻq.')).toBeVisible()
  await expect(page.getByText('Bu davrda qarz harakati yoʻq.')).toBeVisible()
  await expect(page.getByText('Boshqa davrni yuqoridan tanlang.')).toBeVisible()
})
