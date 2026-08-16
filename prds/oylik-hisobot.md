# Oylik hisobot

Sana: 2026-08-16. Asos: `prds/daftar-prd.md` (22–25-bandlar, va shu featurega tegishli 6, 7,
15-bandlar). Qarorlar: 0013, 0017, 0018, 0019, 0021, 0023, 0026, 0038, 0042, 0043, 0044, 0045.

Nima uchun: Foydalanuvchi oy oxirida «pul qayerga ketdi» degan savolga javob oladi. Kirim va
chiqim yigʻindisi, ular orasidagi farq va kategoriyalar ajratmasi bir ekranda turadi; qarz esa
alohida qatorda, chunki u sarflangan pul emas.

## Nima qiladi

### Davr

1. Ochilganda joriy kalendar oyni koʻrsatadi. (PRD 22; 0018)
2. Foydalanuvchi boshqa oyni tanlashi mumkin. (PRD 22; 0018)
3. Foydalanuvchi sanadan sanagacha istalgan davrni koʻrsatishi mumkin. (PRD 22; 0018)

### Raqamlar

4. Tanlangan davr uchun koʻrsatadi: jami kirim, jami chiqim, ular orasidagi farq.
   (PRD 23; 0019)
5. Kategoriyalar boʻyicha ajratma beradi — kirim va chiqim uchun alohida. (PRD 24; 0019)
5a. Har kategoriya qatori valyuta boʻyicha alohida koʻrsatiladi («oziq-ovqat: 800 000 soʻm» va
   «oziq-ovqat: 20 $» — ikki qator). Taxminiy kurs ishlatilmaydi. Valyuta qatori faqat oʻsha
   valyutada yozuv bor davrda paydo boʻladi. (PRD 24; 0038)
6. Qarz uchun alohida qator boʻladi: bu davrda qarzga berilgan va qarzdan qaytgan summa. Bu
   summalar «jami chiqim» va «jami kirim» raqamlariga qoʻshilmaydi. (PRD 25; 0017)
6a. Qarz qatori ham valyuta boʻyicha alohida koʻrsatiladi va oʻsha qoidaga boʻysunadi.
   (PRD 25; 0038)
7. Yashirilgan kategoriyadagi eski yozuvlar hisobotda koʻrinishda qoladi. (PRD 15; 0013)

### Valyuta

8. Valyutalar ikkita: **soʻm** va **dollar**. (PRD 6; 0026)
9. Aralash valyutali davrda qoldiqlar valyuta boʻyicha alohida qatorda turadi, tagida oxirgi
   kiritilgan kurs boʻyicha «≈ jami soʻmda» taxminiy qatori boʻladi va uning taxminiyligi
   koʻrinadi. (PRD 7; 0023)
10. Biror valyutaning kursi hali kiritilmagan boʻlsa, ilova taxminiy jamini hisoblashdan oldin
    kursni soʻraydi. (PRD 7; 0023)
10a. Soʻralgan kurs sanasi bilan saqlanadi — soʻrov bir marta boʻladi, ilova qayta ochilganda
    takrorlanmaydi. Kurs butun soʻmda va zaxira fayliga kiradi. (0042, 0043, 0045)
10b. Bu yerdagi «oxirgi kiritilgan kurs» — eng kech **sanali** yozuv yoki toʻlovdagi kurs (bir xil
    sanada oxirgi kiritilgani gʻolib); qoʻlda soʻralgan kurs kiritilgan kundagi qiymat sifatida
    qatnashadi. Hisobot davri bilan bogʻliq emas: oʻtgan oy hisobotida ham eng yangi maʼlum kurs
    ishlatiladi. (0044)
10c. Bu qiymat saqlanmaydi — hisobot har ochilganda joriy yozuv va toʻlovlardan hisoblanadi.
    (0045)

## Nima QILMAYDI

- Hisobotni PDF, CSV yoki rasm qilib chiqarish; ulashish tugmasi. (PRD; 0021)
- Oʻtgan oy bilan solishtirish. (0019)
- Kursni internetdan olish; kurs tarixini saqlash. (0002, 0010)
- Yozuvlar boʻyicha qidiruv va filtr. (0002)
- Budjet chegarasi va undan oshganda ogohlantirish. (0002)
- Soliq yoki buxgalteriya hisoboti. (AGENTS.md)
- «Oy yopish» holati — hisobot har safar joriy maʼlumatdan qayta hisoblanadi. (0014)

## Qanday tekshiramiz

0022 boʻyicha: bu qism testi oʻtmaguncha tayyor emas. Mezonlar sanab boʻladigan:

1. Hisobot ochilganda joriy kalendar oy tanlangan boʻladi.
2. Oldingi oyga oʻtilsa, oʻsha oyning raqamlari koʻrsatiladi.
3. Sanadan sanagacha davr tanlansa, faqat oʻsha oraliqdagi yozuvlar sanaladi.
4. Oyning birinchi kunidagi yozuv oʻsha oy hisobotiga kiradi.
5. Oyning oxirgi kunidagi yozuv oʻsha oy hisobotiga kiradi.
6. Davrdan tashqaridagi yozuv hisobotga kirmaydi.
7. Jami kirim — davrdagi hamma kirim yozuvining yigʻindisi.
8. Jami chiqim — davrdagi hamma chiqim yozuvining yigʻindisi.
9. Farq = jami kirim − jami chiqim.
10. Kategoriyalar ajratmasidagi chiqim summalari yigʻindisi «jami chiqim» ga teng — har
    valyutada alohida va aniq (taxminsiz).
10a. Aralash valyutali oyda soʻm kategoriya summalari «jami chiqim (soʻm)» ga, dollar summalari
    «jami chiqim (dollar)» ga teng.
10b. Dollarda yozuv boʻlmagan oyda kategoriya jadvalida dollar qatori umuman chizilmaydi.
10c. Qarz qatori ham valyuta boʻyicha ajratilgan holda koʻrsatiladi.
11. Kategoriyalar ajratmasi kirim va chiqim uchun alohida koʻrsatiladi.
12. Yashirilgan kategoriyadagi eski yozuv ajratmada koʻrinadi.
13. Davrda qarzga berilgan summa alohida qatorda koʻrsatiladi.
14. Davrda qarzdan qaytgan summa alohida qatorda koʻrsatiladi.
15. Qarzga berilgan summa «jami chiqim» ichiga kirmaydi.
16. Qarzdan qaytgan summa «jami kirim» ichiga kirmaydi.
17. Yozuvi boʻlmagan davrda raqamlar nol boʻlib koʻrinadi va ekran xato bermaydi.
18. Yozuv tahrirlangandan keyin hisobot darhol yangi raqamni koʻrsatadi.
19. Aralash valyutali davrda soʻm va dollar yigʻindilari alohida qatorda koʻrsatiladi.
20. «≈ jami soʻmda» qatori taxminiy ekani belgilangan holda koʻrinadi.
21. Dollar kursi hech qachon kiritilmagan holatda taxminiy jami hisoblanishidan oldin kurs
    soʻraladi; kiritilgach jami toʻliq chiqadi.

## Ochiq savollar

Yoʻq. Bu spec yozilayotganda bitta savol chiqdi va u hal qilindi:

1. Aralash valyuta kategoriyalar ajratmasida va qarz qatorida qanday koʻrsatiladi → **0038**:
   har qator valyuta boʻyicha alohida, taxminiy kurs ishlatilmaydi, valyuta qatori faqat oʻsha
   valyutada yozuv bor davrda paydo boʻladi (5a va 6a-bandlar). Shu bilan 10-mezon aniq
   tenglik sifatida tekshiriladigan boʻldi.
