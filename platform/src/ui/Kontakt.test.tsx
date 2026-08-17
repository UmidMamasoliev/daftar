// Kontakt sahifasi — ekran darajasidagi testlar.
//
// Tavsif: `design/qarz-daftari.md` (2-boʻlim). Mezonlar: `prds/qarz-daftari.md` → 5, 6,
// 6a, 6b, 7, 8, 9, 9a, 11, 15c–15g, 16, 23–26, 34, 35, 36, 40, 42.
// Qarorlar: 0029, 0030, 0031, 0037, 0048, 0052, 0056, 0059, 0060, 0061.
//
// Doʻkon bu yerda yoʻq: holat props orqali keladi, oʻchirish/qaytarish esa chaqiruv
// boʻlib beriladi — shu sababli soxta soat IndexedDB ga xalaqit bermaydi.

import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bugun, kunMatni } from '../domain/sana.ts'
import type {
  Kontakt as KontaktTuri,
  KontaktFormasi,
  KontaktHolati,
  Natija,
  OchirilganKontakt,
  OchirilganQarz,
  Qarz,
  QarzHolati,
  Tolov,
} from '../domain/turlar.ts'
import { Kontakt } from './Kontakt.tsx'
import { QAYTARISH_MUDDATI } from './QaytarishPaneli.tsx'

const AKMAL: KontaktTuri = { id: 'k1', ism: 'Akmal', yaratilgan: '2026-08-17T09:00:00.000Z' }

function kun(qadam: number): string {
  const vaqt = new Date()
  vaqt.setDate(vaqt.getDate() + qadam)
  return kunMatni(vaqt)
}

function qarz(qism: Partial<Qarz> & { id: string }): Qarz {
  return {
    yaratilgan: '2026-08-17T09:00:00.000Z',
    kontaktId: 'k1',
    yonalishi: 'berdim',
    summa: 1000000,
    valyuta: 'som',
    sana: bugun(),
    hisob: 'karta',
    ...qism,
  }
}

function tolov(qism: Partial<Tolov> & { id: string; qarzId: string }): Tolov {
  return {
    yaratilgan: '2026-08-17T10:00:00.000Z',
    summa: 300000,
    valyuta: 'som',
    sana: bugun(),
    hisob: 'karta',
    ...qism,
  } as Tolov
}

/** Qarz holatini domain qoidalari boʻyicha yigʻadi — doʻkon nimani bersa oʻshani. */
function holat(q: Qarz, tolovlar: Tolov[] = []): QarzHolati {
  const tolangan = tolovlar.reduce((yigindi, t) => {
    if (t.valyuta === q.valyuta) {
      return yigindi + t.summa
    }
    const kurs = t.kurs ?? 1
    return (
      yigindi +
      (t.valyuta === 'dollar'
        ? Math.round((t.summa * kurs) / 100)
        : Math.round((t.summa * 100) / kurs))
    )
  }, 0)
  const qoldiq = Math.max(q.summa - tolangan, 0)
  return {
    qarz: q,
    tolovlar,
    qoldiq,
    tolangan,
    yopiq: qoldiq <= (q.valyuta === 'som' ? 100 : 1),
  }
}

function kontaktHolati(
  qarzlar: QarzHolati[] = [],
  ustama: Partial<KontaktHolati> = {},
): KontaktHolati {
  const ochiqlar = qarzlar.filter((h) => !h.yopiq)
  const yigindi = new Map<'som' | 'dollar', number>()
  for (const h of ochiqlar) {
    const belgili = h.qarz.yonalishi === 'berdim' ? h.qoldiq : -h.qoldiq
    yigindi.set(h.qarz.valyuta, (yigindi.get(h.qarz.valyuta) ?? 0) + belgili)
  }
  return {
    kontakt: AKMAL,
    qarzlar,
    netto: (['som', 'dollar'] as const)
      .filter((v) => yigindi.has(v))
      .map((valyuta) => ({ valyuta, netto: yigindi.get(valyuta) ?? 0 })),
    ochiqQarziBormi: ochiqlar.length > 0,
    ...ustama,
  }
}

