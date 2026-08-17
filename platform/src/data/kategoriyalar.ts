// Kategoriyalar doʻkoni: tayyor roʻyxat, oʻz kategoriyasini qoʻshish, yashirish va
// qaytadan koʻrsatish (0013, 0028; mezon 13–16). Ekran shu fayl bilan gaplashadi.
//
// Oʻchirish YOʻQ: yashirilgan kategoriya bazada oʻz oʻrnida qoladi, shuning uchun eski
// yozuv va hisobot uning nomini baribir topadi (0013; mezon 14). Yangi yozuv tanlovi
// esa `korinadiganKategoriyalar` dan yuradi.
//
// Xato qanday bildiriladi (yozuvlar doʻkoni bilan bir xil):
// - forma tekshiruvi xatosi (boʻsh nom, takror nom) → `Natija` ichida `xatolar`;
// - bazaga tegishli xato (kategoriya topilmadi) → Promise rad etiladi (`Error`).

import {
  kategoriyaniTop,
  kategoriyalarniTartibla,
  korinadiganlar,
  nomniTekshir,
  tayyorKategoriyalar,
} from '../domain/kategoriya.ts'
import type { Kategoriya, Natija, YozuvTuri } from '../domain/turlar.ts'
import { hozirYaratilgan } from '../domain/vaqt.ts'
import { KATEGORIYALAR_OMBORI, amalda, idYarat, omborda } from './baza.ts'

/**
 * Roʻyxatni oʻqiydi va **yetishmayotgan tayyor kategoriyalarni toʻldiradi** (mezon 15).
 *
 * Hammasi **bitta amalda** (transaction): oʻqish ham, toʻldirish ham. Sababi tajribadan
 * chiqqan — ilgari urugʻlanish 11 ta alohida amalda ketardi va `count() > 0` shartiga
 * tayanardi. Oʻrtaga boshqa amal tushsa (masalan importning tozalashi yoki parallel
 * oʻqish) doʻkon **yarim urugʻlangan** qolardi, keyingi oʻqishlar esa uni hech qachon
 * tuzatmasdi: doʻkon boʻsh emas edi. Endi ikkalasi ham atomik va oʻzini tuzatadi.
 *
 * Nimaga tegilmaydi (0013, 0028):
 * - **mavjud qator umuman qayta yozilmaydi** — yashirilgan tayyor kategoriya
 *   yashirilganicha qoladi va qayta sepilmaydi;
 * - foydalanuvchi qoʻshgan kategoriyalar (va ularning `yaratilgan` tartibi) tegilmaydi.
 */
async function toldirilganRoyxat(): Promise<Kategoriya[]> {
  let natija: Kategoriya[] = []

  await amalda([KATEGORIYALAR_OMBORI], 'readwrite', (amal) => {
    const ombor = amal.objectStore(KATEGORIYALAR_OMBORI)
    const sorov = ombor.getAll()
    sorov.onsuccess = () => {
      const mavjud = sorov.result as Kategoriya[]
      const mavjudIdlar = new Set(mavjud.map((kategoriya) => kategoriya.id))
      const yetishmagan = tayyorKategoriyalar().filter(
        (kategoriya) => !mavjudIdlar.has(kategoriya.id),
      )
      // Yozish oʻsha amalning ichida ketadi — yarim holat qolmaydi.
      for (const kategoriya of yetishmagan) {
        ombor.put(kategoriya)
      }
      natija = [...mavjud, ...yetishmagan]
    }
  })

  return natija
}

/** Hamma kategoriya — yashirilgani ham (0013; mezon 14, 15). Tartibi: tayyorlar oldinda. */
export async function hammaKategoriyalar(): Promise<Kategoriya[]> {
  return kategoriyalarniTartibla(await toldirilganRoyxat())
}

/** Yangi yozuv tanlovi uchun roʻyxat: oʻsha turdagi, yashirilmaganlari (mezon 14, 16). */
export async function korinadiganKategoriyalar(turi: YozuvTuri): Promise<Kategoriya[]> {
  return korinadiganlar(await hammaKategoriyalar(), turi)
}

/** Bitta kategoriyani id boʻyicha oʻqiydi — yashirilgani ham topiladi. Topilmasa `null`. */
export async function kategoriyaniOl(id: string): Promise<Kategoriya | null> {
  const natija = await omborda<Kategoriya | undefined>(
    KATEGORIYALAR_OMBORI,
    'readonly',
    (ombor) => ombor.get(id),
  )
  return natija ?? null
}

/**
 * Oʻz kategoriyasini qoʻshadi (mezon 13).
 *
 * Boʻsh nom va ayni turdagi takror nom rad etiladi — sabab `Natija` ichida qaytadi
 * va doʻkonga hech narsa yozilmaydi.
 */
export async function kategoriyaQosh(nom: string, turi: YozuvTuri): Promise<Natija<Kategoriya>> {
  const tekshirilgan = nomniTekshir(nom, turi, await hammaKategoriyalar())
  if (!tekshirilgan.ok) {
    return tekshirilgan
  }

  // `yaratilgan` — roʻyxatdagi oʻrni: qoʻshilganlar qoʻshilish tartibida turadi
  // (dizayn, 1-boʻlim). Yozuvdagi kabi monoton oʻsadi (0047), demak bir millisekundda
  // ikkita kategoriya qoʻshilsa ham tartib chalkashmaydi.
  const kategoriya: Kategoriya = {
    id: idYarat(),
    nom: tekshirilgan.qiymat,
    turi,
    yashirilgan: false,
    yaratilgan: hozirYaratilgan(),
  }
  await omborda(KATEGORIYALAR_OMBORI, 'readwrite', (ombor) => ombor.add(kategoriya))
  return { ok: true, qiymat: kategoriya }
}

/** Yashirish yoki qaytadan koʻrsatish — bitta joyda, chunki farq faqat bayroqda. */
async function bayroqniQoy(id: string, yashirilgan: boolean): Promise<Kategoriya> {
  const kategoriyalar = await hammaKategoriyalar()
  const kategoriya = kategoriyaniTop(kategoriyalar, id)
  if (kategoriya === null) {
    throw new Error(`Kategoriya topilmadi: ${id}`)
  }

  const yangi: Kategoriya = { ...kategoriya, yashirilgan }
  await omborda(KATEGORIYALAR_OMBORI, 'readwrite', (ombor) => ombor.put(yangi))
  return yangi
}

/** Kategoriyani yashiradi: yangi yozuv tanlovidan chiqadi, lekin oʻchmaydi (mezon 14). */
export async function kategoriyaniYashir(id: string): Promise<Kategoriya> {
  return bayroqniQoy(id, true)
}

/** Yashirilgan kategoriyani qaytadan tanlov roʻyxatiga qaytaradi (0013). */
export async function kategoriyaniKorsat(id: string): Promise<Kategoriya> {
  return bayroqniQoy(id, false)
}
