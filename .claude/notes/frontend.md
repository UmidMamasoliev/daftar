# Frontend agenti — eslatmalar (Daftar)

## Redesign tuzatish raundi: shrift, boʻsh holat, hairline (2026-08-20)

**Belgilar subseti (`space-grotesk-belgilar.woff2`) — deskriptor oila bilan aynan mos.**
`font-weight: 100 900` yozilgan belgilar-face Chromium'da HECH QACHON yuklanmaydi, agar
oilaning asosiy face'lari tor deskriptorli boʻlsa. Endi: Space Mono — IKKITA face (`400`
va `700`, asosiy fayllari statik), Space Grotesk — `300 700`, Hanken — `100 900`
(u boshidan ishlagan, chunki asosiy face'lari ham `100 900`). Fayl bitta, oʻzgaruvchan
(wght 300–700) — soʻralgan ogʻirlik oʻzi chiqadi.
Oʻlchash usuli (`document.fonts.check` yetarli emas): matn tugunidagi bitta belgini
`Range` ga oʻrab, `getBoundingClientRect().width / fontSize` = em. Kutilgan qiymatlar
fayldan: `ʻ` 0.251em (400) / 0.294em (700), `≈` 0.620em. `letter-spacing` Range eniga
kiradi — `.qoldiq-som` da (−0.03em) hisobga ol.

**`.bosh-holat` kartochka ichida.** Standart `padding-bottom: 20vh` ekran boʻsh holati
uchun; kartochka ichida (bosh sahifadagi «Oxirgi yozuvlar») ~160 px ortiqcha joy berardi.
`.kartochka .bosh-holat { padding: 24px 0 }` — `.ekran > .bosh-holat` istisnosi faqat
toʻgʻridan-toʻgʻri bolaga tegadi, kartochkani qamramaydi. Kontakt/QarzDaftari boʻsh
holatlari `.kartochka` ichida EMAS (`.kontakt-tanasi`, `.qarz-tanasi`) — ular oʻzgarmaydi.

**Hairline «≈ jami» qatoridan oldin.** Chiziq roʻyxatning oʻz tagida, **uchala** holatda
ham: `.dashboard-tanasi .ajratma:has(+ .taxminiy-jami | + .taxminiy-xato | + .kurs-sorov)`
— uchchalasi «≈» qatorining oʻrnida turadi (dashboard.md 8-boʻlim), demak ajratgich ham
oʻsha joyda qoladi. Nega roʻyxatga: KursSorov blokining tint foni bor — chiziqni blokning
`border-top` i qilsak, u panel chekkasiga yopishib «panel chegarasi» boʻlib koʻrinadi.
`:has(+ …)` jonli tasdiqlangan (12 px / 1px / 12 px, har uchala holatda).

**Matn ichidagi summani `<span>` ga oʻrash RTL testini buzadi.** `getByText('… 8,00 $')`
faqat **toʻgʻridan-toʻgʻri** matn tugunlarini qoʻshadi (`getNodeText` — element bolalar
tashlab ketiladi), demak `<p>Qarzdan ayiriladi: <span>8,00 $</span></p>` topilmaydi.
Shuning uchun TolovForma yordam qatorining summasi mono qilinmadi (testni oʻzgartirmasdan
imkoni yoʻq).

## Redesign 2-bosqichi: CSS gotcha'lari (2026-08-20, 0068)

**`:has()` ichida `:has()` boʻlmaydi.** `.ekran:has(> .panel-tepa:not(:has(button)))` — xato
selektor, brauzer **jim** tashlab yuboradi (konsolda xato yoʻq, oddiygina ishlamaydi).
Toʻgʻrisi — inkorni tashqariga chiqarish: `.ekran:not(:has(> .panel-tepa > button))`.
`:not(:has(…))` ruxsat etilgan. Bu bilan «sahifa sarlavhasi» (panelda tugma yoʻq) va
«ichkari sarlavha» (panelda `×` yoki «‹ Orqaga» bor) yangi sinf nomisiz ajratilgan.

**Ekran ichidagi tanani gridga oʻgirganda `align-content: start` yoz.** `.hisobot-tanasi`,
`.zaxira-tanasi`, `.dashboard-tanasi` da `flex: 1` bor: ular `.ekran` (flex, `100dvh`)
ning qolgan balandligini egallaydi. Grid ning `align-content` standarti `stretch` —
avtomatik qatorlar shu balandlikka choʻzilib, kartochkalar orasida 60–80 px sunʼiy
boʻshliq paydo boʻldi. `align-items: start` buni tuzatmaydi (u qator **ichidagi**
element uchun).

**`display: block` `.matn-havola` ning `inline-flex` ini yeydi.** `.tolov-havola`
(«＋ Toʻlov») shu sababli ikki qatorga boʻlinib ketdi (SVG ustida, matn ostida). Ikonka
qoʻshilgan har havolada `inline-flex` saqlanishi kerak.

**Oxirgi bolalarni `:nth-last-child()` bilan joylashtir.** Hisobotda kartochkalar oldida
shartli «yoʻl» qatori turadi, shuning uchun `:nth-child()` sirpanadi; oxiridan sanaganda
(`:last-child` = qarz, `:nth-last-child(2)` = kirim, `:nth-last-child(3)` = chiqim)
joylashuv har holatda toʻgʻri qoladi.

## Saqlash tugmalarida in-flight himoya (2026-08-18)

QA jonli sweepda topilgan xato: «Saqlash»/«Qoʻshish» tez ikki marta bosilsa bitta niyat ikki
marta saqlanardi. Doʻkon qatlami buni toʻsa olmaydi — har toʻlov/yozuv alohida qonuniy.

**Naqsh (toʻrt joyda bir xil):** `ref` bayroq + `disabled`.

```
const [saqlanmoqda, setSaqlanmoqda] = useState(false)   // faqat tugmaning `disabled` i uchun
const saqlashKetdi = useRef(false)                       // haqiqiy toʻsiq — shu lahzada ishlaydi

async function yubor(...) {
  if (saqlashKetdi.current) return          // tekshiruvdan OLDIN
  ...tekshiruv (xato boʻlsa bayroqqa tegilmaydi — tugma tirik qoladi)...
  saqlashKetdi.current = true; setSaqlanmoqda(true)
  try { natija = await saqla(...) } finally { saqlashKetdi.current = false; setSaqlanmoqda(false) }
}
```

Nega ikkalasi: `useState` bir bosish ichida yangilanmaydi, shuning uchun toʻsiq `ref` da;
`disabled` esa ikkinchi bosishni brauzergacha yetkazmaydi. `finally` shart — saqlash rad
etilsa tugma yana bosiladigan boʻlib qolishi kerak.

**Vizual:** `.asosiy-tugma` oʻz `background`/`color`/`cursor` ini beradi, shuning uchun
`:disabled` uchun CSS qoʻshilmadi — koʻrinish oʻzgarmaydi. `design/uslub.md` da «Kutish
holati yoʻq» deyilgan; agar kelajakda «Oʻchiq» koʻrinishi kerak boʻlsa — bu dizayn qarori.

**Test naqshi:** ikki `fireEvent.click` ketma-ket (orasida `await` yoʻq), keyin
`await act(async () => {})` bilan tugatib, `expect(saqla).toHaveBeenCalledTimes(1)`.
`await odam.click()` ishlatilsa poyga yopilib qoladi va test bekorga oʻtadi.

## Umumiy

- Toʻrt forma bir naqshda yuradi: `YozuvForma`, `QarzForma`, `TolovForma` (`yubor`) va
  `QarzDaftari` (`qoshishniBosdi`). Bittasini oʻzgartirsang qolgan uchtasini ham koʻr.
- `QarzForma`/`TolovForma`/`QarzDaftari` da saqlash `Natija` qaytaradi (xato — qiymat,
  otilish emas); `YozuvForma` da esa `Promise<void>`.
- `npm test` (Vitest) + `npx playwright test` + `npx tsc -b` — uchalasi ham tez ishlaydi,
  tugatishdan oldin uchalasini ham yugurtir.
