/**
 * Flat 2D schematic molecule shapes for digestion animations.
 * Terminology: the concave part on the enzyme is called the "hole".
 */
(function (global) {
  "use strict";

  var W = 100;
  var H = 60;
  var CX = 50;
  var CY = 30;

  var DEFAULT_COLORS = {
    starch: "#f5e6a8",
    maltose: "#f5e6a8",
    sucrose: "#f0d4a8",
    lactose: "#b8e6d8",
    protein: "#c8b8e8",
    peptide: "#b8d4f0",
    lipid: "#f5e6a8",
    glycerol: "#aad4f5",
    "fatty-acid": "#f5e6a8",
    glucose: "#f5e6a8",
    fructose: "#f5bcd0",
    galactose: "#98dede",
    bond: "#333333",
    edge: "#555555",
  };

  function hexPath(cx, cy, r, rot) {
    rot = rot || 0;
    var pts = [];
    var i;
    for (i = 0; i < 6; i++) {
      var a = rot + (Math.PI / 3) * i - Math.PI / 6;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1));
    }
    return "M " + pts.join(" L ") + " Z";
  }

  function bond(x1, y1, x2, y2, col) {
    return (
      '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="' + col + '" stroke-width="2.2" stroke-linecap="round"/>'
    );
  }

  function filled(path, fill, edge) {
    return '<path d="' + path + '" fill="' + fill + '" stroke="' + edge + '" stroke-width="1.2" stroke-linejoin="round"/>';
  }

  function node(cx, cy, r, fill, edge) {
    return (
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r +
      '" fill="' + fill + '" stroke="' + edge + '" stroke-width="1"/>'
    );
  }

  var BUILDERS = {
    glucose: function (c) {
      return filled(hexPath(50, 30, 14), c.glucose, c.edge);
    },
    fructose: function (c) {
      return filled(hexPath(50, 30, 14), c.fructose, c.edge);
    },
    galactose: function (c) {
      return filled(hexPath(50, 30, 14), c.galactose, c.edge);
    },
    maltose: function (c) {
      return (
        filled(hexPath(34, 30, 12), c.glucose, c.edge) +
        bond(46, 30, 54, 30, c.bond) +
        filled(hexPath(66, 30, 12), c.glucose, c.edge)
      );
    },
    sucrose: function (c) {
      return (
        filled(hexPath(34, 30, 12), c.glucose, c.edge) +
        bond(46, 30, 54, 30, c.bond) +
        filled(hexPath(66, 30, 12), c.fructose, c.edge)
      );
    },
    lactose: function (c) {
      return (
        filled(hexPath(34, 30, 12), c.glucose, c.edge) +
        bond(46, 30, 54, 30, c.bond) +
        filled(hexPath(66, 30, 12), c.galactose, c.edge)
      );
    },
    starch: function (c) {
      var html = "";
      var xs = [14, 30, 46, 62, 78];
      var i;
      for (i = 0; i < xs.length; i++) {
        html += filled(hexPath(xs[i], 34, 9), c.starch, c.edge);
        if (i > 0) html += bond(xs[i - 1] + 9, 34, xs[i] - 9, 34, c.bond);
      }
      html += bond(46, 25, 46, 18, c.bond);
      html += filled(hexPath(46, 12, 8), c.starch, c.edge);
      return html;
    },
    protein: function (c) {
      return (
        '<path d="M 6 34 C 14 18 26 40 38 24 S 62 40 74 22 S 90 36 94 28" fill="none" stroke="' +
        c.protein + '" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M 6 34 C 14 18 26 40 38 24 S 62 40 74 22 S 90 36 94 28" fill="none" stroke="' +
        c.edge + '" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>'
      );
    },
    peptide: function (c) {
      return (
        '<path d="M 12 32 C 24 20 36 38 48 26 S 72 36 88 30" fill="none" stroke="' +
        c.peptide + '" stroke-width="5.5" stroke-linecap="round"/>' +
        '<path d="M 12 32 C 24 20 36 38 48 26 S 72 36 88 30" fill="none" stroke="' +
        c.edge + '" stroke-width="1" stroke-linecap="round" opacity="0.45"/>'
      );
    },
    glycerol: function (c) {
      return (
        node(50, 18, 7, c.glycerol, c.edge) +
        bond(50, 25, 36, 38, c.bond) +
        bond(50, 25, 64, 38, c.bond) +
        bond(36, 38, 64, 38, c.bond) +
        node(36, 38, 6, c.glycerol, c.edge) +
        node(64, 38, 6, c.glycerol, c.edge)
      );
    },
    "fatty-acid": function (c) {
      var html = "";
      var pts = [
        [10, 34], [22, 26], [34, 36], [46, 24], [58, 34], [70, 26], [82, 32], [92, 28],
      ];
      var i;
      for (i = 0; i < pts.length; i++) {
        html += node(pts[i][0], pts[i][1], 4.5, c["fatty-acid"], c.edge);
        if (i > 0) html += bond(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], c.bond);
      }
      return html;
    },
    lipid: function (c) {
      var html = BUILDERS.glycerol(c);
      var tails = [
        { x: 36, y: 38, ang: -2.4 },
        { x: 64, y: 38, ang: -0.7 },
        { x: 50, y: 18, ang: 1.5 },
      ];
      tails.forEach(function (tail) {
        var px = tail.x;
        var py = tail.y;
        var i;
        for (i = 1; i <= 4; i++) {
          var nx = px + Math.cos(tail.ang) * i * 11;
          var ny = py + Math.sin(tail.ang) * i * 7;
          html += bond(px, py, nx, ny, c.bond);
          html += node(nx, ny, 3.5, c.lipid, c.edge);
          px = nx;
          py = ny;
        }
      });
      return html;
    },
  };

  var PREVIEW_W = 520;
  var PREVIEW_H = 280;
  var PREVIEW_CX = 260;
  var PREVIEW_CY = 140;

  var FLAT_MOLECULE_TYPES = [
    { id: "starch", label: "Starch" },
    { id: "maltose", label: "Maltose" },
    { id: "sucrose", label: "Sucrose" },
    { id: "lactose", label: "Lactose" },
    { id: "protein", label: "Protein" },
    { id: "peptide", label: "Peptide" },
    { id: "lipid", label: "Lipid" },
    { id: "glycerol", label: "Glycerol" },
    { id: "fatty-acid", label: "Fatty acid" },
    { id: "glucose", label: "Glucose" },
    { id: "fructose", label: "Fructose" },
    { id: "galactose", label: "Galactose" },
  ];

  var ENZYME_TYPES = [
    { id: "default", label: "Salivary amylase", equation: "Starch → Maltose", location: "Mouth" },
    { id: "pepsin", label: "Pepsin", equation: "Proteins → Peptides", location: "Stomach" },
    { id: "pancreatic-amylase", label: "Pancreatic amylase", equation: "Starch → Maltose", location: "Small intestine" },
    { id: "pancreatic-lipase", label: "Pancreatic lipase", equation: "Lipids → Fatty acids + Glycerol", location: "Small intestine" },
    { id: "protease", label: "Protease", equation: "Peptides → Smaller peptides", location: "Small intestine" },
    { id: "maltase", label: "Maltase", equation: "Maltose → Glucose + Glucose", location: "Brush border" },
    { id: "sucrase", label: "Sucrase", equation: "Sucrose → Glucose + Fructose", location: "Brush border" },
    { id: "lactase", label: "Lactase", equation: "Lactose → Glucose + Galactose", location: "Brush border" },
  ];

  var HOLE_COLOR = "#f5d565";
  var HOLE_EDGE = "#c9a227";
  /** Active-site fill opacity — fixed at every animation step (never fade/hide). */
  var ACTIVE_SITE_OPACITY = 1;
  /** Disaccharidase V-slots — slightly translucent so docked substrate shows inside yellow. */
  var DISACCHARIDASE_HOLE_OPACITY = 0.72;
  var ENZYME_ANCHOR_X = 76;
  var ENZYME_ANCHOR_Y = 48;
  var AMYLASE_ANCHOR_X = 68;
  var AMYLASE_ANCHOR_Y = 46;
  var PANCREATIC_LIPASE_ANCHOR_X = 200;
  var PANCREATIC_LIPASE_ANCHOR_Y = 40;
  var PEPSIN_PROTEASE_ANCHOR_X = 80;
  var PEPSIN_PROTEASE_ANCHOR_Y = 40;
  /** Red oval + central yellow slot (pepsin & protease share this flat model). */
  var PEPSIN_PROTEASE_VIEW = { w: 160, h: 80 };
  var PEPSIN_PROTEASE_BODY = { cx: 80, cy: 40, rx: 72, ry: 28 };
  var PEPSIN_PROTEASE_SLOT =
    "M 48 42 Q 56 32 80 32 Q 104 32 112 42 Q 104 48 80 48 Q 56 48 48 42 Z";
  var ENZYME_PREVIEW_SCALE = 2.15;
  var MOL_PREVIEW_SCALE = 2.8;
  var HOLE_CX = 70;
  var HOLE_CY = 56;

  var DISACCHARIDASE_VARIANTS = { maltase: true, sucrase: true, lactase: true };

  /** Variants that render from pasted image/SVG assets — never redraw programmatically. */
  var FROZEN_ASSET_VARIANTS = {
    default: true,
    "pancreatic-amylase": true,
    "pancreatic-lipase": true,
    maltase: true,
    sucrase: true,
    lactase: true,
  };

  /** Exact amylase SVG asset — pasted from user image (not hand-traced at render time). */
  var AMYLASE_IMAGE = {
    href: "./assets/enzymes/amylase-enzyme-flat.svg",
    w: 136,
    h: 98,
    x: 0,
    y: 0,
    anchorX: AMYLASE_ANCHOR_X,
    anchorY: AMYLASE_ANCHOR_Y,
  };

  /** Exact pancreatic lipase SVG asset — rectangular block + dual semicircular top cutouts. */
  var PANCREATIC_LIPASE_IMAGE = {
    href: "./assets/enzymes/pancreatic-lipase-enzyme-flat.svg",
    w: 400,
    h: 80,
    x: 0,
    y: 0,
    anchorX: PANCREATIC_LIPASE_ANCHOR_X,
    anchorY: PANCREATIC_LIPASE_ANCHOR_Y,
  };

  /** Standalone flat 2D enzyme SVG assets (see scripts/export-enzyme-flat-svgs.js) */
  var ENZYME_FLAT_ASSETS = {
    default: "./assets/enzymes/salivary-amylase-enzyme-flat.svg",
    pepsin: "./assets/enzymes/pepsin-enzyme-flat.svg",
    "pancreatic-amylase": "./assets/enzymes/pancreatic-amylase-enzyme-flat.svg",
    "pancreatic-lipase": "./assets/enzymes/pancreatic-lipase-enzyme-flat.svg",
    protease: "./assets/enzymes/protease-enzyme-flat.svg",
    maltase: "./assets/enzymes/disaccharidase-enzyme.svg",
    sucrase: "./assets/enzymes/disaccharidase-enzyme.svg",
    lactase: "./assets/enzymes/disaccharidase-enzyme.svg",
  };

  /** Red block + exactly two yellow triangles (maltase, sucrase, lactase). */
  var DISACCHARIDASE_VIEW = { w: 152, h: 84 };
  var DISACCHARIDASE_BODY =
    "M 6 78 L 6 32 L 22 32 L 34 48 L 46 32 L 54 32 L 66 48 L 78 32 L 146 32 L 146 78 Z";
  var DISACCHARIDASE_LEFT_V = "M 22 32 L 34 48 L 46 32 Z";
  var DISACCHARIDASE_RIGHT_V = "M 54 32 L 66 48 L 78 32 Z";

  /** Exact disaccharidase asset — red block with dual V slots on the top edge. */
  var DISACCHARIDASE_IMAGE = {
    href: "./assets/enzymes/disaccharidase-enzyme.svg",
    w: DISACCHARIDASE_VIEW.w,
    h: DISACCHARIDASE_VIEW.h,
    x: 0,
    y: 0,
    anchorX: 76,
    anchorY: 55,
  };

  var DISACCHARIDE_MONOMERS = {
    maltose: { left: "glucose", right: "glucose" },
    sucrose: { left: "glucose", right: "fructose" },
    lactose: { left: "glucose", right: "galactose" },
  };

  /** Each digestive enzyme variant → substrate whose shape defines the hole */
  var VARIANT_SUBSTRATE = {
    default: "starch",
    pepsin: "protein",
    "pancreatic-amylase": "starch",
    "pancreatic-lipase": "lipid",
    protease: "peptide",
    maltase: "maltose",
    sucrase: "sucrose",
    lactase: "lactose",
  };

  /**
   * Inverse substrate silhouettes in enzyme-local coords (hole in top cleft ~y 42–58).
   */
  var SUBSTRATE_HOLE_CUTOUTS = {
    maltose:
      "M 46 58 C 48 46 52 43 58 46 C 62 43 66 46 70 58 C 74 46 78 43 84 46 C 88 43 92 46 94 58 Z",
    sucrose:
      "M 46 58 C 48 46 52 43 58 46 C 62 43 66 46 70 58 C 74 46 78 43 84 46 C 88 43 92 46 94 58 Z",
    lactose:
      "M 46 58 C 48 46 52 43 58 46 C 62 43 66 46 70 58 C 74 46 78 43 84 46 C 88 43 92 46 94 58 Z",
    starch:
      "M 40 58 L 43 50 L 48 47 L 52 51 L 56 47 L 60 49 L 64 47 L 68 51 L 72 47 L 76 49 L 80 47 L 84 51 L 88 49 L 92 47 L 96 58 Z",
    protein:
      "M 42 58 C 48 46 54 50 60 46 C 66 42 74 46 C 80 50 86 46 C 92 42 98 58 Z",
    peptide:
      "M 48 58 Q 58 46 70 42 Q 82 46 92 58 Z",
    lipid:
      "M 50 58 L 58 46 L 70 40 L 82 46 L 90 58 L 70 52 Z",
    glucose:
      "M 54 58 Q 70 42 86 58 Z",
    fructose:
      "M 54 58 Q 70 42 86 58 Z",
    galactose:
      "M 54 58 Q 70 42 86 58 Z",
    glycerol:
      "M 56 58 L 62 46 L 70 40 L 78 46 L 84 58 Z",
    "fatty-acid":
      "M 44 58 Q 54 46 62 50 Q 70 42 78 50 Q 86 46 96 58 Z",
  };

  /** Pancreatic lipase only — glycerol-shaped yellow active site (same shape/size as glycerol model). */
  var PANCREATIC_LIPASE_GLYCEROL_SITE = { cx: 76, cy: 38, scale: 1 };
  var LIPASE_INLINE_MODEL_BOOST = 1.28;
  var PANCREATIC_LIPASE_SLOT = {
    bounds: { minX: 55, maxX: 97, minY: 19, maxY: 52 },
  };

  function usesDigestionFig43Layout(variant) {
    return !!(
      global.ENZYME_SHAPES &&
      global.ENZYME_SHAPES.enzymeDigestion &&
      variant === "pancreatic-lipase"
    );
  }

  function substrateForVariant(variant) {
    return VARIANT_SUBSTRATE[variant] || "starch";
  }

  function isDisaccharidaseVariant(variant) {
    return !!DISACCHARIDASE_VARIANTS[variant];
  }

  function isFrozenAssetVariant(variant) {
    return !!FROZEN_ASSET_VARIANTS[variant];
  }

  /** Source file for pasted-image enzymes (preview copy/paste UI). */
  function pastedAssetForVariant(variant) {
    if (isAmylaseVariant(variant)) {
      return {
        href: AMYLASE_IMAGE.href,
        file: "amylase-enzyme-flat.svg",
        mime: "image/svg+xml",
        kind: "svg",
      };
    }
    if (isDisaccharidaseVariant(variant)) {
      return {
        href: DISACCHARIDASE_IMAGE.href,
        file: "disaccharidase-enzyme.png",
        mime: "image/png",
        kind: "png",
      };
    }
    if (isPancreaticLipaseVariant(variant)) {
      return {
        href: PANCREATIC_LIPASE_IMAGE.href,
        file: "pancreatic-lipase-enzyme-flat.svg",
        mime: "image/svg+xml",
        kind: "svg",
      };
    }
    return null;
  }

  function renderRasterAssetScene(asset, options) {
    options = options || {};
    var op = options.imageOpacity != null ? options.imageOpacity : 1;
    var href = options.imageHref || asset.href;
    return (
      '<image href="' + href + '" xlink:href="' + href + '" x="' + asset.x + '" y="' + asset.y +
      '" width="' + asset.w + '" height="' + asset.h +
      '" preserveAspectRatio="xMidYMid meet" opacity="' + op.toFixed(2) + '"/>'
    );
  }

  function renderAmylaseAssetScene(options) {
    return renderRasterAssetScene(AMYLASE_IMAGE, options);
  }

  function enzymePathForVariant(variant) {
    var shapes = global.ENZYME_SHAPES || {};
    if (isFrozenAssetVariant(variant) || isDisaccharidaseVariant(variant) || isPancreaticLipaseVariant(variant) || isPepsinProteaseVariant(variant)) {
      return null;
    }
    return shapes.enzyme ||
      "M 8 72 L 132 72 C 150 72 156 44 144 24 L 108 24 L 76 24 L 76 36 A 10 10 0 0 0 56 36 L 56 24 L 36 24 L 30 36 L 24 24 L 12 24 C 0 44 -2 72 8 72 Z";
  }

  function monomersForSubstrate(substrateId) {
    return DISACCHARIDE_MONOMERS[substrateId] || { left: "glucose", right: "glucose" };
  }

  function disaccharidaseAnchor() {
    return {
      x: DISACCHARIDASE_IMAGE.anchorX,
      y: DISACCHARIDASE_IMAGE.anchorY,
    };
  }

  function renderDisaccharidaseScene(options, variant) {
    options = options || {};
    return buildDisaccharidaseFlatScene(
      Object.assign({}, options.colors || DEFAULT_COLORS, {
        hole: options.hole || HOLE_COLOR,
        holeEdge: options.holeEdge || HOLE_EDGE,
      }),
      {
        holeOpacity: options.holeOpacity,
        showFitPreview: false,
      },
      variant
    );
  }

  function holeCutoutForSubstrate(substrateId) {
    return SUBSTRATE_HOLE_CUTOUTS[substrateId] || SUBSTRATE_HOLE_CUTOUTS.maltose;
  }

  /** Per-variant hole silhouettes (pre-rotated / sized — no SVG transform mismatch). */
  var VARIANT_HOLE_CUTOUTS = {};

  var VARIANT_HOLE_BOUNDS = {
    default: { minX: 12, maxX: 124, minY: 10, maxY: 46 },
    "pancreatic-amylase": { minX: 12, maxX: 124, minY: 10, maxY: 46 },
    pepsin: { minX: 52, maxX: 108, minY: 26, maxY: 44 },
    protease: { minX: 52, maxX: 108, minY: 26, maxY: 44 },
    "pancreatic-lipase": PANCREATIC_LIPASE_SLOT.bounds,
    maltase: { minX: 22, maxX: 78, minY: 32, maxY: 48 },
    sucrase: { minX: 22, maxX: 78, minY: 32, maxY: 48 },
    lactase: { minX: 22, maxX: 78, minY: 32, maxY: 48 },
  };

  function holeCutoutForVariant(variant) {
    if (VARIANT_HOLE_CUTOUTS[variant]) return VARIANT_HOLE_CUTOUTS[variant];
    return holeCutoutForSubstrate(substrateForVariant(variant));
  }

  /** Per-enzyme-variant active site transform (legacy variants only). */
  var VARIANT_HOLE_OVERRIDES = {};

  function holeOverrideForVariant(variant) {
    return VARIANT_HOLE_OVERRIDES[variant] || null;
  }

  function holeTransformAttr(variant) {
    var o = holeOverrideForVariant(variant);
    if (!o) return "";
    var cx = o.cx != null ? o.cx : 70;
    var cy = o.cy != null ? o.cy : 50;
    var hasRot = o.rotate != null && o.rotate !== 0;
    var hasScale = o.scale != null && o.scale !== 1;
    if (!hasRot && !hasScale) return "";
    var parts = ["translate(" + cx + "," + cy + ")"];
    if (hasRot) parts.push("rotate(" + o.rotate + ")");
    if (hasScale) parts.push("scale(" + o.scale + ")");
    parts.push("translate(" + (-cx) + "," + (-cy) + ")");
    return parts.join(" ");
  }

  /** Hand-tuned intro motion; dock scale/pos from buildLegoFit + variant bounds. */
  var VARIANT_FIT_OVERRIDES = {};

  function initVariantFitOverrides() {
    ["maltase:maltose", "sucrase:sucrose", "lactase:lactose"].forEach(function (key) {
      var parts = key.split(":");
      VARIANT_FIT_OVERRIDES[key] = Object.assign({}, buildLegoFit(parts[1], parts[0]), {
        introRot: 0,
        introYOffset: -18,
        introScale: 1,
      });
    });
    VARIANT_FIT_OVERRIDES["pepsin:protein"] = Object.assign({}, buildLegoFit("protein", "pepsin"), {
      introRot: 0,
      introYOffset: -26,
      introScale: 1,
    });
    VARIANT_FIT_OVERRIDES["protease:peptide"] = Object.assign({}, buildLegoFit("peptide", "protease"), {
      introRot: 0,
      introYOffset: -26,
      introScale: 1,
    });
    VARIANT_FIT_OVERRIDES["pancreatic-lipase:lipid"] = Object.assign({}, buildLegoFit("lipid", "pancreatic-lipase"), {
      introRot: 0,
      introYOffset: -28,
      introScale: 1,
      scale: buildLegoFit("lipid", "pancreatic-lipase").scale * LIPASE_INLINE_MODEL_BOOST,
    });
    ["default:starch", "pancreatic-amylase:starch"].forEach(function (key) {
      var parts = key.split(":");
      VARIANT_FIT_OVERRIDES[key] = Object.assign({}, buildLegoFit(parts[1], parts[0]), {
        introRot: 0,
        introYOffset: -28,
        introScale: 1,
      });
    });
  }

  function variantFitKey(variant, substrateId) {
    return variant + ":" + substrateId;
  }

  function lerpRot(a, b, t) {
    var diff = ((b - a + 180) % 360) - 180;
    return a + diff * t;
  }

  function holeBoundsForVariant(variant, substrateId) {
    if (VARIANT_HOLE_BOUNDS[variant]) return VARIANT_HOLE_BOUNDS[variant];
    var hole = holeBoundsForSubstrate(substrateId);
    var o = holeOverrideForVariant(variant);
    if (!o || !o.scale || o.scale === 1) return hole;
    var cx = (hole.minX + hole.maxX) / 2;
    var cy = (hole.minY + hole.maxY) / 2;
    var s = o.scale;
    return {
      minX: cx + (hole.minX - cx) * s,
      maxX: cx + (hole.maxX - cx) * s,
      minY: cy + (hole.minY - cy) * s,
      maxY: cy + (hole.maxY - cy) * s,
    };
  }

  /**
   * Flat-model bounding boxes (100×60 view) and hole cutout bounds (enzyme-local).
   * Used to compute lego-snug fit: largest uniform scale that fills the active site.
   */
  /** Tighter bounds for lock-and-key docking (lipid head only — tails extend outside hole). */
  var MOL_DOCK_BOUNDS = {
    starch: { minX: 8, maxX: 88, minY: 12, maxY: 44 },
    lipid: { minX: 30, maxX: 70, minY: 16, maxY: 40 },
    maltose: { minX: 22, maxX: 78, minY: 36, maxY: 42 },
    sucrose: { minX: 22, maxX: 78, minY: 36, maxY: 42 },
    lactose: { minX: 22, maxX: 78, minY: 36, maxY: 42 },
    protein: { minX: 40, maxX: 58, minY: 18, maxY: 36 },
    peptide: { minX: 72, maxX: 92, minY: 24, maxY: 36 },
  };

  var MOL_BOUNDS = {
    glucose: { minX: 36, maxX: 64, minY: 16, maxY: 44 },
    fructose: { minX: 36, maxX: 64, minY: 16, maxY: 44 },
    galactose: { minX: 36, maxX: 64, minY: 16, maxY: 44 },
    maltose: { minX: 22, maxX: 78, minY: 18, maxY: 42 },
    sucrose: { minX: 22, maxX: 78, minY: 18, maxY: 42 },
    lactose: { minX: 22, maxX: 78, minY: 18, maxY: 42 },
    starch: { minX: 5, maxX: 87, minY: 3, maxY: 43 },
    protein: { minX: 3, maxX: 97, minY: 14, maxY: 38 },
    peptide: { minX: 10, maxX: 90, minY: 20, maxY: 36 },
    glycerol: { minX: 29, maxX: 71, minY: 11, maxY: 44 },
    "fatty-acid": { minX: 5.5, maxX: 96.5, minY: 23.5, maxY: 40.5 },
    lipid: { minX: 12, maxX: 88, minY: 3, maxY: 62 },
  };

  var HOLE_BOUNDS = {
    maltose: { minX: 36, maxX: 116, minY: 28, maxY: 58 },
    sucrose: { minX: 36, maxX: 116, minY: 28, maxY: 58 },
    lactose: { minX: 36, maxX: 116, minY: 28, maxY: 58 },
    starch: { minX: 40, maxX: 96, minY: 47, maxY: 58 },
    protein: { minX: 42, maxX: 98, minY: 42, maxY: 58 },
    peptide: { minX: 48, maxX: 92, minY: 42, maxY: 58 },
    lipid: { minX: 50, maxX: 90, minY: 40, maxY: 58 },
    glucose: { minX: 54, maxX: 86, minY: 42, maxY: 58 },
    fructose: { minX: 54, maxX: 86, minY: 42, maxY: 58 },
    galactose: { minX: 54, maxX: 86, minY: 42, maxY: 58 },
    glycerol: { minX: 56, maxX: 84, minY: 40, maxY: 58 },
    "fatty-acid": { minX: 44, maxX: 96, minY: 42, maxY: 58 },
  };

  var INTRO_ANIM = {
    maltose: { introRot: -14, introYOffset: -44, introScale: 1.42 },
    sucrose: { introRot: -14, introYOffset: -44, introScale: 1.42 },
    lactose: { introRot: -14, introYOffset: -44, introScale: 1.42 },
    starch: { introRot: -10, introYOffset: -42, introScale: 1.38 },
    protein: { introRot: -8, introYOffset: -40, introScale: 1.35 },
    peptide: { introRot: -8, introYOffset: -40, introScale: 1.35 },
    lipid: { introRot: -6, introYOffset: -38, introScale: 1.32 },
    glucose: { introRot: -14, introYOffset: -44, introScale: 1.42 },
    fructose: { introRot: -14, introYOffset: -44, introScale: 1.42 },
    galactose: { introRot: -14, introYOffset: -44, introScale: 1.42 },
    glycerol: { introRot: -8, introYOffset: -40, introScale: 1.35 },
    "fatty-acid": { introRot: -8, introYOffset: -40, introScale: 1.35 },
  };

  function molBounds(type) {
    return MOL_BOUNDS[type] || { minX: 20, maxX: 80, minY: 16, maxY: 44 };
  }

  function dockMolBounds(type) {
    return MOL_DOCK_BOUNDS[type] || molBounds(type);
  }

  function holeBoundsForSubstrate(substrateId) {
    return HOLE_BOUNDS[substrateId] || HOLE_BOUNDS.maltose;
  }

  function isPepsinProteaseVariant(variant) {
    return variant === "pepsin" || variant === "protease";
  }

  function buildLegoFit(substrateId, variant) {
    var pocket = variant && isPepsinProteaseVariant(variant);
    var topV = variant && isDisaccharidaseVariant(variant);
    var mol = pocket ? molBounds(substrateId) : dockMolBounds(substrateId);
    var hole = variant
      ? holeBoundsForVariant(variant, substrateId)
      : holeBoundsForSubstrate(substrateId);
    var intro = INTRO_ANIM[substrateId] || { introRot: -10, introYOffset: -42, introScale: 1.38 };
    var molW = mol.maxX - mol.minX;
    var molH = mol.maxY - mol.minY;
    var holeW = hole.maxX - hole.minX;
    var holeH = hole.maxY - hole.minY;
    var scaleX = holeW / molW;
    var scaleY = holeH / molH;
    var scale = Math.min(scaleX, scaleY) * (pocket ? 0.92 : topV ? 1 : 1);
    var holeCx = (hole.minX + hole.maxX) / 2;
    var cy;
    if (pocket) {
      var holeCy = (hole.minY + hole.maxY) / 2;
      var molMidY = (mol.minY + mol.maxY) / 2;
      cy = holeCy - (molMidY - CY) * scale;
    } else {
      cy = hole.maxY - (mol.maxY - CY) * scale;
    }
    var rot = 0;
    var o = variant ? holeOverrideForVariant(variant) : null;
    if (o && o.rotate) rot = o.rotate;
    return {
      cx: holeCx,
      cy: cy,
      scale: scale,
      rot: rot,
      introRot: intro.introRot + (variant && o && o.rotate ? o.rotate * 0.12 : 0),
      introYOffset: intro.introYOffset,
      introScale: intro.introScale,
    };
  }

  function holeFitForVariant(variant, substrateId) {
    var key = variantFitKey(variant, substrateId);
    if (VARIANT_FIT_OVERRIDES[key]) return VARIANT_FIT_OVERRIDES[key];
    if (!holeFitForVariant._cache) holeFitForVariant._cache = {};
    if (!holeFitForVariant._cache[key]) {
      holeFitForVariant._cache[key] = buildLegoFit(substrateId, variant);
    }
    return holeFitForVariant._cache[key];
  }

  var SUBSTRATE_HOLE_FIT = {};
  (function initHoleFits() {
    var types = [
      "maltose", "sucrose", "lactose", "starch", "protein", "peptide", "lipid",
      "glucose", "fructose", "galactose", "glycerol", "fatty-acid",
    ];
    types.forEach(function (t) {
      SUBSTRATE_HOLE_FIT[t] = buildLegoFit(t);
    });
    initVariantFitOverrides();
  })();

  function holeFitForSubstrate(substrateId) {
    return SUBSTRATE_HOLE_FIT[substrateId] || buildLegoFit(substrateId);
  }

  /**
   * Hex / node radius in flat model coords (100×60 view).
   * Used so released products match substrate building-block sphere size.
   */
  var MOL_UNIT_RADIUS = {
    starch: 9,
    maltose: 12,
    sucrose: 12,
    lactose: 12,
    glucose: 14,
    fructose: 14,
    galactose: 14,
    glycerol: 5,
    lipid: 7,
    "fatty-acid": 5,
  };

  /** Extra shrink for lipid cleavage products in inline slot. */
  var PRODUCT_RELEASE_SCALE = {
    "lipid:glycerol": 0.46,
    "lipid:fatty-acid": 0.55,
  };

  function unitRadiusFor(type) {
    return MOL_UNIT_RADIUS[type] != null ? MOL_UNIT_RADIUS[type] : null;
  }

  /** Scene-space embed scale so a product matches the docked substrate footprint. */
  function productSceneScale(substrateType, productType, enzymeScale, variant) {
    var subFit = variant
      ? holeFitForVariant(variant, substrateType)
      : holeFitForSubstrate(substrateType);
    var baseScale = subFit.scale * enzymeScale;
    var subUnit = unitRadiusFor(substrateType);
    var prodUnit = unitRadiusFor(productType);
    var scale;
    if (subUnit != null && prodUnit != null) {
      scale = baseScale * (subUnit / prodUnit);
    } else {
      var subB = molBounds(substrateType);
      var prodB = molBounds(productType);
      var subSpan = Math.max(subB.maxX - subB.minX, subB.maxY - subB.minY);
      var prodSpan = Math.max(prodB.maxX - prodB.minX, prodB.maxY - prodB.minY);
      if (prodSpan < 0.001) prodSpan = 1;
      scale = baseScale * (subSpan / prodSpan);
    }
    var releaseKey = substrateType + ":" + productType;
    if (PRODUCT_RELEASE_SCALE[releaseKey] != null) {
      scale *= PRODUCT_RELEASE_SCALE[releaseKey];
    }
    return scale;
  }

  function lerpNum(a, b, t) {
    return a + (b - a) * t;
  }

  function dockScaleWithSnap(fit, dockT) {
    var scale = fit.scale;
    if (dockT >= 0.82) {
      var snapT = (dockT - 0.82) / 0.18;
      scale *= 1 + 0.055 * Math.sin(snapT * Math.PI);
    }
    return scale;
  }

  /** Render substrate inside enzyme-local space, interpolating toward hole fit. */
  function renderFlatEmbedInEnzymeHole(type, dockT, options) {
    options = options || {};
    var fit = options.variant
      ? holeFitForVariant(options.variant, type)
      : holeFitForSubstrate(type);
    dockT = dockT < 0 ? 0 : dockT > 1 ? 1 : dockT;
    var introTravel = options.introTravel != null ? options.introTravel : 1;
    var cy = fit.cy + (1 - dockT) * fit.introYOffset * introTravel;
    var dockSc = dockScaleWithSnap(fit, dockT);
    var sc = lerpNum(fit.scale * fit.introScale, dockSc, dockT);
    if (options.sizeBoost != null && options.sizeBoost !== 1) sc *= options.sizeBoost;
    var rot = lerpRot(fit.introRot || 0, fit.rot || 0, dockT);
    var op = options.opacity != null ? options.opacity : 1;
    var inner = renderFlatScene(type, options);
    if (!inner) return "";
    return (
      '<g transform="translate(' + fit.cx + "," + cy.toFixed(2) + ") rotate(" + rot.toFixed(2) +
      ") scale(" + sc.toFixed(4) + ") translate(" + (-CX) + "," + (-CY) +
      ')" opacity="' + op.toFixed(2) + '">' + inner + "</g>"
    );
  }

  /** Mini substrate outline drawn inside hole to show lock-and-key fit */
  function substrateFitPreview(substrateId, colors, variant) {
    var hole = colors.hole || HOLE_COLOR;
    var fit = variant
      ? holeFitForVariant(variant, substrateId)
      : holeFitForSubstrate(substrateId);
    var fitColors = {};
    var k;
    for (k in DEFAULT_COLORS) fitColors[k] = hole;
    fitColors.bond = hole;
    fitColors.edge = "#1a4a6f";
    var scene = renderFlatScene(substrateId, { colors: fitColors });
    if (!scene) return "";
    return (
      '<g opacity="0.55" transform="translate(' + fit.cx + "," + fit.cy +
      ") rotate(" + (fit.rot || 0) + ") scale(" + fit.scale + ") translate(" + (-CX) + "," + (-CY) +
      ')">' + scene + "</g>"
    );
  }

  /** Pancreatic lipase only — yellow glycerol head (same shape and scale as glycerol model). */
  function activeSiteHolePancreaticLipase(colors, opts) {
    opts = opts || {};
    var hole = colors.hole || HOLE_COLOR;
    var edge = colors.holeEdge || HOLE_EDGE;
    var fillOp = opts.holeOpacity != null ? opts.holeOpacity : ACTIVE_SITE_OPACITY;
    var site = PANCREATIC_LIPASE_GLYCEROL_SITE;
    var fitColors = {};
    var k;
    for (k in DEFAULT_COLORS) fitColors[k] = hole;
    fitColors.bond = hole;
    fitColors.edge = edge;
    fitColors.glycerol = hole;
    var scene = renderFlatScene("glycerol", { colors: fitColors });
    if (!scene) return "";
    return (
      '<g opacity="' + fillOp.toFixed(3) + '" transform="translate(' + site.cx + "," + site.cy +
      ") scale(" + site.scale + ") translate(" + (-CX) + "," + (-CY) +
      ')">' + scene + "</g>"
    );
  }

  /** Yellow active-site slot — pancreatic lipase uses glycerol silhouette; others use substrate silhouette. */
  function activeSiteHoleAtFit(substrateId, variant, colors, opts) {
    opts = opts || {};
    if (variant === "pancreatic-lipase") {
      return activeSiteHolePancreaticLipase(colors, opts);
    }
    var fit = variant
      ? holeFitForVariant(variant, substrateId)
      : holeFitForSubstrate(substrateId);
    var hole = colors.hole || HOLE_COLOR;
    var edge = colors.holeEdge || HOLE_EDGE;
    var fillOp = opts.holeOpacity != null ? opts.holeOpacity : ACTIVE_SITE_OPACITY;
    var fitColors = {};
    var k;
    for (k in DEFAULT_COLORS) fitColors[k] = hole;
    fitColors.bond = hole;
    fitColors.edge = edge;
    var scene = renderFlatScene(substrateId, { colors: fitColors });
    if (!scene) return "";
    return (
      '<g opacity="' + fillOp.toFixed(3) + '" transform="translate(' + fit.cx + "," + fit.cy +
      ") rotate(" + (fit.rot || 0) + ") scale(" + fit.scale + ") translate(" + (-CX) + "," + (-CY) +
      ')">' + scene + "</g>"
    );
  }

  /**
   * Fig 4.3 digestion enzyme — dome body from action-of-enzyme, single substrate-shaped yellow slot.
   * Used by enzyme-factor inline animation for all 8 digestive enzymes.
   */
  function buildFig43DigestionEnzymeScene(c, opts, variant) {
    opts = opts || {};
    variant = variant || "default";
    var shapes = global.ENZYME_SHAPES || {};
    var palette = shapes.colors || {};
    var fill = palette.enzyme || "#89C2EB";
    var edge = palette.enzymeEdge || "#6AABD8";
    var bodyPath =
      shapes.enzymeDigestion ||
      shapes.enzyme ||
      "M 8 72 L 132 72 C 150 72 156 44 144 24 L 12 24 C 0 44 -2 72 8 72 Z";
    var substrate = substrateForVariant(variant);
    var slotColors = {
      hole: c.hole || HOLE_COLOR,
      holeEdge: c.holeEdge || HOLE_EDGE,
    };
    var html =
      '<path d="' + bodyPath + '" fill="' + fill + '" stroke="' + edge +
      '" stroke-width="1.2" stroke-linejoin="round"/>';
    if ((opts.holeOpacity != null ? opts.holeOpacity : ACTIVE_SITE_OPACITY) > 0.01) {
      var holeHtml = activeSiteHoleAtFit(substrate, variant, slotColors, opts);
      if (variant === "pancreatic-lipase" || isAmylaseVariant(variant)) {
        var clipId = "ef-enz-clip-" + String(variant).replace(/[^a-z0-9-]/g, "");
        html =
          '<defs><clipPath id="' + clipId + '"><path d="' + bodyPath + '"/></clipPath></defs>' +
          html +
          '<g clip-path="url(#' + clipId + ')">' + holeHtml + "</g>";
      } else {
        html += holeHtml;
      }
    }
    if (opts.showFitPreview) {
      html += substrateFitPreview(substrate, c, variant);
    }
    return html;
  }

  function isAmylaseVariant(variant) {
    return variant === "default" || variant === "pancreatic-amylase";
  }

  function isPancreaticLipaseVariant(variant) {
    return variant === "pancreatic-lipase";
  }

  /** Red oval enzyme with central yellow active-site slot (pepsin + protease). */
  function buildPepsinProteaseFlatScene(c, opts, variant) {
    opts = opts || {};
    var bodyFill = "#F07070";
    var bodyEdge = "#333333";
    var hole = c.hole || HOLE_COLOR;
    var holeEdge = c.holeEdge || "#333333";
    var fillOp = opts.holeOpacity != null ? opts.holeOpacity : ACTIVE_SITE_OPACITY;
    var strokeOp = opts.holeOpacity != null ? Math.min(1, opts.holeOpacity + 0.15) : 1;
    var b = PEPSIN_PROTEASE_BODY;
    var html =
      '<ellipse cx="' + b.cx + '" cy="' + b.cy + '" rx="' + b.rx + '" ry="' + b.ry +
      '" fill="' + bodyFill + '" stroke="' + bodyEdge + '" stroke-width="2"/>';
    if (fillOp > 0.01) {
      html +=
        '<path d="' + PEPSIN_PROTEASE_SLOT + '" fill="' + hole + '" opacity="' + fillOp.toFixed(3) + '"/>' +
        '<path d="' + PEPSIN_PROTEASE_SLOT + '" fill="none" stroke="' + holeEdge +
        '" stroke-width="2.5" stroke-linejoin="round" opacity="' + strokeOp.toFixed(3) + '"/>';
    }
    if (opts.showFitPreview) {
      html += substrateFitPreview(substrateForVariant(variant), { hole: hole, holeEdge: holeEdge }, variant);
    }
    return html;
  }

  /** Red block with exactly two yellow triangles (maltase, sucrase, lactase). */
  function buildDisaccharidaseBodyScene(c, opts) {
    opts = opts || {};
    var bodyFill = "#F07070";
    var bodyEdge = "#333333";
    return (
      '<path d="' + DISACCHARIDASE_BODY + '" fill="' + bodyFill + '" stroke="' + bodyEdge +
      '" stroke-width="2.5" stroke-linejoin="round"/>'
    );
  }

  function buildDisaccharidaseHoleScene(c, opts) {
    opts = opts || {};
    var hole = c.hole || HOLE_COLOR;
    var fillOp = opts.holeOpacity != null ? opts.holeOpacity : DISACCHARIDASE_HOLE_OPACITY;
    if (fillOp <= 0.01) return "";
    return (
      '<path d="' + DISACCHARIDASE_LEFT_V + '" fill="' + hole + '" opacity="' + fillOp.toFixed(3) + '"/>' +
      '<path d="' + DISACCHARIDASE_RIGHT_V + '" fill="' + hole + '" opacity="' + fillOp.toFixed(3) + '"/>'
    );
  }

  function buildDisaccharidaseFlatScene(c, opts, variant) {
    opts = opts || {};
    return buildDisaccharidaseBodyScene(c, opts) + buildDisaccharidaseHoleScene(c, opts);
  }

  /** Rectangular enzyme body with dual semicircular active sites on the top edge. */
  function buildPancreaticLipaseFlatScene(c, opts) {
    opts = opts || {};
    var shapes = global.ENZYME_SHAPES || {};
    var palette = shapes.colors || {};
    var fill = palette.enzyme || "#89C2EB";
    var edge = palette.enzymeEdge || "#6AABD8";
    var hole = c.hole || HOLE_COLOR;
    var holeEdge = c.holeEdge || HOLE_EDGE;
    var fillOp = opts.holeOpacity != null ? opts.holeOpacity : ACTIVE_SITE_OPACITY;
    var strokeOp = opts.holeOpacity != null ? Math.min(1, opts.holeOpacity + 0.15) : 1;
    var body =
      "M 0,80 L 400,80 L 400,0 L 248,0 A 12,12 0 0,1 224,0 L 176,0 A 12,12 0 0,1 152,0 L 0,0 Z";
    var leftPocket = "M 152 0 A 12 12 0 0 0 176 0 Z";
    var rightPocket = "M 224 0 A 12 12 0 0 0 248 0 Z";
    var html =
      '<path d="' + body + '" fill="' + fill + '" stroke="' + edge + '" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="' + leftPocket + '" fill="' + hole + '" opacity="' + fillOp.toFixed(3) + '"/>' +
      '<path d="' + rightPocket + '" fill="' + hole + '" opacity="' + fillOp.toFixed(3) + '"/>' +
      '<path d="' + leftPocket + '" fill="none" stroke="' + holeEdge + '" stroke-width="1.2" opacity="' + strokeOp.toFixed(3) + '"/>' +
      '<path d="' + rightPocket + '" fill="none" stroke="' + holeEdge + '" stroke-width="1.2" opacity="' + strokeOp.toFixed(3) + '"/>';
    if (opts.showFitPreview) {
      html += substrateFitPreview("lipid", { hole: hole, holeEdge: holeEdge }, "pancreatic-lipase");
    }
    return html;
  }

  function bondMarker(x, y, col, rot) {
    rot = rot || 0;
    var tr = rot ? ' transform="rotate(' + rot + " " + x + " " + y + ')"' : "";
    return (
      '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
      '" rx="2.6" ry="1.2" fill="' + col + '"' + tr + "/>"
    );
  }

  /** Animation amylase body — matches amylase-enzyme-flat.svg with controllable active-site fill. */
  function buildAmylaseEnzymeScene(c, opts) {
    opts = opts || {};
    var shapes = global.ENZYME_SHAPES || {};
    var palette = shapes.colors || {};
    var fill = palette.enzyme || "#89C2EB";
    var edge = palette.enzymeEdge || "#6AABD8";
    var hole = c.hole || HOLE_COLOR;
    var holeEdge = c.holeEdge || HOLE_EDGE;
    var fillOp = opts.holeOpacity != null ? opts.holeOpacity : ACTIVE_SITE_OPACITY;
    var strokeOp = opts.holeOpacity != null ? Math.min(1, opts.holeOpacity + 0.15) : 1;
    var bowl =
      "M 68 73.8 C 118 71.5 128 47 122 33 C 116 20 104 16 68 16 C 32 16 20 20 14 33 C 8 47 18 71.5 68 73.8 Z";
    var holePath =
      "M 16 42 C 12 36 12 26 18 18 C 26 12 44 10 68 10 C 92 10 110 12 118 18 C 124 26 124 36 120 42 L 110 46 L 98 44 L 86 46 L 74 44 L 62 46 L 50 44 L 38 46 L 26 44 Z";
    var html =
      '<path d="' + bowl + '" fill="' + fill + '" stroke="' + edge + '" stroke-width="1.2" stroke-linejoin="round"/>';
    if (fillOp > 0.01) {
      html +=
        '<path d="' + holePath + '" fill="' + hole + '" opacity="' + fillOp.toFixed(3) + '"/>' +
        '<path d="' + holePath + '" fill="none" stroke="' + holeEdge + '" stroke-width="1.2" opacity="' +
        strokeOp.toFixed(3) + '"/>';
    }
    html +=
      '<line x1="68" y1="73.8" x2="68" y2="82.8" stroke="' + edge + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M 74.2 89.5 L 74.2 96.7 L 61.8 96.7 L 61.8 89.5 L 68 82.8 Z" fill="' + fill +
      '" stroke="' + edge + '" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<path d="' + bowl + '" fill="none" stroke="' + edge + '" stroke-width="1.2" stroke-linejoin="round"/>';
    return html;
  }

  /** Flat amylase enzyme — semi-circle bowl, starch hex grid, stem + bottom hex (see assets/enzymes/amylase-enzyme-flat.svg). */
  function buildAmylaseFlatScene(c) {
    var fill = c.starch || "#f5e6a8";
    var edge = c.edge || "#555555";
    var bondCol = c.bond || "#333333";
    var r = 7.5;
    var row1x = [20, 36, 52, 68, 84, 100, 116];
    var row2x = [28, 44, 60, 76, 92, 108];
    var y1 = 19;
    var y2 = 32;
    var html = "";
    var i;

    html +=
      '<path d="M 68 73.8 C 118 71.5 128 47 122 33 C 116 20 104 16 68 16 C 32 16 20 20 14 33 C 8 47 18 71.5 68 73.8 Z" fill="' +
      fill + '" stroke="' + edge + '" stroke-width="1.2" stroke-linejoin="round"/>';

    for (i = 0; i < row1x.length; i++) {
      html += filled(hexPath(row1x[i], y1, r), fill, edge);
      if (i > 0) html += bond(row1x[i - 1] + 6.5, y1, row1x[i] - 6.5, y1, bondCol);
    }
    for (i = 0; i < row2x.length; i++) {
      html += filled(hexPath(row2x[i], y2, r), fill, edge);
      if (i > 0) html += bond(row2x[i - 1] + 6.5, y2, row2x[i] - 6.5, y2, bondCol);
    }

    for (i = 0; i < row2x.length; i++) {
      var xTop = row1x[i + 1];
      var xBot = row2x[i];
      html += bond(xTop, y1 + 4.5, xBot, y2 - 4.5, bondCol);
      html += bondMarker((xTop + xBot) / 2, (y1 + y2) / 2 + 1.5, bondCol);
    }

    for (i = 0; i < row2x.length - 1; i++) {
      html += bondMarker((row2x[i] + row2x[i + 1]) / 2, y2, bondCol, 55);
    }

    html += bond(68, 73.8, 68, 82.8, bondCol);
    html += filled(hexPath(68, 89.5, 6.2), fill, edge);

    html +=
      '<path d="M 68 73.8 C 118 71.5 128 47 122 33 C 116 20 104 16 68 16 C 32 16 20 20 14 33 C 8 47 18 71.5 68 73.8 Z" fill="none" stroke="' +
      edge + '" stroke-width="1.2" stroke-linejoin="round"/>';

    return html;
  }

  function enzymeAnchorForVariant(variant) {
    if (isDisaccharidaseVariant(variant)) {
      return disaccharidaseAnchor();
    }
    if (isPepsinProteaseVariant(variant)) {
      return { x: PEPSIN_PROTEASE_ANCHOR_X, y: PEPSIN_PROTEASE_ANCHOR_Y };
    }
    if (isPancreaticLipaseVariant(variant)) {
      if (usesDigestionFig43Layout(variant)) {
        return { x: ENZYME_ANCHOR_X, y: ENZYME_ANCHOR_Y };
      }
      return { x: PANCREATIC_LIPASE_ANCHOR_X, y: PANCREATIC_LIPASE_ANCHOR_Y };
    }
    if (isAmylaseVariant(variant)) {
      return { x: AMYLASE_ANCHOR_X, y: AMYLASE_ANCHOR_Y };
    }
    if (global.ENZYME_SHAPES && global.ENZYME_SHAPES.enzymeDigestion) {
      return { x: ENZYME_ANCHOR_X, y: ENZYME_ANCHOR_Y };
    }
    return { x: ENZYME_ANCHOR_X, y: ENZYME_ANCHOR_Y };
  }

  function enzymeHoleMarkup(variant, colors, opts) {
    opts = opts || {};
    if (isDisaccharidaseVariant(variant) || isPancreaticLipaseVariant(variant) || isPepsinProteaseVariant(variant) || isFrozenAssetVariant(variant)) {
      return "";
    }
    var substrate = substrateForVariant(variant);
    var hole = colors.hole || HOLE_COLOR;
    var edge = colors.holeEdge || HOLE_EDGE;
    var cutout = holeCutoutForVariant(variant);
    var fillOp = opts.holeOpacity != null ? opts.holeOpacity : ACTIVE_SITE_OPACITY;
    var strokeOp = opts.holeOpacity != null ? Math.min(1, opts.holeOpacity + 0.15) : 1;
    var inner =
      '<path fill="' + hole + '" opacity="' + fillOp.toFixed(3) + '" d="' + cutout + '"/>' +
      '<path fill="none" stroke="' + edge + '" stroke-width="1.4" opacity="' + strokeOp.toFixed(3) + '" d="' + cutout + '"/>';
    if (opts.showFitPreview) {
      inner += substrateFitPreview(substrate, colors, variant);
    }
    var xform = holeTransformAttr(variant);
    if (xform) {
      inner = '<g transform="' + xform + '">' + inner + "</g>";
    }
    return inner;
  }

  function renderEnzymeFlatScene(variant, options) {
    options = options || {};
    variant = variant || "default";
    if (isDisaccharidaseVariant(variant)) {
      return renderDisaccharidaseScene(options, variant);
    }
    if (isPepsinProteaseVariant(variant)) {
      return buildPepsinProteaseFlatScene(
        Object.assign({}, options.colors || DEFAULT_COLORS, {
          hole: options.hole || HOLE_COLOR,
          holeEdge: options.holeEdge || HOLE_EDGE,
        }),
        {
          showFitPreview: options.showFitPreview,
          holeOpacity: options.holeOpacity,
        },
        variant
      );
    }
    if (global.ENZYME_SHAPES && global.ENZYME_SHAPES.enzymeDigestion) {
      return buildFig43DigestionEnzymeScene(
        Object.assign({}, options.colors || DEFAULT_COLORS, {
          hole: options.hole || HOLE_COLOR,
          holeEdge: options.holeEdge || HOLE_EDGE,
        }),
        {
          holeOpacity: options.holeOpacity,
          showFitPreview: options.showFitPreview,
        },
        variant
      );
    }
    if (isPancreaticLipaseVariant(variant)) {
      return renderRasterAssetScene(PANCREATIC_LIPASE_IMAGE, options);
    }
    if (isAmylaseVariant(variant)) {
      return buildAmylaseEnzymeScene(
        Object.assign({}, options.colors || DEFAULT_COLORS, {
          hole: options.hole || HOLE_COLOR,
          holeEdge: options.holeEdge || HOLE_EDGE,
        }),
        {
          holeOpacity: options.holeOpacity != null ? options.holeOpacity : ACTIVE_SITE_OPACITY,
          showFitPreview: options.showFitPreview,
        }
      );
    }
    var shapes = global.ENZYME_SHAPES || {};
    var path = enzymePathForVariant(variant) || shapes.enzyme ||
      "M 8 72 L 132 72 C 150 72 156 44 144 24 L 108 24 L 76 24 L 76 36 A 10 10 0 0 0 56 36 L 56 24 L 36 24 L 30 36 L 24 24 L 12 24 C 0 44 -2 72 8 72 Z";
    var palette = shapes.colors || {};
    var colors = {
      enzyme: palette.enzyme || "#89C2EB",
      enzymeEdge: palette.enzymeEdge || "#6AABD8",
      hole: options.hole || HOLE_COLOR,
      holeEdge: options.holeEdge || HOLE_EDGE,
    };
    return (
      '<path d="' + path + '" fill="' + colors.enzyme + '" stroke="' + colors.enzymeEdge + '" stroke-width="1.2"/>' +
      enzymeHoleMarkup(variant, colors, {
        showFitPreview: options.showFitPreview,
        holeOpacity: options.holeOpacity,
      })
    );
  }

  function renderFlatSvg(type, options) {
    options = options || {};
    var w = options.width || PREVIEW_W;
    var h = options.height || PREVIEW_H;
    var bg = options.background !== false
      ? '<rect width="' + w + '" height="' + h + '" fill="#ffffff"/>'
      : "";
    var scale = options.scale != null ? options.scale : MOL_PREVIEW_SCALE;
    var inner = renderFlatScene(type, options);
    if (!inner) return "";
    var scene =
      '<g transform="translate(' + (w * 0.5) + "," + (h * 0.5) + ") scale(" + scale +
      ") translate(" + (-CX) + "," + (-CY) + ')">' + inner + "</g>";
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h +
      '" role="img" aria-label="' + type + ' flat 2D model">' + bg + scene + "</svg>"
    );
  }

  function renderEnzymeFlatSvg(variant, options) {
    options = options || {};
    var w = options.width || PREVIEW_W;
    var h = options.height || PREVIEW_H;
    var bg = options.background !== false
      ? '<rect width="' + w + '" height="' + h + '" fill="#ffffff"/>'
      : "";
    var scale = options.scale != null ? options.scale : ENZYME_PREVIEW_SCALE;
    var anchor = enzymeAnchorForVariant(variant);
    var inner = renderEnzymeFlatScene(variant, options);
    var scene =
      '<g transform="translate(' + (w * 0.5) + "," + (h * 0.5) + ") scale(" + scale +
      ") translate(" + (-anchor.x) + "," + (-anchor.y) + ')">' + inner + "</g>";
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h +
      '" role="img" aria-label="' + variant + ' enzyme flat 2D model">' + bg + scene + "</svg>"
    );
  }

  function renderFlatScene(type, options) {
    options = options || {};
    var builder = BUILDERS[type];
    if (!builder) return "";
    var colors = options.colors || DEFAULT_COLORS;
    return builder(colors);
  }

  function renderFlatEmbed(type, cx, cy, options) {
    options = options || {};
    var embedScale = options.embedScale != null ? options.embedScale : 0.55;
    var op = options.opacity != null ? options.opacity : 1;
    var inner = renderFlatScene(type, options);
    if (!inner) return "";
    var label = "";
    if (options.label) {
      var dy = options.labelDy != null ? options.labelDy : 34;
      var fs = options.labelSize != null ? options.labelSize : 7.5;
      var lc = options.labelColor || "#2a3340";
      var lop = options.labelOpacity != null ? options.labelOpacity : op;
      label =
        '<text x="' + cx + '" y="' + (cy + dy) + '" text-anchor="middle" font-size="' + fs +
        '" fill="' + lc + '" font-weight="600" opacity="' + lop.toFixed(2) + '">' + options.label + "</text>";
    }
    return (
      '<g transform="translate(' + cx + "," + cy + ") scale(" + embedScale + ") translate(" + (-CX) + "," + (-CY) +
      ')" opacity="' + op.toFixed(2) + '">' + inner + "</g>" + label
    );
  }

  global.MoleculeFlat2d = {
    W: W,
    H: H,
    CX: CX,
    CY: CY,
    PREVIEW_W: PREVIEW_W,
    PREVIEW_H: PREVIEW_H,
    COLORS: DEFAULT_COLORS,
    HOLE_COLOR: HOLE_COLOR,
    HOLE_EDGE: HOLE_EDGE,
    ACTIVE_SITE_OPACITY: ACTIVE_SITE_OPACITY,
    HOLE_CX: HOLE_CX,
    HOLE_CY: HOLE_CY,
    SUBSTRATE_HOLE_FIT: SUBSTRATE_HOLE_FIT,
    MOL_BOUNDS: MOL_BOUNDS,
    MOL_DOCK_BOUNDS: MOL_DOCK_BOUNDS,
    HOLE_BOUNDS: HOLE_BOUNDS,
    molBounds: molBounds,
    dockMolBounds: dockMolBounds,
    holeBoundsForSubstrate: holeBoundsForSubstrate,
    buildLegoFit: buildLegoFit,
    VARIANT_HOLE_CUTOUTS: VARIANT_HOLE_CUTOUTS,
    VARIANT_HOLE_BOUNDS: VARIANT_HOLE_BOUNDS,
    holeCutoutForVariant: holeCutoutForVariant,
    VARIANT_HOLE_OVERRIDES: VARIANT_HOLE_OVERRIDES,
    VARIANT_FIT_OVERRIDES: VARIANT_FIT_OVERRIDES,
    holeOverrideForVariant: holeOverrideForVariant,
    holeFitForVariant: holeFitForVariant,
    holeFitForSubstrate: holeFitForSubstrate,
    holeBoundsForVariant: holeBoundsForVariant,
    productSceneScale: productSceneScale,
    enzymeAnchorForVariant: enzymeAnchorForVariant,
    renderFlatEmbedInEnzymeHole: renderFlatEmbedInEnzymeHole,
    FLAT_MOLECULE_TYPES: FLAT_MOLECULE_TYPES,
    ENZYME_TYPES: ENZYME_TYPES,
    VARIANT_SUBSTRATE: VARIANT_SUBSTRATE,
    FROZEN_ASSET_VARIANTS: FROZEN_ASSET_VARIANTS,
    AMYLASE_IMAGE: AMYLASE_IMAGE,
    PANCREATIC_LIPASE_IMAGE: PANCREATIC_LIPASE_IMAGE,
    isFrozenAssetVariant: isFrozenAssetVariant,
    pastedAssetForVariant: pastedAssetForVariant,
    renderRasterAssetScene: renderRasterAssetScene,
    renderAmylaseAssetScene: renderAmylaseAssetScene,
    DISACCHARIDASE_VARIANTS: DISACCHARIDASE_VARIANTS,
    ENZYME_FLAT_ASSETS: ENZYME_FLAT_ASSETS,
    DISACCHARIDASE_IMAGE: DISACCHARIDASE_IMAGE,
    isDisaccharidaseVariant: isDisaccharidaseVariant,
    enzymePathForVariant: enzymePathForVariant,
    monomersForSubstrate: monomersForSubstrate,
    disaccharidaseAnchor: disaccharidaseAnchor,
    renderDisaccharidaseScene: renderDisaccharidaseScene,
    buildDisaccharidaseBodyScene: buildDisaccharidaseBodyScene,
    buildDisaccharidaseHoleScene: buildDisaccharidaseHoleScene,
    buildDisaccharidaseFlatScene: buildDisaccharidaseFlatScene,
    DISACCHARIDASE_HOLE_OPACITY: DISACCHARIDASE_HOLE_OPACITY,
    substrateForVariant: substrateForVariant,
    holeCutoutForSubstrate: holeCutoutForSubstrate,
    enzymeHoleMarkup: enzymeHoleMarkup,
    renderFlatScene: renderFlatScene,
    renderFlatEmbed: renderFlatEmbed,
    renderFlatSvg: renderFlatSvg,
    renderEnzymeFlatScene: renderEnzymeFlatScene,
    renderEnzymeFlatSvg: renderEnzymeFlatSvg,
    buildAmylaseFlatScene: buildAmylaseFlatScene,
    buildPancreaticLipaseFlatScene: buildPancreaticLipaseFlatScene,
    buildFig43DigestionEnzymeScene: buildFig43DigestionEnzymeScene,
    activeSiteHoleAtFit: activeSiteHoleAtFit,
    usesDigestionFig43Layout: usesDigestionFig43Layout,
    LIPASE_INLINE_MODEL_BOOST: LIPASE_INLINE_MODEL_BOOST,
    PANCREATIC_LIPASE_GLYCEROL_SITE: PANCREATIC_LIPASE_GLYCEROL_SITE,
    PANCREATIC_LIPASE_SLOT: PANCREATIC_LIPASE_SLOT,
    isAmylaseVariant: isAmylaseVariant,
    isPancreaticLipaseVariant: isPancreaticLipaseVariant,
    isPepsinProteaseVariant: isPepsinProteaseVariant,
  };
})(typeof window !== "undefined" ? window : globalThis);
