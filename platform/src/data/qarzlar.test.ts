// Qarz daftari doʻkoni: kontakt, qarz va toʻlov IndexedDB da qanday yashaydi.
// Mezonlar — `prds/qarz-daftari.md` dagi «Qanday tekshiramiz» roʻyxati.

import { beforeEach, describe, expect, it } from 'vitest'

import { boshlangichQarzFormasi, boshlangichTolovFormasi } from '../domain/qarz.ts'
import type { Kontakt, Qarz, QarzFormasi, TolovFormasi } from '../domain/turlar.ts'
import { bazaniTozala, bazaniYop, oxirgiKursniOl, qoldiqlarniOl, yozuvQosh } from './yozuvlar.ts'
import {
  hammaKontaktlar,
  hammaQarzlar,
  hammaTolovlar,
  kontaktHolatiniOl,
  kontaktHolatlari,
  kontaktQarzlari,
  kontaktQosh,
  kontaktSaqla,
  kontaktniOchir,
  kontaktniOl,
  kontaktniQaytar,
  kontaktniTahrirla,
  kontaktniYangila,
  qarzHolatiniOl,
  qarzQosh,
  qarzSaqla,
  qarzTolovlariniOl,
  qarzniOchir,
  qarzniOl,
  qarzniQaytar,
  qarzniTahrirla,
  tolovNusxasi,
  tolovQosh,
  tolovSaqla,
  tolovniOchir,
  tolovniOl,
  tolovniQaytar,
} from './qarzlar.ts'

beforeEach(async () => {
  await bazaniTozala()
})

/** Kontakt yaratadi — koʻp testda birinchi qadam. */
async function kontakt(ism = 'Akmal'): Promise<Kontakt> {
  return kontaktQosh({ ism })
}

/** Soʻmdagi «berdim» qarzi. */
async function somQarzi(kontaktId: string, summa = 1000000): Promise<Qarz> {
  return qarzQosh({
    kontaktId,
    yonalishi: 'berdim',
    summa,
    valyuta: 'som',
    sana: '2026-08-01',
    hisob: 'karta',
  })
}

/** Dollardagi «berdim» qarzi (summa sentda). */
async function dollarQarzi(kontaktId: string, summa = 10000): Promise<Qarz> {
  return qarzQosh({
    kontaktId,
    yonalishi: 'berdim',
    summa,
    valyuta: 'dollar',
    sana: '2026-08-01',
    hisob: 'karta',
  })
}

function qarzFormasi(kontaktId: string, ozgarish: Partial<QarzFormasi> = {}): QarzFormasi {
  return {
    ...boshlangichQarzFormasi(kontaktId, 'berdim'),
    summa: '1000000',
    sana: '2026-08-01',
    ...ozgarish,
  }
}

function tolovFormasi(qarz: Qarz, ozgarish: Partial<TolovFormasi> = {}): TolovFormasi {
  return { ...boshlangichTolovFormasi(qarz), sana: '2026-08-02', ...ozgarish }
}

describe('kontakt doʻkoni (0015, 0031; mezon 1, 2)', () => {
  it('mezon 1 — ismi kiritilgan kontakt saqlanadi va oʻqib olinadi', async () => {
    const natija = await kontaktSaqla({ ism: 'Akmal', telefon: '901234567' })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.ism).toBe('Akmal')
    expect(natija.qiymat.telefon).toBe('901234567')
    expect(await kontaktniOl(natija.qiymat.id)).toEqual(natija.qiymat)
  })

  it('mezon 1 — telefon boʻsh boʻlsa ham kontakt saqlanadi', async () => {
    const natija = await kontaktSaqla({ ism: 'Dilnoza', telefon: '' })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect('telefon' in natija.qiymat).toBe(false)
    expect((await hammaKontaktlar()).length).toBe(1)
  })

  it('mezon 2 — ismi boʻsh kontakt saqlanmaydi va doʻkonga hech narsa yozilmaydi', async () => {
    const natija = await kontaktSaqla({ ism: '  ', telefon: '901234567' })

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('kontakt-ism-bosh')
    expect(await hammaKontaktlar()).toEqual([])
  })

  it('kontakt tahrirlanadi, `id` va `yaratilgan` oʻzgarmaydi (0015, 0047)', async () => {
    const eski = await kontakt('Akmal')

    const yangi = await kontaktniYangila(eski.id, { ism: 'Akmal aka', telefon: '901112233' })

    expect(yangi.id).toBe(eski.id)
    expect(yangi.yaratilgan).toBe(eski.yaratilgan)
    expect(yangi.ism).toBe('Akmal aka')
    expect(await kontaktniOl(eski.id)).toEqual(yangi)
  })

  it('mezon 23 — kontaktlar alifbo tartibida qaytadi (harf katta-kichikligisiz)', async () => {
    await kontakt('Zamira')
    await kontakt('akmal')
    await kontakt('Dilnoza')

    expect((await hammaKontaktlar()).map((k) => k.ism)).toEqual(['akmal', 'Dilnoza', 'Zamira'])
  })

  it('mezon 23 — ism tahrirlansa roʻyxatdagi oʻrni ham oʻzgaradi', async () => {
    const odam = await kontakt('Zamira')
    await kontakt('Dilnoza')

    await kontaktniTahrirla(odam.id, { ism: 'Akmal', telefon: '' })

    expect((await hammaKontaktlar()).map((k) => k.ism)).toEqual(['Akmal', 'Dilnoza'])
  })

  it('bir xil ismli ikki kontakt xato emas (0031)', async () => {
    await kontakt('Akmal')
    const ikkinchi = await kontaktSaqla({ ism: 'Akmal', telefon: '901234567' })

    expect(ikkinchi.ok).toBe(true)
    expect((await hammaKontaktlar()).length).toBe(2)
  })

  it('boʻlmagan kontakt soʻralsa null qaytadi', async () => {
    expect(await kontaktniOl('yoq-bunday')).toBeNull()
  })
})

