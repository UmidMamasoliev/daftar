// Zaxira doʻkoni: butun bazadan eksport, fayldan import, oxirgi eksport sanasi va
// qoʻlda soʻralgan kurslar. Mezonlar — `prds/zaxira.md` «Qanday tekshiramiz».

import { beforeEach, describe, expect, it } from 'vitest'

import { tayyorKategoriyalar } from '../domain/kategoriya.ts'
import { bugun } from '../domain/sana.ts'
import type { ZaxiraFayli } from '../domain/zaxira.ts'
import { zaxiraMatni, zaxiraniOqi } from '../domain/zaxira.ts'
import { hammaKategoriyalar, kategoriyaQosh, kategoriyaniYashir } from './kategoriyalar.ts'
import {
  hammaKontaktlar,
  hammaQarzlar,
  hammaTolovlar,
  kontaktQosh,
  qarzHolatiniOl,
  qarzQosh,
  tolovQosh,
} from './qarzlar.ts'
import { oxirgiEksportniOl, oxirgiEksportniQoy, qoldaKursniQoy } from './sozlamalar.ts'
import {
  daftarBoshmi,
  zaxiraniChiqar,
  zaxiraniImport,
  zaxiraniQoy,
  zaxiraTasdigi,
} from './zaxira.ts'
import {
  bazaniTozala,
  bazaniYop,
  hammaYozuvlar,
  oxirgiKursniOl,
  qoldiqlarniOl,
  yozuvQosh,
} from './yozuvlar.ts'

beforeEach(async () => {
  await bazaniTozala()
})

/** Kichik daftar: bitta soʻm yozuvi, bitta dollar yozuvi, kontakt, qarz va toʻlov. */
async function daftarToldir(): Promise<void> {
  await yozuvQosh({
    turi: 'chiqim',
    summa: 1200000,
    kategoriyaId: 'oziq-ovqat',
    sana: '2026-08-15',
    hisob: 'karta',
    valyuta: 'som',
  })
  await yozuvQosh({
    turi: 'kirim',
    summa: 10000,
    kategoriyaId: 'oylik',
    sana: '2026-08-16',
    hisob: 'naqd',
    valyuta: 'dollar',
    kurs: 12500,
    izoh: 'sovgʻa',
  })
  const odam = await kontaktQosh({ ism: 'Akmal', telefon: '901234567' })
  const qarz = await qarzQosh({
    kontaktId: odam.id,
    yonalishi: 'berdim',
    summa: 10000,
    valyuta: 'dollar',
    sana: '2026-08-10',
    hisob: 'karta',
  })
  await tolovQosh({
    qarzId: qarz.id,
    summa: 625000,
    valyuta: 'som',
    kurs: 12500,
    sana: '2026-08-14',
    hisob: 'naqd',
  })
}

