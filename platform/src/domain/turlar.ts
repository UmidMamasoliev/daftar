// Daftarning maʼlumot turlari — bitta joyda.
//
// Qarorlar: 0008 (pul butun sonda), 0011 (ikkita hisob), 0012 (majburiy maydonlar),
// 0023 va 0026 (ikkita valyuta, kurs faqat dollarda), 0033 (summa formati),
// 0034 (kelajak sanasi yoʻq), 0042 (kurs butun soʻm), 0047 (`yaratilgan` maydoni).

/** Valyutalar roʻyxati tayyor va oʻzgarmas (0026). */
export const VALYUTALAR = ['som', 'dollar'] as const
export type Valyuta = (typeof VALYUTALAR)[number]

/** Hisoblar tayyor va oʻzgarmas: naqd va karta (0011). */
export const HISOBLAR = ['naqd', 'karta'] as const
export type Hisob = (typeof HISOBLAR)[number]

/** Yozuv yoʻnalishi: kirim yoki chiqim (0012). Manfiy summa yoʻq (0033). */
export const YOZUV_TURLARI = ['kirim', 'chiqim'] as const
export type YozuvTuri = (typeof YOZUV_TURLARI)[number]

/** Formadagi standart qiymatlar (mezon 3): hisob — karta, valyuta — soʻm. */
export const STANDART_HISOB: Hisob = 'karta'
export const STANDART_VALYUTA: Valyuta = 'som'

/**
 * Yozuvning valyutadan qatʼi nazar bir xil qismi.
 *
 * `summa` — butun son, tanlangan valyutaning eng kichik birligida:
 * soʻmda soʻm, dollarda sent (0008, 0033).
 * `sana` — `YYYY-MM-DD`, bugungi kun yoki undan oldin (0034).
 * `izoh` — ixtiyoriy; boʻsh boʻlsa maydon umuman boʻlmaydi (0012).
 */
export type YozuvAsosi = {
  turi: YozuvTuri
  summa: number
  kategoriyaId: string
  sana: string
  hisob: Hisob
  izoh?: string
}

/** Soʻmdagi yozuvda kurs saqlanmaydi (mezon 7). */
export type SomYozuvAsosi = YozuvAsosi & { valyuta: 'som' }

/** Dollardagi yozuvda kurs majburiy: 1 dollar necha soʻm, butun son (0023, 0042). */
export type DollarYozuvAsosi = YozuvAsosi & { valyuta: 'dollar'; kurs: number }

/** Hali saqlanmagan, lekin tekshiruvdan oʻtgan yozuv. */
export type YangiYozuv = SomYozuvAsosi | DollarYozuvAsosi

/**
 * Bazada turgan yozuv.
 *
 * `yaratilgan` — ISO 8601 UTC vaqti; texnik tartib maydoni: foydalanuvchiga
 * koʻrsatilmaydi va tahrirlashda oʻzgarmaydi (0047).
 */
export type Yozuv = YangiYozuv & { id: string; yaratilgan: string }

/**
 * Yozuv formasidagi qiymatlar — hammasi foydalanuvchi kiritadigan koʻrinishda.
 *
 * Summa va kurs matn boʻlib turadi: ularni oʻqish va tekshirish `yozuvniTekshir` ishi.
 * `turi` boshida boʻsh boʻladi — u majburiy tanlov (0012).
 */
export type YozuvFormasi = {
  summa: string
  turi: YozuvTuri | ''
  kategoriyaId: string
  sana: string
  izoh: string
  hisob: Hisob
  valyuta: Valyuta
  kurs: string
}

/**
 * Kategoriya — yozuv qaysi nom ostida sanaladi (0013, 0028).
 *
 * Kirim va chiqim roʻyxatlari alohida: `turi` shuni belgilaydi (mezon 16).
 * `yashirilgan` — oʻchirish emas: yozuv va hisobot uchun nom joyida qoladi,
 * faqat yangi yozuv tanlovida chiqmaydi (0013; mezon 14).
 */
export type Kategoriya = {
  id: string
  nom: string
  turi: YozuvTuri
  yashirilgan: boolean
  /**
   * Foydalanuvchi qoʻshgan kategoriya daftarga qachon tushgani (ISO 8601 UTC) —
   * roʻyxatdagi tartib shundan chiqadi: qoʻshilish tartibi (dizayn, 1-boʻlim).
   *
   * Tayyor kategoriyalarda boʻlmaydi: ular 0028 dagi tartibda oldinda turadi.
   * Maydon yozuv bilan birga saqlanadi, demak zaxira faylidan qaytgandan keyin ham
   * tartib oʻsha boʻlib qoladi.
   */
  yaratilgan?: string
}

/** Qarzning ikki yoʻnalishi: men berdim va men oldim (0015). */
export const QARZ_YONALISHLARI = ['berdim', 'oldim'] as const
export type QarzYonalishi = (typeof QARZ_YONALISHLARI)[number]

