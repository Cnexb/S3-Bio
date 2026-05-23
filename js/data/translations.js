// =============================================================================
// Translations Module — Aggregator
// =============================================================================

import { enUI } from "./locales/ui/en.js";
import { zhUI } from "./locales/ui/zh.js";
import { zhHantUI } from "./locales/ui/zh-Hant.js";

/**
 * UI translations for supported languages.
 * Element and ion data load dynamically via langController.js (zh, zh-Hant only).
 */
export const translations = {
  en: enUI,
  zh: zhUI,
  "zh-Hant": zhHantUI,
};
