/**
 * HealthScoreGauge.tsx — Repository Health Engine Dashboard
 */

import React, { useState } from 'react';

export interface FindingEvidence {
  matchedRules: string[];
  relatedFiles: string[];
  metrics: Record<string, number>;
}

export interface Finding {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'dead-code' | 'duplicate' | 'dependency' | 'architecture' | 'complexity';
  confidence: number;
  file: string;
  line?: number;
  description: string;
  suggestion: string;
  fixStrategy: 'delete-file' | 'merge-helper' | 'move-service' | 'split-class' | 'extract-interface' | 'none';
  evidence: FindingEvidence;
  autoFixAvailable: boolean;
  estimatedImpact: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface CategoryScore {
  category: string;
  score: number;
  weight: number;
  findingsCount: number;
}

export interface HealthReport {
  id: string;
  timestamp: number;
  overallScore: number;
  categoryScores: CategoryScore[];
  totalLOC: number;
  totalFiles: number;
  totalClasses: number;
  totalInterfaces: number;
  totalDiTokens: number;
  totalIpcRoutes: number;
  totalEventTopics: number;
  findings: Finding[];
  historicalDelta: number;
  scannedAtISO: string;
}

interface HealthDashboardProps {
  report?: HealthReport;
  onScanRepository?: () => void;
}

export const HealthScoreGauge: React.FC<HealthDashboardProps> = ({ report, onScanRepository }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const r: HealthReport = report || {
    id: 'report-demo',
    timestamp: Date.now(),
    overallScore: 97,
    categoryScores: [
      { category: 'architecture', score: 99, weight: 0.25, findingsCount: 0 },
      { category: 'complexity', score: 94, weight: 0.15, findingsCount: 2 },
      { category: 'dead-code', score: 96, weight: 0.20, findingsCount: 1 },
      { category: 'dependency', score: 98, weight: 0.15, findingsCount: 1 },
      { category: 'duplicate', score: 97, weight: 0.25, findingsCount: 1 },
    ],
    totalLOC: 84210,
    totalFiles: 558,
    totalClasses: 408,
    totalInterfaces: 437,
    totalDiTokens: 170,
    totalIpcRoutes: 49,
    totalEventTopics: 22,
    findings: [
      {
        id: 'complexity-god-object-1',
        title: 'Oversized File: desktop-container.ts (880 LOC)',
        severity: 'high',
        category: 'complexity',
        confidence: 0.95,
        file: 'electron/main/container/desktop-container.ts',
        line: 1,
        description: 'File has 880 LOC exceeding maximum threshold of 500 LOC.',
        suggestion: 'Decompose giant module into focused single-responsibility domain subservices.',
        fixStrategy: 'split-class',
        evidence: { matchedRules: ['MaxFileLOCRule'], relatedFiles: [], metrics: { LOC: 880 } },
        autoFixAvailable: false,
        estimatedImpact: 'high',
        timestamp: Date.now()
      },
      {
        id: 'coupling-high-1',
        title: 'High Coupling Hub: DesktopContainer',
        severity: 'high',
        category: 'dependency',
        confidence: 0.9,
        file: 'electron/main/container/desktop-container.ts',
        line: 15,
        description: 'File has high coupling score 177 (Fan-In: 170, Fan-Out: 7).',
        suggestion: 'Decouple responsibilities into dedicated interfaces or facades.',
        fixStrategy: 'extract-interface',
        evidence: { matchedRules: ['HighCouplingThresholdRule'], relatedFiles: [], metrics: { couplingScore: 177 } },
        autoFixAvailable: false,
        estimatedImpact: 'high',
        timestamp: Date.now()
      }
    ],
    historicalDelta: 2.5,
    scannedAtISO: new Date().toISOString()
  };

  const filteredFindings = r.findings.filter((f) => {
    if (selectedSeverity !== 'all' && f.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-950 space-y-6 overflow-y-auto font-sans">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 tracking-wide uppercase">Repository Health Engine</h2>
          <p className="text-xs text-slate-400">AST Analysis | Dependency Coupling | Architecture Rules | Parallel Scan Engine</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Historical Trend</span>
            <span className="text-xs font-bold text-emerald-400">+{r.historicalDelta.toFixed(1)} vs baseline</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-4xl font-extrabold text-emerald-400">{r.overallScore}</span>
            <span className="text-xs text-slate-500 font-semibold">/ 100</span>
          </div>
          {onScanRepository && (
            <button
              onClick={onScanRepository}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-lg transition-all"
            >
              Run Full Scan
            </button>
          )}
        </div>
      </div>

      {/* METRICS DASHBOARD STRIP */}
      <div className="grid grid-cols-7 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 font-medium block">Total LOC</span>
          <span className="text-sm font-bold text-sky-400">{r.totalLOC.toLocaleString()}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 font-medium block">TS Files</span>
          <span className="text-sm font-bold text-sky-400">{r.totalFiles}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 font-medium block">Classes</span>
          <span className="text-sm font-bold text-sky-400">{r.totalClasses}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 font-medium block">Interfaces</span>
          <span className="text-sm font-bold text-sky-400">{r.totalInterfaces}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 font-medium block">DI Tokens</span>
          <span className="text-sm font-bold text-purple-400">{r.totalDiTokens}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 font-medium block">IPC Routes</span>
          <span className="text-sm font-bold text-amber-400">{r.totalIpcRoutes}</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 font-medium block">Event Topics</span>
          <span className="text-sm font-bold text-emerald-400">{r.totalEventTopics}</span>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN CARDS */}
      <div className="grid grid-cols-5 gap-4">
        {r.categoryScores.map((cat) => (
          <div key={cat.category} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{cat.category}</span>
              <span className="text-xs font-bold text-emerald-400">{cat.score}/100</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${cat.score}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Weight: {(cat.weight * 100).toFixed(0)}%</span>
              <span className="text-amber-400">{cat.findingsCount} issues</span>
            </div>
          </div>
        ))}
      </div>

      {/* FINDINGS TABLE WITH FILTERS */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Unified Findings Store ({filteredFindings.length})</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1"
            >
              <option value="all">All Categories</option>
              <option value="architecture">Architecture</option>
              <option value="complexity">Complexity</option>
              <option value="dead-code">Dead Code</option>
              <option value="dependency">Dependency</option>
              <option value="duplicate">Duplicate</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredFindings.map((f) => (
            <div key={f.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    f.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    f.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  }`}>
                    {f.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-200">{f.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Fix Strategy: <span className="text-purple-400">{f.fixStrategy}</span></span>
              </div>
              <p className="text-xs text-slate-400">{f.description}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                <span className="font-mono text-slate-400">{f.file}</span>
                <span className="text-sky-400 font-medium">Suggestion: {f.suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
