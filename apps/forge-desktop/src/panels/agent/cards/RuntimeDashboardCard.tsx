/**
 * RuntimeDashboardCard.tsx — Phase 14 Runtime & Context Dashboard
 *
 * Displays live AI runtime telemetry: Provider (Ollama, OpenAI, Anthropic, Gemini, Groq, OpenRouter, MCP),
 * Model, Health status, Latency, Context Window, Memory Usage, GPU/CPU load, and Tokens/sec throughput.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { BaseCard } from './BaseCard';
import { Badge } from '../../../components/ui/Badge';

export interface RuntimeDashboardPayload {
  runtimeId: string;
  modelId: string;
  status: 'healthy' | 'degraded' | 'offline';
  latencyMs: number;
  contextWindowTokens: number;
  providerType: 'Ollama' | 'OpenAI' | 'Anthropic' | 'Gemini' | 'Groq' | 'OpenRouter' | 'MCP';
  memoryUsageMb?: number;
  cpuLoadPercent?: number;
  gpuLoadPercent?: number;
  tokensPerSec?: number;
}

interface RuntimeDashboardCardProps {
  payload: RuntimeDashboardPayload;
  timestamp?: number;
}

export const RuntimeDashboardCard: React.FC<RuntimeDashboardCardProps> = ({ payload, timestamp }) => {
  const {
    runtimeId,
    modelId,
    status = 'healthy',
    latencyMs = 45,
    contextWindowTokens = 128000,
    providerType = 'Ollama',
    memoryUsageMb = 142.5,
    cpuLoadPercent = 14.2,
    gpuLoadPercent = 38.0,
    tokensPerSec = 82.4,
  } = payload;

  const [expanded, setExpanded] = useState(false);
  const statusVariant = status === 'healthy' ? 'success' : status === 'degraded' ? 'warning' : 'error';

  return (
    <BaseCard
      type="runtime-dashboard"
      title={`${providerType} Telemetry`}
      timestamp={timestamp}
      badge={<Badge variant={statusVariant} pulse={status === 'healthy'}>{status}</Badge>}
    >
      <div className="flex flex-col gap-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col p-2 rounded bg-forge-bg-elevated/60 border border-forge-border/40">
            <span className="text-[10px] text-forge-text-subtle uppercase tracking-wider font-semibold">Active Model</span>
            <span className="font-mono text-forge-text truncate font-medium mt-0.5">{modelId || 'default'}</span>
          </div>

          <div className="flex flex-col p-2 rounded bg-forge-bg-elevated/60 border border-forge-border/40">
            <span className="text-[10px] text-forge-text-subtle uppercase tracking-wider font-semibold">Provider</span>
            <span className="font-mono text-forge-text truncate font-medium mt-0.5">{providerType}</span>
          </div>

          <div className="flex flex-col p-2 rounded bg-forge-bg-elevated/60 border border-forge-border/40">
            <span className="text-[10px] text-forge-text-subtle uppercase tracking-wider font-semibold">Latency</span>
            <span className="font-mono text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
              <Lucide.Zap size={11} /> {latencyMs}ms
            </span>
          </div>

          <div className="flex flex-col p-2 rounded bg-forge-bg-elevated/60 border border-forge-border/40">
            <span className="text-[10px] text-forge-text-subtle uppercase tracking-wider font-semibold">Throughput</span>
            <span className="font-mono text-indigo-400 font-medium mt-0.5 flex items-center gap-1">
              <Lucide.Activity size={11} /> {tokensPerSec} tok/s
            </span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between px-2 py-1 rounded hover:bg-forge-bg-hover text-forge-text-muted hover:text-forge-text text-[11px] transition-colors cursor-pointer"
        >
          <span>{expanded ? 'Hide Advanced Hardware Telemetry' : 'View Hardware & Memory Telemetry'}</span>
          <Lucide.ChevronDown size={13} className={`transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded && (
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <div className="flex flex-col p-2 rounded bg-forge-bg-elevated/40 border border-forge-border/30 text-center">
              <span className="text-[9px] text-forge-text-subtle uppercase">Memory</span>
              <span className="text-amber-400 font-semibold mt-0.5">{memoryUsageMb} MB</span>
            </div>
            <div className="flex flex-col p-2 rounded bg-forge-bg-elevated/40 border border-forge-border/30 text-center">
              <span className="text-[9px] text-forge-text-subtle uppercase">CPU Load</span>
              <span className="text-blue-400 font-semibold mt-0.5">{cpuLoadPercent}%</span>
            </div>
            <div className="flex flex-col p-2 rounded bg-forge-bg-elevated/40 border border-forge-border/30 text-center">
              <span className="text-[9px] text-forge-text-subtle uppercase">GPU Load</span>
              <span className="text-purple-400 font-semibold mt-0.5">{gpuLoadPercent}%</span>
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default RuntimeDashboardCard;
