// learn.js — builds the lesson accordions and the quiz from data.js
// (shown in the chosen language via localized() and t()).

const topicsBox = document.getElementById("topics");
const quizBox   = document.getElementById("quiz");
const scoreEl   = document.getElementById("score");
let score = 0;
let answered = 0;

// ---------- Lessons ----------
// <details> / <summary> is plain HTML that opens and closes by itself. No JS needed for that!
function renderTopics() {
  topicsBox.innerHTML = topics.map((raw, i) => {
    const tp = localized("topics", i, raw);
    return `
    <details data-speak-scope>
      <summary>${tp.icon} ${tp.title}</summary>
      <div class="detail-body">
        <button class="btn small ghost" data-speak>${t("voice.listen")}</button>
        <p style="margin-top:10px">${tp.intro}</p>
        <ul>${tp.points.map(p => `<li>${p}</li>`).join("")}</ul>
      </div>
    </details>`;
  }).join("");
}

// ---------- Quiz ----------
function renderQuiz() {
  score = 0;
  answered = 0;
  scoreEl.textContent = "";
  quizBox.innerHTML = quiz.map((raw, qi) => {
    const item = localized("quiz", qi, raw);
    return `
    <div class="quiz-q" data-q="${qi}" data-speak-scope>
      <p>${qi + 1}. ${item.q}</p>
      ${item.options.map((o, oi) => `<button class="opt" data-o="${oi}">${o}</button>`).join("")}
      <small class="why" style="display:none;color:var(--muted)"></small>
      <div><button class="btn small ghost" data-speak>${t("voice.listen")}</button></div>
    </div>`;
  }).join("");
}

quizBox.addEventListener("click", e => {
  const btn = e.target.closest(".opt");
  if (!btn) return;

  const qBlock = btn.closest(".quiz-q");
  const qi = Number(qBlock.dataset.q);
  const item = localized("quiz", qi, quiz[qi]);
  const chosen = Number(btn.dataset.o);
  const correct = chosen === quiz[qi].answer;       // the answer position is the same in every language

  // Colour the right answer green, and the user's wrong choice red.
  qBlock.querySelectorAll(".opt").forEach((b, i) => {
    b.disabled = true;                              // lock this question
    if (i === quiz[qi].answer) b.classList.add("right");
  });
  if (!correct) btn.classList.add("wrong");
  else score++;

  const why = qBlock.querySelector(".why");
  why.textContent = (correct ? t("quiz.correct") : t("quiz.wrong")) + item.why;
  why.style.display = "block";

  answered++;
  if (answered === quiz.length) {
    scoreEl.textContent = t("quiz.score", { s: score, n: quiz.length }) + " " +
      (score === quiz.length ? t("quiz.perfect") : t("quiz.nice"));
  }
});

function renderAll() {
  renderTopics();
  renderQuiz();
  refreshButtons();   // (from voice.js)
}

window.addEventListener("langchange", renderAll);   // redraw in the new language
renderAll();
