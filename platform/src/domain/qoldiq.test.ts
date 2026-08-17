import { describe, expect, it } from 'vitest'

import { jamiQoldiq, qarzQoldiqlari, qoldiqlar, qoldiqlarniQosh, taxminiyJamiSomda } from './qoldiq.ts'
import type {
  Hisob,
  Qarz,
  QarzYonalishi,
  Tolov,
  Valyuta,
  Yozuv,
  YozuvTuri,
} from './turlar.ts'

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

// ─── Qarz va toʻlovlarning hisob qoldigʻiga taʼsiri (0017, 0035; mezon 13–15b) ───

/** Test qarzi. */
function qarzYoz(
  yonalishi: QarzYonalishi,
  summa: number,
  hisob: Hisob,
  valyuta: Valyuta,
  id = 'q1',
): Qarz {
  return {
    id,
    yaratilgan: '2026-08-17T09:00:00.000Z',
    kontaktId: 'k1',
    yonalishi,
    summa,
    valyuta,
    sana: '2026-08-17',
    hisob,
  }
}

/** Test toʻlovi. */
function tolovYoz(
  qarzId: string,
  summa: number,
  hisob: Hisob,
  valyuta: Valyuta,
  kurs?: number,
): Tolov {
  const asos = {
    id: `t-${qarzId}-${summa}`,
    yaratilgan: '2026-08-17T10:00:00.000Z',
    qarzId,
    summa,
    valyuta,
    sana: '2026-08-17',
    hisob,
  }
  return kurs === undefined ? asos : { ...asos, kurs }
}

describe('qarzQoldiqlari (0017, 0035; mezon 13, 14, 15)', () => {
  it('qarz ham toʻlov ham boʻlmasa hamma qoldiq nol', () => {
    expect(qarzQoldiqlari([], [])).toEqual(NOL)
  })

  it('mezon 13 — qarz berilganda tanlangan hisob qoldigʻi kamayadi', () => {
    const natija = qarzQoldiqlari([qarzYoz('berdim', 1000000, 'karta', 'som')], [])

    expect(natija.karta.som).toBe(-1000000)
    expect(natija.naqd.som).toBe(0)
  })

  it('mezon 14 — qarz olinganda tanlangan hisob qoldigʻi ortadi', () => {
    const natija = qarzQoldiqlari([qarzYoz('oldim', 1000000, 'naqd', 'som')], [])

    expect(natija.naqd.som).toBe(1000000)
    expect(natija.karta.som).toBe(0)
  })

  it('mezon 15 — men bergan qarzga toʻlov kelganda hisob qoldigʻi ortadi', () => {
    const qarz = qarzYoz('berdim', 1000000, 'karta', 'som')
    const natija = qarzQoldiqlari([qarz], [tolovYoz(qarz.id, 300000, 'karta', 'som')])

    expect(natija.karta.som).toBe(-700000)
  })

  it('men olgan qarzni qaytarsam hisob qoldigʻi kamayadi', () => {
    const qarz = qarzYoz('oldim', 1000000, 'karta', 'som')
    const natija = qarzQoldiqlari([qarz], [tolovYoz(qarz.id, 300000, 'karta', 'som')])

    expect(natija.karta.som).toBe(700000)
  })

  it('mezon 15a — toʻlov oʻz hisobiga tushadi: qarz kartada, toʻlov naqdda', () => {
    const qarz = qarzYoz('berdim', 1000000, 'karta', 'som')
    const natija = qarzQoldiqlari([qarz], [tolovYoz(qarz.id, 400000, 'naqd', 'som')])

    expect(natija.karta.som).toBe(-1000000)
    expect(natija.naqd.som).toBe(400000)
  })

  it('toʻlov oʻz valyutasida pulga tegadi — dollar qarziga soʻm toʻlov soʻm qoldigʻiga tushadi (0023)', () => {
    const qarz = qarzYoz('berdim', 10000, 'karta', 'dollar')
    const natija = qarzQoldiqlari([qarz], [tolovYoz(qarz.id, 625000, 'karta', 'som', 12500)])

    expect(natija.karta.dollar).toBe(-10000)
    expect(natija.karta.som).toBe(625000)
  })

  it('qarzi topilmagan toʻlov hisobga olinmaydi (buzuq maʼlumotda jim xato boʻlmasin)', () => {
    expect(qarzQoldiqlari([], [tolovYoz('yoq-bunday', 500000, 'karta', 'som')])).toEqual(NOL)
  })

  it('mezon 15h — chegara bilan yopilgan qarzning mikro-qoldigʻi hisob qoldigʻiga tegmaydi (0056)', () => {
    const qarz = qarzYoz('berdim', 10000, 'karta', 'dollar')
    const natija = qarzQoldiqlari([qarz], [tolovYoz(qarz.id, 9999, 'karta', 'dollar')])

    // Qarz yopiq sanaladi (1 sent dumi), lekin pul harakati toʻliq koʻrinadi.
    expect(natija.karta.dollar).toBe(-1)
  })
})

describe('qoldiqlarniQosh (mezon 15b)', () => {
  it('yozuv va qarz qoldiqlari qoʻshiladi', () => {
    const yozuvlar = qoldiqlar([yoz('kirim', 2000000, 'karta', 'som')])
    const qarzlar = qarzQoldiqlari([qarzYoz('berdim', 1000000, 'karta', 'som')], [])

    expect(qoldiqlarniQosh(yozuvlar, qarzlar).karta.som).toBe(1000000)
  })

  it('mezon 15b — qarzdan keyin ham naqd va karta yigʻindisi umumiy qoldiqqa teng', () => {
    const yozuvlar = qoldiqlar([
      yoz('kirim', 2000000, 'karta', 'som'),
      yoz('kirim', 500000, 'naqd', 'som'),
    ])
    const qarzlar = qarzQoldiqlari(
      [qarzYoz('berdim', 1000000, 'karta', 'som'), qarzYoz('oldim', 300000, 'naqd', 'som', 'q2')],
      [],
    )

    const hammasi = qoldiqlarniQosh(yozuvlar, qarzlar)
    const jami = jamiQoldiq(hammasi)

    expect(hammasi.karta.som + hammasi.naqd.som).toBe(jami.som)
    expect(jami.som).toBe(2000000 + 500000 - 1000000 + 300000)
  })

  it('boʻsh qoʻshish qoldiqni oʻzgartirmaydi', () => {
    expect(qoldiqlarniQosh(NOL, NOL)).toEqual(NOL)
  })
})
