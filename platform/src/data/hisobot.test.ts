// Oylik hisobot doʻkon ustida: maʼlumot bazadan oʻqiladi va hisobot qayta hisoblanadi.
// Mezonlar — `prds/oylik-hisobot.md` dagi «Qanday tekshiramiz» roʻyxati.

import { beforeEach, describe, expect, it } from 'vitest'

import { joriyOyDavri, oyDavri } from '../domain/hisobot.ts'
import { bugun } from '../domain/sana.ts'
import type { Valyuta, YangiYozuv, Yozuv, YozuvTuri } from '../domain/turlar.ts'
import { hisobotniOl, joriyOyHisobotiniOl } from './hisobot.ts'
import { kategoriyaniYashir } from './kategoriyalar.ts'
import { qarzQosh, tolovQosh } from './qarzlar.ts'
import { bazaniTozala, yozuvQosh, yozuvniOchir, yozuvniYangila } from './yozuvlar.ts'

const AVGUST = oyDavri({ yil: 2026, oy: 8 })
const IYUL = oyDavri({ yil: 2026, oy: 7 })

beforeEach(async () => {
  await bazaniTozala()
})

function yangiYozuv(
  turi: YozuvTuri,
  summa: number,
  valyuta: Valyuta,
  sana: string,
  kategoriyaId = turi === 'kirim' ? 'oylik' : 'boshqa',
  kurs = 12500,
): YangiYozuv {
  const asos = { turi, summa, kategoriyaId, sana, hisob: 'karta' as const }
  return valyuta === 'dollar'
    ? { ...asos, valyuta: 'dollar' as const, kurs }
    : { ...asos, valyuta: 'som' as const }
}

function qosh(
  turi: YozuvTuri,
  summa: number,
  valyuta: Valyuta,
  sana: string,
  kategoriyaId?: string,
  kurs?: number,
): Promise<Yozuv> {
  return yozuvQosh(yangiYozuv(turi, summa, valyuta, sana, kategoriyaId, kurs))
}

function somQatori(qatorlar: readonly { valyuta: Valyuta; summa: number }[]): number | undefined {
  return qatorlar.find((qator) => qator.valyuta === 'som')?.summa
}

describe('hisobotniOl — davr va joriy oy (0018; mezon 1, 2, 17)', () => {
  it('mezon 1 — joriy oy hisoboti bugungi yozuvni oʻz ichiga oladi', async () => {
    await qosh('chiqim', 450000, 'som', bugun(), 'oziq-ovqat')
    const hisobot = await joriyOyHisobotiniOl()
    expect(hisobot.davr).toEqual(joriyOyDavri())
    expect(somQatori(hisobot.chiqim.qatorlar)).toBe(450000)
  })

  it('mezon 2 — boshqa oy tanlansa faqat oʻsha oyning raqamlari chiqadi', async () => {
    await qosh('chiqim', 100000, 'som', '2026-07-15', 'oziq-ovqat')
    await qosh('chiqim', 900000, 'som', '2026-08-15', 'oziq-ovqat')
    expect(somQatori((await hisobotniOl(IYUL)).chiqim.qatorlar)).toBe(100000)
    expect(somQatori((await hisobotniOl(AVGUST)).chiqim.qatorlar)).toBe(900000)
  })

  it('mezon 17 — boʻsh daftarda hisobot nol koʻrsatadi va xato bermaydi', async () => {
    const hisobot = await hisobotniOl(AVGUST)
    expect(hisobot.kirim.qatorlar).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(hisobot.chiqim.qatorlar).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(hisobot.farq.qatorlar).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(hisobot.chiqimAjratmasi).toEqual([])
    expect(hisobot.qarz).toEqual([])
    expect(hisobot.daftardaYozuvBormi).toBe(false)
  })
})

