// «Yangi yozuv» formasi — ekran darajasidagi testlar.
//
// Tavsif: `design/kirim-chiqim.md` (1-boʻlim) va `design/uslub.md`.
// Mezonlar: `prds/kirim-chiqim.md` → 1, 2, 3, 3a, 4, 4a, 4b, 4c, 4d, 5, 6, 6a, 7, 16.
// Kategoriyalar doʻkonsiz keladi — roʻyxat props orqali beriladi.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bugun, kunMatni } from '../domain/sana.ts'
import type { YangiYozuv, Yozuv } from '../domain/turlar.ts'
import type { KategoriyaRoyxati } from './YozuvForma.tsx'
import { YozuvForma } from './YozuvForma.tsx'

const KATEGORIYALAR: KategoriyaRoyxati = {
  chiqim: [
    { id: 'k-oziq', nom: 'oziq-ovqat' },
    { id: 'k-transport', nom: 'transport' },
  ],
  kirim: [{ id: 'k-oylik', nom: 'oylik' }],
}

const surildi = vi.fn()

type Ustama = {
  yozuv?: Yozuv
  yop?: () => void
  kategoriyalar?: KategoriyaRoyxati
}

function chiz(ustama: Ustama = {}) {
  const saqla = vi.fn(async (_yangi: YangiYozuv): Promise<void> => {})
  render(
    <YozuvForma
      kategoriyalar={ustama.kategoriyalar ?? KATEGORIYALAR}
      saqla={saqla}
      yozuv={ustama.yozuv}
      yop={ustama.yop}
    />,
  )
  return { saqla, odam: userEvent.setup() }
}

function tugma(nom: string): HTMLButtonElement {
  return screen.getByRole('button', { name: nom }) as HTMLButtonElement
}

function maydon(nom: string): HTMLInputElement {
  return screen.getByLabelText(nom) as HTMLInputElement
}

function kechagiKun(): string {
  const vaqt = new Date()
  vaqt.setDate(vaqt.getDate() - 1)
  return kunMatni(vaqt)
}

beforeEach(() => {
  surildi.mockClear()
  Element.prototype.scrollIntoView = surildi
})

afterEach(cleanup)

describe('forma ochilgandagi holat (mezon 3)', () => {
  it('sarlavha «Yangi yozuv» boʻladi', () => {
    chiz()
    expect(screen.getByRole('heading', { name: 'Yangi yozuv' })).toBeDefined()
  })

  it('sana bugungi kun boʻladi va tugmada «Bugun» yozuvi turadi', () => {
    chiz()
    expect(maydon('Sana').value).toBe(bugun())
    expect(screen.getByText('Bugun')).toBeDefined()
  })

  it('hisob «Karta», valyuta «soʻm» boʻlib turadi', () => {
    chiz()
    expect(tugma('Karta').getAttribute('aria-pressed')).toBe('true')
    expect(tugma('Naqd').getAttribute('aria-pressed')).toBe('false')
    expect(tugma('soʻm').getAttribute('aria-pressed')).toBe('true')
    expect(tugma('dollar').getAttribute('aria-pressed')).toBe('false')
  })

  it('tur tanlanmagan boʻladi (0050)', () => {
    chiz()
    expect(tugma('Chiqim').getAttribute('aria-pressed')).toBe('false')
    expect(tugma('Kirim').getAttribute('aria-pressed')).toBe('false')
  })

  it('tur tanlanmaguncha chip oʻrnida yordam qatori turadi', () => {
    chiz()
    expect(screen.getByText('Avval kirim yoki chiqim tanlang.')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'oziq-ovqat' })).toBeNull()
  })

  it('kurs maydoni koʻrinmaydi (mezon 7)', () => {
    chiz()
    expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()
  })

  it('summa maydoni boʻsh va oʻngida «soʻm» soʻzi turadi', () => {
    chiz()
    expect(maydon('Summa').value).toBe('')
    expect(screen.getByText('soʻm', { selector: '.valyuta-sozi' })).toBeDefined()
  })
})

describe('sana tanlagichi (mezon 4, 4a)', () => {
  it('ertangi va undan keyingi kunlar tanlanmaydi — `max` bugungi kun', () => {
    chiz()
    expect(maydon('Sana').getAttribute('max')).toBe(bugun())
  })

  it('oʻtgan kunga oʻzgartirilsa yozuv oʻsha sana bilan saqlanadi', async () => {
    const { saqla, odam } = chiz()
    const kecha = kechagiKun()

    await odam.type(maydon('Summa'), '45000')
    await odam.click(tugma('Chiqim'))
    await odam.click(tugma('oziq-ovqat'))
    fireEvent.change(maydon('Sana'), { target: { value: kecha } })
    expect(screen.getByText('Kecha')).toBeDefined()

    await odam.click(tugma('Saqlash'))
    expect(saqla.mock.calls[0]?.[0].sana).toBe(kecha)
  })
})

