// Zaxira fayli: yasash, matnga oʻgirish, oʻqish/tekshirish va solishtirish.
// Mezonlar — `prds/zaxira.md` dagi «Qanday tekshiramiz» roʻyxati.

import { describe, expect, it } from 'vitest'

import type { Kategoriya, Kontakt, Qarz, Tolov, Yozuv } from './turlar.ts'
import {
  ZAXIRA_VERSIYASI,
  daftarBoshmi,
  faylNomi,
  zaxiraBirXilmi,
  zaxiraMatni,
  zaxiraTasdigi,
  zaxiraYasa,
  zaxiraniOqi,
} from './zaxira.ts'
import { tayyorKategoriyalar } from './kategoriya.ts'

const SOM_YOZUV: Yozuv = {
  id: 'y1',
  yaratilgan: '2026-08-15T09:14:22.310Z',
  turi: 'chiqim',
  summa: 1200000,
  kategoriyaId: 'oziq-ovqat',
  sana: '2026-08-15',
  hisob: 'karta',
  valyuta: 'som',
}

const DOLLAR_YOZUV: Yozuv = {
  id: 'y2',
  yaratilgan: '2026-08-16T09:14:22.310Z',
  turi: 'chiqim',
  summa: 10000,
  kategoriyaId: 'boshqa',
  sana: '2026-08-16',
  hisob: 'naqd',
  valyuta: 'dollar',
  kurs: 12500,
  izoh: 'sovgʻa',
}

const KONTAKT: Kontakt = {
  id: 'k1',
  yaratilgan: '2026-08-10T09:00:00.000Z',
  ism: 'Akmal',
  telefon: '901234567',
}

const QARZ: Qarz = {
  id: 'q1',
  yaratilgan: '2026-08-10T09:05:00.000Z',
  kontaktId: 'k1',
  yonalishi: 'berdim',
  summa: 10000,
  valyuta: 'dollar',
  sana: '2026-08-10',
  hisob: 'karta',
}

const TOLOV: Tolov = {
  id: 't1',
  yaratilgan: '2026-08-14T18:02:07.884Z',
  qarzId: 'q1',
  summa: 625000,
  valyuta: 'som',
  kurs: 12500,
  sana: '2026-08-14',
  hisob: 'naqd',
}

const YASHIRILGAN: Kategoriya = {
  id: 'kongilochar',
  nom: 'koʻngilochar',
  turi: 'chiqim',
  yashirilgan: true,
}

/** Toʻliq daftar mazmuni — eksport uchun kirish qiymati. */
function mazmun(ozgarish: Partial<Parameters<typeof zaxiraYasa>[0]> = {}) {
  return {
    kategoriyalar: [YASHIRILGAN],
    yozuvlar: [SOM_YOZUV, DOLLAR_YOZUV],
    kontaktlar: [KONTAKT],
    qarzlar: [QARZ],
    tolovlar: [TOLOV],
    kurslar: {},
    oxirgiEksport: '2026-08-17',
    turi: 'qolda' as const,
    hozir: new Date('2026-08-17T14:05:00'),
    ...ozgarish,
  }
}

