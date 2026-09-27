(function initCh5RevealBridge(global) {
  "use strict";

  const BRIGHT_CSS = `
    .reveal-viewport,
    .reveal .slides,
    .reveal .slides section,
    .reveal .slide-background,
    .reveal .slide-background-content {
      background: #fff !important;
    }
    .reveal .progress,
    .reveal .controls,
    .reveal .playback,
    .reveal .slide-number {
      display: none !important;
    }
  `;

  function waitForReveal(frame, timeoutMs) {
    const limit = timeoutMs || 12000;
    const start = Date.now();
    return new Promise(function resolveReveal(wait) {
      const R = frame.contentWindow && frame.contentWindow.Reveal;
      if (R && R.isReady && R.isReady()) {
        wait(R);
        return;
      }
      if (Date.now() - start > limit) {
        wait(null);
        return;
      }
      setTimeout(function () { resolveReveal(wait); }, 80);
    });
  }

  function injectBrightTheme(frame) {
    try {
      const doc = frame.contentDocument;
      if (!doc || doc.getElementById("ch5-bright-theme")) return;
      const style = doc.createElement("style");
      style.id = "ch5-bright-theme";
      style.textContent = BRIGHT_CSS;
      doc.head.appendChild(style);
      doc.querySelectorAll("section[data-background-color]").forEach(function (section) {
        section.setAttribute("data-background-color", "#ffffff");
      });
    } catch (_) {
      /* cross-origin guard */
    }
  }

  function Ch5RevealEmbed(frame, stepCount) {
    this.frame = frame;
    this.stepCount = stepCount;
    this.reveal = null;
    this.ready = false;
    this._boot();
  }

  Ch5RevealEmbed.prototype._boot = function () {
    const self = this;
    this.frame.addEventListener("load", function () {
      waitForReveal(self.frame).then(function (R) {
        if (!R) return;
        injectBrightTheme(self.frame);
        self.reveal = R;
        self.ready = true;
        self.go(0, true);
      });
    });
    if (self.frame.contentDocument && self.frame.contentDocument.readyState === "complete") {
      self.frame.dispatchEvent(new Event("load"));
    }
  };

  Ch5RevealEmbed.prototype.go = function (step, force) {
    if (!this.reveal) return false;
    const idx = Math.max(0, Math.min(step, this.stepCount - 1));
    if (!force && this.reveal.getIndices().h === idx) {
      this._layout();
      return true;
    }
    this.reveal.slide(idx);
    this._layout();
    return true;
  };

  Ch5RevealEmbed.prototype._layout = function () {
    if (!this.reveal) return;
    try {
      if (typeof this.reveal.layout === "function") this.reveal.layout();
    } catch (_) {}
  };

  Ch5RevealEmbed.prototype.layout = function () {
    this._layout();
    return true;
  };

  Ch5RevealEmbed.prototype.next = function () {
    if (!this.reveal) return false;
    const idx = this.reveal.getIndices().h;
    if (idx >= this.stepCount - 1) return false;
    this.reveal.slide(idx + 1);
    return true;
  };

  Ch5RevealEmbed.prototype.prev = function () {
    if (!this.reveal) return false;
    const idx = this.reveal.getIndices().h;
    if (idx <= 0) return false;
    this.reveal.slide(idx - 1);
    return true;
  };

  global.Ch5RevealEmbed = Ch5RevealEmbed;
  global.initCh5RevealEmbed = function (frameId, stepCount) {
    const frame = document.getElementById(frameId);
    if (!frame) return null;
    return new Ch5RevealEmbed(frame, stepCount);
  };
})(window);
