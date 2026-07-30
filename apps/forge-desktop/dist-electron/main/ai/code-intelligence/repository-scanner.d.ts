/**
 * repository-scanner.ts
 *
 * Scans workspace files, tracking files, folders, and package configurations.
 * Ignores node_modules, dist, build, .git, and common build artifacts.
 */
export interface ScannedFile {
    path: string;
    folder: string;
    extension: string;
    size: number;
    mtime: number;
}
export interface ScannedPackage {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    path: string;
}
export declare class RepositoryScanner {
    private readonly files;
    private readonly packages;
    clear(): void;
    isIgnored(filePath: string): boolean;
    scanWorkspace(files: Array<{
        path: string;
        content?: string;
        size?: number;
        mtime?: number;
    }>, signal?: AbortSignal): Promise<{
        files: ScannedFile[];
        packages: ScannedPackage[];
    }>;
    addFile(filePath: string, content?: string, size?: number, mtime?: number): void;
    removeFile(filePath: string): void;
    getFiles(): ScannedFile[];
    getPackages(): ScannedPackage[];
}
