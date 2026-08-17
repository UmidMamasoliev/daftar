// Qoʻlda soʻralgan kurs manbasi (0043, 0044) — `prds/oylik-hisobot.md` 10a, 10b-bandlar.

import { describe, expect, it } from 'vitest'
import { oxirgiKurs } from '../domain/kurs.ts'
import { qoldaKurslarManbalari } from './kurslar.ts'

describe('qoldaKurslarManbalari', () => {
  it('kurs soʻralmagan boʻlsa manba ham yoʻq', () => {
    expect(qoldaKurslarManbalari({})).toEqual([])
  })

  it('soʻralgan kurs oʻz sanasi bilan manba boʻladi', () => {
    expect(qoldaKurslarManbalari({ dollar: { kurs: 12500, sana: '2026-08-17' } })).toEqual([
      { kurs: 12500, sana: '2026-08-17', yaratilgan: '2026-08-17T00:00:00.000Z' },
    ])
  })

  it('0044 — eng kech sanali gʻolib: soʻralgan kurs teng qatnashadi', () => {
    const manbalar = [
      { kurs: 12000, sana: '2026-08-10', yaratilgan: '2026-08-10T09:00:00.000Z' },
      ...qoldaKurslarManbalari({ dollar: { kurs: 12900, sana: '2026-08-17' } }),
    ]
    expect(oxirgiKurs(manbalar)).toBe(12900)
  })

  it('0044 — bir xil sanada keyin kiritilgan yozuv kursi gʻolib boʻladi', () => {
    // Qoʻlda soʻralgan kurs kunning boshida turadi: u daftarda birorta kurs
    // boʻlmaganda soʻralgan, oʻsha kundagi yozuv esa undan keyin kiritilgan.
    const manbalar = [
      ...qoldaKurslarManbalari({ dollar: { kurs: 12500, sana: '2026-08-17' } }),
      { kurs: 12900, sana: '2026-08-17', yaratilgan: '2026-08-17T11:00:00.000Z' },
    ]
    expect(oxirgiKurs(manbalar)).toBe(12900)
  })

  it('eski sanali soʻralgan kurs yangi yozuv kursidan yutmaydi', () => {
    const manbalar = [
      { kurs: 12900, sana: '2026-08-16', yaratilgan: '2026-08-16T09:00:00.000Z' },
      ...qoldaKurslarManbalari({ dollar: { kurs: 12000, sana: '2026-08-10' } }),
    ]
    expect(oxirgiKurs(manbalar)).toBe(12900)
  })
})
