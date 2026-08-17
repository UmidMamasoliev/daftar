// Ilova darajasidagi ulash testi: forma haqiqiy doʻkonlar bilan ishlaydimi.
//
// Bu yerda soxta kategoriya roʻyxati yoʻq — chiplar `data/kategoriyalar.ts` dagi tayyor
// roʻyxatdan keladi (0028; mezon 15), yozuv esa `data/yozuvlar.ts` orqali bazaga tushadi
// (mezon 1). Baza — `fake-indexeddb`, `src/test/setup.ts` qoʻyadi.

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { App } from './App.tsx'
import { bazaniTozala, hammaYozuvlar } from './data/yozuvlar.ts'
import { bugun } from './domain/sana.ts'

afterEach(async () => {
  cleanup()
  await bazaniTozala()
})

it('tayyor kategoriyalar chip boʻlib chiqadi va yozuv bazaga saqlanadi', async () => {
  const odam = userEvent.setup()
  render(<App />)

  await odam.click(await screen.findByRole('button', { name: 'Chiqim' }))
  await odam.type(screen.getByLabelText('Summa'), '45000')
  await odam.click(await screen.findByRole('button', { name: 'oziq-ovqat' }))
  await odam.click(screen.getByRole('button', { name: 'Saqlash' }))

  // Saqlangani ekranda koʻrinadi: forma tozalanadi (dizayn: «Saqlash» qatori).
  await waitFor(() => {
    expect((screen.getByLabelText('Summa') as HTMLInputElement).value).toBe('')
  })

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

  await odam.click(await screen.findByRole('button', { name: 'Kirim' }))
  expect(await screen.findByRole('button', { name: 'oylik' })).toBeDefined()
  expect(screen.queryByRole('button', { name: 'oziq-ovqat' })).toBeNull()
})
