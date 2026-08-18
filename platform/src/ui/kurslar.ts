// Qoʻlda soʻralgan kursni «oxirgi kurs» taqqosiga qoʻshish (0043, 0044, 0045).
//
// Qoidaning oʻzi bu yerda EMAS: u `domain/kurs.ts` da — «oxirgi kurs» oʻsha yerda
// yashaydi. Bu fayl faqat ekranga qulay nom beradi, chunki ilgari bu yerda ikkinchi,
// domendagidan farqli sintetik vaqt qoidasi turgan edi va bitta qiymat ikki xil
// solishtirilib, «oxirgi kurs» notoʻgʻri chiqardi (mezon 23d).

export { qoldaKurslarManbalari } from '../domain/kurs.ts'
export type { QoldaKurslar } from '../domain/zaxira.ts'
