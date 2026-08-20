// Ekrandagi matnlar — bitta joyda.
//
// Hammasi `design/kirim-chiqim.md`, `design/qarz-daftari.md` va `design/uslub.md` dan
// AYNAN koʻchirilgan: dizayn fayllari manba, bu yer nusxa. Matn oʻzgarsa avval dizayn
// fayli oʻzgaradi (AGENTS.md, 0009: oʻzbekcha lotin yozuvida).

import type { Hisob, QarzYonalishi, XatoKodi } from '../domain/turlar.ts'

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

/** Hamma ekranda bir xil matnlar. */
export const UMUMIY = {
  orqaga: '‹ Orqaga',
  ochirish: 'Oʻchirish',
  qaytarish: 'QAYTARISH',
  yopish: 'Yopish',
} as const

/** «Yozuvlar» ekranidagi matnlar (dizayn: `design/kirim-chiqim.md` 2-boʻlim). */
export const YOZUVLAR = {
  sarlavha: 'Yozuvlar',
  ochirish: UMUMIY.ochirish,
  ochirildi: 'Yozuv oʻchirildi',
  qaytarish: UMUMIY.qaytarish,
  boshBirinchi: 'Hali bitta ham yozuv yoʻq.',
  boshIkkinchi: 'Birinchi yozuvni bosh sahifadagi «＋ Yozuv» tugmasi bilan qoʻshasiz.',
} as const

/**
 * Bosh sahifa (dashboard) matnlari — spec `specs/001-dashboard/spec.md`, 0067.
 *
 * Sarlavha «Daftar»: bosh sahifa ilovaning oʻzi; navigatsiya bandi esa qisqa «Bosh».
 * Eslatma matni bir qatorlik va bosilmaydi (0024; spec Assumptions) — «Zaxira» boʻlimiga
 * yoʻlni soʻz bilan koʻrsatadi.
 */
export const DASHBOARD = {
  sarlavha: 'Daftar',
  qoldiq: 'Qoldiq',
  joriyOy: 'Joriy oy',
  kirim: 'Kirim',
  chiqim: 'Chiqim',
  oxirgiYozuvlar: 'Oxirgi yozuvlar',
  hammasi: 'Hammasi ›',
  yangiYozuv: '＋ Yozuv',
  boshBirinchi: YOZUVLAR.boshBirinchi,
  boshIkkinchi: 'Birinchi yozuvni pastdagi «＋ Yozuv» tugmasi bilan qoʻshasiz.',
  eslatmaHech: 'Daftar hali zaxira qilinmagan — «Zaxira» boʻlimidan eksport qiling.',
  eslatmaEski: 'Oxirgi zaxiradan 30 kun oʻtdi — «Zaxira» boʻlimidan yangisini oling.',
} as const

/**
 * Pastki navigatsiya paneli (`design/uslub.md`).
 *
 * Dashboard bosh sahifa (0063 → spec 001-dashboard FR-013, 0067): «Yozuv» bandi yoʻq,
 * yozuv qoʻshish bosh sahifadagi «＋ Yozuv» tugmasidan.
 */
export const NAVIGATSIYA = {
  yorliq: 'Boʻlimlar',
  bosh: 'Bosh',
  yozuvlar: 'Yozuvlar',
  qarzDaftari: 'Qarz daftari',
  hisobot: 'Hisobot',
  zaxira: 'Zaxira',
} as const

/** Netto qatoridagi soʻzlar (dizayn: `design/qarz-daftari.md` 0-boʻlim; 0037, 0056). */
export const NETTO = {
  olaman: 'olaman',
  beraman: 'beraman',
  hisobTeng: 'hisob teng',
} as const

/** «Qarz daftari» — kontaktlar roʻyxati (dizayn: `design/qarz-daftari.md` 1-boʻlim). */
export const QARZ_DAFTARI = {
  sarlavha: 'Qarz daftari',
  yangiKontakt: '＋ Yangi kontakt',
  ism: 'Ism',
  telefon: 'Telefon (ixtiyoriy)',
  qoshish: 'Qoʻshish',
  yopish: UMUMIY.yopish,
  qaytarish: UMUMIY.qaytarish,
  ochirildi: 'Kontakt oʻchirildi',
  boshBirinchi: 'Hali bitta ham kontakt yoʻq.',
  boshIkkinchi:
    'Qarz yozish uchun avval kontakt qoʻshing — pastdagi «＋ Yangi kontakt» tugmasi bilan.',
} as const

