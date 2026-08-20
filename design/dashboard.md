# Bosh sahifa (dashboard) — ekran

Sana: 2026-08-20. Asos: `prds/dashboard.md`, `specs/001-dashboard/spec.md`. Rang, oʻlcham
va boʻshliq — `design/uslub.md` (bu yerda ular nom bilan ataladi: `matn-ikkinchi`,
`kartochka`, `asosiy tugma`). Naqsh — `design/kirim-chiqim.md` (roʻyxat qatori) va
`design/oylik-hisobot.md` (kurs soʻrovi, taxminiy jami): oʻsha qoidalar bu yerda
takrorlanmaydi, faqat farqi yoziladi.
Qarorlar: 0006, 0011, 0017, 0018, 0020, 0023, 0024, 0026, 0032, 0035, 0036, 0042, 0043,
0044, 0045, 0053, 0054, 0067, 0068.

Bitta ekran: **Daftar** (navigatsiyadagi nomi — «Bosh»). Ilova shu ekran bilan ochiladi:
parol ham, PIN ham soʻralmaydi (0006). Ichida forma yoʻq, oʻchirish yoʻq, tahrirlash
yoʻq — bosh sahifa faqat koʻrsatadi va bitta ish boshlaydi: **«＋ Yozuv»**.

Ekrandagi matnlar shu faylda aynan yozilgan — frontend oʻshani koʻchiradi, oʻzgartirmaydi.

**Navigatsiya:** ekran navigatsiyaning oʻz boʻlimi (**«Bosh»**), shuning uchun yuqorida
«‹ Orqaga» havolasi yoʻq. Ilova ochilganda ham, «Bosh» bandi bosilganda ham shu ekran
koʻrinadi.

**Bosh sahifa hech narsa saqlamaydi.** Har raqam ekran ochilganda joriy maʼlumotdan qayta
hisoblanadi: yozuv qoʻshilsa, tahrirlansa yoki oʻchirilsa qoldiq va oy yigʻindilari darhol
yangi qiymatni koʻrsatadi (0045; 10-mezon).

---

## 1. Ekranning tuzilishi

Yuqoridan pastga, bitta ustunda:

1. **Sarlavha** — **«Daftar»**, chapga tekis (`sarlavha` roli, Space Grotesk 600). Yuqori
   panelning foni va ostidagi chizigʻi **yoʻq**: sarlavha oq varaqda turadi.
   **Nega:** bu ilovaning bosh sahifasi, ichkari ekran emas — panel oʻrniga sahifa
   sarlavhasi mos keladi va u HEAD ning katta display tipografiyasi uchun joy ochadi.
2. **Zaxira eslatmasi** — sharti bajarilsa (2-boʻlim).
3. **«Qoldiq» kartochkasi** (3-boʻlim).
4. **«Joriy oy» kartochkasi** (4-boʻlim).
5. **«Oxirgi yozuvlar» kartochkasi** (5-boʻlim).
6. Oxirida boʻsh joy: asosiy tugma paneli 72 px + navigatsiya paneli 56 px + pastki
   xavfsiz zona.

Pastda yopishib turgan panelda bitta asosiy tugma: **«＋ Yozuv»**.

### Mobil (390 px)

