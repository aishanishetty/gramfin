// learn.js — Financial Literacy lessons + Quiz
//
// Upgraded to:
//   1. Fetch quiz questions from Supabase (with local data.js fallback)
//   2. Save quiz scores to Supabase on completion
//   3. Show score history for logged-in users
//   4. Display a save confirmation badge
//
// Lessons (topics) remain local (they don't need a DB).

const topicsBox = document.getElementById('topics');
const quizBox   = document.getElementById('quiz');
const scoreEl   = document.getElementById('score');
const scoreArea = document.getElementById('score-area');
const saveBadge = document.getElementById('save-badge');
const quizSpinner = document.getElementById('quiz-spinner');

let score    = 0;
let answered = 0;
let _questions = [];   // loaded asynchronously

// ---------- Lessons ----------
function renderTopics() {
  if (typeof topics === 'undefined') return;
  topicsBox.innerHTML = topics.map((raw, i) => {
    const tp = (typeof localized === 'function') ? localized('topics', i, raw) : raw;
    return `
    <details data-speak-scope>
      <summary>${tp.icon} ${tp.title}</summary>
      <div class="detail-body">
        <button class="btn small ghost" data-speak>${t('voice.listen')}</button>
        <p style="margin-top:10px">${tp.intro}</p>
        <ul>${tp.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    </details>`;
  }).join('');
}

// ---------- Quiz ----------
function renderQuiz() {
  score    = 0;
  answered = 0;
  scoreArea.hidden = true;
  saveBadge.hidden = true;

  if (!_questions.length) {
    quizBox.innerHTML = '<p style="color:var(--muted);padding:16px">No quiz questions available.</p>';
    return;
  }

  quizBox.innerHTML = _questions.map((raw, qi) => {
    const item = (typeof localized === 'function') ? localized('quiz', qi, raw) : raw;
    // Support both DB field names (q) and local field names (question)
    const questionText = item.q || item.question || '';
    const opts = Array.isArray(item.options) ? item.options : [];
    return `
    <div class="quiz-q" data-q="${qi}" data-speak-scope>
      <p>${qi + 1}. ${questionText}</p>
      ${opts.map((o, oi) => `<button class="opt" data-o="${oi}">${o}</button>`).join('')}
      <small class="why" style="display:none;color:var(--muted)"></small>
      <div><button class="btn small ghost" data-speak>${t('voice.listen')}</button></div>
    </div>`;
  }).join('');
}

quizBox.addEventListener('click', async e => {
  const btn = e.target.closest('.opt');
  if (!btn) return;

  const qBlock  = btn.closest('.quiz-q');
  const qi      = Number(qBlock.dataset.q);
  const item    = (typeof localized === 'function') ? localized('quiz', qi, _questions[qi]) : _questions[qi];
  const chosen  = Number(btn.dataset.o);
  // Support both answer_index (DB) and answer (local)
  const correctIdx = item.answer_index ?? item.answer ?? 0;
  const correct = chosen === correctIdx;

  // Mark answers
  qBlock.querySelectorAll('.opt').forEach((b, i) => {
    b.disabled = true;
    if (i === correctIdx) b.classList.add('right');
  });
  if (!correct) btn.classList.add('wrong');
  else score++;

  // Show explanation
  const why = qBlock.querySelector('.why');
  const whyText = item.why || item.explanation || '';
  why.textContent = (correct ? t('quiz.correct') : t('quiz.wrong')) + whyText;
  why.style.display = 'block';

  answered++;

  // All questions answered → show score and save
  if (answered === _questions.length) {
    const msg = t('quiz.score', { s: score, n: _questions.length }) + ' ' +
      (score === _questions.length ? t('quiz.perfect') : t('quiz.nice'));
    scoreEl.textContent = msg;
    scoreArea.hidden = false;

    // Save to database
    await handleScoreSave(score, _questions.length);

    // Show recent scores for logged-in users
    await showRecentScores();
  }
});

// ---------- Save score to DB ----------
async function handleScoreSave(sc, total) {
  if (!window.DbQuiz) return;

  const { success, error } = await window.DbQuiz.saveScore(sc, total);

  if (success) {
    const pct = Math.round((sc / total) * 100);
    const isLoggedIn = window.GramfinAuth?.isLoggedIn();
    document.getElementById('save-badge-title').textContent =
      isLoggedIn ? '🎉 Score saved to your account!' : '🎉 Score saved!';
    document.getElementById('save-badge-msg').textContent =
      `You got ${sc} out of ${total} (${pct}%).` +
      (isLoggedIn ? ' Your history is tracked below.' : ' Sign in to track your history across visits.');
    saveBadge.hidden = false;
  } else {
    console.warn('[learn] Score save failed:', error);
    // Non-fatal — the quiz still works
  }
}

// ---------- Recent scores ----------
async function showRecentScores() {
  if (!window.DbQuiz || !window.GramfinAuth?.isLoggedIn()) return;

  const scores = await window.DbQuiz.fetchRecentScores();
  if (!scores.length) return;

  const wrap   = document.getElementById('recent-scores-wrap');
  const target = document.getElementById('recent-scores');

  target.innerHTML = scores.map(row => {
    const pct  = Math.round((row.score / row.total) * 100);
    const date = new Date(row.taken_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--warn)' : 'var(--danger)';
    return `<div class="score-history-row">
      <span class="score-history-date">${date}</span>
      <span class="score-history-val" style="color:${color}">${row.score}/${row.total} (${pct}%)</span>
    </div>`;
  }).join('');

  wrap.hidden = false;
}

// ---------- Initialise (async) ----------
async function init() {
  // Lessons don't need DB
  renderTopics();

  // Initialise auth
  await window.GramfinAuth.init();

  // Load quiz questions (DB or local fallback)
  quizSpinner.hidden = false;
  quizBox.innerHTML  = '';

  try {
    if (window.DbQuiz) {
      const { questions, source } = await window.DbQuiz.fetchQuestions();
      _questions = questions;
      console.log(`[learn] Loaded ${questions.length} questions from ${source}`);
    } else if (typeof quiz !== 'undefined') {
      _questions = quiz;
    }
  } catch (err) {
    console.error('[learn] Failed to load questions:', err);
    _questions = (typeof quiz !== 'undefined') ? quiz : [];
  } finally {
    quizSpinner.hidden = true;
  }

  renderQuiz();
  if (typeof refreshButtons === 'function') refreshButtons();
}

function renderAll() {
  renderTopics();
  renderQuiz();
  if (typeof refreshButtons === 'function') refreshButtons();
}

window.addEventListener('langchange', renderAll);
init();
