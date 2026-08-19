# Feature Specification: Dashboard — bosh sahifa

**Feature Branch**: `001-dashboard`

**Created**: 2026-08-19

**Status**: Draft

**Input**: User description: "Dashboard — ilovaning bosh sahifasi. Manba spec: prds/dashboard.md.
Joriy qoldiq (valyuta boʻyicha, naqd/karta boʻlinishi, ≈ jami soʻmda), joriy oy kirim-chiqimi,
oxirgi yozuvlar, doim koʻrinadigan yozuv qoʻshish tugmasi, zaxira eslatmasi, kurs soʻrovi.
Qarz qoldigʻi alohida koʻrsatilmaydi; qidiruv/filtr/budjet/oʻtgan oy solishtiruvi yoʻq."

## Clarifications

### Session 2026-08-19

- Q: Dashboard bosh sahifa boʻlgach pastki navigatsiya qanday tuziladi — «Yozuv» (forma) bandi navda qoladimi? → A: B — «Yozuv» bandi olib tashlanadi; yozuv qoʻshish faqat dashboarddagi doim koʻrinadigan tugmadan. Navigatsiya: Bosh (dashboard), Yozuvlar, Qarz daftari, Hisobot, Zaxira (5 band); band nomi «Bosh» — 0067.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pulni bir qarashda koʻrish (Priority: P1)

Foydalanuvchi ilovani ochadi va hech qanday parol yoki PIN soʻralmasdan darhol bosh sahifani
koʻradi: qancha puli borligi valyuta boʻyicha (soʻm, dollar) alohida qatorlarda, tagida naqd va
karta qoldiqlari, eng tagida «≈ jami soʻmda» taxminiy qatori.

**Why this priority**: Bu ekranning mavjudlik sababi — «bir qarashda pul qanchaligini koʻrish»
(PRD 26). Qolgan hamma narsa shu asosga qoʻshiladi.

**Independent Test**: Yozuv va qarz kiritilgan daftarda ilovani ochib, qoldiq qatorlarini
qoʻlda hisoblangan qiymatlar bilan solishtirish orqali mustaqil tekshiriladi.

**Acceptance Scenarios**:

1. **Given** ilova yopiq, **When** foydalanuvchi uni ochadi, **Then** parol/PIN soʻralmaydi va dashboard darhol koʻrinadi.
2. **Given** boʻsh daftar, **When** dashboard ochiladi, **Then** qoldiq nol boʻlib koʻrinadi va ekran xato bermaydi.
3. **Given** daftar boʻsh, **When** soʻmda chiqim yozuvi qoʻshiladi, **Then** qoldiq shu summaga kamayadi (kirim boʻlsa — ortadi).
4. **Given** daftar, **When** qarz beriladi, **Then** qoldiq shu summaga kamayadi; qarz olinsa — ortadi.
5. **Given** soʻm va dollar yozuvlari bor, **When** dashboard koʻrinadi, **Then** soʻm va dollar qoldiqlari alohida qatorlarda turadi.
6. **Given** har qanday holat, **When** qoldiqlar koʻrinadi, **Then** naqd va karta qoldiqlarining yigʻindisi umumiy qoldiqqa teng.
7. **Given** naqdda dollar yoʻq, **When** naqd qatori koʻrinadi, **Then** naqd qatorida dollar koʻrsatkichi chizilmaydi.
8. **Given** qarzlar mavjud, **When** dashboard koʻrinadi, **Then** qarz qoldigʻi alohida raqam sifatida KOʻRINMAYDI (u oʻz boʻlimida).
9. **Given** internet oʻchirilgan, **When** ilova ochiladi, **Then** dashboard ochiladi va qoldiqni koʻrsatadi.

---

### User Story 2 - «≈ jami soʻmda» va kurs soʻrovi (Priority: P2)

Aralash valyutada foydalanuvchi qoldiqlar tagida bitta taxminiy jamini soʻmda koʻradi. Dollar
bor-u kurs hali hech qachon kiritilmagan boʻlsa, ilova jami hisoblashdan oldin kursni bir marta
soʻraydi (butun soʻmda) va sanasi bilan saqlaydi.

**Why this priority**: Taxminiy jami — qoldiq blokining qismi, lekin P1siz ham ekran ishlaydi;
kurs soʻrovi faqat shu qatorga xizmat qiladi.

