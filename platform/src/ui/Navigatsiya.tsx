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

/** Panel boʻlaklari. «Hisobot» va «Zaxira» oʻz qismlari tayyor boʻlganda qoʻshiladi. */
export type Bolim = 'yozuv' | 'yozuvlar' | 'qarz-daftari'

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
]

export function Navigatsiya({ faol, otish }: NavigatsiyaProps) {
  return (
    <nav className="navigatsiya" aria-label={NAVIGATSIYA.yorliq}>
      <div className="navigatsiya-ichi">
        {BOLAKLAR.map(({ bolim, matn }) => (
          <button
            key={bolim}
            type="button"
            className={bolim === faol ? 'nav-bolak faol' : 'nav-bolak'}
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
