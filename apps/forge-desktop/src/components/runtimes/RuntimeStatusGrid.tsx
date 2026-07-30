/**
 * RuntimeStatusGrid.tsx — Active Runtimes Telemetry & Routing Decision Feed
 */

import React from 'react';

export const RuntimeStatusGrid: React.FC = () => {
  const runtimes = [
    { modelId: 'gpt-4o', provider: 'OpenAI', health: 'healthy', ttft: '110ms', tokSec: '52 tok/s', cost: '$0.005 / 1M' },
    { modelId: 'claude-3-5-sonnet', provider: 'Anthropic', health: 'healthy', ttft: '140ms', tokSec: '48 tok/s', cost: '$0.003 / 1M' },
    { modelId: 'gemini-1.5-pro', provider: 'Google Gemini', health: 'healthy', ttft: '190ms', tokSec: '60 tok/s', cost: '$0.0035 / 1M' },
    { modelId: 'llama3:8b', provider: 'Ollama (Local)', health: 'healthy', ttft: '25ms', tokSec: '75 tok/s', cost: '$0.00 (Local)' },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 space-y-6 overflow-y-auto">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-100">Runtime Telemetry & Health Dashboard</h2>
        <p className="text-xs text-slate-400">Live health monitoring, generation speed, and USD expenditure</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {runtimes.map((r) => (
          <div key={r.modelId} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400">{r.provider}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-900/80 text-emerald-300 uppercase">
                {r.health}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">{r.modelId}</h4>
            <div className="text-xs text-slate-400 space-y-1 font-mono pt-1">
              <div>TTFT: <span className="text-slate-200">{r.ttft}</span></div>
              <div>Speed: <span className="text-slate-200">{r.tokSec}</span></div>
              <div>Cost: <span className="text-emerald-400 font-bold">{r.cost}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
