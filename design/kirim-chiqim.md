# Kirim-chiqim — ekranlar

Sana: 2026-08-17. Asos: `prds/kirim-chiqim.md`. Rang, oʻlcham va boʻshliq — `design/uslub.md`
(bu yerda ular nom bilan ataladi: `matn-ikkinchi`, `chip`, `asosiy tugma`).
Qarorlar: 0009, 0011, 0012, 0013, 0014, 0023, 0026, 0028, 0029, 0032, 0033, 0034, 0042, 0047,
0048, 0049, 0050, 0051, 0057, 0063.

Uchta ekran: **Yangi yozuv** (kiritish formasi), **Yozuvlar** (toʻliq roʻyxat),
**Kategoriyalar** (boshqaruv).

Ekrandagi matnlar shu faylda aynan yozilgan — frontend oʻshani koʻchiradi, oʻzgartirmaydi.

**Navigatsiya:** dashboard qurilgunicha «Yangi yozuv» va «Yozuvlar» ekranlariga pastdagi
**vaqtinchalik navigatsiya panelidan** kiriladi — **«Yozuv»** va **«Yozuvlar»** boʻlaklari
(0063; tavsifi `design/uslub.md`). «Kategoriyalar» ga esa «Yangi yozuv» formasidan. Dashboard
3.10 da kelganda bosh sahifa oʻsha boʻladi va navigatsiya qayta koʻriladi.

---

## 1. Yangi yozuv (kiritish formasi)

### Nima koʻrinadi

Yuqorida panel: chapda `×` (yopish), oʻrtada sarlavha **«Yangi yozuv»**.

Ostida, yuqoridan pastga:

1. **Summa** — katta maydon (56 px). Ochilganda kursor shu yerda va raqam klaviaturasi ochiq.
   Boʻsh holatda ichida `0` turadi (`matn-oʻchiq`). Maydonning oʻng chekkasida valyuta soʻzi:
   **soʻm** (`matn-ikkinchi`). Terish paytida mingliklar boʻsh joy bilan ajratiladi —
   `1 200 000` (pastdagi «Summa maydoni — terish qoidalari»).
2. **Tur** — ikki boʻlakli segment: **«Chiqim»** | **«Kirim»**. Ochilganda **hech biri
   tanlanmagan**: u majburiy maydon va standart qiymati yoʻq (0012, 0050).
3. **Kategoriya** — yorligʻi chapda «Kategoriya», oʻng tepasida matn-havola
   **«Boshqarish»**. Tagida chiplar qatori.
   - Tur tanlanmaguncha chip oʻrnida bitta qator turadi (`mayda`, `matn-ikkinchi`):
     **«Avval kirim yoki chiqim tanlang.»**
   - Tur tanlangach oʻsha turning koʻrinadigan kategoriyalari chip boʻlib chiqadi. Tartib —
     0028 dagidek, undan keyin foydalanuvchi qoʻshganlari qoʻshilish tartibida. Chiplar
     oʻrash bilan bir necha qatorga tushadi, roʻyxat qisqartirilmaydi.
   - Chiplarda faqat **koʻrinadigan** kategoriyalar boʻladi (0013). Tanlangan kategoriya shu
     roʻyxatdan tashqarida qololmaydi — pastdagi «Tanlangan kategoriya yashirilsa» bandiga
     qarang.
4. **Hisob** — yorligʻi «Hisob», tagida ikki chip: **«Karta»** | **«Naqd»**.
   Ochilganda **«Karta»** tanlangan (0011).
5. **Valyuta** — yorligʻi «Valyuta», tagida ikki chip: **«soʻm»** | **«dollar»**.
   Ochilganda **«soʻm»** tanlangan (0023, 0026).
6. **Kurs** — faqat «dollar» tanlanganda koʻrinadi (pastki bandga qarang).
7. **Sana** — bitta qator: chapda «Sana», oʻngda tugma. Ochilganda tugmada **«Bugun»** yozuvi
   turadi (0012).
8. **Izoh** — bir qatorli maydon, ichida **«Izoh (ixtiyoriy)»** (0012).

Pastda yopishib turgan panelda bitta asosiy tugma: **«Saqlash»**.

Boshqa hech narsa yoʻq: qaytarish, nusxa olish, shablon, «yana bitta qoʻshish» tugmasi
qurilmaydi.

### Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| Summa maydoni | raqam klaviaturasi ochiladi; terish paytida mingliklar ajratiladi; soʻmda kasr belgisi qabul qilinmaydi, dollarda ikki kasrgacha (0033) |
| «Chiqim» / «Kirim» | segment boʻlagi `chiqim` yoki `kirim` rangiga boʻyaladi; kategoriya chiplari oʻsha turning roʻyxati bilan almashadi. Tur oʻzgartirilsa tanlangan kategoriya bekor boʻladi (roʻyxatlar alohida — 0013) |
| Kategoriya chipi | chip tanlangan koʻrinishga oʻtadi; bir vaqtda faqat bittasi tanlanadi |
| «Boshqarish» | «Kategoriyalar» ekrani ochiladi (3-boʻlim); qaytilganda forma toʻldirilgan holicha turadi — bitta istisno bilan: tanlangan kategoriya oʻsha yerda yashirilgan boʻlsa, tanlov bekor boʻladi (pastdagi bandga qarang) |
| «Karta» / «Naqd» | chip almashadi, boshqa hech narsa oʻzgarmaydi |
| «soʻm» / «dollar» | summa maydonining oʻngidagi soʻz `soʻm` ↔ `$` ga almashadi; «dollar» da kurs maydoni ochiladi, «soʻm» ga qaytilsa kurs maydoni yopiladi va kiritilgani unutiladi |
| Sana tugmasi | qurilmaning sana tanlagichi ochiladi; ertangi va undan keyingi kunlar oʻchiq — tanlanmaydi (0034). Tanlangach tugmada «Bugun», «Kecha» yoki `14-avgust` yozuvi turadi |
| Izoh maydoni | matn klaviaturasi ochiladi; boʻsh qolsa ham yozuv saqlanadi (0012) |
| **«Saqlash»** | hamma tekshiruv bir yoʻla bajariladi. Xato boʻlsa — pastdagi jadval. Xato boʻlmasa: yozuv saqlanadi, forma yopiladi, odam oʻzi kelgan ekranga qaytadi; yangi yozuv roʻyxatda darhol koʻrinadi va qoldiq darhol yangilanadi. Alohida tasdiq oynasi yoki «saqlandi» xabari koʻrsatilmaydi — natijaning oʻzi koʻrinib turadi |
| `×` | forma darhol yopiladi, kiritilgani saqlanmaydi; tasdiq soʻralmaydi (0029 ruhi: bu daftarda tasdiq oynasi yoʻq) |

### Eng qisqa yoʻl — bir yozuv necha qadamda tugaydi

Kundalik holat: soʻmdagi chiqim, kartadan, bugungi sana bilan.

1. Bosh sahifadagi **«＋ Yozuv»** tugmasi — forma ochiladi, kursor summada, raqam klaviaturasi
   ochiq. (Vaqtinchalik: pastdagi navigatsiya panelining **«Yozuv»** boʻlagi, 0063 — qadamlar
   soni oʻzgarmaydi.)
2. Summani teradi.
3. **«Chiqim»** ni bosadi.
4. Kategoriya chipini bosadi.
5. **«Saqlash»** ni bosadi.

**Forma ochilgandan keyin 4 ta harakat, shundan 3 tasi bitta bosish.** Hisob, valyuta va sana
tegilmaydi — ular tayyor turadi (0011, 0023, 0012).

Dollardagi yozuv: shu yoʻlga ikkita harakat qoʻshiladi — **«dollar»** chipi va kursni terish.
Jami 6 ta harakat.

### Dollar tanlanganda

- «Valyuta» qatoridan pastda **Kurs** maydoni ochiladi (150 ms soʻnish bilan).
- Yorligʻi: **«Kurs — 1 dollar necha soʻm»** (0023).
- Maydon boʻsh ochiladi, ichida `12 500` namuna sifatida turadi (`matn-oʻchiq`). Oldindan
  toʻldirilmaydi: kurs shu holatda majburiy maydon (0023) va boʻsh qolsa yozuv saqlanmaydi
  (6-mezon).
- Faqat butun son qabul qiladi — kasr belgisi maydonga tushmaydi (0042). Kasrli matn
  yopishtirilsa summa maydonidagi kabi ish tutiladi: kasr qismi kesiladi va yordam uslubidagi
  bir qatorlik xabar chiqadi (xatolar jadvaliga qarang).
