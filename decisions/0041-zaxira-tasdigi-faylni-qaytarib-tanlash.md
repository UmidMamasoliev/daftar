# 0041 — Zaxira saqlangani faylni qaytarib tanlash bilan tasdiqlanadi

Sana: 2026-08-16

Nima hal qilindi: 0027 talab qilgan «zaxira saqlangani tasdiqlanmasa, ustiga yozish
bajarilmaydi» qoidasining mexanizmi tanlandi.

1. Import boshlanganda ilova joriy maʼlumotni oddiy yuklab olish bilan faylga chiqaradi
   (`daftar-import-oldidan-YYYY-MM-DD-HHMM.json`).
2. Keyin foydalanuvchi **oʻsha faylni qaytarib tanlaydi**.
3. Ilova tanlangan faylni oʻqiydi va uning joriy maʼlumotga mosligini tekshiradi.
4. Moslik tasdiqlanmaguncha import bajarilmaydi: sabab koʻrsatiladi, daftardagi maʼlumot
   oʻzgarmaydi.

Yaʼni importda ikkita fayl tanlash qadami boʻladi: tiklanadigan zaxira fayli va endigina
chiqarilgan avtomatik zaxira fayli.

Nega: Brauzerdagi oddiy yuklab olish faylning haqiqatan saqlanganini ilovaga qaytarmaydi —
foydalanuvchi oynani yopib yuborsa ham ilova buni bilmaydi. Faylni qaytarib tanlash tasdiqni
haqiqiy qiladi (ilova faylni oʻz koʻzi bilan koʻradi), hamma brauzerda ishlaydi va bitta yoʻl
quriladi hamda testlanadi. Narxi — importda bitta qoʻshimcha fayl tanlash qadami.

Koʻrilgan boshqa variantlar:
- **«Zaxirani saqladim» tugmasi.** Rad etildi: tasdiq odamning soʻziga tayanadi, 0027 shaklan
  bajariladi — saqlanmagan zaxira qaytish yoʻli emas.
- **File System Access API (fayl saqlash oynasi).** Rad etildi: mobil Safari va Firefox da bu
  API yoʻq — oʻsha brauzerlarda import butunlay ishlamay qolardi yoki baribir ikkinchi yoʻl
  kerak boʻlardi.
- **Aralash yoʻl (API bor brauzerda birinchisi, yoʻqida qaytarib tanlash).** Rad etildi: ikkita
  yoʻl quriladi va ikkalasi ham testlanadi — bitta shaxsiy daftar uchun bu ortiqcha narx (0001).

Nimani oʻzgartiradi: `prds/zaxira.md` dagi import oqimi uch qadamli boʻladi — fayl tanlash,
avtomatik zaxira chiqarish, oʻsha zaxirani qaytarib tanlash — va faqat shundan keyin ustiga
yozish. Spec dagi «tasdiqning shakli javobdan keyin yoziladi» degan ochiq joy yopiladi.
Testda tekshiriladi: avtomatik zaxira qaytarib tanlanmasa import toʻxtaydi va maʼlumot
oʻzgarmaydi; notoʻgʻri fayl (boshqa zaxira yoki mos kelmaydigan mazmun) tanlansa ham import
toʻxtaydi. Bu ekrandagi oqim boʻlgani uchun Playwright qatlamiga tushadi (0040).
