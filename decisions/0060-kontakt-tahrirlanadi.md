# 0060 — Kontakt tahrirlanadi: ism va telefon

Sana: 2026-08-17
**Bosh agent vakolat bilan tanladi (0058)**

Nima hal qilindi: Kontaktning ikkala maydoni ham tahrirlanadi:

1. **Ism** oʻzgartiriladi. Ism boʻsh boʻlmaydi — boʻsh yoki faqat boʻshliqdan iborat ism bilan
   saqlanmaydi va sabab koʻrsatiladi; eski ism joyida qoladi. Chekka boʻshliqlar kesib
   saqlanadi — qoʻshish qoidasining aynan oʻzi.
2. **Telefon** oʻzgartiriladi va **boʻshatilishi** mumkin: u ixtiyoriy maydon (0031). Format
   tekshirilmaydi — qanday terilsa shunday saqlanadi (0031).
3. Tahrir kontaktning qarzlariga, toʻlovlariga va qoldiqlariga tegmaydi. Oʻzgarish tarixi
   saqlanmaydi (0014).
4. Bir xil ism ikki marta boʻlishi tahrirda ham xato emas — ularni telefon raqami ajratadi
   (0031).

Nega: 0015 kontakt uchun «qoʻshish, **tahrirlash**, oʻchirish kerak» deydi, lekin
`prds/qarz-daftari.md` da band ham, mezon ham yoʻq edi — spec 0015 ni toʻliq bajarmasdi.
Tahrirlashsiz ismdagi xato tuzatilmasdi: ochiq qarzi bor kontakt oʻchirilmaydi (0030), demak
notoʻgʻri yozilgan ism qarz yopilgunicha ekranda turaverardi. Ismning majburiyligi qoʻshishda ham
shunday (0031) — tahrirda uni yumshatish daftarda nomsiz kontakt qoldirardi.

Koʻrilgan boshqa variantlar:
- **Faqat telefon tahrirlansin, ism qotib qolsin.** Rad etildi: eng koʻp adashiladigan joy aynan
  ism (harf xatosi, «Akmal aka» → «Akmal»), va u ekranda eng koʻp koʻrinadigan narsa.
- **Kontaktni oʻchirib qaytadan yaratish yetarli.** Rad etildi: oʻchirish qarz tarixini ham olib
  ketadi (0030) va ochiq qarzda umuman ishlamaydi.

Nimani oʻzgartiradi:
- `prds/qarz-daftari.md` «Kontaktlar» boʻlimiga tahrirlash bandi va mezonlari qoʻshiladi.
- Tahrirlash formasi qoʻshish blokining aynan oʻzi boʻladi, toʻldirilgan holda — yangi ekran
  qurilmaydi (koʻrinishi `design/qarz-daftari.md` 2-boʻlimida).
- Testda tekshiriladi: ism tahrirlanib saqlanadi va roʻyxatda yangi ism boʻyicha alifbodagi oʻz
  oʻrnida turadi; telefon tahrirlanadi va boʻshatilganda qatori yoʻqoladi; boʻsh ism bilan
  saqlash rad etiladi va eski ism qoladi; tahrirdan keyin qarzlar, toʻlovlar va netto oʻzgarmaydi
  (0040).
