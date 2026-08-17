// Yozuv tekshiruvi: formadagi qiymatlardan saqlashga tayyor yozuv yasaydi.
//
// Majburiy: summa, kirim/chiqim, kategoriya (0012). Sana bugun yoki undan oldin (0034).
// Izoh ixtiyoriy (0012). Hisob va valyuta formada tayyor turadi (0011, 0023).
// Kurs faqat dollar tanlanganda soʻraladi va oʻshanda majburiy (0023, 0042).

import { kursniOqi, summaniMatnga, summaniOqi } from './pul.ts'
import { bugun, sananiTekshir } from './sana.ts'
import type {
  Hisob,
  Natija,
  Valyuta,
  Xato,
  YangiYozuv,
  Yozuv,
  YozuvFormasi,
  YozuvTuri,
} from './turlar.ts'
import {
  HISOBLAR,
  STANDART_HISOB,
  STANDART_VALYUTA,
  VALYUTALAR,
  YOZUV_TURLARI,
  ha,
  xato,
} from './turlar.ts'

/** Yangi forma qanday ochiladi: sana bugungi kun, hisob karta, valyuta soʻm (mezon 3). */
export function boshlangichForma(): YozuvFormasi {
  return {
    summa: '',
    turi: '',
    kategoriyaId: '',
    sana: bugun(),
    izoh: '',
    hisob: STANDART_HISOB,
    valyuta: STANDART_VALYUTA,
    kurs: '',
  }
}

/** Saqlangan yozuvni tahrirlash formasiga qaytaradi (0014). */
export function formaQiymatlari(yozuv: Yozuv): YozuvFormasi {
  return {
    summa: summaniMatnga(yozuv.summa, yozuv.valyuta),
    turi: yozuv.turi,
    kategoriyaId: yozuv.kategoriyaId,
    sana: yozuv.sana,
    izoh: yozuv.izoh ?? '',
    hisob: yozuv.hisob,
    valyuta: yozuv.valyuta,
    kurs: yozuv.valyuta === 'dollar' ? String(yozuv.kurs) : '',
  }
}

/**
 * Formani tekshiradi va saqlashga tayyor yozuv qaytaradi.
 * Xato boʻlsa — hamma sabab birdaniga qaytadi, maydoni va kodi bilan (mezon 2).
 */
export function yozuvniTekshir(forma: YozuvFormasi): Natija<YangiYozuv> {
  const xatolar: Xato[] = []

  // Valyuta avval aniqlanadi: summani qaysi qoida bilan oʻqish shunga bogʻliq (0033).
  const valyutaTogri = (VALYUTALAR as readonly string[]).includes(forma.valyuta)
  const valyuta: Valyuta = valyutaTogri ? forma.valyuta : STANDART_VALYUTA

  let summa: number | null = null
  const oqilganSumma = summaniOqi(forma.summa, valyuta)
  if (oqilganSumma.ok) {
    summa = oqilganSumma.qiymat
  } else {
    xatolar.push(...oqilganSumma.xatolar)
  }

  let turi: YozuvTuri | null = null
  if (forma.turi === '') {
    xatolar.push(xato('turi', 'turi-bosh', 'Kirim yoki chiqim tanlanmagan.'))
  } else if (!(YOZUV_TURLARI as readonly string[]).includes(forma.turi)) {
    xatolar.push(xato('turi', 'turi-notogri', 'Yozuv turi notoʻgʻri.'))
  } else {
    turi = forma.turi
  }

  const kategoriyaId = forma.kategoriyaId.trim()
  if (kategoriyaId === '') {
    xatolar.push(xato('kategoriyaId', 'kategoriya-bosh', 'Kategoriya tanlanmagan.'))
  }

  let sana: string | null = null
  const tekshirilganSana = sananiTekshir(forma.sana)
  if (tekshirilganSana.ok) {
    sana = tekshirilganSana.qiymat
  } else {
    xatolar.push(...tekshirilganSana.xatolar)
  }

  if (!valyutaTogri) {
    xatolar.push(xato('valyuta', 'valyuta-notogri', 'Valyuta faqat soʻm yoki dollar boʻladi.'))
  }

  const hisobTogri = (HISOBLAR as readonly string[]).includes(forma.hisob)
  const hisob: Hisob = hisobTogri ? forma.hisob : STANDART_HISOB
  if (!hisobTogri) {
    xatolar.push(xato('hisob', 'hisob-notogri', 'Hisob faqat naqd yoki karta boʻladi.'))
  }

  // Kurs faqat dollarda soʻraladi; soʻmdagi yozuvda u umuman saqlanmaydi (mezon 6, 7).
  let kurs: number | null = null
  if (valyuta === 'dollar') {
    const oqilganKurs = kursniOqi(forma.kurs)
    if (oqilganKurs.ok) {
      kurs = oqilganKurs.qiymat
    } else {
      xatolar.push(...oqilganKurs.xatolar)
    }
  }

  if (xatolar.length > 0 || summa === null || turi === null || sana === null) {
    return { ok: false, xatolar }
  }

  const izoh = forma.izoh.trim()
  const asos = {
    turi,
    summa,
    kategoriyaId,
    sana,
    hisob,
    ...(izoh === '' ? {} : { izoh }),
  }

  if (valyuta === 'dollar') {
    if (kurs === null) {
      return { ok: false, xatolar }
    }
    return ha({ ...asos, valyuta, kurs })
  }
  return ha({ ...asos, valyuta })
}
