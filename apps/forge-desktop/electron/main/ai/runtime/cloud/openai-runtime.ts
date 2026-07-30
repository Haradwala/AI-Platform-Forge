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
export class OpenAIRuntime extends OpenAICompatibleRuntime {
  readonly id = 'openai';
  readonly name = 'OpenAI';

  protected readonly envKeyName = 'OPENAI_API_KEY';
  protected readonly defaultBaseUrl = 'https://api.openai.com';
  protected readonly defaultModel = 'gpt-4o-mini';
  protected readonly fallbackModels = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
  ];

  // Keep only flagship GPT models — filter out fine-tunes, embeddings, etc.
  protected modelFilter(id: string): boolean {
    return id.startsWith('gpt-');
  }

  constructor(resolver?: IServiceResolver, configService?: IConfigurationService) {
    super(resolver, configService);
  }
}