**Independent Test**: Dollar yozuvi bor, kurs kiritilmagan daftarda dashboard ochib kurs
soʻrovi chiqishi, kiritilgach jami koʻrinishi va qayta ochilganda soʻrov takrorlanmasligi bilan
tekshiriladi.

**Acceptance Scenarios**:

1. **Given** aralash valyuta va maʼlum kurs, **When** dashboard koʻrinadi, **Then** «≈ jami soʻmda» qatori taxminiy ekani belgilangan holda koʻrinadi.
2. **Given** dollar bor, kurs hech qachon kiritilmagan, **When** taxminiy jami hisoblanishidan oldin, **Then** kurs soʻraladi; kiritilgach jami toʻliq chiqadi.
3. **Given** kurs bir marta kiritilgan, **When** ilova qayta ochiladi, **Then** kurs qayta soʻralmaydi.
4. **Given** kurs soʻrovi maydoni, **When** kasrli qiymat kiritilmoqchi boʻlinadi, **Then** qabul qilinmaydi — faqat butun soʻm.
5. **Given** yozuv yoki toʻlovda yangiroq sanali kurs bor, **When** jami hisoblanadi, **Then** eng kech sanali kurs ishlatiladi (bir xil sanada oxirgi kiritilgani gʻolib).

---

### User Story 3 - Oy qanday ketyapti (Priority: P2)

Foydalanuvchi bosh sahifada joriy kalendar oyning kirimi va chiqimini ikkita raqam sifatida
koʻradi.

**Why this priority**: «Oy qanday ketayotganini koʻrish» — PRDdagi ikkinchi asosiy savol,
lekin qoldiqsiz mazmuni yoʻq, shuning uchun P1 dan keyin.

**Independent Test**: Joriy va oʻtgan oyga yozuvlar kiritib, faqat joriy oy yigʻindilari
koʻrinishini tekshirish bilan mustaqil sinaladi.

**Acceptance Scenarios**:

1. **Given** joriy oyda kirim yozuvlari, **When** dashboard koʻrinadi, **Then** joriy oy kirimi — shu kalendar oydagi kirimlar yigʻindisi.
2. **Given** joriy oyda chiqim yozuvlari, **When** dashboard koʻrinadi, **Then** joriy oy chiqimi — shu kalendar oydagi chiqimlar yigʻindisi.
3. **Given** oʻtgan oyda yozuv bor, **When** joriy oy raqamlari koʻrinadi, **Then** oʻtgan oy yozuvi ularga qoʻshilmaydi.

---

### User Story 4 - Oxirgi yozuvlar va yangi yozuv (Priority: P3)

Foydalanuvchi bosh sahifada oxirgi yozuvlarning qisqa roʻyxatini koʻradi, doim koʻrinib
turadigan tugma bilan yangi yozuv qoʻshadi va toʻliq yozuvlar ekraniga oʻta oladi.

**Why this priority**: Harakat qulayligi — ekranning «keyin bitta tugma bilan yozuv qoʻshadi»
qismi; koʻrsatkichlarsiz ham ilova ishlaydi, shuning uchun P3.

**Independent Test**: Yozuv qoʻshib roʻyxatda darhol koʻrinishini, tugma formani ochishini va
toʻliq roʻyxatga oʻtish yoʻlini bosib tekshirish bilan sinaladi.

**Acceptance Scenarios**:

1. **Given** dashboard ochiq, **When** yangi yozuv qoʻshiladi, **Then** u dashboarddagi roʻyxatda darhol koʻrinadi.
2. **Given** dashboard ochiq, **When** yozuv qoʻshish tugmasi bosiladi, **Then** yozuv formasi ochiladi; tugma ekranda doim koʻrinib turadi.
3. **Given** dashboard ochiq, **When** foydalanuvchi toʻliq roʻyxatni istaydi, **Then** yozuvlar ekraniga oʻtish yoʻli shu ekrandan mavjud.

---

### User Story 5 - Zaxira eslatmasi (Priority: P3)

Oxirgi eksportdan 30 kun oʻtgan yoki daftar hech qachon eksport qilinmagan boʻlsa,
foydalanuvchi bosh sahifada bir qatorlik zaxira eslatmasini koʻradi.

**Why this priority**: Maʼlumot xavfsizligiga xizmat qiladi, lekin ekranning asosiy vazifasiga
kirmaydi.

**Independent Test**: Eksport sanasini oʻzgartirib (hech yoʻq / 30 kundan yangi / 30 kundan
eski) eslatma koʻrinish-koʻrinmasligini tekshirish bilan sinaladi.

