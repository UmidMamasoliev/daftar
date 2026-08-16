# 0044 — «Oxirgi kurs» yozuv sanasi boʻyicha aniqlanadi

Sana: 2026-08-16

Nima hal qilindi: 0043 dagi «oxirgi kurs» qaysi kiritishdan yangilanishi belgilandi.

1. «Oxirgi kurs» — eng **kech sanali** yozuv yoki qarz toʻlovidagi kurs. Ahamiyatlisi
   operatsiyaning sanasi, uning qachon kiritilgani emas.
2. Bir xil sanada bir nechta kurs boʻlsa, oʻsha sananing **oxirgi kiritilgani** gʻolib.
3. Shundan kelib chiqadi: oʻtgan sanaga kiritilgan yozuvning kursi bugungi qiymatni bosib
   ketmaydi.
4. «≈ jami soʻmda» qatori uchun qoʻlda soʻralgan kurs (0023, 0043) ham xuddi shu qoidada
   qatnashadi: u **kiritilgan kundagi** qiymat sifatida hisobga olinadi va yuqoridagi ikkita
   qoida bilan boshqa kurslar bilan solishtiriladi.

Nega: «≈ jami soʻmda» — bugungi pulning taxminiy qiymati, shuning uchun u har doim eng yangi
maʼlum kurs bilan hisoblanishi kerak. Sana boʻyicha tanlash aynan shuni beradi va chekka holatni
ham yopadi: bir kunda ikkita kurs kiritilsa, gʻolib aniq (oxirgi kiritilgani), taxmin qilinadigan
joy qolmaydi.

Koʻrilgan boshqa variantlar:
- **Kiritish tartibi boʻyicha** (eng oxirgi saqlangan kurs gʻolib, sanadan qatʼi nazar). Rad
  etildi: oʻtgan oydagi yozuvni keyin kiritish (0014, 0032 buni ochiq qoldiradi) «≈ jami»ni
  eskirgan kursga tortib ketardi — bugungi qoldiq eski kurs bilan koʻrsatilardi.
- **Faqat qoʻlda soʻralgan kursdan.** Rad etildi: kursni yangilash uchun specda yoʻq alohida
  sozlama maydoni kerak boʻlardi, yozuvlardagi yangi kurslar esa behuda turardi.

Nimani oʻzgartiradi:
- `prds/kirim-chiqim.md` 6c-bandi aniqlashtiriladi: kurs kiritilganda «oxirgi kurs» **shartli**
  yangilanadi — faqat operatsiya sanasi hozirgi «oxirgi kurs» sanasidan kech boʻlsa yoki unga
  teng boʻlsa. Tegishli tekshirish mezonlari qoʻshiladi.
- `prds/zaxira.md` dagi `kurslar` bloki taʼrifi shu qoidaga havola qiladi (qiymat qaysi qoida
  bilan yangilangani).
- `prds/dashboard.md` va `prds/oylik-hisobot.md` dagi «oxirgi kiritilgan kurs» qatorlari shu
  qarorga havola qiladi.
- Testda tekshiriladi: (a) bugungi kursdan keyin oʻtgan sanaga boshqa kursli yozuv kiritilsa
  «oxirgi kurs» oʻzgarmaydi; (b) bir xil sanada ikkita kurs kiritilsa oxirgi kiritilgani
  ishlatiladi; (c) eng kech sanali yozuv kiritilganda «oxirgi kurs» oʻshanikiga oʻtadi;
  (d) qoʻlda soʻralgan kurs kiritilgan kundagi qiymat sifatida qatnashadi. Bu sof hisob-kitob,
  demak Vitest qatlami (0040).

**Eslatma — hali ochiq:** Bu qaror faqat gʻolib kursni tanlash qoidasini belgiladi. U qiymat
qanday saqlanishini HAL QILMADI: sanasi bilan birga saqlanadimi (zaxira faylidagi `kurslar`
bloki bir sonli emas, sanali boʻladimi), yoki har safar yozuv va toʻlovlardan qayta hisoblanadimi
— va shundan kelib chiqib, kursni bergan yozuv tahrirlanganda yoki oʻchirilganda «oxirgi kurs»
oʻzgaradimi. Bu savol `discovery/oxirgi-kurs-qanday-saqlanadi.md` da turibdi va maʼlumot modeli
qurilishidan OLDIN alohida hal qilinadi.
