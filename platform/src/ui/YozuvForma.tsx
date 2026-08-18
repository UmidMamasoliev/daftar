// «Yangi yozuv» / «Yozuvni tahrirlash» formasi.
//
// Tavsif: `design/kirim-chiqim.md` (1-boʻlim) — maydonlar tartibi, matnlar va xato jadvali
// oʻsha yerdan. Rang, oʻlcham va boʻshliq: `design/uslub.md`.
// Tekshiruv va saqlash shartnomasi: `platform/KELISHUV.md`.
//
// Kategoriyalar roʻyxati tashqaridan (props orqali) keladi: forma doʻkonni oʻzi chaqirmaydi,
// shuning uchun uni bazasiz test qilsa boʻladi.

import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { bugun } from '../domain/sana.ts'
import type {
  Hisob,
  Kategoriya,
  Valyuta,
  Xato,
  XatoMaydoni,
  YangiYozuv,
  Yozuv,
  YozuvFormasi,
  YozuvTuri,
} from '../domain/turlar.ts'
import { boshlangichForma, formaQiymatlari, yozuvniTekshir } from '../domain/yozuv.ts'
import {
  belgilarSoni,
  kursniShakllantir,
  kursorOrni,
  sanaYorligi,
  summaniShakllantir,
} from './format.ts'
import { FORMA, OGOHLANTIRISH, xatoMatni } from './matnlar.ts'

/** Chip boʻlib chiqadigan kategoriya — doʻkondagi `Kategoriya` ning oʻzi. */
export type KategoriyaChipi = Kategoriya

