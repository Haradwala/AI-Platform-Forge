/**
 * RuntimeLogs.tsx — Phase 22 Runtime Workspace Integration
 *
 * Real-time streaming log viewer with level filtering and copy/clear actions.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { useRuntimeStore } from '../../stores/runtime-store';

interface RuntimeLogsProps {
  runtimeId: string;
}

export const RuntimeLogs: React.FC<RuntimeLogsProps> = ({ runtimeId }) => {
  const { logs, addLog } = useRuntimeStore();
  const [levelFilter, setLevelFilter] = useState<'all' | 'LOG' | 'TOKEN' | 'ERROR'>('all');
  const [copied, setCopied] = useState(false);

  const runtimeLogList = logs[runtimeId] || [];

  const filteredLogs = runtimeLogList.filter((line) => {
    if (levelFilter === 'all') return true;
    return line.includes(`[${levelFilter}`);
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(filteredLogs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    useRuntimeStore.setState((state) => ({
      logs: { ...state.logs, [runtimeId]: [] },
    }));
  };

  return (
    <div className="flex flex-col h-full bg-forge-bg border-t border-forge-border text-xs font-mono select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-forge-bg-elevated border-b border-forge-border text-[11px]">
        <div className="flex items-center gap-2">
          <Lucide.FileText size={13} className="text-forge-accent" />
          <span className="font-semibold text-forge-text">Live Runtime Log Stream ({filteredLogs.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="bg-forge-bg border border-forge-border rounded px-1.5 py-0.5 text-[10px] text-forge-text focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="LOG">Logs</option>
            <option value="TOKEN">Tokens</option>
            <option value="ERROR">Errors</option>
          </select>

          <button
            onClick={handleCopy}
            title="Copy Logs"
            className="p-1 rounded hover:bg-forge-bg-hover text-forge-text-muted hover:text-forge-text cursor-pointer"
          >
            <Lucide.Copy size={12} />
          </button>

          <button
            onClick={handleClear}
            title="Clear Logs"
            className="p-1 rounded hover:bg-forge-bg-hover text-forge-text-muted hover:text-forge-text cursor-pointer"
          >
            <Lucide.Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Log Output Area */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-0.5 bg-[#0a0a0d]">
        {filteredLogs.length === 0 ? (
          <span className="text-forge-text-subtle italic">No log events recorded for this runtime session.</span>
        ) : (
          filteredLogs.map((log, index) => {
            const isError = log.includes('ERROR');
            const isToken = log.includes('TOKEN');
            return (
              <div
                key={index}
                className={`whitespace-pre-wrap ${
                  isError ? 'text-rose-400 font-semibold' : isToken ? 'text-emerald-400' : 'text-forge-text-muted'
                }`}
              >
                {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
