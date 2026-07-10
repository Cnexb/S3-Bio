#!/usr/bin/env python3
"""Ch5 condensation/hydrolysis — 4-step facing scenes (chem-display + dse-bio).
Regenerate: python3 scripts/render-ch5-scenes.py
"""
from __future__ import annotations
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHEM = ROOT / "public/osmosis/assets/chem-ch5"
DSE = ROOT / "public/osmosis/assets/bio/ch5-reactions"
OUT = ROOT / "public/osmosis/assets/ch5-scenes"
MANIFEST = ROOT / "public/osmosis/js/ch5SceneManifest.js"
RENDER_CHEM = ROOT / "scripts/render-ch5-chem-assets.py"

W, H = 720, 280
JX, JY = 360, 130
BG = "#f7f9fb"

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: raise RuntimeError(r.stderr or r.stdout)

def ensure_chem():
    if not (CHEM / "alpha-glucose-hl-c1.svg").exists() and RENDER_CHEM.exists():
        run([sys.executable, str(RENDER_CHEM)])

def strip_bg(svg: str) -> str:
    svg = re.sub(r"<rect style='opacity:1\.0;fill:#FFFFFF;stroke:none'[^>]*>\s*</rect>", "", svg, count=1)
    m = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.DOTALL)
    return m.group(1) if m else svg

def load(path: Path) -> str:
    return strip_bg(path.read_text(encoding="utf-8"))

def wrap(body: str) -> str:
    return f"<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' width='{W}' height='{H}'>{body}</svg>"

def hl(cx, cy, r=11):
    return f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='none' stroke='#e74c3c' stroke-width='2.5'/>"

def hexagon(cx, cy, s=24, fill="#e8f4fc", stroke="#2980b9"):
    pts = []
    for i in range(6):
        a = 3.14159265/3*i - 3.14159265/2
        pts.append(f"{cx+s*0.866*__import__('math').cos(a):.1f},{cy+s*__import__('math').sin(a):.1f}")
    return f"<polygon points='{' '.join(pts)}' fill='{fill}' stroke='{stroke}' stroke-width='2'/>"

def label(text, y=H-8):
    return f"<text x='{W/2}' y='{y}' text-anchor='middle' font-size='11' fill='#566573' font-family='sans-serif'>{text}</text>"

def mask_rect(x,y,w,h):
    return f"<rect x='{x}' y='{y}' width='{w}' height='{h}' fill='{BG}' rx='3'/>"

def water(cx, cy, scale=1.0):
    r = 14*scale
    return (f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='#fadbd8' stroke='#c0392b' stroke-width='2'/>"
            f"<text x='{cx}' y='{cy+4}' text-anchor='middle' font-size='{9*scale:.0f}' font-weight='700' fill='#922b21'>H₂O</text>")

def bond_dash(x1,y1,x2,y2, forming=False):
    col = "#27ae60" if forming else "#e74c3c"
    dash = "" if forming else " stroke-dasharray='6 4'"
    return f"<line x1='{x1}' y1='{y1}' x2='{x2}' y2='{y2}' stroke='{col}' stroke-width='3'{dash}/>"

def embed_dse(name: str) -> str:
    p = DSE / f"{name}.svg"
    if not p.exists(): return f"<text x='20' y='40'>missing {name}</text>"
    inner = load(p)
    m = re.search(r'viewBox=["\']0 0 ([0-9.]+) ([0-9.]+)["\']', p.read_text())
    if m:
        sw, sh = float(m.group(1)), float(m.group(2))
        sx, sy = (W-20)/sw, (H-30)/sh
        s = min(sx, sy, 1.05)
        return f"<g transform='translate(10,8) scale({s})'>{inner}</g>"
    return f"<g transform='translate(10,8)'>{inner}</g>"