describe('qarz doʻkoni (0015, 0034, 0035; mezon 3, 4, 21)', () => {
  it('mezon 3 — «berdim» qarzi kontakt ostida koʻrinadi', async () => {
    const odam = await kontakt()

    const natija = await qarzSaqla(qarzFormasi(odam.id))

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.yonalishi).toBe('berdim')
    expect((await kontaktQarzlari(odam.id)).map((q) => q.id)).toEqual([natija.qiymat.id])
  })

  it('mezon 4 — «oldim» qarzi ham kontakt ostida koʻrinadi', async () => {
    const odam = await kontakt()

    const natija = await qarzSaqla(qarzFormasi(odam.id, { yonalishi: 'oldim' }))

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect((await kontaktQarzlari(odam.id))[0]?.yonalishi).toBe('oldim')
  })

  it('boshqa kontaktning qarzi aralashmaydi', async () => {
    const birinchi = await kontakt('Akmal')
    const ikkinchi = await kontakt('Dilnoza')
    await somQarzi(birinchi.id)

    expect(await kontaktQarzlari(ikkinchi.id)).toEqual([])
    expect((await hammaQarzlar()).length).toBe(1)
  })

  it('mezon 21 — kelajakdagi sana bilan qarz saqlanmaydi', async () => {
    const odam = await kontakt()

    const natija = await qarzSaqla(qarzFormasi(odam.id, { sana: '2099-01-01' }))

    expect(natija.ok).toBe(false)
    expect(await hammaQarzlar()).toEqual([])
  })

  it('boʻlmagan kontaktga qarz yozilmaydi', async () => {
    const natija = await qarzSaqla(qarzFormasi('yoq-bunday'))

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('kontakt-topilmadi')
    expect(await hammaQarzlar()).toEqual([])
  })

  it('qarzlar sana boʻyicha, bir kunda `yaratilgan` boʻyicha tartiblanadi (0047)', async () => {
    const odam = await kontakt()
    const eski = await qarzQosh({
      kontaktId: odam.id,
      yonalishi: 'berdim',
      summa: 100,
      valyuta: 'som',
      sana: '2026-08-01',
      hisob: 'karta',
    })
    const kunBirinchi = await qarzQosh({
      kontaktId: odam.id,
      yonalishi: 'berdim',
      summa: 200,
      valyuta: 'som',
      sana: '2026-08-05',
      hisob: 'karta',
    })
    const kunIkkinchi = await qarzQosh({
      kontaktId: odam.id,
      yonalishi: 'berdim',
      summa: 300,
      valyuta: 'som',
      sana: '2026-08-05',
      hisob: 'karta',
    })

    expect((await kontaktQarzlari(odam.id)).map((q) => q.id)).toEqual([
      kunIkkinchi.id,
      kunBirinchi.id,
      eski.id,
    ])
    expect((await kontaktQarzlari(odam.id, 'eskidan')).map((q) => q.id)).toEqual([
      eski.id,
      kunBirinchi.id,
      kunIkkinchi.id,
    ])
  })
})

