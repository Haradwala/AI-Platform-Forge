"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionBudgetTracker = void 0;
class ExecutionBudgetTracker {
    budget;
    currentTokens = 0;
    startTime = Date.now();
    currentCost = 0;
    currentFiles = new Set();
    currentRetries = 0;
    constructor(budget) {
        this.budget = budget;
    }
    consumeTokens(tokens) {
        this.currentTokens += tokens;
    }
    consumeCost(cost) {
        this.currentCost += cost;
    }
    trackFileMutation(filePath) {
        this.currentFiles.add(filePath);
    }
    recordRetry() {
        this.currentRetries++;
    }
    checkTokenBudget() {
        return this.budget.tokenBudget <= 0 || this.currentTokens <= this.budget.tokenBudget;
    }
    checkTimeBudget() {
        if (this.budget.timeBudget <= 0)
            return true;
        const elapsed = (Date.now() - this.startTime) / 1000;
        return elapsed <= this.budget.timeBudget;
    }
    checkCostBudget() {
        return this.budget.costBudget <= 0 || this.currentCost <= this.budget.costBudget;
    }
    checkFileBudget() {
        return this.budget.fileBudget <= 0 || this.currentFiles.size <= this.budget.fileBudget;
    }
    checkRetryBudget() {
        return this.budget.retryBudget <= 0 || this.currentRetries <= this.budget.retryBudget;
    }
    isExceeded() {
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
exports.ExecutionBudgetTracker = ExecutionBudgetTracker;
//# sourceMappingURL=execution-budget.js.map