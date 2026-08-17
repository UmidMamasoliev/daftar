# 0061 — Toʻlov qoidalari: qoldiqdan oshgan, nolga aylanadigan va yopilgan qarzga toʻlov

Sana: 2026-08-17
**Bosh agent vakolat bilan tanladi (0058)**

Nima hal qilindi: `prds/qarz-daftari.md` toʻlovning uch holatini aytmagan edi. Toʻrt band bilan
yopiladi.

**(a) Toʻlov qarz qoldigʻidan katta boʻlsa.** Solishtirish toʻlovning **qarz valyutasiga
aylantirilgan** qiymati bilan olib boriladi (0023, 0042):

- Aylantirilgan qiymat qoldiqdan **0052 chegarasidan koʻp** oshsa (dollarda 1 sentdan, soʻmda
  100 soʻmdan koʻp) — toʻlov **saqlanmaydi**, xato koʻrsatiladi; qarz qoldigʻi ham, hisob
  qoldigʻi ham oʻzgarmaydi.
- **Chegara ichida** oshsa (dollarda ≤ 1 sent, soʻmda ≤ 100 soʻm) — toʻlov **qabul qilinadi**,
  qarz 0052 boʻyicha yopiladi va qarz qoldigʻi **nol** boʻlib koʻrsatiladi. Manfiy qoldiq hech
  qayerda chizilmaydi.
- Hisob qoldigʻiga **haqiqiy toʻlov summasi** tushadi — chegara pul harakatini tuzatmaydi
  (0017, 0035, 0056).

**(b) Aylantirilgan qiymat nolga aylansa** (masalan 1 soʻm ÷ 12 500 kurs) — toʻlov saqlanmaydi,
xato koʻrsatiladi; hisob qoldigʻi ham oʻzgarmaydi.

**(c) Yopilgan qarzga toʻlov qoʻshilmaydi.** «＋ Toʻlov» faqat **ochiq** qarz kartochkasida
turadi. Toʻlov oʻchirilib qarz yana ochiq boʻlsa (8b: yopiqlik har safar qoldiqdan hisoblanadi)
tugma oʻzi qaytadi.

**(d) Toʻlov formasidagi ikkita yordam qatori maʼqullandi** va spec elementiga aylanadi:
1. hisob chiplari ostida — pul qaysi hisobga **tushishi** yoki qaysi hisobdan **chiqishi**
   (yoʻnalish qarzdan olinadi, chip almashtirilsa matn ham oʻzgaradi);
2. kurs maydoni ostida — boshqa valyutadagi toʻlovda **qarzdan ayiriladigan** summa qarz
   valyutasida, summa va kurs toʻldirilgan zahoti.

Matnlari `design/qarz-daftari.md` 4-boʻlimida yozilgan.

**(e) Teskari tomoni — qarz summasi tahrirlanganda toʻlovlardan past qilib qoʻyilsa.**
0059 qarz summasini tahrirlashga ruxsat bergani uchun (a) ning oynadagi aksi paydo boʻldi:
tahrirdan keyin summa allaqachon toʻlangan yigʻindidan kichik boʻlib qolishi mumkin. Qoida
(a) bilan bir xil chiziqda:

- farq **0052 chegarasi ichida** boʻlsa (dollarda ≤ 1 sent, soʻmda ≤ 100 soʻm) — tahrir
  **qabul qilinadi**, qarz yopilgan holatga tushadi va qoldiq nol boʻlib koʻrsatiladi;
- farq chegaradan **koʻp** boʻlsa — tahrir **rad etiladi**, qarz saqlanmaydi va xato
  koʻrsatiladi: **«Qarz summasi toʻlovlardan kichik — toʻlangan: N.»** (aniq matn `design/` da,
  `N` — shu qarzga toʻlangan yigʻindi qarz valyutasida).

Toʻlovlar bu tekshiruvda avtomatik oʻchirilmaydi va kesilmaydi: qaysi toʻlov ortiqcha ekanini
daftar oʻzi hal qila olmaydi — buni odam toʻlovni oʻchirib hal qiladi (9-band).

Nega:

- (a) Ruxsat berilsa qoldiq manfiyga tushardi: manfiy qoldiqning maʼnosi ham, koʻrinishi ham hech
  qayerda taʼriflanmagan, va u nettoga (0037) teskari ishora bilan kirib ketardi. Qatʼiy
  «qoldiqdan oshmasin» qoidasi esa 0042 dagi yaxlitlash tufayli haqiqiy holatni toʻsib qoʻyardi:
  boshqa valyutada «hammasini toʻladim» degan odam bir sentga oshib ketgani uchun toʻlovni
  saqlay olmasdi. 0052 chegarasi shu ikkisi orasidagi yagona chiziq — u allaqachon qarz
  yopiqligini belgilaydi, endi toʻlovning yuqori chegarasini ham oʻsha belgilaydi.
- Qoldiqni nol koʻrsatish sababi: chegara faqat **koʻrsatishga** tegishli (0056). Hisob
  qoldigʻiga haqiqiy summa tushishi ham oʻsha qoidadan — naqd va karta haqiqiy pul harakatidan
  chiqadi va tuzatilmaydi (0017, 0035, 0056).
