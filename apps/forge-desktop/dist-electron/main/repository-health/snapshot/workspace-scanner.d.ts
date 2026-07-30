export declare class WorkspaceScanner {
    scanDirectory(rootPath: string): Promise<string[]>;
    private walk;
}