describe('eksport fayli — tuzilishi (mezon 1, 2, 3, 4)', () => {
  it('mezon 2 — ildizda `versiya` butun son boʻlib turadi', () => {
    const fayl = zaxiraYasa(mazmun())

    expect(fayl.versiya).toBe(1)
    expect(ZAXIRA_VERSIYASI).toBe(1)
    expect(Number.isInteger(fayl.versiya)).toBe(true)
  })

  it('mezon 3 — oltita maʼlumot bloki bor, boʻsh doʻkon ham boʻsh massiv', () => {
    const fayl = zaxiraYasa(
      mazmun({ kategoriyalar: [], yozuvlar: [], kontaktlar: [], qarzlar: [], tolovlar: [] }),
    )

    expect(fayl.hisoblar).toEqual([
      { id: 'naqd', nom: 'Naqd' },
      { id: 'karta', nom: 'Karta' },
    ])
    expect(fayl.kategoriyalar).toEqual([])
    expect(fayl.yozuvlar).toEqual([])
    expect(fayl.kontaktlar).toEqual([])
    expect(fayl.qarzlar).toEqual([])
    expect(fayl.tolovlar).toEqual([])
  })

  it('mezon 4 — bloklardagi sonlar daftardagi sonlarga teng', () => {
    const fayl = zaxiraYasa(mazmun())

    expect(fayl.yozuvlar.length).toBe(2)
    expect(fayl.kontaktlar.length).toBe(1)
    expect(fayl.qarzlar.length).toBe(1)
    expect(fayl.tolovlar.length).toBe(1)
    expect(fayl.kategoriyalar.length).toBe(1)
  })

  it('mezon 5, 12 — summalar butun son boʻlib, eng kichik birlikda turadi', () => {
    const fayl = zaxiraYasa(mazmun())

    expect(fayl.yozuvlar[0]?.summa).toBe(1200000)
    expect(fayl.yozuvlar[1]?.summa).toBe(10000)
  })

  it('mezon 6, 6a — soʻm yozuvida kurs yoʻq, dollarda butun son', () => {
    const fayl = zaxiraYasa(mazmun())

    expect('kurs' in (fayl.yozuvlar[0] ?? {})).toBe(false)
    expect(fayl.yozuvlar[1]?.kurs).toBe(12500)
  })

  it('mezon 6d — har yozuv va toʻlovda `yaratilgan` bor va boʻsh emas (0047)', () => {
    const fayl = zaxiraYasa(mazmun())

    for (const yozuv of fayl.yozuvlar) {
      expect(yozuv.yaratilgan).not.toBe('')
    }
    expect(fayl.tolovlar[0]?.yaratilgan).toBe('2026-08-14T18:02:07.884Z')
  })

  it('mezon 6g — `eksport` bloki toʻliq va `oxirgi-eksport` shu eksport sanasiga teng', () => {
    const fayl = zaxiraYasa(mazmun())

    expect(fayl.eksport).toEqual({
      sana: '2026-08-17',
      vaqt: '14:05',
      turi: 'qolda',
      'oxirgi-eksport': '2026-08-17',
    })
  })

  it('eksport turi `import-oldidan` ham yoziladi (spec 9, 18)', () => {
    const fayl = zaxiraYasa(mazmun({ turi: 'import-oldidan' }))

    expect(fayl.eksport.turi).toBe('import-oldidan')
  })

  it('mezon 7 — yashirilgan kategoriya belgisi bilan chiqadi', () => {
    const fayl = zaxiraYasa(mazmun())

    expect(fayl.kategoriyalar[0]).toEqual({
      id: 'kongilochar',
      nom: 'koʻngilochar',
      turi: 'chiqim',
      yashirilgan: true,
    })
  })

  it('mezon 8 — qarzda «yopilgan» belgisi yoʻq, qoldiq ham yoʻq', () => {
    const qarzFayli = zaxiraYasa(mazmun()).qarzlar[0] ?? {}

    expect(Object.keys(qarzFayli).sort()).toEqual(
      ['id', 'kontakt', 'yonalish', 'summa', 'valyuta', 'sana', 'hisob'].sort(),
    )
  })

  it('spec 14-band — kalitlar va qiymatlar ASCII nomlarda (`kategoriya`, `kontakt`, `qarz`)', () => {
    const fayl = zaxiraYasa(mazmun())

    expect(fayl.yozuvlar[0]?.kategoriya).toBe('oziq-ovqat')
    expect(fayl.qarzlar[0]?.kontakt).toBe('k1')
    expect(fayl.qarzlar[0]?.yonalish).toBe('berdim')
    expect(fayl.tolovlar[0]?.qarz).toBe('q1')
  })

  it('izoh faylda har doim bor: boʻlmasa boʻsh matn (spec sxemasi)', () => {
    const fayl = zaxiraYasa(mazmun())

    expect(fayl.yozuvlar[0]?.izoh).toBe('')
    expect(fayl.yozuvlar[1]?.izoh).toBe('sovgʻa')
  })

  it('kontakt telefoni boʻlmasa faylda boʻsh matn boʻlib turadi (0031)', () => {
    const telefonsiz: Kontakt = { id: 'k2', yaratilgan: '2026-08-11T09:00:00.000Z', ism: 'Dilnoza' }

    expect(zaxiraYasa(mazmun({ kontaktlar: [telefonsiz] })).kontaktlar[0]?.telefon).toBe('')
  })

  it('mezon 6b — qoʻlda soʻralgan kurs bloki sanasi bilan chiqadi (0043)', () => {
    const kurslar = { dollar: { kurs: 12500, sana: '2026-08-16' } }

    expect(zaxiraYasa(mazmun({ kurslar })).kurslar).toEqual(kurslar)
  })

  it('mezon 6b, 6c — qoʻlda kurs soʻralmagan boʻlsa blok boʻsh obyekt (0045)', () => {
    // Yozuvlarda kurs bor, lekin qoʻlda soʻralgani yoʻq — blok boʻsh qoladi.
    expect(zaxiraYasa(mazmun()).kurslar).toEqual({})
  })
})

