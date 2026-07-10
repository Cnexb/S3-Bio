#!/usr/bin/env python3
"""Convert PPTX to Slidev deck with v-click animation mapping from PowerPoint timing XML."""

from __future__ import annotations

import json
import re
import shutil
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
REL = "{http://schemas.openxmlformats.org/package/2006/relationships}Relationship"

EMU_W = 12192000
EMU_H = 6858000


def pct(v: str | None, total: int) -> float:
    if not v:
        return 0.0
    return round(100 * int(v) / total, 4)


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def rels_map(z: zipfile.ZipFile, rels_path: str) -> dict[str, str]:
    root = ET.fromstring(z.read(rels_path))
    return {n.get("Id"): n.get("Target") for n in root.findall(f"{REL}")}


def resolve_media(z: zipfile.ZipFile, slide_rels: dict[str, str], embed_id: str) -> str | None:
    target = slide_rels.get(embed_id)
    if not target:
        return None
    if target.startswith("../"):
        target = "ppt/" + target[3:]
    elif not target.startswith("ppt/"):
        target = "ppt/slides/" + target
    return target


def parse_rich_text(tx_body: ET.Element | None) -> tuple[str, float | None, str | None]:
    if tx_body is None:
        return "", None, None
    parts: list[str] = []
    font_size: float | None = None
    color: str | None = None
    for p in tx_body.findall(f"{A}p"):
        line = ""
        for r in p.findall(f"{A}r"):
            rpr = r.find(f"{A}rPr")
            if rpr is not None and font_size is None and rpr.get("sz"):
                font_size = int(rpr.get("sz")) / 100
            if rpr is not None and color is None:
                solid = rpr.find(f"{A}solidFill/{A}srgbClr")
                if solid is not None and solid.get("val"):
                    color = "#" + solid.get("val")
            t = r.find(f"{A}t")
            if t is not None and t.text:
                line += t.text
        br = p.find(f"{A}br")
        if line:
            parts.append(line)
        if br is not None and parts:
            parts[-1] += "\n"
    return "\n".join(parts).strip(), font_size, color


def shape_geometry(node: ET.Element) -> dict | None:
    sp_pr = node.find(f"{P}spPr") or node.find(f"{A}spPr")
    if sp_pr is None:
        return None
    xfrm = sp_pr.find(f"{A}xfrm")
    if xfrm is None:
        return None
    off = xfrm.find(f"{A}off")
    ext = xfrm.find(f"{A}ext")
    if off is None or ext is None:
        return None
    rot = xfrm.get("rot")
    deg = round(int(rot) / 60000, 2) if rot else 0
    return {
        "left": pct(off.get("x"), EMU_W),
        "top": pct(off.get("y"), EMU_H),
        "width": pct(ext.get("cx"), EMU_W),
        "height": pct(ext.get("cy"), EMU_H),
        "rotate": deg,
    }


def parse_animations(root: ET.Element) -> tuple[list[list[dict]], set[str]]:
    """Return click groups and shape ids that start hidden (entrance animations)."""
    groups: list[list[dict]] = []
    hidden: set[str] = set()
    timing = root.find(f".//{P}timing")
    if timing is None:
        return groups, hidden

    for par in timing.iter(f"{P}par"):
        ctn = par.find(f"{P}cTn")
        if ctn is None:
            continue
        node_type = ctn.get("nodeType")
        if node_type not in ("clickEffect", "withEffect"):
            continue

        items: list[dict] = []
        for child in ctn.iter():
            tag = child.tag.split("}")[-1]
            if tag == "spTgt":
                spid = child.get("spid")
                if spid:
                    items.append({"spid": spid})
            elif tag == "animEffect":
                filt = child.get("filter") or "fade"
                trans = child.get("transition") or "in"
                if items:
                    items[-1]["effect"] = filt
                    items[-1]["transition"] = trans
            elif tag == "set":
                sp = child.find(f".//{P}spTgt")
                if sp is not None:
                    spid = sp.get("spid")
                    if spid:
                        hidden.add(spid)
                        items.append({"spid": spid, "effect": "appear"})

        if not items:
            continue

        if node_type == "clickEffect":
            groups.append(items)
        elif groups:
            groups[-1].extend(items)
        else:
            groups.append(items)

    # dedupe spids per group preserving order
    deduped: list[list[dict]] = []
    for g in groups:
        seen: set[str] = set()
        row: list[dict] = []
        for it in g:
            sid = it.get("spid")
            if not sid or sid in seen:
                continue
            seen.add(sid)
            row.append(it)
        if row:
            deduped.append(row)
    return deduped, hidden


def extract_shapes(
    sp_tree: ET.Element,
    z: zipfile.ZipFile,
    slide_rels: dict[str, str],
    out_media: Path,
    slide_idx: int,
    prefix: str = "",
) -> list[dict]:
    elements: list[dict] = []

    def walk(parent: ET.Element) -> None:
        for child in list(parent):
            tag = child.tag.split("}")[-1]
            if tag == "grpSp":
                walk(child.find(f"{P}spTree") or child)
                continue
            if tag not in ("sp", "pic", "cxnSp"):
                continue

            cnv = child.find(f".//{P}cNvPr")
            if cnv is None:
                continue
            spid = cnv.get("id")
            name = cnv.get("name") or ""
            geom = shape_geometry(child)
            if geom is None:
                continue

            el: dict = {"id": spid, "name": name, **geom}

            if tag == "pic":
                blip = child.find(f".//{A}blip")
                if blip is not None:
                    embed = blip.get(f"{{{R_NS}}}embed")
                    media_path = resolve_media(z, slide_rels, embed) if embed else None
                    if media_path and media_path in z.namelist():
                        ext = Path(media_path).suffix or ".png"
                        fname = f"slide{slide_idx:02d}-{spid}{ext}"
                        dest = out_media / fname
                        if not dest.exists():
                            dest.write_bytes(z.read(media_path))
                        el["type"] = "image"
                        el["src"] = f"/media/{fname}"
                elements.append(el)
                continue

            tx = child.find(f".//{P}txBody") or child.find(f".//{A}txBody")
            text, fs, col = parse_rich_text(tx)
            if text:
                el["type"] = "text"
                el["text"] = text
                if fs:
                    el["fontSize"] = fs
                if col:
                    el["color"] = col
                elements.append(el)
            else:
                # shape / ellipse with no text — may be decorative
                solid = child.find(f".//{A}solidFill/{A}srgbClr")
                if solid is not None and solid.get("val"):
                    el["type"] = "shape"
                    el["fill"] = "#" + solid.get("val")
                    elements.append(el)

    walk(sp_tree)
    return elements


