// Qarz daftarining sof mantiqi: kontakt, qarz va toʻlov tekshiruvi, qoldiq hisobi,
// yopilish chegarasi va kontakt nettosi. Bazaga bogʻliq emas.
//
// Asosiy qoidalar:
// - qarz oʻz valyutasida yuritiladi; boshqa valyutadagi toʻlov **toʻlov kursida**
//   aylantirilib qoldiqdan ayiriladi (0023, 0042);
// - qoldiq va yopiqlik hech qayerda saqlanmaydi — har safar toʻlovlardan hisoblanadi
//   (0016), yopiqlik chegarasi 0052 da: dollarda ≤ 1 sent, soʻmda ≤ 100 soʻm;
// - kontakt nettosi faqat **ochiq** qarzlardan yigʻiladi va faqat koʻrsatish uchun
//   (0037, 0056) — qarzning yopilishi har doim oʻz qoldigʻi bilan aniqlanadi.

import {
  dollarSomgaSigadimi,
  dollarniSomga,
  kursniOqi,
  somDollargaSigadimi,
  somniDollarga,
  summaniMatnga,
  summaniOqi,
} from './pul.ts'
import { bugun, sananiTekshir } from './sana.ts'
import type {
  Hisob,
  Kontakt,
  KontaktFormasi,
  Natija,
  NettoQatori,
  Qarz,
  QarzFormasi,
  QarzYonalishi,
  Tolov,
  TolovFormasi,
  Valyuta,
  Xato,
  YangiKontakt,
  YangiQarz,
  YangiTolov,
} from './turlar.ts'
import {
  HISOBLAR,
  QARZ_YONALISHLARI,
  STANDART_HISOB,
  STANDART_VALYUTA,
  VALYUTALAR,
  YOPILISH_CHEGARASI,
  ha,
  xato,
} from './turlar.ts'

export { YOPILISH_CHEGARASI } from './turlar.ts'

// ─── Kontakt ────────────────────────────────────────────────────────────────

/** Yangi kontakt formasi: ikkala maydon ham boʻsh (0031). */
export function boshlangichKontaktFormasi(): KontaktFormasi {
  return { ism: '', telefon: '' }
}

/** Saqlangan kontaktni tahrirlash formasiga qaytaradi (0015). */
export function kontaktFormaQiymatlari(kontakt: Kontakt): KontaktFormasi {
  return { ism: kontakt.ism, telefon: kontakt.telefon ?? '' }
}

/**
 * Kontaktni tekshiradi: ism majburiy, telefon ixtiyoriy (0031; mezon 1, 2).
 *
 * Telefon formati tekshirilmaydi — u faqat koʻrsatish uchun saqlanadi. Boʻsh telefon
 * maydon boʻlib saqlanmaydi (izohdagi naqsh).
 */
export function kontaktniTekshir(forma: KontaktFormasi): Natija<YangiKontakt> {
  const ism = forma.ism.trim()
  if (ism === '') {
    return { ok: false, xatolar: [xato('ism', 'kontakt-ism-bosh', 'Ism kiriting.')] }
  }
  const telefon = forma.telefon.trim()
  return ha(telefon === '' ? { ism } : { ism, telefon })
}

// ─── Qarz ───────────────────────────────────────────────────────────────────

/**
 * Yangi qarz formasi: sana bugungi kun, hisob «karta», valyuta soʻm (0035, 0023).
 *
 * `yonalishi` boshida boʻsh — standart yoʻnalish yoʻq (0050 ruhi: berdim/oldim
 * chalkashishi bir bosishdan qimmat). Ekran formani «berdim» yoki «oldim» tugmasidan
 * ochsa, oʻsha yoʻnalishni ikkinchi parametrda beradi.
 */
export function boshlangichQarzFormasi(
  kontaktId: string,
  yonalishi: QarzYonalishi | '' = '',
): QarzFormasi {
  return {
    kontaktId,
    yonalishi,
    summa: '',
    sana: bugun(),
    hisob: STANDART_HISOB,
    valyuta: STANDART_VALYUTA,
  }
}

/** Saqlangan qarzni tahrirlash formasiga qaytaradi (0059). */
export function qarzFormaQiymatlari(qarz: Qarz): QarzFormasi {
  return {
    kontaktId: qarz.kontaktId,
    yonalishi: qarz.yonalishi,
    summa: summaniMatnga(qarz.summa, qarz.valyuta),
    sana: qarz.sana,
    hisob: qarz.hisob,
    valyuta: qarz.valyuta,
  }
}

