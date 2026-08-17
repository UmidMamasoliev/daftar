// Oylik hisobotning hisob-kitobi — sof mantiq, bazaga bogʻliq emas.
//
// Hisobot hech narsa saqlamaydi: har raqam joriy maʼlumotdan qayta hisoblanadi
// (0014, 0045). «Oy yopish» holati yoʻq.
//
// Qarorlar: 0013 (yashirilgan kategoriya hisobotda koʻrinadi), 0017 (qarz alohida blokda),
// 0018 (davr), 0019 (hisobot mazmuni), 0023 (valyuta modeli, «≈ jami soʻmda»),
// 0038 (kategoriya va qarz qatorlari valyuta boʻyicha alohida, taxminsiz),
// 0042 (yaxlitlash eng yaqiniga), 0043–0045 (oxirgi kurs), 0047 (`yaratilgan` faqat tartib),
// 0064 (qarz bloki toʻrt yoʻnalish; toʻlov oʻz valyutasi va oʻz summasi bilan).
//
// Sanoq OCHIQ: ekrandagi har raqamni odam qoʻlda qayta sanay olsin
// (`design/oylik-hisobot.md` 6-boʻlim). Shuning uchun avval «qaysi yozuv qaysi qatorga
// tushadi» degan funksiyalar turadi (`yozuvManzili`, `qarzManzili`, `tolovManzili`),
// yigʻish esa aynan oʻshalarning ustiga qurilgan — ikkinchi, yashirin qoida yoʻq.

import { kategoriyalarniTartibla } from './kategoriya.ts'
import { dollarSomgaSigadimi, dollarniSomga } from './pul.ts'
import { bugun } from './sana.ts'
import type {
  Kategoriya,
  Qarz,
  Tolov,
  Valyuta,
  ValyutaQoldigi,
  Yozuv,
  YozuvTuri,
} from './turlar.ts'
import { VALYUTALAR } from './turlar.ts'

// ------------------------------------------------------------------ Davr (0018)

/** Hisobot davri: ikkala chekka ham ichkariga kiradi (mezon 4, 5, 6). */
export type Davr = { boshlanish: string; tugash: string }

/** Kalendar oy: `oy` — 1 dan 12 gacha. */
export type Oy = { yil: number; oy: number }

function kunMatni(yil: number, oy: number, kun: number): string {
  return `${String(yil).padStart(4, '0')}-${String(oy).padStart(2, '0')}-${String(kun).padStart(2, '0')}`
}

/** Sana qaysi kalendar oyga tegishli. */
export function sananingOyi(sana: string): Oy {
  return { yil: Number(sana.slice(0, 4)), oy: Number(sana.slice(5, 7)) }
}

/** Oyni oldinga (`+1`) yoki orqaga (`−1`) suradi; yil chegarasidan oʻzi oʻtadi. */
export function oySur(oy: Oy, qadam: number): Oy {
  const jami = oy.yil * 12 + (oy.oy - 1) + qadam
  return { yil: Math.floor(jami / 12), oy: (jami % 12) + 1 }
}

/**
 * Oyning davri: 1-sanasidan oxirgi sanasigacha (0018).
 * Oy uzunligi taqvimdan olinadi — fevral va kabisa yili oʻzi hal boʻladi.
 */
export function oyDavri(oy: Oy): Davr {
  const oxirgiKun = new Date(Date.UTC(oy.yil, oy.oy, 0)).getUTCDate()
  return {
    boshlanish: kunMatni(oy.yil, oy.oy, 1),
    tugash: kunMatni(oy.yil, oy.oy, oxirgiKun),
  }
}

/** Ekran har ochilganda shu davr bilan ochiladi — joriy kalendar oy (mezon 1). */
export function joriyOyDavri(bugungiSana: string = bugun()): Davr {
  return oyDavri(sananingOyi(bugungiSana))
}

