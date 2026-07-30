import { describe, it, expect } from 'vitest';
import { ExecutionBudgetTracker } from '../electron/main/ai/execution/execution-budget';

describe('ExecutionBudgetTracker', () => {
  it('enforces token budget constraints', () => {
    const tracker = new ExecutionBudgetTracker({
      tokenBudget: 1000,
      timeBudget: 100,
      costBudget: 0.1,
      fileBudget: 5,
      retryBudget: 3,
    });

    tracker.consumeTokens(500);
    expect(tracker.isExceeded().exceeded).toBe(false);

    tracker.consumeTokens(600);
    const check = tracker.isExceeded();
    expect(check.exceeded).toBe(true);
    expect(check.reason).toContain('Token budget exceeded');
  });

  it('enforces file mutation budget constraints', () => {
    const tracker = new ExecutionBudgetTracker({
      tokenBudget: 1000,
      timeBudget: 100,
      costBudget: 0.1,
      fileBudget: 2,
      retryBudget: 3,
    });

    tracker.trackFileMutation('a.ts');
    tracker.trackFileMutation('b.ts');
    expect(tracker.isExceeded().exceeded).toBe(false);

    tracker.trackFileMutation('c.ts');
    const check = tracker.isExceeded();
    expect(check.exceeded).toBe(true);
    expect(check.reason).toContain('File mutation budget exceeded');
  });
});
