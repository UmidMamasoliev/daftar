# Uslub — rang va shakl qoidalari

Sana: 2026-08-17. Asos: `prds/daftar-prd.md`, qarorlar 0003, 0009, 0011, 0017, 0023, 0026, 0033,
0034, 0038, 0042, 0044, 0063.

Bu fayl butun daftar uchun bitta joyda turadi: har ekranda rang, oʻlcham va boʻshliq qaytadan
oʻylanmaydi. Ekran tavsiflari (`design/kirim-chiqim.md` va keyingilari) shu yerdagi nomlarga
tayanadi.

## Asos

- **Mobil-birinchi.** Bu telefonda har kuni ochiladigan PWA. Hamma ekran bitta ustun; eng tor
  qurilma — 320 px. Keng ekranda ustun markazda turadi, eni koʻpi bilan 560 px.
- **Barmoq oʻlchami.** Bosiladigan har narsa kamida 44 × 44 px.
- **Shrift — qurilmaniki.** Tashqi shrift fayli yuklanmaydi: ilova oflayn ishlaydi (0003) va
  birinchi ochilish sekinlashmasin.
  `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- **Ikonka kutubxonasi yoʻq.** Belgilar oʻrniga matn ishlatiladi; faqat ikkita belgi bor:
  `＋` (qoʻshish) va `×` (yopish).
- **Bitta mavzu.** Yorugʻ fon. Tungi rejim va mavzu tanlash v1 da qurilmaydi (specda yoʻq).
- **Animatsiya kam.** Faqat 150 ms rang/soʻnish oʻtishi. Ekran almashishida sirpanish yoʻq —
  daftar tez ochilsin.
- **Til.** Ekrandagi hamma matn oʻzbekcha, lotin yozuvida (0009). Matnlar ekran tavsiflarida
  aynan yozilgan — frontend oʻsha yerdan koʻchiradi.

## Ranglar

| Nom | Qiymat | Qayerda ishlatiladi |
|---|---|---|
| `fon` | `#F4F5F7` | ekranning umumiy foni |
| `yuza` | `#FFFFFF` | kartochka, maydon, roʻyxat qatori, yuqori panel |
| `chegara` | `#E3E5E8` | maydon va kartochka chegarasi, qatorlar orasidagi chiziq |
| `matn` | `#1A1D21` | asosiy matn va raqamlar |
| `matn-ikkinchi` | `#6B7280` | izoh, hisob nomi, sana sarlavhasi, yordam matni |
| `matn-oʻchiq` | `#9CA3AF` | yashirilgan kategoriya, boʻsh holat matni |
| `kirim` | `#15803D` | kirim summasi va «Kirim» tanlangan segment |
| `chiqim` | `#B42318` | chiqim summasi, «Chiqim» tanlangan segment, xato |
| `harakat` | `#1D4ED8` | asosiy tugma foni, fokus halqasi, matn-havola |
| `harakat-fon` | `#EFF4FF` | tanlangan chip foni |
| `qora-panel` | `#1A1D21` | «qaytarish» pastki paneli foni |

### PWA va brauzer ranglari

Ilova brauzer panelini va ochilish ekranini ham boʻyaydi. Ikkalasi uchun bittadan qiymat
belgilanadi — qiymat shu yerda turadi, kodda ikkinchi manba boʻlmaydi:

| Nom | Qiymat | Qayerda |
|---|---|---|
| `theme-color` | `#FFFFFF` | brauzer paneli / holat qatori rangi. Manifest faylida ham, sahifadagi `<meta name="theme-color">` da ham **aynan shu bitta qiymat** turadi |
| `background_color` | `#F4F5F7` | manifestdagi ochilish (splash) ekrani foni |

Nega `theme-color` — oq: brauzer panelining ostidagi birinchi element — ilovaning oq yuqori
paneli (`yuza`). Oq qoʻyilganda ular orasida chok koʻrinmaydi va ekran bitta boʻlak boʻlib
turadi. Ochilish ekrani esa hali panel koʻrinmagan payt chiqadi, shuning uchun u ekranning
umumiy foni (`fon`, `#F4F5F7`) bilan boʻyaladi — ilova ochilganda rang sakramaydi.

Boshqa rang qoʻshilmaydi. Soya faqat ikki joyda: pastda turgan «Saqlash» paneli va «qaytarish»
paneli — `0 -1px 0 rgba(0,0,0,.06)` va `0 2px 8px rgba(0,0,0,.24)`. Kartochkalarda soya yoʻq,
chegara yetadi.

