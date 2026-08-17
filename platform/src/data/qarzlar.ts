// Qarz daftari doʻkoni: kontaktlar, qarzlar va toʻlovlar. Ekran shu fayl bilan gaplashadi.
//
// Nima SAQLANMAYDI: qarz qoldigʻi, yopiqlik va kontakt nettosi — hammasi har safar
// qarz va toʻlovlardan hisoblanadi (0016, 0037, 0045, 0052, 0056). Shuning uchun toʻlov
// oʻchirilsa yoki qaytarilsa qoʻshimcha yangilash mantiqi kerak emas.
//
// Xato qanday bildiriladi (yozuvlar doʻkonidagi naqsh):
// - foydalanuvchi tuzata oladigan xato (boʻsh ism, ortiqcha toʻlov, ochiq qarzli kontaktni
//   oʻchirish) → `Natija` ichida `xatolar`;
// - bazaga tegishli xato (qarz topilmadi, baza ochilmadi) → Promise rad etiladi (`Error`).

import {
  kontaktNettosi,
  kontaktniTekshir,
  ochiqQarzlar,
  qarzQoldigi,
  qarzTolangani,
  qarzYopiqmi,
  qarzniTekshir,
  tolovniTekshir,
} from '../domain/qarz.ts'
import { qarzQoldiqlari } from '../domain/qoldiq.ts'
import type {
  Kontakt,
  KontaktFormasi,
  KontaktHolati,
  Natija,
  OchirilganKontakt,
  OchirilganQarz,
  Qarz,
  QarzFormasi,
  QarzHolati,
  Qoldiqlar,
  Tolov,
  TolovFormasi,
  YangiKontakt,
  YangiQarz,
  YangiTolov,
} from '../domain/turlar.ts'
import { YOPILISH_CHEGARASI, xato } from '../domain/turlar.ts'
import { hozirYaratilgan } from '../domain/vaqt.ts'
import {
  KONTAKTLAR_OMBORI,
  QARZLAR_OMBORI,
  TOLOVLAR_OMBORI,
  amalda,
  idYarat,
  omborda,
} from './baza.ts'

export { bazaniTozala, bazaniYop } from './baza.ts'

/** Roʻyxat tartibi — yozuvlar doʻkonidagi bilan bir xil maʼnoda. */
export type Tartib = 'yangidan' | 'eskidan'

/** Sana boʻyicha, bir kun ichida `yaratilgan` boʻyicha tartiblaydi (0047). */
function sanaBoyicha<T extends { sana: string; yaratilgan: string }>(
  qatorlar: T[],
  tartib: Tartib,
): T[] {
  const yonalish = tartib === 'yangidan' ? -1 : 1
  return qatorlar.sort((a, b) => {
    if (a.sana !== b.sana) {
      return a.sana < b.sana ? -yonalish : yonalish
    }
    if (a.yaratilgan !== b.yaratilgan) {
      return a.yaratilgan < b.yaratilgan ? -yonalish : yonalish
    }
    return 0
  })
}

// ─── Kontaktlar ─────────────────────────────────────────────────────────────

/** Tekshiruvdan oʻtgan kontaktni saqlaydi; id va `yaratilgan` shu yerda qoʻyiladi. */
export async function kontaktQosh(yangi: YangiKontakt): Promise<Kontakt> {
  const kontakt: Kontakt = { ...yangi, id: idYarat(), yaratilgan: hozirYaratilgan() }
  await omborda(KONTAKTLAR_OMBORI, 'readwrite', (ombor) => ombor.add(kontakt))
  return kontakt
}

/** Formani tekshiradi va toʻgʻri boʻlsa saqlaydi (mezon 1, 2). */
export async function kontaktSaqla(forma: KontaktFormasi): Promise<Natija<Kontakt>> {
  const tekshirilgan = kontaktniTekshir(forma)
  if (!tekshirilgan.ok) {
    return tekshirilgan
  }
  return { ok: true, qiymat: await kontaktQosh(tekshirilgan.qiymat) }
}

/** Bitta kontaktni id boʻyicha oʻqiydi. Topilmasa `null`. */
export async function kontaktniOl(id: string): Promise<Kontakt | null> {
  const natija = await omborda<Kontakt | undefined>(KONTAKTLAR_OMBORI, 'readonly', (ombor) =>
    ombor.get(id),
  )
  return natija ?? null
}

