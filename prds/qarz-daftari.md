# Qarz daftari

Sana: 2026-08-16. Asos: `prds/daftar-prd.md` (16–21-bandlar, va shu featurega tegishli 6, 8, 9,
12, 21-bandlar). Qarorlar: 0015, 0016, 0017, 0023, 0026, 0029, 0030, 0031, 0033, 0034, 0035,
0037.

Nima uchun: Foydalanuvchi «falonchiga qancha qoldi» degan savolga aniq javob oladi. Qarz
haqiqatda boʻlib-boʻlib toʻlanadi va esdan chiqadi; daftar kim bilan qanday hisobi borligini,
qancha toʻlanganini va qancha qolganini oʻzi hisoblab turadi.

## Nima qiladi

### Kontaktlar

1. Kontaktlar roʻyxatini yuritadi (doʻst, qarindosh). Kontaktlar daftar ichida qoʻlda
   yaratiladi. (PRD 16; 0015)
2. Kontakt ikki maydondan iborat: ism (majburiy) va telefon raqami (ixtiyoriy). (PRD 16; 0031)
3. Ochiq qarzi bor kontakt oʻchirilmaydi. (PRD 16; 0030)
4. Hamma qarzi yopilgan kontakt esa yopilgan qarz tarixi bilan birga oʻchadi. (PRD 16; 0030)
5. Kontakt oʻchirilganda «qaytarish» tugmasi ishlaydi: bosilsa kontakt ham, uning qarz tarixi
   ham qaytadi. (0030, 0029)

### Qarzlar

6. Har qarz bitta kontaktga bogʻlanadi. Ikki yoʻnalish bor: men qarz berdim va men qarz oldim.
   (PRD 17; 0015)
7. Kontakt ostida uning hamma qarzi va umumiy qoldigʻi koʻrinadi. (PRD 18; 0015)
7a. Qoldiq har valyuta uchun bitta raqam: «berdim» va «oldim» oʻzaro ayiriladi (netto),
   valyutalar aralashtirilmaydi. Raqam yoʻnalish bilan koʻrsatiladi — kim kimga qarzdor.
   Qatorlar faqat qarzi bor valyutada koʻrinadi. Berdim/oldim tarixi kontakt ichidagi
   operatsiyalar roʻyxatida koʻrinadi. (PRD 18; 0037)
7b. Netto faqat koʻrsatish uchun: qarzning yopilishi har qarzning oʻz qoldigʻi bilan
   aniqlanadi (0016), netto bilan emas. (0037)
8. Qarzga qisman toʻlov yoziladi; qoldiq oʻzi hisoblanadi va hech qayerda saqlanmaydi. Qoldiq
   nolga yetganda qarz yopilgan hisoblanadi. (PRD 19; 0016)
9. Toʻlovni oʻchirishda «qaytarish» tugmasi ishlaydi va qaytarilsa qoldiq tiklanadi.
   (PRD 19; 0029)
10. Qarz oʻz valyutasida yuritiladi: dollar qarzining qoldigʻi dollarda turadi. Toʻlov boshqa
    valyutada kelsa, toʻlov paytida kiritilgan kurs boʻyicha qarz valyutasiga aylantirilib
    qoldiqdan ayiriladi. (PRD 20; 0023)
11. Qarz operatsiyalari pul qoldigʻiga taʼsir qiladi: qarzga berilgan pul qoʻldan chiqadi,
    olingan qarz qoʻlga kiradi. (PRD 21; 0017)
11a. Qarz va toʻlov formasida hisob tanlanadi, standart — **karta**; naqd kerak boʻlsa
    almashtiriladi. Pul tanlangan hisobdan chiqadi yoki unga tushadi. (PRD 21; 0035)

### Umumiy qoidalar

12. Valyutalar ikkita: **soʻm** va **dollar**. (PRD 6; 0026)
13. Summa soʻmda butun son, dollarda ikki kasrgacha; nol summa saqlanmaydi, manfiy son
    kiritilmaydi, yuqori chegara yoʻq. Bu qoidalar qarz summasiga ham, toʻlov summasiga ham
    tegishli. (PRD 8; 0033)
14. Qarz berish, qarz olish va qarz toʻlovi sanasi faqat bugungi yoki undan oldingi kun.
    (PRD 9; 0034)
15. Kurs maydoniga **1 dollar necha soʻm** ekani kiritiladi. (PRD 12; 0023)

## Nima QILMAYDI

