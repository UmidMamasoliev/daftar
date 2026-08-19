# Data Model — Dashboard (Phase 1)

**Yangi saqlanadigan tur YOʻQ.** Baza sxemasi v4 ligicha qoladi. Dashboard faqat oʻqiydi;
yozadigan yagona joyi — kurs soʻrovi javobi, u ham mavjud `qoldaKursniQoy(kurs, sana)` orqali.

## Oʻqiladigan mavjud manbalar

| Manba | Funksiya | Dashboard nimaga ishlatadi |
|---|---|---|
| Yozuvlar + qarz daftari | `qoldiqlarniOl()` → `Qoldiqlar` | naqd/karta × soʻm/dollar qoldiqlari (FR-002..004) |
| — (sof) | `jamiQoldiq(qoldiqlar)` → `ValyutaQoldigi` | umumiy qator (FR-002) |
| — (sof) | `xavfsizTaxminiyJami(jami, kurs)` → `TaxminiyJami` | «≈ jami soʻmda» / kurs-kerak / hisoblanmadi (FR-005..007) |
| Kurs manbalari | `qoldaKurslarniOl()`, `qoldaKurslarManbalari`, `oxirgiKursniOl(manbalar)` | oxirgi kurs (FR-006; 0044, 0066) |
| Yozuvlar (App holati) | `hammaYozuvlar('yangidan')` | oxirgi 5 yozuv (FR-009), oy yigʻindilari kirishi |
| Sozlamalar | `oxirgiEksportniOl()` → `string \| null` | zaxira eslatmasi sharti (FR-012) |

## Yangi sof funksiyalar — `src/domain/dashboard.ts`

```ts
/** Joriy oy kirim/chiqim yigʻindilari — valyuta boʻyicha, qarz harakatisiz (FR-008; 0017). */
oyYigindilari(yozuvlar: readonly Yozuv[], davr: Davr): {
  kirim: ValyutaQatori[]     // tartib: som, dollar; qator faqat shu valyutada yozuv boʻlsa
  chiqim: ValyutaQatori[]    // boʻlak boʻsh qolsa bitta { valyuta: 'som', summa: 0 } qatori
}

/** Zaxira eslatmasi sharti (FR-012; 0024): null → true; kun farqi >= 30 → true. */
zaxiraEslatmasiKerakmi(oxirgiEksport: string | null, bugungi: string): boolean
```

Qoidalar:
- `davrgaKiradimi(sana, davr)` bilan tekshiriladi — davrni faqat `sana` aniqlaydi (0047).
- Summalar musbat yigʻiladi; ishora ekranniki (hisobot naqshi, KELISHUV 20).
- Kun farqi mahalliy kalendar kunlarda (`YYYY-MM-DD` qiymatlar orasida).

## Ekran modeli (App → Dashboard props)

```ts
type DashboardProps = {
  qoldiqlar: Qoldiqlar | null          // null — birinchi oʻqish tugamagan
  taxminiy: TaxminiyJami                // 'yoq' holatini App hal qiladi (dollar yoʻq boʻlsa)
  oy: { kirim: ValyutaQatori[]; chiqim: ValyutaQatori[] }
  yozuvlar: readonly Yozuv[]            // App kesmaydi — 5 tani ekran oʻzi oladi (testda qatʼiy)
  kategoriyalar: readonly KategoriyaNomi[]
  eslatmaKerak: boolean
  oxirgiEksport: string | null          // eslatma matnining ikki varianti uchun
  yangiYozuv: () => void                // «＋ Yozuv» (FR-010)
  hammasi: () => void                   // «Hammasi ›» → Yozuvlar ekrani (FR-009)
  kursniSaqla: (kurs: number) => Promise<void> | void   // KursSorov (FR-007)
}
```

## Holat oʻtishlari

Yoʻq — dashboard hech narsa saqlamaydi, har koʻrsatilishda joriy maʼlumotdan chiqadi
(0045 naqshi). Kurs saqlangach App qayta oʻqiydi va `taxminiy` `'kurs-kerak'` dan `'bor'` ga
oʻtadi; qayta ochilishda soʻrov takrorlanmaydi (0043 — mezon 14a).
