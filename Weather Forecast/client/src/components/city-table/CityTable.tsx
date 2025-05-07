import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { CityTableData } from '@/types';
import { fetchCities } from '@/lib/api';
import { formatPopulation } from '@/lib/utils';
import SearchBar from './SearchBar';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown,
  MapPin,
  Users,
  Clock,
  ThermometerSun
} from 'lucide-react';
import { WeatherIcon } from '../weather/WeatherIcon';

interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}

const CityTable = () => {
  const [cities, setCities] = useState<CityTableData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortState, setSortState] = useState<SortState>({ column: 'name', direction: 'asc' });
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const ROWS_PER_PAGE = 20;

  // Function to load cities data
  const loadCities = useCallback(async (reset: boolean = false) => {
    if (loading || (!hasMore && !reset)) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const start = reset ? 0 : startIndex;
      const data = await fetchCities(
        searchTerm, 
        start, 
        ROWS_PER_PAGE, 
        sortState.column, 
        sortState.direction
      );
      
      if (data.length < ROWS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      setCities(prevCities => reset ? data : [...prevCities, ...data]);
      
      if (reset) {
        setStartIndex(ROWS_PER_PAGE);
      } else {
        setStartIndex(prevIndex => prevIndex + ROWS_PER_PAGE);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cities');
      console.error('Error loading cities:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, startIndex, sortState, loading, hasMore]);

  // Initial load
  useEffect(() => {
    loadCities(true);
  }, [searchTerm, sortState]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!loadingRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadCities();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(loadingRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [loadCities, loading, hasMore]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Handle sort
  const handleSort = (column: string) => {
    setSortState(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortState.column !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return sortState.direction === 'asc' 
      ? <ChevronUp className="ml-2 h-4 w-4" />
      : <ChevronDown className="ml-2 h-4 w-4" />;
  };

  // Handle right-click on city name to open in new tab
  const handleCityRightClick = (e: React.MouseEvent, city: CityTableData) => {
    // Right-click behavior is handled by the browser for <a> tags with target="_blank"
    // No need to prevent default or add custom logic
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col space-y-4">
        <SearchBar 
          onSearch={handleSearch} 
          searchValue={searchInputValue}
          onSearchChange={setSearchInputValue}
        />
        
        <div ref={tableRef} className="rounded-md border overflow-hidden">
          <Table>
            <TableCaption>
              {loading && cities.length === 0 ? "Loading cities..." : "List of cities worldwide"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    City {renderSortIndicator('name')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('cou_name_en')}>
                  <div className="flex items-center">
                    Country {renderSortIndicator('cou_name_en')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('population')}>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Population {renderSortIndicator('population')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('timezone')}>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Timezone {renderSortIndicator('timezone')}
                  </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <div className="flex items-center">
                    <ThermometerSun className="mr-2 h-4 w-4" />
                    Current Weather
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {error ? `Error: ${error}` : "No cities found. Try adjusting your search."}
                  </TableCell>
                </TableRow>
              ) : (
                cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell className="font-medium">
                      <a 
                        href={`/weather/${encodeURIComponent(city.name)}/${encodeURIComponent(city.countryCode)}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/weather/${encodeURIComponent(city.name)}/${encodeURIComponent(city.countryCode)}`;
                        }}
                        onContextMenu={(e) => handleCityRightClick(e, city)}
                      >
                        {city.name}
                      </a>
                    </TableCell>
                    <TableCell>{city.country}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatPopulation(city.population)}</TableCell>
                    <TableCell className="hidden md:table-cell">{city.timezone}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {city.currentTemp ? (
                        <div className="flex items-center">
                          <span>{Math.round(city.currentTemp)}°C</span>
                          {city.currentCondition && (
                            <>
                              <div className="ml-2">
                                <WeatherIcon condition={city.currentCondition} />
                              </div>
                              <span className="ml-1 text-xs">{city.currentCondition}</span>
                            </>
                          )}
                          {city.highTemp && city.lowTemp && (
                            <span className="ml-2 text-xs text-gray-500">
                              H: {Math.round(city.highTemp)}° L: {Math.round(city.lowTemp)}°
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not available</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Loading indicator for infinite scroll */}
          <div ref={loadingRef} className="flex justify-center py-4">
            {loading && <LoadingSpinner />}
            {!hasMore && cities.length > 0 && (
              <div className="text-gray-500 text-sm">No more cities to load</div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => loadCities(true)}
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityTable;
