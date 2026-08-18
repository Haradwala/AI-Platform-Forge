"use strict";
/**
 * response-generation-engine.ts
 *
 * ResponseGenerationEngine — invokes the active AI runtime and returns
 * the final natural-language assistant response.
 *
 * Delegates prompt composition to PromptComposer.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseGenerationEngine = void 0;
const prompt_composer_1 = require("./prompt-composer");
const response_mode_classifier_1 = require("./response-mode-classifier");
const response_templates_1 = require("./response-templates");
const file_query_normalizer_1 = require("./file-query-normalizer");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// ─── Engine ──────────────────────────────────────────────────────────────────
class ResponseGenerationEngine {
    runtimeManager;
    eventBus;
    logger;
    promptComposer;
    classifier;
    constructor(runtimeManager, eventBus, logger, promptComposer = new prompt_composer_1.PromptComposer(), classifier = new response_mode_classifier_1.ResponseModeClassifier()) {
        this.runtimeManager = runtimeManager;
        this.eventBus = eventBus;
        this.logger = logger;
        this.promptComposer = promptComposer;
        this.classifier = classifier;
    }
    /**
     * Generates a natural-language response for the given ResponseRequest.
     * Never throws — falls back to a readable summary on failure.
     */
    async generate(request) {
        const startMs = Date.now();
        // 0. Signal classifying phase
        this._emit('response:phase.changed', { phase: 'classifying', userPrompt: request.userPrompt });
        // 1. Classify response mode
        const decision = this.classifier.classify(request.userPrompt);
        this.logger.info(`[ResponseGenerationEngine] Model routing: mode="${decision.mode}", suggestedRuntime="${decision.suggestedRuntime}"`);
        // 2. Skip LLM for deterministic actions
        if (!decision.requiresLlm) {
            const text = this._buildDeterministicResponse(request);
            const metadata = {
                runtime: 'deterministic',
                model: 'deterministic',
                durationMs: 0,
                provider: 'deterministic',
                fallbackUsed: false,
                streaming: false,
            };
            this._emit('response:phase.changed', { phase: 'complete', durationMs: 0 });
            this._emit('response:generation.completed', {
                runtimeId: 'deterministic',
                durationMs: 0,
                fallbackUsed: false,
                responseLength: text.length,
            });
            this.logger.info(`[ResponseGenerationEngine] Skip LLM for deterministic action ("${request.userPrompt}"). Returning instant response.`);
            return { text, metadata };
        }
        const runtime = this.runtimeManager.resolveFallbackRuntime
            ? await this.runtimeManager.resolveFallbackRuntime()
            : this.runtimeManager.active();
        this._emit('response:generation.started', {
            runtimeId: runtime.id,
            runtimeName: runtime.name,
            userPrompt: request.userPrompt,
        });
        this.logger.info(`[ResponseGenerationEngine] Generating response via runtime "${runtime.id}" for prompt: "${request.userPrompt}"`);
        // Signal assembling phase
        this._emit('response:phase.changed', { phase: 'assembling' });
        const prompt = this.promptComposer.compose(request);
        // Prompt telemetry logging
        const promptStats = {
            promptCharacters: prompt.length,
            userPromptCharacters: request.userPrompt.length,
            groundedFactCount: request.groundedContext?.knowledgeFacts?.length ?? 0,
            contextSummaryCharacters: request.context.summary?.length ?? 0,
            estimatedTokens: Math.ceil(prompt.length / 4),
        };
        this.logger.info(`[ResponseGenerationEngine] Prompt telemetry: ${JSON.stringify(promptStats)}`);
        let rawText;
        let fallbackUsed = false;
        // Signal generating phase
        this._emit('response:phase.changed', { phase: 'generating' });
        try {
            rawText = await this._invokeRuntime(prompt, request, runtime);
        }
        catch (err) {
            this.logger.warn(`[ResponseGenerationEngine] Runtime "${runtime.id}" failed: ${err?.message || err}. Using fallback summary.`);
            rawText = this._buildFallbackSummary(request);
            fallbackUsed = true;
            this._emit('response:generation.failed', {
                runtimeId: runtime.id,
                error: err?.message || String(err),
            });
        }
        const response = this._sanitize(rawText);
        const durationMs = Date.now() - startMs;
        const metadata = {
            runtime: runtime.id,
            model: runtime.name,
            durationMs,
            provider: runtime.id,
            fallbackUsed,
            streaming: true,
        };
        this._emit('response:phase.changed', { phase: 'complete', durationMs });
        this._emit('response:generation.completed', {
            runtimeId: runtime.id,
            durationMs,
            fallbackUsed,
            responseLength: response.length,
        });
        this.logger.info(`[ResponseGenerationEngine] Generation complete. Runtime: "${runtime.id}", duration: ${durationMs}ms, fallback: ${fallbackUsed}`);
        return { text: response, metadata };
    }
    // ─── Private: Runtime Invocation ────────────────────────────────────────────
    _invokeRuntime(prompt, request, runtime) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const ctx = {
                workspace: { rootPath: request.workspace.root },
                userPrompt: request.userPrompt,
            };
            runtime
                .generateStream(prompt, ctx, controller.signal)
                .then((stream) => {
                stream
                    .onToken((token) => {
                    this._emit('response:generation.progress', { token });
                })
                    .onComplete((fullText) => {
                    resolve(fullText);
                })
                    .onError((err) => {
                    reject(err);
                });
            })
                .catch(reject);
        });
    }
    // ─── Private: Sanitizer ─────────────────────────────────────────────────────
    _sanitize(raw) {
        if (!raw || !raw.trim()) {
            return 'The task completed, but no response was generated.';
        }
        return raw.trim().replace(/\n{3,}/g, '\n\n');
    }
    // ─── Private: Fast Deterministic Response Builder ───────────────────────────
    _buildDeterministicResponse(request) {
        const norm = file_query_normalizer_1.FileQueryNormalizer.normalize(request.userPrompt);
        const promptLower = (request.userPrompt || '').trim().toLowerCase();
        if (norm.intent === 'open' || promptLower.startsWith('open ') || promptLower === 'open') {
            const fileFact = request.groundedContext?.knowledgeFacts?.find((f) => f.kind === 'file_content');
            const rawTarget = norm.relativePath || norm.basename || request.userPrompt.slice(4).trim();
            const targetPath = fileFact?.path || rawTarget;
            if (targetPath) {
                const root = request.workspace.root || process.cwd();
                const fullPath = path.isAbsolute(targetPath) ? targetPath : path.join(root, targetPath);
                if (request.workspace.root && fs.existsSync(request.workspace.root) && !fs.existsSync(fullPath)) {
                    return `Failed to open file: File "${targetPath}" does not exist.`;
                }
                console.log('[AI OPEN] emitting', fullPath);
                this._emit('ai:execute-command', {
                    commandId: 'forge.workspace.openFile',
                    args: [fullPath],
                });
                return response_templates_1.ResponseTemplates.opened(targetPath);
            }
        }
        if (norm.intent === 'find' || promptLower.startsWith('find ') || promptLower === 'find') {
            const searchFact = request.groundedContext?.knowledgeFacts?.find((f) => f.kind === 'workspace_search');
            const query = norm.basename || norm.relativePath || searchFact?.query || request.userPrompt.slice(4).trim();
            const count = searchFact?.totalMatches ?? searchFact?.matches?.length ?? 0;
            if (query) {
                return response_templates_1.ResponseTemplates.found(count, query);
            }
        }
        return request.executionSummary ?? 'Done.';
    }
    // ─── Private: Fallback ──────────────────────────────────────────────────────
    _buildFallbackSummary(request) {
        const lines = [];
        if (request.execution.success) {
            lines.push(`Task completed successfully.`);
        }
        else {
            lines.push(`Task encountered issues during execution.`);
        }
        if (request.execution.goal && request.execution.goal !== request.userPrompt) {
            lines.push(`\nGoal: ${request.execution.goal}`);
        }
        if (request.context.summary) {
            lines.push(`\n${request.context.summary}`);
        }
        if (request.reflection.recommendations.length > 0) {
            lines.push(`\nNotes:\n${request.reflection.recommendations.map((r) => `- ${r}`).join('\n')}`);
        }
        if (!request.verification.success) {
            lines.push(`\nSome verification checks did not pass. Review the pipeline timeline for details.`);
        }
        return lines.join('') || 'Task completed.';
    }
    // ─── Private: Event Emitter ─────────────────────────────────────────────────
    _emit(topic, payload) {
        try {
            this.eventBus?.emit(topic, payload);
        }
        catch {
            // Event bus is best-effort — never block generation
        }
    }
}
exports.ResponseGenerationEngine = ResponseGenerationEngine;
//# sourceMappingURL=response-generation-engine.js.map