### Kirim va chiqim qanday ajratiladi

Ajratma **uch belgidan** iborat, faqat rangga tayanilmaydi (rang koʻrmaydigan odam ham
ajratsin):

1. **Ishora:** kirim `+`, chiqim `−` — summaning oldida turadi.
2. **Rang:** kirim `kirim`, chiqim `chiqim` — faqat summa raqamiga beriladi, qator foniga emas.
3. **Soʻz:** formadagi segmentda va tahrirlash sarlavhasida «Kirim» yoki «Chiqim» soʻzi turadi.

Manfiy son kiritilmaydi (0033) — `−` faqat koʻrsatishdagi ishora, kiritishdagi son emas.

`chiqim` rangi xato uchun ham ishlatiladi. Chalkashmasligi uchun qoida: **xato har doim matn
bilan keladi** (maydon tagidagi qator), summa esa har doim ishora bilan keladi. Qizil rang
yolgʻiz oʻzi hech qachon xabar tashimaydi.

### Qarz yoʻnalishi qanday ajratiladi

Qarz raqamlari ham xuddi shu uch belgi bilan koʻrsatiladi — yangi rang qoʻshilmaydi. Maʼnosi
bitta: **pul menga keladimi yoki mendan ketadimi**.

| Holat | Ishora va rang | Soʻz |
|---|---|---|
| Men qarz berdim — pul menga qaytadi | `+`, `kirim` | «olaman» (netto), «Berdim» (qarz va forma) |
| Men qarz oldim — pul mendan ketadi | `−`, `chiqim` | «beraman» (netto), «Oldim» (qarz va forma) |
| Netto aynan nol, lekin ochiq qarz bor | ishorasiz, `matn` | «hisob teng» |

Bitta istisno: **qarz toʻlovining summasi rang olmaydi** (`matn`) va oldida faqat `−` turadi.
U yerda `−` «qarz qoldigʻidan ayirildi» degani, pul chiqimi degani emas — «berdim» qarziga
kelgan toʻlov aslida pulni hisobga qoʻshadi. Toʻliq tavsif: `design/qarz-daftari.md`.

**Hisobotdagi qarz qatorlari boshqa savolga javob beradi** va shuning uchun ishorasi ham
boshqacha: u yerda `+` va `−` «bu davrda pul hisobga tushdimi yoki undan chiqdimi» degani
(0017). Yaʼni «Qarzga berildi» — `−` va `chiqim`, «Qarzdan qaytdi» — `+` va `kirim`; netto
qatoridagi ishora bilan chalkashtirmaslik uchun tavsif `design/oylik-hisobot.md` 5-boʻlimida.

## Matn oʻlchamlari

Asos 16 px. 13 px dan kichik matn yoʻq.

| Nom | Oʻlcham / qalinlik / qator balandligi | Qayerda |
|---|---|---|
| `raqam-katta` | 28 / 700 / 1.2 | qoldiq va yagona jami raqami (hisobot ekranida ishlatilmaydi — u yerda uchta jami yonma-yon turadi, sababi `design/oylik-hisobot.md` 1-boʻlim) |
| `sarlavha` | 20 / 600 / 1.3 | ekran sarlavhasi |
| `summa` | 17 / 600 / 1.2 | roʻyxat qatoridagi summa |
| `matn` | 16 / 400 / 1.4 | asosiy matn, maydon ichidagi matn, tugma matni |
| `matn-kuchli` | 16 / 600 / 1.4 | roʻyxat qatoridagi kategoriya nomi |
| `kichik` | 14 / 400 / 1.4 | izoh, hisob nomi, kun sarlavhasi |
| `mayda` | 13 / 400 / 1.4 | maydon yorligʻi, xato matni, yordam qatori |

Raqamlar `font-variant-numeric: tabular-nums` bilan — summalar ustunda tekis tursin.

## Shakl

