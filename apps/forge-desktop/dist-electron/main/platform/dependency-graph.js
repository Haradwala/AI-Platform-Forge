"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyGraphService = void 0;
class DependencyGraphService {
    imports = new Map();
    references = new Map();
    addImports(filePath, fileImports) {
        this.imports.set(filePath, fileImports);
    }
    addReferences(filePath, fileReferences) {
        for (const ref of fileReferences) {
            if (!this.references.has(ref)) {
                this.references.set(ref, []);
            }
            const list = this.references.get(ref);
            if (!list.includes(filePath)) {
                list.push(filePath);
            }
        }
    }
    removeFile(filePath) {
        this.imports.delete(filePath);
        for (const [ref, list] of this.references.entries()) {
            const idx = list.indexOf(filePath);
            if (idx !== -1) {
                list.splice(idx, 1);
            }
            if (list.length === 0) {
                this.references.delete(ref);
            }
        }
    }
    getImports(filePath) {
        return this.imports.get(filePath) || [];
    }
    getReferences(symbolName) {
        return this.references.get(symbolName) || [];
    }
    findDependencyPath(from, to) {
        const queue = [[from, [from]]];
        const visited = new Set([from]);
        while (queue.length > 0) {
            const [curr, path] = queue.shift();
            if (curr === to)
                return path;
            const deps = this.imports.get(curr) || [];
            for (const dep of deps) {
                if (!visited.has(dep)) {
                    visited.add(dep);
                    queue.push([dep, [...path, dep]]);
                }
            }
        }
        return null;
    }
    findCircularDependencies() {
        const visited = new Set();
        const stack = new Set();
        const cycles = [];
        const dfs = (node, currentPath) => {
            visited.add(node);
            stack.add(node);
            const deps = this.imports.get(node) || [];
            for (const dep of deps) {
                if (!visited.has(dep)) {
                    dfs(dep, [...currentPath, dep]);
                }
                else if (stack.has(dep)) {
                    const idx = currentPath.indexOf(dep);
                    if (idx !== -1) {
                        cycles.push([...currentPath.slice(idx), dep]);
                    }
                }
            }
            stack.delete(node);
        };
        for (const node of this.imports.keys()) {
            if (!visited.has(node)) {
                dfs(node, [node]);
            }
        }
        return cycles;
    }
    clear() {
        this.imports.clear();
        this.references.clear();
    }
}
exports.DependencyGraphService = DependencyGraphService;
//# sourceMappingURL=dependency-graph.js.map