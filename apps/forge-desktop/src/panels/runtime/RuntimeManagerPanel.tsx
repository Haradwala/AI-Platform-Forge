/**
 * RuntimeManagerPanel.tsx — Phase 23 Runtime Discovery & Environment Manager Panel
 */

import React, { useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { useRuntimeStore } from '../../stores/runtime-store';
import { RuntimeToolbar } from './RuntimeToolbar';
import { RuntimeCard } from './RuntimeCard';
import { RuntimeDetails } from './RuntimeDetails';
import { RuntimeLogs } from './RuntimeLogs';
import { EnvironmentDoctorView } from './EnvironmentDoctorView';
import { RuntimeSessionView } from './RuntimeSessionView';

interface RuntimeManagerPanelProps {
  onClose?: () => void;
}

export const RuntimeManagerPanel: React.FC<RuntimeManagerPanelProps> = ({ onClose }) => {
  const {
    installedRuntimes,
    discoveredRuntimes,
    selectedRuntimeId,
    selectedSessionId,
    activeSessions,
    filterCategory,
    searchQuery,
    activeTab,
    setSelectedRuntime,
    setSelectedSession,
    discoverRuntimes,
    loadActiveSessions,
  } = useRuntimeStore();

  useEffect(() => {
    discoverRuntimes();
    loadActiveSessions();
  }, [discoverRuntimes, loadActiveSessions]);

  // Combine default runtimes with discovered runtimes
  const allRuntimes = discoveredRuntimes.length > 0 ? discoveredRuntimes : (installedRuntimes as any[]);

  const filteredRuntimes = allRuntimes.filter((r) => {
    const isInstalled = 'installed' in r ? r.installed : true;
    if (activeTab === 'installed' && !isInstalled) return false;
    if (activeTab === 'missing' && isInstalled) return false;

    const cat = 'runtimeType' in r ? r.runtimeType : r.category;
    if (filterCategory !== 'all' && cat !== filterCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedRuntime = allRuntimes.find((r) => r.id === selectedRuntimeId) || filteredRuntimes[0] || allRuntimes[0];
  const selectedSession = activeSessions.find((s) => s.sessionId === selectedSessionId) || activeSessions[0];

  return (
    <div className="flex flex-col h-full bg-forge-bg border border-forge-border rounded-lg overflow-hidden select-none">
      <PanelHeader icon={<Lucide.Server size={14} />} title="Runtime Discovery & Execution Hub" onClose={onClose} />

      {/* Top Action Toolbar */}
      <RuntimeToolbar />

      {/* Main Workspace Body */}
      {activeTab === 'diagnostics' ? (
        <div className="flex-1 overflow-hidden">
          <EnvironmentDoctorView />
        </div>
      ) : activeTab === 'active_sessions' ? (
        <div className="flex-1 flex overflow-hidden p-3 gap-3">
          {/* Active Sessions List */}
          <div className="w-72 bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-y-auto space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Execution Sessions</h4>
            {activeSessions.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-3 text-center">No active sessions. Click "Launch" on a runtime to start one.</div>
            ) : (
              activeSessions.map((s) => (
                <div
                  key={s.sessionId}
                  onClick={() => setSelectedSession(s.sessionId)}
                  className={`p-3 rounded border cursor-pointer transition ${
                    selectedSession?.sessionId === s.sessionId
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono font-semibold">
                    <span>{s.sessionId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">{s.status}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Runtime: {s.runtimeId}</div>
                </div>
              ))
            )}
          </div>

          {/* Active Session Inspector View */}
          <div className="flex-1 h-full overflow-hidden">
            {selectedSession ? (
              <RuntimeSessionView session={selectedSession} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                <Lucide.PlayCircle size={32} className="mb-2 opacity-50" />
                <span>Select an active session to inspect execution telemetry, logs, tools, and terminal.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Runtime Cards Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            {filteredRuntimes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-forge-text-subtle text-xs gap-2">
                <Lucide.ServerOff size={28} />
                <span>No runtimes match the current search or category filter.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredRuntimes.map((runtime) => (
                  <RuntimeCard
                    key={runtime.id}
                    runtime={runtime}
                    isSelected={selectedRuntimeId === runtime.id}
                    onSelect={() => setSelectedRuntime(runtime.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Runtime Inspector Drawer */}
          {selectedRuntime && (
            <div className="w-80 h-full flex-shrink-0 border-l border-forge-border">
              <RuntimeDetails runtime={selectedRuntime} />
            </div>
          )}
        </div>
      )}

      {/* Bottom Live Logs Stream Drawer */}
      {selectedRuntime && activeTab !== 'diagnostics' && (
        <div className="h-40 flex-shrink-0">
          <RuntimeLogs runtimeId={selectedRuntime.id} />
        </div>
      )}
    </div>
  );
};

export default RuntimeManagerPanel;

