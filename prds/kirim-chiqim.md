# Kirim-chiqim yozuvlari

Sana: 2026-08-17 (birinchi variant 2026-08-16). Asos: `prds/daftar-prd.md` (8–15-bandlar, va shu
featurega tegishli 5, 6-band).
Qarorlar: 0011, 0012, 0013, 0014, 0023, 0026, 0028, 0029, 0032, 0033, 0034, 0042, 0043, 0044,
0045, 0047, 0048, 0049, 0050, 0051, 0057.

Nima uchun: Foydalanuvchi pulning har harakatini — kirimni ham, chiqimni ham — bir necha
soniyada yozib qoʻyadi va qoʻlidagi hamda kartadagi pul qanchaligini bilib turadi. Bu daftarning
poydevori: qolgan uch qism (qarz daftari, oylik hisobot, dashboard) shu yozuvlar ustida ishlaydi.

## Nima qiladi

### Yozuv qoʻshish

1. Yozuv qoʻshadi. Majburiy: summa, kirim yoki chiqim ekani, kategoriya. (PRD 8; 0012)
1a. Summa soʻmda butun son, dollarda ikki kasrgacha (sent). Nol summa saqlanmaydi, manfiy son
   kiritilmaydi, yuqori chegara yoʻq. (PRD 8; 0033)
1a1. «Yuqori chegara yoʻq» — mahsulot qoidasi: daftar odamning summasini cheklamaydi. Lekin
   hisob butunligi uchun texnik chegara bor: summalar butun sonda saqlanadi (0008, 0033) va
   JavaScript butun sonni faqat xavfsiz chegaragacha (`Number.MAX_SAFE_INTEGER`,
   9 007 199 254 740 991) aniq hisoblaydi. Undan oshgan qiymat jimgina notoʻgʻri raqamga
   aylanadi, shuning uchun bunday summa **saqlanmaydi** va xato koʻrsatiladi. Bu yangi qaror
   emas — 0008 va 0033 dan kelib chiqadigan texnik zarurat.
1a2. Shu chegara saqlanadigan qiymatga tegishli: soʻmda soʻm, dollarda sent (0008, 0033).
   Kurs maydoniga ham xuddi shu chegara qoʻyiladi (0042, 0049), hamda summa kurs bilan
   aylantirilgandagi natijaga ham — natija chegaradan oshsa yozuv saqlanmaydi.
1b. Tur («kirim» yoki «chiqim») uchun standart qiymat yoʻq: forma ochilganda hech biri
   tanlanmagan boʻladi va foydalanuvchi har safar oʻzi tanlaydi. Tanlanmasa yozuv saqlanmaydi
   va sabab koʻrsatiladi. (0050; 0012)
2. Sana avtomatik ravishda bugungi kun boʻladi; foydalanuvchi uni oʻzgartira oladi, lekin faqat
   bugungi yoki undan oldingi kunga. Bu qoida daftardagi hamma operatsiyada bir xil — qarz va
   qarz toʻlovida ham. (PRD 9; 0012, 0034)
3. Izoh ixtiyoriy — boʻsh qoldirilsa ham yozuv saqlanadi. (PRD 10; 0012)
4. Hisob formada tayyor turadi, standart — **karta**; naqd kerak boʻlsa almashtiriladi.
   (PRD 11; 0011)
5. Hisob ikkita: **naqd** va **karta**. Yangi hisob qoʻshib boʻlmaydi. (PRD 5; 0011)
6. Valyuta formada tayyor turadi, standart — **soʻm**. Tegilmasa kurs soʻralmaydi. Boshqa
   valyuta tanlansa, kurs maydoni ochiladi va oʻsha holatda majburiy boʻladi. (PRD 12; 0023)
6a. Kurs maydoniga **1 dollar necha soʻm** ekani kiritiladi. (PRD 12; 0023)
6b. Kurs — butun son, soʻmda (masalan 12 500). Kurs maydoni kasr qabul qilmaydi va saqlashda ham
   butun soʻm boʻlib turadi. (PRD 12; 0042)
6b1. Kurs **musbat** boʻlishi shart: `0` kiritilsa yozuv saqlanmaydi va «Kurs notoʻgʻri»
   koʻrsatiladi. Manfiy son ham kiritilmaydi. Yaʼni kurs tekshiruvi uchta shartdan iborat —
   boʻsh emas (0023), butun son (0042), musbat (0049). (PRD 12; 0049)
