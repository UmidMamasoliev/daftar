// Zaxira fayli — sof mantiq: yasash, matnga oʻgirish, oʻqish/tekshirish, solishtirish.
// Bazaga bogʻliq emas: ombordan oʻqish va ustiga yozish `src/data/zaxira.ts` da.
//
// Fayl — bitta JSON matn (0007; spec 7-band). Ikkita narsa muhim:
//
// 1. **Fayl kalitlari ilova ichidagi maydon nomlari bilan bir xil emas** (spec 15-band):
//    yozuvda `kategoriya` (ilovada `kategoriyaId`), qarzda `kontakt` va `yonalish`
//    (ilovada `kontaktId`, `yonalishi`), toʻlovda `qarz` (ilovada `qarzId`). Shuning uchun
//    oʻgirish shu faylda, bitta joyda turadi.
// 2. **Matn deterministik**: bir xil maʼlumotdan har doim bir xil matn chiqadi (massivlar
//    `id` boʻyicha saralanadi, kalitlar tartibi qatʼiy). 0041 dagi tasdiq aynan matnni
//    solishtirishga tayanadi — tartib har safar oʻzgarsa tasdiq hech qachon oʻtmasdi.

import { TAYYOR_KATEGORIYALAR } from './kategoriya.ts'
import type {
  Hisob,
  Kategoriya,
  Kontakt,
  Natija,
  Qarz,
  QarzYonalishi,
  Tolov,
  Valyuta,
  Yozuv,
  YozuvTuri,
} from './turlar.ts'
import { HISOBLAR, QARZ_YONALISHLARI, VALYUTALAR, YOZUV_TURLARI, ha, xato, yoq } from './turlar.ts'

/** Ilova oʻqiy oladigan fayl versiyasi. Notanish versiya import qilinmaydi (spec 8, 21). */
export const ZAXIRA_VERSIYASI = 1

/** Eksport turi: qoʻlda olingan yoki import oldidan avtomatik chiqarilgan (spec 9). */
export type ZaxiraTuri = 'qolda' | 'import-oldidan'

/** Fayldagi hisob qatori — roʻyxat oʻzgarmas, ikkita (0011; spec 15). */
export type FaylHisobi = { id: Hisob; nom: string }

export type FaylKategoriyasi = {
  id: string
  nom: string
  turi: YozuvTuri
  yashirilgan: boolean
  /** Qoʻshilgan kategoriyaning tartibi — importdan keyin ham saqlansin (0047 naqshi). */
  yaratilgan?: string
}

export type FaylYozuvi = {
  id: string
  sana: string
  turi: YozuvTuri
  summa: number
  valyuta: Valyuta
  /** Faqat dollarda: «1 dollar necha soʻm», butun son (0023, 0042). */
  kurs?: number
  kategoriya: string
  hisob: Hisob
  /** Faylda har doim bor; boʻsh boʻlishi mumkin (spec sxemasi). */
  izoh: string
  yaratilgan: string
}

export type FaylKontakti = { id: string; ism: string; telefon: string }

export type FaylQarzi = {
  id: string
  kontakt: string
  yonalish: QarzYonalishi
  summa: number
  valyuta: Valyuta
  sana: string
  hisob: Hisob
}

export type FaylTolovi = {
  id: string
  qarz: string
  summa: number
  valyuta: Valyuta
  /** Faqat toʻlov valyutasi qarz valyutasidan farq qilganda (0023). */
  kurs?: number
  sana: string
  hisob: Hisob
  yaratilgan: string
}

/** Qoʻlda soʻralgan kurs — valyuta boʻyicha bitta qiymat, sanasi bilan (0043, 0045). */
export type QoldaKurs = { kurs: number; sana: string }
export type QoldaKurslar = { dollar?: QoldaKurs }

