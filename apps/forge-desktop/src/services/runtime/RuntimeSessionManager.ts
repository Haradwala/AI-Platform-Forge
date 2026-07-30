import type {
  RuntimeSessionEntry,
  NormalizedRuntimeEvent,
  NormalizedRuntimeEventType,
} from '../../types/runtime-workspace';
import { runtimeTelemetry } from './RuntimeTelemetry';

class SimpleEventEmitter {
  private listeners: Record<string, Function[]> = {};

  on(event: string, fn: Function): this {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
    return this;
  }

  off(event: string, fn: Function): this {
    if (!this.listeners[event]) return this;
    this.listeners[event] = this.listeners[event].filter((l) => l !== fn);
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    if (!this.listeners[event]) return false;
    this.listeners[event].forEach((fn) => {
      try {
        fn(...args);
      } catch (err) {
        console.error(`[EventEmitter] Listener error on event "${event}":`, err);
      }
    });
    return true;
  }
}

export class RuntimeSessionManager extends SimpleEventEmitter {
  private sessions = new Map<string, RuntimeSessionEntry>();
  private terminalBindings = new Map<string, string>(); // runtimeSessionId -> terminalSessionId

  /**
   * Creates or restores a runtime session with an associated Terminal Hub session.
   */
  async createSession(runtimeId: string, workspaceRoot?: string): Promise<RuntimeSessionEntry> {
    const sessionId = `rtsess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const root = workspaceRoot || '';
    const terminalSessionId = `term_rt_${runtimeId}_${Date.now()}`;

    const session: RuntimeSessionEntry = {
      sessionId,
      runtimeId,
      workspaceRoot: root,
      terminalSessionId,
      startTime: Date.now(),
      status: 'running',
      capabilities: { streaming: true, tools: true, mcp: false, approval: true },
      eventHistory: [],
      toolCalls: [],
      logs: [`[RuntimeSession] Initialized session ${sessionId} for runtime ${runtimeId}`],
      tokens: 0,
    };

    this.sessions.set(sessionId, session);
    this.terminalBindings.set(sessionId, terminalSessionId);
    runtimeTelemetry.startTracking(runtimeId);

    // Bind terminal session via window.forge.terminal if available
    if (typeof window !== 'undefined' && window.forge?.terminal) {
      try {
        await window.forge.terminal.create(terminalSessionId);
      } catch (err) {
        console.warn(`[RuntimeSessionManager] Terminal creation fallback for ${terminalSessionId}:`, err);
      }
    }

    this.emitEvent('SESSION_STARTED', runtimeId, sessionId, `Session started for runtime ${runtimeId}`);
    return session;
  }

  async stopSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.status = 'stopped';
    const termId = this.terminalBindings.get(sessionId);
    if (termId && typeof window !== 'undefined' && window.forge?.terminal) {
      try {
        await window.forge.terminal.kill(termId);
      } catch {
        // Ignored on cleanup
      }
    }

    this.terminalBindings.delete(sessionId);
    runtimeTelemetry.stopTracking(session.runtimeId);
    this.emitEvent('SESSION_ENDED', session.runtimeId, sessionId, `Session ended for runtime ${session.runtimeId}`);
  }

  async restartSession(sessionId: string): Promise<RuntimeSessionEntry> {
    const session = this.sessions.get(sessionId);
    const runtimeId = session?.runtimeId || 'unknown';
    const ws = session?.workspaceRoot || '';

    await this.stopSession(sessionId);
    return this.createSession(runtimeId, ws);
  }

  getSession(sessionId: string): RuntimeSessionEntry | undefined {
    return this.sessions.get(sessionId);
  }

  getSessionsForRuntime(runtimeId: string): RuntimeSessionEntry[] {
    return Array.from(this.sessions.values()).filter((s) => s.runtimeId === runtimeId);
  }

  getAllSessions(): RuntimeSessionEntry[] {
    return Array.from(this.sessions.values());
  }

  getTerminalBinding(sessionId: string): string | undefined {
    return this.terminalBindings.get(sessionId);
  }

  appendLog(sessionId: string, text: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.logs.push(`[${new Date().toLocaleTimeString()}] ${text}`);
      if (session.logs.length > 500) session.logs.shift();
      this.emitEvent('LOG', session.runtimeId, sessionId, text);
    }
  }

  recordTokens(sessionId: string, count: number): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.tokens += count;
      runtimeTelemetry.recordTokens(session.runtimeId, count);
      this.emitEvent('TOKEN', session.runtimeId, sessionId, `Tokens used: +${count}`);
    }
  }

  emitEvent(
    type: NormalizedRuntimeEventType,
    runtimeId: string,
    sessionId?: string,
    message: string = '',
    payload?: Record<string, unknown>
  ): void {
    const event: NormalizedRuntimeEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      runtimeId,
      sessionId,
      message,
      payload,
      timestamp: Date.now(),
    };

    this.emit('runtime-event', event);
    this.emit(type, event);

    // Also forward through desktop EventBus if in Electron window context
    if (typeof window !== 'undefined' && window.forge) {
      try {
        window.forge.invoke('ai:event' as any, { event });
      } catch {
        // Non-blocking IPC fallback
      }
    }
  }
}

export const runtimeSessionManager = new RuntimeSessionManager();