6c. Kiritilgan kurs yozuvning ichida saqlanadi. «≈ jami soʻmda» qatori uchun ishlatiladigan
   «oxirgi kurs» esa alohida saqlanmaydi — u kerak boʻlganda yozuvlar va qarz toʻlovlaridagi
   kurslardan hisoblab topiladi. Bu kurs tarixi emas: hisob natijasi bitta qiymat. (0045; 0043,
   0002)
6d. Hisob qoidasi: «oxirgi kurs» — eng kech **sanali** yozuv yoki qarz toʻlovidagi kurs. Yozuv
   sanasi hisoblanadi, kiritish vaqti emas; yaʼni oʻtgan sanaga kiritilgan yozuvning kursi
   bugungi qiymatni bosib ketmaydi. (0044)
6e. Bir xil sanada bir nechta kurs boʻlsa, oʻsha sananing **oxirgi kiritilgani** gʻolib. Buning
   uchun har yozuv va toʻlov `yaratilgan` vaqti bilan saqlanadi — «oxirgi kiritilgani» aynan shu
   maydondan aniqlanadi. (0044, 0047)
6f. «≈ jami soʻmda» uchun qoʻlda soʻralgan kurs ham shu hisobda teng qatnashadi — u kiritilgan
   kundagi qiymat sifatida. Uning ortida yozuv boʻlmagani uchun u sanasi bilan saqlanadi; bu
   daftarda saqlanadigan yagona kurs qiymati. (0044, 0045; 0023, 0043)
6g. Kursli yozuv yoki toʻlov tahrirlansa yoxud oʻchirilsa, «oxirgi kurs» va «≈ jami soʻmda»
   qatori yangi holatdan qayta hisoblanadi — hech qayerda eski nusxa qolmaydi. (0045; 0014)
6h. `yaratilgan` — texnik maydon: foydalanuvchiga koʻrsatilmaydi, u kirita olmaydi va yozuv
   tahrirlanganda oʻzgarmaydi. Foydalanuvchi koʻradigan va oʻzgartira oladigan sana — 2-banddagi
   `sana`. Bu oʻzgarish tarixi emas (0014). (0047)
7. Valyutalar ikkita: **soʻm** va **dollar**. (PRD 6; 0026)

### Yozuvlar ekrani, tahrirlash va oʻchirish

8. Har qanday yozuvni tahrirlaydi va oʻchiradi, jumladan oʻtgan oydagilarni ham. Oʻzgarish
   tarixi saqlanmaydi. (PRD 13; 0014)
8a. Alohida «yozuvlar» ekrani boʻladi: hamma yozuv sana boʻyicha tartiblangan holda turadi va
   pastga aylantirib koʻriladi. Tahrirlash va oʻchirish shu ekrandan bajariladi. (PRD 15a; 0032)
9. Oʻchirish tasdiqsiz darhol bajariladi, lekin **7 soniya** «qaytarish» tugmasi turadi; muddat
   tugagach tugma yoʻqoladi va oʻchirish yakuniy boʻladi. (PRD 13; 0029, 0048)
9a. «Qaytarish» bir vaqtda faqat bitta oʻchirishga tegishli: u turganda ikkinchi yozuv
   oʻchirilsa, birinchisi oʻsha zahoti yakuniy boʻladi va muddat yangi yozuv uchun boshidan
   sanaladi. Ekrandan chiqib ketilsa yoki ilova yopilsa ham tugma yoʻqoladi va oʻchirish yakuniy
   boʻladi. Muddat hisobi tugma koʻringan lahzadan boshlanadi, toʻxtatib turilmaydi.
   (0029, 0048)

### Kategoriyalar

10. Kategoriyalar tayyor roʻyxat bilan keladi; foydalanuvchi oʻz kategoriyasini qoʻsha oladi va
    keraksizini yashira oladi. Kirim va chiqim uchun roʻyxatlar alohida. (PRD 14; 0013)
11. Tayyor roʻyxat — chiqim: oziq-ovqat, transport, ijara, kommunal, sogʻliq, kiyim,
    koʻngilochar, boshqa; kirim: oylik, qoʻshimcha daromad, sovgʻa. (PRD 14; 0028)
