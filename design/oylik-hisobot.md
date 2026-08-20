# Oylik hisobot — ekran

Sana: 2026-08-17. Asos: `prds/oylik-hisobot.md`. Rang, oʻlcham va boʻshliq — `design/uslub.md`
(bu yerda ular nom bilan ataladi: `matn-ikkinchi`, `kichik`, `asosiy tugma`). Naqsh —
`design/kirim-chiqim.md` va `design/qarz-daftari.md`: forma maydonlari, xato uslubi va matnlar
oʻsha qoidalar boʻyicha ishlaydi, bu yerda takrorlanmaydi — faqat farqi va yangi matnlar
yoziladi.
Qarorlar: 0002, 0009, 0013, 0017, 0018, 0019, 0021, 0023, 0026, 0028, 0033, 0034, 0035, 0038,
0042, 0043, 0044, 0045, 0047, 0049, 0063 → 0067, 0064.

Bitta ekran: **Hisobot**. Ichida forma yoʻq, oʻchirish yoʻq, tahrirlash yoʻq — hisobot faqat
koʻriladi (0021). Yagona kiritiladigan narsa — «≈ jami soʻmda» uchun kurs (0023, 0043).

Ekrandagi matnlar shu faylda aynan yozilgan — frontend oʻshani koʻchiradi, oʻzgartirmaydi.

**Navigatsiya (0067):** ekranga navigatsiya panelining **«Hisobot»** boʻlimidan kiriladi
(panel tavsifi `design/uslub.md`). Boshqa kirish yoʻli yoʻq — bosh sahifada hisobotga
alohida havola qoʻyilmaydi. Bu ekran navigatsiyaning oʻz boʻlimi, shuning uchun yuqorida
**«‹ Orqaga» havolasi yoʻq**. Hisobotga yetib borish — **bitta bosish**; joriy oyni
koʻrish uchun boshqa hech narsa bosilmaydi.

**Hisobot hech narsa saqlamaydi.** Har raqam ekran ochilganda joriy maʼlumotdan qayta
hisoblanadi: yozuv tahrirlansa yoki oʻchirilsa hisobot darhol yangi raqamni koʻrsatadi
(0014, 0045; 18-mezon). «Oy yopish» holati yoʻq.

---

## 1. Ekranning tuzilishi

Yuqoridan pastga, hammasi bitta ustunda (`design/uslub.md`, mobil-birinchi):

1. **Yuqori panel** — oʻrtada sarlavha **«Hisobot»**.
2. **Davr qatori** — yuqori panel ostida yopishib turadi (sticky). Uzun hisobotni surganda ham
   odam qaysi davrni koʻrayotganini yoʻqotmasin.
3. **Jami bloki** — «Jami kirim», «Jami chiqim», «Farq» (3-boʻlim).
4. **«Chiqim — kategoriyalar boʻyicha»** ajratmasi (4-boʻlim).
5. **«Kirim — kategoriyalar boʻyicha»** ajratmasi (4-boʻlim).
6. **«Qarz»** bloki (5-boʻlim).
7. Oxirida boʻsh joy: navigatsiya paneli 56 px + qurilmaning pastki xavfsiz zonasi. Bu ekranda
   asosiy tugma paneli yoʻq, shuning uchun 72 px qoʻshilmaydi (`design/uslub.md`).

Chiqim ajratmasi kirimdan **yuqorida** turadi: hisobot «pul qayerga ketdi» degan savolga javob
beradi (`prds/oylik-hisobot.md`, «Nima uchun»).

Har blok — kartochka: foni `yuza`, radiusi 10 px, 1 px `chegara`, ichki chekkasi 12 px
yuqori-past / 16 px yon. Bloklar orasi 16 px, ekranning yon chekkasi 16 px. Kartochka ichidagi
qator balandligi 40 px (bosilmaydi, shuning uchun 44 px shart emas), chapda matn, oʻngda son.

**`raqam-katta` (28 px) bu ekranda ishlatilmaydi.** Uslubda u «qoldiq va jami raqamlari» uchun
belgilangan, lekin bu yerda uchta jami yonma-yon turadi va ikkitasi valyutaga boʻlinadi — olti
katta raqam ekranni oʻqib boʻlmas qilardi. Jami qatorlari `summa` (17/600) oʻlchamida.

---

## 2. Davr tanlash

### Nima koʻrinadi

Davr qatori ikki holatda boʻladi.

