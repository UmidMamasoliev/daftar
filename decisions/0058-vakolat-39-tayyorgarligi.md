# 0058 — Vakolat: 3.9 tayyorgarligi davrida ochiq savollarni bosh agent hal qiladi

Sana: 2026-08-17

Nima hal qilindi: Qolgan uch qism (**qarz-daftari**, **oylik-hisobot**, **zaxira**) qurilishi va
3.9 syomkasiga tayyorgarlik davomida chiqadigan ochiq savollarni **bosh agent oʻzi hal qiladi** —
odamdan soʻrab oʻtirmaydi. Odamning bugungi (2026-08-17) aniq koʻrsatmasi.

Uch shart bilan:

1. **Yozib qoldiriladi.** Har shunday qaror baribir `decisions/NNNN-<nom>.md` ga sababi bilan
   yoziladi va sarlavhasi ostida «**Bosh agent vakolat bilan tanladi (0058)**» deb belgilanadi.
   Vakolat qarorni yozmaslikka ruxsat bermaydi — faqat odamdan soʻramaslikka.
2. **Mavjud qarorlarga tegmaydi.** Vakolat 0001–0057 ni bekor qilishga yoki oʻzgartirishga
   taalluqli emas. Agar toʻgʻri koʻringan tanlov mavjud qarorga zid chiqsa — bosh agent uni
   oʻzi hal qilmaydi, odamga savol qilib beradi. Shu jumladan `prds/daftar-prd.md` va
   `AGENTS.md` dagi «nima QILINMAYDI» chegarasidan chiqadigan har qanday narsa.
3. **Muddati bor.** Vakolat **3.9 syomkasi boshlanguncha** amal qiladi. Undan keyin odatdagi
   tartib qaytadi: boʻshliq → odamga savol. Muddatni uzaytirish uchun yangi qaror kerak.

Nega: Odam off-screen tayyorgarlikning tez ketishini soʻradi. Oldingi sessiyada kurs modeli
toʻrt qadamda turgʻunlashdi (0043→0044→0045→0047) — har qaror keyingi boʻshliqni ochdi va har
biri odamning javobini kutdi. Qolgan uch qismda shunday mayda boʻshliqlar koʻp boʻlishi kutiladi;
ularning har birida toʻxtash tayyorgarlikni syomkagacha ulgurmaydigan qiladi.

`lessons/qoidalar.md` dagi «boʻshliqni odamga savol qilib beraman» qoidasi **kuchda qoladi** — bu
istisno, bekor qilish emas. Qoida oʻz vaqtida toʻgʻri sababdan yozilgan (agent ikkita boʻshliqni
oʻzicha hal qilgan, odam ikkalasini ham boshqacha hal qilgan). Uni chetlashtirayotgan narsa —
agentning oʻz xulosasi emas, odamning oʻz aniq koʻrsatmasi, va faqat shu davr uchun.

Nimani oʻzgartiradi:
- `AGENTS.md`: oʻqish roʻyxatida «0001 dan **0058** gacha»; «Ish tartibi» ning 5-bandiga shu davr
  uchun istisno eslatmasi qoʻshiladi.
- `lessons/qoidalar.md`: qoida joyida qoladi, ostiga 0058 ga bitta qatorli koʻrsatkich qoʻshiladi
  (aks holda keyingi agent qoidani oʻqib baribir toʻxtaydi).
- `discovery/` bu davrda odatda boʻsh turadi: savol ochilib, oʻsha ishning ichida yopiladi.
  Ochiq savol faqat 2-shart ishlaganda — mavjud qarorga zid chiqqanda — `discovery/` da
  odamni kutib qoladi.
- Qaror raqamlari odatdagidek ketma-ket davom etadi (0059, 0060, ...); vakolat bilan qabul
  qilinganlari belgisidan ajralib turadi, shunda syomkadan keyin odam ularni bir oʻqib chiqa
  oladi.
