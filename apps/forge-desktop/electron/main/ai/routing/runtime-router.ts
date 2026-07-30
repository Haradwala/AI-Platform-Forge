/**
 * runtime-router.ts — Phase 25-28 Runtime Router & Failover Engine
 *
 * Orchestrates runtime selection for an ExecutionRequest using CapabilityMatcher,
 * RuntimeScorer, and RuntimeLearningEngine. Implements automatic failover fallback.
 */

import { ExecutionRequest, ExecutionResult } from '../contracts/execution-contracts';
import { CapabilityMatcher, RuntimeCandidateInfo } from './capability-matcher';
import { RuntimeScorer, ScoredRuntimeCandidate } from './runtime-scorer';
import { RuntimeLearningEngine } from '../learning/runtime-learning-engine';

export interface IRuntimeExecutionHandler {
  execute(runtimeId: string, request: ExecutionRequest): Promise<ExecutionResult>;
}

export class RuntimeRouter {
  private matcher: CapabilityMatcher;
  private scorer: RuntimeScorer;
  private learningEngine: RuntimeLearningEngine;

  constructor(
    learningEngine?: RuntimeLearningEngine,
    matcher?: CapabilityMatcher,
    scorer?: RuntimeScorer
  ) {
    this.learningEngine = learningEngine || new RuntimeLearningEngine();
    this.matcher = matcher || new CapabilityMatcher();
    this.scorer = scorer || new RuntimeScorer();
  }

  /**
   * Routes an ExecutionRequest to the optimal runtime and executes with failover fallback.
   */
  async routeAndExecute(
    request: ExecutionRequest,
    availableRuntimes: RuntimeCandidateInfo[],
    executor: IRuntimeExecutionHandler
  ): Promise<ExecutionResult> {
    // 1. Filter candidates by capability match
    const matched = this.matcher.matchCandidates(request, availableRuntimes);
    if (matched.length === 0) {
      throw new Error(`No available runtime satisfies requested capabilities: ${request.capabilities.join(', ')}`);
    }

    // 2. Fetch workspace historical success rates
    const successRates = this.learningEngine.getSuccessRates(request.workspaceRoot);

    // 3. Score matched candidates
    const scoredCandidates = this.scorer.scoreCandidates(request, matched, successRates);
    if (scoredCandidates.length === 0) {
      throw new Error('Runtime scoring yielded 0 candidates.');
    }

    // 4. Try candidates in rank order (automatic failover)
    const errors: string[] = [];
    for (const item of scoredCandidates) {
      const candidateId = item.candidate.id;
      const start = Date.now();
      try {
        const result = await executor.execute(candidateId, request);
        const durationMs = Date.now() - start;

        // Log learning outcome
        await this.learningEngine.recordOutcome({
          runtimeId: candidateId,
          workspaceRoot: request.workspaceRoot,
          taskType: request.intent,
          success: result.status === 'COMPLETED',
          durationMs,
          timestamp: Date.now(),
        });

        if (result.status === 'COMPLETED') {
          return result;
        }
        errors.push(`Runtime ${candidateId} failed: ${result.error || 'Execution uncompleted'}`);
      } catch (err: any) {
        const durationMs = Date.now() - start;
        await this.learningEngine.recordOutcome({
          runtimeId: candidateId,
          workspaceRoot: request.workspaceRoot,
          taskType: request.intent,
          success: false,
          durationMs,
          timestamp: Date.now(),
        });
        errors.push(`Runtime ${candidateId} threw error: ${err.message}`);
      }
    }

    throw new Error(`All candidate runtimes failed execution. Details:\n${errors.join('\n')}`);
  }

  /**
   * Evaluates and returns ranked candidate runtimes without executing.
   */
  rankRuntimes(
    request: ExecutionRequest,
    availableRuntimes: RuntimeCandidateInfo[]
  ): ScoredRuntimeCandidate[] {
    const matched = this.matcher.matchCandidates(request, availableRuntimes);
    const successRates = this.learningEngine.getSuccessRates(request.workspaceRoot);
    return this.scorer.scoreCandidates(request, matched, successRates);
  }
}
