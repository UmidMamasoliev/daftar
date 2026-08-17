// «Zaxira» ekrani — ekran darajasidagi testlar.
//
// Tavsif: `design/zaxira.md`. Mezonlar: `prds/zaxira.md` → 9, 11, 15, 17, 17a–17e, 17j–17m,
// 20, 21, 22, 24e–24h. Qarorlar: 0027, 0041, 0053, 0054, 0055, 0063, 0065.
//
// Doʻkon bu yerda yoʻq: eksport, tekshirish, tasdiq va import chaqiruv boʻlib beriladi,
// fayl yuklab olish ham chaqiruv — shu sababli haqiqiy yuklab olish ishga tushmaydi.

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ZaxiraSanoqlari } from '../domain/zaxira.ts'
import type { Natija } from '../domain/turlar.ts'
import { Zaxira } from './Zaxira.tsx'

const TIKLANADIGAN = '{"versiya":1,"tiklanadigan":true}'
const CHIQARILGAN = '{"versiya":1,"chiqarilgan":true}'
const CHIQARILGAN_NOMI = 'daftar-import-oldidan-2026-08-17-1435.json'

const SANOQLAR: ZaxiraSanoqlari = {
  kategoriyalar: 11,
  yozuvlar: 3,
  kontaktlar: 2,
  qarzlar: 2,
  tolovlar: 4,
}

function xato(kod: 'zaxira-oqilmadi' | 'zaxira-versiya' | 'zaxira-notolik' | 'zaxira-mos-emas') {
  return { ok: false as const, xatolar: [{ maydon: 'fayl' as const, kod, xabar: kod }] }
}

type Ustama = {
  oxirgiEksport?: string | null
  daftarBosh?: boolean
  oqishNatijasi?: Natija<unknown>
  tasdiqNatijasi?: Natija<true>
  importNatijasi?: Natija<ZaxiraSanoqlari>
}

function chiz(ustama: Ustama = {}) {
  const eksport = vi.fn(async () => ({
    nom: 'daftar-zaxira-2026-08-17-1435.json',
    matn: CHIQARILGAN,
  }))
  const avtomatikZaxira = vi.fn(async () => ({ nom: CHIQARILGAN_NOMI, matn: CHIQARILGAN }))
  const faylniOqi = vi.fn(
    (_matn: string): Natija<unknown> => ustama.oqishNatijasi ?? { ok: true, qiymat: null },
  )
  const tasdiqla = vi.fn(
    (_tanlangan: string, _chiqarilgan: string): Natija<true> =>
      ustama.tasdiqNatijasi ?? { ok: true, qiymat: true },
  )
  const importQil = vi.fn(
    async (_matn: string): Promise<Natija<ZaxiraSanoqlari>> =>
      ustama.importNatijasi ?? { ok: true, qiymat: SANOQLAR },
  )
  const yuklabOl = vi.fn()
  const yozuvlarniKor = vi.fn()
  const natija = render(
    <Zaxira
      oxirgiEksport={ustama.oxirgiEksport === undefined ? null : ustama.oxirgiEksport}
      daftarBosh={ustama.daftarBosh ?? false}
      eksport={eksport}
      avtomatikZaxira={avtomatikZaxira}
      faylniOqi={faylniOqi}
      tasdiqla={tasdiqla}
      importQil={importQil}
      yuklabOl={yuklabOl}
      yozuvlarniKor={yozuvlarniKor}
    />,
  )
  return {
    eksport,
    avtomatikZaxira,
    faylniOqi,
    tasdiqla,
    importQil,
    yuklabOl,
    yozuvlarniKor,
    odam: userEvent.setup(),
    ...natija,
  }
}

function tugma(nom: string): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

function fayl(matn: string, nom = 'daftar-zaxira-2026-08-10-0912.json'): File {
  return new File([matn], nom, { type: 'application/json' })
}

/** Fayl tanlagichga fayl beradi — brauzerdagi «fayl tanlandi» ning oʻzi. */
async function faylniTanla(
  odam: ReturnType<typeof chiz>['odam'],
  yorliq: string,
  berilgan: File,
): Promise<void> {
  await odam.upload(screen.getByLabelText(yorliq), berilgan)
}

/** Toʻrt qadamli oqimni 3-qadamgacha olib boradi. */
async function tasdiqQadamiga(natija: ReturnType<typeof chiz>): Promise<void> {
  await natija.odam.click(tugma('Import'))
  await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl(TIKLANADIGAN))
  await screen.findByText('Hozirgi maʼlumot faylga chiqarildi.')
}

