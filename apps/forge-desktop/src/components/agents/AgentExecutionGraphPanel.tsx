/**
 * AgentExecutionGraphPanel.tsx — Local Multi-Agent Execution Graph & Observability Panel
 */

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';

export const AgentExecutionGraphPanel: React.FC = () => {
  const { executionNodes } = useStudioStore();

  return (
    <div className="h-full w-full flex flex-col p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Agent Execution Graph (Observability)
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">{executionNodes.length} active nodes</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {executionNodes.map((node) => (
          <div key={node.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded bg-purple-900/80 text-purple-300 border border-purple-700">
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

            <h4 className="text-xs font-semibold text-slate-100">{node.taskTitle}</h4>

            {/* Subtasks */}
            {node.subtasks.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-500 font-medium block">Subtasks</span>
                <div className="flex flex-wrap gap-1">
                  {node.subtasks.map((st, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-900 text-slate-300 text-[10px] rounded border border-slate-800 font-mono">
                      ✓ {st}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Thought Stream */}
            {node.reasoningSteps.length > 0 && (
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-400 font-mono leading-tight space-y-1">
                {node.reasoningSteps.map((step, i) => (
                  <div key={i} className="flex items-start space-x-1">
                    <span className="text-sky-400">›</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
