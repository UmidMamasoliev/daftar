// «Hisobot» ekrani — oylik hisobot.
//
// Tavsif: `design/oylik-hisobot.md`. Rang, oʻlcham va boʻshliq: `design/uslub.md`.
// Shartnoma: `platform/KELISHUV.md` 18–21-boʻlimlar.
//
// Ekran hech narsa hisoblamaydi va hech narsa saqlamaydi: `Hisobot` doʻkondan tayyor
// boʻlib keladi (0014, 0045; mezon 18). Ekranning oʻz ishi uchta:
// 1. davr tanlash (oy strelkalari va ixtiyoriy davr bloki);
// 2. raqamlarni dizayndagi ishora/rang qoidalari bilan chizish;
// 3. kurs yoʻq boʻlsa uni bir marta soʻrash (0043).
//
// Bu ekranda oʻchirish, tahrirlash va qoʻshish yoʻq (0021), shuning uchun «qaytarish»
// paneli ham hech qachon chiqmaydi (0029). Kategoriya va qarz qatorlari **bosilmaydi**
// (0064): ular oddiy `li` boʻlib turadi, tugma ham, havola ham emas.

import type { ReactNode } from 'react'
import { useEffect, useId, useState } from 'react'
import type {
  Davr,
  Hisobot as HisobotTuri,
  JamiBolagi,
  KategoriyaQatori,
  Oy,
  QarzQatoriTuri,
  TaxminiyJami,
} from '../domain/hisobot.ts'
import { QARZ_QATORLARI, QARZ_QATOR_ISHORASI, davrTogrimi } from '../domain/hisobot.ts'
import { bugun, sananiTekshir } from '../domain/sana.ts'
import type { Valyuta } from '../domain/turlar.ts'
import { davrMatni, kursMatni, nettoMatni, nettoSinfi, oyMatni, sanaMatni } from './format.ts'
import { KursSorov } from './KursSorov.tsx'
import type { KategoriyaNomi } from './Yozuvlar.tsx'
import { HISOBOT, taxminiyIzohi, taxminiyMatni, xatoMatni } from './matnlar.ts'

/** Jami blokining boʻlaklari — dizayn 3-boʻlimidagi tartibda. */
type BolakTuri = 'kirim' | 'chiqim' | 'farq'

const BOLAK_YORLIQLARI: Record<BolakTuri, string> = {
  kirim: HISOBOT.jamiKirim,
  chiqim: HISOBOT.jamiChiqim,
  farq: HISOBOT.farq,
}

const QARZ_YORLIQLARI: Record<QarzQatoriTuri, string> = {
  berildi: HISOBOT.qarzBerildi,
  qaytdi: HISOBOT.qarzdanQaytdi,
  olindi: HISOBOT.qarzOlindi,
  qaytarildi: HISOBOT.qarzQaytarildi,
}

const VALYUTA_GURUHLARI: Record<Valyuta, string> = {
  som: HISOBOT.somGuruhi,
  dollar: HISOBOT.dollarGuruhi,
}


/**
 * Boʻlak qatoriga qoʻyiladigan **ishorali** qiymat.
 *
 * Doʻkon kirim va chiqimni musbat beradi, farqni oʻz ishorasi bilan (KELISHUV
 * 20-boʻlim). Ishora ekranniki: chiqim boʻlagi manfiyga oʻgiriladi, qolgani oʻz
 * holicha. Nol qiymat uchala boʻlakda ham ishorasiz va neytral rangda chiqadi —
 * `nettoMatni`/`nettoSinfi` aynan shu qoidani beradi (dizayn 3- va 8-boʻlim).
 */
function belgili(bolak: BolakTuri, summa: number): number {
  return bolak === 'chiqim' ? -summa : summa
}

/** Kategoriya qatorining ishorasi: chiqim manfiy, kirim musbat (dizayn 4-boʻlim). */
function ajratmaBelgisi(turi: 'chiqim' | 'kirim', summa: number): number {
  return turi === 'chiqim' ? -summa : summa
}

