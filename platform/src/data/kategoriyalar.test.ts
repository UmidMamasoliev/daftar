import { beforeEach, describe, expect, it } from 'vitest'

import type { Kategoriya, Natija, YozuvFormasi } from '../domain/turlar.ts'
import { boshlangichForma } from '../domain/yozuv.ts'
import { tayyorKategoriyalar } from '../domain/kategoriya.ts'
import { KATEGORIYALAR_OMBORI, bazaniTozala, bazaniYop, omborda } from './baza.ts'
import {
  hammaKategoriyalar,
  kategoriyaQosh,
  kategoriyaniKorsat,
  kategoriyaniOl,
  kategoriyaniYashir,
  korinadiganKategoriyalar,
} from './kategoriyalar.ts'
import { hammaYozuvlar, yozuvSaqla } from './yozuvlar.ts'

function kodlar(natija: Natija<unknown>): string[] {
  return natija.ok ? [] : natija.xatolar.map((xato) => xato.kod)
}

function nomlar(kategoriyalar: readonly Kategoriya[]): string[] {
  return kategoriyalar.map((kategoriya) => kategoriya.nom)
}

/** Roʻyxatdan nomi boʻyicha bittasini topadi. */
function nomBoyicha(kategoriyalar: readonly Kategoriya[], nom: string): Kategoriya {
  const topilgan = kategoriyalar.find((kategoriya) => kategoriya.nom === nom)
  if (topilgan === undefined) {
    throw new Error(`Kategoriya topilmadi: ${nom}`)
  }
  return topilgan
}

function forma(ozgarish: Partial<YozuvFormasi> = {}): YozuvFormasi {
  return { ...boshlangichForma(), summa: '12500', turi: 'chiqim', ...ozgarish }
}

beforeEach(async () => {
  await bazaniTozala()
})

describe('urugʻlanish — tayyor roʻyxat (0028; mezon 15)', () => {
  it('mezon 15 — birinchi ochilishda 0028 dagi 11 ta kategoriya doʻkonda paydo boʻladi', async () => {
    const hammasi = await hammaKategoriyalar()

    expect(hammasi.length).toBe(11)
    expect(nomlar(hammasi.filter((k) => k.turi === 'chiqim'))).toEqual([
      'oziq-ovqat',
      'transport',
      'ijara',
      'kommunal',
      'sogʻliq',
      'kiyim',
      'koʻngilochar',
      'boshqa',
    ])
    expect(nomlar(hammasi.filter((k) => k.turi === 'kirim'))).toEqual([
      'oylik',
      'qoʻshimcha daromad',
      'sovgʻa',
    ])
    expect(hammasi.every((k) => k.yashirilgan === false)).toBe(true)
  })

  it('urugʻ bir marta sepiladi: qayta oʻqilganda roʻyxat koʻpaymaydi', async () => {
    const birinchi = await hammaKategoriyalar()
    await hammaKategoriyalar()
    const uchinchi = await hammaKategoriyalar()

    expect(uchinchi.length).toBe(11)
    expect(uchinchi.map((k) => k.id)).toEqual(birinchi.map((k) => k.id))
  })

  it('baza yopilib qayta ochilsa urugʻ takrorlanmaydi va yashirish saqlanib qoladi', async () => {
    const transport = nomBoyicha(await hammaKategoriyalar(), 'transport')
    await kategoriyaniYashir(transport.id)
    bazaniYop()

    const qaytaOchilgan = await hammaKategoriyalar()
    expect(qaytaOchilgan.length).toBe(11)
    expect(nomBoyicha(qaytaOchilgan, 'transport').yashirilgan).toBe(true)
  })

  it('urugʻ birdaniga soʻralganda ham takrorlanmaydi', async () => {
    const [birinchi, ikkinchi] = await Promise.all([hammaKategoriyalar(), hammaKategoriyalar()])

    expect(birinchi.length).toBe(11)
    expect(ikkinchi.length).toBe(11)
    expect((await hammaKategoriyalar()).length).toBe(11)
  })
})

