// «Yozuvlar» ekrani — ekran darajasidagi testlar.
//
// Tavsif: `design/kirim-chiqim.md` (2-boʻlim) va `design/uslub.md`.
// Mezonlar: `prds/kirim-chiqim.md` → 11, 12, 12a, 12b, 18, 19, 20. Qarorlar: 0029, 0032,
// 0047, 0048.
//
// Doʻkon bu yerda yoʻq: yozuvlar va kategoriyalar props orqali keladi, oʻchirish va
// qaytarish esa chaqiruv (callback) boʻlib beriladi. Shu sababli soxta soat (fake timers)
// IndexedDB ga xalaqit bermaydi — 7 soniyani soatni oldinga surib tekshiramiz.

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bugun, kunMatni } from '../domain/sana.ts'
import type { Yozuv } from '../domain/turlar.ts'
import type { KategoriyaChipi } from './YozuvForma.tsx'
import { QAYTARISH_MUDDATI, Yozuvlar } from './Yozuvlar.tsx'

const KATEGORIYALAR: readonly KategoriyaChipi[] = [
  { id: 'k-oziq', nom: 'oziq-ovqat' },
  { id: 'k-transport', nom: 'transport' },
  { id: 'k-oylik', nom: 'oylik' },
  { id: 'k-yashirin', nom: 'koʻngilochar' },
]

function kun(qadam: number): string {
  const vaqt = new Date()
  vaqt.setDate(vaqt.getDate() + qadam)
  return kunMatni(vaqt)
}

function yozuv(qism: Partial<Yozuv> & { id: string }): Yozuv {
  return {
    yaratilgan: '2026-08-17T09:00:00.000Z',
    turi: 'chiqim',
    summa: 45000,
    kategoriyaId: 'k-oziq',
    sana: bugun(),
    hisob: 'karta',
    valyuta: 'som',
    ...qism,
  } as Yozuv
}

type Ustama = {
  yozuvlar?: readonly Yozuv[]
  orqaga?: () => void
}

function chiz(ustama: Ustama = {}) {
  const tahrirla = vi.fn()
  const ochir = vi.fn(async (_y: Yozuv): Promise<void> => {})
  const qaytar = vi.fn(async (_y: Yozuv): Promise<void> => {})
  const natija = render(
    <Yozuvlar
      yozuvlar={ustama.yozuvlar ?? []}
      kategoriyalar={KATEGORIYALAR}
      tahrirla={tahrirla}
      ochir={ochir}
      qaytar={qaytar}
      orqaga={ustama.orqaga}
    />,
  )
  const odam = userEvent.setup()
  return { tahrirla, ochir, qaytar, odam, ...natija }
}

function qator(nom: string | RegExp): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

/** Soatni oldinga suradi — panel muddati shu bilan tekshiriladi (0048). */
async function soatniSur(millisoniya: number): Promise<void> {
  await act(async () => {
    vi.advanceTimersByTime(millisoniya)
  })
}