```
┌──────────────────────────────────────────┐
│                                          │
│  Daftar                                  │  sarlavha, Space Grotesk 600, 24–26 px
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Daftar hali zaxira qilinmagan —      │ │  eslatma: yuza-past, r16, kichik
│ │ «Zaxira» boʻlimidan eksport qiling.  │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Qoldiq                               │ │  kartochka-sarlavha (Grotesk 500/17)
│ │                                      │ │
│ │ 1 200 000 soʻm                       │ │  raqam-katta (Grotesk 600, 30–40)
│ │ 100,00 $                             │ │  summa (mono 700) — dollar boʻlsa
│ │                                      │ │
│ │ NAQD                    900 000 soʻm │ │  yorliq (mono 13) · summa (mono 700)
│ │                             100,00 $ │ │
│ │ KARTA                   300 000 soʻm │ │
│ │ ─────────────────────────────────────│ │  soch chizigʻi
│ │ ≈ 2 450 000 soʻm                     │ │  matn, neytral rang
│ │ taxminiy · 1 $ = 12 500 soʻm         │ │  mayda, matn-ikkinchi
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Joriy oy                             │ │
│ │ KIRIM                 +8 000 000 soʻm│ │  mono 700, kirim rangi
│ │ CHIQIM                −2 950 000 soʻm│ │  mono 700, chiqim rangi
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Oxirgi yozuvlar          Hammasi ›   │ │  sarlavha + matn-havola
│ │ oziq-ovqat              −45 000 soʻm │ │
│ │ Karta · nonushta                     │ │
│ │ ─────────────────────────────────────│ │
│ │ oylik                +8 000 000 soʻm │ │
│ │ Karta                                │ │
│ └──────────────────────────────────────┘ │
│                                          │
├──────────────────────────────────────────┤
│ [        ＋ Yozuv  (koʻk pill)         ] │  panel-past, 72 px
├──────────────────────────────────────────┤
│  Bosh   Yozuvlar  Qarz   Hisobot  Zaxira │  navigatsiya, 56 px
│  ▔▔▔▔                                    │  faol: tint pill + siyoh 600
└──────────────────────────────────────────┘
```

Yorliqlar (`NAQD`, `KARTA`, `KIRIM`, `CHIQIM`) sxemada bosh harf bilan koʻrsatilgan —
**ekranda ular «Naqd», «Karta», «Kirim», «Chiqim» boʻlib, oʻz yozilishida qoladi**
(`design/uslub.md`: yorliqlar katta harfga oʻgirilmaydi). Sxemadagi katta harf faqat mono
yorliq rolini koʻrsatadi.

### Desktop (1280 px, `≥960`)

Ustun eni 1040 px, markazda; navigatsiya yuqorida pill boʻlib turadi; pastdagi tugma
paneli yoʻq — «＋ Yozuv» sarlavha qatorining oʻng chekkasida.

```
        ┌───────────────────────────────────────────────────┐
        │  Bosh   Yozuvlar   Qarz daftari   Hisobot  Zaxira │  pill nav, fixed top
        └───────────────────────────────────────────────────┘

  Daftar                                        [ ＋ Yozuv ]     ← sarlavha 32 px + koʻk pill
  ┌──────────────────────────────────────────────────────────┐
  │ Daftar hali zaxira qilinmagan — «Zaxira» boʻlimidan …    │   ikki ustunni qamraydi
  └──────────────────────────────────────────────────────────┘
  ┌────────────────────────────┐  ┌──────────────────────────┐
  │ Qoldiq                     │  │ Joriy oy                 │
  │                            │  │ Kirim    +8 000 000 soʻm │
  │ 1 200 000 soʻm             │  │ Chiqim   −2 950 000 soʻm │
  │ 100,00 $                   │  └──────────────────────────┘
  │                            │  ┌──────────────────────────┐
  │ Naqd     900 000 soʻm      │  │ Oxirgi yozuvlar Hammasi ›│
  │              100,00 $      │  │ oziq-ovqat  −45 000 soʻm │
  │ Karta    300 000 soʻm      │  │ Karta · nonushta         │
  │ ───────────────────────────│  │ ─────────────────────────│
  │ ≈ 2 450 000 soʻm           │  │ oylik    +8 000 000 soʻm │
  │ taxminiy · 1 $ = 12 500 s. │  │ Karta                    │
  └────────────────────────────┘  └──────────────────────────┘
```

**Nega chapda «Qoldiq» yolgʻiz turadi:** u ekranning yagona katta raqami va unga eng koʻp
joy kerak; oʻng ustunda esa ikkita qisqa blok ustma-ust sigʻadi. Roʻyxat qatorlari 1040 px
ga choʻzilmaydi — ular oʻng ustunning ichida qoladi va kategoriya bilan summa orasi
oʻqiladigan masofada turadi.

---

## 2. Zaxira eslatmasi (0024, 0067)

### Nima koʻrinadi

Sarlavha ostida, birinchi kartochkadan yuqorida — **bir qatorlik matn**, ikki holatdan
biri:

| Holat | Matn |
|---|---|
| Daftar hech qachon eksport qilinmagan | **«Daftar hali zaxira qilinmagan — «Zaxira» boʻlimidan eksport qiling.»** |
| Oxirgi eksportdan 30 kun yoki koʻproq oʻtgan | **«Oxirgi zaxiradan 30 kun oʻtdi — «Zaxira» boʻlimidan yangisini oling.»** |

