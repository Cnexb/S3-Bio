export const QUIZ_UI_LANGS = ["en", "zh", "zh-Hant"];

export function isChineseUI(lang) {
  return lang === "zh" || lang === "zh-Hant";
}

export function noQuizAlertMessage(lang) {
  if (lang === "zh") return "请先生成题目。";
  if (lang === "zh-Hant") return "請先產生題目。";
  return "Generate questions first.";
}

export function resolveQuizLang() {
  try {
    const parentLang = window.parent.document.documentElement.lang;
    if (parentLang && QUIZ_UI_LANGS.includes(parentLang)) return parentLang;
    if (parentLang?.startsWith("zh")) return parentLang === "zh-Hant" ? "zh-Hant" : "zh";
  } catch (_) {
    /* cross-origin */
  }
  const local = document.documentElement.lang;
  if (local && QUIZ_UI_LANGS.includes(local)) return local;
  if (local?.startsWith("zh")) return local === "zh-Hant" ? "zh-Hant" : "zh";
  return "en";
}

export const DIFFICULTY_LEVELS = [
  { id: "all", labelEn: "All levels", labelZh: "全部難度" },
  { id: "easy", labelEn: "Easy", labelZh: "易" },
  { id: "medium", labelEn: "Medium", labelZh: "中" },
  { id: "hard", labelEn: "Hard", labelZh: "難" },
];

export const DIFFICULTY_MAP = {
  Foundation: "easy",
  Standard: "easy",
  Advanced: "medium",
  Challenging: "hard",
  Applied: "hard",
};

export function difficultyLevel(q) {
  return DIFFICULTY_MAP[q.difficulty] || "medium";
}

export function createRng(seedStr) {
  let s = 0;
  const str = String(seedStr || "").trim();
  if (str) {
    for (let i = 0; i < str.length; i++) s = (Math.imul(31, s) + str.charCodeAt(i)) | 0;
  } else {
    s = (Date.now() ^ (Math.random() * 0x7fffffff)) | 0;
  }
  if (s === 0) s = 1;
  return {
    random() {
      s = (Math.imul(1664525, s) + 1013904223) | 0;
      return (s >>> 0) / 0x100000000;
    },
  };
}

