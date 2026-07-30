"use strict";
/**
 * code-intelligence-engine.ts
 *
 * Phase 9 — Code Intelligence Engine Facade.
 *
 * Unified facade integrating RepositoryScanner, ASTParser, SymbolIndex,
 * DependencyGraph, CallGraph, and SemanticSearch.
 * Supports incremental updates, AbortSignal cancellation, and zero LLM calls.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeIntelligenceEngine = void 0;
const repository_scanner_1 = require("./repository-scanner");
const ast_parser_1 = require("./ast-parser");
const symbol_index_1 = require("./symbol-index");
const dependency_graph_1 = require("./dependency-graph");
const call_graph_1 = require("./call-graph");
const semantic_search_1 = require("./semantic-search");
class CodeIntelligenceEngine {
    scanner = new repository_scanner_1.RepositoryScanner();
    parser = new ast_parser_1.ASTParser();
    symbolIndex = new symbol_index_1.SymbolIndex();
    depGraph = new dependency_graph_1.DependencyGraph();
    cGraph = new call_graph_1.CallGraph();
    semanticSearchEngine;
    constructor() {
        this.semanticSearchEngine = new semantic_search_1.SemanticSearch(this.symbolIndex, this.depGraph, this.cGraph);
    }
    async scanWorkspace(files, signal) {
        const start = Date.now();
        this.scanner.clear();
        this.symbolIndex.clear();
        this.depGraph.clear();
        this.cGraph.clear();
        const { files: scannedFiles, packages } = await this.scanner.scanWorkspace(files, signal);
        for (const pkg of packages) {
            this.depGraph.addPackageDependencies(pkg.name, {
                ...pkg.dependencies,
                ...pkg.devDependencies,
            });
        }
        for (const f of files) {
            if (signal?.aborted) {
                throw new Error('Code intelligence scan cancelled by AbortSignal.');
            }
            if (f.content && (f.path.endsWith('.ts') || f.path.endsWith('.tsx') || f.path.endsWith('.js') || f.path.endsWith('.jsx'))) {
                this.indexFileContent(f.path, f.content);
            }
        }
        return this.buildStats(Date.now() - start);
    }
    updateFile(filePath, content) {
        this.removeFile(filePath);
        this.scanner.addFile(filePath, content);
        this.indexFileContent(filePath, content);
    }
    removeFile(filePath) {
        this.scanner.removeFile(filePath);
        this.symbolIndex.removeFileSymbols(filePath);
        this.depGraph.removeFile(filePath);
        this.cGraph.removeFileCalls(filePath);
    }
    search() {
        return this.semanticSearchEngine;
    }
    symbol(name) {
        return this.symbolIndex.findByName(name);
    }
    callGraph() {
        return this.cGraph;
    }
    dependencyGraph() {
        return this.depGraph;
    }
    repositoryStats() {
        return this.buildStats(0);
    }
    indexFileContent(filePath, content) {
        const ast = this.parser.parse(filePath, content);
        // Index Imports
        for (const imp of ast.imports) {
            this.depGraph.addFileImport(filePath, imp.moduleSpecifier);
            for (const name of imp.namedImports) {
                this.depGraph.addSymbolReference(name, filePath);
            }
        }
        // Index Classes
        for (const cls of ast.classes) {
            const id = `${filePath}::class::${cls.name}::${cls.line}`;
            this.symbolIndex.addDeclaration({
                id,
                name: cls.name,
                kind: 'class',
                filePath,
                line: cls.line,
                isExported: cls.isExported,
                details: { extends: cls.extends, implements: cls.implements },
            });
            if (cls.name.endsWith('Service') || cls.name.endsWith('Engine')) {
                this.depGraph.addServiceConsumer(cls.name, filePath);
            }
        }
        // Index Interfaces
        for (const iface of ast.interfaces) {
            const id = `${filePath}::interface::${iface.name}::${iface.line}`;
            this.symbolIndex.addDeclaration({
                id,
                name: iface.name,
                kind: 'interface',
                filePath,
                line: iface.line,
                isExported: iface.isExported,
                details: { extends: iface.extends },
            });
        }
        // Index Functions
        for (const fn of ast.functions) {
            const id = `${filePath}::function::${fn.name}::${fn.line}`;
            this.symbolIndex.addDeclaration({
                id,
                name: fn.name,
                kind: 'function',
                filePath,
                line: fn.line,
                isExported: fn.isExported,
                details: { isAsync: fn.isAsync },
            });
        }
        // Index JSX Components
        for (const jsx of ast.jsxComponents) {
            const id = `${filePath}::jsx::${jsx.name}::${jsx.line}`;
            this.symbolIndex.addDeclaration({
                id,
                name: jsx.name,
                kind: 'jsx_component',
                filePath,
                line: jsx.line,
                isExported: true,
            });
        }
        // Index Calls
        for (const call of ast.calls) {
            if (call.callerName) {
                this.cGraph.addCall({
                    caller: call.callerName,
                    callee: call.calleeName,
                    isAsync: call.isAsync,
                    filePath,
                    line: call.line,
                });
            }
            this.depGraph.addSymbolReference(call.calleeName, filePath);
        }
    }
    buildStats(durationMs) {
        const declarations = this.symbolIndex.getAllDeclarations();
        return {
            totalFiles: this.scanner.getFiles().length,
            totalPackages: this.scanner.getPackages().length,
            totalDeclarations: declarations.length,
            totalReferences: 0,
            totalCallEdges: this.cGraph.getAllEdges().length,
            classesCount: declarations.filter((d) => d.kind === 'class').length,
            functionsCount: declarations.filter((d) => d.kind === 'function').length,
            jsxComponentsCount: declarations.filter((d) => d.kind === 'jsx_component').length,
            scanDurationMs: durationMs,
        };
    }
}
exports.CodeIntelligenceEngine = CodeIntelligenceEngine;
//# sourceMappingURL=code-intelligence-engine.js.map