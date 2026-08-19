// Ilova darajasidagi ulash testlari: ekranlar, doʻkon va oʻtishlar birga ishlaydimi.
//
// Bu yerda soxta roʻyxat yoʻq — kategoriyalar `data/kategoriyalar.ts` dagi tayyor
// roʻyxatdan (0028; mezon 15), yozuvlar esa `data/yozuvlar.ts` orqali bazadan keladi.
// Baza — `fake-indexeddb`, `src/test/setup.ts` qoʻyadi.
//
// «Qaytarish» muddati (7 soniya) shu yerda tekshirilmaydi: soxta soat IndexedDB ga
// xalaqit beradi. U ekran darajasida — `src/ui/Yozuvlar.test.tsx` da.

import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { App } from './App.tsx'
import { hammaKategoriyalar } from './data/kategoriyalar.ts'
import { bazaniTozala, hammaYozuvlar } from './data/yozuvlar.ts'
import { bugun } from './domain/sana.ts'
import { navbatBoshasin } from './test/navbat.ts'

afterEach(async () => {
  cleanup()
  // Doʻkonga boshlangan ish tugasin — tozalash uning oʻrtasiga tushmasin.
  await navbatBoshasin()
  await bazaniTozala()
})

function tugma(nom: string | RegExp): HTMLElement {
  return screen.getByRole('button', { name: nom })
}

/**
 * Kategoriya chipi. Chiplar doʻkondan kelgach paydo boʻladi, shuning uchun ular
 * har doim kutiladi — `getBy*` bilan olinsa test doʻkon tezligiga bogʻlanib qoladi.
 */
function chipniKut(nom: string): Promise<HTMLElement> {
  return screen.findByRole('button', { name: nom })
}

/**
 * Kategoriyalar roʻyxatidagi aynan shu nomli qatorning tugmasi.
 * Nomdan qidiriladi — roʻyxat tartibiga tayanmaydi.
 */
function qatorTugmasi(nom: string, tugmaNomi: string): HTMLElement {
  const qator = screen
    .getAllByRole('listitem')
    .find((q) => q.textContent?.startsWith(nom) === true)
  if (qator === undefined) {
    throw new Error(`«${nom}» qatori topilmadi`)
  }
  return within(qator).getByRole('button', { name: tugmaNomi })
}

/**
 * «Yangi yozuv» formasini ochadi.
 *
 * Ilova bosh sahifa bilan ochiladi (0020; spec 001-dashboard), formaga bosh sahifadagi
 * «＋ Yozuv» tugmasidan kiriladi — navigatsiyada alohida «Yozuv» bandi yoʻq (FR-013).
 */
async function formaniOchdi(odam: ReturnType<typeof userEvent.setup>): Promise<void> {
  await odam.click(await screen.findByRole('button', { name: 'Bosh' }))
  await odam.click(await screen.findByRole('button', { name: '＋ Yozuv' }))
  await screen.findByRole('heading', { name: 'Yangi yozuv', level: 1 })
}

/** Formani toʻldirib saqlaydi va «Yozuvlar» roʻyxatiga oʻtadi — koʻp testga tayyorgarlik. */
async function yozuvQoshdi(
  odam: ReturnType<typeof userEvent.setup>,
  summa: string,
  kategoriya: string | RegExp = 'oziq-ovqat',
): Promise<void> {
  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: 'Chiqim' }))
  await odam.type(screen.getByLabelText('Summa'), summa)
  await odam.click(await screen.findByRole('button', { name: kategoriya }))
  await odam.click(tugma('Saqlash'))
  // Forma bosh sahifaga qaytadi (oʻzi ochilgan ekranga); roʻyxat qatorlari bilan ishlash
  // uchun «Yozuvlar» boʻlimiga oʻtiladi (aks holda `/oziq-ovqat/` dashboard qatoriga emas,
  // chipga ham tushib ketardi).
  await screen.findByRole('heading', { name: 'Daftar', level: 1 })
  await odam.click(tugma('Yozuvlar'))
  await screen.findByRole('heading', { name: 'Yozuvlar', level: 1 })
}

it('tayyor kategoriyalar chip boʻlib chiqadi va yozuv bazaga saqlanadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await yozuvQoshdi(odam, '45000')

  const yozuvlar = await hammaYozuvlar()
  expect(yozuvlar).toHaveLength(1)
  expect(yozuvlar[0]).toMatchObject({
    turi: 'chiqim',
    summa: 45000,
    kategoriyaId: 'oziq-ovqat',
    sana: bugun(),
    hisob: 'karta',
    valyuta: 'som',
  })
})

