# Qoidalar — Daftar loyihasi (har qanday AI vositasi uchun)

Siz «Daftar» loyihasida ishlayapsiz: kirim-chiqim yozuvlari, qarz daftari, oylik hisobot,
oddiy dashboard. Bu — daftar darajasidagi vosita, buxgalteriya dasturi EMAS: 1C yoʻq, soliq
hisobotlari yoʻq.

Foydalanuvchi — oʻz pulini sanayotgan bitta odam (0001, 0005). Ilova brauzerda ochiladigan,
oflayn ishlaydigan, serversiz veb-sayt (0003).

## Ishni boshlashdan oldin oʻqing

1. Shu fayl.
2. `lessons/qoidalar.md` — takrorlanmasligi kerak boʻlgan xatolar.
3. `memory/` dagi eng yangi fayl — qayerda toʻxtaganimiz.
4. `discovery/` — ochiq savollar (boʻsh boʻlishi mumkin).
5. `decisions/` — 0001 dan 0067 gacha. **Hammasi majburiy va bahsga tushmaydi.**
6. `prds/daftar-prd.md` — mahsulot chegarasi.
7. Oʻz qismingiz speci: `prds/kirim-chiqim.md`, `prds/qarz-daftari.md`,
   `prds/oylik-hisobot.md`, `prds/dashboard.md`.

## Loyihaning chegarasi — nima QILINMAYDI

- Buxgalteriya hisoboti, soliq hisoboti, 1C bilan bogʻlanish.
- Biznes tushunchalari: mijoz, yetkazib beruvchi, doʻkon kassasi, xodim, rollar (0001).
- Koʻp foydalanuvchi, daftarni ulashish, oila birga yuritishi (0005).
- Server, foydalanuvchi hisobi, qurilmalar orasida sinxronizatsiya (0004).
- PIN, parol, barmoq izi — ilovaning oʻz kirish himoyasi (0006).
- Bildirishnoma va push xabar (0003).
- Avtomatik bulut zaxirasi (0007).
- Takrorlanuvchi yozuvlar, chek rasmi, budjet chegarasi, qidiruv va filtr, kurs tarixi (0002).
- Soʻm va dollardan boshqa valyuta; valyuta qoʻshish (0026).
- Yangi hisob qoʻshish yoki mavjudini oʻchirish (0011).
- Yozuv oʻzgarish tarixi, audit izi, «oy yopish» holati (0014).
- Qarz muddati va muddat eslatmasi (0016).
- Hisobotni PDF, CSV yoki rasm qilib chiqarish (0021).
- Oylik hisobotda oʻtgan oy bilan solishtirish (0019).
- Rus tili, krill yozuvi, til tanlash sozlamasi (0009).
- Kelajakdagi sana bilan yozuv (0034).
- Kasrli kurs; yuqoriga yoki pastga majburiy yaxlitlash (0042). Nol yoki manfiy kurs (0049).

Roʻyxatda yoʻq narsani «foydali boʻlardi» deb qoʻshmang. Kerak boʻlsa — avval qaror.

## Qarorlardan kelib chiqadigan majburiy narsalar

**Texnika**
- Stek: TypeScript + React + IndexedDB; backend yoʻq (0008).
- Build: Vite (PWA `vite-plugin-pwa` bilan); unit/integratsiya testlari: Vitest + fake-indexeddb;
  E2E testlar: Playwright (0040).
- Oflayn ishlaydigan PWA veb-sayt; statik hosting **Vercel** — GitHub repozitoriysiga push
  qilinganda avtomatik deploy (0003, 0025, 0046).
- Hamma maʼlumot faqat foydalanuvchi qurilmasida (0004).
- Interfeys faqat oʻzbekcha, lotin yozuvida (0009).
- Pul summalari butun sonda saqlanadi: dollar sentda, soʻm soʻmda (0008, 0033). Mahsulotda
  yuqori chegara yoʻq, lekin xavfsiz butun son chegarasidan (`Number.MAX_SAFE_INTEGER`) oshgan
  summa, kurs yoki aylantirish natijasi saqlanmaydi — texnik zarurat (0008, 0033;
  `prds/kirim-chiqim.md` 1a1).
- Har yozuv va qarz toʻlovi `yaratilgan` vaqt maydoni bilan saqlanadi va u zaxira fayliga
  kiradi. Bu texnik tartib maydoni: koʻrsatilmaydi, tahrirlashda oʻzgarmaydi va foydalanuvchi
  koʻradigan `sana` dan ayri (0047).

**Pul va valyuta**
- Ikkita hisob: naqd va karta. Formada standart — **karta** (0011, 0035).
- Ikkita valyuta: soʻm va dollar. Formada standart — **soʻm** (0026, 0023).
- Kurs faqat dollar tanlanganda soʻraladi va oʻshanda majburiy (0023).
- Kurs = **1 dollar necha soʻm**; butun soʻmda kiritiladi va saqlanadi, kasr yoʻq (0023, 0042).
  Kurs musbat boʻlishi shart: nol kurs taqiqlanadi, «Kurs notoʻgʻri» koʻrsatiladi (0049).
