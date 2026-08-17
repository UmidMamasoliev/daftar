// Test yordamchisi: doʻkonga boshlangan ish tugashini kutish.
//
// Ekran yopilgandan (`cleanup()`) keyin ham App ning doʻkonga bergan oʻqish/yozuvlari
// navbatda turadi — ular darhol tugamaydi. Baza **oʻsha ish uchayotganda** tozalansa,
// tozalash yarim bajarilgan amalning oʻrtasiga tushadi va keyingi testga buzilgan
// holat qoldiradi. Shuning uchun har `afterEach` da avval navbat boʻshatiladi.
//
// Nega shu kerak boʻldi: kategoriyalar urugʻlanishi 11 ta alohida amal bilan bajariladi
// va bir marta yarim qolsa oʻzini tuzatmaydi — bu maʼlumot qatlamining nozik joyi
// (`src/data/kategoriyalar.ts`). Test tomondan uni qoʻzgʻatmaslik shu yerda.

import { act } from '@testing-library/react'

/** Navbatdagi promise va nol-muddatli taymerlar boʻshashini kutadi. */
export async function navbatBoshasin(qadamlar = 5): Promise<void> {
  for (let qadam = 0; qadam < qadamlar; qadam += 1) {
    await act(async () => {
      await new Promise((bajarildi) => {
        setTimeout(bajarildi, 0)
      })
    })
  }
}
