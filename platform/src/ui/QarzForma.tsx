// «Yangi qarz» / «Qarzni tahrirlash» formasi.
//
// Tavsif: `design/qarz-daftari.md` (3-boʻlim) — maydonlar tartibi, matnlar va xato
// jadvali oʻsha yerdan. Rang, oʻlcham va boʻshliq: `design/uslub.md`.
// Shartnoma: `platform/KELISHUV.md` 12–15-boʻlimlar.
//
// Farqi «Yangi yozuv» formasidan:
// - **kurs maydoni yoʻq** — qarz oʻz valyutasida yuritiladi va kiritilganda hech narsa
//   aylantirilmaydi; qarzning oʻzi «oxirgi kurs» manbai emas (0044; spec 15d);
// - **izoh maydoni yoʻq** — specda qarzda izoh yoʻq;
// - yoʻnalish segmenti uchun **standart qiymat yoʻq** (0062, 0050 bilan bir sabab);
// - toʻlovi bor qarzda **valyuta muzlatilgan** (0059).
//
// Kontakt formada tanlanmaydi: kirish yoʻli bitta — kontakt sahifasidagi «＋ Yangi qarz»,
// tahrirlashda esa qarz boshqa kontaktga koʻchirilmaydi.

import type { ChangeEvent, FormEvent } from 'react'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import {
  boshlangichQarzFormasi,
  qarzFormaQiymatlari,
  qarzniTekshir,
} from '../domain/qarz.ts'
import { bugun } from '../domain/sana.ts'
import type {
  Hisob,
  Kontakt,
  Natija,
  Qarz,
  QarzFormasi,
  QarzYonalishi,
  Valyuta,
  Xato,
  XatoMaydoni,
} from '../domain/turlar.ts'
import {
  belgilarSoni,
  kursorOrni,
  pulMatni,
  sanaYorligi,
  summaniShakllantir,
} from './format.ts'
import {
  FORMA,
  OGOHLANTIRISH,
  QARZ_FORMA,
  kontaktQatori,
  tolovdanKamMatni,
  xatoMatni,
} from './matnlar.ts'

export type QarzFormaProps = {
  /** Kontakt oldindan maʼlum — formada tanlanmaydi (dizayn 3-boʻlim). */
  kontakt: Kontakt
  /** Berilsa — tahrirlash rejimi: maydonlar shu qarzning qiymatlari bilan toʻladi (0059). */
  qarz?: Qarz | undefined
  /**
   * Shu qarzning toʻlovlari soni. Noldan katta boʻlsa valyuta **muzlatiladi** (0059):
   * toʻlovlar oʻz kursida aylantirilgan, valyuta almashsa qoldiq jimgina notoʻgʻri
   * boʻlib qolardi.
   */
  tolovlarSoni?: number | undefined
  /**
   * Shu qarzga toʻlangan yigʻindi, qarz valyutasida (`QarzHolati.tolangan`).
   * `qarz-summa-tolovdan-kam` xatosidagi raqam shundan formatlanadi (0061e; mezon 33a).
   */
  tolangan?: number | undefined
  /**
   * Formani **oʻz holicha** saqlaydi: yangi qarzda `qarzSaqla`, tahrirda
   * `qarzniTahrirla` (KELISHUV 14-boʻlim).
   *
   * Ataylab tekshirilgan `YangiQarz` emas: doʻkon kontaktni va (tahrirda) qarzning
   * toʻlovlarini oʻzi qayta oʻqiydi. Ilova ikki tabda ochilishi mumkin (PWA) va
   * formadagi `kontakt`/`qarz` props eskirgan boʻlishi mumkin — oxirgi soʻz doʻkonniki:
   * 0030 (oʻchirilgan kontakt), 0059 (valyuta) va 0061e (summa toʻlovlardan kichik)
   * bazadagi holatga qarab qoʻyiladi.
   */
  saqla: (forma: QarzFormasi) => Promise<Natija<Qarz>>
  /** `×` bosilganda va saqlangandan keyin. */
  yop?: (() => void) | undefined
}

/** Xato qaysi maydonda ekani ekrandagi tartibda: birinchi xatoli maydonga suriladi. */
const XATO_TARTIBI: readonly XatoMaydoni[] = [
  'summa',
  'yonalishi',
  'hisob',
  'valyuta',
  'sana',
  'kontaktId',
]