11a. Nom bandligi tekshiruvi yashirilgan kategoriyalarni ham qamraydi: yashirilgan kategoriya
    nomi bilan yangi kategoriya qoʻshish rad etiladi — dublikat yaratilmaydi. Xato xabari shu
    nomdagi kategoriya yashirilganini aytadi va uni «Koʻrsatish» bilan qaytarish mumkinligini
    koʻrsatadi; ilova kategoriyani oʻzi koʻrsatib yubormaydi. Xabar matni `design/` da.
    (0051; 0013)
11b. **Tahrirlash rejimida** chiplarda koʻrinadigan (yashirilmagan) kategoriyalar va ustiga shu
    yozuvning oʻz kategoriyasi chiqadi — u yashirilgan boʻlsa ham, tanlangan holatda. Boshqa
    yashirilgan kategoriyalar chiqmaydi: foydalanuvchi oʻz kategoriyasini saqlab qola oladi,
    lekin yashirilgan boshqasiga oʻta olmaydi. (0057; 0013)
12. Yashirilgan kategoriyadagi eski yozuvlar joyida qoladi va hisobotda koʻrinadi; ular faqat
    yangi yozuv tanlovida chiqmaydi. (PRD 15; 0013)

## Nima QILMAYDI

- Takrorlanuvchi yozuvlar (ijara, oylik toʻlov) — qoʻshilmaydi. (0002)
- Chek yoki kvitansiya rasmini biriktirish. (0002)
- Budjet chegarasi va undan oshganda ogohlantirish. (0002)
- Yozuvlar boʻyicha qidiruv va filtr — «yozuvlar» ekranida ham yoʻq. (0002, 0032)
- Kelajakdagi sana bilan yozuv; rejalashtirilgan yoki kutilayotgan yozuv. (0034)
- Soʻmda tiyin kiritish; nol yoki manfiy summa. (0033)
- Nol yoki manfiy kurs. (0049)
- Soʻm va dollardan boshqa valyuta; valyuta qoʻshish yoki tahrirlash. (0026)
- Kursni internetdan avtomatik olish; kurs tarixini saqlash. (0002, 0010)
- Kasrli kurs kiritish — kurs faqat butun soʻmda. (0042)
- Yangi hisob qoʻshish yoki mavjudini oʻchirish. (0011)
- Yozuvning oʻzgarish tarixi, audit izi, «oy yopish» holati. (0014)
- Oʻchirishdan oldin tasdiq oynasi — uning oʻrnida «qaytarish» tugmasi ishlaydi. (0029)
- Kategoriyani butunlay oʻchirish — faqat yashirish bor. (0013)

## Qanday tekshiramiz

0022 boʻyicha: bu qism testi oʻtmaguncha tayyor emas. Mezonlar sanab boʻladigan:

1. Soʻmdagi chiqim yozuvi uchta maydon bilan saqlanadi: summa, chiqim, kategoriya.
2. Shu uchtadan biri boʻsh boʻlsa yozuv saqlanmaydi va sabab koʻrsatiladi.
3. Yangi forma ochilganda sana bugungi kun, hisob «karta», valyuta «soʻm» boʻlib turadi; tur
   («kirim» yoki «chiqim») esa **tanlanmagan** boʻlib turadi (0050).
3a. Tur tanlanmasdan saqlashga urinilsa yozuv saqlanmaydi va sabab koʻrsatiladi (0050; 2-mezon
   bilan bir xil qoida).
4. Sana oʻtgan kunga oʻzgartirilsa, yozuv oʻsha sanada saqlanadi.
4a. Sana tanlagichda ertangi va undan keyingi kunlar tanlanmaydi.
4b. Soʻmda kasrli summa qabul qilinmaydi; dollarda ikki kasrli summa qabul qilinadi.
4c. Nol summa saqlanmaydi va sabab koʻrsatiladi.
4d. Manfiy son kiritilmaydi.
4e. Xavfsiz butun son chegarasidan (`Number.MAX_SAFE_INTEGER`) oshgan summa saqlanmaydi va xato
   koʻrsatiladi; chegaraning oʻzi va undan kichik qiymat saqlanadi (0008, 0033).
4f. Xuddi shu chegaradan oshgan kurs ham saqlanmaydi va xato koʻrsatiladi.
4g. Summa kurs bilan aylantirilgandagi natija chegaradan oshsa yozuv saqlanmaydi va xato
   koʻrsatiladi.
5. Izohi boʻsh yozuv saqlanadi.
6. Valyuta «dollar» ga oʻzgartirilsa kurs maydoni ochiladi; kurs boʻsh qolsa yozuv saqlanmaydi.
6a. Kurs `0` kiritilsa yozuv saqlanmaydi va «Kurs notoʻgʻri» koʻrsatiladi; manfiy kurs ham
   kiritilmaydi (0049).
