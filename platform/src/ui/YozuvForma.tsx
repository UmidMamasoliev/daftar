// «Yangi yozuv» / «Yozuvni tahrirlash» formasi.
//
// Tavsif: `design/kirim-chiqim.md` (1-boʻlim) — maydonlar tartibi, matnlar va xato jadvali
// oʻsha yerdan. Rang, oʻlcham va boʻshliq: `design/uslub.md`.
// Tekshiruv va saqlash shartnomasi: `platform/KELISHUV.md`.
//
// Kategoriyalar roʻyxati tashqaridan (props orqali) keladi: forma doʻkonni oʻzi chaqirmaydi,
// shuning uchun uni bazasiz test qilsa boʻladi.

import type { FormEvent } from 'react'
import { useId, useRef, useState } from 'react'
import { bugun } from '../domain/sana.ts'
import type {
  Hisob,
  Valyuta,
  Xato,
  XatoMaydoni,
  YangiYozuv,
  Yozuv,
  YozuvFormasi,
  YozuvTuri,
} from '../domain/turlar.ts'
import { boshlangichForma, formaQiymatlari, yozuvniTekshir } from '../domain/yozuv.ts'
import { kursniShakllantir, sanaYorligi, summaniShakllantir } from './format.ts'
import { FORMA, OGOHLANTIRISH, xatoMatni } from './matnlar.ts'

/** Chip boʻlib chiqadigan kategoriya — doʻkondagi `Kategoriya` shu shaklga toʻgʻri keladi. */
export type KategoriyaChipi = { id: string; nom: string }

/** Chip boʻlib chiqadigan kategoriyalar, tur boʻyicha ajratilgan (0013; mezon 16). */
export type KategoriyaRoyxati = {
  kirim: readonly KategoriyaChipi[]
  chiqim: readonly KategoriyaChipi[]
}

export type YozuvFormaProps = {
  /**
   * Chip boʻlib chiqadigan kategoriyalar. Forma doʻkonni oʻzi chaqirmaydi — roʻyxatni
   * kim chaqirgan boʻlsa oʻsha beradi (KELISHUV 10-boʻlim):
   * yangi yozuvda `korinadiganKategoriyalar(turi)`, tahrirlashda esa `hammaKategoriyalar()`,
   * chunki eski yozuvning kategoriyasi yashirilgan boʻlishi mumkin (mezon 14).
   */
  kategoriyalar: KategoriyaRoyxati
  /** Tekshiruvdan oʻtgan yozuvni saqlaydi: yangi yozuvda `yozuvQosh`, tahrirda `yozuvniYangila`. */
  saqla: (yangi: YangiYozuv) => Promise<void> | void
  /** Berilsa — tahrirlash rejimi: maydonlar shu yozuvning qiymatlari bilan toʻladi (0014). */
  yozuv?: Yozuv | undefined
  /** `×` bosilganda va saqlangandan keyin chaqiriladi. */
  yop?: (() => void) | undefined
  /** «Boshqarish» — «Kategoriyalar» ekraniga oʻtish (keyingi vazifada ulanadi). */
  boshqarish?: (() => void) | undefined
}

/** Xato qaysi maydonda ekani ekrandagi tartibda: birinchi xatoli maydonga suriladi. */
const XATO_TARTIBI: readonly XatoMaydoni[] = [
  'summa',
  'turi',
  'kategoriyaId',
  'hisob',
  'valyuta',
  'kurs',
  'sana',
]

/** Tahrirlash formasining qiymatlari — summa va kurs ekran koʻrinishiga oʻgiriladi. */
function boshlangichHolat(yozuv: Yozuv | undefined): YozuvFormasi {
  if (yozuv === undefined) {
    return boshlangichForma()
  }
  const qiymatlar = formaQiymatlari(yozuv)
  return {
    ...qiymatlar,
    summa: summaniShakllantir(qiymatlar.summa, qiymatlar.valyuta).qiymat,
    kurs: kursniShakllantir(qiymatlar.kurs).qiymat,
  }
}

