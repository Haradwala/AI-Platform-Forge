/**
 * runtime-config.ts — Phase 23 Runtime Discovery Config Manager
 */

export interface RuntimeDiscoveryConfig {
  autoScan: boolean;
  scanIntervalMs: number;
  customExecutablePaths: Record<string, string>;
  enabledRuntimes: string[];
  cacheTtlMs: number;
  environmentOverrides: Record<string, Record<string, string>>;
}

export const DEFAULT_RUNTIME_DISCOVERY_CONFIG: RuntimeDiscoveryConfig = {
  autoScan: true,
  scanIntervalMs: 60000,
  customExecutablePaths: {},
  enabledRuntimes: [
    'ollama',
    'claude-code',
    'gemini-cli',
    'codex-cli',
    'aider',
    'opencode',
    'goose',
    'openrouter',
    'openai',
  ],
  cacheTtlMs: 300000, // 5 minutes
  environmentOverrides: {},
};

export class RuntimeConfig {
  private config: RuntimeDiscoveryConfig;

  constructor(initialConfig?: Partial<RuntimeDiscoveryConfig>) {
    this.config = {
      ...DEFAULT_RUNTIME_DISCOVERY_CONFIG,
      ...initialConfig,
    };
  }

  getConfig(): RuntimeDiscoveryConfig {
    return { ...this.config };
  }

  updateConfig(partial: Partial<RuntimeDiscoveryConfig>): void {
    this.config = {
      ...this.config,
      ...partial,
      customExecutablePaths: {
        ...this.config.customExecutablePaths,
        ...partial.customExecutablePaths,
      },
      environmentOverrides: {
        ...this.config.environmentOverrides,
        ...partial.environmentOverrides,
      },
    };
  }

  setCustomPath(runtimeId: string, path: string): void {
    this.config.customExecutablePaths[runtimeId] = path;
  }

  getCustomPath(runtimeId: string): string | undefined {
    return this.config.customExecutablePaths[runtimeId];
  }

  /** Redacts sensitive secret values (API keys, tokens) for logs/UI */
  static redactSecret(value?: string): string {
    if (!value) return '';
    if (value.length <= 8) return '********';
    return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
  }

  /** Detects if an environment variable key is a secret */
  static isSecretKey(key: string): boolean {
    const upperKey = key.toUpperCase();
    return (
      upperKey.includes('KEY') ||
      upperKey.includes('SECRET') ||
      upperKey.includes('TOKEN') ||
      upperKey.includes('PASSWORD') ||
      upperKey.includes('AUTH')
    );
  }
}
