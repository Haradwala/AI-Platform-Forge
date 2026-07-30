import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RuntimeManager } from '../electron/main/ai/runtime/runtime-manager';
import type { IAiRuntime, RuntimeHealth } from '../electron/main/ai/runtime/runtime-types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRuntime(
  id: string,
  overrides: Partial<IAiRuntime> = {}
): IAiRuntime {
  return {
    id,
    name: `${id} runtime`,
    runtimeType: 'local',
    listAvailableModels: vi.fn().mockResolvedValue([`${id}-model-v1`]),
    generateStream: vi.fn().mockResolvedValue({}),
    healthCheck: vi.fn().mockResolvedValue({ healthy: true, latencyMs: 5 }),
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('RuntimeManager', () => {
  let manager: RuntimeManager;

  beforeEach(() => {
    manager = new RuntimeManager();
  });

  // ─── register / getById / getAll ──────────────────────────────────────────

  describe('IRuntimeRegistry surface (backward compat)', () => {
    it('registers a runtime and retrieves it by id', () => {
      const rt = makeRuntime('mock');
      manager.register(rt);
      expect(manager.getById('mock')).toBe(rt);
    });

    it('returns null for an unregistered id', () => {
      expect(manager.getById('unknown')).toBeNull();
    });

    it('returns all registered runtimes via getAll()', () => {
      const a = makeRuntime('mock');
      const b = makeRuntime('ollama');
      manager.register(a);
      manager.register(b);
      expect(manager.getAll()).toEqual([a, b]);
    });

    it('overwrites a registration with the same id', () => {
      const v1 = makeRuntime('mock');
      const v2 = makeRuntime('mock');
      manager.register(v1);
      manager.register(v2);
      expect(manager.getById('mock')).toBe(v2);
    });
  });

  // ─── activate / active ────────────────────────────────────────────────────

  describe('activate() / active()', () => {
    it('first registered runtime becomes the default active', () => {
      const mock = makeRuntime('mock');
      manager.register(mock);
      manager.register(makeRuntime('ollama'));
      expect(manager.active()).toBe(mock);
    });

    it('activate() switches the active runtime', () => {
      const mock = makeRuntime('mock');
      const ollama = makeRuntime('ollama');
      manager.register(mock);
      manager.register(ollama);
      manager.activate('ollama');
      expect(manager.active()).toBe(ollama);
    });

    it('activate() throws for an unregistered id', () => {
      expect(() => manager.activate('nonexistent')).toThrow('[RuntimeManager]');
    });

    it('active() throws when no runtimes are registered', () => {
      expect(() => manager.active()).toThrow('[RuntimeManager]');
    });

    it('activate() calls optional initialize() hook if present', async () => {
      const init = vi.fn().mockResolvedValue(undefined);
      const rt = makeRuntime('mock', { initialize: init });
      manager.register(rt);
      manager.activate('mock');
      // initialize is called asynchronously — flush microtasks
      await new Promise((r) => setTimeout(r, 0));
      expect(init).toHaveBeenCalledOnce();
    });

    it('activate() does not throw if initialize() rejects', async () => {
      const rt = makeRuntime('failing', {
        initialize: vi.fn().mockRejectedValue(new Error('boot error')),
      });
      manager.register(rt);
      expect(() => manager.activate('failing')).not.toThrow();
      await new Promise((r) => setTimeout(r, 0)); // flush rejection
    });
  });

  // ─── discover ─────────────────────────────────────────────────────────────

  describe('discover()', () => {
    it('calls listAvailableModels() on all local runtimes', async () => {
      const local = makeRuntime('ollama', { runtimeType: 'local' });
      const cloud = makeRuntime('openai', { runtimeType: 'cloud' });
      manager.register(local);
      manager.register(cloud);
      await manager.discover();
      expect(local.listAvailableModels).toHaveBeenCalledOnce();
      expect(cloud.listAvailableModels).not.toHaveBeenCalled();
    });

    it('does not throw when listAvailableModels() rejects', async () => {
      const rt = makeRuntime('broken', {
        listAvailableModels: vi.fn().mockRejectedValue(new Error('offline')),
      });
      manager.register(rt);
      await expect(manager.discover()).resolves.toBeUndefined();
    });
  });

  // ─── health ───────────────────────────────────────────────────────────────

  describe('health()', () => {
    it('returns a health map keyed by runtime id', async () => {
      const mock = makeRuntime('mock');
      const ollama = makeRuntime('ollama', {
        healthCheck: vi.fn().mockResolvedValue({ healthy: true, latencyMs: 12 }),
      });
      manager.register(mock);
      manager.register(ollama);

      const result = await manager.health();

      expect(result['mock']).toEqual({ healthy: true, latencyMs: 5 });
      expect(result['ollama']).toEqual({ healthy: true, latencyMs: 12 });
    });

    it('captures errors from healthCheck() as unhealthy entries', async () => {
      const rt = makeRuntime('broken', {
        healthCheck: vi.fn().mockRejectedValue(new Error('connection refused')),
      });
      manager.register(rt);

      const result = await manager.health();

      expect(result['broken'].healthy).toBe(false);
      expect(result['broken'].error).toContain('connection refused');
    });
  });

  // ─── list ─────────────────────────────────────────────────────────────────

  describe('list()', () => {
    it('returns lightweight metadata for all runtimes', () => {
      manager.register(makeRuntime('mock'));
      manager.register(makeRuntime('ollama', { runtimeType: 'local' as const }));

      const entries = manager.list();

      expect(entries).toEqual([
        { id: 'mock', name: 'mock runtime', runtimeType: 'local' },
        { id: 'ollama', name: 'ollama runtime', runtimeType: 'local' },
      ]);
    });

    it('returns empty array when no runtimes are registered', () => {
      expect(manager.list()).toEqual([]);
    });
  });

  // ─── Backward compat: satisfies IProviderRegistry ─────────────────────────

  describe('IProviderRegistry compat', () => {
    it('register / getById / getAll satisfy the IProviderRegistry contract', () => {
      const rt = makeRuntime('mock');
      manager.register(rt);
      // IProviderRegistry.getById returns IAiProvider | null — IAiRuntime satisfies IAiProvider
      const found = manager.getById('mock');
      expect(found?.id).toBe('mock');
      expect(found?.name).toBe('mock runtime');
      expect(manager.getAll().length).toBe(1);
    });
  });
});