**Oy holati (standart).** Chapda `‹` tugmasi, oʻrtada oy nomi, oʻngda `›` tugmasi; ularning
ostida oʻngga tekislangan matn-havola **«Davr tanlash»**.

- Oy nomi: joriy yildagi oy uchun **«avgust»**, boshqa yildagi oy uchun **«avgust 2025»**
  (`design/uslub.md` sana qoidasi).
- Ekran **har ochilganda joriy kalendar oy** bilan ochiladi (0018; 1-mezon). Tanlangan oy
  eslab qolinmaydi: boshqa boʻlimga oʻtib qaytilsa yana joriy oy turadi. Sabab — 1-mezon
  aynan shuni tekshiradi va «qaysi oyda turibman» degan savol har safar bir xil javob oladi.
- `›` tugmasi joriy oyda **oʻchiq** (`matn-oʻchiq`, bosilmaydi): kelajak oyi tanlanmaydi.
  Kelajak sanali yozuv umuman kiritilmaydi (0034), demak kelajak oyi har doim boʻsh boʻlardi.
- `‹` tugmasi har doim ishlaydi — daftar qanchalik eski boʻlishidan qatʼi nazar orqaga
  yuriladi (chegara qoʻyilmaydi).

**Davr holati.** Oy nomi va strelkalar oʻrnida davr matni turadi: **«1-avgust — 15-avgust»**
(boshqa yildagi sana yil bilan: «28-dekabr 2025 — 5-yanvar»). Ostida matn-havola
**«Oyga qaytish»**.

### «Davr tanlash» bloki

Havola bosilganda davr qatori ostida blok ochiladi (foni `yuza`, «Yangi kontakt» blokining
naqshi — `design/qarz-daftari.md`):

1. Qator **«Sanadan»** — oʻngda tugma, ichida joriy davrning boshlanish sanasi.
2. Qator **«Sanagacha»** — oʻngda tugma, ichida joriy davrning tugash sanasi.
3. Oʻngda asosiy tugma **«Koʻrsatish»**, chapda `×`.

Ikkala tugma ham qurilmaning sana tanlagichini ochadi; ertangi va undan keyingi kunlar oʻchiq
(0034). Bitta kunlik davr ham mumkin: «Sanadan» va «Sanagacha» bir xil kun boʻlishi xato emas.

### Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| `‹` | Bir oy orqaga oʻtiladi, hamma raqam darhol qayta hisoblanadi (2-mezon) |
| `›` | Bir oy oldinga oʻtiladi. Joriy oyda tugma oʻchiq — hech narsa boʻlmaydi |
| **«Davr tanlash»** | Blok ochiladi; sanalar joriy davr bilan toʻldirilgan turadi |
| «Sanadan» / «Sanagacha» tugmasi | Qurilmaning sana tanlagichi ochiladi (kelajak kunlar oʻchiq) |
| **«Koʻrsatish»** | Xato boʻlmasa: blok yopiladi, davr qatori davr holatiga oʻtadi, raqamlar oʻsha oraliq boʻyicha qayta hisoblanadi (3-mezon). Xato boʻlsa — 9-boʻlim |
| `×` yoki blokdan tashqariga tegish | Blok yopiladi, tanlangani unutiladi; tasdiq soʻralmaydi |
| **«Oyga qaytish»** | Davr bekor boʻladi va **davr tanlashdan oldin ochiq turgan oy** qaytadi |

Davr chegarasi **kun boʻyicha ichkariga oladi**: boshlanish kunidagi va tugash kunidagi
yozuvlar davrga kiradi, undan tashqaridagilar kirmaydi (4, 5, 6-mezonlar). Oy holatida davr —
oyning 1-sanasidan oxirgi sanasigacha (0018).

---

## 3. Jami bloki

### Nima koʻrinadi

Bitta kartochka, ichida uchta boʻlak, orasi 12 px. Har boʻlakda: chapda yorliq (`kichik`,
`matn-ikkinchi`), oʻngda valyuta qatorlari — har valyuta oʻz qatorida (0023, 0038).

| Yorliq | Ostidagi yordam qatori (`mayda`, `matn-ikkinchi`) |
|---|---|
| **«Jami kirim»** | yoʻq |
| **«Jami chiqim»** | yoʻq |
| **«Farq»** | **«kirim − chiqim»** |

Summalar ishora va rang bilan (`design/uslub.md` uch belgi qoidasi):

