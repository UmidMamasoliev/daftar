# Daftar — boshlangʻich loyiha (kurs bilan birga yuradi)

Bu papka — kursdagi «Daftar» loyihasining boshlangʻich holati. Uni nusxalab oling va kurs
davomida biz bilan birga toʻldirib boring. Hamma narsa oddiy markdown — qaysi AI vositasini
ishlatsangiz ham, qoidalar bir xil.

Agar siz AI boʻlsangiz va buni birinchi marta oʻqiyotgan boʻlsangiz: avval **AGENTS.md** ni
oʻqing — qoidalar oʻsha yerda. Bu README — xarita.

## Papkalar

| Papka | Nima saqlaydi | Qachon yoziladi |
|---|---|---|
| `discovery/` | Ochiq savollar — hali hal boʻlmagan narsalar | Oʻylash paytida. Savol hal boʻlgach — oʻchiriladi |
| `decisions/` | Qabul qilingan qarorlar, sababi bilan | Discovery-savol yechilganda. Abadiy saqlanadi |
| `prds/` | Nima qurilishining texnik tavsifi (spec) | Feature qurishdan oldin |
| `platform/` | Kod | Qurish paytida |
| `memory/` | Har ish-sessiyadan qisqa eslatma: nima oʻzgardi, qayerda toʻxtadik | Sessiya yakunida |
| `lessons/` | Xatolardan chiqarilgan qoidalar | Har tuzatishdan keyin |

## Aylanma (loop)

```
oʻylash  ──► discovery/<savol>.md
qaror    ──► discovery-fayl oʻchadi + decisions/NNNN-<nom>.md
spec     ──► prds/<feature>.md
qurish   ──► platform/ + testlar
yakun    ──► memory/<sana>.md
```

**Nega bu muhim:** kontekst oynasi tozalanganda keyingi sessiya `discovery/` va `memory/` ni
oʻqiydi — va hech narsani qayta tushuntirmasdan davom etadi. Hamma narsani **keyingi agent
uchun** yozing: qisqa, sodda, topiladigan.
