# Oylik hisobot

Sana: 2026-08-16 (oxirgi qoʻshimcha: 2026-08-17). Asos: `prds/daftar-prd.md` (22–25-bandlar, va
shu featurega tegishli 6, 7, 15-bandlar). Qarorlar: 0002, 0013, 0017, 0018, 0019, 0021, 0023,
0026, 0035, 0038, 0042, 0043, 0044, 0045, 0064.

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
5b. Kategoriya qatori **bosilmaydi**: qatordan yozuvlar roʻyxatiga oʻtish, filtr va saralash
   yoʻq. (0064; 0002)
6. Qarz uchun alohida blok boʻladi va uning summalari «jami chiqim» va «jami kirim»
   raqamlariga qoʻshilmaydi. (PRD 25; 0017)
6a. Qarz qatorlari ham valyuta boʻyicha alohida koʻrsatiladi va 5a dagi qoidaga boʻysunadi:
   taxminiy kurs ishlatilmaydi, valyuta qatori faqat oʻsha valyutada harakat bor davrda paydo
   boʻladi. (PRD 25; 0038)
6b. Blokda **toʻrt yoʻnalish** koʻrinadi — har biri oʻz qatori bilan:
   - **«Qarzga berildi»** (−) — davrda «berdim» yoʻnalishida ochilgan qarzlar;
   - **«Qarzdan qaytdi»** (+) — davrda «berdim» qarzlariga kelgan toʻlovlar;
   - **«Qarz olindi»** (+) — davrda «oldim» yoʻnalishida ochilgan qarzlar;
   - **«Qarz qaytarildi»** (−) — davrda «oldim» qarzlariga qilingan toʻlovlar.
   Ishoralar pulning haqiqiy yoʻnalishini koʻrsatadi (0017, 0035). (0064)
6c. **Qarz toʻlovi hisobotda kiritilgan summasi bilan, oʻz valyutasida** sanaladi — qarz
   valyutasiga aylantirilgan qiymati bilan emas. Dollar qarziga tushgan 625 000 soʻmlik toʻlov
   hisobotning soʻm qatorida 625 000 soʻm boʻlib turadi. Qarzning oʻzi esa oʻz valyutasidagi
   qatorda sanaladi. (0064; 0038, 0023)
6d. Qarzning ochilgan sanasi va toʻlovning sanasi alohida qaraladi: har biri **oʻz sanasi**
   tushgan davrda sanaladi. (0064; 0018)
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
- Yozuvlar boʻyicha qidiruv va filtr; kategoriya yoki qarz qatoridan yozuvlar roʻyxatiga oʻtish
  (drill-down). (0002; 0064)
- Qarz qatorlarini bitta netto raqamga yigʻish — toʻrt yoʻnalish alohida turadi. (0064)
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
14a. Davrda **olingan** qarz «Qarz olindi» qatorida koʻrsatiladi (+ ishorasi bilan).
14b. Davrda olingan qarzga qilingan toʻlov «Qarz qaytarildi» qatorida koʻrsatiladi
    (− ishorasi bilan).
14c. Toʻrt qator bir-biriga qoʻshilmaydi va bitta netto raqamga yigʻilmaydi: har biri oʻz
    yigʻindisi bilan turadi (6b).
14d. Har qator davrdagi tegishli qarz va toʻlovlarning oddiy yigʻindisiga **aynan teng** —
    taxminiy kurs qatnashmaydi.
14e. Dollar qarziga kelgan 625 000 soʻmlik toʻlov soʻm qatorida 625 000 soʻm boʻlib sanaladi;
    oʻsha toʻlov dollar qatoriga umuman tushmaydi (6c).
14f. Bir qarz 25-yanvarda ochilib toʻlovi 3-fevralda qilingan boʻlsa, qarz yanvar hisobotida,
    toʻlov esa fevral hisobotida sanaladi (6d).
14g. Davrda faqat soʻmda qarz harakati boʻlsa, qarz blokida dollar qatori umuman chizilmaydi;
    umuman qarz harakati boʻlmagan davrda blokning oʻzi chiqmaydi (6a).
15. Qarzga berilgan va qarz qaytarilgan summalar «jami chiqim» ichiga kirmaydi.
16. Qarzdan qaytgan va qarz olingan summalar «jami kirim» ichiga kirmaydi.
16a. Qarz harakati kiritilgandan keyin ham «jami chiqim» kategoriya summalari yigʻindisiga
    (10-mezon) aynan teng boʻlib qoladi — qarz qatorlari bu tenglikka umuman kirmaydi.
16b. Kategoriya qatori bosilganda hech narsa boʻlmaydi — yozuvlar roʻyxati ochilmaydi (5b).
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

2026-08-17 da dizayn uchta savol ochdi va bosh agent ularni 0058 vakolati bilan yopdi →
**0064**: qarz blokida toʻrt yoʻnalish koʻrinadi (6b-band, 13, 14, 14a–14g-mezonlar); qarz
toʻlovi kiritilgan summasi bilan oʻz valyutasida sanaladi (6c-band, 14e-mezon); kategoriya
qatori bosilmaydi (5b-band, 16b-mezon).

Bu specda ochiq savol qolmadi.