/** Zaxira faylining butun tuzilishi (spec 7–15). */
export type ZaxiraFayli = {
  versiya: number
  eksport: {
    sana: string
    vaqt: string
    turi: ZaxiraTuri
    'oxirgi-eksport': string
  }
  hisoblar: FaylHisobi[]
  kategoriyalar: FaylKategoriyasi[]
  yozuvlar: FaylYozuvi[]
  kontaktlar: FaylKontakti[]
  qarzlar: FaylQarzi[]
  tolovlar: FaylTolovi[]
  kurslar: QoldaKurslar
}

/** Daftarning eksportga beriladigan butun mazmuni. */
export type DaftarMazmuni = {
  kategoriyalar: readonly Kategoriya[]
  yozuvlar: readonly Yozuv[]
  kontaktlar: readonly Kontakt[]
  qarzlar: readonly Qarz[]
  tolovlar: readonly Tolov[]
  kurslar: QoldaKurslar
  /** Daftardagi «oxirgi eksport sanasi» — fayl yozilishidan oldin yangilanadi (spec 9a). */
  oxirgiEksport: string
  turi: ZaxiraTuri
  hozir: Date
}

/** Bloklardagi qatorlar soni — import natijasi shu sonlar bilan aytiladi (0065). */
export type ZaxiraSanoqlari = {
  kategoriyalar: number
  yozuvlar: number
  kontaktlar: number
  qarzlar: number
  tolovlar: number
}

/** Fayldagi hisoblar bloki — oʻzgarmas (0011). */
const FAYL_HISOBLARI: FaylHisobi[] = [
  { id: 'naqd', nom: 'Naqd' },
  { id: 'karta', nom: 'Karta' },
]

// ─── Yasash ─────────────────────────────────────────────────────────────────

/** `id` boʻyicha barqaror tartib — matn deterministik boʻlishi uchun. */
function idBoyicha<T extends { id: string }>(qatorlar: readonly T[]): T[] {
  return [...qatorlar].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
}

function ikkiXona(son: number): string {
  return String(son).padStart(2, '0')
}

/** Mahalliy kun, `YYYY-MM-DD`. */
function kun(vaqt: Date): string {
  return `${String(vaqt.getFullYear()).padStart(4, '0')}-${ikkiXona(vaqt.getMonth() + 1)}-${ikkiXona(vaqt.getDate())}`
}

/** Mahalliy soat, `HH:MM`. */
function soat(vaqt: Date): string {
  return `${ikkiXona(vaqt.getHours())}:${ikkiXona(vaqt.getMinutes())}`
}

/**
 * Fayl nomi (spec 4, 18; mezon 9, 15): `daftar-zaxira-YYYY-MM-DD-HHMM.json` yoki
 * `daftar-import-oldidan-YYYY-MM-DD-HHMM.json`. Nomni ekran koʻrsatadi va tasdiq
 * qadamida odam aynan shu nomga qaraydi (0041).
 */
export function faylNomi(turi: ZaxiraTuri, hozir: Date): string {
  const bosh = turi === 'qolda' ? 'daftar-zaxira' : 'daftar-import-oldidan'
  return `${bosh}-${kun(hozir)}-${ikkiXona(hozir.getHours())}${ikkiXona(hozir.getMinutes())}.json`
}

/** Daftar mazmunidan fayl obyektini yasaydi (spec 7–15). */
export function zaxiraYasa(mazmun: DaftarMazmuni): ZaxiraFayli {
  return {
    versiya: ZAXIRA_VERSIYASI,
    eksport: {
      sana: kun(mazmun.hozir),
      vaqt: soat(mazmun.hozir),
      turi: mazmun.turi,
      'oxirgi-eksport': mazmun.oxirgiEksport,
    },
    hisoblar: FAYL_HISOBLARI.map((hisob) => ({ ...hisob })),
    kategoriyalar: idBoyicha(mazmun.kategoriyalar).map(kategoriyaniFaylga),
    yozuvlar: idBoyicha(mazmun.yozuvlar).map(yozuvniFaylga),
    kontaktlar: idBoyicha(mazmun.kontaktlar).map(kontaktniFaylga),
    qarzlar: idBoyicha(mazmun.qarzlar).map(qarzniFaylga),
    tolovlar: idBoyicha(mazmun.tolovlar).map(tolovniFaylga),
    kurslar: kurslarniFaylga(mazmun.kurslar),
  }
}

