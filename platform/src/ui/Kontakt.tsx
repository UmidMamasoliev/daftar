// Kontakt sahifasi — qarzlari, toʻlovlari va nettosi bilan.
//
// Tavsif: `design/qarz-daftari.md` (2-boʻlim). Rang, oʻlcham va boʻshliq: `design/uslub.md`.
// Shartnoma: `platform/KELISHUV.md` 12–15-boʻlimlar.
//
// Ekranning oʻz ishi uchta:
// 1. `KontaktHolati` ni dizayndagi tartibda chizish (netto → ochiq qarzlar → «Yopilgan
//    qarzlar» → «Kontaktni oʻchirish»);
// 2. bitta ochiq «Oʻchirish» tugmasini butun ekran boʻyicha ushlab turish (dizayn:
//    `design/kirim-chiqim.md` 2-boʻlimdagi qoidalarning aynan oʻzi);
// 3. «qaytarish» panelini **7 soniya** ushlab turish (0029, 0048) — qarz uchun ham,
//    toʻlov uchun ham bitta panel.
//
// Yopiqlik, qoldiq va netto bu yerda hisoblanmaydi: hammasi doʻkondan `KontaktHolati`
// boʻlib keladi (0016, 0037, 0052, 0056).
//
// Kartochka va toʻlov qatori **modul darajasidagi** komponentlar: `Kontakt` ichida
// eʼlon qilinsa har holat oʻzgarishida yangi komponent turi paydo boʻlardi va React
// butun roʻyxatni qayta yaratardi — kursor qator ustiga kelishi bilan tugma DOM dan
// chiqib ketib, bosish yoʻqolardi (shu xato testda ushlangan).

import { useEffect, useRef, useState } from 'react'
import { tolovQarzValyutasida } from '../domain/qarz.ts'
import { bugun } from '../domain/sana.ts'
import type {
  Kontakt as KontaktTuri,
  KontaktFormasi,
  KontaktHolati,
  Natija,
  NettoQatori,
  OchirilganKontakt,
  OchirilganQarz,
  Qarz,
  QarzHolati,
  Tolov,
  Valyuta,
  Xato,
} from '../domain/turlar.ts'
import {
  hisobNomi,
  nettoMatni,
  nettoSinfi,
  nettoSozi,
  pulMatni,
  qarzQoldigiMatni,
  qarzQoldigiSinfi,
  sanaYorligi,
  tolovMatni,
  tolovTafsiloti,
} from './format.ts'
import { KONTAKT, qarzTafsiloti, xatoMatni } from './matnlar.ts'
import { QAYTARISH_MUDDATI, QaytarishPaneli } from './QaytarishPaneli.tsx'

/** Qatorni chapga surish shu masofadan oshsa «Oʻchirish» ochiladi (telefon). */
const SURISH_CHEGARASI = 40

export type KontaktProps = {
  /** `kontaktHolatiniOl(id)` — kontakt, qarzlari holati va netto qatorlari. */
  holat: KontaktHolati
  /** «‹ Orqaga» — «Qarz daftari» roʻyxatiga. */
  orqaga: () => void
  /** «Saqlash» (tahrirlash bloki) — `kontaktniTahrirla` (0060; mezon 23–25). */
  tahrirla: (forma: KontaktFormasi) => Promise<Natija<KontaktTuri>>
  /** «＋ Yangi qarz». */
  yangiQarz: () => void
  /** «＋ Toʻlov» — faqat ochiq qarzda boʻladi (0061; mezon 42). */
  yangiTolov: (qarz: Qarz) => void
  /** Kartochka boshi bosilganda — «Qarzni tahrirlash» formasi (0059). */
  qarzniTahrirla: (qarz: Qarz) => void
  /** «Oʻchirish» (qarz) — `qarzniOchir`; toʻlovlari bilan birga ketadi (0059; mezon 34). */
  qarzniOchir: (qarz: Qarz) => Promise<OchirilganQarz>
  /** «QAYTARISH» — `qarzniQaytar`; qarz ham, toʻlovlari ham qaytadi (mezon 35). */
  qarzniQaytar: (ochirilgan: OchirilganQarz) => Promise<void> | void
  /** «Oʻchirish» (toʻlov) — `tolovniOchir` (mezon 8). */
  tolovniOchir: (tolov: Tolov) => Promise<void> | void
  /** «QAYTARISH» — `tolovniQaytar` (mezon 9). */
  tolovniQaytar: (tolov: Tolov) => Promise<void> | void
  /** «Kontaktni oʻchirish» — `kontaktniOchir`; ochiq qarzda sabab qaytadi (0030; mezon 16). */
  kontaktniOchir: () => Promise<Natija<OchirilganKontakt>>
}

