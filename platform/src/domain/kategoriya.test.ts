import { describe, expect, it } from 'vitest'

import {
  TAYYOR_KATEGORIYALAR,
  kategoriyaniTop,
  kategoriyalarniTartibla,
  korinadiganlar,
  nomBoyichaTop,
  nomniTekshir,
  tayyorKategoriyalar,
} from './kategoriya.ts'
import type { Kategoriya, Natija, YozuvTuri } from './turlar.ts'

function kodlar(natija: Natija<unknown>): string[] {
  return natija.ok ? [] : natija.xatolar.map((xato) => xato.kod)
}

function xabarlar(natija: Natija<unknown>): string[] {
  return natija.ok ? [] : natija.xatolar.map((xato) => xato.xabar)
}

function kat(id: string, nom: string, turi: YozuvTuri, yashirilgan = false): Kategoriya {
  return { id, nom, turi, yashirilgan }
}

/** Foydalanuvchi qoʻshgan kategoriya — qoʻshilish vaqti bilan. */
function qoshilgan(id: string, nom: string, turi: YozuvTuri, yaratilgan: string): Kategoriya {
  return { id, nom, turi, yashirilgan: false, yaratilgan }
}

function nomlar(kategoriyalar: readonly Kategoriya[]): string[] {
  return kategoriyalar.map((kategoriya) => kategoriya.nom)
}

describe('TAYYOR_KATEGORIYALAR (0028; mezon 15)', () => {
  it('mezon 15 — chiqimda sakkizta nom, 0028 dagi tartibda', () => {
    expect(nomlar(korinadiganlar(tayyorKategoriyalar(), 'chiqim'))).toEqual([
      'oziq-ovqat',
      'transport',
      'ijara',
      'kommunal',
      'sogʻliq',
      'kiyim',
      'koʻngilochar',
      'boshqa',
    ])
  })

  it('mezon 15 — kirimda uchta nom, 0028 dagi tartibda', () => {
    expect(nomlar(korinadiganlar(tayyorKategoriyalar(), 'kirim'))).toEqual([
      'oylik',
      'qoʻshimcha daromad',
      'sovgʻa',
    ])
  })

  it('tayyor kategoriyalar yashirilmagan holda keladi va id lari takrorlanmaydi', () => {
    const tayyor = tayyorKategoriyalar()
    expect(tayyor.length).toBe(11)
    expect(tayyor.every((kategoriya) => kategoriya.yashirilgan === false)).toBe(true)
    expect(new Set(tayyor.map((kategoriya) => kategoriya.id)).size).toBe(11)
    expect(tayyor.every((kategoriya) => kategoriya.nom === kategoriya.nom.toLowerCase())).toBe(true)
  })

  it('tayyorKategoriyalar() har safar mustaqil nusxa qaytaradi', () => {
    const birinchi = tayyorKategoriyalar()
    const birinchisi = birinchi[0] as Kategoriya
    birinchisi.yashirilgan = true

    expect(tayyorKategoriyalar()[0]?.yashirilgan).toBe(false)
    expect(TAYYOR_KATEGORIYALAR[0]?.yashirilgan).toBe(false)
  })
})