- Valyuta aylantirilganda natija **eng yaqin** butun birlikka yaxlitlanadi — dollarda sentga,
  soʻmda soʻmga (0042).
- «Oxirgi kurs» — eng kech **sanali** yozuv yoki toʻlovdagi kurs; bir xil sanada oxirgi
  kiritilgani gʻolib — buni `yaratilgan` maydoni aniqlaydi (0044, 0047). U saqlanmaydi: har
  safar yozuv va toʻlovlardan hisoblanadi, demak yozuv tahrirlansa yoki oʻchirilsa oʻz-oʻzidan
  toʻgʻrilanadi (0045).
- Saqlanadigan yagona kurs qiymati — «≈ jami soʻmda» uchun qoʻlda soʻralgani; u sanasi bilan
  saqlanadi, zaxira fayliga `kurslar` bloki boʻlib kiradi va hisobda teng qatnashadi
  (0043, 0044, 0045). Uning **vaqti** saqlanmaydi: qoʻlda kurs oʻz kunining boshida turadi,
  demak oʻsha kundagi har qanday yozuv yoki toʻlov kursi undan yangi sanaladi (0066).
- Summa: soʻmda butun son, dollarda ikki kasr. Nol saqlanmaydi, manfiy kiritilmaydi (0033).
- Sana faqat bugun yoki undan oldin — yozuv, qarz va toʻlovda bir xil (0034).
- Aralash valyutada qoldiqlar alohida qatorda; «≈ jami soʻmda» faqat taxminiy qator (0023).
- Kategoriya va qarz qatorlari valyuta boʻyicha alohida, taxminsiz (0038).

**Xatti-harakat**
- Oʻchirishda tasdiq oynasi yoʻq — «qaytarish» tugmasi **7 soniya** turadi; yozuv, qarz, qarz
  toʻlovi va kontakt uchun bir xil (0029, 0048, 0059).
- Yozuv formasida tur («kirim» yoki «chiqim») uchun standart qiymat yoʻq — foydalanuvchi har
  safar oʻzi tanlaydi (0050). Qarz formasida yoʻnalish («berdim»/«oldim») uchun ham standart
  yoʻq — sabab bir xil (0062).
- Yashirilgan kategoriya nomi band sanaladi: shu nom bilan qoʻshish rad etiladi va xato
  yashirilganlikni aytib «Koʻrsatish» yoʻlini koʻrsatadi; avtomatik koʻrsatish yoʻq (0051).
- Qarz pul qoldigʻiga taʼsir qiladi, lekin hisobotda alohida qatorda turadi (0017). Hisobotdagi
  qarz bloki toʻrt yoʻnalishdan iborat: berildi (−), qaytdi (+), olindi (+), qaytarildi (−);
  toʻlov esa kiritilgan summasi bilan oʻz valyutasida sanaladi, aylantirilgan qiymatda emas
  (0064, 0038).
- Qarz oʻz valyutasida yuritiladi; boshqa valyutadagi toʻlov toʻlov kursida aylantiriladi (0023).
- Qarz qoldigʻi chegaradan oshmasa qarz yopilgan sanaladi: dollarda ≤ 1 sent, soʻmda ≤ 100 soʻm
  (0052). Yopiqlik holat maydoni emas — har safar qoldiqdan hisoblanadi (0016).
- Kontakt qoldigʻi — netto, valyutalar alohida va faqat **ochiq** qarzlardan: chegara bilan
  yopilgan qarzning mikro-qoldigʻi nettoda koʻrinmaydi (0037, 0056). Netto faqat koʻrsatish
  uchun: qarz yopilishi har qarzning oʻz qoldigʻi bilan aniqlanadi (0037, 0016).
- Chegara faqat qarz yopiqligiga va nettoga tegishli — naqd va karta qoldiqlari haqiqiy pul
  harakatidan chiqadi va tuzatilmaydi (0056, 0017, 0035).
- Qarzning oʻzi ham tahrirlanadi va oʻchiriladi (0014 ruhida): summa, sana, hisob, yoʻnalish
  erkin; **valyuta faqat toʻlovi yoʻq qarzda** oʻzgaradi, **kontakt esa umuman oʻzgarmaydi** —
  qarz boshqa kontaktga koʻchirilmaydi. Qarz oʻchirilsa toʻlovlari ham birga oʻchadi,
  «qaytarish» ikkalasini birga qaytaradi (0059).
- Kontakt tahrirlanadi: ism va telefon oʻzgaradi, ism boʻsh boʻlmaydi (0060; 0015, 0031).
- Toʻlov qarz qoldigʻidan 0052 chegarasidan (1 sent / 100 soʻm) koʻp oshsa rad etiladi; chegara
  ichida oshsa qabul qilinadi, qarz yopiladi va qoldiq nol koʻrsatiladi — hisobga esa haqiqiy
  toʻlov summasi tushadi. Aylantirilgandan keyin nolga aylanadigan toʻlov rad etiladi. Yopilgan
  qarzga toʻlov qoʻshilmaydi (0061).
