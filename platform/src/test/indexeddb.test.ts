import { describe, expect, it } from 'vitest'

// Skelet testi: bu yerda mahsulot mantiqi yoʻq. U faqat bitta narsani isbotlaydi —
// test muhitida IndexedDB ishlaydi (fake-indexeddb ulangan), demak keyingi agent
// maʼlumot saqlash kodini shu yerda test qila oladi (0040).

/** Bazani ochadi va bitta `omborcha` (object store) yaratadi. */
function bazaniOch(nom: string, ombor: string): Promise<IDBDatabase> {
  return new Promise((bajarildi, xato) => {
    const soʻrov = indexedDB.open(nom, 1)
    soʻrov.onupgradeneeded = () => {
      soʻrov.result.createObjectStore(ombor, { keyPath: 'id' })
    }
    soʻrov.onsuccess = () => {
      bajarildi(soʻrov.result)
    }
    soʻrov.onerror = () => {
      xato(soʻrov.error)
    }
  })
}

/** Bitta yozuvni saqlaydi. */
function yoz(baza: IDBDatabase, ombor: string, qiymat: unknown): Promise<void> {
  return new Promise((bajarildi, xato) => {
    const amal = baza.transaction(ombor, 'readwrite')
    amal.objectStore(ombor).put(qiymat)
    amal.oncomplete = () => {
      bajarildi()
    }
    amal.onerror = () => {
      xato(amal.error)
    }
  })
}

/** Kalit boʻyicha bitta yozuvni oʻqiydi. */
function oʻqi<T>(baza: IDBDatabase, ombor: string, kalit: IDBValidKey): Promise<T> {
  return new Promise((bajarildi, xato) => {
    const soʻrov = baza.transaction(ombor, 'readonly').objectStore(ombor).get(kalit)
    soʻrov.onsuccess = () => {
      bajarildi(soʻrov.result as T)
    }
    soʻrov.onerror = () => {
      xato(soʻrov.error)
    }
  })
}

describe('test muhiti', () => {
  it('IndexedDB mavjud', () => {
    expect(typeof indexedDB).toBe('object')
    expect(indexedDB).not.toBeNull()
  })

  it('bazaga yozilgan qiymat oʻqib olinadi', async () => {
    const baza = await bazaniOch('daftar-skelet-testi', 'sinov')
    await yoz(baza, 'sinov', { id: 1, matn: 'salom' })

    const natija = await oʻqi<{ id: number; matn: string }>(baza, 'sinov', 1)

    expect(natija).toEqual({ id: 1, matn: 'salom' })
    baza.close()
  })
})