describe('valyuta va kurs (mezon 6, 7)', () => {
  it('«dollar» tanlansa kurs maydoni ochiladi va boʻsh turadi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('dollar'))

    const kurs = maydon('Kurs — 1 dollar necha soʻm')
    expect(kurs.value).toBe('')
    expect(kurs.getAttribute('placeholder')).toBe('12 500')
    expect(screen.getByText('$', { selector: '.valyuta-sozi' })).toBeDefined()
  })

  it('«soʻm» ga qaytilsa kurs maydoni yopiladi va kiritilgani unutiladi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('dollar'))
    await odam.type(maydon('Kurs — 1 dollar necha soʻm'), '12500')
    await odam.click(tugma('soʻm'))
    expect(screen.queryByLabelText('Kurs — 1 dollar necha soʻm')).toBeNull()

    await odam.click(tugma('dollar'))
    expect(maydon('Kurs — 1 dollar necha soʻm').value).toBe('')
  })

  it('soʻmdagi yozuvda kurs saqlanmaydi (mezon 7)', async () => {
    const { saqla, odam } = chiz()
    await odam.click(tugma('dollar'))
    await odam.type(maydon('Kurs — 1 dollar necha soʻm'), '12500')
    await odam.click(tugma('soʻm'))

    await odam.type(maydon('Summa'), '45000')
    await odam.click(tugma('Chiqim'))
    await odam.click(tugma('oziq-ovqat'))
    await odam.click(tugma('Saqlash'))

    expect(saqla.mock.calls[0]?.[0]).toEqual({
      turi: 'chiqim',
      summa: 45000,
      kategoriyaId: 'k-oziq',
      sana: bugun(),
      hisob: 'karta',
      valyuta: 'som',
    })
  })

  it('kurs terilayotganda mingliklar boʻsh joy bilan ajratiladi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('dollar'))
    await odam.type(maydon('Kurs — 1 dollar necha soʻm'), '12500')
    expect(maydon('Kurs — 1 dollar necha soʻm').value).toBe('12 500')
  })
})

describe('maydonga tushmaydigan belgilar (mezon 4b, 4d)', () => {
  it('manfiy ishora summa maydoniga umuman tushmaydi', async () => {
    const { odam } = chiz()
    await odam.type(maydon('Summa'), '-500')
    expect(maydon('Summa').value).toBe('500')
    expect(screen.queryByText('Summa noldan katta boʻlsin.')).toBeNull()
  })

  it('soʻmda kasrli matn yopishtirilsa kasr olinadi va sabab koʻrinadi (mezon 4b)', async () => {
    const { odam } = chiz()
    await odam.click(maydon('Summa'))
    await odam.paste('12,50')

    expect(maydon('Summa').value).toBe('12')
    expect(screen.getByText('Soʻmda tiyin yoʻq — butun son kiriting.')).toBeDefined()
  })

  it('dollarda ikki kasrli summa qabul qilinadi (mezon 4b)', async () => {
    const { saqla, odam } = chiz()
    await odam.click(tugma('dollar'))
    await odam.type(maydon('Summa'), '8,50')
    expect(maydon('Summa').value).toBe('8,50')

    await odam.type(maydon('Kurs — 1 dollar necha soʻm'), '12500')
    await odam.click(tugma('Kirim'))
    await odam.click(tugma('oylik'))
    await odam.click(tugma('Saqlash'))

    expect(saqla.mock.calls[0]?.[0]).toEqual({
      turi: 'kirim',
      summa: 850,
      kategoriyaId: 'k-oylik',
      sana: bugun(),
      hisob: 'karta',
      valyuta: 'dollar',
      kurs: 12500,
    })
  })

  it('dollardan soʻmga oʻtilganda kasr qismi olib tashlanadi va ogohlantiriladi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('dollar'))
    await odam.type(maydon('Summa'), '8,50')
    await odam.click(tugma('soʻm'))

    expect(maydon('Summa').value).toBe('8')
    expect(screen.getByText('Soʻmda tiyin yoʻq — kasr qismi olib tashlandi.')).toBeDefined()
  })

  it('kursga kasr belgisi tushmaydi va sabab koʻrinadi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('dollar'))
    await odam.click(maydon('Kurs — 1 dollar necha soʻm'))
    await odam.paste('12500,25')

    expect(maydon('Kurs — 1 dollar necha soʻm').value).toBe('12 500')
    expect(screen.getByText('Kurs butun soʻmda kiritiladi.')).toBeDefined()
  })
})

