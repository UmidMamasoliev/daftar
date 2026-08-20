# Redesign — ekran-ma-ekran joylashuv (0068)

Sana: 2026-08-20. Asos: `decisions/0068-head-redesign.md`, `design/uslub.md` (v2).
Bosh sahifa alohida faylda: `design/dashboard.md`.

Bu fayl qolgan **toʻrt ekran** (Yozuvlar, Qarz daftari + Kontakt, Hisobot, Zaxira),
**uch forma** (Yangi yozuv, Yangi qarz, Toʻlov) va **Kategoriyalar** ekrani uchun
koʻrinish va joylashuv oʻzgarishlarini sanaydi. Frontend shu roʻyxat boʻyicha bajaradi.

**Nima oʻzgarmaydi:** matn, tugma nomlari, tartib, oqim, xato holatlari, mezonlar. Faqat
rang, shrift, shakl, boʻshliq va joylashuv oʻzgaradi (0068/3). Test yashil qolishi shart.

---

## 0. Hamma ekranga tegishli

Bu boʻlim bir marta bajariladi — keyin ekranlar deyarli oʻz-oʻzidan toʻgʻri chiqadi.

### 0.1. Tokenlar va shrift

1. `platform/src/index.css` ning `:root` bloki `design/uslub.md` → «Tokenlar» boʻyicha
   qayta yoziladi (rang, shrift, oʻlcham, radius, soya, boʻshliq, motion).
2. `@font-face` — olti fayl (`design/uslub.md` → «Shrift joylashtirish»);
   `platform/public/fonts/`; PWA precache `globPatterns` ga `woff2` qoʻshiladi.
3. `body` va `:root` shrifti `--shrift-matn`; sarlavhalar va `raqam-katta` `--shrift-sarlavha`;
   yorliq va pul summalari `--shrift-mono`.
4. `vite.config.ts`: `background_color` → `#FFFFFF` (`theme_color` tegilmaydi).

### 0.2. Ustun va yon chekka

```
--yon: 16px;                          /* baza */
@media (min-width: 600px) { --yon: 24px }
@media (min-width: 960px) { --yon: 40px }

--ustun-eni: 640px;   /* roʻyxat va ichkari ekranlar (560 px edi) */
--ustun-tor: 560px;   /* formalar */
--ustun-keng: 1040px; /* kartochka gridi: bosh sahifa, Hisobot, Zaxira */
```

`.ekran` uchun ikkita modifikator qoʻshiladi (bitta soʻzlik oʻzgarish, DOM tuzilmasi
tegilmaydi):

| Modifikator | Qayerda | `≥960` da eni |
|---|---|---|
| `ekran-keng` | Dashboard, Hisobot, Zaxira | `--ustun-keng` |
| `ekran-forma` | YozuvForma, QarzForma, TolovForma | `--ustun-tor`, kartochka koʻrinishida |
| (modifikatorsiz) | Yozuvlar, QarzDaftari, Kontakt, Kategoriyalar | `--ustun-eni` |

### 0.3. Sarlavha — ikki xil

| Tur | Qayerda | Koʻrinishi |
|---|---|---|
| **Sahifa sarlavhasi** | Bosh, Yozuvlar, Qarz daftari, Hisobot, Zaxira | `.panel-tepa` ning foni va ostidagi chizigʻi olib tashlanadi; `.sarlavha` chapga tekis, `sarlavha` roli (Space Grotesk 600, 22–32 px); grid `1fr auto 1fr` oʻrniga `1fr auto` |
| **Ichkari sarlavha** | Formalar, Kategoriyalar, Kontakt | `.panel-tepa` bar boʻlib qoladi: grid `1fr auto 1fr`, foni `yuza`, ostida 1 px `chegara`; `.sarlavha` markazda, `forma-sarlavha` roli (Space Grotesk 500, 18 px) |

**Nega ikki xil:** navigatsiya boʻlimi — sahifa, unga katta chapga tekis sarlavha mos
keladi; forma va ichkari ekran — bitta ish uchun ochilgan varaq, unda markazdagi sarlavha
`×` yoki «‹ Orqaga» bilan muvozanatda turadi.

### 0.4. `≥960` — sarlavha qatoriga koʻchadigan tugma

DOM oʻzgarmaydi. `.ekran` grid boʻladi va `.panel-past` sarlavha bilan bitta qatorga
tushadi:

```
@media (min-width: 960px) {
  .ekran { display: grid; grid-template-columns: 1fr auto;
           grid-template-areas: "sarlavha amal" "tana tana"; }
  .panel-tepa   { grid-area: sarlavha; }
  .panel-past   { grid-area: amal; position: static; margin: 0; padding: 0;
                  background: none; box-shadow: none; border: 0; align-self: center; }
  .panel-past .asosiy-tugma { width: auto; padding: 0 var(--bosh-6); }
  /* tana: .dashboard-tanasi, .royxat, .qarz-tanasi, .hisobot-tanasi, .zaxira-tanasi … */
}
```

Shart: `.panel-past` `.ekran` ning **bevosita bolasi** boʻlishi kerak (hozir hamma ekranda
shunday).

**Istisno — Kontakt sahifasi:** uning yuqori panelining oʻng katagida allaqachon
«Tahrirlash» turadi. Shuning uchun u yerda `.panel-past` sarlavha qatoriga chiqmaydi,
balki panel **ostidagi** alohida qatorda oʻngga tekislanadi.

### 0.5. Navigatsiya

`design/uslub.md` → «Navigatsiya paneli». Qisqacha: baza va `≥600` — pastda; `≥960` —
yuqorida pill. Faol band koʻk emas: `yuza-past` pill + `matn` + 600.
`≥960` da `.nav-bor` ning pastki `padding` i yuqoriga koʻchadi (88 px).

### 0.6. Ikonka almashuvi

`design/uslub.md` → «Ikonka siyosati». Bu redesignda tegiladigan joylar:

| Element | Nima qilinadi |
|---|---|
| `.belgi-tugma` ichidagi `×` | `x` SVG (20 px). `aria-label="Yopish"` **oʻzgarmaydi** |
| Hisobotdagi `‹` / `›` | `chevron-left` / `chevron-right` (20 px). `aria-label` oʻzgarmaydi |
| «＋ …» tugmalari | `＋` matni `.faqat-oquvchiga` span ichiga oʻtadi, yoniga `plus` SVG (18 px) |
| «‹ Orqaga» | `‹` matni `.faqat-oquvchiga` span ichiga, yoniga `chevron-left` (18 px) |
| «Hammasi ›» | `›` matni `.faqat-oquvchiga` span ichiga, yoniga `chevron-right` (18 px) |

Yangi sinflar: `.faqat-oquvchiga` (`.fayl-kirit` retsepti) va `.ic` (SVG oʻlchami).

---

## 1. «Yozuvlar»

### Nima oʻzgaradi

| Element (sinf) | Oldin | Keyin |
|---|---|---|
| `.panel-tepa` | oq bar, markazdagi 20/600 sarlavha | sahifa sarlavhasi (0.3) — bar yoʻq |
| `.royxat` | kulrang fon ustida oq qatorlar | fon oq; qatorlarni faqat soch chizigʻi ajratadi |
| `.kun-sarlavhasi` | `kichik`, foni `fon` (kulrang), sticky | `yorliq` roli (Space Mono 13, `matn-ikkinchi`, `+0.06em`), foni **oq**, sticky, tagida 1 px `chegara`; ichki chekkasi 16/`--yon` |
| `.yozuv-qator` | tagida 1 px chiziq | oʻsha; guruhning **oxirgi qatorida chiziq yoʻq**; hover'da (kompyuter) fon `yuza-past` |
| `.qator-kategoriya` | 16/600 | `matn-kuchli` (oʻzgarmaydi, faqat oila Hanken) |
| `.qator-izoh` | 14, `matn-ikkinchi` | oʻsha, rang toʻqroq (`#4A4F59`) |
| `.qator-summa` | 17/600, tizim shrifti | **`summa` roli: Space Mono 700, 15 px**, tabular; ranglar `kirim`/`chiqim` yangi qiymatlarda |
| `.ochirish-tugma` | 10 px radius, 1 px chegara | pill, 1.5 px `chiqim` chegara, matni `chiqim`, balandligi 44 px |
| `.bosh-holat` | markazda ikki qator | oʻsha; birinchi qator `matn-kuchli`, ikkinchisi `kichik` + `matn-ikkinchi`; ustki boʻshliq 15vh |

**Kun sarlavhasi mono boʻldi** — u sana yorligʻi, kontent emas; mono uni pul ustuni bilan
bitta «hisob-kitob» oilasiga qoʻshadi va oq fonda kulrang chiziqsiz ham ajralib turadi.

### Joylashuv

