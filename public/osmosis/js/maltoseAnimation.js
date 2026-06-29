/**
 * Maltose condensation & hydrolysis — 4 steps per reaction mode.
 * Assets: ./assets/maltose/
 */

const ASSET_BASE = "./assets/maltose";

export const MODES = {
  condensation: {
    id: "condensation",
    labelEn: "Condensation",
    labelZh: "縮合反應",
    steps: [
      {
        id: "c1_intro",
        en: "Two glucose molecules — complex structural diagrams simplify into hexagonal monomers.",
        zh: "兩個葡萄糖分子——複雜的結構式淡入並轉化為六角形單體。",
        duration: 4200,
      },
      {
        id: "c2_detach",
        en: "A hydrogen atom and a hydroxyl group break away; bonds split and the fragments move beside the curved arrow.",
        zh: "氫原子與羥基脫離；化學鍵斷裂成兩段並消失，碎片移向彎曲箭咀旁。",
        duration: 5200,
      },
      {
        id: "c3_water",
        en: "The detached H and −OH snap together like Lego pieces to form a water molecule.",
        zh: "脫離的 H 與 −OH 像積木般結合，形成水分子。",
        duration: 4800,
      },
      {
        id: "c4_maltose",
        en: "Water leaves the reaction. The two glucose remnants join through oxygen to form maltose.",
        zh: "水分子離開反應。兩個葡萄糖殘基經氧原子連接，形成麥芽糖。",
        duration: 5600,
      },
    ],
  },
  hydrolysis: {
    id: "hydrolysis",
    labelEn: "Hydrolysis",
    labelZh: "水解反應",
    steps: [
      {
        id: "h1_intro",
        en: "Maltose — the complex structural diagram simplifies into two linked hexagons.",
        zh: "麥芽糖——複雜結構式淡入並轉化為兩個相連的六角形。",
        duration: 4200,
      },
      {
        id: "h2_split_water",
        en: "Water appears and splits into H and −OH; the bond between them breaks and disappears.",
        zh: "水分子出現並裂解為 H 與 −OH；連接兩者的化學鍵斷裂並消失。",
        duration: 5200,
      },
      {
        id: "h3_break_maltose",
        en: "The glycosidic bond in maltose breaks into two fragments and fades away.",
        zh: "麥芽糖中的糖苷鍵斷裂成兩段並逐漸消失。",
        duration: 5200,
      },
      {
        id: "h4_glucoses",
        en: "H bonds to the first glucose and −OH bonds to the second — two glucose molecules are restored.",
        zh: "H 與第一個葡萄糖的氧結合，−OH 與第二個葡萄糖結合——還原為兩個葡萄糖分子。",
        duration: 5600,
      },
    ],
  },
};

const LAYERS = [
  "complex-pair",
  "complex-maltose",
  "glucose-left",
  "glucose-right",
  "glucose-o",
  "glucose-hex",
  "maltose",
  "hydrogen",
  "hydroxyl",
  "water",
  "bond-oh-h",
  "bond-glyco",
  "bond-broken-l",
  "bond-broken-r",
  "bond-broken-glyco-l",
  "bond-broken-glyco-r",
  "arrow-straight-1",
  "arrow-straight-2",
  "arrow-curled",
];

const ASSETS = {
  "complex-pair": `${ASSET_BASE}/glucose-complex-pair.png`,
  "complex-maltose": `${ASSET_BASE}/maltose-complex.png`,
  "glucose-left": `${ASSET_BASE}/glucose-oh-left.png`,
  "glucose-right": `${ASSET_BASE}/glucose-oh-right.png`,
  "glucose-o": `${ASSET_BASE}/glucose-with-oxygen.png`,
  "glucose-hex": `${ASSET_BASE}/glucose-hex.png`,
  maltose: `${ASSET_BASE}/maltose-simple.png`,
  hydrogen: `${ASSET_BASE}/hydrogen.png`,
  hydroxyl: `${ASSET_BASE}/hydroxyl.png`,
  water: `${ASSET_BASE}/water.png`,
  "bond-oh-h": `${ASSET_BASE}/bond.png`,
  "bond-glyco": `${ASSET_BASE}/bond.png`,
  "bond-broken-l": `${ASSET_BASE}/bond-broken-left.png`,
  "bond-broken-r": `${ASSET_BASE}/bond-broken-right.png`,
  "bond-broken-glyco-l": `${ASSET_BASE}/bond-broken-left.png`,
  "bond-broken-glyco-r": `${ASSET_BASE}/bond-broken-right.png`,
  "arrow-straight-1": `${ASSET_BASE}/arrow-straight-down.png`,
  "arrow-straight-2": `${ASSET_BASE}/arrow-straight-down.png`,
  "arrow-curled": `${ASSET_BASE}/arrow-curled-left.png`,
};

