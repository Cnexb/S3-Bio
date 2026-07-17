#!/usr/bin/env python3
"""Insert Ch5 bright-theme interactive animation steps into deck-pages.json."""

from __future__ import annotations

import json
import re
from pathlib import Path

DECK_ROOT = Path(__file__).resolve().parent.parent

INSERTED_MALTOSE = "1a. Maltose condensation · bright"
INSERTED_MALTOSE_HYDRO = "1b. Maltose hydrolysis · bright"
INSERTED_SCENARIO_1 = "Scenario 1 — glucose → maltose"
INSERTED_SCENARIO_2 = "Scenario 2 — maltose → glucose"
INSERTED_SCENARIO_3 = "Scenario 3 — glycerol + 3 fatty acids → triglyceride"
INSERTED_SCENARIO_4 = "Scenario 4 — triglyceride → glycerol + 3 fatty acids"
INSERTED_SCENARIO_5 = "Scenario 5 — amino acids → dipeptide"
INSERTED_SCENARIO_6 = "Scenario 6 — dipeptide → amino acids"
INSERTED_STARCH_HYDRO = "1c. Starch hydrolysis · bright"
INSERTED_CELLULOSE_HYDRO = "1d. Cellulose hydrolysis · bright"
INSERTED_SCENARIO_7 = "Scenario 7 — starch → maltose"
INSERTED_SCENARIO_8 = "Scenario 8 — cellulose → glucose"
INSERTED_WORKSHEET = "Hydrolysis & Condensation · Worksheet"
INSERTED_LIPIDS_TRIGLYCERIDES = "Lipids · Triglycerides worksheet"
INSERTED_LIPIDS_TRIGLYCERIDES_COPY = "Lipids · Triglycerides worksheet (copy)"
LIPIDS_TRIG_SOURCE = DECK_ROOT / "scripts" / "assets" / "lipids-triglycerides-source.png"
LIPIDS_TRIG_DIAGRAM = "lipids-triglyceride-diagram.png"
INSERTED_CARB_MALTOSE_WORKSHEET = "Carbohydrates · Maltose worksheet"
CARB_MALTOSE_WORKSHEET_FRAME = "/media/slides/slide-255.png"
CARB_MALTOSE_SOURCE = DECK_ROOT / "scripts" / "assets" / "carbohydrates-maltose-source.png"
INSERTED_POLYPEPTIDE_VS_PROTEIN_BASE = "Polypeptide vs Protein"
INSERTED_POLYPEPTIDE_VS_PROTEIN_P82 = (
    f"{INSERTED_POLYPEPTIDE_VS_PROTEIN_BASE} (copy after p.82)"
)
INSERTED_POLYPEPTIDE_VS_PROTEIN_P86 = (
    f"{INSERTED_POLYPEPTIDE_VS_PROTEIN_BASE} (copy after p.86 step 2)"
)
POLYPEPTIDE_VS_PROTEIN_LABELS = {
    INSERTED_POLYPEPTIDE_VS_PROTEIN_P82,
    INSERTED_POLYPEPTIDE_VS_PROTEIN_P86,
}
POLYPEPTIDE_VS_PROTEIN_FRAME = "/media/slides/slide-256.png"
POLYPEPTIDE_VS_PROTEIN_SOURCE = (
    DECK_ROOT / "scripts" / "assets" / "polypeptide-vs-protein-source.png"
)
INSERTED_POLYPEPTIDE_WORKSHEET = "Polypeptide · Condensation & Hydrolysis worksheet"
INSERTED_POLYPEPTIDE_WORKSHEET_P1 = (
    "Polypeptide · Condensation & Hydrolysis worksheet (part 1)"
)
INSERTED_POLYPEPTIDE_WORKSHEET_P2 = (
    "Polypeptide · Condensation & Hydrolysis worksheet (part 2)"
)
POLYPEPTIDE_WORKSHEET_LABELS = {
    INSERTED_POLYPEPTIDE_WORKSHEET,
    INSERTED_POLYPEPTIDE_WORKSHEET_P1,
    INSERTED_POLYPEPTIDE_WORKSHEET_P2,
}
POLYPEPTIDE_WORKSHEET_SOURCE = (
    DECK_ROOT / "scripts" / "assets" / "polypeptide-condensation-hydrolysis-source.png"
)
POLYPEPTIDE_CHAIN_DIAGRAM = "polypeptide-chain-diagram.png"
INSERTED_DENATURATION_NATIVE = "Protein denaturation · native to denatured"
INSERTED_DENATURATION_CAUSES = "Denaturation · causes"
INSERTED_DENATURATION_LOCK_KEY = "Denaturation · lock and key"
DENATURATION_INSERTED_LABELS = {
    INSERTED_DENATURATION_NATIVE,
    INSERTED_DENATURATION_CAUSES,
    INSERTED_DENATURATION_LOCK_KEY,
}
DENATURATION_NATIVE_FRAME = "/media/slides/slide-257.png"
DENATURATION_CAUSES_FRAME = "/media/slides/slide-258.png"
DENATURATION_LOCK_KEY_FRAME = "/media/slides/slide-259.png"
DENATURATION_NATIVE_SOURCE = (
    DECK_ROOT / "scripts" / "assets" / "denaturation-native-source.png"
)
DENATURATION_CAUSES_SOURCE = (
    DECK_ROOT / "scripts" / "assets" / "denaturation-causes-source.png"
)
DENATURATION_LOCK_KEY_SOURCE = (
    DECK_ROOT / "scripts" / "assets" / "denaturation-lock-key-source.png"
)
POLYPEPTIDE_SINGLE_FRAME = "/media/slides/slide-241.png"
SUBOPTIMAL_STEP2_FRAME = "/media/slides/slide-250.png"
SUBOPTIMAL_TAIL_FRAME = "/media/slides/slide-251.png"
BASICS_CARB_PREFIX = "Basic-carbohydrates ·"
INSERTED_BASICS_CARB_HEADER = f"{BASICS_CARB_PREFIX} Concept Checks"
INSERTED_BASICS_CARB_TF = f"{BASICS_CARB_PREFIX} T/F"
INSERTED_BASICS_CARB_FILL = f"{BASICS_CARB_PREFIX} Fill in the Blanks"
BASICS_LIPID_PREFIX = "Basic-Lipid ·"
INSERTED_BASICS_LIPID_HEADER = f"{BASICS_LIPID_PREFIX} Concept Checks"
INSERTED_BASICS_LIPID_TF = f"{BASICS_LIPID_PREFIX} T/F"
INSERTED_BASICS_LIPID_FILL = f"{BASICS_LIPID_PREFIX} Fill in the Blanks"
BASICS_PROTEIN_PREFIX = "Basic-Protein ·"
INSERTED_BASICS_PROTEIN_HEADER = f"{BASICS_PROTEIN_PREFIX} Concept Checks"
INSERTED_BASICS_PROTEIN_TF = f"{BASICS_PROTEIN_PREFIX} T/F"
INSERTED_BASICS_PROTEIN_FILL = f"{BASICS_PROTEIN_PREFIX} Fill in the Blanks"
INSERTED_FILL2_1_5 = "Fill in the Blanks 2 · 1–5"
INSERTED_FILL2_6_10 = "Fill in the Blanks 2 · 6–10"
INSERTED_FILL2_11_15 = "Fill in the Blanks 2 · 11–15"
FURTHER_DETAILS_HEADER = "Further Details"
FURTHER_CARB_TABLE = "Carbohydrates — names & functions"
INSERTED_CARB_TABLE_COPY_P13 = f"{FURTHER_CARB_TABLE} (copy after p.13 step 5)"
LEGACY_CARB_TABLE_COPY_P14 = f"{FURTHER_CARB_TABLE} (copy after p.14 step 5)"
INSERTED_CARB_TABLE_COPY_P22 = f"{FURTHER_CARB_TABLE} (copy after p.22 step 5)"
LEGACY_CARB_TABLE_COPY_P21 = f"{FURTHER_CARB_TABLE} (copy after p.21 step 5)"
INSERTED_CARB_TABLE_COPY_P27 = f"{FURTHER_CARB_TABLE} (copy after p.27 step 5)"
CARB_TABLE_COPY_LABELS = {
    INSERTED_CARB_TABLE_COPY_P13,
    LEGACY_CARB_TABLE_COPY_P14,
    LEGACY_CARB_TABLE_COPY_P21,
    INSERTED_CARB_TABLE_COPY_P22,
    INSERTED_CARB_TABLE_COPY_P27,
}
FURTHER_LIPID_TABLE = "Lipids — names & functions"
FURTHER_PROTEIN_TABLE = "Proteins — names & functions"
INSERTED_PROTEIN_TABLE_COPY_P14 = f"{FURTHER_PROTEIN_TABLE} (copy after p.14 step 5)"
INSERTED_PROTEIN_TABLE_COPY_P21 = f"{FURTHER_PROTEIN_TABLE} (copy after p.21 step 5)"
INSERTED_PROTEIN_TABLE_COPY_P27 = f"{FURTHER_PROTEIN_TABLE} (copy after p.27 step 5)"
INSERTED_PROTEIN_TABLE_COPY_P86 = f"{FURTHER_PROTEIN_TABLE} (copy after p.86)"
PROTEIN_TABLE_COPY_LABELS = {
    INSERTED_PROTEIN_TABLE_COPY_P14,
    INSERTED_PROTEIN_TABLE_COPY_P21,
    INSERTED_PROTEIN_TABLE_COPY_P27,
    INSERTED_PROTEIN_TABLE_COPY_P86,
}
TABLE_COPY_LABELS = CARB_TABLE_COPY_LABELS | PROTEIN_TABLE_COPY_LABELS
FUNCTIONS_NAMES_PREFIX = "Functions & Names ·"
INSERTED_FUNCTIONS_FILL_1_5 = f"{FUNCTIONS_NAMES_PREFIX} Fill in the Blanks 1–5"
INSERTED_FUNCTIONS_FILL_6_10 = f"{FUNCTIONS_NAMES_PREFIX} Fill in the Blanks 6–10"
INSERTED_FUNCTIONS_FILL_11_15 = f"{FUNCTIONS_NAMES_PREFIX} Fill in the Blanks 11–15"
ALL_FILL_PAGE_LABELS: tuple[str, ...] = (
    INSERTED_FUNCTIONS_FILL_1_5,
    INSERTED_FUNCTIONS_FILL_6_10,
    INSERTED_FUNCTIONS_FILL_11_15,
    INSERTED_FILL2_1_5,
    INSERTED_FILL2_6_10,
    INSERTED_FILL2_11_15,
    # Legacy mid-deck labels (stripped if still present from older decks)
    INSERTED_BASICS_CARB_FILL,
    INSERTED_BASICS_LIPID_FILL,
    INSERTED_BASICS_PROTEIN_FILL,
)
INSERTED_FUNCTIONS_NAMES_HEADER = "Concept Checks — Functions & Names"
ANSWER_KEY_BASICS_MCQ = "Answer Key — Basics MCQs"
ANSWER_KEY_BASICS_TF_FILL = "Answer Key — Basics T/F & Fill"
ANSWER_KEY_FUNCTIONS_MCQ = "Answer Key — Functions MCQs"
ANSWER_KEY_FUNCTIONS_TF_FILL = "Answer Key — Functions T/F & Fill"
INSERTED_END_SLIDE = "完 · Ch 5 Food and Human"
FILL2_PAGE_LABELS = {
    INSERTED_FILL2_1_5,
    INSERTED_FILL2_6_10,
    INSERTED_FILL2_11_15,
}
FURTHER_SKIP_LABELS = {
    FURTHER_DETAILS_HEADER,
    FURTHER_CARB_TABLE,
    FURTHER_LIPID_TABLE,
    FURTHER_PROTEIN_TABLE,
    INSERTED_FUNCTIONS_NAMES_HEADER,
    ANSWER_KEY_BASICS_MCQ,
    ANSWER_KEY_BASICS_TF_FILL,
    ANSWER_KEY_FUNCTIONS_MCQ,
    ANSWER_KEY_FUNCTIONS_TF_FILL,
    INSERTED_END_SLIDE,
    *FILL2_PAGE_LABELS,
}
DIPEPTIDE_LABEL = "Dipeptide ( 二肽 )"
LIPIDS_ANCHOR_LABEL = "2. Lipids 脂質"
CARBS_END_LABEL = "1. Carbohydrates 碳水化合物"
CARBS_END_FRAME = "/media/slides/slide-151.png"
CARBS_MERGE_HEAD_FRAME = "/media/slides/slide-146.png"
CARBS_MERGE_STEP5_FRAME = "/media/slides/slide-150.png"
CARBS_MOVED_FROM = f"{CARBS_END_LABEL} last step"
SUBOPTIMAL_PH_LABEL = "Suboptimal pH and temperature denature proteins"
CH5FH_ASSETS = (
    DECK_ROOT.parents[1]
    / "public"
    / "osmosis"
    / "slides"
    / "embed"
    / "ch5fh-assets"
)
FATTY_ACIDS_PLUS_LABEL = "+ 2 Fatty acids ( 脂肪酸 )"
FATTY_ACID_LABEL = "Fatty acid ( 脂肪酸 )"
DROP_FATTY_ACID_STEPS_1_4 = {
    "/media/slides/slide-153.png",
    "/media/slides/slide-154.png",
    "/media/slides/slide-155.png",
    "/media/slides/slide-156.png",
}
AMINO_ACIDS_LABEL = "Amino acids ( 胺基酸 )"
DROP_AMINO_STEPS_4_8 = {
    "/media/slides/slide-187.png",
    "/media/slides/slide-188.png",
    "/media/slides/slide-189.png",
    "/media/slides/slide-190.png",
    "/media/slides/slide-191.png",
}
INSERTED_TRIGLYCERIDE = "2a. Triglyceride condensation · glycerol + 3 fatty acids"
INSERTED_PROTEIN_FOLD = "Protein folding · bright"
POLYPEPTIDE_LABEL = "Polypeptide ( 多肽 ) Chain"
POLYPEPTIDE_2AA_SUFFIX = " · 2AA → dipeptide"
POLYPEPTIDE_ANIM_STEPS = 12  # ch5-play HUD p.42 step 12 = last dipeptide anim frame
CONFORMATION_LABEL = "3D conformation determine protein functions"
NUTRITION_LABEL = "炸雞餐營養需要 · 碳水／脂質／蛋白質"
NUTRITION_FRAME = "/media/slides/slide-090.png"
MONO_LABEL = "Mono-saccharides ( 單醣 )"
MONO_HEAD_FRAMES = [f"/media/slides/slide-{n:03d}.png" for n in range(85, 90)]
MONO_TAIL_FRAMES = [f"/media/slides/slide-{n:03d}.png" for n in (91, 92, 93)]
DROP_MONO_094 = "/media/slides/slide-094.png"
DROP_DI_HEAD = {
    "/media/slides/slide-095.png",
    "/media/slides/slide-096.png",
    "/media/slides/slide-097.png",
}
DI_LABEL = "Di saccharides ( 雙醣 )"
DI_STEP5_FRAME = "/media/slides/slide-102.png"
DI_TAIL_START_FRAME = "/media/slides/slide-103.png"
MONOSACCHARIDES_LABEL = "Monosaccharides ( 單醣 )"
POLY_LABEL = "Poly saccharides ( 多醣 )"
POLY_EARLY_HEAD_FRAME = "/media/slides/slide-114.png"
POLY_EARLY_STEPS_1_4_FRAMES = [
    f"/media/slides/slide-{n:03d}.png" for n in range(114, 118)
]
POLY_EARLY_STEP4_FRAME = POLY_EARLY_STEPS_1_4_FRAMES[-1]
POLY_EARLY_STEP5_FRAME = "/media/slides/slide-118.png"
POLY_EARLY_TAIL_START = "/media/slides/slide-119.png"
POLY_EARLY_TAIL_END = "/media/slides/slide-136.png"
POLY_STARCH_STEP5_FRAME = "/media/slides/slide-141.png"
SLIDE_119 = "/media/slides/slide-119.png"
SLIDE_120 = "/media/slides/slide-120.png"
SLIDE_149 = "/media/slides/slide-149.png"
STARCH_ANCHOR_FRAME = "/media/slides/slide-142.png"  # Starch red-ring page (137…145)
MALTOSE_TEXT = "Maltose 麥芽糖"
TRIGLYCERIDE_TEXT = "Triglycerides ( 甘油三酯 )"
SLIDES_DIR = DECK_ROOT / "public" / "media" / "slides"
O_REF_NUM = 96
O_PATCH_XYWH = (1077, 18, 122, 122)
O_FIX_NUMS = ()  # hydrolysis PNGs 85–89 must not get legend O restored
FLOATING_O_REMOVE_NUMS = (85, 86, 87, 88, 89)  # ch5-play p.12 steps 1–5
FH_EMBED = "./embed/ch5fh-assets"
SCENARIO_IMG = f"{FH_EMBED}/image3.jpeg"
SCENARIO3_IMG = f"{FH_EMBED}/image4.png"
SCENARIO5_IMG = f"{FH_EMBED}/image5.jpeg"
SCENARIO7_IMG = f"{FH_EMBED}/image6.png"
WORKSHEET_IMG = f"{FH_EMBED}/scenario-worksheet"
SCENARIO8_IMG = f"{FH_EMBED}/image7.png"
ORGANIC_BONDS_LABEL = "Organic = C-H / C-C bonds"
INSERTED_ORG_INORG_TABLE = "Organic & inorganic molecules"
ORG_INORG_TABLE_IMG = f"{FH_EMBED}/organic-inorganic-table.png"
CARBS_INTRO_LABEL = "1. Carbohydrates 碳水化合物"
CARBS_INTRO_HEAD_FRAME = "/media/slides/slide-005.png"
DROP_PAGE4_FRAMES = {
    "/media/slides/slide-012.png",
    "/media/slides/slide-013.png",
    "/media/slides/slide-014.png",
    *{f"/media/slides/slide-{n:03d}.png" for n in range(18, 26)},
}
CONDENSATION_INTRO_FRAME = "/media/slides/slide-026.png"
DIMER_MER_O_FRAMES = [f"/media/slides/slide-{n:03d}.png" for n in range(27, 31)]
DIMER_MER_O_LABEL = "Di ( 二 ) - mer o"
POLY_MER_O_LABEL = "Poly ( 多 ) - mer o"
POLY_MER_O_HEAD_FRAME = "/media/slides/slide-031.png"
DROP_POLY_MER_O_HEAD = {
    f"/media/slides/slide-{n:03d}.png" for n in (31, 32, 33)
}
NPS_LABEL_REF_NUM = 11
NPS_LABEL_PATCH_XYWH = (1218, 169, 559, 40)
NPS_LABEL_DARK_THRESHOLD = 5000  # full Nitrogen+Phosphorus+Sulfur row from slide-011
# ch5-play HUD p.5 steps 1–6 (Poly-mer-o organic-biomolecule table)
NPS_LABEL_FIX_NUMS_HUD_P5 = (34, 35, 36, 37, 38, 39)
# ch5-play HUD p.4 steps 8–10 (Carbohydrates intro tail)
NPS_LABEL_FIX_NUMS_HUD_P4_TAIL = (15, 16, 17)
NPS_LABEL_FIX_NUMS = NPS_LABEL_FIX_NUMS_HUD_P5 + NPS_LABEL_FIX_NUMS_HUD_P4_TAIL


def anim_frame(embed: str, steps: int) -> list[dict]:
    return [{"type": "animation", "embed": embed, "step": i} for i in range(steps)]


def png_frame(path: str) -> dict:
    return {"type": "image", "src": path}


def page_dict(
    page: int,
    label: str,
    frames: list[dict],
    *,
    thumb: str | None = None,
    inserted: bool = False,
) -> dict:
    clicks = max(0, len(frames) - 1)
    flat = []
    for fr in frames:
        if fr["type"] == "image":
            flat.append(fr["src"])
        else:
            flat.append(f"anim:{fr['embed']}:{fr.get('step', 0)}")
    thumb_src = thumb
    if not thumb_src:
        for fr in frames:
            if fr["type"] == "image":
                thumb_src = fr["src"]
                break
            if fr["type"] == "animation":
                thumb_src = f"anim:{fr['embed']}"
                break
    return {
        "page": page,
        "label": label,
        "frames": flat,
        "frameMeta": frames,
        "clicks": clicks,
        "thumb": thumb_src,
        "inserted": inserted,
    }


def strip_inserted_pages(pages: list[dict]) -> list[dict]:
    skip = {
        INSERTED_MALTOSE,
        INSERTED_MALTOSE_HYDRO,
        INSERTED_SCENARIO_1,
        INSERTED_SCENARIO_2,
        INSERTED_SCENARIO_3,
        INSERTED_SCENARIO_4,
        INSERTED_SCENARIO_5,
        INSERTED_SCENARIO_6,
        INSERTED_STARCH_HYDRO,
        INSERTED_CELLULOSE_HYDRO,
        INSERTED_SCENARIO_7,
        INSERTED_SCENARIO_8,
        INSERTED_WORKSHEET,
        INSERTED_LIPIDS_TRIGLYCERIDES,
        INSERTED_LIPIDS_TRIGLYCERIDES_COPY,
        INSERTED_CARB_MALTOSE_WORKSHEET,
        *POLYPEPTIDE_WORKSHEET_LABELS,
        INSERTED_TRIGLYCERIDE,
        INSERTED_PROTEIN_FOLD,
        NUTRITION_LABEL,
        INSERTED_ORG_INORG_TABLE,
        *POLYPEPTIDE_VS_PROTEIN_LABELS,
        *DENATURATION_INSERTED_LABELS,
    }
    return [
        p
        for p in pages
        if p.get("label") not in skip
        and not p.get("label", "").startswith(BASICS_CARB_PREFIX)
        and not p.get("label", "").startswith(BASICS_LIPID_PREFIX)
        and not p.get("label", "").startswith(BASICS_PROTEIN_PREFIX)
        and p.get("label") not in FURTHER_SKIP_LABELS
        and not p.get("label", "").startswith(FUNCTIONS_NAMES_PREFIX)
        and p.get("label") not in TABLE_COPY_LABELS
        and p.get("movedFrom") != CARBS_MOVED_FROM
    ]


