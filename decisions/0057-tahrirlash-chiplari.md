# 0057 — Tahrirlashda chiplar: koʻrinadiganlar + yozuvning oʻz kategoriyasi

Sana: 2026-08-17

Nima hal qilindi: 0013 ga aniqlik. Mavjud yozuvni tahrirlash rejimida kategoriya chiplarida:

1. Hamma **koʻrinadigan** (yashirilmagan) kategoriyalar chiqadi — yangi yozuv formasidagidek;
2. Ustiga **shu yozuvning oʻz kategoriyasi** ham chiqadi, u yashirilgan boʻlsa ham — tanlangan
   holatda;
3. Boshqa yashirilgan kategoriyalar chiqmaydi.

Yaʼni tahrirlashda foydalanuvchi oʻz yozuvining kategoriyasini koʻradi va uni saqlab qola oladi,
lekin yashirilgan boshqa kategoriyalarga oʻta olmaydi.

Nega: 0013 «yashirilgan kategoriya **yangi yozuv tanlovida** chiqmaydi» deydi — tahrirlash
haqida jim. Ikkala tomonni ham buzmaslik kerak edi: yashirish vaʼdasi (keraksiz kategoriya
roʻyxatni toʻldirmasin) tahrirlashda ham amal qilsin, eski yozuv esa buzilmasin. Yozuvning oʻz
kategoriyasini chiplardan olib tashlash foydalanuvchini yozuvni oʻzgartirishga majburlardi:
izohni tuzatmoqchi boʻlgan odam kategoriyani ham almashtirishga majbur boʻlardi va hisobot
oʻzgarib ketardi. Bu 0013 dagi «yashirilgan kategoriyadagi eski yozuvlar joyida qoladi»
qoidasiga zid boʻlardi.

Koʻrilgan boshqa variant:
- **Tahrirlashda hamma kategoriya chiqadi** (yashirilganlar ham). Rad etildi: yashirish vaʼdasi
  tahrirlashda amal qilmasdi — foydalanuvchi ataylab yashirgan kategoriyalar roʻyxatga qaytib
  kelardi va u ularni yana tanlay olardi.

Nimani oʻzgartiradi:
- `prds/kirim-chiqim.md` kategoriyalar boʻlimiga band va tekshirish mezoni qoʻshiladi.
- Chiplar roʻyxati tahrirlash rejimida yozuvga qarab tuziladi: koʻrinadiganlar + shu yozuvning
  kategoriyasi (agar u yashirilgan boʻlsa).
- Testda tekshiriladi: yashirilgan kategoriyali yozuv tahrirlashga ochilganda oʻz kategoriyasi
  chiplarda tanlangan holda koʻrinadi; boshqa yashirilgan kategoriya chiplarda yoʻq; izoh
  oʻzgartirilib saqlansa kategoriya oʻsha yashirilganicha qoladi. Vitest qatlami (0040).
