# KELISHUV — maʼlumot qatlami va ekran orasidagi shartnoma

Bu fayl qisqa xarita: qaysi funksiya qanday nom bilan, nima qabul qiladi, nima qaytaradi va
xato qanday bildiriladi. **Manba — TypeScript tiplarining oʻzi** (`src/domain/turlar.ts`);
bu yerda faqat yoʻl koʻrsatiladi.

Holat: **T2 — maʼlumot modeli va pul yadrosi** tayyor. Kategoriyalar roʻyxati (0028), qarz
daftari, hisobot va zaxira keyingi vazifalarda quriladi.

Fayllar:

```
src/domain/     — sof hisob-kitob, bazaga bogʻliq emas
  turlar.ts     — hamma tip va doimiy qiymat
  pul.ts        — summa va kursni oʻqish, valyutani aylantirish
  sana.ts       — sana qoidasi (0034)
  vaqt.ts       — `yaratilgan` vaqti (0047)
  yozuv.ts      — forma tekshiruvi
  kurs.ts       — «oxirgi kurs» (0044, 0045)
  qoldiq.ts     — hisob × valyuta qoldiqlari
src/data/
  baza.ts       — IndexedDB ochish va bitta amal bajarish
  yozuvlar.ts   — yozuvlar doʻkoni: ekran shu fayl bilan gaplashadi
```

---

## 1. Asosiy tiplar

```ts
type Valyuta = 'som' | 'dollar'
type Hisob = 'naqd' | 'karta'
type YozuvTuri = 'kirim' | 'chiqim'

type Yozuv = {
  id: string
  yaratilgan: string        // ISO 8601 UTC — koʻrsatilmaydi, tahrirda oʻzgarmaydi (0047)
  turi: YozuvTuri
  summa: number             // butun son: soʻmda soʻm, dollarda sent (0008, 0033)
  kategoriyaId: string
  sana: string              // 'YYYY-MM-DD', bugun yoki undan oldin (0034)
  hisob: Hisob
  izoh?: string             // boʻsh boʻlsa maydon umuman yoʻq
} & ({ valyuta: 'som' } | { valyuta: 'dollar'; kurs: number })   // kurs faqat dollarda (mezon 7)
```

`YangiYozuv` — xuddi shu, lekin `id` va `yaratilgan` siz (ularni doʻkon qoʻyadi).

```ts
type YozuvFormasi = {
  summa: string       // odam kiritgan matn: '12 500', '8,50'
  turi: YozuvTuri | ''
  kategoriyaId: string
  sana: string        // 'YYYY-MM-DD'
  izoh: string        // boʻsh boʻlishi mumkin
  hisob: Hisob
  valyuta: Valyuta
  kurs: string        // dollarda majburiy; soʻmda eʼtiborga olinmaydi
}
```

---

## 2. Xato qanday bildiriladi

Ikki xil xato bor va ular aralashmaydi:

**a) Forma tekshiruvi** — hech qachon `throw` qilmaydi, `Natija` qaytaradi:

```ts
type Natija<T> = { ok: true; qiymat: T } | { ok: false; xatolar: Xato[] }
type Xato = { maydon: XatoMaydoni; kod: XatoKodi; xabar: string }
```

- `maydon` — qaysi maydonni qizil qilish: `'summa' | 'turi' | 'kategoriyaId' | 'sana' | 'hisob' | 'valyuta' | 'kurs'`.
- `kod` — barqaror kalit, test va shart uchun (masalan `'summa-nol'`, `'kurs-bosh'`).
- `xabar` — foydalanuvchiga koʻrsatiladigan oʻzbekcha sabab (mezon 2, 4c). Ekran oʻz matnini
  qoʻymoqchi boʻlsa — `kod` boʻyicha almashtiradi.
- Hamma xato **birdaniga** qaytadi: uchta maydon boʻsh boʻlsa uchta xato boʻladi.

Kodlar roʻyxati: `summa-bosh`, `summa-notogri`, `summa-kasr`, `summa-kop-kasr`, `summa-nol`,
`summa-manfiy`, `turi-bosh`, `turi-notogri`, `kategoriya-bosh`, `sana-bosh`, `sana-notogri`,
`sana-kelajak`, `hisob-notogri`, `valyuta-notogri`, `kurs-bosh`, `kurs-notogri`, `kurs-kasr`,
`kurs-musbat-emas`.

**b) Bazaga tegishli xato** (yozuv topilmadi, baza ochilmadi) — `Promise` rad etiladi va
`Error` chiqadi. Bu odam tuzata oladigan xato emas, shuning uchun `Natija` ga qoʻshilmagan.

---

## 3. Forma va tekshiruv — `src/domain/yozuv.ts`

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `boshlangichForma()` | — | `YozuvFormasi`: sana bugungi kun, hisob `'karta'`, valyuta `'som'`, qolgani boʻsh (mezon 3) |
| `formaQiymatlari(yozuv)` | `Yozuv` | `YozuvFormasi` — tahrirlash formasini toʻldirish uchun |
| `yozuvniTekshir(forma)` | `YozuvFormasi` | `Natija<YangiYozuv>` |

Tekshiruv qoidalari (0012, 0023, 0033, 0034, 0042):
majburiy — summa, turi, kategoriya; sana bugun yoki undan oldin; izoh ixtiyoriy (boʻsh boʻlsa
maydon saqlanmaydi); soʻmda kasr yoʻq; dollarda ikki kasrgacha va **kurs majburiy**; soʻmda
kurs saqlanmaydi (kiritilgan boʻlsa ham tashlanadi).

