/**
 * Collision Chances — enzyme factor simulation (shared V1 / V2)
 *
 * data-version on <html> or opts.version:
 *   1 = senior form (finite substrate count)
 *   2 = F3 (concentration → infinite inflow; density in the box)
 */
(function () {
  "use strict";

  var LOW_T = 23;
  var OPT_LO = 36;
  var OPT_HI = 40;
  var DENATURE_START = 41;
  var DENATURE_FULL = 55;

  // Match Enzyme Action Animation product colours
  var COLORS = {
    substrate: "#3b82f6",
    substrateEdge: "#1d4ed8",
    enzyme: "#dc2626",
    enzymeFill: "rgba(254, 226, 226, 0.92)",
    enzymeDenat: "#b91c1c",
    productA: "#8E82BD",
    productAEdge: "#7568A8",
    productB: "#E8B84A",
    productBEdge: "#D99A20",
    complexGlow: "rgba(34, 197, 94, 0.35)",
  };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function rand(a, b) {
    return a + Math.random() * (b - a);
  }
  function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function angDiff(a, b) {
    var d = ((a - b + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  /** Relative reaction rate vs temperature — rounded peak; steep denature fall. */
  function reactionRateAt(tempC) {
    var opt = 37;
    // Left of optimum: smooth rise into a rounded peak (derivative → 0 at opt)
    if (tempC <= opt) {
      var sigmaL = 12.5;
      var g = Math.exp(-0.5 * Math.pow((tempC - opt) / sigmaL, 2));
      if (tempC <= 5) return Math.min(g, 0.03);
      return clamp(g, 0, 1);
    }
    // Right of optimum: also starts with derivative 0 (smooth peak), then falls
    // steeply to zero by ~50°C — cos^k keeps the crest rounded, not pointed.
    var zeroAt = 50;
    if (tempC >= zeroAt) return 0;
    var u = (tempC - opt) / (zeroAt - opt); // 0 → 1
    return clamp(Math.pow(Math.cos((Math.PI / 2) * u), 1.55), 0, 1);
  }

  // Michaelis–Menten teaching model (optimum T).
  // Base rate = 1.00 when enzymes = 10 and substances = 10.
  // ↑ enzymes → ↑ Vmax → rate rises.
  // ↑ substances → rate rises then plateaus (all active sites busy).
  var MM_BASE_E = 10;
  var MM_BASE_S = 10;
  var MM_KM = 10; // half-saturation near base substrate level
  var MM_VMAX_AT_BASE_E = (MM_KM + MM_BASE_S) / MM_BASE_S; // = 2 → v(10,10)=1.00

  function concentrationReactionRate(nSubstrate, nEnzyme) {
    var nS = Math.max(0, nSubstrate);
    var nE = Math.max(0, nEnzyme);
    if (nS <= 0 || nE <= 0) return 0;
    var Vmax = (nE / MM_BASE_E) * MM_VMAX_AT_BASE_E;
    return Vmax * nS / (MM_KM + nS);
  }

  function concentrationVmax(nEnzyme) {
    var nE = Math.max(0, nEnzyme);
    return (nE / MM_BASE_E) * MM_VMAX_AT_BASE_E;
  }

  function speedFactor(tempC) {
    return 0.35 + ((tempC - 5) / 55) * 2.4;
  }

  function denatureProgress(tempC) {
    if (tempC < DENATURE_START) return 0;
    return clamp((tempC - DENATURE_START) / (DENATURE_FULL - DENATURE_START), 0, 1);
  }

  function isOptimumTemp(tempC) {
    return tempC >= OPT_LO && tempC <= OPT_HI;
  }

  function bgTint(tempC) {
    if (tempC < LOW_T) {
      var cold = clamp((LOW_T - tempC) / (LOW_T - 5), 0, 1);
      return {
        r: Math.round(lerp(255, 186, cold)),
        g: Math.round(lerp(255, 214, cold)),
        b: Math.round(lerp(255, 255, cold)),
      };
    }
    if (tempC > DENATURE_START) {
      var hot = clamp((tempC - DENATURE_START) / (60 - DENATURE_START), 0, 1);
      return {
        r: Math.round(lerp(255, 255, hot)),
        g: Math.round(lerp(255, 210, hot)),
        b: Math.round(lerp(255, 210, hot)),
      };
    }
    // Optimum: soft cozy green for the simulation box only
    if (isOptimumTemp(tempC)) {
      return { r: 232, g: 245, b: 233 }; // #e8f5e9
    }
    return { r: 255, g: 255, b: 255 };
  }

  function CollisionSim(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mode = (opts && opts.mode) || "temperature";
    this.version = opts && opts.version != null ? Number(opts.version) : 1;
    this.infiniteSubstrate = this.version >= 2 && this.mode === "concentration";
    this.temperature = opts && opts.temperature != null ? opts.temperature : 37;
    this.nSubstrate = opts && opts.nSubstrate != null ? opts.nSubstrate : 10;
    this.nEnzyme = opts && opts.nEnzyme != null ? opts.nEnzyme : 5;
    this.substrates = [];
    this.enzymes = [];
    this.products = [];
    this.complexes = [];
    this.productsFormed = 0;
    this.reactionsDone = 0;
    this.running = true;
    this._last = 0;
    this._denatureAcc = 0;
    this._collisionWindow = [];
    this._reactionTimes = [];
    this._spawnAcc = 0;
    this._raf = null;
    this.onStats = (opts && opts.onStats) || null;
    this.baselineChance = null;
    this.resize();
    this.reset();
  }

  CollisionSim.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var cssW = rect.width || this.canvas.clientWidth || 640;
    if (cssW < 80) cssW = this.canvas.parentElement
      ? this.canvas.parentElement.clientWidth || 640
      : 640;
    var aspect = this.canvas.hasAttribute("data-aspect")
      ? Number(this.canvas.getAttribute("data-aspect"))
      : 640 / 420;
    var cssH = cssW / aspect;
    // Cap height on tall phones so controls stay reachable
    var maxH = Math.min(window.innerHeight * 0.48, 480);
    if (cssH > maxH) {
      cssH = maxH;
      cssW = cssH * aspect;
    }
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.style.width = "100%";
    this.canvas.style.height = cssH + "px";
    this.w = Math.round(cssW * dpr);
    this.h = Math.round(cssH * dpr);
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this._dpr = dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  CollisionSim.prototype.setTemperature = function (t) {
    this.temperature = clamp(t, 5, 60);
  };

  CollisionSim.prototype.setCounts = function (nSub, nEnz) {
    this.nSubstrate = clamp(nSub | 0, 1, 30);
    this.nEnzyme = clamp(nEnz | 0, 1, 30);
    this.syncCounts();
  };

  CollisionSim.prototype.reset = function () {
    this.substrates = [];
    this.enzymes = [];
    this.products = [];
    this.complexes = [];
    this.productsFormed = 0;
    this.reactionsDone = 0;
    this._denatureAcc = 0;
    this._collisionWindow = [];
    this._reactionTimes = [];
    this._spawnAcc = 0;
    var i;
    for (i = 0; i < this.nSubstrate; i++) this.substrates.push(this._makeSubstrate());
    for (i = 0; i < this.nEnzyme; i++) this.enzymes.push(this._makeEnzyme(false));
  };

  CollisionSim.prototype.syncCounts = function () {
    // Enzymes always finite
    while (this.enzymes.length < this.nEnzyme) {
      this.enzymes.push(this._makeEnzyme(false));
    }
    while (this.enzymes.length > this.nEnzyme) {
      this.enzymes.pop();
    }

    if (this.infiniteSubstrate) {
      // Concentration = target density in the box; refill toward that target
      while (this.substrates.length < this.nSubstrate) {
        this.substrates.push(this._makeSubstrate(true));
      }
      while (this.substrates.length > this.nSubstrate) {
        // Prefer removing free (not busy) substrates
        var removed = false;
        for (var i = this.substrates.length - 1; i >= 0; i--) {
          if (!this.substrates[i].busy) {
            this.substrates.splice(i, 1);
            removed = true;
            break;
          }
        }
        if (!removed) this.substrates.pop();
      }
    } else {
      while (this.substrates.length < this.nSubstrate) {
        this.substrates.push(this._makeSubstrate());
      }
      while (this.substrates.length > this.nSubstrate) {
        this.substrates.pop();
      }
    }
  };

  CollisionSim.prototype._makeSubstrate = function (fromEdge) {
    var r = 14;
    var pad = 22;
    var x;
    var y;
    var vx = rand(-1, 1);
    var vy = rand(-1, 1);
    if (fromEdge) {
      // Flow in from a random edge
      var edge = (Math.random() * 4) | 0;
      if (edge === 0) {
        x = rand(pad, this.w - pad);
        y = pad;
        vy = Math.abs(vy) + 0.4;
      } else if (edge === 1) {
        x = this.w - pad;
        y = rand(pad, this.h - pad);
        vx = -Math.abs(vx) - 0.4;
      } else if (edge === 2) {
        x = rand(pad, this.w - pad);
        y = this.h - pad;
        vy = -Math.abs(vy) - 0.4;
      } else {
        x = pad;
        y = rand(pad, this.h - pad);
        vx = Math.abs(vx) + 0.4;
      }
    } else {
      x = rand(pad, this.w - pad);
      y = rand(pad, this.h - pad);
    }
    return {
      type: "substrate",
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      r: r,
      busy: false,
    };
  };

  CollisionSim.prototype._makeEnzyme = function (denatured) {
    var pad = 28;
    return {
      type: "enzyme",
      x: rand(pad, this.w - pad),
      y: rand(pad, this.h - pad),
      vx: rand(-1, 1),
      vy: rand(-1, 1),
      r: 26,
      angle: rand(0, Math.PI * 2),
      spin: rand(-0.02, 0.02),
      denatured: !!denatured,
      denatureT: denatured ? 1 : 0,
      cooldown: 0,
    };
  };

  /** Two wrecked half-circles: purple + yellow (Enzyme Action style). */
  CollisionSim.prototype._spawnProducts = function (x, y, vx, vy) {
    var a = rand(0, Math.PI * 2);
    var kick = 1.35;
    var r = 13;
    // Products fade out after 4s (all versions / modes)
    var fadeSec = 4;
    this.products.push({
      x: x + Math.cos(a) * 5,
      y: y + Math.sin(a) * 5,
      vx: vx + Math.cos(a) * kick,
      vy: vy + Math.sin(a) * kick,
      r: r,
      life: fadeSec,
      fadeSec: fadeSec,
      half: "left",
      spin: rand(-2, 2),
      angle: a,
      color: COLORS.productA,
      edge: COLORS.productAEdge,
    });
    this.products.push({
      x: x - Math.cos(a) * 5,
      y: y - Math.sin(a) * 5,
      vx: vx - Math.cos(a) * kick,
      vy: vy - Math.sin(a) * kick,
      r: r,
      life: fadeSec,
      fadeSec: fadeSec,
      half: "right",
      spin: rand(-2, 2),
      angle: a + Math.PI,
      color: COLORS.productB,
      edge: COLORS.productBEdge,
    });
    this.productsFormed += 2;
    this.reactionsDone += 1;
    this._reactionTimes.push(performance.now());
  };

  CollisionSim.prototype._move = function (p, dt, speed) {
    var jitter = speed * 0.35;
    p.vx += rand(-jitter, jitter) * dt * 60;
    p.vy += rand(-jitter, jitter) * dt * 60;
    var maxV = 0.9 + speed * 1.8;
    var v = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 0.001;
    if (v > maxV) {
      p.vx = (p.vx / v) * maxV;
      p.vy = (p.vy / v) * maxV;
    }
    var scale = speed * 55 * dt;
    p.x += p.vx * scale;
    p.y += p.vy * scale;

    var m = p.r + 2;
    if (p.x < m) {
      p.x = m;
      p.vx *= -1;
    }
    if (p.x > this.w - m) {
      p.x = this.w - m;
      p.vx *= -1;
    }
    if (p.y < m) {
      p.y = m;
      p.vy *= -1;
    }
    if (p.y > this.h - m) {
      p.y = this.h - m;
      p.vy *= -1;
    }
  };

  CollisionSim.prototype._activeSitePoint = function (enz) {
    var reach = enz.r * 0.95;
    return {
      x: enz.x + Math.cos(enz.angle) * reach,
      y: enz.y + Math.sin(enz.angle) * reach,
    };
  };

  CollisionSim.prototype._tryBind = function (enz, sub, rate) {
    if (enz.denatured || enz.denatureT > 0.35) return false;
    if (enz.cooldown > 0 || sub.busy) return false;
    var site = this._activeSitePoint(enz);
    var d = dist(site.x, site.y, sub.x, sub.y);
    if (d > enz.r * 0.75) return false;

    var approach = Math.atan2(sub.y - enz.y, sub.x - enz.x);
    var align = Math.abs(angDiff(approach, enz.angle));
    if (align > 0.7) return false;

    var pSuccess = clamp(0.08 + rate * 0.35, 0.02, 0.92);
    if (Math.random() > pSuccess) {
      var nx = (sub.x - enz.x) / (d || 1);
      var ny = (sub.y - enz.y) / (d || 1);
      sub.vx += nx * 0.8;
      sub.vy += ny * 0.8;
      return false;
    }

    sub.busy = true;
    this.complexes.push({
      enzyme: enz,
      substrate: sub,
      t: 0,
      duration: lerp(0.9, 0.28, clamp(rate / 2, 0, 1)),
    });
    enz.cooldown = 0.2;
    return true;
  };

  CollisionSim.prototype._updateDenaturation = function (dt) {
    var progress = denatureProgress(this.temperature);
    var targetFrac = progress;
    var n = this.enzymes.length;
    var denCount = 0;
    var i;
    for (i = 0; i < n; i++) if (this.enzymes[i].denatured) denCount++;

    var want = Math.round(targetFrac * n);
    if (want > denCount) {
      this._denatureAcc += dt * (0.4 + progress * 1.5);
      while (this._denatureAcc > 0.35 && denCount < want) {
        this._denatureAcc -= 0.35;
        for (i = 0; i < n; i++) {
          if (!this.enzymes[i].denatured) {
            this.enzymes[i].denatured = true;
            denCount++;
            break;
          }
        }
      }
    }

    for (i = 0; i < n; i++) {
      var e = this.enzymes[i];
      if (e.denatured) e.denatureT = Math.min(1, e.denatureT + dt * 1.8);
      else e.denatureT = Math.max(0, e.denatureT - dt * 0.5);
    }
  };

  /** V2: keep substrate density near concentration target by continuous inflow. */
  CollisionSim.prototype._refillSubstrates = function (dt) {
    if (!this.infiniteSubstrate) return;
    var free = 0;
    for (var i = 0; i < this.substrates.length; i++) {
      if (!this.substrates[i].busy) free++;
    }
    var target = this.nSubstrate;
    var deficit = target - free;
    if (deficit <= 0) return;
    // Higher concentration → faster inflow to restore density
    var rate = 1.2 + this.nSubstrate * 0.18;
    this._spawnAcc += dt * rate;
    while (this._spawnAcc >= 1 && free < target) {
      this._spawnAcc -= 1;
      this.substrates.push(this._makeSubstrate(true));
      free++;
    }
  };

  CollisionSim.prototype.update = function (dt) {
    if (!this.running) return;
    dt = clamp(dt, 0, 0.05);
    var speed = speedFactor(this.temperature);
    var rate;
    if (this.mode === "concentration") {
      // MM rate relative to base 1.00 — drives how often successful reactions occur
      rate = concentrationReactionRate(this.nSubstrate, this.nEnzyme);
    } else {
      rate = reactionRateAt(this.temperature);
    }
    var i;

    this._updateDenaturation(dt);
    this._refillSubstrates(dt);

    for (i = 0; i < this.enzymes.length; i++) {
      var enz = this.enzymes[i];
      if (enz.cooldown > 0) enz.cooldown -= dt;
      if (!this._enzymeInComplex(enz)) {
        this._move(enz, dt, speed * (enz.denatured ? 1.15 : 1));
        enz.angle += (enz.spin + speed * 0.015 * (Math.random() - 0.5)) * 60 * dt;
        if (enz.denatured) enz.spin = lerp(enz.spin, rand(-0.06, 0.06), 0.05);
      }
    }

    for (i = 0; i < this.substrates.length; i++) {
      var sub = this.substrates[i];
      if (!sub.busy) this._move(sub, dt, speed);
    }

    for (i = 0; i < this.products.length; i++) {
      var pr = this.products[i];
      this._move(pr, dt, speed * 0.9);
      pr.angle += pr.spin * dt;
      pr.life -= dt;
    }
    this.products = this.products.filter(function (p) {
      return p.life > 0;
    });

    var nearHits = 0;
    for (i = 0; i < this.enzymes.length; i++) {
      enz = this.enzymes[i];
      if (enz.denatured || this._enzymeInComplex(enz)) continue;
      for (var j = 0; j < this.substrates.length; j++) {
        sub = this.substrates[j];
        if (sub.busy) continue;
        var d = dist(enz.x, enz.y, sub.x, sub.y);
        if (d < enz.r + sub.r + 8) nearHits++;
        if (rate > 0.02) this._tryBind(enz, sub, rate);
      }
    }

    this._collisionWindow.push({ t: performance.now(), n: nearHits });
    var cutoff = performance.now() - 2000;
    this._collisionWindow = this._collisionWindow.filter(function (c) {
      return c.t >= cutoff;
    });

    for (i = this.complexes.length - 1; i >= 0; i--) {
      var c = this.complexes[i];
      c.t += dt;
      var site = this._activeSitePoint(c.enzyme);
      c.substrate.x = site.x;
      c.substrate.y = site.y;
      c.enzyme.vx *= 0.9;
      c.enzyme.vy *= 0.9;

      if (c.t >= c.duration) {
        this._spawnProducts(c.substrate.x, c.substrate.y, c.enzyme.vx, c.enzyme.vy);
        var idx = this.substrates.indexOf(c.substrate);
        if (idx >= 0) this.substrates.splice(idx, 1);
        c.enzyme.cooldown = 0.15;
        this.complexes.splice(i, 1);
        // Temperature panel: keep a working pool so measured rate stays readable
        if (this.mode === "temperature" && this.substrates.length < this.nSubstrate) {
          this.substrates.push(this._makeSubstrate(true));
        }
      }
    }

    if (this.onStats) this.onStats(this.getStats());
  };

  CollisionSim.prototype._enzymeInComplex = function (enz) {
    for (var i = 0; i < this.complexes.length; i++) {
      if (this.complexes[i].enzyme === enz) return true;
    }
    return false;
  };

  CollisionSim.prototype.getCollisionChance = function () {
    var area = (this.w * this.h) / (10000 * (this._dpr || 1) * (this._dpr || 1));
    // Both versions (concentration panel): chance tracks what is actually in the box.
    // Falls as free substances decrease; 0% when none left.
    var s = 0;
    var i;
    for (i = 0; i < this.substrates.length; i++) {
      if (!this.substrates[i].busy) s++;
    }
    var e = 0;
    for (i = 0; i < this.enzymes.length; i++) {
      if (!this.enzymes[i].denatured) e++;
    }
    if (s <= 0 || e <= 0) return 0;

    var raw = (s * e) / Math.max(area, 1);
    var chance = 100 * (1 - Math.exp(-raw / 18));
    var avgNear = 0;
    if (this._collisionWindow.length) {
      var sum = 0;
      for (var j = 0; j < this._collisionWindow.length; j++) sum += this._collisionWindow[j].n;
      avgNear = sum / this._collisionWindow.length;
    }
    chance = clamp(chance + avgNear * 1.2, 0, 99);
    return Math.round(chance);
  };

  CollisionSim.prototype.getMeasuredRate = function () {
    var now = performance.now();
    var windowMs = 3000;
    this._reactionTimes = (this._reactionTimes || []).filter(function (t) {
      return now - t <= windowMs;
    });
    return this._reactionTimes.length / (windowMs / 1000);
  };

  CollisionSim.prototype.getStats = function () {
    var den = 0;
    var activeE = 0;
    var i;
    for (i = 0; i < this.enzymes.length; i++) {
      if (this.enzymes[i].denatured) den++;
      else activeE++;
    }
    var freeS = 0;
    for (i = 0; i < this.substrates.length; i++) {
      if (!this.substrates[i].busy) freeS++;
    }
    // Concentration panel: use slider setpoints for MM teaching curve
    // (↑E raises rate; ↑S approaches Vmax). Free counts still drive collision %.
    var nSForRate =
      this.mode === "concentration" ? this.nSubstrate : freeS;
    var nEForRate =
      this.mode === "concentration" ? this.nEnzyme : activeE;
    var concRate = concentrationReactionRate(nSForRate, nEForRate);
    var vmax = concentrationVmax(nEForRate);
    return {
      temperature: this.temperature,
      rate: reactionRateAt(this.temperature),
      concRate: concRate,
      vmax: vmax,
      measuredRate: this.getMeasuredRate(),
      reactionsDone: this.reactionsDone || 0,
      denatured: den,
      enzymeTotal: this.enzymes.length,
      productsFormed: this.productsFormed,
      substratesLeft: freeS,
      collisionChance: this.getCollisionChance(),
      zone: this.getZone(),
    };
  };

  CollisionSim.prototype.getZone = function () {
    var t = this.temperature;
    if (t < LOW_T) return "low";
    if (t > DENATURE_START) return "high";
    if (isOptimumTemp(t)) return "opt";
    return "warming";
  };

  CollisionSim.prototype._drawEnzyme = function (ctx, enz) {
    var t = enz.denatureT;
    ctx.save();
    ctx.translate(enz.x, enz.y);
    ctx.rotate(enz.angle);
    if (t < 0.05) {
      this._drawNativeEnzyme(ctx, enz.r, 1);
    } else if (t >= 0.99) {
      this._drawDenaturedEnzyme(ctx, enz.r, 1);
    } else {
      ctx.globalAlpha = 1 - t;
      this._drawNativeEnzyme(ctx, enz.r * (1 - t * 0.3), 1);
      ctx.globalAlpha = t;
      this._drawDenaturedEnzyme(ctx, enz.r, t);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  };

  CollisionSim.prototype._drawNativeEnzyme = function (ctx, r, alpha) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.beginPath();
    var w = r * 1.15;
    var h = r * 1.05;
    ctx.moveTo(-w * 0.85, -h * 0.75);
    ctx.lineTo(w * 0.15, -h * 0.75);
    ctx.lineTo(w * 0.15, -h * 0.28);
    ctx.arc(w * 0.55, 0, r * 0.55, -Math.PI * 0.72, Math.PI * 0.72, true);
    ctx.lineTo(w * 0.15, h * 0.28);
    ctx.lineTo(w * 0.15, h * 0.75);
    ctx.lineTo(-w * 0.85, h * 0.75);
    ctx.quadraticCurveTo(-w * 1.05, 0, -w * 0.85, -h * 0.75);
    ctx.closePath();
    ctx.fillStyle = COLORS.enzymeFill;
    ctx.strokeStyle = COLORS.enzyme;
    ctx.lineWidth = 2.2 * (this._dpr || 1);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  CollisionSim.prototype._drawDenaturedEnzyme = function (ctx, r, t) {
    ctx.save();
    ctx.strokeStyle = COLORS.enzymeDenat;
    ctx.lineWidth = 2.4 * (this._dpr || 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    var len = r * 2.2;
    var amp = r * 0.55 * t;
    var segs = 10;
    var i, u, x, y;
    for (i = 0; i <= segs; i++) {
      u = i / segs;
      x = -len * 0.5 + u * len;
      y = Math.sin(u * Math.PI * 3.2 + 0.4) * amp;
      y += Math.sin(u * Math.PI * 7) * amp * 0.35;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    for (i = 0; i <= segs; i++) {
      u = i / segs;
      x = -len * 0.45 + u * len * 0.9;
      y = Math.cos(u * Math.PI * 2.6) * amp * 0.7 + r * 0.15;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  };

  CollisionSim.prototype._drawSubstrate = function (ctx, sub) {
    ctx.beginPath();
    ctx.arc(sub.x, sub.y, sub.r, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.substrate;
    ctx.strokeStyle = COLORS.substrateEdge;
    ctx.lineWidth = 1.5 * (this._dpr || 1);
    ctx.fill();
    ctx.stroke();
  };

  /** Wrecked half-disk products (purple / yellow). */
  CollisionSim.prototype._drawProduct = function (ctx, p) {
    ctx.save();
    // Stay fully visible, then fade in the final 1s before disappearing
    var alpha = p.life >= 1 ? 1 : clamp(p.life / 1, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle || 0);
    ctx.beginPath();
    if (p.half === "left") {
      ctx.arc(0, 0, p.r, Math.PI * 0.5, Math.PI * 1.5, false);
    } else {
      ctx.arc(0, 0, p.r, -Math.PI * 0.5, Math.PI * 0.5, false);
    }
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.strokeStyle = p.edge;
    ctx.lineWidth = 1.8 * (this._dpr || 1);
    ctx.fill();
    ctx.stroke();
    // jagged break edge
    ctx.beginPath();
    ctx.moveTo(0, -p.r);
    ctx.lineTo(p.half === "left" ? -2 : 2, -p.r * 0.35);
    ctx.lineTo(0, 0);
    ctx.lineTo(p.half === "left" ? -2 : 2, p.r * 0.35);
    ctx.lineTo(0, p.r);
    ctx.strokeStyle = p.edge;
    ctx.lineWidth = 1.4 * (this._dpr || 1);
    ctx.stroke();
    ctx.restore();
  };

  CollisionSim.prototype.draw = function () {
    var ctx = this.ctx;
    var bg = bgTint(this.temperature);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = "rgb(" + bg.r + "," + bg.g + "," + bg.b + ")";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 2 * (this._dpr || 1);
    ctx.strokeRect(1, 1, this.w - 2, this.h - 2);

    var i;
    for (i = 0; i < this.products.length; i++) this._drawProduct(ctx, this.products[i]);
    for (i = 0; i < this.enzymes.length; i++) this._drawEnzyme(ctx, this.enzymes[i]);
    for (i = 0; i < this.substrates.length; i++) this._drawSubstrate(ctx, this.substrates[i]);
    for (i = 0; i < this.complexes.length; i++) {
      var c = this.complexes[i];
      ctx.beginPath();
      ctx.arc(c.enzyme.x, c.enzyme.y, c.enzyme.r * 1.55, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.complexGlow;
      ctx.fill();
    }
  };

  CollisionSim.prototype.frame = function (ts) {
    if (!this._last) this._last = ts;
    var dt = (ts - this._last) / 1000;
    this._last = ts;
    this.update(dt);
    this.draw();
    this._raf = requestAnimationFrame(this.frame.bind(this));
  };

  CollisionSim.prototype.start = function () {
    if (this._raf) return;
    this._last = 0;
    this._raf = requestAnimationFrame(this.frame.bind(this));
  };

  CollisionSim.prototype.stop = function () {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  };

  function getKeGraphLayout(cssW, cssH) {
    var padL = 34;
    var padR = 12;
    var padT = 16;
    var padB = 28;
    return {
      padL: padL,
      padR: padR,
      padT: padT,
      padB: padB,
      gw: cssW - padL - padR,
      gh: cssH - padT - padB,
      W: cssW,
      H: cssH,
    };
  }

  function tempFromKeGraphX(xCss, layout) {
    var u = clamp((xCss - layout.padL) / layout.gw, 0, 1);
    return Math.round(5 + u * 55);
  }

  function drawKeGraph(canvas, tempC) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cssW = canvas.clientWidth || 280;
    var cssH = canvas.clientHeight || 160;
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }
    var w = canvas.width;
    var h = canvas.height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var layout = getKeGraphLayout(cssW, cssH);
    canvas._keLayout = layout;
    var W = layout.W;
    var H = layout.H;
    var padL = layout.padL;
    var padT = layout.padT;
    var gw = layout.gw;
    var gh = layout.gh;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fafbfc";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#c1c6d5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + gh);
    ctx.lineTo(padL + gw, padT + gh);
    ctx.stroke();

    ctx.fillStyle = "#5a6270";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText("Molecular K.E.", 6, 12);
    ctx.fillText("Temperature / °C", padL + gw / 2 - 38, H - 6);
    ctx.fillText("5", padL - 2, padT + gh + 12);
    ctx.fillText("60", padL + gw - 12, padT + gh + 12);

    ctx.beginPath();
    ctx.strokeStyle = "#004e9f";
    ctx.lineWidth = 2;
    ctx.moveTo(padL, padT + gh - 8);
    ctx.lineTo(padL + gw, padT + 10);
    ctx.stroke();

    var tx = padL + ((tempC - 5) / 55) * gw;
    var ty = padT + gh - 8 - ((tempC - 5) / 55) * (gh - 18);
    canvas._keDot = { x: tx, y: ty, r: 10 };
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, Math.PI * 2);
    ctx.fillStyle = tempC > DENATURE_START ? "#dc2626" : tempC < LOW_T ? "#2563eb" : "#15803d";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    var dx0 = padL + ((DENATURE_START - 5) / 55) * gw;
    ctx.fillStyle = "rgba(220, 38, 38, 0.08)";
    ctx.fillRect(dx0, padT, padL + gw - dx0, gh);
    ctx.fillStyle = "#b91c1c";
    ctx.font = "9px Inter, sans-serif";
    ctx.fillText("denature", dx0 + 4, padT + 12);
  }

  /** Rate of enzymatic reaction vs temperature (bell curve + red denature zone). */
  function drawRateTempGraph(canvas, tempC) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cssW = canvas.clientWidth || 280;
    var cssH = canvas.clientHeight || 200;
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var padL = 36;
    var padR = 10;
    var padT = 28;
    var padB = 36;
    var W = cssW;
    var H = cssH;
    var gw = W - padL - padR;
    var gh = H - padT - padB;
    var layout = { padL: padL, padR: padR, padT: padT, padB: padB, gw: gw, gh: gh, W: W, H: H };
    canvas._keLayout = layout;

    var tMin = 5;
    var tMax = 60;
    var optT = 37;

    function xOf(t) {
      return padL + ((t - tMin) / (tMax - tMin)) * gw;
    }
    function yOf(rate) {
      return padT + gh - rate * (gh - 4);
    }

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fafbfc";
    ctx.fillRect(0, 0, W, H);

    // Axes
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + gh);
    ctx.lineTo(padL + gw, padT + gh);
    ctx.stroke();

    // Build curve points
    var pts = [];
    var t;
    for (t = tMin; t <= tMax; t += 0.5) {
      pts.push({ t: t, r: reactionRateAt(t), x: xOf(t), y: yOf(reactionRateAt(t)) });
    }

    function fillUnderCurve(t0, t1, fillStyle) {
      ctx.beginPath();
      var started = false;
      var firstX = null;
      var lastX = null;
      for (var i = 0; i < pts.length; i++) {
        if (pts[i].t < t0 || pts[i].t > t1) continue;
        if (!started) {
          firstX = pts[i].x;
          ctx.moveTo(pts[i].x, padT + gh);
          ctx.lineTo(pts[i].x, pts[i].y);
          started = true;
        } else {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        lastX = pts[i].x;
      }
      if (started) {
        ctx.lineTo(lastX, padT + gh);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
    }

    // Cozy green under the curve around optimum (like red denature fill — not full graph)
    fillUnderCurve(OPT_LO, DENATURE_START, "rgba(34, 197, 94, 0.28)");
    // Red under the curve in denature zone
    fillUnderCurve(DENATURE_START, tMax, "rgba(220, 38, 38, 0.28)");

    // Magenta rate curve
    ctx.beginPath();
    ctx.strokeStyle = "#c026d3";
    ctx.lineWidth = 2.25;
    for (var i = 0; i < pts.length; i++) {
      if (i === 0) ctx.moveTo(pts[i].x, pts[i].y);
      else ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();

    var xDen = xOf(DENATURE_START);

    // Optimum dashed guides
    var xPeak = xOf(optT);
    var yPeak = yOf(1);
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xPeak, padT + gh);
    ctx.lineTo(xPeak, yPeak);
    ctx.lineTo(padL, yPeak);
    ctx.stroke();
    ctx.setLineDash([]);

    // Optimum marker box
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#15803d";
    ctx.lineWidth = 1.5;
    var boxW = 28;
    var boxH = 14;
    ctx.fillRect(xPeak - boxW / 2, padT + gh + 4, boxW, boxH);
    ctx.strokeRect(xPeak - boxW / 2, padT + gh + 4, boxW, boxH);
    ctx.fillStyle = "#15803d";
    ctx.font = "bold 9px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(optT + "°C", xPeak, padT + gh + 14);

    // Labels
    ctx.textAlign = "left";
    ctx.fillStyle = "#5a6270";
    ctx.font = "9px Inter, sans-serif";
    ctx.fillText("Rate of enzymatic reaction", 4, 12);
    ctx.fillText("Temperature / °C", padL + gw / 2 - 36, H - 4);
    ctx.fillText("5", padL - 2, padT + gh + 12);
    ctx.fillText("60", padL + gw - 10, padT + gh + 12);

    ctx.fillStyle = "#15803d";
    ctx.font = "8px Inter, sans-serif";
    ctx.fillText("maximum rate", padL + 4, yPeak - 4);
    ctx.font = "bold 9px Inter, sans-serif";
    ctx.fillText("optimum", xPeak - 22, padT + 14);

    ctx.fillStyle = "#2563eb";
    ctx.font = "8px Inter, sans-serif";
    ctx.fillText("↑ collisions", padL + gw * 0.18, padT + gh * 0.55);

    ctx.fillStyle = "#b91c1c";
    ctx.font = "bold 9px Inter, sans-serif";
    ctx.fillText("denatured", xDen + 4, padT + 14);
    ctx.font = "8px Inter, sans-serif";
    ctx.fillText("rate falls", xDen + 4, padT + 26);

    ctx.fillStyle = "#64748b";
    ctx.font = "8px Inter, sans-serif";
    ctx.fillText("inactive →", padL + 4, padT + gh - 6);
    ctx.fillText("← denatured", padL + gw - 58, padT + gh - 6);

    // Current temperature marker on the curve
    var curR = reactionRateAt(tempC);
    var tx = xOf(tempC);
    var ty = yOf(curR);
    canvas._keDot = { x: tx, y: ty, r: 10 };
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, Math.PI * 2);
    ctx.fillStyle = tempC > DENATURE_START ? "#dc2626" : tempC < LOW_T ? "#2563eb" : "#15803d";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function bindKeGraphDrag(canvas, onTemp) {
    if (!canvas || canvas._keDragBound) return;
    canvas._keDragBound = true;
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none";
    canvas.setAttribute("aria-label", "Kinetic energy vs temperature graph — drag the marker to change temperature");
    canvas.title = "Drag the marker to change temperature";

    var dragging = false;

    function clientToCssX(ev) {
      var rect = canvas.getBoundingClientRect();
      var clientX = ev.clientX != null ? ev.clientX : (ev.touches && ev.touches[0] ? ev.touches[0].clientX : 0);
      return clientX - rect.left;
    }

    function applyFromEvent(ev) {
      var layout = canvas._keLayout || getKeGraphLayout(canvas.clientWidth || 280, canvas.clientHeight || 160);
      var t = tempFromKeGraphX(clientToCssX(ev), layout);
      onTemp(t);
    }

    function onDown(ev) {
      dragging = true;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture && ev.pointerId != null && canvas.setPointerCapture(ev.pointerId);
      applyFromEvent(ev);
      ev.preventDefault();
    }
    function onMove(ev) {
      if (!dragging) {
        // hover: grab near the dot
        var dot = canvas._keDot;
        if (dot) {
          var rect = canvas.getBoundingClientRect();
          var x = (ev.clientX != null ? ev.clientX : 0) - rect.left;
          var y = (ev.clientY != null ? ev.clientY : 0) - rect.top;
          var near = Math.hypot(x - dot.x, y - dot.y) <= dot.r + 6;
          canvas.style.cursor = near ? "grab" : "pointer";
        }
        return;
      }
      applyFromEvent(ev);
      ev.preventDefault();
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", function () {
      if (!dragging) canvas.style.cursor = "grab";
    });
  }

  function zoneCopy(zone, temp) {
    if (zone === "low") {
      return {
        badge: "Low T",
        badgeClass: "is-low",
        text:
          "At " +
          temp +
          "°C molecules vibrate slowly. Low K.E. → few successful collisions; hard to form an enzyme–substrate complex.",
      };
    }
    if (zone === "opt") {
      return {
        badge: "Optimum",
        badgeClass: "is-opt",
        text:
          "At " +
          temp +
          "°C (near body temperature) collisions are frequent. Only the correct orientation at the active site forms a complex → products.",
      };
    }
    if (zone === "high") {
      return {
        badge: "Denaturing",
        badgeClass: "is-high",
        text:
          "Above ~41°C enzymes lose their 3D shape. Active sites disappear — reaction rate falls even though molecules move violently.",
      };
    }
    return {
      badge: "Warming",
      badgeClass: "is-opt",
      text: "As temperature rises, K.E. and collision frequency increase toward the optimum (~37°C).",
    };
  }

  function concHint(s, e, chance, baseline, version) {
    var arrow = "flat";
    if (chance > baseline + 2) arrow = "up";
    else if (chance < baseline - 2) arrow = "down";
    var msg;
    if (chance <= 0 || s <= 0) {
      msg =
        version >= 2
          ? "Few / no substances in the box — collision chance is low"
          : "No substances left — collision chance is 0%";
    } else if (e <= 0) {
      msg = "No active enzymes — collision chance is 0%";
    } else if (version >= 2) {
      if (s < 8 || e < 8) msg = "Lower concentration → fewer collisions";
      else if (Math.abs(s - e) <= 1) msg = "Balanced concentration of substances & enzymes";
      else if (s > e) msg = "Higher substance concentration → more collisions";
      else msg = "Higher enzyme concentration → more collisions";
    } else {
      if (s < 8 || e < 8) msg = "Fewer substances / enzymes → lower collision chance";
      else if (s === e) msg = "Balanced — equal substrate & enzyme numbers";
      else if (s > e && s >= 15) msg = "Higher substrate concentration → more collisions";
      else if (e > s && e >= 15) msg = "Higher enzyme concentration → more collisions";
      else if (s > e) msg = "More substrates than enzymes";
      else msg = "More enzymes than substrates";
    }
    return { arrow: arrow, msg: msg };
  }

  function init() {
    var root = document.documentElement;
    var version = Number(root.getAttribute("data-cc-version") || "1") || 1;

    var tempCanvas = document.getElementById("sim-canvas-temp");
    var concCanvas = document.getElementById("sim-canvas-conc");
    var keGraph = document.getElementById("ke-graph");
    var rateTempGraph = document.getElementById("rate-temp-graph");
    if (!tempCanvas || !concCanvas) return;

    function redrawTempGraphs(t) {
      if (keGraph) drawKeGraph(keGraph, t);
      if (rateTempGraph) drawRateTempGraph(rateTempGraph, t);
    }

    var tempSim = new CollisionSim(tempCanvas, {
      mode: "temperature",
      version: version,
      temperature: 37,
      nSubstrate: 10,
      nEnzyme: 5,
      onStats: function (st) {
        var rateEl = document.getElementById("stat-rate");
        var liveEl = document.getElementById("stat-rate-live");
        var denEl = document.getElementById("stat-denatured");
        var prodEl = document.getElementById("stat-products");
        if (rateEl) rateEl.textContent = st.rate.toFixed(2);
        if (liveEl) liveEl.textContent = st.measuredRate.toFixed(1);
        if (denEl) denEl.textContent = st.denatured + " / " + st.enzymeTotal;
        if (prodEl) prodEl.textContent = String(st.productsFormed);
        var z = zoneCopy(st.zone, Math.round(st.temperature));
        var badge = document.getElementById("temp-zone");
        if (badge) {
          badge.textContent = z.badge;
          badge.className = "cc-status-badge " + z.badgeClass;
        }
        var statusText = document.getElementById("temp-status-text");
        if (statusText) statusText.textContent = z.text;
        redrawTempGraphs(st.temperature);
      },
    });

    var concDefaults = version >= 2 ? { nSubstrate: 10, nEnzyme: 10 } : { nSubstrate: 10, nEnzyme: 10 };
    var concSim = new CollisionSim(concCanvas, {
      mode: "concentration",
      version: version,
      temperature: 37,
      nSubstrate: concDefaults.nSubstrate,
      nEnzyme: concDefaults.nEnzyme,
      onStats: function (st) {
        var prodEl = document.getElementById("conc-products");
        var leftEl = document.getElementById("conc-left");
        var rateEl = document.getElementById("conc-rate");
        var vmaxEl = document.getElementById("conc-vmax");
        if (prodEl) prodEl.textContent = String(st.productsFormed);
        if (leftEl) {
          leftEl.textContent = String(st.substratesLeft);
          var leftLabel = document.getElementById("conc-left-label");
          if (leftLabel) {
            leftLabel.textContent =
              version >= 2 ? "Substrates in box (now)" : "Substrates remaining";
          }
        }
        if (rateEl) rateEl.textContent = st.concRate.toFixed(2);
        if (vmaxEl) vmaxEl.textContent = st.vmax.toFixed(2);
        var chance = st.collisionChance;
        var chanceEl = document.getElementById("collision-chance");
        if (chanceEl) chanceEl.textContent = chance + "%";
        if (concSim.baselineChance == null) concSim.baselineChance = chance;
        var h = concHint(
          st.substratesLeft,
          concSim.nEnzyme,
          chance,
          concSim.baselineChance,
          version
        );
        var arrow = document.getElementById("collision-arrow");
        if (arrow) {
          arrow.className = "cc-chance-arrow " + h.arrow;
          arrow.textContent = h.arrow === "up" ? "▲" : h.arrow === "down" ? "▼" : "●";
        }
        var hint = document.getElementById("collision-hint");
        if (hint) hint.textContent = h.msg;
      },
    });

    setTimeout(function () {
      concSim.baselineChance = concSim.getCollisionChance();
    }, 800);

    tempSim.start();

    var tabs = document.querySelectorAll(".cc-tab");
    var panelTemp = document.getElementById("panel-temperature");
    var panelConc = document.getElementById("panel-concentration");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var mode = tab.getAttribute("data-mode");
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        var isTemp = mode === "temperature";
        if (panelTemp) {
          panelTemp.classList.toggle("is-hidden", !isTemp);
          panelTemp.hidden = !isTemp;
        }
        if (panelConc) {
          panelConc.classList.toggle("is-hidden", isTemp);
          panelConc.hidden = isTemp;
        }
        if (isTemp) {
          concSim.stop();
          tempSim.resize();
          tempSim.start();
        } else {
          tempSim.stop();
          concSim.resize();
          concSim.start();
        }
      });
    });

    var tempSlider = document.getElementById("temp-slider");
    var tempValue = document.getElementById("temp-value");

    function applyTemperature(t) {
      t = clamp(Math.round(t), 5, 60);
      if (tempSlider) {
        tempSlider.value = String(t);
        tempSlider.setAttribute("aria-valuenow", String(t));
      }
      if (tempValue) tempValue.textContent = t + "°C";
      tempSim.setTemperature(t);
      redrawTempGraphs(t);
    }

    if (tempSlider) {
      tempSlider.addEventListener("input", function () {
        applyTemperature(Number(tempSlider.value));
      });
    }

    if (keGraph) {
      bindKeGraphDrag(keGraph, applyTemperature);
    }
    if (rateTempGraph) {
      bindKeGraphDrag(rateTempGraph, applyTemperature);
      rateTempGraph.title = "Drag the marker to change temperature";
    }
    redrawTempGraphs(Number(tempSlider && tempSlider.value) || 37);

    var btnResetTemp = document.getElementById("btn-reset-temp");
    if (btnResetTemp) {
      btnResetTemp.addEventListener("click", function () {
        tempSim.nSubstrate = 10;
        tempSim.nEnzyme = 5;
        tempSim.reset();
      });
    }

    var subSlider = document.getElementById("sub-slider");
    var enzSlider = document.getElementById("enz-slider");
    function applyCounts() {
      if (!subSlider || !enzSlider) return;
      var s = Number(subSlider.value);
      var e = Number(enzSlider.value);
      var subVal = document.getElementById("sub-value");
      var enzVal = document.getElementById("enz-value");
      if (subVal) subVal.textContent = String(s);
      if (enzVal) enzVal.textContent = String(e);
      concSim.nSubstrate = s;
      concSim.nEnzyme = e;
      concSim.syncCounts();
    }
    if (subSlider) subSlider.addEventListener("input", applyCounts);
    if (enzSlider) enzSlider.addEventListener("input", applyCounts);

    var btnResetConc = document.getElementById("btn-reset-conc");
    if (btnResetConc) {
      btnResetConc.addEventListener("click", function () {
        concSim.nSubstrate = Number(subSlider.value);
        concSim.nEnzyme = Number(enzSlider.value);
        concSim.reset();
        concSim.productsFormed = 0;
      });
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        tempSim.resize();
        concSim.resize();
        redrawTempGraphs(tempSim.temperature);
      }, 100);
    });

    redrawTempGraphs(tempSim.temperature);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
