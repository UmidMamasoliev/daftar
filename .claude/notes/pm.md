# pm — Daftar loyihasi boʻyicha eslatmalar

Eng yangisi tepada.

## 2026-08-17 — 0057 va texnik chegara (QA T8 dan)

- **0057:** tahrirlash rejimida chiplar = koʻrinadigan kategoriyalar + shu yozuvning oʻz
  kategoriyasi (yashirilgan boʻlsa ham). 0013 faqat «yangi yozuv tanlovi» haqida edi.
- **Texnik chegara** (`Number.MAX_SAFE_INTEGER`) `prds/kirim-chiqim.md` 1a1/1a2 bandlariga va
  4e–4g mezonlariga yozildi, `prds/qarz-daftari.md` ga 13a havolasi. Bu **qaror emas** —
  0008/0033 dan kelib chiqadigan zarurat; shuning uchun `decisions/` ga tushmadi.
- **Naqsh:** har agent qatlami oʻz turdagi boʻshliqni topadi — dizayn: muddat/boshlangʻich
  holat; backend: nom bandligi kabi chekka holatlar; QA: rejimlar orasidagi farq (yangi yozuv
  vs. tahrirlash) va texnik chegaralar. «Qoida X rejimga ham tegishlimi?» degan savolni har
  qoida uchun ataylab berish kerak.

## 2026-08-17 — 0056: netto faqat ochiq qarzlardan; hamma discovery yopildi

- **0056:** kontakt netto qoldigʻi faqat ochiq qarzlardan; chegara bilan yopilgan qarzning
  mikro-qoldigʻi koʻrinmaydi va kontakt oʻchirishga toʻsiq emas. Hisob qoldigʻi (naqd/karta)
  tegilmaydi — chegara faqat «yopiqmi» va «nettoda koʻrinadimi» savollariga tegishli.
- Naqsh tasdiqlandi: chegara qoʻyilgan joyda «chegaradan qolgan qoldiq qayerda koʻrinadi»
  savolini darhol berish kerak edi — javob 0052 ni toʻliq qildi.
- **`discovery/` boʻshadi** (0056 dan keyin ochiq savol qolmadi); `prds/` dagi besh specning
  hammasida «ochiq savol qolmadi» deb yozilgan.

## 2026-08-17 — 0052–0055: qolgan toʻrt discovery savoli yopildi

- **0052:** qarz chegara bilan yopiladi (dollarda ≤ 1 sent, soʻmda ≤ 100 soʻm). Variant matni
  «1 sentdan kam» edi — butun sentlarda bu aynan nol boʻlib qolardi, shuning uchun `≤` oʻqishi
  olindi va sabab qarorga yozildi. **Saboq:** chegara qiymati taklif qilinganda uni saqlash
  birligida tekshirish kerak, aks holda qatʼiy tengsizlik chegarani yoʻqqa chiqaradi.
- **0053** (eksport sanasi faylga kiradi), **0054** (avtomatik zaxira ham eksport sanaladi),
  **0055** (boʻsh daftarga importda istisno; «boʻsh» taʼrifi kategoriyalarni ham qamraydi,
  chunki tayyor kategoriyalar har doim bor — 0028).
- **Yangi boʻshliq:** 0052 chegarasi qarzni yopadi, lekin mikro-qoldiq kontakt nettosida (0037)
  qolib ketadi → `discovery/chegara-bilan-yopilgan-qarz-nettoda-qanday.md`. Naqsh: chegara
  qoʻyilgan joyda «chegaradan qolgan qoldiq boshqa qayerda koʻrinadi» degan savol deyarli har
  doim tugʻiladi.
- `prds/zaxira.md` va `prds/qarz-daftari.md` dan tashqari hamma specda ochiq savol qolmadi;
  qarz daftarida bitta ochiq savol bor (yuqoridagi netto savoli).

## 2026-08-17 — 0051 va koʻchirish ishi

