import { OpenAICompatibleRuntime } from './cloud-helpers';
import type { IServiceResolver } from '../../../container/interfaces';
import type { IConfigurationService } from '../../../config/configuration-service';
/**
 * GroqRuntime — IAiRuntime implementation for the Groq API.
 *
 * Groq exposes an OpenAI-compatible endpoint so this class reuses the full
 * base class implementation unchanged — only the base URL and env key differ.
 *
 * Configuration: set GROQ_API_KEY in environment or ConfigurationService.
 * Streaming: POST https://api.groq.com/openai/v1/chat/completions with stream:true.
 */
export declare class GroqRuntime extends OpenAICompatibleRuntime {
    readonly id = "groq";
    readonly name = "Groq";
    protected readonly envKeyName = "GROQ_API_KEY";
    protected readonly defaultBaseUrl = "https://api.groq.com/openai";
    protected readonly defaultModel = "llama-3.3-70b-versatile";
    protected readonly fallbackModels: string[];
    constructor(resolver?: IServiceResolver, configService?: IConfigurationService);
}