describe('nomniTekshir — oʻz kategoriyasini qoʻshish (0013; mezon 13)', () => {
  it('mezon 13 — toʻgʻri nom qabul qilinadi va boʻshliqlari kesiladi', () => {
    const natija = nomniTekshir('  kitob  ', 'chiqim', tayyorKategoriyalar())
    expect(natija).toEqual({ ok: true, qiymat: 'kitob' })
  })

  it('mezon 13 — boʻsh nom rad etiladi: «Nom kiriting»', () => {
    const natija = nomniTekshir('', 'chiqim', tayyorKategoriyalar())
    expect(kodlar(natija)).toEqual(['kategoriya-nom-bosh'])
    expect(xabarlar(natija)).toEqual(['Nom kiriting'])
    expect(natija.ok === false && natija.xatolar[0]?.maydon).toBe('nom')
  })

  it('mezon 13 — faqat boʻshliqdan iborat nom ham boʻsh sanaladi', () => {
    expect(kodlar(nomniTekshir('   ', 'kirim', tayyorKategoriyalar()))).toEqual([
      'kategoriya-nom-bosh',
    ])
  })

  it('mezon 13 — ayni turdagi takror nom rad etiladi: «Bunday kategoriya bor»', () => {
    const natija = nomniTekshir('transport', 'chiqim', tayyorKategoriyalar())
    expect(kodlar(natija)).toEqual(['kategoriya-takror'])
    expect(xabarlar(natija)).toEqual(['Bunday kategoriya bor'])
  })

  it('takror tekshiruvi katta-kichik harf va ortiqcha boʻshliqqa qaramaydi', () => {
    expect(kodlar(nomniTekshir('  TRANSPORT ', 'chiqim', tayyorKategoriyalar()))).toEqual([
      'kategoriya-takror',
    ])
    expect(
      kodlar(nomniTekshir('oziq-ovqat', 'chiqim', [kat('k1', 'Oziq-Ovqat', 'chiqim')])),
    ).toEqual(['kategoriya-takror'])
  })

  it('mezon 16 — bir xil nom boshqa turda qabul qilinadi (roʻyxatlar alohida)', () => {
    expect(nomniTekshir('transport', 'kirim', tayyorKategoriyalar())).toEqual({
      ok: true,
      qiymat: 'transport',
    })
  })

  it('0051 — yashirilgan nom uchun alohida kod: takror emas, yoʻnaltiruvchi xato', () => {
    const mavjudlar = [kat('k1', 'transport', 'chiqim', true)]
    const natija = nomniTekshir('transport', 'chiqim', mavjudlar)

    expect(kodlar(natija)).toEqual(['kategoriya-yashirilgan'])
    expect(natija.ok === false && natija.xatolar[0]?.maydon).toBe('nom')
    expect(natija.ok === false && natija.xatolar[0]?.xabar).not.toBe('')
  })

  it('0051 — yashirilgan nom kodi katta-kichik harfda ham oʻsha boʻladi', () => {
    const mavjudlar = [kat('k1', 'transport', 'chiqim', true)]
    expect(kodlar(nomniTekshir('  TRANSPORT ', 'chiqim', mavjudlar))).toEqual([
      'kategoriya-yashirilgan',
    ])
  })

  it('0051 — koʻrinib turgan takror uchun kod eskicha qoladi', () => {
    const mavjudlar = [kat('k1', 'transport', 'chiqim', false)]
    expect(kodlar(nomniTekshir('transport', 'chiqim', mavjudlar))).toEqual(['kategoriya-takror'])
  })

  it('0051 — yashirilgan nom boshqa turda halaqit qilmaydi', () => {
    const mavjudlar = [kat('k1', 'transport', 'chiqim', true)]
    expect(nomniTekshir('transport', 'kirim', mavjudlar)).toEqual({ ok: true, qiymat: 'transport' })
  })
})

describe('nomBoyichaTop — «Koʻrsatish» uchun kerakli qator (0051)', () => {
  const royxat: Kategoriya[] = [
    kat('k1', 'transport', 'chiqim', true),
    kat('k2', 'transport', 'kirim'),
  ]

  it('yashirilgan qatorni oʻsha tur ichidan topadi', () => {
    expect(nomBoyichaTop(royxat, '  TRANSPORT ', 'chiqim')?.id).toBe('k1')
  })

  it('tur boʻyicha ajratadi', () => {
    expect(nomBoyichaTop(royxat, 'transport', 'kirim')?.id).toBe('k2')
  })

  it('nom band boʻlmasa null qaytadi', () => {
    expect(nomBoyichaTop(royxat, 'kitob', 'chiqim')).toBeNull()
  })
})

