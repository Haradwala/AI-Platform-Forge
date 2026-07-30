/**
 * ReplayScrubber.tsx — Time-Travel Timeline Execution Replay Scrubber
 */

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';

interface ReplayScrubberProps {
  minTimeMs: number;
  maxTimeMs: number;
}

export const ReplayScrubber: React.FC<ReplayScrubberProps> = ({ minTimeMs, maxTimeMs }) => {
  const { replayTimeMs, setReplayTimeMs, isPlayingReplay, setIsPlayingReplay } = useStudioStore();
  const currentVal = replayTimeMs ?? maxTimeMs;

  const togglePlay = () => {
    setIsPlayingReplay(!isPlayingReplay);
  };

  return (
    <div className="flex items-center space-x-4 px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
      <button
        onClick={togglePlay}
        className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded transition"
      >
        {isPlayingReplay ? 'Pause Replay' : 'Play Replay'}
      </button>

      <span className="text-slate-400 font-mono">
        {new Date(currentVal).toLocaleTimeString()}
      </span>

      <input
        type="range"
        min={minTimeMs}
        max={maxTimeMs}
        value={currentVal}
        onChange={(e) => setReplayTimeMs(Number(e.target.value))}
        className="flex-1 accent-sky-500 cursor-pointer"
      />

      <button
        onClick={() => setReplayTimeMs(null)}
        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
      >
        Live View
      </button>
    </div>
  );
};
