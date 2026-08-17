# Zaxira nusxa — eksport va import

Sana: 2026-08-16. Asos: `prds/daftar-prd.md` (29–30-bandlar, va shu featurega tegishli 2, 5, 6,
15-bandlar). Qarorlar: 0003, 0004, 0006, 0007, 0008, 0009, 0011, 0013, 0014, 0016, 0021, 0023,
0024, 0026, 0027, 0029, 0031, 0033, 0034, 0040, 0041, 0042, 0043, 0044, 0045, 0047, 0053, 0054,
0055.

Nima uchun: 0004 boʻyicha hamma maʼlumot faqat foydalanuvchi brauzerida turadi — brauzer uni
oʻzi tozalab yuborsa yoki telefon yoʻqolsa, daftar butunlay ketadi. Zaxira fayli shu xavfni
yopadi va ayni paytda maʼlumotni ikkinchi qurilmaga koʻchirishning yagona yoʻli boʻlib qoladi
(0007). Import esa xavfli amal — u mavjud daftarning ustiga yozadi, shuning uchun undan qaytish
yoʻli qoldiriladi (0027).

## Nima qiladi

### Eksport

1. Foydalanuvchi sozlamalardan butun daftarni bitta faylga chiqaradi. (PRD 29; 0007)
2. Fayl butun maʼlumotni oʻz ichiga oladi: yozuvlar, qarzlar, qarz toʻlovlari, kontaktlar,
   kategoriyalar va hisoblar. (PRD 29; 0007)
2a. Qarz toʻlovlari faylda alohida blok boʻlib chiqadi: qarz qoldigʻi saqlanmaydi, u
   toʻlovlardan qayta hisoblanadi — toʻlovlarsiz tiklangan daftar notoʻgʻri qoldiq koʻrsatardi.
   (0016)
2b. Fayl bularga qoʻshimcha **qoʻlda soʻralgan** kurslarni ham oʻz ichiga oladi — valyuta
   boʻyicha bitta kurs, sanasi bilan, «≈ jami soʻmda» qatori uchun. Bu yozuv va qarzdan
   tashqaridagi yagona kurs qiymati; u faylga kiradi va import bilan tiklanadi. Yozuv va toʻlov
   kurslari bu blokka tushmaydi — ular oʻz yozuvi ichida turadi va «oxirgi kurs» oʻshalardan
   hisoblanadi. (0043, 0045)
3. Eksport oflayn ishlaydi; fayl hech qayerga yuborilmaydi, faqat foydalanuvchi qurilmasiga
   saqlanadi. (PRD 2; 0003, 0004)
4. Fayl nomida u qachon olingani koʻrinadi: `daftar-zaxira-YYYY-MM-DD-HHMM.json`. (0027)
5. Muvaffaqiyatli eksportdan keyin oxirgi eksport sanasi yangilanadi. Bu qoida eksportning
   **har ikkala turiga** tegishli: qoʻlda olingan eksport ham, import oldidan avtomatik
   chiqarilgan zaxira ham sanani yangilaydi. (0007, 0024, 0054)
5a. Oxirgi eksport sanasi zaxira fayliga kiradi va import bilan tiklanadi (7-band, sxema).
   (0053)
6. Eksport daftarning joriy holatini yozadi: oʻchirilgan yozuv («qaytarish» tugmasi hali
   ekranda boʻlsa ham) faylga tushmaydi. (0029)

### Fayl formati

7. Fayl — bitta JSON matn fayli, kengaytmasi `.json`. JSON tanlangani: brauzerning oʻzi uni
   oʻqiydi va yozadi, qoʻshimcha bogʻliqlik kerak emas (0007), maʼlumot esa 0008 dagi IndexedDB
   doʻkonlaridagi holida chiqadi.
8. Fayl ildizida `versiya` maydoni turadi — butun son, hozirgi qiymat `1`. Ilova faqat oʻzi
   biladigan versiyani import qiladi.
