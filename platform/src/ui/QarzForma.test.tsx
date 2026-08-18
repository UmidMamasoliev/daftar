// «Yangi qarz» / «Qarzni tahrirlash» formasi — ekran darajasidagi testlar.
//
// Tavsif: `design/qarz-daftari.md` (3-boʻlim). Mezonlar: `prds/qarz-daftari.md` → 3, 4,
// 19, 20, 21, 27, 31, 32, 33a, 33c, 45, 46, 47. Qarorlar: 0023, 0033, 0034, 0035, 0042,
// 0044, 0049, 0059, 0062.
//
// Doʻkon bu yerda yoʻq: saqlash chaqiruv boʻlib beriladi va u `Natija` qaytaradi —
// doʻkonning oʻz xatolari (valyuta muzlatilgani, summa toʻlovlardan kichikligi) shu
// yoʻl bilan ekranga chiqadi.

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { bugun, kunMatni } from '../domain/sana.ts'
import type { Kontakt, Natija, Qarz, QarzFormasi } from '../domain/turlar.ts'
import { QarzForma } from './QarzForma.tsx'

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

type Ustama = {
  qarz?: Qarz
  tolovlarSoni?: number
  tolangan?: number
  natija?: Natija<Qarz>
}

function chiz(ustama: Ustama = {}) {
  // Doʻkonning tekshiruvli yoʻli (`qarzSaqla` / `qarzniTahrirla`) formaning **oʻzini**
  // qabul qiladi: kontaktni va qarz toʻlovlarini u qayta oʻqiydi, shuning uchun 0030,
  // 0059 va 0061e chegaralari eskirgan ekran holatiga emas, bazadagi holatga qoʻyiladi.
  const saqla = vi.fn(
    async (kelgan: QarzFormasi): Promise<Natija<Qarz>> =>
      ustama.natija ?? {
        ok: true,
        qiymat: {
          ...qarz(),
          kontaktId: kelgan.kontaktId,
          sana: kelgan.sana,
          hisob: kelgan.hisob,
          valyuta: kelgan.valyuta,
        },
      },
  )
  const yop = vi.fn()
  const natija = render(
    <QarzForma
      kontakt={AKMAL}
      qarz={ustama.qarz}
      tolovlarSoni={ustama.tolovlarSoni ?? 0}
      tolangan={ustama.tolangan ?? 0}
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

afterEach(cleanup)

describe('koʻrinish (dizayn 3-boʻlim: «Nima koʻrinadi»)', () => {
  it('sarlavha «Yangi qarz» va `×`', () => {
    chiz()
    expect(screen.getByRole('heading', { name: 'Yangi qarz', level: 1 })).toBeDefined()
    expect(tugma('Yopish')).toBeDefined()
  })

  it('kontakt qatori matn boʻlib turadi — maydon emas, bosilmaydi', () => {
    chiz()
    expect(screen.getByText('Kontakt: Akmal')).toBeDefined()
    expect(screen.queryByRole('button', { name: /Akmal/ })).toBeNull()
  })

  it('mezon 45 — ochilganda yoʻnalish tanlanmagan, hisob «Karta», valyuta «soʻm», sana bugun', () => {
    chiz()
    expect(tugma('Berdim').getAttribute('aria-pressed')).toBe('false')
    expect(tugma('Oldim').getAttribute('aria-pressed')).toBe('false')
    expect(tugma('Karta').getAttribute('aria-pressed')).toBe('true')
    expect(tugma('soʻm').getAttribute('aria-pressed')).toBe('true')
    expect((screen.getByLabelText('Sana') as HTMLInputElement).value).toBe(bugun())
    expect(screen.getByText('Bugun')).toBeDefined()
  })

  it('mezon 47 — dollar tanlanganda ham kurs maydoni yoʻq (0044; 15d-band)', async () => {
    const { odam } = chiz()
    expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()
    await odam.click(tugma('dollar'))
    expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()
    expect(screen.getByText('$')).toBeDefined()
  })

  it('izoh maydoni yoʻq — specda qarzda izoh yoʻq', () => {
    chiz()
    expect(screen.queryByLabelText('Izoh')).toBeNull()
  })

  it('mezon 21 — sana tanlagichi bugundan keyingi kunni bermaydi (0034)', () => {
    chiz()
    expect((screen.getByLabelText('Sana') as HTMLInputElement).max).toBe(bugun())
  })
})

describe('terish qoidalari (mezon 19, 20; 0033)', () => {
  it('mezon 19 — soʻmda kasr belgisi maydonga tushmaydi', async () => {
    const { odam } = chiz()
    await odam.type(summaMaydoni(), '12,50')
    expect(summaMaydoni().value).toBe('1 250')
  })

  it('mezon 19 — dollarda ikki kasrgacha qabul qilinadi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('dollar'))
    await odam.type(summaMaydoni(), '12,50')
    expect(summaMaydoni().value).toBe('12,50')
  })

  it('terish paytida mingliklar ajratiladi', async () => {
    const { odam } = chiz()
    await odam.type(summaMaydoni(), '1000000')
    expect(summaMaydoni().value).toBe('1 000 000')
  })

  it('dollardan soʻmga oʻtilsa tiyin kesiladi va yordam qatori chiqadi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('dollar'))
    await odam.type(summaMaydoni(), '12,50')
    await odam.click(tugma('soʻm'))
    expect(summaMaydoni().value).toBe('12')
    expect(screen.getByText('Soʻmda tiyin yoʻq — kasr qismi olib tashlandi.')).toBeDefined()
  })
})

