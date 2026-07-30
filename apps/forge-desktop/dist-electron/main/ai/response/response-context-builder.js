"use strict";
/**
 * response-context-builder.ts
 *
 * ResponseContextBuilder — assembles a structured, provider-agnostic
 * ResponseRequest from a completed PipelineContext.
 *
 * Responsibilities:
 *  - Read PipelineContext fields safely (every field is optional)
 *  - Produce a flat, typed ResponseRequest with no internal engineering types
 *  - Make NO decisions about prompt format or runtime selection
 *  - Remain stateless and dependency-free (no DI required)
 *
 * The ResponseGenerationEngine is responsible for turning ResponseRequest
 * into a runtime-specific prompt string.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseContextBuilder = void 0;
const fact_interpreter_1 = require("./fact-interpreter");
class ResponseContextBuilder {
    factInterpreter = new fact_interpreter_1.FactInterpreter();
    /**
     * Assembles a ResponseRequest from the pipeline's final context and
     * the original user prompt.
     *
     * All fields degrade gracefully when context data is absent (e.g., when
     * a stage was skipped).
     */
    build(context, userPrompt) {
        // Use the real IPlan.goal field (not goalDescription)
        const goal = context.generatedPlan?.goal ||
            context.generatedPlan?.goalDescription ||
            userPrompt;
        const executionSuccess = context.executionOutcome?.success ??
            context.verificationReport?.success ??
            true;
        const verificationSuccess = context.verificationReport?.success ?? true;
        const recommendations = context.reflectionReport?.recommendations ?? [];
        // Assemble a brief context summary from available collection data.
        const contextSummary = this._buildContextSummary(context);
        // Interpret execution results into structured GroundedContext facts
        let groundedContext;
        if (context.executionResults && context.executionResults.length > 0) {
            groundedContext = this.factInterpreter.interpret(context.executionResults);
        }
        return {
            userPrompt,
            workspace: {
                root: context.workspaceRoot,
            },
            execution: {
                success: executionSuccess,
                goal,
            },
            verification: {
                success: verificationSuccess,
            },
            reflection: {
                recommendations,
            },
            context: {
                summary: contextSummary,
            },
            groundedContext,
        };
    }
    // ─── Private Helpers ────────────────────────────────────────────────────────
    _buildContextSummary(context) {
        const parts = [];
        const collected = context.contextCollected;
        if (collected?.workspace?.rootPath) {
            parts.push(`Workspace: ${collected.workspace.rootPath}`);
        }
        if (collected?.workspace?.fileCount !== undefined) {
            parts.push(`Total files: ${collected.workspace.fileCount}`);
        }
        if (collected?.workspace?.languages?.length) {
            parts.push(`Languages: ${collected.workspace.languages.join(', ')}`);
        }
        const memories = context.memoriesFetched;
        if (Array.isArray(memories) && memories.length > 0) {
            parts.push(`Relevant memories retrieved: ${memories.length}`);
        }
        return parts.length > 0 ? parts.join('\n') : '';
    }
}
exports.ResponseContextBuilder = ResponseContextBuilder;
//# sourceMappingURL=response-context-builder.js.map