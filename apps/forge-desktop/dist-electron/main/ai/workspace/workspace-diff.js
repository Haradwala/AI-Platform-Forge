"use strict";
/**
 * workspace-diff.ts
 *
 * Workspace diff engine computing file additions, deletions, modifications,
 * renames, and binary file detection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceDiff = void 0;
class WorkspaceDiff {
    fileOps;
    constructor(fileOps) {
        this.fileOps = fileOps;
    }
    isBinary(content) {
        // Null byte heuristic within first 8KB
        const sample = content.slice(0, 8192);
        for (let i = 0; i < sample.length; i++) {
            if (sample.charCodeAt(i) === 0)
                return true;
        }
        return false;
    }
    diffContent(oldContent, newContent, filePath = '') {
        if (oldContent === undefined && newContent !== undefined) {
            const isBin = this.isBinary(newContent);
            const lines = isBin ? 0 : newContent.split('\n').length;
            return { path: filePath, type: 'added', isBinary: isBin, additions: lines, deletions: 0 };
        }
        if (oldContent !== undefined && newContent === undefined) {
            const isBin = this.isBinary(oldContent);
            const lines = isBin ? 0 : oldContent.split('\n').length;
            return { path: filePath, type: 'removed', isBinary: isBin, additions: 0, deletions: lines };
        }
        const isBin = this.isBinary(oldContent || '') || this.isBinary(newContent || '');
        if (isBin) {
            return { path: filePath, type: 'modified', isBinary: true, additions: 0, deletions: 0 };
        }
        const oldLines = (oldContent || '').split('\n');
        const newLines = (newContent || '').split('\n');
        let additions = 0;
        let deletions = 0;
        // Simple line diff count heuristic
        const oldSet = new Set(oldLines);
        const newSet = new Set(newLines);
        for (const l of newLines) {
            if (!oldSet.has(l))
                additions++;
        }
        for (const l of oldLines) {
            if (!newSet.has(l))
                deletions++;
        }
        return {
            path: filePath,
            type: 'modified',
            isBinary: false,
            additions,
            deletions,
        };
    }
    generateReport(items) {
        let totalAdded = 0;
        let totalRemoved = 0;
        let totalModified = 0;
        for (const item of items) {
            if (item.type === 'added')
                totalAdded++;
            else if (item.type === 'removed')
                totalRemoved++;
            else if (item.type === 'modified' || item.type === 'renamed')
                totalModified++;
        }
        return {
            timestamp: new Date().toISOString(),
            items,
            totalAdded,
            totalRemoved,
            totalModified,
        };
    }
}
exports.WorkspaceDiff = WorkspaceDiff;
//# sourceMappingURL=workspace-diff.js.map