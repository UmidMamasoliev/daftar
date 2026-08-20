# Uslub — rang va shakl qoidalari (v2, HEAD_WEB)

Sana: 2026-08-20. Asos: `prds/daftar-prd.md`, qarorlar 0003, 0009, 0011, 0017, 0023, 0026,
0033, 0034, 0038, 0042, 0044, 0047, 0067, **0068**.
Dizayn tizimi manbai: HEAD_WEB handoff (`brand/README.md`, `brand/colors_and_type.css`,
`brand/ui_kits/website/kit.css`). Tokenlar nusxasi: `design/redesign/head-tokenlar.css`.

Bu fayl butun daftar uchun bitta joyda turadi: har ekranda rang, oʻlcham va boʻshliq
qaytadan oʻylanmaydi. Ekran tavsiflari (`design/dashboard.md`, `design/kirim-chiqim.md` va
keyingilari) shu yerdagi nomlarga tayanadi. Ekran joylashuvlarining ekran-ma-ekran
tafsiloti — `design/redesign/layout.md`.

**v1 dan farqi faqat koʻrinishda.** Ekran matnlari, xulq, oqim va mezonlar oʻzgarmaydi
(0068): 1066 Vitest va 12 Playwright testi yashil qoladi. Rang, shrift, shakl, boʻshliq va
joylashuv oʻzgaradi.

---

## Asos

- **Oq varaq.** Ekranning foni oq (`#FFFFFF`). Tuzilishni soya emas, **soch chizigʻi**
  (1 px `#E6E8EC`) va boʻshliq koʻrsatadi. Daftar — qogʻoz varaq; kulrang fon olib
  tashlandi.
  **Nega:** HEAD_WEB ning asosiy maydoni oq; kulrang fonda oq kartochka «quti» boʻlib
  qoladi, oq varaqda esa raqamlar oʻzi koʻrinadi.
- **Bitta toʻq blok.** Toʻq rang butun ilovada bitta joyda: «qaytarish» paneli
  (`#0B1330` ink-navy). Boshqa toʻq blok qoʻshilmaydi.
- **Bitta koʻk moment.** Toʻldirilgan elektr-koʻk (`#0029FF`) har ekranda **bittagina**
  boʻladi — ekranning asosiy tugmasi. Koʻkning matn koʻrinishi (havola) va tinti
  (tanlangan chip, fokus halqasi) — ruxsat, ular «punch» emas (HEAD qoidasi 1).
- **Mobil-birinchi, lekin toʻliq responsive.** Eng tor qurilma — 320 px. Uch qatlam:
  baza (320–599), `≥600`, `≥960`. Tafsilot — «Responsive» boʻlimi.
- **Barmoq oʻlchami.** Bosiladigan har narsa kamida 44 × 44 px.
- **Uchta shrift, oʻzimizniki.** Space Grotesk (sarlavha va katta raqam), Hanken Grotesk
  (matn), Space Mono (yorliq va **pul summalari**). Fayllar `platform/public/fonts/` da,
  CDN yoʻq (0003 → 0068/4-band).
- **Ikonka kutubxonasi yoʻq.** Sanoqli Lucide shakli inline SVG boʻlib qoʻyiladi —
  toʻrtta belgi, boshqa yoʻq («Ikonka siyosati»).
- **Bitta mavzu.** Yorugʻ. Tungi rejim va mavzu tanlash qurilmaydi (specda yoʻq).
- **Animatsiya kam.** Faqat rang/soʻnish oʻtishi. Ekran almashishida sirpanish yoʻq.
- **Gradient yoʻq, emoji yoʻq, rasm yoʻq.**
- **Til.** Ekrandagi hamma matn oʻzbekcha, lotin yozuvida (0009). Matnlar ekran
  tavsiflarida aynan yozilgan — frontend oʻsha yerdan koʻchiradi.
- **HEAD logotipi ishlatilmaydi** (0068/7): bu «Daftar» mahsulotining ekrani. «Daftar»
  soʻzi Space Grotesk 600 bilan yoziladi, slashed-A ga taqlid qilinmaydi.

---

## Tokenlar

CSS oʻzgaruvchilari `platform/src/index.css` da bir marta belgilanadi. Nomlar oʻzbekcha
qoladi (eski nomlar saqlanadi — sinf nomlari va kod tegilmasin), qiymatlar HEAD dan olinadi.

### Rang

| CSS nomi | Yangi qiymat | HEAD manbai | Eski qiymat | Qayerda ishlatiladi |
|---|---|---|---|---|
| `--fon` | `#FFFFFF` | `--white` | `#F4F5F7` | ekranning umumiy foni |
| `--yuza` | `#FFFFFF` | `--white` | `#FFFFFF` | kartochka, maydon, roʻyxat qatori, panel |
| `--yuza-past` | `#F3F5F9` | `--bg-tint` | — (yangi) | nav faol bandi, oʻchiq maydon, eslatma bloki, segment yoʻlagi |
| `--chegara` | `#E6E8EC` | `--line` | `#E3E5E8` | soch chizigʻi: kartochka chegarasi, qatorlar orasi |
| `--chegara-kuchli` | `#D7DAE1` | `--line-2` | — (yangi) | ikkinchi tugma va tanlanmagan chip chegarasi (1.5 px) |
| `--matn` | `#0A0B0D` | `--ink` | `#1A1D21` | asosiy matn va raqamlar |
| `--matn-ikkinchi` | `#4A4F59` | `--fg2` | `#6B7280` | izoh, hisob nomi, kun sarlavhasi, yordam matni |
| `--matn-ochiq` | `#868D99` | `--fg3` | `#9CA3AF` | **faqat** namuna matn (placeholder) va oʻchiq boshqaruv |
| `--harakat` | `#0029FF` | `--navy` | `#1D4ED8` | asosiy tugma foni, havola, fokus, tanlangan chip matni |
| `--harakat-toq` | `#0020CC` | `--navy-700` | — (yangi) | asosiy tugmaning bosilgan/hover holati |
| `--harakat-fon` | `#EBEEFF` | `--navy-tint` | `#EFF4FF` | tanlangan chip foni, fokus halqasi |
| `--kirim` | `#00803F` | `--positive` toʻqlashtirilgani | `#15803D` | kirim summasi, «Kirim» segmenti, «olaman» netto |
| `--kirim-yorqin` | `#19E07A` | `--positive` | — (yangi) | **faqat toʻq fonda**; hozircha ishlatilmaydi |
| `--chiqim` | `#D92020` | `--danger` toʻqlashtirilgani | `#B42318` | chiqim summasi, «Chiqim» segmenti, xato, oʻchirish |
| `--chiqim-yorqin` | `#FF2D2D` | `--danger` | — (yangi) | **faqat toʻq fonda**; hozircha ishlatilmaydi |
| `--qora-panel` | `#0B1330` | `--ink-navy` | `#1A1D21` | «qaytarish» pastki paneli foni |
| `--panel-matn-ikkinchi` | `#B9C2DC` | `--fg-onnavy-2` | — (yangi) | toʻq paneldagi ikkinchi matn (zaxira) |

