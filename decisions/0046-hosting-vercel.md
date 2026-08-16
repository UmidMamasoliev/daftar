# 0046 — Hosting: Vercel

Sana: 2026-08-16

Nima hal qilindi: 0025 «Netlify yoki Vercel» deb ochiq qoldirgan tanlov yopildi — sayt
**Vercel** da joylashadi. Hisob ochildi, Vercel CLI ulandi; GitHub repozitoriysi
`github.com/UmidMamasoliev/daftar` ga push qilinganda deploy avtomatik boʻladi.

Nega: 0025 boʻyicha ikkala xizmat ham talabga toʻliq javob berardi (bepul tarif, statik sayt,
HTTPS, avtomatik deploy), yaʼni texnik sabab bilan biri ikkinchisidan ustun emas edi. Tanlov
foydalanuvchi ixtiyorida qoldi va u Vercel ni tanladi. Ikkilanishni ochiq qoldirish esa
chiqarish paytida qayta savol tugʻdirardi.

Nimani oʻzgartiradi:
- Deploy Vercel CLI yoki Git integratsiyasi orqali bajariladi; `server` agenti shu yoʻlni
  ishlatadi, ikkinchi hosting varianti qurilmaydi va sinalmaydi.
- `AGENTS.md` Texnika roʻyxatidagi «Netlify yoki Vercel» → «Vercel».
- 0025 dagi qolgan hamma narsa kuchida: backend yoʻq, hosting faqat fayl tarqatadi, hech narsa
  hisoblamaydi va saqlamaydi (0003, 0004); HTTPS PWA uchun majburiy va tayyor keladi.
- Loyiha statik fayllarga yigʻiladi (Vite, 0040) — build natijasi Vercel ga chiqadi.
