import { getInClassChapter, getInClassQuestions } from "./inClassTestData.js?v=ict20260716b";
import { renderSessionSummary } from "./membraneQuizSummary.js";
import { downloadWord, printSheet } from "./membraneQuizExport.js";
import {
  escHtml,
  modelAnswerText,
  resolveQuizLang,
  isChineseUI,
  formatTypeLabel,
  questionFormat,
} from "./membraneQuizUtils.js";
import {
  animateSplitText,
  bindMagnets,
  bindTrueFocus,
  revealQuestionBlocks,
  initSettingsToggle,
  bindQuizOptionKeys,
  setActiveQuizQuestionId,
} from "./membraneQuizEffects.js";

const UI = {
  en: {
    hExport: "Export",
    txtExportHint: "Word: .doc for Microsoft Word. Use Print → Save as PDF for a PDF copy.",
    btnDocQ: "Word — Questions",
    btnDocA: "Word — Answers",
    btnPrint: "Print / Save as PDF",
    hPractice: "In-class test",
    txtPracticeHint: "Fixed order · {n} MCQ · First wrong: hint. Second wrong: model answer.",
    txtKeyboardHint:
      "Press A, B, C, or D to select an answer. Hover a question and press Enter (Windows) or Return (macOS) to check that question only.",
    btnSummary: "Session summary",
    quizCheck: "Check answer",
    alertNoQuiz: "No questions loaded.",
    progressNone: "Not started",
    progressCompletedPrefix: "Completed ",
    correct: "Correct.",
    hintPrefix: "Hint:",
    modelPrefix: "Model answer:",
    printConfirm: "Print ANSWER sheet? (Cancel = questions only)",
    hideSettings: "Hide export",
    showSettings: "Show export",
    fixedInfo: "This test uses a fixed set of {n} MCQ in chapter order — no random generation.",
    summaryTitle: "Summary",
    summaryScoreLabel: "Score (correct / total)",
    summaryFirstTry: "Correct on first attempt",
    summaryWrongTitle: "Wrong twice — review these",
    summaryNoneWrong: "None — no questions failed after two attempts.",
    summaryIncomplete: "Still in progress",
    summaryByTypeTitle: "Correct rate",
    summaryByTypeColType: "Section",
    summaryByTypeColFraction: "Correct / total",
    summaryByTypeColRate: "Rate",
    summaryByTypeColFirst: "First-try / total",
    revTitle: "Comments & revision suggestions",
    revBandExcellent: "Overall accuracy is very high. Review any missed items before the next test.",
    revBandGood: "Good result. Re-read notes for any questions missed twice.",
    revBandFair: "Mixed performance — revisit weaker topics in your chapter notes.",
    revBandLow: "Several concepts need consolidation. Review the chapter before retaking.",
    revWeakOne: "Prioritise revision on {type} — you scored {c}/{t} ({pct}%).",
    revStrongOne: "Strength: every {type} item correct ({n} questions).",
    revTwoStrike: "Questions missed twice: study the model answers, then retry.",
    revIncomplete: "Finish questions still in progress for a fair measure.",
    revFirstTryLow: "Many items needed two attempts. Read each stem carefully before answering.",
    revBalanced: "Errors spread across topics — continue balanced revision.",
  },
  zh: {
    hExport: "导出",
    txtExportHint: "Word：下载 .doc 以 Word 打开。PDF 请用「打印」→「另存 PDF」。",
    btnDocQ: "Word — 试题",
    btnDocA: "Word — 答案",
    btnPrint: "打印／另存 PDF",
    hPractice: "课堂测验",
    txtPracticeHint: "固定顺序 · {n} 道选择题 · 第一次答错只显示提示；第二次答错显示参考答案。",
    txtKeyboardHint: "可按键盘 A、B、C、D 作答。鼠标悬停在某题上时，按 Enter（Windows）或 Return（macOS）仅检查该题。",
    btnSummary: "学习摘要",
    quizCheck: "检查答案",
    alertNoQuiz: "未加载题目。",
    progressNone: "尚未开始",
    progressCompletedPrefix: "已完成 ",
    correct: "正确。",
    hintPrefix: "提示：",
    modelPrefix: "参考答案：",
    printConfirm: "要打印「答案版」吗？（取消 = 试题版）",
    hideSettings: "隐藏导出",
    showSettings: "显示导出",
    fixedInfo: "本测验为固定 {n} 道选择题，按章节顺序出题，不会随机抽题。",
    summaryTitle: "摘要",
    summaryScoreLabel: "得分（答对／总题数）",
    summaryFirstTry: "首次即答对",
    summaryWrongTitle: "两次皆错 — 需重温",
    summaryNoneWrong: "没有此类题目。",
    summaryIncomplete: "尚未答对",
    summaryByTypeTitle: "答对率",
    summaryByTypeColType: "部分",
    summaryByTypeColFraction: "答对／总题数",
    summaryByTypeColRate: "答对率",
    summaryByTypeColFirst: "首次即对／总题数",
    revTitle: "评语与温习建议",
    revBandExcellent: "整体答对率很高。可在下次测验前重温错题。",
    revBandGood: "整体表现不错。请重温两次答错的题目。",
    revBandFair: "表现参差：请重温相关笔记。",
    revBandLow: "多个概念仍需巩固。请先温习该章笔记。",
    revWeakOne: "建议优先温习「{type}」：本次 {c}/{t}（{pct}%）。",
    revStrongOne: "强项：「{type}」本次全对（共 {n} 题）。",
    revTwoStrike: "曾两次答错的题目：请细读参考答案后再练。",
    revIncomplete: "尚有未答对题目，建议先完成。",
    revFirstTryLow: "不少题目需第二次才答对。作答前宜放慢阅读题干。",
    revBalanced: "错误分散在不同部分，宜均衡温习。",
  },
  "zh-Hant": {
    hExport: "匯出",
    txtExportHint: "Word：下載 .doc 以 Word 開啟。PDF 請用「列印」→「另存 PDF」。",
    btnDocQ: "Word — 試題",
    btnDocA: "Word — 答案",
    btnPrint: "列印／另存 PDF",
    hPractice: "課堂測驗",
    txtPracticeHint: "固定順序 · {n} 道選擇題 · 第一次答錯只顯示提示；第二次答錯顯示參考答案。",
    txtKeyboardHint: "可按鍵盤 A、B、C、D 作答。滑鼠懸停在某題上時，按 Enter（Windows）或 Return（macOS）僅檢查該題。",
    btnSummary: "學習摘要",
    quizCheck: "檢查答案",
    alertNoQuiz: "未載入題目。",
    progressNone: "尚未開始",
    progressCompletedPrefix: "已完成 ",
    correct: "正確。",
    hintPrefix: "提示：",
    modelPrefix: "參考答案：",
    printConfirm: "要列印「答案版」嗎？（取消 = 試題版）",
    hideSettings: "隱藏匯出",
    showSettings: "顯示匯出",
    fixedInfo: "本測驗為固定 {n} 道選擇題，按章節順序出題，不會隨機抽題。",
    summaryTitle: "摘要",
    summaryScoreLabel: "得分（答對／總題數）",
    summaryFirstTry: "首次即答對",
    summaryWrongTitle: "兩次皆錯 — 需重溫",
    summaryNoneWrong: "沒有此類題目。",
    summaryIncomplete: "尚未答對",
    summaryByTypeTitle: "答對率",
    summaryByTypeColType: "部分",
    summaryByTypeColFraction: "答對／總題數",
    summaryByTypeColRate: "答對率",
    summaryByTypeColFirst: "首次即對／總題數",
    revTitle: "評語與溫習建議",
    revBandExcellent: "整體答對率很高。可在下次測驗前重溫錯題。",
    revBandGood: "整體表現不錯。請重溫兩次答錯的題目。",
    revBandFair: "表現參差：請重溫相關筆記。",
    revBandLow: "多個概念仍需鞏固。請先溫習該章筆記。",
    revWeakOne: "建議優先溫習「{type}」：本次 {c}/{t}（{pct}%）。",
    revStrongOne: "強項：「{type}」本次全對（共 {n} 題）。",
    revTwoStrike: "曾兩次答錯的題目：請細讀參考答案後再練。",
    revIncomplete: "尚有未答對題目，建議先完成。",
    revFirstTryLow: "不少題目需第二次才答對。作答前宜放慢閱讀題幹。",
    revBalanced: "錯誤分散在不同部分，宜均衡溫習。",
  },
};

