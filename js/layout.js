// layout.js
// The navbar and footer are the same on every page, so instead of copy-pasting
// them into 6 HTML files we build them here ONCE and inject them into each page.
// Want to add a new menu item? Add one line to `pages` below and you're done.

const pages = [
  { href: "index.html",      label: "Home" },
  { href: "learn.html",      label: "Learn" },
  { href: "schemes.html",    label: "Schemes" },
  { href: "calculator.html", label: "EMI Calculator" },
  { href: "loans.html",      label: "Compare Loans" },
  { href: "fraud.html",      label: "Fraud Alerts" },
];

// Which page are we on? (e.g. "schemes.html"). Empty path = home page.
const current = location.pathname.split("/").pop() || "index.html";

// Turn the array into <li><a> items. The current page gets class="active".
const links = pages
  .map(p => `<li><a href="${p.href}" class="${p.href === current ? "active" : ""}">${p.label}</a></li>`)
  .join("");

document.getElementById("site-header").innerHTML = `
  <div class="container nav">
    <a class="brand" href="index.html">Gram<span>Fin</span></a>
    <button class="menu-btn" id="menu-btn" aria-label="Open menu">☰</button>
    <ul class="nav-links" id="nav-links">${links}</ul>
  </div>`;

document.getElementById("site-footer").innerHTML = `
  <div class="container">
    <p><strong>GramFin</strong> — financial awareness for rural entrepreneurs.</p>
    <p style="margin-top:8px">⚠️ GramFin is for awareness and guidance only. It is not a bank, lender,
    insurer or financial advisor, and it does not guarantee loan approval, insurance or returns.
    Scheme details can change — always confirm on the official website or at your bank branch.</p>
  </div>`;

// Mobile menu: tapping ☰ shows/hides the links.
document.getElementById("menu-btn").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("open");
});
