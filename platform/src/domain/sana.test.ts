import { afterEach, describe, expect, it, vi } from 'vitest'

import { bugun, sananiTekshir } from './sana.ts'
import type { Natija } from './turlar.ts'

function kodlar(natija: Natija<unknown>): string[] {
  return natija.ok ? [] : natija.xatolar.map((xato) => xato.kod)
}

/** Berilgan vaqtdagi mahalliy kunni `YYYY-MM-DD` qilib beradi (testning oʻz hisobi). */
function mahalliyKun(vaqt: Date): string {
  return vaqt.toLocaleDateString('en-CA')
}

afterEach(() => {
  vi.useRealTimers()
})

describe('bugun', () => {
  it('mahalliy bugungi kunni YYYY-MM-DD koʻrinishida beradi', () => {
    expect(bugun()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(bugun()).toBe(mahalliyKun(new Date()))
  })

  it('soat oʻzgarsa ham oʻsha kunni beradi', () => {
    vi.useFakeTimers()
    const vaqt = new Date('2026-08-17T09:41:00.000Z')
    vi.setSystemTime(vaqt)
    expect(bugun()).toBe(mahalliyKun(vaqt))
  })
})

describe('sananiTekshir (0034, mezon 4, 4a)', () => {
  it('mezon 4 — oʻtgan kun qabul qilinadi', () => {
    expect(sananiTekshir('2026-01-05')).toEqual({ ok: true, qiymat: '2026-01-05' })
  })

  it('bugungi kun qabul qilinadi', () => {
    expect(sananiTekshir(bugun())).toEqual({ ok: true, qiymat: bugun() })
  })

  it('mezon 4a — ertangi kun qabul qilinmaydi', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-17T12:00:00.000Z'))
    const ertaga = mahalliyKun(new Date(Date.now() + 24 * 60 * 60 * 1000))
    expect(kodlar(sananiTekshir(ertaga))).toEqual(['sana-kelajak'])
  })

  it('boʻsh sana qabul qilinmaydi', () => {
    expect(kodlar(sananiTekshir(''))).toEqual(['sana-bosh'])
  })

  it('koʻrinishi notoʻgʻri sana qabul qilinmaydi', () => {
    expect(kodlar(sananiTekshir('17.08.2026'))).toEqual(['sana-notogri'])
    expect(kodlar(sananiTekshir('2026-8-17'))).toEqual(['sana-notogri'])
  })

  it('taqvimda yoʻq sana qabul qilinmaydi', () => {
    expect(kodlar(sananiTekshir('2026-02-30'))).toEqual(['sana-notogri'])
    expect(kodlar(sananiTekshir('2026-13-01'))).toEqual(['sana-notogri'])
  })
})
