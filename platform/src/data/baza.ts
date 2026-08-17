// IndexedDB bilan ishlashning eng past qatlami: bazani ochish va bitta amalni bajarish.
//
// Hamma maʼlumot faqat foydalanuvchi qurilmasida turadi — server yoʻq (0004, 0008).
// Yuqoridagi qatlamlar (`yozuvlar.ts` va keyingi doʻkonlar) shu yerdagi yordamchilarni
// ishlatadi va IndexedDB ning hodisalari bilan ovora boʻlmaydi.

/** Baza nomi — brauzerda shu nom bilan koʻrinadi. */
export const BAZA_NOMI = 'daftar'

/**
 * Sxema versiyasi. Yangi ombor qoʻshilganda bittaga oshadi.
 * 1 → 2: `kategoriyalar` ombori qoʻshildi (T3; 0013, 0028). Eski `yozuvlar` ombori
 * va undagi maʼlumot tegilmaydi.
 */
export const BAZA_VERSIYASI = 2

/** Kirim-chiqim yozuvlari ombori. */
export const YOZUVLAR_OMBORI = 'yozuvlar'

/** Kategoriyalar ombori: tayyor roʻyxat va foydalanuvchi qoʻshganlari (0013, 0028). */
export const KATEGORIYALAR_OMBORI = 'kategoriyalar'

/** Bazadagi hamma omborlar — tozalash va yangilash shu roʻyxatdan yuradi. */
const OMBORLAR = [YOZUVLAR_OMBORI, KATEGORIYALAR_OMBORI]

let ochiq: IDBDatabase | null = null

/** Bazani ochadi (kerak boʻlsa sxemani yaratadi) va ochiq nusxani qaytaradi. */
export function bazaniOch(): Promise<IDBDatabase> {
  if (ochiq !== null) {
    return Promise.resolve(ochiq)
  }
  return new Promise<IDBDatabase>((bajarildi, xato) => {
    const sorov = indexedDB.open(BAZA_NOMI, BAZA_VERSIYASI)

    // Har ombor alohida tekshiriladi: eski versiyadan kelgan bazada faqat yetishmagani
    // yaratiladi, mavjudi va undagi maʼlumot qoʻlga tegmaydi.
    sorov.onupgradeneeded = () => {
      const baza = sorov.result
      if (!baza.objectStoreNames.contains(YOZUVLAR_OMBORI)) {
        const ombor = baza.createObjectStore(YOZUVLAR_OMBORI, { keyPath: 'id' })
        // Sana boʻyicha oʻqish keyin kerak boʻladi (hisobot davri, yozuvlar ekrani).
        ombor.createIndex('sana', 'sana', { unique: false })
      }
      if (!baza.objectStoreNames.contains(KATEGORIYALAR_OMBORI)) {
        const ombor = baza.createObjectStore(KATEGORIYALAR_OMBORI, { keyPath: 'id' })
        // Kirim va chiqim roʻyxatlari alohida oʻqiladi (mezon 16).
        ombor.createIndex('turi', 'turi', { unique: false })
      }
    }

    sorov.onsuccess = () => {
      const baza = sorov.result
      // Boshqa ilova nusxasi sxemani yangilasa, bu nusxa yoʻldan chetga chiqadi.
      baza.onversionchange = () => {
        bazaniYop()
      }
      ochiq = baza
      bajarildi(baza)
    }

    sorov.onerror = () => {
      xato(sorov.error ?? new Error('Bazani ochib boʻlmadi.'))
    }
  })
}

/** Ochiq bazani yopadi. Keyingi murojaatda u qaytadan ochiladi. */
export function bazaniYop(): void {
  if (ochiq !== null) {
    ochiq.close()
    ochiq = null
  }
}

/**
 * Bitta soʻrovni omborda bajaradi va natijasini qaytaradi.
 * Xato boʻlsa — Promise rad etiladi (`Error` bilan).
 */
export async function omborda<T>(
  omborNomi: string,
  rejim: IDBTransactionMode,
  ish: (ombor: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const baza = await bazaniOch()
  return new Promise<T>((bajarildi, xato) => {
    const amal = baza.transaction(omborNomi, rejim)
    const sorov = ish(amal.objectStore(omborNomi))
    sorov.onsuccess = () => {
      bajarildi(sorov.result)
    }
    sorov.onerror = () => {
      xato(sorov.error ?? new Error('Bazadagi soʻrov bajarilmadi.'))
    }
    amal.onabort = () => {
      xato(amal.error ?? new Error('Bazadagi amal bekor qilindi.'))
    }
  })
}

/** Hamma omborni boʻshatadi. Testlar uchun; ilovada ishlatilmaydi. */
export async function bazaniTozala(): Promise<void> {
  for (const omborNomi of OMBORLAR) {
    await omborda(omborNomi, 'readwrite', (ombor) => ombor.clear())
  }
}

/** Yangi yozuv uchun id. */
export function idYarat(): string {
  const tasodifiy = globalThis.crypto as { randomUUID?: () => string } | undefined
  if (typeof tasodifiy?.randomUUID === 'function') {
    return tasodifiy.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
