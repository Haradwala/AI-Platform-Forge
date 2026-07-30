import type { IExecutionBudget } from './execution-types';

export class ExecutionBudgetTracker {
  private currentTokens = 0;
  private readonly startTime = Date.now();
  private currentCost = 0;
  private readonly currentFiles = new Set<string>();
  private currentRetries = 0;

  constructor(private readonly budget: IExecutionBudget) {}

  consumeTokens(tokens: number): void {
    this.currentTokens += tokens;
  }

  consumeCost(cost: number): void {
    this.currentCost += cost;
  }

  trackFileMutation(filePath: string): void {
    this.currentFiles.add(filePath);
  }

  recordRetry(): void {
    this.currentRetries++;
  }

  checkTokenBudget(): boolean {
    return this.budget.tokenBudget <= 0 || this.currentTokens <= this.budget.tokenBudget;
  }

  checkTimeBudget(): boolean {
    if (this.budget.timeBudget <= 0) return true;
    const elapsed = (Date.now() - this.startTime) / 1000;
    return elapsed <= this.budget.timeBudget;
  }

  checkCostBudget(): boolean {
    return this.budget.costBudget <= 0 || this.currentCost <= this.budget.costBudget;
  }

  checkFileBudget(): boolean {
    return this.budget.fileBudget <= 0 || this.currentFiles.size <= this.budget.fileBudget;
  }

  checkRetryBudget(): boolean {
    return this.budget.retryBudget <= 0 || this.currentRetries <= this.budget.retryBudget;
  }

  isExceeded(): { exceeded: boolean; reason?: string } {
    if (!this.checkTokenBudget()) {
      return { exceeded: true, reason: `Token budget exceeded: ${this.currentTokens}/${this.budget.tokenBudget}` };
    }
    if (!this.checkTimeBudget()) {
      return { exceeded: true, reason: `Time budget exceeded` };
    }
    if (!this.checkCostBudget()) {
      return { exceeded: true, reason: `Cost budget exceeded: ${this.currentCost}/${this.budget.costBudget}` };
    }
    if (!this.checkFileBudget()) {
      return { exceeded: true, reason: `File mutation budget exceeded: ${this.currentFiles.size}/${this.budget.fileBudget}` };
    }
    if (!this.checkRetryBudget()) {
      return { exceeded: true, reason: `Retry budget exceeded: ${this.currentRetries}/${this.budget.retryBudget}` };
    }
    return { exceeded: false };
  }

  getMetrics() {
    return {
      tokensUsed: this.currentTokens,
      costUsed: this.currentCost,
      filesMutatedCount: this.currentFiles.size,
      retriesCount: this.currentRetries,
      elapsedSeconds: (Date.now() - this.startTime) / 1000
    };
  }
}
