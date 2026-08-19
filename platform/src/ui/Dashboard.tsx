// Bosh sahifa (dashboard) — ilova ochilganda koʻrinadigan birinchi ekran.
//
// Spec: `specs/001-dashboard/spec.md` (prds/dashboard.md asosida). Rang, oʻlcham va
// boʻshliq: `design/uslub.md`. Qarorlar: 0006 (PIN yoʻq), 0020 (tarkib), 0023 (≈ jami),
// 0024 (eslatma), 0036 (naqd/karta), 0067 (navigatsiya, 5 yozuv, eslatma bosilmaydi).
//
// Ekran hech narsa hisoblamaydi va saqlamaydi: qoldiqlar, taxminiy jami, oy yigʻindilari
// va eslatma sharti App'dan tayyor keladi (0045 naqshi — har koʻrsatilishda joriy
// maʼlumotdan chiqadi). Ekranning oʻz ishi — dizayn qoidalari bilan chizish va uchta
// harakatni yuqoriga uzatish: «＋ Yozuv», «Hammasi ›», kurs saqlash.
//
// Qarz qoldigʻi bu yerda YOʻQ (PRD 28; mezon 11) — u oʻz boʻlimida. Oxirgi yozuvlar
// qatorlari BOSILMAYDI: tahrir yoʻli faqat «Yozuvlar» ekranida (PRD 15a; 0032).

import { useId } from 'react'
import type { TaxminiyJami, ValyutaQatori } from '../domain/hisobot.ts'
import { jamiQoldiq } from '../domain/qoldiq.ts'
import type { Qoldiqlar, Valyuta, ValyutaQoldigi, Yozuv } from '../domain/turlar.ts'
import { VALYUTALAR } from '../domain/turlar.ts'
import {
  hisobNomi,
  kursMatni,
  nettoMatni,
  nettoSinfi,
  pulMatni,
  qatorIzohi,
  summaKorinishi,
} from './format.ts'
import { KursSorov } from './KursSorov.tsx'
import { DASHBOARD, HISOBOT, taxminiyIzohi, taxminiyMatni } from './matnlar.ts'
import type { KategoriyaNomi } from './Yozuvlar.tsx'

/** Roʻyxatdagi yozuvlar soni — spec FR-009 (0067): eng koʻpi 5 ta, eng yangisi yuqorida. */
export const OXIRGI_YOZUVLAR_SONI = 5

export type DashboardProps = {
  /** `qoldiqlarniOl()` natijasi (yozuv + qarz taʼsiri bilan); `null` — hali oʻqilmagan. */
  qoldiqlar: Qoldiqlar | null
  /**
   * `xavfsizTaxminiyJami(jami, kurs)` natijasi; dollar umuman qatnashmasa App
   * `{ holat: 'yoq' }` beradi va ≈ qatori chizilmaydi (0023, KELISHUV 19-boʻlim).
   */
  taxminiy: TaxminiyJami
  /** `oyYigindilari(yozuvlar, joriyOyDavri())` — joriy kalendar oy (0018). */
  oy: { kirim: ValyutaQatori[]; chiqim: ValyutaQatori[] }
  /** `hammaYozuvlar('yangidan')` — kesimni ekran oʻzi oladi (FR-009). */
  yozuvlar: readonly Yozuv[]
  /** Kategoriya nomlari — yashirilgani ham (mezon 14 ruhi). */
  kategoriyalar: readonly KategoriyaNomi[]
  /** `zaxiraEslatmasiKerakmi(...)` natijasi (0024). */
  eslatmaKerak: boolean
  /** Eslatma matnining ikki varianti uchun: `null` — hech qachon eksport boʻlmagan. */
  oxirgiEksport: string | null
  /** «＋ Yozuv» — yangi yozuv formasi ochiladi (PRD 27; mezon 19). */
  yangiYozuv: () => void
  /** «Hammasi ›» — toʻliq yozuvlar ekrani (PRD 15a; mezon 20). */
  hammasi: () => void
  /** Kurs soʻrovi javobi (0043; mezon 14). */
  kursniSaqla: (kurs: number) => Promise<void> | void
}