type Ustama = {
  holat?: KontaktHolati
  tahrirNatijasi?: Natija<KontaktTuri>
  ochirishNatijasi?: Natija<OchirilganKontakt>
}

function chiz(ustama: Ustama = {}) {
  const orqaga = vi.fn()
  const yangiQarz = vi.fn()
  const yangiTolov = vi.fn()
  const qarzniTahrirla = vi.fn()
  const qarzniOchir = vi.fn(
    async (q: Qarz): Promise<OchirilganQarz> => ({ qarz: q, tolovlar: [] }),
  )
  const qarzniQaytar = vi.fn(async (_o: OchirilganQarz): Promise<void> => {})
  const tolovniOchir = vi.fn(async (_t: Tolov): Promise<void> => {})
  const tolovniQaytar = vi.fn(async (_t: Tolov): Promise<void> => {})
  const tahrirla = vi.fn(
    async (_f: KontaktFormasi): Promise<Natija<KontaktTuri>> =>
      ustama.tahrirNatijasi ?? { ok: true, qiymat: AKMAL },
  )
  const kontaktniOchir = vi.fn(
    async (): Promise<Natija<OchirilganKontakt>> =>
      ustama.ochirishNatijasi ?? {
        ok: true,
        qiymat: { kontakt: AKMAL, qarzlar: [], tolovlar: [] },
      },
  )
  const natija = render(
    <Kontakt
      holat={ustama.holat ?? kontaktHolati()}
      orqaga={orqaga}
      tahrirla={tahrirla}
      yangiQarz={yangiQarz}
      yangiTolov={yangiTolov}
      qarzniTahrirla={qarzniTahrirla}
      qarzniOchir={qarzniOchir}
      qarzniQaytar={qarzniQaytar}
      tolovniOchir={tolovniOchir}
      tolovniQaytar={tolovniQaytar}
      kontaktniOchir={kontaktniOchir}
    />,
  )
  return {
    orqaga,
    tahrirla,
    yangiQarz,
    yangiTolov,
    qarzniTahrirla,
    qarzniOchir,
    qarzniQaytar,
    tolovniOchir,
    tolovniQaytar,
    kontaktniOchir,
    odam: userEvent.setup(),
    ...natija,
  }
}

function tugma(nom: string | RegExp): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

/** Qarz kartochkasining boshi — bosilsa tahrirlash, surilsa «Oʻchirish» (dizayn). */
function kartochkaBoshi(nom: RegExp): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

function tolovQatori(matn: string): HTMLElement {
  const qator = screen
    .getAllByRole('listitem')
    .find((q) => q.className.includes('tolov-qator') && q.textContent?.includes(matn) === true)
  if (qator === undefined) {
    throw new Error(`«${matn}» toʻlov qatori topilmadi`)
  }
  return qator
}

