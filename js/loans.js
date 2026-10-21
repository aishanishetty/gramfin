// loans.js — compare loans from the `loans` array (data.js) in a table.
// Text comes from t() / localized() so it follows the chosen language.

const selects = [
  document.getElementById("c1"),
  document.getElementById("c2"),
  document.getElementById("c3"),
];
const table = document.getElementById("compare-table");

// The rows of the table: [label key, which field of the loan object to show]
const rows = [
  ["row.provider",   "provider"],
  ["row.amount",     "amount"],
  ["row.rate",       "rate"],
  ["row.fee",        "fee"],
  ["row.tenure",     "tenure"],
  ["row.collateral", "collateral"],
  ["row.documents",  "documents"],
  ["row.bestFor",    "bestFor"],
];

// Fill each dropdown with the loan names (in the current language).
// We remember what was selected so a language change doesn't reset the choices.
function fillSelects() {
  selects.forEach((sel, i) => {
    const previous = sel.value;
    const blank = i === 2 ? `<option value="">${t("loans.none")}</option>` : "";
    sel.innerHTML = blank + loans
      .map(l => `<option value="${l.id}">${localized("loans", l.id, l).name}</option>`)
      .join("");
    if (previous) sel.value = previous;
  });
}

function render() {
  // Find the chosen loan objects (ignore an empty Option C), in the current language.
  const chosen = selects
    .map(s => loans.find(l => l.id === s.value))
    .filter(Boolean)
    .map(l => localized("loans", l.id, l));

  const head = `<tr><th>${t("loans.feature")}</th>${chosen.map(l => `<th>${l.name}</th>`).join("")}</tr>`;
  const body = rows
    .map(([labelKey, field]) => `<tr><td>${t(labelKey)}</td>${chosen.map(l => `<td>${l[field]}</td>`).join("")}</tr>`)
    .join("");

  table.innerHTML = head + body;
}

fillSelects();
// Start with 3 different sensible defaults.
selects[0].value = "mudra";
selects[1].value = "msme";
selects[2].value = "nbfc";
render();

selects.forEach(s => s.addEventListener("change", render));
window.addEventListener("langchange", () => { fillSelects(); render(); });
