/**
 * AgentWorkspacePanel.tsx — Phase 30 Multi-Agent Workspace Dashboard Panel
 */

import React, { useEffect, useState } from 'react';
import { useAgentStore } from '../../stores/agent-store';
import { AgentCard } from './AgentCard';
import { AgentTimeline } from './AgentTimeline';
import { AgentDetailsDrawer } from './AgentDetailsDrawer';

export const AgentWorkspacePanel: React.FC<{ workspaceRoot?: string }> = ({ workspaceRoot }) => {
  const { agents, loadAgents, loadMemory, runWorkflow, activeTasks } = useAgentStore();
  const [goal, setGoal] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadAgents();
    if (workspaceRoot) {
      loadMemory(workspaceRoot);
    }
  }, [workspaceRoot, loadAgents, loadMemory]);

  const handleStartWorkflow = async () => {
    if (!goal.trim() || isRunning) return;
    setIsRunning(true);
    try {
      await runWorkflow(goal, workspaceRoot || '');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 border-l border-slate-800 w-96">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-indigo-400 font-bold text-sm">🤖</span>
          <span className="font-bold text-xs uppercase tracking-wider text-slate-100">Multi-Agent Workspace</span>
        </div>
        <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded-full font-mono">
          {agents.length} Roles
        </span>
      </div>

      <div className="p-3 border-b border-slate-800 bg-slate-900/60 space-y-2">
        <label className="text-[10px] font-semibold text-slate-400 uppercase">Trigger Autonomous Agent Workflow</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Build authentication REST API & run tests"
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleStartWorkflow}
            disabled={isRunning || !goal.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            {isRunning ? 'Running...' : 'Launch'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Registered Agent Roles</div>
          <div className="grid grid-cols-1 gap-2">
            {agents.map((agent) => (
              <AgentCard key={agent.role} agent={agent} />
            ))}
          </div>
        </div>

        <AgentTimeline />
      </div>

      <AgentDetailsDrawer />
    </div>
  );
};
