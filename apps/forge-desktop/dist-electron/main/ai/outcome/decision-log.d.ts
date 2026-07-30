export interface IDecisionLogEntry {
    strategyId: string;
    reason: string;
    confidence: number;
    alternatives: string[];
}
export declare class DecisionLog {
    private entries;
    logDecision(strategyId: string, reason: string, confidence: number, alternatives: string[]): void;
    getEntries(): IDecisionLogEntry[];
    saveDecisionLog(workspaceRoot: string | null): void;
    clear(): void;
}
