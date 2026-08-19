# Research — Dashboard (Phase 0)

Texnik kontekstda `NEEDS CLARIFICATION` yoʻq edi; quyida asosiy tanlovlar, sabablari va
koʻrib chiqilgan muqobillar.

## 1. Oy yigʻindilari qayerdan olinadi

- **Decision**: Yangi sof funksiya `oyYigindilari(yozuvlar, davr)` (`src/domain/dashboard.ts`),
  davr tekshiruvi mavjud `davrgaKiradimi` bilan.
- **Rationale**: Dashboardga faqat ikki qator kerak (kirim, chiqim — valyuta boʻyicha).
  `yozuvlar` roʻyxati App holatida allaqachon bor — doʻkonga qoʻshimcha soʻrov kerak emas.
- **Alternatives considered**: `hisobotniOl(joriyOyDavri())` ni chaqirish — toʻgʻri ishlaydi,
  lekin kategoriya ajratmasi, qarz bloki va taxminiy holatlarni ham oʻqiydi/hisoblaydi;
  dashboardda ular tashlanadi. Ortiqcha oʻqish va chalkash bogʻliqlik uchun rad etildi.

## 2. Qoldiq va «≈ jami soʻmda»

- **Decision**: `qoldiqlarniOl()` (yozuv + qarz taʼsiri bilan, KELISHUV 16) → `jamiQoldiq` →
  `xavfsizTaxminiyJami(jami, kurs)`; kurs — `oxirgiKursniOl(qoldaKurslarManbalari(kurslar))`.
- **Rationale**: Hammasi mavjud, sinalgan yoʻllar; 0035 tengligi (naqd + karta = umumiy)
  doʻkonda kafolatlangan; H2 texnik qarzi boʻyicha yangi joy `xavfsizTaxminiyJami` dan yuradi
  (KELISHUV 11, 19).
- **Alternatives considered**: Ekranda oʻzi yigʻish — qoida ikkinchi joyda takrorlanadi, rad.

## 3. Kurs soʻrash bloki

- **Decision**: `Hisobot.tsx` dagi `KursBloki` (+ terish/kursor/xato holati) alohida
  `src/ui/KursSorov.tsx` komponentiga koʻchiriladi; ikkala ekran shu bittasini ishlatadi.
- **Rationale**: 0043 oqimi bitta: blok bir marta, birinchi muhtoj joyda; nusxa koʻchirish
  0066 dagi «ikki qoida» xatosining ekran-darajadagi takrori boʻlardi.
- **Alternatives considered**: Dashboardga oʻz bloki — kod ikki nusxa, rad; Hisobotdan
  eksport qilish — Hisobot fayli boshqa ekranning bogʻliqligiga aylanadi, rad.

## 4. Zaxira eslatmasi hisobi

- **Decision**: Sof funksiya `zaxiraEslatmasiKerakmi(oxirgiEksport, bugungi)`:
  `null` → `true`; kunlar farqi `>= 30` → `true` (0024 dagi «30 kun oʻtsa» oʻqilishi:
  30-kun toʻlganda eslatma chiqadi). Kun farqi mahalliy kalendar kunlarda.
- **Rationale**: KELISHUV 26: zaxira qatlami faqat sanani beradi, eslatma dashboardniki.
  Chegara testda qatʼiylashadi (29 → yoʻq, 30 → bor, 31 → bor).
- **Alternatives considered**: `> 30` — «30 kun oʻtsa» matniga zid (30-kun oʻtgan boʻladi), rad.

## 5. Ekran holati App darajasida

- **Decision**: Hisobot naqshi: `ekran === 'bosh'` boʻlganda `useEffect` navbat orqali
  doʻkondan oʻqiydi; `yozuvlar`/`kontaktlar` oʻzgarsa qayta oʻqiladi. Hech narsa saqlanmaydi.
- **Rationale**: Poyga himoyasi (`navbatga`) va «saqlanmaydi — har safar hisoblanadi» (0045,
  0014) loyihaning oʻrnashgan qoidalari.
- **Alternatives considered**: Dashboard ichida oʻz effekti — App dagi navbatdan tashqarida
  qolardi (poyga xavfi), rad.

## 6. Navigatsiya oʻzgarishi va forma qaytish yoʻli

- **Decision**: `Bolim`: `'yozuv'` olib tashlanadi, `'bosh'` qoʻshiladi (5 band saqlanadi).
  App `'bosh'` bilan ochiladi. YozuvForma qaytishi: forma qayerdan ochilgan boʻlsa oʻsha
  ekranga (`formaManbai: 'bosh' | 'yozuvlar'`).
- **Rationale**: Clarifications javobi (B) + uslubdagi mavjud qoida («boshqa joydan ochilgan
  forma oʻzi kelgan ekranga qaytadi»).
- **Alternatives considered**: 6 band (A varianti) — foydalanuvchi rad etdi.
