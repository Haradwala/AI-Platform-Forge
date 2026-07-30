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
import type { PipelineContext } from '../pipeline/pipeline-context';
import type { ResponseRequest } from './response-types';
export declare class ResponseContextBuilder {
    private readonly factInterpreter;
    /**
     * Assembles a ResponseRequest from the pipeline's final context and
     * the original user prompt.
     *
     * All fields degrade gracefully when context data is absent (e.g., when
     * a stage was skipped).
     */
    build(context: PipelineContext, userPrompt: string): ResponseRequest;
    private _buildContextSummary;
}
