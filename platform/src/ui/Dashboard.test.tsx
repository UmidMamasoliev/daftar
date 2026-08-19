// Bosh sahifa (dashboard) komponenti — spec `specs/001-dashboard/spec.md`.
//
// «mezon N» — prds/dashboard.md «Qanday tekshiramiz» roʻyxatidagi raqam. Doʻkon bu yerda
// yoʻq: maʼlumot props orqali keladi (App beradi), shuning uchun testlar sof koʻrinishni
// tekshiradi. Doʻkon bilan ulangan oqim — `src/App.dashboard.test.tsx` da.

import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { TaxminiyJami } from '../domain/hisobot.ts'
import type { Qoldiqlar, Yozuv } from '../domain/turlar.ts'
import { Dashboard, type DashboardProps } from './Dashboard.tsx'

afterEach(cleanup)

const NOL_QOLDIQ: Qoldiqlar = {
  naqd: { som: 0, dollar: 0 },
  karta: { som: 0, dollar: 0 },
}

const YOQ: TaxminiyJami = { holat: 'yoq' }

let sanoq = 0
function yozuv(qism: { summa: number; sana?: string; izoh?: string }): Yozuv {
  sanoq += 1
  return {
    id: `y${String(sanoq)}`,
    yaratilgan: `2026-08-01T00:00:${String(sanoq).padStart(2, '0')}.000Z`,
    turi: 'chiqim',
    summa: qism.summa,
    kategoriyaId: 'oziq-ovqat',
    sana: qism.sana ?? '2026-08-19',
    hisob: 'karta',
    valyuta: 'som',
    ...(qism.izoh === undefined ? {} : { izoh: qism.izoh }),
  }
}

function chiz(qism: Partial<DashboardProps> = {}) {
  const yangiYozuv = vi.fn()
  const hammasi = vi.fn()
  const kursniSaqla = qism.kursniSaqla ?? vi.fn()
  render(
    <Dashboard
      qoldiqlar={qism.qoldiqlar ?? NOL_QOLDIQ}
      taxminiy={qism.taxminiy ?? YOQ}
      oy={
        qism.oy ?? {
          kirim: [{ valyuta: 'som', summa: 0 }],
          chiqim: [{ valyuta: 'som', summa: 0 }],
        }
      }
      yozuvlar={qism.yozuvlar ?? []}
      kategoriyalar={qism.kategoriyalar ?? [{ id: 'oziq-ovqat', nom: 'oziq-ovqat' }]}
      eslatmaKerak={qism.eslatmaKerak ?? false}
      oxirgiEksport={qism.oxirgiEksport ?? null}
      yangiYozuv={yangiYozuv}
      hammasi={hammasi}
      kursniSaqla={kursniSaqla}
    />,
  )
  return { yangiYozuv, hammasi, kursniSaqla, odam: userEvent.setup() }
}

function bolim(nom: string): HTMLElement {
  return screen.getByRole('region', { name: nom })
}

describe('qoldiq kartochkasi (US1)', () => {
  it('mezon 2 — boʻsh daftarda qoldiq nol boʻlib koʻrinadi va ekran xato bermaydi', () => {
    chiz()
    expect(screen.getByRole('heading', { name: 'Daftar', level: 1 })).toBeDefined()
    expect(within(bolim('Qoldiq')).getAllByText('0 soʻm').length).toBeGreaterThan(0)
  })

  it('mezon 12 — soʻm va dollar qoldiqlari alohida qatorlarda koʻrsatiladi', () => {
    chiz({
      qoldiqlar: {
        naqd: { som: 1200000, dollar: 10000 },
        karta: { som: 300000, dollar: 0 },
      },
    })
    const qoldiq = bolim('Qoldiq')
    expect(within(qoldiq).getByText('1 500 000 soʻm')).toBeDefined()
    // Dollar ham umumiy blokda, ham naqd qatorida koʻrinadi — ikkalasi alohida qator.
    expect(within(qoldiq).getAllByText('100,00 $').length).toBeGreaterThan(0)
  })

  it('mezon 12a — umumiy qoldiq tagida naqd va karta alohida qatorlarda', () => {
    chiz({
      qoldiqlar: {
        naqd: { som: 1200000, dollar: 10000 },
        karta: { som: 300000, dollar: 0 },
      },
    })
    const naqd = within(bolim('Qoldiq')).getByText('Naqd').closest('li')
    const karta = within(bolim('Qoldiq')).getByText('Karta').closest('li')
    expect(naqd?.textContent).toContain('1 200 000 soʻm')
    expect(naqd?.textContent).toContain('100,00 $')
    expect(karta?.textContent).toContain('300 000 soʻm')
  })

  it('mezon 12c — naqdda dollar boʻlmasa naqd qatorida dollar koʻrsatkichi chizilmaydi', () => {
    chiz({
      qoldiqlar: {
        naqd: { som: 500000, dollar: 0 },
        karta: { som: 0, dollar: 2500 },
      },
    })
    const naqd = within(bolim('Qoldiq')).getByText('Naqd').closest('li')
    expect(naqd?.textContent).not.toContain('$')
    const karta = within(bolim('Qoldiq')).getByText('Karta').closest('li')
    expect(karta?.textContent).toContain('25,00 $')
  })

  it('manfiy qoldiq ishorasi bilan koʻrsatiladi (chiqim kirimdan oshgan holat)', () => {
    chiz({
      qoldiqlar: {
        naqd: { som: 0, dollar: 0 },
        karta: { som: -45000, dollar: 0 },
      },
    })
    expect(within(bolim('Qoldiq')).getAllByText('−45 000 soʻm').length).toBeGreaterThan(0)
  })

  it('mezon 11 — qarz qoldigʻi alohida raqam sifatida koʻrinmaydi', () => {
    chiz()
    expect(screen.queryByText(/[Qq]arz/)).toBeNull()
  })
})