- «Jami kirim» qatorlari: `+8 000 000 soʻm`, `+200,00 $` — `kirim` rangi.
- «Jami chiqim» qatorlari: `−2 950 000 soʻm`, `−20,00 $` — `chiqim` rangi.
- «Farq» qatorlari: musbat boʻlsa `+5 050 000 soʻm` (`kirim`), manfiy boʻlsa `−250 000 soʻm`
  (`chiqim`), aynan nol boʻlsa `0 soʻm` — ishorasiz, rangi `matn`.

**Valyuta qatori faqat oʻsha valyutada yozuv bor davrda chiziladi** (0038; 10b-mezon):

- «Jami kirim» ning dollar qatori — davrda dollarda kirim yozuvi boʻlsa;
- «Jami chiqim» ning dollar qatori — davrda dollarda chiqim yozuvi boʻlsa;
- «Farq» ning dollar qatori — davrda dollarda kirim **yoki** chiqim yozuvi boʻlsa.

Boʻsh davrda qoida bitta istisno bilan buziladi: birorta yozuv boʻlmasa uchala boʻlakda ham
soʻm qatori `0 soʻm` boʻlib turadi (8-boʻlim; 17-mezon).

### «≈ jami soʻmda» qatori

Valyuta qatorlarining ostida, oʻsha boʻlak ichida:

- 1-qator: **«≈ +10 500 000 soʻm»** — `matn` oʻlchami, rangi **`matn`** (neytral).
- 2-qator: **«taxminiy · 1 $ = 12 500 soʻm»** — `mayda`, `matn-ikkinchi`.

Qoidalar:

1. **Qachon chiziladi:** faqat oʻsha boʻlakda **dollar qatori** boʻlsa. Soʻm — asos valyuta
   (0023), shuning uchun faqat soʻmdagi boʻlakda taxmin qiladigan narsa yoʻq va qator umuman
   chizilmaydi. Bitta valyutada ishlaydigan odamning hisoboti shu tufayli sodda koʻrinishda
   qoladi (0038). Faqat dollarli boʻlakda esa qator chiziladi — u yerda soʻmdagi qiymat
   haqiqatan noaniq.
2. **Faqat shu blokda.** Kategoriya qatorlarida ham, qarz qatorlarida ham «≈ jami soʻmda»
   **yoʻq** (0038). Bu qoidaning istisnosi yoʻq.
3. **Rangi neytral** — taxminiy raqam haqiqiy raqamdek koʻrinmasin. Maʼnoni ishora va boʻlak
   yorligʻi tashiydi, rang emas. Bu `design/qarz-daftari.md` dagi «qarz toʻlovi summasi rang
   olmaydi» qoidasi bilan bitta oila.
4. **Har boʻlak oʻz qatorlaridan hisoblanadi:** boʻlakdagi har valyuta qatori kursda soʻmga
   aylantiriladi (eng yaqin butun soʻmga — 0042) va qoʻshiladi. «Farq» ning ≈ qatori ham shu
   yoʻl bilan chiqadi, «≈ kirim − ≈ chiqim» yoʻli bilan emas — yaxlitlash bir joyda bajarilsin
   va natija bir xil boʻlsin.
5. **Qaysi kurs:** «oxirgi kurs» — eng kech **sanali** yozuv yoki qarz toʻlovidagi kurs; bir
   xil sanada oxirgi kiritilgani gʻolib (0044, 0047). Qoʻlda soʻralgan kurs (0043) kiritilgan
   kundagi qiymat sifatida shu taqqosda teng qatnashadi. Qiymat saqlanmaydi, har safar
   hisoblanadi (0045).
6. **Kurs davrga bogʻliq emas:** oʻtgan oy hisobotida ham eng yangi maʼlum kurs ishlatiladi
   (spec 10b). Shu sababli ishlatilgan kurs 2-qatorda koʻrsatiladi — odam qaysi kurs bilan
   hisoblanganini koʻrmasa, taxminiy raqamni tekshira olmaydi.

### Kurs soʻrash bloki

Daftarda birorta ham kurs boʻlmasa (na kursli yozuv, na kursli toʻlov, na qoʻlda soʻralgan
kurs — 23g-band), ilova taxminiy jamini hisoblashdan oldin kursni soʻraydi (0023, 0043;
21-mezon). Alohida oyna ochilmaydi — bu daftarda modal oyna yoʻq (0029 ruhi): blok aynan
«≈ jami soʻmda» qatori turadigan joyda ochiladi.

