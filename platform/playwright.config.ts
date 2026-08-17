import { defineConfig, devices } from '@playwright/test'

const DEV_PORT = 5173
const PREVIEW_PORT = 4173
const DEV_URL = `http://localhost:${DEV_PORT}`
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`

/** Oflayn testi faqat yigʻilgan ilovada maʼnoli — service worker dev-serverda yoʻq. */
const OFLAYN = /oflayn\.spec\.ts/

// Playwright sozlamasi — E2E (uchma-uch) testlar haqiqiy brauzerda (0040).
//
// Ikkita project:
// - `chromium` — kundalik testlar, tez dev-serverda;
// - `oflayn` — mezon 17: yigʻilgan ilova + `vite preview`, chunki PWA service worker
//   faqat build natijasida paydo boʻladi.
//
// `webServer` ikkalasini oʻzi koʻtaradi va test tugagach oʻchiradi.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: OFLAYN,
      use: { ...devices['Desktop Chrome'], baseURL: DEV_URL },
    },
    {
      name: 'oflayn',
      testMatch: OFLAYN,
      use: { ...devices['Desktop Chrome'], baseURL: PREVIEW_URL },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: DEV_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `npm run build && npm run preview -- --port ${PREVIEW_PORT} --strictPort`,
      url: PREVIEW_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
})
