/**
 * runtime-types.ts — Phase 23 Runtime Discovery Types
 */
export type KnownRuntimeId = 'ollama' | 'claude-code' | 'gemini-cli' | 'codex-cli' | 'aider' | 'opencode' | 'goose' | 'openrouter' | 'openai' | string;
export type RuntimeCategory = 'cli' | 'cloud' | 'local' | 'mcp' | 'external';
export type RuntimeHealthState = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
export type RuntimeDiscoveryStatus = 'stopped' | 'running' | 'unhealthy' | 'error' | 'not_installed';
export interface RuntimeCapabilities {
    streaming: boolean;
    tools: boolean;
    mcp: boolean;
    approval: boolean;
    images?: boolean;
    resume?: boolean;
}
export interface DiscoveredRuntime {
    id: KnownRuntimeId;
    name: string;
    category: RuntimeCategory;
    installed: boolean;
    version: string | null;
    executablePath: string | null;
    status: RuntimeDiscoveryStatus;
    health: RuntimeHealthState;
    envVars: Record<string, string>;
    rawEnvVars?: Record<string, string>;
    capabilities: RuntimeCapabilities;
    installUrl?: string;
    missingDependencies?: string[];
    lastChecked: number;
    metadata?: Record<string, unknown>;
}
export interface RuntimeDiscoveryEngineOptions {
    autoScan?: boolean;
    scanIntervalMs?: number;
    customExecutablePaths?: Record<string, string>;
}