| Element | Qoida |
|---|---|
| Burchak radiusi | maydon, tugma, kartochka — 10 px; chip — 999 px (toʻliq yumaloq) |
| Maydon | balandligi 48 px, foni `yuza`, 1 px `chegara`, ichki chekka 12 px |
| Summa maydoni | balandligi 56 px, matni `raqam-katta`, oʻngida valyuta soʻzi (`matn-ikkinchi`) |
| Asosiy tugma | balandligi 48 px, eni toʻliq, foni `harakat`, matni oq, 600 |
| Ikkinchi tugma | balandligi 48 px, foni `yuza`, 1 px `chegara`, matni `matn` |
| Xavfli tugma | matni va chegarasi `chiqim`, foni `yuza` |
| Matn-havola | matni `harakat`, foni yoʻq, balandligi 44 px |
| Segment (2 boʻlak) | bitta qatorda, eni teng, balandligi 48 px, 1 px `chegara`, ichki radius 8 px; tanlangan boʻlak foni — `kirim` yoki `chiqim`, matni oq |
| Chip | balandligi 40 px, ichki chekka 14 px; tanlanmagan: foni `yuza`, 1 px `chegara`; tanlangan: foni `harakat-fon`, 1 px `harakat`, matni `harakat` |
| Roʻyxat qatori | foni `yuza`, balandligi kamida 64 px, tagida 1 px `chegara` chiziq |
| Hisobot qatori | kartochka ichidagi bosilmaydigan qator: balandligi 40 px, chegara chizigʻi yoʻq, chapda matn, oʻngda son (`design/oylik-hisobot.md`) |
| Kun sarlavhasi | foni `fon`, matni `kichik` + `matn-ikkinchi`, ustidan yopishib turadi (sticky) |

## Holatlar

- **Fokus:** 2 px `harakat` halqa, elementdan 2 px narida. Klaviatura bilan yurgan odam qayerda
  turganini koʻrsin.
- **Bosilgan:** fon 8 % ga toʻqlashadi, oʻlcham oʻzgarmaydi.
- **Oʻchiq (bosilmaydi):** matni `matn-oʻchiq`, foni `fon`, kursor oʻzgarmaydi.
- **Xato:** maydon chegarasi 1 px oʻrniga 2 px `chiqim`; tagida `mayda` oʻlchamda `chiqim`
  rangli xato matni. Maydon tuzatilishi bilan xato yoʻqoladi.
- **Yordam matni (xato emas):** maydon ostida `mayda` oʻlchamda `matn-ikkinchi` rangli qator;
  maydonning chegarasi va rangi oʻzgarmaydi.

  Ikkalasining chegarasi bitta savol bilan ajratiladi: **saqlash toʻxtaydimi?**
  Toʻxtasa — qizil xato (odam nimadir qilishi kerak). Toʻxtamasa, yaʼni ilova qiymatni oʻzi
  toʻgʻrilagan boʻlsa — yordam matni (odam faqat nima boʻlganini bilib qoʻyadi). Shuning uchun
  «kasr qismi olib tashlandi» turdagi xabarlar — summa maydonida ham, kurs maydonida ham —
  yordam matni; boʻsh maydon, nol summa va nol kurs esa qizil xato.
- **Kutish holati yoʻq:** maʼlumot qurilmaning oʻzida (0004), yuklanish aylanasi qurilmaydi.

## Boʻshliqlar

Qadam — 4 px. Ishlatiladigan qiymatlar: 4, 8, 12, 16, 24, 32.

- Ekranning yon chekkasi: 16 px.
- Maydonlar orasi: 16 px.
- Bloklar orasi (masalan summa bloki bilan kategoriya bloki): 24 px.
- Yorliq bilan maydon orasi: 8 px; maydon bilan xato matni orasi: 4 px.
- Chiplar orasi: 8 px (qatorlar orasi ham 8 px).
- Roʻyxat qatorining ichki chekkasi: 12 px yuqori-past, 16 px yon.
- Pastda turgan panel balandligi 72 px; roʻyxat oxiriga shuncha boʻsh joy qoʻshiladi, oxirgi
  qator panel tagida qolmasin.

## Navigatsiya paneli — VAQTINCHALIK (0063)

**Bu boʻlim vaqtinchalik.** Dashboard 3.10 da qurilganda bosh sahifa oʻsha boʻladi va panel
qayta koʻriladi (0063). Shu belgi olib tashlanmaguncha frontend uni vaqtinchalik deb biladi:
ekran tavsiflarida «bosh sahifa» deyilgan joylar hozircha shu panel bilan almashtiriladi.

### Nima koʻrinadi

Ekranning eng pastida yopishib turgan panel, ichida teng enli boʻlaklar — faqat soʻz, ikonka
yoʻq (ikonka kutubxonasi yoʻq):