async function soatniSur(millisoniya: number): Promise<void> {
  await act(async () => {
    vi.advanceTimersByTime(millisoniya)
  })
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('yuqori panel (dizayn 2-boʻlim)', () => {
  it('chapda «‹ Orqaga», oʻrtada ism, oʻngda «Tahrirlash»', () => {
    chiz()
    expect(tugma('‹ Orqaga')).toBeDefined()
    expect(screen.getByRole('heading', { name: 'Akmal', level: 1 })).toBeDefined()
    expect(tugma('Tahrirlash')).toBeDefined()
  })

  it('«‹ Orqaga» roʻyxatga qaytaradi', async () => {
    const { orqaga, odam } = chiz()
    await odam.click(tugma('‹ Orqaga'))
    expect(orqaga).toHaveBeenCalledTimes(1)
  })

  it('telefon raqami boʻlsa koʻrinadi va bosilmaydi (0031)', () => {
    chiz({
      holat: kontaktHolati([], {
        kontakt: { ...AKMAL, telefon: '+998 90 123 45 67' },
      }),
    })
    expect(screen.getByText('+998 90 123 45 67')).toBeDefined()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('qidiruv, filtr va davr tanlagichi yoʻq (0002); muddat ham yoʻq (0016)', () => {
    chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    expect(screen.queryByRole('searchbox')).toBeNull()
    expect(screen.queryByText(/muddat|kechikkan/i)).toBeNull()
  })
})

describe('netto bloki (0037, 0056; mezon 11, 15c–15g, 40)', () => {
  it('mezon 15c — 100 $ berilib 30 $ olingan boʻlsa netto «olaman» +70,00 $', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', valyuta: 'dollar', summa: 10000 })),
        holat(qarz({ id: 'q2', valyuta: 'dollar', summa: 3000, yonalishi: 'oldim' })),
      ]),
    })
    expect(screen.getByText('olaman')).toBeDefined()
    // Netto — bitta raqam; kartochkalarda esa har qarzning oʻz qoldigʻi turadi.
    expect(screen.getByText('+70,00 $')).toBeDefined()
    expect(screen.getByText('+100,00 $')).toBeDefined()
    expect(screen.getByText('−30,00 $')).toBeDefined()
  })

  it('mezon 11 — dollardagi qarz qoldigʻi dollarda koʻrsatiladi, soʻmda emas', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', valyuta: 'dollar', summa: 10000 }), [
          tolov({ id: 't1', qarzId: 'q1', valyuta: 'som', summa: 625000, kurs: 12500 }),
        ]),
      ]),
    })
    // Netto bloki va kartochka — ikkalasi ham dollarda.
    expect(screen.getAllByText('+50,00 $')).toHaveLength(2)
    expect(screen.queryByText('+625 000 soʻm')).toBeNull()
  })

  it('mezon 15e — netto nol boʻlsa «hisob teng» qatori qoladi', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', valyuta: 'dollar', summa: 10000 })),
        holat(qarz({ id: 'q2', valyuta: 'dollar', summa: 10000, yonalishi: 'oldim' })),
      ]),
    })
    expect(screen.getByText('hisob teng')).toBeDefined()
    expect(screen.getByText('0,00 $')).toBeDefined()
  })

  it('mezon 15f, 40 — hamma qarzi yopilgan boʻlsa «Ochiq qarz yoʻq.» turadi', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', valyuta: 'dollar', summa: 10000 }), [
          tolov({ id: 't1', qarzId: 'q1', valyuta: 'dollar', summa: 9999 }),
        ]),
      ]),
    })
    expect(screen.getByText('Ochiq qarz yoʻq.')).toBeDefined()
    expect(screen.queryByText('olaman')).toBeNull()
    // Mikro-qoldiq hech qayerda koʻrinmaydi (0056; 7a1).
    expect(screen.queryByText(/0,01 \$/)).toBeNull()
  })

  it('mezon 15g — netto faqat ochiq qarzdan yigʻiladi', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', valyuta: 'som', summa: 700000 })),
        holat(qarz({ id: 'q2', valyuta: 'som', summa: 1000 }), [
          tolov({ id: 't1', qarzId: 'q2', summa: 950 }),
        ]),
      ]),
    })
    // Netto va ochiq kartochka — bir xil raqam; yopilganning 50 soʻmi hech qayerda yoʻq.
    expect(screen.getAllByText('+700 000 soʻm')).toHaveLength(2)
    expect(screen.queryByText('+50 soʻm')).toBeNull()
  })

  it('«≈ jami soʻmda» qatori bu ekranda yoʻq (0038)', () => {
    chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    expect(screen.queryByText(/≈/)).toBeNull()
  })
})

