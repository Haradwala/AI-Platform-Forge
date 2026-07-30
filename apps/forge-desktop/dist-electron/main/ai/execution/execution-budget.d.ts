import type { IExecutionBudget } from './execution-types';
export declare class ExecutionBudgetTracker {
    private readonly budget;
    private currentTokens;
    private readonly startTime;
    private currentCost;
    private readonly currentFiles;
    private currentRetries;
    constructor(budget: IExecutionBudget);
    consumeTokens(tokens: number): void;
    consumeCost(cost: number): void;
    trackFileMutation(filePath: string): void;
    recordRetry(): void;
    checkTokenBudget(): boolean;
    checkTimeBudget(): boolean;
    checkCostBudget(): boolean;
    checkFileBudget(): boolean;
    checkRetryBudget(): boolean;
    isExceeded(): {
        exceeded: boolean;
        reason?: string;
    };
    getMetrics(): {
        tokensUsed: number;
        costUsed: number;
        filesMutatedCount: number;
        retriesCount: number;
        elapsedSeconds: number;
    };
}