def remove_nutrition_frame(pages: list[dict]) -> list[dict]:
    """Pull slide-090 out of Mono-saccharides (p.12 step 6) or any other page."""
    for p in pages:
        frames = p.get("frames", [])
        if NUTRITION_FRAME not in frames:
            continue
        p["frames"] = [f for f in frames if f != NUTRITION_FRAME]
        p["clicks"] = max(0, len(p["frames"]) - 1)
        if "frameMeta" in p:
            p["frameMeta"] = [
                m for m in p["frameMeta"] if m.get("src") != NUTRITION_FRAME
            ]
    return pages


def append_nutrition_page(pages: list[dict]) -> list[dict]:
    if any(p.get("label") == NUTRITION_LABEL for p in pages):
        return pages
    pages.append(
        {
            "page": 0,
            "label": NUTRITION_LABEL,
            "startFrame": 90,
            "endFrame": 90,
            "frames": [NUTRITION_FRAME],
            "clicks": 0,
            "thumb": NUTRITION_FRAME,
            "movedFrom": f"{MONO_LABEL} step 6",
        }
    )
    for i, p in enumerate(pages, start=1):
        p["page"] = i
    return pages


def rich_page(
    label: str,
    html: str,
    *,
    thumb: str | None = None,
    thumb_ph: str | None = None,
    center: bool = False,
    scroll: bool = False,
    phases: str | None = None,
) -> dict:
    page = {
        "page": 0,
        "label": label,
        "type": "rich",
        "html": html,
        "thumb": thumb,
        "thumbPh": thumb_ph,
        "inserted": True,
    }
    if center:
        page["center"] = True
    if scroll:
        page["scroll"] = True
    if phases:
        page["phases"] = phases
    return page


def make_scenario_pages() -> tuple[dict, dict]:
    s1 = rich_page(
        INSERTED_SCENARIO_1,
        f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">Scenario 1</h2><div class="deck-slide__body"><div class="layout-fig-top"><div class="layout-fig-top__media"><figure class="fig-box fig-wide step step-pic"><img src="{SCENARIO_IMG}" alt="Two glucose to maltose"/></figure></div><div class="layout-fig-top__text"><p class="deck-text step step-text"><strong>Scenario 1.</strong> Two glucoses (葡萄糖) combine to form one maltose (麥芽糖)</p><p class="deck-text-sm step step-text">Condensation / Hydrolysis: ______ · Water: Gain / Loss</p><p class="deck-text step step-ans"><span class="ans-green">Condensation / Hydrolysis: Condensation · Water: Loss (1)</span></p></div></div></div></div>""",
        thumb=SCENARIO_IMG,
    )
    s2 = rich_page(
        INSERTED_SCENARIO_2,
        """<div class="deck-slide__inner"><h2 class="deck-slide__title">Scenario 2</h2><div class="deck-slide__body"><p class="deck-text step step-text"><strong>Scenario 2.</strong> One maltose (麥芽糖) breaks down into two glucose molecules (葡萄糖)</p><p class="deck-text-sm step step-text">Condensation / Hydrolysis: ______ · Water: Gain / Loss</p><p class="deck-text step step-ans"><span class="ans-green">Condensation / Hydrolysis: Hydrolysis · Water: Gain (1)</span></p></div></div>""",
        thumb_ph="S2",
    )
    return s1, s2


def make_scenario_3_page() -> dict:
    return rich_page(
        INSERTED_SCENARIO_3,
        f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">Scenario 3</h2><div class="deck-slide__body"><div class="layout-fig-top"><div class="layout-fig-top__media"><figure class="fig-box fig-wide step step-pic"><img src="{SCENARIO3_IMG}" alt="Glycerol and fatty acids to triglyceride"/></figure></div><div class="layout-fig-top__text"><p class="deck-text step step-text"><strong>Scenario 3.</strong> One glycerol (甘油) combines with three fatty acids (脂肪酸) to form a triglyceride (甘油三酯)</p><p class="deck-text-sm step step-text">Condensation / Hydrolysis: ______ · Water: Gain / Loss</p><p class="deck-text step step-ans"><span class="ans-green">Condensation / Hydrolysis: Condensation · Water: Loss (3)</span></p></div></div></div></div>""",
        thumb=SCENARIO3_IMG,
    )


def make_scenario_45_pages() -> tuple[dict, dict]:
    s4 = rich_page(
        INSERTED_SCENARIO_4,
        """<div class="deck-slide__inner"><h2 class="deck-slide__title">Scenario 4</h2><div class="deck-slide__body"><p class="deck-text step step-text"><strong>Scenario 4.</strong> A triglyceride (甘油三酯) breaks down into one glycerol (甘油) and three fatty acids (脂肪酸)</p><p class="deck-text-sm step step-text">Condensation / Hydrolysis: ______ · Water: Gain / Loss</p><p class="deck-text step step-ans"><span class="ans-green">Condensation / Hydrolysis: Hydrolysis · Water: Gain (3)</span></p></div></div>""",
        thumb_ph="S4",
    )
    s5 = rich_page(
        INSERTED_SCENARIO_5,
        f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">Scenario 5</h2><div class="deck-slide__body"><div class="layout-fig-top"><div class="layout-fig-top__media"><figure class="fig-box fig-wide step step-pic"><img src="{SCENARIO5_IMG}" alt="Amino acids to dipeptide"/></figure></div><div class="layout-fig-top__text"><p class="deck-text step step-text"><strong>Scenario 5.</strong> Amino acids (氨基酸) combine to form a dipeptide (二肽)</p><p class="deck-text-sm step step-text">Condensation / Hydrolysis: ______ · Water: Gain / Loss</p><p class="deck-text step step-ans"><span class="ans-green">Condensation / Hydrolysis: Condensation · Water: Loss (1)</span></p></div></div></div></div>""",
        thumb=SCENARIO5_IMG,
    )
    return s4, s5


def make_scenario_6_page() -> dict:
    return rich_page(
        INSERTED_SCENARIO_6,
        """<div class="deck-slide__inner"><h2 class="deck-slide__title">Scenario 6</h2><div class="deck-slide__body"><p class="deck-text step step-text"><strong>Scenario 6.</strong> A dipeptide (二肽) breaks down into two amino acids (氨基酸)</p><p class="deck-text-sm step step-text">Condensation / Hydrolysis: ______ · Water: Gain / Loss</p><p class="deck-text step step-ans"><span class="ans-green">Condensation / Hydrolysis: Hydrolysis · Water: Gain (1)</span></p></div></div>""",
        thumb_ph="S6",
    )


def make_scenario_78_pages() -> tuple[dict, dict]:
    s7 = rich_page(
        INSERTED_SCENARIO_7,
        f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">Scenario 7</h2><div class="deck-slide__body"><div class="layout-fig-top"><div class="layout-fig-top__media"><figure class="fig-box fig-wide step step-pic"><img src="{SCENARIO7_IMG}" alt="Starch to maltose"/></figure></div><div class="layout-fig-top__text"><p class="deck-text step step-text"><strong>Scenario 7.</strong> Starch (澱粉) breaks down into maltose (麥芽糖) molecules</p><p class="deck-text-sm step step-text">Condensation / Hydrolysis: ______ · Water: Gain / Loss</p><p class="deck-text step step-ans"><span class="ans-green">Condensation / Hydrolysis: Hydrolysis · Water: Gain (n)</span></p></div></div></div></div>""",
        thumb=SCENARIO7_IMG,
    )
    s8 = rich_page(
        INSERTED_SCENARIO_8,
        """<div class="deck-slide__inner"><h2 class="deck-slide__title">Scenario 8</h2><div class="deck-slide__body"><p class="deck-text step step-text"><strong>Scenario 8.</strong> Cellulose (纖維素) breaks down into glucose (葡萄糖) molecules</p><p class="deck-text-sm step step-text">Condensation / Hydrolysis: ______ · Water: Gain / Loss</p><p class="deck-text step step-ans"><span class="ans-green">Condensation / Hydrolysis: Hydrolysis · Water: Gain (n)</span></p></div></div>""",
        thumb_ph="S8",
    )
    return s7, s8


def make_worksheet_page() -> dict:
    figures = "".join(
        f'<figure class="worksheet-stack__item step step-pic"><img src="{WORKSHEET_IMG}-{i}.png" alt="Worksheet part {i}"/></figure>'
        for i in range(1, 4)
    )
    page = rich_page(
        INSERTED_WORKSHEET,
        f"""<div class="deck-slide__inner deck-slide__inner--worksheet"><h2 class="deck-slide__title">Hydrolysis &amp; Condensation · Worksheet</h2><div class="deck-slide__body worksheet-stack">{figures}</div></div>""",
        thumb=f"{WORKSHEET_IMG}-1.png",
    )
    page["scroll"] = True
    return page


def _mcq_opts_html(choices: list[tuple[str, str]]) -> str:
    return "".join(
        f'<li class="mcq-opt" data-key="{key}"><strong>{key}.</strong> {text}</li>'
        for key, text in choices
    )


def _mcq_body_html(
    q_num: int,
    question: str,
    choices: list[tuple[str, str]],
    answer: str,
    *,
    img: str | None = None,
) -> str:
    opts = _mcq_opts_html(choices)
    mcq = (
        f'<div class="mcq-q"><p class="deck-text mb-2 step step-text" data-phase="q">'
        f"<strong>Q{q_num}.</strong> {question}</p>"
        f'<ul class="mcq-list deck-text mb-2 step step-text" data-phase="q">{opts}</ul>'
        f'<div class="answer-panel step hidden-answer" data-phase="a" data-answer="{answer}">'
        f'<div class="answer-badge">Answer: {answer}</div></div></div>'
    )
    if img:
        return (
            f'<div class="layout-fig-top"><div class="layout-fig-top__media">'
            f'<figure class="fig-box fig-wide step step-pic" data-phase="pic">'
            f'<img src="{img}" alt="Q{q_num}"/></figure></div>'
            f'<div class="layout-fig-top__text">{mcq}</div></div>'
        )
    return mcq


BASICS_CARB_MCQS: list[tuple[int, str, list[tuple[str, str]], str, str | None]] = [
    (1, "Which of the following is an example of a carbohydrate?", [("A", "Glucose"), ("B", "Glycerol"), ("C", "Amino acid"), ("D", "Triglyceride")], "A", None),
    (8, "What is the role of water in hydrolysis?", [("A", "It creates bonds."), ("B", "It breaks bonds."), ("C", "It forms triglycerides."), ("D", "It denatures proteins.")], "B", None),
    (9, "Which of the following foods contains carbohydrates?", [("A", "Butter"), ("B", "Rice"), ("C", "Chicken"), ("D", "Salmon")], "B", f"{FH_EMBED}/image25.jpeg"),
    (12, "Which food is rich in carbohydrates?", [("A", "Milk"), ("B", "Bread"), ("C", "Meat"), ("D", "Fish")], "B", None),
    (13, "What molecule is formed between two glucose molecules by condensation?", [("A", "Dipeptide"), ("B", "Protein"), ("C", "Starch"), ("D", "Maltose")], "D", None),
    (20, "Which of the following is NOT an organic molecule?", [("A", "Carbohydrate"), ("B", "Protein"), ("C", "Lipid"), ("D", "Water")], "D", None),
    (22, "Which reaction produces water as a by-product?", [("A", "Hydrolysis"), ("B", "Condensation"), ("C", "Denaturation"), ("D", "Oxidation")], "B", None),
    (24, "What is the stored form of carbohydrates in plants?", [("A", "Starch"), ("B", "Glycogen"), ("C", "Triglyceride"), ("D", "Protein")], "A", f"{FH_EMBED}/image28.png"),
    (25, "Which food is rich in carbohydrates?", [("A", "Avocado"), ("B", "Bread"), ("C", "Salmon"), ("D", "Butter")], "B", None),
    (26, "Which of the following is an organic biomolecule?", [("A", "Protein"), ("B", "Water"), ("C", "Oxygen"), ("D", "Carbon dioxide")], "A", None),
    (28, "Which of the following is a carbohydrate?", [("A", "Triglyceride"), ("B", "Maltose"), ("C", "Polypeptide"), ("D", "Amino acid")], "B", None),
]

BASICS_LIPID_MCQS: list[tuple[int, str, list[tuple[str, str]], str, str | None]] = [
    (2, "Which food is rich in lipids?", [("A", "Rice"), ("B", "Butter"), ("C", "Fish"), ("D", "Eggs")], "B", f"{FH_EMBED}/image22.jpeg"),
    (7, "Which of the following is a lipid molecule?", [("A", "Maltose"), ("B", "Polypeptide"), ("C", "Triglyceride"), ("D", "Amino acid")], "C", None),
    (10, "Which reaction forms a triglyceride?", [("A", "Hydrolysis"), ("B", "Condensation"), ("C", "Denaturation"), ("D", "Oxidation")], "B", None),
    (14, "Which process breaks down a triglyceride into glycerol and fatty acids?", [("A", "Condensation"), ("B", "Hydrolysis"), ("C", "Denaturation"), ("D", "Polymerization")], "B", None),
    (18, "Which of the following foods is rich in lipids?", [("A", "Apple"), ("B", "Fish"), ("C", "Rice"), ("D", "Bread")], "B", None),
    (19, "What is the main component of butter?", [("A", "Protein"), ("B", "Carbohydrate"), ("C", "Lipid"), ("D", "Amino acid")], "C", f"{FH_EMBED}/image27.png"),
]

BASICS_PROTEIN_MCQS: list[tuple[int, str, list[tuple[str, str]], str, str | None]] = [
    (3, "Which of the following processes breaks down a polypeptide into amino acids?", [("A", "Condensation"), ("B", "Hydrolysis"), ("C", "Denaturation"), ("D", "Polymerization")], "B", None),
    (4, "What is the product of condensation between two amino acids?", [("A", "Polypeptide"), ("B", "Dipeptide"), ("C", "Glucose"), ("D", "Triglyceride")], "B", None),
    (5, "Which of the following is a protein-rich food?", [("A", "Bread"), ("B", "Cheese"), ("C", "Avocado"), ("D", "Honey")], "B", f"{FH_EMBED}/image23.jpeg"),
    (6, "What happens during denaturation of a protein?", [("A", "It gains 3D conformation."), ("B", "It loses its specific shape and function."), ("C", "It forms a dipeptide."), ("D", "It undergoes hydrolysis.")], "B", f"{FH_EMBED}/image24.jpeg"),
    (11, "Which of the following is a characteristic of proteins?", [("A", "They are made of amino acids."), ("B", "Plant-based food commonly has more proteins than animal-based food."), ("C", "They are needed in small amounts."), ("D", "They are simple sugars.")], "A", None),
    (15, "What happens to a protein when it is exposed to high temperatures?", [("A", "It forms a polypeptide."), ("B", "It denatures."), ("C", "It undergoes condensation."), ("D", "It hydrolyzes.")], "B", f"{FH_EMBED}/image26.jpeg"),
    (16, "Which of the following is a protein?", [("A", "Maltose"), ("B", "Polypeptide"), ("C", "Triglyceride"), ("D", "Glucose")], "B", None),
    (17, "Which food is rich in protein?", [("A", "Butter"), ("B", "Chicken"), ("C", "Potato"), ("D", "Rice")], "B", None),
    (21, "What is the smallest unit of a protein?", [("A", "Glucose"), ("B", "Amino acid"), ("C", "Triglyceride"), ("D", "Polypeptide")], "B", None),
    (23, "What is the 3D structure of a protein called?", [("A", "Polypeptide"), ("B", "Primary structure"), ("C", "3D conformation"), ("D", "Dipeptide")], "C", None),
    (27, "What is the product of hydrolysis of a dipeptide?", [("A", "Polypeptide"), ("B", "Amino acids"), ("C", "Lipids"), ("D", "Glucose")], "B", None),
    (29, "Which food is rich in proteins?", [("A", "Chicken breast"), ("B", "Rice"), ("C", "Orange"), ("D", "Honey")], "A", None),
    (30, "What happens to the function of a protein when it denatures?", [("A", "It becomes more efficient."), ("B", "It loses its specific function."), ("C", "It forms amino acids."), ("D", "It produces glucose.")], "B", f"{FH_EMBED}/image30.jpeg"),
]

BASICS_CARB_TF: list[tuple[int, str, str]] = [
    (1, "Hydrolysis breaks bonds in molecules.", "✔ True 正確"),
    (6, "Carbohydrates provide energy for the body.", "✔ True 正確"),
    (9, "Hydrolysis requires water to break bonds.", "✔ True 正確"),
    (11, "Condensation produces water as a by-product.", "✔ True 正確"),
    (13, "Starch is a form of stored glucose in plants.", "✔ True 正確"),
]

BASICS_LIPID_TF: list[tuple[int, str, str]] = [
    (4, "Lipids are hydrophilic molecules.", "✘ False 錯誤 — Lipids are hydrophobic"),
    (5, "Triglycerides are formed by condensation reactions.", "✔ True 正確"),
    (8, "Butter is rich in carbohydrates.", "✘ False 錯誤 — Butter is rich in lipids"),
    (10, "Lipids are used to form cell membranes.", "✔ True 正確"),
    (14, "Triglycerides are broken down into glycerol and fatty acids.", "✔ True 正確"),
]

BASICS_PROTEIN_TF: list[tuple[int, str, str]] = [
    (2, "Denaturation is a reversible process.", "✘ False 錯誤 — Denaturation is irreversible"),
    (3, "Proteins are made of amino acids.", "✔ True 正確"),
    (7, "Proteins are usually absent in the human body.", "✘ False 錯誤"),
    (12, "Amino acids are the building blocks of proteins.", "✔ True 正確"),
    (15, "Proteins are inactive when denatured.", "✔ True 正確"),
]

BASICS_CARB_FILLS: list[tuple[int, str, str]] = [
    (1, "  is the process that breaks down a molecule using water.", "Hydrolysis"),
    (2, "  reactions join smaller molecules to form larger ones.", "Condensation"),
    (3, "  are the main energy source for the body.", "Carbohydrates"),
    (13, "  are organic molecules that include sugars and starches.", "Carbohydrates"),
]

BASICS_LIPID_FILLS: list[tuple[int, str, str]] = [
    (5, " A  is formed by three fatty acids and glycerol.", "Triglyceride"),
    (9, "  are insoluble in water and used for energy storage.", "Lipids"),
    (11, "  reactions are required to break down triglycerides.", "Hydrolysis"),
]

BASICS_PROTEIN_FILLS: list[tuple[int, str, str]] = [
    (4, "  are made up of amino acids.", "Proteins"),
    (6, " A  is a chain of amino acids.", "Polypeptide"),
    (7, " Proteins lose their  when they denature.", "3D conformation"),
    (8, "  is the building block of proteins.", "Amino acid"),
    (10, " A protein's specific function depends on its .", "3D conformation"),
    (12, "  is the process that forms a dipeptide from two amino acids.", "Condensation"),
    (14, "  refers to the loss of a protein's functional shape.", "Denature"),
    (15, "  are used to build tissues and enzymes in the body.", "Proteins"),
]

# Saturday notes Fill in the Blanks 2 — full sequential order (end of notes).
BASICS_FILLS_SAT_ORDER: list[tuple[int, str, str]] = [
    (1, "  is the process that breaks down a molecule using water.", "Hydrolysis"),
    (2, "  reactions join smaller molecules to form larger ones.", "Condensation"),
    (3, "  are the main energy source for the body.", "Carbohydrates"),
    (4, "  are made up of amino acids.", "Proteins"),
    (5, " A  is formed by three fatty acids and glycerol.", "Triglyceride"),
    (6, " A  is a chain of amino acids.", "Polypeptide"),
    (7, " Proteins lose their  when they denature.", "3D conformation"),
    (8, "  is the building block of proteins.", "Amino acid"),
    (9, "  are insoluble in water and used for energy storage.", "Lipids"),
    (10, " A protein's specific function depends on its .", "3D conformation"),
    (11, "  reactions are required to break down triglycerides.", "Hydrolysis"),
    (12, "  is the process that forms a dipeptide from two amino acids.", "Condensation"),
    (13, "  are organic molecules that include sugars and starches.", "Carbohydrates"),
    (14, "  refers to the loss of a protein's functional shape.", "Denature"),
    (15, "  are used to build tissues and enzymes in the body.", "Proteins"),
]

FUNCTIONS_TF_1_5: list[tuple[int, str, str]] = [
    (1, "Glucose is a monosaccharide.", "✔ True 正確"),
    (2, "Proteins are used for energy storage in the body.", "✘ False 錯誤"),
    (3, "Cellulose is found in the cell walls of plants.", "✔ True 正確"),
    (4, "Glycogen is stored in the liver and muscles.", "✔ True 正確"),
    (5, "Lipids are the main source of quick energy in humans.", "✘ False 錯誤"),
]

FUNCTIONS_TF_6_10: list[tuple[int, str, str]] = [
    (6, "Enzymes are proteins that speed up chemical reactions.", "✔ True 正確"),
    (7, "Fructose is a disaccharide found in fruits.", "✘ False 錯誤 — Fructose is a monosaccharide"),
    (8, "Starch is a storage carbohydrate in plants.", "✔ True 正確"),
    (9, "Phospholipids are the main components of cell membranes.", "✔ True 正確"),
    (10, "Proteins are required for growth and repair in humans.", "✔ True 正確"),
]

