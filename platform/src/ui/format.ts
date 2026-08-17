// Ekran formati va maydon filtrlari.
//
// Format qoidalari — `design/uslub.md`:
// «Son, sana va valyuta formati» (koʻrsatish) va «Maydonda terish paytidagi format»
// (terish). Filtr qoidalari — `design/kirim-chiqim.md` («Summa maydoni — terish qoidalari»,
// «Xato holatlari»): notoʻgʻri belgi maydonga umuman tushmaydi (0033, 0042; mezon 4b, 4d, 22).

import { kunMatni } from '../domain/sana.ts'
import type { Hisob, Valyuta, YozuvTuri } from '../domain/turlar.ts'
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

/** Raqam yoki kasr belgisi — kursor oʻrni shu belgilar boʻyicha sanaladi. */
const SANALADIGAN = /[\d.,]/

/** Kirim `+`, chiqim `−` (U+2212) — uslub: «Kirim va chiqim qanday ajratiladi». */
const ISHORA = { kirim: '+', chiqim: '−' } as const

/** Maydon qiymati va kasr qismi kesilgani haqidagi bildirish. */
export type Shakl = { qiymat: string; kasrOlindi: boolean }

/** Sana tugmasidagi va kun sarlavhasidagi yozuv: «Bugun», «Kecha», `14-avgust`. */
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
 * Summa maydoniga tushadigan qiymat (uslub: «Maydonda terish paytidagi format»).
 *
 * Mingliklar boʻsh joy bilan ajratiladi — ajratish faqat butun qismga tegadi.
 * Soʻmda kasr yoʻq: kasr qismi **kesiladi** (yaxlitlanmaydi) va `kasrOlindi` bilan
 * bildiriladi (0033). Dollarda odam tergan kasr qismi oʻzgarmaydi, ikki raqamdan
 * ortigʻi maydonga tushmaydi.
 */
export function summaniShakllantir(xom: string, valyuta: Valyuta): Shakl {
  const { butun, kasr, kasrBor } = qismlarga(xom)
  const boshi = minglikBoshliq(butun)
  if (valyuta === 'som') {
    return { qiymat: boshi, kasrOlindi: kasr !== '' }
  }
  if (!kasrBor) {
    return { qiymat: boshi, kasrOlindi: false }
  }
  return { qiymat: `${boshi},${kasr.slice(0, 2)}`, kasrOlindi: false }
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

/** Kursordan chapdagi sanaladigan belgilar (raqam va kasr belgisi) soni. */
export function belgilarSoni(matn: string): number {
  return matn.replace(KERAKSIZ, '').length
}

/**
 * Format qayta qoʻyilgach kursor turadigan oʻrin: `belgiSoni` ta sanaladigan belgidan
 * keyin (uslub: ajratgich boʻsh joylari sanalmaydi).
 */
export function kursorOrni(qiymat: string, belgiSoni: number): number {
  if (belgiSoni <= 0) {
    return 0
  }
  let sanoq = 0
  for (let orin = 0; orin < qiymat.length; orin += 1) {
    if (sanaladiganmi(qiymat[orin])) {
      sanoq += 1
      if (sanoq === belgiSoni) {
        return orin + 1
      }
    }
  }
  return qiymat.length
}

function sanaladiganmi(belgi: string | undefined): boolean {
  return belgi !== undefined && SANALADIGAN.test(belgi)
}

/**
 * Roʻyxatdagi summa: ishora + son + valyuta (uslub: «Son, sana va valyuta formati»).
 * `−45 000 soʻm`, `+12,50 $`. Ajratish faqat butun qismga tegadi.
 */
export function summaKorinishi(yozuv: {
  turi: YozuvTuri
  summa: number
  valyuta: Valyuta
}): string {
  const ishora = ISHORA[yozuv.turi]
  if (yozuv.valyuta === 'som') {
    return `${ishora}${minglikBoshliq(String(yozuv.summa))} ${FORMA.somSozi}`
  }
  const butun = Math.floor(yozuv.summa / 100)
  const sent = yozuv.summa - butun * 100
  return `${ishora}${minglikBoshliq(String(butun))},${String(sent).padStart(2, '0')} ${FORMA.dollarBelgisi}`
}

/** Hisob nomi ekranda: «Karta», «Naqd» (0011). */
export function hisobNomi(hisob: Hisob): string {
  return hisob === 'karta' ? FORMA.karta : FORMA.naqd
}

/** Qatorning ikkinchi qatori: `Karta · nonushta`; izoh boʻsh boʻlsa faqat hisob nomi. */
export function qatorIzohi(hisob: Hisob, izoh: string | undefined): string {
  const nom = hisobNomi(hisob)
  const tozalangan = (izoh ?? '').trim()
  return tozalangan === '' ? nom : `${nom} · ${tozalangan}`
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
