/**
 * ProjectOverviewPanel.tsx — Phase 25-28 Project Overview & Stack Summary Panel
 */

import React from 'react';
import { RuntimeRecommendationCard } from './RuntimeRecommendationCard';

interface ProjectOverviewPanelProps {
  analysis: any;
  profile?: any;
  onSelectRuntime?: (runtimeId: string) => void;
}

export const ProjectOverviewPanel: React.FC<ProjectOverviewPanelProps> = ({
  analysis,
  profile,
  onSelectRuntime,
}) => {
  if (!analysis) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-zinc-400 text-sm">
        No workspace project analysis available. Click "Analyze Workspace" to scan.
      </div>
    );
  }

  const recommendations = profile?.analysis?.runtimeRecommendations || analysis.recommendations || [];

  return (
    <div className="space-y-6 p-4">
      {/* High level info badges */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Project Overview</h2>
            <p className="text-xs text-zinc-400">Detected project stack, language topology, and framework features</p>
          </div>
          <span className="rounded bg-blue-950/80 border border-blue-800 px-3 py-1 text-xs font-semibold text-blue-300 capitalize">
            {analysis.projectType || 'Desktop Application'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-zinc-500 font-medium">Languages</span>
            <span className="font-semibold text-zinc-200">{analysis.languages?.join(', ') || 'TypeScript'}</span>
          </div>
          <div>
            <span className="block text-zinc-500 font-medium">Frameworks</span>
            <span className="font-semibold text-zinc-200">{analysis.frameworks?.join(', ') || 'React, Electron'}</span>
          </div>
          <div>
            <span className="block text-zinc-500 font-medium">Package Manager</span>
            <span className="font-semibold text-zinc-200">{analysis.packageManager || 'pnpm'}</span>
          </div>
          <div>
            <span className="block text-zinc-500 font-medium">Monorepo</span>
            <span className="font-semibold text-zinc-200">{analysis.isMonorepo ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      {/* Categorized AI Runtime recommendations */}
      <RuntimeRecommendationCard recommendations={recommendations} onSelectRuntime={onSelectRuntime} />

      {/* Entry points & Architecture Topology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h4 className="text-xs font-semibold text-zinc-300 mb-2">Detected Entry Points</h4>
          <ul className="space-y-1.5 font-mono text-xs text-zinc-400">
            {(analysis.entryPoints || []).map((ep: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2 rounded bg-zinc-950 p-2 border border-zinc-800">
                <span className="text-blue-400">⚡</span>
                {ep}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h4 className="text-xs font-semibold text-zinc-300 mb-2">Tooling & Environment</h4>
          <div className="space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span>Test Runner</span>
              <span className="text-zinc-200 font-medium">{analysis.testFramework || 'Vitest'}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span>CI Pipeline</span>
              <span className="text-zinc-200 font-medium">{analysis.ciProvider || 'GitHub Actions'}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span>Docker Support</span>
              <span className="text-zinc-200 font-medium">{analysis.hasDocker ? 'Detected' : 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