function kategoriyaniFaylga(kategoriya: Kategoriya): FaylKategoriyasi {
  const qator: FaylKategoriyasi = {
    id: kategoriya.id,
    nom: kategoriya.nom,
    turi: kategoriya.turi,
    yashirilgan: kategoriya.yashirilgan,
  }
  return kategoriya.yaratilgan === undefined
    ? qator
    : { ...qator, yaratilgan: kategoriya.yaratilgan }
}

function yozuvniFaylga(yozuv: Yozuv): FaylYozuvi {
  const asos = {
    id: yozuv.id,
    sana: yozuv.sana,
    turi: yozuv.turi,
    summa: yozuv.summa,
    valyuta: yozuv.valyuta,
  }
  const qolgani = {
    kategoriya: yozuv.kategoriyaId,
    hisob: yozuv.hisob,
    izoh: yozuv.izoh ?? '',
    yaratilgan: yozuv.yaratilgan,
  }
  return yozuv.valyuta === 'dollar'
    ? { ...asos, valyuta: 'dollar', kurs: yozuv.kurs, ...qolgani }
    : { ...asos, ...qolgani }
}

function kontaktniFaylga(kontakt: Kontakt): FaylKontakti {
  return { id: kontakt.id, ism: kontakt.ism, telefon: kontakt.telefon ?? '' }
}

function qarzniFaylga(qarz: Qarz): FaylQarzi {
  return {
    id: qarz.id,
    kontakt: qarz.kontaktId,
    yonalish: qarz.yonalishi,
    summa: qarz.summa,
    valyuta: qarz.valyuta,
    sana: qarz.sana,
    hisob: qarz.hisob,
  }
}

function tolovniFaylga(tolov: Tolov): FaylTolovi {
  const asos = { id: tolov.id, qarz: tolov.qarzId, summa: tolov.summa, valyuta: tolov.valyuta }
  const qolgani = { sana: tolov.sana, hisob: tolov.hisob, yaratilgan: tolov.yaratilgan }
  return tolov.kurs === undefined
    ? { ...asos, ...qolgani }
    : { ...asos, kurs: tolov.kurs, ...qolgani }
}

function kurslarniFaylga(kurslar: QoldaKurslar): QoldaKurslar {
  return kurslar.dollar === undefined
    ? {}
    : { dollar: { kurs: kurslar.dollar.kurs, sana: kurslar.dollar.sana } }
}

/**
 * Faylni matnga oʻgiradi. Matn **deterministik**: kalitlar tartibi `zaxiraYasa` da
 * qatʼiy, massivlar `id` boʻyicha saralangan. 0041 dagi tasdiq shu xususiyatga tayanadi.
 */
export function zaxiraMatni(fayl: ZaxiraFayli): string {
  return `${JSON.stringify(fayl, null, 2)}\n`
}

// ─── Fayldan ilova qiymatlariga ─────────────────────────────────────────────

/** Fayldagi kategoriyani ilova koʻrinishiga oʻgiradi. */
export function faylanKategoriya(qator: FaylKategoriyasi): Kategoriya {
  const kategoriya: Kategoriya = {
    id: qator.id,
    nom: qator.nom,
    turi: qator.turi,
    yashirilgan: qator.yashirilgan,
  }
  return qator.yaratilgan === undefined ? kategoriya : { ...kategoriya, yaratilgan: qator.yaratilgan }
}

