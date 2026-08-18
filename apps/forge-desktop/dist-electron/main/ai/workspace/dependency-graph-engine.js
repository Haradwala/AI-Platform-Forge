"use strict";
/**
 * dependency-graph-engine.ts
 *
 * Sprint 86 Phase 3 — Dependency & Import Graph Engine
 *
 * Constructs and queries workspace-wide import graphs for files and packages.
 * Supports path resolution, direct/transitive dependency queries, neighborhood subgraphs,
 * and Tarjan's strongly connected components algorithm for cycle detection.
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
exports.DependencyGraphEngine = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DependencyGraphEngine {
    indexer;
    fileGraph = new Map(); // file -> dependencies
    reverseGraph = new Map(); // file -> dependents
    edgeMap = new Map(); // "from->to" -> importedSymbols
    constructor(indexer) {
        this.indexer = indexer;
    }
    /**
     * Rebuild the file import graph from the WorkspaceSymbolIndexer importIndex.
     */
    buildFileGraph() {
        this.fileGraph.clear();
        this.reverseGraph.clear();
        this.edgeMap.clear();
        const fileCache = this.indexer.fileCache;
        if (!fileCache)
            return;
        // Ensure all known workspace files exist as graph nodes
        for (const filePath of fileCache.keys()) {
            if (!this.fileGraph.has(filePath))
                this.fileGraph.set(filePath, new Set());
            if (!this.reverseGraph.has(filePath))
                this.reverseGraph.set(filePath, new Set());
        }
        for (const [fromFile, fileIdx] of fileCache.entries()) {
            for (const imp of fileIdx.imports || []) {
                const resolvedPath = this.resolveImportPath(fromFile, imp.moduleName);
                if (!resolvedPath)
                    continue; // Skip unresolvable or external node_modules
                // Forward edge
                let deps = this.fileGraph.get(fromFile);
                if (!deps) {
                    deps = new Set();
                    this.fileGraph.set(fromFile, deps);
                }
                deps.add(resolvedPath);
                // Reverse edge
                let revs = this.reverseGraph.get(resolvedPath);
                if (!revs) {
                    revs = new Set();
                    this.reverseGraph.set(resolvedPath, revs);
                }
                revs.add(fromFile);
                // Track imported symbols on edge
                const edgeKey = `${fromFile}->${resolvedPath}`;
                let syms = this.edgeMap.get(edgeKey);
                if (!syms) {
                    syms = new Set();
                    this.edgeMap.set(edgeKey, syms);
                }
                if (imp.importedName) {
                    syms.add(imp.importedName);
                }
            }
        }
    }
    /**
     * Resolves a relative or aliased import path relative to the referencing file.
     */
    resolveImportPath(fromFile, importSpec) {
        if (!importSpec || typeof importSpec !== 'string')
            return null;
        // Skip bare module specifiers (e.g. 'react', 'lodash')
        if (!importSpec.startsWith('.') && !importSpec.startsWith('/')) {
            return null;
        }
        const dir = path.dirname(fromFile);
        const candidates = [
            importSpec,
            `${importSpec}.ts`,
            `${importSpec}.tsx`,
            `${importSpec}.js`,
            `${importSpec}.jsx`,
            path.join(importSpec, 'index.ts'),
            path.join(importSpec, 'index.tsx'),
            path.join(importSpec, 'index.js'),
        ];
        for (const c of candidates) {
            const resolved = path.resolve(dir, c);
            if (fs.existsSync(resolved)) {
                try {
                    const stat = fs.statSync(resolved);
                    if (stat.isFile()) {
                        return resolved;
                    }
                }
                catch {
                    // ignore
                }
            }
        }
        return null;
    }
    /**
     * Get direct dependencies of a file (what it imports).
     */
    getFileDependencies(filePath) {
        this._ensureGraphBuilt();
        const deps = this.fileGraph.get(filePath);
        return deps ? Array.from(deps) : [];
    }
    /**
     * Get direct dependents of a file (files that import it).
     */
    getFileDependents(filePath) {
        this._ensureGraphBuilt();
        const revs = this.reverseGraph.get(filePath);
        return revs ? Array.from(revs) : [];
    }
    /**
     * Get transitive dependencies up to maxDepth (BFS).
     */
    getTransitiveDeps(filePath, maxDepth = 5) {
        this._ensureGraphBuilt();
        const visited = new Set();
        const queue = [{ node: filePath, depth: 0 }];
        while (queue.length > 0) {
            const { node, depth } = queue.shift();
            if (depth > maxDepth)
                continue;
            const deps = this.fileGraph.get(node);
            if (!deps)
                continue;
            for (const dep of deps) {
                if (!visited.has(dep) && dep !== filePath) {
                    visited.add(dep);
                    queue.push({ node: dep, depth: depth + 1 });
                }
            }
        }
        return Array.from(visited);
    }
    /**
     * Detect strongly connected components with >1 node using Tarjan's Algorithm.
     */
    detectCycles() {
        this._ensureGraphBuilt();
        const index = new Map();
        const lowlink = new Map();
        const onStack = new Set();
        const stack = [];
        const cycles = [];
        let idx = 0;
        const strongConnect = (v) => {
            index.set(v, idx);
            lowlink.set(v, idx);
            idx++;
            stack.push(v);
            onStack.add(v);
            const neighbors = this.fileGraph.get(v) || new Set();
            for (const w of neighbors) {
                if (!index.has(w)) {
                    strongConnect(w);
                    lowlink.set(v, Math.min(lowlink.get(v), lowlink.get(w)));
                }
                else if (onStack.has(w)) {
                    lowlink.set(v, Math.min(lowlink.get(v), index.get(w)));
                }
            }
            if (lowlink.get(v) === index.get(v)) {
                const component = [];
                let w;
                do {
                    w = stack.pop();
                    onStack.delete(w);
                    component.push(w);
                } while (w !== v);
                if (component.length > 1) {
                    cycles.push(component);
                }
            }
        };
        for (const v of this.fileGraph.keys()) {
            if (!index.has(v)) {
                strongConnect(v);
            }
        }
        return cycles;
    }
    /**
     * Return a neighborhood subgraph around a center file.
     */
    getSubgraph(centerPath, radius = 2) {
        this._ensureGraphBuilt();
        const subNodes = new Set([centerPath]);
        let frontier = new Set([centerPath]);
        for (let r = 0; r < radius; r++) {
            const nextFrontier = new Set();
            for (const node of frontier) {
                const deps = this.fileGraph.get(node) || new Set();
                const revs = this.reverseGraph.get(node) || new Set();
                for (const d of deps) {
                    if (!subNodes.has(d)) {
                        subNodes.add(d);
                        nextFrontier.add(d);
                    }
                }
                for (const rNode of revs) {
                    if (!subNodes.has(rNode)) {
                        subNodes.add(rNode);
                        nextFrontier.add(rNode);
                    }
                }
            }
            frontier = nextFrontier;
        }
        return this._exportGraphForNodes(Array.from(subNodes));
    }
    /**
     * Export complete DependencyGraph object.
     */
    toGraph() {
        this._ensureGraphBuilt();
        return this._exportGraphForNodes(Array.from(this.fileGraph.keys()));
    }
    /** Invalidate the graph cache. */
    invalidate() {
        this.fileGraph.clear();
        this.reverseGraph.clear();
        this.edgeMap.clear();
    }
    // ── Private Helpers ─────────────────────────────────────────────────────────
    _ensureGraphBuilt() {
        if (this.fileGraph.size === 0) {
            this.buildFileGraph();
        }
    }
    _exportGraphForNodes(nodePaths) {
        const cycles = this.detectCycles();
        const cycleNodes = new Set(cycles.flat());
        const nodes = [];
        const edges = [];
        // Find entry points (nodes with 0 dependents)
        const entryPoints = [];
        for (const filePath of nodePaths) {
            const deps = Array.from(this.fileGraph.get(filePath) || []).filter((d) => nodePaths.includes(d));
            const revs = Array.from(this.reverseGraph.get(filePath) || []).filter((r) => nodePaths.includes(r));
            if (revs.length === 0) {
                entryPoints.push(filePath);
            }
            nodes.push({
                id: filePath,
                label: path.basename(filePath),
                dependencies: deps,
                dependents: revs,
                inCycle: cycleNodes.has(filePath),
                depth: 0,
            });
            for (const d of deps) {
                const edgeKey = `${filePath}->${d}`;
                const syms = Array.from(this.edgeMap.get(edgeKey) || []);
                edges.push({
                    from: filePath,
                    to: d,
                    importedSymbols: syms,
                });
            }
        }
        return {
            nodes,
            edges,
            cycles,
            entryPoints,
            stats: {
                nodeCount: nodes.length,
                edgeCount: edges.length,
                cycleCount: cycles.length,
                maxDepth: 0,
            },
        };
    }
}
exports.DependencyGraphEngine = DependencyGraphEngine;
//# sourceMappingURL=dependency-graph-engine.js.map