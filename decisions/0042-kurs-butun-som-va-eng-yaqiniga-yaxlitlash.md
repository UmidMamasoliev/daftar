# 0042 — Kurs butun soʻmda kiritiladi; aylantirishda eng yaqiniga yaxlitlanadi

Sana: 2026-08-16

Nima hal qilindi: Ikkita narsa.

1. **Kurs butun soʻmda.** «1 dollar necha soʻm» (0023) butun son sifatida kiritiladi va shu
   holda saqlanadi — masalan `12500`. Kasr qismi yoʻq: kurs maydoniga kasr kiritilmaydi.
2. **Yaxlitlash — eng yaqiniga.** Valyuta aylantirilganda natija eng yaqin butun birlikka
   yaxlitlanadi: dollarda — eng yaqin sentga (0,005 $ dan kami pastga, koʻpi yuqoriga), soʻmda —
   eng yaqin soʻmga. Yuqoriga yoki pastga majburiy yaxlitlash yoʻq.

Nega: Kursni butun soʻmda kiritish oson va bir xil, hamda amalda kurslar butun soʻmda aytiladi —
bu 0033 dagi soddalik ruhi (soʻmda tiyin soʻralmaydi). Kasrli kurs kiritish maydoniga qoʻshimcha
qoida va saqlashda butun songa oʻtkazish talab qilardi, foydasi esa kundalik daftarda
koʻrinmasdi. Eng yaqiniga yaxlitlash tanlandi, chunki u xatoni ikki tomonga taqsimlaydi va
oʻrtacha nolga intiladi; yuqoriga yoki pastga majburiy yaxlitlash esa har aylantirishda xatoni
bitta tomonga toʻplab borardi.

Nimani oʻzgartiradi:
- Yozuv formasidagi va qarz toʻlovidagi kurs maydoni faqat butun son qabul qiladi (0023 dagi
  «kurs faqat dollar tanlanganda soʻraladi va oʻshanda majburiy» qoidasi oʻzgarmaydi).
- Zaxira fayli sxemasidagi `kurs` maydoni — butun son, soʻmda (`prds/zaxira.md`).
- Aylantirish bitta joyda yozilib qayta ishlatiladi: soʻmdagi toʻlovni dollar qarziga
  aylantirish (0023), «≈ jami soʻmda» taxminiy qatori (0023, 0038).
- Testda tekshiriladi: kurs maydoniga kasr kiritilmasligi; 100 001 soʻm 12 500 kurs bilan
  8,00 $ boʻlishi (8,00008 → eng yaqin sent); pastga va yuqoriga yaxlitlanadigan ikkita chegara
  holati. Bu sof hisob-kitob boʻlgani uchun Vitest qatlamiga tushadi (0040).

ANIQLIK: Kursning quyi chegarasi `0049-nol-kurs-taqiqlanadi.md` da belgilandi — kurs musbat
boʻlishi shart, nol kurs bilan saqlash bajarilmaydi.

**Eslatma — hali ochiq:** Yaxlitlashdan qoladigan 1–2 sentlik «dum» qarzni «yopilgan» sanashga
xalaqit beradimi degan savol (0016) shu qaror bilan HAL QILINMADI. U qarz daftari qurilishidan
OLDIN alohida savol boʻlib beriladi. Bu qaror faqat yaxlitlash qoidasini belgilaydi, qarzning
yopilish shartini emas.