describe('toʻlov va qoldiq (0016, 0052; mezon 5, 6, 6a, 6b, 7, 8, 9, 10, 11, 12)', () => {
  it('mezon 5 — 1 000 000 soʻm qarzga 300 000 toʻlov: qoldiq 700 000', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)

    const natija = await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))

    expect(natija.ok).toBe(true)
    const holat = await qarzHolatiniOl(qarz.id)
    expect(holat.qoldiq).toBe(700000)
    expect(holat.yopiq).toBe(false)
    // «toʻlangan» — 9b2 dagi xato matni uchun kerak: qarz valyutasidagi yigʻindi.
    expect(holat.tolangan).toBe(300000)
  })

  it('mezon 6 — qolgan 700 000 ham toʻlansa qoldiq nol va qarz yopiladi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))
    await tolovSaqla(tolovFormasi(qarz, { summa: '700000' }))

    const holat = await qarzHolatiniOl(qarz.id)

    expect(holat.qoldiq).toBe(0)
    expect(holat.yopiq).toBe(true)
  })

  it('mezon 6a — dollar qarzida 1 sent qoldiq yopiq, 2 sent ochiq (0052)', async () => {
    const odam = await kontakt()
    const bir = await dollarQarzi(odam.id)
    const ikki = await dollarQarzi(odam.id)
    await tolovSaqla(tolovFormasi(bir, { summa: '99,99' }))
    await tolovSaqla(tolovFormasi(ikki, { summa: '99,98' }))

    expect((await qarzHolatiniOl(bir.id)).yopiq).toBe(true)
    expect((await qarzHolatiniOl(ikki.id)).yopiq).toBe(false)
  })

  it('mezon 6b — soʻm qarzida 100 soʻm qoldiq yopiq, 101 soʻm ochiq (0052)', async () => {
    const odam = await kontakt()
    const bir = await somQarzi(odam.id)
    const ikki = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(bir, { summa: '999900' }))
    await tolovSaqla(tolovFormasi(ikki, { summa: '999899' }))

    expect((await qarzHolatiniOl(bir.id)).yopiq).toBe(true)
    expect((await qarzHolatiniOl(ikki.id)).yopiq).toBe(false)
  })

  it('mezon 7 — toʻlovlar tarixi qarz ostida sana bilan turadi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '100000', sana: '2026-08-02' }))
    await tolovSaqla(tolovFormasi(qarz, { summa: '200000', sana: '2026-08-10' }))

    const tolovlar = await qarzTolovlariniOl(qarz.id, 'eskidan')

    expect(tolovlar.map((t) => [t.sana, t.summa])).toEqual([
      ['2026-08-02', 100000],
      ['2026-08-10', 200000],
    ])
    expect((await qarzHolatiniOl(qarz.id)).tolovlar.length).toBe(2)
  })

  it('mezon 8 — toʻlov oʻchirilsa qoldiq darhol oʻsha summaga ortadi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    const saqlangan = await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))
    expect(saqlangan.ok).toBe(true)
    if (!saqlangan.ok) return

    await tolovniOchir(saqlangan.qiymat.id)

    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(1000000)
    expect(await tolovniOl(saqlangan.qiymat.id)).toBeNull()
  })

  it('mezon 9 — oʻchirilgan toʻlov qaytarilsa toʻlov ham, qoldiq ham tiklanadi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    const saqlangan = await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))
    if (!saqlangan.ok) return

    const nusxa = tolovNusxasi(await tolovniOchir(saqlangan.qiymat.id))
    await tolovniQaytar(nusxa)

    expect(await tolovniOl(saqlangan.qiymat.id)).toEqual(saqlangan.qiymat)
    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(700000)
  })

  it('mezon 10 — 100 $ qarzga 625 000 soʻm toʻlov 12 500 kurs bilan: qoldiq 50 $', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)

    const natija = await tolovSaqla(
      tolovFormasi(qarz, { valyuta: 'som', summa: '625000', kurs: '12500' }),
    )

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.kurs).toBe(12500)
    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(5000)
  })

  it('mezon 11 — qoldiq qarz valyutasida qoladi', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { valyuta: 'som', summa: '625000', kurs: '12500' }))

    expect((await qarzHolatiniOl(qarz.id)).qarz.valyuta).toBe('dollar')
  })

  it('mezon 12 — dollar qarziga dollarda toʻlovda kurs saqlanmaydi', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)

    const natija = await tolovSaqla(tolovFormasi(qarz, { summa: '50' }))

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.kurs).toBeUndefined()
    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(5000)
  })

  it('mezon 10c — kurs `0` bilan toʻlov saqlanmaydi va qoldiq oʻzgarmaydi (0049)', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)

    const natija = await tolovSaqla(
      tolovFormasi(qarz, { valyuta: 'som', summa: '625000', kurs: '0' }),
    )

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('kurs-musbat-emas')
    expect(await hammaTolovlar()).toEqual([])
    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(10000)
  })

  it('mezon 20 — nol summali toʻlov saqlanmaydi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)

    const natija = await tolovSaqla(tolovFormasi(qarz, { summa: '0' }))

    expect(natija.ok).toBe(false)
    expect(await hammaTolovlar()).toEqual([])
  })

  it('boʻlmagan qarzga toʻlov yozilmaydi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    const forma = { ...tolovFormasi(qarz, { summa: '1000' }), qarzId: 'yoq-bunday' }

    const natija = await tolovSaqla(forma)

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('qarz-topilmadi')
    expect(await hammaTolovlar()).toEqual([])
  })

  it('toʻlov `yaratilgan` vaqti bilan saqlanadi va u oʻsib boradi (0047; spec 15c)', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    const birinchi = await tolovQosh({
      qarzId: qarz.id,
      summa: 1000,
      valyuta: 'som',
      sana: '2026-08-02',
      hisob: 'karta',
    })
    const ikkinchi = await tolovQosh({
      qarzId: qarz.id,
      summa: 2000,
      valyuta: 'som',
      sana: '2026-08-02',
      hisob: 'karta',
    })

    expect(birinchi.yaratilgan < ikkinchi.yaratilgan).toBe(true)
  })
})

