# 0062 — Qarz yoʻnalishi uchun standart qiymat yoʻq

Sana: 2026-08-17
**Bosh agent vakolat bilan tanladi (0058)**

Nima hal qilindi: «Yangi qarz» formasi ochilganda yoʻnalish **tanlanmagan** boʻlib turadi — na
«Berdim», na «Oldim» oldindan belgilanadi. Foydalanuvchi har safar oʻzi tanlaydi. Yoʻnalish boʻsh
qolsa qarz saqlanmaydi va sabab koʻrsatiladi.

Hisob (**karta**) va valyuta (**soʻm**) standartlari oʻz joyida qoladi — 0035 va 0023/0026
oʻzgarmaydi.

Nega: 0050 aynan yozuv formasidagi «kirim/chiqim» turi haqida, lekin sababi bu yerda ham bir xil.
Yoʻnalish teskari boʻlsa, qarz qarama-qarshi tomonga yoziladi: «berdim» oʻrniga «oldim» tushgan
qarz kontakt nettosini (0037) ikki barobar xato qiladi va hisob qoldigʻini teskari tomonga
suradi (0017) — pul kamayishi oʻrniga koʻpayadi. Bunday xatoni keyin topish qiyin: qarz toʻgʻri
summa va toʻgʻri sana bilan, faqat notoʻgʻri tomonda turadi. Bir bosish tejash bunga arzimaydi.

Hisob va valyuta standartlari boshqacha: ular adashsa ham pulning yoʻnalishini teskari qilmaydi
(0050 dagi aynan shu ajratma).

Koʻrilgan boshqa variant:
- **Standart «Berdim»** (kundalik daftarda odam koʻproq qarz beradi degan taxmin). Rad etildi:
  taxmin oʻlchanmagan, xato esa qimmat — yuqoridagi sabab.

Nimani oʻzgartiradi:
- `prds/qarz-daftari.md`: «Yangi qarz» formasining boshlangʻich holati bandi va mezoni qoʻshiladi.
- Tanlanmagan holat koʻzga koʻrinadigan boʻlishi kerak — koʻrinishi `design/qarz-daftari.md`
  3-boʻlimida (segmentning ikkala boʻlagi ham boʻyalmagan holat).
- Testda tekshiriladi: forma ochilganda yoʻnalish tanlanmagan; yoʻnalishsiz saqlashga urinilsa
  qarz saqlanmaydi va sabab koʻrsatiladi; hisob «karta», valyuta «soʻm», sana bugungi boʻlib
  turadi (0040).
