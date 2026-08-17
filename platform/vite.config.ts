import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Vite sozlamasi — ilovani yigʻadi va dev-serverni koʻtaradi.
// PWA (oflayn ishlash, ekranga oʻrnatish) faqat yigʻilgan versiyada yoqiladi:
// dev rejimida service worker oʻchiq, aks holda u eski nusxani keshlab, ishlab
// chiqishda chalgʻitadi. Tekshirish uchun: `npm run build && npm run preview`.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: false },
      manifest: {
        name: 'Daftar',
        short_name: 'Daftar',
        description: 'Kirim-chiqim, qarz daftari, oylik hisobot',
        lang: 'uz-Latn',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        // Ranglar `design/uslub.md` → «PWA va brauzer ranglari» dan olinadi.
        // `background_color` — ochilish (splash) ekrani foni: ekranning umumiy foni
        // bilan bir xil, shunda ilova ochilganda rang sakramaydi.
        // `theme_color` — brauzer paneli rangi: sahifadagi
        // `<meta name="theme-color">` bilan aynan bir xil qiymat turishi shart.
        background_color: '#F4F5F7',
        theme_color: '#FFFFFF',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
