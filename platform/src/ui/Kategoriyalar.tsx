// «Kategoriyalar» (boshqaruv) ekrani.
//
// Tavsif: `design/kirim-chiqim.md` (3-boʻlim). Kirish yoʻli bitta — «Yangi yozuv»
// formasidagi «Boshqarish» havolasi.
//
// Kategoriya OʻCHIRILMAYDI, faqat yashiriladi (0013): yashirilgani roʻyxat ostidagi
// «Yashirilgan» boʻlimida turadi va «Koʻrsatish» bilan qaytadi.
//
// Nom bandligini ekran oʻzi tekshirmaydi — doʻkon tekshiradi va `Natija` ichida kod
// qaytaradi (KELISHUV 10-boʻlim). Ekran faqat kodga mos matnni qoʻyadi, shu bilan
// solishtirish qoidasi (boʻshliq, katta-kichik harf) bitta joyda qoladi.

import { useEffect, useRef, useState } from 'react'
import type { Kategoriya, Natija, Xato, YozuvTuri } from '../domain/turlar.ts'
import { Ikonka, TugmaMatni } from './Ikonka.tsx'
import { FORMA, KATEGORIYALAR, xatoMatni } from './matnlar.ts'

export type KategoriyalarProps = {
  /** `hammaKategoriyalar()` — yashirilgani ham; ekran oʻzi ajratadi. */
  kategoriyalar: readonly Kategoriya[]
  /** Ekran ochilganda qaysi tur ochiq turadi: formada tanlangani, tanlanmagan boʻlsa «Chiqim». */
  boshlangichTur: YozuvTuri
  /** `kategoriyaQosh` — xato boʻlsa `Natija` ichida kod bilan qaytadi (mezon 13, 14a). */
  qosh: (nom: string, turi: YozuvTuri) => Promise<Natija<Kategoriya>>
  /** `kategoriyaniYashir` — tasdiq soʻralmaydi, «qaytarish» paneli chiqmaydi (0013). */
  yashir: (id: string) => Promise<void> | void
  /** `kategoriyaniKorsat` — yashirilganini roʻyxatga qaytaradi. */
  korsat: (id: string) => Promise<void> | void
  /** «‹ Orqaga» — formaga qaytadi, forma toʻldirilgan holicha turadi. */
  orqaga?: (() => void) | undefined
}