## 4. Pul — `src/domain/pul.ts`

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `summaniOqi(matn, valyuta)` | `string`, `Valyuta` | `Natija<number>` — eng kichik birlikda |
| `kursniOqi(matn)` | `string` | `Natija<number>` — butun soʻm |
| `dollarniSomga(sent, kurs)` | `number`, `number` | `number` — eng yaqin soʻm |
| `somniDollarga(som, kurs)` | `number`, `number` | `number` — eng yaqin sent |
| `summaniMatnga(summa, valyuta)` | `number`, `Valyuta` | `string`: soʻm `'12500'`, dollar `'8.50'` |

Qoidalar: boʻshliqlar (`12 500`) tashlanadi, kasr belgisi `,` ham `.` ham boʻlaveradi;
yaxlitlash — eng yaqiniga, teng yarim yuqoriga (0042). Mezon 21: `dollarniSomga(10000, 12500)`
= `1250000`.

**Koʻrsatish formati ekranniki**: `summaniMatnga` — forma maydoni uchun aylanma qiymat, u
mingliklarni boʻshliq bilan ajratmaydi va valyuta belgisini qoʻymaydi.

## 5. Sana va vaqt

| Funksiya | Qaytaradi |
|---|---|
| `bugun()` | mahalliy bugungi kun, `'YYYY-MM-DD'` — sana tanlagichning yuqori chegarasi (mezon 4a) |
| `sananiTekshir(matn)` | `Natija<string>` — kelajak sana rad etiladi (0034) |
| `hozirYaratilgan()` | ISO 8601 UTC; har chaqiruvda oldingisidan katta (mezon 23h). Buni ekran chaqirmaydi — doʻkon oʻzi qoʻyadi |

## 6. Qoldiq — `src/domain/qoldiq.ts`

```ts
type ValyutaQoldigi = { som: number; dollar: number }
type Qoldiqlar = { naqd: ValyutaQoldigi; karta: ValyutaQoldigi }
```

- `qoldiqlar(yozuvlar)` → `Qoldiqlar` (kirim qoʻshadi, chiqim ayiradi; dollar soʻmga tegmaydi).
- `jamiQoldiq(qoldiqlar)` → `ValyutaQoldigi` — hamma hisob boʻyicha, valyutalar baribir alohida.
- `taxminiyJamiSomda(jami, kurs)` → `number` — «≈ jami soʻmda» qatori (0023).

Qoldiq **saqlanmaydi**: har safar joriy yozuvlardan sanaladi, shuning uchun tahrir, oʻchirish
va qaytarishdan keyin qoʻshimcha yangilash kerak emas (mezon 10, 11).

## 7. Oxirgi kurs — `src/domain/kurs.ts`

```ts
type KursManbai = { kurs: number; sana: string; yaratilgan: string }
```

- `yozuvlardanKurslar(yozuvlar)` → `KursManbai[]` (faqat dollardagi yozuvlardan).
- `oxirgiKurs(manbalar)` → `number | null`. Gʻolib: eng kech `sana`li; sanalar teng boʻlsa eng
  kech `yaratilgan`li (0044, 0047). `null` — birorta kurs manbai yoʻq, demak ekran kursni
  soʻrashi kerak (mezon 23g).

Qarz toʻlovlari kurslari (T4) va «≈ jami soʻmda» uchun qoʻlda soʻralgan kurs xuddi shu
`KursManbai` koʻrinishida shu roʻyxatga qoʻshiladi — alohida qoida yoʻq.

## 8. Yozuvlar doʻkoni — `src/data/yozuvlar.ts`

Ekran shu funksiyalar bilan ishlaydi (hammasi `Promise`):

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `yozuvSaqla(forma)` | `YozuvFormasi` | `Natija<Yozuv>` — tekshiradi va saqlaydi (formaga eng qulayi) |
| `yozuvQosh(yangi)` | `YangiYozuv` | `Yozuv` — tekshiruvdan oʻtgan yozuvni saqlaydi |
| `yozuvniOl(id)` | `string` | `Yozuv \| null` |
| `hammaYozuvlar(tartib?)` | `'yangidan'` (standart) yoki `'eskidan'` | `Yozuv[]` — sana boʻyicha, bir kunda `yaratilgan` boʻyicha (mezon 19) |
| `yozuvniYangila(id, yangi)` | `string`, `YangiYozuv` | `Yozuv` — `id` va `yaratilgan` oʻzgarmaydi (mezon 23i) |
| `yozuvniOchir(id)` | `string` | `Yozuv` — **oʻchirilgan nusxa** (pastga qarang) |
| `yozuvniQaytar(yozuv)` | `Yozuv` | `Yozuv` — oʻsha id bilan joyiga qaytaradi |
| `yozuvNusxasi(yozuv)` | `Yozuv` | `Yozuv` — mustaqil nusxa |
| `qoldiqlarniOl()` | — | `Qoldiqlar` |
| `oxirgiKursniOl(qoshimcha?)` | `KursManbai[]` | `number \| null` |
| `bazaniYop()`, `bazaniTozala()` | — | test va qayta ochish uchun |

### «Qaytarish» qanday ishlaydi (0029) — kelishuvning muhim joyi

`yozuvniOchir(id)` yozuvni bazadan **darhol va butunlay** oʻchiradi hamda oʻchirilgan nusxani
qaytaradi. Bazada «oʻchirilgan» bayrogʻi yoki yashirin axlat qutisi **yoʻq** — shuning uchun
hech qanday tozalash mantiqi kerak emas va hamma roʻyxat/qoldiq oʻz-oʻzidan toʻgʻri boʻladi.

