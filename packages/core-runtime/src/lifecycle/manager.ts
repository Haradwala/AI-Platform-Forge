import { ILifecycleManager, LifecycleState, LifecycleHook } from '../interfaces/lifecycle';
import { IEventBus } from '@forge/core';

export class LifecycleManager implements ILifecycleManager {
  private currentState: LifecycleState = LifecycleState.BOOTING;
  private hooks = new Map<LifecycleState, Set<LifecycleHook>>();
  private eventBus?: IEventBus;
  private stateTimestamps = new Map<LifecycleState, Date>();

  private static readonly ALLOWED_TRANSITIONS: Record<LifecycleState, Set<LifecycleState>> = {
    [LifecycleState.BOOTING]: new Set([LifecycleState.INITIALIZING, LifecycleState.FAILED]),
    [LifecycleState.INITIALIZING]: new Set([LifecycleState.STARTING, LifecycleState.FAILED]),
    [LifecycleState.STARTING]: new Set([LifecycleState.RUNNING, LifecycleState.FAILED]),
    [LifecycleState.RUNNING]: new Set([LifecycleState.STOPPING, LifecycleState.FAILED]),
    [LifecycleState.STOPPING]: new Set([LifecycleState.DISPOSING, LifecycleState.FAILED]),
    [LifecycleState.DISPOSING]: new Set([LifecycleState.STOPPED, LifecycleState.FAILED]),
    [LifecycleState.STOPPED]: new Set([]),
    [LifecycleState.FAILED]: new Set([LifecycleState.STOPPING, LifecycleState.DISPOSING, LifecycleState.STOPPED]),
  };

  constructor() {
    this.stateTimestamps.set(LifecycleState.BOOTING, new Date());
  }

  setEventBus(eventBus: IEventBus): void {
    this.eventBus = eventBus;
  }

  getState(): LifecycleState {
    return this.currentState;
  }

  onTransition(state: LifecycleState, hook: LifecycleHook): void {
    if (!this.hooks.has(state)) {
      this.hooks.set(state, new Set());
    }
    this.hooks.get(state)!.add(hook);
  }

  async transitionTo(state: LifecycleState): Promise<void> {
    const allowed = LifecycleManager.ALLOWED_TRANSITIONS[this.currentState];
    if (!allowed || !allowed.has(state)) {
      throw new Error(`LifecycleManager: Invalid state transition from ${this.currentState} to ${state}`);
    }

    this.currentState = state;
    const now = new Date();
    this.stateTimestamps.set(state, now);

    const stateHooks = this.hooks.get(state);
    if (stateHooks) {
      for (const hook of stateHooks) {
        await hook();
      }
    }

    if (this.eventBus) {
      this.publishLifecycleEvent(state, now);
    }
  }

  private publishLifecycleEvent(state: LifecycleState, timestamp: Date): void {
    if (!this.eventBus) return;

    const startTimestamp = this.stateTimestamps.get(LifecycleState.BOOTING) || timestamp;
    const durationMs = timestamp.getTime() - startTimestamp.getTime();

    switch (state) {
      case LifecycleState.INITIALIZING:
        this.eventBus.publish('forge.initialized', { timestamp, durationMs });
        break;
      case LifecycleState.RUNNING:
        this.eventBus.publish('forge.ready', { timestamp, durationMs });
        break;
      case LifecycleState.STOPPING:
        this.eventBus.publish('forge.stopping', { timestamp });
        break;
      case LifecycleState.STOPPED:
        this.eventBus.publish('forge.stopped', { timestamp, durationMs });
        break;
    }
  }
}
