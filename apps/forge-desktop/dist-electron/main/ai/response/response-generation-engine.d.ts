/**
 * response-generation-engine.ts
 *
 * ResponseGenerationEngine — invokes the active AI runtime and returns
 * the final natural-language assistant response.
 *
 * Delegates prompt composition to PromptComposer.
 */
import type { IRuntimeManager } from '../runtime/runtime-types';
import type { IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';
import type { ResponseRequest, AiExecutionMetadata } from './response-types';
import { PromptComposer } from './prompt-composer';
import { ResponseModeClassifier } from './response-mode-classifier';
interface GenerationResult {
    readonly text: string;
    readonly metadata: AiExecutionMetadata;
}
export declare class ResponseGenerationEngine {
    private readonly runtimeManager;
    private readonly eventBus;
    private readonly logger;
    private readonly promptComposer;
    private readonly classifier;
    constructor(runtimeManager: IRuntimeManager, eventBus: IDesktopEventBus | undefined, logger: IDesktopLogger, promptComposer?: PromptComposer, classifier?: ResponseModeClassifier);
    /**
     * Generates a natural-language response for the given ResponseRequest.
     * Never throws — falls back to a readable summary on failure.
     */
    generate(request: ResponseRequest): Promise<GenerationResult>;
    private _invokeRuntime;
    private _sanitize;
    private _buildDeterministicResponse;
    private _buildFallbackSummary;
    private _emit;
}
export {};
