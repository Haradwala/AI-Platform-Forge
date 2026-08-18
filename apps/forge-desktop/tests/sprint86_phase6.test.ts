/**
 * sprint86_phase6.test.ts
 *
 * Sprint 86 Phase 6 — Diagnostics & Quick Fix Panel Unit Tests
 *
 * Verifies:
 *  - DiagnosticsAggregator collection, filtering, and stats
 *  - AiQuickFixGenerator suggestion generation for missing symbols and unused code
 *  - BackgroundAnalyzer debounced file re-indexing and analysis
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DiagnosticsAggregator, DiagnosticItem } from '../electron/main/ai/diagnostics/diagnostics-aggregator';
import { AiQuickFixGenerator } from '../electron/main/ai/diagnostics/ai-quickfix-generator';
import { BackgroundAnalyzer } from '../electron/main/ai/diagnostics/background-analyzer';
import { WorkspaceSymbolIndexer } from '../electron/main/ai/workspace/symbol-indexer';

describe('Sprint 86 Phase 6 — Diagnostics & Quick Fix Panel Engine', () => {
  let aggregator: DiagnosticsAggregator;
  let fixGenerator: AiQuickFixGenerator;
  let analyzer: BackgroundAnalyzer;
  let indexer: WorkspaceSymbolIndexer;

  beforeEach(() => {
    aggregator = new DiagnosticsAggregator();
    fixGenerator = new AiQuickFixGenerator();
    indexer = new WorkspaceSymbolIndexer();
    analyzer = new BackgroundAnalyzer(indexer, aggregator, 50);
  });

  // ── 1. DiagnosticsAggregator ──────────────────────────────────────────────

  describe('1. DiagnosticsAggregator', () => {
    it('stores and retrieves diagnostics for files', () => {
      const diag1: DiagnosticItem = {
        id: 'd1',
        filePath: '/src/app.ts',
        line: 10,
        column: 5,
        severity: 'error',
        message: "Cannot find name 'UserStore'",
        source: 'typescript',
      };

      const diag2: DiagnosticItem = {
        id: 'd2',
        filePath: '/src/app.ts',
        line: 25,
        column: 1,
        severity: 'warning',
        message: "'x' is declared but its value is never read.",
        source: 'typescript',
      };

      aggregator.setFileDiagnostics('/src/app.ts', [diag1, diag2]);

      const all = aggregator.getAll();
      expect(all.length).toBe(2);
      expect(all[0].severity).toBe('error'); // errors sorted first
      expect(all[1].severity).toBe('warning');

      const fileDiags = aggregator.getForFile('/src/app.ts');
      expect(fileDiags.length).toBe(2);
    });

    it('filters diagnostics by severity', () => {
      aggregator.addDiagnostic({
        id: 'd1',
        filePath: '/src/a.ts',
        line: 1,
        column: 1,
        severity: 'error',
        message: 'Err',
        source: 'typescript',
      });

      aggregator.addDiagnostic({
        id: 'd2',
        filePath: '/src/a.ts',
        line: 5,
        column: 1,
        severity: 'warning',
        message: 'Warn',
        source: 'typescript',
      });

      const errorsOnly = aggregator.getAll(['error']);
      expect(errorsOnly.length).toBe(1);
      expect(errorsOnly[0].severity).toBe('error');
    });

    it('computes diagnostic stats breakdown', () => {
      aggregator.addDiagnostic({
        id: 'd1',
        filePath: '/src/a.ts',
        line: 1,
        column: 1,
        severity: 'error',
        message: 'Err',
        source: 'typescript',
      });

      aggregator.addDiagnostic({
        id: 'd2',
        filePath: '/src/a.ts',
        line: 2,
        column: 1,
        severity: 'warning',
        message: 'Warn',
        source: 'typescript',
      });

      const stats = aggregator.getStats();
      expect(stats.errors).toBe(1);
      expect(stats.warnings).toBe(1);
    });
  });

  // ── 2. AiQuickFixGenerator ───────────────────────────────────────────────

  describe('2. AiQuickFixGenerator', () => {
    it('generates missing import fix for "Cannot find name"', async () => {
      const diag: DiagnosticItem = {
        id: 'd_import',
        filePath: '/src/app.ts',
        line: 12,
        column: 8,
        severity: 'error',
        message: "Cannot find name 'UserStore'",
        source: 'typescript',
      };

      const fixes = await fixGenerator.generateFix(diag);
      expect(fixes.length).toBeGreaterThan(0);
      expect(fixes[0].title).toContain('Add import for UserStore');
      expect(fixes[0].edit.edits[0].newText).toContain("import { UserStore } from './UserStore';");
    });

    it('generates unused code removal fix', async () => {
      const diag: DiagnosticItem = {
        id: 'd_unused',
        filePath: '/src/app.ts',
        line: 15,
        column: 3,
        severity: 'warning',
        message: "'temp' is declared but its value is never read.",
        source: 'typescript',
      };

      const fixes = await fixGenerator.generateFix(diag);
      expect(fixes.length).toBeGreaterThan(0);
      expect(fixes[0].title).toContain('Remove unused code line');
    });
  });

  // ── 3. BackgroundAnalyzer ────────────────────────────────────────────────

  describe('3. BackgroundAnalyzer', () => {
    it('schedules and executes background analysis', async () => {
      analyzer.scheduleAnalysis('/src/app.ts');
      expect(analyzer.getPendingCount()).toBe(1);

      const res = await analyzer.runAnalysis();
      expect(res.processedFiles).toContain('/src/app.ts');
      expect(analyzer.getPendingCount()).toBe(0);
    });

    it('cancels pending analysis on cancel()', () => {
      analyzer.scheduleAnalysis('/src/app.ts');
      analyzer.cancel();
      expect(analyzer.getPendingCount()).toBe(0);
    });
  });
});
