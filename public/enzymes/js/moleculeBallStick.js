/**
 * 3D ball-and-stick molecule renderer — same visual language as proteinFoldingAnimation.js
 */
(function (global) {
  "use strict";

  var W = 520;
  var H = 280;
  var SAMPLES = 48;
  var PROJ_SCALE = 0.82;
  var PROJ_PERSP = 420;

  var SEG = {
    pink: "#f5bcd0",
    blue: "#aad4f5",
    purple: "#c8b8e8",
    green: "#b8e6a8",
    yellow: "#f5e6a8",
    teal: "#98dede",
    starch: "#f5e6a8",
    glucose: "#f5e6a8",
    fructose: "#f5bcd0",
    galactose: "#98dede",
    lipid: "#f5e6a8",
    glycerol: "#aad4f5",
  };

  var MOLECULE_TYPES = [
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

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function project(p, ox, oy, scale) {
    ox = ox || 0;
    oy = oy || 0;
    scale = scale != null ? scale : PROJ_SCALE;
    var f = PROJ_PERSP / (PROJ_PERSP + p.z);
    return {
      x: W * 0.5 + (p.x + ox) * f * scale,
      y: H * 0.5 + (p.y + oy) * f * scale,
      z: p.z,
      f: f,
    };
  }

  function beadMarkup(pr, r, color, gloss, alpha) {
    var g = clamp(gloss, 0, 1);
    var op = alpha == null ? 1 : clamp(alpha, 0, 1);
    return (
      '<g opacity="' + op.toFixed(2) + '"><circle cx="' + pr.x.toFixed(1) + '" cy="' + pr.y.toFixed(1) +
      '" r="' + r.toFixed(1) + '" fill="' + color +
      '" stroke="#555" stroke-width="0.45"/>' +
      '<circle cx="' + (pr.x - r * 0.36).toFixed(1) + '" cy="' + (pr.y - r * 0.36).toFixed(1) +
      '" r="' + (r * 0.3).toFixed(1) + '" fill="#fff" opacity="' + (0.35 + g * 0.4).toFixed(2) + '"/></g>'
    );
  }

  function linkMarkup(a, b, w) {
    return (
      '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) +
      '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) +
      '" stroke="#141414" stroke-width="' + w.toFixed(1) +
      '" stroke-linecap="round" opacity="0.92"/>'
    );
  }

  function resamplePath(raw, n) {
    if (raw.length <= n) return raw.slice();
    var out = [];
    for (var i = 0; i < n; i++) {
      var t = (i / (n - 1)) * (raw.length - 1);
      var i0 = Math.floor(t);
      var i1 = Math.min(i0 + 1, raw.length - 1);
      var u = t - i0;
      out.push({
        x: lerp(raw[i0].x, raw[i1].x, u),
        y: lerp(raw[i0].y, raw[i1].y, u),
        z: lerp(raw[i0].z, raw[i1].z, u),
        color: u < 0.5 ? raw[i0].color : raw[i1].color,
      });
    }
    return out;
  }

  function petalLoop(knot, angle, radius, zBase, zSwing, color, steps) {
    var out = [];
    for (var i = 0; i <= steps; i++) {
      var u = i / steps;
      var bulge = Math.sin(u * Math.PI);
      var sweep = (u - 0.5) * 1.7;
      var dist = radius * bulge;
      var cx = knot.x + dist * Math.cos(angle + sweep);
      var cy = knot.y + dist * Math.sin(angle + sweep) * 0.86;
      var pinch = u < 0.1 ? u / 0.1 : u > 0.9 ? (1 - u) / 0.1 : 1;
      out.push({
        x: lerp(knot.x, cx, pinch),
        y: lerp(knot.y, cy, pinch),
        z: zBase + zSwing * Math.sin(u * Math.PI * 2.05),
        color: color,
      });
    }
    return out;
  }

  /** Chair-like hexose ring in 3D */
  function hexoseRing(cx, cy, cz, color, ringScale) {
    ringScale = ringScale || 1;
    var r = 22 * ringScale;
    var beads = [
      { x: cx + r, y: cy, z: cz + 6 },
      { x: cx + r * 0.5, y: cy - r * 0.75, z: cz - 4 },
      { x: cx - r * 0.5, y: cy - r * 0.75, z: cz + 5 },
      { x: cx - r, y: cy, z: cz - 3 },
      { x: cx - r * 0.5, y: cy + r * 0.75, z: cz + 6 },
      { x: cx + r * 0.5, y: cy + r * 0.75, z: cz - 5 },
    ];
    return beads.map(function (b) {
      return { x: b.x, y: b.y, z: b.z, color: color };
    });
  }

  function ringLinks(n, offset) {
    offset = offset || 0;
    var links = [];
    for (var i = 0; i < n; i++) {
      links.push([offset + i, offset + ((i + 1) % n)]);
    }
    return links;
  }

  function chainLinks(count, offset) {
    offset = offset || 0;
    var links = [];
    for (var i = 0; i < count - 1; i++) {
      links.push([offset + i, offset + i + 1]);
    }
    return links;
  }

  function buildGlucose() {
    var beads = hexoseRing(0, 0, 0, SEG.glucose, 1);
    beads.push({ x: 34, y: -8, z: 8, color: SEG.glucose });
    return { beads: beads, links: ringLinks(6).concat([[0, 6]]) };
  }

  function buildFructose() {
    var beads = hexoseRing(0, 0, 0, SEG.fructose, 0.95);
    beads[1].x += 4;
    beads[4].z += 3;
    beads.push({ x: -30, y: 6, z: -6, color: SEG.fructose });
    return { beads: beads, links: ringLinks(6).concat([[3, 6]]) };
  }

  function buildGalactose() {
    var beads = hexoseRing(0, 0, 0, SEG.galactose, 1);
    beads.push({ x: -34, y: 10, z: 6, color: SEG.galactose });
    return { beads: beads, links: ringLinks(6).concat([[4, 6]]) };
  }

  function buildMaltose() {
    var left = hexoseRing(-38, 0, 4, SEG.glucose, 0.88);
    var right = hexoseRing(38, 0, -4, SEG.glucose, 0.88);
    var beads = left.concat(right);
    return {
      beads: beads,
      links: ringLinks(6, 0).concat(ringLinks(6, 6)).concat([[0, 6]]),
    };
  }

  function buildSucrose() {
    var left = hexoseRing(-38, 0, 4, SEG.glucose, 0.88);
    var right = hexoseRing(38, 0, -4, SEG.fructose, 0.88);
    var beads = left.concat(right);
    return {
      beads: beads,
      links: ringLinks(6, 0).concat(ringLinks(6, 6)).concat([[1, 6]]),
    };
  }

  function buildLactose() {
    var left = hexoseRing(-38, 0, 4, SEG.glucose, 0.88);
    var right = hexoseRing(38, 0, -4, SEG.galactose, 0.88);
    var beads = left.concat(right);
    return {
      beads: beads,
      links: ringLinks(6, 0).concat(ringLinks(6, 6)).concat([[4, 6]]),
    };
  }

  function buildStarch() {
    var beads = [];
    var links = [];
    var colors = [SEG.starch, "#f0d890", "#e8c878", SEG.yellow, SEG.starch];
    var main = [
      { x: -90, y: 0, z: 0 },
      { x: -60, y: 8, z: 4 },
      { x: -30, y: -4, z: -3 },
      { x: 0, y: 6, z: 5 },
      { x: 30, y: -6, z: -4 },
      { x: 60, y: 4, z: 3 },
      { x: 90, y: -2, z: -2 },
    ];
    main.forEach(function (p, i) {
      beads.push({ x: p.x, y: p.y, z: p.z, color: colors[i % colors.length] });
      if (i > 0) links.push([i - 1, i]);
    });
    var branch = [
      { x: 0, y: -28, z: 8 },
      { x: 18, y: -42, z: 4 },
      { x: -12, y: -48, z: -2 },
    ];
    var base = 3;
    branch.forEach(function (p, i) {
      beads.push({ x: p.x, y: p.y, z: p.z, color: SEG.starch });
      if (i === 0) links.push([base, beads.length - 1]);
      else links.push([beads.length - 2, beads.length - 1]);
    });
    return { beads: beads, links: links };
  }

  function buildProtein() {
    var knot = { x: 0, y: -4, z: 6 };
    var raw = []
      .concat(petalLoop(knot, -2.45, 56, 18, 14, SEG.pink, 9))
      .concat(petalLoop(knot, -0.75, 54, -14, 13, SEG.blue, 9))
      .concat(petalLoop(knot, 0.55, 52, 16, 12, SEG.purple, 9))
      .concat(petalLoop(knot, 2.05, 54, -15, 14, SEG.green, 9))
      .concat(petalLoop(knot, 3.55, 42, 9, 10, SEG.yellow, 8));
    var tailFrom = { x: 14, y: 10, z: -4 };
    for (var t = 0; t <= 7; t++) {
      var u = t / 7;
      raw.push({
        x: lerp(tailFrom.x, 64, u) + Math.sin(u * 2.4) * 2,
        y: lerp(tailFrom.y, 50, u) + Math.sin(u * Math.PI) * 4,
        z: lerp(tailFrom.z, -18, u),
        color: SEG.teal,
      });
    }
    var beads = resamplePath(raw, SAMPLES);
    var links = chainLinks(beads.length);
    return { beads: beads, links: links };
  }

  function buildPeptide() {
    var palette = [SEG.pink, SEG.blue, SEG.purple, SEG.green, SEG.yellow];
    var beads = [];
    for (var i = 0; i < 5; i++) {
      beads.push({
        x: -48 + i * 24,
        y: Math.sin(i * 0.9) * 12,
        z: Math.cos(i * 1.1) * 8,
        color: palette[i],
      });
    }
    return { beads: beads, links: chainLinks(beads.length) };
  }

  function buildGlycerol() {
    var beads = [
      { x: 0, y: 0, z: 8, color: SEG.glycerol },
      { x: -16, y: 14, z: -4, color: SEG.glycerol },
      { x: 16, y: 14, z: -4, color: SEG.glycerol },
    ];
    return {
      beads: beads,
      links: [[0, 1], [0, 2], [1, 2]],
    };
  }

  function buildFattyAcid() {
    var beads = [];
    for (var i = 0; i < 9; i++) {
      beads.push({
        x: -72 + i * 18,
        y: (i % 2 === 0 ? -10 : 10),
        z: Math.sin(i * 0.7) * 6,
        color: SEG.lipid,
      });
    }
    return { beads: beads, links: chainLinks(beads.length) };
  }

  function buildLipid() {
    var beads = [
      { x: 0, y: 0, z: 10, color: SEG.glycerol },
      { x: -14, y: 16, z: -2, color: SEG.glycerol },
      { x: 14, y: 16, z: -2, color: SEG.glycerol },
    ];
    var links = [[0, 1], [0, 2], [1, 2]];
    var tails = [
      { ox: -14, oy: 16, oz: -2, angle: -2.4 },
      { ox: 14, oy: 16, oz: -2, angle: -0.8 },
      { ox: 0, oy: -18, oz: 4, angle: 1.6 },
    ];
    tails.forEach(function (tail) {
      var start = beads.length;
      for (var i = 0; i < 6; i++) {
        beads.push({
          x: tail.ox + Math.cos(tail.angle) * (14 + i * 16),
          y: tail.oy + Math.sin(tail.angle) * (14 + i * 16) * 0.7,
          z: tail.oz + Math.sin(i * 0.5) * 4,
          color: SEG.lipid,
        });
        if (i === 0) {
          links.push([tail.ox === -14 ? 1 : tail.ox === 14 ? 2 : 0, start]);
        } else {
          links.push([start + i - 1, start + i]);
        }
      }
    });
    return { beads: beads, links: links };
  }

  var BUILDERS = {
    glucose: buildGlucose,
    fructose: buildFructose,
    galactose: buildGalactose,
    maltose: buildMaltose,
    sucrose: buildSucrose,
    lactose: buildLactose,
    starch: buildStarch,
    protein: buildProtein,
    peptide: buildPeptide,
    glycerol: buildGlycerol,
    "fatty-acid": buildFattyAcid,
    lipid: buildLipid,
  };

  function getMoleculeModel(type) {
    var builder = BUILDERS[type];
    if (!builder) return { beads: [], links: [] };
    return builder();
  }

  function renderSceneSvg(model, options) {
    options = options || {};
    var ox = options.offsetX || 0;
    var oy = options.offsetY || 0;
    var scale = options.scale != null ? options.scale : PROJ_SCALE;
    var beadR = options.beadRadius != null ? options.beadRadius : 8.5;
    var gloss = options.gloss != null ? options.gloss : 0.85;
    var linkW = options.linkWidth != null ? options.linkWidth : 3.4;

    var beads = model.beads;
    var links = model.links;
    var items = [];

    links.forEach(function (pair) {
      var a = beads[pair[0]];
      var b = beads[pair[1]];
      if (!a || !b) return;
      var prA = project(a, ox, oy, scale);
      var prB = project(b, ox, oy, scale);
      var midZ = (a.z + b.z) * 0.5;
      items.push({
        z: midZ,
        html: linkMarkup(prA, prB, linkW * (prA.f + prB.f) * 0.5),
      });
    });

    beads.forEach(function (pt) {
      var pr = project(pt, ox, oy, scale);
      var r = beadR * pr.f;
      items.push({
        z: pt.z - 0.01,
        html: beadMarkup(pr, r, pt.color, gloss, 1),
      });
    });

    items.sort(function (a, b) { return a.z - b.z; });
    return items.map(function (it) { return it.html; }).join("");
  }

  function renderMoleculeSvg(type, options) {
    options = options || {};
    var w = options.width || W;
    var h = options.height || H;
    var bg = options.background !== false
      ? '<rect width="' + w + '" height="' + h + '" fill="#ffffff"/>'
      : "";
    var model = getMoleculeModel(type);
    var scene = renderSceneSvg(model, options);

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + type + ' ball-and-stick model">' +
      bg + scene + "</svg>"
    );
  }

  var CX = W * 0.5;
  var CY = H * 0.5;
  var REFERENCE_MODEL_TYPE = "protein";
  var _refSpan = null;
  var _fitScaleCache = {};

  function modelProjectedBounds(model, options) {
    options = options || {};
    var scale = options.scale != null ? options.scale : PROJ_SCALE;
    var beadR = options.beadRadius != null ? options.beadRadius : 8.5;
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
    if (!model.beads.length) {
      return { minX: CX, maxX: CX, minY: CY, maxY: CY, width: 0, height: 0, span: 0, cx: CX, cy: CY };
    }
    model.beads.forEach(function (pt) {
      var pr = project(pt, 0, 0, scale);
      var r = beadR * pr.f;
      minX = Math.min(minX, pr.x - r);
      maxX = Math.max(maxX, pr.x + r);
      minY = Math.min(minY, pr.y - r);
      maxY = Math.max(maxY, pr.y + r);
    });
    return {
      minX: minX,
      maxX: maxX,
      minY: minY,
      maxY: maxY,
      width: maxX - minX,
      height: maxY - minY,
      span: Math.max(maxX - minX, maxY - minY),
      cx: (minX + maxX) * 0.5,
      cy: (minY + maxY) * 0.5,
    };
  }

  function getReferenceSpan(options) {
    if (_refSpan != null) return _refSpan;
    var model = getMoleculeModel(REFERENCE_MODEL_TYPE);
    _refSpan = modelProjectedBounds(model, options).span;
    if (_refSpan <= 0) _refSpan = 120;
    return _refSpan;
  }

  function getModelFitScale(type, options) {
    options = options || {};
    var key =
      type +
      "|" +
      (options.beadRadius != null ? options.beadRadius : 8.5) +
      "|" +
      (options.scale != null ? options.scale : PROJ_SCALE);
    if (_fitScaleCache[key] != null) return _fitScaleCache[key];
    var model = getMoleculeModel(type);
    var span = modelProjectedBounds(model, options).span;
    var ref = getReferenceSpan(options);
    var fit = span > 0 ? ref / span : 1;
    _fitScaleCache[key] = fit;
    return fit;
  }

  /** Embed ball-and-stick scene centred at (cx, cy) inside a parent SVG */
  function renderMoleculeEmbed(type, cx, cy, options) {
    options = options || {};
    var embedScale = options.embedScale != null ? options.embedScale : 0.3;
    var op = options.opacity != null ? options.opacity : 1;
    var model = getMoleculeModel(type);
    if (!model.beads.length) return "";
    var renderOpts = {
      scale: options.scale != null ? options.scale : PROJ_SCALE,
      beadRadius: options.beadRadius != null ? options.beadRadius : 8.5,
      gloss: options.gloss,
      linkWidth: options.linkWidth,
    };
    var bounds = modelProjectedBounds(model, renderOpts);
    var fitScale = options.fitScale;
    if (fitScale == null && options.autoFit !== false) {
      fitScale = getModelFitScale(type, renderOpts);
    }
    fitScale = fitScale != null ? fitScale : 1;
    var totalScale = embedScale * fitScale;
    var pivotX = options.autoFit !== false ? bounds.cx : CX;
    var pivotY = options.autoFit !== false ? bounds.cy : CY;
    var inner = renderSceneSvg(model, renderOpts);
    var label = "";
    if (options.label) {
      var dy = options.labelDy != null ? options.labelDy : 48;
      var fs = options.labelSize != null ? options.labelSize : 8;
      var lc = options.labelColor || "#2a3340";
      var lop = options.labelOpacity != null ? options.labelOpacity : op;
      label =
        '<text x="' + cx + '" y="' + (cy + dy) + '" text-anchor="middle" font-size="' + fs +
        '" fill="' + lc + '" font-weight="600" opacity="' + lop.toFixed(2) + '">' + options.label + "</text>";
    }
    return (
      '<g transform="translate(' + cx + "," + cy + ") scale(" + totalScale + ") translate(" + (-pivotX) + "," + (-pivotY) +
      ')" opacity="' + op.toFixed(2) + '">' + inner + "</g>" + label
    );
  }

  global.MoleculeBallStick = {
    W: W,
    H: H,
    CX: CX,
    CY: CY,
    PROJ_SCALE: PROJ_SCALE,
    PROJ_PERSP: PROJ_PERSP,
    SEG: SEG,
    getMoleculeModel: getMoleculeModel,
    renderSceneSvg: renderSceneSvg,
    renderMoleculeSvg: renderMoleculeSvg,
    renderMoleculeEmbed: renderMoleculeEmbed,
    modelProjectedBounds: modelProjectedBounds,
    getModelFitScale: getModelFitScale,
    getReferenceSpan: getReferenceSpan,
    REFERENCE_MODEL_TYPE: REFERENCE_MODEL_TYPE,
    project: project,
    beadMarkup: beadMarkup,
    linkMarkup: linkMarkup,
  };
})(typeof window !== "undefined" ? window : globalThis);
