# Daftar — mahsulot tavsifi (v1)

Sana: 2026-08-16. Asos: `decisions/0001`–`0038` (hammasi majburiy).
Bu hujjat butun mahsulotni tavsiflaydi. Har qism uchun alohida spec keyin yoziladi:
`prds/kirim-chiqim.md`, `prds/qarz-daftari.md`, `prds/oylik-hisobot.md`, `prds/dashboard.md`.

## Kim ishlatadi va nima uchun

Foydalanuvchi — oʻz pulini sanayotgan **bitta odam** (0001, 0005). Doʻkon egasi emas, buxgalter
emas, jamoa emas.

U hozir uchta narsani qogʻoz daftarda yoki boshida saqlaydi va uchalasi ham yoʻqoladi:
- **Pul qayerda va qancha** — kartada qancha, qoʻlda qancha ekani aniq emas.
- **Kim bilan qarz-hisobi bor** — «Akmalga qancha qoldi» degan savolga aniq javob yoʻq, qisman
  toʻlangan qarz esdan chiqadi.
- **Oy qanday oʻtdi** — pul qayerga ketgani oy oxirida bilinmaydi.

Daftar shu uchtasini bitta joyga yigʻadi. U brauzerda ochiladi (0003): hech narsa oʻrnatilmaydi,
roʻyxatdan oʻtilmaydi, havola bilan ochiladi va oflayn ishlaydi. Telefonda ham, kompyuterda ham
bir xil.

**Daftar darajasidagi vosita** — kundalik yozuv va oddiy hisob. Buxgalteriya dasturi emas.

## Nima qiladi

### Umumiy

1. Brauzerda ochiladi, birinchi ochilishdan keyin internetsiz toʻliq ishlaydi, telefon ekraniga
   oʻrnatsa boʻladi (0003).
2. Hamma maʼlumot foydalanuvchi qurilmasida saqlanadi; hech narsa serverga yuborilmaydi (0004).
3. Ochilganda hech qanday parol yoki PIN soʻralmaydi — darhol dashboard koʻrinadi (0006, 0020).
4. Interfeys faqat oʻzbekcha, lotin yozuvida (0009).
5. Ikkita tayyor hisob bor: **naqd** va **karta**. Yangi hisob qoʻshib boʻlmaydi (0011).
6. Ikkita valyutani biladi: **soʻm** va **dollar** (0026). Har hisob qoldigʻi valyuta boʻyicha
   ajratib koʻrsatiladi (naqd: 1 200 000 soʻm va 100 $) — hisob valyutaga boʻlinmaydi (0023).
7. Aralash valyutali joylarda qoldiqlar alohida qatorda turadi, tagida oxirgi kiritilgan kurs
   boʻyicha «≈ jami soʻmda» taxminiy qatori boʻladi va uning taxminiyligi koʻrinadi (0023).
   «Oxirgi kurs» — eng kech sanali yozuv yoki toʻlovdagi kurs (0044); u saqlanmaydi, har safar
   hisoblanadi (0045). Biror valyutaning kursi hali kiritilmagan boʻlsa, ilova taxminiy jamini
   hisoblashdan oldin kursni soʻraydi va oʻsha javob sanasi bilan saqlanadi (0023, 0043).

### Kirim-chiqim yozuvlari

8. Yozuv qoʻshadi. Majburiy: summa, kirim yoki chiqim ekani, kategoriya (0012). Summa soʻmda
   butun son, dollarda ikki kasrgacha (sent); nol summa saqlanmaydi, manfiy son kiritilmaydi,
   yuqori chegara yoʻq (0033). Tur uchun standart qiymat yoʻq — foydalanuvchi har safar oʻzi
   tanlaydi (0050).
9. Sana avtomatik ravishda bugungi kun boʻladi; foydalanuvchi uni oʻzgartira oladi, lekin faqat
   bugungi yoki undan oldingi kunga — kelajak sanasi kiritilmaydi (0012, 0034).
10. Izoh ixtiyoriy — boʻsh qoldirilsa ham yozuv saqlanadi (0012).
11. Hisob formada tayyor turadi, standart — **karta**; naqd kerak boʻlsa almashtiriladi (0011).
12. Valyuta formada tayyor turadi, standart — **soʻm**. Tegilmasa kurs soʻralmaydi. Boshqa
    valyuta tanlansa, kurs maydoni ochiladi va oʻsha holatda majburiy boʻladi. Kursga
    **1 dollar necha soʻm** ekani kiritiladi (0023); kurs musbat butun son, nol qabul
    qilinmaydi (0042, 0049).
