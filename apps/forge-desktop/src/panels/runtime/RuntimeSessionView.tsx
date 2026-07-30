/**
 * RuntimeSessionView.tsx — Phase 24 Session Inspector View
 *
 * Detailed execution inspector for active runtime sessions with sub-tabs:
 * [Output] [Terminal] [Tools] [Timeline] [Telemetry] [Artifacts]
 */

import React, { useState } from 'react';
import { useRuntimeStore } from '../../stores/runtime-store';
import type { RuntimeSessionEntry } from '../../types/runtime-workspace';
import {
  Play,
  Square,
  RotateCw,
  Terminal,
  Activity,
  Wrench,
  Clock,
  FileCode,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  session: RuntimeSessionEntry;
}

export const RuntimeSessionView: React.FC<Props> = ({ session }) => {
  const { stopSession, restartSession, respondApproval } = useRuntimeStore();
  const [activeSubTab, setActiveSubTab] = useState<'output' | 'terminal' | 'tools' | 'timeline' | 'telemetry' | 'artifacts'>('output');

  const elapsedTimeSec = Math.floor(
    ((session.endTime || Date.now()) - session.startTime) / 1000
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
      case 'STREAMING':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'WAITING_APPROVAL':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'COMPLETED':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'FAILED':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Session Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-sm text-slate-300 font-semibold">{session.sessionId}</span>
          <span className="text-xs text-slate-400">({session.runtimeId})</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono ${getStatusColor(session.status)}`}>
            {session.status}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => restartSession(session.sessionId)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
            title="Restart Session"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => stopSession(session.sessionId)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
            title="Stop Session"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Approval Banner if WAITING_APPROVAL */}
      {(session.status as string) === 'WAITING_APPROVAL' && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-300 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Runtime is requesting approval for tool execution or file modification.</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => respondApproval(session.sessionId, 'req_1', 'approve')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center space-x-1"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => respondApproval(session.sessionId, 'req_1', 'reject')}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded flex items-center space-x-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => respondApproval(session.sessionId, 'req_1', 'cancel')}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex items-center px-4 bg-slate-900 border-b border-slate-800 space-x-1 text-xs">
        {[
          { id: 'output', label: 'Output', icon: Play },
          { id: 'terminal', label: 'Terminal', icon: Terminal },
          { id: 'tools', label: 'Tools', icon: Wrench },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'telemetry', label: 'Telemetry', icon: Activity },
          { id: 'artifacts', label: 'Artifacts', icon: FileCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium transition ${
                active
                  ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab Content Area */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300">
        {activeSubTab === 'output' && (
          <div className="space-y-2">
            {session.logs.map((log, idx) => (
              <div key={idx} className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'terminal' && (
          <div className="h-full bg-slate-950 p-3 rounded border border-slate-800 flex flex-col justify-between">
            <div className="text-slate-400">
              <div>$ pty bound to terminal: {session.terminalSessionId || 'term_rt_active'}</div>
              <div>$ workspace root: {session.workspaceRoot}</div>
            </div>
            <div className="text-emerald-400 font-semibold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive PTY Terminal Active</span>
            </div>
          </div>
        )}

        {activeSubTab === 'tools' && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">3-Stage Tool Activity Lifecycle</h4>
            {session.toolCalls.length === 0 ? (
              <div className="text-slate-500 italic">No tool calls recorded for this session.</div>
            ) : (
              session.toolCalls.map((tc) => (
                <div key={tc.id} className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
                  <div>
                    <span className="text-indigo-400 font-semibold">{tc.name}</span>
                    <span className="text-slate-500 text-xs ml-2">({tc.id})</span>
                    {tc.result && <div className="text-slate-400 text-xs mt-1">Result: {tc.result}</div>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                    tc.status === 'finished' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    tc.status === 'started' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {tc.status.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'timeline' && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Event History Stream</h4>
            {(session.eventHistory || []).map((evt: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-3 py-1 border-b border-slate-800/40 text-xs">
                <span className="text-slate-500">{new Date(evt.timestamp || Date.now()).toLocaleTimeString()}</span>
                <span className="text-indigo-400 font-semibold">{evt.type}</span>
                <span className="text-slate-300">{evt.message}</span>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'telemetry' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded">
              <div className="text-slate-500 text-xs uppercase mb-1">Session Duration</div>
              <div className="text-xl font-bold text-white">{elapsedTimeSec}s</div>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded">
              <div className="text-slate-500 text-xs uppercase mb-1">Total Token Usage</div>
              <div className="text-xl font-bold text-emerald-400">{session.tokens || 0}</div>
            </div>
            <div className="col-span-2 p-4 bg-slate-950 border border-slate-800 rounded">
              <div className="text-slate-500 text-xs uppercase mb-2">Negotiated Capabilities Handshake</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(session.capabilities || {}).map(([key, val]) => (
                  <span key={key} className={`text-xs px-2.5 py-1 rounded border font-mono ${val ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                    {key}: {val ? 'YES' : 'NO'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'artifacts' && (
          <div className="text-slate-400 space-y-2">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
              <span>.forge/runtime-sessions.json</span>
              <span className="text-xs text-indigo-400">Persisted JSON Storage</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
