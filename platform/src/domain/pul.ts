// Pul yadrosi: summa va kursni matndan oʻqish, valyutani aylantirish.
//
// Pul butun sonda saqlanadi — soʻm soʻmda, dollar sentda (0008, 0033).
// Kurs — «1 dollar necha soʻm», butun soʻmda (0023, 0042).
// Aylantirishda natija eng yaqin butun birlikka yaxlitlanadi (0042).

import type { Natija, Valyuta } from './turlar.ts'
import { ha, xato, yoq } from './turlar.ts'

/** Har xil boʻshliqlar (oddiy, uzilmas, tor uzilmas) — odam «12 500» deb yozadi. */
const BOSHLIQLAR = /[\s   ]/g

/** Butun qism va (ixtiyoriy) kasr qismi. */
const RAQAM = /^(\d+)(?:[.,](\d+))?$/

type Oqilgan = { butun: string; kasr: string }

/** Matnni tozalab, butun va kasr qismiga ajratadi. `null` — umuman raqam emas. */
function raqamniAjrat(matn: string): { manfiy: boolean; qism: Oqilgan | null } {
  const tozalangan = matn.replace(BOSHLIQLAR, '')
  const manfiy = tozalangan.startsWith('-')
  const sonsiz = manfiy ? tozalangan.slice(1) : tozalangan
  const mos = RAQAM.exec(sonsiz)
  if (mos === null) {
    return { manfiy, qism: null }
  }
  return { manfiy, qism: { butun: mos[1] ?? '', kasr: mos[2] ?? '' } }
}

/**
 * Summani matndan oʻqiydi va eng kichik birlikdagi butun songa aylantiradi.
 *
 * Soʻmda kasr qabul qilinmaydi; dollarda ikki kasrgacha qabul qilinadi va sentga
 * aylantiriladi. Nol va manfiy summa saqlanmaydi (0033; mezon 4b, 4c, 4d).
 */
export function summaniOqi(matn: string, valyuta: Valyuta): Natija<number> {
  const tozalangan = matn.replace(BOSHLIQLAR, '')
  if (tozalangan === '') {
    return yoq(xato('summa', 'summa-bosh', 'Summa kiritilmagan.'))
  }

  const { manfiy, qism } = raqamniAjrat(matn)
  if (qism === null) {
    return yoq(xato('summa', 'summa-notogri', 'Summa faqat raqamdan iborat boʻlishi kerak.'))
  }
  if (manfiy) {
    return yoq(xato('summa', 'summa-manfiy', 'Manfiy summa kiritilmaydi — kirim yoki chiqimni tanlang.'))
  }

  if (valyuta === 'som') {
    if (qism.kasr !== '') {
      return yoq(xato('summa', 'summa-kasr', 'Soʻmda tiyin kiritilmaydi — butun son yozing.'))
    }
    return butunSonNatijasi(Number(qism.butun))
  }

  if (qism.kasr.length > 2) {
    return yoq(xato('summa', 'summa-kop-kasr', 'Dollarda ikki kasrgacha kiritiladi (sent).'))
  }
  const sent = Number(qism.butun) * 100 + Number(qism.kasr.padEnd(2, '0') || '0')
  return butunSonNatijasi(sent)
}

/** Nolni va hisoblab boʻlmaydigan katta sonni ushlaydi. */
function butunSonNatijasi(qiymat: number): Natija<number> {
  if (!Number.isSafeInteger(qiymat)) {
    return yoq(xato('summa', 'summa-notogri', 'Summa juda katta.'))
  }
  if (qiymat === 0) {
    return yoq(xato('summa', 'summa-nol', 'Nol summali yozuv saqlanmaydi.'))
  }
  return ha(qiymat)
}

/**
 * Kursni matndan oʻqiydi: «1 dollar necha soʻm», butun soʻmda (0023, 0042; mezon 22).
 */
