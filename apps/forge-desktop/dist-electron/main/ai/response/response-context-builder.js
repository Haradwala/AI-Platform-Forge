"use strict";
/**
 * response-context-builder.ts
 *
 * ResponseContextBuilder — assembles a structured, provider-agnostic
 * ResponseRequest from a completed PipelineContext.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseContextBuilder = void 0;
const fact_interpreter_1 = require("./fact-interpreter");
const result_normalizer_1 = require("../pipeline/result-normalizer");
class ResponseContextBuilder {
    factInterpreter;
    normalizer;
    constructor(factInterpreter = new fact_interpreter_1.FactInterpreter(), normalizer = new result_normalizer_1.ResultNormalizer()) {
        this.factInterpreter = factInterpreter;
        this.normalizer = normalizer;
    }
    /**
     * Assembles a ResponseRequest from the pipeline's final context and user prompt.
     */
    build(context, userPrompt, activeFileFact) {
        const goal = context.generatedPlan?.goal ||
            context.generatedPlan?.goalDescription ||
            userPrompt;
        const executionSuccess = context.executionOutcome?.success ??
            context.verificationReport?.success ??
            true;
        const verificationSuccess = context.verificationReport?.success ?? true;
        const recommendations = context.reflectionReport?.recommendations ?? [];
        const contextSummary = this._buildContextSummary(context);
        // Pass results through ResultNormalizer before handing to FactInterpreter
        let groundedContext;
        if (context.executionResults && context.executionResults.length > 0) {
            const normalizedResults = context.executionResults.map((exec) => {
                if (!exec.result)
                    return exec;
                const normalized = this.normalizer.normalize(exec.result);
                return { ...exec, result: normalized };
            });
            groundedContext = this.factInterpreter.interpret(normalizedResults);
        }
        if (activeFileFact) {
            const existingFacts = groundedContext?.knowledgeFacts ?? [];
            const hasSamePath = existingFacts.some((f) => f.kind === 'file_content' && f.path === activeFileFact.path);
            if (!hasSamePath) {
                const knowledgeFacts = [activeFileFact, ...existingFacts];
                groundedContext = {
                    executionResults: groundedContext?.executionResults ?? [],
                    repositoryFacts: groundedContext?.repositoryFacts ?? [activeFileFact],
                    terminalFacts: groundedContext?.terminalFacts ?? [],
                    knowledgeFacts,
                };
            }
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