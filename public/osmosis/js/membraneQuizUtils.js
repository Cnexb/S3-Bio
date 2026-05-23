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
  Standard: "medium",
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

export function modelAnswerText(q) {
  const opt = q.options.find((o) => o.key === q.answer);
  const en = opt ? `${q.answer}. ${opt.text}` : q.answer;
  const zh = opt?.textZh ? `${q.answer}. ${opt.textZh}` : "";
  return { en, zh };
}