/** Kontakt sahifasi (dizayn: `design/qarz-daftari.md` 2-boʻlim). */
export const KONTAKT = {
  orqaga: UMUMIY.orqaga,
  tahrirlash: 'Tahrirlash',
  saqlash: 'Saqlash',
  ism: 'Ism',
  telefon: 'Telefon (ixtiyoriy)',
  yopish: UMUMIY.yopish,
  yangiQarz: '＋ Yangi qarz',
  yangiTolov: '＋ Toʻlov',
  berdim: 'Berdim',
  oldim: 'Oldim',
  yopilgan: 'Yopilgan',
  yopilganQarzlar: 'Yopilgan qarzlar',
  boshlangich: 'boshlangʻich',
  tolovYoq: 'Hali toʻlov yoʻq.',
  ochiqQarzYoq: 'Ochiq qarz yoʻq.',
  ochirish: UMUMIY.ochirish,
  qaytarish: UMUMIY.qaytarish,
  kontaktniOchirish: 'Kontaktni oʻchirish',
  qarzOchirildi: 'Qarz oʻchirildi',
  tolovOchirildi: 'Toʻlov oʻchirildi',
  boshBirinchi: 'Bu kontaktda hali qarz yoʻq.',
  boshIkkinchi: 'Birinchi qarzni pastdagi «＋ Yangi qarz» tugmasi bilan qoʻshasiz.',
} as const

/** «Yangi qarz» / «Qarzni tahrirlash» formasi (dizayn: 3-boʻlim). */
export const QARZ_FORMA = {
  sarlavhaYangi: 'Yangi qarz',
  sarlavhaTahrir: 'Qarzni tahrirlash',
  yopish: UMUMIY.yopish,
  summa: 'Summa',
  yonalish: 'Yoʻnalish',
  berdim: 'Berdim',
  oldim: 'Oldim',
  valyutaMuzlatilgan:
    'Toʻlovi bor qarzda valyuta oʻzgarmaydi — avval toʻlovlarni oʻchiring.',
  saqlash: 'Saqlash',
} as const

/** «Toʻlov» formasi (dizayn: 4-boʻlim). */
export const TOLOV_FORMA = {
  sarlavha: 'Toʻlov',
  yopish: UMUMIY.yopish,
  summa: 'Summa',
  saqlash: 'Saqlash',
} as const

/** «Hisobot» ekranidagi matnlar (dizayn: `design/oylik-hisobot.md`). */
export const HISOBOT = {
  sarlavha: 'Hisobot',
  // `‹` va `›` — koʻrinadigan matni belgi, shuning uchun yordamchi nomi beriladi.
  oldingiOy: 'Oldingi oy',
  keyingiOy: 'Keyingi oy',
  davrTanlash: 'Davr tanlash',
  oygaQaytish: 'Oyga qaytish',
  sanadan: 'Sanadan',
  sanagacha: 'Sanagacha',
  korsatish: 'Koʻrsatish',
  yopish: UMUMIY.yopish,
  davrTartibi: 'Boshlanish sanasi tugash sanasidan keyin boʻlmasin.',
  jamiKirim: 'Jami kirim',
  jamiChiqim: 'Jami chiqim',
  farq: 'Farq',
  farqYordami: 'kirim − chiqim',
  kursKerak: 'Taxminiy jamini koʻrsatish uchun kurs kerak.',
  kursSaqlash: 'Saqlash',
  hisoblanmadi: 'Taxminiy jami hisoblanmadi — summalar juda katta.',
  chiqimAjratmasi: 'Chiqim — kategoriyalar boʻyicha',
  kirimAjratmasi: 'Kirim — kategoriyalar boʻyicha',
  somGuruhi: 'soʻm',
  dollarGuruhi: 'dollar',
  qarz: 'Qarz',
  qarzIzohi: 'Qarz summalari jami kirim va jami chiqimga qoʻshilmagan.',
  qarzBerildi: 'Qarzga berildi',
  qarzdanQaytdi: 'Qarzdan qaytdi',
  qarzOlindi: 'Qarz olindi',
  qarzQaytarildi: 'Qarz qaytarildi',
  chiqimYoq: 'Bu davrda chiqim yozuvi yoʻq.',
  kirimYoq: 'Bu davrda kirim yozuvi yoʻq.',
  qarzHarakatiYoq: 'Bu davrda qarz harakati yoʻq.',
  boshqaDavr: 'Boshqa davrni yuqoridan tanlang.',
  boshBirinchi: 'Hali bitta ham yozuv yoʻq.',
  // Navigatsiyada alohida «Yozuv» bandi yoʻq (0067) — yoʻl bosh sahifadagi tugmadan
  // koʻrsatiladi, «Yozuvlar» va bosh sahifadagi boʻsh holat bilan bir xil matnda.
  boshIkkinchi: 'Birinchi yozuvni bosh sahifadagi «＋ Yozuv» tugmasi bilan qoʻshasiz.',
} as const