/**
 * Qarz yopilish chegarasi — qarzning **oʻz valyutasida**, eng kichik birlikda (0052).
 *
 * Qoldiq shu chegaradan oshmasa qarz yopilgan sanaladi: dollarda ≤ 1 sent,
 * soʻmda ≤ 100 soʻm. Chegara 0042 dagi yaxlitlashdan qoladigan «dum» uchun.
 * Holat maydoni yaratilmaydi — yopiqlik har safar qoldiqdan hisoblanadi (0016).
 */
export const YOPILISH_CHEGARASI: Record<Valyuta, number> = { som: 100, dollar: 1 }

/** Hali saqlanmagan kontakt: ism majburiy, telefon ixtiyoriy (0031). */
export type YangiKontakt = {
  ism: string
  /** Boʻsh boʻlsa maydon umuman boʻlmaydi. Format tekshirilmaydi (0031). */
  telefon?: string
}

/**
 * Bazada turgan kontakt (0015, 0031).
 *
 * `yaratilgan` — texnik tartib maydoni (0047 naqshi): roʻyxatdagi tartib shundan
 * chiqadi (qoʻshilish tartibi), foydalanuvchiga koʻrsatilmaydi.
 */
export type Kontakt = YangiKontakt & { id: string; yaratilgan: string }

/** Kontakt formasidagi qiymatlar — ikkala maydon ham matn (0031). */
export type KontaktFormasi = { ism: string; telefon: string }

/**
 * Hali saqlanmagan, lekin tekshiruvdan oʻtgan qarz.
 *
 * Qarzda **kurs yoʻq**: qarz oʻz valyutasida yuritiladi va qoldigʻi ham oʻsha valyutada
 * qoladi (0023). Kurs faqat boshqa valyutadagi toʻlovda soʻraladi va oʻsha toʻlovda
 * saqlanadi. `summa` — butun son, valyutaning eng kichik birligida (0008, 0033).
 */
export type YangiQarz = {
  kontaktId: string
  yonalishi: QarzYonalishi
  summa: number
  valyuta: Valyuta
  sana: string
  hisob: Hisob
}

/** Bazada turgan qarz; `yaratilgan` — tahrirda oʻzgarmaydigan texnik maydon (0047). */
export type Qarz = YangiQarz & { id: string; yaratilgan: string }

/**
 * Qarz formasidagi qiymatlar. `yonalishi` boshida boʻsh — standart yoʻq (0050 ruhi).
 * Qarzda **izoh maydoni yoʻq** (0059) — yozuv formasidan shu bilan farq qiladi.
 */
export type QarzFormasi = {
  kontaktId: string
  yonalishi: QarzYonalishi | ''
  summa: string
  sana: string
  hisob: Hisob
  valyuta: Valyuta
}

/**
 * Hali saqlanmagan, lekin tekshiruvdan oʻtgan qarz toʻlovi (0016, 0023).
 *
 * `kurs` **faqat** toʻlov valyutasi qarz valyutasidan farq qilganda boʻladi: oʻshanda
 * toʻlov shu kurs bilan qarz valyutasiga aylantirilib qoldiqdan ayiriladi (0023, 0042).
 * Bir xil valyutadagi toʻlovda maydon umuman boʻlmaydi (mezon 12).
 */
export type YangiTolov = {
  qarzId: string
  summa: number
  valyuta: Valyuta
  kurs?: number
  sana: string
  hisob: Hisob
}

/** Bazada turgan toʻlov; `yaratilgan` majburiy (0047; spec 15c-band). */
export type Tolov = YangiTolov & { id: string; yaratilgan: string }

/** Toʻlov formasidagi qiymatlar. `kurs` boshqa valyuta tanlanganda majburiy. */
export type TolovFormasi = {
  qarzId: string
  summa: string
  sana: string
  hisob: Hisob
  valyuta: Valyuta
  kurs: string
}

/**
 * Kontakt kartasidagi bitta netto qatori (0037, 0056).
 *
 * `netto` — **ochiq** qarzlar boʻyicha «berdim» va «oldim» farqi, valyutaning eng kichik
 * birligida: musbat — kontakt menga qarzdor, manfiy — men unga qarzdorman, nol — hisob
 * teng. Qator faqat oʻsha valyutada ochiq qarz boʻlganda yasaladi (mezon 15d, 15f).
 */
export type NettoQatori = { valyuta: Valyuta; netto: number }

/** Bitta qarzning ekranga tayyor holati: toʻlovlari, qoldigʻi va yopiqligi (0016). */
export type QarzHolati = {
  qarz: Qarz
  tolovlar: Tolov[]
  /** Qarz valyutasida, eng kichik birlikda; saqlanmaydi — har safar hisoblanadi. */
  qoldiq: number
  /** Shu qarzga toʻlangan yigʻindi, qarz valyutasida (0059 9b2 xato matni uchun). */
  tolangan: number
  /** `qoldiq` 0052 dagi chegaradan oshmasa `true`. */
  yopiq: boolean
}

