/**
 * Carbohydrate Builder — drag-and-drop hexagons (monosaccharides) and bonds.
 * MODE: 'snap' (default) | 'free' — toggle BUILDER_MODE to switch behaviour.
 */

export const BUILDER_MODE = "snap";

export const MONOSACCHARIDES = [
  { id: "glucose", color: "#ef4444", en: "Glucose", zh: "葡萄糖", zhHant: "葡萄糖" },
  { id: "fructose", color: "#22c55e", en: "Fructose", zh: "果糖", zhHant: "果糖" },
  { id: "galactose", color: "#3b82f6", en: "Galactose", zh: "半乳糖", zhHant: "半乳糖" },
];

export const CUSTOM_COLORS = [
  "#f97316", "#facc15", "#14b8a6", "#8b5cf6", "#ec4899", "#78716c",
];

const HEX_RADIUS = 36;
const SNAP_DISTANCE = 24;
const BOND_DEFAULT_LEN = 90;
const HISTORY_MAX = 50;

const DISACCHARIDE_NAMES = {
  "glucose+glucose": { en: "Maltose", zh: "麦芽糖", zhHant: "麥芽糖" },
  "glucose+fructose": { en: "Sucrose", zh: "蔗糖", zhHant: "蔗糖" },
  "fructose+glucose": { en: "Sucrose", zh: "蔗糖", zhHant: "蔗糖" },
  "glucose+galactose": { en: "Lactose", zh: "乳糖", zhHant: "乳糖" },
  "galactose+glucose": { en: "Lactose", zh: "乳糖", zhHant: "乳糖" },
};

let nextId = 1;
function uid(prefix) {
  return `${prefix}${nextId++}`;
}

function cloneState(hexagons, bonds) {
  return {
    hexagons: hexagons.map((h) => ({ ...h })),
    bonds: bonds.map((b) => ({
      ...b,
      endA: b.endA ? { ...b.endA } : null,
      endB: b.endB ? { ...b.endB } : null,
    })),
  };
}

function hexPoints(cx, cy, r, rotationDeg) {
  const rot = (rotationDeg * Math.PI) / 180;
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = rot + (i * Math.PI) / 3;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(" ");
}

function portPosition(hex, portIndex) {
  const rot = (hex.rotation * Math.PI) / 180;
  const angle = rot + (portIndex * Math.PI) / 3;
  return {
    x: hex.x + HEX_RADIUS * Math.cos(angle),
    y: hex.y + HEX_RADIUS * Math.sin(angle),
  };
}

function allPorts(hex) {
  return Array.from({ length: 6 }, (_, i) => ({
    port: i,
    ...portPosition(hex, i),
  }));
}

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function resolveEndpoint(bond, endKey, hexagons) {
  const end = bond[endKey];
  if (!end) return { x: 0, y: 0 };
  if (end.hexId != null && end.port != null) {
    const hex = hexagons.find((h) => h.id === end.hexId);
    if (hex) return portPosition(hex, end.port);
  }
  return { x: end.x, y: end.y };
}

function monoLabel(mono, lang) {
  if (mono.id === "custom") {
    return lang === "zh-Hant" || lang === "zh" ? "其他單糖" : "Other monosaccharide";
  }
  if (lang === "zh-Hant") return mono.zhHant || mono.zh;
  if (lang === "zh") return mono.zh;
  return mono.en;
}

function findMono(id) {
  return MONOSACCHARIDES.find((m) => m.id === id);
}

export class CarbohydrateBuilder {
  constructor(refs) {
    this.refs = refs;
    this.mode = BUILDER_MODE;
    this.hexagons = [];
    this.bonds = [];
    this.history = [];
    this.selected = null;
    this.activeMono = MONOSACCHARIDES[0];
    this.activeColor = MONOSACCHARIDES[0].color;
    this.drag = null;
    this.activePointer = null;
    this.dragSnapshot = null;
    this.strings = refs.strings || {};
    this.lang = refs.lang || "en";
    this.viewBox = { w: 800, h: 500 };
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
  }

