/**
 * AgentTimeline.tsx — Phase 30 Sequential Multi-Agent Execution Timeline
 */

import React from 'react';
import { useAgentStore, AgentTaskEntry } from '../../stores/agent-store';

export const AgentTimeline: React.FC = () => {
  const { timeline, selectTask, selectedTask } = useAgentStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-emerald-400 font-bold">✓ Completed</span>;
      case 'FAILED':
        return <span className="text-rose-400 font-bold">✗ Failed</span>;
      case 'CANCELLED':
        return <span className="text-amber-400 font-bold">⊘ Cancelled</span>;
      case 'RUNNING':
        return <span className="text-cyan-400 animate-pulse">⏳ Running...</span>;
      default:
        return <span className="text-slate-400">⏱ Scheduled</span>;
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Agent Task Timeline</div>
      {timeline.length === 0 ? (
        <div className="text-xs text-slate-500 italic p-3">No multi-agent executions recorded.</div>
      ) : (
        timeline.map((task) => {
          const isSelected = selectedTask?.id === task.id;
          return (
            <div
              key={task.id}
              onClick={() => selectTask(task)}
              className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/40 text-slate-100'
                  : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-200">{task.agentRole.toUpperCase()}</span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded">
                    {task.runtimeId || 'runtime'}
                  </span>
                </div>
                <div className="text-[10px] font-mono">{getStatusBadge(task.status)}</div>
              </div>

              <div className="text-[11px] text-slate-300 font-mono truncate">{task.prompt}</div>

              {task.durationMs !== undefined && (
                <div className="text-[10px] text-slate-500 mt-1">Duration: {task.durationMs}ms</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
