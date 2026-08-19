# 0067 — Dashboard bosh sahifa: navigatsiya va ekran tafsilotlari

Sana: 2026-08-19. Holat: qabul qilingan. 0063 dagi «dashboard qurilganda navigatsiyani
dizayn qayta koʻradi» sharti shu qaror bilan yopildi.

## Qaror

1. **Navigatsiya (odam tanladi):** «Yozuv» bandi olib tashlanadi. Bandlar: **Bosh,
   Yozuvlar, Qarz daftari, Hisobot, Zaxira** (5 band). Yozuv qoʻshish — bosh sahifadagi
   doim koʻrinadigan «＋ Yozuv» tugmasidan. Ilova «Bosh» bilan ochiladi (0020).
2. Band nomi — **«Bosh»**, bosh sahifa sarlavhasi — **«Daftar»** (bosh sahifa ilovaning
   oʻzi; navda qisqa soʻz sigʻadi).
3. Oxirgi yozuvlar roʻyxati — **eng koʻpi 5 ta**, tartib mavjud «yangidan» qoidasida
   (sana boʻyicha, bir kunda `yaratilgan` boʻyicha). Qatorlar **bosilmaydi** — tahrir
   yoʻli faqat «Yozuvlar» ekranida (0032 ruhida).
4. Zaxira eslatmasi (0024) — **bir qatorlik oddiy matn, bosilmaydi**: PRDda bosish
   xatti-harakati aytilmagan, aytilmagan narsa qoʻshilmaydi (chegara tamoyili).
5. Forma qaytish yoʻli: «＋ Yozuv» dan ochilgan forma bosh sahifaga, «Yozuvlar»dagi
   tahrirdan ochilgani «Yozuvlar»ga qaytadi (uslubdagi mavjud qoida).

## Sabab

- Dashboardda baribir doim koʻrinadigan «＋ Yozuv» tugmasi bor (PRD 27) — alohida «Yozuv»
  bandi kirish nuqtasini ikkilantiradi va telefonda 6 band torlik qiladi. Narxi: boshqa
  boʻlimdan yozuv qoʻshish uchun avval «Bosh»ga qaytiladi (bitta qoʻshimcha bosish) —
  odam buni bilib tanladi.
- 1 va 5-bandlar odamning javobi (Spec Kit `clarify` savoli, `specs/001-dashboard/spec.md`
  → Clarifications 2026-08-19); 2–4-bandlar bosh agent tanlovi — sof Spec Kit rejimida
  reja bosqichida hal qilinib, shu yerda qayd etildi.

## Qayerda ishlatiladi

`platform/src/ui/Navigatsiya.tsx`, `platform/src/ui/Dashboard.tsx`, `platform/src/App.tsx`,
`design/uslub.md` («Navigatsiya paneli»), `prds/dashboard.md`, `specs/001-dashboard/`.
