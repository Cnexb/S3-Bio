# Ch 5 — Condensation & Hydrolysis (Slidev)

Faithful HTML export from `Ch5_Food_condensation_and_hydrolysis.pptx`.

## Quick start (with animations)

```bash
cd slides/ch5-condensation-hydrolysis
npm install
## PPspliT (mouse-click builds)

```bash
npm run ppsplit          # PPspliT: 38 → 251 build frames, grouped into 38 Slidev pages
npm run build-deck-split # Rebuild PNGs + grouped slides.md only
npm run dev              # Preview with sidebar (B) + draw tool + in-page build steps
```

Each logical PowerPoint page is **one Slidev slide** with multiple `frames` — use **→ / Space** for build steps within a page, not to jump to a new page until steps are exhausted.
npm run dev              # http://localhost:3030
npm run build            # dist/
```

Use **→ / Space** to advance — each step is a separate slide (same as clicking through builds in PowerPoint).

## Without PPspliT (final state only)

```bash
npm run build-deck       # 38 slides, no click builds
```

## PPspliT (one-time setup on Mac)

1. `PPspliT.ppam` is bundled in `scripts/` and copied to Office Startup on first `npm run ppsplit`
2. If macro is blocked: **Tools → PowerPoint add-ins → +** → select `scripts/PPspliT.ppam` → enable macros
3. Re-run `npm run ppsplit`

Manual split in PowerPoint: open deck → **PPspliT** ribbon/tab → split on mouse clicks → save → `npm run build-deck-split`

## Files

| Path | Purpose |
|------|---------|
| `public/media/slides/` | 1920×1080 PNG per slide |
| `public/render-test/deck-ppsplit.pdf` | PPspliT-split PDF |
| `public/render-test/Ch5_*_ppsplit.pptx` | Split PowerPoint |
| `scripts/ppsplit_and_build.py` | Automate PPspliT + rebuild |
| `dist/` | Static HTML |

## Requirements

- Node ≥ 20, **Microsoft PowerPoint (Mac)**, `pip install pymupdf`
