/**
 * ActionTimelinePanel.tsx — Phase 29 Visual Engineering Audit Trail Panel
 *
 * Renders rich engineering action timelines (e.g. ✓ Read planner.ts, ✓ Edit runtime-router.ts, ⚠ Run Tests, ✗ Git Commit).
 */

import React from 'react';
import { useActionStore } from '../../stores/action-store';
import { ActionCard } from './ActionCard';

export const ActionTimelinePanel: React.FC = () => {
  const { activeActions, history, selectedAction } = useActionStore();

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 border-l border-slate-800 w-80">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-indigo-400 font-bold text-sm">⚡</span>
          <span className="font-bold text-xs uppercase tracking-wider text-slate-100">Engineering Audit Timeline</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-semibold">
          {history.length} Actions
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {activeActions.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase text-cyan-400 tracking-wider">Active Execution</div>
            {activeActions.map((act) => (
              <ActionCard key={act.id} entry={act} />
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Audit Log</div>
          {history.length === 0 ? (
            <div className="text-xs text-slate-500 italic p-4 text-center">No engineering actions recorded yet.</div>
          ) : (
            history.map((act) => <ActionCard key={act.id} entry={act} />)
          )}
        </div>
      </div>

      {selectedAction && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-xs space-y-1">
          <div className="font-semibold text-slate-200 flex justify-between">
            <span>Action Details</span>
            <span className="text-[10px] font-mono text-indigo-400">{selectedAction.id}</span>
          </div>
          <div className="font-mono text-[11px] text-slate-300">Action: {selectedAction.actionId}</div>
          <div className="font-mono text-[11px] text-slate-300">Runtime: {selectedAction.runtimeId}</div>
          {selectedAction.result && (
            <pre className="text-[10px] font-mono bg-slate-950 p-2 rounded max-h-24 overflow-y-auto text-emerald-300 border border-slate-800 mt-1">
              {JSON.stringify(selectedAction.result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
