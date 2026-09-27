#!/usr/bin/env python3
"""Build Slidev deck from PowerPoint PDF export (optionally PPspliT-split deck)."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

try:
    import fitz  # pymupdf
except ImportError:
    fitz = None

P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
PPTX_DEFAULT = Path("/Users/jyleung/Downloads/Ch5_Food_condensation_and_hydrolysis.pptx")


def export_pdf_via_powerpoint(pptx: Path, pdf_out: Path) -> None:
    pdf_out.parent.mkdir(parents=True, exist_ok=True)
    script = f'''
tell application "Microsoft PowerPoint"
    activate
    open POSIX file "{pptx}"
    delay 5
    set outPdf to POSIX file "{pdf_out}"
    tell active presentation
        save in outPdf as save as PDF
    end tell
end tell
'''
    subprocess.run(["osascript", "-e", script], check=True, timeout=180)


def pdf_to_png(pdf_path: Path, out_dir: Path, width: int = 1920) -> list[Path]:
    if fitz is None:
        raise RuntimeError("Install pymupdf: pip install pymupdf")
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    pad = max(3, len(str(doc.page_count)))
    paths: list[Path] = []
    for i in range(doc.page_count):
        page = doc[i]
        scale = width / page.rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
        path = out_dir / f"slide-{i + 1:0{pad}d}.png"
        pix.save(path)
        paths.append(path)
    return paths


def sync_draw_tool(deck_root: Path) -> None:
    src = deck_root.parents[1] / "public" / "osmosis"
    for name in ("draw-tool.js", "draw-tool.css"):
        source = src / name
        target = deck_root / "public" / name
        if source.exists():
            shutil.copy2(source, target)


def write_frontmatter(*, grouped: bool) -> list[str]:
    subtitle = (
        "PPspliT builds grouped by original slide — use → for steps within a page."
        if grouped
        else "Faithful export from PowerPoint (1920×1080 PNG per slide)."
    )
    return [
        "---",
        "theme: default",
        "title: BB02 Molecules of Life",
        "info: |",
        "  Ch 5 — Condensation & Hydrolysis",
        f"  {subtitle}",
        "class: ppt-image-deck",
        "transition: none",
        "colorSchema: light",
        "background: '#ffffff'",
        "canvasWidth: 1920",
        "routerMode: hash",
        "drawings:",
        "  persist: true",
        "---",
        "",
    ]


def write_slides_md_flat(deck_root: Path, slide_count: int) -> None:
    pad = max(3, len(str(slide_count)))
    lines = write_frontmatter(grouped=False)
    for i in range(1, slide_count + 1):
        img = f"/media/slides/slide-{i:0{pad}d}.png"
        lines.extend(["---", "layout: slide-image", f"image: {img}", "---", ""])
    (deck_root / "slides.md").write_text("\n".join(lines), encoding="utf-8")


def write_slides_md_grouped(deck_root: Path, pages: list[dict]) -> None:
    lines = write_frontmatter(grouped=True)
    for page in pages:
        clicks = page["clicks"]
        lines.append("---")
        lines.append("layout: slide-image")
        lines.append(f"clicks: {clicks}")
        lines.append("frames:")
        for frame in page["frames"]:
            lines.append(f"  - {frame}")
        lines.append("---")
        lines.append("")
    (deck_root / "slides.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pptx", nargs="?", default=str(PPTX_DEFAULT))
    parser.add_argument("--ppsplit", action="store_true", help="Use deck-ppsplit.pdf from PPspliT run")
    parser.add_argument("--force-pdf", action="store_true", help="Re-export PDF from PowerPoint")
    args = parser.parse_args()

    deck_root = Path(__file__).resolve().parent.parent
    render_dir = deck_root / "public" / "render-test"
    pptx = Path(args.pptx)

    if args.ppsplit:
        pdf_path = render_dir / "deck-ppsplit.pdf"
        if not pdf_path.exists() and not args.force_pdf:
            raise SystemExit(f"Missing {pdf_path}. Run: python3 scripts/ppsplit_and_build.py")
    else:
        pdf_path = render_dir / "deck.pdf"
        if not pdf_path.exists() or args.force_pdf:
            print("Exporting PDF via Microsoft PowerPoint…")
            export_pdf_via_powerpoint(pptx, pdf_path)
        else:
            print(f"Using existing PDF: {pdf_path}")

    slides_dir = deck_root / "public" / "media" / "slides"
    print("Rendering slide PNGs from PDF…")
    pngs = pdf_to_png(pdf_path, slides_dir)
    print(f"  → {len(pngs)} frames in {slides_dir}")

    sync_draw_tool(deck_root)

    if args.ppsplit:
        sys.path.insert(0, str(deck_root / "scripts"))
        from group_frames import build_pages

        deck_data = build_pages(deck_root, total_frames=len(pngs))
        out = deck_root / "data" / "deck-pages.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(deck_data, indent=2), encoding="utf-8")
        write_slides_md_grouped(deck_root, deck_data["pages"])
        print(f"Grouped into {deck_data['pageCount']} logical pages → {out}")
    else:
        write_slides_md_flat(deck_root, len(pngs))

    print(f"Wrote {deck_root / 'slides.md'}")


if __name__ == "__main__":
    main()