13. Har qanday yozuvni tahrirlaydi va oʻchiradi, jumladan oʻtgan oydagilarni ham. Oʻzgarish
    tarixi saqlanmaydi (0014). Oʻchirish tasdiqsiz darhol bajariladi, lekin 7 soniya
    «qaytarish» tugmasi turadi (0029, 0048).
14. Kategoriyalar tayyor roʻyxat bilan keladi; foydalanuvchi oʻz kategoriyasini qoʻsha oladi va
    keraksizini yashira oladi. Kirim va chiqim uchun roʻyxatlar alohida (0013). Tayyor roʻyxat —
    chiqim: oziq-ovqat, transport, ijara, kommunal, sogʻliq, kiyim, koʻngilochar, boshqa;
    kirim: oylik, qoʻshimcha daromad, sovgʻa (0028).
15. Yashirilgan kategoriyadagi eski yozuvlar joyida qoladi va hisobotda koʻrinadi; ular faqat
    yangi yozuv tanlovida chiqmaydi (0013).
15a. Alohida «yozuvlar» ekrani boʻladi: hamma yozuv sana boʻyicha tartiblangan holda turadi va
    pastga aylantirib koʻriladi. Yozuvni tahrirlash va oʻchirish shu ekrandan bajariladi —
    13-band shu ekran orqali bajariladigan boʻladi (0032).

### Qarz daftari

16. Kontaktlar roʻyxatini yuritadi (doʻst, qarindosh). Kontaktlar daftar ichida qoʻlda
    yaratiladi (0015). Kontakt ikki maydondan iborat: ism (majburiy) va telefon raqami
    (ixtiyoriy) (0031). Ochiq qarzi bor kontakt oʻchirilmaydi; hamma qarzi yopilgan kontakt
    esa yopilgan qarz tarixi bilan birga oʻchadi (0030).
17. Har qarz bitta kontaktga bogʻlanadi. Ikki yoʻnalish bor: men qarz berdim va men qarz
    oldim (0015).
18. Kontakt ostida uning hamma qarzi va umumiy qoldigʻi koʻrinadi (0015). Qoldiq har valyuta
    uchun bitta raqam: **ochiq** qarzlar boʻyicha «berdim» va «oldim» oʻzaro ayiriladi,
    valyutalar aralashtirilmaydi; qatorlar faqat ochiq qarzi bor valyutada koʻrinadi
    (0037, 0056).
19. Qarzga qisman toʻlov yoziladi; qoldiq oʻzi hisoblanadi va hech qayerda saqlanmaydi. Qoldiq
    nolga yetganda — aniqrogʻi dollarda 1 sentdan, soʻmda 100 soʻmdan oshmaganda — qarz yopilgan
    hisoblanadi (0016, 0052). Toʻlovni oʻchirishda ham «qaytarish» tugmasi ishlaydi va
    qaytarilsa qoldiq tiklanadi (0029).
20. Qarz oʻz valyutasida yuritiladi: dollar qarzining qoldigʻi dollarda turadi. Toʻlov boshqa
    valyutada kelsa, toʻlov paytida kiritilgan kurs boʻyicha qarz valyutasiga aylantirilib
    qoldiqdan ayiriladi (0023).
21. Qarz operatsiyalari pul qoldigʻiga taʼsir qiladi: qarzga berilgan pul qoʻldan chiqadi,
    olingan qarz qoʻlga kiradi (0017). Qarz va toʻlov formasida hisob tanlanadi, standart —
    **karta**; pul tanlangan hisobdan chiqadi yoki unga tushadi (0035).

### Oylik hisobot

22. Ochilganda joriy kalendar oyni koʻrsatadi. Foydalanuvchi boshqa oyni tanlashi yoki sanadan
    sanagacha istalgan davrni koʻrsatishi mumkin (0018).
23. Tanlangan davr uchun koʻrsatadi: jami kirim, jami chiqim, ular orasidagi farq (0019).
24. Kategoriyalar boʻyicha ajratma beradi — kirim va chiqim uchun alohida (0019). Har
    kategoriya qatori valyuta boʻyicha alohida koʻrsatiladi, taxminiy kurs ishlatilmaydi;
    valyuta qatori faqat oʻsha valyutada yozuv bor davrda paydo boʻladi (0038).
25. Qarz uchun alohida qator boʻladi: bu davrda qarzga berilgan va qarzdan qaytgan summa. Bu
    summalar «jami chiqim» va «jami kirim» raqamlariga qoʻshilmaydi (0017). Qarz qatori ham
    valyuta boʻyicha alohida koʻrsatiladi (0038).

