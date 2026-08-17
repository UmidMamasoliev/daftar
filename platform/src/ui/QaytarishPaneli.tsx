// «Qaytarish» paneli — 7 soniya (0029, 0048).
//
// Tavsif: `design/kirim-chiqim.md` («Oʻchirish va «qaytarish» paneli») va
// `design/qarz-daftari.md` (5-boʻlim). Panel hamma ekranda bir xil koʻrinadi va bir xil
// ishlaydi; farqi faqat matnida: «Yozuv oʻchirildi», «Toʻlov oʻchirildi»,
// «Qarz oʻchirildi», «Kontakt oʻchirildi».
//
// Muddatni panelning oʻzi sanamaydi — uni egasi (ekran) sanaydi, chunki muddat tugaganda
// oʻchirilgan nusxa tashlab yuborilishi kerak va u ekranning holatida turadi.

import { UMUMIY } from './matnlar.ts'

/** «QAYTARISH» tugmasi necha millisoniya turadi — 7 soniya, qatʼiy qiymat (0048). */
export const QAYTARISH_MUDDATI = 7000

export type QaytarishPaneliProps = {
  /** «<Nima> oʻchirildi» — bitta qolip, har ekran oʻz soʻzini qoʻyadi. */
  matn: string
  /** «QAYTARISH» bosilganda. */
  qaytar: () => void
}

export function QaytarishPaneli({ matn, qaytar }: QaytarishPaneliProps) {
  return (
    <div className="qaytarish-paneli" role="status">
      <span className="qaytarish-matni">{matn}</span>
      <button type="button" className="qaytarish-tugma" onClick={qaytar}>
        {UMUMIY.qaytarish}
      </button>
    </div>
  )
}