def slide_background(root: ET.Element, z: zipfile.ZipFile, slide_rels: dict[str, str], out_media: Path, slide_idx: int) -> str | None:
    bg = root.find(f".//{P}bg")
    if bg is None:
        return None
    blip = bg.find(f".//{A}blip")
    if blip is None:
        solid = bg.find(f".//{A}solidFill/{A}srgbClr")
        if solid is not None and solid.get("val"):
            return "#" + solid.get("val")
        return None
    embed = blip.get(f"{{{R_NS}}}embed")
    media_path = resolve_media(z, slide_rels, embed) if embed else None
    if not media_path or media_path not in z.namelist():
        return None
    ext = Path(media_path).suffix or ".png"
    fname = f"slide{slide_idx:02d}-bg{ext}"
    dest = out_media / fname
    if not dest.exists():
        dest.write_bytes(z.read(media_path))
    return f"/media/{fname}"


def convert(pptx_path: Path, deck_root: Path) -> None:
    out_media = deck_root / "public" / "media"
    out_data = deck_root / "data"
    out_media.mkdir(parents=True, exist_ok=True)
    out_data.mkdir(parents=True, exist_ok=True)

    slides_meta: list[dict] = []

    with zipfile.ZipFile(pptx_path) as z:
        slide_files = sorted(
            [n for n in z.namelist() if re.match(r"ppt/slides/slide\d+\.xml$", n)],
            key=lambda x: int(re.search(r"slide(\d+)", x).group(1)),
        )

        for slide_path in slide_files:
            slide_idx = int(re.search(r"slide(\d+)", slide_path).group(1))
            rels_path = f"ppt/slides/_rels/slide{slide_idx}.xml.rels"
            slide_rels = rels_map(z, rels_path) if rels_path in z.namelist() else {}

            root = ET.fromstring(z.read(slide_path))
            sp_tree = root.find(f".//{P}spTree")
            if sp_tree is None:
                continue

            elements = extract_shapes(sp_tree, z, slide_rels, out_media, slide_idx)
            click_groups, hidden_spids = parse_animations(root)
            bg = slide_background(root, z, slide_rels, out_media, slide_idx)

            spid_to_click: dict[str, int] = {}
            spid_effect: dict[str, str] = {}
            for click_idx, group in enumerate(click_groups, start=1):
                for item in group:
                    sid = item["spid"]
                    spid_to_click[sid] = click_idx
                    spid_effect[sid] = item.get("effect", "fade")

            for el in elements:
                sid = el["id"]
                if sid in spid_to_click:
                    el["click"] = spid_to_click[sid]
                    el["animation"] = spid_effect.get(sid, "fade")
                    el["initialHidden"] = True
                elif sid in hidden_spids:
                    el["click"] = 1
                    el["animation"] = "fade"
                    el["initialHidden"] = True
                else:
                    el["click"] = 0
                    el["initialHidden"] = False

            slide_data = {
                "index": slide_idx,
                "background": bg,
                "elements": elements,
                "clickCount": max([el.get("click", 0) for el in elements] + [0]),
            }
            data_file = out_data / f"slide-{slide_idx:02d}.json"
            data_file.write_text(json.dumps(slide_data, ensure_ascii=False, indent=2), encoding="utf-8")
            slides_meta.append({"index": slide_idx, "file": f"slide-{slide_idx:02d}.json"})

    # generate slides.md
    lines = [
        "---",
        "theme: seriph",
        "title: BB02 Molecules of Life",
        "info: |",
        "  Ch 5 — Condensation & Hydrolysis",
        "  Converted from PowerPoint with click animations mapped to Slidev v-click.",
        "class: ppt-deck",
        "transition: fade",
        "clickAnimations:",
        "  - fade",
        "drawings:",
        "  persist: false",
        "highlighter: shiki",
        "---",
        "",
    ]

    for meta in slides_meta:
        idx = meta["index"]
        lines.extend(
            [
                "---",
                f"layout: ppt-canvas",
                f"canvas: ./data/{meta['file']}",
                "---",
                "",
                f"<!-- Slide {idx} from Ch5_Food_condensation_and_hydrolysis.pptx -->",
                "",
            ]
        )

    (deck_root / "slides.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"Converted {len(slides_meta)} slides → {deck_root}")
    print(f"Media: {out_media} ({len(list(out_media.glob('*')))} files)")


if __name__ == "__main__":
    pptx = Path(sys.argv[1] if len(sys.argv) > 1 else "/Users/jyleung/Downloads/Ch5_Food_condensation_and_hydrolysis.pptx")
    deck = Path(sys.argv[2] if len(sys.argv) > 2 else Path(__file__).resolve().parent.parent)
    convert(pptx, deck)
