// «Kategoriyalar» (boshqaruv) ekrani — ekran darajasidagi testlar.
//
// Tavsif: `design/kirim-chiqim.md` (3-boʻlim). Mezonlar: `prds/kirim-chiqim.md` → 13, 14,
// 14a, 14b, 15, 16. Qarorlar: 0013, 0028, 0051.
//
// Doʻkon bu yerda yoʻq: roʻyxat props orqali keladi, qoʻshish/yashirish/koʻrsatish esa
// chaqiruv boʻlib beriladi. Xato kodlari — KELISHUV 10-boʻlimdagi kalitlar.

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Kategoriya, Natija, YozuvTuri } from '../domain/turlar.ts'
import { Kategoriyalar } from './Kategoriyalar.tsx'

const CHIQIM_NOMLARI = [
  'oziq-ovqat',
  'transport',
  'ijara',
  'kommunal',
  'sogʻliq',
  'kiyim',
  'koʻngilochar',
  'boshqa',
]

function kategoriya(nom: string, turi: YozuvTuri, yashirilgan = false): Kategoriya {
  return { id: `${turi}-${nom}`, nom, turi, yashirilgan }
}

const TAYYOR: readonly Kategoriya[] = [
  ...CHIQIM_NOMLARI.map((nom) => kategoriya(nom, 'chiqim')),
  ...['oylik', 'qoʻshimcha daromad', 'sovgʻa'].map((nom) => kategoriya(nom, 'kirim')),
]

type Ustama = {
  kategoriyalar?: readonly Kategoriya[]
  boshlangichTur?: YozuvTuri
  qosh?: (nom: string, turi: YozuvTuri) => Promise<Natija<Kategoriya>>
  orqaga?: () => void
}

function chiz(ustama: Ustama = {}) {
  const qosh = vi.fn(
    ustama.qosh ??
      (async (nom: string, turi: YozuvTuri): Promise<Natija<Kategoriya>> => ({
        ok: true,
        qiymat: kategoriya(nom, turi),
      })),
  )
  const yashir = vi.fn(async (_id: string): Promise<void> => {})
  const korsat = vi.fn(async (_id: string): Promise<void> => {})
  render(
    <Kategoriyalar
      kategoriyalar={ustama.kategoriyalar ?? TAYYOR}
      boshlangichTur={ustama.boshlangichTur ?? 'chiqim'}
      qosh={qosh}
      yashir={yashir}
      korsat={korsat}
      orqaga={ustama.orqaga}
    />,
  )
  return { qosh, yashir, korsat, odam: userEvent.setup() }
}

function tugma(nom: string | RegExp): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

/** Qoʻshish qatorini ochib nom yozadi va «Qoʻshish» ni bosadi. */
async function qoshdi(odam: ReturnType<typeof chiz>['odam'], nom: string): Promise<void> {
  await odam.click(tugma('＋ Yangi kategoriya'))
  if (nom !== '') {
    await odam.type(screen.getByLabelText('Kategoriya nomi'), nom)
  }
  await odam.click(tugma('Qoʻshish'))
}

afterEach(cleanup)

