// Oylik hisobot doʻkoni: ekran shu fayl bilan gaplashadi.
//
// Bu qatlamning butun ishi — maʼlumotni bazadan oʻqib, `hisobotYasa` ga berish.
// Hisobot hech qayerda SAQLANMAYDI (0014, 0045; mezon 18): yozuv tahrirlansa yoki
// oʻchirilsa, keyingi oʻqishda raqam oʻz-oʻzidan toʻgʻri chiqadi. «Oy yopish» yoʻq.
//
// Kurs ham saqlanmaydi: `oxirgiKursniOl` uni har safar yozuv va qarz toʻlovlaridan
// hisoblaydi (0044, 0045). «≈ jami soʻmda» uchun qoʻlda soʻralgan kurs (0043) shu
// funksiyaga `qoshimchaKurslar` boʻlib beriladi — zaxira vazifasi uni saqlaydigan
// boʻlganda ham bu yoʻl oʻzgarmaydi.

import { hisobotYasa, joriyOyDavri } from '../domain/hisobot.ts'
import type { Davr, Hisobot } from '../domain/hisobot.ts'
import type { KursManbai } from '../domain/turlar.ts'
import { hammaKategoriyalar } from './kategoriyalar.ts'
import { hammaQarzlar, hammaTolovlar } from './qarzlar.ts'
import { hammaYozuvlar, oxirgiKursniOl } from './yozuvlar.ts'

/**
 * Tanlangan davr uchun hisobotni yigʻadi (0018, 0019).
 *
 * `qoshimchaKurslar` — «≈ jami soʻmda» uchun qoʻlda soʻralgan kurs manbalari (0043);
 * ular «oxirgi kurs» taqqosida yozuv va toʻlov kurslari bilan teng qatnashadi (0044).
 * Kurs **davrga bogʻliq emas**: oʻtgan oy hisobotida ham eng yangi maʼlum kurs
 * ishlatiladi (spec 10b-band).
 */
export async function hisobotniOl(
  davr: Davr,
  qoshimchaKurslar: readonly KursManbai[] = [],
): Promise<Hisobot> {
  const [yozuvlar, qarzlar, tolovlar, kategoriyalar, kurs] = await Promise.all([
    hammaYozuvlar(),
    hammaQarzlar(),
    hammaTolovlar(),
    hammaKategoriyalar(),
    oxirgiKursniOl(qoshimchaKurslar),
  ])
  return hisobotYasa({ davr, yozuvlar, qarzlar, tolovlar, kategoriyalar, kurs })
}

/** Ekran har ochilganda shu chaqiriladi: joriy kalendar oy (0018; mezon 1). */
export async function joriyOyHisobotiniOl(
  qoshimchaKurslar: readonly KursManbai[] = [],
): Promise<Hisobot> {
  return hisobotniOl(joriyOyDavri(), qoshimchaKurslar)
}