7. Valyuta soʻmligicha qolsa kurs maydoni koʻrinmaydi va yozuvda kurs saqlanmaydi.
8. Chiqim saqlanganda tanlangan hisobning oʻsha valyutadagi qoldigʻi shu summaga kamayadi;
   kirim saqlanganda koʻpayadi.
9. Dollardagi yozuv tanlangan hisobning dollar qoldigʻiga tushadi va soʻm qoldigʻiga tegmaydi.
10. Tahrirlangan yozuv qoldiqni darhol yangilaydi; eski qiymat hech qayerda qolmaydi.
11. Oʻchirilgan yozuv roʻyxatdan darhol yoʻqoladi va «qaytarish» tugmasi koʻrinadi; tugma
    bosilsa yozuv ham, qoldiq ham tiklanadi.
12. «Qaytarish» tugmasi 7 soniya turadi: shu vaqt ichida bosilsa yozuv qaytadi, 7 soniyadan
    keyin tugma yoʻqoladi va oʻsha yozuv qaytmaydi (0048).
12a. «Qaytarish» turganda ikkinchi yozuv oʻchirilsa, birinchi yozuv qaytmaydi (yakuniy boʻlgan)
    va tugma ikkinchisi uchun 7 soniya turadi (0029, 0048).
12b. «Qaytarish» turganda boshqa ekranga oʻtilsa yoki ilova yopilib qayta ochilsa, tugma yoʻq va
    oʻchirilgan yozuv qaytmaydi (0029, 0048).
13. Yangi kategoriya qoʻshilgach u yozuv formasidagi roʻyxatda koʻrinadi.
14. Yashirilgan kategoriya yangi yozuv roʻyxatida chiqmaydi, lekin oʻsha kategoriyadagi eski
    yozuv joyida qoladi va hisobotda koʻrinadi.
14a. Yashirilgan kategoriya nomi bilan yangi kategoriya qoʻshishga urinilsa, qoʻshish rad
    etiladi: kategoriyalar soni oʻzgarmaydi, dublikat paydo boʻlmaydi (0051).
14b. Shu holatdagi xato xabari kategoriya yashirilganini aytadi va «Koʻrsatish» yoʻlini
    koʻrsatadi; kategoriyaning oʻzi yashirilganicha qoladi — avtomatik koʻrsatilmaydi (0051).
14c. Yashirilgan kategoriyali yozuv tahrirlashga ochilsa, oʻsha kategoriya chiplarda tanlangan
    holda koʻrinadi; boshqa yashirilgan kategoriyalar chiplarda yoʻq (0057).
14d. Shu yozuvning faqat izohi oʻzgartirilib saqlansa, kategoriya oʻzgarmaydi va yashirilganicha
    qoladi (0057).
15. Tayyor roʻyxat 0028 dagi nomlar bilan keladi: chiqimda sakkizta, kirimda uchta.
16. Kirim kategoriyasi chiqim yozuvida tanlanmaydi va aksincha.
17. Internet oʻchirilgan holda yozuv saqlanadi va ilova qayta ochilganda joyida turadi.
18. «Yozuvlar» ekranida oʻtgan oydagi yozuv topiladi, tahrirlanadi va oʻchiriladi.
19. «Yozuvlar» ekranida yozuvlar sana boʻyicha tartiblangan holda turadi.
20. «Yozuvlar» ekranida oʻchirilgan yozuv uchun ham «qaytarish» tugmasi ishlaydi.
21. Dollardagi yozuvda kurs «1 dollar necha soʻm» sifatida saqlanadi: masalan 100 $ va kurs
    12 500 kiritilsa, yozuvning soʻmdagi qiymati 1 250 000 boʻladi.
22. Kurs maydoniga kasrli qiymat (masalan 12 500,25) kiritilmaydi; saqlangan kurs butun son
    boʻlib turadi (0042).
23. Dollardagi yozuv kursi bilan saqlangach, «≈ jami soʻmda» qatori uchun kurs alohida
    soʻralmaydi — oxirgi kurs ishlatiladi (0023, 0043).
23a. Bugungi sanali yozuv 12 500 kurs bilan saqlangandan keyin oʻtgan sanaga 12 000 kursli yozuv
    kiritilsa, «oxirgi kurs» 12 500 boʻlib qoladi (0044).
