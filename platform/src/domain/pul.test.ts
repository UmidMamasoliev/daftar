import { describe, expect, it } from 'vitest'

import {
  dollarSomgaSigadimi,
  dollarniSomga,
  kursniOqi,
  somDollargaSigadimi,
  somniDollarga,
  summaniMatnga,
  summaniOqi,
} from './pul.ts'
import type { Natija } from './turlar.ts'

/** Testni qisqartirish uchun: natijadagi xato kodlarini roʻyxat qilib beradi. */
function kodlar(natija: Natija<unknown>): string[] {
  return natija.ok ? [] : natija.xatolar.map((xato) => xato.kod)
}

/** Xato boʻlsa — sabab matni boʻsh emasligini tekshiradi (mezon 2, 4c). */
function sabablar(natija: Natija<unknown>): string[] {
  return natija.ok ? [] : natija.xatolar.map((xato) => xato.xabar)
}

describe('summaniOqi — soʻm (0033, mezon 4b, 4c, 4d)', () => {
  it('butun soʻm oʻqiladi', () => {
    expect(summaniOqi('12500', 'som')).toEqual({ ok: true, qiymat: 12500 })
  })

  it('boʻshliqli yozilgan soʻm ham oʻqiladi', () => {
    expect(summaniOqi('12 500', 'som')).toEqual({ ok: true, qiymat: 12500 })
    expect(summaniOqi('1 200 000', 'som')).toEqual({ ok: true, qiymat: 1200000 })
  })

  it('mezon 4b — soʻmda kasrli summa qabul qilinmaydi', () => {
    expect(kodlar(summaniOqi('12,5', 'som'))).toEqual(['summa-kasr'])
    expect(kodlar(summaniOqi('12500.00', 'som'))).toEqual(['summa-kasr'])
  })

  it('mezon 4c — nol summa saqlanmaydi va sabab koʻrsatiladi', () => {
    expect(kodlar(summaniOqi('0', 'som'))).toEqual(['summa-nol'])
    expect(sabablar(summaniOqi('0', 'som'))[0]).not.toBe('')
  })

  it('mezon 4d — manfiy son kiritilmaydi', () => {
    expect(kodlar(summaniOqi('-500', 'som'))).toEqual(['summa-manfiy'])
  })

  it('boʻsh va notoʻgʻri matn ajratiladi', () => {
    expect(kodlar(summaniOqi('', 'som'))).toEqual(['summa-bosh'])
    expect(kodlar(summaniOqi('   ', 'som'))).toEqual(['summa-bosh'])
    expect(kodlar(summaniOqi('salom', 'som'))).toEqual(['summa-notogri'])
  })

  it('xavfsiz butun son chegarasidan oshgan summa qabul qilinmaydi', () => {
    expect(kodlar(summaniOqi('99999999999999999999', 'som'))).toEqual(['summa-notogri'])
  })
})

describe('summaniOqi — dollar (0033, mezon 4b)', () => {
  it('mezon 4b — dollarda ikki kasrli summa sentga aylanadi', () => {
    expect(summaniOqi('8,50', 'dollar')).toEqual({ ok: true, qiymat: 850 })
    expect(summaniOqi('8.50', 'dollar')).toEqual({ ok: true, qiymat: 850 })
    expect(summaniOqi('8,5', 'dollar')).toEqual({ ok: true, qiymat: 850 })
    expect(summaniOqi('100', 'dollar')).toEqual({ ok: true, qiymat: 10000 })
  })

  it('kasr suzuvchi nuqtadan zarar koʻrmaydi', () => {
    expect(summaniOqi('19,99', 'dollar')).toEqual({ ok: true, qiymat: 1999 })
    expect(summaniOqi('0,07', 'dollar')).toEqual({ ok: true, qiymat: 7 })
  })

  it('ikkitadan koʻp kasr qabul qilinmaydi', () => {
    expect(kodlar(summaniOqi('0,001', 'dollar'))).toEqual(['summa-kop-kasr'])
  })

  it('nol va manfiy dollar ham rad etiladi', () => {
    expect(kodlar(summaniOqi('0,00', 'dollar'))).toEqual(['summa-nol'])
    expect(kodlar(summaniOqi('-8,50', 'dollar'))).toEqual(['summa-manfiy'])
  })
})