describe('fayl nomi (mezon 9; spec 4, 18)', () => {
  it('mezon 9 — qoʻlda eksport nomida sana va vaqt koʻrinadi', () => {
    expect(faylNomi('qolda', new Date('2026-08-17T14:35:00'))).toBe(
      'daftar-zaxira-2026-08-17-1435.json',
    )
  })

  it('mezon 15 — avtomatik zaxira nomida «import oldidan» ekani koʻrinadi', () => {
    expect(faylNomi('import-oldidan', new Date('2026-08-17T09:05:00'))).toBe(
      'daftar-import-oldidan-2026-08-17-0905.json',
    )
  })
})

describe('matn deterministik (0041 solishtiruvi uchun)', () => {
  it('bir xil maʼlumotdan bir xil matn chiqadi', () => {
    expect(zaxiraMatni(zaxiraYasa(mazmun()))).toBe(zaxiraMatni(zaxiraYasa(mazmun())))
  })

  it('yozuvlar boshqa tartibda kelsa ham matn oʻzgarmaydi', () => {
    const togri = zaxiraMatni(zaxiraYasa(mazmun({ yozuvlar: [SOM_YOZUV, DOLLAR_YOZUV] })))
    const teskari = zaxiraMatni(zaxiraYasa(mazmun({ yozuvlar: [DOLLAR_YOZUV, SOM_YOZUV] })))

    expect(teskari).toBe(togri)
  })

  it('matn JSON sifatida oʻqiladi (mezon 1)', () => {
    const matn = zaxiraMatni(zaxiraYasa(mazmun()))

    expect(() => JSON.parse(matn) as unknown).not.toThrow()
    expect((JSON.parse(matn) as { versiya: number }).versiya).toBe(1)
  })

  it('bitta yozuv oʻzgarsa matn ham oʻzgaradi', () => {
    const boshqa = { ...SOM_YOZUV, summa: 1200001 }

    expect(zaxiraMatni(zaxiraYasa(mazmun({ yozuvlar: [boshqa, DOLLAR_YOZUV] })))).not.toBe(
      zaxiraMatni(zaxiraYasa(mazmun())),
    )
  })
})

