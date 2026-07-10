/**
 * Export standalone flat 2D enzyme SVG assets (programmatic variants).
 * Run: node public/enzymes/scripts/export-enzyme-flat-svgs.js
 */
var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var outDir = path.join(root, "assets", "enzymes");

(0, eval)(fs.readFileSync(path.join(root, "js", "enzymeShapes.js"), "utf8"));
(0, eval)(fs.readFileSync(path.join(root, "js", "moleculeFlat2d.js"), "utf8"));

var M = globalThis.MoleculeFlat2d;

var EXPORTS = [
  { id: "pepsin", file: "pepsin-enzyme-flat.svg", label: "Pepsin flat 2D enzyme", viewBox: "0 0 160 80" },
  { id: "protease", file: "protease-enzyme-flat.svg", label: "Protease flat 2D enzyme", viewBox: "0 0 160 80" },
];

var DISACCHARIDASE_EXPORTS = [
  { file: "disaccharidase-enzyme.svg", label: "Disaccharidase flat 2D enzyme" },
  { file: "maltase-enzyme-flat.svg", label: "Maltase flat 2D enzyme" },
  { file: "sucrase-enzyme-flat.svg", label: "Sucrase flat 2D enzyme" },
  { file: "lactase-enzyme-flat.svg", label: "Lactase flat 2D enzyme" },
];

var AMYLASE_EXPORTS = [
  { file: "salivary-amylase-enzyme-flat.svg", label: "Salivary amylase flat 2D enzyme" },
  { file: "pancreatic-amylase-enzyme-flat.svg", label: "Pancreatic amylase flat 2D enzyme" },
  { file: "amylase-enzyme-flat.svg", label: "Amylase flat 2D enzyme" },
];

function writeDisaccharidaseSvg(item) {
  var inner = M.buildDisaccharidaseFlatScene(
    {
      hole: "#f5d565",
      holeEdge: "#c9a227",
    },
    { holeOpacity: 0.88 }
  );
  var svg =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 152 84" role="img" aria-label="' + item.label + '">\n' +
    inner + "\n</svg>\n";
  fs.writeFileSync(path.join(outDir, item.file), svg, "utf8");
  console.log("wrote", item.file);
}

function writeAmylaseSvg(item) {
  var inner = M.buildAmylaseEnzymeScene(
    {
      hole: "#f5d565",
      holeEdge: "#c9a227",
    },
    { holeOpacity: 0.88 }
  );
  var svg =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136 98" role="img" aria-label="' + item.label + '">\n' +
    inner + "\n</svg>\n";
  fs.writeFileSync(path.join(outDir, item.file), svg, "utf8");
  console.log("wrote", item.file);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

EXPORTS.forEach(function (item) {
  if (M.isFrozenAssetVariant && M.isFrozenAssetVariant(item.id)) {
    console.log("skip frozen asset", item.file);
    return;
  }
  var inner = M.renderEnzymeFlatScene(item.id, { showFitPreview: false });
  var svg =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + item.viewBox +
    '" role="img" aria-label="' + item.label + '">\n' +
    inner + "\n</svg>\n";
  fs.writeFileSync(path.join(outDir, item.file), svg, "utf8");
  console.log("wrote", item.file);
});

DISACCHARIDASE_EXPORTS.forEach(writeDisaccharidaseSvg);
AMYLASE_EXPORTS.forEach(writeAmylaseSvg);
console.log("skipped frozen pasted asset: pancreatic lipase only");
