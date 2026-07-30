import type { IAiSessionService, IAiSession, IProviderRegistry, IDesktopLogger } from '../../container/service-interfaces';
import { IRuntimeService } from '../../platform/runtime-service';

export type ConversationState =
  | 'Idle'
  | 'CollectingContext'
  | 'Thinking'
  | 'Planning'
  | 'Executing'
  | 'Waiting'
  | 'Completed'
  | 'Cancelled'
  | 'Failed';

export interface IAiSessionInfo extends IAiSession {
  workspacePath: string | null;
  state: ConversationState;
}

export class AiSessionService implements IAiSessionService, IRuntimeService {
  readonly id = 'AiSessionService';
  readonly version = '2.0.0';
  readonly dependencies = [];
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';

  private readonly sessions = new Map<string, IAiSessionInfo>();
  private activeSessionId: string | null = null;
  private readonly startTime = Date.now();

  constructor(
    private readonly providerRegistry: IProviderRegistry,
    private readonly logger: IDesktopLogger
  ) {}

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      activeSessionsCount: this.sessions.size,
      activeSessionId: this.activeSessionId,
    };
  }

  onStart(): void {
    this.status = 'running';
  }
  onRunning(): void {}
  onSuspend(): void {}
  onShutdown(): void {
    this.sessions.clear();
    this.activeSessionId = null;
  }

  createSession(): IAiSessionInfo {
    const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const session: IAiSessionInfo = {
      id,
      activeProviderId: 'mock',
      activeModelId: 'mock-general-v1',
      isStreaming: false,
      abortController: null,
      workspacePath: null,
      state: 'Idle',
    };
    this.sessions.set(id, session);
    this.activeSessionId = id;
    this.logger.info(`[AiSessionService] Created session: ${id}`);
    return session;
  }

  getSession(id: string): IAiSessionInfo | null {
    return this.sessions.get(id) || null;
  }

  getActiveSession(): IAiSessionInfo | null {
    if (!this.activeSessionId) {
      return this.createSession();
    }
    return this.sessions.get(this.activeSessionId) || null;
  }

  setActiveSession(session: IAiSession | null): void {
    if (session) {
      const existing = this.sessions.get(session.id);
      const updated: IAiSessionInfo = {
        ...session,
        workspacePath: existing?.workspacePath || null,
        state: existing?.state || 'Idle',
      };
      this.sessions.set(session.id, updated);
      this.activeSessionId = session.id;
    } else {
      this.activeSessionId = null;
    }
  }

  setProvider(id: string): void {
    const s = this.getActiveSession();
    if (s) {
      s.activeProviderId = id;
      const prov = this.providerRegistry.getById(id);
      if (prov) {
        prov.listAvailableModels().then(models => {
          if (models.length > 0) {
            s.activeModelId = models[0];
          }
        }).catch(err => {
          this.logger.warn(`[AiSessionService] Failed to fetch active models for provider switch ${id}: ${err}`);
        });
      }
    }
  }

  setModel(id: string): void {
    const s = this.getActiveSession();
    if (s) {
      s.activeModelId = id;
    }
  }

  updateSessionState(id: string, state: ConversationState): void {
    const s = this.sessions.get(id);
    if (s) {
      s.state = state;
    }
  }
}
export type { IAiSessionService };
