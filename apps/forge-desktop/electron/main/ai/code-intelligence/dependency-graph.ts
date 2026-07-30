/**
 * dependency-graph.ts
 *
 * Dependency graph tracking:
 *  - File -> Imports
 *  - Symbol -> References
 *  - Package -> Dependencies
 *  - Service -> Consumers
 */

export class DependencyGraph {
  private readonly fileImports = new Map<string, Set<string>>();
  private readonly symbolRefs = new Map<string, Set<string>>();
  private readonly packageDeps = new Map<string, Map<string, string>>();
  private readonly serviceConsumers = new Map<string, Set<string>>();

  clear(): void {
    this.fileImports.clear();
    this.symbolRefs.clear();
    this.packageDeps.clear();
    this.serviceConsumers.clear();
  }

  addFileImport(filePath: string, importedModule: string): void {
    const existing = this.fileImports.get(filePath) || new Set();
    existing.add(importedModule);
    this.fileImports.set(filePath, existing);
  }

  addSymbolReference(symbolName: string, refFilePath: string): void {
    const existing = this.symbolRefs.get(symbolName) || new Set();
    existing.add(refFilePath);
    this.symbolRefs.set(symbolName, existing);
  }

  addPackageDependencies(packageName: string, deps: Record<string, string>): void {
    const map = new Map(Object.entries(deps));
    this.packageDeps.set(packageName, map);
  }

  addServiceConsumer(serviceName: string, consumerFilePath: string): void {
    const existing = this.serviceConsumers.get(serviceName) || new Set();
    existing.add(consumerFilePath);
    this.serviceConsumers.set(serviceName, existing);
  }

  getFileImports(filePath: string): string[] {
    return Array.from(this.fileImports.get(filePath) || []);
  }

  getSymbolReferences(symbolName: string): string[] {
    return Array.from(this.symbolRefs.get(symbolName) || []);
  }

  getConsumers(serviceName: string): string[] {
    return Array.from(this.serviceConsumers.get(serviceName) || []);
  }

  getPackageDependencies(packageName: string): Record<string, string> {
    const map = this.packageDeps.get(packageName);
    if (!map) return {};
    return Object.fromEntries(map.entries());
  }

  removeFile(filePath: string): void {
    this.fileImports.delete(filePath);

    for (const [sym, refs] of this.symbolRefs.entries()) {
      refs.delete(filePath);
    }

    for (const [svc, consumers] of this.serviceConsumers.entries()) {
      consumers.delete(filePath);
    }
  }
}
