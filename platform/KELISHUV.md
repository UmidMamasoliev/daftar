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
