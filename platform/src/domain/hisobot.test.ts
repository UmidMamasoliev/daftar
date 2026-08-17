// Oylik hisobotning hisob-kitobi — sof mantiq testlari.
// Mezonlar — `prds/oylik-hisobot.md` dagi «Qanday tekshiramiz» roʻyxati (1–21).
// Qoidalar — `design/oylik-hisobot.md` 6-boʻlim («Qaysi yozuv qaysi qatorga tushadi»).

import { describe, expect, it } from 'vitest'

import {
  QARZ_QATORLARI,
  QARZ_QATOR_ISHORASI,
  davrTogrimi,
  davrgaKiradimi,
  hisobotYasa,
  joriyOyDavri,
  oyDavri,
  oySur,
  qarzManzili,
  sananingOyi,
  tolovManzili,
  xavfsizTaxminiyJami,
  yozuvManzili,
} from './hisobot.ts'
import type {
  Davr,
  HisobotKirishi,
  KategoriyaQatori,
  QarzQatoriTuri,
  ValyutaQatori,
} from './hisobot.ts'
import { tayyorKategoriyalar } from './kategoriya.ts'
import { taxminiyJamiSomda } from './qoldiq.ts'
import type {
  Hisob,
  Kategoriya,
  Qarz,
  QarzYonalishi,
  Tolov,
  Valyuta,
  Yozuv,
  YozuvTuri,
} from './turlar.ts'

const AVGUST: Davr = { boshlanish: '2026-08-01', tugash: '2026-08-31' }
const IYUL: Davr = { boshlanish: '2026-07-01', tugash: '2026-07-31' }

let sanoq = 0

/** Test yozuvi. Summa — eng kichik birlikda: soʻmda soʻm, dollarda sent. */
function yoz(
  turi: YozuvTuri,
  summa: number,
  valyuta: Valyuta,
  sana: string,
  kategoriyaId = turi === 'kirim' ? 'oylik' : 'boshqa',
  kurs = 12500,
): Yozuv {
  sanoq += 1
  const asos = {
    id: `y${sanoq}`,
    yaratilgan: `2026-08-17T09:${String(sanoq % 60).padStart(2, '0')}:00.000Z`,
    turi,
    summa,
    kategoriyaId,
    sana,
    hisob: 'karta' as Hisob,
  }
  return valyuta === 'dollar'
    ? { ...asos, valyuta: 'dollar' as const, kurs }
    : { ...asos, valyuta: 'som' as const }
}

/** Test qarzi. */
function qarzYasa(
  yonalishi: QarzYonalishi,
  summa: number,
  valyuta: Valyuta,
  sana: string,
  id?: string,
): Qarz {
  sanoq += 1
  return {
    id: id ?? `q${sanoq}`,
    yaratilgan: `2026-08-17T10:${String(sanoq % 60).padStart(2, '0')}:00.000Z`,
    kontaktId: 'k1',
    yonalishi,
    summa,
    valyuta,
    sana,
    hisob: 'karta',
  }
}

/** Test toʻlovi — summa toʻlovning OʻZ valyutasida (0064). */
function tolovYasa(
  qarzId: string,
  summa: number,
  valyuta: Valyuta,
  sana: string,
  kurs?: number,
): Tolov {
  sanoq += 1
  const asos = {
    id: `t${sanoq}`,
    yaratilgan: `2026-08-17T11:${String(sanoq % 60).padStart(2, '0')}:00.000Z`,
    qarzId,
    summa,
    valyuta,
    sana,
    hisob: 'karta' as Hisob,
  }
  return kurs === undefined ? asos : { ...asos, kurs }
}

/** Hisobot kirishi — standart: boʻsh daftar, avgust davri, kurs yoʻq. */
function kirish(qism: Partial<HisobotKirishi> = {}): HisobotKirishi {
  return {
    davr: AVGUST,
    yozuvlar: [],
    qarzlar: [],
    tolovlar: [],
    kategoriyalar: tayyorKategoriyalar(),
    kurs: null,
    ...qism,
  }
}

/** Testning oʻz sanogʻi — hisobot funksiyasidan mustaqil (tenglikni u tekshiradi). */
function yigindi(qatorlar: readonly { valyuta: Valyuta; summa: number }[], valyuta: Valyuta): number {
  let jami = 0
  for (const qator of qatorlar) {
    if (qator.valyuta === valyuta) {
      jami += qator.summa
    }
  }
  return jami
}

function qatorSummasi(qatorlar: readonly ValyutaQatori[], valyuta: Valyuta): number | undefined {
  return qatorlar.find((qator) => qator.valyuta === valyuta)?.summa
}

function kategoriyaQatori(
  qatorlar: readonly KategoriyaQatori[],
  kategoriyaId: string,
  valyuta: Valyuta,
): KategoriyaQatori | undefined {
  return qatorlar.find(
    (qator) => qator.kategoriyaId === kategoriyaId && qator.valyuta === valyuta,
  )
}

function qarzQatoriSummasi(
  qatorlar: readonly { qator: QarzQatoriTuri; valyuta: Valyuta; summa: number }[],
  qator: QarzQatoriTuri,
  valyuta: Valyuta,
): number | undefined {
  return qatorlar.find((q) => q.qator === qator && q.valyuta === valyuta)?.summa
}

// ---------------------------------------------------------------- Davr (0018)

