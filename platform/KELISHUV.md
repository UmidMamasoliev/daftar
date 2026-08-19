# KELISHUV — maʼlumot qatlami va ekran orasidagi shartnoma

Bu fayl qisqa xarita: qaysi funksiya qanday nom bilan, nima qabul qiladi, nima qaytaradi va
xato qanday bildiriladi. **Manba — TypeScript tiplarining oʻzi** (`src/domain/turlar.ts`);
bu yerda faqat yoʻl koʻrsatiladi.

Holat (2026-08-19): **hamma qism tayyor** — kirim-chiqim va kategoriyalar (1–11-boʻlimlar),
qarz daftari (12–17), oylik hisobot (18–21), zaxira eksport/import (22–26), dashboard
(27-boʻlim; 3.10 da GitHub Spec Kit bilan qurildi — `specs/001-dashboard/`). Baza sxemasi:
**4-versiya** (`yozuvlar`, `kategoriyalar`, `kontaktlar`, `qarzlar`, `tolovlar`,
`sozlamalar`) — dashboard yangi ombor qoʻshmadi.

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

**Takroriy saqlashdan himoya forma darajasida turadi.** Doʻkon ketma-ket kelgan ikkita bir xil
chaqiruvni farqlay olmaydi — ikkalasi ham haqiqiy yozuv boʻlib tushadi (`id` va `yaratilgan` ni
doʻkon oʻzi qoʻyadi, demak nusxalar ham bir-biridan farq qiladi). Shuning uchun «bitta niyat —
bitta yozuv» qoidasini **forma** ushlaydi: saqlash ketayotganda forma ikkinchi yuborishni
oʻtkazmaydi (bayroq `useRef` da — holat yangilanishini kutib boʻlmaydi) va saqlash tugmasi
`disabled` boʻlib turadi. Bu `YozuvForma`, `QarzForma`, `TolovForma` va qarz daftaridagi
«Qoʻshish» da bir xil. **Koʻrinish oʻzgarmaydi**: yangi vizual holat qoʻshilmagan — `design/uslub.md`
dagi «kutish holati yoʻq» qoidasi kuchda, tugma faqat oʻzining «oʻchiq» koʻrinishiga oʻtadi.

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
- `qoldaKurslarManbalari(kurslar: QoldaKurslar)` → `KursManbai[]` — «≈ jami soʻmda» uchun qoʻlda
  soʻralgan kursni (0043) taqqos qatoriga oʻgiradi; kursi yoʻq boʻlsa boʻsh massiv.
- `oxirgiKurs(manbalar)` → `number | null`. Gʻolib: eng kech `sana`li; sanalar teng boʻlsa eng
  kech `yaratilgan`li (0044, 0047). `null` — birorta kurs manbai yoʻq, demak ekran kursni
  soʻrashi kerak (mezon 23g).

Qarz toʻlovlari kurslari (T4) va «≈ jami soʻmda» uchun qoʻlda soʻralgan kurs xuddi shu
`KursManbai` koʻrinishida shu roʻyxatga qoʻshiladi — alohida qoida yoʻq.

**Qoʻlda kursning sintetik `yaratilgan` qiymati faqat shu faylda yasaladi** (0066): uning
kiritilish vaqti saqlanmaydi, shuning uchun `qoldaKurslarManbalari` unga «kun boshi» qiymatini
(`'0000-01-01T00:00:00.000Z'`) qoʻyadi — qoʻlda kurs oʻz sanasidagi qiymat boʻlib qoladi, lekin
oʻsha kunda kiritilgan **har qanday** yozuv yoki toʻlov kursi undan yangi sanaladi. Qiymat
`sana + 'T00:00'` emas: `sana` mahalliy kun, `yaratilgan` UTC (0047), va Toshkentda tunda
kiritilgan yozuvning UTC vaqti mahalliy kun boshidan oldin tushardi. Doʻkon
(`src/data/yozuvlar.ts`), sozlamalar va ekran shu bitta funksiyani chaqiradi — ikkinchi qoida
yoʻq.