describe('hisobot har safar qayta hisoblanadi (0014, 0045; mezon 18)', () => {
  it('mezon 18 — yozuv tahrirlangandan keyin hisobot yangi raqamni koʻrsatadi', async () => {
    const yozuv = await qosh('chiqim', 500000, 'som', '2026-08-10', 'oziq-ovqat')
    expect(somQatori((await hisobotniOl(AVGUST)).chiqim.qatorlar)).toBe(500000)

    await yozuvniYangila(yozuv.id, yangiYozuv('chiqim', 700000, 'som', '2026-08-10', 'oziq-ovqat'))
    expect(somQatori((await hisobotniOl(AVGUST)).chiqim.qatorlar)).toBe(700000)
  })

  it('mezon 18 — yozuv oʻchirilsa hisobot darhol pasayadi', async () => {
    const yozuv = await qosh('chiqim', 500000, 'som', '2026-08-10', 'oziq-ovqat')
    await yozuvniOchir(yozuv.id)
    const hisobot = await hisobotniOl(AVGUST)
    expect(hisobot.chiqim.qatorlar).toEqual([{ valyuta: 'som', summa: 0 }])
    expect(hisobot.chiqimAjratmasi).toEqual([])
  })

  it('mezon 18 — yozuv boshqa oyga koʻchirilsa raqam oʻsha oyga oʻtadi', async () => {
    const yozuv = await qosh('chiqim', 300000, 'som', '2026-08-10', 'oziq-ovqat')
    await yozuvniYangila(yozuv.id, yangiYozuv('chiqim', 300000, 'som', '2026-07-10', 'oziq-ovqat'))
    expect((await hisobotniOl(AVGUST)).davrdaYozuvBormi).toBe(false)
    expect(somQatori((await hisobotniOl(IYUL)).chiqim.qatorlar)).toBe(300000)
  })
})

describe('kategoriyalar ajratmasi doʻkon ustida (0013, 0038; mezon 10, 12)', () => {
  it('mezon 10 — ajratma yigʻindisi jamiga aynan teng (bazadan oʻqilgan maʼlumatda ham)', async () => {
    await qosh('chiqim', 800000, 'som', '2026-08-02', 'oziq-ovqat')
    await qosh('chiqim', 200000, 'som', '2026-08-03', 'transport')
    await qosh('chiqim', 2000, 'dollar', '2026-08-04', 'oziq-ovqat')
    const hisobot = await hisobotniOl(AVGUST)

    const somYigindi = hisobot.chiqimAjratmasi
      .filter((qator) => qator.valyuta === 'som')
      .reduce((jami, qator) => jami + qator.summa, 0)
    const dollarYigindi = hisobot.chiqimAjratmasi
      .filter((qator) => qator.valyuta === 'dollar')
      .reduce((jami, qator) => jami + qator.summa, 0)

    expect(somYigindi).toBe(somQatori(hisobot.chiqim.qatorlar))
    expect(dollarYigindi).toBe(
      hisobot.chiqim.qatorlar.find((qator) => qator.valyuta === 'dollar')?.summa,
    )
  })

  it('mezon 12 — kategoriya yashirilgandan keyin ham eski yozuv ajratmada qoladi', async () => {
    await qosh('chiqim', 120000, 'som', '2026-08-02', 'kongilochar')
    await kategoriyaniYashir('kongilochar')
    const hisobot = await hisobotniOl(AVGUST)
    expect(hisobot.chiqimAjratmasi).toEqual([
      { kategoriyaId: 'kongilochar', valyuta: 'som', summa: 120000 },
    ])
  })
})

describe('qarz bloki doʻkon ustida (0064; mezon 13–14e)', () => {
  it('mezon 14e — dollar qarziga soʻm toʻlovi soʻm qatorida kiritilgan summasi bilan', async () => {
    const qarz = await qarzQosh({
      kontaktId: 'k1',
      yonalishi: 'berdim',
      summa: 10000,
      valyuta: 'dollar',
      sana: '2026-08-02',
      hisob: 'karta',
    })
    await tolovQosh({
      qarzId: qarz.id,
      summa: 625000,
      valyuta: 'som',
      kurs: 12500,
      sana: '2026-08-20',
      hisob: 'karta',
    })

    const hisobot = await hisobotniOl(AVGUST)
    expect(hisobot.qarz).toEqual([
      { qator: 'berildi', valyuta: 'dollar', summa: 10000 },
      { qator: 'qaytdi', valyuta: 'som', summa: 625000 },
    ])
    expect(hisobot.davrdaQarzHarakatiBormi).toBe(true)
  })

  it('mezon 15, 16 — qarz harakati jami kirim va chiqimga kirmaydi', async () => {
    await qosh('chiqim', 200000, 'som', '2026-08-02', 'oziq-ovqat')
    const qarz = await qarzQosh({
      kontaktId: 'k1',
      yonalishi: 'oldim',
      summa: 500000,
      valyuta: 'som',
      sana: '2026-08-03',
      hisob: 'karta',
    })
    await tolovQosh({
      qarzId: qarz.id,
      summa: 200000,
      valyuta: 'som',
      sana: '2026-08-25',
      hisob: 'karta',
    })

    const hisobot = await hisobotniOl(AVGUST)
    expect(somQatori(hisobot.kirim.qatorlar)).toBe(0)
    expect(somQatori(hisobot.chiqim.qatorlar)).toBe(200000)
    expect(hisobot.qarz).toEqual([
      { qator: 'olindi', valyuta: 'som', summa: 500000 },
      { qator: 'qaytarildi', valyuta: 'som', summa: 200000 },
    ])
  })
})

