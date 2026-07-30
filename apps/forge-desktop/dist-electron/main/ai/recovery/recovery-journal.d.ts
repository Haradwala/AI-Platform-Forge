export interface RecoveryAttemptLog {
    strategyId: string;
    success: boolean;
    durationMs: number;
    timestamp: string;
}
export declare class RecoveryJournal {
    private logs;
    logAttempt(strategyId: string, success: boolean, durationMs: number): void;
    getLogs(): RecoveryAttemptLog[];
    saveJournal(workspaceRoot: string | null): void;
    clear(): void;
}
