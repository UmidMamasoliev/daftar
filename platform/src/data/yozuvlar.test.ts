import { beforeEach, describe, expect, it } from 'vitest'

import { oxirgiKurs, yozuvlardanKurslar } from '../domain/kurs.ts'
import type { KursManbai, YangiYozuv, Yozuv, YozuvFormasi } from '../domain/turlar.ts'
import { boshlangichForma } from '../domain/yozuv.ts'
import {
  bazaniTozala,
  bazaniYop,
  hammaYozuvlar,
  oxirgiKursniOl,
  qoldiqlarniOl,
  yozuvNusxasi,
  yozuvQosh,
  yozuvSaqla,
  yozuvniOchir,
  yozuvniOl,
  yozuvniQaytar,
  yozuvniYangila,
} from './yozuvlar.ts'

/** Soʻmdagi yozuv. */
function som(
  turi: 'kirim' | 'chiqim',
  summa: number,
  sana: string,
  hisob: 'naqd' | 'karta' = 'karta',
): YangiYozuv {
  return { turi, summa, kategoriyaId: 'boshqa', sana, hisob, valyuta: 'som' }
}

/** Dollardagi yozuv — kursi bilan. */
function dollar(summa: number, kurs: number, sana: string): YangiYozuv {
  return {
    turi: 'chiqim',
    summa,
    kategoriyaId: 'boshqa',
    sana,
    hisob: 'karta',
    valyuta: 'dollar',
    kurs,
  }
}

function forma(ozgarish: Partial<YozuvFormasi> = {}): YozuvFormasi {
  return {
    ...boshlangichForma(),
    summa: '12500',
    turi: 'chiqim',
    kategoriyaId: 'oziq-ovqat',
    ...ozgarish,
  }
}

beforeEach(async () => {
  await bazaniTozala()
})

describe('yozuvQosh va yozuvniOl (0008; mezon 1)', () => {
  it('mezon 1 — soʻmdagi chiqim yozuvi saqlanadi va oʻqib olinadi', async () => {
    const saqlangan = await yozuvQosh(som('chiqim', 12500, '2026-08-17'))

    expect(saqlangan.id).not.toBe('')
    expect(saqlangan.summa).toBe(12500)
    expect(saqlangan.turi).toBe('chiqim')
    expect(saqlangan.kategoriyaId).toBe('boshqa')

    expect(await yozuvniOl(saqlangan.id)).toEqual(saqlangan)
  })

  it('boʻlmagan yozuv soʻralsa null qaytadi', async () => {
    expect(await yozuvniOl('yoq-bunday-id')).toBeNull()
  })

  it('mezon 23h — ketma-ket kiritilgan yozuvlarning `yaratilgan` qiymati har xil va tartibli', async () => {
    const birinchi = await yozuvQosh(som('chiqim', 1000, '2026-08-17'))
    const ikkinchi = await yozuvQosh(som('chiqim', 2000, '2026-08-17'))

    expect(birinchi.yaratilgan).not.toBe(ikkinchi.yaratilgan)
    expect(birinchi.yaratilgan < ikkinchi.yaratilgan).toBe(true)
    expect(birinchi.id).not.toBe(ikkinchi.id)
  })

  it('baza yopilib qayta ochilsa yozuv joyida turadi (mezon 17 ning maʼlumot qismi)', async () => {
    const saqlangan = await yozuvQosh(som('kirim', 500000, '2026-08-17'))
    bazaniYop()

    expect(await yozuvniOl(saqlangan.id)).toEqual(saqlangan)
  })
})

describe('yozuvSaqla — forma bilan bitta qadamda (mezon 2)', () => {
  it('toʻgʻri forma saqlanadi', async () => {
    const natija = await yozuvSaqla(forma())
    expect(natija.ok).toBe(true)
    expect((await hammaYozuvlar()).length).toBe(1)
  })

  it('mezon 4g — aylantirish natijasi chegaradan oshsa doʻkonga hech narsa tushmaydi', async () => {
    const natija = await yozuvSaqla(
      forma({ summa: '10000', valyuta: 'dollar', kurs: '9007199254740' }),
    )

    expect(natija.ok).toBe(false)
    expect(natija.ok === false && natija.xatolar[0]?.xabar).toBe('Summa juda katta.')
    expect(await hammaYozuvlar()).toEqual([])
  })

  it('mezon 2 — xato formada hech narsa saqlanmaydi va sabab qaytadi', async () => {
    const natija = await yozuvSaqla(forma({ summa: '' }))

    expect(natija.ok).toBe(false)
    expect(natija.ok === false && natija.xatolar[0]?.kod).toBe('summa-bosh')
    expect(await hammaYozuvlar()).toEqual([])
  })
})

