/**
 * ComposablePanelGrid.tsx — Modular Panel Grid Workbench for Personal OS
 */

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { AgentExecutionGraphPanel } from '../agents/AgentExecutionGraphPanel';
import { ContextDecisionInspector } from '../context/ContextDecisionInspector';
import { RuntimeStatusGrid } from '../runtimes/RuntimeStatusGrid';
import { KnowledgeGraphCanvas } from '../graph/KnowledgeGraphCanvas';
import { TimelineCanvas } from '../timeline/TimelineCanvas';

export const ComposablePanelGrid: React.FC = () => {
  const { panels, timelineEvents } = useStudioStore();

  const dummyTimelineEvents = timelineEvents.length > 0 ? timelineEvents : [
    { id: 'evt-1', type: 'agent.reasoning.step', subsystem: 'agent' as const, timestamp: Date.now() - 40000, message: 'PlannerAgent decomposed task into subtasks' },
    { id: 'evt-2', type: 'runtime.routing.decision', subsystem: 'runtime' as const, timestamp: Date.now() - 30000, message: 'Routed request to claude-3-5-sonnet (Latency: 140ms)' },
    { id: 'evt-3', type: 'intelligence.context.assembled', subsystem: 'intelligence' as const, timestamp: Date.now() - 10000, message: 'Assembled prompt context: 3,276 tokens' },
  ];

  return (
    <div className="flex-1 grid grid-cols-12 grid-rows-3 gap-3 p-3 bg-slate-950 h-full overflow-hidden">
      {/* Main Execution & Timeline Viewport */}
      <div className="col-span-8 row-span-2 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-300 font-bold">
          <span>CENTRAL TIMELINE EVENT BACKBONE & REPLAY</span>
          <span className="text-[10px] text-sky-400 font-mono">engineering.timeline</span>
        </div>
        <TimelineCanvas events={dummyTimelineEvents.map((e) => ({ ...e, source: e.subsystem }))} />
      </div>

      {/* Agent Execution Graph Panel */}
      <div className="col-span-4 row-span-2">
        <AgentExecutionGraphPanel />
      </div>

      {/* Runtime Telemetry Panel */}
      <div className="col-span-4 row-span-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <RuntimeStatusGrid />
      </div>

      {/* AI Context & Decision Inspector */}
      <div className="col-span-4 row-span-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <ContextDecisionInspector />
      </div>

      {/* Knowledge Graph Panel */}
      <div className="col-span-4 row-span-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <KnowledgeGraphCanvas nodes={[]} edges={[]} />
      </div>
    </div>
  );
};