**Semantik ranglar nega toʻqlashtirildi.** HEAD ning `#19E07A` va `#FF2D2D` ranglari toʻq
fon uchun tanlangan: oq fonda ular mos ravishda 1.7:1 va 3.9:1 — matn uchun WCAG AA
(4.5:1) yetmaydi. Ohang (rang toni) saqlanib, yorqinlik tushirildi: `#00803F` — 5.0:1,
`#D92020` — 5.0:1. Oq matn ularning ustida ham 5.0:1 (segment). Yorqin variantlar
tokenlarda qoladi va **faqat** ink-navy fonda ishlatiladi; oq fonda ular hech qayerda
qoʻyilmaydi.

**`--matn-ochiq` matn tashimaydi.** `#868D99` oq fonda 3.3:1 — oddiy matn uchun AA
yetmaydi. Shuning uchun u faqat namuna matn va oʻchiq boshqaruv uchun (ikkalasi ham WCAG
kontrast talabidan istisno). **Yashirilgan kategoriya nomi** (`.ochiq-rang`) endi
`--matn-ikkinchi` bilan yoziladi: yashirilganlik allaqachon ikkita belgi bilan aytiladi —
«Yashirilgan» sarlavhasi va «Koʻrsatish» tugmasi; rang faqat tinchroq boʻlishi kerak,
oʻqilmas emas.

Kontrastlar (oq fonda): `--matn` 19.9:1, `--matn-ikkinchi` 8.2:1, `--harakat` 7.6:1,
`--kirim` 5.0:1, `--chiqim` 5.0:1. `--matn-ikkinchi` `--yuza-past` ustida 7.5:1.

Boshqa rang qoʻshilmaydi.

### PWA va brauzer ranglari

| Nom | Qiymat | Oʻzgardimi | Qayerda |
|---|---|---|---|
| `theme-color` | `#FFFFFF` | **yoʻq** | brauzer paneli; manifest `theme_color` va sahifadagi `<meta name="theme-color">` — aynan bitta qiymat |
| `background_color` | `#FFFFFF` | **ha** (`#F4F5F7` edi) | manifestdagi ochilish (splash) ekrani foni |

**Nega `background_color` oʻzgaradi:** ekranning umumiy foni endi oq. Splash kulrang
qolsa, ilova ochilganda kulrangdan oqqa sakrash koʻrinadi. Ikkala qiymat ham `#FFFFFF`
boʻlgach chok qolmaydi.

### Shrift

| CSS nomi | Qiymat |
|---|---|
| `--shrift-sarlavha` | `'Space Grotesk', 'Hanken Grotesk', system-ui, sans-serif` |
| `--shrift-matn` | `'Hanken Grotesk', system-ui, -apple-system, sans-serif` |
| `--shrift-mono` | `'Space Mono', ui-monospace, 'SFMono-Regular', monospace` |

Uchta rol, HEAD qoidasi 2 boʻyicha: **display** (Space Grotesk) — sarlavha va yagona katta
raqam; **matn** (Hanken Grotesk) — hamma oʻqiladigan matn; **mono** (Space Mono) — yorliq
va **pul summalari**.

**Yorliqlar BOSH HARFGA oʻgirilmaydi.** HEAD eyebrow'i `text-transform: uppercase` bilan
keladi, bizda yoʻq.
**Nega:** oʻzbek lotinidagi `oʻ` va `gʻ` katta harfga toʻgʻri oʻgirilmaydi («soʻm» →
«SOʻM»), yorliqlarning yarmida shu harflar bor va matnlar 0068 bilan muzlatilgan. Mono
oilaning oʻzi «hisob-kitob» ohangini tashiydi; harf katta-kichikligi shart emas. Tracking
`+0.06em` qoʻyiladi — mono his qoladi, soʻz oʻqiladi.

**Pul summalari mono.** Roʻyxat, kartochka va hisobotdagi har summa Space Mono bilan
yoziladi va oʻngga tekislanadi.
**Nega:** mono raqamlar tabiiy tabular — ustundagi summalar bir-birining ostida tik
turadi, `−` va `+` ishoralari bir chiziqda qatorlashadi. Bu daftarning **imzosi**: har
ekranning oʻng chekkasida bitta mono ustun paydo boʻladi. Yagona istisno — ekranning
yagona katta raqami (`raqam-katta`), u display shriftida (pastdagi jadval).

### Oʻlcham (matn shkalasi)

| CSS nomi | Qiymat | Oila / qalinlik / qator |
|---|---|---|
| `--t-raqam-katta` | `clamp(30px, 7.5vw, 40px)` | Space Grotesk 600 / 1.05 / `-0.03em` |
| `--t-sarlavha` | `clamp(22px, 5vw, 32px)` | Space Grotesk 600 / 1.1 / `-0.025em` |
| `--t-forma-sarlavha` | `18px` | Space Grotesk 500 / 1.2 / `-0.02em` |
| `--t-kartochka` | `17px` | Space Grotesk 500 / 1.25 / `-0.015em` |
| `--t-matn` | `16px` | Hanken Grotesk 400 / 1.5 |
| `--t-summa` | `15px` | Space Mono 700 / 1.2 |
| `--t-kichik` | `14px` | Hanken Grotesk 400 / 1.5 |
| `--t-mayda` | `13px` | Hanken Grotesk 400 / 1.45 |
| `--t-yorliq` | `13px` | Space Mono 400 / 1.3 / `+0.06em` |

13 px dan kichik matn yoʻq (v1 qoidasi saqlanadi). Maydonga teriladigan matn **16 px**
dan kichik boʻlmaydi — kichik boʻlsa iOS sahifani kattalashtirib yuboradi.

### Radius

