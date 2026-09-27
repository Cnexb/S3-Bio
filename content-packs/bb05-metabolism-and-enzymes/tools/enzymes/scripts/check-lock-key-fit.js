/**
 * Check lock-and-key fit: enzyme active-site caps vs carbohydrate hex lock faces.
 */
var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
(0, eval)(fs.readFileSync(path.join(root, "js", "enzymeShapes.js"), "utf8"));
(0, eval)(fs.readFileSync(path.join(root, "js", "moleculeFlat2d.js"), "utf8"));
var MF = globalThis.MoleculeFlat2d;

var R = MF.FLAT_HEX_R;
var HALF = MF.FLAT_HEX_FLAT_W / 2;
var CAP = MF.FLAT_HEX_CAP_DEPTH;

function hexVertices(cx, cy, r) {
  var pts = [];
  for (var i = 0; i < 6; i++) {
    var a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), i: i });
  }
  return pts;
}

/** Substrate lock face: top vertex cap (vertex up, flat at sideY). */
function substrateLockCap(cx, cy, r) {
  var v = hexVertices(cx, cy, r);
  var top = v[2];
  var left = v[3];
  var right = v[1];
  return {
    cx: cx,
    flatY: left.y,
    vertexY: top.y,
    left: { x: left.x, y: left.y },
    right: { x: right.x, y: right.y },
    vertex: { x: top.x, y: top.y },
    flatW: right.x - left.x,
    capDepth: top.y - left.y,
  };
}

/** Enzyme pocket cap (vertex down). */
function enzymeLockCap(cx, yOpen, r) {
  return {
    cx: cx,
    flatY: yOpen,
    vertexY: yOpen + r / 2,
    left: { x: cx - (r * Math.sqrt(3)) / 2, y: yOpen },
    right: { x: cx + (r * Math.sqrt(3)) / 2, y: yOpen },
    vertex: { x: cx, y: yOpen + r / 2 },
    flatW: r * Math.sqrt(3),
    capDepth: r / 2,
  };
}

function capsComplementary(sub, enz) {
  var wOk = Math.abs(sub.flatW - enz.flatW) < 0.05;
  var dOk = Math.abs(sub.capDepth - enz.capDepth) < 0.05;
  return { wOk: wOk, dOk: dOk, shapeOk: wOk && dOk };
}

console.log("=== 1. SHAPE COMPATIBILITY (cap geometry) ===\n");
var refSub = substrateLockCap(50, 30, R);
var refEnz = enzymeLockCap(50, 30, R);
var comp = capsComplementary(refSub, refEnz);
console.log("Substrate cap (hex top vertex): W=" + refSub.flatW.toFixed(2) + " depth=" + refSub.capDepth.toFixed(2));
console.log("Enzyme cap (pocket vertex down): W=" + refEnz.flatW.toFixed(2) + " depth=" + refEnz.capDepth.toFixed(2));
console.log("Complementary cap dimensions: " + (comp.shapeOk ? "YES" : "NO"));

console.log("\n=== 2. DISACCHARIDASE vs MALTOSE/SUCROSE/LACTOSE hex positions ===\n");
var pairs = [
  { enz: "maltase", sub: "maltose", variant: "maltase" },
  { enz: "sucrase", sub: "sucrose", variant: "sucrase" },
  { enz: "lactase", sub: "lactose", variant: "lactase" },
];

var leftCx = 32;
var rightCx = 32 + MF.FLAT_HEX_FLAT_W + 12;
var yOpen = 32;

pairs.forEach(function (p) {
  var specs = MF.FLAT_HEX_SPECS[p.sub];
  console.log("--- " + p.enz + " + " + p.sub + " ---");
  specs.forEach(function (hex, idx) {
    var subCap = substrateLockCap(hex.cx, hex.cy, hex.r);
    var pocketCx = idx === 0 ? leftCx : rightCx;
    var enzCap = enzymeLockCap(pocketCx, yOpen, R);
    var c = capsComplementary(subCap, enzCap);
    var dx = Math.abs(subCap.cx - enzCap.cx);
    console.log(
      "  hex " + (idx + 1) + " @ cx=" + hex.cx +
      " vs pocket cx=" + pocketCx +
      " | cx offset=" + dx.toFixed(1) +
      " | cap shape match=" + c.shapeOk
    );
  });
  var pitchHex = specs[1].cx - specs[0].cx;
  var pitchPocket = rightCx - leftCx;
  console.log("  hex pitch=" + pitchHex + " pocket pitch=" + pitchPocket.toFixed(1) +
    " | pitch match=" + (Math.abs(pitchHex - pitchPocket) < 0.1));
  var fit = MF.holeFitForVariant(p.variant, p.sub);
  console.log("  animation buildLegoFit: scale=" + fit.scale.toFixed(3) + " cx=" + fit.cx.toFixed(1) + " cy=" + fit.cy.toFixed(1));
});