describe('eksport butun bazadan (mezon 1, 3, 4, 5, 6, 6d)', () => {
  it('mezon 1, 4 — boʻsh boʻlmagan daftar faylga chiqadi va sonlar teng boʻladi', async () => {
    await daftarToldir()

    const zaxira = await zaxiraniChiqar('qolda')
    const oqilgan = zaxiraniOqi(zaxira.matn)

    expect(oqilgan.ok).toBe(true)
    if (!oqilgan.ok) return
    expect(oqilgan.qiymat.yozuvlar.length).toBe((await hammaYozuvlar()).length)
    expect(oqilgan.qiymat.kontaktlar.length).toBe((await hammaKontaktlar()).length)
    expect(oqilgan.qiymat.qarzlar.length).toBe((await hammaQarzlar()).length)
    expect(oqilgan.qiymat.tolovlar.length).toBe((await hammaTolovlar()).length)
    expect(oqilgan.qiymat.kategoriyalar.length).toBe((await hammaKategoriyalar()).length)
  })

  it('mezon 3 — boʻsh daftardan ham fayl chiqadi, bloklar boʻsh massiv boʻladi', async () => {
    const zaxira = await zaxiraniChiqar('qolda')
    const oqilgan = zaxiraniOqi(zaxira.matn)

    expect(oqilgan.ok).toBe(true)
    if (!oqilgan.ok) return
    expect(oqilgan.qiymat.yozuvlar).toEqual([])
    expect(oqilgan.qiymat.kontaktlar).toEqual([])
    // Kategoriyalar urugʻlanadi (0028), shuning uchun ular boʻsh emas.
    expect(oqilgan.qiymat.kategoriyalar.length).toBe(11)
  })

  it('mezon 9, 15 — fayl nomida sana va turi koʻrinadi', async () => {
    const qolda = await zaxiraniChiqar('qolda', new Date('2026-08-17T14:35:00'))
    const avtomatik = await zaxiraniChiqar('import-oldidan', new Date('2026-08-17T14:35:00'))

    expect(qolda.nom).toBe('daftar-zaxira-2026-08-17-1435.json')
    expect(avtomatik.nom).toBe('daftar-import-oldidan-2026-08-17-1435.json')
  })

  it('mezon 12 — oʻchirilgan yozuv faylga tushmaydi (joriy holat yoziladi)', async () => {
    const yozuv = await yozuvQosh({
      turi: 'chiqim',
      summa: 5000,
      kategoriyaId: 'boshqa',
      sana: '2026-08-15',
      hisob: 'karta',
      valyuta: 'som',
    })
    const { yozuvniOchir } = await import('./yozuvlar.ts')
    await yozuvniOchir(yozuv.id)

    const oqilgan = zaxiraniOqi((await zaxiraniChiqar('qolda')).matn)

    expect(oqilgan.ok).toBe(true)
    if (!oqilgan.ok) return
    expect(oqilgan.qiymat.yozuvlar).toEqual([])
  })

  it('mezon 7 — yashirilgan kategoriya faylga belgisi bilan tushadi', async () => {
    await kategoriyaniYashir('kongilochar')

    const oqilgan = zaxiraniOqi((await zaxiraniChiqar('qolda')).matn)

    expect(oqilgan.ok).toBe(true)
    if (!oqilgan.ok) return
    const kategoriya = oqilgan.qiymat.kategoriyalar.find((k) => k.id === 'kongilochar')
    expect(kategoriya?.yashirilgan).toBe(true)
  })

  it('bir xil maʼlumotdan bir xil matn chiqadi (0041 solishtiruvi uchun)', async () => {
    await daftarToldir()
    const vaqt = new Date('2026-08-17T14:35:00')

    const birinchi = await zaxiraniChiqar('qolda', vaqt)
    const ikkinchi = await zaxiraniChiqar('qolda', vaqt)

    expect(ikkinchi.matn).toBe(birinchi.matn)
  })
})

describe('oxirgi eksport sanasi (0053, 0054; mezon 6g, 10, 11b)', () => {
  it('boshida sana yoʻq — daftar hech qachon eksport qilinmagan (mezon 11)', async () => {
    expect(await oxirgiEksportniOl()).toBeNull()
  })

  it('mezon 10 — qoʻlda eksportdan keyin sana yangilanadi', async () => {
    await zaxiraniChiqar('qolda', new Date('2026-08-17T14:35:00'))

    expect(await oxirgiEksportniOl()).toBe('2026-08-17')
  })

  it('mezon 11b — import oldidan avtomatik zaxira ham sanani yangilaydi (0054)', async () => {
    await zaxiraniChiqar('import-oldidan', new Date('2026-08-17T09:05:00'))

    expect(await oxirgiEksportniOl()).toBe('2026-08-17')
  })

  it('mezon 6g — faylning `oxirgi-eksport` qiymati shu eksport sanasiga teng', async () => {
    await oxirgiEksportniQoy('2026-07-01')

    const oqilgan = zaxiraniOqi((await zaxiraniChiqar('qolda', new Date('2026-08-17T14:35:00'))).matn)

    expect(oqilgan.ok).toBe(true)
    if (!oqilgan.ok) return
    expect(oqilgan.qiymat.eksport['oxirgi-eksport']).toBe('2026-08-17')
  })

  it('mezon 11c — eksportdan keyin import toʻxtasa ham sana oʻrnida qoladi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('import-oldidan', new Date('2026-08-17T09:05:00'))

    // Tasdiq qadamida boshqa fayl tanlandi — import bajarilmaydi.
    const tasdiq = zaxiraTasdigi('{"versiya":1}', zaxira.matn)

    expect(tasdiq.ok).toBe(false)
    expect(await oxirgiEksportniOl()).toBe('2026-08-17')
  })
})