| CSS nomi | Qiymat | HEAD | Qayerda |
|---|---|---|---|
| `--r-kartochka` | `24px` | `--r-lg` | kartochka, qarz kartochkasi, forma kartochkasi (`≥600`) |
| `--r-panel` | `16px` | `--r-md` | sahifa ichida ochiladigan blok, «qaytarish» paneli, eslatma |
| `--radius` | `10px` | `--r-sm` | maydon, summa maydoni, sana tanlagich, xavfli tugma |
| `--radius-chip` / `--r-pill` | `999px` | `--r-pill` | **hamma tugma**, chip, segment, nav bandi |

**Pill — tizimning aniqlovchi shakli** (HEAD qoidasi 3): bosiladigan hamma narsa toʻliq
yumaloq. Maydon esa 10 px — teriladigan joy tugmadan shakl bilan ajraladi.

### Soya

| CSS nomi | Qiymat | Qayerda |
|---|---|---|
| `--soya-yengil` | `0 2px 8px rgba(15, 26, 60, .06)` | pastdagi tugma paneli, desktopdagi nav pill |
| `--soya-orta` | `0 10px 30px rgba(15, 26, 60, .08)` | «qaytarish» paneli |

Soya past, yumshoq va sovuq (HEAD qoidasi 3). **Kartochkada soya yoʻq** — soch chizigʻi
yetadi. Boshqa soya qoʻshilmaydi.

### Boʻshliq

Qadam — 4 px: `--bosh-1: 4`, `--bosh-2: 8`, `--bosh-3: 12`, `--bosh-4: 16`,
`--bosh-6: 24`, `--bosh-8: 32`, **`--bosh-9: 48`** (yangi — desktopdagi bloklar orasi).

- Ekranning yon chekkasi: `--yon` — baza **16 px**, `≥600` da **24 px**, `≥960` da
  **40 px** (HEAD `.wrap` naqshi).
- Maydonlar orasi: 16 px. Bloklar orasi: 24 px. Kartochkalar orasi: 16 px (`≥960`: 24 px).
- Yorliq bilan maydon orasi: 8 px; maydon bilan xato matni orasi: 4 px.
- Chiplar orasi: 8 px (qatorlar orasi ham 8 px).
- Roʻyxat qatorining ichki chekkasi: 12 px yuqori-past, `--yon` yon.
- Kartochkaning ichki chekkasi: **20 px** (baza), `≥600` da 24 px, `≥960` da 32 px.
  **Nega kattalashdi:** HEAD ning havosi kartochka ichida koʻrinadi; 24 px radius kichik
  ichki chekka bilan «shishgan» koʻrinadi.

### Motion

| CSS nomi | Qiymat | Qayerda |
|---|---|---|
| `--tez` | `180ms` | rang, chegara, fon oʻtishlari; tugma bosilishi |
| `--normal` | `320ms` | blok ochilishi (soʻnish + 4 px koʻtarilish) |
| `--egri` | `cubic-bezier(.22, .61, .36, 1)` | hamma oʻtish |

- Sakrash (bounce), spring va cheksiz aylanma yoʻq (HEAD).
- **Ekran almashishida animatsiya yoʻq** — daftar tez ochilsin.
- `prefers-reduced-motion: reduce` boʻlsa hamma animatsiya oʻchadi (`animation: none`,
  `transition: none`).

---

## Matn oʻlchamlari roli

Eski nomlar saqlanadi — ekran tavsiflari ularga nom bilan murojaat qiladi.

| Rol | Oila / oʻlcham / qalinlik | Qayerda |
|---|---|---|
| `raqam-katta` | Space Grotesk / `--t-raqam-katta` / 600 | bosh sahifadagi umumiy qoldiq, kontakt sahifasidagi netto. **Ekranda bitta** |
| `sarlavha` | Space Grotesk / `--t-sarlavha` / 600 | navigatsiya boʻlimining ekran sarlavhasi (chapga tekis) |
| `forma-sarlavha` | Space Grotesk / 18 px / 500 | forma va ichkari ekran sarlavhasi (markazda) |
| `kartochka-sarlavha` | Space Grotesk / 17 px / 500 | kartochka sarlavhasi («Qoldiq», «Joriy oy») |
| `summa` | Space Mono / 15 px / 700 | roʻyxat qatoridagi va kartochkadagi summa |
| `matn` | Hanken Grotesk / 16 px / 400 | asosiy matn, maydon ichidagi matn, tugma matni |
| `matn-kuchli` | Hanken Grotesk / 16 px / 600 | roʻyxat qatoridagi kategoriya nomi, boʻsh holatning birinchi qatori |
| `kichik` | Hanken Grotesk / 14 px / 400 | izoh, hisob nomi, kun sarlavhasi, netto soʻzi |
| `mayda` | Hanken Grotesk / 13 px / 400 | xato matni, yordam qatori |
| `yorliq` | Space Mono / 13 px / 400 | maydon yorligʻi, jami boʻlagining yorligʻi, guruh sarlavhasi |

Raqam yozadigan har element `font-variant-numeric: tabular-nums` oladi — Space Mono da
bu tabiiy, Space Grotesk da `tnum` bilan.

---

## Kirim va chiqim qanday ajratiladi

Ajratma **uch belgidan** iborat, faqat rangga tayanilmaydi (rang koʻrmaydigan odam ham
ajratsin). Qoida v1 dan **oʻzgarmadi**, faqat rang qiymatlari yangilandi:

1. **Ishora:** kirim `+`, chiqim `−` — summaning oldida turadi.
2. **Rang:** kirim `kirim` (`#00803F`), chiqim `chiqim` (`#D92020`) — faqat summa
   raqamiga beriladi, qator foniga emas.
3. **Soʻz:** formadagi segmentda va tahrirlash sarlavhasida «Kirim» yoki «Chiqim» soʻzi
   turadi.

Manfiy son kiritilmaydi (0033) — `−` faqat koʻrsatishdagi ishora.

`chiqim` rangi xato uchun ham ishlatiladi. Chalkashmasligi uchun qoida: **xato har doim
matn bilan keladi** (maydon tagidagi qator), summa esa har doim ishora bilan keladi. Qizil
rang yolgʻiz oʻzi hech qachon xabar tashimaydi.

**Semantik rang koʻk moment bilan raqobat qilmaydi:** yashil va qizil **maʼno** tashiydi,
koʻk esa **harakat**. Shuning uchun bir ekranda uchalasi ham boʻlishi qoida buzilishi
emas — HEAD qoidasi 1 toʻldirilgan koʻkning sonini cheklaydi, semantik rangni emas.

## Qarz yoʻnalishi qanday ajratiladi