`src/ui/kurslar.ts` — ekranning yoʻli: shu funksiyani domendan **re-eksport** qiladi, oʻz qoidasi
yoʻq. Ilgari u yerda ikkinchi, domendagidan farqli sintetik vaqt turgan edi va bitta qiymat ikki
xil solishtirilib «oxirgi kurs» notoʻgʻri chiqardi (mezon 23d; 0066).

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

**Yopildi (H2):** `taxminiyJamiSomda` ning chegara tekshiruvisiz qolgani — endi chegara
tekshiruvli yoʻl bor: `xavfsizTaxminiyJami(jami, kurs)` (`src/domain/hisobot.ts`, 19-boʻlim).
Eski funksiya imzosi **oʻzgarmadi** (uni ishlatayotgan kod buzilmaydi), lekin yangi joylar —
hisobot ham, keyin dashboard ham — shu yangi yoʻldan yursin.

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

`kontaktSaqla`, `qarzSaqla` va `tolovSaqla` **takroriy chaqiruvni oʻzi toʻsmaydi** — ikkinchi
chaqiruv ikkinchi qator boʻlib tushadi. Bir niyatni bitta yozuvga bogʻlash forma ishi
(3-boʻlim oxiri).

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

---

# OYLIK HISOBOT (H2) — 18–21-boʻlimlar

Yuqoridagi 1–17-boʻlimlar **oʻzgarmadi** (11-boʻlimga faqat «yopildi» eslatmasi qoʻshildi).
Quyidagilar oylik hisobotning hisob-kitob qatlami uchun qoʻshildi. **Ekran hali qurilmagan** —
bu boʻlim faqat maʼlumot tomonini yozadi.

Yangi fayllar:

```
src/domain/hisobot.ts   — davr, «qaysi yozuv qaysi qatorga tushadi», hisobotni yigʻish
src/data/hisobot.ts     — hisobot doʻkoni: ekran shu fayl bilan gaplashadi
```

Qarorlar: 0013, 0017, 0018, 0019, 0021, 0023, 0026, 0035, 0038, 0042, 0043, 0044, 0045,
0047, 0064. Spec — `prds/oylik-hisobot.md`, dizayn — `design/oylik-hisobot.md`.

## 18. Davr va «qaysi yozuv qaysi qatorga tushadi» — `src/domain/hisobot.ts`

```ts
type Davr = { boshlanish: string; tugash: string }   // 'YYYY-MM-DD', ikkala chekka ichkarida
type Oy   = { yil: number; oy: number }              // oy: 1–12
```

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `joriyOyDavri(bugungiSana?)` | `string` (standart — `bugun()`) | `Davr` — ekran shu bilan ochiladi (mezon 1) |
| `oyDavri(oy)` | `Oy` | `Davr` — oyning 1-sanasidan oxirgi sanasigacha |
| `sananingOyi(sana)` | `string` | `Oy` |
| `oySur(oy, qadam)` | `Oy`, `number` | `Oy` — `‹` va `›` tugmalari uchun; yil chegarasidan oʻzi oʻtadi |
| `davrTogrimi(davr)` | `Davr` | `boolean` — boshlanish tugashdan keyin emasmi |
| `davrgaKiradimi(sana, davr)` | `string`, `Davr` | `boolean` (mezon 4, 5, 6) |

**Davr xatolari (dizayn 9-boʻlim) yangi xato kodi qoʻshmaydi:** kelajak sanasi mavjud
`sananiTekshir` bilan (`sana-kelajak`, 0034), tartib esa `davrTogrimi` bilan tekshiriladi.
Ekran ikkalasini chaqiradi va oʻz matnini qoʻyadi.

### Sanoq ochiq — manzil funksiyalari

Dizayn 6-boʻlimidagi qoidalar kod ichida **bitta joyda** turadi; hisobot aynan shularning
ustiga qurilgan, ikkinchi yashirin qoida yoʻq:

| Funksiya | Qaytaradi |
|---|---|
| `yozuvManzili(yozuv, davr)` | `{ qayerda: 'tashqarida' }` yoki `{ qayerda: 'ichkarida', bolak, valyuta, kategoriyaId, summa }` |
| `qarzManzili(qarz, davr)` | `… { qator: 'berildi' \| 'olindi', valyuta, summa }` |
| `tolovManzili(tolov, qarz \| null, davr)` | `… { qator: 'qaytdi' \| 'qaytarildi', valyuta, summa }`; qarz topilmasa `{ qayerda: 'qarzsiz' }` |

