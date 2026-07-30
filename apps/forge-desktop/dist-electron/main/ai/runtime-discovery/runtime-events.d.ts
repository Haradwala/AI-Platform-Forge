/**
 * runtime-events.ts — Phase 23 Runtime Discovery Event Bus
 */
import { EventEmitter } from 'events';
export type RuntimeDiscoveryEventType = 'discovery:started' | 'discovery:completed' | 'runtime:detected' | 'runtime:status-changed' | 'runtime:health-changed' | 'environment:changed';
export declare class RuntimeEvents extends EventEmitter {
    emitStarted(): void;
    emitCompleted(runtimes: unknown[]): void;
    emitDetected(runtime: unknown): void;
    emitStatusChanged(runtimeId: string, status: string): void;
    emitHealthChanged(runtimeId: string, health: string): void;
    emitEnvironmentChanged(diagnostics: unknown): void;
}