/**
 * Qarz formasini tekshiradi va saqlashga tayyor qarz qaytaradi.
 * Xato boʻlsa hamma sabab birdaniga qaytadi — yozuv formasidagi naqsh (mezon 2).
 *
 * Kurs bu yerda umuman soʻralmaydi: qarz oʻz valyutasida yuritiladi (0023).
 */
export function qarzniTekshir(forma: QarzFormasi): Natija<YangiQarz> {
  const xatolar: Xato[] = []

  const valyutaTogri = (VALYUTALAR as readonly string[]).includes(forma.valyuta)
  const valyuta: Valyuta = valyutaTogri ? forma.valyuta : STANDART_VALYUTA
  if (!valyutaTogri) {
    xatolar.push(xato('valyuta', 'valyuta-notogri', 'Valyuta faqat soʻm yoki dollar boʻladi.'))
  }

  let summa: number | null = null
  const oqilganSumma = summaniOqi(forma.summa, valyuta)
  if (oqilganSumma.ok) {
    summa = oqilganSumma.qiymat
  } else {
    xatolar.push(...oqilganSumma.xatolar)
  }

  let yonalishi: QarzYonalishi | null = null
  if (forma.yonalishi === '') {
    xatolar.push(xato('yonalishi', 'yonalish-bosh', 'Qarz berdingizmi yoki oldingizmi?'))
  } else if (!(QARZ_YONALISHLARI as readonly string[]).includes(forma.yonalishi)) {
    xatolar.push(xato('yonalishi', 'yonalish-notogri', 'Qarz yoʻnalishi notoʻgʻri.'))
  } else {
    yonalishi = forma.yonalishi
  }

  const kontaktId = forma.kontaktId.trim()
  if (kontaktId === '') {
    xatolar.push(xato('kontaktId', 'kontakt-bosh', 'Kontakt tanlanmagan.'))
  }

  let sana: string | null = null
  const tekshirilganSana = sananiTekshir(forma.sana)
  if (tekshirilganSana.ok) {
    sana = tekshirilganSana.qiymat
  } else {
    xatolar.push(...tekshirilganSana.xatolar)
  }

  const hisobTogri = (HISOBLAR as readonly string[]).includes(forma.hisob)
  const hisob: Hisob = hisobTogri ? forma.hisob : STANDART_HISOB
  if (!hisobTogri) {
    xatolar.push(xato('hisob', 'hisob-notogri', 'Hisob faqat naqd yoki karta boʻladi.'))
  }

  if (xatolar.length > 0 || summa === null || yonalishi === null || sana === null) {
    return { ok: false, xatolar }
  }

  return ha({ kontaktId, yonalishi, summa, valyuta, sana, hisob })
}

// ─── Toʻlov ─────────────────────────────────────────────────────────────────

/**
 * Yangi toʻlov formasi: valyuta — qarzning oʻz valyutasi (koʻp holatda toʻlov ham
 * shunday keladi va kurs soʻralmaydi, mezon 12), hisob «karta» (0035), sana bugun.
 */
export function boshlangichTolovFormasi(qarz: Qarz): TolovFormasi {
  return {
    qarzId: qarz.id,
    summa: '',
    sana: bugun(),
    hisob: STANDART_HISOB,
    valyuta: qarz.valyuta,
    kurs: '',
  }
}

/** Saqlangan toʻlovni forma qiymatlariga qaytaradi. */
export function tolovFormaQiymatlari(tolov: Tolov): TolovFormasi {
  return {
    qarzId: tolov.qarzId,
    summa: summaniMatnga(tolov.summa, tolov.valyuta),
    sana: tolov.sana,
    hisob: tolov.hisob,
    valyuta: tolov.valyuta,
    kurs: tolov.kurs === undefined ? '' : String(tolov.kurs),
  }
}

