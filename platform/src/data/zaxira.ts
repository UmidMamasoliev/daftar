// Zaxira doʻkoni: butun bazani faylga chiqarish va fayldan tiklash (0007, 0027, 0041).
//
// Uchta qoida shu faylni belgilaydi:
// 1. **Eksport joriy holatni yozadi** — oʻchirilgan yozuv («qaytarish» paneli hali ekranda
//    boʻlsa ham) faylga tushmaydi, chunki u bazadan allaqachon oʻchgan (0029; mezon 12).
// 2. **Har muvaffaqiyatli eksport oxirgi eksport sanasini yangilaydi** — qoʻlda olingani ham,
//    import oldidan avtomatik chiqarilgani ham (0054; mezon 10, 11b, 11c).
// 3. **Import — toʻliq almashtirish va bitta amalda** (0027; spec 20, 23): hamma ombor
//    tozalanadi va fayldagi maʼlumot qoʻyiladi. Yarim holat qolmaydi.
//
// Fayl tanlash, yuklab olish va tasdiq oqimining ekran qismi bu yerda emas — bu qatlam
// faqat **matn** va **obyekt** bilan ishlaydi.

import { hozirYaratilgan } from '../domain/vaqt.ts'
import type { Natija } from '../domain/turlar.ts'
import type { ZaxiraFayli, ZaxiraSanoqlari, ZaxiraTuri } from '../domain/zaxira.ts'
import {
  daftarBoshmi as mazmunBoshmi,
  faylNomi,
  faylanKategoriya,
  faylanKontakt,
  faylanQarz,
  faylanTolov,
  faylanYozuv,
  zaxiraMatni,
  zaxiraYasa,
  zaxiraniOqi,
} from '../domain/zaxira.ts'
import {
  KATEGORIYALAR_OMBORI,
  KONTAKTLAR_OMBORI,
  QARZLAR_OMBORI,
  SOZLAMALAR_OMBORI,
  TOLOVLAR_OMBORI,
  YOZUVLAR_OMBORI,
  amalda,
  omborda,
} from './baza.ts'
import { hammaKategoriyalar } from './kategoriyalar.ts'
import { hammaKontaktlar, hammaQarzlar, hammaTolovlar } from './qarzlar.ts'
import { oxirgiEksportniOl, oxirgiEksportniQoy, qoldaKurslarniOl } from './sozlamalar.ts'
import { hammaYozuvlar } from './yozuvlar.ts'

export { zaxiraTasdigi } from '../domain/zaxira.ts'

/** Eksport natijasi: ekran shu nom bilan faylni yuklab olishga beradi. */
export type ChiqarilganZaxira = {
  nom: string
  matn: string
  fayl: ZaxiraFayli
}

/**
 * Butun daftarni faylga chiqaradi (spec 1–6).
 *
 * `turi` — `qolda` yoki `import-oldidan` (spec 9, 18). Ikkalasi ham **oxirgi eksport
 * sanasini yangilaydi** (0054) va fayl ichidagi `oxirgi-eksport` shu eksportning oʻz
 * sanasiga teng boʻladi (0053; mezon 6g).
 *
 * `hozir` — testda vaqtni belgilash uchun; ilovada berilmaydi.
 */
export async function zaxiraniChiqar(
  turi: ZaxiraTuri,
  hozir: Date = new Date(),
): Promise<ChiqarilganZaxira> {
  const [kategoriyalar, yozuvlar, kontaktlar, qarzlar, tolovlar, kurslar] = await Promise.all([
    hammaKategoriyalar(),
    hammaYozuvlar(),
    hammaKontaktlar(),
    hammaQarzlar(),
    hammaTolovlar(),
    qoldaKurslarniOl(),
  ])

  // Sana fayl yozilishidan OLDIN yangilanadi (spec 9a): faylda shu eksportning sanasi turadi.
  const oxirgiEksport = await oxirgiEksportniQoy(kunMatni(hozir))

  const fayl = zaxiraYasa({
    kategoriyalar,
    yozuvlar,
    kontaktlar,
    qarzlar,
    tolovlar,
    kurslar,
    oxirgiEksport,
    turi,
    hozir,
  })

  return { nom: faylNomi(turi, hozir), matn: zaxiraMatni(fayl), fayl }
}

/** Mahalliy kun, `YYYY-MM-DD`. */
function kunMatni(vaqt: Date): string {
  const oy = String(vaqt.getMonth() + 1).padStart(2, '0')
  const kun = String(vaqt.getDate()).padStart(2, '0')
  return `${String(vaqt.getFullYear()).padStart(4, '0')}-${oy}-${kun}`
}

/**
 * Fayl matnini oʻqiydi, tekshiradi va daftar ustiga yozadi (spec 16–24).
 *
 * Tekshiruv **ustiga yozishdan oldin** (spec 22): xato boʻlsa `Natija` xatolari qaytadi va
 * daftardagi maʼlumot umuman tegilmaydi (mezon 20, 21, 22, 6e).
 * Muvaffaqiyatda bloklardagi sonlar qaytadi (0065).
 *
 * Tasdiq (0041) bu funksiyaning ishi emas: ekran avval `zaxiraniChiqar('import-oldidan')`
 * va `zaxiraTasdigi(...)` bilan yoʻlni oʻtadi, keyin shuni chaqiradi. Boʻsh daftarda
 * (`daftarBoshmi()`) u ikki qadam tushib qoladi (0055).
 */
