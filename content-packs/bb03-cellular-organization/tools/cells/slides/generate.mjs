/**
 * Generates slides-play.html — full Ch 2 cellular organizations class deck
 * Run: node generate.mjs
 */
import { writeFileSync } from "fs";
import { CELLS_QUIZ, QUIZ_SECTIONS } from "../js/cellsQuizData.js";
import { buildNotesSlides } from "./content.mjs";

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

function layoutPicHero(figHtml, textHtml = "") {
  return layoutFigTop(figHtml, textHtml, "pic-only");
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

function drawSpace(label = "Drawing space 落筆區", hint = "") {
  const hintHtml = hint ? `<p class="draw-space__hint deck-meta">${hint}</p>` : "";
  return `<div class="draw-space"><p class="draw-space__label step step-text">${label}</p>${hintHtml}<div class="draw-space__box" aria-label="Drawing area"></div></div>`;
}

function drawSpacePair(leftLabel, rightLabel, hint = "") {
  const hintHtml = hint ? `<p class="draw-space__hint deck-meta step step-text">${hint}</p>` : "";
  return `<div class="draw-space-pair"><div class="draw-space-grid">${drawSpace(leftLabel)}${drawSpace(rightLabel)}</div>${hintHtml}</div>`;
}

function layoutCompareWithRefs(refHtml, tableHtml) {
  return `<div class="layout-compare-ref"><div class="layout-compare-ref__refs step step-pic">${refHtml}</div><div class="layout-compare-ref__main step step-text">${tableHtml}</div></div>`;
}

/** Large refs on top, table below — for prok/euk comparison split across slides */
function layoutCompareSplit(refHtml, tableHtml) {
  return `<div class="layout-compare-split"><div class="layout-compare-split__refs step step-pic">${refHtml}</div><div class="layout-compare-split__table step step-text">${tableHtml}</div></div>`;
}

/** Side column: stacked reference pics (full height each) + main content */
function layoutSideRefs(refHtml, mainHtml) {
  return `<div class="layout-side-refs"><div class="layout-side-refs__pics step step-pic">${refHtml}</div><div class="layout-side-refs__main step step-text">${mainHtml}</div></div>`;
}

/** Two columns: reference figure on top, drawing box below (animal | plant) */
function layoutDrawTogether(animalFigHtml, plantFigHtml, footHintHtml) {
  return `<div class="draw-together-wrap">
    <div class="draw-together-grid">
      <div class="draw-together-col step step-pic">${animalFigHtml}${drawSpace("Animal cell 動物細胞")}</div>
      <div class="draw-together-col step step-pic">${plantFigHtml}${drawSpace("Plant cell 植物細胞")}</div>
    </div>
    <p class="draw-together-foot deck-meta step step-text">${footHintHtml}</p>
  </div>`;
}

const LAB_ENDOSYMBIOTIC = "../../osmosis/endosymbiotic-animation.html";

function labEmbed(src, title) {
  const q = src.includes("?") ? "&" : "?";
  return `<div class="slide-lab-embed"><iframe class="slide-lab-embed__frame" src="${src}${q}embed=1" title="${esc(title)}" loading="lazy" allow="fullscreen"></iframe></div>`;
}

function labFootnote(html, labSrc) {
  return `<div class="slide-lab-foot">${html}<button type="button" class="slide-lab-open-btn" data-lab="${labSrc}">Open full window ↗</button></div>`;
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
  const hasImg = !!q.image && !String(q.image.src || "").includes("imageXX");
  const imgCls = q.image?.src.includes("graph") ? "fig-graph fig-hero" : "fig-hero";
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

function fillBatchSlide(questions, batchLabel, sectionLabel, startNum) {
  const endNum = startNum + questions.length - 1;
  const bank = questions[0]?.wordBank?.length
    ? `<div class="word-bank step mb-3" data-phase="q">${questions[0].wordBank.map((w) => `<span class="bio-tag">${esc(w)}</span>`).join(" ")}</div>`
    : "";
  const blank = (ans) =>
    `<span class="fill-blank hidden-answer" data-phase="a">${esc(ans)}</span><span class="fill-dash" data-phase="q">________</span>`;
  const items = questions
    .map((q, i) => {
      const n = startNum + i;
      const line = esc(q.stem).replace(/_+/g, blank(q.answer));
      return `<p class="text-body-sm mb-2 step deck-text fill-item" data-phase="q"><strong class="text-primary">${n}.</strong> ${line}</p>`;
    })
    .join("");
  return slide(
    `${sectionLabel} · Fill ${startNum}–${endNum}`,
    `<p class="font-label-bold text-primary mb-2 step step-text" data-phase="q">Fill in the blanks ${batchLabel} — word bank below (words may be reused)</p>${bank}${items}
     <div class="answer-reveal step hidden-answer" data-phase="a"><div class="answer-badge">Answers revealed above ↑</div></div>`,
    { phases: "q,a,e" }
  );
}

function fillSlide(q, sectionLabel) {
  const bank = q.wordBank?.length
    ? `<div class="word-bank step" data-phase="q">${q.wordBank.map((w) => `<span class="bio-tag">${esc(w)}</span>`).join(" ")}</div>`
    : "";
  const blank = (ans) =>
    `<span class="fill-blank hidden-answer" data-phase="a">${esc(ans)}</span><span class="fill-dash" data-phase="q">________</span>`;
  const lines = q.lines?.length
    ? q.lines
        .map((line, i) => {
          const parts = line.segments
            .map((seg) => {
              if (seg.type === "text") return esc(seg.value);
              const ans = seg.accept.join(" / ");
              return blank(ans);
            })
            .join("");
          return `<p class="text-body-sm mb-2 step" data-phase="q">${i + 1}. ${parts}</p>`;
        })
        .join("")
    : `<p class="text-body-sm mb-2 step deck-text" data-phase="q">${esc(q.stem).replace(/_+/g, blank(q.answer))}</p>`;
  return slide(
    `${sectionLabel} · Fill in the Blanks`,
    `${bank}${lines}
     <div class="answer-reveal step hidden-answer" data-phase="a"><div class="answer-badge">Answer revealed above ↑</div></div>
     <div class="explain-panel step hidden-explain" data-phase="e"><div class="def-box pl-5 py-3 bg-secondary/10 rounded-r-xl deck-text"><strong class="text-secondary">Explanation · 解釋</strong><p class="mt-2 text-on-surface-variant">${esc(q.hint)}</p></div></div>`,
    { phases: "q,a,e" }
  );
}

const CONTENT = buildNotesSlides({
  slide,
  hl,
  fig,
  layoutSplit,
  layoutFigTop,
  layoutPicHero,
  figGrid2,
  tableWrap,
  drawSpace,
  drawSpacePair,
  layoutCompareWithRefs,
  layoutCompareSplit,
  layoutSideRefs,
  layoutDrawTogether,
  labEmbed,
  labFootnote,
  LAB_ENDOSYMBIOTIC,
});

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

  const items = CELLS_QUIZ.filter((q) => q.section === sec.id);
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

  for (let i = 0; i < fillItems.length; i += 5) {
    const batch = fillItems.slice(i, i + 5);
    CONTENT.push(fillBatchSlide(batch, `Set ${Math.floor(i / 5) + 1}`, sec.label, i + 1));
  }
}

CONTENT.push(
  slide(
    "完 · End",
    `<div class="text-center py-12"><h2 class="font-headline-xl mb-4">Ch 2 Cellular Organizations</h2><p class="text-on-surface-variant step">Michael Y's Summer Biology Course</p><p class="text-body-sm mt-6 opacity-70 step">Review with S3 Bio flashcards &amp; quiz</p></div>`,
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
<title>Ch 2 Cellular Organizations — Class Slides</title>
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
.layout-fig-top{display:flex;flex-direction:column;height:100%;gap:.45rem;min-height:0;overflow:hidden}
.layout-fig-top__media{flex:1.85;min-height:0;max-height:72%;display:flex;flex-direction:column;overflow:hidden}
.layout-fig-top__media .fig-grid-2{flex:1;height:100%;min-height:0}
.layout-fig-top__media .fig-grid-2 .fig-box img{max-height:100%!important;height:100%;min-height:0}
.layout-fig-top__media>.fig-box{flex:1;height:100%;display:flex;flex-direction:column;min-height:0}
.layout-fig-top__media>.fig-box img{max-height:100%!important;height:100%;min-height:0}
.layout-fig-top__text{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-start;gap:.3rem;overflow-y:auto;overflow-x:hidden}
.layout-fig-top--pic-only .layout-fig-top__media{flex:1;max-height:88%;min-height:58%}
.layout-fig-top--pic-only .layout-fig-top__text{flex:0 0 auto;max-height:30%;overflow-y:auto}
.layout-fig-top--dense .layout-fig-top__media{flex:0 0 54%;max-height:54%}
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
.fig-box.fig-hero img,.deck-slide__body>.fig-box.fig-hero img{max-height:calc(var(--content-h) - .35rem)!important;min-height:52vh}
.slide-split__pic .fig-box.fig-hero img,.mcq-layout .fig-box.fig-hero img{max-height:calc(var(--content-h) - .5rem)!important;min-height:0}
.fig-grid-2 .fig-box.fig-hero img{max-height:calc(var(--content-h) - .75rem)!important;min-height:42vh}
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
.deck-slide__body:has(.fill-item){justify-content:flex-start;gap:.1rem}
.org-table{font-size:clamp(.82rem,1.2vw,.95rem)!important}
.org-table--compact{font-size:clamp(.78rem,1.05vw,.88rem)!important}
.org-table--compact th,.org-table--compact td{padding:.35rem .45rem!important;line-height:1.25}
.org-table th,.org-table td{vertical-align:top;line-height:1.3}
.org-table th.text-center,.org-table td.text-center{text-align:center}
.draw-space{display:flex;flex-direction:column;min-height:0;flex:1;gap:.3rem;height:100%}
.draw-space__label{font-size:var(--fs-sm)!important;font-weight:700;color:#004e9f;margin:0;line-height:1.25}
.draw-space__hint{margin:0;line-height:1.3}
.draw-space__box{flex:1;min-height:10rem;border:2.5px dashed rgba(0,78,159,.5);border-radius:1rem;background:rgba(255,255,255,.62);box-shadow:inset 0 0 0 1px rgba(255,255,255,.7)}
.draw-space-grid{display:grid;grid-template-columns:1fr 1fr;gap:.85rem;flex:1;min-height:0;height:100%}
.draw-space-pair{display:flex;flex-direction:column;height:100%;gap:.35rem;min-height:0}
.layout-draw-focus{display:flex;flex-direction:column;height:100%;gap:.45rem;min-height:0}
.layout-draw-focus__intro{flex:0 0 auto}
.layout-draw-focus__box{flex:1;min-height:0;display:flex}
.layout-draw-focus__box .draw-space{width:100%}
.layout-compare-ref{display:grid;grid-template-columns:minmax(0,34%) minmax(0,66%);gap:.65rem;flex:1;min-height:0;height:100%;align-items:stretch}
.layout-compare-ref__refs{display:flex;flex-direction:column;gap:.45rem;min-height:0;height:100%}
.layout-compare-ref__refs .fig-box{flex:1;min-height:0;margin:0;display:flex;flex-direction:column}
.layout-compare-ref__refs .fig-box img{max-height:100%!important;height:100%;min-height:0!important;object-fit:contain}
.layout-compare-ref__main{min-height:0;display:flex;flex-direction:column;overflow:hidden}
.layout-compare-ref__main .rounded-3xl{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden}
.layout-compare-split{display:flex;flex-direction:column;height:100%;gap:.45rem;min-height:0}
.layout-compare-split__refs{flex:0 0 46%;min-height:0;display:flex;flex-direction:column}
.layout-compare-split__refs .fig-grid-2{flex:1;height:100%;min-height:0}
.layout-compare-split__refs .fig-box img{min-height:34vh!important;max-height:100%!important;height:100%;object-fit:contain}
.layout-compare-split__table{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.layout-compare-split__table .rounded-3xl{flex:1;min-height:0;overflow:visible}
.layout-side-refs{display:grid;grid-template-columns:minmax(0,42%) minmax(0,58%);gap:.5rem;flex:1;min-height:0;height:100%;align-items:stretch}
.layout-side-refs__pics{display:flex;flex-direction:column;gap:.3rem;min-height:0;height:100%}
.layout-side-refs__pics .fig-box{flex:1;min-height:0;margin:0;display:flex;flex-direction:column;padding:.25rem .4rem}
.layout-side-refs__pics .fig-box img{width:100%;flex:1;min-height:0;max-height:100%!important;height:auto!important;object-fit:contain;object-position:center}
.layout-side-refs__pics .fig-caption{font-size:clamp(.72rem,1vw,.82rem)!important;margin-top:.15rem;flex-shrink:0}
.layout-side-refs__main{min-height:0;display:flex;flex-direction:column;justify-content:flex-start;overflow:hidden;height:100%}
.layout-side-refs__main .rounded-3xl{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden}
.draw-together-wrap{display:flex;flex-direction:column;flex:1;min-height:0;height:100%;gap:.28rem}
.draw-together-grid{display:grid;grid-template-columns:1fr 1fr;gap:.55rem;flex:1;min-height:0}
.draw-together-col{display:flex;flex-direction:column;gap:.22rem;min-height:0;height:100%}
.draw-together-col .fig-box{flex:1.2;min-height:0;margin:0;display:flex;flex-direction:column;padding:.25rem .4rem}
.draw-together-col .fig-box img{flex:1;min-height:0;width:100%;max-height:100%!important;object-fit:contain}
.draw-together-col .fig-caption{flex-shrink:0;font-size:clamp(.72rem,1vw,.82rem)!important;margin-top:.15rem}
.draw-together-col .draw-space{flex:1;min-height:7.5rem;display:flex;flex-direction:column;gap:.2rem}
.draw-together-col .draw-space__label{margin:0;font-size:var(--fs-sm)!important}
.draw-together-col .draw-space__box{flex:1;min-height:0}
.draw-together-foot{flex-shrink:0;margin:0;line-height:1.28;padding-top:.1rem}
.deck-slide__body>.layout-side-refs,.deck-slide__body>.draw-together-wrap{flex:1;min-height:0;height:100%}
.draw-together-page{display:flex;flex-direction:column;height:100%;gap:.4rem;min-height:0}
.draw-together-page__refs{flex:0 0 50%;min-height:0}
.draw-together-page__refs .fig-grid-2{height:100%;min-height:0}
.draw-together-page__refs .fig-box img{min-height:38vh!important;max-height:100%!important;height:100%;object-fit:contain}
.draw-together-page .draw-space-pair{flex:1;min-height:0}
.fig-ref img{object-fit:contain}
.fig-ref-lg img{object-fit:contain}
@media(max-width:900px){.layout-compare-ref,.draw-space-grid,.layout-side-refs{grid-template-columns:1fr}.layout-compare-split__refs{flex:0 0 40%}.layout-side-refs__pics{flex-direction:row;max-height:38vh}}
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
<link href="../../osmosis/draw-tool.css" rel="stylesheet"/>
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
  function labUrl(base,slideIndex){const sep=base.includes("?")?"&":"?";return base+sep+"from=slides&deck=cells&slide="+slideIndex;}
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
  if(hubBtn&&window.self===window.top){hubBtn.hidden=false;hubBtn.onclick=()=>{window.location.href="../../osmosis/slides.html";};}
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
<script src="../../osmosis/draw-tool.js"><\/script>
<\/body>
<\/html>`;

writeFileSync(new URL("./slides-play.html", import.meta.url), html, "utf8");
console.log("Generated slides-play.html with", CONTENT.length, "slides");