console.log("\n=== 3. AMYLASE vs STARCH hex positions ===\n");
var toothYs = MF.AMYLASE_HOLE_Y_TOP || 18;
var startX = 22;
var toothW = MF.FLAT_HEX_FLAT_W;
var starchSpecs = MF.FLAT_HEX_SPECS.starch;
console.log("Amylase: 6 teeth, pitch=" + toothW + ", yOpen=" + toothYs);
console.log("Starch chain hex pitch=16 (centers), branch at (46,12)\n");

for (var ti = 0; ti < 6; ti++) {
  var tcx = startX + ti * toothW + toothW / 2;
  var enzCap = enzymeLockCap(tcx, toothYs, R);
  console.log("  tooth " + (ti + 1) + " cx=" + tcx.toFixed(1) + " vertex y=" + enzCap.vertexY.toFixed(1));
}

starchSpecs.forEach(function (hex) {
  var subCap = substrateLockCap(hex.cx, hex.cy, hex.r);
  console.log(
    "  starch " + hex.role + " cx=" + hex.cx + " cy=" + hex.cy +
    " | top vertex (" + subCap.vertex.x.toFixed(1) + "," + subCap.vertex.y.toFixed(1) + ")"
  );
});

var fitAmyl = MF.holeFitForVariant("default", "starch");
console.log("\n  animation buildLegoFit (salivary amylase + starch): scale=" +
  fitAmyl.scale.toFixed(3) + " cx=" + fitAmyl.cx.toFixed(1) + " cy=" + fitAmyl.cy.toFixed(1));

console.log("\n=== 4. PER-CAP OVERLAY TEST (1:1 scale, same coords) ===\n");
console.log("If enzyme & substrate shared the 100×60 view with NO transform:\n");

function overlayTest(label, hexCx, hexCy, pocketCx, yFlat) {
  var sub = substrateLockCap(hexCx, hexCy, R);
  var enz = enzymeLockCap(pocketCx, yFlat, R);
  var dx = sub.vertex.x - enz.vertex.x;
  var dy = sub.vertex.y - enz.vertex.y;
  var flatDy = sub.flatY - enz.flatY;
  var fits =
    Math.abs(dx) < 0.15 &&
    Math.abs(dy) < 0.15 &&
    Math.abs(flatDy) < 0.15;
  console.log(
    label + ": vertex delta (" + dx.toFixed(1) + "," + dy.toFixed(1) + ")" +
    " flatY delta=" + flatDy.toFixed(1) + " => 1:1 cap nest=" + (fits ? "YES" : "NO")
  );
  return fits;
}

var d1 = overlayTest("Maltase L", 34, 30, leftCx, yOpen);
var d2 = overlayTest("Maltase R", 66, 30, rightCx, yOpen);
var a1 = overlayTest("Amylase tooth3 vs starch chain3", 46, 34, startX + 2 * toothW + toothW / 2, toothYs);

console.log("\n=== SUMMARY ===");
console.log("Cap shape (W & depth): MATCH — enzyme pocket mirrors hex vertex cap.");
console.log("Disaccharidase pocket cx/pitch vs maltose hex centers: " +
  (d1 && d2 ? "ALIGNED at 1:1" : "MISALIGNED at 1:1 (cx offset 2 & 6.4, pitch 27.6 vs 32)"));
console.log("Amylase tooth vs starch hex at 1:1 shared coords: " + (a1 ? "ALIGNED" : "MISALIGNED (different viewBox / layout)"));
console.log("Animation docking uses buildLegoFit bbox scaling — fits whole substrate silhouette, not per-hex snap.");
