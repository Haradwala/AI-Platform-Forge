"use strict";
/**
 * dependency-graph.ts
 *
 * Dependency graph tracking:
 *  - File -> Imports
 *  - Symbol -> References
 *  - Package -> Dependencies
 *  - Service -> Consumers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyGraph = void 0;
class DependencyGraph {
    fileImports = new Map();
    symbolRefs = new Map();
    packageDeps = new Map();
    serviceConsumers = new Map();
    clear() {
        this.fileImports.clear();
        this.symbolRefs.clear();
        this.packageDeps.clear();
        this.serviceConsumers.clear();
    }
    addFileImport(filePath, importedModule) {
        const existing = this.fileImports.get(filePath) || new Set();
        existing.add(importedModule);
        this.fileImports.set(filePath, existing);
    }
    addSymbolReference(symbolName, refFilePath) {
        const existing = this.symbolRefs.get(symbolName) || new Set();
        existing.add(refFilePath);
        this.symbolRefs.set(symbolName, existing);
    }
    addPackageDependencies(packageName, deps) {
        const map = new Map(Object.entries(deps));
        this.packageDeps.set(packageName, map);
    }
    addServiceConsumer(serviceName, consumerFilePath) {
        const existing = this.serviceConsumers.get(serviceName) || new Set();
        existing.add(consumerFilePath);
        this.serviceConsumers.set(serviceName, existing);
    }
    getFileImports(filePath) {
        return Array.from(this.fileImports.get(filePath) || []);
    }
    getSymbolReferences(symbolName) {
        return Array.from(this.symbolRefs.get(symbolName) || []);
    }
    getConsumers(serviceName) {
        return Array.from(this.serviceConsumers.get(serviceName) || []);
    }
    getPackageDependencies(packageName) {
        const map = this.packageDeps.get(packageName);
        if (!map)
            return {};
        return Object.fromEntries(map.entries());
    }
    removeFile(filePath) {
        this.fileImports.delete(filePath);
        for (const [sym, refs] of this.symbolRefs.entries()) {
            refs.delete(filePath);
        }
        for (const [svc, consumers] of this.serviceConsumers.entries()) {
            consumers.delete(filePath);
        }
    }
}
exports.DependencyGraph = DependencyGraph;
//# sourceMappingURL=dependency-graph.js.map