describe('kontakt holati va netto (0030, 0037, 0056; mezon 15c–15g, 16, 17, 18)', () => {
  it('mezon 15c va mezon 15d — netto valyuta boʻyicha, qarzi yoʻq valyuta qatori chiqmaydi', async () => {
    const odam = await kontakt()
    await dollarQarzi(odam.id, 10000)
    await qarzQosh({
      kontaktId: odam.id,
      yonalishi: 'oldim',
      summa: 3000,
      valyuta: 'dollar',
      sana: '2026-08-01',
      hisob: 'karta',
    })

    const holat = await kontaktHolatiniOl(odam.id)

    expect(holat.netto).toEqual([{ valyuta: 'dollar', netto: 7000 }])
    expect(holat.qarzlar.length).toBe(2)
  })

  it('mezon 15e — netto nol boʻlsa ham ikkala qarz ochiq va kontakt oʻchirilmaydi', async () => {
    const odam = await kontakt()
    await dollarQarzi(odam.id, 10000)
    await qarzQosh({
      kontaktId: odam.id,
      yonalishi: 'oldim',
      summa: 10000,
      valyuta: 'dollar',
      sana: '2026-08-01',
      hisob: 'karta',
    })

    const holat = await kontaktHolatiniOl(odam.id)

    expect(holat.netto).toEqual([{ valyuta: 'dollar', netto: 0 }])
    expect(holat.ochiqQarziBormi).toBe(true)
    expect((await kontaktniOchir(odam.id)).ok).toBe(false)
  })

  it('mezon 15f va mezon 6c — hamma qarzi chegara bilan yopilgan kontaktda netto yoʻq va u oʻchadi', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '99,99' }))

    const holat = await kontaktHolatiniOl(odam.id)
    expect(holat.netto).toEqual([])
    expect(holat.ochiqQarziBormi).toBe(false)

    const ochirish = await kontaktniOchir(odam.id)
    expect(ochirish.ok).toBe(true)
    expect(await kontaktniOl(odam.id)).toBeNull()
  })

  it('mezon 15g — bitta ochiq va bitta yopiq qarzda netto faqat ochiqdan hisoblanadi', async () => {
    const odam = await kontakt()
    const yopiladigan = await dollarQarzi(odam.id, 10000)
    await tolovSaqla(tolovFormasi(yopiladigan, { summa: '99,99' }))
    await dollarQarzi(odam.id, 4000)

    expect((await kontaktHolatiniOl(odam.id)).netto).toEqual([{ valyuta: 'dollar', netto: 4000 }])
  })

  it('mezon 16 — ochiq qarzi bor kontakt oʻchirilmaydi va sabab koʻrsatiladi (0030)', async () => {
    const odam = await kontakt()
    await somQarzi(odam.id)

    const natija = await kontaktniOchir(odam.id)

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('kontakt-ochiq-qarz')
    expect(natija.xatolar[0]?.xabar).not.toBe('')
    expect(await kontaktniOl(odam.id)).not.toBeNull()
    expect((await hammaQarzlar()).length).toBe(1)
  })

  it('mezon 17 — hamma qarzi yopilgan kontakt qarz tarixi bilan birga oʻchadi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '1000000' }))

    const natija = await kontaktniOchir(odam.id)

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.qarzlar.length).toBe(1)
    expect(natija.qiymat.tolovlar.length).toBe(1)
    expect(await hammaKontaktlar()).toEqual([])
    expect(await hammaQarzlar()).toEqual([])
    expect(await hammaTolovlar()).toEqual([])
  })

  it('mezon 18 — «qaytarish» bosilsa kontakt ham, qarz tarixi ham qaytadi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '1000000' }))
    const natija = await kontaktniOchir(odam.id)
    if (!natija.ok) return

    await kontaktniQaytar(natija.qiymat)

    expect(await kontaktniOl(odam.id)).toEqual(odam)
    expect((await kontaktQarzlari(odam.id)).length).toBe(1)
    expect((await qarzTolovlariniOl(qarz.id)).length).toBe(1)
    expect((await qarzHolatiniOl(qarz.id)).yopiq).toBe(true)
  })

  it('boshqa kontaktning qarzi oʻchirishda tegilmaydi', async () => {
    const birinchi = await kontakt('Akmal')
    const ikkinchi = await kontakt('Dilnoza')
    const qarz = await somQarzi(birinchi.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '1000000' }))
    await somQarzi(ikkinchi.id)

    await kontaktniOchir(birinchi.id)

    expect((await hammaQarzlar()).length).toBe(1)
    expect((await kontaktQarzlari(ikkinchi.id)).length).toBe(1)
  })

  it('kontaktlar roʻyxati har birining nettosi bilan qaytadi', async () => {
    const birinchi = await kontakt('Akmal')
    await kontakt('Dilnoza')
    await somQarzi(birinchi.id, 500000)

    const royxat = await kontaktHolatlari()

    expect(royxat.map((h) => h.kontakt.ism)).toEqual(['Akmal', 'Dilnoza'])
    expect(royxat[0]?.netto).toEqual([{ valyuta: 'som', netto: 500000 }])
    expect(royxat[1]?.netto).toEqual([])
  })

  it('boʻlmagan kontakt holati soʻralsa xato chiqadi', async () => {
    await expect(kontaktHolatiniOl('yoq-bunday')).rejects.toThrow()
  })
})

