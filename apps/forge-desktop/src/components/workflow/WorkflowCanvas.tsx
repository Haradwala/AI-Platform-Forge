/**
 * WorkflowCanvas.tsx — Visual DAG Workflow Graph Canvas & Step Inspector
 */

import React, { useState } from 'react';

export interface WorkflowStepNode {
  id: string;
  name: string;
  type: 'build' | 'test' | 'lint' | 'format' | 'git' | 'agent';
  status: 'pending' | 'running' | 'passed' | 'failed';
}

export const WorkflowCanvas: React.FC = () => {
  const [steps, setSteps] = useState<WorkflowStepNode[]>([
    { id: 'step-1', name: 'Lint & Format', type: 'lint', status: 'passed' },
    { id: 'step-2', name: 'Run Unit Tests', type: 'test', status: 'passed' },
    { id: 'step-3', name: 'AI Code Review', type: 'agent', status: 'running' },
    { id: 'step-4', name: 'Build Desktop Dist', type: 'build', status: 'pending' },
  ]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100">Workflow Studio — Visual DAG Editor</h2>
          <p className="text-xs text-slate-400">Drag-and-drop automation pipeline authoring</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded text-xs">
          Run Pipeline
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center space-x-6 bg-slate-900/50 border border-slate-800 rounded-xl p-8 overflow-x-auto">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="w-56 p-4 bg-slate-900 border border-slate-700 rounded-lg shadow-lg flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-sky-400 font-bold">{step.type}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    step.status === 'passed'
                      ? 'bg-emerald-900/80 text-emerald-300'
                      : step.status === 'running'
                      ? 'bg-amber-900/80 text-amber-300 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.status}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100">{step.name}</h4>
            </div>

            {idx < steps.length - 1 && (
              <div className="text-slate-600 font-bold text-lg">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