describe('tasdiq — 0041 qatʼiy (mezon 17a, 17c, 17d)', () => {
  it('mezon 17a — chiqarilgan faylning oʻzi tasdiqlanadi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('import-oldidan')

    expect(zaxiraTasdigi(zaxira.matn, zaxira.matn).ok).toBe(true)
  })

  it('mezon 17c — boshqa fayl tanlansa tasdiqlanmaydi', async () => {
    await daftarToldir()
    const avtomatik = await zaxiraniChiqar('import-oldidan', new Date('2026-08-17T09:05:00'))
    const boshqa = await zaxiraniChiqar('qolda', new Date('2026-08-17T09:06:00'))

    const tasdiq = zaxiraTasdigi(boshqa.matn, avtomatik.matn)

    expect(tasdiq.ok).toBe(false)
    if (tasdiq.ok) return
    expect(tasdiq.xatolar[0]?.kod).toBe('zaxira-mos-emas')
  })

  it('mezon 17d — buzilgan fayl tanlansa tasdiqlanmaydi', async () => {
    const zaxira = await zaxiraniChiqar('import-oldidan')

    expect(zaxiraTasdigi(zaxira.matn.slice(0, 30), zaxira.matn).ok).toBe(false)
  })
})

describe('import — ustiga yozish (mezon 13, 14, 18, 19, 21, 23, 26)', () => {
  it('mezon 13, 14 — eksport, tozalash, import: hamma narsa va qoldiqlar qaytadi', async () => {
    await daftarToldir()
    const oldingiQoldiq = await qoldiqlarniOl()
    const zaxira = await zaxiraniChiqar('qolda')

    await bazaniTozala()
    expect((await hammaYozuvlar()).length).toBe(0)

    const natija = await zaxiraniImport(zaxira.matn)

    expect(natija.ok).toBe(true)
    expect((await hammaYozuvlar()).length).toBe(2)
    expect((await hammaKontaktlar()).length).toBe(1)
    expect((await hammaQarzlar()).length).toBe(1)
    expect((await hammaTolovlar()).length).toBe(1)
    expect(await qoldiqlarniOl()).toEqual(oldingiQoldiq)
  })

  it('0065 — import bloklar boʻyicha sonlarni qaytaradi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')

    const natija = await zaxiraniImport(zaxira.matn)

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat).toEqual({
      kategoriyalar: 11,
      yozuvlar: 2,
      kontaktlar: 1,
      qarzlar: 1,
      tolovlar: 1,
    })
  })

  it('mezon 18 — importdan oldin boʻlgan, faylda yoʻq yozuv qolmaydi', async () => {
    const zaxira = await zaxiraniChiqar('qolda') // boʻsh daftar fayli
    await daftarToldir()

    await zaxiraniImport(zaxira.matn)

    expect(await hammaYozuvlar()).toEqual([])
    expect(await hammaKontaktlar()).toEqual([])
  })

  it('mezon 19 — bir xil fayl ikki marta import qilinsa nusxa koʻpaymaydi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')

    await zaxiraniImport(zaxira.matn)
    await zaxiraniImport(zaxira.matn)

    expect((await hammaYozuvlar()).length).toBe(2)
    expect((await hammaTolovlar()).length).toBe(1)
  })

  it('mezon 21 — `id` lar, yashirilgan kategoriyalar va maydonlar fayldagi holicha qoladi', async () => {
    await kategoriyaniYashir('kongilochar')
    const qoshilgan = await kategoriyaQosh('kitob', 'chiqim')
    await daftarToldir()
    const eskiYozuvlar = await hammaYozuvlar()
    const zaxira = await zaxiraniChiqar('qolda')

    await bazaniTozala()
    await zaxiraniImport(zaxira.matn)

    expect(await hammaYozuvlar()).toEqual(eskiYozuvlar)
    const kategoriyalar = await hammaKategoriyalar()
    expect(kategoriyalar.find((k) => k.id === 'kongilochar')?.yashirilgan).toBe(true)
    expect(qoshilgan.ok).toBe(true)
    if (!qoshilgan.ok) return
    expect(kategoriyalar.find((k) => k.id === qoshilgan.qiymat.id)?.nom).toBe('kitob')
    // Qoʻshilgan kategoriyaning tartibi ham saqlanadi (0047 naqshi).
    expect(kategoriyalar[kategoriyalar.length - 1]?.id).toBe(qoshilgan.qiymat.id)
  })

  it('mezon 23 — 100 $ qarz va 50 $ toʻlovi bor fayldan qoldiq 50 $ boʻlib hisoblanadi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')
    await bazaniTozala()

    await zaxiraniImport(zaxira.matn)

    const qarz = (await hammaQarzlar())[0]
    expect(qarz).toBeDefined()
    if (qarz === undefined) return
    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(5000)
  })

  it('mezon 26 — importdan keyin baza yopilib qayta ochilsa maʼlumot joyida turadi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')
    await bazaniTozala()
    await zaxiraniImport(zaxira.matn)

    bazaniYop()

    expect((await hammaYozuvlar()).length).toBe(2)
    expect((await hammaTolovlar()).length).toBe(1)
  })

  it('mezon 11a, 21b — oxirgi eksport sanasi fayldagi qiymat bilan tiklanadi (0053)', async () => {
    await oxirgiEksportniQoy('2026-07-08')
    const eski = await zaxiraniChiqar('qolda', new Date('2026-07-08T10:00:00'))
    await oxirgiEksportniQoy('2026-08-17')

    await zaxiraniImport(eski.matn)

    expect(await oxirgiEksportniOl()).toBe('2026-07-08')
  })

  it('mezon 6f — bir xil sanadagi ikki kursli yozuv tartibi fayldan tiklanadi (0044, 0047)', async () => {
    await yozuvQosh({
      turi: 'chiqim',
      summa: 100,
      kategoriyaId: 'boshqa',
      sana: '2026-08-17',
      hisob: 'karta',
      valyuta: 'dollar',
      kurs: 12500,
    })
    await yozuvQosh({
      turi: 'chiqim',
      summa: 200,
      kategoriyaId: 'boshqa',
      sana: '2026-08-17',
      hisob: 'karta',
      valyuta: 'dollar',
      kurs: 12800,
    })
    const zaxira = await zaxiraniChiqar('qolda')
    await bazaniTozala()

    await zaxiraniImport(zaxira.matn)

    expect(await oxirgiKursniOl()).toBe(12800)
  })
})