describe('qarz pul qoldigʻiga taʼsir qiladi (0017, 0035; mezon 13, 14, 15, 15a, 15b, 15h)', () => {
  it('mezon 13 — qarz berilganda tanlangan hisob qoldigʻi kamayadi', async () => {
    const odam = await kontakt()
    await yozuvQosh({
      turi: 'kirim',
      summa: 2000000,
      kategoriyaId: 'oylik',
      sana: '2026-08-01',
      hisob: 'karta',
      valyuta: 'som',
    })

    await qarzSaqla(qarzFormasi(odam.id))

    expect((await qoldiqlarniOl()).karta.som).toBe(1000000)
  })

  it('mezon 14 — qarz olinganda tanlangan hisob qoldigʻi ortadi', async () => {
    const odam = await kontakt()

    await qarzSaqla(qarzFormasi(odam.id, { yonalishi: 'oldim' }))

    expect((await qoldiqlarniOl()).karta.som).toBe(1000000)
  })

  it('mezon 15 — men bergan qarzga toʻlov kelganda hisob qoldigʻi ortadi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))

    expect((await qoldiqlarniOl()).karta.som).toBe(-700000)
  })

  it('mezon 15a — naqd tanlansa summa naqddan chiqadi, kartaga tegilmaydi', async () => {
    const odam = await kontakt()

    await qarzSaqla(qarzFormasi(odam.id, { hisob: 'naqd' }))
    const qoldiqlar = await qoldiqlarniOl()

    expect(qoldiqlar.naqd.som).toBe(-1000000)
    expect(qoldiqlar.karta.som).toBe(0)
  })

  it('mezon 15b — naqd va karta yigʻindisi umumiy qoldiqqa teng boʻlib qoladi', async () => {
    const odam = await kontakt()
    await yozuvQosh({
      turi: 'kirim',
      summa: 3000000,
      kategoriyaId: 'oylik',
      sana: '2026-08-01',
      hisob: 'karta',
      valyuta: 'som',
    })
    await qarzSaqla(qarzFormasi(odam.id, { hisob: 'naqd' }))
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000', hisob: 'naqd' }))

    const qoldiqlar = await qoldiqlarniOl()

    expect(qoldiqlar.naqd.som + qoldiqlar.karta.som).toBe(3000000 - 1000000 - 1000000 + 300000)
  })

  it('mezon 15h — chegara bilan yopilgan qarzdan keyin ham hisob qoldigʻi haqiqiy pulni koʻrsatadi', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '99,99' }))

    // Qarz yopiq (1 sent dumi), lekin qoldiqda oʻsha 1 sent koʻrinib turadi.
    expect((await qoldiqlarniOl()).karta.dollar).toBe(-1)
    expect((await qarzHolatiniOl(qarz.id)).yopiq).toBe(true)
  })

  it('toʻlov oʻz valyutasida pulga tegadi: dollar qarziga soʻm toʻlov (0023)', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { valyuta: 'som', summa: '625000', kurs: '12500' }))

    const qoldiqlar = await qoldiqlarniOl()

    expect(qoldiqlar.karta.dollar).toBe(-10000)
    expect(qoldiqlar.karta.som).toBe(625000)
  })

  it('kontakt oʻchirilganda qarz tarixi bilan birga qoldiqdan ham chiqadi (0030)', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '1000000' }))

    await kontaktniOchir(odam.id)

    expect((await qoldiqlarniOl()).karta.som).toBe(0)
  })
})

describe('toʻlov kursi «oxirgi kurs» hisobiga kiradi (0044, 0045; spec 15b-band)', () => {
  it('kursli toʻlov oxirgi kursni beradi', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)
    await tolovSaqla(
      tolovFormasi(qarz, { valyuta: 'som', summa: '625000', kurs: '12500', sana: '2026-08-02' }),
    )

    expect(await oxirgiKursniOl()).toBe(12500)
  })

  it('eng kech sanali manba gʻolib — yozuv va toʻlov teng qatnashadi', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)
    await yozuvQosh({
      turi: 'chiqim',
      summa: 10000,
      kategoriyaId: 'boshqa',
      sana: '2026-08-01',
      hisob: 'karta',
      valyuta: 'dollar',
      kurs: 12000,
    })
    await tolovSaqla(
      tolovFormasi(qarz, { valyuta: 'som', summa: '625000', kurs: '12800', sana: '2026-08-05' }),
    )

    expect(await oxirgiKursniOl()).toBe(12800)
  })

  it('toʻlov oʻchirilsa oxirgi kurs oʻz-oʻzidan toʻgʻrilanadi (0045)', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)
    await yozuvQosh({
      turi: 'chiqim',
      summa: 10000,
      kategoriyaId: 'boshqa',
      sana: '2026-08-01',
      hisob: 'karta',
      valyuta: 'dollar',
      kurs: 12000,
    })
    const tolov = await tolovSaqla(
      tolovFormasi(qarz, { valyuta: 'som', summa: '625000', kurs: '12800', sana: '2026-08-05' }),
    )
    if (!tolov.ok) return

    await tolovniOchir(tolov.qiymat.id)

    expect(await oxirgiKursniOl()).toBe(12000)
  })

  it('qarz valyutasidagi toʻlov kurs bermaydi (mezon 12)', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '50' }))

    expect(await oxirgiKursniOl()).toBeNull()
  })
})

describe('maʼlumot qurilmada qoladi (0004; mezon 22)', () => {
  it('baza yopilib qayta ochilsa kontakt, qarz va toʻlov joyida turadi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))

    bazaniYop()

    expect(await kontaktniOl(odam.id)).toEqual(odam)
    expect(await qarzniOl(qarz.id)).toEqual(qarz)
    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(700000)
  })
})

describe('kontaktni tahrirlash (0060)', () => {
  it('ism va telefon oʻzgaradi, `id` va `yaratilgan` joyida qoladi', async () => {
    const odam = await kontakt('Akmal')

    const natija = await kontaktniTahrirla(odam.id, { ism: 'Akmal aka', telefon: '901112233' })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat).toEqual({
      ...odam,
      ism: 'Akmal aka',
      telefon: '901112233',
    })
    expect(await kontaktniOl(odam.id)).toEqual(natija.qiymat)
  })

  it('ism boʻsh boʻlsa tahrirlash rad etiladi va eski qiymat qoladi', async () => {
    const odam = await kontakt('Akmal')

    const natija = await kontaktniTahrirla(odam.id, { ism: '  ', telefon: '901112233' })

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('kontakt-ism-bosh')
    expect(await kontaktniOl(odam.id)).toEqual(odam)
  })

  it('mezon 26 — tahrir kontaktning qarzlari, nettosi va qoldiqlariga tegmaydi', async () => {
    const odam = await kontakt('Akmal')
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))
    const oldingiQoldiq = await qoldiqlarniOl()
    const oldingiNetto = (await kontaktHolatiniOl(odam.id)).netto

    await kontaktniTahrirla(odam.id, { ism: 'Akmal aka', telefon: '901112233' })

    expect(await qoldiqlarniOl()).toEqual(oldingiQoldiq)
    expect((await kontaktHolatiniOl(odam.id)).netto).toEqual(oldingiNetto)
    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(700000)
    expect((await qarzTolovlariniOl(qarz.id)).length).toBe(1)
  })

  it('telefon oʻchirilsa maydon umuman yoʻqoladi', async () => {
    const saqlangan = await kontaktSaqla({ ism: 'Akmal', telefon: '901112233' })
    if (!saqlangan.ok) return

    const natija = await kontaktniTahrirla(saqlangan.qiymat.id, { ism: 'Akmal', telefon: '' })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect('telefon' in natija.qiymat).toBe(false)
  })
})