- **0051:** yashirilgan kategoriya nomi bilan qoʻshish rad etiladi; xato yashirilganlikni aytadi
  va «Koʻrsatish» yoʻlini koʻrsatadi; avtomatik koʻrsatish yoʻq (0013 ga aniqlik). Savol
  **backend** T3 dan chiqdi — dizayndan keyin qurish qatlami ham boʻshliq topadi.
- Xabar matnini qarorda takrorlamadim: matn `design/` niki (0039), qaror faqat xulqni belgilaydi.
  Shu chegarani saqlash kerak — aks holda bir matn ikki joyda turib, biri eskiradi.
- `design/kirim-chiqim.md` dagi «qaytarish» panelining uch qoidasi `prds/kirim-chiqim.md` ga
  koʻchirildi (9a-band, 12a/12b-mezonlar). Ziddiyat yoʻq edi. Qoida: xulq `prds/` da, koʻrinish
  va matn `design/` da.

## 2026-08-17 — 0048–0050: dizayn ishidan chiqqan uchta qaror

- **0048:** «qaytarish» 7 soniya (0029 dagi «bir necha soniya» ning raqami). **0049:** nol kurs
  taqiqlanadi, «Kurs notoʻgʻri» (0042 ga aniqlik; 0033 nol taqiqi faqat summaga tegishli edi).
  **0050:** tur uchun standart qiymat yoʻq (kirimni chiqim deb yozish xavfi bir bosishdan
  ogʻirroq).
- Naqsh: **dizayn qatlami spec boʻshligʻini topadi.** Uchala savol ham ekran tavsifi
  yozilayotganda chiqdi — «necha soniya», «nol kiritilsa nima boʻladi», «forma ochilganda nima
  turadi» kabi savollarga PRD/spec javob bermagan edi. Yangi ekran tavsifidan keyin shu uch
  turdagi boʻshliqni ataylab qidirish kerak.
- `design/kirim-chiqim.md` ketma-ket oʻchirish holatini allaqachon yopgan (bir vaqtda bitta
  panel; ikkinchi oʻchirish birinchisini yakuniy qiladi; ekrandan chiqilsa yakuniy) — bu
  xatti-harakat qoidasi hozircha faqat `design/` da turibdi, `prds/` da yoʻq.
- Eski qarorga aniqlik kiritilganda unga fayl oxirida `ANIQLIK: …` qatori qoʻyildi (0029 → 0048,
  0042 → 0049) — `YOPILDI:` naqshining yumshoq varianti.

## 2026-08-16 — 0047: `yaratilgan` maydoni; kurs zanjiri yopildi

- **0047:** har yozuv va qarz toʻlovida `yaratilgan` vaqt maydoni (ISO 8601, UTC) — 0044 dagi
  «bir xil sanada oxirgi kiritilgani» shundan aniqlanadi; faylga kiradi; tahrirlashda
  oʻzgarmaydi; foydalanuvchiga koʻrinmaydi. `sana` (foydalanuvchi qoʻyadi) va `yaratilgan`
  (texnik tartib) — ikki ayri maydon.
- Bu 0014 ga zid emas: bitta texnik maydon audit izi emas, oʻzgarish tarixi baribir saqlanmaydi.
  Shu jumlani qarorga yozib qoʻyish keyingi agentning «bu 0014 ni buzadi» degan savolini yopadi.
- **Kurs zanjiri toʻliq yopildi:** 0023 → 0042 (butun soʻm, yaxlitlash) → 0043 (qoʻlda soʻralgani
  saqlanadi) → 0044 (sana boʻyicha gʻolib) → 0045 (saqlanmaydi, hisoblanadi) → 0047
  (`yaratilgan` bilan tartib). `prds/kirim-chiqim.md` da ochiq savol qolmadi.
- Ochiq qolgan uchta savol faqat zaxira/eslatma va qarz «dumi» boʻyicha.

## 2026-08-16 — 0045 va 0046; kurs mavzusi uchinchi qatlamga oʻtdi