### Dashboard

26. Ilovaning bosh sahifasi. Koʻrsatadi: joriy qoldiq (valyuta boʻyicha ajratilgan va taxminiy
    jami), joriy oy kirimi va chiqimi, oxirgi yozuvlar roʻyxati (0020, 0023).
26a. Umumiy qoldiq tagida naqd qoldigʻi va karta qoldigʻi alohida qatorlarda koʻrsatiladi;
    har biri valyuta boʻyicha ajratilgan holda (0036, 0023).
27. Yozuv qoʻshish tugmasi shu ekranda doim koʻrinib turadi (0020).
28. Qarz qoldigʻi dashboardda alohida raqam sifatida koʻrsatilmaydi — u oʻz boʻlimida (0020).

### Zaxira nusxa

29. Butun daftarni bitta faylga chiqaradi va oʻsha faylni qaytarib yuklaydi. Fayl yozuvlar,
    qarzlar, kontaktlar, kategoriyalar va hisoblarni oʻz ichiga oladi (0007). Import qilishdan
    oldin ilova joriy maʼlumotni avtomatik faylga chiqarib beradi, keyin fayldagisi ustiga
    yoziladi; zaxira saqlanmasa import bajarilmaydi (0027).
30. Oxirgi eksportdan 30 kun oʻtsa yoki daftar hech qachon eksport qilinmagan boʻlsa,
    dashboardda bir qatorlik eslatma koʻrinadi. Shart bajarilmasa eslatma turmaydi (0024).

## Nima QILMAYDI

Bu roʻyxat chegarani belgilaydi. Bu yerdagi narsalar v1 da **qurilmaydi**.

**Mahsulot chegarasi:**
- Buxgalteriya hisoboti, soliq hisoboti, 1C bilan bogʻlanish — loyihaning ishi emas (AGENTS.md).
- Biznes tushunchalari: mijoz, yetkazib beruvchi, doʻkon kassasi, savdo tahlili (0001).
- Xodim, rollar, kirish huquqi darajalari (0001).
- Koʻp foydalanuvchi, daftarni ulashish, oila birga yuritishi (0005).

**Texnik chegara:**
- Server, foydalanuvchi hisobi, roʻyxatdan oʻtish (0004).
- Qurilmalar orasida sinxronizatsiya — telefondagi yozuv kompyuterda koʻrinmaydi (0004).
- PIN, parol, barmoq izi — ilovaning oʻz kirish himoyasi (0006).
- Bildirishnoma va push xabar (0003).
- Avtomatik bulut zaxirasi (0007).

**Funksional chegara:**
- Takrorlanuvchi yozuvlar (ijara, oylik toʻlov) (0002).
- Chek rasmini biriktirish (0002).
- Budjet chegarasi va undan oshganda ogohlantirish (0002).
- Yozuvlar boʻyicha qidiruv va filtr — «yozuvlar» ekranida ham yoʻq (0002, 0032).
- Kelajakdagi sana bilan yozuv; rejalashtirilgan yoki kutilayotgan yozuv (0034).
- Valyuta kursi tarixi; kurs internetdan avtomatik olinmaydi (0002, 0010).
- Soʻm va dollardan boshqa valyuta; valyuta qoʻshish (0026).
- Yangi hisob qoʻshish yoki mavjudini oʻchirish (0011).
- Yozuv oʻzgarish tarixi, audit izi, «oy yopish» holati (0014).
- Qarz muddati va muddat eslatmasi (0016).
- Hisobotni PDF, CSV yoki rasm qilib chiqarish, ulashish tugmasi (0021).
- Oylik hisobotda oʻtgan oy bilan solishtirish (0019).
- Rus tili, krill yozuvi, til tanlash sozlamasi (0009).

## Qanday tekshiramiz

0022 boʻyicha: toʻrt qism ishlaydi va testlari oʻtadi. Testi oʻtmagan qism tayyor emas.
Mahsulot darajasidagi mezonlar — hammasi sanab boʻladigan:

1. Yangi daftarda soʻmdagi chiqim yozuvi uch maydon bilan saqlanadi (summa, chiqim, kategoriya)
   va dashboarddagi karta qoldigʻi shu summaga kamayadi.
2. Dollarda yozuv kiritilganda kurs maydoni ochiladi; kurs kiritilmasa yozuv saqlanmaydi.
3. Kontaktga 100 $ qarz berilib, keyin soʻmda toʻlov kiritilsa, qoldiq dollarda koʻrsatiladi va
   toʻlov paytidagi kurs boʻyicha kamayadi.
