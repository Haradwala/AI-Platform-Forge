/**
 * dependency-graph.ts
 *
 * Dependency graph tracking:
 *  - File -> Imports
 *  - Symbol -> References
 *  - Package -> Dependencies
 *  - Service -> Consumers
 */
export declare class DependencyGraph {
    private readonly fileImports;
    private readonly symbolRefs;
    private readonly packageDeps;
    private readonly serviceConsumers;
    clear(): void;
    addFileImport(filePath: string, importedModule: string): void;
    addSymbolReference(symbolName: string, refFilePath: string): void;
    addPackageDependencies(packageName: string, deps: Record<string, string>): void;
    addServiceConsumer(serviceName: string, consumerFilePath: string): void;
    getFileImports(filePath: string): string[];
    getSymbolReferences(symbolName: string): string[];
    getConsumers(serviceName: string): string[];
    getPackageDependencies(packageName: string): Record<string, string>;
    removeFile(filePath: string): void;
}
