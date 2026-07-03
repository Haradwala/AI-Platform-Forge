export enum LifecycleState {
  BOOTING = 'BOOTING',
  INITIALIZING = 'INITIALIZING',
  STARTING = 'STARTING',
  RUNNING = 'RUNNING',
  STOPPING = 'STOPPING',
  DISPOSING = 'DISPOSING',
  STOPPED = 'STOPPED',
  FAILED = 'FAILED',
}

export type LifecycleHook = () => void | Promise<void>;

export interface ILifecycleManager {
  getState(): LifecycleState;
  transitionTo(state: LifecycleState): Promise<void>;
  onTransition(state: LifecycleState, hook: LifecycleHook): void;
}
