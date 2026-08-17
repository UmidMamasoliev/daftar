// «Koʻrsatish» + «‹ Orqaga» poygasi — alohida fayl, chunki doʻkon ataylab sekinlashtiriladi.
//
// Haqiqiy qurilmada IndexedDB amali darhol tugamaydi. Agar «‹ Orqaga» oʻsha amalni
// kutmasa, forma eski roʻyxatga qarab tanlovni notoʻgʻri bekor qiladi (dizayn:
// «Tanlangan kategoriya yashirilsa» — tekshiruv qaytilgan paytdagi holatga qarashi kerak).
//
// jsdom da fake-indexeddb juda tez, shuning uchun poyga oʻz-oʻzidan yopilib qoladi va
// oddiy test uni ushlay olmaydi. Bu yerda `kategoriyaniKorsat` ga kechikish qoʻyiladi —
// shunda poyga har safar takrorlanadi.

import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import { App } from './App.tsx'
import { bazaniTozala } from './data/yozuvlar.ts'

vi.mock('./data/kategoriyalar.ts', async () => {
  const asl =
    await vi.importActual<typeof import('./data/kategoriyalar.ts')>('./data/kategoriyalar.ts')
  return {
    ...asl,
    kategoriyaniKorsat: async (id: string) => {
      await new Promise((bajarildi) => setTimeout(bajarildi, 60))
      return asl.kategoriyaniKorsat(id)
    },
  }
})

afterEach(async () => {
  cleanup()
  await bazaniTozala()
})

it('sekin doʻkonda ham «Koʻrsatish» dan keyingi «‹ Orqaga» tanlovni bekor qilmaydi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await odam.click(await screen.findByRole('button', { name: 'Chiqim' }))
  await odam.click(await screen.findByRole('button', { name: 'oziq-ovqat' }))

  await odam.click(screen.getByRole('button', { name: 'Boshqarish' }))
  const qator = screen
    .getAllByRole('listitem')
    .find((q) => q.textContent?.startsWith('oziq-ovqat') === true)
  await odam.click(within(qator as HTMLElement).getByRole('button', { name: 'Yashirish' }))
  await screen.findByText('Yashirilgan')

  // Ataylab kutmasdan: «Koʻrsatish» hali tugamagan payt «‹ Orqaga» bosiladi.
  await odam.click(screen.getByRole('button', { name: 'Koʻrsatish' }))
  await odam.click(screen.getByRole('button', { name: '‹ Orqaga' }))

  await screen.findByRole('heading', { name: 'Yangi yozuv', level: 1 })
  const chip = await screen.findByRole('button', { name: 'oziq-ovqat' })

  expect(chip.getAttribute('aria-pressed')).toBe('true')
  expect(screen.queryByText('Tanlangan kategoriya yashirildi — boshqasini tanlang.')).toBeNull()
})
