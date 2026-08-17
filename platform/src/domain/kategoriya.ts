// Kategoriyalar mantiqi — sof hisob, bazaga bogʻliq emas.
//
// Daftar tayyor roʻyxat bilan keladi (0013, 0028): foydalanuvchi oʻz kategoriyasini
// qoʻsha oladi va keraksizini yashira oladi. Butunlay oʻchirish yoʻq — yashirilgan
// kategoriya oʻz oʻrnida qoladi, shuning uchun eski yozuv va hisobot uning nomini
// baribir topadi (0013; mezon 14).
//
// Kirim va chiqim roʻyxatlari alohida: kirim kategoriyasi chiqimda tanlanmaydi (mezon 16).

import type { Kategoriya, Natija, YozuvTuri } from './turlar.ts'
import { ha, xato, yoq } from './turlar.ts'

/**
 * 0028 dagi tayyor roʻyxat — nomlar aynan oʻsha holicha, kichik harfda.
 *
 * `id` — oʻzgarmas lotin kaliti: yozuvda shu saqlanadi, demak nomni keyin
 * oʻzgartirish ham eski yozuvlarni uzmaydi. Foydalanuvchi qoʻshgan kategoriya
 * esa tasodifiy id oladi (`idYarat`), shuning uchun kalitlar toʻqnashmaydi.
 */
export const TAYYOR_KATEGORIYALAR: readonly Kategoriya[] = [
  { id: 'oziq-ovqat', nom: 'oziq-ovqat', turi: 'chiqim', yashirilgan: false },
  { id: 'transport', nom: 'transport', turi: 'chiqim', yashirilgan: false },
  { id: 'ijara', nom: 'ijara', turi: 'chiqim', yashirilgan: false },
  { id: 'kommunal', nom: 'kommunal', turi: 'chiqim', yashirilgan: false },
  { id: 'sogliq', nom: 'sogʻliq', turi: 'chiqim', yashirilgan: false },
  { id: 'kiyim', nom: 'kiyim', turi: 'chiqim', yashirilgan: false },
  { id: 'kongilochar', nom: 'koʻngilochar', turi: 'chiqim', yashirilgan: false },
  { id: 'boshqa', nom: 'boshqa', turi: 'chiqim', yashirilgan: false },
  { id: 'oylik', nom: 'oylik', turi: 'kirim', yashirilgan: false },
  { id: 'qoshimcha-daromad', nom: 'qoʻshimcha daromad', turi: 'kirim', yashirilgan: false },
  { id: 'sovga', nom: 'sovgʻa', turi: 'kirim', yashirilgan: false },
]

/** Tayyor roʻyxatning mustaqil nusxasi — urugʻlantirish va test uchun. */
export function tayyorKategoriyalar(): Kategoriya[] {
  return TAYYOR_KATEGORIYALAR.map((kategoriya) => ({ ...kategoriya }))
}

/** Tayyor kategoriyaning roʻyxatdagi oʻrni; foydalanuvchi qoʻshgani uchun `undefined`. */
const TAYYOR_TARTIBI = new Map(
  TAYYOR_KATEGORIYALAR.map((kategoriya, tartib) => [kategoriya.id, tartib]),
)

/**
 * Roʻyxat tartibi: avval tayyor kategoriyalar 0028 dagi tartibda, keyin
 * foydalanuvchi qoʻshganlari nom boʻyicha. Yangi nusxa qaytadi.
 */
export function kategoriyalarniTartibla(kategoriyalar: readonly Kategoriya[]): Kategoriya[] {
  return [...kategoriyalar].sort((a, b) => {
    const aTartib = TAYYOR_TARTIBI.get(a.id)
    const bTartib = TAYYOR_TARTIBI.get(b.id)
    if (aTartib !== undefined && bTartib !== undefined) {
      return aTartib - bTartib
    }
    if (aTartib !== undefined) {
      return -1
    }
    if (bTartib !== undefined) {
      return 1
    }
    return a.nom.localeCompare(b.nom, 'uz')
  })
}

/** Yangi yozuv tanlovi uchun roʻyxat: oʻsha turdagi, yashirilmaganlari (mezon 14, 16). */
export function korinadiganlar(
  kategoriyalar: readonly Kategoriya[],
  turi: YozuvTuri,
): Kategoriya[] {
  return kategoriyalarniTartibla(
    kategoriyalar.filter((kategoriya) => kategoriya.turi === turi && !kategoriya.yashirilgan),
  )
}

/** Id boʻyicha topadi — yashirilgani ham topiladi (eski yozuv va hisobot uchun). */
export function kategoriyaniTop(
  kategoriyalar: readonly Kategoriya[],
  id: string,
): Kategoriya | null {
  return kategoriyalar.find((kategoriya) => kategoriya.id === id) ?? null
}

/**
 * Nomlarni solishtirish kaliti: chekka boʻshliqlar kesiladi, ichkaridagi ketma-ket
 * boʻshliqlar bittaga tushadi, harf katta-kichikligi hisobga olinmaydi.
 * «  Transport » va «transport» — bitta nom.
 */
function taqqoslashKaliti(nom: string): string {
  return nom.trim().replace(/\s+/g, ' ').toLowerCase()
}

/**
 * Shu nom band qilib turgan kategoriyani topadi — faqat **joriy tur** roʻyxati ichidan
 * (roʻyxatlar alohida, mezon 16). Yashirilgani ham topiladi: u oʻchmagan (0013).
 *
 * Ekranga «Koʻrsatish» tugmasini qaysi qatorga bogʻlashni shu funksiya aytadi (0051) —
 * solishtirish qoidasi shu yerda turadi, uni takrorlash shart emas.
 */
export function nomBoyichaTop(
  kategoriyalar: readonly Kategoriya[],
  nom: string,
  turi: YozuvTuri,
): Kategoriya | null {
  const kalit = taqqoslashKaliti(nom)
  return (
    kategoriyalar.find(
      (kategoriya) => kategoriya.turi === turi && taqqoslashKaliti(kategoriya.nom) === kalit,
    ) ?? null
  )
}

/**
 * Yangi kategoriya nomini tekshiradi (mezon 13; 0051).
 *
 * Uch xil javob:
 * - boʻsh nom → `kategoriya-nom-bosh` («Nom kiriting»);
 * - ayni turda **koʻrinib turgan** bir xil nom → `kategoriya-takror`
 *   («Bunday kategoriya bor»);
 * - ayni turda **yashirilgan** bir xil nom → `kategoriya-yashirilgan` — nom band, lekin
 *   sabab roʻyxatda koʻrinmaydi, shuning uchun xato yoʻl koʻrsatadi: «Koʻrsatish» bilan
 *   qaytariladi (0051). Ilova uni oʻzi koʻrsatib yubormaydi va dublikat yaratmaydi.
 *
 * Boshqa turdagi bir xil nom halaqit qilmaydi — roʻyxatlar alohida (mezon 16).
 */
export function nomniTekshir(
  nom: string,
  turi: YozuvTuri,
  mavjudlar: readonly Kategoriya[],
): Natija<string> {
  const tozalangan = nom.trim()
  if (tozalangan === '') {
    return yoq(xato('nom', 'kategoriya-nom-bosh', 'Nom kiriting'))
  }

  const band = nomBoyichaTop(mavjudlar, tozalangan, turi)
  if (band !== null) {
    return band.yashirilgan
      ? yoq(xato('nom', 'kategoriya-yashirilgan', 'Bu kategoriya yashirilgan'))
      : yoq(xato('nom', 'kategoriya-takror', 'Bunday kategoriya bor'))
  }

  return ha(tozalangan)
}