/** Panelda turgan oʻchirilgan narsa — bir vaqtda faqat bittasi (dizayn 5-boʻlim). */
type Panel = { turi: 'qarz'; qiymat: OchirilganQarz } | { turi: 'tolov'; qiymat: Tolov }

/** Ochilgan «Oʻchirish» tugmasini butun ekran boʻyicha bitta qilib ushlab turadi. */
type QatorBoshqaruvi = {
  ochiqQator: string | null
  ochiqniQoy: (kalit: string | null) => void
  surishBoshlandi: (x: number) => void
  surishTugadi: (kalit: string, x: number) => void
}

/** Netto bloki — har ochiq valyuta uchun bittadan (0037, 0056; dizayn 2-boʻlim). */
function NettoBloki({ netto }: { netto: readonly NettoQatori[] }) {
  return (
    <div className="netto-bloklar">
      {netto.map((qator) => (
        <div className="netto-blok" key={qator.valyuta}>
          <span className="netto-sozi">{nettoSozi(qator.netto)}</span>
          <span className={`netto-katta ${nettoSinfi(qator.netto)}`}>
            {nettoMatni(qator.netto, qator.valyuta)}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Toʻlov qatori (dizayn 0-boʻlim).
 *
 * Oʻngdagi summa **qarz valyutasida ayirilgani**: boshqa valyutadagi toʻlov oʻz kursida
 * aylantiriladi (0023, 0042), kiritilgan summa va kurs esa ikkinchi qatorda turadi.
 * Rang qoʻyilmaydi: `−` bu yerda «qoldiqdan ayirildi» degani, pul chiqimi degani emas.
 *
 * Qator bosilgani hech narsa qilmaydi — toʻlov tahrirlanmaydi (spec 9-band).
 */
function TolovQatori({
  tolov,
  qarzValyutasi,
  bugungi,
  boshqaruv,
  ochir,
}: {
  tolov: Tolov
  qarzValyutasi: Valyuta
  bugungi: string
  boshqaruv: QatorBoshqaruvi
  ochir: (tolov: Tolov) => void
}) {
  const kalit = `tolov:${tolov.id}`
  const ochiq = boshqaruv.ochiqQator === kalit
  return (
    <li
      className={ochiq ? 'tolov-qator ochiq' : 'tolov-qator'}
      onClick={(hodisa) => {
        if (ochiq) {
          hodisa.stopPropagation()
        }
      }}
      onMouseEnter={() => {
        boshqaruv.ochiqniQoy(kalit)
      }}
      onTouchStart={(hodisa) => {
        boshqaruv.surishBoshlandi(hodisa.touches[0]?.clientX ?? 0)
      }}
      onTouchEnd={(hodisa) => {
        boshqaruv.surishTugadi(kalit, hodisa.changedTouches[0]?.clientX ?? 0)
      }}
    >
      <span className="qator-chap">
        <span className="tolov-sana">{sanaYorligi(tolov.sana, bugungi)}</span>
        <span className="tolov-tafsilot">{tolovTafsiloti(tolov, qarzValyutasi)}</span>
      </span>
      <span className="tolov-summa">
        {tolovMatni(tolovQarzValyutasida(tolov, qarzValyutasi), qarzValyutasi)}
      </span>
      {ochiq ? (
        <button
          type="button"
          className="ochirish-tugma"
          onClick={() => {
            ochir(tolov)
          }}
        >
          {KONTAKT.ochirish}
        </button>
      ) : null}
    </li>
  )
}

/**
 * Qarz kartochkasi (dizayn 0-boʻlim).
 *
 * «Kartochka boshi» — 1- va 2-qator birga: bosilsa tahrirlash, surilsa yoki kursor
 * ustiga kelsa «Oʻchirish». Toʻlov qatorlari va «＋ Toʻlov» havolasi kartochka boshiga
 * kirmaydi — ular oʻz harakatlarini saqlaydi (0059).
 */
function QarzKartochkasi({
  qarzHolati,
  bugungi,
  boshqaruv,
  tahrirla,
  ochir,
  tolovQosh,
  tolovOchir,
}: {
  qarzHolati: QarzHolati
  bugungi: string
  boshqaruv: QatorBoshqaruvi
  tahrirla: (qarz: Qarz) => void
  ochir: (qarz: Qarz) => void
  tolovQosh: (qarz: Qarz) => void
  tolovOchir: (tolov: Tolov) => void
}) {
  const { qarz, tolovlar, qoldiq, yopiq } = qarzHolati
  const kalit = `qarz:${qarz.id}`
  const ochiq = boshqaruv.ochiqQator === kalit
  return (
    <li className="qarz-kartochka">
      <div
        className={ochiq ? 'kartochka-boshi ochiq' : 'kartochka-boshi'}
        onClick={(hodisa) => {
          if (ochiq) {
            hodisa.stopPropagation()
          }
        }}
        onMouseEnter={() => {
          boshqaruv.ochiqniQoy(kalit)
        }}
        onTouchStart={(hodisa) => {
          boshqaruv.surishBoshlandi(hodisa.touches[0]?.clientX ?? 0)
        }}
        onTouchEnd={(hodisa) => {
          boshqaruv.surishTugadi(kalit, hodisa.changedTouches[0]?.clientX ?? 0)
        }}
      >
        <button
          type="button"
          className="kartochka-tugma"
          onClick={() => {
            tahrirla(qarz)
          }}
        >
          <span className="kartochka-birinchi">
            <span className="qarz-yonalish">
              {qarz.yonalishi === 'berdim' ? KONTAKT.berdim : KONTAKT.oldim}
            </span>
            {yopiq ? (
              // Mikro-qoldiq koʻrsatilmaydi: raqam oʻrnida soʻz turadi (0052, 0056).
              <span className="qarz-yopilgan">{KONTAKT.yopilgan}</span>
            ) : (
              <span className={`qarz-qoldiq ${qarzQoldigiSinfi(qarz.yonalishi)}`}>
                {qarzQoldigiMatni(qoldiq, qarz.valyuta, qarz.yonalishi)}
              </span>
            )}
          </span>
          <span className="kartochka-ikkinchi">
            {qarzTafsiloti(
              sanaYorligi(qarz.sana, bugungi),
              hisobNomi(qarz.hisob),
              pulMatni(qarz.summa, qarz.valyuta),
            )}
          </span>
        </button>
        {ochiq ? (
          <button
            type="button"
            className="ochirish-tugma"
            onClick={() => {
              ochir(qarz)
            }}
          >
            {KONTAKT.ochirish}
          </button>
        ) : null}
      </div>

      {tolovlar.length === 0 ? (
        <p className="tolov-yoq">{KONTAKT.tolovYoq}</p>
      ) : (
        <ul className="tolovlar">
          {tolovlar.map((tolov) => (
            <TolovQatori
              key={tolov.id}
              tolov={tolov}
              qarzValyutasi={qarz.valyuta}
              bugungi={bugungi}
              boshqaruv={boshqaruv}
              ochir={tolovOchir}
            />
          ))}
        </ul>
      )}

      {/* Yopilgan qarzga toʻlov qoʻshilmaydi — havolaning oʻzi boʻlmaydi (0061). */}
      {yopiq ? null : (
        <button
          type="button"
          className="matn-havola tolov-havola"
          onClick={() => {
            tolovQosh(qarz)
          }}
        >
          {KONTAKT.yangiTolov}
        </button>
      )}
    </li>
  )
}

export function Kontakt({
  holat,
  orqaga,
  tahrirla,
  yangiQarz,
  yangiTolov,
  qarzniTahrirla,
  qarzniOchir,
  qarzniQaytar,
  tolovniOchir,
  tolovniQaytar,
  kontaktniOchir,
}: KontaktProps) {
  // «Bitta» hisobi butun ekran boʻyicha: kalit `qarz:<id>` yoki `tolov:<id>` (dizayn).
  const [ochiqQator, setOchiqQator] = useState<string | null>(null)
  const [panel, setPanel] = useState<Panel | null>(null)
  const [tahrirOchiq, setTahrirOchiq] = useState(false)
  const [ism, setIsm] = useState(holat.kontakt.ism)
  const [telefon, setTelefon] = useState(holat.kontakt.telefon ?? '')
  const [tahrirXatosi, setTahrirXatosi] = useState<Xato | null>(null)
  const [ochirishXatosi, setOchirishXatosi] = useState<Xato | null>(null)
  const ismRef = useRef<HTMLInputElement>(null)
  const surishBoshi = useRef<number | null>(null)

  // Blok ochilganda fokus «Ism» maydoniga tushadi; matn tanlangan holatda emas — odam
  // koʻpincha soʻz qoʻshadi (dizayn: «Kontaktni tahrirlash»).
  useEffect(() => {
    if (tahrirOchiq) {
      const maydon = ismRef.current
      maydon?.focus()
      const oxiri = maydon?.value.length ?? 0
      maydon?.setSelectionRange(oxiri, oxiri)
    }
  }, [tahrirOchiq])

  /** Muddat panel koʻringan lahzadan boshlanadi va toʻxtatib turilmaydi (0048). */
  useEffect(() => {
    if (panel === null) {
      return
    }
    const hisob = setTimeout(() => {
      setPanel(null)
    }, QAYTARISH_MUDDATI)
    return () => {
      clearTimeout(hisob)
    }
  }, [panel])

  useEffect(() => {
    if (ochiqQator === null) {
      return
    }
    function tugmaBosildi(hodisa: KeyboardEvent): void {
      if (hodisa.key === 'Escape') {
        setOchiqQator(null)
      }
    }
    document.addEventListener('keydown', tugmaBosildi)
    return () => {
      document.removeEventListener('keydown', tugmaBosildi)
    }
  }, [ochiqQator])

  const bugungi = bugun()
  const ochiqlar = holat.qarzlar.filter((h) => !h.yopiq)
  const yopilganlar = holat.qarzlar.filter((h) => h.yopiq)
  const qarzYoq = holat.qarzlar.length === 0

  const boshqaruv: QatorBoshqaruvi = {
    ochiqQator,
    ochiqniQoy: setOchiqQator,
    surishBoshlandi(x) {
      surishBoshi.current = x
    },
    /** Chapga surish tugmani ochadi, oʻngga surish yopadi; surishning oʻzi oʻchirmaydi. */
    surishTugadi(kalit, x) {
      const boshi = surishBoshi.current
      surishBoshi.current = null
      if (boshi === null) {
        return
      }
      const farq = x - boshi
      if (farq <= -SURISH_CHEGARASI) {
        setOchiqQator(kalit)
      } else if (farq >= SURISH_CHEGARASI) {
        setOchiqQator(null)
      }
    },
  }

  function tahrirniYop(): void {
    setTahrirOchiq(false)
    setIsm(holat.kontakt.ism)
    setTelefon(holat.kontakt.telefon ?? '')
    setTahrirXatosi(null)
  }

  function tahrirniAlmashtir(): void {
    if (tahrirOchiq) {
      // Havola oʻzi ochgan blokni oʻzi yopadi; oʻzgartirilgani unutiladi (0060).
      tahrirniYop()
      return
    }
    setIsm(holat.kontakt.ism)
    setTelefon(holat.kontakt.telefon ?? '')
    setTahrirXatosi(null)
    setTahrirOchiq(true)
  }

  async function tahrirniSaqla(): Promise<void> {
    const natija = await tahrirla({ ism, telefon })
    if (!natija.ok) {
      setTahrirXatosi(natija.xatolar[0] ?? null)
      return
    }
    setTahrirOchiq(false)
    setTahrirXatosi(null)
  }

  async function qarzniOchirdi(qarz: Qarz): Promise<void> {
    setOchiqQator(null)
    const ochirilgan = await qarzniOchir(qarz)
    setPanel({ turi: 'qarz', qiymat: ochirilgan })
  }

  async function tolovniOchirdi(tolov: Tolov): Promise<void> {
    setOchiqQator(null)
    await tolovniOchir(tolov)
    setPanel({ turi: 'tolov', qiymat: tolov })
  }

  async function qaytarishniBosdi(): Promise<void> {
    if (panel === null) {
      return
    }
    const joriy = panel
    setPanel(null)
    if (joriy.turi === 'qarz') {
      await qarzniQaytar(joriy.qiymat)
    } else {
      await tolovniQaytar(joriy.qiymat)
    }
  }

  async function kontaktniOchirdi(): Promise<void> {
    const natija = await kontaktniOchir()
    // Rad javobi qarzlar koʻrinib turgan joyda aytiladi (0030): tugma oʻchiq qilinmaydi,
    // chunki oʻchiq tugma sababni aytmaydi.
    setOchirishXatosi(natija.ok ? null : (natija.xatolar[0] ?? null))
  }

  function kartochkalar(royxat: readonly QarzHolati[]) {
    return (
      <ul className="qarzlar">
        {royxat.map((qarzHolati) => (
          <QarzKartochkasi
            key={qarzHolati.qarz.id}
            qarzHolati={qarzHolati}
            bugungi={bugungi}
            boshqaruv={boshqaruv}
            tahrirla={qarzniTahrirla}
            ochir={(qarz) => {
              void qarzniOchirdi(qarz)
            }}
            tolovQosh={yangiTolov}
            tolovOchir={(tolov) => {
              void tolovniOchirdi(tolov)
            }}
          />
        ))}
      </ul>
    )
  }

  return (
    <div
      className="ekran"
      onClick={() => {
        // «Boshqa joyga tegish» — ochilgan «Oʻchirish» tugmasi yopiladi (dizayn) va
        // tahrirlash bloki ham yopiladi, oʻzgartirilgani unutiladi (0060).
        setOchiqQator(null)
        if (tahrirOchiq) {
          tahrirniYop()
        }
      }}
    >
      <header className="panel-tepa">
        <button type="button" className="matn-havola" onClick={orqaga}>
          {KONTAKT.orqaga}
        </button>
        <h1 className="sarlavha sarlavha-kesik">{holat.kontakt.ism}</h1>
        <button type="button" className="matn-havola panel-ong" onClick={tahrirniAlmashtir}>
          {KONTAKT.tahrirlash}
        </button>
      </header>

      <div className="kontakt-tanasi">
        {tahrirOchiq ? (
          <div
            className="qoshish-qatori kontakt-bloki"
            onClick={(hodisa) => {
              // Blok ichidagi bosish uni yopmaydi.
              hodisa.stopPropagation()
            }}
          >
            <div className="qoshish-boshi">
              <button
                type="button"
                className="belgi-tugma"
                aria-label={KONTAKT.yopish}
                onClick={tahrirniYop}
              >
                ×
              </button>
              <div className="kontakt-maydonlar">
                <input
                  ref={ismRef}
                  className={tahrirXatosi === null ? 'maydon' : 'maydon xatoli'}
                  type="text"
                  autoComplete="off"
                  aria-label={KONTAKT.ism}
                  aria-invalid={tahrirXatosi !== null}
                  placeholder={KONTAKT.ism}
                  value={ism}
                  onChange={(hodisa) => {
                    setIsm(hodisa.target.value)
                    setTahrirXatosi(null)
                  }}
                />
                <input
                  className="maydon"
                  type="text"
                  autoComplete="off"
                  aria-label={KONTAKT.telefon}
                  placeholder={KONTAKT.telefon}
                  value={telefon}
                  onChange={(hodisa) => {
                    setTelefon(hodisa.target.value)
                  }}
                />
              </div>
              <button
                type="button"
                className="asosiy-tugma qoshish-tugma"
                onClick={() => {
                  void tahrirniSaqla()
                }}
              >
                {KONTAKT.saqlash}
              </button>
            </div>
            {tahrirXatosi === null ? null : (
              <p className="xato-matni">{xatoMatni(tahrirXatosi.kod, tahrirXatosi.xabar)}</p>
            )}
          </div>
        ) : null}

        {holat.kontakt.telefon === undefined ? null : (
          <p className="kontakt-telefon">{holat.kontakt.telefon}</p>
        )}

        {qarzYoq ? (
          <div className="bosh-holat">
            <p className="bosh-birinchi">{KONTAKT.boshBirinchi}</p>
            <p className="bosh-ikkinchi">{KONTAKT.boshIkkinchi}</p>
          </div>
        ) : (
          <>
            {holat.netto.length === 0 ? (
              <p className="ochiq-qarz-yoq">{KONTAKT.ochiqQarzYoq}</p>
            ) : (
              <NettoBloki netto={holat.netto} />
            )}

            {ochiqlar.length === 0 ? null : kartochkalar(ochiqlar)}

            {yopilganlar.length === 0 ? null : (
              <>
                <h2 className="yashirilgan-sarlavhasi">{KONTAKT.yopilganQarzlar}</h2>
                {kartochkalar(yopilganlar)}
              </>
            )}
          </>
        )}

        <div className="kontakt-ochirish">
          <button
            type="button"
            className="xavfli-tugma"
            onClick={() => {
              void kontaktniOchirdi()
            }}
          >
            {KONTAKT.kontaktniOchirish}
          </button>
          {ochirishXatosi === null ? null : (
            <p className="xato-matni">{xatoMatni(ochirishXatosi.kod, ochirishXatosi.xabar)}</p>
          )}
        </div>
      </div>

      <div className="panel-past panel-past-yon">
        <button
          type="button"
          className="asosiy-tugma"
          onClick={(hodisa) => {
            hodisa.stopPropagation()
            yangiQarz()
          }}
        >
          {KONTAKT.yangiQarz}
        </button>
      </div>

      {panel === null ? null : (
        <QaytarishPaneli
          matn={panel.turi === 'qarz' ? KONTAKT.qarzOchirildi : KONTAKT.tolovOchirildi}
          qaytar={() => {
            void qaytarishniBosdi()
          }}
        />
      )}
    </div>
  )
}
