// Ilovaning kirish nuqtasi va ekranlar orasidagi oʻtish.
//
// **Vaqtinchalik (0063):** dashboard 3.10 gacha qurilmaydi, shuning uchun ilovada pastki
// navigatsiya paneli turadi (Yozuv / Yozuvlar / Qarz daftari) va ilova «Yozuvlar» bilan
// ochiladi. Dashboard qurilganda u bosh sahifa boʻladi va navigatsiya qayta koʻriladi.
// Tavsifi: `design/uslub.md` → «Navigatsiya paneli — VAQTINCHALIK (0063)».
//
// Yettita ekran bor:
// - «Yangi yozuv» / «Yozuvni tahrirlash» formasi va «Kategoriyalar» boshqaruvi;
// - «Yozuvlar» roʻyxati;
// - «Qarz daftari» (kontaktlar), «Kontakt» sahifasi, «Yangi qarz»/«Qarzni tahrirlash»
//   formasi va «Toʻlov» formasi.
//
// Panel forma ekranlarida koʻrinmaydi: u yerda pastda «Saqlash» yoki «＋ Yangi kategoriya»
// paneli turadi va ikkita panel ustma-ust qoʻyilmaydi (dizayn).
//
// Kategoriyalar ekrani ochilganda yozuv formasi DOM da qoladi (`hidden`), chunki
// qaytilganda forma toʻldirilgan holicha turishi kerak (dizayn: «Boshqarish» qatori).

import { useEffect, useRef, useState } from 'react'
import { hisobotniOl } from './data/hisobot.ts'
import {
  hammaKategoriyalar,
  kategoriyaQosh,
  kategoriyaniKorsat,
  kategoriyaniYashir,
} from './data/kategoriyalar.ts'
import {
  kontaktHolatlari,
  kontaktSaqla,
  kontaktniOchir,
  kontaktniQaytar,
  kontaktniTahrirla,
  qarzSaqla,
  qarzniOchir,
  qarzniQaytar,
  qarzniTahrirla,
  tolovSaqla,
  tolovniOchir,
  tolovniQaytar,
} from './data/qarzlar.ts'
import {
  hammaYozuvlar,
  yozuvQosh,
  yozuvniOchir,
  yozuvniQaytar,
  yozuvniYangila,
} from './data/yozuvlar.ts'
import { qoldaKurslarniOl, qoldaKursniQoy } from './data/sozlamalar.ts'
import type { Davr, Hisobot as HisobotTuri, Oy } from './domain/hisobot.ts'
import { joriyOyDavri, oyDavri, oySur, sananingOyi } from './domain/hisobot.ts'
import { korinadiganlar } from './domain/kategoriya.ts'
import type {
  Kategoriya,
  KontaktHolati,
  Natija,
  OchirilganKontakt,
  Qarz,
  QarzFormasi,
  TolovFormasi,
  YangiYozuv,
  Yozuv,
  YozuvTuri,
} from './domain/turlar.ts'
import { bugun } from './domain/sana.ts'
import { Hisobot } from './ui/Hisobot.tsx'
import { qoldaKurslarManbalari } from './ui/kurslar.ts'
import { Kategoriyalar } from './ui/Kategoriyalar.tsx'
import { Kontakt } from './ui/Kontakt.tsx'
import type { Bolim } from './ui/Navigatsiya.tsx'
import { Navigatsiya } from './ui/Navigatsiya.tsx'
import { QarzDaftari } from './ui/QarzDaftari.tsx'
import { QarzForma } from './ui/QarzForma.tsx'
import { TolovForma } from './ui/TolovForma.tsx'
import type { KategoriyaRoyxati } from './ui/YozuvForma.tsx'
import { YozuvForma } from './ui/YozuvForma.tsx'
import { Yozuvlar } from './ui/Yozuvlar.tsx'

type Ekran =
  | 'forma'
  | 'yozuvlar'
  | 'kategoriyalar'
  | 'qarz-daftari'
  | 'kontakt'
  | 'qarz-forma'
  | 'tolov-forma'
  | 'hisobot'

/** Navigatsiya paneli faqat shu ekranlarda koʻrinadi (dizayn, 0063). */
const NAVLI_EKRANLAR: readonly Ekran[] = ['yozuvlar', 'qarz-daftari', 'kontakt', 'hisobot']


type Holat = {
  kategoriyalar: Kategoriya[]
  yozuvlar: Yozuv[]
  kontaktlar: KontaktHolati[]
}

