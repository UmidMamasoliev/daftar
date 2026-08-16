# 0004 — Yozuvlar faqat foydalanuvchi qurilmasida saqlanadi

Sana: 2026-08-16

Nima hal qilindi: Hamma maʼlumot — yozuvlar, qarzlar, kontaktlar, kategoriyalar — foydalanuvchi
brauzerida saqlanadi. Serverga hech narsa yuborilmaydi. Qurilmalar orasida sinxronizatsiya yoʻq.

Nega: Server xarajati va birovning pul maʼlumotini saqlash majburiyati yoʻqoladi; oflayn ishlash
tabiiy boʻlib qoladi. Sinxronizatsiya varianti (qurilmada + serverda) eng qiyin texnik ishni
olib kelardi — bir yozuv ikki joyda oʻzgarganda nima qilish masalasi.

Nimani oʻzgartiradi: Ikkinchi qurilmadan daftarni koʻrib boʻlmaydi — telefonda kiritilgan yozuv
kompyuterda koʻrinmaydi. 0007-qarordagi qoʻlda eksport/import maʼlumotni koʻchirishning yagona
yoʻli boʻlib qoladi. Foydalanuvchi hisobi, parol tiklash, «hamma qurilmada kirish» kabi hech
narsa qurilmaydi.

YOPILDI: `0024-zaxira-eslatmasi.md` da hal qilindi. Brauzer maʼlumotni oʻzi tozalab yuborish
xavfi saqlanadi, lekin endi u yopiq emas: dashboardda shartli eslatma turadi va foydalanuvchini
0007 dagi eksportga olib boradi (oxirgi eksportdan 30 kun oʻtsa yoki hech qachon qilinmagan
boʻlsa). Bu xavfni yoʻqotmaydi, lekin uni koʻrinadigan qiladi.