FUNCTIONS_TF_11_15: list[tuple[int, str, str]] = [
    (11, "Steroids are a type of lipid that acts as a hormone.", "✔ True 正確"),
    (12, "Maltose is a monosaccharide.", "✘ False 錯誤 — Maltose is a disaccharide"),
    (13, "Glycogen is the stored form of glucose in plants.", "✘ False 錯誤 — Glycogen is stored in animals"),
    (14, "Non-green parts of plants, like potatoes, store starch.", "✔ True 正確"),
    (15, "Lactose is a carbohydrate found in milk.", "✔ True 正確"),
]

FUNCTIONS_FILLS: list[tuple[int, str, str]] = [
    (1, " The main carbohydrate stored in animals is .", "Glycogen"),
    (2, "  is the carbohydrate stored in plant cell walls.", "Cellulose"),
    (3, " Milk contains , a disaccharide.", "Lactose"),
    (4, "  are used to speed up chemical reactions in the body.", "Enzymes"),
    (5, " The stored form of glucose in plants is .", "Starch"),
    (6, "  is a monosaccharide that provides quick energy.", "Glucose"),
    (7, " The main lipid component of cell membranes is .", "Phospholipids"),
    (8, "  is a carbohydrate found in fruits.", "Fructose"),
    (9, " Proteins are essential for  and repair of tissues.", "Growth"),
    (10, "  is a lipid used for energy storage and insulation.", "Triglycerides"),
    (11, "  is a carbohydrate used by athletes for quick energy.", "Glucose"),
    (12, "  is the storage carbohydrate in the liver and muscles.", "Glycogen"),
    (13, "  is the carbohydrate found in milk.", "Lactose"),
    (14, "  are the building blocks of proteins.", "Proteins"),
    (15, "  is the structural carbohydrate found in plant cell walls.", "Cellulose"),
]


def _make_basics_mcq_pages(prefix: str, mcqs: list) -> list[dict]:
    pages: list[dict] = []
    for i, (_q_num, question, choices, answer, img) in enumerate(mcqs, start=1):
        body = _mcq_body_html(i, question, choices, answer, img=img)
        pages.append(
            rich_page(
                f"{prefix} MCQ {i}",
                f'<div class="deck-slide__inner"><h2 class="deck-slide__title deck-slide__title--compact">{prefix} MCQ {i}</h2><div class="deck-slide__body">{body}</div></div>',
                thumb=img,
                thumb_ph=f"Q{i}" if not img else None,
                phases="pic,q,a" if img else "q,a",
            )
        )
    return pages


def _make_basics_tf_page(label: str, items: list[tuple[int, str, str]]) -> dict:
    blocks = []
    for i, (_n, stmt, ans) in enumerate(items, start=1):
        border = " tf-item--border" if i < len(items) else ""
        blocks.append(
            f'<div class="tf-item{border}"><p class="deck-text tf-q step step-text" data-phase="q">'
            f"<strong>{i}.</strong> {stmt}</p>"
            f'<div class="answer-panel hidden-answer step" data-phase="a">'
            f'<span class="answer-badge answer-badge--sm">{ans}</span></div></div>'
        )
    body = (
        '<p class="deck-subtitle text-primary mb-3 step step-text" data-phase="q">'
        'Direction: put a "✔" is the sentence is correct and put a "✘" on the phrase or words that are wrong.</p>'
        + "".join(blocks)
    )
    return rich_page(
        label,
        f'<div class="deck-slide__inner"><h2 class="deck-slide__title deck-slide__title--compact">{label}</h2><div class="deck-slide__body">{body}</div></div>',
        thumb_ph="T/F",
        phases="q,a",
        scroll=True,
    )


def _make_basics_fill_page(label: str, blanks: list[tuple[int, str, str]], *, with_bank: bool) -> dict:
    word_bank = ""
    if with_bank:
        word_bank = (
            '<p class="deck-text-sm mb-2 step step-text" data-phase="q"><strong>Choose from the following:</strong></p>'
            '<div class="word-bank step step-text" data-phase="q">'
            '<span class="bio-tag">condensation</span><span class="bio-tag">hydrolysis</span>'
            '<span class="bio-tag">carbohydrates</span><span class="bio-tag">proteins</span>'
            '<span class="bio-tag">lipids</span><span class="bio-tag">amino acid</span>'
            '<span class="bio-tag">denature</span><span class="bio-tag">triglyceride</span>'
            '<span class="bio-tag">polypeptide</span><span class="bio-tag">3D conformation</span>'
            "</div>"
        )
    lines = []
    for i, (_n, stem, ans) in enumerate(blanks, start=1):
        lines.append(
            f'<p class="deck-text mb-2 step step-text" data-phase="q"><strong>{i}.</strong>{stem}'
            f'<span class="fill-dash" data-phase="q">________</span>'
            f'<span class="fill-blank hidden-answer" data-phase="a">{ans}</span></p>'
        )
    body = (
        word_bank
        + "".join(lines)
        + '<div class="answer-panel hidden-answer step" data-phase="a">'
        '<div class="answer-badge">Answers revealed ↑</div></div>'
    )
    return rich_page(
        label,
        f'<div class="deck-slide__inner"><h2 class="deck-slide__title deck-slide__title--compact">{label}</h2><div class="deck-slide__body">{body}</div></div>',
        thumb_ph="Fill",
        phases="q,a",
        scroll=True,
    )


def _make_basics_header_page(label: str, subtitle: str) -> dict:
    return rich_page(
        label,
        f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">{label}</h2><div class="deck-slide__body"><div class="text-center"><h2 class="font-headline-xl"><span class="hl hl-b step step-text">Concept Checks</span></h2><p class="deck-text">{subtitle}</p><p class="deck-text-sm">Multiple-Choice · True/False · Fill in the Blanks</p></div></div></div>""",
        thumb_ph="CC",
        center=True,
    )


def make_basics_carb_quiz_pages() -> list[dict]:
    return [
        _make_basics_header_page(INSERTED_BASICS_CARB_HEADER, "Basics of Carbohydrates"),
        *_make_basics_mcq_pages(BASICS_CARB_PREFIX, BASICS_CARB_MCQS),
        _make_basics_tf_page(INSERTED_BASICS_CARB_TF, BASICS_CARB_TF),
    ]


def make_basics_lipid_quiz_pages() -> list[dict]:
    return [
        _make_basics_header_page(INSERTED_BASICS_LIPID_HEADER, "Basics of Lipids"),
        *_make_basics_mcq_pages(BASICS_LIPID_PREFIX, BASICS_LIPID_MCQS),
        _make_basics_tf_page(INSERTED_BASICS_LIPID_TF, BASICS_LIPID_TF),
    ]


def make_basics_protein_quiz_pages() -> list[dict]:
    return [
        _make_basics_header_page(INSERTED_BASICS_PROTEIN_HEADER, "Basics of Proteins"),
        *_make_basics_mcq_pages(BASICS_PROTEIN_PREFIX, BASICS_PROTEIN_MCQS),
        _make_basics_tf_page(INSERTED_BASICS_PROTEIN_TF, BASICS_PROTEIN_TF),
    ]


def make_basics_fill_pages() -> list[dict]:
    """Basics fills at end of deck — Sat notes Fill 2 order (1–5 / 6–10 / 11–15)."""
    return [
        _make_basics_fill_page(
            INSERTED_FILL2_1_5,
            BASICS_FILLS_SAT_ORDER[:5],
            with_bank=True,
        ),
        _make_basics_fill_page(
            INSERTED_FILL2_6_10,
            BASICS_FILLS_SAT_ORDER[5:10],
            with_bank=False,
        ),
        _make_basics_fill_page(
            INSERTED_FILL2_11_15,
            BASICS_FILLS_SAT_ORDER[10:15],
            with_bank=False,
        ),
    ]


def make_functions_fill_pages() -> list[dict]:
    return [
        _make_functions_fill_page(
            "Fill in the Blanks 1–5",
            FUNCTIONS_FILLS[:5],
            with_bank=True,
        ),
        _make_functions_fill_page(
            "Fill in the Blanks 6–10",
            FUNCTIONS_FILLS[5:10],
            with_bank=False,
        ),
        _make_functions_fill_page(
            "Fill in the Blanks 11–15",
            FUNCTIONS_FILLS[10:15],
            with_bank=False,
        ),
    ]


def make_all_fill_pages_in_sat_order() -> list[dict]:
    """Saturday notes: Functions Fill 1, then Basics Fill 2 (split across 3 slides)."""
    return make_functions_fill_pages() + make_basics_fill_pages()


def insert_all_fill_pages_before_answer_key(pages: list[dict]) -> list[dict]:
    """Move all Fill-in-the-Blanks slides to immediately before the Answer Key block."""
    answer_key_labels = {
        ANSWER_KEY_BASICS_MCQ,
        ANSWER_KEY_BASICS_TF_FILL,
        ANSWER_KEY_FUNCTIONS_MCQ,
        ANSWER_KEY_FUNCTIONS_TF_FILL,
    }
    drop = set(ALL_FILL_PAGE_LABELS) | answer_key_labels | FILL2_PAGE_LABELS
    out: list[dict] = [p for p in pages if p.get("label") not in drop]

    ak_idx = next(
        (i for i, p in enumerate(out) if p.get("label") == INSERTED_END_SLIDE),
        len(out),
    )
    out[ak_idx:ak_idx] = make_all_fill_pages_in_sat_order() + make_answer_key_pages()

    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def merge_tail_poly_into_carbs_end(pages: list[dict]) -> list[dict]:
    """Fuse tail Poly saccharides (146–149) into the following carb summary page.

    Base deck keeps slides 146–149 on a separate Poly page before
    ``1. Carbohydrates 碳水化合物`` (150–151). That extra page pushes the carb
    summary to ch5-play p.29 and Basic-carbohydrates quizzes to p.30. Merge so
    p.28 = carb end (slide-151) and p.29 = first quiz.
    """
    out: list[dict] = []
    i = 0
    merged = False
    while i < len(pages):
        p = pages[i]
        nxt = pages[i + 1] if i + 1 < len(pages) else None
        if (
            not merged
            and p.get("label", "").startswith(POLY_LABEL)
            and p.get("frames", [])[-1:] == [SLIDE_149]
            and nxt is not None
            and nxt.get("label", "").startswith(CARBS_END_LABEL)
            and CARBS_END_FRAME in nxt.get("frames", [])
        ):
            head_frames = list(p.get("frames", []))
            tail_frames = list(nxt.get("frames", []))
            all_frames = head_frames + tail_frames
            head_meta = p.get("frameMeta")
            tail_meta = nxt.get("frameMeta")
            fused: dict = {
                **nxt,
                "label": CARBS_END_LABEL,
                "frames": all_frames,
                "clicks": max(0, len(all_frames) - 1),
                "thumb": all_frames[-1],
                "startFrame": 146,
                "endFrame": 151,
            }
            if head_meta is not None or tail_meta is not None:
                fused["frameMeta"] = (head_meta or []) + (tail_meta or [])
            out.append(fused)
            merged = True
            i += 2
            continue
        out.append(p)
        i += 1

    for j, page in enumerate(out, start=1):
        page["page"] = j
    return out


def _is_merged_carbs_end_page(p: dict) -> bool:
    """Poly tail fused carb summary (slide-146…); not the relocated slide-151 page."""
    frames = p.get("frames", [])
    return (
        p.get("label", "").startswith(CARBS_END_LABEL)
        and not p.get("movedFrom")
        and CARBS_MERGE_HEAD_FRAME in frames
    )


def _carbs_tail_page_before_lipids(pages: list[dict]) -> int | None:
    """Index of standalone slide-151 page immediately before 2. Lipids, if present."""
    for i, p in enumerate(pages):
        if (
            p.get("label", "").startswith(LIPIDS_ANCHOR_LABEL)
            and i > 0
            and pages[i - 1].get("movedFrom") == CARBS_MOVED_FROM
            and pages[i - 1].get("frames") == [CARBS_END_FRAME]
        ):
            return i - 1
    return None


def _trim_carbs_end_tail(p: dict) -> bool:
    """Drop slide-151 from merged carb page; return True if a frame was removed."""
    frames = list(p.get("frames", []))
    if not frames or frames[-1] != CARBS_END_FRAME:
        return False
    frames.pop()
    p["frames"] = frames
    p["clicks"] = max(0, len(frames) - 1)
    p["thumb"] = frames[-1] if frames else p.get("thumb")
    if "endFrame" in p:
        p["endFrame"] = 150
    if "frameMeta" in p:
        p["frameMeta"] = [m for m in p["frameMeta"] if m.get("src") != CARBS_END_FRAME]
    return True


def trim_merged_carbs_step5(pages: list[dict]) -> list[dict]:
    """Drop HUD p.31 step 5 (slide-150) from merged carb summary page."""
    for p in pages:
        if not _is_merged_carbs_end_page(p):
            continue
        frames = list(p.get("frames", []))
        if CARBS_MERGE_STEP5_FRAME not in frames:
            break
        frames = [f for f in frames if f != CARBS_MERGE_STEP5_FRAME]
        p["frames"] = frames
        p["clicks"] = max(0, len(frames) - 1)
        p["thumb"] = frames[-1] if frames else p.get("thumb")
        if "endFrame" in p:
            p["endFrame"] = 149
        if "frameMeta" in p:
            p["frameMeta"] = [
                m for m in p["frameMeta"] if m.get("src") != CARBS_MERGE_STEP5_FRAME
            ]
        break
    return pages


def ensure_merged_carbs_has_end_frame(pages: list[dict]) -> list[dict]:
    """Re-append slide-151 when base JSON already lost it after a prior move."""
    for p in pages:
        if not _is_merged_carbs_end_page(p):
            continue
        frames = list(p.get("frames", []))
        if CARBS_END_FRAME in frames:
            continue
        if frames and frames[-1] == "/media/slides/slide-150.png":
            frames.append(CARBS_END_FRAME)
            p["frames"] = frames
            p["clicks"] = max(0, len(frames) - 1)
            p["thumb"] = CARBS_END_FRAME
            p["endFrame"] = 151
    return pages


def _lipids_triglycerides_diagram_box(im) -> tuple[int, int, int, int] | None:
    """Locate the triglyceride structure diagram in the worksheet source PNG."""
    w, h = im.size
    xs: list[int] = []
    ys: list[int] = []
    for y in range(90, min(420, h)):
        for x in range(w):
            r, g, b = im.getpixel((x, y))
            if abs(r - 255) + abs(g - 255) + abs(b - 255) > 60:
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    pad = 12
    return (
        max(0, min(xs) - pad),
        max(0, min(ys) - pad),
        min(w, max(xs) + pad + 1),
        min(h, max(ys) + pad + 1),
    )


def _save_lipids_triglycerides_asset(crop, name: str, *, src_mtime: float) -> None:
    CH5FH_ASSETS.mkdir(parents=True, exist_ok=True)
    dest = CH5FH_ASSETS / name
    if dest.exists() and dest.stat().st_mtime >= src_mtime:
        return
    crop.save(dest, optimize=True)
    print(f"Prepared {name} from lipids-triglycerides source")
    dist_assets = (
        DECK_ROOT.parents[1]
        / "dist"
        / "osmosis"
        / "slides"
        / "embed"
        / "ch5fh-assets"
        / name
    )
    if dist_assets.parent.exists():
        dist_assets.parent.mkdir(parents=True, exist_ok=True)
        crop.save(dist_assets, optimize=True)


def prepare_lipids_triglycerides_worksheet_assets() -> None:
    """Crop triglyceride structure diagram from worksheet source into ch5fh-assets."""
    try:
        from PIL import Image
    except ImportError:
        return
    src_candidates = [
        LIPIDS_TRIG_SOURCE,
        Path(
            "/Users/jyleung/.cursor/projects/Users-jyleung-Cursor-S3-Bio/assets/"
            "4ab47596-f295-4b2f-ad11-795b63388922-575b6d5c-a834-4dc4-9936-c9b3c7b916ee.png"
        ),
    ]
    src = next((p for p in src_candidates if p.is_file()), None)
    if src is None:
        if (CH5FH_ASSETS / LIPIDS_TRIG_DIAGRAM).is_file():
            return
        print("lipids-triglycerides source PNG not found; skipping worksheet assets")
        return
    im = Image.open(src).convert("RGB")
    src_mtime = src.stat().st_mtime
    diagram_box = _lipids_triglycerides_diagram_box(im)
    if diagram_box is not None:
        _save_lipids_triglycerides_asset(
            im.crop(diagram_box), LIPIDS_TRIG_DIAGRAM, src_mtime=src_mtime
        )


def _lipids_triglycerides_worksheet_html() -> str:
    diagram = f"{FH_EMBED}/{LIPIDS_TRIG_DIAGRAM}"
    table = _polypeptide_ws_table_html(
        [("Triglyceride breakdown", "", "")],
    )
    return (
        '<p class="deck-text-sm step step-text mb-2">'
        "example: <strong>triglycerides 三酸甘油酯</strong> — "
        "fats 脂肪 and oils 油</p>"
        f'<figure class="fig-box fig-wide step step-text ws-diagram ws-diagram--lipids">'
        f'<img src="{diagram}" alt="Triglyceride structure: glycerol and three fatty acids"/>'
        "</figure>"
        f"{table}"
        '<div class="ws-reaction-block step step-text">'
        '<p class="deck-text-sm ws-reaction-label ws-reaction-label--hydro mb-1">'
        "Hydrolysis reaction:</p>"
        '<p class="deck-text-sm">Triglyceride 甘油三酯 + ______ water → '
        "glycerol 甘油 + 3 fatty acids 脂肪酸</p>"
        "</div>"
        '<div class="ws-reaction-block step step-text">'
        '<p class="deck-text-sm ws-reaction-label ws-reaction-label--cond mb-1">'
        "Condensation reaction:</p>"
        '<div class="ws-write-line" aria-label="Write condensation reaction"></div>'
        "</div>"
    )


def _make_lipids_triglycerides_page(label: str) -> dict:
    diagram = f"{FH_EMBED}/{LIPIDS_TRIG_DIAGRAM}"
    return rich_page(
        label,
        f"""<div class="deck-slide__inner deck-slide__inner--worksheet deck-slide__inner--worksheet-lipids"><h2 class="deck-slide__title deck-slide__title--compact">Lipids · Triglycerides</h2><div class="deck-slide__body">{_lipids_triglycerides_worksheet_html()}</div></div>""",
        thumb=diagram,
        thumb_ph="TG",
        scroll=False,
    )


def prepare_carbohydrates_maltose_png() -> None:
    """Crop source worksheet PNG into slide-255.png (idempotent)."""
    try:
        from PIL import Image
    except ImportError:
        return
    src_candidates = [
        CARB_MALTOSE_SOURCE,
        Path(
            "/Users/jyleung/.cursor/projects/Users-jyleung-Cursor-S3-Bio/assets/"
            "_____2026-07-12___4.11.38-b56b6387-75e0-4093-8113-2319faf587e3.png"
        ),
    ]
    src = next((p for p in src_candidates if p.is_file()), None)
    if src is None:
        dest = SLIDES_DIR / "slide-255.png"
        if dest.is_file():
            return
        print("carbohydrates-maltose source PNG not found; skipping slide-255 prepare")
        return
    dest = SLIDES_DIR / "slide-255.png"
    im = Image.open(src).convert("RGB")
    bg = im.getpixel((0, 0))
    w, h = im.size
    x0 = y0 = w
    x1 = y1 = 0
    for y in range(h):
        for x in range(w):
            r, g, b = im.getpixel((x, y))
            if abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2]) > 30:
                x0 = min(x0, x)
                y0 = min(y0, y)
                x1 = max(x1, x)
                y1 = max(y1, y)
    if x1 > x0 and y1 > y0:
        pad = 12
        box = (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(w, x1 + pad + 1),
            min(h, y1 + pad + 1),
        )
        im = im.crop(box)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, optimize=True)
    print(f"Prepared {dest.name} from {src.name}")
    dist_slides = (
        DECK_ROOT.parents[1]
        / "dist"
        / "slides"
        / "ch5-condensation-hydrolysis"
        / "public"
        / "media"
        / "slides"
    )
    if dist_slides.parent.exists():
        dist_slides.mkdir(parents=True, exist_ok=True)
        im.save(dist_slides / "slide-255.png", optimize=True)


def _make_carbohydrates_maltose_page(label: str) -> dict:
    return {
        "page": 0,
        "label": label,
        "startFrame": 255,
        "endFrame": 255,
        "frames": [CARB_MALTOSE_WORKSHEET_FRAME],
        "clicks": 0,
        "thumb": CARB_MALTOSE_WORKSHEET_FRAME,
        "inserted": True,
    }


def _is_suboptimal_tail_page(p: dict) -> bool:
    frames = p.get("frames", [])
    return (
        p.get("label", "").startswith(SUBOPTIMAL_PH_LABEL)
        and bool(frames)
        and frames[-1] == SUBOPTIMAL_TAIL_FRAME
    )


