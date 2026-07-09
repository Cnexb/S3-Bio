/**
 * Digestive enzymes — 8-step animation using 3D ball-and-stick models.
 * Catalytic cycle: intro → approach → induced-fit → cleave → release.
 * FROZEN snapshot — enzyme via EnzymeConditionAnimation overlay; substrates via MoleculeBallStick.
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
      equation: "Proteins / Peptides → Smaller peptides",
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
    { key: "approach", label: "2. Substrate approaches active site" },
    { key: "inducedFit", label: "3. Induced fit — enzyme–substrate complex" },
    { key: "cleave", label: "4. Substrate → products" },
    { key: "release", label: "5. Products released" },
  ];

  var VISUALS = {
    "starch-maltose": {
      substrate: "starch",
      products: ["maltose", "maltose"],
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
  var INLINE_SCENE = { w: 640, h: 320 };

  var C = {
    enzyme: "#89C2EB",
    enzymeEdge: "#6AABD8",
    mouth: "#f4a9a0",
    stomach: "#e8c4a8",
    intestine: "#b8dfc8",
    brush: "#9fd4b0",
    text: "#2a3340",
    muted: "#5a6270",
    highlight: "#004e9f",
  };

  var ENZYME_DISPLAY_SCALE = 1.4;
  var MODEL_SIZE_FACTOR = 1.5;
  var SUBSTRATE_VS_ENZYME = 0.4;
  var MOL_BASE = 0.58;

  var ENZYME_VARIANT_SCALE = {
    pepsin: 1.28,
  };

  var MOL_SIZE_REF = {
    starch: "maltose",
    glycerol: "fatty-acid",
    sucrose: "glucose",
    fructose: "glucose",
    lactose: "glucose",
    galactose: "glucose",
  };

  var MOL_LABELS = {
    starch: "Starch",
    maltose: "Maltose",
    sucrose: "Sucrose",
    lactose: "Lactose",
    protein: "Protein",
    peptide: "Peptide",
    lipid: "Lipid",
    glycerol: "Glycerol",
    "fatty-acid": "Fatty acid",
    glucose: "Glucose",
    fructose: "Fructose",
    galactose: "Galactose",
  };

  var INLINE_MODEL_BOOST = 1.35;
  var INLINE_ENZYME_BOOST = 1.3;
  var glycDropCompact = 56;
  var glycDropFull = 88;
  var glycReleaseEasePow = 1.75;

  var LAYOUT_BASE = {
    enzX: 320,
    enzY: 168,
    activeSiteX: 320,
    activeSiteY: 198,
    subStartX: 538,
    subStartY: 252,
    prodSpread: 102,
    prodArc: 24,
    prodLift: -18,
    approachEnd: 0.42,
  };

  var VARIANT_ANIM = {
    pepsin: { approachEnd: 0.36, prodSpread: 112, prodArc: 18, prodLift: -14 },
    protease: { approachEnd: 0.4, prodSpread: 100, prodArc: 20, prodLift: -16 },
    "pancreatic-lipase": { approachEnd: 0.4, prodSpread: 114, prodArc: 16, prodLift: -12 },
  };

  var FULL_LAYOUT = Object.assign({}, LAYOUT_BASE);
  var INLINE_LAYOUT = Object.assign({}, LAYOUT_BASE, {
    enzX: 320,
    enzY: 146,
    activeSiteX: 320,
    activeSiteY: 166,
    subStartX: 320,
    subStartY: 44,
    prodSpread: 84,
    prodArc: 14,
    prodLift: -8,
  });
  var LAYOUT = FULL_LAYOUT;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function prog(stepIdx, localT) {
    return clamp(localT / STEPS[stepIdx].duration, 0, 1);
  }

  function buildLayout(base) {
    return Object.assign({}, base);
  }

  function layoutForVariant(variant, layout) {
    layout = layout || FULL_LAYOUT;
    var o = VARIANT_ANIM[variant];
    if (!o) return layout;
    return Object.assign({}, layout, {
      prodSpread: o.prodSpread != null ? o.prodSpread : layout.prodSpread,
      prodArc: o.prodArc != null ? o.prodArc : layout.prodArc,
      prodLift: o.prodLift != null ? o.prodLift : layout.prodLift,
      approachEnd: o.approachEnd != null ? o.approachEnd : layout.approachEnd,
    });
  }

  function lipidReleaseForVariant(variant) {
    return {
      angles: [-2.35, 0.15, 2.45],
      faRadius: variant === "pancreatic-lipase" ? 94 : 82,
      faYOffset: -18,
      glyYOffset: 78,
    };
  }

  function molLabelFor(type) {
    return MOL_LABELS[type] || type.replace(/-/g, " ").replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  function molSizeRatio(type) {
    var MB = global.MoleculeBallStick;
    var refType = MOL_SIZE_REF[type] || type;
    if (!MB || !MB.getModelFitScale) return 1;
    var typeFit = MB.getModelFitScale(type);
    var refFit = MB.getModelFitScale(refType);
    if (!typeFit || typeFit <= 0) return 1;
    return refFit / typeFit;
  }

  function molScale(type) {
    return MOL_BASE * MODEL_SIZE_FACTOR * SUBSTRATE_VS_ENZYME * molSizeRatio(type);
  }

  function molProductScale(substrateType, productType) {
    var MB = global.MoleculeBallStick;
    if (!MB || !MB.getModelFitScale) return molScale(productType);
    var subFit = MB.getModelFitScale(substrateType);
    var prodFit = MB.getModelFitScale(productType);
    if (!prodFit || prodFit <= 0) return molScale(substrateType);
    return molScale(substrateType) * (subFit / prodFit);
  }

  function phaseFromP(p) {
    if (p < 0.14) return { key: "intro", t: p / 0.14 };
    if (p < 0.34) return { key: "approach", t: (p - 0.14) / 0.2 };
    if (p < 0.52) return { key: "inducedFit", t: (p - 0.34) / 0.18 };
    if (p < 0.76) return { key: "cleave", t: (p - 0.52) / 0.24 };
    return { key: "release", t: (p - 0.76) / 0.24 };
  }

  function phaseLabel(phase) {
    for (var i = 0; i < PHASES.length; i++) {
      if (PHASES[i].key === phase.key) return PHASES[i].label;
    }
    return "";
  }

  function hideNamesForComplex(phase) {
    return (phase.key === "inducedFit" && phase.t > 0.52) || phase.key === "cleave";
  }

  function catalysisComplexLabel(phase) {
    if (phase.key === "inducedFit" && phase.t > 0.52) return true;
    if (phase.key === "cleave") return true;
    return false;
  }

  function enzymeDisplayScaleFor(variant) {
    return ENZYME_DISPLAY_SCALE * (ENZYME_VARIANT_SCALE[variant] || 1);
  }

  function substratePos(layout, dockT) {
    var t = easeInOut(clamp(dockT, 0, 1));
    return {
      x: lerp(layout.subStartX, layout.activeSiteX, t),
      y: lerp(layout.subStartY, layout.activeSiteY, t),
    };
  }

  function holeScreenPos(layout, substrateType, dockT) {
    dockT = dockT != null ? clamp(dockT, 0, 1) : 1;
    if (dockT <= 0) {
      return { x: layout.subStartX, y: layout.subStartY };
    }
    return substratePos(layout, dockT);
  }

  function glycerolReleasePos(dockX, dockY, releaseT, compact) {
    var raw = clamp(releaseT, 0, 1);
    var t = easeInOut(Math.pow(raw, glycReleaseEasePow));
    var drop = compact ? glycDropCompact : glycDropFull;
    return {
      x: dockX,
      y: lerp(dockY, dockY + drop, t),
    };
  }

  function computeFrame(phase, layout) {
    layout = layout || FULL_LAYOUT;
    var dockT = 0;
    var subOp = 0;
    var prodOp = 0;
    var releaseT = 0;
    var cleaveT = 0;
    var showEnzymeName = false;
    var showSubLabel = false;
    var showProdLabels = false;
    var showComplex = false;

    if (phase.key === "intro") {
      dockT = 0;
      subOp = 1;
      showEnzymeName = true;
      showSubLabel = true;
    } else if (phase.key === "approach") {
      if (phase.t < layout.approachEnd) {
        dockT = easeInOut(phase.t / layout.approachEnd) * 0.32;
        showEnzymeName = true;
        showSubLabel = true;
      } else {
        var dt = easeInOut((phase.t - layout.approachEnd) / (1 - layout.approachEnd));
        dockT = lerp(0.32, 1, dt);
        showEnzymeName = true;
        showSubLabel = true;
      }
      subOp = 1;
    } else if (phase.key === "inducedFit") {
      dockT = 1;
      subOp = 1;
      showComplex = catalysisComplexLabel(phase);
      showEnzymeName = !hideNamesForComplex(phase);
      showSubLabel = !hideNamesForComplex(phase);
    } else if (phase.key === "cleave") {
      dockT = 1;
      cleaveT = easeInOut(phase.t);
      subOp = 1 - cleaveT;
      prodOp = cleaveT;
      showComplex = catalysisComplexLabel(phase) && subOp > 0.45;
      showEnzymeName = !hideNamesForComplex(phase);
      showSubLabel = !hideNamesForComplex(phase) && subOp > 0.01;
    } else {
      dockT = 1;
      releaseT = easeOut(phase.t);
      prodOp = 1;
      showProdLabels = phase.t > 0.2;
    }

    return {
      dockT: dockT,
      subOp: subOp,
      prodOp: prodOp,
      releaseT: releaseT,
      cleaveT: cleaveT,
      showComplex: showComplex,
      showEnzymeName: showEnzymeName,
      showSubLabel: showSubLabel,
      showProdLabels: showProdLabels,
    };
  }

  function mol(type, cx, cy, opts) {
    var MB = global.MoleculeBallStick;
    if (!MB || !MB.renderMoleculeEmbed) return "";
    opts = opts || {};
    var labelText = false;
    if (opts.label !== false) {
      labelText = opts.label === true || opts.label == null ? molLabelFor(type) : opts.label;
    }
    return MB.renderMoleculeEmbed(type, cx, cy, {
      embedScale: molScale(type) * (opts.sizeScale != null ? opts.sizeScale : 1) * (opts.modelBoost || 1),
      opacity: opts.opacity,
      label: labelText,
      labelDy: opts.labelDy != null ? opts.labelDy : (opts.compact ? 40 : 34),
      labelSize: opts.labelSize != null ? opts.labelSize : (opts.compact ? 10.5 : 7.5),
      labelColor: C.text,
      labelOpacity: opts.labelOpacity != null ? opts.labelOpacity : opts.opacity,
    });
  }

  function molProduct(productType, substrateType, cx, cy, layout, opts) {
    opts = opts || {};
    return mol(productType, cx, cy, {
      sizeScale: molProductScale(substrateType, productType) / molScale(productType),
      opacity: opts.opacity,
      label: opts.label,
      labelDy: opts.labelDy != null ? opts.labelDy : (opts.compact ? 40 : 34),
      labelSize: opts.labelSize != null ? opts.labelSize : (opts.compact ? 10.5 : 8),
      labelOpacity: opts.opacity,
      modelBoost: opts.modelBoost,
      compact: opts.compact,
    });
  }

  function substrateHtml(type, layout, frame, variant, renderOpts) {
    renderOpts = renderOpts || {};
    if (frame.subOp <= 0.01) return "";
    var pos = holeScreenPos(layout, type, frame.dockT);
    var label = frame.showSubLabel ? molLabelFor(type) : false;
    return mol(type, pos.x, pos.y, {
      opacity: frame.subOp,
      label: label,
      modelBoost: renderOpts.modelBoost,
      compact: renderOpts.compact,
    });
  }

  function productPairHtml(cfg, frame, layout, variant, renderOpts) {
    renderOpts = renderOpts || {};
    var html = "";
    var rp = frame.releaseT;
    var dist = rp * layout.prodSpread;
    var arc = rp * layout.prodArc;
    var lift = lerp(0, layout.prodLift, frame.releaseT);
    var hole = holeScreenPos(layout, cfg.substrate, 1);
    var dockY = hole.y;
    var dockX = hole.x;
    var pop = frame.prodOp;
    var left = cfg.products[0];
    var right = cfg.products[1];
    var lx = dockX - dist - rp * 4;
    var rx = dockX + dist + rp * 4;
    var ly = dockY - arc + lift;
    var ry = ly;
    html += molProduct(left, cfg.substrate, lx, ly, layout, {
      opacity: pop,
      label: frame.showProdLabels ? molLabelFor(left) : false,
      modelBoost: renderOpts.modelBoost,
      compact: renderOpts.compact,
    });
    html += molProduct(right, cfg.substrate, rx, ry, layout, {
      opacity: pop,
      label: frame.showProdLabels ? molLabelFor(right) : false,
      modelBoost: renderOpts.modelBoost,
      compact: renderOpts.compact,
    });
    return html;
  }

  function lipidProductsHtml(frame, layout, substrateType, variant, opts) {
    opts = opts || {};
    var html = "";
    var rp = easeInOut(frame.releaseT);
    var hole = holeScreenPos(layout, substrateType || "lipid", 1);
    var dockY = hole.y;
    var dockX = hole.x;
    var pop = frame.prodOp;
    var rel = lipidReleaseForVariant(variant);
    var i;
    for (i = 0; i < 3; i++) {
      var fop = clamp(pop - i * 0.08, 0, 1);
      var r = rp * rel.faRadius;
      var px = dockX + Math.cos(rel.angles[i]) * r;
      var py = dockY + rel.faYOffset + Math.sin(rel.angles[i]) * r * 0.28;
      html += molProduct("fatty-acid", substrateType || "lipid", px, py, layout, {
        opacity: fop,
        label: frame.showProdLabels ? molLabelFor("fatty-acid") : false,
        modelBoost: opts.modelBoost,
        compact: opts.compact,
      });
    }
    var glyPos = glycerolReleasePos(dockX, dockY, frame.releaseT, opts.compact);
    html += molProduct("glycerol", substrateType || "lipid", glyPos.x, glyPos.y, layout, {
      opacity: pop,
      label: frame.showProdLabels ? molLabelFor("glycerol") : false,
      modelBoost: opts.modelBoost,
      compact: opts.compact,
    });
    return html;
  }

  function renderStarchMaltose(step, phase, layout, frame, opts) {
    opts = opts || {};
    var cfg = VISUALS["starch-maltose"];
    var html = substrateHtml(cfg.substrate, layout, frame, step.proteinVariant, opts);
    if (frame.prodOp > 0.01) html += productPairHtml(cfg, frame, layout, step.proteinVariant, opts);
    return html;
  }

  function renderProteinPeptide(step, phase, layout, frame, opts) {
    opts = opts || {};
    var cfg = VISUALS["protein-peptide"];
    var html = substrateHtml(cfg.substrate, layout, frame, step.proteinVariant, opts);
    if (frame.prodOp > 0.01) html += productPairHtml(cfg, frame, layout, step.proteinVariant, opts);
    return html;
  }

  function renderLipidSplit(step, phase, layout, frame, opts) {
    opts = opts || {};
    var cfg = VISUALS["lipid-split"];
    var html = substrateHtml(cfg.substrate, layout, frame, step.proteinVariant, opts);
    if (frame.prodOp > 0.01) html += lipidProductsHtml(frame, layout, cfg.substrate, step.proteinVariant, opts);
    return html;
  }

  function renderPeptideSmaller(step, phase, layout, frame, opts) {
    opts = opts || {};
    var cfg = VISUALS["peptide-smaller"];
    var html = substrateHtml(cfg.substrate, layout, frame, step.proteinVariant, opts);
    if (frame.prodOp > 0.01) html += productPairHtml(cfg, frame, layout, step.proteinVariant, opts);
    return html;
  }

  function renderMaltoseGlucose(step, phase, layout, frame, opts) {
    opts = opts || {};
    var cfg = VISUALS["maltose-glucose"];
    var html = substrateHtml(cfg.substrate, layout, frame, step.proteinVariant, opts);
    if (frame.prodOp > 0.01) html += productPairHtml(cfg, frame, layout, step.proteinVariant, opts);
    return html;
  }

  function renderSucroseSplit(step, phase, layout, frame, opts) {
    opts = opts || {};
    var cfg = VISUALS["sucrose-split"];
    var html = substrateHtml(cfg.substrate, layout, frame, step.proteinVariant, opts);
    if (frame.prodOp > 0.01) html += productPairHtml(cfg, frame, layout, step.proteinVariant, opts);
    return html;
  }

  function renderLactoseSplit(step, phase, layout, frame, opts) {
    opts = opts || {};
    var cfg = VISUALS["lactose-split"];
    var html = substrateHtml(cfg.substrate, layout, frame, step.proteinVariant, opts);
    if (frame.prodOp > 0.01) html += productPairHtml(cfg, frame, layout, step.proteinVariant, opts);
    return html;
  }

  var RENDERERS = {
    "starch-maltose": renderStarchMaltose,
    "protein-peptide": renderProteinPeptide,
    "lipid-split": renderLipidSplit,
    "peptide-smaller": renderPeptideSmaller,
    "maltose-glucose": renderMaltoseGlucose,
    "sucrose-split": renderSucroseSplit,
    "lactose-split": renderLactoseSplit,
  };

  function renderReaction(step, phase, layout, opts) {
    layout = layout || FULL_LAYOUT;
    opts = opts || {};
    var cfg = VISUALS[step.visual];
    if (!cfg) return "";
    var variant = step.proteinVariant || "default";
    var activeLayout = layoutForVariant(variant, layout);
    var frame = computeFrame(phase, activeLayout);
    var html = "";
    var enzymeLabelY = opts.compact ? 48 : 132;
    var noteY = opts.compact ? 302 : 368;
    var holeCenter = holeScreenPos(activeLayout, cfg.substrate, 1);

    var renderFn = RENDERERS[step.visual];
    if (renderFn) {
      html += renderFn(step, phase, activeLayout, frame, opts);
    }

    if (!opts.compact && frame.showEnzymeName) {
      html +=
        '<text x="' + activeLayout.enzX + '" y="' + enzymeLabelY +
        '" text-anchor="middle" font-size="10" font-weight="700" fill="' +
        C.highlight + '">' + step.enzyme + "</text>";
    }

    if (frame.showComplex) {
      html +=
        '<text x="' + holeCenter.x.toFixed(1) + '" y="' + (holeCenter.y - 28).toFixed(1) +
        '" text-anchor="middle" font-size="' + (opts.compact ? "10.5" : "9") +
        '" font-weight="600" fill="' +
        C.highlight + '">enzyme–substrate complex</text>';
    }

    if (!opts.compact && (phase.key === "cleave" || phase.key === "release")) {
      html +=
        '<text x="' + activeLayout.enzX + '" y="' + noteY +
        '" text-anchor="middle" font-size="8" fill="' + C.muted + '">' + cfg.note + "</text>";
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
    this.enzymeAnim = null;
    this._enzymeVariant = null;

    root.innerHTML =
      '<div class="dig-scene">' +
      '<div class="dig-enzyme-3d-slot" data-id="enzyme-3d"></div>' +
      '<svg class="dig-reaction-layer" viewBox="0 0 ' + SCENE.w + " " + SCENE.h +
      '" role="img" aria-label="Digestive enzyme breakdown animation (3D models)">' +
      '<g data-id="tract"></g>' +
      '<rect x="20" y="48" width="600" height="28" rx="8" fill="#f2f6fa" stroke="#d8dee9"/>' +
      '<text data-id="phase-label" x="320" y="66" text-anchor="middle" font-size="10" font-weight="600" fill="' +
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
    this.enzymeSlot = root.querySelector('[data-id="enzyme-3d"]');

    this._drawBadges();
    this._mountEnzyme(STEPS[0].proteinVariant || "default");
    this._tick = this._tick.bind(this);
    this._applyFrame();
    this._emitStep();
    this.raf = requestAnimationFrame(this._tick);
  }

  DigestionEnzymesAnimation.prototype._mountEnzyme = function (variant) {
    if (!this.enzymeSlot || !global.EnzymeConditionAnimation) return;
    if (this.enzymeAnim) {
      this.enzymeAnim.destroy();
      this.enzymeAnim = null;
    }
    var PRC = global.ProteinRenderConstants || {};
    this.enzymeAnim = new global.EnzymeConditionAnimation(this.enzymeSlot, {
      variant: variant || "default",
      showLabels: false,
      fixedBeadR: PRC.optBeadR,
      fixedLinkW: PRC.optLinkW,
    });
    this._enzymeVariant = variant;
  };

  DigestionEnzymesAnimation.prototype._updateEnzymeOverlay = function (step, phase) {
    var variant = step.proteinVariant || "default";
    if (this._enzymeVariant !== variant) {
      this._mountEnzyme(variant);
    }
    if (!this.enzymeSlot) return;
    var scale = enzymeDisplayScaleFor(variant);
    this.enzymeSlot.style.transform = "translate(-50%, -50%) scale(" + scale.toFixed(3) + ")";
  };

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

    this._updateEnzymeOverlay(step, phase);
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

  DigestionEnzymesAnimation.prototype.pause = function () {
    this.playing = false;
  };
  DigestionEnzymesAnimation.prototype.play = function () {
    this.playing = true;
    this.lastTs = 0;
  };
  DigestionEnzymesAnimation.prototype.toggle = function () {
    this.playing = !this.playing;
    if (this.playing) this.lastTs = 0;
  };
  DigestionEnzymesAnimation.prototype.goToStep = function (index, resetLocal) {
    this.stepIndex = clamp(index, 0, STEPS.length - 1);
    if (resetLocal) this.localT = 0;
    this._emitStep();
    this._applyFrame();
  };
  DigestionEnzymesAnimation.prototype.prev = function () {
    if (this.stepIndex > 0) {
      this.stepIndex -= 1;
      this.localT = 0;
      this._emitStep();
    }
  };
  DigestionEnzymesAnimation.prototype.next = function () {
    if (this.stepIndex < STEPS.length - 1) {
      this.stepIndex += 1;
      this.localT = 0;
      this._emitStep();
    }
  };
  DigestionEnzymesAnimation.prototype.restart = function () {
    this.stepIndex = 0;
    this.localT = 0;
    this.playing = true;
    this.lastTs = 0;
    this._emitStep();
  };
  DigestionEnzymesAnimation.prototype.destroy = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    if (this.enzymeAnim) {
      this.enzymeAnim.destroy();
      this.enzymeAnim = null;
    }
    if (this.root) this.root.innerHTML = "";
  };

  function EnzymeReactionInlineAnimation(root, enzymeId, hooks) {
    if (!root) throw new Error("EnzymeReactionInlineAnimation: missing root element");
    this.root = root;
    this.hooks = hooks || {};
    this.step = findStepByEnzymeId(enzymeId);
    this.layout = INLINE_LAYOUT;
    this.localT = 0;
    this.playing = true;
    this.loop = this.hooks.loop !== false;
    this.lastTs = 0;
    this.raf = null;
    this.enzymeAnim = null;
    this._enzymeVariant = null;
    this.modelBoost = this.hooks.modelBoost != null ? this.hooks.modelBoost : INLINE_MODEL_BOOST;
    this.enzymeBoost = this.hooks.enzymeBoost != null ? this.hooks.enzymeBoost : INLINE_ENZYME_BOOST;

    root.innerHTML =
      '<div class="dig-scene ef-inline-scene">' +
      '<div class="dig-enzyme-3d-slot" data-id="enzyme-3d"></div>' +
      '<svg class="dig-reaction-layer" viewBox="0 0 ' + INLINE_SCENE.w + " " + INLINE_SCENE.h +
      '" role="img" aria-label="' + this.step.enzyme + ' breakdown animation (3D)">' +
      '<text class="ef-phase-label" data-id="phase-label" x="' + (INLINE_SCENE.w / 2) +
      '" y="26" text-anchor="middle" font-size="12" font-weight="600" fill="' + C.highlight + '"></text>' +
      '<g data-id="reaction"></g>' +
      "</svg></div>";

    this.elPhase = root.querySelector('[data-id="phase-label"]');
    this.gReaction = root.querySelector('[data-id="reaction"]');
    this.enzymeSlot = root.querySelector('[data-id="enzyme-3d"]');

    this._mountEnzyme = DigestionEnzymesAnimation.prototype._mountEnzyme;
    this._mountEnzyme(this.step.proteinVariant || "default");

    this._tick = this._tick.bind(this);
    this._applyFrame();
    this.raf = requestAnimationFrame(this._tick);
  }

  EnzymeReactionInlineAnimation.prototype._updateEnzymeOverlay = function (step, phase) {
    var variant = step.proteinVariant || "default";
    if (this._enzymeVariant !== variant) {
      this._mountEnzyme(variant);
    }
    if (!this.enzymeSlot) return;
    var scale = enzymeDisplayScaleFor(variant) * this.enzymeBoost;
    this.enzymeSlot.style.transform = "translate(-50%, -50%) scale(" + scale.toFixed(3) + ")";
  };

  EnzymeReactionInlineAnimation.prototype._applyFrame = function () {
    var p = progForStep(this.step, this.localT);
    var phase = phaseFromP(p);
    this._updateEnzymeOverlay(this.step, phase);
    if (this.elPhase) this.elPhase.textContent = phaseLabel(phase);
    if (this.gReaction) {
      this.gReaction.innerHTML = renderReaction(this.step, phase, this.layout, {
        compact: true,
        modelBoost: this.modelBoost,
      });
    }
  };

  EnzymeReactionInlineAnimation.prototype._tick = function (ts) {
    if (!this.lastTs) this.lastTs = ts;
    var dt = ts - this.lastTs;
    this.lastTs = ts;

    if (this.playing) {
      this.localT += dt;
      if (this.localT >= this.step.duration) {
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

  EnzymeReactionInlineAnimation.prototype.pause = function () {
    this.playing = false;
  };
  EnzymeReactionInlineAnimation.prototype.play = function () {
    this.playing = true;
    this.lastTs = 0;
  };
  EnzymeReactionInlineAnimation.prototype.restart = function () {
    this.localT = 0;
    this.playing = true;
    this.lastTs = 0;
    this._applyFrame();
  };
  EnzymeReactionInlineAnimation.prototype.destroy = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    if (this.enzymeAnim) {
      this.enzymeAnim.destroy();
      this.enzymeAnim = null;
    }
    if (this.root) this.root.innerHTML = "";
  };

  global.DIGESTION_ENZYME_STEPS = STEPS;
  global.DigestionEnzymesAnimation = DigestionEnzymesAnimation;
  global.EnzymeReactionInlineAnimation3d = EnzymeReactionInlineAnimation;
  global.findDigestionStepByEnzymeId = findStepByEnzymeId;
})(typeof window !== "undefined" ? window : globalThis);