describe('hammaYozuvlar — tartib (0032; mezon 19)', () => {
  it('mezon 19 — sana boʻyicha tartiblanadi, bir kunda `yaratilgan` boʻyicha', async () => {
    const eski = await yozuvQosh(som('chiqim', 1000, '2026-07-01'))
    const kunBirinchi = await yozuvQosh(som('chiqim', 2000, '2026-08-17'))
    const kunIkkinchi = await yozuvQosh(som('chiqim', 3000, '2026-08-17'))
    const orta = await yozuvQosh(som('chiqim', 4000, '2026-08-05'))

    const yangidan = await hammaYozuvlar()
    expect(yangidan.map((yozuv) => yozuv.id)).toEqual([
      kunIkkinchi.id,
      kunBirinchi.id,
      orta.id,
      eski.id,
    ])

    const eskidan = await hammaYozuvlar('eskidan')
    expect(eskidan.map((yozuv) => yozuv.id)).toEqual([
      eski.id,
      orta.id,
      kunBirinchi.id,
      kunIkkinchi.id,
    ])
  })
})

describe('yozuvniYangila (0014, 0047; mezon 10, 23i)', () => {
  it('mezon 10 — tahrirlangan yozuv oʻz oʻrnida yangilanadi', async () => {
    const saqlangan = await yozuvQosh(som('chiqim', 250000, '2026-08-17'))
    const yangilangan = await yozuvniYangila(saqlangan.id, som('chiqim', 300000, '2026-08-17'))

    expect(yangilangan.summa).toBe(300000)
    expect((await hammaYozuvlar()).length).toBe(1)
    expect((await qoldiqlarniOl()).karta.som).toBe(-300000)
  })

  it('mezon 23i — tahrir `yaratilgan` ni oʻzgartirmaydi va id oʻsha qoladi', async () => {
    const saqlangan = await yozuvQosh(dollar(10000, 12500, '2026-08-17'))
    const yangilangan = await yozuvniYangila(saqlangan.id, dollar(10000, 12900, '2026-08-17'))

    expect(yangilangan.id).toBe(saqlangan.id)
    expect(yangilangan.yaratilgan).toBe(saqlangan.yaratilgan)
  })

  it('mezon 7 — dollardan soʻmga tahrirlanganda kurs yozuvda qolmaydi', async () => {
    const saqlangan = await yozuvQosh(dollar(10000, 12500, '2026-08-17'))
    const yangilangan = await yozuvniYangila(saqlangan.id, som('chiqim', 12500, '2026-08-17'))

    expect('kurs' in yangilangan).toBe(false)
    expect('kurs' in ((await yozuvniOl(saqlangan.id)) as Yozuv)).toBe(false)
  })

  it('boʻlmagan yozuvni tahrirlash xato beradi', async () => {
    await expect(yozuvniYangila('yoq-bunday-id', som('chiqim', 100, '2026-08-17'))).rejects.toThrow()
  })
})

describe('yozuvniOchir va yozuvniQaytar (0029; mezon 11, 12)', () => {
  it('mezon 11 — oʻchirilgan yozuv roʻyxatdan chiqadi, qaytarilsa yozuv ham qoldiq ham tiklanadi', async () => {
    await yozuvQosh(som('kirim', 1000000, '2026-08-17'))
    const ochiriladigan = await yozuvQosh(som('chiqim', 250000, '2026-08-17'))

    expect((await qoldiqlarniOl()).karta.som).toBe(750000)

    const qaytarishUchun = await yozuvniOchir(ochiriladigan.id)

    expect(await yozuvniOl(ochiriladigan.id)).toBeNull()
    expect((await hammaYozuvlar()).length).toBe(1)
    expect((await qoldiqlarniOl()).karta.som).toBe(1000000)

    const tiklangan = await yozuvniQaytar(qaytarishUchun)

    expect(tiklangan).toEqual(ochiriladigan)
    expect(await yozuvniOl(ochiriladigan.id)).toEqual(ochiriladigan)
    expect((await qoldiqlarniOl()).karta.som).toBe(750000)
  })

  it('mezon 12 — qaytarilmasa yozuv qaytmaydi', async () => {
    const ochiriladigan = await yozuvQosh(som('chiqim', 250000, '2026-08-17'))
    await yozuvniOchir(ochiriladigan.id)

    // «qaytarish» bosilmadi: muddat tugadi va oʻchirish yakuniy
    expect(await hammaYozuvlar()).toEqual([])
    expect(await yozuvniOl(ochiriladigan.id)).toBeNull()
  })

  it('boʻlmagan yozuvni oʻchirish xato beradi', async () => {
    await expect(yozuvniOchir('yoq-bunday-id')).rejects.toThrow()
  })

  it('qaytarish uchun berilgan nusxa oʻzgarmas qoladi', async () => {
    const saqlangan = await yozuvQosh(som('chiqim', 250000, '2026-08-17'))
    const nusxa = yozuvNusxasi(saqlangan)
    await yozuvniOchir(saqlangan.id)

    expect(nusxa).toEqual(saqlangan)
    expect(await yozuvniQaytar(nusxa)).toEqual(saqlangan)
  })
})

