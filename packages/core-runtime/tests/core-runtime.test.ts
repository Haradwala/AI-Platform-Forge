import { describe, it, expect } from 'vitest';
import {
  BootstrapEngine,
  LifecycleState,
  ServiceRegistry,
  HealthManager,
  RetryPolicy,
  IForgeModule
} from '../src/index';

describe('Forge Core-Runtime Subsystem', () => {
  describe('ModuleLoader DAG & Dependency Sorting', () => {
    it('should resolve modules execution order topologically', async () => {
      const engine = new BootstrapEngine();
      const executionOrder: string[] = [];

      const moduleA: IForgeModule = {
        name: 'moduleA',
        version: '1.0.0',
        dependencies: ['moduleB', 'moduleC'],
        start: async () => { executionOrder.push('A'); }
      };

      const moduleB: IForgeModule = {
        name: 'moduleB',
        version: '1.0.0',
        dependencies: ['moduleC'],
        start: async () => { executionOrder.push('B'); }
      };

      const moduleC: IForgeModule = {
        name: 'moduleC',
        version: '1.0.0',
        dependencies: [],
        start: async () => { executionOrder.push('C'); }
      };

      engine.registerModule(moduleA);
      engine.registerModule(moduleB);
      engine.registerModule(moduleC);

      await engine.bootstrap({ WORKSPACE_ROOT: '/mock/root' });

      expect(executionOrder).toEqual(['C', 'B', 'A']);
    });

    it('should throw Error when cycles are detected', async () => {
      const engine = new BootstrapEngine();

      const moduleA: IForgeModule = {
        name: 'moduleA',
        version: '1.0.0',
        dependencies: ['moduleB']
      };

      const moduleB: IForgeModule = {
        name: 'moduleB',
        version: '1.0.0',
        dependencies: ['moduleA']
      };

      engine.registerModule(moduleA);
      engine.registerModule(moduleB);

      await expect(engine.bootstrap({ WORKSPACE_ROOT: '/mock/root' })).rejects.toThrow();
    });
  });

  describe('Lifecycle State Machine', () => {
    it('should prevent illegal state transitions', async () => {
      const engine = new BootstrapEngine();
      const context = await engine.bootstrap({ WORKSPACE_ROOT: '/mock/root' });
      const lifecycle = context.lifecycle;

      expect(lifecycle.getState()).toBe(LifecycleState.RUNNING);

      await expect(lifecycle.transitionTo(LifecycleState.INITIALIZING)).rejects.toThrow();
    });
  });

  describe('Service Registry Concurrency', () => {
    it('should resolve lazy instantiations to singleton cached instances safely', async () => {
      const registry = new ServiceRegistry();
      let initCount = 0;

      const lazyService = () => ({
        name: 'lazy',
        initialize: async () => {
          initCount++;
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      });

      registry.register('lazyService', lazyService, true);

      const [res1, res2] = await Promise.all([
        registry.resolve<any>('lazyService'),
        registry.resolve<any>('lazyService')
      ]);

      expect(res1).toBe(res2);
      expect(initCount).toBe(1);
    });
  });

  describe('Health Manager Status Compiler', () => {
    it('should aggregate statuses correctly', () => {
      const health = new HealthManager();
      
      health.reportHealth('serviceA', 'healthy');
      expect(health.getAggregateHealth()).toBe('healthy');

      health.reportHealth('serviceB', 'degraded');
      expect(health.getAggregateHealth()).toBe('degraded');

      health.reportHealth('serviceC', 'failed');
      expect(health.getAggregateHealth()).toBe('failed');
    });
  });

  describe('Retry Policy backoffs', () => {
    it('should execute retry logic and throw if max attempts are exhausted', async () => {
      const policy = new RetryPolicy(3, 5);
      let attempts = 0;

      const failingOp = async () => {
        attempts++;
        throw new Error('Database disconnected');
      };

      await expect(policy.execute(failingOp)).rejects.toThrow('Database disconnected');
      expect(attempts).toBe(3);
    });
  });
});
