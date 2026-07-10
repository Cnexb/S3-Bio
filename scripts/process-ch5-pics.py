#!/usr/bin/env python3
"""Remove near-white backgrounds from Ch5 reaction PNGs (edge flood-fill, numpy)."""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PICS = ROOT / "public/osmosis/assets/ch5-pics"
THRESHOLD = 240


def background_mask(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    neutral = (np.maximum.reduce([r, g, b], axis=0) - np.minimum.reduce([r, g, b], axis=0)) <= 15
    light_white = (r >= THRESHOLD) & (g >= THRESHOLD) & (b >= THRESHOLD)
    light_checker = (r >= 235) & (g >= 235) & (b >= 235)
    dark_checker = (
        (r >= 185) & (r <= 215)
        & (g >= 185) & (g <= 215)
        & (b >= 185) & (b <= 215)
        & neutral
    )
    return light_white | light_checker | dark_checker


def remove_white_edges(src: Path) -> None:
    rgba = np.array(Image.open(src).convert("RGBA"))
    rgb = rgba[..., :3]
    bg = background_mask(rgb)
    h, w = bg.shape
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        if bg[y, x] and not visited[y, x]:
            visited[y, x] = True
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and bg[ny, nx] and not visited[ny, nx]:
                visited[ny, nx] = True
                q.append((nx, ny))

    rgba[visited, 3] = 0
    Image.fromarray(rgba, "RGBA").save(src, "PNG")


def main() -> None:
    files = sorted(PICS.glob("*.png"))
    if not files:
        raise SystemExit(f"No PNGs in {PICS}")
    for i, path in enumerate(files, 1):
        remove_white_edges(path)
        print(f"[{i}/{len(files)}] {path.name}")
    print(f"Processed {len(files)} files.")


if __name__ == "__main__":
    main()