Ekranning ishi: qaytarilgan nusxani bir necha soniya oʻzida ushlab turadi va «qaytarish»
bosilsa `yozuvniQaytar(nusxa)` ni chaqiradi. Muddat tugasa nusxani tashlab yuboradi —
oʻchirish yakuniy (mezon 12).

**Narxi ochiq aytilsin:** qaytarish oynasi ochiq turganda sahifa yopilsa yoki yangilansa,
yozuv qaytmaydi. Bu 0029 dagi «vaqt oʻtsa oʻchirish yakuniy» qoidasiga zid emas, lekin ekran
buni bilib turishi kerak. Tugma necha soniya turishi — hali aniqlanmagan raqam (0029 uni
specda yozilishini talab qiladi).

---

## 9. Bu qatlamda YOʻQ narsalar

- Kategoriyalar roʻyxati, qoʻshish va yashirish (0013, 0028) — T3. Hozir yozuv kategoriyaga
  faqat `kategoriyaId` bilan bogʻlanadi va u boʻsh boʻlmasligi tekshiriladi; kirim/chiqim
  roʻyxatlari ajratilishi (mezon 16) ham T3 da.
- Qarz daftari, qarz toʻlovlari va ularning kurslari — T4.
- Eksport/import va qoʻlda soʻralgan kursni saqlash — zaxira vazifasi. Hozir qoʻlda soʻralgan
  kurs `oxirgiKursniOl(qoshimcha)` ga parametr boʻlib beriladi, bazada saqlanmaydi.
- Summani koʻrsatish formati (mingliklar boʻshligʻi, valyuta belgisi, «≈» belgisi) — ekranniki.
- Yozuvlar ekrani, forma, «qaytarish» tugmasi va uning muddati — ekranniki.

---

## 10. Kategoriyalar — `src/domain/kategoriya.ts`, `src/data/kategoriyalar.ts`

**T3 da qoʻshildi.** 9-boʻlimdagi «kategoriyalar — T3» qatori shu boʻlim bilan yopildi
(qarorlar 0013, 0028; mezon 13–16). Yangi fayllar:

```
src/domain/kategoriya.ts    — tayyor roʻyxat, nom tekshiruvi, tur va yashirish qoidasi
src/data/kategoriyalar.ts   — kategoriyalar doʻkoni: ekran shu fayl bilan gaplashadi
```

### Tip

```ts
type Kategoriya = {
  id: string
  nom: string
  turi: 'kirim' | 'chiqim'   // roʻyxatlar alohida (mezon 16)
  yashirilgan: boolean       // oʻchirish emas: nom joyida qoladi (mezon 14)
}
```

### Doʻkon — `src/data/kategoriyalar.ts` (hammasi `Promise`)

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `hammaKategoriyalar()` | — | `Kategoriya[]` — yashirilgani ham; boshqaruv ekrani va hisobot uchun |
| `korinadiganKategoriyalar(turi)` | `'kirim' \| 'chiqim'` | `Kategoriya[]` — yangi yozuv tanlovi uchun (mezon 14, 16) |
| `kategoriyaQosh(nom, turi)` | `string`, `YozuvTuri` | `Natija<Kategoriya>` (mezon 13) |
| `kategoriyaniYashir(id)` | `string` | `Kategoriya` — yangilangan nusxa |
| `kategoriyaniKorsat(id)` | `string` | `Kategoriya` — yangilangan nusxa |
| `kategoriyaniOl(id)` | `string` | `Kategoriya \| null` — yashirilgani ham topiladi |

Kategoriya **oʻchirilmaydi** (0013): `kategoriyaniYashir` faqat bayroqni qoʻyadi, qator
bazada qolaveradi. Shuning uchun eski yozuvning kategoriyasi yashirilgan boʻlsa ham nomi
`kategoriyaniOl(id)` yoki `hammaKategoriyalar()` orqali topiladi — hisobot va yozuvlar
ekrani shundan foydalanadi (mezon 14).

**Urugʻlanish (mezon 15):** doʻkon boʻsh boʻlsa birinchi oʻqishda 0028 dagi 11 ta
kategoriya avtomatik sepiladi — chiqimda 8 ta, kirimda 3 ta. Tayyor kategoriyalarning
`id` si oʻzgarmas lotin kaliti (`oziq-ovqat`, `sogliq`, `qoshimcha-daromad` …), qoʻshilgani
esa tasodifiy id oladi.

**Tartib** (dizayn, `design/kirim-chiqim.md` 1-boʻlim): avval tayyor kategoriyalar 0028 dagi
tartibda, keyin foydalanuvchi qoʻshganlari **qoʻshilish tartibida** — nom boʻyicha
saralanmaydi. Ekran qoʻshimcha tartiblash qilmaydi: `hammaKategoriyalar()` va
`korinadiganKategoriyalar(turi)` shu tartibda beradi.

Mexanizmi: qoʻshilgan kategoriyada ixtiyoriy `yaratilgan?: string` maydoni boʻladi
(ISO 8601 UTC, yozuvdagi kabi monoton oʻsadi — 0047). U yozuv bilan birga saqlanadi,
demak zaxira faylidan qaytgandan keyin ham tartib oʻsha boʻlib qoladi. Tayyor
kategoriyalarda bu maydon yoʻq — ularning tartibi 0028 roʻyxatidan chiqadi. Maydon
ekranga koʻrsatilmaydi va ekran uni oʻzi qoʻymaydi; `Kategoriya` yasayotgan test yoki
komponent uni tashlab ketsa ham tip buzilmaydi (ixtiyoriy).

