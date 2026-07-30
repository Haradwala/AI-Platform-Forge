/**
 * runtime-profile-registry.ts — Runtime Profile Catalog Registry
 */

import { RuntimeProfile } from '../contracts/runtime-types';

export class RuntimeProfileRegistry {
  private profiles = new Map<string, RuntimeProfile>();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    const defaults: RuntimeProfile[] = [
      {
        modelId: 'gpt-4o',
        providerId: 'openai',
        name: 'OpenAI GPT-4o',
        contextWindow: 128000,
        maxOutputTokens: 4096,
        supportsVision: true,
        supportsFunctionCalling: true,
        supportsStreaming: true,
        supportsEmbeddings: true,
        inputCostPer1M: 5.0,
        outputCostPer1M: 15.0,
        latencyTier: 'fast',
        isLocal: false,
      },
      {
        modelId: 'claude-3-5-sonnet',
        providerId: 'anthropic',
        name: 'Anthropic Claude 3.5 Sonnet',
        contextWindow: 200000,
        maxOutputTokens: 8192,
        supportsVision: true,
        supportsFunctionCalling: true,
        supportsStreaming: true,
        supportsEmbeddings: false,
        inputCostPer1M: 3.0,
        outputCostPer1M: 15.0,
        latencyTier: 'fast',
        isLocal: false,
      },
      {
        modelId: 'gemini-1.5-pro',
        providerId: 'gemini',
        name: 'Google Gemini 1.5 Pro',
        contextWindow: 2000000,
        maxOutputTokens: 8192,
        supportsVision: true,
        supportsFunctionCalling: true,
        supportsStreaming: true,
        supportsEmbeddings: true,
        inputCostPer1M: 3.5,
        outputCostPer1M: 10.5,
        latencyTier: 'balanced',
        isLocal: false,
      },
      {
        modelId: 'llama3:8b',
        providerId: 'ollama',
        name: 'Ollama Llama 3 8B (Local)',
        contextWindow: 8192,
        maxOutputTokens: 2048,
        supportsVision: false,
        supportsFunctionCalling: false,
        supportsStreaming: true,
        supportsEmbeddings: true,
        inputCostPer1M: 0,
        outputCostPer1M: 0,
        latencyTier: 'ultra-fast',
        isLocal: true,
      },
    ];

    defaults.forEach((p) => this.registerProfile(p));
  }

  registerProfile(profile: RuntimeProfile): void {
    this.profiles.set(profile.modelId, profile);
  }

  getProfile(modelId: string): RuntimeProfile | null {
    return this.profiles.get(modelId) || null;
  }

  listProfiles(filter?: { isLocal?: boolean; supportsVision?: boolean }): RuntimeProfile[] {
    let results = Array.from(this.profiles.values());
    if (filter) {
      if (filter.isLocal !== undefined) {
        results = results.filter((p) => p.isLocal === filter.isLocal);
      }
      if (filter.supportsVision !== undefined) {
        results = results.filter((p) => p.supportsVision === filter.supportsVision);
      }
    }
    return results;
  }
}
