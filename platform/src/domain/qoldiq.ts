// Hisob qoldigʻi: hisob × valyuta boʻyicha alohida hisoblanadi (0011, 0023).
//
// Kirim koʻpaytiradi, chiqim kamaytiradi (mezon 8). Dollardagi yozuv faqat dollar
// qoldigʻiga tushadi — soʻm qoldigʻiga tegmaydi (mezon 9).
// Qoldiq hech qayerda saqlanmaydi: har safar joriy yozuvlardan sanaladi, shuning uchun
// tahrir, oʻchirish va qaytarish oʻz-oʻzidan toʻgʻri natija beradi (0014; mezon 10, 11).

import { dollarniSomga } from './pul.ts'
import type { Qoldiqlar, ValyutaQoldigi, Yozuv } from './turlar.ts'

/** Yozuvlardan hisob × valyuta qoldiqlarini sanaydi. */
export function qoldiqlar(yozuvlar: readonly Yozuv[]): Qoldiqlar {
  const natija: Qoldiqlar = {
    naqd: { som: 0, dollar: 0 },
    karta: { som: 0, dollar: 0 },
  }
  for (const yozuv of yozuvlar) {
    const ozgarish = yozuv.turi === 'kirim' ? yozuv.summa : -yozuv.summa
    natija[yozuv.hisob][yozuv.valyuta] += ozgarish
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
