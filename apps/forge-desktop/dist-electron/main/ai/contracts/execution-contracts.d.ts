/**
 * execution-contracts.ts — Phase 25-28 Shared Domain Contracts
 *
 * Establishes standard interfaces for AI Orchestrator, Workflow Engine,
 * Runtime Router, Workspace Intelligence, and Repository Importers.
 */
import type { TaskPriority } from '../execution/execution-types';
export type { TaskPriority };
export type RuntimeCapability = 'streaming' | 'tools' | 'mcp' | 'approval' | 'images' | 'resume' | 'thinking' | 'json' | 'vision' | 'reasoning';
export type TaskComplexity = 'trivial' | 'simple' | 'moderate' | 'complex' | 'extreme';
export interface ExecutionRequest {
    taskId: string;
    intent: string;
    capabilities: RuntimeCapability[];
    priority: TaskPriority;
    complexity: TaskComplexity;
    estimatedTokens: number;
    contextSize: number;
    workspaceRoot: string;
    suggestedRuntime?: string;
    userPreference?: string;
    requiresLocal?: boolean;
}
export interface ExecutionResult {
    taskId: string;
    sessionId: string;
    runtimeId: string;
    status: 'COMPLETED' | 'FAILED' | 'CANCELLED';
    output: string;
    durationMs: number;
    error?: string;
    tokenUsage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
export interface WorkspaceProfile {
    language: string;
    framework: string;
    packageManager: string;
    projectType: string;
    preferredRuntime: string;
    fallbackRuntime: string;
    features: string[];
    analysis: {
        lastIndexed: string;
        healthScore: number;
        runtimeRecommendations: Array<{
            category: 'best_overall' | 'best_local' | 'best_coding' | 'best_vision' | 'best_reasoning' | 'fastest' | 'offline';
            runtimeId: string;
            reason: string;
        }>;
    };
}
export interface RepositoryDescriptor {
    source: 'github' | 'gitlab' | 'bitbucket' | 'azure' | 'local' | 'zip' | 'template' | 'ssh';
    url: string;
    branch?: string;
    submodules?: boolean;
    sparsePath?: string;
    localPath?: string;
}
