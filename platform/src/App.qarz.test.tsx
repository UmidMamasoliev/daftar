// Qarz daftarining ilova darajasidagi ulash testlari: ekranlar, doʻkon va oʻtishlar
// birga ishlaydimi.
//
// Bu yerda soxta maʼlumot yoʻq — hammasi `data/qarzlar.ts` orqali bazadan oʻtadi
// (`fake-indexeddb`, `src/test/setup.ts`). Mezonlar: `prds/qarz-daftari.md` → 3, 4, 5,
// 8, 9, 17, 18, 23, 26, 27, 28, 30, 31, 33, 33a, 33b, 33d, 34, 35, 37, 42; va 0063
// navigatsiyasi.
//
// «Qaytarish» muddati (7 soniya) shu yerda tekshirilmaydi: soxta soat IndexedDB ga
// xalaqit beradi. U ekran darajasida — `src/ui/Kontakt.test.tsx` va
// `src/ui/QarzDaftari.test.tsx` da.

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { App } from './App.tsx'
import {
  bazaniTozala,
  hammaKontaktlar,
  hammaQarzlar,
  hammaTolovlar,
  kontaktniOchir,
  tolovSaqla,
} from './data/qarzlar.ts'
import { bugun, kunMatni } from './domain/sana.ts'

afterEach(async () => {
  cleanup()
  await bazaniTozala()
})

type Odam = ReturnType<typeof userEvent.setup>

function tugma(nom: string | RegExp): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

function kun(qadam: number): string {
  const vaqt = new Date()
  vaqt.setDate(vaqt.getDate() + qadam)
  return kunMatni(vaqt)
}

/** Pastdagi vaqtinchalik navigatsiya panelidan «Qarz daftari» boʻlimiga oʻtadi (0063). */
async function daftarniOchdi(odam: Odam): Promise<void> {
  await odam.click(await screen.findByRole('button', { name: 'Qarz daftari' }))
  await screen.findByRole('heading', { name: 'Qarz daftari', level: 1 })
}

async function kontaktQoshdi(odam: Odam, ism: string): Promise<void> {
  await odam.click(tugma('＋ Yangi kontakt'))
  await odam.type(screen.getByLabelText('Ism'), ism)
  await odam.click(tugma('Qoʻshish'))
  await waitFor(() => {
    expect(screen.queryByLabelText('Ism')).toBeNull()
  })
}

async function kontaktniOchdi(odam: Odam, ism: string): Promise<void> {
  await odam.click(await screen.findByRole('button', { name: new RegExp(ism) }))
  await screen.findByRole('heading', { name: ism, level: 1 })
}

async function qarzQoshdi(
  odam: Odam,
  summa: string,
  yonalish: 'Berdim' | 'Oldim',
  valyuta?: 'dollar',
): Promise<void> {
  await odam.click(tugma('＋ Yangi qarz'))
  await screen.findByRole('heading', { name: 'Yangi qarz', level: 1 })
  if (valyuta !== undefined) {
    await odam.click(tugma(valyuta))
  }
  await odam.type(screen.getByLabelText('Summa'), summa)
  await odam.click(tugma(yonalish))
  await odam.click(tugma('Saqlash'))
  await waitFor(() => {
    expect(screen.queryByRole('heading', { name: 'Yangi qarz', level: 1 })).toBeNull()
  })
}

async function tolovQoshdi(odam: Odam, summa: string): Promise<void> {
  await odam.click(tugma('＋ Toʻlov'))
  await screen.findByRole('heading', { name: 'Toʻlov', level: 1 })
  await odam.type(screen.getByLabelText('Summa'), summa)
  await odam.click(tugma('Saqlash'))
  await waitFor(() => {
    expect(screen.queryByRole('heading', { name: 'Toʻlov', level: 1 })).toBeNull()
  })
}

/** Kontakt yaratib, uning sahifasini ochadi — koʻp testga kerak boʻlgan tayyorgarlik. */
async function akmalgaKirdi(odam: Odam, ism = 'Akmal'): Promise<void> {
  await daftarniOchdi(odam)
  await kontaktQoshdi(odam, ism)
  await kontaktniOchdi(odam, ism)
}

// ─── Navigatsiya (0063) ─────────────────────────────────────────────────────

it('0063 — «Qarz daftari» boʻlagi roʻyxatni ochadi va boʻlim faol boʻlib qoladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await daftarniOchdi(odam)
  expect(tugma('Qarz daftari').getAttribute('aria-current')).toBe('page')
  expect(tugma('Yozuvlar').getAttribute('aria-current')).toBeNull()
})