describe('davr — oy va sanadan sanagacha (0018; mezon 1–6)', () => {
  it('mezon 1 — joriy kalendar oy: oyning 1-sanasidan oxirgi sanasigacha', () => {
    expect(joriyOyDavri('2026-08-17')).toEqual({ boshlanish: '2026-08-01', tugash: '2026-08-31' })
  })

  it('mezon 1 — oy uzunligi taqvimdan olinadi (fevral, kabisa yili)', () => {
    expect(oyDavri({ yil: 2026, oy: 2 })).toEqual({
      boshlanish: '2026-02-01',
      tugash: '2026-02-28',
    })
    expect(oyDavri({ yil: 2024, oy: 2 })).toEqual({
      boshlanish: '2024-02-01',
      tugash: '2024-02-29',
    })
  })

  it('mezon 2 — bir oy orqaga: yil chegarasidan ham oʻtadi', () => {
    expect(oySur({ yil: 2026, oy: 1 }, -1)).toEqual({ yil: 2025, oy: 12 })
    expect(oySur({ yil: 2025, oy: 12 }, 1)).toEqual({ yil: 2026, oy: 1 })
    expect(sananingOyi('2026-08-17')).toEqual({ yil: 2026, oy: 8 })
  })

  it('mezon 2 — oldingi oyga oʻtilsa oʻsha oyning raqamlari chiqadi', () => {
    const yozuvlar = [yoz('chiqim', 100000, 'som', '2026-07-15'), yoz('chiqim', 900000, 'som', '2026-08-15')]
    const iyul = hisobotYasa(kirish({ davr: oyDavri({ yil: 2026, oy: 7 }), yozuvlar }))
    expect(qatorSummasi(iyul.chiqim.qatorlar, 'som')).toBe(100000)
  })

  it('mezon 3 — sanadan sanagacha: faqat oraliqdagi yozuvlar sanaladi', () => {
    const yozuvlar = [
      yoz('chiqim', 10000, 'som', '2026-08-04'),
      yoz('chiqim', 20000, 'som', '2026-08-05'),
      yoz('chiqim', 40000, 'som', '2026-08-15'),
      yoz('chiqim', 80000, 'som', '2026-08-16'),
    ]
    const hisobot = hisobotYasa(
      kirish({ davr: { boshlanish: '2026-08-05', tugash: '2026-08-15' }, yozuvlar }),
    )
    expect(qatorSummasi(hisobot.chiqim.qatorlar, 'som')).toBe(60000)
  })

  it('mezon 4 — davr boshlanish kunidagi yozuv kiradi', () => {
    expect(davrgaKiradimi('2026-08-01', AVGUST)).toBe(true)
    const hisobot = hisobotYasa(kirish({ yozuvlar: [yoz('kirim', 5000, 'som', '2026-08-01')] }))
    expect(qatorSummasi(hisobot.kirim.qatorlar, 'som')).toBe(5000)
  })

  it('mezon 5 — davr tugash kunidagi yozuv kiradi', () => {
    expect(davrgaKiradimi('2026-08-31', AVGUST)).toBe(true)
    const hisobot = hisobotYasa(kirish({ yozuvlar: [yoz('kirim', 7000, 'som', '2026-08-31')] }))
    expect(qatorSummasi(hisobot.kirim.qatorlar, 'som')).toBe(7000)
  })

  it('mezon 6 — davrdan tashqaridagi yozuv kirmaydi', () => {
    expect(davrgaKiradimi('2026-07-31', AVGUST)).toBe(false)
    expect(davrgaKiradimi('2026-09-01', AVGUST)).toBe(false)
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [yoz('chiqim', 1000, 'som', '2026-07-31'), yoz('chiqim', 2000, 'som', '2026-09-01')],
      }),
    )
    expect(hisobot.davrdaYozuvBormi).toBe(false)
    expect(hisobot.chiqimAjratmasi).toEqual([])
  })

  it('bitta kunlik davr ham toʻgʻri (dizayn 2-boʻlim); teskari davr notoʻgʻri', () => {
    expect(davrTogrimi({ boshlanish: '2026-08-05', tugash: '2026-08-05' })).toBe(true)
    expect(davrTogrimi({ boshlanish: '2026-08-06', tugash: '2026-08-05' })).toBe(false)
  })
})

// ------------------------------------------------------- Jami raqamlar (0019)

describe('jami kirim, chiqim va farq (0019, 0038; mezon 7–9)', () => {
  it('mezon 7 — jami kirim: davrdagi hamma kirim yozuvining yigʻindisi', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('kirim', 8000000, 'som', '2026-08-02'),
          yoz('kirim', 1000000, 'som', '2026-08-20'),
          yoz('kirim', 20000, 'dollar', '2026-08-21'),
          yoz('chiqim', 500000, 'som', '2026-08-22'),
        ],
      }),
    )
    expect(qatorSummasi(hisobot.kirim.qatorlar, 'som')).toBe(9000000)
    expect(qatorSummasi(hisobot.kirim.qatorlar, 'dollar')).toBe(20000)
  })

  it('mezon 8 — jami chiqim: davrdagi hamma chiqim yozuvining yigʻindisi', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('chiqim', 800000, 'som', '2026-08-02'),
          yoz('chiqim', 2150000, 'som', '2026-08-03'),
          yoz('kirim', 400000, 'som', '2026-08-04'),
        ],
      }),
    )
    expect(qatorSummasi(hisobot.chiqim.qatorlar, 'som')).toBe(2950000)
  })

  it('mezon 9 — farq = jami kirim − jami chiqim, har valyutada alohida', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('kirim', 8000000, 'som', '2026-08-02'),
          yoz('chiqim', 2950000, 'som', '2026-08-03'),
          yoz('kirim', 20000, 'dollar', '2026-08-04'),
          yoz('chiqim', 2000, 'dollar', '2026-08-05'),
        ],
      }),
    )
    expect(qatorSummasi(hisobot.farq.qatorlar, 'som')).toBe(5050000)
    expect(qatorSummasi(hisobot.farq.qatorlar, 'dollar')).toBe(18000)
  })

  it('mezon 9 — farq manfiy ham boʻladi va valyutalar qoʻshilmaydi (dizayn 6-boʻlim 6-qoida)', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('kirim', 200000, 'som', '2026-08-02'),
          yoz('chiqim', 450000, 'som', '2026-08-03'),
          yoz('kirim', 10000, 'dollar', '2026-08-04'),
        ],
      }),
    )
    expect(qatorSummasi(hisobot.farq.qatorlar, 'som')).toBe(-250000)
    expect(qatorSummasi(hisobot.farq.qatorlar, 'dollar')).toBe(10000)
  })

  it('farq qatori dollarda kirim YOKI chiqim boʻlsa chiziladi (dizayn 3-boʻlim)', () => {
    const hisobot = hisobotYasa(
      kirish({ yozuvlar: [yoz('chiqim', 2000, 'dollar', '2026-08-05')] }),
    )
    expect(qatorSummasi(hisobot.kirim.qatorlar, 'dollar')).toBeUndefined()
    expect(qatorSummasi(hisobot.farq.qatorlar, 'dollar')).toBe(-2000)
  })
})

