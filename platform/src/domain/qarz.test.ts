// Qarz daftarining sof mantiqi: tekshiruv, qoldiq, yopilish chegarasi va kontakt nettosi.
// Mezonlar — `prds/qarz-daftari.md` dagi «Qanday tekshiramiz» roʻyxati.

import { describe, expect, it } from 'vitest'

import {
  YOPILISH_CHEGARASI,
  boshlangichKontaktFormasi,
  boshlangichQarzFormasi,
  boshlangichTolovFormasi,
  kontaktNettosi,
  kontaktniTekshir,
  ochiqQarzlar,
  qarzQoldigi,
  qarzTolangani,
  qarzTolovlari,
  qarzYopiqmi,
  qarzniTekshir,
  tolovOldindanKorish,
  tolovQarzValyutasida,
  tolovniTekshir,
} from './qarz.ts'
import { bugun } from './sana.ts'
import type {
  Qarz,
  QarzFormasi,
  QarzYonalishi,
  Tolov,
  TolovFormasi,
  Valyuta,
} from './turlar.ts'

/** Xato kodlarini bitta roʻyxatga yigʻadi — testda taqqoslash oson boʻlsin. */
function kodlar(natija: { ok: boolean; xatolar?: { kod: string }[] }): string[] {
  return (natija.xatolar ?? []).map((x) => x.kod)
}

function qarz(ozgarish: Partial<Qarz> = {}): Qarz {
  return {
    id: 'q1',
    yaratilgan: '2026-08-01T10:00:00.000Z',
    kontaktId: 'k1',
    yonalishi: 'berdim',
    summa: 1000000,
    valyuta: 'som',
    sana: '2026-08-01',
    hisob: 'karta',
    ...ozgarish,
  }
}

function tolov(ozgarish: Partial<Tolov> = {}): Tolov {
  return {
    id: 't1',
    yaratilgan: '2026-08-02T10:00:00.000Z',
    qarzId: 'q1',
    summa: 300000,
    valyuta: 'som',
    sana: '2026-08-02',
    hisob: 'karta',
    ...ozgarish,
  }
}

function qarzFormasi(ozgarish: Partial<QarzFormasi> = {}): QarzFormasi {
  return { ...boshlangichQarzFormasi('k1'), yonalishi: 'berdim', summa: '1000000', ...ozgarish }
}

function tolovFormasi(qarzi: Qarz, ozgarish: Partial<TolovFormasi> = {}): TolovFormasi {
  return { ...boshlangichTolovFormasi(qarzi), summa: '300000', ...ozgarish }
}

describe('kontakt tekshiruvi (0031; mezon 1, 2)', () => {
  it('mezon 1 — ism kiritilgan kontakt saqlanadi, telefon boʻsh boʻlsa maydon umuman boʻlmaydi', () => {
    const natija = kontaktniTekshir({ ism: '  Akmal  ', telefon: '  ' })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.ism).toBe('Akmal')
    expect('telefon' in natija.qiymat).toBe(false)
  })

  it('mezon 1 — telefon kiritilsa oʻzgartirilmasdan saqlanadi (format tekshirilmaydi)', () => {
    const natija = kontaktniTekshir({ ism: 'Akmal', telefon: ' +998 90 123 45 67 ' })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.telefon).toBe('+998 90 123 45 67')
  })

  it('mezon 2 — ismi boʻsh kontakt saqlanmaydi va sabab koʻrsatiladi', () => {
    const natija = kontaktniTekshir({ ism: '   ', telefon: '901234567' })

    expect(natija.ok).toBe(false)
    expect(kodlar(natija)).toEqual(['kontakt-ism-bosh'])
    if (natija.ok) return
    expect(natija.xatolar[0]?.maydon).toBe('ism')
    expect(natija.xatolar[0]?.xabar).not.toBe('')
  })

  it('boshlangʻich forma boʻsh ikki maydondan iborat (0031)', () => {
    expect(boshlangichKontaktFormasi()).toEqual({ ism: '', telefon: '' })
  })
})