it('0063 — «Kontakt» sahifasida faol boʻlim «Qarz daftari» boʻlib qoladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  expect(tugma('Qarz daftari').getAttribute('aria-current')).toBe('page')
})

it('0063 — forma ekranlarida navigatsiya paneli koʻrinmaydi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  expect(screen.getByRole('navigation')).toBeDefined()

  await odam.click(tugma('＋ Yangi qarz'))
  await screen.findByRole('heading', { name: 'Yangi qarz', level: 1 })
  expect(screen.queryByRole('navigation')).toBeNull()

  await odam.click(tugma('Yopish'))
  await screen.findByRole('heading', { name: 'Akmal', level: 1 })
  expect(screen.getByRole('navigation')).toBeDefined()
})

// ─── Qarz qoʻshish (mezon 3, 4, 5) ──────────────────────────────────────────

it('mezon 3 — «berdim» qarzi kontakt ostida koʻrinadi va netto «olaman» boʻladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')

  expect(await screen.findByText('Berdim')).toBeDefined()
  expect(screen.getByText('olaman')).toBeDefined()
  expect(screen.getAllByText('+1 000 000 soʻm')).toHaveLength(2)
  expect(await hammaQarzlar()).toHaveLength(1)
})

it('mezon 4 — «oldim» qarzi netto «beraman» boʻlib koʻrinadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '50000', 'Oldim')

  expect(await screen.findByText('Oldim')).toBeDefined()
  expect(screen.getByText('beraman')).toBeDefined()
  expect(screen.getAllByText('−50 000 soʻm')).toHaveLength(2)
})

it('mezon 5, 8, 9 — toʻlov qoldiqni kamaytiradi, oʻchirish qaytaradi, «QAYTARISH» tiklaydi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')
  await tolovQoshdi(odam, '300000')

  // Mezon 5: qoldiq 700 000 soʻm.
  expect(await screen.findByText('−300 000 soʻm')).toBeDefined()
  expect(screen.getAllByText('+700 000 soʻm')).toHaveLength(2)

  // Mezon 8: toʻlov oʻchirilsa qoldiq darhol oʻsha summaga ortadi.
  const qator = screen
    .getAllByRole('listitem')
    .find((q) => q.className.includes('tolov-qator')) as HTMLElement
  await odam.hover(qator)
  await odam.click(tugma('Oʻchirish'))

  expect(await screen.findByText('Toʻlov oʻchirildi')).toBeDefined()
  await waitFor(() => {
    expect(screen.getAllByText('+1 000 000 soʻm')).toHaveLength(2)
  })
  expect(await hammaTolovlar()).toHaveLength(0)

  // Mezon 9: «QAYTARISH» toʻlovni ham, qoldiqni ham tiklaydi.
  await odam.click(tugma('QAYTARISH'))
  await waitFor(() => {
    expect(screen.getAllByText('+700 000 soʻm')).toHaveLength(2)
  })
  expect(await hammaTolovlar()).toHaveLength(1)
})

// ─── Toʻlov chegarasi (mezon 37, 42) ────────────────────────────────────────

it('mezon 37, 42 — chegara ichida oshgan toʻlov qarzni yopadi va «＋ Toʻlov» yoʻqoladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')
  await tolovQoshdi(odam, '300000')
  await tolovQoshdi(odam, '700100')

  expect(await screen.findByText('Yopilgan')).toBeDefined()
  expect(screen.getByText('Ochiq qarz yoʻq.')).toBeDefined()
  // Mezon 40: manfiy raqam hech qayerda koʻrinmaydi.
  expect(screen.queryByText(/−100 soʻm$/)).toBeNull()
  expect(screen.queryByRole('button', { name: '＋ Toʻlov' })).toBeNull()

  // Toʻlov oʻchirilib qoldiq chegaradan oshsa tugma oʻzi qaytadi (8b).
  const qator = screen
    .getAllByRole('listitem')
    .find((q) => q.className.includes('tolov-qator') && q.textContent?.includes('−700 100')) as HTMLElement
  await odam.hover(qator)
  await odam.click(tugma('Oʻchirish'))

  expect(await screen.findByRole('button', { name: '＋ Toʻlov' })).toBeDefined()
})