### Xatolar (yangi kodlar)

| Kod | Maydon | Xabar |
|---|---|---|
| `kategoriya-nom-bosh` | `nom` | `Nom kiriting` |
| `kategoriya-takror` | `nom` | `Bunday kategoriya bor` — koʻrinib turgan bir xil nom |
| `kategoriya-yashirilgan` | `nom` | `Bu kategoriya yashirilgan` — nom band, lekin qator yashirilgan (0051); ekran «Koʻrsatish» ga yoʻnaltiruvchi oʻz matnini qoʻyadi |
| `kategoriya-turi` | `kategoriyaId` | `Bu kategoriya boshqa turga tegishli.` |
| `kategoriya-topilmadi` | `kategoriyaId` | `Kategoriya topilmadi.` |

`XatoMaydoni` ga `'nom'` qoʻshildi — kategoriya formasidagi nom maydoni.
Nom bandligi **faqat joriy tur** roʻyxati ichida tekshiriladi; solishtirishda chekka
boʻshliqlar kesiladi va harf katta-kichikligi hisobga olinmaydi («  Transport » =
«transport»). Yashirilgan kategoriya ham nomni band qiladi (u oʻchmagan) — lekin kodi
boshqa: `kategoriya-yashirilgan`, chunki foydalanuvchi uni roʻyxatda koʻrmaydi (0051).
Qoʻshish baribir bajarilmaydi va ilova yashirilgan kategoriyani oʻzi koʻrsatib yubormaydi;
qaysi qatorni «Koʻrsatish» kerakligini `nomBoyichaTop(kategoriyalar, nom, turi)`
(`src/domain/kategoriya.ts`) aytadi — solishtirish qoidasini ekran takrorlamasin.

### Yozuv bilan bogʻlanish (mezon 16)

`yozuvniTekshir(forma)` va `yozuvSaqla(forma)` — **oʻzgarmadi**. Ikkalasiga ixtiyoriy
ikkinchi parametr qoʻshildi:

```ts
yozuvniTekshir(forma, kategoriyalar?)   // domain
yozuvSaqla(forma, kategoriyalar?)       // doʻkon
```

Roʻyxat berilsa: tanlangan `kategoriyaId` oʻsha roʻyxatda borligi va turi yozuv turiga mos
kelishi tekshiriladi (`kategoriya-topilmadi`, `kategoriya-turi`). Berilmasa — T2 dagidek
faqat boʻsh emasligiga qaraladi.

Qaysi roʻyxatni berish ekranning qaroriga qoladi:
- **yangi yozuv formasi** → `korinadiganKategoriyalar(turi)`;
- **tahrirlash formasi** → `hammaKategoriyalar()`, chunki eski yozuvning kategoriyasi
  yashirilgan boʻlishi mumkin va u joyida qolishi kerak (mezon 14).

### Baza

`BAZA_VERSIYASI` 1 dan **2** ga koʻtarildi va `kategoriyalar` ombori qoʻshildi
(`keyPath: 'id'`, `turi` indeksi). Eski `yozuvlar` ombori va undagi maʼlumot tegilmaydi —
buni `src/data/baza.test.ts` 1-versiyali bazani yasab koʻrsatadi.

### Bu boʻlimda YOʻQ narsalar

- Kategoriyani butunlay oʻchirish — faqat yashirish bor (0013).
- Kategoriya nomini tahrirlash — qarorlarda yoʻq, soʻralmagan.
- Kategoriyalar ekrani, tanlov roʻyxatining koʻrinishi va tartib tugmalari — ekranniki.

---

## 11. Pul chegarasi — aylantirish natijasi ham tekshiriladi (mezon 4g)

Summa (`summaniOqi`) va kurs (`kursniOqi`) alohida-alohida `Number.MAX_SAFE_INTEGER`
chegarasiga tekshiriladi (mezon 4e, 4f) — **lekin bu yetmaydi**: ikkalasi ham sigib,
koʻpaytmasi sigmasligi mumkin (masalan 10 000 $ × 9 007 199 254 740). Oʻshanda soʻmdagi
qiymat jimgina notoʻgʻri raqamga aylanadi (1a1, 1a2).

`src/domain/pul.ts` da ikkita tekshiruv turadi:

| Funksiya | Qaytaradi |
|---|---|
| `dollarSomgaSigadimi(sent, kurs)` | `boolean` — `sent × kurs` xavfsiz chegaraga sigadimi |
| `somDollargaSigadimi(som)` | `boolean` — `som × 100` sigadimi |

`yozuvniTekshir` dollardagi yozuvda shuni chaqiradi va sigmasa mavjud xatoni qaytaradi:
maydon `summa`, kod `summa-notogri`, xabar **«Summa juda katta.»** — ekran uchun yangi kod
yoʻq. Tekshiruv **koʻpaytmaga** qoʻyiladi (boʻlishdan oldingi qadam): oraliq qiymat aniq
boʻlmasa yaxlitlash ham notoʻgʻri chiqadi.

**T4 uchun:** qarz va qarz toʻlovi aylantirishi ham shu ikki funksiyadan oʻtsin — chegara
bitta joyda yopilgan, uni takrorlab yozish shart emas.

---

# QARZ DAFTARI (Q1) — 12–17-boʻlimlar

