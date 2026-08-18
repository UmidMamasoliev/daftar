# 0066 — Qoʻlda soʻralgan kursning vaqti saqlanmaydi: u oʻz kunining boshida turadi

Sana: 2026-08-18
**Bosh agent vakolat bilan tanladi (0058 ruhida)** — 3.9 syomkasi tugagan, 0058 ning muddati
oʻtgan; tanlov odamning «hammasini yakunlash» koʻrsatmasi asosida qilindi.

Nima hal qilindi:

**(a) Qoʻlda soʻralgan kursning kiritilish VAQTI saqlanmaydi.** Doʻkonda ham, zaxira faylida ham
u avvalgidek `{ kurs, sana }` boʻlib qoladi — maʼlumot shakli va fayl formati **oʻzgarmadi**
(0043, `prds/zaxira.md` 6b).

**(b) Tenglikni yechish qoidasi.** Sanalar teng boʻlganda taqqos `yaratilgan` ga tushadi (0047),
lekin qoʻlda kursda u yoʻq. Shuning uchun qoʻlda kurs **oʻz kunining boshida** turadi: oʻsha
kunda kiritilgan **har qanday** yozuv yoki toʻlov kursi undan yangi sanaladi va gʻolib boʻladi.
Undan oldingi sanali yozuv esa uni almashtirmaydi (mezon 23d oʻzgarmadi).

**(c) Sintetik qiymat — `'0000-01-01T00:00:00.000Z'`**, `sana + 'T00:00'` emas.

**(d) Qoida bitta joyda.** Sintetik vaqt faqat `src/domain/kurs.ts` dagi
`qoldaKurslarManbalari(kurslar)` ichida yasaladi; doʻkon ham, ekran ham shu funksiyani chaqiradi.
`src/ui/kurslar.ts` endi domendan re-eksport — oʻz qoidasi yoʻq.

Nega:

- (b) Qoʻlda kurs faqat **boshqa kurs manbai umuman yoʻq** boʻlganda soʻraladi (mezon 23g). Demak
  oʻsha kunda undan keyin kelgan har qanday kurs haqiqatan ham yangiroq maʼlumot: odam kursni
  javob berganidan keyin bilib olgan. Teskarisi — qoʻlda kursni oʻsha kunning oxiriga qoʻyish —
  yangi kiritilgan kursni koʻrinmas holda bosib turardi; aynan shu xato bor edi
  (`data/yozuvlar.ts` sintetik `23:59:59` berardi) va u mezon 23d hamda 0044 §2 ga zid edi.
- (c) `sana` — **mahalliy** kun (0034), `yaratilgan` — **UTC** (0047). Toshkentda (UTC+5)
  00:00–05:00 orasida kiritilgan yozuvning UTC vaqti mahalliy kun boshidan **oldin** turadi:
  `sana + 'T00:00'` oʻsha besh soatlik oynada qoʻlda kursni notoʻgʻri gʻolib qilardi. Har qanday
  haqiqiy vaqtdan oldin turadigan qiymat bu oynani butunlay yopadi.
- (d) Bitta qiymat ikki joyda ikki xil sintetik vaqt bilan solishtirilsa, «oxirgi kurs» qaysi
  yoʻldan kelganiga qarab har xil chiqadi — xato aynan shundan tugʻilgan edi. Qoida bitta joyda
  boʻlsa, ikkinchi nusxa yoʻq (0045 ruhi: xato uchun ikkinchi joy ochilmaydi).

Bu qaror 0043, 0044, 0045, 0047 ga **zid emas** — ularni aniqlashtiradi: 0044 §4 «kiritilgan
kundagi qiymat sifatida qatnashadi» degan edi, lekin oʻsha kun ichidagi tartibni aytmagan edi;
0066 aynan shu boʻshliqni yopadi.

Koʻrilgan boshqa variantlar:
- **Qoʻlda kursga ham haqiqiy `yaratilgan` vaqtini saqlash.** Rad etildi: doʻkon shakli va zaxira
  fayl formati oʻzgarardi (0043 blokiga yangi maydon), import qilingan eski fayllarda u boʻlmasdi
  va baribir shu qarordagi savol — «maydonsiz fayl nima qiladi» — javobsiz qolardi.
- **Qoʻlda kursni oʻsha kunning oxiriga qoʻyish** (avvalgi `23:59:59` xatti-harakati). Rad etildi:
  yuqoridagi (b) sababi — oʻsha kunda keyin kiritilgan haqiqiy kurs hech qachon gʻolib
  boʻlmasdi.
- **`sana + 'T00:00'` sintetik vaqti.** Rad etildi: (c) dagi mahalliy/UTC oynasi.

Nimani oʻzgartiradi:
- `platform/src/domain/kurs.ts`: `qoldaKurslarManbalari(kurslar)` — sintetik vaqtning yagona joyi.
- `platform/src/ui/kurslar.ts`: oʻz qoidasi olib tashlandi, domendan re-eksport.
- `platform/src/data/yozuvlar.ts`: `23:59:59` sintetik vaqti olib tashlandi.
- `platform/KELISHUV.md`: 7-boʻlimga `qoldaKurslarManbalari` qatori; 24-boʻlimdagi «bir xil sanada
  qoʻlda javob gʻolib» jumlasi teskarisiga tuzatildi.
- `prds/kirim-chiqim.md`: 23d-mezonga izoh qatori (vaqt saqlanmaydi — oʻsha kundagi har qanday
  kurs undan keyin sanaladi).
- `AGENTS.md`: oʻqish roʻyxatida «0066 gacha»; kurs qatoriga tenglik qoidasi qoʻshildi.
- Testda tekshiriladi: bir xil sanada avval qoʻlda kurs saqlanib, keyin oʻsha sanaga kursli yozuv
  kiritilsa gʻolib **yozuvniki** boʻladi; oldingi sanali yozuv qoʻlda kursni almashtirmaydi;
  qoʻlda kurs saqlangan sanadan keyin UTC boʻyicha kun almashadigan oynada (Toshkent 00:00–05:00)
  kiritilgan yozuv ham gʻolib boʻladi. Sof hisob boʻlgani uchun Vitest qatlami (0040).
