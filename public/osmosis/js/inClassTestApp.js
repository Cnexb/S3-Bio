import { getInClassChapter, getInClassQuestions } from "./inClassTestData.js?v=ict20260716d";
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
    txtPracticeHint: "Fixed order · {n} MCQ · Select all answers, then Submit once.",
    txtKeyboardHint: "Press A, B, C, or D to select an answer on the hovered question.",
    btnSummary: "Session review",
    btnSubmit: "Submit",
    alertNoQuiz: "No questions loaded.",
    alertNeedAnswers: "Select at least one answer before submitting.",
    submitIncompleteConfirm: "Some questions are unanswered. Submit anyway?",
    progressNone: "Not started",
    progressAnsweredPrefix: "Answered ",
    progressSubmitted: "Submitted",
    correct: "Correct.",
    modelPrefix: "Model answer:",
    printConfirm: "Print ANSWER sheet? (Cancel = questions only)",
    hideSettings: "Hide export",
    showSettings: "Show export",
    fixedInfo: "This test uses a fixed set of {n} MCQ in chapter order — no random generation.",
    summaryTitle: "Session review",
    summaryScoreLabel: "Score (correct / total)",
    summaryFirstTry: "Correct",
    summaryWrongTitle: "Incorrect — review these",
    summaryNoneWrong: "None — all answered questions were correct.",
    summaryIncomplete: "Unanswered",
    summaryByTypeTitle: "Correct rate",
    summaryByTypeColType: "Section",
    summaryByTypeColFraction: "Correct / total",
    summaryByTypeColRate: "Rate",
    summaryByTypeColFirst: "Correct / total",
    revTitle: "Comments & revision suggestions",
    revBandExcellent: "Overall accuracy is very high. Review any missed items before the next test.",
    revBandGood: "Good result. Re-read notes for any questions missed.",
    revBandFair: "Mixed performance — revisit weaker topics in your chapter notes.",
    revBandLow: "Several concepts need consolidation. Review the chapter before retaking.",
    revWeakOne: "Prioritise revision on {type} — you scored {c}/{t} ({pct}%).",
    revStrongOne: "Strength: every {type} item correct ({n} questions).",
    revTwoStrike: "Incorrect items: study the model answers on those questions, then retry.",
    revIncomplete: "Some questions were left unanswered.",
    revFirstTryLow: "",
    revBalanced: "Errors spread across topics — continue balanced revision.",
  },
  zh: {
    hExport: "导出",
    txtExportHint: "Word：下载 .doc 以 Word 打开。PDF 请用「打印」→「另存 PDF」。",
    btnDocQ: "Word — 试题",
    btnDocA: "Word — 答案",
    btnPrint: "打印／另存 PDF",
    hPractice: "课堂测验",
    txtPracticeHint: "固定顺序 · {n} 道选择题 · 全部作答后按一次提交。",
    txtKeyboardHint: "可将鼠标悬停在题目上，按 A、B、C、D 作答。",
    btnSummary: "学习摘要",
    btnSubmit: "提交",
    alertNoQuiz: "未加载题目。",
    alertNeedAnswers: "请至少选择一题答案后再提交。",
    submitIncompleteConfirm: "仍有题目未作答。确定提交吗？",
    progressNone: "尚未开始",
    progressAnsweredPrefix: "已作答 ",
    progressSubmitted: "已提交",
    correct: "正确。",
    modelPrefix: "参考答案：",
    printConfirm: "要打印「答案版」吗？（取消 = 试题版）",
    hideSettings: "隐藏导出",
    showSettings: "显示导出",
    fixedInfo: "本测验为固定 {n} 道选择题，按章节顺序出题，不会随机抽题。",
    summaryTitle: "学习摘要",
    summaryScoreLabel: "得分（答对／总题数）",
    summaryFirstTry: "答对",
    summaryWrongTitle: "答错 — 需重温",
    summaryNoneWrong: "没有错题。",
    summaryIncomplete: "未作答",
    summaryByTypeTitle: "答对率",
    summaryByTypeColType: "部分",
    summaryByTypeColFraction: "答对／总题数",
    summaryByTypeColRate: "答对率",
    summaryByTypeColFirst: "答对／总题数",
    revTitle: "评语与温习建议",
    revBandExcellent: "整体答对率很高。可在下次测验前重温错题。",
    revBandGood: "整体表现不错。请重温错题。",
    revBandFair: "表现参差：请重温相关笔记。",
    revBandLow: "多个概念仍需巩固。请先温习该章笔记。",
    revWeakOne: "建议优先温习「{type}」：本次 {c}/{t}（{pct}%）。",
    revStrongOne: "强项：「{type}」本次全对（共 {n} 题）。",
    revTwoStrike: "错题请细读参考答案后再练。",
    revIncomplete: "尚有题目未作答。",
    revFirstTryLow: "",
    revBalanced: "错误分散在不同部分，宜均衡温习。",
  },
  "zh-Hant": {
    hExport: "匯出",
    txtExportHint: "Word：下載 .doc 以 Word 開啟。PDF 請用「列印」→「另存 PDF」。",
    btnDocQ: "Word — 試題",
    btnDocA: "Word — 答案",
    btnPrint: "列印／另存 PDF",
    hPractice: "課堂測驗",
    txtPracticeHint: "固定順序 · {n} 道選擇題 · 全部作答後按一次提交。",
    txtKeyboardHint: "可將滑鼠懸停在題目上，按 A、B、C、D 作答。",
    btnSummary: "學習摘要",
    btnSubmit: "提交",
    alertNoQuiz: "未載入題目。",
    alertNeedAnswers: "請至少選擇一題答案後再提交。",
    submitIncompleteConfirm: "仍有題目未作答。確定提交嗎？",
    progressNone: "尚未開始",
    progressAnsweredPrefix: "已作答 ",
    progressSubmitted: "已提交",
    correct: "正確。",
    modelPrefix: "參考答案：",
    printConfirm: "要列印「答案版」嗎？（取消 = 試題版）",
    hideSettings: "隱藏匯出",
    showSettings: "顯示匯出",
    fixedInfo: "本測驗為固定 {n} 道選擇題，按章節順序出題，不會隨機抽題。",
    summaryTitle: "學習摘要",
    summaryScoreLabel: "得分（答對／總題數）",
    summaryFirstTry: "答對",
    summaryWrongTitle: "答錯 — 需重溫",
    summaryNoneWrong: "沒有錯題。",
    summaryIncomplete: "未作答",
    summaryByTypeTitle: "答對率",
    summaryByTypeColType: "部分",
    summaryByTypeColFraction: "答對／總題數",
    summaryByTypeColRate: "答對率",
    summaryByTypeColFirst: "答對／總題數",
    revTitle: "評語與溫習建議",
    revBandExcellent: "整體答對率很高。可在下次測驗前重溫錯題。",
    revBandGood: "整體表現不錯。請重溫錯題。",
    revBandFair: "表現參差：請重溫相關筆記。",
    revBandLow: "多個概念仍需鞏固。請先溫習該章筆記。",
    revWeakOne: "建議優先溫習「{type}」：本次 {c}/{t}（{pct}%）。",
    revStrongOne: "強項：「{type}」本次全對（共 {n} 題）。",
    revTwoStrike: "錯題請細讀參考答案後再練。",
    revIncomplete: "尚有題目未作答。",
    revFirstTryLow: "",
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
  let submitted = false;
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
    btnSummary: document.getElementById("btn-summary"),
  };

  if (!els.quizArea) return;

  if (els.btnSummary) {
    els.btnSummary.hidden = true;
  }

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
    if (els.summaryPanel && !els.summaryPanel.hidden && lastQuestions.length && submitted) {
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

  function answeredCount() {
    let n = 0;
    lastQuestions.forEach((q) => {
      if (attemptMap.get(q.id)?.selected) n += 1;
    });
    return n;
  }

  function updateProgress() {
    if (!lastQuestions.length) {
      if (els.progressText) els.progressText.textContent = t("progressNone");
      if (els.progressBar) els.progressBar.style.width = "0%";
      return;
    }
    if (submitted) {
      if (els.progressText) els.progressText.textContent = t("progressSubmitted");
      if (els.progressBar) els.progressBar.style.width = "100%";
      return;
    }
    const done = answeredCount();
    if (els.progressText) {
      els.progressText.textContent = t("progressAnsweredPrefix") + done + " / " + lastQuestions.length;
    }
    if (els.progressBar) {
      els.progressBar.style.width = `${(done / lastQuestions.length) * 100}%`;
    }
  }

  function gradeAll() {
    lastQuestions.forEach((q) => {
      const state = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
      if (!state.selected) {
        state.solved = false;
        state.wrong = 0;
      } else if (state.selected === q.answer) {
        state.solved = true;
        state.wrong = 0;
      } else {
        // wrong >= 2 → listed under incorrect in session review
        state.solved = true;
        state.wrong = 2;
      }
      attemptMap.set(q.id, state);
    });
  }

  function showSessionReview() {
    if (!els.summaryPanel) return;
    renderSessionSummary({ questions: lastQuestions, attemptMap, panel: els.summaryPanel, t, lang });
    if (els.btnSummary) {
      els.btnSummary.hidden = false;
      els.btnSummary.textContent = t("btnSummary");
    }
    els.summaryPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function submitTest() {
    if (submitted) {
      showSessionReview();
      return;
    }
    const answered = answeredCount();
    if (!answered) {
      alert(t("alertNeedAnswers"));
      return;
    }
    if (answered < lastQuestions.length) {
      if (!confirm(t("submitIncompleteConfirm"))) return;
    }
    submitted = true;
    gradeAll();
    renderQuiz();
    updateProgress();
    showSessionReview();
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
      og.className = "grid grid-cols-1 gap-3";

      q.options.forEach((opt) => {
        const magnet = document.createElement("div");
        magnet.className = "magnet-link group";
        const btnOpt = document.createElement("button");
        btnOpt.type = "button";
        btnOpt.className =
          "quiz-option w-full text-left p-4 md:p-5 rounded-2xl border-2 border-outline-variant/20 bg-surface hover:border-primary hover:bg-primary-fixed transition-all flex items-center gap-4 relative disabled:opacity-60";
        btnOpt.dataset.key = opt.key;
        btnOpt.disabled = submitted;

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

        if (!submitted) {
          btnOpt.addEventListener("click", () => {
            optionButtons.forEach((b) => {
              b.classList.remove("border-primary", "bg-primary-fixed/30", "shadow-sm", "border-tertiary", "bg-tertiary/10", "border-secondary", "bg-secondary/10");
              b.classList.add("border-outline-variant/20", "bg-surface");
              b.querySelector("span:first-child")?.classList.remove("bg-primary", "text-on-primary", "bg-tertiary", "bg-secondary", "text-on-secondary");
              b.querySelector("span:first-child")?.classList.add("bg-surface-container-high");
            });
            btnOpt.classList.add("border-primary", "bg-primary-fixed/30", "shadow-sm");
            btnOpt.classList.remove("border-outline-variant/20", "bg-surface");
            badge.classList.add("bg-primary", "text-on-primary");
            badge.classList.remove("bg-surface-container-high");
            const state = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
            state.selected = opt.key;
            attemptMap.set(q.id, state);
            updateProgress();
          });
        }
      });
      wrap.appendChild(og);

      if (!submitted && st.selected) {
        const sel = optionButtons.find((b) => b.dataset.key === st.selected);
        if (sel) {
          sel.classList.add("border-primary", "bg-primary-fixed/30", "shadow-sm");
          sel.classList.remove("border-outline-variant/20", "bg-surface");
          sel.querySelector("span:first-child")?.classList.add("bg-primary", "text-on-primary");
          sel.querySelector("span:first-child")?.classList.remove("bg-surface-container-high");
        }
      }

      if (submitted && st.selected) {
        optionButtons.forEach((b) => {
          const key = b.dataset.key;
          const badgeEl = b.querySelector("span:first-child");
          if (key === q.answer) {
            b.classList.add("border-secondary", "bg-secondary/10");
            badgeEl?.classList.add("bg-secondary", "text-on-secondary");
          } else if (key === st.selected && st.selected !== q.answer) {
            b.classList.add("border-tertiary", "bg-tertiary/10");
            badgeEl?.classList.add("bg-tertiary", "text-on-primary");
          }
        });

        const fb = document.createElement("div");
        fb.setAttribute("role", "status");
        if (st.selected === q.answer) {
          fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-secondary/10 text-secondary font-label-bold";
          fb.textContent = t("correct");
        } else {
          const ma = modelAnswerText(q);
          fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/25";
          fb.innerHTML = `<strong>${escHtml(t("modelPrefix"))}</strong> ${escHtml(ma.en)}`;
        }
        wrap.appendChild(fb);
      }

      el.appendChild(wrap);
    });

    const submitWrap = document.createElement("div");
    submitWrap.className = "pt-2 pb-4 flex justify-center";
    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.id = "btn-submit-test";
    submitBtn.className =
      "quiz-submit-btn px-10 py-3.5 rounded-full bg-primary text-on-primary font-label-bold text-body-md hover:opacity-90 transition-opacity shadow-sm";
    submitBtn.textContent = submitted ? t("btnSummary") : t("btnSubmit");
    submitBtn.addEventListener("click", submitTest);
    submitWrap.appendChild(submitBtn);
    el.appendChild(submitWrap);

    applyEffectsAfterRender();
  }

  document.getElementById("btn-summary")?.addEventListener("click", () => {
    if (!submitted) return;
    showSessionReview();
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