describe('koʻrinish (mezon 15, 16; 0013, 0028)', () => {
  it('yuqorida «‹ Orqaga» va «Kategoriyalar» sarlavhasi turadi', () => {
    chiz()
    expect(screen.getByRole('heading', { name: 'Kategoriyalar', level: 1 })).toBeDefined()
    expect(tugma('‹ Orqaga')).toBeDefined()
  })

  it('formada tanlangan tur ochiq turadi', () => {
    chiz({ boshlangichTur: 'kirim' })
    expect(tugma('Kirim').getAttribute('aria-pressed')).toBe('true')
    expect(tugma('Chiqim').getAttribute('aria-pressed')).toBe('false')
  })

  it('tur tanlanmagan boʻlsa «Chiqim» ochiladi', () => {
    chiz({ boshlangichTur: 'chiqim' })
    expect(tugma('Chiqim').getAttribute('aria-pressed')).toBe('true')
  })

  it('mezon 15 — chiqimda sakkizta nom 0028 tartibida chiqadi', () => {
    chiz()
    const nomlar = screen.getAllByRole('listitem').map((q) => q.textContent ?? '')
    expect(nomlar).toHaveLength(8)
    CHIQIM_NOMLARI.forEach((nom, orin) => {
      expect(nomlar[orin]).toContain(nom)
    })
  })

  it('mezon 16 — segment almashsa kirim roʻyxati chiqadi', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Kirim'))

    const nomlar = screen.getAllByRole('listitem').map((q) => q.textContent ?? '')
    expect(nomlar).toHaveLength(3)
    expect(nomlar[0]).toContain('oylik')
    expect(screen.queryByText('oziq-ovqat')).toBeNull()
  })

  it('nomlar kichik harfda, oʻzgartirilmasdan koʻrsatiladi (0028)', () => {
    chiz()
    expect(screen.getByText('oziq-ovqat')).toBeDefined()
    expect(screen.getByText('sogʻliq')).toBeDefined()
  })

  it('har koʻrinadigan qatorda «Yashirish» tugmasi turadi', () => {
    chiz()
    expect(screen.getAllByRole('button', { name: 'Yashirish' })).toHaveLength(8)
  })

  it('kategoriyani oʻchirish tugmasi yoʻq — faqat yashirish (0013)', () => {
    chiz()
    expect(screen.queryByRole('button', { name: 'Oʻchirish' })).toBeNull()
  })

  it('yashirilgani boʻlmasa «Yashirilgan» boʻlimi umuman koʻrinmaydi', () => {
    chiz()
    expect(screen.queryByText('Yashirilgan')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Koʻrsatish' })).toBeNull()
  })

  it('yashirilgani boʻlsa alohida boʻlim va «Koʻrsatish» tugmasi chiqadi', () => {
    chiz({
      kategoriyalar: [kategoriya('oziq-ovqat', 'chiqim'), kategoriya('kiyim', 'chiqim', true)],
    })
    expect(screen.getByText('Yashirilgan')).toBeDefined()
    expect(tugma('Koʻrsatish')).toBeDefined()
    expect(screen.getAllByRole('button', { name: 'Yashirish' })).toHaveLength(1)
  })

  it('yashirilgan qator faqat oʻz turida koʻrinadi', async () => {
    const { odam } = chiz({
      kategoriyalar: [kategoriya('kiyim', 'chiqim', true), kategoriya('oylik', 'kirim')],
    })
    expect(screen.getByText('Yashirilgan')).toBeDefined()

    await odam.click(tugma('Kirim'))
    expect(screen.queryByText('Yashirilgan')).toBeNull()
  })
})

describe('yashirish va koʻrsatish (mezon 14)', () => {
  it('«Yashirish» bosilsa tasdiqsiz bajariladi va «qaytarish» paneli chiqmaydi', async () => {
    const { yashir, odam } = chiz({ kategoriyalar: [kategoriya('kiyim', 'chiqim')] })
    await odam.click(tugma('Yashirish'))

    expect(yashir).toHaveBeenCalledTimes(1)
    expect(yashir).toHaveBeenCalledWith('chiqim-kiyim')
    expect(screen.queryByRole('button', { name: 'QAYTARISH' })).toBeNull()
  })

  it('«Koʻrsatish» bosilsa kategoriya qaytariladi', async () => {
    const { korsat, odam } = chiz({ kategoriyalar: [kategoriya('kiyim', 'chiqim', true)] })
    await odam.click(tugma('Koʻrsatish'))

    expect(korsat).toHaveBeenCalledTimes(1)
    expect(korsat).toHaveBeenCalledWith('chiqim-kiyim')
  })
})

describe('qoʻshish qatori (mezon 13)', () => {
  it('boshida yoʻq, «＋ Yangi kategoriya» bosilganda ochiladi va fokus nomga tushadi', async () => {
    const { odam } = chiz()
    expect(screen.queryByLabelText('Kategoriya nomi')).toBeNull()

    await odam.click(tugma('＋ Yangi kategoriya'))
    const maydon = screen.getByLabelText('Kategoriya nomi')
    expect(maydon.getAttribute('placeholder')).toBe('Kategoriya nomi')
    expect(document.activeElement).toBe(maydon)
  })

  it('«Qoʻshish» nomni joriy tur bilan beradi va qator yopiladi', async () => {
    const { qosh, odam } = chiz()
    await qoshdi(odam, 'dorixona')

    expect(qosh).toHaveBeenCalledWith('dorixona', 'chiqim')
    expect(screen.queryByLabelText('Kategoriya nomi')).toBeNull()
  })

  it('kirim turida turgan boʻlsa nom kirimga qoʻshiladi (mezon 16)', async () => {
    const { qosh, odam } = chiz()
    await odam.click(tugma('Kirim'))
    await qoshdi(odam, 'ijara haqi')

    expect(qosh).toHaveBeenCalledWith('ijara haqi', 'kirim')
  })

  it('`×` bosilsa qator yopiladi va terilgani unutiladi', async () => {
    const { qosh, odam } = chiz()
    await odam.click(tugma('＋ Yangi kategoriya'))
    await odam.type(screen.getByLabelText('Kategoriya nomi'), 'dorixona')
    await odam.click(tugma('Yopish'))

    expect(screen.queryByLabelText('Kategoriya nomi')).toBeNull()
    expect(qosh).not.toHaveBeenCalled()

    await odam.click(tugma('＋ Yangi kategoriya'))
    expect((screen.getByLabelText('Kategoriya nomi') as HTMLInputElement).value).toBe('')
  })
})

