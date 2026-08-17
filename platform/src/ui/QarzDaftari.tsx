// «Qarz daftari» — kontaktlar roʻyxati ekrani.
//
// Tavsif: `design/qarz-daftari.md` (1-boʻlim). Rang, oʻlcham va boʻshliq: `design/uslub.md`.
// Kirish yoʻli: pastdagi **vaqtinchalik** navigatsiya panelining «Qarz daftari» boʻlagi
// (0063) — shuning uchun yuqorida «‹ Orqaga» yoʻq.
//
// Qidiruv, filtr va saralash qurilmaydi (0002); roʻyxat doʻkondan alifbo tartibida keladi
// va ekran uni qayta saralamaydi (KELISHUV 14-boʻlim).
//
// Kontakt roʻyxat qatoridan **oʻchirilmaydi** (dizayn): oʻchirish shartli (0030) va rad
// javobi qarzlar koʻrinib turgan kontakt sahifasida tushunarli boʻladi. Bu ekranda faqat
// oʻchirilgandan keyingi «qaytarish» paneli koʻrinadi.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type {
  Kontakt,
  KontaktFormasi,
  KontaktHolati,
  Natija,
  NettoQatori,
  OchirilganKontakt,
  Xato,
} from '../domain/turlar.ts'
import { nettoMatni, nettoSinfi, nettoSozi } from './format.ts'
import { QARZ_DAFTARI, xatoMatni } from './matnlar.ts'
import { QAYTARISH_MUDDATI, QaytarishPaneli } from './QaytarishPaneli.tsx'

export type QarzDaftariProps = {
  /** `kontaktHolatlari()` — alifbo tartibida, har biri oʻz nettosi bilan. */
  kontaktlar: readonly KontaktHolati[]
  /**
   * Hozirgina oʻchirilgan kontakt — «qaytarish» paneli shundan chiziladi (0030; mezon 18).
   * Oʻchirish kontakt sahifasida bajariladi, panel esa dizayn boʻyicha **bu** ekranda
   * koʻrinadi, chunki odam shu yerga qaytariladi.
   */
  ochirilganKontakt?: OchirilganKontakt | null | undefined
  /** Kontakt qatori bosilganda — oʻsha kontakt sahifasi. */
  och: (kontaktId: string) => void
  /** «Qoʻshish» — `kontaktSaqla`; xato boʻlsa `Natija` ichida kod bilan qaytadi (mezon 2). */
  qosh: (forma: KontaktFormasi) => Promise<Natija<Kontakt>>
  /** «QAYTARISH» — `kontaktniQaytar`; kontakt ham, qarz tarixi ham qaytadi (mezon 18). */
  qaytar?: ((ochirilgan: OchirilganKontakt) => Promise<void> | void) | undefined
  /** Panel yopilganda (qaytarildi yoki 7 soniya tugadi) — oʻchirish yakuniy boʻladi. */
  unut?: (() => void) | undefined
}

/** Netto qatorlari — har ochiq valyuta uchun bittadan (0037, 0056; dizayn 0-boʻlim). */
function NettoQatorlari({ netto }: { netto: readonly NettoQatori[] }) {
  if (netto.length === 0) {
    return null
  }
  return (
    <span className="netto-qatorlar">
      {netto.map((qator) => (
        <span className="netto-qator" key={qator.valyuta}>
          <span className="netto-sozi">{nettoSozi(qator.netto)}</span>
          <span className={`netto-summa ${nettoSinfi(qator.netto)}`}>
            {nettoMatni(qator.netto, qator.valyuta)}
          </span>
        </span>
      ))}
    </span>
  )
}

