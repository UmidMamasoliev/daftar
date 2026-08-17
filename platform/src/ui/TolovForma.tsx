// «Toʻlov» formasi.
//
// Tavsif: `design/qarz-daftari.md` (4-boʻlim). Rang, oʻlcham va boʻshliq: `design/uslub.md`.
// Shartnoma: `platform/KELISHUV.md` 13–15-boʻlimlar.
//
// Kirish yoʻli bitta — ochiq qarz kartochkasidagi «＋ Toʻlov», shuning uchun qarz ham,
// kontakt ham, yoʻnalish ham formada tanlanmaydi (0061: yopilgan qarzda havolaning oʻzi
// boʻlmaydi).
//
// Ikkita yordam qatori (0061; mezon 43, 44): (1) pul qaysi hisobga tushishi yoki qaysi
// hisobdan chiqishi, (2) boshqa valyutadagi toʻlovda qarzdan ayiriladigan summa —
// yaxlitlash saqlashdan **oldin** koʻrinsin (0042).

import type { ChangeEvent, FormEvent } from 'react'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import {
  boshlangichTolovFormasi,
  qarzQoldigi,
  tolovOldindanKorish,
  tolovniTekshir,
} from '../domain/qarz.ts'
import { bugun } from '../domain/sana.ts'
import type {
  Hisob,
  Kontakt,
  Natija,
  Qarz,
  Tolov,
  TolovFormasi,
  Valyuta,
  Xato,
  XatoMaydoni,
  YangiTolov,
} from '../domain/turlar.ts'
import {
  belgilarSoni,
  kursniShakllantir,
  kursorOrni,
  pulMatni,
  sanaYorligi,
  summaniShakllantir,
} from './format.ts'
import {
  FORMA,
  OGOHLANTIRISH,
  TOLOV_FORMA,
  ayiriladiQatori,
  kontaktQatori,
  qarzQoldigiQatori,
  tolovYordami,
  xatoMatni,
} from './matnlar.ts'

export type TolovFormaProps = {
  /** Qarz qatoridagi «Kontakt: Akmal» uchun. */
  kontakt: Kontakt
  /** Toʻlov shu qarzga yoziladi: valyuta standarti va chegara shundan chiqadi. */
  qarz: Qarz
  /** Shu qarzning saqlangan toʻlovlari — qoldiq va 0061 chegarasi ular bilan hisoblanadi. */
  tolovlar: readonly Tolov[]
  /** Tekshiruvdan oʻtgan toʻlovni saqlaydi (`tolovQosh`). */
  saqla: (yangi: YangiTolov) => Promise<Natija<Tolov>>
  /** `×` bosilganda va saqlangandan keyin. */
  yop?: (() => void) | undefined
}

/** Xato qaysi maydonda ekani ekrandagi tartibda. */
const XATO_TARTIBI: readonly XatoMaydoni[] = [
  'summa',
  'valyuta',
  'kurs',
  'hisob',
  'sana',
  'qarzId',
]

