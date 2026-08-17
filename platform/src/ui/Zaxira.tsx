// «Zaxira» ekrani — eksport va fayldan tiklash.
//
// Tavsif: `design/zaxira.md`. Rang, oʻlcham va boʻshliq: `design/uslub.md`.
// Shartnoma: `platform/KELISHUV.md` 22–26-boʻlimlar.
//
// Ekranning oʻz ishi — **oqim**: doʻkon faqat matn va obyekt bilan ishlaydi, faylni
// yuklab olish, tanlash va qadamlarning ketma-ketligi shu yerda. Tartib qatʼiy
// (0027, 0041): tanlangan fayl tekshiriladi → hozirgi maʼlumot faylga chiqariladi →
// oʻsha fayl qaytarib tanlanadi → ustiga yoziladi. Boʻsh daftarda oʻrtadagi ikki qadam
// tushib qoladi (0055).
//
// Bu ekranda modal oyna, tasdiq oynasi va kutish aylanasi yoʻq (0029 ruhi; uslub):
// hamma qadam kartochka ichida ochiladi, ekran almashmaydi.

import { useEffect, useRef, useState } from 'react'
import { bugun } from '../domain/sana.ts'
import type { Natija, Xato } from '../domain/turlar.ts'
import type { ZaxiraSanoqlari } from '../domain/zaxira.ts'
import { minglikBoshliq, sanaYorligi } from './format.ts'
import {
  ZAXIRA,
  oxirgiZaxiraQatori,
  tiklanadiganQatori,
  xatoMatni,
  yuklabOlindiQatori,
} from './matnlar.ts'

/** Chiqarilgan yoki tanlangan fayl: nomi ekranda koʻrinadi, matni solishtiruvga ketadi. */
type Fayl = { nom: string; matn: string }

export type ZaxiraProps = {
  /** `oxirgiEksportniOl()`; `null` — daftar hech qachon eksport qilinmagan (mezon 11). */
  oxirgiEksport: string | null
  /** `daftarBoshmi()` — ogohlantirish matni va 0055 istisnosi shunga bogʻliq. */
  daftarBosh: boolean
  /** «Eksport» — `zaxiraniChiqar('qolda')`. */
  eksport: () => Promise<Fayl>
  /** 2-qadam — `zaxiraniChiqar('import-oldidan')` (0027). */
  avtomatikZaxira: () => Promise<Fayl>
  /** 1-qadam tekshiruvi — `zaxiraniOqi(matn)` (spec 22). */
  faylniOqi: (matn: string) => Natija<unknown>
  /** 3-qadam — `zaxiraTasdigi(tanlangan, chiqarilgan)` (0041). */
  tasdiqla: (tanlangan: string, chiqarilgan: string) => Natija<true>
  /** 4-qadam — `zaxiraniImport(matn)`; sonlar bilan qaytadi (0065). */
  importQil: (matn: string) => Promise<Natija<ZaxiraSanoqlari>>
  /** Faylni qurilmaga berish — `faylniYuklabOl` (test uni almashtiradi). */
  yuklabOl: (nom: string, matn: string) => void
  /** «Yozuvlarni koʻrish» — «Yozuvlar» ekrani. */
  yozuvlarniKor: () => void
}

/** Import oqimining holati. Ekrandan chiqilsa komponent yoʻqoladi — oqim ham (0065). */
type Oqim =
  | { qadam: 'tinch' }
  | { qadam: 'tasdiq'; tiklanadigan: Fayl; chiqarilgan: Fayl }
  | { qadam: 'tugadi'; sanoqlar: ZaxiraSanoqlari }
  | { qadam: 'bekor' }

/** «3 yozuv · 2 kontakt · 2 qarz · 4 toʻlov» (0065; dizayn 7-boʻlim). */
export function sanoqQatori(sanoqlar: ZaxiraSanoqlari): string {
  const son = (qiymat: number): string => minglikBoshliq(String(qiymat))
  // Nol boʻlgan tur ham qatorda qoladi: qator toʻrt ustunli hisob, roʻyxat emas.
  return [
    `${son(sanoqlar.yozuvlar)} yozuv`,
    `${son(sanoqlar.kontaktlar)} kontakt`,
    `${son(sanoqlar.qarzlar)} qarz`,
    `${son(sanoqlar.tolovlar)} toʻlov`,
  ].join(' · ')
}

/** Ikki qatorli xato: sabab, ostida har doim bir xil natija (dizayn 5-boʻlim). */
function XatoQatorlari({ sabab }: { sabab: string }) {
  return (
    <div className="zaxira-xato" role="status">
      <p className="xato-matni">{sabab}</p>
      <p className="yordam">{ZAXIRA.ozgarmadi}</p>
    </div>
  )
}