/**
 * «≈ jami soʻmda» — faqat jami blokida va faqat dollar qatori bor boʻlakda (0038).
 *
 * Rangi neytral: taxminiy raqam haqiqiy raqamdek koʻrinmasin (dizayn 3-boʻlim, 3-qoida).
 */
function TaxminiyQatori({ bolak, taxminiy }: { bolak: BolakTuri; taxminiy: TaxminiyJami }) {
  if (taxminiy.holat === 'hisoblanmadi') {
    return <p className="taxminiy-xato">{HISOBOT.hisoblanmadi}</p>
  }
  if (taxminiy.holat !== 'bor') {
    // `yoq` — taxmin qiladigan narsa yoʻq; `kurs-kerak` — oʻrniga kurs bloki turadi.
    return null
  }
  return (
    <>
      <p className="taxminiy-jami">
        {taxminiyMatni(nettoMatni(belgili(bolak, taxminiy.somda), 'som'))}
      </p>
      <p className="taxminiy-izoh">{taxminiyIzohi(kursMatni(taxminiy.kurs))}</p>
    </>
  )
}

/** Jami blokining bitta boʻlagi: «Jami kirim», «Jami chiqim» yoki «Farq». */
function JamiBolak({
  turi,
  bolak,
  kursBloki,
}: {
  turi: BolakTuri
  bolak: JamiBolagi
  kursBloki: ReactNode
}) {
  return (
    <div className="jami-bolak" role="group" aria-label={BOLAK_YORLIQLARI[turi]}>
      {/* Yordam qatori yorliqning **ostida** turadi (dizayn 3-boʻlim jadvali). */}
      <span className="jami-yorliq">
        <span className="yorliq">{BOLAK_YORLIQLARI[turi]}</span>
        {turi === 'farq' ? <span className="yordam">{HISOBOT.farqYordami}</span> : null}
      </span>
      <div className="jami-qatorlar">
        {bolak.qatorlar.map((qator) => {
          const qiymat = belgili(turi, qator.summa)
          return (
            <span className={`jami-summa ${nettoSinfi(qiymat)}`} key={qator.valyuta}>
              {nettoMatni(qiymat, qator.valyuta)}
            </span>
          )
        })}
        <TaxminiyQatori bolak={turi} taxminiy={bolak.taxminiy} />
        {kursBloki}
      </div>
    </div>
  )
}

/**
 * Kategoriyalar ajratmasi kartochkasi.
 *
 * Guruh sarlavhasi faqat kartochkada **ikkala** valyuta ham boʻlganda qoʻyiladi (0038);
 * bitta valyutada valyutani summaning oʻzi aytadi. Qatorlar **bosilmaydi** (0064) —
 * ular oddiy `li`, tugma ham, havola ham emas.
 */