export function kursniOqi(matn: string): Natija<number> {
  const tozalangan = matn.replace(BOSHLIQLAR, '')
  if (tozalangan === '') {
    return yoq(xato('kurs', 'kurs-bosh', 'Dollar tanlanganda kurs majburiy.'))
  }

  const { manfiy, qism } = raqamniAjrat(matn)
  if (qism === null) {
    return yoq(xato('kurs', 'kurs-notogri', 'Kurs faqat raqamdan iborat boʻlishi kerak.'))
  }
  if (qism.kasr !== '') {
    return yoq(xato('kurs', 'kurs-kasr', 'Kurs butun soʻmda kiritiladi — kasr qabul qilinmaydi.'))
  }

  const qiymat = Number(qism.butun)
  if (!Number.isSafeInteger(qiymat)) {
    return yoq(xato('kurs', 'kurs-notogri', 'Kurs juda katta.'))
  }
  if (manfiy || qiymat === 0) {
    return yoq(xato('kurs', 'kurs-musbat-emas', 'Kurs noldan katta boʻlishi kerak.'))
  }
  return ha(qiymat)
}

/** Manfiy boʻlmagan butun sonlarni eng yaqiniga boʻladi (yarim — yuqoriga). */
function engYaqiniga(bolinuvchi: number, bolgich: number): number {
  const butun = Math.floor(bolinuvchi / bolgich)
  const qoldiq = bolinuvchi - butun * bolgich
  return qoldiq * 2 >= bolgich ? butun + 1 : butun
}

/**
 * Aylantirish xavfsiz butun son chegarasiga sigadimi (1a1, 1a2; mezon 4g).
 *
 * Summaning oʻzi ham, kursning oʻzi ham chegaraga sigishi mumkin, lekin ularning
 * koʻpaytmasi sigmasligi mumkin — oʻshanda natija jimgina notoʻgʻri raqamga aylanadi.
 * Tekshiruv aynan **koʻpaytmaga** qoʻyiladi: boʻlishdan oldingi qadam aniq boʻlmasa,
 * yaxlitlash ham notoʻgʻri chiqadi.
 *
 * Bu yerda turishining sababi: dollardagi yozuv, qarz va qarz toʻlovi — hammasi shu
 * aylantirishdan oʻtadi, demak chegara bitta joyda yopiladi.
 */
export function dollarSomgaSigadimi(sent: number, kurs: number): boolean {
  return Number.isSafeInteger(sent * kurs)
}

/** Teskari yoʻnalish: soʻm sentga koʻpaytirilganda chegaraga sigadimi (mezon 4g). */
export function somDollargaSigadimi(som: number): boolean {
  return Number.isSafeInteger(som * 100)
}

/**
 * Dollardagi summani (sent) soʻmga aylantiradi: sent × kurs / 100,
 * natija eng yaqin soʻmga yaxlitlanadi (0042; mezon 21).
 *
 * Chaqiruvchi avval `dollarSomgaSigadimi` bilan tekshiradi: sigmagan qiymat bu yerda
 * xatosiz, lekin notoʻgʻri natija berardi.
 */
export function dollarniSomga(sent: number, kurs: number): number {
  return engYaqiniga(sent * kurs, 100)
}

/**
 * Soʻmdagi summani dollarga aylantiradi: soʻm × 100 / kurs,
 * natija eng yaqin sentga yaxlitlanadi (0042).
 *
 * Chaqiruvchi avval `somDollargaSigadimi` bilan tekshiradi.
 */
export function somniDollarga(som: number, kurs: number): number {
  return engYaqiniga(som * 100, kurs)
}

/**
 * Saqlangan summani forma maydoni uchun matnga oʻgiradi (tahrirlashda kerak).
 * Koʻrsatish formati — ekran ishi; bu yerda faqat aylanma qiymat.
 */
export function summaniMatnga(summa: number, valyuta: Valyuta): string {
  if (valyuta === 'som') {
    return String(summa)
  }
  const butun = Math.floor(summa / 100)
  const sent = summa - butun * 100
  return `${butun}.${String(sent).padStart(2, '0')}`
}