| Boʻlak | Qayerga olib boradi |
|---|---|
| **«Yozuv»** | «Yangi yozuv» formasi (`design/kirim-chiqim.md` 1-boʻlim) |
| **«Yozuvlar»** | «Yozuvlar» ekrani (oʻsha fayl, 2-boʻlim) |
| **«Qarz daftari»** | «Qarz daftari» — kontaktlar roʻyxati (`design/qarz-daftari.md` 1-boʻlim) |
| **«Hisobot»** | «Hisobot» ekrani (`design/oylik-hisobot.md`) — har ochilganda joriy oy bilan |
| **«Zaxira»** | «Zaxira» ekrani (`design/zaxira.md`) — eksport va import |

**Panel toʻldi: beshta boʻlak.** Boshqa boʻlak qoʻshilmaydi. Boʻlaklar toʻrttadan koʻp
boʻlgani uchun matn oʻlchami `mayda` (13 px) — pastdagi jadvalning «Matn» qatori.

### Oʻlchamlari va rangi

| Nima | Qiymat |
|---|---|
| Panel foni | `yuza` |
| Panel ustidagi chiziq | 1 px `chegara` |
| Panel balandligi | 56 px + qurilmaning pastki xavfsiz zonasi |
| Boʻlak | eni teng (panel eniga boʻlinadi), bosiladigan joyi butun boʻlak — kamida 44 px baland |
| Matn | `kichik` (14 px); boʻlak **toʻrttadan koʻp** boʻlganda `mayda` (13 px) |
| Matn sigʻmasa | Boʻlak matni ikki qatorga oʻraladi va markazda turadi (masalan «Qarz» / «daftari»). Qisqartma qoʻyilmaydi va `…` bilan kesilmaydi — boʻlim nomi har doim toʻliq oʻqiladi. Panel balandligi oʻzgarmaydi: ikki qator 13 px shu 56 px ichiga sigʻadi |
| **Faol boʻlim** | matni `harakat`, qalinligi 600 |
| Faol boʻlmagan boʻlim | matni `matn-ikkinchi`, qalinligi 400 |
| Bosilgan holat | fon 8 % ga toʻqlashadi (umumiy qoida), oʻlcham oʻzgarmaydi |
| Fokus | 2 px `harakat` halqa (umumiy qoida) |

Faol holat **faqat rang bilan** koʻrsatilmaydi: qalinlik ham oʻzgaradi — rang koʻrmaydigan odam
ham qaysi boʻlimda turganini bilsin (uslubning umumiy qoidasi).

### Qayerda koʻrinadi, qayerda yoʻq

- **Koʻrinadi:** «Yozuvlar», «Qarz daftari», «Kontakt» sahifasi, «Hisobot», «Zaxira».
  «Kontakt» da faol boʻlim — **«Qarz daftari»**. «Zaxira» ekranida import oqimi yarim
  qolgan boʻlsa ham panel joyida turadi va boshqa boʻlimga oʻtish oqimni bekor qiladi
  (`design/zaxira.md` 6-boʻlim).
- **Koʻrinmaydi:** `×` bilan ochiladigan forma ekranlarida («Yangi yozuv», «Yozuvni
  tahrirlash», «Yangi qarz», «Qarzni tahrirlash», «Toʻlov») va forma ichidan ochiladigan
  «Kategoriyalar» ekranida. U yerda pastda **«Saqlash»** yoki **«＋ Yangi kategoriya»** paneli
  turadi — ikkita panel ustma-ust qoʻyilmaydi, forma esa bitta ish uchun ochiladi va `×` bilan
  yopiladi.
- **Navigatsiya boʻlimining oʻz ekranida «‹ Orqaga» havolasi boʻlmaydi** — qaytadigan ekran
  yoʻq. Ichkariga kirilgan ekranlarda («Kontakt») «‹ Orqaga» oʻz joyida qoladi.

### Pastdagi panellar tartibi

Bir ekranda uchtagacha qatlam boʻlishi mumkin, pastdan yuqoriga:

1. Navigatsiya paneli (56 px + xavfsiz zona) — eng pastda.
2. Ekranning asosiy tugma paneli (72 px), masalan «＋ Yangi kontakt», «＋ Yangi qarz».
3. «Qaytarish» paneli — hammasining ustida, pastdagi eng yaqin paneldan 16 px yuqorida.

