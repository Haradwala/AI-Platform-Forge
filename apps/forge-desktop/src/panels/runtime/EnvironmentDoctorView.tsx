/**
 * EnvironmentDoctorView.tsx — Phase 23 Environment Diagnostics View
 */

import React, { useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { useRuntimeStore } from '../../stores/runtime-store';

export const EnvironmentDoctorView: React.FC = () => {
  const { diagnostics, runDiagnostics } = useRuntimeStore();

  useEffect(() => {
    if (!diagnostics) {
      runDiagnostics();
    }
  }, [diagnostics, runDiagnostics]);

  if (!diagnostics) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-forge-text-subtle text-xs gap-2 p-6">
        <Lucide.RefreshCw size={24} className="animate-spin text-forge-accent" />
        <span>Running environment diagnostics...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto gap-4 select-none font-mono text-xs">
      {/* System Information Banner */}
      <div className="p-3.5 rounded-xl bg-forge-bg-elevated border border-forge-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Lucide.Monitor size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-forge-text text-xs">System Environment</span>
            <span className="text-[11px] text-forge-text-subtle">
              OS: {diagnostics.systemInfo.platform.toUpperCase()} ({diagnostics.systemInfo.arch}) • Node: {diagnostics.systemInfo.nodeVersion}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-2 py-1 rounded bg-forge-bg border border-forge-border text-forge-text-muted font-semibold">
            PATH Dirs: {diagnostics.systemInfo.pathDirsCount}
          </span>
          <button
            onClick={() => runDiagnostics()}
            className="px-2.5 py-1 rounded bg-forge-accent text-white hover:bg-forge-accent-hover font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Lucide.RefreshCw size={12} />
            <span>Re-diagnose</span>
          </button>
        </div>
      </div>

      {/* Missing Dependencies Warnings */}
      {diagnostics.missingDependencies.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Lucide.AlertTriangle size={16} />
            <span>Missing System Dependencies ({diagnostics.missingDependencies.length})</span>
          </div>
          <p className="text-[11px] text-forge-text-muted">
            The following external tools or runtime engines were not detected in system PATH:
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {diagnostics.missingDependencies.map((dep) => (
              <span
                key={dep}
                className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase"
              >
                ⚠️ {dep}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostic Issues & Recommendations */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-forge-text uppercase">Diagnostic Recommendations</span>
        {diagnostics.issues.length === 0 ? (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-2 font-semibold">
            <Lucide.CheckCircle2 size={16} />
            <span>No environment issues or PATH anomalies detected!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {diagnostics.issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3 rounded-lg border flex flex-col gap-1.5 ${
                  issue.severity === 'error'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : issue.severity === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-indigo-500/10 border-indigo-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {issue.severity === 'error' && <Lucide.XCircle size={14} className="text-rose-400" />}
                    {issue.severity === 'warning' && <Lucide.AlertCircle size={14} className="text-amber-400" />}
                    {issue.severity === 'info' && <Lucide.Info size={14} className="text-indigo-400" />}
                    <span className="text-forge-text">{issue.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-forge-text-subtle">
                    {issue.severity}
                  </span>
                </div>
                <p className="text-[11px] text-forge-text-muted leading-relaxed">{issue.description}</p>
                <div className="p-2 rounded bg-forge-bg/60 border border-forge-border/40 text-[10px] text-forge-text-subtle">
                  💡 <span className="font-semibold text-forge-text font-mono">Fix: {issue.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Environment Variables Table (Secrets Redacted) */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-forge-text uppercase">Tracked Environment Variables</span>
        <div className="rounded-lg border border-forge-border overflow-hidden bg-forge-bg-elevated">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-forge-bg border-b border-forge-border text-forge-text-subtle font-semibold">
                <th className="p-2">Variable</th>
                <th className="p-2">Status</th>
                <th className="p-2">Value (Redacted Secrets)</th>
              </tr>
            </thead>
            <tbody>
              {diagnostics.environmentVariables.map((ev) => (
                <tr key={ev.key} className="border-b border-forge-border/40 hover:bg-forge-bg-hover">
                  <td className="p-2 font-bold text-forge-text">{ev.key}</td>
                  <td className="p-2">
                    {ev.status === 'set' ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">
                        SET
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[9px]">
                        MISSING
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-forge-text-subtle font-mono">
                    {ev.value || <span className="italic text-forge-text-subtle/50">not set</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
