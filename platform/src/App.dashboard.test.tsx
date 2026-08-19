// Bosh sahifa (dashboard) — ilova darajasidagi ulash testlari: doʻkon, ekranlar va
// oʻtishlar birga ishlaydimi.
//
// Spec: `specs/001-dashboard/spec.md`; «mezon N» — prds/dashboard.md roʻyxati.
// Soxta maʼlumot yoʻq: hammasi `data/` doʻkonlari orqali bazadan oʻtadi
// (`fake-indexeddb`, `src/test/setup.ts`).

import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { App } from './App.tsx'
import { bazaniTozala } from './data/yozuvlar.ts'
import { oxirgiEksportniQoy } from './data/sozlamalar.ts'
import { kunMatni } from './domain/sana.ts'
import { navbatBoshasin } from './test/navbat.ts'

afterEach(async () => {
  cleanup()
  // Doʻkonga boshlangan ish tugasin — tozalash uning oʻrtasiga tushmasin.
  await navbatBoshasin()
  await bazaniTozala()
})

type Odam = ReturnType<typeof userEvent.setup>

function tugma(nom: string | RegExp): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

function bolim(nom: string): HTMLElement {
  return screen.getByRole('region', { name: nom })
}

function kun(qadam: number): string {
  const vaqt = new Date()
  vaqt.setDate(vaqt.getDate() + qadam)
  return kunMatni(vaqt)
}

/** Bosh sahifa ochilishini kutadi — ilova shu ekran bilan ochiladi (mezon 1). */
async function boshniKutdi(): Promise<void> {
  await screen.findByRole('heading', { name: 'Daftar', level: 1 })
}

async function boshgaOtdi(odam: Odam): Promise<void> {
  await odam.click(await screen.findByRole('button', { name: 'Bosh' }))
  await boshniKutdi()
}

/** «＋ Yozuv» bilan formani ochadi (mezon 19). */
async function formaniOchdi(odam: Odam): Promise<void> {
  await odam.click(await screen.findByRole('button', { name: '＋ Yozuv' }))
  await screen.findByRole('heading', { name: 'Yangi yozuv', level: 1 })
}

/** Bosh sahifadan yozuv qoʻshadi va bosh sahifaga qaytishini kutadi. */
async function yozuvQoshdi(
  odam: Odam,
  qism: {
    turi: 'Chiqim' | 'Kirim'
    summa: string
    hisob?: 'Naqd'
    valyuta?: 'dollar'
    kurs?: string
  },
): Promise<void> {
  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: qism.turi }))
  await odam.type(screen.getByLabelText('Summa'), qism.summa)
  if (qism.hisob !== undefined) {
    await odam.click(tugma(qism.hisob))
  }
  if (qism.valyuta !== undefined) {
    await odam.click(tugma(qism.valyuta))
    await odam.type(screen.getByLabelText('Kurs — 1 dollar necha soʻm'), qism.kurs ?? '12500')
  }
  await odam.click(
    await screen.findByRole('button', { name: qism.turi === 'Chiqim' ? 'oziq-ovqat' : 'oylik' }),
  )
  await odam.click(tugma('Saqlash'))
  await boshniKutdi()
}

/** «Qarz daftari» orqali kontakt va qarz qoʻshadi, soʻng bosh sahifaga qaytadi. */
async function qarzQoshdi(
  odam: Odam,
  ism: string,
  summa: string,
  yonalish: 'Berdim' | 'Oldim',
  valyuta?: 'dollar',
): Promise<void> {
  await odam.click(await screen.findByRole('button', { name: 'Qarz daftari' }))
  await screen.findByRole('heading', { name: 'Qarz daftari', level: 1 })
  const bor = screen.queryByRole('button', { name: new RegExp(ism) })
  if (bor === null) {
    await odam.click(tugma('＋ Yangi kontakt'))
    await odam.type(screen.getByLabelText('Ism'), ism)
    await odam.click(tugma('Qoʻshish'))
  }
  await odam.click(await screen.findByRole('button', { name: new RegExp(ism) }))
  await screen.findByRole('heading', { name: ism, level: 1 })
  await odam.click(tugma('＋ Yangi qarz'))
  await screen.findByRole('heading', { name: 'Yangi qarz', level: 1 })
  if (valyuta !== undefined) {
    await odam.click(tugma(valyuta))
  }
  await odam.type(screen.getByLabelText('Summa'), summa)
  await odam.click(tugma(yonalish))
  await odam.click(tugma('Saqlash'))
  await screen.findByRole('heading', { name: ism, level: 1 })
  await boshgaOtdi(odam)
}