/**
 * Hamma kontakt — **alifbo tartibida** (dizayn, 1-boʻlim; mezon 23).
 *
 * Qidiruv yoʻq (0002), shuning uchun tartib oldindan bilinadigan boʻlishi kerak. Harf
 * katta-kichikligi hisobga olinmaydi; bir xil ism boʻlsa (0031 boʻyicha bu xato emas)
 * tartibni `yaratilgan` barqarorlashtiradi.
 */
export async function hammaKontaktlar(): Promise<Kontakt[]> {
  const kontaktlar = await omborda<Kontakt[]>(KONTAKTLAR_OMBORI, 'readonly', (ombor) =>
    ombor.getAll(),
  )
  return kontaktlar.sort((a, b) => {
    const nom = a.ism.localeCompare(b.ism, 'uz', { sensitivity: 'base' })
    if (nom !== 0) {
      return nom
    }
    return a.yaratilgan < b.yaratilgan ? -1 : 1
  })
}

/** Kontaktning mustaqil nusxasi — «qaytarish» uchun ushlab turishga qulay. */
export function kontaktNusxasi(kontakt: Kontakt): Kontakt {
  return { ...kontakt }
}

/**
 * Kontaktni yangilaydi (0060). `id` va `yaratilgan` oʻzgarmaydi (0047);
 * telefon berilmasa maydon umuman yoʻqoladi.
 */
export async function kontaktniYangila(id: string, yangi: YangiKontakt): Promise<Kontakt> {
  const eski = await kontaktniOl(id)
  if (eski === null) {
    throw new Error(`Kontakt topilmadi: ${id}`)
  }
  const kontakt: Kontakt = { ...yangi, id: eski.id, yaratilgan: eski.yaratilgan }
  await omborda(KONTAKTLAR_OMBORI, 'readwrite', (ombor) => ombor.put(kontakt))
  return kontakt
}

/** Kontakt formasini tekshiradi va toʻgʻri boʻlsa yangilaydi (0060). */
export async function kontaktniTahrirla(
  id: string,
  forma: KontaktFormasi,
): Promise<Natija<Kontakt>> {
  const mavjud = await kontaktniOl(id)
  if (mavjud === null) {
    throw new Error(`Kontakt topilmadi: ${id}`)
  }
  const tekshirilgan = kontaktniTekshir(forma)
  if (!tekshirilgan.ok) {
    return tekshirilgan
  }
  return { ok: true, qiymat: await kontaktniYangila(id, tekshirilgan.qiymat) }
}

/**
 * Kontaktni qarz tarixi bilan birga oʻchiradi (0030; mezon 16, 17).
 *
 * **Ochiq** qarzi bor kontakt oʻchirilmaydi — sabab `Natija` ichida qaytadi. Chegara
 * bilan yopilgan qarz (0052) toʻsiq emas: u oʻz mikro-qoldigʻi bilan birga ketadi (0056).
 * Qaytarilgan qiymat — «qaytarish» tugmasining butun holati (mezon 18).
 */
export async function kontaktniOchir(id: string): Promise<Natija<OchirilganKontakt>> {
  const kontakt = await kontaktniOl(id)
  if (kontakt === null) {
    throw new Error(`Kontakt topilmadi: ${id}`)
  }

  const qarzlar = await kontaktQarzlari(id)
  const tolovlar: Tolov[] = []
  for (const qarz of qarzlar) {
    tolovlar.push(...(await qarzTolovlariniOl(qarz.id)))
  }

  if (ochiqQarzlar(qarzlar, tolovlar).length > 0) {
    return {
      ok: false,
      xatolar: [
        xato(
          'kontaktId',
          'kontakt-ochiq-qarz',
          'Ochiq qarzi bor kontakt oʻchirilmaydi — avval qarzni yoping.',
        ),
      ],
    }
  }

  // Uchalasi bitta amalda ketadi: yarim oʻchgan kontakt qarzsiz qolmasin.
  await amalda([KONTAKTLAR_OMBORI, QARZLAR_OMBORI, TOLOVLAR_OMBORI], 'readwrite', (amal) => {
    for (const tolov of tolovlar) {
      amal.objectStore(TOLOVLAR_OMBORI).delete(tolov.id)
    }
    for (const qarz of qarzlar) {
      amal.objectStore(QARZLAR_OMBORI).delete(qarz.id)
    }
    amal.objectStore(KONTAKTLAR_OMBORI).delete(id)
  })

  return { ok: true, qiymat: { kontakt, qarzlar, tolovlar } }
}

