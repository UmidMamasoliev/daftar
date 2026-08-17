// Hisobotning ilova darajasidagi ulash testlari: navigatsiya, doʻkon va davr birga
// ishlaydimi.
//
// Soxta maʼlumot yoʻq — yozuvlar, qarzlar va qoʻlda soʻralgan kurs `data/` orqali
// bazadan oʻtadi (`fake-indexeddb`). Mezonlar: `prds/oylik-hisobot.md` → 1, 2, 18, 21;
// 0043 (kurs saqlanadi va qayta soʻralmaydi), 0063 (navigatsiya).
//
// **Tayyorgarlik doʻkondan sepiladi, forma orqali emas.** Bu testlarning mavzusi —
// hisobot raqamlari; yozuv kiritish yoʻli `src/App.test.tsx` va `e2e/` da tekshirilgan.
// Formani har safar toʻldirish kategoriya chiplari kelishini kutishga bogʻlanardi va
// fayllar parallel yugurganda oʻsha kutish beqaror boʻlardi (ortiqcha bogʻlanish).

import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { App } from './App.tsx'
import { bazaniTozala } from './data/qarzlar.ts'
import { yozuvQosh } from './data/yozuvlar.ts'
import { sananingOyi } from './domain/hisobot.ts'
import { bugun } from './domain/sana.ts'
import type { YangiYozuv } from './domain/turlar.ts'
import { navbatBoshasin } from './test/navbat.ts'
import { oyMatni } from './ui/format.ts'

afterEach(async () => {
  cleanup()
  await navbatBoshasin()
  await bazaniTozala()
})

type Odam = ReturnType<typeof userEvent.setup>

/** Yozuvni doʻkonga sepadi — ekran chizilishidan oldin chaqiriladi. */
async function yozuvSepdi(qism: Partial<YangiYozuv> = {}): Promise<void> {
  await yozuvQosh({
    turi: 'chiqim',
    summa: 45000,
    kategoriyaId: 'oziq-ovqat',
    sana: bugun(),
    hisob: 'karta',
    valyuta: 'som',
    ...qism,
  } as YangiYozuv)
}

function tugma(nom: string): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

function bolak(nom: string): HTMLElement {
  return screen.getByRole('group', { name: nom })
}

/** Joriy oyning ekranda koʻrinadigan nomi — «avgust» yoki «avgust 2025». */
function joriyOyNomi(): string {
  const bugungi = bugun()
  return oyMatni(sananingOyi(bugungi), Number(bugungi.slice(0, 4)))
}

async function hisobotniOch(odam: Odam): Promise<void> {
  await odam.click(await screen.findByRole('button', { name: 'Hisobot' }))
  await screen.findByRole('heading', { name: 'Hisobot', level: 1 })
}

it('mezon 1 — «Hisobot» boʻlagi ekranni joriy oy bilan ochadi (0018, 0063)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await hisobotniOch(odam)

  expect(screen.getByText(joriyOyNomi())).toBeDefined()
  // Joriy oyda `›` oʻchiq — kelajak oyi tanlanmaydi (0034).
  expect((tugma('Keyingi oy') as HTMLButtonElement).disabled).toBe(true)
  expect(tugma('Hisobot').getAttribute('aria-current')).toBe('page')
})

it('mezon 18 — kiritilgan yozuv hisobotda darhol koʻrinadi', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi()
  render(<App />)

  await hisobotniOch(odam)

  await waitFor(() => {
    expect(within(bolak('Jami chiqim')).getByText('−45 000 soʻm')).toBeDefined()
  })
  expect(within(bolak('Farq')).getByText('−45 000 soʻm')).toBeDefined()
  expect(
    within(screen.getByRole('region', { name: 'Chiqim — kategoriyalar boʻyicha' })).getByText(
      'oziq-ovqat',
    ),
  ).toBeDefined()
})