describe('faylni oʻqish va tekshirish (mezon 20, 21, 22, 6e)', () => {
  const togriMatn = () => zaxiraMatni(zaxiraYasa(mazmun()))

  it('toʻgʻri fayl oʻqiladi va bloklari joyida boʻladi', () => {
    const natija = zaxiraniOqi(togriMatn())

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.yozuvlar.length).toBe(2)
    expect(natija.qiymat.eksport['oxirgi-eksport']).toBe('2026-08-17')
  })

  it('mezon 20 — buzilgan JSON oʻqilmaydi', () => {
    const natija = zaxiraniOqi('{ "versiya": 1, "yozuvlar": [')

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('zaxira-oqilmadi')
    expect(natija.xatolar[0]?.maydon).toBe('fayl')
  })

  it('mezon 21 — notanish versiya rad etiladi', () => {
    const buzuq = JSON.parse(togriMatn()) as { versiya: number }
    buzuq.versiya = 2

    expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-versiya')
  })

  it('versiya butun son boʻlmasa ham rad etiladi', () => {
    const buzuq = JSON.parse(togriMatn()) as { versiya: unknown }
    buzuq.versiya = '1'

    expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-versiya')
  })

  it('mezon 22 — blok yetishmasa rad etiladi', () => {
    for (const blok of [
      'eksport',
      'hisoblar',
      'kategoriyalar',
      'yozuvlar',
      'kontaktlar',
      'qarzlar',
      'tolovlar',
      'kurslar',
    ]) {
      const buzuq = JSON.parse(togriMatn()) as Record<string, unknown>
      delete buzuq[blok]

      expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-notolik')
    }
  })

  it('mezon 22 — `eksport.oxirgi-eksport` yetishmasa rad etiladi (0053)', () => {
    const buzuq = JSON.parse(togriMatn()) as { eksport: Record<string, unknown> }
    delete buzuq.eksport['oxirgi-eksport']

    expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-notolik')
  })

  it('mezon 6e — yozuvda `yaratilgan` yetishmasa rad etiladi (0047)', () => {
    const buzuq = JSON.parse(togriMatn()) as { yozuvlar: Record<string, unknown>[] }
    delete buzuq.yozuvlar[0]?.yaratilgan

    expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-notolik')
  })

  it('mezon 6e — toʻlovda `yaratilgan` boʻsh boʻlsa ham rad etiladi (0047)', () => {
    const buzuq = JSON.parse(togriMatn()) as { tolovlar: Record<string, unknown>[] }
    if (buzuq.tolovlar[0] !== undefined) {
      buzuq.tolovlar[0].yaratilgan = ''
    }

    expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-notolik')
  })

  it('yozuvning majburiy maydoni yetishmasa rad etiladi', () => {
    for (const maydon of ['id', 'sana', 'turi', 'summa', 'valyuta', 'kategoriya', 'hisob']) {
      const buzuq = JSON.parse(togriMatn()) as { yozuvlar: Record<string, unknown>[] }
      delete buzuq.yozuvlar[0]?.[maydon]

      expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-notolik')
    }
  })

  it('dollardagi yozuvda kurs yetishmasa rad etiladi (0023)', () => {
    const buzuq = JSON.parse(togriMatn()) as { yozuvlar: Record<string, unknown>[] }
    delete buzuq.yozuvlar[1]?.kurs

    expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-notolik')
  })

  it('kasrli yoki manfiy summa rad etiladi (0033)', () => {
    const kasr = JSON.parse(togriMatn()) as { yozuvlar: Record<string, unknown>[] }
    if (kasr.yozuvlar[0] !== undefined) {
      kasr.yozuvlar[0].summa = 1200.5
    }
    const manfiy = JSON.parse(togriMatn()) as { yozuvlar: Record<string, unknown>[] }
    if (manfiy.yozuvlar[0] !== undefined) {
      manfiy.yozuvlar[0].summa = -5
    }

    expect(kod(zaxiraniOqi(JSON.stringify(kasr)))).toBe('zaxira-notolik')
    expect(kod(zaxiraniOqi(JSON.stringify(manfiy)))).toBe('zaxira-notolik')
  })

  it('notoʻgʻri tanlov qiymati rad etiladi (`valyuta`, `turi`, `hisob`, `yonalish`)', () => {
    const buzuq = JSON.parse(togriMatn()) as {
      yozuvlar: Record<string, unknown>[]
      qarzlar: Record<string, unknown>[]
    }
    if (buzuq.yozuvlar[0] !== undefined) {
      buzuq.yozuvlar[0].valyuta = 'yevro'
    }
    const yonalish = JSON.parse(togriMatn()) as { qarzlar: Record<string, unknown>[] }
    if (yonalish.qarzlar[0] !== undefined) {
      yonalish.qarzlar[0].yonalish = 'qaytardim'
    }

    expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-notolik')
    expect(kod(zaxiraniOqi(JSON.stringify(yonalish)))).toBe('zaxira-notolik')
  })

  it('`kurslar` bloki notoʻgʻri boʻlsa rad etiladi (0043)', () => {
    const buzuq = JSON.parse(togriMatn()) as { kurslar: Record<string, unknown> }
    buzuq.kurslar = { dollar: { kurs: 12500 } }

    expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-notolik')
  })

  it('`kurslar` boʻsh obyekt boʻlsa toʻgʻri sanaladi', () => {
    expect(zaxiraniOqi(togriMatn()).ok).toBe(true)
  })

  it('`hisoblar` bloki naqd va kartadan iborat boʻlishi kerak (0011)', () => {
    const buzuq = JSON.parse(togriMatn()) as { hisoblar: unknown }
    buzuq.hisoblar = [{ id: 'hamyon', nom: 'Hamyon' }]

    expect(kod(zaxiraniOqi(JSON.stringify(buzuq)))).toBe('zaxira-notolik')
  })

  it('JSON massiv yoki matn boʻlsa oʻqilmaydi', () => {
    expect(kod(zaxiraniOqi('[]'))).toBe('zaxira-notolik')
    expect(kod(zaxiraniOqi('"salom"'))).toBe('zaxira-notolik')
    expect(kod(zaxiraniOqi(''))).toBe('zaxira-oqilmadi')
  })
})

