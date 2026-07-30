/**
 * runtime-health.ts — Phase 23 Runtime Health Checker
 */
export interface HealthCheckResult {
    runtimeId: string;
    health: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
    latencyMs: number;
    statusMessage: string;
    details?: Record<string, unknown>;
}
export declare class RuntimeHealthChecker {
    /**
     * Evaluates the operational status and response latency of a discovered runtime.
     */
    checkHealth(runtimeId: string, executablePath?: string | null, rawEnvVars?: Record<string, string>): Promise<HealthCheckResult>;
    private checkOllamaHealth;
    private checkOpenAIHealth;
    private checkOpenRouterHealth;
    private checkCliHealth;
}