/**
 * Davr toʻgʻrimi: boshlanish tugashdan keyin boʻlmasin (dizayn 9-boʻlim).
 * Bitta kunlik davr toʻgʻri sanaladi (dizayn 2-boʻlim).
 *
 * Kelajak sanasi bu yerda tekshirilmaydi — u umumiy qoida va
 * `sananiTekshir` da turadi (0034), takrorlanmaydi.
 */
export function davrTogrimi(davr: Davr): boolean {
  return davr.boshlanish <= davr.tugash
}

/**
 * 1-qoida (dizayn 6-boʻlim): sana davr chegaralarining ichida boʻlsa — kiradi.
 * `yaratilgan` maydoni davrga umuman taʼsir qilmaydi: u faqat tartib va kurs
 * taqqosi uchun (0047).
 */
export function davrgaKiradimi(sana: string, davr: Davr): boolean {
  return sana >= davr.boshlanish && sana <= davr.tugash
}

// --------------------------------------------------- Qaysi qatorga tushadi (0064)

/** Qarz blokidagi toʻrt yoʻnalish, aynan shu tartibda (0064). */
export const QARZ_QATORLARI = ['berildi', 'qaytdi', 'olindi', 'qaytarildi'] as const
export type QarzQatoriTuri = (typeof QARZ_QATORLARI)[number]

/**
 * Qatorning ishorasi — pulning haqiqiy yoʻnalishi (0017, 0035, 0064):
 * berilgan qarz hisobdan chiqadi, qaytgani kiradi; olingan qarz kiradi,
 * qaytarilgani chiqadi. Ekran shu jadvalni takrorlab yozmasin.
 */
export const QARZ_QATOR_ISHORASI: Record<QarzQatoriTuri, 1 | -1> = {
  berildi: -1,
  qaytdi: 1,
  olindi: 1,
  qaytarildi: -1,
}

/** Yozuv hisobotning qaysi joyiga tushadi (dizayn 6-boʻlim, 1–4-qoidalar). */
export type YozuvManzili =
  | { qayerda: 'tashqarida' }
  | {
      qayerda: 'ichkarida'
      bolak: YozuvTuri
      valyuta: Valyuta
      kategoriyaId: string
      summa: number
    }

/** Qarzning oʻzi qaysi qatorga tushadi (5, 5a-qoidalar). */
export type QarzManzili =
  | { qayerda: 'tashqarida' }
  | { qayerda: 'ichkarida'; qator: 'berildi' | 'olindi'; valyuta: Valyuta; summa: number }

/** Toʻlov qaysi qatorga tushadi (5, 5a, 5b-qoidalar). */
export type TolovManzili =
  | { qayerda: 'tashqarida' }
  | { qayerda: 'qarzsiz' }
  | { qayerda: 'ichkarida'; qator: 'qaytdi' | 'qaytarildi'; valyuta: Valyuta; summa: number }

/**
 * Yozuv qaysi boʻlak, qaysi valyuta va qaysi kategoriya qatoriga tushadi.
 *
 * - davrni faqat `sana` aniqlaydi (1-qoida);
 * - kirim yozuvi faqat kirim tomoniga, chiqim faqat chiqim tomoniga (2-qoida);
 * - yozuv **oʻz valyutasida** qoladi, hech qayerda aylantirilmaydi (3-qoida, 0038);
 * - kategoriya yozuvniki — yashirilgan boʻlsa ham (4-qoida, 0013).
 */
export function yozuvManzili(yozuv: Yozuv, davr: Davr): YozuvManzili {
  if (!davrgaKiradimi(yozuv.sana, davr)) {
    return { qayerda: 'tashqarida' }
  }
  return {
    qayerda: 'ichkarida',
    bolak: yozuv.turi,
    valyuta: yozuv.valyuta,
    kategoriyaId: yozuv.kategoriyaId,
    summa: yozuv.summa,
  }
}

/**
 * Qarzning oʻzi qaysi qatorga tushadi: yoʻnalishi aniqlaydi (5-qoida, 0064),
 * davrni esa **qarzning oʻz sanasi** (5a-qoida). Qarzda aylantirish yoʻq (0023).
 */