// ------------------------------------------- Kategoriyalar ajratmasi (0038, 0013)

describe('kategoriyalar ajratmasi (0038, 0013; mezon 10–12)', () => {
  it('mezon 10 — chiqim kategoriyalari yigʻindisi «jami chiqim» ga AYNAN teng', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('chiqim', 800000, 'som', '2026-08-02', 'oziq-ovqat'),
          yoz('chiqim', 200000, 'som', '2026-08-03', 'transport'),
          yoz('chiqim', 1950000, 'som', '2026-08-04', 'ijara'),
          yoz('chiqim', 150000, 'som', '2026-08-05', 'oziq-ovqat'),
        ],
      }),
    )
    expect(yigindi(hisobot.chiqimAjratmasi, 'som')).toBe(3100000)
    expect(yigindi(hisobot.chiqimAjratmasi, 'som')).toBe(qatorSummasi(hisobot.chiqim.qatorlar, 'som'))
  })

  it('mezon 10a — aralash valyutali oyda tenglik har valyutada alohida saqlanadi', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('chiqim', 800000, 'som', '2026-08-02', 'oziq-ovqat'),
          yoz('chiqim', 200000, 'som', '2026-08-03', 'transport'),
          yoz('chiqim', 2000, 'dollar', '2026-08-04', 'oziq-ovqat'),
          yoz('chiqim', 500, 'dollar', '2026-08-05', 'kiyim'),
          yoz('kirim', 9000000, 'som', '2026-08-06', 'oylik'),
          yoz('kirim', 30000, 'dollar', '2026-08-07', 'qoshimcha-daromad'),
        ],
      }),
    )
    expect(yigindi(hisobot.chiqimAjratmasi, 'som')).toBe(qatorSummasi(hisobot.chiqim.qatorlar, 'som'))
    expect(yigindi(hisobot.chiqimAjratmasi, 'dollar')).toBe(
      qatorSummasi(hisobot.chiqim.qatorlar, 'dollar'),
    )
    expect(yigindi(hisobot.kirimAjratmasi, 'som')).toBe(qatorSummasi(hisobot.kirim.qatorlar, 'som'))
    expect(yigindi(hisobot.kirimAjratmasi, 'dollar')).toBe(
      qatorSummasi(hisobot.kirim.qatorlar, 'dollar'),
    )
    expect(yigindi(hisobot.chiqimAjratmasi, 'dollar')).toBe(2500)
  })

  it('mezon 10b — dollarda yozuv boʻlmagan oyda dollar qatori umuman chizilmaydi', () => {
    const hisobot = hisobotYasa(
      kirish({ yozuvlar: [yoz('chiqim', 500000, 'som', '2026-08-02', 'oziq-ovqat')] }),
    )
    expect(hisobot.chiqimAjratmasi.every((qator) => qator.valyuta === 'som')).toBe(true)
    expect(qatorSummasi(hisobot.chiqim.qatorlar, 'dollar')).toBeUndefined()
    expect(hisobot.chiqim.taxminiy).toEqual({ holat: 'yoq' })
  })

  it('mezon 11 — kirim va chiqim ajratmalari alohida roʻyxat', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('chiqim', 500000, 'som', '2026-08-02', 'oziq-ovqat'),
          yoz('kirim', 9000000, 'som', '2026-08-03', 'oylik'),
        ],
      }),
    )
    expect(hisobot.chiqimAjratmasi.map((qator) => qator.kategoriyaId)).toEqual(['oziq-ovqat'])
    expect(hisobot.kirimAjratmasi.map((qator) => qator.kategoriyaId)).toEqual(['oylik'])
  })

  it('mezon 12 — yashirilgan kategoriyadagi eski yozuv ajratmada koʻrinadi (0013)', () => {
    const kategoriyalar: Kategoriya[] = tayyorKategoriyalar().map((kategoriya) =>
      kategoriya.id === 'kongilochar' ? { ...kategoriya, yashirilgan: true } : kategoriya,
    )
    const hisobot = hisobotYasa(
      kirish({
        kategoriyalar,
        yozuvlar: [yoz('chiqim', 120000, 'som', '2026-08-02', 'kongilochar')],
      }),
    )
    const qator = kategoriyaQatori(hisobot.chiqimAjratmasi, 'kongilochar', 'som')
    expect(qator?.summa).toBe(120000)
  })

  it('mezon 16b — kategoriya qatorida faqat uch maydon: bosish uchun hech narsa berilmaydi', () => {
    const hisobot = hisobotYasa(
      kirish({ yozuvlar: [yoz('chiqim', 120000, 'som', '2026-08-02', 'oziq-ovqat')] }),
    )
    expect(Object.keys(hisobot.chiqimAjratmasi[0] ?? {}).sort()).toEqual([
      'kategoriyaId',
      'summa',
      'valyuta',
    ])
  })

  it('tartib — summa kamayishi boʻyicha (dizayn 4-boʻlim)', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('chiqim', 500000, 'som', '2026-08-02', 'kiyim'),
          yoz('chiqim', 900000, 'som', '2026-08-03', 'oziq-ovqat'),
          yoz('chiqim', 100000, 'som', '2026-08-04', 'transport'),
        ],
      }),
    )
    expect(hisobot.chiqimAjratmasi.map((qator) => qator.kategoriyaId)).toEqual([
      'oziq-ovqat',
      'kiyim',
      'transport',
    ])
  })

  it('tartib — summalar teng boʻlsa 0028 dagi tayyor roʻyxat tartibi', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('chiqim', 300000, 'som', '2026-08-02', 'transport'),
          yoz('chiqim', 300000, 'som', '2026-08-03', 'oziq-ovqat'),
          yoz('chiqim', 300000, 'som', '2026-08-04', 'ijara'),
        ],
      }),
    )
    expect(hisobot.chiqimAjratmasi.map((qator) => qator.kategoriyaId)).toEqual([
      'oziq-ovqat',
      'transport',
      'ijara',
    ])
  })

  it('tartib — teng summada foydalanuvchi qoʻshgani tayyor roʻyxatdan keyin turadi', () => {
    const kategoriyalar: Kategoriya[] = [
      ...tayyorKategoriyalar(),
      {
        id: 'k1',
        nom: 'kitob',
        turi: 'chiqim',
        yashirilgan: false,
        yaratilgan: '2026-08-01T10:00:00.000Z',
      },
    ]
    const hisobot = hisobotYasa(
      kirish({
        kategoriyalar,
        yozuvlar: [
          yoz('chiqim', 300000, 'som', '2026-08-02', 'k1'),
          yoz('chiqim', 300000, 'som', '2026-08-03', 'transport'),
        ],
      }),
    )
    expect(hisobot.chiqimAjratmasi.map((qator) => qator.kategoriyaId)).toEqual(['transport', 'k1'])
  })

  it('tartib — avval soʻm guruhi, keyin dollar guruhi (dizayn 4-boʻlim)', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('chiqim', 100, 'dollar', '2026-08-02', 'oziq-ovqat'),
          yoz('chiqim', 100000, 'som', '2026-08-03', 'transport'),
        ],
      }),
    )
    expect(hisobot.chiqimAjratmasi.map((qator) => qator.valyuta)).toEqual(['som', 'dollar'])
  })

  it('bitta kategoriya ikki valyutada ikkita qator boʻladi (0038)', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('chiqim', 800000, 'som', '2026-08-02', 'oziq-ovqat'),
          yoz('chiqim', 2000, 'dollar', '2026-08-03', 'oziq-ovqat'),
        ],
      }),
    )
    expect(kategoriyaQatori(hisobot.chiqimAjratmasi, 'oziq-ovqat', 'som')?.summa).toBe(800000)
    expect(kategoriyaQatori(hisobot.chiqimAjratmasi, 'oziq-ovqat', 'dollar')?.summa).toBe(2000)
  })
})

