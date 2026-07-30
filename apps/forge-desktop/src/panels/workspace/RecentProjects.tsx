/**
 * RecentProjects.tsx — Phase 25-28 Recent Projects & Workspaces List Component
 */

import React from 'react';

export interface RecentProjectItem {
  name: string;
  path: string;
  importedAt?: number;
  language?: string;
  framework?: string;
}

interface RecentProjectsProps {
  projects: RecentProjectItem[];
  onOpenProject: (path: string) => void;
  onImportClick?: () => void;
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({
  projects,
  onOpenProject,
  onImportClick,
}) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-zinc-100 shadow-md">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
        <h3 className="text-sm font-semibold text-zinc-200">Recent Projects</h3>
        {onImportClick && (
          <button
            onClick={onImportClick}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500"
          >
            + Import Repo
          </button>
        )}
      </div>

      {(!projects || projects.length === 0) ? (
        <div className="p-4 text-center text-xs text-zinc-500">
          No recent projects found. Import or open a project to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              onClick={() => onOpenProject(proj.path)}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 transition hover:border-blue-700/60 cursor-pointer group"
            >
              <div className="min-w-0 pr-3">
                <span className="block font-semibold text-xs text-zinc-200 group-hover:text-blue-400 truncate">
                  {proj.name}
                </span>
                <span className="block text-[10px] text-zinc-500 font-mono truncate">{proj.path}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {proj.framework && (
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                    {proj.framework}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProject(proj.path);
                  }}
                  className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
