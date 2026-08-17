import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Vitest sozlamasi — unit va integratsiya testlari (0040).
// Ataylab `vite.config.ts` dan ayri turadi: testlarga PWA plagini kerak emas.
//
// `setupFiles` har test faylidan oldin ishlaydi va IndexedDB oʻrniga fake-indexeddb
// ni qoʻyadi — brauzer ochilmaydi, baza kod ichida yaratiladi.
// E2E testlar (`e2e/`) bu yerga kirmaydi — ular Playwright niki.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    reporters: ['verbose'],
  },
})
