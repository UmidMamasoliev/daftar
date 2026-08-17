// «Toʻlov» formasi — ekran darajasidagi testlar.
//
// Tavsif: `design/qarz-daftari.md` (4-boʻlim). Mezonlar: `prds/qarz-daftari.md` → 10,
// 10a, 10b, 10c, 12, 20, 21, 37, 38, 39, 41, 43, 44. Qarorlar: 0023, 0033, 0034, 0035,
// 0042, 0049, 0052, 0061.

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { bugun } from '../domain/sana.ts'
import type { Kontakt, Natija, Qarz, Tolov, YangiTolov } from '../domain/turlar.ts'
import { TolovForma } from './TolovForma.tsx'

const AKMAL: Kontakt = { id: 'k1', ism: 'Akmal', yaratilgan: '2026-08-17T09:00:00.000Z' }

function qarz(qism: Partial<Qarz> = {}): Qarz {
  return {
    id: 'q1',
    yaratilgan: '2026-08-17T09:00:00.000Z',
    kontaktId: 'k1',
    yonalishi: 'berdim',
    summa: 1000000,
    valyuta: 'som',
    sana: bugun(),
    hisob: 'karta',
    ...qism,
  }
}

function tolov(qism: Partial<Tolov> & { id: string }): Tolov {
  return {
    yaratilgan: '2026-08-17T10:00:00.000Z',
    qarzId: 'q1',
    summa: 300000,
    valyuta: 'som',
    sana: bugun(),
    hisob: 'karta',
    ...qism,
  } as Tolov
}

type Ustama = {
  qarz?: Qarz
  tolovlar?: readonly Tolov[]
}

function chiz(ustama: Ustama = {}) {
  const saqla = vi.fn(
    async (yangi: YangiTolov): Promise<Natija<Tolov>> => ({
      ok: true,
      qiymat: { ...yangi, id: 't1', yaratilgan: 'v' },
    }),
  )
  const yop = vi.fn()
  const natija = render(
    <TolovForma
      kontakt={AKMAL}
      qarz={ustama.qarz ?? qarz()}
      tolovlar={ustama.tolovlar ?? []}
      saqla={saqla}
      yop={yop}
    />,
  )
  return { saqla, yop, odam: userEvent.setup(), ...natija }
}

function tugma(nom: string): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

function summaMaydoni(): HTMLInputElement {
  return screen.getByLabelText('Summa') as HTMLInputElement
}

function kursMaydoni(): HTMLInputElement {
  return screen.getByLabelText('Kurs — 1 dollar necha soʻm') as HTMLInputElement
}

afterEach(cleanup)

describe('koʻrinish (dizayn 4-boʻlim: «Nima koʻrinadi»)', () => {
  it('sarlavha «Toʻlov» va `×`', () => {
    chiz()
    expect(screen.getByRole('heading', { name: 'Toʻlov', level: 1 })).toBeDefined()
    expect(tugma('Yopish')).toBeDefined()
  })

  it('qarz qatori: kontakt ismi va qoldiq ishorasiz, qarz valyutasida', () => {
    chiz({ tolovlar: [tolov({ id: 't0' })] })
    expect(screen.getByText('Kontakt: Akmal')).toBeDefined()
    expect(screen.getByText('Qarz qoldigʻi: 700 000 soʻm')).toBeDefined()
  })

  it('yoʻnalish segmenti yoʻq — u qarzdan olinadi', () => {
    chiz()
    expect(screen.queryByRole('button', { name: 'Berdim' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Oldim' })).toBeNull()
  })

  it('mezon 21 — sana tanlagichi bugundan keyingi kunni bermaydi (0034)', () => {
    chiz()
    expect((screen.getByLabelText('Sana') as HTMLInputElement).max).toBe(bugun())
  })
})

describe('valyuta va kurs (mezon 12; 0023)', () => {
  it('mezon 12 — ochilganda qarz valyutasi tanlangan va kurs soʻralmaydi', () => {
    chiz({ qarz: qarz({ valyuta: 'dollar', summa: 10000 }) })
    expect(tugma('dollar').getAttribute('aria-pressed')).toBe('true')
    expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()
  })

  it('boshqa valyuta tanlansa kurs maydoni ochiladi, namunasi bilan', async () => {
    const { odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 10000 }) })
    await odam.click(tugma('soʻm'))
    expect(kursMaydoni()).toBeDefined()
    expect(kursMaydoni().placeholder).toBe('12 500')
    expect(kursMaydoni().value).toBe('')
  })

  it('qarz valyutasiga qaytilsa kurs maydoni yopiladi va kiritilgani unutiladi', async () => {
    const { odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 10000 }) })
    await odam.click(tugma('soʻm'))
    await odam.type(kursMaydoni(), '12500')
    await odam.click(tugma('dollar'))
    expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()

    await odam.click(tugma('soʻm'))
    expect(kursMaydoni().value).toBe('')
  })

  it('mezon 10b — kursda kasr belgisi maydonga tushmaydi', async () => {
    const { odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 10000 }) })
    await odam.click(tugma('soʻm'))
    await odam.type(kursMaydoni(), '12500,25')
    expect(kursMaydoni().value).toBe('1 250 025')
  })

  it('mezon 10b — kasrli matn yopishtirilsa kasr kesiladi va yordam qatori chiqadi', async () => {
    const { odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 10000 }) })
    await odam.click(tugma('soʻm'))
    await odam.click(kursMaydoni())
    await odam.paste('12 500,25')
    expect(kursMaydoni().value).toBe('12 500')
    expect(screen.getByText('Kurs butun soʻmda — kasr qismi olib tashlandi.')).toBeDefined()
  })
})