describe('kursniOqi (0042, mezon 22)', () => {
  it('butun soʻmdagi kurs oʻqiladi', () => {
    expect(kursniOqi('12500')).toEqual({ ok: true, qiymat: 12500 })
    expect(kursniOqi('12 500')).toEqual({ ok: true, qiymat: 12500 })
  })

  it('mezon 22 — kasrli kurs qabul qilinmaydi', () => {
    expect(kodlar(kursniOqi('12500,25'))).toEqual(['kurs-kasr'])
    expect(kodlar(kursniOqi('12500.5'))).toEqual(['kurs-kasr'])
  })

  it('boʻsh, notoʻgʻri va musbat boʻlmagan kurs ajratiladi', () => {
    expect(kodlar(kursniOqi(''))).toEqual(['kurs-bosh'])
    expect(kodlar(kursniOqi('kurs'))).toEqual(['kurs-notogri'])
    expect(kodlar(kursniOqi('0'))).toEqual(['kurs-musbat-emas'])
    expect(kodlar(kursniOqi('-12500'))).toEqual(['kurs-musbat-emas'])
  })

  it('mezon 4f — xavfsiz butun sondan oshgan kurs qabul qilinmaydi', () => {
    // 9 007 199 254 740 991 — `Number.MAX_SAFE_INTEGER`; undan keyingi butun sonlar
    // aniq saqlanmaydi (0008, 0033; spec 1a1), demak kurs ham shu chegarada toʻxtaydi.
    const natija = kursniOqi('9007199254740993')

    expect(kodlar(natija)).toEqual(['kurs-notogri'])
    expect(sabablar(natija)).toEqual(['Kurs juda katta.'])
    expect(natija.ok === false && natija.xatolar[0]?.maydon).toBe('kurs')
  })

  it('mezon 4f — chegaraning oʻzi va undan kichigi qabul qilinaveradi', () => {
    expect(kursniOqi('9007199254740991')).toEqual({ ok: true, qiymat: 9007199254740991 })
    expect(kursniOqi('9007199254740990')).toEqual({ ok: true, qiymat: 9007199254740990 })
  })

  it('mezon 4f — boʻshliqli va juda uzun kurs ham chegarada toʻxtaydi', () => {
    expect(kodlar(kursniOqi('9 007 199 254 740 993'))).toEqual(['kurs-notogri'])
    expect(kodlar(kursniOqi('99999999999999999999'))).toEqual(['kurs-notogri'])
  })
})

describe('dollarniSomga (0042, mezon 21)', () => {
  it('mezon 21 — 100 $ × 12 500 = 1 250 000 soʻm', () => {
    expect(dollarniSomga(10000, 12500)).toBe(1250000)
  })

  it('eng yaqin soʻmga yaxlitlanadi — pastga', () => {
    // 1 sent × 12 501 = 125,01 soʻm → 125
    expect(dollarniSomga(1, 12501)).toBe(125)
  })

  it('eng yaqin soʻmga yaxlitlanadi — yuqoriga', () => {
    // 1 sent × 12 551 = 125,51 soʻm → 126
    expect(dollarniSomga(1, 12551)).toBe(126)
  })

  it('teng yarim yuqoriga ketadi', () => {
    // 1 sent × 12 550 = 125,50 soʻm → 126
    expect(dollarniSomga(1, 12550)).toBe(126)
  })
})

describe('somniDollarga (0042)', () => {
  it('100 001 soʻm 12 500 kurs bilan 8,00 $ boʻladi', () => {
    // 8,00008 $ → eng yaqin sent
    expect(somniDollarga(100001, 12500)).toBe(800)
  })

  it('chegara holatlari: pastga va yuqoriga', () => {
    // 62 soʻm → 0,496 sent → 0; 63 soʻm → 0,504 sent → 1
    expect(somniDollarga(62, 12500)).toBe(0)
    expect(somniDollarga(63, 12500)).toBe(1)
  })

  it('teng yarim yuqoriga ketadi', () => {
    // 1 soʻm × 100 / 200 = 0,5 sent → 1
    expect(somniDollarga(1, 200)).toBe(1)
  })
})

describe('aylantirish chegarasi (1a1, 1a2; mezon 4g)', () => {
  const CHEGARA = Number.MAX_SAFE_INTEGER

  it('oddiy summa va kurs sigadi', () => {
    expect(dollarSomgaSigadimi(10000, 12500)).toBe(true)
  })

  it('mezon 4g — 100 $ × 9 007 199 254 740 kurs chegaradan oshadi', () => {
    // aynan QA topgan holat: summa '10000' (dollar) × kurs '9007199254740'
    expect(dollarSomgaSigadimi(1000000, 9007199254740)).toBe(false)
    // isbot: aylantirish natijasi jimgina xavfsiz chegaradan chiqib ketadi
    expect(Number.isSafeInteger(dollarniSomga(1000000, 9007199254740))).toBe(false)
  })

  it('chegaraning oʻzi sigadi, undan bittasi ortigʻi sigmaydi', () => {
    expect(dollarSomgaSigadimi(1, CHEGARA)).toBe(true)
    expect(dollarSomgaSigadimi(2, CHEGARA)).toBe(false)
  })

  it('teskari aylantirish ham tekshiriladi — soʻm sentga koʻpaytiriladi', () => {
    expect(somDollargaSigadimi(90071992547409)).toBe(true)
    expect(somDollargaSigadimi(90071992547410)).toBe(false)
  })
})

describe('summaniMatnga — tahrirlash formasi uchun teskari oʻgirish', () => {
  it('soʻm butun son boʻlib qaytadi', () => {
    expect(summaniMatnga(12500, 'som')).toBe('12500')
  })

  it('dollar ikki kasr bilan qaytadi', () => {
    expect(summaniMatnga(850, 'dollar')).toBe('8.50')
    expect(summaniMatnga(7, 'dollar')).toBe('0.07')
    expect(summaniMatnga(10000, 'dollar')).toBe('100.00')
  })

  it('summaniOqi bilan aylanma mos keladi', () => {
    expect(summaniOqi(summaniMatnga(1999, 'dollar'), 'dollar')).toEqual({ ok: true, qiymat: 1999 })
    expect(summaniOqi(summaniMatnga(12500, 'som'), 'som')).toEqual({ ok: true, qiymat: 12500 })
  })
})
