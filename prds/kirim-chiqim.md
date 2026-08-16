# Kirim-chiqim yozuvlari

Sana: 2026-08-16. Asos: `prds/daftar-prd.md` (8–15-bandlar, va shu featurega tegishli 5, 6-band).
Qarorlar: 0011, 0012, 0013, 0014, 0023, 0026, 0028, 0029, 0032, 0033, 0034.

Nima uchun: Foydalanuvchi pulning har harakatini — kirimni ham, chiqimni ham — bir necha
soniyada yozib qoʻyadi va qoʻlidagi hamda kartadagi pul qanchaligini bilib turadi. Bu daftarning
poydevori: qolgan uch qism (qarz daftari, oylik hisobot, dashboard) shu yozuvlar ustida ishlaydi.

## Nima qiladi

### Yozuv qoʻshish

1. Yozuv qoʻshadi. Majburiy: summa, kirim yoki chiqim ekani, kategoriya. (PRD 8; 0012)
1a. Summa soʻmda butun son, dollarda ikki kasrgacha (sent). Nol summa saqlanmaydi, manfiy son
   kiritilmaydi, yuqori chegara yoʻq. (PRD 8; 0033)
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
7. Valyutalar ikkita: **soʻm** va **dollar**. (PRD 6; 0026)

### Yozuvlar ekrani, tahrirlash va oʻchirish

8. Har qanday yozuvni tahrirlaydi va oʻchiradi, jumladan oʻtgan oydagilarni ham. Oʻzgarish
   tarixi saqlanmaydi. (PRD 13; 0014)
8a. Alohida «yozuvlar» ekrani boʻladi: hamma yozuv sana boʻyicha tartiblangan holda turadi va
   pastga aylantirib koʻriladi. Tahrirlash va oʻchirish shu ekrandan bajariladi. (PRD 15a; 0032)
9. Oʻchirish tasdiqsiz darhol bajariladi, lekin bir necha soniya «qaytarish» tugmasi turadi.
   (PRD 13; 0029)

### Kategoriyalar

10. Kategoriyalar tayyor roʻyxat bilan keladi; foydalanuvchi oʻz kategoriyasini qoʻsha oladi va
    keraksizini yashira oladi. Kirim va chiqim uchun roʻyxatlar alohida. (PRD 14; 0013)
11. Tayyor roʻyxat — chiqim: oziq-ovqat, transport, ijara, kommunal, sogʻliq, kiyim,
    koʻngilochar, boshqa; kirim: oylik, qoʻshimcha daromad, sovgʻa. (PRD 14; 0028)
12. Yashirilgan kategoriyadagi eski yozuvlar joyida qoladi va hisobotda koʻrinadi; ular faqat
    yangi yozuv tanlovida chiqmaydi. (PRD 15; 0013)

## Nima QILMAYDI

- Takrorlanuvchi yozuvlar (ijara, oylik toʻlov) — qoʻshilmaydi. (0002)
- Chek yoki kvitansiya rasmini biriktirish. (0002)
- Budjet chegarasi va undan oshganda ogohlantirish. (0002)
- Yozuvlar boʻyicha qidiruv va filtr — «yozuvlar» ekranida ham yoʻq. (0002, 0032)
- Kelajakdagi sana bilan yozuv; rejalashtirilgan yoki kutilayotgan yozuv. (0034)
- Soʻmda tiyin kiritish; nol yoki manfiy summa. (0033)
- Soʻm va dollardan boshqa valyuta; valyuta qoʻshish yoki tahrirlash. (0026)
- Kursni internetdan avtomatik olish; kurs tarixini saqlash. (0002, 0010)
- Yangi hisob qoʻshish yoki mavjudini oʻchirish. (0011)
- Yozuvning oʻzgarish tarixi, audit izi, «oy yopish» holati. (0014)
- Oʻchirishdan oldin tasdiq oynasi — uning oʻrnida «qaytarish» tugmasi ishlaydi. (0029)
- Kategoriyani butunlay oʻchirish — faqat yashirish bor. (0013)

## Qanday tekshiramiz