Qarz raqamlari ham xuddi shu uch belgi bilan koʻrsatiladi — yangi rang qoʻshilmaydi.
Maʼnosi bitta: **pul menga keladimi yoki mendan ketadimi**.

| Holat | Ishora va rang | Soʻz |
|---|---|---|
| Men qarz berdim — pul menga qaytadi | `+`, `kirim` | «olaman» (netto), «Berdim» (qarz va forma) |
| Men qarz oldim — pul mendan ketadi | `−`, `chiqim` | «beraman» (netto), «Oldim» (qarz va forma) |
| Netto aynan nol, lekin ochiq qarz bor | ishorasiz, `matn` | «hisob teng» |

Bitta istisno: **qarz toʻlovining summasi rang olmaydi** (`matn`) va oldida faqat `−`
turadi. U yerda `−` «qarz qoldigʻidan ayirildi» degani. Toʻliq tavsif:
`design/qarz-daftari.md`.

**Hisobotdagi qarz qatorlari boshqa savolga javob beradi** va shuning uchun ishorasi ham
boshqacha: u yerda `+` va `−` «bu davrda pul hisobga tushdimi yoki undan chiqdimi» degani
(0017). Tavsif — `design/oylik-hisobot.md` 5-boʻlimida.

**Qoldiq — holat, harakat emas.** Bosh sahifadagi qoldiq raqamlari (umumiy, naqd, karta)
ishorani faqat **manfiy** boʻlganda oladi va rang olmaydi (`matn`): qoldiq kirim ham,
chiqim ham emas — u shu daqiqadagi holat (`design/dashboard.md` 3-boʻlim).

---

## Komponentlar

### Tugmalar

Hammasi pill (999 px). Matni Hanken Grotesk 600, 15–16 px, sentence case.

| Nom | Koʻrinishi | Balandligi |
|---|---|---|
| Asosiy tugma (`asosiy-tugma`) | foni `harakat`, matni oq, chegarasiz | 48 px |
| Ikkinchi tugma (`ikkinchi-tugma`) | foni `yuza`, 1.5 px `chegara-kuchli`, matni `matn` | 48 px |
| Xavfli tugma (`xavfli-tugma`) | foni `yuza`, 1.5 px `chiqim`, matni `chiqim` | 48 px |
| Qatordagi «Oʻchirish» (`ochirish-tugma`) | xavfli tugma, kichik: radiusi pill, ichki chekkasi 16 px | 44 px |
| Belgi tugmasi (`belgi-tugma`) | 44 × 44 doira, foni shaffof, ichida SVG, rangi `matn` | 44 px |
| Matn-havola (`matn-havola`) | matni `harakat`, foni yoʻq | 44 px |

Holatlar: **hover** — asosiy tugma `harakat-toq` ga toʻqlashadi; ikkinchi tugma foni
`matn` boʻlib matni oqqa aylanadi (HEAD ghost); **bosilgan** — `transform: scale(.97)`,
180 ms.
**Nega scale:** HEAD press holati oʻlcham bilan aytiladi, rang bilan emas — pill
tugmada bu eng sezilarli va rangga qoʻshimcha maʼno yuklamaydi.

**Ekranda bitta toʻldirilgan koʻk tugma.** Qaysi ekranda qaysi tugma ekani:

| Ekran | Koʻk moment |
|---|---|
| Bosh sahifa | «＋ Yozuv» |
| Yangi yozuv / Yozuvni tahrirlash | «Saqlash» |
| Kategoriyalar | «＋ Yangi kategoriya» |
| Yozuvlar | yoʻq — bu oʻqish ekrani, unda boshlanadigan ish yoʻq |
| Qarz daftari | «＋ Yangi kontakt» |
| Kontakt | «＋ Yangi qarz» |
| Yangi qarz / Qarzni tahrirlash / Toʻlov | «Saqlash» |
| Hisobot | yoʻq; kurs bloki ochilsa — oʻsha blokdagi «Saqlash» |
| Zaxira | «Eksport» |

Sahifa ichida ochilgan blokning asosiy tugmasi («Qoʻshish», «Koʻrsatish», «Zaxira faylini
tanlash») ham asosiy tugma boʻlib qoladi — bu qisqa turadigan holat va u aynan ish
ketayotgan joyda. Ikkitadan koʻp koʻk tugma hech qachon boʻlmaydi.

### Maydon

| Nima | Qiymat |
|---|---|
| Balandligi | 48 px |
| Foni | `yuza`, 1 px `chegara`, radius 10 px |
| Ichki chekka | 14 px |
| Matni | `matn` (16 px) |
| Namuna matn | `matn-ochiq` |
| Yorligʻi | `yorliq` (Space Mono 13 px, `matn-ikkinchi`), maydondan 8 px yuqorida |

**Summa maydoni:** balandligi 64 px (56 px edi), matni `raqam-katta` oʻlchamida lekin
**Space Mono 700**, oʻngida valyuta soʻzi (`kichik`, `matn-ikkinchi`).
**Nega mono va nega balandroq:** terilayotgan summa ekrandagi eng muhim raqam; mono uni
teraverganda ham bir xil kenglikda ushlab turadi (raqam qoʻshilganda oldingi raqamlar
sakramaydi), 64 px esa 40 px gacha oʻsadigan raqamga joy beradi.

### Chip

| Holat | Koʻrinishi |
|---|---|
| Tanlanmagan | foni `yuza`, 1.5 px `chegara-kuchli`, matni `matn` |
| Tanlangan | foni `harakat-fon`, 1.5 px `harakat`, matni `harakat` |
| Oʻchiq | foni `yuza-past`, chegarasiz, matni `matn-ochiq`, kursor oʻzgarmaydi |

Balandligi **44 px** (40 px edi), ichki chekkasi 18 px, radiusi pill.
**Nega kattalashdi:** chip bosiladigan element, barmoq oʻlchami qoidasi unga ham tegishli;
HEAD pill'lari ham shu qalinlikda.

Tanlangan chip koʻk tint bilan boʻyaladi va bu «bitta koʻk moment» qoidasini buzmaydi:
HEAD tintni (`#EBEEFF`) yumshoq toʻldirish uchun ataylab ajratgan. Matn kontrasti tint
ustida 6.6:1.

### Segment (ikki boʻlak)

Tashqarisi pill yoʻlak: foni `yuza-past`, ichki chekkasi 4 px, balandligi 52 px.
Ichida ikkita teng boʻlak, ular ham pill.