it('mezon 1 — ilova parol soʻramasdan darhol bosh sahifa bilan ochiladi', async () => {
  render(<App />)

  await boshniKutdi()
  expect(screen.queryByLabelText(/parol|PIN/i)).toBeNull()
  // Navigatsiya koʻrinadi, faol boʻlim — «Bosh»; alohida «Yozuv» bandi yoʻq (FR-013).
  expect(tugma('Bosh').getAttribute('aria-current')).toBe('page')
  expect(screen.queryByRole('button', { name: 'Yozuv' })).toBeNull()
  // Boʻsh daftarda qoldiq nol (mezon 2) — birinchi oʻqish navbatdan oʻtishi kutiladi.
  expect((await within(bolim('Qoldiq')).findAllByText('0 soʻm')).length).toBeGreaterThan(0)
})

it('mezon 3, 8, 10 — chiqim qoldiqni kamaytiradi, oy va roʻyxatda darhol koʻrinadi', async () => {
  const odam = userEvent.setup()
  render(<App />)
  await boshniKutdi()

  await yozuvQoshdi(odam, { turi: 'Chiqim', summa: '45000' })

  // Umumiy qoldiqda ham, karta qatorida ham koʻrinadi — ikkalasi ham shu summa.
  expect(
    (await within(bolim('Qoldiq')).findAllByText('−45 000 soʻm')).length,
  ).toBeGreaterThan(0)
  const oy = bolim('Joriy oy')
  expect(within(oy).getByText('Chiqim').closest('li')?.textContent).toContain('−45 000 soʻm')
  expect(within(bolim('Oxirgi yozuvlar')).getByText('oziq-ovqat')).toBeDefined()
})

it('mezon 4, 7 — kirim qoldiqni oshiradi va joriy oy kirimiga tushadi', async () => {
  const odam = userEvent.setup()
  render(<App />)
  await boshniKutdi()

  await yozuvQoshdi(odam, { turi: 'Chiqim', summa: '45000' })
  await yozuvQoshdi(odam, { turi: 'Kirim', summa: '100000' })

  expect((await within(bolim('Qoldiq')).findAllByText('55 000 soʻm')).length).toBeGreaterThan(0)
  const oy = bolim('Joriy oy')
  expect(within(oy).getByText('Kirim').closest('li')?.textContent).toContain('+100 000 soʻm')
})

it('mezon 12b — naqd va karta qoldiqlari yigʻindisi umumiy qoldiqqa teng koʻrinadi', async () => {
  const odam = userEvent.setup()
  render(<App />)
  await boshniKutdi()

  await yozuvQoshdi(odam, { turi: 'Chiqim', summa: '30000', hisob: 'Naqd' })
  await yozuvQoshdi(odam, { turi: 'Kirim', summa: '100000' })

  const qoldiq = bolim('Qoldiq')
  expect(await within(qoldiq).findByText('70 000 soʻm')).toBeDefined()
  expect(within(qoldiq).getByText('Naqd').closest('li')?.textContent).toContain('−30 000 soʻm')
  expect(within(qoldiq).getByText('Karta').closest('li')?.textContent).toContain('100 000 soʻm')
})

it('mezon 5, 6, 11 — qarz qoldiqqa taʼsir qiladi, lekin alohida raqam boʻlib koʻrinmaydi', async () => {
  const odam = userEvent.setup()
  render(<App />)
  await boshniKutdi()

  await qarzQoshdi(odam, 'Akmal', '200000', 'Berdim')
  expect(
    (await within(bolim('Qoldiq')).findAllByText('−200 000 soʻm')).length,
  ).toBeGreaterThan(0)

  await qarzQoshdi(odam, 'Akmal', '500000', 'Oldim')
  expect(
    (await within(bolim('Qoldiq')).findAllByText('300 000 soʻm')).length,
  ).toBeGreaterThan(0)

  // Qarz soʻzi ham, qarz qoldigʻi ham bosh sahifada alohida koʻrinmaydi (PRD 28) —
  // navigatsiya bandidan tashqari.
  expect(within(bolim('Qoldiq')).queryByText(/qarz/i)).toBeNull()
  expect(within(bolim('Joriy oy')).queryByText(/qarz/i)).toBeNull()
})

