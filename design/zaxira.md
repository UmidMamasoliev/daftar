# Zaxira — ekran

Sana: 2026-08-17. Asos: `prds/zaxira.md`. Rang, oʻlcham va boʻshliq — `design/uslub.md` (bu
yerda ular nom bilan ataladi: `matn-ikkinchi`, `kichik`, `asosiy tugma`). Naqsh —
`design/kirim-chiqim.md` (xato uslubi, tugma qolipi) va `design/qarz-daftari.md` (kartochka,
sahifa ichida ochiladigan blok): oʻsha qoidalar shu yerda takrorlanmaydi, faqat farqi va yangi
matnlar yoziladi.
Qarorlar: 0003, 0004, 0006, 0007, 0009, 0014, 0021, 0024, 0027, 0028, 0029, 0041, 0043, 0047,
0053, 0054, 0055, 0063 → 0067, 0065.

Bitta ekran: **Zaxira**. Ichida ikkita ish — **eksport** (butun daftarni faylga chiqarish) va
**import** (fayldan tiklash). Uchinchi ish yoʻq: sozlama, parol, jurnal, bulut va jadval
boʻyicha zaxira qurilmaydi (0006, 0007, 0014).

Ekrandagi matnlar shu faylda aynan yozilgan — frontend oʻshani koʻchiradi, oʻzgartirmaydi.

**Navigatsiya (0067):** ekranga navigatsiya panelining **«Zaxira»** boʻlimidan kiriladi
(panel tavsifi `design/uslub.md`). Boshqa kirish yoʻli yoʻq. Bu ekran navigatsiyaning oʻz
boʻlimi, shuning uchun yuqorida **«‹ Orqaga» havolasi yoʻq**.

Spec 16-band «foydalanuvchi sozlamalardan tanlaydi» deydi — ilovada alohida «Sozlamalar»
ekrani yoʻq va qurilmaydi (specda yoʻq): shu ekranning oʻzi oʻsha joy. Bosh sahifadagi
zaxira eslatmasi (0024) shu boʻlimga soʻz bilan yoʻnaltiradi — u bosilmaydi (0067), demak
bu yerga kirish yoʻli baribir bitta: navigatsiyadagi «Zaxira» bandi.

**Bu ekranda modal oyna, tasdiq oynasi va kutish aylanasi yoʻq** (0029 ruhi; uslub: kutish
holati yoʻq). Import oqimi sahifa ichidagi blokda ketadi, ekran almashmaydi.

---

## 1. Ekranning tuzilishi — nima koʻrinadi

Yuqoridan pastga, bitta ustunda:

1. **Yuqori panel** — oʻrtada sarlavha **«Zaxira»**.
2. **«Zaxira olish» kartochkasi** (2-boʻlim).
3. **«Fayldan tiklash» kartochkasi** (3-boʻlim).
4. Oxirida boʻsh joy: navigatsiya paneli 56 px + qurilmaning pastki xavfsiz zonasi. Bu ekranda
   pastda yopishib turadigan tugma paneli **yoʻq** — ikkita ish bor, ikkalasi ham oʻz
   kartochkasida turadi.

Har kartochka: foni `yuza`, radiusi 10 px, 1 px `chegara`, ichki chekkasi 12 px yuqori-past /
16 px yon. Kartochkalar orasi 16 px, ekranning yon chekkasi 16 px (uslub).

Ekranda boshqa hech narsa yoʻq: 30 kunlik eslatma **bu yerda takrorlanmaydi** — u dashboardda
turadi (0024; `prds/dashboard.md` 7-band), bu ekranda faqat oxirgi eksport **sanasi** koʻrinadi.
Import/eksport tarixi, «qachon nima import qilingan» roʻyxati ham yoʻq (0014).

### Ikkita fayl — qaysi biri qachon chiqadi

