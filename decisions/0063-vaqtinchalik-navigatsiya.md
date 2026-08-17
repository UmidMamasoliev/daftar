# 0063 — Vaqtinchalik navigatsiya: dashboard qurilgunicha pastki panel

Sana: 2026-08-17
**Bosh agent vakolat bilan tanladi (0058)**

**Bu VAQTINCHALIK yechim.** U dashboard qurilgunicha yashaydi va oʻshanda almashtiriladi.

Nima hal qilindi:

1. Dashboard **3.10 gacha qurilmaydi** — u alohida ish (GitHub Spec Kit bilan taqqoslash uchun).
   Demak hozircha ilovada bosh sahifa yoʻq.
2. Ungacha ilovada **oddiy pastki navigatsiya paneli** turadi. Boʻlimlari qurilgan sari
   qoʻshiladi: **Yozuv** (kiritish formasi), **Yozuvlar**, **Qarz daftari**, keyinchalik
   **Hisobot** va **Zaxira**.
3. Ilova ochilganda birinchi boʻlim koʻrinadi; boʻlimlar orasida faqat shu panel bilan
   oʻtiladi.
4. **Dashboard qurilganda u bosh sahifa boʻladi** (0020 oʻz kuchida) va navigatsiyani
   **dizayn qayta koʻradi** — panel qoladimi, oʻrni oʻzgaradimi, oʻshanda hal qilinadi.

Nega: Qurilgan ekranlarga yetib boradigan yoʻl yoʻq edi. `prds/dashboard.md` navigatsiyani
sanamaydi, `design/qarz-daftari.md` esa «Qarz daftari ekraniga bosh sahifadan kiriladi» deydi —
bosh sahifa esa ataylab 3.10 gacha qurilmaydi. Natijada qarz daftari, yozuvlar va hisobot
qurilib, ochib boʻlmaydigan boʻlib qolardi: na odam koʻra oladi, na E2E test (0040) ularga yeta
oladi.

Panel «vaqtinchalik» deb belgilanishi shart, chunki u 0020 dagi bosh sahifa gʻoyasining oʻrnini
bosmaydi. 0020 kuchda: dashboard qurilganda ilova oʻshandan ochiladi. Bu qaror faqat oraliqni
yopadi.

Koʻrilgan boshqa variantlar:
- **Dashboardning bir qismini hozir qurib qoʻyish** (havolalar uchun boʻlsa ham). Rad etildi:
  dashboard 3.10 uchun ataylab qoldirilgan — uni hozir qurish oʻsha ishning maʼnosini yoʻqotardi
  va keyin ikkinchi marta qurilardi.
- **Navigatsiyasiz qoldirish, ekranlarga faqat manzil (URL) bilan kirish.** Rad etildi: odam
  manzil terib yurmaydi; qismlarni qoʻlda sinash ham, syomkada koʻrsatish ham imkonsiz boʻlardi.
- **Yuqori panelda menyu tugmasi.** Rad etildi: telefonda pastki panel bir bosishda ochiladi,
  menyu esa ikki bosish; vaqtinchalik narsaga bundan koʻp mehnat kerak emas.

Nimani oʻzgartiradi:
- `prds/daftar-prd.md` «Umumiy» boʻlimiga bitta band qoʻshiladi va uning vaqtinchaligi aniq
  yoziladi (0020 bekor qilinmaydi).
- Har yangi qism qurilganda uning boʻlimi panelga qoʻshiladi.
- Dashboard qurilganda bu qaror bajarilib boʻladi: bosh sahifa dashboard boʻladi, panelning
  taqdirini dizayn hal qiladi (oʻshanda yangi qaror yoziladi).
- Testda tekshiriladi: ilova ochilganda panel koʻrinadi va undagi har boʻlim oʻz ekranini
  ochadi; E2E oqimlari shu panel orqali yuradi (0040).
