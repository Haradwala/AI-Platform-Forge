"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqRuntime = void 0;
const cloud_helpers_1 = require("./cloud-helpers");
/**
 * GroqRuntime — IAiRuntime implementation for the Groq API.
 *
 * Groq exposes an OpenAI-compatible endpoint so this class reuses the full
 * base class implementation unchanged — only the base URL and env key differ.
 *
 * Configuration: set GROQ_API_KEY in environment or ConfigurationService.
 * Streaming: POST https://api.groq.com/openai/v1/chat/completions with stream:true.
 */
class GroqRuntime extends cloud_helpers_1.OpenAICompatibleRuntime {
    id = 'groq';
    name = 'Groq';
    envKeyName = 'GROQ_API_KEY';
    defaultBaseUrl = 'https://api.groq.com/openai';
    defaultModel = 'llama-3.3-70b-versatile';
    fallbackModels = [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
        'mixtral-8x7b-32768',
        'gemma2-9b-it',
    ];
    constructor(resolver, configService) {
        super(resolver, configService);
    }
}
exports.GroqRuntime = GroqRuntime;
//# sourceMappingURL=groq-runtime.js.map