describe('qarz tekshiruvi (0033, 0034, 0035; mezon 19, 20, 21)', () => {
  it('mezon 3 — «berdim» yoʻnalishidagi soʻm qarzi tekshiruvdan oʻtadi', () => {
    const natija = qarzniTekshir(qarzFormasi())

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat).toEqual({
      kontaktId: 'k1',
      yonalishi: 'berdim',
      summa: 1000000,
      valyuta: 'som',
      sana: bugun(),
      hisob: 'karta',
    })
  })

  it('mezon 4 — «oldim» yoʻnalishi ham qabul qilinadi', () => {
    const natija = qarzniTekshir(qarzFormasi({ yonalishi: 'oldim' }))

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.yonalishi).toBe('oldim')
  })

  it('yoʻnalish tanlanmagan boʻlsa saqlanmaydi (0050 ruhi: standart yoʻq)', () => {
    expect(kodlar(qarzniTekshir(qarzFormasi({ yonalishi: '' })))).toContain('yonalish-bosh')
  })

  it('mezon 19 — soʻmdagi qarzga kasrli summa kiritilmaydi', () => {
    expect(kodlar(qarzniTekshir(qarzFormasi({ summa: '1000,50' })))).toEqual(['summa-kasr'])
  })

  it('mezon 19 — dollardagi qarz ikki kasr bilan kiritiladi va sentda saqlanadi', () => {
    const natija = qarzniTekshir(qarzFormasi({ valyuta: 'dollar', summa: '100,25' }))

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.summa).toBe(10025)
    expect(natija.qiymat.valyuta).toBe('dollar')
  })

  it('dollardagi qarzda kurs soʻralmaydi — qarz oʻz valyutasida yuritiladi (0023)', () => {
    const natija = qarzniTekshir(qarzFormasi({ valyuta: 'dollar', summa: '100' }))

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect('kurs' in natija.qiymat).toBe(false)
  })

  it('mezon 20 — nol summali qarz saqlanmaydi', () => {
    expect(kodlar(qarzniTekshir(qarzFormasi({ summa: '0' })))).toEqual(['summa-nol'])
  })

  it('mezon 21 — kelajakdagi sana bilan qarz saqlanmaydi (0034)', () => {
    expect(kodlar(qarzniTekshir(qarzFormasi({ sana: '2099-01-01' })))).toEqual(['sana-kelajak'])
  })

  it('mezon 15a — forma ochilganda hisob «karta» boʻlib turadi (0035)', () => {
    expect(boshlangichQarzFormasi('k1').hisob).toBe('karta')
    expect(boshlangichQarzFormasi('k1').valyuta).toBe('som')
    expect(boshlangichQarzFormasi('k1').sana).toBe(bugun())
    expect(boshlangichQarzFormasi('k1').yonalishi).toBe('')
  })

  it('naqd tanlansa oʻsha hisob saqlanadi (mezon 15a)', () => {
    const natija = qarzniTekshir(qarzFormasi({ hisob: 'naqd' }))

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.hisob).toBe('naqd')
  })

  it('kontakt tanlanmagan boʻlsa qarz saqlanmaydi (0015)', () => {
    expect(kodlar(qarzniTekshir(qarzFormasi({ kontaktId: '  ' })))).toContain('kontakt-bosh')
  })

  it('hamma sabab birdaniga qaytadi (yozuv formasidagi naqsh)', () => {
    const natija = qarzniTekshir(qarzFormasi({ summa: '', yonalishi: '', sana: '' }))

    expect(kodlar(natija).sort()).toEqual(['sana-bosh', 'summa-bosh', 'yonalish-bosh'])
  })

  it('mezon 13a — xavfsiz butun sondan oshgan qarz summasi saqlanmaydi', () => {
    const katta = String(Number.MAX_SAFE_INTEGER + 2)

    expect(kodlar(qarzniTekshir(qarzFormasi({ summa: katta })))).toEqual(['summa-notogri'])
  })
})

