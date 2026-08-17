# QA eslatmalari — Daftar (loyiha)

## 2026-08-17 — Regressiya (3.9 oldi): 994 Vitest / 11 Playwright / hisobot+zaxira
- Darvoza usuli: `npm test` 19× (5+6+8) — 2 marta AYNI test yiqildi:
  `App.hisobot.test.tsx` «mezon 18 — yozuv tahrirlangach…». Yiqilish DOMi: tahrir
  formasi ochiq, summa qoʻllangan, tur tanlangan, LEKIN kategoriya chiplari guruhi
  BOʻSH («Koʻrinadigan kategoriya yoʻq…») va «Kategoriyani tanlang.» — App holatidagi
  `kategoriyalar` roʻyxati boʻsh. Bu T8 dagi «IDB makrotask» izohidan boshqa ildiz:
  kategoriya roʻyxati/urugʻlanish oʻqishi shubhali. Toʻliq log saqlash sharti:
  `npm test`ni `tail` bilan kesmaslik — flake tafsiloti yoʻqoladi.
- Uchta xato kodi (`kategoriya-bosh/topilmadi/turi`) BITTA «Kategoriyani tanlang.»
  matniga yigʻilgan — flake diagnostikasida kodni DOMdan ajratib boʻlmaydi.
- Zaxira oqimini probe qilish: `page.waitForEvent('download')` + `download.path()`
  bilan eksport faylini oʻqib, `filechooser.setFiles({name,mimeType,buffer})` bilan
  qaytarib berish — butun 4 qadamli import skriptlanadi. 17b (tanlanmadi) uchun
  `setFiles([])` ISHLAMAYDI — komponent `cancel` hodisasiga tayanadi:
  `locator('input[aria-label="Zaxira fayli"]').dispatchEvent('cancel')`.
- Hisobot ekranida raqamlar navbat orqali keladi: guruh `innerText` ini oʻqishdan
  oldin kutish shart (B15 shu tufayli soxta FAIL berdi; 600 ms yetdi).
- Davr holatida «Davr tanlash» havolasi YOʻQ — avval «Oyga qaytish» (dizayn 2-boʻlim).
  Probe shu tartibda yozilsin.
- Yozuv formasida dollar summasini terishdan OLDIN «dollar» chipi bosilsin: soʻm
  rejimida «20,50» → «2050» boʻlib kesiladi (probe tuzogʻi).
- Import validatori qatʼiy (jonli tasdiqlangan): begona hisob (`bank`), unsafe int
  (2⁵³+1), manfiy/nol summa, faqat-naqd `hisoblar`, `yaratilgan`/`oxirgi-eksport`
  yoʻqligi — hammasi «toʻliq emas» bilan rad; MAX_SAFE_INTEGER esa qabul va hisobotda
  «Taxminiy jami hisoblanmadi…» chiqadi.
- Kurs soʻrash bloki (hisobot mezon 21) JONLI yoʻlda ochilmaydi: jami blokdagi dollar
  qatori faqat kursli dollar yozuvidan keladi. Faqat unit bilan yopilgan — oʻlik yoʻl.
  `kurslar` bloki ham faqat qoʻlda yasalgan fayl importi orqali toʻladi (B15: eng kech
  sanali qoʻlda kurs yozuv kursidan gʻolib — jonli tasdiqlandi).
- Q4/T8 topilmalari qaytmagan: `tolovSaqla` App da; `orqaga` navbatni kutadi;
  KELISHUVdagi 0063 ishoralari tuzatilgan; 32a PRDda joyida; `xavfsizTaxminiyJami`
  bor; qarz aylantirishi ham `…Sigadimi` yoʻlidan oʻtadi.
- Zaxira testlarida yorliq chalkashligi: domin testdagi «mezon 14» aslida spec
  14-BAND (ASCII kalitlar); haqiqiy mezon 14 (qoldiqlar) data testda «mezon 13, 14».

## 2026-08-17 — Q4: qarz-daftari toʻliq tekshiruvi
- Suite: `npm test` 682/682 (2× barqaror), `tsc -b` toza, `npx playwright test` 7/7
  (qarz e2e + oflayn qarz oqimi bor). Mezon xaritasi ishlaydi: `grep "mezon N"` qarz
  testlarida 1–47 hammasi bor; faqat yangi 32a testda nom bilan emas — mazmun testi
  `qarzlar.test.ts` «qarz boshqa kontaktga koʻchirilmaydi» da.
- Jonli probe (preview 4173, playwright kutubxonasi scratchpaddan `createRequire`
  bilan): 4 skript, 74 tekshiruv — hammasi PASS. Chegara raqamlari AYNAN moslashdi
  (700 100/700 101; 50,01/50,02; 49,99/49,98; 100/101 soʻm; 1/2 sent; 8,00/8,01 $).
