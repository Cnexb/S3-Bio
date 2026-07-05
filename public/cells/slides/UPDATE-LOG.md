# Ch 2 Cellular Organizations — slides update log

User reminders and shipped changes for the classroom deck.  
**Source generator:** `generate.mjs` → `slides-play.html`  
**Quiz data:** `../js/cellsQuizData.js` · **Note slides:** `content.mjs`

For full history and standing rules, see `public/osmosis/slides/UPDATE-LOG.md` and `~/.cursor/skills/slidev-deck/UPDATE-LOG.md`.

---

## 2026-07-05 — Side-ref layout for organelles + prok/euk tables

| Fix | Detail |
|-----|--------|
| **Organelles ×3** | Left column: image6 animal + image7 plant (stacked, full contain) |
| **Prok/euk ×2** | Left column: image10 prokaryote + image9 eukaryote; table uses remaining 60% width |
| **Layout** | `layoutSideRefs` — 40/60 split, object-fit contain, compact table |

---

## 2026-07-05 — Comparison split + larger refs + animation moved

| Fix | Detail |
|-----|--------|
| **Prok/euk table** | Split Part 1 / Part 2; refs on top (46% height, min 34vh) |
| **Draw together** | Reference row 50% height (min 38vh) |
| **Animation** | Moved to slide after **From prokaryotes to eukaryotes** drawing |
| **Slides** | **67** |

---

## 2026-07-05 — Comparison refs, table diagrams, endosymbiotic embed

| Fix | Detail |
|-----|--------|
| **Comparison refs** | image10 prokaryote + image9 eukaryote (not animal/plant) |
| **Microscope table** | image4 labelled diagram beside parts table |
| **Biomolecules** | Carbs→image7, Lipids→image8, Protein→image6 (S1 Ch 4) |
| **Animation** | Endosymbiotic iframe after draw-together slide |
| **Slides** | **66** |

---

## 2026-07-05 — Drawing space + comparison refs

| Fix | Detail |
|-----|--------|
| **原核→真核** | Large dashed drawing box below intro text |
| **Comparison** | Animal (image6) + plant (image7) reference diagrams beside table |
| **After comparison** | New draw-together slide — refs on top, two side-by-side drawing boxes |
| **Slides** | **65** |

---

## 2026-07-05 — S1 sentence removed; comparison table fixed

| Fix | Detail |
|-----|--------|
| **S1 slide** | Removed “What you should have learnt…” — image6+7 only |
| **Comparison** | Table headers match notes: Prokaryotes \| Eukaryotes (Animal Cells / Plant Cells); examples → chloroplasts → onion/fungi → table; row wording from docx |

---

## 2026-07-05 — S1 (Ch 4) section aligned to notes exactly

| Fix | Detail |
|-----|--------|
| **Removed** | Extra intro slide, “draw together” / Fig 4.4 captions, invented label prompts |
| **Restored** | Docx order: S1 (Ch 4) ! → image6+7 → Recalling… → Names/Functions tables (carbs, lipids, protein) → image8 membrane (雙層 / Embedded 嵌入 proteins) |
| **Slides** | **64** |

---

## 2026-07-05 — Full notes content restored + larger hero images

| Fix | Detail |
|-----|--------|
| **Missing content** | Hooke split (portrait + cork), full microscope parts table, S1 biomolecules (carbs/lipids/proteins tables), draw-together slides, membrane composition, prokaryote before organelle intro, 3-part organelle table with full Details, eukaryote examples (E.coli/Amoeba/chloroplast/onion/fungi), full prok/euk comparison table, chloroplast EM slide, virus + concept check |
| **Image size** | `layoutPicHero` + `fig-hero` CSS — min-height 52vh on key slides; grid pairs 42vh |
| **Slides** | **66** (27 note slides + quiz) |

---

## 2026-07-05 — Notes sequence + MCQ images realigned to docx

| Fix | Detail |
|-----|--------|
| **Sequence** | Microscope → S1 biomolecules → draw/micrograph (img6–7) → membrane (img8) → cell overview (img9) → org table → prokaryote (img10) → examples (img11–15) → comparison (img23) → virus → concept (img17) |
| **Image mapping** | Removed wrong pairings (e.g. img10 as carbs, img11/12 as lipids/proteins, img19 in notes) |
| **MCQ pics** | Q3→18, Q4→19, Q12→20, Q15→21, Q17→22, Q25→23 (per docx); no placeholder |

**Slides:** 60

---

## 2026-07-05 — Back to slides restores main site nav

- **User:** Lab back button should return to full S3 Bio site (top bar), not bare slides player.
- **Done:** Shared fix in `tool-back.js`, `pageController.js`, `slides.html`, `embed.js`.

---

## 2026-07-05 — Ch 2 fixes (fill batch, microscope, A/P table)

| User reminder | Done |
|---------------|------|
| Fill blanks — multiple Q per slide | Batched ×5 like T/F (`fillBatchSlide`) |
| Missing microscope / draw together | Nosepiece, brightness knob; image4 diagram; image7 draw+micrograph; image13/19 micrographs |
| A/P unclear in organelle table | Renamed **Animal 動物** / **Plant 植物** columns; ✓/✗ legend; full Details from notes |

**Slides:** 59

---

## 2026-07-05 — Initial Ch 2 deck

| Change | Detail |
|--------|--------|
| **Source** | `Ch2_Cells_Summer (1).docx` — notes + 30 MCQ + 20 T/F + 15 fill |
| **Assets** | `public/cells/assets/image*.png\|jpeg` (docx extract) |
| **Generator** | `public/cells/slides/generate.mjs` + `content.mjs` |
| **Hub** | `public/osmosis/slides.html` — Ch 2 card → `../cells/slides/slides-play.html` |
| **UX** | Same standard as Ch 3: large type, hl colours, pic-before-text, sidebar, T/F ×5, `fitSlide()` |

**Slides:** 59 (17 notes + 1 concept-check intro + 30 MCQ + 4 T/F batches + 3 fill batches + end)

---

## Regenerate

```bash
cd public/cells/slides && node generate.mjs
```

---

## Standing rules

Same as Ch 3 — see `public/osmosis/slides/UPDATE-LOG.md`.
