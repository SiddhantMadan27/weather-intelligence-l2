import React from 'react';
import { ForecastData } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCondition } from '../utils/weatherUtils';
import { Droplets, Wind, Thermometer, CloudRain, Clock, Globe, RefreshCw } from 'lucide-react';

interface CurrentWeatherCardProps {
  forecast: ForecastData;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  forecast,
  onRefresh,
  isRefreshing,
}) => {
  const { current, location, timezone, timezoneAbbr, fetchedAt } = forecast;
  const condition = getWeatherCondition(current.weatherCode);

  const locationDisplay = [location.name, location.admin1, location.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      id="current-weather-panel"
      className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden"
    >
      {/* Subtle atmospheric gradient in background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-100/50 to-amber-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Top Bar: Location and Timezone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {locationDisplay || 'Unknown Location'}
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs sm:text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Timezone: {timezone} {timezoneAbbr ? `(${timezoneAbbr})` : ''}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Updated: {fetchedAt}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
          title="Refresh current forecast"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
          <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Main Weather Display */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Big Temp & Condition */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center">
            <WeatherIcon code={current.weatherCode} className="w-14 h-14 sm:w-16 sm:h-16" />
          </div>

          <div>
            <div className="flex items-baseline">
              <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                {Math.round(current.temperature)}
              </span>
              <span className="text-2xl sm:text-3xl font-semibold text-slate-500 ml-1">°C</span>
            </div>
            <div className="mt-1">
              <span className="text-base sm:text-lg font-semibold text-slate-800">
                {condition.label}
              </span>
              <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
                {condition.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Weather Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          {/* Feels like */}
          <div className="bg-slate-50/80 border border-slate-100/90 rounded-xl p-3.5 min-w-[110px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>Feels Like</span>
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">
              {Math.round(current.apparentTemperature)}°C
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-slate-50/80 border border-slate-100/90 rounded-xl p-3.5 min-w-[110px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Humidity</span>
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">
              {current.relativeHumidity}%
            </div>
          </div>

          {/* Wind */}
          <div className="bg-slate-50/80 border border-slate-100/90 rounded-xl p-3.5 min-w-[110px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Wind className="w-4 h-4 text-teal-600" />
              <span>Wind Speed</span>
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">
              {current.windSpeed} <span className="text-xs font-normal text-slate-500">km/h</span>
            </div>
          </div>

          {/* Precipitation */}
          <div className="bg-slate-50/80 border border-slate-100/90 rounded-xl p-3.5 min-w-[110px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <CloudRain className="w-4 h-4 text-indigo-500" />
              <span>Precipitation</span>
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">
              {current.precipitation} <span className="text-xs font-normal text-slate-500">mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
