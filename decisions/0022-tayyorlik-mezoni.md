# 0022 — Tayyorlik mezoni: toʻrt qism ishlaydi va testlari oʻtadi

Sana: 2026-08-16

Nima hal qilindi: Daftar «tayyor» deb hisoblanadi, qachonki 0002 dagi toʻrt qism — kirim-chiqim
yozuvlari, qarz daftari, oylik hisobot, dashboard — ishlasa va ularning testlari oʻtsa. Testlar
gate: testi oʻtmagan qism tayyor emas.

Nega: Bu mezon darhol oʻlchanadi va agentlar ishini toʻxtatib turadigan aniq chegara beradi —
«yaxshi ishlaydi» degan baho oʻrniga oʻtdi/oʻtmadi. Bir oylik haqiqiy foydalanish varianti
haqiqatga yaqinroq boʻlardi, lekin natijani bir oy kutish kerak edi va u loyihaning yakunini
belgilay olmasdi.

Nimani oʻzgartiradi: Har spec (`prds/<feature>.md`) dagi «Qanday tekshiramiz» boʻlimi sanab
boʻladigan test mezoni sifatida yoziladi va oʻsha testlar yozilmaguncha qism tayyor sanalmaydi.
Testlar kod bilan birga, kodgacha yoziladi. Eng muhim tekshiriladigan joylar: pul yigʻindisi va
qoldiq hisobi, 0016 dagi qarz qoldigʻi, 0018 dagi davr chegarasi, 0007 dagi eksport/import
maʼlumotni yoʻqotmasligi. Testlar oʻtgani haqiqiy natija bilan koʻrsatiladi — aytish yetarli emas.