- **0045:** «oxirgi kurs» saqlanmaydi — har safar yozuv va toʻlovlardan 0044 qoidasi bilan
  hisoblanadi. Saqlanadigan yagona kurs — qoʻlda soʻralgani, **sanasi bilan**. Shunday qilib
  `kurslar` bloki sxemasi oʻzgardi: `{ "dollar": { "kurs": 12500, "sana": "2026-08-16" } }`.
- **0046:** hosting — Vercel (0025 dagi «Netlify yoki Vercel» yopildi; 0025 ga `YOPILDI:` qatori
  qoʻshildi, 0008 dagi naqsh boʻyicha). Repo: github.com/UmidMamasoliev/daftar, push bilan
  avtomatik deploy.
- **Yangi boʻshliq:** hisoblab topish 0044 ning «bir xil sanada oxirgi kiritilgani» qismini
  bajarish uchun kiritilish tartibini maʼlumotdan talab qiladi — yozuvda esa faqat `sana` bor,
  vaqt yoʻq. → `discovery/bir-xil-sanada-oxirgi-kiritilgan-qaysi.md`. Javob butun yozuv modeliga
  (`yaratilgan` maydoni?) tegishi mumkin.
- Naqsh tasdiqlandi: «saqlanmaydi, hisoblanadi» tanlovi eski nusxa muammosini yopadi, lekin
  ilgari yozish tartibidan bepul kelgan narsani (kiritilish tartibi) maʼlumotda talab qila
  boshlaydi. Shu almashuvni har safar tekshirish kerak.

## 2026-08-16 — 0044: «oxirgi kurs» sana boʻyicha, va undan chiqqan yangi boʻshliq

- **0044** yopdi: «oxirgi kurs» — eng kech **sanali** yozuv/toʻlovdagi kurs; bir xil sanada
  oxirgi kiritilgani gʻolib; qoʻlda soʻralgan kurs kiritilgan kundagi qiymat sifatida
  qatnashadi. Oʻtgan sanaga kiritilgan yozuv bugungi kursni bosmaydi.
- Shundan **yangi boʻshliq** chiqdi va `discovery/oxirgi-kurs-qanday-saqlanadi.md` ga yozildi:
  0043 kursni sanasiz bitta son qilib saqlaydi (`kurslar: {"dollar": 12500}`), 0044 esa gʻolibni
  sanaga qarab tanlaydi — saqlangan sonning sanasi yoʻq, demak solishtirishga asos yoʻq. Ikki
  yoʻl: kursni sanasi bilan saqlash (fayl sxemasi oʻzgaradi) yoki yozuv/toʻlovlardan qayta
  hisoblash (u holda tahrirlash/oʻchirish oʻz-oʻzidan toʻgʻri ishlaydi). Bu maʼlumot modeli
  qurilishidan OLDIN kerak.
- Naqsh: kurs boʻyicha har qaror keyingi qatlamni ochib berdi (0023 → 0042 → 0043 → 0044 →
  saqlash shakli). Kurs mavzusiga tegilganda yangi savol chiqishini kutish kerak.

## 2026-08-16 — loyihaning hujjat tuzilishi va oʻqish tartibi

- `CLAUDE.md` — faqat koʻrsatkich; haqiqiy qoidalar **`AGENTS.md`** da. Har ish shundan boshlanadi.
- Oʻqish tartibi: `AGENTS.md` → `lessons/qoidalar.md` → `memory/` dagi eng yangi fayl →
  `discovery/` → `decisions/` → `prds/daftar-prd.md` → tegishli qism speci.
- `decisions/NNNN-<nom>.md` formati: `# NNNN — <sarlavha>` · `Sana:` · `Nima hal qilindi:` ·
  `Nega:` · `Nimani oʻzgartiradi:`. Qarorlar hech qachon oʻchmaydi va bahsga tushmaydi.
- `discovery/<savol>.md` formati: `# Savol:` · `Nega muhim:` · `Variantlar:` · `Holat:`.
  Savol yopilsa fayl oʻchadi va qaror `decisions/` ga koʻchadi.
