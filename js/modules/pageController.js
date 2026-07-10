// =============================================================================
// Page Controller - Main page switching and global nav state
// =============================================================================

import { onLangChange } from "./langController.js";

export function initPageController(options = {}) {
  const {
    onTablePageShown,
    onIonsPageShown,
    onToolsPageShown,
    onWorksheetPageShown,
    onSettingsPageShown,
  } = options;

  const tablePage = document.getElementById("table-page");
  const blankPage1 = document.getElementById("blank-page-1");
  const blankPage2 = document.getElementById("blank-page-2");
  const ionsPage = document.getElementById("ions-page");
  const settingsPage = document.getElementById("settings-page");
  const inclasstestPage = document.getElementById("inclasstest-page");

  let currentPage = "table";

  const pages = {
    table: () => {
      if (tablePage) tablePage.classList.add("active");
    },
    ions: () => {
      if (ionsPage) ionsPage.classList.add("active");
    },
    blank1: () => {
      if (blankPage1) blankPage1.classList.add("active");
    },
    blank2: () => {
      if (blankPage2) blankPage2.classList.add("active");
    },
    settings: () => {
      if (settingsPage) settingsPage.classList.add("active");
    },
    inclasstest: () => {
      if (inclasstestPage) inclasstestPage.classList.add("active");
    },
  };

  function hideAllPages() {
    if (tablePage) tablePage.classList.remove("active");
    if (blankPage1) blankPage1.classList.remove("active");
    if (blankPage2) blankPage2.classList.remove("active");
    if (ionsPage) ionsPage.classList.remove("active");
    if (settingsPage) settingsPage.classList.remove("active");
    if (inclasstestPage) inclasstestPage.classList.remove("active");
  }

  function notifyFlashcardsSessionReset() {
    const frame = document.querySelector("#blank-page-2 .bio-hub-frame");
    try {
      frame?.contentWindow?.postMessage({ type: "s3bio-flashcards-reset" }, "*");
    } catch (_) {
      /* cross-origin */
    }
  }

  function showPage(page) {
    if (!pages[page] || currentPage === page) return;

    if (currentPage === "blank2" && page !== "blank2") {
      notifyFlashcardsSessionReset();
    }

    document.body.classList.remove("hide-nav");
    hideAllPages();
    pages[page]();
    currentPage = page;

    if (page === "table" && typeof onTablePageShown === "function") {
      requestAnimationFrame(onTablePageShown);
    }

    if (page === "ions" && typeof onIonsPageShown === "function") {
      onIonsPageShown();
    }

    if (page === "blank1" && typeof onToolsPageShown === "function") {
      onToolsPageShown();
    }

    if (page === "blank2" && typeof onWorksheetPageShown === "function") {
      onWorksheetPageShown();
    }

    if (page === "settings" && typeof onSettingsPageShown === "function") {
      onSettingsPageShown();
    }
  }

  const globalNavBtns = document.querySelectorAll(".nav-pill-btn, .nav-logo-link, .nav-brand");
  const navPageMap = {
    table: "table",
    ions: "ions",
    tools: "blank1",
    worksheet: "blank2",
    settings: "settings",
    inclasstest: "inclasstest",
  };

  function updateGlobalNavActive(activePage) {
    globalNavBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === activePage);
    });
    moveSliderTo(activePage);
  }

  // ── Sliding pill indicator ──
  const pillContainer = document.querySelector(".global-nav-pill");
  const pillBtns = pillContainer ? pillContainer.querySelectorAll(".nav-pill-btn") : [];
  let slider = null;
  let sliderRefreshFrame = null;

  function positionSlider(activeBtn, { immediate = false } = {}) {
    if (!slider || !pillContainer || !activeBtn) return;

    const containerRect = pillContainer.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    if (immediate) slider.style.transition = "none";
    slider.style.width = `${btnRect.width}px`;
    slider.style.transform = `translateX(${btnRect.left - containerRect.left}px)`;

    if (immediate) {
      requestAnimationFrame(() => {
        if (slider) slider.style.transition = "";
      });
    }
  }

  function refreshSliderPosition(immediate = false) {
    if (!pillContainer) return;
    const activeBtn = pillContainer.querySelector(".nav-pill-btn.active");
    if (activeBtn) positionSlider(activeBtn, { immediate });
  }

  function scheduleSliderRefresh() {
    if (sliderRefreshFrame !== null) return;

    sliderRefreshFrame = requestAnimationFrame(() => {
      sliderRefreshFrame = null;
      refreshSliderPosition(true);
    });
  }

  function createSlider() {
    if (!pillContainer || pillBtns.length === 0) return;
    slider = document.createElement("div");
    slider.className = "nav-pill-slider";
    pillContainer.appendChild(slider);
    refreshSliderPosition(true);
  }

  function moveSliderTo(page) {
    const targetBtn = pillContainer.querySelector(`.nav-pill-btn[data-page="${page}"]`);
    positionSlider(targetBtn);
  }

  createSlider();

  const toolsIframe = blankPage1 ? blankPage1.querySelector(".bio-hub-frame") : null;
  const DEFAULT_TOOLS_SRC = "./osmosis/lab.html";

  function toolsSubpageFromHash(hash) {
    const match = /^tools\/(.+\.html)$/.exec(hash);
    if (!match) return null;
    if (match[1] === "enzyme-interactive.html") {
      return "./enzymes/enzyme-interactive.html?v=ef-final-v1";
    }
    if (match[1] === "enzyme-factor.html") {
      return "./enzymes/enzyme-factor.html?v=ef-carb-release-1";
    }
    if (match[1] === "enzyme-2d-models.html") {
      return "./enzymes/enzyme-2d-models.html";
    }
    if (match[1].startsWith("food-nutrition/")) {
      return `./${match[1]}`;
    }
    return `./osmosis/${match[1]}`;
  }

  function syncToolsIframeFromHash(hash) {
    if (!toolsIframe) return;
    const subpage = toolsSubpageFromHash(hash);
    toolsIframe.src = subpage || DEFAULT_TOOLS_SRC;
  }

  function navKeyFromHash(hash) {
    if (!hash || hash === "table") return "table";
    if (hash === "ions") return "ions";
    if (hash.startsWith("tools")) return "tools";
    if (hash === "worksheet") return "worksheet";
    if (hash === "settings") return "settings";
    if (hash === "inclasstest" || hash.startsWith("inclasstest-ch")) return "inclasstest";
    return null;
  }

  function applyRouteFromHash({ replaceHistory = false } = {}) {
    const hash = window.location.hash.replace(/^#/, "");
    const navKey = navKeyFromHash(hash);
    if (!navKey) return false;

    const target = navPageMap[navKey];
    if (!target) return false;

    if (navKey === "tools") {
      syncToolsIframeFromHash(hash);
    }

    showPage(target);
    updateGlobalNavActive(navKey);

    if (replaceHistory) {
      history.replaceState(null, "", `#${hash || navKey}`);
    }

    return true;
  }

  // Recalculate slider position on resize
  window.addEventListener("resize", scheduleSliderRefresh);

  // Recalculate after language change (button text width changes)
  onLangChange(() => requestAnimationFrame(() => refreshSliderPosition(true)));

  globalNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      const target = navPageMap[page];
      if (!target) return;
      if (page === "tools" && toolsIframe) {
        toolsIframe.src = DEFAULT_TOOLS_SRC;
      }
      showPage(target);
      updateGlobalNavActive(page);
      history.replaceState(null, "", `#${page}`);
    });
  });

  window.addEventListener("hashchange", () => {
    applyRouteFromHash();
  });

  if (!applyRouteFromHash({ replaceHistory: true })) {
    updateGlobalNavActive("table");
  }

  return {
    showPage,
    updateGlobalNavActive,
    getCurrentPage: () => currentPage,
  };
}