/** Chip boʻlib chiqadigan kategoriyalar, tur boʻyicha ajratilgan (0013; mezon 16). */
export type KategoriyaRoyxati = {
  kirim: readonly Kategoriya[]
  chiqim: readonly Kategoriya[]
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
  /**
   * Tahrirlashda: yozuvning **oʻz** kategoriyasi. Yashirilgan boʻlsa ham chip boʻlib
   * chiqadi va tanlangan turadi; boshqa yashirilganlar chiqmaydi (0057; mezon 14c).
   * Tur oʻzgartirilsa u ham chiqmaydi — roʻyxat yangi turning koʻrinadiganlari boʻladi.
   */
  yozuvKategoriyasi?: Kategoriya | undefined
  /** `×` bosilganda va saqlangandan keyin chaqiriladi. */
  yop?: (() => void) | undefined
  /**
   * «Boshqarish» — «Kategoriyalar» ekraniga oʻtish. Joriy tur beriladi: oʻsha ekran
   * shu turni ochiq qilib koʻrsatadi, tur tanlanmagan boʻlsa `''` keladi (dizayn).
   */
  boshqarish?: ((turi: YozuvTuri | '') => void) | undefined
  /**
   * «Boshqarish» dan qaytilganda bittaga ortadi. Har ortganda forma **bir marta**
   * tekshiradi: tanlangan kategoriya hali koʻrinadimi (dizayn: «Tanlangan kategoriya
   * yashirilsa»). Shu sababli yashirib, keyin «Koʻrsatish» bilan qaytarib qaytilsa
   * tanlov joyida qoladi — tekshiruv oʻsha paytdagi holatga qaraydi.
   */
  boshqarishdanQaytish?: number | undefined
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

export function YozuvForma({
  kategoriyalar,
  saqla,
  yozuv,
  yozuvKategoriyasi,
  yop,
  boshqarish,
  boshqarishdanQaytish = 0,
}: YozuvFormaProps) {
  const tahrir = yozuv !== undefined
  const [forma, setForma] = useState<YozuvFormasi>(() => boshlangichHolat(yozuv))
  const [xatolar, setXatolar] = useState<readonly Xato[]>([])
  const [summaOgohi, setSummaOgohi] = useState('')
  const [kursOgohi, setKursOgohi] = useState('')
  const [kategoriyaOgohi, setKategoriyaOgohi] = useState('')
  // Saqlash ketayotgan payt «Saqlash» oʻchiq turadi — ikkinchi bosish brauzerdan
  // ham oʻtmasin. Yangi vizual holat qoʻshilmaydi: tugmaning rangi oʻzinikidan
  // olinadi, matni oʻzgarmaydi va bu holat bir lahza turadi.
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  // Bayroqning oʻzi `ref` da: qayta kirish **shu lahzada** toʻsilishi kerak, holat
  // yangilanishini kutib boʻlmaydi (0029 ruhida — bir niyat bitta yozuv).
  const saqlashKetdi = useRef(false)

  const summaRef = useRef<HTMLInputElement>(null)
  const turiRef = useRef<HTMLButtonElement>(null)
  const kategoriyaRef = useRef<HTMLDivElement>(null)
  const hisobRef = useRef<HTMLButtonElement>(null)
  const valyutaRef = useRef<HTMLButtonElement>(null)
  const kursRef = useRef<HTMLInputElement>(null)
  const sanaRef = useRef<HTMLInputElement>(null)

  // Format terish paytida qoʻyilgani uchun kursor oʻz-oʻzidan oxiriga sakraydi. Yangi
  // oʻrni shu yerda eslab qolinadi va DOM yangilangach qaytariladi (uslub: «Maydonda
  // terish paytidagi format»).
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
  const sanaId = `${asos}-sana`
  const kategoriyaId = `${asos}-kategoriya`
  const hisobId = `${asos}-hisob`
  const valyutaId = `${asos}-valyuta`

  const bugungi = bugun()
  const dollar = forma.valyuta === 'dollar'
  const korinadigan = forma.turi === '' ? [] : kategoriyalar[forma.turi]
  // 0057: tahrirlashda yozuvning oʻz kategoriyasi roʻyxatga qoʻshiladi — yashirilgan
  // boʻlsa ham. Faqat oʻz turida: tur oʻzgartirilsa u chiqmaydi (mezon 14c).
  const royxat =
    yozuvKategoriyasi !== undefined &&
    forma.turi !== '' &&
    yozuvKategoriyasi.turi === forma.turi &&
    !korinadigan.some((kategoriya) => kategoriya.id === yozuvKategoriyasi.id)
      ? [...korinadigan, yozuvKategoriyasi]
      : korinadigan

  /**
   * «Boshqarish» dan qaytilgandagi bir martalik tekshiruv (dizayn: «Tanlangan
   * kategoriya yashirilsa»). Tanlangan kategoriya endi koʻrinmasa — tanlov bekor
   * boʻladi va oʻrniga boshqasi avtomatik tanlanmaydi: yozuv odam bir soniya oldin
   * yashirgan kategoriyaga jimgina tushib ketmasin (0013).
   *
   * Qoida faqat yangi yozuv formasiga tegishli: tahrirlashda yashirilgan
   * kategoriyali eski yozuv oʻz nomi bilan qolaveradi (mezon 14).
   */
  useEffect(() => {
    if (tahrir || forma.turi === '' || forma.kategoriyaId === '') {
      return
    }
    const bor = kategoriyalar[forma.turi].some(
      (kategoriya) => kategoriya.id === forma.kategoriyaId,
    )
    if (bor) {
      return
    }
    setForma((oldingi) => ({ ...oldingi, kategoriyaId: '' }))
    setKategoriyaOgohi(FORMA.tanlanganYashirildi)
    // Ataylab faqat qaytish belgisiga bogʻlangan: tekshiruv qaytilganda bir marta
    // bajariladi, roʻyxat har oʻzgarganda emas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boshqarishdanQaytish])

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

  function summaniOzgartir(hodisa: ChangeEvent<HTMLInputElement>): void {
    const xom = hodisa.target.value
    const chapda = belgilarSoni(xom.slice(0, hodisa.target.selectionStart ?? xom.length))
    const { qiymat, kasrOlindi } = summaniShakllantir(xom, forma.valyuta)
    kursorlar.current.summa = kursorOrni(qiymat, chapda)
    setForma({ ...forma, summa: qiymat })
    // Kasr kesilgani xato emas: maydon qizil boʻlmaydi, saqlash toʻxtamaydi (dizayn).
    setSummaOgohi(kasrOlindi ? OGOHLANTIRISH.somdaKasrOlindi : '')
    xatolarniTozala(['summa'])
  }

  function turniTanla(turi: YozuvTuri): void {
    // Roʻyxatlar alohida (0013): tur almashsa tanlangan kategoriya bekor boʻladi.
    setForma({ ...forma, turi, kategoriyaId: '' })
    // Boshqa turga oʻtilganda qator eskiradi: u aynan oldingi roʻyxat haqida edi.
    setKategoriyaOgohi('')
    xatolarniTozala(['turi'])
  }

  function kategoriyaniTanla(id: string): void {
    setForma({ ...forma, kategoriyaId: id })
    setKategoriyaOgohi('')
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

  function kursniOzgartir(hodisa: ChangeEvent<HTMLInputElement>): void {
    const xom = hodisa.target.value
    const chapda = belgilarSoni(xom.slice(0, hodisa.target.selectionStart ?? xom.length))
    const { qiymat, kasrOlindi } = kursniShakllantir(xom)
    kursorlar.current.kurs = kursorOrni(qiymat, chapda)
    setForma({ ...forma, kurs: qiymat })
    setKursOgohi(kasrOlindi ? OGOHLANTIRISH.kursKasrOlindi : '')
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
    // «Saqlash» tez ikki marta bosilsa (yoki dblclick) ikkinchisi shu yerda toʻxtaydi:
    // bitta niyatdan ikkita yozuv chiqmasin.
    if (saqlashKetdi.current) {
      return
    }
    // Tekshiruv «Saqlash» bosilganda bir yoʻla bajariladi (dizayn: «Xato holatlari»).
    // Doʻkonning oʻz tekshiruvi: chipda koʻrinmaydigan yoki turi mos kelmaydigan
    // kategoriya oʻtib ketmasin (KELISHUV 10-boʻlim; mezon 16). UI baribir
    // oldindan toʻsadi — bu ikkinchi qatlam.
    const natija = yozuvniTekshir(forma, royxat)
    if (!natija.ok) {
      setXatolar(natija.xatolar)
      xatoliMaydongaOt(natija.xatolar)
      return
    }
    setXatolar([])
    saqlashKetdi.current = true
    setSaqlanmoqda(true)
    try {
      await saqla(natija.qiymat)
    } finally {
      // Saqlash rad etilsa tugma yana bosiladigan boʻlib qoladi.
      saqlashKetdi.current = false
      setSaqlanmoqda(false)
    }
    if (!tahrir) {
      setForma(boshlangichForma())
      setSummaOgohi('')
      setKursOgohi('')
      setKategoriyaOgohi('')
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
              // Forma ochilganda kursor shu yerda (dizayn: 1-boʻlim).
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              inputMode="decimal"
              autoComplete="off"
              aria-label={FORMA.summa}
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
            <button
              type="button"
              className="matn-havola"
              onClick={() => {
                boshqarish?.(forma.turi)
              }}
            >
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
          {kategoriyaOgohi === '' ? null : <p className="yordam">{kategoriyaOgohi}</p>}
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
          <button type="submit" className="asosiy-tugma" disabled={saqlanmoqda}>
            {FORMA.saqlash}
          </button>
        </div>
      </form>
    </div>
  )
}
