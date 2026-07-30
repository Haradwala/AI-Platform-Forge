/**
 * cloud-helpers.ts
 *
 * Shared infrastructure for all cloud AI runtimes.
 *
 * Exports:
 *  - readSSELines()         — async generator that yields SSE data payloads
 *  - extractOpenAIToken()   — token extractor for OpenAI-compatible SSE
 *  - extractAnthropicToken() — token extractor for Anthropic SSE
 *  - extractGeminiToken()   — token extractor for Gemini SSE
 *  - buildUserContent()     — formats a Forge prompt+context into a user message string
 *  - resolveActiveModel()   — reads active model ID from the session service
 *  - probeEndpoint()        — lightweight availability probe
 *  - normalizeError()       — converts unknown throws into Error instances
 *  - OpenAICompatibleRuntime — abstract base for OpenAI / Groq / OpenRouter
 */
import type { IAiTokenStream } from '../../../container/service-interfaces';
import type { IAiRuntime, RuntimeType, RuntimeHealth } from '../runtime-types';
import type { IServiceResolver } from '../../../container/interfaces';
/**
 * Reads a streaming HTTP response body and yields the payload of every
 * `data:` SSE line. Handles chunked delivery and multi-line buffers.
 *
 * Yields the raw string after `data: ` (not including the prefix).
 * Never throws — errors must be handled by the caller.
 */
export declare function readSSELines(body: ReadableStream<Uint8Array>, signal: AbortSignal): AsyncGenerator<string>;
/**
 * OpenAI-compatible SSE data payload (also used for Groq and OpenRouter).
 * Returns null for `[DONE]`, error payloads, or empty deltas.
 */
export declare function extractOpenAIToken(data: string): string | null;
/**
 * Anthropic SSE content_block_delta payload.
 * Returns null for any event type other than text_delta.
 */
export declare function extractAnthropicToken(data: string): string | null;
/**
 * Gemini SSE data payload (`?alt=sse` streaming mode).
 * Returns null for chunks with no text part.
 */
export declare function extractGeminiToken(data: string): string | null;
/**
 * Formats a Forge prompt + context into a single user message content string.
 * Cloud runtimes use this to build the request body.
 */
export declare function buildUserContent(prompt: string, context: any): string;
/** Returns the shared system prompt. */
export declare function systemPrompt(): string;
/**
 * Reads the active model ID from the AI session service.
 * Falls back to `defaultModel` if the session cannot be resolved.
 */
export declare function resolveActiveModel(resolver: IServiceResolver | undefined, defaultModel: string): string;
/**
 * Performs a lightweight GET probe against `url` and returns a RuntimeHealth.
 * - 200–299 → healthy
 * - 401     → healthy=false (reachable but key is invalid)
 * - Other   → healthy=false with status code
 * - Throws  → healthy=false with error message
 *
 * Never throws.
 */
export declare function probeEndpoint(url: string, headers: Record<string, string>): Promise<RuntimeHealth>;
/** Converts any thrown value into a proper Error instance. */
export declare function normalizeError(err: unknown): Error;
import type { IConfigurationService } from '../../../config/configuration-service';
export declare function getGlobalConfigService(): IConfigurationService;
export declare function resolveConfigService(resolver?: IServiceResolver, customService?: IConfigurationService): IConfigurationService;
/**
 * Abstract base class shared by OpenAI, Groq, and OpenRouter runtimes.
 *
 * All three follow the OpenAI Chat Completions API contract:
 *  - POST   {baseUrl}/v1/chat/completions  — streaming generation
 *  - GET    {baseUrl}/v1/models            — model discovery
 *  - Header: `Authorization: Bearer {apiKey}`
 *
 * Concrete subclasses supply: id, name, defaultBaseUrl, envKeyName, defaultModel,
 * fallbackModels, and optionally extraHeaders and modelFilter.
 */
export declare abstract class OpenAICompatibleRuntime implements IAiRuntime {
    protected readonly resolver?: IServiceResolver | undefined;
    protected readonly configService?: IConfigurationService | undefined;
    abstract readonly id: string;
    abstract readonly name: string;
    readonly runtimeType: RuntimeType;
    /** The process.env key name for error messaging. */
    protected abstract readonly envKeyName: string;
    /** Default base URL without trailing slash (e.g. 'https://api.openai.com'). */
    protected abstract readonly defaultBaseUrl: string;
    /** Default model used when the session model cannot be resolved. */
    protected abstract readonly defaultModel: string;
    /** Static fallback list returned when model discovery fails. */
    protected abstract readonly fallbackModels: string[];
    /**
     * Optional predicate to filter the model list returned by the API.
     * Defaults to accepting all models.
     */
    protected modelFilter(_id: string): boolean;
    /**
     * Optional additional headers (e.g. HTTP-Referer for OpenRouter).
     * Merged with the Authorization header on every request.
     */
    protected extraHeaders(): Record<string, string>;
    constructor(resolver?: IServiceResolver | undefined, configService?: IConfigurationService | undefined);
    protected get activeConfig(): IConfigurationService;
    protected get apiKey(): string;
    protected get baseUrl(): string;
    private get authHeaders();
    listAvailableModels(): Promise<string[]>;
    healthCheck(): Promise<RuntimeHealth>;
    generateStream(prompt: string, context: any, signal: AbortSignal): Promise<IAiTokenStream>;
}