describe('yordam qatorlari (0061; mezon 43, 44)', () => {
  it('mezon 43 — «Berdim» qarzida pul tanlangan hisobga tushadi', async () => {
    const { odam } = chiz({ qarz: qarz({ yonalishi: 'berdim' }) })
    expect(screen.getByText('Pul kartaga tushadi.')).toBeDefined()
    await odam.click(tugma('Naqd'))
    expect(screen.getByText('Pul naqdga tushadi.')).toBeDefined()
  })

  it('mezon 43 — «Oldim» qarzida pul tanlangan hisobdan chiqadi', async () => {
    const { odam } = chiz({ qarz: qarz({ yonalishi: 'oldim' }) })
    expect(screen.getByText('Pul kartadan chiqadi.')).toBeDefined()
    await odam.click(tugma('Naqd'))
    expect(screen.getByText('Pul naqddan chiqadi.')).toBeDefined()
  })

  it('mezon 44 — «Qarzdan ayiriladi» qatori 0042 yaxlitlashini koʻrsatadi', async () => {
    const { odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 100000 }) })
    await odam.click(tugma('soʻm'))
    await odam.type(summaMaydoni(), '100001')
    await odam.type(kursMaydoni(), '12500')
    expect(screen.getByText('Qarzdan ayiriladi: 8,00 $')).toBeDefined()
  })

  it('mezon 10a — 100 100 soʻm yuqoriga yaxlitlanadi: 8,01 $', async () => {
    const { odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 100000 }) })
    await odam.click(tugma('soʻm'))
    await odam.type(summaMaydoni(), '100100')
    await odam.type(kursMaydoni(), '12500')
    expect(screen.getByText('Qarzdan ayiriladi: 8,01 $')).toBeDefined()
  })

  it('summa yoki kurs boʻsh boʻlsa qator umuman chizilmaydi', async () => {
    const { odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 100000 }) })
    await odam.click(tugma('soʻm'))
    expect(screen.queryByText(/Qarzdan ayiriladi/)).toBeNull()
    await odam.type(summaMaydoni(), '100001')
    expect(screen.queryByText(/Qarzdan ayiriladi/)).toBeNull()
  })
})

