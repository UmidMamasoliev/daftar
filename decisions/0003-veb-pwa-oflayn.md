# 0003 — Daftar oflayn ishlaydigan, serversiz veb-sayt (PWA) sifatida quriladi

Sana: 2026-08-16

Nima hal qilindi: Daftar — brauzerda ochiladigan veb-sayt. Telefonda ham, kompyuterda ham
ishlaydi. Oflayn ishlaydi va telefon ekraniga oʻrnatsa boʻladi (PWA yoʻnalishi). Ilova
serverisiz: backend, API va foydalanuvchi hisobi yoʻq.

Nega: Chiqarish oson — doʻkon, imzo va yangilanish jarayoni yoʻq, havola yuborish kifoya.
Foydalanuvchi hech narsa oʻrnatmaydi, lekin xohlasa ekranga qoʻsha oladi. Mobil ilova ikki
platformaga chiqarish ishini olib kelardi; Telegram bot esa jadval va uzun roʻyxatni koʻrsata
olmasdi.

Nimani oʻzgartiradi: Bildirishnomaga tayanadigan hech narsa qurilmaydi (0016-qarordagi qarz
eslatmasi shuning uchun tushdi). Server talab qiladigan variantlar butunlay yopildi: 0004
(maʼlumot faqat qurilmada), 0006 (kirish himoyasi yoʻq), 0008 (backend yoʻq) shu qarordan
kelib chiqadi. Ilova birinchi ochilishdan keyin internetsiz toʻliq ishlashi kerak.

YOPILDI: `0025-hosting-netlify-yoki-vercel.md` da hal qilindi — statik sayt Netlify yoki
Vercel da, bepul tarifda, avtomatik deploy bilan. «Serversiz» maʼnosi saqlanadi: hosting faqat
fayl tarqatadi, hech narsa hisoblamaydi va saqlamaydi.