describe('toʻlov tekshiruvi (0016, 0023, 0042, 0049; mezon 10b, 10c, 12, 20)', () => {
  it('mezon 12 — dollar qarziga dollarda toʻlovda kurs soʻralmaydi', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const forma = tolovFormasi(dollarQarzi, { summa: '50', kurs: '' })

    const natija = tolovniTekshir(forma, dollarQarzi)

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.summa).toBe(5000)
    expect(natija.qiymat.valyuta).toBe('dollar')
    expect('kurs' in natija.qiymat).toBe(false)
  })

  it('bir xil valyutadagi toʻlovda kiritilgan kurs tashlanadi (soʻm yozuvidagi naqsh)', () => {
    const natija = tolovniTekshir(tolovFormasi(qarz(), { kurs: '12500' }), qarz())

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect('kurs' in natija.qiymat).toBe(false)
  })

  it('boshqa valyutadagi toʻlovda kurs majburiy (0023)', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const forma = tolovFormasi(dollarQarzi, { valyuta: 'som', summa: '625000', kurs: '' })

    expect(kodlar(tolovniTekshir(forma, dollarQarzi))).toEqual(['kurs-bosh'])
  })

  it('mezon 10b — kurs maydoniga kasrli qiymat kiritilmaydi', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const forma = tolovFormasi(dollarQarzi, { valyuta: 'som', summa: '625000', kurs: '12500,5' })

    expect(kodlar(tolovniTekshir(forma, dollarQarzi))).toEqual(['kurs-kasr'])
  })

  it('mezon 10c — kurs `0` bilan toʻlov saqlanmaydi (0049)', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const forma = tolovFormasi(dollarQarzi, { valyuta: 'som', summa: '625000', kurs: '0' })

    expect(kodlar(tolovniTekshir(forma, dollarQarzi))).toEqual(['kurs-musbat-emas'])
  })

  it('mezon 20 — nol summali toʻlov saqlanmaydi', () => {
    expect(kodlar(tolovniTekshir(tolovFormasi(qarz(), { summa: '0' }), qarz()))).toEqual([
      'summa-nol',
    ])
  })

  it('mezon 21 — kelajakdagi sana bilan toʻlov saqlanmaydi (0034)', () => {
    const forma = tolovFormasi(qarz(), { sana: '2099-01-01' })

    expect(kodlar(tolovniTekshir(forma, qarz()))).toEqual(['sana-kelajak'])
  })

  it('boshlangʻich toʻlov formasi qarz valyutasida va «karta» hisobida ochiladi (0035)', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })

    expect(boshlangichTolovFormasi(dollarQarzi)).toEqual({
      qarzId: dollarQarzi.id,
      summa: '',
      sana: bugun(),
      hisob: 'karta',
      valyuta: 'dollar',
      kurs: '',
    })
  })

  it('mezon 13a — aylantirish natijasi chegaraga sigmasa toʻlov saqlanmaydi (KELISHUV 11)', () => {
    const somQarzi = qarz({ valyuta: 'som' })
    const forma = tolovFormasi(somQarzi, {
      valyuta: 'dollar',
      summa: '100000000',
      kurs: '900000000',
    })

    expect(kodlar(tolovniTekshir(forma, somQarzi))).toEqual(['summa-notogri'])
  })

  it('mezon 13a — soʻm toʻlovni dollarga aylantirish ham chegaradan oʻtadi', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const forma = tolovFormasi(dollarQarzi, {
      valyuta: 'som',
      summa: String(Number.MAX_SAFE_INTEGER - 1),
      kurs: '12500',
    })

    expect(kodlar(tolovniTekshir(forma, dollarQarzi))).toEqual(['summa-notogri'])
  })
})