Roʻyxat oxiriga qoʻshiladigan boʻsh joy shu qatlamlar yigʻindisiga teng: navigatsiya paneli
bor ekranda 56 px + xavfsiz zona, asosiy tugma paneli ham boʻlsa yana 72 px. Oxirgi qator hech
qachon panel ostida qolmaydi.

### Ilova ochilganda va forma yopilganda

- Ilova ochilganda **«Yozuvlar»** ekrani koʻrinadi (dashboard qurilgach bosh sahifa uni
  almashtiradi).
- **«Yozuv»** boʻlagi bosilganda «Yangi yozuv» formasi ochiladi; `×` bosilsa ham, «Saqlash»
  bosilsa ham **«Yozuvlar»** ekrani ochiladi — odam saqlagan yozuvini darhol koʻradi.
  Boshqa joydan ochilgan forma esa oʻzi kelgan ekranga qaytadi (`design/kirim-chiqim.md`
  qoidasi oʻzgarmaydi).
- Boʻlaklar orasida oʻtishda animatsiya yoʻq (uslubning umumiy qoidasi) — ekran darhol
  almashadi.

## Son, sana va valyuta formati

- **Soʻm:** butun son, mingliklar orasi — boʻsh joy: `1 200 000 soʻm`. Tiyin yoʻq (0033).
- **Dollar:** ikki kasr, kasr belgisi — vergul, oxirida `$`: `12,50 $` (0033).
- **Minglik ajratish ikkala valyutada ham boʻladi** — koʻrsatishda ham, terishda ham. U faqat
  butun qismga tegadi: `1 234,56 $`, `1 200 000 soʻm`. Kasr qismi ajratilmaydi.
- **Ishora:** summadan oldin `+` yoki `−`, keyin boʻsh joysiz son: `−45 000 soʻm`, `+12,50 $`.
- **Kurs:** butun soʻm, mingliklar orasi boʻsh joy; toʻliq yozilishi `1 $ = 12 500 soʻm`
  (0023, 0042).
- **Taxminiy jami:** oldida `≈`, keyin boʻsh joy va odatdagi ishorali summa:
  `≈ +10 500 000 soʻm`. Tagida `mayda` oʻlchamda «taxminiy» soʻzi va ishlatilgan kurs, orasida
  ` · `: `taxminiy · 1 $ = 12 500 soʻm` (0023, 0044). Kurs koʻrsatilishining sababi — taxminiy
  raqamni odam faqat shunda tekshira oladi. Taxminiy summa rang olmaydi (`matn`).
- **Sana:** `16-avgust`. Boshqa yildagi sana yil bilan: `16-avgust 2025`. Bugungi va kechagi
  kun uchun soʻz ishlatiladi: «Bugun», «Kecha».
- **Oy nomlari:** yanvar, fevral, mart, aprel, may, iyun, iyul, avgust, sentabr, oktabr,
  noyabr, dekabr.
- **Vaqt koʻrsatilmaydi.** `yaratilgan` — texnik maydon, ekranda hech qachon chiqmaydi (0047).

### Maydonda terish paytidagi format

Son kiritiladigan hamma maydon (summa va kurs) bitta qoidaga boʻysunadi — format terish
paytida, har belgidan keyin qoʻyiladi:

- Minglik ajratish boʻsh joy bilan: `1 200 000`. Ajratish faqat **butun qismga** tegadi.
- Odam tergan kasr qismi oʻzgartirilmaydi: `12,` → `12,`, `12,50` → `12,50` (oxiridagi nol
  ham qoladi).
- Format qayta qoʻyilganda kursor raqamlarga nisbatan oʻz oʻrnida qoladi: kursordan chapdagi
  **raqamlar soni** saqlanadi, ajratgich boʻsh joylari sanalmaydi.
- Ajratgich boʻsh joyi — faqat koʻrinish. Saqlashda u olib tashlanadi va son 0008 boʻyicha
  butun sonda saqlanadi.
- Yopishtirilgan matndan raqam boʻlmagan belgilar olib tashlanadi, keyin shu qoidalar
  qoʻllanadi.

## Nima qilinmaydi

- Tungi rejim, mavzu tanlash, rang sozlash.
- Tashqi shrift, ikonka kutubxonasi, rasm fayllari.
- Ekran almashishidagi animatsiya, sirpanish, «skeleton» yuklanish.
- Grafik va diagramma (specda yoʻq).
- Kartochka soyasi va gradient.