- (b) Bunday toʻlov qarzga umuman tegmasdi, lekin hisob qoldigʻini oʻzgartirardi: daftarda
  «qarzni toʻladim» deb yozilgan, qarzni esa bir tiyin ham kamaytirmagan qator qolardi.
- (c) Yopilgan qarzga toʻlov — (a) bilan bir ildiz: qoldiq manfiyga oʻtardi. Yopilgan qarzga
  toʻlov kerak boʻlgan holat aslida yangi qarz yoki toʻlovni oʻchirish holati.
- (d) Ikkala qator ham saqlashdan **oldin** javob beradi: qaysi hisob harakatlanadi va
  yaxlitlashdan keyin qarzdan qancha ayiriladi (0042). Ularsiz «nega 100 001 soʻm 8,00 $ boʻldi»
  degan savolning javobi ekranda yoʻq.
- (e) Ruxsat berilsa (a) rad etgan holat orqa eshikdan kirardi: toʻlovlar yigʻindisidan kichik
  qarz — bu aynan manfiy qoldiq. Chegara ichidagi farqni qabul qilish sababi ham (a) dagidek:
  boshqa valyutadagi toʻlovlarda yaxlitlash (0042) bir sentlik dum qoldiradi va u tahrirni
  toʻsib qoʻymasligi kerak. Xatoda toʻlangan yigʻindi koʻrsatiladi, chunki odam qarzni qanchagacha
  tushira olishini boshqa yoʻl bilan bilmasdi.

Koʻrilgan boshqa variantlar:
- **Oshgan toʻlovni qabul qilib, ortiqchasini yangi teskari qarz qilish.** Rad etildi: daftar
  odam yozmagan qarzni oʻzi yaratardi — daftar darajasidagi vosita uchun ogʻir (AGENTS.md).
- **Oshgan qismini jimgina kesib tashlash** (qarz qoldigʻicha ayirish, qolganini yoʻqotish).
  Rad etildi: hisob qoldigʻi haqiqiy pul harakatidan ajralib qolardi (0017).
- **Nolga aylanadigan toʻlovni saqlash.** Rad etildi: nol summali yozuv saqlanmaydi degan qoida
  bilan bir xil ildiz (0033).
- **Yopilgan qarzda «＋ Toʻlov» ni oʻchiq (bosilmaydigan) qilib koʻrsatish.** Rad etildi:
  «Yopilgan» soʻzining oʻzi sababni aytadi, oʻchiq tugma esa ekranni zichlashtiradi.
- **(e) da ortiqcha toʻlovlarni ilova oʻzi oʻchirib yuborishi.** Rad etildi: qaysi toʻlov
  ortiqcha ekanini daftar bila olmaydi va oʻchirilgan toʻlov hisob qoldigʻini ham jimgina
  oʻzgartirardi (0017).

Nimani oʻzgartiradi:
- `prds/qarz-daftari.md`: (a)–(e) bandlari va ular uchun sanab boʻladigan mezonlar; «Nima
  QILMAYDI» ga «yopilgan qarzga toʻlov» va «manfiy qarz qoldigʻi» qatorlari.
- Toʻlovni tekshirish tartibi aniq: avval aylantirish (0042), keyin nolga tekshirish (b), keyin
  qoldiqqa solishtirish (a) — tekshiruvlar «Saqlash» bosilganda bir yoʻla bajariladi. Qarz
  tahriri esa (e) ni shu tartibda tekshiradi: yangi summa toʻlovlar yigʻindisi bilan
  solishtiriladi (0059 dagi tahrir tekshiruvi ichida).
- Testda tekshiriladi: 700 000 soʻm qoldiqli qarzga 700 100 soʻm toʻlov qabul qilinadi (qarz
  yopiladi, qoldiq nol, hisobga 700 100 soʻm tushadi), 700 101 soʻm rad etiladi; 50,00 $
  qoldiqqa 50,01 $ qabul qilinadi, 50,02 $ rad etiladi; 12 500 kurs bilan 1 soʻm toʻlov rad
  etiladi va hisob qoldigʻi oʻzgarmaydi; yopilgan qarzda «＋ Toʻlov» yoʻq, toʻlov oʻchirilgach
  qaytadi; yordam qatorlari hisob chipi va kurs bilan birga oʻzgaradi. (e) uchun: 300 000 soʻm
  toʻlangan qarz summasi 299 899 ga tahrirlansa rad etiladi (farq 101 soʻm) va qarz eski
  summasida qoladi; 299 900 ga tahrirlansa qabul qilinadi (farq 100 soʻm) va qarz yopilgan
  holatga tushadi, qoldiq nol koʻrinadi (0040).

**Raqamlar haqida eslatma:** chegara soʻmda 100 soʻm, dollarda 1 sent (0052). Demak 300 000 soʻm
toʻlangan qarzda 299 999 ham, 299 900 ham **qabul qilinadi** (farq chegara ichida); rad javobi
299 899 dan boshlanadi. Bir sentlik/bir soʻmlik farqni rad etish 0052 ning oʻzi bilan zid
boʻlardi.
