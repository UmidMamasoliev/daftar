# 0059 — Qarzning oʻzi ham tahrirlanadi va oʻchiriladi

Sana: 2026-08-17
**Bosh agent vakolat bilan tanladi (0058)**

Nima hal qilindi: 0014 («har qanday yozuvni tahrirlaydi va oʻchiradi, tarixsiz») qarzga ham
tegishli. Notoʻgʻri kiritilgan qarz tuzatiladi yoki oʻchiriladi — uni «toʻlab yopish» yoki butun
kontaktni oʻchirish kerak emas.

1. **Oʻchirish** — yozuv va toʻlovdagi naqshning aynan oʻzi (0029, 0048): tasdiq oynasi yoʻq,
   qarz darhol oʻchadi, pastda **7 soniyalik** «qaytarish» tugmasi turadi.
2. Qarz oʻchirilganda uning **hamma toʻlovi ham birga oʻchadi**; «qaytarish» bosilsa qarz ham,
   toʻlovlari ham birga qaytadi. Ikkala holatda ham hisob qoldiqlari, netto va yopiqlik darhol
   qayta hisoblanadi.
3. **Tahrirlash** — qarz formasidagi maydonlar erkin oʻzgaradi: **summa, sana, hisob,
   yoʻnalish**. Oʻzgarish tarixi saqlanmaydi (0014), `yaratilgan` maydoni tegilmaydi (0047).
4. **Valyuta — istisno:** valyuta faqat **toʻlovi yoʻq** qarzda oʻzgartiriladi. Toʻlovi bor
   qarzda valyuta oʻzgartirilmaydi: urinish rad etiladi va sabab koʻrsatiladi (matni `design/`
   da).

**ANIQLIK (bosh agent vakolat bilan, 0058):** qarz **boshqa kontaktga koʻchirilmaydi**. Tahrir
rejimida kontakt qatori faqat koʻrsatiladi, oʻzgartirilmaydi; boshqa kontakt bilan saqlash
urinishi rad etiladi (backendda `qarz-kontakt-ozgarmas` kodi bilan). Sabab: qarz kontaktga
bogʻlanadi (0015) va koʻchirish ikkala kontaktning nettosini hamda «kimga qancha qoldi» degan
javobni jimgina oʻzgartirardi — bitta tahrirda ikkita ekran boshqacha boʻlib qolardi. Notoʻgʻri
kontaktga yozilgan qarz oʻchiriladi va toʻgʻrisiga qaytadan kiritiladi (9c-band): qadam koʻp,
lekin natija koʻrinib turadi. Kirish yoʻli ham shuni qoʻllab-quvvatlaydi — «Yangi qarz» formasi
faqat kontakt sahifasidan ochiladi va kontaktni tanlash umuman yoʻq.

**Eslatma — izoh maydoni.** Qarzda izoh maydoni yoʻq: `prds/qarz-daftari.md` uni sanamaydi va
`design/qarz-daftari.md` (3 va 7-boʻlimlar) uni ataylab qoʻymagan. Shuning uchun 3-banddagi
tahrirlanadigan maydonlar roʻyxatida ham izoh yoʻq — bu qaror yangi maydon yaratmaydi. Qarzga
izoh kerak boʻlsa, u alohida qaror bilan qoʻshiladi.

Nega: 0014 ning sababi qarzda ham bir xil — daftarni yuritadigan odam bilan uni oʻqiydigan odam
bitta (0001, 0005), audit izi ortiqcha. Qarzni tuzatishning yoʻli boʻlmasa, adashib kiritilgan
qarzni yoʻqotishning yagona usuli uni soxta toʻlov bilan «yopish» boʻlardi — daftarda haqiqatda
boʻlmagan pul harakati paydo boʻlardi va hisob qoldigʻi buzilardi (0017). Ochiq qarzi bor kontakt
oʻchirilmagani uchun (0030) butun kontaktni oʻchirish ham yoʻl emas.

4-band sababi: toʻlovlar toʻlov paytidagi kursda qarz valyutasiga aylantirilgan (0023, 0042).
Qarz valyutasi oʻzgarsa, oʻsha aylantirishlar maʼnosiz boʻlib qolardi — qoldiq notoʻgʻri chiqardi
va uni tiklashning yoʻli yoʻq (kurs tarixi saqlanmaydi — 0002, 0045).

Koʻrilgan boshqa variantlar:
- **Qarz umuman tahrirlanmasin, faqat oʻchirilsin.** Rad etildi: bitta raqamni tuzatish uchun
  qarzni oʻchirib, toʻlovlarini qaytadan kiritishga toʻgʻri kelardi.
- **Valyuta ham erkin oʻzgarsin, toʻlovlar joriy kurs bilan qayta aylantirilsin.** Rad etildi:
  daftar kurs tarixini saqlamaydi (0002), demak qayta aylantirish oʻtmishdagi toʻlovlarga oʻzi
  oʻylab topgan kursni qoʻyardi.
- **Oʻchirishda tasdiq oynasi** (qarz toʻlovdan «ogʻirroq» narsa). Rad etildi: 0029 tasdiq
  oynasini butun daftar boʻyicha rad etgan.
- **Qarzni boshqa kontaktga koʻchirish** (tahrirda kontakt tanlanadigan boʻlsin). Rad etildi:
  yuqoridagi ANIQLIK qatoridagi sabab — bitta tahrir ikkala kontaktning nettosini oʻzgartirardi.

Nimani oʻzgartiradi:
- `prds/qarz-daftari.md`: qarzni tahrirlash va oʻchirish bandlari va mezonlari qoʻshiladi;
  «Nima QILMAYDI» ga «toʻlovi bor qarzning valyutasini oʻzgartirish» qatori tushadi.
- `AGENTS.md`: 0029/0048 qatoriga «qarz» ham qoʻshiladi.
- Oʻchirishning vaqtinchalik saqlanishi qarz + uning toʻlovlarini bitta boʻlak sifatida ushlaydi
  (0029 dagi «qaytarish oynasi» ning aynan oʻzi, faqat obyekti kattaroq).
- Testda tekshiriladi: qarz oʻchirilganda toʻlovlari ham ketadi va qoldiqlar qarz umuman
  kiritilmagandagi holatga qaytadi; «qaytarish» ikkalasini birga tiklaydi; 7 soniyadan keyin
  qaytmaydi; summa/sana/hisob/yoʻnalish tahriri qoldiqlarni darhol toʻgʻrilaydi; toʻlovi bor
  qarzda valyuta oʻzgarmaydi, toʻlovi yoʻqda oʻzgaradi. Vitest qatlami, ekran qismi
  komponent testi bilan (0040).
