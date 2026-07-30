# Collision Chances — Senior form backup (Version 1)

Frozen backup of the **senior secondary** Collision Chances simulation before it was removed from the live S3-Bio Interactive Tools hub (2026-07-30).

## What this is
- **Version 1 (Senior):** finite *number of substances* in the box (no infinite inflow).
- Shared sim engine at the time of removal is saved as `collisionChancesSim.js` (supports `data-cc-version="1"` / `version: 1`).
- Original version chooser page saved as `collision-chances-chooser.html`.

## Restore
1. Copy `collision-chances-v1.html` back to `public/enzymes/`.
2. Optionally restore the chooser as `public/enzymes/collision-chances.html`.
3. Re-link Interactive Tools / routes to the chooser or v1 page.
4. If the live shared JS has changed, you may also need to restore or merge `collisionChancesSim.js` / `collision-chances.css`.

## Live site after removal
Students open **Version 2 (F3 / S3)** only: `public/enzymes/collision-chances-v2.html`.