describe('«Saqlash» bosilgandagi xatolar (mezon 2, 3a, 4c, 6, 6a)', () => {
  it('boʻsh summa, tur va kategoriya uchun uchta sabab bir vaqtda koʻrinadi', async () => {
    const { saqla, odam } = chiz()
    await odam.click(tugma('Saqlash'))

    expect(screen.getByText('Summani kiriting.')).toBeDefined()
    expect(screen.getByText('Kirim yoki chiqim ekanini tanlang.')).toBeDefined()
    expect(screen.getByText('Kategoriyani tanlang.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })

  it('ekran birinchi xatoli maydonga suriladi va fokus oʻsha yerga tushadi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Saqlash'))

    expect(document.activeElement).toBe(maydon('Summa'))
    expect(surildi).toHaveBeenCalled()
  })

  it('summa toʻgʻri boʻlsa fokus birinchi qolgan xatoli maydonga tushadi', async () => {
    const { odam } = chiz()
    await odam.type(maydon('Summa'), '45000')
    await odam.click(tugma('Saqlash'))

    expect(document.activeElement).toBe(tugma('Chiqim'))
  })

  it('terish paytida xato koʻrsatilmaydi', async () => {
    const { odam } = chiz()
    await odam.type(maydon('Summa'), '45000')
    expect(screen.queryByText('Kirim yoki chiqim ekanini tanlang.')).toBeNull()
  })

  it('maydon tuzatilishi bilan oʻsha xato yoʻqoladi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Saqlash'))
    expect(screen.getByText('Summani kiriting.')).toBeDefined()

    await odam.type(maydon('Summa'), '45000')
    expect(screen.queryByText('Summani kiriting.')).toBeNull()
    expect(screen.getByText('Kategoriyani tanlang.')).toBeDefined()
  })

  it('nol summa saqlanmaydi (mezon 4c)', async () => {
    const { saqla, odam } = chiz()
    await odam.type(maydon('Summa'), '0')
    await odam.click(tugma('Chiqim'))
    await odam.click(tugma('oziq-ovqat'))
    await odam.click(tugma('Saqlash'))

    expect(screen.getByText('Summa noldan katta boʻlsin.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })

  it('dollar tanlangan, kurs boʻsh — yozuv saqlanmaydi (mezon 6)', async () => {
    const { saqla, odam } = chiz()
    await odam.type(maydon('Summa'), '8,50')
    await odam.click(tugma('Kirim'))
    await odam.click(tugma('oylik'))
    await odam.click(tugma('dollar'))
    await odam.click(tugma('Saqlash'))

    expect(screen.getByText('Kursni kiriting — 1 dollar necha soʻm.')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(maydon('Kurs — 1 dollar necha soʻm'))
  })

  it('kurs `0` boʻlsa «Kurs notoʻgʻri» koʻrinadi (mezon 6a, 0049)', async () => {
    const { saqla, odam } = chiz()
    await odam.type(maydon('Summa'), '8,50')
    await odam.click(tugma('Kirim'))
    await odam.click(tugma('oylik'))
    await odam.click(tugma('dollar'))
    await odam.type(maydon('Kurs — 1 dollar necha soʻm'), '0')
    await odam.click(tugma('Saqlash'))

    expect(screen.getByText('Kurs notoʻgʻri')).toBeDefined()
    expect(saqla).not.toHaveBeenCalled()
  })
})

describe('kategoriya chiplari (mezon 16)', () => {
  it('tur tanlangach oʻsha turning kategoriyalari chiqadi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Chiqim'))

    expect(tugma('oziq-ovqat')).toBeDefined()
    expect(tugma('transport')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'oylik' })).toBeNull()
  })

  it('tur almashsa roʻyxat almashadi va tanlangan kategoriya bekor boʻladi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Chiqim'))
    await odam.click(tugma('oziq-ovqat'))
    expect(tugma('oziq-ovqat').getAttribute('aria-pressed')).toBe('true')

    await odam.click(tugma('Kirim'))
    expect(screen.queryByRole('button', { name: 'oziq-ovqat' })).toBeNull()
    expect(tugma('oylik').getAttribute('aria-pressed')).toBe('false')
  })

  it('koʻrinadigan kategoriya qolmasa yordam qatori turadi', async () => {
    const { odam } = chiz({ kategoriyalar: { kirim: [], chiqim: [] } })
    await odam.click(tugma('Chiqim'))

    expect(
      screen.getByText('Koʻrinadigan kategoriya yoʻq — «Boshqarish» dan bittasini koʻrsating.'),
    ).toBeDefined()
  })
})

