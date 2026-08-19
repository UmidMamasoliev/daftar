// Pastki navigatsiya paneli.
//
// Tavsif: `design/uslub.md` → «Navigatsiya paneli». Dashboard bosh sahifa boʻlgach (0063 →
// spec 001-dashboard FR-013, 0067) bandlar: Bosh, Yozuvlar, Qarz daftari, Hisobot, Zaxira.
// «Yozuv» bandi yoʻq — yozuv qoʻshish bosh sahifadagi doim koʻrinadigan «＋ Yozuv» tugmasidan.
//
// Ikonka yoʻq — faqat soʻz (uslub: ikonka kutubxonasi qurilmaydi). Faol boʻlim faqat
// rang bilan emas, qalinlik bilan ham ajratiladi: rang koʻrmaydigan odam ham qaysi
// boʻlimda turganini bilsin.

import { NAVIGATSIYA } from './matnlar.ts'

/** Panel boʻlaklari — **panel toʻldi**, boshqa boʻlak qoʻshilmaydi (uslub). */
export type Bolim = 'bosh' | 'yozuvlar' | 'qarz-daftari' | 'hisobot' | 'zaxira'

export type NavigatsiyaProps = {
  /** Hozir qaysi boʻlimda turibmiz. «Kontakt» sahifasida — `'qarz-daftari'` (dizayn). */
  faol: Bolim
  /** Boʻlak bosilganda; faol boʻlimning oʻzi bosilsa ham chaqiriladi. */
  otish: (bolim: Bolim) => void
}

const BOLAKLAR: readonly { bolim: Bolim; matn: string }[] = [
  { bolim: 'bosh', matn: NAVIGATSIYA.bosh },
  { bolim: 'yozuvlar', matn: NAVIGATSIYA.yozuvlar },
  { bolim: 'qarz-daftari', matn: NAVIGATSIYA.qarzDaftari },
  { bolim: 'hisobot', matn: NAVIGATSIYA.hisobot },
  { bolim: 'zaxira', matn: NAVIGATSIYA.zaxira },
]

/**
 * Boʻlak matnining oʻlchami boʻlaklar sonidan chiqadi (uslub: «Oʻlchamlari va rangi»):
 * `kichik` (14 px), **toʻrttadan koʻp** boʻlakda esa `mayda` (13 px).
 *
 * Qoida sonlab yozilgani uchun boʻlak soni oʻzgarsa oʻlcham oʻz-oʻzidan moslashadi —
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
