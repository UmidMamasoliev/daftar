import { expect, test } from '@playwright/test'

// Mezon 17: «Internet oʻchirilgan holda yozuv saqlanadi va ilova qayta ochilganda
// joyida turadi.» (0003, 0004)
//
// Bu test yigʻilgan ilovada ishlaydi (`oflayn` project → `vite preview`): PWA service
// worker faqat build natijasida paydo boʻladi, dev-serverda uni tekshirib boʻlmaydi.
//
// Yoʻl: sahifa ochiladi → service worker tayyor boʻlishi kutiladi → tarmoq oʻchiriladi →
// sahifa qayta yuklanadi (endi u keshdan keladi) → yozuv saqlanadi → yana qayta yuklanadi
// va yozuv joyida turibdimi tekshiriladi. Maʼlumot IndexedDB da, serverga chiqmaydi (0004).

test('mezon 17 — internet oʻchiq holda yozuv saqlanadi va joyida qoladi', async ({
  page,
  context,
}) => {
  await page.goto('/')
  // Ilova «Yozuvlar» bilan ochiladi (0063).
  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()

  // Service worker roʻyxatdan oʻtib, sahifani boshqarishga tayyor boʻlsin.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })

  await context.setOffline(true)
  await page.reload()

  // Tarmoqsiz ham ilova ochiladi — hammasi keshdan (0003).
  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()
  // Kategoriyalar IndexedDB dan keladi, serverdan emas (0004).
  await page.getByRole('button', { name: 'Yozuv', exact: true }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByRole('button', { name: 'oziq-ovqat' }).click()
  await page.getByLabel('Summa').fill('45000')
  await page.getByRole('button', { name: 'Saqlash' }).click()

  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()

  // Ilova yopilib qayta ochilsa ham yozuv joyida turadi — hali ham oflayn.
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()

  await context.setOffline(false)
})

// Mezon 22: «Internet oʻchirilgan holda qarz va toʻlov saqlanadi va ilova qayta
// ochilganda joyida turadi.» (0003, 0004) — yozuv uchun mezon 17 bilan bir xil yoʻl.

test('mezon 22 — internet oʻchiq holda qarz va toʻlov saqlanadi va joyida qoladi', async ({
  page,
  context,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })

  await context.setOffline(true)
  await page.reload()

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
  await expect(page.getByText('+700 000 soʻm')).toHaveCount(2)

  // Ilova yopilib qayta ochilsa ham qarz va toʻlov joyida turadi — hali ham oflayn.
  await page.reload()
  await page.getByRole('button', { name: 'Qarz daftari', exact: true }).click()
  await page.getByRole('button', { name: /Akmal/ }).click()
  await expect(page.getByText('+700 000 soʻm')).toHaveCount(2)
  await expect(page.getByText('−300 000 soʻm')).toBeVisible()

  await context.setOffline(false)
})

// Mezon 25: «Internet oʻchirilgan holda eksport ham, import ham ishlaydi.» (0003, 0004)
//
// Fayl xotirada `Blob` boʻlib yasaladi va brauzerning oʻz yuklab olish yoʻli bilan
// beriladi — serverga chiqmaydi, shuning uchun tarmoqsiz ham ishlaydi.

test('mezon 25 — internet oʻchiq holda eksport va import ishlaydi', async ({
  page,
  context,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })

  await context.setOffline(true)
  await page.reload()

  await page.getByRole('button', { name: 'Yozuv', exact: true }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByLabel('Summa').fill('45000')
  await page.getByRole('button', { name: 'oziq-ovqat' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()

  // Eksport — tarmoqsiz ham fayl chiqadi.
  await page.getByRole('button', { name: 'Zaxira', exact: true }).click()
  const yuklandi = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Eksport' }).click()
  const fayl = await yuklandi
  const yoli = await fayl.path()
  await expect(page.getByText('Oxirgi zaxira: Bugun')).toBeVisible()

  // Daftar oʻzgaradi, keyin oʻsha fayldan tiklanadi — hali ham oflayn.
  await page.getByRole('button', { name: 'Yozuv', exact: true }).click()
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByLabel('Summa').fill('90000')
  await page.getByRole('button', { name: 'transport' }).click()
  await page.getByRole('button', { name: 'Saqlash' }).click()
  await expect(page.getByText('−90 000 soʻm')).toBeVisible()

  await page.getByRole('button', { name: 'Zaxira', exact: true }).click()
  const zaxiraYuklandi = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Import' }).click()
  await page.getByLabel('Tiklanadigan fayl').setInputFiles(yoli)
  const zaxira = await zaxiraYuklandi
  await page.getByLabel('Zaxira fayli').setInputFiles(await zaxira.path())

  await expect(page.getByText('Daftar fayldan tiklandi.')).toBeVisible()
  await expect(page.getByText('1 yozuv · 0 kontakt · 0 qarz · 0 toʻlov')).toBeVisible()

  await page.getByRole('button', { name: 'Yozuvlarni koʻrish' }).click()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()
  await expect(page.getByText('−90 000 soʻm')).toBeHidden()

  await context.setOffline(false)
})