// ------------------------------------------------------------ Qarz bloki (0064)

describe('qarz bloki — toʻrt yoʻnalish (0064, 0017; mezon 13–16a)', () => {
  it('mezon 13 — davrda qarzga berilgan summa alohida qatorda', () => {
    const qarz = qarzYasa('berdim', 1000000, 'som', '2026-08-05')
    const hisobot = hisobotYasa(kirish({ qarzlar: [qarz] }))
    expect(qarzQatoriSummasi(hisobot.qarz, 'berildi', 'som')).toBe(1000000)
  })

  it('mezon 14 — davrda qarzdan qaytgan summa alohida qatorda', () => {
    const qarz = qarzYasa('berdim', 1000000, 'som', '2026-08-05', 'qq1')
    const tolov = tolovYasa('qq1', 300000, 'som', '2026-08-20')
    const hisobot = hisobotYasa(kirish({ qarzlar: [qarz], tolovlar: [tolov] }))
    expect(qarzQatoriSummasi(hisobot.qarz, 'qaytdi', 'som')).toBe(300000)
  })

  it('mezon 14a — olingan qarz «Qarz olindi» qatorida (+)', () => {
    const qarz = qarzYasa('oldim', 500000, 'som', '2026-08-06')
    const hisobot = hisobotYasa(kirish({ qarzlar: [qarz] }))
    expect(qarzQatoriSummasi(hisobot.qarz, 'olindi', 'som')).toBe(500000)
    expect(QARZ_QATOR_ISHORASI.olindi).toBe(1)
  })

  it('mezon 14b — olingan qarzga qilingan toʻlov «Qarz qaytarildi» qatorida (−)', () => {
    const qarz = qarzYasa('oldim', 500000, 'som', '2026-08-06', 'qq2')
    const tolov = tolovYasa('qq2', 200000, 'som', '2026-08-25')
    const hisobot = hisobotYasa(kirish({ qarzlar: [qarz], tolovlar: [tolov] }))
    expect(qarzQatoriSummasi(hisobot.qarz, 'qaytarildi', 'som')).toBe(200000)
    expect(QARZ_QATOR_ISHORASI.qaytarildi).toBe(-1)
  })

  it('mezon 14c — toʻrt qator alohida turadi, bitta nettoga yigʻilmaydi', () => {
    const berdim = qarzYasa('berdim', 1000000, 'som', '2026-08-02', 'qb')
    const oldim = qarzYasa('oldim', 500000, 'som', '2026-08-03', 'qo')
    const hisobot = hisobotYasa(
      kirish({
        qarzlar: [berdim, oldim],
        tolovlar: [
          tolovYasa('qb', 300000, 'som', '2026-08-10'),
          tolovYasa('qo', 200000, 'som', '2026-08-11'),
        ],
      }),
    )
    expect(hisobot.qarz).toEqual([
      { qator: 'berildi', valyuta: 'som', summa: 1000000 },
      { qator: 'qaytdi', valyuta: 'som', summa: 300000 },
      { qator: 'olindi', valyuta: 'som', summa: 500000 },
      { qator: 'qaytarildi', valyuta: 'som', summa: 200000 },
    ])
    expect(QARZ_QATORLARI).toEqual(['berildi', 'qaytdi', 'olindi', 'qaytarildi'])
    expect(QARZ_QATOR_ISHORASI).toEqual({
      berildi: -1,
      qaytdi: 1,
      olindi: 1,
      qaytarildi: -1,
    })
  })

  it('mezon 14d — har qator oddiy yigʻindiga aynan teng, taxminiy kurs qatnashmaydi', () => {
    const hisobot = hisobotYasa(
      kirish({
        qarzlar: [
          qarzYasa('berdim', 1000000, 'som', '2026-08-02'),
          qarzYasa('berdim', 250000, 'som', '2026-08-03'),
          qarzYasa('berdim', 10000, 'dollar', '2026-08-04'),
        ],
        kurs: 12500,
      }),
    )
    expect(qarzQatoriSummasi(hisobot.qarz, 'berildi', 'som')).toBe(1250000)
    expect(qarzQatoriSummasi(hisobot.qarz, 'berildi', 'dollar')).toBe(10000)
  })

  it('mezon 14e — dollar qarziga kelgan soʻm toʻlovi soʻm qatorida, dollar qatoriga tushmaydi', () => {
    const qarz = qarzYasa('berdim', 10000, 'dollar', '2026-08-02', 'qd')
    const tolov = tolovYasa('qd', 625000, 'som', '2026-08-20', 12500)
    const hisobot = hisobotYasa(kirish({ qarzlar: [qarz], tolovlar: [tolov] }))
    expect(qarzQatoriSummasi(hisobot.qarz, 'qaytdi', 'som')).toBe(625000)
    expect(qarzQatoriSummasi(hisobot.qarz, 'qaytdi', 'dollar')).toBeUndefined()
    expect(qarzQatoriSummasi(hisobot.qarz, 'berildi', 'dollar')).toBe(10000)
  })

  it('mezon 14f — qarz oʻz sanasida, toʻlov oʻz sanasida sanaladi', () => {
    const qarz = qarzYasa('berdim', 400000, 'som', '2026-01-25', 'qy')
    const tolov = tolovYasa('qy', 100000, 'som', '2026-02-03')
    const yanvar = hisobotYasa(
      kirish({ davr: oyDavri({ yil: 2026, oy: 1 }), qarzlar: [qarz], tolovlar: [tolov] }),
    )
    const fevral = hisobotYasa(
      kirish({ davr: oyDavri({ yil: 2026, oy: 2 }), qarzlar: [qarz], tolovlar: [tolov] }),
    )
    expect(yanvar.qarz).toEqual([{ qator: 'berildi', valyuta: 'som', summa: 400000 }])
    expect(fevral.qarz).toEqual([{ qator: 'qaytdi', valyuta: 'som', summa: 100000 }])
  })

  it('mezon 14g — faqat soʻmda harakat boʻlsa dollar qatori chizilmaydi', () => {
    const hisobot = hisobotYasa(
      kirish({ qarzlar: [qarzYasa('berdim', 1000000, 'som', '2026-08-05')] }),
    )
    expect(hisobot.qarz.every((qator) => qator.valyuta === 'som')).toBe(true)
  })

  it('mezon 14g — qarz harakati boʻlmagan davrda blok umuman boʻsh', () => {
    const qarz = qarzYasa('berdim', 1000000, 'som', '2026-07-05', 'qi')
    const hisobot = hisobotYasa(
      kirish({ qarzlar: [qarz], tolovlar: [tolovYasa('qi', 100000, 'som', '2026-07-20')] }),
    )
    expect(hisobot.qarz).toEqual([])
    expect(hisobot.davrdaQarzHarakatiBormi).toBe(false)
  })

  it('mezon 10c — qarz qatorlari valyuta boʻyicha ajratiladi (avval soʻm, keyin dollar)', () => {
    const hisobot = hisobotYasa(
      kirish({
        qarzlar: [
          qarzYasa('berdim', 1000000, 'som', '2026-08-02'),
          qarzYasa('berdim', 10000, 'dollar', '2026-08-03'),
        ],
      }),
    )
    expect(hisobot.qarz).toEqual([
      { qator: 'berildi', valyuta: 'som', summa: 1000000 },
      { qator: 'berildi', valyuta: 'dollar', summa: 10000 },
    ])
  })

  it('mezon 15, 16 — qarz summalari jami chiqim va jami kirimga kirmaydi', () => {
    const berdim = qarzYasa('berdim', 1000000, 'som', '2026-08-02', 'qa')
    const oldim = qarzYasa('oldim', 500000, 'som', '2026-08-03', 'qb')
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('kirim', 9000000, 'som', '2026-08-04', 'oylik'),
          yoz('chiqim', 2000000, 'som', '2026-08-05', 'oziq-ovqat'),
        ],
        qarzlar: [berdim, oldim],
        tolovlar: [
          tolovYasa('qa', 300000, 'som', '2026-08-10'),
          tolovYasa('qb', 200000, 'som', '2026-08-11'),
        ],
      }),
    )
    expect(qatorSummasi(hisobot.kirim.qatorlar, 'som')).toBe(9000000)
    expect(qatorSummasi(hisobot.chiqim.qatorlar, 'som')).toBe(2000000)
    expect(qatorSummasi(hisobot.farq.qatorlar, 'som')).toBe(7000000)
  })

  it('mezon 16a — qarz harakatidan keyin ham ajratma tengligiga tegilmaydi', () => {
    const hisobot = hisobotYasa(
      kirish({
        yozuvlar: [
          yoz('chiqim', 800000, 'som', '2026-08-02', 'oziq-ovqat'),
          yoz('chiqim', 200000, 'som', '2026-08-03', 'transport'),
        ],
        qarzlar: [qarzYasa('berdim', 1000000, 'som', '2026-08-04')],
      }),
    )
    expect(yigindi(hisobot.chiqimAjratmasi, 'som')).toBe(qatorSummasi(hisobot.chiqim.qatorlar, 'som'))
    expect(yigindi(hisobot.chiqimAjratmasi, 'som')).toBe(1000000)
    expect(hisobot.chiqimAjratmasi.map((qator) => qator.kategoriyaId)).toEqual([
      'oziq-ovqat',
      'transport',
    ])
  })

  it('qarzi topilmagan toʻlov hisobotni buzmaydi (maʼlumot buzilgan holat)', () => {
    const hisobot = hisobotYasa(kirish({ tolovlar: [tolovYasa('yoq', 100000, 'som', '2026-08-10')] }))
    expect(hisobot.qarz).toEqual([])
  })
})

