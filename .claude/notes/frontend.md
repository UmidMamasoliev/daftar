# Frontend agenti — eslatmalar (Daftar)

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
