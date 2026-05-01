/**
 * analytics.js — Google Analytics 4 (GA4) service layer.
 *
 * Uses the gtag.js script injected in index.html.
 * Measurement ID is read from VITE_GA_MEASUREMENT_ID env var.
 *
 * Usage:
 *   import analytics from '../services/analytics';
 *   analytics.pageView('/dashboard', 'Dashboard');
 *   analytics.event('vote_poll', { poll_id: '123', option: 'Yes' });
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Safe gtag caller — no-ops if gtag is not loaded (dev without GA)
const gtag = (...args) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  } else if (import.meta.env.DEV) {
    console.debug('[Analytics]', ...args);
  }
};

const analytics = {
  /**
   * Track a page view.
   * @param {string} path  - e.g. '/dashboard'
   * @param {string} title - e.g. 'Dashboard'
   */
  pageView(path, title) {
    gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      send_to: GA_ID,
    });
  },

  /**
   * Track a custom event.
   * @param {string} eventName - e.g. 'vote_poll'
   * @param {object} params    - extra dimensions
   */
  event(eventName, params = {}) {
    gtag('event', eventName, {
      send_to: GA_ID,
      ...params,
    });
  },

  // ── Convenience event helpers ──────────────────────────────────────────

  /** User clicked a navigation link */
  navClick: (destination) =>
    analytics.event('nav_click', { destination }),

  /** User voted in a poll */
  pollVote: (pollId, option) =>
    analytics.event('poll_vote', { poll_id: pollId, option }),

  /** User sent a message in forum */
  messageSent: (hasFile = false) =>
    analytics.event('message_sent', { has_file: hasFile }),

  /** User started a call */
  callInitiated: (callType) =>
    analytics.event('call_initiated', { call_type: callType }),

  /** User uploaded a file */
  fileUploaded: (fileType, fileSizeMB) =>
    analytics.event('file_uploaded', { file_type: fileType, file_size_mb: fileSizeMB }),

  /** User logged in */
  login: (role) =>
    analytics.event('login', { user_role: role }),

  /** User logged out */
  logout: () =>
    analytics.event('logout'),

  /** User clicked leaderboard member */
  leaderboardClick: (rank) =>
    analytics.event('leaderboard_click', { rank }),
};

export default analytics;