describe('import tekshiruvdan oʻtmasa maʼlumot oʻzgarmaydi (mezon 20, 21, 22, 6e)', () => {
  it('mezon 20 — buzilgan JSON import qilinmaydi', async () => {
    await daftarToldir()
    const oldingi = await hammaYozuvlar()

    const natija = await zaxiraniImport('{ "versiya": 1, ')

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('zaxira-oqilmadi')
    expect(await hammaYozuvlar()).toEqual(oldingi)
  })

  it('mezon 21 — notanish versiya import qilinmaydi', async () => {
    await daftarToldir()
    const oldingi = await hammaYozuvlar()

    const natija = await zaxiraniImport('{"versiya": 99}')

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('zaxira-versiya')
    expect(await hammaYozuvlar()).toEqual(oldingi)
  })

  it('mezon 22, 6e — maydoni yetishmaydigan fayl import qilinmaydi', async () => {
    await daftarToldir()
    const oldingi = await hammaYozuvlar()
    const zaxira = await zaxiraniChiqar('qolda')
    const buzuq = JSON.parse(zaxira.matn) as { yozuvlar: Record<string, unknown>[] }
    delete buzuq.yozuvlar[0]?.yaratilgan

    const natija = await zaxiraniImport(JSON.stringify(buzuq))

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('zaxira-notolik')
    expect(await hammaYozuvlar()).toEqual(oldingi)
  })

  it('mezon 23 (spec) — import yarim holatda toʻxtamaydi: hammasi yoki hech narsa', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')
    const buzuq = JSON.parse(zaxira.matn) as { kontaktlar: Record<string, unknown>[] }
    delete buzuq.kontaktlar[0]?.ism

    await zaxiraniImport(JSON.stringify(buzuq))

    // Hech narsa tegilmagan: yozuvlar ham, kontaktlar ham joyida.
    expect((await hammaYozuvlar()).length).toBe(2)
    expect((await hammaKontaktlar()).length).toBe(1)
  })
})