describe('muvaffaqiyatli saqlash (mezon 1, 5)', () => {
  it('soʻmdagi chiqim uchta maydon bilan saqlanadi, izoh boʻsh boʻlsa ham', async () => {
    const { saqla, odam } = chiz()
    await odam.type(maydon('Summa'), '45000')
    await odam.click(tugma('Chiqim'))
    await odam.click(tugma('oziq-ovqat'))
    await odam.click(tugma('Saqlash'))

    expect(saqla).toHaveBeenCalledTimes(1)
    expect(saqla.mock.calls[0]?.[0]).toEqual({
      turi: 'chiqim',
      summa: 45000,
      kategoriyaId: 'k-oziq',
      sana: bugun(),
      hisob: 'karta',
      valyuta: 'som',
    })
  })

  it('izoh kiritilsa u ham saqlanadi', async () => {
    const { saqla, odam } = chiz()
    await odam.type(maydon('Summa'), '45000')
    await odam.click(tugma('Chiqim'))
    await odam.click(tugma('oziq-ovqat'))
    await odam.click(tugma('Naqd'))
    await odam.type(maydon('Izoh'), 'nonushta')
    await odam.click(tugma('Saqlash'))

    expect(saqla.mock.calls[0]?.[0]).toEqual({
      turi: 'chiqim',
      summa: 45000,
      kategoriyaId: 'k-oziq',
      sana: bugun(),
      hisob: 'naqd',
      izoh: 'nonushta',
      valyuta: 'som',
    })
  })

  it('saqlangach forma tozalanadi', async () => {
    const { odam } = chiz()
    await odam.type(maydon('Summa'), '45000')
    await odam.click(tugma('Chiqim'))
    await odam.click(tugma('oziq-ovqat'))
    await odam.type(maydon('Izoh'), 'nonushta')
    await odam.click(tugma('Saqlash'))

    expect(maydon('Summa').value).toBe('')
    expect(maydon('Izoh').value).toBe('')
    expect(tugma('Chiqim').getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByText('Avval kirim yoki chiqim tanlang.')).toBeDefined()
  })
})

describe('tahrirlash rejimi', () => {
  const dollarYozuv: Yozuv = {
    id: 'y-1',
    yaratilgan: '2026-08-16T09:00:00.000Z',
    turi: 'kirim',
    summa: 850,
    kategoriyaId: 'k-oylik',
    sana: '2026-08-14',
    hisob: 'naqd',
    izoh: 'avans',
    valyuta: 'dollar',
    kurs: 12500,
  }

  it('sarlavha «Yozuvni tahrirlash» boʻladi', () => {
    chiz({ yozuv: dollarYozuv })
    expect(screen.getByRole('heading', { name: 'Yozuvni tahrirlash' })).toBeDefined()
  })

  it('hamma maydon yozuvdagi qiymat bilan toʻldiriladi, kurs ham', () => {
    chiz({ yozuv: dollarYozuv })

    expect(maydon('Summa').value).toBe('8,50')
    expect(maydon('Kurs — 1 dollar necha soʻm').value).toBe('12 500')
    expect(maydon('Izoh').value).toBe('avans')
    expect(maydon('Sana').value).toBe('2026-08-14')
    expect(tugma('Kirim').getAttribute('aria-pressed')).toBe('true')
    expect(tugma('oylik').getAttribute('aria-pressed')).toBe('true')
    expect(tugma('Naqd').getAttribute('aria-pressed')).toBe('true')
    expect(tugma('dollar').getAttribute('aria-pressed')).toBe('true')
  })

  it('saqlangach oʻzgargan qiymat beriladi va forma yopiladi', async () => {
    const yop = vi.fn()
    const { saqla, odam } = chiz({ yozuv: dollarYozuv, yop })

    await odam.clear(maydon('Summa'))
    await odam.type(maydon('Summa'), '9,25')
    await odam.click(tugma('Saqlash'))

    expect(saqla.mock.calls[0]?.[0]).toEqual({
      turi: 'kirim',
      summa: 925,
      kategoriyaId: 'k-oylik',
      sana: '2026-08-14',
      hisob: 'naqd',
      izoh: 'avans',
      valyuta: 'dollar',
      kurs: 12500,
    })
    expect(yop).toHaveBeenCalledTimes(1)
  })

  it('bu ekranda «Oʻchirish» tugmasi yoʻq (0032)', () => {
    chiz({ yozuv: dollarYozuv })
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })
})

describe('yopish', () => {
  it('`×` bosilsa forma yopiladi va kiritilgani saqlanmaydi', async () => {
    const yop = vi.fn()
    const { saqla, odam } = chiz({ yop })

    await odam.type(maydon('Summa'), '45000')
    await odam.click(tugma('Yopish'))

    expect(yop).toHaveBeenCalledTimes(1)
    expect(saqla).not.toHaveBeenCalled()
  })
})