- Teskari tomoni: qarz summasi tahrirlanganda toʻlovlar yigʻindisidan chegaradan koʻp past
  qilinsa tahrir rad etiladi; chegara ichida past boʻlsa qabul qilinadi va qarz yopiladi (0061e).
- Toʻlovning oʻzi tahrirlanmaydi — oʻchiriladi va kerak boʻlsa qaytadan kiritiladi (0029, 0048).
- Ochiq qarzi bor kontakt oʻchirilmaydi (0030).
- Import: avval joriy maʼlumot avtomatik faylga chiqariladi; zaxira saqlanmasa import
  bajarilmaydi (0027). Tasdiq — foydalanuvchi oʻsha faylni qaytarib tanlaydi va ilova uni
  joriy maʼlumotga solishtiradi; boshqa tasdiq yoʻli qurilmaydi (0041).
- Istisno: daftar boʻsh boʻlsa (yozuv, kontakt, qarz, toʻlov yoʻq va kategoriyalar tayyor
  holatida) avtomatik zaxira ham, tasdiq ham boʻlmaydi — import bir qadamda oʻtadi (0055).
- Oxirgi eksport sanasi zaxira fayliga kiradi va import bilan tiklanadi (0053); uni har
  muvaffaqiyatli eksport yangilaydi — import oldidagi avtomatik zaxira ham (0054).
- Import tugagach sanoq qatori koʻrsatiladi: «N yozuv · N kontakt · N qarz · N toʻlov». Tasdiq
  qadamida qayta urinish shu ekranda boʻladi va ikkinchi avtomatik zaxira chiqarilmaydi;
  ekrandan chiqilsa oqim bekor boʻlib, keyingi import boshidan boshlanadi (0065).
- Dashboard — bosh sahifa (0020, 0067): ilova «Bosh» bilan ochiladi; navigatsiya bandlari
  Bosh, Yozuvlar, Qarz daftari, Hisobot, Zaxira. Alohida «Yozuv» bandi yoʻq — yozuv qoʻshish
  bosh sahifadagi doim koʻrinadigan «＋ Yozuv» tugmasidan. Dashboard 3.10 da GitHub Spec Kit
  oqimi bilan qurilgan — artefaktlari `specs/001-dashboard/` da.

**Tayyorlik**
- Daftar tayyor sanaladi, qachonki toʻrt qism ishlasa va testlari oʻtsa (0022).
- Testlar koddan oldin yoziladi; testi oʻtmagan qism tayyor emas (0022).
- Har specdagi «Qanday tekshiramiz» mezonlari test boʻlib yoziladi (0022).
- Test oʻtgani haqiqiy natija bilan koʻrsatiladi — aytish yetarli emas (0022).

## Ish tartibi

1. Yuqoridagi «Ishni boshlashdan oldin oʻqing» roʻyxatini bajaring.
2. Hal boʻlmagan savolni `discovery/` ga yozing — kod yozishdan oldin.
3. Qaror qabul qilinganda: discovery-faylni oʻchiring, `decisions/` ga sabab bilan yozing.
4. Har feature `prds/` dagi spec asosida quriladi — spec yoʻq boʻlsa, avval spec.
5. Qarorlar orasida boʻshliq koʻrsangiz, oʻzingiz xulosa chiqarmang — savol qilib bering
   (`lessons/qoidalar.md`).
   **Vaqtinchalik istisno (0058):** qarz-daftari, oylik-hisobot va zaxira qurilishi hamda 3.9
   syomkasiga tayyorgarlik davomida boʻshliqni bosh agent oʻzi hal qiladi — lekin qarorni
   baribir `decisions/` ga yozadi va «bosh agent vakolat bilan tanladi (0058)» deb belgilaydi.
   Mavjud qarorga (0001–0057) zid tanlov chiqsa — baribir odamga savol. Muddati: 3.9 syomkasi
   boshlanguncha.
6. Foydalanuvchi sizni tuzatsa — `lessons/` ga qoida yozing, ikkinchi marta takrorlanmasin.

## Ish tugaganda nima yoziladi

- `memory/<sana>.md` — nima oʻzgardi, qayerda toʻxtadik.
- Qaror qabul qilingan boʻlsa — `decisions/NNNN-<nom>.md`, va tegishli discovery-fayl oʻchadi.
- Yangi ochiq savol chiqqan boʻlsa — `discovery/<savol>.md`.
- Sizni tuzatishgan boʻlsa — `lessons/qoidalar.md` ga bitta qator.
- Kod oʻzgargan boʻlsa — tegishli `prds/` speci ham yangilanadi.

## Uslub

- Hamma hujjat qisqa, sodda, keyingi agent oʻqiy oladigan darajada.
- Oʻzbekcha matnlarda lotin yozuvi; texnik terminlar birinchi ishlatilganda izohlanadi.
- Oʻlchanmagan raqam yozilmaydi («necha barobar tez», «necha foiz»).
