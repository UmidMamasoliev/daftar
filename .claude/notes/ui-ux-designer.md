# Dizayn agenti — loyiha eslatmalari (Daftar)

Yangi yozuv yuqoriga qoʻshiladi. Qisqa yozing.

## 2026-08-17 — H1: oylik hisobot ekrani

- Fayllar: `design/uslub.md` (bitta manba: rang, oʻlcham, format, navigatsiya),
  `design/kirim-chiqim.md` (forma va roʻyxat naqshi), `design/qarz-daftari.md` (kartochka,
  netto, «qaytarish» paneli), `design/oylik-hisobot.md` (hisobot).
- **Qolip:** har ekran fayli — «nima koʻrinadi / nima bosiladi va keyin nima boʻladi /
  boʻsh holat / xato holatlari / nima qoʻyilmaydi / TAKLIF». Ekran matnlari «...» ichida
  **aynan** yoziladi, frontend koʻchiradi.
- **Bitta holat — bitta matn.** Kurs xatolari («Kursni kiriting — 1 dollar necha soʻm.»,
  «Kurs notoʻgʻri», «Kurs butun soʻmda — kasr qismi olib tashlandi.») uch ekranda ham aynan
  bir xil. Yangi matn oʻylab topishdan oldin mavjudini qidiring.
- **Modal oyna yoʻq.** Hamma qoʻshimcha kiritish — sahifa ichida ochiladigan blok (kontakt
  qoʻshish, kategoriya qoʻshish, davr tanlash, kurs soʻrash). Tasdiq oynasi ham yoʻq (0029).
- **Ishora maʼnosi ekranga qarab oʻzgaradi:** qarz daftarida `+` = «menga qaytadi» (netto),
  hisobotda `+` = «hisobga tushdi» (pul harakati). Buni har ikkala faylda ochiq yozish kerak,
  aks holda QA ziddiyat deb topadi.
- **0038 tenglik qoidasi** hisobotning eng tekshiriladigan xossasi: kategoriya qatorlari
  valyuta boʻyicha guruhlanadi, guruh yigʻindisi oʻsha valyutadagi jamiga aynan teng, ajratmada
  kurs umuman ishlatilmaydi. «≈ jami soʻmda» faqat eng yuqoridagi jami blokida.
- **Boʻsh davr ≠ boʻsh ekran:** 17-mezon nol raqamlarni koʻrishni talab qiladi, shuning uchun
  jami bloki har doim chiziladi (`0 soʻm`), boʻsh holat matni faqat bloklar ichida.
- Vaqtinchalik navigatsiya (0063) `design/uslub.md` da; yangi boʻlim qurilganda oʻsha
  boʻlimdagi jadval, «Qayerda koʻrinadi» roʻyxati va boʻlaklar soni qoidasi yangilanadi.
- Spec jim qolgan hisob-kitob qoidasi (masalan qarz toʻlovi qaysi valyutada sanaladi) — qaror
  darajasidagi boʻshliq: TAKLIF belgisi bilan yozing, oʻzingiz hal qilmang (`lessons/qoidalar.md`).
  H1 dagi uchala TAKLIF **0064** bilan qabul qilindi: qarz blokida toʻrt yoʻnalish
  («Qarzga berildi» −, «Qarzdan qaytdi» +, «Qarz olindi» +, «Qarz qaytarildi» −); toʻlov oʻz
  valyutasida, kiritilgan summasi bilan sanaladi; kategoriya qatori bosilmaydi. Aniq TAKLIF —
  yorligʻi, ishorasi va sababi yozilgani — bir turda qabul qilindi va matnni qayta yozish
  kerak boʻlmadi.
