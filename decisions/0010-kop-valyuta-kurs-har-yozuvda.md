# 0010 — Bir nechta valyuta; kurs har yozuvda qoʻlda kiritiladi

Sana: 2026-08-16

Nima hal qilindi: Daftar bir nechta valyutani qoʻllab-quvvatlaydi va hammasini bitta umumiy
jamiga keltiradi. Kurs avtomatik olinmaydi — u **har bir yozuvda** foydalanuvchidan soʻraladi.
Yaʼni har operatsiya oʻz kursi bilan yoziladi va shu kurs oʻsha yozuvda saqlanib qoladi.

Nega: Bitta odamning qoʻlida soʻm ham, dollar ham yuradi — bitta valyuta bilan cheklansa,
dollarda qarz bergan odam daftardan foydalana olmaydi. Valyutalarni ajratib, jamlamaslik esa
«jami qancha pulim bor» degan savolni javobsiz qoldirardi. Kurs esa 0003/0004 boʻyicha serversiz
qarorda avtomatik kelolmaydi — internetdan kurs olib turadigan joy yoʻq. Qoʻlda kiritish
kiritishni sekinlashtiradi; bu bilib turib tanlandi, chunki har operatsiyaning haqiqiy kursi
saqlanadi va hisobot keyin oʻzgarib ketmaydi.

Nimani oʻzgartiradi: Har yozuvda valyuta va (soʻmdan boshqa boʻlsa) kurs saqlanadi. 0002
boʻyicha kurs tarixi qurilmaydi — kurs faqat yozuv ichida yashaydi. Hisobot va qoldiq
raqamlari har yozuvning oʻz kursi boʻyicha jamlanadi, joriy kurs boʻyicha qayta hisoblanmaydi.

YOPILDI: Bu qarordan toʻrtta savol chiqqan edi — hisob × valyuta, forma × valyuta,
qarz × valyuta, jami × kurs. Hammasi `0023-valyuta-modeli.md` da bitta model bilan yopildi.
Ochiq narsa qolmadi.
