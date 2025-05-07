import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { fetchCities } from '@/lib/api';
import { CityTableData } from '@/types';
import { debounce } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (term: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ onSearch, searchValue, onSearchChange }: SearchBarProps) => {
  const [suggestions, setSuggestions] = useState<CityTableData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions based on search input
  const fetchSuggestions = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const cities = await fetchCities(searchTerm, 0, 5, 'name', 'asc');
      setSuggestions(cities);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    
    if (value.trim()) {
      setShowSuggestions(true);
      debouncedFetchSuggestions(value);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (city: CityTableData) => {
    onSearchChange(city.name);
    onSearch(city.name);
    setShowSuggestions(false);
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    setShowSuggestions(false);
  };

  // Handle clear button click
  const handleClear = () => {
    onSearchChange('');
    onSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search cities..."
            value={searchValue}
            onChange={handleInputChange}
            className="pr-10"
            aria-label="Search cities"
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" aria-label="Search">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (searchValue.trim() !== '') && (
        <Card className="absolute z-10 mt-1 w-full max-h-60 overflow-auto shadow-lg bg-white dark:bg-gray-800">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((city) => (
                <li 
                  key={city.id}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between"
                  onClick={() => handleSuggestionClick(city)}
                >
                  <span>{city.name}</span>
                  <span className="text-gray-500 text-sm">{city.country}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-center text-gray-500">No cities found</div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
