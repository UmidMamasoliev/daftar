// «Oxirgi kurs» — saqlanmaydi, har safar maʼlumotdan hisoblanadi (0045).
//
// Gʻolib kurs: eng kech `sana`li manba; sanalar teng boʻlsa — eng kech `yaratilgan`
// (yaʼni oʻsha kunning oxirgi kiritilgani) (0044, 0047).
// Manba: dollardagi yozuv, dollarli qarz toʻlovi (T4) va «≈ jami soʻmda» uchun qoʻlda
// soʻralgan kurs — uchalasi teng qatnashadi (0044). Qoʻlda kursning manba koʻrinishi
// ham shu yerda yasaladi (`qoldaKurslarManbalari`): qoida bitta joyda tursin.
//
// Shundan kelib chiqadi: kursli yozuv oʻchirilsa yoki tahrirlansa, qiymat oʻz-oʻzidan
// toʻgʻrilanadi — hech qayerda eski nusxa qolmaydi (0045; mezon 23e, 23f).

import type { KursManbai, Tolov, Yozuv } from './turlar.ts'
import type { QoldaKurslar } from './zaxira.ts'

/**
 * Qoʻlda soʻralgan kursning sintetik `yaratilgan` qiymati — «vaqti nomaʼlum, kun boshi».
 *
 * Qoʻlda kursning ortida yozuv yoʻq (0045), demak uning kiritilish vaqti saqlanmaydi va
 * zaxira fayliga ham kirmaydi (`prds/zaxira.md` 6b: faqat `kurs` va `sana`). Taqqos esa
 * `yaratilgan` ga faqat **sanalar teng** boʻlganda tushadi — shuning uchun bu qiymat oʻsha
 * kunning har qanday haqiqiy vaqtidan oldin turadi. 0044 talab qilgani shu: qoʻlda kurs oʻz
 * sanasidagi qiymat, oʻsha kunda **keyin** kiritilgan kurs uni almashtiradi.
 *
 * Nega `${sana}T00:00:00.000Z` emas: `sana` — mahalliy kun, `yaratilgan` — UTC (0047).
 * Toshkentda (UTC+5) tunda kiritilgan yozuvning UTC vaqti mahalliy kun boshidan oldin
 * turadi va kun boshi qoʻlda kursni notoʻgʻri gʻolib qilardi.
 */
const QOLDA_KURS_VAQTI = '0000-01-01T00:00:00.000Z'

/**
 * Qoʻlda soʻralgan kursni (0043) taqqos uchun manba qatoriga oʻgiradi — **yagona joy**.
 *
 * Doʻkon ham (`data/sozlamalar.ts`), ekran ham (`ui/kurslar.ts`) shu funksiyani chaqiradi:
 * bitta qiymat uchun ikkita sintetik vaqt qoidasi boʻlmasin.
 *
 * Soʻm asos valyuta — unga kurs yozilmaydi (`prds/oylik-hisobot.md` 10a).
 */
export function qoldaKurslarManbalari(kurslar: QoldaKurslar): KursManbai[] {
  const dollar = kurslar.dollar
  if (dollar === undefined) {
    return []
  }
  return [{ kurs: dollar.kurs, sana: dollar.sana, yaratilgan: QOLDA_KURS_VAQTI }]
}

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

/**
 * Qarz toʻlovlaridan kurs manbalarini ajratib oladi (spec 15b-band; 0044, 0045).
 *
 * Faqat boshqa valyutadagi toʻlovda kurs boʻladi — qarz valyutasidagi toʻlovda kurs
 * soʻralmaydi (mezon 12), demak u manbaga ham kirmaydi. Yozuv kursi bilan farqi yoʻq:
 * ikkalasi bir xil qoidada solishtiriladi.
 */
export function tolovlardanKurslar(tolovlar: readonly Tolov[]): KursManbai[] {
  const manbalar: KursManbai[] = []
  for (const tolov of tolovlar) {
    if (tolov.kurs !== undefined) {
      manbalar.push({ kurs: tolov.kurs, sana: tolov.sana, yaratilgan: tolov.yaratilgan })
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