describe('qarz kartochkasi (dizayn 0-boʻlim; mezon 5, 6, 6a, 6b, 42)', () => {
  it('mezon 5 — 1 000 000 soʻm qarzda 300 000 toʻlov: qoldiq 700 000 soʻm', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1' }), [tolov({ id: 't1', qarzId: 'q1' })]),
      ]),
    })
    expect(screen.getByText('Berdim')).toBeDefined()
    // Netto bloki va kartochka qoldigʻi — ikkalasi ham 700 000 soʻm.
    expect(screen.getAllByText('+700 000 soʻm')).toHaveLength(2)
  })

  it('ikkinchi qator: sana · hisob · boshlangʻich summa', () => {
    chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    expect(screen.getByText('Bugun · Karta · boshlangʻich 1 000 000 soʻm')).toBeDefined()
  })

  it('mezon 6 — qoldiq nolga tushsa kartochkada «Yopilgan» turadi, raqam emas', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1' }), [tolov({ id: 't1', qarzId: 'q1', summa: 1000000 })]),
      ]),
    })
    expect(screen.getByText('Yopilgan')).toBeDefined()
    expect(screen.queryByText('+0 soʻm')).toBeNull()
  })

  it('mezon 6a — dollar qarzida 1 sent qoldiq yopilgan, 2 sent ochiq', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', valyuta: 'dollar', summa: 10000 }), [
          tolov({ id: 't1', qarzId: 'q1', valyuta: 'dollar', summa: 9999 }),
        ]),
        holat(qarz({ id: 'q2', valyuta: 'dollar', summa: 10000 }), [
          tolov({ id: 't2', qarzId: 'q2', valyuta: 'dollar', summa: 9998 }),
        ]),
      ]),
    })
    expect(screen.getByText('Yopilgan')).toBeDefined()
    // Ochiq qarz netto blokida ham, kartochkada ham koʻrinadi; yopilganining 1 senti yoʻq.
    expect(screen.getAllByText('+0,02 $')).toHaveLength(2)
    expect(screen.queryByText('+0,01 $')).toBeNull()
  })

  it('mezon 6b — soʻm qarzida 100 soʻm yopilgan, 101 soʻm ochiq', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', summa: 1000 }), [tolov({ id: 't1', qarzId: 'q1', summa: 900 })]),
        holat(qarz({ id: 'q2', summa: 1000 }), [tolov({ id: 't2', qarzId: 'q2', summa: 899 })]),
      ]),
    })
    expect(screen.getByText('Yopilgan')).toBeDefined()
    expect(screen.getAllByText('+101 soʻm')).toHaveLength(2)
    expect(screen.queryByText('+100 soʻm')).toBeNull()
  })

  it('avval ochiq qarzlar, keyin «Yopilgan qarzlar» sarlavhasi va yopilganlar', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', summa: 1000 }), [tolov({ id: 't1', qarzId: 'q1', summa: 1000 })]),
        holat(qarz({ id: 'q2', summa: 700000 })),
      ]),
    })
    const sarlavha = screen.getByRole('heading', { name: 'Yopilgan qarzlar', level: 2 })
    expect(sarlavha).toBeDefined()
    const kartochkalar = screen
      .getAllByRole('listitem')
      .filter((q) => q.className.includes('qarz-kartochka'))
    expect(kartochkalar[0]?.textContent).toContain('+700 000 soʻm')
    expect(kartochkalar[1]?.textContent).toContain('Yopilgan')
  })

  it('yopilgani boʻlmasa «Yopilgan qarzlar» sarlavhasi koʻrinmaydi', () => {
    chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    expect(screen.queryByRole('heading', { name: 'Yopilgan qarzlar' })).toBeNull()
  })

  it('mezon 42 — «＋ Toʻlov» faqat ochiq qarzda boʻladi (0061)', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', summa: 1000 }), [tolov({ id: 't1', qarzId: 'q1', summa: 1000 })]),
      ]),
    })
    expect(screen.queryByRole('button', { name: '＋ Toʻlov' })).toBeNull()
  })

  it('«＋ Toʻlov» ochiq qarzda oʻsha qarz bilan chaqiriladi', async () => {
    const ochiq = qarz({ id: 'q1' })
    const { yangiTolov, odam } = chiz({ holat: kontaktHolati([holat(ochiq)]) })
    await odam.click(tugma('＋ Toʻlov'))
    expect(yangiTolov).toHaveBeenCalledWith(ochiq)
  })

  it('kartochkada «yopish» tugmasi yoʻq — yopiqlik hisoblanadi (0052)', () => {
    chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    expect(screen.queryByRole('button', { name: /yopish/i })).toBeNull()
  })
})