describe('solishtirish — 0041 qatʼiy tasdiq (mezon 17a, 17c, 17d)', () => {
  it('mezon 17a — aynan oʻsha matn mos keladi', () => {
    const matn = zaxiraMatni(zaxiraYasa(mazmun({ turi: 'import-oldidan' })))

    expect(zaxiraBirXilmi(matn, matn)).toBe(true)
  })

  it('boʻshliqlari boshqacha yozilgan bir xil mazmun ham mos keladi', () => {
    const fayl = zaxiraYasa(mazmun({ turi: 'import-oldidan' }))
    const zich = JSON.stringify(JSON.parse(zaxiraMatni(fayl)))

    expect(zaxiraBirXilmi(zaxiraMatni(fayl), zich)).toBe(true)
  })

  it('mezon 17c — boshqa fayl (tiklanadigan zaxiraning oʻzi) mos kelmaydi', () => {
    const avtomatik = zaxiraMatni(zaxiraYasa(mazmun({ turi: 'import-oldidan' })))
    const tiklanadigan = zaxiraMatni(zaxiraYasa(mazmun({ yozuvlar: [SOM_YOZUV] })))

    expect(zaxiraBirXilmi(avtomatik, tiklanadigan)).toBe(false)
  })

  it('0041 qatʼiy — faqat `eksport` bloki farq qilsa ham mos kelmaydi', () => {
    const avtomatik = zaxiraMatni(zaxiraYasa(mazmun({ turi: 'import-oldidan' })))
    const qolda = zaxiraMatni(zaxiraYasa(mazmun({ turi: 'qolda' })))

    expect(zaxiraBirXilmi(avtomatik, qolda)).toBe(false)
  })

  it('0041 qatʼiy — eksport vaqti farq qilsa ham mos kelmaydi', () => {
    const birinchi = zaxiraMatni(zaxiraYasa(mazmun({ hozir: new Date('2026-08-17T14:05:00') })))
    const ikkinchi = zaxiraMatni(zaxiraYasa(mazmun({ hozir: new Date('2026-08-17T14:06:00') })))

    expect(zaxiraBirXilmi(birinchi, ikkinchi)).toBe(false)
  })

  it('mezon 17d — buzilgan fayl hech qachon mos kelmaydi', () => {
    const matn = zaxiraMatni(zaxiraYasa(mazmun()))

    expect(zaxiraBirXilmi(matn, matn.slice(0, 40))).toBe(false)
    expect(zaxiraBirXilmi(matn, '')).toBe(false)
  })
})

