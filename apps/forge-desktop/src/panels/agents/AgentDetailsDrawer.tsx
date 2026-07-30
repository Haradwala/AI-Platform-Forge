/**
 * AgentDetailsDrawer.tsx — Phase 30 Agent Memory & Details Drawer Component
 */

import React from 'react';
import { useAgentStore } from '../../stores/agent-store';

export const AgentDetailsDrawer: React.FC = () => {
  const { selectedTask, memory, activeAgentRole } = useAgentStore();

  if (!selectedTask && !activeAgentRole && memory.length === 0) {
    return (
      <div className="p-4 text-xs text-slate-500 italic text-center">Select an agent or task to inspect memory and details.</div>
    );
  }

  return (
    <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-xs space-y-2">
      <div className="font-semibold text-slate-200 flex justify-between items-center border-b border-slate-800 pb-1.5">
        <span>Agent Memory & Output Inspection</span>
        {activeAgentRole && <span className="font-mono text-indigo-400 text-[10px]">{activeAgentRole}</span>}
      </div>

      {selectedTask && (
        <div className="space-y-1">
          <div className="font-mono text-[11px] text-slate-300">Task ID: {selectedTask.id}</div>
          <div className="font-mono text-[11px] text-slate-300">Role: {selectedTask.agentRole}</div>
          {selectedTask.output && (
            <pre className="text-[10px] font-mono bg-slate-950 p-2 rounded max-h-32 overflow-y-auto text-emerald-300 border border-slate-800">
              {selectedTask.output}
            </pre>
          )}
          {selectedTask.error && (
            <div className="text-[10px] text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2 rounded">
              {selectedTask.error}
            </div>
          )}
        </div>
      )}

      {memory.length > 0 && (
        <div className="space-y-1 mt-2">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Shared Workspace Memory (.forge/session/agents.json)</div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {memory.map((m) => (
              <div key={m.id} className="p-1.5 rounded bg-slate-950 border border-slate-800/60 font-mono text-[10px]">
                <div className="text-indigo-300 flex justify-between">
                  <span>{m.key}</span>
                  <span className="text-slate-500">{m.agentRole}</span>
                </div>
                <div className="text-slate-400 truncate">{JSON.stringify(m.value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
