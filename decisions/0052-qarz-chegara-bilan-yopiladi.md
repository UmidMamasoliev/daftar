# 0052 — Qarz kichik chegaradan oshmagan qoldiq bilan yopilgan sanaladi

Sana: 2026-08-17

Nima hal qilindi: 0042 dagi yaxlitlashdan qoladigan «dum» qarzni ochiq ushlab turmasin degan
savol yopildi.

1. Qarz qoldigʻi **oʻz valyutasida** kichik chegaradan oshmasa, qarz **yopilgan** sanaladi:
   - dollarda — **1 sent yoki undan kam** (`≤ 1`, sentda),
   - soʻmda — **100 soʻm yoki undan kam** (`≤ 100`, soʻmda).
2. Chegara qarzning oʻz valyutasi boʻyicha olinadi (0023): dollar qarziga sent chegarasi,
   soʻm qarziga soʻm chegarasi.
3. Qolgan hamma narsa 0016 dagidek: qoldiq hech qayerda saqlanmaydi, u har safar toʻlovlardan
   hisoblanadi; qarzda «yopiq» degan holat maydoni yoʻq — yopiqlik shu shartning natijasi.

**Oʻqish haqida izoh:** koʻrilgan variant matni «1 sentdan kam» deb yozilgan edi. Summalar butun
sentda saqlangani uchun (0008, 0033) qatʼiy «1 sentdan kam» aynan nolni bildirardi va chegara
maʼnosiz boʻlib qolardi. Shuning uchun «**yoki undan kam**» (`≤`) oʻqishi olindi: 1 sentlik
qoldiq ham yopiq sanaladi. Soʻm chegarasi ham xuddi shunday (`≤ 100`).

Nega: Toʻlov boshqa valyutada kelganda aylantirish eng yaqin birlikka yaxlitlanadi (0042) va
qoldiqda 1–2 sentlik dum qolishi mumkin. Foydalanuvchi «hammasini toʻladim» deydi, daftar esa
qarzni ochiq koʻrsatib turadi, kontakt oʻchirilmaydi (0030) — bu qarz daftarining asosiy
vaʼdasiga («falonchiga qancha qoldi») zid. Kichik chegara buni yopadi va hech qanday yangi
holat maydoni talab qilmaydi.

Koʻrilgan boshqa variantlar:
- **Qatʼiy nol** (faqat aynan nol qoldiq yopiq). Rad etildi: foydalanuvchi 1–2 sentlik qoldiqni
  xato deb koʻradi va uni yopish uchun yoʻl topolmaydi.
- **Qoʻlda «yopish» tugmasi.** Rad etildi: qarzda yopiqlik holati paydo boʻlardi — 0016 «yopiqlik
  saqlanmaydi» deydi.
- **Toʻlovni qarz valyutasida kiritishga majburlash.** Rad etildi: 0023 dagi «boshqa valyutada
  toʻlov» imkoniyati yoʻqolardi.

Nimani oʻzgartiradi:
- `prds/qarz-daftari.md` dagi «qoldiq nolga yetganda yopiladi» qoidasi chegara bilan yoziladi.
- Ochiq qarzi bor kontakt oʻchirilmasligi (0030) shu yangi taʼrifga tayanadi: chegara ichidagi
  qarz ochiq sanalmaydi, demak kontakt oʻchirilaveradi.
- Chegara raqamlari bitta joyda turadi va ikkala valyuta uchun ham qayta ishlatiladi.
- Testda tekshiriladi: 100 $ qarzga toʻliq toʻlovdan keyin 1 sent qolsa qarz yopiq; 2 sent qolsa
  ochiq; soʻmda 100 soʻm qolsa yopiq, 101 soʻm qolsa ochiq; chegara ichida yopilgan qarzli
  kontakt oʻchiriladi. Sof hisob boʻlgani uchun Vitest qatlami (0040).

**Eslatma — hali ochiq:** Chegara bilan yopilgan qarzdan qoladigan mikro-qoldiq kontakt netto
qatorida (0037) va hisob qoldigʻida qanday koʻrinishi bu qaror bilan HAL QILINMADI →
`discovery/chegara-bilan-yopilgan-qarz-nettoda-qanday.md`.
