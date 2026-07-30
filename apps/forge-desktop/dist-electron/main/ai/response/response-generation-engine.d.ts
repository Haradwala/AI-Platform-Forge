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
import type { IRuntimeManager } from '../runtime/runtime-types';
import type { IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';
import type { ResponseRequest, AiExecutionMetadata } from './response-types';
interface GenerationResult {
    readonly text: string;
    readonly metadata: AiExecutionMetadata;
}
export declare class ResponseGenerationEngine {
    private readonly runtimeManager;
    private readonly eventBus;
    private readonly logger;
    constructor(runtimeManager: IRuntimeManager, eventBus: IDesktopEventBus | undefined, logger: IDesktopLogger);
    /**
     * Generates a natural-language response for the given ResponseRequest.
     * Never throws — falls back to a readable summary on failure.
     */
    generate(request: ResponseRequest): Promise<GenerationResult>;
    /**
     * Builds a clean, focused prompt from the structured ResponseRequest.
     * Adapts format based on what data is available — never mentions internal
     * field names like "reasoningReport" or "verificationReport".
     */
    private _buildPrompt;
    /**
     * Invokes the runtime using generateStream (streaming-first design).
     * Awaits the onComplete callback so the result is returned as a single
     * string. Future phases can wire onToken to IPC events without changing
     * this method's signature.
     */
    private _invokeRuntime;
    /**
     * Cleans up the raw runtime output.
     * - Trims whitespace
     * - Collapses excessive blank lines (3+ → 2)
     * - Ensures response is non-empty
     */
    private _sanitize;
    /**
     * Builds a human-readable fallback summary from ResponseRequest fields
     * when the runtime fails. Never exposes internal engineering types.
     */
    private _buildFallbackSummary;
    private _emit;
}
export {};