def _polypeptide_worksheet_diagram_box(im) -> tuple[int, int, int, int] | None:
    """Locate only the polypeptide-chain diagram (exclude reaction text above)."""
    w, h = im.size

    def is_bead(r: int, g: int, b: int) -> bool:
        return r > 180 and g < 160 and b < 160 and r > g + 20

    row_beads = [
        sum(1 for x in range(w) if is_bead(*im.getpixel((x, y))))
        for y in range(h)
    ]
    blocks: list[tuple[int, int]] = []
    start: int | None = None
    gap = 0
    for y, count in enumerate(row_beads):
        if count >= 10:
            if start is None:
                start = y
            gap = 0
        elif start is not None:
            gap += 1
            if gap >= 15:
                blocks.append((start, y - gap))
                start = None
    if start is not None:
        blocks.append((start, h - 1))
    if not blocks:
        return None
    y0, y1 = max(blocks, key=lambda b: b[1] - b[0])
    xs: list[int] = []
    ys: list[int] = []
    for y in range(y0, y1 + 1):
        for x in range(w):
            if is_bead(*im.getpixel((x, y))):
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    pad = 12
    return (
        max(0, min(xs) - pad),
        max(0, y0 - pad),
        min(w, max(xs) + pad + 1),
        min(h, max(ys) + pad + 1),
    )


def prepare_polypeptide_worksheet_assets() -> None:
    """Crop polypeptide-chain diagram from worksheet source into ch5fh-assets."""
    try:
        from PIL import Image
    except ImportError:
        return
    src_candidates = [
        POLYPEPTIDE_WORKSHEET_SOURCE,
        Path(
            "/Users/jyleung/.cursor/projects/Users-jyleung-Cursor-S3-Bio/assets/"
            "_____2026-07-17___7.39.47-b902829c-467f-4c3a-9207-c33f339a382e.png"
        ),
    ]
    src = next((p for p in src_candidates if p.is_file()), None)
    if src is None:
        if (CH5FH_ASSETS / POLYPEPTIDE_CHAIN_DIAGRAM).is_file():
            return
        print("polypeptide-worksheet source PNG not found; skipping diagram asset")
        return
    im = Image.open(src).convert("RGB")
    box = _polypeptide_worksheet_diagram_box(im)
    if box is None:
        print("polypeptide-worksheet diagram not found in source; skipping asset")
        return
    diagram = im.crop(box)
    CH5FH_ASSETS.mkdir(parents=True, exist_ok=True)
    dest = CH5FH_ASSETS / POLYPEPTIDE_CHAIN_DIAGRAM
    if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
        return
    diagram.save(dest, optimize=True)
    print(f"Prepared {dest.name} from {src.name}")
    dist_assets = (
        DECK_ROOT.parents[1]
        / "dist"
        / "osmosis"
        / "slides"
        / "embed"
        / "ch5fh-assets"
        / POLYPEPTIDE_CHAIN_DIAGRAM
    )
    if dist_assets.parent.exists():
        dist_assets.parent.mkdir(parents=True, exist_ok=True)
        diagram.save(dist_assets, optimize=True)


def _polypeptide_ws_blank_cell() -> str:
    return '<span class="ws-blank-cell" aria-hidden="true">&nbsp;</span>'


def _polypeptide_ws_table_html(
    rows: list[tuple[str, str, str]],
    *,
    step_class: str = "step step-text",
) -> str:
    body = "".join(
        f"<tr class=\"{step_class}\"><td>{desc}</td>"
        f"<td>{proc or _polypeptide_ws_blank_cell()}</td>"
        f"<td>{bonds or _polypeptide_ws_blank_cell()}</td></tr>"
        for desc, proc, bonds in rows
    )
    return (
        '<div class="rounded-3xl overflow-hidden glass-frost border border-white/40 shadow-xl">'
        '<table class="w-full deck-text-sm deck-table--compact ws-table">'
        '<thead><tr class="bg-primary/10">'
        "<th>Description</th>"
        "<th>Condensation / Hydrolysis</th>"
        "<th>Number of bonds 鍵</th>"
        "</tr></thead><tbody>"
        f"{body}</tbody></table></div>"
    )


def _polypeptide_worksheet_html_part1() -> str:
    top_table = _polypeptide_ws_table_html(
        [("2 amino acids 胺基酸 form 1 dipeptide 二肽", "", "")],
    )
    return (
        f"{top_table}"
        '<div class="ws-reaction-block step step-text">'
        '<p class="deck-text-sm ws-reaction-label ws-reaction-label--hydro mb-1">'
        "Hydrolysis reaction:</p>"
        '<div class="ws-write-line" aria-label="Write hydrolysis reaction"></div>'
        "</div>"
        '<div class="ws-reaction-block step step-text">'
        '<p class="deck-text-sm ws-reaction-label ws-reaction-label--cond mb-1">'
        "Condensation reaction:</p>"
        '<div class="ws-write-line" aria-label="Write condensation reaction"></div>'
        "</div>"
    )


def _polypeptide_worksheet_html_part2() -> str:
    diagram = f"{FH_EMBED}/{POLYPEPTIDE_CHAIN_DIAGRAM}"
    bottom_table = _polypeptide_ws_table_html(
        [
            ("Polypeptide 多肽 breakdown into 6 amino acids", "", ""),
            ("5 amino acids form polypeptide", "", ""),
            ("Polypeptide 多肽 breakdown into 22 amino acids", "", ""),
        ],
    )
    return (
        f'<figure class="fig-box fig-wide step step-text ws-diagram ws-diagram--polypeptide">'
        f'<img src="{diagram}" alt="Polypeptide chain with amino acid sequence"/>'
        "</figure>"
        f"{bottom_table}"
    )


def _polypeptide_worksheet_title(part: int) -> str:
    return (
        "Polypeptide · Condensation &amp; Hydrolysis · "
        f"worksheet (part {part})"
    )


def _make_polypeptide_worksheet_page(label: str, *, part: int) -> dict:
    diagram = f"{FH_EMBED}/{POLYPEPTIDE_CHAIN_DIAGRAM}"
    body = (
        _polypeptide_worksheet_html_part1()
        if part == 1
        else _polypeptide_worksheet_html_part2()
    )
    ws_mod = (
        "deck-slide__inner--worksheet-pp1"
        if part == 1
        else "deck-slide__inner--worksheet-pp2"
    )
    return rich_page(
        label,
        f"""<div class="deck-slide__inner deck-slide__inner--worksheet {ws_mod}"><h2 class="deck-slide__title deck-slide__title--compact">{_polypeptide_worksheet_title(part)}</h2><div class="deck-slide__body">{body}</div></div>""",
        thumb=diagram if part == 2 else None,
        thumb_ph="PP",
        scroll=False,
    )


def _is_polypeptide_worksheet_tail(p: dict) -> bool:
    label = p.get("label", "")
    return label in (INSERTED_POLYPEPTIDE_WORKSHEET_P2, INSERTED_POLYPEPTIDE_WORKSHEET)


def insert_polypeptide_worksheet_after_p82(pages: list[dict]) -> list[dict]:
    """Insert condensation/hydrolysis worksheet (2 parts) after Polypeptide Chain."""
    new_pages = [
        _make_polypeptide_worksheet_page(INSERTED_POLYPEPTIDE_WORKSHEET_P1, part=1),
        _make_polypeptide_worksheet_page(INSERTED_POLYPEPTIDE_WORKSHEET_P2, part=2),
    ]
    out: list[dict] = []
    inserted = False
    for p in pages:
        if p.get("label") in POLYPEPTIDE_WORKSHEET_LABELS:
            continue
        out.append(p)
        if (
            not inserted
            and p.get("label", "").startswith(POLYPEPTIDE_LABEL)
            and p.get("frames") == [POLYPEPTIDE_SINGLE_FRAME]
        ):
            out.extend(new_pages)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def prepare_polypeptide_vs_protein_png() -> None:
    """Crop source worksheet PNG into slide-256.png (idempotent)."""
    try:
        from PIL import Image
    except ImportError:
        return
    src_candidates = [
        POLYPEPTIDE_VS_PROTEIN_SOURCE,
        Path(
            "/Users/jyleung/.cursor/projects/Users-jyleung-Cursor-S3-Bio/assets/"
            "_____2026-07-12___4.53.59-e6d4265f-6c72-4d41-8a6d-71d1a7f8afd4.png"
        ),
    ]
    src = next((p for p in src_candidates if p.is_file()), None)
    if src is None:
        dest = SLIDES_DIR / "slide-256.png"
        if dest.is_file():
            return
        print("polypeptide-vs-protein source PNG not found; skipping slide-256 prepare")
        return
    dest = SLIDES_DIR / "slide-256.png"
    im = Image.open(src).convert("RGB")
    bg = im.getpixel((0, 0))
    w, h = im.size
    x0 = y0 = w
    x1 = y1 = 0
    for y in range(h):
        for x in range(w):
            r, g, b = im.getpixel((x, y))
            if abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2]) > 30:
                x0 = min(x0, x)
                y0 = min(y0, y)
                x1 = max(x1, x)
                y1 = max(y1, y)
    if x1 > x0 and y1 > y0:
        pad = 12
        box = (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(w, x1 + pad + 1),
            min(h, y1 + pad + 1),
        )
        im = im.crop(box)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, optimize=True)
    print(f"Prepared {dest.name} from {src.name}")
    dist_slides = (
        DECK_ROOT.parents[1]
        / "dist"
        / "slides"
        / "ch5-condensation-hydrolysis"
        / "public"
        / "media"
        / "slides"
    )
    if dist_slides.parent.exists():
        dist_slides.mkdir(parents=True, exist_ok=True)
        im.save(dist_slides / "slide-256.png", optimize=True)


def _make_polypeptide_vs_protein_page(label: str) -> dict:
    return {
        "page": 0,
        "label": label,
        "startFrame": 256,
        "endFrame": 256,
        "frames": [POLYPEPTIDE_VS_PROTEIN_FRAME],
        "clicks": 0,
        "thumb": POLYPEPTIDE_VS_PROTEIN_FRAME,
        "inserted": True,
    }


def _dist_slides_dir() -> Path:
    return (
        DECK_ROOT.parents[1]
        / "dist"
        / "slides"
        / "ch5-condensation-hydrolysis"
        / "public"
        / "media"
        / "slides"
    )


def _prepare_worksheet_slide_png(
    source: Path,
    slide_num: int,
    fallback_paths: list[Path] | None = None,
    label: str = "worksheet",
) -> None:
    """Crop source worksheet PNG into slide-NNN.png (idempotent)."""
    try:
        from PIL import Image
    except ImportError:
        return
    src_candidates = [source, *(fallback_paths or [])]
    src = next((p for p in src_candidates if p.is_file()), None)
    dest = SLIDES_DIR / f"slide-{slide_num:03d}.png"
    if src is None:
        if dest.is_file():
            return
        print(f"{label} source PNG not found; skipping slide-{slide_num:03d} prepare")
        return
    im = Image.open(src).convert("RGB")
    bg = im.getpixel((0, 0))
    w, h = im.size
    x0 = y0 = w
    x1 = y1 = 0
    for y in range(h):
        for x in range(w):
            r, g, b = im.getpixel((x, y))
            if abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2]) > 30:
                x0 = min(x0, x)
                y0 = min(y0, y)
                x1 = max(x1, x)
                y1 = max(y1, y)
    if x1 > x0 and y1 > y0:
        pad = 12
        box = (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(w, x1 + pad + 1),
            min(h, y1 + pad + 1),
        )
        im = im.crop(box)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, optimize=True)
    print(f"Prepared {dest.name} from {src.name}")
    dist_slides = _dist_slides_dir()
    if dist_slides.parent.exists():
        dist_slides.mkdir(parents=True, exist_ok=True)
        im.save(dist_slides / dest.name, optimize=True)


def prepare_denaturation_worksheet_pngs() -> None:
    """Prepare slide-257/258/259 denaturation worksheets (idempotent)."""
    _prepare_worksheet_slide_png(
        DENATURATION_NATIVE_SOURCE,
        257,
        [
            Path(
                "/Users/jyleung/.cursor/projects/Users-jyleung-Cursor-S3-Bio/assets/"
                "_____2026-07-12___4.57.21-a80d003f-26af-4b50-b94a-97cf7ca2ba2f.png"
            )
        ],
        label="denaturation-native",
    )
    _prepare_worksheet_slide_png(
        DENATURATION_CAUSES_SOURCE,
        258,
        [
            Path(
                "/Users/jyleung/.cursor/projects/Users-jyleung-Cursor-S3-Bio/assets/"
                "_____2026-07-12___4.58.19-cfff542d-1753-4167-a9c1-c50d83af434b.png"
            )
        ],
        label="denaturation-causes",
    )
    _prepare_worksheet_slide_png(
        DENATURATION_LOCK_KEY_SOURCE,
        259,
        [
            Path(
                "/Users/jyleung/.cursor/projects/Users-jyleung-Cursor-S3-Bio/assets/"
                "_____2026-07-12___4.58.29-088f8f94-8bf6-473b-9a98-3ebd07722aca.png"
            )
        ],
        label="denaturation-lock-key",
    )


def _make_denaturation_worksheet_page(label: str, frame: str, slide_num: int) -> dict:
    return {
        "page": 0,
        "label": label,
        "startFrame": slide_num,
        "endFrame": slide_num,
        "frames": [frame],
        "clicks": 0,
        "thumb": frame,
        "inserted": True,
    }


def insert_denaturation_pages_after_p89(pages: list[dict]) -> list[dict]:
    """Insert denaturation worksheet trio after Suboptimal pH tail (HUD p.89)."""
    new_pages = [
        _make_denaturation_worksheet_page(
            INSERTED_DENATURATION_NATIVE, DENATURATION_NATIVE_FRAME, 257
        ),
        _make_denaturation_worksheet_page(
            INSERTED_DENATURATION_CAUSES, DENATURATION_CAUSES_FRAME, 258
        ),
        _make_denaturation_worksheet_page(
            INSERTED_DENATURATION_LOCK_KEY, DENATURATION_LOCK_KEY_FRAME, 259
        ),
    ]
    out: list[dict] = []
    inserted = False
    for p in pages:
        if p.get("label") in DENATURATION_INSERTED_LABELS:
            continue
        out.append(p)
        if not inserted and _is_suboptimal_tail_page(p):
            out.extend(new_pages)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_polypeptide_vs_protein_after_p82(pages: list[dict]) -> list[dict]:
    """Insert comparison worksheet after polypeptide worksheet (HUD p.83) or Chain (p.82)."""
    new_page = _make_polypeptide_vs_protein_page(INSERTED_POLYPEPTIDE_VS_PROTEIN_P82)
    has_worksheet = any(p.get("label") in POLYPEPTIDE_WORKSHEET_LABELS for p in pages)
    out: list[dict] = []
    inserted = False
    for p in pages:
        if p.get("label") == INSERTED_POLYPEPTIDE_VS_PROTEIN_P82:
            continue
        out.append(p)
        if not inserted and (
            (has_worksheet and _is_polypeptide_worksheet_tail(p))
            or (
                not has_worksheet
                and p.get("label", "").startswith(POLYPEPTIDE_LABEL)
                and p.get("frames") == [POLYPEPTIDE_SINGLE_FRAME]
            )
        ):
            out.append(new_page)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def _insert_polypeptide_vs_protein_between_suboptimal_split(
    pages: list[dict],
    copy_page: dict,
) -> tuple[list[dict], bool]:
    """Insert copy between Suboptimal head (…250) and tail (251…) if already split."""
    out: list[dict] = []
    inserted = False
    i = 0
    while i < len(pages):
        p = pages[i]
        if p.get("label") == copy_page.get("label"):
            i += 1
            continue
        if (
            not inserted
            and p.get("label", "").startswith(SUBOPTIMAL_PH_LABEL)
            and p.get("frames", [])[-1:] == [SUBOPTIMAL_STEP2_FRAME]
        ):
            j = i + 1
            while j < len(pages) and pages[j].get("label") in POLYPEPTIDE_VS_PROTEIN_LABELS:
                if pages[j].get("label") != copy_page.get("label"):
                    pass
                j += 1
            if (
                j < len(pages)
                and pages[j].get("label", "").startswith(SUBOPTIMAL_PH_LABEL)
                and pages[j].get("frames", [""])[:1] == [SUBOPTIMAL_TAIL_FRAME]
            ):
                out.extend([p, copy_page, pages[j]])
                inserted = True
                i = j + 1
                continue
        out.append(p)
        i += 1
    return out, inserted


def insert_polypeptide_vs_protein_after_p86_step2(pages: list[dict]) -> list[dict]:
    """Split Suboptimal pH page after step 2 (slide-250) and insert comparison."""
    copy_page = _make_polypeptide_vs_protein_page(INSERTED_POLYPEPTIDE_VS_PROTEIN_P86)
    out, inserted = _insert_polypeptide_vs_protein_between_suboptimal_split(
        pages, copy_page
    )
    if inserted:
        for i, page in enumerate(out, start=1):
            page["page"] = i
        return out

    out = []
    inserted = False
    for p in pages:
        if p.get("label") == INSERTED_POLYPEPTIDE_VS_PROTEIN_P86:
            continue
        if (
            not inserted
            and p.get("label", "").startswith(SUBOPTIMAL_PH_LABEL)
            and SUBOPTIMAL_TAIL_FRAME in p.get("frames", [])
        ):
            frames = list(p.get("frames", []))
            split = _split_page_after_step(
                p,
                frames,
                2,
                start=p.get("startFrame"),
                end=p.get("endFrame"),
            )
            if split is None:
                out.append(p)
                out.append(copy_page)
                inserted = True
                continue
            head, tail = split
            out.extend([head, copy_page, tail])
            inserted = True
            continue
        out.append(p)
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_carbohydrates_maltose_worksheet_after_p23(pages: list[dict]) -> list[dict]:
    """Insert maltose worksheet immediately after Scenario 2 (HUD p.23)."""
    new_page = _make_carbohydrates_maltose_page(INSERTED_CARB_MALTOSE_WORKSHEET)
    out: list[dict] = []
    inserted = False
    for p in pages:
        if p.get("label") == INSERTED_CARB_MALTOSE_WORKSHEET:
            continue
        out.append(p)
        if not inserted and p.get("label") == INSERTED_SCENARIO_2:
            out.append(new_page)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_lipids_triglycerides_after_p41(pages: list[dict]) -> list[dict]:
    """Insert triglycerides worksheet immediately after ``1. Carbohydrates 碳水化合物``.

    ch5-play HUD = deck index + 3 (two PREFIX slides). That places the new page
    at HUD p.42, directly after the relocated carbohydrates last-step page at
    HUD p.41 (after Basic-carbohydrates Fill).
    """
    new_page = _make_lipids_triglycerides_page(INSERTED_LIPIDS_TRIGLYCERIDES)
    out: list[dict] = []
    inserted = False
    for i, p in enumerate(pages):
        if p.get("label") in (INSERTED_LIPIDS_TRIGLYCERIDES, INSERTED_LIPIDS_TRIGLYCERIDES_COPY):
            continue
        out.append(p)
        if inserted:
            continue
        if p.get("movedFrom") == CARBS_MOVED_FROM:
            out.append(new_page)
            inserted = True
            continue
        nxt = pages[i + 1] if i + 1 < len(pages) else None
        if (
            p.get("label", "").startswith(CARBS_END_LABEL)
            and nxt is not None
            and nxt.get("label", "").startswith(LIPIDS_ANCHOR_LABEL)
        ):
            out.append(new_page)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def duplicate_lipids_triglycerides_after_trig_condensation(
    pages: list[dict],
) -> list[dict]:
    """Duplicate triglycerides worksheet after 2a. Triglyceride condensation (HUD p.48)."""
    new_page = _make_lipids_triglycerides_page(INSERTED_LIPIDS_TRIGLYCERIDES_COPY)
    out: list[dict] = []
    inserted = False
    for p in pages:
        if p.get("label") == INSERTED_LIPIDS_TRIGLYCERIDES_COPY:
            continue
        out.append(p)
        if not inserted and p.get("label") == INSERTED_TRIGLYCERIDE:
            out.append(new_page)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def move_scenarios_3_4_after_triglycerides_worksheet_copy(
    pages: list[dict],
) -> list[dict]:
    """Move Scenario 3 and 4 to immediately after Lipids Triglycerides worksheet (copy).

    ch5-play HUD = deck index + 3 (two PREFIX slides). Target gap: after HUD p.56,
    placing scenarios at HUD p.57–p.58 (before Triglycerides / + 2 Fatty acids).
    """
    anchor_idx = next(
        (
            i
            for i, p in enumerate(pages)
            if p.get("label") == INSERTED_LIPIDS_TRIGLYCERIDES_COPY
        ),
        None,
    )
    s3_idx = next(
        (i for i, p in enumerate(pages) if p.get("label") == INSERTED_SCENARIO_3),
        None,
    )
    s4_idx = next(
        (i for i, p in enumerate(pages) if p.get("label") == INSERTED_SCENARIO_4),
        None,
    )
    if anchor_idx is None or s3_idx is None or s4_idx is None:
        return pages
    if s3_idx == anchor_idx + 1 and s4_idx == anchor_idx + 2:
        return pages

    s3: dict | None = None
    s4: dict | None = None
    for idx in sorted((s3_idx, s4_idx), reverse=True):
        popped = pages.pop(idx)
        if popped.get("label") == INSERTED_SCENARIO_3:
            s3 = popped
        else:
            s4 = popped

    anchor_idx = next(
        (
            i
            for i, p in enumerate(pages)
            if p.get("label") == INSERTED_LIPIDS_TRIGLYCERIDES_COPY
        ),
        None,
    )
    if anchor_idx is None or s3 is None or s4 is None:
        return pages

    pages.insert(anchor_idx + 1, s3)
    pages.insert(anchor_idx + 2, s4)
    for i, page in enumerate(pages, start=1):
        page["page"] = i
    return pages


