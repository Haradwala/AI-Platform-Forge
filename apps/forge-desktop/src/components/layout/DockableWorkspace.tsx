/**
 * DockableWorkspace.tsx — Multi-Panel Dockable Workspace Container
 */

import React from 'react';

interface DockableWorkspaceProps {
  leftSidebar?: React.ReactNode;
  centerViewport: React.ReactNode;
  rightSidebar?: React.ReactNode;
  bottomDrawer?: React.ReactNode;
}

export const DockableWorkspace: React.FC<DockableWorkspaceProps> = ({
  leftSidebar,
  centerViewport,
  rightSidebar,
  bottomDrawer,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {leftSidebar && (
          <aside className="w-64 border-r border-slate-800 bg-slate-900/60 overflow-y-auto">
            {leftSidebar}
          </aside>
        )}

        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {centerViewport}
        </main>

        {rightSidebar && (
          <aside className="w-80 border-l border-slate-800 bg-slate-900/60 overflow-y-auto">
            {rightSidebar}
          </aside>
        )}
      </div>

      {bottomDrawer && (
        <div className="h-64 border-t border-slate-800 bg-slate-900/80 overflow-hidden">
          {bottomDrawer}
        </div>
      )}
    </div>
  );
};
