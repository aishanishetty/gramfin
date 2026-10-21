// schemes.js — Government Scheme Finder
//
// Upgraded to use Supabase via db-schemes.js.
// Falls back to local data.js arrays if the DB is unavailable.
// Also supports keyword search (new text input in schemes.html).
//
// Save / unsave is now DB-backed for logged-in users,
// localStorage-backed for guests (same as before).

const typeBox    = document.getElementById('f-type');
const stateBox   = document.getElementById('f-state');
const groupBox   = document.getElementById('f-group');
const keywordBox = document.getElementById('f-keyword');
const results    = document.getElementById('results');
const countEl    = document.getElementById('count');

// Loading UI helpers
const statusArea = document.getElementById('schemes-status');
const spinner    = document.getElementById('schemes-spinner');
const sourceBadge= document.getElementById('schemes-source');

function showSpinner(visible) {
  statusArea.hidden = false;
  spinner.hidden    = !visible;
}
function setSourceBadge(source) {
  if (source === 'db') {
    sourceBadge.textContent = '✅ Loaded from live database';
    sourceBadge.className   = 'db-source-badge db-source-live';
    sourceBadge.hidden      = false;
  } else if (source === 'local') {
    sourceBadge.textContent = '📄 Using local data (database not connected)';
    sourceBadge.className   = 'db-source-badge db-source-local';
    sourceBadge.hidden      = false;
  } else {
    sourceBadge.hidden      = true;
  }
}

// ---------- Saved schemes ----------
let _savedIds = [];

async function refreshSaved() {
  _savedIds = await window.DbSchemes.loadSavedIds();
}

// ---------- Drawing the cards ----------
function stateLabel(s) {
  // s.states or s.state — handle both DB (states array) and local data
  const arr = s.states || [];
  if (arr.includes('all')) return t('state.all');
  return arr.map(x => (x === 'Maharashtra' ? t('state.mh') : x)).join(', ');
}

function card(raw) {
  // Localise (Hindi/Marathi) if available — uses content-translations.js
  const s = (typeof localized === 'function') ? localized('schemes', raw.id, raw) : raw;
  const isSaved = _savedIds.includes(s.id);
  return `
    <article class="card scheme-card" data-speak-scope>
      <span class="tag blue">${stateLabel(raw)}</span>
      <h3>${s.name}</h3>
      <p>${s.summary}</p>
      <dl>
        <dt>${t('scheme.who')}</dt><dd>${s.eligibility}</dd>
        <dt>${t('scheme.benefits')}</dt><dd>${s.benefits}</dd>
        <dt>${t('scheme.docs')}</dt><dd>${s.documents}</dd>
        <dt>${t('scheme.apply')}</dt><dd>${s.apply}</dd>
      </dl>
      <div class="card-actions">
        <button class="btn small ghost" data-speak>${t('voice.listen')}</button>
        <button class="btn small ghost" data-save="${s.id}" data-saved="${isSaved}">
          ${isSaved ? t('btn.savedOn') : t('btn.save')}
        </button>
        <a class="btn small" href="${s.link}" target="_blank" rel="noopener">${t('btn.official')}</a>
      </div>
    </article>`;
}

function show(list, countKey) {
  countEl.textContent = list.length ? t(countKey, { n: list.length }) : '';
  results.innerHTML = list.length
    ? list.map(card).join('')
    : `<div class="empty" style="grid-column:1/-1">${t('empty.schemes')}</div>`;
  if (typeof refreshButtons === 'function') refreshButtons();
}

// ---------- Main render ----------
let mode = 'search';  // 'search' or 'saved'

async function render() {
  showSpinner(true);

  try {
    if (mode === 'saved') {
      const { data, source } = await window.DbSchemes.fetchSavedSchemes();
      await refreshSaved();
      show(data, 'count.saved');
      setSourceBadge(source);
    } else {
      const filters = {
        type:    typeBox.value,
        state:   stateBox.value,
        group:   groupBox.value,
        keyword: keywordBox ? keywordBox.value : ''
      };
      const { data, source } = await window.DbSchemes.fetchSchemes(filters);
      await refreshSaved();
      show(data, 'count.found');
      setSourceBadge(source);
    }
  } catch (err) {
    console.error('[schemes] Render error:', err);
    results.innerHTML = `<div class="empty" style="grid-column:1/-1">
      ⚠️ Something went wrong. Please refresh the page.
    </div>`;
  } finally {
    showSpinner(false);
  }
}

// ---------- Events ----------
document.getElementById('btn-search').addEventListener('click', () => { mode = 'search'; render(); });
document.getElementById('btn-saved').addEventListener('click',  () => { mode = 'saved';  render(); });
[typeBox, stateBox, groupBox].forEach(b => b.addEventListener('change', () => { mode = 'search'; render(); }));

// Keyword search: debounced so we don't query on every keystroke
let kwTimer;
if (keywordBox) {
  keywordBox.addEventListener('input', () => {
    clearTimeout(kwTimer);
    kwTimer = setTimeout(() => { mode = 'search'; render(); }, 350);
  });
}

// Save/unsave via event delegation
results.addEventListener('click', async e => {
  const btn = e.target.closest('[data-save]');
  if (!btn) return;

  const schemeId  = btn.dataset.save;
  const wasSaved  = btn.dataset.saved === 'true';

  btn.disabled = true;
  const newSaved = await window.DbSchemes.toggleSaved(schemeId, wasSaved);
  btn.dataset.saved = newSaved;
  btn.textContent   = newSaved ? t('btn.savedOn') : t('btn.save');
  btn.disabled = false;

  // Refresh full saved list so count is correct
  _savedIds = await window.DbSchemes.loadSavedIds();
});

// Redraw in new language
window.addEventListener('langchange', () => render());

// Redraw when auth state changes (saved schemes may now be DB-backed)
window.addEventListener('gramfin-auth-change', () => render());

// Initialise
(async () => {
  await window.GramfinAuth.init();
  render();
})();