/** Oʻchirilgan kontaktni qarz tarixi bilan birga joyiga qaytaradi (mezon 18). */
export async function kontaktniQaytar(ochirilgan: OchirilganKontakt): Promise<OchirilganKontakt> {
  await amalda([KONTAKTLAR_OMBORI, QARZLAR_OMBORI, TOLOVLAR_OMBORI], 'readwrite', (amal) => {
    amal.objectStore(KONTAKTLAR_OMBORI).put(ochirilgan.kontakt)
    for (const qarz of ochirilgan.qarzlar) {
      amal.objectStore(QARZLAR_OMBORI).put(qarz)
    }
    for (const tolov of ochirilgan.tolovlar) {
      amal.objectStore(TOLOVLAR_OMBORI).put(tolov)
    }
  })
  return ochirilgan
}

// ─── Qarzlar ────────────────────────────────────────────────────────────────

/** Tekshiruvdan oʻtgan qarzni saqlaydi; id va `yaratilgan` shu yerda qoʻyiladi (0047). */
export async function qarzQosh(yangi: YangiQarz): Promise<Qarz> {
  const qarz: Qarz = { ...yangi, id: idYarat(), yaratilgan: hozirYaratilgan() }
  await omborda(QARZLAR_OMBORI, 'readwrite', (ombor) => ombor.add(qarz))
  return qarz
}

/** Formani tekshiradi va toʻgʻri boʻlsa saqlaydi (mezon 3, 4). */
export async function qarzSaqla(forma: QarzFormasi): Promise<Natija<Qarz>> {
  const tekshirilgan = qarzniTekshir(forma)
  if (!tekshirilgan.ok) {
    return tekshirilgan
  }
  const kontakt = await kontaktniOl(tekshirilgan.qiymat.kontaktId)
  if (kontakt === null) {
    return {
      ok: false,
      xatolar: [xato('kontaktId', 'kontakt-topilmadi', 'Kontakt topilmadi.')],
    }
  }
  return { ok: true, qiymat: await qarzQosh(tekshirilgan.qiymat) }
}

/** Bitta qarzni id boʻyicha oʻqiydi. Topilmasa `null`. */
export async function qarzniOl(id: string): Promise<Qarz | null> {
  const natija = await omborda<Qarz | undefined>(QARZLAR_OMBORI, 'readonly', (ombor) =>
    ombor.get(id),
  )
  return natija ?? null
}

/** Hamma qarz — sana boʻyicha, bir kunda `yaratilgan` boʻyicha (0047). */
export async function hammaQarzlar(tartib: Tartib = 'yangidan'): Promise<Qarz[]> {
  const qarzlar = await omborda<Qarz[]>(QARZLAR_OMBORI, 'readonly', (ombor) => ombor.getAll())
  return sanaBoyicha(qarzlar, tartib)
}

/** Bitta kontaktning qarzlari (mezon 3, 4, 7). */
export async function kontaktQarzlari(
  kontaktId: string,
  tartib: Tartib = 'yangidan',
): Promise<Qarz[]> {
  const qarzlar = await omborda<Qarz[]>(QARZLAR_OMBORI, 'readonly', (ombor) =>
    ombor.index('kontaktId').getAll(kontaktId),
  )
  return sanaBoyicha(qarzlar, tartib)
}

/** Qarzning mustaqil nusxasi. */
export function qarzNusxasi(qarz: Qarz): Qarz {
  return { ...qarz }
}

