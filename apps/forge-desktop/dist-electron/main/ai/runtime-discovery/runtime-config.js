"use strict";
/**
 * runtime-config.ts — Phase 23 Runtime Discovery Config Manager
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeConfig = exports.DEFAULT_RUNTIME_DISCOVERY_CONFIG = void 0;
exports.DEFAULT_RUNTIME_DISCOVERY_CONFIG = {
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
class RuntimeConfig {
    config;
    constructor(initialConfig) {
        this.config = {
            ...exports.DEFAULT_RUNTIME_DISCOVERY_CONFIG,
            ...initialConfig,
        };
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(partial) {
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
    setCustomPath(runtimeId, path) {
        this.config.customExecutablePaths[runtimeId] = path;
    }
    getCustomPath(runtimeId) {
        return this.config.customExecutablePaths[runtimeId];
    }
    /** Redacts sensitive secret values (API keys, tokens) for logs/UI */
    static redactSecret(value) {
        if (!value)
            return '';
        if (value.length <= 8)
            return '********';
        return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
    }
    /** Detects if an environment variable key is a secret */
    static isSecretKey(key) {
        const upperKey = key.toUpperCase();
        return (upperKey.includes('KEY') ||
            upperKey.includes('SECRET') ||
            upperKey.includes('TOKEN') ||
            upperKey.includes('PASSWORD') ||
            upperKey.includes('AUTH'));
    }
}
exports.RuntimeConfig = RuntimeConfig;
//# sourceMappingURL=runtime-config.js.map