- Davrni **faqat `sana`** aniqlaydi; `yaratilgan` taʼsir qilmaydi (0047).
- Yozuv va qarz **oʻz valyutasida** qoladi — hisobotda hech qayerda aylantirilmaydi (0038).
- **Toʻlov oʻz valyutasi va kiritilgan summasi bilan** sanaladi (0064): dollar qarziga
  kelgan 625 000 soʻm hisobotning soʻm qatorida turadi, dollar qatoriga umuman tushmaydi.
- Qarzning sanasi qarz qatorini, toʻlovning sanasi toʻlov qatorini davrga bogʻlaydi.

## 19. «≈ jami soʻmda» — chegara tekshiruvli yoʻl

```ts
type TaxminiyJami =
  | { holat: 'yoq' }            // boʻlakda dollar qatori yoʻq — qator chizilmaydi
  | { holat: 'kurs-kerak' }     // daftarda birorta kurs yoʻq — ilova kursni soʻraydi (mezon 21)
  | { holat: 'hisoblanmadi' }   // natija xavfsiz butun son chegarasidan oshdi (dizayn 9-boʻlim)
  | { holat: 'bor'; somda: number; kurs: number }
```

`xavfsizTaxminiyJami(jami: ValyutaQoldigi, kurs: number | null)` — 11-boʻlimdagi texnik
qarzning yopilishi: `dollarSomgaSigadimi` dan oʻtadi va yigʻindining oʻzini ham tekshiradi.
Manfiy dollar qiymati («Farq» boʻlagi) simmetrik aylantiriladi. `holat: 'yoq'` ni **chaqiruvchi**
hal qiladi — funksiya uchta qolgan javobni beradi.

## 20. Hisobot koʻrinishi va doʻkon

```ts
type ValyutaQatori    = { valyuta: Valyuta; summa: number }
type KategoriyaQatori = { kategoriyaId: string; valyuta: Valyuta; summa: number }
type QarzQatori       = { qator: QarzQatoriTuri; valyuta: Valyuta; summa: number }
type JamiBolagi       = { qatorlar: ValyutaQatori[]; taxminiy: TaxminiyJami }

const QARZ_QATORLARI = ['berildi', 'qaytdi', 'olindi', 'qaytarildi']         // 0064
const QARZ_QATOR_ISHORASI = { berildi: -1, qaytdi: 1, olindi: 1, qaytarildi: -1 }

type Hisobot = {
  davr: Davr
  kirim: JamiBolagi; chiqim: JamiBolagi; farq: JamiBolagi
  chiqimAjratmasi: KategoriyaQatori[]
  kirimAjratmasi: KategoriyaQatori[]
  qarz: QarzQatori[]
  davrdaYozuvBormi: boolean          // dizayn 8-boʻlim boʻsh holat matnlari uchun
  davrdaQarzHarakatiBormi: boolean   // 14g-mezon
  daftardaYozuvBormi: boolean        // «Hali bitta ham yozuv yoʻq» (dizayn 8b)
  kurs: number | null                // «taxminiy · 1 $ = …» qatori uchun
}
```

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `hisobotYasa(kirish)` | `{ davr, yozuvlar, qarzlar, tolovlar, kategoriyalar, kurs }` | `Hisobot` — sof hisob |
| `hisobotniOl(davr, qoshimchaKurslar?)` | `Davr`, `KursManbai[]` | `Promise<Hisobot>` — doʻkon oʻzi oʻqiydi |
| `joriyOyHisobotiniOl(qoshimchaKurslar?)` | `KursManbai[]` | `Promise<Hisobot>` (mezon 1) |

Qoidalar bir joyda:

- **Tenglik (0038; 10, 10a-mezonlar):** har valyutada ajratma qatorlari yigʻindisi oʻsha
  valyutadagi jamiga **aynan** teng — hisobotning eng tekshiriladigan xossasi. Ajratmada kurs
  umuman ishlatilmaydi.