9. `eksport` bloki fayl haqidagi maʼlumot: qachon va qanday olingani (`qolda` yoki
   `import-oldidan`) — bu 0027 dagi «nomda qachon va nima uchun koʻrinsin» talabining fayl
   ichidagi nusxasi.
9a. Shu blokda `oxirgi-eksport` maydoni ham turadi — daftardagi «oxirgi muvaffaqiyatli eksport
   sanasi» qiymati (`YYYY-MM-DD`). Qiymat fayl yozilishidan oldin yangilanadi (5-band), shuning
   uchun u shu eksportning oʻz sanasiga teng boʻladi. Import uni ham tiklaydi va 30 kunlik
   eslatma (0024) shundan sanaladi: 40 kun oldin olingan fayl tiklansa, eslatma darhol chiqadi.
   (0053, 0054)
10. Maʼlumot bloklari — har doʻkon uchun bitta massiv: `hisoblar`, `kategoriyalar`, `yozuvlar`,
    `kontaktlar`, `qarzlar`, `tolovlar`. Doʻkon boʻsh boʻlsa ham blok boʻsh massiv sifatida
    turadi.
10a. Bulardan tashqari bitta kichik blok bor — `kurslar`: massiv emas, valyuta nomidan kurs va
    uning sanasiga qarab turadigan obyekt
    (`{ "dollar": { "kurs": 12500, "sana": "2026-08-16" } }`). Blokda faqat **qoʻlda soʻralgan**
    kurs turadi (0023, 0045); hech qachon qoʻlda kurs soʻralmagan boʻlsa blok boʻsh obyekt
    (`{}`) boʻlib turadi. Soʻm asos valyuta — unga kurs yozilmaydi. Bu kurs tarixi emas, valyuta
    boʻyicha bitta qiymat (0002).
10b. `sana` shu blokda kerak, chunki «oxirgi kurs» 0044 boʻyicha **sana** bilan tanlanadi:
    qoʻlda soʻralgan kurs yozuv va toʻlov kurslari bilan teng qatnashishi uchun uning oʻz sanasi
    boʻlishi shart. Sana — kurs soʻralgan (kiritilgan) kun.
10c. «Oxirgi kurs»ning oʻzi faylda saqlanmaydi: u importdan keyin yozuvlar, toʻlovlar va shu
    blokdan qayta hisoblanadi (0045). Faylda hisoblangan qiymat turmaydi — 11-band bilan bir
    xil qoida.
11. Har yozuvning hamma maydoni faylga oʻzgarishsiz tushadi, `id` lar ham. Import natijasi
    fayldagi bilan bir xil boʻlishi kerak (0027), demak fayl toʻliq nusxa boʻladi — hisoblangan
    qiymatlar (qarz qoldigʻi, oylik jami, hisob qoldigʻi) faylda saqlanmaydi.
12. Pul summalari butun son: soʻm — soʻmda, dollar — sentda. Faylda ham xuddi shunday, qayta
    hisoblanmaydi va formatlanmaydi. (0008, 0033)
12a. `kurs` — butun son, soʻmda («1 dollar necha soʻm»): `12500`. Kasrli kurs faylda ham,
    formada ham boʻlmaydi. Bu `yozuvlar`, `tolovlar` va `kurslar` bloklaridagi kursga bir xil
    tegishli. (0023, 0042)
13. Sana — kalendar kuni `YYYY-MM-DD` koʻrinishida. (0034)
13a. `yozuvlar` va `tolovlar` blokining har elementida `yaratilgan` maydoni boʻladi — yozuv
    daftarga qachon tushgani, ISO 8601 da UTC boʻyicha:
    `2026-08-15T09:14:22.310Z`. Bu `sana` dan ayri texnik maydon: `sana` — operatsiya qaysi
    kunga tegishli ekani, `yaratilgan` — kiritilish payti. Undan «bir xil sanada oxirgi
    kiritilgani» aniqlanadi (0044, 0045, 0047).