/**
 * Qarzni yangilaydi (0059). `id` va `yaratilgan` oʻzgarmaydi (0047).
 *
 * Summa, sana, hisob va yoʻnalish erkin oʻzgaradi. **Kontakt** oʻzgarmaydi: qarz boshqa
 * kontaktga koʻchirilmaydi. **Valyuta** esa faqat
 * toʻlovsiz qarzda oʻzgartiriladi: toʻlovi bor qarzda valyutani almashtirish
 * saqlangan toʻlovlarni boshqa maʼnoga oʻtkazib yuborardi (qoldiq jimgina notoʻgʻri
 * boʻlardi), shuning uchun rad etiladi.
 */
export async function qarzniYangila(id: string, yangi: YangiQarz): Promise<Natija<Qarz>> {
  const eski = await qarzniOl(id)
  if (eski === null) {
    throw new Error(`Qarz topilmadi: ${id}`)
  }

  // Qarz boshqa kontaktga koʻchirilmaydi (dizayn, 5-boʻlim): tahrirda kontakt qatori
  // umuman oʻzgarmaydi. Doʻkon ham buni taqiqlaydi — ekran adashsa qarz jimgina boshqa
  // odamning kartochkasiga oʻtib ketardi va ikkala kontaktning nettosi buzilardi.
  if (yangi.kontaktId !== eski.kontaktId) {
    return {
      ok: false,
      xatolar: [
        xato('kontaktId', 'qarz-kontakt-ozgarmas', 'Qarz boshqa kontaktga koʻchirilmaydi.'),
      ],
    }
  }

  const tolovlar = await qarzTolovlariniOl(id)

  if (yangi.valyuta !== eski.valyuta && tolovlar.length > 0) {
    return {
      ok: false,
      xatolar: [
        xato(
          'valyuta',
          'qarz-valyuta-ozgarmas',
          'Toʻlovi bor qarzning valyutasi oʻzgartirilmaydi.',
        ),
      ],
    }
  }

  // Yangi summa toʻlangan yigʻindidan chegaradan koʻp past boʻlsa tahrir rad etiladi
  // (0061e; 9b2-band). Chegara ichida past boʻlsa qabul qilinadi va qarz yopiladi —
  // toʻlovlar avtomatik oʻchirilmaydi va kesilmaydi.
  const tolangan = qarzTolangani(eski, tolovlar)
  if (tolangan - yangi.summa > YOPILISH_CHEGARASI[yangi.valyuta]) {
    return {
      ok: false,
      xatolar: [
        xato(
          'summa',
          'qarz-summa-tolovdan-kam',
          `Qarz summasi toʻlovlardan kichik — toʻlangan: ${String(tolangan)}.`,
        ),
      ],
    }
  }

  const qarz: Qarz = { ...yangi, id: eski.id, yaratilgan: eski.yaratilgan }
  await omborda(QARZLAR_OMBORI, 'readwrite', (ombor) => ombor.put(qarz))
  return { ok: true, qiymat: qarz }
}

/** Qarz formasini tekshiradi va toʻgʻri boʻlsa yangilaydi (0059). */
export async function qarzniTahrirla(id: string, forma: QarzFormasi): Promise<Natija<Qarz>> {
  const mavjud = await qarzniOl(id)
  if (mavjud === null) {
    throw new Error(`Qarz topilmadi: ${id}`)
  }
  const tekshirilgan = qarzniTekshir(forma)
  if (!tekshirilgan.ok) {
    return tekshirilgan
  }
  const kontakt = await kontaktniOl(tekshirilgan.qiymat.kontaktId)
  if (kontakt === null) {
    return { ok: false, xatolar: [xato('kontaktId', 'kontakt-topilmadi', 'Kontakt topilmadi.')] }
  }
  return qarzniYangila(id, tekshirilgan.qiymat)
}

/**
 * Qarzni **toʻlovlari bilan birga** oʻchiradi va oʻchirilgan nusxani qaytaradi (0059).
 *
 * Yozuvdagi naqsh (0029): bazada «oʻchirilgan» bayrogʻi yoʻq, ekran nusxani 7 soniya
 * ushlab turadi va bosilsa `qarzniQaytar` ga beradi (0048).
 */