```
baza (390)                          ≥960 (1280, ustun 640)
┌────────────────────────────┐      Yozuvlar
│ Yozuvlar                   │      ┌──────────────────────────────┐
│                            │      │ Bugun                        │
│ Bugun                      │      ├──────────────────────────────┤
├────────────────────────────┤      │ oziq-ovqat      −45 000 soʻm │
│ oziq-ovqat    −45 000 soʻm │      │ Karta · nonushta             │
│ Karta · nonushta           │      ├──────────────────────────────┤
├────────────────────────────┤      │ oylik        +8 000 000 soʻm │
│ oylik      +8 000 000 soʻm │      │ Karta                        │
│ Karta                      │      └──────────────────────────────┘
└────────────────────────────┘
[nav pastda]                        [nav yuqorida, tugma paneli yoʻq]
```

| Qatlam | Joylashuv |
|---|---|
| Baza | Bitta ustun, qatorlar chetdan chetgacha, yon chekka 16 px |
| `≥600` | Ustun 640 px markazda; qatorlarning ichki chekkasi 24 px |
| `≥960` | Ustun 640 px; sarlavha 32 px; bu ekranda asosiy tugma yoʻq, shuning uchun sarlavha qatorining oʻng katagi boʻsh qoladi |

**Nega roʻyxat kengaymaydi:** qatorning chap chekkasida kategoriya, oʻngida summa turadi;
ustun 1040 px boʻlsa ular orasida oʻqib boʻlmas masofa qolardi.

### Holatlar

| Holat | Koʻrinishi |
|---|---|
| Toʻla roʻyxat | Yuqoridagi kabi |
| Boʻsh roʻyxat | `.bosh-holat`: «Hali bitta ham yozuv yoʻq.» + «Birinchi yozuvni bosh sahifadagi «＋ Yozuv» tugmasi bilan qoʻshasiz.» |
| Qator surilgan / hover | Summa oʻrnida «Oʻchirish» pill tugmasi (`visibility: hidden` qoidasi oʻzgarmaydi) |
| «Qaytarish» paneli turgan | 8-boʻlim |
| Fokus qatorda | 2 px `harakat` outline + 4 px halqa, qator radiusi 0 boʻlgani uchun outline toʻgʻri burchakli |

---

## 2. «Qarz daftari» (kontaktlar roʻyxati)

| Element | Oldin | Keyin |
|---|---|---|
| `.panel-tepa` | oq bar | sahifa sarlavhasi (0.3) |
| `.kontakt-qator` | oq qator, tagida chiziq | oʻsha, fon oq varaqda; hover `yuza-past` |
| `.qator-ism` | 16/600 | `matn-kuchli` |
| `.qator-telefon` | 14 `matn-ikkinchi` | oʻsha |
| `.netto-sozi` | 14 `matn-ikkinchi` | **`yorliq` roli** (mono 13) — «olaman» / «beraman» / «hisob teng» |
| `.netto-summa` | 17/600 | **mono 700, 15 px**, tabular |
| `.kontakt-bloki` («Yangi kontakt») | oq blok | sahifa ichidagi blok qolipi: foni `yuza-past`, radius 16, ichki chekka 16 (`design/uslub.md`) |
| `.qoshish-tugma` | koʻk, 10 px radius | koʻk pill, eni mazmuniga qarab |
| `.panel-past` | koʻk «＋ Yangi kontakt», eni toʻliq | oʻsha, pill; `≥960` da sarlavha qatoriga koʻchadi |

**Netto soʻzi mono boʻldi:** u summaning yorligʻi va summa bilan bitta qatorda turadi —
mono ikkovini bitta blok qilib bogʻlaydi.

| Qatlam | Joylashuv |
|---|---|
| Baza | Bitta ustun, qatorlar chetdan chetgacha |
| `≥600` | Ustun 640 px markazda |
| `≥960` | Ustun 640 px; «＋ Yangi kontakt» sarlavha qatorining oʻngida (0.4) |

Holatlar: toʻla roʻyxat · boʻsh roʻyxat (`.bosh-holat` ikki qatori) · qoʻshish bloki ochiq ·
ism maydonida xato · «Kontakt oʻchirildi» paneli turgan.

---

## 3. «Kontakt» sahifasi