describe('kategoriyaQosh — oʻz kategoriyasini qoʻshish (0013; mezon 13)', () => {
  it('mezon 13 — qoʻshilgan kategoriya oʻsha turdagi tanlov roʻyxatida koʻrinadi', async () => {
    const natija = await kategoriyaQosh('kitob', 'chiqim')

    expect(natija.ok).toBe(true)
    expect(natija.ok && natija.qiymat.yashirilgan).toBe(false)
    expect(nomlar(await korinadiganKategoriyalar('chiqim'))).toContain('kitob')
    expect(nomlar(await korinadiganKategoriyalar('kirim'))).not.toContain('kitob')
    expect((await hammaKategoriyalar()).length).toBe(12)
  })

  it('mezon 13 — boʻsh nom rad etiladi va doʻkonga hech narsa qoʻshilmaydi', async () => {
    const natija = await kategoriyaQosh('   ', 'chiqim')

    expect(kodlar(natija)).toEqual(['kategoriya-nom-bosh'])
    expect(natija.ok === false && natija.xatolar[0]?.xabar).toBe('Nom kiriting')
    expect((await hammaKategoriyalar()).length).toBe(11)
  })

  it('mezon 13 — ayni turdagi takror nom rad etiladi', async () => {
    const natija = await kategoriyaQosh('transport', 'chiqim')

    expect(kodlar(natija)).toEqual(['kategoriya-takror'])
    expect(natija.ok === false && natija.xatolar[0]?.xabar).toBe('Bunday kategoriya bor')
    expect((await hammaKategoriyalar()).length).toBe(11)
  })

  it('0051 — takror «  Transport » ↔ «transport»: chekka boʻshliq kesiladi, harf farqi hisobga olinmaydi', async () => {
    expect(kodlar(await kategoriyaQosh('  Transport ', 'chiqim'))).toEqual(['kategoriya-takror'])
    expect((await hammaKategoriyalar()).length).toBe(11)
    // solishtirish faqat joriy tur ichida: kirimda oʻsha nom band emas
    expect((await kategoriyaQosh('  Transport ', 'kirim')).ok).toBe(true)
    expect(nomlar(await korinadiganKategoriyalar('kirim'))).toContain('Transport')
  })

  it('mezon 13 — oʻzi qoʻshgan kategoriya ham ikkinchi marta qoʻshilmaydi', async () => {
    await kategoriyaQosh('kitob', 'chiqim')
    expect(kodlar(await kategoriyaQosh('  KITOB  ', 'chiqim'))).toEqual(['kategoriya-takror'])
    expect((await hammaKategoriyalar()).length).toBe(12)
  })

  it('0051 — yashirilgan nom bilan qoʻshish rad etiladi va sabab yashirilganini aytadi', async () => {
    const transport = nomBoyicha(await hammaKategoriyalar(), 'transport')
    await kategoriyaniYashir(transport.id)

    const natija = await kategoriyaQosh('transport', 'chiqim')

    expect(kodlar(natija)).toEqual(['kategoriya-yashirilgan'])
    // dublikat yaratilmaydi va yashirilgani oʻz holida qoladi (0051)
    expect((await hammaKategoriyalar()).length).toBe(11)
    expect((await kategoriyaniOl(transport.id))?.yashirilgan).toBe(true)
    expect(nomlar(await korinadiganKategoriyalar('chiqim'))).not.toContain('transport')
  })

  it('0051 — «Koʻrsatish» dan keyin oʻsha nom yana oddiy takror boʻladi', async () => {
    const transport = nomBoyicha(await hammaKategoriyalar(), 'transport')
    await kategoriyaniYashir(transport.id)
    await kategoriyaniKorsat(transport.id)

    expect(kodlar(await kategoriyaQosh('transport', 'chiqim'))).toEqual(['kategoriya-takror'])
  })

  it('mezon 16 — bir xil nom boshqa turda qoʻshilaveradi', async () => {
    expect((await kategoriyaQosh('transport', 'kirim')).ok).toBe(true)
    expect(nomlar(await korinadiganKategoriyalar('kirim'))).toContain('transport')
  })
})

describe('roʻyxat tartibi — 0028, keyin qoʻshilish tartibi (design/kirim-chiqim.md 1-boʻlim)', () => {
  it('qoʻshilgan kategoriyalar tayyorlardan keyin, qoʻshilish tartibida turadi', async () => {
    await kategoriyaQosh('yakka', 'chiqim')
    await kategoriyaQosh('bozor', 'chiqim')
    await kategoriyaQosh('aeroport', 'chiqim')

    expect(nomlar(await korinadiganKategoriyalar('chiqim'))).toEqual([
      'oziq-ovqat',
      'transport',
      'ijara',
      'kommunal',
      'sogʻliq',
      'kiyim',
      'koʻngilochar',
      'boshqa',
      'yakka',
      'bozor',
      'aeroport',
    ])
  })

  it('tartib baza yopilib qayta ochilganda ham saqlanadi (maydon yozuvda turadi)', async () => {
    await kategoriyaQosh('yakka', 'chiqim')
    await kategoriyaQosh('bozor', 'chiqim')
    bazaniYop()

    const qoshilganlar = (await hammaKategoriyalar()).filter(
      (kategoriya) => kategoriya.turi === 'chiqim' && kategoriya.yaratilgan !== undefined,
    )
    expect(nomlar(qoshilganlar)).toEqual(['yakka', 'bozor'])
  })

  it('yashirib qayta koʻrsatilgan kategoriya oʻz oʻrnida qoladi', async () => {
    const yakka = await kategoriyaQosh('yakka', 'chiqim')
    await kategoriyaQosh('bozor', 'chiqim')
    if (!yakka.ok) {
      throw new Error('kategoriya qoʻshilmadi')
    }

    await kategoriyaniYashir(yakka.qiymat.id)
    await kategoriyaniKorsat(yakka.qiymat.id)

    expect(nomlar(await korinadiganKategoriyalar('chiqim')).slice(-2)).toEqual(['yakka', 'bozor'])
  })

  it('qoʻshilgan kategoriyada qoʻshilish vaqti saqlanadi va u oʻsib boradi', async () => {
    const birinchi = await kategoriyaQosh('yakka', 'chiqim')
    const ikkinchi = await kategoriyaQosh('bozor', 'chiqim')

    expect(birinchi.ok && typeof birinchi.qiymat.yaratilgan).toBe('string')
    expect(
      birinchi.ok && ikkinchi.ok && (birinchi.qiymat.yaratilgan ?? '') < (ikkinchi.qiymat.yaratilgan ?? ''),
    ).toBe(true)
  })
})

