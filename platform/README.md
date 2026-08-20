# platform/ — Daftar ilovasining kodi

Daftar — brauzerda ochiladigan, oflayn ishlaydigan, serversiz veb-ilova (0003, 0004).
Bu papkada uning kodi yashaydi.

**Hozirgi holat: besh qism ishlaydi** — kirim-chiqim, qarz daftari, oylik hisobot, zaxira
(eksport/import) va dashboard; jami 1066 Vitest va 12 Playwright testi oʻtadi. Dashboard —
**bosh sahifa**: ilova oʻshandan ochiladi (0020, 0067). Koʻrinish HEAD_WEB dizayn tizimiga
oʻtkazilmoqda (0068) — xulq, matn va testlar oʻzgarmaydi.

Kod TDD bilan yoziladi: test avval, keyin kod; testi oʻtmagan qism tayyor emas (0022).

---

## Nima kerak

- **Node.js 24 yoki undan yangi** (LTS tavsiya qilinadi). `node -v` bilan tekshiring.
  Node 22.22+ ham ishlaydi.
- **npm** — Node bilan birga keladi.
- Internet — faqat birinchi `npm install` uchun. Undan keyin ilovaning oʻzi internetsiz ishlaydi.

> Node 23 da `npm install` paytida `EBADENGINE` ogohlantirishlari chiqadi (`jsdom` 24 ni
> soʻraydi). Hozircha hammasi ishlayapti, lekin bu qoʻllab-quvvatlanmaydigan holat —
> yangilanish imkoni boʻlsa, Node 24 ga oʻting.

---

## Birinchi marta ishga tushirish

Uchta buyruq, shu tartibda. Hammasi shu papka (`platform/`) ichida bajariladi.

```bash
cd platform
npm install                      # 1. bogʻliqliklarni yuklaydi (~400 paket, bir marta)
npx playwright install chromium  # 2. E2E testlar uchun brauzer (bir marta)
npm run dev                      # 3. ilovani ochadi → http://localhost:5173
```

Brauzerda `http://localhost:5173` ochilib «Daftar» sarlavhasi koʻrinsa — hammasi joyida.
Toʻxtatish: terminalda `Ctrl+C`.

---

## Buyruqlar — qaysi biri nima qiladi

| Buyruq | Nima qiladi |
|---|---|
| `npm install` | Bogʻliqliklarni yuklaydi. Loyihani birinchi ochganda va `package.json` oʻzgarganda. |
| `npm run dev` | Dev-serverni koʻtaradi: `http://localhost:5173`. Faylni saqlasangiz brauzer oʻzi yangilanadi. |
| `npm test` | **Vitest** — unit va integratsiya testlari. Bir marta ishlaydi va natija chiqaradi. |
| `npm run test:watch` | Xuddi shu testlar, lekin fon rejimida: fayl oʻzgarganda oʻzi qayta ishlaydi. Kod yozayotganda shu ishlatiladi. |
| `npx playwright test` | **Playwright** — E2E testlar haqiqiy brauzerda. Dev-serverni oʻzi koʻtaradi, kerakmas boʻlgach oʻzi oʻchiradi. |
| `npm run build` | Ilovani yigʻadi → `dist/`. Avval `tsc -b` bilan TypeScript tekshiriladi: tip xatosi boʻlsa yigʻilmaydi. |
| `npm run preview` | `npm run build` chiqargan `dist/` ni koʻrsatadi. PWA ni shu yerda tekshiriladi (pastga qarang). |

`npm run test:e2e` — `npx playwright test` ning qisqasi, ikkalasi bir xil.

---

## Fayllar qayerda

