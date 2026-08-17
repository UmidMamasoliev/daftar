# 0048 — «Qaytarish» tugmasi 7 soniya turadi

Sana: 2026-08-17

Nima hal qilindi: 0029 dagi «bir necha soniya» aniq raqamga aylandi — oʻchirishdan keyin
«qaytarish» tugmasi **7 soniya** turadi, keyin yoʻqoladi va oʻchirish yakuniy boʻladi. Bu raqam
daftardagi hamma oʻchirishga bir xil tegishli: yozuv, qarz toʻlovi va kontakt (0029, 0030).

Nega: 3–5 soniya kam — odam oʻchirgandan keyin roʻyxatni surib, toʻgʻri narsa oʻchganini
tekshirib ulgurmaydi va tugma shu payt yoʻqoladi. 10 va undan koʻp soniya esa ekranning pastini
uzoq band qilib turadi — daftar tez ochilib tez yopiladigan vosita (0012 ruhi), keyingi
harakatni toʻsib turgan qator bezor qiladi. 7 soniya ikkovining oʻrtasi: tekshirishga yetadi,
ekranni ushlab qolmaydi.

Nimani oʻzgartiradi:
- `prds/kirim-chiqim.md` va `prds/qarz-daftari.md` dagi «bir necha soniya» → 7 soniya; test
  mezonlari shu raqam bilan yoziladi (muddat tugagach tugma yoʻqoladi va yozuv qaytmaydi).
- Raqam bitta joyda turadi va hamma oʻchirishda qayta ishlatiladi — har ekranga alohida qiymat
  qoʻyilmaydi.
- Testda tekshiriladi: tugma 7 soniya davomida bosilsa yozuv (yoki toʻlov, kontakt) qaytadi;
  7 soniyadan keyin tugma yoʻq va qaytarish imkoni yoʻq. Bu ekran va vaqtga bogʻliq boʻlgani
  uchun Playwright qatlami (0040); vaqtni tez oʻtkazish testda soxtalashtiriladi.