describe('qarzni tahrirlash (0059)', () => {
  it('summa, sana, hisob va yoʻnalish erkin oʻzgaradi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)

    const natija = await qarzniTahrirla(qarz.id, {
      ...qarzFormasi(odam.id),
      summa: '500000',
      sana: '2026-08-03',
      hisob: 'naqd',
      yonalishi: 'oldim',
    })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.id).toBe(qarz.id)
    expect(natija.qiymat.yaratilgan).toBe(qarz.yaratilgan)
    expect(natija.qiymat.summa).toBe(500000)
    expect(natija.qiymat.yonalishi).toBe('oldim')
    expect((await qoldiqlarniOl()).naqd.som).toBe(500000)
  })

  it('mezon 27 — 300 000 toʻlangan qarz 800 000 ga tahrirlansa qoldiq 500 000 boʻladi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))

    await qarzniTahrirla(qarz.id, { ...qarzFormasi(odam.id), summa: '800000' })

    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(500000)
  })

  it('mezon 28 — «berdim» «oldim» ga tahrirlansa qoldiq ikki barobar oʻzgaradi va netto teskari boʻladi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id, 500000)
    expect((await qoldiqlarniOl()).karta.som).toBe(-500000)

    await qarzniTahrirla(qarz.id, {
      ...qarzFormasi(odam.id),
      summa: '500000',
      yonalishi: 'oldim',
    })

    expect((await qoldiqlarniOl()).karta.som).toBe(500000)
    expect((await kontaktHolatiniOl(odam.id)).netto).toEqual([{ valyuta: 'som', netto: -500000 }])
  })

  it('mezon 29 — hisob «karta» dan «naqd» ga tahrirlansa karta tiklanadi, yigʻindi oʻzgarmaydi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id, 500000)

    await qarzniTahrirla(qarz.id, {
      ...qarzFormasi(odam.id),
      summa: '500000',
      hisob: 'naqd',
    })

    const qoldiqlar = await qoldiqlarniOl()
    expect(qoldiqlar.karta.som).toBe(0)
    expect(qoldiqlar.naqd.som).toBe(-500000)
    expect(qoldiqlar.karta.som + qoldiqlar.naqd.som).toBe(-500000)
  })

  it('mezon 30 — sana tahrirlansa roʻyxatdagi oʻrni oʻzgaradi, `yaratilgan` esa oʻzgarmaydi', async () => {
    const odam = await kontakt()
    const eski = await qarzQosh({
      kontaktId: odam.id,
      yonalishi: 'berdim',
      summa: 100000,
      valyuta: 'som',
      sana: '2026-08-01',
      hisob: 'karta',
    })
    const yangi = await qarzQosh({
      kontaktId: odam.id,
      yonalishi: 'berdim',
      summa: 200000,
      valyuta: 'som',
      sana: '2026-08-10',
      hisob: 'karta',
    })
    expect((await kontaktQarzlari(odam.id)).map((q) => q.id)).toEqual([yangi.id, eski.id])

    const natija = await qarzniTahrirla(eski.id, {
      ...qarzFormasi(odam.id),
      summa: '100000',
      sana: '2026-08-15',
    })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.yaratilgan).toBe(eski.yaratilgan)
    expect((await kontaktQarzlari(odam.id)).map((q) => q.id)).toEqual([eski.id, yangi.id])
  })

  it('toʻlovsiz qarzning valyutasi oʻzgartiriladi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)

    const natija = await qarzniTahrirla(qarz.id, {
      ...qarzFormasi(odam.id),
      valyuta: 'dollar',
      summa: '100',
    })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.valyuta).toBe('dollar')
    expect(natija.qiymat.summa).toBe(10000)
  })

  it('toʻlovi bor qarzning valyutasi oʻzgartirilmaydi va sabab koʻrsatiladi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))

    const natija = await qarzniTahrirla(qarz.id, {
      ...qarzFormasi(odam.id),
      valyuta: 'dollar',
      summa: '100',
    })

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('qarz-valyuta-ozgarmas')
    expect((await qarzniOl(qarz.id))?.valyuta).toBe('som')
  })

  it('mezon 33 — summa toʻlangan yigʻindiga tenglashtirilsa qarz yopiladi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))

    await qarzniTahrirla(qarz.id, { ...qarzFormasi(odam.id), summa: '300000' })

    const holat = await qarzHolatiniOl(qarz.id)
    expect(holat.qoldiq).toBe(0)
    expect(holat.yopiq).toBe(true)
  })

  it('mezon 33a — summa toʻlangandan chegaradan koʻp past qilinsa tahrir rad etiladi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))

    const natija = await qarzniTahrirla(qarz.id, { ...qarzFormasi(odam.id), summa: '299899' })

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('qarz-summa-tolovdan-kam')
    expect((await qarzniOl(qarz.id))?.summa).toBe(1000000)
  })

  it('mezon 33b — farq chegara ichida boʻlsa tahrir qabul qilinadi va qarz yopiladi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))

    const natija = await qarzniTahrirla(qarz.id, { ...qarzFormasi(odam.id), summa: '299900' })

    expect(natija.ok).toBe(true)
    const holat = await qarzHolatiniOl(qarz.id)
    expect(holat.qoldiq).toBe(0)
    expect(holat.yopiq).toBe(true)
  })

  it('mezon 33c — dollar qarzida chegara 1 sent: 49,99 $ qabul, 49,98 $ rad', async () => {
    const odam = await kontakt()
    const bir = await dollarQarzi(odam.id, 10000)
    const ikki = await dollarQarzi(odam.id, 10000)
    await tolovSaqla(tolovFormasi(bir, { summa: '50' }))
    await tolovSaqla(tolovFormasi(ikki, { summa: '50' }))

    const forma = { ...qarzFormasi(odam.id), valyuta: 'dollar' as const }

    expect((await qarzniTahrirla(bir.id, { ...forma, summa: '49,99' })).ok).toBe(true)
    expect((await qarzniTahrirla(ikki.id, { ...forma, summa: '49,98' })).ok).toBe(false)
    expect((await qarzniOl(ikki.id))?.summa).toBe(10000)
  })

  it('mezon 33d — rad etilgan tahrirdan keyin qoldiq, netto va toʻlovlar oʻzgarmaydi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))
    const oldingi = await qoldiqlarniOl()

    await qarzniTahrirla(qarz.id, { ...qarzFormasi(odam.id), summa: '299899' })

    expect(await qoldiqlarniOl()).toEqual(oldingi)
    expect((await kontaktHolatiniOl(odam.id)).netto).toEqual([{ valyuta: 'som', netto: 700000 }])
    expect((await qarzTolovlariniOl(qarz.id)).length).toBe(1)
  })

  it('boshqa valyutadagi toʻlov ham qarz valyutasida hisobga olinadi (9b2)', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id, 10000)
    // 625 000 soʻm 12 500 kurs bilan = 50,00 $ toʻlangan.
    await tolovSaqla(tolovFormasi(qarz, { valyuta: 'som', summa: '625000', kurs: '12500' }))
    const forma = { ...qarzFormasi(odam.id), valyuta: 'dollar' as const }

    expect((await qarzniTahrirla(qarz.id, { ...forma, summa: '49,98' })).ok).toBe(false)
    expect((await qarzniTahrirla(qarz.id, { ...forma, summa: '49,99' })).ok).toBe(true)
  })

  it('qarz boshqa kontaktga koʻchirilmaydi — tahrir rad etiladi (0059; dizayn 5-boʻlim)', async () => {
    const birinchi = await kontakt('Akmal')
    const ikkinchi = await kontakt('Dilnoza')
    const qarz = await somQarzi(birinchi.id)

    const natija = await qarzniTahrirla(qarz.id, {
      ...qarzFormasi(ikkinchi.id),
      summa: '500000',
    })

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('qarz-kontakt-ozgarmas')
    expect(natija.xatolar[0]?.maydon).toBe('kontaktId')
    const saqlangan = await qarzniOl(qarz.id)
    expect(saqlangan?.kontaktId).toBe(birinchi.id)
    expect(saqlangan?.summa).toBe(1000000)
    expect((await kontaktQarzlari(ikkinchi.id)).length).toBe(0)
  })

  it('oʻz kontakti bilan tahrir odatdagidek oʻtadi', async () => {
    const odam = await kontakt('Akmal')
    const qarz = await somQarzi(odam.id)

    const natija = await qarzniTahrirla(qarz.id, { ...qarzFormasi(odam.id), summa: '500000' })

    expect(natija.ok).toBe(true)
    if (!natija.ok) return
    expect(natija.qiymat.kontaktId).toBe(odam.id)
  })

  it('boʻlmagan qarz tahrirlansa xato chiqadi', async () => {
    const odam = await kontakt()

    await expect(qarzniTahrirla('yoq-bunday', qarzFormasi(odam.id))).rejects.toThrow()
  })
})

