/**
 * Verify enzyme yellow active sites match hexVertexCapPath geometry.
 * Run: node public/enzymes/scripts/check-hex-cap-active-sites.js
 */
var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
(0, eval)(fs.readFileSync(path.join(root, "js", "enzymeShapes.js"), "utf8"));
(0, eval)(fs.readFileSync(path.join(root, "js", "moleculeFlat2d.js"), "utf8"));
var MF = globalThis.MoleculeFlat2d;

function parsePathD(d) {
  var nums = d
    .replace(/[MLZ]/gi, " ")
    .trim()
    .split(/[\s,]+/)
    .map(Number)
    .filter(function (n) {
      return !isNaN(n);
    });
  var pts = [];
  var i;
  for (i = 0; i + 1 < nums.length; i += 2) {
    pts.push({ x: nums[i], y: nums[i + 1] });
  }
  return pts;
}

function bbox(pts) {
  var xs = pts.map(function (p) {
    return p.x;
  });
  var ys = pts.map(function (p) {
    return p.y;
  });
  return {
    w: Math.max.apply(null, xs) - Math.min.apply(null, xs),
    h: Math.max.apply(null, ys) - Math.min.apply(null, ys),
  };
}

function normalizeShape(pts) {
  var cx = pts.reduce(function (s, p) {
    return s + p.x;
  }, 0) / pts.length;
  var cy = pts.reduce(function (s, p) {
    return s + p.y;
  }, 0) / pts.length;
  return pts
    .map(function (p) {
      return { x: +(p.x - cx).toFixed(2), y: +(p.y - cy).toFixed(2) };
    })
    .sort(function (a, b) {
      return a.x - b.x || a.y - b.y;
    });
}

function shapeKey(pts) {
  return JSON.stringify(normalizeShape(pts));
}

function hexCapFromHexPath(cx, cy, r) {
  var half = (r * Math.sqrt(3)) / 2;
  var depth = r / 2;
  return [
    { x: +(cx - half).toFixed(1), y: +(cy + depth).toFixed(1) },
    { x: +cx.toFixed(1), y: +(cy + r).toFixed(1) },
    { x: +(cx + half).toFixed(1), y: +(cy + depth).toFixed(1) },
  ];
}

var refCapKey = shapeKey(hexCapFromHexPath(50, 30, MF.FLAT_HEX_R));
var refBbox = bbox(hexCapFromHexPath(50, 30, MF.FLAT_HEX_R));

console.log("Reference hex vertex cap: W=" + refBbox.w.toFixed(1) + " H=" + refBbox.h.toFixed(1));

var enzymeDir = path.join(root, "assets", "enzymes");
var targets = [
  "salivary-amylase-enzyme-flat.svg",
  "pancreatic-amylase-enzyme-flat.svg",
  "maltase-enzyme-flat.svg",
  "sucrase-enzyme-flat.svg",
  "lactase-enzyme-flat.svg",
];

var failed = false;

targets.forEach(function (file) {
  var svg = fs.readFileSync(path.join(enzymeDir, file), "utf8");
  var re = /d="([^"]+)"[^>]*fill="#f5d565"/g;
  var m;
  var count = 0;
  while ((m = re.exec(svg))) {
    count += 1;
    var pts = parsePathD(m[1]);
    var bb = bbox(pts);
    var key = shapeKey(pts);
    var ok =
      key === refCapKey &&
      Math.abs(bb.w - refBbox.w) < 0.15 &&
      Math.abs(bb.h - refBbox.h) < 0.15;
    if (!ok) {
      failed = true;
      console.log("FAIL", file, "cap", count, "W=" + bb.w.toFixed(1), "H=" + bb.h.toFixed(1), "keyMatch=" + (key === refCapKey));
    }
  }
  console.log(file + ": " + count + " yellow cap(s) checked");
});

if (failed) {
  console.error("\nVerification FAILED");
  process.exit(1);
}

console.log("\nAll yellow active sites match hex vertex cap geometry.");