describe('qoʻlda soʻralgan kurs (0043, 0045; mezon 6b, 24a–24d)', () => {
  it('mezon 24b — soʻralgan kurs saqlanadi va qayta ochilganda joyida turadi', async () => {
    await qoldaKursniQoy(12500, '2026-08-16')

    bazaniYop()

    expect(await oxirgiKursniOl()).toBe(12500)
  })

  it('mezon 6b — saqlangan kurs faylga sanasi bilan chiqadi', async () => {
    await qoldaKursniQoy(12500, '2026-08-16')

    const oqilgan = zaxiraniOqi((await zaxiraniChiqar('qolda')).matn)

    expect(oqilgan.ok).toBe(true)
    if (!oqilgan.ok) return
    expect(oqilgan.qiymat.kurslar).toEqual({ dollar: { kurs: 12500, sana: '2026-08-16' } })
  })

  it('mezon 6c — faqat yozuv kurslari bor daftarda blok boʻsh qoladi', async () => {
    await daftarToldir()

    const oqilgan = zaxiraniOqi((await zaxiraniChiqar('qolda')).matn)

    expect(oqilgan.ok).toBe(true)
    if (!oqilgan.ok) return
    expect(oqilgan.qiymat.kurslar).toEqual({})
  })

  it('mezon 24a — `kurslar` bloki bor fayl import qilingach kurs qayta soʻralmaydi', async () => {
    await qoldaKursniQoy(12500, '2026-08-16')
    const zaxira = await zaxiraniChiqar('qolda')
    await bazaniTozala()
    expect(await oxirgiKursniOl()).toBeNull()

    await zaxiraniImport(zaxira.matn)

    expect(await oxirgiKursniOl()).toBe(12500)
  })

  it('mezon 24c — blok boʻsh, lekin kursli yozuvlar boʻlsa ham kurs soʻralmaydi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')
    await bazaniTozala()

    await zaxiraniImport(zaxira.matn)

    expect(await oxirgiKursniOl()).toBe(12500)
  })

  it('mezon 24c — ikkalasi ham boʻlmasa kurs topilmaydi (soʻraladi)', async () => {
    const zaxira = await zaxiraniChiqar('qolda')

    await zaxiraniImport(zaxira.matn)

    expect(await oxirgiKursniOl()).toBeNull()
  })

  it('mezon 24d — eng kech sanali kurs gʻolib: qoʻlda soʻralgani ham teng qatnashadi (0044)', async () => {
    await yozuvQosh({
      turi: 'chiqim',
      summa: 10000,
      kategoriyaId: 'boshqa',
      sana: '2026-08-10',
      hisob: 'karta',
      valyuta: 'dollar',
      kurs: 12000,
    })
    await qoldaKursniQoy(12900, '2026-08-16')
    const zaxira = await zaxiraniChiqar('qolda')
    await bazaniTozala()

    await zaxiraniImport(zaxira.matn)

    expect(await oxirgiKursniOl()).toBe(12900)
  })

  it('mezon 23d (kirim-chiqim) — importdan KEYIN kiritilgan oʻsha kunlik kurs gʻolib', async () => {
    // QA jonli ssenariysi: `kurslar` bloki bugungi sanali fayl import qilinadi,
    // keyin oʻsha kunga dollar yozuvi kiritiladi — «≈ jami soʻmda» yozuv kursi
    // bilan hisoblanishi kerak (0044: oʻsha kunda keyin kiritilgani gʻolib).
    const bugungi = bugun()
    await qoldaKursniQoy(15000, bugungi)
    const zaxira = await zaxiraniChiqar('qolda')
    await bazaniTozala()
    await zaxiraniImport(zaxira.matn)
    expect(await oxirgiKursniOl()).toBe(15000)

    await yozuvQosh({
      turi: 'chiqim',
      summa: 10000,
      kategoriyaId: 'boshqa',
      sana: bugungi,
      hisob: 'karta',
      valyuta: 'dollar',
      kurs: 13500,
    })

    expect(await oxirgiKursniOl()).toBe(13500)
  })

  it('import `kurslar` bloki boʻsh boʻlsa eski saqlangan kursni oʻchiradi (toʻliq almashtirish)', async () => {
    const boshMatn = (await zaxiraniChiqar('qolda')).matn
    await qoldaKursniQoy(12500, '2026-08-16')

    await zaxiraniImport(boshMatn)

    expect(await oxirgiKursniOl()).toBeNull()
  })
})