describe('qarzni oʻchirish va qaytarish (0059; 0029, 0048 naqshi)', () => {
  it('qarz oʻchirilsa toʻlovlari ham birga oʻchadi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))
    const boshqa = await somQarzi(odam.id, 500000)
    await tolovSaqla(tolovFormasi(boshqa, { summa: '100000' }))

    const ochirilgan = await qarzniOchir(qarz.id)

    expect(ochirilgan.qarz.id).toBe(qarz.id)
    expect(ochirilgan.tolovlar.length).toBe(1)
    expect(await qarzniOl(qarz.id)).toBeNull()
    expect((await hammaTolovlar()).length).toBe(1)
    expect((await qarzTolovlariniOl(boshqa.id)).length).toBe(1)
  })

  it('oʻchirilgan qarz qaytarilsa toʻlovlari va qoldigʻi bilan qaytadi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))

    const ochirilgan = await qarzniOchir(qarz.id)
    await qarzniQaytar(ochirilgan)

    expect(await qarzniOl(qarz.id)).toEqual(qarz)
    expect((await qarzTolovlariniOl(qarz.id)).length).toBe(1)
    expect((await qarzHolatiniOl(qarz.id)).qoldiq).toBe(700000)
  })

  it('qarz oʻchirilganda uning pul harakati ham qoldiqdan chiqadi (0017)', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '300000' }))
    expect((await qoldiqlarniOl()).karta.som).toBe(-700000)

    const ochirilgan = await qarzniOchir(qarz.id)
    expect((await qoldiqlarniOl()).karta.som).toBe(0)

    await qarzniQaytar(ochirilgan)
    expect((await qoldiqlarniOl()).karta.som).toBe(-700000)
  })

  it('qarz oʻchirilsa uning kursi «oxirgi kurs» hisobidan ham chiqadi (0045)', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)
    await tolovSaqla(
      tolovFormasi(qarz, { valyuta: 'som', summa: '625000', kurs: '12800', sana: '2026-08-05' }),
    )
    expect(await oxirgiKursniOl()).toBe(12800)

    await qarzniOchir(qarz.id)

    expect(await oxirgiKursniOl()).toBeNull()
  })

  it('boʻlmagan qarz oʻchirilsa xato chiqadi', async () => {
    await expect(qarzniOchir('yoq-bunday')).rejects.toThrow()
  })
})