afterEach(cleanup)

describe('ekranning tuzilishi (dizayn 1-boʻlim; 0063)', () => {
  it('sarlavha «Zaxira»; «‹ Orqaga» yoʻq — bu navigatsiyaning oʻz boʻlimi', () => {
    chiz()
    expect(screen.getByRole('heading', { name: 'Zaxira', level: 1 })).toBeDefined()
    expect(screen.queryByRole('button', { name: '‹ Orqaga' })).toBeNull()
  })

  it('ikkita kartochka bor, uchinchi ish yoʻq', () => {
    chiz()
    const sarlavhalar = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(sarlavhalar).toEqual(['Zaxira olish', 'Fayldan tiklash'])
  })

  it('modal oyna, tasdiq oynasi va «qaytarish» paneli yoʻq (0029 ruhi)', () => {
    chiz()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('button', { name: 'QAYTARISH' })).toBeNull()
  })
})

describe('«Zaxira olish» kartochkasi (dizayn 2-boʻlim; mezon 9, 11)', () => {
  it('mezon 11 — hech qachon eksport qilinmagan daftarda «Hali zaxira olinmagan.»', () => {
    chiz({ oxirgiEksport: null })
    expect(screen.getByText('Hali zaxira olinmagan.')).toBeDefined()
  })

  it('oxirgi eksport sanasi uslub formatida koʻrsatiladi', () => {
    chiz({ oxirgiEksport: '2025-08-16' })
    expect(screen.getByText('Oxirgi zaxira: 16-avgust 2025')).toBeDefined()
  })

  it('yordam qatori va tugma odatdagidek turadi', () => {
    chiz()
    expect(
      screen.getByText('Butun daftar bitta faylga yoziladi va qurilmangizga yuklab olinadi.'),
    ).toBeDefined()
    expect((tugma('Eksport') as HTMLButtonElement).disabled).toBe(false)
  })

  it('mezon 9 — «Eksport» faylni yuklab olishga beradi va nomini koʻrsatadi', async () => {
    const { eksport, yuklabOl, odam } = chiz()
    await odam.click(tugma('Eksport'))

    expect(eksport).toHaveBeenCalledTimes(1)
    expect(yuklabOl).toHaveBeenCalledWith('daftar-zaxira-2026-08-17-1435.json', CHIQARILGAN)
    expect(
      await screen.findByText('Fayl yuklab olindi: daftar-zaxira-2026-08-17-1435.json'),
    ).toBeDefined()
  })

  it('eksportda tasdiq soʻralmaydi va xato holati yoʻq (dizayn 2-boʻlim)', async () => {
    const { odam } = chiz()
    await odam.click(tugma('Eksport'))
    await screen.findByText(/Fayl yuklab olindi/)
    expect(screen.queryByText('Daftardagi maʼlumot oʻzgarmadi.')).toBeNull()
  })

  it('boʻsh daftarda ham «Eksport» ishlaydi (0055 faqat importga tegishli)', async () => {
    const { eksport, odam } = chiz({ daftarBosh: true })
    expect((tugma('Eksport') as HTMLButtonElement).disabled).toBe(false)
    await odam.click(tugma('Eksport'))
    expect(eksport).toHaveBeenCalledTimes(1)
  })
})

describe('«Fayldan tiklash» — tinch holat (dizayn 3-boʻlim)', () => {
  it('ogohlantirish ikki qator, «oʻrniga» soʻzi ajratilgan', () => {
    chiz()
    const qator = screen.getByText(/Import hozirgi maʼlumot/)
    expect(qator.textContent).toBe('Import hozirgi maʼlumot oʻrniga fayldagisini yozadi.')
    expect(within(qator).getByText('oʻrniga').tagName).toBe('STRONG')
    expect(
      screen.getByText(
        'Shuning uchun ilova avval hozirgi maʼlumotni faylga chiqaradi — undan qaytish yoʻli qoladi.',
      ),
    ).toBeDefined()
  })

  it('boʻsh daftarda ikkinchi qator boshqacha (0055)', () => {
    chiz({ daftarBosh: true })
    expect(
      screen.getByText('Daftar boʻsh — yoʻqoladigan maʼlumot yoʻq, import bir qadamda oʻtadi.'),
    ).toBeDefined()
    expect(screen.queryByText(/undan qaytish yoʻli qoladi/)).toBeNull()
  })

  it('«Import» xavfli tugma emas va asosiy tugma ham emas (dizayn 3-boʻlim)', () => {
    chiz()
    const sinf = tugma('Import').className
    expect(sinf).toContain('ikkinchi-tugma')
    expect(sinf).not.toContain('xavfli-tugma')
    expect(sinf).not.toContain('asosiy-tugma')
  })
})