| Fayl | Nomi | Qachon chiqadi |
|---|---|---|
| Qoʻlda eksport | `daftar-zaxira-2026-08-17-1435.json` | **«Eksport»** bosilganda (spec 4) |
| Import oldidan avtomatik zaxira | `daftar-import-oldidan-2026-08-17-1435.json` | Import 2-qadamida, oʻzi (spec 18) |

Ikkala fayl ham bir xil formatda va ikkalasini ham qaytarib import qilsa boʻladi (spec 18;
16-mezon). Fayl nomi ekranda **aynan shu koʻrinishda** koʻrsatiladi — tasdiq qadami aynan shu
nomga tayanadi.

Fayl nomidagi vaqt uslubdagi «vaqt koʻrsatilmaydi» qoidasiga zid emas: u qoida `yaratilgan`
maydoni haqida (0047), fayl nomi esa specda belgilangan (4, 18-bandlar) va uni ekranda
koʻrsatmasa 3-qadam ishlamaydi — odam qaysi faylni qaytarib tanlashini bilmay qoladi.

---

## 2. «Zaxira olish» kartochkasi — eksport

### Nima koʻrinadi

1. Sarlavha (`matn-kuchli`): **«Zaxira olish»**.
2. Holat qatori (`kichik`, `matn-ikkinchi`) — ikki holatdan biri:
   - **«Oxirgi zaxira: 16-avgust»** — sana uslubdagi format bilan: **«Bugun»**, **«Kecha»**,
     `16-avgust`, boshqa yildagi kun uchun `16-avgust 2025`.
   - **«Hali zaxira olinmagan.»** — daftar hech qachon eksport qilinmagan boʻlsa (spec 27 dagi
     ikkinchi shart).
3. Yordam qatori (`mayda`, `matn-ikkinchi`): **«Butun daftar bitta faylga yoziladi va
   qurilmangizga yuklab olinadi.»**
4. Asosiy tugma (eni toʻliq): **«Eksport»**.

### Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| **«Eksport»** | Fayl darhol yuklab olishga beriladi (spec 4). Tasdiq soʻralmaydi, oyna ochilmaydi. Holat qatori **«Oxirgi zaxira: Bugun»** ga oʻtadi (spec 5) va tugma ostida bir qator paydo boʻladi (`mayda`, `matn-ikkinchi`): **«Fayl yuklab olindi: daftar-zaxira-2026-08-17-1435.json»** |

Qoʻshimcha qoidalar:

- **Eksportda xato holati yoʻq.** Ilova faylni brauzerga beradi; fayl haqiqatan saqlanganini
  ilova bilmaydi — 0041 aynan shuning uchun yozilgan. Shuning uchun bu yerda «saqlandimi?»
  degan savol berilmaydi va tasdiq soʻralmaydi (0041: tasdiq faqat import yoʻlida boʻladi).
- Yuklab olindi qatori ekrandan chiqib ketilgunicha turadi; qayta eksport qilinsa yangi nom
  bilan almashadi.
- **Boʻsh daftar ham eksport qilinadi**: fayl bloklari boʻsh massiv boʻlib chiqadi (spec 10) va
  oxirgi eksport sanasi baribir yangilanadi. Tugma hech qachon oʻchiq boʻlmaydi — 0055 dagi
  «boʻsh daftar» istisnosi faqat **importga** tegishli.
- Eksport oflayn ishlaydi va fayl hech qayerga yuborilmaydi (0003, 0004; 25-mezon).

### Eng qisqa yoʻl — bir zaxira necha qadamda tugaydi

1. Navigatsiya panelidagi **«Zaxira»**.
2. **«Eksport»**.

**Ikki bosish, forma yoʻq, tasdiq yoʻq.** Bu eng koʻp takrorlanadigan amal (0024 uni har
30 kunda soʻraydi), shuning uchun uning yoʻlida bitta ham ortiqcha qadam yoʻq.

---

## 3. «Fayldan tiklash» kartochkasi — import

### Tinch holat: nima koʻrinadi

