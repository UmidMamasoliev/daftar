# Qarz daftari — ekranlar

Sana: 2026-08-17. Asos: `prds/qarz-daftari.md`. Rang, oʻlcham va boʻshliq — `design/uslub.md`
(bu yerda ular nom bilan ataladi: `matn-ikkinchi`, `chip`, `asosiy tugma`). Naqsh —
`design/kirim-chiqim.md`: forma, xatolar jadvali va «qaytarish» paneli oʻsha qoidalar boʻyicha
ishlaydi, bu yerda ular takrorlanmaydi, faqat farqi yoziladi.
Qarorlar: 0009, 0011, 0015, 0016, 0017, 0023, 0026, 0029, 0030, 0031, 0033, 0034, 0035, 0037,
0038, 0042, 0044, 0045, 0047, 0048, 0049, 0052, 0056, 0059, 0060, 0061, 0062,
0063 → 0067.

Toʻrtta ekran: **Qarz daftari** (kontaktlar roʻyxati), **Kontakt** (qarzlari va toʻlovlari
bilan), **Yangi qarz**, **Toʻlov**. Qarzni tahrirlash alohida ekran emas — «Yangi qarz»
formasining oʻzi boshqa sarlavha bilan ochiladi (3-boʻlim, 0059). Kontakt qoʻshish ham,
kontaktni tahrirlash ham alohida ekran emas — ochiladigan blok (1- va 2-boʻlimlar, 0060),
«Kategoriyalar» ekranidagi qoʻshish qatori bilan bir xil naqshda.

Ekrandagi matnlar shu faylda aynan yozilgan — frontend oʻshani koʻchiradi, oʻzgartirmaydi.

**Navigatsiya (0067):** «Qarz daftari» ekraniga navigatsiya panelining **«Qarz daftari»**
boʻlimidan kiriladi (panel tavsifi — `design/uslub.md`). «Kontakt» sahifasiga roʻyxatdan;
«Yangi qarz» ga kontakt sahifasidan; «Toʻlov» ga aynan qarz kartochkasidagi tugmadan;
«Qarzni tahrirlash» ga qarz kartochkasining boshiga bosib. Boshqa kirish yoʻli yoʻq.

Bosh sahifada qarz qoldigʻi alohida raqam sifatida koʻrsatilmaydi (PRD 28; 0020), demak
qarz daftariga bosh sahifadan alohida yoʻl ham yoʻq — u faqat oʻz navigatsiya bandi.

---

## 0. Uchta qolip — bir joyda

Quyidagi uchtasi ikkala roʻyxatda ham, ikkala formada ham qayta ishlatiladi. Bir marta shu
yerda taʼriflanadi.

### Netto qatori (0037, 0056)

Kontaktning har valyuta uchun bitta raqami. Hisob qoidasi: **faqat ochiq qarzlar** boʻyicha
«berdim» minus «oldim», valyutalar aralashtirilmaydi.

- Qator **faqat oʻsha valyutada ochiq qarz bor** boʻlsa chiziladi (7a). Chegara bilan yopilgan
  qarz (0052) hisobga umuman kirmaydi va uning mikro-qoldigʻi hech qayerda koʻrinmaydi (7a1).
- Qatorda ikki narsa turadi: **soʻz** va **ishorali summa**.

| Netto | Soʻz (`kichik`, `matn-ikkinchi`) | Summa | Rang |
|---|---|---|---|
| Menga qaytadi (berdim > oldim) | **«olaman»** | `+700 000 soʻm` | `kirim` |
| Men beraman (oldim > berdim) | **«beraman»** | `−50,00 $` | `chiqim` |
| Aynan nol, lekin ochiq qarz bor | **«hisob teng»** | `0,00 $` (ishorasiz) | `matn` |

«hisob teng» holati haqiqiy va koʻrsatiladi: 100 $ berilib 100 $ olingan kontaktda netto nol,
lekin ikkala qarz ham ochiq (15e-mezon) — qator yoʻqolib ketmaydi.

«≈ jami soʻmda» qatori qarz daftarida **hech qayerda yoʻq** — qarz qatorlari valyuta boʻyicha
alohida va taxminsiz (0038).

### Qarz kartochkasi

Foni `yuza`, radiusi 10 px, 1 px `chegara`, ichki chekkasi 12 px yuqori-past / 16 px yon.

- **1-qator:** chapda yoʻnalish soʻzi — **«Berdim»** yoki **«Oldim»** (`matn-kuchli`);
  oʻngda joriy qoldiq (`summa` oʻlchami, netto qatoridagi rang va ishora qoidasi bilan):
  `+700 000 soʻm` yoki `−50,00 $`.
- **2-qator** (`kichik`, `matn-ikkinchi`), orasida ` · `:
  `14-avgust · Karta · boshlangʻich 1 000 000 soʻm`.
- **Toʻlovlar** — shu kartochka ichida, 12 px pastda, har biri bitta qator (pastga qarang).
- **Yopilgan qarzda** qoldiq oʻrnida soʻz turadi: **«Yopilgan»** (`kichik`, `matn-ikkinchi`),
  rangli raqam chizilmaydi. Mikro-qoldiq (≤ 1 sent / ≤ 100 soʻm) koʻrsatilmaydi (0052, 0056).
- Ochiq qarz kartochkasining pastida matn-havola: **«＋ Toʻlov»**. **Yopilgan qarzda bu havola
  yoʻq** — yopilgan qarzga toʻlov qoʻshilmaydi (0061).

**«Kartochka boshi»** — 1- va 2-qator birga. Qarzning oʻzi shu joydan boshqariladi: bosilsa
tahrirlash formasi ochiladi, surilsa «Oʻchirish» tugmasi chiqadi (2-boʻlim, 0059). Toʻlov
qatorlari va **«＋ Toʻlov»** havolasi kartochka boshiga kirmaydi — ular oʻz harakatlarini
saqlaydi.

### Toʻlov qatori

- Chapda 1-qator: sana — **«Bugun»**, **«Kecha»** yoki `14-avgust` (`matn`).
- Chapda 2-qator (`kichik`, `matn-ikkinchi`): hisob nomi; toʻlov **boshqa valyutada** kelgan
  boʻlsa — kiritilgan summa va kurs ham, orasida ` · `:
  `Karta · 625 000 soʻm · 1 $ = 12 500 soʻm`.
- Oʻngda: qarz valyutasida ayirilgan summa `−` ishorasi bilan: `−50,00 $`.
- **Toʻlov summasi rang olmaydi** (`matn`). Sabab: `−` bu yerda «qarz qoldigʻidan ayirildi»
  degani, pulning chiqimi degani emas — «berdim» qarziga kelgan toʻlov aslida pulni hisobga
  **qoʻshadi**. Rang qoʻyilsa u yozuvlar ekranidagi rang bilan zid maʼno berardi.

---

## 1. «Qarz daftari» — kontaktlar roʻyxati

### Nima koʻrinadi

Yuqorida sarlavha **«Qarz daftari»**. Bu ekran navigatsiyaning oʻz boʻlimi (0067), shuning
uchun chapda **«‹ Orqaga»** havolasi yoʻq — qaytadigan ekran yoʻq.

Ostida — kontaktlar roʻyxati, pastga aylantiriladi. Qidiruv, filtr va saralash tugmasi
yoʻq (0002).