beforeEach(() => {
  // `toFake` faqat `setTimeout`: standart roʻyxatdagi `queueMicrotask` soxtalashtirilsa
  // Reactning `act` i kutib qoladi. `shouldAdvanceTime` esa user-event ning ichki
  // kutishini yashab yuboradi — usiz hech qaysi bosish tugamaydi.
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('koʻrinish va tartib (mezon 19; 0032)', () => {
  it('yuqorida «‹ Orqaga» va «Yozuvlar» sarlavhasi turadi', () => {
    chiz()
    expect(screen.getByRole('heading', { name: 'Yozuvlar', level: 1 })).toBeDefined()
    expect(screen.getByRole('button', { name: '‹ Orqaga' })).toBeDefined()
  })

  it('kunlar sarlavhasi «Bugun», «Kecha» va sana boʻlib chiqadi', () => {
    chiz({
      yozuvlar: [
        yozuv({ id: '1', sana: kun(0) }),
        yozuv({ id: '2', sana: kun(-1) }),
        yozuv({ id: '3', sana: '2025-08-16' }),
      ],
    })
    const sarlavhalar = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(sarlavhalar).toEqual(['Bugun', 'Kecha', '16-avgust 2025'])
  })

  it('kunlar yangisidan eskisiga, bir kun ichida oxirgi kiritilgani yuqorida (0047)', () => {
    chiz({
      yozuvlar: [
        yozuv({ id: 'a', sana: kun(0), yaratilgan: '2026-08-17T10:00:00.000Z', summa: 1000 }),
        yozuv({ id: 'b', sana: kun(0), yaratilgan: '2026-08-17T09:00:00.000Z', summa: 2000 }),
        yozuv({ id: 'c', sana: kun(-2), summa: 3000 }),
      ],
    })
    const summalar = screen
      .getAllByRole('listitem')
      .map((q) => q.textContent?.replace(/\s+/g, ' ') ?? '')
    expect(summalar[0]).toContain('1 000')
    expect(summalar[1]).toContain('2 000')
    expect(summalar[2]).toContain('3 000')
  })

  it('qatorda kategoriya nomi, hisob · izoh va ishorali summa turadi', () => {
    chiz({ yozuvlar: [yozuv({ id: '1', izoh: 'nonushta' })] })
    expect(screen.getByText('oziq-ovqat')).toBeDefined()
    expect(screen.getByText('Karta · nonushta')).toBeDefined()
    expect(screen.getByText('−45 000 soʻm')).toBeDefined()
  })

  it('izoh boʻsh boʻlsa faqat hisob nomi turadi', () => {
    chiz({ yozuvlar: [yozuv({ id: '1', hisob: 'naqd' })] })
    expect(screen.getByText('Naqd')).toBeDefined()
  })

  it('kirim summasi plus ishorasi bilan chiqadi', () => {
    chiz({
      yozuvlar: [
        yozuv({ id: '1', turi: 'kirim', kategoriyaId: 'k-oylik', summa: 1250, valyuta: 'dollar', kurs: 12500 }),
      ],
    })
    expect(screen.getByText('+12,50 $')).toBeDefined()
  })

  it('yashirilgan kategoriyadagi eski yozuvning nomi ham koʻrinadi (mezon 14)', () => {
    chiz({ yozuvlar: [yozuv({ id: '1', kategoriyaId: 'k-yashirin' })] })
    expect(screen.getByText('koʻngilochar')).toBeDefined()
  })

  it('kurs qatorda koʻrsatilmaydi', () => {
    chiz({
      yozuvlar: [yozuv({ id: '1', summa: 1250, valyuta: 'dollar', kurs: 12500 })],
    })
    expect(screen.queryByText(/12 500/)).toBeNull()
  })

  it('qidiruv, filtr, saralash va qoʻshish tugmasi yoʻq (0002, 0032)', () => {
    chiz({ yozuvlar: [yozuv({ id: '1' })] })
    expect(screen.queryByRole('searchbox')).toBeNull()
    expect(screen.queryByRole('button', { name: /saralash|filtr|＋/i })).toBeNull()
  })
})

describe('boʻsh holat', () => {
  it('bitta ham yozuv boʻlmasa ikkita qator turadi', () => {
    chiz({ yozuvlar: [] })
    expect(screen.getByText('Hali bitta ham yozuv yoʻq.')).toBeDefined()
    expect(
      screen.getByText('Birinchi yozuvni bosh sahifadagi «＋ Yozuv» tugmasi bilan qoʻshasiz.'),
    ).toBeDefined()
  })
})

describe('tahrirlashga oʻtish (mezon 18)', () => {
  it('qator bosilsa oʻsha yozuv tahrirlashga beriladi', async () => {
    const kerakli = yozuv({ id: 'x', izoh: 'nonushta' })
    const { tahrirla, odam } = chiz({ yozuvlar: [kerakli] })

    await odam.click(qator(/oziq-ovqat/))
    expect(tahrirla).toHaveBeenCalledTimes(1)
    expect(tahrirla).toHaveBeenCalledWith(kerakli)
  })
})

describe('«Oʻchirish» tugmasining koʻrinishi', () => {
  it('boshida koʻrinmaydi', () => {
    chiz({ yozuvlar: [yozuv({ id: '1' })] })
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })

  it('sichqoncha qator ustiga kelganda koʻrinadi (kompyuter)', async () => {
    chiz({ yozuvlar: [yozuv({ id: '1' })] })
    fireEvent.mouseEnter(qator(/oziq-ovqat/))
    expect(screen.getByRole('button', { name: 'Oʻchirish' })).toBeDefined()
  })

  it('qator chapga surilganda koʻrinadi va surishning oʻzi oʻchirmaydi (telefon)', () => {
    const { ochir } = chiz({ yozuvlar: [yozuv({ id: '1' })] })
    const nishon = qator(/oziq-ovqat/)

    fireEvent.touchStart(nishon, { touches: [{ clientX: 200, clientY: 10 }] })
    fireEvent.touchEnd(nishon, { changedTouches: [{ clientX: 120, clientY: 10 }] })

    expect(screen.getByRole('button', { name: 'Oʻchirish' })).toBeDefined()
    expect(ochir).not.toHaveBeenCalled()
  })

  it('qisqa surish tugmani ochmaydi', () => {
    chiz({ yozuvlar: [yozuv({ id: '1' })] })
    const nishon = qator(/oziq-ovqat/)

    fireEvent.touchStart(nishon, { touches: [{ clientX: 200, clientY: 10 }] })
    fireEvent.touchEnd(nishon, { changedTouches: [{ clientX: 190, clientY: 10 }] })

    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })

  it('`Esc` bosilsa ochilgan tugma yopiladi', async () => {
    const { odam } = chiz({ yozuvlar: [yozuv({ id: '1' })] })
    fireEvent.mouseEnter(qator(/oziq-ovqat/))
    expect(screen.getByRole('button', { name: 'Oʻchirish' })).toBeDefined()

    await odam.keyboard('{Escape}')
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })

  it('bir vaqtda faqat bitta qatorning tugmasi ochiq turadi', () => {
    chiz({
      yozuvlar: [
        yozuv({ id: 'a' }),
        yozuv({ id: 'b', kategoriyaId: 'k-transport' }),
      ],
    })
    fireEvent.mouseEnter(qator(/oziq-ovqat/))
    fireEvent.mouseEnter(qator(/transport/))

    expect(screen.getAllByRole('button', { name: 'Oʻchirish' })).toHaveLength(1)
  })

  it('kursor qatordan chiqqani tugmani yopmaydi (dizayn: qoida)', () => {
    chiz({ yozuvlar: [yozuv({ id: '1' })] })
    const nishon = qator(/oziq-ovqat/)
    fireEvent.mouseEnter(nishon)
    fireEvent.mouseLeave(nishon)

    expect(screen.getByRole('button', { name: 'Oʻchirish' })).toBeDefined()
  })

  it('boshqa joyga tegilsa ochilgan tugma yopiladi', async () => {
    const { odam } = chiz({ yozuvlar: [yozuv({ id: '1' })] })
    fireEvent.mouseEnter(qator(/oziq-ovqat/))
    expect(screen.getByRole('button', { name: 'Oʻchirish' })).toBeDefined()

    await odam.click(screen.getByRole('heading', { name: 'Yozuvlar', level: 1 }))
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })
})

describe('oʻchirish va «qaytarish» paneli (mezon 11, 12, 12a, 12b, 20; 0029, 0048)', () => {
  function ikkiYozuv(): Yozuv[] {
    return [
      yozuv({ id: 'a', yaratilgan: '2026-08-17T10:00:00.000Z' }),
      yozuv({ id: 'b', kategoriyaId: 'k-transport', yaratilgan: '2026-08-17T09:00:00.000Z' }),
    ]
  }

  async function ochirBosildi(odam: ReturnType<typeof chiz>['odam'], nom: RegExp): Promise<void> {
    fireEvent.mouseEnter(qator(nom))
    await odam.click(screen.getByRole('button', { name: 'Oʻchirish' }))
  }

  it('tasdiq soʻralmaydi: «Oʻchirish» darhol ishlaydi va panel chiqadi (mezon 11)', async () => {
    const { ochir, odam } = chiz({ yozuvlar: [yozuv({ id: '1' })] })
    await ochirBosildi(odam, /oziq-ovqat/)

    expect(ochir).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Yozuv oʻchirildi')).toBeDefined()
    expect(screen.getByRole('button', { name: 'QAYTARISH' })).toBeDefined()
  })

  it('«QAYTARISH» bosilsa yozuv qaytariladi va panel yoʻqoladi (mezon 11)', async () => {
    const kerakli = yozuv({ id: '1' })
    const { qaytar, odam } = chiz({ yozuvlar: [kerakli] })
    await ochirBosildi(odam, /oziq-ovqat/)

    await odam.click(screen.getByRole('button', { name: 'QAYTARISH' }))
    expect(qaytar).toHaveBeenCalledTimes(1)
    expect(qaytar).toHaveBeenCalledWith(kerakli)
    expect(screen.queryByRole('button', { name: 'QAYTARISH' })).toBeNull()
  })

  it('muddat 7 soniya: undan oldin panel turadi (0048)', async () => {
    const { odam } = chiz({ yozuvlar: [yozuv({ id: '1' })] })
    await ochirBosildi(odam, /oziq-ovqat/)

    await soatniSur(QAYTARISH_MUDDATI - 1000)
    expect(screen.getByRole('button', { name: 'QAYTARISH' })).toBeDefined()
  })

  it('7 soniyadan keyin panel yoʻqoladi va yozuv qaytmaydi (mezon 12)', async () => {
    const { qaytar, odam } = chiz({ yozuvlar: [yozuv({ id: '1' })] })
    await ochirBosildi(odam, /oziq-ovqat/)

    await soatniSur(QAYTARISH_MUDDATI)
    expect(screen.queryByRole('button', { name: 'QAYTARISH' })).toBeNull()
    expect(qaytar).not.toHaveBeenCalled()
  })

  it('ikkinchi oʻchirish birinchisini yakuniy qiladi va muddat boshidan sanaladi (mezon 12a)', async () => {
    const { qaytar, ochir, odam } = chiz({ yozuvlar: ikkiYozuv() })

    await ochirBosildi(odam, /oziq-ovqat/)
    await soatniSur(5000)
    await ochirBosildi(odam, /transport/)
    expect(ochir).toHaveBeenCalledTimes(2)

    // Birinchi yozuvning muddati tugagan boʻlardi — panel esa hali turadi.
    await soatniSur(3000)
    expect(screen.getByRole('button', { name: 'QAYTARISH' })).toBeDefined()

    await odam.click(screen.getByRole('button', { name: 'QAYTARISH' }))
    expect(qaytar).toHaveBeenCalledTimes(1)
    expect(qaytar.mock.calls[0]?.[0].kategoriyaId).toBe('k-transport')
  })

  it('ekrandan chiqilsa panel yoʻqoladi va oʻchirish yakuniy boʻladi (mezon 12b)', async () => {
    const { qaytar, odam, unmount } = chiz({ yozuvlar: [yozuv({ id: '1' })] })
    await ochirBosildi(odam, /oziq-ovqat/)
    expect(screen.getByRole('button', { name: 'QAYTARISH' })).toBeDefined()

    unmount()
    await soatniSur(QAYTARISH_MUDDATI)
    expect(screen.queryByRole('button', { name: 'QAYTARISH' })).toBeNull()
    expect(qaytar).not.toHaveBeenCalled()
  })

  it('bir vaqtda faqat bitta panel turadi', async () => {
    const { odam } = chiz({ yozuvlar: ikkiYozuv() })
    await ochirBosildi(odam, /oziq-ovqat/)
    await ochirBosildi(odam, /transport/)

    expect(screen.getAllByRole('button', { name: 'QAYTARISH' })).toHaveLength(1)
    expect(screen.getAllByText('Yozuv oʻchirildi')).toHaveLength(1)
  })
})

describe('orqaga qaytish', () => {
  it('«‹ Orqaga» bosilsa chaqiruv ishlaydi', async () => {
    const orqaga = vi.fn()
    const { odam } = chiz({ orqaga })
    await odam.click(screen.getByRole('button', { name: '‹ Orqaga' }))
    expect(orqaga).toHaveBeenCalledTimes(1)
  })
})
