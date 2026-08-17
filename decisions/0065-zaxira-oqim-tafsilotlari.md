# 0065 — Import oqimi: sanoq qatori va yarim qolgan importning taqdiri

Sana: 2026-08-17
**Bosh agent vakolat bilan tanladi (0058)**

Nima hal qilindi:

**(a) Import muvaffaqiyat blokida sanoq qatori koʻrsatiladi.** Import tugagach ekranda nima
tiklangani raqam bilan turadi: **«N yozuv · N kontakt · N qarz · N toʻlov»**. Buning uchun import
amali bloklar boʻyicha qoʻyilgan yozuvlar sonini qaytaradi (sanoq fayldan emas, **haqiqatda
qoʻyilgan** maʼlumotdan olinadi). Qator matni `design/` da.

**(b) Yarim qolgan import.** 3-qadamda (tasdiq fayli mos kelmasa yoki umuman tanlanmasa,
`prds/zaxira.md` 19a, 19b-bandlar):

1. Foydalanuvchi **oʻsha yerda qayta urina oladi** — zaxira ekranini tashlab ketmasdan faylni
   yana tanlashi mumkin.
2. **Ikkinchi avtomatik zaxira chiqarilmaydi**: birinchi qadamda chiqarilgan fayl kuchda qoladi
   va tasdiq oʻsha bilan solishtiriladi. Oxirgi eksport sanasi ham qayta yangilanmaydi — u
   birinchi avtomatik zaxirada allaqachon yangilangan (0054).
3. **Zaxira ekranidan chiqib ketilsa oqim bekor boʻladi**: keyingi import boshidan boshlanadi
   (1-qadam), yaʼni yangi avtomatik zaxira chiqariladi va tasdiq oʻshanga tegishli boʻladi.

Daftardagi maʼlumot bularning hech birida oʻzgarmaydi — ustiga yozish faqat 4-qadamda boʻladi
(0027, 0041).

Nega:

- (a) 0041 boʻyicha import ogʻir amal: butun daftar ustiga yoziladi. Oxirida faqat «tiklandi»
  deyilsa, foydalanuvchida uni tekshirish yoʻli qolmasdi — u qarz daftari va yozuvlarni qoʻlda
  aylanib chiqishga majbur boʻlardi. Raqamlar esa darhol koʻzga tashlanadi: kontakti bor
  daftardan «0 kontakt» chiqsa, xato oʻsha zahoti koʻrinadi. Bu 0022 dagi «natija koʻrsatiladi»
  qoidasining foydalanuvchi tomoni.
- (b1) Tasdiq qadamida odam koʻpincha shunchaki notoʻgʻri faylni tanlaydi (eski zaxira, boshqa
  papkadagi fayl). Butun oqimni boshidan majburlash uni ikkinchi marta bir xil ishni qilishga
  majbur qilardi.
- (b2) Har urinishda yangi avtomatik zaxira chiqarilsa, foydalanuvchining yuklamalar papkasi bir
  necha bir xil fayl bilan toʻlib ketardi va u qaysinisini tanlashni bilmasdi — aynan tasdiq
  qadamini chalkashtiradigan holat. Birinchi fayl allaqachon haqiqiy zaxira: 0054 uni eksport
  deb sanagan va sanani yangilagan.
- (b3) Ekrandan chiqib ketish — oqimning tabiiy tugashi: ilova yarim holatni saqlab
  yurmaydi va «yarim qolgan import» degan tushuncha paydo boʻlmaydi (0023 emas, 0027 ruhi —
  yo hammasi, yo hech narsa).

Koʻrilgan boshqa variantlar:
- **Sanoqsiz oddiy «Tiklandi» xabari.** Rad etildi: tekshirib boʻlmaydigan xabar — 0041 tasdiqni
  aynan «koʻrib ishonch hosil qilish» ustiga qurgan.
- **Har urinishda yangi avtomatik zaxira chiqarish.** Rad etildi: yuqoridagi (b2) sababi —
  fayllar koʻpayib, tasdiq qadami chalkashardi.
- **Yarim qolgan importni ilova eslab qolishi** (ekranga qaytilganda oʻsha joydan davom etishi).
  Rad etildi: ilovada saqlanadigan yangi holat paydo boʻlardi va u zaxira fayliga ham,
  hisoblarga ham tegishli boʻlmagan «yarim amal» boʻlib qolardi.

Nimani oʻzgartiradi:
- `prds/zaxira.md`: import bandlariga sanoq qatori va qayta urinish qoidalari qoʻshiladi
  (19-band atrofi), «Qanday tekshiramiz» ga sanab boʻladigan mezonlar tushadi.
- Import amali natija sifatida bloklar boʻyicha sonlarni qaytaradigan boʻladi (yozuv, kontakt,
  qarz, toʻlov).
- `AGENTS.md`: oʻqish roʻyxatida «0065 gacha» va zaxira qatorlariga bir qator.
- Testda tekshiriladi: 3 yozuv, 2 kontakt, 2 qarz, 4 toʻlovli fayl importidan keyin sanoq qatori
  aynan shu raqamlarni koʻrsatadi; tasdiqda notoʻgʻri fayl tanlanib qayta urinilsa ikkinchi
  avtomatik zaxira chiqmaydi va oxirgi eksport sanasi oʻzgarmaydi; ekrandan chiqib qayta
  kirilganda import 1-qadamdan boshlanadi (0040).