**Kontakt qatori** (foni `yuza`, kamida 64 px, tagida 1 px `chegara`):

- 1-qator: ism (`matn-kuchli`) — kiritilganidek, bosh harfga oʻgirilmaydi.
- 2-qator: telefon raqami (`kichik`, `matn-ikkinchi`). Raqam boʻsh boʻlsa bu qator yoʻq.
  Raqam faqat matn — bosilmaydi, qoʻngʻiroq yoki SMS havolasi qilinmaydi (0031).
- Ostida — netto qatorlari (0-boʻlim), har ochiq valyuta uchun bittadan, oʻngga tekislangan.
  Ochiq qarzi yoʻq kontaktda birorta netto qatori chiqmaydi va oʻrniga hech narsa
  qoʻyilmaydi — qator faqat ismdan iborat boʻladi. Shunda koʻz faqat raqamli qatorlarga
  tushadi.

**Tartib:** alifbo boʻyicha, harf katta-kichikligi hisobga olinmaydi (oʻzbek lotin tartibi).
Qidiruv yoʻq (0002), shuning uchun tartib oldindan bilinadigan boʻlishi kerak — kiritish
tartibi bilan qoʻyilsa odam roʻyxatni har safar boshdan oʻqib chiqardi. Foydalanuvchi tartibni
oʻzgartira olmaydi.

Bir xil ism ikki marta boʻlishi mumkin va bu xato emas — ularni telefon raqami ajratadi
(0031).

Pastda yopishib turgan panelda asosiy tugma: **«＋ Yangi kontakt»**.

### Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| Kontakt qatori | Oʻsha kontakt sahifasi ochiladi (2-boʻlim) |
| **«＋ Yangi kontakt»** | Roʻyxat tepasida qoʻshish bloki ochiladi (pastga qarang); fokus «Ism» maydoniga tushadi, klaviatura ochiladi |
| **«Qoʻshish»** | Kontakt saqlanadi, blok yopiladi, yangi qator roʻyxatda alifbodagi oʻz oʻrnida koʻrinadi. Ekran oʻsha qatorga suriladi — yangi kontakt roʻyxat oʻrtasiga tushib koʻrinmay qolmasin |
| `×` yoki blokdan tashqariga tegish | Blok yopiladi, terilgani unutiladi |

Roʻyxat qatorida **oʻchirish yoʻq**: kontakt oʻchirish faqat kontakt sahifasidan bajariladi
(2-boʻlim). Sabab — oʻchirish shartli (0030): ochiq qarzi bor kontakt oʻchmaydi, va rad javobi
qarzlar koʻrinib turgan joyda tushunarli boʻladi. Surib oʻchiradigan qatorda esa harakat
koʻpincha rad javobi bilan tugardi.

### Yangi kontakt bloki

Roʻyxat tepasida ochiladi, foni `yuza`, ichida yuqoridan pastga:

1. **Ism** maydoni — ichida namuna matn **«Ism»**; fokus shu yerda.
2. **Telefon** maydoni — ichida **«Telefon (ixtiyoriy)»**. Format tekshirilmaydi: qanday
   terilsa shunday saqlanadi (0031).
3. Oʻngda asosiy tugma **«Qoʻshish»**, chapda `×`.

Boshqa maydon yoʻq (0031).

### Xato holatlari

Tekshirish **«Qoʻshish»** bosilganda bajariladi.

| Holat | Odam nimani koʻradi |
|---|---|
| Ism boʻsh yoki faqat boʻshliq | Ism maydoni qizil chegara oladi, tagida: **«Ism kiriting.»** |
| Shu ism roʻyxatda bor | Xato **yoʻq** — kontakt saqlanaveradi. Bir xil ismli ikki odam boʻlishi mumkin va ularni telefon raqami ajratadi (0031) |
| Telefon boʻsh | Xato yoʻq — kontakt saqlanadi (1-mezon) |

Ism chekka boʻshliqlari kesib saqlanadi.

### Boʻsh holat — bitta ham kontakt yoʻq

Ekranning oʻrtasidan biroz yuqorida ikkita qator:

- `matn-kuchli`: **«Hali bitta ham kontakt yoʻq.»**
- `kichik`, `matn-ikkinchi`: **«Qarz yozish uchun avval kontakt qoʻshing — pastdagi «＋ Yangi
  kontakt» tugmasi bilan.»**

Pastdagi «＋ Yangi kontakt» tugmasi bu holatda ham oʻz joyida turadi. Hamma kontakt
oʻchirilganda ham xuddi shu holat koʻrinadi; «qaytarish» paneli turgan boʻlsa, u boʻsh holat
ustida turadi.

---

## 2. Kontakt sahifasi

### Nima koʻrinadi

Yuqorida panel: chapda **«‹ Orqaga»**, oʻrtada sarlavha — **kontakt ismi**, oʻngda matn-havola
**«Tahrirlash»** (0060). Ism uzun boʻlsa bir qatorda kesiladi va oxirida `…` qoʻyiladi.

Ostida, yuqoridan pastga:

1. **Telefon raqami** (`kichik`, `matn-ikkinchi`) — boʻlsa. Bosilmaydi (0031).
2. **Netto bloki** — har ochiq valyuta uchun bitta blok, orasi 16 px:
   - ustida soʻz: **«olaman»** / **«beraman»** / **«hisob teng»** (`kichik`, `matn-ikkinchi`);
   - ostida summa `raqam-katta` oʻlchamda, ishora va rang bilan: `+700 000 soʻm`.
   Bu — «falonchiga qancha qoldi» degan savolning javobi, shuning uchun ekranning eng katta
   raqami. Ikki valyuta boʻlsa ikkita blok ustma-ust turadi.
   Ochiq qarz yoʻq boʻlsa netto bloki **umuman chizilmaydi** (7a1) va oʻrnida bir qator turadi
   (`kichik`, `matn-ikkinchi`): **«Ochiq qarz yoʻq.»**
3. **Qarzlar roʻyxati** — qarz kartochkalari (0-boʻlim), orasi 12 px:
   - avval **ochiq** qarzlar, yangisidan eskisiga (sana boʻyicha; bir xil sanada `yaratilgan`
     boʻyicha oxirgi kiritilgani yuqorida — 0047);
   - keyin sarlavha **«Yopilgan qarzlar»** (`kichik`, `matn-ikkinchi`) va uning ostida yopilgan
     qarzlar, xuddi shu tartibda. Yopilgani boʻlmasa bu sarlavha koʻrinmaydi.
4. Har kartochka ichida — oʻsha qarzning toʻlovlari, yangisidan eskisiga. Toʻlov boʻlmasa bir
   qator: **«Hali toʻlov yoʻq.»** (`mayda`, `matn-ikkinchi`).
5. Roʻyxat oxirida — xavfli tugma **«Kontaktni oʻchirish»**.
6. Undan keyin boʻsh joy: oxirgi element pastdagi panellar ostida qolmasin. Oʻlchami
   `design/uslub.md` dagi «Pastdagi panellar tartibi» boʻlimida — asosiy tugma paneli
   (72 px) va navigatsiya paneli birga hisoblanadi (0067).

Pastda yopishib turgan panelda asosiy tugma: **«＋ Yangi qarz»**.

