// Kirim-chiqim yozuvlari doʻkoni: saqlash, oʻqish, tahrirlash, oʻchirish va qaytarish.
//
// Qoldiq va «oxirgi kurs» bu yerda SAQLANMAYDI — ular har safar yozuvlardan hisoblanadi
// (0045; mezon 10, 11, 23e, 23f). Shuning uchun tahrir va oʻchirish qoʻshimcha yangilash
// mantiqisiz toʻgʻri natija beradi.
//
// Xato qanday bildiriladi:
// - forma tekshiruvi xatosi → `Natija` ichida `xatolar` (`yozuvSaqla`);
// - bazaga tegishli xato (yozuv topilmadi, baza ochilmadi) → Promise rad etiladi (`Error`).

import {
  oxirgiKurs,
  qoldaKurslarManbalari,
  tolovlardanKurslar,
  yozuvlardanKurslar,
} from '../domain/kurs.ts'
import { qoldiqlar, qoldiqlarniQosh } from '../domain/qoldiq.ts'
import type {
  Kategoriya,
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
import { hammaTolovlar, qarzQoldiqlariniOl } from './qarzlar.ts'
import { qoldaKurslarniOl } from './sozlamalar.ts'

export { bazaniTozala, bazaniYop } from './baza.ts'

/** Roʻyxat tartibi: yangi yozuvdan boshlab yoki eskisidan boshlab. */
export type Tartib = 'yangidan' | 'eskidan'

/** Tekshiruvdan oʻtgan yozuvni saqlaydi; id va `yaratilgan` shu yerda qoʻyiladi (0047). */
export async function yozuvQosh(yangi: YangiYozuv): Promise<Yozuv> {
  const yozuv: Yozuv = { ...yangi, id: idYarat(), yaratilgan: hozirYaratilgan() }
  await omborda(YOZUVLAR_OMBORI, 'readwrite', (ombor) => ombor.add(yozuv))
  return yozuv
}

/**
 * Formani tekshiradi va toʻgʻri boʻlsa saqlaydi — forma uchun bitta qadam.
 *
 * `kategoriyalar` — ixtiyoriy: berilsa, kategoriya turi yozuv turiga mos kelishi ham
 * tekshiriladi (mezon 16). Roʻyxatni ekran beradi, chunki qaysi roʻyxat toʻgʻri
 * kelishini oʻsha biladi (yangi yozuv — koʻrinadiganlar, tahrir — hammasi).
 */
export async function yozuvSaqla(
  forma: YozuvFormasi,
  kategoriyalar?: readonly Kategoriya[],
): Promise<Natija<Yozuv>> {
  const tekshirilgan = yozuvniTekshir(forma, kategoriyalar)
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

/**
 * Hisob × valyuta qoldiqlari — joriy yozuvlar **va** qarz daftaridan sanaladi
 * (mezon 8, 9, 10; qarz daftari mezon 13–15b).
 *
 * Qarz pul qoldigʻiga taʼsir qiladi (0017): qarzga berilgan pul qoʻldan chiqadi,
 * olingani qoʻlga kiradi, toʻlov teskari yoʻnalishda ishlaydi. Shuning uchun bu
 * funksiya qarz daftarini ham qoʻshadi — ekran ikki manbani oʻzi qoʻshib yurmasin.
 */
export async function qoldiqlarniOl(): Promise<Qoldiqlar> {
  return qoldiqlarniQosh(qoldiqlar(await hammaYozuvlar()), await qarzQoldiqlariniOl())
}

/**
 * «Oxirgi kurs» — yozuvlar, qarz toʻlovlari va berilgan qoʻshimcha manbalardan
 * hisoblanadi (0044, 0045; qarz speci 15b-band).
 *
 * Uchala manba avtomatik qatnashadi: yozuv kurslari, qarz toʻlovlari kurslari va
 * **qoʻlda soʻralgan kurs** (0043 — `sozlamalar` omborida, sanasi bilan saqlanadi).
 * Qarzning oʻzida kurs yoʻq, demak u manba emas. Birorta manba boʻlmasa `null` — u holda
 * kurs foydalanuvchidan soʻraladi (mezon 23g; zaxira mezon 24a–24d).
 *
 * `qoshimcha` — hali saqlanmagan qiymatni sinab koʻrish uchun (masalan forma ichida).
 */
export async function oxirgiKursniOl(
  qoshimcha: readonly KursManbai[] = [],
): Promise<number | null> {
  const yozuvlar = await hammaYozuvlar()
  const tolovlar = await hammaTolovlar()
  // Qoʻlda kursning manba koʻrinishi domenda, bitta joyda yasaladi (0044; mezon 23d):
  // oʻsha kunda keyin kiritilgan yozuv yoki toʻlov kursi uni almashtiradi.
  const qolda = qoldaKurslarManbalari(await qoldaKurslarniOl())
  return oxirgiKurs([
    ...yozuvlardanKurslar(yozuvlar),
    ...tolovlardanKurslar(tolovlar),
    ...qolda,
    ...qoshimcha,
  ])
}