| Element | Oldin | Keyin |
|---|---|---|
| `.panel-tepa` | 3 katak: «‹ Orqaga» / ism / «Tahrirlash» | **oʻzgarmaydi** (ichkari sarlavha, 0.3); `‹` SVG bilan (0.6) |
| `.netto-blok` | soʻz 14 + raqam 28/700 | soʻz `yorliq` (mono 13), raqam `raqam-katta` (Space Grotesk 600, 30–40 px) |
| `.ochiq-qarz-yoq` | 14 `matn-ikkinchi` | oʻsha |
| `.qarz-kartochka` | radius 10, ichki chekka 12/16 | **radius 24**, ichki chekka 20 (`≥600`: 24), 1 px `chegara`, soya yoʻq |
| `.qarz-yonalish` | 16/600 | `matn-kuchli` |
| `.qarz-qoldiq` | 17/600 | **mono 700, 15 px** |
| `.qarz-yopilgan` | 14 `matn-ikkinchi` | **`yorliq` roli** (mono 13) — «Yopilgan» soʻzi raqam oʻrnida turadi va mono ustunda qoladi |
| `.kartochka-ikkinchi` | 14 `matn-ikkinchi` | oʻsha (`14-avgust · Karta · boshlangʻich 1 000 000 soʻm`) |
| `.tolovlar` | kartochka ichida, chiziqsiz | ustida 1 px `chegara`, ustki boʻshliq 16 px |
| `.tolov-sana` | 16 | `matn` |
| `.tolov-summa` | 16, rangsiz | **mono 400, 15 px**, rangsiz (qoida oʻzgarmaydi) |
| `.tolov-havola` («＋ Toʻlov») | koʻk havola | oʻsha, `plus` SVG bilan |
| `.kontakt-ochirish` | xavfli tugma, 10 px radius | xavfli tugma, pill, 1.5 px `chiqim` |
| `.kontakt-bloki` (tahrirlash) | oq blok | blok qolipi (`yuza-past`, radius 16) |

**Toʻlov summasi mono 400** — qarz qoldigʻi (700) bilan bitta ustunda turadi, lekin
yengilroq: toʻlov qarzning tafsiloti, uning oʻzi emas.

| Qatlam | Joylashuv |
|---|---|
| Baza | Bitta ustun; netto bloklari ustma-ust; qarz kartochkalari orasi 12 px |
| `≥600` | Ustun 640 px; **netto bloklari ikki ustunda** (ikki valyuta boʻlsa yonma-yon); kartochkalar orasi 16 px |
| `≥960` | Ustun 640 px; «＋ Yangi qarz» — yuqori panel **ostidagi** qatorda, oʻngga tekis (0.4 istisnosi) |

Holatlar: ochiq qarzlar bor · faqat yopilgan qarzlar · umuman qarz yoʻq (`.bosh-holat`) ·
toʻlovsiz qarz («Hali toʻlov yoʻq.») · tahrirlash bloki ochiq · «Ochiq qarzi bor kontakt
oʻchirilmaydi…» xatosi · «Qarz oʻchirildi» / «Toʻlov oʻchirildi» paneli.

---

## 4. «Hisobot»

| Element | Oldin | Keyin |
|---|---|---|
| `.panel-tepa` | oq bar | sahifa sarlavhasi (0.3) |
| `.davr-qatori` | sticky, foni `fon` (kulrang), tagida chiziq | sticky, foni **oq**, tagida 1 px `chegara`; ichki chekka 12/`--yon` |
| `.oy-nomi` | 16/600 | **Space Grotesk 600, 20 px**, `-0.02em` — davr ekranning mavzusi |
| `.davr-matni` | 16/600 | Space Grotesk 600, 18 px, tabular |
| `.belgi-tugma` (`‹`/`›`) | matn belgisi | `chevron-left`/`chevron-right` SVG, 44 × 44 doira; oʻchiq holatda `matn-ochiq` |
| `.davr-havola` | koʻk havola, oʻngda | oʻsha |
| `.davr-bloki` | oq, 1 px chegara, radius 10 | blok qolipi: `yuza-past`, radius 16, chegarasiz |
| `.kartochka` | radius 10, ichki chekka 12/16 | **radius 24**, ichki chekka 20 (`≥600`: 24, `≥960`: 32) |
| `.kartochka-sarlavha` | 16/600 Hanken | `kartochka-sarlavha` roli (Space Grotesk 500, 17) |
| `.jami-yorliq` `.yorliq` | 13 `matn-ikkinchi` | `yorliq` roli (mono 13) |
| `.jami-summa` | 17/600 | **mono 700, 15 px** |
| `.taxminiy-jami` | 16, `matn` | oʻsha, mono 400 — u ham summa |
| `.taxminiy-izoh` | 13 `matn-ikkinchi` | oʻsha |
| `.guruh-sarlavha` («soʻm»/«dollar») | 14 `matn-ikkinchi` | `yorliq` roli (mono 13) |
| `.ajratma-nomi` (kategoriya nomi) | 16 | `matn` (Hanken 400) |
| `.qarz-summalar` ichidagi summalar | 17/600 | mono 700, 15 px |
| `.kartochka-izoh` (qarz izohi) | 13 `matn-ikkinchi` | oʻsha |
| `.kurs-sorov` | oq | blok qolipi: `yuza-past`, radius 16, ichki chekka 16 |

