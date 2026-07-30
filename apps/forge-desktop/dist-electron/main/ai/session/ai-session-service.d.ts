import type { IAiSessionService, IAiSession, IProviderRegistry, IDesktopLogger } from '../../container/service-interfaces';
import { IRuntimeService } from '../../platform/runtime-service';
export type ConversationState = 'Idle' | 'CollectingContext' | 'Thinking' | 'Planning' | 'Executing' | 'Waiting' | 'Completed' | 'Cancelled' | 'Failed';
export interface IAiSessionInfo extends IAiSession {
    workspacePath: string | null;
    state: ConversationState;
}
export declare class AiSessionService implements IAiSessionService, IRuntimeService {
    private readonly providerRegistry;
    private readonly logger;
    readonly id = "AiSessionService";
    readonly version = "2.0.0";
    readonly dependencies: never[];
    health: 'healthy' | 'warning' | 'degraded' | 'failed';
    status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error';
    private readonly sessions;
    private activeSessionId;
    private readonly startTime;
    constructor(providerRegistry: IProviderRegistry, logger: IDesktopLogger);
    uptime(): number;
    metrics(): Record<string, any>;
    onStart(): void;
    onRunning(): void;
    onSuspend(): void;
    onShutdown(): void;
    createSession(): IAiSessionInfo;
    getSession(id: string): IAiSessionInfo | null;
    getActiveSession(): IAiSessionInfo | null;
    setActiveSession(session: IAiSession | null): void;
    setProvider(id: string): void;
    setModel(id: string): void;
    updateSessionState(id: string, state: ConversationState): void;
}
export type { IAiSessionService };
