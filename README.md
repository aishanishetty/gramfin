# GramFin
Digital financial awareness website for rural entrepreneurs (college project).

## Run locally
Open `index.html` in a browser (or use the VS Code "Live Server" extension).

## Files
- `index.html, learn.html, schemes.html, calculator.html, loans.html, fraud.html` – pages
- `css/style.css` – all styling (colours at the top in `:root`)
- `js/layout.js` – shared navbar + footer
- `js/data.js` – schemes, loans, lessons, quiz, scams (edit content here)
- `js/calculator.js, schemes.js, loans.js, learn.js` – page logic

## Deploy (Netlify, ~5 minutes)
1. Go to app.netlify.com and sign up (free).
2. "Add new site" -> "Deploy manually" -> drag the whole `gramfin` folder in.
3. You get a live link like https://random-name.netlify.app. Rename it in Site settings.

## Deploy (GitHub + Vercel)
1. Create a GitHub repo, upload the folder (or `git init`, `git add .`, `git commit`, `git push`).
2. On vercel.com: "Add New Project" -> import the repo -> Deploy (no build settings needed).

## Note
Scheme/loan details are for awareness. Verify on official sites before submitting.
