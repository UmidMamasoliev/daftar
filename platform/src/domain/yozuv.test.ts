import { describe, expect, it } from 'vitest'

import { tayyorKategoriyalar } from './kategoriya.ts'
import { bugun } from './sana.ts'
import type { Natija, YozuvFormasi } from './turlar.ts'
import { boshlangichForma, formaQiymatlari, yozuvniTekshir } from './yozuv.ts'

function kodlar(natija: Natija<unknown>): string[] {
  return natija.ok ? [] : natija.xatolar.map((xato) => xato.kod)
}

/** Toʻgʻri toʻldirilgan forma; test kerakli maydonni almashtiradi. */
function forma(ozgarish: Partial<YozuvFormasi> = {}): YozuvFormasi {
  return {
    ...boshlangichForma(),
    summa: '12500',
    turi: 'chiqim',
    kategoriyaId: 'oziq-ovqat',
    ...ozgarish,
  }
}

describe('boshlangichForma (mezon 3)', () => {
  it('sana bugungi kun, hisob karta, valyuta soʻm boʻlib turadi', () => {
    const boshlangich = boshlangichForma()
    expect(boshlangich.sana).toBe(bugun())
    expect(boshlangich.hisob).toBe('karta')
    expect(boshlangich.valyuta).toBe('som')
  })

  it('summa, turi, kategoriya va izoh boʻsh turadi', () => {
    const boshlangich = boshlangichForma()
    expect(boshlangich.summa).toBe('')
    expect(boshlangich.turi).toBe('')
    expect(boshlangich.kategoriyaId).toBe('')
    expect(boshlangich.izoh).toBe('')
    expect(boshlangich.kurs).toBe('')
  })
})

describe('yozuvniTekshir — majburiy maydonlar (0012; mezon 1, 2)', () => {
  it('mezon 1 — soʻmdagi chiqim yozuvi summa, turi va kategoriya bilan saqlanadi', () => {
    const natija = yozuvniTekshir(forma())
    expect(natija).toEqual({
      ok: true,
      qiymat: {
        summa: 12500,
        turi: 'chiqim',
        kategoriyaId: 'oziq-ovqat',
        sana: bugun(),
        hisob: 'karta',
        valyuta: 'som',
      },
    })
  })

  it('mezon 2 — summa boʻsh boʻlsa saqlanmaydi va sabab koʻrsatiladi', () => {
    const natija = yozuvniTekshir(forma({ summa: '' }))
    expect(kodlar(natija)).toEqual(['summa-bosh'])
    expect(natija.ok).toBe(false)
  })

  it('mezon 2 — turi boʻsh boʻlsa saqlanmaydi', () => {
    expect(kodlar(yozuvniTekshir(forma({ turi: '' })))).toEqual(['turi-bosh'])
  })

  it('mezon 2 — kategoriya boʻsh boʻlsa saqlanmaydi', () => {
    expect(kodlar(yozuvniTekshir(forma({ kategoriyaId: '   ' })))).toEqual(['kategoriya-bosh'])
  })

  it('mezon 2 — uchtasi ham boʻsh boʻlsa uchala sabab qaytadi', () => {
    const natija = yozuvniTekshir(forma({ summa: '', turi: '', kategoriyaId: '' }))
    expect(kodlar(natija)).toEqual(['summa-bosh', 'turi-bosh', 'kategoriya-bosh'])
    if (!natija.ok) {
      expect(natija.xatolar.every((xato) => xato.xabar !== '')).toBe(true)
    }
  })
})

describe('yozuvniTekshir — summa (0033; mezon 4b, 4c, 4d)', () => {
  it('mezon 4c — nol summa saqlanmaydi', () => {
    expect(kodlar(yozuvniTekshir(forma({ summa: '0' })))).toEqual(['summa-nol'])
  })

  it('mezon 4d — manfiy summa saqlanmaydi', () => {
    expect(kodlar(yozuvniTekshir(forma({ summa: '-100' })))).toEqual(['summa-manfiy'])
  })

  it('mezon 4b — soʻmda kasr qabul qilinmaydi', () => {
    expect(kodlar(yozuvniTekshir(forma({ summa: '12 500,50' })))).toEqual(['summa-kasr'])
  })

  it('mezon 4b — dollarda ikki kasr sentga aylanib saqlanadi', () => {
    const natija = yozuvniTekshir(forma({ summa: '8,50', valyuta: 'dollar', kurs: '12500' }))
    expect(natija).toEqual({
      ok: true,
      qiymat: {
        summa: 850,
        turi: 'chiqim',
        kategoriyaId: 'oziq-ovqat',
        sana: bugun(),
        hisob: 'karta',
        valyuta: 'dollar',
        kurs: 12500,
      },
    })
  })
})

