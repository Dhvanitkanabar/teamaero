/**
 * storage.js — Vanguard AERO Storage Utility
 *
 * Provides type-safe, fallback-aware wrappers for localStorage and
 * sessionStorage. All keys are namespaced under `STORAGE_KEYS` to
 * prevent collisions and make auditing easy.
 *
 * localStorage  → persistent data (survives tab close / browser restart)
 * sessionStorage → ephemeral data (cleared when the tab/window is closed)
 *
 * NOTE: Sensitive values (passwords) are NEVER stored; only auth tokens
 *       and non-critical preferences flow through these helpers.
 */

// ─── Key Constants ───────────────────────────────────────────────────────────

/**
 * Namespaced keys for localStorage (persistent across sessions).
 */
export const LOCAL_KEYS = {
  /** Serialised auth state: { user, isAuthenticated, role } */
  AUTH: 'vanguard_auth',
  /** JWT / session token */
  AUTH_TOKEN: 'vanguard_token',
  /** "Remember me" username (NOT password) */
  REMEMBERED_USER_ID: 'vanguard_userId',
  /** UI theme preference: 'dark' | 'light' | 'system' */
  THEME: 'vanguard_theme',
  /** User-level preferences object */
  USER_PREFS: 'vanguard_prefs',
};

/**
 * Namespaced keys for sessionStorage (ephemeral — cleared on tab close).
 */
export const SESSION_KEYS = {
  /** Multi-step form progress { step, data } */
  FORM_PROGRESS: 'vanguard_form_progress',
  /** Temporary search / filter state */
  SEARCH_STATE: 'vanguard_search_state',
  /** Temporary poll filter state */
  POLL_FILTERS: 'vanguard_poll_filters',
  /** Calendar view preference (month | week | list) for current session */
  CALENDAR_VIEW: 'vanguard_calendar_view',
};

// ─── Storage Availability ────────────────────────────────────────────────────

/**
 * Returns true if the given Web Storage type is available.
 * Catches the SecurityError thrown in private / restricted contexts.
 * @param {'localStorage'|'sessionStorage'} type
 */
const isAvailable = (type) => {
  try {
    const storage = window[type];
    const testKey = '__vanguard_storage_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const localAvailable = isAvailable('localStorage');
const sessionAvailable = isAvailable('sessionStorage');

// ─── Generic Helpers ─────────────────────────────────────────────────────────

/**
 * Reads & JSON-parses a value from the given storage object.
 * Returns `fallback` if the key is missing or parsing fails.
 */
const readFrom = (storage, available, key, fallback = null) => {
  if (!available) return fallback;
  try {
    const raw = storage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    console.warn(`[storage] Failed to read key "${key}".`);
    return fallback;
  }
};

/**
 * JSON-serialises `value` and writes it to the given storage object.
 * Silently no-ops when storage is unavailable.
 */
const writeTo = (storage, available, key, value) => {
  if (!available) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] Failed to write key "${key}":`, err);
  }
};

/**
 * Removes a single key from the given storage object.
 */
const removeFrom = (storage, available, key) => {
  if (!available) return;
  try {
    storage.removeItem(key);
  } catch (err) {
    console.warn(`[storage] Failed to remove key "${key}":`, err);
  }
};

// ─── localStorage API ────────────────────────────────────────────────────────

export const local = {
  /** @param {string} key @param {*} fallback */
  get: (key, fallback = null) =>
    readFrom(localStorage, localAvailable, key, fallback),

  /** @param {string} key @param {*} value */
  set: (key, value) => writeTo(localStorage, localAvailable, key, value),

  /** @param {string} key */
  remove: (key) => removeFrom(localStorage, localAvailable, key),

  /** Remove every Vanguard-namespaced key from localStorage. */
  clearAll: () => {
    Object.values(LOCAL_KEYS).forEach((k) =>
      removeFrom(localStorage, localAvailable, k)
    );
  },
};

// ─── sessionStorage API ──────────────────────────────────────────────────────

export const session = {
  /** @param {string} key @param {*} fallback */
  get: (key, fallback = null) =>
    readFrom(sessionStorage, sessionAvailable, key, fallback),

  /** @param {string} key @param {*} value */
  set: (key, value) => writeTo(sessionStorage, sessionAvailable, key, value),

  /** @param {string} key */
  remove: (key) => removeFrom(sessionStorage, sessionAvailable, key),

  /** Remove every Vanguard-namespaced key from sessionStorage. */
  clearAll: () => {
    Object.values(SESSION_KEYS).forEach((k) =>
      removeFrom(sessionStorage, sessionAvailable, k)
    );
  },
};

// ─── Auth Helpers ────────────────────────────────────────────────────────────

/**
 * Persist the auth token to localStorage.
 * ⚠️  Passwords are NEVER stored here.
 * @param {string} token
 */
export const saveAuthToken = (token) =>
  local.set(LOCAL_KEYS.AUTH_TOKEN, token);

/** Retrieve the stored auth token (or null). */
export const getAuthToken = () => local.get(LOCAL_KEYS.AUTH_TOKEN);

/** Remove the auth token from localStorage. */
export const removeAuthToken = () => local.remove(LOCAL_KEYS.AUTH_TOKEN);

// ─── Theme Helpers ───────────────────────────────────────────────────────────

/**
 * Persist the user's theme preference.
 * @param {'dark'|'light'|'system'} theme
 */
export const saveTheme = (theme) => local.set(LOCAL_KEYS.THEME, theme);

/** Retrieve the theme preference (defaults to 'dark'). */
export const getTheme = () => local.get(LOCAL_KEYS.THEME, 'dark');

// ─── User Preferences Helpers ────────────────────────────────────────────────

/**
 * Merge & save user preferences into localStorage.
 * Existing keys are preserved; only provided keys are overwritten.
 * @param {Record<string, unknown>} prefs
 */
export const saveUserPrefs = (prefs) => {
  const current = local.get(LOCAL_KEYS.USER_PREFS, {});
  local.set(LOCAL_KEYS.USER_PREFS, { ...current, ...prefs });
};

/** Retrieve the full user preferences object. */
export const getUserPrefs = () => local.get(LOCAL_KEYS.USER_PREFS, {});

// ─── Form Progress Helpers (sessionStorage) ──────────────────────────────────

/**
 * Save multi-step form progress.
 * @param {{ step: number, data: Record<string, unknown> }} progress
 */
export const saveFormProgress = (progress) =>
  session.set(SESSION_KEYS.FORM_PROGRESS, progress);

/** Retrieve saved form progress (or null). */
export const getFormProgress = () => session.get(SESSION_KEYS.FORM_PROGRESS);

/** Clear form progress from sessionStorage. */
export const clearFormProgress = () =>
  session.remove(SESSION_KEYS.FORM_PROGRESS);

// ─── Search / Filter State (sessionStorage) ──────────────────────────────────

/**
 * Persist the current search/filter state for the session.
 * @param {Record<string, unknown>} state
 */
export const saveSearchState = (state) =>
  session.set(SESSION_KEYS.SEARCH_STATE, state);

/** Retrieve the current search/filter state. */
export const getSearchState = () => session.get(SESSION_KEYS.SEARCH_STATE, {});

/** Clear the temporary search/filter state. */
export const clearSearchState = () =>
  session.remove(SESSION_KEYS.SEARCH_STATE);

// ─── Full Logout Cleanup ─────────────────────────────────────────────────────

/**
 * Call on logout — wipes all Vanguard-namespaced data from BOTH storages.
 * Safe to call even if storage is unavailable.
 */
export const clearAllStorageOnLogout = () => {
  local.clearAll();
  session.clearAll();
};
