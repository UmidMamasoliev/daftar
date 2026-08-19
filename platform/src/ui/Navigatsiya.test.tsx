// Pastki navigatsiya paneli — dashboard bosh sahifa boʻlgandan keyingi tartib (0063 → 0067).
//
// Tavsif: `design/uslub.md` → «Navigatsiya paneli». Bandlar: Bosh, Yozuvlar, Qarz daftari,
// Hisobot, Zaxira — «Yozuv» bandi yoʻq, yozuv qoʻshish bosh sahifadagi «＋ Yozuv» tugmasidan
// (spec 001-dashboard FR-013, Clarifications 2026-08-19).

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Navigatsiya, navMatnSinfi } from './Navigatsiya.tsx'

afterEach(cleanup)

function chiz(faol: 'bosh' | 'yozuvlar' | 'qarz-daftari' | 'hisobot' | 'zaxira' = 'bosh') {
  const otish = vi.fn()
  render(<Navigatsiya faol={faol} otish={otish} />)
  return { otish, odam: userEvent.setup() }
}

function bolak(nom: string): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

describe('boʻlaklar (FR-013; mezon: navigatsiya)', () => {
  it('beshta boʻlak turadi va «Yozuv» bandi yoʻq', () => {
    chiz()
    expect(bolak('Bosh')).toBeDefined()
    expect(bolak('Yozuvlar')).toBeDefined()
    expect(bolak('Qarz daftari')).toBeDefined()
    expect(bolak('Hisobot')).toBeDefined()
    expect(bolak('Zaxira')).toBeDefined()
    expect(screen.getAllByRole('button')).toHaveLength(5)
    expect(screen.queryByRole('button', { name: 'Yozuv' })).toBeNull()
  })

  // Uslub: «Matn — `kichik` (14 px); boʻlak **toʻrttadan koʻp** boʻlganda `mayda` (13 px)».
  it('toʻrtta boʻlakda matn `kichik`, toʻrttadan koʻpida `mayda` boʻladi', () => {
    expect(navMatnSinfi(4)).toBe('nav-matn-kichik')
    expect(navMatnSinfi(5)).toBe('nav-matn-mayda')
  })

  it('joriy panel oʻz boʻlaklari soniga mos sinfni oladi — beshta boʻlak, `mayda`', () => {
    chiz()
    expect(bolak('Hisobot').className).toContain('nav-matn-mayda')
  })
})

describe('faol boʻlim (dizayn: «Oʻlchamlari va rangi»)', () => {
  it('faol boʻlim belgilanadi, qolganlari yoʻq', () => {
    chiz('qarz-daftari')
    expect(bolak('Qarz daftari').getAttribute('aria-current')).toBe('page')
    expect(bolak('Yozuvlar').getAttribute('aria-current')).toBeNull()
    expect(bolak('Bosh').getAttribute('aria-current')).toBeNull()
  })

  it('faol holat faqat rang bilan emas — qalinlik sinfi ham qoʻyiladi', () => {
    chiz('bosh')
    expect(bolak('Bosh').className).toContain('faol')
    expect(bolak('Yozuvlar').className).not.toContain('faol')
  })
})

describe('bosilganda', () => {
  it('har boʻlak oʻz nomi bilan chaqiruvni yuboradi', async () => {
    const { otish, odam } = chiz()
    await odam.click(bolak('Bosh'))
    await odam.click(bolak('Qarz daftari'))
    await odam.click(bolak('Hisobot'))
    await odam.click(bolak('Zaxira'))
    expect(otish.mock.calls).toEqual([['bosh'], ['qarz-daftari'], ['hisobot'], ['zaxira']])
  })

  it('faol boʻlimning oʻzi bosilsa ham chaqiruv ketadi', async () => {
    const { otish, odam } = chiz('yozuvlar')
    await odam.click(bolak('Yozuvlar'))
    expect(otish).toHaveBeenCalledWith('yozuvlar')
  })
})