describe('toʻlovni qarz valyutasiga aylantirish (0023, 0042; mezon 10, 10a)', () => {
  it('bir xil valyutada aylantirish yoʻq', () => {
    expect(tolovQarzValyutasida(tolov({ summa: 300000 }), 'som')).toBe(300000)
  })

  it('mezon 10 — 625 000 soʻm 12 500 kurs bilan 50 $ boʻladi', () => {
    const somTolovi = tolov({ valyuta: 'som', summa: 625000, kurs: 12500 })

    expect(tolovQarzValyutasida(somTolovi, 'dollar')).toBe(5000)
  })

  it('mezon 10a — 100 001 soʻm 12 500 kurs bilan 8,00 $ (pastga yaxlitlanadi)', () => {
    const somTolovi = tolov({ valyuta: 'som', summa: 100001, kurs: 12500 })

    expect(tolovQarzValyutasida(somTolovi, 'dollar')).toBe(800)
  })

  it('mezon 10a — 100 100 soʻm 12 500 kurs bilan 8,01 $ (yuqoriga yaxlitlanadi)', () => {
    const somTolovi = tolov({ valyuta: 'som', summa: 100100, kurs: 12500 })

    expect(tolovQarzValyutasida(somTolovi, 'dollar')).toBe(801)
  })

  it('dollardagi toʻlov soʻm qarziga eng yaqin soʻmga aylantiriladi (0042)', () => {
    const dollarTolovi = tolov({ valyuta: 'dollar', summa: 5, kurs: 12501 })

    // 5 sent × 12 501 / 100 = 625,05 → 625 soʻm
    expect(tolovQarzValyutasida(dollarTolovi, 'som')).toBe(625)
  })
})

describe('qarz qoldigʻi va yopilishi (0016, 0052; mezon 5, 6, 6a, 6b, 11)', () => {
  it('mezon 5 — 1 000 000 soʻm qarzdan 300 000 toʻlansa qoldiq 700 000', () => {
    expect(qarzQoldigi(qarz(), [tolov({ summa: 300000 })])).toBe(700000)
  })

  it('mezon 6 — qolgan 700 000 ham toʻlansa qoldiq nol va qarz yopiladi', () => {
    const tolovlar = [tolov({ id: 't1', summa: 300000 }), tolov({ id: 't2', summa: 700000 })]

    expect(qarzQoldigi(qarz(), tolovlar)).toBe(0)
    expect(qarzYopiqmi(qarz(), tolovlar)).toBe(true)
  })

  it('toʻlovsiz qarzning qoldigʻi — oʻz summasi va u ochiq', () => {
    expect(qarzQoldigi(qarz(), [])).toBe(1000000)
    expect(qarzYopiqmi(qarz(), [])).toBe(false)
  })

  it('mezon 11 — dollar qarzining qoldigʻi soʻm toʻlovdan keyin ham dollarda qoladi', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const somTolovi = tolov({ valyuta: 'som', summa: 625000, kurs: 12500 })

    expect(qarzQoldigi(dollarQarzi, [somTolovi])).toBe(5000)
  })

  it('mezon 6a — dollar qarzida 1 sent qoldiq yopiq sanaladi', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const tolovlar = [tolov({ valyuta: 'dollar', summa: 9999 })]

    expect(qarzQoldigi(dollarQarzi, tolovlar)).toBe(1)
    expect(qarzYopiqmi(dollarQarzi, tolovlar)).toBe(true)
  })

  it('mezon 6a — 2 sent qoldiq ochiq qolaveradi', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const tolovlar = [tolov({ valyuta: 'dollar', summa: 9998 })]

    expect(qarzQoldigi(dollarQarzi, tolovlar)).toBe(2)
    expect(qarzYopiqmi(dollarQarzi, tolovlar)).toBe(false)
  })

  it('mezon 6b — soʻm qarzida 100 soʻm qoldiq yopiq, 101 soʻm ochiq', () => {
    const yuz = [tolov({ summa: 999900 })]
    const yuzBir = [tolov({ summa: 999899 })]

    expect(qarzYopiqmi(qarz(), yuz)).toBe(true)
    expect(qarzYopiqmi(qarz(), yuzBir)).toBe(false)
  })

  it('chegara qiymatlari bitta joyda turadi (0052)', () => {
    expect(YOPILISH_CHEGARASI).toEqual({ som: 100, dollar: 1 })
  })

  it('faqat oʻz toʻlovlari hisobga olinadi', () => {
    const boshqasi = tolov({ id: 't9', qarzId: 'q2', summa: 500000 })

    expect(qarzTolovlari([tolov(), boshqasi], 'q1')).toHaveLength(1)
    expect(qarzQoldigi(qarz(), qarzTolovlari([tolov(), boshqasi], 'q1'))).toBe(700000)
  })
})

