/**
 * RecentRunsDrawer.tsx — Phase 16 Production Polish
 *
 * History drawer for searching, filtering, and switching between active/past Agent Runs.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { useRunStore } from '../../stores/run-store';
import { Badge } from '../../components/ui/Badge';

interface RecentRunsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecentRunsDrawer: React.FC<RecentRunsDrawerProps> = ({ isOpen, onClose }) => {
  const { runs, activeRunId, setActiveRun } = useRunStore();
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filteredRuns = runs.filter((r) =>
    r.title.toLowerCase().includes(filter.toLowerCase()) || r.status.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-y-0 right-0 w-[360px] bg-forge-bg-elevated border-l border-forge-border shadow-2xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="px-4 py-3 border-b border-forge-border flex items-center justify-between bg-forge-bg">
        <div className="flex items-center gap-2 font-semibold text-xs text-forge-text">
          <Lucide.History size={14} className="text-forge-accent" />
          <span>Recent Agent Runs ({runs.length})</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover transition-colors cursor-pointer"
        >
          <Lucide.X size={14} />
        </button>
      </div>

      {/* Filter Input */}
      <div className="p-3 border-b border-forge-border bg-forge-bg-elevated/40">
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-forge-bg rounded border border-forge-border text-xs">
          <Lucide.Search size={13} className="text-forge-text-subtle" />
          <input
            type="text"
            placeholder="Search runs by title or status..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-forge-text focus:outline-none font-mono text-[11px]"
          />
        </div>
      </div>

      {/* Runs List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {filteredRuns.length === 0 ? (
          <div className="p-4 text-center text-xs text-forge-text-subtle">No engineering runs found</div>
        ) : (
          filteredRuns.map((run) => {
            const isActive = run.id === activeRunId;
            const statusVariant =
              run.status === 'completed' ? 'success' : run.status === 'running' ? 'running' : run.status === 'failed' ? 'error' : 'pending';

            return (
              <div
                key={run.id}
                onClick={() => {
                  setActiveRun(run.id);
                  onClose();
                }}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isActive
                    ? 'bg-forge-accent/10 border-forge-accent text-forge-text shadow-sm'
                    : 'bg-forge-bg border-forge-border hover:bg-forge-bg-hover text-forge-text-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-forge-text truncate flex-1 mr-2">{run.title}</span>
                  <Badge variant={statusVariant}>{run.status}</Badge>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-forge-text-subtle">
                  <span>{new Date(run.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>{run.timeline.length} stages</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentRunsDrawer;