// ─── Qarzni tahrirlash (mezon 27, 28, 30, 31, 33, 33a, 33b, 33d) ────────────

async function kartochkaniOchdi(odam: Odam): Promise<void> {
  await odam.click(await screen.findByRole('button', { name: /Berdim|Oldim/ }))
  await screen.findByRole('heading', { name: 'Qarzni tahrirlash', level: 1 })
}

async function summaniOzgartirdi(odam: Odam, yangi: string): Promise<void> {
  const summa = screen.getByLabelText('Summa')
  await odam.clear(summa)
  await odam.type(summa, yangi)
  await odam.click(tugma('Saqlash'))
}

it('mezon 27 — summa 800 000 ga tahrirlansa qoldiq 500 000 soʻm boʻladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')
  await tolovQoshdi(odam, '300000')

  await kartochkaniOchdi(odam)
  await summaniOzgartirdi(odam, '800000')

  await waitFor(() => {
    expect(screen.getAllByText('+500 000 soʻm')).toHaveLength(2)
  })
  expect(screen.getByText('Bugun · Karta · boshlangʻich 800 000 soʻm')).toBeDefined()
})

it('mezon 33 — summa toʻlangan yigʻindiga tenglashtirilsa qarz «Yopilgan» boʻladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')
  await tolovQoshdi(odam, '300000')

  await kartochkaniOchdi(odam)
  await summaniOzgartirdi(odam, '300000')

  expect(await screen.findByText('Yopilgan')).toBeDefined()
  expect(screen.getByText('Ochiq qarz yoʻq.')).toBeDefined()
})

it('mezon 33b — chegara ichidagi farq (299 900) qabul qilinadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')
  await tolovQoshdi(odam, '300000')

  await kartochkaniOchdi(odam)
  await summaniOzgartirdi(odam, '299900')

  expect(await screen.findByText('Yopilgan')).toBeDefined()
  expect((await hammaQarzlar())[0]?.summa).toBe(299900)
})

it('mezon 33a, 33d — chegaradan koʻp past summa rad etiladi va hech narsa oʻzgarmaydi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')
  await tolovQoshdi(odam, '300000')

  await kartochkaniOchdi(odam)
  await summaniOzgartirdi(odam, '299899')

  expect(
    await screen.findByText('Qarz summasi toʻlovlardan kichik — toʻlangan: 300 000 soʻm.'),
  ).toBeDefined()
  // Forma yopilmaydi va doʻkon tegilmaydi (33d).
  expect(screen.getByRole('heading', { name: 'Qarzni tahrirlash', level: 1 })).toBeDefined()
  expect((await hammaQarzlar())[0]?.summa).toBe(1000000)
  expect(await hammaTolovlar()).toHaveLength(1)
})

it('mezon 28 — yoʻnalish tahrirlansa netto qarama-qarshi tomonga oʻtadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')

  await kartochkaniOchdi(odam)
  await odam.click(tugma('Oldim'))
  await odam.click(tugma('Saqlash'))

  expect(await screen.findByText('beraman')).toBeDefined()
  expect(screen.getAllByText('−1 000 000 soʻm')).toHaveLength(2)
  expect(screen.queryByText('olaman')).toBeNull()
})

it('mezon 31 — toʻlovi yoʻq qarzning valyutasi dollarga oʻzgartiriladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')

  await kartochkaniOchdi(odam)
  await odam.click(tugma('dollar'))
  await summaniOzgartirdi(odam, '100,00')

  // Netto bloki va kartochka — ikkalasi ham endi dollarda (mezon 11).
  await waitFor(() => {
    expect(screen.getAllByText('+100,00 $')).toHaveLength(2)
  })
  expect(screen.queryByText('+1 000 000 soʻm')).toBeNull()
  expect((await hammaQarzlar())[0]).toMatchObject({ valyuta: 'dollar', summa: 10000 })
})

