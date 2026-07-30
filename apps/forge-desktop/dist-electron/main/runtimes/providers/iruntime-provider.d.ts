/**
 * iruntime-provider.ts — Plugin Interface for Local & Cloud Runtime Providers
 */
import { RuntimeProfile } from '../contracts/runtime-types';
export interface RuntimeExecutionPayload {
    modelId: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    stop?: string[];
}
export interface RuntimeExecutionResult {
    content: string;
    inputTokens: number;
    outputTokens: number;
    ttftMs: number;
    durationMs: number;
}
export interface IRuntimeProvider {
    readonly providerId: string;
    readonly isLocal: boolean;
    listAvailableModels(): Promise<RuntimeProfile[]>;
    executeSync(payload: RuntimeExecutionPayload): Promise<RuntimeExecutionResult>;
}
