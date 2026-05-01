import { useState, useCallback } from 'react';

/**
 * useLocalStorage — synced state backed by localStorage.
 *
 * Usage:
 *   const [theme, setTheme] = useLocalStorage('vanguard_theme', 'dark');
 *
 * @param {string} key          — localStorage key
 * @param {any}    initialValue — fallback value if key is not found
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error(`[useLocalStorage] Failed to write key "${key}":`, err);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error(`[useLocalStorage] Failed to remove key "${key}":`, err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
