# platform/ — Daftar ilovasining kodi

Daftar — brauzerda ochiladigan, oflayn ishlaydigan, serversiz veb-ilova (0003, 0004).
Bu papkada uning kodi yashaydi.

**Hozirgi holat: boʻsh skelet.** Ilova ishga tushadi va «Daftar» sarlavhali boʻsh sahifani
koʻrsatadi. Mahsulot ekranlari — kirim-chiqim, qarz daftari, oylik hisobot, dashboard —
hali yozilmagan; ular `prds/` dagi speclar asosida keyingi agentlar tomonidan qoʻshiladi.

Skeletning vazifasi bitta: **poydevor ishlashi tekshirilgan boʻlsin** — yigʻiladi, ishga
tushadi, ikkala qatlamdagi testi oʻtadi. Shundan keyin kod yozish TDD bilan boshlanadi (0022).

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
│   └── icon-192.png, icon-512.png   # PWA belgilari — vaqtinchalik, dizayner almashtiradi
├── src/
│   ├── main.tsx            # React ni #root ga ulaydi
│   ├── App.tsx             # hozircha faqat «Daftar» sarlavhasi
│   ├── index.css
│   ├── vite-env.d.ts       # Vite va PWA tiplari
│   └── test/
│       ├── setup.ts        # har testdan oldin: fake-indexeddb ni ulaydi
│       └── indexeddb.test.ts   # skelet testi: baza ishlayaptimi
└── e2e/
    └── daftar.spec.ts      # skelet E2E testi: sahifa ochiladimi
```

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

## Nima yoqilmagan

- **Deploy yoʻq.** Hosting — Vercel (0046) — keyingi bosqichda sozlanadi. Hozircha hech qanday
  pullik xizmat yoqilmagan.
- **Maxfiy maʼlumot yoʻq.** Loyihada parol, kalit, token yoʻq va boʻlmasligi ham kerak:
  ilovaning serveri yoʻq, hamma maʼlumot foydalanuvchi qurilmasida qoladi (0004).
- **Linter sozlanmagan.** Tip tekshiruvi `tsc -b` orqali ishlaydi (strict rejim yoqilgan).
- **Komponent testi kutubxonasi qoʻshilmagan.** React komponentlarini test qilish kerak boʻlganda
  uni frontend agenti oʻz ehtiyojiga qarab qoʻshadi.
