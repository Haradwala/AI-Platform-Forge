/**
 * WorkspaceMapPanel.tsx — Phase 15 Developer Workspace Experience
 *
 * Visualizes workspace folders, files, dependencies, symbols, classes, functions, and call graph.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { PanelHeader } from '../../components/ui/PanelHeader';

interface MapNode {
  id: string;
  name: string;
  kind: 'folder' | 'file' | 'class' | 'function' | 'dependency';
  children?: MapNode[];
  detail?: string;
}

const SAMPLE_MAP: MapNode[] = [
  {
    id: 'src',
    name: 'src/',
    kind: 'folder',
    children: [
      {
        id: 'panels',
        name: 'panels/',
        kind: 'folder',
        children: [
          {
            id: 'agent',
            name: 'agent/',
            kind: 'folder',
            children: [
              { id: 'AgentPanelShell', name: 'AgentPanelShell.tsx', kind: 'file', detail: 'Main container' },
              { id: 'RunTimeline', name: 'RunTimeline.tsx', kind: 'file', detail: 'Live timeline' },
              { id: 'DiffCard', name: 'DiffCard.tsx', kind: 'file', detail: 'Hunk & file review' },
            ],
          },
        ],
      },
      {
        id: 'stores',
        name: 'stores/',
        kind: 'folder',
        children: [
          { id: 'run-store', name: 'run-store.ts', kind: 'file', detail: 'Zustand run state' },
          { id: 'agent-store', name: 'agent-store.ts', kind: 'file', detail: 'Zustand agent config' },
        ],
      },
    ],
  },
  {
    id: 'classes',
    name: 'Core Classes & Engines',
    kind: 'class',
    children: [
      { id: 'ExecutionOrchestrator', name: 'ExecutionOrchestrator', kind: 'class', detail: '10-stage engine' },
      { id: 'ContextEngine', name: 'ContextEngine', kind: 'class', detail: 'Symbol & memory retriever' },
      { id: 'PluginManager', name: 'PluginManager', kind: 'class', detail: 'Stateful plugin lifecycle' },
    ],
  },
  {
    id: 'deps',
    name: 'Dependencies',
    kind: 'dependency',
    children: [
      { id: 'react', name: 'react @ 18.2.0', kind: 'dependency' },
      { id: 'zustand', name: 'zustand @ 4.5.0', kind: 'dependency' },
      { id: 'lucide', name: 'lucide-react @ 0.300.0', kind: 'dependency' },
    ],
  },
];

const NodeIcon: React.FC<{ kind: MapNode['kind'] }> = ({ kind }) => {
  switch (kind) {
    case 'folder':
      return <Lucide.Folder size={13} className="text-amber-400" />;
    case 'file':
      return <Lucide.FileCode size={13} className="text-blue-400" />;
    case 'class':
      return <Lucide.Box size={13} className="text-purple-400" />;
    case 'function':
      return <Lucide.Code size={13} className="text-emerald-400" />;
    case 'dependency':
      return <Lucide.Package size={13} className="text-indigo-400" />;
  }
};

const TreeNode: React.FC<{ node: MapNode }> = ({ node }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col ml-3">
      <div
        onClick={() => hasChildren && setCollapsed(!collapsed)}
        className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-forge-bg-hover text-xs transition-colors cursor-pointer group"
      >
        {hasChildren ? (
          collapsed ? (
            <Lucide.ChevronRight size={12} className="text-forge-text-subtle" />
          ) : (
            <Lucide.ChevronDown size={12} className="text-forge-text-subtle" />
          )
        ) : (
          <span className="w-3" />
        )}
        <NodeIcon kind={node.kind} />
        <span className="font-mono text-forge-text group-hover:text-forge-accent transition-colors">
          {node.name}
        </span>
        {node.detail && (
          <span className="text-[10px] text-forge-text-subtle font-mono truncate ml-auto">
            {node.detail}
          </span>
        )}
      </div>

      {hasChildren && !collapsed && (
        <div className="flex flex-col border-l border-forge-border/40 ml-2">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export const WorkspaceMapPanel: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'tree' | 'graph'>('tree');

  return (
    <div className="flex flex-col h-full bg-forge-bg border border-forge-border rounded-lg overflow-hidden">
      <PanelHeader icon={<Lucide.GitGraph size={14} />} title="Workspace Architecture Map" onClose={onClose} />

      <div className="flex items-center gap-2 px-3 py-1.5 bg-forge-bg-elevated border-b border-forge-border text-xs">
        <button
          onClick={() => setActiveTab('tree')}
          className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'tree' ? 'bg-forge-accent text-white font-semibold' : 'text-forge-text-muted hover:text-forge-text'
          }`}
        >
          Tree View
        </button>
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'graph' ? 'bg-forge-accent text-white font-semibold' : 'text-forge-text-muted hover:text-forge-text'
          }`}
        >
          Call Graph
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'tree' ? (
          <div className="flex flex-col">
            {SAMPLE_MAP.map((node) => (
              <TreeNode key={node.id} node={node} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 font-mono text-xs">
            <span className="text-[10px] text-forge-text-subtle uppercase font-semibold">Call Graph Dependencies</span>
            <div className="p-3 rounded bg-forge-bg-elevated border border-forge-border flex flex-col gap-2 text-[11px]">
              <div className="flex items-center gap-2 text-forge-text">
                <span className="text-indigo-400 font-semibold">AgentPanelShell</span>
                <Lucide.ArrowRight size={12} className="text-forge-text-subtle" />
                <span>RunTimeline</span>
                <Lucide.ArrowRight size={12} className="text-forge-text-subtle" />
                <span className="text-emerald-400 font-semibold">CardRenderer</span>
              </div>
              <div className="flex items-center gap-2 text-forge-text">
                <span className="text-indigo-400 font-semibold">useAgentBridge</span>
                <Lucide.ArrowRight size={12} className="text-forge-text-subtle" />
                <span>run-store</span>
                <Lucide.ArrowRight size={12} className="text-forge-text-subtle" />
                <span className="text-amber-400 font-semibold">IPC Main Handler</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceMapPanel;
