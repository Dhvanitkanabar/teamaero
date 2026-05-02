import { useState, useCallback } from 'react';

/**
 * useSessionStorage — React state backed by sessionStorage.
 *
 * Data is cleared automatically when the browser tab is closed.
 * Ideal for: multi-step form progress, temporary filters, search state.
 *
 * Usage:
 *   const [filters, setFilters, clearFilters] = useSessionStorage('vanguard_poll_filters', {});
 *
 * @param {string} key          — sessionStorage key (use SESSION_KEYS constants)
 * @param {any}    initialValue — fallback value when the key is absent
 */
const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      // sessionStorage unavailable (private mode, quota exceeded, etc.)
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.warn(`[useSessionStorage] Failed to write key "${key}":`, err);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.warn(`[useSessionStorage] Failed to remove key "${key}":`, err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useSessionStorage;
