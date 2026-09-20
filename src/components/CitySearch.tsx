import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, MapPin, X, AlertCircle } from 'lucide-react';
import { GeoLocation } from '../types';
import { searchCities, WeatherServiceError } from '../services/weatherApi';

interface CitySearchProps {
  onSelectCity: (location: GeoLocation) => void;
  isLoading: boolean;
  onServiceError: (errorMsg: string) => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  onSelectCity,
  isLoading,
  onServiceError,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GeoLocation[] | null>(null);
  const [cityNotFoundError, setCityNotFoundError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed || isSearching) return;

    setIsSearching(true);
    setCityNotFoundError(null);
    setSearchResults(null);
    setIsDropdownOpen(false);

    try {
      const results = await searchCities(trimmed);

      if (results.length === 0) {
        setCityNotFoundError('City not found. Check the spelling and try again.');
        setSearchResults([]);
        setIsDropdownOpen(false);
      } else if (results.length === 1) {
        // Single match: directly select it
        setSearchResults(null);
        setIsDropdownOpen(false);
        setQuery(`${results[0].name}${results[0].country ? `, ${results[0].country}` : ''}`);
        onSelectCity(results[0]);
      } else {
        // Multiple matches: show dropdown
        setSearchResults(results);
        setIsDropdownOpen(true);
      }
    } catch (err: any) {
      if (err instanceof WeatherServiceError) {
        onServiceError(err.message);
      } else {
        onServiceError('Unable to reach the weather service. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc: GeoLocation) => {
    const displayName = [loc.name, loc.admin1, loc.country].filter(Boolean).join(', ');
    setQuery(displayName);
    setIsDropdownOpen(false);
    setSearchResults(null);
    setCityNotFoundError(null);
    onSelectCity(loc);
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults(null);
    setCityNotFoundError(null);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const isSearchDisabled = query.trim().length === 0 || isSearching || isLoading;

  const quickCities: { name: string; label: string; location: GeoLocation }[] = [
    {
      name: 'Toronto',
      label: 'Toronto, Canada',
      location: {
        id: 6167865,
        name: 'Toronto',
        latitude: 43.70011,
        longitude: -79.4163,
        admin1: 'Ontario',
        country: 'Canada',
        country_code: 'CA',
        timezone: 'America/Toronto',
      },
    },
    {
      name: 'London',
      label: 'London, UK',
      location: {
        id: 2643743,
        name: 'London',
        latitude: 51.50853,
        longitude: -0.12574,
        admin1: 'England',
        country: 'United Kingdom',
        country_code: 'GB',
        timezone: 'Europe/London',
      },
    },
    {
      name: 'Tokyo',
      label: 'Tokyo, Japan',
      location: {
        id: 1850147,
        name: 'Tokyo',
        latitude: 35.6895,
        longitude: 139.6917,
        admin1: 'Tokyo',
        country: 'Japan',
        country_code: 'JP',
        timezone: 'Asia/Tokyo',
      },
    },
    {
      name: 'New York',
      label: 'New York, USA',
      location: {
        id: 5128581,
        name: 'New York',
        latitude: 40.71427,
        longitude: -74.00597,
        admin1: 'New York',
        country: 'United States',
        country_code: 'US',
        timezone: 'America/New_York',
      },
    },
    {
      name: 'Sydney',
      label: 'Sydney, Australia',
      location: {
        id: 2147714,
        name: 'Sydney',
        latitude: -33.86785,
        longitude: 151.20732,
        admin1: 'New South Wales',
        country: 'Australia',
        country_code: 'AU',
        timezone: 'Australia/Sydney',
      },
    },
  ];

  return (
    <div ref={containerRef} className="w-full relative">
      <form onSubmit={handleSearch} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="city-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (cityNotFoundError) setCityNotFoundError(null);
            }}
            placeholder="Search city (e.g., London, Tokyo, Vancouver)..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
            autoComplete="off"
            aria-label="Search city by name"
          />
          {query.length > 0 && (
            <button
              id="clear-search-button"
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          id="search-city-button"
          type="submit"
          disabled={isSearchDisabled}
          className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-medium text-base transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching</span>
            </>
          ) : (
            <span>Search</span>
          )}
        </button>
      </form>

      {/* City Not Found Error Message */}
      {cityNotFoundError && (
        <div
          id="city-not-found-message"
          role="alert"
          className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-2.5 transition-all"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-950">{cityNotFoundError}</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Try searching with an alternate spelling or add the country name (e.g., "Paris, France").
            </p>
          </div>
        </div>
      )}

      {/* Multiple Matches Dropdown */}
      {isDropdownOpen && searchResults && searchResults.length > 0 && (
        <div
          id="search-results-dropdown"
          className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden py-1 divide-y divide-slate-100 max-h-80 overflow-y-auto"
        >
          <div className="px-3.5 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Multiple locations found — select one:
          </div>
          {searchResults.map((loc, index) => {
            const regionDetails = [loc.admin1, loc.country].filter(Boolean).join(', ');
            return (
              <button
                key={`${loc.id ?? index}-${loc.latitude}-${loc.longitude}`}
                type="button"
                onClick={() => handleSelectLocation(loc)}
                className="w-full text-left px-4 py-3 hover:bg-sky-50 flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-sky-600 mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-sky-900">
                      {loc.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {regionDetails || 'Location details unavailable'}
                    </div>
                  </div>
                </div>
                {loc.country_code && (
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700">
                    {loc.country_code}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Quick location chips for fast exploration */}
      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-slate-500 font-medium mr-1">Popular:</span>
        {quickCities.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => {
              setCityNotFoundError(null);
              setSearchResults(null);
              setIsDropdownOpen(false);
              setQuery(item.label);
              onSelectCity(item.location);
            }}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};
