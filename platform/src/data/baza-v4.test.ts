// Sxema migratsiyasi: 3-versiyadagi baza (yozuvlar, kategoriyalar, kontaktlar, qarzlar,
// tolovlar) 4-versiyaga oʻtganda eski omborlar va ulardagi maʼlumot buzilmasligi kerak —
// Z2 da faqat `sozlamalar` ombori qoʻshiladi (0043, 0053).
//
// Fayl `baza.test.ts` va `baza-v3.test.ts` dan ayri: bazani qoʻlda 3-versiya bilan yasaydi.

import { beforeAll, describe, expect, it } from 'vitest'

import type { Kontakt, Qarz, Tolov, Yozuv } from '../domain/turlar.ts'
import {
  BAZA_NOMI,
  BAZA_VERSIYASI,
  KATEGORIYALAR_OMBORI,
  KONTAKTLAR_OMBORI,
  QARZLAR_OMBORI,
  SOZLAMALAR_OMBORI,
  TOLOVLAR_OMBORI,
  YOZUVLAR_OMBORI,
  bazaniOch,
} from './baza.ts'
import { hammaKontaktlar, hammaQarzlar, hammaTolovlar, qarzHolatiniOl } from './qarzlar.ts'
import { oxirgiEksportniOl, qoldaKursniQoy } from './sozlamalar.ts'
import { hammaYozuvlar, oxirgiKursniOl, qoldiqlarniOl } from './yozuvlar.ts'
import { zaxiraniChiqar } from './zaxira.ts'

const ESKI_YOZUV: Yozuv = {
  id: 'eski-1',
  yaratilgan: '2026-08-01T09:00:00.000Z',
  turi: 'kirim',
  summa: 2000000,
  kategoriyaId: 'oylik',
  sana: '2026-08-01',
  hisob: 'karta',
  valyuta: 'som',
}

const ESKI_KONTAKT: Kontakt = {
  id: 'eski-k1',
  yaratilgan: '2026-08-02T09:00:00.000Z',
  ism: 'Akmal',
}

const ESKI_QARZ: Qarz = {
  id: 'eski-q1',
  yaratilgan: '2026-08-02T09:05:00.000Z',
  kontaktId: 'eski-k1',
  yonalishi: 'berdim',
  summa: 1000000,
  valyuta: 'som',
  sana: '2026-08-02',
  hisob: 'karta',
}

const ESKI_TOLOV: Tolov = {
  id: 'eski-t1',
  yaratilgan: '2026-08-03T09:00:00.000Z',
  qarzId: 'eski-q1',
  summa: 300000,
  valyuta: 'som',
  sana: '2026-08-03',
  hisob: 'naqd',
}

function eskiBazaniYarat(): Promise<void> {
  return new Promise((bajarildi, xato) => {
    const sorov = indexedDB.open(BAZA_NOMI, 3)
    sorov.onupgradeneeded = () => {
      const baza = sorov.result
      baza.createObjectStore(YOZUVLAR_OMBORI, { keyPath: 'id' }).createIndex('sana', 'sana')
      baza.createObjectStore(KATEGORIYALAR_OMBORI, { keyPath: 'id' }).createIndex('turi', 'turi')
      baza.createObjectStore(KONTAKTLAR_OMBORI, { keyPath: 'id' })
      baza.createObjectStore(QARZLAR_OMBORI, { keyPath: 'id' }).createIndex('kontaktId', 'kontaktId')
      baza.createObjectStore(TOLOVLAR_OMBORI, { keyPath: 'id' }).createIndex('qarzId', 'qarzId')
    }
    sorov.onsuccess = () => {
      const baza = sorov.result
      const amal = baza.transaction(
        [YOZUVLAR_OMBORI, KONTAKTLAR_OMBORI, QARZLAR_OMBORI, TOLOVLAR_OMBORI],
        'readwrite',
      )
      amal.objectStore(YOZUVLAR_OMBORI).put(ESKI_YOZUV)
      amal.objectStore(KONTAKTLAR_OMBORI).put(ESKI_KONTAKT)
      amal.objectStore(QARZLAR_OMBORI).put(ESKI_QARZ)
      amal.objectStore(TOLOVLAR_OMBORI).put(ESKI_TOLOV)
      amal.oncomplete = () => {
        baza.close()
        bajarildi()
      }
      amal.onerror = () => {
        xato(amal.error)
      }
    }
    sorov.onerror = () => {
      xato(sorov.error)
    }
  })
}

