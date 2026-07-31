"use strict";
/**
 * response-generation-engine.ts
 *
 * ResponseGenerationEngine — invokes the active AI runtime and returns
 * the final natural-language assistant response.
 *
 * Responsibilities:
 *  - Build a runtime-specific prompt from a structured ResponseRequest
 *  - Invoke the active runtime via IRuntimeManager
 *  - Emit response-generation lifecycle events on IDesktopEventBus
 *  - Sanitize the raw output before returning
 *  - Gracefully fall back to a readable plain-English summary when
 *    the runtime fails (no internal engineering types ever exposed)
 *
 * Internally structured as three private methods:
 *   buildPrompt(request)   — prompt engineering
 *   invokeRuntime(prompt)  — runtime communication (streaming-first)
 *   sanitize(raw)          — output cleanup
 *
 * The engine is designed for streaming from day one: invokeRuntime awaits
 * the onComplete callback so the current non-streaming UI works, while the
 * stream's onToken callbacks can be wired to IPC events in a future phase
 * without changing this class's public API.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseGenerationEngine = void 0;
// ─── Engine ──────────────────────────────────────────────────────────────────
class ResponseGenerationEngine {
    runtimeManager;
    eventBus;
    logger;
    constructor(runtimeManager, eventBus, logger) {
        this.runtimeManager = runtimeManager;
        this.eventBus = eventBus;
        this.logger = logger;
    }
    /**
     * Generates a natural-language response for the given ResponseRequest.
     * Never throws — falls back to a readable summary on failure.
     */
    async generate(request) {
        const startMs = Date.now();
        const runtime = this.runtimeManager.resolveFallbackRuntime
            ? await this.runtimeManager.resolveFallbackRuntime()
            : this.runtimeManager.active();
        this._emit('response:generation.started', {
            runtimeId: runtime.id,
            runtimeName: runtime.name,
            userPrompt: request.userPrompt,
        });
        this.logger.info(`[ResponseGenerationEngine] Generating response via runtime "${runtime.id}" for prompt: "${request.userPrompt}"`);
        const prompt = this._buildPrompt(request);
        let rawText;
        let fallbackUsed = false;
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
        this._emit('response:generation.completed', {
            runtimeId: runtime.id,
            durationMs,
            fallbackUsed,
            responseLength: response.length,
        });
        this.logger.info(`[ResponseGenerationEngine] Generation complete. Runtime: "${runtime.id}", duration: ${durationMs}ms, fallback: ${fallbackUsed}`);
        return { text: response, metadata };
    }
    // ─── Private: Prompt Building ───────────────────────────────────────────────
    /**
     * Builds a clean, focused prompt from the structured ResponseRequest.
     * Adapts format based on what data is available — never mentions internal
     * field names like "reasoningReport" or "verificationReport".
     */
    _buildPrompt(request) {
        const lines = [];
        lines.push(`You are Forge AI, an expert software engineering assistant.`);
        lines.push(`Answer the user's request clearly and concisely.\n`);
        lines.push(`User request: "${request.userPrompt}"\n`);
        // Grounding facts from actual tool execution
        if (request.groundedContext) {
            const { repositoryFacts, terminalFacts } = request.groundedContext;
            if (repositoryFacts.length > 0) {
                lines.push(`Grounding Repository Facts (from executed tool results):`);
                for (const fact of repositoryFacts) {
                    switch (fact.kind) {
                        case 'workspace_search':
                            lines.push(`- Workspace Search (query: "${fact.query}"): Found ${fact.totalMatches} matches.`);
                            for (const m of fact.matches.slice(0, 30)) {
                                lines.push(`  * ${m.filePath}${m.line ? `:${m.line}` : ''} ${m.text}`);
                            }
                            break;
                        case 'file_content':
                            lines.push(`- File Content (${fact.path}):`);
                            lines.push(`\`\`\`\n${fact.content.slice(0, 2000)}\n\`\`\``);
                            break;
                        case 'directory_listing':
                            lines.push(`- Directory Listing (${fact.path || 'root'}): ${fact.items.length} items`);
                            lines.push(`  [${fact.items.slice(0, 50).join(', ')}]`);
                            break;
                        case 'workspace_statistics':
                            lines.push(`- Workspace Statistics: ${fact.fileCount ?? 'unknown'} files`);
                            break;
                    }
                }
                lines.push('');
            }
            if (terminalFacts.length > 0) {
                lines.push(`Grounding Terminal Facts:`);
                for (const term of terminalFacts) {
                    lines.push(`- Command executed: "${term.command}" (Exit Code: ${term.exitCode ?? 0})`);
                    if (term.stdout)
                        lines.push(`  Output: ${term.stdout.slice(0, 1000)}`);
                }
                lines.push('');
            }
        }
        if (request.context.summary) {
            lines.push(`Workspace context summary:\n${request.context.summary}\n`);
        }
        if (request.execution.goal && request.execution.goal !== request.userPrompt) {
            lines.push(`Interpreted goal: ${request.execution.goal}\n`);
        }
        lines.push(`Task completed: ${request.execution.success ? 'Yes' : 'No'}`);
        lines.push(`Verification passed: ${request.verification.success ? 'Yes' : 'No'}\n`);
        if (request.reflection.recommendations.length > 0) {
            lines.push(`Observations:\n${request.reflection.recommendations.map((r) => `- ${r}`).join('\n')}\n`);
        }
        lines.push(`CRITICAL REQUIREMENT: Base your answer strictly on the Grounding Repository / Terminal Facts if present.` +
            ` Do not invent numbers or file names when tool execution facts provide actual data.` +
            ` Do not mention pipeline stages, verification, or internal processing.` +
            ` Respond naturally as a software engineering assistant.`);
        return lines.join('\n');
    }
    // ─── Private: Runtime Invocation ────────────────────────────────────────────
    /**
     * Invokes the runtime using generateStream (streaming-first design).
     * Awaits the onComplete callback so the result is returned as a single
     * string. Future phases can wire onToken to IPC events without changing
     * this method's signature.
     */
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
                    // Emit token events for future streaming UI — no-op for now if
                    // no subscriber is connected.
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
    /**
     * Cleans up the raw runtime output.
     * - Trims whitespace
     * - Collapses excessive blank lines (3+ → 2)
     * - Ensures response is non-empty
     */
    _sanitize(raw) {
        if (!raw || !raw.trim()) {
            return 'The task completed, but no response was generated.';
        }
        return raw.trim().replace(/\n{3,}/g, '\n\n');
    }
    // ─── Private: Fallback ──────────────────────────────────────────────────────
    /**
     * Builds a human-readable fallback summary from ResponseRequest fields
     * when the runtime fails. Never exposes internal engineering types.
     */
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