describe('saqlash (mezon 3, 4, 20, 46; 0062)', () => {
  it('mezon 3 — «Berdim» yoʻnalishida qarz saqlanadi', async () => {
    const { saqla, yop, odam } = chiz()
    await odam.type(summaMaydoni(), '1000000')
    await odam.click(tugma('Berdim'))
    await odam.click(tugma('Saqlash'))

    // Forma doʻkonga oʻz qiymatlarini beradi — oʻqish va tekshirish doʻkonniki.
    expect(saqla).toHaveBeenCalledWith({
      kontaktId: 'k1',
      yonalishi: 'berdim',
      summa: '1 000 000',
      valyuta: 'som',
      sana: bugun(),
      hisob: 'karta',
    })
    expect(yop).toHaveBeenCalledTimes(1)
  })

  it('mezon 4 — «Oldim» yoʻnalishida qarz saqlanadi', async () => {
    const { saqla, odam } = chiz()
    await odam.type(summaMaydoni(), '5000')
    await odam.click(tugma('Oldim'))
    await odam.click(tugma('Saqlash'))
    expect(saqla.mock.calls[0]?.[0]).toMatchObject({ yonalishi: 'oldim', summa: '5 000' })
  })

  it('mezon 46 — yoʻnalish tanlanmasdan saqlashga urinish rad etiladi', async () => {
    const { saqla, yop, odam } = chiz()
    await odam.type(summaMaydoni(), '1000000')
    await odam.click(tugma('Saqlash'))

    expect(screen.getByText('Berdim yoki oldim ekanini tanlang.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
    expect(yop).not.toHaveBeenCalled()
  })

  it('summa boʻsh boʻlsa «Summani kiriting.»', async () => {
    const { saqla, odam } = chiz()
    await odam.click(tugma('Berdim'))
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Summani kiriting.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })

  it('mezon 20 — nol summali qarz saqlanmaydi', async () => {
    const { saqla, odam } = chiz()
    await odam.type(summaMaydoni(), '0')
    await odam.click(tugma('Berdim'))
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Summa noldan katta boʻlsin.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })

  it('maydon tuzatilishi bilan xato yoʻqoladi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Berdim yoki oldim ekanini tanlang.')).toBeDefined()
    await odam.click(tugma('Berdim'))
    expect(screen.queryByText('Berdim yoki oldim ekanini tanlang.')).toBeNull()
  })

  it('`×` formani yopadi va hech narsa saqlanmaydi', async () => {
    const { saqla, yop, odam } = chiz()
    await odam.type(summaMaydoni(), '1000')
    await odam.click(tugma('Yopish'))
    expect(yop).toHaveBeenCalledTimes(1)
    expect(saqla).not.toHaveBeenCalled()
  })
})

