import { useState, useEffect, useCallback } from 'react';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState(new Map());

  const fetchData = useCallback(async (fetchUrl = url, fetchOptions = options) => {
    // Check cache first
    const cacheKey = `${fetchUrl}-${JSON.stringify(fetchOptions)}`;
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      // Check if cache is still valid (5 minutes)
      if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
        setData(cachedData.data);
        return cachedData.data;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(fetchUrl, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Cache the result
      setCache(prev => new Map(prev.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })));
      
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options, cache]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    fetchData
  };
}