- **Valyuta qatori faqat oʻsha valyutada yozuv bor davrda** chiziladi (0038); «Farq» ning
  dollar qatori kirimda **yoki** chiqimda dollar boʻlsa chiziladi. Boʻlak qatorsiz qolsa
  bitta `{ valyuta: 'som', summa: 0 }` qatori bilan turadi (dizayn 8-boʻlim; mezon 17).
- **Ishora ekranniki:** `kirim` va `chiqim` summalari **musbat** keladi, `farq` esa oʻz
  ishorasi bilan. Qarz qatorlari uchun ishora `QARZ_QATOR_ISHORASI` da (0064).
- **Ajratma tartibi** (dizayn 4-boʻlim): avval soʻm guruhi, keyin dollar; guruh ichida summa
  kamayishi boʻyicha; teng boʻlsa 0028 roʻyxati tartibi, undan keyin foydalanuvchi qoʻshgani
  qoʻshilish tartibida. Shuning uchun `kategoriyalar` roʻyxati kirishga beriladi.
- **Yashirilgan kategoriya** ajratmada odatdagidek koʻrinadi va hech qanday belgi olmaydi
  (0013; mezon 12).
- **Qarz bloki** (0064): toʻrt yoʻnalish, valyuta boʻyicha alohida, nol qator chizilmaydi,
  netto yigʻilmaydi. Bu summalar jami kirim/chiqimga va kategoriya ajratmasiga **kirmaydi**
  (0017; 15, 16, 16a-mezonlar).
- **≈ qatori faqat jami blokida** (0038, istisnosiz): kategoriya va qarz qatorlarida yoʻq.
  Har boʻlak oʻz qatorlaridan hisoblanadi — «≈ kirim − ≈ chiqim» yoʻli bilan emas.
- **Kurs davrga bogʻliq emas:** oʻtgan oy hisobotida ham eng yangi maʼlum kurs ishlatiladi
  (spec 10b; 0044). Kurs saqlanmaydi — har oʻqishda hisoblanadi (0045).
- **Hisobot saqlanmaydi:** yozuv tahrirlansa yoki oʻchirilsa keyingi oʻqishda raqam oʻz-oʻzidan
  toʻgʻri chiqadi (0014; mezon 18). «Oy yopish» yoʻq.

## 21. Hisobotda bu qatlamda YOʻQ narsalar

- Ekranning oʻzi: davr tanlagich, kartochkalar, kurs soʻrash bloki va matnlar — ekranniki
  (`design/oylik-hisobot.md`). Bu qatlam faqat raqam beradi.
- Summani koʻrsatish formati: ishora, rang, mingliklar boʻshligʻi, `$` va «≈» belgisi,
  kategoriya **nomi** (uni ekran `kategoriyaniTop` bilan topadi).
- Kurs soʻrash blokining **qaysi boʻlakda** chizilishi (dizayn: birinchisida) — ekranniki;
  bu qatlam har boʻlakka `kurs-kerak` holatini beradi.
- Qoʻlda soʻralgan kursni **saqlash** (0043) — zaxira vazifasida; hozir u
  `hisobotniOl(davr, qoshimchaKurslar)` ga parametr boʻlib kiradi.
- Hisobotni PDF/CSV/rasm qilish, oʻtgan oy bilan solishtirish, grafik, filtr va kategoriya
  qatoridan yozuvlarga oʻtish (0021, 0019, 0002, 0064).

---

# ZAXIRA (Z2) — 22–26-boʻlimlar

Yuqoridagi 1–21-boʻlimlar **oʻzgarmadi**. Quyidagilar zaxira eksport/import uchun qoʻshildi.
Bu qatlam faqat **matn va obyekt** bilan ishlaydi: faylni yuklab olish, tanlash va oqimning
qadamlarini ekran boshqaradi (`design/zaxira.md`).

Yangi fayllar:

```
src/domain/zaxira.ts    — fayl formati: yasash, matn, oʻqish/tekshirish, solishtirish
src/data/zaxira.ts      — butun bazadan eksport va fayldan import (ustiga yozish)
src/data/sozlamalar.ts  — yagona qiymatlar: oxirgi eksport sanasi va qoʻlda soʻralgan kurs
```

Qarorlar: 0007, 0024, 0027, **0041** (tasdiq — faylni qaytarib tanlash), 0043 (qoʻlda
soʻralgan kurs sanasi bilan saqlanadi), 0045, 0047, 0053, 0054, 0055, 0065 (import sonlarni
qaytaradi; qayta urinishda ikkinchi avtomatik zaxira yoʻq).

## 22. Fayl formati — `src/domain/zaxira.ts`

**Fayl kalitlari ilova maydonlari bilan bir xil emas** (spec 15) — oʻgirish shu faylda,
bitta joyda:

| Faylda | Ilovada |
|---|---|
| `yozuvlar[].kategoriya` | `Yozuv.kategoriyaId` |
| `qarzlar[].kontakt`, `qarzlar[].yonalish` | `Qarz.kontaktId`, `Qarz.yonalishi` |
| `tolovlar[].qarz` | `Tolov.qarzId` |
| `izoh: ""`, `telefon: ""` (har doim bor) | maydon **umuman boʻlmaydi** (0012, 0031) |

```ts
type ZaxiraTuri = 'qolda' | 'import-oldidan'
type QoldaKurs   = { kurs: number; sana: string }
type QoldaKurslar = { dollar?: QoldaKurs }      // soʻm asos valyuta — unga kurs yozilmaydi

type ZaxiraFayli = {
  versiya: number                                // ZAXIRA_VERSIYASI = 1
  eksport: { sana: string; vaqt: string; turi: ZaxiraTuri; 'oxirgi-eksport': string }
  hisoblar: { id: Hisob; nom: string }[]         // oʻzgarmas: naqd va karta (0011)
  kategoriyalar: FaylKategoriyasi[]              // `yaratilgan` — qoʻshilganlarida (tartib)
  yozuvlar: FaylYozuvi[]                         // `kurs` faqat dollarda
  kontaktlar: FaylKontakti[]
  qarzlar: FaylQarzi[]                           // qoldiq ham, «yopiq» belgisi ham yoʻq
  tolovlar: FaylTolovi[]                         // `kurs` faqat boshqa valyutada
  kurslar: QoldaKurslar                          // faqat QOʻLDA soʻralgani (0045)
}

type ZaxiraSanoqlari = {
  kategoriyalar: number; yozuvlar: number; kontaktlar: number; qarzlar: number; tolovlar: number
}
```

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `zaxiraYasa(mazmun)` | `DaftarMazmuni` | `ZaxiraFayli` |
| `zaxiraMatni(fayl)` | `ZaxiraFayli` | `string` — **deterministik** JSON matn |
| `zaxiraniOqi(matn)` | `string` | `Natija<ZaxiraFayli>` — tekshiruv (spec 22) |
| `zaxiraBirXilmi(a, b)` | `string`, `string` | `boolean` — mazmun boʻyicha (0041) |
| `zaxiraTasdigi(tanlangan, chiqarilgan)` | `string`, `string` | `Natija<true>` — 3-qadam javobi |
| `faylNomi(turi, hozir)` | `ZaxiraTuri`, `Date` | `string` — `daftar-zaxira-2026-08-17-1435.json` |
| `daftarBoshmi(mazmun)` | roʻyxatlar | `boolean` — 0055 taʼrifi |
| `faylanYozuv/Kontakt/Qarz/Tolov/Kategoriya` | fayl qatori | ilova qiymati |

**Determinizm shart** (0041): massivlar `id` boʻyicha saralanadi, kalitlar tartibi qatʼiy,
matn oxirida bitta `\n`. Solishtirish esa **mazmun boʻyicha** — ikkala matn ham oʻqilib
qayta yoziladi, shuning uchun boʻshliqlari boshqacha yozilgan bir xil fayl ham mos keladi.
`eksport` bloki solishtiruvga **kiradi**: shu bilan «eski zaxira» va «boshqa fayl»
ajratiladi (dizayn 5-boʻlim; 17c-mezon).

