// ============================================================
// js/db-quiz.js
// Database layer for the Financial Literacy Quiz.
//
// Responsibilities:
//   1. Fetch quiz questions from Supabase (falls back to data.js)
//   2. Save quiz scores for logged-in users (or with a session ID for guests)
//   3. Retrieve recent scores so they can be displayed on the page
// ============================================================

(function () {
  'use strict';

  const db = () => window.gramfinDB;

  // A random ID to identify anonymous quiz sessions within one browser visit
  let _sessionId = null;
  function getSessionId() {
    if (!_sessionId) {
      _sessionId = 'anon-' + Math.random().toString(36).slice(2, 10);
    }
    return _sessionId;
  }

  // -------- Fetch Questions --------
  /**
   * Load quiz questions from Supabase.
   * Falls back to the local `quiz` array from data.js.
   *
   * Returns an array of objects:
   *   { id, question (or q), options, answer_index (or answer), explanation (or why) }
   *
   * Both naming conventions are supported so learn.js works with
   * either DB data or local fallback data.
   *
   * @returns {Promise<{questions: Array, source: 'db'|'local'}>}
   */
  async function fetchQuestions() {
    if (db()) {
      try {
        const { data, error } = await db()
          .from('quiz_questions')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          // Normalise DB fields to match what learn.js expects:
          // DB has: question, options (jsonb), answer_index, explanation
          // learn.js expects: q, options, answer, why
          const normalised = data.map(row => ({
            id:          row.id,
            q:           row.question,
            options:     Array.isArray(row.options) ? row.options : JSON.parse(row.options),
            answer:      row.answer_index,
            why:         row.explanation || '',
            // Also keep original keys for compatibility
            question:    row.question,
            answer_index: row.answer_index,
            explanation: row.explanation
          }));
          return { questions: normalised, source: 'db' };
        }
      } catch (err) {
        console.error('[db-quiz] Failed to fetch questions, using local data:', err.message);
      }
    }

    // Local fallback
    if (typeof quiz !== 'undefined') {
      return { questions: quiz, source: 'local' };
    }
    return { questions: [], source: 'local' };
  }

  // -------- Save Score --------
  /**
   * Save a quiz score to Supabase.
   * Works for both logged-in users and anonymous guests.
   *
   * @param {number} score   — number of correct answers
   * @param {number} total   — total questions
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async function saveScore(score, total) {
    if (!db()) {
      return { success: false, error: 'Database not connected' };
    }

    try {
      const isLoggedIn = window.GramfinAuth?.isLoggedIn();
      const row = isLoggedIn
        ? { user_id: window.GramfinAuth.getUserId(), score, total }
        : { session_id: getSessionId(), score, total };

      const { error } = await db().from('quiz_scores').insert(row);
      if (error) throw error;

      return { success: true, error: null };
    } catch (err) {
      console.error('[db-quiz] Failed to save score:', err.message);
      return { success: false, error: err.message };
    }
  }

  // -------- Fetch Recent Scores --------
  /**
   * Get the last 5 quiz scores for the current user.
   * Returns an empty array for guests or if DB is unavailable.
   *
   * @returns {Promise<Array>}
   */
  async function fetchRecentScores() {
    if (!db() || !window.GramfinAuth?.isLoggedIn()) return [];
    try {
      const { data, error } = await db()
        .from('quiz_scores')
        .select('score, total, taken_at')
        .eq('user_id', window.GramfinAuth.getUserId())
        .order('taken_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[db-quiz] Failed to fetch recent scores:', err.message);
      return [];
    }
  }

  // Expose module
  window.DbQuiz = { fetchQuestions, saveScore, fetchRecentScores };
})();
