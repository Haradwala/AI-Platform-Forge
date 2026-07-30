/**
 * gemini-runtime.ts
 *
 * IAiRuntime implementation for the Google Gemini API (v1beta).
 *
 * Gemini differs from other runtimes:
 *  1. API key is passed as a `?key=` query parameter, not in headers.
 *  2. Request body uses `contents[].parts[].text` (not `messages[]`).
 *  3. System instructions use a top-level `systemInstruction` field.
 *  4. Streaming uses `?alt=sse` suffix on the endpoint URL.
 *  5. SSE payload contains `candidates[0].content.parts[0].text`.
 *  6. Model names are prefixed with `models/` in the API — stripped on return.
 *
 * Configuration: set GEMINI_API_KEY in environment.
 * Model list:    GET  https://generativelanguage.googleapis.com/v1beta/models?key={key}
 * Streaming:     POST https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?alt=sse&key={key}
 */
import type { IAiRuntime, RuntimeType, RuntimeHealth } from '../runtime-types';
import type { IAiTokenStream } from '../../../container/service-interfaces';
import type { IServiceResolver } from '../../../container/interfaces';
import type { IConfigurationService } from '../../../config/configuration-service';
export declare class GeminiRuntime implements IAiRuntime {
    private readonly resolver?;
    private readonly configService?;
    readonly id = "gemini";
    readonly name = "Google Gemini";
    readonly runtimeType: RuntimeType;
    constructor(resolver?: IServiceResolver | undefined, configService?: IConfigurationService | undefined);
    private get activeConfig();
    private get apiKey();
    private get baseUrl();
    listAvailableModels(): Promise<string[]>;
    healthCheck(): Promise<RuntimeHealth>;
    generateStream(prompt: string, context: any, signal: AbortSignal): Promise<IAiTokenStream>;
}