/** Qoldiq — holat, kirim/chiqim emas: ishora faqat manfiyda, rang neytral (reja 3-band). */
function qoldiqMatni(summa: number, valyuta: Valyuta): string {
  return `${summa < 0 ? '−' : ''}${pulMatni(summa, valyuta)}`
}

/** Hisob qatorida chiziladigan valyutalar: soʻm har doim, dollar faqat nolmasa (mezon 12c). */
function hisobValyutalari(qoldiq: ValyutaQoldigi): Valyuta[] {
  return VALYUTALAR.filter((valyuta) => valyuta === 'som' || qoldiq[valyuta] !== 0)
}

export function Dashboard({
  qoldiqlar,
  taxminiy,
  oy,
  yozuvlar,
  kategoriyalar,
  eslatmaKerak,
  oxirgiEksport,
  yangiYozuv,
  hammasi,
  kursniSaqla,
}: DashboardProps) {
  const asos = useId()
  const jami = qoldiqlar === null ? null : jamiQoldiq(qoldiqlar)
  // Umumiy blokda dollar qatnashadimi: netto nol boʻlsa ham hisoblarda dollar boʻlishi
  // mumkin (naqdda +, kartada −) — qator baribir chiziladi, yoʻqolib qolmasin.
  const dollarBor =
    qoldiqlar !== null && (qoldiqlar.naqd.dollar !== 0 || qoldiqlar.karta.dollar !== 0)
  const oxirgilar = yozuvlar.slice(0, OXIRGI_YOZUVLAR_SONI)

  function kategoriyaNomi(id: string): string {
    return kategoriyalar.find((kategoriya) => kategoriya.id === id)?.nom ?? id
  }

  return (
    <div className="ekran">
      <header className="panel-tepa">
        <h1 className="sarlavha">{DASHBOARD.sarlavha}</h1>
      </header>

      <div className="dashboard-tanasi">
        {/* Zaxira eslatmasi — bir qatorlik, bosilmaydi (0024; spec Assumptions). */}
        {eslatmaKerak ? (
          <p className="zaxira-eslatma">
            {oxirgiEksport === null ? DASHBOARD.eslatmaHech : DASHBOARD.eslatmaEski}
          </p>
        ) : null}

        {/* ── Qoldiq (PRD 26, 26a; 0020, 0023, 0036) ── */}
        <section className="kartochka" aria-labelledby={`${asos}-qoldiq`}>
          <h2 className="kartochka-sarlavha" id={`${asos}-qoldiq`}>
            {DASHBOARD.qoldiq}
          </h2>
          {jami === null || qoldiqlar === null ? null : (
            <>
              <div className="qoldiq-jami">
                <p className="qoldiq-som">{qoldiqMatni(jami.som, 'som')}</p>
                {dollarBor ? (
                  <p className="qoldiq-dollar">{qoldiqMatni(jami.dollar, 'dollar')}</p>
                ) : null}
              </div>
              <ul className="ajratma">
                {(['naqd', 'karta'] as const).map((hisob) => (
                  <li className="ajratma-qator" key={hisob}>
                    <span className="ajratma-ichi">
                      <span className="ajratma-nomi">{hisobNomi(hisob)}</span>
                      <span className="hisob-summalar">
                        {hisobValyutalari(qoldiqlar[hisob]).map((valyuta) => (
                          <span className="hisob-summa" key={valyuta}>
                            {qoldiqMatni(qoldiqlar[hisob][valyuta], valyuta)}
                          </span>
                        ))}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              {/* «≈ jami soʻmda» — faqat taxminiy qator (0023); kursi izohda koʻrinadi. */}
              {taxminiy.holat === 'bor' ? (
                <>
                  <p className="taxminiy-jami">
                    {taxminiyMatni(qoldiqMatni(taxminiy.somda, 'som'))}
                  </p>
                  <p className="taxminiy-izoh">{taxminiyIzohi(kursMatni(taxminiy.kurs))}</p>
                </>
              ) : null}
              {taxminiy.holat === 'hisoblanmadi' ? (
                <p className="taxminiy-xato">{HISOBOT.hisoblanmadi}</p>
              ) : null}
              {taxminiy.holat === 'kurs-kerak' ? <KursSorov saqla={kursniSaqla} /> : null}
            </>
          )}
        </section>

        {/* ── Joriy oy (PRD 26; 0018, 0020) — qarz harakatisiz (0017) ── */}
        <section className="kartochka" aria-labelledby={`${asos}-oy`}>
          <h2 className="kartochka-sarlavha" id={`${asos}-oy`}>
            {DASHBOARD.joriyOy}
          </h2>
          <ul className="ajratma">
            <li className="ajratma-qator">
              <span className="ajratma-ichi">
                <span className="ajratma-nomi">{DASHBOARD.kirim}</span>
                <span className="hisob-summalar">
                  {oy.kirim.map((qator) => (
                    <span
                      className={`jami-summa ${nettoSinfi(qator.summa)}`}
                      key={qator.valyuta}
                    >
                      {nettoMatni(qator.summa, qator.valyuta)}
                    </span>
                  ))}
                </span>
              </span>
            </li>
            <li className="ajratma-qator">
              <span className="ajratma-ichi">
                <span className="ajratma-nomi">{DASHBOARD.chiqim}</span>
                <span className="hisob-summalar">
                  {oy.chiqim.map((qator) => (
                    <span
                      className={`jami-summa ${nettoSinfi(-qator.summa)}`}
                      key={qator.valyuta}
                    >
                      {nettoMatni(-qator.summa, qator.valyuta)}
                    </span>
                  ))}
                </span>
              </span>
            </li>
          </ul>
        </section>

        {/* ── Oxirgi yozuvlar (PRD 26; 0020, 0032) — qatorlar bosilmaydi ── */}
        <section className="kartochka" aria-labelledby={`${asos}-yozuvlar`}>
          <div className="royxat-boshi">
            <h2 className="kartochka-sarlavha" id={`${asos}-yozuvlar`}>
              {DASHBOARD.oxirgiYozuvlar}
            </h2>
            {oxirgilar.length === 0 ? null : (
              <button type="button" className="matn-havola" onClick={hammasi}>
                {DASHBOARD.hammasi}
              </button>
            )}
          </div>
          {oxirgilar.length === 0 ? (
            <div className="bosh-holat">
              <p className="bosh-birinchi">{DASHBOARD.boshBirinchi}</p>
              <p className="bosh-ikkinchi">{DASHBOARD.boshIkkinchi}</p>
            </div>
          ) : (
            <ul className="ajratma">
              {oxirgilar.map((yozuv) => (
                <li className="ajratma-qator" key={yozuv.id}>
                  <span className="ajratma-ichi dashboard-yozuv">
                    <span className="qator-chap">
                      <span className="qator-kategoriya">
                        {kategoriyaNomi(yozuv.kategoriyaId)}
                      </span>
                      <span className="qator-izoh">{qatorIzohi(yozuv.hisob, yozuv.izoh)}</span>
                    </span>
                    <span
                      className={
                        yozuv.turi === 'kirim' ? 'qator-summa kirim' : 'qator-summa chiqim'
                      }
                    >
                      {summaKorinishi(yozuv)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* «＋ Yozuv» — doim koʻrinib turadi (PRD 27; mezon 19), navigatsiya ustida. */}
      <div className="panel-past panel-past-yon">
        <button type="button" className="asosiy-tugma" onClick={yangiYozuv}>
          {DASHBOARD.yangiYozuv}
        </button>
      </div>
    </div>
  )
}