describe('korinadiganlar — yashirish va tur ajratmasi (0013; mezon 14, 16)', () => {
  const royxat: Kategoriya[] = [
    kat('k1', 'oziq-ovqat', 'chiqim'),
    kat('k2', 'transport', 'chiqim', true),
    kat('k3', 'oylik', 'kirim'),
    kat('k4', 'sovgʻa', 'kirim', true),
  ]

  it('mezon 14 — yashirilgan kategoriya tanlov roʻyxatida chiqmaydi', () => {
    expect(nomlar(korinadiganlar(royxat, 'chiqim'))).toEqual(['oziq-ovqat'])
    expect(nomlar(korinadiganlar(royxat, 'kirim'))).toEqual(['oylik'])
  })

  it('mezon 14 — yashirilgan kategoriya oʻchmaydi: nomi id boʻyicha topiladi', () => {
    const topilgan = kategoriyaniTop(royxat, 'k2')
    expect(topilgan?.nom).toBe('transport')
    expect(topilgan?.yashirilgan).toBe(true)
  })

  it('boʻlmagan id boʻyicha null qaytadi', () => {
    expect(kategoriyaniTop(royxat, 'yoq-bunday-id')).toBeNull()
  })

  it('mezon 16 — kirim kategoriyasi chiqim roʻyxatiga tushmaydi va aksincha', () => {
    expect(korinadiganlar(royxat, 'chiqim').every((k) => k.turi === 'chiqim')).toBe(true)
    expect(korinadiganlar(royxat, 'kirim').every((k) => k.turi === 'kirim')).toBe(true)
  })
})

describe('kategoriyalarniTartibla — roʻyxat tartibi', () => {
  /** Tayyor roʻyxatdan nomi boʻyicha bittasini oladi (id sxemasiga bogʻlanmaslik uchun). */
  function tayyor(nom: string): Kategoriya {
    const topilgan = tayyorKategoriyalar().find((kategoriya) => kategoriya.nom === nom)
    if (topilgan === undefined) {
      throw new Error(`Tayyor kategoriya topilmadi: ${nom}`)
    }
    return topilgan
  }

  it('tayyorlar 0028 tartibida oldinda, qoʻshilganlar qoʻshilish tartibida keyin', () => {
    const aralash: Kategoriya[] = [
      qoshilgan('q2', 'avtoulov', 'chiqim', '2026-08-17T10:00:00.002Z'),
      tayyor('transport'),
      qoshilgan('q1', 'zebra', 'chiqim', '2026-08-17T10:00:00.001Z'),
      tayyor('oziq-ovqat'),
    ]

    expect(nomlar(kategoriyalarniTartibla(aralash))).toEqual([
      'oziq-ovqat',
      'transport',
      'zebra',
      'avtoulov',
    ])
  })

  it('qoʻshilganlar nom boʻyicha saralanmaydi — alifbo teskari boʻlsa ham tartib saqlanadi', () => {
    const royxat: Kategoriya[] = [
      qoshilgan('q1', 'yakka', 'chiqim', '2026-08-17T10:00:00.001Z'),
      qoshilgan('q2', 'bozor', 'chiqim', '2026-08-17T10:00:00.002Z'),
      qoshilgan('q3', 'aeroport', 'chiqim', '2026-08-17T10:00:00.003Z'),
    ]

    expect(nomlar(kategoriyalarniTartibla(royxat))).toEqual(['yakka', 'bozor', 'aeroport'])
  })

  it('qoʻshilish vaqti yoʻq qatorlar ham barqaror tartibda turadi (nom boʻyicha)', () => {
    const royxat: Kategoriya[] = [kat('q2', 'kitob', 'chiqim'), kat('q1', 'avtoulov', 'chiqim')]
    expect(nomlar(kategoriyalarniTartibla(royxat))).toEqual(['avtoulov', 'kitob'])
  })

  it('tartiblash berilgan roʻyxatni oʻzgartirmaydi', () => {
    const royxat: Kategoriya[] = [kat('q1', 'kitob', 'chiqim'), tayyor('boshqa')]
    kategoriyalarniTartibla(royxat)
    expect(nomlar(royxat)).toEqual(['kitob', 'boshqa'])
  })
})
