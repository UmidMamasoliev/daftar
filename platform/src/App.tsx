// Ilovaning kirish nuqtasi va ekranlar orasidagi oʻtish.
//
// Uchta ekran bor: «Yangi yozuv» formasi, «Yozuvlar» roʻyxati va «Kategoriyalar»
// boshqaruvi. Bosh sahifa (dashboard) hali qurilmagan, shuning uchun oʻtish faqat
// dizaynda bor elementlarga bogʻlangan: formadagi `×` va «Saqlash» roʻyxatga qaytaradi,
// roʻyxatdagi «‹ Orqaga» formaga oladi, qator tahrirlash formasini ochadi, formadagi
// «Boshqarish» esa kategoriyalar ekranini ochadi (dizayn: «Navigatsiya»).
//
// Kategoriyalar ekrani ochilganda forma DOM da qoladi (`hidden`), chunki qaytilganda
// forma toʻldirilgan holicha turishi kerak (dizayn: «Boshqarish» qatori).

import { useEffect, useRef, useState } from 'react'
import {
  hammaKategoriyalar,
  kategoriyaQosh,
  kategoriyaniKorsat,
  kategoriyaniYashir,
} from './data/kategoriyalar.ts'
import {
  hammaYozuvlar,
  yozuvQosh,
  yozuvniOchir,
  yozuvniQaytar,
  yozuvniYangila,
} from './data/yozuvlar.ts'
import { korinadiganlar } from './domain/kategoriya.ts'
import type { Kategoriya, YangiYozuv, Yozuv, YozuvTuri } from './domain/turlar.ts'
import { Kategoriyalar } from './ui/Kategoriyalar.tsx'
import type { KategoriyaRoyxati } from './ui/YozuvForma.tsx'
import { YozuvForma } from './ui/YozuvForma.tsx'
import { Yozuvlar } from './ui/Yozuvlar.tsx'

type Ekran = 'forma' | 'yozuvlar' | 'kategoriyalar'

async function oqi(): Promise<{ kategoriyalar: Kategoriya[]; yozuvlar: Yozuv[] }> {
  const [kategoriyalar, yozuvlar] = await Promise.all([hammaKategoriyalar(), hammaYozuvlar()])
  return { kategoriyalar, yozuvlar }
}

export function App() {
  const [ekran, setEkran] = useState<Ekran>('forma')
  const [tahrirlanayotgan, setTahrirlanayotgan] = useState<Yozuv | null>(null)
  const [kategoriyaTuri, setKategoriyaTuri] = useState<YozuvTuri>('chiqim')
  // «Boshqarish» dan har qaytishda ortadi — forma shu belgidan tanlangan
  // kategoriya hali koʻrinadimi degan tekshiruvni bir marta bajaradi.
  const [boshqarishdanQaytish, setBoshqarishdanQaytish] = useState(0)
  const navbatRef = useRef<Promise<unknown>>(Promise.resolve())
  const [kategoriyalar, setKategoriyalar] = useState<readonly Kategoriya[]>([])
  const [yozuvlar, setYozuvlar] = useState<readonly Yozuv[]>([])

  useEffect(() => {
    let tirik = true
    void oqi().then((holat) => {
      if (tirik) {
        setKategoriyalar(holat.kategoriyalar)
        setYozuvlar(holat.yozuvlar)
      }
    })
    return () => {
      tirik = false
    }
  }, [])

  // Qoldiq va roʻyxat saqlanmaydi — har oʻzgarishdan keyin doʻkondan qayta oʻqiladi
  // (KELISHUV 6-boʻlim; mezon 10, 11).
  async function yangila(): Promise<void> {
    const holat = await oqi()
    setKategoriyalar(holat.kategoriyalar)
    setYozuvlar(holat.yozuvlar)
  }

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

  const formaKerak = ekran === 'forma' || ekran === 'kategoriyalar'

  return (
    <>
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
          orqaga={() => {
            setTahrirlanayotgan(null)
            setEkran('forma')
          }}
        />
      ) : null}
    </>
  )
}