### Joylashuv

```
≥960 (1280, ustun 1040)
  Hisobot                                        ← sarlavha 32 px (asosiy tugma yoʻq)
  ┌──────────────────────────────────────────────────────────┐
  │   ‹      avgust      ›                       Davr tanlash │  davr qatori: sticky
  └──────────────────────────────────────────────────────────┘
  ┌────────────────────────────┐  ┌──────────────────────────┐
  │ Jami kirim   +8 000 000 s. │  │ Qarz                     │
  │ Jami chiqim  −2 950 000 s. │  │ Qarzga berildi  −1 000 … │
  │ Farq         +5 050 000 s. │  │ Qarzdan qaytdi  +300 000 │
  └────────────────────────────┘  │ Qarz summalari jami …    │
  ┌────────────────────────────┐  └──────────────────────────┘
  │ Chiqim — kategoriyalar …   │  ┌──────────────────────────┐
  │ oziq-ovqat    −800 000 soʻm│  │ Kirim — kategoriyalar …  │
  │ transport     −300 000 soʻm│  │ oylik    +8 000 000 soʻm │
  └────────────────────────────┘  └──────────────────────────┘
```

| Qatlam | Joylashuv |
|---|---|
| Baza | Bitta ustun; davr qatori yuqorida sticky; kartochkalar ustma-ust, orasi 16 px |
| `≥600` | Ustun 640 px; **«Chiqim — …» va «Kirim — …» kartochkalari yonma-yon** (`1fr 1fr`, `align-items: start`); jami va qarz bloklari toʻliq enda |
| `≥960` | Ustun 1040 px, ikki ustunli grid: chapda «Jami» va «Chiqim — …», oʻngda «Qarz» va «Kirim — …». Davr qatori ikkala ustunni qamraydi va sticky qoladi |

**Nega desktopda «Qarz» oʻngda yuqorida:** chap ustun hisobning oʻzi (jami → chiqim
ajratmasi), oʻng ustun esa jamiga kirmaydigan pul harakati; ikkalasi yonma-yon turganda
«qarz jamiga qoʻshilmagan» degan izoh koʻz bilan ham koʻrinadi.

Holatlar: toʻla davr · boʻsh davr (nol raqamlar + uchta «Bu davrda … yoʻq.» qatori +
«Boshqa davrni yuqoridan tanlang.») · daftar butunlay boʻsh · yarim boʻsh davr · davr
holati (oy oʻrnida «1-avgust — 15-avgust» va «Oyga qaytish») · davr bloki ochiq ·
kurs soʻrovi bloki ochiq · «≈ hisoblanmadi» xato qatori.

---

## 5. «Zaxira»

| Element | Oldin | Keyin |
|---|---|---|
| `.panel-tepa` | oq bar | sahifa sarlavhasi (0.3) |
| `.kartochka` | radius 10 | radius 24, ichki chekka 20/24/32 |
| `.zaxira-holat` | 14 `matn-ikkinchi` | **`yorliq` roli** (mono 13): «Oxirgi zaxira: 16-avgust» — sana yorligʻi |
| `.zaxira-ogoh` 1-qator | 16, `matn`, «oʻrniga» 600 | oʻsha (**qizil emas** — qoida oʻzgarmaydi) |
| `.zaxira-ogoh` 2-qator | 14 `matn-ikkinchi` | oʻsha |
| `.asosiy-tugma` («Eksport») | koʻk, radius 10, eni toʻliq | koʻk pill, eni toʻliq (bazada), `≥600` da mazmun boʻyicha |
| `.ikkinchi-tugma` («Import») | 1 px `chegara` | 1.5 px `chegara-kuchli`, pill; hover'da siyoh fon + oq matn |
| `.zaxira-oqim` | ustida 1 px chiziq | **blok qolipi**: `yuza-past`, radius 16, ichki chekka 16, ustki chiziq yoʻq |
| `.zaxira-kuchli` | 16/600 | `matn-kuchli` |
| `.zaxira-sanoq` | 14, tabular | **mono 400, 14 px** — «128 yozuv · 12 kontakt · 9 qarz · 14 toʻlov» sanoq qatori |
| Fayl nomlari qatori | 13 `matn-ikkinchi` | **mono 13**, `overflow-wrap: anywhere` — fayl nomi qisqartirilmaydi va kesilmaydi |
| `.zaxira-xato` 1-qator | 13 `chiqim` | oʻsha, yangi `chiqim` qiymati |
| `.zaxira-xato` 2-qator | 13 `matn-ikkinchi` | oʻsha («Daftardagi maʼlumot oʻzgarmadi.») |

