/**
 * ContextInspectorCard.tsx — Phase 14 Runtime & Context Dashboard
 *
 * Visualizes ContextEngine output with collapsible read-only sections:
 * Goal, Workspace, Files, Memory, Diagnostics, Terminal, Git Diff, Symbols,
 * Retrieved Context, Prompt Preview, and Estimated Tokens.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { BaseCard } from './BaseCard';

export interface ContextInspectorPayload {
  goal: string;
  workspaceRoot?: string;
  openFiles?: string[];
  memoryCount?: number;
  gitStatus?: string;
  diagnosticsCount?: number;
  symbolCount?: number;
  estimatedTokens?: number;
  retrievedContext?: string[];
  promptPreview?: string;
  terminalSnippet?: string;
}

interface ContextInspectorCardProps {
  payload: ContextInspectorPayload;
  timestamp?: number;
}

export const ContextInspectorCard: React.FC<ContextInspectorCardProps> = ({ payload, timestamp }) => {
  const {
    goal,
    workspaceRoot = 'E:\\Antigravity-clone',
    openFiles = ['src/types/agent.ts', 'src/panels/agent/RunTimeline.tsx'],
    memoryCount = 3,
    gitStatus = 'Clean working tree',
    diagnosticsCount = 0,
    symbolCount = 42,
    estimatedTokens = 2450,
    retrievedContext = [
      'ADR-001 Runtime Kernel: Unified event stream protocol',
      'MemoryEngine: Vector index query return k=5 relevant notes',
    ],
    promptPreview = 'System Prompt: You are Antigravity AI Engine operating on Forge IDE...',
    terminalSnippet = '$ pnpm --filter @forge/desktop dev\n> Vite dev server running at http://localhost:5173',
  } = payload;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    goal: true,
    files: false,
    retrieved: false,
    prompt: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <BaseCard
      type="context-inspector"
      title="Structured Context Package"
      timestamp={timestamp}
      badge={
        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
          <Lucide.Layers size={11} /> {estimatedTokens} Tokens
        </span>
      }
    >
      <div className="flex flex-col gap-2 text-xs">
        {/* Goal Section */}
        <div className="flex flex-col rounded bg-forge-bg-elevated/60 border border-forge-border/40 overflow-hidden">
          <button
            onClick={() => toggleSection('goal')}
            className="flex items-center justify-between px-2.5 py-1.5 bg-forge-bg text-[11px] font-semibold text-forge-text hover:bg-forge-bg-hover transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Lucide.Target size={12} className="text-forge-accent" /> Target Goal
            </span>
            <Lucide.ChevronDown size={13} className={`transition-transform ${openSections.goal ? 'rotate-180' : ''}`} />
          </button>
          {openSections.goal && (
            <div className="p-2 text-forge-text font-mono text-[11px] bg-forge-bg-elevated/30">
              {goal}
            </div>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
          <div className="flex flex-col p-1.5 rounded bg-forge-bg-elevated/40 border border-forge-border/30">
            <span className="text-[9px] text-forge-text-subtle uppercase">Tabs</span>
            <span className="text-indigo-400 font-semibold text-xs mt-0.5">{openFiles.length}</span>
          </div>
          <div className="flex flex-col p-1.5 rounded bg-forge-bg-elevated/40 border border-forge-border/30">
            <span className="text-[9px] text-forge-text-subtle uppercase">Memory</span>
            <span className="text-emerald-400 font-semibold text-xs mt-0.5">{memoryCount}</span>
          </div>
          <div className="flex flex-col p-1.5 rounded bg-forge-bg-elevated/40 border border-forge-border/30">
            <span className="text-[9px] text-forge-text-subtle uppercase">Symbols</span>
            <span className="text-amber-400 font-semibold text-xs mt-0.5">{symbolCount}</span>
          </div>
          <div className="flex flex-col p-1.5 rounded bg-forge-bg-elevated/40 border border-forge-border/30">
            <span className="text-[9px] text-forge-text-subtle uppercase">Diag</span>
            <span className="text-emerald-400 font-semibold text-xs mt-0.5">{diagnosticsCount}</span>
          </div>
        </div>

        {/* Retrieved Context Section */}
        <div className="flex flex-col rounded bg-forge-bg-elevated/60 border border-forge-border/40 overflow-hidden">
          <button
            onClick={() => toggleSection('retrieved')}
            className="flex items-center justify-between px-2.5 py-1.5 bg-forge-bg text-[11px] font-semibold text-forge-text hover:bg-forge-bg-hover transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Lucide.FileSearch size={12} className="text-indigo-400" /> Retrieved Context ({retrievedContext.length})
            </span>
            <Lucide.ChevronDown size={13} className={`transition-transform ${openSections.retrieved ? 'rotate-180' : ''}`} />
          </button>
          {openSections.retrieved && (
            <div className="flex flex-col gap-1 p-2 bg-forge-bg-elevated/30 font-mono text-[10px]">
              {retrievedContext.map((ctx, i) => (
                <div key={i} className="p-1 rounded bg-forge-bg border border-forge-border/40 text-forge-text-muted">
                  • {ctx}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prompt Preview Section */}
        <div className="flex flex-col rounded bg-forge-bg-elevated/60 border border-forge-border/40 overflow-hidden">
          <button
            onClick={() => toggleSection('prompt')}
            className="flex items-center justify-between px-2.5 py-1.5 bg-forge-bg text-[11px] font-semibold text-forge-text hover:bg-forge-bg-hover transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Lucide.MessageSquare size={12} className="text-amber-400" /> System Prompt Preview
            </span>
            <Lucide.ChevronDown size={13} className={`transition-transform ${openSections.prompt ? 'rotate-180' : ''}`} />
          </button>
          {openSections.prompt && (
            <div className="p-2 bg-forge-bg font-mono text-[10px] text-forge-text-muted overflow-x-auto max-h-32">
              <pre className="whitespace-pre-wrap">{promptPreview}</pre>
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default ContextInspectorCard;
