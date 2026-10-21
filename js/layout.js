// layout.js
// Builds the shared navbar and footer, then applies translations.
// Upgraded to include a Login link + user name / Logout button
// that show/hide based on auth state (managed by auth.js).

const pages = [
  { href: 'index.html',      key: 'nav.home'    },
  { href: 'learn.html',      key: 'nav.learn'   },
  { href: 'schemes.html',    key: 'nav.schemes' },
  { href: 'calculator.html', key: 'nav.calc'    },
  { href: 'loans.html',      key: 'nav.loans'   },
  { href: 'fraud.html',      key: 'nav.fraud'   },
];

const current = location.pathname.split('/').pop() || 'index.html';

const links = pages
  .map(p => `<li><a href="${p.href}" class="${p.href === current ? 'active' : ''}" data-i18n="${p.key}">${UI.en[p.key]}</a></li>`)
  .join('');

const langButtons = Object.entries(LANGS)
  .map(([code, l]) => `<button type="button" data-lang="${code}" lang="${code}">${l.name}</button>`)
  .join('');

// Auth controls: user label + logout (shown when logged in) / login link (shown when logged out)
const authControls = `
  <span class="nav-user-label" id="nav-user-label" style="display:none"></span>
  <li id="nav-login-li"><a href="login.html" id="nav-login-link" class="${'login.html' === current ? 'active' : ''}" style="display:none">🔐 Login</a></li>
  <li id="nav-logout-li"><button class="nav-logout-btn btn small ghost" id="nav-logout-btn" style="display:none">Logout</button></li>
`;

document.getElementById('site-header').innerHTML = `
  <div class="container nav">
    <a class="brand" href="index.html">Gram<span>Fin</span></a>
    <ul class="nav-links" id="nav-links">
      ${links}
      ${authControls}
    </ul>
    <div class="lang-switch" role="group" aria-label="Language">${langButtons}</div>
    <button class="menu-btn" id="menu-btn" aria-label="Menu">☰</button>
  </div>`;

document.getElementById('site-footer').innerHTML = `
  <div class="container">
    <p><strong>GramFin</strong></p>
    <p data-i18n="footer.line1">${UI.en['footer.line1']}</p>
    <p style="margin-top:8px" data-i18n="footer.disc">${UI.en['footer.disc']}</p>
  </div>`;

// Mobile menu toggle
document.getElementById('menu-btn').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});

// Language buttons
document.querySelectorAll('[data-lang]').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

// Logout button
document.getElementById('nav-logout-btn').addEventListener('click', async () => {
  if (window.GramfinAuth) {
    await window.GramfinAuth.signOut();
  }
  location.href = 'index.html';
});

// Translate static elements on the page
applyStatic();
updateLangButtons();

// Initialise auth and update the navbar auth state
// GramfinAuth is defined in auth.js which is loaded before layout.js on DB-enabled pages.
if (window.GramfinAuth) {
  window.GramfinAuth.init().then(() => {
    _updateNavbarAuth();

    // If user clicked an email confirmation or password reset link that landed on home
    const rawHash = window.location.hash ? window.location.hash.substring(1) : '';
    const hashParams = new URLSearchParams(rawHash);
    const searchParams = new URLSearchParams(window.location.search);
    const authType = hashParams.get('type') || searchParams.get('type');
    const hasError = hashParams.get('error') || hashParams.get('error_description') || searchParams.get('error_description');

    if ((authType === 'signup' || authType === 'email_change' || hasError) && !window.GramfinAuth.isLoggedIn() && !window.location.pathname.includes('login')) {
      window.location.href = 'login.html' + (window.location.search || '') + (window.location.hash || '');
    }
  });
  window.addEventListener('gramfin-auth-change', _updateNavbarAuth);
} else {
  // If GramfinAuth is not present, default to showing the login link
  const loginLink = document.getElementById('nav-login-link');
  if (loginLink) loginLink.style.display = '';
}

function _updateNavbarAuth() {
  const loginLink  = document.getElementById('nav-login-link');
  const logoutBtn  = document.getElementById('nav-logout-btn');
  const userLabel  = document.getElementById('nav-user-label');

  if (!loginLink) return;

  const loggedIn = window.GramfinAuth && window.GramfinAuth.isLoggedIn();

  if (loggedIn) {
    loginLink.style.display  = 'none';
    if (logoutBtn)  { logoutBtn.style.display  = ''; }
    if (userLabel)  { userLabel.style.display  = ''; userLabel.textContent = '👤 ' + window.GramfinAuth.getDisplayName(); }
  } else {
    loginLink.style.display  = '';
    if (logoutBtn)  logoutBtn.style.display  = 'none';
    if (userLabel)  { userLabel.style.display = 'none'; userLabel.textContent = ''; }
  }
}

// Re-run whenever auth state changes
window.addEventListener('gramfin-auth-change', _updateNavbarAuth);
