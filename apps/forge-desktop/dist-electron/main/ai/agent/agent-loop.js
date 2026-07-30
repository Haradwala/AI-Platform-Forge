"use strict";
/**
 * agent-loop.ts
 *
 * Phase 5 — Agent Loop.
 *
 * Generic, provider-agnostic iterative reasoning loop.
 * Flow: Goal -> Plan -> Execute -> Verify -> Reflect -> Repeat (until success or max iterations).
 *
 * Supports AbortSignal, max iteration limits, verification integration, tool execution,
 * and deterministic retry handling without provider-specific logic.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentLoop = void 0;
// ─── Implementation ───────────────────────────────────────────────────────────
class AgentLoop {
    aiKernel;
    toolEngine;
    verificationEngine;
    memoryEngine;
    orchestrator;
    constructor(aiKernel, toolEngine, verificationEngine, memoryEngine, orchestrator) {
        this.aiKernel = aiKernel;
        this.toolEngine = toolEngine;
        this.verificationEngine = verificationEngine;
        this.memoryEngine = memoryEngine;
        this.orchestrator = orchestrator;
    }
    async runTask(options) {
        const start = Date.now();
        const maxIterations = options.maxIterations ?? 5;
        const steps = [];
        let currentContext = { ...(options.context || {}) };
        let previousReflection = '';
        // Phase 7 Integration: Retrieve relevant memories before loop starts
        if (this.memoryEngine) {
            try {
                const memories = await this.memoryEngine.retrieve({
                    query: options.goal,
                    limit: 5,
                    signal: options.signal,
                });
                if (memories.length > 0) {
                    currentContext.retrievedMemories = memories.map((m) => m.content);
                }
            }
            catch (mErr) {
                // Non-fatal memory retrieval fallback
            }
        }
        for (let iteration = 1; iteration <= maxIterations; iteration++) {
            // Check cancellation before iteration start
            if (options.signal?.aborted) {
                const step = {
                    iteration,
                    phase: 'cancelled',
                    error: 'Agent loop execution cancelled by AbortSignal.',
                    timestamp: Date.now(),
                };
                steps.push(step);
                return {
                    success: false,
                    finalState: 'cancelled',
                    totalIterations: steps.length,
                    steps,
                    summary: 'Task was cancelled.',
                    error: 'Cancelled by AbortSignal.',
                    durationMs: Date.now() - start,
                };
            }
            // ─── Phase 1: Plan ─────────────────────────────────────────────────────
            const planningStep = {
                iteration,
                phase: 'planning',
                timestamp: Date.now(),
            };
            let planText = '';
            try {
                const promptGoal = previousReflection
                    ? `Goal: ${options.goal}\nPrevious Attempt Reflection: ${previousReflection}\nFormulate revised plan.`
                    : options.goal;
                planText = await this.aiKernel.executeTask({
                    goal: promptGoal,
                    context: currentContext,
                    executionMode: 'plan',
                }, () => { });
                planningStep.plan = planText;
            }
            catch (err) {
                planningStep.error = err instanceof Error ? err.message : String(err);
            }
            steps.push(planningStep);
            // Check cancellation after planning
            if (options.signal?.aborted) {
                return this.cancelResult(steps, start);
            }
            // ─── Phase 2: Execute ──────────────────────────────────────────────────
            const executionStep = {
                iteration,
                phase: 'executing',
                timestamp: Date.now(),
            };
            const toolResults = [];
            const invocations = options.toolInvocations || [];
            if (invocations.length > 0 && this.toolEngine) {
                executionStep.toolInvocations = invocations;
                for (const inv of invocations) {
                    if (options.signal?.aborted) {
                        return this.cancelResult(steps, start);
                    }
                    const res = await this.toolEngine.executeTool(inv, {
                        signal: options.signal,
                    });
                    toolResults.push(res);
                }
                executionStep.toolResults = toolResults;
            }
            steps.push(executionStep);
            // ─── Phase 3: Verify ───────────────────────────────────────────────────
            const verificationStep = {
                iteration,
                phase: 'verifying',
                timestamp: Date.now(),
            };
            let passed = true;
            let issues = [];
            // Check if any tool execution failed
            const failedTools = toolResults.filter((r) => !r.success);
            if (failedTools.length > 0) {
                passed = false;
                issues.push(...failedTools.map((t) => t.error?.message || 'Tool execution failed'));
            }
            // Run VerificationEngine if provided and tools succeeded so far
            if (passed && this.verificationEngine && options.verificationPolicy) {
                try {
                    const report = await this.verificationEngine.verify(options.verificationPolicy, options.workspaceRoot ?? null);
                    passed = report.success;
                    if (!passed) {
                        const evidences = [
                            ...(report.compilation?.errors || []),
                            ...(report.lint?.errors || []),
                            ...(report.test?.errors || []),
                            ...(report.security?.issues || []),
                            ...(report.architecture?.issues || []),
                            ...(report.performance?.issues || []),
                        ];
                        if (evidences.length > 0) {
                            issues.push(...evidences.map((e) => `${e.source || 'verifier'}: ${e.message}`));
                        }
                        else {
                            issues.push('Verification checks failed');
                        }
                    }
                }
                catch (vErr) {
                    passed = false;
                    issues.push(vErr instanceof Error ? vErr.message : 'Verification engine error');
                }
            }
            verificationStep.verification = { passed, issues };
            steps.push(verificationStep);
            // ─── Phase 4: Reflect ──────────────────────────────────────────────────
            if (passed) {
                const completeStep = {
                    iteration,
                    phase: 'completed',
                    timestamp: Date.now(),
                };
                steps.push(completeStep);
                if (this.memoryEngine) {
                    try {
                        this.memoryEngine.store({
                            type: 'conversation',
                            content: `Goal "${options.goal}" completed successfully on iteration ${iteration}.`,
                            importance: 7,
                        });
                        await this.memoryEngine.consolidate();
                    }
                    catch (mErr) {
                        // Non-fatal memory storage fallback
                    }
                }
                return {
                    success: true,
                    finalState: 'completed',
                    totalIterations: iteration,
                    steps,
                    summary: `Task completed successfully on iteration ${iteration}.`,
                    durationMs: Date.now() - start,
                };
            }
            // Reflection phase on failure
            const reflectStep = {
                iteration,
                phase: 'reflecting',
                timestamp: Date.now(),
            };
            previousReflection = `Iteration ${iteration} failed: ${issues.join('; ')}`;
            reflectStep.reflection = previousReflection;
            steps.push(reflectStep);
            // Update context for next iteration
            currentContext = {
                ...currentContext,
                lastFailure: previousReflection,
            };
        }
        // Max iterations reached without success
        const failStep = {
            iteration: maxIterations,
            phase: 'failed',
            error: `Reached max iterations (${maxIterations}) without passing verification.`,
            timestamp: Date.now(),
        };
        steps.push(failStep);
        return {
            success: false,
            finalState: 'failed',
            totalIterations: maxIterations,
            steps,
            summary: `Failed to complete goal within ${maxIterations} iterations.`,
            error: `Max iterations (${maxIterations}) reached.`,
            durationMs: Date.now() - start,
        };
    }
    cancelResult(steps, startMs) {
        steps.push({
            iteration: steps.length > 0 ? steps[steps.length - 1].iteration : 1,
            phase: 'cancelled',
            error: 'Task cancelled by AbortSignal.',
            timestamp: Date.now(),
        });
        return {
            success: false,
            finalState: 'cancelled',
            totalIterations: steps.length,
            steps,
            summary: 'Task was cancelled.',
            error: 'Cancelled by AbortSignal.',
            durationMs: Date.now() - startMs,
        };
    }
}
exports.AgentLoop = AgentLoop;
//# sourceMappingURL=agent-loop.js.map