Bu ekranda **qidiruv, filtr va davr tanlagichi yoʻq** (0002); qarz muddati va eslatma ham
yoʻq (0016).

### Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| **«＋ Yangi qarz»** | «Yangi qarz» formasi ochiladi, kontakt oldindan maʼlum (3-boʻlim) |
| **«Tahrirlash»** (yuqori panelda) | Sahifa tepasida kontakt tahrirlash bloki ochiladi (pastdagi bandga qarang, 0060) |
| **«＋ Toʻlov»** (ochiq qarz kartochkasida) | «Toʻlov» formasi ochiladi, qarz oldindan maʼlum (4-boʻlim) |
| Qarz kartochkasining boshi | «Qarzni tahrirlash» formasi ochiladi (3-boʻlim, «Tahrirlash rejimi»). Yopilgan qarz ham tahrirlanadi |
| Kartochka boshini chapga surish (telefon) | Kartochka boshining oʻng chekkasida qizil **«Oʻchirish»** tugmasi ochiladi. Surishning oʻzi oʻchirmaydi |
| Kartochka boshi ustiga sichqonchani olib borish (kompyuter) | Oʻsha joyda **«Oʻchirish»** matn tugmasi koʻrinadi |
| **«Oʻchirish»** (qarz) | Pastdagi «Qarzni oʻchirish» bandiga qarang (0059) |
| Toʻlov qatorini chapga surish (telefon) | Qatorning oʻng chekkasida qizil **«Oʻchirish»** tugmasi ochiladi. Surishning oʻzi oʻchirmaydi |
| Toʻlov qatori ustiga sichqonchani olib borish (kompyuter) | Oʻsha joyda **«Oʻchirish»** matn tugmasi koʻrinadi |
| Boshqa joyga tegish, bosish yoki `Esc` | Ochilgan «Oʻchirish» tugmasi yopiladi |
| **«Oʻchirish»** (toʻlov) | Tasdiq soʻralmaydi (0029). Toʻlov qatori darhol yoʻqoladi, qarz qoldigʻi darhol oʻsha summaga ortadi, netto bloki va hisob qoldiqlari qayta hisoblanadi. Pastda «qaytarish» paneli chiqadi (5-boʻlim) |
| **«Kontaktni oʻchirish»** | Pastdagi bandga qarang |

«Oʻchirish» tugmasi qachon yopilishi, kursor qatordan chiqib ketgani tugmani yopmasligi va bir
vaqtda faqat bitta qatorning tugmasi ochiq turishi — `design/kirim-chiqim.md` 2-boʻlimidagi
qoidalarning aynan oʻzi. «Bitta» hisobi butun ekran boʻyicha: kartochka boshining tugmasi
ochilsa, ochiq turgan toʻlov tugmasi yopiladi va aksincha.

Kartochka boshi bosilgani qarzni tahrirlashga olib boradi, toʻlov qatori bosilgani esa **hech
narsa qilmaydi** — toʻlov tahrirlanmaydi, u faqat oʻchiriladi (0059 qarzga va kontaktga
tegishli; toʻlov uchun spec 9-band oʻzgarmadi).

Toʻlov oʻchirilishi qarzni yana **ochiq** qilib qoʻyishi mumkin (qoldiq chegaradan oshib
ketadi) — oʻshanda kartochka «Yopilgan qarzlar» boʻlimidan ochiqlar orasiga qaytadi va netto
qatori paydo boʻladi. Yopiqlik holat maydoni emas, har safar qoldiqdan hisoblanadi (0052, 8b).

### Qarzni oʻchirish (0059)

Tasdiq soʻralmaydi (0029) — yozuv, toʻlov va kontakt bilan bir xil yoʻl.

- **«Oʻchirish»** bosilishi bilan kartochka roʻyxatdan darhol yoʻqoladi. **Qarzning hamma
  toʻlovi ham u bilan birga oʻchadi** — ular qarzsiz yashamaydi.
- Netto bloki, hisob qoldiqlari (qarzning oʻzi va hamma toʻlovi bekor qilingan holatda) darhol
  qayta hisoblanadi.
- Pastda «qaytarish» paneli chiqadi: **«Qarz oʻchirildi»** (5-boʻlim).
- **«QAYTARISH» bosilsa:** qarz oʻz oʻrniga qaytadi (sana va `yaratilgan` boʻyicha aynan oʻsha
  oʻringa — 0047), hamma toʻlovi ham qaytadi, qoldiq, netto va hisob qoldiqlari tiklanadi.
- Muddat tugasa oʻchirish yakuniy: qarz ham, toʻlovlari ham qaytmaydi.
- Qarzi oʻchirilgach kontaktda ochiq qarz qolmasa, netto bloki oʻrnida **«Ochiq qarz yoʻq.»**
  qatori turadi va kontakt oʻchirilishi mumkin boʻlib qoladi (0030). Panel turgan payt ham
  shunday: oʻchirish darhol kuchga kiradi, «qaytarish» uni orqaga qaytaradi.

### Kontaktni tahrirlash (0060)

Yuqori paneldagi **«Tahrirlash»** havolasi blok ochadi — 1-boʻlimdagi «Yangi kontakt»
blokining aynan oʻzi, ikki farq bilan: maydonlar kontaktning joriy qiymati bilan toʻldirilgan
va oʻngdagi asosiy tugma **«Saqlash»** deb ataladi.

Blok yuqori panelning ostida, sahifaning eng tepasida ochiladi (telefon qatori va netto
blokining ustida); qolgan mazmun pastga suriladi, hech narsa yashirilmaydi.

1. **Ism** maydoni — toʻldirilgan, fokus shu yerda, matn tanlangan holda emas (odam soʻz
   qoʻshishi koʻproq uchraydi).
2. **Telefon** maydoni — toʻldirilgan; boʻsh boʻlsa ichida namuna matn **«Telefon
   (ixtiyoriy)»**.
3. Oʻngda **«Saqlash»**, chapda `×`.

Boshqa maydon yoʻq: qarzlar, qoldiq va tarix bu blokda tahrirlanmaydi (0031).

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| **«Saqlash»** | Ism va telefon yangilanadi, blok yopiladi. Yuqori paneldagi sarlavha va roʻyxatdagi qator darhol yangi ism bilan koʻrinadi; roʻyxatga qaytilganda kontakt alifbodagi yangi oʻrnida turadi |
| `×` yoki blokdan tashqariga tegish | Blok yopiladi, oʻzgartirilgani unutiladi; tasdiq soʻralmaydi |
| **«Tahrirlash»** blok ochiq turganda | Blok yopiladi — havola oʻzi ochgan blokni oʻzi yopadi; oʻzgartirilgani unutiladi |

Xato holati bitta va u qoʻshishdagi bilan bir xil matn bilan aytiladi:

| Holat | Odam nimani koʻradi |
|---|---|
| Ism boʻsh yoki faqat boʻshliq | Ism maydoni qizil chegara oladi, tagida: **«Ism kiriting.»** Blok yopilmaydi |
| Shu ism boshqa kontaktda bor | Xato yoʻq — saqlanaveradi; bir xil ismli ikki odam boʻlishi mumkin (0031) |
| Telefon boʻshatilsa | Xato yoʻq — raqamsiz kontakt saqlanadi va roʻyxatda ikkinchi qator chizilmaydi |

