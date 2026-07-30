"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAICompatibleRuntime = void 0;
exports.readSSELines = readSSELines;
exports.extractOpenAIToken = extractOpenAIToken;
exports.extractAnthropicToken = extractAnthropicToken;
exports.extractGeminiToken = extractGeminiToken;
exports.buildUserContent = buildUserContent;
exports.systemPrompt = systemPrompt;
exports.resolveActiveModel = resolveActiveModel;
exports.probeEndpoint = probeEndpoint;
exports.normalizeError = normalizeError;
exports.getGlobalConfigService = getGlobalConfigService;
exports.resolveConfigService = resolveConfigService;
const tokens_1 = require("../../../container/tokens");
const token_stream_1 = require("../../providers/token-stream");
// ─── SSE Reader ───────────────────────────────────────────────────────────────
/**
 * Reads a streaming HTTP response body and yields the payload of every
 * `data:` SSE line. Handles chunked delivery and multi-line buffers.
 *
 * Yields the raw string after `data: ` (not including the prefix).
 * Never throws — errors must be handled by the caller.
 */
async function* readSSELines(body, signal) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    try {
        while (!signal.aborted) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('data:')) {
                    yield trimmed.slice(5).trim();
                }
            }
        }
    }
    finally {
        reader.releaseLock();
    }
}
// ─── Token Extractors ─────────────────────────────────────────────────────────
/**
 * OpenAI-compatible SSE data payload (also used for Groq and OpenRouter).
 * Returns null for `[DONE]`, error payloads, or empty deltas.
 */
function extractOpenAIToken(data) {
    if (data === '[DONE]')
        return null;
    try {
        const parsed = JSON.parse(data);
        return parsed.choices?.[0]?.delta?.content ?? null;
    }
    catch {
        return null;
    }
}
/**
 * Anthropic SSE content_block_delta payload.
 * Returns null for any event type other than text_delta.
 */
function extractAnthropicToken(data) {
    try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'content_block_delta' &&
            parsed.delta?.type === 'text_delta') {
            return parsed.delta.text ?? null;
        }
        return null;
    }
    catch {
        return null;
    }
}
/**
 * Gemini SSE data payload (`?alt=sse` streaming mode).
 * Returns null for chunks with no text part.
 */
function extractGeminiToken(data) {
    try {
        const parsed = JSON.parse(data);
        return parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    }
    catch {
        return null;
    }
}
// ─── Message Builder ──────────────────────────────────────────────────────────
const SYSTEM_PROMPT = 'You are Forge, an expert AI coding assistant. Be concise, precise, and helpful.';
/**
 * Formats a Forge prompt + context into a single user message content string.
 * Cloud runtimes use this to build the request body.
 */
function buildUserContent(prompt, context) {
    if (!context || Object.keys(context).length === 0)
        return prompt;
    return `Context:\n${JSON.stringify(context, null, 2)}\n\nTask: ${prompt}`;
}
/** Returns the shared system prompt. */
function systemPrompt() {
    return SYSTEM_PROMPT;
}
// ─── Session Model Resolver ───────────────────────────────────────────────────
/**
 * Reads the active model ID from the AI session service.
 * Falls back to `defaultModel` if the session cannot be resolved.
 */
function resolveActiveModel(resolver, defaultModel) {
    if (!resolver)
        return defaultModel;
    try {
        const svc = resolver.resolve(tokens_1.T.IAiSessionService);
        const session = svc.getActiveSession();
        return session?.activeModelId || defaultModel;
    }
    catch {
        return defaultModel;
    }
}
// ─── Endpoint Probe ───────────────────────────────────────────────────────────
/**
 * Performs a lightweight GET probe against `url` and returns a RuntimeHealth.
 * - 200–299 → healthy
 * - 401     → healthy=false (reachable but key is invalid)
 * - Other   → healthy=false with status code
 * - Throws  → healthy=false with error message
 *
 * Never throws.
 */
