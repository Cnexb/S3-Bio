#!/usr/bin/env python3
"""Batch-render Ch5 dual-panel Manim videos (dse-bio-assets + chem-display SVG frames).

Requires: pip install manim
Regenerate SVG frames first: python3 scripts/render-ch5-scenes.py

Usage:
  python3 scripts/render-ch5-manim.py              # all reactions, low quality
  python3 scripts/render-ch5-manim.py --reaction c1-glucose-maltose --quality h
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCENE_FILE = ROOT / "public/osmosis/assets/bio/videos/scenes/ch5_dual_panel.py"
OUT_DIR = ROOT / "public/osmosis/assets/bio/videos/ch5-reactions"

REACTION_IDS = [
    "c1-glucose-maltose",
    "h1-maltose-glucose",
    "c2-triglyceride",
    "h2-triglyceride",
    "c3-dipeptide",
    "h3-dipeptide",
    "h4-starch-maltose",
    "h5-cellulose-glucose",
    "c4-dna-strand",
    "h6-dna-nucleotides",
]


def scene_class_name(reaction_id: str) -> str:
    return f"Ch5Reaction_{reaction_id.replace('-', '_')}"


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Render Ch5 Manim dual-panel videos.")
    p.add_argument("--reaction", action="append", help="Reaction id (repeatable)")
    p.add_argument("-q", "--quality", choices=("l", "m", "h"), default="l")
    p.add_argument("--dry-run", action="store_true")
    return p.parse_args()


def run_manim(reaction_id: str, quality: str, dry_run: bool) -> int:
    if shutil.which("manim") is None:
        print("Error: manim not installed. Try: pip install manim", file=sys.stderr)
        return 1

    cls = scene_class_name(reaction_id)
    qflag = {"l": "-ql", "m": "-qm", "h": "-qh"}[quality]
    out_stem = OUT_DIR / reaction_id

    cmd = [
        "manim",
        qflag,
        str(SCENE_FILE),
        cls,
        "-o",
        reaction_id,
    ]

    if dry_run:
        print(" ".join(cmd))
        return 0

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(cmd, cwd=str(SCENE_FILE.parent))
    if proc.returncode != 0:
        print(f"Failed: {reaction_id}", file=sys.stderr)
        return proc.returncode

    matches = sorted((SCENE_FILE.parent / "media").rglob(f"{reaction_id}.mp4"))
    if matches:
        dest = OUT_DIR / f"{reaction_id}.mp4"
        shutil.copy2(matches[-1], dest)
        print(dest)
    else:
        print(f"Rendered (check media/): {reaction_id}")

    return 0


def main() -> int:
    args = parse_args()
    targets = args.reaction or REACTION_IDS
    for rid in targets:
        if rid not in REACTION_IDS:
            print(f"Unknown reaction: {rid}", file=sys.stderr)
            return 1
        code = run_manim(rid, args.quality, args.dry_run)
        if code:
            return code
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