Shart bajarilmasa qator umuman chizilmaydi va oʻrniga hech narsa qoʻyilmaydi.

Koʻrinishi: foni `yuza-past`, radiusi 16 px, ichki chekkasi 12/16 px, matni `kichik` +
`matn-ikkinchi`. **Bosilmaydi** (0067): tugma emas, havola emas, kursor oʻzgarmaydi.
Qizil rang, sariq rang, ogohlantirish belgisi va ikonka yoʻq — yoʻlni matnning oʻzi
aytadi («Zaxira» boʻlimi navigatsiyada koʻrinib turadi).

**Nega bosilmaydi:** eslatma — xabar, harakat emas. Bosiladigan qilinsa u ekranning
ikkinchi koʻk momenti boʻlib qolardi va «＋ Yozuv» bilan raqobatlashardi.

---

## 3. «Qoldiq» kartochkasi

### Nima koʻrinadi

Kartochka sarlavhasi: **«Qoldiq»**. Ostida uch qavat:

**a) Umumiy qoldiq.**

- 1-qator — soʻm qoldigʻi, `raqam-katta` rolida: `1 200 000 soʻm`. **Har doim chiziladi**,
  nol boʻlsa ham (`0 soʻm`).
- 2-qator — dollar qoldigʻi, `summa` rolida (mono 700): `100,00 $`. Faqat daftarda dollar
  qatnashganda: naqd yoki karta dollar qoldigʻi noldan farq qilsa.
  **Nega netto emas, qatnashuv:** naqdda `+100 $`, kartada `−100 $` boʻlsa umumiy netto
  nol, lekin dollar daftarda bor — qator yoʻqolib qolmasligi kerak.

**Ishora va rang.** Qoldiq raqamlari `+` olmaydi va rang olmaydi (`matn`): qoldiq kirim
ham, chiqim ham emas — u holat. Manfiy qoldiqda oldida `−` turadi:
`−45 000 soʻm` (`design/uslub.md`, «Qoldiq — holat, harakat emas»).

**b) Hisob boʻyicha ajratma** (0036; 12a-mezon). Ikkita qator, shu tartibda:

| Yorliq (`yorliq`, mono) | Oʻngda |
|---|---|
| **«Naqd»** | oʻsha hisobning qoldiqlari, valyuta boʻyicha ustma-ust |
| **«Karta»** | oʻsha hisobning qoldiqlari, valyuta boʻyicha ustma-ust |

- Soʻm qatori **har doim** chiziladi (nol boʻlsa ham).
- Dollar qatori faqat oʻsha hisobda dollar qoldigʻi noldan farq qilsa (12c-mezon).
- Naqd va karta yigʻindisi umumiy qoldiqqa har doim teng (12b-mezon) — qarz ham hisobga
  bogʻlangani uchun (0035).

**c) «≈ jami soʻmda» qatori** — faqat dollar qatnashganda (0023):

- 1-qator: **«≈ 2 450 000 soʻm»** — `matn` oʻlchami, rangi **`matn`** (neytral).
- 2-qator: **«taxminiy · 1 $ = 12 500 soʻm»** — `mayda`, `matn-ikkinchi`.

Qoidalar `design/oylik-hisobot.md` 3-boʻlimidagi bilan **aynan bir xil**: qaysi kurs
olinishi (0044), qiymat saqlanmasligi (0045), rangning neytralligi. Farqi bittagina —
bu yerda qator qoldiqdan hisoblanadi, hisobot davridan emas.

Ajratma bilan «≈» qatori orasida 1 px `chegara` chizigʻi turadi — taxminiy raqam haqiqiy
raqamlardan ajralib tursin.

### Kurs soʻrash bloki

Daftarda birorta ham kurs boʻlmasa (na kursli yozuv, na kursli toʻlov, na qoʻlda
soʻralgan kurs), ilova taxminiy jamini hisoblashdan oldin kursni soʻraydi (0023, 0043;
14-mezon). Blok aynan «≈ jami soʻmda» qatori turadigan joyda ochiladi — alohida oyna
yoʻq.

