import { OpenAICompatibleRuntime } from './cloud-helpers';
import type { IServiceResolver } from '../../../container/interfaces';
import type { IConfigurationService } from '../../../config/configuration-service';
/**
 * OpenAIRuntime — IAiRuntime implementation for the OpenAI Chat Completions API.
 *
 * Configuration: set OPENAI_API_KEY in environment or ConfigurationService.
 * Model discovery: GET https://api.openai.com/v1/models (filtered to gpt-* models).
 * Streaming: POST https://api.openai.com/v1/chat/completions with stream:true.
 */
export declare class OpenAIRuntime extends OpenAICompatibleRuntime {
    readonly id = "openai";
    readonly name = "OpenAI";
    protected readonly envKeyName = "OPENAI_API_KEY";
    protected readonly defaultBaseUrl = "https://api.openai.com";
    protected readonly defaultModel = "gpt-4o-mini";
    protected readonly fallbackModels: string[];
    protected modelFilter(id: string): boolean;
    constructor(resolver?: IServiceResolver, configService?: IConfigurationService);
}
