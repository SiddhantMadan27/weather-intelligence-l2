import React, { useState } from 'react';
import { DailyForecastDay } from '../types';
import { getWeatherCondition } from '../utils/weatherUtils';

interface ForecastChartProps {
  days: DailyForecastDay[];
  selectedIndex: number | null;
  onSelectDay: (index: number) => void;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  days,
  selectedIndex,
  onSelectDay,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!days || days.length === 0) return null;

  // Chart dimensions in SVG viewBox coordinates
  const width = 640;
  const height = 260;
  const paddingLeft = 52;
  const paddingRight = 50;
  const paddingTop = 32;
  const paddingBottom = 48;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Calculate temperature range with margin
  const allTemps = days.flatMap((d) => [d.tempMax, d.tempMin]);
  const minTempRaw = Math.min(...allTemps);
  const maxTempRaw = Math.max(...allTemps);

  // Round min/max nicely for temperature axis
  const minTemp = Math.floor((minTempRaw - 2) / 5) * 5;
  const maxTemp = Math.ceil((maxTempRaw + 2) / 5) * 5;
  const tempSpan = Math.max(maxTemp - minTemp, 10);

  // Precipitation probability is always 0 - 100%
  const minPrecip = 0;
  const maxPrecip = 100;

  // Scale functions
  const getX = (index: number) => {
    if (days.length === 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (days.length - 1)) * chartWidth;
  };

  const getYTemp = (temp: number) => {
    return paddingTop + chartHeight - ((temp - minTemp) / tempSpan) * chartHeight;
  };

  const getYPrecip = (prob: number) => {
    return paddingTop + chartHeight - (prob / maxPrecip) * chartHeight;
  };

  // Generate SVG path for temperatures
  const maxPoints = days.map((d, i) => ({ x: getX(i), y: getYTemp(d.tempMax) }));
  const minPoints = days.map((d, i) => ({ x: getX(i), y: getYTemp(d.tempMin) }));

  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    return pts.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = pts[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 3;
      const cy1 = prev.y;
      const cx2 = pt.x - (pt.x - prev.x) / 3;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, '');
  };

  const highPath = createSmoothPath(maxPoints);
  const lowPath = createSmoothPath(minPoints);

  // Active index (hovered or selected)
  const activeIdx = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeDay = activeIdx !== null ? days[activeIdx] : null;

  // Horizontal grid steps for temperatures (4 lines)
  const gridSteps = [0, 0.33, 0.66, 1];

  return (
    <section id="forecast-chart-section" className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">7-Day Trends Chart</h2>
          <p className="text-xs text-slate-500">High / Low temperatures with daily precipitation probability</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-xs"></span>
            <span className="text-slate-700">High (°C)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block shadow-xs"></span>
            <span className="text-slate-700">Low (°C)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2.5 rounded-sm bg-blue-300/70 inline-block border border-blue-400"></span>
            <span className="text-slate-700">Precipitation (%)</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible touch-none"
          role="img"
          aria-label="7-Day weather temperature and precipitation probability chart"
        >
          <defs>
            <linearGradient id="precipBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="tempBandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Left Y-axis label */}
          <text
            x={10}
            y={paddingTop - 12}
            className="text-[11px] font-semibold fill-slate-500"
          >
            °C (Temp)
          </text>

          {/* Right Y-axis label */}
          <text
            x={width - 5}
            y={paddingTop - 12}
            textAnchor="end"
            className="text-[11px] font-semibold fill-slate-500"
          >
            % (Rain)
          </text>

          {/* Grid lines and Left/Right axis values */}
          {gridSteps.map((step) => {
            const y = paddingTop + step * chartHeight;
            const tempVal = Math.round(maxTemp - step * tempSpan);
            const precipVal = Math.round(maxPrecip - step * 100);

            return (
              <g key={step}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                {/* Left Temp tick */}
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-medium fill-slate-400"
                >
                  {tempVal}°
                </text>
                {/* Right Precip tick */}
                <text
                  x={width - paddingRight + 8}
                  y={y + 4}
                  textAnchor="start"
                  className="text-[10px] font-medium fill-slate-400"
                >
                  {precipVal}%
                </text>
              </g>
            );
          })}

          {/* Series 2: Precipitation Probability Bars */}
          {days.map((d, i) => {
            const cx = getX(i);
            const barWidth = 24;
            const barHeight = (d.precipitationProbabilityMax / maxPrecip) * chartHeight;
            const barY = paddingTop + chartHeight - barHeight;
            const isActive = activeIdx === i;

            return (
              <g key={`bar-${d.date}`}>
                <rect
                  x={cx - barWidth / 2}
                  y={barY}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx="3"
                  fill="url(#precipBarGradient)"
                  stroke={isActive ? '#0284c7' : '#38bdf8'}
                  strokeWidth={isActive ? '1.5' : '1'}
                  opacity={activeIdx !== null && !isActive ? 0.45 : 0.85}
                  className="transition-all duration-150"
                />
                {/* Rain probability number above or inside bar */}
                {d.precipitationProbabilityMax > 0 && (
                  <text
                    x={cx}
                    y={Math.max(barY - 3, paddingTop + 12)}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-sky-700"
                  >
                    {Math.round(d.precipitationProbabilityMax)}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Series 1: Temperature Lines */}
          {/* Low Temp Line */}
          <path
            d={lowPath}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* High Temp Line */}
          <path
            d={highPath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* High Temp Points & Labels */}
          {maxPoints.map((pt, i) => {
            const isActive = activeIdx === i;
            return (
              <g key={`high-${i}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 5.5 : 4}
                  fill="#ffffff"
                  stroke="#f43f5e"
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all"
                />
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-rose-600"
                >
                  {Math.round(days[i].tempMax)}°
                </text>
              </g>
            );
          })}

          {/* Low Temp Points & Labels */}
          {minPoints.map((pt, i) => {
            const isActive = activeIdx === i;
            return (
              <g key={`low-${i}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 5.5 : 4}
                  fill="#ffffff"
                  stroke="#0ea5e9"
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all"
                />
                <text
                  x={pt.x}
                  y={pt.y + 14}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-sky-700"
                >
                  {Math.round(days[i].tempMin)}°
                </text>
              </g>
            );
          })}

          {/* X Axis: Day Labels & Invisible Hover Columns */}
          {days.map((d, i) => {
            const cx = getX(i);
            const isActive = activeIdx === i;
            const shortDay = i === 0 ? 'Today' : d.dayName.slice(0, 3);

            return (
              <g
                key={`col-${d.date}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectDay(i)}
              >
                {/* Vertical cursor guide line when active */}
                {isActive && (
                  <line
                    x1={cx}
                    y1={paddingTop}
                    x2={cx}
                    y2={paddingTop + chartHeight}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Day name below chart */}
                <text
                  x={cx}
                  y={height - 20}
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${
                    isActive ? 'fill-sky-700 font-extrabold' : 'fill-slate-800'
                  }`}
                >
                  {shortDay}
                </text>

                {/* Date snippet below day */}
                <text
                  x={cx}
                  y={height - 6}
                  textAnchor="middle"
                  className="text-[9px] font-medium fill-slate-400"
                >
                  {d.formattedDate}
                </text>

                {/* Transparent hit area for easy tapping on mobile */}
                <rect
                  x={cx - (chartWidth / (days.length - 1)) / 2}
                  y={paddingTop}
                  width={chartWidth / (days.length - 1)}
                  height={chartHeight + 35}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* Selected / Hovered Day Detail Chip */}
        {activeDay && (
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">
                {activeIdx === 0 ? 'Today' : activeDay.dayName} ({activeDay.formattedDate}):
              </span>
              <span className="text-slate-600 font-medium">
                {getWeatherCondition(activeDay.weatherCode).label}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-700">
                High: <strong className="text-rose-600 font-bold">{Math.round(activeDay.tempMax)}°C</strong>
              </span>
              <span className="text-slate-700">
                Low: <strong className="text-sky-600 font-bold">{Math.round(activeDay.tempMin)}°C</strong>
              </span>
              <span className="text-slate-700">
                Rain: <strong className="text-blue-700 font-bold">{Math.round(activeDay.precipitationProbabilityMax)}%</strong>
              </span>
              <span className="text-slate-700">
                Wind: <strong className="text-teal-700 font-bold">{Math.round(activeDay.windSpeedMax)} km/h</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
