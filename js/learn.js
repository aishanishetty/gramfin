// learn.js — builds the lesson accordions and the quiz from data.js

// ---------- Lessons ----------
// <details> / <summary> is plain HTML that opens and closes by itself. No JS needed for that!
document.getElementById("topics").innerHTML = topics.map(t => `
  <details>
    <summary>${t.icon} ${t.title}</summary>
    <div class="detail-body">
      <p>${t.intro}</p>
      <ul>${t.points.map(p => `<li>${p}</li>`).join("")}</ul>
    </div>
  </details>`).join("");

// ---------- Quiz ----------
const quizBox = document.getElementById("quiz");
const scoreEl = document.getElementById("score");
let score = 0;
let answered = 0;

quizBox.innerHTML = quiz.map((item, qi) => `
  <div class="quiz-q" data-q="${qi}">
    <p>${qi + 1}. ${item.q}</p>
    ${item.options.map((o, oi) => `<button class="opt" data-o="${oi}">${o}</button>`).join("")}
    <small class="why" style="display:none;color:var(--muted)"></small>
  </div>`).join("");

quizBox.addEventListener("click", e => {
  const btn = e.target.closest(".opt");
  if (!btn) return;

  const qBlock = btn.closest(".quiz-q");
  const item = quiz[Number(qBlock.dataset.q)];
  const chosen = Number(btn.dataset.o);

  // Colour the right answer green, and the user's wrong choice red.
  qBlock.querySelectorAll(".opt").forEach((b, i) => {
    b.disabled = true;                       // lock this question
    if (i === item.answer) b.classList.add("right");
  });
  if (chosen !== item.answer) btn.classList.add("wrong");
  else score++;

  const why = qBlock.querySelector(".why");
  why.textContent = (chosen === item.answer ? "✅ Correct! " : "❌ Not quite. ") + item.why;
  why.style.display = "block";

  answered++;
  if (answered === quiz.length) {
    scoreEl.textContent = `Your score: ${score} / ${quiz.length} ` + (score === quiz.length ? "🎉 Perfect!" : "👍 Nice effort!");
  }
});