4. Oylik hisobotda qarzga berilgan summa «jami chiqim» ichiga kirmaydi va alohida qatorda turadi.
5. Oyning birinchi va oxirgi kunidagi yozuvlar oʻsha oy hisobotiga kiradi.
6. Eksport fayli olinadi, brauzer maʼlumoti tozalanadi, fayl import qilinadi — hamma yozuv,
   qarz va kontakt qaytadi.
6a. Import boshlanganda joriy maʼlumot avtomatik faylga chiqariladi; zaxira saqlanmasa import
   toʻxtaydi va mavjud maʼlumot oʻzgarmaydi.
6b. Oʻchirilgan yozuv «qaytarish» tugmasi bosilsa joyiga qaytadi; qarz toʻlovi qaytarilsa qarz
   qoldigʻi ham tiklanadi.
6c. Ochiq qarzi bor kontaktni oʻchirib boʻlmaydi; hamma qarzi yopilgan kontakt esa qarz tarixi
   bilan birga oʻchadi va «qaytarish» tugmasi bosilsa ikkalasi ham qaytadi.
7. Hech qachon eksport qilinmagan daftarda dashboardda zaxira eslatmasi koʻrinadi; eksportdan
   keyin u yoʻqoladi.
8. Internet oʻchirilgan holda ilova ochiladi va yangi yozuv saqlanadi.
9. Kursi hech qachon kiritilmagan valyuta boʻlsa, taxminiy jami hisoblanishidan oldin kurs
   soʻraladi va javobdan keyin jami toʻliq chiqadi.
10. Interfeysning birorta ekranida ruscha yoki krill matn yoʻq.
11. Soʻmda kasrli summa qabul qilinmaydi; dollarda ikki kasr qabul qilinadi; nol summa va
    manfiy son saqlanmaydi.
12. Sana tanlagichda ertangi kun tanlanmaydi.
13. «Yozuvlar» ekranida oʻtgan oydagi yozuv topiladi, tahrirlanadi va oʻchiriladi.
14. Naqd va karta qoldiqlarining yigʻindisi dashboarddagi umumiy qoldiqqa teng — qarz
    operatsiyalari kiritilgandan keyin ham.
15. Kontaktga 100 $ berilib undan 30 $ olingan boʻlsa, kontakt kartasida 70 $ koʻrsatiladi va
    soʻm qatori umuman chiqmaydi.
16. Aralash valyutali oyda kategoriyalar ajratmasidagi soʻm summalari «jami chiqim (soʻm)» ga,
    dollar summalari esa «jami chiqim (dollar)» ga aniq teng.

## Qaysi qarorlarga tayanadi