// ------------------------------------------- Qaysi yozuv qaysi qatorga (dizayn 6)

describe('sanoq ochiq — dizayn 6-boʻlim qoidalari birma-bir', () => {
  it('1-qoida — davrni faqat `sana` aniqlaydi, `yaratilgan` taʼsir qilmaydi (0047)', () => {
    const yozuv: Yozuv = {
      ...yoz('chiqim', 5000, 'som', '2026-08-10'),
      yaratilgan: '2027-01-01T00:00:00.000Z',
    }
    const manzil = yozuvManzili(yozuv, AVGUST)
    expect(manzil.qayerda).toBe('ichkarida')
  })

  it('1-qoida — davrdan tashqaridagi yozuv «tashqarida» boʻladi', () => {
    expect(yozuvManzili(yoz('chiqim', 5000, 'som', '2026-09-01'), AVGUST)).toEqual({
      qayerda: 'tashqarida',
    })
  })

  it('2-qoida — kirim yozuvi kirim boʻlagiga, chiqim yozuvi chiqim boʻlagiga', () => {
    expect(yozuvManzili(yoz('kirim', 5000, 'som', '2026-08-10'), AVGUST)).toMatchObject({
      bolak: 'kirim',
    })
    expect(yozuvManzili(yoz('chiqim', 5000, 'som', '2026-08-10'), AVGUST)).toMatchObject({
      bolak: 'chiqim',
    })
  })

  it('3-qoida — yozuv oʻz valyutasidagi qatorga tushadi, aylantirilmaydi (0038)', () => {
    expect(yozuvManzili(yoz('chiqim', 2000, 'dollar', '2026-08-10'), AVGUST)).toEqual({
      qayerda: 'ichkarida',
      bolak: 'chiqim',
      valyuta: 'dollar',
      kategoriyaId: 'boshqa',
      summa: 2000,
    })
  })

  it('4-qoida — yozuv oʻz kategoriyasiga tushadi (yashirilgan boʻlsa ham)', () => {
    expect(yozuvManzili(yoz('chiqim', 2000, 'som', '2026-08-10', 'kongilochar'), AVGUST)).toMatchObject(
      { kategoriyaId: 'kongilochar' },
    )
  })

  it('5-qoida — qarz yoʻnalishi qatorni aniqlaydi', () => {
    expect(qarzManzili(qarzYasa('berdim', 1000, 'som', '2026-08-10'), AVGUST)).toMatchObject({
      qator: 'berildi',
    })
    expect(qarzManzili(qarzYasa('oldim', 1000, 'som', '2026-08-10'), AVGUST)).toMatchObject({
      qator: 'olindi',
    })
  })

  it('5-qoida — toʻlov qarzning yoʻnalishiga qarab qatorga tushadi', () => {
    const berdim = qarzYasa('berdim', 100000, 'som', '2026-08-01', 'qx')
    const oldim = qarzYasa('oldim', 100000, 'som', '2026-08-01', 'qy')
    expect(tolovManzili(tolovYasa('qx', 5000, 'som', '2026-08-10'), berdim, AVGUST)).toMatchObject({
      qator: 'qaytdi',
    })
    expect(tolovManzili(tolovYasa('qy', 5000, 'som', '2026-08-10'), oldim, AVGUST)).toMatchObject({
      qator: 'qaytarildi',
    })
  })

  it('5a-qoida — qarz oʻz sanasi, toʻlov oʻz sanasi boʻyicha davrga bogʻlanadi', () => {
    const qarz = qarzYasa('berdim', 100000, 'som', '2026-07-25', 'qz')
    expect(qarzManzili(qarz, AVGUST)).toEqual({ qayerda: 'tashqarida' })
    expect(tolovManzili(tolovYasa('qz', 5000, 'som', '2026-08-03'), qarz, AVGUST)).toMatchObject({
      qayerda: 'ichkarida',
    })
  })

  it('5b-qoida — toʻlov OʻZ valyutasi va OʻZ summasi bilan sanaladi (0064)', () => {
    const qarz = qarzYasa('berdim', 10000, 'dollar', '2026-08-01', 'qv')
    expect(tolovManzili(tolovYasa('qv', 625000, 'som', '2026-08-10', 12500), qarz, AVGUST)).toEqual({
      qayerda: 'ichkarida',
      qator: 'qaytdi',
      valyuta: 'som',
      summa: 625000,
    })
  })

  it('toʻlovning qarzi topilmasa manzil «qarzsiz» boʻladi', () => {
    expect(tolovManzili(tolovYasa('yoq', 5000, 'som', '2026-08-10'), null, AVGUST)).toEqual({
      qayerda: 'qarzsiz',
    })
  })
})

