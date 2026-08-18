"use strict";
/**
 * diagnostics-aggregator.ts
 *
 * Sprint 86 Phase 6 — Diagnostics Aggregator
 *
 * Collects, normalizes, and aggregates diagnostic items from multiple sources
 * (Monaco markers, TypeScript compiler output, AI rules).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticsAggregator = void 0;
class DiagnosticsAggregator {
    diagnosticsMap = new Map(); // filePath -> items
    /**
     * Add or replace diagnostics for a specific file.
     */
    setFileDiagnostics(filePath, items) {
        this.diagnosticsMap.set(filePath, items);
    }
    /**
     * Add a single diagnostic item.
     */
    addDiagnostic(item) {
        const existing = this.diagnosticsMap.get(item.filePath) || [];
        // Deduplicate by line, column, message
        const filtered = existing.filter((d) => !(d.line === item.line && d.column === item.column && d.message === item.message));
        filtered.push(item);
        this.diagnosticsMap.set(item.filePath, filtered);
    }
    /**
     * Get all diagnostics across workspace, optionally filtered by severity.
     */
    getAll(severityFilter) {
        const all = [];
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
            if (diff !== 0)
                return diff;
            const fileCompare = a.filePath.localeCompare(b.filePath);
            if (fileCompare !== 0)
                return fileCompare;
            return a.line - b.line;
        });
    }
    /**
     * Get diagnostics for a specific file.
     */
    getForFile(filePath) {
        return this.diagnosticsMap.get(filePath) || [];
    }
    /**
     * Clear diagnostics for a file or clear all.
     */
    clear(filePath) {
        if (filePath) {
            this.diagnosticsMap.delete(filePath);
        }
        else {
            this.diagnosticsMap.clear();
        }
    }
    /**
     * Get total diagnostic count breakdown.
     */
    getStats() {
        let errors = 0, warnings = 0, info = 0, hints = 0;
        for (const items of this.diagnosticsMap.values()) {
            for (const item of items) {
                if (item.severity === 'error')
                    errors++;
                else if (item.severity === 'warning')
                    warnings++;
                else if (item.severity === 'info')
                    info++;
                else if (item.severity === 'hint')
                    hints++;
            }
        }
        return { errors, warnings, info, hints };
    }
}
exports.DiagnosticsAggregator = DiagnosticsAggregator;
//# sourceMappingURL=diagnostics-aggregator.js.map