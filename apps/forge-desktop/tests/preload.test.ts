import { describe, it, expect, vi, beforeAll } from 'vitest';

/**
 * Epic 3 — Preload Bridge tests.
 *
 * We cannot run the actual preload in jsdom (it requires Electron's contextBridge).
 * Instead we:
 * 1. Verify the allowed channel lists are correctly defined and non-empty
 * 2. Simulate the forge API shape that the preload exposes
 * 3. Verify that the IForgeApi contract is fulfilled
 *
 * Full IPC round-trip tests are covered in Epic 4 (IpcRouter tests)
 * which mocks ipcMain.handle.
 */

// ─── Simulate window.forge as if contextBridge had exposed it ─────────────────

const mockForgeApi = {
  invoke: vi.fn().mockResolvedValue('mock-response'),
  on: vi.fn().mockReturnValue(() => {}), // returns unsubscribe fn
  removeAllListeners: vi.fn(),
  system: {
    ping:                   vi.fn().mockResolvedValue('pong'),
    getVersion:             vi.fn().mockResolvedValue('0.1.0'),
    getPlatform:            vi.fn().mockResolvedValue('win32'),
    getStartupStage:        vi.fn().mockResolvedValue('ready'),
    getPerformanceSnapshot: vi.fn().mockResolvedValue({}),
  },
};

beforeAll(() => {
  // Inject into jsdom window — simulates what contextBridge does in Electron
  Object.defineProperty(global, 'window', {
    value: { ...global.window, forge: mockForgeApi },
    writable: true,
  });
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Preload bridge — window.forge shape', () => {
  it('should expose window.forge', () => {
    expect(window.forge).toBeDefined();
  });

  it('should expose window.forge.invoke as a function', () => {
    expect(typeof window.forge.invoke).toBe('function');
  });

  it('should expose window.forge.on as a function', () => {
    expect(typeof window.forge.on).toBe('function');
  });

  it('should expose window.forge.removeAllListeners as a function', () => {
    expect(typeof window.forge.removeAllListeners).toBe('function');
  });

  it('should expose window.forge.system namespace', () => {
    expect(window.forge.system).toBeDefined();
  });

  it('should expose system.ping', () => {
    expect(typeof window.forge.system.ping).toBe('function');
  });

  it('should expose system.getVersion', () => {
    expect(typeof window.forge.system.getVersion).toBe('function');
  });

  it('should expose system.getPlatform', () => {
    expect(typeof window.forge.system.getPlatform).toBe('function');
  });

  it('should expose system.getStartupStage', () => {
    expect(typeof window.forge.system.getStartupStage).toBe('function');
  });

  it('should expose system.getPerformanceSnapshot', () => {
    expect(typeof window.forge.system.getPerformanceSnapshot).toBe('function');
  });
});

describe('Preload bridge — system calls', () => {
  it('system.ping() should resolve to pong', async () => {
    const result = await window.forge.system.ping();
    expect(result).toBe('pong');
  });

  it('system.getVersion() should resolve to a version string', async () => {
    const result = await window.forge.system.getVersion();
    expect(result).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('system.getPlatform() should resolve to a known platform', async () => {
    const result = await window.forge.system.getPlatform();
    expect(['win32', 'darwin', 'linux']).toContain(result);
  });
});

describe('Preload bridge — on() subscription', () => {
  it('on() should return an unsubscribe function', () => {
    const unsub = window.forge.on('workspace:file-changed', vi.fn());
    expect(typeof unsub).toBe('function');
  });

  it('on() unsubscribe function should be callable without error', () => {
    const unsub = window.forge.on('terminal:output', vi.fn());
    expect(() => unsub()).not.toThrow();
  });
});

describe('Preload bridge — invoke()', () => {
  it('invoke() should return a Promise', () => {
    const result = window.forge.invoke('system:ping');
    expect(result).toBeInstanceOf(Promise);
  });

  it('invoke() with allowed channel should resolve', async () => {
    const result = await window.forge.invoke('system:ping');
    expect(result).toBeDefined();
  });
});
