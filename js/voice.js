// voice.js — "Listen" (read aloud) feature
// Uses the browser's built-in text-to-speech (speechSynthesis). No server, no cost.
//
// How it works:
//   1. Any button with  data-speak  reads the nearest parent that has  data-speak-scope
//      (e.g. one scheme card). The big floating button reads the whole page.
//   2. textOf() collects the visible text of that part of the page.
//   3. cleanText() tidies it for speech (e.g. "₹5 lakh" -> "5 lakh rupees").
//   4. The text is split into short sentence chunks and spoken one after another
//      in the current language (English / Hindi / Marathi).
//
// NOTE: the voice must exist on the user's device. Android phones usually have Hindi
// and Marathi voices; on a laptop it depends on the browser/OS (Edge is usually good).

const synth = window.speechSynthesis;
let speakToken = 0;      // changes every time we start/stop, so old speech chains stop themselves
let activeBtn = null;    // the button that is currently "playing"

// ---------- 1. Floating "Listen to this page" button + message box ----------
const fab = document.createElement("button");
fab.type = "button";
fab.id = "voice-fab";
fab.className = "voice-fab";
fab.setAttribute("data-speak", "");
fab.setAttribute("data-no-speak", "");
document.body.appendChild(fab);

const toastBox = document.createElement("div");
toastBox.className = "voice-toast";
toastBox.setAttribute("data-no-speak", "");
toastBox.setAttribute("role", "status");
toastBox.hidden = true;
document.body.appendChild(toastBox);

let toastTimer;
function toast(message) {
  toastBox.textContent = message;
  toastBox.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastBox.hidden = true; }, 7000);
}

// ---------- 2. Get the text to read ----------
// Walk through the page elements and collect text, skipping things that shouldn't be read
// (menus, form controls, hidden items). Quiz options (button.opt) ARE read.
const SKIP_TAGS = ["SCRIPT", "STYLE", "SELECT", "INPUT", "OPTION", "HEADER", "FOOTER", "NAV"];
const PAUSE_AFTER = ["P", "H1", "H2", "H3", "LI", "DT", "DD", "TR", "DIV", "SUMMARY", "ARTICLE", "SECTION", "BUTTON", "TD", "TH"];

function textOf(root) {
  let out = "";
  (function walk(node) {
    if (node.nodeType === 3) { out += node.textContent; return; }          // plain text
    if (node.nodeType !== 1) return;
    if (SKIP_TAGS.includes(node.tagName)) return;
    if (node.hasAttribute("data-no-speak")) return;
    if (node.tagName === "BUTTON" && !node.classList.contains("opt")) return; // skip buttons except quiz options
    if (getComputedStyle(node).display === "none") return;                  // skip hidden things
    node.childNodes.forEach(walk);
    if (PAUSE_AFTER.includes(node.tagName)) out += ". ";
  })(root);
  return out;
}

function cleanText(raw) {
  const rupees = t("voice.rupees");
  return raw
    // "₹5 lakh" -> "5 lakh rupees",  "₹50,000" -> "50,000 rupees"
    .replace(/₹\s*([\d,.]+)(\s*(?:lakh|crore|लाख|कोटी|करोड़))?/gi, (m, num, unit) => `${num}${unit || ""} ${rupees}`)
    .replace(/(?<=\d),(?=\d)/g, "")                                          // 1,00,000 -> 100000
    .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, " ") // emojis & symbols
    .replace(/[·|]/g, ", ")
    .replace(/(\s*[.।]\s*){2,}/g, ". ")                                      // ". . ." -> "."
    .replace(/\s+/g, " ")
    .trim();
}

// Browsers can cut off very long speech, so we split it into short pieces.
function chunkText(text) {
  const sentences = text.split(/(?<=[.!?।])\s+/);
  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if ((current + " " + s).length > 180 && current) { chunks.push(current); current = s; }
    else current = current ? current + " " + s : s;
  }
  if (current) chunks.push(current);
  return chunks;
}

// ---------- 3. Pick a voice ----------
// Voices load a moment after the page opens, so we wait for them (max 1.5 seconds).
function getVoicesReady() {
  return new Promise(resolve => {
    const now = synth.getVoices();
    if (now.length) return resolve(now);
    const done = () => { synth.removeEventListener("voiceschanged", done); resolve(synth.getVoices()); };
    synth.addEventListener("voiceschanged", done);
    setTimeout(() => resolve(synth.getVoices()), 1500);
  });
}

function pickVoice(voices, code) {
  const wanted = code.toLowerCase();                 // e.g. "hi-in"
  const lang = wanted.split("-")[0];                 // e.g. "hi"
  const norm = v => v.lang.replace("_", "-").toLowerCase();
  return voices.find(v => norm(v) === wanted) || voices.find(v => norm(v).startsWith(lang));
}

// ---------- 4. Start / stop ----------
function refreshButtons() {
  document.querySelectorAll("[data-speak]").forEach(btn => {
    const playing = btn === activeBtn;
    btn.classList.toggle("playing", playing);
    if (playing) btn.textContent = t("voice.stop");
    else btn.textContent = btn.id === "voice-fab" ? t("voice.listenPage") : t("voice.listen");
  });
}

function stopSpeaking() {
  speakToken++;
  if (synth) synth.cancel();
  activeBtn = null;
  refreshButtons();
}

async function startSpeaking(scope, btn) {
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") { toast(t("voice.unsupported")); return; }
  stopSpeaking();
  const myToken = ++speakToken;
  const code = LANGS[currentLang].speech;

  const voices = await getVoicesReady();
  if (myToken !== speakToken) return;                // user pressed something else meanwhile
  const voice = pickVoice(voices, code);
  if (!voice && currentLang !== "en") {              // no Hindi/Marathi voice on this device
    toast(t("voice.noVoice", { lang: t("lang.name") }));
    return;
  }

  const chunks = chunkText(cleanText(textOf(scope)));
  if (!chunks.length) return;

  activeBtn = btn;
  refreshButtons();

  let i = 0;
  const next = () => {
    if (myToken !== speakToken) return;              // stopped
    if (i >= chunks.length) { activeBtn = null; refreshButtons(); return; }
    const u = new SpeechSynthesisUtterance(chunks[i++]);
    u.lang = code;
    if (voice) u.voice = voice;
    u.rate = 0.9;                                    // slightly slower = easier to follow
    u.onend = next;
    u.onerror = () => { if (myToken === speakToken) { activeBtn = null; refreshButtons(); } };
    window.__utterance = u;                          // keep a reference (some browsers drop it otherwise)
    synth.speak(u);
  };
  next();
}

// One click listener handles every Listen button (even ones created later).
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-speak]");
  if (!btn) return;
  if (btn === activeBtn) { stopSpeaking(); return; }  // pressing the playing button stops it
  const scope = btn.closest("[data-speak-scope]") || document.body;
  startSpeaking(scope, btn);
});

// When the language changes: stop talking and relabel the buttons.
window.addEventListener("langchange", () => stopSpeaking());
window.addEventListener("pagehide", () => { if (synth) synth.cancel(); });

refreshButtons();
