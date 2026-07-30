import type { RecoveryStrategyRegistry } from './recovery-strategy-registry';
export declare class RecoveryExecutor {
    private readonly registry;
    constructor(registry: RecoveryStrategyRegistry);
    executeStrategy(strategyId: string, workspaceRoot: string | null): Promise<{
        success: boolean;
        message: string;
    }>;
}
