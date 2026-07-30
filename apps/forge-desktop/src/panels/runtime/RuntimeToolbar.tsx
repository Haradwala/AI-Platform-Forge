/**
 * RuntimeToolbar.tsx — Phase 23 Runtime Discovery & Environment Manager Toolbar
 */

import React from 'react';
import * as Lucide from 'lucide-react';
import { useRuntimeStore } from '../../stores/runtime-store';
import type { RuntimeTypeCategory } from '../../types/runtime-workspace';

export const RuntimeToolbar: React.FC = () => {
  const {
    filterCategory,
    searchQuery,
    isLoading,
    isDiscovering,
    activeTab,
    setFilterCategory,
    setSearchQuery,
    setActiveTab,
    discoverRuntimes,
    runDiagnostics,
    startAllRuntimes,
    stopAllRuntimes,
  } = useRuntimeStore();

  const categories: Array<{ id: 'all' | RuntimeTypeCategory; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'cli', label: 'CLI' },
    { id: 'cloud', label: 'Cloud API' },
    { id: 'mcp', label: 'MCP' },
    { id: 'external', label: 'External' },
    { id: 'local', label: 'Local' },
  ];

  const handleRefresh = async () => {
    await discoverRuntimes(true);
    await runDiagnostics();
  };

  return (
    <div className="flex flex-col border-b border-forge-border bg-forge-bg-elevated select-none">
      {/* Top View Selector Tabs */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-forge-border/40 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('installed')}
            className={`px-3 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'installed'
                ? 'bg-forge-bg border-t-2 border-forge-accent text-forge-text'
                : 'text-forge-text-subtle hover:text-forge-text'
            }`}
          >
            <Lucide.CheckCircle2 size={13} className="text-emerald-400" />
            <span>Installed Runtimes</span>
          </button>

          <button
            onClick={() => setActiveTab('missing')}
            className={`px-3 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'missing'
                ? 'bg-forge-bg border-t-2 border-forge-accent text-forge-text'
                : 'text-forge-text-subtle hover:text-forge-text'
            }`}
          >
            <Lucide.AlertCircle size={13} className="text-amber-400" />
            <span>Missing Runtimes</span>
          </button>

          <button
            onClick={() => setActiveTab('active_sessions')}
            className={`px-3 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'active_sessions'
                ? 'bg-forge-bg border-t-2 border-forge-accent text-forge-text'
                : 'text-forge-text-subtle hover:text-forge-text'
            }`}
          >
            <Lucide.PlayCircle size={13} className="text-emerald-400 animate-pulse" />
            <span>Active Sessions</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'bg-forge-bg border-t-2 border-forge-accent text-forge-text'
                : 'text-forge-text-subtle hover:text-forge-text'
            }`}
          >
            <Lucide.Stethoscope size={13} className="text-amber-400" />
            <span>Environment Doctor</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            title="Scan & Refresh Environment"
            className="px-2.5 py-1 rounded bg-forge-accent/20 hover:bg-forge-accent/30 text-forge-accent text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Lucide.RefreshCw size={12} className={isDiscovering || isLoading ? 'animate-spin' : ''} />
            <span>Refresh Discovery</span>
          </button>
        </div>
      </div>

      {/* Sub Toolbar for Filter & Category */}
      {activeTab !== 'diagnostics' && (
        <div className="flex items-center justify-between px-3 py-1.5 text-xs gap-2">
          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilterCategory(c.id)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  filterCategory === c.id
                    ? 'bg-forge-accent text-white font-semibold'
                    : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Lucide.Search size={12} className="absolute left-2 text-forge-text-subtle" />
              <input
                type="text"
                placeholder="Search runtimes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-2 py-0.5 bg-forge-bg border border-forge-border rounded text-[11px] text-forge-text focus:outline-none focus:border-forge-accent w-36"
              />
            </div>

            <button
              onClick={() => startAllRuntimes()}
              title="Start All"
              className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Lucide.Play size={11} />
              <span>Start All</span>
            </button>

            <button
              onClick={() => stopAllRuntimes()}
              title="Stop All"
              className="px-2 py-0.5 rounded bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Lucide.Square size={11} />
              <span>Stop All</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

