/**
 * AgentCollaborationWorkspace.tsx — Local Multi-Agent Execution Graph & Observability Panel
 */

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';

export const AgentCollaborationWorkspace: React.FC = () => {
  const { executionNodes } = useStudioStore();

  const defaultNodes = executionNodes.length > 0
    ? executionNodes
    : [
        {
          id: 'node-1',
          agentRole: 'PlannerAgent',
          taskTitle: 'Decompose Personal OS Architecture',
          status: 'completed' as const,
          subtasks: ['Audit roadmap', 'Simplify middleware', 'Refactor panel grid'],
          reasoningSteps: ['Identified zero-value enterprise features', 'Consolidated SQLite storage'],
          timestamp: Date.now() - 60000,
        },
        {
          id: 'node-2',
          agentRole: 'CoderAgent',
          taskTitle: 'Implement Composable Panel Grid',
          status: 'active' as const,
          subtasks: ['Create studio-types.ts', 'Build ComposablePanelGrid.tsx'],
          reasoningSteps: ['Refactored layout to CSS Grid', 'Bound Timeline Event Bus'],
          timestamp: Date.now() - 30000,
        },
      ];

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 space-y-6 overflow-y-auto">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-100">Agent Execution Graph (Observability)</h2>
        <p className="text-xs text-slate-400">Live inter-agent subtask execution flow, thought streams, and DAG status</p>
      </div>

      <div className="space-y-3">
        {defaultNodes.map((node) => (
          <div key={node.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-purple-900/80 text-purple-300 border border-purple-700">
                {node.agentRole}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  node.status === 'completed'
                    ? 'bg-emerald-900/80 text-emerald-300'
                    : node.status === 'active'
                    ? 'bg-amber-900/80 text-amber-300 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {node.status}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-slate-100">{node.taskTitle}</h4>

            {node.subtasks.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {node.subtasks.map((st, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-300 text-xs rounded border border-slate-800 font-mono">
                    ✓ {st}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