/** Fayldagi yozuvni ilova koʻrinishiga oʻgiradi (boʻsh izoh maydon boʻlib qolmaydi). */
export function faylanYozuv(qator: FaylYozuvi): Yozuv {
  const asos = {
    id: qator.id,
    yaratilgan: qator.yaratilgan,
    turi: qator.turi,
    summa: qator.summa,
    kategoriyaId: qator.kategoriya,
    sana: qator.sana,
    hisob: qator.hisob,
    ...(qator.izoh === '' ? {} : { izoh: qator.izoh }),
  }
  return qator.valyuta === 'dollar'
    ? { ...asos, valyuta: 'dollar', kurs: qator.kurs ?? 0 }
    : { ...asos, valyuta: 'som' }
}

/** Fayldagi kontaktni ilova koʻrinishiga oʻgiradi (boʻsh telefon maydon boʻlib qolmaydi). */
export function faylanKontakt(qator: FaylKontakti, yaratilgan: string): Kontakt {
  return {
    id: qator.id,
    yaratilgan,
    ism: qator.ism,
    ...(qator.telefon === '' ? {} : { telefon: qator.telefon }),
  }
}

/** Fayldagi qarzni ilova koʻrinishiga oʻgiradi. */
export function faylanQarz(qator: FaylQarzi, yaratilgan: string): Qarz {
  return {
    id: qator.id,
    yaratilgan,
    kontaktId: qator.kontakt,
    yonalishi: qator.yonalish,
    summa: qator.summa,
    valyuta: qator.valyuta,
    sana: qator.sana,
    hisob: qator.hisob,
  }
}

/** Fayldagi toʻlovni ilova koʻrinishiga oʻgiradi. */
export function faylanTolov(qator: FaylTolovi): Tolov {
  return {
    id: qator.id,
    yaratilgan: qator.yaratilgan,
    qarzId: qator.qarz,
    summa: qator.summa,
    valyuta: qator.valyuta,
    ...(qator.kurs === undefined ? {} : { kurs: qator.kurs }),
    sana: qator.sana,
    hisob: qator.hisob,
  }
}

// ─── Oʻqish va tekshirish ───────────────────────────────────────────────────

const OQILMADI = 'Fayl oʻqilmadi — u buzilgan yoki daftar zaxirasi emas.'
const VERSIYA = 'Fayl versiyasi notanish — bu daftar oʻqiy oladigan zaxira emas.'
const NOTOLIK = 'Faylda maʼlumot toʻliq emas — import qilinmadi.'

function notolik<T>(): Natija<T> {
  return yoq(xato('fayl', 'zaxira-notolik', NOTOLIK))
}

function obyektmi(qiymat: unknown): qiymat is Record<string, unknown> {
  return typeof qiymat === 'object' && qiymat !== null && !Array.isArray(qiymat)
}

function matnmi(qiymat: unknown): qiymat is string {
  return typeof qiymat === 'string' && qiymat !== ''
}

/** Pul va kurs — musbat butun son (0008, 0033, 0042). */
function butunSonmi(qiymat: unknown): qiymat is number {
  return typeof qiymat === 'number' && Number.isSafeInteger(qiymat) && qiymat > 0
}

function tanlovmi<T extends string>(qiymat: unknown, royxat: readonly T[]): qiymat is T {
  return typeof qiymat === 'string' && (royxat as readonly string[]).includes(qiymat)
}

/**
 * Fayl matnini oʻqiydi va tekshiradi (spec 22; mezon 20, 21, 22, 6e).
 *
 * Uch xil sabab — uch xil kod, chunki odam uchun uch xil ish:
 * - `zaxira-oqilmadi` — JSON emas yoki yarim yozilgan;
 * - `zaxira-versiya` — ilovaga notanish versiya;
 * - `zaxira-notolik` — blok yoki majburiy maydon yetishmaydi (`yaratilgan` va
 *   `eksport.oxirgi-eksport` ham shu yerda).
 *
 * Tekshiruv **ustiga yozishdan oldin** oʻtkaziladi: bu funksiya hech narsani oʻzgartirmaydi.
 */
