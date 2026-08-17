// Zaxiraning ilova darajasidagi ulash testlari: navigatsiya, doʻkon va import oqimi
// birga ishlaydimi.
//
// Soxta maʼlumot yoʻq — eksport, tekshirish, tasdiq va import `data/zaxira.ts` orqali
// haqiqiy bazadan oʻtadi (`fake-indexeddb`). Faqat **faylni yuklab olish** almashtirilgan:
// jsdom da haqiqiy yuklash yoʻq, shuning uchun chiqarilgan matn shu yerda ushlab qolinadi
// va tasdiq qadamida oʻsha fayl qaytarib beriladi — brauzerdagi yoʻlning aynan oʻzi.
//
// Mezonlar: `prds/zaxira.md` → 11, 11b, 13, 15, 17a, 17e, 18, 24e; 0063 (navigatsiya).

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { App } from './App.tsx'
import { bazaniTozala, hammaKontaktlar } from './data/qarzlar.ts'
import { hammaYozuvlar, yozuvQosh } from './data/yozuvlar.ts'
import { bugun } from './domain/sana.ts'
import type { YangiYozuv } from './domain/turlar.ts'

/** Yuklab olingan fayllar — `faylniYuklabOl` oʻrniga qoʻyiladi. */
const yuklanganlar: { nom: string; matn: string }[] = []

vi.mock('./ui/yuklash.ts', () => ({
  faylniYuklabOl: (nom: string, matn: string) => {
    yuklanganlar.push({ nom, matn })
  },
}))

beforeEach(() => {
  yuklanganlar.length = 0
})

afterEach(async () => {
  cleanup()
  await bazaniTozala()
})

type Odam = ReturnType<typeof userEvent.setup>

function tugma(nom: string): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

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

async function zaxiraniOch(odam: Odam): Promise<void> {
  await odam.click(await screen.findByRole('button', { name: 'Zaxira' }))
  await screen.findByRole('heading', { name: 'Zaxira', level: 1 })
}

/** Yuklab olingan faylni qaytarib tanlash — brauzerdagi «faylni tanlash» ning oʻzi. */
async function faylniQaytar(odam: Odam, yorliq: string, indeks: number): Promise<void> {
  const yuklangan = yuklanganlar[indeks]
  if (yuklangan === undefined) {
    throw new Error(`${String(indeks)}-fayl yuklab olinmagan`)
  }
  await odam.upload(
    screen.getByLabelText(yorliq),
    new File([yuklangan.matn], yuklangan.nom, { type: 'application/json' }),
  )
}

it('0063 — «Zaxira» boʻlagi ekranni ochadi va boʻlim faol boʻlib qoladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await zaxiraniOch(odam)
  expect(tugma('Zaxira').getAttribute('aria-current')).toBe('page')
  expect(screen.getByRole('heading', { name: 'Zaxira olish', level: 2 })).toBeDefined()
})

it('mezon 11 — hech qachon eksport qilinmagan daftarda holat qatori shuni aytadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await zaxiraniOch(odam)
  expect(await screen.findByText('Hali zaxira olinmagan.')).toBeDefined()
})

it('mezon 9 — «Eksport» fayl beradi va holat qatori «Bugun» ga oʻtadi', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi()
  render(<App />)

  await zaxiraniOch(odam)
  await odam.click(tugma('Eksport'))

  expect(await screen.findByText('Oxirgi zaxira: Bugun')).toBeDefined()
  expect(yuklanganlar).toHaveLength(1)
  expect(yuklanganlar[0]?.nom).toMatch(/^daftar-zaxira-\d{4}-\d{2}-\d{2}-\d{4}\.json$/)
  expect(screen.getByText(`Fayl yuklab olindi: ${yuklanganlar[0]?.nom ?? ''}`)).toBeDefined()
})

