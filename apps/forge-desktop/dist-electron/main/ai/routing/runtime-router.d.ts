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
export declare class RuntimeRouter {
    private matcher;
    private scorer;
    private learningEngine;
    constructor(learningEngine?: RuntimeLearningEngine, matcher?: CapabilityMatcher, scorer?: RuntimeScorer);
    /**
     * Routes an ExecutionRequest to the optimal runtime and executes with failover fallback.
     */
    routeAndExecute(request: ExecutionRequest, availableRuntimes: RuntimeCandidateInfo[], executor: IRuntimeExecutionHandler): Promise<ExecutionResult>;
    /**
     * Evaluates and returns ranked candidate runtimes without executing.
     */
    rankRuntimes(request: ExecutionRequest, availableRuntimes: RuntimeCandidateInfo[]): ScoredRuntimeCandidate[];
}
