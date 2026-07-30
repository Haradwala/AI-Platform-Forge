import { describe, it, expect, vi } from 'vitest';
import { RuntimeKernel } from '../electron/main/platform/runtime-kernel';
import { IRuntimeService } from '../electron/main/platform/runtime-service';

class MockService implements IRuntimeService {
  constructor(
    readonly id: string,
    readonly dependencies: string[] = []
  ) {}
  readonly version = '1.0.0';
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';
  
  startCalled = false;
  runningCalled = false;
  suspendCalled = false;
  shutdownCalled = false;

  uptime(): number { return 100; }
  metrics(): Record<string, any> { return { dummy: true }; }
  
  onStart(): void { this.startCalled = true; }
  onRunning(): void { this.runningCalled = true; }
  onSuspend(): void { this.suspendCalled = true; }
  onShutdown(): void { this.shutdownCalled = true; }
}

describe('RuntimeKernel & RuntimeRegistry', () => {
  it('registers and boots services in topological order', async () => {
    const kernel = new RuntimeKernel();
    
    // Service B depends on Service A
    const serviceA = new MockService('ServiceA', []);
    const serviceB = new MockService('ServiceB', ['ServiceA']);
    
    kernel.register(serviceB);
    kernel.register(serviceA);
    
    expect(kernel.getServices()).toHaveLength(2);
    
    await kernel.start();
    
    expect(serviceA.startCalled).toBe(true);
    expect(serviceA.runningCalled).toBe(true);
    expect(serviceB.startCalled).toBe(true);
    expect(serviceB.runningCalled).toBe(true);
    
    const diagnostics = kernel.diagnostics();
    expect(diagnostics.started).toBe(true);
    expect(diagnostics.services).toHaveLength(2);
    
    await kernel.stop();
    expect(serviceA.suspendCalled).toBe(true);
    expect(serviceB.suspendCalled).toBe(true);
  });
});