export async function zaxiraniImport(matn: string): Promise<Natija<ZaxiraSanoqlari>> {
  const oqilgan = zaxiraniOqi(matn)
  if (!oqilgan.ok) {
    return oqilgan
  }
  return { ok: true, qiymat: await zaxiraniQoy(oqilgan.qiymat) }
}

/**
 * Tekshiruvdan oʻtgan faylni daftar ustiga yozadi — **bitta amalda** (spec 20, 23).
 *
 * Hamma ombor tozalanadi va fayldagi maʼlumot qoʻyiladi: birlashtirish, qoʻshish va
 * dublikat topish yoʻq (0027). `oxirgi-eksport` va `kurslar` ham fayldagi qiymat bilan
 * almashadi (0053, 0043; spec 21a, 21b).
 *
 * `id` lar fayldagi holicha qoladi (spec 21), shuning uchun bir xil faylni ikki marta
 * import qilish nusxa koʻpaytirmaydi (mezon 19).
 *
 * Qaytadigan sonlar **haqiqatda qoʻyilgan** qatorlardan olinadi (0065), fayl massivining
 * uzunligidan emas: takroriy `id` li faylda ikki qator bitta boʻlib qoladi va sanoq shuni
 * koʻrsatadi (mezon 24f).
 */
export async function zaxiraniQoy(fayl: ZaxiraFayli): Promise<ZaxiraSanoqlari> {
  // Kontakt va qarzda `yaratilgan` faylda yoʻq (spec sxemasi) — tartib uchun shu yerda
  // qoʻyiladi. Fayldagi qatorlar tartibida beriladi, demak import natijasi barqaror.
  const kontaktVaqtlari = fayl.kontaktlar.map(() => hozirYaratilgan())
  const qarzVaqtlari = fayl.qarzlar.map(() => hozirYaratilgan())

  await amalda(
    [
      YOZUVLAR_OMBORI,
      KATEGORIYALAR_OMBORI,
      KONTAKTLAR_OMBORI,
      QARZLAR_OMBORI,
      TOLOVLAR_OMBORI,
      SOZLAMALAR_OMBORI,
    ],
    'readwrite',
    (amal) => {
      for (const ombor of [
        YOZUVLAR_OMBORI,
        KATEGORIYALAR_OMBORI,
        KONTAKTLAR_OMBORI,
        QARZLAR_OMBORI,
        TOLOVLAR_OMBORI,
        SOZLAMALAR_OMBORI,
      ]) {
        amal.objectStore(ombor).clear()
      }

      for (const qator of fayl.kategoriyalar) {
        amal.objectStore(KATEGORIYALAR_OMBORI).put(faylanKategoriya(qator))
      }
      for (const qator of fayl.yozuvlar) {
        amal.objectStore(YOZUVLAR_OMBORI).put(faylanYozuv(qator))
      }
      fayl.kontaktlar.forEach((qator, tartib) => {
        amal
          .objectStore(KONTAKTLAR_OMBORI)
          .put(faylanKontakt(qator, kontaktVaqtlari[tartib] ?? hozirYaratilgan()))
      })
      fayl.qarzlar.forEach((qator, tartib) => {
        amal
          .objectStore(QARZLAR_OMBORI)
          .put(faylanQarz(qator, qarzVaqtlari[tartib] ?? hozirYaratilgan()))
      })
      for (const qator of fayl.tolovlar) {
        amal.objectStore(TOLOVLAR_OMBORI).put(faylanTolov(qator))
      }

      // Sozlamalar ham fayldan tiklanadi (0053, 0043).
      amal
        .objectStore(SOZLAMALAR_OMBORI)
        .put({ kalit: 'oxirgi-eksport', qiymat: fayl.eksport['oxirgi-eksport'] })
      amal.objectStore(SOZLAMALAR_OMBORI).put({ kalit: 'kurslar', qiymat: fayl.kurslar })
    },
  )

  const [kategoriyalar, yozuvlar, kontaktlar, qarzlar, tolovlar] = await Promise.all([
    qatorlarSoni(KATEGORIYALAR_OMBORI),
    qatorlarSoni(YOZUVLAR_OMBORI),
    qatorlarSoni(KONTAKTLAR_OMBORI),
    qatorlarSoni(QARZLAR_OMBORI),
    qatorlarSoni(TOLOVLAR_OMBORI),
  ])
  return { kategoriyalar, yozuvlar, kontaktlar, qarzlar, tolovlar }
}

/** Ombordagi qatorlar soni — import natijasi shundan olinadi (0065). */
async function qatorlarSoni(omborNomi: string): Promise<number> {
  return omborda<number>(omborNomi, 'readonly', (ombor) => ombor.count())
}

/**
 * Daftar boʻshmi (0055; spec 17b) — import bir qadamda oʻtishi shu javobga bogʻliq.
 *
 * Taʼrif `src/domain/zaxira.ts` da; bu yerda faqat doʻkonlardan oʻqiladi.
 */
export async function daftarBoshmi(): Promise<boolean> {
  const [yozuvlar, kontaktlar, qarzlar, tolovlar, kategoriyalar] = await Promise.all([
    hammaYozuvlar(),
    hammaKontaktlar(),
    hammaQarzlar(),
    hammaTolovlar(),
    hammaKategoriyalar(),
  ])
  return mazmunBoshmi({ yozuvlar, kontaktlar, qarzlar, tolovlar, kategoriyalar })
}

/** Oxirgi eksport sanasi — ekrandagi «Oxirgi zaxira: …» qatori uchun (0024, 0053). */
export { oxirgiEksportniOl }
