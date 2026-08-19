# Implementation Plan: Dashboard — bosh sahifa

**Branch**: `001-dashboard` | **Date**: 2026-08-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-dashboard/spec.md`

## Summary

Dashboard — ilova ochilganda darhol koʻrinadigan bosh sahifa: qoldiq (valyuta boʻyicha,
naqd/karta boʻlinishi, «≈ jami soʻmda»), joriy oy kirim-chiqimi, oxirgi 5 yozuv, doim
koʻrinadigan «＋ Yozuv» tugmasi, zaxira eslatmasi va kurs soʻrovi. Maʼlumot qatlami toʻliq
tayyor (KELISHUV 1–26): ish asosan **ekran qatlamida** — yangi `Dashboard.tsx`, ikkita kichik
sof domain funksiyasi va navigatsiyaning qayta tuzilishi (Clarifications: «Yozuv» bandi
olib tashlanadi).

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 18

**Primary Dependencies**: Vite (+ vite-plugin-pwa), IndexedDB (bevosita, kutubxonasiz)

**Storage**: IndexedDB v4 — oʻzgarmaydi (yangi ombor kerak emas; sozlamalar doʻkoni bor)

**Testing**: Vitest + fake-indexeddb (unit/integratsiya, jsdom), Playwright (e2e, oflayn rejim bilan)

**Target Platform**: Brauzer, mobil-birinchi PWA (eng tor 320 px), oflayn ishlaydi

**Project Type**: Bitta veb-ilova — kod `platform/` ichida (`src/domain`, `src/data`, `src/ui`)

**Performance Goals**: Maʼlumot qurilmada — kutish holati yoʻq (uslub); qoʻshimcha maqsad yoʻq

**Constraints**: Oflayn-birinchi; pul butun sonda; faqat oʻzbekcha lotin; yangi rang/ikonka qoʻshilmaydi

**Scale/Scope**: 1 yangi ekran, 1 yangi domain fayli, navigatsiya oʻzgarishi, ~6 mavjud fayl tegadi

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Tamoyil | Holat | Izoh |
|---|---|---|
| I. Test avval | ✅ | Har vazifa qizil testdan boshlanadi; spec SC-007: 21 mezon test boʻladi |
| II. Oflayn, serversiz | ✅ | Faqat mavjud IndexedDB oʻqiladi; e2e oflayn tekshiruvi qoʻshiladi |
| III. Chegara qatʼiy | ✅ | Spec «Nima qilmaydi» roʻyxati bilan; eslatma bosilmaydi (Assumptions) |
| IV. Pul butun sonda | ✅ | Yangi hisob-kitob yoʻq — mavjud `xavfsizTaxminiyJami`, `qoldiqlar` ishlatiladi |
| V. Faqat oʻzbekcha | ✅ | Yangi matnlar `matnlar.ts` ga, dizayn uslubidagi qoidalar bilan |
| VI. Qarorlar majburiy | ✅ | 0020, 0023, 0024, 0036, 0042–0045, 0063, 0066 rejaga kiritilgan |

Buzilish yoʻq — Complexity Tracking boʻsh.

## Project Structure

### Documentation (this feature)

```text
specs/001-dashboard/
├── plan.md              # Shu fayl
├── research.md          # Phase 0 — texnik tanlovlar va sabablari
├── data-model.md        # Phase 1 — ekran modeli (yangi saqlanadigan tur YOʻQ)
├── quickstart.md        # Phase 1 — qanday tekshirib koʻrish
├── checklists/
│   └── requirements.md  # Spec sifat cheklisti (PASS)
└── tasks.md             # /speckit-tasks yaratadi
```

### Source Code (repository root)

```text
platform/src/
├── domain/
│   ├── dashboard.ts          # YANGI: oyYigindilari(), zaxiraEslatmasiKerakmi()
│   └── dashboard.test.ts     # YANGI: mezon 7–9, 15–18 ning sof qismi
├── ui/
│   ├── Dashboard.tsx         # YANGI: bosh sahifa ekrani
│   ├── Dashboard.test.tsx    # YANGI: mezon 2, 10–13, 19, 20
│   ├── KursSorov.tsx         # YANGI: kurs soʻrash bloki — Hisobot.tsx dan ajratib olinadi
│   ├── Hisobot.tsx           # OʻZGARADI: KursBloki oʻrniga KursSorov ishlatadi
│   ├── Navigatsiya.tsx       # OʻZGARADI: 'yozuv' bandi → 'bosh' bandi (FR-013)
│   └── matnlar.ts            # OʻZGARADI: DASHBOARD matnlari, NAVIGATSIYA.bosh
├── App.tsx                   # OʻZGARADI: 'bosh' ekrani, boshlangʻich ekran, forma qaytish yoʻli
├── App.dashboard.test.tsx    # YANGI: mezon 1, 3–6, 12b, 14, 14a, 14b oqim testlari
└── index.css                 # OʻZGARADI: dashboard kartochkalari uchun mavjud sinflar yetmasa

