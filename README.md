# GramFin
Digital financial awareness website for rural entrepreneurs (college project).
Available in **English, Hindi (हिंदी) and Marathi (मराठी)**, with a **🔊 Listen** (read-aloud) feature.

## Run locally
Open `index.html` in a browser (or use the VS Code "Live Server" extension).

## Files
- `index.html, learn.html, schemes.html, calculator.html, loans.html, fraud.html` – pages
- `css/style.css` – all styling (colours at the top in `:root`)
- `js/layout.js` – shared navbar, language buttons and footer
- `js/data.js` – schemes, loans, lessons, quiz, scams in English (edit content here)
- `js/ui-strings.js` – every interface text (buttons, headings) in EN / HI / MR
- `js/content-translations.js` – Hindi and Marathi versions of the content in data.js
- `js/i18n.js` – the language engine: t("key"), applyStatic(), localized(), setLang()
- `js/voice.js` – the 🔊 Listen feature (browser text-to-speech)
- `js/calculator.js, schemes.js, loans.js, learn.js, fraud.js` – page logic

## How languages work
1. A button/heading in HTML has `data-i18n="some.key"`; `i18n.js` fills it from `ui-strings.js`.
2. Dynamic content (schemes, loans, lessons, quiz, scams) is drawn by JS using `localized()`,
   which swaps in the Hindi/Marathi text from `content-translations.js`.
3. The chosen language is saved in the browser (localStorage), so it is remembered.

To add a scheme: copy a block in `data.js`, then add the same `id` in both `hi` and `mr`
sections of `content-translations.js`. Missing translations fall back to English.

## How voice works
Uses the browser's built-in `speechSynthesis` (free, no server). Needs a Hindi/Marathi voice on the
device; Android phones and Microsoft Edge usually have them. If a voice is missing, the site shows a message.

## Deploy
Connected to Vercel through GitHub: commit changes to the repo and Vercel redeploys automatically.

## Note
Scheme/loan details are for awareness only. Verify on official sites before submitting.
Have a Hindi/Marathi speaker proofread the translations.