def move_carbs_last_step_after_p42(pages: list[dict]) -> list[dict]:
    """Move slide-151 from ch5-play p.28 to after p.42 (before 2. Lipids / p.43).

    ch5-play HUD = deck index + 2. Target gap: after Basic-carbohydrates Fill,
    before ``2. Lipids 脂質``.
    """
    tail_idx = _carbs_tail_page_before_lipids(pages)
    if tail_idx is not None:
        for p in pages:
            if _is_merged_carbs_end_page(p) and CARBS_END_FRAME in p.get("frames", []):
                _trim_carbs_end_tail(p)
                break
        return pages

    carbs_idx = None
    for i, p in enumerate(pages):
        if _is_merged_carbs_end_page(p) and CARBS_END_FRAME in p.get("frames", []):
            carbs_idx = i
            break
    if carbs_idx is None:
        return pages

    carbs = pages[carbs_idx]
    frames = list(carbs.get("frames", []))
    if frames[-1] != CARBS_END_FRAME:
        return pages

    tail_meta = None
    if "frameMeta" in carbs:
        for m in reversed(carbs["frameMeta"]):
            if m.get("src") == CARBS_END_FRAME:
                tail_meta = m
                break

    _trim_carbs_end_tail(carbs)

    new_page: dict = {
        "page": 0,
        "label": CARBS_END_LABEL,
        "startFrame": 151,
        "endFrame": 151,
        "frames": [CARBS_END_FRAME],
        "clicks": 0,
        "thumb": CARBS_END_FRAME,
        "movedFrom": CARBS_MOVED_FROM,
    }
    if tail_meta is not None:
        new_page["frameMeta"] = [tail_meta]

    out: list[dict] = []
    inserted = False
    for p in pages:
        out.append(p)
        if not inserted and p.get("label") == INSERTED_BASICS_CARB_TF:
            out.append(new_page)
            inserted = True

    if not inserted:
        out = []
        for p in pages:
            if not inserted and p.get("label", "").startswith(LIPIDS_ANCHOR_LABEL):
                out.append(new_page)
                inserted = True
            out.append(p)

    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_basics_carb_quizzes_after_p28(pages: list[dict]) -> list[dict]:
    """Insert Basic-carbohydrates after merged carb summary (ch5-play p.28)."""
    quiz_pages = make_basics_carb_quiz_pages()
    out: list[dict] = []
    inserted = False
    for p in pages:
        out.append(p)
        if not inserted and _is_merged_carbs_end_page(p):
            out.extend(quiz_pages)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_basics_lipid_quizzes_after_scenario4(pages: list[dict]) -> list[dict]:
    """Insert Basic-Lipid concept checks after Lipids names & functions (~HUD p.61).

    Anchors on the fatty-acids slide so quizzes follow the relocated lipid table
    (insert_lipids_table_after_fatty_acids) even when Scenario 3/4 sit at HUD p.57–58.
    """
    quiz_pages = make_basics_lipid_quiz_pages()
    out: list[dict] = []
    inserted = False
    for p in pages:
        out.append(p)
        if not inserted and p.get("label") == FURTHER_LIPID_TABLE:
            out.extend(quiz_pages)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_protein_table_copy_after_p86(pages: list[dict]) -> list[dict]:
    """Insert protein names table after denaturation worksheets (HUD p.92)."""
    copy_page = make_protein_table_copy(INSERTED_PROTEIN_TABLE_COPY_P86)
    out: list[dict] = []
    inserted = False
    for p in pages:
        if p.get("label") == INSERTED_PROTEIN_TABLE_COPY_P86:
            continue
        out.append(p)
        if not inserted and p.get("label") == INSERTED_DENATURATION_LOCK_KEY:
            out.append(copy_page)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_basics_protein_quizzes_after_denature(pages: list[dict]) -> list[dict]:
    """Insert Basic-Protein concept checks after protein names table copy."""
    quiz_pages = make_basics_protein_quiz_pages()
    out: list[dict] = []
    inserted = False
    for p in pages:
        out.append(p)
        if not inserted and p.get("label") == INSERTED_PROTEIN_TABLE_COPY_P86:
            out.extend(quiz_pages)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def _mcq_multi_img_html(
    q_num: int,
    question: str,
    choices: list[tuple[str, str]],
    answer: str,
    imgs: list[str],
) -> str:
    figures = "".join(
        f'<figure class="fig-box fig-wide step step-pic" data-phase="pic">'
        f'<img src="{src}" alt="Q{q_num}"/></figure>'
        for src in imgs
    )
    media = (
        f'<div class="layout-fig-top__media"><div class="fig-grid-2">{figures}</div></div>'
        if len(imgs) > 1
        else f'<div class="layout-fig-top__media"><figure class="fig-box fig-wide step step-pic" data-phase="pic">'
        f'<img src="{imgs[0]}" alt="Q{q_num}"/></figure></div>'
    )
    opts = _mcq_opts_html(choices)
    mcq = (
        f'<div class="mcq-q"><p class="deck-text mb-2 step step-text" data-phase="q">'
        f"<strong>Q{q_num}.</strong> {question}</p>"
        f'<ul class="mcq-list deck-text mb-2 step step-text" data-phase="q">{opts}</ul>'
        f'<div class="answer-panel step hidden-answer" data-phase="a" data-answer="{answer}">'
        f'<div class="answer-badge">Answer: {answer}</div></div></div>'
    )
    return (
        f'<div class="layout-fig-top">{media}'
        f'<div class="layout-fig-top__text">{mcq}</div></div>'
    )


def _table_cell_bullets(items: list[str]) -> str:
    lis = "".join(f"<li>{item}</li>" for item in items)
    return f'<ul class="deck-table-bullets">{lis}</ul>'


def _table_rows_html(rows: list[tuple[str, str, str]]) -> str:
    body = "".join(
        f'<tr class="step step-text"><td>{n}</td><td>{f}</td><td>{found}</td></tr>'
        for n, f, found in rows
    )
    return (
        '<div class="rounded-3xl overflow-hidden glass-frost border border-white/40 shadow-xl">'
        '<table class="w-full deck-text-sm"><thead><tr class="bg-primary/10">'
        "<th>Names</th><th>Functions</th><th>Found in</th></tr></thead><tbody>"
        f"{body}</tbody></table></div>"
    )


def _organic_inorganic_table_html() -> str:
    return (
        '<div class="rounded-3xl overflow-hidden glass-frost border border-white/40 shadow-xl">'
        '<table class="w-full deck-text-sm"><thead><tr class="bg-primary/10">'
        "<th>Type</th><th>Definition</th><th>Examples</th></tr></thead><tbody>"
        '<tr><td class="align-middle text-center font-semibold">'
        '<span class="step step-text">Organic 有機 Molecules</span></td>'
        '<td class="align-middle"><ul class="list-disc pl-4 mb-0">'
        '<li class="step step-text">Compounds with carbon, typically produced by living organisms.</li>'
        '<li class="step step-text">include C-C &amp; C-H bonds.</li>'
        "</ul></td>"
        '<td class="align-middle"><ul class="list-disc pl-4 mb-0">'
        '<li class="step step-text">Carbohydrates 碳水化合物,</li>'
        '<li class="step step-text">Lipids 脂質</li>'
        '<li class="step step-text">Proteins 蛋白質,</li>'
        '<li class="step step-text">Nucleic Acids 核酸 e.g. DNA</li>'
        '<li class="step step-text">Vitamins 維生素</li>'
        "</ul></td></tr>"
        '<tr><td class="align-middle text-center font-semibold">'
        '<span class="step step-text">Inorganic 無機 Molecules</span></td>'
        '<td class="align-middle"><ul class="list-disc pl-4 mb-0">'
        "<li class=\"step step-text\">Doesn't include C-C &amp; C-H bonds</li>"
        "</ul></td>"
        '<td class="align-middle"><ul class="list-disc pl-4 mb-0">'
        '<li class="step step-text">Water H<sub>2</sub>O</li>'
        '<li class="step step-text">Minerals 礦物質 e.g. calcium 鈣, iron 鐵</li>'
        "</ul></td></tr>"
        "</tbody></table></div>"
    )


def make_organic_inorganic_table_page() -> dict:
    label = INSERTED_ORG_INORG_TABLE
    return rich_page(
        label,
        f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">{label}</h2><div class="deck-slide__body">{_organic_inorganic_table_html()}</div></div>""",
        thumb=ORG_INORG_TABLE_IMG,
        scroll=True,
    )


def insert_organic_inorganic_table_after_p3(pages: list[dict]) -> list[dict]:
    """Insert organic/inorganic table after HUD p.3 (Organic = C-H / C-C bonds)."""
    if any(p.get("label") == INSERTED_ORG_INORG_TABLE for p in pages):
        return pages
    table_page = make_organic_inorganic_table_page()
    out: list[dict] = []
    inserted = False
    for p in pages:
        out.append(p)
        if not inserted and p.get("label") == ORGANIC_BONDS_LABEL:
            out.append(table_page)
            inserted = True
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


FUNCTIONS_NAMES_MCQS: list[tuple[int, str, list[tuple[str, str]], str, str | list[str] | None]] = [
    (1, "Which of the following is a monosaccharide?", [("A", "Starch"), ("B", "Glucose"), ("C", "Lactose"), ("D", "Sucrose")], "B", None),
    (2, "Which of the following is stored in the liver and muscles as an energy reserve?", [("A", "Cellulose"), ("B", "Glycogen"), ("C", "Starch"), ("D", "Fructose")], "B", [f"{FH_EMBED}/image35.jpeg", f"{FH_EMBED}/image36.jpeg"]),
    (3, "Which type of biomolecule is the main component of cell membranes?", [("A", "Proteins"), ("B", "Lipids"), ("C", "Carbohydrates"), ("D", "Nucleic acids")], "B", None),
    (4, "What is the main function of proteins in the human body?", [("A", "Energy storage"), ("B", "Growth and repair of tissues"), ("C", "Insulation"), ("D", "Hormone regulation")], "B", f"{FH_EMBED}/image37.jpeg"),
    (5, "Which of the following is a disaccharide?", [("A", "Glucose"), ("B", "Maltose"), ("C", "Cellulose"), ("D", "Glycogen")], "B", None),
    (6, "Why should a diabetic patient 糖尿病患者 avoid consuming glucose directly?", [("A", "It causes dehydration."), ("B", "It raises blood sugar levels rapidly."), ("C", "It is difficult to digest."), ("D", "It damages the liver.")], "B", None),
    (7, "Which biomolecule is primarily used for quick energy in the body?", [("A", "Proteins"), ("B", "Lipids"), ("C", "Carbohydrates"), ("D", "Steroids")], "C", f"{FH_EMBED}/image38.jpeg"),
    (8, "Which of the following is a structural component in plant cell walls?", [("A", "Glycogen"), ("B", "Cellulose"), ("C", "Starch"), ("D", "Fructose")], "B", f"{FH_EMBED}/image39.jpeg"),
    (9, "What happens if a starving 飢餓 patient consumes glucose instead of bread?", [("A", "Glucose is digested more slowly."), ("B", "Glucose provides immediate energy."), ("C", "Bread causes dehydration."), ("D", "Bread is absorbed faster.")], "B", f"{FH_EMBED}/image40.jpeg"),
    (10, "Which of the following lipids is essential for cell membrane structure?", [("A", "Triglycerides"), ("B", "Phospholipids"), ("C", "Steroids"), ("D", "Fatty acids")], "B", None),
    (11, "Which carbohydrate is a sweetener found in fruits?", [("A", "Glucose"), ("B", "Fructose"), ("C", "Sucrose"), ("D", "Maltose")], "B", None),
    (12, "What is the stored form of energy in animals?", [("A", "Starch"), ("B", "Cellulose"), ("C", "Glycogen"), ("D", "Glucose")], "C", None),
    (13, "Which of the following speeds up reactions in the human body?", [("A", "Triglycerides"), ("B", "Glucose"), ("C", "Hormones"), ("D", "Enzymes")], "D", None),
    (14, "What is the main energy source for respiration in humans?", [("A", "Proteins"), ("B", "Glucose"), ("C", "Lipids"), ("D", "Vitamins")], "B", None),
    (15, "Which of the following is NOT a function of proteins?", [("A", "Growth and repair"), ("B", "Enzyme production"), ("C", "Energy storage"), ("D", "Hormone regulation")], "C", None),
    (16, "Which part of the body stores glycogen?", [("A", "Brain"), ("B", "Liver and muscles"), ("C", "Heart"), ("D", "Kidneys")], "B", None),
    (17, "Which of the following is a lipid that regulates body functions as a hormone?", [("A", "Cholesterol"), ("B", "Glycerol"), ("C", "Phospholipid"), ("D", "Triglyceride")], "A", f"{FH_EMBED}/image41.jpeg"),
    (18, "Which carbohydrate is used as a respiratory substrate in humans?", [("A", "Lactose"), ("B", "Starch"), ("C", "Glucose"), ("D", "Cellulose")], "C", None),
    (19, "Why is milk a good source of energy for infants?", [("A", "It contains proteins only."), ("B", "It contains lactose, a disaccharide."), ("C", "It contains starch."), ("D", "It contains cellulose.")], "B", None),
    (20, "Why do athletes consume food rich in starch before a match?", [("A", "To build muscle mass."), ("B", "To store energy for long-term use."), ("C", "To provide glucose steadily for energy during the race."), ("D", "To repair tissues.")], "C", f"{FH_EMBED}/image42.jpeg"),
]


def _make_functions_mcq_pages() -> list[dict]:
    pages: list[dict] = []
    for i, (_q_num, question, choices, answer, img) in enumerate(FUNCTIONS_NAMES_MCQS, start=1):
        label = f"{FUNCTIONS_NAMES_PREFIX} MCQ {i}"
        if isinstance(img, list):
            body = _mcq_multi_img_html(i, question, choices, answer, img)
            thumb = img[0]
            phases = "pic,q,a"
        elif img:
            body = _mcq_body_html(i, question, choices, answer, img=img)
            thumb = img
            phases = "pic,q,a"
        else:
            body = _mcq_body_html(i, question, choices, answer)
            thumb = None
            phases = "q,a"
        pages.append(
            rich_page(
                label,
                f'<div class="deck-slide__inner"><h2 class="deck-slide__title deck-slide__title--compact">{label}</h2><div class="deck-slide__body">{body}</div></div>',
                thumb=thumb,
                thumb_ph=f"Q{i}" if not thumb else None,
                phases=phases,
            )
        )
    return pages


def _make_functions_tf_page(label_suffix: str, items: list[tuple[int, str, str]]) -> dict:
    return _make_basics_tf_page(f"{FUNCTIONS_NAMES_PREFIX} {label_suffix}", items)


def _make_functions_fill_page(
    label_suffix: str,
    blanks: list[tuple[int, str, str]],
    *,
    with_bank: bool,
) -> dict:
    word_bank = ""
    if with_bank:
        word_bank = (
            '<p class="deck-text-sm mb-2 step step-text" data-phase="q"><strong>Choose from the following:</strong></p>'
            '<div class="word-bank step step-text" data-phase="q">'
            '<span class="bio-tag">glycogen</span><span class="bio-tag">starch</span>'
            '<span class="bio-tag">glucose</span><span class="bio-tag">enzymes</span>'
            '<span class="bio-tag">proteins</span><span class="bio-tag">fructose</span>'
            '<span class="bio-tag">lactose</span><span class="bio-tag">triglycerides</span>'
            '<span class="bio-tag">phospholipids</span><span class="bio-tag">cellulose</span>'
            "</div>"
        )
    lines = []
    for i, (_n, stem, ans) in enumerate(blanks, start=1):
        lines.append(
            f'<p class="deck-text mb-2 step step-text" data-phase="q"><strong>{i}.</strong>{stem}'
            f'<span class="fill-dash" data-phase="q">________</span>'
            f'<span class="fill-blank hidden-answer" data-phase="a">{ans}</span></p>'
        )
    body = (
        word_bank
        + "".join(lines)
        + '<div class="answer-panel hidden-answer step" data-phase="a">'
        '<div class="answer-badge">Answers revealed ↑</div></div>'
    )
    label = f"{FUNCTIONS_NAMES_PREFIX} {label_suffix}"
    return rich_page(
        label,
        f'<div class="deck-slide__inner"><h2 class="deck-slide__title deck-slide__title--compact">{label}</h2><div class="deck-slide__body">{body}</div></div>',
        thumb_ph="Fill",
        phases="q,a",
        scroll=True,
    )


def _mono_carb_table_rows() -> list[tuple[str, str, str]]:
    return [
        ("Glucose 葡萄糖", "Main respiratory (呼吸作用) fuel for quick energy", "Candy"),
        ("Fructose 果糖", "Sweetener (甜味劑)", "Fruit"),
        ("Galactose 半乳糖", "Component of lactose (乳糖)", "Milk"),
    ]


def _di_carb_table_rows() -> list[tuple[str, str, str]]:
    return [
        ("Maltose 麥芽糖", "Provides energy (提供能量)", "Malt (麥芽)"),
        ("Sucrose 蔗糖", "Sweetener (甜味劑)", "Sugarcane (蔗), fruits"),
        ("Lactose 乳糖", "Sugar in milk", "Milk"),
    ]


def _poly_carb_table_rows() -> list[tuple[str, str, str]]:
    return [
        ("Starch 澱粉", "Energy storage in plants", "Potato, grains (穀物)"),
        ("Cellulose 纖維素", "Structural component in plant cell wall (細胞壁)", "Vegetables"),
        ("Glycogen 肝醣", "Energy storage in animals", "Liver (肝) and muscles"),
    ]


def _full_carb_table_sections() -> list[tuple[str, list[tuple[str, str, str]]]]:
    return [
        ("Monosaccharides 單醣", _mono_carb_table_rows()),
        ("Disaccharides 雙醣", _di_carb_table_rows()),
        ("Polysaccharides 多醣", _poly_carb_table_rows()),
    ]


def _carb_category_table_html(
    sections: list[tuple[str, list[tuple[str, str, str]]]],
    *,
    compact: bool = False,
    carb_full: bool = False,
) -> str:
    table_class = "w-full deck-text-sm"
    if carb_full:
        table_class += " deck-table--carb-full"
    elif compact:
        table_class += " deck-table--compact"
    body_parts: list[str] = []
    for category, rows in sections:
        for i, (name, func, found) in enumerate(rows):
            if i == 0:
                body_parts.append(
                    f'<tr class="step step-text">'
                    f'<td class="align-middle text-center font-semibold" rowspan="{len(rows)}">'
                    f"{category}</td>"
                    f'<td class="text-primary">{name}</td><td>{func}</td><td>{found}</td></tr>'
                )
            else:
                body_parts.append(
                    f'<tr class="step step-text">'
                    f'<td class="text-primary">{name}</td><td>{func}</td><td>{found}</td></tr>'
                )
    return (
        '<div class="rounded-3xl overflow-hidden glass-frost border border-white/40 shadow-xl">'
        f'<table class="{table_class}"><thead><tr class="bg-primary/10">'
        "<th>Category</th><th>Names</th><th>Functions</th><th>Found in</th></tr></thead><tbody>"
        f'{"".join(body_parts)}</tbody></table></div>'
    )


def _mono_carb_table_html() -> str:
    return _carb_category_table_html([("Monosaccharides 單醣", _mono_carb_table_rows())])


def _di_carb_table_html() -> str:
    return _carb_category_table_html([("Disaccharides 雙醣", _di_carb_table_rows())])


def _poly_carb_table_html() -> str:
    return _carb_category_table_html([("Polysaccharides 多醣", _poly_carb_table_rows())])


def _full_carb_table_html() -> str:
    return _carb_category_table_html(_full_carb_table_sections(), carb_full=True)


def _make_carb_table_copy_page(
    label: str,
    table_html: str,
    *,
    carb_full: bool = False,
) -> dict:
    img31 = f"{FH_EMBED}/image31.jpeg"
    layout_class = "layout-fig-top layout-fig-top--dense"
    if carb_full:
        layout_class += " layout-fig-top--carb-full"
    return rich_page(
        label,
        f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">{label}</h2><div class="deck-slide__body"><div class="{layout_class}"><div class="layout-fig-top__media"><figure class="fig-box fig-wide step step-pic"><img src="{img31}" alt="Carbohydrates"/></figure></div><div class="layout-fig-top__text">{table_html}</div></div></div></div>""",
        thumb=img31,
        scroll=True,
    )


def make_mono_carb_table_copy(label: str) -> dict:
    return _make_carb_table_copy_page(label, _mono_carb_table_html())


def make_di_carb_table_copy(label: str) -> dict:
    return _make_carb_table_copy_page(label, _di_carb_table_html())


def make_poly_carb_table_copy(label: str) -> dict:
    return _make_carb_table_copy_page(label, _poly_carb_table_html())


def make_full_carb_table_page(label: str = FURTHER_CARB_TABLE) -> dict:
    return _make_carb_table_copy_page(
        label,
        _full_carb_table_html(),
        carb_full=True,
    )


def _protein_table_rows() -> list[tuple[str, str, str]]:
    return [
        (
            "Amino acids 胺基酸",
            "20 types, basic building blocks of proteins",
            "All cells",
        ),
        ("Dipeptide 二肽", "2 amino acids", "All cells"),
        ("Polypeptide 多肽 (Linear /chain)", "Many amino acids", "All cells"),
        (
            "Protein 蛋白質 (specific 3D conformation)",
            _table_cell_bullets(
                [
                    "Growth and repair 修復 of tissues 組織",
                    "Cell membranes",
                    "Enzymes 酶: Speed up reactions",
                    "Most hormones 荷爾蒙 (in blood): Regulate body functions",
                ]
            ),
            "Meat, eggs, beans",
        ),
    ]


