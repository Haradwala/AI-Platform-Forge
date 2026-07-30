import type { ExecutionEvent } from './execution-events';
export type ExecutionObserverCallback = (event: ExecutionEvent) => void;
export declare class ExecutionObserver {
    private readonly callbacks;
    subscribe(callback: ExecutionObserverCallback): () => void;
    notify(event: ExecutionEvent): void;
    clear(): void;
}
