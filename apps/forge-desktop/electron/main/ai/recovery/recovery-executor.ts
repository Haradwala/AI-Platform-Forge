import type { RecoveryStrategyRegistry } from './recovery-strategy-registry';

export class RecoveryExecutor {
  constructor(private readonly registry: RecoveryStrategyRegistry) {}

  async executeStrategy(
    strategyId: string,
    workspaceRoot: string | null
  ): Promise<{ success: boolean; message: string }> {
    const strategy = this.registry.getById(strategyId);
    if (!strategy) {
      throw new Error(`Strategy plugin not found: "${strategyId}"`);
    }
    return strategy.execute(workspaceRoot);
  }
}