Ichida (`design/oylik-hisobot.md` 3-boʻlimidagi blokning aynan oʻzi):

1. Qator (`mayda`, `matn-ikkinchi`): **«Taxminiy jamini koʻrsatish uchun kurs kerak.»**
2. Kurs maydoni — yorligʻi **«Kurs — 1 dollar necha soʻm»**, ichida namuna `12 500`.
3. Oʻngda asosiy tugma **«Saqlash»**.

Kurs saqlangach blok yoʻqoladi va «≈» qatori darhol chiqadi; soʻrov qaytarilmaydi —
ilova qayta ochilganda ham soʻralmaydi va kurs zaxira fayliga kiradi (0043; 14a-mezon).

---

## 4. «Joriy oy» kartochkasi

Kartochka sarlavhasi: **«Joriy oy»**. Ichida ikkita qator:

| Yorliq | Nima sanaladi | Ishora va rang |
|---|---|---|
| **«Kirim»** | joriy kalendar oydagi kirim yozuvlari yigʻindisi | `+8 000 000 soʻm`, `kirim` |
| **«Chiqim»** | joriy kalendar oydagi chiqim yozuvlari yigʻindisi | `−2 950 000 soʻm`, `chiqim` |

- **Valyuta boʻyicha alohida, taxminsiz** (0038 ruhi): ikkala valyutada ham yozuv boʻlsa
  bitta yorliq ostida ikkita qator turadi (avval soʻm, keyin dollar).
- Oʻsha turda umuman yozuv boʻlmasa bitta `0 soʻm` qatori turadi — ishorasiz, rangi
  `matn`. Kartochka hech qachon qatorsiz qolmaydi (2-mezon).
- **«Joriy oy» — kalendar oy** (0018; 12-band): ayning 1-sanasidan oxirgi sanasigacha.
  Oʻtgan oydagi yozuv bu raqamlarga qoʻshilmaydi (9-mezon).
- **Qarz harakati bu yerga kirmaydi** (0017): qarz pul qoldigʻiga taʼsir qiladi, lekin oy
  koʻrsatkichi faqat yozuvlardan chiqadi — hisobotdagi qoidaning aynan oʻzi.
- «≈ jami soʻmda» bu kartochkada **yoʻq** (0038).

---

## 5. «Oxirgi yozuvlar» kartochkasi

### Nima koʻrinadi

Sarlavha qatori: chapda **«Oxirgi yozuvlar»**, oʻngda matn-havola **«Hammasi ›»**.
Roʻyxat boʻsh boʻlsa havola chizilmaydi.

Ostida — eng koʻpi **5 ta** yozuv (0067), eng yangisi yuqorida. Tartib «Yozuvlar»
ekranidagidek: sana boʻyicha, bir xil sanada `yaratilgan` boʻyicha oxirgi kiritilgani
yuqorida (0047).

Har qator (`design/kirim-chiqim.md` 2-boʻlimidagi qator naqshi, ikki farq bilan):

- chapda 1-qator — kategoriya nomi (`matn-kuchli`);
- chapda 2-qator (`kichik`, `matn-ikkinchi`) — hisob nomi va izoh, orasida ` · `
  (`Karta · nonushta`). Izoh boʻsh boʻlsa faqat hisob nomi. Uzun izoh bir qatorda
  kesiladi va oxirida `…` qoʻyiladi;
- oʻngda summa (`summa` roli, mono 700): `−45 000 soʻm` (`chiqim`) yoki `+12,50 $`
  (`kirim`).

Ikki farq:

1. **Qatorlar bosilmaydi** (0067; PRD 15a): tahrirlash yoʻli faqat «Yozuvlar» ekranida.
   Qator bosiladigan koʻrinishga ham keltirilmaydi — fon oʻzgarmaydi, kursor oʻzgarmaydi.
2. **Kun sarlavhasi yoʻq.** Beshta qator uchun kun boʻlinishi ortiqcha; sana bu yerda
   umuman koʻrsatilmaydi — «oxirgi» soʻzi tartibni oʻzi aytadi.

