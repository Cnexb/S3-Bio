/**
 * Five-properties interactive demos (Reusable, Small amount, Specific, Biological catalyst).
 * Keep all property animation logic here — NOT in enzyme-interactive.html.
 */
(function (global) {
  "use strict";

  var propAnimFrame = null;
  var catEaAnimFrame = null;
  var reusableCount = 0;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function propEase(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  function specEaseInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function lerpPropColor(c0, c1, t) {
    t = clamp(t, 0, 1);
    var r0 = parseInt(c0.slice(1, 3), 16);
    var g0 = parseInt(c0.slice(3, 5), 16);
    var b0 = parseInt(c0.slice(5, 7), 16);
    var r1 = parseInt(c1.slice(1, 3), 16);
    var g1 = parseInt(c1.slice(3, 5), 16);
    var b1 = parseInt(c1.slice(5, 7), 16);
    function hex(v) {
      return v.toString(16).padStart(2, "0");
    }
    return (
      "#" +
      hex(Math.round(r0 + (r1 - r0) * t)) +
      hex(Math.round(g0 + (g1 - g0) * t)) +
      hex(Math.round(b0 + (b1 - b0) * t))
    );
  }

  function shapes() {
    return global.ENZYME_SHAPES || {};
  }

  function enzymeSvg(x, y) {
    var S = shapes();
    var blue = (S.colors && S.colors.enzyme) || "#89C2EB";
    var enzymePath =
      S.enzyme ||
      "M 8 72 L 132 72 C 150 72 156 44 144 24 L 108 24 L 76 24 L 76 36 A 10 10 0 0 0 56 36 L 56 24 L 36 24 L 30 36 L 24 24 L 12 24 C 0 44 -2 72 8 72 Z";
    var lx = (S.labels && S.labels.enzyme && S.labels.enzyme.x) || 70;
    var ly = (S.labels && S.labels.enzyme && S.labels.enzyme.y) || 58;
    return (
      '<g transform="translate(' +
      x +
      "," +
      y +
      ')"><path d="' +
      enzymePath +
      '" fill="' +
      blue +
      '" stroke="none"/><text x="' +
      lx +
      '" y="' +
      ly +
      '" text-anchor="middle" fill="#4a7a9e" font-size="10">enzyme</text></g>'
    );
  }

  function substrateSvg(x, y, showLabel) {
    var S = shapes();
    var red = (S.colors && S.colors.substrate) || "#F88A8A";
    var path =
      S.substrate ||
      "M 12 54 L 24 54 L 30 66 L 36 54 L 56 54 L 56 66 A 10 10 0 0 1 76 66 L 76 54 A 42 42 0 0 0 12 54 Z";
    var lx = (S.labels && S.labels.substrate && S.labels.substrate.x) || 44;
    var ly = (S.labels && S.labels.substrate && S.labels.substrate.y) || 30;
    var label = showLabel
      ? '<text x="' +
        lx +
        '" y="' +
        ly +
        '" text-anchor="middle" fill="#c04040" font-size="8" font-weight="600">substrate</text>'
      : "";
    return (
      '<g transform="translate(' +
      x +
      "," +
      y +
      ')"><path d="' +
      path +
      '" fill="' +
      red +
      '" stroke="none"/>' +
      label +
      "</g>"
    );
  }

  function wrongSubstrateSvg(x, y) {
    var S = shapes();
    var green = (S.colors && S.colors.wrongSubstrate) || "#52B961";
    var path =
      S.wrongSubstrate ||
      "M 12 66 L 12 54 A 32 32 0 0 0 76 54 L 76 66 L 60 66 L 60 54 L 28 54 L 28 66 Z";
    return (
      '<g transform="translate(' +
      x +
      "," +
      y +
      ') rotate(180 44 60)"><path d="' +
      path +
      '" fill="' +
      green +
      '" stroke="#222" stroke-width="1.5"/></g>'
    );
  }

  function productsPropSvg(x, y, purTx, yelTx, lift, mix, uid) {
    var S = shapes();
    var path =
      S.substrate ||
      "M 12 54 L 24 54 L 30 66 L 36 54 L 56 54 L 56 66 A 10 10 0 0 1 76 66 L 76 54 A 42 42 0 0 0 12 54 Z";
    var red = (S.colors && S.colors.substrate) || "#F88A8A";
    var purple = lerpPropColor(red, (S.colors && S.colors.productA) || "#9B8EC4", mix);
    var yellow = lerpPropColor(red, (S.colors && S.colors.productB) || "#E8B84A", mix);
    var splitX = S.splitX != null ? S.splitX : 56;
    return (
      '<g transform="translate(' +
      x +
      "," +
      (y - lift) +
      ')"><defs><clipPath id="' +
      uid +
      '-pl"><rect x="0" y="0" width="' +
      splitX +
      '" height="100"/></clipPath><clipPath id="' +
      uid +
      '-pr"><rect x="' +
      splitX +
      '" y="0" width="24" height="100"/></clipPath></defs><g transform="translate(' +
      purTx +
      ',0)" clip-path="url(#' +
      uid +
      '-pl)"><path d="' +
      path +
      '" fill="' +
      purple +
      '" stroke="none"/></g><g transform="translate(' +
      yelTx +
      ',0)" clip-path="url(#' +
      uid +
      '-pr)"><path d="' +
      path +
      '" fill="' +
      yellow +
      '" stroke="none"/></g></g>'
    );
  }

  function specFeedbackSvg(kind, cx, cy) {
    if (kind === "tick") {
      return (
        '<g transform="translate(' +
        cx +
        "," +
        cy +
        ')"><circle r="18" fill="#1f8a65" opacity="0.15"/><circle r="14" fill="none" stroke="#1f8a65" stroke-width="2"/>' +
        '<path d="M -6 2 L -1 8 L 8 -6" fill="none" stroke="#1f8a65" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>'
      );
    }
    return (
      '<g transform="translate(' +
      cx +
      "," +
      cy +
      ')"><circle r="18" fill="#cf2d56" opacity="0.12"/><circle r="14" fill="none" stroke="#cf2d56" stroke-width="2"/>' +
      '<path d="M -6 -6 L 6 6 M 6 -6 L -6 6" stroke="#cf2d56" stroke-width="2.5" stroke-linecap="round"/></g>'
    );
  }

  function specLayout() {
    var S = shapes();
    var L = S.layout || {};
    var viewW = 300;
    var enzX = Math.round(viewW / 2 - 76);
    var complexY =
      L.sub && L.sub.complexY != null
        ? L.sub.complexY
        : (L.enz && L.enz.y != null ? L.enz.y : 82) + 24 - 54;
    return {
      viewW: viewW,
      viewH: 185,
      enzX: enzX,
      enzY: L.enz && L.enz.y != null ? L.enz.y : 82,
      introY: L.sub && L.sub.introY != null ? L.sub.introY : -26,
      bindY: L.sub && L.sub.bindY != null ? L.sub.bindY : 42,
      complexY: complexY,
      feedbackX: enzX + 44,
      feedbackY: complexY - 22,
    };
  }

  function stop() {
    if (propAnimFrame) {
      cancelAnimationFrame(propAnimFrame);
      propAnimFrame = null;
    }
    if (catEaAnimFrame) {
      cancelAnimationFrame(catEaAnimFrame);
      catEaAnimFrame = null;
    }
  }

  function mountReusable(container, summary) {
    container.innerHTML =
      '<p class="desc">' +
      summary +
      '</p><div class="svg-box"><svg id="reuseAnimSvg" viewBox="0 0 400 180" aria-label="Reusable enzyme cycle animation"></svg></div>' +
      '<p class="prop-status" id="reuseStatus"></p><div class="stat-row">' +
      '<div class="stat"><div class="stat-val" id="reuseCount">' +
      reusableCount +
      '</div><div class="stat-label">Cycles on the same enzyme</div></div>' +
      '<div><span class="ratio-pill">Enzyme consumed: 0</span></div></div>' +
      '<button class="btn secondary" id="reuseToggle">Pause animation</button>';

    var svg = document.getElementById("reuseAnimSvg");
    var countEl = document.getElementById("reuseCount");
    var statusEl = document.getElementById("reuseStatus");
    if (!svg || !countEl || !statusEl) return;

    var L = shapes().layout || {};
    var ENZ_X = L.anchorX != null ? L.anchorX : 128;
    var ENZ_Y = L.enz && L.enz.y != null ? L.enz.y : 82;
    var SUB_X = ENZ_X;
    var introY = L.sub && L.sub.introY != null ? L.sub.introY : -26;
    var complexY =
      L.sub && L.sub.complexY != null ? L.sub.complexY : ENZ_Y + 24 - 54;
    var DOCK_Y = complexY;
    var uid = "reuse-" + Math.random().toString(36).slice(2, 7);
    var phase = 0;
    var running = true;

    function draw() {
      if (!document.getElementById("reuseAnimSvg")) return;
      phase += 0.011;
      if (phase >= 1) {
        phase = 0;
        reusableCount++;
        countEl.textContent = reusableCount;
      }

      var layers = "";
      var p = phase;
      if (p < 0.36) {
        var t = propEase(p / 0.36);
        layers += substrateSvg(SUB_X, introY + t * (DOCK_Y - introY), t > 0.15);
        statusEl.textContent = "Substrate approaches the same enzyme…";
      } else if (p < 0.56) {
        layers += productsPropSvg(SUB_X, DOCK_Y, 0, 0, 0, propEase((p - 0.36) / 0.2), uid);
        statusEl.textContent = "Reaction occurs at the active site…";
      } else if (p < 0.82) {
        var rt = propEase((p - 0.56) / 0.26);
        layers += productsPropSvg(SUB_X, DOCK_Y, -rt * 30, rt * 30, rt * 16, 1, uid);
        statusEl.textContent = "Products leave — enzyme remains in place…";
      } else {
        var gt = (p - 0.82) / 0.18;
        statusEl.textContent = "Enzyme structure unchanged — ready for the next substrate!";
        layers +=
          '<circle cx="' +
          (ENZ_X + 70) +
          '" cy="' +
          (ENZ_Y + 48) +
          '" r="' +
          (38 + gt * 10) +
          '" fill="none" stroke="#1f8a65" stroke-width="2.5" opacity="' +
          0.55 * (1 - gt) +
          '"/>';
      }

      svg.innerHTML =
        '<rect x="8" y="8" width="384" height="164" rx="8" fill="#eef3f8" stroke="#d8dee9"/>' +
        enzymeSvg(ENZ_X, ENZ_Y) +
        layers +
        '<text x="200" y="168" text-anchor="middle" fill="#666" font-size="11">Same enzyme molecule catalyses one substrate after another</text>';

      if (running) propAnimFrame = requestAnimationFrame(draw);
    }

    document.getElementById("reuseToggle").addEventListener("click", function () {
      running = !running;
      this.textContent = running ? "Pause animation" : "Resume animation";
      if (running) propAnimFrame = requestAnimationFrame(draw);
    });

    propAnimFrame = requestAnimationFrame(draw);
  }

  function mountSmallAmount(container, summary) {
    container.innerHTML =
      '<p class="desc">' +
      summary +
      '</p><div class="svg-box"><svg id="smallAnimSvg" viewBox="0 0 430 140" aria-label="Small amount of enzyme animation"></svg></div>' +
      '<p class="prop-status" id="smallStatus"></p><div class="stat-row">' +
      '<div class="stat"><div class="stat-val" style="color:var(--accent);">1</div><div class="stat-label">Enzyme molecule</div></div>' +
      '<div class="stat"><div class="stat-val" id="prodCount">0</div><div class="stat-label">Substrates converted</div></div>' +
      '<div class="stat"><div class="stat-val ratio-pill" id="smallRatio" style="font-size:1.1rem;">1 : 0</div><div class="stat-label">Enzyme : substrate ratio</div></div></div>' +
      '<button class="btn secondary" id="smallToggle">Pause animation</button>';

    var svg = document.getElementById("smallAnimSvg");
    var countEl = document.getElementById("prodCount");
    var ratioEl = document.getElementById("smallRatio");
    var statusEl = document.getElementById("smallStatus");
    if (!svg || !countEl || !ratioEl || !statusEl) return;

    var S = shapes();
    var subCol = (S.colors && S.colors.substrate) || "#F88A8A";
    var prodA = (S.colors && S.colors.productA) || "#9B8EC4";
    var prodB = (S.colors && S.colors.productB) || "#E8B84A";
    var GATE = { x: 218, y: 108 };
    var slots = [];
    var r, c;
    for (r = 0; r < 4; r++) {
      for (c = 0; c < 6; c++) {
        slots.push({ x: 28 + c * 18, y: 36 + r * 16, idle: true, cooldown: 0 });
      }
    }
    var products = [];
    var converted = 0;
    var traveler = null;
    var running = true;

    function pickSlot() {
      var ready = slots.filter(function (s) {
        return s.idle && s.cooldown <= 0;
      });
      if (!ready.length) return null;
      var slot = ready[Math.floor(Math.random() * ready.length)];
      slot.idle = false;
      return slot;
    }

    function draw() {
      if (!document.getElementById("smallAnimSvg")) return;

      slots.forEach(function (s) {
        if (s.cooldown > 0) s.cooldown -= 1;
        if (s.cooldown <= 0 && !s.idle) s.idle = true;
      });

      if (!traveler) {
        var slot = pickSlot();
        if (slot) traveler = { slot: slot, t: 0, phase: "toGate" };
      } else if (traveler.phase === "toGate") {
        traveler.t += 0.028;
        if (traveler.t >= 1) {
          traveler.t = 0;
          traveler.phase = "atGate";
        }
      } else if (traveler.phase === "atGate") {
        traveler.t += 0.06;
        if (traveler.t >= 1) {
          traveler.t = 0;
          traveler.phase = "toProducts";
        }
      } else {
        traveler.t += 0.03;
        if (traveler.t >= 1) {
          converted++;
          countEl.textContent = converted;
          ratioEl.textContent = "1 : " + converted;
          products.push({
            x: 332 + (converted % 5) * 14,
            y: 48 + Math.floor(converted / 5) * 14,
            color: converted % 2 ? prodA : prodB,
          });
          traveler.slot.cooldown = 28;
          traveler = null;
        }
      }

      var slotDots = slots
        .map(function (s) {
          return (
            '<rect x="' +
            s.x +
            '" y="' +
            s.y +
            '" width="10" height="10" rx="2" fill="' +
            subCol +
            '" opacity="' +
            (s.idle ? 1 : 0.25) +
            '"/>'
          );
        })
        .join("");

      var travelDot = "";
      if (traveler) {
        var cx, cy, fill = subCol, rad = 6;
        var sl = traveler.slot;
        if (traveler.phase === "toGate") {
          var tt = propEase(traveler.t);
          cx = sl.x + 5 + (GATE.x - (sl.x + 5)) * tt;
          cy = sl.y + 5 + (GATE.y - (sl.y + 5)) * tt;
        } else if (traveler.phase === "atGate") {
          cx = GATE.x;
          cy = GATE.y;
          fill = lerpPropColor(subCol, prodA, traveler.t);
          rad = 6 + traveler.t * 2;
        } else {
          var bt = propEase(traveler.t);
          var tx = 340 + (converted % 5) * 14;
          var ty = 48 + Math.floor(converted / 5) * 14;
          cx = GATE.x + (tx - GATE.x) * bt;
          cy = GATE.y + (ty - GATE.y) * bt;
          fill = converted % 2 ? prodA : prodB;
        }
        travelDot =
          '<circle cx="' +
          cx +
          '" cy="' +
          cy +
          '" r="' +
          rad +
          '" fill="' +
          fill +
          '" stroke="#333" stroke-width="0.5"/>';
      }

      statusEl.textContent =
        converted < 3
          ? "One enzyme molecule at the gate converts substrates one by one…"
          : "Still only 1 enzyme — already " + converted + " substrates converted!";

      svg.innerHTML =
        '<defs><marker id="small-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#999"/></marker></defs>' +
        '<rect x="12" y="18" width="168" height="92" rx="6" fill="#fdeef1" stroke="#e07a8a" stroke-width="1.5"/>' +
        '<text x="96" y="32" text-anchor="middle" fill="#666" font-size="10" font-weight="600">Large substrate supply</text>' +
        slotDots +
        '<rect x="198" y="18" width="44" height="92" rx="6" fill="#e8f2fa" stroke="#599ce7" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        '<text x="220" y="32" text-anchor="middle" fill="#599ce7" font-size="9" font-weight="600">×1 enzyme</text>' +
        '<g transform="translate(178,72) scale(0.42)">' +
        enzymeSvg(0, 0).replace(/<text[^>]*>[\s\S]*?<\/text>/, "") +
        "</g>" +
        '<circle cx="' +
        GATE.x +
        '" cy="' +
        GATE.y +
        '" r="14" fill="none" stroke="#599ce7" stroke-width="1.5" opacity="0.5"/>' +
        travelDot +
        '<rect x="300" y="18" width="118" height="92" rx="6" fill="#eef8f2" stroke="#1f8a65" stroke-width="1.5"/>' +
        '<text x="359" y="32" text-anchor="middle" fill="#666" font-size="10" font-weight="600">Products accumulate</text>' +
        products
          .map(function (p) {
            return (
              '<rect x="' +
              p.x +
              '" y="' +
              p.y +
              '" width="10" height="10" rx="2" fill="' +
              p.color +
              '"/>'
            );
          })
          .join("") +
        '<path d="M 186 64 L 198 64" stroke="#999" marker-end="url(#small-arrow)"/>' +
        '<path d="M 242 64 L 300 64" stroke="#999"/>' +
        '<text x="220" y="128" text-anchor="middle" fill="#666" font-size="11">Tiny amount of enzyme · huge amount of substrate processed</text>';

      if (running) propAnimFrame = requestAnimationFrame(draw);
    }

    document.getElementById("smallToggle").addEventListener("click", function () {
      running = !running;
      this.textContent = running ? "Pause animation" : "Resume animation";
      if (running) propAnimFrame = requestAnimationFrame(draw);
    });

    propAnimFrame = requestAnimationFrame(draw);
  }

  function mountSpecific(container, summary, isWrong) {
    var lay = specLayout();
    container.innerHTML =
      '<p class="desc">' +
      summary +
      '</p><div class="controls" style="margin-bottom:12px;">' +
      '<button class="btn ' +
      (!isWrong ? "primary" : "ghost") +
      '" id="btnCorrect">Correct substrate</button>' +
      '<button class="btn ' +
      (isWrong ? "primary" : "ghost") +
      '" id="btnWrong">Wrong substrate</button></div>' +
      '<div class="svg-box"><svg id="specAnimSvg" viewBox="0 0 ' +
      lay.viewW +
      " " +
      lay.viewH +
      '" aria-label="Substrate specificity animation"></svg></div>' +
      '<p class="prop-status" id="specStatus"></p><div class="controls">' +
      '<button class="btn secondary" id="specToggle">Pause animation</button>' +
      '<button class="btn ghost" id="specReplay">Replay</button></div>';

    var svg = document.getElementById("specAnimSvg");
    var statusEl = document.getElementById("specStatus");
    if (!svg || !statusEl) return;

    var ENZ_X = lay.enzX;
    var ENZ_Y = lay.enzY;
    var introY = lay.introY;
    var bindY = lay.bindY;
    var complexY = lay.complexY;
    var APPROACH_END = 0.42;
    var GRAY_TOP = 8;
    var GRAY_HEIGHT = 164;
    var GRAY_WIDTH = lay.viewW - 16;
    var GRAY_MARGIN = 4;
    var WRONG_SUB_TOP_OFF = 56;
    var WRONG_SUB_BOTTOM_OFF = 100;
    var wrongSubYMin = GRAY_TOP + GRAY_MARGIN - WRONG_SUB_TOP_OFF;
    var wrongSubYMax = GRAY_TOP + GRAY_HEIGHT - GRAY_MARGIN - WRONG_SUB_BOTTOM_OFF;
    var phase = 0;
    var running = true;
    var done = false;

    function draw() {
      if (!document.getElementById("specAnimSvg")) return;

      var subY = introY;
      var feedback = "";
      var substrateLayer = "";

      if (!isWrong) {
        if (!done) phase += 0.009;
        if (phase >= 1) {
          phase = 1;
          done = true;
        }
        if (phase < APPROACH_END) {
          subY = lerp(introY, bindY, specEaseInOut(phase / APPROACH_END));
          statusEl.textContent = "Substrate moves toward the enzyme (Step 2 — approach)…";
        } else {
          subY = lerp(bindY, complexY, specEaseInOut((phase - APPROACH_END) / (1 - APPROACH_END)));
          statusEl.textContent = done
            ? "Perfect fit — lock and key!"
            : "Substrate docks into active site (Step 2 — dock)…";
        }
        substrateLayer = substrateSvg(ENZ_X, subY, phase > 0.18);
        if (done) feedback = specFeedbackSvg("tick", lay.feedbackX, lay.feedbackY);
      } else {
        if (!done) phase += 0.004;
        if (phase >= 1) {
          phase = 1;
          done = true;
        }
        var startY = clamp(-12, wrongSubYMin, wrongSubYMax);
        var nearY = clamp(bindY + 2, wrongSubYMin, wrongSubYMax);
        var pressedY = clamp(bindY + 5, wrongSubYMin, wrongSubYMax);
        if (phase < 0.4) {
          subY = lerp(startY, nearY, specEaseInOut(phase / 0.4));
          statusEl.textContent = "Wrong substrate approaches the enzyme…";
        } else if (phase < 0.55) {
          subY = lerp(nearY, pressedY, specEaseInOut((phase - 0.4) / 0.15));
          statusEl.textContent = "Shape does not match the active site…";
        } else if (phase < 0.88) {
          var wiggleT = (phase - 0.55) / 0.33;
          var wiggleAmp = 3.5 * (1 - wiggleT);
          subY = pressedY + Math.sin(wiggleT * Math.PI * 3) * wiggleAmp;
          statusEl.textContent = "Cannot fit — substrate moves back slightly…";
        } else {
          subY = clamp(bindY + 4, wrongSubYMin, wrongSubYMax);
          statusEl.textContent = "Cannot bind — wrong shape.";
          feedback = specFeedbackSvg("cross", lay.feedbackX, lay.feedbackY);
        }
        subY = clamp(subY, wrongSubYMin, wrongSubYMax);
        substrateLayer =
          '<g clip-path="url(#specGrayClip)">' + wrongSubstrateSvg(ENZ_X, subY) + "</g>";
      }

      svg.innerHTML =
        '<defs><clipPath id="specGrayClip"><rect x="8" y="8" width="' +
        GRAY_WIDTH +
        '" height="' +
        GRAY_HEIGHT +
        '"/></clipPath></defs>' +
        '<rect x="8" y="8" width="' +
        GRAY_WIDTH +
        '" height="' +
        GRAY_HEIGHT +
        '" rx="8" fill="#eef3f8" stroke="#d8dee9"/>' +
        enzymeSvg(ENZ_X, ENZ_Y) +
        substrateLayer +
        feedback;

      if (running) propAnimFrame = requestAnimationFrame(draw);
    }

    document.getElementById("specReplay").onclick = function () {
      phase = 0;
      done = false;
      if (!running) {
        running = true;
        document.getElementById("specToggle").textContent = "Pause animation";
        propAnimFrame = requestAnimationFrame(draw);
      }
    };
    document.getElementById("specToggle").onclick = function () {
      running = !running;
      this.textContent = running ? "Pause animation" : "Resume animation";
      if (running) propAnimFrame = requestAnimationFrame(draw);
    };

    propAnimFrame = requestAnimationFrame(draw);
  }

  function catalystRate(count) {
    return Math.round((clamp(count, 1, 10) / 10) * 100);
  }

  function catalystEnergyProfile() {
    var ax = 58;
    var axisY = 210;
    var reactY = 112;
    var prodY = 170;
    var endX = 418;
    var uncPeakX = 172;
    var uncPeakY = 36;
    var catPeakX = uncPeakX;
    var catPeakY = 50;
    return {
      ax: ax,
      axisY: axisY,
      reactY: reactY,
      prodY: prodY,
      endX: endX,
      uncPeakX: uncPeakX,
      uncPeakY: uncPeakY,
      catPeakX: catPeakX,
      catPeakY: catPeakY,
    };
  }

  function catalystCurvePath(ax, reactY, peakX, peakY, endX, prodY) {
    return (
      "M " +
      ax +
      " " +
      reactY +
      " C " +
      (ax + 52) +
      " " +
      (reactY - 28) +
      ", " +
      (peakX - 48) +
      " " +
      (peakY + 6) +
      ", " +
      peakX +
      " " +
      peakY +
      " C " +
      (peakX + 72) +
      " " +
      (peakY + 8) +
      ", " +
      (endX - 58) +
      " " +
      (prodY - 14) +
      ", " +
      endX +
      " " +
      prodY
    );
  }

  function catalystCatCurvePath(ax, reactY, peakX, peakY, endX, prodY) {
    return (
      "M " +
      ax +
      " " +
      reactY +
      " C " +
      (ax + 28) +
      " " +
      (reactY - 1) +
      ", " +
      (peakX - 14) +
      " " +
      (peakY + 1) +
      ", " +
      peakX +
      " " +
      peakY +
      " C " +
      (peakX + 28) +
      " " +
      (peakY + 3) +
      ", " +
      (endX - 58) +
      " " +
      (prodY - 6) +
      ", " +
      endX +
      " " +
      prodY
    );
  }

  function catalystEnergySvg(compareT) {
    compareT = clamp(compareT != null ? compareT : 0, 0, 1);
    var p = catalystEnergyProfile();
    var ax = p.ax;
    var reactY = p.reactY;
    var prodY = p.prodY;
    var endX = p.endX;
    var uncPeakX = p.uncPeakX;
    var uncPeakY = p.uncPeakY;
    var catPeakX = p.catPeakX;
    var catPeakY = p.catPeakY;
    var animatedCatPeakY = Math.round(uncPeakY + (catPeakY - uncPeakY) * compareT);
    var uncPath = catalystCurvePath(ax, reactY, uncPeakX, uncPeakY, endX, prodY);
    var catPath = catalystCatCurvePath(ax, reactY, catPeakX, animatedCatPeakY, endX, prodY);
    var eaCatLabelY = Math.round((reactY + animatedCatPeakY) / 2 + 4);
    var showCatCurve = compareT > 0.02;
    var showCatEa = compareT >= 0.3;
    var showEaDrop = compareT >= 0.85;
    var svg =
      '<svg viewBox="0 0 500 250" role="img" aria-label="Energy profile with and without catalyst">' +
      '<defs><marker id="cat-ea-arr" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">' +
      '<polygon points="0 0, 7 3.5, 0 7" fill="context-stroke"/></marker></defs>' +
      '<line x1="' +
      ax +
      '" y1="' +
      p.axisY +
      '" x2="455" y2="' +
      p.axisY +
      '" stroke="#333" stroke-width="1.5" marker-end="url(#cat-ea-arr)"/>' +
      '<line x1="' +
      ax +
      '" y1="' +
      p.axisY +
      '" x2="' +
      ax +
      '" y2="22" stroke="#333" stroke-width="1.5" marker-end="url(#cat-ea-arr)"/>' +
      '<text x="14" y="118" fill="#333" font-size="11" transform="rotate(-90 14 118)">Potential energy</text>' +
      '<text x="248" y="236" text-anchor="middle" fill="#333" font-size="11">Reaction progress</text>' +
      '<line x1="' +
      ax +
      '" y1="' +
      reactY +
      '" x2="455" y2="' +
      reactY +
      '" stroke="#bbb" stroke-width="1" stroke-dasharray="5 4"/>' +
      '<line x1="' +
      ax +
      '" y1="' +
      prodY +
      '" x2="455" y2="' +
      prodY +
      '" stroke="#bbb" stroke-width="1" stroke-dasharray="5 4"/>' +
      '<line x1="' +
      ax +
      '" y1="' +
      uncPeakY +
      '" x2="455" y2="' +
      uncPeakY +
      '" stroke="#bbb" stroke-width="1" stroke-dasharray="5 4"/>' +
      '<path d="' +
      uncPath +
      '" fill="none" stroke="#3685bf" stroke-width="2.5"/>';

    if (showCatCurve) {
      svg +=
        '<line x1="' +
        ax +
        '" y1="' +
        animatedCatPeakY +
        '" x2="455" y2="' +
        animatedCatPeakY +
        '" stroke="#bbb" stroke-width="1" stroke-dasharray="5 4"/>' +
        '<path d="' +
        catPath +
        '" fill="none" stroke="#d64545" stroke-width="2.5" opacity="' +
        Math.max(0.35, compareT) +
        '"/>';
    }

    svg +=
      '<rect x="' +
      (ax + 4) +
      '" y="' +
      (reactY - 22) +
      '" width="72" height="18" fill="#fff3a0" rx="2"/>' +
      '<text x="' +
      (ax + 40) +
      '" y="' +
      (reactY - 9) +
      '" text-anchor="middle" fill="#333" font-size="10" font-weight="600">Reactants</text>' +
      '<rect x="' +
      (endX - 58) +
      '" y="' +
      (prodY + 6) +
      '" width="68" height="18" fill="#fff3a0" rx="2"/>' +
      '<text x="' +
      (endX - 24) +
      '" y="' +
      (prodY + 19) +
      '" text-anchor="middle" fill="#333" font-size="10" font-weight="600">Products</text>' +
      '<line x1="' +
      uncPeakX +
      '" y1="' +
      (reactY - 4) +
      '" x2="' +
      uncPeakX +
      '" y2="' +
      (uncPeakY + 4) +
      '" stroke="#3685bf" stroke-width="2" marker-start="url(#cat-ea-arr)" marker-end="url(#cat-ea-arr)"/>' +
      '<text x="' +
      (uncPeakX + 6) +
      '" y="' +
      Math.round((reactY + uncPeakY) / 2) +
      '" fill="#3685bf" font-size="9">E<tspan baseline-shift="sub" font-size="7">a</tspan> without catalyst</text>';

    if (showCatEa) {
      svg +=
        '<line x1="' +
        catPeakX +
        '" y1="' +
        (reactY - 4) +
        '" x2="' +
        catPeakX +
        '" y2="' +
        (animatedCatPeakY + 4) +
        '" stroke="#d64545" stroke-width="2" marker-start="url(#cat-ea-arr)" marker-end="url(#cat-ea-arr)"/>' +
        '<text x="' +
        (catPeakX + 6) +
        '" y="' +
        eaCatLabelY +
        '" fill="#d64545" font-size="9">E<tspan baseline-shift="sub" font-size="7">a</tspan> with catalyst</text>';
    }

    if (showEaDrop) {
      var dropX = uncPeakX + 34;
      svg +=
        '<line x1="' +
        dropX +
        '" y1="' +
        (uncPeakY + 6) +
        '" x2="' +
        dropX +
        '" y2="' +
        (catPeakY - 6) +
        '" stroke="#7a5c1e" stroke-width="2" marker-start="url(#cat-ea-arr)" marker-end="url(#cat-ea-arr)"/>' +
        '<rect x="' +
        (dropX + 6) +
        '" y="' +
        Math.round((uncPeakY + catPeakY) / 2 - 8) +
        '" width="78" height="16" fill="#fff8df" rx="2"/>' +
        '<text x="' +
        (dropX + 45) +
        '" y="' +
        Math.round((uncPeakY + catPeakY) / 2 + 3) +
        '" text-anchor="middle" fill="#7a5c1e" font-size="9" font-weight="700">Lower E<tspan baseline-shift="sub" font-size="7">a</tspan></text>';
    }

    if (compareT >= 0.5) {
      svg +=
        '<line x1="' +
        (endX + 12) +
        '" y1="' +
        (prodY - 4) +
        '" x2="' +
        (endX + 12) +
        '" y2="' +
        (reactY + 4) +
        '" stroke="#222" stroke-width="2" marker-start="url(#cat-ea-arr)" marker-end="url(#cat-ea-arr)"/>' +
        '<text x="' +
        (endX + 18) +
        '" y="' +
        Math.round((reactY + prodY) / 2 + 4) +
        '" fill="#222" font-size="10">&#916;H</text>';
    }

    svg += "</svg>";
    return svg;
  }

  function catalystRatePointX(ax, endX, enzymeCount) {
    var minX = ax + 24;
    var maxX = endX - 24;
    return minX + ((clamp(enzymeCount, 1, 10) - 1) / 9) * (maxX - minX);
  }

  function catalystRatePointY(axisY, rate) {
    var minY = 28;
    var maxY = axisY - 28;
    return maxY - (rate / 100) * (maxY - minY);
  }

  function catalystRateSvg(enzCount) {
    var ax = 58;
    var axisY = 210;
    var endX = 418;
    var pathParts = [];
    var n;
    for (n = 1; n <= 10; n += 1) {
      pathParts.push(
        catalystRatePointX(ax, endX, n) +
          " " +
          catalystRatePointY(axisY, catalystRate(n))
      );
    }
    var curRate = catalystRate(enzCount);
    var curX = catalystRatePointX(ax, endX, enzCount);
    var curY = catalystRatePointY(axisY, curRate);
    return (
      '<svg viewBox="0 0 500 250" role="img" aria-label="Reaction rate increases with enzyme number">' +
      '<defs><marker id="cat-rate-arr" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">' +
      '<polygon points="0 0, 7 3.5, 0 7" fill="context-stroke"/></marker></defs>' +
      '<line x1="' +
      ax +
      '" y1="' +
      axisY +
      '" x2="455" y2="' +
      axisY +
      '" stroke="#333" stroke-width="1.5" marker-end="url(#cat-rate-arr)"/>' +
      '<line x1="' +
      ax +
      '" y1="' +
      axisY +
      '" x2="' +
      ax +
      '" y2="22" stroke="#333" stroke-width="1.5" marker-end="url(#cat-rate-arr)"/>' +
      '<text x="14" y="118" fill="#333" font-size="11" transform="rotate(-90 14 118)">Reaction rate</text>' +
      '<text x="248" y="236" text-anchor="middle" fill="#333" font-size="11">Number of enzymes</text>' +
      '<text x="' +
      catalystRatePointX(ax, endX, 1) +
      '" y="' +
      (axisY + 16) +
      '" text-anchor="middle" fill="#666" font-size="9">1</text>' +
      '<text x="' +
      catalystRatePointX(ax, endX, 10) +
      '" y="' +
      (axisY + 16) +
      '" text-anchor="middle" fill="#666" font-size="9">10</text>' +
      '<text x="' +
      (ax - 8) +
      '" y="' +
      (catalystRatePointY(axisY, 100) + 4) +
      '" text-anchor="end" fill="#666" font-size="9">100%</text>' +
      '<text x="' +
      (ax - 8) +
      '" y="' +
      (catalystRatePointY(axisY, 0) + 4) +
      '" text-anchor="end" fill="#666" font-size="9">0%</text>' +
      '<path d="M ' +
      pathParts.join(" L ") +
      '" fill="none" stroke="#1f8a65" stroke-width="2.5"/>' +
      '<line x1="' +
      curX +
      '" y1="' +
      (curY + 6) +
      '" x2="' +
      curX +
      '" y2="' +
      (axisY - 2) +
      '" stroke="#1f8a65" stroke-width="1.5" stroke-dasharray="4 3"/>' +
      '<circle cx="' +
      curX +
      '" cy="' +
      curY +
      '" r="6" fill="#1f8a65" stroke="#fff" stroke-width="2"/>' +
      '<rect x="' +
      (curX - 34) +
      '" y="' +
      (curY - 28) +
      '" width="68" height="18" fill="#fff" stroke="#1f8a65" rx="3"/>' +
      '<text x="' +
      curX +
      '" y="' +
      (curY - 15) +
      '" text-anchor="middle" fill="#1f8a65" font-size="10" font-weight="700">' +
      curRate +
      "%</text>" +
      "</svg>"
    );
  }

  function catalystEnzymeIcons(count) {
    var S = shapes();
    var blue = (S.colors && S.colors.enzyme) || "#89C2EB";
    var enzymePath =
      S.enzyme ||
      "M 8 72 L 132 72 C 150 72 156 44 144 24 L 108 24 L 76 24 L 76 36 A 10 10 0 0 0 56 36 L 56 24 L 36 24 L 30 36 L 24 24 L 12 24 C 0 44 -2 72 8 72 Z";
    var icons = "";
    for (var i = 0; i < count; i++) {
      icons +=
        '<svg viewBox="0 0 80 56" width="34" height="24" style="display:inline-block;margin:2px">' +
        '<g transform="translate(4,-10)"><path d="' +
        enzymePath +
        '" fill="' +
        blue +
        '" stroke="none"/></g></svg>';
    }
    return icons;
  }

  function mountCatalyst(container, summary, initialCount, onCountChange) {
    var enzCount = initialCount != null ? initialCount : 1;
    var eaCompareT = 0;
    var catLayout = "stack";
    container.innerHTML =
      '<p class="desc">' +
      summary +
      '</p><div class="catalyst-layout-bar" aria-label="Graph layout controls">' +
      '<span class="catalyst-layout-label">Graph size</span>' +
      '<button type="button" class="btn ghost" data-cat-layout="split">Split view</button>' +
      '<button type="button" class="btn ghost" data-cat-layout="focus-ea">Larger Ea</button>' +
      '<button type="button" class="btn ghost" data-cat-layout="focus-rate">Larger rate</button>' +
      '<button type="button" class="btn primary" data-cat-layout="stack">Stacked</button>' +
      '</div><div class="catalyst-two-col is-stacked" id="catTwoCol">' +
      '<div class="catalyst-graph-panel" id="catEaPanel">' +
      '<div class="catalyst-graph-title">Activation energy (E<sub>a</sub>)</div>' +
      '<div class="svg-box" id="catEaSvg"></div>' +
      '<div class="controls" style="margin-bottom:8px;">' +
      '<button type="button" class="btn secondary" id="catEaBtn">Show Ea change</button>' +
      "</div>" +
      '<p class="catalyst-graph-caption" id="catEaCaption">Without enzyme only. Click the button to see how an enzyme lowers E<sub>a</sub>.</p>' +
      "</div>" +
      '<div class="catalyst-graph-panel" id="catRatePanel">' +
      '<div class="catalyst-graph-title">Reaction rate</div>' +
      '<div class="svg-box" id="catRateSvg"></div>' +
      '<p class="catalyst-graph-caption">More enzyme molecules provide more active sites, so the overall reaction rate increases.</p>' +
      '<div class="slider-group">' +
      '<div class="slider-head"><label>Number of enzymes</label><span class="badge" id="catEnzBadge">' +
      enzCount +
      '</span></div>' +
      '<input type="range" id="catEnzSlider" min="1" max="10" step="1" value="' +
      enzCount +
      '" />' +
      '<div class="slider-ends"><span>1</span><span>10</span></div></div>' +
      '<div id="catEnzIcons" style="margin-bottom:12px;"></div>' +
      '<div class="stat-row"><div class="stat"><div class="stat-val" id="catRateVal">' +
      catalystRate(enzCount) +
      '%</div><div class="stat-label">Reaction rate</div></div></div>' +
      "</div></div>" +
      '<div class="callout">Use Graph size buttons to adjust the two panels. Left: Show Ea change compares activation energy with and without enzyme. Right: more enzymes increase reaction rate without changing E<sub>a</sub>.</div>';

    function applyCatLayout() {
      var gridEl = document.getElementById("catTwoCol");
      if (!gridEl) return;
      gridEl.className = "catalyst-two-col";
      if (catLayout === "focus-ea") gridEl.classList.add("is-focus-ea");
      else if (catLayout === "focus-rate") gridEl.classList.add("is-focus-rate");
      else if (catLayout === "stack") gridEl.classList.add("is-stacked");
      container.querySelectorAll("[data-cat-layout]").forEach(function (btn) {
        var active = btn.getAttribute("data-cat-layout") === catLayout;
        btn.classList.toggle("primary", active);
        btn.classList.toggle("ghost", !active);
      });
    }

    function updateEaUi() {
      var eaSvgEl = document.getElementById("catEaSvg");
      var eaBtnEl = document.getElementById("catEaBtn");
      var eaCaptionEl = document.getElementById("catEaCaption");
      if (!eaSvgEl || !eaBtnEl || !eaCaptionEl) return;
      eaSvgEl.innerHTML = catalystEnergySvg(eaCompareT);
      if (eaCompareT >= 1) {
        eaBtnEl.textContent = "Reset view";
        eaCaptionEl.innerHTML =
          'With enzyme vs without enzyme. E<sub>a</sub> is lowered by the catalyst and does not change when enzyme number increases.';
      } else if (eaCompareT <= 0) {
        eaBtnEl.textContent = "Show Ea change";
        eaCaptionEl.innerHTML =
          'Without enzyme only. Click the button to see how an enzyme lowers E<sub>a</sub>.';
      } else {
        eaBtnEl.textContent = "Showing Ea change…";
      }
    }

    function animateEaCompare(target, done) {
      if (catEaAnimFrame) {
        cancelAnimationFrame(catEaAnimFrame);
        catEaAnimFrame = null;
      }
      var startT = eaCompareT;
      var startTime = performance.now();
      var duration = 700;
      function frame(now) {
        var progress = Math.min(1, (now - startTime) / duration);
        var eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        eaCompareT = startT + (target - startT) * eased;
        updateEaUi();
        if (progress < 1) {
          catEaAnimFrame = requestAnimationFrame(frame);
        } else {
          catEaAnimFrame = null;
          eaCompareT = target;
          updateEaUi();
          if (done) done();
        }
      }
      catEaAnimFrame = requestAnimationFrame(frame);
    }

    function renderCat() {
      var rate = catalystRate(enzCount);
      var rateSvgEl = document.getElementById("catRateSvg");
      var badgeEl = document.getElementById("catEnzBadge");
      var iconsEl = document.getElementById("catEnzIcons");
      var rateEl = document.getElementById("catRateVal");
      if (!rateSvgEl || !badgeEl || !iconsEl || !rateEl) return;
      updateEaUi();
      rateSvgEl.innerHTML = catalystRateSvg(enzCount);
      badgeEl.textContent = enzCount;
      iconsEl.innerHTML = catalystEnzymeIcons(enzCount);
      rateEl.textContent = rate + "%";
      if (onCountChange) onCountChange(enzCount);
    }

    renderCat();
    applyCatLayout();
    container.querySelectorAll("[data-cat-layout]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        catLayout = btn.getAttribute("data-cat-layout") || "split";
        applyCatLayout();
      });
    });
    document.getElementById("catEaBtn").addEventListener("click", function () {
      if (catEaAnimFrame) return;
      if (eaCompareT >= 1) {
        animateEaCompare(0);
      } else {
        animateEaCompare(1);
      }
    });
    document.getElementById("catEnzSlider").addEventListener("input", function () {
      enzCount = Number(this.value);
      renderCat();
    });
  }

  global.EnzymePropertyDemos = {
    stop: stop,
    mountReusable: mountReusable,
    mountSmallAmount: mountSmallAmount,
    mountSpecific: mountSpecific,
    mountCatalyst: mountCatalyst,
  };
})(typeof window !== "undefined" ? window : globalThis);
