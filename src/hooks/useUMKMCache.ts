import { useState, useEffect, useCallback } from 'react';

export interface UMKM {
  no: string; // UUID
  name: string;
  category: string;
  district: string;
  description: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  operatingHours: string;
  gambar?: string | null;
}

interface CacheEntry {
  data: UMKM[];
  timestamp: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache: Map<string, CacheEntry> = new Map();

export function useUMKMCache(
  page: number = 1,
  limit: number = 50,
  category?: string,
  search?: string
) {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Generate cache key based on params
  const getCacheKey = useCallback(() => {
    return `umkm-${page}-${limit}-${category || 'all'}-${search || 'none'}`;
  }, [page, limit, category, search]);

  const fetchUMKMData = useCallback(async () => {
    try {
      setLoading(true);
      const cacheKey = getCacheKey();
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Using cached data for:', cacheKey);
        setUmkms(cached.data);
        setPagination(cached.pagination);
        setError(null);
        setLoading(false);
        return;
      }

      // Build query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (category && category !== 'Semua') {
        params.append('category', category);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/umkm?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch UMKM data');
      }
      
      const result = await response.json();
      
      // Handle both old format (array) and new format (object with data property)
      const data = Array.isArray(result) ? result : result.data;
      const paginationData = result.pagination;

      // Store in cache
      cache.set(cacheKey, {
        data,
        pagination: paginationData,
        timestamp: Date.now(),
      });

      setUmkms(data);
      setPagination(paginationData);
      setError(null);
    } catch (err) {
      console.error('Error fetching UMKM data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setUmkms([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, category, search, getCacheKey]);

  useEffect(() => {
    fetchUMKMData();
  }, [fetchUMKMData]);

  // Function to invalidate cache
  const invalidateCache = useCallback(() => {
    cache.clear();
    fetchUMKMData();
  }, [fetchUMKMData]);

  return { umkms, loading, error, pagination, invalidateCache };
}