export async function qarzniOchir(id: string): Promise<OchirilganQarz> {
  const qarz = await qarzniOl(id)
  if (qarz === null) {
    throw new Error(`Qarz topilmadi: ${id}`)
  }
  const tolovlar = await qarzTolovlariniOl(id)
  await amalda([QARZLAR_OMBORI, TOLOVLAR_OMBORI], 'readwrite', (amal) => {
    for (const tolov of tolovlar) {
      amal.objectStore(TOLOVLAR_OMBORI).delete(tolov.id)
    }
    amal.objectStore(QARZLAR_OMBORI).delete(id)
  })
  return { qarz, tolovlar }
}

/** Oʻchirilgan qarzni toʻlovlari bilan birga joyiga qaytaradi (0059). */
export async function qarzniQaytar(ochirilgan: OchirilganQarz): Promise<OchirilganQarz> {
  await amalda([QARZLAR_OMBORI, TOLOVLAR_OMBORI], 'readwrite', (amal) => {
    amal.objectStore(QARZLAR_OMBORI).put(ochirilgan.qarz)
    for (const tolov of ochirilgan.tolovlar) {
      amal.objectStore(TOLOVLAR_OMBORI).put(tolov)
    }
  })
  return ochirilgan
}

// ─── Toʻlovlar ──────────────────────────────────────────────────────────────

/** Tekshiruvdan oʻtgan toʻlovni saqlaydi; id va `yaratilgan` shu yerda (0047; 15c-band). */
export async function tolovQosh(yangi: YangiTolov): Promise<Tolov> {
  const tolov: Tolov = { ...yangi, id: idYarat(), yaratilgan: hozirYaratilgan() }
  await omborda(TOLOVLAR_OMBORI, 'readwrite', (ombor) => ombor.add(tolov))
  return tolov
}

/**
 * Toʻlov formasini tekshiradi va toʻgʻri boʻlsa saqlaydi.
 *
 * Qarz va uning mavjud toʻlovlari shu yerda oʻqiladi: kurs kerakligi qarz valyutasidan,
 * toʻlov chegarasi esa qolgan qoldiqdan chiqadi (0023, 0061).
 */
export async function tolovSaqla(forma: TolovFormasi): Promise<Natija<Tolov>> {
  const qarz = await qarzniOl(forma.qarzId)
  if (qarz === null) {
    return { ok: false, xatolar: [xato('qarzId', 'qarz-topilmadi', 'Qarz topilmadi.')] }
  }
  const tolovlar = await qarzTolovlariniOl(qarz.id)
  const tekshirilgan = tolovniTekshir(forma, qarz, tolovlar)
  if (!tekshirilgan.ok) {
    return tekshirilgan
  }
  return { ok: true, qiymat: await tolovQosh(tekshirilgan.qiymat) }
}

/** Bitta toʻlovni id boʻyicha oʻqiydi. Topilmasa `null`. */
export async function tolovniOl(id: string): Promise<Tolov | null> {
  const natija = await omborda<Tolov | undefined>(TOLOVLAR_OMBORI, 'readonly', (ombor) =>
    ombor.get(id),
  )
  return natija ?? null
}

/** Hamma toʻlov — qoldiq va «oxirgi kurs» hisobi uchun. */
export async function hammaTolovlar(tartib: Tartib = 'yangidan'): Promise<Tolov[]> {
  const tolovlar = await omborda<Tolov[]>(TOLOVLAR_OMBORI, 'readonly', (ombor) => ombor.getAll())
  return sanaBoyicha(tolovlar, tartib)
}

/** Bitta qarzning toʻlovlari — tarix shu roʻyxatdan chiziladi (mezon 7). */
export async function qarzTolovlariniOl(
  qarzId: string,
  tartib: Tartib = 'yangidan',
): Promise<Tolov[]> {
  const tolovlar = await omborda<Tolov[]>(TOLOVLAR_OMBORI, 'readonly', (ombor) =>
    ombor.index('qarzId').getAll(qarzId),
  )
  return sanaBoyicha(tolovlar, tartib)
}

/**
 * Toʻlovni darhol oʻchiradi va oʻchirilgan nusxani qaytaradi (0029; mezon 8, 9).
 * Qoldiq oʻz-oʻzidan tiklanadi — u saqlanmaydi (0016).
 */
export async function tolovniOchir(id: string): Promise<Tolov> {
  const tolov = await tolovniOl(id)
  if (tolov === null) {
    throw new Error(`Toʻlov topilmadi: ${id}`)
  }
  await omborda(TOLOVLAR_OMBORI, 'readwrite', (ombor) => ombor.delete(id))
  return tolov
}