**Fayl nomi mono:** `daftar-import-oldidan-2026-08-17-1435.json` — odam uni fayl
tanlagichdagi nom bilan **belgi-belgi** solishtiradi (0041 tasdiq qadami). Mono shu
solishtirishni mumkin qiladi.

| Qatlam | Joylashuv |
|---|---|
| Baza | Bitta ustun; ikkita kartochka ustma-ust, orasi 16 px |
| `≥600` | Ustun 640 px; **ikkita kartochka yonma-yon** (`1fr 1fr`, `align-items: start`) |
| `≥960` | Ustun 1040 px; oʻsha ikki ustun, orasi 24 px. Bu ekranda asosiy tugma paneli yoʻq — sarlavha qatorining oʻng katagi boʻsh |

**Nega `≥600` da yonma-yon:** ikkita mustaqil ish; ustma-ust turganda «Import» ekrandan
tushib qoladi va odam uni topolmaydi. Import oqimi ochilganda **chap kartochka joyida
qoladi** — oxirgi eksport sanasi oʻsha lahzada yangilanadi va odam buni koʻrishi kerak
(0054).

Holatlar: tinch holat · «Hali zaxira olinmagan.» · eksportdan keyin («Fayl yuklab
olindi: …») · import 2-qadam · 3-qadam · muvaffaqiyat (sanoq qatori) · beshta xato holati ·
bekor qilingan oqim · boʻsh daftar varianti.

---

## 6. Formalar — «Yangi yozuv», «Yangi qarz», «Toʻlov»

Uchalasi bitta qolipda. Farqlari oxirida.

### 6.1. Umumiy qolip

| Element | Oldin | Keyin |
|---|---|---|
| `.panel-tepa` | `×` chapda, sarlavha markazda | oʻsha; `×` — 44 × 44 `belgi-tugma`, ichida `x` SVG; sarlavha `forma-sarlavha` (Grotesk 500, 18) |
| `.forma` | bloklar orasi 24 px | oʻsha; ustki chekka 24 px |
| `.yorliq` | 13, `matn-ikkinchi` | **`yorliq` roli** (mono 13, `+0.06em`) |
| `.summa-maydon` | 56 px, radius 10 | **64 px**, radius 10, 1 px `chegara` |
| `.summa-kirit` | 28/700 tizim shrifti | **Space Mono 700**, `clamp(28px, 7vw, 34px)`, tabular |
| `.valyuta-sozi` | 16 `matn-ikkinchi` | `kichik` (14), `matn-ikkinchi` |
| `.maydon` | 48 px, radius 10, ichki chekka 12 | oʻsha, ichki chekka **14 px** |
| `.segment` | ikki katak, 48 px, radius 10 | **pill yoʻlak**: foni `yuza-past`, balandligi 52 px, ichki chekka 4 px, radius pill |
| `.segment-bolak` | radius 8 | pill; tanlanmagan — shaffof + `matn-ikkinchi`; tanlangan — `kirim`/`chiqim` fon + oq matn 600 |
| `.chip` | 40 px, 1 px `chegara` | **44 px**, 1.5 px `chegara-kuchli`, ichki chekka 18 px |
| `.chip-tanlangan` | `harakat-fon` + `harakat` | oʻsha, yangi qiymatlarda (`#EBEEFF` / `#0029FF`) |
| `.chip-ochiq` | foni `fon` | foni `yuza-past`, chegarasiz |
| `.sana-tanlagich` | 48 px, radius 10 | oʻsha; matni `matn`, tabular |
| `.xato-matni` | 13 `chiqim` | oʻsha, yangi `chiqim` |
| `.yordam` | 13 `matn-ikkinchi` | oʻsha |
| `.panel-past` + `.asosiy-tugma` | koʻk, radius 10 | koʻk pill; `≥600` da yopishishdan toʻxtaydi |
| `.kurs-blok` ochilishi | 150 ms soʻnish | 320 ms soʻnish + 4 px koʻtarilish; `prefers-reduced-motion` da yoʻq |

### 6.2. Joylashuv