async function oqi(): Promise<Holat> {
  const [kategoriyalar, yozuvlar, kontaktlar] = await Promise.all([
    hammaKategoriyalar(),
    hammaYozuvlar(),
    kontaktHolatlari(),
  ])
  return { kategoriyalar, yozuvlar, kontaktlar }
}

export function App() {
  // Ilova «Yozuvlar» bilan ochiladi (0063; dizayn: «Ilova ochilganda va forma yopilganda»).
  const [ekran, setEkran] = useState<Ekran>('yozuvlar')
  const [tahrirlanayotgan, setTahrirlanayotgan] = useState<Yozuv | null>(null)
  const [kategoriyaTuri, setKategoriyaTuri] = useState<YozuvTuri>('chiqim')
  // «Boshqarish» dan har qaytishda ortadi — forma shu belgidan tanlangan
  // kategoriya hali koʻrinadimi degan tekshiruvni bir marta bajaradi.
  const [boshqarishdanQaytish, setBoshqarishdanQaytish] = useState(0)
  const navbatRef = useRef<Promise<unknown>>(Promise.resolve())
  const [kategoriyalar, setKategoriyalar] = useState<readonly Kategoriya[]>([])
  const [yozuvlar, setYozuvlar] = useState<readonly Yozuv[]>([])
  const [kontaktlar, setKontaktlar] = useState<readonly KontaktHolati[]>([])
  const [kontaktId, setKontaktId] = useState<string | null>(null)
  const [qarzId, setQarzId] = useState<string | null>(null)
  const [tolovQarzId, setTolovQarzId] = useState<string | null>(null)
  // Oʻchirilgan kontakt «Qarz daftari» roʻyxatida «qaytarish» paneli boʻlib turadi (0030).
  const [ochirilganKontakt, setOchirilganKontakt] = useState<OchirilganKontakt | null>(null)
  // Hisobot ekrani: `oy` — oy holati, `null` — ixtiyoriy davr holati (dizayn 2-boʻlim).
  const [hisobotOyi, setHisobotOyi] = useState<Oy | null>(() => sananingOyi(bugun()))
  const [hisobotDavri, setHisobotDavri] = useState<Davr>(() => joriyOyDavri())
  const [hisobot, setHisobot] = useState<HisobotTuri | null>(null)
  // «Oyga qaytish» davr tanlashdan **oldin** ochiq turgan oyni qaytaradi (dizayn 2-boʻlim).
  const [oldingiOy, setOldingiOy] = useState<Oy | null>(null)

  /**
   * Birinchi oʻqish ham **navbatdan** oʻtadi.
   *
   * Navigatsiya paneli darhol chiziladi (0063), demak odam birinchi oʻqish tugamasdan
   * kontakt qoʻsha oladi. Navbatsiz holatda kech qaytgan birinchi surat yangi kontaktni
   * ekrandan oʻchirib yuborardi — saqlangan narsa jimgina yoʻqolardi
   * (`src/App.qarz.poyga.test.tsx` shuni qizil bilan koʻrsatgan).
   */
  useEffect(() => {
    let tirik = true
    void navbatga(async () => {
      const holat = await oqi()
      if (tirik) {
        setKategoriyalar(holat.kategoriyalar)
        setYozuvlar(holat.yozuvlar)
        setKontaktlar(holat.kontaktlar)
      }
    })
    return () => {
      tirik = false
    }
    // Ataylab bir marta: `navbatga` har renderda yangidan yasaladi, lekin navbatning
    // oʻzi `useRef` da turadi va oʻzgarmaydi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Qoldiq, netto va roʻyxatlar saqlanmaydi — har oʻzgarishdan keyin doʻkondan qayta
  // oʻqiladi (KELISHUV 6- va 13-boʻlimlar; mezon 10, 11).
  async function yangila(): Promise<void> {
    const holat = await oqi()
    setKategoriyalar(holat.kategoriyalar)
    setYozuvlar(holat.yozuvlar)
    setKontaktlar(holat.kontaktlar)
  }

  /**
   * Hisobot ekran ochilganda va davr oʻzgarganda qayta oʻqiladi.
   *
   * Hech qayerda saqlanmaydi (0014, 0045; mezon 18): yozuv tahrirlansa yoki oʻchirilsa
   * keyingi oʻqishda raqam oʻz-oʻzidan toʻgʻri chiqadi. Oʻqish navbatdan oʻtadi —
   * boshqa ekrandagi saqlash tugamasdan eskirgan surat kelib qolmasin.
   */
  useEffect(() => {
    if (ekran !== 'hisobot') {
      return
    }
    let tirik = true
    void navbatga(async () => {
      const kurslar = await qoldaKurslarniOl()
      const manbalar = qoldaKurslarManbalari(kurslar)
      const natija = await hisobotniOl(hisobotDavri, manbalar)
      if (tirik) {
        setHisobot(natija)
      }
    })
    return () => {
      tirik = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ekran, hisobotDavri, yozuvlar, kontaktlar, kategoriyalar])

  /**
   * Doʻkonga tegadigan har amal navbatda bajariladi.
   *
   * Sababi «Koʻrsatish» + «‹ Orqaga» ketma-ketligi: qaytish belgisi doʻkon yangilanishidan
   * oldin ortsa, forma eski roʻyxatga qarab tanlovni notoʻgʻri bekor qilardi. Navbat
   * boʻshashini kutish shu poygani yopadi.
   */
  function navbatga<T>(ish: () => Promise<T>): Promise<T> {
    const natija = navbatRef.current.then(ish)
    navbatRef.current = natija.then(
      () => undefined,
      () => undefined,
    )
    return natija
  }

  // Chiplar har ikkala rejimda ham faqat koʻrinadigan kategoriyalar (0013). Tahrirlashda
  // ustiga yozuvning oʻz kategoriyasi qoʻshiladi — yashirilgan boʻlsa ham (0057; mezon 14c);
  // uni forma oʻzi joriy turga qarab qoʻshadi.
  const formaRoyxati: KategoriyaRoyxati = {
    kirim: korinadiganlar(kategoriyalar, 'kirim'),
    chiqim: korinadiganlar(kategoriyalar, 'chiqim'),
  }
  const yozuvKategoriyasi =
    tahrirlanayotgan === null
      ? undefined
      : kategoriyalar.find((kategoriya) => kategoriya.id === tahrirlanayotgan.kategoriyaId)

  const joriyKontakt = kontaktlar.find((holat) => holat.kontakt.id === kontaktId)
  const joriyQarz = joriyKontakt?.qarzlar.find((holat) => holat.qarz.id === qarzId)
  const tolovQarzi = joriyKontakt?.qarzlar.find((holat) => holat.qarz.id === tolovQarzId)

  const formaKerak = ekran === 'forma' || ekran === 'kategoriyalar'
  const navKorinadi = NAVLI_EKRANLAR.includes(ekran)
  // «Kontakt» sahifasida faol boʻlim — «Qarz daftari» (dizayn).
  const faolBolim: Bolim =
    ekran === 'yozuvlar' ? 'yozuvlar' : ekran === 'hisobot' ? 'hisobot' : 'qarz-daftari'

  /** Panel yoʻqolganda oʻchirish yakuniy boʻladi — nusxa tashlanadi (0029). */
  function kontaktPanelniUnut(): void {
    setOchirilganKontakt(null)
  }

  function navigatsiyaOtishi(bolim: Bolim): void {
    // Ekrandan chiqib ketilsa panel yoʻqoladi va oʻchirish yakuniy boʻladi (dizayn).
    kontaktPanelniUnut()
    if (bolim === 'yozuv') {
      setTahrirlanayotgan(null)
      setEkran('forma')
      return
    }
    if (bolim === 'yozuvlar') {
      setEkran('yozuvlar')
      return
    }
    if (bolim === 'hisobot') {
      // Ekran **har ochilganda** joriy kalendar oy bilan ochiladi; tanlangan oy eslab
      // qolinmaydi (0018; mezon 1, dizayn 2-boʻlim).
      setHisobotOyi(sananingOyi(bugun()))
      setHisobotDavri(joriyOyDavri())
      setEkran('hisobot')
      return
    }
    setKontaktId(null)
    setEkran('qarz-daftari')
  }

  function kontaktgaQayt(): void {
    setQarzId(null)
    setTolovQarzId(null)
    setEkran('kontakt')
  }

  return (
    <div className={navKorinadi ? 'ilova nav-bor' : 'ilova'}>
      {formaKerak ? (
        <div className="ekran-orash" hidden={ekran !== 'forma'}>
          <YozuvForma
            key={tahrirlanayotgan?.id ?? 'yangi'}
            kategoriyalar={formaRoyxati}
            yozuv={tahrirlanayotgan ?? undefined}
            yozuvKategoriyasi={yozuvKategoriyasi}
            saqla={async (yangi: YangiYozuv) => {
              await navbatga(async () => {
                if (tahrirlanayotgan === null) {
                  await yozuvQosh(yangi)
                } else {
                  await yozuvniYangila(tahrirlanayotgan.id, yangi)
                }
                await yangila()
              })
            }}
            yop={() => {
              // `×` bosilsa ham, «Saqlash» bosilsa ham «Yozuvlar» ochiladi (0063).
              setTahrirlanayotgan(null)
              setEkran('yozuvlar')
            }}
            boshqarish={(turi) => {
              setKategoriyaTuri(turi === '' ? 'chiqim' : turi)
              setEkran('kategoriyalar')
            }}
            boshqarishdanQaytish={boshqarishdanQaytish}
          />
        </div>
      ) : null}

      {ekran === 'kategoriyalar' ? (
        <Kategoriyalar
          kategoriyalar={kategoriyalar}
          boshlangichTur={kategoriyaTuri}
          qosh={async (nom, turi) =>
            navbatga(async () => {
              const natija = await kategoriyaQosh(nom, turi)
              if (natija.ok) {
                await yangila()
              }
              return natija
            })
          }
          yashir={async (id) => {
            await navbatga(async () => {
              await kategoriyaniYashir(id)
              await yangila()
            })
          }}
          korsat={async (id) => {
            await navbatga(async () => {
              await kategoriyaniKorsat(id)
              await yangila()
            })
          }}
          orqaga={async () => {
            // Boshlangan yashirish/koʻrsatish tugasin — forma yangi roʻyxatga qarasin.
            await navbatRef.current
            setEkran('forma')
            setBoshqarishdanQaytish((oldingi) => oldingi + 1)
          }}
        />
      ) : null}

      {ekran === 'yozuvlar' ? (
        <Yozuvlar
          yozuvlar={yozuvlar}
          kategoriyalar={kategoriyalar}
          tahrirla={(yozuv) => {
            setTahrirlanayotgan(yozuv)
            setEkran('forma')
          }}
          ochir={async (yozuv) => {
            await navbatga(async () => {
              await yozuvniOchir(yozuv.id)
              await yangila()
            })
          }}
          qaytar={async (yozuv) => {
            await navbatga(async () => {
              await yozuvniQaytar(yozuv)
              await yangila()
            })
          }}
        />
      ) : null}

      {ekran === 'qarz-daftari' ? (
        <QarzDaftari
          kontaktlar={kontaktlar}
          ochirilganKontakt={ochirilganKontakt}
          och={(id) => {
            kontaktPanelniUnut()
            setKontaktId(id)
            setEkran('kontakt')
          }}
          qosh={async (forma) =>
            navbatga(async () => {
              const natija = await kontaktSaqla(forma)
              if (natija.ok) {
                await yangila()
              }
              return natija
            })
          }
          qaytar={async (ochirilgan) => {
            await navbatga(async () => {
              await kontaktniQaytar(ochirilgan)
              await yangila()
            })
          }}
          unut={kontaktPanelniUnut}
        />
      ) : null}

      {ekran === 'kontakt' && joriyKontakt !== undefined ? (
        <Kontakt
          key={joriyKontakt.kontakt.id}
          holat={joriyKontakt}
          orqaga={() => {
            setKontaktId(null)
            setEkran('qarz-daftari')
          }}
          tahrirla={async (forma) =>
            navbatga(async () => {
              const natija = await kontaktniTahrirla(joriyKontakt.kontakt.id, forma)
              if (natija.ok) {
                await yangila()
              }
              return natija
            })
          }
          yangiQarz={() => {
            setQarzId(null)
            setEkran('qarz-forma')
          }}
          yangiTolov={(qarz: Qarz) => {
            setTolovQarzId(qarz.id)
            setEkran('tolov-forma')
          }}
          qarzniTahrirla={(qarz: Qarz) => {
            setQarzId(qarz.id)
            setEkran('qarz-forma')
          }}
          qarzniOchir={async (qarz: Qarz) =>
            navbatga(async () => {
              const ochirilgan = await qarzniOchir(qarz.id)
              await yangila()
              return ochirilgan
            })
          }
          qarzniQaytar={async (ochirilgan) => {
            await navbatga(async () => {
              await qarzniQaytar(ochirilgan)
              await yangila()
            })
          }}
          tolovniOchir={async (tolov) => {
            await navbatga(async () => {
              await tolovniOchir(tolov.id)
              await yangila()
            })
          }}
          tolovniQaytar={async (tolov) => {
            await navbatga(async () => {
              await tolovniQaytar(tolov)
              await yangila()
            })
          }}
          kontaktniOchir={async () =>
            navbatga(async () => {
              const natija = await kontaktniOchir(joriyKontakt.kontakt.id)
              if (natija.ok) {
                // Ekran roʻyxatga qaytadi, panel oʻsha yerda chiqadi (dizayn 2-boʻlim).
                setOchirilganKontakt(natija.qiymat)
                setKontaktId(null)
                setEkran('qarz-daftari')
                await yangila()
              }
              return natija
            })
          }
        />
      ) : null}

      {ekran === 'qarz-forma' && joriyKontakt !== undefined ? (
        <QarzForma
          key={qarzId ?? 'yangi'}
          kontakt={joriyKontakt.kontakt}
          qarz={joriyQarz?.qarz}
          tolovlarSoni={joriyQarz?.tolovlar.length ?? 0}
          tolangan={joriyQarz?.tolangan ?? 0}
          /*
           * Ikkalasi ham doʻkonning **tekshiruvli** yoʻli (KELISHUV 14-boʻlim):
           * `qarzSaqla` kontakt hali bor-yoʻqligini bazadan tekshiradi (0030),
           * `qarzniTahrirla` esa qarzni va toʻlovlarini qayta oʻqib 0059/0061e
           * chegaralarini qoʻyadi. Ekrandagi holat eskirgan boʻlsa ham (ilova ikki
           * tabda ochilishi mumkin) qarz jimgina notoʻgʻri joyga tushmaydi.
           */
          saqla={async (forma: QarzFormasi): Promise<Natija<Qarz>> =>
            navbatga(async () => {
              const natija =
                joriyQarz === undefined
                  ? await qarzSaqla(forma)
                  : await qarzniTahrirla(joriyQarz.qarz.id, forma)
              if (natija.ok) {
                await yangila()
              }
              return natija
            })
          }
          yop={kontaktgaQayt}
        />
      ) : null}

      {ekran === 'tolov-forma' && joriyKontakt !== undefined && tolovQarzi !== undefined ? (
        <TolovForma
          key={tolovQarzi.qarz.id}
          kontakt={joriyKontakt.kontakt}
          qarz={tolovQarzi.qarz}
          tolovlar={tolovQarzi.tolovlar}
          /*
           * `tolovSaqla` — doʻkonning **tekshiruvli** yoʻli (KELISHUV 14-boʻlim): u qarzni
           * va uning toʻlovlarini oʻzi qayta oʻqiydi. Shu sababli 0061 chegarasi ekrandagi
           * (eskirishi mumkin boʻlgan) holatga emas, bazadagi holatga qoʻyiladi — ilova
           * ikki tabda ochilsa ham yopilgan qarzga toʻlov oʻtib ketmaydi.
           */
          saqla={async (forma: TolovFormasi) =>
            navbatga(async () => {
              const natija = await tolovSaqla(forma)
              if (natija.ok) {
                await yangila()
              }
              return natija
            })
          }
          yop={kontaktgaQayt}
        />
      ) : null}

      {ekran === 'hisobot' ? (
        <Hisobot
          hisobot={hisobot}
          kategoriyalar={kategoriyalar}
          oy={hisobotOyi}
          joriyOy={sananingOyi(bugun())}
          oyniSur={(qadam) => {
            if (hisobotOyi === null) {
              return
            }
            const yangi = oySur(hisobotOyi, qadam)
            setHisobotOyi(yangi)
            setHisobotDavri(oyDavri(yangi))
          }}
          davrniQoy={(davr) => {
            // Oy holatidan davr holatiga oʻtiladi; «Oyga qaytish» eski oyni tiklaydi.
            setOldingiOy(hisobotOyi)
            setHisobotOyi(null)
            setHisobotDavri(davr)
          }}
          oygaQaytar={() => {
            const qaytadigan = oldingiOy ?? sananingOyi(bugun())
            setHisobotOyi(qaytadigan)
            setHisobotDavri(oyDavri(qaytadigan))
          }}
          kursniSaqla={async (kurs) => {
            await navbatga(async () => {
              // 0043: kurs oʻsha kunning sanasi bilan saqlanadi va qayta soʻralmaydi.
              const kurslar = await qoldaKursniQoy(kurs, bugun())
              setHisobot(await hisobotniOl(hisobotDavri, qoldaKurslarManbalari(kurslar)))
            })
          }}
        />
      ) : null}

      {navKorinadi ? <Navigatsiya faol={faolBolim} otish={navigatsiyaOtishi} /> : null}
    </div>
  )
}
