# TEKSHIRUV — loyihani qanday tekshiramiz

Bu fayl — umumiy sifat tekshiruvi (QA) uchun yozma koʻrsatma. Tekshiruvchi tuzatmaydi —
**topadi**. Har topilma bir qatorda yoziladi: qayerda, nima boʻldi, nima kutilgandi.

## 1. Nima tekshiriladi

Toʻrt qism va hujjatlar:

| Qism | Spec | Dizayn | Holat |
|---|---|---|---|
| Kirim-chiqim | `prds/kirim-chiqim.md` | `design/kirim-chiqim.md` | qurilgan |
| Qarz daftari | `prds/qarz-daftari.md` | `design/qarz-daftari.md` | qurilgan |
| Oylik hisobot | `prds/oylik-hisobot.md` | `design/oylik-hisobot.md` | qurilgan |
| Zaxira (eksport/import) | `prds/zaxira.md` | `design/zaxira.md` | qurilgan |
| Dashboard (bosh sahifa) | `prds/dashboard.md` + `specs/001-dashboard/` | `design/uslub.md` («Navigatsiya paneli») | qurilgan (3.10, Spec Kit bilan; 0067) |

Hujjat tomoni: `platform/KELISHUV.md` koddagi haqiqatga mos turishi, spec ↔ qaror ↔ kod
orasida ziddiyat yoʻqligi.

## 2. Tekshiruvdan oldin oʻqiladi

1. `AGENTS.md` — qoidalar va «nima qilinmaydi» roʻyxati (specda yoʻq narsa — kamchilik emas).
2. `lessons/qoidalar.md` — qaytmasligi kerak boʻlgan xatolar.
3. `memory/` dagi eng yangi fayl — qayerda toʻxtaganimiz.
4. `decisions/` — 0001–0067, hammasi majburiy.
5. Har specdagi **«Qanday tekshiramiz»** boʻlimi — tekshiruv roʻyxatining asosi.
6. `.claude/notes/qa.md` — oldingi tekshiruvlarning saboqlari va probe usullari.

## 3. Avtomatik darvozalar (hammasi `platform/` ichida)

Tartib bilan, har birining **haqiqiy chiqishi** koʻrsatiladi — «oʻtdi» deb aytish yetarli emas (0022):

1. `npm test` — Vitest (kutilgan: 1065 test). Barqarorlik uchun kamida 3 marta toʻliq
   ishga tushiriladi. Chiqishni `tail` bilan kesmaslik — flake tafsiloti yoʻqoladi.
   **Flake chiqsa test oʻchirilmaydi yoki qayta yozilmaydi — ildizi izlanadi**: oxirgi
   regressiyada flake ortidan haqiqiy mahsulot xatosi chiqqan.
2. `npx tsc -b` — toza chiqishi (hech qanday xato yoʻq).
3. `npm run build` — xatosiz yakunlanishi.
4. `npx playwright test` — E2E (kutilgan: 12 test, uchtasi oflayn oqim). Oflayn testlar
   faqat preview buildda ishlaydi — dev rejimda service worker oʻchiq.

## 4. Jonli tekshiruv (preview build)

```
npm run build && npm run preview -- --port 4173
```

- Oflayn sinov: sahifa ochilgach `navigator.serviceWorker.ready` kutiladi, precache
  tugashiga qisqa pauza beriladi, soʻng `context.setOffline(true)` + reload.
- Zaxira oqimi: eksport fayli `page.waitForEvent('download')` + `download.path()` bilan
  oʻqiladi; import uchun `filechooser.setFiles(...)`; «tanlanmadi» holati uchun
  `setFiles([])` ishlamaydi — `input[aria-label="Zaxira fayli"]` ga `cancel` hodisasi yuboriladi.
- Probe tuzoqlari (oldingi tekshiruvlardan): chip nomlarida doim `exact: true`
  (`sport` substring «transport»ni ham oladi); dollar summasini terishdan oldin «dollar»
  chipi bosiladi; `.chip-tanlangan` selektori kategoriya guruhiga chegaralanadi; hisobot
  raqamlari navbat orqali keladi — guruh matnini oʻqishdan oldin kutiladi.

