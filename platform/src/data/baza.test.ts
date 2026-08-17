// Sxema migratsiyasi: 1-versiyadagi baza joriy versiyaga oʻtganda `yozuvlar` ombori va
// undagi maʼlumot buzilmasligi kerak — har qadamda faqat yangi omborlar qoʻshiladi
// (2: `kategoriyalar`; 3: `kontaktlar`, `qarzlar`, `tolovlar`).
//
// Bu fayl ataylab boshqa test fayllaridan ayri: u bazani baza.ts dan OLDIN, eski
// versiya bilan qoʻlda yaratadi (vitest har test faylini alohida muhitda ishga tushiradi,
// shuning uchun bu yerdagi `daftar` bazasi boshqa testlarga tegmaydi).

import { beforeAll, describe, expect, it } from 'vitest'

import type { Yozuv } from '../domain/turlar.ts'
import {
  BAZA_NOMI,
  BAZA_VERSIYASI,
  KATEGORIYALAR_OMBORI,
  KONTAKTLAR_OMBORI,
  QARZLAR_OMBORI,
  TOLOVLAR_OMBORI,
  YOZUVLAR_OMBORI,
  bazaniOch,
} from './baza.ts'
import { hammaKategoriyalar } from './kategoriyalar.ts'
import { hammaYozuvlar, yozuvniOl } from './yozuvlar.ts'

/** T2 dagi holat: 1-versiyali baza, faqat `yozuvlar` ombori bilan. */
const ESKI_YOZUV: Yozuv = {
  id: 'eski-1',
  yaratilgan: '2026-08-01T09:00:00.000Z',
  turi: 'chiqim',
  summa: 12500,
  kategoriyaId: 'oziq-ovqat',
  sana: '2026-08-01',
  hisob: 'karta',
  valyuta: 'som',
}

function eskiBazaniYarat(): Promise<void> {
  return new Promise((bajarildi, xato) => {
    const sorov = indexedDB.open(BAZA_NOMI, 1)
    sorov.onupgradeneeded = () => {
      const ombor = sorov.result.createObjectStore(YOZUVLAR_OMBORI, { keyPath: 'id' })
      ombor.createIndex('sana', 'sana', { unique: false })
    }
    sorov.onsuccess = () => {
      const baza = sorov.result
      const amal = baza.transaction(YOZUVLAR_OMBORI, 'readwrite')
      amal.objectStore(YOZUVLAR_OMBORI).put(ESKI_YOZUV)
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

describe('baza sxemasi — 1-versiyadan joriy versiyaga (0028; mezon 15)', () => {
  it('versiya koʻtariladi va yetishmagan omborlar qoʻshiladi', async () => {
    const baza = await bazaniOch()

    expect(BAZA_VERSIYASI).toBe(3)
    expect(baza.version).toBe(3)
    expect([...baza.objectStoreNames].sort()).toEqual(
      [
        KATEGORIYALAR_OMBORI,
        KONTAKTLAR_OMBORI,
        QARZLAR_OMBORI,
        TOLOVLAR_OMBORI,
        YOZUVLAR_OMBORI,
      ].sort(),
    )
  })

  it('eski `yozuvlar` ombori va undagi yozuv buzilmaydi', async () => {
    expect(await yozuvniOl(ESKI_YOZUV.id)).toEqual(ESKI_YOZUV)
    expect(await hammaYozuvlar()).toEqual([ESKI_YOZUV])
  })

  it('`yozuvlar` omborining `sana` indeksi joyida qoladi', async () => {
    const baza = await bazaniOch()
    const ombor = baza.transaction(YOZUVLAR_OMBORI, 'readonly').objectStore(YOZUVLAR_OMBORI)

    expect([...ombor.indexNames]).toContain('sana')
  })

  it('yangi omborga tayyor kategoriyalar urugʻlanadi', async () => {
    expect((await hammaKategoriyalar()).length).toBe(11)
    expect((await hammaYozuvlar()).length).toBe(1)
  })
})