describe('1-qadam — tiklanadigan faylni tanlash (mezon 20, 21, 22)', () => {
  it('toza fayl tanlansa avtomatik zaxira oʻzi chiqadi (0027)', async () => {
    const natija = chiz()
    await tasdiqQadamiga(natija)

    expect(natija.faylniOqi).toHaveBeenCalledWith(TIKLANADIGAN)
    expect(natija.avtomatikZaxira).toHaveBeenCalledTimes(1)
    expect(natija.yuklabOl).toHaveBeenCalledWith(CHIQARILGAN_NOMI, CHIQARILGAN)
  })

  it('mezon 20 — buzilgan fayl oqimni boshlamaydi', async () => {
    const natija = chiz({ oqishNatijasi: xato('zaxira-oqilmadi') })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl('yarim'))

    expect(
      await screen.findByText('Fayl oʻqilmadi — u buzilgan yoki daftar zaxirasi emas.'),
    ).toBeDefined()
    expect(screen.getByText('Daftardagi maʼlumot oʻzgarmadi.')).toBeDefined()
    // Oqim boshlanmaydi: avtomatik zaxira ham, import ham yoʻq.
    expect(natija.avtomatikZaxira).not.toHaveBeenCalled()
    expect(natija.importQil).not.toHaveBeenCalled()
    expect(screen.queryByText('Hozirgi maʼlumot faylga chiqarildi.')).toBeNull()
  })

  it('mezon 21 — notanish versiyali fayl rad etiladi', async () => {
    const natija = chiz({ oqishNatijasi: xato('zaxira-versiya') })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl('{"versiya":9}'))
    expect(
      await screen.findByText(
        'Fayl versiyasi notanish — bu daftar oʻqiy oladigan zaxira emas.',
      ),
    ).toBeDefined()
    expect(natija.importQil).not.toHaveBeenCalled()
  })

  it('mezon 22 — toʻliq boʻlmagan fayl rad etiladi', async () => {
    const natija = chiz({ oqishNatijasi: xato('zaxira-notolik') })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl('{"versiya":1}'))
    expect(
      await screen.findByText('Faylda maʼlumot toʻliq emas — import qilinmadi.'),
    ).toBeDefined()
    expect(natija.importQil).not.toHaveBeenCalled()
  })

  it('fayl tanlanmay yopilsa hech narsa boʻlmaydi — xato matni chiqmaydi', async () => {
    const natija = chiz()
    await natija.odam.click(tugma('Import'))
    fireEvent(screen.getByLabelText('Tiklanadigan fayl'), new Event('cancel'))

    expect(screen.queryByText('Daftardagi maʼlumot oʻzgarmadi.')).toBeNull()
    expect(natija.avtomatikZaxira).not.toHaveBeenCalled()
  })
})

describe('2-qadam — avtomatik zaxira bloki (mezon 15, 17a)', () => {
  it('blok toʻrt qatori va tugmalari bilan chiqadi', async () => {
    const natija = chiz()
    await tasdiqQadamiga(natija)

    expect(
      screen.getByText('Tiklanadigan fayl: daftar-zaxira-2026-08-10-0912.json'),
    ).toBeDefined()
    expect(screen.getByText('Hozirgi maʼlumot faylga chiqarildi.')).toBeDefined()
    expect(screen.getByText(CHIQARILGAN_NOMI)).toBeDefined()
    expect(
      screen.getByText(
        'Endi oʻsha faylni qaytarib tanlang — zaxira saqlanganini ilova shunda koʻradi.',
      ),
    ).toBeDefined()
    expect(tugma('Zaxira faylini tanlash')).toBeDefined()
    expect(tugma('Bekor qilish')).toBeDefined()
  })

  it('mezon 17m — bu nuqtada daftar hali oʻzgarmagan', async () => {
    const natija = chiz()
    await tasdiqQadamiga(natija)
    expect(natija.importQil).not.toHaveBeenCalled()
  })
})