## 23. Zaxira doʻkoni — `src/data/zaxira.ts` (hammasi `Promise`)

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `zaxiraniChiqar(turi, hozir?)` | `ZaxiraTuri`, `Date` | `{ nom, matn, fayl }` — **oxirgi eksport sanasini yangilaydi** (0054) |
| `zaxiraniImport(matn)` | `string` | `Natija<ZaxiraSanoqlari>` — tekshiradi va ustiga yozadi |
| `zaxiraniQoy(fayl)` | `ZaxiraFayli` | `ZaxiraSanoqlari` — tekshirilgan faylni qoʻyadi |
| `daftarBoshmi()` | — | `boolean` — 0055 istisnosi shu javobga bogʻliq |
| `zaxiraTasdigi(tanlangan, chiqarilgan)` | `string`, `string` | `Natija<true>` (domaindan qayta chiqarilgan) |
| `oxirgiEksportniOl()` | — | `string \| null` — «Oxirgi zaxira: …» qatori uchun |

**Ekran oqimi shu tartibda chaqiradi** (spec 17; dizayn 3-boʻlim):

1. `zaxiraniOqi(tiklanadiganMatn)` — xato boʻlsa oqim umuman boshlanmaydi (dizayn 5-boʻlim).
2. `daftarBoshmi()` → `true` boʻlsa **darhol** `zaxiraniImport(...)` (0055; 17e-mezon).
3. Aks holda `zaxiraniChiqar('import-oldidan')` → `{nom, matn}`; ekran faylni yuklab olishga
   beradi va **matnni oʻzida ushlab turadi**.
4. Odam faylni qaytarib tanlaydi → `zaxiraTasdigi(tanlanganMatn, ushlab turilgan matn)`.
5. `ok` boʻlsa `zaxiraniImport(tiklanadiganMatn)`.

**Qayta urinishda 3-qadam takrorlanmaydi** (0065): ekran oʻsha chiqarilgan matnni ishlatadi —
ikkinchi avtomatik zaxira chiqarilmaydi va eksport sanasi ikkinchi marta yangilanmaydi.

**Import — bitta amalda** (spec 20, 23): olti ombor ham tozalanadi va fayldagi maʼlumot
qoʻyiladi; yarim holat qolmaydi. `id` lar fayldagi holicha qoladi, shuning uchun bir xil
faylni ikki marta import qilish nusxa koʻpaytirmaydi (mezon 19).

**Sanoqlar haqiqatda qoʻyilgan qatorlardan olinadi** (0065), fayl massivining uzunligidan
emas — takroriy `id` li faylda ikki qator bitta boʻlib qoladi va sanoq shuni koʻrsatadi
(mezon 24e–24h). Ekrandagi qator toʻrt sonni koʻrsatadi (yozuv · kontakt · qarz · toʻlov);
`kategoriyalar` ham qaytadi, lekin dizayn uni koʻrsatmaydi.

Kontakt va qarzda `yaratilgan` faylda **yoʻq** (spec sxemasi) — import ularni oʻzi qoʻyadi
(fayldagi tartibda). Yozuv va toʻlovda `yaratilgan` majburiy va oʻzgarishsiz tiklanadi
(0047; mezon 6d, 6e, 6f).

## 24. Sozlamalar doʻkoni — `src/data/sozlamalar.ts`

Daftarning **yagona qiymatlari** shu yerda (yozuv emas, hisoblanadigan qiymat ham emas):

| Funksiya | Qaytaradi |
|---|---|
| `oxirgiEksportniOl()` | `string \| null` — `YYYY-MM-DD`; `null` = hech qachon eksport qilinmagan (mezon 11) |
| `oxirgiEksportniQoy(sana)` | `string` — har muvaffaqiyatli eksport chaqiradi (0054) |
| `qoldaKurslarniOl()` | `QoldaKurslar` — hech qachon soʻralmagan boʻlsa `{}` |
| `qoldaKursniQoy(kurs, sana)` | `QoldaKurslar` — «≈ jami soʻmda» uchun soʻralgan javob (0043) |
| `qoldaKurslarniQoy(kurslar)` | `QoldaKurslar` — butun blokni almashtiradi (import) |