// ------------------------------------------------- «≈ jami soʻmda» (0023, 0043–0045)

describe('«≈ jami soʻmda» (0023, 0042, 0044, 0045; mezon 19–21)', () => {
  it('mezon 19 — aralash valyutada soʻm va dollar alohida qatorda turadi', () => {
    const hisobot = hisobotYasa(
      kirish({
        kurs: 12500,
        yozuvlar: [
          yoz('kirim', 8000000, 'som', '2026-08-02'),
          yoz('kirim', 20000, 'dollar', '2026-08-03'),
        ],
      }),
    )
    expect(hisobot.kirim.qatorlar).toEqual([
      { valyuta: 'som', summa: 8000000 },
      { valyuta: 'dollar', summa: 20000 },
    ])
  })

  it('mezon 20 — ≈ qatori alohida maydonda, jami qatorlariga aralashmaydi', () => {
    const hisobot = hisobotYasa(
      kirish({
        kurs: 12500,
        yozuvlar: [
          yoz('kirim', 8000000, 'som', '2026-08-02'),
          yoz('kirim', 20000, 'dollar', '2026-08-03'),
        ],
      }),
    )
    expect(hisobot.kirim.taxminiy).toEqual({ holat: 'bor', somda: 10500000, kurs: 12500 })
    expect(yigindi(hisobot.kirim.qatorlar, 'som')).toBe(8000000)
    expect(hisobot.kurs).toBe(12500)
  })

  it('≈ faqat dollar qatori bor boʻlakda chiziladi (dizayn 3-boʻlim 1-qoida)', () => {
    const hisobot = hisobotYasa(
      kirish({
        kurs: 12500,
        yozuvlar: [
          yoz('kirim', 8000000, 'som', '2026-08-02'),
          yoz('chiqim', 2000, 'dollar', '2026-08-03'),
        ],
      }),
    )
    expect(hisobot.kirim.taxminiy).toEqual({ holat: 'yoq' })
    expect(hisobot.chiqim.taxminiy).toEqual({ holat: 'bor', somda: 250000, kurs: 12500 })
  })

  it('mezon 21 — kurs boʻlmasa ≈ oʻrniga «kurs kerak» holati chiqadi', () => {
    const hisobot = hisobotYasa(
      kirish({ kurs: null, yozuvlar: [yoz('chiqim', 2000, 'dollar', '2026-08-03')] }),
    )
    expect(hisobot.chiqim.taxminiy).toEqual({ holat: 'kurs-kerak' })
    expect(hisobot.kurs).toBeNull()
  })

  it('mezon 21 — kurs berilgach ≈ toʻliq chiqadi, qolgan raqamlar oʻzgarmaydi', () => {
    const yozuvlar = [yoz('chiqim', 2000, 'dollar', '2026-08-03')]
    const kurssiz = hisobotYasa(kirish({ kurs: null, yozuvlar }))
    const kursli = hisobotYasa(kirish({ kurs: 12500, yozuvlar }))
    expect(kursli.chiqim.taxminiy).toEqual({ holat: 'bor', somda: 250000, kurs: 12500 })
    expect(kursli.chiqim.qatorlar).toEqual(kurssiz.chiqim.qatorlar)
  })

  it('0042 — aylantirish eng yaqin soʻmga, teng yarim yuqoriga', () => {
    const hisobot = hisobotYasa(
      kirish({ kurs: 125, yozuvlar: [yoz('chiqim', 2, 'dollar', '2026-08-03')] }),
    )
    expect(hisobot.chiqim.taxminiy).toEqual({ holat: 'bor', somda: 3, kurs: 125 })
  })

  it('farq ning ≈ qatori OʻZ qatorlaridan hisoblanadi («≈kirim − ≈chiqim» emas)', () => {
    const hisobot = hisobotYasa(
      kirish({
        kurs: 130,
        yozuvlar: [
          yoz('kirim', 1, 'dollar', '2026-08-02'),
          yoz('chiqim', 2, 'dollar', '2026-08-03'),
        ],
      }),
    )
    expect(hisobot.kirim.taxminiy).toEqual({ holat: 'bor', somda: 1, kurs: 130 })
    expect(hisobot.chiqim.taxminiy).toEqual({ holat: 'bor', somda: 3, kurs: 130 })
    expect(hisobot.farq.taxminiy).toEqual({ holat: 'bor', somda: -1, kurs: 130 })
  })

  it('≈ kategoriya va qarz qatorlarida YOʻQ (0038 — istisnosiz)', () => {
    const hisobot = hisobotYasa(
      kirish({
        kurs: 12500,
        yozuvlar: [yoz('chiqim', 2000, 'dollar', '2026-08-03', 'oziq-ovqat')],
        qarzlar: [qarzYasa('berdim', 10000, 'dollar', '2026-08-04')],
      }),
    )
    expect(Object.keys(hisobot.chiqimAjratmasi[0] ?? {}).sort()).toEqual([
      'kategoriyaId',
      'summa',
      'valyuta',
    ])
    expect(Object.keys(hisobot.qarz[0] ?? {}).sort()).toEqual(['qator', 'summa', 'valyuta'])
  })

  it('chegaradan oshsa ≈ «hisoblanmadi» boʻladi, qolgan raqamlar joyida qoladi (dizayn 9-boʻlim)', () => {
    const hisobot = hisobotYasa(
      kirish({
        kurs: 9000000000000,
        yozuvlar: [yoz('chiqim', 2000, 'dollar', '2026-08-03', 'oziq-ovqat')],
      }),
    )
    expect(hisobot.chiqim.taxminiy).toEqual({ holat: 'hisoblanmadi' })
    expect(qatorSummasi(hisobot.chiqim.qatorlar, 'dollar')).toBe(2000)
  })
})

