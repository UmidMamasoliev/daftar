// Ilovaning kirish nuqtasi.
//
// Hozircha bitta ekran koʻrinadi — «Yangi yozuv» formasi. Navigatsiya (bosh sahifa,
// «Yozuvlar» va «Kategoriyalar» ekranlari) keyingi vazifada qoʻshiladi:
// `design/kirim-chiqim.md` ning «Navigatsiya» qatoriga qarang.

import { useEffect, useState } from 'react'
import { korinadiganKategoriyalar } from './data/kategoriyalar.ts'
import { yozuvQosh } from './data/yozuvlar.ts'
import type { YangiYozuv } from './domain/turlar.ts'
import type { KategoriyaRoyxati } from './ui/YozuvForma.tsx'
import { YozuvForma } from './ui/YozuvForma.tsx'

/** Roʻyxat bazadan kelguncha chiplar oʻrni boʻsh turadi (kutish aylanasi yoʻq — 0004). */
const BOSHLANGICH: KategoriyaRoyxati = { kirim: [], chiqim: [] }

export function App() {
  const [kategoriyalar, setKategoriyalar] = useState<KategoriyaRoyxati>(BOSHLANGICH)

  useEffect(() => {
    let tirik = true
    async function oqi(): Promise<void> {
      const [kirim, chiqim] = await Promise.all([
        korinadiganKategoriyalar('kirim'),
        korinadiganKategoriyalar('chiqim'),
      ])
      if (tirik) {
        setKategoriyalar({ kirim, chiqim })
      }
    }
    void oqi()
    return () => {
      tirik = false
    }
  }, [])

  return <YozuvForma kategoriyalar={kategoriyalar} saqla={saqla} />
}

/** Tekshiruvdan oʻtgan yozuvni doʻkonga beradi (KELISHUV 8-boʻlim). */
async function saqla(yangi: YangiYozuv): Promise<void> {
  await yozuvQosh(yangi)
}