Blok ichida:

1. Qator (`mayda`, `matn-ikkinchi`): **«Taxminiy jamini koʻrsatish uchun kurs kerak.»**
2. Kurs maydoni — yorligʻi **«Kurs — 1 dollar necha soʻm»**, ichida namuna `12 500`
   (`matn-oʻchiq`). Terish qoidalari `design/kirim-chiqim.md` dagi kurs maydonining aynan
   oʻzi: faqat butun son, mingliklar boʻsh joy bilan (0042).
3. Oʻngda asosiy tugma **«Saqlash»**.

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| **«Saqlash»** | Xato boʻlmasa kurs oʻsha kunning sanasi bilan saqlanadi (0043, 0044), blok yoʻqoladi va hamma «≈ jami soʻmda» qatorlari darhol chiqadi. Soʻrov qaytarilmaydi: ilova qayta ochilganda ham soʻralmaydi va kurs zaxira fayliga kiradi (0043). Xato boʻlsa — 9-boʻlim |

Qoʻshimcha qoidalar:

- **Blok bir marta chiziladi.** Bir necha boʻlakka ≈ kerak boʻlsa, blok ularning
  **birinchisida** turadi (tartib: «Jami kirim» → «Jami chiqim» → «Farq»), qolganlarida esa
  javob berilgunicha ≈ qatori umuman chizilmaydi. Javobdan keyin hammasi bir vaqtda paydo
  boʻladi.
- **Blokni yopish tugmasi yoʻq:** javob berilmasa ham hisobotning qolgan hamma raqami joyida
  turadi — ular kursga muhtoj emas (0038). Odam kursni bilmasa, shunchaki javob bermaydi.
- Daftarda kurs allaqachon boʻlsa (masalan bitta dollarli yozuv kursi bilan saqlangan boʻlsa),
  blok umuman koʻrinmaydi — kurs soʻralmaydi (23-band).

---

## 4. Kategoriyalar ajratmasi

Ikkita kartochka, bir xil qurilishda: **«Chiqim — kategoriyalar boʻyicha»** va
**«Kirim — kategoriyalar boʻyicha»** (0019: roʻyxatlar alohida — 0013).

### Nima koʻrinadi

Kartochka sarlavhasi (`matn-kuchli`), ostida qatorlar. Har qator: chapda kategoriya nomi
(`matn`), oʻngda summa (`summa` oʻlchami, ishora va rang bilan — chiqimda `−` va `chiqim`,
kirimda `+` va `kirim`).

**Valyuta boʻyicha ajratma (0038):**

- Tekshiruv **har kartochkada alohida** bajariladi: chiqim ajratmasi chiqim yozuvlariga,
  kirim ajratmasi kirim yozuvlariga qaraydi.
- Shu kartochkada bitta valyuta boʻlsa — hech qanday guruh sarlavhasi qoʻyilmaydi, qatorlar
  ketma-ket turadi. Valyutani summaning oʻzi aytadi (`−800 000 soʻm`).
- Shu kartochkada ikkala valyuta ham boʻlsa — qatorlar valyuta guruhlariga boʻlinadi. Guruh sarlavhasi
  (`kichik`, `matn-ikkinchi`): **«soʻm»**, keyin **«dollar»**. Avval soʻm guruhi, keyin dollar
  guruhi.
- **Yozuv boʻlmagan valyutada guruh ham, qator ham chizilmaydi** (10b-mezon). Boʻsh qator,
  `0` qiymatli qator va «yoʻq» degan qator qoʻyilmaydi.
- Bitta kategoriya ikki valyutada ishlatilgan boʻlsa, ikkita qator boʻlib chiqadi —
  «oziq-ovqat» soʻm guruhida ham, dollar guruhida ham (0038 dagi misolning oʻzi).

**Tenglik.** Har guruhdagi summalar yigʻindisi oʻsha valyutadagi jamiga **aynan** teng:
soʻm qatorlari yigʻindisi «Jami chiqim» ning soʻm qatoriga, dollar qatorlari yigʻindisi uning
dollar qatoriga (10, 10a-mezonlar). Ajratmada hech qayerda kurs ishlatilmaydi, shuning uchun
tenglik taxminiy emas — aniq.

