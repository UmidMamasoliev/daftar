// «Hisobot» ekrani — ekran darajasidagi testlar.
//
// Tavsif: `design/oylik-hisobot.md`. Mezonlar: `prds/oylik-hisobot.md` → 1–21.
// Qarorlar: 0013, 0017, 0018, 0019, 0021, 0023, 0034, 0038, 0042, 0043, 0044, 0064.
//
// Raqamlar bu yerda qoʻlda yozilmaydi: fikstura `hisobotYasa` (domain) orqali oʻtadi,
// demak ekran doʻkon beradigan aynan oʻsha `Hisobot` ni chizadi. Shu bilan «tenglik»
// mezonlari (10, 10a) ham haqiqiy hisobda tekshiriladi.

import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Davr, Hisobot as HisobotTuri, Oy } from '../domain/hisobot.ts'
import { hisobotYasa, oyDavri } from '../domain/hisobot.ts'
import type { Kategoriya, Qarz, Tolov, Yozuv } from '../domain/turlar.ts'
import { Hisobot } from './Hisobot.tsx'

const OY: Oy = { yil: 2026, oy: 8 }
const DAVR: Davr = oyDavri(OY)

const KATEGORIYALAR: Kategoriya[] = [
  { id: 'oziq-ovqat', nom: 'oziq-ovqat', turi: 'chiqim', yashirilgan: false },
  { id: 'transport', nom: 'transport', turi: 'chiqim', yashirilgan: false },
  { id: 'kiyim', nom: 'kiyim', turi: 'chiqim', yashirilgan: true },
  { id: 'oylik', nom: 'oylik', turi: 'kirim', yashirilgan: false },
]

function yozuv(qism: Partial<Yozuv> & { id: string }): Yozuv {
  return {
    yaratilgan: '2026-08-10T09:00:00.000Z',
    turi: 'chiqim',
    summa: 100000,
    kategoriyaId: 'oziq-ovqat',
    sana: '2026-08-10',
    hisob: 'karta',
    valyuta: 'som',
    ...qism,
  } as Yozuv
}

function qarz(qism: Partial<Qarz> & { id: string }): Qarz {
  return {
    yaratilgan: '2026-08-10T09:00:00.000Z',
    kontaktId: 'k1',
    yonalishi: 'berdim',
    summa: 1000000,
    valyuta: 'som',
    sana: '2026-08-10',
    hisob: 'karta',
    ...qism,
  }
}

function tolov(qism: Partial<Tolov> & { id: string; qarzId: string }): Tolov {
  return {
    yaratilgan: '2026-08-12T09:00:00.000Z',
    summa: 300000,
    valyuta: 'som',
    sana: '2026-08-12',
    hisob: 'karta',
    ...qism,
  } as Tolov
}

type Kirish = {
  davr?: Davr
  yozuvlar?: Yozuv[]
  qarzlar?: Qarz[]
  tolovlar?: Tolov[]
  kurs?: number | null
}

function yasa(kirish: Kirish = {}): HisobotTuri {
  return hisobotYasa({
    davr: kirish.davr ?? DAVR,
    yozuvlar: kirish.yozuvlar ?? [],
    qarzlar: kirish.qarzlar ?? [],
    tolovlar: kirish.tolovlar ?? [],
    kategoriyalar: KATEGORIYALAR,
    kurs: kirish.kurs === undefined ? 12500 : kirish.kurs,
  })
}

type Ustama = {
  hisobot?: HisobotTuri | null
  oy?: Oy | null
  joriyOy?: Oy
}

function chiz(ustama: Ustama = {}) {
  const oyniSur = vi.fn()
  const davrniQoy = vi.fn()
  const oygaQaytar = vi.fn()
  const kursniSaqla = vi.fn(async (_kurs: number): Promise<void> => {})
  const natija = render(
    <Hisobot
      hisobot={ustama.hisobot === undefined ? yasa() : ustama.hisobot}
      kategoriyalar={KATEGORIYALAR}
      oy={ustama.oy === undefined ? OY : ustama.oy}
      joriyOy={ustama.joriyOy ?? OY}
      oyniSur={oyniSur}
      davrniQoy={davrniQoy}
      oygaQaytar={oygaQaytar}
      kursniSaqla={kursniSaqla}
    />,
  )
  return { oyniSur, davrniQoy, oygaQaytar, kursniSaqla, odam: userEvent.setup(), ...natija }
}