Ism chekka boʻshliqlari kesib saqlanadi. Tahrirlash qarzlarga, toʻlovlarga va qoldiqlarga
tegmaydi — faqat ikkita maydon oʻzgaradi.

### Kontaktni oʻchirish (0030)

Tugma **har doim bosiladi** — oʻchiq holatga oʻtkazilmaydi. Sabab: 16-mezon «urinish rad
etiladi va sabab koʻrsatiladi» deydi; oʻchiq tugma esa sababni aytmaydi.

- **Ochiq qarzi bor boʻlsa:** hech narsa oʻchmaydi, tugma ostida `mayda` oʻlchamda `chiqim`
  rangli qator chiqadi: **«Ochiq qarzi bor kontakt oʻchirilmaydi — avval qarzlarni yoping.»**
  Qator ekrandan chiqib ketilgunicha turadi.
- **Ochiq qarzi yoʻq boʻlsa** (umuman qarzi yoʻq, yoki hammasi yopilgan — chegara bilan
  yopilgani ham toʻsiq emas, 0052/0056): tasdiq soʻralmaydi (0029). Kontakt darhol oʻchadi va
  **yopilgan qarz tarixi ham u bilan birga ketadi** (0030). Ekran «Qarz daftari» roʻyxatiga
  qaytadi, oʻsha yerda «qaytarish» paneli chiqadi.
- **«QAYTARISH» bosilsa:** kontakt ham, uning hamma qarzi va toʻlovi ham qaytadi (18-mezon).

### Boʻsh holatlar

**Kontaktda hali qarz yoʻq:**

- `matn-kuchli`: **«Bu kontaktda hali qarz yoʻq.»**
- `kichik`, `matn-ikkinchi`: **«Birinchi qarzni pastdagi «＋ Yangi qarz» tugmasi bilan
  qoʻshasiz.»**

Bu holatda netto bloki ham, «Ochiq qarz yoʻq.» qatori ham chizilmaydi — boʻsh holat matni
ularning oʻrnini egallaydi. «Kontaktni oʻchirish» tugmasi oʻz joyida turadi.

**Qarzi bor, lekin hammasi yopilgan:** netto bloki oʻrnida **«Ochiq qarz yoʻq.»**, ostida
darhol «Yopilgan qarzlar» sarlavhasi va kartochkalar.

**Qarzda toʻlov yoʻq:** kartochka ichida **«Hali toʻlov yoʻq.»**

---

## 3. «Yangi qarz» formasi

Kirish yoʻli bitta: kontakt sahifasidagi **«＋ Yangi qarz»**. Shuning uchun kontakt formada
tanlanmaydi — u allaqachon maʼlum.

### Nima koʻrinadi

Yuqorida panel: chapda `×` (yopish), oʻrtada sarlavha **«Yangi qarz»**.

Ostida, yuqoridan pastga:

1. **Kontakt qatori** (`kichik`, `matn-ikkinchi`, maydon emas): **«Kontakt: Akmal»**. Bosilmaydi
   va oʻzgartirilmaydi.
2. **Summa** — katta maydon (56 px), kursor shu yerda, raqam klaviaturasi ochiq. Boʻsh holatda
   ichida `0` (`matn-oʻchiq`), oʻng chekkasida valyuta soʻzi: **soʻm** (`matn-ikkinchi`).
   Terish qoidalari — `design/kirim-chiqim.md` «Summa maydoni — terish qoidalari» bilan aynan
   bir xil.
3. **Yoʻnalish** — ikki boʻlakli segment: **«Berdim»** | **«Oldim»**. Ochilganda **hech biri
   tanlanmagan** — standart qiymat yoʻq (0062, yozuv formasidagi 0050 bilan bir sabab: notoʻgʻri
   yoʻnalish raqamni qarama-qarshi tomonga yozadi va odam buni sezmaydi). Tanlanganda «Berdim»
   boʻlagi `chiqim` rangiga (pul qoʻldan chiqadi), «Oldim» boʻlagi `kirim` rangiga (pul qoʻlga
   kiradi) boʻyaladi (0017).
4. **Hisob** — yorligʻi «Hisob», tagida ikki chip: **«Karta»** | **«Naqd»**. Ochilganda
   **«Karta»** tanlangan (0035).
5. **Valyuta** — yorligʻi «Valyuta», tagida ikki chip: **«soʻm»** | **«dollar»**. Ochilganda
   **«soʻm»** tanlangan (0023, 0026).
6. **Sana** — bitta qator: chapda «Sana», oʻngda tugma, ichida **«Bugun»** (0034).

Pastda yopishib turgan panelda asosiy tugma: **«Saqlash»**.

**Bu formada kurs maydoni yoʻq** — dollar tanlanganda ham. Sabab: qarz oʻz valyutasida
yuritiladi (10-band), hisoblar valyutaga boʻlinmaydi (PRD 6), demak qarz berilganda hech narsa
aylantirilmaydi. Kurs faqat **boshqa valyutadagi toʻlovda** kerak (10-band) va «oxirgi kurs»
manbalari ham faqat yozuv va toʻlov (0044; spec 15b) — qarzning oʻzi kurs manbai emas.

**Izoh maydoni ham yoʻq** — specda qarzda izoh yoʻq.

### Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| Summa maydoni | Raqam klaviaturasi; terish paytida mingliklar ajratiladi; soʻmda kasr belgisi tushmaydi, dollarda ikki kasrgacha (0033) |
| «Berdim» / «Oldim» | Segment boʻlagi boʻyaladi. Boshqa hech narsa oʻzgarmaydi |
| «Karta» / «Naqd» | Chip almashadi |
| «soʻm» / «dollar» | Summa maydonining oʻngidagi soʻz `soʻm` ↔ `$` ga almashadi. Kurs soʻralmaydi |
| Sana tugmasi | Qurilmaning sana tanlagichi ochiladi; ertangi va undan keyingi kunlar oʻchiq (0034). Tanlangach tugmada «Bugun», «Kecha» yoki `14-avgust` turadi |
| **«Saqlash»** | Hamma tekshiruv bir yoʻla bajariladi. Xato boʻlsa — pastdagi jadval. Xato boʻlmasa: qarz saqlanadi, forma yopiladi, kontakt sahifasi ochiq qarzlar tepasida yangi kartochka bilan koʻrinadi; netto va hisob qoldigʻi darhol yangilanadi («Berdim» — hisobdan chiqadi, «Oldim» — hisobga tushadi, 0017/0035). Alohida «saqlandi» xabari yoʻq |
| `×` | Forma darhol yopiladi, kiritilgani saqlanmaydi, tasdiq soʻralmaydi |

### Eng qisqa yoʻl — bir qarz necha qadamda tugaydi

Kundalik holat: soʻmda qarz berdim, kartadan, bugun.

1. Kontakt sahifasidagi **«＋ Yangi qarz»** — forma ochiladi, kursor summada.
2. Summani teradi.
3. **«Berdim»** ni bosadi.
4. **«Saqlash»** ni bosadi.

**Forma ochilgandan keyin 3 ta harakat, shundan 2 tasi bitta bosish.** Hisob, valyuta va sana
tegilmaydi. Dollardagi qarz uchun bitta harakat qoʻshiladi — **«dollar»** chipi; kurs
soʻralmagani uchun terish qoʻshilmaydi. Jami 4 ta harakat.