- Terilayotganda mingliklar boʻsh joy bilan ajratiladi: `12 500`.
- Summa maydoni ikki kasrgacha qabul qiladi, oʻngdagi soʻz `$` boʻladi (0033).
- «soʻm» ga qaytilsa kurs maydoni yopiladi va yozuvda kurs saqlanmaydi (7-mezon).

### Tanlangan kategoriya yashirilsa

Holat: odam formada kategoriyani tanladi, «Boshqarish» ga kirdi, **aynan oʻsha** kategoriyani
yashirdi va formaga qaytdi.

**Tanlov bekor boʻladi.** Formaga qaytilganda hech qanday chip tanlangan boʻlmaydi, oʻrniga
boshqasi avtomatik tanlanmaydi. Chiplar ostida yordam qatori turadi (`mayda`,
`matn-ikkinchi`): **«Tanlangan kategoriya yashirildi — boshqasini tanlang.»** Qator birorta
chip bosilishi bilan yoʻqoladi. «Saqlash» bosilsa odatdagi **«Kategoriyani tanlang.»** xatosi
chiqadi.

Nega bekor boʻladi:

- 0013 aynan shuni aytadi: yashirilgan kategoriya **yangi yozuv tanlovida** chiqmaydi. Tanlov
  kuchda qolsa, odam oʻzi bir soniya oldin yashirgan kategoriyaga yangi yozuv saqlagan boʻlardi.
- Ekran bilan saqlanadigan narsa bir-biriga zid boʻlib qolardi: chip roʻyxatdan yoʻqolgani
  uchun ekranda hech narsa tanlanmagandek koʻrinadi, yozuv esa koʻrinmayotgan kategoriyaga
  tushadi. Daftarda eng yomoni — jimgina notoʻgʻri yozilgan raqam.
- Narxi bitta bosish, va bu bosishga sabab odamning oʻz harakati.

Qoʻshimcha qoidalar:

- Tekshiruv formaga qaytilganda bir marta bajariladi: tanlangan kategoriya oʻsha payt
  koʻrinadigan boʻlsa, tanlov joyida qoladi. Yaʼni odam yashirib, keyin oʻsha ekranda
  «Koʻrsatish» bilan qaytarsa, tanlov ham saqlanib qoladi.
- Yashirish natijasida oʻsha turda koʻrinadigan kategoriya umuman qolmasa, chiplar oʻrnida
  boʻsh holat matni turadi (3-boʻlimdagi «Boʻsh holat»).
- Bu qoida **faqat yangi yozuv formasiga** tegishli. Tahrirlash rejimida yozuvning oʻz
  kategoriyasi yashirilgan boʻlsa ham chipda koʻrinadi va tanlangan turadi (0057) — u yerda
  tanlov bekor qilinmaydi.

### Summa maydoni — terish qoidalari

- **Minglik ajratish summa maydonida ham boʻladi**, kurs maydonidagi kabi va aynan oʻsha
  qoida boʻyicha (`design/uslub.md`, «Maydonda terish paytidagi format»): `1 200 000`.
  Nega: soʻm summasi olti-yetti raqamli boʻladi va aynan shu maydonda notoʻgʻri oʻqilgan raqam
  eng qimmatga tushadi — odam terganini bir qarashda oʻqiy olishi kerak; ikkala maydonga bitta
  qoida qoʻyilgani uchun format bitta joyda yoziladi, ikkita xulq paydo boʻlmaydi.
- Ajratish faqat butun qismga tegadi. Dollar rejimida kasr qismi odam terganidek qoladi:
  `1 234,5` → `1 234,5`, `1 234,50` → `1 234,50`.
- Kursor raqamlarga nisbatan oʻz oʻrnida qoladi (kursordan chapdagi raqamlar soni saqlanadi).
- Ajratgich boʻsh joyi faqat koʻrinish uchun: saqlashda olib tashlanadi.
- Dollar rejimida uchinchi kasr raqami maydonga tushmaydi (0033).
- **Yopishtirilgan matn** avval tozalanadi: raqam boʻlmagan belgilar (`−`, harf, valyuta soʻzi,
  boʻsh joy) olib tashlanadi, birinchi kasr belgisi (`,` yoki `.`) kasr ajratgichi deb olinadi.
  Keyin joriy valyutaning qoidasi qoʻllanadi.
