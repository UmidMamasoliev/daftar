# Quickstart — Dashboard tekshiruvi

## Talablar

- Node 20+, `platform/` ichida `npm install` qilingan.

## Avtomatik tekshiruv (constitution I — haqiqiy natija bilan)

```bash
cd platform
npx tsc --noEmit          # tip xatosi yoʻq
npx vitest run            # hamma unit/integratsiya testlari, jumladan «mezon» yorliqlilari
npm run build             # PWA build
npx playwright test       # e2e, jumladan e2e/dashboard.spec.ts (oflayn stsenariy bilan)
```

Kutilgan natija: hammasi yashil; dashboard mezonlari (spec «Success Criteria» SC-007 →
prds/dashboard.md 21 mezon) test nomlarida koʻrinadi.

## Qoʻlda tekshirish (5 daqiqa)

1. `npm run dev` → brauzerda ochish: **parolsiz darhol bosh sahifa** (mezon 1), boʻsh
   daftarda qoldiq `0 soʻm` (mezon 2), zaxira eslatmasi koʻrinadi (mezon 15).
2. «＋ Yozuv» → soʻmda chiqim saqlash: qoldiq kamaydi, yozuv roʻyxatda darhol (mezon 3, 10).
3. Dollar yozuvi qoʻshish (kurs bilan): dollar qatori alohida chiqadi (mezon 12),
   «≈ jami soʻmda» taxminiy belgisi bilan (mezon 13).
4. Qarz daftaridan qarz berish: umumiy qoldiq kamayadi, lekin dashboardda qarz raqami
   alohida KOʻRINMAYDI (mezon 5, 11); naqd+karta = umumiy (mezon 12b).
5. Zaxira → Eksport: eslatma yoʻqoladi (mezon 16).
6. DevTools → Network → Offline → sahifani yangilash: dashboard ochiladi va qoldiq
   koʻrinadi (mezon 21).

## Kurs soʻrovi yoʻli (mezon 14)

Toza daftarda (import/eksportsiz) dollar yozuvini kiritmasdan dollar qoldigʻi hosil qilish
uchun: dollar qarzi oling (qarz formasida kurs soʻralmaydi — 0023). Dashboardda «Taxminiy
jamini koʻrsatish uchun kurs kerak» bloki chiqadi; butun soʻm kiritilgach jami chiqadi va
ilova qayta ochilganda qayta soʻralmaydi (mezon 14a); maydonga kasr tushmaydi (mezon 14b).
