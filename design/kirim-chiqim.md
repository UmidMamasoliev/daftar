# Kirim-chiqim — ekranlar

Sana: 2026-08-17. Asos: `prds/kirim-chiqim.md`. Rang, oʻlcham va boʻshliq — `design/uslub.md`
(bu yerda ular nom bilan ataladi: `matn-ikkinchi`, `chip`, `asosiy tugma`).
Qarorlar: 0009, 0011, 0012, 0013, 0014, 0023, 0026, 0028, 0029, 0032, 0033, 0034, 0042, 0047,
0048, 0049, 0050, 0051.

Uchta ekran: **Yangi yozuv** (kiritish formasi), **Yozuvlar** (toʻliq roʻyxat),
**Kategoriyalar** (boshqaruv).

Ekrandagi matnlar shu faylda aynan yozilgan — frontend oʻshani koʻchiradi, oʻzgartirmaydi.

**Navigatsiya:** «Yangi yozuv» va «Yozuvlar» ekranlariga bosh sahifadan (dashboard) kiriladi,
«Kategoriyalar» ga esa «Yangi yozuv» formasidan. Keyingi qismlar (qarz daftari, oylik hisobot)
qoʻshilganda navigatsiya kengayadi.

---

## 1. Yangi yozuv (kiritish formasi)

### Nima koʻrinadi

Yuqorida panel: chapda `×` (yopish), oʻrtada sarlavha **«Yangi yozuv»**.

Ostida, yuqoridan pastga:

1. **Summa** — katta maydon (56 px). Ochilganda kursor shu yerda va raqam klaviaturasi ochiq.
   Boʻsh holatda ichida `0` turadi (`matn-oʻchiq`). Maydonning oʻng chekkasida valyuta soʻzi:
   **soʻm** (`matn-ikkinchi`).
2. **Tur** — ikki boʻlakli segment: **«Chiqim»** | **«Kirim»**. Ochilganda **hech biri
   tanlanmagan**: u majburiy maydon va standart qiymati yoʻq (0012, 0050).
3. **Kategoriya** — yorligʻi chapda «Kategoriya», oʻng tepasida matn-havola
   **«Boshqarish»**. Tagida chiplar qatori.
   - Tur tanlanmaguncha chip oʻrnida bitta qator turadi (`mayda`, `matn-ikkinchi`):
     **«Avval kirim yoki chiqim tanlang.»**
   - Tur tanlangach oʻsha turning koʻrinadigan kategoriyalari chip boʻlib chiqadi. Tartib —
     0028 dagidek, undan keyin foydalanuvchi qoʻshganlari qoʻshilish tartibida. Chiplar
     oʻrash bilan bir necha qatorga tushadi, roʻyxat qisqartirilmaydi.
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
| Summa maydoni | raqam klaviaturasi ochiladi; soʻmda kasr belgisi qabul qilinmaydi, dollarda ikki kasrgacha (0033) |
| «Chiqim» / «Kirim» | segment boʻlagi `chiqim` yoki `kirim` rangiga boʻyaladi; kategoriya chiplari oʻsha turning roʻyxati bilan almashadi. Tur oʻzgartirilsa tanlangan kategoriya bekor boʻladi (roʻyxatlar alohida — 0013) |
| Kategoriya chipi | chip tanlangan koʻrinishga oʻtadi; bir vaqtda faqat bittasi tanlanadi |
| «Boshqarish» | «Kategoriyalar» ekrani ochiladi (3-boʻlim); qaytilganda forma toʻldirilgan holicha turadi |
| «Karta» / «Naqd» | chip almashadi, boshqa hech narsa oʻzgarmaydi |
| «soʻm» / «dollar» | summa maydonining oʻngidagi soʻz `soʻm` ↔ `$` ga almashadi; «dollar» da kurs maydoni ochiladi, «soʻm» ga qaytilsa kurs maydoni yopiladi va kiritilgani unutiladi |
| Sana tugmasi | qurilmaning sana tanlagichi ochiladi; ertangi va undan keyingi kunlar oʻchiq — tanlanmaydi (0034). Tanlangach tugmada «Bugun», «Kecha» yoki `14-avgust` yozuvi turadi |
| Izoh maydoni | matn klaviaturasi ochiladi; boʻsh qolsa ham yozuv saqlanadi (0012) |
| **«Saqlash»** | hamma tekshiruv bir yoʻla bajariladi. Xato boʻlsa — pastdagi jadval. Xato boʻlmasa: yozuv saqlanadi, forma yopiladi, odam oʻzi kelgan ekranga qaytadi; yangi yozuv roʻyxatda darhol koʻrinadi va qoldiq darhol yangilanadi. Alohida tasdiq oynasi yoki «saqlandi» xabari koʻrsatilmaydi — natijaning oʻzi koʻrinib turadi |
| `×` | forma darhol yopiladi, kiritilgani saqlanmaydi; tasdiq soʻralmaydi (0029 ruhi: bu daftarda tasdiq oynasi yoʻq) |

