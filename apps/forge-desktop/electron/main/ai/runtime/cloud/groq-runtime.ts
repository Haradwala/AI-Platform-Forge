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
export class GroqRuntime extends OpenAICompatibleRuntime {
  readonly id = 'groq';
  readonly name = 'Groq';

  protected readonly envKeyName = 'GROQ_API_KEY';
  protected readonly defaultBaseUrl = 'https://api.groq.com/openai';
  protected readonly defaultModel = 'llama-3.3-70b-versatile';
  protected readonly fallbackModels = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
  ];

  constructor(resolver?: IServiceResolver, configService?: IConfigurationService) {
    super(resolver, configService);
  }
}
