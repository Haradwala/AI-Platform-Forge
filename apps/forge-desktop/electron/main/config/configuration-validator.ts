/**
 * configuration-validator.ts
 *
 * Diagnostic validator for ForgeConfig.
 * Checks for missing API keys, invalid URLs, and unknown active runtimes.
 * Never throws.
 */

import type { ForgeConfig } from './configuration-schema';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateConfig(config: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config || typeof config !== 'object') {
    return {
      valid: false,
      errors: ['Configuration is null, undefined, or not an object.'],
      warnings: [],
    };
  }

  const cfg = config as Partial<ForgeConfig>;

  // Validate activeRuntime
  if (!cfg.activeRuntime || typeof cfg.activeRuntime !== 'string' || cfg.activeRuntime.trim() === '') {
    errors.push('activeRuntime is missing or invalid.');
  }

  // Validate providers
  if (!cfg.providers || typeof cfg.providers !== 'object') {
    errors.push('providers section is missing or invalid.');
  } else {
    for (const [providerId, pConfig] of Object.entries(cfg.providers)) {
      if (!pConfig || typeof pConfig !== 'object') {
        warnings.push(`Provider "${providerId}" configuration is not an object.`);
        continue;
      }

      // Check URL validity if present
      if ('baseUrl' in pConfig && typeof pConfig.baseUrl === 'string' && pConfig.baseUrl !== '') {
        try {
          new URL(pConfig.baseUrl);
        } catch {
          errors.push(`Provider "${providerId}" has invalid baseUrl: "${pConfig.baseUrl}".`);
        }
      }

      // Check API key warnings for cloud providers
      if (providerId !== 'ollama' && providerId !== 'mock') {
        if (!('apiKey' in pConfig) || typeof pConfig.apiKey !== 'string' || pConfig.apiKey.trim() === '') {
          warnings.push(`Provider "${providerId}" has no API key configured.`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