1. Sarlavha (`matn-kuchli`): **«Fayldan tiklash»**.
2. Ogohlantirish, ikki qator:
   - 1-qator (`matn` oʻlchami, `matn` rangi; **«oʻrniga»** soʻzi 600 qalinlikda):
     **«Import hozirgi maʼlumot oʻrniga fayldagisini yozadi.»**
   - 2-qator (`kichik`, `matn-ikkinchi`): **«Shuning uchun ilova avval hozirgi maʼlumotni
     faylga chiqaradi — undan qaytish yoʻli qoladi.»**
3. Ikkinchi tugma (eni toʻliq): **«Import»**.

**Ogohlantirish qizil emas va tugma xavfli tugma emas.** Sabab uslubda: qizil rang xato va
oʻchirish uchun, va u yolgʻiz oʻzi xabar tashimaydi. Bu yerda maʼnoni matnning oʻzi tashiydi,
qaytish yoʻli esa mavjud (0027 — avtomatik zaxira). Eng koʻp uchraydigan holat — yangi
qurilmada daftarni tiklash (0055); u yerda qizil tugma odamni bekorga qoʻrqitardi. Shu bilan
birga «Import» **asosiy tugma ham emas** (u ikkinchi tugma): ekranda kuniga bosiladigan
harakat — «Eksport».

**Daftar boʻsh boʻlsa** 2-qatordagi matn boshqacha boʻladi (0055; 4-boʻlim):
**«Daftar boʻsh — yoʻqoladigan maʼlumot yoʻq, import bir qadamda oʻtadi.»**

### Import — qadamlab (boʻsh boʻlmagan daftar, spec 17)

Toʻrt qadam, tartibi qatʼiy (0027, 0041). Har qadam shu kartochka ichida ochiladi; ekran
almashmaydi, navigatsiya paneli joyida qoladi.

**1-qadam — tiklanadigan faylni tanlash**

| Ekranda nima turadi | Nima bosiladi | Keyin nima boʻladi |
|---|---|---|
| Tinch holat (yuqorida) | **«Import»** | Qurilmaning fayl tanlagichi ochiladi (`.json` fayllar koʻrsatiladi; haqiqiy tekshiruv baribir mazmun boʻyicha — 22-band) |
| Fayl tanlagich | Fayl tanlanadi | Ilova faylni 22-band boʻyicha tekshiradi. Xato boʻlsa — 5-boʻlim, oqim boshlanmaydi. Toza boʻlsa: daftar boʻsh boʻlsa 4-boʻlimga oʻtadi, boʻsh boʻlmasa 2-qadam **oʻzi** boshlanadi |
| Fayl tanlagich | Tanlanmay yopiladi | Hech narsa boʻlmaydi: kartochka tinch holatda qoladi, xato matni chiqmaydi (forma `×` bilan yopilgani kabi — 0029 ruhi) |

**2-qadam — hozirgi maʼlumot faylga chiqariladi (ilova oʻzi bajaradi)**

Bosiladigan narsa yoʻq: fayl darhol yuklab olishga beriladi (spec 17, 18) va kartochka ichida
blok ochiladi:

1. Qator (`mayda`, `matn-ikkinchi`):
   **«Tiklanadigan fayl: daftar-zaxira-2026-08-10-0912.json»**
2. Qator (`matn-kuchli`): **«Hozirgi maʼlumot faylga chiqarildi.»**
3. Qator (`mayda`, `matn-ikkinchi`):
   **«daftar-import-oldidan-2026-08-17-1435.json»**
4. Qator (`matn`): **«Endi oʻsha faylni qaytarib tanlang — zaxira saqlanganini ilova shunda
   koʻradi.»**
5. Asosiy tugma: **«Zaxira faylini tanlash»**.
6. Ostida matn-havola: **«Bekor qilish»**.

