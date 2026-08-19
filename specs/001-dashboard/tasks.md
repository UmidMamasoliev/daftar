# Tasks: Dashboard — bosh sahifa

**Input**: Design documents from `/specs/001-dashboard/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: MAJBURIY — constitution I (Test avval): har vazifa qizil testdan boshlanadi,
yashil natija haqiqiy buyruq chiqishi bilan koʻrsatiladi.

**Organization**: Vazifalar user story boʻyicha; hamma yoʻl `platform/` ichida.

## Phase 1: Setup

- [X] T001 Boshlangʻich holatni qayd etish: `platform/` da `npx vitest run` va `npx tsc --noEmit`
      yashil ekanini tasdiqlash (1023 test) — oʻzgarishlar toza asosdan boshlansin

## Phase 2: Foundational (hamma story shu poydevorga quriladi)

**⚠️ CRITICAL**: US-fazalar boshlanishidan oldin tugashi shart

- [X] T002 Navigatsiya qayta tuziladi (FR-013, Clarifications B) — test avval:
      `src/ui/Navigatsiya.test.tsx` da yangi kutish (bandlar: Bosh, Yozuvlar, Qarz daftari,
      Hisobot, Zaxira; «Yozuv» bandi YOʻQ) → qizil; soʻng `src/ui/Navigatsiya.tsx` da
      `Bolim` tipidan `'yozuv'` chiqib `'bosh'` kiradi, `src/ui/matnlar.ts` da
      `NAVIGATSIYA.bosh: 'Bosh'` qoʻshiladi → yashil
- [X] T003 App poydevori: `src/App.tsx` da `Ekran` tipiga `'bosh'`, boshlangʻich ekran
      `'bosh'` (FR-001), `NAVLI_EKRANLAR` ga `'bosh'`, `navigatsiyaOtishi` yangi bandlar
      bilan; YozuvForma qaytish yoʻli `formaManbai: 'bosh' | 'yozuvlar'` (dashborddan
      ochilgani dashboardga qaytadi); vaqtinchalik boʻsh `src/ui/Dashboard.tsx` karkasi;
      mavjud App testlari (`src/App.test.tsx`, `App.qarz.test.tsx`, `App.hisobot.test.tsx`,
      `App.zaxira.test.tsx`, poyga testlari) yangi navigatsiyaga moslanadi — forma endi
      «＋ Yozuv» tugmasidan ochiladi; yangi `src/App.dashboard.test.tsx` da mezon 1
      («ilova bosh sahifa bilan ochiladi, PIN yoʻq») testi
- [X] T004 Kurs soʻrash bloki umumlashtiriladi: `src/ui/KursSorov.tsx` YANGI — `Hisobot.tsx`
      dagi `KursBloki` + terish/kursor/xato holati koʻchiriladi; `src/ui/Hisobot.tsx` shu
      komponentni ishlatadi; `src/ui/Hisobot.test.tsx` oʻzgarishsiz yashil qoladi (xulqi
      oʻzgarmaydi — refaktor)

**Checkpoint**: Ilova «Bosh» bilan ochiladi, hamma eski test yashil

---

## Phase 3: User Story 1 — Pulni bir qarashda koʻrish (P1) 🎯 MVP

**Goal**: Ochilganda darhol qoldiq: valyuta boʻyicha, naqd/karta boʻlinishi bilan

**Independent Test**: Yozuv/qarz kiritib qoldiq qatorlarini qoʻlda hisob bilan solishtirish

- [X] T005 [US1] `src/ui/Dashboard.test.tsx` — qoldiq kartochkasi mezonlari qizil testlar:
      boʻsh daftarda nol va xatosiz (mezon 2), soʻm/dollar alohida qator (12), naqd/karta
      qatorlari (12a), naqdda dollar boʻlmasa koʻrsatkich chizilmaydi (12c), qarz qoldigʻi
      alohida raqam sifatida YOʻQ (11)
- [X] T006 [US1] `src/ui/Dashboard.tsx` qoldiq kartochkasi: umumiy qoldiq (`raqam-katta`),
      naqd/karta qatorlari; `src/ui/matnlar.ts` ga `DASHBOARD` matnlari; `src/index.css` ga
      yetishmagan sinflar (uslub qiymatlari bilan) → T005 yashil
- [X] T007 [US1] `src/App.tsx` — `'bosh'` effekti navbat orqali `qoldiqlarniOl()`,
      `qoldaKurslarniOl()`→`oxirgiKursniOl(...)`, `oxirgiEksportniOl()` oʻqiydi va
      Dashboard'ga props beradi; `src/App.dashboard.test.tsx` da oqim mezonlari (avval
      qizil): chiqim → qoldiq kamayadi (3), kirim → ortadi (4), qarz berildi → kamayadi (5),
      olindi → ortadi (6), naqd+karta = umumiy (12b)
- [X] T008 [US1] `e2e/dashboard.spec.ts` — ochilishda PIN yoʻq va dashboard koʻrinadi
      (mezon 1), internet oʻchirilganda ochiladi va qoldiq koʻrsatadi (mezon 21,
      `e2e/oflayn.spec.ts` naqshi)

**Checkpoint**: US1 mustaqil ishlaydi — MVP tayyor

---

## Phase 4: User Story 2 — «≈ jami soʻmda» va kurs soʻrovi (P2)

**Goal**: Taxminiy jami taxminiyligi bilan; kurs bir marta soʻraladi

**Independent Test**: Dollar bor / kurs yoʻq daftarda soʻrov chiqishi, kiritilgach jami

- [X] T009 [US2] `src/ui/Dashboard.test.tsx` — qizil testlar: «≈ jami soʻmda» taxminiy
      belgisi bilan (mezon 13), `kurs-kerak` holatida KursSorov koʻrinadi, `hisoblanmadi`
      holati xabari, dollar yoʻq boʻlsa ≈ qatori umuman yoʻq
- [X] T010 [US2] `src/ui/Dashboard.tsx` — `TaxminiyJami` koʻrsatish (`taxminiyMatni`,
      `taxminiyIzohi`, `kursMatni`) va `KursSorov` ulanishi → T009 yashil
- [X] T011 [US2] `src/App.tsx` — `kursniSaqla` (0043: `qoldaKursniQoy(kurs, bugun())` +
      qayta oʻqish); `src/App.dashboard.test.tsx` da: kurs soʻraladi va kiritilgach jami
      chiqadi (mezon 14), qayta ochilganda soʻralmaydi (14a), maydonga kasr tushmaydi (14b),
      eng kech sanali kurs gʻolib (FR-006)

---

## Phase 5: User Story 3 — Oy qanday ketyapti (P2)

**Goal**: Joriy kalendar oy kirimi va chiqimi

**Independent Test**: Joriy va oʻtgan oyga yozuv kiritib faqat joriy oy yigʻindisini koʻrish

- [X] T012 [P] [US3] `src/domain/dashboard.test.ts` — `oyYigindilari` qizil testlar:
      kirim yigʻindisi (mezon 7), chiqim yigʻindisi (8), oʻtgan oy kirmaydi (9), valyuta
      boʻyicha alohida qatorlar (soʻm avval), boʻsh boʻlak → `{som, 0}` qatori
- [X] T013 [US3] `src/domain/dashboard.ts` — `oyYigindilari(yozuvlar, davr)` mavjud
      `davrgaKiradimi` bilan → T012 yashil
- [X] T014 [US3] `src/ui/Dashboard.tsx` + `Dashboard.test.tsx` — «Joriy oy» kartochkasi:
      kirim/chiqim qatorlari ishora-rang qoidasi bilan (`nettoMatni`/`nettoSinfi`);
      `src/App.tsx` `joriyOyDavri()` bilan ulaydi

---

## Phase 6: User Story 4 — Oxirgi yozuvlar va yangi yozuv (P3)

**Goal**: Oxirgi 5 yozuv, doim koʻrinadigan «＋ Yozuv», toʻliq roʻyxatga yoʻl

**Independent Test**: Yozuv qoʻshib roʻyxatda darhol koʻrish; tugma va havolani bosish

- [X] T015 [US4] `src/ui/Dashboard.test.tsx` — qizil: roʻyxat eng koʻpi 5 ta va yangisi
      yuqorida (FR-009), yangi yozuv darhol koʻrinadi (mezon 10 — props orqali), «＋ Yozuv»
      chaqiradi (19), «Hammasi ›» chaqiradi (20), boʻsh holat matni; soʻng `Dashboard.tsx`
      da roʻyxat (Yozuvlar qatori koʻrinishida, bosilmaydi), pastki tugma paneli va havola
- [X] T016 [US4] `src/App.tsx` — «＋ Yozuv» → YozuvForma (`formaManbai='bosh'`), «Hammasi ›»
      → Yozuvlar ekrani; `src/ui/matnlar.ts` da `YOZUVLAR.boshIkkinchi` VAQTINCHALIK izoh
      boʻyicha yangilanadi («…bosh sahifadagi «＋ Yozuv» tugmasi bilan…»);
      `src/App.dashboard.test.tsx` da mezon 10, 19, 20 oqim testlari

---

## Phase 7: User Story 5 — Zaxira eslatmasi (P3)

**Goal**: 30 kun / hech eksport boʻlmaganda bir qatorlik eslatma

**Independent Test**: Eksport sanasini oʻzgartirib eslatma holatlarini koʻrish

- [X] T017 [P] [US5] `src/domain/dashboard.test.ts` — `zaxiraEslatmasiKerakmi` qizil:
      `null` → bor (mezon 15), 29 kun → yoʻq (17), 30 kun → bor, 31 kun → bor (18); soʻng
      `src/domain/dashboard.ts` da funksiya → yashil
- [X] T018 [US5] `src/ui/Dashboard.tsx` + `Dashboard.test.tsx` — eslatma qatori (bosilmaydi,
      ikki matn varianti); `src/App.dashboard.test.tsx` da: eksportdan keyin yoʻqoladi
      (mezon 16 — zaxira ekranidan qaytganda qayta oʻqiladi), import eski sanani keltirsa
      darhol chiqadi (FR-012 izohi)

---

## Phase 8: Polish & Cross-Cutting

- [X] T019 Toʻliq darvozalar haqiqiy natija bilan: `npx vitest run` (3× barqarorlik),
      `npx tsc --noEmit`, `npm run build`, `npx playwright test` — hammasi yashil
- [X] T020 [P] Hujjatlar: `platform/KELISHUV.md` ga 27-boʻlim (dashboard domain
      funksiyalari); `design/uslub.md` navigatsiya boʻlimidan VAQTINCHALIK belgisi olinadi
      va yangi tartib yoziladi; `src/App.tsx`, `src/ui/Navigatsiya.tsx`, `src/ui/matnlar.ts`
      dagi 0063 VAQTINCHALIK izohlari yangilanadi; `prds/dashboard.md` ga oʻzgarish kerak
      boʻlsa (FR-009 dagi 5, navigatsiya) moslanadi
- [X] T021 [P] Qaror yoziladi: `decisions/0067-dashboard-navigatsiya.md` — «Yozuv» bandi
      olib tashlangani (odam tanladi, B), band nomi «Bosh», sarlavha «Daftar», roʻyxat 5 ta,
      eslatma bosilmasligi — sabablari bilan

## Dependencies

- Phase 2 (T002–T004) hamma US-fazadan oldin; T004 faqat US2 ga kerak, lekin refaktor erta
  qilinsa Hisobot regressiyasi erta koʻrinadi.
- US1 → US2 (taxminiy qator qoldiq kartochkasi ichida), US3/US4/US5 US1 dan keyin istalgan
  tartibda; oʻzaro mustaqil.
- T019 hamma US tugagach; T020/T021 T019 bilan parallel emas — hujjat yakuniy holatni yozadi.

## Parallel Example

- T012 va T017 (domain testlari) — bir faylda, lekin US3/US5 UI ishlaridan mustaqil;
  T020 va T021 [P] — har xil fayllar.

## Implementation Strategy

MVP = Phase 1–3 (US1): ilova bosh sahifa bilan ochiladi va qoldiqni toʻgʻri koʻrsatadi.
Keyin US2 → US3 → US4 → US5 tartibida, har fazadan keyin testlar yashil — istalgan nuqtada
toʻxtash mumkin boʻlgan yaxlit holat.
