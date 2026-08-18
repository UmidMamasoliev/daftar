// Ekran yoʻli qoʻlda soʻralgan kursni qanday manba qilishi (0043, 0044) —
// `prds/oylik-hisobot.md` 10a, 10b-bandlar.
//
// Qoidaning oʻzi domenda sinaladi (`domain/kurs.test.ts`). Bu yerda tekshiriladigan
// narsa bitta: ekran yoʻli oʻsha yagona qoidani chaqiradi, oʻzining alohida sintetik
// vaqt qoidasi yoʻq — ilgari aynan shundan «oxirgi kurs» ikki xil chiqqan edi.

import { describe, expect, it } from 'vitest'
import { oxirgiKurs, qoldaKurslarManbalari as domenQoidasi } from '../domain/kurs.ts'
import { qoldaKurslarManbalari } from './kurslar.ts'

describe('qoldaKurslarManbalari (ekran yoʻli)', () => {
  it('domendagi yagona qoidaning oʻzi', () => {
    expect(qoldaKurslarManbalari).toBe(domenQoidasi)
  })

  it('kurs soʻralmagan boʻlsa manba ham yoʻq', () => {
    expect(qoldaKurslarManbalari({})).toEqual([])
  })

  it('0044 — eng kech sanali gʻolib: soʻralgan kurs teng qatnashadi', () => {
    const manbalar = [
      { kurs: 12000, sana: '2026-08-10', yaratilgan: '2026-08-10T09:00:00.000Z' },
      ...qoldaKurslarManbalari({ dollar: { kurs: 12900, sana: '2026-08-17' } }),
    ]
    expect(oxirgiKurs(manbalar)).toBe(12900)
  })

  it('mezon 23d — bir xil sanada keyin kiritilgan yozuv kursi gʻolib boʻladi', () => {
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
