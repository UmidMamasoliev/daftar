# 0027 — Import: avval joriy maʼlumot avtomatik faylga chiqariladi, keyin ustiga yoziladi

Sana: 2026-08-16

Nima hal qilindi: Foydalanuvchi zaxira faylini import qilganda ilova avval joriy maʼlumotni
avtomatik ravishda faylga chiqarib beradi, shundan keyin fayldagi maʼlumotni mavjudining ustiga
yozadi. Import natijasi — faylda nima boʻlsa, daftarda ham oʻsha; eski maʼlumot esa avtomatik
chiqarilgan faylda qoladi.

Nega: «Ustiga yozish» — «zaxiradan tiklash» degan soʻzning toʻgʻri maʼnosi va natijasi oldindan
aniq. Qoʻshish varianti bir xil yozuvni ikki marta tushirib, qoldiqni notoʻgʻri qilardi. Lekin
0014 boʻyicha oʻzgarish tarixi yoʻq — adashib import qilingan daftarni qaytaradigan hech narsa
qolmasdi. Avtomatik zaxira shu boʻshliqni yopadi: xato boʻlsa ham qaytish yoʻli qoladi.

Nimani oʻzgartiradi: Import bitta emas, ikki bosqichli amal boʻladi. 0007 dagi eksport
mexanizmi shu yerda qayta ishlatiladi — avtomatik chiqarilgan fayl oddiy eksport fayli bilan
bir xil formatda boʻladi va uni qaytarib yuklash mumkin. Avtomatik chiqarilgan fayl nomida
uning qachon va nima uchun yaratilgani koʻrinishi kerak, aks holda foydalanuvchi ikkita
faylni adashtiradi.

Qoʻshimcha talab (agent taklif qildi, **odam tasdiqladi**): zaxira fayli haqiqatan saqlangani
tasdiqlanmasa, ustiga yozish bajarilmaydi. Aks holda qaror oʻz maqsadini yoʻqotadi — saqlanmagan
zaxira qaytish yoʻli emas. Testda alohida tekshiriladi: zaxira olinmasa import toʻxtaydi va
maʼlumot oʻzgarmaydi.
