# 0064 — Hisobotda qarz bloki: toʻrt yoʻnalish, toʻlov oʻz valyutasida

Sana: 2026-08-17
**Bosh agent vakolat bilan tanladi (0058)**

Nima hal qilindi:

**(a) Qarz blokida toʻrt yoʻnalish koʻrinadi**, valyuta boʻyicha alohida (0038):

| Qator | Ishora | Nima sanaladi |
|---|---|---|
| **Qarzga berildi** | − | davrda «berdim» yoʻnalishida ochilgan qarzlar |
| **Qarzdan qaytdi** | + | davrda «berdim» qarzlariga kelgan toʻlovlar |
| **Qarz olindi** | + | davrda «oldim» yoʻnalishida ochilgan qarzlar |
| **Qarz qaytarildi** | − | davrda «oldim» qarzlariga qilingan toʻlovlar |

Toʻrttasi ham «jami kirim» va «jami chiqim» raqamlariga qoʻshilmaydi (0017).

**(b) Qarz toʻlovi hisobotda kiritilgan summasi bilan, oʻz valyutasida sanaladi** — qarz
valyutasiga aylantirilgan qiymati bilan emas. Yaʼni 625 000 soʻm toʻlov dollar qarziga tushgan
boʻlsa ham hisobotning **soʻm** qatorida 625 000 soʻm boʻlib turadi.

**(c) Kategoriya qatori bosilmaydi:** qatordan yozuvlar roʻyxatiga oʻtish (drill-down), filtr va
saralash yoʻq (0002).

Nega:

- (a) Spec faqat «berilgan» va «qaytgan» ni sanagan edi (`prds/oylik-hisobot.md` 6-band), lekin
  qarz **olish** ham, uni **qaytarish** ham haqiqiy pul harakati (0017, 0035): olingan qarz
  hisobga tushadi, qaytarilgani hisobdan chiqadi. Ular hisobotda koʻrinmasa, oyning eng katta
  pul harakati javobsiz qolardi: qoldiq oʻzgargan, hisobot esa sababini koʻrsatmaydi. 0017 ning
  «qarz alohida qatorda turadi» maqsadi ikkala yoʻnalishga birdek tegishli — u qarzni kirim va
  chiqimdan ajratadi, yoʻnalishlarning birini oʻchirmaydi.
- (b) Hisobotning har qatori qoʻlda sanab koʻrsa toʻgʻri chiqadigan boʻlishi kerak (0038 ruhi:
  valyutalar aralashtirilmaydi, taxmin ishlatilmaydi). Aylantirilgan qiymat esa toʻlov paytidagi
  kursga bogʻlangan (0023, 0042) va oʻsha kurs hisobotning boshqa hech bir qatorida qatnashmaydi
  — natijada qator na chekdan, na daftardan tekshirib boʻladigan boʻlardi. Kiritilgan summa esa
  haqiqatda qoʻldan chiqqan yoki qoʻlga kirgan pul.
- (c) Qidiruv va filtr v1 chegarasidan tashqarida (0002); bosiladigan qator ularning eshigi
  boʻlardi.

Koʻrilgan boshqa variantlar:
- **Faqat berilgan qarzlarni koʻrsatish (ikki qator).** Rad etildi: yuqoridagi boʻshliq — olingan
  qarz va uning qaytarilishi hisobotdan tushib qolardi.
- **Toʻrt yoʻnalishni ikkita netto qatorga yigʻish** («qarz harakati: +N»). Rad etildi: berilgan
  qarz bilan qaytarilgan qarz bir-birini yeb qoʻyardi va qator nimadan yigʻilgani koʻrinmasdi.
- **Toʻlovni qarz valyutasiga aylantirilgan qiymatda sanash.** Rad etildi: tekshirib boʻlmaydigan
  qator paydo boʻlardi (yuqoridagi (b) sababi) va bitta toʻlov ikki valyutada ikki xil raqam
  bilan koʻrinardi.
- **Kategoriya qatorini bosiladigan qilish.** Rad etildi: 0002 (qidiruv va filtr yoʻq).

Nimani oʻzgartiradi:
- `prds/oylik-hisobot.md`: 6-band toʻrt qatorga yoyiladi, toʻlov valyutasi qoidasi va
  «bosilmaydi» qatori qoʻshiladi; mezonlar sanab boʻladigan boʻlib yoziladi.
- `AGENTS.md`: oʻqish roʻyxatida «0064 gacha» va qarz qatorlari haqida bir qator.
- Testda tekshiriladi: toʻrt qator alohida chiqadi va hech biri «jami kirim»/«jami chiqim» ga
  qoʻshilmaydi; dollar qarziga kelgan soʻm toʻlovi soʻm qatorida kiritilgan summasi bilan
  turadi; yozuvi va qarzi boʻlmagan valyutada qator umuman chizilmaydi. Sof hisob boʻlgani uchun
  Vitest qatlami (0040).