**Acceptance Scenarios**:

1. **Given** hech qachon eksport qilinmagan daftar, **When** dashboard koʻrinadi, **Then** zaxira eslatmasi koʻrinadi.
2. **Given** eslatma koʻrinib turibdi, **When** eksport qilinadi, **Then** eslatma yoʻqoladi.
3. **Given** oxirgi eksportdan 30 kundan kam oʻtgan, **When** dashboard koʻrinadi, **Then** eslatma koʻrinmaydi.
4. **Given** oxirgi eksportdan 30 kundan koʻp oʻtgan, **When** dashboard koʻrinadi, **Then** eslatma qayta koʻrinadi.
5. **Given** eski zaxira import qilingan (fayldagi eksport sanasi 30 kundan eski), **When** dashboard koʻrinadi, **Then** eslatma darhol chiqadi — bu toʻgʻri holat.

---

### Edge Cases

- Boʻsh daftar: qoldiq nol, oy raqamlari nol, roʻyxat boʻsh holatda ekran xato bermaydi.
- Naqdda (yoki kartada) faqat bitta valyuta bor: yoʻq valyuta koʻrsatkichi chizilmaydi.
- Taxminiy jami xavfsiz butun son chegarasidan oshsa: qiymat koʻrsatilmaydi, ekran buzilmaydi
  (mavjud xavfsiz hisoblash yoʻli ishlatiladi).
- Kurs faqat qoʻlda soʻrov orqali kiritilgan: u oʻz kunining boshida turadi — oʻsha kundagi har
  qanday yozuv/toʻlov kursi undan yangi sanaladi (0066).
- Internet yoʻq: dashboard toʻliq ishlaydi (oflayn ilova).
- Dashboard bosh sahifa boʻlgach: mavjud pastki navigatsiya undan boshqa ekranlarga olib boradi
  va qaytadi, hech bir mavjud ekran yoʻqolmaydi.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Ilova ochilganda parol/PINsiz darhol dashboard koʻrinishi SHART; dashboard —
  ilovaning bosh sahifasi (PRD 3; 0006, 0020).
- **FR-002**: Dashboard joriy qoldiqni valyuta boʻyicha ajratilgan qatorlarda koʻrsatishi SHART
  (soʻm, dollar) (0020, 0023).
- **FR-003**: Umumiy qoldiq tagida naqd va karta qoldiqlari alohida qatorlarda, har biri valyuta
  boʻyicha ajratilgan holda koʻrsatilishi SHART (0036, 0023).
- **FR-004**: Qarz operatsiyalari qoldiqqa taʼsir qilishi SHART: berilgan qarz kamaytiradi,
  olingan qarz oshiradi; naqd + karta = umumiy tenglik doim saqlanadi (0017, 0035).
- **FR-005**: Aralash valyutada qoldiqlar tagida «≈ jami soʻmda» taxminiy qatori koʻrsatilishi
  va taxminiyligi belgilanishi SHART (0023).
- **FR-006**: Taxminiy jami uchun «oxirgi kurs» — eng kech sanali yozuv yoki toʻlovdagi kurs
  (bir xil sanada oxirgi kiritilgani gʻolib); u saqlanmaydi, har koʻrsatilishda qayta
  hisoblanadi (0044, 0045, 0047).
- **FR-007**: Dollar mavjud-u kurs hech qachon kiritilmagan boʻlsa, taxminiy jami hisoblanishidan
  oldin kurs soʻralishi SHART; kurs butun soʻmda, sanasi bilan saqlanadi, qayta ochilganda
  soʻralmaydi va zaxira fayliga kiradi (0042, 0043, 0045).
- **FR-008**: Dashboard joriy kalendar oy kirimi va chiqimini koʻrsatishi SHART; boshqa oy
  yozuvlari qoʻshilmaydi (0018, 0020).
- **FR-009**: Dashboard oxirgi yozuvlarning qisqa roʻyxatini koʻrsatishi SHART — eng koʻpi
  5 ta, eng yangisi yuqorida; toʻliq roʻyxat alohida yozuvlar ekranida qoladi va unga oʻtish
  yoʻli dashboardda boʻladi (0020, 0032).
- **FR-010**: Yozuv qoʻshish tugmasi dashboardda doim koʻrinib turishi va yozuv formasini
  ochishi SHART (PRD 27; 0020).