- **Soʻm rejimida kasrli matn yopishtirilsa:** butun qismi qoladi, kasr qismi kesiladi
  (yaxlitlanmaydi: `12 999,99` → `12 999`) va maydon ostida bir qatorlik ogohlantirish turadi —
  **«Soʻmda tiyin yoʻq — kasr qismi olib tashlandi.»** Bu xato emas: maydon qizil boʻlmaydi va
  saqlashga toʻsqinlik qilmaydi. Xuddi shu xulq valyuta «dollar» dan «soʻm» ga almashtirilganda
  ham ishlaydi — bitta holat, bitta matn.
- Kesilgandan keyin `0` qolsa (masalan `0,99` yopishtirilsa), «Saqlash» bosilganda odatdagi
  **«Summa noldan katta boʻlsin.»** xatosi chiqadi (0033).

### Xato holatlari

Tekshirish **«Saqlash» bosilganda** bajariladi — terish paytida xato koʻrsatilmaydi. Bir necha
xato boʻlsa hammasi bir vaqtda koʻrinadi, ekran esa birinchi xatoli maydonga suriladi va fokus
oʻsha yerga tushadi. Maydon tuzatilishi bilan oʻsha xato yoʻqoladi.

| Holat | Odam nimani koʻradi |
|---|---|
| Summa boʻsh | Summa maydoni qizil chegara oladi, tagida: **«Summani kiriting.»** |
| Tur tanlanmagan | Segment ostida: **«Kirim yoki chiqim ekanini tanlang.»** |
| Kategoriya tanlanmagan | Chiplar ostida: **«Kategoriyani tanlang.»** |
| Nol summa (`0` yoki `0,00`) | Summa maydoni ostida: **«Summa noldan katta boʻlsin.»** |
| Summa texnik chegaradan oshsa | Summa maydoni qizil chegara oladi, tagida: **«Summa juda katta.»** Saqlash toʻxtaydi. Bu mahsulot chegarasi emas (0033: yuqori chegara yoʻq) — bu hisob buzilmasligi uchun qoʻyilgan texnik chegara: undan katta son butun sonda aniq saqlanmaydi va qoldiq jimgina notoʻgʻri boʻlib qolardi. Aniq raqam dizaynda emas, kodda va specda turadi; kundalik summalarda bu xabar hech qachon koʻrinmaydi |
| Manfiy son | Hech narsa koʻrmaydi: `−` belgisi maydonga umuman tushmaydi, yopishtirilgan matndan ham olib tashlanadi. Xato matni chiqmaydi, chunki notoʻgʻri qiymat maydonga kirmaydi (0033) |
| Soʻmda kasr terilsa | `,` va `.` maydonga tushmaydi; hech qanday matn chiqmaydi |
| Soʻmda kasrli matn yopishtirilsa **yoki** dollarda kasr terib keyin «soʻm» ga oʻtilsa | Kasr qismi kesiladi (yaxlitlanmaydi) va maydon ostida bir qatorlik ogohlantirish turadi: **«Soʻmda tiyin yoʻq — kasr qismi olib tashlandi.»** Bu xato emas: maydon qizil boʻlmaydi, saqlash toʻxtamaydi. Ikkala holatga shu bitta matn ishlatiladi — «Soʻmda tiyin yoʻq — butun son kiriting.» degan matn endi hech qayerda ishlatilmaydi |
| Kelajak sanasi | Sana tanlagichda ertangi va undan keyingi kunlar oʻchiq koʻrinadi va bosilmaydi (0034). Agar qurilma tanlagichi baribir kelajak sanasini qaytarsa, sana qatori ostida: **«Sana bugundan keyin boʻlmaydi.»** |
| Dollar tanlangan, kurs boʻsh | Kurs maydoni qizil chegara oladi, tagida: **«Kursni kiriting — 1 dollar necha soʻm.»** |
| Kursda kasr | Kasr belgisi maydonga tushmaydi. Kasrli matn yopishtirilsa kasr qismi kesiladi (`12 500,25` → `12 500`) va maydon ostida **yordam uslubida** turadi: **«Kurs butun soʻmda — kasr qismi olib tashlandi.»** Bu xato emas: maydon qizil boʻlmaydi, saqlash toʻxtamaydi. «Kurs butun soʻmda kiritiladi.» degan matn endi ishlatilmaydi |
| Kurs `0` | Kurs maydoni qizil chegara oladi, tagida: **«Kurs notoʻgʻri»**. Yozuv saqlanmaydi (0049) |
| Summa yoki kursga harf/belgi terilsa | Raqam boʻlmagan belgi maydonga tushmaydi; xato matni chiqmaydi |

