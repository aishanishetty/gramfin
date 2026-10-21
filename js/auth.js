// ============================================================
// js/auth.js
// Handles user authentication: sign-up, sign-in, sign-out,
// session tracking, and updating the navbar.
//
// Exposes window.GramfinAuth (an object with methods).
// ============================================================

(function () {
  'use strict';

  const db = () => window.gramfinDB;  // lazy getter — may be null if DB not connected

  // ---------- Internal state ----------
  let _session = null;
  let _initPromise = null;

  // ---------- Public API ----------
  const GramfinAuth = {

    /**
     * Initialise: restore any existing session from localStorage.
     * Should be called once on every page that loads auth.js.
     * Returns the current user, or null.
     */
    async init() {
      if (!db()) return null;
      if (_initPromise) return _initPromise;

      _initPromise = (async () => {
        try {
          // If a PKCE 'code' query param is in the URL, exchange it for a session
          if (typeof window !== 'undefined' && window.location.search) {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            if (code && typeof db().auth.exchangeCodeForSession === 'function') {
              try {
                const { data } = await db().auth.exchangeCodeForSession(code);
                if (data?.session) {
                  _session = data.session;
                }
              } catch (exchangeErr) {
                console.warn('[Auth] Code exchange note:', exchangeErr.message);
              }
            }
          }

          const { data } = await db().auth.getSession();
          _session = data?.session || _session;

          // Listen for auth state changes (login / logout / token refresh)
          db().auth.onAuthStateChange((event, session) => {
            _session = session;
            GramfinAuth._updateNavbar();
            if (session?.user) {
              db().from('user_profiles').upsert({
                id: session.user.id,
                display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0]
              }).then(() => {}).catch(() => {});
            }
            // Notify other scripts that auth state changed
            window.dispatchEvent(new CustomEvent('gramfin-auth-change', { detail: { event, session } }));
          });

          GramfinAuth._updateNavbar();
          return _session?.user || null;
        } catch (err) {
          console.error('[Auth] Failed to restore session:', err);
          return null;
        }
      })();

      return _initPromise;
    },

    /**
     * Sign up a new user with email + password.
     * @param {string} email
     * @param {string} password
     * @param {string} displayName
     * @returns {object} Supabase auth data
     */
    async signUp(email, password, displayName) {
      if (!db()) throw new Error('Database not connected');
      const origin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'https://gramfin.vercel.app';
      const redirectUrl = origin.includes('localhost')
        ? `${origin}/login.html`
        : 'https://gramfin.vercel.app/login';

      const { data, error } = await db().auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { display_name: displayName || email.split('@')[0] }
        }
      });
      if (error) throw error;
      // Create user_profiles row only if session exists
      if (data.user && data.session) {
        try {
          await db().from('user_profiles').upsert({
            id: data.user.id,
            display_name: displayName || email.split('@')[0]
          });
        } catch (_) {}
      }
      return data;
    },

    /**
     * Sign in an existing user.
     * @param {string} email
     * @param {string} password
     * @returns {object} Supabase auth data
     */
    async signIn(email, password) {
      if (!db()) throw new Error('Database not connected');
      const { data, error } = await db().auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },

    /**
     * Sign out the current user.
     */
    async signOut() {
      if (!db()) return;
      await db().auth.signOut();
      _session = null;
    },

    /** Returns the current session (or null if not logged in). */
    getSession()    { return _session; },

    /** Returns the current user object (or null). */
    getUser()       { return _session?.user || null; },

    /** Returns the current user's UUID (or null). */
    getUserId()     { return _session?.user?.id || null; },

    /** Returns a human-readable display name for the current user. */
    getDisplayName() {
      return _session?.user?.user_metadata?.display_name
        || _session?.user?.email?.split('@')[0]
        || 'User';
    },

    /** True if a user is currently logged in. */
    isLoggedIn()    { return !!_session?.user; },

    // ---------- Navbar update ----------
    _updateNavbar() {
      const loginLink  = document.getElementById('nav-login-link');
      const logoutBtn  = document.getElementById('nav-logout-btn');
      const userLabel  = document.getElementById('nav-user-label');

      if (!loginLink) return;   // navbar not yet rendered on this page

      if (GramfinAuth.isLoggedIn()) {
        loginLink.style.display  = 'none';
        if (logoutBtn)  logoutBtn.style.display  = 'inline-flex';
        if (userLabel)  {
          userLabel.style.display = '';
          userLabel.textContent   = '👤 ' + GramfinAuth.getDisplayName();
        }
      } else {
        loginLink.style.display  = '';
        if (logoutBtn)  logoutBtn.style.display  = 'none';
        if (userLabel)  {
          userLabel.style.display = 'none';
          userLabel.textContent   = '';
        }
      }
    }
  };

  window.GramfinAuth = GramfinAuth;
})();