```
platform/
├── index.html              # sahifaning kirish nuqtasi (sarlavha, til: uz-Latn)
├── package.json            # bogʻliqliklar va buyruqlar
├── vite.config.ts          # yigʻish + dev-server + PWA sozlamasi
├── vitest.config.ts        # unit/integratsiya test sozlamasi
├── playwright.config.ts    # E2E test sozlamasi (dev-serverni oʻzi koʻtaradi)
├── tsconfig.json           # → tsconfig.app.json (src/) va tsconfig.node.json (sozlamalar, e2e/)
├── public/                 # oʻzgarishsiz koʻchiriladigan fayllar
│   ├── favicon.svg
│   ├── icon-192.png, icon-512.png   # PWA belgilari — vaqtinchalik, dizayner almashtiradi
│   └── fonts/              # oʻzimizda joylashtirilgan shriftlar, woff2 (0068)
├── src/
│   ├── main.tsx            # React ni #root ga ulaydi
│   ├── App.tsx             # ekranlarni almashtiradi (navigatsiya holati shu yerda)
│   ├── index.css           # uslub tokenlari va komponent uslublari (`design/uslub.md`)
│   ├── vite-env.d.ts       # Vite va PWA tiplari
│   ├── domain/             # sof hisob: pul, kurs, qoldiq, qarz, hisobot, dashboard
│   ├── data/               # IndexedDB qatlami: baza, yozuvlar, qarzlar, kategoriyalar, zaxira
│   ├── ui/                 # ekranlar va komponentlar (`Dashboard.tsx`, `Yozuvlar.tsx` va h.k.)
│   └── test/
│       ├── setup.ts        # har testdan oldin: fake-indexeddb ni ulaydi
│       └── indexeddb.test.ts   # baza ishlayaptimi
└── e2e/
    └── *.spec.ts           # daftar, qarz, hisobot, zaxira, dashboard, oflayn oqimlari
```

Test fayllari kod yonida turadi (`src/domain/pul.test.ts` kabi); ekran testlari
`src/App.*.test.tsx` va `src/ui/*.test.tsx` da.

---

## Testlar — ikki qatlam

Qaror 0040 boʻyicha testlar ikki joyda turadi va aralashmaydi:

**1. Vitest — `src/**/*.test.ts`** (`npm test`)
Hisob-kitob va maʼlumot saqlash: qoldiq, kurs bilan aylantirish, qarz qoldigʻi, davr chegarasi.
Brauzer ochilmaydi. IndexedDB oʻrniga **fake-indexeddb** ishlaydi — baza xotirada yaratiladi,
`src/test/setup.ts` uni har testdan oldin ulab qoʻyadi. Yaʼni IndexedDB bilan ishlaydigan kodni
hech narsa moslashtirmasdan test qilsa boʻladi. Muhit — `jsdom`, demak DOM ham mavjud.

**2. Playwright — `e2e/*.spec.ts`** (`npx playwright test`)
Odam koʻradigan oqim: ekran, tugma, oflayn holat, eksport/import faylining brauzerdagi yoʻli.
Haqiqiy Chromium, haqiqiy IndexedDB.

Yangi test yozganda joyni shu boʻlinish belgilaydi: **raqam — Vitest, ekran — Playwright.**
Test koddan oldin yoziladi; testi oʻtmagan qism tayyor emas (0022).

---

## PWA ni qanday tekshirish

Service worker **dev rejimida ataylab oʻchirilgan** (`vite.config.ts` → `devOptions.enabled: false`):
aks holda u eski nusxani keshlab, kod yozayotganda chalgʻitadi. Shuning uchun oflayn ishlashni
dev-serverda emas, yigʻilgan versiyada tekshiriladi:

```bash
npm run build
npm run preview
```

Keyin brauzerda: DevTools → **Application** → **Service Workers** (roʻyxatdan oʻtganmi) va
**Manifest** (nomi «Daftar», tili `uz-Latn`, belgilari joyidami). Oflayn sinash uchun DevTools →
Network → **Offline** ni yoqing va sahifani yangilang.

---

## Xato chiqsa qayerdan qaraladi

