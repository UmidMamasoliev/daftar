# 0068 — Butun ilova HEAD_WEB dizayn tizimiga oʻtkaziladi (redesign)

Sana: 2026-08-20. Holat: qabul qilingan (odam buyurdi, 4.4 darsi uchun).

## Qaror

1. Daftarning butun koʻrinishi **HEAD_WEB** dizayn tizimiga oʻtkaziladi. Manba — odam
   koʻrsatgan rasmiy handoff toʻplami:
   `~/Desktop/second me/library/raw/head-design-handoff-2026-07-31/` (brand/README.md,
   colors_and_type.css, ui_kits/website/) va jonli referens https://head.uz. Token nusxasi
   repoda: `design/redesign/head-tokenlar.css`.
2. Qamrov — **vizual + layout**: rang, shrift, shakl, boʻshliq, komponent koʻrinishlari va
   ekran joylashuvlari. Ilova **toʻliq responsive** boʻladi: telefon (320 px dan),
   planshet va kompyuter ekranlari.
3. **Xulq, matnlar va oqimlar oʻzgarmaydi**: ekran matnlari, rollar, mezonlar joyida —
   1066 Vitest + 12 Playwright testi yashil qolishi shart. Testlar dizaynni emas, xulqni
   qoʻriqlaydi.
4. **Shriftlar oʻzimizda joylashtiriladi** (Space Grotesk, Hanken Grotesk, Space Mono —
   woff2, `platform/public/fonts/`, PWA precache'ga kiradi). Bu 0003 (oflayn) bilan mos:
   eski «tashqi shrift yuklanmaydi» qoidasi «CDN'dan yuklanmaydi, faqat oʻzimizniki» boʻlib
   aniqlashadi.
5. **Ikonka siyosati**: ikonka kutubxonasi (npm paketi) QOʻSHILMAYDI; kerak boʻlgan sanoqli
   belgilar Lucide (MIT) shakllaridan inline SVG sifatida olinadi (1.75 stroke,
   `currentColor`).
6. Kirim/chiqim semantikasi saqlanadi (ishora + rang + soʻz — uch belgi qoidasi);
   HEAD semantik ranglari matn uchun kontrast (WCAG AA) talabiga moslab olinadi.
7. Ilova ichida HEAD logotipi ISHLATILMAYDI — bu HEAD saytining emas, «Daftar»
   mahsulotining ekrani; sarlavha «Daftar» soʻzi Space Grotesk bilan yoziladi.
   Slashed-A belgisiga taqlid qilinmaydi (brand qoidasi: wordmark qayta chizilmaydi).

## Sabab

Hozirgi uslub ataylab minimal edi (tizim shrifti, bezaksiz) — funksional, lekin koʻrimsiz.
4.4 darsi: referens + dizayn skill'lari berilganda bir xil funksionallik qanday oʻzgarishini
koʻrsatish. «Oldin» holati suratlarda: `design/redesign/before/`.

## Qayerda ishlatiladi

`design/uslub.md` (toʻliq qayta yoziladi), `design/dashboard.md` (yangi),
`design/redesign/`, `platform/src/index.css`, `platform/public/fonts/`.