13b. `yaratilgan` yozuv tahrirlanganda oʻzgarmaydi va import bilan oʻzgarishsiz tiklanadi —
    tartib eksport-importdan keyin ham oʻsha boʻlib qoladi. (0047)
14. Kalitlar va tanlov qiymatlari ASCII yozuvida: `som`, `dollar`, `naqd`, `karta`, `kirim`,
    `chiqim`, `berdim`, `oldim`. Bu faqat fayl ichidagi texnik nom; foydalanuvchiga koʻrinadigan
    matn 0009 boʻyicha oʻzbekcha lotin yozuvida qoladi.

Faylning tuzilishi:

```json
{
  "versiya": 1,
  "eksport": { "sana": "2026-08-16", "vaqt": "14:05", "turi": "qolda",
               "oxirgi-eksport": "2026-08-16" },
  "hisoblar":      [ { "id": "naqd",  "nom": "Naqd" }, { "id": "karta", "nom": "Karta" } ],
  "kategoriyalar": [ { "id": "...", "nom": "Oziq-ovqat", "turi": "chiqim", "yashirilgan": false } ],
  "yozuvlar":      [ { "id": "...", "sana": "2026-08-15", "turi": "chiqim", "summa": 1200000,
                       "valyuta": "som", "kategoriya": "<kategoriya id>", "hisob": "karta",
                       "izoh": "", "yaratilgan": "2026-08-15T09:14:22.310Z" } ],
  "kontaktlar":    [ { "id": "...", "ism": "Akmal", "telefon": "" } ],
  "qarzlar":       [ { "id": "...", "kontakt": "<kontakt id>", "yonalish": "berdim",
                       "summa": 10000, "valyuta": "dollar", "sana": "2026-08-10",
                       "hisob": "karta" } ],
  "tolovlar":      [ { "id": "...", "qarz": "<qarz id>", "summa": 625000, "valyuta": "som",
                       "kurs": 12500, "sana": "2026-08-14", "hisob": "naqd",
                       "yaratilgan": "2026-08-14T18:02:07.884Z" } ],
  "kurslar":       { "dollar": { "kurs": 12500, "sana": "2026-08-16" } }
}
```

15. Maydonlar boʻyicha qoidalar:
    - `eksport` — `sana`, `vaqt`, `turi` (`qolda` yoki `import-oldidan`) va `oxirgi-eksport`
      (`YYYY-MM-DD`). Toʻrtalasi ham majburiy; `oxirgi-eksport` yetishmasa fayl import
      qilinmaydi (22-band). (0053)
    - `hisoblar` — ikkita yozuv, `naqd` va `karta`; yangi hisob boʻlmaydi. (0011)
    - `kategoriyalar` — `turi` kirim yoki chiqim; `yashirilgan` — yashirilgan kategoriya ham
      faylga tushadi, chunki eski yozuvlar unga bogʻlangan. (0013)
    - `yozuvlar` — `izoh` boʻsh boʻlishi mumkin (0012); `kurs` maydoni faqat `valyuta` soʻmdan
      boshqa boʻlganda boʻladi, «1 dollar necha soʻm» maʼnosini bildiradi (0023) va butun son
      boʻladi (0042); `yaratilgan` — majburiy, boʻsh boʻlmaydi (0047).
    - `kontaktlar` — `telefon` boʻsh boʻlishi mumkin. (0031)
    - `qarzlar` — `yonalish` `berdim` yoki `oldim`; qarzning yopiq/ochiqligi saqlanmaydi. (0016)
    - `tolovlar` — `kurs` faqat toʻlov valyutasi qarz valyutasidan farq qilganda boʻladi (0023)
      va butun son boʻladi (0042); `yaratilgan` — majburiy, boʻsh boʻlmaydi (0047).
    - `kurslar` — kalit valyutaning ASCII nomi (`dollar`), qiymat esa `kurs` (butun son, 0042)
      va `sana` (`YYYY-MM-DD`, kurs soʻralgan kun) juftligi (0043, 0044, 0045). Blokda faqat
      qoʻlda soʻralgan kurs boʻladi. Blok majburiy, lekin boʻsh obyekt boʻlishi mumkin.

