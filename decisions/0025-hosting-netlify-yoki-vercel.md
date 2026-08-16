# 0025 — Sayt Netlify yoki Vercel da joylashadi (bepul tarif, avtomatik deploy)

Sana: 2026-08-16

Nima hal qilindi: Daftar statik sayt sifatida Netlify yoki Vercel da joylashtiriladi — bepul
tarifda, git repozitoriysiga bogʻlangan avtomatik deploy bilan. Ikkalasi ham talabga javob
beradi; aniq bittasi chiqarish paytida tanlanadi va bu qarorni oʻzgartirmaydi.

Nega: 0003 boʻyicha ilova serversiz, lekin sayt fayllari baribir qayerdadir turishi kerak edi.
Bepul tarif loyihaga xarajat qoʻshmaydi; avtomatik deploy esa chiqarishni qoʻlda fayl
yuklashdan xalos qiladi — 0003 dagi «chiqarish oson» sababining davomi. Ikkala xizmat ham
statik saytni va PWA uchun kerakli HTTPS ni bepul beradi.

Nimani oʻzgartiradi: `platform/` dagi loyiha statik fayllarga yigʻiladigan (build) boʻlishi
kerak — bu 0008 dagi stek bilan mos. Backend yoʻqligi saqlanadi: hosting faqat fayl tarqatadi,
hech narsa hisoblamaydi va hech narsa saqlamaydi, yaʼni 0004 (maʼlumot faqat qurilmada)
buzilmaydi. HTTPS PWA uchun majburiy va ikkala xizmatda ham tayyor keladi.

YOPILDI: Aniq xizmat `0046-hosting-vercel.md` da tanlandi — **Vercel**; GitHub repozitoriysi
`github.com/UmidMamasoliev/daftar` ga push qilinganda avtomatik deploy.