describe('boʻsh daftar taʼrifi (0055; mezon 17e–17i)', () => {
  const bosh = {
    yozuvlar: [] as Yozuv[],
    kontaktlar: [] as Kontakt[],
    qarzlar: [] as Qarz[],
    tolovlar: [] as Tolov[],
    kategoriyalar: tayyorKategoriyalar(),
  }

  it('mezon 17e — yozuvsiz, kontaktsiz va tayyor kategoriyali daftar boʻsh sanaladi', () => {
    expect(daftarBoshmi(bosh)).toBe(true)
  })

  it('mezon 17f — bitta yozuvi bor daftar boʻsh emas', () => {
    expect(daftarBoshmi({ ...bosh, yozuvlar: [SOM_YOZUV] })).toBe(false)
  })

  it('mezon 17g — yashirilgan kategoriyasi bor daftar boʻsh emas', () => {
    const yashirilgan = tayyorKategoriyalar().map((k, i) =>
      i === 0 ? { ...k, yashirilgan: true } : k,
    )

    expect(daftarBoshmi({ ...bosh, kategoriyalar: yashirilgan })).toBe(false)
  })

  it('mezon 17h — foydalanuvchi qoʻshgan kategoriyasi bor daftar boʻsh emas', () => {
    const qoshilgan: Kategoriya = {
      id: 'oz-kategoriyam',
      nom: 'kitob',
      turi: 'chiqim',
      yashirilgan: false,
      yaratilgan: '2026-08-16T09:00:00.000Z',
    }

    expect(daftarBoshmi({ ...bosh, kategoriyalar: [...tayyorKategoriyalar(), qoshilgan] })).toBe(
      false,
    )
  })

  it('mezon 17i — bitta kontakti bor daftar boʻsh emas', () => {
    expect(daftarBoshmi({ ...bosh, kontaktlar: [KONTAKT] })).toBe(false)
  })

  it('qarzi yoki toʻlovi bor daftar ham boʻsh emas', () => {
    expect(daftarBoshmi({ ...bosh, qarzlar: [QARZ] })).toBe(false)
    expect(daftarBoshmi({ ...bosh, tolovlar: [TOLOV] })).toBe(false)
  })

  it('kategoriyalar umuman boʻlmasa ham boʻsh sanaladi (hali urugʻlanmagan daftar)', () => {
    expect(daftarBoshmi({ ...bosh, kategoriyalar: [] })).toBe(true)
  })
})

/** Birinchi xato kodini qaytaradi — testda taqqoslash qisqa boʻlsin. */
function kod(natija: { ok: boolean; xatolar?: { kod: string }[] }): string | undefined {
  return natija.xatolar?.[0]?.kod
}

describe('tasdiq natijasi (0041; dizayn 5-boʻlim)', () => {
  it('mos kelsa `ok` qaytadi', () => {
    const matn = zaxiraMatni(zaxiraYasa(mazmun({ turi: 'import-oldidan' })))

    expect(zaxiraTasdigi(matn, matn).ok).toBe(true)
  })

  it('mos kelmasa `zaxira-mos-emas` kodi va sabab qaytadi', () => {
    const avtomatik = zaxiraMatni(zaxiraYasa(mazmun({ turi: 'import-oldidan' })))
    const boshqa = zaxiraMatni(zaxiraYasa(mazmun({ turi: 'qolda' })))

    const natija = zaxiraTasdigi(boshqa, avtomatik)

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('zaxira-mos-emas')
    expect(natija.xatolar[0]?.maydon).toBe('fayl')
    expect(natija.xatolar[0]?.xabar).not.toBe('')
  })
})
