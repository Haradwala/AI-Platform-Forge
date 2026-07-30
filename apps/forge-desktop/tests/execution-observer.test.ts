import { describe, it, expect, vi } from 'vitest';
import { ExecutionObserver } from '../electron/main/ai/execution/execution-observer';
import type { ExecutionEvent } from '../electron/main/ai/execution/execution-events';

describe('ExecutionObserver', () => {
  it('notifies subscribers of published events', () => {
    const observer = new ExecutionObserver();
    const callback = vi.fn();
    
    const unsubscribe = observer.subscribe(callback);
    const event: ExecutionEvent = {
      eventId: 'evt-1',
      type: 'execution:paused',
      executionId: 'exec-1',
      timestamp: new Date().toISOString(),
    };

    observer.notify(event);
    expect(callback).toHaveBeenCalledWith(event);

    unsubscribe();
    observer.notify(event);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
