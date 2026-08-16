# 0012 — Yozuvda majburiy maydonlar: summa, kirim/chiqim, kategoriya

Sana: 2026-08-16

Nima hal qilindi: Bitta yozuvni saqlash uchun uchta narsa majburiy: summa, kirim yoki chiqim
ekani, kategoriya. Sana avtomatik ravishda bugungi kun qilib qoʻyiladi (foydalanuvchi uni
oʻzgartira oladi). Izoh ixtiyoriy — boʻsh qoldirilsa ham yozuv saqlanadi.

Nega: Summa va turi boʻlmasa yigʻindi chiqmaydi; kategoriya boʻlmasa 0019 dagi kategoriyalar
ajratmasi boʻsh qoladi va oylik hisobot «pul qayerga ketdi» degan savolga javob bermaydi.
Sana va izohni majburiy qilish yozuv kiritishni formaga aylantirardi — odam kassa oldida yoki
yoʻlda uzun forma toʻldirmaydi va kunlik yozuvni tashlab qoʻyadi.

Nimani oʻzgartiradi: Yozuv qoʻshish ekranida uch qadam koʻrinadi, qolganlari ixtiyoriy boʻlib
pastda turadi. 0010 boʻyicha valyuta soʻmdan boshqa tanlansa, kurs maydoni qoʻshiladi va u
oʻsha holatda majburiy boʻladi — yaʼni majburiy maydonlar soni valyutaga qarab oʻzgaradi.

YOPILDI: Ikkala savol ham yopildi. Valyuta — `0023-valyuta-modeli.md`: standart valyuta soʻm,
maydon formada tayyor turadi va tegilmasa kurs soʻralmaydi; kurs maydoni faqat boshqa valyuta
tanlanganda ochiladi va oʻshanda majburiy boʻladi. Hisob — `0011` dagi qoida: standart hisob
**karta**, u ham tayyor turadi va majburiy maydonlar roʻyxatiga qoʻshilmaydi; naqd kerak
boʻlsa almashtiriladi. Yaʼni soʻmdagi kundalik yozuv shu qarordagi uch qadamda qoladi.
