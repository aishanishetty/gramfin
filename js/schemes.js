// schemes.js — filter the `schemes` array (from data.js) and show cards.
// Also lets the user ⭐ save schemes. Saved IDs are kept in localStorage,
// which is a tiny storage inside the user's own browser (no backend needed).

const typeBox  = document.getElementById("f-type");
const stateBox = document.getElementById("f-state");
const groupBox = document.getElementById("f-group");
const results  = document.getElementById("results");
const countEl  = document.getElementById("count");

// ---------- Saved schemes (localStorage) ----------
// localStorage only stores text, so we turn the array into text with JSON.stringify
// and back into an array with JSON.parse.
function getSaved() {
  try { return JSON.parse(localStorage.getItem("savedSchemes")) || []; }
  catch { return []; }
}
function toggleSaved(id) {
  let saved = getSaved();
  saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
  localStorage.setItem("savedSchemes", JSON.stringify(saved));
}

// ---------- Filtering ----------
// A scheme matches if it fits every box the user chose.
function matches(s) {
  const type  = typeBox.value;
  const state = stateBox.value;
  const group = groupBox.value;

  const typeOK  = type === "all" || s.businessTypes.includes(type);
  // All-India schemes are always OK. State schemes only if that state is chosen.
  const stateOK = s.states.includes("all") || s.states.includes(state);
  // Schemes meant for everyone ("all") always OK; special schemes only if the user picked that group.
  const groupOK = s.groups.includes("all") || s.groups.includes(group);

  return typeOK && stateOK && groupOK;
}

// ---------- Drawing the cards ----------
function card(s) {
  const isSaved = getSaved().includes(s.id);
  const stateTag = s.states.includes("all") ? "All India" : s.states.join(", ");
  return `
    <article class="card scheme-card">
      <span class="tag blue">${stateTag}</span>
      <h3>${s.name}</h3>
      <p>${s.summary}</p>
      <dl>
        <dt>Who can apply</dt><dd>${s.eligibility}</dd>
        <dt>Benefits</dt><dd>${s.benefits}</dd>
        <dt>Documents needed</dt><dd>${s.documents}</dd>
        <dt>How to apply</dt><dd>${s.apply}</dd>
      </dl>
      <div class="card-actions">
        <button class="btn small ghost" data-save="${s.id}">${isSaved ? "⭐ Saved" : "☆ Save"}</button>
        <a class="btn small" href="${s.link}" target="_blank" rel="noopener">Official website ↗</a>
      </div>
    </article>`;
}

function show(list, label) {
  countEl.textContent = list.length ? `${label}: ${list.length} scheme${list.length > 1 ? "s" : ""}` : "";
  results.innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="empty" style="grid-column:1/-1">No schemes found. Try choosing "Any business" or "All India".</div>`;
}

let mode = "search"; // "search" or "saved"

function render() {
  if (mode === "saved") {
    const saved = getSaved();
    show(schemes.filter(s => saved.includes(s.id)), "Saved");
  } else {
    show(schemes.filter(matches), "Found");
  }
}

// ---------- Events ----------
document.getElementById("btn-search").addEventListener("click", () => { mode = "search"; render(); });
document.getElementById("btn-saved").addEventListener("click",  () => { mode = "saved";  render(); });
[typeBox, stateBox, groupBox].forEach(b => b.addEventListener("change", () => { mode = "search"; render(); }));

// One listener on the whole results area handles every Save button (event delegation).
results.addEventListener("click", e => {
  const btn = e.target.closest("[data-save]");
  if (!btn) return;
  toggleSaved(btn.dataset.save);
  render();
});

render(); // show everything when the page first loads