describe('kontakt nettosi — faqat ochiq qarzlardan (0037, 0056; mezon 15c–15g)', () => {
  const berdim = qarz({ id: 'q1', valyuta: 'dollar', summa: 10000, yonalishi: 'berdim' })
  const oldim = qarz({ id: 'q2', valyuta: 'dollar', summa: 3000, yonalishi: 'oldim' })

  it('mezon 15c — 100 $ berilib 30 $ olingan boʻlsa netto 70 $ (kontakt menga qarzdor)', () => {
    expect(kontaktNettosi([berdim, oldim], [])).toEqual([{ valyuta: 'dollar', netto: 7000 }])
  })

  it('mezon 15d — qarzi yoʻq valyuta qatori umuman chiqmaydi', () => {
    const qatorlar = kontaktNettosi([berdim, oldim], [])

    expect(qatorlar.some((qator) => qator.valyuta === 'som')).toBe(false)
  })

  it('men koʻproq olgan boʻlsam netto manfiy boʻladi (men qarzdorman)', () => {
    const kattaQarz = qarz({ id: 'q3', valyuta: 'som', summa: 500000, yonalishi: 'oldim' })

    expect(kontaktNettosi([kattaQarz], [])).toEqual([{ valyuta: 'som', netto: -500000 }])
  })

  it('valyutalar aralashmaydi va tartib barqaror: avval soʻm, keyin dollar', () => {
    const somQarzi = qarz({ id: 'q3', valyuta: 'som', summa: 500000 })

    expect(kontaktNettosi([berdim, somQarzi], [])).toEqual([
      { valyuta: 'som', netto: 500000 },
      { valyuta: 'dollar', netto: 10000 },
    ])
  })

  it('netto qarzning qolgan qoldigʻidan hisoblanadi, boshlangʻich summasidan emas', () => {
    const tolovlar = [tolov({ qarzId: 'q1', valyuta: 'dollar', summa: 2000 })]

    expect(kontaktNettosi([berdim, oldim], tolovlar)).toEqual([{ valyuta: 'dollar', netto: 5000 }])
  })

  it('mezon 15e — netto nol boʻlsa ham qator chiqadi va ikkala qarz ochiq qoladi', () => {
    const tengOldim = qarz({ id: 'q2', valyuta: 'dollar', summa: 10000, yonalishi: 'oldim' })

    expect(kontaktNettosi([berdim, tengOldim], [])).toEqual([{ valyuta: 'dollar', netto: 0 }])
    expect(ochiqQarzlar([berdim, tengOldim], [])).toHaveLength(2)
  })

  it('mezon 15f — hamma qarzi chegara bilan yopilgan kontaktda netto qatori chiqmaydi', () => {
    const tolovlar = [
      tolov({ id: 't1', qarzId: 'q1', valyuta: 'dollar', summa: 9999 }),
      tolov({ id: 't2', qarzId: 'q2', valyuta: 'dollar', summa: 3000 }),
    ]

    expect(kontaktNettosi([berdim, oldim], tolovlar)).toEqual([])
    expect(ochiqQarzlar([berdim, oldim], tolovlar)).toEqual([])
  })

  it('mezon 15g — bitta ochiq va bitta yopiq qarzda netto faqat ochiqdan hisoblanadi', () => {
    const tolovlar = [tolov({ id: 't1', qarzId: 'q1', valyuta: 'dollar', summa: 9999 })]

    // q1 yopiq (1 sent dumi), q2 — 30 $ «oldim» ochiq: netto faqat undan.
    expect(kontaktNettosi([berdim, oldim], tolovlar)).toEqual([{ valyuta: 'dollar', netto: -3000 }])
  })

  it('qarzsiz kontaktda netto qatori boʻlmaydi', () => {
    expect(kontaktNettosi([], [])).toEqual([])
  })
})

