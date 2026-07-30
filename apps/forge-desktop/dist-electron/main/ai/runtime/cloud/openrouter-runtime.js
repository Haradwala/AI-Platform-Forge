"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRouterRuntime = void 0;
const cloud_helpers_1 = require("./cloud-helpers");
/**
 * OpenRouterRuntime — IAiRuntime implementation for OpenRouter.
 *
 * OpenRouter is an OpenAI-compatible gateway that proxies to dozens of models.
 * It requires `HTTP-Referer` and `X-Title` headers for attribution/analytics.
 *
 * Configuration: set OPENROUTER_API_KEY in environment or ConfigurationService.
 * Streaming: POST https://openrouter.ai/api/v1/chat/completions with stream:true.
 * Model list: GET https://openrouter.ai/api/v1/models (returns all available models).
 */
class OpenRouterRuntime extends cloud_helpers_1.OpenAICompatibleRuntime {
    id = 'openrouter';
    name = 'OpenRouter';
    envKeyName = 'OPENROUTER_API_KEY';
    defaultBaseUrl = 'https://openrouter.ai/api';
    defaultModel = 'openai/gpt-4o-mini';
    fallbackModels = [
        'openai/gpt-4o',
        'openai/gpt-4o-mini',
        'anthropic/claude-3.5-sonnet',
        'google/gemini-2.0-flash',
        'meta-llama/llama-3.3-70b-instruct',
    ];
    extraHeaders() {
        return {
            'HTTP-Referer': 'https://forge.dev',
            'X-Title': 'Forge AI IDE',
        };
    }
    constructor(resolver, configService) {
        super(resolver, configService);
    }
}
exports.OpenRouterRuntime = OpenRouterRuntime;
//# sourceMappingURL=openrouter-runtime.js.map