// Pastki navigatsiya paneli — **VAQTINCHALIK** (0063).
//
// Tavsif: `design/uslub.md` → «Navigatsiya paneli — VAQTINCHALIK (0063)».
// Dashboard 3.10 da qurilganda bosh sahifa oʻsha boʻladi va panel qayta koʻriladi;
// shu belgi olib tashlanmaguncha bu fayl vaqtinchalik deb qaraladi.
//
// Ikonka yoʻq — faqat soʻz (uslub: ikonka kutubxonasi qurilmaydi). Faol boʻlim faqat
// rang bilan emas, qalinlik bilan ham ajratiladi: rang koʻrmaydigan odam ham qaysi
// boʻlimda turganini bilsin.

import { NAVIGATSIYA } from './matnlar.ts'

/** Panel boʻlaklari. «Zaxira» oʻz qismi tayyor boʻlganda qoʻshiladi (uslub: panel toʻldi). */
export type Bolim = 'yozuv' | 'yozuvlar' | 'qarz-daftari' | 'hisobot'

export type NavigatsiyaProps = {
  /** Hozir qaysi boʻlimda turibmiz. «Kontakt» sahifasida — `'qarz-daftari'` (dizayn). */
  faol: Bolim
  /** Boʻlak bosilganda; faol boʻlimning oʻzi bosilsa ham chaqiriladi. */
  otish: (bolim: Bolim) => void
}

const BOLAKLAR: readonly { bolim: Bolim; matn: string }[] = [
  { bolim: 'yozuv', matn: NAVIGATSIYA.yozuv },
  { bolim: 'yozuvlar', matn: NAVIGATSIYA.yozuvlar },
  { bolim: 'qarz-daftari', matn: NAVIGATSIYA.qarzDaftari },
  { bolim: 'hisobot', matn: NAVIGATSIYA.hisobot },
]

/**
 * Boʻlak matnining oʻlchami boʻlaklar sonidan chiqadi (uslub: «Oʻlchamlari va rangi»):
 * `kichik` (14 px), **toʻrttadan koʻp** boʻlakda esa `mayda` (13 px).
 *
 * Qoida sonlab yozilgani uchun «Zaxira» qoʻshilganda oʻlcham oʻz-oʻzidan kichrayadi —
 * ikkinchi joyda qoʻlda tuzatish kerak boʻlmaydi.
 */
export function navMatnSinfi(bolaklarSoni: number): string {
  return bolaklarSoni > 4 ? 'nav-matn-mayda' : 'nav-matn-kichik'
}

export function Navigatsiya({ faol, otish }: NavigatsiyaProps) {
  const matnSinfi = navMatnSinfi(BOLAKLAR.length)
  return (
    <nav className="navigatsiya" aria-label={NAVIGATSIYA.yorliq}>
      <div className="navigatsiya-ichi">
        {BOLAKLAR.map(({ bolim, matn }) => (
          <button
            key={bolim}
            type="button"
            className={`nav-bolak ${matnSinfi}${bolim === faol ? ' faol' : ''}`}
            aria-current={bolim === faol ? 'page' : undefined}
            onClick={() => {
              otish(bolim)
            }}
          >
            {matn}
          </button>
        ))}
      </div>
    </nav>
  )
}