it('mezon 13, 17a, 18, 24e — toʻliq davra: eksport → oʻzgartirish → import', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi({ summa: 45000 })
  render(<App />)

  await zaxiraniOch(odam)
  await odam.click(tugma('Eksport'))
  await screen.findByText(/Fayl yuklab olindi/)

  // Eksportdan keyin daftar oʻzgaradi: yana bitta yozuv qoʻshiladi.
  await yozuvSepdi({ summa: 90000, kategoriyaId: 'transport' })
  expect(await hammaYozuvlar()).toHaveLength(2)

  // Import: 1-qadam — eksport fayli tanlanadi.
  await odam.click(tugma('Import'))
  await faylniQaytar(odam, 'Tiklanadigan fayl', 0)

  // 2-qadam avtomatik: zaxira chiqadi va oxirgi eksport sanasi yangilanadi (11b).
  expect(await screen.findByText('Hozirgi maʼlumot faylga chiqarildi.')).toBeDefined()
  await waitFor(() => {
    expect(yuklanganlar).toHaveLength(2)
  })
  expect(yuklanganlar[1]?.nom).toMatch(/^daftar-import-oldidan-/)
  // Bu nuqtada daftar hali oʻzgarmagan (17m).
  expect(await hammaYozuvlar()).toHaveLength(2)

  // 3-qadam — oʻsha faylni qaytarib tanlash (0041).
  await faylniQaytar(odam, 'Zaxira fayli', 1)

  expect(await screen.findByText('Daftar fayldan tiklandi.')).toBeDefined()
  expect(screen.getByText('1 yozuv · 0 kontakt · 0 qarz · 0 toʻlov')).toBeDefined()
  // Mezon 18: fayldagi holat tiklandi — ikkinchi yozuv qolmadi.
  const yozuvlar = await hammaYozuvlar()
  expect(yozuvlar).toHaveLength(1)
  expect(yozuvlar[0]?.summa).toBe(45000)
})

it('importdan keyin boshqa ekranlar yangi maʼlumotni koʻrsatadi (spec 24, 25)', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi({ summa: 45000 })
  render(<App />)

  await zaxiraniOch(odam)
  await odam.click(tugma('Eksport'))
  await screen.findByText(/Fayl yuklab olindi/)

  await yozuvSepdi({ summa: 90000, kategoriyaId: 'transport' })

  await odam.click(tugma('Import'))
  await faylniQaytar(odam, 'Tiklanadigan fayl', 0)
  await screen.findByText('Hozirgi maʼlumot faylga chiqarildi.')
  await faylniQaytar(odam, 'Zaxira fayli', 1)
  await screen.findByText('Daftar fayldan tiklandi.')

  // «Yozuvlarni koʻrish» roʻyxatni ochadi va u fayldagi holatni koʻrsatadi.
  await odam.click(tugma('Yozuvlarni koʻrish'))
  expect(await screen.findByText('−45 000 soʻm')).toBeDefined()
  expect(screen.queryByText('−90 000 soʻm')).toBeNull()
})

it('mezon 17e — boʻsh daftarda import bir qadamda oʻtadi', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi()
  render(<App />)

  // Avval toʻla daftardan fayl olinadi.
  await zaxiraniOch(odam)
  await odam.click(tugma('Eksport'))
  await screen.findByText(/Fayl yuklab olindi/)

  // Keyin daftar tozalanadi — endi «boʻsh daftar» istisnosi ishlaydi (0055).
  await bazaniTozala()
  await odam.click(tugma('Yozuvlar'))
  await zaxiraniOch(odam)
  expect(
    await screen.findByText('Daftar boʻsh — yoʻqoladigan maʼlumot yoʻq, import bir qadamda oʻtadi.'),
  ).toBeDefined()

  const oldingiSoni = yuklanganlar.length
  await odam.click(tugma('Import'))
  await faylniQaytar(odam, 'Tiklanadigan fayl', 0)

  expect(await screen.findByText('Daftar fayldan tiklandi.')).toBeDefined()
  // Avtomatik zaxira chiqarilmadi va tasdiq soʻralmadi.
  expect(yuklanganlar).toHaveLength(oldingiSoni)
  expect(await hammaYozuvlar()).toHaveLength(1)
  expect(await hammaKontaktlar()).toHaveLength(0)
})

it('ekrandan chiqib qaytilsa oqim bekor boʻladi (0065; 17l-mezon)', async () => {
  const odam = userEvent.setup()
  await yozuvSepdi()
  render(<App />)

  await zaxiraniOch(odam)
  await odam.click(tugma('Eksport'))
  await screen.findByText(/Fayl yuklab olindi/)

  await odam.click(tugma('Import'))
  await faylniQaytar(odam, 'Tiklanadigan fayl', 0)
  await screen.findByText('Hozirgi maʼlumot faylga chiqarildi.')

  // Boshqa boʻlimga oʻtib qaytiladi — oqim saqlanmaydi.
  await odam.click(tugma('Yozuvlar'))
  await zaxiraniOch(odam)

  expect(screen.queryByText('Hozirgi maʼlumot faylga chiqarildi.')).toBeNull()
  expect(tugma('Import')).toBeDefined()
  // Oxirgi eksport sanasi yangilangan boʻlib qoladi (0054; 11c-mezon).
  expect(await screen.findByText('Oxirgi zaxira: Bugun')).toBeDefined()
})
