import { useState, useEffect } from 'react';

export default function useApi(apiFn, mockFallback) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await apiFn();
        if (isMounted) {
          setData(result.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('API call failed, using mock fallback', err);
          setData(mockFallback);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    return () => { isMounted = false; };
  }, [apiFn, mockFallback]);

  return { data, loading, error };
}
