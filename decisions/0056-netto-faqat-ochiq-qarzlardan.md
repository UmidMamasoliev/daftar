# 0056 — Kontakt netto qoldigʻi faqat ochiq qarzlardan yigʻiladi

Sana: 2026-08-17

Nima hal qilindi: 0052 dan qolgan savol yopildi — chegara bilan yopilgan qarzning mikro-qoldigʻi
kontakt ekranida koʻrinmaydi.

1. Kontakt netto qoldigʻi (0037) faqat **ochiq** qarzlardan yigʻiladi: 0052 boʻyicha yopilgan
   qarz — qoldigʻi dollarda ≤ 1 sent, soʻmda ≤ 100 soʻm — hisobga umuman kirmaydi.
2. Yaʼni 0037 dagi taʼrif aniqlashadi: netto — «ochiq qarzlar boʻyicha berdim va oldim farqi»,
   hamma qarz boʻyicha emas. Hamma qarzi yopilgan kontaktda qator umuman chiqmaydi.
3. Kontakt oʻchirilganda yopiq qarz oʻzining mikro-qoldigʻi bilan birga, qarz tarixi ichida
   ketadi. 0030 oʻz kuchida: **ochiq** qarzi bor kontakt oʻchirilmaydi; chegara bilan yopilgan
   qarz esa toʻsiq emas (0052).
4. Hisob qoldigʻiga (naqd va karta) hech narsa oʻzgarmaydi — u haqiqiy pul harakatidan chiqadi
   va hech qanday chegara bilan tuzatilmaydi (0017, 0035). Chegara faqat «qarz yopiqmi» va
   «nettoda koʻrinadimi» degan savollarga tegishli.

Nega: 0052 chegarani aynan shu muammoni yopish uchun qoʻygan edi — foydalanuvchi «hammasini
toʻladim» degan holatda daftar unga qarz koʻrsatib turmasin. Mikro-qoldiq nettoda qolsa,
oʻsha muammo kontakt ekranida qaytardi: qarzlar «yopiq», kontakt tepasida esa «1 sent» turardi.
Netto faqat koʻrsatish uchun ekani (0037, 7b-band) bu tanlovni xavfsiz qiladi — hech qanday
hisob-kitob undan chiqmaydi.

Koʻrilgan boshqa variantlar:
- **Netto hamma qarzdan yigʻiladi, lekin chegaradan kichik natija nol koʻrsatiladi.** Rad
  etildi: hisoblanadigan raqam bilan koʻrsatiladigan raqam ikki xil boʻlib qolardi — keyinchalik
  qaysi biri «haqiqiy» ekani chalkashtiradi.
- **Hech narsa oʻzgarmaydi** (mikro-qoldiq nettoda koʻrinaveradi). Rad etildi: 0052 hal qilgan
  muammo kontakt ekranida qaytardi.

Nimani oʻzgartiradi:
- `prds/qarz-daftari.md` 7a/7b-bandlari netto taʼrifini shu qoida bilan yozadi va mezonlar
  qoʻshiladi.
- Kontakt qatorlari faqat **ochiq** qarzi bor valyutada koʻrinadi.
- Testda tekshiriladi: hamma qarzi chegara bilan yopilgan kontaktda netto qatori chiqmaydi va
  kontakt oʻchiriladi; bitta ochiq qarzi bor kontaktda netto faqat oʻsha qarzdan hisoblanadi;
  hisob qoldiqlari bu qoidadan taʼsirlanmaydi. Vitest qatlami (0040).
