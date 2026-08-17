// «Yozuvlar» ekrani — hamma yozuv kunlarga guruhlangan roʻyxat boʻlib turadi.
//
// Tavsif: `design/kirim-chiqim.md` (2-boʻlim). Rang, oʻlcham va boʻshliq: `design/uslub.md`.
// Qidiruv, filtr, saralash va oy tanlagichi qurilmaydi (0002, 0032); yozuv qoʻshish
// tugmasi ham bu yerda emas — u bosh sahifada.
//
// Doʻkon bu yerda chaqirilmaydi: yozuvlar va kategoriyalar props orqali keladi, oʻchirish
// va qaytarish esa chaqiruv boʻlib beriladi. Ekranning oʻz ishi — «qaytarish» panelini
// 7 soniya ushlab turish (0029, 0048).

import { useEffect, useRef, useState } from 'react'
import { bugun } from '../domain/sana.ts'
import type { Yozuv } from '../domain/turlar.ts'
import { qatorIzohi, sanaYorligi, summaKorinishi } from './format.ts'
import type { KategoriyaChipi } from './YozuvForma.tsx'
import { YOZUVLAR } from './matnlar.ts'

/** «QAYTARISH» tugmasi necha millisoniya turadi — 7 soniya, qatʼiy qiymat (0048). */
export const QAYTARISH_MUDDATI = 7000

/** Qatorni chapga surish shu masofadan oshsa «Oʻchirish» ochiladi (telefon). */
const SURISH_CHEGARASI = 40

export type YozuvlarProps = {
  /** `hammaYozuvlar('yangidan')` tartibida: sana boʻyicha, bir kunda `yaratilgan` boʻyicha. */
  yozuvlar: readonly Yozuv[]
  /**
   * Kategoriya nomlari uchun — `hammaKategoriyalar()`. Yashirilgani ham kerak: eski yozuv
   * yashirilgan kategoriyada boʻlishi mumkin va nomi baribir koʻrinadi (mezon 14).
   */
  kategoriyalar: readonly KategoriyaChipi[]
  /** Qator bosilganda — oʻsha yozuvning tahrirlash formasi ochiladi (mezon 18). */
  tahrirla: (yozuv: Yozuv) => void
  /** «Oʻchirish» bosilganda — `yozuvniOchir` va roʻyxatni yangilash. */
  ochir: (yozuv: Yozuv) => Promise<void> | void
  /** «QAYTARISH» bosilganda — `yozuvniQaytar` va roʻyxatni yangilash (mezon 11). */
  qaytar: (yozuv: Yozuv) => Promise<void> | void
  /** «‹ Orqaga». */
  orqaga?: (() => void) | undefined
}

type Kun = { sana: string; yozuvlar: Yozuv[] }

/**
 * Yozuvlarni kunlarga ajratadi. Roʻyxat allaqachon tartiblangan boʻlib keladi
 * (KELISHUV 8-boʻlim), shuning uchun bu yerda qayta saralash yoʻq — ketma-ket bir xil
 * sanalar bitta guruhga yigʻiladi (mezon 19).
 */
function kunlarga(yozuvlar: readonly Yozuv[]): Kun[] {
  const kunlar: Kun[] = []
  for (const yozuv of yozuvlar) {
    const oxirgi = kunlar[kunlar.length - 1]
    if (oxirgi !== undefined && oxirgi.sana === yozuv.sana) {
      oxirgi.yozuvlar.push(yozuv)
    } else {
      kunlar.push({ sana: yozuv.sana, yozuvlar: [yozuv] })
    }
  }
  return kunlar
}

