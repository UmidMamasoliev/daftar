# Dizayn agenti — loyiha eslatmalari (Daftar)

Yangi yozuv yuqoriga qoʻshiladi. Qisqa yozing.

## 2026-08-20 — 0068: HEAD_WEB redesign (uslub v2, dashboard, layout)

- Fayllar: `design/uslub.md` (v2, toʻliq qayta yozildi), `design/dashboard.md` (yangi),
  `design/redesign/layout.md` (ekran-ma-ekran), `design/redesign/head-tokenlar.css` (manba).
- **Sinf nomlari va CSS oʻzgaruvchi nomlari saqlandi**, faqat qiymatlar oʻzgardi. Yangi
  sinf atigi toʻrtta: `.faqat-oquvchiga`, `.ic`, `.ekran-keng`, `.ekran-forma`. Sabab —
  0068/3: 1066 test xulqqa bogʻlangan, DOM koʻchirish eng katta xavf.
- **Imzo:** pul summalari Space Mono (oʻngga tekis mono ustun); yagona katta raqam
  (`raqam-katta`) esa Space Grotesk — briefning oʻzi shunday taqsimlagan.
- **Koʻk moment:** toʻldirilgan `#0029FF` — ekranda bitta, u asosiy tugma. Nav faol bandi
  koʻk EMAS (siyoh + `#F3F5F9` pill — HEAD ning oʻz navigatsiyasi shunday), tanlangan chip
  esa tint (`#EBEEFF`) — tint punch sanalmaydi.
- **Semantik rang:** HEAD ning `#19E07A`/`#FF2D2D` oq fonda AA dan oʻtmaydi → matn uchun
  `#00803F` va `#D92020` (5.0:1), yorqinlari faqat ink-navy fon uchun tokenlarda qoladi.
  Yangi `kirim` eski `#15803D` ga deyarli teng — eski tanlov toʻgʻri boʻlgan.