describe('yopilish chegarasi har valyutada oʻzicha olinadi (0052; 8b-band)', () => {
  const holatlar: { valyuta: Valyuta; qoldiq: number; yopiq: boolean }[] = [
    { valyuta: 'som', qoldiq: 100, yopiq: true },
    { valyuta: 'som', qoldiq: 101, yopiq: false },
    { valyuta: 'dollar', qoldiq: 1, yopiq: true },
    { valyuta: 'dollar', qoldiq: 2, yopiq: false },
  ]

  for (const holat of holatlar) {
    it(`${holat.valyuta}: ${holat.qoldiq} → ${holat.yopiq ? 'yopiq' : 'ochiq'}`, () => {
      const sinov = qarz({ valyuta: holat.valyuta, summa: 1000000 })
      const tolovlar = [
        tolov({ valyuta: holat.valyuta, summa: 1000000 - holat.qoldiq }),
      ]

      expect(qarzYopiqmi(sinov, tolovlar)).toBe(holat.yopiq)
    })
  }

  it('yoʻnalish yopilishga taʼsir qilmaydi — «oldim» qarzi ham xuddi shunday yopiladi', () => {
    const olingan = qarz({ yonalishi: 'oldim', summa: 1000000 })

    expect(qarzYopiqmi(olingan, [tolov({ summa: 999900 })])).toBe(true)
  })
})

describe('yoʻnalishlar roʻyxati (0015)', () => {
  it('faqat ikkita yoʻnalish bor', () => {
    const yonalishlar: QarzYonalishi[] = ['berdim', 'oldim']

    for (const yonalishi of yonalishlar) {
      expect(qarzniTekshir(qarzFormasi({ yonalishi })).ok).toBe(true)
    }
  })

  it('notoʻgʻri yoʻnalish rad etiladi', () => {
    const buzuq = qarzFormasi({ yonalishi: 'qaytardim' as QarzYonalishi })

    expect(kodlar(qarzniTekshir(buzuq))).toContain('yonalish-notogri')
  })
})

// ─── 0059/0061: qarz maydonlari va toʻlov chegaralari ───

describe('qarzda izoh maydoni yoʻq (0059)', () => {
  it('qarz formasida ham, saqlangan qarzda ham izoh boʻlmaydi', () => {
    expect('izoh' in boshlangichQarzFormasi('k1')).toBe(false)

    const natija = qarzniTekshir(qarzFormasi())

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect('izoh' in natija.qiymat).toBe(false)
  })
})