export function seededShuffle(arr, seedStr) {
  const rng = createRng(seedStr);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isEquationLine(line) {
  const t = String(line || "").trim();
  if (!t) return false;
  if (/^\(\d+\)/.test(t)) return false;
  if (/\?$/.test(t)) return false;
  if (/^(which|what|how|why|the following|directions|refer to)\b/i.test(t)) return false;
  if (/[+]/.test(t) || /→|->/.test(t)) return true;
  const words = t.split(/\s+/).length;
  return t.length <= 36 && words <= 6 && !/[.]$/.test(t);
}

function equationHtml(eqLines) {
  const plus = eqLines.filter((l) => /[+]/.test(l));
  const cond = eqLines.filter((l) => !/[+]/.test(l));
  if (plus.length >= 2) {
    const left = escHtml(plus[0]);
    const right = escHtml(plus.slice(1).join("  +  "));
    return `<div class="quiz-eq">${
      cond.length ? `<div class="quiz-eq-cond">${cond.map(escHtml).join("<br/>")}</div>` : ""
    }<div class="quiz-eq-rxn">${left} <span class="quiz-eq-arrow">→</span> ${right}</div></div>`;
  }
  if (plus.length === 1) {
    return `<div class="quiz-eq">${
      cond.length ? `<div class="quiz-eq-cond">${cond.map(escHtml).join("<br/>")}</div>` : ""
    }<div class="quiz-eq-rxn">${escHtml(plus[0])}</div></div>`;
  }
  return `<div class="quiz-eq">${eqLines.map(escHtml).join("<br/>")}</div>`;
}

/** Word-like stem: keep line breaks, numbered statements, and simple equations. */
export function stemToHtml(stem, items = [], stemTable = null) {
  const lines = String(stem || "").split(/\r?\n/);
  const parts = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) {
      i += 1;
      continue;
    }
    if (/^\(\d+\)/.test(line)) {
      const lis = [];
      while (i < lines.length && /^\(\d+\)/.test(lines[i].trim())) {
        lis.push(lines[i].trim().replace(/^\(\d+\)\s*/, ""));
        i += 1;
      }
      if (lis.some((t) => t)) {
        parts.push(
          `<ol class="quiz-num-list">${lis.map((t) => `<li>${escHtml(t)}</li>`).join("")}</ol>`
        );
      }
      continue;
    }
    if (isEquationLine(line) && i + 1 < lines.length && isEquationLine(lines[i + 1])) {
      const eq = [];
      let j = i;
      while (j < lines.length && isEquationLine(lines[j])) {
        eq.push(lines[j].trim());
        j += 1;
      }
      if (eq.length >= 2 && eq.some((l) => /[+]/.test(l) || /→|->/.test(l))) {
        parts.push(equationHtml(eq));
        i = j;
        continue;
      }
    }
    parts.push(`<p>${escHtml(line)}</p>`);
    i += 1;
  }
  const extra = (items || []).map((it) => String(it).replace(/^\(\d+\)\s*/, "").trim()).filter(Boolean);
  const alreadyListed = parts.some((p) => p.includes("quiz-num-list"));
  if (extra.length && !alreadyListed) {
    parts.push(
      `<ol class="quiz-num-list">${extra.map((t) => `<li>${escHtml(t)}</li>`).join("")}</ol>`
    );
  }
  let inner = parts.join("");
  const tables = Array.isArray(stemTable) ? stemTable : stemTable ? [stemTable] : [];
  const table = tables.map(stemTableHtml).join("");
  if (table) {
    const cut = inner.indexOf("</p>");
    inner = cut >= 0 ? inner.slice(0, cut + 4) + table + inner.slice(cut + 4) : table + inner;
  }
  return `<div class="quiz-stem">${inner}</div>`;
}

