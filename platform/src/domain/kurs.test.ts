import { describe, expect, it } from 'vitest'

import { oxirgiKurs, yozuvlardanKurslar } from './kurs.ts'
import type { KursManbai, Yozuv } from './turlar.ts'

/** Kurs manbai yasaydi: kurs, operatsiya sanasi va daftarga tushgan vaqti. */
function manba(kurs: number, sana: string, yaratilgan: string): KursManbai {
  return { kurs, sana, yaratilgan }
}

/** Dollardagi yozuv — kursi bilan. */
function dollarYozuv(id: string, kurs: number, sana: string, yaratilgan: string): Yozuv {
  return {
    id,
    yaratilgan,
    summa: 10000,
    turi: 'chiqim',
    kategoriyaId: 'boshqa',
    sana,
    hisob: 'karta',
    valyuta: 'dollar',
    kurs,
  }
}

/** Soʻmdagi yozuv — kurssiz. */
function somYozuv(id: string, sana: string, yaratilgan: string): Yozuv {
  return {
    id,
    yaratilgan,
    summa: 12500,
    turi: 'chiqim',
    kategoriyaId: 'boshqa',
    sana,
    hisob: 'karta',
    valyuta: 'som',
  }
}

describe('yozuvlardanKurslar', () => {
  it('faqat dollardagi yozuvlardan kurs manbai chiqadi (mezon 7)', () => {
    const yozuvlar = [
      dollarYozuv('y1', 12500, '2026-08-17', '2026-08-17T09:00:00.000Z'),
      somYozuv('y2', '2026-08-17', '2026-08-17T09:01:00.000Z'),
    ]
    expect(yozuvlardanKurslar(yozuvlar)).toEqual([
      manba(12500, '2026-08-17', '2026-08-17T09:00:00.000Z'),
    ])
  })
})

describe('oxirgiKurs (0044, 0045; mezon 23a–23d, 23g)', () => {
  it('mezon 23g — birorta kurs boʻlmasa natija yoʻq (kurs soʻraladi)', () => {
    expect(oxirgiKurs([])).toBeNull()
  })

  it('bitta kurs boʻlsa oʻsha ishlatiladi', () => {
    expect(oxirgiKurs([manba(12500, '2026-08-17', '2026-08-17T09:00:00.000Z')])).toBe(12500)
  })

  it('mezon 23a — oʻtgan sanaga kiritilgan kurs bugungisini bosib ketmaydi', () => {
    const manbalar = [
      manba(12500, '2026-08-17', '2026-08-17T09:00:00.000Z'),
      manba(12000, '2026-08-10', '2026-08-17T09:05:00.000Z'),
    ]
    expect(oxirgiKurs(manbalar)).toBe(12500)
  })

  it('mezon 23b — eng kech sanali yozuv kiritilsa oxirgi kurs oʻshanikiga oʻtadi', () => {
    const manbalar = [
      manba(12500, '2026-08-17', '2026-08-17T09:00:00.000Z'),
      manba(12800, '2026-08-18', '2026-08-18T08:00:00.000Z'),
    ]
    expect(oxirgiKurs(manbalar)).toBe(12800)
  })

  it('mezon 23c — bir xil sanada oxirgi kiritilgani gʻolib', () => {
    const manbalar = [
      manba(12500, '2026-08-17', '2026-08-17T09:00:00.000Z'),
      manba(12600, '2026-08-17', '2026-08-17T09:30:00.000Z'),
    ]
    expect(oxirgiKurs(manbalar)).toBe(12600)
  })

  it('roʻyxat tartibi natijaga taʼsir qilmaydi', () => {
    const manbalar = [
      manba(12600, '2026-08-17', '2026-08-17T09:30:00.000Z'),
      manba(12500, '2026-08-17', '2026-08-17T09:00:00.000Z'),
      manba(12000, '2026-08-10', '2026-08-17T10:00:00.000Z'),
    ]
    expect(oxirgiKurs(manbalar)).toBe(12600)
  })

  it('mezon 23d — qoʻlda soʻralgan kurs kiritilgan kundagi qiymat sifatida qatnashadi', () => {
    const qolda = manba(13000, '2026-08-17', '2026-08-17T12:00:00.000Z')

    // oʻsha kundan oldingi sanali yozuv uni almashtirmaydi
    expect(oxirgiKurs([qolda, manba(12000, '2026-08-16', '2026-08-17T13:00:00.000Z')])).toBe(13000)

    // oʻsha kunda kiritilgan keyingi kurs esa almashtiradi
    expect(oxirgiKurs([qolda, manba(12900, '2026-08-17', '2026-08-17T13:00:00.000Z')])).toBe(12900)
  })
})

describe('oxirgiKurs — yozuv oʻzgarganda qayta hisob (0045; mezon 23e, 23f, 23i)', () => {
  const birinchi = dollarYozuv('y1', 12500, '2026-08-16', '2026-08-16T09:00:00.000Z')
  const ikkinchi = dollarYozuv('y2', 12800, '2026-08-17', '2026-08-17T09:00:00.000Z')

  it('mezon 23e — eng kech sanali kursli yozuv oʻchirilsa oxirgi kurs oldingisiga qaytadi', () => {
    expect(oxirgiKurs(yozuvlardanKurslar([birinchi, ikkinchi]))).toBe(12800)
    expect(oxirgiKurs(yozuvlardanKurslar([birinchi]))).toBe(12500)
  })

  it('mezon 23f — eng kech sanali yozuvning kursi tahrirlansa yangi qiymat ishlatiladi', () => {
    const tahrirlangan = { ...ikkinchi, kurs: 13100 }
    expect(oxirgiKurs(yozuvlardanKurslar([birinchi, tahrirlangan]))).toBe(13100)
  })

  it('mezon 23i — bir xil sanadagi birinchisi tahrirlansa ham gʻolib oʻzgarmaydi', () => {
    const kunBirinchi = dollarYozuv('y1', 12500, '2026-08-17', '2026-08-17T09:00:00.000Z')
    const kunIkkinchi = dollarYozuv('y2', 12600, '2026-08-17', '2026-08-17T09:30:00.000Z')

    // birinchi yozuv tahrirlanadi: kurs oʻzgardi, `yaratilgan` oʻzgarmadi (0047)
    const tahrirlangan = { ...kunBirinchi, kurs: 12900 }

    expect(oxirgiKurs(yozuvlardanKurslar([tahrirlangan, kunIkkinchi]))).toBe(12600)
  })
})