/** «≈ +10 500 000 soʻm» — taxminiy jami qatori (0023). */
export function taxminiyMatni(somMatni: string): string {
  return `≈ ${somMatni}`
}

/** «taxminiy · 1 $ = 12 500 soʻm» — qaysi kurs bilan hisoblangani (dizayn 3-boʻlim). */
export function taxminiyIzohi(kurs: string): string {
  return `taxminiy · ${kurs}`
}

/** «Zaxira» ekranidagi matnlar (dizayn: `design/zaxira.md`). */
export const ZAXIRA = {
  sarlavha: 'Zaxira',
  // ── «Zaxira olish» kartochkasi (2-boʻlim) ──
  olish: 'Zaxira olish',
  zaxiraYoq: 'Hali zaxira olinmagan.',
  eksportYordami:
    'Butun daftar bitta faylga yoziladi va qurilmangizga yuklab olinadi.',
  eksport: 'Eksport',
  // ── «Fayldan tiklash» kartochkasi (3-boʻlim) ──
  tiklash: 'Fayldan tiklash',
  ogohBirinchiBoshi: 'Import hozirgi maʼlumot ',
  ogohBirinchiKuchli: 'oʻrniga',
  ogohBirinchiOxiri: ' fayldagisini yozadi.',
  ogohIkkinchi:
    'Shuning uchun ilova avval hozirgi maʼlumotni faylga chiqaradi — undan qaytish yoʻli qoladi.',
  ogohBosh: 'Daftar boʻsh — yoʻqoladigan maʼlumot yoʻq, import bir qadamda oʻtadi.',
  import: 'Import',
  // Fayl tanlagichlar koʻrinmaydi — yordamchi nomi (`×` ning «Yopish» i kabi).
  tiklanadiganYorligi: 'Tiklanadigan fayl',
  zaxiraFayliYorligi: 'Zaxira fayli',
  // ── 2- va 3-qadam ──
  chiqarildi: 'Hozirgi maʼlumot faylga chiqarildi.',
  qaytaribTanlang:
    'Endi oʻsha faylni qaytarib tanlang — zaxira saqlanganini ilova shunda koʻradi.',
  zaxiraFayliniTanlash: 'Zaxira faylini tanlash',
  bekorQilish: 'Bekor qilish',
  bekorBirinchi: 'Import bekor qilindi — daftardagi maʼlumot oʻzgarmadi.',
  bekorIkkinchi: 'Chiqarilgan zaxira fayli qurilmangizda qoladi.',
  // ── Xato va natija ──
  ozgarmadi: 'Daftardagi maʼlumot oʻzgarmadi.',
  tanlanmadi: 'Zaxira fayli tanlanmadi — import bajarilmadi.',
  tiklandi: 'Daftar fayldan tiklandi.',
  yozuvlarniKorish: 'Yozuvlarni koʻrish',
} as const

/** «Oxirgi zaxira: 16-avgust» (dizayn 2-boʻlim). */
export function oxirgiZaxiraQatori(sana: string): string {
  return `Oxirgi zaxira: ${sana}`
}

/** «Fayl yuklab olindi: daftar-zaxira-2026-08-17-1435.json». */
export function yuklabOlindiQatori(nom: string): string {
  return `Fayl yuklab olindi: ${nom}`
}

/** «Tiklanadigan fayl: daftar-zaxira-2026-08-10-0912.json» (2-qadam). */
export function tiklanadiganQatori(nom: string): string {
  return `Tiklanadigan fayl: ${nom}`
}

/** «Kontakt: Akmal» — qarz va toʻlov formasidagi qator (dizayn: 3- va 4-boʻlim). */
export function kontaktQatori(ism: string): string {
  return `Kontakt: ${ism}`
}

/** «Qarz qoldigʻi: 700 000 soʻm» — toʻlov formasidagi qator (dizayn: 4-boʻlim). */
export function qarzQoldigiQatori(qoldiqMatni: string): string {
  return `Qarz qoldigʻi: ${qoldiqMatni}`
}

/** «Qarzdan ayiriladi: 50,00 $» — kurs maydoni ostidagi yordam qatori (0061; mezon 44). */
export function ayiriladiQatori(summaMatni: string): string {
  return `Qarzdan ayiriladi: ${summaMatni}`
}

/**
 * Toʻlov formasidagi hisob yordam qatori (0061; mezon 43).
 *
 * Yoʻnalish qarzdan olinadi: «berdim» qarziga kelgan toʻlov tanlangan hisobga **tushadi**,
 * «oldim» qarziga toʻlov oʻsha hisobdan **chiqadi** (0017, 0035).
 */
