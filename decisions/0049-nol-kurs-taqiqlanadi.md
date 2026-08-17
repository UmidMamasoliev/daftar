# 0049 — Nol kurs taqiqlanadi

Sana: 2026-08-17

Nima hal qilindi: Kurs — **musbat** butun son. Kurs maydoniga `0` kiritilsa yozuv (yoki qarz
toʻlovi) saqlanmaydi va «Kurs notoʻgʻri» xabari koʻrsatiladi. Bu 0042 ga aniqlik: 0042 kursning
butun soʻmda ekanini belgilagan edi, quyi chegarani emas.

Nega: 0033 dagi «nol saqlanmaydi» qoidasi faqat **summaga** tegishli edi — kurs maydoni undan
tashqarida qolgan edi. Nol kurs esa jimgina xato beradi: dollardagi yozuvning soʻmdagi qiymati
nolga aylanadi, «≈ jami soʻmda» qatori va oylik hisobot notoʻgʻri chiqadi, lekin hech qayerda
xato koʻrinmaydi — raqam shunchaki kichrayadi. Manfiy kurs allaqachon 0033 ruhida yoʻq; nol ham
oʻsha yerga qoʻshiladi.

Nimani oʻzgartiradi:
- Kurs maydonining tekshiruvi: butun son (0042), musbat, boʻsh emas (0023). Uchalasi ham
  saqlashdan oldin tekshiriladi va xato boʻlsa saqlash bajarilmaydi.
- Xabar matni: «Kurs notoʻgʻri» — oʻzbekcha lotin yozuvida (0009).
- Bu yozuv formasidagi kursga ham, qarz toʻlovidagi kursga ham, «≈ jami soʻmda» uchun qoʻlda
  soʻraladigan kursga ham bir xil tegishli (0023, 0043).
- Testda tekshiriladi: kurs `0` bilan yozuv saqlanmaydi va «Kurs notoʻgʻri» koʻrsatiladi; qarz
  toʻlovida ham shunday; nol kursli yozuv saqlanmagani uchun hisobot raqamlari buzilmaydi. Sof
  tekshiruv boʻlgani uchun Vitest qatlami (0040).
