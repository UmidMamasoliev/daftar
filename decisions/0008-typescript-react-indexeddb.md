# 0008 — Stek: TypeScript + React + IndexedDB, backend yoʻq

Sana: 2026-08-16

Nima hal qilindi: Ilova TypeScript va React da yoziladi. Maʼlumot brauzerning IndexedDB
bazasida saqlanadi. Backend, API va server bazasi yoʻq.

Nega: 0003 va 0004 server variantlarini allaqachon oʻchirgan edi — qolgan tanlov brauzer ichida
edi. IndexedDB brauzerda tuzilgan maʼlumotni saqlash uchun moʻljallangan va u oflayn ishlaydi;
oddiy `localStorage` esa faqat matn saqlaydi va koʻp yozuvda sekinlashadi. TypeScript pul bilan
ishlaydigan kodda tur xatolarini yozish paytida ushlaydi.

Nimani oʻzgartiradi: Hamma kod `platform/` da bitta veb-loyiha boʻlib turadi. Testlar ham shu
stekda yoziladi — 0022 boʻyicha ular tayyorlik gate'i. IndexedDB bilan ishlash testlarda
haqiqiy brauzer yoki uning oʻrnini bosuvchi muhit talab qiladi; qaysi test vositasi ishlatilishi
specda aniqlanadi. Pul summalari kasrsiz butun sonda (eng kichik birlikda) saqlanadi — bu
yaxlitlash xatolarini oldini oladi va specda qayd etiladi.
