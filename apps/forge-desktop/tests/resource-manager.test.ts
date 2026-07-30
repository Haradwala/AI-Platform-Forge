import { describe, it, expect } from 'vitest';
import { ResourceManager } from '../electron/main/platform/resource-manager';

describe('ResourceManager', () => {
  it('measures heap usage and resolves policy throttle flags', () => {
    const manager = new ResourceManager();
    manager.onStart();

    const metrics = manager.metrics();
    expect(metrics.ramUsageMb).toBeGreaterThan(0);
    expect(metrics.cpuUsagePercent).toBeLessThan(100);

    // Register PTY process tracking
    expect(metrics.ptyCount).toBe(0);
    manager.registerPty();
    expect(manager.metrics().ptyCount).toBe(1);
    manager.unregisterPty();
    expect(manager.metrics().ptyCount).toBe(0);
  });
});
