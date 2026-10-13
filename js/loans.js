// loans.js — compare loans from the `loans` array (data.js) in a table.

const selects = [
  document.getElementById("c1"),
  document.getElementById("c2"),
  document.getElementById("c3"),
];
const table = document.getElementById("compare-table");

// Fill each dropdown with the loan names.
// Option C also gets a "— none —" choice so it can be left empty.
selects.forEach((sel, i) => {
  const blank = i === 2 ? `<option value="">— none —</option>` : "";
  sel.innerHTML = blank + loans.map(l => `<option value="${l.id}">${l.name}</option>`).join("");
});

// Start with 3 different sensible defaults.
selects[0].value = "mudra";
selects[1].value = "msme";
selects[2].value = "nbfc";

// The rows of the table: [label, which field of the loan object to show]
const rows = [
  ["Provider",        "provider"],
  ["Loan amount",     "amount"],
  ["Interest rate",   "rate"],
  ["Processing fee",  "fee"],
  ["Repayment period","tenure"],
  ["Collateral",      "collateral"],
  ["Documents",       "documents"],
  ["Best suited for", "bestFor"],
];

function render() {
  // Find the chosen loan objects (ignore an empty Option C).
  const chosen = selects
    .map(s => loans.find(l => l.id === s.value))
    .filter(Boolean);

  const head = `<tr><th>Feature</th>${chosen.map(l => `<th>${l.name}</th>`).join("")}</tr>`;
  const body = rows
    .map(([label, key]) => `<tr><td>${label}</td>${chosen.map(l => `<td>${l[key]}</td>`).join("")}</tr>`)
    .join("");

  table.innerHTML = head + body;
}

selects.forEach(s => s.addEventListener("change", render));
render();
