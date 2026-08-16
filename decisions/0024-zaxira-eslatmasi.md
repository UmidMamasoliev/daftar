# 0024 — Dashboardda zaxira eslatmasi: 30 kun yoki hech qachon

Sana: 2026-08-16

Nima hal qilindi: Dashboardda bir qatorlik eslatma koʻrinadi, agar oxirgi eksportdan 30 kun
oʻtgan boʻlsa yoki daftar hech qachon eksport qilinmagan boʻlsa. Shart bajarilmasa eslatma
koʻrinmaydi. Eslatma foydalanuvchini 0007 dagi eksportga olib boradi.

Nega: 0004 boʻyicha maʼlumot faqat brauzerda turadi va brauzer uni oʻzi tozalab yuborishi
mumkin; 0007 boʻyicha zaxira faqat qoʻlda olinadi. Ikkalasi birga maʼlumot jimgina yoʻqolishi
mumkin degan holatni yaratadi — foydalanuvchi buni faqat yoʻqotgandan keyin biladi. Eslatma
shu boʻshliqni yopadi: u zaxira olishni majburlamaydi, lekin unutib yuborishga yoʻl qoʻymaydi.

Nimani oʻzgartiradi: Oxirgi muvaffaqiyatli eksport sanasi saqlanadi. 0020 dagi dashboard
tarkibiga shartli qator qoʻshiladi — u doim turmaydi, shuning uchun 0020 dagi «ekranni
zichlashtirmaslik» talabi buzilmaydi. Testlarda uch holat tekshiriladi: hech qachon eksport
qilinmagan (eslatma bor), eksportdan 30 kundan kam oʻtgan (eslatma yoʻq), 30 kundan koʻp
oʻtgan (eslatma bor).