describe('toʻlovlar tarixi (mezon 7; dizayn 0-boʻlim)', () => {
  it('mezon 7 — toʻlov sana, hisob va ayirilgan summa bilan koʻrinadi', () => {
    chiz({
      holat: kontaktHolati([holat(qarz({ id: 'q1' }), [tolov({ id: 't1', qarzId: 'q1' })])]),
    })
    const qator = tolovQatori('−300 000 soʻm')
    expect(within(qator).getByText('Bugun')).toBeDefined()
    expect(within(qator).getByText('Karta')).toBeDefined()
  })

  it('boshqa valyutadagi toʻlovda kiritilgan summa va kurs ham koʻrinadi', () => {
    chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', valyuta: 'dollar', summa: 10000 }), [
          tolov({ id: 't1', qarzId: 'q1', valyuta: 'som', summa: 625000, kurs: 12500 }),
        ]),
      ]),
    })
    expect(screen.getByText('Karta · 625 000 soʻm · 1 $ = 12 500 soʻm')).toBeDefined()
    expect(screen.getByText('−50,00 $')).toBeDefined()
  })

  it('toʻlovi yoʻq qarzda «Hali toʻlov yoʻq.» turadi', () => {
    chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    expect(screen.getByText('Hali toʻlov yoʻq.')).toBeDefined()
  })

  it('toʻlov qatori bosilgani hech narsa qilmaydi — toʻlov tahrirlanmaydi', () => {
    chiz({
      holat: kontaktHolati([holat(qarz({ id: 'q1' }), [tolov({ id: 't1', qarzId: 'q1' })])]),
    })
    const qator = tolovQatori('−300 000 soʻm')
    expect(within(qator).queryByRole('button', { name: /Bugun/ })).toBeNull()
  })
})

describe('boʻsh holatlar (dizayn: «Boʻsh holatlar»)', () => {
  it('qarz umuman yoʻq boʻlsa ikkita qator turadi, netto va «Ochiq qarz yoʻq.» yoʻq', () => {
    chiz()
    expect(screen.getByText('Bu kontaktda hali qarz yoʻq.')).toBeDefined()
    expect(
      screen.getByText('Birinchi qarzni pastdagi «＋ Yangi qarz» tugmasi bilan qoʻshasiz.'),
    ).toBeDefined()
    expect(screen.queryByText('Ochiq qarz yoʻq.')).toBeNull()
    expect(tugma('Kontaktni oʻchirish')).toBeDefined()
  })
})

