/**
 * runtime-event-bus.ts — Phase 24 Runtime Execution Event Bus
 *
 * Decoupled event bus for runtime execution events.
 * Listened to by IPC adapters, WebSockets, or CLI handlers without coupling
 * execution logic directly to Electron IPC.
 */
import { EventEmitter } from 'events';
export type NormalizedRuntimeEventType = 'STATUS' | 'MESSAGE' | 'TOKEN' | 'PROGRESS' | 'TOOL_STARTED' | 'TOOL_PROGRESS' | 'TOOL_FINISHED' | 'APPROVAL' | 'WARNING' | 'ERROR' | 'LOG' | 'COMPLETE';
export interface NormalizedRuntimeExecutionEvent {
    id: string;
    type: NormalizedRuntimeEventType;
    runtimeId: string;
    sessionId: string;
    message: string;
    payload?: Record<string, unknown>;
    timestamp: number;
}
export declare class RuntimeEventBus extends EventEmitter {
    emitEvent(evt: NormalizedRuntimeExecutionEvent): void;
    onRuntimeEvent(listener: (evt: NormalizedRuntimeExecutionEvent) => void): () => void;
    onSessionEvent(sessionId: string, listener: (evt: NormalizedRuntimeExecutionEvent) => void): () => void;
}
