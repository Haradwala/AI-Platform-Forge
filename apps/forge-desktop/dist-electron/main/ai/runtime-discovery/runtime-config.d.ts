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
export declare const DEFAULT_RUNTIME_DISCOVERY_CONFIG: RuntimeDiscoveryConfig;
export declare class RuntimeConfig {
    private config;
    constructor(initialConfig?: Partial<RuntimeDiscoveryConfig>);
    getConfig(): RuntimeDiscoveryConfig;
    updateConfig(partial: Partial<RuntimeDiscoveryConfig>): void;
    setCustomPath(runtimeId: string, path: string): void;
    getCustomPath(runtimeId: string): string | undefined;
    /** Redacts sensitive secret values (API keys, tokens) for logs/UI */
    static redactSecret(value?: string): string;
    /** Detects if an environment variable key is a secret */
    static isSecretKey(key: string): boolean;
}