### Import

16. Foydalanuvchi sozlamalardan zaxira faylini tanlaydi va daftarni oʻsha fayldan tiklaydi.
    (PRD 29; 0007)
17. Import — toʻrt qadamli amal, tartibi qatʼiy: (PRD 29; 0027, 0041)
    - **1-qadam.** Foydalanuvchi tiklanadigan zaxira faylini tanlaydi; ilova uni 22-band
      boʻyicha tekshiradi.
    - **2-qadam.** Ilova joriy maʼlumotni avtomatik faylga chiqaradi (oddiy yuklab olish).
    - **3-qadam.** Foydalanuvchi **oʻsha chiqarilgan faylni qaytarib tanlaydi**; ilova uni oʻqib
      joriy maʼlumotga mosligini tekshiradi.
    - **4-qadam.** Moslik tasdiqlangandan keyingina fayldagisi ustiga yoziladi.
17a. **Boʻsh daftar istisnosi:** daftar boʻsh boʻlsa 2- va 3-qadam tushib qoladi — avtomatik
    zaxira chiqarilmaydi va uni qaytarib tanlash soʻralmaydi. Import bir qadamda oʻtadi: fayl
    tanlanadi, tekshiriladi (22-band) va qoʻyiladi. (0055)
17b. **«Boʻsh daftar» taʼrifi** — uchala shart ham bajarilishi kerak: (a) birorta yozuv yoʻq;
    (b) birorta kontakt, qarz va qarz toʻlovi yoʻq; (c) kategoriyalar tayyor holatida —
    foydalanuvchi qoʻshgan kategoriya yoʻq va birortasi yashirilmagan (0013, 0028). Shartlardan
    bittasi buzilsa daftar boʻsh sanalmaydi va import 17-banddagi toʻrt qadam boʻyicha ketadi.
    (0055)
17c. Avtomatik zaxira chiqarilmagani uchun boʻsh daftarga importda oxirgi eksport sanasi ham
    yangilanmaydi — u fayldagi qiymat bilan tiklanadi (9a-band). (0053, 0054, 0055)
18. Avtomatik chiqarilgan fayl nomida uning qachon va nima uchun yaratilgani koʻrinadi:
    `daftar-import-oldidan-YYYY-MM-DD-HHMM.json`. U oddiy eksport fayli bilan bir xil formatda
    va uni xohlagan paytda qaytarib import qilsa boʻladi. (0027)
19. Tasdiqning shakli — faylni qaytarib tanlash (0041). Ilova tanlangan faylning mazmunini
    endigina chiqargan zaxira mazmuni bilan solishtiradi: mazmun bir xil boʻlsa, zaxira
    haqiqatan saqlangan deb sanaladi.
19a. Tasdiqlanmasa, ustiga yozish bajarilmaydi: import toʻxtaydi, sabab koʻrsatiladi, daftardagi
    maʼlumot oʻzgarmaydi. «Tasdiqlanmadi» degani — foydalanuvchi fayl tanlamay chiqib ketdi,
    yoki tanlangan fayl mazmuni endigina chiqarilgan zaxiraga mos kelmadi (boshqa fayl, eski
    zaxira, yarim yozilgan fayl). (0027, 0041)
19b. Tasdiq qadamida foydalanuvchi importdan voz kecha oladi. Voz kechilganda ham daftardagi
    maʼlumot oʻzgarmaydi; chiqarilgan zaxira fayli esa foydalanuvchi qurilmasida qolaveradi.
    (0027, 0041)
20. Ustiga yozish — toʻliq almashtirish: hamma doʻkon tozalanadi va fayldagi maʼlumot qoʻyiladi.
    Birlashtirish, qoʻshish yoki dublikat topish yoʻq. (0027)
