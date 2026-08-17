import { describe, expect, it } from 'vitest'

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