- **`--matn-ochiq` (#868D99) endi matn tashimaydi** (3.3:1): faqat namuna matn va oʻchiq
  boshqaruv. Yashirilgan kategoriya nomi `--matn-ikkinchi` ga koʻchdi.
- **Yorliqlar katta harfga oʻgirilmaydi:** `text-transform: uppercase` oʻzbekcha `oʻ`/`gʻ`
  ni buzadi («SOʻM»). Mono oila + `+0.06em` tracking yetadi.
- **Ikonka:** faqat toʻrtta Lucide shakli (plus, x, chevron-left, chevron-right).
  Tugma nomidagi `＋`/`‹`/`›` DOM da qoladi (`.faqat-oquvchiga`, clip retsepti) — aks holda
  `getByRole('button', { name: '＋ Yozuv' })` yiqiladi. `＋` = U+FF0B, shriftlarda yoʻq —
  aynan shuning uchun almashtiriladi.
- **Fon oq boʻldi** (`--fon: #F4F5F7` → `#FFFFFF`), demak manifestdagi `background_color`
  ham oq; `theme_color` tegilmaydi.
- **Responsive:** 320–599 / ≥600 / ≥960. ≥960 da nav yuqoriga pill boʻlib chiqadi va
  pastdagi tugma paneli sarlavha qatoriga koʻchadi — DOM emas, `.ekran` gridi bilan.
  Ustun eni mazmunga qarab: roʻyxat/forma 640/560, kartochka gridi 1040.
- **Topilgan eskilik:** `design/oylik-hisobot.md` 8b dagi boʻsh holat matni hali ham
  0063 dagi «pastdagi «Yozuv» boʻlimi» ga ishora qiladi (kod va test ham shunday).
  0068 matnni muzlatgani uchun tegilmadi — faylga TAKLIF boʻlib yozildi.

## 2026-08-17 — Z1: zaxira ekrani

- `design/zaxira.md`: bitta ekran, ikkita kartochka («Zaxira olish», «Fayldan tiklash»).
  Import — kartochka ichida ochiladigan blok, qadamlab; modal yoʻq (loyihaning umumiy qoidasi).
- **Koʻp qadamli oqimda har qadam uchun jadval yozing:** «ekranda nima turadi / nima bosiladi /
  keyin nima boʻladi». Fayl tanlagich bekor qilingani ham alohida qator boʻladi — 0041 oqimida
  aynan shu holat testda (17b-mezon).
- **Fayl nomi ekranda aynan koʻrsatiladi** (`daftar-import-oldidan-...json`): tasdiq qadami shu
  nomga tayanadi. Uslubdagi «vaqt koʻrsatilmaydi» qoidasi bunga tegishli emas (u `yaratilgan`
  haqida, 0047) — buni faylda ochiq yozish kerak, aks holda QA ziddiyat deb topadi.
- **Xato bloki ikki qatorli:** sabab (`chiqim`) + har doim bir xil «Daftardagi maʼlumot
  oʻzgarmadi.» (`matn-ikkinchi`). Maʼlumotga tegadigan amalda odamning birinchi savoli shu.
- **Rang tanlovi:** import tugmasi xavfli tugma EMAS va ogohlantirish qizil emas — qaytish
  yoʻli bor (0027) va eng koʻp uchraydigan holat boʻsh daftarga tiklash (0055). Qizil rang
  faqat oʻchirish va xato uchun.
- Ikkala TAKLIF **0065** bilan qabul qilindi: (1) muvaffaqiyat blokida sanoq qatori
  «128 yozuv · 12 kontakt · 9 qarz · 14 toʻlov» (nol ham qoladi, kategoriya sanalmaydi);
  (2) 3-qadamda qayta urinish, ikkinchi avtomatik zaxira yoʻq, ekrandan chiqish — bekor.
  H1 dagi kabi: aniq yozilgan TAKLIF (matni, formati, sababi bilan) bir turda qabul qilinadi
  va matnni qayta yozish kerak boʻlmaydi.

## 2026-08-17 — H1: oylik hisobot ekrani

- Fayllar: `design/uslub.md` (bitta manba: rang, oʻlcham, format, navigatsiya),
  `design/kirim-chiqim.md` (forma va roʻyxat naqshi), `design/qarz-daftari.md` (kartochka,
  netto, «qaytarish» paneli), `design/oylik-hisobot.md` (hisobot).
- **Qolip:** har ekran fayli — «nima koʻrinadi / nima bosiladi va keyin nima boʻladi /
  boʻsh holat / xato holatlari / nima qoʻyilmaydi / TAKLIF». Ekran matnlari «...» ichida
  **aynan** yoziladi, frontend koʻchiradi.
- **Bitta holat — bitta matn.** Kurs xatolari («Kursni kiriting — 1 dollar necha soʻm.»,
  «Kurs notoʻgʻri», «Kurs butun soʻmda — kasr qismi olib tashlandi.») uch ekranda ham aynan
  bir xil. Yangi matn oʻylab topishdan oldin mavjudini qidiring.
- **Modal oyna yoʻq.** Hamma qoʻshimcha kiritish — sahifa ichida ochiladigan blok (kontakt
  qoʻshish, kategoriya qoʻshish, davr tanlash, kurs soʻrash). Tasdiq oynasi ham yoʻq (0029).
- **Ishora maʼnosi ekranga qarab oʻzgaradi:** qarz daftarida `+` = «menga qaytadi» (netto),
  hisobotda `+` = «hisobga tushdi» (pul harakati). Buni har ikkala faylda ochiq yozish kerak,
  aks holda QA ziddiyat deb topadi.
- **0038 tenglik qoidasi** hisobotning eng tekshiriladigan xossasi: kategoriya qatorlari
  valyuta boʻyicha guruhlanadi, guruh yigʻindisi oʻsha valyutadagi jamiga aynan teng, ajratmada
  kurs umuman ishlatilmaydi. «≈ jami soʻmda» faqat eng yuqoridagi jami blokida.
- **Boʻsh davr ≠ boʻsh ekran:** 17-mezon nol raqamlarni koʻrishni talab qiladi, shuning uchun
  jami bloki har doim chiziladi (`0 soʻm`), boʻsh holat matni faqat bloklar ichida.
- Vaqtinchalik navigatsiya (0063) `design/uslub.md` da; yangi boʻlim qurilganda oʻsha
  boʻlimdagi jadval, «Qayerda koʻrinadi» roʻyxati va boʻlaklar soni qoidasi yangilanadi.
- Spec jim qolgan hisob-kitob qoidasi (masalan qarz toʻlovi qaysi valyutada sanaladi) — qaror
  darajasidagi boʻshliq: TAKLIF belgisi bilan yozing, oʻzingiz hal qilmang (`lessons/qoidalar.md`).
  H1 dagi uchala TAKLIF **0064** bilan qabul qilindi: qarz blokida toʻrt yoʻnalish
  («Qarzga berildi» −, «Qarzdan qaytdi» +, «Qarz olindi» +, «Qarz qaytarildi» −); toʻlov oʻz
  valyutasida, kiritilgan summasi bilan sanaladi; kategoriya qatori bosilmaydi. Aniq TAKLIF —
  yorligʻi, ishorasi va sababi yozilgani — bir turda qabul qilindi va matnni qayta yozish
  kerak boʻlmadi.
