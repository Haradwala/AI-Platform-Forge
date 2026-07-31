"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorySearchService = void 0;
class RepositorySearchService {
    symbolsIndex;
    graph;
    constructor(symbolsIndex, graph) {
        this.symbolsIndex = symbolsIndex;
        this.graph = graph;
    }
    findSymbol(query) {
        const q = query.toLowerCase();
        return this.symbolsIndex.getAll().filter((s) => s.name.toLowerCase().includes(q));
    }
    findReferences(symbolName) {
        return this.graph.getReferences(symbolName);
    }
    findImplementations(interfaceName) {
        return this.symbolsIndex.getAll().filter((s) => s.parent === interfaceName);
    }
    findCallers(functionName) {
        return this.graph.getReferences(functionName);
    }
    findFile(query, workspaceFiles) {
        const files = new Set();
        const q = (query || '').toLowerCase();
        if (workspaceFiles && workspaceFiles.length > 0) {
            for (const f of workspaceFiles) {
                if (!q || f.toLowerCase().includes(q)) {
                    files.add(f);
                }
            }
        }
        for (const sym of this.symbolsIndex.getAll()) {
            if (!q || sym.file.toLowerCase().includes(q)) {
                files.add(sym.file);
            }
        }
        return Array.from(files);
    }
}
exports.RepositorySearchService = RepositorySearchService;
//# sourceMappingURL=repository-search.js.map