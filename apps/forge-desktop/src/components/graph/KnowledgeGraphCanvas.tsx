/**
 * KnowledgeGraphCanvas.tsx — Interactive Symbol Graph Explorer & Blast-Radius Heatmap Overlay
 */

import React, { useState } from 'react';

export interface GraphNode {
  id: string;
  label: string;
  kind?: string;
  healthStatus?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship?: string;
}

interface KnowledgeGraphCanvasProps {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
}

export const KnowledgeGraphCanvas: React.FC<KnowledgeGraphCanvasProps> = ({ nodes = [], edges = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightImpact, setHighlightImpact] = useState(false);

  const defaultNodes: GraphNode[] = nodes.length > 0 ? nodes : [
    { id: 'n1', label: 'WorkspaceService', kind: 'class', healthStatus: 'healthy' },
    { id: 'n2', label: 'IntelligenceDatabase', kind: 'class', healthStatus: 'healthy' },
    { id: 'n3', label: 'RepositoryIndexCoordinator', kind: 'class', healthStatus: 'warning' },
    { id: 'n4', label: 'KnowledgeGraphEngine', kind: 'class', healthStatus: 'healthy' },
  ];

  const filteredNodes = defaultNodes.filter((n) =>
    searchTerm ? n.label.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4">
      {/* Controls Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search symbols or files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={() => setHighlightImpact(!highlightImpact)}
            className={`px-3 py-1 text-xs font-medium rounded transition ${
              highlightImpact ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {highlightImpact ? 'Impact Heatmap Active' : 'Highlight Blast Radius'}
          </button>
        </div>
        <span className="text-xs text-slate-500">{filteredNodes.length} nodes rendered</span>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 overflow-auto relative mt-3 bg-slate-900/50 rounded-lg border border-slate-800 p-6 flex items-center justify-center">
        <svg className="w-full h-full min-h-[400px]">
          {filteredNodes.map((n, idx) => {
            const cx = (idx * 110) % 500 + 80;
            const cy = (idx * 60) % 250 + 80;
            const isWarning = highlightImpact && n.healthStatus === 'warning';

            return (
              <g
                key={n.id}
                className="cursor-pointer group"
                transform={`translate(${cx}, ${cy})`}
              >
                <circle
                  r="20"
                  fill={isWarning ? '#f59e0b' : '#0284c7'}
                  className="transition group-hover:scale-110"
                />
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {n.label.substring(0, 3).toUpperCase()}
                </text>
                <text
                  textAnchor="middle"
                  dy="35"
                  fill="#94a3b8"
                  fontSize="11"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
