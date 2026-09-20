import React from 'react';
import { PlanningRecommendation } from '../types';
import {
  Umbrella,
  Wind,
  Sun,
  Snowflake,
  Sparkles,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface PlanningRecommendationsProps {
  recommendations: PlanningRecommendation[];
  onSelectDayLabel?: (dayLabel: string) => void;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  recommendations,
}) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: PlanningRecommendation['category']) => {
    switch (category) {
      case 'rain':
        return <Umbrella className="w-5 h-5 text-sky-600" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-teal-600" />;
      case 'heat':
        return <Sun className="w-5 h-5 text-amber-600" />;
      case 'cold':
        return <Snowflake className="w-5 h-5 text-indigo-500" />;
      case 'clear':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'caution':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-sky-600" />;
    }
  };

  const getBadgeStyle = (category: PlanningRecommendation['category']) => {
    switch (category) {
      case 'rain':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'wind':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'heat':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cold':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'clear':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'caution':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <section id="planning-recommendations-panel" className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Planning Recommendations</h2>
          <p className="text-xs text-slate-500">
            Actionable day-by-day advice calculated from forecast rules
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs shrink-0 mt-0.5">
                {getCategoryIcon(rec.category)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getBadgeStyle(rec.category)}`}>
                    {rec.title}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {rec.dayLabel}
                  </span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  {rec.tip}
                </p>
              </div>
            </div>

            {rec.metric && (
              <span className="self-start sm:self-auto shrink-0 text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-white border border-slate-200/80 text-slate-600">
                {rec.metric}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