describe('xavfsizTaxminiyJami — chegara tekshiruvli yoʻl (KELISHUV 11-boʻlim)', () => {
  it('oddiy holatda `taxminiyJamiSomda` bilan bir xil raqam beradi', () => {
    const jami = { som: 1000000, dollar: 20000 }
    expect(xavfsizTaxminiyJami(jami, 12500)).toEqual({
      holat: 'bor',
      somda: taxminiyJamiSomda(jami, 12500),
      kurs: 12500,
    })
  })

  it('kurs yoʻq boʻlsa «kurs kerak» — hisob qilinmaydi (mezon 21)', () => {
    expect(xavfsizTaxminiyJami({ som: 1000, dollar: 100 }, null)).toEqual({ holat: 'kurs-kerak' })
  })

  it('koʻpaytma xavfsiz butun son chegarasidan oshsa «hisoblanmadi» (mezon 4g ruhi)', () => {
    expect(xavfsizTaxminiyJami({ som: 0, dollar: 2000 }, 9000000000000)).toEqual({
      holat: 'hisoblanmadi',
    })
  })

  it('yigʻindining oʻzi chegaradan oshsa ham «hisoblanmadi»', () => {
    expect(
      xavfsizTaxminiyJami({ som: Number.MAX_SAFE_INTEGER, dollar: 100 }, 12500),
    ).toEqual({ holat: 'hisoblanmadi' })
  })

  it('manfiy dollar qoldigʻi ham toʻgʻri aylanadi (farq boʻlagi uchun)', () => {
    expect(xavfsizTaxminiyJami({ som: 0, dollar: -20000 }, 12500)).toEqual({
      holat: 'bor',
      somda: -2500000,
      kurs: 12500,
    })
  })
})

