// Dashboard (bosh sahifa) sof hisoblari — spec `specs/001-dashboard/spec.md`.
//
// Ikkita kichik qoida bor: joriy oy yigʻindilari (FR-008; mezon 7–9) va zaxira
// eslatmasi sharti (FR-012; 0024; mezon 15–18). Qoldiq, «oxirgi kurs» va taxminiy jami
// bu yerda EMAS — ular allaqachon `qoldiq.ts`, `kurs.ts` va `hisobot.ts` da turadi va
// dashboard oʻshalarni ishlatadi (KELISHUV 6, 7, 19-boʻlimlar).

import type { Davr, ValyutaQatori } from './hisobot.ts'
import { davrgaKiradimi } from './hisobot.ts'
import type { Yozuv, YozuvTuri } from './turlar.ts'
import { VALYUTALAR } from './turlar.ts'

export type OyYigindilari = { kirim: ValyutaQatori[]; chiqim: ValyutaQatori[] }

/** Eslatma chegarasi: oxirgi eksportdan shuncha kun oʻtsa eslatma chiqadi (0024). */
export const ESLATMA_KUNLARI = 30

/**
 * Joriy oy kirim va chiqim yigʻindilari — valyuta boʻyicha alohida, taxminsiz (0038 ruhi).
 *
 * Qarz harakati BU YERGA KIRMAYDI (0017; FR-011 ruhi): qarz pul qoldigʻiga taʼsir qiladi,
 * lekin oy koʻrsatkichi faqat yozuvlardan chiqadi — hisobotdagi qoida bilan bir xil.
 * Davrga kirishni faqat `sana` aniqlaydi (0047). Qator faqat oʻsha valyutada yozuv bor
 * boʻlakda chiziladi; boʻlak boʻsh qolsa bitta nol soʻm qatori turadi (hisobot naqshi,
 * KELISHUV 20-boʻlim).
 */
export function oyYigindilari(yozuvlar: readonly Yozuv[], davr: Davr): OyYigindilari {
  return { kirim: bolakYigindisi(yozuvlar, 'kirim', davr), chiqim: bolakYigindisi(yozuvlar, 'chiqim', davr) }
}

function bolakYigindisi(
  yozuvlar: readonly Yozuv[],
  turi: YozuvTuri,
  davr: Davr,
): ValyutaQatori[] {
  const qatorlar: ValyutaQatori[] = []
  for (const valyuta of VALYUTALAR) {
    let bor = false
    let summa = 0
    for (const yozuv of yozuvlar) {
      if (yozuv.turi === turi && yozuv.valyuta === valyuta && davrgaKiradimi(yozuv.sana, davr)) {
        bor = true
        summa += yozuv.summa
      }
    }
    if (bor) {
      qatorlar.push({ valyuta, summa })
    }
  }
  return qatorlar.length === 0 ? [{ valyuta: 'som', summa: 0 }] : qatorlar
}

/**
 * Zaxira eslatmasi sharti (0024; FR-012): hech qachon eksport boʻlmagan yoki oxirgi
 * eksportdan `ESLATMA_KUNLARI` kun oʻtgan boʻlsa — eslatma kerak. «30 kun oʻtsa» 30-kun
 * toʻlgan kunni ham qamraydi (spec FR-012 talqini; analyze hisobotida qayd etilgan).
 *
 * Sana faqat oʻqiladi (0053, 0054): uni eksport va import yuritadi, dashboard emas.
 */
export function zaxiraEslatmasiKerakmi(oxirgiEksport: string | null, bugungi: string): boolean {
  if (oxirgiEksport === null) {
    return true
  }
  return kunFarqi(oxirgiEksport, bugungi) >= ESLATMA_KUNLARI
}

/**
 * Ikki `YYYY-MM-DD` sana orasidagi kun farqi (mahalliy kalendar).
 *
 * Mahalliy `Date` bilan sanaladi (`format.ts` dagi `kechagiKun` naqshi) va yaxlitlanadi:
 * Oʻzbekistonda soat koʻchishi yoʻq, lekin yaxlitlash qoidani soat koʻchishiga ham chidamli
 * qiladi.
 */
function kunFarqi(oldingi: string, keyingi: string): number {
  const birKun = 24 * 60 * 60 * 1000
  return Math.round((mahalliyVaqt(keyingi) - mahalliyVaqt(oldingi)) / birKun)
}

function mahalliyVaqt(sana: string): number {
  const qismlar = sana.split('-')
  return new Date(
    Number(qismlar[0] ?? '0'),
    Number(qismlar[1] ?? '1') - 1,
    Number(qismlar[2] ?? '1'),
  ).getTime()
}
