// Hisob qoldigʻi: hisob × valyuta boʻyicha alohida hisoblanadi (0011, 0023).
//
// Kirim koʻpaytiradi, chiqim kamaytiradi (mezon 8). Dollardagi yozuv faqat dollar
// qoldigʻiga tushadi — soʻm qoldigʻiga tegmaydi (mezon 9).
// Qoldiq hech qayerda saqlanmaydi: har safar joriy yozuvlardan sanaladi, shuning uchun
// tahrir, oʻchirish va qaytarish oʻz-oʻzidan toʻgʻri natija beradi (0014; mezon 10, 11).

import { dollarniSomga } from './pul.ts'
import type { Qarz, Qoldiqlar, Tolov, ValyutaQoldigi, Yozuv } from './turlar.ts'

/** Boʻsh qoldiq — hisoblashning boshlangʻich holati. */
function nolQoldiq(): Qoldiqlar {
  return { naqd: { som: 0, dollar: 0 }, karta: { som: 0, dollar: 0 } }
}

/** Yozuvlardan hisob × valyuta qoldiqlarini sanaydi. */
export function qoldiqlar(yozuvlar: readonly Yozuv[]): Qoldiqlar {
  const natija: Qoldiqlar = nolQoldiq()
  for (const yozuv of yozuvlar) {
    const ozgarish = yozuv.turi === 'kirim' ? yozuv.summa : -yozuv.summa
    natija[yozuv.hisob][yozuv.valyuta] += ozgarish
  }
  return natija
}

/**
 * Qarz va toʻlovlardan hisob × valyuta qoldiqlarini sanaydi (0017, 0035).
 *
 * - qarzga berilgan pul tanlangan hisobdan **chiqadi** (mezon 13);
 * - olingan qarz tanlangan hisobga **kiradi** (mezon 14);
 * - toʻlov teskari yoʻnalishda ishlaydi: men bergan qarzga toʻlov kirim (mezon 15),
 *   men olgan qarzni qaytarsam chiqim.
 *
 * Pul har doim **operatsiyaning oʻz valyutasida** harakat qiladi: dollar qarziga
 * soʻmda toʻlansa, soʻm qoldigʻi ortadi, qarzning oʻzi esa dollarda kamayadi (0023).
 * Bu yerda hech qanday chegara ishlatilmaydi — hisob qoldigʻi haqiqiy pul harakatidan
 * chiqadi va 0052/0056 chegarasi unga tegmaydi (mezon 15h).
 */
export function qarzQoldiqlari(
  qarzlar: readonly Qarz[],
  tolovlar: readonly Tolov[],
): Qoldiqlar {
  const natija: Qoldiqlar = nolQoldiq()
  const yonalishlar = new Map(qarzlar.map((qarz) => [qarz.id, qarz.yonalishi]))

  for (const qarz of qarzlar) {
    const ozgarish = qarz.yonalishi === 'berdim' ? -qarz.summa : qarz.summa
    natija[qarz.hisob][qarz.valyuta] += ozgarish
  }

  for (const tolov of tolovlar) {
    const yonalishi = yonalishlar.get(tolov.qarzId)
    if (yonalishi === undefined) {
      // Qarzsiz toʻlov — maʼlumot buzilgan holat; qoldiqni buzmasin.
      continue
    }
    const ozgarish = yonalishi === 'berdim' ? tolov.summa : -tolov.summa
    natija[tolov.hisob][tolov.valyuta] += ozgarish
  }

  return natija
}

/**
 * Bir nechta qoldiq toʻplamini qoʻshadi — yozuvlarniki va qarzlarniki bitta jadvalga
 * tushsin (mezon 15b). Kiritilgan qiymatlar oʻzgarmaydi, yangi nusxa qaytadi.
 */
export function qoldiqlarniQosh(...qismlar: readonly Qoldiqlar[]): Qoldiqlar {
  const natija: Qoldiqlar = nolQoldiq()
  for (const qism of qismlar) {
    natija.naqd.som += qism.naqd.som
    natija.naqd.dollar += qism.naqd.dollar
    natija.karta.som += qism.karta.som
    natija.karta.dollar += qism.karta.dollar
  }
  return natija
}

/** Hamma hisob boʻyicha jami — valyutalar baribir alohida qoladi (0038). */
export function jamiQoldiq(hammasi: Qoldiqlar): ValyutaQoldigi {
  return {
    som: hammasi.naqd.som + hammasi.karta.som,
    dollar: hammasi.naqd.dollar + hammasi.karta.dollar,
  }
}

/**
 * «≈ jami soʻmda» — taxminiy qator (0023): dollar qoldigʻi berilgan kurs bilan
 * soʻmga aylantirilib qoʻshiladi. Kurs — «oxirgi kurs» (0044, 0045).
 */
export function taxminiyJamiSomda(jami: ValyutaQoldigi, kurs: number): number {
  return jami.som + dollarniSomga(jami.dollar, kurs)
}