export function qarzManzili(qarz: Qarz, davr: Davr): QarzManzili {
  if (!davrgaKiradimi(qarz.sana, davr)) {
    return { qayerda: 'tashqarida' }
  }
  return {
    qayerda: 'ichkarida',
    qator: qarz.yonalishi === 'berdim' ? 'berildi' : 'olindi',
    valyuta: qarz.valyuta,
    summa: qarz.summa,
  }
}

/**
 * Toʻlov qaysi qatorga tushadi: qatorni **qarzning yoʻnalishi**, davrni
 * **toʻlovning oʻz sanasi**, valyuta va summani esa **toʻlovning oʻzi** aniqlaydi
 * (5, 5a, 5b-qoidalar; 0064). Aylantirilgan qiymat hisobotga umuman kirmaydi.
 *
 * `qarz` `null` boʻlsa — maʼlumot buzilgan holat (qarzsiz toʻlov): hisobga olinmaydi,
 * lekin bu holat jimgina yashirilmaydi — manzili ochiq aytiladi.
 */
export function tolovManzili(tolov: Tolov, qarz: Qarz | null, davr: Davr): TolovManzili {
  if (qarz === null) {
    return { qayerda: 'qarzsiz' }
  }
  if (!davrgaKiradimi(tolov.sana, davr)) {
    return { qayerda: 'tashqarida' }
  }
  return {
    qayerda: 'ichkarida',
    qator: qarz.yonalishi === 'berdim' ? 'qaytdi' : 'qaytarildi',
    valyuta: tolov.valyuta,
    summa: tolov.summa,
  }
}

// ------------------------------------------------------------ Hisobot koʻrinishi

/** Bitta valyuta qatori: summa — eng kichik birlikda (soʻm, sent). */
export type ValyutaQatori = { valyuta: Valyuta; summa: number }

/**
 * Kategoriyalar ajratmasining bitta qatori. Bu yerda **faqat** uch maydon bor:
 * qator bosilmaydi, demak ekranga drill-down uchun hech narsa berilmaydi
 * (0064; mezon 16b). Kategoriya nomini ekran `kategoriyaniTop` bilan topadi.
 */
export type KategoriyaQatori = { kategoriyaId: string; valyuta: Valyuta; summa: number }

/** Qarz blokining bitta qatori. Ishora `QARZ_QATOR_ISHORASI` da (0064). */
export type QarzQatori = { qator: QarzQatoriTuri; valyuta: Valyuta; summa: number }

/**
 * «≈ jami soʻmda» qatorining holati (0023, 0043–0045):
 * - `yoq` — boʻlakda dollar qatori yoʻq, taxmin qiladigan narsa ham yoʻq;
 * - `kurs-kerak` — daftarda birorta kurs yoʻq, ilova kursni soʻraydi (mezon 21);
 * - `hisoblanmadi` — natija xavfsiz butun son chegarasidan oshdi (dizayn 9-boʻlim);
 * - `bor` — `somda` qiymati va **qaysi kurs** bilan hisoblangani.
 */
export type TaxminiyJami =
  | { holat: 'yoq' }
  | { holat: 'kurs-kerak' }
  | { holat: 'hisoblanmadi' }
  | { holat: 'bor'; somda: number; kurs: number }

/**
 * Jami blokining bitta boʻlagi: «Jami kirim», «Jami chiqim» yoki «Farq».
 *
 * `qatorlar` — faqat oʻsha valyutada yozuv bor boʻlsa chiziladi (0038); birorta
 * qator qolmasa boʻlak `0 soʻm` bilan turadi (dizayn 8-boʻlim; mezon 17).
 * Kirim va chiqim summalari **musbat** keladi (ishora va rang ekranniki),
 * farq esa oʻz ishorasi bilan.
 */
export type JamiBolagi = { qatorlar: ValyutaQatori[]; taxminiy: TaxminiyJami }