- **FR-011**: Qarz qoldigʻi dashboardda alohida raqam sifatida KOʻRSATILMASLIGI SHART (PRD 28).
- **FR-012**: Oxirgi eksportdan 30 kun oʻtgan yoki eksport umuman boʻlmagan holda bir qatorlik
  zaxira eslatmasi koʻrinishi SHART; shart bajarilmasa eslatma turmaydi. Eslatma faqat oxirgi
  eksport sanasini oʻqiydi (0024, 0053, 0054).
- **FR-013**: Dashboard bosh sahifa boʻlgach pastki navigatsiya qayta tuzilishi SHART:
  bandlar — Bosh (dashboard), Yozuvlar, Qarz daftari, Hisobot, Zaxira (5 band). Alohida «Yozuv»
  bandi olib tashlanadi — yozuv qoʻshish dashboarddagi doim koʻrinadigan tugma orqali
  (FR-010). Hech bir mavjud ekran yoʻqolmaydi (0063; Clarifications 2026-08-19).
- **FR-014**: Dashboard internetga ulanmagan holda toʻliq ishlashi SHART (0003).

### Key Entities

- **Yozuv**: mavjud kirim/chiqim yozuvi — dashboard uni faqat oʻqiydi (qoldiq, oy yigʻindilari,
  oxirgi roʻyxat).
- **Qarz va toʻlov**: mavjud qarz daftari maʼlumoti — qoldiq hisobida qatnashadi, alohida raqam
  sifatida koʻrsatilmaydi.
- **Qoʻlda kurs**: sanasi bilan saqlangan kurs qiymati — kurs soʻrovi natijasi; «oxirgi kurs»
  hisobida teng qatnashadi.
- **Sozlamalar**: oxirgi eksport sanasi — zaxira eslatmasi sharti shundan oʻqiladi.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Foydalanuvchi ilovani ochib pul holatini (umumiy, naqd/karta, valyuta boʻyicha)
  hech qanday qoʻshimcha bosishsiz bitta ekranda koʻradi.
- **SC-002**: Har qanday maʼlumot holatida naqd va karta qoldiqlarining yigʻindisi umumiy
  qoldiqqa teng — bitta ham istisno holat yoʻq.
- **SC-003**: Yangi yozuv dashboarddan bitta tugma bosish bilan boshlanadi va saqlangach
  roʻyxatda darhol koʻrinadi.
- **SC-004**: Kurs soʻrovi bir foydalanuvchiga bir marta chiqadi — kiritilgach qayta ochilishda
  takrorlanmaydi.
- **SC-005**: Zaxira eslatmasi faqat shart bajarilganda koʻrinadi (30 kun / hech eksport yoʻq)
  va eksportdan keyin darhol yoʻqoladi.
- **SC-006**: Internet oʻchirilgan holda dashboard ochiladi va hamma koʻrsatkichi toʻliq
  koʻrinadi.
- **SC-007**: prds/dashboard.md dagi «Qanday tekshiramiz» roʻyxatidagi 21 mezonning hammasi
  avtomatik test bilan qoplanadi va oʻtadi (constitution I).

## Assumptions

- Mavjud maʼlumot qatlami (yozuvlar, qarzlar, toʻlovlar, sozlamalar, qoʻlda kurslar) qayta
  ishlatiladi — dashboard yangi maʼlumot turini kiritmaydi.
- «Oxirgi kurs» va xavfsiz taxminiy jami hisoblash qoidalari allaqachon mavjud (oylik hisobot
  qismida qurilgan) va dashboard oʻsha qoidalarni ishlatadi (0044, 0045, 0066).
- Kurs soʻrash oqimi hisobot qismidagi bilan bir xil qoidaga boʻysunadi — butun soʻm, sanasi
  bilan saqlash (0042, 0043).
- Oxirgi yozuvlar roʻyxati uzunligi — 5 ta (standart qiymat sifatida tanlandi va testda
  qatʼiylashadi; odam boshqacha xohlasa bitta sonni oʻzgartirish yetadi).
- Zaxira eslatmasi oddiy matn qatori — bosilmaydi. Sabab: PRDda «bir qatorlik eslatma»
  deyilgan, bosish xatti-harakati aytilmagan; chegara tamoyili boʻyicha aytilmagan narsa
  qoʻshilmaydi (constitution III). Zaxira ekraniga navigatsiya orqali oʻtiladi.
- Qidiruv/filtr, budjet chegarasi, oʻtgan oy bilan solishtirish, kursni internetdan olish —
  chegaradan tashqarida (0002, 0019, 0010).
