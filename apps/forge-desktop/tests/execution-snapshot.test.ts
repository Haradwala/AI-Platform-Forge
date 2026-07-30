import { describe, it, expect } from 'vitest';
import { ExecutionSnapshotService } from '../electron/main/ai/execution/execution-snapshot-service';

describe('ExecutionSnapshotService', () => {
  it('saves checkpoints and recovers events successfully', () => {
    const service = new ExecutionSnapshotService();
    const event = {
      eventId: 'evt-1',
      type: 'execution:queued' as const,
      executionId: 'exec-1',
      timestamp: new Date().toISOString(),
      planId: 'plan-1',
    };

    service.saveCheckpoint('cp-1', 'plan-1', [event], '/root');
    const checkpoint = service.restoreCheckpoint('cp-1');
    expect(checkpoint).not.toBeNull();
    expect(checkpoint?.planId).toBe('plan-1');
    expect(checkpoint?.events.length).toBe(1);
    expect(checkpoint?.events[0]).toEqual(event);

    const replayed = service.replayExecution('cp-1');
    expect(replayed).toEqual([event]);
  });
});