describe('kategoriyaniYashir va kategoriyaniKorsat (0013; mezon 14)', () => {
  it('mezon 14 — yashirilgani tanlov roʻyxatidan chiqadi, lekin oʻchmaydi', async () => {
    const transport = nomBoyicha(await hammaKategoriyalar(), 'transport')

    const yashirilgan = await kategoriyaniYashir(transport.id)

    expect(yashirilgan.yashirilgan).toBe(true)
    expect(nomlar(await korinadiganKategoriyalar('chiqim'))).not.toContain('transport')
    expect((await hammaKategoriyalar()).length).toBe(11)
    expect(nomlar(await hammaKategoriyalar())).toContain('transport')
  })

  it('mezon 14 — yashirilgan kategoriyadagi eski yozuv joyida qoladi va nomi topiladi', async () => {
    const transport = nomBoyicha(await hammaKategoriyalar(), 'transport')
    const saqlangan = await yozuvSaqla(forma({ kategoriyaId: transport.id }))

    await kategoriyaniYashir(transport.id)

    expect((await hammaYozuvlar()).length).toBe(1)
    expect(saqlangan.ok && saqlangan.qiymat.kategoriyaId).toBe(transport.id)
    // hisobot va yozuvlar ekrani nomni shu yerdan oladi
    expect((await kategoriyaniOl(transport.id))?.nom).toBe('transport')
  })

  it('yashirilgan kategoriya qaytadan koʻrsatiladi', async () => {
    const transport = nomBoyicha(await hammaKategoriyalar(), 'transport')
    await kategoriyaniYashir(transport.id)

    const korsatilgan = await kategoriyaniKorsat(transport.id)

    expect(korsatilgan.yashirilgan).toBe(false)
    expect(nomlar(await korinadiganKategoriyalar('chiqim'))).toContain('transport')
  })

  it('boʻlmagan kategoriyani yashirish yoki koʻrsatish xato beradi', async () => {
    await expect(kategoriyaniYashir('yoq-bunday-id')).rejects.toThrow()
    await expect(kategoriyaniKorsat('yoq-bunday-id')).rejects.toThrow()
  })

  it('boʻlmagan kategoriya soʻralsa null qaytadi', async () => {
    expect(await kategoriyaniOl('yoq-bunday-id')).toBeNull()
  })
})

describe('korinadiganKategoriyalar — kirim va chiqim alohida (mezon 16)', () => {
  it('mezon 16 — har roʻyxatda faqat oʻz turidagi kategoriyalar boʻladi', async () => {
    const chiqim = await korinadiganKategoriyalar('chiqim')
    const kirim = await korinadiganKategoriyalar('kirim')

    expect(chiqim.length).toBe(8)
    expect(kirim.length).toBe(3)
    expect(chiqim.every((k) => k.turi === 'chiqim')).toBe(true)
    expect(kirim.every((k) => k.turi === 'kirim')).toBe(true)
    expect(nomlar(kirim)).not.toContain('oziq-ovqat')
    expect(nomlar(chiqim)).not.toContain('oylik')
  })

  it('mezon 16 — kirim kategoriyasi bilan chiqim yozuvi saqlanmaydi', async () => {
    const oylik = nomBoyicha(await hammaKategoriyalar(), 'oylik')
    const kategoriyalar = await hammaKategoriyalar()

    const natija = await yozuvSaqla(
      forma({ turi: 'chiqim', kategoriyaId: oylik.id }),
      kategoriyalar,
    )

    expect(kodlar(natija)).toEqual(['kategoriya-turi'])
    expect(await hammaYozuvlar()).toEqual([])
  })

  it('mezon 16 — mos turdagi kategoriya bilan yozuv saqlanadi', async () => {
    const oylik = nomBoyicha(await hammaKategoriyalar(), 'oylik')

    const natija = await yozuvSaqla(
      forma({ turi: 'kirim', kategoriyaId: oylik.id }),
      await hammaKategoriyalar(),
    )

    expect(natija.ok).toBe(true)
    expect((await hammaYozuvlar()).length).toBe(1)
  })
})