### Eng qisqa yoʻl — bir yozuv necha qadamda tugaydi

Kundalik holat: soʻmdagi chiqim, kartadan, bugungi sana bilan.

1. Bosh sahifadagi **«＋ Yozuv»** tugmasi — forma ochiladi, kursor summada, raqam klaviaturasi
   ochiq.
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
- Faqat butun son qabul qiladi — kasr belgisi maydonga tushmaydi (0042).
- Terilayotganda mingliklar boʻsh joy bilan ajratiladi: `12 500`.
- Summa maydoni ikki kasrgacha qabul qiladi, oʻngdagi soʻz `$` boʻladi (0033).
- «soʻm» ga qaytilsa kurs maydoni yopiladi va yozuvda kurs saqlanmaydi (7-mezon).

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
| Manfiy son | Hech narsa koʻrmaydi: `−` belgisi maydonga umuman tushmaydi, yopishtirilgan matndan ham olib tashlanadi. Xato matni chiqmaydi, chunki notoʻgʻri qiymat maydonga kirmaydi (0033) |
| Soʻmda kasr terilsa | `,` va `.` maydonga tushmaydi. Kasrli matn yopishtirilsa maydon ostida: **«Soʻmda tiyin yoʻq — butun son kiriting.»** |
| Dollarda kasrli summa terib, keyin «soʻm» ga oʻtilsa | Kasr qismi olib tashlanadi va maydon ostida bir qatorlik ogohlantirish turadi: **«Soʻmda tiyin yoʻq — kasr qismi olib tashlandi.»** Bu xato emas, saqlashga toʻsqinlik qilmaydi |
| Kelajak sanasi | Sana tanlagichda ertangi va undan keyingi kunlar oʻchiq koʻrinadi va bosilmaydi (0034). Agar qurilma tanlagichi baribir kelajak sanasini qaytarsa, sana qatori ostida: **«Sana bugundan keyin boʻlmaydi.»** |
| Dollar tanlangan, kurs boʻsh | Kurs maydoni qizil chegara oladi, tagida: **«Kursni kiriting — 1 dollar necha soʻm.»** |
| Kursda kasr | Kasr belgisi maydonga tushmaydi. Kasrli matn yopishtirilsa: **«Kurs butun soʻmda kiritiladi.»** |
| Kurs `0` | Kurs maydoni qizil chegara oladi, tagida: **«Kurs notoʻgʻri»**. Yozuv saqlanmaydi (0049) |
| Summa yoki kursga harf/belgi terilsa | Raqam boʻlmagan belgi maydonga tushmaydi; xato matni chiqmaydi |

### Tahrirlash rejimi

Xuddi shu forma, uchta farq bilan:

- Sarlavha: **«Yozuvni tahrirlash»**.
- Hamma maydon yozuvdagi qiymat bilan toʻldirilgan holda ochiladi (dollarda kurs ham).
- Pastdagi tugma yana **«Saqlash»**. Saqlangach forma yopiladi va qoldiq darhol qayta
  hisoblanadi; eski qiymat hech qayerda qolmaydi (0014, 10-mezon).

Bu ekranda **«Oʻchirish» tugmasi yoʻq** — oʻchirish «Yozuvlar» ekranidan bajariladi (0032).
`yaratilgan` maydoni koʻrsatilmaydi va tahrirlashda oʻzgarmaydi (0047).

---

## 2. «Yozuvlar» ekrani

### Nima koʻrinadi

Yuqorida panel: chapda matn-havola **«‹ Orqaga»**, oʻrtada sarlavha **«Yozuvlar»**.

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
| Boshqa joyga tegish | Ochilgan «Oʻchirish» tugmasi yopiladi |
| **«Oʻchirish»** | Tasdiq soʻralmaydi (0029). Qator roʻyxatdan darhol yoʻqoladi, qoldiq va hisobot darhol qayta hisoblanadi. Ekran pastida «qaytarish» paneli chiqadi |

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

### Boʻsh holat

Hali bitta ham yozuv yoʻq boʻlsa, ekranning oʻrtasidan biroz yuqorida ikkita qator turadi:

- `matn-kuchli`: **«Hali bitta ham yozuv yoʻq.»**
- `kichik`, `matn-ikkinchi`: **«Birinchi yozuvni bosh sahifadagi «＋ Yozuv» tugmasi bilan
  qoʻshasiz.»**

Bu holatda ham qoʻshish tugmasi qoʻyilmaydi (u bosh sahifada). Hamma yozuv oʻchirilganda ham
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
