/**
 * TimelineCanvas.tsx — Virtualized Event Stream Swimlane Viewport
 */

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';

export interface TimelineItem {
  id: string;
  type: string;
  source: 'agent' | 'runtime' | 'automation' | 'intelligence';
  timestamp: number;
  message: string;
  payload?: any;
}

interface TimelineCanvasProps {
  events: TimelineItem[];
}

export const TimelineCanvas: React.FC<TimelineCanvasProps> = ({ events }) => {
  const { replayTimeMs } = useStudioStore();

  const filteredEvents = events.filter((e) => {
    if (replayTimeMs !== null && e.timestamp > replayTimeMs) return false;
    return true;
  });

  const getSourceBadgeClass = (source: TimelineItem['source']) => {
    switch (source) {
      case 'agent':
        return 'bg-purple-900/80 text-purple-300 border-purple-700';
      case 'runtime':
        return 'bg-amber-900/80 text-amber-300 border-amber-700';
      case 'automation':
        return 'bg-emerald-900/80 text-emerald-300 border-emerald-700';
      case 'intelligence':
        return 'bg-sky-900/80 text-sky-300 border-sky-700';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4">
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {filteredEvents.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500 italic text-sm">
            No events match current filter or time position.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex items-start space-x-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-slate-700 transition"
            >
              <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${getSourceBadgeClass(evt.source)}`}>
                {evt.source.toUpperCase()}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">{evt.type}</span>
                  <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="mt-1 text-sm text-slate-200 truncate">{evt.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