Kontakt sahifasigacha boʻlgan yoʻl: navigatsiya panelidan **«Qarz daftari»** → kontakt
qatori = 2 bosish (0067).

### Xato holatlari

Tekshirish **«Saqlash»** bosilganda bajariladi — terish paytida xato koʻrsatilmaydi. Bir necha
xato boʻlsa hammasi bir vaqtda koʻrinadi, ekran birinchi xatoli maydonga suriladi. Maydon
tuzatilishi bilan oʻsha xato yoʻqoladi.

| Holat | Odam nimani koʻradi |
|---|---|
| Summa boʻsh | Summa maydoni qizil chegara oladi, tagida: **«Summani kiriting.»** |
| Nol summa (`0` yoki `0,00`) | Summa maydoni ostida: **«Summa noldan katta boʻlsin.»** (0033, 20-mezon) |
| Yoʻnalish tanlanmagan | Segment ostida: **«Berdim yoki oldim ekanini tanlang.»** (0062) |
| Summa texnik chegaradan oshsa | Summa maydoni ostida: **«Summa juda katta.»** Saqlash toʻxtaydi (13a-band; taʼrifi `prds/kirim-chiqim.md` 1a1) |
| Manfiy son | Hech narsa koʻrmaydi: `−` maydonga tushmaydi, yopishtirilgan matndan ham olib tashlanadi (0033) |
| Soʻmda kasr terilsa | `,` va `.` maydonga tushmaydi; hech qanday matn chiqmaydi (19-mezon) |
| Soʻmda kasrli matn yopishtirilsa yoki dollarda kasr terib «soʻm» ga oʻtilsa | Kasr qismi kesiladi (yaxlitlanmaydi) va maydon ostida yordam matni: **«Soʻmda tiyin yoʻq — kasr qismi olib tashlandi.»** Xato emas: maydon qizil boʻlmaydi, saqlash toʻxtamaydi |
| Kelajak sanasi | Tanlagichda ertangi va undan keyingi kunlar oʻchiq (0034). Qurilma baribir kelajak sanasini qaytarsa, sana qatori ostida: **«Sana bugundan keyin boʻlmaydi.»** (21-mezon) |
| Summaga harf yoki belgi terilsa | Raqam boʻlmagan belgi maydonga tushmaydi; xato matni chiqmaydi |

Matnlar `design/kirim-chiqim.md` dagi bilan **aynan bir xil** — bitta holat bitta matn bilan
aytiladi, forma qaysi ekranda boʻlishidan qatʼi nazar.

### Tahrirlash rejimi (0059)

Kirish yoʻli bitta: kontakt sahifasidagi qarz kartochkasining boshi. Xuddi shu forma, quyidagi
farqlar bilan:

- Sarlavha: **«Qarzni tahrirlash»**.
- Hamma maydon qarzning joriy qiymati bilan toʻldirilgan ochiladi: summa, yoʻnalish (segmentda
  bittasi tanlangan), hisob, valyuta, sana.
- **Kontakt qatori oʻzgarmaydi** — qarz boshqa kontaktga koʻchirilmaydi (specda yoʻq).
- Summa, yoʻnalish, hisob va sana **erkin oʻzgaradi** (0059). Valyuta esa faqat **toʻlovsiz**
  qarzda oʻzgaradi (pastdagi bandga qarang).
- Formada **«Oʻchirish» tugmasi yoʻq** — oʻchirish kartochkadan bajariladi (2-boʻlim). Bu yozuv
  formasidagi tartibning aynan oʻzi (0032).
- Yopilgan qarz ham tahrirlanadi: forma bir xil, faqat unda toʻlovlar borligi uchun valyuta
  odatda muzlatilgan boʻladi.
- Pastdagi tugma yana **«Saqlash»**. Saqlangach forma yopiladi, kontakt sahifasi darhol
  yangilanadi: qoldiq, netto va hisob qoldiqlari qayta hisoblanadi — yoʻnalish yoki hisob
  oʻzgargan boʻlsa eski pul harakati butunlay bekor qilinib oʻrniga yangisi qoʻyiladi
  (0017, 0035). Alohida «saqlandi» xabari yoʻq.
- `yaratilgan` maydoni tahrirlashda oʻzgarmaydi va koʻrsatilmaydi (0047). Sana oʻzgartirilsa
  kartochka roʻyxatda oʻz yangi oʻrniga suriladi.
- Summaning oʻzgarishi qarzni yopiq yoki ochiq qilib qoʻyishi mumkin: yopiqlik har safar
  qoldiqdan hisoblanadi (0052, 8b), shuning uchun kartochka saqlangandan keyin «Yopilgan
  qarzlar» boʻlimiga tushishi yoki oʻsha yerdan ochiqlar orasiga chiqishi mumkin.

**Toʻlovi bor qarzda valyuta muzlatilgan** (0059):

- Ikkala chip ham koʻrinadi. Qarzning oʻz valyutasi chipi **tanlangan koʻrinishida** qoladi
  (foni `harakat-fon`, 1 px `harakat`, matni `harakat`), ikkinchi chip **oʻchiq** holatda
  (matni `matn-oʻchiq`, foni `fon`). Ikkalasi ham bosilmaydi: bosilganda hech narsa oʻzgarmaydi
  va qizil xato chiqmaydi.
- Chiplar ostida yordam qatori (`mayda`, `matn-ikkinchi`): **«Toʻlovi bor qarzda valyuta
  oʻzgarmaydi — avval toʻlovlarni oʻchiring.»** Qator qanday qilib yoʻlni ochishni oʻzi aytadi,
  shuning uchun oʻchiq chip «sababsiz» qolmaydi.
- Nega muzlatilgan: toʻlovlar qarz valyutasida hisoblab ayirilgan, boshqa valyutadagilari esa
  oʻz toʻlov kursida aylantirilgan (10-band). Valyuta almashtirilsa oʻsha aylantirishlar
  maʼnosini yoʻqotardi va qoldiq jimgina notoʻgʻri boʻlib qolardi — daftardagi eng yomon xato.
- Toʻlovsiz qarzda ikkala chip ham odatdagidek ishlaydi va yordam qatori chizilmaydi.

Xato holatlari — 3-boʻlimdagi jadvalning hammasi, matnlari bilan. Bitta qoʻshimcha qator:

| Holat | Odam nimani koʻradi |
|---|---|
| Yangi summa qarzning toʻlovlaridan kichik va farq chegaradan oshadi (dollarda > 1 sent, soʻmda > 100 soʻm) | Summa maydoni qizil chegara oladi, tagida: **«Qarz summasi toʻlovlardan kichik — toʻlangan: 300 000 soʻm.»** Saqlash toʻxtaydi |

Bu jadvaldagi yagona oʻzgaruvchi raqamli matn: toʻlangan summa qarzning oʻz valyutasida
koʻrsatiladi (boshqa valyutadagi toʻlovlar oʻz kursida aylantirilgan holda). Raqamsiz matn
odamni yopiq koʻchada qoldirardi — u qaysi summadan pastga tushmasligini formadan koʻrmaydi.