export function TolovForma({ kontakt, qarz, tolovlar, saqla, yop }: TolovFormaProps) {
  const [forma, setForma] = useState<TolovFormasi>(() => boshlangichTolovFormasi(qarz))
  const [xatolar, setXatolar] = useState<readonly Xato[]>([])
  const [summaOgohi, setSummaOgohi] = useState('')
  const [kursOgohi, setKursOgohi] = useState('')

  const summaRef = useRef<HTMLInputElement>(null)
  const valyutaRef = useRef<HTMLButtonElement>(null)
  const kursRef = useRef<HTMLInputElement>(null)
  const hisobRef = useRef<HTMLButtonElement>(null)
  const sanaRef = useRef<HTMLInputElement>(null)
  const kursorlar = useRef<{ summa: number | null; kurs: number | null }>({
    summa: null,
    kurs: null,
  })

  useLayoutEffect(() => {
    const { summa, kurs } = kursorlar.current
    kursorlar.current = { summa: null, kurs: null }
    if (summa !== null) {
      summaRef.current?.setSelectionRange(summa, summa)
    }
    if (kurs !== null) {
      kursRef.current?.setSelectionRange(kurs, kurs)
    }
  })

  const asos = useId()
  const kursId = `${asos}-kurs`
  const hisobId = `${asos}-hisob`
  const valyutaId = `${asos}-valyuta`
  const sanaId = `${asos}-sana`

  const bugungi = bugun()
  const qoldiq = qarzQoldigi(qarz, tolovlar)
  // Kurs faqat toʻlov valyutasi qarz valyutasidan boshqa boʻlganda soʻraladi (mezon 12).
  const aylantiriladi = forma.valyuta !== qarz.valyuta
  const dollarSummasi = forma.valyuta === 'dollar'
  const ayiriladi = aylantiriladi ? tolovOldindanKorish(forma, qarz) : null

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
      case 'valyuta':
        return valyutaRef.current
      case 'kurs':
        return kursRef.current
      case 'hisob':
        return hisobRef.current
      default:
        return sanaRef.current
    }
  }

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
    kursorlar.current.summa = kursorOrni(qiymat, chapda)
    setForma({ ...forma, summa: qiymat })
    setSummaOgohi(kasrOlindi ? OGOHLANTIRISH.somdaKasrOlindi : '')
    xatolarniTozala(['summa'])
  }

  function kursniOzgartir(hodisa: ChangeEvent<HTMLInputElement>): void {
    const xom = hodisa.target.value
    const chapda = belgilarSoni(xom.slice(0, hodisa.target.selectionStart ?? xom.length))
    const { qiymat, kasrOlindi } = kursniShakllantir(xom)
    kursorlar.current.kurs = kursorOrni(qiymat, chapda)
    setForma({ ...forma, kurs: qiymat })
    setKursOgohi(kasrOlindi ? OGOHLANTIRISH.kursKasrOlindi : '')
    xatolarniTozala(['kurs'])
  }

  function valyutaniTanla(valyuta: Valyuta): void {
    if (valyuta === forma.valyuta) {
      return
    }
    // Qarz valyutasiga qaytilsa kurs maydoni yopiladi va kiritilgani unutiladi (dizayn).
    const kurs = valyuta === qarz.valyuta ? '' : forma.kurs
    if (valyuta === 'som') {
      const { qiymat, kasrOlindi } = summaniShakllantir(forma.summa, 'som')
      setForma({ ...forma, valyuta, kurs, summa: qiymat })
      setSummaOgohi(kasrOlindi ? OGOHLANTIRISH.somdaKasrOlindi : '')
    } else {
      setForma({ ...forma, valyuta, kurs })
      setSummaOgohi('')
    }
    if (kurs === '') {
      setKursOgohi('')
    }
    xatolarniTozala(['valyuta', 'kurs', 'summa'])
  }

  function hisobniTanla(hisob: Hisob): void {
    setForma({ ...forma, hisob })
    xatolarniTozala(['hisob'])
  }

  function sananiOzgartir(sana: string): void {
    setForma({ ...forma, sana })
    xatolarniTozala(['sana'])
  }

  async function yubor(hodisa: FormEvent<HTMLFormElement>): Promise<void> {
    hodisa.preventDefault()
    // Hamma tekshiruv bir yoʻla: 0061 chegaralari ham shu yerda (qarz va toʻlovlar bilan).
    const tekshirilgan = tolovniTekshir(forma, qarz, tolovlar)
    if (!tekshirilgan.ok) {
      setXatolar(tekshirilgan.xatolar)
      xatoliMaydongaOt(tekshirilgan.xatolar)
      return
    }
    const natija = await saqla(tekshirilgan.qiymat)
    if (!natija.ok) {
      setXatolar(natija.xatolar)
      xatoliMaydongaOt(natija.xatolar)
      return
    }
    setXatolar([])
    yop?.()
  }

  function xatoQatori(maydon: XatoMaydoni, id: string) {
    const topilgan = xatoniTop(maydon)
    if (topilgan === undefined) {
      return null
    }
    return (
      <p className="xato-matni" id={id}>
        {xatoMatni(topilgan.kod, topilgan.xabar)}
      </p>
    )
  }

  function chipSinfi(tanlangan: boolean): string {
    return tanlangan ? 'chip chip-tanlangan' : 'chip'
  }

  const summaXatosi = xatoniTop('summa')
  const kursXatosi = xatoniTop('kurs')

  return (
    <div className="ekran">
      <header className="panel-tepa">
        <button
          type="button"
          className="belgi-tugma"
          aria-label={TOLOV_FORMA.yopish}
          onClick={yop}
        >
          ×
        </button>
        <h1 className="sarlavha">{TOLOV_FORMA.sarlavha}</h1>
      </header>

      <form className="forma" onSubmit={yubor} noValidate>
        <div className="qarz-qatori">
          <p className="qarz-kontakt">{kontaktQatori(kontakt.ism)}</p>
          <p className="qarz-kontakt">
            {qarzQoldigiQatori(pulMatni(qoldiq, qarz.valyuta))}
          </p>
        </div>

        <div className="blok">
          <div className={summaXatosi === undefined ? 'summa-maydon' : 'summa-maydon xatoli'}>
            <input
              ref={summaRef}
              className="summa-kirit"
              // Forma ochilganda kursor shu yerda (dizayn: 4-boʻlim).
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              inputMode="decimal"
              autoComplete="off"
              aria-label={TOLOV_FORMA.summa}
              aria-invalid={summaXatosi !== undefined}
              aria-describedby={summaXatosi === undefined ? undefined : `${asos}-summa-xato`}
              placeholder="0"
              value={forma.summa}
              onChange={summaniOzgartir}
            />
            <span className="valyuta-sozi">
              {dollarSummasi ? FORMA.dollarBelgisi : FORMA.somSozi}
            </span>
          </div>
          {xatoQatori('summa', `${asos}-summa-xato`)}
          {summaOgohi === '' ? null : <p className="yordam">{summaOgohi}</p>}
        </div>

        <div className="blok">
          <span className="yorliq" id={valyutaId}>
            {FORMA.valyuta}
          </span>
          <div className="chiplar" role="group" aria-labelledby={valyutaId}>
            <button
              ref={valyutaRef}
              type="button"
              className={chipSinfi(!dollarSummasi)}
              aria-pressed={!dollarSummasi}
              onClick={() => {
                valyutaniTanla('som')
              }}
            >
              {FORMA.somChipi}
            </button>
            <button
              type="button"
              className={chipSinfi(dollarSummasi)}
              aria-pressed={dollarSummasi}
              onClick={() => {
                valyutaniTanla('dollar')
              }}
            >
              {FORMA.dollarChipi}
            </button>
          </div>
        </div>

        {aylantiriladi ? (
          <div className="blok kurs-blok">
            <label className="yorliq" htmlFor={kursId}>
              {FORMA.kurs}
            </label>
            <input
              ref={kursRef}
              id={kursId}
              className={kursXatosi === undefined ? 'maydon' : 'maydon xatoli'}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              aria-invalid={kursXatosi !== undefined}
              aria-describedby={kursXatosi === undefined ? undefined : `${asos}-kurs-xato`}
              placeholder={FORMA.kursNamunasi}
              value={forma.kurs}
              onChange={kursniOzgartir}
            />
            {xatoQatori('kurs', `${asos}-kurs-xato`)}
            {kursOgohi === '' ? null : <p className="yordam">{kursOgohi}</p>}
            {/* 0042 dagi yaxlitlash saqlashdan oldin koʻrinadi (mezon 44). */}
            {ayiriladi === null ? null : (
              <p className="yordam">{ayiriladiQatori(pulMatni(ayiriladi, qarz.valyuta))}</p>
            )}
          </div>
        ) : null}

        <div className="blok">
          <span className="yorliq" id={hisobId}>
            {FORMA.hisob}
          </span>
          <div className="chiplar" role="group" aria-labelledby={hisobId}>
            <button
              ref={hisobRef}
              type="button"
              className={chipSinfi(forma.hisob === 'karta')}
              aria-pressed={forma.hisob === 'karta'}
              onClick={() => {
                hisobniTanla('karta')
              }}
            >
              {FORMA.karta}
            </button>
            <button
              type="button"
              className={chipSinfi(forma.hisob === 'naqd')}
              aria-pressed={forma.hisob === 'naqd'}
              onClick={() => {
                hisobniTanla('naqd')
              }}
            >
              {FORMA.naqd}
            </button>
          </div>
          {/* Toʻlovning pul yoʻnalishi formada tanlanmaydi — u qarzdan chiqadi (mezon 43). */}
          <p className="yordam">{tolovYordami(qarz.yonalishi, forma.hisob)}</p>
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

        {xatoQatori('qarzId', `${asos}-qarz-xato`)}

        <div className="panel-past">
          <button type="submit" className="asosiy-tugma">
            {TOLOV_FORMA.saqlash}
          </button>
        </div>
      </form>
    </div>
  )
}
