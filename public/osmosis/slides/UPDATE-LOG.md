# Ch 3 Membrane Transport — slides update log

User reminders and shipped changes for the classroom deck.  
**Source generator:** `generate.mjs` → `slides-play.html`

For full history and standing rules, see also `~/.cursor/skills/slidev-deck/UPDATE-LOG.md`.

---

## 2026-07-05

| Change | Detail |
|--------|--------|
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