def embed_chem(asset, x, y, w, h=None):
    p = CHEM / f"{asset}.svg"
    if not p.exists(): return ""
    inner = load(p)
    if h is None: h = w
    return f"<g transform='translate({x},{y})'><svg viewBox='0 0 {w} {h}' width='{w}' height='{h}' preserveAspectRatio='xMidYMid meet'>{inner}</svg></g>"

# ── Concept generators ───────────────────────────────────────────────────

def c_glc_pair(step):
    lx, rx, cy = JX-88, JX+88, JY
    parts = [hexagon(lx,cy), hexagon(rx,cy),
             f"<text x='{lx}' y='{cy+4}' text-anchor='middle' font-size='10' fill='#2c3e50'>Glc</text>",
             f"<text x='{rx}' y='{cy+4}' text-anchor='middle' font-size='10' fill='#2c3e50'>Glc</text>"]
    if step >= 1:
        parts += [hl(lx+16, cy-10, 9), hl(rx-16, cy+10, 9)]
    if step == 0:
        parts.append(f"<line x1='{lx+26}' y1='{cy-4}' x2='{rx-26}' y2='{cy+4}' stroke='#bdc3c7' stroke-width='1.5' stroke-dasharray='4 3'/>")
    if step == 2:
        parts += [mask_rect(lx+8,cy-18,22,16), mask_rect(rx-28,cy+2,24,18),
                  bond_dash(lx+28,cy,rx-28,cy,True), water(JX, 42),
                  f"<text x='{lx+12}' y='{cy-8}' font-size='9' fill='#e67e22'>–H</text>",
                  f"<text x='{rx-20}' y='{cy+18}' font-size='9' fill='#2980b9'>–OH</text>"]
    if step == 3:
        parts = [hexagon(JX-40,cy), hexagon(JX,cy), f"<line x1='{JX-18}' y1='{cy}' x2='{JX-2}' y2='{cy}' stroke='#566573' stroke-width='3'/>",
                 water(JX+70, cy), label("Maltose + H₂O")]
        return wrap("".join(parts))
    return wrap("".join(parts) + label("α-glucose · C1 ↔ C4"))

def c_maltose_hydro(step):
    lx, rx, cy = JX-88, JX+88, JY
    if step <= 2:
        parts = [hexagon(lx,cy), hexagon(rx,cy), f"<line x1='{lx+22}' y1='{cy}' x2='{rx-22}' y2='{cy}' stroke='#566573' stroke-width='3'/>"]
        if step >= 1: parts.append(hl(JX, cy, 12))
        if step == 2:
            parts += [bond_dash(lx+22,cy,rx-22,cy), water(JX, cy+58),
                      f"<text x='{JX-8}' y='{cy-14}' font-size='9' fill='#e67e22'>–H</text>",
                      f"<text x='{JX+4}' y='{cy+22}' font-size='9' fill='#2980b9'>–OH</text>"]
        else:
            parts += [f"<text x='{lx}' y='{cy+4}' text-anchor='middle' font-size='10'>Glc</text>",
                      f"<text x='{rx}' y='{cy+4}' text-anchor='middle' font-size='10'>Glc</text>"]
        return wrap("".join(parts) + label("Maltose · glycosidic bond"))
    return c_glc_pair(3)

def c_generic_pair(step, left="A", right="B", title=""):
    lx, rx, cy = JX-80, JX+80, JY
    parts = [f"<circle cx='{lx}' cy='{cy}' r='16' fill='#ebdef0' stroke='#8e44ad'/>",
             f"<circle cx='{rx}' cy='{cy}' r='16' fill='#d7bde2' stroke='#8e44ad'/>",
             f"<text x='{lx}' y='{cy+4}' text-anchor='middle' font-size='9'>{left}</text>",
             f"<text x='{rx}' y='{cy+4}' text-anchor='middle' font-size='9'>{right}</text>"]
    if step >= 1: parts.append(hl(JX, cy, 10))
    if step == 2: parts += [bond_dash(lx+18,cy,rx-18,cy, True), water(JX, 38)]
    if step == 3: parts += [f"<line x1='{lx+18}' y1='{cy}' x2='{rx-18}' y2='{cy}' stroke='#8e44ad' stroke-width='2'/>", water(JX+90,cy)]
    return wrap("".join(parts) + label(title))

