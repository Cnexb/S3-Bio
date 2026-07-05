/**
 * Generates index.html — full Ch 3 membrane transport class deck
 * Run: node generate.mjs
 */
import { writeFileSync } from "fs";
import { MEMBRANE_QUIZ, QUIZ_SECTIONS } from "../js/membraneQuizData.js";

const ASSET_PREFIX = "../assets/";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function assetSrc(src) {
  return src.replace(/^\.\/assets\//, "");
}

function fig(src, alt, caption, cls = "", phase = "") {
  const ph = phase ? ` data-phase="${phase}"` : "";
  return `<figure class="fig-box${cls ? " " + cls : ""} step step-pic"${ph}><img src="${ASSET_PREFIX}${assetSrc(src)}" alt="${esc(alt)}"/><figcaption class="fig-caption">${caption}</figcaption></figure>`;
}

function layoutSplit(picHtml, textHtml) {
  return `<div class="slide-split"><div class="slide-split__pic">${picHtml}</div><div class="slide-split__text">${textHtml}</div></div>`;
}

function figGrid2(a, b) {
  return `<div class="fig-grid-2">${a}${b}</div>`;
}

function layoutFigTop(figsHtml, textHtml, variant = "") {
  const mod = variant ? ` layout-fig-top--${variant}` : "";
  return `<div class="layout-fig-top${mod}"><div class="layout-fig-top__media">${figsHtml}</div><div class="layout-fig-top__text">${textHtml}</div></div>`;
}

const LAB_MEMBRANE = "../membrane-animation.html";
const LAB_OSMOSIS = "../virtual-osmosis-lab.html";

function labEmbed(src, title) {
  const q = src.includes("?") ? "&" : "?";
  return `<div class="slide-lab-embed"><iframe class="slide-lab-embed__frame" src="${src}${q}embed=1" title="${esc(title)}" loading="lazy" allow="fullscreen"></iframe></div>`;
}

function labFootnote(html, labSrc) {
  return `<div class="slide-lab-foot">${html}<button type="button" class="slide-lab-open-btn" data-lab="${labSrc}">Open full window ↗</button></div>`;
}

/** u=yellow, c=light green, b=light blue, r=light red */
function hl(text, type = "u") {
  return `<span class="hl hl-${type} step step-text">${text}</span>`;
}

function textStep(html, cls = "step step-text") {
  return html.replace(/\bclass="step\b/g, `class="${cls}`).replace(/\bclass='step\b/g, `class='${cls}`);
}

function card(html, cls = "") {
  return `<div class="bio-card ${cls}">${html}</div>`;
}

function tableWrap(html) {
  return `<div class="rounded-3xl overflow-hidden glass-frost border border-white/40 shadow-xl">${html}</div>`;
}

function slide(title, body, opts = {}) {
  return {
    title,
    body,
    center: !!opts.center,
    lab: !!opts.lab,
    section: opts.section || "",
    phases: opts.phases || null,
    previewImg: opts.previewImg || "",
  };
}

function mcqSlide(q, num, sectionLabel) {
  const opts = q.options
    .map((o) => `<li class="mcq-opt" data-key="${o.key}"><strong>${o.key}.</strong> ${esc(o.text)}${o.textZh ? ` <span class="text-muted">${esc(o.textZh)}</span>` : ""}</li>`)
    .join("");
  const hasImg = !!q.image;
  const imgCls = q.image?.src.includes("graph") ? "fig-graph" : "fig-wide";
  const img = hasImg
    ? fig(q.image.src, q.image.alt, q.image.caption, imgCls, "pic")
    : "";
  const qBlock = `<div class="mcq-q">
     <p class="deck-text mb-2 step step-text" data-phase="q">${esc(q.stem)}</p>
     <ul class="mcq-list deck-text mb-2 step step-text" data-phase="q">${opts}</ul>
     <div class="answer-panel step hidden-answer" data-phase="a" data-answer="${esc(q.answer)}"><div class="answer-badge">Answer: ${esc(q.answer)}</div></div>
     <div class="explain-panel step hidden-explain" data-phase="e"><div class="def-box bg-primary-fixed/40 rounded-r-xl deck-text"><strong class="text-primary">Explanation · 解釋</strong><p class="mt-1 deck-meta">${esc(q.hint)}</p></div></div>
   </div>`;
  const body = hasImg ? `<div class="mcq-layout">${img}${qBlock}</div>` : qBlock;
  const phases = hasImg ? "pic,q,a,e" : "q,a,e";
  return slide(
    `${sectionLabel} · MCQ ${num}`,
    body,
    { phases, previewImg: hasImg ? assetSrc(q.image.src) : "" }
  );
}

function tfBatchSlide(questions, batchLabel, sectionLabel, startNum) {
  const endNum = startNum + questions.length - 1;
  const items = questions
    .map((q, i) => {
      const n = startNum + i;
      return `<div class="tf-item${i < questions.length - 1 ? " tf-item--border" : ""}">
        <p class="deck-text tf-q step step-text" data-phase="q"><strong class="text-primary">${n}.</strong> ${esc(q.stem)}</p>
        <div class="answer-panel hidden-answer step" data-phase="a"><span class="answer-badge answer-badge--sm">${q.answer === "T" ? "✔ True 正確" : "✘ False 錯誤"}</span></div>
        <div class="explain-panel hidden-explain step" data-phase="e"><p class="deck-meta pl-3 border-l-2 border-primary/30">${esc(q.hint)}</p></div>
      </div>`;
    })
    .join("");
  return slide(
    `${sectionLabel} · T/F ${startNum}–${endNum}`,
    `<p class="font-label-bold text-primary mb-4 step step-text" data-phase="q">True / False ${batchLabel} — ✔ if correct · ✘ on wrong words</p>${items}`,
    { phases: "q,a,e" }
  );
}

function fillSlide(q, sectionLabel) {
  const bank = q.wordBank?.length
    ? `<div class="word-bank step" data-phase="q">${q.wordBank.map((w) => `<span class="bio-tag">${esc(w)}</span>`).join(" ")}</div>`
    : "";
  const lines = q.lines
    .map((line, i) => {
      const parts = line.segments
        .map((seg) => {
          if (seg.type === "text") return esc(seg.value);
          const ans = seg.accept.join(" / ");
          return `<span class="fill-blank hidden-answer" data-phase="a">${esc(ans)}</span><span class="fill-dash" data-phase="q">________</span>`;
        })
        .join("");
      return `<p class="text-body-sm mb-2 step" data-phase="q">${i + 1}. ${parts}</p>`;
    })
    .join("");
  return slide(
    `${sectionLabel} · Fill in the Blanks`,
    `<p class="font-label-bold text-primary mb-3 step step-text" data-phase="q">${esc(q.stem)}</p>${bank}${lines}
     <div class="answer-reveal step hidden-answer" data-phase="a"><div class="answer-badge">Answers revealed above ↑</div></div>
     <div class="explain-panel step hidden-explain" data-phase="e"><div class="def-box pl-5 py-3 bg-secondary/10 rounded-r-xl deck-text"><strong class="text-secondary">Explanation · 解釋</strong><p class="mt-2 text-on-surface-variant">${esc(q.hint)}</p></div></div>`,
    { phases: "q,a,e" }
  );
}

const CONTENT = [];

// —— Cover ——
CONTENT.push(
  slide(
    "Ch 3 Membrane Transport",
    `<div class="text-center">
      <div class="inline-block px-4 py-1 mb-6 bg-secondary/10 text-secondary rounded-full font-label-bold step">Chapter 3 · Membrane transport (all topics)</div>
      <h1 class="font-headline-xl text-headline-xl mb-4">Membrane ${hl("Transport", "u")}</h1>
      <p class="text-on-surface-variant max-w-2xl mx-auto step">Michael Y's Summer Biology Course — 流動鑲嵌 · 差異滲透性 · 擴散 · 滲透 · 主動運輸 · 吞噬作用</p>
      <div class="flex flex-wrap justify-center gap-2 mt-8 step">
        <span class="bio-tag">Fluid Mosaic</span><span class="bio-tag">Osmosis</span><span class="bio-tag">Active Transport</span><span class="bio-tag">Phagocytosis</span>
      </div>
      <p class="text-on-surface-variant text-body-sm mt-8 step"><kbd>Space</kbd> / <kbd>→</kbd> next · Draw tool bottom-right for underline &amp; circle</p>
    </div>`,
    { center: true }
  )
);

// —— 1 Fluid Mosaic ——
CONTENT.push(
  slide(
    "Fluid mosaic model 流動鑲嵌模型",
    layoutSplit(
      fig("page01_img2.jpeg", "Fluid mosaic model", "Fig 1 · Fluid mosaic — bilayer with embedded proteins and carbohydrate chains.", "fig-tall"),
      `<div class="grid grid-cols-1 gap-2 mb-2">
      <div class="p-3 rounded-xl bg-surface-container-lowest border step step-text">
        <h3 class="deck-subtitle mb-1 text-primary">Fluid 流動</h3>
        <p class="deck-text-sm">The ${hl("phospholipid bilayer 磷脂雙層", "b")} is fluid: phospholipids and proteins move ${hl("laterally 橫向移動", "c")} → ${hl("flexibility 靈活性", "c")}.</p>
      </div>
      <div class="p-3 rounded-xl bg-surface-container-lowest border step step-text">
        <h3 class="deck-subtitle mb-1 text-secondary">Mosaic 馬賽克</h3>
        <p class="deck-text-sm">${hl("Membrane proteins 膜蛋白", "b")} in a ${hl("mosaic pattern", "c")} among phospholipids.</p>
      </div>
    </div>
    <div class="p-3 rounded-xl bg-primary-fixed/40 border deck-text-sm step step-text"><strong class="text-primary">Membrane folding 膜折疊:</strong> infolding for feeding needs ${hl("fluidity 流動性", "u")}, not rigidity.</div>`
    ),
    { previewImg: "page01_img2.jpeg" }
  )
);

// —— 2 Permeability ——
CONTENT.push(
  slide(
    "Differential permeability 差異滲透性",
    layoutSplit(
      fig("page02_img2.jpeg", "Differential permeability", "Fig 2 · Non-polar via bilayer; polar/ions via proteins; large blocked.", "fig-tall"),
      `<p class="deck-text mb-2 step step-text"><strong>Like water 似水:</strong> polar → hydrophilic 親水 · <strong>Like oil 似油:</strong> non-polar → hydrophobic 疏水</p>
    ${tableWrap(`<table class="w-full text-left border-collapse deck-text-sm"><thead><tr class="bg-primary/10"><th class="p-2 font-label-bold text-primary">Substance</th><th class="p-2 font-label-bold text-primary">Examples</th><th class="p-2 font-label-bold text-primary">Movement</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2 font-semibold">Small, non-polar</td><td class="p-2">O₂, CO₂, fatty acids, glycerol</td><td class="p-2">${hl("Phospholipid bilayer", "b")}</td></tr>
      <tr class="step step-text border-b"><td class="p-2 font-semibold">Small, polar</td><td class="p-2">Water, amino acids, glucose</td><td class="p-2">${hl("Proteins", "b")}</td></tr>
      <tr class="step step-text border-b"><td class="p-2 font-semibold">Small ions</td><td class="p-2">Na⁺, Ca²⁺</td><td class="p-2">${hl("Proteins", "b")}</td></tr>
      <tr class="step step-text"><td class="p-2 font-semibold">Large molecules</td><td class="p-2">Starch, triglycerides, proteins</td><td class="p-2">${hl("Membrane folding", "c")}</td></tr>
    </tbody></table>`)}
    <p class="mt-2 text-tertiary font-label-bold deck-text-sm step step-text">${hl("⚠️ Glucose & ions do NOT cross bilayer directly!", "r")}</p>`
    ),
    { previewImg: "page02_img2.jpeg" }
  )
);

CONTENT.push(
  slide(
    "3D membrane model · 互動模型",
    `<div class="slide-lab-layout">
      ${labEmbed(LAB_MEMBRANE, "Interactive membrane transport 3D model · 互動細胞膜跨膜運輸模型")}
      ${labFootnote(
        `<p class="deck-text-sm"><strong class="text-primary">Use in class</strong> — rotate the bilayer; try channel, carrier, osmosis, active transport &amp; phagocytosis.</p>`,
        LAB_MEMBRANE
      )}
    </div>`,
    { previewImg: "page02_img2.jpeg", lab: true }
  )
);

// —— 3 Phospholipid ——
CONTENT.push(
  slide(
    "Phospholipid bilayer 磷脂雙層",
    layoutSplit(
      fig("page08_img1.jpeg", "Phospholipid structure", "Fig 3a · Triglyceride vs phospholipid.", "fig-tall"),
      `<div class="def-box pl-4 py-2 mb-3 bg-surface-container-lowest rounded-r-xl deck-text-sm step step-text">${hl("Hydrophilic 親水 head", "b")} + ${hl("Hydrophobic 疏水 tail", "c")} → ${hl("tail-to-tail bilayer", "u")}</div>
    <div class="grid grid-cols-3 gap-2 text-center deck-text-sm mb-3">
      <div class="p-2 rounded-lg bg-primary/5 border step step-text"><strong class="text-primary">Head</strong><br/>Hydrophilic</div>
      <div class="p-2 rounded-lg bg-secondary/5 border step step-text"><strong class="text-secondary">Core</strong><br/>Hydrophobic tails</div>
      <div class="p-2 rounded-lg bg-primary/5 border step step-text"><strong class="text-primary">Head</strong><br/>Hydrophilic</div>
    </div>
    <p class="deck-meta step step-text">Heads face aqueous sides; tails meet in the hydrophobic core.</p>`
    ),
    { previewImg: "page08_img1.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Phospholipid bilayer · Fig 3b",
    `${fig("page08_img2_bilayer.jpeg", "Bilayer", "Fig 3b · Tail-to-tail; heads face extracellular fluid & cytoplasm.", "fig-wide")}
    <p class="deck-text step step-text">Hydrophobic tails face ${hl("inward", "c")}; hydrophilic heads face ${hl("water on both sides", "b")}.</p>`,
    { previewImg: "page08_img2_bilayer.jpeg" }
  )
);

// —— 4 Membrane proteins ——
CONTENT.push(
  slide(
    "Membrane proteins 膜蛋白",
    layoutSplit(
      fig("page09_img3.jpeg", "Membrane proteins", "Fig 4 · Enzymes; channels & carriers; receptors & glycoproteins.", "fig-wide"),
      tableWrap(`<table class="w-full text-left border-collapse deck-text-sm"><thead><tr class="bg-secondary/10"><th class="p-2 font-label-bold text-secondary">Type</th><th class="p-2 font-label-bold text-secondary">Function</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2 font-semibold">Enzymes 酶</td><td class="p-2">Speed up chemical reactions</td></tr>
      <tr class="step step-text border-b"><td class="p-2 font-semibold">Channel proteins 通道蛋白</td><td class="p-2">Open channels — ${hl("NOT shape change", "r")}</td></tr>
      <tr class="step step-text border-b"><td class="p-2 font-semibold">Carrier/Transport 輸運蛋白</td><td class="p-2">${hl("Shape change", "b")}; energy from respiration</td></tr>
      <tr class="step step-text border-b"><td class="p-2 font-semibold">Receptor 受體蛋白</td><td class="p-2">"Card reader" — bind hormones</td></tr>
      <tr class="step step-text"><td class="p-2 font-semibold">Glycoproteins 糖蛋白</td><td class="p-2">"ID card" — ${hl("antigen 抗原", "u")}</td></tr>
    </tbody></table>`)
    ),
    { previewImg: "page09_img3.jpeg" }
  )
);

// —— 5 Damage ——
CONTENT.push(
  slide(
    "Factors damaging cell membrane",
    layoutSplit(
      fig("page10_img1.jpeg", "Beetroot ethanol experiment", "Fig 5 · Ethanol damages membrane → pigment leaks.", "fig-graph"),
      `<p class="deck-text-sm mb-2 step step-text"><strong>"Juice leaked 漏汁"</strong> = membrane damaged!</p>
    ${tableWrap(`<table class="w-full text-left border-collapse deck-text-sm"><thead><tr class="bg-tertiary/10"><th class="p-2">Factor</th><th class="p-2">Lipids</th><th class="p-2">Proteins</th><th class="p-2">Examples</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2">Organic solvents</td><td class="p-2">Dissolve bilayer</td><td class="p-2">Denature</td><td class="p-2">Ethanol, alcohol</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Detergents</td><td class="p-2">Dissolve bilayer</td><td class="p-2">Break interactions</td><td class="p-2">Soap</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Extreme pH</td><td class="p-2">Destabilize</td><td class="p-2">Denature</td><td class="p-2">Stomach acid</td></tr>
      <tr class="step step-text border-b"><td class="p-2">High temperature</td><td class="p-2">Destabilize</td><td class="p-2">Denature</td><td class="p-2">Boiling</td></tr>
      <tr class="step step-text"><td class="p-2">Mechanical stress</td><td class="p-2">—</td><td class="p-2">—</td><td class="p-2">Pressure; excess water</td></tr>
    </tbody></table>`)}
    <p class="deck-meta mt-2 step step-text"><em>Application:</em> use these factors to kill harmful microorganisms (e.g. bacteria).</p>`
    ),
    { previewImg: "page10_img1.jpeg" }
  )
);

// —— 6 Transport overview ——
CONTENT.push(
  slide(
    "Overview of membrane transport 跨膜運輸概覽",
    layoutSplit(
      fig("page15_img1.jpeg", "Transport overview", "Fig 6 · Diffusion, osmosis, active transport, phagocytosis.", "fig-wide"),
      tableWrap(`<table class="w-full text-left border-collapse deck-text-sm"><thead><tr class="bg-primary/10"><th class="p-2">Process</th><th class="p-2">Energy</th><th class="p-2">Membrane?</th><th class="p-2">Stops when</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2"><strong>Diffusion</strong></td><td class="p-2">${hl("Passive", "c")}</td><td class="p-2">No</td><td class="p-2">Equilibrium</td></tr>
      <tr class="step step-text border-b"><td class="p-2"><strong>Osmosis</strong></td><td class="p-2">${hl("Passive", "c")}</td><td class="p-2">Yes</td><td class="p-2">Equal ψ</td></tr>
      <tr class="step step-text border-b"><td class="p-2"><strong>Active transport</strong></td><td class="p-2">${hl("Active", "u")}</td><td class="p-2">Living</td><td class="p-2">No energy</td></tr>
      <tr class="step step-text border-b"><td class="p-2"><strong>Endocytosis / Phagocytosis</strong></td><td class="p-2">${hl("Active", "u")}</td><td class="p-2">Living</td><td class="p-2">—</td></tr>
      <tr class="step step-text"><td class="p-2"><strong>Exocytosis</strong></td><td class="p-2">${hl("Active", "u")}</td><td class="p-2">Living</td><td class="p-2">—</td></tr>
    </tbody></table>`) +
        `<p class="deck-meta mt-2 step step-text">Active transport: against gradient, or along gradient but ${hl("faster", "b")}.</p>`
    ),
    { previewImg: "page15_img1.jpeg" }
  )
);

// —— 7 Net movement ——
CONTENT.push(
  slide(
    "Concept of net 淨 movement",
    `<div class="grid grid-cols-2 gap-3 mb-3">
      <div class="p-3 rounded-xl bg-surface-container-low border step step-text"><p class="deck-subtitle text-primary">Equal rates</p><p class="deck-text-sm mt-1">▶ 10 ◀ 10 → ${hl("no net movement", "u")}</p></div>
      <div class="p-3 rounded-xl bg-surface-container-low border step step-text"><p class="deck-subtitle text-secondary">Unequal</p><p class="deck-text-sm mt-1">▶ 10 ◀ 5 → net ▶ 5</p></div>
    </div>
    <div class="p-3 rounded-xl bg-tertiary/10 border text-center step step-text"><strong class="text-tertiary">${hl("No net movement ≠ no movement!", "r")}</strong></div>`,
    { previewImg: "page16_img2.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Concept of net · Fig 7",
    `${fig("page16_img2.jpeg", "Selectively permeable", "Fig 7 · Small molecules pass; large solute blocked.", "fig-tall")}
    <p class="deck-text-sm step step-text">Differentially permeable membrane — pores allow small molecules; large solute particles cannot cross.</p>`,
    { previewImg: "page16_img2.jpeg" }
  )
);

// —— 8 Diffusion ——
CONTENT.push(
  slide(
    "Diffusion 擴散作用 · Definition",
    layoutSplit(
      fig("page16_img1.jpeg", "Net movement", "Fig · Equal traffic both ways = no net movement.", ""),
      `<div class="def-box pl-4 py-2 bg-surface-container-lowest rounded-r-xl deck-text-sm step step-text"><strong>Definition:</strong> Net movement ${hl("high → low", "u")} concentration until equilibrium.</div>
    <p class="deck-meta step step-text">Molecules still move both ways — only the <strong>net</strong> direction matters.</p>`
    ),
    { previewImg: "page16_img1.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Diffusion · Factors & Fig 8",
    layoutSplit(
      fig("page16_img3.jpeg", "Diffusion", "Fig 8 · Non-polar through bilayer; polar via proteins.", "fig-tall"),
      `<div class="grid grid-cols-1 gap-2 deck-text-sm">
      <div class="p-2 rounded-lg border step step-text"><strong>${hl("Greater gradient", "b")}</strong> — e.g. intestine; capillaries remove products</div>
      <div class="p-2 rounded-lg border step step-text"><strong>${hl("Larger surface area", "b")}</strong> — e.g. microvilli</div>
      <div class="p-2 rounded-lg border step step-text"><strong>${hl("Shorter distance", "b")}</strong> — thin, one-cell-thick walls</div>
      <div class="p-2 rounded-lg border step step-text"><strong>${hl("Higher temperature", "b")}</strong> — more kinetic energy</div>
      <div class="p-2 rounded-lg border step step-text"><strong>${hl("Smaller & non-polar", "c")}</strong> — CO₂, O₂ faster than glucose</div>
    </div>`
    ),
    { previewImg: "page16_img3.jpeg" }
  )
);

// —— 9 Osmosis core ——
CONTENT.push(
  slide(
    "Osmosis 滲透作用 · Definition",
    `<div class="def-box pl-4 py-3 mb-3 bg-primary-fixed/30 rounded-r-xl deck-text-sm step step-text">
      Osmosis = ${hl("net movement of water", "b")} across ${hl("differentially permeable 差異滲透性", "c")} membrane from ${hl("higher ψ", "u")} to ${hl("lower ψ", "r")}.
      <br/><span class="deck-meta">水分子穿過差異滲透膜，從水勢較高向水勢較低的淨移動</span>
    </div>
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="p-3 rounded-xl border step step-text deck-text-sm"><strong>Requirements:</strong><ol class="list-decimal list-inside mt-1"><li>Differentially permeable membrane</li><li>Water potential difference</li></ol></div>
      <div class="p-3 rounded-xl bg-secondary/5 border step step-text"><strong class="text-secondary">${hl("Water follows solute! 水跟溶質走", "c")}</strong><p class="deck-meta mt-1">Passive — no energy required.</p></div>
    </div>`,
    { previewImg: "page18_img2.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Osmosis · Water potential ψ 水勢",
    layoutFigTop(
      figGrid2(
        fig("page18_img2.jpeg", "Osmosis", "Fig 9 · Net H₂O high ψ → low ψ.", "fig-tall"),
        fig("page18_img1.jpeg", "Water potential table", "Fig 10 · Pure water 0; more solute → more negative ψ.", "fig-tall")
      ),
      `${tableWrap(`<table class="w-full deck-text-sm"><thead><tr class="bg-primary/10"><th class="p-2">Region</th><th class="p-2">Solute</th><th class="p-2">Water potential ψ</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2">Less solute (dilute)</td><td class="p-2">Lower solute conc.</td><td class="p-2"><strong>Higher</strong> ψ (pure water ≈ 0)</td></tr>
      <tr class="step step-text"><td class="p-2">More solute (concentrated)</td><td class="p-2">Higher solute conc.</td><td class="p-2"><strong>Lower</strong> ψ (more negative)</td></tr>
    </tbody></table>`)}
    <p class="deck-meta step step-text">${hl("Solute does not cross", "r")} the membrane in osmosis — only water net movement. Equal ψ → osmosis stops.</p>`
    ),
    { previewImg: "page18_img2.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Virtual osmosis lab · 滲透實驗",
    `<div class="slide-lab-layout">
      ${labEmbed(LAB_OSMOSIS, "Virtual osmosis laboratory · 虛擬滲透實驗")}
      ${labFootnote(
        `<p class="deck-text-sm">Adjust molarity — watch net water move from <strong class="text-primary">higher ψ</strong> to <strong class="text-tertiary">lower ψ</strong>.</p>`,
        LAB_OSMOSIS
      )}
    </div>`,
    { previewImg: "page18_img2.jpeg", lab: true }
  )
);

CONTENT.push(
  slide(
    "Osmosis · Water follows solute",
    layoutSplit(
      fig("page17_img1.jpeg", "Osmosis biology topics", "Water follows solute — biology topics.", ""),
      `<p class="deck-text-sm mb-2 step step-text">${hl("Net water movement", "b")} due to solute — ${hl("Water follows solute!", "c")}</p>
    ${tableWrap(`<table class="w-full deck-text-sm"><thead><tr class="bg-primary/10"><th class="p-2">Sugar movement</th><th class="p-2">Net solute</th><th class="p-2">Net water</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2">▶10 ◀10</td><td class="p-2">▶10</td><td class="p-2">▶30</td></tr>
      <tr class="step step-text"><td class="p-2">▶5 ◀5</td><td class="p-2">▶10</td><td class="p-2">▶10</td></tr>
    </tbody></table>`)}`
    ),
    { previewImg: "page17_img1.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Osmosis · Fig 11 Capillary tube",
    `${fig("page19_img1.png", "Capillary tube osmosis", "Fig 11 · Net water Y → X → capillary rises.", "fig-wide")}
    <p class="deck-text-sm step step-text">Concentrated sucrose <strong>X</strong> inside tubing → net water moves <strong>into</strong> tubing → capillary level rises.</p>`,
    { previewImg: "page19_img1.png" }
  )
);

CONTENT.push(
  slide(
    "Osmosis · Fig 12 Three cells",
    `${fig("page20_img1.jpeg", "Three cells ABC", "Fig 12 · Net water flows toward lower ψ.", "")}
    <p class="deck-text-sm step step-text">Net water flows from higher ψ toward lower ψ: B (−1) → A (−3) and B → C (−6).</p>`,
    { previewImg: "page20_img1.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Applied · Beetroot cylinder 甜菜根",
    layoutSplit(
      fig("page20_img2.jpeg", "Beetroot setups", "Fig 13 · Setup A 0°C clear · Setup B 70°C pigment leaked.", ""),
      `<ul class="deck-text-sm space-y-1 step step-text list-disc list-inside">
      <li><strong>Setup A</strong> (intact + distilled water): osmosis ${hl("yes", "c")}; water ${hl("into", "u")} cylinder → longer, heavier, less dense</li>
      <li><strong>Setup B</strong> ("juice leaked"): osmosis ${hl("no", "r")} — membrane no longer differentially permeable</li>
      <li>ψ distilled water: <strong>0 / highest</strong>; beet cells: <strong>negative</strong></li>
    </ul>`
    ),
    { previewImg: "page20_img2.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Applied · Egg without shell 去殼雞蛋",
    layoutFigTop(
      figGrid2(
        fig("page21_img2.jpeg", "Decalcified eggs", "Photo · Compare egg size in each solution.", ""),
        fig("page21_img1.jpeg", "Egg osmosis", "Fig 14 · Salt vs fresh water.", "fig-wide")
      ),
      `<ul class="deck-text-sm step step-text list-disc list-inside">
      <li><strong>Salt solution</strong> (lower ψ): water ${hl("out", "r")} → egg ${hl("shrinks", "u")}</li>
      <li><strong>Tap water</strong> (higher ψ): water ${hl("in", "c")} → egg ${hl("expands", "u")}</li>
      <li>Shell removed — ${hl("not permeable to water", "b")}</li>
    </ul>`
    ),
    { previewImg: "page21_img1.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Applied · RBC in sucrose 紅血球",
    layoutFigTop(
      fig("page22_img1.jpeg", "RBC", "Fig 15 · B > A > C sucrose concentration.", "fig-tall"),
      `<p class="deck-text-sm step step-text">Sucrose concentration: <strong>${hl("B > A > C", "u")}</strong></p>
    <ul class="deck-text-sm step step-text list-disc list-inside">
      <li>B = crenation (hypertonic)</li>
      <li>A = normal</li>
      <li>C = swelling / haemolysis (hypotonic)</li>
    </ul>`
    ),
    { previewImg: "page22_img1.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Applied · Visking tubing",
    layoutSplit(
      fig("page22_img2.png", "Visking tubing", "Fig 16 · Mass 12→9.5 g = water leaves tubing.", "fig-wide"),
      `<p class="deck-text-sm step step-text">Mass 12.0 g → 9.5 g means water left tubing → outside more concentrated (e.g. X 10% sucrose, Y 5% sucrose).</p>`
    ),
    { previewImg: "page22_img2.png" }
  )
);

CONTENT.push(
  slide(
    "Applied · Potato experiments 馬鈴薯",
    layoutSplit(
      fig("page25_img1.jpeg", "Potato strips", "Strips after 2 h in salt solutions.", ""),
      `<p class="deck-text-sm step step-text"><strong>Fig 17 · Length:</strong> Strips shrink in hypertonic solutions; isotonic point ≈ ${hl("0.3", "c")} arbitrary units of salt.</p>
    <p class="deck-meta step step-text">In hypotonic solutions water enters → strips stay longer or turgid.</p>`
    ),
    { previewImg: "page25_img1.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Applied · Potato mass graph 馬鈴薯質量",
    layoutSplit(
      fig("page24_img1.jpeg", "Potato mass graph", "Fig 18 · Isotonic ≈ 5.8% salt.", "fig-graph"),
      `<p class="deck-text-sm step step-text">Percentage mass change vs salt concentration — isotonic point ≈ ${hl("5.8%", "c")} (no net water movement).</p>`
    ),
    { previewImg: "page24_img1.jpeg" }
  )
);

CONTENT.push(
  slide(
    "Applied · Potato length chart",
    `${fig("page25_img2.png", "Potato length chart", "Mean length vs salt conc. — isotonic ≈ 0.3 a.u.", "fig-graph")}
    <p class="deck-text-sm step step-text">At isotonic point, mean strip length is unchanged after 2 hours.</p>`,
    { previewImg: "page25_img2.png" }
  )
);

CONTENT.push(
  slide(
    "Applied · Digestive system 消化系統",
    layoutSplit(
      fig("page23_img1.jpeg", "Digestive system", "Fig 20 · Large intestine absorbs most water.", "fig-wide"),
      `<p class="deck-text-sm step step-text"><strong class="text-secondary">Water follows solute!</strong> Most water absorption occurs in the ${hl("large intestine 大腸", "u")} (after digestion in small intestine).</p>`
    ),
    { previewImg: "page23_img1.jpeg" }
  )
);

// —— Active transport ——
CONTENT.push(
  slide(
    "Active transport 主動運輸",
    layoutFigTop(
      figGrid2(
        fig("page33_img1.jpeg", "Active transport carrier", "Fig 21 · Carrier shape change powered by respiration.", "fig-tall"),
        fig("page33_img2.jpeg", "Root hair nitrates", "Root hair — active transport against gradient.", "fig-tall")
      ),
      `<p class="deck-text-sm step step-text">Uses ${hl("energy from respiration", "u")} (ATP) to change ${hl("carrier protein", "b")} shape — often ${hl("against", "r")} the concentration gradient.</p>
    <p class="deck-meta step step-text">Example: absorption of <strong>nitrates</strong> into root hair cells when soil concentration is low.</p>
    ${tableWrap(`<table class="w-full deck-text-sm"><thead><tr class="bg-secondary/10"><th class="p-2">Soil vs cell</th><th class="p-2">Diffusion</th><th class="p-2">Active transport</th></tr></thead><tbody>
      <tr class="step step-text border-b"><td class="p-2">Soil &gt; cell</td><td class="p-2">✔</td><td class="p-2">✔</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Soil = cell</td><td class="p-2">✘</td><td class="p-2">✔</td></tr>
      <tr class="step step-text border-b"><td class="p-2">Soil &lt; cell</td><td class="p-2">✘</td><td class="p-2">✔ required</td></tr>
      <tr class="step step-text"><td class="p-2">+ cyanide</td><td class="p-2">Unaffected</td><td class="p-2">${hl("✘ stops", "r")}</td></tr>
    </tbody></table>`)}`
    ),
    { previewImg: "page33_img1.jpeg" }
  )
);

// —— Phagocytosis ——
CONTENT.push(
  slide(
    "Phagocytosis 吞噬作用",
    layoutFigTop(
      figGrid2(
        fig("page34_img1.jpeg", "Phagocytosis steps", "Fig 22 · Pseudopodia → vacuole → lysosome.", "fig-tall"),
        fig("page35_img1.jpeg", "Amoeba feeding", "Fig 23 · Amoeba MCQ: fluidity & mosaic (2 & 3).", "fig-tall")
      ),
      `<p class="deck-text-sm step step-text">Engulfing large particles — ${hl("membrane folding", "b")} enabled by ${hl("fluidity", "c")}. Cargo: proteins & large particles (not glucose, O₂, small ions).</p>
    <div class="phago-steps deck-text-sm">
      <div class="flex gap-2 step step-text"><span class="step-num">1</span><span>Infolding → ${hl("pseudopodia 偽足", "u")}</span></div>
      <div class="flex gap-2 step step-text"><span class="step-num">2</span><span>Particle engulfed</span></div>
      <div class="flex gap-2 step step-text"><span class="step-num">3</span><span>Enclosed in ${hl("vacuole 液泡", "b")}</span></div>
      <div class="flex gap-2 step step-text"><span class="step-num">4</span><span>${hl("Lysosome 溶酶體", "c")} fuses → digest</span></div>
      <div class="flex gap-2 step step-text col-span-2"><span class="step-num">5</span><span>Products ${hl("diffuse", "u")} into cytoplasm</span></div>
    </div>
    <div class="grid grid-cols-2 gap-2 deck-text-sm">
      <div class="p-2 rounded-lg bg-primary/5 step step-text"><strong>Examples:</strong> Amoeba feeding; WBC engulfing bacteria</div>
      <div class="p-2 rounded-lg bg-tertiary/5 step step-text"><strong>NOT phagocytosis:</strong> O₂ transport; intestinal glucose absorption</div>
    </div>`,
      "dense"
    ),
    { previewImg: "page34_img1.jpeg" }
  )
);

// —— Exam checklist ——
CONTENT.push(
  slide(
    "HKDSE exam checklist",
    layoutSplit(
      fig("page22_img1.jpeg", "RBC in sucrose", "RBC: A normal · B crenated · C swollen.", ""),
      `<ul class="space-y-2 deck-text-sm text-on-surface-variant">
      <li class="step step-text flex gap-2"><span class="text-secondary">✓</span> Say ${hl("“net movement”", "u")} for osmosis & diffusion</li>
      <li class="step step-text flex gap-2"><span class="text-secondary">✓</span> Osmosis: ${hl("differentially permeable", "c")} + ${hl("water potential", "c")} difference (差異滲透性; avoid “semi-permeable” alone)</li>
      <li class="step step-text flex gap-2"><span class="text-secondary">✓</span> ${hl("Channel", "u")} = pore; ${hl("Carrier", "u")} = shape change</li>
      <li class="step step-text flex gap-2"><span class="text-secondary">✓</span> Water: ${hl("high ψ → low ψ", "c")}</li>
      <li class="step step-text flex gap-2"><span class="text-secondary">✓</span> "Juice leaked" → no longer differentially permeable</li>
      <li class="step step-text flex gap-2"><span class="text-secondary">✓</span> Phagocytosis needs ${hl("fluidity", "b")}; Amoeba MCQ: (2) & (3)</li>
      <li class="step step-text flex gap-2"><span class="text-secondary">✓</span> RBC order: ${hl("B > A > C", "u")}</li>
      <li class="step step-text flex gap-2"><span class="text-secondary">✓</span> Potato isotonic: ${hl("5.8%", "c")} or ${hl("0.3", "c")} a.u.</li>
    </ul>`
    ),
    { previewImg: "page22_img1.jpeg" }
  )
);

// —— Quiz slides by section ——
const sectionMap = Object.fromEntries(QUIZ_SECTIONS.map((s) => [s.id, s.label]));

for (const sec of QUIZ_SECTIONS) {
  CONTENT.push(
    slide(
      `Concept checks · ${sec.label}`,
      `<div class="text-center py-8"><div class="inline-block px-6 py-2 bg-primary/10 text-primary rounded-full font-label-bold text-lg step">Concept checks</div><h2 class="font-headline-lg mt-6 step">${sec.label}</h2><p class="text-on-surface-variant mt-2 step">${sec.labelZh}</p><p class="text-body-sm mt-6 step">Each question: show Q → click Answer → click Explanation</p></div>`,
      { center: true }
    )
  );

  const items = MEMBRANE_QUIZ.filter((q) => q.section === sec.id);
  const tfItems = items.filter((q) => q.format === "tf");
  const otherItems = items.filter((q) => q.format !== "tf");
  const mcqItems = otherItems.filter((q) => q.format !== "fill");
  const fillItems = otherItems.filter((q) => q.format === "fill");
  let mcqNum = 0;

  for (const q of mcqItems) {
    mcqNum++;
    CONTENT.push(mcqSlide(q, mcqNum, sec.label));
  }

  for (let i = 0; i < tfItems.length; i += 5) {
    const batch = tfItems.slice(i, i + 5);
    CONTENT.push(tfBatchSlide(batch, `Set ${Math.floor(i / 5) + 1}`, sec.label, i + 1));
  }

  for (const q of fillItems) {
    CONTENT.push(fillSlide(q, sec.label));
  }
}

CONTENT.push(
  slide(
    "完 · End",
    `<div class="text-center py-12"><h2 class="font-headline-xl mb-4">Ch 3 Membrane Transport</h2><p class="text-on-surface-variant step">Michael Y's Summer Biology Course</p><p class="text-body-sm mt-6 opacity-70 step">Review with S3 Bio flashcards &amp; quiz</p></div>`,
    { center: true }
  )
);

const slidesHtml = CONTENT.map(
  (s, i) => `<section class="deck-slide${s.center ? " deck-slide--center" : ""}${s.lab ? " deck-slide--lab" : ""}${i === 0 ? " active" : ""}" data-index="${i}" data-phases="${s.phases || ""}" data-preview="${s.previewImg ? ASSET_PREFIX + s.previewImg : ""}" aria-hidden="${i === 0 ? "false" : "true"}" id="slide-${i}">
  <div class="deck-slide__inner">
    <h2 class="deck-slide__title text-primary mb-2">${s.title}</h2>
    <div class="deck-slide__body">${s.body}</div>
  </div>
</section>`
).join("\n");

const sidebarHtml = CONTENT.map(
  (s, i) => `<button type="button" class="sidebar-item${i === 0 ? " is-active" : ""}" data-goto="${i}" title="${esc(s.title)}">
  <span class="sidebar-num">${i + 1}</span>
  <span class="sidebar-thumb">${s.previewImg ? `<img src="${ASSET_PREFIX}${s.previewImg}" alt="" loading="lazy"/>` : `<span class="sidebar-thumb-ph">${esc(s.title.slice(0, 2))}</span>`}</span>
  <span class="sidebar-label">${esc(s.title)}</span>
</button>`
).join("\n");

const html = `<!DOCTYPE html>
<html class="light" lang="zh-HK">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Ch 3 Membrane Transport — Class Slides</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"><\/script>
<script>
tailwind.config={darkMode:"class",theme:{extend:{colors:{background:"#f7f9fb",secondary:"#006d37",primary:"#004e9f","outline-variant":"#c1c6d5","primary-fixed":"#d7e3ff","on-background":"#191c1e","on-surface-variant":"#414753","on-surface":"#191c1e","surface-container-low":"#f2f4f6","surface-container-lowest":"#ffffff",tertiary:"#a50018"}}}};
<\/script>
<style>
:root{--fs-title:clamp(1.5rem,2.5vw,2rem);--fs-sub:clamp(1.25rem,1.9vw,1.55rem);--fs-body:clamp(1.12rem,1.7vw,1.38rem);--fs-sm:clamp(.98rem,1.4vw,1.15rem);--fs-xs:clamp(.82rem,1.15vw,.95rem);--sidebar-w:260px;--hud-h:2.75rem;--title-block:2.6rem;--content-h:calc(100vh - var(--hud-h) - var(--title-block) - 1rem)}
html,body{height:100%;margin:0;overflow:hidden}
body{font-family:Inter,sans-serif;background:#111;font-size:var(--fs-body);color:#191c1e}
.glass-frost{background:rgba(255,255,255,.4);backdrop-filter:blur(12px)}
.def-box{border-left:4px solid #004e9f;padding:.55rem .75rem!important}
.step-num{width:2rem;height:2rem;border-radius:999px;background:#004e9f;color:#fff;font-size:.85rem;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.deck-text{font-size:var(--fs-body)!important;line-height:1.45;color:#191c1e}
.deck-text-sm{font-size:var(--fs-sm)!important;line-height:1.4}
.deck-meta{font-size:var(--fs-sm)!important;line-height:1.38;color:#414753}
.deck-subtitle{font-size:var(--fs-sub)!important;font-weight:700;line-height:1.28}
.deck-slide__title{font-size:var(--fs-title)!important;font-weight:800;line-height:1.15;letter-spacing:-.02em;flex-shrink:0;margin-bottom:.35rem!important}
.font-headline-xl{font-size:clamp(1.75rem,3.2vw,2.5rem)!important;line-height:1.15!important}
.slide-split{display:grid;grid-template-columns:minmax(0,44%) minmax(0,56%);gap:1rem;align-items:stretch;flex:1;min-height:0;height:100%}
.slide-split__pic{display:flex;flex-direction:column;min-height:0;height:100%}
.slide-split__pic .fig-box{flex:1;display:flex;flex-direction:column;min-height:0;margin-top:0;height:100%}
.slide-split__text{display:flex;flex-direction:column;justify-content:center;gap:.75rem;min-height:0;height:100%;overflow:hidden}
.mcq-layout{display:grid;grid-template-columns:minmax(0,40%) minmax(0,60%);gap:.85rem;align-items:stretch;flex:1;min-height:0;height:100%}
.mcq-layout .fig-box{margin-top:0;height:100%;display:flex;flex-direction:column;min-height:0}
.mcq-q{display:flex;flex-direction:column;justify-content:center;gap:.45rem;min-height:0;height:100%}
.fig-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:.65rem;height:100%;flex:1;min-height:0;align-items:stretch}
.fig-grid-2 .fig-box{height:100%;display:flex;flex-direction:column;min-height:0}
.layout-fig-top{display:flex;flex-direction:column;height:100%;gap:.5rem;min-height:0;overflow:hidden}
.layout-fig-top__media{flex:1.2;min-height:0;max-height:58%;display:flex;flex-direction:column;overflow:hidden}
.layout-fig-top__media .fig-grid-2{flex:1;height:100%;min-height:0}
.layout-fig-top__media .fig-grid-2 .fig-box img{max-height:100%!important;height:100%;min-height:0}
.layout-fig-top__media>.fig-box{flex:1;height:100%;display:flex;flex-direction:column;min-height:0}
.layout-fig-top__media>.fig-box img{max-height:100%!important;height:100%;min-height:0}
.layout-fig-top__text{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-start;gap:.3rem;overflow-y:auto;overflow-x:hidden}
.layout-fig-top--dense .layout-fig-top__media{flex:0 0 42%;max-height:42%}
.layout-fig-top--dense .layout-fig-top__text{flex:1;justify-content:flex-start}
.phago-steps{display:grid;grid-template-columns:1fr 1fr;gap:.25rem .75rem}
.phago-steps .step-num{width:1.65rem;height:1.65rem;font-size:.75rem}
.deck-slide--lab .deck-slide__title{margin-bottom:.2rem!important}
.slide-lab-layout{display:flex;flex-direction:column;height:100%;min-height:0;gap:.35rem}
.slide-lab-embed{flex:1;min-height:0;border-radius:.65rem;overflow:hidden;border:1px solid rgba(193,198,213,.45);background:#03080c}
.slide-lab-embed__frame{width:100%;height:100%;min-height:340px;border:0;display:block}
.slide-lab-foot{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:.75rem;flex-wrap:wrap}
.slide-lab-open-btn{border:1px solid #c1c6d5;background:#fff;border-radius:999px;padding:.32rem .8rem;font-size:var(--fs-xs);font-weight:600;color:#004e9f;cursor:pointer;white-space:nowrap;flex-shrink:0}
.slide-lab-open-btn:hover{background:rgba(0,78,159,.08);border-color:#004e9f}
.fig-box{margin-top:0;padding:.5rem .65rem;border-radius:.65rem;background:#fff;border:1px solid rgba(193,198,213,.45);overflow:hidden}
.fig-box img{display:block;width:100%;flex:1;min-height:0;object-fit:contain;border-radius:.35rem;background:#f7f9fb;max-height:calc(var(--content-h) - 1.5rem)}
.slide-split__pic .fig-box img,.mcq-layout .fig-box img{max-height:calc(var(--content-h) - 1.25rem);height:100%}
.fig-grid-2 .fig-box img{max-height:calc(var(--content-h) - 2rem)}
.fig-box.fig-tall img{max-height:calc(var(--content-h) - 1rem)}
.fig-box.fig-wide img,.fig-box.fig-graph img{max-height:calc(var(--content-h) - 1.25rem)}
.deck-slide__body>.fig-box{flex:1;display:flex;flex-direction:column;min-height:0;height:100%}
.deck-slide__body>.fig-box img{max-height:calc(var(--content-h) - 2rem)}
.fig-caption{margin-top:.35rem;font-size:var(--fs-xs)!important;line-height:1.3;color:#414753;flex-shrink:0}
.bio-tag{display:inline-block;padding:.28rem .65rem;border-radius:999px;font-size:var(--fs-sm)!important;font-weight:600;background:rgba(0,78,159,.1);color:#004e9f}
.grid .p-3{padding:.75rem!important}
.grid{gap:.75rem!important}
.app-shell{display:flex;height:100vh;width:100%;transition:all .25s ease}
.app-shell.sidebar-hidden{--sidebar-w:0px}
.deck-sidebar{width:var(--sidebar-w);min-width:0;flex-shrink:0;background:#fff;border-right:1px solid rgba(193,198,213,.55);display:flex;flex-direction:column;z-index:60;overflow:hidden;transition:width .25s ease,opacity .2s ease}
.app-shell.sidebar-hidden .deck-sidebar{opacity:0;pointer-events:none;border:none}
.deck-sidebar__head{padding:.45rem .6rem;border-bottom:1px solid rgba(193,198,213,.4);display:flex;align-items:center;justify-content:space-between;gap:.4rem;background:#f7f9fb;flex-shrink:0}
.deck-sidebar__head h2{font-size:var(--fs-sm);font-weight:700;color:#004e9f;margin:0}
.sidebar-head-actions{display:flex;align-items:center;gap:.35rem}
.sidebar-toggle,.sidebar-fab{border:1px solid #c1c6d5;background:#fff;border-radius:.4rem;padding:.2rem .4rem;font-size:var(--fs-xs);font-weight:600;color:#004e9f;cursor:pointer}
.sidebar-fab{display:none;position:fixed;left:.45rem;top:50%;transform:translateY(-50%);z-index:70;padding:.4rem .5rem;border-radius:0 .45rem .45rem 0;box-shadow:2px 0 10px rgba(0,0,0,.1);align-items:center}
.app-shell.sidebar-hidden .sidebar-fab{display:flex}
.deck-sidebar__nav{flex:1;overflow-y:auto;padding:.35rem}
.sidebar-item{display:flex;align-items:center;gap:.4rem;width:100%;padding:.35rem .4rem;margin-bottom:.12rem;border:1px solid transparent;border-radius:.45rem;background:transparent;cursor:pointer;text-align:left}
.sidebar-item.is-active{background:rgba(0,78,159,.12);border-color:rgba(0,78,159,.35)}
.sidebar-num{width:1.45rem;font-size:var(--fs-xs);font-weight:800;color:#004e9f;text-align:center}
.sidebar-thumb{width:2.6rem;height:1.7rem;border-radius:.28rem;overflow:hidden;background:#eef2f6;border:1px solid rgba(193,198,213,.5)}
.sidebar-thumb img{width:100%;height:100%;object-fit:cover}
.sidebar-thumb-ph{font-size:.6rem;font-weight:700;color:#414753;display:flex;align-items:center;justify-content:center;width:100%;height:100%}
.sidebar-label{flex:1;font-size:.65rem;line-height:1.15;color:#414753;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.deck-main{flex:1;position:relative;min-width:0;height:100vh}
.deck{position:relative;width:100%;height:100%}
.deck-slide{position:absolute;inset:0;padding:.65rem 1.15rem var(--hud-h);background:linear-gradient(160deg,#fff 0%,#f7f9fb 55%,#eef2f6 100%);opacity:0;visibility:hidden;transform:translateX(24px);transition:opacity .3s,transform .3s,visibility .3s;overflow:hidden;display:flex;flex-direction:column}
.deck-slide.active{opacity:1;visibility:visible;transform:none;z-index:2}
.deck-slide.leaving{z-index:1;transform:translateX(-24px);opacity:0}
.deck-slide--center .deck-slide__inner{justify-content:center}
.deck-slide--center .deck-slide__body{justify-content:center;align-items:center}
.deck-slide__inner{max-width:1280px;width:100%;margin:0 auto;flex:1;min-height:0;height:100%;display:flex;flex-direction:column;transform-origin:center center}
.deck-slide__body{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;height:var(--content-h)}
.deck-hud{position:absolute;bottom:0;left:0;right:0;z-index:50;height:var(--hud-h);display:flex;align-items:center;gap:.45rem;padding:0 .65rem;background:rgba(255,255,255,.96);border-top:1px solid rgba(193,198,213,.5);font-size:var(--fs-xs);color:#414753}
.deck-hud button{border:1px solid #c1c6d5;background:#fff;border-radius:999px;padding:.32rem .75rem;font-weight:600;font-size:var(--fs-xs);color:#004e9f;cursor:pointer}
.deck-progress{flex:1;max-width:160px;height:5px;background:rgba(0,78,159,.12);border-radius:999px;overflow:hidden}
.deck-progress>div{height:100%;background:#004e9f;transition:width .3s}
#hud-label{flex:1;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.step{opacity:0;transform:translateY(5px);transition:opacity .28s,transform .28s}
.step.shown{opacity:1;transform:none}
.hidden-answer,.hidden-explain{display:none}
.hidden-answer.shown,.hidden-explain.shown{display:block}
.fill-blank.hidden-answer{display:none}
.fill-blank.shown{display:inline;background:#bbf7d0;color:#14532d;font-weight:700;padding:.06rem .35rem;border-radius:.2rem;font-size:var(--fs-body)!important}
.mcq-list{margin:0;padding-left:1.2rem}
.mcq-list li{margin-bottom:.28rem;font-size:var(--fs-body)!important;line-height:1.4}
.answer-badge{display:inline-block;padding:.4rem .9rem;border-radius:999px;background:#006d37;color:#fff;font-weight:700;font-size:var(--fs-sm)}
.answer-badge--sm{font-size:var(--fs-sm);padding:.3rem .65rem}
.mcq-opt.correct-answer{background:#bbf7d0!important;border-radius:.4rem;padding:.3rem .55rem;margin-left:-.55rem;font-weight:700}
.tf-item--border{border-bottom:1px solid rgba(193,198,213,.28);padding-bottom:.45rem;margin-bottom:.45rem}
.tf-q{margin-bottom:.2rem!important;line-height:1.38!important}
.deck-slide__body:has(.tf-item){justify-content:flex-start;gap:.15rem}
table{font-size:var(--fs-sm)!important}
table th,table td{padding:.45rem .6rem!important}
.hl{display:inline;padding:.06em .2em;border-radius:.16em;font-weight:700;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.hl-u.shown{background:#fef08a;color:#713f12;box-shadow:0 0 0 2px #fde047}
.hl-c.shown{background:#bbf7d0;color:#14532d;box-shadow:0 0 0 2px #86efac}
.hl-b.shown{background:#bfdbfe;color:#1e3a8a;box-shadow:0 0 0 2px #93c5fd}
.hl-r.shown{background:#fecaca;color:#991b1b;box-shadow:0 0 0 2px #fca5a5}
.word-bank{display:flex;flex-wrap:wrap;gap:.35rem}
.text-muted{color:#414753;font-size:var(--fs-sm)!important}
.text-on-surface-variant{font-size:var(--fs-sm)!important}
.deck-slide__body>.fig-box+.deck-text-sm,.deck-slide__body>.fig-box+p,.deck-slide__body>.fig-box+ul{flex-shrink:0;margin-top:.35rem}
.deck-slide__body>ul,.deck-slide__body>ol{flex:1;display:flex;flex-direction:column;justify-content:center;gap:.35rem}
@media(max-width:900px){.slide-split,.mcq-layout{grid-template-columns:1fr}.fig-grid-2{grid-template-columns:1fr}}
@media print{.deck-hud,.deck-sidebar,.sidebar-fab,.draw-tool-fab,.draw-tool-toolbar,#drawCanvas{display:none!important}}
<\/style>
<link href="../draw-tool.css" rel="stylesheet"/>
<\/head>
<body class="bg-background text-on-background">
<div class="app-shell">
<aside class="deck-sidebar" id="sidebar">
<div class="deck-sidebar__head"><h2>Pages · 頁面</h2><div class="sidebar-head-actions"><span>${CONTENT.length}</span><button type="button" id="btn-sidebar-close" class="sidebar-toggle" title="Hide sidebar (B)">✕</button></div></div>
<nav class="deck-sidebar__nav" id="sidebar-nav">${sidebarHtml}</nav>
</aside>
<div class="deck-main">
<button type="button" id="btn-sidebar-open" class="sidebar-fab" title="Show pages (B)">☰ Pages</button>
<div class="deck" id="deck">${slidesHtml}<\/div>
<div class="deck-hud">
<button type="button" id="btn-hub" hidden>← Slides</button>
<button type="button" id="btn-sidebar-hud" title="Toggle sidebar (B)">☰</button>
<button type="button" id="btn-prev">← Prev</button>
<div class="deck-progress"><div id="progress-bar" style="width:0"><\/div><\/div>
<span id="hud-label">1 / ${CONTENT.length}<\/span>
<button type="button" id="btn-next">Next →</button>
<\/div>
<\/div>
<\/div>
<script>
(function(){
  const shell=document.querySelector(".app-shell");
  const slides=[...document.querySelectorAll(".deck-slide")];
  const sidebarItems=[...document.querySelectorAll(".sidebar-item")];
  let si=0,stepIdx=0;
  const phaseLabels={pic:"Picture 圖片",q:"Question 題目",a:"Answer 答案",e:"Explanation 解釋"};
  function getPhases(sl){const p=(sl.dataset.phases||"").trim();return p?p.split(","):null;}
  function hasPhases(sl){return !!getPhases(sl);}
  function seqSteps(sl){
    const all=[...sl.querySelectorAll(".step:not([data-phase])")];
    const pics=all.filter(el=>el.classList.contains("step-pic"));
    const text=all.filter(el=>el.classList.contains("step-text"));
    const rest=all.filter(el=>!el.classList.contains("step-pic")&&!el.classList.contains("step-text"));
    return[...pics,...text,...rest];
  }
  function fitSlide(){
    slides.forEach(s=>{const inner=s.querySelector(".deck-slide__inner");if(inner)inner.style.zoom="1";});
    const sl=slides[si];const inner=sl?.querySelector(".deck-slide__inner");if(!inner)return;
    requestAnimationFrame(()=>{
      const maxH=sl.clientHeight-2;
      const h=inner.offsetHeight;
      if(h>maxH&&maxH>40) inner.style.zoom=String(Math.max(.58,maxH/h));
      else if(h>0&&h<maxH*0.78) inner.style.zoom=String(Math.min(1.28,maxH/h));
    });
  }
  function toggleSidebar(force){
    const hide=force===undefined?!shell.classList.contains("sidebar-hidden"):!force;
    shell.classList.toggle("sidebar-hidden",hide);
    try{localStorage.setItem("deck-sidebar-hidden",hide?"1":"0");}catch(e){}
    setTimeout(fitSlide,260);
  }
  function updateSidebar(){sidebarItems.forEach((btn,i)=>{btn.classList.toggle("is-active",i===si);if(i===si)btn.scrollIntoView({block:"nearest"});});}
  function refreshSteps(){
    const sl=slides[si];const phases=getPhases(sl);
    if(phases){
      sl.querySelectorAll("[data-phase]").forEach(el=>{
        const p=el.dataset.phase;const show=phases.indexOf(p)<=stepIdx;
        el.classList.toggle("shown",show);
        if(el.classList.contains("hidden-answer"))el.classList.toggle("shown",show&&p==="a");
        if(el.classList.contains("hidden-explain"))el.classList.toggle("shown",show&&p==="e");
      });
      sl.querySelectorAll(".fill-blank").forEach(el=>el.classList.toggle("shown",stepIdx>=phases.indexOf("a")));
      sl.querySelectorAll(".fill-dash").forEach(el=>el.classList.toggle("shown",stepIdx<phases.indexOf("a")));
      const ap=sl.querySelector('.answer-panel[data-phase="a"]');
      if(ap&&phases.indexOf("a")<=stepIdx){const key=ap.dataset.answer;if(key)sl.querySelectorAll(".mcq-opt").forEach(li=>li.classList.toggle("correct-answer",li.dataset.key===key));}
      document.getElementById("hud-label").textContent=(si+1)+" / "+slides.length+" · "+(phaseLabels[phases[stepIdx]]||"Done");
    }else{
      const st=seqSteps(sl);
      st.forEach((el,i)=>{el.classList.toggle("shown",i<=stepIdx);if(el.classList.contains("hl"))el.classList.toggle("shown",i<=stepIdx);});
      document.getElementById("hud-label").textContent=(si+1)+" / "+slides.length+" · step "+(stepIdx+1)+"/"+Math.max(st.length,1);
    }
    let done=0,all=0;
    slides.forEach((s,i)=>{const n=hasPhases(s)?getPhases(s).length:Math.max(seqSteps(s).length,1);all+=n;if(i<si)done+=n;else if(i===si)done+=stepIdx+1;});
    document.getElementById("progress-bar").style.width=(done/all*100)+"%";
    updateSidebar();bindLabControls(slides[si],si);requestAnimationFrame(fitSlide);
  }
  function maxSteps(sl){return hasPhases(sl)?getPhases(sl).length-1:Math.max(seqSteps(sl).length-1,0);}
  function labUrl(base,slideIndex){const sep=base.includes("?")?"&":"?";return base+sep+"from=slides&slide="+slideIndex;}
  function bindLabControls(sl,index){
    sl.querySelectorAll(".slide-lab-open-btn").forEach(btn=>{
      const base=btn.dataset.lab;if(!base)return;
      btn.onclick=()=>window.open(labUrl(base,index),"s3bio-lab","noopener,noreferrer,width=1280,height=800");
    });
    sl.querySelectorAll(".slide-lab-embed__frame").forEach(frame=>{
      frame.onload=()=>{try{frame.contentWindow.postMessage("membrane-resize","*");}catch(e){}};
    });
  }
  function goSlide(n){if(n<0||n>=slides.length)return;slides.forEach((s,i)=>{s.classList.remove("active","leaving");if(i===n)s.classList.add("active");else if(i===si)s.classList.add("leaving");s.setAttribute("aria-hidden",i!==n);});si=n;stepIdx=0;refreshSteps();}
  function next(){if(stepIdx<maxSteps(slides[si])){stepIdx++;refreshSteps();return;}if(si<slides.length-1)goSlide(si+1);}
  function prev(){if(stepIdx>0){stepIdx--;refreshSteps();return;}if(si>0){goSlide(si-1);stepIdx=maxSteps(slides[si]);refreshSteps();}}
  document.getElementById("btn-next").onclick=next;
  document.getElementById("btn-prev").onclick=prev;
  const hubBtn=document.getElementById("btn-hub");
  if(hubBtn&&window.self===window.top){hubBtn.hidden=false;hubBtn.onclick=()=>{window.location.href="../slides.html";};}
  document.getElementById("btn-sidebar-hud").onclick=()=>toggleSidebar();
  document.getElementById("btn-sidebar-close").onclick=()=>toggleSidebar(false);
  document.getElementById("btn-sidebar-open").onclick=()=>toggleSidebar(true);
  sidebarItems.forEach(btn=>btn.addEventListener("click",()=>goSlide(+btn.dataset.goto)));
  try{if(localStorage.getItem("deck-sidebar-hidden")==="1")shell.classList.add("sidebar-hidden");}catch(e){}
  document.addEventListener("keydown",e=>{
    if(e.key===" "||e.key==="ArrowRight"||e.key==="PageDown"){e.preventDefault();next();}
    else if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();prev();}
    else if(e.key==="Home"){e.preventDefault();goSlide(0);}
    else if(e.key==="End"){e.preventDefault();goSlide(slides.length-1);}
    else if(e.key==="b"||e.key==="B"){e.preventDefault();toggleSidebar();}
    else if(e.key==="f"||e.key==="F"){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();}
  });
  window.addEventListener("resize",()=>fitSlide());
  document.getElementById("deck").addEventListener("click",e=>{
    if(e.target.closest("button,.draw-tool-fab,.draw-tool-toolbar,.deck-sidebar,.sidebar-fab"))return;
    if(e.clientX>window.innerWidth*.62)next();else if(e.clientX<window.innerWidth*.38)prev();
  });
  const qSlide=parseInt(new URLSearchParams(location.search).get("slide"),10);
  if(Number.isFinite(qSlide)&&qSlide>=0&&qSlide<slides.length)goSlide(qSlide);
  else goSlide(0);
})();
<\/script>
<script src="../draw-tool.js"><\/script>
<\/body>
<\/html>`;

writeFileSync(new URL("./slides-play.html", import.meta.url), html, "utf8");
console.log("Generated slides-play.html with", CONTENT.length, "slides");