### Tahrirlash rejimi

Xuddi shu forma, uchta farq bilan:

- Sarlavha: **«Yozuvni tahrirlash»**.
- Hamma maydon yozuvdagi qiymat bilan toʻldirilgan holda ochiladi (dollarda kurs ham).
- **Kategoriya chiplari:** koʻrinadigan kategoriyalar **va shu yozuvning oʻz kategoriyasi**.
  Yozuvning kategoriyasi yashirilgan boʻlsa ham chip boʻlib chiqadi va tanlangan holda turadi;
  boshqa yashirilganlar chiqmaydi (0057). Chip oddiy koʻrinishda — «yashirilgan» degan belgi
  yoki alohida rang qoʻyilmaydi. Shu tufayli odam kategoriyani bilib turib oʻzgartirmaguncha
  eski yozuv oʻz kategoriyasida qoladi (0013, 14-mezon).
- Tur («Chiqim»/«Kirim») oʻzgartirilsa tanlangan kategoriya bekor boʻladi va roʻyxat yangi
  turning **faqat koʻrinadigan** kategoriyalariga aylanadi — eski yozuvning yashirilgan
  kategoriyasi boshqa turda chiqmaydi.
- Pastdagi tugma yana **«Saqlash»**. Saqlangach forma yopiladi va qoldiq darhol qayta
  hisoblanadi; eski qiymat hech qayerda qolmaydi (0014, 10-mezon).

Bu ekranda **«Oʻchirish» tugmasi yoʻq** — oʻchirish «Yozuvlar» ekranidan bajariladi (0032).
`yaratilgan` maydoni koʻrsatilmaydi va tahrirlashda oʻzgarmaydi (0047).

---

## 2. «Yozuvlar» ekrani

### Nima koʻrinadi

Yuqorida panel: oʻrtada sarlavha **«Yozuvlar»**. **Vaqtinchalik (0063):** bu ekran pastki
navigatsiyaning oʻz boʻlimi, shuning uchun chapda **«‹ Orqaga»** havolasi yoʻq — qaytadigan
ekran yoʻq. Dashboard (3.10) qurilgach, u yerdan kirilganda «‹ Orqaga» qaytadi.

Ostida — kunlarga guruhlangan roʻyxat, pastga uzluksiz aylantiriladi (0032).

- **Kun sarlavhasi** (`kichik`, `matn-ikkinchi`, aylantirilganda tepada yopishib turadi):
  **«Bugun»**, **«Kecha»**, `14-avgust`, boshqa yildagi kun uchun `16-avgust 2025`.
- **Tartib:** kunlar yangisidan eskisiga. Bir kun ichida — `yaratilgan` boʻyicha, **eng oxirgi
  kiritilgani yuqorida** (0047). Foydalanuvchi tartibni oʻzgartira olmaydi: saralash tugmasi
  yoʻq.
- **Qator** (kamida 64 px, foni `yuza`):
  - chapda birinchi qator — kategoriya nomi (`matn-kuchli`);
  - chapda ikkinchi qator (`kichik`, `matn-ikkinchi`) — hisob nomi va izoh, orasida ` · `
    (masalan `Karta · nonushta`). Izoh boʻsh boʻlsa faqat hisob nomi turadi. Uzun izoh bir
    qatorda kesiladi va oxirida `…` qoʻyiladi;
  - oʻngda summa (`summa` oʻlchami): `−45 000 soʻm` (`chiqim` rangi) yoki `+12,50 $`
    (`kirim` rangi).
- **Minglik ajratish ikkala valyutada ham** boʻladi va faqat butun qismga tegadi:
  `−1 234,56 $`, `+1 200 000 soʻm`. Koʻrsatish va terish bitta formatga boʻysunadi
  (`design/uslub.md`) — odam formada nimani koʻrgan boʻlsa, roʻyxatda ham oʻshani koʻradi.
- Kurs qatorda koʻrsatilmaydi — u tahrirlash formasida turadi.
- Ekranda **qidiruv maydoni, filtr, saralash va oy tanlagichi yoʻq** (0002, 0032).
- Ekran faqat kirim-chiqim yozuvlarini koʻrsatadi; qarz operatsiyalari oʻz boʻlimida (0032).
- Bu ekranda yozuv qoʻshish tugmasi yoʻq — u bosh sahifada (PRD 27).
- Roʻyxatning oxirida 72 px boʻsh joy qoladi, oxirgi qator pastdagi panel ostida qolmasin.

### Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| Qator | Oʻsha yozuvning tahrirlash formasi ochiladi (1-boʻlim) |
| Qatorni chapga surish (telefon) | Qatorning oʻng chekkasida qizil **«Oʻchirish»** tugmasi ochiladi. Surishning oʻzi oʻchirmaydi — tugmani alohida bosish kerak |
| Qator ustiga sichqonchani olib borish (kompyuter) | Oʻsha joyda **«Oʻchirish»** matn tugmasi koʻrinadi |
| Boshqa joyga tegish yoki bosish | Ochilgan «Oʻchirish» tugmasi yopiladi |
| `Esc` (kompyuter) | Ochilgan «Oʻchirish» tugmasi yopiladi |
| **«Oʻchirish»** | Tasdiq soʻralmaydi (0029). Qator roʻyxatdan darhol yoʻqoladi, qoldiq va hisobot darhol qayta hisoblanadi. Ekran pastida «qaytarish» paneli chiqadi |

**Ochilgan «Oʻchirish» tugmasi qachon yopiladi.** Uchta holatda: tugmaning oʻzi bosilganda,
ekranning boshqa joyiga tegilganda (yoki bosilganda) va `Esc` bosilganda. Boshqa qatorning
tugmasi ochilsa, avvalgisi yopiladi — bir vaqtda faqat bitta qatorning tugmasi ochiq turadi.

**Kursor qatordan chiqib ketgani tugmani yopmaydi** (kompyuter). Sabab koʻrinishda: sichqoncha
qatordan «Oʻchirish» tugmasiga borayotganda yoʻl qatorning chekkasidan oʻtishi mumkin — kursor
chiqishi bilan yopiladigan tugma aynan odam unga qoʻl choʻzgan payt yoʻqoladi va bosish qator
ustiga tushib, tahrirlash formasini ochib yuboradi. Yaʼni yopilmaslik — xato emas, qoida:
tugma odam uni bir marta ochgandan keyin joyida turadi va faqat yuqoridagi uch harakatdan biri
bilan yopiladi.

### Oʻchirish va «qaytarish» paneli

- Panel ekranning pastida turadi: foni `qora-panel`, matni oq, yon chekkalardan 16 px,
  pastdan 16 px (qurilmaning xavfsiz zonasi hisobga olinadi), radiusi 10 px.
- Chapda: **«Yozuv oʻchirildi»**. Oʻngda tugma: **«QAYTARISH»** (oq, 600, balandligi 44 px).
- **«QAYTARISH» bosilsa:** yozuv oʻz joyiga qaytadi — sana va `yaratilgan` boʻyicha aynan
  oʻsha oʻringa (0047), qoldiq tiklanadi, panel yoʻqoladi (11-mezon).
- **Muddat — 7 soniya** (0048). Hisob panel koʻringan lahzadan boshlanadi; toʻxtatib turish
  (pauza) yoʻq.
- **Muddat tugasa:** panel yoʻqoladi va oʻchirish yakuniy boʻladi — oʻsha yozuv qaytmaydi
  (12-mezon).
- **Bir vaqtda bitta panel turadi.** Panel turganida ikkinchi yozuv oʻchirilsa, birinchisi
  oʻsha zahoti yakuniy boʻladi va panel yangi yozuv uchun qaytadan boshlanadi.
- Ekrandan chiqib ketilsa yoki ilova yopilsa panel yoʻqoladi va oʻchirish yakuniy boʻladi.
- Panel «Yozuvlar» ekranida ham, bosh sahifadagi qisqa roʻyxatda ham bir xil koʻrinadi va bir
  xil ishlaydi (0029, 20-mezon).
- **Vaqtinchalik (0063):** panel pastdagi navigatsiya panelining ustida turadi — qatlamlar
  tartibi `design/uslub.md` dagi navigatsiya boʻlimida.

### Boʻsh holat

Hali bitta ham yozuv yoʻq boʻlsa, ekranning oʻrtasidan biroz yuqorida ikkita qator turadi:

- `matn-kuchli`: **«Hali bitta ham yozuv yoʻq.»**
- `kichik`, `matn-ikkinchi`: **«Birinchi yozuvni bosh sahifadagi «＋ Yozuv» tugmasi bilan
  qoʻshasiz.»**