describe('«≈ jami soʻmda» kursi doʻkondan (0043–0045; mezon 21)', () => {
  it('mezon 21 — daftarda kurs boʻlmasa «kurs kerak» holati chiqadi', async () => {
    await qarzQosh({
      kontaktId: 'k1',
      yonalishi: 'berdim',
      summa: 10000,
      valyuta: 'dollar',
      sana: '2026-08-02',
      hisob: 'karta',
    })
    // Qarzda kurs yoʻq (0044, 0045) — demak daftarda birorta kurs manbai yoʻq.
    await qosh('chiqim', 100000, 'som', '2026-08-03', 'oziq-ovqat')
    const hisobot = await hisobotniOl(AVGUST)
    expect(hisobot.kurs).toBeNull()
  })

  it('mezon 21 — kursli dollar yozuvi boʻlsa ≈ jami toʻliq chiqadi', async () => {
    await qosh('kirim', 8000000, 'som', '2026-08-02', 'oylik')
    await qosh('kirim', 20000, 'dollar', '2026-08-03', 'oylik', 12500)
    const hisobot = await hisobotniOl(AVGUST)
    expect(hisobot.kirim.taxminiy).toEqual({ holat: 'bor', somda: 10500000, kurs: 12500 })
  })

  it('mezon 21 — qoʻlda soʻralgan kurs parametr boʻlib qatnashadi (0043)', async () => {
    await qosh('chiqim', 2000, 'dollar', '2026-08-03', 'oziq-ovqat', 12500)
    const kurssiz = await hisobotniOl(AVGUST)
    expect(kurssiz.kurs).toBe(12500)

    // Qoʻlda soʻralgan kurs kechroq sanali boʻlsa gʻolib boʻladi (0044).
    const qolda = await hisobotniOl(AVGUST, [
      { kurs: 13000, sana: '2026-08-16', yaratilgan: '2026-08-16T10:00:00.000Z' },
    ])
    expect(qolda.kurs).toBe(13000)
  })

  it('0044, 0045 — qarz toʻlovining kursi ham manba boʻladi', async () => {
    const qarz = await qarzQosh({
      kontaktId: 'k1',
      yonalishi: 'berdim',
      summa: 10000,
      valyuta: 'dollar',
      sana: '2026-08-02',
      hisob: 'karta',
    })
    await tolovQosh({
      qarzId: qarz.id,
      summa: 625000,
      valyuta: 'som',
      kurs: 12500,
      sana: '2026-08-20',
      hisob: 'karta',
    })
    const hisobot = await hisobotniOl(AVGUST)
    expect(hisobot.kurs).toBe(12500)
  })

  it('10b-band — kurs davrga bogʻliq emas: oʻtgan oy hisobotida ham eng yangi kurs', async () => {
    await qosh('chiqim', 1000, 'dollar', '2026-07-10', 'oziq-ovqat', 12000)
    await qosh('chiqim', 1000, 'dollar', '2026-08-10', 'oziq-ovqat', 13000)
    const iyul = await hisobotniOl(IYUL)
    expect(iyul.kurs).toBe(13000)
    // 10,00 $ × 13 000 = 130 000 soʻm — iyul yozuvining oʻz kursi (12 000) emas.
    expect(iyul.chiqim.taxminiy).toEqual({ holat: 'bor', somda: 130000, kurs: 13000 })
  })
})
