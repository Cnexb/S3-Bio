# Ch 3 Membrane Transport — slides update log

User reminders and shipped changes for the classroom deck.  
**Source generator:** `generate.mjs` → `slides-play.html`

For full history and standing rules, see also `~/.cursor/skills/slidev-deck/UPDATE-LOG.md`.

**Agent duty:** When the user gives a new slide reminder, append here and in the skill UPDATE-LOG at the top of the same conversation turn.

---

## 2026-07-18 — Ch 5 Saturday corrected assessment source

- **Source of truth:** `/Users/jyleung/Downloads/Ch5_Food and human_Summer Edited (Sat) - Corrected Marking Scheme.docx`.
- **Standing rule:** Ch 5 Saturday teaching pages must remain byte-content equivalent; only quiz, worksheet and marking-scheme pages may change when synchronising assessment content.
- **Generator:** `slides/ch5-condensation-hydrolysis/scripts/inject_animations.py` writes canonical `deck-pages.json`; never overwrite it with the old question bank.
- **Hub:** Show only the Ch 5 Saturday entry through canonical `ch5-play.html`.

---

## 2026-07-05 — Ch 5 condensation & hydrolysis PPT on Slides hub

| Change | Detail |
|--------|--------|
| **Source** | `Ch5_Food condensation and hydrolysis (cut) (1).pptx` from Downloads |
| **File** | `public/food-nutrition/sources/Ch5_Food_condensation_and_hydrolysis.pptx` (38 slides, ~3.8 MB) |
| **Hub** | Ch 5 card on `slides.html` — opens/downloads the `.pptx` (PowerPoint / Keynote) |

---

## 2026-07-05 — Back to slides restores main site nav

| Change | Detail |
|--------|--------|
| **Bug** | Lab “Back to slides” opened bare `slides-play.html` (no global nav) |
| **Fix** | Return to `index.html#table` with `deck` + `slide`; hub iframe auto-opens presentation |

---

## 2026-07-05 — Ch 2 Cellular Organizations deck

| Change | Detail |
|--------|--------|
| **Source** | `Ch2_Cells_Summer (1).docx` |
| **New paths** | `public/cells/slides/generate.mjs`, `content.mjs`, `slides-play.html`; `public/cells/js/cellsQuizData.js`; `public/cells/assets/` |
| **Hub** | Ch 2 card on `slides.html`; Ch 3 badge corrected to 100 slides |
| **tool-back.js** | `deck=cells` → `./cells/slides/slides-play.html` |

**Ch 2 slides:** 68 · **Ch 3 slides:** 100

Regenerate Ch 2: `cd public/cells/slides && node generate.mjs`

---

## 2026-07-05

| Change | Detail |
|--------|--------|
| **Auto-remember** | `.cursor/rules/classroom-slides-memory.mdc` — agents append new reminders to UPDATE-LOG |
| **GitHub** | `76e4084` — Slides tab, hub + player, labs, removed `summary.html` |
| **Labs in slides** | P.4 3D membrane model; P.16 virtual osmosis lab; back-to-slides from full window |
| **Summary → Slides** | `slides.html` hub; `slides-play.html` in separate window |
| **Layout** | `layoutFigTop` for large dual graphs; phagocytosis merged (P.28+29); dense layout for text-heavy lab slides |
| **UX** | Large type, bright hl colours, pic-before-text, hideable sidebar, T/F ×5 per slide, `fitSlide()` full viewport |

**Slides:** 100

---

## Regenerate

```bash
cd public/osmosis/slides && node generate.mjs
```

---

## Standing rules

- All notes + all quiz items included
- No scroll per slide; images must not cover text
- Pics reveal before text on content slides
- Regenerate after editing `generate.mjs`; do not patch `slides-play.html` by hand