21. Import natijasi — faylda nima boʻlsa, daftarda ham oʻsha: `id` lar, yashirilgan
    kategoriyalar, kontaktlar, qarzlar va toʻlovlar fayldagi holicha qoladi. (0027)
21a. `kurslar` bloki ham tiklanadi: importdan keyin qoʻlda soʻralgan kurs oʻz sanasi bilan
    joyida turadi va qayta soʻralmaydi. Blok boʻsh boʻlsa ham, fayldagi yozuv va toʻlovlarda
    kurs boʻlsa «oxirgi kurs» oʻshalardan hisoblanadi (0045); umuman hech qanday kurs
    topilmasa, kurs 0023 boʻyicha kerak boʻlganda soʻraladi. (0043, 0045)
21b. Oxirgi eksport sanasi ham fayldagi qiymat bilan almashadi: importdan keyin 30 kunlik
    eslatma shu tiklangan sanadan hisoblanadi (9a-band). (0053)
22. Tekshiruv ustiga yozishdan OLDIN oʻtkaziladi. Fayl JSON sifatida oʻqilmasa, blok yoki
    majburiy maydon yetishmasa, yoxud `versiya` ilovaga notanish boʻlsa — import bajarilmaydi,
    sabab koʻrsatiladi va mavjud maʼlumot oʻzgarmaydi. (0027)
23. Import yarim holatda toʻxtamaydi: yo fayldagi hamma narsa qoʻyiladi, yo hech narsa
    oʻzgarmaydi. (0027)
24. Importdan keyin hisoblanadigan hamma raqam yangi maʼlumotdan qayta hisoblanadi: hisob
    qoldiqlari, qarz qoldiqlari, oylik hisobot. Fayldan hisoblangan qiymat olinmaydi. (0016)
25. Importdan keyin dashboard, «yozuvlar», qarz daftari va hisobot ekranlari yangi maʼlumotni
    koʻrsatadi.

### Zaxira eslatmasi

26. Oxirgi muvaffaqiyatli eksport sanasi saqlanadi. (0007, 0024)
26a. Sanani eksportning har ikkala turi yangilaydi — qoʻlda olingani ham, import oldidan
    avtomatik chiqarilgani ham (5-band). Import keyin toʻxtab qolsa ham (19a, 19b) yangilangan
    sana oʻrnida qoladi: fayl haqiqatan chiqarilgan va foydalanuvchi qurilmasida. (0054)
26b. Sana zaxira fayliga kiradi va import bilan tiklanadi (9a, 21b-bandlar). (0053)
27. Oxirgi eksportdan 30 kun oʻtsa yoki daftar hech qachon eksport qilinmagan boʻlsa,
    dashboardda bir qatorlik eslatma koʻrinadi; shart bajarilmasa eslatma turmaydi. Eslatmaning
    oʻzi `prds/dashboard.md` (7-band) da, bu yerda uni yoqadigan sana. (PRD 30; 0024)
28. Eslatma foydalanuvchini shu ekrandagi eksportga olib boradi. (0024)

## Nima QILMAYDI

- Avtomatik zaxira, jadval boʻyicha zaxira, bulutga yuklash. (0007)
- Faylni serverga yuborish yoki qurilmalar orasida sinxronizatsiya. (0003, 0004)
- Hisobotni PDF, CSV yoki rasm qilib chiqarish — bu butunlay boshqa narsa. (0021)
- Qisman import: faqat kontaktlarni yoki faqat bitta oyni tiklash. (0027)
- Mavjud maʼlumot bilan birlashtirish, dublikatlarni topish va tanlash. (0027)
- Boshqa ilovaning fayli, CSV yoki Excel import qilish. (0007 — fayl faqat shu daftarniki)
- Zaxira faylini parol bilan yopish yoki shifrlash. (0006)
- Eski fayl versiyasini yangisiga oʻgirish — hozir versiya bitta, notanish versiya rad etiladi.
- Import va eksport jurnali, «qachon nima import qilingan» tarixi. (0014)
- «Zaxirani saqladim» degan tugma bilan tasdiq, yoki File System Access API orqali tasdiq —
  tasdiq faqat faylni qaytarib tanlash bilan boʻladi, ikkinchi yoʻl qurilmaydi. (0041)