export function tolovYordami(yonalishi: QarzYonalishi, hisob: Hisob): string {
  if (yonalishi === 'berdim') {
    return hisob === 'karta' ? 'Pul kartaga tushadi.' : 'Pul naqdga tushadi.'
  }
  return hisob === 'karta' ? 'Pul kartadan chiqadi.' : 'Pul naqddan chiqadi.'
}

/**
 * Qarz kartochkasining ikkinchi qatori (dizayn 0-boʻlim):
 * `14-avgust · Karta · boshlangʻich 1 000 000 soʻm`.
 */
export function qarzTafsiloti(sana: string, hisob: string, summaMatni: string): string {
  return `${sana} · ${hisob} · ${KONTAKT.boshlangich} ${summaMatni}`
}

/**
 * «Qarz summasi toʻlovlardan kichik — toʻlangan: 300 000 soʻm.» (0061e; 9b2-band).
 *
 * Doʻkon xabarida raqam **formatlanmagan** holda keladi (KELISHUV 15-boʻlim), shuning
 * uchun matnni ekran oʻzi yigʻadi: raqam `QarzHolati.tolangan` dan olinib qarzning oʻz
 * valyutasida koʻrsatiladi.
 */
export function tolovdanKamMatni(tolanganMatni: string): string {
  return `Qarz summasi toʻlovlardan kichik — toʻlangan: ${tolanganMatni}.`
}

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
  // Himoya qatlami: UI bu holatlarga yoʻl qoʻymaydi (chiplar tur boʻyicha), lekin
  // doʻkon tekshiruvi ishlab qolsa odam eng yaqin maʼnodagi matnni koʻrsin.
  'kategoriya-topilmadi': 'Kategoriyani tanlang.',
  'kategoriya-turi': 'Kategoriyani tanlang.',
  'kategoriya-yashirilgan':
    'Bunday kategoriya yashirilgan — pastdagi Yashirilgan roʻyxatidan Koʻrsatish tugmasi bilan qaytaring.',

  // ── Qarz daftari (`design/qarz-daftari.md`; KELISHUV 15-boʻlim) ──
  'kontakt-ism-bosh': 'Ism kiriting.',
  'yonalish-bosh': 'Berdim yoki oldim ekanini tanlang.',
  'tolov-ortiqcha': 'Toʻlov qarz qoldigʻidan katta.',
  'tolov-nol-aylanma': 'Toʻlov juda kichik — qarz valyutasida nolga aylanadi.',
  // Dizaynda bu holat uchun matn yoʻq: yopilgan qarzda «＋ Toʻlov» havolasining oʻzi
  // boʻlmaydi (0061). Lekin forma ochiq turganda qarz boshqa joyda (ikkinchi tabda)
  // yopilishi mumkin — oʻshanda doʻkon rad etadi va sabab shu qator bilan aytiladi.
  'qarz-yopiq': 'Qarz yopilgan — unga toʻlov qoʻshilmaydi.',
  'qarz-topilmadi': 'Qarz topilmadi.',
  // Xuddi shu sabab: forma ochiq turganda kontakt boshqa joyda oʻchirilishi mumkin
  // (0030). Dizaynda matn yoʻq, chunki bitta tabda bu holatga yoʻl yoʻq.
  'kontakt-topilmadi': 'Kontakt topilmadi.',

  // ── Zaxira (`design/zaxira.md` 5-boʻlim; KELISHUV 25-boʻlim) ──
  // Ekran har xatoga ikkinchi qator qoʻshadi: «Daftardagi maʼlumot oʻzgarmadi.»
  'zaxira-oqilmadi': 'Fayl oʻqilmadi — u buzilgan yoki daftar zaxirasi emas.',
  'zaxira-versiya': 'Fayl versiyasi notanish — bu daftar oʻqiy oladigan zaxira emas.',
  'zaxira-notolik': 'Faylda maʼlumot toʻliq emas — import qilinmadi.',
  'zaxira-mos-emas': 'Bu fayl hozirgina chiqarilgan zaxira emas.',
  // 0030: doʻkon «qarzni yoping» deydi, dizayn «qarzlarni yoping» — ekran matni dizaynniki.
  'kontakt-ochiq-qarz': 'Ochiq qarzi bor kontakt oʻchirilmaydi — avval qarzlarni yoping.',
  // `qarz-summa-tolovdan-kam` bu roʻyxatda YOʻQ: uning matni raqamli va qarz valyutasiga
  // bogʻliq, shuning uchun forma uni `tolovdanKamMatni` bilan oʻzi yigʻadi.
}

/** Xato kodiga mos ekran matni; topilmasa doʻkonning oʻz xabari. */
export function xatoMatni(kod: XatoKodi, zaxira: string): string {
  return EKRAN_MATNLARI[kod] ?? zaxira
}