Yuqoridagi 1–11-boʻlimlar **oʻzgarmadi**. Quyidagilar qarz daftari uchun qoʻshildi:
kontakt, qarz, qarz toʻlovi va ularning qoldiqqa hamda «oxirgi kurs» ga taʼsiri.

Yangi fayllar:

```
src/domain/qarz.ts     — kontakt/qarz/toʻlov tekshiruvi, qoldiq, yopilish, netto
src/data/qarzlar.ts    — qarz daftari doʻkoni: ekran shu fayl bilan gaplashadi
```

Qarorlar: 0015, 0016, 0017, 0023, 0029, 0030, 0031, 0034, 0035, 0037, 0042, 0044, 0045,
0047, 0048, 0049, 0052, 0056 va yangi 0059 (qarzni tahrirlash/oʻchirish), 0060 (kontaktni
tahrirlash), 0061 (toʻlov chegaralari), 0062 (yoʻnalish standarti yoʻq). «Qarz kurs manbai
emas» — qaror emas, 0044/0045 ning oʻqilishi (spec 15d-band).

## 12. Qarz daftarining tiplari (`src/domain/turlar.ts`)

```ts
type QarzYonalishi = 'berdim' | 'oldim'          // QARZ_YONALISHLARI

type Kontakt = {
  id: string
  yaratilgan: string        // ISO 8601 UTC — texnik tartib maydoni (0047 naqshi)
  ism: string               // majburiy (0031)
  telefon?: string          // ixtiyoriy; boʻsh boʻlsa maydon umuman yoʻq
}

type Qarz = {
  id: string
  yaratilgan: string        // tahrirda oʻzgarmaydi (0047)
  kontaktId: string
  yonalishi: QarzYonalishi
  summa: number             // butun son: soʻmda soʻm, dollarda sent (0008, 0033)
  valyuta: Valyuta          // qarz oʻz valyutasida yuritiladi (0023)
  sana: string              // 'YYYY-MM-DD', bugun yoki undan oldin (0034)
  hisob: Hisob              // pul shu hisobdan chiqadi/kiradi (0035)
}                           // ← qarzda KURS ham, IZOH ham YOʻQ (0023, 0044, 0045, 0059)

type Tolov = {
  id: string
  yaratilgan: string        // 0047, spec 15c-band
  qarzId: string
  summa: number             // toʻlovning OʻZ valyutasida, butun son
  valyuta: Valyuta
  kurs?: number             // FAQAT toʻlov valyutasi qarz valyutasidan farq qilganda
  sana: string
  hisob: Hisob
}
```

`YangiKontakt`, `YangiQarz`, `YangiTolov` — xuddi shular, lekin `id` va `yaratilgan` siz
(ularni doʻkon qoʻyadi).

Formalar:

```ts
type KontaktFormasi = { ism: string; telefon: string }

type QarzFormasi = {
  kontaktId: string
  yonalishi: QarzYonalishi | ''   // boshida boʻsh — standart yoʻnalish yoʻq (0050 ruhi)
  summa: string
  sana: string
  hisob: Hisob
  valyuta: Valyuta
}

type TolovFormasi = {
  qarzId: string
  summa: string
  sana: string
  hisob: Hisob
  valyuta: Valyuta
  kurs: string     // boshqa valyuta tanlanganda majburiy; bir xilida eʼtiborsiz
}
```

Ekranga tayyor koʻrinishlar:

```ts
type NettoQatori = { valyuta: Valyuta; netto: number }
type QarzHolati  = {
  qarz: Qarz
  tolovlar: Tolov[]
  qoldiq: number      // qarz valyutasida; hech qachon manfiy emas
  tolangan: number    // shu qarzga toʻlangan yigʻindi, qarz valyutasida
  yopiq: boolean      // qoldiq ≤ chegara (0052)
}
type KontaktHolati = {
  kontakt: Kontakt
  qarzlar: QarzHolati[]
  netto: NettoQatori[]
  ochiqQarziBormi: boolean
}
type OchirilganKontakt = { kontakt: Kontakt; qarzlar: Qarz[]; tolovlar: Tolov[] }
type OchirilganQarz    = { qarz: Qarz; tolovlar: Tolov[] }
```

**`netto` belgisi:** musbat — kontakt **menga** qarzdor; manfiy — **men** unga qarzdorman;
nol — hisob teng, lekin ochiq qarz bor (mezon 15e). Matnni ekran tanlaydi.

