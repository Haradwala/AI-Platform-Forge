export declare class RecoveryMetrics {
    private totalAttempts;
    private successfulAttempts;
    private totalDurationMs;
    addAttempt(success: boolean, durationMs: number): void;
    getStats(): {
        totalAttempts: number;
        successRate: number;
        averageDurationMs: number;
        totalDurationMs: number;
    };
    clear(): void;
}