| Holat | Koʻrinishi |
|---|---|
| Tanlanmagan boʻlak | foni shaffof, matni `matn-ikkinchi` |
| Tanlangan «Chiqim» / «Oldim» tomoni | foni `chiqim`, matni oq, 600 |
| Tanlangan «Kirim» / «Berdim» tomoni | foni `kirim`, matni oq, 600 |

Oq matn ikkala rang ustida ham 5.0:1 — AA. Yoʻnalish rangi `design/qarz-daftari.md`
3-boʻlimidagidek: «Berdim» — `chiqim`, «Oldim» — `kirim`.

### Kartochka

Foni `yuza`, 1 px `chegara`, radiusi **24 px**, ichki chekkasi 20 px (`≥600`: 24,
`≥960`: 32). Soya yoʻq. Sarlavhasi `kartochka-sarlavha`.

Kartochka ichidagi qatorlar orasida chiziq yoʻq — ular boʻshliq bilan ajraladi (12 px).
**Nega:** kartochkaning oʻzi allaqachon chegarali; ichida ham chiziq boʻlsa ekran
katakchaga aylanadi.

### Roʻyxat qatori

Foni `yuza`, balandligi kamida 64 px, **tagida 1 px `chegara` chizigʻi**. Kartochkaga
solinmaydi — chetdan chetgacha choʻziladi, ichki chekkasi `--yon`.
Guruhning oxirgi qatorida chiziq qoʻyilmaydi.

Chapda: 1-qator `matn-kuchli`, 2-qator `kichik` + `matn-ikkinchi`.
Oʻngda: summa `summa` rolida (Space Mono) — hamma qatorda bitta oʻng chekkaga tekis.

Hover (kompyuter): fon `yuza-past` ga oʻtadi, 180 ms.

### Navigatsiya paneli — pastda (baza va `≥600`)

Tavsif «Navigatsiya paneli» boʻlimida.

### Pastdagi tugma paneli (`panel-past`)

Ekranning pastida yopishib turadi: balandligi 72 px, foni `fon`, **ustida 1 px `chegara`
chizigʻi** va `--soya-yengil`. Ichida bitta asosiy tugma, eni toʻliq.
`≥960` da bu panel yoʻqoladi — tugma sarlavha qatoriga koʻchadi («Responsive»).

### «Qaytarish» paneli

Foni `qora-panel` (`#0B1330`), matni oq, radiusi 16 px, `--soya-orta`.
Yon chekkalardan `--yon`, pastdan 16 px (xavfsiz zona hisobga olinadi), eni koʻpi bilan
480 px va markazda. Chapda matn (`matn`, oq), oʻngda **«QAYTARISH»** tugmasi: pill,
foni shaffof, 1.5 px `rgba(255,255,255,.28)` chegara, matni oq 600, balandligi 44 px.
Muddat va xulq — `design/kirim-chiqim.md` (7 soniya, 0048).

### Kurs soʻrovi bloki

«≈ jami soʻmda» qatori turadigan joyda ochiladi (modal yoʻq). Foni `yuza-past`, radiusi
16 px, ichki chekkasi 16 px. Ichida: bir qatorlik izoh (`mayda`, `matn-ikkinchi`), kurs
maydoni va oʻngida asosiy tugma. Matnlar — `design/oylik-hisobot.md` 3-boʻlim.

### Sahifa ichida ochiladigan blok

«Yangi kontakt», «Kontaktni tahrirlash», «Davr tanlash», «Yangi kategoriya» va import
oqimi — hammasi bitta qolipda: foni `yuza-past`, radiusi 16 px, ichki chekkasi 16 px,
chegarasi yoʻq.
**Nega tint fon:** blok kartochka emas, u vaqtincha ochilgan ish joyi; tint uni oq
varaqdan chegara qoʻshmasdan ajratadi. Ochilishi — 320 ms soʻnish + 4 px koʻtarilish.

### Zaxira eslatmasi

Bir qatorlik, bosilmaydi. Foni `yuza-past`, radiusi 16 px, ichki chekkasi 12/16 px,
matni `kichik` + `matn-ikkinchi`. Rang, ikonka va ogohlantirish belgisi yoʻq — yoʻlni
matnning oʻzi aytadi (0067).

---

## Holatlar

- **Fokus.** Maydon: chegarasi 2 px `harakat` + tashqarisida 4 px `harakat-fon` halqa.
  Tugma, chip, havola va nav bandi: `outline: 2px solid var(--harakat)`, `offset: 2px` va
  4 px `harakat-fon` halqa. Fokus hech qachon olib tashlanmaydi (HEAD).
- **Bosilgan:** `transform: scale(.97)`, 180 ms; asosiy tugma qoʻshimcha `harakat-toq` ga
  toʻqlashadi. Rang chaqnashi yoʻq.
- **Oʻchiq (bosilmaydi):** matni `matn-ochiq`, foni `yuza-past`, kursor oʻzgarmaydi. Bu
  holat **saqlash tugmalarida ham** uchraydi: saqlash ketayotgan bir lahzada tugma oʻchiq
  turadi — bitta niyat bitta yozuv boʻlsin. Yangi rang, matn yoki belgi qoʻshilmaydi.
- **Xato:** maydon chegarasi 2 px `chiqim`; tagida `mayda` oʻlchamda `chiqim` rangli xato
  matni. Maydon tuzatilishi bilan xato yoʻqoladi. Qizil fon qoʻyilmaydi.
- **Yordam matni (xato emas):** maydon ostida `mayda` oʻlchamda `matn-ikkinchi` rangli
  qator; maydonning chegarasi va rangi oʻzgarmaydi.

  Ikkalasining chegarasi bitta savol bilan ajratiladi: **saqlash toʻxtaydimi?**
  Toʻxtasa — qizil xato. Toʻxtamasa, yaʼni ilova qiymatni oʻzi toʻgʻrilagan boʻlsa —
  yordam matni. Shuning uchun «kasr qismi olib tashlandi» turdagi xabarlar — yordam matni;
  boʻsh maydon, nol summa va nol kurs esa qizil xato.
- **Kutish holati yoʻq:** maʼlumot qurilmaning oʻzida (0004), yuklanish aylanasi
  qurilmaydi.

---

## Boʻshliqlar

Qadam — 4 px. Qiymatlar «Tokenlar → Boʻshliq» da. Qoʻshimcha qoidalar:

