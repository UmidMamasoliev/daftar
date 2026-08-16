# 0040 — Vositalar: Vite, Vitest + fake-indexeddb, Playwright

Sana: 2026-08-16

Nima hal qilindi: 0008 ochiq qoldirgan savol yopildi — build va test vositalari tanlandi.

1. **Build vositasi — Vite.** React va TypeScript loyihasi Vite bilan yigʻiladi. PWA qismi
   (oflayn ishlash, ekranga oʻrnatish) `vite-plugin-pwa` orqali qoʻshiladi (0003).
2. **Unit va integratsiya testlari — Vitest.** IndexedDB bilan ishlaydigan kod testda
   **fake-indexeddb** ustida ishlaydi: brauzer ochilmaydi, baza kod ichida yaratiladi.
3. **E2E (uchma-uch) testlar — Playwright.** Haqiqiy brauzerda, haqiqiy IndexedDB bilan. Toʻrt
   qism oqimlari va oflayn/PWA xatti-harakati shu qatlamda sinaladi.

Nega: 0022 boʻyicha har specdagi «Qanday tekshiramiz» mezoni test boʻlib yozilishi kerak, lekin
mezonlar ikki xil: bir qismi sof hisob-kitob (qoldiq, qarz qoldigʻi, kurs bilan aylantirish, davr
chegarasi), bir qismi esa odam koʻradigan oqim (yozuv qoʻshildi, «qaytarish» bosildi, internet
oʻchiq holda ilova ochildi). Bitta qatlam ikkalasini qoplamaydi.

Koʻrilgan boshqa variantlar:
- **Faqat Vitest + fake-indexeddb.** Rad etildi: haqiqiy brauzerda hech narsa sinalmasdi —
  oflayn ishlash, PWA oʻrnatilishi va haqiqiy IndexedDB xatti-harakati testsiz qolardi, holbuki
  0003 boʻyicha aynan ular mahsulotning shartlari.
- **Vitest browser mode.** Rad etildi: yangi, sekinroq va vositalari yetilmagan — tayyorlik
  gate'i (0022) shunday poydevorga qoʻyilmaydi.

Tanlangan ikki qatlam 0022 talabini toʻliq qoplaydi: tez unit qatlam har hisob-kitobni ushlaydi,
Playwright esa odam koʻradigan oqimni tekshiradi.

Nimani oʻzgartiradi: `platform/` skeleti shu vositalar bilan quriladi — Vite loyihasi, ichida
Vitest va Playwright sozlamalari. Har specdagi «Qanday tekshiramiz» mezoni ikki qatlamdan biriga
tushadi: pul, valyuta, qoldiq, qarz qoldigʻi, davr chegarasi va maʼlumot saqlash — Vitest;
ekran oqimi, oflayn holat, PWA va eksport/import faylining brauzerdagi yoʻli — Playwright.
Testlar koddan oldin yoziladi va oʻtgani haqiqiy natija bilan koʻrsatiladi (0022). Vite chiqargan
statik fayllar 0025 dagi hostingga qoʻyiladi.