- Kurs tarixi: `kurslar` bloki valyuta boʻyicha faqat bitta qoʻlda soʻralgan qiymatni saqlaydi.
  (0002, 0043, 0045)
- Hisoblangan «oxirgi kurs»ni faylga yozish — u har safar maʼlumotdan qayta topiladi. (0045)
- Zaxira haqida bildirishnoma yoki push xabar — eslatma faqat dashboarddagi qator. (0003, 0024)

## Qanday tekshiramiz

0022 boʻyicha: bu qism testi oʻtmaguncha tayyor emas. 0040 boʻyicha fayl mazmuni, tekshiruvi va
import mantiqi Vitest da, brauzerdagi saqlash/tanlash oqimi Playwright da sinaladi. Mezonlar
sanab boʻladigan:

1. Boʻsh boʻlmagan daftardan eksport olinadi va fayl JSON sifatida oʻqiladi.
2. Faylda `versiya` maydoni bor va u butun son.
3. Faylda oltita maʼlumot bloki bor: `hisoblar`, `kategoriyalar`, `yozuvlar`, `kontaktlar`,
   `qarzlar`, `tolovlar` — boʻsh doʻkon ham boʻsh massiv boʻlib turadi.
4. Fayldagi yozuvlar soni daftardagi yozuvlar soniga teng; kontaktlar, qarzlar, toʻlovlar va
   kategoriyalar uchun ham shunday.
5. 1 200 000 soʻmlik yozuv faylda `1200000` boʻlib turadi; 100 $ lik yozuv `10000` boʻlib turadi.
6. Soʻmdagi yozuvda `kurs` maydoni boʻlmaydi; dollardagi yozuvda boʻladi.
6a. Fayldagi `kurs` — butun son: 12 500 kurs bilan yozilgan yozuv faylda `12500` boʻlib turadi,
   kasrli qiymat chiqmaydi (0042).
6b. Faylda `kurslar` bloki bor; qoʻlda kurs soʻralgan daftarda u
   `{ "dollar": { "kurs": 12500, "sana": "2026-08-16" } }` koʻrinishida, qoʻlda kurs
   soʻralmagan daftarda esa boʻsh obyekt boʻlib turadi (0043, 0045).
6c. Faqat yozuvlarida kurs boʻlgan (qoʻlda kurs soʻralmagan) daftarda `kurslar` bloki boʻsh
   qoladi — yozuv kurslari blokka koʻchirilmaydi (0045).
6d. Fayldagi har yozuv va har toʻlovda `yaratilgan` maydoni bor va u boʻsh emas (0047).
6e. `yaratilgan` maydoni yetishmaydigan fayl import qilinmaydi, sabab koʻrsatiladi va maʼlumot
   oʻzgarmaydi (0047; 22-band bilan bir xil qoida).
6f. Bir xil sanada ketma-ket kiritilgan ikkita kursli yozuv eksport qilinib qayta import
   qilingach, «≈ jami soʻmda» oʻsha kunning keyin kiritilgan kursi bilan hisoblanadi — tartib
   fayldan tiklanadi (0044, 0047).
6g. Faylning `eksport` blokida `oxirgi-eksport` maydoni bor va u shu eksportning sanasiga teng
   (0053).
7. Yashirilgan kategoriya faylda `yashirilgan` belgisi bilan turadi va importdan keyin ham
   yashirilganligicha qoladi.