// ------------------------------------------------------------- Boʻsh holatlar

describe('boʻsh holatlar (dizayn 8-boʻlim; mezon 17)', () => {
  it('mezon 17 — yozuvi boʻlmagan davrda uchala boʻlakda ham `0 soʻm` qatori turadi', () => {
    const hisobot = hisobotYasa(kirish({ yozuvlar: [yoz('chiqim', 5000, 'som', '2026-07-10')] }))
    expect(hisobot.kirim.qatorlar).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(hisobot.chiqim.qatorlar).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(hisobot.farq.qatorlar).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(hisobot.chiqimAjratmasi).toEqual([])
    expect(hisobot.kirimAjratmasi).toEqual([])
    expect(hisobot.qarz).toEqual([])
    expect(hisobot.kirim.taxminiy).toEqual({ holat: 'yoq' })
    expect(hisobot.davrdaYozuvBormi).toBe(false)
    expect(hisobot.daftardaYozuvBormi).toBe(true)
  })

  it('daftar butunlay boʻsh boʻlsa `daftardaYozuvBormi` yolgʻon (dizayn 8b)', () => {
    const hisobot = hisobotYasa(kirish())
    expect(hisobot.daftardaYozuvBormi).toBe(false)
    expect(hisobot.davrdaYozuvBormi).toBe(false)
  })

  it('yarim boʻsh davr — chiqim bor, kirim yoʻq: kirim boʻlagi `0 soʻm` (dizayn 8c)', () => {
    const hisobot = hisobotYasa(
      kirish({ yozuvlar: [yoz('chiqim', 500000, 'som', '2026-08-02', 'oziq-ovqat')] }),
    )
    expect(hisobot.kirim.qatorlar).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(hisobot.kirimAjratmasi).toEqual([])
    expect(qatorSummasi(hisobot.farq.qatorlar, 'som')).toBe(-500000)
  })

  it('faqat qarz harakati boʻlgan davr: jami `0 soʻm`, qarz bloki toʻliq (dizayn 8c)', () => {
    const hisobot = hisobotYasa(
      kirish({ qarzlar: [qarzYasa('berdim', 1000000, 'som', '2026-08-05')] }),
    )
    expect(hisobot.chiqim.qatorlar).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(hisobot.davrdaQarzHarakatiBormi).toBe(true)
    expect(hisobot.davrdaYozuvBormi).toBe(false)
  })

  it('boʻsh davrda kurs soʻralmaydi — ≈ qatori umuman yoʻq', () => {
    const hisobot = hisobotYasa(kirish({ kurs: null }))
    expect(hisobot.kirim.taxminiy).toEqual({ holat: 'yoq' })
    expect(hisobot.chiqim.taxminiy).toEqual({ holat: 'yoq' })
    expect(hisobot.farq.taxminiy).toEqual({ holat: 'yoq' })
  })

  it('hisobot kirish maʼlumotini oʻzgartirmaydi — faqat oʻqiydi', () => {
    const yozuvlar = [yoz('chiqim', 500000, 'som', '2026-08-02', 'oziq-ovqat')]
    const qarzlar = [qarzYasa('berdim', 1000000, 'som', '2026-08-05')]
    const kategoriyalar = tayyorKategoriyalar()
    const nusxa = JSON.stringify({ yozuvlar, qarzlar, kategoriyalar })

    hisobotYasa(kirish({ yozuvlar, qarzlar, kategoriyalar }))

    expect(JSON.stringify({ yozuvlar, qarzlar, kategoriyalar })).toBe(nusxa)
  })

  it('iyul davri avgust yozuvini olmaydi (davr chegarasi ikki tomonlama)', () => {
    const hisobot = hisobotYasa(
      kirish({ davr: IYUL, yozuvlar: [yoz('chiqim', 5000, 'som', '2026-08-01')] }),
    )
    expect(hisobot.davrdaYozuvBormi).toBe(false)
  })
})
