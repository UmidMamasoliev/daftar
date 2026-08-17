// Birinchi oʻqish bilan foydalanuvchi harakati orasidagi poyga — alohida fayl, chunki
// doʻkon ataylab sekinlashtiriladi.
//
// Ilova ochilganda hamma roʻyxat bazadan bir marta oʻqiladi. Navigatsiya paneli esa
// darhol chiziladi (0063), demak odam **birinchi oʻqish tugamasdan** «Qarz daftari» ga
// oʻtib kontakt qoʻsha oladi. Agar birinchi oʻqish oʻz natijasini keyin qoʻysa, u
// yangi kontaktni ekrandan oʻchirib yuboradi — daftardagi eng yomon xato: saqlangan
// narsa jimgina yoʻqoladi.
//
// jsdom da fake-indexeddb juda tez, shuning uchun poyga oʻz-oʻzidan yopilib qoladi.
// Bu yerda **birinchi** `kontaktHolatlari` chaqiruviga kechikish qoʻyiladi — shunda
// poyga har safar takrorlanadi.

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import { App } from './App.tsx'
import { bazaniTozala } from './data/qarzlar.ts'
import { navbatBoshasin } from './test/navbat.ts'

vi.mock('./data/qarzlar.ts', async () => {
  const asl = await vi.importActual<typeof import('./data/qarzlar.ts')>('./data/qarzlar.ts')
  let birinchi = true
  return {
    ...asl,
    // Oʻqish darhol bajariladi (baza oʻshanda boʻsh), natija esa kech qaytadi — poyga
    // aynan shunday tugʻiladi: eskirgan surat yangisining ustiga tushadi.
    kontaktHolatlari: async () => {
      const natija = await asl.kontaktHolatlari()
      if (birinchi) {
        birinchi = false
        await new Promise((bajarildi) => setTimeout(bajarildi, 500))
      }
      return natija
    },
  }
})

afterEach(async () => {
  cleanup()
  // Doʻkonga boshlangan ish tugasin — tozalash uning oʻrtasiga tushmasin.
  await navbatBoshasin()
  await bazaniTozala()
})

it('sekin birinchi oʻqish yangi kontaktni ekrandan oʻchirib yubormaydi', async () => {
  // Kechikishsiz: hamma bosish birinchi oʻqish tugagunicha ulgursin.
  const odam = userEvent.setup({ delay: null })
  render(<App />)

  // Birinchi oʻqish hali tugamagan payt: navigatsiya paneli allaqachon chizilgan.
  await odam.click(screen.getByRole('button', { name: 'Qarz daftari' }))
  await odam.click(screen.getByRole('button', { name: '＋ Yangi kontakt' }))
  await odam.type(screen.getByLabelText('Ism'), 'Akmal')
  await odam.click(screen.getByRole('button', { name: 'Qoʻshish' }))

  expect(await screen.findByRole('button', { name: /Akmal/ })).toBeDefined()

  // Kechikkan birinchi oʻqish yetib kelgandan keyin ham kontakt joyida turadi.
  await new Promise((bajarildi) => setTimeout(bajarildi, 700))
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Akmal/ })).toBeDefined()
  })
})
