# 0037 — Kontakt qoldigʻi: yoʻnalishlar oʻzaro ayiriladi, valyutalar alohida qoladi

Sana: 2026-08-16

Nima hal qilindi: Kontakt kartasida har valyuta uchun bitta aniq raqam koʻrsatiladi. «Men
berdim» va «men oldim» yoʻnalishlari oʻzaro ayiriladi (netto), valyutalar esa aralashtirilmaydi
— soʻm alohida, dollar alohida. Raqam kim kimga qarzdor ekanini koʻrsatadigan yoʻnalish bilan
beriladi. Berdim/oldim tarixi kontakt ichidagi operatsiyalar roʻyxatida koʻrinadi.

Nega: «Falonchiga qancha qoldi» — qarz daftarining asosiy savoli va unga bitta raqam bilan
javob boʻlishi kerak. Har yoʻnalish va har valyutani alohida qator qilib qoʻyish kontakt
kartasini toʻrt qatorga choʻzardi va javobni bir qarashda koʻrsatmasdi. Hammasini taxminiy
kursda bitta soʻm raqamiga keltirish esa 0023 ga qarshi borardi — u qarzni ataylab oʻz
valyutasida yuritishni talab qiladi, chunki dollar bergan odam dollar kutadi.

Nimani oʻzgartiradi (ikkala qoidani ham agent taklif qildi, **odam tasdiqladi**):
- **Netto faqat koʻrsatish uchun.** Qarzning yopilishi 0016 boʻyicha har qarzning oʻz qoldigʻi
  bilan aniqlanadi, netto bilan emas. Shu sababli 100 $ berilgan va 100 $ olingan kontaktda
  netto nol boʻlsa ham, ikkala qarz ham ochiq sanaladi va 0030 boʻyicha bunday kontakt
  oʻchirilmaydi. Bu yozib qoʻyilmasa, netto qarz yopilishining sharti sifatida ishlatilib,
  ochiq qarz jimgina yoʻqolishi mumkin edi.
- **Kontakt kartasida qatorlar faqat qarzi bor valyutada koʻrinadi:** faqat soʻm qarzi bor
  kontaktda dollar qatori turmaydi. Bu 0038 dagi hisobot qoidasining aynan oʻzi — ikkala
  joyda bir xil naqsh.
- Testda alohida tekshiriladi: netto nol boʻlgan holatda ham ochiq qarz ochiqligicha qoladi
  (`prds/qarz-daftari.md`, 15e-mezon), va qarzi yoʻq valyuta qatori chizilmaydi (15d-mezon).
