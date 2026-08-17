// Sana qoidasi: `YYYY-MM-DD`, faqat bugungi kun yoki undan oldin (0034).
// Bitta tekshiruv hamma joyda ishlatiladi: yozuv, qarz, qarz toʻlovi.

import type { Natija } from './turlar.ts'
import { ha, xato, yoq } from './turlar.ts'

const KORINISH = /^(\d{4})-(\d{2})-(\d{2})$/

/** Mahalliy bugungi kun, `YYYY-MM-DD`. */
export function bugun(): string {
  return kunMatni(new Date())
}

/** `Date` ni mahalliy `YYYY-MM-DD` ga oʻgiradi. */
export function kunMatni(vaqt: Date): string {
  const yil = String(vaqt.getFullYear()).padStart(4, '0')
  const oy = String(vaqt.getMonth() + 1).padStart(2, '0')
  const kun = String(vaqt.getDate()).padStart(2, '0')
  return `${yil}-${oy}-${kun}`
}

/** Sana taqvimda bormi (masalan 2026-02-30 — yoʻq). */
export function sanaBormi(matn: string): boolean {
  const mos = KORINISH.exec(matn)
  if (mos === null) {
    return false
  }
  const yil = Number(mos[1])
  const oy = Number(mos[2])
  const kun = Number(mos[3])
  const vaqt = new Date(yil, oy - 1, kun)
  return vaqt.getFullYear() === yil && vaqt.getMonth() === oy - 1 && vaqt.getDate() === kun
}

/**
 * Sanani tekshiradi: boʻsh emas, taqvimda bor va kelajakda emas (0034; mezon 4, 4a).
 * Sanalar bir xil koʻrinishda boʻlgani uchun taqqoslash matn boʻyicha ishlaydi.
 */
export function sananiTekshir(matn: string): Natija<string> {
  const tozalangan = matn.trim()
  if (tozalangan === '') {
    return yoq(xato('sana', 'sana-bosh', 'Sana kiritilmagan.'))
  }
  if (!sanaBormi(tozalangan)) {
    return yoq(xato('sana', 'sana-notogri', 'Sana YYYY-MM-DD koʻrinishida boʻlishi kerak.'))
  }
  if (tozalangan > bugun()) {
    return yoq(xato('sana', 'sana-kelajak', 'Kelajakdagi sana bilan yozuv saqlanmaydi.'))
  }
  return ha(tozalangan)
}
