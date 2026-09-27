/**
 * Digestive enzymes — 8-step animation using flat 2D models.
 * Catalytic cycle mirrors EnzymeActionAnimation: intro → approach+dock → cleave → release.
 */
(function (global) {
  "use strict";

  var STEPS = [
    {
      id: "salivary-amylase",
      badge: 1,
      enzyme: "Salivary amylase",
      location: "Mouth (saliva)",
      zone: "mouth",
      equation: "Starch → Maltose",
      en: "Salivary amylase hydrolyses glycosidic bonds in starch, cleaving the polymer into maltose units.",
      zh: "唾液澱粉酶切斷澱粉（starch）的糖苷鍵（glycosidic bond），將聚合物分解為麥芽糖（maltose）。",
      duration: 6400,
      visual: "starch-maltose",
      proteinVariant: "default",
    },
    {
      id: "pepsin",
      badge: 2,
      enzyme: "Pepsin",
      location: "Stomach",
      zone: "stomach",
      equation: "Proteins → Peptides",
      en: "Pepsin cleaves peptide bonds in proteins, breaking the long polypeptide chain into shorter peptides.",
      zh: "胃蛋白酶（pepsin）切斷蛋白質的肽鍵（peptide bond），將長多肽鏈分解為較短的多肽（peptides）。",
      duration: 6400,
      visual: "protein-peptide",
      proteinVariant: "pepsin",
    },
    {
      id: "pancreatic-amylase",
      badge: 3,
      enzyme: "Pancreatic amylase",
      location: "Small intestine (pancreatic juice)",
      zone: "intestine",
      equation: "Starch → Maltose",
      en: "Pancreatic amylase continues hydrolysing remaining starch into maltose in the small intestine.",
      zh: "胰澱粉酶繼續水解剩餘澱粉，在小腸內分解為麥芽糖（maltose）。",
      duration: 6400,
      visual: "starch-maltose",
      proteinVariant: "pancreatic-amylase",
    },
    {
      id: "pancreatic-lipase",
      badge: 4,
      enzyme: "Pancreatic lipase",
      location: "Small intestine (pancreatic juice)",
      zone: "intestine",
      equation: "Lipids → Fatty acids + Glycerol",
      en: "Pancreatic lipase hydrolyses ester bonds in triglycerides, releasing three fatty acid chains and glycerol.",
      zh: "胰脂肪酶水解三酸甘油酯的酯鍵（ester bond），釋出三條脂肪酸鏈同甘油（glycerol）。",
      duration: 7000,
      visual: "lipid-split",
      proteinVariant: "pancreatic-lipase",
    },
    {
      id: "protease",
      badge: 5,
      enzyme: "Protease",
      location: "Small intestine (pancreatic juice)",
      zone: "intestine",
      equation: "Peptides → Smaller peptides",
      en: "Proteases cut peptide bonds again, breaking peptides into even smaller peptide fragments.",
      zh: "蛋白酶再次切斷肽鍵，將多肽進一步分解為更短的多肽片段（smaller peptides）。",
      duration: 6400,
      visual: "peptide-smaller",
      proteinVariant: "protease",
    },
    {
      id: "maltase",
      badge: 6,
      enzyme: "Maltase",
      location: "Small intestine (brush border)",
      zone: "brush",
      equation: "Maltose → Glucose + Glucose",
      en: "Maltase hydrolyses the glycosidic bond in maltose, splitting it into two separate glucose molecules.",
      zh: "麥芽糖酶水解麥芽糖的糖苷鍵，將其分解為兩個獨立的葡萄糖（glucose）分子。",
      duration: 6400,
      visual: "maltose-glucose",
      proteinVariant: "maltase",
    },
    {
      id: "sucrase",
      badge: 7,
      enzyme: "Sucrase",
      location: "Small intestine (brush border)",
      zone: "brush",
      equation: "Sucrose → Glucose + Fructose",
      en: "Sucrase breaks the glycosidic bond in sucrose, separating glucose and fructose.",
      zh: "蔗糖酶切斷蔗糖的糖苷鍵，將其分解為葡萄糖（glucose）同果糖（fructose）。",
      duration: 6400,
      visual: "sucrose-split",
      proteinVariant: "sucrase",
    },
    {
      id: "lactase",
      badge: 8,
      enzyme: "Lactase",
      location: "Small intestine (brush border)",
      zone: "brush",
      equation: "Lactose → Glucose + Galactose",
      en: "Lactase hydrolyses the glycosidic bond in lactose, producing glucose and galactose.",
      zh: "乳糖酶水解乳糖的糖苷鍵，產生葡萄糖（glucose）同半乳糖（galactose）。",
      duration: 6400,
      visual: "lactose-split",
      proteinVariant: "lactase",
    },
  ];

  var PHASES = [
    { key: "intro", label: "1. Enzyme & substrate" },
    { key: "approachDock", label: "2. Substrate approaches hole (lock & key)" },
    { key: "cleave", label: "3. Substrate → products" },
    { key: "release", label: "4. Products released" },
  ];

  /** Fig 4.3 action-of-enzyme timing (intro → dock → recolor → release). */
  var ACTION_STEPS = [
    { id: "intro", duration: 2800 },
    { id: "approachDock", duration: 6200 },
    { id: "recolor", duration: 3600 },
    { id: "release", duration: 4000 },
  ];

  var ACTION_PHASE_LABELS = {
    intro: "1. Enzyme & substrate",
    approachDock: "2. Substrate fits active site (lock & key)",
    recolor: "3. Substrate → products",
    release: "4. Products leave — enzyme unchanged",
  };

  var VISUALS = {
    "starch-maltose": {
      substrate: "starch",
      products: ["maltose", "maltose", "maltose"],
      note: "Glycosidic bonds hydrolysed",
    },
    "protein-peptide": {
      substrate: "protein",
      products: ["peptide", "peptide"],
      note: "Peptide bonds cleaved",
    },
    "lipid-split": {
      substrate: "lipid",
      products: ["fatty-acid", "fatty-acid", "fatty-acid", "glycerol"],
      layout: "lipid",
      note: "Ester bonds hydrolysed",
    },
    "peptide-smaller": {
      substrate: "peptide",
      products: ["peptide", "peptide"],
      note: "Further peptide bond cleavage",
    },
    "maltose-glucose": {
      substrate: "maltose",
      products: ["glucose", "glucose"],
      note: "Glycosidic bond hydrolysed → monosaccharides",
    },
    "sucrose-split": {
      substrate: "sucrose",
      products: ["glucose", "fructose"],
      note: "Glycosidic bond hydrolysed → monosaccharides",
    },
    "lactose-split": {
      substrate: "lactose",
      products: ["glucose", "galactose"],
      note: "Glycosidic bond hydrolysed → monosaccharides",
    },
  };

  var SCENE = { w: 640, h: 420 };
  var C = {
    enzyme: "#89C2EB",
    enzymeEdge: "#6AABD8",
    hole: "#f5d565",
    holeEdge: "#c9a227",
    mouth: "#f4a9a0",
    stomach: "#e8c4a8",
    intestine: "#b8dfc8",
    brush: "#9fd4b0",
    text: "#2a3340",
    muted: "#5a6270",
    highlight: "#004e9f",
  };

  var HOLE_LOCAL_Y = 50;
  var INLINE_SCENE = { w: 640, h: 320 };
  var INLINE_PHASE_LABEL_H = 34;

  function inlineEnzymeAssetDim(variant, MF) {
    if (!MF) return { w: 152, h: 98 };
    if (MF.isDisaccharidaseVariant && MF.isDisaccharidaseVariant(variant) && MF.DISACCHARIDASE_IMAGE) {
      return { w: MF.DISACCHARIDASE_IMAGE.w, h: MF.DISACCHARIDASE_IMAGE.h, minX: 0, minY: 0 };
    }
    if (MF.isPepsinProteaseVariant && MF.isPepsinProteaseVariant(variant)) {
      return { w: 160, h: 80, minX: 0, minY: 0 };
    }
    if (MF.isPancreaticLipaseVariant && MF.isPancreaticLipaseVariant(variant)) {
      var shapes = global.ENZYME_SHAPES;
      if (
        shapes &&
        shapes.enzymeDigestionBBox &&
        MF.usesDigestionFig43Layout &&
        MF.usesDigestionFig43Layout(variant)
      ) {
        var lipBb = shapes.enzymeDigestionBBox;
        return {
          w: lipBb.maxX - lipBb.minX,
          h: lipBb.maxY - lipBb.minY,
          minX: lipBb.minX,
          minY: lipBb.minY,
        };
      }
      if (MF.PANCREATIC_LIPASE_IMAGE) {
        return {
          w: MF.PANCREATIC_LIPASE_IMAGE.w,
          h: MF.PANCREATIC_LIPASE_IMAGE.h,
          minX: 0,
          minY: 0,
        };
      }
    }
    if (MF.isAmylaseVariant && MF.isAmylaseVariant(variant) && MF.AMYLASE_IMAGE) {
      return { w: MF.AMYLASE_IMAGE.w, h: MF.AMYLASE_IMAGE.h, minX: 0, minY: 0 };
    }
    var shapes = global.ENZYME_SHAPES;
    if (shapes && shapes.enzymeDigestionBBox) {
      var bb = shapes.enzymeDigestionBBox;
      return { w: bb.maxX - bb.minX, h: bb.maxY - bb.minY, minX: bb.minX, minY: bb.minY };
    }
    return { w: 152, h: 98 };
  }

  /** Vertical centre of the inline reaction area (below phase label). */
  var INLINE_SCENE_CY = INLINE_PHASE_LABEL_H + (INLINE_SCENE.h - INLINE_PHASE_LABEL_H) * 0.54;

  /** Place enzyme anchor so the flat asset bbox is centered in the inline slot. */
  function inlineCenteredEnzY(variant, enzymeScale) {
    var MF = global.MoleculeFlat2d;
    enzymeScale = enzymeScale != null ? enzymeScale : INLINE_LAYOUT.enzymeScale;
    if (!MF || !MF.enzymeAnchorForVariant) return INLINE_SCENE_CY;
    var anchor = MF.enzymeAnchorForVariant(variant || "default");
    var dim = inlineEnzymeAssetDim(variant, MF);
    var centerY = dim.minY != null
      ? dim.minY + dim.h / 2
      : dim.h / 2;
    return INLINE_SCENE_CY - (centerY - anchor.y) * enzymeScale;
  }

  function inlineCenteredEnzX(variant, enzymeScale) {
    var MF = global.MoleculeFlat2d;
    enzymeScale = enzymeScale != null ? enzymeScale : INLINE_LAYOUT.enzymeScale;
    if (!MF || !MF.enzymeAnchorForVariant) return INLINE_SCENE.w / 2;
    var anchor = MF.enzymeAnchorForVariant(variant || "default");
    var dim = inlineEnzymeAssetDim(variant, MF);
    var centerX = dim.minX != null
      ? dim.minX + dim.w / 2
      : dim.w / 2;
    return INLINE_SCENE.w / 2 - (centerX - anchor.x) * enzymeScale;
  }

  function enzymeLocalToScene(layout, lx, ly) {
    return {
      x: layout.enzX + (lx - layout.enzymeAnchorX) * layout.enzymeScale,
      y: layout.enzY + (ly - layout.enzymeAnchorY) * layout.enzymeScale,
    };
  }

  function holeScreenPos(layout, substrateType, dockT, variant) {
    var MF = global.MoleculeFlat2d;
    if (!MF || (!MF.holeFitForVariant && !MF.holeFitForSubstrate)) {
      return { x: layout.enzX, y: layout.subDockY || layout.enzY };
    }
    var fit = variant && MF.holeFitForVariant
      ? MF.holeFitForVariant(variant, substrateType)
      : MF.holeFitForSubstrate(substrateType);
    dockT = dockT != null ? dockT : 1;
    if (dockT < 0) dockT = 0;
    if (dockT > 1) dockT = 1;
    var cy = fit.cy + (1 - dockT) * fit.introYOffset;
    return enzymeLocalToScene(layout, fit.cx, cy);
  }

  function buildLayout(base) {
    var layout = {
      enzX: base.enzX,
      enzY: base.enzY,
      enzymeScale: base.enzymeScale,
      enzymeAnchorX: base.enzymeAnchorX,
      enzymeAnchorY: base.enzymeAnchorY,
      prodSpread: base.prodSpread,
      prodArc: base.prodArc,
      prodLift: base.prodLift,
      approachEnd: base.approachEnd,
    };
    return layout;
  }

  var LAYOUT_BASE = {
    enzX: 320,
    enzY: 158,
    enzymeScale: 2.05,
    enzymeAnchorX: 76,
    enzymeAnchorY: 48,
    prodSpread: 102,
    prodArc: 24,
    prodLift: -18,
    approachEnd: 0.42,
  };

  /** Match full-page enzyme vertical position when scaled to the shorter inline viewBox. */
  var INLINE_REACTION_CY = LAYOUT_BASE.enzY * (INLINE_SCENE.h / SCENE.h);

  var FULL_LAYOUT = buildLayout(LAYOUT_BASE);
  var INLINE_MODEL_BOOST = 1.35;
  var INLINE_ENZYME_BOOST = 1.3;
  var ENZYME_DISPLAY_SCALE_2D = 1.4;
  var glycDropCompact = 56;

  var ENZYME_VARIANT_SCALE_2D = {
    pepsin: 1.28,
  };

  var FLAT_MOL_SIZE_REF = {
    starch: "maltose",
    glycerol: "fatty-acid",
    sucrose: "glucose",
    fructose: "glucose",
    lactose: "glucose",
    galactose: "glucose",
  };

  /** Scene-space layout for inline enzyme-factor 2D slot (lock-and-key via enzymeGroupHtml). */
  var INLINE_LAYOUT = {
    isInline: true,
    enzX: INLINE_SCENE.w / 2,
    enzY: INLINE_SCENE_CY,
    enzymeScale: 1.82,
    enzymeAnchorX: 76,
    enzymeAnchorY: 48,
    prodSpread: 72,
    prodArc: 12,
    prodLift: -6,
    approachEnd: 0.42,
  };

  var LAYOUT = FULL_LAYOUT;

  /** Per-variant timing and release geometry (pepsin, protease, pancreatic lipase). */
  var VARIANT_ANIM = {
    pepsin: { approachEnd: 0.36, prodSpread: 112, prodArc: 18, prodLift: -14 },
    protease: { approachEnd: 0.4, prodSpread: 100, prodArc: 20, prodLift: -16 },
    "pancreatic-lipase": { approachEnd: 0.4, prodSpread: 114, prodArc: 16, prodLift: -12 },
  };

  var INLINE_VARIANT_ANIM = {
    "pancreatic-lipase": { prodSpread: 58, prodArc: 10, prodLift: -4 },
  };

  function lipaseInlineSizeBoost(variant) {
    return 1;
  }

  function enzymeDisplayScale2dFor(variant) {
    return ENZYME_DISPLAY_SCALE_2D * (ENZYME_VARIANT_SCALE_2D[variant] || 1);
  }

  function flatMolSizeRatio(type) {
    var MB = global.MoleculeBallStick;
    var refType = FLAT_MOL_SIZE_REF[type] || type;
    if (!MB || !MB.getModelFitScale) return flatSizeFor(type);
    var typeFit = MB.getModelFitScale(type);
    var refFit = MB.getModelFitScale(refType);
    if (!typeFit || typeFit <= 0) return 1;
    return refFit / typeFit;
  }

  function inlineFlatMolScale(type, boost) {
    boost = boost != null ? boost : INLINE_MODEL_BOOST;
    return FLAT_MOL_BASE * MODEL_SIZE_FACTOR * SUBSTRATE_VS_ENZYME * flatMolSizeRatio(type) * boost;
  }

  function inlineFlatProductScale(substrateType, productType, boost) {
    boost = boost != null ? boost : INLINE_MODEL_BOOST;
    var MB = global.MoleculeBallStick;
    var subS = FLAT_MOL_BASE * MODEL_SIZE_FACTOR * SUBSTRATE_VS_ENZYME * flatMolSizeRatio(substrateType);
    if (!MB || !MB.getModelFitScale) return inlineFlatMolScale(productType, boost);
    var subFit = MB.getModelFitScale(substrateType);
    var prodFit = MB.getModelFitScale(productType);
    if (!prodFit || prodFit <= 0) return subS * boost;
    return subS * (subFit / prodFit) * boost;
  }

  function sceneSubstratePos(layout, dockT) {
    var t = easeInOut(clamp(dockT, 0, 1));
    return {
      x: lerp(layout.subStartX, layout.activeSiteX, t),
      y: lerp(layout.subStartY, layout.activeSiteY, t),
    };
  }

  function holeScreenPosForMode(layout, substrateType, dockT, variant, layeredFlat) {
    if (layeredFlat) {
      if (dockT <= 0) return { x: layout.subStartX, y: layout.subStartY };
      return sceneSubstratePos(layout, dockT);
    }
    return holeScreenPos(layout, substrateType, dockT, variant);
  }

  function glycerolReleasePos(dockX, dockY, releaseT, compact) {
    var raw = clamp(releaseT, 0, 1);
    var t = easeInOut(Math.pow(raw, 1.75));
    var drop = compact ? glycDropCompact : 88;
    return { x: dockX, y: lerp(dockY, dockY + drop, t) };
  }

  function setSvgGroupHtml(gEl, html) {
    if (!gEl) return;
    while (gEl.firstChild) gEl.removeChild(gEl.firstChild);
    if (!html) return;
    var parser = new DOMParser();
    var doc = parser.parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + html + "</svg>",
      "image/svg+xml"
    );
    var root = doc.documentElement;
    var i;
    for (i = 0; i < root.childNodes.length; i++) {
      if (root.childNodes[i].nodeType === 1) {
        gEl.appendChild(document.importNode(root.childNodes[i], true));
      }
    }
  }

  function enzymeAssetHrefForVariant(variant) {
    var MF = global.MoleculeFlat2d;
    if (!MF) return null;
    variant = variant || "default";
    if (MF.ENZYME_FLAT_ASSETS && MF.ENZYME_FLAT_ASSETS[variant]) {
      return MF.ENZYME_FLAT_ASSETS[variant];
    }
    if (MF.isAmylaseVariant && MF.isAmylaseVariant(variant) && MF.AMYLASE_IMAGE) {
      return MF.AMYLASE_IMAGE.href;
    }
    if (MF.isPancreaticLipaseVariant && MF.isPancreaticLipaseVariant(variant) && MF.PANCREATIC_LIPASE_IMAGE) {
      return MF.PANCREATIC_LIPASE_IMAGE.href;
    }
    if (MF.isDisaccharidaseVariant && MF.isDisaccharidaseVariant(variant) && MF.DISACCHARIDASE_IMAGE) {
      return MF.DISACCHARIDASE_IMAGE.href;
    }
    return null;
  }

  function mountInlineEnzymeLayer(layerEl, variant, enzymeBoost) {
    if (!layerEl) return;
    variant = variant || "default";
    var href = enzymeAssetHrefForVariant(variant);
    if (!href) return;
    var scale = enzymeDisplayScale2dFor(variant) * (enzymeBoost != null ? enzymeBoost : INLINE_ENZYME_BOOST);
    layerEl.innerHTML = '<img class="ef-enzyme-img" src="' + href + '" alt="" draggable="false"/>';
    layerEl.style.transform = "translate(-50%, -50%) scale(" + scale.toFixed(3) + ")";
  }

  function isInlineLayout(layout) {
    return !!(layout && layout.isInline);
  }

  function layoutForVariant(variant, layout) {
    layout = layout || FULL_LAYOUT;
    var inline = isInlineLayout(layout);
    var o = inline
      ? (INLINE_VARIANT_ANIM[variant] || {})
      : (VARIANT_ANIM[variant] || {});
    var MF = global.MoleculeFlat2d;
    var anchor = MF && MF.enzymeAnchorForVariant
      ? MF.enzymeAnchorForVariant(variant || "default")
      : { x: layout.enzymeAnchorX, y: layout.enzymeAnchorY };
    var scale = layout.enzymeScale;
    if (inline && variant === "pancreatic-lipase") {
      scale *= 1;
    }
    return {
      enzX: inline ? inlineCenteredEnzX(variant || "default", scale) : layout.enzX,
      enzY: inline ? inlineCenteredEnzY(variant || "default", scale) : layout.enzY,
      enzymeScale: scale,
      enzymeAnchorX: anchor.x,
      enzymeAnchorY: anchor.y,
      prodSpread: o.prodSpread != null ? o.prodSpread : layout.prodSpread,
      prodArc: o.prodArc != null ? o.prodArc : layout.prodArc,
      prodLift: o.prodLift != null ? o.prodLift : layout.prodLift,
      approachEnd: o.approachEnd != null ? o.approachEnd : layout.approachEnd,
    };
  }

  function lipidReleaseForVariant(variant, compact) {
    var boost = lipaseInlineSizeBoost(variant);
    var faR = variant === "pancreatic-lipase" ? 94 : 82;
    if (compact) faR = variant === "pancreatic-lipase" ? 48 : 58;
    faR *= boost;
    return {
      angles: [-2.35, 0.15, 2.45],
      faRadius: faR,
      faYOffset: compact ? -10 * boost : -18 * boost,
      glyYOffset: compact ? 38 * boost : 78 * boost,
    };
  }

  var FLAT_MOL_BASE = 0.58;
  var MODEL_SIZE_FACTOR = 1.5;
  var SUBSTRATE_VS_ENZYME = 0.4;
  var LABEL_FONT = {
    substrate: { compact: 15, full: 14 },
    enzyme: { compact: 13, full: 12 },
    product: { compact: 13, full: 12 },
    complex: { compact: 12, full: 11 },
    note: 10,
  };
  var SCENE_LABEL_Y = {
    inlineSubstrate: 62,
    fullSubstrate: 104,
    inlineEnzyme: 62,
    fullEnzyme: 118,
  };
  var INLINE_INTRO_TRAVEL = 0.42;

  function labelFontSize(kind, compact) {
    var sizes = LABEL_FONT[kind];
    if (!sizes) return compact ? 13 : 12;
    return compact ? sizes.compact : sizes.full;
  }

  function labelTextHtml(x, y, text, opts) {
    if (!text) return "";
    opts = opts || {};
    var fs = opts.fontSize != null ? opts.fontSize : 12;
    var fill = opts.fill || C.text;
    var op = opts.opacity != null ? opts.opacity : 1;
    var weight = opts.fontWeight != null ? opts.fontWeight : 700;
    var pillW = Math.max(36, text.length * fs * 0.56);
    var pillH = fs + 8;
    var pillX = x - pillW / 2;
    var pillY = y - fs + 2;
    return (
      '<g opacity="' + op.toFixed(2) + '">' +
      '<rect x="' + pillX.toFixed(1) + '" y="' + pillY.toFixed(1) + '" width="' + pillW.toFixed(1) +
      '" height="' + pillH.toFixed(1) + '" rx="5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>' +
      '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + fs +
      '" font-weight="' + weight + '" fill="' + fill + '">' + text + "</text></g>"
    );
  }

  function inlinePhaseLabelHtml(text) {
    return labelTextHtml(INLINE_SCENE.w / 2, INLINE_PHASE_LABEL_H, text, {
      fontSize: 14,
      fill: C.highlight,
      fontWeight: 600,
    });
  }

  function productLabelDy(compact) {
    return compact ? 44 : 38;
  }
  var FLAT_SIZE_REF = {
    starch: 0.9, glycerol: 1, sucrose: 0.95, lactose: 0.95,
    fructose: 1, galactose: 1, "fatty-acid": 1, lipid: 0.92,
    protein: 0.95, peptide: 0.88,
  };
  var MOL_LABELS = {
    starch: "Starch", maltose: "Maltose", sucrose: "Sucrose", lactose: "Lactose",
    protein: "Protein", peptide: "Peptide", lipid: "Lipid", glycerol: "Glycerol",
    "fatty-acid": "Fatty acid", glucose: "Glucose", fructose: "Fructose", galactose: "Galactose",
  };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function prog(stepIdx, localT) { return clamp(localT / STEPS[stepIdx].duration, 0, 1); }

  function flatSizeFor(type) {
    return FLAT_SIZE_REF[type] != null ? FLAT_SIZE_REF[type] : 1;
  }

  function molScale(type) {
    return FLAT_MOL_BASE * MODEL_SIZE_FACTOR * SUBSTRATE_VS_ENZYME * flatSizeFor(type);
  }

  function molLabelFor(type) {
    return MOL_LABELS[type] || type.replace(/-/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function phaseFromP(p) {
    if (p < 0.18) return { key: "intro", t: p / 0.18 };
    if (p < 0.48) return { key: "approachDock", t: (p - 0.18) / 0.30 };
    if (p < 0.72) return { key: "cleave", t: (p - 0.48) / 0.24 };
    return { key: "release", t: (p - 0.72) / 0.28 };
  }

  function phaseLabel(phase) {
    for (var i = 0; i < PHASES.length; i++) {
      if (PHASES[i].key === phase.key) return PHASES[i].label;
    }
    return "";
  }

  function computeFrame(phase, layout) {
    layout = layout || FULL_LAYOUT;
    var dockT = 0;
    var subOp = 0;
    var prodOp = 0;
    var releaseT = 0;
    var cleaveT = 0;

    if (phase.key === "intro") {
      dockT = 0;
      subOp = 1;
    } else if (phase.key === "approachDock") {
      if (phase.t < layout.approachEnd) {
        dockT = easeInOut(phase.t / layout.approachEnd) * 0.28;
      } else {
        var dt = easeInOut((phase.t - layout.approachEnd) / (1 - layout.approachEnd));
        dockT = lerp(0.28, 1, dt);
      }
      subOp = 1;
    } else if (phase.key === "cleave" || phase.key === "recolor") {
      dockT = 1;
      cleaveT = easeInOut(phase.t);
      subOp = 1 - cleaveT;
      prodOp = cleaveT;
    } else {
      dockT = 1;
      releaseT = easeOut(phase.t);
      prodOp = 1;
    }

    return {
      dockT: dockT,
      subOp: subOp,
      prodOp: prodOp,
      releaseT: releaseT,
      cleaveT: cleaveT,
      showEnzymeName: true,
      showProdLabels: prodOp > 0.08,
    };
  }

  /** Lock-and-key frame logic from EnzymeActionAnimation, mapped to flat-molecule dockT. */
  function computeActionFrame(stepIndex, p, layout) {
    layout = layout || INLINE_LAYOUT;
    var dockT = 0;
    var subOp = 0;
    var prodOp = 0;
    var releaseT = 0;
    var cleaveT = 0;

    if (stepIndex === 0) {
      dockT = 0;
      subOp = 1;
    } else if (stepIndex === 1) {
      if (p < layout.approachEnd) {
        dockT = easeInOut(p / layout.approachEnd) * 0.28;
      } else {
        var dt = easeInOut((p - layout.approachEnd) / (1 - layout.approachEnd));
        dockT = lerp(0.28, 1, dt);
      }
      subOp = 1;
    } else if (stepIndex === 2) {
      dockT = 1;
      cleaveT = easeInOut(p);
      subOp = Math.max(0, 1 - cleaveT * 1.35);
      prodOp = cleaveT;
    } else {
      dockT = 1;
      releaseT = easeOut(p);
      prodOp = 1;
    }

    return {
      dockT: dockT,
      subOp: subOp,
      prodOp: prodOp,
      releaseT: releaseT,
      cleaveT: cleaveT,
      showEnzymeName: true,
      showProdLabels: prodOp > 0.08,
    };
  }

  function layoutForActionMode(variant, layout) {
    var base = layoutForVariant(variant, layout || INLINE_LAYOUT);
    return {
      enzX: base.enzX,
      enzY: base.enzY,
      enzymeScale: base.enzymeScale,
      enzymeAnchorX: base.enzymeAnchorX,
      enzymeAnchorY: base.enzymeAnchorY,
      prodSpread: base.prodSpread,
      prodArc: base.prodArc + 4,
      prodLift: base.prodLift - 10,
      approachEnd: base.approachEnd,
    };
  }

  function molProduct(productType, substrateType, cx, cy, layout, opts) {
    var MF = global.MoleculeFlat2d;
    if (!MF || !MF.renderFlatEmbed || !MF.productSceneScale) return "";
    opts = opts || {};
    layout = layout || FULL_LAYOUT;
    return MF.renderFlatEmbed(productType, cx, cy, {
      embedScale: MF.productSceneScale(
        substrateType,
        productType,
        layout.enzymeScale,
        opts.variant
      ) * (opts.sizeScale != null ? opts.sizeScale : 1),
      opacity: opts.opacity,
      label: opts.label,
      labelDy: opts.labelDy != null ? opts.labelDy : 34,
      labelSize: 8,
      labelColor: C.text,
      labelOpacity: opts.opacity,
      colors: MF.COLORS,
    });
  }

  function mol(type, cx, cy, opts) {
    var MF = global.MoleculeFlat2d;
    if (!MF || !MF.renderFlatEmbed) return "";
    opts = opts || {};
    var baseScale = opts.layeredFlat
      ? inlineFlatMolScale(type, opts.modelBoost)
      : molScale(type);
    return MF.renderFlatEmbed(type, cx, cy, {
      embedScale: baseScale * (opts.sizeScale != null ? opts.sizeScale : 1),
      opacity: opts.opacity,
      label: opts.label,
      labelDy: opts.labelDy != null ? opts.labelDy : (opts.compact ? 40 : 34),
      labelSize: opts.labelSize != null ? opts.labelSize : (opts.compact ? 10.5 : 7.5),
      labelColor: C.text,
      labelOpacity: opts.opacity,
      colors: MF.COLORS,
    });
  }

  function molProductLayered(productType, substrateType, cx, cy, opts) {
    opts = opts || {};
    var base = molScale(productType);
    var scale = inlineFlatProductScale(substrateType, productType, opts.modelBoost);
    return mol(productType, cx, cy, {
      layeredFlat: true,
      modelBoost: opts.modelBoost,
      sizeScale: base > 0 ? scale / base : 1,
      opacity: opts.opacity,
      label: opts.label,
      labelDy: opts.compact ? 40 : 34,
      labelSize: opts.compact ? 10.5 : 8,
      compact: opts.compact,
    });
  }

  function substrateHtmlFlat(type, layout, frame, variant, opts) {
    opts = opts || {};
    if (frame.subOp <= 0.01) return "";
    var pos = holeScreenPosForMode(layout, type, frame.dockT, variant, true);
    return mol(type, pos.x, pos.y, {
      layeredFlat: true,
      modelBoost: opts.modelBoost,
      opacity: frame.subOp,
      label: false,
      compact: opts.compact,
    });
  }

  function enzymeTransformAttr(layout) {
    return (
      'transform="translate(' + layout.enzX + "," + layout.enzY +
      ") scale(" + layout.enzymeScale + ") translate(" +
      (-layout.enzymeAnchorX) + "," + (-layout.enzymeAnchorY) + ')"'
    );
  }

  function enzymeBodyHtml(variant, layout, holeOpacity) {
    var MF = global.MoleculeFlat2d;
    if (!MF || !MF.renderEnzymeFlatScene) return "";
    var op = holeOpacity != null
      ? holeOpacity
      : (MF.ACTIVE_SITE_OPACITY != null ? MF.ACTIVE_SITE_OPACITY : 1);
    return MF.renderEnzymeFlatScene(variant || "default", {
      hole: C.hole,
      holeEdge: C.holeEdge,
      holeOpacity: op,
    });
  }

  function substrateInHoleHtml(variant, layout, substrate, compact) {
    var MF = global.MoleculeFlat2d;
    if (!MF || !MF.renderFlatEmbedInEnzymeHole || !substrate || substrate.opacity <= 0.01) return "";
    return MF.renderFlatEmbedInEnzymeHole(substrate.type, substrate.dockT, {
      opacity: substrate.opacity,
      colors: MF.COLORS,
      variant: variant || "default",
      introTravel: compact ? INLINE_INTRO_TRAVEL : 1,
      sizeBoost: 1,
    });
  }


  function isCarbHexType(type) {
    return type === "glucose" || type === "fructose" || type === "galactose" || type === "maltose";
  }

  function isCarbHexVisual(cfg) {
    if (!cfg || cfg.layout === "lipid") return false;
    var products = cfg.products || [];
    var i;
    for (i = 0; i < products.length; i++) {
      if (!isCarbHexType(products[i])) return false;
    }
    return products.length > 0;
  }

  function usesDockedCarbRelease(variant, cfg) {
    var MF = global.MoleculeFlat2d;
    if (!isCarbHexVisual(cfg) || !MF) return false;
    if (MF.isAmylaseVariant && MF.isAmylaseVariant(variant) && cfg.substrate === "starch") return true;
    if (MF.isDisaccharidaseVariant && MF.isDisaccharidaseVariant(variant)) return true;
    return false;
  }

  function carbReleaseSpinDir(index, total, variant, cfg) {
    var MF = global.MoleculeFlat2d;
    if (
      MF && MF.isAmylaseVariant && MF.isAmylaseVariant(variant) &&
      cfg && cfg.substrate === "starch" && total === 3
    ) {
      if (index === 0) return -1;
      if (index === 1) return 2;
      return 1;
    }
    if (total === 2) return index === 0 ? -1 : 1;
    if (total === 3) {
      if (index === 0) return -1;
      if (index === total - 1) return 1;
      return 0;
    }
    if (index === 0) return -1;
    if (index === total - 1) return 1;
    return 0;
  }

  /** Rotate outward from dock: anticlockwise (−1), vertical up (2), clockwise (+1). */
  function carbReleasePos(dock, layout, releaseT, spinDir) {
    if (!releaseT) return dock;
    var rp = easeInOut(releaseT);
    if (spinDir === 2) {
      return {
        x: dock.x,
        y: dock.y - rp * (layout.prodSpread * 0.58) + rp * (layout.prodLift || 0) * 0.5,
      };
    }
    if (!spinDir) return dock;
    var cx = layout.enzX;
    var cy = layout.enzY;
    var dx = dock.x - cx;
    var dy = dock.y - cy;
    var r = Math.sqrt(dx * dx + dy * dy);
    if (r < 0.001) r = 1;
    var angle = Math.atan2(dy, dx);
    var sweep = spinDir * rp * 0.72;
    var outR = r + rp * (layout.prodSpread * 0.52);
    return {
      x: cx + Math.cos(angle + sweep) * outR,
      y: cy + Math.sin(angle + sweep) * outR + rp * (layout.prodLift || 0),
    };
  }

  function carbProductPos(dock, layout, frame, index, total, variant, cfg) {
    if (usesDockedCarbRelease(variant, cfg)) {
      return carbReleasePos(
        dock,
        layout,
        frame.releaseT,
        carbReleaseSpinDir(index, total, variant, cfg)
      );
    }
    return dock;
  }

  function carbDockPositions(cfg, layout, variant, layeredFlat) {
    var MF = global.MoleculeFlat2d;
    var products = cfg.products;
    var n = products.length;
    var positions = [];
    var i;
    var hole;
    var halfSep;
    var spread;
    var start;

    if (MF && MF.isAmylaseVariant && MF.isAmylaseVariant(variant) && cfg.substrate === "starch" && n === 3) {
      var toothIdx = [1, 3, 5];
      for (i = 0; i < 3; i++) {
        var amylLocal = MF.amylaseToothValleyLocal(toothIdx[i]);
        positions.push(enzymeLocalToScene(layout, amylLocal.cx, amylLocal.cy));
      }
      return positions;
    }

    if (MF && MF.isDisaccharidaseVariant && MF.isDisaccharidaseVariant(variant) && n === 2) {
      for (i = 1; i <= 2; i++) {
        var pocket = MF.disaccharidasePocketLocal(i);
        positions.push(enzymeLocalToScene(layout, pocket.cx, pocket.cy));
      }
      return positions;
    }

    hole = holeScreenPosForMode(layout, cfg.substrate, 1, variant, layeredFlat);
    if (n === 1) {
      positions.push({ x: hole.x, y: hole.y });
    } else if (n === 2) {
      halfSep = 22;
      positions.push({ x: hole.x - halfSep, y: hole.y });
      positions.push({ x: hole.x + halfSep, y: hole.y });
    } else {
      spread = 28;
      start = hole.x - (spread * (n - 1)) / 2;
      for (i = 0; i < n; i++) {
        positions.push({ x: start + i * spread, y: hole.y });
      }
    }
    return positions;
  }

  function enzymeGroupHtml(variant, layout, substrate, compact, opts) {
    opts = opts || {};
    layout = layout || FULL_LAYOUT;
    var MF = global.MoleculeFlat2d;
    var xform = enzymeTransformAttr(layout);
    var dockT = substrate && substrate.dockT != null ? substrate.dockT : 0;
    var subOp = substrate && substrate.opacity != null ? substrate.opacity : 0;
    var prodOp = opts.prodOp != null ? opts.prodOp : 0;
    var dockCovers = MF && MF.DOCK_COVERS_YELLOW != null ? MF.DOCK_COVERS_YELLOW : 0.88;
    var hideYellowWhenCovered = !(MF && MF.isPepsinProteaseVariant && MF.isPepsinProteaseVariant(variant));
    var substrateComplex = subOp > 0.08 && dockT >= dockCovers;
    var coversYellow = hideYellowWhenCovered && substrateComplex && prodOp <= 0.02;
    var subHtml = substrateInHoleHtml(variant, layout, substrate, compact);
    var activeHoleOpacity = coversYellow ? 0 : (MF.ACTIVE_SITE_OPACITY != null ? MF.ACTIVE_SITE_OPACITY : 1);

    if (MF && MF.isDisaccharidaseVariant && MF.isDisaccharidaseVariant(variant)) {
      var slotColors = {
        hole: C.hole,
        holeEdge: C.holeEdge,
      };
      var holeOpacity = coversYellow ? 0 : (MF.DISACCHARIDASE_HOLE_OPACITY != null
        ? MF.DISACCHARIDASE_HOLE_OPACITY
        : activeHoleOpacity);
      var body = MF.buildDisaccharidaseBodyScene
        ? MF.buildDisaccharidaseBodyScene(slotColors, { holeOpacity: holeOpacity })
        : enzymeBodyHtml(variant, layout, holeOpacity);
      var holes = coversYellow ? "" : (MF.buildDisaccharidaseHoleScene
        ? MF.buildDisaccharidaseHoleScene(slotColors, { holeOpacity: holeOpacity })
        : "");
      return (
        '<g class="dig-enzyme-body" ' + xform + ">" + body + "</g>" +
        (holes ? '<g class="dig-enzyme-holes" ' + xform + ">" + holes + "</g>" : "") +
        (subHtml ? '<g class="dig-substrate-layer" ' + xform + ">" + subHtml + "</g>" : "")
      );
    }

    if (MF && MF.isAmylaseVariant && MF.isAmylaseVariant(variant)) {
      var amylBody = enzymeBodyHtml(variant, layout, coversYellow ? 0 : activeHoleOpacity);
      return (
        '<g class="dig-enzyme-body" ' + xform + ">" + amylBody + "</g>" +
        (subHtml ? '<g class="dig-substrate-layer" ' + xform + ">" + subHtml + "</g>" : "")
      );
    }

    if (MF && MF.isPancreaticLipaseVariant && MF.isPancreaticLipaseVariant(variant)) {
      var lipHoleOpacity = coversYellow ? 0 : activeHoleOpacity;
      var lipBody = enzymeBodyHtml(variant, layout, lipHoleOpacity);
      return (
        '<g class="dig-enzyme-body" ' + xform + ">" + lipBody + "</g>" +
        (subHtml ? '<g class="dig-substrate-layer" ' + xform + ">" + subHtml + "</g>" : "")
      );
    }

    if (MF && MF.isPepsinProteaseVariant && MF.isPepsinProteaseVariant(variant)) {
      var pepBody = enzymeBodyHtml(variant, layout, MF.ACTIVE_SITE_OPACITY != null ? MF.ACTIVE_SITE_OPACITY : 1);
      return (
        '<g class="dig-enzyme-body" ' + xform + ">" + pepBody + "</g>" +
        (subHtml ? '<g class="dig-substrate-layer" ' + xform + ">" + subHtml + "</g>" : "")
      );
    }

    var body = enzymeBodyHtml(variant, layout, activeHoleOpacity);
    return (
      '<g class="dig-enzyme-body" ' + xform + ">" + body + "</g>" +
      (subHtml ? '<g class="dig-substrate-layer" ' + xform + ">" + subHtml + "</g>" : "")
    );
  }

  function substrateLabelHtml(type, layout, frame, variant, layeredFlat, compact) {
    if (!frame.showSubLabel) return "";
    var labelY = compact ? SCENE_LABEL_Y.inlineSubstrate : SCENE_LABEL_Y.fullSubstrate;
    return labelTextHtml(layout.enzX, labelY, molLabelFor(type), {
      fontSize: labelFontSize("substrate", compact),
      fill: C.text,
      opacity: frame.subOp,
    });
  }

  function carbProductsHtml(cfg, frame, layout, variant, opts) {
    layout = layout || FULL_LAYOUT;
    opts = opts || {};
    var layeredFlat = !!opts.layeredFlat;
    var html = "";
    var pop = frame.prodOp;
    var dockPositions = carbDockPositions(cfg, layout, variant, layeredFlat);
    var n = cfg.products.length;
    var prodOpts = {
      opacity: pop,
      variant: variant,
      label: false,
      modelBoost: opts.modelBoost,
      compact: opts.compact,
    };
    var i;
    for (i = 0; i < n; i++) {
      var dock = dockPositions[i] || dockPositions[dockPositions.length - 1];
      var pos = carbProductPos(dock, layout, frame, i, n, variant, cfg);
      var productType = cfg.products[i];
      if (layeredFlat) {
        html += molProductLayered(productType, cfg.substrate, pos.x, pos.y, prodOpts);
      } else {
        html += molProduct(productType, cfg.substrate, pos.x, pos.y, layout, prodOpts);
      }
    }
    return html;
  }

  function carbProductLabelsHtml(cfg, frame, layout, variant, opts) {
    if (!frame.showProdLabels) return "";
    layout = layout || FULL_LAYOUT;
    opts = opts || {};
    var layeredFlat = !!opts.layeredFlat;
    var compact = !!opts.compact;
    var pop = frame.prodOp;
    var dockPositions = carbDockPositions(cfg, layout, variant, layeredFlat);
    var n = cfg.products.length;
    var fs = labelFontSize("product", compact);
    var dy = productLabelDy(compact);
    var html = "";
    var i;
    for (i = 0; i < n; i++) {
      var dock = dockPositions[i] || dockPositions[dockPositions.length - 1];
      var pos = carbProductPos(dock, layout, frame, i, n, variant, cfg);
      html += labelTextHtml(pos.x, pos.y + dy, molLabelFor(cfg.products[i]), { fontSize: fs, opacity: pop });
    }
    return html;
  }

  function productPairHtml(cfg, frame, layout, variant, opts) {
    layout = layout || FULL_LAYOUT;
    opts = opts || {};
    var layeredFlat = !!opts.layeredFlat;
    var html = "";
    var rp = frame.releaseT;
    var dist = rp * layout.prodSpread;
    var arc = rp * layout.prodArc;
    var lift = lerp(0, layout.prodLift, frame.releaseT);
    var hole = holeScreenPosForMode(layout, cfg.substrate, 1, variant, layeredFlat);
    var dockY = hole.y;
    var dockX = hole.x;
    var pop = frame.prodOp;
    var left = cfg.products[0];
    var right = cfg.products[1];
    var lx = dockX - dist - rp * 4;
    var rx = dockX + dist + rp * 4;
    var ly = dockY - arc + lift;
    var ry = ly;
    var prodOpts = {
      opacity: pop,
      variant: variant,
      label: false,
      modelBoost: opts.modelBoost,
      compact: opts.compact,
    };
    if (layeredFlat) {
      html += molProductLayered(left, cfg.substrate, lx, ly, prodOpts);
      html += molProductLayered(right, cfg.substrate, rx, ry, prodOpts);
    } else {
      html += molProduct(left, cfg.substrate, lx, ly, layout, prodOpts);
      html += molProduct(right, cfg.substrate, rx, ry, layout, prodOpts);
    }
    return html;
  }

  function productLabelsHtml(cfg, frame, layout, variant, opts) {
    if (!frame.showProdLabels) return "";
    layout = layout || FULL_LAYOUT;
    opts = opts || {};
    var layeredFlat = !!opts.layeredFlat;
    var compact = !!opts.compact;
    var rp = frame.releaseT;
    var dist = rp * layout.prodSpread;
    var arc = rp * layout.prodArc;
    var lift = lerp(0, layout.prodLift, frame.releaseT);
    var hole = holeScreenPosForMode(layout, cfg.substrate, 1, variant, layeredFlat);
    var pop = frame.prodOp;
    var left = cfg.products[0];
    var right = cfg.products[1];
    var lx = hole.x - dist - rp * 4;
    var rx = hole.x + dist + rp * 4;
    var ly = hole.y - arc + lift;
    var fs = labelFontSize("product", compact);
    var dy = productLabelDy(compact);
    var html = labelTextHtml(lx, ly + dy, molLabelFor(left), { fontSize: fs, opacity: pop });
    html += labelTextHtml(rx, ly + dy, molLabelFor(right), { fontSize: fs, opacity: pop });
    return html;
  }

  function lipidTailTipsModel() {
    var tails = [
      { x: 36, y: 38, ang: -2.4 },
      { x: 64, y: 38, ang: -0.7 },
      { x: 50, y: 18, ang: 1.5 },
    ];
    var tips = [];
    var i;
    var t;
    var px;
    var py;
    var j;
    for (i = 0; i < tails.length; i++) {
      t = tails[i];
      px = t.x;
      py = t.y;
      for (j = 1; j <= 4; j++) {
        px += Math.cos(t.ang) * 11;
        py += Math.sin(t.ang) * 7;
      }
      tips.push({ x: px, y: py });
    }
    return tips;
  }

  function modelPointToScene(mx, my, layout, variant, substrateType) {
    var MF = global.MoleculeFlat2d;
    var fit = MF && MF.holeFitForVariant
      ? MF.holeFitForVariant(variant, substrateType || "lipid")
      : { cx: 50, cy: 30, scale: 1 };
    var lx = fit.cx + (mx - 50) * fit.scale;
    var ly = fit.cy + (my - 30) * fit.scale;
    return enzymeLocalToScene(layout, lx, ly);
  }

  function lipidDockPositions(layout, variant, substrateType) {
    var tips = lipidTailTipsModel();
    var positions = [];
    var newsDirs = ["W", "E", "N"];
    var i;
    for (i = 0; i < 3; i++) {
      var faScene = modelPointToScene(tips[i].x, tips[i].y, layout, variant, substrateType);
      positions.push({
        x: faScene.x,
        y: faScene.y,
        news: newsDirs[i],
        type: "fatty-acid",
      });
    }
    var glyScene = modelPointToScene(50, 35, layout, variant, substrateType);
    positions.push({ x: glyScene.x, y: glyScene.y, news: "S", type: "glycerol" });
    return positions;
  }

  function lipidNewsOffset(news, layout, releaseT) {
    var rp = easeInOut(releaseT);
    var dist = rp * (layout.prodSpread * 0.45);
    if (news === "N") return { dx: 0, dy: -dist };
    if (news === "E") return { dx: dist, dy: 0 };
    if (news === "W") return { dx: -dist, dy: 0 };
    if (news === "S") return { dx: 0, dy: dist };
    return { dx: 0, dy: 0 };
  }

  function lipidProductPos(dock, layout, frame) {
    var off = lipidNewsOffset(dock.news, layout, frame.releaseT);
    return { x: dock.x + off.dx, y: dock.y + off.dy };
  }

  function lipidProductsHtml(frame, layout, substrateType, variant, opts) {
    layout = layout || FULL_LAYOUT;
    opts = opts || {};
    var layeredFlat = !!opts.layeredFlat;
    var html = "";
    var pop = frame.prodOp;
    var docks = lipidDockPositions(layout, variant, substrateType);
    var i;
    for (i = 0; i < docks.length; i++) {
      var dock = docks[i];
      var pos = lipidProductPos(dock, layout, frame);
      var fop = dock.type === "fatty-acid" ? clamp(pop - i * 0.05, 0, 1) : pop;
      var prodOpts = {
        opacity: fop,
        variant: variant,
        label: false,
        modelBoost: opts.modelBoost,
        compact: opts.compact,
        sizeScale: opts.sizeBoost != null ? opts.sizeBoost : 1,
      };
      if (layeredFlat) {
        html += molProductLayered(dock.type, substrateType || "lipid", pos.x, pos.y, prodOpts);
      } else {
        html += molProduct(dock.type, substrateType || "lipid", pos.x, pos.y, layout, prodOpts);
      }
    }
    return html;
  }

  function lipidProductLabelsHtml(frame, layout, substrateType, variant, opts) {
    if (!frame.showProdLabels) return "";
    layout = layout || FULL_LAYOUT;
    opts = opts || {};
    var compact = !!opts.compact;
    var pop = frame.prodOp;
    var docks = lipidDockPositions(layout, variant, substrateType);
    var fs = labelFontSize("product", compact);
    var dy = productLabelDy(compact);
    var html = "";
    var i;
    for (i = 0; i < docks.length; i++) {
      var dock = docks[i];
      var pos = lipidProductPos(dock, layout, frame);
      var fop = dock.type === "fatty-acid" ? clamp(pop - i * 0.05, 0, 1) : pop;
      html += labelTextHtml(pos.x, pos.y + dy, molLabelFor(dock.type), { fontSize: fs, opacity: fop });
    }
    return html;
  }

  function renderReaction(step, phase, layout, opts) {
    layout = layout || FULL_LAYOUT;
    opts = opts || {};
    var cfg = VISUALS[step.visual];
    if (!cfg) return "";
    var variant = step.proteinVariant || "default";
    var activeLayout = opts.actionMode
      ? layoutForActionMode(variant, layout)
      : layoutForVariant(variant, layout);
    var frame = opts.frameOverride || computeFrame(phase, activeLayout);
    var layeredFlat = !!opts.layeredFlat;
    var compact = !!opts.compact;
    var html = "";
    var labelsHtml = "";

    if (layeredFlat) {
      if (frame.subOp > 0.01) {
        html += substrateHtmlFlat(cfg.substrate, activeLayout, frame, variant, opts);
      }
    } else {
      html += enzymeGroupHtml(variant, activeLayout, {
        type: cfg.substrate,
        dockT: frame.dockT,
        opacity: frame.subOp,
      }, compact, Object.assign({}, opts, { prodOp: frame.prodOp }));
    }

    if (frame.prodOp > 0.01) {
      if (cfg.layout === "lipid") {
        html += lipidProductsHtml(frame, activeLayout, cfg.substrate, variant, opts);
        labelsHtml += lipidProductLabelsHtml(frame, activeLayout, cfg.substrate, variant, opts);
      } else if (isCarbHexVisual(cfg)) {
        html += carbProductsHtml(cfg, frame, activeLayout, variant, opts);
        labelsHtml += carbProductLabelsHtml(cfg, frame, activeLayout, variant, opts);
      } else {
        html += productPairHtml(cfg, frame, activeLayout, variant, opts);
        labelsHtml += productLabelsHtml(cfg, frame, activeLayout, variant, opts);
      }
    }

    if (frame.showEnzymeName) {
      var nameY = compact ? 18 : SCENE_LABEL_Y.fullEnzyme;
      labelsHtml += labelTextHtml(activeLayout.enzX, nameY, step.enzyme, {
        fontSize: labelFontSize("enzyme", compact),
        fill: C.highlight,
      });
    }

    if (labelsHtml) {
      html += '<g class="dig-label-layer" pointer-events="none">' + labelsHtml + "</g>";
    }

    return html;
  }

  function findStepByEnzymeId(enzymeId) {
    for (var i = 0; i < STEPS.length; i++) {
      if (STEPS[i].id === enzymeId) return STEPS[i];
    }
    return STEPS[0];
  }

  function progForStep(step, localT) {
    return clamp(localT / step.duration, 0, 1);
  }

  function tractHtml(activeZone) {
    var zones = [
      { id: "mouth", label: "Mouth", x: 60, w: 88, fill: C.mouth },
      { id: "stomach", label: "Stomach", x: 185, w: 95, fill: C.stomach },
      { id: "intestine", label: "Small intestine", x: 325, w: 115, fill: C.intestine },
      { id: "brush", label: "Brush border", x: 480, w: 85, fill: C.brush },
    ];
    var html = "";
    zones.forEach(function (z) {
      var active = z.id === activeZone;
      html +=
        '<rect x="' + z.x + '" y="10" width="' + z.w + '" height="30" rx="7" fill="' + z.fill +
        '" stroke="' + (active ? C.highlight : "#c8d0dc") + '" stroke-width="' + (active ? 2.5 : 1) +
        '" opacity="' + (active ? 1 : 0.5) + '"/>' +
        '<text x="' + (z.x + z.w / 2) + '" y="30" text-anchor="middle" font-size="8.5" font-weight="' +
        (active ? 700 : 500) + '" fill="' + C.text + '">' + z.label + "</text>";
    });
    return html;
  }

  function DigestionEnzymesAnimation(root, hooks) {
    if (!root) throw new Error("DigestionEnzymesAnimation: missing root element");
    this.root = root;
    this.hooks = hooks || {};
    this.stepIndex = 0;
    this.localT = 0;
    this.playing = true;
    this.lastTs = 0;
    this.raf = null;

    root.innerHTML =
      '<div class="dig-scene">' +
      '<svg viewBox="0 0 ' + SCENE.w + " " + SCENE.h +
      '" role="img" aria-label="Digestive enzyme breakdown animation">' +
      '<rect x="0" y="0" width="' + SCENE.w + '" height="' + SCENE.h + '" fill="#fff"/>' +
      '<g data-id="tract"></g>' +
      '<rect x="20" y="48" width="600" height="28" rx="8" fill="#f2f6fa" stroke="#d8dee9"/>' +
      '<text data-id="phase-label" x="320" y="66" text-anchor="middle" font-size="13" font-weight="600" fill="' +
      C.highlight + '"></text>' +
      '<text data-id="equation" x="320" y="88" text-anchor="middle" font-size="10" fill="' + C.muted + '"></text>' +
      '<g data-id="reaction"></g>' +
      '<g data-id="badges"></g>' +
      "</svg></div>";

    this.gTract = root.querySelector('[data-id="tract"]');
    this.gReaction = root.querySelector('[data-id="reaction"]');
    this.gBadges = root.querySelector('[data-id="badges"]');
    this.elEquation = root.querySelector('[data-id="equation"]');
    this.elPhase = root.querySelector('[data-id="phase-label"]');

    this._drawBadges();
    this._tick = this._tick.bind(this);
    this._applyFrame();
    this._emitStep();
    this.raf = requestAnimationFrame(this._tick);
  }

  DigestionEnzymesAnimation.prototype._drawBadges = function () {
    var spacing = 62;
    var start = 320 - ((STEPS.length - 1) * spacing) / 2;
    var html = "";
    for (var i = 0; i < STEPS.length; i++) {
      var cx = start + i * spacing;
      var n = i + 1;
      html +=
        '<circle cx="' + cx + '" cy="395" r="11" fill="#e8edf2" stroke="#b8c4d4" data-badge="' + n + '"/>' +
        '<text x="' + cx + '" y="399" text-anchor="middle" fill="#5a6270" font-size="9" font-weight="700" data-badge-t="' +
        n + '">' + n + "</text>";
    }
    this.gBadges.innerHTML = html;
  };

  DigestionEnzymesAnimation.prototype._applyFrame = function () {
    var step = STEPS[this.stepIndex];
    var p = prog(this.stepIndex, this.localT);
    var phase = phaseFromP(p);

    this.gTract.innerHTML = tractHtml(step.zone);
    this.elEquation.textContent = step.equation + "  ·  " + step.location;
    this.elPhase.textContent = phaseLabel(phase);
    this.gReaction.innerHTML = renderReaction(step, phase);

    var badges = this.gBadges.querySelectorAll("[data-badge]");
    for (var i = 0; i < badges.length; i++) {
      var n = i + 1;
      var on = n === step.badge;
      badges[i].setAttribute("fill", on ? C.enzyme : "#e8edf2");
      badges[i].setAttribute("stroke", on ? C.enzymeEdge : "#b8c4d4");
      var t = this.gBadges.querySelector('[data-badge-t="' + n + '"]');
      if (t) t.setAttribute("fill", on ? "#fff" : "#5a6270");
    }
  };

  DigestionEnzymesAnimation.prototype._emitStep = function () {
    if (this.hooks.onStep) this.hooks.onStep(STEPS[this.stepIndex], this.stepIndex);
  };

  DigestionEnzymesAnimation.prototype._tick = function (ts) {
    if (!this.lastTs) this.lastTs = ts;
    var dt = ts - this.lastTs;
    this.lastTs = ts;

    if (this.playing) {
      this.localT += dt;
      var step = STEPS[this.stepIndex];
      if (this.localT >= step.duration) {
        this.localT = 0;
        if (this.stepIndex < STEPS.length - 1) {
          this.stepIndex += 1;
          this._emitStep();
        } else {
          this.playing = false;
          if (this.hooks.onComplete) this.hooks.onComplete();
        }
      }
    }

    this._applyFrame();
    this.raf = requestAnimationFrame(this._tick);
  };

  DigestionEnzymesAnimation.prototype.pause = function () { this.playing = false; };
  DigestionEnzymesAnimation.prototype.play = function () { this.playing = true; this.lastTs = 0; };
  DigestionEnzymesAnimation.prototype.toggle = function () { this.playing = !this.playing; if (this.playing) this.lastTs = 0; };
  DigestionEnzymesAnimation.prototype.goToStep = function (index, resetLocal) {
    this.stepIndex = clamp(index, 0, STEPS.length - 1);
    if (resetLocal) this.localT = 0;
    this._emitStep();
    this._applyFrame();
  };
  DigestionEnzymesAnimation.prototype.prev = function () {
    if (this.stepIndex > 0) { this.stepIndex -= 1; this.localT = 0; this._emitStep(); }
  };
  DigestionEnzymesAnimation.prototype.next = function () {
    if (this.stepIndex < STEPS.length - 1) { this.stepIndex += 1; this.localT = 0; this._emitStep(); }
  };
  DigestionEnzymesAnimation.prototype.restart = function () {
    this.stepIndex = 0; this.localT = 0; this.playing = true; this.lastTs = 0; this._emitStep();
  };
  DigestionEnzymesAnimation.prototype.destroy = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  };

  function EnzymeReactionInlineAnimation(root, enzymeId, hooks) {
    if (!root) throw new Error("EnzymeReactionInlineAnimation: missing root element");
    this.root = root;
    this.hooks = hooks || {};
    this.step = findStepByEnzymeId(enzymeId);
    this.layout = INLINE_LAYOUT;
    this.animationMode = this.hooks.animationMode || "digestion";
    this.actionStepIndex = 0;
    this.localT = 0;
    this.playing = true;
    this.loop = this.hooks.loop !== false;
    this.lastTs = 0;
    this.raf = null;
    this.modelBoost = this.hooks.modelBoost != null ? this.hooks.modelBoost : INLINE_MODEL_BOOST;
    this.enzymeBoost = this.hooks.enzymeBoost != null ? this.hooks.enzymeBoost : INLINE_ENZYME_BOOST;

    root.innerHTML =
      '<div class="ef-inline-scene">' +
      '<svg class="ef-reaction-layer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' +
      INLINE_SCENE.w + " " + INLINE_SCENE.h +
      '" role="img" aria-label="' + this.step.enzyme + ' breakdown animation (2D)">' +
      '<g data-id="reaction"></g>' +
      '<g data-id="phase-label" pointer-events="none"></g>' +
      "</svg></div>";

    this.gPhaseLabel = root.querySelector('[data-id="phase-label"]');
    this.gReaction = root.querySelector('[data-id="reaction"]');
    this._tick = this._tick.bind(this);
    this._applyFrame();
    this.raf = requestAnimationFrame(this._tick);
  }

  EnzymeReactionInlineAnimation.prototype._applyFrame = function () {
    var phase;
    var renderOpts = { compact: true, layeredFlat: false };

    if (this.animationMode === "action") {
      var actionStep = ACTION_STEPS[this.actionStepIndex];
      var p = clamp(this.localT / actionStep.duration, 0, 1);
      var variant = this.step.proteinVariant || "default";
      var activeLayout = layoutForActionMode(variant, this.layout);
      phase = { key: actionStep.id, t: p };
      renderOpts.actionMode = true;
      renderOpts.frameOverride = computeActionFrame(this.actionStepIndex, p, activeLayout);
    } else {
      var progP = progForStep(this.step, this.localT);
      phase = phaseFromP(progP);
    }

    if (this.gReaction) {
      this.gReaction.innerHTML = renderReaction(this.step, phase, this.layout, renderOpts);
    }
    if (this.gPhaseLabel) {
      this.gPhaseLabel.innerHTML = "";
    }
  };

  EnzymeReactionInlineAnimation.prototype._tick = function (ts) {
    if (!this.lastTs) this.lastTs = ts;
    var dt = ts - this.lastTs;
    this.lastTs = ts;

    if (this.playing) {
      this.localT += dt;

      if (this.animationMode === "action") {
        var actionStep = ACTION_STEPS[this.actionStepIndex];
        if (this.localT >= actionStep.duration) {
          if (this.loop) {
            this.actionStepIndex = (this.actionStepIndex + 1) % ACTION_STEPS.length;
            this.localT = 0;
            if (this.hooks.onActionStep) {
              this.hooks.onActionStep(ACTION_STEPS[this.actionStepIndex], this.actionStepIndex);
            }
          } else if (this.actionStepIndex < ACTION_STEPS.length - 1) {
            this.actionStepIndex += 1;
            this.localT = 0;
            if (this.hooks.onActionStep) {
              this.hooks.onActionStep(ACTION_STEPS[this.actionStepIndex], this.actionStepIndex);
            }
          } else {
            this.localT = actionStep.duration;
            this.playing = false;
            if (this.hooks.onComplete) this.hooks.onComplete(this.step);
          }
        }
      } else if (this.localT >= this.step.duration) {
        if (this.loop) {
          this.localT = 0;
          if (this.hooks.onLoop) this.hooks.onLoop(this.step);
        } else {
          this.localT = this.step.duration;
          this.playing = false;
          if (this.hooks.onComplete) this.hooks.onComplete(this.step);
        }
      }
    }

    this._applyFrame();
    this.raf = requestAnimationFrame(this._tick);
  };

  EnzymeReactionInlineAnimation.prototype.pause = function () { this.playing = false; };
  EnzymeReactionInlineAnimation.prototype.play = function () { this.playing = true; this.lastTs = 0; };
  EnzymeReactionInlineAnimation.prototype.restart = function () {
    this.localT = 0;
    this.actionStepIndex = 0;
    this.playing = true;
    this.lastTs = 0;
    this._applyFrame();
  };
  EnzymeReactionInlineAnimation.prototype.destroy = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    if (this.root) this.root.innerHTML = "";
  };

  global.DIGESTION_ENZYME_STEPS = STEPS;
  global.DigestionEnzymesAnimation = DigestionEnzymesAnimation;
  global.EnzymeReactionInlineAnimation2d = EnzymeReactionInlineAnimation;
  global.findDigestionStepByEnzymeId = findStepByEnzymeId;
})(typeof window !== "undefined" ? window : globalThis);
