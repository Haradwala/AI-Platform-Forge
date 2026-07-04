import { describe, it, expect } from 'vitest';
import { BudgetManager } from '../src/budget/budget-manager';
import { BalancedBudgetPolicy } from '../src/budget/policies/balanced';
import { AggressiveBudgetPolicy } from '../src/budget/policies/aggressive';
import { ICandidateContext } from '@forge/shared';

describe('BudgetManager Policies', () => {
  const manager = new BudgetManager();
  const timestamp = new Date();

  const c1: ICandidateContext = {
    id: '1', type: 'file', path: 'a.ts', content: 'content_a', estimatedTokens: 5000,
    metadata: { workspaceId: 'w', retrievalSource: 'workspace', confidenceScore: 1.0, createdAt: timestamp },
    relevanceScore: 1.0, importanceScore: 1.0, graphDistance: 0, freshnessScore: 1.0
  };

  const c2: ICandidateContext = {
    id: '2', type: 'file', path: 'b.ts', content: 'content_b', estimatedTokens: 4000,
    metadata: { workspaceId: 'w', retrievalSource: 'workspace', confidenceScore: 0.9, createdAt: timestamp },
    relevanceScore: 0.85, importanceScore: 0.8, graphDistance: 1, freshnessScore: 0.8
  };

  it('should fit candidates inside BalancedBudgetPolicy boundaries', () => {
    const policy = new BalancedBudgetPolicy();
    const result = manager.fit([c1, c2], policy);

    expect(result.length).toBe(2);
    expect(result[1].estimatedTokens).toBe(2000);
  });

  it('should fit candidates inside AggressiveBudgetPolicy boundaries', () => {
    const policy = new AggressiveBudgetPolicy();
    const result = manager.fit([c1, c2], policy);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });
});