describe('yozuvniTekshir — sana (0034; mezon 4, 4a)', () => {
  it('mezon 4 — oʻtgan sana oʻsha holicha saqlanadi', () => {
    const natija = yozuvniTekshir(forma({ sana: '2026-01-05' }))
    expect(natija.ok && natija.qiymat.sana).toBe('2026-01-05')
  })

  it('mezon 4a — kelajakdagi sana qabul qilinmaydi', () => {
    expect(kodlar(yozuvniTekshir(forma({ sana: '2099-01-01' })))).toEqual(['sana-kelajak'])
  })
})

describe('yozuvniTekshir — izoh (mezon 5)', () => {
  it('mezon 5 — izohi boʻsh yozuv saqlanadi va maydon umuman qoʻshilmaydi', () => {
    const natija = yozuvniTekshir(forma({ izoh: '' }))
    expect(natija.ok).toBe(true)
    expect(natija.ok && 'izoh' in natija.qiymat).toBe(false)
  })

  it('izoh yozilsa saqlanadi va boʻshliqlari kesiladi', () => {
    const natija = yozuvniTekshir(forma({ izoh: '  nonvoyxona  ' }))
    expect(natija.ok && natija.qiymat.izoh).toBe('nonvoyxona')
  })
})

describe('yozuvniTekshir — valyuta va kurs (0023, 0042; mezon 6, 7, 22)', () => {
  it('mezon 6 — dollar tanlansa kurs majburiy: boʻsh kurs bilan saqlanmaydi', () => {
    expect(kodlar(yozuvniTekshir(forma({ valyuta: 'dollar', kurs: '' })))).toEqual(['kurs-bosh'])
  })

  it('mezon 22 — kasrli kurs qabul qilinmaydi', () => {
    expect(kodlar(yozuvniTekshir(forma({ valyuta: 'dollar', kurs: '12 500,25' })))).toEqual([
      'kurs-kasr',
    ])
  })

  it('mezon 7 — soʻmdagi yozuvda kurs saqlanmaydi', () => {
    const natija = yozuvniTekshir(forma({ valyuta: 'som', kurs: '12500' }))
    expect(natija.ok).toBe(true)
    expect(natija.ok && 'kurs' in natija.qiymat).toBe(false)
  })

  it('notoʻgʻri hisob va valyuta ushlanadi', () => {
    const buzuq = { ...forma(), hisob: 'hamyon', valyuta: 'yevro' } as unknown as YozuvFormasi
    expect(kodlar(yozuvniTekshir(buzuq))).toEqual(['valyuta-notogri', 'hisob-notogri'])
  })
})

describe('yozuvniTekshir — aylantirish chegarasi (1a1, 1a2; mezon 4e, 4f, 4g)', () => {
  /** Dollardagi forma — summa va kurs matn boʻlib beriladi. */
  function dollarForma(summa: string, kurs: string): YozuvFormasi {
    return forma({ summa, valyuta: 'dollar', kurs })
  }

  it('mezon 4g — summa × kurs xavfsiz chegaradan oshsa yozuv saqlanmaydi', () => {
    const natija = yozuvniTekshir(dollarForma('10000', '9007199254740'))

    expect(kodlar(natija)).toEqual(['summa-notogri'])
    expect(natija.ok === false && natija.xatolar[0]?.xabar).toBe('Summa juda katta.')
    expect(natija.ok === false && natija.xatolar[0]?.maydon).toBe('summa')
  })

  it('mezon 4g — chegaraga sigadigan katta summa va kurs saqlanaveradi', () => {
    const natija = yozuvniTekshir(dollarForma('1000000', '12500'))

    expect(natija.ok).toBe(true)
    expect(natija.ok && natija.qiymat.summa).toBe(100000000)
  })

  it('mezon 4e va 4f — summa yoki kursning oʻzi chegaradan oshsa sabab bir marta qaytadi', () => {
    expect(kodlar(yozuvniTekshir(dollarForma('99999999999999999', '12500')))).toEqual([
      'summa-notogri',
    ])
    expect(kodlar(yozuvniTekshir(dollarForma('100', '99999999999999999')))).toEqual([
      'kurs-notogri',
    ])
  })

  it('soʻmdagi yozuvda aylantirish tekshiruvi ishlamaydi — kurs yoʻq', () => {
    expect(yozuvniTekshir(forma({ summa: '9007199254740991' })).ok).toBe(true)
  })
})