/** Hisobotni hisoblash uchun kerak boʻlgan hamma maʼlumot. */
export type HisobotKirishi = {
  davr: Davr
  yozuvlar: readonly Yozuv[]
  qarzlar: readonly Qarz[]
  tolovlar: readonly Tolov[]
  /** Ajratma tartibi uchun (0028 roʻyxati + qoʻshilish tartibi); yashirilgani ham kiradi. */
  kategoriyalar: readonly Kategoriya[]
  /** «Oxirgi kurs» (0044, 0045); `null` — daftarda birorta kurs yoʻq. */
  kurs: number | null
}

/** Ekranga tayyor hisobot — `design/oylik-hisobot.md` 1-boʻlimidagi tartibda. */
export type Hisobot = {
  davr: Davr
  kirim: JamiBolagi
  chiqim: JamiBolagi
  farq: JamiBolagi
  chiqimAjratmasi: KategoriyaQatori[]
  kirimAjratmasi: KategoriyaQatori[]
  qarz: QarzQatori[]
  /** Davrda birorta yozuv bormi (boʻsh holat matnlari uchun — dizayn 8-boʻlim). */
  davrdaYozuvBormi: boolean
  /** Davrda birorta qarz yoki toʻlov harakati bormi (14g-mezon). */
  davrdaQarzHarakatiBormi: boolean
  /** Daftarda umuman yozuv bormi — «Hali bitta ham yozuv yoʻq» holati (dizayn 8b). */
  daftardaYozuvBormi: boolean
  /** Hisobda ishlatilgan kurs — ekran «taxminiy · 1 $ = …» qatorida koʻrsatadi. */
  kurs: number | null
}

// ------------------------------------------------- «≈ jami soʻmda» (0023, 0042)

/** Manfiy qiymatni ham simmetrik aylantiradi: farq boʻlagi manfiy boʻlishi mumkin. */
function dollarQatoriSomda(sent: number, kurs: number): number {
  return sent < 0 ? -dollarniSomga(-sent, kurs) : dollarniSomga(sent, kurs)
}

/**
 * «≈ jami soʻmda» — chegara tekshiruvi bilan (KELISHUV 11-boʻlim texnik qarzi).
 *
 * `taxminiyJamiSomda` (`qoldiq.ts`) chegarani tekshirmaydi: koʻpaytma xavfsiz butun
 * son chegarasidan oshsa natija jimgina notoʻgʻri raqamga aylanardi (1a1, 1a2).
 * Shu yoʻl oʻsha teshikni yopadi — imzosi oʻzgarmagan eski funksiya joyida qoladi.
 *
 * Uchta javob: kurs yoʻq (`kurs-kerak`), sigmadi (`hisoblanmadi`), yoki qiymat (`bor`).
 * Boʻlakda dollar qatori bor-yoʻqligini **chaqiruvchi** hal qiladi (`yoq` holati).
 */
export function xavfsizTaxminiyJami(jami: ValyutaQoldigi, kurs: number | null): TaxminiyJami {
  if (kurs === null) {
    return { holat: 'kurs-kerak' }
  }
  if (!dollarSomgaSigadimi(Math.abs(jami.dollar), kurs)) {
    return { holat: 'hisoblanmadi' }
  }
  const somda = jami.som + dollarQatoriSomda(jami.dollar, kurs)
  if (!Number.isSafeInteger(somda)) {
    return { holat: 'hisoblanmadi' }
  }
  return { holat: 'bor', somda, kurs }
}

// -------------------------------------------------------------- Hisobotni yigʻish

/** Valyutalarning ekrandagi tartibi: avval soʻm, keyin dollar (dizayn 4-boʻlim). */
function valyutaTartibi(valyuta: Valyuta): number {
  return VALYUTALAR.indexOf(valyuta)
}

function qoshish<K>(xarita: Map<K, number>, kalit: K, summa: number): void {
  xarita.set(kalit, (xarita.get(kalit) ?? 0) + summa)
}