export function Yozuvlar({
  yozuvlar,
  kategoriyalar,
  tahrirla,
  ochir,
  qaytar,
  orqaga,
}: YozuvlarProps) {
  // Qaysi qatorning «Oʻchirish» tugmasi ochiq (hover yoki surish natijasi).
  const [ochiqQator, setOchiqQator] = useState<string | null>(null)
  // Oʻchirilgan yozuvning nusxasi: «qaytarish» panelining butun holati (KELISHUV 8-boʻlim).
  const [ochirilgan, setOchirilgan] = useState<Yozuv | null>(null)
  const surishBoshi = useRef<number | null>(null)

  /**
   * Muddat panel koʻringan lahzadan boshlanadi va toʻxtatib turilmaydi (0048).
   * Ikkinchi yozuv oʻchirilsa `ochirilgan` almashadi: eski hisob bekor boʻladi —
   * birinchi oʻchirish oʻsha zahoti yakuniy (mezon 12a). Ekran yopilsa ham shunday
   * (mezon 12b): nusxa holat bilan birga yoʻqoladi.
   */
  useEffect(() => {
    if (ochirilgan === null) {
      return
    }
    const hisob = setTimeout(() => {
      setOchirilgan(null)
    }, QAYTARISH_MUDDATI)
    return () => {
      clearTimeout(hisob)
    }
  }, [ochirilgan])

  /**
   * Ochilgan «Oʻchirish» uch harakat bilan yopiladi: tugmaning oʻzi bosilganda,
   * boshqa joyga tegilganda va `Esc` bosilganda. Kursor qatordan chiqib ketgani
   * yopmaydi — bu dizaynda ataylab qoida (sichqoncha tugmaga borayotganda qator
   * chekkasidan oʻtishi mumkin).
   */
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
  const kunlar = kunlarga(yozuvlar)

  function kategoriyaNomi(id: string): string {
    return kategoriyalar.find((kategoriya) => kategoriya.id === id)?.nom ?? id
  }

  async function ochirishniBosdi(yozuv: Yozuv): Promise<void> {
    setOchiqQator(null)
    await ochir(yozuv)
    setOchirilgan(yozuv)
  }

  async function qaytarishniBosdi(): Promise<void> {
    if (ochirilgan === null) {
      return
    }
    const nusxa = ochirilgan
    setOchirilgan(null)
    await qaytar(nusxa)
  }

  function surishBoshlandi(x: number): void {
    surishBoshi.current = x
  }

  /** Chapga surish tugmani ochadi, oʻngga surish yopadi; surishning oʻzi oʻchirmaydi. */
  function surishTugadi(id: string, x: number): void {
    const boshi = surishBoshi.current
    surishBoshi.current = null
    if (boshi === null) {
      return
    }
    const farq = x - boshi
    if (farq <= -SURISH_CHEGARASI) {
      setOchiqQator(id)
    } else if (farq >= SURISH_CHEGARASI) {
      setOchiqQator(null)
    }
  }

  return (
    <div
      className="ekran"
      onClick={() => {
        // «Boshqa joyga tegish» — ochilgan «Oʻchirish» tugmasi yopiladi (dizayn).
        // `click` ataylab: `pointerdown` da yopilsa, tugma bosilish tugagunicha
        // DOM dan chiqib ketadi va bosish yoʻqoladi.
        setOchiqQator(null)
      }}
    >
      <header className="panel-tepa">
        <button type="button" className="matn-havola panel-orqaga" onClick={orqaga}>
          {YOZUVLAR.orqaga}
        </button>
        <h1 className="sarlavha">{YOZUVLAR.sarlavha}</h1>
      </header>

      {kunlar.length === 0 ? (
        <div className="bosh-holat">
          <p className="bosh-birinchi">{YOZUVLAR.boshBirinchi}</p>
          <p className="bosh-ikkinchi">{YOZUVLAR.boshIkkinchi}</p>
        </div>
      ) : (
        <div className="royxat">
          {kunlar.map((kun) => (
            <section className="kun" key={kun.sana}>
              <h2 className="kun-sarlavhasi">{sanaYorligi(kun.sana, bugungi)}</h2>
              <ul className="qatorlar">
                {kun.yozuvlar.map((yozuv) => {
                  const ochiq = ochiqQator === yozuv.id
                  return (
                    <li key={yozuv.id}>
                      <div
                        className={ochiq ? 'yozuv-qator ochiq' : 'yozuv-qator'}
                        onClick={(hodisa) => {
                          // Ochiq qator ichidagi bosish uni yopmaydi.
                          if (ochiq) {
                            hodisa.stopPropagation()
                          }
                        }}
                        onMouseEnter={() => {
                          // Kompyuterda kursor qator ustiga kelsa tugma koʻrinadi. Kursor
                          // chiqqanida yopilmaydi: dizaynda yopilish sababi bitta —
                          // «boshqa joyga tegish» (boshqa qator ustiga kelish ham shunga
                          // kiradi, chunki ochiq qator bittagina boʻladi).
                          setOchiqQator(yozuv.id)
                        }}
                        onTouchStart={(hodisa) => {
                          surishBoshlandi(hodisa.touches[0]?.clientX ?? 0)
                        }}
                        onTouchEnd={(hodisa) => {
                          surishTugadi(yozuv.id, hodisa.changedTouches[0]?.clientX ?? 0)
                        }}
                      >
                        <button
                          type="button"
                          className="qator-tugma"
                          onClick={() => {
                            tahrirla(yozuv)
                          }}
                        >
                          <span className="qator-chap">
                            <span className="qator-kategoriya">
                              {kategoriyaNomi(yozuv.kategoriyaId)}
                            </span>
                            <span className="qator-izoh">
                              {qatorIzohi(yozuv.hisob, yozuv.izoh)}
                            </span>
                          </span>
                          <span
                            className={
                              yozuv.turi === 'kirim' ? 'qator-summa kirim' : 'qator-summa chiqim'
                            }
                          >
                            {summaKorinishi(yozuv)}
                          </span>
                        </button>
                        {ochiq ? (
                          <button
                            type="button"
                            className="ochirish-tugma"
                            onClick={() => {
                              void ochirishniBosdi(yozuv)
                            }}
                          >
                            {YOZUVLAR.ochirish}
                          </button>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      {ochirilgan === null ? null : (
        <div className="qaytarish-paneli" role="status">
          <span className="qaytarish-matni">{YOZUVLAR.ochirildi}</span>
          <button
            type="button"
            className="qaytarish-tugma"
            onClick={() => {
              void qaytarishniBosdi()
            }}
          >
            {YOZUVLAR.qaytarish}
          </button>
        </div>
      )}
    </div>
  )
}
