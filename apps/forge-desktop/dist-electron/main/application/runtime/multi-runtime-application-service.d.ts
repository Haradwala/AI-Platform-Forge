/**
 * multi-runtime-application-service.ts — Application Service Facade for Multi-Runtime Subsystem
 */
import { RuntimeProfile, RuntimeCandidate, RoutingRequest, RoutingDecision, RuntimeSession, PerformanceMetrics, SessionMessage } from '../../runtimes/contracts/runtime-types';
import { RuntimeManager } from '../../runtimes/manager/runtime-manager';
import { RuntimeProfileRegistry } from '../../runtimes/profiles/runtime-profile-registry';
import { IntelligentRoutingEngine } from '../../runtimes/routing/intelligent-routing-engine';
import { MultiRuntimeSessionManager } from '../../runtimes/sessions/multi-runtime-session-manager';
import { RuntimePerformanceEngine } from '../../runtimes/performance/runtime-performance-engine';
export interface IMultiRuntimeApplicationService {
    listProfiles(filter?: {
        isLocal?: boolean;
        supportsVision?: boolean;
    }): Promise<RuntimeProfile[]>;
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
export declare class MultiRuntimeApplicationService implements IMultiRuntimeApplicationService {
    private readonly runtimeManager?;
    private readonly profileRegistry?;
    private readonly routingEngine?;
    private readonly sessionManager?;
    private readonly performanceEngine?;
    constructor(runtimeManager?: RuntimeManager | undefined, profileRegistry?: RuntimeProfileRegistry | undefined, routingEngine?: IntelligentRoutingEngine | undefined, sessionManager?: MultiRuntimeSessionManager | undefined, performanceEngine?: RuntimePerformanceEngine | undefined);
    listProfiles(filter?: {
        isLocal?: boolean;
        supportsVision?: boolean;
    }): Promise<RuntimeProfile[]>;
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
