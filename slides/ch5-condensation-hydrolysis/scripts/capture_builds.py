#!/usr/bin/env python3
"""
Capture PowerPoint build-step frames via slideshow automation (macOS + Microsoft PowerPoint).

Each animated slide exports slide-NN-00.png (initial), slide-NN-01.png (after click 1), …
Requires Accessibility permission for Terminal/Cursor to control PowerPoint.
"""

from __future__ import annotations

import re
import subprocess
import sys
import time
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
PPTX = Path("/Users/jyleung/Downloads/Ch5_Food_condensation_and_hydrolysis.pptx")
OUT = Path(__file__).resolve().parent.parent / "public" / "media" / "builds"


def click_count(xml_bytes: bytes) -> int:
    root = ET.fromstring(xml_bytes)
    timing = root.find(f".//{P}timing")
    if timing is None:
        return 0
    return sum(1 for ctn in timing.iter(f"{P}cTn") if ctn.get("nodeType") == "clickEffect")


def slide_click_meta(pptx: Path) -> dict[int, int]:
    meta: dict[int, int] = {}
    with zipfile.ZipFile(pptx) as z:
        for name in z.namelist():
            m = re.match(r"ppt/slides/slide(\d+)\.xml$", name)
            if m:
                meta[int(m.group(1))] = click_count(z.read(name))
    return meta


def run_applescript(script: str, timeout: int = 30) -> str:
    r = subprocess.run(["osascript", "-e", script], capture_output=True, text=True, timeout=timeout)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip() or r.stdout.strip())
    return r.stdout.strip()


def capture_slide_builds(slide_idx: int, clicks: int, out_dir: Path) -> None:
    """Capture initial + each build step for one slide."""
    out_dir.mkdir(parents=True, exist_ok=True)
    prefix = out_dir / f"slide-{slide_idx:02d}"

    # Go to slide and start slideshow in window from that slide
    setup = f'''
tell application "Microsoft PowerPoint"
    activate
    set pres to active presentation
    tell slide show settings of pres
        set starting slide to {slide_idx}
        set advance mode to slide show advance mode manual advance
        set show type to slide show type slide show window
        run slide show
    end tell
end tell
'''
    run_applescript(setup, timeout=60)
    time.sleep(1.5)

    for step in range(clicks + 1):
        out_path = f"{prefix}-{step:02d}.png"
        # Capture front PowerPoint window
        subprocess.run(
            ["screencapture", "-x", "-o", "-l", get_ppt_window_id(), out_path],
            check=False,
        )
        if step < clicks:
            # Advance build or next animation click
            run_applescript(
                'tell application "System Events" to key code 49'  # space
            )
            time.sleep(0.6)

    run_applescript('tell application "Microsoft PowerPoint" to tell slide show window of active presentation to exit slide show')


def get_ppt_window_id() -> str:
    script = '''
tell application "System Events"
    tell process "Microsoft PowerPoint"
        set frontmost to true
        return id of front window
    end tell
end tell
'''
    return run_applescript(script)


def main() -> None:
    only = int(sys.argv[1]) if len(sys.argv) > 1 else None
    meta = slide_click_meta(PPTX)

    # Ensure presentation is open
    run_applescript(f'''
tell application "Microsoft PowerPoint"
    activate
    try
        set pres to active presentation
    on error
        open POSIX file "{PPTX}"
        delay 4
    end try
end tell
''', timeout=90)

    for idx, clicks in sorted(meta.items()):
        if clicks <= 0:
            continue
        if only is not None and idx != only:
            continue
        print(f"Capturing slide {idx} ({clicks} clicks)…")
        try:
            capture_slide_builds(idx, clicks, OUT)
        except Exception as e:
            print(f"  failed: {e}")

    print(f"Done → {OUT}")


if __name__ == "__main__":
    main()