it('mezon 30 — sana tahrirlansa kartochka roʻyxatda yangi oʻrniga oʻtadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '100000', 'Berdim')
  await qarzQoshdi(odam, '200000', 'Oldim')

  // Ikkalasi ham bugungi kun bilan: oxirgi kiritilgani yuqorida (0047).
  const boshi = screen
    .getAllByRole('listitem')
    .filter((q) => q.className.includes('qarz-kartochka'))
  expect(boshi[0]?.textContent).toContain('−200 000 soʻm')

  // Yuqoridagi qarzning sanasi uch kun orqaga suriladi.
  await odam.click(await screen.findByRole('button', { name: /Oldim/ }))
  await screen.findByRole('heading', { name: 'Qarzni tahrirlash', level: 1 })
  const sana = screen.getByLabelText('Sana')
  await odam.clear(sana)
  await odam.type(sana, kun(-3))
  const yaratilganAvval = (await hammaQarzlar()).map((q) => q.yaratilgan).sort()
  await odam.click(tugma('Saqlash'))

  await waitFor(() => {
    const keyin = screen
      .getAllByRole('listitem')
      .filter((q) => q.className.includes('qarz-kartochka'))
    expect(keyin[0]?.textContent).toContain('+100 000 soʻm')
  })
  // `yaratilgan` tahrirda oʻzgarmaydi (0047).
  expect((await hammaQarzlar()).map((q) => q.yaratilgan).sort()).toEqual(yaratilganAvval)
})

// ─── Qarzni oʻchirish (mezon 34, 35) ────────────────────────────────────────

it('mezon 34, 35 — qarz toʻlovlari bilan oʻchadi va «QAYTARISH» ikkalasini qaytaradi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')
  await tolovQoshdi(odam, '300000')

  await odam.hover(await screen.findByRole('button', { name: /Berdim/ }))
  await odam.click(tugma('Oʻchirish'))

  expect(await screen.findByText('Qarz oʻchirildi')).toBeDefined()
  await waitFor(async () => {
    expect(await hammaQarzlar()).toHaveLength(0)
  })
  expect(await hammaTolovlar()).toHaveLength(0)
  expect(screen.getByText('Bu kontaktda hali qarz yoʻq.')).toBeDefined()

  await odam.click(tugma('QAYTARISH'))
  await waitFor(async () => {
    expect(await hammaQarzlar()).toHaveLength(1)
  })
  expect(await hammaTolovlar()).toHaveLength(1)
  expect(await screen.findByText('−300 000 soʻm')).toBeDefined()
  expect(screen.getAllByText('+700 000 soʻm')).toHaveLength(2)
})

// ─── Kontakt (mezon 17, 18, 23, 26) ─────────────────────────────────────────

it('mezon 17, 18 — hamma qarzi yopilgan kontakt oʻchadi, «QAYTARISH» tarixi bilan qaytaradi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')
  await tolovQoshdi(odam, '1000000')

  await odam.click(tugma('Kontaktni oʻchirish'))

  // Ekran roʻyxatga qaytadi va panel oʻsha yerda chiqadi (dizayn 2-boʻlim).
  expect(await screen.findByText('Kontakt oʻchirildi')).toBeDefined()
  expect(screen.getByRole('heading', { name: 'Qarz daftari', level: 1 })).toBeDefined()
  expect(screen.getByText('Hali bitta ham kontakt yoʻq.')).toBeDefined()
  expect(await hammaQarzlar()).toHaveLength(0)

  await odam.click(tugma('QAYTARISH'))
  expect(await screen.findByRole('button', { name: /Akmal/ })).toBeDefined()
  expect(await hammaQarzlar()).toHaveLength(1)
  expect(await hammaTolovlar()).toHaveLength(1)
})

it('mezon 16 — ochiq qarzi bor kontakt oʻchirilmaydi va sahifada qoladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')

  await odam.click(tugma('Kontaktni oʻchirish'))

  expect(
    await screen.findByText('Ochiq qarzi bor kontakt oʻchirilmaydi — avval qarzlarni yoping.'),
  ).toBeDefined()
  expect(screen.getByRole('heading', { name: 'Akmal', level: 1 })).toBeDefined()
})

it('mezon 23, 26 — ism tahrirlansa roʻyxatda alifbodagi yangi oʻrniga oʻtadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await daftarniOchdi(odam)
  await kontaktQoshdi(odam, 'Botir')
  await kontaktQoshdi(odam, 'Zafar')
  await kontaktniOchdi(odam, 'Zafar')
  await qarzQoshdi(odam, '1000000', 'Berdim')

  await odam.click(tugma('Tahrirlash'))
  await odam.clear(screen.getByLabelText('Ism'))
  await odam.type(screen.getByLabelText('Ism'), 'Anvar')
  await odam.click(tugma('Saqlash'))

  // Sarlavha darhol yangilanadi; qarz va netto tegilmaydi (mezon 26).
  expect(await screen.findByRole('heading', { name: 'Anvar', level: 1 })).toBeDefined()
  expect(screen.getAllByText('+1 000 000 soʻm')).toHaveLength(2)

  await odam.click(tugma('‹ Orqaga'))
  const ismlar = screen
    .getAllByRole('listitem')
    .map((q) => q.textContent?.split('olaman')[0] ?? '')
  expect(ismlar[0]).toBe('Anvar')
  expect(ismlar[1]).toBe('Botir')
})

