/**
 * Gallery of flat 2D models used in enzyme-factor 2D animation.
 * Click a card to copy the model as a transparent PNG to the clipboard.
 */
(function (global) {
  "use strict";

  var MF = null;
  var COPY_SCALE = 3;
  var toastTimer = null;
  var enzymeSpecCache = {};

  var COLOR_LABELS = {
    "#f5e6a8": "Starch / glucose / lipid",
    "#f0d4a8": "Sucrose unit",
    "#b8e6d8": "Lactose unit",
    "#c8b8e8": "Protein chain",
    "#b8d4f0": "Peptide chain",
    "#aad4f5": "Glycerol",
    "#f5bcd0": "Fructose",
    "#98dede": "Galactose",
    "#333333": "Bond",
    "#555555": "Outline",
    "#89c2eb": "Enzyme body",
    "#6aabd8": "Enzyme outline",
    "#f5d565": "Active site",
    "#c9a227": "Active site edge",
    "#f07070": "Enzyme body",
    "#ffffff": "Enzyme body (fill)",
  };

  function $(id) {
    return document.getElementById(id);
  }

  function showToast(message, isError) {
    var toast = $("copyToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("is-error", !!isError);
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function parseViewBox(svgEl) {
    var vb = svgEl.getAttribute("viewBox");
    if (vb) {
      var parts = vb.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts.every(function (n) { return !isNaN(n); })) {
        return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
      }
    }
    var w = parseFloat(svgEl.getAttribute("width"));
    var h = parseFloat(svgEl.getAttribute("height"));
    if (!isNaN(w) && !isNaN(h)) return { x: 0, y: 0, w: w, h: h };
    return { x: 0, y: 0, w: 200, h: 120 };
  }

  function normalizeSvgText(svgText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(svgText, "image/svg+xml");
    var svgEl = doc.documentElement;
    if (!svgEl || svgEl.nodeName.toLowerCase() !== "svg") {
      throw new Error("Invalid SVG");
    }
    if (!svgEl.getAttribute("xmlns")) {
      svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }
    return new XMLSerializer().serializeToString(svgEl);
  }

  function svgTextToPngBlob(svgText, outW, outH) {
    return new Promise(function (resolve, reject) {
      var serialized;
      try {
        serialized = normalizeSvgText(svgText);
      } catch (err) {
        reject(err);
        return;
      }
      var blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(outW));
        canvas.height = Math.max(1, Math.round(outH));
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (pngBlob) {
          if (pngBlob) resolve(pngBlob);
          else reject(new Error("PNG export failed"));
        }, "image/png");
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("SVG render failed"));
      };
      img.decoding = "sync";
      img.src = url;
    });
  }

  function fetchText(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + url);
      return res.text();
    });
  }

  function svgDimensionsFromText(svgText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(svgText, "image/svg+xml");
    var vb = parseViewBox(doc.documentElement);
    return { w: vb.w, h: vb.h };
  }

  function formatDim(n) {
    return String(Math.round(n * 10) / 10);
  }

  function normalizeHex(color) {
    if (!color || color === "none" || color === "transparent") return null;
    var c = String(color).trim().toLowerCase();
    if (c.charAt(0) !== "#" || c.length < 4) return null;
    if (c.length === 4) {
      c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
    }
    return c;
  }

  function colorLabel(hex) {
    return COLOR_LABELS[hex] || "Part";
  }

  function swatchHtml(hex) {
    return '<span class="color-swatch" style="background:' + hex + '"></span>';
  }

  function elementRadius(el) {
    var tag = el.tagName.toLowerCase();
    var r;
    if (tag === "circle") {
      r = parseFloat(el.getAttribute("r"));
      return isNaN(r) ? "—" : formatDim(r);
    }
    if (tag === "ellipse") {
      var rx = parseFloat(el.getAttribute("rx"));
      var ry = parseFloat(el.getAttribute("ry"));
      if (isNaN(rx) || isNaN(ry)) return "—";
      return "rx " + formatDim(rx) + ", ry " + formatDim(ry);
    }
    var sw = parseFloat(el.getAttribute("stroke-width"));
    if (el.getAttribute("fill") === "none" && !isNaN(sw)) {
      return formatDim(sw / 2);
    }
    if (tag === "line" && !isNaN(sw)) {
      return formatDim(sw / 2);
    }
    var d = el.getAttribute("d") || "";
    var arc = /\bA\s+([\d.]+)\s*,\s*([\d.]+)/.exec(d);
    if (arc) {
      return "arc " + formatDim(+arc[1]) + ", " + formatDim(+arc[2]);
    }
    return "—";
  }

  function moleculePartLabel(type, el, color, index) {
    var tag = el.tagName.toLowerCase();
    var strokeOnly = el.getAttribute("fill") === "none" || !el.getAttribute("fill");
    if (tag === "line" || strokeOnly) {
      if (type === "protein") return "Protein outline stroke";
      if (type === "peptide") return "Peptide outline stroke";
      return "Bond";
    }
    if (color === normalizeHex(MF.COLORS.fructose)) return "Fructose hex";
    if (color === normalizeHex(MF.COLORS.galactose)) return "Galactose hex";
    if (color === normalizeHex(MF.COLORS.glycerol)) {
      return index === 1 ? "Glycerol top carbon" : "Glycerol lower carbon (" + index + ")";
    }
    if (color === normalizeHex(MF.COLORS.protein)) return "Polypeptide stroke";
    if (color === normalizeHex(MF.COLORS.peptide)) return "Peptide stroke";
    if (type === "starch" && index > 5) return "Branch glucose unit";
    if (type === "starch") return "Chain glucose unit (" + index + ")";
    if (type === "fatty-acid") return "Carbon node (" + index + ")";
    if (type === "lipid" && index <= 3) return "Glycerol part (" + index + ")";
    if (type === "lipid") return "Fatty tail node (" + (index - 3) + ")";
    if (type === "maltose" || type === "sucrose" || type === "lactose") {
      return index === 1 ? "Left hex unit" : "Right hex unit";
    }
    if (color === normalizeHex(MF.COLORS.glucose) || color === normalizeHex(MF.COLORS.starch) || color === normalizeHex(MF.COLORS.maltose)) {
      return "Hex unit";
    }
    return colorLabel(color) + " (" + index + ")";
  }

  function enzymePartLabel(el, color, index) {
    if (color === "#f5d565") return "Active site (" + index + ")";
    if (color === "#89c2eb") return "Enzyme body (" + index + ")";
    if (color === "#f07070") return "Enzyme body";
    if (color === "#ffffff") return "Enzyme body";
    if (color === "#6aabd8" || color === "#333333" || color === "#c9a227") {
      return "Outline / stroke (" + index + ")";
    }
    return colorLabel(color) + " (" + index + ")";
  }

  function isHexPartLabel(label) {
    return /hex|glucose unit|Chain glucose|Branch glucose/i.test(label);
  }

  function moleculePartNote(type, el, color, index, partLabel) {
    var tag = el.tagName.toLowerCase();
    if (tag === "line" || el.getAttribute("fill") === "none" || !el.getAttribute("fill")) {
      return "";
    }
    if (type === "glycerol" && color === normalizeHex(MF.COLORS.glycerol)) {
      return MF.glycerolCarbonDetail(index);
    }
    if (type === "lipid" && index <= 3 && color === normalizeHex(MF.COLORS.glycerol)) {
      return MF.glycerolCarbonDetail(index);
    }
    if (type === "protein") return "flat chain · W 60 · L 10";
    if (type === "peptide") return "flat chain · W 60 · L 10";
    if (type === "fatty-acid" && color === normalizeHex(MF.COLORS["fatty-acid"])) {
      return MF.lipidTailNodeDetail(index);
    }
    if (type === "lipid" && index > 3 && color === normalizeHex(MF.COLORS.lipid)) {
      return MF.lipidTailNodeDetail(index - 3);
    }
    if (!MF.FLAT_HEX_SPECS[type]) return "";
    if (!isHexPartLabel(partLabel)) return "";
    var hexIndex = 0;
    if (type === "maltose" || type === "sucrose" || type === "lactose") {
      hexIndex = index;
    } else if (type === "starch") {
      hexIndex = index;
    } else {
      hexIndex = 1;
    }
    return MF.hexGeometryDetail(MF.flatHexSpecForPart(type, hexIndex));
  }

  function hexBottomLockNote() {
    if (!MF) return "";
    return MF.hexBottomLockDetail(50, 30, "reference");
  }

  function enzymePartNote(modelId, el, color, index, partLabel) {
    if (modelId === "pancreatic-lipase" && color === "#f5d565") {
      return MF.lipasePocketDetail(index);
    }
    if (color === "#f5d565") {
      if (modelId === "default" || modelId === "pancreatic-amylase") {
        return MF.amylaseToothLockDetail(index);
      }
      if (modelId === "maltase" || modelId === "sucrase" || modelId === "lactase") {
        return MF.disaccharidaseLockDetail(index);
      }
    }
    return "";
  }

  function measureSvgParts(svgMarkup, partLabelFn, partNoteFn) {
    var wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none";
    wrap.innerHTML = svgMarkup;
    document.body.appendChild(wrap);

    var svg = wrap.querySelector("svg");
    var parts = [];
    if (!svg) {
      document.body.removeChild(wrap);
      return parts;
    }

    var nodes = svg.querySelectorAll("path,circle,line,ellipse,rect,polygon");
    var colorCount = {};
    var i;
    var el;
    var bb;
    var fill;
    var stroke;
    var color;
    var key;

    for (i = 0; i < nodes.length; i += 1) {
      el = nodes[i];
      try {
        bb = el.getBBox();
      } catch (err) {
        continue;
      }
      if (bb.width < 0.05 && bb.height < 0.05) continue;

      fill = normalizeHex(el.getAttribute("fill"));
      stroke = normalizeHex(el.getAttribute("stroke"));
      color = fill && fill !== "none" ? fill : stroke;
      if (!color) continue;

      key = color + ":" + el.tagName;
      colorCount[key] = (colorCount[key] || 0) + 1;
      var partLabel = partLabelFn(el, color, colorCount[key]);
      parts.push({
        part: partLabel,
        color: color,
        width: bb.width,
        length: bb.height,
        radius: elementRadius(el),
        note: partNoteFn ? partNoteFn(el, color, colorCount[key], partLabel) : "",
      });
    }

    document.body.removeChild(wrap);
    return parts;
  }

  function getMoleculePartSpecs(type) {
    var inner = MF.renderFlatScene(type);
    if (!inner) return [];
    var svgMarkup =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + MF.W + " " + MF.H + '">' +
      inner + "</svg>";
    return measureSvgParts(svgMarkup, function (el, color, index) {
      return moleculePartLabel(type, el, color, index);
    }, function (el, color, index, partLabel) {
      return moleculePartNote(type, el, color, index, partLabel);
    });
  }

  function getEnzymePartSpecs(svgText, modelId) {
    return measureSvgParts(svgText, function (el, color, index) {
      return enzymePartLabel(el, color, index);
    }, function (el, color, index, partLabel) {
      return enzymePartNote(modelId, el, color, index, partLabel);
    });
  }

  function getMoleculeDimensions(type) {
    return { colorParts: getMoleculePartSpecs(type) };
  }

  function getEnzymeSpecs(model) {
    if (enzymeSpecCache[model.id]) {
      return Promise.resolve(enzymeSpecCache[model.id]);
    }
    return fetchText(model.href).then(function (svgText) {
      var specs = { colorParts: getEnzymePartSpecs(svgText, model.id) };
      enzymeSpecCache[model.id] = specs;
      return specs;
    });
  }

  function renderCardSpecsHtml(specs) {
    var parts = specs.colorParts || [];
    if (!parts.length) {
      return '<p class="spec-loading">No part data</p>';
    }

    var html =
      '<table class="card-size-table">' +
      "<thead><tr>" +
      "<th>Color part</th><th>W</th><th>L</th><th>R</th><th>Detail</th>" +
      "</tr></thead><tbody>";

    parts.forEach(function (part) {
      html +=
        "<tr>" +
        '<td class="part-name">' + swatchHtml(part.color) + part.part + "</td>" +
        '<td class="num">' + formatDim(part.width) + "</td>" +
        '<td class="num">' + formatDim(part.length) + "</td>" +
        '<td class="num">' + part.radius + "</td>" +
        '<td class="note edge-note">' + (part.note || "—") + "</td>" +
        "</tr>";
    });

    html += "</tbody></table>";
    html += '<p class="spec-unit">W = width, L = length, R = radius (SVG units). Hex: rot 0° pointy-top; bottom vertex = lock face.</p>';
    return html;
  }

  function buildModels() {
    var enzymes = [];
    var molecules = [];
    var i;

    if (!MF) return { enzymes: enzymes, molecules: molecules };

    for (i = 0; i < MF.ENZYME_TYPES.length; i += 1) {
      var enz = MF.ENZYME_TYPES[i];
      var href = MF.ENZYME_FLAT_ASSETS && MF.ENZYME_FLAT_ASSETS[enz.id];
      if (!href) continue;
      enzymes.push({
        id: enz.id,
        label: enz.label,
        category: "enzyme",
        subtitle: enz.equation,
        kind: "asset",
        href: href,
        fileName: enz.id + "-enzyme.png",
      });
    }

    for (i = 0; i < MF.FLAT_MOLECULE_TYPES.length; i += 1) {
      var mol = MF.FLAT_MOLECULE_TYPES[i];
      molecules.push({
        id: mol.id,
        label: mol.label,
        category: "molecule",
        subtitle: "Flat 2D schematic",
        kind: "rendered",
        fileName: mol.id + ".png",
      });
    }

    return { enzymes: enzymes, molecules: molecules };
  }

  function renderMoleculeCopySvg(type) {
    var bounds = MF.molBounds(type);
    var pad = 8;
    var inner = MF.renderFlatScene(type);
    if (!inner) return "";
    var vbX = bounds.minX - pad;
    var vbY = bounds.minY - pad;
    var vbW = bounds.maxX - bounds.minX + pad * 2;
    var vbH = bounds.maxY - bounds.minY + pad * 2;
    var outW = Math.round(vbW * COPY_SCALE);
    var outH = Math.round(vbH * COPY_SCALE);
    return (
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + outW + '" height="' + outH +
      '" viewBox="' + vbX + " " + vbY + " " + vbW + " " + vbH +
      '" role="img" aria-label="' + type + ' flat 2D model">' + inner + "</svg>"
    );
  }

  function renderSvgForModel(model) {
    if (model.kind === "rendered") {
      return Promise.resolve(renderMoleculeCopySvg(model.id));
    }
    return fetchText(model.href);
  }

  function dimensionsForModel(model, svgText) {
    if (model.kind === "rendered") {
      var bounds = MF.molBounds(model.id);
      var pad = 8;
      return {
        w: (bounds.maxX - bounds.minX + pad * 2) * COPY_SCALE,
        h: (bounds.maxY - bounds.minY + pad * 2) * COPY_SCALE,
      };
    }
    var dims = svgDimensionsFromText(svgText);
    return { w: dims.w * COPY_SCALE, h: dims.h * COPY_SCALE };
  }

  function copyModel(model) {
    return renderSvgForModel(model)
      .then(function (svgText) {
        if (typeof svgText !== "string") throw new Error("No SVG content");
        var dims = dimensionsForModel(model, svgText);
        return svgTextToPngBlob(svgText, dims.w, dims.h);
      })
      .then(function (pngBlob) {
        if (!navigator.clipboard || !window.ClipboardItem) {
          throw new Error("Clipboard API not supported in this browser");
        }
        return navigator.clipboard.write([
          new ClipboardItem({
            "image/png": Promise.resolve(pngBlob),
          }),
        ]);
      });
  }

  function populateCardSpecs(specHost, specs) {
    specHost.innerHTML = renderCardSpecsHtml(specs);
  }

  function createCard(model) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "model-card";
    card.setAttribute("data-id", model.id);
    card.setAttribute("data-category", model.category);
    card.setAttribute("aria-label", "Copy " + model.label + " as transparent PNG");

    var body = document.createElement("div");
    body.className = "model-card-body";

    var preview = document.createElement("div");
    preview.className = "model-preview";

    if (model.kind === "asset") {
      var img = document.createElement("img");
      img.src = model.href;
      img.alt = model.label;
      img.loading = "lazy";
      img.draggable = false;
      preview.appendChild(img);
    } else {
      preview.innerHTML = MF.renderFlatSvg(model.id, {
        background: false,
        width: 160,
        height: 100,
        scale: 1.2,
      });
    }

    var specs = document.createElement("div");
    specs.className = "model-specs";

    if (model.kind === "rendered") {
      populateCardSpecs(specs, getMoleculeDimensions(model.id));
    } else {
      specs.innerHTML = '<p class="spec-loading">Loading size…</p>';
      getEnzymeSpecs(model)
        .then(function (enzSpecs) {
          populateCardSpecs(specs, enzSpecs);
        })
        .catch(function () {
          specs.innerHTML = '<p class="spec-loading">Size unavailable</p>';
        });
    }

    body.appendChild(preview);
    body.appendChild(specs);

    var meta = document.createElement("div");
    meta.className = "model-meta";
    meta.innerHTML =
      '<span class="model-label">' + model.label + "</span>" +
      '<span class="model-sub">' + model.subtitle + "</span>" +
      '<span class="model-copy-hint">Click to copy PNG</span>';

    card.appendChild(body);
    card.appendChild(meta);

    card.addEventListener("click", function () {
      card.classList.add("is-copying");
      copyModel(model)
        .then(function () {
          showToast("Copied — paste as transparent PNG");
        })
        .catch(function (err) {
          showToast("Copy failed: " + (err && err.message ? err.message : "unknown error"), true);
        })
        .finally(function () {
          card.classList.remove("is-copying");
        });
    });

    return card;
  }

  function renderGrid(filter) {
    var grid = $("modelsGrid");
    if (!grid) return;
    var data = buildModels();
    var all = data.enzymes.concat(data.molecules);
    grid.innerHTML = "";

    all.forEach(function (model) {
      if (filter !== "all" && model.category !== filter) return;
      grid.appendChild(createCard(model));
    });

    var countEl = $("modelCount");
    if (countEl) {
      var visible = filter === "all" ? all.length : all.filter(function (m) { return m.category === filter; }).length;
      countEl.textContent = String(visible);
    }
  }

  function bindFilters() {
    var tabs = document.querySelectorAll("[data-filter]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        renderGrid(tab.getAttribute("data-filter") || "all");
      });
    });
  }

  function mount() {
    MF = global.MoleculeFlat2d;
    if (!MF) {
      showToast("MoleculeFlat2d failed to load", true);
      return;
    }
    bindFilters();
    renderGrid("all");
  }

  global.Enzyme2dModelsGallery = { mount: mount };
})(typeof window !== "undefined" ? window : globalThis);