**Valyuta parametri yoʻq**: soʻm asos valyuta va unga kurs yozilmaydi (spec 10a), demak
saqlanadigan yagona kurs — dollarniki. Ekran kursni soʻraganda `qoldaKursniQoy(12500, bugun())`
ni chaqiradi; keyin `oxirgiKursniOl()` uni **oʻzi** hisobga oladi va kurs qayta soʻralmaydi
(mezon 24a, 24b).

`oxirgiKursniOl()` endi uch manbani qamraydi: yozuv kurslari + toʻlov kurslari + qoʻlda
soʻralgan kurs (0044 qoidasi bilan solishtiriladi — eng kech sanali gʻolib). **Bir xil sanada
yozuv yoki toʻlov kursi gʻolib boʻladi**, qoʻlda soʻralgani emas: qoʻlda kursning vaqti
saqlanmaydi va u oʻz kunining boshida turadi (mezon 23d; 0044, 0066). Manba qatorini doʻkon
oʻzi yasamaydi — `qoldaKurslarManbalari` ni chaqiradi (7-boʻlim).

Shundan kelib chiqadi: `hisobotniOl(davr, qoshimchaKurslar)` (20-boʻlim) saqlangan kursni
**oʻzi** oladi — u ichida `oxirgiKursniOl` ni chaqiradi. `qoshimchaKurslar` parametri
oʻzgarmadi va hali saqlanmagan javobni sinab koʻrish uchun qolaveradi; 21-boʻlimdagi
«saqlash zaxira vazifasida» qatori shu boʻlim bilan yopildi.

## 25. Zaxira xato kodlari (maydon — `'fayl'`)

| Kod | Xabar (standart) | Qachon |
|---|---|---|
| `zaxira-oqilmadi` | `Fayl oʻqilmadi — u buzilgan yoki daftar zaxirasi emas.` | JSON emas yoki yarim yozilgan (mezon 20) |
| `zaxira-versiya` | `Fayl versiyasi notanish — bu daftar oʻqiy oladigan zaxira emas.` | `versiya ≠ 1` (mezon 21) |
| `zaxira-notolik` | `Faylda maʼlumot toʻliq emas — import qilinmadi.` | blok/maydon yetishmaydi; `yaratilgan` va `eksport.oxirgi-eksport` ham shu yerda (mezon 22, 6e) |
| `zaxira-mos-emas` | `Bu fayl hozirgina chiqarilgan zaxira emas.` | 3-qadamdagi tasdiq oʻtmadi (mezon 17c, 17d) |

Matnlar `design/zaxira.md` 5-boʻlimidagi bilan bir xil; ekran ikkinchi qatorni
(«Daftardagi maʼlumot oʻzgarmadi.») oʻzi qoʻshadi. **Xato boʻlganda hech narsa
oʻzgarmaydi** — tekshiruv ustiga yozishdan oldin bajariladi.

## 26. Zaxirada bu qatlamda YOʻQ narsalar

- Faylni yuklab olish, fayl tanlagich, «Bekor qilish» va oqimning ekrandagi holati —
  ekranniki (dizayn 3, 6-boʻlimlar).
- 30 kunlik eslatmaning oʻzi — dashboardniki (0024); bu qatlam faqat **sanani** beradi.
- Fayl nomini ekranda koʻrsatish va sanani «Bugun/Kecha» qilib yozish — ekranniki.
- Eski fayl versiyasini yangisiga oʻgirish (spec: hozir versiya bitta).
- Qisman import, birlashtirish, dublikat topish, CSV/Excel (0027, 0007).
- Import/eksport jurnali va tarixi (0014).

**Kategoriyalar urugʻlanishi haqida bir qator** (10-boʻlimga aniqlik, Z2 da tuzatildi):
`hammaKategoriyalar()` roʻyxatni **bitta amalda** oʻqiydi va yetishmayotgan **tayyor**
kategoriyalarni oʻsha amalning ichida toʻldiradi. Ilgari urugʻlanish 11 alohida amalda
ketardi va `count() > 0` shartiga tayanardi: oʻrtaga boshqa amal (masalan importning
tozalashi) tushsa doʻkon yarim urugʻlangan qolib, keyingi oʻqishlar uni tuzatmasdi. Mavjud
qator **hech qachon qayta yozilmaydi** — yashirilgan tayyor kategoriya yashirilganicha
qoladi, foydalanuvchi qoʻshganlari va ularning tartibi tegilmaydi (0013, 0028).

