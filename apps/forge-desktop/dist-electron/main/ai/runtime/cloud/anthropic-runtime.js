"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicRuntime = void 0;
const cloud_helpers_1 = require("./cloud-helpers");
const token_stream_1 = require("../../providers/token-stream");
const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-haiku-3-5';
const MAX_TOKENS = 2048;
const FALLBACK_MODELS = [
    'claude-opus-4-5',
    'claude-sonnet-4-5',
    'claude-haiku-3-5',
];
class AnthropicRuntime {
    resolver;
    configService;
    id = 'anthropic';
    name = 'Anthropic';
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
        return this.activeConfig.getProvider(this.id)?.baseUrl || 'https://api.anthropic.com';
    }
    get anthropicHeaders() {
        return {
            'x-api-key': this.apiKey,
            'anthropic-version': ANTHROPIC_VERSION,
            'Content-Type': 'application/json',
        };
    }
    async listAvailableModels() {
        if (!this.apiKey)
            return FALLBACK_MODELS;
        try {
            const res = await fetch(`${this.baseUrl}/v1/models`, {
                headers: {
                    'x-api-key': this.apiKey,
                    'anthropic-version': ANTHROPIC_VERSION,
                },
                signal: AbortSignal.timeout(5000),
            });
            if (!res.ok)
                return FALLBACK_MODELS;
            const data = await res.json();
            const models = (data.data ?? []).map((m) => m.id);
            return models.length > 0 ? models : FALLBACK_MODELS;
        }
        catch {
            return FALLBACK_MODELS;
        }
    }
    async healthCheck() {
        if (!this.apiKey) {
            return { healthy: false, latencyMs: 0, error: 'ANTHROPIC_API_KEY is not set' };
        }
        return (0, cloud_helpers_1.probeEndpoint)(`${this.baseUrl}/v1/models`, {
            'x-api-key': this.apiKey,
            'anthropic-version': ANTHROPIC_VERSION,
        });
    }
    async generateStream(prompt, context, signal) {
        const stream = new token_stream_1.AiTokenStream();
        const model = (0, cloud_helpers_1.resolveActiveModel)(this.resolver, DEFAULT_MODEL);
        const apiKey = this.apiKey;
        const baseUrl = this.baseUrl;
        setTimeout(async () => {
            if (!apiKey) {
                stream.emitError(new Error('ANTHROPIC_API_KEY is not set. Configure it to use Anthropic.'));
                return;
            }
            try {
                const res = await fetch(`${baseUrl}/v1/messages`, {
                    method: 'POST',
                    headers: this.anthropicHeaders,
                    body: JSON.stringify({
                        model,
                        max_tokens: MAX_TOKENS,
                        system: (0, cloud_helpers_1.systemPrompt)(),
                        messages: [
                            { role: 'user', content: (0, cloud_helpers_1.buildUserContent)(prompt, context) },
                        ],
                        stream: true,
                    }),
                    signal,
                });
                if (!res.ok) {
                    const body = await res.text().catch(() => '');
                    stream.emitError(new Error(`Anthropic error ${res.status}: ${body}`));
                    return;
                }
                if (!res.body) {
                    stream.emitError(new Error('Anthropic returned an empty response body.'));
                    return;
                }
                let fullText = '';
                for await (const line of (0, cloud_helpers_1.readSSELines)(res.body, signal)) {
                    const token = (0, cloud_helpers_1.extractAnthropicToken)(line);
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
exports.AnthropicRuntime = AnthropicRuntime;
//# sourceMappingURL=anthropic-runtime.js.map