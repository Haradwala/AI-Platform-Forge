"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIRuntime = void 0;
const cloud_helpers_1 = require("./cloud-helpers");
/**
 * OpenAIRuntime — IAiRuntime implementation for the OpenAI Chat Completions API.
 *
 * Configuration: set OPENAI_API_KEY in environment or ConfigurationService.
 * Model discovery: GET https://api.openai.com/v1/models (filtered to gpt-* models).
 * Streaming: POST https://api.openai.com/v1/chat/completions with stream:true.
 */
class OpenAIRuntime extends cloud_helpers_1.OpenAICompatibleRuntime {
    id = 'openai';
    name = 'OpenAI';
    envKeyName = 'OPENAI_API_KEY';
    defaultBaseUrl = 'https://api.openai.com';
    defaultModel = 'gpt-4o-mini';
    fallbackModels = [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-3.5-turbo',
    ];
    // Keep only flagship GPT models — filter out fine-tunes, embeddings, etc.
    modelFilter(id) {
        return id.startsWith('gpt-');
    }
    constructor(resolver, configService) {
        super(resolver, configService);
    }
}
exports.OpenAIRuntime = OpenAIRuntime;
//# sourceMappingURL=openai-runtime.js.map