## 5. Mezonlar xaritasi

Har specdagi «Qanday tekshiramiz» mezonlari test nomlarida `mezon N` deb belgilangan:

```
grep -rn "mezon 12" platform/src/ platform/e2e/
```

Har mezon boʻyicha natija uch xil yoziladi: **bajarildi** / **bajarilmadi** /
**tekshirib boʻlmadi (sababi bilan)**. Mezoni testda yoʻq joy — alohida qayd.

## 6. Chegaraviy holatlar (majburiy sinov roʻyxati)

- Boʻsh daftar: yozuvsiz, kontaktsiz, qarzsiz holatdagi har ekran.
- Summa: nol (saqlanmaydi), manfiy (kiritilmaydi), `Number.MAX_SAFE_INTEGER` (saqlanadi),
  undan katta (rad, «Summa juda katta.»).
- Kurs: nol (rad, «Kurs notoʻgʻri»), kasr (kiritilmaydi), dollar tanlanmaguncha soʻralmasligi.
- Sana: kelajak sana rad etiladi — yozuv, qarz, toʻlov uchun bir xil (0034).
- Qarz: yarim toʻlangan; chegara qoldiq (dollarda 1 sent / soʻmda 100 soʻm) bilan yopilish
  (0052); yopilgan qarzga toʻlov rad (0061); toʻlov qoldiqdan chegaradan koʻp oshsa rad;
  qarz summasini toʻlovlardan chegaradan koʻp past tahrirlash rad (0061e); valyuta faqat
  toʻlovsiz qarzda oʻzgarishi; kontakt umuman oʻzgarmasligi (0059).
- Kontakt: ochiq qarzlisi oʻchirilmasligi (0030); boʻsh ism rad (0060).
- Kategoriya: yashirilgan nom bilan qoʻshish rad + «Koʻrsatish» yoʻli (0051).
- Oʻchirish: tasdiq oynasi yoʻq, «qaytarish» 7 soniya — yozuv, qarz (toʻlovlari bilan),
  toʻlov, kontakt uchun (0029, 0048, 0059).
- Import: buzuq fayl, begona hisob, unsafe int, manfiy summa, yetishmagan maydonlar —
  «toʻliq emas» bilan rad; boʻsh daftar istisnosi — bir qadamda oʻtishi (0055);
  avtomatik zaxira + fayl-qaytarib-tanlash tasdiqi (0027, 0041); yakunda sanoq qatori (0065).
- Hisobot: boʻsh oy; qarz bloki toʻrt yoʻnalishi (0064); valyutalar aralash oy.

## 7. Maʼlum chegaralar — kamchilik EMAS, lekin qayd etiladi

3.10 da yopilganlar: dashboard qurildi (0067), naqd/karta qoldiqlari jonli UI da,
kurs soʻrash bloki bosh sahifada jonli yoʻlda ochiladi, 30 kunlik eslatma (0024) bor.

Qolganlari:

- `taxminiyJamiSomda` eski imzosi turibdi — yangi yoʻl `xavfsizTaxminiyJami`
  (imzo ataylab buzilmagan, KELISHUV 11-boʻlim).
- Bosh sahifadagi oxirgi yozuvlar qatorlari bosilmaydi — tahrir «Yozuvlar»da (0067).

## 8. Natija qanday topshiriladi

- Har qism boʻyicha «Qanday tekshiramiz» natijalari (mezon raqami bilan).
- Topilgan kamchiliklar roʻyxati, har biri bir qator, jiddiylik belgisi bilan
  (yuqori — pul/maʼlumot yoʻqolishi; oʻrta — notoʻgʻri koʻrinish; past — nazariy holat).
- Tekshirilmagan joylar va sababi.
- «Hammasi joyida» degan yakun yozilmaydi — nima tekshirilgani sanaladi, xolos.
- Tekshiruvchi hech narsani tuzatmaydi; saboqlar `.claude/notes/qa.md` ga qoʻshiladi.
