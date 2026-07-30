/**
 * StudioHeader.tsx — Studio Header & Composable Panel Toggle Toolbar
 */

import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { PanelId } from '../../contracts/studio-types';

export const StudioHeader: React.FC = () => {
  const { panels, togglePanelVisibility } = useStudioStore();

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-100 border-b border-slate-800 select-none">
      <div className="flex items-center space-x-3">
        <span className="font-bold text-lg text-sky-400 tracking-wider">FORGE COCKPIT</span>
        <span className="text-xs text-slate-500 font-mono">Personal AI Engineering OS</span>

        <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {panels.map((panel) => (
            <button
              key={panel.id}
              onClick={() => togglePanelVisibility(panel.id as PanelId)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
                panel.isVisible
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {panel.title}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