export function YozuvForma({ kategoriyalar, saqla, yozuv, yop, boshqarish }: YozuvFormaProps) {
  const tahrir = yozuv !== undefined
  const [forma, setForma] = useState<YozuvFormasi>(() => boshlangichHolat(yozuv))
  const [xatolar, setXatolar] = useState<readonly Xato[]>([])
  const [summaOgohi, setSummaOgohi] = useState('')
  const [kursOgohi, setKursOgohi] = useState('')

  const summaRef = useRef<HTMLInputElement>(null)
  const turiRef = useRef<HTMLButtonElement>(null)
  const kategoriyaRef = useRef<HTMLDivElement>(null)
  const hisobRef = useRef<HTMLButtonElement>(null)
  const valyutaRef = useRef<HTMLButtonElement>(null)
  const kursRef = useRef<HTMLInputElement>(null)
  const sanaRef = useRef<HTMLInputElement>(null)

  const asos = useId()
  const kursId = `${asos}-kurs`
  const sanaId = `${asos}-sana`
  const kategoriyaId = `${asos}-kategoriya`
  const hisobId = `${asos}-hisob`
  const valyutaId = `${asos}-valyuta`

  const bugungi = bugun()
  const dollar = forma.valyuta === 'dollar'
  const royxat = forma.turi === '' ? [] : kategoriyalar[forma.turi]

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
      case 'turi':
        return turiRef.current
      case 'kategoriyaId':
        return kategoriyaRef.current?.querySelector('button') ?? null
      case 'hisob':
        return hisobRef.current
      case 'valyuta':
        return valyutaRef.current
      case 'kurs':
        return kursRef.current
      default:
        return sanaRef.current
    }
  }

  /** Birinchi xatoli maydonga suriladi va fokus oʻsha yerga tushadi (dizayn: «Xato holatlari»). */
  function xatoliMaydongaOt(yangiXatolar: readonly Xato[]): void {
    const birinchi = XATO_TARTIBI.find((m) => yangiXatolar.some((x) => x.maydon === m))
    if (birinchi === undefined) {
      return
    }
    const nishon = maydonElementi(birinchi)
    if (nishon === null) {
      return
    }
    // jsdom da `scrollIntoView` yoʻq — shuning uchun mavjudligi tekshiriladi.
    if (typeof nishon.scrollIntoView === 'function') {
      nishon.scrollIntoView({ block: 'center' })
    }
    nishon.focus()
  }

  function summaniOzgartir(xom: string): void {
    const { qiymat, kasrOlindi } = summaniShakllantir(xom, forma.valyuta)
    setForma({ ...forma, summa: qiymat })
    setSummaOgohi(kasrOlindi ? OGOHLANTIRISH.somdaKasrYoq : '')
    xatolarniTozala(['summa'])
  }

  function turniTanla(turi: YozuvTuri): void {
    // Roʻyxatlar alohida (0013): tur almashsa tanlangan kategoriya bekor boʻladi.
    setForma({ ...forma, turi, kategoriyaId: '' })
    xatolarniTozala(['turi'])
  }

  function kategoriyaniTanla(id: string): void {
    setForma({ ...forma, kategoriyaId: id })
    xatolarniTozala(['kategoriyaId'])
  }

  function hisobniTanla(hisob: Hisob): void {
    setForma({ ...forma, hisob })
    xatolarniTozala(['hisob'])
  }

  function valyutaniTanla(valyuta: Valyuta): void {
    if (valyuta === forma.valyuta) {
      return
    }
    if (valyuta === 'som') {
      // Soʻmga qaytilsa kurs unutiladi (mezon 7) va tiyin qismi olib tashlanadi (0033).
      const { qiymat, kasrOlindi } = summaniShakllantir(forma.summa, 'som')
      setForma({ ...forma, valyuta, kurs: '', summa: qiymat })
      setSummaOgohi(kasrOlindi ? OGOHLANTIRISH.somdaKasrOlindi : '')
      setKursOgohi('')
    } else {
      setForma({ ...forma, valyuta })
      setSummaOgohi('')
    }
    xatolarniTozala(['valyuta', 'kurs', 'summa'])
  }

  function kursniOzgartir(xom: string): void {
    const { qiymat, kasrOlindi } = kursniShakllantir(xom)
    setForma({ ...forma, kurs: qiymat })
    setKursOgohi(kasrOlindi ? OGOHLANTIRISH.kursKasrYoq : '')
    xatolarniTozala(['kurs'])
  }

  function sananiOzgartir(sana: string): void {
    setForma({ ...forma, sana })
    xatolarniTozala(['sana'])
  }

  function izohniOzgartir(izoh: string): void {
    setForma({ ...forma, izoh })
  }

  async function yubor(hodisa: FormEvent<HTMLFormElement>): Promise<void> {
    hodisa.preventDefault()
    // Tekshiruv «Saqlash» bosilganda bir yoʻla bajariladi (dizayn: «Xato holatlari»).
    const natija = yozuvniTekshir(forma)
    if (!natija.ok) {
      setXatolar(natija.xatolar)
      xatoliMaydongaOt(natija.xatolar)
      return
    }
    setXatolar([])
    await saqla(natija.qiymat)
    if (!tahrir) {
      setForma(boshlangichForma())
      setSummaOgohi('')
      setKursOgohi('')
    }
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
        <button type="button" className="belgi-tugma" aria-label={FORMA.yopish} onClick={yop}>
          ×
        </button>
        <h1 className="sarlavha">{tahrir ? FORMA.sarlavhaTahrir : FORMA.sarlavhaYangi}</h1>
      </header>

      <form className="forma" onSubmit={yubor} noValidate>
        <div className="blok">
          <div className={summaXatosi === undefined ? 'summa-maydon' : 'summa-maydon xatoli'}>
            <input
              ref={summaRef}
              className="summa-kirit"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              aria-label={FORMA.summa}
              aria-invalid={summaXatosi !== undefined}
              aria-describedby={summaXatosi === undefined ? undefined : `${asos}-summa-xato`}
              placeholder="0"
              value={forma.summa}
              onChange={(h) => summaniOzgartir(h.target.value)}
            />
            <span className="valyuta-sozi">{dollar ? FORMA.dollarBelgisi : FORMA.somSozi}</span>
          </div>
          {xatoQatori('summa', `${asos}-summa-xato`)}
          {summaOgohi === '' ? null : <p className="xato-matni">{summaOgohi}</p>}
        </div>

        <div className="blok">
          <div className="segment" role="group" aria-label="Tur">
            <button
              ref={turiRef}
              type="button"
              className={forma.turi === 'chiqim' ? 'segment-bolak tanlangan-chiqim' : 'segment-bolak'}
              aria-pressed={forma.turi === 'chiqim'}
              onClick={() => turniTanla('chiqim')}
            >
              {FORMA.chiqim}
            </button>
            <button
              type="button"
              className={forma.turi === 'kirim' ? 'segment-bolak tanlangan-kirim' : 'segment-bolak'}
              aria-pressed={forma.turi === 'kirim'}
              onClick={() => turniTanla('kirim')}
            >
              {FORMA.kirim}
            </button>
          </div>
          {xatoQatori('turi', `${asos}-turi-xato`)}
        </div>

        <div className="blok">
          <div className="blok-boshi">
            <span className="yorliq" id={kategoriyaId}>
              {FORMA.kategoriya}
            </span>
            <button type="button" className="matn-havola" onClick={boshqarish}>
              {FORMA.boshqarish}
            </button>
          </div>
          <div className="chiplar" ref={kategoriyaRef} role="group" aria-labelledby={kategoriyaId}>
            {forma.turi === '' ? (
              <p className="yordam">{FORMA.avvalTurTanlang}</p>
            ) : royxat.length === 0 ? (
              <p className="yordam">{FORMA.kategoriyaYoq}</p>
            ) : (
              royxat.map((kategoriya) => (
                <button
                  key={kategoriya.id}
                  type="button"
                  className={chipSinfi(forma.kategoriyaId === kategoriya.id)}
                  aria-pressed={forma.kategoriyaId === kategoriya.id}
                  onClick={() => kategoriyaniTanla(kategoriya.id)}
                >
                  {kategoriya.nom}
                </button>
              ))
            )}
          </div>
          {xatoQatori('kategoriyaId', `${asos}-kategoriya-xato`)}
        </div>

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
              onClick={() => hisobniTanla('karta')}
            >
              {FORMA.karta}
            </button>
            <button
              type="button"
              className={chipSinfi(forma.hisob === 'naqd')}
              aria-pressed={forma.hisob === 'naqd'}
              onClick={() => hisobniTanla('naqd')}
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
              onClick={() => valyutaniTanla('som')}
            >
              {FORMA.somChipi}
            </button>
            <button
              type="button"
              className={chipSinfi(dollar)}
              aria-pressed={dollar}
              onClick={() => valyutaniTanla('dollar')}
            >
              {FORMA.dollarChipi}
            </button>
          </div>
        </div>

        {dollar ? (
          <div className="blok">
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
              onChange={(h) => kursniOzgartir(h.target.value)}
            />
            {xatoQatori('kurs', `${asos}-kurs-xato`)}
            {kursOgohi === '' ? null : <p className="xato-matni">{kursOgohi}</p>}
          </div>
        ) : null}

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
                onChange={(h) => sananiOzgartir(h.target.value)}
              />
            </span>
          </div>
          {xatoQatori('sana', `${asos}-sana-xato`)}
        </div>

        <div className="blok">
          <input
            className="maydon"
            type="text"
            autoComplete="off"
            aria-label={FORMA.izoh}
            placeholder={FORMA.izohNamunasi}
            value={forma.izoh}
            onChange={(h) => izohniOzgartir(h.target.value)}
          />
        </div>

        <div className="panel-past">
          <button type="submit" className="asosiy-tugma">
            {FORMA.saqlash}
          </button>
        </div>
      </form>
    </div>
  )
}