describe('kontaktni tahrirlash (0060; mezon 23, 24, 25, 26)', () => {
  it('«Tahrirlash» blokni joriy qiymatlar bilan ochadi, fokus «Ism» da', async () => {
    const { odam } = chiz({
      holat: kontaktHolati([], { kontakt: { ...AKMAL, telefon: '901234567' } }),
    })
    await odam.click(tugma('Tahrirlash'))
    const ism = screen.getByLabelText('Ism') as HTMLInputElement
    expect(ism.value).toBe('Akmal')
    expect((screen.getByLabelText('Telefon (ixtiyoriy)') as HTMLInputElement).value).toBe(
      '901234567',
    )
    expect(document.activeElement).toBe(ism)
  })

  it('mezon 23 — «Saqlash» yangi ismni yuboradi va blok yopiladi', async () => {
    const { tahrirla, odam } = chiz()
    await odam.click(tugma('Tahrirlash'))
    await odam.clear(screen.getByLabelText('Ism'))
    await odam.type(screen.getByLabelText('Ism'), 'Zafar')
    await odam.click(tugma('Saqlash'))

    expect(tahrirla).toHaveBeenCalledWith({ ism: 'Zafar', telefon: '' })
    expect(screen.queryByLabelText('Ism')).toBeNull()
  })

  it('mezon 24 — telefon boʻshatilsa ham saqlanadi', async () => {
    const { tahrirla, odam } = chiz({
      holat: kontaktHolati([], { kontakt: { ...AKMAL, telefon: '901234567' } }),
    })
    await odam.click(tugma('Tahrirlash'))
    await odam.clear(screen.getByLabelText('Telefon (ixtiyoriy)'))
    await odam.click(tugma('Saqlash'))
    expect(tahrirla).toHaveBeenCalledWith({ ism: 'Akmal', telefon: '' })
  })

  it('mezon 25 — ism boʻsh boʻlsa «Ism kiriting.» chiqadi va blok yopilmaydi', async () => {
    const { odam } = chiz({
      tahrirNatijasi: {
        ok: false,
        xatolar: [{ maydon: 'ism', kod: 'kontakt-ism-bosh', xabar: 'Ism kiriting.' }],
      },
    })
    await odam.click(tugma('Tahrirlash'))
    await odam.clear(screen.getByLabelText('Ism'))
    await odam.click(tugma('Saqlash'))

    expect(await screen.findByText('Ism kiriting.')).toBeDefined()
    expect(screen.getByLabelText('Ism')).toBeDefined()
    expect(screen.getByRole('heading', { name: 'Akmal', level: 1 })).toBeDefined()
  })

  it('«Tahrirlash» ochiq blokni oʻzi yopadi va oʻzgartirilgani unutiladi', async () => {
    const { tahrirla, odam } = chiz()
    await odam.click(tugma('Tahrirlash'))
    await odam.type(screen.getByLabelText('Ism'), ' aka')
    await odam.click(tugma('Tahrirlash'))
    expect(screen.queryByLabelText('Ism')).toBeNull()
    expect(tahrirla).not.toHaveBeenCalled()

    await odam.click(tugma('Tahrirlash'))
    expect((screen.getByLabelText('Ism') as HTMLInputElement).value).toBe('Akmal')
  })

  it('blokdan tashqariga tegilsa blok yopiladi va oʻzgartirilgani unutiladi', async () => {
    const { tahrirla, odam } = chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    await odam.click(tugma('Tahrirlash'))
    await odam.type(screen.getByLabelText('Ism'), ' aka')

    await odam.click(screen.getByText('Hali toʻlov yoʻq.'))
    expect(screen.queryByLabelText('Ism')).toBeNull()
    expect(tahrirla).not.toHaveBeenCalled()
  })

  it('blok ichiga tegilsa blok yopilmaydi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Tahrirlash'))
    await odam.click(screen.getByLabelText('Telefon (ixtiyoriy)'))
    expect(screen.getByLabelText('Ism')).toBeDefined()
  })

  it('`×` blokni yopadi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Tahrirlash'))
    await odam.click(tugma('Yopish'))
    expect(screen.queryByLabelText('Ism')).toBeNull()
  })

  it('blokda ism va telefondan boshqa maydon yoʻq (0031)', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Tahrirlash'))
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })

  it('mezon 26 — tahrir bloki qarzlarga va nettoga tegmaydi', async () => {
    const { odam } = chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    await odam.click(tugma('Tahrirlash'))
    expect(screen.getAllByText('+1 000 000 soʻm')).toHaveLength(2)
    expect(screen.getByText('olaman')).toBeDefined()
  })
})

