/**
 * runtime-events.ts — Phase 23 Runtime Discovery Event Bus
 */

import { EventEmitter } from 'events';

export type RuntimeDiscoveryEventType =
  | 'discovery:started'
  | 'discovery:completed'
  | 'runtime:detected'
  | 'runtime:status-changed'
  | 'runtime:health-changed'
  | 'environment:changed';

export class RuntimeEvents extends EventEmitter {
  emitStarted(): void {
    this.emit('discovery:started');
  }

  emitCompleted(runtimes: unknown[]): void {
    this.emit('discovery:completed', runtimes);
  }

  emitDetected(runtime: unknown): void {
    this.emit('runtime:detected', runtime);
  }

  emitStatusChanged(runtimeId: string, status: string): void {
    this.emit('runtime:status-changed', { runtimeId, status });
  }

  emitHealthChanged(runtimeId: string, health: string): void {
    this.emit('runtime:health-changed', { runtimeId, health });
  }

  emitEnvironmentChanged(diagnostics: unknown): void {
    this.emit('environment:changed', diagnostics);
  }
}