platform/e2e/
└── dashboard.spec.ts         # YANGI: mezon 1, 21 (oflayn), asosiy oqim
```

**Structure Decision**: Mavjud uch qatlam saqlanadi (domain → data → ui). Data qatlamiga
tegilmaydi: kerakli hamma oʻqish funksiyasi bor (`qoldiqlarniOl`, `oxirgiKursniOl`,
`oxirgiEksportniOl`, `qoldaKurslarniOl`, `hammaYozuvlar`). Dashboard maʼlumotni App
darajasida yigʻadi — hisobot ekrani naqshi bilan bir xil.

## Asosiy dizayn qarorlari (sof Spec Kit rejimida reja ichida hal qilinadi)

Loyihaning odatiy oqimida bularni dizayn agenti `design/dashboard.md` ga yozardi; Spec Kit
oqimida dizayn bosqichi yoʻq — qarorlar shu yerda, `design/uslub.md` qoidalariga tayangan
holda:

1. **Navigatsiya (FR-013, Clarifications):** bandlar «Bosh», «Yozuvlar», «Qarz daftari»,
   «Hisobot», «Zaxira». `Bolim` tipida `'yozuv'` → `'bosh'`. Ilova `'bosh'` bilan ochiladi.
2. **Ekran sarlavhasi:** «Daftar» — bosh sahifa ilovaning oʻzi; nav bandi esa qisqa «Bosh».
3. **Qoldiq kartochkasi:** tepada umumiy qoldiq valyuta boʻyicha (`raqam-katta` soʻm qatori,
   dollar qatori `summa` oʻlchamida), tagida «Naqd» va «Karta» qatorlari (har biri oʻz
   valyuta qiymatlari bilan, yoʻq valyuta chizilmaydi — mezon 12c), eng tagida
   «≈ jami soʻmda» + `taxminiy · 1 $ = …` izohi (mavjud `taxminiyMatni`/`taxminiyIzohi`).
   Qoldiq raqamlari rang olmaydi (`matn`) — bu holat, kirim/chiqim emas.
4. **Kurs soʻrovi:** Hisobotdagi `KursBloki` alohida `KursSorov.tsx` ga koʻchiriladi va
   ikkala ekran ham shu bitta komponentni ishlatadi (0043 oqimi bir xil: `kursniOqi` →
   `qoldaKursniQoy(kurs, bugun())`). Hisobot testlari yashil qolishi shart.
5. **Joriy oy kartochkasi:** «Joriy oy» sarlavha, «Kirim» va «Chiqim» qatorlari — valyuta
   boʻyicha, hisobotdagi ishora/rang qoidasi bilan (`nettoMatni`/`nettoSinfi`); qator
   boʻlmasa `0 soʻm`. Qarz harakati BU YERGA KIRMAYDI (FR-011 ruhi, 0017).
6. **Oxirgi yozuvlar:** eng koʻpi 5 ta (FR-009), `hammaYozuvlar('yangidan')` dan kesim;
   qator koʻrinishi Yozuvlar ekranidagi bilan bir xil matn qoidalarida, lekin **bosilmaydi**
   (tahrir yoʻli faqat Yozuvlar ekranida — PRD 15a). Tagida «Hammasi ›» matn-havolasi
   Yozuvlar ekraniga (mezon 20). Boʻsh holat matni matnlar.ts dagi VAQTINCHALIK izoh
   boʻyicha yangilanadi.
7. **Zaxira eslatmasi:** bir qatorlik, bosilmaydi (Assumptions); matni ikki holatga mos:
   hech eksport boʻlmagan / 30 kundan oshgan. Joyi — qoldiq kartochkasidan tepada emas,
   sarlavha ostida birinchi qator (koʻzga tashlansin, lekin raqamlarni siqmasin).
8. **«＋ Yozuv» tugmasi:** pastki asosiy tugma panelida (72 px, «＋ Yangi kontakt» naqshi),
   navigatsiya ustida doim turadi (mezon 19). Bosilsa YozuvForma ochiladi; forma yopilganda
   **ochilgan joyiga** qaytadi: dashboarddan ochilgani dashboardga, Yozuvlar ekranidan
   ochilgan tahrir Yozuvlarga (uslubdagi mavjud qoida).
9. **Maʼlumot oqimi:** App da `ekran === 'bosh'` effekti `qoldiqlarniOl()`,
   `qoldaKurslarniOl()` → `oxirgiKursniOl(qoldaKurslarManbalari(...))`,
   `oxirgiEksportniOl()` ni **navbat** orqali oʻqiydi (poyga himoyasi — mavjud naqsh);
   oy yigʻindilari `yozuvlar` holatidan sof funksiya bilan chiqadi. Hech narsa saqlanmaydi
   (0045 ruhi) — har oʻzgarishdan keyin qayta oʻqiladi/hisoblanadi.

## Phase 0/1 hujjatlari

- Texnik tanlovlar va muqobillar: [research.md](./research.md)
- Ekran modeli va yangi funksiya imzolari: [data-model.md](./data-model.md)
- Qoʻlda tekshirish yoʻli: [quickstart.md](./quickstart.md)
- `contracts/` YOʻQ: tashqi interfeys ochilmaydi — ichki shartnoma KELISHUV.md ga (yangi
  27-boʻlim sifatida) implement bosqichida yoziladi.

## Constitution Check — dizayndan keyin qayta

Oʻzgarish yoʻq: yangi saqlanadigan tur kiritilmadi, hamma hisob mavjud domain yoʻllaridan
oʻtadi, testlar rejaning har qadamida oldin yoziladi. ✅ GATE oʻtdi.
