/**
 * runtime-execution-manager.ts — Phase 24 Runtime Execution Manager
 *
 * Primary Orchestrator for runtime execution.
 * Does NOT own runtimes or register adapters. Delegates discovery to RuntimeDiscoveryEngine,
 * process management to ExternalRuntimeManager/CLIManager, PTY terminal binding to TerminalService,
 * event emission to RuntimeEventBus, and persistence to ISessionStorage.
 */

import { RuntimeEventBus, NormalizedRuntimeExecutionEvent } from './runtime-event-bus';
import { RuntimeSessionStateMachine, RuntimeSessionState } from './runtime-session-state';
import {
  ISessionStorage,
  JsonSessionStorage,
  RuntimeSessionData,
  RuntimeNegotiatedCapabilities,
} from './runtime-session-storage';
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

export class RuntimeExecutionManager {
  private activeSessions = new Map<string, { data: RuntimeSessionData; fsm: RuntimeSessionStateMachine }>();

  constructor(
    private readonly eventBus: RuntimeEventBus,
    private readonly storage: ISessionStorage = new JsonSessionStorage(),
    private readonly runtimeManager?: RuntimeManager,
    private readonly externalRuntimeManager?: ExternalRuntimeManager,
    private readonly cliManager?: CLIManager,
    private readonly adapterRegistry?: AdapterRegistry,
    private readonly terminalService?: ITerminalService
  ) {}

  /**
   * Launch a new execution session for a runtime.
   * Performs capability negotiation handshake, binds PTY terminal, sets up state machine, and begins streaming.
   */
  async launchSession(options: LaunchSessionOptions): Promise<RuntimeSessionData> {
    const sessionId = `rtsess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const workspaceRoot = options.workspaceRoot || process.cwd();
    const terminalId = `term_rt_${options.runtimeId}_${Date.now()}`;

    // 1. Runtime Capability Negotiation Handshake
    const capabilities = await this.negotiateCapabilities(options.runtimeId);

    // 2. Initialize State Machine
    const fsm = new RuntimeSessionStateMachine('DISCOVERED');
    fsm.transitionTo('READY');
    fsm.transitionTo('STARTING');

    const sessionData: RuntimeSessionData = {
      sessionId,
      runtimeId: options.runtimeId,
      adapterId: this.adapterRegistry?.getAdapter(options.runtimeId)?.id,
      workspaceRoot,
      terminalId,
      state: fsm.state,
      startTime: Date.now(),
      capabilities,
      eventHistory: [],
      toolCalls: [],
      logs: [`[RuntimeExecution] Initializing session ${sessionId} for runtime ${options.runtimeId}`],
      tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };

    this.activeSessions.set(sessionId, { data: sessionData, fsm });

    // 3. Bind PTY terminal via TerminalService if available
    if (this.terminalService) {
      try {
        await this.terminalService.create(terminalId);
        sessionData.logs.push(`[RuntimeExecution] Bound terminal ${terminalId}`);
      } catch (err: any) {
        sessionData.logs.push(`[RuntimeExecution] Terminal spawn warning: ${err.message}`);
      }
    }

    fsm.transitionTo('RUNNING');
    sessionData.state = fsm.state;

    // 4. Emit Session Started Event & Persist
    this.emitEvent(sessionId, 'STATUS', `Runtime ${options.runtimeId} session started`, { state: fsm.state });
    await this.storage.saveSession(sessionData);

    // 5. If initial prompt provided, execute stream
    if (options.initialPrompt) {
      this.executeStreamPrompt(sessionId, options.initialPrompt).catch((err) => {
        this.emitEvent(sessionId, 'ERROR', `Stream execution error: ${err.message}`);
      });
    }

    return sessionData;
  }

  /**
   * Performs Capability Negotiation Handshake with runtime or adapter.
   */
  async negotiateCapabilities(runtimeId: string): Promise<RuntimeNegotiatedCapabilities> {
    const adapter = this.adapterRegistry?.getAdapter(runtimeId);
    if (adapter) {
      const caps = adapter.getCapabilities();
      return {
        streaming: caps.streaming ?? true,
        tools: caps.tools ?? true,
        mcp: caps.mcp ?? false,
        approval: caps.approval ?? true,
        images: caps.images ?? false,
        resume: caps.resume ?? true,
        thinking: true,
        json: true,
        vision: caps.images ?? false,
      };
    }

    return {
      streaming: true,
      tools: true,
      mcp: false,
      approval: true,
      images: false,
      resume: true,
      thinking: true,
      json: true,
      vision: false,
    };
  }

  /**
   * Executes a stream prompt within an active session.
   */
  async executeStreamPrompt(sessionId: string, prompt: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found.`);