- **Probe tuzogʻi:** `getByRole(name: 'sport')` substring boʻlib «transport» ni ham
  oladi — chip nomlarida doim `exact: true`. (Bitta soxta FAIL berdi.)
- Hisob qoldiqlarini (mezon 13–15b, 15h, 28, 29 pul tomoni) jonli UI da KOʻRIB
  BOʻLMAYDI — dashboard 3.10 gacha yoʻq; bular faqat doʻkon Vitest testlari bilan
  yopilgan. Dashboard qurilganda jonli qaytish kerak.
- Topilma (past): `App.tsx` toʻlovni himoyasiz `tolovQosh` bilan saqlaydi —
  doʻkonning tekshiruvli `tolovSaqla` yoʻli ishlatilmaydi; ikki tab stsenariysida
  0061 chegarasi chetlab oʻtilishi mumkin. KELISHUV «doʻkon darajasida ham rad» deydi.
- Hujjat: KELISHUV.md 372/602-qatorlarda «kurs yoʻq (0063)» — notoʻgʻri ishora,
  toʻgʻrisi 0044/0045. PRDdagi 32a-mezon 33-dan keyin turibdi (raqam tartibi).
- v2→v3 migratsiya jonli usuli T8 dagi bilan bir xil ishladi (route abort → v2 baza →
  reload); urugʻlanish takrorlanmasligini `count()` bilan tekshirish qulay.

## 2026-08-17 — T8: kirim-chiqim toʻliq tekshiruvi
- Buyruqlar (hammasi `platform/` ichida): `npm test` (Vitest, 307 test), `npx tsc -b`,
  `npx playwright test` (3 e2e), `npm run build` → `npm run preview -- --port 4173`.
  SW dev rejimda oʻchiq — oflaynni FAQAT preview buildda sinash mumkin.
- Mezonlar xaritasi: test nomlarining ichida `mezon N` yozilgan — `grep -rn "mezon 12a" src/`
  bilan qaysi test qoplashini topish oson.
- **Beqaror testlar**: `src/App.test.tsx` — 7 ta toʻliq ishga tushirishdan 3 tasida bittadan
  test yiqildi (har safar boshqasi). Ildiz: saqlash/koʻrsatish IDB yozuvlari makrotask,
  test esa keyingi qadamni UI signalini kutmasdan bosadi (`yozuvQoshdi` dan keyin «Yozuvlar»
  sarlavhasi kutilmaydi; «Koʻrsatish»dan keyin holat yangilanishi kutilmaydi). Alohida faylda
  doim oʻtadi — flake faqat toʻliq toʻplamda (yuklama ostida).
- Shu poyga mahsulotda ham bor (past): `App.tsx` `orqaga` doʻkon `yangila()` ni kutmaydi —
  juda tez «Koʻrsatish»+«‹ Orqaga» ketma-ketligida tanlov notoʻgʻri bekor boʻlishi mumkin.
- Oflayn probe usuli: preview + `page.evaluate(() => navigator.serviceWorker.ready)` +
  ~1,5 s precache kutish + `context.setOffline(true)` + reload. Ishladi (mezon 17 PASS).
- v1→v2 IDB migratsiyasini haqiqiy brauzerda sinash: `ctx.route('**/assets/*.js', abort)`
  bilan ilova JS ini bloklab sahifani ochish → `evaluate` da v1 bazani qoʻlda yaratish →
  unroute + reload. Ishladi (D1/D2 PASS).
- Chegaralar: soʻm summasi Number.MAX_SAFE_INTEGER gacha saqlanadi (999 999 999 999 999 OK);
  dollar ×100 boʻlgani uchun ~9×10¹³ $ dan katta saqlanmaydi — «Summa juda katta.» chiqadi
  (bu matn dizayn faylida YOʻQ; spec 1a «yuqori chegara yoʻq» deydi).
- `.chip-tanlangan` selektorini kategoriya guruhiga chegaralash kerak — Karta/soʻm chiplari
  ham shu sinfni oladi (probe yozishda adashtirdi).
- Ochiq qolgan tekshirilmagan joylar (keyingi bosqichlar qurilganda qaytish): «≈ jami soʻmda»
  qatori UI si, qoldiq koʻrinishi, hisobotda yashirilgan kategoriya, bosh sahifadagi qisqa
  roʻyxat paneli — hammasi dashboard/hisobot T lariga qoldi; mezon 17 uchun avtomatik e2e
  test yoʻq (0022 talabi — men qoʻlda probe bilan yopdim).