```
baza (390)                         ≥600 (forma kartochkasi, 560)
┌──────────────────────────┐        ┌────────────────────────────────┐
│ ×      Yangi yozuv       │        │ ×        Yangi yozuv           │
├──────────────────────────┤        ├────────────────────────────────┤
│ ┌──────────────────────┐ │        │  ┌──────────────────────────┐  │
│ │ 0               soʻm │ │        │  │ 0                   soʻm │  │
│ └──────────────────────┘ │        │  └──────────────────────────┘  │
│ (  Chiqim  │  Kirim   )  │        │  (   Chiqim   │   Kirim     )  │
│                          │        │                                │
│ KATEGORIYA   Boshqarish  │        │  KATEGORIYA        Boshqarish  │
│ ( oziq-ovqat )( transport)│       │  ( oziq-ovqat )( transport )   │
│ …                        │        │  …                             │
│                          │        │  [        Saqlash          ]   │
├──────────────────────────┤        └────────────────────────────────┘
│ [        Saqlash       ] │
└──────────────────────────┘
```

| Qatlam | Joylashuv |
|---|---|
| Baza | Toʻliq eni; «Saqlash» pastda yopishgan panelda |
| `≥600` | `.ekran-forma`: eni 560 px, markazda, tepadan 40 px; oq fon, 1 px `chegara`, radius 24 px; ichki chekka 24 px. «Saqlash» — kartochkaning oxirgi qatori, eni toʻliq, yopishmaydi |
| `≥960` | Oʻsha kartochka; tepadan 88 px (nav pill joyi) + 40 px |

**Nega formada tugma toʻliq enida qoladi:** forma bitta ish uchun ochiladi va «Saqlash» —
uning yagona chiqish yoʻli; toʻliq enli tugma bu yoʻlni ikkilanmasdan koʻrsatadi. Bu
`≥960` dagi sarlavha qatoriga koʻchish qoidasidan istisno, chunki formada navigatsiya ham,
sahifa sarlavhasi ham yoʻq.

### 6.3. Formalar orasidagi farq

| Forma | Qoʻshimcha |
|---|---|
| **Yangi yozuv / Yozuvni tahrirlash** | Kategoriya chiplari oʻralib bir necha qatorga tushadi (orasi 8 px). «Boshqarish» — `.blok-boshi` ning oʻng chekkasida, `yorliq` bilan bitta qatorda |
| **Yangi qarz / Qarzni tahrirlash** | `.qarz-kontakt` («Kontakt: Akmal») — `yorliq` roli (mono 13), summa maydonining ustida. Kurs maydoni yoʻq |
| **Toʻlov** | `.qarz-qatori` ikki qator: «Kontakt: Akmal» (mono 13) va «Qarz qoldigʻi: 700 000 soʻm» (**mono 13**, summa mono boʻlgani uchun qoldiq ham mono). Kurs maydoni ostidagi «Qarzdan ayiriladi: 50,00 $» — `mayda`, `matn-ikkinchi`, summasi mono |

Holatlar (har uchala formada): boʻsh forma · toʻldirilgan forma · tahrirlash rejimi ·
kurs maydoni ochiq · valyuta muzlatilgan (chip `oʻchiq` + yordam qatori) · har bir xato
qatori · saqlash ketayotgan lahzada tugma oʻchiq.

---

## 7. «Kategoriyalar»

| Element | Oldin | Keyin |
|---|---|---|
| `.panel-tepa` | «‹ Orqaga» + markazdagi sarlavha | oʻsha (ichkari sarlavha); `‹` SVG bilan (0.6) |
| `.segment` | ikki katak | pill yoʻlak (6.1). **Tanlangan boʻlak bu yerda semantik emas** — «Chiqim»/«Kirim» roʻyxatni tanlaydi, shuning uchun tanlangan boʻlak **oq pill + `matn` 600 + `--soya-yengil`** (HEAD `.toggle` naqshi), rang bermaydi |
| `.kategoriya-qatori` | oq qator, tagida chiziq | oʻsha, oq varaqda; hover `yuza-past` |
| `.kategoriya-nomi` | 16 | `matn` |
| `.ochiq-rang` (yashirilgan nom) | `matn-ochiq` | **`matn-ikkinchi`** (`design/uslub.md`: `matn-ochiq` matn tashimaydi) |
| «Yashirish» / «Koʻrsatish» | matn-havola | oʻsha, koʻk |
| `.yashirilgan-sarlavhasi` | 14, foni `fon` | **`yorliq` roli** (mono 13), foni oq, ustida 1 px `chegara` |
| `.qoshish-qatori` | oq | blok qolipi (`yuza-past`, radius 16, ichki chekka 16) |
| `.panel-past` | koʻk «＋ Yangi kategoriya» | koʻk pill; `≥960` da sarlavha qatoriga koʻchmaydi — bu ekranda sahifa sarlavhasi yoʻq, panel pastda qoladi |