Farq **chegara ichida** boʻlsa (0052) xato yoʻq: qarz saqlanadi va kartochka «Yopilgan»
koʻrinadi. Bu 0061 dagi «chegara ichida oshgan toʻlov qabul qilinadi va qarz yopiladi»
qoidasining aynan oʻzi, faqat teskari tomondan qaralgani.

---

## 4. «Toʻlov» formasi

Kirish yoʻli bitta: qarz kartochkasidagi **«＋ Toʻlov»**. Qarz oldindan maʼlum, shuning uchun
formada qarz ham, kontakt ham, yoʻnalish ham tanlanmaydi.

### Nima koʻrinadi

Yuqorida panel: chapda `×`, oʻrtada sarlavha **«Toʻlov»**.

Ostida, yuqoridan pastga:

1. **Qarz qatori** — ikki qator matn (`kichik`, `matn-ikkinchi`), maydon emas:
   - **«Kontakt: Akmal»**
   - **«Qarz qoldigʻi: 700 000 soʻm»** — qarzning oʻz valyutasida, ishorasiz.
2. **Summa** — katta maydon (56 px), kursor shu yerda. Oʻng chekkasida valyuta soʻzi.
3. **Valyuta** — ikki chip: **«soʻm»** | **«dollar»**. Ochilganda **qarzning oʻz valyutasi**
   tanlangan. Sabab: toʻlov koʻpincha qarz valyutasida keladi va oʻshanda kurs umuman
   soʻralmaydi (12-mezon) — eng qisqa yoʻl shu.
4. **Kurs** — faqat tanlangan valyuta qarz valyutasidan **boshqa** boʻlganda koʻrinadi
   (pastki bandga qarang).
5. **Hisob** — ikki chip: **«Karta»** | **«Naqd»**, ochilganda **«Karta»** (0035).
6. **Sana** — chapda «Sana», oʻngda tugma, ichida **«Bugun»** (0034).

Pastda yopishib turgan panelda asosiy tugma: **«Saqlash»**.

Toʻlovning pul yoʻnalishi formada tanlanmaydi — u qarzdan chiqadi: «Berdim» qarziga kelgan
toʻlov tanlangan hisobga **tushadi** (15-mezon), «Oldim» qarziga toʻlov tanlangan hisobdan
**chiqadi** (0017, 0035).

**Hisob chiplari ostida bir qatorlik yordam matni turadi** (`mayda`, `matn-ikkinchi`) — 0061
bilan tasdiqlangan:

- «Berdim» qarzida: **«Pul kartaga tushadi.»**
- «Oldim» qarzida: **«Pul kartadan chiqadi.»**

«Naqd» chipi tanlansa matndagi soʻz oʻzgaradi: **«Pul naqdga tushadi.»** / **«Pul naqddan
chiqadi.»** Bu xato emas, yordam matni: maydon qizil boʻlmaydi, saqlashga toʻsqinlik
qilmaydi. Foydasi — toʻlovning pul yoʻnalishi formada tanlanmaydi, shuning uchun odam qaysi
hisob qaysi tomonga harakatlanishini saqlashdan **oldin** koʻradi.

### Boshqa valyutada toʻlov (10, 10a-bandlar)

- Valyuta chipi qarz valyutasidan boshqasiga qoʻyilganda **Kurs** maydoni ochiladi (150 ms
  soʻnish bilan).
- Yorligʻi: **«Kurs — 1 dollar necha soʻm»** (0023).
- Maydon boʻsh ochiladi, ichida `12 500` namuna sifatida (`matn-oʻchiq`). Oldindan
  toʻldirilmaydi va shu holatda majburiy.
- Faqat butun son qabul qiladi, mingliklar boʻsh joy bilan ajratiladi (0042).
- Qarz valyutasiga qaytilsa kurs maydoni yopiladi va kiritilgani unutiladi.
- Aylantirish eng yaqin butun birlikka yaxlitlanadi (0042): 12 500 kurs bilan 100 001 soʻm →
  `8,00 $`, 100 100 soʻm → `8,01 $`. Yaxlitlash natijasi qarz qoldigʻidan ayiriladi.

**Kurs maydoni ostida yordam matni turadi** (`mayda`, `matn-ikkinchi`) — 0061 bilan
tasdiqlangan: **«Qarzdan ayiriladi: 50,00 $»**. Raqam summa va kurs toʻldirilgan zahoti
hisoblanadi va har belgidan keyin yangilanadi; ikkovidan biri boʻsh boʻlsa qator umuman
chizilmaydi. Foydasi — 0042 dagi yaxlitlash saqlashdan **oldin** koʻrinadi va «nega 100 001
soʻm 8,00 $ boʻldi» degan savol tugʻilmaydi.

Shu qator toʻlov qoldiqdan katta ekanini ham oldindan koʻrsatib turadi: odam ayiriladigan
raqamni ekranning tepasidagi **«Qarz qoldigʻi»** bilan solishtiradi. Xato baribir «Saqlash»
bosilganda aytiladi (pastdagi jadval) — terish paytida qizil rang chiqmaydi.

### Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| Summa maydoni | Raqam klaviaturasi; terish qoidalari 3-boʻlimdagidek |
| «soʻm» / «dollar» | Summa maydonining oʻngidagi soʻz almashadi; qarz valyutasidan boshqasi tanlansa kurs maydoni ochiladi, qaytilsa yopiladi |
| Kurs maydoni | Raqam klaviaturasi; kasr belgisi tushmaydi (0042) |
| «Karta» / «Naqd» | Chip almashadi |
| Sana tugmasi | Sana tanlagichi; kelajak kunlar oʻchiq (0034) |
| **«Saqlash»** | Hamma tekshiruv bir yoʻla. Xato boʻlsa — pastdagi jadval. Xato boʻlmasa: toʻlov saqlanadi, forma yopiladi, kontakt sahifasida toʻlov qarz kartochkasi ichida eng tepada koʻrinadi, qarz qoldigʻi va netto darhol qayta hisoblanadi, hisob qoldigʻi oʻzgaradi. Qoldiq chegaraga tushsa (≤ 1 sent / ≤ 100 soʻm) kartochka «Yopilgan qarzlar» boʻlimiga oʻtadi va netto qatoridan chiqadi (0052, 0056) |
| `×` | Forma yopiladi, kiritilgani saqlanmaydi |

### Eng qisqa yoʻl — bir toʻlov necha qadamda tugaydi

Kundalik holat: qarz valyutasida toʻlov, kartaga, bugun.

1. Qarz kartochkasidagi **«＋ Toʻlov»** — forma ochiladi, kursor summada.
2. Summani teradi.
3. **«Saqlash»** ni bosadi.

**Forma ochilgandan keyin 2 ta harakat, shundan 1 tasi bitta bosish.** Valyuta qarznikidan
olingan, hisob va sana tayyor. Boshqa valyutadagi toʻlovda ikkita harakat qoʻshiladi —
valyuta chipi va kursni terish; jami 4 ta harakat.

Summa maydoni qoldiq bilan oldindan toʻldirilmaydi va «hammasini toʻladim» tugmasi
qoʻyilmaydi: bir bosish tejash uchun notoʻgʻri summani jimgina saqlash xavfi qolardi.

### Xato holatlari

3-boʻlimdagi jadvalning hammasi bu yerda ham amal qiladi (summa boʻsh, nol summa, juda katta
summa, manfiy son, soʻmda kasr, kelajak sanasi, harf/belgi) — matnlari bilan birga. Qoʻshimcha
qatorlar:

| Holat | Odam nimani koʻradi |
|---|---|
| Boshqa valyuta tanlangan, kurs boʻsh | Kurs maydoni qizil chegara oladi, tagida: **«Kursni kiriting — 1 dollar necha soʻm.»** |
| Kurs `0` | Kurs maydoni qizil chegara oladi, tagida: **«Kurs notoʻgʻri»**. Toʻlov saqlanmaydi, qarz qoldigʻi oʻzgarmaydi (0049, 10c-mezon) |
| Kursda kasr | Kasr belgisi maydonga tushmaydi. Kasrli matn yopishtirilsa kasr qismi kesiladi (`12 500,25` → `12 500`) va maydon ostida yordam matni: **«Kurs butun soʻmda — kasr qismi olib tashlandi.»** Xato emas (0042, 10b-mezon) |
| Aylantirish natijasi texnik chegaradan oshsa | Summa maydoni ostida: **«Summa juda katta.»** (13a-band) |

Yoʻnalish tanlanmagani xatosi bu formada **yoʻq** — yoʻnalish qarzdan olinadi.

### Toʻlov qoldiqqa nisbatan tekshiriladi (0061)

Tekshiruv **aylantirilgandan keyingi** qiymat boʻyicha bajariladi: boshqa valyutadagi toʻlov
avval toʻlov kursida qarz valyutasiga oʻtkaziladi va eng yaqin butun birlikka yaxlitlanadi
(0042), keyin qoldiq bilan solishtiriladi. Chegara — 0052 dagi oʻsha chegara: dollarda 1 sent,
soʻmda 100 soʻm.

| Holat | Odam nimani koʻradi |
|---|---|
| Toʻlov qoldiqdan chegaradan **koʻp** oshadi (dollarda 1 sentdan, soʻmda 100 soʻmdan ortiq) | Summa maydoni qizil chegara oladi, tagida: **«Toʻlov qarz qoldigʻidan katta.»** Saqlash toʻxtaydi, qarz qoldigʻi va hisob qoldigʻi oʻzgarmaydi |
| Toʻlov qoldiqdan oshadi, lekin oshiq qismi **chegara ichida** (≤ 1 sent / ≤ 100 soʻm) | Xato yoʻq: toʻlov saqlanadi va qarz yopiladi — kartochka «Yopilgan qarzlar» boʻlimiga oʻtadi, netto qatoridan chiqadi (0052, 0056) |
| Aylantirilgan qiymat **nol** boʻlsa (masalan 1 soʻm, kurs 12 500) | Summa maydoni qizil chegara oladi, tagida: **«Toʻlov juda kichik — qarz valyutasida nolga aylanadi.»** Saqlash toʻxtaydi |

Uch qoidaning bir ildizi bor: **qarz qoldigʻi manfiy boʻlib qolmasin va qarzga tegmaydigan
toʻlov saqlanmasin.** Chegara ichida oshgan toʻlov qabul qilinadi, chunki u aynan 0042 dagi
yaxlitlash «dumi» bilan tugʻiladi va odam uni boshqa yoʻl bilan yopa olmasdi.

Chegara ichida oshiq toʻlov saqlanganda hisob qoldigʻiga **toʻliq** summa tushadi — qoldiq
haqiqiy pul harakatidan chiqadi va hech qanday chegara bilan tuzatilmaydi (0056, 7a2). Qarz
kartochkasida esa raqam emas, **«Yopilgan»** soʻzi turadi, shuning uchun manfiy mikro-qoldiq
hech qayerda koʻrinmaydi.

**Yopilgan qarzga toʻlov qoʻshilmaydi** (0061): kartochkada **«＋ Toʻlov»** havolasi yoʻq,
demak bu formaga kirish yoʻlining oʻzi yopiq. Toʻlovni oʻchirish qarzni yana ochsa (2-boʻlim),
havola oʻz-oʻzidan qaytadi.

---

## 5. Oʻchirish va «qaytarish» paneli — 7 soniya

`design/kirim-chiqim.md` dagi panel qoidalari **oʻzgarishsiz** amal qiladi (0029, 0048). Bu
yerda faqat qaysi obyektga tegishi va matni yoziladi.

- Panel ekranning pastida: foni `qora-panel`, matni oq, yon chekkalardan 16 px, pastdan 16 px
  (qurilmaning xavfsiz zonasi hisobga olinadi), radiusi 10 px. Oʻngda tugma **«QAYTARISH»**
  (oq, 600, balandligi 44 px).
- **Muddat — 7 soniya**, panel koʻringan lahzadan boshlanadi; toʻxtatib turish (pauza) yoʻq
  (0048, 9a-band).
- **Muddat tugasa** panel yoʻqoladi va oʻchirish yakuniy boʻladi.
- **Bir vaqtda bitta panel turadi.** Panel turganida ikkinchi narsa oʻchirilsa, birinchisi
  oʻsha zahoti yakuniy boʻladi va panel yangisi uchun qaytadan boshlanadi.
- Ekrandan chiqib ketilsa yoki ilova yopilsa panel yoʻqoladi va oʻchirish yakuniy boʻladi.
- Tasdiq oynasi hech qayerda yoʻq (0029).

| Nima oʻchirildi | Paneldagi matn | «QAYTARISH» bosilsa |
|---|---|---|
| Qarz toʻlovi | **«Toʻlov oʻchirildi»** | Toʻlov oʻz qarzida joyiga qaytadi (sana va `yaratilgan` boʻyicha aynan oʻsha oʻringa — 0047), qarz qoldigʻi, netto va hisob qoldigʻi tiklanadi (9-mezon) |
| Qarz (0059) | **«Qarz oʻchirildi»** | Qarz oʻz oʻrniga qaytadi va **hamma toʻlovi ham birga qaytadi**; qoldiq, netto va hisob qoldiqlari tiklanadi |
| Kontakt | **«Kontakt oʻchirildi»** | Kontakt roʻyxatga qaytadi, uning hamma qarzi va toʻlovi ham qaytadi (18-mezon) |

Kontakt oʻchirilganda panel «Qarz daftari» roʻyxatida koʻrinadi (odam oʻsha ekranga
qaytariladi); qarz va toʻlov oʻchirilganda kontakt sahifasida koʻrinadi.

Uchala matn ham bir xil qolipda: **«<Nima> oʻchirildi»** — yozuvlar ekranidagi «Yozuv
oʻchirildi» bilan bitta oila (`design/kirim-chiqim.md`). Nechta toʻlov birga ketgani panelda
sanalmaydi: panel qisqa boʻlishi kerak, «QAYTARISH» esa hammasini birdan qaytaradi.

Panel pastdagi navigatsiya panelining ustida turadi — oʻlchamlar `design/uslub.md` dagi
«Pastdagi panellar tartibi» boʻlimida (0067).

---

## 6. Yopilgan qarz va netto — koʻrinishning qatʼiy qoidasi

Bu qismning eng oson chalkashadigan joyi shu, shuning uchun bitta jadvalda.

