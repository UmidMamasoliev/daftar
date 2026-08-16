# pm — Daftar loyihasi boʻyicha eslatmalar

Eng yangisi tepada.

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
`oxirgi-kurs-qanday-saqlanadi` → 0045; `bir-xil-sanada-oxirgi-kiritilgan-qaysi` → 0047.
Kurs boʻyicha ochiq savol qolmadi.