Qatorlar orasida chiziq **yoʻq** — ular boʻshliq bilan ajraladi (`design/uslub.md` →
«Kartochka»: kartochkaning oʻzi chegarali, ichida ham chiziq boʻlsa ekran katakchaga
aylanadi). Chiziqli qator naqshi kartochkasiz roʻyxatlarga tegishli («Yozuvlar» ekrani).

---

## 6. Nima bosiladi va keyin nima boʻladi

| Nima bosiladi | Keyin nima boʻladi |
|---|---|
| **«＋ Yozuv»** | «Yangi yozuv» formasi ochiladi (`design/kirim-chiqim.md` 1-boʻlim). Forma yopilganda — `×` bilan ham, «Saqlash» bilan ham — **bosh sahifaga** qaytadi va yangi yozuv «Oxirgi yozuvlar» da darhol koʻrinadi (19-mezon) |
| **«Hammasi ›»** | «Yozuvlar» ekrani ochiladi (20-mezon) |
| Kurs blokidagi **«Saqlash»** | 3-boʻlim |
| Zaxira eslatmasi | Hech narsa boʻlmaydi — qator bosilmaydi (0067) |
| «Oxirgi yozuvlar» qatori | Hech narsa boʻlmaydi — qator bosilmaydi (0067) |
| «Qoldiq» va «Joriy oy» qatorlari | Hech narsa boʻlmaydi |
| Navigatsiyadagi **«Bosh»** | Shu ekranda qolinadi |

Bu ekranda **oʻchirish, tahrirlash va ulashish yoʻq** — shuning uchun «qaytarish» paneli
ham hech qachon chiqmaydi.

---

## 7. Boʻsh holatlar

**a) Daftar butunlay boʻsh (hali bitta ham yozuv yoʻq).**

- **«Qoldiq»** kartochkasi oʻz joyida turadi: `0 soʻm`, «Naqd» `0 soʻm`, «Karta»
  `0 soʻm`. Dollar qatori chizilmaydi, «≈» qatori chizilmaydi, kurs soʻralmaydi
  (2-mezon: raqamlar nol boʻlib koʻrinadi va ekran xato bermaydi).
- **«Joriy oy»** kartochkasi turadi: «Kirim» `0 soʻm`, «Chiqim» `0 soʻm`.
- **«Oxirgi yozuvlar»** kartochkasi ichida ikkita qator, markazda:
  - `matn-kuchli`: **«Hali bitta ham yozuv yoʻq.»**
  - `kichik`, `matn-ikkinchi`: **«Birinchi yozuvni pastdagi «＋ Yozuv» tugmasi bilan
    qoʻshasiz.»**

  «Hammasi ›» havolasi bu holatda chizilmaydi.
- **Zaxira eslatmasi koʻrinadi** — boʻsh daftar ham hech qachon eksport qilinmagan
  (15-mezon).

**Nega boʻsh ekran emas, nol raqam:** 2-mezon aynan nol raqamlarni koʻrishni talab
qiladi. Kartochkalar oʻz joyida qolgani uchun birinchi yozuvdan keyin ekran shakli
oʻzgarmaydi — odam nima qayerda turishini bir marta oʻrganadi.

**b) Yozuv bor, lekin joriy oyda yoʻq.** «Joriy oy» ikkala qatorda ham `0 soʻm`
koʻrsatadi; «Qoldiq» va «Oxirgi yozuvlar» toʻliq ishlaydi.

**c) Yozuv beshtadan kam.** Nechta boʻlsa shuncha qator chiziladi; boʻsh qator
qoʻyilmaydi. «Hammasi ›» havolasi baribir turadi.

**d) Faqat qarz harakati bor (yozuv yoʻq).** «Qoldiq» qarz taʼsirini koʻrsatadi (5- va
6-mezonlar), «Joriy oy» `0 soʻm` boʻlib qoladi, «Oxirgi yozuvlar» boʻsh holatda
turadi — qarz operatsiyasi yozuv emas (0032).

---

## 8. Xato holatlari

Bu ekranda kiritiladigan narsa **bittagina** — kurs. Xato uslubi umumiy qoida boʻyicha
(maydon 2 px `chiqim` chegara, tagida `mayda` `chiqim` rangli matn).