describe('xato holatlari — matnlar dizayn faylidan (mezon 14a, 14b)', () => {
  function xatoQaytaradi(kod: 'kategoriya-nom-bosh' | 'kategoriya-takror' | 'kategoriya-yashirilgan') {
    return async (): Promise<Natija<Kategoriya>> => ({
      ok: false,
      xatolar: [{ maydon: 'nom', kod, xabar: 'doʻkon xabari' }],
    })
  }

  it('boʻsh nom: «Nom kiriting.»', async () => {
    const { odam } = chiz({ qosh: xatoQaytaradi('kategoriya-nom-bosh') })
    await qoshdi(odam, '')

    expect(screen.getByText('Nom kiriting.')).toBeDefined()
    expect(screen.getByLabelText('Kategoriya nomi')).toBeDefined()
  })

  it('koʻrinib turgan takror nom: «Bunday kategoriya bor.»', async () => {
    const { odam } = chiz({ qosh: xatoQaytaradi('kategoriya-takror') })
    await qoshdi(odam, 'transport')

    expect(screen.getByText('Bunday kategoriya bor.')).toBeDefined()
  })

  it('yashirilgan nom: yoʻnaltiruvchi matn chiqadi (0051)', async () => {
    const { odam } = chiz({ qosh: xatoQaytaradi('kategoriya-yashirilgan') })
    await qoshdi(odam, 'kiyim')

    expect(
      screen.getByText(
        'Bunday kategoriya yashirilgan — pastdagi Yashirilgan roʻyxatidan Koʻrsatish tugmasi bilan qaytaring.',
      ),
    ).toBeDefined()
  })

  it('yashirilgan nom xatosida kategoriya oʻzi koʻrsatilib yuborilmaydi (mezon 14b)', async () => {
    const { korsat, odam } = chiz({
      kategoriyalar: [kategoriya('kiyim', 'chiqim', true)],
      qosh: xatoQaytaradi('kategoriya-yashirilgan'),
    })
    await qoshdi(odam, 'kiyim')

    expect(korsat).not.toHaveBeenCalled()
    expect(tugma('Koʻrsatish')).toBeDefined()
  })

  it('xatodan keyin qator ochiq qoladi va terilgani turadi', async () => {
    const { odam } = chiz({ qosh: xatoQaytaradi('kategoriya-takror') })
    await qoshdi(odam, 'transport')

    expect((screen.getByLabelText('Kategoriya nomi') as HTMLInputElement).value).toBe('transport')
  })

  it('nom tuzatilishi bilan xato yoʻqoladi', async () => {
    const { odam } = chiz({ qosh: xatoQaytaradi('kategoriya-takror') })
    await qoshdi(odam, 'transport')
    expect(screen.getByText('Bunday kategoriya bor.')).toBeDefined()

    await odam.type(screen.getByLabelText('Kategoriya nomi'), '2')
    expect(screen.queryByText('Bunday kategoriya bor.')).toBeNull()
  })
})

describe('boʻsh holat', () => {
  it('hamma kategoriya yashirilgan boʻlsa ikkita qator turadi', () => {
    chiz({ kategoriyalar: [kategoriya('kiyim', 'chiqim', true)] })

    expect(screen.getByText('Bu roʻyxatda koʻrinadigan kategoriya qolmadi.')).toBeDefined()
    expect(
      screen.getByText('Yashirilganini «Koʻrsatish» bilan qaytaring yoki yangisini qoʻshing.'),
    ).toBeDefined()
    // Yashirilganlar boʻlimi baribir koʻrinadi — qaytarish yoʻli oʻsha yerda.
    expect(tugma('Koʻrsatish')).toBeDefined()
  })
})

describe('orqaga qaytish', () => {
  it('«‹ Orqaga» bosilsa chaqiruv ishlaydi', async () => {
    const orqaga = vi.fn()
    const { odam } = chiz({ orqaga })
    await odam.click(tugma('‹ Orqaga'))
    expect(orqaga).toHaveBeenCalledTimes(1)
  })
})
