# 0007 — Zaxira nusxa qoʻlda: fayl chiqarish va qaytarib yuklash

Sana: 2026-08-16

Nima hal qilindi: Foydalanuvchi sozlamalardan butun daftarni bitta faylga chiqara oladi va
oʻsha faylni qaytarib yuklay oladi. Avtomatik zaxira yoʻq.

Nega: 0004 boʻyicha maʼlumot faqat qurilmada — demak zaxirasiz daftar bir kunda yoʻqolishi
mumkin. Bulutga avtomatik zaxira serversiz qarorga zid (tashqi xizmatga bogʻlanish kerak
boʻlardi). Qoʻlda eksport/import esa serversiz ishlaydi, tushunarli va qoʻshimcha bogʻliqlik
keltirmaydi.

Nimani oʻzgartiradi: Bu — maʼlumotni ikkinchi qurilmaga koʻchirishning ham yagona yoʻli (0004).
Fayl butun maʼlumotni oʻz ichiga oladi: yozuvlar, qarzlar, kontaktlar, kategoriyalar, hisoblar.
Import qilinganda mavjud maʼlumot bilan nima boʻlishi
`0027-import-avval-zaxira-keyin-ustiga.md` da hal qilindi: avval joriy maʼlumot avtomatik
faylga chiqariladi, keyin fayldagisi ustiga yoziladi. Bu eksport 0021-qarordagi «hisobot eksporti yoʻq» bilan toʻqnashmaydi: bu — butun
maʼlumot zaxirasi, u esa hisobotni chiroyli koʻrinishda chiqarish; ikkalasi boshqa narsa.

YOPILDI: `0024-zaxira-eslatmasi.md` da hal qilindi — ha, ilova eslatadi. Oxirgi eksportdan
30 kun oʻtsa yoki daftar hech qachon eksport qilinmagan boʻlsa, dashboardda bir qatorlik
eslatma turadi. Shu sababli oxirgi muvaffaqiyatli eksport sanasi saqlanishi kerak.