export function Kategoriyalar({
  kategoriyalar,
  boshlangichTur,
  qosh,
  yashir,
  korsat,
  orqaga,
}: KategoriyalarProps) {
  const [turi, setTuri] = useState<YozuvTuri>(boshlangichTur)
  const [qoshishOchiq, setQoshishOchiq] = useState(false)
  const [nom, setNom] = useState('')
  const [xato, setXato] = useState<Xato | null>(null)
  const nomRef = useRef<HTMLInputElement>(null)

  // Qator ochilganda fokus nom maydoniga tushadi va klaviatura ochiladi (dizayn).
  useEffect(() => {
    if (qoshishOchiq) {
      nomRef.current?.focus()
    }
  }, [qoshishOchiq])

  const shuTur = kategoriyalar.filter((kategoriya) => kategoriya.turi === turi)
  const korinadiganlar = shuTur.filter((kategoriya) => !kategoriya.yashirilgan)
  const yashirilganlar = shuTur.filter((kategoriya) => kategoriya.yashirilgan)

  function qoshishniYop(): void {
    setQoshishOchiq(false)
    setNom('')
    setXato(null)
  }

  function turniTanla(yangi: YozuvTuri): void {
    setTuri(yangi)
    // Bandlik tekshiruvi tur ichida ishlaydi — tur almashsa eski sabab eskiradi.
    setXato(null)
  }

  async function qoshishniBosdi(): Promise<void> {
    const natija = await qosh(nom, turi)
    if (!natija.ok) {
      setXato(natija.xatolar[0] ?? null)
      return
    }
    qoshishniYop()
  }

  return (
    <div
      className="ekran"
      onClick={() => {
        // «Tashqariga tegish» — kiritish qatori yopiladi, terilgani unutiladi (dizayn).
        if (qoshishOchiq) {
          qoshishniYop()
        }
      }}
    >
      <header className="panel-tepa">
        <button type="button" className="matn-havola" onClick={orqaga}>
          <TugmaMatni matn={KATEGORIYALAR.orqaga} />
        </button>
        <h1 className="sarlavha">{KATEGORIYALAR.sarlavha}</h1>
      </header>

      <div className="kategoriya-tanasi">
        <div className="segment" role="group" aria-label="Tur">
          <button
            type="button"
            className={turi === 'chiqim' ? 'segment-bolak tanlangan-chiqim' : 'segment-bolak'}
            aria-pressed={turi === 'chiqim'}
            onClick={() => {
              turniTanla('chiqim')
            }}
          >
            {FORMA.chiqim}
          </button>
          <button
            type="button"
            className={turi === 'kirim' ? 'segment-bolak tanlangan-kirim' : 'segment-bolak'}
            aria-pressed={turi === 'kirim'}
            onClick={() => {
              turniTanla('kirim')
            }}
          >
            {FORMA.kirim}
          </button>
        </div>

        {qoshishOchiq ? (
          <div
            className="qoshish-qatori"
            onClick={(hodisa) => {
              hodisa.stopPropagation()
            }}
          >
            <div className="qoshish-boshi">
              <button
                type="button"
                className="belgi-tugma"
                aria-label={KATEGORIYALAR.yopish}
                onClick={qoshishniYop}
              >
                <Ikonka nom="x" olcham={20} />
              </button>
              <input
                ref={nomRef}
                className={xato === null ? 'maydon' : 'maydon xatoli'}
                type="text"
                autoComplete="off"
                aria-label={KATEGORIYALAR.nom}
                aria-invalid={xato !== null}
                placeholder={KATEGORIYALAR.nom}
                value={nom}
                onChange={(hodisa) => {
                  setNom(hodisa.target.value)
                  setXato(null)
                }}
              />
              <button
                type="button"
                className="ikkinchi-tugma"
                onClick={() => {
                  void qoshishniBosdi()
                }}
              >
                {KATEGORIYALAR.qoshish}
              </button>
            </div>
            {xato === null ? null : (
              <p className="xato-matni">{xatoMatni(xato.kod, xato.xabar)}</p>
            )}
          </div>
        ) : null}

        {korinadiganlar.length === 0 ? (
          <div className="kategoriya-bosh">
            <p className="bosh-birinchi">{KATEGORIYALAR.boshBirinchi}</p>
            <p className="bosh-ikkinchi">{KATEGORIYALAR.boshIkkinchi}</p>
          </div>
        ) : (
          <ul className="kategoriya-royxati">
            {korinadiganlar.map((kategoriya) => (
              <li className="kategoriya-qatori" key={kategoriya.id}>
                <span className="kategoriya-nomi">{kategoriya.nom}</span>
                <button
                  type="button"
                  className="matn-havola"
                  onClick={() => {
                    void yashir(kategoriya.id)
                  }}
                >
                  {KATEGORIYALAR.yashirish}
                </button>
              </li>
            ))}
          </ul>
        )}

        {yashirilganlar.length === 0 ? null : (
          <>
            <h2 className="yashirilgan-sarlavhasi">{KATEGORIYALAR.yashirilganlar}</h2>
            <ul className="kategoriya-royxati">
              {yashirilganlar.map((kategoriya) => (
                <li className="kategoriya-qatori" key={kategoriya.id}>
                  <span className="kategoriya-nomi ochiq-rang">{kategoriya.nom}</span>
                  <button
                    type="button"
                    className="matn-havola"
                    onClick={() => {
                      void korsat(kategoriya.id)
                    }}
                  >
                    {KATEGORIYALAR.korsatish}
                  </button>
                </li>
              ))}
            </ul>
          </>
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
          <TugmaMatni matn={KATEGORIYALAR.yangi} />
        </button>
      </div>
    </div>
  )
}
