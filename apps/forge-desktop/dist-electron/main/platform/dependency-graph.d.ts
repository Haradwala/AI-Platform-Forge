export declare class DependencyGraphService {
    private readonly imports;
    private readonly references;
    addImports(filePath: string, fileImports: string[]): void;
    addReferences(filePath: string, fileReferences: string[]): void;
    removeFile(filePath: string): void;
    getImports(filePath: string): string[];
    getReferences(symbolName: string): string[];
    findDependencyPath(from: string, to: string): string[] | null;
    findCircularDependencies(): string[][];
    clear(): void;
}
