# Dashboard

Sana: 2026-08-16. Asos: `prds/daftar-prd.md` (26–28-bandlar, va shu featurega tegishli 3, 6, 7,
15a, 26a, 30-bandlar). Qarorlar: 0006, 0011, 0017, 0018, 0020, 0023, 0024, 0026, 0032, 0035,
0036, 0042, 0043, 0044, 0045, 0053, 0054.

Nima uchun: Bu — ilova ochilganda koʻrinadigan birinchi va eng koʻp koʻriladigan ekran.
Foydalanuvchi bir qarashda pul qanchaligini va oy qanday ketayotganini koʻradi, keyin bitta
tugma bilan yangi yozuv qoʻshadi.

## Nima qiladi

### Ekran tarkibi

1. Ilovaning bosh sahifasi: ochilganda hech qanday parol yoki PIN soʻralmaydi, darhol shu
   ekran koʻrinadi. (PRD 3; 0006)
2. Joriy qoldiqni koʻrsatadi — valyuta boʻyicha ajratilgan va taxminiy jami bilan.
   (PRD 26; 0020, 0023)
2a. Umumiy qoldiq tagida naqd qoldigʻi va karta qoldigʻi alohida qatorlarda koʻrsatiladi; har
   biri valyuta boʻyicha ajratilgan holda (naqd: 1 200 000 soʻm va 100 $).
   (PRD 26a; 0036, 0023)
3. Joriy oy kirimi va chiqimini koʻrsatadi. (PRD 26; 0020)
4. Oxirgi yozuvlar roʻyxatini koʻrsatadi. (PRD 26; 0020)
5. Yozuv qoʻshish tugmasi shu ekranda doim koʻrinib turadi. (PRD 27; 0020)
6. Qarz qoldigʻi dashboardda alohida raqam sifatida koʻrsatilmaydi — u oʻz boʻlimida.
   (PRD 28; 0020)
7. Oxirgi eksportdan 30 kun oʻtsa yoki daftar hech qachon eksport qilinmagan boʻlsa, bir
   qatorlik zaxira eslatmasi koʻrinadi. Shart bajarilmasa eslatma turmaydi. (PRD 30; 0024)
7a. Eslatma faqat oxirgi eksport sanasini oʻqiydi; oʻsha sanani qoʻlda olingan eksport ham,
   import oldidagi avtomatik zaxira ham yangilaydi (0054), import esa uni fayldagi qiymat bilan
   almashtiradi (0053). Yaʼni eski zaxira tiklangandan keyin eslatma darhol chiqishi mumkin —
   bu toʻgʻri holat. Sana `prds/zaxira.md` (5, 9a, 26–26b-bandlar) da yuritiladi.

### Qoldiq qanday hisoblanadi

8. Qarz operatsiyalari pul qoldigʻiga taʼsir qiladi: qarzga berilgan pul qoʻldan chiqadi,
   olingan qarz qoʻlga kiradi. (PRD 21; 0017)
8a. Qarz ham hisobga bogʻlangani uchun naqd va karta qoldiqlarining yigʻindisi umumiy qoldiqqa
   har doim teng boʻladi. (PRD 21; 0035)
9. Valyutalar ikkita: **soʻm** va **dollar**. (PRD 6; 0026)
10. Aralash valyutada qoldiqlar valyuta boʻyicha alohida qatorda turadi, tagida oxirgi
    kiritilgan kurs boʻyicha «≈ jami soʻmda» taxminiy qatori boʻladi va uning taxminiyligi
    koʻrinadi. (PRD 7; 0023)
11. Biror valyutaning kursi hali kiritilmagan boʻlsa, ilova taxminiy jamini hisoblashdan oldin
    kursni soʻraydi. (PRD 7; 0023)
11a. Soʻralgan kurs sanasi bilan saqlanadi — soʻrov bir marta boʻladi, ilova qayta ochilganda
    takrorlanmaydi. Kurs zaxira fayliga kiradi va import bilan tiklanadi. Kurs butun soʻmda.
    (0042, 0043, 0045)
11b. Bu yerdagi «oxirgi kiritilgan kurs» — eng kech **sanali** yozuv yoki toʻlovdagi kurs (bir xil
    sanada oxirgi kiritilgani gʻolib); qoʻlda soʻralgan kurs kiritilgan kundagi qiymat sifatida
    qatnashadi. (0044)
11c. Bu qiymat saqlanmaydi — qator har koʻrsatilganda joriy yozuv va toʻlovlardan hisoblanadi.
    Yozuv tahrirlansa yoki oʻchirilsa «≈ jami soʻmda» keyingi koʻrinishida yangi holatdan
    chiqadi. (0045)
