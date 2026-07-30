/**
 * runtime-types.ts — Core Data Contracts for Multi-Runtime Intelligence Subsystem
 */
export type LatencyTier = 'ultra-fast' | 'fast' | 'balanced' | 'slow';
export type TaskType = 'coding' | 'reasoning' | 'architecture' | 'search' | 'refactor';
export interface RuntimeProfile {
    modelId: string;
    providerId: string;
    name: string;
    contextWindow: number;
    maxOutputTokens: number;
    supportsVision: boolean;
    supportsFunctionCalling: boolean;
    supportsStreaming: boolean;
    supportsEmbeddings: boolean;
    inputCostPer1M: number;
    outputCostPer1M: number;
    latencyTier: LatencyTier;
    isLocal: boolean;
}
export interface RuntimeCapabilities {
    supportsVision: boolean;
    supportsFunctionCalling: boolean;
    supportsStreaming: boolean;
    supportsEmbeddings: boolean;
    maxContextTokens: number;
}
export interface RuntimeHealthStatus {
    runtimeId: string;
    status: 'healthy' | 'degraded' | 'unreachable';
    latencyMs: number;
    lastCheckedAt: number;
}
export interface RuntimeCandidate {
    id: string;
    modelId: string;
    providerId: string;
    name: string;
    isLocal: boolean;
    health: 'healthy' | 'degraded' | 'unreachable';
    capabilities: RuntimeCapabilities;
}
export interface RoutingRequest {
    workspaceRoot: string;
    taskType: TaskType;
    requiredCapabilities: string[];
    minContextTokens?: number;
    maxCostUSD?: number;
    preferredLanguage?: string;
    allowCloud?: boolean;
}
export interface RoutingDecision {
    selectedModelId: string;
    selectedProviderId: string;
    fallbackChain: string[];
    score: number;
    rationale: string;
}
export interface SessionMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    modelId: string;
    timestamp: number;
}
export interface RuntimeSession {
    id: string;
    workspaceRoot: string;
    currentModelId: string;
    messages: SessionMessage[];
    createdAt: number;
    updatedAt: number;
}
export interface ExecutionMetricSample {
    modelId: string;
    providerId: string;
    workspaceRoot: string;
    ttftMs: number;
    tokensPerSec: number;
    inputTokens: number;
    outputTokens: number;
    costUSD: number;
    success: boolean;
    error?: string;
    timestamp: number;
}
export interface PerformanceMetrics {
    modelId: string;
    avgTtftMs: number;
    avgTokensPerSec: number;
    totalRequests: number;
    successRate: number;
    totalCostUSD: number;
    reliabilityScore: number;
}