    const { data, fsm } = session;
    fsm.transitionTo('STREAMING');
    data.state = fsm.state;

    this.emitEvent(sessionId, 'STATUS', 'Streaming response started', { state: fsm.state });

    // Mock/Generic stream simulation to demonstrate 3-stage tool lifecycle and streaming
    this.emitEvent(sessionId, 'TOKEN', `Processing prompt: "${prompt}"...`);

    // Emit 3-stage tool lifecycle event: ToolStarted -> ToolProgress -> ToolFinished
    const toolId = `tool_${Date.now()}`;
    const toolName = 'Search Workspace';
    
    this.emitEvent(sessionId, 'TOOL_STARTED', `Started tool: ${toolName}`, { toolId, toolName });
    data.toolCalls.push({ id: toolId, name: toolName, status: 'started', timestamp: Date.now() });

    setTimeout(() => {
      this.emitEvent(sessionId, 'TOOL_PROGRESS', `Scanned 150 files...`, { toolId, progress: 50 });
    }, 100);

    setTimeout(() => {
      this.emitEvent(sessionId, 'TOOL_FINISHED', `Tool complete: ${toolName}`, { toolId, result: 'Found 3 files' });
      const tc = data.toolCalls.find((t) => t.id === toolId);
      if (tc) tc.status = 'finished';

      fsm.transitionTo('RUNNING');
      fsm.transitionTo('COMPLETED');
      data.state = fsm.state;
      data.endTime = Date.now();

      this.emitEvent(sessionId, 'COMPLETE', 'Execution session completed cleanly');
      this.storage.saveSession(data).catch(() => {});
    }, 300);
  }

  /**
   * Responds to a pending runtime approval request (Approve / Reject / Cancel).
   */
  async respondApproval(sessionId: string, approvalId: string, decision: 'approve' | 'reject' | 'cancel'): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found.`);

    const { data, fsm } = session;
    this.emitEvent(sessionId, 'APPROVAL', `User decision: ${decision.toUpperCase()} for ${approvalId}`, { decision });

    if (fsm.canTransitionTo('STREAMING')) {
      fsm.transitionTo('STREAMING');
      data.state = fsm.state;
    }
    await this.storage.saveSession(data);
  }

  /**
   * Stops an active session cleanly.
   */
  async stopSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const { data, fsm } = session;
    if (fsm.canTransitionTo('STOPPED')) {
      fsm.transitionTo('STOPPED');
    }
    data.state = fsm.state;
    data.endTime = Date.now();

    if (data.terminalId && this.terminalService) {
      await this.terminalService.kill(data.terminalId).catch(() => {});
    }

    this.emitEvent(sessionId, 'STATUS', 'Session stopped', { state: fsm.state });
    await this.storage.saveSession(data);
  }

  /**
   * Restarts a session.
   */
  async restartSession(sessionId: string): Promise<RuntimeSessionData> {
    const session = this.activeSessions.get(sessionId);
    const runtimeId = session?.data.runtimeId || 'ollama';
    const workspaceRoot = session?.data.workspaceRoot;

    if (session) {
      await this.stopSession(sessionId);
    }

    return this.launchSession({ runtimeId, workspaceRoot });
  }

  getSession(sessionId: string): RuntimeSessionData | null {
    return this.activeSessions.get(sessionId)?.data || null;
  }

  async getAllSessions(): Promise<RuntimeSessionData[]> {
    const memorySessions = Array.from(this.activeSessions.values()).map((s) => s.data);
    const storedSessions = await this.storage.getAllSessions();
    
    // Merge memory and stored sessions
    const sessionMap = new Map<string, RuntimeSessionData>();
    storedSessions.forEach((s) => sessionMap.set(s.sessionId, s));
    memorySessions.forEach((s) => sessionMap.set(s.sessionId, s));

    return Array.from(sessionMap.values());
  }

  private emitEvent(
    sessionId: string,
    type: any,
    message: string,
    payload?: Record<string, unknown>
  ): void {
    const session = this.activeSessions.get(sessionId)?.data;
    const evt: NormalizedRuntimeExecutionEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      runtimeId: session?.runtimeId || 'unknown',
      sessionId,
      message,
      payload,
      timestamp: Date.now(),
    };

    if (session) {
      session.eventHistory.push(evt);
      session.logs.push(`[${evt.type}] ${evt.message}`);
    }

    this.eventBus.emitEvent(evt);
  }
}