| Savol | Javob | Manba |
|---|---|---|
| Qarz qachon «yopilgan» koʻrinadi? | Qoldiq oʻz valyutasida ≤ 1 sent yoki ≤ 100 soʻm | 0052, 8a |
| Yopiqlik saqlanadimi? | Yoʻq — har safar qoldiqdan hisoblanadi; ekranda holat belgisi qoʻlda oʻzgartirilmaydi | 0016, 0052, 8b |
| Yopilgan qarzning mikro-qoldigʻi koʻrinadimi? | Yoʻq — kartochkada raqam oʻrnida **«Yopilgan»** turadi | 0056, 7a1 |
| Netto nimadan yigʻiladi? | Faqat **ochiq** qarzlardan, valyutalar alohida | 0037, 0056, 7a |
| Hamma qarzi yopilgan kontaktda netto? | Qator umuman chiqmaydi; oʻrnida «Ochiq qarz yoʻq.» | 0056, 7a1 |
| Netto qarz yopilishiga taʼsir qiladimi? | Yoʻq — netto faqat koʻrsatish uchun; yopilish har qarzning oʻz qoldigʻidan | 0037, 7b |
| Chegara naqd va karta qoldigʻiga tegadimi? | Yoʻq — hisob qoldigʻi haqiqiy pul harakatidan chiqadi va tuzatilmaydi | 0056, 7a2, 15h-mezon |
| Chegara ichida yopilgan qarz kontaktni oʻchirishga toʻsqinlik qiladimi? | Yoʻq | 0052, 0030, 6c-mezon |
| Yopilgan qarzga toʻlov qoʻshiladimi? | Yoʻq — kartochkada «＋ Toʻlov» havolasi boʻlmaydi | 0061 |
| Toʻlov qoldiqdan katta boʻlsa? | Chegaradan koʻp oshsa — rad; chegara ichida oshsa — qabul va qarz yopiladi | 0061, 0052 |
| Yopilgan qarz tahrirlanadimi? | Ha — forma bir xil; toʻlovi bor qarzda faqat valyuta muzlatilgan | 0059 |
| Qarz oʻchirilsa toʻlovlari nima boʻladi? | Birga oʻchadi va «QAYTARISH» bilan birga qaytadi | 0059 |

---

## 7. Nima qoʻyilmaydi

- Qarzlar boʻyicha qidiruv, filtr, saralash tugmasi va davr tanlagichi (0002).
- Qarz muddati, muddat rangi, «kechikkan» belgisi, eslatma (0016, 0003).
- Kontaktni telefon kitobidan olish; raqamga bosib qoʻngʻiroq qilish yoki SMS yuborish (0015,
  0031).
- Kontaktni yashirish (0030 oʻchirishni hal qilgan, yashirish varianti rad etilgan).
- Qarz kartochkasida «yopish» tugmasi — yopiqlik hisoblanadi, qoʻlda qoʻyilmaydi (0052).
- «≈ jami soʻmda» qatori va valyutalarni qoʻshib bitta raqam qilish (0038, 7a).
- Qarz qoldigʻini bosh sahifada alohida raqam sifatida koʻrsatish (PRD 28, 0020).
- Qarzni kategoriyaga bogʻlash; qarzga izoh maydoni (0017; specda yoʻq).
- Toʻlov summasini qoldiq bilan oldindan toʻldirish va «hammasini toʻladim» tugmasi.
- Grafik, diagramma, avatar, rang bilan belgilangan kontakt (uslub).
- Toʻlovni tahrirlash — toʻlov faqat oʻchiriladi va qaytadan yoziladi (0059 qarz va kontakt
  haqida; spec 9-band toʻlov uchun faqat oʻchirishni sanaydi).
- Qarzni boshqa kontaktga koʻchirish: tahrirlashda kontakt qatori oʻzgarmaydi (0059).
- Qarzni oʻchirishda «toʻlovlari ham oʻchsinmi?» degan tanlov: toʻlovlar har doim birga
  ketadi (0059).
- Kontaktni tahrirlashda ism yoki telefondan boshqa maydon (0031, 0060).

---

## 8. Savollar — hammasi yopilgan

Bu tavsif yozilganda toʻqqizta savol ochilgan edi. Hammasi **0058 vakolati** bilan hal qilindi
(qarorlar 0059–0063) — quyida qaysi savol qayerga bogʻlangani va matn qaysi boʻlimda turgani.
**Ochiq savol qolmadi; TAKLIF belgisi bu faylda endi yoʻq.**

| # | Savol | Javob | Qaror | Qayerda yozilgan |
|---|---|---|---|---|
| 1 | Qarzning oʻzi oʻchiriladimi, tahrirlanadimi? | Ha, ikkalasi ham | 0059 | 2-boʻlim «Qarzni oʻchirish», 3-boʻlim «Tahrirlash rejimi» |
| 2 | Kontakt tahrirlanadimi? | Ha — ism va telefon | 0060 | 2-boʻlim «Kontaktni tahrirlash» |
| 3 | Toʻlov qarz qoldigʻidan katta boʻlsa? | Chegaradan koʻp oshsa rad, chegara ichida qabul | 0061, 0052 | 4-boʻlim «Toʻlov qoldiqqa nisbatan tekshiriladi» |
| 4 | Aylantirilgandan keyin nolga aylangan toʻlov? | Rad etiladi | 0061 | 4-boʻlim, oʻsha jadval |
| 5 | Yopilgan qarzga toʻlov qoʻshiladimi? | Yoʻq — «＋ Toʻlov» havolasi boʻlmaydi | 0061 | 0-boʻlim va 4-boʻlim oxiri |
| 6 | Qarz formasida kurs maydoni boʻladimi? | Yoʻq — qarz kurs manbai emas | 0023, 0044 (spec 10, 15b) | 3-boʻlim, «Bu formada kurs maydoni yoʻq» |
| 7 | «Berdim»/«Oldim» uchun standart qiymat? | Yoʻq — har safar tanlanadi | 0062 | 3-boʻlim, 3-band va xatolar jadvali |
| 8 | Qarz daftariga qayerdan kiriladi? | Navigatsiya panelining «Qarz daftari» boʻlimidan | 0063 → 0067 | Fayl boshidagi «Navigatsiya», `design/uslub.md` |
| 9 | Toʻlov formasidagi ikkita yordam qatori? | Ikkalasi ham qoladi | 0061 | 4-boʻlim |

Uchta izoh, keyingi agent uchun:

- **6-savol qaror bilan emas, mavjud manbalar bilan yopildi:** spec 10-bandi aylantirishni faqat
  toʻlovga bogʻlaydi, 15b va 0044 esa «oxirgi kurs» manbai sifatida faqat yozuv va toʻlovni
  sanaydi. Yangi qaror kerak emas edi — dollardagi qarzning oʻzi kurs manbai emas.
- **0059 ochgan yangi holat:** tahrirlashda summa toʻlovlardan kichik qilib qoʻyilishi mumkin.
  U 0061 ning teskari tomoni sifatida yopildi (chegara ichidagi farq qabul, undan koʻpi rad) —
  matni 3-boʻlim oxiridagi jadvalda.
- **Toʻlovning oʻzi tahrirlanmaydi:** 0059 qarz va kontaktga tegishli, spec 9-bandi esa toʻlov
  uchun faqat oʻchirishni sanaydi. Notoʻgʻri toʻlov oʻchiriladi va qaytadan yoziladi (7-boʻlim).
