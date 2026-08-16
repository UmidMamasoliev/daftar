# 0002 — Birinchi versiyaga toʻrt qismning hammasi kiradi

Sana: 2026-08-16

Nima hal qilindi: Birinchi ishlaydigan versiya toʻrt qismdan iborat va ular birga chiqadi:
kirim-chiqim yozuvlari, qarz daftari, oylik hisobot, dashboard.

Birinchi versiyadan TASHQARIDA qoladi — bular qurilmaydi:
- takrorlanuvchi yozuvlar (ijara, oylik toʻlov va shunga oʻxshash avtomatik takror)
- chek rasmini biriktirish
- budjet chegarasi va undan oshganda ogohlantirish
- yozuvlar boʻyicha qidiruv va filtr
- valyuta kursi tarixi (kurs 0010-qaror boʻyicha har yozuvda qoʻlda kiritiladi)

Nega: Toʻrt qism bir-birisiz yarim vosita beradi — yozuvsiz hisobot yoʻq, qarzsiz shaxsiy
daftarning kattaroq yarmi qoplanmaydi, hisobotsiz yozuvlar toʻplanib qoladi. Qisqaroq variantlar
(faqat yozuv, yoki yozuv + qarz) tezroq chiqardi, lekin foydalanuvchi baribir qogʻozga qaytardi.
Yuqoridagi besh narsa chegaradan tashqarida qoldirildi, chunki ularsiz ham daftar toʻliq ishlaydi.

Nimani oʻzgartiradi: Ish hajmi toʻrt qismga boʻlinadi va toʻrttasi ham `prds/` da alohida spec
talab qiladi. Chegaradan tashqaridagi besh narsa boʻyicha yangi discovery-savol ochilmaydi va
ular hech qaysi specga kirmaydi; keyinchalik kerak boʻlsa, har biri alohida qaror bilan
qaytariladi. 0022-qaror shu toʻrt qismni tayyorlik mezoni qilib oladi.
