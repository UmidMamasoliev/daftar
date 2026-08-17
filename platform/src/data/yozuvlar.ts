// Kirim-chiqim yozuvlari doʻkoni: saqlash, oʻqish, tahrirlash, oʻchirish va qaytarish.
//
// Qoldiq va «oxirgi kurs» bu yerda SAQLANMAYDI — ular har safar yozuvlardan hisoblanadi
// (0045; mezon 10, 11, 23e, 23f). Shuning uchun tahrir va oʻchirish qoʻshimcha yangilash
// mantiqisiz toʻgʻri natija beradi.
//
// Xato qanday bildiriladi:
// - forma tekshiruvi xatosi → `Natija` ichida `xatolar` (`yozuvSaqla`);
// - bazaga tegishli xato (yozuv topilmadi, baza ochilmadi) → Promise rad etiladi (`Error`).

import { oxirgiKurs, yozuvlardanKurslar } from '../domain/kurs.ts'
import { qoldiqlar } from '../domain/qoldiq.ts'
import type {
  KursManbai,
  Natija,
  Qoldiqlar,
  YangiYozuv,
  Yozuv,
  YozuvFormasi,
} from '../domain/turlar.ts'
import { hozirYaratilgan } from '../domain/vaqt.ts'
import { yozuvniTekshir } from '../domain/yozuv.ts'
import { YOZUVLAR_OMBORI, idYarat, omborda } from './baza.ts'

export { bazaniTozala, bazaniYop } from './baza.ts'

/** Roʻyxat tartibi: yangi yozuvdan boshlab yoki eskisidan boshlab. */
export type Tartib = 'yangidan' | 'eskidan'

/** Tekshiruvdan oʻtgan yozuvni saqlaydi; id va `yaratilgan` shu yerda qoʻyiladi (0047). */
export async function yozuvQosh(yangi: YangiYozuv): Promise<Yozuv> {
  const yozuv: Yozuv = { ...yangi, id: idYarat(), yaratilgan: hozirYaratilgan() }
  await omborda(YOZUVLAR_OMBORI, 'readwrite', (ombor) => ombor.add(yozuv))
  return yozuv
}

/** Formani tekshiradi va toʻgʻri boʻlsa saqlaydi — forma uchun bitta qadam. */
export async function yozuvSaqla(forma: YozuvFormasi): Promise<Natija<Yozuv>> {
  const tekshirilgan = yozuvniTekshir(forma)
  if (!tekshirilgan.ok) {
    return tekshirilgan
  }
  return { ok: true, qiymat: await yozuvQosh(tekshirilgan.qiymat) }
}

/** Bitta yozuvni id boʻyicha oʻqiydi. Topilmasa `null`. */
export async function yozuvniOl(id: string): Promise<Yozuv | null> {
  const natija = await omborda<Yozuv | undefined>(YOZUVLAR_OMBORI, 'readonly', (ombor) =>
    ombor.get(id),
  )
  return natija ?? null
}

/**
 * Hamma yozuv sana boʻyicha tartiblangan holda qaytadi; bir kundagilar orasida
 * tartibni `yaratilgan` belgilaydi (0032, 0047; mezon 19).
 */
export async function hammaYozuvlar(tartib: Tartib = 'yangidan'): Promise<Yozuv[]> {
  const yozuvlar = await omborda<Yozuv[]>(YOZUVLAR_OMBORI, 'readonly', (ombor) => ombor.getAll())
  // `yangidan` — kechroq sana oldinda; `eskidan` — teskarisi.
  const yonalish = tartib === 'yangidan' ? -1 : 1
  return yozuvlar.sort((a, b) => {
    if (a.sana !== b.sana) {
      return a.sana < b.sana ? -yonalish : yonalish
    }
    if (a.yaratilgan !== b.yaratilgan) {
      return a.yaratilgan < b.yaratilgan ? -yonalish : yonalish
    }
    return 0
  })
}

/**
 * Yozuvni tahrirlaydi. `id` va `yaratilgan` oʻzgarmaydi (0047; mezon 23i),
 * qolgan maydonlar toʻliq almashadi — masalan dollardan soʻmga oʻtganda kurs yoʻqoladi.
 */
export async function yozuvniYangila(id: string, yangi: YangiYozuv): Promise<Yozuv> {
  const eski = await yozuvniOl(id)
  if (eski === null) {
    throw new Error(`Yozuv topilmadi: ${id}`)
  }
  const yozuv: Yozuv = { ...yangi, id: eski.id, yaratilgan: eski.yaratilgan }
  await omborda(YOZUVLAR_OMBORI, 'readwrite', (ombor) => ombor.put(yozuv))
  return yozuv
}

/**
 * Yozuvni darhol oʻchiradi va oʻchirilgan nusxani qaytaradi (0029).
 *
 * Qaytarilgan nusxa — «qaytarish» tugmasining butun holati: ekran uni bir necha soniya
 * ushlab turadi va bosilsa `yozuvniQaytar` ga beradi. Muddat tugasa nusxa tashlab
 * yuboriladi va oʻchirish yakuniy boʻladi (mezon 12). Bazada oʻchirilgan yozuv qolmaydi —
 * yashirin «axlat qutisi» yoʻq.
 */
export async function yozuvniOchir(id: string): Promise<Yozuv> {
  const yozuv = await yozuvniOl(id)
  if (yozuv === null) {
    throw new Error(`Yozuv topilmadi: ${id}`)
  }
  await omborda(YOZUVLAR_OMBORI, 'readwrite', (ombor) => ombor.delete(id))
  return yozuv
}

/** Oʻchirilgan yozuvni oʻsha id va `yaratilgan` bilan joyiga qaytaradi (mezon 11). */
export async function yozuvniQaytar(yozuv: Yozuv): Promise<Yozuv> {
  await omborda(YOZUVLAR_OMBORI, 'readwrite', (ombor) => ombor.put(yozuv))
  return yozuv
}

/** Yozuvning mustaqil nusxasi — «qaytarish» uchun ushlab turishga qulay. */
export function yozuvNusxasi(yozuv: Yozuv): Yozuv {
  return { ...yozuv }
}

/** Hisob × valyuta qoldiqlari — joriy yozuvlardan sanaladi (mezon 8, 9, 10). */
export async function qoldiqlarniOl(): Promise<Qoldiqlar> {
  return qoldiqlar(await hammaYozuvlar())
}

/**
 * «Oxirgi kurs» — yozuvlardan (va berilgan qoʻshimcha manbalardan) hisoblanadi (0044, 0045).
 *
 * `qoshimcha` — «≈ jami soʻmda» uchun qoʻlda soʻralgan kurslar va (T4 dan keyin) qarz
 * toʻlovlari kurslari. Birorta manba boʻlmasa `null` — u holda kurs soʻraladi (mezon 23g).
 */
export async function oxirgiKursniOl(
  qoshimcha: readonly KursManbai[] = [],
): Promise<number | null> {
  const yozuvlar = await hammaYozuvlar()
  return oxirgiKurs([...yozuvlardanKurslar(yozuvlar), ...qoshimcha])
}
