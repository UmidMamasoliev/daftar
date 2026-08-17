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
        background_color: '#ffffff',
        theme_color: '#1f2933',
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