describe('qoldiqlarniOl (mezon 8, 9)', () => {
  it('mezon 8 va 9 — hisob × valyuta boʻyicha alohida sanaladi', async () => {
    await yozuvQosh(som('kirim', 1000000, '2026-08-17', 'naqd'))
    await yozuvQosh(som('chiqim', 250000, '2026-08-17', 'naqd'))
    await yozuvQosh(dollar(10000, 12500, '2026-08-17'))

    expect(await qoldiqlarniOl()).toEqual({
      naqd: { som: 750000, dollar: 0 },
      karta: { som: 0, dollar: -10000 },
    })
  })
})

describe('oxirgiKursniOl (0044, 0045; mezon 23a–23g)', () => {
  it('mezon 23g — kursli yozuv boʻlmasa null qaytadi', async () => {
    await yozuvQosh(som('chiqim', 12500, '2026-08-17'))
    expect(await oxirgiKursniOl()).toBeNull()
  })

  it('mezon 23a va 23b — eng kech sanali yozuvning kursi gʻolib', async () => {
    await yozuvQosh(dollar(10000, 12500, '2026-08-17'))
    await yozuvQosh(dollar(10000, 12000, '2026-08-10'))
    expect(await oxirgiKursniOl()).toBe(12500)

    await yozuvQosh(dollar(10000, 12800, '2026-08-18'))
    expect(await oxirgiKursniOl()).toBe(12800)
  })

  it('mezon 23c — bir xil sanada oxirgi kiritilgani gʻolib', async () => {
    await yozuvQosh(dollar(10000, 12500, '2026-08-17'))
    await yozuvQosh(dollar(10000, 12600, '2026-08-17'))
    expect(await oxirgiKursniOl()).toBe(12600)
  })

  it('mezon 23e — eng kech sanali yozuv oʻchirilsa oxirgi kurs oldingisiga qaytadi', async () => {
    await yozuvQosh(dollar(10000, 12500, '2026-08-16'))
    const kech = await yozuvQosh(dollar(10000, 12800, '2026-08-17'))

    expect(await oxirgiKursniOl()).toBe(12800)
    await yozuvniOchir(kech.id)
    expect(await oxirgiKursniOl()).toBe(12500)
  })

  it('mezon 23f — kurs tahrirlansa darhol yangi qiymat ishlatiladi', async () => {
    const yozuv = await yozuvQosh(dollar(10000, 12800, '2026-08-17'))
    await yozuvniYangila(yozuv.id, dollar(10000, 13100, '2026-08-17'))
    expect(await oxirgiKursniOl()).toBe(13100)
  })

  it('mezon 23d — qoʻlda soʻralgan kurs ham teng qatnashadi', async () => {
    await yozuvQosh(dollar(10000, 12500, '2026-08-16'))
    const qolda: KursManbai = {
      kurs: 13000,
      sana: '2026-08-17',
      yaratilgan: '2026-08-17T12:00:00.000Z',
    }

    expect(await oxirgiKursniOl([qolda])).toBe(13000)

    // oʻsha kunda kiritilgan keyingi kurs uni almashtiradi
    await yozuvQosh(dollar(10000, 12900, '2026-08-17'))
    expect(await oxirgiKursniOl([qolda])).toBe(12900)
  })

  it('bazadagi yozuvlardan oxirgi kursni domen funksiyasi ham bir xil topadi', async () => {
    await yozuvQosh(dollar(10000, 12500, '2026-08-16'))
    await yozuvQosh(dollar(10000, 12800, '2026-08-17'))

    const yozuvlar = await hammaYozuvlar()
    expect(oxirgiKurs(yozuvlardanKurslar(yozuvlar))).toBe(await oxirgiKursniOl())
  })
})