describe('boʻsh daftar istisnosi (0055; mezon 17e–17i)', () => {
  it('mezon 17e — yangi daftar boʻsh sanaladi', async () => {
    expect(await daftarBoshmi()).toBe(true)
  })

  it('mezon 17f — bitta yozuvi bor daftar boʻsh emas', async () => {
    await yozuvQosh({
      turi: 'chiqim',
      summa: 5000,
      kategoriyaId: 'boshqa',
      sana: '2026-08-15',
      hisob: 'karta',
      valyuta: 'som',
    })

    expect(await daftarBoshmi()).toBe(false)
  })

  it('mezon 17g — kategoriyasi yashirilgan daftar boʻsh emas', async () => {
    await kategoriyaniYashir('kongilochar')

    expect(await daftarBoshmi()).toBe(false)
  })

  it('mezon 17h — foydalanuvchi kategoriyasi qoʻshilgan daftar boʻsh emas', async () => {
    await kategoriyaQosh('kitob', 'chiqim')

    expect(await daftarBoshmi()).toBe(false)
  })

  it('mezon 17i — bitta kontakti bor daftar boʻsh emas', async () => {
    await kontaktQosh({ ism: 'Akmal' })

    expect(await daftarBoshmi()).toBe(false)
  })

  it('mezon 17c (spec) — boʻsh daftarga importda eksport sanasi yangilanmaydi', async () => {
    await oxirgiEksportniQoy('2026-07-08')
    const fayl = await zaxiraniChiqar('qolda', new Date('2026-07-08T10:00:00'))
    await bazaniTozala()
    expect(await daftarBoshmi()).toBe(true)

    await zaxiraniImport(fayl.matn)

    // Avtomatik zaxira chiqarilmadi — sana faqat fayldan tiklandi.
    expect(await oxirgiEksportniOl()).toBe('2026-07-08')
  })
})

describe('tayyor kategoriyalar bilan solishtirish', () => {
  it('urugʻlangan daftar tayyor roʻyxat bilan bir xil boʻlib qoladi (0028)', async () => {
    const kategoriyalar = await hammaKategoriyalar()

    expect(kategoriyalar.map((k) => k.id)).toEqual(tayyorKategoriyalar().map((k) => k.id))
  })

  it('fayl obyektini toʻgʻridan-toʻgʻri qoʻysa ham natija bir xil (`zaxiraniQoy`)', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')
    const oqilgan = zaxiraniOqi(zaxira.matn)
    expect(oqilgan.ok).toBe(true)
    if (!oqilgan.ok) return
    const fayl: ZaxiraFayli = oqilgan.qiymat
    await bazaniTozala()

    const sanoqlar = await zaxiraniQoy(fayl)

    expect(sanoqlar.yozuvlar).toBe(2)
    expect(zaxiraMatni(fayl)).toBe(
      zaxiraMatni(
        (() => {
          const qayta = zaxiraniOqi(zaxira.matn)
          if (!qayta.ok) throw new Error('oʻqilmadi')
          return qayta.qiymat
        })(),
      ),
    )
  })
})

