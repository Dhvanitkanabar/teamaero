import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useFetch — Generic data-fetching hook with loading, error, and abort support.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch('/api/members');
 *   const { data, loading, error, refetch } = useFetch(url, { enabled: !!userId });
 *
 * @param {string}  url                — the endpoint to fetch
 * @param {object}  options
 * @param {boolean} options.enabled    — set false to skip fetching (default: true)
 * @param {object}  options.headers    — extra request headers
 * @param {any}     options.initialData — initial data state (default: null)
 */
const useFetch = (url, { enabled = true, headers = {}, initialData = null } = {}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    // Abort any in-flight request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