/** Scene slots (% of stage, translate -50%,-50%) */
const SLOT = {
  top: { x: 50, y: 16, s: 72 },
  topPair: { x: 50, y: 17, s: 78 },
  curled: { x: 22, y: 34, s: 28 },
  hDetached: { x: 14, y: 30, s: 9 },
  ohDetached: { x: 28, y: 36, s: 16 },
  arrow1: { x: 50, y: 44, s: 7 },
  mid: { x: 50, y: 56, s: 62 },
  waterForm: { x: 22, y: 34, s: 20 },
  arrow2: { x: 50, y: 68, s: 7 },
  bottom: { x: 50, y: 82, s: 68 },
  maltoseFinal: { x: 50, y: 82, s: 72 },
  waterFly: { x: 22, y: 34, s: 20 },
};

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function lerpPt(a, b, t) {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function prog(step, localT) {
  return clamp(localT / step.duration, 0, 1);
}

function layerStyle(x, y, size, opacity = 1, rot = 0, extra = "") {
  return `left:${x}%;top:${y}%;width:${size}%;opacity:${opacity};transform:translate(-50%,-50%) rotate(${rot}deg);${extra}`;
}

export class MaltoseAnimation {
  constructor(root, hooks = {}) {
    this.root = root;
    this.hooks = hooks;
    this.mode = "condensation";
    this.stepIndex = 0;
    this.localT = 0;
    this.playing = true;
    this.lastTs = 0;
    this.raf = null;

    root.innerHTML = `
      <div class="maltose-scene">
        <h2 class="maltose-title" data-id="title">CONDENSATION OF MALTOSE</h2>
        ${LAYERS.map((id) => `<div class="maltose-layer" data-id="${id}"></div>`).join("")}
      </div>`;

    this.layers = {};
    for (const id of LAYERS) {
      const el = root.querySelector(`[data-id="${id}"]`);
      const src = ASSETS[id];
      if (src) el.innerHTML = `<img src="${src}" alt="" draggable="false"/>`;
      this.layers[id] = el;
    }
    this.titleEl = root.querySelector('[data-id="title"]');

    this._tick = this._tick.bind(this);
    this._applyFrame();
    this._emitStep();
    this.raf = requestAnimationFrame(this._tick);
  }

  get steps() {
    return MODES[this.mode].steps;
  }

  _hideAll() {
    for (const el of Object.values(this.layers)) {
      el.style.opacity = "0";
      el.classList.remove("maltose-layer--on");
    }
  }

  _set(id, visible, slot, opacity = 1, rot = 0) {
    const el = this.layers[id];
    if (!el) return;
    if (!visible || opacity <= 0.01) {
      el.style.cssText = "opacity:0;";
      el.classList.remove("maltose-layer--on");
      return;
    }
    el.style.cssText = layerStyle(slot.x, slot.y, slot.s, opacity, rot);
    el.classList.add("maltose-layer--on");
  }

  _setTitle() {
    const m = MODES[this.mode];
    this.titleEl.textContent =
      this.mode === "condensation" ? "CONDENSATION OF MALTOSE" : "HYDROLYSIS OF MALTOSE";
    this.titleEl.dataset.zh =
      this.mode === "condensation" ? "麥芽糖的縮合反應" : "麥芽糖的水解反應";
  }

  _drawCondensation(i, p) {
    const e = easeOut;
    const ei = easeInOut;

    // Step 1 — complex pair → simple glucoses
    if (i === 0) {
      const hold = clamp(p / 0.35, 0, 1);
      const morph = ei(clamp((p - 0.35) / 0.55, 0, 1));
      this._set("complex-pair", hold < 1 || morph < 0.55, SLOT.topPair, 1 - morph * 0.95);
      this._set("glucose-left", morph > 0.2, SLOT.topPair, e(clamp((morph - 0.2) / 0.8, 0, 1)));
      this._set(
        "glucose-right",
        morph > 0.2,
        { ...SLOT.topPair, x: 50 },
        e(clamp((morph - 0.2) / 0.8, 0, 1)),
      );
      return;
    }

    // Step 2 — detach H and OH, break bonds, show arrows & mid state
    if (i === 1) {
      this._set("glucose-left", p < 0.42, SLOT.topPair, 1);
      this._set("glucose-right", p < 0.42, SLOT.topPair, 1);

      const breakT = ei(clamp(p / 0.35, 0, 1));
      this._set("bond-broken-l", breakT > 0.15 && breakT < 0.85, SLOT.topPair, breakT < 0.7 ? 1 : 1 - (breakT - 0.7) / 0.15);
      this._set("bond-broken-r", breakT > 0.15 && breakT < 0.85, SLOT.topPair, breakT < 0.7 ? 1 : 1 - (breakT - 0.7) / 0.15);

      const moveT = ei(clamp((p - 0.28) / 0.45, 0, 1));
      const hPos = lerpPt({ x: 42, y: 17 }, SLOT.hDetached, moveT);
      const ohPos = lerpPt({ x: 58, y: 17 }, SLOT.ohDetached, moveT);
      this._set("hydrogen", moveT > 0, { x: hPos.x, y: hPos.y, s: 8 }, e(moveT));
      this._set("hydroxyl", moveT > 0, { x: ohPos.x, y: ohPos.y, s: 15 }, e(moveT));

      const arrowT = e(clamp((p - 0.22) / 0.35, 0, 1));
      this._set("arrow-curled", arrowT > 0, SLOT.curled, arrowT);
      this._set("arrow-straight-1", arrowT > 0, SLOT.arrow1, arrowT);

      const midT = e(clamp((p - 0.55) / 0.4, 0, 1));
      this._set("glucose-o", midT > 0, SLOT.mid, midT);
      this._set("glucose-hex", midT > 0, SLOT.mid, midT);
      return;
    }

    // Step 3 — H + OH → H2O (lego snap)
    if (i === 2) {
      this._set("arrow-curled", true, SLOT.curled, 0.55);
      this._set("arrow-straight-1", true, SLOT.arrow1, 0.55);
      this._set("glucose-o", true, SLOT.mid, 0.55);
      this._set("glucose-hex", true, SLOT.mid, 0.55);

      const snapT = ei(clamp(p / 0.55, 0, 1));
      const hStart = SLOT.hDetached;
      const ohStart = SLOT.ohDetached;
      const target = SLOT.waterForm;
      const hPos = lerpPt(hStart, { x: target.x - 5, y: target.y }, snapT);
      const ohPos = lerpPt(ohStart, { x: target.x + 4, y: target.y }, snapT);

      if (snapT < 0.92) {
        this._set("hydrogen", true, { x: hPos.x, y: hPos.y, s: 8 }, 1 - snapT * 0.85);
        this._set("hydroxyl", true, { x: ohPos.x, y: ohPos.y, s: 15 }, 1 - snapT * 0.85);
      }

      const bondT = e(clamp((snapT - 0.45) / 0.35, 0, 1));
      this._set("bond-oh-h", bondT > 0 && snapT < 0.95, SLOT.waterForm, bondT, 0, "width:12%;");
      this._set("water", snapT > 0.72, SLOT.waterForm, e(clamp((snapT - 0.72) / 0.28, 0, 1)));
      return;
    }

    // Step 4 — H2O flies away, maltose forms
    if (i === 3) {
      const flyT = ei(clamp(p / 0.32, 0, 1));
      const flyPos = lerpPt(SLOT.waterFly, { x: -18, y: 10 }, flyT);
      this._set("water", flyT < 0.95, { x: flyPos.x, y: flyPos.y, s: SLOT.waterFly.s }, 1 - flyT);
      this._set("arrow-straight-1", true, SLOT.arrow1, 0.45);
      this._set("arrow-straight-2", p > 0.18, SLOT.arrow2, e(clamp((p - 0.18) / 0.25, 0, 1)));

      const partsT = e(clamp((p - 0.22) / 0.3, 0, 1));
      this._set("glucose-o", partsT > 0 && p < 0.72, SLOT.bottom, partsT);
      this._set("glucose-hex", partsT > 0 && p < 0.72, SLOT.bottom, partsT);

      const joinT = ei(clamp((p - 0.52) / 0.42, 0, 1));
      const goPos = lerpPt(SLOT.bottom, { x: 38, y: SLOT.bottom.y }, joinT);
      const ghPos = lerpPt(SLOT.bottom, { x: 62, y: SLOT.bottom.y }, joinT);
      if (joinT < 0.88) {
        this._set("glucose-o", true, { x: goPos.x, y: goPos.y, s: 38 }, 1 - joinT * 0.9);
        this._set("glucose-hex", true, { x: ghPos.x, y: ghPos.y, s: 28 }, 1 - joinT * 0.9);
      }
      const bondG = e(clamp((joinT - 0.35) / 0.35, 0, 1));
      this._set("bond-glyco", bondG > 0 && joinT < 0.95, SLOT.maltoseFinal, bondG, 0, "width:18%;");
      this._set("maltose", joinT > 0.78, SLOT.maltoseFinal, e(clamp((joinT - 0.78) / 0.22, 0, 1)));
    }
  }

  _drawHydrolysis(i, p) {
    const e = easeOut;
    const ei = easeInOut;

    // Step 1 — complex maltose → simple maltose
    if (i === 0) {
      const hold = clamp(p / 0.35, 0, 1);
      const morph = ei(clamp((p - 0.35) / 0.55, 0, 1));
      this._set("complex-maltose", hold < 1 || morph < 0.55, { ...SLOT.top, s: 58 }, 1 - morph * 0.95);
      this._set("maltose", morph > 0.2, SLOT.maltoseFinal, e(clamp((morph - 0.2) / 0.8, 0, 1)));
      return;
    }

    // Step 2 — water + arrows appear, H2O splits
    if (i === 1) {
      this._set("maltose", p < 0.55, SLOT.top, 1);

      const appearT = e(clamp(p / 0.28, 0, 1));
      this._set("water", appearT > 0 && p < 0.55, SLOT.waterForm, appearT);
      this._set("arrow-curled", appearT > 0, SLOT.curled, appearT);
      this._set("arrow-straight-1", appearT > 0, SLOT.arrow1, appearT);

      const splitT = ei(clamp((p - 0.32) / 0.45, 0, 1));
      const bondBreak = splitT < 0.55 ? 1 : 1 - (splitT - 0.55) / 0.2;
      this._set("bond-oh-h", splitT > 0.05, SLOT.waterForm, bondBreak, 0, "width:12%;");
      this._set("water", splitT < 0.35, SLOT.waterForm, 1 - splitT * 2.5);

      const hPos = lerpPt(SLOT.waterForm, SLOT.hDetached, splitT);
      const ohPos = lerpPt(SLOT.waterForm, SLOT.ohDetached, splitT);
      this._set("hydrogen", splitT > 0.25, { x: hPos.x, y: hPos.y, s: 8 }, e(clamp((splitT - 0.25) / 0.75, 0, 1)));
      this._set("hydroxyl", splitT > 0.25, { x: ohPos.x, y: ohPos.y, s: 15 }, e(clamp((splitT - 0.25) / 0.75, 0, 1)));
      return;
    }

    // Step 3 — maltose breaks at glycosidic bond
    if (i === 2) {
      this._set("arrow-curled", true, SLOT.curled, 0.55);
      this._set("arrow-straight-1", true, SLOT.arrow1, 0.55);
      this._set("hydrogen", true, SLOT.hDetached, 0.85);
      this._set("hydroxyl", true, SLOT.ohDetached, 0.85);

      const breakT = ei(clamp(p / 0.45, 0, 1));
      this._set("maltose", breakT < 0.5, SLOT.mid, 1 - breakT * 2);
      this._set("bond-broken-glyco-l", breakT > 0.12 && breakT < 0.82, SLOT.mid, breakT < 0.65 ? 1 : 1 - (breakT - 0.65) / 0.17);
      this._set("bond-broken-glyco-r", breakT > 0.12 && breakT < 0.82, SLOT.mid, breakT < 0.65 ? 1 : 1 - (breakT - 0.65) / 0.17);

      const midT = e(clamp((p - 0.42) / 0.45, 0, 1));
      this._set("glucose-o", midT > 0, SLOT.mid, midT);
      this._set("glucose-hex", midT > 0, SLOT.mid, midT);
      return;
    }

    // Step 4 — reattach H and OH to form two glucoses
    if (i === 3) {
      this._set("arrow-straight-1", true, SLOT.arrow1, 0.4);
      this._set("arrow-straight-2", p > 0.12, SLOT.arrow2, e(clamp((p - 0.12) / 0.22, 0, 1)));
      this._set("glucose-o", p < 0.65, SLOT.mid, 0.55);
      this._set("glucose-hex", p < 0.65, SLOT.mid, 0.55);

      const moveT = ei(clamp((p - 0.18) / 0.38, 0, 1));
      const hPos = lerpPt(SLOT.hDetached, { x: 38, y: SLOT.bottom.y }, moveT);
      const ohPos = lerpPt(SLOT.ohDetached, { x: 62, y: SLOT.bottom.y }, moveT);
      this._set("hydrogen", moveT < 0.92, { x: hPos.x, y: hPos.y, s: 8 }, 1 - moveT * 0.88);
      this._set("hydroxyl", moveT < 0.92, { x: ohPos.x, y: ohPos.y, s: 15 }, 1 - moveT * 0.88);

      const bondT = e(clamp((moveT - 0.42) / 0.35, 0, 1));
      this._set("bond-oh-h", bondT > 0 && moveT < 0.95, SLOT.bottom, bondT, 0, "width:14%;");

      const finalT = e(clamp((p - 0.55) / 0.38, 0, 1));
      this._set("glucose-left", finalT > 0, SLOT.bottom, finalT);
      this._set("glucose-right", finalT > 0, SLOT.bottom, finalT);
    }
  }

  _applyFrame() {
    this._hideAll();
    this._setTitle();
    const step = this.steps[this.stepIndex];
    const p = prog(step, this.localT);
    if (this.mode === "condensation") this._drawCondensation(this.stepIndex, p);
    else this._drawHydrolysis(this.stepIndex, p);
  }

  _emitStep() {
    if (this.hooks.onStep) this.hooks.onStep(this.steps[this.stepIndex], this.stepIndex, this.mode);
  }

  _tick(ts) {
    if (!this.lastTs) this.lastTs = ts;
    const dt = ts - this.lastTs;
    this.lastTs = ts;

    if (this.playing) {
      this.localT += dt;
      const step = this.steps[this.stepIndex];
      if (this.localT >= step.duration) {
        if (this.stepIndex < this.steps.length - 1) {
          this.stepIndex += 1;
          this.localT = 0;
          this._emitStep();
        } else {
          this.localT = step.duration;
          this.playing = false;
          if (this.hooks.onComplete) this.hooks.onComplete();
        }
      }
    }

    this._applyFrame();
    this.raf = requestAnimationFrame(this._tick);
  }

  _navToStep(index) {
    this.stepIndex = clamp(index, 0, this.steps.length - 1);
    this.localT = this.steps[this.stepIndex].duration;
    this._emitStep();
  }

  setMode(mode) {
    if (!MODES[mode] || mode === this.mode) return;
    this.mode = mode;
    this.restart();
  }

  play() {
    const last = this.steps.length - 1;
    if (this.stepIndex === last && this.localT >= this.steps[last].duration) {
      this.restart();
      return;
    }
    this.playing = true;
  }

  pause() {
    this.playing = false;
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  restart() {
    const scene = this.root.querySelector(".maltose-scene");
    scene?.classList.add("maltose-scene--reset");
    this.stepIndex = 0;
    this.localT = 0;
    this.lastTs = 0;
    this.playing = true;
    this._applyFrame();
    this._emitStep();
    requestAnimationFrame(() => scene?.classList.remove("maltose-scene--reset"));
  }

  next() {
    if (this.stepIndex < this.steps.length - 1) this._navToStep(this.stepIndex + 1);
    else this.localT = this.steps[this.stepIndex].duration;
  }

  prev() {
    if (this.stepIndex > 0) this._navToStep(this.stepIndex - 1);
  }

  goToStep(index) {
    this._navToStep(index);
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.root.innerHTML = "";
  }
}