// ─── Eskirgan holat: doʻkon tekshiruvi oxirgi soʻzni aytadi (0061) ──────────
//
// Ilova ikki tabda ochilishi mumkin (PWA), va «Toʻlov» formasi ochilgan payt qarz
// holati boshqa joyda oʻzgarishi mumkin. Forma props dagi (eskirgan) holatga qarab
// tekshiradi, shuning uchun **oxirgi soʻz doʻkonniki**: `tolovSaqla` qarzni va uning
// toʻlovlarini oʻzi qayta oʻqiydi (KELISHUV 14-boʻlim). Aks holda 0061 chegarasi
// chetlab oʻtilardi va qarz qoldigʻi jimgina manfiy boʻlib qolardi.

/** «Boshqa tab» — ekran koʻrmagan holda doʻkonga toʻlov yozadi. */
async function boshqaTabToladi(summa: string): Promise<void> {
  const qarz = (await hammaQarzlar())[0]
  if (qarz === undefined) {
    throw new Error('Qarz topilmadi')
  }
  const natija = await tolovSaqla({
    qarzId: qarz.id,
    summa,
    sana: bugun(),
    hisob: 'karta',
    valyuta: 'som',
    kurs: '',
  })
  expect(natija.ok).toBe(true)
}

it('0061 — forma ochiq turganda qarz yopilsa, toʻlov doʻkon darajasida rad etiladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')

  await odam.click(tugma('＋ Toʻlov'))
  await screen.findByRole('heading', { name: 'Toʻlov', level: 1 })
  // Forma ochiq turganda qarz boshqa joyda toʻliq yopiladi.
  await boshqaTabToladi('1000000')

  await odam.type(screen.getByLabelText('Summa'), '500000')
  await odam.click(tugma('Saqlash'))

  expect(await screen.findByText('Qarz yopilgan — unga toʻlov qoʻshilmaydi.')).toBeDefined()
  // Forma yopilmaydi va ikkinchi toʻlov saqlanmaydi.
  expect(screen.getByRole('heading', { name: 'Toʻlov', level: 1 })).toBeDefined()
  expect(await hammaTolovlar()).toHaveLength(1)
})

it('0061 — eskirgan qoldiq bilan ortiqcha toʻlov ham doʻkon darajasida rad etiladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await qarzQoshdi(odam, '1000000', 'Berdim')

  await odam.click(tugma('＋ Toʻlov'))
  await screen.findByRole('heading', { name: 'Toʻlov', level: 1 })
  // Qarz ochiq qoladi (qoldiq 100 000 soʻm), lekin ekrandagi qoldiq eskirgan.
  await boshqaTabToladi('900000')

  await odam.type(screen.getByLabelText('Summa'), '500000')
  await odam.click(tugma('Saqlash'))

  expect(await screen.findByText('Toʻlov qarz qoldigʻidan katta.')).toBeDefined()
  expect(await hammaTolovlar()).toHaveLength(1)
})

it('0030 — forma ochiq turganda kontakt oʻchirilsa, qarz doʻkon darajasida rad etiladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await akmalgaKirdi(odam)
  await odam.click(tugma('＋ Yangi qarz'))
  await screen.findByRole('heading', { name: 'Yangi qarz', level: 1 })

  // «Boshqa tab» kontaktni oʻchiradi — formadagi kontakt qatori eskiradi.
  const kontaktlar = await hammaKontaktlar()
  const ochirildi = await kontaktniOchir(kontaktlar[0]?.id ?? '')
  expect(ochirildi.ok).toBe(true)

  await odam.type(screen.getByLabelText('Summa'), '1000000')
  await odam.click(tugma('Berdim'))
  await odam.click(tugma('Saqlash'))

  expect(await screen.findByText('Kontakt topilmadi.')).toBeDefined()
  // Forma yopilmaydi va kontaktsiz qarz bazaga tushmaydi.
  expect(screen.getByRole('heading', { name: 'Yangi qarz', level: 1 })).toBeDefined()
  expect(await hammaQarzlar()).toHaveLength(0)
})