def c_triglyceride(step, condense=True):
    cx, cy = JX, JY+8
    parts = [f"<circle cx='{cx}' cy='{cy}' r='8' fill='#2ecc71' stroke='#1e8449'/>"]
    for ang in [-50, 0, 50]:
        import math
        rad = math.radians(ang)
        ex, ey = cx+55*math.cos(rad), cy-45*math.sin(rad)
        parts.append(f"<line x1='{cx}' y1='{cy}' x2='{ex}' y2='{ey}' stroke='#27ae60' stroke-width='2'/>")
        parts.append(f"<ellipse cx='{ex}' cy='{ey}' rx='18' ry='7' fill='#f9e79f' stroke='#d4ac0d'/>")
        if step >= 1: parts.append(hl(ex, ey, 7))
    if step == 2:
        parts.append(water(JX, 28, 0.85 if condense else 1))
        if condense: parts.append(f"<text x='{JX}' y='{52}' text-anchor='middle' font-size='9' fill='#566573'>3 H₂O</text>")
    return wrap("".join(parts) + label("Triglyceride · ester bonds" if not condense else "Glycerol + fatty acids"))

def c_starch_chain(step):
    cy = JY
    xs = [JX-120, JX-60, JX, JX+60, JX+120]
    parts = [hexagon(x, cy, 18) for x in xs]
    for i in range(len(xs)-1):
        parts.append(f"<line x1='{xs[i]+16}' y1='{cy}' x2='{xs[i+1]-16}' y2='{cy}' stroke='#566573' stroke-width='2'/>")
    if step >= 1: parts.append(hl(JX+60, cy, 10))
    if step == 2: parts += [bond_dash(JX+44,cy,JX+76,cy), water(JX+60, cy+50)]
    if step == 3:
        parts = [hexagon(JX-30,cy,18), hexagon(JX+30,cy,18), label("Starch → maltose segment")]
        return wrap("".join(parts))
    return wrap("".join(parts) + label("Starch · glycosidic bond"))

def c_dna_chain(step, condense=True):
    cy = JY
    xs = [JX-90, JX-30, JX+30, JX+90]
    def nucl(x):
        return (f"<rect x='{x-14}' y='{cy-11}' width='28' height='22' rx='3' fill='#fdebd0' stroke='#e67e22'/>"
                f"<text x='{x}' y='{cy+4}' text-anchor='middle' font-size='7'>Nt</text>")
    parts = [nucl(x) for x in xs]
    for i in range(len(xs)-1):
        parts.append(f"<line x1='{xs[i]+14}' y1='{cy}' x2='{xs[i+1]-14}' y2='{cy}' stroke='#566573' stroke-width='2'/>")
        if step >= 1: parts.append(hl((xs[i]+xs[i+1])/2, cy, 7))
    if step == 2:
        parts += [bond_dash(JX-16,cy,JX+16,cy, condense), water(JX, cy-50 if condense else cy+50)]
    if step == 3 and not condense:
        parts = [nucl(x) for x in [JX-60, JX, JX+60]]
        return wrap("".join(parts) + label("Nucleotides"))
    return wrap("".join(parts) + label("DNA strand · phosphodiester"))

# ── Struct: use DSE facing + baked overlays for steps 1–2 ────────────────

