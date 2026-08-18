/**
 * response-context-builder.ts
 *
 * ResponseContextBuilder — assembles a structured, provider-agnostic
 * ResponseRequest from a completed PipelineContext.
 */
import type { PipelineContext } from '../pipeline/pipeline-context';
import type { ResponseRequest, FileContentFact } from './response-types';
import { FactInterpreter } from './fact-interpreter';
import { ResultNormalizer } from '../pipeline/result-normalizer';
export declare class ResponseContextBuilder {
    private readonly factInterpreter;
    private readonly normalizer;
    constructor(factInterpreter?: FactInterpreter, normalizer?: ResultNormalizer);
    /**
     * Assembles a ResponseRequest from the pipeline's final context and user prompt.
     */
    build(context: PipelineContext, userPrompt: string, activeFileFact?: FileContentFact | null): ResponseRequest;
    private _buildContextSummary;
}
