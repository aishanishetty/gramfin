// fraud.js — builds the scam cards from the `scams` array in data.js
// (in the chosen language).

function renderScams() {
  document.getElementById("scams").innerHTML = scams.map((raw, i) => {
    const s = localized("scams", i, raw);
    return `
      <div class="card" data-speak-scope>
        <span class="icon">${s.icon}</span>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
        <p style="margin-top:10px;color:var(--green-dark)"><strong>${t("fraud.todo")}</strong> ${s.tip}</p>
        <div class="card-actions"><button class="btn small ghost" data-speak>${t("voice.listen")}</button></div>
      </div>`;
  }).join("");
  refreshButtons();   // (from voice.js)
}

window.addEventListener("langchange", renderScams);
renderScams();
