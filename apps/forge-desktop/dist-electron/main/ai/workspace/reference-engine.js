"use strict";
/**
 * reference-engine.ts
 *
 * Sprint 86 Phase 2 — True Find References Engine
 *
 * Scans workspace files for all occurrences of a symbol name, classifies each
 * occurrence (definition, usage, import, re-export, type-reference), extracts
 * trimmed line previews, deduplicates entries, and provides ordinal access.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceEngine = void 0;
exports.isInCommentOrString = isInCommentOrString;
exports.classifyUsage = classifyUsage;
const fs = __importStar(require("fs"));
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/** Helper to check if match index is inside single-line comment or string literal. */
function isInCommentOrString(line, index) {
    const before = line.slice(0, index);
    // Check single-line comment
    if (before.includes('//')) {
        return true;
    }
    // Check quotes balance before match
    let singleQuotes = 0;
    let doubleQuotes = 0;
    let backticks = 0;
    for (let i = 0; i < before.length; i++) {
        const char = before[i];
        const prev = i > 0 ? before[i - 1] : '';
        if (prev === '\\')
            continue; // escaped
        if (char === "'" && doubleQuotes % 2 === 0 && backticks % 2 === 0) {
            singleQuotes++;
        }
        else if (char === '"' && singleQuotes % 2 === 0 && backticks % 2 === 0) {
            doubleQuotes++;
        }
        else if (char === '`' && singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
            backticks++;
        }
    }
    return singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0 || backticks % 2 !== 0;
}
/** Classifies usage based on line patterns. */
function classifyUsage(line, symbolName) {
    const trimmed = line.trim();
    const escaped = escapeRegex(symbolName);
    if (/^import\s+/.test(trimmed)) {
        return 'import';
    }
    if (/^export\s+\{/.test(trimmed) && !trimmed.includes('function') && !trimmed.includes('class')) {
        return 're-export';
    }
    const defPattern = new RegExp(`^(?:export\\s+(?:default\\s+)?)?(?:async\\s+)?(?:function|class|interface|type|enum|(?:const|let|var))\\s+${escaped}\\b`);
    if (defPattern.test(trimmed)) {
        return 'definition';
    }
    const typePattern = new RegExp(`(?::\\s*|\\bextends\\s+|\\bimplements\\s+|\\bas\\s+|<|&\\s*|\\|\\s*)${escaped}\\b`);
    if (typePattern.test(trimmed)) {
        return 'type-reference';
    }
    return 'usage';
}
class ReferenceEngine {
    indexer;
    cache = new Map();
    constructor(indexer) {
        this.indexer = indexer;
    }
    /**
     * Find all occurrences of a symbol across the workspace.
     */
    findUsages(symbolName) {
        if (!symbolName || !symbolName.trim()) {
            return { symbol: symbolName, definitions: [], usages: [], totalCount: 0, ordered: [] };
        }
        if (this.cache.has(symbolName)) {
            return this.cache.get(symbolName);
        }
        const definitions = [];
        const usages = [];
        // 1. Fetch definitions from indexer
        const symbolDefs = this.indexer.findSymbol(symbolName).filter((s) => s.kind !== 'import');
        for (const def of symbolDefs) {
            let preview = '';
            try {
                const content = fs.readFileSync(def.filePath, 'utf8');
                const lines = content.split(/\r?\n/);
                preview = (lines[def.line - 1] ?? '').trim();
            }
            catch {
                preview = `${def.kind} ${def.name}`;
            }
            definitions.push({
                symbol: symbolName,
                filePath: def.filePath,
                line: def.line,
                column: def.column,
                preview,
                kind: 'definition',
            });
        }
        // 2. Scan cached file content for occurrences
        const fileCache = this.indexer.fileCache;
        const re = new RegExp(`\\b${escapeRegex(symbolName)}\\b`, 'g');
        for (const [filePath] of fileCache) {
            let content = '';
            try {
                content = fs.readFileSync(filePath, 'utf8');
            }
            catch {
                continue;
            }
            const lines = content.split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
                const lineText = lines[i];
                const lineNum = i + 1;
                let match;
                const lineRe = new RegExp(re.source, 'g');
                while ((match = lineRe.exec(lineText)) !== null) {
                    const colNum = match.index + 1;
                    // Skip comments or string literals
                    if (isInCommentOrString(lineText, match.index)) {
                        continue;
                    }
                    const kind = classifyUsage(lineText, symbolName);
                    // Check if this location matches an existing definition
                    const isDef = definitions.some((d) => d.filePath === filePath && Math.abs(d.line - lineNum) <= 1);
                    const loc = {
                        symbol: symbolName,
                        filePath,
                        line: lineNum,
                        column: colNum,
                        preview: lineText.trim(),
                        kind: isDef && kind === 'definition' ? 'definition' : kind,
                    };
                    if (isDef && kind === 'definition') {
                        // Already captured in definitions array
                        continue;
                    }
                    usages.push(loc);
                }
            }
        }
        // 3. Deduplicate
        const seen = new Set();
        const uniqueDefs = definitions.filter((d) => {
            const key = `${d.filePath}:${d.line}:${d.column}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
        const uniqueUsages = usages.filter((u) => {
            const key = `${u.filePath}:${u.line}:${u.column}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
        // 4. Sort ordered list: definitions first, then by filePath and line
        const ordered = [...uniqueDefs, ...uniqueUsages].sort((a, b) => {
            if (a.kind === 'definition' && b.kind !== 'definition')
                return -1;
            if (a.kind !== 'definition' && b.kind === 'definition')
                return 1;
            const fileCompare = a.filePath.localeCompare(b.filePath);
            if (fileCompare !== 0)
                return fileCompare;
            return a.line - b.line;
        });
        const result = {
            symbol: symbolName,
            definitions: uniqueDefs,
            usages: uniqueUsages,
            totalCount: ordered.length,
            ordered,
        };
        this.cache.set(symbolName, result);
        return result;
    }
    /**
     * Return the N-th reference (0-indexed) for ordinal navigation.
     */
    getByOrdinal(symbolName, ordinal) {
        const result = this.findUsages(symbolName);
        if (ordinal < 0 || ordinal >= result.ordered.length) {
            return null;
        }
        return result.ordered[ordinal];
    }
    /**
     * Invalidate cached reference results for a file (or clear all).
     */
    invalidateFile(_filePath) {
        this.cache.clear();
    }
}
exports.ReferenceEngine = ReferenceEngine;
//# sourceMappingURL=reference-engine.js.map