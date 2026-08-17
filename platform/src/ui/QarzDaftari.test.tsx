// «Qarz daftari» — kontaktlar roʻyxati ekrani.
//
// Tavsif: `design/qarz-daftari.md` (1-boʻlim) va `design/uslub.md`.
// Mezonlar: `prds/qarz-daftari.md` → 1, 2, 15c, 15d, 15e, 15f, 15g, 18, 23.
// Qarorlar: 0029, 0030, 0031, 0037, 0048, 0056, 0063.
//
// Doʻkon bu yerda yoʻq: holatlar props orqali keladi, qoʻshish va qaytarish esa
// chaqiruv boʻlib beriladi — shu sababli soxta soat IndexedDB ga xalaqit bermaydi.

import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  Kontakt,
  KontaktFormasi,
  KontaktHolati,
  Natija,
  NettoQatori,
  OchirilganKontakt,
} from '../domain/turlar.ts'
import { QarzDaftari } from './QarzDaftari.tsx'
import { QAYTARISH_MUDDATI } from './QaytarishPaneli.tsx'

function kontakt(id: string, ism: string, telefon?: string): Kontakt {
  return {
    id,
    ism,
    yaratilgan: '2026-08-17T09:00:00.000Z',
    ...(telefon === undefined ? {} : { telefon }),
  }
}

function holat(
  id: string,
  ism: string,
  netto: NettoQatori[] = [],
  telefon?: string,
): KontaktHolati {
  return {
    kontakt: kontakt(id, ism, telefon),
    qarzlar: [],
    netto,
    ochiqQarziBormi: netto.length > 0,
  }
}

type Ustama = {
  kontaktlar?: readonly KontaktHolati[]
  ochirilganKontakt?: OchirilganKontakt | null
  qoshNatijasi?: Natija<Kontakt>
}