async function probeEndpoint(url, headers) {
    const start = Date.now();
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(5000),
        });
        const latencyMs = Date.now() - start;
        if (res.ok)
            return { healthy: true, latencyMs };
        return {
            healthy: false,
            latencyMs,
            error: `HTTP ${res.status}`,
        };
    }
    catch (err) {
        return {
            healthy: false,
            latencyMs: Date.now() - start,
            error: err instanceof Error ? err.message : 'Unreachable',
        };
    }
}
// ─── Error Normalizer ─────────────────────────────────────────────────────────
/** Converts any thrown value into a proper Error instance. */
function normalizeError(err) {
    if (err instanceof Error)
        return err;
    return new Error(String(err));
}
const configuration_service_1 = require("../../../config/configuration-service");
let globalConfigService = null;
function getGlobalConfigService() {
    if (!globalConfigService) {
        globalConfigService = new configuration_service_1.ConfigurationService();
    }
    return globalConfigService;
}
function resolveConfigService(resolver, customService) {
    if (customService)
        return customService;
    if (resolver) {
        try {
            return resolver.resolve(tokens_1.T.IConfigurationService);
        }
        catch {
            // Fallthrough
        }
    }
    return getGlobalConfigService();
}
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
class OpenAICompatibleRuntime {
    resolver;
    configService;
    runtimeType = 'cloud';
    /**
     * Optional predicate to filter the model list returned by the API.
     * Defaults to accepting all models.
     */
    modelFilter(_id) {
        return true;
    }
    /**
     * Optional additional headers (e.g. HTTP-Referer for OpenRouter).
     * Merged with the Authorization header on every request.
     */
    extraHeaders() {
        return {};
    }
    constructor(resolver, configService) {
        this.resolver = resolver;
        this.configService = configService;
    }
    get activeConfig() {
        return resolveConfigService(this.resolver, this.configService);
    }
    get apiKey() {
        const p = this.activeConfig.getProvider(this.id);
        return p?.apiKey ?? '';
    }
    get baseUrl() {
        const p = this.activeConfig.getProvider(this.id);
        return p?.baseUrl || this.defaultBaseUrl;
    }
    get authHeaders() {
        return {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...this.extraHeaders(),
        };
    }
    async listAvailableModels() {
        if (!this.apiKey)
            return this.fallbackModels;
        try {
            const res = await fetch(`${this.baseUrl}/v1/models`, {
                headers: { Authorization: `Bearer ${this.apiKey}`, ...this.extraHeaders() },
                signal: AbortSignal.timeout(5000),
            });
            if (!res.ok)
                return this.fallbackModels;
            const data = await res.json();
            const models = (data.data ?? [])
                .map((m) => m.id)
                .filter((id) => this.modelFilter(id));
            return models.length > 0 ? models : this.fallbackModels;
        }
        catch {
            return this.fallbackModels;
        }
    }
    async healthCheck() {
        if (!this.apiKey) {
            return {
                healthy: false,
                latencyMs: 0,
                error: `${this.envKeyName} is not set`,
            };
        }
        return probeEndpoint(`${this.baseUrl}/v1/models`, {
            Authorization: `Bearer ${this.apiKey}`,
            ...this.extraHeaders(),
        });
    }
    async generateStream(prompt, context, signal) {
        const stream = new token_stream_1.AiTokenStream();
        const model = resolveActiveModel(this.resolver, this.defaultModel);
        const apiKey = this.apiKey;
        setTimeout(async () => {
            if (!apiKey) {
                stream.emitError(new Error(`${this.envKeyName} is not set. Configure it to use ${this.name}.`));
                return;
            }
            try {
                const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
                    method: 'POST',
                    headers: this.authHeaders,
                    body: JSON.stringify({
                        model,
                        messages: [
                            { role: 'system', content: systemPrompt() },
                            { role: 'user', content: buildUserContent(prompt, context) },
                        ],
                        stream: true,
                    }),
                    signal,
                });
                if (!res.ok) {
                    const body = await res.text().catch(() => '');
                    stream.emitError(new Error(`${this.name} error ${res.status}: ${body}`));
                    return;
                }
                if (!res.body) {
                    stream.emitError(new Error(`${this.name} returned an empty response body.`));
                    return;
                }
                let fullText = '';
                for await (const line of readSSELines(res.body, signal)) {
                    const token = extractOpenAIToken(line);
                    if (token !== null) {
                        fullText += token;
                        stream.emitToken(token);
                    }
                }
                stream.emitComplete(fullText);
            }
            catch (err) {
                stream.emitError(normalizeError(err));
            }
        }, 0);
        return stream;
    }
}
exports.OpenAICompatibleRuntime = OpenAICompatibleRuntime;
//# sourceMappingURL=cloud-helpers.js.map