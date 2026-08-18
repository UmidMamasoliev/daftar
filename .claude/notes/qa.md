# QA eslatmalari — Daftar (loyiha)

## 2026-08-18 — Maqsadli qayta tekshiruv (kurs + ikki-bosish tuzatishlari, preview 4174)
- Ikkala tuzatish jonli tasdiqlandi: (1) qoʻlda kurs endi «kun boshi» sintetik vaqti
  (`domain/kurs.ts` `QOLDA_KURS_VAQTI = '0000-01-01T00:00:00.000Z'`, ataylab sana emas —
  UTC/mahalliy farqi izohda) — oʻsha kunda keyin kiritilgan 13 500 saqlangan 15 000 ni
  yengdi; (2) toʻrt formada `useRef` bayroq + `disabled` — sinxron 2×klik ham, dblclick
  ham 1 ta saqlash (IDB sanovi bilan).
- **TOPILMA (past):** «Zaxira» → «Eksport» tugmasida himoya yoʻq — sinxron 2×klik ham,
  dblclick ham 2 ta faylni yuklab oladi (bir xil nom, brauzer «(1)» qoʻshadi). Maʼlumotga
  zarar yoʻq (mazmun bir xil, oxirgi-eksport bir xil qiymat), lekin naqsh yoʻqligi jonli
  koʻrindi. TUZATILMADI — qayd.
- Shubhali, lekin jonli oqibatsiz: «Kontakt tahriri» Saqlash 2×klik = 1 kontakt, ism
  toʻgʻri (keyed put idempotent); «Kategoriyalar» Qoʻshish 2×klik = 1 ta kategoriya
  (doʻkonning nom-bandlik tekshiruvi ikkinchisini yutadi, ekranda xato chiqmaydi —
  forma birinchi muvaffaqiyatda yopilgan); «Import» 2×klik = 1 ta filechooser (fayl
  tanlanmagunicha yon taʼsir yoʻq). Uchchalasida himoya NAQSHI yoʻq — xavf nazariy.
- Yangi probe tuzoqlari: (1) pastki navigatsiya FAQAT `NAVLI_EKRANLAR` da (`App.tsx`) —
  «forma» va «kategoriyalar» ekranlarida panel YOʻQ, probe avval formadan chiqsin
  (Kategoriyalardan «‹ Orqaga» YOZUV FORMASIGA qaytaradi, navsiz). (2) «Kecha» tugma
  emas — sana `.sana-kirit` date-inputga `fill` bilan kiritiladi. (3) Yozuv formasida
  kurs maydoni OLDINDAN TOʻLDIRILMAYDI (qoʻlda kurs 15 000 saqlangan boʻlsa ham boʻsh) —
  bu spec buzilishi emas, «oxirgi kurs» faqat hisobot uchun.
- 23a–23c regressiya hidi tekshirildi: kechagi 12 000 bugungi 12 500 ni yengmadi;
  bir xil sanada keyingi 12 600 gʻolib — kurs tuzatishi eski xulqni buzmagan.

## 2026-08-18 — Maqsadli poyga tekshiruvi (preview 4174, 20+8 jonli probe)
- **TOPILMA (oʻrta, pulga tegadi, 5/5 takrorlanadi):** «Saqlash»/«Qoʻshish» tugmalarida
  in-flight himoya yoʻq (`disabled` yoʻq, `yubor` da bayroq yoʻq) — bitta niyat ikki marta
  saqlanadi. Toʻrt joyda ham: YozuvForma (2 yozuv), QarzForma (2 qarz), TolovForma
  (2 toʻlov — 30 000×2!), QarzDaftari kontakt «Qoʻshish» (2 kontakt). Doʻkonning
  tekshiruvli yoʻllari (`tolovSaqla`) ham toʻsmaydi — har ikkala toʻlov alohida-alohida
  qonuniy. Testlarda bu holat YOʻQ (YozuvForma/QarzForma/TolovForma 113 testi oʻtadi —
  qamrov boʻshligʻi, buzilgan test emas).
