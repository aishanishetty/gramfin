// schemes.js — filter the `schemes` array (from data.js) and show cards.
// Also lets the user ⭐ save schemes. Saved IDs are kept in localStorage,
// which is a tiny storage inside the user's own browser (no backend needed).
// Text comes from t() / localized() so everything follows the chosen language.

const typeBox  = document.getElementById("f-type");
const stateBox = document.getElementById("f-state");
const groupBox = document.getElementById("f-group");
const results  = document.getElementById("results");
const countEl  = document.getElementById("count");

// ---------- Saved schemes (localStorage) ----------
function getSaved() {
  try { return JSON.parse(localStorage.getItem("savedSchemes")) || []; }
  catch { return []; }
}
function toggleSaved(id) {
  let saved = getSaved();
  saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
  try { localStorage.setItem("savedSchemes", JSON.stringify(saved)); } catch (e) { /* ignore */ }
}

// ---------- Filtering ----------
// Filtering always uses the English data (ids/keys), so it works in any language.
function matches(s) {
  const type  = typeBox.value;
  const state = stateBox.value;
  const group = groupBox.value;

  const typeOK  = type === "all" || s.businessTypes.includes(type);
  const stateOK = s.states.includes("all") || s.states.includes(state);
  const groupOK = s.groups.includes("all") || s.groups.includes(group);
  return typeOK && stateOK && groupOK;
}

// ---------- Drawing the cards ----------
function stateLabel(s) {
  if (s.states.includes("all")) return t("state.all");
  return s.states.map(x => (x === "Maharashtra" ? t("state.mh") : x)).join(", ");
}

function card(raw) {
  const s = localized("schemes", raw.id, raw);        // Hindi/Marathi version if available
  const isSaved = getSaved().includes(s.id);
  return `
    <article class="card scheme-card" data-speak-scope>
      <span class="tag blue">${stateLabel(raw)}</span>
      <h3>${s.name}</h3>
      <p>${s.summary}</p>
      <dl>
        <dt>${t("scheme.who")}</dt><dd>${s.eligibility}</dd>
        <dt>${t("scheme.benefits")}</dt><dd>${s.benefits}</dd>
        <dt>${t("scheme.docs")}</dt><dd>${s.documents}</dd>
        <dt>${t("scheme.apply")}</dt><dd>${s.apply}</dd>
      </dl>
      <div class="card-actions">
        <button class="btn small ghost" data-speak>${t("voice.listen")}</button>
        <button class="btn small ghost" data-save="${s.id}">${isSaved ? t("btn.savedOn") : t("btn.save")}</button>
        <a class="btn small" href="${s.link}" target="_blank" rel="noopener">${t("btn.official")}</a>
      </div>
    </article>`;
}

function show(list, countKey) {
  countEl.textContent = list.length ? t(countKey, { n: list.length }) : "";
  results.innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="empty" style="grid-column:1/-1">${t("empty.schemes")}</div>`;
}

let mode = "search"; // "search" or "saved"

function render() {
  if (mode === "saved") {
    const saved = getSaved();
    show(schemes.filter(s => saved.includes(s.id)), "count.saved");
  } else {
    show(schemes.filter(matches), "count.found");
  }
  refreshButtons();   // (from voice.js) make sure the new Listen buttons show the right label
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

// Redraw the cards when the language changes.
window.addEventListener("langchange", render);

render(); // show everything when the page first loads
