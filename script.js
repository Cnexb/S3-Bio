import { initPageController } from "./js/modules/pageController.js";
import {
  initLangController,
  onLangChange,
} from "./js/modules/langController.js";
import { initEntryLanding } from "./js/modules/onboardingController.js";

// ========================================
// Global Dragging State (used to prevent accidental panel close)
// ========================================
window._uniplusIsDragging = false;
(function initGlobalDragTracking() {
  let pointerDown = false;
  let startX = 0, startY = 0;
  const DRAG_THRESHOLD = 5;
  document.addEventListener('pointerdown', (e) => {
    pointerDown = true;
    startX = e.clientX;
    startY = e.clientY;
  }, true);
  document.addEventListener('pointermove', (e) => {
    if (!pointerDown) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      window._uniplusIsDragging = true;
    }
  }, true);
  document.addEventListener('pointerup', () => {
    pointerDown = false;
    setTimeout(() => { window._uniplusIsDragging = false; }, 80);
  }, true);
  document.addEventListener('pointercancel', () => {
    pointerDown = false;
    setTimeout(() => { window._uniplusIsDragging = false; }, 80);
  }, true);
  window.addEventListener('blur', () => {
    pointerDown = false;
  });
})();

function initNavResponsive() {
  const nav = document.getElementById("global-nav");
  if (!nav) return;

  const SAFETY_GAP = 32;

  function checkNavCollision() {
    nav.classList.remove("nav-hide-brand");
    const navInnerWidth = nav.clientWidth;
    const logo = nav.querySelector(".nav-logo-link");
    const brand = nav.querySelector(".nav-brand");
    const pill = nav.querySelector(".global-nav-pill");

    const logoW = logo ? logo.offsetWidth : 0;
    const brandW = brand ? brand.offsetWidth : 0;
    const pillW = pill ? pill.offsetWidth : 0;
    const navGap = 12;
    const brandGap = brand && brandW > 0 ? 10 : 0;

    const totalNeeded = logoW + brandGap + brandW + navGap + pillW + SAFETY_GAP * 2;

    if (totalNeeded > navInnerWidth) {
      nav.classList.add("nav-hide-brand");
    }
  }

  let navResizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(navResizeTimer);
    navResizeTimer = setTimeout(checkNavCollision, 60);
  });
  window.addEventListener("load", checkNavCollision);
  onLangChange(() => requestAnimationFrame(checkNavCollision));
  requestAnimationFrame(checkNavCollision);
}

function initBioHubShell() {
  document.body.classList.add("bio-hub-app");
  document.body.classList.remove("hide-nav");
}

function initMainApp() {
  initBioHubShell();
  initNavResponsive();
  initPageController();
}

function bootstrapApp() {
  initLangController();
  initEntryLanding(() => initMainApp());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapApp, { once: true });
} else {
  bootstrapApp();
}