it('mezon 18 — yozuv tahrirlangach hisobot yangi raqamni koʻrsatadi', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi()
  render(<App />)

  await hisobotniOch(odam)
  await waitFor(() => {
    expect(within(bolak('Jami chiqim')).getByText('−45 000 soʻm')).toBeDefined()
  })

  // Yozuvlar ekraniga qaytib summani oʻzgartiramiz.
  await odam.click(tugma('Yozuvlar'))
  await odam.click(await screen.findByRole('button', { name: /oziq-ovqat/ }))
  const summa = screen.getByLabelText('Summa')
  await odam.clear(summa)
  await odam.type(summa, '50000')
  await odam.click(tugma('Saqlash'))
  await screen.findByRole('heading', { name: 'Yozuvlar', level: 1 })

  await hisobotniOch(odam)
  await waitFor(() => {
    expect(within(bolak('Jami chiqim')).getByText('−50 000 soʻm')).toBeDefined()
  })
  expect(within(bolak('Jami chiqim')).queryByText('−45 000 soʻm')).toBeNull()
})

it('mezon 2 — `‹` oldingi oyni ochadi va raqamlar oʻsha oy boʻyicha qayta hisoblanadi', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi()
  render(<App />)

  await hisobotniOch(odam)
  await waitFor(() => {
    expect(within(bolak('Jami chiqim')).getByText('−45 000 soʻm')).toBeDefined()
  })

  await odam.click(tugma('Oldingi oy'))
  await waitFor(() => {
    expect(within(bolak('Jami chiqim')).getByText('0 soʻm')).toBeDefined()
  })
  expect(screen.getByText('Boshqa davrni yuqoridan tanlang.')).toBeDefined()
  // Oldingi oyda `›` ishlaydi va joriy oyga qaytaradi.
  expect((tugma('Keyingi oy') as HTMLButtonElement).disabled).toBe(false)
})

it('boshqa boʻlimga oʻtib qaytilsa hisobot yana joriy oy bilan ochiladi (dizayn 2-boʻlim)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await hisobotniOch(odam)
  await odam.click(tugma('Oldingi oy'))
  await waitFor(() => {
    expect(screen.queryByText(joriyOyNomi())).toBeNull()
  })

  await odam.click(tugma('Yozuvlar'))
  await hisobotniOch(odam)
  expect(screen.getByText(joriyOyNomi())).toBeDefined()
})

it('bir valyutali daftarda ≈ qatori ham, kurs soʻrovi ham chizilmaydi (0038)', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi({ turi: 'kirim', summa: 8000000, kategoriyaId: 'oylik' })
  render(<App />)

  await hisobotniOch(odam)

  await waitFor(() => {
    expect(within(bolak('Jami kirim')).getByText('+8 000 000 soʻm')).toBeDefined()
  })
  expect(screen.queryByText(/≈/)).toBeNull()
  expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()
})

it('mezon 9, 20 — aralash valyutali oyda ≈ qatori yozuv kursi bilan chiqadi (0044)', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi({ turi: 'kirim', summa: 8000000, kategoriyaId: 'oylik' })
  // Dollardagi yozuv kursi bilan saqlanadi (0023) — «oxirgi kurs» oʻshandan chiqadi.
  await yozuvSepdi({
    turi: 'kirim',
    summa: 20000,
    kategoriyaId: 'oylik',
    valyuta: 'dollar',
    kurs: 12500,
  })
  render(<App />)

  await hisobotniOch(odam)

  await waitFor(() => {
    expect(within(bolak('Jami kirim')).getByText('+200,00 $')).toBeDefined()
  })
  const kirim = bolak('Jami kirim')
  expect(within(kirim).getByText('+8 000 000 soʻm')).toBeDefined()
  // 8 000 000 + 200,00 $ × 12 500 = 10 500 000
  expect(within(kirim).getByText('≈ +10 500 000 soʻm')).toBeDefined()
  expect(within(kirim).getByText('taxminiy · 1 $ = 12 500 soʻm')).toBeDefined()
  // Kurs daftarda bor — soʻrov bloki umuman chizilmaydi (dizayn 3-boʻlim).
  expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()
})