- Sarlavha bilan birinchi blok orasi: 16 px (baza), 24 px (`≥600`).
- Kartochkalar orasi 16 px (baza), 24 px (`≥960`).
- Pastda turgan panel balandligi 72 px; roʻyxat oxiriga shuncha boʻsh joy qoʻshiladi.
- Navigatsiya paneli bor ekranda roʻyxat oxiriga yana 56 px + xavfsiz zona qoʻshiladi.

---

## Responsive

Uch qatlam. Har qatlamda faqat **joylashuv** oʻzgaradi — matn, tartib va xulq bir xil.

| Qatlam | Eni | Ustun | Yon chekka | Navigatsiya |
|---|---|---|---|---|
| Baza | 320–599 | bitta ustun, toʻliq eni | 16 px | pastda, yopishgan panel |
| Keng | `≥600` | bitta ustun, koʻpi bilan **640 px**, markazda; ayrim joylarda ikki ustun | 24 px | pastda, ichi 640 px bilan markazda |
| Desktop | `≥960` | mazmuni boʻyicha: roʻyxat/forma **640/560 px**, kartochka gridi **1040 px** | 40 px | **yuqorida, pill panel** |

### Nega ustun eni mazmunga qarab boʻlinadi

Roʻyxat qatorining chap chekkasida kategoriya, oʻng chekkasida summa turadi. Ustun 1040 px
boʻlsa ular orasida 800 px boʻsh joy qoladi va koʻz bir qatorni oʻqiy olmaydi. Shuning
uchun roʻyxat va forma tor ustunda (640 / 560), kartochka gridi esa keng ustunda (1040)
turadi.

### `≥600` da nima oʻzgaradi

- Ustun 640 px va markazda; yon chekka 24 px.
- **Ikki ustunga boʻlinadigan joylar:** bosh sahifadagi «Naqd/Karta» va «Kirim/Chiqim»
  qatorlari; «Zaxira» ning ikkita kartochkasi; «Hisobot» dagi «Chiqim — kategoriyalar
  boʻyicha» va «Kirim — kategoriyalar boʻyicha» kartochkalari yonma-yon.
- Forma **kartochkaga** oʻtadi: eni 560 px, markazda, oq fon, 1 px `chegara`, radius
  24 px, ichki chekka 24 px. Pastdagi «Saqlash» paneli yopishishdan toʻxtaydi va
  kartochkaning oxirgi qatori boʻlib qoladi.
  **Nega:** 600 px dan keng ekranda toʻliq enli forma varaqning oʻrtasida yoʻqoladi;
  kartochka unga chegara beradi va «bu bitta ish» degan maʼnoni saqlaydi.
- Navigatsiya paneli pastda qoladi: 600–959 px — bu koʻpincha planshet, qoʻlda ushlanadi.

### `≥960` da nima oʻzgaradi

- **Navigatsiya yuqoriga koʻchadi va pill boʻladi:** ekranning tepasida, markazda,
  yopishgan (`position: fixed; top: 16px`). Foni `yuza`, 1 px `chegara`, `--soya-yengil`,
  radiusi pill, ichki chekkasi 6 px. Bandlar — oʻsha beshtasi, har biri pill (matni
  14.5 px, ichki chekka 16 px). Faol band: foni `yuza-past`, matni `matn`, 600.
  **Nega pastdan yuqoriga:** kompyuterda barmoq yoʻq va ekranning pastki chekkasi
  kontentdan uzoqda — pastki panel telefon izi boʻlib qoladi. Pill nav esa HEAD_WEB ning
  aniqlovchi shakli, ilova uni oʻz oʻlchamida takrorlaydi. Sahifaga yuqoridan 88 px joy
  qoldiriladi (`nav-bor` ning `padding-top` i).
- **Sarlavha qatori:** ekran sarlavhasi chapda (`sarlavha`, 32 px), oʻng chekkasida
  ekranning asosiy tugmasi (pill, eni mazmuniga qarab). Pastdagi yopishgan tugma paneli
  **yoʻqoladi**.
  **Nega:** desktopda asosiy harakat koʻz tushadigan joyda — sarlavha bilan bitta qatorda;
  1280 px enli ekranning tagiga choʻzilgan tugma paneli mobil izi boʻlib koʻrinadi.
- **Kartochka gridi:** bosh sahifa, «Hisobot» va «Zaxira» ikki ustunga boʻlinadi
  (`grid-template-columns: 1fr 1fr; gap: 24px`). Tafsilot —
  `design/redesign/layout.md`.
- **Formalar** markazda kartochka boʻlib qoladi (560 px) — `≥600` dagidek.
- **Roʻyxat ekranlari** (Yozuvlar, Qarz daftari, Kontakt) 640 px ustunda qoladi.
- Kartochka hover: `--soya-yengil` paydo boʻladi (faqat `hover: hover` qurilmada).

### Nima oʻzgarmaydi

Matn, tartib, ekranlar soni, oqim va tugma nomlari. Responsive faqat joylashuv.

---

## Ikonka siyosati

Ikonka kutubxonasi (npm paketi) **qoʻshilmaydi** (0068/5). Kerak boʻlgan shakl Lucide
(MIT) dan olinadi va **inline SVG** boʻlib qoʻyiladi: `viewBox="0 0 24 24"`, `fill="none"`,
`stroke="currentColor"`, `stroke-width="1.75"`, `stroke-linecap="round"`,
`stroke-linejoin="round"`, `aria-hidden="true"`, `focusable="false"`.

Toʻrtta belgi, boshqasi yoʻq:

| Lucide nomi | Qayerda | Oʻlcham |
|---|---|---|
| `plus` | «＋ Yozuv», «＋ Yangi kontakt», «＋ Yangi qarz», «＋ Toʻlov», «＋ Yangi kategoriya» tugmalarida | 18 px |
| `x` | forma va bloklarni yopish (`×` oʻrnida) | 20 px |
| `chevron-left` | «‹ Orqaga» va hisobotdagi «Oldingi oy» | 18 px / 20 px |
| `chevron-right` | «Hammasi ›» va hisobotdagi «Keyingi oy» | 18 px / 20 px |

### Belgi matnning oʻrnini olganda — nomi oʻzgarmasligi shart

Testlar tugmalarni **nomi** bilan topadi (`getByRole('button', { name: '＋ Yozuv' })`).
Shuning uchun ikkita xil holat bor:

1. **Belgi yordamchi nom bilan keladi** (`×` — `aria-label="Yopish"`; `‹`/`›` —
   `aria-label="Oldingi oy"`/`"Keyingi oy"`): belgi matni SVG bilan **almashtiriladi**,
   nom oʻzgarmaydi.