it('mezon 14, 14a — kurs bir marta soʻraladi, kiritilgach jami chiqadi va takrorlanmaydi', async () => {
  const odam = userEvent.setup()
  const birinchi = render(<App />)
  await boshniKutdi()

  // Dollar qarz olinadi — qarzda kurs soʻralmaydi (0023), daftarda esa kurs yoʻq.
  await qarzQoshdi(odam, 'Karim', '100', 'Oldim', 'dollar')

  expect(
    await screen.findByText('Taxminiy jamini koʻrsatish uchun kurs kerak.'),
  ).toBeDefined()
  await odam.type(await screen.findByLabelText('Kurs — 1 dollar necha soʻm'), '12500')
  await odam.click(tugma('Saqlash'))

  expect(await screen.findByText('≈ 1 250 000 soʻm')).toBeDefined()
  expect(screen.getByText('taxminiy · 1 $ = 12 500 soʻm')).toBeDefined()

  // 14a — ilova qayta ochilganda kurs qayta soʻralmaydi (0043).
  birinchi.unmount()
  await navbatBoshasin()
  render(<App />)
  await boshniKutdi()
  expect(await screen.findByText('≈ 1 250 000 soʻm')).toBeDefined()
  expect(screen.queryByText('Taxminiy jamini koʻrsatish uchun kurs kerak.')).toBeNull()
})

it('FR-006 — eng kech sanali kurs gʻolib: yangi yozuv kursi qoʻlda kiritilganini almashtiradi', async () => {
  const odam = userEvent.setup()
  render(<App />)
  await boshniKutdi()

  await qarzQoshdi(odam, 'Karim', '100', 'Oldim', 'dollar')
  await odam.type(await screen.findByLabelText('Kurs — 1 dollar necha soʻm'), '12500')
  await odam.click(tugma('Saqlash'))
  await screen.findByText('≈ 1 250 000 soʻm')

  // Bugungi sanali dollar yozuvi kursi qoʻlda kiritilgandan gʻolib (0044, 0066).
  await yozuvQoshdi(odam, { turi: 'Chiqim', summa: '5', valyuta: 'dollar', kurs: '12000' })

  expect(await screen.findByText(/1 \$ = 12 000 soʻm/)).toBeDefined()
})

it('mezon 15, 16, 18 — zaxira eslatmasi shartga qarab koʻrinadi va yoʻqoladi', async () => {
  const odam = userEvent.setup()
  render(<App />)
  await boshniKutdi()

  // Hech qachon eksport qilinmagan — eslatma bor (mezon 15).
  expect(
    await screen.findByText('Daftar hali zaxira qilinmagan — «Zaxira» boʻlimidan eksport qiling.'),
  ).toBeDefined()

  // Eksportdan keyin eslatma yoʻqoladi (mezon 16).
  await odam.click(tugma('Zaxira'))
  await screen.findByRole('heading', { name: 'Zaxira', level: 1 })
  await odam.click(await screen.findByRole('button', { name: 'Eksport' }))
  await screen.findByText(/Fayl yuklab olindi/)
  await boshgaOtdi(odam)
  expect(screen.queryByText(/zaxira qilinmagan|30 kun oʻtdi/)).toBeNull()

  // Oxirgi eksport eskirsa eslatma qaytadi (mezon 18) — sana doʻkon orqali eskirtiriladi.
  await navbatBoshasin()
  await oxirgiEksportniQoy(kun(-31))
  await odam.click(tugma('Yozuvlar'))
  await boshgaOtdi(odam)
  expect(
    await screen.findByText('Oxirgi zaxiradan 30 kun oʻtdi — «Zaxira» boʻlimidan yangisini oling.'),
  ).toBeDefined()
})

it('mezon 19, 20 — «＋ Yozuv» formani ochadi va bosh sahifaga qaytaradi; «Hammasi ›» roʻyxatga olib boradi', async () => {
  const odam = userEvent.setup()
  render(<App />)
  await boshniKutdi()

  // Forma bosh sahifadan ochilib, `×` bilan bosh sahifaga qaytadi (uslub qoidasi).
  await formaniOchdi(odam)
  expect(screen.queryByRole('navigation')).toBeNull()
  await odam.click(tugma('Yopish'))
  await boshniKutdi()

  // «Hammasi ›» toʻliq roʻyxatni ochadi (PRD 15a).
  await yozuvQoshdi(odam, { turi: 'Chiqim', summa: '45000' })
  await odam.click(tugma('Hammasi ›'))
  expect(await screen.findByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeDefined()

  // Yozuvlar ekranidan ochilgan tahrir yana Yozuvlarga qaytadi (oʻzi kelgan ekranga).
  await odam.click(await screen.findByRole('button', { name: /oziq-ovqat/ }))
  await screen.findByRole('heading', { name: 'Yozuvni tahrirlash', level: 1 })
  await odam.click(tugma('Yopish'))
  expect(await screen.findByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeDefined()
})
