// i18n.js  ("internationalisation" = making the site work in many languages)
// The engine behind the language switcher. It does 4 jobs:
//   1. remembers the chosen language (in localStorage, so it survives refresh)
//   2. t("key")        -> gives you the text for the current language
//   3. applyStatic()   -> fills every <tag data-i18n="key"> on the page
//   4. localized(...)  -> swaps schemes/loans/lessons etc. for their Hindi/Marathi version
//
// Load order on every page:  ui-strings.js  ->  i18n.js  ->  layout.js  -> ... page script

// Languages we support. "speech" is the code the browser's voice engine understands.
const LANGS = {
  en: { name: "English", speech: "en-IN" },
  hi: { name: "हिंदी",   speech: "hi-IN" },
  mr: { name: "मराठी",   speech: "mr-IN" },
};

// Read the saved language (or default to English). try/catch because localStorage
// can be blocked in some browsers.
let currentLang = "en";
try {
  const saved = localStorage.getItem("lang");
  if (saved && LANGS[saved]) currentLang = saved;
} catch (e) { /* ignore */ }
document.documentElement.lang = currentLang;

// t("count.found", {n: 3})  ->  "Schemes found: 3"
// If a translation is missing we fall back to English, then to the key itself.
function t(key, vars) {
  let text = (UI[currentLang] && UI[currentLang][key]) || UI.en[key] || key;
  if (vars) {
    text = text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  }
  return text;
}

// Fill every element that has a data-i18n (plain text) or data-i18n-html (HTML) attribute.
function applyStatic() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  // Browser tab title
  const key = document.body.dataset.title;
  if (key) document.title = key.startsWith("title.") ? t(key) : t(key) + " – GramFin";
}

// Highlight the active language button in the navbar.
function updateLangButtons() {
  document.querySelectorAll("[data-lang]").forEach(btn => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active);
  });
}

// Called when the user clicks a language button.
function setLang(code) {
  if (!LANGS[code] || code === currentLang) return;
  currentLang = code;
  try { localStorage.setItem("lang", code); } catch (e) { /* ignore */ }
  document.documentElement.lang = code;
  applyStatic();
  updateLangButtons();
  // Tell the other scripts "language changed" so they re-draw their cards, tables, etc.
  window.dispatchEvent(new Event("langchange"));
}

// localized("schemes", "mudra", schemeObject)
// Looks for a Hindi/Marathi version in content-translations.js. If it finds one, it
// returns the object with those fields replaced. If not, you get the original English.
//   kind = "schemes" | "loans" | "topics" | "quiz" | "scams"
//   key  = the item's id (schemes, loans) or its position number (topics, quiz, scams)
function localized(kind, key, obj) {
  if (typeof contentTr === "undefined") return obj;
  const tr = contentTr[currentLang] && contentTr[currentLang][kind] && contentTr[currentLang][kind][key];
  return tr ? { ...obj, ...tr } : obj;
}
