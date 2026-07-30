/**
 * ActionHistoryDrawer.tsx — Phase 29 Replayable Action History Drawer
 */

import React, { useEffect } from 'react';
import { useActionStore } from '../../stores/action-store';

export const ActionHistoryDrawer: React.FC<{ workspaceRoot?: string }> = ({ workspaceRoot }) => {
  const { history, loadHistory } = useActionStore();

  useEffect(() => {
    if (workspaceRoot) {
      loadHistory(workspaceRoot);
    }
  }, [workspaceRoot, loadHistory]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-semibold text-slate-200">Replayable Action Audit Logs</span>
        <button
          onClick={() => workspaceRoot && loadHistory(workspaceRoot)}
          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
        >
          Refresh Log
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-1.5 font-mono text-[11px]">
        {history.length === 0 ? (
          <div className="text-slate-500 italic p-2">No history logged in .forge/history/actions.json</div>
        ) : (
          history.map((h) => (
            <div key={h.id} className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/60">
              <div className="flex items-center space-x-2 truncate">
                <span className={h.status === 'COMPLETED' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {h.status === 'COMPLETED' ? '✓' : '✗'}
                </span>
                <span className="text-slate-200 font-semibold">{h.actionId}</span>
                <span className="text-slate-400">({h.runtimeId})</span>
              </div>
              <span className="text-slate-500 text-[10px]">{h.durationMs}ms</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