/** Oʻchirilgan toʻlovni oʻsha id va `yaratilgan` bilan qaytaradi (mezon 9). */
export async function tolovniQaytar(tolov: Tolov): Promise<Tolov> {
  await omborda(TOLOVLAR_OMBORI, 'readwrite', (ombor) => ombor.put(tolov))
  return tolov
}

/** Toʻlovning mustaqil nusxasi — «qaytarish» uchun ushlab turishga qulay. */
export function tolovNusxasi(tolov: Tolov): Tolov {
  return { ...tolov }
}

// ─── Ekranga tayyor koʻrinishlar ────────────────────────────────────────────

/** Bitta qarzning holati: toʻlovlari, qoldigʻi va yopiqligi (0016, 0052). */
export async function qarzHolatiniOl(qarzId: string): Promise<QarzHolati> {
  const qarz = await qarzniOl(qarzId)
  if (qarz === null) {
    throw new Error(`Qarz topilmadi: ${qarzId}`)
  }
  const tolovlar = await qarzTolovlariniOl(qarzId)
  return {
    qarz,
    tolovlar,
    qoldiq: qarzQoldigi(qarz, tolovlar),
    tolangan: qarzTolangani(qarz, tolovlar),
    yopiq: qarzYopiqmi(qarz, tolovlar),
  }
}

/** Kontakt kartasi: qarzlari holati va netto qatorlari (0037, 0056). */
export async function kontaktHolatiniOl(kontaktId: string): Promise<KontaktHolati> {
  const kontakt = await kontaktniOl(kontaktId)
  if (kontakt === null) {
    throw new Error(`Kontakt topilmadi: ${kontaktId}`)
  }
  const qarzlar = await kontaktQarzlari(kontaktId)
  const tolovlar: Tolov[] = []
  for (const qarz of qarzlar) {
    tolovlar.push(...(await qarzTolovlariniOl(qarz.id)))
  }
  return holatniYig(kontakt, qarzlar, tolovlar)
}

/** Hamma kontakt — har biri oʻz nettosi bilan (kontaktlar roʻyxati ekrani uchun). */
export async function kontaktHolatlari(): Promise<KontaktHolati[]> {
  const kontaktlar = await hammaKontaktlar()
  const qarzlar = await hammaQarzlar()
  const tolovlar = await hammaTolovlar()

  return kontaktlar.map((kontakt) => {
    const oziniki = qarzlar.filter((qarz) => qarz.kontaktId === kontakt.id)
    const idlar = new Set(oziniki.map((qarz) => qarz.id))
    return holatniYig(
      kontakt,
      oziniki,
      tolovlar.filter((tolov) => idlar.has(tolov.qarzId)),
    )
  })
}

/** Kontakt holatini bitta joyda yigʻadi — ikkala oʻqish yoʻli bir xil natija bersin. */
function holatniYig(
  kontakt: Kontakt,
  qarzlar: readonly Qarz[],
  tolovlar: readonly Tolov[],
): KontaktHolati {
  const holatlar: QarzHolati[] = qarzlar.map((qarz) => {
    const oziniki = tolovlar.filter((tolov) => tolov.qarzId === qarz.id)
    return {
      qarz,
      tolovlar: [...oziniki],
      qoldiq: qarzQoldigi(qarz, oziniki),
      tolangan: qarzTolangani(qarz, oziniki),
      yopiq: qarzYopiqmi(qarz, oziniki),
    }
  })

  return {
    kontakt,
    qarzlar: holatlar,
    netto: kontaktNettosi(qarzlar, tolovlar),
    ochiqQarziBormi: holatlar.some((holat) => !holat.yopiq),
  }
}

/**
 * Qarz va toʻlovlarning hisob × valyuta qoldigʻiga taʼsiri (0017, 0035).
 * `yozuvlar.ts` dagi `qoldiqlarniOl` shuni yozuvlarniki bilan qoʻshib beradi.
 */
export async function qarzQoldiqlariniOl(): Promise<Qoldiqlar> {
  return qarzQoldiqlari(await hammaQarzlar(), await hammaTolovlar())
}