## 13. Qarz mantiqi — `src/domain/qarz.ts` (sof hisob)

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `boshlangichKontaktFormasi()` | — | `KontaktFormasi` — ikkala maydon boʻsh |
| `kontaktFormaQiymatlari(kontakt)` | `Kontakt` | `KontaktFormasi` — tahrirlash uchun |
| `kontaktniTekshir(forma)` | `KontaktFormasi` | `Natija<YangiKontakt>` (mezon 1, 2) |
| `boshlangichQarzFormasi(kontaktId, yonalishi?)` | `string`, `QarzYonalishi \| ''` | `QarzFormasi`: sana bugun, hisob `'karta'`, valyuta `'som'`, yoʻnalish boʻsh |
| `qarzFormaQiymatlari(qarz)` | `Qarz` | `QarzFormasi` — tahrirlash uchun (0059) |
| `qarzniTekshir(forma)` | `QarzFormasi` | `Natija<YangiQarz>` |
| `boshlangichTolovFormasi(qarz)` | `Qarz` | `TolovFormasi`: valyuta — **qarznikidek**, hisob `'karta'`, sana bugun |
| `tolovFormaQiymatlari(tolov)` | `Tolov` | `TolovFormasi` |
| `tolovniTekshir(forma, qarz, tolovlar?)` | `TolovFormasi`, `Qarz`, `Tolov[]` | `Natija<YangiTolov>` |
| `tolovQarzValyutasida(tolov, qarzValyutasi)` | `YangiTolov`, `Valyuta` | `number` — aylantirilgan qiymat |
| `qarzTolovlari(tolovlar, qarzId)` | `Tolov[]`, `string` | `Tolov[]` — faqat oʻshaniki |
| `qarzTolangani(qarz, tolovlar)` | `Qarz`, `Tolov[]` | `number` — toʻlangan yigʻindi, qarz valyutasida (9b2) |
| `tolovOldindanKorish(forma, qarz)` | `TolovFormasi`, `Qarz` | `number \| null` — «Qarzdan ayiriladi: …» qatori uchun (mezon 44) |
| `qarzQoldigi(qarz, tolovlar)` | `Qarz`, `Tolov[]` | `number` — qarz valyutasida, **hech qachon manfiy emas** |
| `qoldiqYopiqmi(qoldiq, valyuta)` | `number`, `Valyuta` | `boolean` |
| `qarzYopiqmi(qarz, tolovlar)` | `Qarz`, `Tolov[]` | `boolean` |
| `ochiqQarzlar(qarzlar, tolovlar)` | `Qarz[]`, `Tolov[]` | `Qarz[]` |
| `kontaktNettosi(qarzlar, tolovlar)` | `Qarz[]`, `Tolov[]` | `NettoQatori[]` |
| `YOPILISH_CHEGARASI` | — | `{ som: 100, dollar: 1 }` (0052) |

Qoidalar bir joyda:

- **Qoldiq saqlanmaydi** — har safar `summa − toʻlovlar` (0016). Toʻlov oʻchirilsa yoki
  qaytarilsa qoldiq oʻz-oʻzidan toʻgʻrilanadi, qoʻshimcha yangilash yoʻq.
- **Yopiqlik ham saqlanmaydi**: `qoldiq ≤ YOPILISH_CHEGARASI[valyuta]` (0052). Holat maydoni
  yoʻq — `yopiq` har safar hisoblanadi.
- **Aylantirish** faqat toʻlovda va faqat **toʻlov kursida** boʻladi (0023): natija eng yaqin
  butun birlikka yaxlitlanadi (0042). `dollarSomgaSigadimi` / `somDollargaSigadimi` chegarasi
  bu yerda ham ishlaydi (11-boʻlim).
- **Netto faqat ochiq qarzlardan** (0056) va faqat koʻrsatish uchun (0037): qarz yopilishi
  netto bilan aniqlanmaydi. Qator faqat oʻsha valyutada ochiq qarz boʻlganda yasaladi
  (mezon 15d, 15f); tartib — avval `som`, keyin `dollar`.
- **Hisob qoldigʻi chegaradan taʼsirlanmaydi** (0056; mezon 15h): 1 sentlik dum qarzni yopadi,
  lekin naqd/karta qoldigʻida oʻsha 1 sent koʻrinib turadi.

## 14. Qarz doʻkoni — `src/data/qarzlar.ts` (hammasi `Promise`)

**Kontakt**

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `kontaktSaqla(forma)` | `KontaktFormasi` | `Natija<Kontakt>` — formaga eng qulayi |
| `kontaktQosh(yangi)` | `YangiKontakt` | `Kontakt` |
| `kontaktniOl(id)` | `string` | `Kontakt \| null` |
| `hammaKontaktlar()` | — | `Kontakt[]` — **alifbo tartibida** (mezon 23) |
| `kontaktniTahrirla(id, forma)` | `string`, `KontaktFormasi` | `Natija<Kontakt>` (0060) |
| `kontaktniYangila(id, yangi)` | `string`, `YangiKontakt` | `Kontakt` — tekshiruvsiz quyi qatlam |
| `kontaktniOchir(id)` | `string` | `Natija<OchirilganKontakt>` — ochiq qarzda xato (0030) |
| `kontaktniQaytar(ochirilgan)` | `OchirilganKontakt` | oʻsha qiymat — kontakt + qarz tarixi qaytadi |
| `kontaktNusxasi(kontakt)` | `Kontakt` | `Kontakt` — mustaqil nusxa |

**Qarz**

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `qarzSaqla(forma)` | `QarzFormasi` | `Natija<Qarz>` — kontakt bor-yoʻqligi ham tekshiriladi |
| `qarzQosh(yangi)` | `YangiQarz` | `Qarz` |
| `qarzniOl(id)` | `string` | `Qarz \| null` |
| `hammaQarzlar(tartib?)` | `'yangidan'` (standart) / `'eskidan'` | `Qarz[]` |
| `kontaktQarzlari(kontaktId, tartib?)` | `string`, `Tartib` | `Qarz[]` |
| `qarzniTahrirla(id, forma)` | `string`, `QarzFormasi` | `Natija<Qarz>` (0059) |
| `qarzniYangila(id, yangi)` | `string`, `YangiQarz` | `Natija<Qarz>` — quyi qatlam, valyuta qoidasi shu yerda |
| `qarzniOchir(id)` | `string` | `OchirilganQarz` — **toʻlovlari bilan birga** oʻchadi (0059) |
| `qarzniQaytar(ochirilgan)` | `OchirilganQarz` | oʻsha qiymat — qarz + toʻlovlari qaytadi |
| `qarzNusxasi(qarz)` | `Qarz` | `Qarz` |

