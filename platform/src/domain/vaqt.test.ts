import { afterEach, describe, expect, it, vi } from 'vitest'

import { hozirYaratilgan } from './vaqt.ts'

afterEach(() => {
  vi.useRealTimers()
})

describe('hozirYaratilgan (0047)', () => {
  it('ISO 8601 UTC vaqtini beradi', () => {
    expect(hozirYaratilgan()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })

  it('mezon 23h — ketma-ket chaqirilganda qiymatlar har xil va oʻsib boradi', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-17T09:41:00.000Z'))

    const birinchi = hozirYaratilgan()
    const ikkinchi = hozirYaratilgan()
    const uchinchi = hozirYaratilgan()

    expect(new Set([birinchi, ikkinchi, uchinchi]).size).toBe(3)
    expect(birinchi < ikkinchi).toBe(true)
    expect(ikkinchi < uchinchi).toBe(true)
  })

  it('vaqt oldinga ketganda haqiqiy soatga ergashadi', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2099-01-01T00:00:00.000Z'))
    hozirYaratilgan()

    vi.setSystemTime(new Date('2099-01-01T10:00:00.000Z'))
    expect(hozirYaratilgan()).toBe('2099-01-01T10:00:00.000Z')
  })

  it('soat orqaga ketsa ham tartib buzilmaydi', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2099-06-01T00:00:00.000Z'))
    const oldingi = hozirYaratilgan()

    vi.setSystemTime(new Date('2099-05-01T00:00:00.000Z'))
    expect(hozirYaratilgan() > oldingi).toBe(true)
  })
})