| Belgi | Qayerdan qarash |
|---|---|
| `npm install` xato beradi | Node versiyasi: `node -v`. 22.22 dan past boʻlsa yangilang. Keyin `rm -rf node_modules package-lock.json && npm install`. |
| `npm run dev` ochilmaydi, «port band» deydi | 5173-portni boshqa dastur egallagan: `lsof -i :5173`, keyin oʻsha jarayonni toʻxtating. Port raqami `playwright.config.ts` da ham yozilgan — oʻzgartirsangiz ikkalasini birga oʻzgartiring. |
| Sahifa oq, hech narsa yoʻq | Brauzerda DevTools → **Console**. Odatda import yoʻli notoʻgʻri yoki `#root` topilmagan. |
| `npm test` yiqiladi | Terminaldagi chiqish toʻliq oʻqiladi: Vitest xato boʻlgan qatorni koʻrsatadi. `indexedDB is not defined` chiqsa — `src/test/setup.ts` uzilgan yoki `vitest.config.ts` dagi `setupFiles` oʻzgartirilgan. |
| Playwright «browser not found» deydi | `npx playwright install chromium`. Bu Playwright yangilanganda ham kerak boʻladi — har versiya oʻz brauzer nusxasini soʻraydi. |
| Playwright testi yiqiladi | `npx playwright show-report` — nima boʻlganini qadamma-qadam koʻrsatadi. Skrinshot va iz `test-results/` da. `npx playwright test --headed` bilan brauzerni koʻz oldida ochib koʻrish mumkin. |
| `npm run build` yiqiladi, lekin `npm run dev` ishlaydi | Bu tip xatosi: `build` ichida `tsc -b` bor, `dev` da yoʻq. `npx tsc -b` ni alohida ishlatib xatoni koʻring. |
| Yigʻilgan versiyada eski kod koʻrinadi | Service worker keshi. DevTools → Application → Service Workers → **Unregister**, keyin sahifani qattiq yangilang. |

Testlar yigʻib qoʻyadigan fayllar (`test-results/`, `playwright-report/`, `dist/`, `node_modules/`)
git ga tushmaydi — `.gitignore` da yozilgan.

---

## Deploy — sayt qayerda va qanday chiqadi

Hosting — **Vercel** (0046). Sayt statik: Vercel faqat `dist/` dagi fayllarni tarqatadi, hech
narsa hisoblamaydi va saqlamaydi (0003, 0004). Bepul tarif; pullik hech narsa yoqilmagan.

**Vercel loyihasi:** `daftar` (jamoa `HEAD` / `head9`). Sozlamalari:

| Sozlama | Qiymat | Qayerdan keladi |
|---|---|---|
| Root Directory | `platform` | loyiha sozlamasi (dashboard yoki `vercel project update`) |
| Framework | Vite | `platform/vercel.json` |
| Build Command | `npm run build` | `platform/vercel.json` |
| Output Directory | `dist` | `platform/vercel.json` |
| Install Command | avtomatik (`npm install`) | Vercel oʻzi aniqlaydi |

`vercel.json` **Root Directory ichida** turadi — shuning uchun u `platform/vercel.json`,
repo ildizida emas. Rewrite (yoʻnaltirish) qoidasi **ataylab yozilmagan**: ilova bitta
sahifadan iborat, ekranlar orasida oʻtish URL bilan emas, ilova ichidagi holat bilan boʻladi
(0067). Yaʼni chuqur havola yoʻq, demak «hamma yoʻlni `index.html` ga» qoidasi kerak emas —
u faqat haqiqiy 404 ni yashirib qoʻyardi. Hozir mavjud boʻlmagan yoʻl 404 qaytaradi, `dist/`
dagi hamma fayl esa oʻz yoʻlidan xizmat qiladi (`/manifest.webmanifest`, `/sw.js`, belgilar).

### Buyruqlar

Hammasi **repo ildizidan** (`platform/` dan emas) bajariladi — bogʻlanish `.vercel/` shu yerda:

```bash
vercel deploy --yes            # PREVIEW deploy (sinov havolasi)
vercel list daftar             # deploylar roʻyxati: qaysi biri Preview, qaysi biri Production
vercel inspect <url> --logs    # build loglari — yigʻilish nega yiqilganini shu yerdan qidiring
vercel logs <url>              # soʻrov loglari (statik sayt uchun kam maʼlumot beradi)
vercel deploy --prod           # PRODUCTION — faqat ataylab, ongli ravishda
```

Bogʻlanish yoʻqolsa (`.vercel/` oʻchib ketsa) qayta ulash:

```bash
vercel link --yes --project daftar
```

> **Ehtiyot boʻling:** loyihaning **birinchi** deployi `--prod` siz ham avtomatik
> **production** ga oʻtadi (Vercel CLI shunday qilingan: production boʻlmasa, birinchi deploy
> oʻsha boʻladi). Production hali boʻlmaganda «shunchaki sinab koʻraman» degan deploy saytni
> chiqarib yuborishi mumkin.

