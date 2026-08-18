/**
 * diagnostics-aggregator.ts
 *
 * Sprint 86 Phase 6 — Diagnostics Aggregator
 *
 * Collects, normalizes, and aggregates diagnostic items from multiple sources
 * (Monaco markers, TypeScript compiler output, AI rules).
 */

export type DiagnosticSeverity = 'error' | 'warning' | 'info' | 'hint';

export interface DiagnosticRelatedInfo {
  readonly filePath: string;
  readonly line: number;
  readonly column: number;
  readonly message: string;
}

export interface DiagnosticItem {
  readonly id: string;
  readonly filePath: string;
  readonly line: number;
  readonly column: number;
  readonly endLine?: number;
  readonly endColumn?: number;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
  readonly source: 'typescript' | 'eslint' | 'forge-ai' | 'custom';
  readonly code?: string | number;
  readonly relatedInfo?: readonly DiagnosticRelatedInfo[];
}

export class DiagnosticsAggregator {
  private diagnosticsMap = new Map<string, DiagnosticItem[]>(); // filePath -> items

  /**
   * Add or replace diagnostics for a specific file.
   */
  setFileDiagnostics(filePath: string, items: DiagnosticItem[]): void {
    this.diagnosticsMap.set(filePath, items);
  }

  /**
   * Add a single diagnostic item.
   */
  addDiagnostic(item: DiagnosticItem): void {
    const existing = this.diagnosticsMap.get(item.filePath) || [];
    // Deduplicate by line, column, message
    const filtered = existing.filter(
      (d) => !(d.line === item.line && d.column === item.column && d.message === item.message)
    );
    filtered.push(item);
    this.diagnosticsMap.set(item.filePath, filtered);
  }

  /**
   * Get all diagnostics across workspace, optionally filtered by severity.
   */
  getAll(severityFilter?: DiagnosticSeverity[]): DiagnosticItem[] {
    const all: DiagnosticItem[] = [];
    for (const items of this.diagnosticsMap.values()) {
      for (const item of items) {
        if (!severityFilter || severityFilter.includes(item.severity)) {
          all.push(item);
        }
      }
    }

    // Sort by severity (error > warning > info > hint), then filePath, then line
    return all.sort((a, b) => {
      const order = { error: 0, warning: 1, info: 2, hint: 3 };
      const diff = order[a.severity] - order[b.severity];
      if (diff !== 0) return diff;
      const fileCompare = a.filePath.localeCompare(b.filePath);
      if (fileCompare !== 0) return fileCompare;
      return a.line - b.line;
    });
  }

  /**
   * Get diagnostics for a specific file.
   */
  getForFile(filePath: string): DiagnosticItem[] {
    return this.diagnosticsMap.get(filePath) || [];
  }

  /**
   * Clear diagnostics for a file or clear all.
   */
  clear(filePath?: string): void {
    if (filePath) {
      this.diagnosticsMap.delete(filePath);
    } else {
      this.diagnosticsMap.clear();
    }
  }

  /**
   * Get total diagnostic count breakdown.
   */
  getStats(): { errors: number; warnings: number; info: number; hints: number } {
    let errors = 0,
      warnings = 0,
      info = 0,
      hints = 0;
    for (const items of this.diagnosticsMap.values()) {
      for (const item of items) {
        if (item.severity === 'error') errors++;
        else if (item.severity === 'warning') warnings++;
        else if (item.severity === 'info') info++;
        else if (item.severity === 'hint') hints++;
      }
    }
    return { errors, warnings, info, hints };
  }
}
