// layout.js
// The navbar and footer are the same on every page, so we build them here ONCE
// and inject them into each page (every page has an empty #site-header and #site-footer).
// Want a new menu item? Add one line to `pages` below, and add its text in ui-strings.js.

const pages = [
  { href: "index.html",      key: "nav.home" },
  { href: "learn.html",      key: "nav.learn" },
  { href: "schemes.html",    key: "nav.schemes" },
  { href: "calculator.html", key: "nav.calc" },
  { href: "loans.html",      key: "nav.loans" },
  { href: "fraud.html",      key: "nav.fraud" },
];

// Which page are we on? (e.g. "schemes.html"). Empty path = home page.
const current = location.pathname.split("/").pop() || "index.html";

// Menu links. data-i18n lets i18n.js translate the label whenever the language changes.
const links = pages
  .map(p => `<li><a href="${p.href}" class="${p.href === current ? "active" : ""}" data-i18n="${p.key}">${UI.en[p.key]}</a></li>`)
  .join("");

// One button per language: English | हिंदी | मराठी
const langButtons = Object.entries(LANGS)
  .map(([code, l]) => `<button type="button" data-lang="${code}" lang="${code}">${l.name}</button>`)
  .join("");

document.getElementById("site-header").innerHTML = `
  <div class="container nav">
    <a class="brand" href="index.html">Gram<span>Fin</span></a>
    <ul class="nav-links" id="nav-links">${links}</ul>
    <div class="lang-switch" role="group" aria-label="Language">${langButtons}</div>
    <button class="menu-btn" id="menu-btn" aria-label="Menu">☰</button>
  </div>`;

document.getElementById("site-footer").innerHTML = `
  <div class="container">
    <p><strong>GramFin</strong></p>
    <p data-i18n="footer.line1">${UI.en["footer.line1"]}</p>
    <p style="margin-top:8px" data-i18n="footer.disc">${UI.en["footer.disc"]}</p>
  </div>`;

// Mobile menu: tapping ☰ shows/hides the links.
document.getElementById("menu-btn").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("open");
});

// Language buttons.
document.querySelectorAll("[data-lang]").forEach(btn => {
  btn.addEventListener("click", () => setLang(btn.dataset.lang));
});

// Translate everything on the page for the saved language (nav, footer, page text).
applyStatic();
updateLangButtons();
