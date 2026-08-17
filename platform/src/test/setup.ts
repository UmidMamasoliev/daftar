// Har test faylidan oldin ishlaydi (vitest.config.ts → setupFiles).
//
// `fake-indexeddb/auto` global `indexedDB` ni oʻzining nusxasi bilan almashtiradi:
// testda brauzer ochilmaydi, baza xotirada yaratiladi. Shu sababli IndexedDB bilan
// ishlaydigan kodni hech narsa moslashtirmasdan test qilsa boʻladi (0040).
import 'fake-indexeddb/auto'
