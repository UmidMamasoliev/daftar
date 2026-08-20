// Ikonkalar — `design/uslub.md` → «Ikonka siyosati» (0068/5).
//
// Ikonka kutubxonasi (npm paketi) QOʻSHILMAYDI. Kerak boʻlgan toʻrtta shakl Lucide (MIT)
// dan olingan va shu yerda inline SVG boʻlib turadi. Toʻrttadan boshqa belgi yoʻq.
//
// Nega umuman ikonka kerak: `＋` (U+FF0B) Space Grotesk va Hanken Grotesk toʻplamida yoʻq
// va tizim shriftiga tushib qoladi — qalinligi va eni qolgan matnga mos kelmaydi.

/** Lucide dagi nomi — toʻrttadan boshqasi qoʻshilmaydi (0068/5). */
export type IkonkaNomi = 'plus' | 'x' | 'chevron-left' | 'chevron-right'

/** Har shaklning `path` lari — Lucide 24 × 24 toʻridan aynan koʻchirilgan. */
const YOLLAR: Record<IkonkaNomi, readonly string[]> = {
  plus: ['M5 12h14', 'M12 5v14'],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  'chevron-left': ['m15 18-6-6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
}

/**
 * Inline SVG. `aria-hidden` — ikonka hech qachon nom tashimaydi: nomni tugmaning oʻz
 * matni yoki `aria-label` i beradi. Rangi `currentColor` — matn rangidan ajralmaydi.
 */
export function Ikonka({ nom, olcham = 18 }: { nom: IkonkaNomi; olcham?: number }) {
  return (
    <svg
      className="ic"
      width={olcham}
      height={olcham}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {YOLLAR[nom].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

/** Tugma matnining boshida yoki oxirida turadigan belgilar va ularning shakli. */
const BELGILAR: readonly { readonly belgi: string; readonly nom: IkonkaNomi }[] = [
  { belgi: '＋', nom: 'plus' },
  { belgi: '‹', nom: 'chevron-left' },
  { belgi: '›', nom: 'chevron-right' },
]

/**
 * Tugma matnini belgi + ikonka + soʻz qilib chizadi.
 *
 * Testlar tugmalarni **nomi** bilan topadi (`getByRole('button', { name: '＋ Yozuv' })`),
 * shuning uchun belgining oʻzi DOM da qoladi — faqat koʻrinmas boʻladi
 * (`.faqat-oquvchiga`, `.fayl-kirit` retsepti). `display: none` yoki
 * `visibility: hidden` ISHLATILMAYDI: ular belgini yordamchi daraxtdan ham oʻchirar va
 * tugmaning nomi «Yozuv» boʻlib qolardi.
 *
 * Belgisiz matn oʻzgarishsiz chiziladi — matn hech qachon oʻzgartirilmaydi (0068/3).
 */
export function TugmaMatni({ matn }: { matn: string }) {
  for (const { belgi, nom } of BELGILAR) {
    if (matn.startsWith(`${belgi} `)) {
      return (
        <>
          <span className="faqat-oquvchiga">{belgi}</span>
          <Ikonka nom={nom} />
          {matn.slice(belgi.length)}
        </>
      )
    }
    if (matn.endsWith(` ${belgi}`)) {
      return (
        <>
          {matn.slice(0, -belgi.length)}
          <Ikonka nom={nom} />
          <span className="faqat-oquvchiga">{belgi}</span>
        </>
      )
    }
  }
  return <>{matn}</>
}