/**
 * Toʻlov formasini tekshiradi. Qarz kerak: kurs soʻralishi va aylantirish uning
 * valyutasiga bogʻliq (0023); qarzning qolgan qoldigʻi esa toʻlov chegarasini beradi.
 *
 * - toʻlov qarz valyutasida boʻlsa — kurs soʻralmaydi va kiritilgan boʻlsa ham
 *   saqlanmaydi (mezon 12; soʻm yozuvidagi naqsh);
 * - boshqa valyutada boʻlsa — kurs majburiy, butun soʻmda va musbat (0042, 0049);
 * - aylantirish natijasi xavfsiz butun son chegarasiga sigishi tekshiriladi
 *   (KELISHUV 11-boʻlim; spec 13a);
 * - **yopilgan qarzga toʻlov qoʻshilmaydi** (0061c);
 * - aylantirilgan qiymat **nol** boʻlsa toʻlov rad etiladi (0061b) — aks holda qarz
 *   qoldigʻi oʻzgarmasdan pul qoldigʻi harakat qilardi;
 * - aylantirilgan qiymat qoldiqdan 0052 chegarasidan koʻp oshsa rad etiladi (0061a);
 *   chegara ichida oshsa qabul qilinadi va qarz qoldigʻi nolga tushadi.
 *
 * `tolovlar` — shu qarzning allaqachon saqlangan toʻlovlari; berilmasa qarz toʻlovsiz
 * deb qaraladi.
 */
export function tolovniTekshir(
  forma: TolovFormasi,
  qarz: Qarz,
  tolovlar: readonly Tolov[] = [],
): Natija<YangiTolov> {
  const xatolar: Xato[] = []

  const valyutaTogri = (VALYUTALAR as readonly string[]).includes(forma.valyuta)
  const valyuta: Valyuta = valyutaTogri ? forma.valyuta : qarz.valyuta
  if (!valyutaTogri) {
    xatolar.push(xato('valyuta', 'valyuta-notogri', 'Valyuta faqat soʻm yoki dollar boʻladi.'))
  }

  let summa: number | null = null
  const oqilganSumma = summaniOqi(forma.summa, valyuta)
  if (oqilganSumma.ok) {
    summa = oqilganSumma.qiymat
  } else {
    xatolar.push(...oqilganSumma.xatolar)
  }

  let sana: string | null = null
  const tekshirilganSana = sananiTekshir(forma.sana)
  if (tekshirilganSana.ok) {
    sana = tekshirilganSana.qiymat
  } else {
    xatolar.push(...tekshirilganSana.xatolar)
  }

  const hisobTogri = (HISOBLAR as readonly string[]).includes(forma.hisob)
  const hisob: Hisob = hisobTogri ? forma.hisob : STANDART_HISOB
  if (!hisobTogri) {
    xatolar.push(xato('hisob', 'hisob-notogri', 'Hisob faqat naqd yoki karta boʻladi.'))
  }

  // Kurs faqat valyutalar farq qilganda soʻraladi (mezon 12).
  const aylantiriladi = valyuta !== qarz.valyuta
  let kurs: number | null = null
  if (aylantiriladi) {
    const oqilganKurs = kursniOqi(forma.kurs)
    if (oqilganKurs.ok) {
      kurs = oqilganKurs.qiymat
    } else {
      xatolar.push(...oqilganKurs.xatolar)
    }
  }

  // Aylantirish oraliq koʻpaytmasi chegaraga sigmasa natija jimgina notoʻgʻri
  // boʻlib qolardi — sabab summa maydoniga qoʻyiladi (KELISHUV 11-boʻlim).
  let sigadi = true
  if (aylantiriladi && summa !== null && kurs !== null) {
    sigadi = valyuta === 'dollar' ? dollarSomgaSigadimi(summa, kurs) : somDollargaSigadimi(summa)
    if (!sigadi) {
      xatolar.push(xato('summa', 'summa-notogri', 'Summa juda katta.'))
    }
  }

  // Qarz allaqachon yopilgan boʻlsa toʻlov qabul qilinmaydi (0061c). Yopiqlik shu
  // yerda ham qoldiqdan hisoblanadi — hech qanday holat maydoni yoʻq (0016).
  const qoldiq = qarzQoldigi(qarz, tolovlar)
  const oqildi = summa !== null && sigadi && (!aylantiriladi || kurs !== null)
  if (qoldiqYopiqmi(qoldiq, qarz.valyuta)) {
    xatolar.push(xato('qarzId', 'qarz-yopiq', 'Qarz yopilgan — unga toʻlov qoʻshilmaydi.'))
  } else if (oqildi && summa !== null) {
    const aylantirilgan = tolovQarzValyutasida(
      {
        qarzId: qarz.id,
        summa,
        valyuta,
        sana: forma.sana,
        hisob,
        ...(kurs === null ? {} : { kurs }),
      },
      qarz.valyuta,
    )
    if (aylantirilgan === 0) {
      // Aylantirilganda nolga tushadigan toʻlov qarz qoldigʻini oʻzgartirmasdan
      // pul qoldigʻini qimirlatardi — bu jimgina xato boʻlardi (0061b).
      xatolar.push(
        xato('summa', 'tolov-nol-aylanma', 'Toʻlov juda kichik — qarz valyutasida nolga aylanadi.'),
      )
    } else if (aylantirilgan - qoldiq > YOPILISH_CHEGARASI[qarz.valyuta]) {
      xatolar.push(xato('summa', 'tolov-ortiqcha', 'Toʻlov qarz qoldigʻidan katta.'))
    }
  }

  if (xatolar.length > 0 || summa === null || sana === null) {
    return { ok: false, xatolar }
  }

  const asos = { qarzId: qarz.id, summa, valyuta, sana, hisob }
  return ha(kurs === null ? asos : { ...asos, kurs })
}