12. «Joriy oy» — kalendar oy. (PRD 22; 0018)

### Yozuvlarga oʻtish

13. Toʻliq yozuvlar roʻyxati alohida «yozuvlar» ekranida turadi; dashboarddagi roʻyxat qisqa
    koʻrinish boʻlib qoladi. (PRD 15a; 0032)

## Nima QILMAYDI

- Kirish ekrani, PIN yoki parol soʻrash. (0006)
- Qarz qoldigʻini alohida raqam sifatida koʻrsatish. (PRD 28; 0020)
- Yozuvlar boʻyicha qidiruv va filtr. (0002)
- Budjet chegarasi va undan oshganda ogohlantirish. (0002)
- Oʻtgan oy bilan solishtirish. (0019)
- Bildirishnoma va push xabar — zaxira eslatmasi faqat ekrandagi qator. (0003, 0024)
- Kursni internetdan olish. (0010)

## Qanday tekshiramiz

0022 boʻyicha: bu qism testi oʻtmaguncha tayyor emas. Mezonlar sanab boʻladigan:

1. Ilova ochilganda parol yoki PIN soʻralmaydi va dashboard darhol koʻrinadi.
2. Boʻsh daftarda qoldiq nol boʻlib koʻrinadi va ekran xato bermaydi.
3. Soʻmdagi chiqim yozuvi qoʻshilgach qoldiq shu summaga kamayadi.
4. Soʻmdagi kirim yozuvi qoʻshilgach qoldiq shu summaga ortadi.
5. Qarz berilgach qoldiq shu summaga kamayadi.
6. Qarz olingach qoldiq shu summaga ortadi.
7. Joriy oy kirimi — shu kalendar oydagi kirim yozuvlarining yigʻindisi.
8. Joriy oy chiqimi — shu kalendar oydagi chiqim yozuvlarining yigʻindisi.
9. Oʻtgan oydagi yozuv joriy oy raqamlariga qoʻshilmaydi.
10. Oxirgi qoʻshilgan yozuv dashboarddagi roʻyxatda darhol koʻrinadi.
11. Qarz qoldigʻi dashboardda alohida raqam sifatida koʻrinmaydi.
12. Soʻm va dollar qoldiqlari alohida qatorda koʻrsatiladi.
12a. Umumiy qoldiq tagida naqd va karta qatorlari koʻrinadi.
12b. Naqd va karta qoldiqlarining yigʻindisi umumiy qoldiqqa teng — kirim-chiqim yozuvlari ham,
    qarz operatsiyalari ham kiritilgandan keyin.
12c. Naqdda dollar boʻlmasa, naqd qatorida dollar koʻrsatkichi chizilmaydi.
13. «≈ jami soʻmda» qatori taxminiy ekani belgilangan holda koʻrinadi.
14. Dollar kursi hech qachon kiritilmagan holatda taxminiy jami hisoblanishidan oldin kurs
    soʻraladi; kiritilgach jami toʻliq chiqadi.
14a. Kurs bir marta kiritilgach ilova qayta ochilganda uni qayta soʻramaydi (0043).
14b. Kurs soʻrovi maydoniga kasrli qiymat kiritilmaydi — faqat butun soʻm (0042).
15. Hech qachon eksport qilinmagan daftarda zaxira eslatmasi koʻrinadi.
16. Eksport qilingandan keyin eslatma yoʻqoladi.
17. Oxirgi eksportdan 30 kundan kam oʻtgan boʻlsa eslatma koʻrinmaydi.
18. Oxirgi eksportdan 30 kundan koʻp oʻtgan boʻlsa eslatma qayta koʻrinadi.
19. Yozuv qoʻshish tugmasi ekranda koʻrinib turadi va yozuv formasini ochadi.
20. Toʻliq yozuvlar roʻyxatiga oʻtish yoʻli shu ekrandan mavjud.
21. Internet oʻchirilgan holda dashboard ochiladi va qoldiqni koʻrsatadi.

## Ochiq savollar

Yoʻq. Bu spec yozilayotganda bitta savol chiqdi va u hal qilindi:

1. Naqd va karta qoldiqlari qayerda koʻrinadi → **0036**: dashboardda, umumiy qoldiq tagida
   alohida qatorlarda (2a-band). Shu bilan 0011 ning sababi — «qoʻldagi pulni sanab tekshirish»
   — amalda bajariladigan boʻldi.