8. Faylda qarzning «yopilgan» belgisi yoʻq — faqat qarzning oʻzi va uning toʻlovlari.
9. Eksport fayl nomida sana koʻrinadi.
10. Eksportdan keyin dashboarddagi zaxira eslatmasi yoʻqoladi.
11. Hech qachon eksport qilinmagan daftarda eslatma koʻrinadi; oxirgi eksportdan 30 kundan kam
    oʻtganda koʻrinmaydi; 30 kundan koʻp oʻtganda qayta koʻrinadi.
11a. 40 kun oldingi `oxirgi-eksport` qiymati bor fayl import qilingach eslatma darhol koʻrinadi;
    bugungi qiymatli fayldan keyin koʻrinmaydi (0053).
11b. Import oldidan avtomatik zaxira chiqarilgach eslatma yoʻqoladi — avtomatik zaxira ham
    eksport sanaladi (0054).
11c. Avtomatik zaxira chiqarilib, keyin import tasdiqlanmay toʻxtasa ham eslatma qaytmaydi:
    sana yangilangan boʻlib qoladi (0054, 0041).
12. Oʻchirilgan va «qaytarish» oynasi hali ochiq yozuv faylga tushmaydi.
13. Eksport olinadi, brauzer maʼlumoti tozalanadi, fayl import qilinadi — hamma yozuv, qarz,
    toʻlov, kontakt va kategoriya qaytadi (PRD 6-mezon).
14. Shu tiklashdan keyin naqd va karta qoldiqlari eksportdan oldingi qiymatga teng boʻladi.
15. Import boshlanganda avtomatik zaxira fayli yaratiladi va uning nomida sana hamda «import
    oldidan» ekani koʻrinadi.
16. Avtomatik zaxira fayli oddiy eksport fayli bilan bir xil formatda va uni qaytarib import
    qilib boʻladi.
17. Zaxira saqlangani tasdiqlanmasa import toʻxtaydi va daftardagi maʼlumot oʻzgarmaydi
    (PRD 6a-mezon).
17a. Avtomatik zaxira chiqarilgach, foydalanuvchi uni qaytarib tanlaydi va import shundan keyin
    bajariladi (0041).
17b. Tasdiq qadamida hech qanday fayl tanlanmay voz kechilsa, import bajarilmaydi, sabab
    koʻrsatiladi va maʼlumot oʻzgarmaydi (0041).
17c. Tasdiq qadamida boshqa fayl tanlansa (masalan tiklanadigan zaxira faylining oʻzi yoki eski
    zaxira), moslik tasdiqlanmaydi: import bajarilmaydi va maʼlumot oʻzgarmaydi (0041).
17d. Tasdiq qadamida buzilgan yoki yarim yozilgan fayl tanlansa ham import bajarilmaydi va
    maʼlumot oʻzgarmaydi (0041).
17e. Butunlay boʻsh daftarda (yozuv, kontakt, qarz, toʻlov yoʻq; kategoriyalar tayyor holatida)
    import bir qadamda oʻtadi: avtomatik zaxira fayli yaratilmaydi va tasdiq soʻralmaydi
    (0055).
17f. Bitta yozuvi bor daftarda istisno ishlamaydi — avtomatik zaxira chiqariladi va tasdiq
    soʻraladi (0055).
17g. Yozuvi yoʻq, lekin bitta kategoriyasi yashirilgan daftarda ham istisno ishlamaydi (0055).
17h. Yozuvi yoʻq, lekin foydalanuvchi qoʻshgan kategoriyasi bor daftarda ham istisno ishlamaydi
    (0055).
17i. Yozuvi yoʻq, lekin bitta kontakti bor daftarda ham istisno ishlamaydi (0055).
18. Import ustiga yozadi: importdan oldin daftarda boʻlgan, faylda esa yoʻq yozuv importdan
    keyin qolmaydi.
19. Bir xil faylni ikki marta import qilish yozuvlarni ikki nusxa qilmaydi.
20. Buzilgan (yarim yozilgan) JSON fayl import qilinmaydi, sabab koʻrsatiladi, maʼlumot
    oʻzgarmaydi.