**Toʻlov**

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `tolovSaqla(forma)` | `TolovFormasi` | `Natija<Tolov>` — qarzni va uning toʻlovlarini oʻzi oʻqiydi |
| `tolovQosh(yangi)` | `YangiTolov` | `Tolov` |
| `tolovniOl(id)` | `string` | `Tolov \| null` |
| `hammaTolovlar(tartib?)` | `Tartib` | `Tolov[]` |
| `qarzTolovlariniOl(qarzId, tartib?)` | `string`, `Tartib` | `Tolov[]` — tarix roʻyxati (mezon 7) |
| `tolovniOchir(id)` | `string` | `Tolov` — oʻchirilgan nusxa (mezon 8) |
| `tolovniQaytar(tolov)` | `Tolov` | `Tolov` — oʻsha id bilan joyiga (mezon 9) |
| `tolovNusxasi(tolov)` | `Tolov` | `Tolov` |

**Ekranga tayyor koʻrinishlar**

| Funksiya | Qaytaradi |
|---|---|
| `qarzHolatiniOl(qarzId)` | `QarzHolati` — qarz, toʻlovlari, qoldigʻi, yopiqligi |
| `kontaktHolatiniOl(kontaktId)` | `KontaktHolati` — kontakt kartasi uchun |
| `kontaktHolatlari()` | `KontaktHolati[]` — kontaktlar roʻyxati ekrani uchun |
| `qarzQoldiqlariniOl()` | `Qoldiqlar` — faqat qarz daftarining pulga taʼsiri |

Tartib qoidasi (yozuvlardagi bilan bir xil): qarz va toʻlov roʻyxatlari **sana** boʻyicha,
bir kun ichida **`yaratilgan`** boʻyicha (0047). Standart — `'yangidan'`.
Kontaktlar esa **alifbo** tartibida qaytadi (dizayn, 1-boʻlim; mezon 23): harf
katta-kichikligi hisobga olinmaydi, bir xil ismli kontaktlar orasida tartibni `yaratilgan`
barqarorlashtiradi. Ekran qoʻshimcha saralash qilmaydi.

### «Qaytarish» qanday ishlaydi (0029, 0048)

Uch xil oʻchirish bor va uchalasi ham bir xil naqshda: **darhol** oʻchadi, oʻchirilgan nusxa
qaytariladi, ekran uni **7 soniya** ushlab turadi va bosilsa tegishli `…Qaytar` ni chaqiradi.

| Oʻchirish | Nima ketadi | Qaytarish |
|---|---|---|
| `tolovniOchir(id)` | bitta toʻlov | `tolovniQaytar(tolov)` |
| `qarzniOchir(id)` | qarz **va uning hamma toʻlovi** | `qarzniQaytar(ochirilgan)` |
| `kontaktniOchir(id)` | kontakt **va uning butun qarz tarixi** | `kontaktniQaytar(ochirilgan)` |

Bazada «oʻchirilgan» bayrogʻi yoʻq — shuning uchun qoldiq, netto va «oxirgi kurs» darhol
toʻgʻri boʻladi. Narxi yozuvlardagidek: panel ochiq turganda sahifa yopilsa qaytarish yoʻqoladi.

## 15. Xato kodlari — qarz daftari (ekran matnni shularga bogʻlaydi)

Umumiy kodlar (`summa-*`, `sana-*`, `kurs-*`, `hisob-notogri`, `valyuta-notogri`) oʻzgarmadi:
qarz va toʻlov formalari xuddi yozuv formasidek ishlatadi. Yangi kodlar:

| Kod | Maydon | Xabar (standart) | Qachon |
|---|---|---|---|
| `kontakt-ism-bosh` | `ism` | `Ism kiriting.` | kontakt ismi boʻsh (mezon 2) |
| `kontakt-bosh` | `kontaktId` | `Kontakt tanlanmagan.` | qarz formasida kontakt yoʻq |
| `kontakt-topilmadi` | `kontaktId` | `Kontakt topilmadi.` | doʻkonda bunday kontakt yoʻq |
| `kontakt-ochiq-qarz` | `kontaktId` | `Ochiq qarzi bor kontakt oʻchirilmaydi — avval qarzni yoping.` | 0030 (mezon 16) |
| `yonalish-bosh` | `yonalishi` | `Qarz berdingizmi yoki oldingizmi?` | yoʻnalish tanlanmagan |
| `yonalish-notogri` | `yonalishi` | `Qarz yoʻnalishi notoʻgʻri.` | notoʻgʻri qiymat |
| `qarz-topilmadi` | `qarzId` | `Qarz topilmadi.` | toʻlov formasida qarz yoʻq |
| `qarz-yopiq` | `qarzId` | `Qarz yopilgan — unga toʻlov qoʻshilmaydi.` | 0061c |
| `qarz-valyuta-ozgarmas` | `valyuta` | `Toʻlovi bor qarzning valyutasi oʻzgartirilmaydi.` | 0059 |
| `qarz-kontakt-ozgarmas` | `kontaktId` | `Qarz boshqa kontaktga koʻchirilmaydi.` | 0059; dizayn 5-boʻlim |
| `qarz-summa-tolovdan-kam` | `summa` | `Qarz summasi toʻlovlardan kichik — toʻlangan: <raqam>.` | 0061e, 9b2 |
| `tolov-ortiqcha` | `summa` | `Toʻlov qarz qoldigʻidan katta.` | 0061a |
| `tolov-nol-aylanma` | `summa` | `Toʻlov juda kichik — qarz valyutasida nolga aylanadi.` | 0061b |

