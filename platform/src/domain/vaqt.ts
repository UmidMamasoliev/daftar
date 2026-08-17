// `yaratilgan` — yozuv daftarga qachon tushgani (0047).
//
// Bu texnik tartib maydoni: foydalanuvchiga koʻrsatilmaydi, tahrirlashda oʻzgarmaydi va
// bir xil sanadagi kurslardan qaysi biri «oxirgi kiritilgani» ekanini shu maydon aniqlaydi
// (0044, 0045). Shuning uchun ketma-ket kiritilgan ikkita yozuvning qiymati bir xil boʻlib
// qolmasligi kerak — soat bir millisekundda ikki marta chaqirilsa ham.

let oxirgi = 0

/** Hozirgi vaqt, ISO 8601 UTC. Har chaqiruvda oldingisidan katta boʻladi. */
export function hozirYaratilgan(): string {
  const hozir = Date.now()
  oxirgi = hozir > oxirgi ? hozir : oxirgi + 1
  return new Date(oxirgi).toISOString()
}