export function Zaxira({
  oxirgiEksport,
  daftarBosh,
  eksport,
  avtomatikZaxira,
  faylniOqi,
  tasdiqla,
  importQil,
  yuklabOl,
  yozuvlarniKor,
}: ZaxiraProps) {
  const [chiqarilganNom, setChiqarilganNom] = useState<string | null>(null)
  const [oqim, setOqim] = useState<Oqim>({ qadam: 'tinch' })
  const [boshlanishXatosi, setBoshlanishXatosi] = useState<string | null>(null)
  const [tasdiqXatosi, setTasdiqXatosi] = useState<string | null>(null)
  const tiklanadiganRef = useRef<HTMLInputElement>(null)
  const zaxiraRef = useRef<HTMLInputElement>(null)

  /**
   * Fayl tanlagich tanlanmay yopilgani: 1-qadamda hech narsa boʻlmaydi (forma `×` bilan
   * yopilgani kabi), 3-qadamda esa sabab koʻrsatiladi (17b-mezon).
   */
  useEffect(() => {
    const maydon = zaxiraRef.current
    if (maydon === null) {
      return
    }
    function bekorQilindi(): void {
      setTasdiqXatosi(ZAXIRA.tanlanmadi)
    }
    maydon.addEventListener('cancel', bekorQilindi)
    return () => {
      maydon.removeEventListener('cancel', bekorQilindi)
    }
  }, [oqim.qadam])

  const bugungi = bugun()

  function xatoSababi(natija: { xatolar: Xato[] }): string {
    const birinchi = natija.xatolar[0]
    return birinchi === undefined ? '' : xatoMatni(birinchi.kod, birinchi.xabar)
  }

  async function eksportniBosdi(): Promise<void> {
    const fayl = await eksport()
    yuklabOl(fayl.nom, fayl.matn)
    setChiqarilganNom(fayl.nom)
  }

  async function importniBosdi(): Promise<void> {
    // Yangi urinish boshlanishi bilan eski xabarlar yoʻqoladi (dizayn 5-boʻlim).
    setBoshlanishXatosi(null)
    setOqim({ qadam: 'tinch' })
    tiklanadiganRef.current?.click()
  }

  async function importQildi(tiklanadiganMatn: string): Promise<void> {
    const natija = await importQil(tiklanadiganMatn)
    if (!natija.ok) {
      setTasdiqXatosi(xatoSababi(natija))
      return
    }
    setTasdiqXatosi(null)
    setOqim({ qadam: 'tugadi', sanoqlar: natija.qiymat })
  }

  /** 1-qadam: fayl tanlandi. */
  async function tiklanadiganTanlandi(fayl: File): Promise<void> {
    setBoshlanishXatosi(null)
    setTasdiqXatosi(null)
    const matn = await fayl.text()
    const oqilgan = faylniOqi(matn)
    if (!oqilgan.ok) {
      // Oqim umuman boshlanmaydi: avtomatik zaxira chiqarilmaydi (dizayn 5-boʻlim).
      setBoshlanishXatosi(xatoSababi(oqilgan))
      return
    }
    if (daftarBosh) {
      // 0055: boʻsh daftarda avtomatik zaxira ham, tasdiq ham yoʻq.
      await importQildi(matn)
      return
    }
    const chiqarilgan = await avtomatikZaxira()
    yuklabOl(chiqarilgan.nom, chiqarilgan.matn)
    setOqim({
      qadam: 'tasdiq',
      tiklanadigan: { nom: fayl.name, matn },
      chiqarilgan,
    })
  }

  /** 3-qadam: tasdiq fayli tanlandi. */
  async function zaxiraTanlandi(fayl: File): Promise<void> {
    if (oqim.qadam !== 'tasdiq') {
      return
    }
    setTasdiqXatosi(null)
    const matn = await fayl.text()
    const javob = tasdiqla(matn, oqim.chiqarilgan.matn)
    if (!javob.ok) {
      // Oqim buzilmaydi: blok 3-qadamda qoladi va fayl qayta tanlanadi (0065).
      setTasdiqXatosi(xatoSababi(javob))
      return
    }
    await importQildi(oqim.tiklanadigan.matn)
  }

  const holatQatori =
    oxirgiEksport === null
      ? ZAXIRA.zaxiraYoq
      : oxirgiZaxiraQatori(sanaYorligi(oxirgiEksport, bugungi))

  return (
    <div className="ekran">
      <header className="panel-tepa">
        <h1 className="sarlavha">{ZAXIRA.sarlavha}</h1>
      </header>

      <div className="zaxira-tanasi">
        <section className="kartochka" aria-labelledby="zaxira-olish">
          <h2 className="kartochka-sarlavha" id="zaxira-olish">
            {ZAXIRA.olish}
          </h2>
          <p className="zaxira-holat">{holatQatori}</p>
          <p className="yordam">{ZAXIRA.eksportYordami}</p>
          <button
            type="button"
            className="asosiy-tugma"
            onClick={() => {
              void eksportniBosdi()
            }}
          >
            {ZAXIRA.eksport}
          </button>
          {chiqarilganNom === null ? null : (
            <p className="yordam">{yuklabOlindiQatori(chiqarilganNom)}</p>
          )}
        </section>

        <section className="kartochka" aria-labelledby="zaxira-tiklash">
          <h2 className="kartochka-sarlavha" id="zaxira-tiklash">
            {ZAXIRA.tiklash}
          </h2>

          {/*
            Ogohlantirish qizil emas va tugma xavfli tugma emas (dizayn 3-boʻlim):
            maʼnoni matnning oʻzi tashiydi, qaytish yoʻli esa mavjud (0027).
          */}
          <p className="zaxira-ogoh">
            {ZAXIRA.ogohBirinchiBoshi}
            <strong>{ZAXIRA.ogohBirinchiKuchli}</strong>
            {ZAXIRA.ogohBirinchiOxiri}
          </p>
          <p className="yordam">{daftarBosh ? ZAXIRA.ogohBosh : ZAXIRA.ogohIkkinchi}</p>

          {oqim.qadam === 'tasdiq' ? (
            <div className="zaxira-oqim">
              <p className="yordam">{tiklanadiganQatori(oqim.tiklanadigan.nom)}</p>
              <p className="zaxira-kuchli">{ZAXIRA.chiqarildi}</p>
              <p className="yordam">{oqim.chiqarilgan.nom}</p>
              <p className="zaxira-matn">{ZAXIRA.qaytaribTanlang}</p>
              {tasdiqXatosi === null ? null : <XatoQatorlari sabab={tasdiqXatosi} />}
              <button
                type="button"
                className="asosiy-tugma"
                onClick={() => {
                  setTasdiqXatosi(null)
                  zaxiraRef.current?.click()
                }}
              >
                {ZAXIRA.zaxiraFayliniTanlash}
              </button>
              <button
                type="button"
                className="matn-havola"
                onClick={() => {
                  setOqim({ qadam: 'bekor' })
                  setTasdiqXatosi(null)
                }}
              >
                {ZAXIRA.bekorQilish}
              </button>
            </div>
          ) : null}

          {oqim.qadam === 'tugadi' ? (
            <div className="zaxira-oqim">
              <p className="zaxira-kuchli">{ZAXIRA.tiklandi}</p>
              <p className="zaxira-sanoq">{sanoqQatori(oqim.sanoqlar)}</p>
              <button type="button" className="matn-havola" onClick={yozuvlarniKor}>
                {ZAXIRA.yozuvlarniKorish}
              </button>
            </div>
          ) : null}

          {oqim.qadam === 'bekor' ? (
            <div className="zaxira-oqim">
              <p className="zaxira-matn">{ZAXIRA.bekorBirinchi}</p>
              <p className="yordam">{ZAXIRA.bekorIkkinchi}</p>
            </div>
          ) : null}

          {oqim.qadam === 'tasdiq' ? null : (
            <button
              type="button"
              className="ikkinchi-tugma zaxira-import"
              onClick={() => {
                void importniBosdi()
              }}
            >
              {ZAXIRA.import}
            </button>
          )}

          {/* 3-qadamdagi xato blok ichida; import xatosi ham shu yerda koʻrinadi. */}
          {oqim.qadam !== 'tasdiq' && tasdiqXatosi !== null ? (
            <XatoQatorlari sabab={tasdiqXatosi} />
          ) : null}
          {boshlanishXatosi === null ? null : <XatoQatorlari sabab={boshlanishXatosi} />}

          {/*
            Fayl tanlagichlar koʻrinmaydi: ularni tugmalar ochadi. `value` har tanlovdan
            keyin tozalanadi — aks holda bir xil faylni ikkinchi marta tanlash hodisa
            bermasdi va qayta urinish ishlamay qolardi (0065).
          */}
          <input
            ref={tiklanadiganRef}
            className="fayl-kirit"
            type="file"
            accept="application/json,.json"
            aria-label={ZAXIRA.tiklanadiganYorligi}
            onChange={(hodisa) => {
              const fayl = hodisa.target.files?.[0]
              hodisa.target.value = ''
              if (fayl !== undefined) {
                void tiklanadiganTanlandi(fayl)
              }
            }}
          />
          <input
            ref={zaxiraRef}
            className="fayl-kirit"
            type="file"
            accept="application/json,.json"
            aria-label={ZAXIRA.zaxiraFayliYorligi}
            onChange={(hodisa) => {
              const fayl = hodisa.target.files?.[0]
              hodisa.target.value = ''
              if (fayl !== undefined) {
                void zaxiraTanlandi(fayl)
              }
            }}
          />
        </section>
      </div>
    </div>
  )
}
