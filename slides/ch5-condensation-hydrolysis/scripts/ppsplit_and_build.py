#!/usr/bin/env python3
"""Run PPspliT on the Ch5 deck via Microsoft PowerPoint (macOS), then rebuild Slidev."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

PPTX = Path("/Users/jyleung/Downloads/Ch5_Food_condensation_and_hydrolysis.pptx")
DECK = Path(__file__).resolve().parent.parent
OUT_PPTX = DECK / "public" / "render-test" / "Ch5_condensation_and_hydrolysis_ppsplit.pptx"
OUT_PDF = DECK / "public" / "render-test" / "deck-ppsplit.pdf"
PPAM = Path.home() / "Library/Group Containers/UBF8T346G9.Office/User Content.localized/Startup.localized/PowerPoint/PPspliT.ppam"
BUNDLED_PPAM = Path(__file__).resolve().parent / "PPspliT.ppam"


def ensure_ppam() -> None:
    if PPAM.exists():
        return
    if not BUNDLED_PPAM.exists():
        raise FileNotFoundError("PPspliT.ppam missing — download from github.com/maxonthegit/PPspliT")
    PPAM.parent.mkdir(parents=True, exist_ok=True)
    PPAM.write_bytes(BUNDLED_PPAM.read_bytes())


def run_ppsplit() -> tuple[int, int]:
    ensure_ppam()
    script = f'''
tell application "Microsoft PowerPoint"
	activate
	try
		open POSIX file "{PPAM}"
		delay 1
	end try
	open POSIX file "{PPTX}"
	delay 4
	set beforeCount to count of slides of active presentation
	run VB macro macro name "PPspliT_main"
	delay 8
	set afterCount to count of slides of active presentation
	set outPptx to POSIX file "{OUT_PPTX}"
	save active presentation in outPptx
	delay 1
	set outPdf to POSIX file "{OUT_PDF}"
	save active presentation in outPdf as save as PDF
	return beforeCount & "," & afterCount
end tell
'''
    out = subprocess.run(["osascript", "-e", script], capture_output=True, text=True, timeout=600, check=True)
    before, after = out.stdout.strip().split(",")
    return int(before), int(after)


def main() -> None:
    print("Running PPspliT (split animations at each click)…")
    before, after = run_ppsplit()
    print(f"  {before} slides → {after} slides")
    print(f"  Saved: {OUT_PPTX}")
    print(f"  PDF:   {OUT_PDF}")
    print("Rebuilding Slidev deck…")
    subprocess.run([sys.executable, str(DECK / "scripts" / "build_deck.py"), "--ppsplit"], check=True)


if __name__ == "__main__":
    main()