function Ajratma({
  turi,
  sarlavha,
  sarlavhaId,
  qatorlar,
  boshMatn,
  nomTop,
}: {
  turi: 'chiqim' | 'kirim'
  sarlavha: string
  sarlavhaId: string
  qatorlar: readonly KategoriyaQatori[]
  boshMatn: string
  nomTop: (id: string) => string
}) {
  if (qatorlar.length === 0) {
    return <p className="kartochka-bosh">{boshMatn}</p>
  }
  const guruhKerak = new Set(qatorlar.map((qator) => qator.valyuta)).size > 1
  let oldingi: Valyuta | null = null
  return (
    <section className="kartochka" aria-labelledby={sarlavhaId}>
      <h2 className="kartochka-sarlavha" id={sarlavhaId}>
        {sarlavha}
      </h2>
      <ul className="ajratma">
        {qatorlar.map((qator) => {
          const yangiGuruh = guruhKerak && qator.valyuta !== oldingi
          oldingi = qator.valyuta
          const qiymat = ajratmaBelgisi(turi, qator.summa)
          return (
            <li className="ajratma-qator" key={`${qator.kategoriyaId}-${qator.valyuta}`}>
              {yangiGuruh ? (
                <h3 className="guruh-sarlavha">{VALYUTA_GURUHLARI[qator.valyuta]}</h3>
              ) : null}
              <span className="ajratma-ichi">
                <span className="ajratma-nomi">{nomTop(qator.kategoriyaId)}</span>
                <span className={`jami-summa ${nettoSinfi(qiymat)}`}>
                  {nettoMatni(qiymat, qator.valyuta)}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** «Qarz» bloki — toʻrt yoʻnalish, valyuta boʻyicha alohida, nol qator chizilmaydi (0064). */
function QarzBloki({
  qatorlar,
  sarlavhaId,
}: {
  qatorlar: HisobotTuri['qarz']
  sarlavhaId: string
}) {
  if (qatorlar.length === 0) {
    return <p className="kartochka-bosh">{HISOBOT.qarzHarakatiYoq}</p>
  }
  return (
    <section className="kartochka" aria-labelledby={sarlavhaId}>
      <h2 className="kartochka-sarlavha" id={sarlavhaId}>
        {HISOBOT.qarz}
      </h2>
      <ul className="ajratma">
        {QARZ_QATORLARI.filter((turi) => qatorlar.some((qator) => qator.qator === turi)).map(
          (turi) => (
            <li className="ajratma-qator" key={turi}>
              <span className="ajratma-ichi">
                <span className="ajratma-nomi">{QARZ_YORLIQLARI[turi]}</span>
                <span className="qarz-summalar">
                  {qatorlar
                    .filter((qator) => qator.qator === turi)
                    .map((qator) => {
                      const qiymat = QARZ_QATOR_ISHORASI[turi] * qator.summa
                      return (
                        <span className={`jami-summa ${nettoSinfi(qiymat)}`} key={qator.valyuta}>
                          {nettoMatni(qiymat, qator.valyuta)}
                        </span>
                      )
                    })}
                </span>
              </span>
            </li>
          ),
        )}
      </ul>
      <p className="kartochka-izoh">{HISOBOT.qarzIzohi}</p>
    </section>
  )
}

export type HisobotProps = {
  /** `hisobotniOl(davr)` natijasi; `null` — hali oʻqilmagan (birinchi chizish). */
  hisobot: HisobotTuri | null
  /**
   * Kategoriya nomlari — `hammaKategoriyalar()`. Yashirilgani ham kerak: ajratmada u
   * odatdagidek koʻrinadi va hech qanday belgi olmaydi (0013; mezon 12).
   */
  kategoriyalar: readonly KategoriyaNomi[]
  /** Davr qatori holati: `Oy` — oy holati, `null` — ixtiyoriy davr holati. */
  oy: Oy | null
  /** Joriy kalendar oy: `›` shu oyda oʻchiq boʻladi (0034). */
  joriyOy: Oy
  /** `‹` va `›` — bir oy orqaga yoki oldinga (mezon 2). */
  oyniSur: (qadam: number) => void
  /** «Koʻrsatish» — tanlangan oraliq (mezon 3). */
  davrniQoy: (davr: Davr) => void
  /** «Oyga qaytish» — davr tanlashdan oldingi oy qaytadi. */
  oygaQaytar: () => void
  /** Kurs blokidagi «Saqlash» — qoʻlda soʻralgan kurs (0043; mezon 21). */
  kursniSaqla: (kurs: number) => Promise<void> | void
}

export function Hisobot({
  hisobot,
  kategoriyalar,
  oy,
  joriyOy,
  oyniSur,
  davrniQoy,
  oygaQaytar,
  kursniSaqla,
}: HisobotProps) {
  const [davrOchiq, setDavrOchiq] = useState(false)
  const [boshlanish, setBoshlanish] = useState('')
  const [tugash, setTugash] = useState('')
  const [davrXatosi, setDavrXatosi] = useState('')

  // Davr bloki ochilganda maydonlar joriy davr bilan toʻldiriladi (dizayn 2-boʻlim).
  useEffect(() => {
    if (davrOchiq && hisobot !== null) {
      setBoshlanish(hisobot.davr.boshlanish)
      setTugash(hisobot.davr.tugash)
      setDavrXatosi('')
    }
  }, [davrOchiq, hisobot])

  const asos = useId()
  const bugungi = bugun()
  const joriyYil = Number(bugungi.slice(0, 4))

  function kategoriyaNomi(id: string): string {
    return kategoriyalar.find((kategoriya) => kategoriya.id === id)?.nom ?? id
  }

  function davrniYop(): void {
    setDavrOchiq(false)
    setDavrXatosi('')
  }

  function korsatishniBosdi(): void {
    // Ikkala tekshiruv ham mavjud yoʻldan: kelajak sanasi `sananiTekshir` bilan (0034),
    // tartib esa `davrTogrimi` bilan (KELISHUV 18-boʻlim) — yangi xato kodi yoʻq.
    for (const sana of [boshlanish, tugash]) {
      const tekshirilgan = sananiTekshir(sana)
      if (!tekshirilgan.ok) {
        const birinchi = tekshirilgan.xatolar[0]
        setDavrXatosi(
          birinchi === undefined ? '' : xatoMatni(birinchi.kod, birinchi.xabar),
        )
        return
      }
    }
    const davr: Davr = { boshlanish, tugash }
    if (!davrTogrimi(davr)) {
      setDavrXatosi(HISOBOT.davrTartibi)
      return
    }
    setDavrOchiq(false)
    setDavrXatosi('')
    davrniQoy(davr)
  }

  // Kurs soʻrash bloki endi umumiy komponent (`KursSorov.tsx`): bosh sahifa bilan
  // bitta qoida, bitta kod (0043; spec 001-dashboard FR-007).
  const kursBloki = <KursSorov saqla={kursniSaqla} />

  // Kurs bloki bir marta chiziladi — birinchi muhtoj boʻlakda (dizayn 3-boʻlim).
  const kursKerakBolagi: BolakTuri | null =
    hisobot === null
      ? null
      : hisobot.kirim.taxminiy.holat === 'kurs-kerak'
        ? 'kirim'
        : hisobot.chiqim.taxminiy.holat === 'kurs-kerak'
          ? 'chiqim'
          : hisobot.farq.taxminiy.holat === 'kurs-kerak'
            ? 'farq'
            : null

  return (
    <div
      className="ekran"
      onClick={() => {
        // «Blokdan tashqariga tegish» — davr bloki yopiladi, tanlangani unutiladi.
        if (davrOchiq) {
          davrniYop()
        }
      }}
    >
      <header className="panel-tepa">
        <h1 className="sarlavha">{HISOBOT.sarlavha}</h1>
      </header>

      <div className="davr-qatori">
        {oy === null ? (
          <>
            <span className="davr-matni">
              {hisobot === null ? '' : davrMatni(hisobot.davr, bugungi)}
            </span>
            <button type="button" className="matn-havola davr-havola" onClick={oygaQaytar}>
              {HISOBOT.oygaQaytish}
            </button>
          </>
        ) : (
          <>
            <div className="oy-tanlagich">
              <button
                type="button"
                className="belgi-tugma"
                aria-label={HISOBOT.oldingiOy}
                onClick={() => {
                  oyniSur(-1)
                }}
              >
                ‹
              </button>
              <span className="oy-nomi">{oyMatni(oy, joriyYil)}</span>
              <button
                type="button"
                className="belgi-tugma"
                aria-label={HISOBOT.keyingiOy}
                // Kelajak oyi tanlanmaydi: kelajak sanali yozuv umuman yoʻq (0034).
                disabled={oy.yil === joriyOy.yil && oy.oy === joriyOy.oy}
                onClick={() => {
                  oyniSur(1)
                }}
              >
                ›
              </button>
            </div>
            <button
              type="button"
              className="matn-havola davr-havola"
              onClick={(hodisa) => {
                hodisa.stopPropagation()
                setDavrOchiq(true)
              }}
            >
              {HISOBOT.davrTanlash}
            </button>
          </>
        )}
      </div>

      {davrOchiq ? (
        <div
          className="davr-bloki"
          onClick={(hodisa) => {
            hodisa.stopPropagation()
          }}
        >
          {/*
            Koʻrinadigan qismi — tugma, ichida daftar formatidagi sana (`1-avgust`);
            ustida qurilmaning oʻz tanlagichi shaffof turadi (`design/uslub.md`).
            «Bugun»/«Kecha» soʻzlari qoʻyilmaydi: davr chekkalari solishtiriladigan
            boʻlishi kerak (dizayn 2-boʻlim).
          */}
          <div className="davr-maydon">
            <span className="yorliq" id={`${asos}-boshlanish`}>
              {HISOBOT.sanadan}
            </span>
            <span className="sana-tanlagich">
              <span className="sana-matni" aria-hidden="true">
                {boshlanish === '' ? '' : sanaMatni(boshlanish, bugungi)}
              </span>
              <input
                className="sana-kirit"
                type="date"
                aria-labelledby={`${asos}-boshlanish`}
                value={boshlanish}
                max={bugungi}
                onChange={(hodisa) => {
                  setBoshlanish(hodisa.target.value)
                  setDavrXatosi('')
                }}
              />
            </span>
          </div>
          <div className="davr-maydon">
            <span className="yorliq" id={`${asos}-tugash`}>
              {HISOBOT.sanagacha}
            </span>
            <span className="sana-tanlagich">
              <span className="sana-matni" aria-hidden="true">
                {tugash === '' ? '' : sanaMatni(tugash, bugungi)}
              </span>
              <input
                className="sana-kirit"
                type="date"
                aria-labelledby={`${asos}-tugash`}
                value={tugash}
                max={bugungi}
                onChange={(hodisa) => {
                  setTugash(hodisa.target.value)
                  setDavrXatosi('')
                }}
              />
            </span>
          </div>
          {davrXatosi === '' ? null : <p className="xato-matni">{davrXatosi}</p>}
          <div className="davr-tugmalar">
            <button
              type="button"
              className="belgi-tugma"
              aria-label={HISOBOT.yopish}
              onClick={davrniYop}
            >
              ×
            </button>
            <button
              type="button"
              className="asosiy-tugma qoshish-tugma"
              onClick={korsatishniBosdi}
            >
              {HISOBOT.korsatish}
            </button>
          </div>
        </div>
      ) : null}

      {hisobot === null ? null : (
        <div className="hisobot-tanasi">
          <div className="kartochka jami-kartochka">
            <JamiBolak
              turi="kirim"
              bolak={hisobot.kirim}
              kursBloki={kursKerakBolagi === 'kirim' ? kursBloki : null}
            />
            <JamiBolak
              turi="chiqim"
              bolak={hisobot.chiqim}
              kursBloki={kursKerakBolagi === 'chiqim' ? kursBloki : null}
            />
            <JamiBolak
              turi="farq"
              bolak={hisobot.farq}
              kursBloki={kursKerakBolagi === 'farq' ? kursBloki : null}
            />
          </div>

          {hisobot.davrdaYozuvBormi || hisobot.davrdaQarzHarakatiBormi ? null : (
            <div className="hisobot-yol">
              {hisobot.daftardaYozuvBormi ? (
                <p className="bosh-ikkinchi">{HISOBOT.boshqaDavr}</p>
              ) : (
                <>
                  <p className="bosh-birinchi">{HISOBOT.boshBirinchi}</p>
                  <p className="bosh-ikkinchi">{HISOBOT.boshIkkinchi}</p>
                </>
              )}
            </div>
          )}

          <Ajratma
            turi="chiqim"
            sarlavha={HISOBOT.chiqimAjratmasi}
            sarlavhaId={`${asos}-chiqim`}
            qatorlar={hisobot.chiqimAjratmasi}
            boshMatn={HISOBOT.chiqimYoq}
            nomTop={kategoriyaNomi}
          />
          <Ajratma
            turi="kirim"
            sarlavha={HISOBOT.kirimAjratmasi}
            sarlavhaId={`${asos}-kirim`}
            qatorlar={hisobot.kirimAjratmasi}
            boshMatn={HISOBOT.kirimYoq}
            nomTop={kategoriyaNomi}
          />
          <QarzBloki qatorlar={hisobot.qarz} sarlavhaId={`${asos}-qarz`} />
        </div>
      )}
    </div>
  )
}