describe('«≈ jami soʻmda» va kurs soʻrovi (US2)', () => {
  it('mezon 13 — taxminiy jami «≈» va «taxminiy» belgilari bilan koʻrinadi', () => {
    chiz({
      qoldiqlar: {
        naqd: { som: 1200000, dollar: 10000 },
        karta: { som: 0, dollar: 0 },
      },
      taxminiy: { holat: 'bor', somda: 2450000, kurs: 12500 },
    })
    const qoldiq = bolim('Qoldiq')
    expect(within(qoldiq).getByText('≈ 2 450 000 soʻm')).toBeDefined()
    expect(within(qoldiq).getByText('taxminiy · 1 $ = 12 500 soʻm')).toBeDefined()
  })

  it('dollar yoʻq boʻlsa (holat `yoq`) ≈ qatori umuman chizilmaydi', () => {
    chiz({ taxminiy: YOQ })
    expect(screen.queryByText(/≈/)).toBeNull()
  })

  it('mezon 14 — kurs yoʻq boʻlsa taxminiy jami oʻrnida kurs soʻrovi turadi', async () => {
    const { kursniSaqla, odam } = chiz({ taxminiy: { holat: 'kurs-kerak' } })
    expect(screen.getByText('Taxminiy jamini koʻrsatish uchun kurs kerak.')).toBeDefined()
    expect(screen.queryByText(/≈/)).toBeNull()

    await odam.type(screen.getByLabelText('Kurs — 1 dollar necha soʻm'), '12500')
    await odam.click(screen.getByRole('button', { name: 'Saqlash' }))
    expect(kursniSaqla).toHaveBeenCalledWith(12500)
  })

  it('mezon 14b — kurs maydoniga kasr belgisi tushmaydi', async () => {
    const { odam } = chiz({ taxminiy: { holat: 'kurs-kerak' } })
    const maydon = screen.getByLabelText('Kurs — 1 dollar necha soʻm') as HTMLInputElement
    // Kasr maydonga umuman tushmaydi (0042; Hisobot ekranidagi bilan bir xil qoida):
    // yopishtirilgan «12500,5» dan kasr qismi kesiladi va yordam qatori chiqadi.
    await odam.click(maydon)
    await odam.paste('12500,5')
    expect(maydon.value).toBe('12 500')
    expect(screen.getByText('Kurs butun soʻmda — kasr qismi olib tashlandi.')).toBeDefined()
  })

  it('kurs «Saqlash» tez ikki bosilganda bitta niyat — bitta saqlash (lessons qoidasi)', async () => {
    const sekinSaqla = vi.fn(
      () =>
        new Promise<void>((bajarildi) => {
          setTimeout(bajarildi, 50)
        }),
    )
    const { odam } = chiz({ taxminiy: { holat: 'kurs-kerak' }, kursniSaqla: sekinSaqla })
    await odam.type(screen.getByLabelText('Kurs — 1 dollar necha soʻm'), '12500')
    const tugma = screen.getByRole('button', { name: 'Saqlash' })
    // Saqlash ketayotganda tugma oʻchiq turadi — ikkinchi bosish oʻtmaydi.
    await Promise.all([odam.click(tugma), odam.click(tugma)])
    expect(sekinSaqla).toHaveBeenCalledTimes(1)
  })

  it('summalar sigʻmasa «hisoblanmadi» qatori chiqadi, ekran buzilmaydi', () => {
    chiz({ taxminiy: { holat: 'hisoblanmadi' } })
    expect(
      screen.getByText('Taxminiy jami hisoblanmadi — summalar juda katta.'),
    ).toBeDefined()
  })
})