describe('yozuvniTekshir — kategoriya turi (0013, 0028; mezon 16)', () => {
  const kategoriyalar = tayyorKategoriyalar()

  /** Tayyor roʻyxatdan nomi boʻyicha id oladi. */
  function id(nom: string): string {
    const topilgan = kategoriyalar.find((kategoriya) => kategoriya.nom === nom)
    if (topilgan === undefined) {
      throw new Error(`Tayyor kategoriya topilmadi: ${nom}`)
    }
    return topilgan.id
  }

  it('mezon 16 — kirim kategoriyasi bilan chiqim yozuvi saqlanmaydi', () => {
    const natija = yozuvniTekshir(
      forma({ turi: 'chiqim', kategoriyaId: id('oylik') }),
      kategoriyalar,
    )
    expect(kodlar(natija)).toEqual(['kategoriya-turi'])
    expect(natija.ok === false && natija.xatolar[0]?.maydon).toBe('kategoriyaId')
  })

  it('mezon 16 — chiqim kategoriyasi bilan kirim yozuvi ham saqlanmaydi', () => {
    const natija = yozuvniTekshir(
      forma({ turi: 'kirim', kategoriyaId: id('oziq-ovqat') }),
      kategoriyalar,
    )
    expect(kodlar(natija)).toEqual(['kategoriya-turi'])
  })

  it('mezon 16 — mos turdagi kategoriya bilan yozuv oʻtadi', () => {
    const natija = yozuvniTekshir(
      forma({ turi: 'kirim', kategoriyaId: id('oylik') }),
      kategoriyalar,
    )
    expect(natija.ok).toBe(true)
  })

  it('roʻyxatda yoʻq kategoriya rad etiladi', () => {
    expect(kodlar(yozuvniTekshir(forma({ kategoriyaId: 'yoq-bunday-id' }), kategoriyalar))).toEqual(
      ['kategoriya-topilmadi'],
    )
  })

  it('roʻyxat berilmasa kategoriya turi tekshirilmaydi (eski xulq saqlanadi)', () => {
    expect(yozuvniTekshir(forma({ turi: 'kirim', kategoriyaId: id('oziq-ovqat') })).ok).toBe(true)
    expect(yozuvniTekshir(forma({ kategoriyaId: 'yoq-bunday-id' })).ok).toBe(true)
  })

  it('boʻsh kategoriya roʻyxat berilganda ham bitta sabab beradi', () => {
    expect(kodlar(yozuvniTekshir(forma({ kategoriyaId: '' }), kategoriyalar))).toEqual([
      'kategoriya-bosh',
    ])
  })
})

describe('formaQiymatlari — tahrirlash formasi (0014)', () => {
  it('saqlangan yozuv forma maydonlariga qaytadi', () => {
    expect(
      formaQiymatlari({
        id: 'y1',
        yaratilgan: '2026-08-17T09:41:00.000Z',
        summa: 850,
        turi: 'chiqim',
        kategoriyaId: 'transport',
        sana: '2026-08-17',
        hisob: 'naqd',
        valyuta: 'dollar',
        kurs: 12500,
        izoh: 'taksi',
      }),
    ).toEqual({
      summa: '8.50',
      turi: 'chiqim',
      kategoriyaId: 'transport',
      sana: '2026-08-17',
      hisob: 'naqd',
      valyuta: 'dollar',
      kurs: '12500',
      izoh: 'taksi',
    })
  })

  it('kurssiz va izohsiz yozuvda maydonlar boʻsh matn boʻladi', () => {
    expect(
      formaQiymatlari({
        id: 'y2',
        yaratilgan: '2026-08-17T09:41:00.000Z',
        summa: 12500,
        turi: 'kirim',
        kategoriyaId: 'oylik',
        sana: '2026-08-16',
        hisob: 'karta',
        valyuta: 'som',
      }),
    ).toEqual({
      summa: '12500',
      turi: 'kirim',
      kategoriyaId: 'oylik',
      sana: '2026-08-16',
      hisob: 'karta',
      valyuta: 'som',
      kurs: '',
      izoh: '',
    })
  })
})
