"use strict";
/**
 * runtime-router.ts — Phase 25-28 Runtime Router & Failover Engine
 *
 * Orchestrates runtime selection for an ExecutionRequest using CapabilityMatcher,
 * RuntimeScorer, and RuntimeLearningEngine. Implements automatic failover fallback.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeRouter = void 0;
const capability_matcher_1 = require("./capability-matcher");
const runtime_scorer_1 = require("./runtime-scorer");
const runtime_learning_engine_1 = require("../learning/runtime-learning-engine");
class RuntimeRouter {
    matcher;
    scorer;
    learningEngine;
    constructor(learningEngine, matcher, scorer) {
        this.learningEngine = learningEngine || new runtime_learning_engine_1.RuntimeLearningEngine();
        this.matcher = matcher || new capability_matcher_1.CapabilityMatcher();
        this.scorer = scorer || new runtime_scorer_1.RuntimeScorer();
    }
    /**
     * Routes an ExecutionRequest to the optimal runtime and executes with failover fallback.
     */
    async routeAndExecute(request, availableRuntimes, executor) {
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
        const errors = [];
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
            }
            catch (err) {
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
    rankRuntimes(request, availableRuntimes) {
        const matched = this.matcher.matchCandidates(request, availableRuntimes);
        const successRates = this.learningEngine.getSuccessRates(request.workspaceRoot);
        return this.scorer.scoreCandidates(request, matched, successRates);
    }
}
exports.RuntimeRouter = RuntimeRouter;
//# sourceMappingURL=runtime-router.js.map