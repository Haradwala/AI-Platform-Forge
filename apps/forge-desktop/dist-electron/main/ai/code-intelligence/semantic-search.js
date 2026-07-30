"use strict";
/**
 * semantic-search.ts
 *
 * Semantic search engine performing pure static query operations over
 * SymbolIndex, DependencyGraph, CallGraph, and parsed AST structures.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSearch = void 0;
class SemanticSearch {
    symbolIndex;
    dependencyGraph;
    callGraph;
    constructor(symbolIndex, dependencyGraph, callGraph) {
        this.symbolIndex = symbolIndex;
        this.dependencyGraph = dependencyGraph;
        this.callGraph = callGraph;
    }
    findClass(name) {
        return this.symbolIndex.findByName(name).filter((s) => s.kind === 'class');
    }
    findFunction(name) {
        return this.symbolIndex.findByName(name).filter((s) => s.kind === 'function' || s.kind === 'method');
    }
    implementations(interfaceName) {
        return this.symbolIndex
            .getAllDeclarations()
            .filter((s) => s.kind === 'class' && s.details?.implements?.includes(interfaceName));
    }
    references(symbolName) {
        return this.dependencyGraph.getSymbolReferences(symbolName);
    }
    callers(symbolName) {
        return this.callGraph.getCallers(symbolName);
    }
    callees(symbolName) {
        return this.callGraph.getCallees(symbolName);
    }
    services() {
        return this.symbolIndex
            .getAllDeclarations()
            .filter((s) => s.name.endsWith('Service') || s.name.endsWith('Engine') || s.name.endsWith('Manager'));
    }
    reactComponents() {
        return this.symbolIndex.getAllDeclarations().filter((s) => s.kind === 'jsx_component');
    }
    hooks() {
        return this.symbolIndex
            .getAllDeclarations()
            .filter((s) => s.name.startsWith('use') && s.kind === 'function');
    }
    asyncFunctions() {
        return this.symbolIndex
            .getAllDeclarations()
            .filter((s) => (s.kind === 'function' || s.kind === 'method') && s.details?.isAsync);
    }
}
exports.SemanticSearch = SemanticSearch;
//# sourceMappingURL=semantic-search.js.map