0022 boʻyicha: bu qism testi oʻtmaguncha tayyor emas. Mezonlar sanab boʻladigan:

1. Soʻmdagi chiqim yozuvi uchta maydon bilan saqlanadi: summa, chiqim, kategoriya.
2. Shu uchtadan biri boʻsh boʻlsa yozuv saqlanmaydi va sabab koʻrsatiladi.
3. Yangi forma ochilganda sana bugungi kun, hisob «karta», valyuta «soʻm» boʻlib turadi.
4. Sana oʻtgan kunga oʻzgartirilsa, yozuv oʻsha sanada saqlanadi.
4a. Sana tanlagichda ertangi va undan keyingi kunlar tanlanmaydi.
4b. Soʻmda kasrli summa qabul qilinmaydi; dollarda ikki kasrli summa qabul qilinadi.
4c. Nol summa saqlanmaydi va sabab koʻrsatiladi.
4d. Manfiy son kiritilmaydi.
5. Izohi boʻsh yozuv saqlanadi.
6. Valyuta «dollar» ga oʻzgartirilsa kurs maydoni ochiladi; kurs boʻsh qolsa yozuv saqlanmaydi.
7. Valyuta soʻmligicha qolsa kurs maydoni koʻrinmaydi va yozuvda kurs saqlanmaydi.
8. Chiqim saqlanganda tanlangan hisobning oʻsha valyutadagi qoldigʻi shu summaga kamayadi;
   kirim saqlanganda koʻpayadi.
9. Dollardagi yozuv tanlangan hisobning dollar qoldigʻiga tushadi va soʻm qoldigʻiga tegmaydi.
10. Tahrirlangan yozuv qoldiqni darhol yangilaydi; eski qiymat hech qayerda qolmaydi.
11. Oʻchirilgan yozuv roʻyxatdan darhol yoʻqoladi va «qaytarish» tugmasi koʻrinadi; tugma
    bosilsa yozuv ham, qoldiq ham tiklanadi.
12. «Qaytarish» muddati tugagach tugma yoʻqoladi va oʻsha yozuv qaytmaydi.
13. Yangi kategoriya qoʻshilgach u yozuv formasidagi roʻyxatda koʻrinadi.
14. Yashirilgan kategoriya yangi yozuv roʻyxatida chiqmaydi, lekin oʻsha kategoriyadagi eski
    yozuv joyida qoladi va hisobotda koʻrinadi.
15. Tayyor roʻyxat 0028 dagi nomlar bilan keladi: chiqimda sakkizta, kirimda uchta.
16. Kirim kategoriyasi chiqim yozuvida tanlanmaydi va aksincha.
17. Internet oʻchirilgan holda yozuv saqlanadi va ilova qayta ochilganda joyida turadi.
18. «Yozuvlar» ekranida oʻtgan oydagi yozuv topiladi, tahrirlanadi va oʻchiriladi.
19. «Yozuvlar» ekranida yozuvlar sana boʻyicha tartiblangan holda turadi.
20. «Yozuvlar» ekranida oʻchirilgan yozuv uchun ham «qaytarish» tugmasi ishlaydi.
21. Dollardagi yozuvda kurs «1 dollar necha soʻm» sifatida saqlanadi: masalan 100 $ va kurs
    12 500 kiritilsa, yozuvning soʻmdagi qiymati 1 250 000 boʻladi.

## Ochiq savollar

Yoʻq. Bu spec yozilayotganda uchta savol chiqdi va hammasi hal qilindi:

1. Eski yozuvga qanday yetib boriladi → **0032**: alohida «yozuvlar» ekrani (PRD 15a). Shu
   bilan PRD 13-band bajariladigan boʻldi.
2. Summa qanday kiritiladi va nima qabul qilinmaydi → **0033**: soʻmda butun, dollarda ikki
   kasr; nol va manfiy son yoʻq; yuqori chegara yoʻq.
3. Kelajakdagi sana mumkinmi → **0034**: yoʻq, faqat bugun va undan oldin.

Kurs yoʻnalishi ham tasdiqlandi va 0023 ga yozildi: «1 dollar necha soʻm».