export function stemTableHtml(table) {
  if (!table?.rows?.length) return "";
  const body = table.rows
    .map((row, ri) => {
      const cells = (row || [])
        .filter((c) => !c?.continued)
        .map((cell, ci) => {
          const tag = ri === 0 || ci === 0 ? "th" : "td";
          const span = Number(cell.colSpan || 1) > 1 ? ` colspan="${Number(cell.colSpan)}"` : "";
          return `<${tag}${span}>${escHtml(cell.text || "")}</${tag}>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");
  return `<div class="quiz-stem-table-wrap"><table class="quiz-opt-table">${body}</table></div>`;
}

export function optionGridHtml(grid) {
  if (!grid?.rows?.length) return "";
  const headers = grid.headers || [];
  const head =
    headers.length > 0
      ? `<tr><th></th>${headers.map((h) => `<th>${escHtml(h)}</th>`).join("")}</tr>`
      : "";
  const body = grid.rows
    .map(
      (row) =>
        `<tr><th>${escHtml(row.key)}</th>${(row.cells || [])
          .map((c) => `<td>${escHtml(c)}</td>`)
          .join("")}</tr>`
    )
    .join("");
  return `<div class="quiz-opt-table-wrap"><table class="quiz-opt-table">${head}${body}</table></div>`;
}

export function questionFormat(q) {
  return q.format || "mcq";
}

/** Worksheet filters for question format (MCQ / T/F / fill). */
export const QUIZ_FORMAT_FILTERS = [
  { id: "mcq", labelEn: "Multiple choice", labelZh: "選擇題", labelZhHans: "选择题" },
  { id: "tf", labelEn: "True / False", labelZh: "是非題", labelZhHans: "是非题" },
  { id: "fill", labelEn: "Fill in the blanks", labelZh: "填充題", labelZhHans: "填空题" },
];

export function formatFilterLabel(filter, lang) {
  if (lang === "zh") return filter.labelZhHans || filter.labelZh;
  if (lang === "zh-Hant") return filter.labelZh;
  return filter.labelEn;
}

/** Count questions per section, per format, and section×format matrix. */
export function buildQuizBankStats(questions, sectionIds, formatIds) {
  const bySection = {};
  const byFormat = Object.fromEntries(formatIds.map((id) => [id, 0]));
  const matrix = {};
  for (const sid of sectionIds) {
    matrix[sid] = Object.fromEntries(formatIds.map((fid) => [fid, 0]));
  }
  for (const q of questions) {
    const fmt = questionFormat(q);
    if (!sectionIds.includes(q.section) || !formatIds.includes(fmt)) continue;
    bySection[q.section] = (bySection[q.section] || 0) + 1;
    byFormat[fmt] = (byFormat[fmt] || 0) + 1;
    if (matrix[q.section]) matrix[q.section][fmt] = (matrix[q.section][fmt] || 0) + 1;
  }
  return { total: questions.length, bySection, byFormat, matrix };
}

export function filterQuizPool(allQuestions, { sections, formats, difficulty }) {
  let pool = allQuestions.filter(
    (q) => sections.includes(q.section) && formats.includes(questionFormat(q))
  );
  if (difficulty && difficulty !== "all") {
    pool = pool.filter((q) => difficultyLevel(q) === difficulty);
  }
  return pool;
}

export function formatTypeLabel(q) {
  const f = questionFormat(q);
  if (f === "tf") return "T/F";
  if (f === "fill") return "FILL";
  return "MCQ";
}

export function normalizeFillAnswer(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;]/g, "");
}

export function fillAnswerMatches(input, acceptList) {
  const n = normalizeFillAnswer(input);
  if (!n) return false;
  return (acceptList || []).some((a) => normalizeFillAnswer(a) === n);
}

/** @returns {{ segments: Array<{type:'text'|'blank', value?: string, accept?: string[]}> }[]} */
export function getFillLines(q) {
  if (q.lines?.length) return q.lines;
  return (q.fields || []).map((field) => ({
    segments: [
      { type: "text", value: String(field.label || "").replace(/_+/g, "") },
      { type: "blank", accept: field.accept || [] },
    ],
  }));
}

export function countFillBlanks(q) {
  return getFillLines(q).reduce(
    (n, line) => n + line.segments.filter((s) => s.type === "blank").length,
    0
  );
}

export function fillLineAnswerText(line) {
  return line.segments
    .map((seg) => {
      if (seg.type === "text") return seg.value || "";
      return seg.accept?.[0] || "___";
    })
    .join("");
}

export function allFillFieldsCorrect(q, values) {
  const lines = getFillLines(q);
  if (!lines.length) return false;
  let i = 0;
  for (const line of lines) {
    for (const seg of line.segments) {
      if (seg.type !== "blank") continue;
      if (!fillAnswerMatches(values[i], seg.accept)) return false;
      i += 1;
    }
  }
  return i === values.length && i > 0;
}

export function modelAnswerText(q) {
  const f = questionFormat(q);
  if (f === "tf") {
    const opt = q.options?.find((o) => o.key === q.answer);
    const word = opt?.text || (q.answer === "T" ? "True" : "False");
    const wordZh = opt?.textZh || (q.answer === "T" ? "正確" : "錯誤");
    return { en: `${word}.`, zh: `${wordZh}。` };
  }
  if (f === "fill") {
    const lines = getFillLines(q);
    if (lines.length) {
      return { en: lines.map((line) => fillLineAnswerText(line)).join(" | "), zh: "" };
    }
  }
  const opt = q.options?.find((o) => o.key === q.answer);
  const en = opt ? `${q.answer}. ${opt.text}` : q.answer;
  const zh = opt?.textZh ? `${q.answer}. ${opt.textZh}` : "";
  return { en, zh };
}