export function zaxiraniOqi(matn: string): Natija<ZaxiraFayli> {
  let oqilgan: unknown
  try {
    oqilgan = JSON.parse(matn)
  } catch {
    return yoq(xato('fayl', 'zaxira-oqilmadi', OQILMADI))
  }

  if (!obyektmi(oqilgan)) {
    return notolik()
  }

  if (oqilgan.versiya !== ZAXIRA_VERSIYASI) {
    return yoq(xato('fayl', 'zaxira-versiya', VERSIYA))
  }

  const eksport = oqilgan.eksport
  if (
    !obyektmi(eksport) ||
    !matnmi(eksport.sana) ||
    !matnmi(eksport.vaqt) ||
    !tanlovmi(eksport.turi, ['qolda', 'import-oldidan'] as const) ||
    !matnmi(eksport['oxirgi-eksport'])
  ) {
    return notolik()
  }

  if (!Array.isArray(oqilgan.hisoblar) || !hisoblarTogrimi(oqilgan.hisoblar)) {
    return notolik()
  }

  const kategoriyalar = massiv(oqilgan.kategoriyalar, kategoriyaTogrimi)
  const yozuvlar = massiv(oqilgan.yozuvlar, yozuvTogrimi)
  const kontaktlar = massiv(oqilgan.kontaktlar, kontaktTogrimi)
  const qarzlar = massiv(oqilgan.qarzlar, qarzTogrimi)
  const tolovlar = massiv(oqilgan.tolovlar, tolovTogrimi)
  const kurslar = kurslarniOqi(oqilgan.kurslar)

  if (
    kategoriyalar === null ||
    yozuvlar === null ||
    kontaktlar === null ||
    qarzlar === null ||
    tolovlar === null ||
    kurslar === null
  ) {
    return notolik()
  }

  return ha({
    versiya: ZAXIRA_VERSIYASI,
    eksport: {
      sana: eksport.sana,
      vaqt: eksport.vaqt,
      turi: eksport.turi,
      'oxirgi-eksport': eksport['oxirgi-eksport'],
    },
    hisoblar: FAYL_HISOBLARI.map((hisob) => ({ ...hisob })),
    kategoriyalar,
    yozuvlar,
    kontaktlar,
    qarzlar,
    tolovlar,
    kurslar,
  })
}

/** Massivning har qatorini tekshiradi; bittasi buzuq boʻlsa butun blok rad etiladi. */
function massiv<T>(qiymat: unknown, tekshir: (qator: Record<string, unknown>) => T | null): T[] | null {
  if (!Array.isArray(qiymat)) {
    return null
  }
  const natija: T[] = []
  for (const qator of qiymat as unknown[]) {
    if (!obyektmi(qator)) {
      return null
    }
    const tekshirilgan = tekshir(qator)
    if (tekshirilgan === null) {
      return null
    }
    natija.push(tekshirilgan)
  }
  return natija
}

/** Hisoblar bloki oʻzgarmas: naqd va karta (0011; spec 15). */
function hisoblarTogrimi(qiymat: unknown[]): boolean {
  const idlar = qiymat.map((qator) => (obyektmi(qator) ? qator.id : null))
  return HISOBLAR.every((hisob) => idlar.includes(hisob)) && idlar.length === HISOBLAR.length
}

function kategoriyaTogrimi(qator: Record<string, unknown>): FaylKategoriyasi | null {
  if (
    !matnmi(qator.id) ||
    !matnmi(qator.nom) ||
    !tanlovmi(qator.turi, YOZUV_TURLARI) ||
    typeof qator.yashirilgan !== 'boolean'
  ) {
    return null
  }
  const kategoriya: FaylKategoriyasi = {
    id: qator.id,
    nom: qator.nom,
    turi: qator.turi,
    yashirilgan: qator.yashirilgan,
  }
  if (qator.yaratilgan === undefined) {
    return kategoriya
  }
  return matnmi(qator.yaratilgan) ? { ...kategoriya, yaratilgan: qator.yaratilgan } : null
}