beforeAll(async () => {
  await eskiBazaniYarat()
})

describe('baza sxemasi — 3-versiyadan 4-versiyaga (Z2; 0043, 0053)', () => {
  it('versiya koʻtariladi va `sozlamalar` ombori qoʻshiladi', async () => {
    const baza = await bazaniOch()

    expect(BAZA_VERSIYASI).toBe(4)
    expect(baza.version).toBe(4)
    expect([...baza.objectStoreNames].sort()).toEqual(
      [
        KATEGORIYALAR_OMBORI,
        KONTAKTLAR_OMBORI,
        QARZLAR_OMBORI,
        SOZLAMALAR_OMBORI,
        TOLOVLAR_OMBORI,
        YOZUVLAR_OMBORI,
      ].sort(),
    )
  })

  it('eski yozuv, kontakt, qarz va toʻlov buzilmaydi', async () => {
    expect(await hammaYozuvlar()).toEqual([ESKI_YOZUV])
    expect(await hammaKontaktlar()).toEqual([ESKI_KONTAKT])
    expect(await hammaQarzlar()).toEqual([ESKI_QARZ])
    expect(await hammaTolovlar()).toEqual([ESKI_TOLOV])
  })

  it('eski maʼlumotdan hisoblanadigan qiymatlar oʻsha holicha qoladi', async () => {
    expect((await qarzHolatiniOl(ESKI_QARZ.id)).qoldiq).toBe(700000)
    // 2 000 000 kirim − 1 000 000 qarz (karta) + 300 000 toʻlov (naqd).
    const qoldiqlar = await qoldiqlarniOl()
    expect(qoldiqlar.karta.som).toBe(1000000)
    expect(qoldiqlar.naqd.som).toBe(300000)
  })

  it('eski indekslar joyida qoladi', async () => {
    const baza = await bazaniOch()
    const amal = baza.transaction([YOZUVLAR_OMBORI, QARZLAR_OMBORI, TOLOVLAR_OMBORI], 'readonly')

    expect([...amal.objectStore(YOZUVLAR_OMBORI).indexNames]).toContain('sana')
    expect([...amal.objectStore(QARZLAR_OMBORI).indexNames]).toContain('kontaktId')
    expect([...amal.objectStore(TOLOVLAR_OMBORI).indexNames]).toContain('qarzId')
  })

  it('yangi ombor boʻsh boshlanadi: eksport sanasi yoʻq, kurs yoʻq', async () => {
    expect(await oxirgiEksportniOl()).toBeNull()
    expect(await oxirgiKursniOl()).toBeNull()
  })

  it('yangi omborga yozilgan kurs oʻqiladi va eksportga tushadi', async () => {
    await qoldaKursniQoy(12500, '2026-08-16')

    expect(await oxirgiKursniOl()).toBe(12500)
    expect((await zaxiraniChiqar('qolda')).fayl.kurslar).toEqual({
      dollar: { kurs: 12500, sana: '2026-08-16' },
    })
  })

  it('eski maʼlumot yangi eksportga toʻliq tushadi', async () => {
    const fayl = (await zaxiraniChiqar('qolda')).fayl

    expect(fayl.yozuvlar.length).toBe(1)
    expect(fayl.kontaktlar.length).toBe(1)
    expect(fayl.qarzlar.length).toBe(1)
    expect(fayl.tolovlar.length).toBe(1)
  })
})
