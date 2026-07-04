/**
 * Enzyme Factor — temperature, pH, and appearance for digestive enzymes.
 */
(function (global) {
  "use strict";

  var ENZYME_DEFINITIONS = [
    {
      id: "salivary-amylase",
      label: "Salivary amylase",
      location: "Mouth (saliva)",
      optTemp: 37,
      optPH: 6.8,
      phSpread: 1.4,
      tempDenature: 50,
      infoItems: [
        "Secreted in: Saliva (mouth)",
        "Substrate: Starch",
        "Product: Maltose",
        "Optimum temperature: 37°C",
        "Optimum pH: 6.8",
        "Role: Begins starch digestion in the mouth",
      ],
      wordEquation: "Starch → Maltose",
      appearanceMode: "protein",
    },
    {
      id: "pepsin",
      label: "Pepsin",
      location: "Stomach",
      optTemp: 37,
      optPH: 2.0,
      phSpread: 0.8,
      tempDenature: 55,
      infoItems: [
        "Secreted in: Gastric juice (stomach)",
        "Substrate: Proteins",
        "Product: Peptides",
        "Optimum temperature: 37°C",
        "Optimum pH: 2.0",
        "Role: Digests proteins in strongly acidic stomach conditions",
      ],
      wordEquation: "Proteins → Peptides",
      appearanceMode: "protein",
      proteinVariant: "pepsin",
      lowTempThreshold: 15,
    },
    {
      id: "pancreatic-amylase",
      label: "Pancreatic amylase",
      location: "Small intestine (pancreatic juice)",
      optTemp: 37,
      optPH: 7.0,
      phSpread: 1.5,
      tempDenature: 55,
      infoItems: [
        "Secreted in: Pancreatic juice",
        "Substrate: Starch",
        "Product: Maltose",
        "Optimum temperature: 37°C",
        "Optimum pH: 7.0",
        "Role: Continues starch digestion in the small intestine",
      ],
      wordEquation: "Starch → Maltose",
      appearanceMode: "protein",
      proteinVariant: "pancreatic-amylase",
    },
    {
      id: "pancreatic-lipase",
      label: "Pancreatic lipase",
      location: "Small intestine (pancreatic juice)",
      optTemp: 37,
      optPH: 8.0,
      phSpread: 1.2,
      tempDenature: 55,
      infoItems: [
        "Secreted in: Pancreatic juice",
        "Substrate: Lipids (fats)",
        "Product: Fatty acids + glycerol",
        "Optimum temperature: 37°C",
        "Optimum pH: 8.0",
        "Role: Breaks down fats in slightly alkaline intestinal conditions",
      ],
      wordEquation: "Lipids → Fatty acids + Glycerol",
      appearanceMode: "protein",
      proteinVariant: "pancreatic-lipase",
      lowTempThreshold: 15,
    },
    {
      id: "protease",
      label: "Protease",
      location: "Small intestine (pancreatic juice)",
      optTemp: 37,
      optPH: 8.0,
      phSpread: 1.3,
      tempDenature: 55,
      infoItems: [
        "Secreted in: Pancreatic juice (e.g. trypsin)",
        "Substrate: Proteins / peptides",
        "Product: Smaller peptides",
        "Optimum temperature: 37°C",
        "Optimum pH: 8.0",
        "Role: Completes protein digestion in the small intestine",
      ],
      wordEquation: "Proteins / Peptides → Smaller peptides",
      appearanceMode: "protein",
      proteinVariant: "protease",
      lowTempThreshold: 15,
    },
    {
      id: "maltase",
      label: "Maltase",
      location: "Small intestine (intestinal epithelium)",
      optTemp: 37,
      optPH: 6.5,
      phSpread: 1.4,
      tempDenature: 50,
      infoItems: [
        "Found on: Intestinal epithelium (brush border)",
        "Substrate: Maltose",
        "Product: Glucose",
        "Optimum temperature: 37°C",
        "Optimum pH: 6.5",
        "Role: Splits maltose into glucose molecules",
      ],
      wordEquation: "Maltose → Glucose + Glucose",
      appearanceMode: "protein",
      proteinVariant: "maltase",
      lowTempThreshold: 15,
    },
    {
      id: "sucrase",
      label: "Sucrase",
      location: "Small intestine (intestinal epithelium)",
      optTemp: 37,
      optPH: 6.2,
      phSpread: 1.4,
      tempDenature: 50,
      infoItems: [
        "Found on: Intestinal epithelium (brush border)",
        "Substrate: Sucrose",
        "Product: Glucose + fructose",
        "Optimum temperature: 37°C",
        "Optimum pH: 6.2",
        "Role: Breaks sucrose (table sugar) into glucose and fructose",
      ],
      wordEquation: "Sucrose → Glucose + Fructose",
      appearanceMode: "protein",
      proteinVariant: "sucrase",
      lowTempThreshold: 15,
    },
    {
      id: "lactase",
      label: "Lactase",
      location: "Small intestine (intestinal epithelium)",
      optTemp: 37,
      optPH: 6.5,
      phSpread: 1.4,
      tempDenature: 50,
      infoItems: [
        "Found on: Intestinal epithelium (brush border)",
        "Substrate: Lactose",
        "Product: Glucose + galactose",
        "Optimum temperature: 37°C",
        "Optimum pH: 6.5",
        "Role: Splits lactose (milk sugar) into glucose and galactose",
      ],
      wordEquation: "Lactose → Glucose + Galactose",
      appearanceMode: "protein",
      proteinVariant: "lactase",
      lowTempThreshold: 15,
    },
  ];

  var APPEARANCE_KEYS = ["current", "optimal", "lowTemp", "highTemp", "extremePh"];
  var APPEARANCE_LABELS = {
    current: "Current conditions (from sliders)",
    optimal: "Optimal conditions",
    lowTemp: "Low temperature",
    highTemp: "High temperature (denaturing)",
    extremePh: "Extreme pH",
  };

  var i;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function getEnzyme(id) {
    for (i = 0; i < ENZYME_DEFINITIONS.length; i += 1) {
      if (ENZYME_DEFINITIONS[i].id === id) return ENZYME_DEFINITIONS[i];
    }
    return ENZYME_DEFINITIONS[0];
  }

  function tempActivity(t, enzyme) {
    var optimal = enzyme.optTemp;
    if (t <= optimal) return clamp(15 + (t / optimal) * 85, 0, 100);
    var decay = (t - optimal) / (enzyme.tempDenature - optimal + 4);
    return clamp(100 * Math.exp(-decay * 2.2), 0, 100);
  }

  function phActivity(ph, enzyme) {
    var spread = enzyme.phSpread;
    return clamp(100 * Math.exp(-Math.pow(ph - enzyme.optPH, 2) / (2 * spread * spread)), 0, 100);
  }

  function buildTempLabels() {
    var labels = [];
    for (i = 0; i <= 70; i += 5) labels.push(i);
    return labels;
  }

  function buildPhLabels() {
    var labels = [];
    for (i = 1; i <= 11; i += 1) labels.push(i);
    return labels;
  }

  function tempLabel(t, enzyme) {
    if (t < 10) return "Low temperature: molecules move slowly; enzyme activity is low but the enzyme is usually not denatured.";
    if (t < enzyme.optTemp - 8) return "Temperature rising: more collisions; activity increases.";
    if (t <= enzyme.optTemp + 5) return "Near optimum temperature (~" + enzyme.optTemp + "°C): activity is highest for " + enzyme.label + ".";
    if (t <= enzyme.tempDenature) return "High temperature: enzyme begins to denature; activity falls.";
    return "Very high temperature: denaturation — the active site loses its shape and activity cannot recover.";
  }

  function phLabel(ph, enzyme) {
    var opt = enzyme.optPH;
    if (ph < opt - 2) return "Far from optimum pH: " + enzyme.label + " has very low activity in this environment.";
    if (ph < opt - 0.8) return "Acidic relative to optimum: activity is reduced.";
    if (ph <= opt + 0.8) return "Near optimum pH (~" + opt + "): activity is highest.";
    if (ph < opt + 2) return "Alkaline relative to optimum: activity decreases.";
    return "Extreme pH: hydrogen bonds break; enzyme structure is disrupted.";
  }

  function calloutClass(activity, isDanger) {
    if (isDanger) return "callout danger";
    if (activity < 30) return "callout danger";
    if (activity < 60) return "callout warn";
    return "callout";
  }

  function statClass(val) {
    if (val > 60) return "stat-val";
    if (val > 30) return "stat-val warn";
    return "stat-val danger";
  }

  function shapes() {
    return global.ENZYME_SHAPES || {};
  }

  function appearanceState(temp, ph, enzyme) {
    var ta = tempActivity(temp, enzyme);
    var pa = phActivity(ph, enzyme);
    var combined = ta * pa / 100;
    var denatured = temp > enzyme.tempDenature - 2 || pa < 25 || (temp > enzyme.optTemp + 12 && ta < 40);
    var lowTemp = temp < 12;
    var optimal = combined >= 75 && !denatured;
    var partial = !optimal && !denatured && combined >= 30;
    var label;
    var detail;

    if (denatured) {
      label = "Denatured";
      detail = "Extreme temperature or pH has unfolded the enzyme. The active site no longer fits the substrate.";
    } else if (lowTemp && combined < 55) {
      label = "Low activity (cold)";
      detail = "The enzyme keeps its shape but molecules move slowly, so fewer successful collisions occur.";
    } else if (optimal) {
      label = "Optimal shape";
      detail = "The enzyme maintains its 3D structure; the active site fits the substrate well.";
    } else if (partial) {
      label = "Sub-optimal conditions";
      detail = "The enzyme still works but activity is reduced because conditions are away from the optimum.";
    } else {
      label = "Very low activity";
      detail = "Conditions are unfavourable; little or no catalysis occurs.";
    }

    return {
      ta: ta,
      pa: pa,
      combined: combined,
      denatured: denatured,
      lowTemp: lowTemp,
      optimal: optimal,
      label: label,
      detail: detail,
      temp: temp,
      ph: ph,
    };
  }

  function scenarioForKey(key, enzyme, sliderTemp, sliderPh) {
    if (key === "current") return appearanceState(sliderTemp, sliderPh, enzyme);
    if (key === "optimal") return appearanceState(enzyme.optTemp, enzyme.optPH, enzyme);
    if (key === "lowTemp") return appearanceState(5, enzyme.optPH, enzyme);
    if (key === "highTemp") return appearanceState(enzyme.tempDenature + 8, enzyme.optPH, enzyme);
    return appearanceState(enzyme.optTemp, enzyme.optPH < 4 ? 10 : 2, enzyme);
  }

  function appearanceWeights(temp, ph, enzyme) {
    var optT = enzyme.optTemp;
    var optP = enzyme.optPH;
    var wDen = 0;

    if (temp >= enzyme.tempDenature - 6) {
      wDen = Math.max(wDen, clamp((temp - (enzyme.tempDenature - 6)) / 12, 0, 1));
    }

    var phDist = Math.abs(ph - optP);
    if (phDist > 2) {
      wDen = Math.max(wDen, clamp((phDist - 2) / 2.2, 0, 1));
    }

    var wLow = 0;
    var lowCutoff =
      enzyme.lowTempThreshold != null ? enzyme.lowTempThreshold : optT - 8;
    if (temp <= lowCutoff && wDen < 0.45) {
      wLow = clamp(1 - temp / Math.max(lowCutoff, 1), 0, 1);
    }

    var wOpt =
      Math.exp(-Math.pow(temp - optT, 2) / 110) *
      Math.exp(-Math.pow(ph - optP, 2) / 2.2) *
      (1 - wDen);

    wLow = wLow * (1 - wDen);
    wOpt = wOpt * (1 - wLow * 0.85);

    var sum = wLow + wOpt + wDen;
    if (sum < 0.001) {
      return { lowTemp: 0, optimal: 1, denatured: 0 };
    }

    return {
      lowTemp: wLow / sum,
      optimal: wOpt / sum,
      denatured: wDen / sum,
    };
  }

  function appearanceLabelFromWeights(weights, state) {
    if (weights.denatured > 0.52) {
      return {
        label: "Denatured",
        detail:
          "Extreme temperature or pH has unfolded the enzyme. The active site no longer fits the substrate.",
      };
    }
    if (weights.lowTemp > 0.52) {
      return {
        label: "Low activity (cold)",
        detail:
          "The enzyme keeps its shape but molecules move slowly, so fewer successful collisions occur.",
      };
    }
    if (weights.optimal > 0.52) {
      return {
        label: "Optimal shape",
        detail:
          "The enzyme maintains its 3D structure; the active site fits the substrate well.",
      };
    }
    return { label: state.label, detail: state.detail };
  }

  function renderHeaderBlock(enzyme) {
    var visualOnly = enzyme.appearanceMode === "protein";
    var asideInner = visualOnly
      ? '<div class="appearance-panel-box appearance-panel-box--protein" id="ef-appearanceBox"></div>'
      : '<h3 class="appearance-panel-title">Enzyme appearance</h3>' +
        '<p class="desc appearance-panel-desc" id="ef-appearanceDesc"></p>' +
        '<p class="appearance-step-label" id="ef-appearanceStepLabel"></p>' +
        '<div class="appearance-panel-box appearance-tap" id="ef-appearanceBox" tabindex="0" role="button" aria-label="Enzyme appearance"></div>' +
        '<p class="appearance-tap-hint" id="ef-appearanceHint">Tap / click the image to view the next condition</p>';

    return (
      '<div class="enzyme-factor-header">' +
      '<div class="enzyme-info-col">' +
      renderInfoBlock(enzyme) +
      "</div>" +
      '<aside class="enzyme-appearance-col' +
      (visualOnly ? " enzyme-appearance-col--visual-only" : "") +
      '">' +
      asideInner +
      "</aside>" +
      "</div>" +
      renderWordEquation(enzyme)
    );
  }

  var proteinConditionAnim = null;
  var proteinConditionEnzymeId = null;

  function stopProteinCondition() {
    if (proteinConditionAnim) {
      proteinConditionAnim.destroy();
      proteinConditionAnim = null;
    }
    proteinConditionEnzymeId = null;
  }

  function mountProteinCondition(boxEl, enzyme) {
    stopProteinCondition();
    if (global.EnzymeConditionAnimation) {
      proteinConditionAnim = new global.EnzymeConditionAnimation(boxEl, {
        variant: enzyme.proteinVariant || "default",
      });
      proteinConditionEnzymeId = enzyme.id;
    }
  }

  function updateProteinCondition(weights) {
    if (proteinConditionAnim) {
      proteinConditionAnim.setFromWeights(weights);
    }
  }

  function enzymeAppearanceSvg(state, enzyme, title, compact) {
    var S = shapes();
    var enzymePath =
      S.enzyme ||
      "M 8 72 L 132 72 C 150 72 156 44 144 24 L 108 24 L 76 24 L 76 36 A 10 10 0 0 0 56 36 L 56 24 L 36 24 L 30 36 L 24 24 L 12 24 C 0 44 -2 72 8 72 Z";
    var denaturedPath =
      "M 10 78 Q 30 62 50 78 T 90 78 T 130 78 L 128 70 Q 110 58 90 70 T 50 70 T 12 70 Z" +
      " M 20 68 Q 40 52 60 64 T 100 64 T 120 64";
    var fill = (S.colors && S.colors.enzyme) || "#89C2EB";
    var path = enzymePath;
    var transform = "translate(194, 88) scale(2.7)";
    var opacity = 1;
    var stroke = "none";
    var strokeWidth = 0;
    var badgeBg = "#e8f2fa";
    var badgeColor = "#3685bf";
    var header = title || "Enzyme appearance";
    var panelBg = compact ? "#ffffff" : "#f0f4f8";
    var titleSize = compact ? 10 : 12;
    var badgeW = compact ? 150 : 180;
    var badgeH = compact ? 22 : 26;
    var badgeY = compact ? 172 : 168;
    var badgeTextY = compact ? 187 : 185;
    var metaSize = compact ? 8.5 : 9.5;
    var metaY = compact ? 206 : 206;

    if (state.denatured) {
      path = denaturedPath;
      fill = "#c8c8c8";
      transform = "translate(194, 96) scale(2.7)";
      opacity = 0.95;
      stroke = "#a04040";
      strokeWidth = 1.5;
      badgeBg = "#fdeef1";
      badgeColor = "#cf2d56";
    } else if (state.lowTemp && state.combined < 55) {
      fill = "#b8d9f2";
      opacity = 0.75;
      badgeBg = "#eef4fa";
      badgeColor = "#5a7a96";
    } else if (!state.optimal) {
      fill = "#e8b060";
      badgeBg = "#fef6ea";
      badgeColor = "#c08532";
    }

    return (
      '<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      enzyme.label +
      ' appearance">' +
      '<rect width="520" height="220" fill="' +
      panelBg +
      '" rx="8"/>' +
      '<text x="260" y="28" text-anchor="middle" fill="#5a6270" font-size="' +
      titleSize +
      '" font-weight="600">' +
      header +
      "</text>" +
      '<g transform="' +
      transform +
      '" opacity="' +
      opacity +
      '">' +
      '<path d="' +
      path +
      '" fill="' +
      fill +
      '" stroke="' +
      stroke +
      '" stroke-width="' +
      strokeWidth +
      '" stroke-dasharray="' +
      (state.denatured ? "4 3" : "none") +
      '"/>' +
      "</g>" +
      '<rect x="' +
      (260 - badgeW / 2) +
      '" y="' +
      badgeY +
      '" width="' +
      badgeW +
      '" height="' +
      badgeH +
      '" rx="13" fill="' +
      badgeBg +
      '"/>' +
      '<text x="260" y="' +
      badgeTextY +
      '" text-anchor="middle" fill="' +
      badgeColor +
      '" font-size="' +
      (compact ? 10 : 11) +
      '" font-weight="700">' +
      state.label +
      "</text>" +
      '<text x="260" y="' +
      metaY +
      '" text-anchor="middle" fill="#5a6270" font-size="' +
      metaSize +
      '">' +
      state.temp +
      "°C · pH " +
      state.ph +
      " · " +
      Math.round(state.combined) +
      "% activity</text>" +
      "</svg>"
    );
  }

  function setupCanvas(canvas) {
    var rect = canvas.getBoundingClientRect();
    var w = Math.round(rect.width);
    var h = Math.round(rect.height);
    if (w < 2) w = canvas.parentElement ? canvas.parentElement.clientWidth : 400;
    if (h < 2) h = 240;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    var ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  function drawLineChart(canvas, opts) {
    if (!canvas) return;
    var setup = setupCanvas(canvas);
    if (!setup) return;
    var ctx = setup.ctx;
    var w = setup.w;
    var h = setup.h;

    var xMin = opts.xMin;
    var xMax = opts.xMax;
    var xStep = opts.xStep;
    var yStep = 10;
    var yMin = 0;
    var yMax = 100;
    var pad = { l: 48, r: 20, t: 20, b: 44 };
    var plotW = w - pad.l - pad.r;
    var plotH = h - pad.t - pad.b;
    var lineLabels = opts.lineLabels || opts.labels;
    var lineData = opts.lineData || opts.data;
    var color = opts.color;
    var markerX = opts.markerX;
    var markerY = opts.markerY;
    var xUnit = opts.xUnit || "";
    var j;
    var x;
    var y;
    var tick;

    function xToPx(val) {
      return pad.l + ((val - xMin) / (xMax - xMin)) * plotW;
    }

    function yToPx(val) {
      return pad.t + plotH - ((val - yMin) / (yMax - yMin)) * plotH;
    }

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "#e8ebf0";
    ctx.lineWidth = 1;
    for (tick = yMin; tick <= yMax; tick += yStep) {
      y = yToPx(tick);
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + plotW, y);
      ctx.stroke();
    }
    for (tick = xMin; tick <= xMax; tick += xStep) {
      x = xToPx(tick);
      ctx.beginPath();
      ctx.moveTo(x, pad.t);
      ctx.lineTo(x, pad.t + plotH);
      ctx.stroke();
    }

    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.l, yToPx(yMax));
    ctx.lineTo(pad.l, yToPx(yMin));
    ctx.moveTo(pad.l, yToPx(yMin));
    ctx.lineTo(pad.l + plotW, yToPx(yMin));
    ctx.stroke();

    ctx.fillStyle = "#666";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (tick = yMin; tick <= yMax; tick += yStep) {
      ctx.fillText(tick + "%", pad.l - 6, yToPx(tick));
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (tick = xMin; tick <= xMax; tick += xStep) {
      ctx.fillText(tick + xUnit, xToPx(tick), yToPx(yMin) + 6);
    }

    if (opts.xAxisLabel) {
      ctx.fillStyle = "#555";
      ctx.font = "11px sans-serif";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(opts.xAxisLabel, pad.l + plotW / 2, h - 4);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (j = 0; j < lineData.length; j += 1) {
      x = xToPx(+lineLabels[j]);
      y = yToPx(lineData[j]);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (markerX !== undefined && markerY !== undefined) {
      var mx = xToPx(clamp(markerX, xMin, xMax));
      var my = yToPx(clamp(markerY, yMin, yMax));

      ctx.strokeStyle = "#cf2d56";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(mx, yToPx(yMin));
      ctx.lineTo(mx, yToPx(yMax));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pad.l, my);
      ctx.lineTo(pad.l + plotW, my);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#cf2d56";
      ctx.beginPath();
      ctx.arc(mx, my, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#cf2d56";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText(Math.round(markerY) + "%", mx + 8, my - 4);
    }
  }

  function buildTempLineData(enzyme) {
    var labels = [];
    var data = [];
    for (i = 0; i <= 70; i += 1) {
      labels.push(i);
      data.push(tempActivity(i, enzyme));
    }
    return { labels: labels, data: data };
  }

  function buildPhLineData(enzyme) {
    var labels = [];
    var data = [];
    for (i = 0; i <= 100; i += 1) {
      var ph = 1 + i * 0.1;
      if (ph > 11) break;
      labels.push(+ph.toFixed(1));
      data.push(phActivity(ph, enzyme));
    }
    return { labels: labels, data: data };
  }

  function renderWordEquation(enzyme) {
    var parts = enzyme.wordEquation.split("→");
    var reactant = parts[0] ? parts[0].trim() : "";
    var product = parts[1] ? parts[1].trim() : "";
    return (
      '<div class="enzyme-word-equation" aria-label="' +
      enzyme.wordEquation +
      ", catalysed by " +
      enzyme.label +
      '">' +
      '<span class="eq-reactant">' +
      reactant +
      "</span>" +
      '<span class="eq-arrow-wrap">' +
      '<span class="eq-enzyme-on-arrow">' +
      enzyme.label +
      "</span>" +
      '<span class="eq-arrow" aria-hidden="true">→</span>' +
      "</span>" +
      '<span class="eq-product">' +
      product +
      "</span>" +
      "</div>"
    );
  }

  function renderInfoBlock(enzyme) {
    var items = enzyme.infoItems
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");
    return (
      '<ul class="enzyme-info-checklist">' +
      items +
      "</ul>"
    );
  }

  var currentEnzymeId = ENZYME_DEFINITIONS[0].id;
  var appearanceIndex = 0;
  var mounted = false;
  var tabsEl = null;
  var contentEl = null;
  var tempLabels = buildTempLabels();
  var phLabels = buildPhLabels();

  function renderTabs() {
    if (!tabsEl) return;
    tabsEl.innerHTML = "";
    ENZYME_DEFINITIONS.forEach(function (enzyme) {
      var btn = document.createElement("button");
      btn.className = "btn ghost" + (enzyme.id === currentEnzymeId ? " primary" : "");
      btn.textContent = enzyme.label;
      btn.dataset.enzymeId = enzyme.id;
      btn.addEventListener("click", function () {
        currentEnzymeId = enzyme.id;
        appearanceIndex = 0;
        renderTabs();
        renderContent();
        updateCurrent();
      });
      tabsEl.appendChild(btn);
    });
  }

  function cycleAppearance() {
    appearanceIndex = (appearanceIndex + 1) % APPEARANCE_KEYS.length;
    updateAppearanceView();
  }

  function updateAppearanceView() {
    var enzyme = getEnzyme(currentEnzymeId);
    var tempSlider = document.getElementById("ef-tempSlider");
    var phSlider = document.getElementById("ef-phSlider");
    if (!tempSlider || !phSlider) return;

    var state = appearanceState(+tempSlider.value, +phSlider.value, enzyme);
    var labelEl = document.getElementById("ef-appearanceStepLabel");
    var descEl = document.getElementById("ef-appearanceDesc");
    var boxEl = document.getElementById("ef-appearanceBox");
    var hintEl = document.getElementById("ef-appearanceHint");

    if (enzyme.appearanceMode === "protein") {
      var weights = appearanceWeights(state.temp, state.ph, enzyme);
      if (boxEl) {
        boxEl.classList.remove("appearance-tap");
        boxEl.removeAttribute("tabindex");
        boxEl.removeAttribute("role");
        if (!proteinConditionAnim || proteinConditionEnzymeId !== enzyme.id) {
          mountProteinCondition(boxEl, enzyme);
        }
        updateProteinCondition(weights);
      }
      return;
    }

    stopProteinCondition();

    var key = APPEARANCE_KEYS[appearanceIndex];
    var presetState = scenarioForKey(key, enzyme, +tempSlider.value, +phSlider.value);

    if (labelEl) labelEl.textContent = APPEARANCE_LABELS[key];
    if (descEl) descEl.textContent = presetState.detail;
    if (hintEl) {
      hintEl.textContent = "Tap / click the image to view the next condition";
    }
    if (boxEl) {
      boxEl.classList.add("appearance-tap");
      boxEl.setAttribute("tabindex", "0");
      boxEl.setAttribute("role", "button");
      boxEl.innerHTML = enzymeAppearanceSvg(presetState, enzyme, APPEARANCE_LABELS[key], true);
      boxEl.setAttribute("aria-label", APPEARANCE_LABELS[key] + ". Tap for next condition.");
    }
  }

  function renderContent() {
    if (!contentEl) return;
    stopProteinCondition();
    var enzyme = getEnzyme(currentEnzymeId);
    contentEl.innerHTML =
      renderHeaderBlock(enzyme) +
      '<div class="factor-two-col">' +
      '<div class="factor-sub-section">' +
      '<h3 class="section-title">1. Temperature</h3>' +
      '<div class="slider-group">' +
      '<div class="slider-head"><label>Temperature</label><span class="badge" id="ef-tempBadge">37°C</span></div>' +
      '<input type="range" id="ef-tempSlider" min="0" max="70" step="1" value="37" />' +
      '<div class="slider-ends"><span>0°C</span><span>70°C</span></div>' +
      '<div class="callout" id="ef-tempCallout"></div>' +
      "</div>" +
      '<div class="stat-row" style="margin-bottom:10px;">' +
      '<div class="stat"><div class="stat-val" id="ef-tempActVal">100%</div><div class="stat-label">Temperature activity</div></div>' +
      "</div>" +
      '<div class="card">' +
      '<div class="card-head">' +
      enzyme.label +
      " — activity vs temperature</div>" +
      '<div class="card-body" style="padding-top:10px;">' +
      '<canvas class="chart" id="ef-tempChart"></canvas>' +
      '<p class="chart-caption">Y: 10% · X: 5°C · Optimum ~' +
      enzyme.optTemp +
      "°C</p>" +
      "</div></div></div>" +
      '<div class="factor-sub-section">' +
      '<h3 class="section-title">2. pH</h3>' +
      '<div class="slider-group">' +
      '<div class="slider-head"><label>pH</label><span class="badge" id="ef-phBadge">7.0</span></div>' +
      '<input type="range" id="ef-phSlider" min="1" max="11" step="0.1" value="' +
      enzyme.optPH +
      '" />' +
      '<div class="slider-ends"><span>1</span><span>11</span></div>' +
      '<div class="callout" id="ef-phCallout"></div>' +
      "</div>" +
      '<div class="stat-row" style="margin-bottom:10px;">' +
      '<div class="stat"><div class="stat-val" id="ef-phActVal">100%</div><div class="stat-label">pH activity</div></div>' +
      '<div class="stat"><div class="stat-val" id="ef-combinedVal">100%</div><div class="stat-label">Combined (est.)</div></div>' +
      "</div>" +
      '<div class="card">' +
      '<div class="card-head">' +
      enzyme.label +
      " — activity vs pH</div>" +
      '<div class="card-body" style="padding-top:10px;">' +
      '<canvas class="chart" id="ef-phChart"></canvas>' +
      '<p class="chart-caption">Y: 10% · X: 1 pH · Optimum ~' +
      enzyme.optPH +
      "</p>" +
      "</div></div></div>" +
      "</div>";

    document.getElementById("ef-tempSlider").addEventListener("input", updateCurrent);
    document.getElementById("ef-phSlider").addEventListener("input", updateCurrent);

    var appearanceBox = document.getElementById("ef-appearanceBox");
    if (appearanceBox) {
      appearanceBox.addEventListener("click", function () {
        if (getEnzyme(currentEnzymeId).appearanceMode === "protein") return;
        cycleAppearance();
      });
      appearanceBox.addEventListener("keydown", function (e) {
        if (getEnzyme(currentEnzymeId).appearanceMode === "protein") return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cycleAppearance();
        }
      });
    }
  }

  function updateCurrent() {
    var enzyme = getEnzyme(currentEnzymeId);
    var tempSlider = document.getElementById("ef-tempSlider");
    var phSlider = document.getElementById("ef-phSlider");
    if (!tempSlider || !phSlider) return;

    var t = +tempSlider.value;
    var ph = +phSlider.value;
    var ta = tempActivity(t, enzyme);
    var pa = phActivity(ph, enzyme);
    var comb = Math.round((ta * pa) / 100);

    document.getElementById("ef-tempBadge").textContent = t + "°C";
    document.getElementById("ef-phBadge").textContent = ph.toFixed(1);

    var tc = document.getElementById("ef-tempCallout");
    tc.textContent = tempLabel(t, enzyme);
    tc.className = calloutClass(ta, t > enzyme.tempDenature);

    var pc = document.getElementById("ef-phCallout");
    pc.textContent = phLabel(ph, enzyme);
    pc.className = calloutClass(pa, pa < 20);

    var tempActEl = document.getElementById("ef-tempActVal");
    tempActEl.textContent = Math.round(ta) + "%";
    tempActEl.className = statClass(ta);

    var phActEl = document.getElementById("ef-phActVal");
    phActEl.textContent = Math.round(pa) + "%";
    phActEl.className = statClass(pa);

    var combEl = document.getElementById("ef-combinedVal");
    combEl.textContent = comb + "%";
    combEl.className = statClass(comb);

    var tempLine = buildTempLineData(enzyme);
    var phLine = buildPhLineData(enzyme);

    drawLineChart(document.getElementById("ef-tempChart"), {
      labels: tempLabels,
      lineLabels: tempLine.labels,
      lineData: tempLine.data,
      color: "#3685bf",
      markerX: t,
      markerY: ta,
      xMin: 0,
      xMax: 70,
      xStep: 5,
      xUnit: "°C",
      xAxisLabel: "Temperature (°C)",
    });

    drawLineChart(document.getElementById("ef-phChart"), {
      labels: phLabels,
      lineLabels: phLine.labels,
      lineData: phLine.data,
      color: "#1f8a65",
      markerX: ph,
      markerY: pa,
      xMin: 1,
      xMax: 11,
      xStep: 1,
      xUnit: "",
      xAxisLabel: "pH",
    });

    updateAppearanceView();
  }

  function mount(tabsContainer, contentContainer) {
    tabsEl = tabsContainer;
    contentEl = contentContainer;
    mounted = true;
    renderTabs();
    renderContent();
    requestAnimationFrame(updateCurrent);
  }

  function refresh() {
    if (!mounted) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(updateCurrent);
    });
  }

  global.EnzymeFactorDemos = {
    mount: mount,
    refresh: refresh,
    definitions: ENZYME_DEFINITIONS,
    tempActivity: tempActivity,
    phActivity: phActivity,
    stopProteinCondition: stopProteinCondition,
  };
})(typeof window !== "undefined" ? window : globalThis);
