/**
 * ActionCard.tsx — Phase 29 Card Component for Action Execution Steps
 */

import React from 'react';
import { ActionStoreEntry, useActionStore } from '../../stores/action-store';

export const ActionCard: React.FC<{ entry: ActionStoreEntry }> = ({ entry }) => {
  const { selectAction, selectedAction } = useActionStore();
  const isSelected = selectedAction?.id === entry.id;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-emerald-400 font-bold">✓</span>;
      case 'FAILED':
        return <span className="text-rose-400 font-bold">✗</span>;
      case 'CANCELLED':
        return <span className="text-amber-400 font-bold">⊘</span>;
      case 'STARTED':
        return <span className="text-cyan-400 animate-spin">⏳</span>;
      default:
        return <span className="text-slate-400">⏱</span>;
    }
  };

  const getTargetText = () => {
    if (!entry.params) return '';
    return entry.params.filePath || entry.params.command || entry.params.oldPath || entry.params.query || '';
  };

  return (
    <div
      onClick={() => selectAction(entry)}
      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-950/40 text-slate-100 shadow-md'
          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          {getStatusIcon(entry.status)}
          <span className="font-semibold text-slate-100">{entry.actionId}</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            {entry.runtimeId}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {entry.durationMs ? `${entry.durationMs}ms` : new Date(entry.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {getTargetText() && (
        <div className="font-mono text-[11px] text-indigo-300 truncate bg-slate-950/60 px-2 py-1 rounded border border-slate-800/50 mt-1">
          {getTargetText()}
        </div>
      )}

      {entry.error && (
        <div className="text-rose-400 text-[10px] mt-1 bg-rose-950/40 border border-rose-800/40 p-1.5 rounded">
          {entry.error}
        </div>
      )}
    </div>
  );
};
