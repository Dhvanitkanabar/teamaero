import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating a value until after a pause in changes.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchTerm, 400);
 *
 * @param {any}    value — the value to debounce
 * @param {number} delay — debounce delay in milliseconds (default: 300ms)
 * @returns the debounced value
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout on every value change so the clock resets
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
