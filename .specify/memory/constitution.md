<!--
Sync Impact Report
- Version change: (yoʻq) → 1.0.0 (birinchi qabul)
- Modified principles: — (hammasi yangi)
- Added sections: Core Principles (6 tamoyil), Texnik cheklovlar, Ish tartibi va sifat
  darvozalari, Governance
- Removed sections: —
- Follow-up TODOs: yoʻq
- Manba: AGENTS.md (qoidalar) + decisions/ 0001–0066. Constitution shu manbalarning Spec Kit
  koʻrinishi; ziddiyat chiqsa AGENTS.md va decisions/ ustun.
-->

# Daftar Constitution

## Core Principles

### I. Test avval (BAHSGA TUSHMAYDI)

Testlar koddan oldin yoziladi; testi oʻtmagan qism tayyor emas. Har specdagi «Qanday
tekshiramiz» mezonlari test boʻlib yoziladi. Test oʻtgani haqiqiy natija (buyruq chiqishi)
bilan koʻrsatiladi — aytish yetarli emas. (0022)

### II. Oflayn, serversiz, maʼlumot faqat qurilmada

Ilova — brauzerda ochiladigan, oflayn ishlaydigan PWA veb-sayt. Backend yoʻq, foydalanuvchi
hisobi yoʻq, sinxronizatsiya yoʻq. Hamma maʼlumot faqat foydalanuvchi qurilmasida (IndexedDB).
Internet oʻchirilgan holda har ekran ishlashi shart. (0003, 0004, 0008)

### III. Daftar darajasi — chegara qatʼiy

Bu daftar darajasidagi vosita, buxgalteriya dasturi EMAS. AGENTS.md dagi «nima QILINMAYDI»
roʻyxati majburiy: roʻyxatda yoʻq narsa «foydali boʻlardi» deb qoʻshilmaydi. Yangi imkoniyat
kerak boʻlsa — avval qaror (decisions/), keyin kod. (0001, 0002, 0005)

### IV. Pul butun sonda

Summalar butun sonda saqlanadi: dollar sentda, soʻm soʻmda. Kurs butun soʻmda, musbat.
Aylantirish natijasi eng yaqin butun birlikka yaxlitlanadi. `Number.MAX_SAFE_INTEGER` dan
oshgan qiymat saqlanmaydi. Nol summa saqlanmaydi, manfiy kiritilmaydi. (0008, 0023, 0033, 0042, 0049)

### V. Faqat oʻzbekcha, lotin yozuvida

Interfeys va hujjatlar faqat oʻzbekcha, lotin yozuvida. Texnik termin birinchi ishlatilganda
izohlanadi. Hujjatlar qisqa va sodda — keyingi oʻquvchi tushunadigan darajada. Oʻlchanmagan
raqam yozilmaydi. (0009)

### VI. Qarorlar majburiy va izli

decisions/ dagi qarorlar (0001–0066) majburiy va bahsga tushmaydi. Qarorlar orasida boʻshliq
chiqsa, undan xulosa chiqarilmaydi — savol odamga beriladi (discovery/ orqali). Har yangi
qaror sababi bilan yoziladi. Xatodan chiqqan saboq lessons/ ga qoida boʻlib tushadi.

## Texnik cheklovlar

- Stek: TypeScript + React + IndexedDB; build Vite (PWA `vite-plugin-pwa` bilan). (0008, 0040)
- Testlar: Vitest + fake-indexeddb (unit/integratsiya), Playwright (E2E). (0040)
- Hosting: Vercel, statik; `master` ga push avtomatik production deploy qiladi. (0025, 0046)
- Kod `platform/` ichida turadi; loyiha hujjatlari repo ildizidagi papkalarda.
- Ikkita hisob (naqd, karta) va ikkita valyuta (soʻm, dollar) — qoʻshilmaydi. (0011, 0026)

## Ish tartibi va sifat darvozalari

- Har feature spec asosida quriladi — spec yoʻq boʻlsa, avval spec. (AGENTS.md)
- Sifat darvozalari: hamma Vitest testi oʻtadi, `tsc` toza, Playwright E2E oʻtadi — shundan
  keyingina qism tayyor sanaladi. (0022)
- Ish tugaganda yozma iz qoladi: memory/ (nima oʻzgardi), decisions/ (yangi qaror boʻlsa),
  tegishli spec yangilanadi. (AGENTS.md «Ish tugaganda»)

## Governance

Constitution — AGENTS.md va decisions/ dagi qoidalarning Spec Kit koʻrinishi; ziddiyat chiqsa
AGENTS.md va decisions/ ustun, constitution ularga moslab tuzatiladi. Oʻzgartirish tartibi:
avval decisions/ da qaror (sababi bilan), keyin shu hujjatga oʻzgarish va versiya koʻtarilishi.
Versiyalash semantik: MAJOR — tamoyil olib tashlansa yoki qayta taʼriflansa; MINOR — yangi
tamoyil yoki boʻlim qoʻshilsa; PATCH — soʻz aniqlashtirilsa. Har spec, reja va vazifa shu
hujjatga muvofiqligi tekshiriladi (spec-kit `analyze` bosqichi shu yerga qaraydi).

**Version**: 1.0.0 | **Ratified**: 2026-08-19 | **Last Amended**: 2026-08-19