describe('saqlash va xatolar (mezon 10, 10c, 20, 37, 38, 39, 41; 0049, 0061)', () => {
  it('mezon 10 — 625 000 soʻm toʻlov 12 500 kurs bilan saqlanadi', async () => {
    const { saqla, yop, odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 10000 }) })
    await odam.click(tugma('soʻm'))
    await odam.type(summaMaydoni(), '625000')
    await odam.type(kursMaydoni(), '12500')
    await odam.click(tugma('Saqlash'))

    expect(saqla).toHaveBeenCalledWith({
      qarzId: 'q1',
      summa: 625000,
      valyuta: 'som',
      sana: bugun(),
      hisob: 'karta',
      kurs: 12500,
    })
    expect(yop).toHaveBeenCalledTimes(1)
  })

  it('summa boʻsh boʻlsa «Summani kiriting.»', async () => {
    const { saqla, odam } = chiz()
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Summani kiriting.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })

  it('mezon 20 — nol summali toʻlov saqlanmaydi', async () => {
    const { saqla, odam } = chiz()
    await odam.type(summaMaydoni(), '0')
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Summa noldan katta boʻlsin.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })

  it('boshqa valyuta tanlangan, kurs boʻsh — «Kursni kiriting…»', async () => {
    const { saqla, odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 10000 }) })
    await odam.click(tugma('soʻm'))
    await odam.type(summaMaydoni(), '625000')
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Kursni kiriting — 1 dollar necha soʻm.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })

  it('mezon 10c — kurs `0` bilan toʻlov saqlanmaydi va «Kurs notoʻgʻri» chiqadi', async () => {
    const { saqla, odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 10000 }) })
    await odam.click(tugma('soʻm'))
    await odam.type(summaMaydoni(), '625000')
    await odam.type(kursMaydoni(), '0')
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Kurs notoʻgʻri')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })

  it('mezon 37 — chegara ichida oshgan toʻlov qabul qilinadi (700 100 soʻm)', async () => {
    const { saqla, odam } = chiz({ tolovlar: [tolov({ id: 't0' })] })
    await odam.type(summaMaydoni(), '700100')
    await odam.click(tugma('Saqlash'))
    expect(saqla.mock.calls[0]?.[0]).toMatchObject({ summa: 700100 })
  })

  it('mezon 38 — chegaradan koʻp oshgan toʻlov rad etiladi (700 101 soʻm)', async () => {
    const { saqla, odam } = chiz({ tolovlar: [tolov({ id: 't0' })] })
    await odam.type(summaMaydoni(), '700101')
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Toʻlov qarz qoldigʻidan katta.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
    expect(summaMaydoni().getAttribute('aria-invalid')).toBe('true')
  })

  it('mezon 39 — dollarda 50,01 $ qabul, 50,02 $ rad', async () => {
    const dollarQarz = qarz({ valyuta: 'dollar', summa: 5000 })
    const { saqla, odam } = chiz({ qarz: dollarQarz })
    await odam.type(summaMaydoni(), '50,01')
    await odam.click(tugma('Saqlash'))
    expect(saqla.mock.calls[0]?.[0]).toMatchObject({ summa: 5001 })

    cleanup()
    const ikkinchi = chiz({ qarz: dollarQarz })
    await ikkinchi.odam.type(summaMaydoni(), '50,02')
    await ikkinchi.odam.click(tugma('Saqlash'))
    expect(screen.getByText('Toʻlov qarz qoldigʻidan katta.')).toBeDefined()
    expect(ikkinchi.saqla).not.toHaveBeenCalled()
  })

  it('mezon 41 — aylantirilganda nolga aylanadigan toʻlov rad etiladi', async () => {
    const { saqla, odam } = chiz({ qarz: qarz({ valyuta: 'dollar', summa: 10000 }) })
    await odam.click(tugma('soʻm'))
    await odam.type(summaMaydoni(), '1')
    await odam.type(kursMaydoni(), '12500')
    await odam.click(tugma('Saqlash'))
    expect(
      screen.getByText('Toʻlov juda kichik — qarz valyutasida nolga aylanadi.'),
    ).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })

  it('`×` formani yopadi va hech narsa saqlanmaydi', async () => {
    const { saqla, yop, odam } = chiz()
    await odam.type(summaMaydoni(), '1000')
    await odam.click(tugma('Yopish'))
    expect(yop).toHaveBeenCalledTimes(1)
    expect(saqla).not.toHaveBeenCalled()
  })

  it('summa maydoni qoldiq bilan oldindan toʻldirilmaydi (dizayn)', () => {
    chiz({ tolovlar: [tolov({ id: 't0' })] })
    expect(summaMaydoni().value).toBe('')
    expect(screen.queryByRole('button', { name: /hammasini/i })).toBeNull()
  })
})