/** Kontakt kartasi: kontakt, uning qarzlari holati va netto qatorlari (0015, 0037). */
export type KontaktHolati = {
  kontakt: Kontakt
  qarzlar: QarzHolati[]
  netto: NettoQatori[]
  /** 0030 uchun: ochiq qarzi bor kontakt oʻchirilmaydi (chegara ichidagisi toʻsiq emas). */
  ochiqQarziBormi: boolean
}

/**
 * Oʻchirilgan kontaktning butun izi — «qaytarish» uchun (0029, 0030; mezon 18).
 * Kontakt bilan birga uning qarz tarixi ham oʻchadi va birga qaytadi.
 */
export type OchirilganKontakt = {
  kontakt: Kontakt
  qarzlar: Qarz[]
  tolovlar: Tolov[]
}

/**
 * Oʻchirilgan qarz va uning toʻlovlari — «qaytarish» uchun (0059; 0029, 0048 naqshi).
 * Qarz oʻchirilsa toʻlovlari ham birga oʻchadi va qaytarishda birga qaytadi.
 */
export type OchirilganQarz = {
  qarz: Qarz
  tolovlar: Tolov[]
}

/** Bitta valyutadagi qoldiq — eng kichik birlikda (soʻm, sent). */
export type ValyutaQoldigi = { som: number; dollar: number }

/**
 * Qoldiqlar hisob × valyuta boʻyicha ajratiladi (0023): hisob ikkita boʻlib qoladi,
 * har birining qoldigʻi valyuta boʻyicha alohida koʻrsatiladi.
 */
export type Qoldiqlar = { naqd: ValyutaQoldigi; karta: ValyutaQoldigi }

/**
 * «Oxirgi kurs» hisobiga qatnashadigan bitta manba (0044, 0045).
 *
 * Manba — dollardagi yozuv, dollarli qarz toʻlovi yoki «≈ jami soʻmda» uchun qoʻlda
 * soʻralgan kurs. Uchalasi bir xil qoida bilan taqqoslanadi: avval `sana`, teng boʻlsa
 * `yaratilgan`.
 */
export type KursManbai = {
  kurs: number
  sana: string
  yaratilgan: string
}

/**
 * Xato qaysi maydonga tegishli — forma shu bilan qizil maydonni topadi.
 * `nom` — kategoriya formasidagi nom maydoni (0013).
 */
export type XatoMaydoni =
  | 'summa'
  | 'turi'
  | 'kategoriyaId'
  | 'sana'
  | 'hisob'
  | 'valyuta'
  | 'kurs'
  | 'nom'
  | 'ism'
  | 'yonalishi'
  | 'kontaktId'
  | 'qarzId'
  | 'fayl'

/** Xato kodlari roʻyxati — testlar va forma shu kodlarga tayanadi, matnga emas. */
export type XatoKodi =
  | 'summa-bosh'
  | 'summa-notogri'
  | 'summa-kasr'
  | 'summa-kop-kasr'
  | 'summa-nol'
  | 'summa-manfiy'
  | 'turi-bosh'
  | 'turi-notogri'
  | 'kategoriya-bosh'
  | 'sana-bosh'
  | 'sana-notogri'
  | 'sana-kelajak'
  | 'hisob-notogri'
  | 'valyuta-notogri'
  | 'kurs-bosh'
  | 'kurs-notogri'
  | 'kurs-kasr'
  | 'kurs-musbat-emas'
  | 'kategoriya-nom-bosh'
  | 'kategoriya-takror'
  | 'kategoriya-yashirilgan'
  | 'kategoriya-turi'
  | 'kategoriya-topilmadi'
  | 'kontakt-ism-bosh'
  | 'kontakt-bosh'
  | 'kontakt-topilmadi'
  | 'kontakt-ochiq-qarz'
  | 'yonalish-bosh'
  | 'yonalish-notogri'
  | 'qarz-topilmadi'
  | 'qarz-yopiq'
  | 'qarz-valyuta-ozgarmas'
  | 'qarz-kontakt-ozgarmas'
  | 'qarz-summa-tolovdan-kam'
  | 'tolov-ortiqcha'
  | 'tolov-nol-aylanma'
  | 'zaxira-oqilmadi'
  | 'zaxira-versiya'
  | 'zaxira-notolik'
  | 'zaxira-mos-emas'

/** Bitta xato: qaysi maydon, qaysi kod va odamga koʻrsatiladigan sabab. */
export type Xato = {
  maydon: XatoMaydoni
  kod: XatoKodi
  xabar: string
}

/** Tekshiruv natijasi: yo qiymat, yo sabablari bilan xatolar roʻyxati. */
export type Natija<T> = { ok: true; qiymat: T } | { ok: false; xatolar: Xato[] }

/** Muvaffaqiyatli natija yasaydi. */
export function ha<T>(qiymat: T): Natija<T> {
  return { ok: true, qiymat }
}

/** Xatoli natija yasaydi. */
export function yoq<T>(...xatolar: Xato[]): Natija<T> {
  return { ok: false, xatolar }
}

/** Bitta xato yasaydi. */
export function xato(maydon: XatoMaydoni, kod: XatoKodi, xabar: string): Xato {
  return { maydon, kod, xabar }
}
