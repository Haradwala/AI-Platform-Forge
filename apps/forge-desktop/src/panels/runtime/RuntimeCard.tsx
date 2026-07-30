/**
 * RuntimeCard.tsx — Phase 23 Runtime Discovery Card
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useRuntimeStore } from '../../stores/runtime-store';
import type { DiscoveredRuntime, RuntimeWorkspaceEntry } from '../../types/runtime-workspace';

interface RuntimeCardProps {
  runtime: RuntimeWorkspaceEntry | DiscoveredRuntime;
  isSelected: boolean;
  onSelect: () => void;
}

export const RuntimeCard: React.FC<RuntimeCardProps> = ({ runtime, isSelected, onSelect }) => {
  const {
    activeRuntimeId,
    setActiveRuntime,
    startRuntime,
    stopRuntime,
    testRuntime,
    configureRuntime,
    openTerminalForRuntime,
    launchSession,
  } = useRuntimeStore();

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [customPathInput, setCustomPathInput] = useState('');

  const isDiscovered = 'installed' in runtime;
  const isInstalled = isDiscovered ? (runtime as DiscoveredRuntime).installed : true;
  const isActive = activeRuntimeId === runtime.id;
  const isRunning = runtime.status === 'running';

  const category = 'runtimeType' in runtime ? runtime.runtimeType : (runtime as DiscoveredRuntime).category;
  const execPath = 'executablePath' in runtime ? (runtime as DiscoveredRuntime).executablePath : null;
  const installUrl = 'installUrl' in runtime ? (runtime as DiscoveredRuntime).installUrl : undefined;
  const health = runtime.health || 'unknown';

  const getIcon = () => {
    switch (category) {
      case 'cli':
        return Lucide.Terminal;
      case 'cloud':
        return Lucide.Cloud;
      case 'mcp':
        return Lucide.Cpu;
      case 'external':
        return Lucide.Server;
      default:
        return Lucide.Box;
    }
  };

  const IconComponent = getIcon();

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customPathInput.trim()) {
      await configureRuntime(runtime.id, customPathInput.trim());
      setIsConfiguring(false);
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
        isSelected
          ? 'bg-forge-bg-elevated border-forge-accent ring-1 ring-forge-accent/40 shadow-lg'
          : 'bg-forge-bg-elevated/70 border-forge-border hover:border-forge-border-hover hover:bg-forge-bg-elevated'
      }`}
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg ${
              isRunning ? 'bg-indigo-500/10 text-indigo-400' : 'bg-forge-bg border border-forge-border text-forge-text-subtle'
            }`}
          >
            <IconComponent size={18} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-forge-text text-xs">{runtime.name}</span>
              {isActive && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              )}
            </div>
            <span className="text-[10px] text-forge-text-subtle font-mono">
              v{runtime.version || 'unknown'} • {category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Health & Status Badges */}
        <div className="flex items-center gap-1">
          <Badge
            variant={
              health === 'healthy'
                ? 'success'
                : health === 'degraded'
                ? 'warning'
                : health === 'unhealthy'
                ? 'error'
                : 'neutral'
            }
          >
            {health.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Executable Path Display */}
      {execPath && (
        <div className="mt-2 text-[10px] text-forge-text-subtle font-mono truncate px-2 py-1 rounded bg-forge-bg border border-forge-border/40 flex items-center justify-between">
          <span className="truncate" title={execPath}>📍 {execPath}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCustomPathInput(execPath);
              setIsConfiguring(true);
            }}
            title="Configure Path"
            className="text-forge-accent hover:underline ml-1"
          >
            Edit
          </button>
        </div>
      )}

      {/* Configuration Input Form Inline */}
      {isConfiguring && (
        <form onSubmit={handleSaveConfig} onClick={(e) => e.stopPropagation()} className="mt-2 flex items-center gap-1">
          <input
            type="text"
            placeholder="Executable path..."
            value={customPathInput}
            onChange={(e) => setCustomPathInput(e.target.value)}
            className="flex-1 px-2 py-0.5 bg-forge-bg border border-forge-border rounded text-[10px] text-forge-text focus:outline-none focus:border-forge-accent"
          />
          <button
            type="submit"
            className="px-2 py-0.5 rounded bg-forge-accent text-white font-bold text-[10px]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsConfiguring(false)}
            className="px-2 py-0.5 rounded bg-forge-bg-hover text-forge-text-subtle font-bold text-[10px]"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Capabilities Badges */}
      <div className="flex items-center gap-1 flex-wrap mt-2 font-mono text-[10px]">
        {runtime.capabilities.streaming && (
          <span className="px-1.5 py-0.5 rounded bg-forge-bg border border-forge-border/40 text-forge-text-muted">
            ⚡ Streaming
          </span>
        )}
        {runtime.capabilities.tools && (
          <span className="px-1.5 py-0.5 rounded bg-forge-bg border border-forge-border/40 text-forge-text-muted">
            🛠 Tools
          </span>
        )}
        {runtime.capabilities.mcp && (
          <span className="px-1.5 py-0.5 rounded bg-forge-bg border border-forge-border/40 text-forge-text-muted">
            🔌 MCP
          </span>
        )}
        {runtime.capabilities.approval && (
          <span className="px-1.5 py-0.5 rounded bg-forge-bg border border-forge-border/40 text-forge-text-muted">
            🛡 Approval
          </span>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex items-center justify-between gap-1.5 mt-3 pt-2 border-t border-forge-border/40 text-[11px] font-medium">
        <div className="flex items-center gap-1">
          {isInstalled && !isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveRuntime(runtime.id);
              }}
              className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-[10px] font-semibold"
            >
              Set Active
            </button>
          )}

          {isInstalled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                testRuntime(runtime.id);
              }}
              className="px-2 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-text hover:bg-forge-bg-hover text-[10px] font-semibold flex items-center gap-1"
            >
              <Lucide.Activity size={10} />
              <span>Test</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCustomPathInput(execPath || '');
              setIsConfiguring(true);
            }}
            className="px-2 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-text hover:bg-forge-bg-hover text-[10px] font-semibold flex items-center gap-1"
          >
            <Lucide.Settings size={10} />
            <span>Configure</span>
          </button>
        </div>

        {/* Install / Start / Stop Buttons */}
        <div>
          {!isInstalled && installUrl && (
            <a
              href={installUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-[10px] flex items-center gap-1"
            >
              <Lucide.Download size={10} />
              <span>Install</span>
            </a>
          )}

          {isInstalled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                launchSession(runtime.id);
              }}
              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm"
              title="Launch execution session for this runtime"
            >
              <Lucide.Zap size={10} />
              <span>Launch</span>
            </button>
          )}

          {isInstalled && !isRunning && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startRuntime(runtime.id);
              }}
              className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 font-bold text-[10px] flex items-center gap-1"
            >
              <Lucide.Play size={10} />
              <span>Start</span>
            </button>
          )}

          {isInstalled && isRunning && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopRuntime(runtime.id);
              }}
              className="px-2.5 py-1 rounded bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 font-bold text-[10px] flex items-center gap-1"
            >
              <Lucide.Square size={10} />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
