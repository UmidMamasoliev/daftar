# 0051 — Yashirilgan kategoriya nomi bilan yangi kategoriya qoʻshish rad etiladi, xato yoʻl koʻrsatadi

Sana: 2026-08-17

Nima hal qilindi: 0013 ga aniqlik. Foydalanuvchi **yashirilgan** kategoriya nomi bilan yangi
kategoriya qoʻshmoqchi boʻlsa:

1. Qoʻshish **bajarilmaydi** — ikkinchi, dublikat kategoriya yaratilmaydi.
2. Xato xabari nima boʻlganini aytadi: shu nomdagi kategoriya bor, u **yashirilgan**, va uni
   «Koʻrsatish» bilan qaytarish mumkin. Yaʼni xabar yoʻl koʻrsatadi, shunchaki toʻsmaydi.
3. Yashirilgan kategoriya oʻz holida qoladi — ilova uni oʻzi koʻrsatib yubormaydi.

Xabarning aniq matni `design/` da yoziladi (0039); bu qaror faqat xulqni belgilaydi.

Nega: Nom band, lekin foydalanuvchi sababini koʻrmaydi — roʻyxatda oʻsha kategoriya yoʻq
(yashirilgan), shuning uchun «bunday kategoriya bor» degan xabar unga qarama-qarshi
koʻrinadi va u nomni oʻzgartirib dublikat yasashga oʻtadi. Xatoning oʻzi yechimni koʻrsatsa,
foydalanuvchi bir qadamda toʻgʻri joyga boradi.

Koʻrilgan boshqa variantlar:
- **Oddiy «Bunday kategoriya bor» xabari.** Rad etildi: foydalanuvchi nomning nega band ekanini
  tushunmaydi — koʻrinmayotgan narsa toʻsib turadi.
- **Avtomatik koʻrsatish** (nom mos kelsa, yashirilgan kategoriya oʻz-oʻzidan qaytadi). Rad
  etildi: kutilmagan yon taʼsir — foydalanuvchi yangi kategoriya yaratdim deb oʻylaydi, aslida
  eski kategoriya oʻzining eski yozuvlari bilan qaytadi.

Nimani oʻzgartiradi:
- `prds/kirim-chiqim.md` kategoriyalar boʻlimiga bitta band va tekshirish mezoni qoʻshiladi.
- Nom bandligi tekshiruvi yashirilgan kategoriyalarni ham qamraydi — ular roʻyxatda
  koʻrinmasa ham mavjud (0013).
- Testda tekshiriladi: yashirilgan kategoriya nomi bilan qoʻshish urinishi rad etiladi, xato
  kategoriya yashirilganini aytadi, kategoriyalar soni oʻzgarmaydi va yashirilgan kategoriya
  yashirilganicha qoladi. Vitest qatlami (0040).