describe('toʻlov qoldiqdan oshmaydi (0061; 0052 chegarasi)', () => {
  const somQarzi = qarz({ summa: 1000000, valyuta: 'som' })

  it('qoldiqqa teng toʻlov qabul qilinadi', () => {
    const forma = tolovFormasi(somQarzi, { summa: '1000000' })

    expect(tolovniTekshir(forma, somQarzi, []).ok).toBe(true)
  })

  it('chegaradan koʻp oshgan toʻlov rad etiladi', () => {
    const forma = tolovFormasi(somQarzi, { summa: '1000101' })

    expect(kodlar(tolovniTekshir(forma, somQarzi, []))).toEqual(['tolov-ortiqcha'])
  })

  it('chegara ichida oshgan toʻlov qabul qilinadi va qoldiq nolga tushadi', () => {
    const forma = tolovFormasi(somQarzi, { summa: '1000100' })
    const natija = tolovniTekshir(forma, somQarzi, [])

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    const saqlangan = { ...natija.qiymat, id: 't9', yaratilgan: '2026-08-03T09:00:00.000Z' }
    expect(qarzQoldigi(somQarzi, [saqlangan])).toBe(0)
    expect(qarzYopiqmi(somQarzi, [saqlangan])).toBe(true)
  })

  it('dollar qarzida chegara 1 sent: 1 sent oshsa qabul, 2 sent oshsa rad', () => {
    const dollarQarzi = qarz({ summa: 10000, valyuta: 'dollar' })

    expect(tolovniTekshir(tolovFormasi(dollarQarzi, { summa: '100,01' }), dollarQarzi, []).ok).toBe(
      true,
    )
    expect(
      kodlar(tolovniTekshir(tolovFormasi(dollarQarzi, { summa: '100,02' }), dollarQarzi, [])),
    ).toEqual(['tolov-ortiqcha'])
  })

  it('oldingi toʻlovlar hisobga olinadi: qolgan qoldiqdan oshgani rad etiladi', () => {
    const oldingi = [tolov({ summa: 700000 })]
    const forma = tolovFormasi(somQarzi, { summa: '300101' })

    expect(kodlar(tolovniTekshir(forma, somQarzi, oldingi))).toEqual(['tolov-ortiqcha'])
    expect(tolovniTekshir(tolovFormasi(somQarzi, { summa: '300000' }), somQarzi, oldingi).ok).toBe(
      true,
    )
  })

  it('boshqa valyutadagi toʻlov ham aylantirilgan qiymati boʻyicha tekshiriladi', () => {
    const dollarQarzi = qarz({ summa: 10000, valyuta: 'dollar' })
    // 1 300 000 soʻm ÷ 12 500 = 104 $ — qoldiqdan 4 $ koʻp.
    const forma = tolovFormasi(dollarQarzi, { valyuta: 'som', summa: '1300000', kurs: '12500' })

    expect(kodlar(tolovniTekshir(forma, dollarQarzi, []))).toEqual(['tolov-ortiqcha'])
  })

  it('aylantirilgan qiymati nolga tushadigan toʻlov rad etiladi (0061b)', () => {
    const dollarQarzi = qarz({ summa: 10000, valyuta: 'dollar' })
    // 5 soʻm ÷ 12 500 = 0,0004 $ → eng yaqin sentga yaxlitlanganda 0.
    const forma = tolovFormasi(dollarQarzi, { valyuta: 'som', summa: '5', kurs: '12500' })

    expect(kodlar(tolovniTekshir(forma, dollarQarzi, []))).toEqual(['tolov-nol-aylanma'])
  })

  it('yopilgan qarzga toʻlov qoʻshilmaydi (0061c)', () => {
    const yopilgan = [tolov({ summa: 999900 })] // qoldiq 100 soʻm → yopiq (0052)
    const forma = tolovFormasi(somQarzi, { summa: '100' })

    expect(kodlar(tolovniTekshir(forma, somQarzi, yopilgan))).toEqual(['qarz-yopiq'])
  })

  it('qoldiq hech qachon manfiy koʻrsatilmaydi (0061a)', () => {
    const ortiqcha = [tolov({ summa: 1000100 })]

    expect(qarzQoldigi(somQarzi, ortiqcha)).toBe(0)
  })
})

describe('toʻlangan yigʻindi va toʻlov oldindan koʻrinishi (0059 9b2, 0061 10e)', () => {
  it('toʻlangan yigʻindi qarz valyutasida qaytadi', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const tolovlar = [
      tolov({ id: 't1', valyuta: 'dollar', summa: 3000 }),
      tolov({ id: 't2', valyuta: 'som', summa: 625000, kurs: 12500 }),
    ]

    expect(qarzTolangani(dollarQarzi, tolovlar)).toBe(8000)
  })

  it('toʻlovsiz qarzda toʻlangan yigʻindi nol', () => {
    expect(qarzTolangani(qarz(), [])).toBe(0)
  })

  it('mezon 44 — «qarzdan ayiriladi» raqami yaxlitlash bilan bir xil chiqadi', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })
    const forma = tolovFormasi(dollarQarzi, { valyuta: 'som', summa: '100001', kurs: '12500' })

    expect(tolovOldindanKorish(forma, dollarQarzi)).toBe(800)
  })

  it('summa yoki kurs boʻsh boʻlsa oldindan koʻrinish yoʻq (`null`)', () => {
    const dollarQarzi = qarz({ valyuta: 'dollar', summa: 10000 })

    expect(
      tolovOldindanKorish(tolovFormasi(dollarQarzi, { valyuta: 'som', summa: '100001', kurs: '' }), dollarQarzi),
    ).toBeNull()
    expect(
      tolovOldindanKorish(tolovFormasi(dollarQarzi, { valyuta: 'som', summa: '', kurs: '12500' }), dollarQarzi),
    ).toBeNull()
  })

  it('qarz valyutasidagi toʻlovda oldindan koʻrinish summaning oʻzi', () => {
    expect(tolovOldindanKorish(tolovFormasi(qarz(), { summa: '300000' }), qarz())).toBe(300000)
  })
})
