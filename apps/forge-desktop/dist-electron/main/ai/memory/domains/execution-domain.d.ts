/**
 * execution-domain.ts
 *
 * Execution Domain Store — pure event store for ExecutionEvents.
 * Implements an immutable timeline of tool, file, and system execution events.
 * Contains no AI entity extraction logic (delegated to ExecutionEntityExtractor).
 */
import type { ExecutionEvent, ExecutionEventType } from '../events/execution-event';
export interface IExecutionDomain {
    emitEvent<T = Record<string, unknown>>(event: ExecutionEvent<T>): void;
    getEvents(filter?: {
        turnId?: string;
        type?: ExecutionEventType;
    }): readonly ExecutionEvent[];
    getLatestEvent(type?: ExecutionEventType): ExecutionEvent | undefined;
    clear(): void;
}
export declare class ExecutionDomain implements IExecutionDomain {
    private readonly events;
    emitEvent<T = Record<string, unknown>>(event: ExecutionEvent<T>): void;
    getEvents(filter?: {
        turnId?: string;
        type?: ExecutionEventType;
    }): readonly ExecutionEvent[];
    getLatestEvent(type?: ExecutionEventType): ExecutionEvent | undefined;
    clear(): void;
}
