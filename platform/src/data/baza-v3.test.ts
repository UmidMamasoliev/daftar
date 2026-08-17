// Sxema migratsiyasi: 2-versiyadagi baza (yozuvlar + kategoriyalar) 3-versiyaga
// oʻtganda eski omborlar va ulardagi maʼlumot buzilmasligi kerak — Q1 da faqat
// `kontaktlar`, `qarzlar` va `tolovlar` omborlari qoʻshiladi.
//
// Bu fayl `baza.test.ts` dan ayri: u bazani qoʻlda 2-versiya bilan yaratadi (vitest
// har test faylini alohida muhitda ishga tushiradi, shuning uchun bu yerdagi `daftar`
// bazasi boshqa testlarga tegmaydi).

import { beforeAll, describe, expect, it } from 'vitest'

import type { Kategoriya, Yozuv } from '../domain/turlar.ts'
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
import { hammaKontaktlar, hammaQarzlar, hammaTolovlar, kontaktQosh, qarzQosh } from './qarzlar.ts'
import { hammaYozuvlar, qoldiqlarniOl, yozuvniOl } from './yozuvlar.ts'

/** T9 dagi holat: 2-versiyali bazada yozuv va foydalanuvchi kategoriyasi bor. */
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

const ESKI_KATEGORIYA: Kategoriya = {
  id: 'oziq-ovqat',
  nom: 'oziq-ovqat',
  turi: 'chiqim',
  yashirilgan: true,
}

function eskiBazaniYarat(): Promise<void> {
  return new Promise((bajarildi, xato) => {
    const sorov = indexedDB.open(BAZA_NOMI, 2)
    sorov.onupgradeneeded = () => {
      const baza = sorov.result
      const yozuvlar = baza.createObjectStore(YOZUVLAR_OMBORI, { keyPath: 'id' })
      yozuvlar.createIndex('sana', 'sana', { unique: false })
      const kategoriyalar = baza.createObjectStore(KATEGORIYALAR_OMBORI, { keyPath: 'id' })
      kategoriyalar.createIndex('turi', 'turi', { unique: false })
    }
    sorov.onsuccess = () => {
      const baza = sorov.result
      const amal = baza.transaction([YOZUVLAR_OMBORI, KATEGORIYALAR_OMBORI], 'readwrite')
      amal.objectStore(YOZUVLAR_OMBORI).put(ESKI_YOZUV)
      amal.objectStore(KATEGORIYALAR_OMBORI).put(ESKI_KATEGORIYA)
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

describe('baza sxemasi — 2-versiyadan 3-versiyaga (Q1; 0015, 0016)', () => {
  it('versiya koʻtariladi va qarz daftari omborlari qoʻshiladi', async () => {
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

  it('eski `kategoriyalar` ombori va yashirilgan kategoriya joyida qoladi', async () => {
    const kategoriyalar = await hammaKategoriyalar()

    expect(kategoriyalar).toContainEqual(ESKI_KATEGORIYA)
    // Doʻkon boʻsh emas edi — urugʻlanish takrorlanmaydi (0013).
    expect(kategoriyalar.length).toBe(1)
  })

  it('eski indekslar joyida qoladi', async () => {
    const baza = await bazaniOch()
    const amal = baza.transaction([YOZUVLAR_OMBORI, KATEGORIYALAR_OMBORI], 'readonly')

    expect([...amal.objectStore(YOZUVLAR_OMBORI).indexNames]).toContain('sana')
    expect([...amal.objectStore(KATEGORIYALAR_OMBORI).indexNames]).toContain('turi')
  })

  it('yangi omborlar boʻsh boshlanadi va ishlaydi', async () => {
    expect(await hammaKontaktlar()).toEqual([])
    expect(await hammaQarzlar()).toEqual([])
    expect(await hammaTolovlar()).toEqual([])

    const odam = await kontaktQosh({ ism: 'Akmal' })
    await qarzQosh({
      kontaktId: odam.id,
      yonalishi: 'berdim',
      summa: 500000,
      valyuta: 'som',
      sana: '2026-08-02',
      hisob: 'karta',
    })

    expect((await hammaQarzlar()).length).toBe(1)
  })

  it('eski yozuv va yangi qarz bitta qoldiqda qoʻshiladi (0017)', async () => {
    // 2 000 000 kirim (eski yozuv) − 500 000 qarz (yuqoridagi testda berilgan).
    expect((await qoldiqlarniOl()).karta.som).toBe(1500000)
  })

  it('yangi omborlarning indekslari yaratiladi', async () => {
    const baza = await bazaniOch()
    const amal = baza.transaction([QARZLAR_OMBORI, TOLOVLAR_OMBORI], 'readonly')

    expect([...amal.objectStore(QARZLAR_OMBORI).indexNames]).toContain('kontaktId')
    expect([...amal.objectStore(TOLOVLAR_OMBORI).indexNames]).toContain('qarzId')
  })
})
