// Faylni qurilmaga yuklab olish — brauzer usuli.
//
// Maʼlumot hech qayerga yuborilmaydi (0004): matn xotirada `Blob` boʻlib yasaladi va
// brauzerning oʻz yuklab olish yoʻli bilan beriladi. Server yoʻq (0003), shuning uchun
// oflayn ham ishlaydi (mezon 25).
//
// Alohida modulda turishining sababi: ekran uni chaqiruv boʻlib oladi, demak testda
// haqiqiy yuklab olishni ishga tushirmasdan tekshirsa boʻladi.

/** Zaxira fayli shu tur bilan beriladi. */
const TURI = 'application/json'

/** Matnni berilgan nom bilan yuklab olishga beradi. */
export function faylniYuklabOl(nom: string, matn: string): void {
  const blob = new Blob([matn], { type: TURI })
  const manzil = URL.createObjectURL(blob)
  const havola = document.createElement('a')
  havola.href = manzil
  havola.download = nom
  document.body.appendChild(havola)
  havola.click()
  havola.remove()
  // Manzil darhol boʻshatilmaydi: baʼzi brauzerlar yuklashni keyingi tikda boshlaydi.
  setTimeout(() => {
    URL.revokeObjectURL(manzil)
  }, 0)
}