2. **Belgi nomning ichida** (`＋ Yozuv`, `‹ Orqaga`, `Hammasi ›`): belgi matni DOM da
   **qoladi**, lekin koʻrinmaydi, va yoniga SVG qoʻyiladi:

   ```
   <button class="asosiy-tugma">
     <span class="faqat-oquvchiga">＋</span>
     <svg class="ic" aria-hidden="true" …/>
     Yozuv
   </button>
   ```

   `.faqat-oquvchiga` — mavjud `.fayl-kirit` bilan bir xil retsept: `position: absolute;
   width: 1px; height: 1px; clip-path: inset(50%)`. **`display: none` yoki
   `visibility: hidden` ISHLATILMAYDI** — ular belgini yordamchi daraxtdan ham
   oʻchiradi va tugmaning nomi «Yozuv» boʻlib qolardi.

**Nega umuman almashtiriladi:** `＋` — U+FF0B (toʻliq enli qoʻshuv belgisi), u Space
Grotesk va Hanken Grotesk toʻplamida yoʻq va tizim shriftiga tushib qoladi: qalinligi va
eni qolgan matnga mos kelmaydi (buni «oldin» suratlarida koʻrish mumkin).

**Matn ichidagi `＋` tegilmaydi:** «Birinchi yozuvni pastdagi «＋ Yozuv» tugmasi bilan
qoʻshasiz.» kabi jumlalarda belgi oddiy matn boʻlib qoladi — u tugma emas, iqtibos.

Emoji va unicode-belgi ikonka sifatida ishlatilmaydi.

---

## Shrift joylashtirish

Fayllar `platform/public/fonts/` da, `.woff2`, subset: `latin` + `latin-ext`.

**`ʻ` (U+02BB) va `ʼ` (U+02BC) haqida tuzatilgan fakt** (frontend `fontTools` bilan
tekshirdi, 2026-08-20): bu ikki belgi faqat **Space Grotesk**'da bor; Hanken Grotesk va
Space Mono'da (asl fayllarda ham) YOʻQ. Yechim: ikkala belgi Space Grotesk'dan kichik
alohida faylga (`space-grotesk-belgilar.woff2`, ~1.3 kB) subset qilinib,
`unicode-range: U+02BB-02BC` bilan **uchala oila nomiga** ham ulanadi — «soʻm»,
«Oʻchirish», «yoʻq» soʻzlaridagi belgi hech qachon tizim shriftiga tushmaydi va hamma
qatorga bir xil taʼsir qiladi. `≈` (U+2248) ham Google subsetlarida yoʻq — xuddi shu
yoʻl bilan qoʻshiladi («≈ jami soʻmda» qatori uchun).

Joriy roʻyxat — variable fayllar (statik oʻrniga; hajmi kichikroq chiqdi), latin +
latin-ext + belgilar:

| Oila | Fayllar | Nima uchun |
|---|---|---|
| Space Grotesk | variable (latin, latin-ext) + belgilar subseti | 500 — forma/kartochka sarlavhasi; 600 — ekran sarlavhasi va `raqam-katta` |
| Hanken Grotesk | variable (latin, latin-ext) | 400 — matn; 600 — `matn-kuchli` va tugma matni |
| Space Mono | 400, 700 (latin, latin-ext) | 400 — yorliq; 700 — pul summasi |

Qoidalar:

- `@font-face` `platform/src/index.css` da; `font-display: swap`; `unicode-range` bilan
  ikki qatordan (`latin`, `latin-ext`).
- Har oila uchun `font-family` nomi **bitta** boʻladi, qalinlik `font-weight` bilan
  ajratiladi — brauzer sunʼiy qalinlashtirmasin.
- Fayllar PWA precache'ga kiradi (`workbox` `globPatterns` ga `woff2` qoʻshiladi) —
  oflayn birinchi ochilishda ham shrift joyida boʻlsin (0003).
- CDN'dan hech narsa yuklanmaydi. HEAD tokenlaridagi `@import url('…fonts.googleapis…')`
  qatori **koʻchirilmaydi**.
- Zaxira stek: shrift kelmasa `system-ui` ishlaydi; oʻlchamlar va qator balandliklari
  shunda ham buzilmaydi (`font-size` px da, `line-height` sonli).

---

## Son, sana va valyuta formati

Bu boʻlim v1 dan **oʻzgarmadi** — format matn qoidasi, dizayn emas.

- **Soʻm:** butun son, mingliklar orasi — boʻsh joy: `1 200 000 soʻm`. Tiyin yoʻq (0033).
- **Dollar:** ikki kasr, kasr belgisi — vergul, oxirida `$`: `12,50 $` (0033).
- **Minglik ajratish ikkala valyutada ham** boʻladi — koʻrsatishda ham, terishda ham. U
  faqat butun qismga tegadi: `1 234,56 $`, `1 200 000 soʻm`.
- **Ishora:** summadan oldin `+` yoki `−`, keyin boʻsh joysiz son: `−45 000 soʻm`.
- **Kurs:** butun soʻm, toʻliq yozilishi `1 $ = 12 500 soʻm` (0023, 0042).
- **Taxminiy jami:** oldida `≈`, keyin boʻsh joy va odatdagi ishorali summa:
  `≈ +10 500 000 soʻm`. Tagida `mayda` oʻlchamda «taxminiy» soʻzi va ishlatilgan kurs,
  orasida ` · `: `taxminiy · 1 $ = 12 500 soʻm` (0023, 0044). Taxminiy summa rang olmaydi.
- **Sana:** `16-avgust`. Boshqa yildagi sana yil bilan: `16-avgust 2025`. Bugungi va
  kechagi kun uchun soʻz: «Bugun», «Kecha».
- **Oy nomlari:** yanvar, fevral, mart, aprel, may, iyun, iyul, avgust, sentabr, oktabr,
  noyabr, dekabr.
- **Vaqt koʻrsatilmaydi.** `yaratilgan` — texnik maydon, ekranda chiqmaydi (0047).

### Maydonda terish paytidagi format

Son kiritiladigan hamma maydon (summa va kurs) bitta qoidaga boʻysunadi — format terish
paytida, har belgidan keyin qoʻyiladi:

- Minglik ajratish boʻsh joy bilan: `1 200 000`. Ajratish faqat **butun qismga** tegadi.
- Odam tergan kasr qismi oʻzgartirilmaydi: `12,` → `12,`, `12,50` → `12,50`.
- Format qayta qoʻyilganda kursor raqamlarga nisbatan oʻz oʻrnida qoladi: kursordan
  chapdagi **raqamlar soni** saqlanadi, ajratgich boʻsh joylari sanalmaydi.
- Ajratgich boʻsh joyi — faqat koʻrinish. Saqlashda u olib tashlanadi.
- Yopishtirilgan matndan raqam boʻlmagan belgilar olib tashlanadi, keyin shu qoidalar
  qoʻllanadi.

---

## Navigatsiya paneli (0067)

Dashboard **bosh sahifa** (0020, 0063 → 0067): ilova «Bosh» bilan ochiladi, alohida
«Yozuv» bandi yoʻq — yozuv qoʻshish bosh sahifadagi doim koʻrinadigan «＋ Yozuv»
tugmasidan.

### Nima koʻrinadi

Teng enli beshta band, faqat soʻz (ikonka yoʻq — nav bandiga ikonka qoʻshilsa toʻrtta
belgilik siyosat buzilardi):

| Boʻlak | Qayerga olib boradi |
|---|---|
| **«Bosh»** | Bosh sahifa (`design/dashboard.md`; sarlavhasi «Daftar») |
| **«Yozuvlar»** | «Yozuvlar» ekrani (`design/kirim-chiqim.md`, 2-boʻlim) |
| **«Qarz daftari»** | «Qarz daftari» — kontaktlar roʻyxati (`design/qarz-daftari.md` 1-boʻlim) |
| **«Hisobot»** | «Hisobot» ekrani (`design/oylik-hisobot.md`) — har ochilganda joriy oy bilan |
| **«Zaxira»** | «Zaxira» ekrani (`design/zaxira.md`) — eksport va import |

**Panel toʻldi: beshta boʻlak.** Boshqa boʻlak qoʻshilmaydi.

### Oʻlchamlari va rangi

| Nima | Baza va `≥600` (pastda) | `≥960` (yuqorida, pill) |
|---|---|---|
| Panel foni | `yuza` | `yuza`, radius pill, `--soya-yengil` |
| Chegarasi | ustida 1 px `chegara` | 1 px `chegara`, atrofida |
| Oʻrni | pastda yopishgan | yuqorida yopishgan, markazda, tepadan 16 px |
| Balandligi | 56 px + pastki xavfsiz zona | 52 px (ichki chekka 6 px) |
| Boʻlak | eni teng, bosiladigan joyi butun boʻlak | eni mazmuniga qarab, ichki chekka 16 px |
| Matn | `mayda` (13 px), Hanken 500 | 14.5 px, Hanken 500 |
| Matn sigʻmasa | ikki qatorga oʻraladi va markazda turadi («Qarz» / «daftari»); qisqartma va `…` yoʻq | oʻralmaydi — joy yetadi |
| **Faol boʻlim** | matni `matn`, qalinligi 600, ortida `yuza-past` pill | oʻsha |
| Faol boʻlmagan | matni `matn-ikkinchi`, qalinligi 400 | oʻsha |
| Bosilgan | `scale(.97)` | oʻsha |
| Fokus | 2 px `harakat` outline + 4 px halqa | oʻsha |

**Faol band koʻk emas.** Sabab ikkita: (1) toʻldirilgan koʻk ekranda bitta boʻlishi kerak
va u — asosiy tugma; (2) HEAD ning oʻz navigatsiyasida faol band aynan shunday —
siyoh matn va tint pill. Faol holat baribir uch belgi bilan aytiladi: rang, qalinlik va
ortidagi pill — rang koʻrmaydigan odam ham koʻradi.

### Qayerda koʻrinadi, qayerda yoʻq

- **Koʻrinadi:** «Bosh», «Yozuvlar», «Qarz daftari», «Kontakt», «Hisobot», «Zaxira».
  «Kontakt» da faol boʻlim — **«Qarz daftari»**.
- **Koʻrinmaydi:** `×` bilan ochiladigan forma ekranlarida («Yangi yozuv», «Yozuvni
  tahrirlash», «Yangi qarz», «Qarzni tahrirlash», «Toʻlov») va «Kategoriyalar» ekranida.
- **Navigatsiya boʻlimining oʻz ekranida «‹ Orqaga» havolasi boʻlmaydi.** Ichkariga
  kirilgan ekranlarda («Kontakt») «‹ Orqaga» oʻz joyida qoladi.

### Pastdagi panellar tartibi

Baza va `≥600` da bir ekranda uchtagacha qatlam boʻlishi mumkin, pastdan yuqoriga:

1. Navigatsiya paneli (56 px + xavfsiz zona) — eng pastda.
2. Ekranning asosiy tugma paneli (72 px).
3. «Qaytarish» paneli — hammasining ustida, pastdagi eng yaqin paneldan 16 px yuqorida.

Roʻyxat oxiriga qoʻshiladigan boʻsh joy shu qatlamlar yigʻindisiga teng.

`≥960` da qatlam ikkita qoladi: navigatsiya yuqorida, tugma paneli yoʻq — pastda faqat
«qaytarish» paneli chiqadi (pastdan 24 px, markazda).

### Ilova ochilganda va forma yopilganda

- Ilova ochilganda **bosh sahifa** koʻrinadi (0020; parol/PIN yoʻq — 0006).
- Bosh sahifadagi **«＋ Yozuv»** tugmasi «Yangi yozuv» formasini ochadi; `×` bosilsa ham,
  «Saqlash» bosilsa ham forma **oʻzi ochilgan ekranga** qaytadi.
- Boʻlaklar orasida oʻtishda animatsiya yoʻq — ekran darhol almashadi.

---

## Nima qilinmaydi

- Tungi rejim, mavzu tanlash, rang sozlash.
- CDN dan shrift; ikonka kutubxonasi (npm); rasm va fotosurat.
- HEAD logotipi, slashed-A belgisi yoki unga taqlid.
- Gradient (matnda ham, fonda ham), emoji, unicode-belgi ikonka.
- HEAD ning marketing oʻlchamlari (`--t-hero`, `--t-d1`) — ilovada bunday raqam yoʻq.
- Ekran almashishidagi animatsiya, sirpanish, «skeleton» yuklanish.
- Grafik va diagramma (specda yoʻq).
- Kartochka soyasi (desktopdagi hover'dan boshqa), ichki chiziqlar, katakcha koʻrinish.
- Oq fonda `#19E07A` va `#FF2D2D` — faqat toʻq fonda.