| Qaror | Nima beradi |
|---|---|
| 0001 | Shaxsiy foydalanish, biznes emas |
| 0002 | v1 = toʻrt qism; chegaradan tashqaridagi besh narsa |
| 0003 | Oflayn PWA veb-sayt, serversiz |
| 0004 | Maʼlumot faqat qurilmada |
| 0005 | Bitta foydalanuvchi |
| 0006 | Kirish himoyasi yoʻq |
| 0007 | Qoʻlda eksport/import |
| 0008 | TypeScript + React + IndexedDB |
| 0009 | Faqat oʻzbekcha lotin |
| 0010 | Koʻp valyuta, kurs qoʻlda |
| 0011 | Naqd va karta; standart — karta |
| 0012 | Majburiy maydonlar |
| 0013 | Kategoriyalar: tayyor + oʻzgartirish |
| 0014 | Erkin tahrirlash, tarixsiz |
| 0015 | Qarz kontaktga bogʻlanadi |
| 0016 | Qisman toʻlov, qoldiq hisoblanadi |
| 0017 | Qarz qoldiqqa taʼsir qiladi, hisobotda alohida |
| 0018 | Davr: joriy oy + ixtiyoriy |
| 0019 | Hisobot mazmuni |
| 0020 | Dashboard mazmuni |
| 0021 | Hisobot eksporti yoʻq |
| 0022 | Tayyorlik mezoni — testlar |
| 0023 | Valyuta modeli |
| 0024 | Zaxira eslatmasi |
| 0025 | Hosting: statik sayt, bepul tarif, avtomatik deploy (xizmat — 0046) |
| 0026 | Valyutalar: soʻm va dollar |
| 0027 | Import: avval zaxira, keyin ustiga yozish |
| 0028 | Kategoriyalar roʻyxatining aniq nomlari |
| 0029 | Oʻchirishda «qaytarish» tugmasi |
| 0030 | Ochiq qarzli kontakt oʻchirilmaydi |
| 0031 | Kontakt: ism + ixtiyoriy telefon |
| 0032 | Alohida «yozuvlar» ekrani |
| 0033 | Summa formati: soʻm butun, dollar ikki kasr |
| 0034 | Kelajak sanasi kiritilmaydi (hamma operatsiyada) |
| 0035 | Qarz va toʻlovda hisob tanlanadi, standart karta |
| 0036 | Dashboardda naqd va karta qatorlari |
| 0037 | Kontakt qoldigʻi: netto, valyutalar alohida |
| 0038 | Hisobotda kategoriya va qarz qatorlari valyuta boʻyicha |
| 0039 | Qaysi agent qaysi hujjatni yozadi |
| 0040 | Vositalar: Vite, Vitest + fake-indexeddb, Playwright |
| 0041 | Zaxira tasdigʻi — faylni qaytarib tanlash |
| 0042 | Kurs butun soʻmda; aylantirish eng yaqiniga |
| 0043 | Qoʻlda soʻralgan kurs saqlanadi va faylga kiradi |
| 0044 | «Oxirgi kurs» eng kech sanali yozuvdan olinadi |
| 0045 | «Oxirgi kurs» saqlanmaydi — hisoblanadi |
| 0046 | Hosting: Vercel |
| 0047 | Yozuv va toʻlovda «yaratilgan» vaqt maydoni |
| 0048 | «Qaytarish» tugmasi 7 soniya turadi |
| 0049 | Nol kurs taqiqlanadi |
| 0050 | Tur uchun standart qiymat yoʻq |
| 0051 | Yashirilgan nom bilan qoʻshish rad etiladi, xato yoʻl koʻrsatadi |
| 0052 | Qarz chegara bilan yopiladi: ≤ 1 sent, ≤ 100 soʻm |
| 0053 | Oxirgi eksport sanasi faylga kiradi |
| 0054 | Avtomatik zaxira ham eksport sanaladi |
| 0055 | Boʻsh daftarga importda avtomatik zaxira yoʻq |
| 0056 | Netto faqat ochiq qarzlardan yigʻiladi |
| 0057 | Tahrirlashda chiplar: koʻrinadiganlar + yozuvning oʻz kategoriyasi |

## Ochiq savollar

Yoʻq. Bu hujjat yozilganda oltita savol ochilgan edi va hammasi hal qilindi:

1. Qaysi valyutalar qoʻllab-quvvatlanadi → **0026** (soʻm va dollar).
2. Tayyor kategoriyalar roʻyxatining aniq nomlari → **0028**.
3. Import mavjud maʼlumot bilan nima qiladi → **0027** (avval avtomatik zaxira, keyin ustiga).
4. Qarzi bor kontaktni oʻchirishda nima boʻladi → **0030** (ochiq qarzi bor kontakt oʻchmaydi).
5. Kontaktda ismdan boshqa nima saqlanadi → **0031** (ixtiyoriy telefon raqami).
6. Yozuvni oʻchirishda tasdiq soʻraladimi → **0029** («qaytarish» tugmasi, tasdiq oynasi emas).

Keyinroq `prds/kirim-chiqim.md` yozilganda yana uchta savol chiqdi va ular ham yopildi:

7. Eski yozuvga qanday yetib boriladi (13-band bajarilmas edi) → **0032** («yozuvlar» ekrani,
   yuqoridagi 15a-band).
8. Summa qanday kiritiladi, nima qabul qilinmaydi → **0033**.
9. Kelajakdagi sana bilan yozuv mumkinmi → **0034** (yoʻq).

Shuningdek kurs yoʻnalishi tasdiqlandi: kursga «1 dollar necha soʻm» kiritiladi (0023).

Qolgan uch spec yozilganda yana toʻrtta savol chiqdi va ular ham yopildi:

10. Qarz operatsiyasi qaysi hisobga tegadi → **0035** (formada tanlanadi, standart karta).
11. Naqd va karta qoldiqlari qayerda koʻrinadi → **0036** (dashboardda, umumiy qoldiq tagida).
12. Kontaktning «umumiy qoldigʻi» qanday hisoblanadi → **0037** (netto, valyutalar alohida).
13. Hisobotda aralash valyuta qanday koʻrsatiladi → **0038** (har qator valyuta boʻyicha).

Ochiq joy qolmadi — na mahsulot, na spec darajasida.