**Vaqtinchalik (0063):** dashboard qurilgunicha ikkinchi qator boshqacha yoziladi — **«Birinchi
yozuvni pastdagi «Yozuv» boʻlimi bilan qoʻshasiz.»** Bosh sahifa paydo boʻlganda yuqoridagi
asosiy matn qaytadi.

Bu holatda ham qoʻshish tugmasi qoʻyilmaydi (u bosh sahifada, hozircha — navigatsiya
panelida). Hamma yozuv oʻchirilganda ham
xuddi shu holat koʻrinadi; agar «qaytarish» paneli turgan boʻlsa, u boʻsh holat ustida turadi.

---

## 3. Kategoriyalar (boshqaruv)

Kirish yoʻli bitta: «Yangi yozuv» formasidagi kategoriya blokining oʻng tepasidagi
**«Boshqarish»** havolasi.

### Nima koʻrinadi

Yuqorida panel: chapda **«‹ Orqaga»**, oʻrtada sarlavha **«Kategoriyalar»**.

Ostida ikki boʻlakli segment: **«Chiqim»** | **«Kirim»** — roʻyxatlar alohida (0013).
Ekran ochilganda formada tanlangan tur ochiq turadi; forma tur tanlanmagan boʻlsa «Chiqim».

Segment ostida — koʻrinadigan kategoriyalar roʻyxati. Har qator: chapda nom (`matn`), oʻngda
matn tugma **«Yashirish»**.

Tayyor roʻyxat shu tartibda keladi (0028):

- **Chiqim:** oziq-ovqat, transport, ijara, kommunal, sogʻliq, kiyim, koʻngilochar, boshqa.
- **Kirim:** oylik, qoʻshimcha daromad, sovgʻa.

Nomlar 0028 dagidek **kichik harf bilan** saqlanadi va aynan shundayligicha koʻrsatiladi —
bosh harfga oʻgirilmaydi. Foydalanuvchi qoʻshgan nom oʻzi yozganidek turadi.

Yashirilgani boʻlsa, roʻyxat ostida sarlavha **«Yashirilgan»** (`kichik`, `matn-ikkinchi`) va
uning tagida oʻsha qatorlar: nom `matn-oʻchiq` rangda, oʻngda tugma **«Koʻrsatish»**.
Yashirilgani boʻlmasa bu boʻlim umuman koʻrinmaydi.

Pastda yopishib turgan panelda asosiy tugma: **«＋ Yangi kategoriya»**.

### Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| Segment («Chiqim»/«Kirim») | Roʻyxat oʻsha turnikiga almashadi |
| **«Yashirish»** | Qator koʻrinadiganlar roʻyxatidan «Yashirilgan» boʻlimiga oʻtadi. Tasdiq soʻralmaydi va «qaytarish» paneli chiqmaydi — qaytarish yoʻli «Koʻrsatish» tugmasining oʻzi (0029 oʻchirishga tegishli; yashirish oʻchirish emas). Kategoriya «Yangi yozuv» formasidagi chiplardan darhol yoʻqoladi (14-mezon) |
| **«Koʻrsatish»** | Qator koʻrinadiganlar roʻyxatiga qaytadi va formadagi chiplarda yana paydo boʻladi |
| **«＋ Yangi kategoriya»** | Roʻyxat tepasida bitta qator ochiladi: nom maydoni (fokus tushadi, klaviatura ochiladi, ichida **«Kategoriya nomi»**) va oʻngida tugma **«Qoʻshish»**; chapda `×` |
| **«Qoʻshish»** | Nom joriy turning roʻyxati oxiriga qoʻshiladi, kiritish qatori yopiladi, yangi qator roʻyxatda koʻrinadi va «Yangi yozuv» formasidagi chiplarda darhol paydo boʻladi (13-mezon) |
| `×` yoki tashqariga tegish | Kiritish qatori yopiladi, terilgani unutiladi |

Yashirish yozuvlarga tegmaydi: yashirilgan kategoriyadagi eski yozuvlar joyida qoladi,
«Yozuvlar» ekranida odatdagidek koʻrinadi va hisobotga kiradi (0013, 14-mezon). Oʻchiq rang
faqat shu boshqaruv ekranida ishlatiladi.

**Kategoriyani oʻchirish tugmasi yoʻq** — faqat yashirish bor (0013).

### Xato holatlari