**Tartib:** har guruh ichida summa boʻyicha kamayish tartibida (eng katta xarajat yuqorida —
hisobot shu savolga javob beradi). Summalari teng boʻlsa 0028 dagi tayyor roʻyxat tartibi,
undan keyin foydalanuvchi qoʻshgani qoʻshilish tartibida. Foydalanuvchi tartibni oʻzgartira
olmaydi: saralash tugmasi yoʻq (0002).

**Yashirilgan kategoriya** ajratmada odatdagidek koʻrinadi: nomi ham, summasi ham boshqa
qatorlar bilan bir xil rangda, hech qanday belgi qoʻyilmaydi (0013; 12-mezon). `matn-oʻchiq`
rangi faqat «Kategoriyalar» boshqaruv ekranida ishlatiladi (`design/kirim-chiqim.md`) —
hisobot eski yozuvni kamsitmaydi, u oʻsha oyda haqiqatan sarflangan pul.

**Qatorlar bosilmaydi** (0064). Kategoriya qatoriga bosilganda hech narsa boʻlmaydi: yozuvlar
roʻyxatini kategoriya boʻyicha ochadigan ekran specda yoʻq va filtr 0002 bilan taqiqlangan.
Qator bosiladigan koʻrinishga ham keltirilmaydi — fon oʻzgarmaydi, kursor oʻzgarmaydi.

---

## 5. Qarz bloki

Kartochka sarlavhasi: **«Qarz»**. Ostida qatorlar, eng pastida izoh qatori (`mayda`,
`matn-ikkinchi`): **«Qarz summalari jami kirim va jami chiqimga qoʻshilmagan.»**

Izoh qatori 0017 talab qilgan «tushuntiruvchi qisqa matn»: qarzga berilgan pul sarflangan pul
emas, joyi oʻzgargan pul — lekin u hisob qoldigʻiga taʼsir qilgan, shuning uchun hisobotda
koʻrinib turishi kerak.

### Qatorlar — toʻrtta yoʻnalish (0064)

Blokda toʻrtta yorliq bor, shu tartibda. Ikkalasi qarz berish tomonini, ikkalasi qarz olish
tomonini yopadi — qarzning ikkala yoʻnalishi ham pulni qimirlatadi (0017, 0035), demak
ikkalasi ham hisobotda koʻrinishi kerak (0064).

| Yorliq | Nima sanaladi | Ishora va rang |
|---|---|---|
| **«Qarzga berildi»** | Davrda kiritilgan **«Berdim»** qarzlarining summasi | `−1 000 000 soʻm`, `chiqim` |
| **«Qarzdan qaytdi»** | Davrda **«Berdim»** qarzlariga tushgan toʻlovlar | `+300 000 soʻm`, `kirim` |
| **«Qarz olindi»** | Davrda kiritilgan **«Oldim»** qarzlarining summasi | `+500 000 soʻm`, `kirim` |
| **«Qarz qaytarildi»** | Davrda **«Oldim»** qarzlariga toʻlangan toʻlovlar | `−200 000 soʻm`, `chiqim` |

Qoidalar:

- Har qator **valyuta boʻyicha alohida**, taxminsiz (0038; 10c, 6a-bandlar). Oʻsha valyutada
  qarz harakati boʻlmagan davrda qator chizilmaydi.
- Nol qator chizilmaydi: davrda qarz berilmagan boʻlsa «Qarzga berildi» qatori umuman yoʻq.
  Toʻrtala yorliq ham shu qoidada — koʻpincha blokda bir yoki ikkita qator turadi.
- Ikkala valyuta ham boʻlsa, bitta yorliq ostida ikkita qator boʻladi (soʻm, keyin dollar) —
  kategoriya ajratmasidagi tartibning oʻzi.
- **Toʻlov oʻz valyutasida, kiritilgan summasi bilan sanaladi** (0064). Dollardagi qarzga
  soʻmda toʻlov kiritilgan boʻlsa, hisobotga `625 000 soʻm` tushadi — qarzdan ayirilgan
  `50,00 $` emas. Sabab: bu qator pul harakatini koʻrsatadi va aynan shu summa hisob
  qoldigʻiga tushgan; aylantirilgan qiymat qarz qoldigʻining ishi va u kontakt sahifasida
  koʻrinadi (`design/qarz-daftari.md`). Shu tufayli qator qoʻlda sanaladigan boʻlib qoladi
  (6-boʻlim).