---

# DASHBOARD (3.10) — 27-boʻlim

Yuqoridagi 1–26-boʻlimlar **oʻzgarmadi** (7-boʻlimdagi kurs bloki endi umumiy komponentda —
pastga qarang). Dashboard GitHub Spec Kit oqimi bilan qurildi: spec, reja va vazifalar
`specs/001-dashboard/` da turadi. Qarorlar: 0006, 0020, 0023, 0024, 0036, 0042–0045,
0066, **0067** (navigatsiya va ekran tafsilotlari).

## 27. Dashboard — `src/domain/dashboard.ts`, `src/ui/Dashboard.tsx`

Yangi fayllar:

```
src/domain/dashboard.ts   — oy yigʻindilari va zaxira eslatmasi sharti (sof hisob)
src/ui/Dashboard.tsx      — bosh sahifa ekrani (sarlavha «Daftar»)
src/ui/KursSorov.tsx      — kurs soʻrash bloki: Hisobot.tsx dan ajratib olindi,
                            endi ikkala ekran shu bitta komponentni ishlatadi (0043)
```

| Funksiya | Qabul qiladi | Qaytaradi |
|---|---|---|
| `oyYigindilari(yozuvlar, davr)` | `Yozuv[]`, `Davr` | `{ kirim, chiqim }` — har biri `ValyutaQatori[]` (soʻm avval, dollar keyin; qator faqat shu valyutada yozuv bor boʻlakda; boʻsh boʻlak `{som, 0}` qatori bilan) |
| `zaxiraEslatmasiKerakmi(oxirgiEksport, bugungi)` | `string \| null`, `string` | `boolean` — `null` yoki kun farqi `>= ESLATMA_KUNLARI` (30) boʻlsa `true` (0024) |
| `ESLATMA_KUNLARI` | — | `30` |
| `OXIRGI_YOZUVLAR_SONI` (`Dashboard.tsx`) | — | `5` (0067) |

Qoidalar bir joyda:

- **Oy yigʻindilariga qarz harakati kirmaydi** (0017): oy koʻrsatkichi faqat yozuvlardan,
  hisobotdagi qoida bilan bir xil. Davrni faqat `sana` aniqlaydi (0047).
- **Qoldiq, «oxirgi kurs» va taxminiy jami bu qatlamda EMAS**: dashboard mavjud yoʻllarni
  ishlatadi — `qoldiqlarniOl()` (16-boʻlim), `oxirgiKursniOl(qoldaKurslarManbalari(...))`
  (7, 24-boʻlimlar), `xavfsizTaxminiyJami` (19-boʻlim). «Dollar qatnashadimi» ni App hal
  qiladi: naqd yoki kartada dollar nolmas boʻlsa ≈ qatori (yoki kurs soʻrovi) chiqadi.
- **Hech narsa saqlanmaydi** (0045): App `ekran === 'bosh'` boʻlganda navbat orqali qayta
  oʻqiydi; oy yigʻindilari `yozuvlar` holatidan har chizishda hisoblanadi.
- **Eslatma faqat sanani oʻqiydi** (0053, 0054; 26-boʻlim): `oxirgiEksportniOl()` —
  eslatmaning oʻzi bosilmaydi (0067).
- **Navigatsiya** (0067): `Bolim` tipida `'yozuv'` oʻrnida `'bosh'`; ilova `'bosh'` bilan
  ochiladi; YozuvForma oʻzi ochilgan ekranga qaytadi (`formaManbai`).

Ekranga tegishli boʻlib bu qatlamda YOʻQ narsalar: roʻyxat qatorining bosilmasligi, eslatma
matnining ikki varianti, «Hammasi ›» havolasi — hammasi `Dashboard.tsx` da (0067).