describe('qarzni tahrirlash va oʻchirish (0059; mezon 34, 35, 36)', () => {
  it('kartochka boshi bosilsa tahrirlash formasi ochiladi', async () => {
    const bor = qarz({ id: 'q1' })
    const { qarzniTahrirla, odam } = chiz({ holat: kontaktHolati([holat(bor)]) })
    await odam.click(kartochkaBoshi(/Berdim/))
    expect(qarzniTahrirla).toHaveBeenCalledWith(bor)
  })

  it('yopilgan qarz ham tahrirlanadi', async () => {
    const yopiq = qarz({ id: 'q1', summa: 1000 })
    const { qarzniTahrirla, odam } = chiz({
      holat: kontaktHolati([holat(yopiq, [tolov({ id: 't1', qarzId: 'q1', summa: 1000 })])]),
    })
    await odam.click(kartochkaBoshi(/Berdim/))
    expect(qarzniTahrirla).toHaveBeenCalledWith(yopiq)
  })

  it('kartochka boshi ustiga kursor kelsa «Oʻchirish» koʻrinadi', () => {
    chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
    fireEvent.mouseEnter(kartochkaBoshi(/Berdim/))
    expect(tugma('Oʻchirish')).toBeDefined()
  })

  it('butun ekranda bitta «Oʻchirish» ochiq turadi — qarz va toʻlov birga emas', () => {
    chiz({
      holat: kontaktHolati([holat(qarz({ id: 'q1' }), [tolov({ id: 't1', qarzId: 'q1' })])]),
    })
    fireEvent.mouseEnter(tolovQatori('−300 000 soʻm'))
    expect(screen.getAllByRole('button', { name: 'Oʻchirish' })).toHaveLength(1)
    fireEvent.mouseEnter(kartochkaBoshi(/Berdim/))
    expect(screen.getAllByRole('button', { name: 'Oʻchirish' })).toHaveLength(1)
  })

  it('`Esc` ochilgan «Oʻchirish» tugmasini yopadi', () => {
    chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    fireEvent.mouseEnter(kartochkaBoshi(/Berdim/))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })

  it('mezon 34 — qarz oʻchirilsa panel «Qarz oʻchirildi» boʻladi', async () => {
    const bor = qarz({ id: 'q1' })
    const { qarzniOchir, odam } = chiz({
      holat: kontaktHolati([holat(bor, [tolov({ id: 't1', qarzId: 'q1' })])]),
    })
    fireEvent.mouseEnter(kartochkaBoshi(/Berdim/))
    await odam.click(tugma('Oʻchirish'))

    expect(qarzniOchir).toHaveBeenCalledWith(bor)
    expect(screen.getByText('Qarz oʻchirildi')).toBeDefined()
  })

  it('mezon 35 — «QAYTARISH» qarzni toʻlovlari bilan qaytaradi', async () => {
    const bor = qarz({ id: 'q1' })
    const { qarzniQaytar, odam } = chiz({ holat: kontaktHolati([holat(bor)]) })
    fireEvent.mouseEnter(kartochkaBoshi(/Berdim/))
    await odam.click(tugma('Oʻchirish'))
    await odam.click(tugma('QAYTARISH'))

    expect(qarzniQaytar).toHaveBeenCalledWith({ qarz: bor, tolovlar: [] })
    expect(screen.queryByText('Qarz oʻchirildi')).toBeNull()
  })

  it('mezon 36 — panel 7 soniya turadi, keyin yoʻqoladi', async () => {
    const { odam } = chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    fireEvent.mouseEnter(kartochkaBoshi(/Berdim/))
    await odam.click(tugma('Oʻchirish'))

    await soatniSur(QAYTARISH_MUDDATI - 1000)
    expect(screen.getByText('Qarz oʻchirildi')).toBeDefined()
    await soatniSur(1000)
    expect(screen.queryByText('Qarz oʻchirildi')).toBeNull()
  })
})

