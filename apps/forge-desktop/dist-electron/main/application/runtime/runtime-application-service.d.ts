/**
 * runtime-application-service.ts — Application Service for AI Runtime Management & Routing
 *
 * Provides application layer methods to query, score, and execute sessions across
 * AI runtimes (Claude, Gemini, Ollama, Codex, Aider, Goose).
 */
import { RuntimeRouter } from '../../ai/routing/runtime-router';
import { RuntimeExecutionManager } from '../../ai/runtime/runtime-execution-manager';
import { IMultiRuntimeApplicationService } from './multi-runtime-application-service';
export interface IRuntimeApplicationService {
    readonly multiRuntime?: IMultiRuntimeApplicationService;
    routeIntent(intent: string, workspaceRoot: string): Promise<any>;
    getActiveSessions(): Promise<any[]>;
    cancelSession(sessionId: string): Promise<boolean>;
}
export declare class RuntimeApplicationService implements IRuntimeApplicationService {
    private readonly runtimeRouter?;
    private readonly executionManager?;
    readonly multiRuntime?: IMultiRuntimeApplicationService | undefined;
    constructor(runtimeRouter?: RuntimeRouter | undefined, executionManager?: RuntimeExecutionManager | undefined, multiRuntime?: IMultiRuntimeApplicationService | undefined);
    routeIntent(intent: string, workspaceRoot: string): Promise<any>;
    getActiveSessions(): Promise<any[]>;
    cancelSession(sessionId: string): Promise<boolean>;
}
