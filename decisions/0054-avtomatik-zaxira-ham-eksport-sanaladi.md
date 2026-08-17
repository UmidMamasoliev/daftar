# 0054 — Import oldidan olingan avtomatik zaxira ham «eksport» sanaladi

Sana: 2026-08-17

Nima hal qilindi: 0027 boʻyicha import oldidan avtomatik chiqariladigan zaxira fayli ham
muvaffaqiyatli eksport sanaladi: u chiqarilganda oxirgi eksport sanasi yangilanadi va 30 kunlik
eslatma (0024) shundan sanaladi.

Nega: Bu fayl haqiqiy toʻliq nusxa — oddiy eksport fayli bilan bir xil formatda va foydalanuvchi
qurilmasida turibdi (0027, `prds/zaxira.md` 18-band). Uni «zaxira emas» deb sanash eslatmani
notoʻgʻri qilardi: odam endigina toʻliq nusxani olgan, ilova esa «zaxira olmagansiz» deb
turardi. Qoida ham soddaroq boʻladi: **har muvaffaqiyatli eksport sanani yangilaydi** — turi
(`qolda` yoki `import-oldidan`) farq qilmaydi.

Koʻrilgan boshqa variant:
- **Faqat qoʻlda olingan eksport sanaladi.** Rad etildi: ikkita hisob (qaysi eksport «haqiqiy»)
  qoʻshimcha qoida talab qilardi, foydasi esa yoʻq — fayl baribir foydalanuvchi qoʻlida.

Nimani oʻzgartiradi:
- `prds/zaxira.md`: oxirgi eksport sanasi eksportning har ikkala turida ham yangilanadi;
  `eksport.turi` maydoni faqat maʼlumot uchun qoladi.
- Import muvaffaqiyatli boʻlsa, sana keyin fayldagi qiymat bilan almashadi (0053) — yaʼni
  yangilanish importgacha boʻlgan holatga tegishli. Import toʻxtasa (0041), avtomatik zaxira
  baribir olingan boʻlsa sana yangilangan boʻlib qoladi.
- Testda tekshiriladi: import boshlanib avtomatik zaxira chiqarilgach eslatma yoʻqoladi; import
  tasdiqlanmay toʻxtasa ham sana yangilangan boʻlib qoladi. Vitest va Playwright (0040).
