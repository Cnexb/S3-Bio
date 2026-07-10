(function initBioEmbed() {
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  const page = path.split("/").pop() || "";
  const isStandalone =
    params.get("standalone") === "1" || /-standalone\.html$/i.test(page);

  const STANDALONE_ROUTES = {
    "summary.html": "table",
    "notes.html": "ions",
    "notes-view.html": "ions",
    "lab.html": "tools",
    "flashcards.html": "worksheet",
    "flashcards-study.html": "worksheet",
    "flashcards-ch2.html": "worksheet",
    "quiz.html": "settings",
    "quiz-hub.html": "settings",
    "quiz-ch2.html": "settings",
    "quiz-ch4.html": "settings",
    "quiz-ch5.html": "settings",
    "in-class-test-shell.html": "inclasstest",
    "in-class-test-hub.html": "inclasstest",
    "in-class-test.html": "inclasstest",
    "in-class-test-ch2.html": "inclasstest",
    "in-class-test-ch3.html": "inclasstest",
    "in-class-test-ch4.html": "inclasstest",
    "in-class-test-ch5.html": "inclasstest",
    "virtual-osmosis-lab.html": "tools/virtual-osmosis-lab.html",
    "membrane-animation.html": "tools/membrane-animation.html",
    "endosymbiotic-animation.html": "tools/endosymbiotic-animation.html",
    "condensation-animation.html": "tools/food-nutrition/condensation-animation.html",
    "ch5-reactions-hub.html": "tools/food-nutrition/ch5-reactions-hub.html",
    "maltose-hydrolysis-animation.html": "tools/food-nutrition/maltose-hydrolysis-animation.html",
    "triglyceride-condensation-animation.html": "tools/food-nutrition/triglyceride-condensation-animation.html",
    "triglyceride-hydrolysis-animation.html": "tools/food-nutrition/triglyceride-hydrolysis-animation.html",
    "dipeptide-condensation-animation.html": "tools/food-nutrition/dipeptide-condensation-animation.html",
    "dipeptide-hydrolysis-animation.html": "tools/food-nutrition/dipeptide-hydrolysis-animation.html",
    "starch-hydrolysis-animation.html": "tools/food-nutrition/starch-hydrolysis-animation.html",
    "cellulose-hydrolysis-animation.html": "tools/food-nutrition/cellulose-hydrolysis-animation.html",
    "dna-condensation-animation.html": "tools/food-nutrition/dna-condensation-animation.html",
    "dna-hydrolysis-animation.html": "tools/food-nutrition/dna-hydrolysis-animation.html",
    "enzyme-interactive.html": "tools/enzyme-interactive.html",
    "enzyme-factor.html": "tools/enzyme-factor.html",
  };

  if (window.self === window.top) {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "";
    const route = STANDALONE_ROUTES[page];
    if (route && !isStandalone) {
      const inFoodNutrition = path.includes("/food-nutrition/");
      const inEnzymes = path.includes("/enzymes/");
      const root = new URL(inFoodNutrition || inEnzymes ? "../../../" : "../../", window.location.href);
      window.location.replace(`${root.href}#${route}`);
      return;
    }
  }

  if (window.self !== window.top || isStandalone) {
    document.documentElement.classList.add("bio-embed");
    if (isStandalone) {
      document.documentElement.classList.add("bio-standalone");
      window.__S3BIO_STANDALONE__ = true;
    }
  }
})();
