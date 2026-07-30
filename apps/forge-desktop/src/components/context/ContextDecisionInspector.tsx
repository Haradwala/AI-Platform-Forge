/**
 * ContextDecisionInspector.tsx — Context Window Allocation & AI Decision Inspector
 */

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';

export const ContextDecisionInspector: React.FC = () => {
  const { selectedDecision } = useStudioStore();

  const decision = selectedDecision || {
    id: 'dec_sample_1',
    agentRole: 'ArchitectAgent',
    modelId: 'claude-3-5-sonnet',
    actionName: 'Design Intelligence Subsystem',
    rationale: 'Selected SQLite-first storage architecture to scale to 1M+ LOC with low memory overhead.',
    confidenceScore: 0.96,
    alternativesConsidered: ['In-Memory Graph Store', 'PostgreSQL External Service'],
    promptTokens: 1450,
    completionTokens: 820,
    costUSD: 0.0078,
    timestamp: Date.now(),
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 space-y-6 overflow-y-auto">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-100">Context Window & AI Decision Inspector</h2>
        <p className="text-xs text-slate-400">Full auditability of prompt context, token choices, and model reasoning</p>
      </div>

      {/* Token Budget Breakdown */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token Allocation Breakdown</h3>
        <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex">
          <div className="bg-sky-500 h-full" style={{ width: '40%' }} title="System Instructions (40%)" />
          <div className="bg-purple-500 h-full" style={{ width: '30%' }} title="Code Snippets (30%)" />
          <div className="bg-amber-500 h-full" style={{ width: '15%' }} title="Memories & ADRs (15%)" />
          <div className="bg-emerald-500 h-full" style={{ width: '15%' }} title="Response Reserve (15%)" />
        </div>
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>System: 3,276 tok</span>
          <span>Code: 2,457 tok</span>
          <span>Memories: 1,228 tok</span>
          <span>Reserve: 1,228 tok</span>
        </div>
      </div>

      {/* AI Decision Inspector Panel */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-purple-900/80 border border-purple-700 text-purple-300 font-mono text-xs rounded font-bold">
              {decision.agentRole}
            </span>
            <span className="text-xs text-slate-400 font-mono">Model: {decision.modelId}</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 font-mono">
            Confidence: {(decision.confidenceScore * 100).toFixed(0)}%
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block font-medium">Target Action</span>
          <h4 className="text-base font-bold text-slate-100 mt-0.5">{decision.actionName}</h4>
        </div>

        <div>
          <span className="text-xs text-slate-400 block font-medium">Decision Rationale</span>
          <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-800 mt-1 font-mono leading-relaxed">
            {decision.rationale}
          </p>
        </div>

        <div>
          <span className="text-xs text-slate-400 block font-medium">Alternatives Considered & Rejected</span>
          <div className="flex space-x-2 mt-1">
            {decision.alternativesConsidered.map((alt, i) => (
              <span key={i} className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-400 text-xs rounded">
                ✕ {alt}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Prompt: {decision.promptTokens} tok | Output: {decision.completionTokens} tok</span>
          <span className="font-mono text-emerald-400 font-bold">${decision.costUSD.toFixed(4)} USD</span>
        </div>
      </div>
    </div>
  );
};