export function QarzDaftari({
  kontaktlar,
  ochirilganKontakt,
  och,
  qosh,
  qaytar,
  unut,
}: QarzDaftariProps) {
  const [qoshishOchiq, setQoshishOchiq] = useState(false)
  const [ism, setIsm] = useState('')
  const [telefon, setTelefon] = useState('')
  const [xato, setXato] = useState<Xato | null>(null)
  // Yangi kontakt alifbodagi oʻz oʻrniga tushadi — ekran oʻsha qatorga suriladi (dizayn).
  const [yangiId, setYangiId] = useState<string | null>(null)
  const ismRef = useRef<HTMLInputElement>(null)
  const royxatRef = useRef<HTMLUListElement>(null)

  // Blok ochilganda fokus «Ism» maydoniga tushadi va klaviatura ochiladi (dizayn).
  useEffect(() => {
    if (qoshishOchiq) {
      ismRef.current?.focus()
    }
  }, [qoshishOchiq])

  useLayoutEffect(() => {
    if (yangiId === null) {
      return
    }
    setYangiId(null)
    const qator = royxatRef.current?.querySelector(`[data-kontakt="${yangiId}"]`)
    // jsdom da `scrollIntoView` yoʻq — mavjudligi tekshiriladi.
    if (qator instanceof HTMLElement && typeof qator.scrollIntoView === 'function') {
      qator.scrollIntoView({ block: 'center' })
    }
  }, [yangiId])

  /**
   * Muddat panel koʻringan lahzadan boshlanadi va toʻxtatib turilmaydi (0048).
   * Tugagach `unut` chaqiriladi: oʻchirilgan nusxa tashlanadi va oʻchirish yakuniy boʻladi.
   */
  useEffect(() => {
    if (ochirilganKontakt === null || ochirilganKontakt === undefined) {
      return
    }
    const hisob = setTimeout(() => {
      unut?.()
    }, QAYTARISH_MUDDATI)
    return () => {
      clearTimeout(hisob)
    }
  }, [ochirilganKontakt, unut])

  function qoshishniYop(): void {
    setQoshishOchiq(false)
    setIsm('')
    setTelefon('')
    setXato(null)
  }

  async function qoshishniBosdi(): Promise<void> {
    const natija = await qosh({ ism, telefon })
    if (!natija.ok) {
      setXato(natija.xatolar[0] ?? null)
      return
    }
    setYangiId(natija.qiymat.id)
    qoshishniYop()
  }

  async function qaytarishniBosdi(): Promise<void> {
    if (ochirilganKontakt === null || ochirilganKontakt === undefined) {
      return
    }
    await qaytar?.(ochirilganKontakt)
    unut?.()
  }

  return (
    <div
      className="ekran"
      onClick={() => {
        // «Blokdan tashqariga tegish» — blok yopiladi, terilgani unutiladi (dizayn).
        if (qoshishOchiq) {
          qoshishniYop()
        }
      }}
    >
      <header className="panel-tepa">
        <h1 className="sarlavha">{QARZ_DAFTARI.sarlavha}</h1>
      </header>

      <div className="qarz-tanasi">
        {qoshishOchiq ? (
          <div
            className="qoshish-qatori kontakt-bloki"
            onClick={(hodisa) => {
              hodisa.stopPropagation()
            }}
          >
            <div className="qoshish-boshi">
              <button
                type="button"
                className="belgi-tugma"
                aria-label={QARZ_DAFTARI.yopish}
                onClick={qoshishniYop}
              >
                ×
              </button>
              <div className="kontakt-maydonlar">
                <input
                  ref={ismRef}
                  className={xato === null ? 'maydon' : 'maydon xatoli'}
                  type="text"
                  autoComplete="off"
                  aria-label={QARZ_DAFTARI.ism}
                  aria-invalid={xato !== null}
                  placeholder={QARZ_DAFTARI.ism}
                  value={ism}
                  onChange={(hodisa) => {
                    setIsm(hodisa.target.value)
                    setXato(null)
                  }}
                />
                <input
                  className="maydon"
                  type="text"
                  autoComplete="off"
                  aria-label={QARZ_DAFTARI.telefon}
                  placeholder={QARZ_DAFTARI.telefon}
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
                  void qoshishniBosdi()
                }}
              >
                {QARZ_DAFTARI.qoshish}
              </button>
            </div>
            {xato === null ? null : (
              <p className="xato-matni">{xatoMatni(xato.kod, xato.xabar)}</p>
            )}
          </div>
        ) : null}

        {kontaktlar.length === 0 ? (
          <div className="bosh-holat">
            <p className="bosh-birinchi">{QARZ_DAFTARI.boshBirinchi}</p>
            <p className="bosh-ikkinchi">{QARZ_DAFTARI.boshIkkinchi}</p>
          </div>
        ) : (
          <ul className="qatorlar" ref={royxatRef}>
            {kontaktlar.map((holat) => (
              <li key={holat.kontakt.id} data-kontakt={holat.kontakt.id}>
                <button
                  type="button"
                  className="kontakt-qator"
                  onClick={() => {
                    och(holat.kontakt.id)
                  }}
                >
                  <span className="qator-chap">
                    <span className="qator-ism">{holat.kontakt.ism}</span>
                    {holat.kontakt.telefon === undefined ? null : (
                      <span className="qator-telefon">{holat.kontakt.telefon}</span>
                    )}
                  </span>
                  <NettoQatorlari netto={holat.netto} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel-past panel-past-yon">
        <button
          type="button"
          className="asosiy-tugma"
          onClick={(hodisa) => {
            hodisa.stopPropagation()
            setQoshishOchiq(true)
            setXato(null)
          }}
        >
          {QARZ_DAFTARI.yangiKontakt}
        </button>
      </div>

      {ochirilganKontakt === null || ochirilganKontakt === undefined ? null : (
        <QaytarishPaneli
          matn={QARZ_DAFTARI.ochirildi}
          qaytar={() => {
            void qaytarishniBosdi()
          }}
        />
      )}
    </div>
  )
}
