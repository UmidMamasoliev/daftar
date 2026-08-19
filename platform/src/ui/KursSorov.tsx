// Kurs soʻrash bloki — daftarda birorta kurs boʻlmasa bir marta soʻraladi (0043).
//
// Bitta komponent ikki ekranga xizmat qiladi: «Hisobot» (jami blokining birinchi muhtoj
// boʻlagida) va bosh sahifa (qoldiq kartochkasida, spec 001-dashboard FR-007). Qoida
// bitta boʻlgani uchun kod ham bitta — nusxa koʻchirilsa 0066 dagi «ikki qoida» xatosining
// ekran-darajadagi takrori boʻlardi.
//
// Terish qoidalari `design/uslub.md` («Maydonda terish paytidagi format»): faqat butun
// soʻm, mingliklar boʻsh joy bilan, kasr belgisi maydonga tushmaydi (0042; mezon 14b).
// Yopish tugmasi yoʻq — javob berilmasa ham qolgan raqamlar joyida turadi (dizayn).

import type { ChangeEvent } from 'react'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { kursniOqi } from '../domain/pul.ts'
import type { Xato } from '../domain/turlar.ts'
import { belgilarSoni, kursniShakllantir, kursorOrni } from './format.ts'
import { FORMA, HISOBOT, OGOHLANTIRISH, xatoMatni } from './matnlar.ts'

export type KursSorovProps = {
  /** «Saqlash» bosilib kurs oʻqilgach — 0043: `qoldaKursniQoy(kurs, bugun())`. */
  saqla: (kurs: number) => Promise<void> | void
}

export function KursSorov({ saqla }: KursSorovProps) {
  const [qiymat, setQiymat] = useState('')
  const [ogoh, setOgoh] = useState('')
  const [xato, setXato] = useState<Xato | null>(null)
  // Bitta niyat — bitta saqlash (lessons/qoidalar.md): bayroq `useRef` da (holat
  // yangilanishini kutib boʻlmaydi), tugma esa oʻchiq turadi — YozuvForma naqshi.
  const yuborilmoqdaRef = useRef(false)
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const maydonRef = useRef<HTMLInputElement>(null)
  const kursorRef = useRef<number | null>(null)
  const kursId = useId()

  useLayoutEffect(() => {
    const orin = kursorRef.current
    kursorRef.current = null
    if (orin !== null) {
      maydonRef.current?.setSelectionRange(orin, orin)
    }
  })

  function ozgardi(hodisa: ChangeEvent<HTMLInputElement>): void {
    const xom = hodisa.target.value
    const chapda = belgilarSoni(xom.slice(0, hodisa.target.selectionStart ?? xom.length))
    const shakl = kursniShakllantir(xom)
    kursorRef.current = kursorOrni(shakl.qiymat, chapda)
    setQiymat(shakl.qiymat)
    setOgoh(shakl.kasrOlindi ? OGOHLANTIRISH.kursKasrOlindi : '')
    setXato(null)
  }

  async function yubordi(): Promise<void> {
    if (yuborilmoqdaRef.current) {
      return
    }
    const oqilgan = kursniOqi(qiymat)
    if (!oqilgan.ok) {
      setXato(oqilgan.xatolar[0] ?? null)
      return
    }
    yuborilmoqdaRef.current = true
    setYuborilmoqda(true)
    setXato(null)
    try {
      await saqla(oqilgan.qiymat)
      setQiymat('')
      setOgoh('')
    } finally {
      yuborilmoqdaRef.current = false
      setYuborilmoqda(false)
    }
  }

  return (
    <div className="kurs-sorov">
      <p className="yordam">{HISOBOT.kursKerak}</p>
      <label className="yorliq" htmlFor={kursId}>
        {FORMA.kurs}
      </label>
      <div className="kurs-sorov-qatori">
        <input
          ref={maydonRef}
          id={kursId}
          className={xato === null ? 'maydon' : 'maydon xatoli'}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={xato !== null}
          placeholder={FORMA.kursNamunasi}
          value={qiymat}
          onChange={ozgardi}
        />
        <button
          type="button"
          className="asosiy-tugma qoshish-tugma"
          disabled={yuborilmoqda}
          onClick={() => {
            void yubordi()
          }}
        >
          {HISOBOT.kursSaqlash}
        </button>
      </div>
      {xato === null ? null : <p className="xato-matni">{xatoMatni(xato.kod, xato.xabar)}</p>}
      {ogoh === '' ? null : <p className="yordam">{ogoh}</p>}
    </div>
  )
}
