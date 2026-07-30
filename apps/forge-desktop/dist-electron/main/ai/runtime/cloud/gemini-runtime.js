"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiRuntime = void 0;
const cloud_helpers_1 = require("./cloud-helpers");
const token_stream_1 = require("../../providers/token-stream");
const DEFAULT_MODEL = 'gemini-2.0-flash';
const FALLBACK_MODELS = [
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
];
class GeminiRuntime {
    resolver;
    configService;
    id = 'gemini';
    name = 'Google Gemini';
    runtimeType = 'cloud';
    constructor(resolver, configService) {
        this.resolver = resolver;
        this.configService = configService;
    }
    get activeConfig() {
        return (0, cloud_helpers_1.resolveConfigService)(this.resolver, this.configService);
    }
    get apiKey() {
        return this.activeConfig.getProvider(this.id)?.apiKey ?? '';
    }
    get baseUrl() {
        return this.activeConfig.getProvider(this.id)?.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
    }
    async listAvailableModels() {
        if (!this.apiKey)
            return FALLBACK_MODELS;
        try {
            const res = await fetch(`${this.baseUrl}/models?key=${encodeURIComponent(this.apiKey)}`, { signal: AbortSignal.timeout(5000) });
            if (!res.ok)
                return FALLBACK_MODELS;
            const data = await res.json();
            const models = (data.models ?? [])
                // Only include models that can stream-generate content.
                .filter((m) => m.supportedGenerationMethods?.includes('streamGenerateContent'))
                // Strip the "models/" prefix (e.g. "models/gemini-2.0-flash" → "gemini-2.0-flash").
                .map((m) => m.name.replace(/^models\//, ''));
            return models.length > 0 ? models : FALLBACK_MODELS;
        }
        catch {
            return FALLBACK_MODELS;
        }
    }
    async healthCheck() {
        if (!this.apiKey) {
            return { healthy: false, latencyMs: 0, error: 'GEMINI_API_KEY is not set' };
        }
        const start = Date.now();
        try {
            const res = await fetch(`${this.baseUrl}/models?key=${encodeURIComponent(this.apiKey)}`, { signal: AbortSignal.timeout(5000) });
            const latencyMs = Date.now() - start;
            if (res.ok)
                return { healthy: true, latencyMs };
            return { healthy: false, latencyMs, error: `HTTP ${res.status}` };
        }
        catch (err) {
            return {
                healthy: false,
                latencyMs: Date.now() - start,
                error: err instanceof Error ? err.message : 'Unreachable',
            };
        }
    }
    async generateStream(prompt, context, signal) {
        const stream = new token_stream_1.AiTokenStream();
        const model = (0, cloud_helpers_1.resolveActiveModel)(this.resolver, DEFAULT_MODEL);
        const apiKey = this.apiKey;
        const baseUrl = this.baseUrl;
        setTimeout(async () => {
            if (!apiKey) {
                stream.emitError(new Error('GEMINI_API_KEY is not set. Configure it to use Google Gemini.'));
                return;
            }
            try {
                const url = `${baseUrl}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [{ text: (0, cloud_helpers_1.systemPrompt)() }],
                        },
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: (0, cloud_helpers_1.buildUserContent)(prompt, context) }],
                            },
                        ],
                    }),
                    signal,
                });
                if (!res.ok) {
                    const body = await res.text().catch(() => '');
                    stream.emitError(new Error(`Gemini error ${res.status}: ${body}`));
                    return;
                }
                if (!res.body) {
                    stream.emitError(new Error('Gemini returned an empty response body.'));
                    return;
                }
                let fullText = '';
                for await (const line of (0, cloud_helpers_1.readSSELines)(res.body, signal)) {
                    const token = (0, cloud_helpers_1.extractGeminiToken)(line);
                    if (token !== null) {
                        fullText += token;
                        stream.emitToken(token);
                    }
                }
                stream.emitComplete(fullText);
            }
            catch (err) {
                stream.emitError((0, cloud_helpers_1.normalizeError)(err));
            }
        }, 0);
        return stream;
    }
}
exports.GeminiRuntime = GeminiRuntime;
//# sourceMappingURL=gemini-runtime.js.map