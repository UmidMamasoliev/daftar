# 0045 — «Oxirgi kurs» saqlanmaydi, yozuv va toʻlovlardan hisoblanadi

Sana: 2026-08-16

Nima hal qilindi: 0044 dan chiqqan savol — gʻolib kurs qanday saqlanadi — quyidagicha yopildi.

1. «Oxirgi kurs» alohida saqlanadigan qiymat emas. U kerak boʻlganda yozuvlar va qarz
   toʻlovlaridagi kurslardan 0044 qoidasi bilan hisoblab topiladi.
2. Kursni bergan yozuv yoki toʻlov tahrirlansa yoxud oʻchirilsa, qiymat oʻz-oʻzidan toʻgʻrilanadi
   — uni yangilab yuradigan alohida mantiq yoʻq. Bu 0014 (yozuvni erkin tahrirlash) bilan
   uygʻun.
3. Yagona istisno — «≈ jami soʻmda» uchun qoʻlda soʻralgan kurs (0023): uning ortida yozuv yoʻq,
   shuning uchun u **sanasi bilan** saqlanadi va taqqoslashda boshqa kurslar bilan teng
   qatnashadi (0044).
4. Shu bilan 0043 aniqlashadi: «kurs saqlanadi va zaxira fayliga kiradi» degani qoʻlda soʻralgan
   qiymatga tegishli. Yozuv va toʻlov kurslari allaqachon oʻz yozuvi ichida turadi va faylga ham
   oʻsha yerda kiradi — ikkinchi nusxa yaratilmaydi.

Nega: Saqlangan nusxa eskirish xavfini olib keladi. 0014 har qanday yozuvni tahrirlash va
oʻchirishga ruxsat beradi — saqlangan kurs manba yozuv oʻzgargach jimgina notoʻgʻri boʻlib
qolardi va buni hech kim sezmasdi. Hisoblab topishda xato uchun ikkinchi joy umuman ochilmaydi:
maʼlumot bitta joyda, natija har doim undan chiqadi.

Koʻrilgan boshqa variant:
- **Kurs + sana juftligini saqlash** (`kurslar` bloki sanali boʻlardi). Rad etildi: manba yozuv
  tahrirlanganda yoki oʻchirilganda saqlangan qiymatni ham yangilab turadigan qoʻshimcha mantiq
  kerak boʻlardi — va oʻsha mantiq bir joyda unutilsa, xato ekranda jim turardi.

Nimani oʻzgartiradi:
- `prds/zaxira.md` dagi `kurslar` bloki maʼnosi torayadi: u endi faqat **qoʻlda soʻralgan**
  kurslarni sanasi bilan saqlaydi. Yozuv va toʻlov kurslari blokka tushmaydi.
- `prds/kirim-chiqim.md` dagi til «yangilanadi» dan «hisoblab topiladi» ga oʻtadi (6c–6f).
- «≈ jami soʻmda» qatori har koʻrsatilganda joriy maʼlumotdan hisoblanadi — dashboard va oylik
  hisobotda bir xil.
- Testda tekshiriladi: kursli yozuv oʻchirilganda yoki uning kursi tahrirlanganda «≈ jami»
  darhol yangi holatdan hisoblanadi; qoʻlda soʻralgan kurs sanasi bilan saqlanadi va 0044
  taqqosida qatnashadi; zaxira faylida `kurslar` blokida faqat qoʻlda soʻralgan kurs turadi.
  Sof hisob-kitob boʻlgani uchun Vitest qatlami (0040).

**Eslatma — hali ochiq:** 0044 dagi «bir xil sanada oxirgi kiritilgani gʻolib» qoidasi endi
hisoblash paytida bajariladi, demak ilova bir xil sanadagi kurslarning kiritilish tartibini
maʼlumotdan bilishi kerak. Yozuvda hozir faqat `sana` bor. Bu savol
`discovery/bir-xil-sanada-oxirgi-kiritilgan-qaysi.md` da turibdi va maʼlumot modeli
qurilishidan OLDIN hal qilinadi. Bu qaror uni HAL QILMAYDI.