describe('toʻlovni oʻchirish (0029, 0048; mezon 8, 9, 9a)', () => {
  function bittaTolov(): KontaktHolati {
    return kontaktHolati([holat(qarz({ id: 'q1' }), [tolov({ id: 't1', qarzId: 'q1' })])])
  }

  it('toʻlov qatori surilsa/hover boʻlsa «Oʻchirish» chiqadi', () => {
    chiz({ holat: bittaTolov() })
    fireEvent.mouseEnter(tolovQatori('−300 000 soʻm'))
    expect(tugma('Oʻchirish')).toBeDefined()
  })

  it('mezon 9 — oʻchirilgach panel «Toʻlov oʻchirildi» boʻladi', async () => {
    const { tolovniOchir, odam } = chiz({ holat: bittaTolov() })
    fireEvent.mouseEnter(tolovQatori('−300 000 soʻm'))
    await odam.click(tugma('Oʻchirish'))

    expect(tolovniOchir).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Toʻlov oʻchirildi')).toBeDefined()
  })

  it('mezon 9 — «QAYTARISH» toʻlovni qaytaradi', async () => {
    const { tolovniQaytar, odam } = chiz({ holat: bittaTolov() })
    fireEvent.mouseEnter(tolovQatori('−300 000 soʻm'))
    await odam.click(tugma('Oʻchirish'))
    await odam.click(tugma('QAYTARISH'))

    expect(tolovniQaytar).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Toʻlov oʻchirildi')).toBeNull()
  })

  it('mezon 9a — panel 7 soniyadan keyin yoʻqoladi', async () => {
    const { odam } = chiz({ holat: bittaTolov() })
    fireEvent.mouseEnter(tolovQatori('−300 000 soʻm'))
    await odam.click(tugma('Oʻchirish'))

    await soatniSur(QAYTARISH_MUDDATI)
    expect(screen.queryByText('Toʻlov oʻchirildi')).toBeNull()
    expect(screen.queryByRole('button', { name: 'QAYTARISH' })).toBeNull()
  })

  it('bir vaqtda bitta panel turadi: ikkinchi oʻchirish birinchisini yakunlaydi', async () => {
    const { odam } = chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1' }), [
          tolov({ id: 't1', qarzId: 'q1' }),
          tolov({ id: 't2', qarzId: 'q1', summa: 200000, sana: kun(-1) }),
        ]),
      ]),
    })
    fireEvent.mouseEnter(tolovQatori('−300 000 soʻm'))
    await odam.click(tugma('Oʻchirish'))
    fireEvent.mouseEnter(tolovQatori('−200 000 soʻm'))
    await odam.click(tugma('Oʻchirish'))

    expect(screen.getAllByText('Toʻlov oʻchirildi')).toHaveLength(1)
  })
})

describe('kontaktni oʻchirish (0030; mezon 16, 17)', () => {
  it('mezon 16 — ochiq qarzi bor kontakt oʻchirilmaydi, sabab koʻrsatiladi', async () => {
    const { odam } = chiz({
      holat: kontaktHolati([holat(qarz({ id: 'q1' }))]),
      ochirishNatijasi: {
        ok: false,
        xatolar: [
          {
            maydon: 'kontaktId',
            kod: 'kontakt-ochiq-qarz',
            xabar: 'Ochiq qarzi bor kontakt oʻchirilmaydi — avval qarzni yoping.',
          },
        ],
      },
    })
    await odam.click(tugma('Kontaktni oʻchirish'))
    expect(
      await screen.findByText(
        'Ochiq qarzi bor kontakt oʻchirilmaydi — avval qarzlarni yoping.',
      ),
    ).toBeDefined()
  })

  it('tugma har doim bosiladi — oʻchiq holatga oʻtkazilmaydi (dizayn)', () => {
    chiz({ holat: kontaktHolati([holat(qarz({ id: 'q1' }))]) })
    expect((tugma('Kontaktni oʻchirish') as HTMLButtonElement).disabled).toBe(false)
  })

  it('mezon 17 — ochiq qarzi yoʻq boʻlsa oʻchirish bajariladi', async () => {
    const { kontaktniOchir, odam } = chiz({
      holat: kontaktHolati([
        holat(qarz({ id: 'q1', summa: 1000 }), [tolov({ id: 't1', qarzId: 'q1', summa: 1000 })]),
      ]),
    })
    await odam.click(tugma('Kontaktni oʻchirish'))
    expect(kontaktniOchir).toHaveBeenCalledTimes(1)
    expect(screen.queryByText(/Ochiq qarzi bor/)).toBeNull()
  })

  it('tasdiq oynasi hech qayerda yoʻq (0029)', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Kontaktni oʻchirish'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('«＋ Yangi qarz»', () => {
  it('pastdagi panelda turadi va chaqiruvni yuboradi', async () => {
    const { yangiQarz, odam } = chiz()
    await odam.click(tugma('＋ Yangi qarz'))
    expect(yangiQarz).toHaveBeenCalledTimes(1)
  })
})
