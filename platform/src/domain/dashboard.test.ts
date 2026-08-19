// Dashboard sof hisoblari — spec `specs/001-dashboard/spec.md`, prds/dashboard.md mezonlari.
//
// «mezon N» — prds/dashboard.md «Qanday tekshiramiz» roʻyxatidagi raqam.

import { describe, expect, it } from 'vitest'
import { oyYigindilari, zaxiraEslatmasiKerakmi } from './dashboard.ts'
import type { Davr } from './hisobot.ts'
import type { Yozuv } from './turlar.ts'

const DAVR: Davr = { boshlanish: '2026-08-01', tugash: '2026-08-31' }

let sanoq = 0
function yozuv(qism: {
  turi: 'kirim' | 'chiqim'
  summa: number
  sana: string
  valyuta?: 'som' | 'dollar'
}): Yozuv {
  sanoq += 1
  const asos = {
    id: `y${String(sanoq)}`,
    yaratilgan: `2026-08-01T00:00:0${String(sanoq % 10)}.000Z`,
    turi: qism.turi,
    summa: qism.summa,
    kategoriyaId: 'oziq-ovqat',
    sana: qism.sana,
    hisob: 'karta' as const,
  }
  return qism.valyuta === 'dollar'
    ? { ...asos, valyuta: 'dollar', kurs: 12500 }
    : { ...asos, valyuta: 'som' }
}

describe('oyYigindilari — joriy oy kirim va chiqimi (mezon 7, 8, 9)', () => {
  it('mezon 7 — kirim yigʻindisi shu davrdagi kirim yozuvlaridan chiqadi', () => {
    const natija = oyYigindilari(
      [
        yozuv({ turi: 'kirim', summa: 700000, sana: '2026-08-05' }),
        yozuv({ turi: 'kirim', summa: 300000, sana: '2026-08-10' }),
        yozuv({ turi: 'chiqim', summa: 45000, sana: '2026-08-10' }),
      ],
      DAVR,
    )
    expect(natija.kirim).toEqual([{ valyuta: 'som', summa: 1000000 }])
  })

  it('mezon 8 — chiqim yigʻindisi shu davrdagi chiqim yozuvlaridan chiqadi', () => {
    const natija = oyYigindilari(
      [
        yozuv({ turi: 'chiqim', summa: 45000, sana: '2026-08-05' }),
        yozuv({ turi: 'chiqim', summa: 5000, sana: '2026-08-31' }),
      ],
      DAVR,
    )
    expect(natija.chiqim).toEqual([{ valyuta: 'som', summa: 50000 }])
  })

  it('mezon 9 — oʻtgan oy yozuvi joriy oy raqamlariga qoʻshilmaydi', () => {
    const natija = oyYigindilari(
      [
        yozuv({ turi: 'kirim', summa: 700000, sana: '2026-07-31' }),
        yozuv({ turi: 'kirim', summa: 300000, sana: '2026-08-01' }),
        yozuv({ turi: 'chiqim', summa: 45000, sana: '2026-09-01' }),
      ],
      DAVR,
    )
    expect(natija.kirim).toEqual([{ valyuta: 'som', summa: 300000 }])
    expect(natija.chiqim).toEqual([{ valyuta: 'som', summa: 0 }])
  })

  it('valyutalar alohida qatorda, tartib — avval soʻm, keyin dollar (0038 ruhi)', () => {
    const natija = oyYigindilari(
      [
        yozuv({ turi: 'chiqim', summa: 1000, sana: '2026-08-05', valyuta: 'dollar' }),
        yozuv({ turi: 'chiqim', summa: 45000, sana: '2026-08-06' }),
      ],
      DAVR,
    )
    expect(natija.chiqim).toEqual([
      { valyuta: 'som', summa: 45000 },
      { valyuta: 'dollar', summa: 1000 },
    ])
  })

  it('faqat dollarda yozuv boʻlsa soʻm qatori chizilmaydi', () => {
    const natija = oyYigindilari(
      [yozuv({ turi: 'kirim', summa: 5000, sana: '2026-08-05', valyuta: 'dollar' })],
      DAVR,
    )
    expect(natija.kirim).toEqual([{ valyuta: 'dollar', summa: 5000 }])
  })

  it('boʻsh boʻlak bitta nol soʻm qatori bilan turadi (mezon 2 ruhi)', () => {
    const natija = oyYigindilari([], DAVR)
    expect(natija.kirim).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(natija.chiqim).toEqual([{ valyuta: 'som', summa: 0 }])
  })
})

describe('zaxiraEslatmasiKerakmi — 30 kunlik eslatma sharti (mezon 15, 17, 18; 0024)', () => {
  it('mezon 15 — hech qachon eksport qilinmagan boʻlsa eslatma kerak', () => {
    expect(zaxiraEslatmasiKerakmi(null, '2026-08-19')).toBe(true)
  })

  it('mezon 17 — 30 kundan kam oʻtgan boʻlsa eslatma kerak emas', () => {
    expect(zaxiraEslatmasiKerakmi('2026-07-21', '2026-08-19')).toBe(false) // 29 kun
    expect(zaxiraEslatmasiKerakmi('2026-08-19', '2026-08-19')).toBe(false) // bugun
  })

  it('«30 kun oʻtsa» — 30-kun toʻlganda eslatma chiqadi (spec FR-012 talqini)', () => {
    expect(zaxiraEslatmasiKerakmi('2026-07-20', '2026-08-19')).toBe(true) // 30 kun
  })

  it('mezon 18 — 30 kundan koʻp oʻtgan boʻlsa eslatma qaytadi', () => {
    expect(zaxiraEslatmasiKerakmi('2026-07-19', '2026-08-19')).toBe(true) // 31 kun
    expect(zaxiraEslatmasiKerakmi('2025-08-19', '2026-08-19')).toBe(true) // bir yil
  })

  it('oy chegarasi orqali toʻgʻri sanaydi (28/31 kunlik oylar)', () => {
    expect(zaxiraEslatmasiKerakmi('2026-02-01', '2026-03-02')).toBe(false) // 29 kun (2026 — oddiy yil)
    expect(zaxiraEslatmasiKerakmi('2026-02-01', '2026-03-03')).toBe(true) // 30 kun
  })
})
