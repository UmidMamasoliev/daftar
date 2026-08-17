// Pastki navigatsiya paneli — **VAQTINCHALIK** (0063).
//
// Tavsif: `design/uslub.md` → «Navigatsiya paneli — VAQTINCHALIK (0063)».
// Dashboard 3.10 da qurilganda bosh sahifa oʻsha boʻladi va bu panel qayta koʻriladi.

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Navigatsiya, navMatnSinfi } from './Navigatsiya.tsx'

afterEach(cleanup)

function chiz(faol: 'yozuv' | 'yozuvlar' | 'qarz-daftari' | 'hisobot' | 'zaxira' = 'yozuvlar') {
  const otish = vi.fn()
  render(<Navigatsiya faol={faol} otish={otish} />)
  return { otish, odam: userEvent.setup() }
}

function bolak(nom: string): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

describe('boʻlaklar (dizayn: «Nima koʻrinadi»)', () => {
  it('beshta boʻlak turadi — panel toʻldi (uslub)', () => {
    chiz()
    expect(bolak('Yozuv')).toBeDefined()
    expect(bolak('Yozuvlar')).toBeDefined()
    expect(bolak('Qarz daftari')).toBeDefined()
    expect(bolak('Hisobot')).toBeDefined()
    expect(bolak('Zaxira')).toBeDefined()
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  // Uslub: «Matn — `kichik` (14 px); boʻlak **toʻrttadan koʻp** boʻlganda `mayda` (13 px)».
  // Qoida boʻlaklar sonidan hisoblanadi: «Zaxira» qoʻshilganda oʻlcham oʻzi kichrayadi.
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
    expect(bolak('Yozuv').getAttribute('aria-current')).toBeNull()
  })

  it('faol holat faqat rang bilan emas — qalinlik sinfi ham qoʻyiladi', () => {
    chiz('yozuvlar')
    expect(bolak('Yozuvlar').className).toContain('faol')
    expect(bolak('Yozuv').className).not.toContain('faol')
  })
})

describe('bosilganda', () => {
  it('har boʻlak oʻz nomi bilan chaqiruvni yuboradi', async () => {
    const { otish, odam } = chiz()
    await odam.click(bolak('Yozuv'))
    await odam.click(bolak('Qarz daftari'))
    await odam.click(bolak('Hisobot'))
    await odam.click(bolak('Zaxira'))
    expect(otish.mock.calls).toEqual([['yozuv'], ['qarz-daftari'], ['hisobot'], ['zaxira']])
  })

  it('faol boʻlimning oʻzi bosilsa ham chaqiruv ketadi', async () => {
    const { otish, odam } = chiz('yozuvlar')
    await odam.click(bolak('Yozuvlar'))
    expect(otish).toHaveBeenCalledWith('yozuvlar')
  })
})