function chiz(ustama: Ustama = {}) {
  const och = vi.fn()
  const qaytar = vi.fn(async (_o: OchirilganKontakt): Promise<void> => {})
  const unut = vi.fn()
  const qosh = vi.fn(
    async (_forma: KontaktFormasi): Promise<Natija<Kontakt>> =>
      ustama.qoshNatijasi ?? { ok: true, qiymat: kontakt('yangi', 'Yangi') },
  )
  const natija = render(
    <QarzDaftari
      kontaktlar={ustama.kontaktlar ?? []}
      ochirilganKontakt={ustama.ochirilganKontakt ?? null}
      och={och}
      qosh={qosh}
      qaytar={qaytar}
      unut={unut}
    />,
  )
  return { och, qosh, qaytar, unut, odam: userEvent.setup(), ...natija }
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

describe('yuqori panel (dizayn 1-boʻlim; 0063)', () => {
  it('sarlavha «Qarz daftari»', () => {
    chiz()
    expect(screen.getByRole('heading', { name: 'Qarz daftari', level: 1 })).toBeDefined()
  })

  it('«‹ Orqaga» yoʻq — bu navigatsiyaning oʻz boʻlimi (0063)', () => {
    chiz()
    expect(screen.queryByRole('button', { name: '‹ Orqaga' })).toBeNull()
  })

  it('qidiruv, filtr va saralash tugmasi yoʻq (0002)', () => {
    chiz({ kontaktlar: [holat('k1', 'Akmal')] })
    expect(screen.queryByRole('searchbox')).toBeNull()
    expect(screen.queryByRole('button', { name: /saralash|filtr|qidiruv/i })).toBeNull()
  })
})

describe('kontakt qatori (0031; mezon 1)', () => {
  it('ism kiritilganidek koʻrinadi — bosh harfga oʻgirilmaydi', () => {
    chiz({ kontaktlar: [holat('k1', 'akmal aka')] })
    expect(screen.getByText('akmal aka')).toBeDefined()
  })

  it('telefon raqami ikkinchi qator boʻlib chiqadi va bosilmaydi (0031)', () => {
    chiz({ kontaktlar: [holat('k1', 'Akmal', [], '+998 90 123 45 67')] })
    expect(screen.getByText('+998 90 123 45 67')).toBeDefined()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('telefon boʻsh boʻlsa ikkinchi qator umuman chizilmaydi (mezon 1)', () => {
    chiz({ kontaktlar: [holat('k1', 'Akmal')] })
    const qator = screen.getByRole('button', { name: /Akmal/ })
    expect(qator.textContent).toBe('Akmal')
  })

  it('qator bosilsa kontakt sahifasi ochiladi', async () => {
    const { och, odam } = chiz({ kontaktlar: [holat('k1', 'Akmal')] })
    await odam.click(screen.getByRole('button', { name: /Akmal/ }))
    expect(och).toHaveBeenCalledWith('k1')
  })

  it('roʻyxat qatorida oʻchirish yoʻq — u faqat kontakt sahifasida (dizayn)', () => {
    chiz({ kontaktlar: [holat('k1', 'Akmal')] })
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })

  it('roʻyxat doʻkondan kelgan tartibda chiziladi — ekran qayta saralamaydi', () => {
    chiz({
      kontaktlar: [holat('k1', 'Akmal'), holat('k2', 'botir'), holat('k3', 'Zafar')],
    })
    const ismlar = screen.getAllByRole('listitem').map((q) => q.textContent)
    expect(ismlar).toEqual(['Akmal', 'botir', 'Zafar'])
  })
})

describe('netto qatorlari (0037, 0056; mezon 15c, 15d, 15e, 15f, 15g)', () => {
  it('mezon 15c — musbat netto «olaman» soʻzi va `+` ishorasi bilan', () => {
    chiz({ kontaktlar: [holat('k1', 'Akmal', [{ valyuta: 'dollar', netto: 7000 }])] })
    expect(screen.getByText('olaman')).toBeDefined()
    expect(screen.getByText('+70,00 $')).toBeDefined()
  })

  it('manfiy netto «beraman» soʻzi va `−` ishorasi bilan', () => {
    chiz({ kontaktlar: [holat('k1', 'Akmal', [{ valyuta: 'som', netto: -50000 }])] })
    expect(screen.getByText('beraman')).toBeDefined()
    expect(screen.getByText('−50 000 soʻm')).toBeDefined()
  })

  it('mezon 15e — netto nol boʻlsa qator «hisob teng» boʻlib qoladi', () => {
    chiz({ kontaktlar: [holat('k1', 'Akmal', [{ valyuta: 'dollar', netto: 0 }])] })
    expect(screen.getByText('hisob teng')).toBeDefined()
    expect(screen.getByText('0,00 $')).toBeDefined()
  })

  it('mezon 15d — ochiq qarzi yoʻq valyuta qatori umuman chiqmaydi', () => {
    chiz({ kontaktlar: [holat('k1', 'Akmal', [{ valyuta: 'dollar', netto: 7000 }])] })
    expect(screen.queryByText(/soʻm/)).toBeNull()
  })

  it('mezon 15f — hamma qarzi yopilgan kontaktda birorta netto qatori yoʻq', () => {
    chiz({ kontaktlar: [holat('k1', 'Akmal')] })
    expect(screen.queryByText('olaman')).toBeNull()
    expect(screen.queryByText('beraman')).toBeNull()
    expect(screen.queryByText('hisob teng')).toBeNull()
  })

  it('ikki valyutada ikkita qator chiziladi, aralashtirilmaydi (0038)', () => {
    chiz({
      kontaktlar: [
        holat('k1', 'Akmal', [
          { valyuta: 'som', netto: 700000 },
          { valyuta: 'dollar', netto: -5000 },
        ]),
      ],
    })
    expect(screen.getByText('+700 000 soʻm')).toBeDefined()
    expect(screen.getByText('−50,00 $')).toBeDefined()
    expect(screen.queryByText(/≈/)).toBeNull()
  })
})

describe('boʻsh holat (dizayn: «Boʻsh holat»)', () => {
  it('ikkita qator va joyida turgan «＋ Yangi kontakt»', () => {
    chiz()
    expect(screen.getByText('Hali bitta ham kontakt yoʻq.')).toBeDefined()
    expect(
      screen.getByText(
        'Qarz yozish uchun avval kontakt qoʻshing — pastdagi «＋ Yangi kontakt» tugmasi bilan.',
      ),
    ).toBeDefined()
    expect(screen.getByRole('button', { name: '＋ Yangi kontakt' })).toBeDefined()
  })
})

describe('yangi kontakt bloki (0031; mezon 1, 2)', () => {
  async function blokniOch(odam: ReturnType<typeof chiz>['odam']): Promise<void> {
    await odam.click(screen.getByRole('button', { name: '＋ Yangi kontakt' }))
  }

  it('«＋ Yangi kontakt» blokni ochadi va fokus «Ism» maydoniga tushadi', async () => {
    const { odam } = chiz()
    await blokniOch(odam)
    const ism = screen.getByLabelText('Ism')
    expect(ism).toBeDefined()
    expect(screen.getByLabelText('Telefon (ixtiyoriy)')).toBeDefined()
    expect(document.activeElement).toBe(ism)
  })

  it('blokda faqat ikkita maydon boʻladi (0031)', async () => {
    const { odam } = chiz()
    await blokniOch(odam)
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })

  it('mezon 1 — ism kiritilsa kontakt saqlanadi va blok yopiladi', async () => {
    const { qosh, odam } = chiz()
    await blokniOch(odam)
    await odam.type(screen.getByLabelText('Ism'), '  Akmal  ')
    await odam.type(screen.getByLabelText('Telefon (ixtiyoriy)'), '901234567')
    await odam.click(screen.getByRole('button', { name: 'Qoʻshish' }))

    expect(qosh).toHaveBeenCalledWith({ ism: '  Akmal  ', telefon: '901234567' })
    expect(screen.queryByLabelText('Ism')).toBeNull()
  })

  it('mezon 1 — telefon boʻsh boʻlsa ham saqlanadi', async () => {
    const { qosh, odam } = chiz()
    await blokniOch(odam)
    await odam.type(screen.getByLabelText('Ism'), 'Akmal')
    await odam.click(screen.getByRole('button', { name: 'Qoʻshish' }))

    expect(qosh).toHaveBeenCalledWith({ ism: 'Akmal', telefon: '' })
  })

  it('mezon 2 — ism boʻsh boʻlsa «Ism kiriting.» chiqadi va blok yopilmaydi', async () => {
    const { odam } = chiz({
      qoshNatijasi: {
        ok: false,
        xatolar: [{ maydon: 'ism', kod: 'kontakt-ism-bosh', xabar: 'Ism kiriting.' }],
      },
    })
    await blokniOch(odam)
    await odam.type(screen.getByLabelText('Ism'), '   ')
    await odam.click(screen.getByRole('button', { name: 'Qoʻshish' }))

    expect(await screen.findByText('Ism kiriting.')).toBeDefined()
    expect(screen.getByLabelText('Ism')).toBeDefined()
    expect(screen.getByLabelText('Ism').getAttribute('aria-invalid')).toBe('true')
  })

  it('`×` blokni yopadi va terilgani unutiladi', async () => {
    const { qosh, odam } = chiz()
    await blokniOch(odam)
    await odam.type(screen.getByLabelText('Ism'), 'Akmal')
    await odam.click(screen.getByRole('button', { name: 'Yopish' }))
    expect(qosh).not.toHaveBeenCalled()

    await blokniOch(odam)
    expect((screen.getByLabelText('Ism') as HTMLInputElement).value).toBe('')
  })

  it('blokdan tashqariga tegilsa blok yopiladi', async () => {
    const { odam } = chiz()
    await blokniOch(odam)
    await odam.click(screen.getByRole('heading', { name: 'Qarz daftari', level: 1 }))
    expect(screen.queryByLabelText('Ism')).toBeNull()
  })
})

describe('kontakt oʻchirilgach «qaytarish» paneli (0029, 0030, 0048; mezon 18)', () => {
  const ochirilgan: OchirilganKontakt = {
    kontakt: kontakt('k9', 'Zafar'),
    qarzlar: [],
    tolovlar: [],
  }

  it('panel «Qarz daftari» roʻyxatida chiqadi', () => {
    chiz({ ochirilganKontakt: ochirilgan })
    expect(screen.getByText('Kontakt oʻchirildi')).toBeDefined()
    expect(screen.getByRole('button', { name: 'QAYTARISH' })).toBeDefined()
  })

  it('mezon 18 — «QAYTARISH» kontaktni qarz tarixi bilan qaytaradi', async () => {
    const { qaytar, unut, odam } = chiz({ ochirilganKontakt: ochirilgan })
    await odam.click(screen.getByRole('button', { name: 'QAYTARISH' }))
    expect(qaytar).toHaveBeenCalledWith(ochirilgan)
    expect(unut).toHaveBeenCalledTimes(1)
  })

  it('muddat 7 soniya: undan oldin panel turadi (0048)', async () => {
    const { unut } = chiz({ ochirilganKontakt: ochirilgan })
    await soatniSur(QAYTARISH_MUDDATI - 1000)
    expect(screen.getByRole('button', { name: 'QAYTARISH' })).toBeDefined()
    expect(unut).not.toHaveBeenCalled()
  })

  it('7 soniyadan keyin oʻchirish yakuniy boʻladi', async () => {
    const { unut } = chiz({ ochirilganKontakt: ochirilgan })
    await soatniSur(QAYTARISH_MUDDATI)
    expect(unut).toHaveBeenCalledTimes(1)
  })

  it('panel boʻsh holat ustida ham turadi (dizayn)', () => {
    chiz({ ochirilganKontakt: ochirilgan })
    expect(screen.getByText('Hali bitta ham kontakt yoʻq.')).toBeDefined()
    expect(screen.getByText('Kontakt oʻchirildi')).toBeDefined()
  })
})

describe('yangi kontakt roʻyxatda koʻrinadi', () => {
  it('doʻkon yangilanganda qator qoʻshiladi', () => {
    const { rerender } = chiz({ kontaktlar: [holat('k1', 'Akmal')] })
    rerender(
      <QarzDaftari
        kontaktlar={[holat('k1', 'Akmal'), holat('k2', 'Botir')]}
        ochirilganKontakt={null}
        och={vi.fn()}
        qosh={vi.fn()}
        qaytar={vi.fn()}
        unut={vi.fn()}
      />,
    )
    const royxat = screen.getAllByRole('listitem')
    expect(royxat).toHaveLength(2)
    expect(within(royxat[1] as HTMLElement).getByText('Botir')).toBeDefined()
  })
})
