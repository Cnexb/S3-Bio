# Interactive 3D Cell Models

Standalone bilingual (English / Traditional Chinese) 3D cell explorer, styled after the S3 Biology membrane transport tool. **Separate from the S3-Bio GitHub repo.**

## Pages

| Page | File | Model |
|------|------|-------|
| Animal Cell | `animal-cell.html` | [Sketchfab Animal Cell](https://sketchfab.com/3d-models/animal-cell-0b15c013059844d7a26c1f16752f8b61) by aremay |
| Plant Cell | `plant-cell.html` | [Sketchfab Eukaryotic Plant Cell](https://sketchfab.com/3d-models/eukaryotic-plant-cell-f258c65762e5435c9d58c1aa136b557a) by jlf_illustration |
| Prokaryote | `prokaryote.html` | [Sketchfab Prokaryotic Cell](https://sketchfab.com/3d-models/prokaryotic-cell-9db95b53121e40ada34b360fd4a1f841) by Andy Todd |
| Eukaryote | `eukaryote.html` | [Sketchfab Eukaryotic Cell](https://sketchfab.com/3d-models/eukaryotic-cell-b7d84e5f2d5e411fbb195ab2742f2256) by The Center for BioMedical Visualization at SGU |

Open `index.html` or any cell page directly in a browser.

## Controls

- **Top-left panel:** Click a cell name tag to switch pages
- **3D view:** Drag to rotate, scroll to zoom
- **Click organelles** (or cyan arrows): Info popup with name, properties, and function
- **Hide controls:** Toggle button above the panel

## Local server (optional)

```bash
cd cell-models-3d
npx --yes serve .
```

Then open `http://localhost:3000/animal-cell.html`

## Sketchfab attribution

The animal cell page embeds the official [Animal Cell](https://sketchfab.com/3d-models/animal-cell-0b15c013059844d7a26c1f16752f8b61) model by [aremay](https://sketchfab.com/aremay) via the [Sketchfab Viewer API](https://sketchfab.com/developers/viewer). Model labels are hidden in the embed; use the structure buttons in the side panel for descriptions.

The plant cell page embeds the official [Eukaryotic Plant Cell](https://sketchfab.com/3d-models/eukaryotic-plant-cell-f258c65762e5435c9d58c1aa136b557a) model by [jlf_illustration](https://sketchfab.com/jlf_illustration) via the [Sketchfab Viewer API](https://sketchfab.com/developers/viewer).

The prokaryote page embeds the official [Prokaryotic Cell](https://sketchfab.com/3d-models/prokaryotic-cell-9db95b53121e40ada34b360fd4a1f841) model by [Andy Todd](https://sketchfab.com/atodd19) via the [Sketchfab Viewer API](https://sketchfab.com/developers/viewer).

The eukaryote page embeds the official [Eukaryotic Cell](https://sketchfab.com/3d-models/eukaryotic-cell-b7d84e5f2d5e411fbb195ab2742f2256) model by [The Center for BioMedical Visualization at SGU](https://sketchfab.com/SGUMedArt) via the [Sketchfab Viewer API](https://sketchfab.com/developers/viewer).

## Tech

- Sketchfab Viewer API — all cell pages
- No build step required
