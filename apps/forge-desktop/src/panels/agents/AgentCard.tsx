/**
 * AgentCard.tsx — Phase 30 Card Component for Role-Based Agents
 */

import React from 'react';
import { AgentInfo, useAgentStore } from '../../stores/agent-store';

export const AgentCard: React.FC<{ agent: AgentInfo }> = ({ agent }) => {
  const { activeTasks, setActiveAgentRole, activeAgentRole } = useAgentStore();
  const isSelected = activeAgentRole === agent.role;

  const activeTask = activeTasks.find((t) => t.agentRole === agent.role);

  return (
    <div
      onClick={() => setActiveAgentRole(agent.role)}
      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-950/40 text-slate-100 shadow-md'
          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm">🤖</span>
          <span className="font-semibold text-slate-100">{agent.name}</span>
        </div>
        <span className="font-mono text-[10px] uppercase bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">
          {agent.role}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 mb-2 line-clamp-2">{agent.description}</p>

      {activeTask ? (
        <div className="bg-indigo-950/60 border border-indigo-800/50 p-2 rounded text-[11px] text-indigo-200">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-indigo-300">Executing...</span>
            <span className="animate-spin text-xs">⏳</span>
          </div>
          <div className="truncate font-mono text-[10px] text-indigo-400">{activeTask.prompt}</div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.map((cap) => (
            <span key={cap} className="text-[9px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
              {cap}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
