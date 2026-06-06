import { useState, useEffect, useRef } from 'react';

export default function useApi(apiFn, mockFallback) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiFnRef = useRef(apiFn);
  const mockRef = useRef(mockFallback);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await apiFnRef.current();
        if (isMounted) { setData(result.data); setError(null); }
      } catch (err) {
        if (isMounted) { setData(mockRef.current); setError(err); }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []); // empty dep array — runs once on mount

  return { data, loading, error };
}
