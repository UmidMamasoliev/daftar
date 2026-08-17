// Ekrandagi matnlar — bitta joyda.
//
// Hammasi `design/kirim-chiqim.md` dan AYNAN koʻchirilgan: dizayn fayli manba, bu yer nusxa.
// Matn oʻzgarsa avval dizayn fayli oʻzgaradi (AGENTS.md, 0009: oʻzbekcha lotin yozuvida).

import type { XatoKodi } from '../domain/turlar.ts'

/** «Yangi yozuv» formasidagi matnlar. */
export const FORMA = {
  sarlavhaYangi: 'Yangi yozuv',
  sarlavhaTahrir: 'Yozuvni tahrirlash',
  yopish: 'Yopish',
  summa: 'Summa',
  somSozi: 'soʻm',
  dollarBelgisi: '$',
  chiqim: 'Chiqim',
  kirim: 'Kirim',
  kategoriya: 'Kategoriya',
  boshqarish: 'Boshqarish',
  avvalTurTanlang: 'Avval kirim yoki chiqim tanlang.',
  kategoriyaYoq: 'Koʻrinadigan kategoriya yoʻq — «Boshqarish» dan bittasini koʻrsating.',
  hisob: 'Hisob',
  karta: 'Karta',
  naqd: 'Naqd',
  valyuta: 'Valyuta',
  somChipi: 'soʻm',
  dollarChipi: 'dollar',
  kurs: 'Kurs — 1 dollar necha soʻm',
  kursNamunasi: '12 500',
  sana: 'Sana',
  bugun: 'Bugun',
  kecha: 'Kecha',
  izoh: 'Izoh',
  izohNamunasi: 'Izoh (ixtiyoriy)',
  saqlash: 'Saqlash',
} as const

/**
 * Maydon ostida darhol chiqadigan qatorlar (dizayndagi «Xato holatlari» jadvali).
 *
 * Kasr belgisi maydonga umuman tushmaydi, shuning uchun bu qatorlar «Saqlash» ni
 * kutmaydi: ular yopishtirilgan matn yoki valyuta almashuvi natijasini tushuntiradi va
 * saqlashga toʻsqinlik qilmaydi. Maydon qayta terilishi bilan yoʻqoladi.
 */
export const OGOHLANTIRISH = {
  somdaKasrOlindi: 'Soʻmda tiyin yoʻq — kasr qismi olib tashlandi.',
  somdaKasrYoq: 'Soʻmda tiyin yoʻq — butun son kiriting.',
  kursKasrYoq: 'Kurs butun soʻmda kiritiladi.',
} as const

/**
 * Tekshiruv kodidan ekran matniga.
 *
 * KELISHUV.md 2-boʻlim: doʻkon oʻz `xabar` ini beradi, ekran esa kod boʻyicha oʻz matnini
 * qoʻyadi. Roʻyxatda yoʻq kod uchun doʻkonning xabari koʻrsatiladi — bunday kodga forma
 * maydoni filtrlangani uchun yetib borilmaydi (masalan `summa-notogri`).
 */
const EKRAN_MATNLARI: Partial<Record<XatoKodi, string>> = {
  'summa-bosh': 'Summani kiriting.',
  'summa-nol': 'Summa noldan katta boʻlsin.',
  'summa-kasr': 'Soʻmda tiyin yoʻq — butun son kiriting.',
  'turi-bosh': 'Kirim yoki chiqim ekanini tanlang.',
  'kategoriya-bosh': 'Kategoriyani tanlang.',
  'sana-kelajak': 'Sana bugundan keyin boʻlmaydi.',
  'kurs-bosh': 'Kursni kiriting — 1 dollar necha soʻm.',
  'kurs-kasr': 'Kurs butun soʻmda kiritiladi.',
  'kurs-musbat-emas': 'Kurs notoʻgʻri',
}

/** Xato kodiga mos ekran matni; topilmasa doʻkonning oʻz xabari. */
export function xatoMatni(kod: XatoKodi, zaxira: string): string {
  return EKRAN_MATNLARI[kod] ?? zaxira
}