def _protein_table_html(label: str) -> str:
    img33 = f"{FH_EMBED}/image33.jpeg"
    img34 = f"{FH_EMBED}/image34.png"
    return (
        f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">{label}</h2><div class="deck-slide__body">"""
        f"""<div class="layout-fig-top layout-fig-top--dense"><div class="layout-fig-top__media">"""
        f"""<div class="fig-grid-2"><figure class="fig-box fig-wide step step-pic"><img src="{img33}" alt="Proteins"/></figure>"""
        f"""<figure class="fig-box fig-wide step step-pic"><img src="{img34}" alt="Protein structure"/></figure></div>"""
        f"""</div><div class="layout-fig-top__text">{_table_rows_html(_protein_table_rows())}</div></div></div></div>"""
    )


def make_protein_table_copy(label: str) -> dict:
    img33 = f"{FH_EMBED}/image33.jpeg"
    return rich_page(
        label,
        _protein_table_html(label),
        thumb=img33,
        scroll=True,
    )


def _split_png_page(
    base: dict,
    frames: list[str],
    *,
    start: int | None = None,
    end: int | None = None,
) -> dict:
    out = {
        **base,
        "frames": frames,
        "clicks": max(0, len(frames) - 1),
        "thumb": frames[-1] if frames else base.get("thumb"),
    }
    if start is not None:
        out["startFrame"] = start
    if end is not None:
        out["endFrame"] = end
    if "frameMeta" in base:
        frame_set = set(frames)
        out["frameMeta"] = [m for m in base["frameMeta"] if m.get("src") in frame_set]
    for key in ("type", "html", "thumbPh", "inserted", "scroll", "movedFrom"):
        out.pop(key, None)
    return out


def _split_page_after_step(
    base: dict,
    frames: list[str],
    step: int,
    *,
    start: int | None = None,
    end: int | None = None,
) -> tuple[dict, dict] | None:
    """Split after the first ``step`` frames (1-based step index)."""
    if len(frames) <= step:
        return None
    head_frames = frames[:step]
    tail_frames = frames[step:]
    head_end = start + step - 1 if start is not None else None
    tail_start = start + step if start is not None else None
    head = _split_png_page(base, head_frames, start=start, end=head_end)
    tail = _split_png_page(base, tail_frames, start=tail_start, end=end)
    return head, tail


def _insert_carb_copy_between_di_split(
    pages: list[dict],
    copy_page: dict,
) -> tuple[list[dict], bool]:
    """Insert copy between DI head (…102) and tail (103…) if already split."""
    out: list[dict] = []
    inserted = False
    i = 0
    while i < len(pages):
        p = pages[i]
        if p.get("label") == copy_page.get("label"):
            i += 1
            continue
        if (
            not inserted
            and p.get("label", "").startswith(DI_LABEL)
            and p.get("frames", [])[-1:] == [DI_STEP5_FRAME]
        ):
            middle: list[dict] = []
            j = i + 1
            while j < len(pages) and pages[j].get("label") in TABLE_COPY_LABELS:
                if pages[j].get("label") != copy_page.get("label"):
                    middle.append(pages[j])
                j += 1
            if (
                j < len(pages)
                and pages[j].get("label", "").startswith(DI_LABEL)
                and pages[j].get("frames", [""])[:1] == [DI_TAIL_START_FRAME]
            ):
                out.extend([p, *middle, copy_page, pages[j]])
                inserted = True
                i = j + 1
                continue
        out.append(p)
        i += 1
    return out, inserted


def insert_carb_table_copy_after_p13_step5(pages: list[dict]) -> list[dict]:
    """Split Di-saccharides after slide-102 (HUD p.13 step 5) and insert mono carb table."""
    copy_page = make_mono_carb_table_copy(INSERTED_CARB_TABLE_COPY_P13)
    out, inserted = _insert_carb_copy_between_di_split(pages, copy_page)
    if inserted:
        for i, page in enumerate(out, start=1):
            page["page"] = i
        return out

    out = []
    inserted = False
    for p in pages:
        if p.get("label") in (INSERTED_CARB_TABLE_COPY_P13, LEGACY_CARB_TABLE_COPY_P14):
            continue
        if (
            not inserted
            and p.get("label", "").startswith(DI_LABEL)
            and DI_STEP5_FRAME in p.get("frames", [])
            and DI_TAIL_START_FRAME in p.get("frames", [])
        ):
            frames = list(p.get("frames", []))
            split = _split_page_after_step(
                p,
                frames,
                5,
                start=p.get("startFrame"),
                end=p.get("endFrame"),
            )
            if split is None:
                out.append(p)
                out.append(copy_page)
                inserted = True
                continue
            head, tail = split
            out.extend([head, copy_page, tail])
            inserted = True
            continue
        out.append(p)
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def move_poly_early_steps_1_4_after_maltose_hydro(pages: list[dict]) -> list[dict]:
    """Move Poly saccharides steps 1–4 (114–117) to immediately after HUD p.19.

    Anchors on ``1b. Maltose hydrolysis · bright``. Leaves a step-5-only page
    (slide-118) before the carb table copy / poly tail.
    """
    anchor_idx = next(
        (i for i, p in enumerate(pages) if p.get("label") == INSERTED_MALTOSE_HYDRO),
        None,
    )
    if anchor_idx is None:
        return pages

    if (
        anchor_idx + 1 < len(pages)
        and pages[anchor_idx + 1].get("label", "").startswith(POLY_LABEL)
        and pages[anchor_idx + 1].get("frames") == POLY_EARLY_STEPS_1_4_FRAMES
    ):
        return pages

    source_idx = None
    for i, p in enumerate(pages):
        if not p.get("label", "").startswith(POLY_LABEL):
            continue
        frames = p.get("frames", [])
        if frames[:4] == POLY_EARLY_STEPS_1_4_FRAMES:
            source_idx = i
            break
        if POLY_EARLY_HEAD_FRAME in (frames[:1] or []) and all(
            f in frames for f in POLY_EARLY_STEPS_1_4_FRAMES
        ):
            source_idx = i
            break

    if source_idx is None:
        return pages

    p = pages[source_idx]
    frames = list(p.get("frames", []))

    if frames == POLY_EARLY_STEPS_1_4_FRAMES:
        head_page = pages.pop(source_idx)
    else:
        split = _split_page_after_step(
            p,
            frames,
            4,
            start=p.get("startFrame"),
            end=p.get("endFrame"),
        )
        if split is None:
            return pages
        head_page, remainder = split
        pages[source_idx] = remainder

        rem_frames = list(pages[source_idx].get("frames", []))
        if (
            len(rem_frames) > 1
            and rem_frames[0] == POLY_EARLY_STEP5_FRAME
            and rem_frames[1] == POLY_EARLY_TAIL_START
        ):
            step5_split = _split_page_after_step(
                pages[source_idx],
                rem_frames,
                1,
                start=pages[source_idx].get("startFrame"),
                end=pages[source_idx].get("endFrame"),
            )
            if step5_split:
                step5_page, tail_page = step5_split
                pages[source_idx] = step5_page
                pages.insert(source_idx + 1, tail_page)

    anchor_idx = next(
        (i for i, p in enumerate(pages) if p.get("label") == INSERTED_MALTOSE_HYDRO),
        None,
    )
    if anchor_idx is None:
        return pages
    pages.insert(anchor_idx + 1, head_page)

    for i, page in enumerate(pages, start=1):
        page["page"] = i
    return pages


def _insert_carb_copy_between_poly_early_split(
    pages: list[dict],
    copy_page: dict,
) -> tuple[list[dict], bool]:
    """Insert copy between early Poly head (…118) and tail (119…) if already split."""
    out: list[dict] = []
    inserted = False
    i = 0
    while i < len(pages):
        p = pages[i]
        if p.get("label") == copy_page.get("label"):
            i += 1
            continue
        if (
            not inserted
            and p.get("label", "").startswith(POLY_LABEL)
            and p.get("frames", [])[-1:] == [POLY_EARLY_STEP5_FRAME]
        ):
            middle: list[dict] = []
            j = i + 1
            while j < len(pages) and pages[j].get("label") in TABLE_COPY_LABELS:
                if pages[j].get("label") != copy_page.get("label"):
                    middle.append(pages[j])
                j += 1
            if (
                j < len(pages)
                and pages[j].get("label", "").startswith(POLY_LABEL)
                and pages[j].get("frames", [""])[:1] == [POLY_EARLY_TAIL_START]
            ):
                out.extend([p, *middle, copy_page, pages[j]])
                inserted = True
                i = j + 1
                continue
        out.append(p)
        i += 1
    return out, inserted


def insert_carb_table_copy_after_poly_early_step5(pages: list[dict]) -> list[dict]:
    """Split first Poly saccharides page after slide-118 (HUD p.22 step 5) and insert copy."""
    copy_page = make_di_carb_table_copy(INSERTED_CARB_TABLE_COPY_P22)
    out, inserted = _insert_carb_copy_between_poly_early_split(pages, copy_page)
    if inserted:
        for i, page in enumerate(out, start=1):
            page["page"] = i
        return out

    out = []
    inserted = False
    for p in pages:
        if p.get("label") in (INSERTED_CARB_TABLE_COPY_P22, LEGACY_CARB_TABLE_COPY_P21):
            continue
        if (
            not inserted
            and p.get("label", "").startswith(POLY_LABEL)
            and p.get("frames", [""])[:1] == [POLY_EARLY_HEAD_FRAME]
            and POLY_EARLY_STEP5_FRAME in p.get("frames", [])
            and POLY_EARLY_TAIL_START in p.get("frames", [])
        ):
            frames = list(p.get("frames", []))
            split = _split_page_after_step(
                p,
                frames,
                5,
                start=p.get("startFrame"),
                end=p.get("endFrame"),
            )
            if split is None:
                out.append(p)
                continue
            head, tail = split
            out.extend([head, copy_page, tail])
            inserted = True
            continue
        out.append(p)
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_carb_table_copy_after_carbs_summary_step5(pages: list[dict]) -> list[dict]:
    """Insert carb names table before Basic-carbohydrates Concept Checks.

    ch5-play HUD p.27 was Scenario 8; the carb summary (slide-146…150 step 5)
    now precedes Basic-carbohydrates · Concept Checks. Place the copy immediately
    before that quiz header (after the carb summary content, before MCQs).
    """
    copy_page = make_poly_carb_table_copy(INSERTED_CARB_TABLE_COPY_P27)
    out: list[dict] = []
    inserted = False
    for p in pages:
        if p.get("label") == INSERTED_CARB_TABLE_COPY_P27:
            continue
        if not inserted and p.get("label") == INSERTED_BASICS_CARB_HEADER:
            out.append(copy_page)
            inserted = True
        out.append(p)
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_protein_table_copy_after_p14_step5(pages: list[dict]) -> list[dict]:
    """Insert protein names table after HUD p.14 (Monosaccharides 單醣).

    If the carb table copy already follows Monosaccharides, place this copy
    immediately after that carb copy (still after p.14 step 5).
    """
    copy_page = make_protein_table_copy(INSERTED_PROTEIN_TABLE_COPY_P14)
    out: list[dict] = []
    inserted = False
    i = 0
    while i < len(pages):
        p = pages[i]
        if p.get("label") == INSERTED_PROTEIN_TABLE_COPY_P14:
            i += 1
            continue
        out.append(p)
        if not inserted and p.get("label") == MONOSACCHARIDES_LABEL:
            nxt = pages[i + 1] if i + 1 < len(pages) else None
            if nxt is not None and nxt.get("label") in (
                INSERTED_CARB_TABLE_COPY_P13,
                LEGACY_CARB_TABLE_COPY_P14,
            ):
                i += 1
                continue
            out.append(copy_page)
            inserted = True
        elif not inserted and p.get("label") in (
            INSERTED_CARB_TABLE_COPY_P13,
            LEGACY_CARB_TABLE_COPY_P14,
        ):
            out.append(copy_page)
            inserted = True
        i += 1
    if not inserted:
        return pages
    for j, page in enumerate(out, start=1):
        page["page"] = j
    return out


def _insert_table_copy_between_poly_starch_split(
    pages: list[dict],
    copy_page: dict,
) -> tuple[list[dict], bool]:
    """Insert copy between Poly head (…141) and tail (142…), after other table copies."""
    out: list[dict] = []
    inserted = False
    i = 0
    while i < len(pages):
        p = pages[i]
        if p.get("label") == copy_page.get("label"):
            i += 1
            continue
        if (
            not inserted
            and p.get("label", "").startswith(POLY_LABEL)
            and p.get("frames", [])[-1:] == [POLY_STARCH_STEP5_FRAME]
        ):
            middle: list[dict] = []
            j = i + 1
            while j < len(pages) and pages[j].get("label") in TABLE_COPY_LABELS:
                if pages[j].get("label") != copy_page.get("label"):
                    middle.append(pages[j])
                j += 1
            if (
                j < len(pages)
                and pages[j].get("label", "").startswith(POLY_LABEL)
                and pages[j].get("frames", [""])[:1] == [STARCH_ANCHOR_FRAME]
            ):
                out.extend([p, *middle, copy_page, pages[j]])
                inserted = True
                i = j + 1
                continue
        out.append(p)
        i += 1
    return out, inserted


def insert_protein_table_copy_after_poly_starch_step5(pages: list[dict]) -> list[dict]:
    """Split starch-ring Poly page after slide-141 (HUD p.21 step 5) and insert copy."""
    copy_page = make_protein_table_copy(INSERTED_PROTEIN_TABLE_COPY_P21)
    out, inserted = _insert_table_copy_between_poly_starch_split(pages, copy_page)
    if inserted:
        for i, page in enumerate(out, start=1):
            page["page"] = i
        return out

    out = []
    inserted = False
    for p in pages:
        if p.get("label") == INSERTED_PROTEIN_TABLE_COPY_P21:
            continue
        if (
            not inserted
            and p.get("label", "").startswith(POLY_LABEL)
            and STARCH_ANCHOR_FRAME in p.get("frames", [])
            and POLY_STARCH_STEP5_FRAME in p.get("frames", [])
        ):
            frames = list(p.get("frames", []))
            split = _split_page_after_step(
                p,
                frames,
                5,
                start=p.get("startFrame"),
                end=p.get("endFrame"),
            )
            if split is None:
                out.append(p)
                continue
            head, tail = split
            out.extend([head, copy_page, tail])
            inserted = True
            continue
        out.append(p)
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def insert_protein_table_copy_after_carbs_summary_step5(pages: list[dict]) -> list[dict]:
    """Insert protein names table before Basic-carbohydrates Concept Checks.

    Mirrors the carb copy anchor at HUD p.27: after the carb summary, before MCQs.
    If the carb table copy is already there, place this copy immediately after it.
    """
    copy_page = make_protein_table_copy(INSERTED_PROTEIN_TABLE_COPY_P27)
    out: list[dict] = []
    inserted = False
    for p in pages:
        if p.get("label") == INSERTED_PROTEIN_TABLE_COPY_P27:
            continue
        if not inserted and p.get("label") == INSERTED_BASICS_CARB_HEADER:
            out.append(copy_page)
            inserted = True
        out.append(p)
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


LIPID_FOOD_BANNER_IMG = f"{FH_EMBED}/image32.jpeg"
LIPID_MEMBRANE_IMG = f"{FH_EMBED}/cell-membrane-structure.png"
LIPID_MEMBRANE_SOURCE = (
    DECK_ROOT.parents[1]
    / "public"
    / "food-nutrition"
    / "assets"
    / "cell_membrane_structure.png"
)


def _lipid_table_rows() -> list[tuple[str, str, str, str]]:
    return [
        (
            "Triglycerides 三酸甘油酯",
            "Glycerol 甘油 + 3 fatty acids 脂肪酸",
            "Energy storage 能量儲存, insulation 保溫, organ protection 器官保護",
            "Fats 脂肪 and oils 油",
        ),
        (
            "Phospholipids 磷脂質",
            "Phosphate 磷 + Glycerol 甘油 + 2 fatty acids 脂肪酸",
            "Main component of cell membranes 細胞膜",
            "Cell membrane",
        ),
        (
            "Steroids 類固醇",
            "e.g. Cholesterol 膽固醇",
            "Sex hormones 性荷爾蒙, cell membranes",
            "Body tissues",
        ),
    ]


def _lipid_table_html() -> str:
    rows = _lipid_table_rows()
    body_parts: list[str] = []
    for i, (name, components, functions, found) in enumerate(rows):
        if i == 0:
            body_parts.append(
                f'<tr><td class="align-middle text-center font-semibold" rowspan="{len(rows)}">'
                f"Lipids</td>"
                f'<td class="text-primary">{name}</td><td>{components}</td>'
                f"<td>{functions}</td><td>{found}</td></tr>"
            )
        else:
            body_parts.append(
                f'<tr><td class="text-primary">{name}</td><td>{components}</td>'
                f"<td>{functions}</td><td>{found}</td></tr>"
            )
    return (
        '<div class="rounded-3xl overflow-hidden glass-frost border border-white/40 shadow-xl">'
        '<table class="w-full deck-text-sm"><thead><tr class="bg-primary/10">'
        "<th>Category</th><th>Names</th><th>Components</th>"
        "<th>Functions</th><th>Found in</th></tr></thead><tbody>"
        f'{"".join(body_parts)}</tbody></table></div>'
    )


def prepare_lipids_table_assets() -> None:
    """Copy food-nutrition cell membrane diagram into ch5fh-assets."""
    import shutil

    CH5FH_ASSETS.mkdir(parents=True, exist_ok=True)
    dst = CH5FH_ASSETS / "cell-membrane-structure.png"
    if not LIPID_MEMBRANE_SOURCE.exists():
        print(f"skip lipid membrane asset — missing {LIPID_MEMBRANE_SOURCE}")
        return
    if dst.exists() and dst.stat().st_mtime >= LIPID_MEMBRANE_SOURCE.stat().st_mtime:
        return
    shutil.copy2(LIPID_MEMBRANE_SOURCE, dst)
    print("copied lipid membrane asset cell-membrane-structure.png")


def make_lipids_table_page() -> dict:
    return rich_page(
        FURTHER_LIPID_TABLE,
        f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">{FURTHER_LIPID_TABLE}</h2><div class="deck-slide__body"><div class="layout-fig-top layout-fig-top--dense"><div class="layout-fig-top__media"><div class="fig-grid-2"><figure class="fig-box fig-wide step step-pic"><img src="{LIPID_FOOD_BANNER_IMG}" alt="Foods rich in lipids"/></figure><figure class="fig-box fig-wide step step-pic"><img src="{LIPID_MEMBRANE_IMG}" alt="Cell membrane structure"/></figure></div></div><div class="layout-fig-top__text">{_lipid_table_html()}</div></div></div></div>""",
        thumb=LIPID_FOOD_BANNER_IMG,
        scroll=True,
    )


def refresh_carb_table_pages(pages: list[dict]) -> None:
    """Re-sync carb table HTML from course-note row definitions."""
    for p in pages:
        label = p.get("label", "")
        if label in (INSERTED_CARB_TABLE_COPY_P13, LEGACY_CARB_TABLE_COPY_P14):
            p["html"] = make_mono_carb_table_copy(label)["html"]
        elif label in (INSERTED_CARB_TABLE_COPY_P22, LEGACY_CARB_TABLE_COPY_P21):
            p["html"] = make_di_carb_table_copy(label)["html"]
        elif label == INSERTED_CARB_TABLE_COPY_P27:
            p["html"] = make_poly_carb_table_copy(label)["html"]
        elif label == FURTHER_CARB_TABLE:
            p["html"] = make_full_carb_table_page()["html"]


def refresh_biomolecule_table_pages(pages: list[dict]) -> None:
    """Re-sync Lipids / Proteins table HTML from course-note row definitions."""
    for p in pages:
        label = p.get("label", "")
        if label == FURTHER_LIPID_TABLE:
            p["html"] = make_lipids_table_page()["html"]
        elif label == FURTHER_PROTEIN_TABLE or label.startswith(f"{FURTHER_PROTEIN_TABLE} ("):
            p["html"] = _protein_table_html(label)


def insert_lipids_table_after_fatty_acids(pages: list[dict]) -> list[dict]:
    """Place Lipids names & functions immediately after + 2 Fatty acids (HUD p.60).

    ch5-play HUD = deck index + 3 (two PREFIX slides). Lipid table lands at HUD p.61,
    before Basic-Lipid quizzes.
    """
    anchor_idx = next(
        (i for i, p in enumerate(pages) if p.get("label") == FATTY_ACIDS_PLUS_LABEL),
        None,
    )
    if anchor_idx is None:
        return pages

    lipid_idx = next(
        (i for i, p in enumerate(pages) if p.get("label") == FURTHER_LIPID_TABLE),
        None,
    )
    target_idx = anchor_idx + 1
    if lipid_idx == target_idx:
        return pages

    if lipid_idx is not None:
        lipid_page = pages.pop(lipid_idx)
        if lipid_idx < anchor_idx:
            anchor_idx -= 1
    else:
        lipid_page = make_lipids_table_page()

    pages.insert(anchor_idx + 1, lipid_page)
    for i, page in enumerate(pages, start=1):
        page["page"] = i
    return pages


def _tf_answer_symbol(answer: str) -> str:
    return "✔" if answer.startswith("✔") else "✘"


def _format_mcq_answer_rows(mcqs: list, *, per_row: int = 10) -> str:
    pairs = [f"{i}{ans}" for i, (_, _, _, ans, _) in enumerate(mcqs, start=1)]
    rows = [
        " ".join(pairs[i : i + per_row]) for i in range(0, len(pairs), per_row)
    ]
    return "\n".join(f"<tr><td>{row}</td></tr>" for row in rows)


def _format_tf_answer_line(items: list[tuple[int, str, str]]) -> str:
    return " ".join(
        f"{i}{_tf_answer_symbol(ans)}" for i, (_, _, ans) in enumerate(items, start=1)
    )


def _format_fill_answer_line(blanks: list[tuple[int, str, str]]) -> str:
    return " · ".join(ans for _, _, ans in blanks)


