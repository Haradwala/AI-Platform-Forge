import { IRuntimeService } from './runtime-service';

export type RuntimeState =
  | 'Boot'
  | 'PreInitialize'
  | 'Initialize'
  | 'LoadConfiguration'
  | 'LoadWorkspace'
  | 'WorkspaceReady'
  | 'Running'
  | 'Suspended'
  | 'ShuttingDown'
  | 'Stopped';

export class LifecycleManager implements IRuntimeService {
  readonly id = 'LifecycleManager';
  readonly version = '1.0.0';
  readonly dependencies = [];
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';

  private currentState: RuntimeState = 'Boot';
  private readonly listeners = new Map<RuntimeState, Set<() => Promise<void> | void>>();
  private readonly startTime = Date.now();

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      currentState: this.currentState,
      uptimeMs: this.uptime(),
    };
  }

  onStart(): void {
    this.transition('PreInitialize');
  }

  onRunning(): void {
    this.transition('Initialize');
  }

  onSuspend(): void {
    this.transition('Suspended');
  }

  onShutdown(): void {
    this.transition('Stopped');
  }

  getCurrentState(): RuntimeState {
    return this.currentState;
  }

  onState(state: RuntimeState, callback: () => Promise<void> | void): () => void {
    if (!this.listeners.has(state)) {
      this.listeners.set(state, new Set());
    }
    this.listeners.get(state)!.add(callback);
    return () => {
      this.listeners.get(state)?.delete(callback);
    };
  }

  async transition(nextState: RuntimeState): Promise<void> {
    this.currentState = nextState;
    const callbacks = this.listeners.get(nextState);
    if (callbacks) {
      for (const cb of callbacks) {
        try {
          await cb();
        } catch (err) {
          this.health = 'degraded';
        }
      }
    }
  }
}