it('kirim turida faqat kirim kategoriyalari koʻrinadi (mezon 16)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: 'Kirim' }))
  expect(await screen.findByRole('button', { name: 'oylik' })).toBeDefined()
  expect(screen.queryByRole('button', { name: 'oziq-ovqat' })).toBeNull()
})

it('yangi yozuv roʻyxatda darhol koʻrinadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await yozuvQoshdi(odam, '45000')

  expect(await screen.findByText('−45 000 soʻm')).toBeDefined()
  expect(screen.getByText('oziq-ovqat')).toBeDefined()
  expect(screen.getByRole('heading', { name: 'Bugun', level: 2 })).toBeDefined()
})

it('ilova bosh sahifa bilan ochiladi; «＋ Yozuv» formani ochadi, `×` boshga qaytaradi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  expect(await screen.findByRole('heading', { name: 'Daftar', level: 1 })).toBeDefined()

  await formaniOchdi(odam)
  // Forma ekranida navigatsiya paneli koʻrinmaydi (dizayn: «Qayerda koʻrinadi»).
  expect(screen.queryByRole('navigation')).toBeNull()

  await odam.click(tugma('Yopish'))
  expect(screen.getByRole('heading', { name: 'Daftar', level: 1 })).toBeDefined()
  expect(screen.getByRole('navigation')).toBeDefined()
})

it('roʻyxatdagi qator tahrirlash formasini toʻldirilgan holda ochadi (mezon 18)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await yozuvQoshdi(odam, '45000')
  await odam.click(await screen.findByRole('button', { name: /oziq-ovqat/ }))

  expect(screen.getByRole('heading', { name: 'Yozuvni tahrirlash', level: 1 })).toBeDefined()
  expect((screen.getByLabelText('Summa') as HTMLInputElement).value).toBe('45 000')
  expect(tugma('Chiqim').getAttribute('aria-pressed')).toBe('true')
  expect((await chipniKut('oziq-ovqat')).getAttribute('aria-pressed')).toBe('true')
})

it('tahrirlangan yozuv roʻyxatda darhol yangilanadi (mezon 10, 18)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await yozuvQoshdi(odam, '45000')
  await odam.click(await screen.findByRole('button', { name: /oziq-ovqat/ }))

  const summa = screen.getByLabelText('Summa')
  await odam.clear(summa)
  await odam.type(summa, '50000')
  await odam.click(tugma('Saqlash'))
  await screen.findByRole('heading', { name: 'Yozuvlar', level: 1 })

  expect(await screen.findByText('−50 000 soʻm')).toBeDefined()
  expect(screen.queryByText('−45 000 soʻm')).toBeNull()
  expect(await hammaYozuvlar()).toHaveLength(1)
})

it('mezon 14c, 14d — yashirilgan kategoriyali yozuv tahrirlanganda chip tanlangan turadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await yozuvQoshdi(odam, '45000')

  // Kategoriya ekran orqali yashiriladi — yozuv oʻz joyida qoladi (0013).
  await formaniOchdi(odam)
  await odam.click(tugma('Boshqarish'))
  await odam.click(qatorTugmasi('oziq-ovqat', 'Yashirish'))
  await screen.findByText('Yashirilgan')
  await odam.click(tugma('‹ Orqaga'))
  await odam.click(tugma('Yopish'))

  // Forma boshga qaytadi; yozuv qatori «Yozuvlar» ekranida turadi.
  await screen.findByRole('heading', { name: 'Daftar', level: 1 })
  await odam.click(tugma('Yozuvlar'))
  await odam.click(await screen.findByRole('button', { name: /oziq-ovqat/ }))
  expect(screen.getByRole('heading', { name: 'Yozuvni tahrirlash', level: 1 })).toBeDefined()

  // 14c: oʻz kategoriyasi chipda tanlangan; boshqa yashirilganlar yoʻq.
  expect((await chipniKut('oziq-ovqat')).getAttribute('aria-pressed')).toBe('true')
  expect(screen.getByRole('button', { name: 'transport' })).toBeDefined()

  // 14d: faqat izoh oʻzgartirilsa kategoriya oʻzgarmaydi va yashirilganicha qoladi.
  await odam.type(screen.getByLabelText('Izoh'), 'tushlik')
  await odam.click(tugma('Saqlash'))
  await screen.findByRole('heading', { name: 'Yozuvlar', level: 1 })

  const yozuvlar = await hammaYozuvlar()
  expect(yozuvlar[0]).toMatchObject({ kategoriyaId: 'oziq-ovqat', izoh: 'tushlik' })
  const oziq = (await hammaKategoriyalar()).find((k) => k.id === 'oziq-ovqat')
  expect(oziq?.yashirilgan).toBe(true)
})