  init() {
    this._buildPalette();
    this._bindToolbar();
    this._bindCanvas();
    this._bindPaletteDrag();
    this._resizeCanvas();
    window.addEventListener("resize", () => {
      this._resizeCanvas();
      this._updateAnalysis();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (document.activeElement?.tagName === "INPUT") return;
        e.preventDefault();
        this._deleteSelected();
      }
    });
    this._render();
    this._updateAnalysis();
    this._updateLegend();
  }

  setStrings(strings, lang) {
    this.strings = strings;
    this.lang = lang;
    this._refreshMonoSwatchLabels();
    this._updateAnalysis();
    this._updateLegend();
    this._renderPalettePreview();
  }

  _refreshMonoSwatchLabels() {
    this.refs.monoSwatches.querySelectorAll(".mono-swatch").forEach((btn) => {
      const mono = findMono(btn.dataset.monoId);
      if (!mono) return;
      const label = btn.querySelector("span:last-child");
      if (label) label.textContent = monoLabel(mono, this.lang);
    });
  }

  _buildPalette() {
    const { monoSwatches, customColors } = this.refs;
    monoSwatches.innerHTML = "";
    MONOSACCHARIDES.forEach((mono, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `mono-swatch${idx === 0 ? " is-active" : ""}`;
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", idx === 0 ? "true" : "false");
      btn.dataset.monoId = mono.id;
      btn.innerHTML = `<span class="mono-swatch-dot" style="background:${mono.color}"></span><span>${mono.en}</span>`;
      btn.addEventListener("click", () => this._selectMono(mono, btn));
      monoSwatches.appendChild(btn);
    });

    customColors.innerHTML = "";
    CUSTOM_COLORS.forEach((color) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "custom-color-dot";
      dot.style.background = color;
      dot.setAttribute("aria-label", `Custom color ${color}`);
      dot.addEventListener("click", () => {
        this._selectMono({ id: "custom", color, en: "Other", zh: "其他单糖", zhHant: "其他單糖" }, null, color);
        monoSwatches.querySelectorAll(".mono-swatch").forEach((el) => {
          el.classList.remove("is-active");
          el.setAttribute("aria-checked", "false");
        });
        customColors.querySelectorAll(".custom-color-dot").forEach((el) => el.classList.remove("is-active"));
        dot.classList.add("is-active");
      });
      customColors.appendChild(dot);
    });

    this._renderPalettePreview();
  }

  _selectMono(mono, btn, colorOverride) {
    this.activeMono = mono;
    this.activeColor = colorOverride || mono.color;
    if (btn) {
      this.refs.monoSwatches.querySelectorAll(".mono-swatch").forEach((el) => {
        el.classList.remove("is-active");
        el.setAttribute("aria-checked", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-checked", "true");
      this.refs.customColors.querySelectorAll(".custom-color-dot").forEach((el) => el.classList.remove("is-active"));
    }
    this._renderPalettePreview();
  }

  _renderPalettePreview() {
    this.refs.paletteHex.style.setProperty("--preview-hex-color", this.activeColor);
  }

  _bindToolbar() {
    this.refs.btnUndo.addEventListener("click", () => this._undo());
    this.refs.btnRotate.addEventListener("click", () => this._rotateSelected());
    this.refs.btnDelete.addEventListener("click", () => this._deleteSelected());
    this.refs.btnClear.addEventListener("click", () => this._clearCanvas());
  }

  _bindCanvas() {
    const { canvas } = this.refs;
    canvas.addEventListener("pointerdown", (e) => this._onCanvasPointerDown(e));
  }

  _bindPaletteDrag() {
    const startPaletteDrag = (type, el, e) => {
      if (e.button !== undefined && e.button !== 0) return;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
      this.drag = {
        kind: "palette",
        type,
        startX: e.clientX,
        startY: e.clientY,
        pointerId: e.pointerId,
        sourceEl: el,
      };
      this._showGhost(type, e.clientX, e.clientY);
      document.addEventListener("pointermove", this._onPointerMove);
      document.addEventListener("pointerup", this._onPointerUp);
      document.addEventListener("pointercancel", this._onPointerUp);
    };

    this.refs.paletteHex.addEventListener("pointerdown", (e) => startPaletteDrag("hex", this.refs.paletteHex, e));
    this.refs.paletteBond.addEventListener("pointerdown", (e) => startPaletteDrag("bond", this.refs.paletteBond, e));
  }

  _resizeCanvas() {
    const wrap = this.refs.canvasWrap;
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(400, Math.floor(rect.width));
    const h = Math.max(360, Math.floor(rect.height));
    this.viewBox = { w, h };
    this.refs.canvas.setAttribute("viewBox", `0 0 ${w} ${h}`);
    this.refs.canvas.style.height = `${h}px`;
  }

  _clientToSvg(clientX, clientY) {
    const rect = this.refs.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * this.viewBox.w;
    const y = ((clientY - rect.top) / rect.height) * this.viewBox.h;
    return { x, y };
  }

  _pushHistory() {
    this.history.push(cloneState(this.hexagons, this.bonds));
    if (this.history.length > HISTORY_MAX) this.history.shift();
    this.refs.btnUndo.disabled = this.history.length === 0;
  }

  _undo() {
    if (!this.history.length) return;
    const prev = this.history.pop();
    this.hexagons = prev.hexagons;
    this.bonds = prev.bonds;
    this.selected = null;
    this.refs.btnUndo.disabled = this.history.length === 0;
    this._updateToolbar();
    this._render();
    this._updateAnalysis();
  }

  _clearCanvas() {
    if (!this.hexagons.length && !this.bonds.length) return;
    this._pushHistory();
    this.hexagons = [];
    this.bonds = [];
    this.selected = null;
    this._updateToolbar();
    this._render();
    this._updateAnalysis();
  }

  _rotateSelected() {
    if (!this.selected || this.selected.type !== "hex") return;
    const hex = this.hexagons.find((h) => h.id === this.selected.id);
    if (!hex) return;
    this._pushHistory();
    hex.rotation = (hex.rotation + 60) % 360;
    this._render();
    this._updateAnalysis();
  }

  _deleteSelected() {
    if (!this.selected) return;
    this._pushHistory();
    if (this.selected.type === "hex") {
      const id = this.selected.id;
      this.bonds = this.bonds.map((b) => {
        const nb = { ...b, endA: b.endA ? { ...b.endA } : null, endB: b.endB ? { ...b.endB } : null };
        if (nb.endA?.hexId === id) {
          const pos = resolveEndpoint(b, "endA", this.hexagons);
          nb.endA = { x: pos.x, y: pos.y };
        }
        if (nb.endB?.hexId === id) {
          const pos = resolveEndpoint(b, "endB", this.hexagons);
          nb.endB = { x: pos.x, y: pos.y };
        }
        return nb;
      });
      this.hexagons = this.hexagons.filter((h) => h.id !== id);
    } else {
      this.bonds = this.bonds.filter((b) => b.id !== this.selected.id);
    }
    this.selected = null;
    this._updateToolbar();
    this._render();
    this._updateAnalysis();
  }

  _updateToolbar() {
    const hasSel = !!this.selected;
    this.refs.btnDelete.disabled = !hasSel;
    this.refs.btnRotate.disabled = !(this.selected?.type === "hex");
  }

  _select(type, id) {
    this.selected = { type, id };
    this._updateToolbar();
    this._render();
  }

  _onCanvasPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    const target = e.target.closest("[data-id][data-kind]");
    if (!target) {
      this.selected = null;
      this._updateToolbar();
      this._render();
      return;
    }

    const kind = target.dataset.kind;
    const id = target.dataset.id;
    this._select(kind, id);

    const pt = this._clientToSvg(e.clientX, e.clientY);
    const handle = target.dataset.handle;

    this.dragSnapshot = cloneState(this.hexagons, this.bonds);

    if (kind === "hex") {
      const hex = this.hexagons.find((h) => h.id === id);
      this.drag = {
        kind: "move-hex",
        id,
        offsetX: pt.x - hex.x,
        offsetY: pt.y - hex.y,
        pointerId: e.pointerId,
        moved: false,
      };
    } else if (kind === "bond" && handle) {
      this.drag = {
        kind: handle === "a" ? "move-bond-a" : "move-bond-b",
        id,
        pointerId: e.pointerId,
        moved: false,
      };
    } else if (kind === "bond") {
      const bond = this.bonds.find((b) => b.id === id);
      const a = resolveEndpoint(bond, "endA", this.hexagons);
      const b = resolveEndpoint(bond, "endB", this.hexagons);
      this.drag = {
        kind: "move-bond",
        id,
        offsetAX: pt.x - a.x,
        offsetAY: pt.y - a.y,
        offsetBX: pt.x - b.x,
        offsetBY: pt.y - b.y,
        pointerId: e.pointerId,
        moved: false,
      };
    }

    this.refs.canvas.setPointerCapture(e.pointerId);
    this.activePointer = e.pointerId;
    document.addEventListener("pointermove", this._onPointerMove);
    document.addEventListener("pointerup", this._onPointerUp);
    document.addEventListener("pointercancel", this._onPointerUp);
  }

  _onPointerMove(e) {
    if (!this.drag || e.pointerId !== this.drag.pointerId) return;
    const pt = this._clientToSvg(e.clientX, e.clientY);

    if (this.drag.kind === "palette") {
      this._showGhost(this.drag.type, e.clientX, e.clientY);
      return;
    }

    if (this.drag.kind === "move-hex") {
      const hex = this.hexagons.find((h) => h.id === this.drag.id);
      if (hex) {
        hex.x = pt.x - this.drag.offsetX;
        hex.y = pt.y - this.drag.offsetY;
        this.drag.moved = true;
        this._render();
      }
      return;
    }

    const bond = this.bonds.find((b) => b.id === this.drag.id);
    if (!bond) return;

    if (this.drag.kind === "move-bond-a" || this.drag.kind === "move-bond-b") {
      const endKey = this.drag.kind === "move-bond-a" ? "endA" : "endB";
      bond[endKey] = { x: pt.x, y: pt.y };
      this.drag.moved = true;
      if (this.mode === "snap") {
        const snap = this._nearestPort(pt.x, pt.y, bond.id, endKey);
        if (snap) this._highlightPort(snap.hexId, snap.port);
        else this._clearPortHints();
      }
      this._render();
      return;
    }

    if (this.drag.kind === "move-bond") {
      const a = { x: pt.x - this.drag.offsetAX, y: pt.y - this.drag.offsetAY };
      const b = { x: pt.x - this.drag.offsetBX, y: pt.y - this.drag.offsetBY };
      bond.endA = { x: a.x, y: a.y };
      bond.endB = { x: b.x, y: b.y };
      this.drag.moved = true;
      this._render();
    }
  }

  _onPointerUp(e) {
    if (!this.drag || e.pointerId !== this.drag.pointerId) return;

    if (this.drag.kind === "palette") {
      const wrapRect = this.refs.canvasWrap.getBoundingClientRect();
      const inside =
        e.clientX >= wrapRect.left &&
        e.clientX <= wrapRect.right &&
        e.clientY >= wrapRect.top &&
        e.clientY <= wrapRect.bottom;

      if (inside) {
        const pt = this._clientToSvg(e.clientX, e.clientY);
        this._pushHistory();
        if (this.drag.type === "hex") {
          this.hexagons.push({
            id: uid("h"),
            monoId: this.activeMono.id,
            color: this.activeColor,
            x: pt.x,
            y: pt.y,
            rotation: 0,
          });
        } else {
          this.bonds.push({
            id: uid("b"),
            endA: { x: pt.x - BOND_DEFAULT_LEN / 2, y: pt.y },
            endB: { x: pt.x + BOND_DEFAULT_LEN / 2, y: pt.y },
          });
        }
        this._updateAnalysis();
      }

      this.drag.sourceEl?.classList.remove("is-dragging");
      this.drag.sourceEl?.releasePointerCapture?.(e.pointerId);
      this._clearGhost();
    } else {
      if (this.drag.moved && this.dragSnapshot) {
        this.history.push(this.dragSnapshot);
        if (this.history.length > HISTORY_MAX) this.history.shift();
        this.refs.btnUndo.disabled = false;
        if (this.mode === "snap" && this.drag.kind.startsWith("move-bond")) {
          const bond = this.bonds.find((b) => b.id === this.drag.id);
          if (bond) {
            if (this.drag.kind === "move-bond-a" || this.drag.kind === "move-bond") {
              const a = resolveEndpoint(bond, "endA", this.hexagons);
              const snapA = this._nearestPort(a.x, a.y, bond.id, "endA");
              bond.endA = snapA
                ? { hexId: snapA.hexId, port: snapA.port, x: snapA.x, y: snapA.y }
                : { x: a.x, y: a.y };
            }
            if (this.drag.kind === "move-bond-b" || this.drag.kind === "move-bond") {
              const b = resolveEndpoint(bond, "endB", this.hexagons);
              const snapB = this._nearestPort(b.x, b.y, bond.id, "endB");
              bond.endB = snapB
                ? { hexId: snapB.hexId, port: snapB.port, x: snapB.x, y: snapB.y }
                : { x: b.x, y: b.y };
            }
          }
        }
        this._updateAnalysis();
      }

      this.refs.canvas.releasePointerCapture?.(e.pointerId);
    }

    this._clearPortHints();
    this.dragSnapshot = null;
    this.drag = null;
    this.activePointer = null;
    document.removeEventListener("pointermove", this._onPointerMove);
    document.removeEventListener("pointerup", this._onPointerUp);
    document.removeEventListener("pointercancel", this._onPointerUp);
    this._render();
  }

  _nearestPort(x, y, bondId, endKey) {
    let best = null;
    let bestDist = SNAP_DISTANCE;
    for (const hex of this.hexagons) {
      for (const p of allPorts(hex)) {
        if (this._portTaken(hex.id, p.port, bondId, endKey)) continue;
        const d = dist(x, y, p.x, p.y);
        if (d < bestDist) {
          bestDist = d;
          best = { hexId: hex.id, port: p.port, x: p.x, y: p.y };
        }
      }
    }
    return best;
  }

  _portTaken(hexId, port, excludeBondId, excludeEnd) {
    for (const bond of this.bonds) {
      if (bond.id === excludeBondId) continue;
      if (bond.endA?.hexId === hexId && bond.endA?.port === port) return true;
      if (bond.endB?.hexId === hexId && bond.endB?.port === port) return true;
    }
    return false;
  }

  _highlightPort(hexId, port) {
    this._clearPortHints();
    const el = this.refs.layerHandles.querySelector(`[data-hint="${hexId}-${port}"]`);
    if (el) el.classList.add("is-visible");
  }

  _clearPortHints() {
    this.refs.layerHandles.querySelectorAll(".carb-port-hint").forEach((el) => {
      el.classList.remove("is-visible");
    });
  }

  _showGhost(type, clientX, clientY) {
    const pt = this._clientToSvg(clientX, clientY);
    const layer = this.refs.layerGhost;
    layer.innerHTML = "";
    if (type === "hex") {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "carb-ghost-hex");
      g.setAttribute("transform", `translate(${pt.x},${pt.y})`);
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", hexPoints(0, 0, HEX_RADIUS, 0));
      poly.setAttribute("fill", this.activeColor);
      poly.setAttribute("stroke", "#1e293b");
      poly.setAttribute("stroke-width", "2");
      g.appendChild(poly);
      layer.appendChild(g);
    } else {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "carb-ghost-bond");
      line.setAttribute("x1", String(pt.x - BOND_DEFAULT_LEN / 2));
      line.setAttribute("y1", String(pt.y));
      line.setAttribute("x2", String(pt.x + BOND_DEFAULT_LEN / 2));
      line.setAttribute("y2", String(pt.y));
      layer.appendChild(line);
    }
  }

  _clearGhost() {
    this.refs.layerGhost.innerHTML = "";
  }

  _render() {
    this._renderBonds();
    this._renderHexes();
    this._renderHandles();
    const hasContent = this.hexagons.length > 0 || this.bonds.length > 0;
    this.refs.canvasEmpty.hidden = hasContent;
  }

  _renderHexes() {
    const layer = this.refs.layerHexes;
    layer.innerHTML = "";
    for (const hex of this.hexagons) {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "carb-hex");
      g.setAttribute("data-kind", "hex");
      g.setAttribute("data-id", hex.id);
      g.setAttribute("transform", `translate(${hex.x},${hex.y}) rotate(${hex.rotation})`);
      if (this.selected?.type === "hex" && this.selected.id === hex.id) {
        g.classList.add("is-selected");
      }

      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", hexPoints(0, 0, HEX_RADIUS, 0));
      poly.setAttribute("fill", hex.color);
      poly.setAttribute("stroke", "#1e293b");
      poly.setAttribute("stroke-width", "2");
      poly.setAttribute("filter", "url(#hex-shadow)");
      g.appendChild(poly);
      layer.appendChild(g);
    }
  }

  _renderBonds() {
    const layer = this.refs.layerBonds;
    layer.innerHTML = "";
    for (const bond of this.bonds) {
      const a = resolveEndpoint(bond, "endA", this.hexagons);
      const b = resolveEndpoint(bond, "endB", this.hexagons);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "carb-bond");
      g.setAttribute("data-kind", "bond");
      g.setAttribute("data-id", bond.id);
      if (this.selected?.type === "bond" && this.selected.id === bond.id) {
        g.classList.add("is-selected");
      }

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "carb-bond-line");
      line.setAttribute("x1", String(a.x));
      line.setAttribute("y1", String(a.y));
      line.setAttribute("x2", String(b.x));
      line.setAttribute("y2", String(b.y));
      line.setAttribute("data-kind", "bond");
      line.setAttribute("data-id", bond.id);
      g.appendChild(line);
      layer.appendChild(g);
    }
  }

  _renderHandles() {
    const layer = this.refs.layerHandles;
    layer.innerHTML = "";

    for (const hex of this.hexagons) {
      for (const p of allPorts(hex)) {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("class", "carb-port-hint");
        c.setAttribute("data-hint", `${hex.id}-${p.port}`);
        c.setAttribute("cx", String(p.x));
        c.setAttribute("cy", String(p.y));
        c.setAttribute("r", "8");
        layer.appendChild(c);
      }
    }

    if (this.selected?.type === "bond") {
      const bond = this.bonds.find((b) => b.id === this.selected.id);
      if (bond) {
        const a = resolveEndpoint(bond, "endA", this.hexagons);
        const b = resolveEndpoint(bond, "endB", this.hexagons);
        ["a", "b"].forEach((handle, idx) => {
          const pt = idx === 0 ? a : b;
          const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          c.setAttribute("class", "carb-handle");
          c.setAttribute("data-kind", "bond");
          c.setAttribute("data-id", bond.id);
          c.setAttribute("data-handle", handle);
          c.setAttribute("cx", String(pt.x));
          c.setAttribute("cy", String(pt.y));
          c.setAttribute("r", "9");
          layer.appendChild(c);
        });
      }
    }
  }

  _buildAdjacency() {
    const adj = new Map();
    for (const h of this.hexagons) adj.set(h.id, new Set());
    for (const bond of this.bonds) {
      const a = bond.endA;
      const b = bond.endB;
      if (a?.hexId && b?.hexId) {
        adj.get(a.hexId)?.add(b.hexId);
        adj.get(b.hexId)?.add(a.hexId);
      }
    }
    return adj;
  }

  _connectedComponents() {
    const adj = this._buildAdjacency();
    const visited = new Set();
    const components = [];

    for (const hex of this.hexagons) {
      if (visited.has(hex.id)) continue;
      const queue = [hex.id];
      const comp = [];
      visited.add(hex.id);
      while (queue.length) {
        const cur = queue.shift();
        const node = this.hexagons.find((h) => h.id === cur);
        if (node) comp.push(node);
        for (const nb of adj.get(cur) || []) {
          if (!visited.has(nb)) {
            visited.add(nb);
            queue.push(nb);
          }
        }
      }
      components.push(comp);
    }
    return components;
  }

  _orderChain(hexes) {
    if (hexes.length <= 1) return hexes;
    const ids = new Set(hexes.map((h) => h.id));
    const adj = this._buildAdjacency();
    const start = hexes.find((h) => (adj.get(h.id)?.size || 0) <= 1) || hexes[0];
    const ordered = [start];
    const used = new Set([start.id]);
    let cur = start;
    while (ordered.length < hexes.length) {
      const neighbors = [...(adj.get(cur.id) || [])].filter((n) => ids.has(n) && !used.has(n));
      if (!neighbors.length) break;
      const next = this.hexagons.find((h) => h.id === neighbors[0]);
      if (!next) break;
      ordered.push(next);
      used.add(next.id);
      cur = next;
    }
    if (ordered.length < hexes.length) return hexes;
    return ordered;
  }

  _classifyComponent(hexes) {
    const s = this.strings;
    const n = hexes.length;
    const ordered = this._orderChain(hexes);
    const types = ordered.map((h) => h.monoId);

    if (n === 1) {
      const mono = findMono(hexes[0].monoId) || { en: s.otherMono, zh: s.otherMono, zhHant: s.otherMono };
      const nameEn = hexes[0].monoId === "custom" ? s.otherMono : mono.en;
      const nameZh = monoLabel(mono, this.lang);
      return {
        units: 1,
        classEn: s.monosaccharide,
        classZh: s.monosaccharide,
        nameEn,
        nameZh,
      };
    }

    if (n === 2 && this.mode === "snap") {
      const key = `${types[0]}+${types[1]}`;
      const named = DISACCHARIDE_NAMES[key];
      return {
        units: 2,
        classEn: s.disaccharide,
        classZh: s.disaccharide,
        nameEn: named ? named.en : s.mixedDisaccharide,
        nameZh: named ? (this.lang === "zh-Hant" ? named.zhHant : named.zh) : s.mixedDisaccharide,
      };
    }

    if (n >= 2 && this.mode === "free") {
      const classLabel = n === 2 ? s.disaccharide : s.polysaccharide;
      return {
        units: n,
        classEn: classLabel,
        classZh: classLabel,
        nameEn: (s.unitsCount || "{n} monosaccharide unit(s)").replace("{n}", String(n)),
        nameZh: (s.unitsCount || "{n} monosaccharide unit(s)").replace("{n}", String(n)),
      };
    }

    if (n === 2) {
      return {
        units: 2,
        classEn: s.disaccharide,
        classZh: s.disaccharide,
        nameEn: s.mixedDisaccharide,
        nameZh: s.mixedDisaccharide,
      };
    }

    return {
      units: n,
      classEn: s.polysaccharide,
      classZh: s.polysaccharide,
      nameEn: (s.unitsCount || "{n} monosaccharide unit(s)").replace("{n}", String(n)),
      nameZh: (s.unitsCount || "{n} monosaccharide unit(s)").replace("{n}", String(n)),
    };
  }

  _updateAnalysis() {
    const components = this._connectedComponents();
    const connected = components.filter((c) => c.length > 0);
    const hasHex = this.hexagons.length > 0;

    if (!hasHex) {
      this.refs.infoEmpty.hidden = false;
      this.refs.infoResults.hidden = true;
      this.refs.infoBadgeMobile.hidden = true;
      return;
    }

    this.refs.infoEmpty.hidden = true;
    this.refs.infoResults.hidden = false;

    const primary = connected.sort((a, b) => b.length - a.length)[0] || [];
    const analysis = this._classifyComponent(primary.length ? primary : [this.hexagons[0]]);

    this.refs.infoUnits.textContent = String(analysis.units);
    this.refs.infoClass.textContent = analysis.classEn;
    this.refs.infoName.textContent = analysis.nameEn;
    this.refs.infoZh.textContent =
      this.lang === "en" ? analysis.nameZh : `${analysis.classZh} · ${analysis.nameZh}`;

    const chains = this.refs.infoChains;
    chains.innerHTML = "";
    if (connected.length > 1 || (this.mode === "free" && this.hexagons.length > 0)) {
      const list = this.mode === "free" ? [this.hexagons] : connected;
      list.forEach((comp, i) => {
        const item = this._classifyComponent(comp);
        const li = document.createElement("li");
        li.textContent = `${this.strings.chainLabel || "Chain"} ${i + 1}: ${item.units} — ${item.nameEn}`;
        chains.appendChild(li);
      });
    }

    const badge = `${analysis.classEn} · ${analysis.nameEn}`;
    this.refs.infoBadgeMobile.textContent = badge;
    this.refs.infoBadgeMobile.hidden = window.innerWidth > 900;
  }

  _updateLegend() {
    const list = this.refs.legendList;
    list.innerHTML = "";
    MONOSACCHARIDES.forEach((mono) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="legend-dot" style="background:${mono.color}"></span>${monoLabel(mono, this.lang)}`;
      list.appendChild(li);
    });
    const other = document.createElement("li");
    other.innerHTML = `<span class="legend-dot" style="background:#78716c"></span>${this.strings.otherMono || "Other monosaccharide"}`;
    list.appendChild(other);
  }
}
