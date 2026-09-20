import React, { useState, useEffect, useCallback } from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { GeoLocation, ForecastData } from './types';
import { DEFAULT_LOCATION, fetchForecast, WeatherServiceError } from './services/weatherApi';
import { generatePlanningRecommendations } from './utils/weatherUtils';
import { CitySearch } from './components/CitySearch';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { SevenDayForecast } from './components/SevenDayForecast';
import { ForecastChart } from './components/ForecastChart';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { ErrorMessage } from './components/ErrorMessage';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(DEFAULT_LOCATION);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0);

  const loadForecast = useCallback(async (location: GeoLocation, isSilentRefresh = false) => {
    if (isSilentRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setServiceError(null);

    try {
      const data = await fetchForecast(location);
      setForecast(data);
      setCurrentLocation(location);
      setSelectedDayIndex(0);
    } catch (err: any) {
      if (err instanceof WeatherServiceError) {
        setServiceError(err.message);
      } else {
        setServiceError('Unable to reach the weather service. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load defaults to Toronto so the app is never empty
  useEffect(() => {
    loadForecast(DEFAULT_LOCATION);
  }, [loadForecast]);

  const handleSelectCity = (location: GeoLocation) => {
    loadForecast(location);
  };

  const handleRetry = () => {
    loadForecast(currentLocation);
  };

  const recommendations = forecast ? generatePlanningRecommendations(forecast.daily) : [];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* App Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                Weather Intelligence
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                Real-time Open-Meteo planning dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {forecast && (
              <button
                type="button"
                onClick={() => loadForecast(currentLocation, true)}
                disabled={isRefreshing || isLoading}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors cursor-pointer"
                aria-label="Refresh forecast"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
                <span>{isRefreshing ? 'Refreshing' : 'Refresh'}</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live API
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* City Search Bar */}
        <section aria-label="City search section">
          <CitySearch
            onSelectCity={handleSelectCity}
            isLoading={isLoading}
            onServiceError={(msg) => setServiceError(msg)}
          />
        </section>

        {/* Global Weather Service Error Banner */}
        {serviceError && (
          <ErrorMessage
            message={serviceError}
            onRetry={handleRetry}
            isRetrying={isLoading || isRefreshing}
          />
        )}

        {/* Loading Skeleton */}
        {isLoading && !forecast && <WeatherSkeleton />}

        {/* Main Content when Forecast is Available */}
        {forecast && (
          <div className={`space-y-6 transition-opacity duration-200 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            {/* 1. Current Weather Panel */}
            <CurrentWeatherCard
              forecast={forecast}
              onRefresh={() => loadForecast(currentLocation, true)}
              isRefreshing={isRefreshing}
            />

            {/* 2. Planning Recommendations (3 to 5 tips) */}
            <PlanningRecommendations
              recommendations={recommendations}
            />

            {/* 3. 7-Day Forecast Cards */}
            <SevenDayForecast
              days={forecast.daily}
              selectedIndex={selectedDayIndex}
              onSelectDay={(idx) => setSelectedDayIndex(idx)}
            />

            {/* 4. Forecast Chart (High/Low Temp + Rain Probability series) */}
            <ForecastChart
              days={forecast.daily}
              selectedIndex={selectedDayIndex}
              onSelectDay={(idx) => setSelectedDayIndex(idx)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Weather Intelligence • Open-Meteo Direct Client Architecture
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Free Public Open-Meteo API</span>
            <span>•</span>
            <span>WMO Interpretation Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
