# 0055 — Boʻsh daftarga importda avtomatik zaxira oʻtkazib yuboriladi

Sana: 2026-08-17

Nima hal qilindi: Daftar boʻsh boʻlsa, import 0027/0041 dagi uch qadamli yoʻldan emas, **bir
qadamda** oʻtadi: avtomatik zaxira chiqarilmaydi va uni qaytarib tanlash qadami ham boʻlmaydi —
foydalanuvchi faqat tiklanadigan faylni tanlaydi.

**«Boʻsh daftar» taʼrifi** (uchala shart ham bajarilishi kerak):
1. Birorta yozuv yoʻq;
2. Birorta qarz, qarz toʻlovi va kontakt yoʻq;
3. Kategoriyalar tayyor holatida — foydalanuvchi qoʻshgan kategoriya yoʻq va birortasi
   yashirilmagan (0013, 0028).

Bu shartlardan bittasi ham buzilsa, daftar boʻsh sanalmaydi va import odatdagi qoida boʻyicha
ketadi (0027, 0041).

Nega: Avtomatik zaxiraning maqsadi — ustiga yozib yuboriladigan maʼlumotga qaytish yoʻlini
qoldirish (0027). Boʻsh daftarda yoʻqotadigan narsaning oʻzi yoʻq: fayl boʻsh chiqadi va
foydalanuvchi ikkita ortiqcha fayl qadamini bekorga bajaradi. Eng koʻp uchraydigan holat aynan
shu — yangi qurilmada daftarni tiklash.

Koʻrilgan boshqa variant:
- **Istisnosiz qoida** (boʻsh daftarda ham uch qadam). Rad etildi: birinchi tanishuv aynan shu
  yoʻldan oʻtadi va u yerda ikkita maʼnosiz qadam turardi — boʻsh faylni saqlab, keyin oʻsha
  boʻsh faylni qaytarib tanlash.

Nimani oʻzgartiradi:
- `prds/zaxira.md` import oqimida istisno bandi paydo boʻladi, «boʻsh daftar» taʼrifi aniq
  yoziladi va u testlanadi.
- Taʼrifga kategoriyalar kirgani muhim: tayyor kategoriyalar daftarda har doim bor (0028),
  shuning uchun «hech narsa yoʻq» degan sodda tekshiruv ishlamaydi — ular oʻzgartirilganmi,
  shuni tekshirish kerak.
- Testda tekshiriladi: butunlay boʻsh daftarga import bir qadamda oʻtadi; bitta yozuvi bor
  daftarda uch qadam qoladi; faqat bitta kategoriya yashirilgan (yozuvsiz) daftarda ham uch
  qadam qoladi; qoʻshilgan kategoriyasi bor daftarda ham shunday. Oqim boʻlgani uchun
  Playwright, shartning oʻzi Vitest (0040).