`XatoMaydoni` ga qoʻshilgan yangi maydonlar: `'ism'`, `'yonalishi'`, `'kontaktId'`, `'qarzId'`.

`qarz-summa-tolovdan-kam` xabaridagi raqam **formatlanmagan** (mingliklar boʻshligʻisiz,
valyuta belgisisiz) — formatlash ekranniki. Ekran oʻz matnini yozganda raqamni
`QarzHolati.tolangan` dan yoki `qarzTolangani(qarz, tolovlar)` dan oladi.

**Toʻlov chegaralari (0061) qisqacha:**

1. Aylantirilgan qiymat qoldiqdan **chegaradan koʻp** oshsa (`> 100` soʻm / `> 1` sent) —
   rad (`tolov-ortiqcha`).
2. Chegara ichida oshsa — **qabul**: qarz qoldigʻi nolga tushadi va qarz yopiladi, hisob
   qoldigʻiga esa **haqiqiy toʻlov summasi** tushadi (0017) — u tuzatilmaydi.
3. Aylantirilganda nol boʻlsa — rad (`tolov-nol-aylanma`).
4. Yopilgan qarzga toʻlov qoʻshilmaydi — rad (`qarz-yopiq`), doʻkon darajasida ham. Toʻlov
   oʻchirilib qoldiq chegaradan oshsa qarz oʻz-oʻzidan yana ochiladi (mezon 42).

**Qarz summasini tahrirlash chegarasi (0061e; 9b2-band):** yangi summa shu qarzga toʻlangan
yigʻindidan (qarz valyutasida) chegaradan **koʻp** past boʻlsa — tahrir rad etiladi
(`qarz-summa-tolovdan-kam`) va qarz eski holatida qoladi; **chegara ichida** past boʻlsa —
qabul qilinadi, qoldiq nol boʻladi va qarz yopiladi. Toʻlovlar avtomatik oʻchirilmaydi va
kesilmaydi (mezon 33a–33d).

## 16. Qoldiq va «oxirgi kurs» — qarz daftari qoʻshilgach

`src/data/yozuvlar.ts` dagi ikkita funksiya **kengaydi** (imzosi oʻzgarmadi):

- `qoldiqlarniOl()` endi yozuvlar **va** qarz daftaridan qoʻshib beradi (0017; mezon 13–15b).
  Ekran ikki manbani qoʻshib yurmaydi. Qarz «berdim» pulni hisobdan chiqaradi, «oldim»
  kiritadi; toʻlov teskari yoʻnalishda va **oʻz valyutasida** ishlaydi (dollar qarziga soʻm
  toʻlov — soʻm qoldigʻiga kirim, dollar qarzi esa dollarda kamayadi, 0023).
- `oxirgiKursniOl(qoshimcha?)` endi **toʻlov kurslarini** ham qamraydi (spec 15b-band; 0044,
  0045). Gʻolib eski qoidada: eng kech `sana`li, teng boʻlsa eng kech `yaratilgan`li.
  **Qarzning oʻzi kurs manbai emas** — unda kurs yoʻq (0044, 0045). `qoshimcha` — «≈ jami soʻmda»
  uchun qoʻlda soʻralgan kurs, avvalgidek.

Yangi domain funksiyalari (ular kerak boʻlsa toʻgʻridan-toʻgʻri ishlatiladi):
`qarzQoldiqlari(qarzlar, tolovlar)` va `qoldiqlarniQosh(...)` — `src/domain/qoldiq.ts`;
`tolovlardanKurslar(tolovlar)` — `src/domain/kurs.ts`.

**Baza:** `BAZA_VERSIYASI` 2 dan **3** ga koʻtarildi; `kontaktlar`, `qarzlar` (`kontaktId`
indeksi) va `tolovlar` (`qarzId` indeksi) omborlari qoʻshildi. Eski `yozuvlar` va
`kategoriyalar` omborlari va ulardagi maʼlumot tegilmaydi — buni `src/data/baza-v3.test.ts`
2-versiyali bazani qoʻlda yasab koʻrsatadi (`baza.test.ts` esa 1-versiyadan yoʻlni tekshiradi).

## 17. Qarz daftarida bu qatlamda YOʻQ narsalar

- «Qaytarish» tugmasi va uning **7 soniyasi** (0048) — ekranniki; doʻkon faqat oʻchirilgan
  nusxani qaytaradi.
- Summani, nettoni va yoʻnalishni koʻrsatish matni («falonchi menga qarzdor», «≈», valyuta
  belgisi, mingliklar boʻshligʻi) — ekranniki. `netto` faqat belgili son beradi.
- Toʻlovni **tahrirlash** — qarorlarda yoʻq, qurilmadi (oʻchirish + qayta kiritish bor).
- Kontaktlar boʻyicha qidiruv va filtr (0002) — yoʻq (alifbo tartibi esa doʻkonda bor).
- Qarz muddati, eslatma, kategoriya bilan bogʻlash (0016, 0017) — yoʻq.
- Zaxira faylida kontakt/qarz/toʻlov bloklari — zaxira vazifasiga qoldi.
- Toʻlov summasining koʻrsatilishi, «Qarzdan ayiriladi: …» qatorining **matni** va raqam
  formati — ekranniki; doʻkon faqat `tolovOldindanKorish` raqamini beradi.
- Qarzni boshqa kontaktga koʻchirish — **doʻkon darajasida taqiqlangan**: `qarzniTahrirla`
  formada boshqa `kontaktId` kelsa `qarz-kontakt-ozgarmas` bilan rad etadi (dizayn 5-boʻlim).