def make_answer_key_pages() -> list[dict]:
    """Rebuild answer keys from quiz data (Saturday notes order, deck Q numbering)."""
    basics_mcqs = BASICS_CARB_MCQS + BASICS_LIPID_MCQS + BASICS_PROTEIN_MCQS
    basics_tf = BASICS_CARB_TF + BASICS_LIPID_TF + BASICS_PROTEIN_TF
    basics_fills = BASICS_FILLS_SAT_ORDER
    functions_tf = FUNCTIONS_TF_1_5 + FUNCTIONS_TF_6_10 + FUNCTIONS_TF_11_15

    return [
        rich_page(
            ANSWER_KEY_BASICS_MCQ,
            f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">Answer Key — Basics MCQs</h2><div class="deck-slide__body"><div class="rounded-3xl overflow-hidden glass-frost border border-white/40 shadow-xl"><table class="w-full deck-text-sm"><tbody>
{_format_mcq_answer_rows(basics_mcqs)}
</tbody></table></div></div></div>""",
            thumb_ph="Key",
            scroll=True,
        ),
        rich_page(
            ANSWER_KEY_BASICS_TF_FILL,
            f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">Answer Key — Basics T/F &amp; Fill</h2><div class="deck-slide__body"><p class="deck-text-sm"><strong>T/F:</strong> {_format_tf_answer_line(basics_tf)}</p></div></div>""",
            thumb_ph="Key",
            scroll=True,
        ),
        rich_page(
            ANSWER_KEY_FUNCTIONS_MCQ,
            f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">Answer Key — Functions MCQs</h2><div class="deck-slide__body"><div class="rounded-3xl overflow-hidden glass-frost border border-white/40 shadow-xl"><table class="w-full deck-text-sm"><tbody>
{_format_mcq_answer_rows(FUNCTIONS_NAMES_MCQS)}
</tbody></table></div></div></div>""",
            thumb_ph="Key",
            scroll=True,
        ),
        rich_page(
            ANSWER_KEY_FUNCTIONS_TF_FILL,
            f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">Answer Key — Functions T/F &amp; Fill</h2><div class="deck-slide__body"><p class="deck-text-sm"><strong>T/F:</strong> {_format_tf_answer_line(functions_tf)}</p>
<p class="deck-text-sm mt-3"><strong>Fill (Functions):</strong> {_format_fill_answer_line(FUNCTIONS_FILLS)}</p>
<p class="deck-text-sm mt-3"><strong>Fill (Basics):</strong> {_format_fill_answer_line(basics_fills)}</p></div></div>""",
            thumb_ph="Key",
            scroll=True,
        ),
    ]


def make_further_details_pages() -> list[dict]:
    img31 = f"{FH_EMBED}/image31.jpeg"
    img33 = f"{FH_EMBED}/image33.jpeg"
    return [
        rich_page(
            FURTHER_DETAILS_HEADER,
            f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">{FURTHER_DETAILS_HEADER}</h2><div class="deck-slide__body"><div class="text-center"><h2 class="font-headline-xl"><span class="hl hl-u step step-text">Further Details</span></h2><p class="deck-text">Carbohydrates · Lipids · Proteins — Names · Functions · Found in</p></div></div></div>""",
            thumb_ph="FD",
            center=True,
        ),
        make_full_carb_table_page(),
        rich_page(
            FURTHER_PROTEIN_TABLE,
            _protein_table_html(FURTHER_PROTEIN_TABLE),
            thumb=img33,
            scroll=True,
        ),
        rich_page(
            INSERTED_FUNCTIONS_NAMES_HEADER,
            f"""<div class="deck-slide__inner"><h2 class="deck-slide__title">{INSERTED_FUNCTIONS_NAMES_HEADER}</h2><div class="deck-slide__body"><div class="text-center"><h2 class="font-headline-xl"><span class="hl hl-b step step-text">Concept Checks</span></h2><p class="deck-text">Functions and Names of Carbohydrates, Proteins and Lipids</p></div></div></div>""",
            thumb_ph="CC",
            center=True,
        ),
        *_make_functions_mcq_pages(),
        _make_functions_tf_page("T/F 1–5", FUNCTIONS_TF_1_5),
        _make_functions_tf_page("T/F 6–10", FUNCTIONS_TF_6_10),
        _make_functions_tf_page("T/F 11–15", FUNCTIONS_TF_11_15),
        rich_page(
            INSERTED_END_SLIDE,
            """<div class="deck-slide__inner"><h2 class="deck-slide__title">完</h2><div class="deck-slide__body"><div class="text-center"><h2 class="font-headline-xl"><span class="hl hl-b step step-text">Ch 5 Food and Human</span></h2><p class="deck-text">Ch 12.1–2 Biomolecules</p></div></div></div>""",
            thumb_ph="完",
            center=True,
        ),
    ]


def insert_further_slides_before_fried_chicken(pages: list[dict]) -> list[dict]:
    """Insert class-slides p.64–99 (Further Details through 完) before 炸雞餐."""
    if any(p.get("label") == FURTHER_DETAILS_HEADER for p in pages):
        return pages
    further_pages = make_further_details_pages()
    out: list[dict] = []
    inserted = False
    for p in pages:
        if not inserted and p.get("label") == NUTRITION_LABEL:
            out.extend(further_pages)
            inserted = True
        out.append(p)
    if not inserted:
        return pages
    for i, page in enumerate(out, start=1):
        page["page"] = i
    return out


def _class_assets_dir() -> Path | None:
    candidates = [
        DECK_ROOT.parent / "ch5-food-human-summer" / "assets",
        Path(__file__).resolve().parents[4]
        / "S3 Bio"
        / "Users"
        / "jyleung"
        / "Cursor"
        / "S3-Bio"
        / "slides"
        / "ch5-food-human-summer"
        / "assets",
    ]
    seen: set[Path] = set()
    for d in candidates:
        if d in seen:
            continue
        seen.add(d)
        if d.exists():
            return d
    return None


def copy_class_quiz_assets(names: tuple[str, ...]) -> None:
    """Copy quiz images from class-slides assets into ch5fh-assets."""
    import shutil

    CH5FH_ASSETS.mkdir(parents=True, exist_ok=True)
    src_dir = _class_assets_dir()
    if not src_dir:
        print("skip quiz assets — class-slides assets dir not found")
        return
    for name in names:
        src = src_dir / name
        dst = CH5FH_ASSETS / name
        if not src.exists():
            print(f"skip quiz asset — missing {src}")
            continue
        if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            continue
        shutil.copy2(src, dst)
        print(f"copied quiz asset {name}")


def _mono_image_page(base: dict, frames: list[str], *, start: int | None, end: int | None) -> dict:
    out = {
        **base,
        "frames": frames,
        "clicks": max(0, len(frames) - 1),
        "thumb": frames[-1],
    }
    if start is not None:
        out["startFrame"] = start
    if end is not None:
        out["endFrame"] = end
    if "frameMeta" in base:
        frame_set = set(frames)
        out["frameMeta"] = [m for m in base["frameMeta"] if m.get("src") in frame_set]
    for key in ("type", "html", "thumbPh", "inserted", "scroll"):
        out.pop(key, None)
    return out


def insert_worksheet_after_mono_step5(pages: list[dict], worksheet: dict) -> list[dict]:
    """Split Mono-saccharides after slide-089 (ch5-play p.12 step 5) and insert worksheet."""
    head_idx = tail_idx = None
    for i, p in enumerate(pages):
        if not p.get("label", "").startswith(MONO_LABEL):
            continue
        frames = p.get("frames", [])
        if frames == MONO_HEAD_FRAMES:
            head_idx = i
        elif frames == MONO_TAIL_FRAMES:
            tail_idx = i

    out: list[dict] = []
    inserted = False
    i = 0
    while i < len(pages):
        p = pages[i]
        if p.get("label") == INSERTED_WORKSHEET:
            i += 1
            continue
        frames = p.get("frames", [])
        if (
            not inserted
            and head_idx is not None
            and tail_idx is not None
            and i == head_idx
            and tail_idx == head_idx + 1
        ):
            out.extend([p, worksheet, pages[tail_idx]])
            inserted = True
            i = tail_idx + 1
            continue
        if (
            not inserted
            and p.get("label", "").startswith(MONO_LABEL)
            and set(MONO_HEAD_FRAMES).issubset(frames)
            and set(MONO_TAIL_FRAMES).issubset(frames)
        ):
            head = _mono_image_page(p, MONO_HEAD_FRAMES, start=85, end=89)
            tail = _mono_image_page(p, MONO_TAIL_FRAMES, start=91, end=93)
            out.extend([head, worksheet, tail])
            inserted = True
            i += 1
            continue
        out.append(p)
        i += 1

    for j, page in enumerate(out, start=1):
        page["page"] = j
    return out


def merge_split_polysaccharide_page(pages: list[dict]) -> list[dict]:
    """Rejoin a previously mid-split first Poly saccharides page.

    A prior version split the first Poly saccharides page after slide-119 and
    inserted 1c/1d/Scenario 7/8 in the middle. Once those inserts are stripped,
    the base still carries two adjacent Poly pages (head ending slide-119, tail
    starting slide-120). Fuse them back into one continuous page so the page is
    restored to its natural form (slide-114…136).
    """
    out: list[dict] = []
    i = 0
    merged = False
    while i < len(pages):
        p = pages[i]
        nxt = pages[i + 1] if i + 1 < len(pages) else None
        if (
            not merged
            and p.get("label", "").startswith(POLY_LABEL)
            and p.get("frames", [])[-1:] == [SLIDE_119]
            and nxt is not None
            and nxt.get("label", "").startswith(POLY_LABEL)
            and nxt.get("frames", [""])[:1] == [SLIDE_120]
        ):
            head_frames = list(p.get("frames", []))
            tail_frames = list(nxt.get("frames", []))
            all_frames = head_frames + tail_frames
            head_meta = p.get("frameMeta")
            tail_meta = nxt.get("frameMeta")
            fused = {
                **p,
                "label": POLY_LABEL,
                "frames": all_frames,
                "clicks": max(0, len(all_frames) - 1),
                "thumb": all_frames[-1] if all_frames else p.get("thumb"),
            }
            if head_meta is not None or tail_meta is not None:
                fused["frameMeta"] = (head_meta or []) + (tail_meta or [])
            if "startFrame" in p:
                fused["startFrame"] = p["startFrame"]
            if "endFrame" in nxt:
                fused["endFrame"] = nxt["endFrame"]
            elif "endFrame" in fused:
                del fused["endFrame"]
            out.append(fused)
            merged = True
            i += 2
            continue
        out.append(p)
        i += 1

    for j, page in enumerate(out, start=1):
        page["page"] = j
    return out


def insert_after_starch_page(
    pages: list[dict],
    starch_page: dict,
    cellulose_page: dict,
    scenario_7: dict,
    scenario_8: dict,
) -> list[dict]:
    """Insert 1c, 1d, Scenario 7, 8 right after the Starch red-ring Poly page.

    Anchors on the Poly saccharides page whose frames contain slide-142.png
    (the page 137…145). The label repeats across several Poly pages, so match
    by frame membership, never by label alone.
    """
    out: list[dict] = []
    inserted = False
    for p in pages:
        out.append(p)
        if (
            not inserted
            and p.get("label", "").startswith(POLY_LABEL)
            and STARCH_ANCHOR_FRAME in p.get("frames", [])
        ):
            out.extend([starch_page, cellulose_page, scenario_7, scenario_8])
            inserted = True

    for j, page in enumerate(out, start=1):
        page["page"] = j
    return out


def trim_fatty_acid_steps(pages: list[dict]) -> list[dict]:
    """Drop steps 1–4 on Fatty acid page (ch5-play HUD p.25 = deck p.23)."""
    for p in pages:
        if not p.get("label", "").startswith(FATTY_ACID_LABEL):
            continue
        frames = p.get("frames", [])
        if len(frames) <= 4:
            continue
        new_frames = [f for f in frames if f not in DROP_FATTY_ACID_STEPS_1_4]
        if new_frames == frames:
            continue
        p["frames"] = new_frames
        p["clicks"] = max(0, len(new_frames) - 1)
        p["thumb"] = new_frames[-1]
        if "startFrame" in p:
            p["startFrame"] = 157
        if "endFrame" in p:
            p["endFrame"] = 159
        if "frameMeta" in p:
            p["frameMeta"] = [
                m for m in p["frameMeta"] if m.get("src") not in DROP_FATTY_ACID_STEPS_1_4
            ]
        break
    return pages


def trim_dipeptide_anim_steps(pages: list[dict]) -> list[dict]:
    """Drop anim:dipeptide:0..4 from polypeptide 2AA→dipeptide page (HUD steps 8–12)."""
    for p in pages:
        label = p.get("label", "")
        if POLYPEPTIDE_2AA_SUFFIX not in label:
            continue
        frames = p.get("frames", [])
        new_frames = [
            f
            for f in frames
            if not (isinstance(f, str) and f.startswith("anim:dipeptide:"))
        ]
        if new_frames == frames:
            continue
        p["frames"] = new_frames
        p["clicks"] = max(0, len(new_frames) - 1)
        p["thumb"] = new_frames[-1] if new_frames else p.get("thumb")
        if "frameMeta" in p:
            p["frameMeta"] = [
                m
                for m in p["frameMeta"]
                if not (m.get("type") == "animation" and m.get("embed") == "dipeptide")
            ]
        break
    return pages


def trim_amino_acids_steps(pages: list[dict]) -> list[dict]:
    """Drop steps 4–8 on first multi-frame Amino acids page (ch5-play HUD p.35)."""
    for p in pages:
        if not p.get("label", "").startswith(AMINO_ACIDS_LABEL):
            continue
        frames = p.get("frames", [])
        if len(frames) <= 3:
            continue
        new_frames = [f for f in frames if f not in DROP_AMINO_STEPS_4_8]
        if new_frames == frames:
            continue
        p["frames"] = new_frames
        p["clicks"] = max(0, len(new_frames) - 1)
        p["thumb"] = new_frames[-1]
        if "frameMeta" in p:
            p["frameMeta"] = [
                m for m in p["frameMeta"] if m.get("src") not in DROP_AMINO_STEPS_4_8
            ]
        break
    return pages


def trim_page4_steps(pages: list[dict]) -> list[dict]:
    """Drop steps 8,9,10,14-21 on ch5-play HUD p.4 (Carbohydrates intro)."""
    for p in pages:
        if not p.get("label", "").startswith(CARBS_INTRO_LABEL):
            continue
        frames = p.get("frames", [])
        if frames[:1] != [CARBS_INTRO_HEAD_FRAME]:
            continue
        new_frames = [f for f in frames if f not in DROP_PAGE4_FRAMES]
        if new_frames == frames:
            break
        p["frames"] = new_frames
        p["clicks"] = max(0, len(new_frames) - 1)
        p["thumb"] = new_frames[-1]
        if "startFrame" in p:
            p["startFrame"] = 5
        if "endFrame" in p:
            p["endFrame"] = 17
        if "frameMeta" in p:
            p["frameMeta"] = [
                m for m in p["frameMeta"] if m.get("src") not in DROP_PAGE4_FRAMES
            ]
        break
    return pages


def remove_pages_5_6(pages: list[dict]) -> list[dict]:
    """Remove ch5-play HUD p.5 (slide-026) and p.6 (Di-mer o slides 027-030)."""
    out: list[dict] = []
    for p in pages:
        frames = p.get("frames", [])
        if frames == [CONDENSATION_INTRO_FRAME]:
            continue
        if (
            p.get("label", "").startswith(DIMER_MER_O_LABEL)
            and frames == DIMER_MER_O_FRAMES
        ):
            continue
        out.append(p)
    for i, p in enumerate(out, start=1):
        p["page"] = i
    return out


def trim_page7_steps(pages: list[dict]) -> list[dict]:
    """Drop steps 1-3 on first Poly (多)-mer o page (ch5-play HUD p.7)."""
    for p in pages:
        if not p.get("label", "").startswith(POLY_MER_O_LABEL):
            continue
        frames = p.get("frames", [])
        if frames[:1] != [POLY_MER_O_HEAD_FRAME]:
            continue
        if not any(f in DROP_POLY_MER_O_HEAD for f in frames):
            break
        new_frames = [f for f in frames if f not in DROP_POLY_MER_O_HEAD]
        p["frames"] = new_frames
        p["clicks"] = max(0, len(new_frames) - 1)
        p["thumb"] = new_frames[-1]
        if "startFrame" in p:
            p["startFrame"] = 34
        if "endFrame" in p:
            p["endFrame"] = 40
        if "frameMeta" in p:
            p["frameMeta"] = [
                m for m in p["frameMeta"] if m.get("src") not in DROP_POLY_MER_O_HEAD
            ]
        break
    return pages


def trim_deck_pages(pages: list[dict]) -> list[dict]:
    """Drop ch5 p.13 (slide-094) and p.14 steps 1–3 (slides 095–097)."""
    out: list[dict] = []
    for p in pages:
        frames = p.get("frames", [])
        if frames == [DROP_MONO_094]:
            continue
        if p.get("label", "").startswith(DI_LABEL):
            new_frames = [f for f in frames if f not in DROP_DI_HEAD]
            if new_frames:
                p = {
                    **p,
                    "frames": new_frames,
                    "clicks": max(0, len(new_frames) - 1),
                    "thumb": new_frames[-1],
                    "startFrame": 98,
                    "endFrame": 103,
                }
            else:
                continue
        out.append(p)
    for i, p in enumerate(out, start=1):
        p["page"] = i
    return out


def restore_polypeptide_png_page(p: dict) -> dict:
    pngs = [f for f in p.get("frames", []) if isinstance(f, str) and f.startswith("/media/")]
    if len(pngs) < 20:
        return p
    out = {k: v for k, v in p.items() if k not in ("frameMeta",)}
    out["label"] = POLYPEPTIDE_LABEL
    out["frames"] = pngs
    out["clicks"] = max(0, len(pngs) - 1)
    out["thumb"] = pngs[-1]
    return out


def coalesce_polypeptide_pages(pages: list[dict]) -> list[dict]:
    """Rejoin split or double-injected polypeptide slides 210–240 into one PNG page."""
    poly_pngs = [f"/media/slides/slide-{n:03d}.png" for n in range(210, 241)]
    poly_set = set(poly_pngs)

    first = last = None
    for i, p in enumerate(pages):
        frames = p.get("frames", [])
        hits = {f for f in frames if isinstance(f, str) and f in poly_set}
        has_anim = any(str(f).startswith("anim:dipeptide:") for f in frames)
        if hits or has_anim:
            if first is None:
                first = i
            last = i

    if first is None:
        return pages

    collected: set[str] = set()
    for j in range(first, last + 1):
        for f in pages[j].get("frames", []):
            if isinstance(f, str) and f in poly_set:
                collected.add(f)

    merged_pngs = [src for src in poly_pngs if src in collected]
    if len(merged_pngs) < 31:
        return pages

    merged = restore_polypeptide_png_page(
        {
            **pages[first],
            "label": POLYPEPTIDE_LABEL,
            "frames": merged_pngs,
            "startFrame": 210,
            "endFrame": 240,
        }
    )

    tail_start = last + 1
    while tail_start < len(pages) and pages[tail_start].get("label") in (
        INSERTED_SCENARIO_5,
        INSERTED_SCENARIO_6,
    ):
        tail_start += 1

    out = pages[:first] + [merged] + pages[tail_start:]
    for i, p in enumerate(out, start=1):
        p["page"] = i
    return out


def split_polypeptide_at_anim_end(p: dict) -> tuple[dict, dict]:
    """Split 2AA→dipeptide page after dipeptide animation (HUD p.42 step 12)."""
    frames = p.get("frames", [])
    meta = p.get("frameMeta")
    at = POLYPEPTIDE_ANIM_STEPS
    head_frames = frames[:at]
    tail_frames = frames[at:]
    head_meta = meta[:at] if meta else None
    tail_meta = meta[at:] if meta else None

    head = {
        **p,
        "frames": head_frames,
        "clicks": max(0, len(head_frames) - 1),
        "thumb": head_frames[-1] if head_frames else p.get("thumb"),
    }
    if head_meta is not None:
        head["frameMeta"] = head_meta
    if "endFrame" in p:
        head["endFrame"] = 216

    tail: dict = {
        "page": 0,
        "label": POLYPEPTIDE_LABEL,
        "frames": tail_frames,
        "clicks": max(0, len(tail_frames) - 1),
        "thumb": tail_frames[-1] if tail_frames else None,
        "startFrame": 217,
        "endFrame": 240,
    }
    if tail_meta is not None:
        tail["frameMeta"] = tail_meta
    return head, tail


def move_scenario5_after_polypeptide_anim(
    pages: list[dict], scenario5: dict
) -> list[dict]:
    """Relocate Scenario 5 to immediately after polypeptide dipeptide animation."""
    out: list[dict] = []
    inserted = False
    for p in pages:
        if p.get("label") == INSERTED_SCENARIO_5:
            continue
        label = p.get("label", "")
        if (
            not inserted
            and label.startswith(POLYPEPTIDE_LABEL)
            and POLYPEPTIDE_2AA_SUFFIX in label
            and len(p.get("frames", [])) >= POLYPEPTIDE_ANIM_STEPS
        ):
            frames = p.get("frames", [])
            if len(frames) > POLYPEPTIDE_ANIM_STEPS:
                head, tail = split_polypeptide_at_anim_end(p)
                out.append(head)
                out.append(scenario5)
                if tail.get("frames"):
                    out.append(tail)
            else:
                out.extend([p, scenario5])
            inserted = True
            continue
        out.append(p)
    for i, p in enumerate(out, start=1):
        p["page"] = i
    return out