- Probe usuli (dublikat poygasi): `locator.evaluate((el)=>{el.click();el.click()})` —
  sinxron ikki klik deterministik uradi; `dblclick()` ham uradi. Ikki ALOHIDA playwright
  `click()` ulgurmaydi (preview'da IDB yozuvi juda tez, forma yopilib boʻladi) — sekin
  qurilmada oyna kengroq.
- Navbat modeli qolgan tez ketma-ketliklarda ushladi (hammasi PASS): saqlash→darhol ×→
  ekran almashish (1 yozuv); oʻchir→qaytar ×3 sikl; ikki yozuvni tez oʻchirish + bitta
  QAYTARISH (12a — faqat ikkinchisi qaytadi, panel 1 ta); yashir→koʻrsat ×3 (dublikat
  yoʻq, IDB 11); T8 orqaga-poygasi qaytmagan (yashir→DARHOL Orqaga = ogoh + tanlov bekor;
  koʻrsat→DARHOL Orqaga = tanlov saqlanadi); qarz→toʻlov→darhol oʻchir→QAYTARISH (qoldiq
  100 000→70 000 toʻgʻri, hisobot qarz bloki mos); Saqlash→DARHOL reload (yozuv butun
  yetib borgan, yarim yozuv koʻrilmadi).
- Urugʻlanish stressi: 3× toza origin = 11/11 unikal; 3× «commit» paytida 2× tez reload =
  baribir 11/11 unikal, chiplar chiziladi — atomar urugʻlanish jonli tasdiqlandi.
- Sinalmagan poyga yoʻllari: qarz/kontakt oʻchir→qaytar tez sikllari (naqsh yozuvniki
  bilan bir xil, lekin jonli urilmadi); hisobot oy strelkalarini tez bosish; eksport/import
  tez ketma-ketligi; ikki-tab (ataylab — specda yoʻq).

## 2026-08-18 — Umumiy sifat tekshiruvi (3.9 yakuniy): 999×3 / tsc / build / 11 e2e / 106 jonli
- Darvozalar: `npm test` 3× — har safar 999/999, flake YOʻQ (kategoriya urugʻlanishi
  tuzatilgach oldingi flake qaytmadi); `tsc -b` toza; build OK; Playwright 11/11.
- **TOPILMA (oʻrta, takrorlanuvchan 2/2):** saqlangan qoʻlda kurs bir xil sanada KEYIN
  kiritilgan yozuv kursini yengib qoladi — spec kirim-chiqim 23d va 0044 §2 ga zid.
  Ildiz: `data/yozuvlar.ts` `oxirgiKursniOl` saqlangan kursga sintetik
  `yaratilgan = sana+"T23:59:59.999Z"` beradi; `ui/kurslar.ts` esa TESKARI konvensiya
  (`T00:00:00.000Z`, izohi 23d ga mos). Bitta qiymat ikki qatlamda ikki xil sintetik
  vaqt bilan yuradi; App saqlangan kursni ikkala yoʻldan ham beradi (qoshimcha + doʻkon),
  23:59 nusxa gʻolib. 23d yorliqli testlar FAQAT parametr (`qoshimcha`) yoʻlini sinaydi —
  doʻkon yoʻli sinalmagan. KELISHUV 901–902 xato holatni hujjatlashtiradi («bir xil
  sanada qoʻlda soʻralgan javob gʻolib»). Jonli yoʻl: faqat `kurslar` blokli fayl importi.
- Sintetik vaqt darsi (umumiy): saqlangan qiymatga qatlam oʻzi timestamp toʻqisa, XUDDI
  shu qiymatning parametr-yoʻli testi doʻkon-yoʻlini isbotlamaydi — ikkala yoʻlni sina.
- Mezon xaritasi boʻshliqlari (mazmunan yopilgan, yorliqsiz): KC 3a (turi-bosh testlari),
  KC 4f (faqat UI: YozuvForma «Kurs juda katta.», domain kursniOqi chegara testi yoʻq),
  KC 23 (hisobot mezon 21 testlari + jonli), ZX 24 (jonli tasdiqlandi). Enumeratsiya
  tuzogʻi: «mezon 13, 14» / «mezon 17j, 17k» — `grep "mezon N"` topmaydi, bare token bilan qidir.
- Jonli sweep: 5 skript (A kesishma 28, B chegara 24, C oʻchirish/kategoriya/import 34,
  D davr/tahrir 14, E kategoriya-import 6) = 106 tekshiruv, 1 haqiqiy FAIL (yuqoridagi).
- Yangi probe tuzoqlari: (1) «Oʻchirish» tugmalari HOVER da chiqadi — qarz kartasida
  butun kartani hover qilsang TOʻLOV qatoriga tushib notoʻgʻri delete bosiladi; doim
  `.kartochka-boshi` ga hover+scope. (2) Toʻlov qatori summasi QARZ valyutasida «−» bilan
  (`tolovMatni`), «+» emas; «Oldim» qarzida ham «−». (3) Qarz kartasini `boshlangʻich N
  soʻm» matni bilan filtrlash barqaror (qoldiq oʻzgaradi). (4) Oy strelkalari aria-label:
  «Oldingi oy»/«Keyingi oy»; forma yopish: «Yopish». (5) Yashirilgan kategoriya boshqaruv
  ekranida alohida roʻyxatda, qatorda «Yashirilgan» soʻzi YOʻQ — «Koʻrsatish» tugmasi bor.
  (6) Nol summa xatosi matni: «Summa noldan katta boʻlsin.» (7) Davr sana inputlari
  `aria-labelledby` bilan (`input[aria-labelledby$="-boshlanish"]`), getByLabel ishlamaydi.
- Kelajak sana jonli sinovi: date input `max=bugun` atributi bilan tekshiriladi (yozuv,
  qarz, toʻlov, davr — toʻrttalasida ham bor, D3/D8/D9 PASS).
- Import validatori jonli: buzuq JSON, versiya≠1, oxirgi-eksportsiz, manfiy summa,
  unsafe int, begona «bank» hisobi — hammasi toʻgʻri matn bilan rad (C30–34, E6).

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
