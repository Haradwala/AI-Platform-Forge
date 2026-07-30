/**
 * ToolCard.tsx — Phase 15 Developer Workspace Experience
 *
 * Displays tool execution details: Tool Name, Status (running, completed, failed),
 * Arguments JSON payload, Duration ms, Result output, and execution Log stream.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { BaseCard } from './BaseCard';
import type { ToolPayload } from '../../../types/agent';
import { Badge } from '../../../components/ui/Badge';

interface ToolCardProps {
  payload: ToolPayload;
  timestamp?: number;
}

export const ToolCard: React.FC<ToolCardProps> = ({ payload, timestamp }) => {
  const {
    toolName = 'search_workspace',
    status = 'completed',
    args = { query: 'ExecutionOrchestrator', limit: 10 },
    result = { matchesCount: 14, files: ['execution-orchestrator.ts', 'ai-module.ts'] },
    error,
    durationMs = 82,
    logs = ['[INFO] Invoking tool search_workspace', '[INFO] Workspace ripgrep returned 14 matches in 82ms'],
  } = payload;

  const [expanded, setExpanded] = useState(false);
  const statusVariant = status === 'completed' ? 'success' : status === 'running' ? 'running' : 'error';

  const badge = (
    <div className="flex items-center gap-1.5 font-mono">
      <Badge variant={statusVariant} pulse={status === 'running'}>
        {status}
      </Badge>
      <span className="text-[10px] text-emerald-400 font-semibold">{durationMs}ms</span>
    </div>
  );

  return (
    <BaseCard type="tool" title={`Tool: ${toolName}`} timestamp={timestamp} badge={badge}>
      <div className="flex flex-col gap-2 text-xs font-mono">
        {/* Arguments Payload */}
        <div className="flex flex-col gap-1 p-2 rounded bg-forge-bg-elevated/60 border border-forge-border/40">
          <span className="text-[10px] text-forge-text-subtle uppercase font-semibold">Invocation Arguments</span>
          <pre className="text-[10px] text-forge-text-muted overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>

        {/* Output Result */}
        {result !== undefined && (
          <div className="flex flex-col gap-1 p-2 rounded bg-forge-bg-elevated/60 border border-forge-border/40">
            <span className="text-[10px] text-forge-text-subtle uppercase font-semibold">Result Output</span>
            <pre className="text-[10px] text-emerald-400 overflow-x-auto whitespace-pre-wrap max-h-36">
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[11px]">
            ❌ {error}
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between px-2 py-1 rounded hover:bg-forge-bg-hover text-forge-text-muted hover:text-forge-text text-[11px] transition-colors cursor-pointer"
            >
              <span>{expanded ? 'Hide Tool Logs' : `View Tool Logs (${logs.length})`}</span>
              <Lucide.ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>

            {expanded && (
              <div className="p-2 rounded bg-forge-bg border border-forge-border text-[10px] text-forge-text-muted max-h-32 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="leading-relaxed font-mono">• {log}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default ToolCard;
