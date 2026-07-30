"use strict";
/**
 * repository-indexer.ts
 *
 * Incremental AST / regex indexer for workspace files.
 * Indexes files, folders, symbols, imports, exports, classes, and functions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryIndexer = void 0;
class RepositoryIndexer {
    files = new Map();
    clear() {
        this.files.clear();
    }
    async indexWorkspace(files, signal) {
        for (const f of files) {
            if (signal?.aborted)
                break;
            this.updateFile(f.path, f.content, f.mtime);
        }
    }
    updateFile(filePath, content, mtime = Date.now()) {
        const folder = filePath.includes('/')
            ? filePath.substring(0, filePath.lastIndexOf('/'))
            : '';
        const imports = [];
        const exports = [];
        const symbols = [];
        const lines = content.split('\n');
        for (let idx = 0; idx < lines.length; idx++) {
            const line = lines[idx];
            const lineNo = idx + 1;
            // 1. Imports
            const importMatch = line.match(/import\s+(?:(?:{[^}]+})|(?:\*\s+as\s+\w+)|(?:\w+))\s+from\s+['"]([^'"]+)['"]/);
            if (importMatch) {
                imports.push(importMatch[1]);
                symbols.push({ name: importMatch[1], kind: 'import', filePath, line: lineNo });
            }
            // 2. Exports
            const exportMatch = line.match(/export\s+(?:default\s+)?(?:class|function|const|let|var|type|interface)\s+(\w+)/);
            if (exportMatch) {
                exports.push(exportMatch[1]);
                symbols.push({ name: exportMatch[1], kind: 'export', filePath, line: lineNo });
            }
            // 3. Classes
            const classMatch = line.match(/(?:export\s+)?class\s+(\w+)/);
            if (classMatch) {
                symbols.push({ name: classMatch[1], kind: 'class', filePath, line: lineNo });
            }
            // 4. Functions / Methods
            const funcMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/);
            if (funcMatch) {
                symbols.push({ name: funcMatch[1], kind: 'function', filePath, line: lineNo });
            }
        }
        this.files.set(filePath, {
            path: filePath,
            folder,
            imports,
            exports,
            symbols,
            mtime,
        });
    }
    removeFile(filePath) {
        this.files.delete(filePath);
    }
    getFile(filePath) {
        return this.files.get(filePath) || null;
    }
    getAllFiles() {
        return Array.from(this.files.values());
    }
    getImports(filePath) {
        return this.files.get(filePath)?.imports || [];
    }
    searchSymbols(query) {
        if (!query)
            return [];
        const lower = query.toLowerCase();
        const results = [];
        for (const file of this.files.values()) {
            for (const sym of file.symbols) {
                if (sym.name.toLowerCase().includes(lower)) {
                    results.push(sym);
                }
            }
        }
        return results;
    }
}
exports.RepositoryIndexer = RepositoryIndexer;
//# sourceMappingURL=repository-indexer.js.map