### Preview havolasi login soʻraydi

Loyihada **Deployment Protection (Vercel Authentication)** yoqilgan:
`ssoProtection: all_except_custom_domains`. Yaʼni `daftar-xxxx-head9.vercel.app` koʻrinishidagi
deploy havolalari Vercel hisobiga kirishni talab qiladi — oddiy `curl` 302 bilan SSO ga
yoʻnaltiradi. Brauzerda Vercel ga kirgan holda havola normal ochiladi.

Terminaldan tekshirish uchun himoyani aylanib oʻtadigan buyruq bor:

```bash
vercel curl https://<deploy-url>/ -- -sS -D - -o /dev/null   # status va sarlavhalar
vercel curl https://<deploy-url>/ | grep '<title>'           # sahifa mazmuni
```

Havola hech kimdan login soʻramasin desangiz: dashboard → Project `daftar` → Settings →
Deployment Protection → Vercel Authentication → **Disabled**, yoki
`vercel project protection disable --sso daftar`. Bu xavfsizlik sozlamasi — odam oʻzi hal qiladi.

### GitHub push bilan avtomatik deploy — ULANGAN (2026-08-19)

0046 «GitHub ga push qilinganda avtomatik deploy» deydi va zanjir jonli tasdiqlangan:
`UmidMamasoliev/daftar` reposi Vercel loyihasiga ulangan (Vercel GitHub App, «Only select
repositories» — faqat `daftar`). Yaʼni **`master` ga har push = production deploy**
(https://daftarim.vercel.app), boshqa branch yoki pull request → preview deploy.

Bogʻlanish uzilib qolsa: dashboard → Project `daftar` → Settings → **Git**, yoki terminaldan
`vercel git connect https://github.com/UmidMamasoliev/daftar.git` (GitHub App oʻrnatilmagan
boʻlsa CLI ishlamaydi — oʻrnatish faqat brauzer oqimi orqali).

### Xato chiqsa qayerdan qaraladi

| Belgi | Qayerdan qarash |
|---|---|
| Deploy «Error» bilan tugadi | `vercel inspect <url> --logs` — build logi toʻliq chiqadi (`npm install`, `tsc -b`, `vite build`). Xato odatda tip xatosi: `npm run build` ni mahalliy ishlatib takrorlang. |
| Sahifa 404 | Root Directory yoki Output Directory adashgan: `vercel project inspect daftar` bilan tekshiring (`platform` va `dist` boʻlishi kerak). |
| Havola login soʻraydi | Yuqoridagi «Preview havolasi login soʻraydi» boʻlimi — bu xato emas, sozlama. |
| Production havola 404 | Production deploy hali yoʻq (yoki oʻchirilgan). `vercel list daftar` bilan koʻring. |
| Eski kod koʻrinadi | Service worker keshi — DevTools → Application → Service Workers → Unregister. Deploy oʻzi toʻgʻrimi: `vercel list daftar` dagi vaqtga qarang. |

`.vercel/` (loyiha bogʻlanishi) va `.env*` **git ga tushmaydi** — ildizdagi `.gitignore` da
yozilgan. `vercel link` baʼzan `.env.local` yaratadi va unga qisqa muddatli token yozadi;
ilovada muhit oʻzgaruvchisi ishlatilmaydi, shuning uchun bu fayl kerak emas — oʻchirib
yuborilsa boʻladi.

---

## Nima yoqilmagan

- **Pullik hech narsa yoqilmagan.** Vercel bepul tarifda; Web Analytics, Speed Insights va
  boshqa qoʻshimchalar oʻchiq.
- **Maxfiy maʼlumot yoʻq.** Loyihada parol, kalit, token yoʻq va boʻlmasligi ham kerak:
  ilovaning serveri yoʻq, hamma maʼlumot foydalanuvchi qurilmasida qoladi (0004). Vercel da
  hech qanday muhit oʻzgaruvchisi (environment variable) sozlanmagan.
- **Linter sozlanmagan.** Tip tekshiruvi `tsc -b` orqali ishlaydi (strict rejim yoqilgan).
Komponent testi kutubxonasi esa **qoʻshilgan**: `@testing-library/react` + `user-event`
(ekran testlari `src/**/*.test.tsx` da).