def insert_after(pages: list[dict], after_page: int, new_page: dict) -> list[dict]:
    out: list[dict] = []
    for p in pages:
        out.append(p)
        if p["page"] == after_page:
            out.append(new_page)
    for i, p in enumerate(out, start=1):
        p["page"] = i
    return out


def find_page(pages: list[dict], label_prefix: str) -> int | None:
    for p in pages:
        if p.get("label", "").startswith(label_prefix):
            return p["page"]
    return None


def needs_rebuild_page34(p: dict) -> bool:
    """Only the original monolithic polypeptide page (≥31 PNGs, no anim yet)."""
    if POLYPEPTIDE_2AA_SUFFIX in p.get("label", ""):
        return False
    if not p.get("label", "").startswith(POLYPEPTIDE_LABEL):
        return False
    frames = p.get("frames", [])
    if any(str(f).startswith("anim:") for f in frames):
        return False
    pngs = [f for f in frames if isinstance(f, str) and f.startswith("/media/")]
    return len(pngs) >= 31


def rebuild_page34(p: dict) -> dict:
    pngs = [f for f in p["frames"] if isinstance(f, str) and f.startswith("/media/")]
    head = pngs[:7]
    tail = pngs[7:]
    frames: list[dict] = [png_frame(src) for src in head]
    frames.extend(anim_frame("dipeptide", 5))
    frames.extend(png_frame(src) for src in tail)
    return page_dict(
        p["page"],
        f"{POLYPEPTIDE_LABEL} · 2AA → dipeptide",
        frames,
        thumb=head[-1] if head else None,
    )


def remove_floating_o_pngs() -> None:
    """Erase stray legend O on hydrolysis PNGs (ch5-play p.12 steps 1–5)."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        print("skip floating-O removal — Pillow not installed")
        return

    x, y, w, h = O_PATCH_XYWH
    for num in FLOATING_O_REMOVE_NUMS:
        path = SLIDES_DIR / f"slide-{num:03d}.png"
        if not path.exists():
            continue
        im = Image.open(path).convert("RGB")
        crop = im.crop((x, y, x + w, y + h))
        red = sum(1 for px in crop.getdata() if px[0] > 200 and px[1] < 80 and px[2] < 80)
        if red < 500:
            continue
        out = im.copy()
        draw = ImageDraw.Draw(out)
        draw.rectangle((x, y, x + w - 1, y + h - 1), fill=(255, 255, 255))
        out.save(path)
        print(f"removed floating O on slide-{num:03d}.png")


def fix_organic_biomolecule_nps_labels() -> None:
    """Paste Nitrogen / Phosphorus / Sulfur names under CHONPS legend N · P · S.

    Reference row: slide-011. Targets HUD p.5 steps 1–6 (slides 034–039) and
    HUD p.4 steps 8–10 (slides 015–017). Idempotent: skips frames that already
    contain the full label strip (dark-pixel count above threshold).
    """
    try:
        from PIL import Image
    except ImportError:
        print("skip N/P/S label patch — Pillow not installed")
        return

    ref_path = SLIDES_DIR / f"slide-{NPS_LABEL_REF_NUM:03d}.png"
    if not ref_path.exists():
        print(f"skip N/P/S label patch — missing {ref_path}")
        return

    x, y, w, h = NPS_LABEL_PATCH_XYWH
    ref = Image.open(ref_path).convert("RGB")
    label_patch = ref.crop((x, y, x + w, y + h))

    for num in NPS_LABEL_FIX_NUMS:
        path = SLIDES_DIR / f"slide-{num:03d}.png"
        if not path.exists():
            continue
        im = Image.open(path).convert("RGB")
        region = im.crop((x, y, x + w, y + h))
        dark = sum(
            1 for px in region.getdata() if px[0] < 200 or px[1] < 200 or px[2] < 200
        )
        if dark > NPS_LABEL_DARK_THRESHOLD:
            continue
        out = im.copy()
        out.paste(label_patch, (x, y))
        out.save(path)
        print(f"patched N/P/S labels on slide-{num:03d}.png")


def fix_nps_element_labels() -> None:
    """Backward-compatible alias for fix_organic_biomolecule_nps_labels()."""
    fix_organic_biomolecule_nps_labels()


def fix_o_atom_pngs() -> None:
    """Restore red O circle in top element row (C · H · O blue box)."""
    try:
        from PIL import Image
    except ImportError:
        print("skip O PNG patch — Pillow not installed")
        return

    ref_path = SLIDES_DIR / f"slide-{O_REF_NUM:03d}.png"
    if not ref_path.exists():
        print(f"skip O PNG patch — missing {ref_path}")
        return

    x, y, w, h = O_PATCH_XYWH
    ref = Image.open(ref_path).convert("RGB")
    o_patch = ref.crop((x, y, x + w, y + h))

    for num in O_FIX_NUMS:
        path = SLIDES_DIR / f"slide-{num:03d}.png"
        if not path.exists():
            continue
        im = Image.open(path).convert("RGB")
        crop = im.crop((x, y, x + w, y + h))
        red = sum(1 for px in crop.getdata() if px[0] > 200 and px[1] < 80 and px[2] < 80)
        if red > 5000:
            continue
        out = im.copy()
        out.paste(o_patch, (x, y))
        out.save(path)
        print(f"patched O on slide-{num:03d}.png")


def _mcq_num_from_label(label: str) -> int | None:
    m = re.search(r"MCQ\s+(\d+)\s*$", label)
    return int(m.group(1)) if m else None


# ch5-play HUD page = deck array index + 3 (two PREFIX slides before deck-pages).
# Explicit Saturday notes badge mapping (overrides label heuristics below).
HUD_PREFIX_OFFSET = 3
HUD_NOTES_MAP: list[tuple[tuple[int, int], tuple[int, int]]] = [
    ((2, 4), (1, 1)),
    ((5, 12), (2, 2)),
    ((13, 13), (3, 5)),
    ((14, 35), (6, 7)),
    ((37, 49), (8, 11)),
    ((50, 56), (12, 12)),
    ((60, 61), (13, 13)),
    ((62, 69), (14, 16)),
    ((71, 76), (17, 17)),
    ((81, 82), (18, 18)),
    ((83, 84), (19, 19)),
    ((85, 90), (20, 20)),
    ((91, 94), (21, 21)),
    ((95, 95), (22, 22)),
    ((97, 110), (23, 29)),
    # HUD 111–145 → notes pp.30–40 (not N.23–40) to avoid overlap with 97–110.
    ((111, 145), (30, 40)),
]


def notes_range_for_hud(hud_page: int) -> tuple[int, int] | None:
    for (h_lo, h_hi), (n_lo, n_hi) in HUD_NOTES_MAP:
        if h_lo <= hud_page <= h_hi:
            return (n_lo, n_hi)
    return None


def notes_range_for_deck_index(deck_index: int) -> tuple[int, int] | None:
    return notes_range_for_hud(deck_index + HUD_PREFIX_OFFSET)


def _notes_page_for_label_legacy(label: str) -> int | None:
    """Best-effort map from deck slide label → Saturday notes page (1–35).

    Notes pages come from Word lastRenderedPageBreak in
    Ch5_Food and human_Summer Edited (Sat).docx. Teaching PPT / animation
    slides with no 1:1 notes page map to the nearest section page.
    """
    if not label:
        return None
    if label in (
        ANSWER_KEY_BASICS_MCQ,
        ANSWER_KEY_BASICS_TF_FILL,
        ANSWER_KEY_FUNCTIONS_MCQ,
        ANSWER_KEY_FUNCTIONS_TF_FILL,
        INSERTED_END_SLIDE,
        NUTRITION_LABEL,
    ):
        return None

    # —— Basics carbs quizzes ——
    if label.startswith(BASICS_CARB_PREFIX):
        if "Fill" in label:
            return 35
        if "T/F" in label:
            return 11
        if "Concept Checks" in label:
            return 8
        n = _mcq_num_from_label(label)
        if n is not None:
            if n <= 3:
                return 8
            if n <= 6:
                return 9
            return 10
        return 8

    # —— Basics lipids quizzes ——
    if label.startswith(BASICS_LIPID_PREFIX):
        if "Fill" in label:
            return 35
        if "T/F" in label:
            return 16
        if "Concept Checks" in label:
            return 14
        n = _mcq_num_from_label(label)
        if n is not None:
            if n <= 2:
                return 14
            if n <= 5:
                return 15
            return 16
        return 14

    # —— Basics proteins quizzes ——
    if label.startswith(BASICS_PROTEIN_PREFIX):
        if "Fill" in label:
            return 35
        if "T/F" in label:
            return 26
        if "Concept Checks" in label:
            return 22
        n = _mcq_num_from_label(label)
        if n is not None:
            if n <= 3:
                return 22
            if n <= 6:
                return 23
            if n <= 10:
                return 24
            return 25
        return 22

    # —— Further / Functions & Names ——
    if label == FURTHER_DETAILS_HEADER:
        return 7
    if label == FURTHER_CARB_TABLE or label in CARB_TABLE_COPY_LABELS:
        return 7
    if label == FURTHER_LIPID_TABLE:
        return 13
    if label == FURTHER_PROTEIN_TABLE or label in PROTEIN_TABLE_COPY_LABELS:
        return 21
    if label == INSERTED_FUNCTIONS_NAMES_HEADER:
        return 27
    if label.startswith(FUNCTIONS_NAMES_PREFIX):
        if "Fill" in label:
            # Fill 1–5 / 6–10 / 11–15 → notes Fill 1 (functions bank)
            return 34
        if "T/F" in label:
            return 33
        n = _mcq_num_from_label(label)
        if n is not None:
            # 20 MCQs across notes pp.27–32 (~3–4 per page)
            if n <= 3:
                return 27
            if n <= 6:
                return 28
            if n <= 9:
                return 29
            if n <= 12:
                return 30
            if n <= 16:
                return 31
            return 32
        return 27
    if label in FILL2_PAGE_LABELS:
        return 35

    # —— Worksheets & scenarios ——
    if label == INSERTED_WORKSHEET:
        return 3
    if label.startswith("Scenario 1") or label.startswith("Scenario 2"):
        return 3 if "1" in label[:12] else 4
    if label.startswith("Scenario 3") or label.startswith("Scenario 4"):
        return 4
    if label.startswith("Scenario 5") or label.startswith("Scenario 6"):
        return 5 if "6" in label[:12] else 4
    if label.startswith("Scenario 7") or label.startswith("Scenario 8"):
        return 5
    if label == INSERTED_CARB_MALTOSE_WORKSHEET:
        return 6
    if label in (
        INSERTED_LIPIDS_TRIGLYCERIDES,
        INSERTED_LIPIDS_TRIGLYCERIDES_COPY,
    ):
        return 12
    if label in POLYPEPTIDE_WORKSHEET_LABELS:
        return 18
    if label in POLYPEPTIDE_VS_PROTEIN_LABELS:
        return 19
    if label in DENATURATION_INSERTED_LABELS:
        return 20

    # —— Bright animations ——
    if label in (INSERTED_MALTOSE, INSERTED_MALTOSE_HYDRO):
        return 6
    if label in (INSERTED_STARCH_HYDRO, INSERTED_CELLULOSE_HYDRO):
        return 5
    if label == INSERTED_TRIGLYCERIDE:
        return 12
    if label == INSERTED_PROTEIN_FOLD:
        return 19

    # —— Opening / organic ——
    if "Organic" in label or "organic" in label.lower():
        return 1
    if label == INSERTED_ORG_INORG_TABLE:
        return 1
    if "Condensation" in label and "Hydrolysis" in label and "worksheet" not in label.lower():
        return 3
    if label.startswith("Poly (") or label.startswith("Di ("):
        return 1

    # —— Carbohydrates teaching ——
    if "Carbohydrates" in label or "saccharide" in label.lower() or "Maltose" in label:
        if "names & functions" in label:
            return 7
        return 6
    if "Poly saccharides" in label or "Monosaccharides" in label or "Di saccharides" in label:
        return 6

    # —— Lipids teaching ——
    if (
        "Lipid" in label
        or "Fatty acid" in label
        or "Triglyceride" in label
        or "glycer" in label.lower()
    ):
        if "names & functions" in label:
            return 13
        return 12

    # —— Proteins teaching ——
    if (
        "Protein" in label
        or "Amino acid" in label
        or "Dipeptide" in label
        or "Polypeptide" in label
        or "Denatur" in label
        or "3D conformation" in label
        or "Suboptimal" in label
        or "蛋白質" in label
    ):
        if "names & functions" in label:
            return 21
        if "Denatur" in label or "Suboptimal" in label:
            return 20
        if "fold" in label.lower() or "3D" in label or "Polypeptide vs" in label:
            return 19
        if "Polypeptide" in label:
            return 18
        return 17

    return None


def apply_notes_page_labels(pages: list[dict]) -> list[dict]:
    """Attach notesPage (+ optional notesPageEnd) for HUD N.# / N.#–# badges."""
    for i, p in enumerate(pages):
        rng = notes_range_for_deck_index(i)
        if rng is None:
            p.pop("notesPage", None)
            p.pop("notesPageEnd", None)
        else:
            n_lo, n_hi = rng
            p["notesPage"] = n_lo
            if n_hi != n_lo:
                p["notesPageEnd"] = n_hi
            else:
                p.pop("notesPageEnd", None)
    return pages


def main() -> None:
    src = DECK_ROOT / "data" / "deck-pages.json"
    data = json.loads(src.read_text(encoding="utf-8"))
    pages = strip_inserted_pages(data["pages"])
    pages = [restore_polypeptide_png_page(p) if POLYPEPTIDE_LABEL in p.get("label", "") else p for p in pages]
    pages = insert_organic_inorganic_table_after_p3(pages)
    pages = trim_page4_steps(pages)
    pages = remove_pages_5_6(pages)
    pages = trim_page7_steps(pages)
    pages = trim_deck_pages(pages)
    pages = insert_carb_table_copy_after_p13_step5(pages)
    pages = trim_fatty_acid_steps(pages)
    pages = trim_amino_acids_steps(pages)
    pages = insert_worksheet_after_mono_step5(pages, make_worksheet_page())
    pages = coalesce_polypeptide_pages(pages)
    pages = merge_split_polysaccharide_page(pages)
    for i, p in enumerate(pages, start=1):
        p["page"] = i

    maltose = page_dict(
        0,
        INSERTED_MALTOSE,
        anim_frame("maltose", 5),
        thumb="/media/slides/slide-112.png",
        inserted=True,
    )
    maltose_hydro = page_dict(
        0,
        INSERTED_MALTOSE_HYDRO,
        anim_frame("maltose-hydrolysis", 5),
        thumb="/media/slides/slide-113.png",
        inserted=True,
    )
    triglyceride = page_dict(
        0,
        INSERTED_TRIGLYCERIDE,
        anim_frame("triglyceride", 5),
        thumb="/media/slides/slide-175.png",
        inserted=True,
    )

    maltose_text_page = find_page(pages, MALTOSE_TEXT)
    if maltose_text_page:
        pages = insert_after(pages, maltose_text_page, maltose)
    maltose_page = find_page(pages, INSERTED_MALTOSE)
    if maltose_page:
        pages = insert_after(pages, maltose_page, maltose_hydro)
    scenario_1, scenario_2 = make_scenario_pages()
    hydro_page = find_page(pages, INSERTED_MALTOSE_HYDRO)
    if hydro_page:
        pages = insert_after(pages, hydro_page, scenario_1)
        s1_page = find_page(pages, INSERTED_SCENARIO_1)
        if s1_page:
            pages = insert_after(pages, s1_page, scenario_2)

    prepare_carbohydrates_maltose_png()
    pages = insert_carbohydrates_maltose_worksheet_after_p23(pages)

    starch_hydro = page_dict(
        0,
        INSERTED_STARCH_HYDRO,
        anim_frame("starch-hydrolysis", 5),
        thumb="/media/slides/slide-120.png",
        inserted=True,
    )
    cellulose_hydro = page_dict(
        0,
        INSERTED_CELLULOSE_HYDRO,
        anim_frame("cellulose-hydrolysis", 5),
        thumb="/media/slides/slide-120.png",
        inserted=True,
    )
    scenario_7, scenario_8 = make_scenario_78_pages()
    pages = insert_after_starch_page(
        pages, starch_hydro, cellulose_hydro, scenario_7, scenario_8
    )
    pages = move_poly_early_steps_1_4_after_maltose_hydro(pages)
    pages = insert_carb_table_copy_after_poly_early_step5(pages)

    triglyceride_page = find_page(pages, TRIGLYCERIDE_TEXT)
    if triglyceride_page:
        pages = insert_after(pages, triglyceride_page, triglyceride)
    scenario_3 = make_scenario_3_page()
    fatty_acids_page = find_page(pages, FATTY_ACIDS_PLUS_LABEL)
    if fatty_acids_page:
        pages = insert_after(pages, fatty_acids_page, scenario_3)

    scenario_4, scenario_5 = make_scenario_45_pages()
    s3_page = find_page(pages, INSERTED_SCENARIO_3)
    if s3_page:
        pages = insert_after(pages, s3_page, scenario_4)

    for i, p in enumerate(pages):
        if needs_rebuild_page34(p):
            pages[i] = rebuild_page34(p)
            break

    pages = move_scenario5_after_polypeptide_anim(pages, scenario_5)
    pages = trim_dipeptide_anim_steps(pages)

    scenario_6 = make_scenario_6_page()
    s5_page = find_page(pages, INSERTED_SCENARIO_5)
    if s5_page:
        pages = insert_after(pages, s5_page, scenario_6)

    protein_fold = page_dict(
        0,
        INSERTED_PROTEIN_FOLD,
        [{"type": "animation", "embed": "protein-fold", "step": 0}],
        thumb="/media/slides/slide-248.png",
        inserted=True,
    )
    conf_page = find_page(pages, CONFORMATION_LABEL)
    if conf_page:
        pages = insert_after(pages, conf_page, protein_fold)

    pages = remove_nutrition_frame(pages)
    pages = append_nutrition_page(pages)
    pages = merge_tail_poly_into_carbs_end(pages)
    pages = insert_basics_carb_quizzes_after_p28(pages)
    pages = insert_carb_table_copy_after_carbs_summary_step5(pages)
    pages = ensure_merged_carbs_has_end_frame(pages)
    pages = move_carbs_last_step_after_p42(pages)
    pages = trim_merged_carbs_step5(pages)
    prepare_lipids_triglycerides_worksheet_assets()
    pages = insert_lipids_triglycerides_after_p41(pages)
    pages = duplicate_lipids_triglycerides_after_trig_condensation(pages)
    pages = move_scenarios_3_4_after_triglycerides_worksheet_copy(pages)
    pages = insert_lipids_table_after_fatty_acids(pages)
    pages = insert_basics_lipid_quizzes_after_scenario4(pages)
    prepare_polypeptide_worksheet_assets()
    pages = insert_polypeptide_worksheet_after_p82(pages)
    prepare_polypeptide_vs_protein_png()
    pages = insert_polypeptide_vs_protein_after_p82(pages)
    pages = insert_polypeptide_vs_protein_after_p86_step2(pages)
    prepare_denaturation_worksheet_pngs()
    pages = insert_denaturation_pages_after_p89(pages)
    pages = insert_protein_table_copy_after_p86(pages)
    pages = insert_basics_protein_quizzes_after_denature(pages)
    pages = insert_further_slides_before_fried_chicken(pages)
    pages = insert_all_fill_pages_before_answer_key(pages)
    refresh_carb_table_pages(pages)
    refresh_biomolecule_table_pages(pages)
    prepare_lipids_table_assets()

    copy_class_quiz_assets(
        (
            "image22.jpeg",
            "image23.jpeg",
            "image24.jpeg",
            "image25.jpeg",
            "image26.jpeg",
            "image27.png",
            "image28.png",
            "image30.jpeg",
            "image31.jpeg",
            "image32.jpeg",
            "image33.jpeg",
            "image34.png",
            "image35.jpeg",
            "image36.jpeg",
            "image37.jpeg",
            "image38.jpeg",
            "image39.jpeg",
            "image40.jpeg",
            "image41.jpeg",
            "image42.jpeg",
        )
    )

    pages = apply_notes_page_labels(pages)
    data["pages"] = pages
    data["pageCount"] = len(pages)
    data["totalFrames"] = sum(
        len(p.get("frames", [])) for p in pages if p.get("type") != "rich"
    )
    data["notesMap"] = {
        "source": "Ch5_Food and human_Summer Edited (Sat).docx",
        "labelFormat": "N.{n} or N.{lo}–{hi}",
        "hudOffset": 3,
        "prefixSlides": 2,
        "mapping": "explicit HUD ranges (Saturday)",
        "choice111to145": "N.30–40",
    }

    remove_floating_o_pngs()
    fix_organic_biomolecule_nps_labels()
    fix_o_atom_pngs()

    payload = json.dumps(data, indent=2, ensure_ascii=False)
    src.write_text(payload, encoding="utf-8")
    public = DECK_ROOT / "public" / "data" / "deck-pages.json"
    public.parent.mkdir(parents=True, exist_ok=True)
    public.write_text(payload, encoding="utf-8")
    dist_public = (
        DECK_ROOT.parents[1]
        / "dist"
        / "slides"
        / "ch5-condensation-hydrolysis"
        / "public"
        / "data"
        / "deck-pages.json"
    )
    if dist_public.parent.exists():
        dist_public.write_text(payload, encoding="utf-8")
        print(f"Synced data + public + dist — {data['pageCount']} deck pages")
    else:
        print(f"Synced data + public — {data['pageCount']} deck pages")


if __name__ == "__main__":
    main()
