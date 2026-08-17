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
import { KATEGORIYALAR_OMBORI, idYarat, omborda } from './baza.ts'

/**
 * Doʻkon boʻsh boʻlsa tayyor roʻyxatni sepadi (mezon 15).
 *
 * Boʻshlik faqat birinchi ochilishda (yoki maʼlumot toʻliq tozalanganda) boʻladi:
 * kategoriya oʻchirilmaydi, yashirilgani ham qatorda qolaveradi (0013). Kalitlar
 * oʻzgarmas boʻlgani uchun sepish takrorlansa ham roʻyxat koʻpaymaydi.
 */
async function urugla(): Promise<void> {
  const soni = await omborda<number>(KATEGORIYALAR_OMBORI, 'readonly', (ombor) => ombor.count())
  if (soni > 0) {
    return
  }
  for (const kategoriya of tayyorKategoriyalar()) {
    await omborda(KATEGORIYALAR_OMBORI, 'readwrite', (ombor) => ombor.put(kategoriya))
  }
}

/** Hamma kategoriya — yashirilgani ham (0013; mezon 14, 15). Tartibi: tayyorlar oldinda. */
export async function hammaKategoriyalar(): Promise<Kategoriya[]> {
  await urugla()
  const kategoriyalar = await omborda<Kategoriya[]>(KATEGORIYALAR_OMBORI, 'readonly', (ombor) =>
    ombor.getAll(),
  )
  return kategoriyalarniTartibla(kategoriyalar)
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

  const kategoriya: Kategoriya = {
    id: idYarat(),
    nom: tekshirilgan.qiymat,
    turi,
    yashirilgan: false,
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