Shu lahzada oxirgi eksport sanasi ham yangilanadi — avtomatik zaxira ham eksport sanaladi
(0054; 11b-mezon). Yuqoridagi kartochkadagi holat qatori darhol **«Oxirgi zaxira: Bugun»** ga
oʻtadi. Import keyin toʻxtab qolsa ham bu sana oʻrnida qoladi (0054; 11c-mezon): fayl haqiqatan
chiqarilgan va odamning qurilmasida.

**3-qadam — oʻsha faylni qaytarib tanlash (tasdiq)**

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| **«Zaxira faylini tanlash»** | Fayl tanlagichi ochiladi |
| Fayl tanlanadi | Ilova uni oʻqib, endigina chiqargan zaxira bilan solishtiradi (spec 19). Mos kelsa — 4-qadam darhol bajariladi. Mos kelmasa — 5-boʻlimdagi xato, blok 3-qadamda qoladi |
| Fayl tanlagich tanlanmay yopiladi | Import bajarilmaydi, blok 3-qadamda qoladi va sabab koʻrsatiladi (5-boʻlim; 17b-mezon) |
| **«Bekor qilish»** | 6-boʻlim |

**4-qadam — ustiga yozish**

Bosiladigan narsa yoʻq va koʻrinadigan oraliq holat ham yoʻq: hamma doʻkon tozalanadi va
fayldagi maʼlumot qoʻyiladi (spec 20, 23) — yo hammasi, yo hech narsa. Maʼlumot qurilmaning
oʻzida (0004), shuning uchun yuklanish aylanasi chizilmaydi (uslub). Natija — 7-boʻlimdagi
muvaffaqiyat holati.

### Eng qisqa yoʻl — bir import necha qadamda tugaydi

- **Boʻsh daftar (eng koʻp uchraydigan holat, 0055):** «Zaxira» → **«Import»** → fayl tanlash.
  **Ikki bosish va bitta fayl tanlash.**
- **Boʻsh boʻlmagan daftar:** «Zaxira» → **«Import»** → fayl tanlash → (avtomatik zaxira oʻzi
  chiqadi) → **«Zaxira faylini tanlash»** → fayl tanlash. **Uch bosish va ikkita fayl
  tanlash.**

Ikkinchi yoʻl qisqartirilmaydi: qoʻshimcha qadam 0041 ning oʻzi, va u aynan «zaxira haqiqatan
saqlandimi» degan savolga javob beradi.

---

## 4. Boʻsh daftar — bir qadamli yoʻl (0055)

**«Boʻsh daftar» taʼrifi** (uchala shart ham bajarilishi kerak, spec 17b): birorta yozuv yoʻq;
birorta kontakt, qarz va toʻlov yoʻq; kategoriyalar tayyor holatida — foydalanuvchi qoʻshgani
yoʻq va birortasi yashirilmagan. Bittasi buzilsa daftar boʻsh sanalmaydi va import 3-boʻlimdagi
toʻrt qadam boʻyicha ketadi (17f–17i-mezonlar).

Shart **«Import» bosilganda** tekshiriladi.

| Ekranda nima turadi | Nima bosiladi | Keyin nima boʻladi |
|---|---|---|
| Tinch holat, ogohlantirishning boʻsh daftar varianti bilan | **«Import»** | Fayl tanlagichi ochiladi |
| Fayl tanlagich | Fayl tanlanadi | Fayl 22-band boʻyicha tekshiriladi va darhol qoʻyiladi. **Avtomatik zaxira chiqarilmaydi, tasdiq soʻralmaydi** (17e-mezon). Natija — 7-boʻlim |

Bu yoʻlda oxirgi eksport sanasi **yangilanmaydi** — avtomatik zaxira chiqarilmadi; sana
fayldagi qiymat bilan tiklanadi (spec 17c, 9a; 0053).

---

## 5. Xato holatlari

Xato uslubi uslubdagi umumiy qoida boʻyicha, lekin bu ekranda xato **maydonga emas, blokka**
tegishli: qizil chegara qoʻyilmaydi (tegadigan maydon yoʻq), xato ikki qator matn bilan
koʻrsatiladi:

- 1-qator — sabab: `mayda`, `chiqim` rangi;
- 2-qator — natija, har doim bir xil: `mayda`, `matn-ikkinchi`,
  **«Daftardagi maʼlumot oʻzgarmadi.»**

Ikkinchi qator har xatoda takrorlanadi ataylab: odam xato koʻrganda birinchi savol —
«daftarim buzildimi?» — va javob har doim koʻzning oldida turadi (spec 22, 23).

| Qachon | Sabab | Odam nimani koʻradi (1-qator) |
|---|---|---|
| 1-qadam | Fayl JSON sifatida oʻqilmadi, yarim yozilgan | **«Fayl oʻqilmadi — u buzilgan yoki daftar zaxirasi emas.»** (20-mezon) |
| 1-qadam | `versiya` ilovaga notanish | **«Fayl versiyasi notanish — bu daftar oʻqiy oladigan zaxira emas.»** (21-mezon) |
| 1-qadam | Blok yoki majburiy maydon yetishmaydi — `yaratilgan` ham, `eksport.oxirgi-eksport` ham shu qatorda | **«Faylda maʼlumot toʻliq emas — import qilinmadi.»** (22, 6e-mezonlar) |
| 3-qadam | Tanlangan fayl endigina chiqarilgan zaxiraga mos kelmadi: boshqa fayl, eski zaxira, yarim yozilgan fayl | **«Bu fayl hozirgina chiqarilgan zaxira emas.»** (17c, 17d-mezonlar) |
| 3-qadam | Fayl umuman tanlanmadi | **«Zaxira fayli tanlanmadi — import bajarilmadi.»** (17b-mezon) |

Qoidalar:

- **1-qadamdagi xato oqimni boshlamaydi:** kartochka tinch holatda qoladi, avtomatik zaxira
  chiqarilmaydi va oxirgi eksport sanasi tegilmaydi. Xato qatorlari **«Import»** tugmasining
  ostida turadi.
- **3-qadamdagi xato oqimni buzmaydi:** blok 3-qadamda qoladi, **«Zaxira faylini tanlash»**
  tugmasi joyida turadi va odam toʻgʻri faylni qayta tanlay oladi. Chiqarilgan zaxiraning
  nomi (2-qadamdagi 3-qator) koʻz oldida turgani uchun xato matnida nom takrorlanmaydi.
- **Qayta urinishda yangi avtomatik zaxira chiqarilmaydi** — solishtirish oʻsha chiqarilgan
  zaxira bilan bajariladi. Shuning uchun qurilmada bitta ortiqcha fayl paydo boʻlmaydi va
  oxirgi eksport sanasi ikkinchi marta yangilanmaydi (0065).
- Uch xil sababga uch xil matn yozilgani ataylab: «fayl buzilgan», «versiya notanish» va
  «maydon yetishmaydi» — odam uchun uch xil ish. Birinchisida fayl qaytadan olinadi,
  ikkinchisida bu fayl umuman bu ilovaniki emas, uchinchisida fayl toʻliq saqlanmagan.
- Xato matni ekrandan chiqib ketilgunicha yoki keyingi urinishgacha turadi; yangi urinish
  boshlanishi bilan yoʻqoladi.

---

## 6. Bekor qilish va yarim qolgan oqim

**«Bekor qilish»** havolasi 2- va 3-qadamda turadi (19b-band).

| Nima boʻladi | Ekranda nima qoladi |
|---|---|
| **«Bekor qilish»** bosiladi | Blok yopiladi, kartochka tinch holatga qaytadi. Ostida ikki qator: `matn` — **«Import bekor qilindi — daftardagi maʼlumot oʻzgarmadi.»**; `mayda`, `matn-ikkinchi` — **«Chiqarilgan zaxira fayli qurilmangizda qoladi.»** |
| Ekrandan chiqib ketiladi (boshqa navigatsiya boʻlimi ochiladi) yoki ilova yopiladi | Oqim bekor boʻladi. Qaytib kelinganda kartochka tinch holatda turadi; hech qanday xabar saqlanmaydi. Daftardagi maʼlumot oʻzgarmagan, chiqarilgan zaxira fayli qurilmada qolgan |

