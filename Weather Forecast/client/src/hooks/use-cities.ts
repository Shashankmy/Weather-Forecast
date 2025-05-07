import { useState, useEffect, useCallback } from 'react';
import { CityTableData } from '@/types';
import { fetchCities } from '@/lib/api';

interface UseCitiesParams {
  initialSearchTerm?: string;
  initialSortColumn?: string;
  initialSortDirection?: 'asc' | 'desc';
  pageSize?: number;
}

interface UseCitiesResult {
  cities: CityTableData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  setSort: (column: string, direction: 'asc' | 'desc') => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

export function useCities({
  initialSearchTerm = '',
  initialSortColumn = 'name',
  initialSortDirection = 'asc',
  pageSize = 20,
}: UseCitiesParams = {}): UseCitiesResult {
  const [cities, setCities] = useState<CityTableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortColumn, setSortColumn] = useState(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Load cities data
  const loadCities = useCallback(async (reset: boolean = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const start = reset ? 0 : startIndex;
      const data = await fetchCities(
        searchTerm, 
        start, 
        pageSize, 
        sortColumn, 
        sortDirection
      );
      
      if (data.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      setCities(prevCities => reset ? data : [...prevCities, ...data]);
      
      if (reset) {
        setStartIndex(pageSize);
      } else {
        setStartIndex(prevIndex => prevIndex + pageSize);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cities');
      console.error('Error loading cities:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, startIndex, sortColumn, sortDirection, pageSize, loading]);

  // Load more cities (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadCities();
  }, [hasMore, loading, loadCities]);

  // Refresh cities data
  const refresh = useCallback(async () => {
    await loadCities(true);
  }, [loadCities]);

  // Set sort parameters
  const setSort = useCallback((column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  }, []);

  // Initial load
  useEffect(() => {
    loadCities(true);
  }, [searchTerm, sortColumn, sortDirection]);

  return {
    cities,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    setSort,
    loadMore,
    refresh,
    hasMore,
  };
}