- **Qarzning oʻzi** esa oʻz valyutasida sanaladi — u yerda aylantirish umuman yoʻq (0023).
- Bu summalar «Jami kirim» va «Jami chiqim» ga **qoʻshilmaydi** va kategoriyalar ajratmasiga
  **kirmaydi** (0017; 15, 16-mezonlar).
- **Ishora nimani bildiradi:** bu qatorlar pul harakatini koʻrsatadi — qarzga berilgan pul
  hisobdan chiqadi, qaytgan toʻlov hisobga tushadi; qarz olinganda pul hisobga tushadi, uni
  qaytarganda chiqadi (0017, 0035). Shuning uchun ishora va rang qarz daftaridagi **netto**
  qatoridan boshqacha: netto «menga qancha qaytadi» degan savolga javob beradi, hisobot qatori
  esa «bu davrda pul qayerga qimirladi» degan savolga. Ikkalasi har xil savol, shuning uchun
  ishoralari ham har xil. Qarz formasidagi segment ham shu mantiqda boʻyalgan: «Berdim» —
  `chiqim`, «Oldim» — `kirim` (`design/qarz-daftari.md`).

---

## 6. Qaysi yozuv qaysi qatorga tushadi

Hisobotning sanogʻi ochiq boʻlishi kerak: ekrandagi har raqamni odam qoʻlda qayta sanay olsin.
Qoidalar bitta joyda:

1. **Davr:** yozuvning `sana` maydoni davr boshlanishidan kichik boʻlmasa va davr tugashidan
   katta boʻlmasa — yozuv davrga kiradi (4, 5, 6-mezonlar). `yaratilgan` maydoni davrga
   umuman taʼsir qilmaydi: u faqat tartib va kurs taqqosi uchun (0047).
2. **Tur:** kirim yozuvi faqat «Jami kirim» va «Kirim — kategoriyalar boʻyicha» ga; chiqim
   yozuvi faqat «Jami chiqim» va «Chiqim — kategoriyalar boʻyicha» ga tushadi.
3. **Valyuta:** yozuv oʻz valyutasidagi qatorga tushadi va hech qayerda aylantirilmaydi (0038).
   Aylantirish faqat «≈ jami soʻmda» qatorida boʻladi.
4. **Kategoriya:** yozuvning oʻz kategoriyasiga — yashirilgan boʻlsa ham (0013).
5. **Qarz:** qarzning oʻzi va uning toʻlovlari kategoriya ajratmasiga ham, jami kirim/chiqimga
   ham tushmaydi — faqat «Qarz» blokiga (0017). Qaysi qatorga tushishini **qarzning
   yoʻnalishi** aniqlaydi (0064):
   - «Berdim» qarzi → **«Qarzga berildi»**; oʻsha qarzga tushgan toʻlov → **«Qarzdan qaytdi»**;
   - «Oldim» qarzi → **«Qarz olindi»**; oʻsha qarzga toʻlangan toʻlov → **«Qarz qaytarildi»**.
5a. **Qarzning sanasi** qarz qatorini, **toʻlovning sanasi** toʻlov qatorini davrga bogʻlaydi —
   qarz bilan toʻlov turli davrlarga tushishi odatdagi hol.
5b. **Qarz valyutasi** qarz qatorini, **toʻlovning oʻz valyutasi** toʻlov qatorini aniqlaydi
   (0064): dollar qarziga soʻmda toʻlov qilinsa, qarz dollar qatorida, toʻlov esa soʻm
   qatorida turadi. Aylantirilgan qiymat hisobotga umuman kirmaydi.
6. **Farq:** har valyutada oʻsha valyutaning «Jami kirim» minus «Jami chiqim» i (9-mezon).
   Valyutalar oʻzaro qoʻshilmaydi. Qarz qatorlari farqqa ham kirmaydi (0017).

Ekranda faqat shu qoidalar ishlaydi — yashirin filtr, chetlab oʻtiladigan yozuv va «hisobga
olinmaydi» degan holat yoʻq.

---

## 7. Nima bosiladi va keyin nima boʻladi — jamlangan

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| Navigatsiyadagi **«Hisobot»** | Ekran **joriy oy** bilan ochiladi (1-mezon) |
| `‹` / `›` | 2-boʻlim |
| **«Davr tanlash»**, **«Koʻrsatish»**, `×`, **«Oyga qaytish»** | 2-boʻlim |
| Kurs blokidagi **«Saqlash»** | 3-boʻlim |
| Kategoriya qatori | Hech narsa boʻlmaydi — qator bosilmaydi (0064; 4-boʻlim) |
| Qarz qatori | Hech narsa boʻlmaydi — qator bosilmaydi |
| Jami qatori | Hech narsa boʻlmaydi |