| Holat | Odam nimani koʻradi |
|---|---|
| Kurs maydoni boʻsh, «Saqlash» bosilgan | Kurs maydoni qizil chegara oladi, tagida: **«Kursni kiriting — 1 dollar necha soʻm.»** |
| Kurs `0` | Kurs maydoni qizil chegara oladi, tagida: **«Kurs notoʻgʻri»**. Kurs saqlanmaydi (0049) |
| Kursda kasr | Kasr belgisi maydonga tushmaydi. Kasrli matn yopishtirilsa kasr qismi kesiladi (`12 500,25` → `12 500`) va maydon ostida yordam matni: **«Kurs butun soʻmda — kasr qismi olib tashlandi.»** Xato emas (0042; 14b-mezon) |
| Kursga harf yoki belgi terilsa | Raqam boʻlmagan belgi maydonga tushmaydi; xato matni chiqmaydi |
| «≈ jami soʻmda» texnik chegaradan oshsa | «≈» qatori oʻrnida bir qator (`mayda`, `chiqim`): **«Taxminiy jami hisoblanmadi — summalar juda katta.»** Qolgan hamma raqam joyida turadi |

Matnlar `design/kirim-chiqim.md` va `design/oylik-hisobot.md` dagi bilan **aynan bir
xil** — bitta holat bitta matn bilan aytiladi, maydon qaysi ekranda boʻlishidan qatʼi
nazar.

**Boshqa xato holati yoʻq:** maʼlumot qurilmaning oʻzida (0004), tarmoq soʻrovi yoʻq,
shuning uchun «yuklanmadi» turdagi holat qurilmaydi. Kutish aylanasi ham yoʻq.

---

## 9. Responsive

| Qatlam | Nima oʻzgaradi |
|---|---|
| Baza (320–599) | Bitta ustun, yon chekka 16 px. Kartochkalar ustma-ust, orasi 16 px. «＋ Yozuv» — pastda yopishgan panelda, eni toʻliq. Navigatsiya pastda |
| `≥600` | Ustun 640 px, markazda; yon chekka 24 px. **«Naqd»/«Karta» qatorlari ikki ustunga** boʻlinadi (yorliq va summa oʻz ustunida qoladi), **«Kirim»/«Chiqim» ham** shunday. Qolgani oʻzgarmaydi |
| `≥960` | Ustun 1040 px. Navigatsiya yuqorida pill. Sarlavha qatori: chapda «Daftar» (32 px), oʻngda «＋ Yozuv» pill — pastdagi panel yoʻqoladi. Kartochkalar ikki ustun: chapda «Qoldiq», oʻngda «Joriy oy» va «Oxirgi yozuvlar» ustma-ust. Eslatma ikkala ustunni qamraydi |

Kurs soʻrovi bloki hamma qatlamda «≈» qatorining oʻrnida ochiladi: `≥600` da maydon va
tugma bitta qatorda, bazada ham bitta qatorda (maydon choʻziladi, tugma mazmuni boʻyicha).

---

## 10. Nima qoʻyilmaydi

- Kirish ekrani, PIN yoki parol (0006).
- Qarz qoldigʻini alohida raqam sifatida koʻrsatish (PRD 28; 0020, 11-mezon).
- Yozuvlar boʻyicha qidiruv, filtr va saralash (0002).
- Budjet chegarasi va undan oshganda ogohlantirish (0002).
- Oʻtgan oy bilan solishtirish, oʻsish foizi, strelka (0019).
- Grafik, diagramma, doira, ustunlar (uslub).
- Bildirishnoma va push xabar — zaxira eslatmasi faqat ekrandagi qator (0003, 0024).
- Kursni internetdan olish (0010).
- Bosh sahifadagi qatordan yozuvni tahrirlash yoki oʻchirish (0067, 0032) — shuning uchun
  bu ekranda «qaytarish» paneli ham yoʻq.
- Salomlashish matni, foydalanuvchi nomi, avatar, sana-vaqt qatori (specda yoʻq).
- Kutish aylanasi va «skeleton» (0004; uslub).

---

## 11. Savollar

**Ochiq savol yoʻq.** Spec (`prds/dashboard.md`) yozilganda chiqqan yagona savol —
naqd va karta qoldiqlari qayerda koʻrinadi — **0036** bilan hal qilingan: umumiy qoldiq
tagida alohida qatorlarda (3-boʻlim, «b» bandi).