describe('tahrirlash rejimi (0059; mezon 27, 30, 31)', () => {
  it('sarlavha «Qarzni tahrirlash» va maydonlar toʻldirilgan ochiladi', () => {
    chiz({ qarz: qarz({ yonalishi: 'oldim', hisob: 'naqd', sana: '2026-08-14' }) })
    expect(screen.getByRole('heading', { name: 'Qarzni tahrirlash', level: 1 })).toBeDefined()
    expect(summaMaydoni().value).toBe('1 000 000')
    expect(tugma('Oldim').getAttribute('aria-pressed')).toBe('true')
    expect(tugma('Naqd').getAttribute('aria-pressed')).toBe('true')
    expect((screen.getByLabelText('Sana') as HTMLInputElement).value).toBe('2026-08-14')
  })

  it('dollardagi qarz summasi ikki kasr bilan toʻldiriladi', () => {
    chiz({ qarz: qarz({ summa: 10000, valyuta: 'dollar' }) })
    expect(summaMaydoni().value).toBe('100,00')
    expect(tugma('dollar').getAttribute('aria-pressed')).toBe('true')
  })

  it('formada «Oʻchirish» tugmasi yoʻq — oʻchirish kartochkadan (0032 naqshi)', () => {
    chiz({ qarz: qarz() })
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })

  it('kontakt qatori tahrirlashda ham oʻzgarmaydi — qarz koʻchirilmaydi', () => {
    chiz({ qarz: qarz() })
    expect(screen.getByText('Kontakt: Akmal')).toBeDefined()
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('mezon 31 — toʻlovi yoʻq qarzda valyuta erkin oʻzgaradi', async () => {
    const { saqla, odam } = chiz({ qarz: qarz(), tolovlarSoni: 0 })
    expect(screen.queryByText('Toʻlovi bor qarzda valyuta oʻzgarmaydi — avval toʻlovlarni oʻchiring.')).toBeNull()

    await odam.click(tugma('dollar'))
    expect(tugma('dollar').getAttribute('aria-pressed')).toBe('true')

    await odam.clear(summaMaydoni())
    await odam.type(summaMaydoni(), '100,00')
    await odam.click(tugma('Saqlash'))
    expect(saqla.mock.calls[0]?.[0]).toMatchObject({ valyuta: 'dollar', summa: '100,00' })
  })
})

describe('toʻlovi bor qarzda valyuta muzlatilgan (0059; mezon 32)', () => {
  it('qarz valyutasi tanlangan koʻrinishida qoladi, ikkinchisi oʻchiq', () => {
    chiz({ qarz: qarz(), tolovlarSoni: 1 })
    expect(tugma('soʻm').getAttribute('aria-pressed')).toBe('true')
    expect((tugma('dollar') as HTMLButtonElement).disabled).toBe(true)
    expect((tugma('soʻm') as HTMLButtonElement).disabled).toBe(true)
  })

  it('bosilganda hech narsa oʻzgarmaydi va qizil xato chiqmaydi', async () => {
    const { odam } = chiz({ qarz: qarz(), tolovlarSoni: 2 })
    await odam.click(tugma('dollar'))
    expect(tugma('soʻm').getAttribute('aria-pressed')).toBe('true')
    expect(tugma('dollar').getAttribute('aria-pressed')).toBe('false')
    expect(screen.queryByText(/notoʻgʻri/)).toBeNull()
  })

  it('chiplar ostida yoʻlni koʻrsatuvchi yordam qatori turadi', () => {
    chiz({ qarz: qarz(), tolovlarSoni: 1 })
    expect(
      screen.getByText('Toʻlovi bor qarzda valyuta oʻzgarmaydi — avval toʻlovlarni oʻchiring.'),
    ).toBeDefined()
  })

  it('yangi qarz formasida yordam qatori yoʻq', () => {
    chiz()
    expect(
      screen.queryByText('Toʻlovi bor qarzda valyuta oʻzgarmaydi — avval toʻlovlarni oʻchiring.'),
    ).toBeNull()
  })
})

describe('doʻkon xatosi: summa toʻlovlardan kichik (0061e; mezon 33a, 33c)', () => {
  const rad: Natija<Qarz> = {
    ok: false,
    xatolar: [
      {
        maydon: 'summa',
        kod: 'qarz-summa-tolovdan-kam',
        xabar: 'Qarz summasi toʻlovlardan kichik — toʻlangan: 300000.',
      },
    ],
  }

  it('mezon 33a — xato toʻlangan yigʻindini qarz valyutasida, ekran formatida aytadi', async () => {
    const { yop, odam } = chiz({
      qarz: qarz(),
      tolovlarSoni: 1,
      tolangan: 300000,
      natija: rad,
    })
    await odam.clear(summaMaydoni())
    await odam.type(summaMaydoni(), '299899')
    await odam.click(tugma('Saqlash'))

    expect(
      await screen.findByText('Qarz summasi toʻlovlardan kichik — toʻlangan: 300 000 soʻm.'),
    ).toBeDefined()
    expect(yop).not.toHaveBeenCalled()
    expect(summaMaydoni().getAttribute('aria-invalid')).toBe('true')
  })

  it('mezon 33c — dollar qarzida raqam sentlar bilan koʻrsatiladi', async () => {
    const { odam } = chiz({
      qarz: qarz({ summa: 10000, valyuta: 'dollar' }),
      tolovlarSoni: 1,
      tolangan: 5000,
      natija: rad,
    })
    await odam.clear(summaMaydoni())
    await odam.type(summaMaydoni(), '49,98')
    await odam.click(tugma('Saqlash'))

    expect(
      await screen.findByText('Qarz summasi toʻlovlardan kichik — toʻlangan: 50,00 $.'),
    ).toBeDefined()
  })
})

describe('kelajak sanasi (0034; mezon 21)', () => {
  it('qurilma kelajak sanasini bersa ham qarz saqlanmaydi', async () => {
    const ertaga = new Date()
    ertaga.setDate(ertaga.getDate() + 1)
    const { saqla, odam } = chiz()

    await odam.type(summaMaydoni(), '1000')
    await odam.click(tugma('Berdim'))
    const sana = screen.getByLabelText('Sana') as HTMLInputElement
    sana.max = ''
    await odam.clear(sana)
    await odam.type(sana, kunMatni(ertaga))
    await odam.click(tugma('Saqlash'))

    expect(screen.getByText('Sana bugundan keyin boʻlmaydi.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })
})

describe('«Saqlash» tez ikki marta bosilsa (QA topilmasi)', () => {
  /** Ikki bosish orasida hech narsa kutilmaydi — barmoq dblclick shunday keladi. */
  function ikkiMartaBosdi(nom: string): void {
    const nishon = tugma(nom)
    fireEvent.click(nishon)
    fireEvent.click(nishon)
  }

  /** Boshlangan saqlash tugasin — keyin natija sanaladi. */
  async function tugasin(): Promise<void> {
    await act(async () => {})
  }

  it('bitta niyat bitta qarz boʻladi — doʻkon bir marta chaqiriladi', async () => {
    const { saqla, yop, odam } = chiz()
    await odam.type(summaMaydoni(), '1000000')
    await odam.click(tugma('Berdim'))

    ikkiMartaBosdi('Saqlash')
    await tugasin()

    expect(saqla).toHaveBeenCalledTimes(1)
    expect(yop).toHaveBeenCalledTimes(1)
  })

  it('doʻkon rad etsa tugma yana bosiladi — ikkinchi urinish doʻkonga yetadi', async () => {
    const { saqla, yop, odam } = chiz({
      qarz: qarz(),
      tolovlarSoni: 1,
      tolangan: 300000,
      natija: {
        ok: false,
        xatolar: [
          {
            maydon: 'summa',
            kod: 'qarz-summa-tolovdan-kam',
            xabar: 'Qarz summasi toʻlovlardan kichik — toʻlangan: 300000.',
          },
        ],
      },
    })
    await odam.clear(summaMaydoni())
    await odam.type(summaMaydoni(), '299899')

    await odam.click(tugma('Saqlash'))
    expect(saqla).toHaveBeenCalledTimes(1)
    expect(yop).not.toHaveBeenCalled()

    await odam.click(tugma('Saqlash'))
    expect(saqla).toHaveBeenCalledTimes(2)
  })

  it('tekshiruv xatosidan keyin ham tugma ishlashda davom etadi', async () => {
    const { saqla, odam } = chiz()

    // Yoʻnalish tanlanmagan — tekshiruv toʻxtatadi, doʻkonga borilmaydi.
    await odam.type(summaMaydoni(), '1000000')
    await odam.click(tugma('Saqlash'))
    expect(saqla).not.toHaveBeenCalled()

    await odam.click(tugma('Berdim'))
    await odam.click(tugma('Saqlash'))
    expect(saqla).toHaveBeenCalledTimes(1)
  })
})
