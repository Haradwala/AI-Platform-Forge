import { describe, it, expect } from 'vitest';
import { Logger } from '../src/logging/logger';
import { ConfigService } from '../src/config/loader';
import { DIContainer } from '../src/di/container';
import { EventBus } from '../src/eventbus/eventbus';
import { Workspace, WorkspaceStatus } from '@forge/shared';

describe('Forge Core Services', () => {
  describe('Logger Service', () => {
    it('should successfully log messages without crashing', () => {
      const logger = new Logger();
      expect(() => logger.info('Test info message')).not.toThrow();
      expect(() => logger.debug('Test debug message')).not.toThrow();
      expect(() => logger.error('Test error message', new Error('Fail'))).not.toThrow();
    });

    it('should support creating child loggers', () => {
      const logger = new Logger();
      const child = logger.child({ subsystem: 'test' });
      expect(child).toBeDefined();
      expect(() => child.info('Child info message')).not.toThrow();
    });
  });

  describe('Config Service', () => {
    it('should load default configurations with correct overrides', () => {
      const config = new ConfigService({
        WORKSPACE_ROOT: '/test/workspace',
        PORT: 8080
      });
      expect(config.get('PORT')).toBe(8080);
      expect(config.get('WORKSPACE_ROOT')).toBe('/test/workspace');
      expect(config.get('NODE_ENV')).toBe('test'); // Vitest sets NODE_ENV=test
    });

    it('should throw validation error on corrupt inputs', () => {
      expect(() => new ConfigService({
        WORKSPACE_ROOT: undefined
      })).toThrow();
    });
  });

  describe('DI Container', () => {
    it('should register and resolve instances and class providers', () => {
      const container = new DIContainer();
      
      const myInstance = { key: 'value' };
      container.registerInstance('myService', myInstance);
      expect(container.resolve('myService')).toBe(myInstance);

      class SampleProvider {
        constructor(public di: DIContainer) {}
      }
      container.register(SampleProvider, SampleProvider);
      const resolved = container.resolve(SampleProvider);
      expect(resolved).toBeInstanceOf(SampleProvider);
      expect(resolved.di).toBe(container);
    });
  });

  describe('Typed Event Bus', () => {
    it('should route events to matched handlers with matching payloads', async () => {
      const bus = new EventBus();
      const pids: number[] = [];

      bus.subscribe('process.started', (event) => {
        pids.push(event.payload.pid);
      });

      bus.publish('process.started', {
        pid: 4501,
        command: 'node',
        env: { PATH: '/usr/bin' }
      });

      expect(pids).toContain(4501);
    });

    it('should support unsubscribing from topics', () => {
      const bus = new EventBus();
      let count = 0;

      const subId = bus.subscribe('process.stdout', () => {
        count++;
      });

      bus.publish('process.stdout', { pid: 1, chunk: 'hello' });
      expect(count).toBe(1);

      bus.unsubscribe(subId);
      bus.publish('process.stdout', { pid: 1, chunk: 'world' });
      expect(count).toBe(1);
    });
  });

  describe('Workspace Domain Model', () => {
    it('should validate correctly formed workspaces', () => {
      const ws = new Workspace('ws-1', '/path/to/project', 'my-project');
      expect(ws.status).toBe(WorkspaceStatus.UNINDEXED);
      expect(ws.validate()).toBe(true);
    });

    it('should reject invalid workspaces', () => {
      const ws = new Workspace('', '', '');
      expect(ws.validate()).toBe(false);
    });
  });
});
