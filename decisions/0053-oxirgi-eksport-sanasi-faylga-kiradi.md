# 0053 — Oxirgi eksport sanasi zaxira fayliga kiradi va import bilan tiklanadi

Sana: 2026-08-17

Nima hal qilindi: 0024 dagi «oxirgi eksport sanasi» qiymati zaxira fayliga kiradi va import
qilinganda fayldagi qiymat bilan tiklanadi.

1. Faylda oxirgi muvaffaqiyatli eksport sanasi turadi.
2. Import bu qiymatni ham tiklaydi — daftardagi hozirgi qiymat ustiga fayldagisi qoʻyiladi
   (0027 dagi toʻliq almashtirish qoidasi).
3. Shundan keyin 30 kunlik eslatma shu tiklangan sanadan hisoblanadi (0024).

Nega: Eski zaxira tiklanganda daftar ham eski holatga qaytadi — oʻshanda «oxirgi eksport» ham
eski boʻlishi kerak. Shunda eslatma darhol va **haqli** ravishda chiqadi: tiklangan daftarning
yangi zaxirasi hali olinmagan. Qiymat qurilmada qolsa, tiklangan daftar «yaqinda zaxiralangan»
boʻlib koʻrinardi — bu yolgʻon xotirjamlik.

Koʻrilgan boshqa variantlar:
- **Qiymat qurilmada qoladi, faylga kirmaydi.** Rad etildi: yangi qurilmada tiklangan daftarda
  qiymat umuman boʻlmasdi yoki oʻsha qurilmaning tarixi qolardi — ikkalasi ham notoʻgʻri.
- **Importdan keyin nolga tushiriladi** («hech qachon eksport qilinmagan»). Rad etildi: eslatma
  baribir chiqardi, lekin fayldagi haqiqiy sana yoʻqolardi va 0007 dagi «hamma maʼlumot faylda»
  tamoyili buzilardi.

Nimani oʻzgartiradi:
- `prds/zaxira.md` fayl sxemasiga maydon qoʻshiladi va u import bilan tiklanadi; tekshiruv
  roʻyxatiga ham kiradi (0027 boʻyicha majburiy maydon).
- `prds/dashboard.md` dagi eslatma qoidasi oʻzgarmaydi — u faqat sanani oʻqiydi (0024).
- Testda tekshiriladi: eksportdan keyin faylda sana turishi; 40 kun oldingi sanali fayl import
  qilingach eslatma darhol koʻrinishi; bugungi sanali fayldan keyin koʻrinmasligi. Vitest
  qatlami, eslatmaning ekranda koʻrinishi Playwright (0040).
