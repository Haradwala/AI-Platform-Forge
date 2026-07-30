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

export class RuntimeApplicationService implements IRuntimeApplicationService {
  constructor(
    private readonly runtimeRouter?: RuntimeRouter,
    private readonly executionManager?: RuntimeExecutionManager,
    readonly multiRuntime?: IMultiRuntimeApplicationService
  ) {}

  async routeIntent(intent: string, workspaceRoot: string): Promise<any> {
    if (this.runtimeRouter) {
      const candidates = [
        { id: 'claude', name: 'Claude CLI', type: 'cli' as const, isAvailable: true, capabilities: { streaming: true, tools: true }, health: 'healthy' as const, latencyMs: 150 },
        { id: 'ollama', name: 'Ollama Local', type: 'cli' as const, isAvailable: true, capabilities: { streaming: true, tools: true }, health: 'healthy' as const, latencyMs: 50 },
      ];
      return this.runtimeRouter.rankRuntimes({
        taskId: `req_${Date.now()}`,
        intent,
        capabilities: ['streaming', 'tools'],
        priority: 'normal',
        complexity: 'moderate',
        estimatedTokens: 1000,
        contextSize: 8000,
        workspaceRoot,
      }, candidates);
    }
    return [];
  }

  async getActiveSessions(): Promise<any[]> {
    if (this.executionManager) {
      return this.executionManager.getAllSessions();
    }
    return [];
  }

  async cancelSession(sessionId: string): Promise<boolean> {
    if (this.executionManager) {
      await this.executionManager.stopSession(sessionId);
      return true;
    }
    return false;
  }
}
