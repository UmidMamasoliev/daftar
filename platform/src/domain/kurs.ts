// «Oxirgi kurs» — saqlanmaydi, har safar maʼlumotdan hisoblanadi (0045).
//
// Gʻolib kurs: eng kech `sana`li manba; sanalar teng boʻlsa — eng kech `yaratilgan`
// (yaʼni oʻsha kunning oxirgi kiritilgani) (0044, 0047).
// Manba: dollardagi yozuv, dollarli qarz toʻlovi (T4) va «≈ jami soʻmda» uchun qoʻlda
// soʻralgan kurs — uchalasi teng qatnashadi (0044).
//
// Shundan kelib chiqadi: kursli yozuv oʻchirilsa yoki tahrirlansa, qiymat oʻz-oʻzidan
// toʻgʻrilanadi — hech qayerda eski nusxa qolmaydi (0045; mezon 23e, 23f).

import type { KursManbai, Yozuv } from './turlar.ts'

/** Dollardagi yozuvlardan kurs manbalarini ajratib oladi. */
export function yozuvlardanKurslar(yozuvlar: readonly Yozuv[]): KursManbai[] {
  const manbalar: KursManbai[] = []
  for (const yozuv of yozuvlar) {
    if (yozuv.valyuta === 'dollar') {
      manbalar.push({ kurs: yozuv.kurs, sana: yozuv.sana, yaratilgan: yozuv.yaratilgan })
    }
  }
  return manbalar
}

/** `a` `b` dan kechroqmi (avval sana, keyin yaratilgan). */
function kechroq(a: KursManbai, b: KursManbai): boolean {
  if (a.sana !== b.sana) {
    return a.sana > b.sana
  }
  return a.yaratilgan > b.yaratilgan
}

/**
 * Gʻolib kursni topadi. Birorta manba boʻlmasa `null` — bu holatda kurs
 * foydalanuvchidan soʻraladi (0023; mezon 23g).
 */
export function oxirgiKurs(manbalar: readonly KursManbai[]): number | null {
  let golib: KursManbai | null = null
  for (const manba of manbalar) {
    if (golib === null || kechroq(manba, golib)) {
      golib = manba
    }
  }
  return golib === null ? null : golib.kurs
}
