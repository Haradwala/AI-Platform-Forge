export declare class RollbackManager {
    private snapshots;
    saveSnapshot(filePath: string): void;
    restoreSnapshots(): void;
    clearSnapshots(): void;
}
