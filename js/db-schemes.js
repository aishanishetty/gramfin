// ============================================================
// js/db-schemes.js
// Database layer for the Government Scheme Finder.
//
// Responsibilities:
//   1. Fetch schemes from Supabase (with type / state / group filters)
//   2. Fall back to local data.js arrays if the DB is unavailable
//   3. Save / unsave schemes for logged-in users (syncs to DB)
//   4. Expose a loading state so schemes.js can show a spinner
// ============================================================

(function () {
  'use strict';

  const db = () => window.gramfinDB;

  // -------- Fetch schemes with filters --------
  /**
   * Fetch schemes from Supabase matching the given filters.
   * Falls back to the local `schemes` array from data.js if DB is unavailable.
   *
   * @param {string} type  — business type value (e.g. 'shop', 'all')
   * @param {string} state — state value (e.g. 'Maharashtra', 'all')
   * @param {string} group — special category (e.g. 'women', 'all')
   * @param {string} keyword — optional free-text search
   * @returns {Promise<{data: Array, source: 'db'|'local', error: string|null}>}
   */
  async function fetchSchemes({ type = 'all', state = 'all', group = 'all', keyword = '' } = {}) {
    // ---- Try the database first ----
    if (db()) {
      try {
        let query = db().from('schemes').select('*');

        // Postgres array operators: 'all' always matches because every scheme includes 'all' in its arrays
        if (type !== 'all') {
          query = query.or(`business_types.cs.{"all"},business_types.cs.{"${type}"}`);
        }
        if (state !== 'all') {
          query = query.or(`states.cs.{"all"},states.cs.{"${state}"}`);
        }
        if (group !== 'all') {
          query = query.or(`groups.cs.{"all"},groups.cs.{"${group}"}`);
        }

        // Free-text keyword search across name and summary
        if (keyword.trim()) {
          const kw = keyword.trim().toLowerCase();
          query = query.or(`name.ilike.%${kw}%,summary.ilike.%${kw}%,eligibility.ilike.%${kw}%`);
        }

        query = query.order('name');
        const { data, error } = await query;

        if (error) throw error;
        return { data: data || [], source: 'db', error: null };

      } catch (err) {
        console.error('[db-schemes] DB error, falling back to local data:', err.message);
        // Fall through to local data below
      }
    }

    // ---- Local fallback (data.js) ----
    if (typeof schemes === 'undefined') {
      return { data: [], source: 'local', error: 'No scheme data available.' };
    }

    const kw = keyword.trim().toLowerCase();
    const filtered = schemes.filter(s => {
      const typeOK  = type  === 'all' || s.businessTypes?.includes(type)  || s.business_types?.includes(type);
      const stateOK = state === 'all' || s.states?.includes('all') || s.states?.includes(state);
      const groupOK = group === 'all' || s.groups?.includes('all') || s.groups?.includes(group);
      const kwOK    = !kw   || s.name.toLowerCase().includes(kw) || s.summary.toLowerCase().includes(kw);
      return typeOK && stateOK && groupOK && kwOK;
    });

    return { data: filtered, source: 'local', error: null };
  }

  // -------- Saved schemes (DB-backed for logged-in users) --------

  /**
   * Load saved scheme IDs for the current user from the DB.
   * Falls back to localStorage for guests.
   * @returns {Promise<string[]>}
   */
  async function loadSavedIds() {
    if (db() && window.GramfinAuth?.isLoggedIn()) {
      try {
        const { data, error } = await db()
          .from('saved_schemes')
          .select('scheme_id')
          .eq('user_id', window.GramfinAuth.getUserId());
        if (error) throw error;
        return (data || []).map(r => r.scheme_id);
      } catch (err) {
        console.error('[db-schemes] Failed to load saved schemes:', err.message);
      }
    }
    // Guest: localStorage
    try {
      return JSON.parse(localStorage.getItem('savedSchemes')) || [];
    } catch { return []; }
  }

  /**
   * Toggle the saved state of a scheme.
   * For logged-in users: insert/delete in Supabase.
   * For guests: toggle in localStorage.
   *
   * @param {string} schemeId
   * @param {boolean} isSaved — current saved state (true = currently saved → will unsave)
   * @returns {Promise<boolean>} — new saved state
   */
  async function toggleSaved(schemeId, isSaved) {
    if (db() && window.GramfinAuth?.isLoggedIn()) {
      try {
        const userId = window.GramfinAuth.getUserId();
        if (isSaved) {
          // Unsave
          const { error } = await db()
            .from('saved_schemes')
            .delete()
            .eq('user_id', userId)
            .eq('scheme_id', schemeId);
          if (error) throw error;
          return false;
        } else {
          // Save
          const { error } = await db()
            .from('saved_schemes')
            .insert({ user_id: userId, scheme_id: schemeId });
          if (error) throw error;
          return true;
        }
      } catch (err) {
        console.error('[db-schemes] Toggle save failed:', err.message);
      }
    }

    // Guest fallback: localStorage
    try {
      let saved = JSON.parse(localStorage.getItem('savedSchemes')) || [];
      if (isSaved) {
        saved = saved.filter(id => id !== schemeId);
      } else {
        saved = [...new Set([...saved, schemeId])];
      }
      localStorage.setItem('savedSchemes', JSON.stringify(saved));
      return !isSaved;
    } catch { return !isSaved; }
  }

  /**
   * Fetch ALL saved schemes (full objects) for the current user.
   * @returns {Promise<{data: Array, source: 'db'|'local'}>}
   */
  async function fetchSavedSchemes() {
    if (db() && window.GramfinAuth?.isLoggedIn()) {
      try {
        const userId = window.GramfinAuth.getUserId();
        const { data, error } = await db()
          .from('saved_schemes')
          .select('scheme_id, schemes(*)')
          .eq('user_id', userId);
        if (error) throw error;
        return { data: (data || []).map(r => r.schemes), source: 'db' };
      } catch (err) {
        console.error('[db-schemes] Failed to load saved scheme details:', err.message);
      }
    }

    // Guest: filter local schemes array by localStorage IDs
    const ids = (() => {
      try { return JSON.parse(localStorage.getItem('savedSchemes')) || []; }
      catch { return []; }
    })();
    if (typeof schemes !== 'undefined') {
      return { data: schemes.filter(s => ids.includes(s.id)), source: 'local' };
    }
    return { data: [], source: 'local' };
  }

  // Expose module
  window.DbSchemes = { fetchSchemes, loadSavedIds, toggleSaved, fetchSavedSchemes };
})();
