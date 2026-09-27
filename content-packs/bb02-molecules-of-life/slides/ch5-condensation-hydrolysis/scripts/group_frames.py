#!/usr/bin/env python3
"""Group PPspliT PNG frames into 38 logical PowerPoint pages."""

from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

try:
    import fitz
except ImportError:
    fitz = None

P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
DECK_ROOT = Path(__file__).resolve().parent.parent
PPTX_DEFAULT = Path("/Users/jyleung/Downloads/Ch5_Food_condensation_and_hydrolysis.pptx")


def load_click_meta(deck_root: Path) -> list[int]:
    meta_path = deck_root / "data" / "click-meta.json"
    if not meta_path.exists():
        return [1] * 38
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    return [meta[str(i)] + 1 if meta[str(i)] > 0 else 1 for i in range(1, 39)]


def resolve_pptx(deck_root: Path) -> Path:
    local = deck_root / "public" / "render-test" / "Ch5_Food_condensation_and_hydrolysis.pptx"
    if local.exists():
        return local
    if PPTX_DEFAULT.exists():
        return PPTX_DEFAULT
    raise FileNotFoundError("Ch5 PowerPoint source not found")


def clean_title(text: str) -> str:
    text = re.sub(r"\s+", " ", text.replace("`", " ").strip())
    return text[:96] if len(text) > 96 else text


def slide_title_from_xml(xml_bytes: bytes) -> str:
    root = ET.fromstring(xml_bytes)
    for sp in root.iter(f"{P}sp"):
        ph = sp.find(f"{P}nvSpPr/{P}nvPr/{P}ph")
        if ph is not None and ph.get("type") in ("title", "ctrTitle"):
            parts = []
            for t in sp.iter(f"{A}t"):
                if t.text and t.text.strip():
                    parts.append(t.text.strip())
            if parts:
                return clean_title(" ".join(parts))

    candidates: list[str] = []
    for sp in root.iter(f"{P}sp"):
        parts = []
        for t in sp.iter(f"{A}t"):
            if t.text and t.text.strip():
                parts.append(t.text.strip())
        text = clean_title(" ".join(parts))
        if text and text != "BB02 Molecules of Life":
            candidates.append(text)
    if candidates:
        return max(candidates, key=len)

    for sp in root.iter(f"{P}sp"):
        parts = []
        for t in sp.iter(f"{A}t"):
            if t.text and t.text.strip():
                parts.append(t.text.strip())
        if parts:
            return clean_title(" ".join(parts))
    return "Untitled"


def load_slide_titles(deck_root: Path) -> list[str]:
    pptx = resolve_pptx(deck_root)

    def slide_num(name: str) -> int:
        m = re.search(r"slide(\d+)\.xml", name)
        return int(m.group(1))

    with zipfile.ZipFile(pptx) as z:
        slides = sorted(
            [n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)],
            key=slide_num,
        )
        return [slide_title_from_xml(z.read(slide)) for slide in slides]


def proportional_boundaries(expected: list[int], total: int, page_count: int) -> list[int]:
    """Return 0-based end indices (inclusive) for each logical page."""
    base = sum(expected)
    ends: list[int] = []
    cum = 0
    for idx, count in enumerate(expected[:-1]):
        cum += count
        end = round(cum * total / base)
        if ends and end <= ends[-1]:
            end = ends[-1] + 1
        ends.append(min(end, total - (page_count - idx - 1)))
    if len(ends) != page_count - 1:
        raise ValueError("Unexpected boundary count")
    if ends[-1] >= total:
        ends[-1] = total - 1
    return ends


def thumb_samples(pdf_path: Path, width: int = 64, height: int = 36) -> list[bytes]:
    if fitz is None:
        raise RuntimeError("Install pymupdf: pip install pymupdf")
    doc = fitz.open(pdf_path)
    out: list[bytes] = []
    for i in range(doc.page_count):
        page = doc[i]
        pix = page.get_pixmap(
            matrix=fitz.Matrix(width / page.rect.width, height / page.rect.height),
            alpha=False,
        )
        out.append(pix.samples)
    return out


def sim(a: bytes, b: bytes) -> float:
    n = min(len(a), len(b))
    mad = sum(abs(a[i] - b[i]) for i in range(n)) / n
    return 1.0 - mad / 255.0


def refine_boundaries(
    total_frames: int,
    page_count: int,
    expected: list[int],
    split_thumbs: list[bytes],
    ref_thumbs: list[bytes],
    *,
    window: int = 3,
) -> list[tuple[int, int, int]]:
    """Return list of (page, start, end) with 1-based inclusive frame indices."""
    targets = proportional_boundaries(expected, total_frames, page_count)

    for page, center in enumerate(targets):
        lo = max(
            targets[page - 1] + 1 if page > 0 else 0,
            center - window,
        )
        hi = min(
            total_frames - (page_count - page - 1) - 1,
            center + window,
        )
        best = center
        best_score = -1.0
        for end_idx in range(lo, hi + 1):
            score = sim(split_thumbs[end_idx], ref_thumbs[page])
            if score > best_score:
                best_score = score
                best = end_idx
        targets[page] = best

    segments: list[tuple[int, int, int]] = []
    start = 0
    for page, end_idx in enumerate(targets, start=1):
        segments.append((page, start + 1, end_idx + 1))
        start = end_idx + 1
    segments.append((page_count, start + 1, total_frames))
    return segments


def build_pages(
    deck_root: Path,
    *,
    total_frames: int | None = None,
    pad: int | None = None,
) -> dict:
    render = deck_root / "public" / "render-test"
    split_pdf = render / "deck-ppsplit.pdf"
    ref_pdf = render / "deck.pdf"

    if not split_pdf.exists():
        raise FileNotFoundError(f"Missing {split_pdf}")

    split_thumbs = thumb_samples(split_pdf)
    frame_count = total_frames or len(split_thumbs)
    split_thumbs = split_thumbs[:frame_count]

    ref_thumbs = thumb_samples(ref_pdf) if ref_pdf.exists() else split_thumbs[:38]
    page_count = len(ref_thumbs)

    expected = load_click_meta(deck_root)
    segments = refine_boundaries(frame_count, page_count, expected, split_thumbs, ref_thumbs)
    titles = load_slide_titles(deck_root)

    if pad is None:
        pad = max(3, len(str(frame_count)))

    pages = []
    for page, start, end in segments:
        frames = [f"/media/slides/slide-{i:0{pad}d}.png" for i in range(start, end + 1)]
        label = titles[page - 1] if page - 1 < len(titles) else f"Page {page}"
        pages.append(
            {
                "page": page,
                "label": label,
                "startFrame": start,
                "endFrame": end,
                "frames": frames,
                "clicks": len(frames) - 1,
                "thumb": frames[-1],
            }
        )

    return {
        "title": "Ch 5 — Condensation & Hydrolysis",
        "pageCount": len(pages),
        "totalFrames": frame_count,
        "pages": pages,
    }


def main() -> None:
    deck_root = DECK_ROOT
    data = build_pages(deck_root)
    out = deck_root / "data" / "deck-pages.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

    public_out = deck_root / "public" / "data" / "deck-pages.json"
    public_out.parent.mkdir(parents=True, exist_ok=True)
    public_out.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

    counts = [p["clicks"] + 1 for p in data["pages"]]
    print(f"Wrote {out} — {data['pageCount']} pages, {data['totalFrames']} frames")
    print("frames/page:", counts)


if __name__ == "__main__":
    main()