// ─── Qoldiq va yopilish ─────────────────────────────────────────────────────

/**
 * Toʻlov summasini qarz valyutasiga aylantiradi (0023, 0042).
 *
 * Bir xil valyutada aylantirish yoʻq. Boshqa valyutada — **toʻlov paytida kiritilgan**
 * kurs bilan, natija eng yaqin butun birlikka yaxlitlanadi (mezon 10, 10a).
 */
export function tolovQarzValyutasida(
  tolov: YangiTolov,
  qarzValyutasi: Valyuta,
): number {
  if (tolov.valyuta === qarzValyutasi) {
    return tolov.summa
  }
  if (tolov.kurs === undefined) {
    // Tekshiruvdan oʻtgan toʻlovda bu holat boʻlmaydi; maʼlumot buzilgan boʻlsa
    // jimgina notoʻgʻri raqam berishdan koʻra ochiq xato yaxshi.
    throw new Error(`Toʻlovda kurs yoʻq: ${tolov.qarzId}`)
  }
  return tolov.valyuta === 'dollar'
    ? dollarniSomga(tolov.summa, tolov.kurs)
    : somniDollarga(tolov.summa, tolov.kurs)
}

/**
 * Shu qarzga **toʻlangan yigʻindi** — qarzning oʻz valyutasida (0059 9b2-band).
 *
 * Boshqa valyutadagi toʻlovlar oʻz kursida aylantirilib qoʻshiladi (0023, 0042).
 * Qarz summasini tahrirlash chegarasi va «toʻlangan: …» xato matni shundan chiqadi.
 */
export function qarzTolangani(qarz: Qarz, tolovlar: readonly Tolov[]): number {
  let yigindi = 0
  for (const tolov of tolovlar) {
    yigindi += tolovQarzValyutasida(tolov, qarz.valyuta)
  }
  return yigindi
}

/**
 * Toʻlov formasidagi summa qarz valyutasida qanchaga tushishini oldindan aytadi
 * (0061 10e-band; mezon 44) — «Qarzdan ayiriladi: 50,00 $» qatori uchun.
 *
 * `null` — summa yoki (kerak boʻlganda) kurs hali toʻgʻri kiritilmagan: oʻshanda ekran
 * qatorni umuman chizmaydi. Yaxlitlash qoidasi saqlashdagi bilan **bir xil** — raqam
 * ikki joyda ikki xil chiqmasin.
 */
export function tolovOldindanKorish(forma: TolovFormasi, qarz: Qarz): number | null {
  const valyuta: Valyuta = (VALYUTALAR as readonly string[]).includes(forma.valyuta)
    ? forma.valyuta
    : qarz.valyuta

  const summa = summaniOqi(forma.summa, valyuta)
  if (!summa.ok) {
    return null
  }
  if (valyuta === qarz.valyuta) {
    return summa.qiymat
  }

  const kurs = kursniOqi(forma.kurs)
  if (!kurs.ok) {
    return null
  }
  const sigadi =
    valyuta === 'dollar'
      ? dollarSomgaSigadimi(summa.qiymat, kurs.qiymat)
      : somDollargaSigadimi(summa.qiymat)
  if (!sigadi) {
    return null
  }

  return valyuta === 'dollar'
    ? dollarniSomga(summa.qiymat, kurs.qiymat)
    : somniDollarga(summa.qiymat, kurs.qiymat)
}