- Qarz muddati va muddat eslatmasi. (0016)
- Bildirishnoma va push xabar. (0003)
- Kontaktni telefon kitobidan olish — ism ham, raqam ham qoʻlda kiritiladi. (0015)
- Qarz qoldigʻini dashboardda alohida raqam sifatida koʻrsatish. (PRD 28; 0020)
- Qarz summasini oylik hisobotdagi «jami kirim» va «jami chiqim» ichiga qoʻshish. (PRD 25; 0017)
- Qarzni kategoriyaga bogʻlash. (0017)
- Qarzlar boʻyicha qidiruv va filtr. (0002)
- Qarz oʻzgarish tarixi va audit izi. (0014)
- Kelajakdagi sana bilan qarz yoki toʻlov. (0034)

## Qanday tekshiramiz

0022 boʻyicha: bu qism testi oʻtmaguncha tayyor emas. Mezonlar sanab boʻladigan:

1. Ismi kiritilgan kontakt saqlanadi; telefon boʻsh boʻlsa ham saqlanadi.
2. Ismi boʻsh kontakt saqlanmaydi va sabab koʻrsatiladi.
3. Kontaktga «berdim» yoʻnalishida qarz qoʻshiladi va u kontakt ostida koʻrinadi.
4. Kontaktga «oldim» yoʻnalishida qarz qoʻshiladi va u kontakt ostida koʻrinadi.
5. 1 000 000 soʻm qarz berilib 300 000 soʻm toʻlov yozilsa, qoldiq 700 000 soʻm boʻladi.
6. Yana 700 000 soʻm toʻlov yozilsa, qoldiq nol boʻladi va qarz yopilgan holatga oʻtadi.
7. Toʻlovlar tarixi qarz ostida sana bilan koʻrinadi.
8. Toʻlov oʻchirilsa qoldiq darhol oʻsha summaga ortadi.
9. Toʻlov oʻchirilgach «qaytarish» tugmasi koʻrinadi; bosilsa toʻlov ham, qoldiq ham tiklanadi.
10. 100 $ qarz berilib, toʻlov 625 000 soʻm va kurs 12 500 bilan kiritilsa, qoldiq 50 $ boʻladi.
11. Shu holatda qoldiq dollarda koʻrsatiladi, soʻmda emas.
12. Dollardagi qarzga dollarda toʻlov kiritilsa kurs soʻralmaydi.
13. Qarz berilganda tanlangan hisob qoldigʻi shu summaga kamayadi.
14. Qarz olinganda tanlangan hisob qoldigʻi shu summaga ortadi.
15. Qarz toʻlovi kelganda tanlangan hisob qoldigʻi shu summaga ortadi (men bergan qarzga toʻlov).
15a. Qarz formasi ochilganda hisob «karta» boʻlib turadi; «naqd» ga almashtirilsa summa naqd
    qoldigʻiga tushadi va karta qoldigʻiga tegmaydi.
15b. Qarz operatsiyalaridan keyin ham naqd va karta qoldiqlarining yigʻindisi umumiy qoldiqqa
    teng boʻlib qoladi.
15c. Kontaktga 100 $ berilib undan 30 $ olingan boʻlsa, kontakt kartasida 70 $ koʻrsatiladi.
15d. Shu kontaktda soʻm qarzi boʻlmasa, soʻm qatori umuman chiqmaydi.
15e. Kontaktga 100 $ berilib undan 100 $ olingan boʻlsa, netto nol koʻrinadi, lekin ikkala
    qarz ham ochiq sanaladi va kontakt oʻchirilmaydi.
16. Ochiq qarzi bor kontaktni oʻchirish urinishi rad etiladi va sabab koʻrsatiladi.
17. Hamma qarzi yopilgan kontakt oʻchiriladi va uning yopilgan qarz yozuvlari ham ketadi.
18. Shu oʻchirishdan keyin «qaytarish» bosilsa, kontakt va uning qarz tarixi qaytadi.
19. Soʻmdagi qarzga kasrli summa kiritilmaydi; dollardagiga ikki kasr kiritiladi.
20. Nol summali qarz va nol summali toʻlov saqlanmaydi.
21. Qarz va toʻlov sanasi tanlagichida ertangi kun tanlanmaydi.
22. Internet oʻchirilgan holda qarz va toʻlov saqlanadi va ilova qayta ochilganda joyida turadi.

## Ochiq savollar

Yoʻq. Bu spec yozilayotganda ikkita savol chiqdi va ikkalasi ham hal qilindi:

1. Qarz operatsiyasi qaysi hisobga tegadi → **0035**: formada tanlanadi, standart karta
   (11a-band).
2. Kontaktning «umumiy qoldigʻi» qanday hisoblanadi → **0037**: yoʻnalishlar netto, valyutalar
   alohida (7a-band); netto qarz yopilishiga taʼsir qilmaydi (7b-band).
