/**
 * configuration-schema.ts
 *
 * Schema definitions and default configuration builder for Forge.
 */

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  [key: string]: unknown;
}

export interface ForgeConfig {
  activeRuntime: string;
  defaultModels: Record<string, string>;
  providers: {
    ollama: { baseUrl: string };
    openai: { apiKey: string; baseUrl?: string };
    gemini: { apiKey: string; baseUrl?: string };
    anthropic: { apiKey: string; baseUrl?: string };
    groq: { apiKey: string; baseUrl?: string };
    openrouter: { apiKey: string; baseUrl?: string };
    [key: string]: ProviderConfig;
  };
}

/**
 * Returns a clean default ForgeConfig.
 * Seeds initial API keys and base URLs from process.env if present.
 */
export function createDefaultConfig(): ForgeConfig {
  return {
    activeRuntime: 'mock',
    defaultModels: {
      mock: 'mock-general-v1',
      ollama: 'llama3',
      openai: 'gpt-4o-mini',
      gemini: 'gemini-2.0-flash',
      anthropic: 'claude-haiku-3-5',
      groq: 'llama-3.3-70b-versatile',
      openrouter: 'openai/gpt-4o-mini',
    },
    providers: {
      ollama: {
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        baseUrl: 'https://api.openai.com',
      },
      gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      },
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || '',
        baseUrl: 'https://api.anthropic.com',
      },
      groq: {
        apiKey: process.env.GROQ_API_KEY || '',
        baseUrl: 'https://api.groq.com/openai',
      },
      openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY || '',
        baseUrl: 'https://openrouter.ai/api',
      },
    },
  };
}