**Nega bu segment rangsiz:** «Chiqim»/«Kirim» bu yerda yozuvning turi emas, **roʻyxat
tanlagichi**. Rang berilsa uch belgi qoidasi maʼnosini yoʻqotardi: bu yerda tanlov pul
haqida hech narsa aytmaydi.

Holatlar: ikkala roʻyxat · yashirilganlar bor · yashirilganlar yoʻq (boʻlim koʻrinmaydi) ·
qoʻshish qatori ochiq · uchta xato matni · boʻsh roʻyxat (`.kategoriya-bosh`).

---

## 8. «Qaytarish» paneli — hamma ekranda bir xil

| Element | Oldin | Keyin |
|---|---|---|
| `.qaytarish-paneli` | foni `#1A1D21`, radius 10, soya `rgba(0,0,0,.24)` | foni **`#0B1330`** (ink-navy), radius 16, `--soya-orta` |
| Eni | yon chekkalardan 16 px, koʻpi bilan ustun eni | koʻpi bilan **480 px**, markazda, yon chekkalardan `--yon` |
| Matn | oq 16 | oq `matn` (Hanken 400) |
| `.qaytarish-tugma` | oq 600, radius 8 | **pill**, 1.5 px `rgba(255,255,255,.28)` chegara, oq 600, balandligi 44 px |
| Oʻrni | pastdagi panellar ustida | oʻsha (`design/uslub.md`, «Pastdagi panellar tartibi»); `≥960` da pastdan 24 px, markazda |

Muddat (7 soniya), xulq va matnlar oʻzgarmaydi.

---

## 9. Sinf nomlari — nima qoʻshiladi

Mavjud sinf nomlari **saqlanadi**. Yangi qoʻshiladiganlar toʻrtta:

| Sinf | Vazifasi |
|---|---|
| `.faqat-oquvchiga` | tugma nomidagi belgini koʻrinmas qiladi, lekin yordamchi daraxtda qoldiradi (`.fayl-kirit` retsepti) |
| `.ic` | inline SVG oʻlchami va tekislanishi (`flex: none`, `width/height`, `vertical-align`) |
| `.ekran-keng` | `≥960` da ustun eni `--ustun-keng` (Dashboard, Hisobot, Zaxira) |
| `.ekran-forma` | `≥600` da forma kartochkasi (YozuvForma, QarzForma, TolovForma) |

Olib tashlanadigan sinf yoʻq. `.nav-matn-kichik` / `.nav-matn-mayda` qoladi (qoida
oʻzgarmaydi: bandlar toʻrttadan koʻp → `mayda`).

---

## 10. Bajarish tartibi

Har qadam oxirida testlar toʻliq yashil boʻlishi shart — qadam katta emas, orqaga qaytish
oson boʻlsin.

1. **Shrift.** Olti `woff2`, `@font-face`, precache. Ekran hali eski koʻrinishda, faqat
   shrift almashadi — birinchi haqiqiy tekshiruv shu yerda (glif toʻplami, `ʻ` va `gʻ`).
2. **Tokenlar.** `:root` qayta yoziladi, `background_color` oʻzgaradi. Ekran shakli
   eskicha, rang va oʻlcham yangicha.
3. **Umumiy komponentlar:** tugma, maydon, chip, segment, kartochka, roʻyxat qatori,
   holatlar (fokus, xato, oʻchiq), «qaytarish» paneli.
4. **Ikonka:** `.faqat-oquvchiga` va `.ic`, toʻrtta SVG. Testlarni shu yerda alohida
   chopish kerak — tugma nomlari tegilmagani shu qadamda tekshiriladi.
5. **Navigatsiya:** pastdagi panel (faol band tint pill) va `≥960` dagi yuqori pill.
6. **Sarlavhalar:** sahifa sarlavhasi / ichkari sarlavha ajratmasi va `≥960` dagi
   sarlavha-qator gridi.
7. **Ekranlar, bittalab:** Bosh sahifa → Yozuvlar → Qarz daftari → Kontakt → Hisobot →
   Zaxira → uch forma → Kategoriyalar.
8. **Responsive tekshiruv:** 320, 390, 600, 768, 960, 1280 px — har ekran, har holat.
9. **«Keyin» suratlari:** `design/redesign/after/` ga, «oldin» bilan bir xil kesimda
   (mobil 390 va desktop 1280).