| Holat | Odam nimani koʻradi |
|---|---|
| Nom boʻsh yoki faqat boʻshliq | Maydon ostida: **«Nom kiriting.»** |
| Shu nom **koʻrinib turgan** roʻyxatda bor | Maydon ostida: **«Bunday kategoriya bor.»** Bu matn faqat shu holat uchun — yashirilgani uchun ishlatilmaydi |
| Shu nom **yashirilganlar** orasida bor | Maydon ostida: **«Bunday kategoriya yashirilgan — pastdagi Yashirilgan roʻyxatidan Koʻrsatish tugmasi bilan qaytaring.»** Yangi kategoriya qoʻshilmaydi (0051) |

Ikkala tekshiruvda ham chekka boʻshliqlar va harf katta-kichikligi hisobga olinmaydi.

Nega ikki xil matn: yashirilgan kategoriya roʻyxatda koʻrinmaydi, shuning uchun «Bunday
kategoriya bor» degan matn odamni boshi bergan joyda qoldirardi — u nomni koʻrmayapti va nima
qilishni bilmaydi. Yoʻnaltiruvchi matn qaytarish yoʻlini oʻzi aytadi va u aynan shu ekranda,
bir bosish narida (0051, 0013).

Chiqim va kirim roʻyxatlari alohida: bir xil nom ikkalasida ham boʻlishi mumkin, bu xato emas —
ikkala tekshiruv ham faqat joriy tur roʻyxati ichida ishlaydi.

### Boʻsh holat

Bir roʻyxatning hamma kategoriyasi yashirilgan boʻlsa:

- Shu ekranda: `matn-kuchli` — **«Bu roʻyxatda koʻrinadigan kategoriya qolmadi.»**;
  `kichik`, `matn-ikkinchi` — **«Yashirilganini «Koʻrsatish» bilan qaytaring yoki yangisini
  qoʻshing.»**
- «Yangi yozuv» formasida chiplar oʻrnida: **«Koʻrinadigan kategoriya yoʻq — «Boshqarish» dan
  bittasini koʻrsating.»** Kategoriya majburiy boʻlgani uchun (0012) bu holatda yozuv
  saqlanmaydi va «Saqlash» bosilsa odatdagi **«Kategoriyani tanlang.»** xatosi chiqadi.

---

## «Qaytarish» muddati — 7 soniya

0029 «bir necha soniya» degan edi, aniq raqam **0048** bilan belgilandi: **7 soniya**. Bu
qatʼiy qiymat — taklif emas. Hisob panel koʻringan lahzadan boshlanadi; toʻxtatib turish
(pauza) yoʻq.

Nega 7 (0048 dagi sabab):

- Odam oʻchirilgan qatorni koʻzi bilan tekshirib ulgurishi kerak: barmoq ostidagi qator
  yoʻqolgandan keyin ekranga qarab, notoʻgʻri yozuv oʻchganini anglash bir necha soniya oladi.
- 3–5 soniya qisqa: panel roʻyxatning pastki qismini yopib turadi, odam esa aynan shu payt
  roʻyxatni surib tekshiradi — tugma tekshirish tugagunicha yoʻqolib qoladi.
- 10 soniya va undan uzoq: panel ekranning pastki 72 px ini juda uzoq band qiladi, ketma-ket
  ikkinchi yozuvni oʻchirish va roʻyxatni koʻrish xalaqit beradi.
- 7 — ikkalasining oʻrtasi: reaksiya uchun yetadi, ekranni band qilib turmaydi.

---

## Savollar — hammasi yopilgan

Bu tavsif yozilganda uchta savol ochilgan edi; uchalasiga ham odam javob berdi va matn shu
javoblarga moslandi. **Ochiq savol qolmadi.**

1. **«Qaytarish» tugmasi necha soniya turadi?** → **0048**: 7 soniya. Yuqoridagi boʻlimga
   qatʼiy qiymat boʻlib yozildi.
2. **Kurs maydoniga `0` kiritilsa nima boʻladi?** → **0049**: taqiqlanadi. Xatolar jadvalida
   oʻz qatori bor: «Kurs notoʻgʻri», yozuv saqlanmaydi.
3. **«Kirim yoki chiqim» uchun standart qiymat boʻladimi?** → **0050**: yoʻq. Tur oldindan
   tanlanmaydi — tavsifdagi holat oʻzgarishsiz qoldi, endi u qaror bilan mustahkam.
