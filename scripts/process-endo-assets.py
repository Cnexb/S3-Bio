#!/usr/bin/env python3
"""Remove white backgrounds from endosymbiotic component images."""

from pathlib import Path
from PIL import Image

SRC = Path("/Users/jyleung/.cursor/projects/Users-jyleung-Cursor-S3-Bio/assets")
OUT = Path("/Users/jyleung/Cursor/S3 Bio/public/osmosis/assets/endosymbiotic")

MAPPING = {
    "1_proto_eukaryote_cell-bc0490ac-ce53-4453-b521-04e8f1bcfed3.png": "proto-eukaryote.png",
    "2_nucleus_er_complex-4e4156e2-7f71-4939-a972-096678b60e99.png": "nucleus-er.png",
    "3_aerobic_bacterium-35189cd9-483a-4fc4-b7a5-79693279cdcd.png": "aerobic-bacterium.png",
    "4_photosynthetic_bacterium-948db549-0e6f-4042-910e-3269b7f136b2.png": "photosynthetic-bacterium.png",
    "5_heterotrophic_eukaryotic_cell-265c785e-e6d2-40f2-aa55-0d1f912f6cd5.png": "heterotrophic-cell.png",
    "6_photosynthetic_eukaryotic_cell-44b2f133-2763-4445-ae53-ae8b4a552bcd.png": "photosynthetic-cell.png",
    "7_mitochondrion_organelle-c24eae2d-68c8-47ff-8bb9-bf403553a21c.png": "mitochondrion.png",
    "8_chloroplast_organelle-8ad7ea66-3716-409f-91d1-1774f49d5175.png": "chloroplast.png",
}


def remove_white(src: Path, dst: Path, threshold: int = 242) -> None:
    img = Image.open(src).convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                px[x, y] = (r, g, b, 0)
    img.save(dst, "PNG", optimize=True)
    print(f"  {dst.name} ({w}x{h})")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src_name, dst_name in MAPPING.items():
        src = SRC / src_name
        if not src.exists():
            raise FileNotFoundError(src)
        print(f"Processing {src_name} -> {dst_name}")
        remove_white(src, OUT / dst_name)


if __name__ == "__main__":
    main()