function tugma(nom: string): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

/** Jami blokining bitta boʻlagi — «Jami kirim», «Jami chiqim» yoki «Farq». */
function bolak(nom: string): HTMLElement {
  return screen.getByRole('group', { name: nom })
}

/** Kartochka: «Chiqim — kategoriyalar boʻyicha», «Kirim — …», «Qarz». */
function kartochka(nom: string): HTMLElement {
  return screen.getByRole('region', { name: nom })
}

afterEach(cleanup)

describe('yuqori panel va davr qatori (0018, 0063; mezon 1, 2)', () => {
  it('sarlavha «Hisobot»; «‹ Orqaga» yoʻq — bu navigatsiyaning oʻz boʻlimi', () => {
    chiz()
    expect(screen.getByRole('heading', { name: 'Hisobot', level: 1 })).toBeDefined()
    expect(screen.queryByRole('button', { name: '‹ Orqaga' })).toBeNull()
  })

  it('mezon 1 — oy holatida oy nomi turadi', () => {
    chiz()
    expect(screen.getByText('avgust')).toBeDefined()
    expect(tugma('Oldingi oy')).toBeDefined()
    expect(tugma('Keyingi oy')).toBeDefined()
    expect(tugma('Davr tanlash')).toBeDefined()
  })

  it('boshqa yildagi oy yil bilan koʻrsatiladi', () => {
    chiz({ oy: { yil: 2025, oy: 12 }, joriyOy: OY })
    expect(screen.getByText('dekabr 2025')).toBeDefined()
  })

  it('mezon 2 — `‹` bir oy orqaga, `›` bir oy oldinga suradi', async () => {
    const { oyniSur, odam } = chiz({ oy: { yil: 2026, oy: 7 }, joriyOy: OY })
    await odam.click(tugma('Oldingi oy'))
    await odam.click(tugma('Keyingi oy'))
    expect(oyniSur.mock.calls).toEqual([[-1], [1]])
  })

  it('joriy oyda `›` oʻchiq — kelajak oyi tanlanmaydi (0034)', async () => {
    const { oyniSur, odam } = chiz({ oy: OY, joriyOy: OY })
    expect((tugma('Keyingi oy') as HTMLButtonElement).disabled).toBe(true)
    expect((tugma('Oldingi oy') as HTMLButtonElement).disabled).toBe(false)
    await odam.click(tugma('Keyingi oy'))
    expect(oyniSur).not.toHaveBeenCalled()
  })

  it('davr holatida davr matni va «Oyga qaytish» turadi', async () => {
    const { oygaQaytar, odam } = chiz({
      oy: null,
      hisobot: yasa({ davr: { boshlanish: '2026-08-01', tugash: '2026-08-15' } }),
    })
    expect(screen.getByText('1-avgust — 15-avgust')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Oldingi oy' })).toBeNull()

    await odam.click(tugma('Oyga qaytish'))
    expect(oygaQaytar).toHaveBeenCalledTimes(1)
  })
})

describe('«Davr tanlash» bloki (0018, 0034; mezon 3)', () => {
  async function blokniOch(odam: ReturnType<typeof chiz>['odam']): Promise<void> {
    await odam.click(tugma('Davr tanlash'))
  }

  it('blok joriy davr bilan toʻldirilgan ochiladi', async () => {
    const { odam } = chiz()
    await blokniOch(odam)
    expect((screen.getByLabelText('Sanadan') as HTMLInputElement).value).toBe('2026-08-01')
    expect((screen.getByLabelText('Sanagacha') as HTMLInputElement).value).toBe('2026-08-31')
  })

  it('mezon 3 — «Koʻrsatish» tanlangan oraliqni yuboradi va blok yopiladi', async () => {
    const { davrniQoy, odam } = chiz()
    await blokniOch(odam)
    const sanadan = screen.getByLabelText('Sanadan')
    await odam.clear(sanadan)
    await odam.type(sanadan, '2026-08-05')
    const sanagacha = screen.getByLabelText('Sanagacha')
    await odam.clear(sanagacha)
    await odam.type(sanagacha, '2026-08-15')
    await odam.click(tugma('Koʻrsatish'))

    expect(davrniQoy).toHaveBeenCalledWith({ boshlanish: '2026-08-05', tugash: '2026-08-15' })
    expect(screen.queryByLabelText('Sanadan')).toBeNull()
  })

  it('bitta kunlik davr xato emas', async () => {
    const { davrniQoy, odam } = chiz()
    await blokniOch(odam)
    const sanadan = screen.getByLabelText('Sanadan')
    await odam.clear(sanadan)
    await odam.type(sanadan, '2026-08-14')
    const sanagacha = screen.getByLabelText('Sanagacha')
    await odam.clear(sanagacha)
    await odam.type(sanagacha, '2026-08-14')
    await odam.click(tugma('Koʻrsatish'))
    expect(davrniQoy).toHaveBeenCalledWith({ boshlanish: '2026-08-14', tugash: '2026-08-14' })
  })

  it('boshlanish tugashdan keyin boʻlsa xato chiqadi va davr qoʻllanmaydi', async () => {
    const { davrniQoy, odam } = chiz()
    await blokniOch(odam)
    const sanadan = screen.getByLabelText('Sanadan')
    await odam.clear(sanadan)
    await odam.type(sanadan, '2026-08-15')
    const sanagacha = screen.getByLabelText('Sanagacha')
    await odam.clear(sanagacha)
    await odam.type(sanagacha, '2026-08-10')
    await odam.click(tugma('Koʻrsatish'))

    expect(screen.getByText('Boshlanish sanasi tugash sanasidan keyin boʻlmasin.')).toBeDefined()
    expect(davrniQoy).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Sanadan')).toBeDefined()
  })

  it('sana tanlagichlari kelajak kunni bermaydi (0034)', async () => {
    const { odam } = chiz()
    await blokniOch(odam)
    const bugungi = (screen.getByLabelText('Sanadan') as HTMLInputElement).max
    expect(bugungi).not.toBe('')
    expect((screen.getByLabelText('Sanagacha') as HTMLInputElement).max).toBe(bugungi)
  })

  it('`×` blokni yopadi va tanlangani unutiladi', async () => {
    const { davrniQoy, odam } = chiz()
    await blokniOch(odam)
    const sanadan = screen.getByLabelText('Sanadan')
    await odam.clear(sanadan)
    await odam.type(sanadan, '2026-08-05')
    await odam.click(tugma('Yopish'))
    expect(davrniQoy).not.toHaveBeenCalled()

    await blokniOch(odam)
    expect((screen.getByLabelText('Sanadan') as HTMLInputElement).value).toBe('2026-08-01')
  })
})

describe('jami bloki (mezon 7, 8, 9, 19)', () => {
  const ARALASH = {
    yozuvlar: [
      yozuv({ id: 'k1', turi: 'kirim', kategoriyaId: 'oylik', summa: 8000000 }),
      yozuv({ id: 'k2', turi: 'kirim', kategoriyaId: 'oylik', summa: 20000, valyuta: 'dollar' }),
      yozuv({ id: 'c1', summa: 2950000 }),
      yozuv({ id: 'c2', summa: 2000, valyuta: 'dollar', kategoriyaId: 'transport' }),
    ],
  }

  it('mezon 7, 8 — jami kirim va chiqim ishora va rang bilan', () => {
    chiz({ hisobot: yasa(ARALASH) })
    expect(within(bolak('Jami kirim')).getByText('+8 000 000 soʻm')).toBeDefined()
    expect(within(bolak('Jami chiqim')).getByText('−2 950 000 soʻm')).toBeDefined()
  })

  it('mezon 19 — aralash valyutada har valyuta oʻz qatorida turadi', () => {
    chiz({ hisobot: yasa(ARALASH) })
    expect(within(bolak('Jami kirim')).getByText('+200,00 $')).toBeDefined()
    expect(within(bolak('Jami chiqim')).getByText('−20,00 $')).toBeDefined()
  })

  it('mezon 9 — farq = kirim − chiqim, har valyutada alohida', () => {
    chiz({ hisobot: yasa(ARALASH) })
    const farq = bolak('Farq')
    expect(within(farq).getByText('+5 050 000 soʻm')).toBeDefined()
    expect(within(farq).getByText('+180,00 $')).toBeDefined()
    expect(within(farq).getByText('kirim − chiqim')).toBeDefined()
  })

  it('manfiy farq `−` va chiqim rangi bilan koʻrinadi', () => {
    chiz({
      hisobot: yasa({
        yozuvlar: [
          yozuv({ id: 'k1', turi: 'kirim', kategoriyaId: 'oylik', summa: 100000 }),
          yozuv({ id: 'c1', summa: 350000 }),
        ],
      }),
    })
    const qator = within(bolak('Farq')).getByText('−250 000 soʻm')
    expect(qator.className).toContain('chiqim')
  })

  it('mezon 10b — dollarda yozuv boʻlmagan davrda dollar qatori chizilmaydi', () => {
    chiz({ hisobot: yasa({ yozuvlar: [yozuv({ id: 'c1', summa: 350000 })] }) })
    expect(within(bolak('Jami chiqim')).queryByText(/\$/)).toBeNull()
    expect(within(bolak('Jami kirim')).queryByText(/\$/)).toBeNull()
  })

  it('`raqam-katta` (28 px) bu ekranda ishlatilmaydi — jami qatorlari `summa` oʻlchamida', () => {
    chiz({ hisobot: yasa(ARALASH) })
    expect(within(bolak('Jami kirim')).getByText('+8 000 000 soʻm').className).toContain(
      'jami-summa',
    )
    expect(document.querySelector('.netto-katta')).toBeNull()
  })
})

describe('«≈ jami soʻmda» (0023, 0038, 0042; mezon 20)', () => {
  const ARALASH_KIRIM = {
    yozuvlar: [
      yozuv({ id: 'k1', turi: 'kirim', kategoriyaId: 'oylik', summa: 8000000 }),
      yozuv({ id: 'k2', turi: 'kirim', kategoriyaId: 'oylik', summa: 20000, valyuta: 'dollar' }),
    ],
  }

  it('mezon 20 — taxminiy qator va uning kursi koʻrinadi', () => {
    chiz({ hisobot: yasa(ARALASH_KIRIM) })
    const kirim = bolak('Jami kirim')
    // 8 000 000 + 200,00 $ × 12 500 = 10 500 000
    expect(within(kirim).getByText('≈ +10 500 000 soʻm')).toBeDefined()
    expect(within(kirim).getByText('taxminiy · 1 $ = 12 500 soʻm')).toBeDefined()
  })

  it('taxminiy raqam neytral rangda — haqiqiy raqamdek koʻrinmaydi', () => {
    chiz({ hisobot: yasa(ARALASH_KIRIM) })
    const qator = within(bolak('Jami kirim')).getByText('≈ +10 500 000 soʻm')
    expect(qator.className).not.toContain('kirim')
    expect(qator.className).not.toContain('chiqim')
  })

  it('dollar qatori yoʻq boʻlakda ≈ qatori umuman chizilmaydi', () => {
    chiz({
      hisobot: yasa({
        yozuvlar: [yozuv({ id: 'k1', turi: 'kirim', kategoriyaId: 'oylik', summa: 8000000 })],
      }),
    })
    expect(screen.queryByText(/≈/)).toBeNull()
  })

  it('kategoriya va qarz qatorlarida ≈ yoʻq (0038, istisnosiz)', () => {
    chiz({
      hisobot: yasa({
        yozuvlar: [
          yozuv({ id: 'c1', summa: 350000 }),
          yozuv({ id: 'c2', summa: 2000, valyuta: 'dollar', kategoriyaId: 'transport' }),
        ],
        qarzlar: [qarz({ id: 'q1' })],
      }),
    })
    expect(within(kartochka('Chiqim — kategoriyalar boʻyicha')).queryByText(/≈/)).toBeNull()
    expect(within(kartochka('Qarz')).queryByText(/≈/)).toBeNull()
  })
})

describe('kurs soʻrash bloki (0043; mezon 21)', () => {
  const KURSSIZ = {
    yozuvlar: [
      yozuv({ id: 'k1', turi: 'kirim', kategoriyaId: 'oylik', summa: 8000000 }),
      yozuv({ id: 'k2', turi: 'kirim', kategoriyaId: 'oylik', summa: 20000, valyuta: 'dollar' }),
      yozuv({ id: 'c1', summa: 2000, valyuta: 'dollar', kategoriyaId: 'transport' }),
    ],
    kurs: null,
  }

  it('mezon 21 — kurs yoʻq boʻlsa taxminiy jami oʻrnida soʻrov turadi', () => {
    chiz({ hisobot: yasa(KURSSIZ) })
    expect(screen.getByText('Taxminiy jamini koʻrsatish uchun kurs kerak.')).toBeDefined()
    expect(screen.getByLabelText('Kurs — 1 dollar necha soʻm')).toBeDefined()
    expect(screen.queryByText(/≈/)).toBeNull()
  })

  it('blok bir marta chiziladi — birinchi muhtoj boʻlakda', () => {
    chiz({ hisobot: yasa(KURSSIZ) })
    expect(screen.getAllByLabelText('Kurs — 1 dollar necha soʻm')).toHaveLength(1)
    expect(within(bolak('Jami kirim')).getByLabelText('Kurs — 1 dollar necha soʻm')).toBeDefined()
  })

  it('«Saqlash» kursni yuboradi', async () => {
    const { kursniSaqla, odam } = chiz({ hisobot: yasa(KURSSIZ) })
    await odam.type(screen.getByLabelText('Kurs — 1 dollar necha soʻm'), '12500')
    await odam.click(tugma('Saqlash'))
    expect(kursniSaqla).toHaveBeenCalledWith(12500)
  })

  it('kurs boʻsh boʻlsa «Kursni kiriting…» chiqadi', async () => {
    const { kursniSaqla, odam } = chiz({ hisobot: yasa(KURSSIZ) })
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Kursni kiriting — 1 dollar necha soʻm.')).toBeDefined()
    expect(kursniSaqla).not.toHaveBeenCalled()
  })

  it('kurs `0` bilan saqlanmaydi va «Kurs notoʻgʻri» chiqadi (0049)', async () => {
    const { kursniSaqla, odam } = chiz({ hisobot: yasa(KURSSIZ) })
    await odam.type(screen.getByLabelText('Kurs — 1 dollar necha soʻm'), '0')
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Kurs notoʻgʻri')).toBeDefined()
    expect(kursniSaqla).not.toHaveBeenCalled()
  })

  it('kursda kasr belgisi maydonga tushmaydi (0042)', async () => {
    const { odam } = chiz({ hisobot: yasa(KURSSIZ) })
    const maydon = screen.getByLabelText('Kurs — 1 dollar necha soʻm') as HTMLInputElement
    await odam.type(maydon, '12500,25')
    expect(maydon.value).toBe('1 250 025')
  })

  it('kursli daftarda blok umuman koʻrinmaydi', () => {
    chiz({ hisobot: yasa({ ...KURSSIZ, kurs: 12500 }) })
    expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()
  })

  it('blokni yopish tugmasi yoʻq — qolgan raqamlar joyida turadi', () => {
    chiz({ hisobot: yasa(KURSSIZ) })
    expect(within(bolak('Jami kirim')).getByText('+8 000 000 soʻm')).toBeDefined()
    expect(within(bolak('Jami kirim')).queryByRole('button', { name: 'Yopish' })).toBeNull()
  })
})

describe('kategoriyalar ajratmasi (0013, 0038, 0064; mezon 5, 10, 10a, 11, 12, 16b)', () => {
  const ARALASH = {
    yozuvlar: [
      yozuv({ id: 'c1', summa: 800000, kategoriyaId: 'oziq-ovqat' }),
      yozuv({ id: 'c2', summa: 150000, kategoriyaId: 'transport' }),
      yozuv({ id: 'c3', summa: 2000, valyuta: 'dollar', kategoriyaId: 'oziq-ovqat' }),
      yozuv({ id: 'k1', turi: 'kirim', kategoriyaId: 'oylik', summa: 8000000 }),
    ],
    qarzlar: [qarz({ id: 'q1' })],
  }

  it('mezon 11 — chiqim va kirim ajratmalari alohida kartochkada, chiqim yuqorida', () => {
    chiz({ hisobot: yasa(ARALASH) })
    const sarlavhalar = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(sarlavhalar).toEqual([
      'Chiqim — kategoriyalar boʻyicha',
      'Kirim — kategoriyalar boʻyicha',
      'Qarz',
    ])
  })

  it('mezon 5 — qatorda kategoriya nomi va ishorali summa turadi', () => {
    chiz({ hisobot: yasa(ARALASH) })
    const chiqim = kartochka('Chiqim — kategoriyalar boʻyicha')
    // Bitta kategoriya ikki valyutada ishlatilgan — ikkita qator (0038 misoli).
    expect(within(chiqim).getAllByText('oziq-ovqat')).toHaveLength(2)
    expect(within(chiqim).getByText('−800 000 soʻm')).toBeDefined()
    expect(within(kartochka('Kirim — kategoriyalar boʻyicha')).getByText('+8 000 000 soʻm'))
      .toBeDefined()
  })

  it('ikki valyutali kartochkada guruh sarlavhalari turadi: avval soʻm, keyin dollar', () => {
    chiz({ hisobot: yasa(ARALASH) })
    const chiqim = kartochka('Chiqim — kategoriyalar boʻyicha')
    const guruhlar = within(chiqim)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent)
    expect(guruhlar).toEqual(['soʻm', 'dollar'])
  })

  it('bitta valyutali kartochkada guruh sarlavhasi qoʻyilmaydi', () => {
    chiz({ hisobot: yasa(ARALASH) })
    const kirim = kartochka('Kirim — kategoriyalar boʻyicha')
    expect(within(kirim).queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('mezon 10, 10a — guruh summalari yigʻindisi oʻsha valyutadagi jamiga teng', () => {
    chiz({ hisobot: yasa(ARALASH) })
    // soʻm: 800 000 + 150 000 = 950 000 → «Jami chiqim» soʻm qatori
    expect(within(bolak('Jami chiqim')).getByText('−950 000 soʻm')).toBeDefined()
    const chiqim = kartochka('Chiqim — kategoriyalar boʻyicha')
    expect(within(chiqim).getByText('−800 000 soʻm')).toBeDefined()
    expect(within(chiqim).getByText('−150 000 soʻm')).toBeDefined()
    // dollar: 20,00 $ → «Jami chiqim» dollar qatori
    expect(within(bolak('Jami chiqim')).getByText('−20,00 $')).toBeDefined()
    expect(within(chiqim).getByText('−20,00 $')).toBeDefined()
  })

  it('tartib — summa boʻyicha kamayish (eng katta xarajat yuqorida)', () => {
    chiz({ hisobot: yasa(ARALASH) })
    const nomlar = within(kartochka('Chiqim — kategoriyalar boʻyicha'))
      .getAllByRole('listitem')
      .map((q) => q.textContent)
    expect(nomlar[0]).toContain('oziq-ovqat')
    expect(nomlar[1]).toContain('transport')
  })

  it('mezon 12 — yashirilgan kategoriya odatdagidek, belgisiz koʻrinadi (0013)', () => {
    chiz({
      hisobot: yasa({ yozuvlar: [yozuv({ id: 'c1', summa: 90000, kategoriyaId: 'kiyim' })] }),
    })
    const nom = within(kartochka('Chiqim — kategoriyalar boʻyicha')).getByText('kiyim')
    expect(nom.className).not.toContain('ochiq-rang')
  })

  it('mezon 16b — kategoriya qatori bosilmaydi (0064)', () => {
    chiz({ hisobot: yasa(ARALASH) })
    const chiqim = kartochka('Chiqim — kategoriyalar boʻyicha')
    expect(within(chiqim).queryAllByRole('button')).toHaveLength(0)
    expect(within(chiqim).queryAllByRole('link')).toHaveLength(0)
  })
})

describe('qarz bloki (0017, 0064; mezon 13, 14, 14a–14g)', () => {
  const QARZLI = {
    qarzlar: [
      qarz({ id: 'q1', yonalishi: 'berdim', summa: 1000000 }),
      qarz({ id: 'q2', yonalishi: 'oldim', summa: 500000 }),
    ],
    tolovlar: [
      tolov({ id: 't1', qarzId: 'q1', summa: 300000 }),
      tolov({ id: 't2', qarzId: 'q2', summa: 200000 }),
    ],
  }

  it('mezon 13, 14, 14a, 14b — toʻrt yoʻnalish oʻz ishorasi bilan', () => {
    chiz({ hisobot: yasa(QARZLI) })
    const blok = kartochka('Qarz')
    expect(within(blok).getByText('Qarzga berildi')).toBeDefined()
    expect(within(blok).getByText('−1 000 000 soʻm')).toBeDefined()
    expect(within(blok).getByText('Qarzdan qaytdi')).toBeDefined()
    expect(within(blok).getByText('+300 000 soʻm')).toBeDefined()
    expect(within(blok).getByText('Qarz olindi')).toBeDefined()
    expect(within(blok).getByText('+500 000 soʻm')).toBeDefined()
    expect(within(blok).getByText('Qarz qaytarildi')).toBeDefined()
    expect(within(blok).getByText('−200 000 soʻm')).toBeDefined()
  })

  it('mezon 14c — qatorlar bitta netto raqamga yigʻilmaydi', () => {
    chiz({ hisobot: yasa(QARZLI) })
    const blok = kartochka('Qarz')
    expect(within(blok).getAllByRole('listitem')).toHaveLength(4)
    expect(within(blok).queryByText('netto')).toBeNull()
  })

  it('izoh qatori jamiga qoʻshilmaganini aytadi (0017)', () => {
    chiz({ hisobot: yasa(QARZLI) })
    expect(
      within(kartochka('Qarz')).getByText(
        'Qarz summalari jami kirim va jami chiqimga qoʻshilmagan.',
      ),
    ).toBeDefined()
  })

  it('mezon 15, 16 — qarz summalari jami kirim va chiqimga kirmaydi', () => {
    chiz({ hisobot: yasa({ ...QARZLI, yozuvlar: [yozuv({ id: 'c1', summa: 350000 })] }) })
    expect(within(bolak('Jami chiqim')).getByText('−350 000 soʻm')).toBeDefined()
    expect(within(bolak('Jami kirim')).getByText('0 soʻm')).toBeDefined()
  })

  it('mezon 14e — dollar qarziga soʻmdagi toʻlov soʻm qatorida sanaladi (0064)', () => {
    chiz({
      hisobot: yasa({
        qarzlar: [qarz({ id: 'q1', valyuta: 'dollar', summa: 100000 })],
        tolovlar: [
          tolov({ id: 't1', qarzId: 'q1', summa: 625000, valyuta: 'som', kurs: 12500 }),
        ],
      }),
    })
    const blok = kartochka('Qarz')
    expect(within(blok).getByText('−1 000,00 $')).toBeDefined()
    expect(within(blok).getByText('+625 000 soʻm')).toBeDefined()
    // Aylantirilgan qiymat hisobotga umuman kirmaydi.
    expect(within(blok).queryByText('+50,00 $')).toBeNull()
  })

  it('mezon 14g — oʻsha valyutada harakat boʻlmagan davrda qator chizilmaydi', () => {
    chiz({ hisobot: yasa({ qarzlar: [qarz({ id: 'q1' })] }) })
    const blok = kartochka('Qarz')
    expect(within(blok).getByText('Qarzga berildi')).toBeDefined()
    expect(within(blok).queryByText('Qarzdan qaytdi')).toBeNull()
    expect(within(blok).queryByText(/\$/)).toBeNull()
  })

  it('mezon 14g — qarz harakati boʻlmagan davrda blokning oʻzi chiqmaydi', () => {
    chiz({ hisobot: yasa({ yozuvlar: [yozuv({ id: 'c1' })] }) })
    expect(screen.queryByRole('region', { name: 'Qarz' })).toBeNull()
    expect(screen.getByText('Bu davrda qarz harakati yoʻq.')).toBeDefined()
  })

  it('qarz qatori bosilmaydi', () => {
    chiz({ hisobot: yasa(QARZLI) })
    expect(within(kartochka('Qarz')).queryAllByRole('button')).toHaveLength(0)
  })
})

describe('boʻsh holatlar (dizayn 8-boʻlim; mezon 17)', () => {
  it('mezon 17 — yozuvi boʻlmagan davrda uchala boʻlak `0 soʻm` koʻrsatadi', () => {
    chiz({ hisobot: yasa({}) })
    expect(within(bolak('Jami kirim')).getByText('0 soʻm')).toBeDefined()
    expect(within(bolak('Jami chiqim')).getByText('0 soʻm')).toBeDefined()
    expect(within(bolak('Farq')).getByText('0 soʻm')).toBeDefined()
    expect(screen.queryByText(/≈/)).toBeNull()
    expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()
  })

  it('nol qiymat ishorasiz va neytral rangda', () => {
    chiz({ hisobot: yasa({}) })
    const nol = within(bolak('Farq')).getByText('0 soʻm')
    expect(nol.className).not.toContain('kirim')
    expect(nol.className).not.toContain('chiqim')
  })

  it('boʻsh davrda ajratmalar oʻrnida oʻz qatorlari turadi', () => {
    chiz({ hisobot: yasa({}) })
    expect(screen.getByText('Bu davrda chiqim yozuvi yoʻq.')).toBeDefined()
    expect(screen.getByText('Bu davrda kirim yozuvi yoʻq.')).toBeDefined()
    expect(screen.getByText('Bu davrda qarz harakati yoʻq.')).toBeDefined()
  })

  it('daftarda maʼlumot bor boʻlsa yoʻl koʻrsatuvchi qator chiqadi', () => {
    // Davri boʻsh, lekin daftarda boshqa oyda yozuv bor.
    chiz({ hisobot: yasa({ yozuvlar: [yozuv({ id: 'c1', sana: '2026-07-10' })] }) })
    expect(screen.getByText('Boshqa davrni yuqoridan tanlang.')).toBeDefined()
    expect(screen.queryByText('Hali bitta ham yozuv yoʻq.')).toBeNull()
  })

  it('daftar butunlay boʻsh boʻlsa ikkita qator turadi (0067 matni bilan)', () => {
    chiz({ hisobot: yasa({}) })
    expect(screen.getByText('Hali bitta ham yozuv yoʻq.')).toBeDefined()
    // Bitta holat — bitta matn: «Yozuvlar» va bosh sahifadagi qator bilan bir xil.
    // Navigatsiyada «Yozuv» bandi yoʻq (0067), shuning uchun eski matn yoʻl koʻrsatmasdi.
    expect(
      screen.getByText('Birinchi yozuvni bosh sahifadagi «＋ Yozuv» tugmasi bilan qoʻshasiz.'),
    ).toBeDefined()
    expect(screen.queryByText('Boshqa davrni yuqoridan tanlang.')).toBeNull()
  })

  it('yarim boʻsh davr: chiqim bor, kirim yoʻq (dizayn 8c)', () => {
    chiz({ hisobot: yasa({ yozuvlar: [yozuv({ id: 'c1', summa: 350000 })] }) })
    expect(within(kartochka('Chiqim — kategoriyalar boʻyicha')).getByText('oziq-ovqat'))
      .toBeDefined()
    expect(screen.getByText('Bu davrda kirim yozuvi yoʻq.')).toBeDefined()
    expect(within(bolak('Jami kirim')).getByText('0 soʻm')).toBeDefined()
  })
})

describe('bu ekranda yoʻq narsalar (0002, 0019, 0021, 0029)', () => {
  it('eksport, ulashish, grafik, filtr va «qaytarish» paneli yoʻq', () => {
    chiz({
      hisobot: yasa({
        yozuvlar: [yozuv({ id: 'c1' })],
        qarzlar: [qarz({ id: 'q1' })],
      }),
    })
    expect(screen.queryByRole('button', { name: /PDF|CSV|ulash|chop/i })).toBeNull()
    expect(screen.queryByRole('searchbox')).toBeNull()
    expect(screen.queryByRole('button', { name: 'QAYTARISH' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })
})
