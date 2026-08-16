# 0047 — Har yozuv va qarz toʻlovida «yaratilgan» vaqt maydoni boʻladi

Sana: 2026-08-16

Nima hal qilindi: 0044 dagi «bir xil sanada oxirgi kiritilgani gʻolib» qoidasi 0045 dan keyin
hisoblash paytida bajariladi — demak kiritilish tartibi maʼlumotda koʻrinishi kerak.

1. Har yozuv va har qarz toʻlovi **yaratilgan vaqti** bilan saqlanadi: `yaratilgan` maydoni.
2. Bu maydon zaxira fayliga kiradi, yaʼni tartib eksport va importdan keyin ham saqlanadi.
3. «Bir xil sanada oxirgi kiritilgani» aynan shu maydondan aniqlanadi (0044, 0045).
4. `yaratilgan` — **texnik tartib maydoni**, foydalanuvchi koʻradigan `sana` maydonidan ayri.
   `sana` — operatsiya qaysi kunga tegishli ekani (foydalanuvchi oʻzgartira oladi, 0034);
   `yaratilgan` — yozuv daftarga qachon tushgani.
5. Yozuv tahrirlanganda `yaratilgan` **oʻzgarmaydi** — aks holda tahrir tartibni buzib, oʻsha
   kunning gʻolib kursini almashtirib yuborardi.

Nega: Bu — eng ochiq-oydin yechim. Tartib faylni oʻqigan odamga koʻrinib turadi va hech qanday
yashirin shartga tayanmaydi. Qolgan ikki yoʻl tartibni koʻrinmas joyga bogʻlardi.

Koʻrilgan boshqa variantlar:
- **Vaqt boʻyicha oʻsadigan ID.** Rad etildi: qoida ID formatiga yashirin bogʻlanib qolardi —
  ID ni oʻzgartirgan odam buni sezmasdan tartibni buzardi.
- **IndexedDB dagi saqlash tartibi.** Rad etildi: importdan keyin tartib fayldagi massiv
  tartibiga aylanadi va uning kiritilish tartibi bilan bir xilligiga kafolat yoʻq.

Nimani oʻzgartiradi:
- `prds/zaxira.md`: `yozuvlar` va `tolovlar` bloklarining har elementida `yaratilgan` maydoni
  boʻladi; u majburiy maydon sifatida tekshiriladi va import bilan oʻzgarishsiz tiklanadi.
- `prds/kirim-chiqim.md` va `prds/qarz-daftari.md`: «oxirgi kiritilgani» taʼrifi shu maydonga
  bogʻlanadi.
- Bu **audit izi emas** (0014): yozuvda bitta qoʻshimcha texnik maydon paydo boʻladi, oʻzgarish
  tarixi esa saqlanmaydi — tahrirlangan yozuvning eski qiymatlari hech qayerda qolmaydi.
- Foydalanuvchiga bu maydon koʻrsatilmaydi — u hisob-kitob uchun.
- Testda tekshiriladi: bir xil sanada ketma-ket kiritilgan ikki kursli yozuvdan keyingisi gʻolib
  boʻlishi; birinchisi tahrirlansa ham gʻolib oʻzgarmasligi (`yaratilgan` oʻzgarmaydi);
  eksport-import qilingandan keyin ham oʻsha gʻolib qolishi. Vitest qatlami (0040).
