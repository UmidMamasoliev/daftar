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
  tanlanganYashirildi: 'Tanlangan kategoriya yashirildi — boshqasini tanlang.',
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
 * Maydon ostida darhol chiqadigan qatorlar (dizayn: «Summa maydoni — terish qoidalari»).
 *
 * Kasr belgisi maydonga umuman tushmaydi, shuning uchun bu qatorlar «Saqlash» ni
 * kutmaydi: ular yopishtirilgan matn yoki valyuta almashuvi natijasini tushuntiradi.
 * Ikkalasi ham **xato emas** (uslub: «Yordam matni»): ilova qiymatni oʻzi toʻgʻrilagan,
 * shuning uchun maydon qizil boʻlmaydi va saqlash toʻxtamaydi. `somdaKasrOlindi` ni
 * yopishtirish ham, «dollar» dan «soʻm» ga oʻtish ham bitta matn bilan ishlatadi.
 */
export const OGOHLANTIRISH = {
  somdaKasrOlindi: 'Soʻmda tiyin yoʻq — kasr qismi olib tashlandi.',
  kursKasrOlindi: 'Kurs butun soʻmda — kasr qismi olib tashlandi.',
} as const

/** «Kategoriyalar» (boshqaruv) ekranidagi matnlar (dizayn: 3-boʻlim). */
export const KATEGORIYALAR = {
  sarlavha: 'Kategoriyalar',
  orqaga: '‹ Orqaga',
  yashirish: 'Yashirish',
  korsatish: 'Koʻrsatish',
  yashirilganlar: 'Yashirilgan',
  yangi: '＋ Yangi kategoriya',
  nom: 'Kategoriya nomi',
  qoshish: 'Qoʻshish',
  yopish: 'Yopish',
  boshBirinchi: 'Bu roʻyxatda koʻrinadigan kategoriya qolmadi.',
  boshIkkinchi: 'Yashirilganini «Koʻrsatish» bilan qaytaring yoki yangisini qoʻshing.',
} as const

/** «Yozuvlar» ekranidagi matnlar (dizayn: 2-boʻlim). */
export const YOZUVLAR = {
  sarlavha: 'Yozuvlar',
  orqaga: '‹ Orqaga',
  ochirish: 'Oʻchirish',
  ochirildi: 'Yozuv oʻchirildi',
  qaytarish: 'QAYTARISH',
  boshBirinchi: 'Hali bitta ham yozuv yoʻq.',
  boshIkkinchi: 'Birinchi yozuvni bosh sahifadagi «＋ Yozuv» tugmasi bilan qoʻshasiz.',
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
  'turi-bosh': 'Kirim yoki chiqim ekanini tanlang.',
  'kategoriya-bosh': 'Kategoriyani tanlang.',
  'sana-kelajak': 'Sana bugundan keyin boʻlmaydi.',
  'kurs-bosh': 'Kursni kiriting — 1 dollar necha soʻm.',
  'kurs-musbat-emas': 'Kurs notoʻgʻri',
  // Kategoriya nomi (0051): band nom uchun ikki xil matn — koʻrinib turgani va
  // yashirilgani. Yashirilganiga yoʻnaltiruvchi matn beriladi, chunki odam uni
  // roʻyxatda koʻrmaydi va qaytarish yoʻlini bilmaydi.
  'kategoriya-nom-bosh': 'Nom kiriting.',
  'kategoriya-takror': 'Bunday kategoriya bor.',
  'kategoriya-yashirilgan':
    'Bunday kategoriya yashirilgan — pastdagi Yashirilgan roʻyxatidan Koʻrsatish tugmasi bilan qaytaring.',
}

/** Xato kodiga mos ekran matni; topilmasa doʻkonning oʻz xabari. */
export function xatoMatni(kod: XatoKodi, zaxira: string): string {
  return EKRAN_MATNLARI[kod] ?? zaxira
}
