/**
 * runtime-learning-engine.ts — Phase 25-28 Runtime Learning Engine
 *
 * Tracks per-workspace runtime execution outcomes, latency, and success rates.
 * Dynamically adjusts runtime selection weights as Forge learns over time.
 */
export interface RuntimeExecutionRecord {
    runtimeId: string;
    workspaceRoot: string;
    taskType: string;
    success: boolean;
    durationMs: number;
    timestamp: number;
}
export interface WorkspaceLearningStats {
    workspaceRoot: string;
    totalExecutions: number;
    runtimes: Record<string, {
        successCount: number;
        failCount: number;
        avgDurationMs: number;
        lastUsed: number;
    }>;
}
export declare class RuntimeLearningEngine {
    private getLearningPath;
    /**
     * Logs a runtime execution outcome for a specific workspace.
     */
    recordOutcome(record: RuntimeExecutionRecord): Promise<void>;
    /**
     * Retrieves historical success rates per runtime for a workspace.
     */
    getSuccessRates(workspaceRoot: string): Record<string, number>;
}