describe('joriy oy kartochkasi (US3)', () => {
  it('mezon 7, 8 — kirim va chiqim qatorlari ishorasi va valyutasi bilan', () => {
    chiz({
      oy: {
        kirim: [{ valyuta: 'som', summa: 1000000 }],
        chiqim: [
          { valyuta: 'som', summa: 50000 },
          { valyuta: 'dollar', summa: 1000 },
        ],
      },
    })
    const oy = bolim('Joriy oy')
    const kirim = within(oy).getByText('Kirim').closest('li')
    const chiqim = within(oy).getByText('Chiqim').closest('li')
    expect(kirim?.textContent).toContain('+1 000 000 soʻm')
    expect(chiqim?.textContent).toContain('−50 000 soʻm')
    expect(chiqim?.textContent).toContain('−10,00 $')
  })

  it('boʻsh oyda ikkala qator nol boʻlib ishorasiz turadi', () => {
    chiz()
    const oy = bolim('Joriy oy')
    expect(within(oy).getAllByText('0 soʻm')).toHaveLength(2)
  })
})

describe('oxirgi yozuvlar va harakatlar (US4)', () => {
  it('roʻyxat eng koʻpi 5 ta yozuvni koʻrsatadi, eng yangisi yuqorida (FR-009)', () => {
    const royxat = [
      yozuv({ summa: 600, izoh: 'oltinchi' }),
      yozuv({ summa: 500, izoh: 'beshinchi' }),
      yozuv({ summa: 400, izoh: 'tortinchi' }),
      yozuv({ summa: 300, izoh: 'uchinchi' }),
      yozuv({ summa: 200, izoh: 'ikkinchi' }),
      yozuv({ summa: 100, izoh: 'birinchi' }),
    ]
    chiz({ yozuvlar: royxat })
    const qatorlar = within(bolim('Oxirgi yozuvlar')).getAllByRole('listitem')
    expect(qatorlar).toHaveLength(5)
    expect(qatorlar[0]?.textContent).toContain('oltinchi')
    expect(qatorlar[4]?.textContent).toContain('ikkinchi')
    expect(screen.queryByText(/birinchi/)).toBeNull()
  })

  it('qator kategoriya nomi, izohi va summasini Yozuvlar ekrani qoidasida koʻrsatadi', () => {
    chiz({ yozuvlar: [yozuv({ summa: 45000, izoh: 'nonushta' })] })
    const qator = within(bolim('Oxirgi yozuvlar')).getByRole('listitem')
    expect(qator.textContent).toContain('oziq-ovqat')
    expect(qator.textContent).toContain('Karta · nonushta')
    expect(qator.textContent).toContain('−45 000 soʻm')
  })

  it('mezon 19 — «＋ Yozuv» tugmasi koʻrinib turadi va chaqiruvni yuboradi', async () => {
    const { yangiYozuv, odam } = chiz()
    await odam.click(screen.getByRole('button', { name: '＋ Yozuv' }))
    expect(yangiYozuv).toHaveBeenCalledTimes(1)
  })

  it('mezon 20 — «Hammasi ›» toʻliq roʻyxatga oʻtish chaqiruvini yuboradi', async () => {
    const { hammasi, odam } = chiz({ yozuvlar: [yozuv({ summa: 100 })] })
    await odam.click(screen.getByRole('button', { name: 'Hammasi ›' }))
    expect(hammasi).toHaveBeenCalledTimes(1)
  })

  it('boʻsh daftarda roʻyxat oʻrnida boʻsh holat matni turadi', () => {
    chiz()
    expect(screen.getByText('Hali bitta ham yozuv yoʻq.')).toBeDefined()
    expect(
      screen.getByText('Birinchi yozuvni pastdagi «＋ Yozuv» tugmasi bilan qoʻshasiz.'),
    ).toBeDefined()
  })
})

describe('zaxira eslatmasi (US5)', () => {
  it('mezon 15 — hech qachon eksport qilinmagan daftarda eslatma koʻrinadi', () => {
    chiz({ eslatmaKerak: true, oxirgiEksport: null })
    expect(
      screen.getByText('Daftar hali zaxira qilinmagan — «Zaxira» boʻlimidan eksport qiling.'),
    ).toBeDefined()
  })

  it('mezon 18 — eski eksportda 30 kunlik eslatma matni koʻrinadi', () => {
    chiz({ eslatmaKerak: true, oxirgiEksport: '2026-07-01' })
    expect(
      screen.getByText('Oxirgi zaxiradan 30 kun oʻtdi — «Zaxira» boʻlimidan yangisini oling.'),
    ).toBeDefined()
  })

  it('mezon 17 — shart bajarilmasa eslatma turmaydi', () => {
    chiz({ eslatmaKerak: false, oxirgiEksport: '2026-08-18' })
    expect(screen.queryByText(/zaxira/i)).toBeNull()
  })

  it('eslatma oddiy matn qatori — bosiladigan emas (spec Assumptions)', () => {
    chiz({ eslatmaKerak: true, oxirgiEksport: null })
    const eslatma = screen.getByText(/zaxira qilinmagan/)
    expect(eslatma.closest('button')).toBeNull()
    expect(eslatma.closest('a')).toBeNull()
  })
})
