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
  await expect(page.getByRole('heading', { name: 'Yangi yozuv' })).toBeVisible()

  // Service worker roʻyxatdan oʻtib, sahifani boshqarishga tayyor boʻlsin.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })

  await context.setOffline(true)
  await page.reload()

  // Tarmoqsiz ham ilova ochiladi — hammasi keshdan (0003).
  await expect(page.getByRole('heading', { name: 'Yangi yozuv' })).toBeVisible()
  // Kategoriyalar IndexedDB dan keladi, serverdan emas (0004).
  await page.getByRole('button', { name: 'Chiqim' }).click()
  await page.getByRole('button', { name: 'oziq-ovqat' }).click()
  await page.getByLabel('Summa').fill('45000')
  await page.getByRole('button', { name: 'Saqlash' }).click()

  await expect(page.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeVisible()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()

  // Ilova yopilib qayta ochilsa ham yozuv joyida turadi — hali ham oflayn.
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Yangi yozuv' })).toBeVisible()
  await page.getByRole('button', { name: 'Yopish' }).click()
  await expect(page.getByText('−45 000 soʻm')).toBeVisible()

  await context.setOffline(false)
})
