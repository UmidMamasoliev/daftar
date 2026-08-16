# 0039 — Agentlar orasida hujjat yozish chegarasi

Sana: 2026-08-16

Nima hal qilindi: Loyiha hujjatlarini yozish huquqi agentlar orasida boʻlindi: qaror
(`decisions/`) va spec (`prds/`) fayllarini faqat `pm` va `hujjat` agentlari yozadi; sessiya
yakunidagi xotira faylini (`memory/YYYY-MM-DD.md` va `memory/<sana>-hisobot.md`) faqat
`manager` (bosh agent) yozadi.

Nega: Uchala agentning ham (`pm`, `hujjat`, `manager`) instruksiyasida `decisions/` va
`memory/` ga yozish bor edi — bitta hujjatga uch agent yozsa, kim yozgani va qaysi nusxa
toʻgʻriligi aralashib ketadi. Har hujjat turiga bitta egalik: qaror va spec — reja/hujjat
ishining davomi, sessiya xotirasi — hamma agent hisobotini yigʻadigan bosh agentning yakuni.

Nimani oʻzgartiradi: `manager` yoʻl-yoʻlakay qabul qilingan qarorni oʻzi yozmaydi — yozishni
`pm` yoki `hujjat` ga beradi. `hujjat` sessiya yakunidagi `memory/` faylini yozmaydi — bu
`manager` niki. Agent fayllari (`.claude/agents/manager.md`, `hujjat.md`) shu chegara bilan
yangilandi. `lessons/qoidalar.md` ga yozish hamma agentda qoladi: har agent oʻzi olgan
tuzatishni oʻzi yozadi.
