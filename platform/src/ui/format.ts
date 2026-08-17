// Ekran formati va maydon filtrlari.
//
// Format qoidalari — `design/uslub.md` («Son, sana va valyuta formati»):
// sana `16-avgust`, bugungi va kechagi kun uchun soʻz; kurs mingliklari boʻsh joy bilan.
// Filtr qoidalari — `design/kirim-chiqim.md` («Xato holatlari»): notoʻgʻri belgi maydonga
// umuman tushmaydi (0033, 0042; mezon 4b, 4d, 22).

import { kunMatni } from '../domain/sana.ts'
import type { Valyuta } from '../domain/turlar.ts'
import { FORMA } from './matnlar.ts'

const OYLAR = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
] as const

/** Faqat raqam, vergul va nuqta qoladi: manfiy ishora va harf tushmaydi (mezon 4d). */
const KERAKSIZ = /[^\d.,]/g

/** Maydon qiymati va u haqidagi bitta xabar kerakmi. */
export type Shakl = { qiymat: string; kasrOlindi: boolean }

/** Sana tugmasidagi yozuv: «Bugun», «Kecha», `14-avgust`, `16-avgust 2025`. */
export function sanaYorligi(sana: string, bugungi: string): string {
  if (sana === bugungi) {
    return FORMA.bugun
  }
  if (sana === kechagiKun(bugungi)) {
    return FORMA.kecha
  }
  const qismlar = sana.split('-')
  const yil = qismlar[0] ?? ''
  const oy = Number(qismlar[1] ?? '0')
  const kun = Number(qismlar[2] ?? '0')
  const oyNomi = OYLAR[oy - 1] ?? ''
  const asos = `${kun}-${oyNomi}`
  return yil === bugungi.slice(0, 4) ? asos : `${asos} ${yil}`
}

/** Berilgan kundan bir kun oldingi kun, `YYYY-MM-DD`. */
function kechagiKun(bugungi: string): string {
  const qismlar = bugungi.split('-')
  const vaqt = new Date(
    Number(qismlar[0] ?? '0'),
    Number(qismlar[1] ?? '1') - 1,
    Number(qismlar[2] ?? '1'),
  )
  vaqt.setDate(vaqt.getDate() - 1)
  return kunMatni(vaqt)
}

/**
 * Summa maydoniga tushadigan qiymat.
 *
 * Soʻmda kasr yoʻq: kasr qismi kesiladi va `kasrOlindi` bilan bildiriladi (0033).
 * Dollarda ikki kasrgacha qoladi; kasr belgisi sifatida vergul koʻrsatiladi (uslub).
 */
export function summaniShakllantir(xom: string, valyuta: Valyuta): Shakl {
  const { butun, kasr, kasrBor } = qismlarga(xom)
  if (valyuta === 'som') {
    return { qiymat: butun, kasrOlindi: kasr !== '' }
  }
  if (!kasrBor) {
    return { qiymat: butun, kasrOlindi: false }
  }
  return { qiymat: `${butun},${kasr.slice(0, 2)}`, kasrOlindi: false }
}

/**
 * Kurs maydoniga tushadigan qiymat: butun soʻm, mingliklari boʻsh joy bilan (0042).
 * Kasr belgisi umuman tushmaydi; kasr qismi boʻlsa `kasrOlindi` bilan bildiriladi.
 */
export function kursniShakllantir(xom: string): Shakl {
  const { butun, kasr } = qismlarga(xom)
  return { qiymat: minglikBoshliq(butun), kasrOlindi: kasr !== '' }
}

/** Mingliklarni boʻsh joy bilan ajratadi: `1250000` → `1 250 000`. */
export function minglikBoshliq(raqamlar: string): string {
  return raqamlar.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** Xom matnni butun va kasr qismiga ajratadi; keraksiz belgilar tashlanadi. */
function qismlarga(xom: string): { butun: string; kasr: string; kasrBor: boolean } {
  const faqatRaqam = xom.replace(KERAKSIZ, '').replace(/\./g, ',')
  const birinchi = faqatRaqam.indexOf(',')
  if (birinchi === -1) {
    return { butun: faqatRaqam, kasr: '', kasrBor: false }
  }
  return {
    butun: faqatRaqam.slice(0, birinchi),
    kasr: faqatRaqam.slice(birinchi + 1).replace(/,/g, ''),
    kasrBor: true,
  }
}