it('oʻchirilgan yozuv roʻyxatdan yoʻqoladi va «QAYTARISH» uni tiklaydi (mezon 11, 20)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await yozuvQoshdi(odam, '45000')
  const qator = await screen.findByRole('button', { name: /oziq-ovqat/ })

  await odam.hover(qator)
  await odam.click(tugma('Oʻchirish'))

  await waitFor(() => {
    expect(screen.queryByText('−45 000 soʻm')).toBeNull()
  })
  expect(await hammaYozuvlar()).toHaveLength(0)
  expect(screen.getByText('Yozuv oʻchirildi')).toBeDefined()

  await odam.click(tugma('QAYTARISH'))
  expect(await screen.findByText('−45 000 soʻm')).toBeDefined()
  expect(await hammaYozuvlar()).toHaveLength(1)
})

it('«Boshqarish» kategoriyalar ekranini formadagi tur bilan ochadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: 'Kirim' }))
  await odam.click(tugma('Boshqarish'))

  expect(screen.getByRole('heading', { name: 'Kategoriyalar', level: 1 })).toBeDefined()
  expect(tugma('Kirim').getAttribute('aria-pressed')).toBe('true')
  // Mezon 15: kirimda uchta tayyor nom.
  expect(screen.getAllByRole('button', { name: 'Yashirish' })).toHaveLength(3)
})

it('qaytilganda forma toʻldirilgan holicha turadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: 'Chiqim' }))
  await odam.type(screen.getByLabelText('Summa'), '45000')
  await odam.type(screen.getByLabelText('Izoh'), 'nonushta')
  await odam.click(tugma('Boshqarish'))
  await odam.click(tugma('‹ Orqaga'))

  expect(screen.getByRole('heading', { name: 'Yangi yozuv', level: 1 })).toBeDefined()
  expect((screen.getByLabelText('Summa') as HTMLInputElement).value).toBe('45 000')
  expect((screen.getByLabelText('Izoh') as HTMLInputElement).value).toBe('nonushta')
  expect(tugma('Chiqim').getAttribute('aria-pressed')).toBe('true')
})

it('qoʻshilgan kategoriya formadagi chiplarda darhol paydo boʻladi (mezon 13)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: 'Chiqim' }))
  await odam.click(tugma('Boshqarish'))
  await odam.click(tugma('＋ Yangi kategoriya'))
  await odam.type(screen.getByLabelText('Kategoriya nomi'), 'dorixona')
  await odam.click(tugma('Qoʻshish'))

  // Kiritish qatori yopiladi va yangi qator roʻyxatda koʻrinadi (dizayn).
  await waitFor(() => {
    expect(screen.queryByLabelText('Kategoriya nomi')).toBeNull()
  })
  expect(screen.getAllByRole('button', { name: 'Yashirish' })).toHaveLength(9)

  await odam.click(tugma('‹ Orqaga'))
  expect(await chipniKut('dorixona')).toBeDefined()
})

it('yashirilgan kategoriya formadagi chiplardan darhol yoʻqoladi (mezon 14)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: 'Chiqim' }))
  expect(await chipniKut('kiyim')).toBeDefined()

  await odam.click(tugma('Boshqarish'))
  await odam.click(qatorTugmasi('kiyim', 'Yashirish'))

  // Yashirilganlar boʻlimida paydo boʻladi va «Koʻrsatish» bilan qaytadi.
  expect(await screen.findByRole('button', { name: 'Koʻrsatish' })).toBeDefined()

  await odam.click(tugma('‹ Orqaga'))
  await screen.findByRole('heading', { name: 'Yangi yozuv', level: 1 })
  expect(screen.queryByRole('button', { name: 'kiyim' })).toBeNull()

  await odam.click(tugma('Boshqarish'))
  await odam.click(tugma('Koʻrsatish'))
  await waitFor(() => {
    expect(screen.queryByText('Yashirilgan')).toBeNull()
  })
  await odam.click(tugma('‹ Orqaga'))
  expect(await chipniKut('kiyim')).toBeDefined()
})

