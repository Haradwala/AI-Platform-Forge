/**
 * RuntimeRecommendationCard.tsx — Phase 25-28 Categorized Runtime Recommendation Component
 *
 * Visual card rendering multi-tier runtime recommendations for the current workspace stack.
 */

import React from 'react';

export interface RuntimeRecommendationItem {
  category: 'best_overall' | 'best_local' | 'best_coding' | 'best_vision' | 'best_reasoning' | 'fastest' | 'offline';
  runtimeId: string;
  reason: string;
}

interface RuntimeRecommendationCardProps {
  recommendations: RuntimeRecommendationItem[];
  onSelectRuntime?: (runtimeId: string) => void;
}

const CATEGORY_LABELS: Record<RuntimeRecommendationItem['category'], { title: string; color: string }> = {
  best_overall: { title: 'Best Overall', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' },
  best_local: { title: 'Best Local', color: 'bg-indigo-950/60 text-indigo-300 border-indigo-800' },
  best_coding: { title: 'Best Coding', color: 'bg-blue-950/60 text-blue-300 border-blue-800' },
  best_vision: { title: 'Best Vision', color: 'bg-purple-950/60 text-purple-300 border-purple-800' },
  best_reasoning: { title: 'Best Reasoning', color: 'bg-amber-950/60 text-amber-300 border-amber-800' },
  fastest: { title: 'Fastest Response', color: 'bg-cyan-950/60 text-cyan-300 border-cyan-800' },
  offline: { title: 'Fully Offline', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
};

export const RuntimeRecommendationCard: React.FC<RuntimeRecommendationCardProps> = ({
  recommendations,
  onSelectRuntime,
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-zinc-100 shadow-md">
      <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
        AI Runtime Recommendations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.map((item, idx) => {
          const cat = CATEGORY_LABELS[item.category] || { title: item.category, color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
          return (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 transition hover:border-zinc-700"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${cat.color}`}>
                    {cat.title}
                  </span>
                  <span className="text-xs font-mono font-medium text-zinc-300 capitalize">{item.runtimeId}</span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">{item.reason}</p>
              </div>

              {onSelectRuntime && (
                <button
                  onClick={() => onSelectRuntime(item.runtimeId)}
                  className="mt-3 w-full rounded border border-zinc-700 bg-zinc-800 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                >
                  Use {item.runtimeId}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
