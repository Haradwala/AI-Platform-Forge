"use strict";
/**
 * execution-orchestrator.ts
 *
 * Phase 8 — Execution Orchestrator.
 *
 * Central coordinator for all AI foundation subsystems:
 *  1. MemoryEngine (retrieve)
 *  2. ContextEngine (gather snapshot)
 *  3. PlanningGraph (build DAG & topological order)
 *  4. PromptAssemblyEngine (assemble prompt)
 *  5. RuntimeManager (stream response)
 *  6. ToolExecutionEngine (execute tools)
 *  7. VerificationEngine (verify results)
 *  8. ReflectionEngine (reflect on errors)
 *  9. MemoryEngine (store & consolidate)
 *
 * No subsystem should bypass ExecutionOrchestrator.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionOrchestrator = void 0;
const planning_graph_1 = require("../planner/planning-graph");
const prompt_assembly_engine_1 = require("../context/prompt-assembly-engine");
class ExecutionOrchestrator {
    runtimeManager;
    toolEngine;
    contextEngine;
    memoryEngine;
    verificationEngine;
    reflectionEngine;
    planningGraph;
    promptEngine;
    constructor(runtimeManager, toolEngine, contextEngine, memoryEngine, verificationEngine, reflectionEngine, promptEngine, planningGraph) {
        this.runtimeManager = runtimeManager;
        this.toolEngine = toolEngine;
        this.contextEngine = contextEngine;
        this.memoryEngine = memoryEngine;
        this.verificationEngine = verificationEngine;
        this.reflectionEngine = reflectionEngine;
        this.promptEngine = promptEngine || new prompt_assembly_engine_1.PromptAssemblyEngine();
        this.planningGraph = planningGraph || new planning_graph_1.PlanningGraph();
    }
    async execute(request) {
        const start = Date.now();
        // 1. AbortSignal cancellation check
        if (request.signal?.aborted) {
            throw new Error('Orchestration cancelled by AbortSignal.');
        }
        // 2. Memory Engine Retrieval
        let memories = [];
        if (this.memoryEngine) {
            try {
                memories = await this.memoryEngine.retrieve({
                    query: request.goal,
                    limit: 5,
                    signal: request.signal,
                });
            }
            catch (err) {
                // Non-fatal retrieval fallback
            }
        }
        // 3. Context Engine Snapshot Gathering
        let contextSnapshot = undefined;
        if (this.contextEngine && this.contextEngine.gatherSnapshot) {
            try {
                contextSnapshot = await this.contextEngine.gatherSnapshot({
                    userGoal: request.goal,
                    signal: request.signal,
                    ...(request.contextOptions || {}),
                });
            }
            catch (err) {
                // Non-fatal snapshot fallback
            }
        }
        // 4. PlanningGraph DAG construction
        this.planningGraph.clear();
        this.planningGraph.addNode('step_1', {
            goal: request.goal,
            invocations: request.toolInvocations || [],
        });
        // 5. PromptAssemblyEngine Prompt Assembly
        const assembledPrompt = this.promptEngine.assemble({
            goal: request.goal,
            contextSnapshot,
            memories,
        });
        if (request.signal?.aborted) {
            throw new Error('Orchestration cancelled by AbortSignal.');
        }
        // 6. RuntimeManager Execution
        const activeRuntime = typeof this.runtimeManager.resolveFallbackRuntime === 'function'
            ? this.runtimeManager.resolveFallbackRuntime()
            : this.runtimeManager.active();
        let responseText = '';
        try {
            const stream = await activeRuntime.generateStream(`${assembledPrompt.systemPrompt}\n\n${assembledPrompt.userPrompt}`, request.contextOptions || {}, request.signal);
            responseText = await new Promise((resolve, reject) => {
                let text = '';
                const onAbort = () => reject(new Error('AI stream cancelled by AbortSignal.'));
                if (request.signal?.aborted) {
                    onAbort();
                    return;
                }
                request.signal?.addEventListener('abort', onAbort);
                stream.onToken((t) => { text += t; });
                stream.onComplete((full) => {
                    request.signal?.removeEventListener('abort', onAbort);
                    resolve(full || text);
                });
                stream.onError((e) => {
                    request.signal?.removeEventListener('abort', onAbort);
                    reject(e);
                });
            });
        }
        catch (rErr) {
            responseText = `Runtime execution warning: ${rErr instanceof Error ? rErr.message : String(rErr)}`;
        }
        // 7. ToolExecutionEngine Invocations
        const toolResults = [];
        if (request.toolInvocations && request.toolInvocations.length > 0 && this.toolEngine) {
            for (const inv of request.toolInvocations) {
                if (request.signal?.aborted)
                    break;
                const res = await this.toolEngine.executeTool(inv, { signal: request.signal });
                toolResults.push(res);
            }
        }
        // 8. VerificationEngine Verification
        let verificationPassed = true;
        let verificationIssues = [];
        let mockReport = undefined;
        const failedTools = toolResults.filter((t) => !t.success);
        if (failedTools.length > 0) {
            verificationPassed = false;
            verificationIssues.push(...failedTools.map((t) => t.error?.message || 'Tool failed'));
        }
        if (verificationPassed && this.verificationEngine && request.verificationPolicy) {
            try {
                mockReport = await this.verificationEngine.verify(request.verificationPolicy, request.workspaceRoot ?? null);
                verificationPassed = mockReport.success;
                if (!verificationPassed) {
                    verificationIssues.push('Verification policy failed');
                }
            }
            catch (vErr) {
                verificationPassed = false;
                verificationIssues.push(vErr instanceof Error ? vErr.message : 'Verification error');
            }
        }
        // 9. ReflectionEngine Reflection on failure
        let reflectionText = undefined;
        if (!verificationPassed && this.reflectionEngine) {
            try {
                const planDummy = { id: 'plan_1', goal: request.goal, tasks: [] };
                const verReportDummy = mockReport || {
                    success: false,
                    state: 'failed',
                    policy: request.verificationPolicy || 'standard',
                    durationMs: 0,
                    compilation: { success: false, errors: [] },
                    lint: { success: false, errors: [] },
                    test: { success: false, passCount: 0, failCount: 1, errors: [] },
                    format: { success: true, filesUnformatted: [] },
                    security: { success: true, issues: [] },
                    architecture: { success: true, issues: [] },
                    performance: { success: true, issues: [] },
                    suggestions: verificationIssues,
                };
                const refObj = await this.reflectionEngine.reflect(planDummy, verReportDummy, null, request.workspaceRoot ?? null);
                reflectionText = refObj.recommendations ? refObj.recommendations.join('; ') : 'Verification issues identified';
            }
            catch (rfErr) {
                reflectionText = `Reflection on failure: ${verificationIssues.join('; ')}`;
            }
        }
        // 10. Memory Engine Storage & Consolidation
        if (this.memoryEngine) {
            try {
                this.memoryEngine.store({
                    type: 'conversation',
                    content: `Goal "${request.goal}" evaluated: success=${verificationPassed}`,
                    importance: verificationPassed ? 7 : 4,
                });
                await this.memoryEngine.consolidate();
            }
            catch (mErr) {
                // Non-fatal memory update fallback
            }
        }
        this.planningGraph.markStatus('step_1', verificationPassed ? 'completed' : 'failed');
        return {
            success: verificationPassed,
            assembledPrompt,
            response: responseText,
            toolResults,
            verificationPassed,
            verificationIssues,
            reflection: reflectionText,
            durationMs: Date.now() - start,
        };
    }
}
exports.ExecutionOrchestrator = ExecutionOrchestrator;
//# sourceMappingURL=execution-orchestrator.js.map