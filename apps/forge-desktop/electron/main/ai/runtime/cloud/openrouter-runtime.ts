import { OpenAICompatibleRuntime } from './cloud-helpers';
import type { IServiceResolver } from '../../../container/interfaces';
import type { IConfigurationService } from '../../../config/configuration-service';

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
export class OpenRouterRuntime extends OpenAICompatibleRuntime {
  readonly id = 'openrouter';
  readonly name = 'OpenRouter';

  protected readonly envKeyName = 'OPENROUTER_API_KEY';
  protected readonly defaultBaseUrl = 'https://openrouter.ai/api';
  protected readonly defaultModel = 'openai/gpt-4o-mini';
  protected readonly fallbackModels = [
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-2.0-flash',
    'meta-llama/llama-3.3-70b-instruct',
  ];

  protected extraHeaders(): Record<string, string> {
    return {
      'HTTP-Referer': 'https://forge.dev',
      'X-Title': 'Forge AI IDE',
    };
  }

  constructor(resolver?: IServiceResolver, configService?: IConfigurationService) {
    super(resolver, configService);
  }
}