Ikkala holatda ham oxirgi eksport sanasi **yangilangan boʻlib qoladi** (0054; 11c-mezon) — fayl
haqiqatan chiqarilgan.

Ekrandan chiqilganda oqimning bekor boʻlishi — «qaytarish» panelining qoidasi bilan bitta oila
(`design/kirim-chiqim.md`): bu daftarda ekran ortida davom etadigan yarim ish qoldirilmaydi.

---

## 7. Muvaffaqiyat holati — import tugagach nima koʻrinadi

Kartochka ichidagi blok natija holatiga oʻtadi:

1. Qator (`matn-kuchli`): **«Daftar fayldan tiklandi.»**
2. Sanoq qatori (`kichik`, `matn-ikkinchi`), sanoqlar orasida ` · ` (0065):
   **«128 yozuv · 12 kontakt · 9 qarz · 14 toʻlov»**
3. Matn-havola: **«Yozuvlarni koʻrish»** — «Yozuvlar» ekranini ochadi
   (`design/kirim-chiqim.md` 2-boʻlim).

Sanoq qatorining qoidalari (0065):

- Toʻrtta son, shu tartibda: **yozuv, kontakt, qarz, toʻlov** — fayldan tiklangan
  (yaʼni endi daftardagi) sonlar. Bu sonlar 4-mezonning oʻzi: fayldagi soni daftardagiga teng.
- Soʻzlar oʻzgarmaydi: son bir boʻlsa ham **«1 yozuv»** deb yoziladi (oʻzbekchada koʻplik
  qoʻshimchasi sanoqdan keyin qoʻyilmaydi).
- Nol boʻlgan tur **qatorda qolaveradi**: **«128 yozuv · 0 kontakt · 0 qarz · 0 toʻlov»**.
  Qator toʻrt ustunli hisob, roʻyxat emas — nolni tashlab ketish «tiklanmadimi?» degan savol
  tugʻdirardi.
- Kategoriya sanalmaydi: kategoriyalar har doim bor (0028) va ularning soni odam uchun
  javob bermaydi.
- Sonlar uslubdagi son formatida (mingliklar boʻsh joy bilan): `1 204 yozuv`.

Shu bilan birga:

- **«Zaxira olish» kartochkasidagi holat qatori fayldagi qiymatga almashadi** (0053; 21b-band):
  40 kun oldingi zaxira tiklansa qator **«Oxirgi zaxira: 8-iyul»** boʻlib qoladi. Bu toʻgʻri
  holat: tiklangan daftarning yangi zaxirasi hali olinmagan, va bosh sahifadagi eslatma
  darhol chiqadi (0024, 0053; 11a-mezon). Bu ekranda eslatma takrorlanmaydi.
- Hamma boshqa ekran yangi maʼlumotni koʻrsatadi: qoldiqlar, qarz qoldiqlari va hisobot
  fayldan **qayta hisoblanadi**, fayldan hisoblangan qiymat olinmaydi (spec 24, 25).
- Alohida «muvaffaqiyat» oynasi yoki rang yoʻq: yashil rang bu daftarda faqat kirim summasi
  uchun (uslub). Natijani matn va tiklangan sana aytadi.

Blok ekrandan chiqib ketilgunicha turadi. Qaytib kelinganda kartochka tinch holatda boʻladi.

Nega bu yerda xabar bor, forma saqlanganda esa yoʻq (`design/kirim-chiqim.md`: «saqlandi»
xabari koʻrsatilmaydi): u yerda natija oʻsha ekranning oʻzida koʻrinib turadi, bu yerda esa
natija boshqa ekranlarda. Xabarsiz odam import boʻldimi-yoʻqmi bilmay qolardi.

