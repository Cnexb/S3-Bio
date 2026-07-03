/**
 * Protein folding — wavy unfolded chain morphs into a 3D rosette (beads on string).
 * No labels during animation.
 */
(function (global) {
  "use strict";

  var SAMPLES = 54;
  var DURATION = 5400;
  var HOLD_MS = 800;
  var W = 520;
  var H = 280;

  var BEADS_UNFOLD = 17;

  /** Pastel sequence matching reference unfolded chain */
  var UNFOLD_COLORS = [
    "#b8e6a8", "#f5bcd0", "#98dede", "#aad4f5", "#f5bcd0", "#f5e6a8", "#b8e6a8",
    "#c8b8e8", "#f5bcd0", "#98dede", "#aad4f5", "#c8b8e8", "#f5e6a8", "#b8e6a8",
    "#f5bcd0", "#aad4f5", "#c8b8e8",
  ];

  var SEG = {
    pink: "#f5bcd0",
    blue: "#aad4f5",
    purple: "#c8b8e8",
    green: "#b8e6a8",
    yellow: "#f5e6a8",
    tail: "#98dede",
  };

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function lerp3(a, b, t) {
    return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) };
  }
  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /** Build one petal loop: centre → arc → centre */
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

  /** Hand-tuned rosette path matching reference layout */
  function buildFoldedPath() {
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
        color: SEG.tail,
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  /** Compact globular pepsin — ball-and-stick / ribbon folded states */
  function buildPepsinFoldedPath() {
    var core = { x: 0, y: 2, z: 12 };
    var raw = [];
    var lobes = [
      { a: -2.55, r: 36, zb: 24, zs: 13, c: "#aad4f5" },
      { a: -1.35, r: 34, zb: -18, zs: 12, c: "#f5bcd0" },
      { a: -0.15, r: 38, zb: 20, zs: 14, c: "#b8e6a8" },
      { a: 1.05, r: 35, zb: -16, zs: 11, c: "#c8b8e8" },
      { a: 2.35, r: 37, zb: 22, zs: 13, c: "#f5e6a8" },
      { a: 3.65, r: 32, zb: -12, zs: 10, c: "#98dede" },
    ];
    var li;
    for (li = 0; li < lobes.length; li++) {
      var L = lobes[li];
      raw = raw.concat(petalLoop(core, L.a, L.r, L.zb, L.zs, L.c, 8));
    }
    var bridges = [
      { a: -1.85, c: "#9ec8ef" },
      { a: 0.55, c: "#c8a8e8" },
      { a: 2.75, c: "#98ddb8" },
    ];
    for (li = 0; li < bridges.length; li++) {
      var ba = bridges[li].a;
      for (var t = 0; t <= 6; t++) {
        var u = t / 6;
        raw.push({
          x: core.x + Math.cos(ba + u * 0.9) * 30 * Math.sin(u * Math.PI),
          y: core.y + Math.sin(ba + u * 0.9) * 26 * Math.sin(u * Math.PI),
          z: core.z + Math.cos(u * Math.PI) * 16 - 10,
          color: bridges[li].c,
        });
      }
    }
    return resamplePath(raw, SAMPLES);
  }

  function buildPepsinUnfoldedPath() {
    var raw = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      var t = i / (BEADS_UNFOLD - 1);
      raw.push({
        x: -148 + t * 296 + Math.sin(t * 9.2) * 28 + Math.cos(t * 4.5) * 10,
        y: Math.sin(t * Math.PI * 3.1) * 44 + Math.cos(t * 6.8) * 14,
        z: Math.sin(t * Math.PI * 2.4) * 10 + Math.cos(t * 5.2) * 4,
        color: UNFOLD_COLORS[i],
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  function ringSegment(startA, endA, radius, zBase, zAmp, color, steps, bulge) {
    var out = [];
    for (var i = 0; i <= steps; i++) {
      var u = i / steps;
      var a = lerp(startA, endA, u);
      var wobble = Math.sin(u * Math.PI) * (bulge || 10);
      var r = radius + wobble;
      out.push({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r * 0.84,
        z: zBase + zAmp * Math.sin(u * Math.PI * 1.8),
        color: color,
      });
    }
    return out;
  }

  /** Ring-shaped pancreatic amylase — donut fold with central catalytic groove */
  function buildPancreaticAmylaseFoldedPath() {
    var raw = [];
    raw = raw.concat(
      ringSegment(-Math.PI * 0.95, -Math.PI * 0.42, 54, 20, 13, "#aad4f5", 11, 12)
    );
    raw = raw.concat(
      ringSegment(-Math.PI * 0.38, -Math.PI * 0.02, 52, -15, 12, "#f5bcd0", 10, 11)
    );
    raw = raw.concat(
      ringSegment(0.02, Math.PI * 0.42, 50, 17, 14, "#b8e6a8", 10, 10)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.46, Math.PI * 0.82, 48, -17, 11, "#c8b8e8", 9, 9)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.86, Math.PI * 1.32, 52, 13, 12, "#f5e6a8", 10, 10)
    );

    var spokes = [
      { a: -2.15, c: "#9ec8ef" },
      { a: -0.55, c: "#e8b8d0" },
      { a: 1.05, c: "#98ddb8" },
      { a: 2.45, c: "#b8a8d8" },
    ];
    var si;
    for (si = 0; si < spokes.length; si++) {
      var sa = spokes[si].a;
      for (var t = 0; t <= 5; t++) {
        var u = t / 5;
        var r = lerp(36, 56, u);
        raw.push({
          x: Math.cos(sa) * r,
          y: Math.sin(sa) * r * 0.84,
          z: 6 + Math.sin(u * Math.PI) * 16,
          color: spokes[si].c,
        });
      }
    }
    return resamplePath(raw, SAMPLES);
  }

  function buildPancreaticAmylaseUnfoldedPath() {
    var raw = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      var t = i / (BEADS_UNFOLD - 1);
      raw.push({
        x: -152 + t * 304 + Math.sin(t * 7.5) * 32 + Math.cos(t * 3.8) * 12,
        y: Math.sin(t * Math.PI * 2.6) * 46 + Math.cos(t * 5.5) * 16,
        z: Math.sin(t * Math.PI * 2.8) * 11 + Math.cos(t * 4.2) * 5,
        color: UNFOLD_COLORS[i],
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  /** Pancreatic lipase — five-domain globule with central binding groove (ref. low / optimum / denatured) */
  function buildPancreaticLipaseFoldedPath() {
    var core = { x: 0, y: 0, z: 10 };
    var raw = [];
    var lobes = [
      { a: -2.35, r: 50, zb: 24, zs: 15, c: "#7eb0e8" },
      { a: -0.75, r: 48, zb: 22, zs: 14, c: "#f5bcd0" },
      { a: 0.85, r: 46, zb: -20, zs: 13, c: "#b8e6a8" },
      { a: 2.35, r: 44, zb: -18, zs: 12, c: "#f5e6a8" },
      { a: 3.85, r: 47, zb: 20, zs: 13, c: "#c8b8e8" },
    ];
    var li;
    for (li = 0; li < lobes.length; li++) {
      var L = lobes[li];
      raw = raw.concat(petalLoop(core, L.a, L.r, L.zb, L.zs, L.c, 9));
    }
    var inner = [
      { a: -1.55, c: "#9ec8ef" },
      { a: 0.15, c: "#e8b8d0" },
      { a: 1.85, c: "#98ddb8" },
      { a: 3.15, c: "#b8a8d8" },
    ];
    for (li = 0; li < inner.length; li++) {
      var ia = inner[li].a;
      for (var t = 0; t <= 6; t++) {
        var u = t / 6;
        var r = lerp(14, 34, u);
        raw.push({
          x: Math.cos(ia) * r,
          y: Math.sin(ia) * r * 0.86,
          z: 8 + Math.sin(u * Math.PI) * 12,
          color: inner[li].c,
        });
      }
    }
    return resamplePath(raw, SAMPLES);
  }

  function buildPancreaticLipaseUnfoldedPath() {
    var raw = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      var t = i / (BEADS_UNFOLD - 1);
      raw.push({
        x:
          -150 +
          t * 300 +
          Math.sin(t * 12.5) * 58 +
          Math.cos(t * 6.8) * 24 +
          Math.sin(t * 19) * 12,
        y:
          Math.sin(t * Math.PI * 4.8) * 54 +
          Math.cos(t * 8.2) * 30 +
          Math.sin(t * 15) * 10,
        z:
          Math.sin(t * Math.PI * 3.6) * 20 +
          Math.cos(t * 5.8) * 9 +
          Math.sin(t * 11) * 6,
        color: UNFOLD_COLORS[i],
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  /** Protease — ring-shaped globule with hollow centre / active site (ref. low / optimum / denatured) */
  function buildProteaseFoldedPath() {
    var raw = [];
    raw = raw.concat(
      ringSegment(-Math.PI, -Math.PI * 0.62, 56, 24, 15, "#7eb0e8", 10, 10)
    );
    raw = raw.concat(
      ringSegment(-Math.PI * 0.58, -Math.PI * 0.2, 55, 22, 14, "#f5bcd0", 9, 10)
    );
    raw = raw.concat(
      ringSegment(-Math.PI * 0.16, Math.PI * 0.24, 54, -20, 13, "#5a82d4", 9, 9)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.28, Math.PI * 0.6, 53, -18, 12, "#b8e878", 8, 9)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.64, Math.PI * 0.95, 55, 20, 13, "#c8b8e8", 9, 10)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.98, Math.PI * 1.34, 52, 18, 12, "#f5e6a8", 8, 9)
    );

    var bridges = [
      { a: -2.05, r0: 48, r1: 56, c: "#9ec8ef" },
      { a: -0.35, r0: 47, r1: 55, c: "#e8b8d0" },
      { a: 1.25, r0: 46, r1: 54, c: "#6888c8" },
      { a: 2.75, r0: 47, r1: 55, c: "#98ddb8" },
    ];
    var bi;
    for (bi = 0; bi < bridges.length; bi++) {
      var b = bridges[bi];
      for (var t = 0; t <= 5; t++) {
        var u = t / 5;
        var r = lerp(b.r0, b.r1, u);
        raw.push({
          x: Math.cos(b.a) * r,
          y: Math.sin(b.a) * r * 0.86,
          z: 10 + Math.sin(u * Math.PI) * 14,
          color: b.c,
        });
      }
    }
    return resamplePath(raw, SAMPLES);
  }

  function buildProteaseUnfoldedPath() {
    var raw = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      var t = i / (BEADS_UNFOLD - 1);
      var cluster = Math.floor(t * 5);
      var local = t * 5 - cluster;
      raw.push({
        x:
          -155 +
          cluster * 62 +
          local * 48 +
          Math.sin(t * 14.5) * 52 +
          Math.cos(t * 7.2) * 26,
        y:
          Math.sin(t * Math.PI * 5.2) * 58 +
          Math.cos(t * 9.5) * 34 +
          Math.sin(cluster * 2.1 + t * 8) * 14,
        z:
          Math.sin(t * Math.PI * 4.1) * 22 +
          Math.cos(t * 6.2) * 11 +
          Math.sin(t * 13) * 8,
        color: UNFOLD_COLORS[i],
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  /** Maltase — dense globular fold with central bowl-shaped active site */
  function buildMaltaseFoldedPath() {
    var core = { x: 0, y: 0, z: 11 };
    var raw = [];
    var lobes = [
      { a: -2.45, r: 51, zb: 26, zs: 16, c: "#7eb0e8" },
      { a: -0.7, r: 49, zb: 24, zs: 15, c: "#f5bcd0" },
      { a: 0.9, r: 47, zb: -21, zs: 14, c: "#b8e878" },
      { a: 2.35, r: 45, zb: -19, zs: 13, c: "#f5e6a8" },
      { a: 3.85, r: 48, zb: 22, zs: 14, c: "#c8b8e8" },
    ];
    var li;
    for (li = 0; li < lobes.length; li++) {
      var L = lobes[li];
      raw = raw.concat(petalLoop(core, L.a, L.r, L.zb, L.zs, L.c, 9));
    }
    raw = raw.concat(
      ringSegment(-Math.PI * 0.92, -Math.PI * 0.38, 50, 22, 14, "#9ec8ef", 9, 9)
    );
    raw = raw.concat(
      ringSegment(-Math.PI * 0.34, Math.PI * 0.08, 48, -18, 13, "#e8b8d0", 8, 8)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.12, Math.PI * 0.58, 47, 20, 13, "#98ddb8", 8, 8)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.62, Math.PI * 1.05, 49, 18, 12, "#b8a8d8", 8, 8)
    );
    var inner = [
      { a: -1.6, c: "#8ec0ef" },
      { a: 0.2, c: "#d8b8e8" },
      { a: 1.95, c: "#88d8b0" },
      { a: 3.25, c: "#a8c8f0" },
    ];
    for (li = 0; li < inner.length; li++) {
      var ia = inner[li].a;
      for (var t = 0; t <= 6; t++) {
        var u = t / 6;
        var r = lerp(18, 38, u);
        raw.push({
          x: Math.cos(ia) * r,
          y: Math.sin(ia) * r * 0.86,
          z: 9 + Math.sin(u * Math.PI) * 13,
          color: inner[li].c,
        });
      }
    }
    return resamplePath(raw, SAMPLES);
  }

  function buildMaltaseUnfoldedPath() {
    var raw = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      var t = i / (BEADS_UNFOLD - 1);
      var cluster = Math.floor(t * 6);
      var local = t * 6 - cluster;
      raw.push({
        x:
          -160 +
          cluster * 54 +
          local * 42 +
          Math.sin(t * 15.5) * 60 +
          Math.cos(t * 8.5) * 28,
        y:
          Math.sin(t * Math.PI * 5.5) * 60 +
          Math.cos(t * 10.2) * 36 +
          Math.sin(cluster * 2.4 + t * 9) * 16,
        z:
          Math.sin(t * Math.PI * 4.5) * 24 +
          Math.cos(t * 7.5) * 12 +
          Math.sin(t * 14) * 9,
        color: UNFOLD_COLORS[i],
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  /** Sucrase — ring-shaped fold with five colour domains and central active site */
  function buildSucraseFoldedPath() {
    var raw = [];
    raw = raw.concat(
      ringSegment(-Math.PI * 0.82, -Math.PI * 0.32, 53, 22, 14, "#aad4f5", 10, 11)
    );
    raw = raw.concat(
      ringSegment(-Math.PI * 0.28, 0.08, 51, 20, 13, "#f5bcd0", 10, 10)
    );
    raw = raw.concat(
      ringSegment(0.12, Math.PI * 0.5, 50, -17, 12, "#f5e6a8", 9, 9)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.54, Math.PI * 0.98, 49, -19, 11, "#c8b8e8", 9, 9)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 1.02, Math.PI * 1.42, 51, 18, 13, "#b8e878", 9, 10)
    );

    var spokes = [
      { a: -2.05, c: "#9ec8ef" },
      { a: -0.45, c: "#e8b8d0" },
      { a: 1.15, c: "#f0d878" },
      { a: 2.55, c: "#b8a8d8" },
      { a: 3.85, c: "#98ddb8" },
    ];
    var si;
    for (si = 0; si < spokes.length; si++) {
      var sa = spokes[si].a;
      for (var t = 0; t <= 5; t++) {
        var u = t / 5;
        var r = lerp(34, 54, u);
        raw.push({
          x: Math.cos(sa) * r,
          y: Math.sin(sa) * r * 0.84,
          z: 7 + Math.sin(u * Math.PI) * 15,
          color: spokes[si].c,
        });
      }
    }
    return resamplePath(raw, SAMPLES);
  }

  function buildSucraseUnfoldedPath() {
    var raw = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      var t = i / (BEADS_UNFOLD - 1);
      var strand = Math.floor(t * 7);
      var local = t * 7 - strand;
      raw.push({
        x:
          -168 +
          strand * 46 +
          local * 36 +
          Math.sin(t * 18 + strand * 1.3) * 68 +
          Math.cos(t * 9.5) * 32,
        y:
          Math.sin(t * Math.PI * 6.4 + strand * 1.1) * 64 +
          Math.cos(t * 11.5) * 40 +
          Math.sin(t * 16 + strand) * 14,
        z:
          Math.sin(t * Math.PI * 5.2) * 26 +
          Math.cos(t * 8.8 + strand) * 14 +
          Math.sin(t * 15) * 10,
        color: UNFOLD_COLORS[i],
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  /** Lactase — dense globular fold with central bowl-shaped active site (ref. low / optimum / denatured) */
  function buildLactaseFoldedPath() {
    var core = { x: 0, y: 0, z: 11 };
    var raw = [];
    var lobes = [
      { a: -2.48, r: 52, zb: 28, zs: 17, c: "#7eb0e8" },
      { a: -0.62, r: 50, zb: 26, zs: 16, c: "#f5bcd0" },
      { a: 0.92, r: 48, zb: -22, zs: 15, c: "#c8b8e8" },
      { a: 2.38, r: 46, zb: -20, zs: 14, c: "#b8e878" },
      { a: 3.92, r: 49, zb: 24, zs: 15, c: "#f5e6a8" },
    ];
    var li;
    for (li = 0; li < lobes.length; li++) {
      var L = lobes[li];
      raw = raw.concat(petalLoop(core, L.a, L.r, L.zb, L.zs, L.c, 9));
    }
    raw = raw.concat(
      ringSegment(-Math.PI * 0.9, -Math.PI * 0.35, 51, 24, 15, "#9ec8ef", 9, 10)
    );
    raw = raw.concat(
      ringSegment(-Math.PI * 0.3, Math.PI * 0.06, 49, -19, 14, "#e8b8d0", 8, 9)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.1, Math.PI * 0.55, 48, 21, 13, "#b8a8d8", 8, 8)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 0.58, Math.PI * 1.02, 50, 19, 13, "#98ddb8", 8, 9)
    );
    raw = raw.concat(
      ringSegment(Math.PI * 1.06, Math.PI * 1.48, 47, 17, 12, "#f0d878", 8, 8)
    );
    var inner = [
      { a: -1.65, c: "#8ec0ef" },
      { a: 0.05, c: "#d8b8e8" },
      { a: 1.55, c: "#88d8b0" },
      { a: 2.85, c: "#a8c8f0" },
      { a: 4.05, c: "#f5e6a8" },
    ];
    for (li = 0; li < inner.length; li++) {
      var ia = inner[li].a;
      for (var t = 0; t <= 6; t++) {
        var u = t / 6;
        var r = lerp(22, 40, u);
        raw.push({
          x: Math.cos(ia) * r,
          y: Math.sin(ia) * r * 0.86,
          z: 9 + Math.sin(u * Math.PI) * 14,
          color: inner[li].c,
        });
      }
    }
    for (var yi = 0; yi <= 4; yi++) {
      var yu = yi / 4;
      var yr = lerp(26, 34, yu);
      raw.push({
        x: Math.cos(0.18) * yr,
        y: Math.sin(0.18) * yr * 0.86,
        z: 11 + Math.sin(yu * Math.PI) * 8,
        color: "#f5e6a8",
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  function buildLactaseUnfoldedPath() {
    var raw = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      var t = i / (BEADS_UNFOLD - 1);
      var strand = Math.floor(t * 8);
      var local = t * 8 - strand;
      raw.push({
        x:
          -175 +
          strand * 42 +
          local * 34 +
          Math.sin(t * 20 + strand * 1.35) * 74 +
          Math.cos(t * 10.5) * 36,
        y:
          Math.sin(t * Math.PI * 6.8 + strand * 0.95) * 68 +
          Math.cos(t * 12.5) * 42 +
          Math.sin(t * 18 + strand * 1.2) * 18,
        z:
          Math.sin(t * Math.PI * 5.0) * 26 +
          Math.cos(t * 8.2 + strand) * 14 +
          Math.sin(t * 16) * 10,
        color: UNFOLD_COLORS[i],
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  function buildUnfoldedPath() {
    var raw = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      var t = i / (BEADS_UNFOLD - 1);
      raw.push({
        x: -158 + t * 316,
        y: Math.sin(t * Math.PI * 1.72 - 0.22) * 42,
        z: Math.sin(t * Math.PI * 1.35) * 3,
        color: UNFOLD_COLORS[i],
      });
    }
    return resamplePath(raw, SAMPLES);
  }

  function introBeadIndices() {
    var idx = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      idx.push(Math.round(i * (SAMPLES - 1) / (BEADS_UNFOLD - 1)));
    }
    return idx;
  }

  var INTRO_INDICES = introBeadIndices();
  var SPLIT_START = 0.4;
  var SPLIT_END = 0.42;
  var DENSE_START = 0.42;
  var DENSE_END = 0.48;

  function buildExpandIndices() {
    var idx = [];
    for (var i = 0; i < BEADS_UNFOLD - 1; i++) {
      idx.push(INTRO_INDICES[i]);
      idx.push(Math.round((INTRO_INDICES[i] + INTRO_INDICES[i + 1]) / 2));
    }
    idx.push(INTRO_INDICES[BEADS_UNFOLD - 1]);
    idx.push(Math.min(INTRO_INDICES[BEADS_UNFOLD - 1] + 2, SAMPLES - 1));
    return idx;
  }

  var EXPAND_INDICES = buildExpandIndices();
  var ALL_INDICES = (function () {
    var a = [];
    for (var i = 0; i < SAMPLES; i++) a.push(i);
    return a;
  })();

  function resamplePath(raw, n) {
    if (raw.length === 0) return [];
    if (raw.length === 1) {
      var one = raw[0];
      var dup = [];
      for (var d = 0; d < n; d++) dup.push({ x: one.x, y: one.y, z: one.z, color: one.color });
      return dup;
    }
    var lens = [0];
    for (var i = 1; i < raw.length; i++) {
      var dx = raw[i].x - raw[i - 1].x;
      var dy = raw[i].y - raw[i - 1].y;
      var dz = raw[i].z - raw[i - 1].z;
      lens.push(lens[i - 1] + Math.sqrt(dx * dx + dy * dy + dz * dz));
    }
    var total = lens[lens.length - 1];
    var out = [];
    for (var j = 0; j < n; j++) {
      var target = (j / (n - 1)) * total;
      var k = 0;
      while (k < lens.length - 2 && lens[k + 1] < target) k++;
      var segLen = lens[k + 1] - lens[k] || 1;
      var f = clamp((target - lens[k]) / segLen, 0, 1);
      var a = raw[k];
      var b = raw[k + 1];
      out.push({
        x: lerp(a.x, b.x, f),
        y: lerp(a.y, b.y, f),
        z: lerp(a.z, b.z, f),
        color: f < 0.5 ? a.color : b.color,
      });
    }
    return out;
  }

  var FOLDED = buildFoldedPath();
  var UNFOLDED = buildUnfoldedPath();
  var PEPSIN_FOLDED = buildPepsinFoldedPath();
  var PEPSIN_UNFOLDED = buildPepsinUnfoldedPath();
  var PANCREATIC_FOLDED = buildPancreaticAmylaseFoldedPath();
  var PANCREATIC_UNFOLDED = buildPancreaticAmylaseUnfoldedPath();
  var LIPASE_FOLDED = buildPancreaticLipaseFoldedPath();
  var LIPASE_UNFOLDED = buildPancreaticLipaseUnfoldedPath();
  var PROTEASE_FOLDED = buildProteaseFoldedPath();
  var PROTEASE_UNFOLDED = buildProteaseUnfoldedPath();
  var MALTASE_FOLDED = buildMaltaseFoldedPath();
  var MALTASE_UNFOLDED = buildMaltaseUnfoldedPath();
  var SUCRASE_FOLDED = buildSucraseFoldedPath();
  var SUCRASE_UNFOLDED = buildSucraseUnfoldedPath();
  var LACTASE_FOLDED = buildLactaseFoldedPath();
  var LACTASE_UNFOLDED = buildLactaseUnfoldedPath();

  function isGlobularVariant(variant) {
    return (
      variant === "pepsin" ||
      variant === "pancreatic-amylase" ||
      variant === "pancreatic-lipase" ||
      variant === "protease" ||
      variant === "maltase" ||
      variant === "sucrase" ||
      variant === "lactase"
    );
  }

  function pathsForVariant(variant) {
    if (variant === "pepsin") {
      return { folded: PEPSIN_FOLDED, unfolded: PEPSIN_UNFOLDED };
    }
    if (variant === "pancreatic-amylase") {
      return { folded: PANCREATIC_FOLDED, unfolded: PANCREATIC_UNFOLDED };
    }
    if (variant === "pancreatic-lipase") {
      return { folded: LIPASE_FOLDED, unfolded: LIPASE_UNFOLDED };
    }
    if (variant === "protease") {
      return { folded: PROTEASE_FOLDED, unfolded: PROTEASE_UNFOLDED };
    }
    if (variant === "maltase") {
      return { folded: MALTASE_FOLDED, unfolded: MALTASE_UNFOLDED };
    }
    if (variant === "sucrase") {
      return { folded: SUCRASE_FOLDED, unfolded: SUCRASE_UNFOLDED };
    }
    if (variant === "lactase") {
      return { folded: LACTASE_FOLDED, unfolded: LACTASE_UNFOLDED };
    }
    return { folded: FOLDED, unfolded: UNFOLDED };
  }

  function chaosScaleForVariant(variant) {
    if (isGlobularVariant(variant)) return 1.14;
    return 1;
  }

  function chainAt(progress, variant) {
    var paths = pathsForVariant(variant);
    var folded = paths.folded;
    var unfolded = paths.unfolded;
    var e = easeInOut(clamp(progress, 0, 1));
    var pts = [];
    for (var i = 0; i < SAMPLES; i++) {
      var u = unfolded[i];
      var f = folded[i];
      var p = lerp3(u, f, e);
      if (e > 0.04 && e < 0.96) {
        var wobble = Math.sin(e * Math.PI) * Math.sin(i * 0.38 + e * 4.2) * 6 * (1 - e * 0.35);
        p.y += wobble;
        p.z += wobble * 0.35;
      }
      var col = e < 0.5 ? u.color : f.color;
      if (e >= 0.5 && e < 0.88) {
        col = e > 0.72 ? f.color : u.color;
      } else if (e >= 0.88) {
        col = f.color;
      }
      pts.push({ p3: p, color: col, idx: i });
    }
    return pts;
  }

  function splitT(rawP) {
    return clamp((rawP - SPLIT_START) / (SPLIT_END - SPLIT_START), 0, 1);
  }

  function denseT(rawP) {
    return clamp((rawP - DENSE_START) / (DENSE_END - DENSE_START), 0, 1);
  }

  /** 17 parent beads → 34 during 40–42% */
  function splitBeads(chain, st) {
    var out = [];
    for (var i = 0; i < BEADS_UNFOLD; i++) {
      var ci = INTRO_INDICES[i];
      var parent = chain[ci];
      var idxB = i < BEADS_UNFOLD - 1
        ? Math.round((INTRO_INDICES[i] + INTRO_INDICES[i + 1]) / 2)
        : Math.min(ci + 2, SAMPLES - 1);
      var targetA = chain[ci].p3;
      var targetB = chain[idxB].p3;
      var parentP = parent.p3;
      var ease = easeInOut(st);
      var pA = lerp3(parentP, targetA, ease);
      var pB = lerp3(parentP, targetB, ease);
      var rScale = lerp(1, 0.82, ease);
      if (st <= 0.001) {
        out.push({ p3: parentP, color: parent.color, scale: 1, ghost: 0 });
      } else {
        if (st < 1) {
          out.push({ p3: parentP, color: parent.color, scale: lerp(1, 0, ease), ghost: ease });
        }
        out.push({ p3: pA, color: parent.color, scale: rScale, ghost: 0 });
        out.push({ p3: pB, color: parent.color, scale: rScale, ghost: 0 });
      }
    }
    return out;
  }

  function indicesForProgress(rawP) {
    if (rawP < SPLIT_START) return INTRO_INDICES;
    if (rawP < SPLIT_END) return null;
    if (rawP >= DENSE_END) return ALL_INDICES;
    var dt = denseT(rawP);
    var need = Math.round(lerp(EXPAND_INDICES.length, SAMPLES, dt));
    var chosen = EXPAND_INDICES.slice();
    var set = {};
    var ci;
    for (ci = 0; ci < chosen.length; ci++) set[chosen[ci]] = true;
    for (ci = 0; ci < ALL_INDICES.length && chosen.length < need; ci++) {
      if (!set[ALL_INDICES[ci]]) {
        chosen.push(ALL_INDICES[ci]);
        set[ALL_INDICES[ci]] = true;
      }
    }
    chosen.sort(function (a, b) { return a - b; });
    return chosen;
  }

  function project(p) {
    var persp = 420;
    var f = persp / (persp + p.z);
    return {
      x: W * 0.5 + p.x * f * 0.82,
      y: H * 0.5 + p.y * f * 0.82,
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

  function linkMarkup(a, b, w, silverMix, strokeOverride) {
    var s = clamp(silverMix, 0, 1);
    var stroke =
      strokeOverride || (s > 0.04 ? "url(#prot-silver)" : "#141414");
    var sw = s > 0.04 ? lerp(w * 0.55, w, 1 - s) : w;
    return (
      '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) +
      '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) +
      '" stroke="' + stroke + '" stroke-width="' + sw.toFixed(1) +
      '" stroke-linecap="round" opacity="' + lerp(0.92, 1, 1 - s).toFixed(2) + '"/>'
    );
  }

  function ProteinFoldingAnimation(root, hooks) {
    this.root = root;
    this.hooks = hooks || {};
    this.progress = 0;
    this.playing = false;
    this.lastTs = 0;
    this.holdStart = 0;
    this.raf = null;

    root.innerHTML =
      '<div class="prot-fold-scene">' +
      '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Protein folding animation">' +
      '<defs><linearGradient id="prot-silver" x1="0%" y1="0%" x2="100%" y2="0%">' +
      '<stop offset="0%" stop-color="#eef1f5"/><stop offset="40%" stop-color="#c2c8d2"/>' +
      '<stop offset="100%" stop-color="#8d949e"/></linearGradient></defs>' +
      '<g data-id="scene"></g></svg></div>';

    this.gScene = root.querySelector('[data-id="scene"]');
    this._tick = this._tick.bind(this);
    this._draw();
    this._emit();
    this.raf = requestAnimationFrame(this._tick);
  }

  ProteinFoldingAnimation.prototype._draw = function () {
    var p = clamp(this.progress, 0, 1);
    var e = easeInOut(p);
    var chain = chainAt(p);
    var items = [];
    var intro = p < SPLIT_START;
    var splitting = p >= SPLIT_START && p < SPLIT_END;
    var st = splitT(p);
    var beadR = intro
      ? lerp(13.5, 12, p / SPLIT_START)
      : splitting
        ? lerp(12, 10.5, st)
        : lerp(10.5, 8.5, clamp((p - SPLIT_END) / (1 - SPLIT_END), 0, 1));
    var gloss = clamp(1 - p / 0.55, 0, 1);
    var silverMix = clamp(1 - (p - 0.35) / 0.12, 0, 1);
    var linkW = intro ? 2.5 : splitting ? lerp(2.5, 2.9, st) : lerp(2.9, 3.4, clamp((p - SPLIT_END) / 0.5, 0, 1));

    if (splitting) {
      var splitList = splitBeads(chain, st);
      for (var si = 0; si < splitList.length; si++) {
        var sb = splitList[si];
        var spr = project(sb.p3);
        var sr = beadR * spr.f * (sb.scale || 1);
        var sa = sb.ghost ? clamp(1 - sb.ghost, 0, 1) : 1;
        items.push({
          z: sb.p3.z - 0.01,
          html: beadMarkup(spr, sr, sb.color, gloss, sa),
        });
      }
    } else {
      var drawIdx = indicesForProgress(p);
      for (var i = 0; i < chain.length; i++) {
        if (drawIdx.indexOf(i) === -1) continue;
        var pt = chain[i];
        var pr = project(pt.p3);
        var r = beadR * pr.f;
        items.push({ z: pt.p3.z - 0.01, html: beadMarkup(pr, r, pt.color, gloss, 1) });
      }
    }

    var linkPairs = [];
    if (splitting) {
      for (var sp = 0; sp < BEADS_UNFOLD; sp++) {
        var ci = INTRO_INDICES[sp];
        var idxB = sp < BEADS_UNFOLD - 1
          ? Math.round((INTRO_INDICES[sp] + INTRO_INDICES[sp + 1]) / 2)
          : Math.min(ci + 2, SAMPLES - 1);
        var ease = easeInOut(st);
        var parentP = chain[ci].p3;
        var pA = lerp3(parentP, chain[ci].p3, ease);
        var pB = lerp3(parentP, chain[idxB].p3, ease);
        if (sp > 0) {
          var prevB = sp - 1 < BEADS_UNFOLD - 1
            ? Math.round((INTRO_INDICES[sp - 1] + INTRO_INDICES[sp]) / 2)
            : Math.min(INTRO_INDICES[sp - 1] + 2, SAMPLES - 1);
          var prevP3 = lerp3(chain[INTRO_INDICES[sp - 1]].p3, chain[prevB].p3, ease);
          linkPairs.push([prevP3, pA]);
        }
        linkPairs.push([pA, pB]);
      }
      for (var sl = 0; sl < linkPairs.length; sl++) {
        var prA = project(linkPairs[sl][0]);
        var prB = project(linkPairs[sl][1]);
        var midZ = (linkPairs[sl][0].z + linkPairs[sl][1].z) * 0.5;
        var lw = linkW * (prA.f + prB.f) * 0.5;
        items.push({ z: midZ, html: linkMarkup(prA, prB, lw, silverMix) });
      }
    } else {
      var idx = indicesForProgress(p);
      for (var li = 0; li < idx.length - 1; li++) {
        linkPairs.push([idx[li], idx[li + 1]]);
      }
      for (var lp = 0; lp < linkPairs.length; lp++) {
        var ia = linkPairs[lp][0];
        var ib = linkPairs[lp][1];
        var prA2 = project(chain[ia].p3);
        var prB2 = project(chain[ib].p3);
        var midZ2 = (chain[ia].p3.z + chain[ib].p3.z) * 0.5;
        var lw2 = linkW * (prA2.f + prB2.f) * 0.5;
        items.push({ z: midZ2, html: linkMarkup(prA2, prB2, lw2, silverMix) });
      }
    }

    items.sort(function (a, b) { return a.z - b.z; });
    this.gScene.innerHTML = items.map(function (it) { return it.html; }).join("");
  };

  ProteinFoldingAnimation.prototype._emit = function () {
    if (this.hooks.onProgress) this.hooks.onProgress(this.progress);
  };

  ProteinFoldingAnimation.prototype._tick = function (ts) {
    if (!this.lastTs) this.lastTs = ts;
    var dt = ts - this.lastTs;
    this.lastTs = ts;

    if (this.playing) {
      if (this.holdStart) {
        if (ts - this.holdStart >= HOLD_MS) {
          this.holdStart = 0;
          if (this.progress >= 0.999) {
            this.progress = 0;
            this._emit();
          }
        }
      } else {
        this.progress += dt / DURATION;
        if (this.progress >= 1) {
          this.progress = 1;
          this.holdStart = ts;
          if (this.hooks.onComplete) this.hooks.onComplete();
        }
        this._emit();
      }
    }
    this._draw();
    this.raf = requestAnimationFrame(this._tick);
  };

  ProteinFoldingAnimation.prototype.play = function () {
    if (this.progress >= 1 && !this.holdStart) {
      this.restart();
      return;
    }
    this.playing = true;
  };
  ProteinFoldingAnimation.prototype.pause = function () {
    this.playing = false;
    this.holdStart = 0;
  };
  ProteinFoldingAnimation.prototype.toggle = function () {
    if (this.playing) this.pause();
    else this.play();
  };
  ProteinFoldingAnimation.prototype.restart = function () {
    this.progress = 0;
    this.lastTs = 0;
    this.holdStart = 0;
    this.playing = true;
    this._draw();
    this._emit();
  };
  ProteinFoldingAnimation.prototype.setProgress = function (t) {
    this.progress = clamp(t, 0, 1);
    this.holdStart = 0;
    this._draw();
    this._emit();
  };
  ProteinFoldingAnimation.prototype.destroy = function () {
    this.playing = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.root.innerHTML = "";
  };

  /* Legacy alias for HTML slider */
  Object.defineProperty(ProteinFoldingAnimation.prototype, "foldT", {
    get: function () { return this.progress; },
    set: function (v) { this.setProgress(v); },
  });

  global.ProteinFoldingAnimation = ProteinFoldingAnimation;

  function lerpColor(c0, c1, t) {
    t = clamp(t, 0, 1);
    function parse(hex) {
      var n = parseInt(hex.slice(1), 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    function hex(r, g, b) {
      return (
        "#" +
        [r, g, b]
          .map(function (v) {
            return clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
          })
          .join("")
      );
    }
    var a = parse(c0);
    var b = parse(c1);
    return hex(
      lerp(a.r, b.r, t),
      lerp(a.g, b.g, t),
      lerp(a.b, b.b, t)
    );
  }

  function applyConditionEffects(chain, cold, chaos, tick, variant) {
    if (cold < 0.02 && chaos < 0.02) return chain;
    var chaosAmt = isGlobularVariant(variant)
      ? Math.min(1, chaos * chaosScaleForVariant(variant))
      : chaos;
    var cx = 0;
    var cy = 0;
    var i;
    for (i = 0; i < chain.length; i++) {
      cx += chain[i].p3.x;
      cy += chain[i].p3.y;
    }
    cx /= chain.length;
    cy /= chain.length;

    for (i = 0; i < chain.length; i++) {
      var pt = chain[i];
      var t = tick * 0.001 + i * 0.31;
      var u = i / Math.max(chain.length - 1, 1);

      if (cold > 0.02) {
        pt.p3.z *= 1 - cold * 0.68;
        pt.p3.x = cx + (pt.p3.x - cx) * (1 - cold * 0.12);
        pt.p3.y = cy + (pt.p3.y - cy) * (1 - cold * 0.1);
        var pulse = Math.sin(t * 0.32 + i * 0.48);
        var pulse2 = Math.cos(t * 0.26 + i * 0.35);
        pt.p3.x += pulse * 5 * cold;
        pt.p3.y += pulse2 * 4 * cold;
        pt.color = lerpColor(pt.color, "#7eb8ea", cold * 0.58);
        pt.color = lerpColor(pt.color, "#c5dff5", cold * 0.22);
      }

      if (chaosAmt > 0.02) {
        var angle = Math.atan2(pt.p3.y - cy, pt.p3.x - cx);
        var peel = clamp(chaosAmt / 0.55, 0, 1);
        var peelRadius = 6 + peel * (22 + u * 38);
        pt.p3.x += Math.cos(angle) * peelRadius * peel;
        pt.p3.y += Math.sin(angle) * peelRadius * peel * 0.78;
        pt.p3.z -= peel * (10 + u * 8);

        var scramble = clamp((chaosAmt - 0.28) / 0.72, 0, 1);
        if (scramble > 0) {
          var wobbleAngle = angle + Math.sin(t * 1.4 + i * 0.55) * 0.85;
          var burst = scramble * (18 + u * 44 + Math.sin(t * 2.1 + i) * 14);
          if (isGlobularVariant(variant)) burst *= 1.18;
          pt.p3.x += Math.cos(wobbleAngle) * burst;
          pt.p3.y += Math.sin(wobbleAngle) * burst * 0.82;
          pt.p3.z -= scramble * (12 + u * 12);
          pt.p3.x += Math.sin(t * 3.2 + i * 0.9) * scramble * 14;
          pt.p3.y += Math.cos(t * 2.7 + i * 0.7) * scramble * 11;
        }

        if (chaosAmt > 0.12) {
          pt.color = lerpColor(
            pt.color,
            "#b8b8b8",
            clamp((chaosAmt - 0.12) / 0.88, 0, 1)
          );
        }
      }
    }
    return chain;
  }

  function progressFromWeights(weights) {
    return weights.optimal * 1 + weights.lowTemp * 1 + weights.denatured * 0;
  }

  function activeSiteMarkup(pr, scale, coldMix, chaos, style) {
    if (chaos > 0.42) return "";
    style = style || "pocket";
    var cx = pr.x;
    var cy = pr.y;
    var pocketAlpha = (1 - chaos * 1.4) * (1 - coldMix * 0.25) * 0.5;

    if (style === "groove") {
      return (
        '<g opacity="' +
        pocketAlpha.toFixed(2) +
        '">' +
        '<ellipse cx="' +
        cx.toFixed(1) +
        '" cy="' +
        cy.toFixed(1) +
        '" rx="' +
        (17 * scale).toFixed(1) +
        '" ry="' +
        (13 * scale).toFixed(1) +
        '" fill="#a8cce8"/>' +
        '<circle cx="' +
        (cx - 4 * scale).toFixed(1) +
        '" cy="' +
        (cy + 1 * scale).toFixed(1) +
        '" r="' +
        (3 * scale).toFixed(1) +
        '" fill="#f5bcd0"/>' +
        '<circle cx="' +
        (cx + 4 * scale).toFixed(1) +
        '" cy="' +
        (cy - 0.5 * scale).toFixed(1) +
        '" r="' +
        (2.8 * scale).toFixed(1) +
        '" fill="#b8e6a8"/>' +
        '<circle cx="' +
        (cx - 1 * scale).toFixed(1) +
        '" cy="' +
        (cy + 3 * scale).toFixed(1) +
        '" r="' +
        (2.6 * scale).toFixed(1) +
        '" fill="#f5e060" stroke="#c8a820" stroke-width="0.4"/>' +
        '<circle cx="' +
        (cx + 2 * scale).toFixed(1) +
        '" cy="' +
        (cy + 2.5 * scale).toFixed(1) +
        '" r="' +
        (2.4 * scale).toFixed(1) +
        '" fill="#f0c848" stroke="#c8a820" stroke-width="0.4"/></g>'
      );
    }

    if (style === "bowl") {
      return (
        '<g opacity="' +
        pocketAlpha.toFixed(2) +
        '">' +
        '<ellipse cx="' +
        cx.toFixed(1) +
        '" cy="' +
        (cy + 1 * scale).toFixed(1) +
        '" rx="' +
        (19 * scale).toFixed(1) +
        '" ry="' +
        (15 * scale).toFixed(1) +
        '" fill="#6eaee8"/>' +
        '<ellipse cx="' +
        cx.toFixed(1) +
        '" cy="' +
        cy.toFixed(1) +
        '" rx="' +
        (14 * scale).toFixed(1) +
        '" ry="' +
        (10 * scale).toFixed(1) +
        '" fill="#8ec4f0" opacity="0.75"/>' +
        '<circle cx="' +
        (cx - 3.5 * scale).toFixed(1) +
        '" cy="' +
        (cy + 1 * scale).toFixed(1) +
        '" r="' +
        (3.2 * scale).toFixed(1) +
        '" fill="#f5e060" stroke="#c8a820" stroke-width="0.4"/>' +
        '<circle cx="' +
        (cx + 3.5 * scale).toFixed(1) +
        '" cy="' +
        (cy + 1 * scale).toFixed(1) +
        '" r="' +
        (3.2 * scale).toFixed(1) +
        '" fill="#f5e060" stroke="#c8a820" stroke-width="0.4"/>' +
        '<line x1="' +
        (cx - 3.5 * scale).toFixed(1) +
        '" y1="' +
        (cy + 1 * scale).toFixed(1) +
        '" x2="' +
        (cx + 3.5 * scale).toFixed(1) +
        '" y2="' +
        (cy + 1 * scale).toFixed(1) +
        '" stroke="#c8a820" stroke-width="' +
        (0.8 * scale).toFixed(1) +
        '"/></g>'
      );
    }

    if (style === "sucrose") {
      return (
        '<g opacity="' +
        pocketAlpha.toFixed(2) +
        '">' +
        '<ellipse cx="' +
        cx.toFixed(1) +
        '" cy="' +
        cy.toFixed(1) +
        '" rx="' +
        (18 * scale).toFixed(1) +
        '" ry="' +
        (14 * scale).toFixed(1) +
        '" fill="#9ec8ef" opacity="0.85"/>' +
        '<circle cx="' +
        (cx - 4 * scale).toFixed(1) +
        '" cy="' +
        (cy + 1.5 * scale).toFixed(1) +
        '" r="' +
        (3.4 * scale).toFixed(1) +
        '" fill="#f5e060" stroke="#c8a820" stroke-width="0.4"/>' +
        '<circle cx="' +
        (cx + 4 * scale).toFixed(1) +
        '" cy="' +
        (cy - 0.5 * scale).toFixed(1) +
        '" r="' +
        (3.2 * scale).toFixed(1) +
        '" fill="#e8a8d8" stroke="#b86898" stroke-width="0.4"/>' +
        '<line x1="' +
        (cx - 4 * scale).toFixed(1) +
        '" y1="' +
        (cy + 1.5 * scale).toFixed(1) +
        '" x2="' +
        (cx + 4 * scale).toFixed(1) +
        '" y2="' +
        (cy - 0.5 * scale).toFixed(1) +
        '" stroke="#888" stroke-width="' +
        (0.9 * scale).toFixed(1) +
        '"/></g>'
      );
    }

    if (style === "lactose") {
      return (
        '<g opacity="' +
        pocketAlpha.toFixed(2) +
        '">' +
        '<ellipse cx="' +
        cx.toFixed(1) +
        '" cy="' +
        (cy + 1 * scale).toFixed(1) +
        '" rx="' +
        (19 * scale).toFixed(1) +
        '" ry="' +
        (15 * scale).toFixed(1) +
        '" fill="#6eaee8"/>' +
        '<ellipse cx="' +
        cx.toFixed(1) +
        '" cy="' +
        cy.toFixed(1) +
        '" rx="' +
        (14 * scale).toFixed(1) +
        '" ry="' +
        (10 * scale).toFixed(1) +
        '" fill="#8ec4f0" opacity="0.75"/>' +
        '<circle cx="' +
        (cx - 3.5 * scale).toFixed(1) +
        '" cy="' +
        (cy + 1 * scale).toFixed(1) +
        '" r="' +
        (3.2 * scale).toFixed(1) +
        '" fill="#f5e060" stroke="#c8a820" stroke-width="0.4"/>' +
        '<circle cx="' +
        (cx + 3.5 * scale).toFixed(1) +
        '" cy="' +
        (cy + 1 * scale).toFixed(1) +
        '" r="' +
        (3.2 * scale).toFixed(1) +
        '" fill="#e8a8d8" stroke="#b86898" stroke-width="0.4"/>' +
        '<line x1="' +
        (cx - 3.5 * scale).toFixed(1) +
        '" y1="' +
        (cy + 1 * scale).toFixed(1) +
        '" x2="' +
        (cx + 3.5 * scale).toFixed(1) +
        '" y2="' +
        (cy + 1 * scale).toFixed(1) +
        '" stroke="#c8a820" stroke-width="' +
        (0.8 * scale).toFixed(1) +
        '"/></g>'
      );
    }

    var subR = 4.8 * scale;
    return (
      '<g opacity="' +
      pocketAlpha.toFixed(2) +
      '">' +
      '<ellipse cx="' +
      cx.toFixed(1) +
      '" cy="' +
      cy.toFixed(1) +
      '" rx="' +
      (15 * scale).toFixed(1) +
      '" ry="' +
      (11 * scale).toFixed(1) +
      '" fill="#c5cad2"/>' +
      '<circle cx="' +
      (cx - 3 * scale).toFixed(1) +
      '" cy="' +
      (cy + 1.5 * scale).toFixed(1) +
      '" r="' +
      (3.2 * scale).toFixed(1) +
      '" fill="#f5bcd0"/>' +
      '<circle cx="' +
      (cx + 3.5 * scale).toFixed(1) +
      '" cy="' +
      (cy - 1 * scale).toFixed(1) +
      '" r="' +
      (3 * scale).toFixed(1) +
      '" fill="#b8e6a8"/>' +
      '<circle cx="' +
      cx.toFixed(1) +
      '" cy="' +
      cy.toFixed(1) +
      '" r="' +
      subR.toFixed(1) +
      '" fill="#f5e060" stroke="#c8a820" stroke-width="0.5"/></g>'
    );
  }

  function activeSiteStyleForVariant(variant) {
    if (variant === "sucrase") return "sucrose";
    if (variant === "lactase") return "lactose";
    if (variant === "maltase") return "bowl";
    if (variant === "pancreatic-amylase" || variant === "pancreatic-lipase") return "groove";
    if (variant === "protease" || variant === "pepsin") return "pocket";
    return "pocket";
  }

  function activeSitePosForVariant(variant) {
    if (
      variant === "pancreatic-amylase" ||
      variant === "pancreatic-lipase" ||
      variant === "protease" ||
      variant === "maltase" ||
      variant === "sucrase" ||
      variant === "lactase"
    ) {
      return { x: 0, y: 0, z: 10 };
    }
    if (variant === "pepsin") return { x: 0, y: 4, z: 14 };
    return { x: 0, y: 0, z: 10 };
  }

  function conditionTitleMarkup(variant, cold, chaos) {
    var meta = {
      "pancreatic-lipase": {
        title: "Pancreatic Lipase",
        cold: "Low Temperature (< 15°C)",
        opt: "Optimal Temperature: ~37°C · pH: ~8 (Alkaline)",
        denat: "High temperature / extreme pH — denatured",
      },
      protease: {
        title: "Protease",
        cold: "Low Temperature (< 15°C)",
        opt: "Optimal Temperature: ~37°C · pH: ~8.0 · Active site intact",
        denat: "High temperature / extreme pH — denatured",
      },
      lactase: {
        title: "Lactase",
        cold: "Low Temperature (< 15°C)",
        opt: "Optimal Temperature: ~37°C · pH: ~6–7 · Active site groove intact",
        denat: "High temperature / extreme pH — denatured",
      },
    };
    var m = meta[variant];
    if (!m) return "";
    var subtitle =
      chaos > 0.45 ? m.denat : cold > 0.45 ? m.cold : m.opt;
    return (
      '<text x="' +
      (W * 0.5).toFixed(1) +
      '" y="24" text-anchor="middle" fill="#1a4a7a" font-size="13" font-weight="700">' +
      m.title +
      "</text>" +
      '<text x="' +
      (W * 0.5).toFixed(1) +
      '" y="42" text-anchor="middle" fill="#2a5a8a" font-size="10">' +
      subtitle +
      "</text>"
    );
  }

  /** Slider-driven protein appearance: folded (optimum) ↔ unfolded/denatured chaos */
  function EnzymeConditionAnimation(root, options) {
    options = options || {};
    this.variant = options.variant || "default";
    this.root = root;
    this.progress = 1;
    this.targetProgress = 1;
    this.cold = 0;
    this.targetCold = 0;
    this.chaos = 0;
    this.targetChaos = 0;
    this.tick = 0;
    this.playing = true;
    this.raf = null;

    root.innerHTML =
      '<div class="prot-fold-scene enzyme-condition-scene">' +
      '<svg viewBox="0 0 ' +
      W +
      " " +
      H +
      '" role="img" aria-label="Enzyme structure animation">' +
      '<defs><linearGradient id="prot-silver" x1="0%" y1="0%" x2="100%" y2="0%">' +
      '<stop offset="0%" stop-color="#eef1f5"/><stop offset="40%" stop-color="#c2c8d2"/>' +
      '<stop offset="100%" stop-color="#8d949e"/></linearGradient></defs>' +
      '<g data-id="scene"></g></svg></div>';

    this.gScene = root.querySelector('[data-id="scene"]');
    this._draw = this._draw.bind(this);
    this._loop = this._loop.bind(this);
    this.raf = requestAnimationFrame(this._loop);
  }

  EnzymeConditionAnimation.prototype.setFromWeights = function (weights) {
    this.targetProgress = progressFromWeights(weights);
    this.targetCold = weights.lowTemp;
    this.targetChaos = weights.denatured;
  };

  EnzymeConditionAnimation.prototype._draw = function () {
    var p = clamp(this.progress, 0, 1);
    var chain = chainAt(p, this.variant);
    chain = applyConditionEffects(chain, this.cold, this.chaos, this.tick, this.variant);

    var items = [];
    var coldMix = this.cold;
    var beadR = lerp(13.5, 8.5, p) * (1 - coldMix * 0.07);
    var gloss =
      clamp(1 - p / 0.55, 0, 1) *
      (1 - this.chaos * 0.85) *
      (1 - coldMix * 0.72);
    var silverMix = clamp(1 - (p - 0.35) / 0.12, 0, 1) * (1 - coldMix * 0.92);
    var linkW =
      lerp(2.5, 3.4, clamp((p - 0.2) / 0.8, 0, 1)) * (1 + coldMix * 0.22);
    var linkSkip = this.chaos > 0.18 ? Math.floor(1 + this.chaos * 4.5) : 0;
    var coldLinkStroke = coldMix > 0.12 ? "#4a7fad" : null;

    if (coldMix > 0.12) {
      items.push({
        z: -999,
        html:
          '<rect x="0" y="0" width="' +
          W +
          '" height="' +
          H +
          '" fill="#dceefb" opacity="' +
          (coldMix * 0.38).toFixed(2) +
          '"/>',
      });
    }

    for (var i = 0; i < chain.length; i++) {
      var pt = chain[i];
      var pr = project(pt.p3);
      var r = beadR * pr.f * (1 - this.chaos * 0.15);
      items.push({ z: pt.p3.z - 0.01, html: beadMarkup(pr, r, pt.color, gloss, 1) });
    }

    if (isGlobularVariant(this.variant) && p > 0.68 && this.chaos < 0.48) {
      var sitePos = activeSitePosForVariant(this.variant);
      var siteStyle = activeSiteStyleForVariant(this.variant);
      var sitePr = project(sitePos);
      var siteScale = sitePr.f * (1 - coldMix * 0.05);
      items.push({
        z: 40,
        html: activeSiteMarkup(
          sitePr,
          siteScale,
          coldMix,
          this.chaos,
          siteStyle
        ),
      });
    }

    for (var li = 0; li < chain.length - 1; li++) {
      if (linkSkip && li % linkSkip === 0) continue;
      var prA = project(chain[li].p3);
      var prB = project(chain[li + 1].p3);
      var midZ = (chain[li].p3.z + chain[li + 1].p3.z) * 0.5;
      var lw = linkW * (prA.f + prB.f) * 0.5 * (1 - this.chaos * 0.45);
      var linkAlpha = 1 - this.chaos * 0.72;
      items.push({
        z: midZ,
        html:
          '<g opacity="' +
          linkAlpha.toFixed(2) +
          '">' +
          linkMarkup(prA, prB, lw, silverMix, coldLinkStroke) +
          "</g>",
      });
    }

    items.sort(function (a, b) {
      return a.z - b.z;
    });

    var titleHtml = conditionTitleMarkup(
      this.variant,
      this.cold,
      this.chaos
    );
    if (titleHtml) {
      items.push({ z: 99999, html: titleHtml });
    }

    this.gScene.innerHTML = items
      .map(function (it) {
        return it.html;
      })
      .join("");
  };

  EnzymeConditionAnimation.prototype._loop = function (ts) {
    this.tick = ts || 0;
    if (this.playing) {
      this.progress += (this.targetProgress - this.progress) * 0.09;
      this.cold += (this.targetCold - this.cold) * 0.1;
      this.chaos += (this.targetChaos - this.chaos) * 0.09;
    }
    this._draw();
    this.raf = requestAnimationFrame(this._loop);
  };

  EnzymeConditionAnimation.prototype.destroy = function () {
    this.playing = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.root.innerHTML = "";
  };

  global.EnzymeConditionAnimation = EnzymeConditionAnimation;
})(typeof window !== "undefined" ? window : globalThis);