- **0039:** `decisions/` va `prds/` ni faqat `pm` va `hujjat` yozadi; `memory/` ni faqat
  `manager`. `lessons/qoidalar.md` ga hamma agent oʻzi olgan tuzatishni yozadi.
- Yangi qaror qoʻshilganda `AGENTS.md` dagi «`decisions/` — 0001 dan NNNN gacha» qatorini va
  «Qarorlardan kelib chiqadigan majburiy narsalar» roʻyxatini ham yangilash kerak — aks holda
  qoida hub'i qarorlardan orqada qoladi.
- Hamma matn oʻzbekcha, lotin yozuvida (0009). Fayl ichidagi texnik kalitlar ASCII: `som`,
  `dollar`, `naqd`, `karta`, `kirim`, `chiqim`, `berdim`, `oldim`; maydon nomlari ham ASCII:
  `sana`, `kurs`, `yaratilgan`, `izoh`, `yonalish`.
- Yopilgan tanlov ustidagi eski qaror **oʻchmaydi** — unga fayl oxirida `YOPILDI: … <yangi
  qaror fayli>` qatori qoʻshiladi (0008 → 0040, 0025 → 0046 shu naqshda).

## 2026-08-16 — boʻshliqni oʻzim hal qilmayman (lessons/qoidalar.md dan)

Qarorlar orasidagi boʻshliqdan xulosa chiqarib qaror fayliga yozmayman — savol qilib beraman va
`discovery/` ga yozaman, hatto «ochiq narsa qolmasin» deyilgan boʻlsa ham. Odam ilgari shunday
ikkita xulosani ham boshqacha hal qilgan.

## 2026-08-16 — pul va valyuta modelining hozirgi holati

- Summa butun sonda saqlanadi: soʻm — soʻmda, dollar — sentda (0008, 0033).
- Kurs = «1 dollar necha soʻm», **butun soʻmda** (0023, 0042).
- Aylantirish **eng yaqin** butun birlikka yaxlitlanadi (0042) — yuqoriga/pastga majburiy emas.
- «Oxirgi kurs» saqlanmaydi — yozuv va toʻlovlardan hisoblanadi (0045); gʻolib eng kech
  **sanali**, bir xil sanada `yaratilgan` boʻyicha oxirgisi (0044, 0047). Zaxira faylidagi
  `kurslar` bloki faqat qoʻlda soʻralgan kursni sanasi bilan saqlaydi (0043). Kurs tarixi
  yoʻq (0002).
- Import tasdigʻi: avtomatik zaxira chiqariladi → foydalanuvchi **oʻsha faylni qaytarib
  tanlaydi** → moslik tasdiqlangandan keyingina ustiga yoziladi (0027, 0041). Ikkinchi tasdiq
  yoʻli (tugma yoki File System Access API) qurilmaydi.

## 2026-08-16 — qurishdan oldin javob kutayotgan savollar

`discovery/` da: `oxirgi-eksport-sanasi-faylga-kiradimi`, `avtomatik-zaxira-eslatmani-yangilaydimi`,
`bosh-daftarga-import`, `yaxlitlash-dumi-qarzni-yopadimi` (qarz daftaridan oldin),
Yopilganlar: `oxirgi-kurs-qaysi-kiritishdan-yangilanadi` → 0044;
`oxirgi-kurs-qanday-saqlanadi` → 0045; `bir-xil-sanada-oxirgi-kiritilgan-qaysi` → 0047;
`yaxlitlash-dumi-qarzni-yopadimi` → 0052; `oxirgi-eksport-sanasi-faylga-kiradimi` → 0053;
`avtomatik-zaxira-eslatmani-yangilaydimi` → 0054; `bosh-daftarga-import` → 0055.
`chegara-bilan-yopilgan-qarz-nettoda-qanday` → 0056.
2026-08-17 holatiga `discovery/` da ochiq savol yoʻq — qurish uchun hujjat toʻsigʻi qolmadi.