// ─── Yarim urugʻlanish: urugʻlanish oʻrtasiga boshqa amal tushsa nima boʻladi ───
//
// Bu yerdagi testlar QA topgan beqarorlikning ildizini qamraydi: urugʻlanish bir necha
// alohida amalda ketsa (yoki oʻrtaga import tozalashi tushsa) doʻkon YARIM urugʻlangan
// qolishi mumkin edi, `count() > 0` esa uni «tayyor» deb sanab, hech qachon tuzatmasdi.

/** Omborga faqat sanab oʻtilgan tayyor kategoriyalarni qoʻyadi — yarim urugʻ holati. */
async function yarimUruglantir(idlar: readonly string[], ozgarish: Partial<Kategoriya> = {}) {
  const tanlangan = tayyorKategoriyalar().filter((kategoriya) => idlar.includes(kategoriya.id))
  for (const kategoriya of tanlangan) {
    await omborda(KATEGORIYALAR_OMBORI, 'readwrite', (ombor) =>
      ombor.put({ ...kategoriya, ...ozgarish }),
    )
  }
}

describe('yarim urugʻlangan doʻkon oʻzini tuzatadi (0013, 0028)', () => {
  it('yetishmayotgan tayyor kategoriyalar keyingi oʻqishda toʻldiriladi', async () => {
    await yarimUruglantir(['oziq-ovqat', 'transport', 'ijara'])

    const kategoriyalar = await hammaKategoriyalar()

    expect(kategoriyalar.length).toBe(11)
    expect(kategoriyalar.map((k) => k.id)).toEqual(tayyorKategoriyalar().map((k) => k.id))
  })

  it('toʻldirish bazaga yoziladi — ikkinchi oʻqishda ham 11 ta turadi', async () => {
    await yarimUruglantir(['oziq-ovqat'])
    await hammaKategoriyalar()

    bazaniYop()

    expect((await hammaKategoriyalar()).length).toBe(11)
  })

  it('yashirilgan tayyor kategoriya qayta sepilmaydi — yashirilganicha qoladi', async () => {
    // Doʻkonda bitta tayyor kategoriya bor va u yashirilgan (foydalanuvchi shunday qilgan).
    await yarimUruglantir(['kongilochar'], { yashirilgan: true })

    const kategoriyalar = await hammaKategoriyalar()

    expect(kategoriyalar.length).toBe(11)
    expect(nomBoyicha(kategoriyalar, 'koʻngilochar').yashirilgan).toBe(true)
    // Qolganlari toʻldirildi va ular koʻrinadigan holatda.
    expect(nomBoyicha(kategoriyalar, 'oziq-ovqat').yashirilgan).toBe(false)
  })

  it('foydalanuvchi qoʻshgan kategoriyaga tegilmaydi va u oxirida qoladi', async () => {
    const qoshilgan = await kategoriyaQosh('kitob', 'chiqim')
    expect(qoshilgan.ok).toBe(true)
    if (!qoshilgan.ok) return
    // Tayyorlardan sakkiztasini omborga qaytarmaymiz — yarim urugʻ holatini yasaymiz.
    for (const kategoriya of tayyorKategoriyalar().slice(3)) {
      await omborda(KATEGORIYALAR_OMBORI, 'readwrite', (ombor) => ombor.delete(kategoriya.id))
    }

    const kategoriyalar = await hammaKategoriyalar()

    expect(kategoriyalar.length).toBe(12)
    expect(kategoriyalar[kategoriyalar.length - 1]?.id).toBe(qoshilgan.qiymat.id)
    expect(nomBoyicha(kategoriyalar, 'kitob').yaratilgan).toBe(qoshilgan.qiymat.yaratilgan)
  })

  it('urugʻlanish bitta amalda boʻladi: oʻrtaga tozalash tushsa ham yarim qolmaydi', async () => {
    // Urugʻlanish va tozalash bir vaqtda boshlanadi. Natija ikki xil boʻlishi mumkin:
    // yo tozalash urugʻdan oldin/keyin tushadi — lekin HECH QACHON yarim qolmaydi.
    const [kategoriyalar] = await Promise.all([
      hammaKategoriyalar(),
      omborda(KATEGORIYALAR_OMBORI, 'readwrite', (ombor) => ombor.clear()),
    ])

    expect(kategoriyalar.length).toBe(11)
    const qolgan = await omborda<number>(KATEGORIYALAR_OMBORI, 'readonly', (ombor) =>
      ombor.count(),
    )
    expect([0, 11]).toContain(qolgan)
  })
})