/** Tahrirlash formasining qiymatlari — summa ekran koʻrinishiga oʻgiriladi. */
function boshlangichHolat(kontaktId: string, qarz: Qarz | undefined): QarzFormasi {
  if (qarz === undefined) {
    return boshlangichQarzFormasi(kontaktId)
  }
  const qiymatlar = qarzFormaQiymatlari(qarz)
  return { ...qiymatlar, summa: summaniShakllantir(qiymatlar.summa, qiymatlar.valyuta).qiymat }
}

export function QarzForma({
  kontakt,
  qarz,
  tolovlarSoni = 0,
  tolangan = 0,
  saqla,
  yop,
}: QarzFormaProps) {
  const tahrir = qarz !== undefined
  const [forma, setForma] = useState<QarzFormasi>(() => boshlangichHolat(kontakt.id, qarz))
  const [xatolar, setXatolar] = useState<readonly Xato[]>([])
  const [summaOgohi, setSummaOgohi] = useState('')
  // Saqlash ketayotgan payt «Saqlash» oʻchiq turadi; bayroqning oʻzi `ref` da, chunki
  // qayta kirish **shu lahzada** toʻsilishi kerak (YozuvForma bilan bir naqsh).
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const saqlashKetdi = useRef(false)

  const summaRef = useRef<HTMLInputElement>(null)
  const yonalishRef = useRef<HTMLButtonElement>(null)
  const hisobRef = useRef<HTMLButtonElement>(null)
  const valyutaRef = useRef<HTMLButtonElement>(null)
  const sanaRef = useRef<HTMLInputElement>(null)
  const kursorRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const orin = kursorRef.current
    kursorRef.current = null
    if (orin !== null) {
      summaRef.current?.setSelectionRange(orin, orin)
    }
  })

  const asos = useId()
  const yonalishId = `${asos}-yonalish`
  const hisobId = `${asos}-hisob`
  const valyutaId = `${asos}-valyuta`
  const sanaId = `${asos}-sana`

  const bugungi = bugun()
  const dollar = forma.valyuta === 'dollar'
  // 0059: valyuta faqat toʻlovi yoʻq qarzda oʻzgaradi. Ikkala chip ham koʻrinadi, lekin
  // ikkalasi ham bosilmaydi — dizayn: «Toʻlovi bor qarzda valyuta muzlatilgan».
  const valyutaMuzlatilgan = tahrir && tolovlarSoni > 0

  function xatolarniTozala(maydonlar: readonly XatoMaydoni[]): void {
    setXatolar((oldingi) => oldingi.filter((x) => !maydonlar.includes(x.maydon)))
  }

  function xatoniTop(maydon: XatoMaydoni): Xato | undefined {
    return xatolar.find((x) => x.maydon === maydon)
  }

  function maydonElementi(maydon: XatoMaydoni): HTMLElement | null {
    switch (maydon) {
      case 'summa':
        return summaRef.current
      case 'yonalishi':
        return yonalishRef.current
      case 'hisob':
        return hisobRef.current
      case 'valyuta':
        return valyutaRef.current
      default:
        return sanaRef.current
    }
  }

  /** Birinchi xatoli maydonga suriladi va fokus oʻsha yerga tushadi (dizayn). */
  function xatoliMaydongaOt(yangiXatolar: readonly Xato[]): void {
    const birinchi = XATO_TARTIBI.find((m) => yangiXatolar.some((x) => x.maydon === m))
    if (birinchi === undefined) {
      return
    }
    const nishon = maydonElementi(birinchi)
    if (nishon === null) {
      return
    }
    if (typeof nishon.scrollIntoView === 'function') {
      nishon.scrollIntoView({ block: 'center' })
    }
    nishon.focus()
  }

  function summaniOzgartir(hodisa: ChangeEvent<HTMLInputElement>): void {
    const xom = hodisa.target.value
    const chapda = belgilarSoni(xom.slice(0, hodisa.target.selectionStart ?? xom.length))
    const { qiymat, kasrOlindi } = summaniShakllantir(xom, forma.valyuta)
    kursorRef.current = kursorOrni(qiymat, chapda)
    setForma({ ...forma, summa: qiymat })
    setSummaOgohi(kasrOlindi ? OGOHLANTIRISH.somdaKasrOlindi : '')
    xatolarniTozala(['summa'])
  }

  function yonalishniTanla(yonalishi: QarzYonalishi): void {
    setForma({ ...forma, yonalishi })
    xatolarniTozala(['yonalishi'])
  }

  function hisobniTanla(hisob: Hisob): void {
    setForma({ ...forma, hisob })
    xatolarniTozala(['hisob'])
  }

  function valyutaniTanla(valyuta: Valyuta): void {
    if (valyutaMuzlatilgan || valyuta === forma.valyuta) {
      return
    }
    if (valyuta === 'som') {
      // Soʻmda tiyin yoʻq: kasr qismi kesiladi va yordam qatori bilan aytiladi (0033).
      const { qiymat, kasrOlindi } = summaniShakllantir(forma.summa, 'som')
      setForma({ ...forma, valyuta, summa: qiymat })
      setSummaOgohi(kasrOlindi ? OGOHLANTIRISH.somdaKasrOlindi : '')
    } else {
      setForma({ ...forma, valyuta })
      setSummaOgohi('')
    }
    xatolarniTozala(['valyuta', 'summa'])
  }

  function sananiOzgartir(sana: string): void {
    setForma({ ...forma, sana })
    xatolarniTozala(['sana'])
  }

  async function yubor(hodisa: FormEvent<HTMLFormElement>): Promise<void> {
    hodisa.preventDefault()
    // «Saqlash» tez ikki marta bosilsa ikkinchisi shu yerda toʻxtaydi: bitta niyatdan
    // ikkita qarz chiqmasin.
    if (saqlashKetdi.current) {
      return
    }
    // Birinchi qatlam — ekrandagi maʼlumot boʻyicha: maydon xatolari bir yoʻla koʻrinsin
    // va ekran birinchi xatoli maydonga surilsin (dizayn: «Xato holatlari»).
    const tekshirilgan = qarzniTekshir(forma)
    if (!tekshirilgan.ok) {
      setXatolar(tekshirilgan.xatolar)
      xatoliMaydongaOt(tekshirilgan.xatolar)
      return
    }
    // Ikkinchi qatlam va oxirgi soʻz — doʻkon: kontakt hali bormi (0030), valyutani
    // oʻzgartirsa boʻladimi (0059), summa toʻlovlardan past emasmi (0061e).
    saqlashKetdi.current = true
    setSaqlanmoqda(true)
    let natija: Natija<Qarz>
    try {
      natija = await saqla(forma)
    } finally {
      // Saqlash rad etilsa tugma yana bosiladigan boʻlib qoladi.
      saqlashKetdi.current = false
      setSaqlanmoqda(false)
    }
    if (!natija.ok) {
      setXatolar(natija.xatolar)
      xatoliMaydongaOt(natija.xatolar)
      return
    }
    setXatolar([])
    yop?.()
  }

  /**
   * Xato matni. Bitta istisno — `qarz-summa-tolovdan-kam`: doʻkon raqamni formatsiz
   * beradi (KELISHUV 15-boʻlim), shuning uchun matnni ekran oʻzi yigʻadi va raqamni
   * qarzning **oʻz** valyutasida koʻrsatadi (0061e; mezon 33a, 33c).
   */
  function xatoQatoriMatni(topilgan: Xato): string {
    if (topilgan.kod === 'qarz-summa-tolovdan-kam') {
      return tolovdanKamMatni(pulMatni(tolangan, qarz?.valyuta ?? forma.valyuta))
    }
    return xatoMatni(topilgan.kod, topilgan.xabar)
  }

  function xatoQatori(maydon: XatoMaydoni, id: string) {
    const topilgan = xatoniTop(maydon)
    if (topilgan === undefined) {
      return null
    }
    return (
      <p className="xato-matni" id={id}>
        {xatoQatoriMatni(topilgan)}
      </p>
    )
  }

  function chipSinfi(tanlangan: boolean): string {
    if (tanlangan) {
      return 'chip chip-tanlangan'
    }
    return valyutaMuzlatilgan ? 'chip chip-ochiq' : 'chip'
  }

  const summaXatosi = xatoniTop('summa')

  return (
    <div className="ekran">
      <header className="panel-tepa">
        <button
          type="button"
          className="belgi-tugma"
          aria-label={QARZ_FORMA.yopish}
          onClick={yop}
        >
          ×
        </button>
        <h1 className="sarlavha">
          {tahrir ? QARZ_FORMA.sarlavhaTahrir : QARZ_FORMA.sarlavhaYangi}
        </h1>
      </header>

      <form className="forma" onSubmit={yubor} noValidate>
        <p className="qarz-kontakt">{kontaktQatori(kontakt.ism)}</p>

        <div className="blok">
          <div className={summaXatosi === undefined ? 'summa-maydon' : 'summa-maydon xatoli'}>
            <input
              ref={summaRef}
              className="summa-kirit"
              // Forma ochilganda kursor shu yerda (dizayn: 3-boʻlim).
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              inputMode="decimal"
              autoComplete="off"
              aria-label={QARZ_FORMA.summa}
              aria-invalid={summaXatosi !== undefined}
              aria-describedby={summaXatosi === undefined ? undefined : `${asos}-summa-xato`}
              placeholder="0"
              value={forma.summa}
              onChange={summaniOzgartir}
            />
            <span className="valyuta-sozi">{dollar ? FORMA.dollarBelgisi : FORMA.somSozi}</span>
          </div>
          {xatoQatori('summa', `${asos}-summa-xato`)}
          {summaOgohi === '' ? null : <p className="yordam">{summaOgohi}</p>}
        </div>

        <div className="blok">
          <div className="segment" role="group" aria-label={QARZ_FORMA.yonalish} id={yonalishId}>
            <button
              ref={yonalishRef}
              type="button"
              // «Berdim» — pul qoʻldan chiqadi, shuning uchun `chiqim` rangi (0017).
              className={
                forma.yonalishi === 'berdim' ? 'segment-bolak tanlangan-chiqim' : 'segment-bolak'
              }
              aria-pressed={forma.yonalishi === 'berdim'}
              onClick={() => {
                yonalishniTanla('berdim')
              }}
            >
              {QARZ_FORMA.berdim}
            </button>
            <button
              type="button"
              // «Oldim» — pul qoʻlga kiradi, shuning uchun `kirim` rangi (0017).
              className={
                forma.yonalishi === 'oldim' ? 'segment-bolak tanlangan-kirim' : 'segment-bolak'
              }
              aria-pressed={forma.yonalishi === 'oldim'}
              onClick={() => {
                yonalishniTanla('oldim')
              }}
            >
              {QARZ_FORMA.oldim}
            </button>
          </div>
          {xatoQatori('yonalishi', `${asos}-yonalish-xato`)}
        </div>

        <div className="blok">
          <span className="yorliq" id={hisobId}>
            {FORMA.hisob}
          </span>
          <div className="chiplar" role="group" aria-labelledby={hisobId}>
            <button
              ref={hisobRef}
              type="button"
              className={forma.hisob === 'karta' ? 'chip chip-tanlangan' : 'chip'}
              aria-pressed={forma.hisob === 'karta'}
              onClick={() => {
                hisobniTanla('karta')
              }}
            >
              {FORMA.karta}
            </button>
            <button
              type="button"
              className={forma.hisob === 'naqd' ? 'chip chip-tanlangan' : 'chip'}
              aria-pressed={forma.hisob === 'naqd'}
              onClick={() => {
                hisobniTanla('naqd')
              }}
            >
              {FORMA.naqd}
            </button>
          </div>
        </div>

        <div className="blok">
          <span className="yorliq" id={valyutaId}>
            {FORMA.valyuta}
          </span>
          <div className="chiplar" role="group" aria-labelledby={valyutaId}>
            <button
              ref={valyutaRef}
              type="button"
              className={chipSinfi(!dollar)}
              aria-pressed={!dollar}
              disabled={valyutaMuzlatilgan}
              onClick={() => {
                valyutaniTanla('som')
              }}
            >
              {FORMA.somChipi}
            </button>
            <button
              type="button"
              className={chipSinfi(dollar)}
              aria-pressed={dollar}
              disabled={valyutaMuzlatilgan}
              onClick={() => {
                valyutaniTanla('dollar')
              }}
            >
              {FORMA.dollarChipi}
            </button>
          </div>
          {/* Yordam qatori yoʻlni oʻzi aytadi — oʻchiq chip «sababsiz» qolmaydi (0059). */}
          {valyutaMuzlatilgan ? <p className="yordam">{QARZ_FORMA.valyutaMuzlatilgan}</p> : null}
          {xatoQatori('valyuta', `${asos}-valyuta-xato`)}
        </div>

        <div className="blok">
          <div className="sana-qatori">
            <span className="yorliq" id={sanaId}>
              {FORMA.sana}
            </span>
            <span className="sana-tanlagich">
              <span className="sana-matni" aria-hidden="true">
                {sanaYorligi(forma.sana, bugungi)}
              </span>
              <input
                ref={sanaRef}
                className="sana-kirit"
                type="date"
                aria-labelledby={sanaId}
                value={forma.sana}
                max={bugungi}
                onChange={(hodisa) => {
                  sananiOzgartir(hodisa.target.value)
                }}
              />
            </span>
          </div>
          {xatoQatori('sana', `${asos}-sana-xato`)}
        </div>

        {xatoQatori('kontaktId', `${asos}-kontakt-xato`)}

        <div className="panel-past">
          <button type="submit" className="asosiy-tugma" disabled={saqlanmoqda}>
            {QARZ_FORMA.saqlash}
          </button>
        </div>
      </form>
    </div>
  )
}