function resolveChapterId() {
  const script = document.querySelector('script[data-chapter][src*="inClassTestApp"]');
  if (script?.dataset.chapter) return script.dataset.chapter;

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("chapter");
  if (fromQuery) return fromQuery;

  const match = window.location.pathname.match(/in-class-test-(ch\d+)\.html$/i);
  if (match) return match[1].toLowerCase();

  return "";
}

export function initInClassTest() {
  const chapterId = resolveChapterId();
  const chapter = getInClassChapter(chapterId);
  if (!chapter) {
    const params = new URLSearchParams(window.location.search);
    const standalone = params.get("standalone") === "1" ? "?standalone=1" : "";
    window.location.replace(`./in-class-test-hub.html${standalone}`);
    return;
  }

  let lang = resolveQuizLang();
  let lastQuestions = getInClassQuestions(chapterId);
  const attemptMap = new Map();

  const t = (key) => {
    const raw = UI[lang]?.[key] || UI.en[key] || key;
    return String(raw).replaceAll("{n}", String(lastQuestions.length));
  };

  const els = {
    quizArea: document.getElementById("quiz-area"),
    summaryPanel: document.getElementById("summary-panel"),
    progressText: document.getElementById("quiz-progress-text"),
    progressBar: document.getElementById("quiz-progress-bar"),
    quizContainer: document.getElementById("quiz-container"),
    chapterLabel: document.getElementById("quiz-chapter-label"),
    chapterTitle: document.getElementById("quiz-chapter-title"),
  };

  if (!els.quizArea) return;

  function applyChapterMeta() {
    const title = isChineseUI(lang) ? chapter.titleZh : chapter.title;
    document.title = `Ch ${chapter.number} ${title} — In Class Test`;
    if (els.chapterLabel) {
      els.chapterLabel.textContent = `CH ${chapter.number} · IN CLASS TEST`;
    }
    if (els.chapterTitle) {
      els.chapterTitle.textContent = title;
    }
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (UI[lang]?.[key] || UI.en[key]) node.textContent = t(key);
    });
    const toggleLabel = document.getElementById("settings-toggle-label");
    if (toggleLabel) {
      toggleLabel.dataset.labelHide = t("hideSettings");
      toggleLabel.dataset.labelShow = t("showSettings");
      const layout = document.getElementById("quiz-layout");
      const open = layout && !layout.classList.contains("settings-collapsed");
      toggleLabel.textContent = open ? t("hideSettings") : t("showSettings");
    }
    applyChapterMeta();
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
      pageTitle.textContent = t("hPractice");
      animateSplitText(pageTitle);
    }
    if (lastQuestions.length) renderQuiz();
    if (els.summaryPanel && !els.summaryPanel.hidden && lastQuestions.length) {
      renderSessionSummary({ questions: lastQuestions, attemptMap, panel: els.summaryPanel, t, lang });
    }
  }

  function applyEffectsAfterRender() {
    bindMagnets(els.quizArea);
    revealQuestionBlocks(els.quizArea);
    els.quizArea.querySelectorAll(".split-text-target").forEach((node) => animateSplitText(node));
  }

  function initAttempts() {
    attemptMap.clear();
    lastQuestions.forEach((q) => {
      attemptMap.set(q.id, { wrong: 0, solved: false, selected: null });
    });
  }

  function updateProgress() {
    if (!lastQuestions.length) {
      if (els.progressText) els.progressText.textContent = t("progressNone");
      if (els.progressBar) els.progressBar.style.width = "0%";
      return;
    }
    let done = 0;
    lastQuestions.forEach((q) => {
      if (attemptMap.get(q.id)?.solved) done += 1;
    });
    if (els.progressText) {
      els.progressText.textContent = t("progressCompletedPrefix") + done + " / " + lastQuestions.length;
    }
    if (els.progressBar) {
      els.progressBar.style.width = `${(done / lastQuestions.length) * 100}%`;
    }
  }

  function renderQuiz() {
    const el = els.quizArea;
    el.className = "space-y-5";
    el.innerHTML = "";
    setActiveQuizQuestionId(null);

    lastQuestions.forEach((q, idx) => {
      const st = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
      const wrap = document.createElement("article");
      wrap.className =
        "q-block p-5 md:p-6 rounded-2xl bg-surface border border-outline-variant/25 shadow-sm";
      wrap.id = "q-block-" + q.id;
      wrap.addEventListener("mouseenter", () => {
        setActiveQuizQuestionId(q.id);
      });
      wrap.addEventListener("mouseleave", (e) => {
        if (!e.relatedTarget || !wrap.contains(e.relatedTarget)) setActiveQuizQuestionId(null);
      });
      wrap.addEventListener("focusin", () => {
        setActiveQuizQuestionId(q.id);
      });

      const head = document.createElement("div");
      head.className = "text-[11px] font-label-bold uppercase tracking-wide text-on-surface-variant mb-3";
      head.textContent = `Q${idx + 1} · ${formatTypeLabel(q).toUpperCase()}`;
      wrap.appendChild(head);

      if (q.image?.src) {
        const fig = document.createElement("figure");
        fig.className = "quiz-fig mb-4";
        fig.innerHTML = `<img src="${escHtml(q.image.src)}" alt="${escHtml(q.image.alt || "")}" loading="lazy" />
          <figcaption class="text-body-sm text-on-surface-variant mt-2">${escHtml(q.image.caption || "")}</figcaption>`;
        wrap.appendChild(fig);
      }

      const stem = document.createElement("p");
      stem.className =
        "split-text-target font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-4 leading-tight";
      stem.textContent = q.stem;
      wrap.appendChild(stem);

      const optionButtons = [];
      const og = document.createElement("div");
      og.className = "grid grid-cols-1 gap-3 mb-4";

      q.options.forEach((opt) => {
        const magnet = document.createElement("div");
        magnet.className = "magnet-link group";
        const btnOpt = document.createElement("button");
        btnOpt.type = "button";
        btnOpt.className =
          "quiz-option w-full text-left p-4 md:p-5 rounded-2xl border-2 border-outline-variant/20 bg-surface hover:border-primary hover:bg-primary-fixed transition-all flex items-center gap-4 relative disabled:opacity-60";
        btnOpt.dataset.key = opt.key;
        btnOpt.disabled = st.solved;

        const badge = document.createElement("span");
        badge.className =
          "w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-surface-container-high font-label-bold group-hover:bg-primary group-hover:text-on-primary transition-colors";
        badge.textContent = opt.key;

        const text = document.createElement("span");
        text.className = "font-body-md text-on-surface flex-1 text-left";
        text.textContent = opt.text;

        btnOpt.appendChild(badge);
        btnOpt.appendChild(text);
        magnet.appendChild(btnOpt);
        og.appendChild(magnet);
        optionButtons.push(btnOpt);

        if (!st.solved) {
          btnOpt.addEventListener("click", () => {
            optionButtons.forEach((b) => {
              b.classList.remove("border-primary", "bg-primary-fixed/30", "shadow-sm", "border-tertiary", "bg-tertiary/10");
              b.classList.add("border-outline-variant/20", "bg-surface");
              b.querySelector("span:first-child")?.classList.remove("bg-primary", "text-on-primary", "bg-tertiary");
              b.querySelector("span:first-child")?.classList.add("bg-surface-container-high");
            });
            btnOpt.classList.add("border-primary", "bg-primary-fixed/30", "shadow-sm");
            btnOpt.classList.remove("border-outline-variant/20", "bg-surface");
            badge.classList.add("bg-primary", "text-on-primary");
            badge.classList.remove("bg-surface-container-high");
            const state = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
            state.selected = opt.key;
            attemptMap.set(q.id, state);
          });
        } else if (opt.key === q.answer) {
          btnOpt.classList.add("border-secondary", "bg-secondary/10");
          badge.classList.add("bg-secondary", "text-on-secondary");
        }
      });
      wrap.appendChild(og);

      if (st.selected && !st.solved) {
        const sel = optionButtons.find((b) => b.dataset.key === st.selected);
        if (sel) {
          sel.classList.add("border-primary", "bg-primary-fixed/30", "shadow-sm");
          sel.querySelector("span:first-child")?.classList.add("bg-primary", "text-on-primary");
        }
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "quiz-check-btn px-8 py-3 rounded-full bg-primary text-on-primary font-label-bold text-body-sm hover:opacity-90 transition-opacity disabled:opacity-50";
      btn.textContent = t("quizCheck");
      btn.disabled = st.solved;

      const fb = document.createElement("div");
      fb.className = "mt-3 text-body-sm hidden";
      fb.setAttribute("role", "status");

      const showModelAnswer = () => {
        const ma = modelAnswerText(q);
        fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/25";
        fb.innerHTML = `<strong>${escHtml(t("modelPrefix"))}</strong> ${escHtml(ma.en)}`;
      };

      btn.addEventListener("click", () => {
        const state = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
        if (state.solved || !state.selected) return;
        const ok = state.selected === q.answer;
        fb.classList.remove("hidden");

        if (ok) {
          state.solved = true;
          attemptMap.set(q.id, state);
          fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-secondary/10 text-secondary font-label-bold";
          fb.textContent = t("correct");
          btn.disabled = true;
          optionButtons.forEach((b) => {
            b.disabled = true;
            if (b.dataset.key === q.answer) b.classList.add("border-secondary", "bg-secondary/10");
          });
          updateProgress();
          return;
        }

        state.wrong += 1;
        attemptMap.set(q.id, state);
        optionButtons.find((b) => b.dataset.key === state.selected)?.classList.add("border-tertiary", "bg-tertiary/10");

        if (state.wrong === 1) {
          fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-primary-fixed/50 text-on-surface border border-primary/20";
          fb.innerHTML = `<strong>${escHtml(t("hintPrefix"))}</strong> ${escHtml(q.hint || "")}`;
        } else {
          state.solved = true;
          attemptMap.set(q.id, state);
          showModelAnswer();
          btn.disabled = true;
          optionButtons.forEach((b) => {
            b.disabled = true;
            if (b.dataset.key === q.answer) b.classList.add("border-tertiary", "bg-tertiary/10");
          });
          updateProgress();
        }
      });

      wrap.appendChild(btn);
      wrap.appendChild(fb);

      if (st.solved && st.wrong > 0 && st.wrong < 2) {
        fb.classList.remove("hidden");
        fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-primary-fixed/50 text-on-surface border border-primary/20";
        fb.innerHTML = `<strong>${escHtml(t("hintPrefix"))}</strong> ${escHtml(q.hint || "")}`;
      }
      if (st.solved && st.wrong >= 2) {
        fb.classList.remove("hidden");
        showModelAnswer();
        btn.disabled = true;
      }

      el.appendChild(wrap);
    });

    applyEffectsAfterRender();
  }

  document.getElementById("btn-summary")?.addEventListener("click", () => {
    if (!els.summaryPanel) return;
    renderSessionSummary({ questions: lastQuestions, attemptMap, panel: els.summaryPanel, t, lang });
  });
  document.getElementById("btn-doc-q")?.addEventListener("click", () => downloadWord(lastQuestions, false, lang));
  document.getElementById("btn-doc-a")?.addEventListener("click", () => downloadWord(lastQuestions, true, lang));
  document.getElementById("btn-print")?.addEventListener("click", () => {
    if (!lastQuestions.length) {
      alert(t("alertNoQuiz"));
      return;
    }
    printSheet(lastQuestions, confirm(t("printConfirm")), lang);
  });

  function syncLangFromParent() {
    const next = resolveQuizLang();
    if (next === lang) return;
    lang = next;
    applyLang();
  }

  try {
    const observer = new MutationObserver(syncLangFromParent);
    observer.observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    if (window.parent.document.readyState === "complete") syncLangFromParent();
    else window.parent.addEventListener("load", syncLangFromParent, { once: true });
  } catch (_) {
    /* not same-origin */
  }

  requestAnimationFrame(syncLangFromParent);

  initSettingsToggle({
    layout: document.getElementById("quiz-layout"),
    panel: document.getElementById("settings-panel"),
    btn: document.getElementById("btn-toggle-settings"),
    icon: document.getElementById("settings-toggle-icon"),
    label: document.getElementById("settings-toggle-label"),
  });

  bindTrueFocus(els.quizContainer);
  bindQuizOptionKeys({ getQuestions: () => lastQuestions, getAttemptMap: () => attemptMap, questionFormat });

  initAttempts();
  applyLang();
  updateProgress();
  renderQuiz();
}

document.addEventListener("DOMContentLoaded", () => initInClassTest());
