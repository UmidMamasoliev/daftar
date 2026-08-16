# 0043 — «≈ jami soʻmda» uchun soʻralgan kurs saqlanadi va zaxira fayliga kiradi

Sana: 2026-08-16

Nima hal qilindi: 0023 boʻyicha kursi hech qachon kiritilmagan valyuta uchun soʻraladigan kurs
javobi **saqlanadi**:

1. Daftarda valyuta boʻyicha bitta «oxirgi kurs» qiymati turadi.
2. «≈ jami soʻmda» uchun kurs soʻrovi bir marta boʻladi — javob saqlangandan keyin ilova har
   ochilganda qayta soʻramaydi.
3. Bu qiymat zaxira fayliga kiradi va import bilan tiklanadi (0007, 0027).

Nega: Kundalik vositada bir xil savolni takror soʻrash malol keladi — daftar tez ochilib tez
yopiladigan narsa (0012 ruhi). Qiymatni faylga kiritish esa 0007 dagi «hamma maʼlumot faylda»
tamoyilini saqlaydi: tiklangan daftar toʻliq oldingi holida boʻladi, kurs qayta soʻralmaydi.
Narxi — fayl sxemasiga bitta kichik blok.

Koʻrilgan boshqa variantlar:
- **Saqlanmaydi** (kurs faqat yozuv va toʻlov ichida yashaydi). Rad etildi: birorta ham
  dollardagi yozuv boʻlmasa, kurs har safar soʻralardi.
- **Saqlanadi, lekin faylga kirmaydi.** Rad etildi: qiymat qurilmaga bogʻlanib qolardi va
  tiklangan daftarda kurs qayta soʻralardi — 0007 bilan ziddiyat.

Nimani oʻzgartiradi:
- Maʼlumot modelida yozuv va qarzdan tashqarida bitta kichik qiymat paydo boʻladi: valyuta →
  oxirgi kurs. Kurs butun soʻmda (0042).
- `prds/zaxira.md` fayl sxemasiga shu blok qoʻshiladi va u ham import bilan tiklanadi.
- Yangi kurs kiritilganda (yozuv, toʻlov yoki soʻrov orqali) oxirgi kurs yangilanadi — bu
  «kurs tarixi» emas, faqat bitta oxirgi qiymat (0002 kurs tarixini taqiqlaydi).
- Testda tekshiriladi: kurs bir marta soʻralib javob berilgandan keyin ilova qayta ochilganda
  soʻralmasligi; qiymat eksport faylida turishi; importdan keyin tiklanishi.
