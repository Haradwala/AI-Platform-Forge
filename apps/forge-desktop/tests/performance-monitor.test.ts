import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DesktopContainer } from '../electron/main/container/desktop-container';
import { CoreModule } from '../electron/main/modules/core.module';
import { PerformanceModule } from '../electron/main/modules/performance.module';
import { T } from '../electron/main/container/tokens';
import { IPerformanceMonitor, IDesktopLogger } from '../electron/main/container/service-interfaces';

describe('PerformanceMonitor', () => {
  let container: DesktopContainer;
  let service: IPerformanceMonitor;
  let mockLogger: IDesktopLogger;

  beforeEach(async () => {
    container = new DesktopContainer({ environment: 'test' });
    container.loadModule(new CoreModule());
    container.loadModule(new PerformanceModule());

    await container.initializeAll();
    service = container.resolve<IPerformanceMonitor>(T.IPerformanceMonitor);
    mockLogger = container.resolve<IDesktopLogger>(T.IDesktopLogger);
    vi.spyOn(mockLogger, 'warn').mockImplementation(() => {});
  });

  it('records latencies and computes 95th percentile metrics', () => {
    // Record times: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
    for (let i = 1; i <= 10; i++) {
      service.record('query', i * 10);
    }

    const snap = service.snapshot();
    // 95th index of 10 items is index 9 (sorted: 10, 20, ..., 100) -> 100
    expect(snap['query']).toBe(100);
  });

  it('warns on logger when latency exceeds 100ms threshold', () => {
    service.record('heavy-op', 150);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('High latency detected on channel "heavy-op": 150ms')
    );
  });

  it('ignores negative latencies', () => {
    service.record('bad-op', -50);
    const snap = service.snapshot();
    expect(snap['bad-op']).toBeUndefined();
  });

  it('clears all recorded snapshots upon reset()', () => {
    service.record('op', 50);
    service.reset();
    expect(service.snapshot()).toEqual({});
  });
});
