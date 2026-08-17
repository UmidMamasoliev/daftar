# 0050 — «Kirim yoki chiqim» turi uchun standart qiymat yoʻq

Sana: 2026-08-17

Nima hal qilindi: Yozuv formasi ochilganda **tur tanlanmagan** boʻlib turadi — na «kirim», na
«chiqim» oldindan belgilangan boʻlmaydi. Foydalanuvchi har safar oʻzi tanlaydi. Tur boʻsh
qolsa yozuv saqlanmaydi va sabab koʻrsatiladi — 0012 dagi majburiy maydon qoidasi oʻz kuchida
(`prds/kirim-chiqim.md` 2-mezon).

Nega: Standart qiymat qoʻyilsa, odam uni sezmay oʻtib ketishi mumkin — kirim adashib chiqim
boʻlib yoziladi va bu xato qoldiqni ikki barobar xato qiladi (kirim qoʻshilishi oʻrniga
ayiriladi). Bunday xatoni keyin topish qiyin: yozuv toʻgʻri summa bilan, faqat notoʻgʻri
tomonda turadi. Bir bosish tejash bunga arzimaydi. Hisob va valyutadagi standart qiymatlar
(karta, soʻm — 0011, 0023) boshqacha: ular adashsa ham pulning yoʻnalishini teskari
qilmaydi.

Koʻrilgan boshqa variant:
- **Standart «chiqim»** (kundalik daftarda chiqim koʻproq). Rad etildi: yuqoridagi sabab —
  tejaladigan bitta bosishga qarshi teskari yozilgan kirim xavfi.

Nimani oʻzgartiradi:
- `prds/kirim-chiqim.md` 3-mezoni aniqlashadi: yangi forma ochilganda sana bugungi kun, hisob
  «karta», valyuta «soʻm», **tur esa tanlanmagan** boʻlib turadi.
- Formada tur tanlanmagan holat koʻzga koʻrinadigan boʻlishi kerak — foydalanuvchi nima
  tanlashi kerakligini tushunsin (koʻrinishi `design/` da).
- Testda tekshiriladi: yangi forma ochilganda tur tanlanmagan; tur tanlanmasdan saqlashga
  urinilsa yozuv saqlanmaydi va sabab koʻrsatiladi (2-mezon bilan bir xil qoida).
