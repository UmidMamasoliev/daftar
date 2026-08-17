// Qoʻlda soʻralgan kursni «oxirgi kurs» taqqosiga qoʻshish (0043, 0044, 0045).
//
// Doʻkon kursni `{ kurs, sana }` boʻlib saqlaydi (`data/sozlamalar.ts`), «oxirgi kurs»
// taqqosi esa `KursManbai` ni kutadi — unda `yaratilgan` ham bor (0047). Shu ikkisi
// orasidagi oʻgirish bitta joyda turadi.

import type { KursManbai } from '../domain/turlar.ts'

/** Doʻkondagi koʻrinish: valyuta boʻyicha bitta qiymat, sanasi bilan (0043). */
export type QoldaKurslar = { dollar?: { kurs: number; sana: string } }

/**
 * Qoʻlda soʻralgan kursni manba qatoriga oʻgiradi.
 *
 * `yaratilgan` saqlanmaydi, shuning uchun kunning **boshi** olinadi. Sabab 0044 da:
 * «bir xil sanada oxirgi kiritilgani gʻolib». Qoʻlda soʻralgan kurs daftarda birorta
 * kurs boʻlmaganda soʻraladi, demak oʻsha kunda undan **keyin** kiritilgan kursli yozuv
 * yangiroq va gʻolib chiqishi kerak — kun boshi aynan shuni beradi.
 *
 * Soʻm asos valyuta: unga kurs yozilmaydi (spec 10a).
 */
export function qoldaKurslarManbalari(kurslar: QoldaKurslar): KursManbai[] {
  const dollar = kurslar.dollar
  if (dollar === undefined) {
    return []
  }
  return [{ kurs: dollar.kurs, sana: dollar.sana, yaratilgan: `${dollar.sana}T00:00:00.000Z` }]
}
