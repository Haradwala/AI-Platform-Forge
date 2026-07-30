/**
 * runtime-execution-manager.ts — Phase 24 Runtime Execution Manager
 *
 * Primary Orchestrator for runtime execution.
 * Does NOT own runtimes or register adapters. Delegates discovery to RuntimeDiscoveryEngine,
 * process management to ExternalRuntimeManager/CLIManager, PTY terminal binding to TerminalService,
 * event emission to RuntimeEventBus, and persistence to ISessionStorage.
 */
import { RuntimeEventBus } from './runtime-event-bus';
import { ISessionStorage, RuntimeSessionData, RuntimeNegotiatedCapabilities } from './runtime-session-storage';
import type { RuntimeManager } from './runtime-manager';
import type { ExternalRuntimeManager } from '../external/external-runtime-manager';
import type { CLIManager } from '../cli/cli-manager';
import type { AdapterRegistry } from '../cli/sdk/adapter-registry';
import type { ITerminalService } from '../../container/service-interfaces';
export interface LaunchSessionOptions {
    runtimeId: string;
    workspaceRoot?: string;
    initialPrompt?: string;
    customArgs?: string[];
    customEnv?: Record<string, string>;
}
export declare class RuntimeExecutionManager {
    private readonly eventBus;
    private readonly storage;
    private readonly runtimeManager?;
    private readonly externalRuntimeManager?;
    private readonly cliManager?;
    private readonly adapterRegistry?;
    private readonly terminalService?;
    private activeSessions;
    constructor(eventBus: RuntimeEventBus, storage?: ISessionStorage, runtimeManager?: RuntimeManager | undefined, externalRuntimeManager?: ExternalRuntimeManager | undefined, cliManager?: CLIManager | undefined, adapterRegistry?: AdapterRegistry | undefined, terminalService?: ITerminalService | undefined);
    /**
     * Launch a new execution session for a runtime.
     * Performs capability negotiation handshake, binds PTY terminal, sets up state machine, and begins streaming.
     */
    launchSession(options: LaunchSessionOptions): Promise<RuntimeSessionData>;
    /**
     * Performs Capability Negotiation Handshake with runtime or adapter.
     */
    negotiateCapabilities(runtimeId: string): Promise<RuntimeNegotiatedCapabilities>;
    /**
     * Executes a stream prompt within an active session.
     */
    executeStreamPrompt(sessionId: string, prompt: string): Promise<void>;
    /**
     * Responds to a pending runtime approval request (Approve / Reject / Cancel).
     */
    respondApproval(sessionId: string, approvalId: string, decision: 'approve' | 'reject' | 'cancel'): Promise<void>;
    /**
     * Stops an active session cleanly.
     */
    stopSession(sessionId: string): Promise<void>;
    /**
     * Restarts a session.
     */
    restartSession(sessionId: string): Promise<RuntimeSessionData>;
    getSession(sessionId: string): RuntimeSessionData | null;
    getAllSessions(): Promise<RuntimeSessionData[]>;
    private emitEvent;
}
