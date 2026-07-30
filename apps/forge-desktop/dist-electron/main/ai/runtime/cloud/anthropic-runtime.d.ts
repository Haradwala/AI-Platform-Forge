/**
 * anthropic-runtime.ts
 *
 * IAiRuntime implementation for the Anthropic Messages API.
 *
 * Anthropic differs from OpenAI-compatible APIs in two ways:
 *  1. Auth uses `x-api-key` + `anthropic-version` headers (not `Authorization: Bearer`).
 *  2. The system prompt is a top-level `system` field, not a message role.
 *  3. SSE events use `content_block_delta` / `text_delta` structure.
 *
 * Configuration: set ANTHROPIC_API_KEY in environment.
 * Model list:    GET  https://api.anthropic.com/v1/models
 * Streaming:     POST https://api.anthropic.com/v1/messages  (stream: true)
 */
import type { IAiRuntime, RuntimeType, RuntimeHealth } from '../runtime-types';
import type { IAiTokenStream } from '../../../container/service-interfaces';
import type { IServiceResolver } from '../../../container/interfaces';
import type { IConfigurationService } from '../../../config/configuration-service';
export declare class AnthropicRuntime implements IAiRuntime {
    private readonly resolver?;
    private readonly configService?;
    readonly id = "anthropic";
    readonly name = "Anthropic";
    readonly runtimeType: RuntimeType;
    constructor(resolver?: IServiceResolver | undefined, configService?: IConfigurationService | undefined);
    private get activeConfig();
    private get apiKey();
    private get baseUrl();
    private get anthropicHeaders();
    listAvailableModels(): Promise<string[]>;
    healthCheck(): Promise<RuntimeHealth>;
    generateStream(prompt: string, context: any, signal: AbortSignal): Promise<IAiTokenStream>;
}