function yozuvTogrimi(qator: Record<string, unknown>): FaylYozuvi | null {
  if (
    !matnmi(qator.id) ||
    !matnmi(qator.sana) ||
    !tanlovmi(qator.turi, YOZUV_TURLARI) ||
    !butunSonmi(qator.summa) ||
    !tanlovmi(qator.valyuta, VALYUTALAR) ||
    !matnmi(qator.kategoriya) ||
    !tanlovmi(qator.hisob, HISOBLAR) ||
    typeof qator.izoh !== 'string' ||
    !matnmi(qator.yaratilgan)
  ) {
    return null
  }
  // Kurs faqat dollarda va oʻshanda majburiy (0023; mezon 6).
  if (qator.valyuta === 'dollar' && !butunSonmi(qator.kurs)) {
    return null
  }
  const yozuv: FaylYozuvi = {
    id: qator.id,
    sana: qator.sana,
    turi: qator.turi,
    summa: qator.summa,
    valyuta: qator.valyuta,
    kategoriya: qator.kategoriya,
    hisob: qator.hisob,
    izoh: qator.izoh,
    yaratilgan: qator.yaratilgan,
  }
  return qator.valyuta === 'dollar' && butunSonmi(qator.kurs)
    ? { ...yozuv, kurs: qator.kurs }
    : yozuv
}

function kontaktTogrimi(qator: Record<string, unknown>): FaylKontakti | null {
  if (!matnmi(qator.id) || !matnmi(qator.ism) || typeof qator.telefon !== 'string') {
    return null
  }
  return { id: qator.id, ism: qator.ism, telefon: qator.telefon }
}

function qarzTogrimi(qator: Record<string, unknown>): FaylQarzi | null {
  if (
    !matnmi(qator.id) ||
    !matnmi(qator.kontakt) ||
    !tanlovmi(qator.yonalish, QARZ_YONALISHLARI) ||
    !butunSonmi(qator.summa) ||
    !tanlovmi(qator.valyuta, VALYUTALAR) ||
    !matnmi(qator.sana) ||
    !tanlovmi(qator.hisob, HISOBLAR)
  ) {
    return null
  }
  return {
    id: qator.id,
    kontakt: qator.kontakt,
    yonalish: qator.yonalish,
    summa: qator.summa,
    valyuta: qator.valyuta,
    sana: qator.sana,
    hisob: qator.hisob,
  }
}

function tolovTogrimi(qator: Record<string, unknown>): FaylTolovi | null {
  if (
    !matnmi(qator.id) ||
    !matnmi(qator.qarz) ||
    !butunSonmi(qator.summa) ||
    !tanlovmi(qator.valyuta, VALYUTALAR) ||
    !matnmi(qator.sana) ||
    !tanlovmi(qator.hisob, HISOBLAR) ||
    !matnmi(qator.yaratilgan)
  ) {
    return null
  }
  if (qator.kurs !== undefined && !butunSonmi(qator.kurs)) {
    return null
  }
  const tolov: FaylTolovi = {
    id: qator.id,
    qarz: qator.qarz,
    summa: qator.summa,
    valyuta: qator.valyuta,
    sana: qator.sana,
    hisob: qator.hisob,
    yaratilgan: qator.yaratilgan,
  }
  return butunSonmi(qator.kurs) ? { ...tolov, kurs: qator.kurs } : tolov
}