/** Berilgan roʻyxatdan faqat shu qarzning toʻlovlarini ajratadi. */
export function qarzTolovlari(tolovlar: readonly Tolov[], qarzId: string): Tolov[] {
  return tolovlar.filter((tolov) => tolov.qarzId === qarzId)
}

/**
 * Qarz qoldigʻi — qarz valyutasida, eng kichik birlikda (0016).
 *
 * Hech qayerda saqlanmaydi: har safar qarz summasidan toʻlovlar ayirilib hisoblanadi,
 * shuning uchun toʻlov oʻchirilsa yoki qaytarilsa qoldiq oʻz-oʻzidan toʻgʻrilanadi
 * (mezon 8, 9). Berilgan roʻyxat shu qarzniki deb qabul qilinadi.
 *
 * Qoldiq **manfiy koʻrsatilmaydi**: 0061 boʻyicha toʻlov qoldiqdan 0052 chegarasidan
 * koʻp osha olmaydi, chegara ichida oshgani esa qoldiqni nolga tushiradi. Manfiy raqam
 * ekranga chiqsa foydalanuvchi uni «daftar menga qarzdor» deb oʻqirdi.
 */
export function qarzQoldigi(qarz: Qarz, tolovlar: readonly Tolov[]): number {
  let qoldiq = qarz.summa
  for (const tolov of tolovlar) {
    qoldiq -= tolovQarzValyutasida(tolov, qarz.valyuta)
  }
  return qoldiq < 0 ? 0 : qoldiq
}

/** Qoldiq 0052 dagi chegaradan oshmasa qarz yopilgan sanaladi. */
export function qoldiqYopiqmi(qoldiq: number, valyuta: Valyuta): boolean {
  return qoldiq <= YOPILISH_CHEGARASI[valyuta]
}

/**
 * Qarz yopilganmi (0016, 0052): qoldiq dollarda ≤ 1 sent, soʻmda ≤ 100 soʻm.
 * Yoʻnalish ahamiyatsiz — «berdim» ham, «oldim» ham bir xil chegara bilan yopiladi.
 */
export function qarzYopiqmi(qarz: Qarz, tolovlar: readonly Tolov[]): boolean {
  return qoldiqYopiqmi(qarzQoldigi(qarz, tolovlar), qarz.valyuta)
}

/** Faqat ochiq qarzlar — chegara ichida yopilgani chiqib ketadi (0052, 0056). */
export function ochiqQarzlar(qarzlar: readonly Qarz[], tolovlar: readonly Tolov[]): Qarz[] {
  return qarzlar.filter((qarz) => !qarzYopiqmi(qarz, qarzTolovlari(tolovlar, qarz.id)))
}

/**
 * Kontakt netto qoldigʻi — valyuta boʻyicha alohida qatorlar (0037, 0056).
 *
 * Faqat **ochiq** qarzlar qatnashadi: chegara bilan yopilgan qarzning mikro-qoldigʻi
 * kontakt ekranida umuman koʻrinmaydi (0056; mezon 15f, 15g). Qator faqat oʻsha
 * valyutada ochiq qarz boʻlganda yasaladi (mezon 15d) — netto nol boʻlsa ham qator
 * qoladi, chunki ochiq qarz bor (mezon 15e).
 *
 * Belgi: musbat — kontakt menga qarzdor, manfiy — men unga qarzdorman.
 * Netto faqat koʻrsatish uchun: qarz yopilishi bunga bogʻliq emas (0037, 7b-band).
 */
export function kontaktNettosi(
  qarzlar: readonly Qarz[],
  tolovlar: readonly Tolov[],
): NettoQatori[] {
  const yigindi = new Map<Valyuta, number>()
  for (const qarz of ochiqQarzlar(qarzlar, tolovlar)) {
    const qoldiq = qarzQoldigi(qarz, qarzTolovlari(tolovlar, qarz.id))
    const belgili = qarz.yonalishi === 'berdim' ? qoldiq : -qoldiq
    yigindi.set(qarz.valyuta, (yigindi.get(qarz.valyuta) ?? 0) + belgili)
  }

  // Tartib VALYUTALAR roʻyxatidan olinadi: avval soʻm, keyin dollar — barqaror boʻlsin.
  const qatorlar: NettoQatori[] = []
  for (const valyuta of VALYUTALAR) {
    const netto = yigindi.get(valyuta)
    if (netto !== undefined) {
      qatorlar.push({ valyuta, netto })
    }
  }
  return qatorlar
}
