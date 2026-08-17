import { describe, expect, it } from 'vitest'

import { jamiQoldiq, qoldiqlar, taxminiyJamiSomda } from './qoldiq.ts'
import type { Hisob, Valyuta, Yozuv, YozuvTuri } from './turlar.ts'

let sanoq = 0

/** Test yozuvi: faqat qoldiqqa taʼsir qiladigan maydonlar muhim. */
function yoz(
  turi: YozuvTuri,
  summa: number,
  hisob: Hisob,
  valyuta: Valyuta,
  kurs?: number,
): Yozuv {
  sanoq += 1
  const asos = {
    id: `y${sanoq}`,
    yaratilgan: `2026-08-17T09:${String(sanoq).padStart(2, '0')}:00.000Z`,
    turi,
    summa,
    kategoriyaId: 'boshqa',
    sana: '2026-08-17',
    hisob,
  }
  return valyuta === 'dollar'
    ? { ...asos, valyuta, kurs: kurs ?? 12500 }
    : { ...asos, valyuta: 'som' }
}

const NOL = {
  naqd: { som: 0, dollar: 0 },
  karta: { som: 0, dollar: 0 },
}

describe('qoldiqlar (0011, 0023; mezon 8, 9, 10)', () => {
  it('yozuv boʻlmasa hamma qoldiq nol', () => {
    expect(qoldiqlar([])).toEqual(NOL)
  })

  it('mezon 8 — kirim koʻpaytiradi, chiqim kamaytiradi', () => {
    const natija = qoldiqlar([
      yoz('kirim', 1000000, 'karta', 'som'),
      yoz('chiqim', 250000, 'karta', 'som'),
    ])
    expect(natija.karta.som).toBe(750000)
    expect(natija.naqd.som).toBe(0)
  })

  it('qoldiq manfiy boʻlishi ham mumkin — daftar toʻgʻrisini koʻrsatadi', () => {
    expect(qoldiqlar([yoz('chiqim', 50000, 'naqd', 'som')]).naqd.som).toBe(-50000)
  })

  it('mezon 9 — dollardagi yozuv soʻm qoldigʻiga tegmaydi', () => {
    const natija = qoldiqlar([
      yoz('kirim', 1000000, 'naqd', 'som'),
      yoz('kirim', 10000, 'naqd', 'dollar', 12500),
    ])
    expect(natija.naqd).toEqual({ som: 1000000, dollar: 10000 })
    expect(natija.karta).toEqual({ som: 0, dollar: 0 })
  })

  it('hisoblar aralashmaydi: naqd va karta alohida sanaladi', () => {
    const natija = qoldiqlar([
      yoz('kirim', 500000, 'naqd', 'som'),
      yoz('kirim', 700000, 'karta', 'som'),
      yoz('chiqim', 200000, 'naqd', 'som'),
    ])
    expect(natija.naqd.som).toBe(300000)
    expect(natija.karta.som).toBe(700000)
  })

  it('mezon 10 — tahrirlangan yozuv qoldiqni darhol yangilaydi, eski qiymat qolmaydi', () => {
    const yozuv = yoz('chiqim', 250000, 'karta', 'som')
    const kirim = yoz('kirim', 1000000, 'karta', 'som')

    expect(qoldiqlar([kirim, yozuv]).karta.som).toBe(750000)

    const tahrirlangan: Yozuv = { ...yozuv, summa: 300000 }
    expect(qoldiqlar([kirim, tahrirlangan]).karta.som).toBe(700000)

    // oʻchirilgan yozuv roʻyxatdan chiqadi — qoldiq oʻz-oʻzidan tiklanadi (mezon 11)
    expect(qoldiqlar([kirim]).karta.som).toBe(1000000)
  })
})

describe('jamiQoldiq va taxminiyJamiSomda (0020, 0023, 0038)', () => {
  it('hamma hisob boʻyicha valyutalar alohida qoʻshiladi', () => {
    const natija = jamiQoldiq(
      qoldiqlar([
        yoz('kirim', 500000, 'naqd', 'som'),
        yoz('kirim', 700000, 'karta', 'som'),
        yoz('kirim', 10000, 'naqd', 'dollar'),
        yoz('kirim', 5000, 'karta', 'dollar'),
      ]),
    )
    expect(natija).toEqual({ som: 1200000, dollar: 15000 })
  })

  it('«≈ jami soʻmda» dollarni oxirgi kurs bilan qoʻshadi (mezon 21, 23)', () => {
    expect(taxminiyJamiSomda({ som: 1200000, dollar: 10000 }, 12500)).toBe(2450000)
  })

  it('dollar qoldigʻi nol boʻlsa taxminiy jami soʻm qoldigʻiga teng', () => {
    expect(taxminiyJamiSomda({ som: 1200000, dollar: 0 }, 12500)).toBe(1200000)
  })
})