describe('3-qadam — tasdiq (0041; mezon 17, 17b, 17c, 17d, 17j, 17k)', () => {
  it('mezon 17a — mos fayl tanlansa import bajariladi', async () => {
    const natija = chiz()
    await tasdiqQadamiga(natija)
    await faylniTanla(natija.odam, 'Zaxira fayli', fayl(CHIQARILGAN, CHIQARILGAN_NOMI))

    expect(natija.tasdiqla).toHaveBeenCalledWith(CHIQARILGAN, CHIQARILGAN)
    expect(natija.importQil).toHaveBeenCalledWith(TIKLANADIGAN)
    expect(await screen.findByText('Daftar fayldan tiklandi.')).toBeDefined()
  })

  it('mezon 17c — boshqa fayl tanlansa import bajarilmaydi, blok 3-qadamda qoladi', async () => {
    const natija = chiz({ tasdiqNatijasi: xato('zaxira-mos-emas') })
    await tasdiqQadamiga(natija)
    await faylniTanla(natija.odam, 'Zaxira fayli', fayl('{"boshqa":1}'))

    expect(await screen.findByText('Bu fayl hozirgina chiqarilgan zaxira emas.')).toBeDefined()
    expect(screen.getByText('Daftardagi maʼlumot oʻzgarmadi.')).toBeDefined()
    expect(natija.importQil).not.toHaveBeenCalled()
    expect(tugma('Zaxira faylini tanlash')).toBeDefined()
  })

  it('mezon 17b — fayl tanlanmay voz kechilsa sabab koʻrsatiladi', async () => {
    const natija = chiz()
    await tasdiqQadamiga(natija)
    fireEvent(screen.getByLabelText('Zaxira fayli'), new Event('cancel'))

    expect(
      await screen.findByText('Zaxira fayli tanlanmadi — import bajarilmadi.'),
    ).toBeDefined()
    expect(natija.importQil).not.toHaveBeenCalled()
    expect(tugma('Zaxira faylini tanlash')).toBeDefined()
  })

  it('mezon 17j, 17k — notoʻgʻri fayldan keyin toʻgʻrisi tanlanadi, ikkinchi zaxira yoʻq', async () => {
    let mos = false
    const natija = chiz()
    natija.tasdiqla.mockImplementation(() =>
      mos ? { ok: true, qiymat: true } : xato('zaxira-mos-emas'),
    )
    await tasdiqQadamiga(natija)

    await faylniTanla(natija.odam, 'Zaxira fayli', fayl('{"boshqa":1}', 'boshqa.json'))
    await screen.findByText('Bu fayl hozirgina chiqarilgan zaxira emas.')

    mos = true
    await faylniTanla(natija.odam, 'Zaxira fayli', fayl(CHIQARILGAN, CHIQARILGAN_NOMI))
    expect(await screen.findByText('Daftar fayldan tiklandi.')).toBeDefined()

    // 0065: qayta urinishda ikkinchi avtomatik zaxira chiqarilmaydi.
    expect(natija.avtomatikZaxira).toHaveBeenCalledTimes(1)
    expect(natija.yuklabOl).toHaveBeenCalledTimes(1)
  })
})

describe('bekor qilish (dizayn 6-boʻlim; 19b-band)', () => {
  it('«Bekor qilish» kartochkani tinch holatga qaytaradi va ikki qator qoldiradi', async () => {
    const natija = chiz()
    await tasdiqQadamiga(natija)
    await natija.odam.click(tugma('Bekor qilish'))

    expect(
      screen.getByText('Import bekor qilindi — daftardagi maʼlumot oʻzgarmadi.'),
    ).toBeDefined()
    expect(screen.getByText('Chiqarilgan zaxira fayli qurilmangizda qoladi.')).toBeDefined()
    expect(screen.queryByText('Hozirgi maʼlumot faylga chiqarildi.')).toBeNull()
    expect(tugma('Import')).toBeDefined()
    expect(natija.importQil).not.toHaveBeenCalled()
  })
})

