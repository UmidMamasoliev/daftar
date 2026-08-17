// Ekran formatlash yordamchilari — sana yorligʻi va maydon filtrlari.
//
// Mezonlar: 4b (soʻmda kasr qabul qilinmaydi, dollarda ikki kasr), 4d (manfiy son
// maydonga tushmaydi), 22 (kurs butun soʻmda). Matn va format qoidalari:
// `design/uslub.md` («Son, sana va valyuta formati») va `design/kirim-chiqim.md`.

import { describe, expect, it } from 'vitest'
import { kunMatni } from '../domain/sana.ts'
import { kursniShakllantir, minglikBoshliq, sanaYorligi, summaniShakllantir } from './format.ts'

const BUGUN = '2026-08-17'

function kun(qadam: number): string {
  const vaqt = new Date(2026, 7, 17)
  vaqt.setDate(vaqt.getDate() + qadam)
  return kunMatni(vaqt)
}

describe('sanaYorligi', () => {
  it('bugungi kun uchun «Bugun» deydi', () => {
    expect(sanaYorligi(BUGUN, BUGUN)).toBe('Bugun')
  })

  it('kechagi kun uchun «Kecha» deydi', () => {
    expect(sanaYorligi(kun(-1), BUGUN)).toBe('Kecha')
  })

  it('shu yildagi boshqa kunni `14-avgust` koʻrinishida yozadi', () => {
    expect(sanaYorligi('2026-08-14', BUGUN)).toBe('14-avgust')
  })

  it('boshqa yildagi kunni yil bilan yozadi', () => {
    expect(sanaYorligi('2025-08-16', BUGUN)).toBe('16-avgust 2025')
  })

  it('oy nomlarini oʻzbekcha yozadi', () => {
    expect(sanaYorligi('2026-01-03', BUGUN)).toBe('3-yanvar')
    expect(sanaYorligi('2026-12-31', BUGUN)).toBe('31-dekabr')
  })
})

describe('summaniShakllantir', () => {
  it('harf va belgini maydonga qoʻymaydi', () => {
    expect(summaniShakllantir('12a5b', 'som').qiymat).toBe('125')
  })

  it('manfiy ishorani tashlaydi (mezon 4d)', () => {
    expect(summaniShakllantir('-500', 'som').qiymat).toBe('500')
    expect(summaniShakllantir('-8,50', 'dollar').qiymat).toBe('8,50')
  })

  it('soʻmda kasr qismini olib tashlaydi va buni bildiradi (mezon 4b)', () => {
    expect(summaniShakllantir('12,50', 'som')).toEqual({ qiymat: '12', kasrOlindi: true })
    expect(summaniShakllantir('12.50', 'som')).toEqual({ qiymat: '12', kasrOlindi: true })
  })

  it('soʻmda yolgʻiz kasr belgisi xabar chiqarmaydi — u shunchaki tushmaydi', () => {
    expect(summaniShakllantir('12,', 'som')).toEqual({ qiymat: '12', kasrOlindi: false })
  })

  it('dollarda ikki kasrgacha qabul qiladi, ortigʻini tushirmaydi (mezon 4b)', () => {
    expect(summaniShakllantir('8,50', 'dollar').qiymat).toBe('8,50')
    expect(summaniShakllantir('8,555', 'dollar').qiymat).toBe('8,55')
  })

  it('dollarda nuqtani vergulga oʻgiradi', () => {
    expect(summaniShakllantir('8.5', 'dollar').qiymat).toBe('8,5')
  })
})

describe('kursniShakllantir', () => {
  it('mingliklarni boʻsh joy bilan ajratadi', () => {
    expect(kursniShakllantir('12500').qiymat).toBe('12 500')
    expect(kursniShakllantir('12 500').qiymat).toBe('12 500')
  })

  it('kasr belgisini maydonga qoʻymaydi va buni bildiradi (mezon 22)', () => {
    expect(kursniShakllantir('12500,25')).toEqual({ qiymat: '12 500', kasrOlindi: true })
  })

  it('manfiy ishorani va harfni tashlaydi', () => {
    expect(kursniShakllantir('-12500').qiymat).toBe('12 500')
    expect(kursniShakllantir('12k5').qiymat).toBe('125')
  })
})

describe('minglikBoshliq', () => {
  it('uch xonagacha tegmaydi', () => {
    expect(minglikBoshliq('999')).toBe('999')
  })

  it('boʻsh matnni boʻsh qoldiradi', () => {
    expect(minglikBoshliq('')).toBe('')
  })

  it('katta sonni guruhlaydi', () => {
    expect(minglikBoshliq('1250000')).toBe('1 250 000')
  })
})