/** Boʻlakni yigʻadi: qaysi valyuta qatori chiziladi va ≈ qatori qanday boʻladi. */
function bolakYasa(
  qiymatlar: Map<Valyuta, number>,
  chiziladigan: ReadonlySet<Valyuta>,
  kurs: number | null,
): JamiBolagi {
  const qatorlar: ValyutaQatori[] = []
  for (const valyuta of VALYUTALAR) {
    if (chiziladigan.has(valyuta)) {
      qatorlar.push({ valyuta, summa: qiymatlar.get(valyuta) ?? 0 })
    }
  }

  // Boʻlak hech qachon qatorsiz qolmaydi: `0 soʻm` bilan turadi (dizayn 8-boʻlim).
  if (qatorlar.length === 0) {
    return { qatorlar: [{ valyuta: 'som', summa: 0 }], taxminiy: { holat: 'yoq' } }
  }

  // ≈ qatori faqat dollar qatori bor boʻlakda chiziladi (dizayn 3-boʻlim 1-qoida)
  // va boʻlakning OʻZ qatorlaridan hisoblanadi — «≈ kirim − ≈ chiqim» yoʻli bilan emas.
  const dollarQatori = qatorlar.find((qator) => qator.valyuta === 'dollar')
  if (dollarQatori === undefined) {
    return { qatorlar, taxminiy: { holat: 'yoq' } }
  }
  const somQatori = qatorlar.find((qator) => qator.valyuta === 'som')
  const taxminiy = xavfsizTaxminiyJami(
    { som: somQatori?.summa ?? 0, dollar: dollarQatori.summa },
    kurs,
  )
  return { qatorlar, taxminiy }
}

/**
 * Hisobotni yigʻadi. Har raqam faqat yuqoridagi manzil qoidalaridan chiqadi —
 * yashirin filtr va «hisobga olinmaydi» degan holat yoʻq (dizayn 6-boʻlim).
 */
export function hisobotYasa(kirish: HisobotKirishi): Hisobot {
  const { davr, yozuvlar, qarzlar, tolovlar, kategoriyalar, kurs } = kirish

  const jami: Record<YozuvTuri, Map<Valyuta, number>> = { kirim: new Map(), chiqim: new Map() }
  const chiziladigan: Record<YozuvTuri, Set<Valyuta>> = { kirim: new Set(), chiqim: new Set() }
  const ajratma: Record<YozuvTuri, Map<string, KategoriyaQatori>> = {
    kirim: new Map(),
    chiqim: new Map(),
  }
  let davrdaYozuvBormi = false

  for (const yozuv of yozuvlar) {
    const manzil = yozuvManzili(yozuv, davr)
    if (manzil.qayerda !== 'ichkarida') {
      continue
    }
    davrdaYozuvBormi = true
    qoshish(jami[manzil.bolak], manzil.valyuta, manzil.summa)
    chiziladigan[manzil.bolak].add(manzil.valyuta)

    const kalit = `${manzil.valyuta}|${manzil.kategoriyaId}`
    const qator = ajratma[manzil.bolak].get(kalit)
    if (qator === undefined) {
      ajratma[manzil.bolak].set(kalit, {
        kategoriyaId: manzil.kategoriyaId,
        valyuta: manzil.valyuta,
        summa: manzil.summa,
      })
    } else {
      qator.summa += manzil.summa
    }
  }

  // Farq har valyutada oʻsha valyutaning kirimi minus chiqimi (6-qoida): valyutalar
  // qoʻshilmaydi. Qator kirimda YOKI chiqimda yozuv boʻlsa chiziladi (dizayn 3-boʻlim).
  const farqQiymatlari = new Map<Valyuta, number>()
  const farqValyutalari = new Set<Valyuta>([...chiziladigan.kirim, ...chiziladigan.chiqim])
  for (const valyuta of farqValyutalari) {
    farqQiymatlari.set(
      valyuta,
      (jami.kirim.get(valyuta) ?? 0) - (jami.chiqim.get(valyuta) ?? 0),
    )
  }

  const tartib = new Map(
    kategoriyalarniTartibla(kategoriyalar).map((kategoriya, orni) => [kategoriya.id, orni]),
  )
  const qarz = qarzQatorlari(qarzlar, tolovlar, davr)

  return {
    davr,
    kirim: bolakYasa(jami.kirim, chiziladigan.kirim, kurs),
    chiqim: bolakYasa(jami.chiqim, chiziladigan.chiqim, kurs),
    farq: bolakYasa(farqQiymatlari, farqValyutalari, kurs),
    chiqimAjratmasi: ajratmaQatorlari(ajratma.chiqim, tartib),
    kirimAjratmasi: ajratmaQatorlari(ajratma.kirim, tartib),
    qarz,
    davrdaYozuvBormi,
    davrdaQarzHarakatiBormi: qarz.length > 0,
    daftardaYozuvBormi: yozuvlar.length > 0,
    kurs,
  }
}

