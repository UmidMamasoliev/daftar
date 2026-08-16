# 0023 — Valyuta modeli: qoldiq valyuta boʻyicha ajratiladi, jami faqat taxminiy

Sana: 2026-08-16

Nima hal qilindi: 0010 dan chiqqan toʻrtta savolning hammasi bitta model bilan yopildi.

1. **Hisob × valyuta.** Hisob 0011 dagidek ikkita boʻlib qoladi — naqd va karta. Hisob
   valyutaga boʻlinmaydi; uning oʻrniga har hisob qoldigʻi valyuta boʻyicha ajratib
   koʻrsatiladi. Masalan naqd: 1 200 000 soʻm va 100 $ — bitta hisob, ikkita qator.
2. **Forma × valyuta.** Yozuv formasida standart valyuta — soʻm. Valyuta maydoni soʻmda turadi
   va unga tegilmasa kurs soʻralmaydi. Faqat boshqa valyuta tanlanganda kurs maydoni ochiladi
   va oʻsha holatda majburiy boʻladi. Soʻmdagi yozuv 0012 dagi tezlikda qoladi: summa,
   kirim/chiqim, kategoriya.
3. **Qarz × valyuta.** Qarz oʻz valyutasida yuritiladi va qoldigʻi har doim oʻsha valyutada
   koʻrsatiladi: dollar qarzi — dollar qoldigʻi. Toʻlov boshqa valyutada kelsa (dollar qarziga
   soʻm toʻlov), toʻlov paytida kiritilgan kurs boʻyicha qarz valyutasiga aylantiriladi va
   qoldiqdan shu miqdor ayiriladi. Kurs toʻlov yozuvida saqlanadi.
4. **Jami × kurs.** Dashboard (0020) va hisobotda (0019) qoldiqlar valyuta boʻyicha alohida
   qatorda koʻrsatiladi. Ularning tagida bitta taxminiy qator turadi: oxirgi kiritilgan kurs
   boʻyicha «≈ jami soʻmda». Bu qator taxminiy ekani foydalanuvchiga koʻrinadigan qilib
   belgilanadi.

Nega: Valyutani hisobga tiqib qoʻyish («naqd-dollar» degan alohida hisob) hisoblar roʻyxatini
oʻstirar va 0011 dagi «ikkita tayyor hisob» qarorini buzardi — shuning uchun ajratma qoldiq
darajasida qoldi. Formada soʻmni standart qilish 0010 (har yozuvda kurs) bilan 0012 (tez
kiritish) oʻrtasidagi toʻqnashuvni yechadi: kundalik soʻm yozuvi sekinlashmaydi, kurs faqat
haqiqatan kerak boʻlganda soʻraladi. Qarzni oʻz valyutasida yuritish — qarzning haqiqiy
maʼnosi: dollar bergan odam dollar kutadi, kurs oʻzgargani uning qarzini kamaytirmaydi.
Aralash valyutani bitta «jami» raqamga siqib qoʻyish esa yolgʻon aniqlik berardi — shuning
uchun haqiqiy qoldiqlar ajratilgan holda turadi, yagona raqam esa faqat taxmin sifatida.

Nimani oʻzgartiradi:
- Maʼlumot modelida qoldiq hisob va valyuta juftligi boʻyicha hisoblanadi; hisob obyekti esa
  ikkita boʻlib qoladi.
- Har yozuvda valyuta saqlanadi; kurs faqat soʻmdan boshqa valyutali yozuvlarda saqlanadi.
- Qarz obyektida valyuta boʻladi; qarz toʻlovi oʻz valyutasi va (kerak boʻlsa) oʻz kursi bilan
  saqlanadi. Qoldiq har safar qarz valyutasida qayta hisoblanadi (0016 bilan mos).
- Soʻmda toʻlangan dollar qarzi ikki joyga taʼsir qiladi: soʻm qoldigʻiga kirim sifatida
  (0017 boʻyicha qarz pul qoldigʻiga taʼsir qiladi) va dollar qarzining qoldigʻiga kamayish
  sifatida.
- Testlarda alohida tekshiriladi: soʻm toʻlov bilan dollar qarzining qoldigʻi, valyuta boʻyicha
  ajratilgan qoldiq, taxminiy jami qatorining belgilangani.

Kurs yoʻnalishi (agent taklif qildi, **odam tasdiqladi**): kurs maydoniga **1 dollar necha
soʻm** ekani kiritiladi. Soʻm — asos valyuta, shuning uchun «≈ jami soʻmda» qatori ham shu
yoʻnalishga tayanadi.

Kursi yoʻq valyuta: agar biror valyuta uchun kurs hech qachon kiritilmagan boʻlsa (masalan
dollar qarzi bor, lekin dollarda birorta yozuv yoʻq), oʻsha valyuta taxminiy jamidan chetda
qoldirilmaydi — ilova «≈ jami soʻmda» ni hisoblashdan oldin foydalanuvchidan kurs soʻraydi va
kiritilgandan keyin uni jamiga qoʻshadi. Yaʼni taxminiy jami har doim hamma valyutani qamrab
oladi. Testda alohida tekshiriladi: kursi yoʻq valyuta paydo boʻlganda kurs soʻraladi va
javobdan keyin taxminiy jami toʻliq chiqadi.