describe('toʻlov qoldiqdan oshmaydi — doʻkon qatlami (0061)', () => {
  it('mezon 38 — chegaradan koʻp oshgan toʻlov saqlanmaydi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)

    const natija = await tolovSaqla(tolovFormasi(qarz, { summa: '1000101' }))

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('tolov-ortiqcha')
    expect(await hammaTolovlar()).toEqual([])
  })

  it('mezon 37, 40 — chegara ichida oshgan toʻlov saqlanadi: qoldiq nol, pulga toʻliq summa', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)

    const natija = await tolovSaqla(tolovFormasi(qarz, { summa: '1000100' }))

    expect(natija.ok).toBe(true)
    const holat = await qarzHolatiniOl(qarz.id)
    expect(holat.qoldiq).toBe(0)
    expect(holat.yopiq).toBe(true)
    expect((await qoldiqlarniOl()).karta.som).toBe(100)
    // mezon 40 — manfiy raqam yoʻq va netto qatori chiqmaydi (qarz yopilgan).
    expect(holat.qoldiq).toBeGreaterThanOrEqual(0)
    expect((await kontaktHolatiniOl(qarz.kontaktId)).netto).toEqual([])
  })

  it('mezon 39 — 50,00 $ qoldiqli qarzda 50,01 $ qabul, 50,02 $ rad', async () => {
    const odam = await kontakt()
    const bir = await dollarQarzi(odam.id, 5000)
    const ikki = await dollarQarzi(odam.id, 5000)

    expect((await tolovSaqla(tolovFormasi(bir, { summa: '50,01' }))).ok).toBe(true)
    expect((await tolovSaqla(tolovFormasi(ikki, { summa: '50,02' }))).ok).toBe(false)
    expect((await qarzHolatiniOl(bir.id)).qoldiq).toBe(0)
    expect((await qarzHolatiniOl(ikki.id)).qoldiq).toBe(5000)
  })

  it('mezon 42 — yopilgan qarzga toʻlov qoʻshilmaydi (0061c)', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '1000000' }))

    const natija = await tolovSaqla(tolovFormasi(qarz, { summa: '1000' }))

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('qarz-yopiq')
    expect((await hammaTolovlar()).length).toBe(1)
  })

  it('mezon 42 — toʻlov oʻchirilib qoldiq chegaradan oshsa qarz yana ochiladi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    const saqlangan = await tolovSaqla(tolovFormasi(qarz, { summa: '1000000' }))
    if (!saqlangan.ok) return
    expect((await qarzHolatiniOl(qarz.id)).yopiq).toBe(true)

    await tolovniOchir(saqlangan.qiymat.id)

    expect((await qarzHolatiniOl(qarz.id)).yopiq).toBe(false)
    expect((await tolovSaqla(tolovFormasi(qarz, { summa: '1000' }))).ok).toBe(true)
  })

  it('aylantirilganda nolga tushadigan toʻlov saqlanmaydi (0061b)', async () => {
    const odam = await kontakt()
    const qarz = await dollarQarzi(odam.id)

    const natija = await tolovSaqla(
      tolovFormasi(qarz, { valyuta: 'som', summa: '5', kurs: '12500' }),
    )

    expect(natija.ok).toBe(false)
    if (natija.ok) return
    expect(natija.xatolar[0]?.kod).toBe('tolov-nol-aylanma')
    expect(await hammaTolovlar()).toEqual([])
  })

  it('oldingi toʻlovlar hisobga olinadi: ikkinchi toʻlov qolgan qoldiqdan oshmaydi', async () => {
    const odam = await kontakt()
    const qarz = await somQarzi(odam.id)
    await tolovSaqla(tolovFormasi(qarz, { summa: '700000' }))

    const natija = await tolovSaqla(tolovFormasi(qarz, { summa: '300101' }))

    expect(natija.ok).toBe(false)
    expect((await hammaTolovlar()).length).toBe(1)
  })
})

describe('qarzning oʻzi kurs manbai emas (0044; 0063 aniqligi)', () => {
  it('faqat dollar qarzi bor daftarda oxirgi kurs yoʻq', async () => {
    const odam = await kontakt()
    await dollarQarzi(odam.id)

    expect(await oxirgiKursniOl()).toBeNull()
  })

  it('qarz formasida kurs maydoni yoʻq', () => {
    expect('kurs' in boshlangichQarzFormasi('k1')).toBe(false)
  })
})
