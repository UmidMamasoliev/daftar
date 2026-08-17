// Ekran formatlash yordamchilari — sana yorligʻi va maydon filtrlari.
//
// Mezonlar: 4b (soʻmda kasr qabul qilinmaydi, dollarda ikki kasr), 4d (manfiy son
// maydonga tushmaydi), 22 (kurs butun soʻmda). Matn va format qoidalari:
// `design/uslub.md` («Son, sana va valyuta formati») va `design/kirim-chiqim.md`.

import { describe, expect, it } from 'vitest'
import { kunMatni } from '../domain/sana.ts'
import type { Yozuv } from '../domain/turlar.ts'
import {
  belgilarSoni,
  hisobNomi,
  kursniShakllantir,
  kursorOrni,
  minglikBoshliq,
  qatorIzohi,
  sanaYorligi,
  summaKorinishi,
  summaniShakllantir,
} from './format.ts'

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

  it('kasr qismi kesiladi, yaxlitlanmaydi', () => {
    expect(summaniShakllantir('12 999,99', 'som')).toEqual({ qiymat: '12 999', kasrOlindi: true })
  })

  it('mingliklarni terish paytida boʻsh joy bilan ajratadi (uslub: «Maydonda terish»)', () => {
    expect(summaniShakllantir('1200000', 'som').qiymat).toBe('1 200 000')
    expect(summaniShakllantir('1 200 000', 'som').qiymat).toBe('1 200 000')
  })

  it('dollarda ajratish faqat butun qismga tegadi, kasr terilganidek qoladi', () => {
    expect(summaniShakllantir('1234,5', 'dollar').qiymat).toBe('1 234,5')
    expect(summaniShakllantir('1234,50', 'dollar').qiymat).toBe('1 234,50')
    expect(summaniShakllantir('12,', 'dollar').qiymat).toBe('12,')
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

describe('kursor oʻrni (uslub: «Maydonda terish paytidagi format»)', () => {
  it('kursordan chapdagi raqamlarni sanaydi, ajratgichni sanamaydi', () => {
    expect(belgilarSoni('1 20')).toBe(3)
    expect(belgilarSoni('')).toBe(0)
    expect(belgilarSoni('12,')).toBe(3)
  })

  it('format qoʻyilgach kursor oʻsha raqamdan keyin turadi', () => {
    expect(kursorOrni('1 200', 1)).toBe(1)
    expect(kursorOrni('1 200', 2)).toBe(3)
    expect(kursorOrni('1 200', 4)).toBe(5)
  })

  it('kasr belgisi ham sanaladi — kursor undan keyin qoladi', () => {
    expect(kursorOrni('12,', 3)).toBe(3)
  })

  it('boshida va oxirida chegaradan chiqmaydi', () => {
    expect(kursorOrni('1 200', 0)).toBe(0)
    expect(kursorOrni('1 200', 9)).toBe(5)
  })
})

describe('summaKorinishi — roʻyxatdagi summa (uslub: «Son, sana va valyuta formati»)', () => {
  function yozuv(qism: Partial<Yozuv>): Yozuv {
    return {
      id: 'y',
      yaratilgan: '2026-08-17T00:00:00.000Z',
      turi: 'chiqim',
      summa: 45000,
      kategoriyaId: 'k',
      sana: '2026-08-17',
      hisob: 'karta',
      valyuta: 'som',
      ...qism,
    } as Yozuv
  }

  it('chiqimni minus ishorasi bilan, soʻmni mingliklarga ajratib yozadi', () => {
    expect(summaKorinishi(yozuv({}))).toBe('−45 000 soʻm')
  })

  it('kirimni plus ishorasi bilan yozadi', () => {
    expect(summaKorinishi(yozuv({ turi: 'kirim', summa: 1200000 }))).toBe('+1 200 000 soʻm')
  })

  it('dollarni ikki kasr, vergul va `$` bilan yozadi', () => {
    expect(summaKorinishi(yozuv({ turi: 'kirim', summa: 1250, valyuta: 'dollar', kurs: 12500 }))).toBe(
      '+12,50 $',
    )
  })

  it('dollar sentini yoʻqotmaydi', () => {
    expect(summaKorinishi(yozuv({ summa: 805, valyuta: 'dollar', kurs: 12500 }))).toBe('−8,05 $')
  })

  it('dollarda ham ajratish faqat butun qismga tegadi', () => {
    expect(summaKorinishi(yozuv({ summa: 123456, valyuta: 'dollar', kurs: 12500 }))).toBe(
      '−1 234,56 $',
    )
  })
})

describe('qator ikkinchi qatori — hisob va izoh', () => {
  it('hisob nomi bosh harf bilan koʻrsatiladi', () => {
    expect(hisobNomi('karta')).toBe('Karta')
    expect(hisobNomi('naqd')).toBe('Naqd')
  })

  it('izoh boʻlsa nuqta bilan ajratiladi', () => {
    expect(qatorIzohi('karta', 'nonushta')).toBe('Karta · nonushta')
  })

  it('izoh boʻsh boʻlsa faqat hisob nomi qoladi', () => {
    expect(qatorIzohi('naqd', undefined)).toBe('Naqd')
    expect(qatorIzohi('naqd', '')).toBe('Naqd')
  })
})