Bu ekranda **oʻchirish, tahrirlash, qoʻshish va ulashish yoʻq** — shuning uchun «qaytarish»
paneli ham hech qachon chiqmaydi (0021, 0029).

---

## 8. Boʻsh holatlar

**a) Davrda yozuv ham, qarz harakati ham yoʻq (daftarda esa maʼlumot bor).**

- Jami bloki oʻz joyida turadi va uchala boʻlakda soʻm qatori `0 soʻm` boʻlib koʻrinadi —
  ishorasiz, rangi `matn` (17-mezon: raqamlar nol boʻlib koʻrinadi va ekran xato bermaydi).
  Dollar qatori chizilmaydi, «≈ jami soʻmda» chizilmaydi, kurs soʻralmaydi.
- Kategoriya kartochkalari oʻrnida bittadan qator (`kichik`, `matn-ikkinchi`):
  **«Bu davrda chiqim yozuvi yoʻq.»** va **«Bu davrda kirim yozuvi yoʻq.»**
- Qarz kartochkasi oʻrnida: **«Bu davrda qarz harakati yoʻq.»**
- Jami blokining ostida yoʻl koʻrsatuvchi qator (`kichik`, `matn-ikkinchi`):
  **«Boshqa davrni yuqoridan tanlang.»** (Matn ikkala holatda ham bir xil: oy holatida ham,
  davr holatida ham davr tanlagich yuqorida turadi.)

**b) Daftarda hali bitta ham yozuv yoʻq.**

Yuqoridagi holatning oʻzi, faqat oxirgi qator oʻrnida ikkita qator turadi:

- `matn-kuchli`: **«Hali bitta ham yozuv yoʻq.»**
- `kichik`, `matn-ikkinchi`: **«Birinchi yozuvni bosh sahifadagi «＋ Yozuv» tugmasi bilan
  qoʻshasiz.»**

**Matn 0068 ning 2-bosqichida tuzatildi.** Oldin bu yerda 0063 dan qolgan «…pastdagi
«Yozuv» boʻlimi bilan…» turardi, lekin «Yozuv» degan navigatsiya boʻlimi 0067 bilan olib
tashlangan — qator mavjud boʻlmagan joyni koʻrsatardi. Endi u «Yozuvlar» va bosh
sahifadagi qator bilan bir xil: bitta holat — bitta matn. 0068 ning matn muzlatish
qoidasidan yagona istisno, bosh agent ruxsati bilan.

**c) Yarim boʻsh davr.** Bloklar bir-biridan mustaqil: chiqim boʻlsa-yu kirim boʻlmasa, chiqim
ajratmasi odatdagidek chiziladi, kirim ajratmasi oʻrnida esa **«Bu davrda kirim yozuvi
yoʻq.»** qatori turadi. «Jami kirim» boʻlagi baribir `0 soʻm` koʻrsatadi — jami bloki hech
qachon qatorsiz qolmaydi.

Teskari holat ham shu qoidada: davrda faqat qarz harakati boʻlsa (yozuv boʻlmasa), jami bloki
`0 soʻm` koʻrsatadi, ikkala ajratma oʻz boʻsh qatori bilan turadi, «Qarz» bloki esa oʻz
raqamlarini toʻliq koʻrsatadi. Qarz jamiga qoʻshilmagani shu yerda koʻzga tashlanadi va izoh
qatori uni aytib turadi (0017).

---

## 9. Xato holatlari

Bu ekranda kiritiladigan narsa ikkitagina: davr sanalari va kurs. Xato uslubi — uslubdagi
umumiy qoida (maydon 2 px `chiqim` chegara, tagida `mayda` `chiqim` rangli matn); yordam matni
esa maydonni qizil qilmaydi va ishni toʻxtatmaydi.

