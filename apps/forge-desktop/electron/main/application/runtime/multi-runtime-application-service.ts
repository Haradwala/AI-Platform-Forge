/**
 * multi-runtime-application-service.ts — Application Service Facade for Multi-Runtime Subsystem
 */

import {
  RuntimeProfile,
  RuntimeCandidate,
  RoutingRequest,
  RoutingDecision,
  RuntimeSession,
  PerformanceMetrics,
  SessionMessage,
} from '../../runtimes/contracts/runtime-types';
import { RuntimeManager } from '../../runtimes/manager/runtime-manager';
import { RuntimeProfileRegistry } from '../../runtimes/profiles/runtime-profile-registry';
import { IntelligentRoutingEngine } from '../../runtimes/routing/intelligent-routing-engine';
import { MultiRuntimeSessionManager } from '../../runtimes/sessions/multi-runtime-session-manager';
import { RuntimePerformanceEngine } from '../../runtimes/performance/runtime-performance-engine';

export interface IMultiRuntimeApplicationService {
  listProfiles(filter?: { isLocal?: boolean; supportsVision?: boolean }): Promise<RuntimeProfile[]>;
  getActiveRuntimes(): Promise<RuntimeCandidate[]>;
  routeRequest(request: RoutingRequest): Promise<RoutingDecision>;
  createSession(workspaceRoot: string, initialModelId?: string): Promise<RuntimeSession>;
  switchRuntime(sessionId: string, newModelId: string): Promise<RuntimeSession>;
  addSessionMessage(sessionId: string, message: SessionMessage): Promise<void>;
  getSession(sessionId: string): Promise<RuntimeSession | null>;
  listSessions(workspaceRoot: string): Promise<RuntimeSession[]>;
  getMetrics(modelId: string): Promise<PerformanceMetrics>;
  runBenchmark(modelId: string): Promise<PerformanceMetrics>;
}

export class MultiRuntimeApplicationService implements IMultiRuntimeApplicationService {
  constructor(
    private readonly runtimeManager?: RuntimeManager,
    private readonly profileRegistry?: RuntimeProfileRegistry,
    private readonly routingEngine?: IntelligentRoutingEngine,
    private readonly sessionManager?: MultiRuntimeSessionManager,
    private readonly performanceEngine?: RuntimePerformanceEngine
  ) {}

  async listProfiles(filter?: { isLocal?: boolean; supportsVision?: boolean }): Promise<RuntimeProfile[]> {
    if (!this.profileRegistry) return [];
    return this.profileRegistry.listProfiles(filter);
  }

  async getActiveRuntimes(): Promise<RuntimeCandidate[]> {
    if (!this.runtimeManager) return [];
    return this.runtimeManager.getActiveRuntimes();
  }

  async routeRequest(request: RoutingRequest): Promise<RoutingDecision> {
    if (!this.routingEngine) throw new Error('IntelligentRoutingEngine unavailable');
    return this.routingEngine.routeRequest(request);
  }

  async createSession(workspaceRoot: string, initialModelId?: string): Promise<RuntimeSession> {
    if (!this.sessionManager) throw new Error('MultiRuntimeSessionManager unavailable');
    return this.sessionManager.createSession(workspaceRoot, initialModelId);
  }

  async switchRuntime(sessionId: string, newModelId: string): Promise<RuntimeSession> {
    if (!this.sessionManager) throw new Error('MultiRuntimeSessionManager unavailable');
    return this.sessionManager.switchRuntime(sessionId, newModelId);
  }

  async addSessionMessage(sessionId: string, message: SessionMessage): Promise<void> {
    if (this.sessionManager) {
      await this.sessionManager.addMessage(sessionId, message);
    }
  }

  async getSession(sessionId: string): Promise<RuntimeSession | null> {
    if (!this.sessionManager) return null;
    return this.sessionManager.getSession(sessionId);
  }

  async listSessions(workspaceRoot: string): Promise<RuntimeSession[]> {
    if (!this.sessionManager) return [];
    return this.sessionManager.listSessions(workspaceRoot);
  }

  async getMetrics(modelId: string): Promise<PerformanceMetrics> {
    if (!this.performanceEngine) throw new Error('RuntimePerformanceEngine unavailable');
    return this.performanceEngine.getMetrics(modelId);
  }

  async runBenchmark(modelId: string): Promise<PerformanceMetrics> {
    if (!this.performanceEngine) throw new Error('RuntimePerformanceEngine unavailable');
    return this.performanceEngine.runBenchmark(modelId);
  }
}