it('tanlangan kategoriya yashirilib qaytilsa tanlov bekor boʻladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: 'Chiqim' }))
  await odam.click(await chipniKut('oziq-ovqat'))
  expect((await chipniKut('oziq-ovqat')).getAttribute('aria-pressed')).toBe('true')

  await odam.click(tugma('Boshqarish'))
  await odam.click(qatorTugmasi('oziq-ovqat', 'Yashirish'))
  await screen.findByText('Yashirilgan')
  await odam.click(tugma('‹ Orqaga'))

  // «‹ Orqaga» doʻkon navbatini kutadi (0057 poygasi), shuning uchun natija kutiladi.
  expect(
    await screen.findByText('Tanlangan kategoriya yashirildi — boshqasini tanlang.'),
  ).toBeDefined()
  expect(screen.queryByRole('button', { name: 'oziq-ovqat' })).toBeNull()

  // «Saqlash» odatdagi xatoni beradi va yozuv saqlanmaydi.
  await odam.type(screen.getByLabelText('Summa'), '45000')
  await odam.click(tugma('Saqlash'))
  expect(screen.getByText('Kategoriyani tanlang.')).toBeDefined()
  expect(await hammaYozuvlar()).toHaveLength(0)
})

it('yashirib, keyin «Koʻrsatish» bilan qaytarilsa tanlov joyida qoladi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: 'Chiqim' }))
  await odam.click(await chipniKut('oziq-ovqat'))

  await odam.click(tugma('Boshqarish'))
  await odam.click(qatorTugmasi('oziq-ovqat', 'Yashirish'))
  await odam.click(await screen.findByRole('button', { name: 'Koʻrsatish' }))
  // Roʻyxat yangilandi: «Yashirilgan» boʻlimi yoʻqoldi.
  await waitFor(() => {
    expect(screen.queryByText('Yashirilgan')).toBeNull()
  })
  await odam.click(tugma('‹ Orqaga'))

  expect((await chipniKut('oziq-ovqat')).getAttribute('aria-pressed')).toBe('true')
  expect(screen.queryByText('Tanlangan kategoriya yashirildi — boshqasini tanlang.')).toBeNull()
})

it('yashirilgan nom bilan qoʻshishga urinish rad etiladi (mezon 14a, 14b)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await formaniOchdi(odam)
  await odam.click(await screen.findByRole('button', { name: 'Chiqim' }))
  await odam.click(tugma('Boshqarish'))

  await odam.click(qatorTugmasi('kiyim', 'Yashirish'))
  await screen.findByText('Yashirilgan')
  const oldingiSoni = (await hammaKategoriyalar()).length

  await odam.click(tugma('＋ Yangi kategoriya'))
  await odam.type(screen.getByLabelText('Kategoriya nomi'), '  KIYIM ')
  await odam.click(tugma('Qoʻshish'))

  expect(
    await screen.findByText(
      'Bunday kategoriya yashirilgan — pastdagi Yashirilgan roʻyxatidan Koʻrsatish tugmasi bilan qaytaring.',
    ),
  ).toBeDefined()
  // Dublikat yaratilmaydi va kategoriya oʻzi koʻrsatilib yuborilmaydi (0051).
  expect(await hammaKategoriyalar()).toHaveLength(oldingiSoni)
  expect(tugma('Koʻrsatish')).toBeDefined()
})

it('panel turganda boshqa ekranga oʻtilsa oʻchirish yakuniy boʻladi (mezon 12b)', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await yozuvQoshdi(odam, '45000')
  const qator = await screen.findByRole('button', { name: /oziq-ovqat/ })

  await odam.hover(qator)
  await odam.click(tugma('Oʻchirish'))
  // Panel doʻkon oʻchirishni tugatgandan keyin chiqadi (KELISHUV 8-boʻlim).
  expect(await screen.findByText('Yozuv oʻchirildi')).toBeDefined()

  // Boshqa boʻlimga oʻtib qaytiladi — panel yoʻqoladi (0063 navigatsiyasi bilan).
  await odam.click(tugma('Qarz daftari'))
  await odam.click(tugma('Yozuvlar'))

  expect(screen.queryByText('Yozuv oʻchirildi')).toBeNull()
  expect(screen.queryByRole('button', { name: 'QAYTARISH' })).toBeNull()
  expect(await hammaYozuvlar()).toHaveLength(0)
  expect(screen.getByText('Hali bitta ham yozuv yoʻq.')).toBeDefined()
})