| Holat | Odam nimani koʻradi |
|---|---|
| «Sanadan» «Sanagacha» dan keyin | Blok ichida, tugmalar ostida: **«Boshlanish sanasi tugash sanasidan keyin boʻlmasin.»** Davr qoʻllanmaydi |
| Sana tanlagichi baribir kelajak sanasini qaytarsa | Oʻsha qator ostida: **«Sana bugundan keyin boʻlmaydi.»** (0034) |
| Kurs maydoni boʻsh, «Saqlash» bosilgan | Kurs maydoni qizil chegara oladi, tagida: **«Kursni kiriting — 1 dollar necha soʻm.»** |
| Kurs `0` | Kurs maydoni qizil chegara oladi, tagida: **«Kurs notoʻgʻri»**. Kurs saqlanmaydi (0049) |
| Kursda kasr | Kasr belgisi maydonga tushmaydi. Kasrli matn yopishtirilsa kasr qismi kesiladi (`12 500,25` → `12 500`) va maydon ostida yordam matni: **«Kurs butun soʻmda — kasr qismi olib tashlandi.»** Xato emas (0042) |
| Kursga harf yoki belgi terilsa | Raqam boʻlmagan belgi maydonga tushmaydi; xato matni chiqmaydi |
| «≈ jami soʻmda» texnik chegaradan oshsa | ≈ qatori oʻrnida bir qator (`mayda`, `chiqim`): **«Taxminiy jami hisoblanmadi — summalar juda katta.»** Qolgan hamma raqam joyida turadi. Bu mahsulot chegarasi emas, xavfsiz butun son chegarasi (`prds/kirim-chiqim.md` 1a1); kundalik summalarda hech qachon koʻrinmaydi |

Kurs matnlari `design/kirim-chiqim.md` va `design/qarz-daftari.md` dagi bilan **aynan bir
xil** — bitta holat bitta matn bilan aytiladi, maydon qaysi ekranda boʻlishidan qatʼi nazar.

---

## 10. Nima qoʻyilmaydi

- PDF, CSV, rasm, ulashish tugmasi va «chop etish» (0021).
- Oʻtgan oy bilan solishtirish, oʻsish foizi, «oʻtgan oydan koʻp» degan belgi (0019).
- Grafik, diagramma, doira, ustunlar (uslub: grafik yoʻq).
- Qidiruv, filtr, saralash tugmasi; kategoriya boʻyicha yozuvlar roʻyxatiga oʻtish
  (0002, 0064).
- Budjet chegarasi va undan oshganda ogohlantirish (0002).
- Hisob (naqd/karta) boʻyicha ajratma — hisobot mazmuni 0019 da sanalgan, unda hisob yoʻq;
  hisob qoldiqlari dashboardda (0036).
- Kategoriya qatorlarida «≈ jami soʻmda» yoki valyutalarni qoʻshib bitta raqam qilish (0038).
- «Oy yopish», «hisobotni saqlash», «hisobot tarixi» (0014).
- Kurs tarixi va kursni internetdan olish (0002, 0010).
- Hisobot ichidan yozuv tahrirlash yoki oʻchirish — bu «Yozuvlar» ekranining ishi (0032).

---

## 11. Savollar — hammasi yopilgan

Bu tavsif yozilganda uchta savol ochilgan edi. Uchalasi ham **0064** bilan hal qilindi
(0058 vakolati).

Toʻrtinchi savol 0068 redesignida chiqdi va oʻsha yerda yopildi: boʻsh daftar holatining
ikkinchi qatori 0063 dan qolgan matnda turib, olib tashlangan «Yozuv» boʻlimiga ishora
qilardi — matn tuzatildi, tafsiloti 8-boʻlim «b» bandida.

| # | Savol | Javob | Qayerda yozilgan |
|---|---|---|---|
| 1 | «Oldim» qarzlari va ularga toʻlangan toʻlovlar hisobotda koʻrinadimi? | Ha — «Qarz» blokida toʻrtta yoʻnalish | 5-boʻlim, «Qatorlar — toʻrtta yoʻnalish» |
| 2 | Boshqa valyutadagi qarz toʻlovi qaysi summa bilan sanaladi? | Kiritilgan summa, oʻz valyutasida; aylantirilgan qiymat hisobotga kirmaydi | 5-boʻlim va 6-boʻlim 5b-qoida |
| 3 | Kategoriya qatori bosilsa nima boʻladi? | Hech narsa — qator bosilmaydi | 4-boʻlim, 7-boʻlim, 10-boʻlim |

Uchalasining bir ildizi bor: hisobot **pul harakatini** koʻrsatadi va har raqami qoʻlda qayta
sanaladigan boʻlishi kerak (6-boʻlim). Shuning uchun qarzning ikkala yoʻnalishi ham koʻrinadi,
toʻlov esa haqiqatan qimirlagan summa bilan sanaladi.
