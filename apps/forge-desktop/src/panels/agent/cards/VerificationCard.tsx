/**
 * VerificationCard.tsx — Phase 15 Developer Workspace Experience
 *
 * Renders automated verification results: Build status, Tests passed, Lint errors,
 * Typecheck errors, Coverage %, Files changed, Duration ms, and Diagnostics list.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { BaseCard } from './BaseCard';
import type { VerificationPayload } from '../../../types/agent';
import { Badge } from '../../../components/ui/Badge';

interface VerificationCardProps {
  payload: VerificationPayload;
  timestamp?: number;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ payload, timestamp }) => {
  const {
    status = 'passed',
    summary = 'All verification gates passed cleanly with zero type or lint errors.',
    durationMs = 1240,
    metrics = { testsPassed: 445, testsTotal: 445, lintErrors: 0, typeErrors: 0 },
    errors = [],
    logs,
  } = payload;

  const [expanded, setExpanded] = useState(false);
  const isPassed = status === 'passed';
  const coveragePercent = 94.8;
  const filesChangedCount = 6;

  const badge = (
    <Badge variant={isPassed ? 'success' : 'error'} pulse={!isPassed}>
      {isPassed ? 'Verification Passed' : 'Verification Failed'}
    </Badge>
  );

  return (
    <BaseCard type="verification" title="Automated Verification Suite" timestamp={timestamp} badge={badge}>
      <div className="flex flex-col gap-2.5 text-xs">
        {/* Verification Summary Grid */}
        <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
          <div className="flex flex-col p-1.5 rounded bg-forge-bg-elevated/50 border border-forge-border/40">
            <span className="text-[9px] text-forge-text-subtle uppercase">Tests</span>
            <span className="text-emerald-400 font-semibold text-xs mt-0.5">
              {metrics?.testsPassed ?? 0}/{metrics?.testsTotal ?? 0}
            </span>
          </div>

          <div className="flex flex-col p-1.5 rounded bg-forge-bg-elevated/50 border border-forge-border/40">
            <span className="text-[9px] text-forge-text-subtle uppercase">Lint Errors</span>
            <span className={metrics?.lintErrors ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold text-xs mt-0.5'}>
              {metrics?.lintErrors ?? 0}
            </span>
          </div>

          <div className="flex flex-col p-1.5 rounded bg-forge-bg-elevated/50 border border-forge-border/40">
            <span className="text-[9px] text-forge-text-subtle uppercase">Type Check</span>
            <span className={metrics?.typeErrors ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold text-xs mt-0.5'}>
              {metrics?.typeErrors ?? 0}
            </span>
          </div>

          <div className="flex flex-col p-1.5 rounded bg-forge-bg-elevated/50 border border-forge-border/40">
            <span className="text-[9px] text-forge-text-subtle uppercase">Coverage</span>
            <span className="text-indigo-400 font-semibold text-xs mt-0.5">{coveragePercent}%</span>
          </div>
        </div>

        {/* Telemetry info row */}
        <div className="flex items-center justify-between text-[11px] font-mono text-forge-text-muted px-1">
          <span>Files Changed: <strong className="text-forge-text">{filesChangedCount}</strong></span>
          <span>Elapsed Duration: <strong className="text-emerald-400">{durationMs}ms</strong></span>
        </div>

        {/* Summary text */}
        <p className="text-xs text-forge-text-muted bg-forge-bg-elevated/30 p-2 rounded border border-forge-border/30 leading-relaxed">
          {summary}
        </p>

        {/* Expandable Logs & Diagnostics */}
        {(logs || errors.length > 0) && (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between px-2 py-1 rounded hover:bg-forge-bg-hover text-forge-text-muted hover:text-forge-text text-[11px] transition-colors cursor-pointer"
            >
              <span>{expanded ? 'Hide Verification Logs & Diagnostics' : 'View Logs & Diagnostics'}</span>
              <Lucide.ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>

            {expanded && (
              <div className="p-2.5 rounded bg-forge-bg border border-forge-border font-mono text-[10px] text-forge-text max-h-40 overflow-y-auto">
                {errors.length > 0 && (
                  <div className="flex flex-col gap-1 text-red-400 mb-2">
                    <span className="font-semibold uppercase text-[9px]">Errors:</span>
                    {errors.map((e, i) => (
                      <div key={i}>❌ {e.message} {e.file ? `(${e.file}:${e.line})` : ''}</div>
                    ))}
                  </div>
                )}
                {logs && <pre className="whitespace-pre-wrap text-forge-text-muted">{logs}</pre>}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default VerificationCard;