def s_from_dse(base, step, rx=None):
    """base = step0-facing svg name; step 0–3"""
    if step == 3 and rx and (DSE / f"{rx}.svg").exists():
        return embed_dse(rx)
    body = embed_dse(base)
    extra = ""
    if step == 1:
        extra = f"<g opacity='0.9'>{hl(248,78)}{hl(472,152)}</g>" if "c1" in base else ""
    if step == 2:
        extra = (mask_rect(230,55,55,45) + mask_rect(455,125,55,50) +
                 bond_dash(300,115,420,125, True) + water(JX, 35) +
                 embed_chem("alpha-glucose-strip-c1h", 235, 50, 50) +
                 embed_chem("alpha-glucose-strip-c4oh", 450, 120, 50))
        if "c1" not in base:
            extra = water(JX, 40)
    return wrap(body + extra)

REACTIONS = {
  "c1-glucose-maltose": {"type":"condensation","struct0":"c1-step0-facing","struct3":"c1-step2-facing",
    "concept": lambda s: c_glc_pair(s)},
  "h1-maltose-glucose": {"type":"hydrolysis","struct0":"h1-step0-facing","struct3":"h1-step2-facing",
    "concept": lambda s: c_maltose_hydro(s)},
  "c2-triglyceride": {"type":"condensation","struct0":"c2-step0-facing","struct3":"c2-step2-facing",
    "concept": lambda s: c_triglyceride(s, True)},
  "h2-triglyceride": {"type":"hydrolysis","struct0":"h2-step0-facing","struct3":"h2-step2-facing",
    "concept": lambda s: c_triglyceride(s, False)},
  "c3-dipeptide": {"type":"condensation","struct0":"c3-step0-facing","struct3":"c3-step2-facing",
    "concept": lambda s: c_generic_pair(s,"NH₂","COOH","Amino acids → dipeptide")},
  "h3-dipeptide": {"type":"hydrolysis","struct0":"h3-step0-facing","struct3":"h3-step2-facing",
    "concept": lambda s: c_generic_pair(s,"NH₂","COOH","Dipeptide → amino acids")},
  "h4-starch-maltose": {"type":"hydrolysis","struct0":"h4-step0-facing","struct3":"h4-step2-facing",
    "concept": lambda s: c_starch_chain(s)},
  "h5-cellulose-glucose": {"type":"hydrolysis","struct0":"h5-step0-facing","struct3":"h5-step2-facing",
    "concept": lambda s: c_starch_chain(s)},
  "c4-dna-strand": {"type":"condensation","struct0":"c4-step0-facing","struct3":"c4-step2-facing",
    "concept": lambda s: c_dna_chain(s, True)},
  "h6-dna-nucleotides": {"type":"hydrolysis","struct0":"h6-step0-facing","struct3":"h6-step2-facing",
    "concept": lambda s: c_dna_chain(s, False)},
}

def write_scene(rid, cfg):
    d = OUT / rid
    d.mkdir(parents=True, exist_ok=True)
    steps = {}
    for si in range(4):
        struct = s_from_dse(cfg["struct0"], si, cfg.get("struct3"))
        concept = cfg["concept"](si)
        (d / f"s{si}-struct.svg").write_text(struct, encoding="utf-8")
        (d / f"s{si}-concept.svg").write_text(concept, encoding="utf-8")
        steps[str(si)] = {
            "struct": f"./assets/ch5-scenes/{rid}/s{si}-struct.svg",
            "concept": f"./assets/ch5-scenes/{rid}/s{si}-concept.svg",
        }
    return {"water": {"count": 1, "role": "loss" if cfg["type"]=="condensation" else "gain"}, "steps": steps}

def main():
    ensure_chem()
    manifest = {"reactions": {}}
    for rid, cfg in REACTIONS.items():
        manifest["reactions"][rid] = write_scene(rid, cfg)
    MANIFEST.write_text(
        "/** Auto-generated — python3 scripts/render-ch5-scenes.py */\n"
        f"export const CH5_SCENE_MANIFEST = {json.dumps(manifest, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(REACTIONS)} reactions × 4 steps → {OUT}")

if __name__ == "__main__":
    main()

