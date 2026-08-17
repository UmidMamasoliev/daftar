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
