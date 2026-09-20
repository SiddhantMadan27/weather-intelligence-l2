import React from 'react';

export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-busy="true" aria-label="Loading forecast data">
      {/* Current weather skeleton */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-slate-200 rounded-md"></div>
            <div className="h-4 w-40 bg-slate-200 rounded-md"></div>
            <div className="h-16 w-36 bg-slate-200 rounded-xl mt-4"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-20 w-full sm:w-28 bg-slate-100 rounded-xl p-3 border border-slate-200/50"></div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-day cards skeleton */}
      <div>
        <div className="h-6 w-44 bg-slate-200 rounded-md mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <div key={n} className="h-40 bg-white/80 border border-slate-200/80 rounded-xl p-4 space-y-3">
              <div className="h-4 w-16 bg-slate-200 rounded-md mx-auto"></div>
              <div className="h-10 w-10 bg-slate-200 rounded-full mx-auto"></div>
              <div className="h-4 w-20 bg-slate-200 rounded-md mx-auto"></div>
              <div className="h-3 w-12 bg-slate-200 rounded-md mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast chart skeleton */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-6">
        <div className="h-6 w-52 bg-slate-200 rounded-md mb-6"></div>
        <div className="h-64 w-full bg-slate-100 rounded-xl"></div>
      </div>

      {/* Recommendations skeleton */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-6">
        <div className="h-6 w-60 bg-slate-200 rounded-md mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 w-full bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