/** `kurslar` — boʻsh obyekt boʻlishi mumkin, lekin blokning oʻzi majburiy (spec 15). */
function kurslarniOqi(qiymat: unknown): QoldaKurslar | null {
  if (!obyektmi(qiymat)) {
    return null
  }
  const kalitlar = Object.keys(qiymat)
  if (kalitlar.length === 0) {
    return {}
  }
  // Soʻm asos valyuta — unga kurs yozilmaydi (spec 10a).
  if (kalitlar.length > 1 || kalitlar[0] !== 'dollar') {
    return null
  }
  const dollar = qiymat.dollar
  if (!obyektmi(dollar) || !butunSonmi(dollar.kurs) || !matnmi(dollar.sana)) {
    return null
  }
  return { dollar: { kurs: dollar.kurs, sana: dollar.sana } }
}

// ─── Solishtirish (0041) ────────────────────────────────────────────────────

/**
 * Ikkita fayl matni bir xil zaxirami (spec 19; 0041 qatʼiy).
 *
 * Solishtirish **mazmun boʻyicha**: ikkala matn ham oʻqilib, bir xil deterministik
 * koʻrinishga keltiriladi — shuning uchun boʻshliqlari boshqacha yozilgan bir xil fayl
 * ham mos keladi. `eksport` bloki ham solishtiruvga kiradi: shu bilan «eski zaxira» va
 * «boshqa turdagi fayl» ajratiladi (dizayn 5-boʻlim, 17c-mezon).
 *
 * Buzilgan yoki oʻqilmaydigan fayl hech qachon mos kelmaydi (17d-mezon).
 */
export function zaxiraBirXilmi(birinchi: string, ikkinchi: string): boolean {
  const a = zaxiraniOqi(birinchi)
  const b = zaxiraniOqi(ikkinchi)
  if (!a.ok || !b.ok) {
    return false
  }
  return zaxiraMatni(a.qiymat) === zaxiraMatni(b.qiymat)
}

/**
 * Tasdiq qadamining natijasi (spec 19, 19a; dizayn 5-boʻlim).
 *
 * `tanlangan` — foydalanuvchi qaytarib tanlagan fayl matni; `chiqarilgan` — ilova
 * endigina chiqargan avtomatik zaxira matni. Mos kelmasa import bajarilmaydi va sabab
 * koʻrsatiladi (17c, 17d-mezonlar) — daftardagi maʼlumot oʻzgarmaydi.
 */
export function zaxiraTasdigi(tanlangan: string, chiqarilgan: string): Natija<true> {
  return zaxiraBirXilmi(tanlangan, chiqarilgan)
    ? ha(true)
    : yoq(xato('fayl', 'zaxira-mos-emas', 'Bu fayl hozirgina chiqarilgan zaxira emas.'))
}

// ─── Boʻsh daftar (0055) ────────────────────────────────────────────────────

/**
 * «Boʻsh daftar» taʼrifi (spec 17b; mezon 17e–17i) — uchala shart ham bajarilishi kerak:
 * (a) birorta yozuv yoʻq; (b) birorta kontakt, qarz va toʻlov yoʻq; (c) kategoriyalar
 * **tayyor holatida**: foydalanuvchi qoʻshgani yoʻq va birortasi yashirilmagan.
 *
 * Shartlardan bittasi buzilsa import 0027 dagi toʻrt qadam boʻyicha ketadi.
 */
export function daftarBoshmi(mazmun: {
  yozuvlar: readonly Yozuv[]
  kontaktlar: readonly Kontakt[]
  qarzlar: readonly Qarz[]
  tolovlar: readonly Tolov[]
  kategoriyalar: readonly Kategoriya[]
}): boolean {
  if (
    mazmun.yozuvlar.length > 0 ||
    mazmun.kontaktlar.length > 0 ||
    mazmun.qarzlar.length > 0 ||
    mazmun.tolovlar.length > 0
  ) {
    return false
  }
  const tayyorIdlar = new Set(TAYYOR_KATEGORIYALAR.map((kategoriya) => kategoriya.id))
  return mazmun.kategoriyalar.every(
    (kategoriya) => tayyorIdlar.has(kategoriya.id) && !kategoriya.yashirilgan,
  )
}
