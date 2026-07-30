import type { ExecutionEvent } from './execution-events';

export interface IExecutionCheckpoint {
  readonly checkpointId: string;
  readonly timestamp: string;
  readonly planId: string;
  readonly events: ExecutionEvent[];
  readonly workspaceMetadata: Record<string, any>;
}

export class ExecutionSnapshotService {
  private readonly checkpoints = new Map<string, IExecutionCheckpoint>();

  saveCheckpoint(
    checkpointId: string,
    planId: string,
    events: ExecutionEvent[],
    workspaceRoot: string | null
  ): IExecutionCheckpoint {
    const checkpoint: IExecutionCheckpoint = {
      checkpointId,
      timestamp: new Date().toISOString(),
      planId,
      events: [...events],
      workspaceMetadata: {
        workspaceRoot,
        savedTime: Date.now(),
      },
    };
    this.checkpoints.set(checkpointId, checkpoint);
    return checkpoint;
  }

  restoreCheckpoint(checkpointId: string): IExecutionCheckpoint | null {
    return this.checkpoints.get(checkpointId) || null;
  }

  replayExecution(checkpointId: string): ExecutionEvent[] {
    const cp = this.restoreCheckpoint(checkpointId);
    return cp ? cp.events : [];
  }

  clear(): void {
    this.checkpoints.clear();
  }
}
