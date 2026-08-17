// Sozlamalar doʻkoni: daftarning **yagona qiymatlari** (kalit/qiymat).
//
// Ikkitasi bor va ikkalasi ham zaxira fayliga kiradi:
// - `oxirgi-eksport` — oxirgi muvaffaqiyatli eksport sanasi (0053, 0054);
// - `kurslar` — «≈ jami soʻmda» uchun qoʻlda soʻralgan kurs, sanasi bilan (0043, 0045).
//
// Nega alohida ombor: bular yozuv emas, hisoblanadigan qiymat ham emas. Qoʻlda soʻralgan
// kursning ortida yozuv yoʻq (0045), shuning uchun uni saqlaydigan joy kerak; oxirgi
// eksport sanasi ham xuddi shunday. Ikkalasi import bilan toʻliq almashadi.

import type { QoldaKurslar } from '../domain/zaxira.ts'
import { SOZLAMALAR_OMBORI, omborda } from './baza.ts'

/** Ombordagi qator: kalit va uning qiymati. */
type Sozlama = { kalit: string; qiymat: unknown }

const OXIRGI_EKSPORT = 'oxirgi-eksport'
const KURSLAR = 'kurslar'

async function oqi<T>(kalit: string): Promise<T | null> {
  const qator = await omborda<Sozlama | undefined>(SOZLAMALAR_OMBORI, 'readonly', (ombor) =>
    ombor.get(kalit),
  )
  return qator === undefined ? null : (qator.qiymat as T)
}

async function yoz(kalit: string, qiymat: unknown): Promise<void> {
  await omborda(SOZLAMALAR_OMBORI, 'readwrite', (ombor) => ombor.put({ kalit, qiymat }))
}

/**
 * Oxirgi muvaffaqiyatli eksport sanasi (`YYYY-MM-DD`) yoki `null` — daftar hech qachon
 * eksport qilinmagan (mezon 11; 0024 dagi eslatma shundan sanaladi).
 */
export async function oxirgiEksportniOl(): Promise<string | null> {
  return oqi<string>(OXIRGI_EKSPORT)
}

/** Sanani yozadi. Har muvaffaqiyatli eksport chaqiradi — avtomatik zaxira ham (0054). */
export async function oxirgiEksportniQoy(sana: string): Promise<string> {
  await yoz(OXIRGI_EKSPORT, sana)
  return sana
}

/** Qoʻlda soʻralgan kurslar. Hech qachon soʻralmagan boʻlsa boʻsh obyekt (0043). */
export async function qoldaKurslarniOl(): Promise<QoldaKurslar> {
  return (await oqi<QoldaKurslar>(KURSLAR)) ?? {}
}

/** Butun blokni almashtiradi — import shu yoʻldan yuradi (spec 21a). */
export async function qoldaKurslarniQoy(kurslar: QoldaKurslar): Promise<QoldaKurslar> {
  await yoz(KURSLAR, kurslar)
  return kurslar
}

/**
 * Foydalanuvchidan soʻralgan dollar kursini sanasi bilan saqlaydi (0043).
 * Soʻm asos valyuta — unga kurs yozilmaydi (spec 10a).
 */
export async function qoldaKursniQoy(kurs: number, sana: string): Promise<QoldaKurslar> {
  return qoldaKurslarniQoy({ dollar: { kurs, sana } })
}