describe('sanoq qatori haqiqatda qoʻyilgan maʼlumotdan olinadi (0065; mezon 24e–24h)', () => {
  it('mezon 24e — sonlar bloklarga mos keladi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')
    await bazaniTozala()

    const natija = await zaxiraniImport(zaxira.matn)

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.yozuvlar).toBe(2)
    expect(natija.qiymat.kontaktlar).toBe(1)
    expect(natija.qiymat.qarzlar).toBe(1)
    expect(natija.qiymat.tolovlar).toBe(1)
  })

  it('mezon 24f — bir xil fayl ikki marta import qilinsa sonlar oʻzgarmaydi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')

    const birinchi = await zaxiraniImport(zaxira.matn)
    const ikkinchi = await zaxiraniImport(zaxira.matn)

    expect(birinchi.ok && ikkinchi.ok).toBe(true)
    if (!birinchi.ok || !ikkinchi.ok) return
    expect(ikkinchi.qiymat).toEqual(birinchi.qiymat)
  })

  it('mezon 24f — takroriy `id` li faylda sanoq haqiqatda qoʻyilganini koʻrsatadi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')
    const buzuq = JSON.parse(zaxira.matn) as { yozuvlar: Record<string, unknown>[] }
    const birinchi = buzuq.yozuvlar[0]
    if (birinchi !== undefined) {
      buzuq.yozuvlar.push({ ...birinchi })
    }
    await bazaniTozala()

    const natija = await zaxiraniImport(JSON.stringify(buzuq))

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    // Faylda 3 qator, lekin ikkitasining `id` si bir xil — daftarda 2 ta yozuv turadi.
    expect(natija.qiymat.yozuvlar).toBe(2)
    expect((await hammaYozuvlar()).length).toBe(2)
  })

  it('mezon 24g — boʻsh blok uchun `0` qaytadi', async () => {
    const zaxira = await zaxiraniChiqar('qolda') // boʻsh daftar

    const natija = await zaxiraniImport(zaxira.matn)

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.kontaktlar).toBe(0)
    expect(natija.qiymat.qarzlar).toBe(0)
    expect(natija.qiymat.tolovlar).toBe(0)
    expect(natija.qiymat.kategoriyalar).toBe(11)
  })

  it('mezon 24h — boʻsh daftarga bir qadamli importda ham sonlar qaytadi', async () => {
    await daftarToldir()
    const zaxira = await zaxiraniChiqar('qolda')
    await bazaniTozala()
    expect(await daftarBoshmi()).toBe(true)

    const natija = await zaxiraniImport(zaxira.matn)

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.yozuvlar).toBe(2)
  })
})

describe('avtomatik zaxira oddiy fayl bilan bir xil (mezon 16; spec 18)', () => {
  it('«import-oldidan» fayli ham qaytarib import qilinadi', async () => {
    await daftarToldir()
    const avtomatik = await zaxiraniChiqar('import-oldidan')
    await bazaniTozala()

    const natija = await zaxiraniImport(avtomatik.matn)

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.yozuvlar).toBe(2)
    expect((await hammaTolovlar()).length).toBe(1)
  })

  it('ikkala turdagi fayl bir xil bloklarga ega', async () => {
    await daftarToldir()
    const qolda = zaxiraniOqi((await zaxiraniChiqar('qolda')).matn)
    const avtomatik = zaxiraniOqi((await zaxiraniChiqar('import-oldidan')).matn)

    expect(qolda.ok && avtomatik.ok).toBe(true)
    if (!qolda.ok || !avtomatik.ok) return
    expect(Object.keys(avtomatik.qiymat).sort()).toEqual(Object.keys(qolda.qiymat).sort())
    expect(avtomatik.qiymat.eksport.turi).toBe('import-oldidan')
    expect(qolda.qiymat.eksport.turi).toBe('qolda')
  })
})