23b. Eng kech sanali yozuv sifatida 12 800 kursli yozuv kiritilsa, «oxirgi kurs» 12 800 ga
    oʻtadi (0044).
23c. Bir xil sanada 12 500, keyin 12 600 kursli ikkita yozuv kiritilsa, «oxirgi kurs»
    12 600 boʻladi (0044).
23d. «≈ jami soʻmda» uchun qoʻlda kurs soʻralib javob berilgach, u kiritilgan kundagi qiymat
    sifatida qatnashadi: oʻsha kundan oldingi sanali yozuv uni almashtirmaydi, oʻsha kunda
    kiritilgan keyingi kurs esa almashtiradi (0044).
23e. Eng kech sanali kursli yozuv oʻchirilsa, «≈ jami soʻmda» qatori qolgan yozuvlardan qayta
    hisoblanadi — oxirgi kurs undan oldingi eng kech sanali yozuvnikiga oʻtadi (0045).
23f. Eng kech sanali yozuvning kursi tahrirlanib boshqa qiymatga oʻzgartirilsa, «≈ jami soʻmda»
    darhol yangi kurs bilan hisoblanadi (0045; 0014).
23g. Daftarda birorta ham kursli yozuv qolmasa, «≈ jami soʻmda» uchun qoʻlda soʻralgan kurs
    ishlatiladi; u ham boʻlmasa kurs soʻraladi (0045; 0023).
23h. Saqlangan har yozuvda `yaratilgan` vaqti boʻladi; bir xil sanada ketma-ket kiritilgan
    ikkita yozuvning `yaratilgan` qiymatlari har xil va tartibi kiritish tartibiga mos (0047).
23i. Bir xil sanadagi ikkita kursli yozuvdan **birinchisi** tahrirlansa, gʻolib kurs baribir
    keyin kiritilganiniki boʻlib qoladi — tahrir `yaratilgan` ni oʻzgartirmaydi (0047).

## Ochiq savollar

Bu spec yozilayotganda uchta savol chiqdi va hammasi hal qilindi:

1. Eski yozuvga qanday yetib boriladi → **0032**: alohida «yozuvlar» ekrani (PRD 15a). Shu
   bilan PRD 13-band bajariladigan boʻldi.
2. Summa qanday kiritiladi va nima qabul qilinmaydi → **0033**: soʻmda butun, dollarda ikki
   kasr; nol va manfiy son yoʻq; yuqori chegara yoʻq.
3. Kelajakdagi sana mumkinmi → **0034**: yoʻq, faqat bugun va undan oldin.

Kurs yoʻnalishi ham tasdiqlandi va 0023 ga yozildi: «1 dollar necha soʻm».

2026-08-16 da kursga tegishli yana ikkita savol yopildi va spec ularga moslandi: **0042** — kurs
butun soʻmda kiritiladi va saqlanadi (6b-band), aylantirishda eng yaqiniga yaxlitlanadi;
**0043** — kiritilgan kurs «oxirgi kurs» sifatida saqlanadi va «≈ jami soʻmda» qatorida
ishlatiladi (6c-band).

Shu kunning oʻzida uchinchi savol ham yopildi: «oxirgi kurs» qaysi kiritishdan yangilanadi →
**0044**: eng kech sanali yozuv yoki toʻlovdagi kurs; bir xil sanada oxirgi kiritilgani gʻolib;
qoʻlda soʻralgan kurs esa kiritilgan kundagi qiymat sifatida qatnashadi (6d–6f-bandlar,
23a–23d-mezonlar).

Toʻrtinchi savol ham oʻsha kuni yopildi: «oxirgi kurs» qanday saqlanadi → **0045**: saqlanmaydi,
yozuv va toʻlovlardan hisoblab topiladi; faqat qoʻlda soʻralgan kurs sanasi bilan saqlanadi
(6c, 6f, 6g-bandlar, 23e–23g-mezonlar).

Beshinchi savol ham oʻsha kuni yopildi: bir xil sanadagi kurslardan qaysi biri «oxirgi
kiritilgani» ekani nimadan aniqlanadi → **0047**: har yozuv va qarz toʻlovi `yaratilgan` vaqt
maydoni bilan saqlanadi, u faylga kiradi va tahrirlashda oʻzgarmaydi (6e, 6h-bandlar,
23h–23i-mezonlar).

Bu specda ochiq savol qolmadi.