describe('boʻsh daftar — bir qadamli yoʻl (0055; mezon 17e, 24h)', () => {
  it('mezon 17e — avtomatik zaxira ham, tasdiq ham boʻlmaydi', async () => {
    const natija = chiz({ daftarBosh: true })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl(TIKLANADIGAN))

    expect(await screen.findByText('Daftar fayldan tiklandi.')).toBeDefined()
    expect(natija.avtomatikZaxira).not.toHaveBeenCalled()
    expect(natija.yuklabOl).not.toHaveBeenCalled()
    expect(natija.importQil).toHaveBeenCalledWith(TIKLANADIGAN)
  })

  it('mezon 24h — bir qadamli importda ham sanoq qatori koʻrinadi', async () => {
    const natija = chiz({ daftarBosh: true })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl(TIKLANADIGAN))
    expect(await screen.findByText('3 yozuv · 2 kontakt · 2 qarz · 4 toʻlov')).toBeDefined()
  })
})

describe('muvaffaqiyat holati (dizayn 7-boʻlim; 0065; mezon 24e, 24g)', () => {
  it('mezon 24e — sanoq qatori toʻrt sonni shu tartibda koʻrsatadi', async () => {
    const natija = chiz()
    await tasdiqQadamiga(natija)
    await faylniTanla(natija.odam, 'Zaxira fayli', fayl(CHIQARILGAN, CHIQARILGAN_NOMI))

    expect(await screen.findByText('Daftar fayldan tiklandi.')).toBeDefined()
    expect(screen.getByText('3 yozuv · 2 kontakt · 2 qarz · 4 toʻlov')).toBeDefined()
  })

  it('mezon 24g — nol boʻlgan tur qatorda qolaveradi', async () => {
    const natija = chiz({
      daftarBosh: true,
      importNatijasi: {
        ok: true,
        qiymat: { kategoriyalar: 11, yozuvlar: 128, kontaktlar: 0, qarzlar: 0, tolovlar: 0 },
      },
    })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl(TIKLANADIGAN))
    expect(await screen.findByText('128 yozuv · 0 kontakt · 0 qarz · 0 toʻlov')).toBeDefined()
  })

  it('sonlar uslub formatida — mingliklar boʻsh joy bilan', async () => {
    const natija = chiz({
      daftarBosh: true,
      importNatijasi: {
        ok: true,
        qiymat: { kategoriyalar: 11, yozuvlar: 1204, kontaktlar: 1, qarzlar: 0, tolovlar: 0 },
      },
    })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl(TIKLANADIGAN))
    expect(await screen.findByText('1 204 yozuv · 1 kontakt · 0 qarz · 0 toʻlov')).toBeDefined()
  })

  it('«Yozuvlarni koʻrish» havolasi «Yozuvlar» ekranini ochadi', async () => {
    const natija = chiz({ daftarBosh: true })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl(TIKLANADIGAN))
    await screen.findByText('Daftar fayldan tiklandi.')

    await natija.odam.click(tugma('Yozuvlarni koʻrish'))
    expect(natija.yozuvlarniKor).toHaveBeenCalledTimes(1)
  })

  it('import xatosi natija blokini ochmaydi', async () => {
    const natija = chiz({ daftarBosh: true, importNatijasi: xato('zaxira-notolik') })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl(TIKLANADIGAN))

    expect(
      await screen.findByText('Faylda maʼlumot toʻliq emas — import qilinmadi.'),
    ).toBeDefined()
    expect(screen.queryByText('Daftar fayldan tiklandi.')).toBeNull()
  })
})

describe('bu ekranda yoʻq narsalar (dizayn 10-boʻlim)', () => {
  it('progress, foiz, jurnal va ulashish tugmasi yoʻq', async () => {
    const natija = chiz()
    await tasdiqQadamiga(natija)
    expect(screen.queryByRole('progressbar')).toBeNull()
    expect(screen.queryByRole('button', { name: /ulash|CSV|Excel|parol/i })).toBeNull()
  })

  it('yangi urinish boshlanganda eski xato yoʻqoladi', async () => {
    const natija = chiz({ oqishNatijasi: xato('zaxira-oqilmadi') })
    await natija.odam.click(tugma('Import'))
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl('yarim'))
    await screen.findByText('Fayl oʻqilmadi — u buzilgan yoki daftar zaxirasi emas.')

    natija.faylniOqi.mockReturnValue({ ok: true, qiymat: null })
    await faylniTanla(natija.odam, 'Tiklanadigan fayl', fayl(TIKLANADIGAN, 'yangi.json'))

    await waitFor(() => {
      expect(
        screen.queryByText('Fayl oʻqilmadi — u buzilgan yoki daftar zaxirasi emas.'),
      ).toBeNull()
    })
  })
})