/**
 * Ajratma tartibi (dizayn 4-boʻlim): avval soʻm guruhi, keyin dollar guruhi;
 * guruh ichida summa **kamayishi** boʻyicha; summalar teng boʻlsa 0028 dagi tayyor
 * roʻyxat tartibi, undan keyin foydalanuvchi qoʻshgani qoʻshilish tartibida.
 */
function ajratmaQatorlari(
  xarita: Map<string, KategoriyaQatori>,
  tartib: ReadonlyMap<string, number>,
): KategoriyaQatori[] {
  return [...xarita.values()].sort((a, b) => {
    if (a.valyuta !== b.valyuta) {
      return valyutaTartibi(a.valyuta) - valyutaTartibi(b.valyuta)
    }
    if (a.summa !== b.summa) {
      return b.summa - a.summa
    }
    const aTartib = tartib.get(a.kategoriyaId) ?? Number.MAX_SAFE_INTEGER
    const bTartib = tartib.get(b.kategoriyaId) ?? Number.MAX_SAFE_INTEGER
    if (aTartib !== bTartib) {
      return aTartib - bTartib
    }
    return a.kategoriyaId < b.kategoriyaId ? -1 : 1
  })
}

/**
 * Qarz bloki: toʻrt yoʻnalish, har biri valyuta boʻyicha alohida (0064, 0038).
 *
 * Nol qator chizilmaydi va toʻrt qator bir-biriga qoʻshilmaydi — netto yoʻq (14c).
 * Tartib: `QARZ_QATORLARI` boʻyicha, har yorliq ichida avval soʻm, keyin dollar.
 */
function qarzQatorlari(
  qarzlar: readonly Qarz[],
  tolovlar: readonly Tolov[],
  davr: Davr,
): QarzQatori[] {
  const xarita = new Map<string, QarzQatori>()

  const qosh = (qator: QarzQatoriTuri, valyuta: Valyuta, summa: number): void => {
    const kalit = `${qator}|${valyuta}`
    const bor = xarita.get(kalit)
    if (bor === undefined) {
      xarita.set(kalit, { qator, valyuta, summa })
    } else {
      bor.summa += summa
    }
  }

  for (const qarz of qarzlar) {
    const manzil = qarzManzili(qarz, davr)
    if (manzil.qayerda === 'ichkarida') {
      qosh(manzil.qator, manzil.valyuta, manzil.summa)
    }
  }

  const qarzlarXaritasi = new Map(qarzlar.map((qarz) => [qarz.id, qarz]))
  for (const tolov of tolovlar) {
    const manzil = tolovManzili(tolov, qarzlarXaritasi.get(tolov.qarzId) ?? null, davr)
    if (manzil.qayerda === 'ichkarida') {
      qosh(manzil.qator, manzil.valyuta, manzil.summa)
    }
  }

  return [...xarita.values()]
    .filter((qator) => qator.summa !== 0)
    .sort((a, b) => {
      if (a.qator !== b.qator) {
        return QARZ_QATORLARI.indexOf(a.qator) - QARZ_QATORLARI.indexOf(b.qator)
      }
      return valyutaTartibi(a.valyuta) - valyutaTartibi(b.valyuta)
    })
}