---

## 8. Boʻsh holatlar

**a) Daftar hech qachon eksport qilinmagan.** «Zaxira olish» kartochkasidagi holat qatori:
**«Hali zaxira olinmagan.»** Tugma va yordam qatori odatdagidek turadi.

**b) Daftar boʻsh (hali bitta ham yozuv yoʻq).** Ekran oʻzgarmaydi, ikkita farq bilan:

- «Eksport» ishlayveradi — fayl boʻsh bloklar bilan chiqadi (spec 10).
- «Fayldan tiklash» ogohlantirishining 2-qatori boshqacha: **«Daftar boʻsh — yoʻqoladigan
  maʼlumot yoʻq, import bir qadamda oʻtadi.»** (0055; 4-boʻlim).

Bu ekranda «Hali bitta ham yozuv yoʻq.» turdagi boʻsh holat matni **yoʻq**: ekran maʼlumotni
koʻrsatmaydi, u ikkita ishni bajaradi va ikkalasi ham boʻsh daftarda ham ishlaydi.

---

## 9. Savollar — hammasi yopilgan

Bu tavsif yozilganda ikkita savol ochilgan edi; ikkalasi ham **0065** bilan hal qilindi
(0058 vakolati). **Ochiq savol qolmadi; TAKLIF belgisi bu faylda yoʻq.**

| # | Savol | Javob | Qayerda yozilgan |
|---|---|---|---|
| 1 | Import tugagach natija qanday koʻrsatiladi? | «Daftar fayldan tiklandi.» ostida sanoq qatori: yozuv · kontakt · qarz · toʻlov | 7-boʻlim |
| 2 | 3-qadamdagi xatodan keyin oqim nima boʻladi? | Oqim oʻsha qadamda qoladi va fayl qayta tanlanadi; ikkinchi avtomatik zaxira chiqarilmaydi; ekrandan chiqilsa oqim bekor boʻladi | 3, 5 va 6-boʻlimlar |

Ikkalasining bir ildizi bor: **import — natijasi oʻz ekranida koʻrinmaydigan yagona amal.**
Shuning uchun natija bir qatorda sanab aytiladi (4-mezon aynan shu sonlarni tekshiradi), va
xato boʻlganda odam qayta urinadigan joy oʻsha yerda qoladi — har urinishda yangi zaxira fayli
chiqarilsa, qurilmada deyarli bir xil bir nechta fayl yigʻilib, 0041 dagi tanlovning aniqligi
yoʻqolardi.

---

## 10. Nima qoʻyilmaydi

- Tasdiq oynasi, modal oyna, «rostdan ham?» degan savol (0029 ruhi).
- «Zaxirani saqladim» tugmasi yoki fayl saqlash oynasi orqali tasdiq — tasdiq faqat faylni
  qaytarib tanlash bilan (0041).
- 30 kunlik eslatmaning oʻzi — u dashboardda (0024); bu yerda faqat sana qatori.
- Import/eksport jurnali, «qachon nima import qilingan» tarixi (0014).
- Qisman import: faqat kontaktlarni yoki bitta oyni tiklash; birlashtirish, dublikat topish
  (0027).
- Zaxirani parol bilan yopish yoki shifrlash (0006).
- Avtomatik zaxira, jadval boʻyicha zaxira, bulutga yuklash, faylni ulashish tugmasi
  (0007, 0003, 0021).
- CSV, Excel yoki boshqa ilovaning faylini import qilish (0007).
- Yuklanish aylanasi, progress qatori va foiz (uslub: kutish holati yoʻq — maʼlumot qurilmada).
- Fayl mazmunini ekranda koʻrsatish yoki tahrirlash imkoni (specda yoʻq).
- «Qaytarish» paneli: bu ekranda oʻchirish yoʻq, qaytish yoʻli — avtomatik zaxira fayli (0027).
