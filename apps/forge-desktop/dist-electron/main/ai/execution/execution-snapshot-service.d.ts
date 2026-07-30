import type { ExecutionEvent } from './execution-events';
export interface IExecutionCheckpoint {
    readonly checkpointId: string;
    readonly timestamp: string;
    readonly planId: string;
    readonly events: ExecutionEvent[];
    readonly workspaceMetadata: Record<string, any>;
}
export declare class ExecutionSnapshotService {
    private readonly checkpoints;
    saveCheckpoint(checkpointId: string, planId: string, events: ExecutionEvent[], workspaceRoot: string | null): IExecutionCheckpoint;
    restoreCheckpoint(checkpointId: string): IExecutionCheckpoint | null;
    replayExecution(checkpointId: string): ExecutionEvent[];
    clear(): void;
}
