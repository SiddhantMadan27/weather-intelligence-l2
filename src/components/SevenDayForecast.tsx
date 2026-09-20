import React from 'react';
import { DailyForecastDay } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCondition } from '../utils/weatherUtils';
import { Droplet, ArrowUp, ArrowDown } from 'lucide-react';

interface SevenDayForecastProps {
  days: DailyForecastDay[];
  selectedIndex: number | null;
  onSelectDay: (index: number) => void;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({
  days,
  selectedIndex,
  onSelectDay,
}) => {
  return (
    <section id="seven-day-forecast-section" className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">7-Day Forecast</h2>
          <p className="text-xs text-slate-500">Day-by-day temperatures and precipitation probabilities</p>
        </div>
      </div>

      {/* Grid that wraps cleanly on all screen widths from 360px upwards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((day, idx) => {
          const condition = getWeatherCondition(day.weatherCode);
          const isSelected = selectedIndex === idx;
          const isToday = idx === 0;

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDay(idx)}
              className={`text-left p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                isSelected
                  ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-300/40 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-xs hover:border-slate-300'
              }`}
            >
              {isToday && (
                <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 tracking-wide uppercase">
                  Today
                </span>
              )}

              {/* Day & Date */}
              <div>
                <span className="text-sm font-bold text-slate-900 block truncate">
                  {day.dayName}
                </span>
                <span className="text-xs text-slate-400 font-medium block">
                  {day.formattedDate}
                </span>
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-3 flex flex-col items-center justify-center text-center">
                <WeatherIcon code={day.weatherCode} className="w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-110" />
                <span className="text-[11px] font-medium text-slate-600 mt-1 line-clamp-1">
                  {condition.label}
                </span>
              </div>

              {/* Temperatures & Precipitation */}
              <div className="pt-2 border-t border-slate-100/90 space-y-2">
                {/* High / Low */}
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center text-rose-600 gap-0.5">
                    <ArrowUp className="w-3 h-3 text-rose-500" />
                    <span>{Math.round(day.tempMax)}°</span>
                  </span>
                  <span className="flex items-center text-slate-500 gap-0.5">
                    <ArrowDown className="w-3 h-3 text-slate-400" />
                    <span>{Math.round(day.tempMin)}°</span>
                  </span>
                </div>

                {/* Rain probability pill */}
                <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Droplet className={`w-3 h-3 ${day.precipitationProbabilityMax >= 50 ? 'text-sky-600 fill-sky-600' : 'text-slate-400'}`} />
                    <span>Rain</span>
                  </span>
                  <span className={`font-bold ${day.precipitationProbabilityMax >= 50 ? 'text-sky-700' : 'text-slate-700'}`}>
                    {Math.round(day.precipitationProbabilityMax)}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
