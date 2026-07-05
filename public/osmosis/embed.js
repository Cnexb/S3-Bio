(function initBioEmbed() {
  const STANDALONE_ROUTES = {
    "slides.html": "table",
    "notes.html": "ions",
    "lab.html": "tools",
    "flashcards.html": "worksheet",
    "flashcards-study.html": "worksheet",
    "quiz.html": "settings",
    "quiz-hub.html": "settings",
    "quiz-ch4.html": "settings",
    "quiz-ch5.html": "settings",
    "virtual-osmosis-lab.html": "tools/virtual-osmosis-lab.html",
    "membrane-animation.html": "tools/membrane-animation.html",
    "endosymbiotic-animation.html": "tools/endosymbiotic-animation.html",
    "condensation-animation.html": "tools/food-nutrition/condensation-animation.html",
    "enzyme-interactive.html": "tools/enzyme-interactive.html",
  };

  if (window.self !== window.top) {
    document.documentElement.classList.add("bio-embed");
    if (new URLSearchParams(window.location.search).get("embed") === "1") {
      document.documentElement.classList.add("bio-slide-embed-compact");
    }
  }

  if (window.self === window.top) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") === "slides") return;

    const path = window.location.pathname;
    const page = path.split("/").pop() || "";
    const route = STANDALONE_ROUTES[page];
    if (route) {
      const inFoodNutrition = path.includes("/food-nutrition/");
      const inEnzymes = path.includes("/enzymes/");
      const root = new URL(inFoodNutrition || inEnzymes ? "../../../" : "../../", window.location.href);
      window.location.replace(`${root.href}#${route}`);
      return;
    }
  }

})();