21. `versiya` notanish qiymatda boʻlgan fayl import qilinmaydi, sabab koʻrsatiladi, maʼlumot
    oʻzgarmaydi.
22. Bloki yoki majburiy maydoni yetishmaydigan fayl import qilinmaydi va maʼlumot oʻzgarmaydi —
    `eksport.oxirgi-eksport` yetishmasa ham shunday (0053).
23. 100 $ qarz va 50 $ toʻlovi bor fayl import qilingach, qarz qoldigʻi 50 $ boʻlib hisoblanadi.
24. Importdan keyin oylik hisobot raqamlari fayldagi yozuvlardan qayta hisoblanadi.
24a. `kurslar` bloki bor fayl import qilingach, «≈ jami soʻmda» qatori uchun kurs qayta
    soʻralmaydi (0043).
24b. Kurs bir marta soʻralib javob berilgach, ilova qayta ochilganda oʻsha kurs bilan ishlaydi
    va qayta soʻramaydi (0043).
24c. `kurslar` bloki boʻsh, lekin kursli yozuvlari bor fayl import qilingach ham kurs
    soʻralmaydi — «oxirgi kurs» yozuvlardan hisoblanadi; ikkalasi ham boʻlmasa soʻraladi
    (0045).
24d. Importdan keyin «≈ jami soʻmda» fayldagi yozuv, toʻlov va `kurslar` blokidan 0044 qoidasi
    bilan hisoblanadi: eng kech sanali kurs gʻolib (0044, 0045).
25. Internet oʻchirilgan holda eksport ham, import ham ishlaydi.
26. Importdan keyin ilova qayta ochilganda tiklangan maʼlumot joyida turadi.

## Ochiq savollar

Bu spec yozilayotganda oltita savol chiqdi. Hammasi hal qilindi: beshtasi 2026-08-16 da,
qolganlari 2026-08-17 da. **Ochiq savol qolmadi.**

Hal qilinganlar:

- Zaxira saqlangani qanday tasdiqlanadi → **0041**: avtomatik zaxira chiqariladi va foydalanuvchi
  oʻsha faylni qaytarib tanlaydi; moslik tasdiqlanmaguncha import bajarilmaydi (17, 19, 19a,
  19b-bandlar).
- «≈ jami soʻmda» uchun soʻralgan kurs saqlanadimi → **0043**: saqlanadi va faylga kiradi —
  `kurslar` bloki (2b, 10a, 15, 21a-bandlar).
- Kurs butun sonmi yoki kasrli, yaxlitlash qanday → **0042**: butun soʻm; aylantirishda eng
  yaqiniga (12a-band).
- «Oxirgi kurs» qanday saqlanadi → **0045**: saqlanmaydi, yozuv va toʻlovlardan hisoblanadi;
  `kurslar` blokida faqat qoʻlda soʻralgan kurs, sanasi bilan (2b, 10a–10c, 15, 21a-bandlar).
- Bir xil sanadagi kurslardan qaysi biri «oxirgi kiritilgani» → **0047**: har yozuv va toʻlovda
  `yaratilgan` vaqt maydoni boʻladi va u faylga kiradi (13a, 13b, 15-bandlar).

- «Oxirgi eksport sanasi» faylga kiradimi → **0053**: kiradi (`eksport.oxirgi-eksport`) va
  import bilan tiklanadi (9a, 21b-bandlar).
- Import oldidan olingan avtomatik zaxira ham «eksport» sanaladimi → **0054**: sanaladi, sana
  yangilanadi va eslatma 30 kunga tinadi (5, 26a-bandlar).
- Daftar boʻsh boʻlganda ham avtomatik zaxira olinadimi → **0055**: olinmaydi, import bir
  qadamda oʻtadi; «boʻsh daftar» taʼrifi 17b-bandda.
