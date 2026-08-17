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
